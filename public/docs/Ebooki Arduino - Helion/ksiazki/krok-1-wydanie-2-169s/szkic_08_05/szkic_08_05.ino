// szkic 08.05.

#include <avr/eeprom.h>

const int maxPasswordSize = 20;

char password[maxPasswordSize];

void setup() 
{
  eeprom_read_block(&password, 0, maxPasswordSize);
  Serial.begin(9600);
}

void loop() 
{
  Serial.print("Obecne hasło:");
  Serial.println(password);
  Serial.println("Podaj nowe hasło");     
  while (!Serial.available()) {};
  int n = Serial.readBytesUntil('\n', password, maxPasswordSize);
  password[n] = '\0';
  eeprom_write_block(password, 0, maxPasswordSize);  
  Serial.print("Zapisano hasło: ");
  Serial.println(password);
}

