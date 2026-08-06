# 🖥️ ESLENDER DESK HUB // Core Telemetry & Operations

An end-to-end, real-time IoT telemetry system and operations dashboard powered by an **ESP32 microcontroller**, **Mosquitto MQTT**, a custom **Node.js/TypeScript API Gateway**, and a **Next.js/React Dashboard**.

---

## 🛠️ System Architecture

[ESP32 Hardware]  --(MQTT Port 1883)-->  [Eclipse Mosquitto]
                                                |
                                          (MQTT Bridge)
                                                v
[Next.js Dashboard] <--(WebSockets 8081)--> [hub_api Gateway]

1. **ESP32 Firmware:** Captures hardware events (e.g., desk presence) and publishes JSON payloads over 2.4GHz Wi-Fi to the MQTT broker.
2. **Mosquitto Broker:** Routes low-latency MQTT topics (`home/desk/+`) within the local Docker bridge network.
3. **hub_api Service:** Subscribes to Mosquitto, collects host Raspberry Pi hardware telemetry (CPU temp, RAM, load), and broadcasts live state via WebSockets.
4. **React Dashboard:** Real-time UI displaying presence indicators, system metrics, and live log feeds without page reloads.

---

## 🚀 Key Features

* **Real-time Desk Presence Tracking:** Instant status updates (`OCCUPIED` vs `VACANT`).
* **Pi 5 Host Telemetry:** Live monitoring of CPU temperature, memory usage, and uptime.
* **Bi-directional WebSocket Pipeline:** Ultra-low latency event streaming from hardware to web client.
* **Integrated Console Log Terminal:** Live stream of incoming `MQTT`, `WS`, and `SYSTEM` event payloads.
* **Quick Simulation Controls:** Test UI state changes directly from the dashboard terminal.

---

## 🧰 Tech Stack

* **Firmware:** ESP32, C++ / Arduino Framework, PlatformIO
* **Broker & Backend:** Eclipse Mosquitto, Node.js, TypeScript, `ws`, `mqtt`
* **Infrastructure:** Docker, Docker Compose
* **Frontend:** Next.js 14, React, WebSockets (`wss://`)

---

## ⚡ Getting Started

### 1. Prerequisites
* PlatformIO IDE (VS Code Extension)
* Docker & Docker Compose on your server / Raspberry Pi
* Node.js v18+

---

### 2. Infrastructure Setup (Docker)

Clone the repository and spin up the Mosquitto broker and `hub_api` container:
```bash
git clone https://github.com/EslenderCV/desk-hub.git
cd desk-hub
docker compose up -d --build
```

Ensure `mosquitto/config/mosquitto.conf` contains:


listener 1883 0.0.0.0
allow_anonymous true

---

### 3. Flash ESP32 Firmware

1. Open the `desk_hub_esp32` directory in VS Code with PlatformIO.
2. Update Wi-Fi and MQTT configurations in `src/main.cpp`:

```cpp
const char* WIFI_SSID     = "YOUR_2.4GHZ_WIFI";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* MQTT_SERVER   = "192.168.x.x";
const int   MQTT_PORT     = 1883;
```
3. Build and flash the firmware via PlatformIO CLI:
```bash
pio run --target upload
pio device monitor -b 115200
```
---

### 4. Running the Dashboard

```bash

cd dashboard
npm install
npm run dev

```

Open `http://localhost:3000` (or `https://eslender.dev/dashboard`) to view the live core operations feed.

---

## 📡 MQTT Topic Protocol

| Topic | Publisher | Payload Example | Description |
| :--- | :--- | :--- | :--- |
| `home/desk/telemetry` | ESP32 | `{"event":"desk_presence","status":"active"}` | Hardware sensor state |
| `home/desk/state` | `hub_api` | `occupied` / `vacant` | Processed desk state |

---

## 📄 License

Distributed under the MIT License.
