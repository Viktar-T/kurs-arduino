# Język Arduino — podstawowa biblioteka

## `Arduino.h` — podstawowa biblioteka Arduino

To jest biblioteka **wbudowana w Arduino IDE** — nie trzeba jej instalować ani importować ręcznie. Każdy szkic automatycznie ją używa.

Zawiera wszystkie podstawowe funkcje które już znasz:

| Kategoria | Funkcje |
|---|---|
| Cyfrowe I/O | `pinMode()`, `digitalWrite()`, `digitalRead()` |
| Analogowe | `analogRead()`, `analogWrite()` |
| Czas | `delay()`, `millis()`, `micros()`, `delayMicroseconds()` |
| Komunikacja | `Serial.begin()`, `Serial.print()`, `Serial.read()` |
| Matematyka | `map()`, `constrain()`, `abs()`, `min()`, `max()` |
| Losowe | `random()`, `randomSeed()` |
| Przerwania | `attachInterrupt()`, `detachInterrupt()` |
| PWM/Serwo | `analogWrite()`, `tone()`, `noTone()` |

---

## Gdzie znaleźć dokumentację

Oficjalna dokumentacja wszystkich funkcji:

- **[docs.arduino.cc/language-reference](https://docs.arduino.cc/language-reference/)**
- **[arduino.cc/reference/en](https://www.arduino.cc/reference/en/)**

To jest "biblia" Arduino — każda funkcja z opisem, parametrami i przykładem kodu. Warto pokazać uczniom na pierwszych zajęciach.
