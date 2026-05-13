// szkic 10.03. Prosty serwer uruchomiony na płytce Node MCU

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

const char* ssid = "nazwa-mojej-sieci";
const char* password = "moje-hasło";

ESP8266WebServer server(80);

void handleRoot()
{
  String message = "<html><body>\n";
  message += "<h1>Serwer Arduino</h1>\n";
  message += "<p>A0="; 
  message += analogRead(A0); 
  message += "</p>"; 
  message += "<p>millis="; 
  message += millis(); 
  message += "</p>"; 
  message += "</html></body>\n";
  server.send(200, "text/html", message);
}

void connectToWiFi()
{
  Serial.print("\n\nPodłączanie do ");
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

void setup()
{
  Serial.begin(115200);
  connectToWiFi();

  server.on("/", handleRoot);

  server.begin();
  Serial.println("Uruchomiono serwer HTTP");
}

void loop()
{
  server.handleClient();
}



