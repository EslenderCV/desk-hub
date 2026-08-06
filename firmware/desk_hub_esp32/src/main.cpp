#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Network Settings
const char* WIFI_SSID     = "MONARCA";
const char* WIFI_PASSWORD = "REYNA1616"; // Update password if needed

// Local Pi IP Address
const char* MQTT_SERVER   = "192.168.1.38";
const int   MQTT_PORT     = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsgTime = 0;
bool simulatedPresence = false;

void setupWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected! IP: " + WiFi.localIP().toString());
}

void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Connecting to Mosquitto...");
    String clientId = "ESP32_Desk_Sim_" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("Connected!");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 5s...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setupWiFi();
  client.setServer(MQTT_SERVER, MQTT_PORT);
}

void loop() {
  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsgTime > 10000) {
    lastMsgTime = now;
    simulatedPresence = !simulatedPresence;

    StaticJsonDocument<200> doc;
    doc["event"] = "desk_presence";
    doc["status"] = simulatedPresence ? "active" : "inactive";
    doc["device_id"] = "esp32_mac_usb";

    char buffer[256];
    serializeJson(doc, buffer);

    client.publish("home/desk/telemetry", buffer);
    Serial.printf("Sent simulated event: %s\n", buffer);
  }
}