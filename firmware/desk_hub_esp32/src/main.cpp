#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoWebsockets.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <driver/i2s.h>
#include <time.h>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"

// --- Configuration ---
const char* ssid = "MONARCA";
const char* password = "REYNA1616";
const char* mqtt_server = "192.168.1.11"; // Your Pi's local IP

// --- Hardware Pins ---
#define I2S_WS 25
#define I2S_SD 32
#define I2S_SCK 14
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// --- Globals ---
WiFiClient espClient;
PubSubClient mqtt(espClient);
using namespace websockets;
WebsocketsClient wsClient;
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// --- FreeRTOS Task Handles ---
TaskHandle_t AudioTask;
TaskHandle_t UITask;

// --- Function Declarations ---
void setup_wifi();
void audioCommsLoop(void * pvParameters);
void uiSensorLoop(void * pvParameters);

// ==========================================
// SETUP
// ==========================================
void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);

  Serial.begin(115200);
  
  // 1. Initialize Display
  Wire.begin(21, 22);
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("SSD1306 allocation failed");
  }
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setCursor(0, 10);
  display.println("Booting JARVIS...");
  display.display();

  // 2. Initialize WiFi
  setup_wifi();
  
  // // 3. Configure I2S Microphone (INMP441)
  // i2s_config_t i2s_config = {
  //   .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
  //   .sample_rate = 16000,
  //   .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
  //   .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
  //   .communication_format = i2s_comm_format_t(I2S_COMM_FORMAT_I2S | I2S_COMM_FORMAT_I2S_MSB),
  //   .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
  //   .dma_buf_count = 8,
  //   .dma_buf_len = 512,
  //   .use_apll = false
  // };
  
  // i2s_pin_config_t pin_config = {
  //   .bck_io_num = I2S_SCK,
  //   .ws_io_num = I2S_WS,
  //   .data_out_num = I2S_PIN_NO_CHANGE,
  //   .data_in_num = I2S_SD
  // };
  
  // i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL);
  // i2s_set_pin(I2S_NUM_0, &pin_config);

  // 4. Pin Tasks to Cores
  xTaskCreatePinnedToCore(audioCommsLoop, "AudioTask", 49152, NULL, 1, &AudioTask, 0);
  xTaskCreatePinnedToCore(uiSensorLoop, "UITask", 10000, NULL, 1, &UITask, 1);
}

void loop() {
  vTaskDelete(NULL); // Main loop dies here, FreeRTOS takes over
}

// ==========================================
// CORE 0: Audio & WebSockets
// ==========================================
void audioCommsLoop(void * pvParameters) {
  wsClient.setInsecure(); 

  Serial.println("Connecting to hub.eslender.dev over secure WebSocket...");
  Serial.printf("Largest free block: %u\n", heap_caps_get_largest_free_block(MALLOC_CAP_8BIT));

  // Connect directly using the domain name (restores SNI for Cloudflare)
  bool connected = wsClient.connect("hub.eslender.dev", 443, "/ws");
  
  if (connected) {
    Serial.println("Connected to Hub API WebSockets over public internet!");
  } else {
    Serial.println("WebSocket handshake failed!");
  }

  for(;;) {
    if (wsClient.available()) {
      wsClient.poll();
      
      size_t bytesIn = 0;
      int16_t sBuffer[512];
      esp_err_t result = i2s_read(I2S_NUM_0, &sBuffer, sizeof(sBuffer), &bytesIn, portMAX_DELAY);
      
      if (result == ESP_OK && bytesIn > 0) {
        wsClient.sendBinary((const char*)sBuffer, bytesIn);
      }
    } else {
      wsClient.close();                       // release the previous socket/TLS ctx first
      Serial.printf("Free heap before reconnect: %u\n", ESP.getFreeHeap());

      if (ESP.getFreeHeap() < 60000) {         // don't even attempt a TLS handshake if heap is too low
          Serial.println("Heap too low, skipping reconnect this cycle");
      } else if (wsClient.connect("hub.eslender.dev", 443, "/ws")) {
          Serial.println("Reconnected to WebSockets!");
      } else {
          Serial.println("Reconnect attempt failed");
      }
      vTaskDelay(3000 / portTICK_PERIOD_MS);   // add jitter/backoff in production
    }
    
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

// ==========================================
// CORE 1: UI & Sensors
// ==========================================
void uiSensorLoop(void * pvParameters) {
  // mqtt.setServer(mqtt_server, 1883);

  for(;;) {
    // if (!mqtt.connected()) {
    //   if (mqtt.connect("ESP32_Sentry")) {
    //     mqtt.publish("desk/status", "online");
    //   }
    // }
    // mqtt.loop();

    display.clearDisplay();
    display.setCursor(0, 10);
    display.println("JARVIS Sentry");
    if(WiFi.status() == WL_CONNECTED) {
      display.println("WiFi: OK");
    }
    display.println("Listening...");
    display.display();

    // mqtt.publish("desk/sensors", "{\"vacant\": false}");
    
    vTaskDelay(5000 / portTICK_PERIOD_MS);
  }
}

// ==========================================
// HELPER: WiFi Setup
// ==========================================
void setup_wifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("RSSI: "); Serial.println(WiFi.RSSI());
  // --- Let DHCP fully settle before touching routing/DNS config ---
  delay(200);

  Serial.print("Local IP: "); Serial.println(WiFi.localIP());
  Serial.print("Gateway: ");  Serial.println(WiFi.gatewayIP());
  Serial.print("Subnet: ");   Serial.println(WiFi.subnetMask());

  IPAddress gw = WiFi.gatewayIP();
  if (gw == IPAddress(0, 0, 0, 0)) {
    Serial.println("Gateway not ready yet, skipping DNS override this boot");
  } else {
    IPAddress dns1(1, 1, 1, 1);   // Cloudflare
    IPAddress dns2(8, 8, 8, 8);   // Google fallback
    WiFi.config(WiFi.localIP(), gw, WiFi.subnetMask(), dns1, dns2);
    Serial.print("DNS server in use: ");
    Serial.println(WiFi.dnsIP());
  }

  // --- Confirm hostname resolution actually works before touching WebSockets ---
  IPAddress resolvedIP;
  if (WiFi.hostByName("hub.eslender.dev", resolvedIP)) {
    Serial.print("Resolved hub.eslender.dev -> ");
    Serial.println(resolvedIP);
  } else {
    Serial.println("DNS resolution still failing!");
  }

  // --- NTP Time Sync to satisfy Cloudflare SSL ---
  Serial.print("Syncing time with NTP");
  configTime(-14400, 0, "pool.ntp.org", "time.nist.gov");

  while (time(nullptr) < 1000000000l) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nTime Synced! SSL is now safe to use.");
}