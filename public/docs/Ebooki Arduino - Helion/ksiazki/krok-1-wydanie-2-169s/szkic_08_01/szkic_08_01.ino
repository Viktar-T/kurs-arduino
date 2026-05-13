// szkic 08.01.

const int ledPin = 13;
const int dotDelay = 200;

const int maxLen = 6; // łącznei z końcowynm znakiem null

PROGMEM const char letters[26][maxLen] = {
  ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..",    // A-I
  ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.",  // J-R
  "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--.."          // S-Z
};


PROGMEM const char numbers[10][maxLen] = {
  "-----", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----."
};

void setup()                 
{
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop()                    
{
  char ch;
  char sequence[maxLen];
  if (Serial.available() > 0)
  {
    ch = Serial.read();
    if (ch >= 'a' && ch <= 'z')
    {
      memcpy_P(&sequence, letters[ch - 'a'], maxLen);
      flashSequence(sequence);
    }
    else if (ch >= 'A' && ch <= 'Z')
    {
      memcpy_P(&sequence, letters[ch - 'A'], maxLen);
      flashSequence(sequence);
    }
    else if (ch >= '0' && ch <= '9')
    {
      memcpy_P(&sequence, numbers[ch - '0'], maxLen);
      flashSequence(sequence);
    }
    else if (ch == ' ')
    {
      delay(dotDelay * 4);  // odstęp pomiędzy wyrazami 
  }
}

void flashSequence(char* sequence)
{
  int i = 0;
  while (sequence[i] != NULL)
  {
    flashDotOrDash(sequence[i]);
    i++;
  }
  delay(dotDelay * 3);    // odstęp pomiędzy literami
}

void flashDotOrDash(char dotOrDash)
{
  digitalWrite(ledPin, HIGH);
  if (dotOrDash == '.')
  {
    delay(dotDelay);           
  }
  else // jeżeli nie jest kropką, to musi być kreską
  {
    delay(dotDelay * 3);           
  }
  digitalWrite(ledPin, LOW);    
  delay(dotDelay); // odstęp pomiędzy błyskami
}



