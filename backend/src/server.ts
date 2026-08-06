import { WebSocketServer, WebSocket } from 'ws';
import * as mqtt from 'mqtt';
import * as dotenv from 'dotenv';
import * as os from 'os';
import * as fs from 'fs';

dotenv.config();

const WS_PORT = parseInt(process.env.WS_PORT || '8080', 10);
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://mqtt_broker:1883';

console.log(`Connecting to MQTT broker at: ${MQTT_BROKER_URL}`);
const mqttClient = mqtt.connect(MQTT_BROKER_URL, {
    reconnectPeriod: 3000,
});

mqttClient.on('connect', () => {
    broadcastLog('SYSTEM', `MQTT connected & subscribed to home/desk/+`);
    mqttClient.subscribe('home/desk/+', {}, (err) => {
        if (err) {
            broadcastLog('SYSTEM', `MQTT Subscription error: ${err.message}`);
        }
    });
});

mqttClient.on('error', (err) => {
    broadcastLog('SYSTEM', `MQTT Client Error: ${err.message}`);
});

mqttClient.on('message', (topic: string, message: Buffer) => {
    const rawMsg = message.toString();
    broadcastLog('MQTT', `[${topic}]: ${rawMsg}`);

    try {
        const payload = JSON.parse(rawMsg);

        // Forward structured desk hardware event to all WebSocket clients
        const wsPayload = JSON.stringify({
            type: 'DESK_EVENT',
            timestamp: new Date().toISOString(),
            topic: topic,
            data: payload
        });

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(wsPayload);
            }
        });
    } catch {
        // Raw string message fallback
    }
});

const wss = new WebSocketServer({ port: WS_PORT });

console.log(`Smart Desk Core: WebSocket pipeline listening on port ${WS_PORT}`);

// Helper to extract CPU temperature on Raspberry Pi / Linux
function getCpuTemperature(): number {
    try {
        const rawTemp = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp', 'utf8');
        return Math.round(parseInt(rawTemp.trim(), 10) / 1000);
    } catch {
        return 0; // Fallback if non-Linux environment
    }
}

// Compute host telemetry metrics
function getSystemTelemetry() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const ramUsagePct = Math.round(((totalMem - freeMem) / totalMem) * 100);

    const loadAvg = os.loadavg()[0]; // 1-min load average
    const cpuCount = os.cpus().length || 1;
    const cpuUsagePct = Math.min(Math.round((loadAvg / cpuCount) * 100), 100);

    return {
        cpuTemp: getCpuTemperature(),
        cpuUsage: cpuUsagePct,
        ramUsage: ramUsagePct,
        totalRamGb: (totalMem / (1024 ** 3)).toFixed(1),
        usedRamGb: ((totalMem - freeMem) / (1024 ** 3)).toFixed(1),
        uptimeSec: Math.floor(os.uptime()),
    };
}

// Broadcast telemetry to UI every 2 seconds
setInterval(() => {
    const telemetry = getSystemTelemetry();
    const payload = JSON.stringify({
        type: 'SYSTEM_TELEMETRY',
        timestamp: new Date().toISOString(),
        data: telemetry
    });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}, 2000);

function broadcastLog(type: 'MQTT' | 'WS' | 'SYSTEM' | 'AUDIO', message: string, payload?: object) {
    const logEvent = JSON.stringify({
        type: 'HUB_LOG',
        timestamp: new Date().toISOString(),
        source: type,
        message,
        payload
    });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(logEvent);
        }
    });
}

wss.on('connection', (ws: WebSocket) => {
    broadcastLog('SYSTEM', 'Hardware Node / Client Connected via WebSocket');

    ws.on('message', (data: Buffer, isBinary: boolean) => {
        if (isBinary) {
            broadcastLog('AUDIO', `Received raw PCM chunk: ${data.length} bytes`);
        } else {
            handleTextCommand(data.toString(), ws);
        }
    });

    ws.on('close', () => {
        broadcastLog('SYSTEM', 'Hardware Node / Client Disconnected');
    });

    ws.on('error', (error: Error) => {
        broadcastLog('SYSTEM', `Socket error: ${error.message}`);
    });
});

function handleTextCommand(commandStr: string, ws: WebSocket) {
    try {
        const payload = JSON.parse(commandStr);
        broadcastLog('WS', `Received payload: ${JSON.stringify(payload)}`, payload);

        if (payload.event === 'desk_presence') {
            const newState = payload.status === 'active' ? 'occupied' : 'vacant';
            mqttClient.publish('home/desk/state', newState);
            broadcastLog('MQTT', `Published to home/desk/state -> ${newState}`);
        }
    } catch {
        broadcastLog('WS', `Raw command received: ${commandStr}`);
    }
}