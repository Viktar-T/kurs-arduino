// szkic 05.04.
char message[] = "Witaj";

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(message);
  delay(1000);
}


