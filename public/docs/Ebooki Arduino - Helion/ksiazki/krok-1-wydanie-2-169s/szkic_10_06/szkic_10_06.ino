// szkic 10.06.
#include <ESP8266WiFi.h>

const char* ssid = "nazwa-mojej-sieci";
const char* password = "moje-hasło";
const char* key = "c1AsQq_qsQVTSO5-6NASqg";
const char* host = "maker.ifttt.com";
const int httpPort = 80;
const long sendPeriod = 10000L; // 1 minuta

WiFiClient client;

void connectToWiFi()
{
  Serial.print("\n\nŁączenie z siecią");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nPołączono z siecią bezprzewodową");  
  Serial.print("Adres IP: ");
  Serial.println(WiFi.localIP());
}

void sendToIFTTT(int reading)
{
  Serial.print("Łączenie z ");
  Serial.println(host);

  if (!client.connect(host, httpPort)) {
    Serial.println("Błąd połączenia");
    return;
  }
  
  String url = "/trigger/arduino_spoke/with/key/";
  url += key;
  url += "?value1=" + String(reading);

  String req = String("GET ") + url + " HTTP/1.1\r\n" +  
               "Host: " + host + "\r\n" +
               "Connection: close\r\n\r\n";
  Serial.println(req);
  client.print(req);
}

void setup() 
{
  Serial.begin(115200);
  connectToWiFi();
}

void loop() 
{
  static long lastReadingTime = 0;
  long now = millis();
  if (now > lastReadingTime + sendPeriod)
  {
    int reading = analogRead(A0);
    sendToIFTTT(reading);
    lastReadingTime = now;
  }
  if (client.available())
  {
    Serial.write(client.read());
  }
}

