import { WebSocketServer, WebSocket } from 'ws';
import * as mqtt from 'mqtt';
import * as dotenv from 'dotenv';

dotenv.config();

const WS_PORT = parseInt(process.env.WS_PORT || '8080', 10);
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';

const mqttClient = mqtt.connect(MQTT_BROKER_URL);

mqttClient.on('connect', () => {
    mqttClient.subscribe('home/desk/+', {}, (err) => {
        if (!err) {
            broadcastLog('SYSTEM', `MQTT connected & subscribed to home/desk/+`);
        }
    });
});

mqttClient.on('message', (topic: string, message: Buffer) => {
    broadcastLog('MQTT', `[${topic}]: ${message.toString()}`);
});

const wss = new WebSocketServer({ port: WS_PORT });

console.log(`Smart Desk Core: WebSocket pipeline listening on port ${WS_PORT}`);

// Helper to send typed events/logs to ALL connected WebSocket clients
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
            handleBinaryAudioStream(data);
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

function handleBinaryAudioStream(buffer: Buffer) {
    broadcastLog('AUDIO', `Received raw PCM chunk: ${buffer.length} bytes`);
}

function handleTextCommand(commandStr: string, ws: WebSocket) {
    try {
        const payload = JSON.parse(commandStr);
        broadcastLog('WS', `Received payload: ${JSON.stringify(payload)}`, payload);

        if (payload.event === 'desk_presence') {
            const newState = payload.status === 'active' ? 'occupied' : 'vacant';
            mqttClient.publish('home/desk/state', newState);
            broadcastLog('MQTT', `Published to home/desk/state -> ${newState}`);
        }
    } catch (e) {
        broadcastLog('WS', `Raw command received: ${commandStr}`);
    }
}