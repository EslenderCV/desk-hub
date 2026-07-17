import { WebSocketServer, WebSocket } from 'ws';
import * as mqtt from 'mqtt';
import * as dotenv from 'dotenv';

dotenv.config();

const WS_PORT = parseInt(process.env.WS_PORT || '8080', 10);
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';

// 1. MQTT Client Initialization
const mqttClient = mqtt.connect(MQTT_BROKER_URL);

mqttClient.on('connect', () => {
    // Explicitly pass an empty options object to match the second parameter overload
    mqttClient.subscribe('home/desk/+', {}, (err: Error | null) => {
        if (!err) {
            console.log(`MQTT: Subscribed to telemetry topics at ${MQTT_BROKER_URL}`);
        }
    });
});

mqttClient.on('message', (topic: string, message: Buffer) => {
    console.log(`MQTT Ingestion [${topic}]: ${message.toString()}`);
});

// 2. WebSocket Server Initialization
const wss = new WebSocketServer({ port: WS_PORT });

console.log(`Smart Desk Core: WebSocket pipeline listening on port ${WS_PORT}`);

wss.on('connection', (ws: WebSocket) => {
    console.log('Hardware Node Connected via WebSocket');

    ws.on('message', (data: Buffer, isBinary: boolean) => {
        if (isBinary) {
            handleBinaryAudioStream(data);
        } else {
            handleTextCommand(data.toString(), ws);
        }
    });

    ws.on('close', () => {
        console.log('Hardware Node Disconnected');
    });

    // Explicitly type the error parameter to satisfy strict null/any checks
    ws.on('error', (error: Error) => {
        console.error(`Socket error: ${error.message}`);
    });
});

function handleBinaryAudioStream(buffer: Buffer) {
    console.log(`Received audio binary chunk: ${buffer.length} bytes`);
}

function handleTextCommand(commandStr: string, ws: WebSocket) {
    try {
        const payload = JSON.parse(commandStr);
        console.log('Received structural payload:', payload);
        
        if (payload.event === 'desk_presence' && payload.status === 'active') {
            mqttClient.publish('home/desk/state', 'occupied');
        }
    } catch (e) {
        console.log(`Raw text payload received: ${commandStr}`);
    }
}