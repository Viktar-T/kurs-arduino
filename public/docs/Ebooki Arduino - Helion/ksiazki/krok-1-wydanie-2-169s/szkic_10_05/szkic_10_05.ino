// szkic 10.05. Usługa IFTTT
#include <SPI.h>
#include <Ethernet.h>


// Adres MAC musi być unikalny.  Poniższy numer nie powinien powodować konfliktów.
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

const char* key = "c1AsQq_qsQVTSO5-6NASqg";
const char* host = "maker.ifttt.com";
const int httpPort = 80;
const long sendPeriod = 60000L; // 1 minuta

EthernetClient client;

void setup()
{
  Serial.begin(9600);
  Ethernet.begin(mac);
}

void sendToIFTTT(int reading)
{
  client.stop(); // w przypadku drugiego wywołania pętli
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


