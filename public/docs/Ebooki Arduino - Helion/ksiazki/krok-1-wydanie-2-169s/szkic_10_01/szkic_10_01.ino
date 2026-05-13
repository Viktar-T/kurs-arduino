// szkic 10.01. DHCP
#include <SPI.h>
#include <Ethernet.h>


// Adres MAC musi być unikalny.  Poniższy numer nie powinien powodować konfliktów.
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

EthernetServer server(80);

void setup()
{
  Serial.begin(9600);
  Ethernet.begin(mac);
  server.begin();
  Serial.print("Adres serwera: ");
  Serial.println(Ethernet.localIP());
}

void loop()
{
  // nasłuchiwanie klienta
  EthernetClient client = server.available();
  if (client) 
  {
    while (client.connected()) 
    {
      // wysyła standardowy nagłówek odpowiedzi http
      client.println("HTTP/1.1 200 OK");
      client.println("Content-Type: text/html");
      client.println();
      
      // send the body
      client.println("<html><body>");
      client.println("<h1>Serwer Arduino</h1>");
      client.print("<p>A0="); 
      client.print(analogRead(0)); 
      client.println("</p>"); 
      client.print("<p>millis="); 
      client.print(millis()); 
      client.println("</p>"); 
      client.println("</body></html>");
      client.stop();
    }
    delay(1);
  }
}


