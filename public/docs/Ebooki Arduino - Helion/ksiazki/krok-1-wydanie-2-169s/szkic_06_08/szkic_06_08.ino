//szkic 06.08.

const int outputPin = 3;

void setup()
{
  pinMode(outputPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Wpisz napięcie w granicach od 0 V do 5 V");
}

void loop()
{
  if (Serial.available() > 0)
  {
      float volts = Serial.parseFloat();
      int pwmValue = volts * 255.0 / 5.0;
      analogWrite(outputPin, pwmValue);

  }
}
