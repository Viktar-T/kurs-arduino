// szkic 10.02 Obsługa pinów płytki Node MCU za pośrednictwem sieci

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

const char* ssid = "nazwa-mojej-sieci";
const char* password = "moje-hasło";

int numPins = 5;
char* pinNames[] = {"D5", "D6", "D7", "D8", "D9"};
int pins[] = {D5, D6, D7, D8, D9};
int pinState[] = {0, 0, 0, 0, 0};

ESP8266WebServer server(80);

void setPinStates()
{
  for (int i = 0; i < numPins; i++)
  {
     digitalWrite(pins[i], pinState[i]);
  }
}

void setValuesFromParams()
{
  for (int i = 0; i < numPins; i++)
  {
    pinState[i] = server.arg(i).toInt();
  }
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

void handleRoot()
{
  char buff[1000];
  Serial.println("Odebrano żądanie");
  setValuesFromParams();
  setPinStates();
  
  strcat(buff, "<html><body>\n");
  strcat(buff, "<h1>Piny wyjścia</h1>\n");
  strcat(buff, "<form method='GET'>\n"); 
  for (int i = 0; i < numPins; i++)
  {
    strcat(buff, "<p>");
    strcat(buff, pinNames[i]);
    strcat(buff, " <select name='");
    char indexStr[10];
    sprintf(indexStr, "%d", i);
    strcat(buff, indexStr);
    strcat(buff, "'><option value='0'");
    if (pinState[i] == 0)
    {
      strcat(buff, " selected");
    }
    strcat(buff, ">Nieaktywny</option>");
    strcat(buff, "<option value='1'");
    if (pinState[i] == 1)
    {
      strcat(buff, " selected");
    }
    strcat(buff, ">Aktywny</option></select></p>\n");
  }
  strcat(buff, "<input type='submit' value='Uaktualnij'/>");
  strcat(buff, "</form></html></body>\n");
  server.send(200, "text/html", buff);
}


void setup()
{
  for (int i = 0; i < numPins; i++)
  {
     pinMode(pins[i], OUTPUT);
  }
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




