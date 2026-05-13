// szkic 08.06.
#include <EEPROM.h>

void setup()                 
{
  Serial.begin(9600);
  Serial.println("EEPROM: wymazywanie");
  for (int i = 0; i <= 1023; i++)
  {
    EEPROM.write(i, 0);
  }
  Serial.println("EEPROM wymazano");
}

void loop()                    
{
}

