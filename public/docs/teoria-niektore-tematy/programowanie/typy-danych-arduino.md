# Typy danych — Arduino

---

## Typy liczbowe całkowite

### `bool`
```cpp
bool aktywny = true;
bool alarm   = false;
```
- Rozmiar: 1 bajt (mimo że logicznie to 1 bit)
- Wartości: `true` (1) lub `false` (0)
- Zastosowanie: flagi, stany włącz/wyłącz

---

### `byte`
```cpp
byte pin = 8;
byte jasnosc = 255;
```
- Rozmiar: 1 bajt
- Zakres: 0 … 255
- Zastosowanie: numery pinów, wartości PWM, adresy I2C
- Odpowiednik C++: `uint8_t`

---

### `int`
```cpp
int temperatura = -20;
int odczyt = analogRead(A0);  // zwraca 0...1023
```
- Rozmiar: **2 bajty** (na Arduino UNO — inaczej niż na PC!)
- Zakres: -32 768 … 32 767
- Zastosowanie: liczniki, odczyty z czujników analogowych
- Uwaga: `analogRead()` zwraca `int` (0–1023) — mieści się w `int`

---

### `unsigned int`
```cpp
unsigned int czas = 60000;
```
- Rozmiar: 2 bajty
- Zakres: 0 … 65 535
- Zastosowanie: gdy potrzebujesz większych wartości dodatnich niż `int`

---

### `long`
```cpp
long czas = millis();  // millis() zwraca long
long dystans = 1000000;
```
- Rozmiar: 4 bajty
- Zakres: -2 147 483 648 … 2 147 483 647
- Zastosowanie: `millis()`, `micros()`, duże liczniki

---

### `unsigned long`
```cpp
unsigned long start = millis();
```
- Rozmiar: 4 bajty
- Zakres: 0 … 4 294 967 295 (~49 dni w milisekundach)
- Zastosowanie: pomiar czasu bez `delay()` — najczęstszy użytek `millis()`

---

## Typy liczbowe zmiennoprzecinkowe

### `float`
```cpp
float temperatura = 23.5;
float napiecie = analogRead(A0) * (5.0 / 1023.0);
```
- Rozmiar: 4 bajty
- Zakres: ±3.4 × 10³⁸, precyzja: ~6–7 cyfr znaczących
- Zastosowanie: temperatura, napięcie, obliczenia wymagające ułamków
- Uwaga: operacje float są **wolne** na Arduino (brak FPU)

---

### `double`
```cpp
double wynik = 3.14159265358979;
```
- Rozmiar: **4 bajty** (na Arduino UNO = identyczny jak `float`!)
- Na Arduino `double` nie daje większej precyzji niż `float`
- Na PC `double` = 8 bajtów (wyższa precyzja)

---

## Typy znakowe i tekstowe

### `char`
```cpp
char litera = 'A';   // wartość: 65 (ASCII)
char znak   = 65;    // to samo co 'A'
```
- Rozmiar: 1 bajt
- Zakres: -128 … 127
- Zastosowanie: pojedynczy znak ASCII

---

### `char[]` — tablica znaków (C-string)
```cpp
char tekst[] = "Witaj";
// w pamięci: ['W','i','t','a','j','\0']
```
- Zakończona `\0` (null terminator)
- Stały rozmiar — deklarowany przy tworzeniu
- Szybsza i bezpieczniejsza pamięciowo niż `String`

---

### `String` — klasa Arduino
```cpp
String wiadomosc = "Temp: ";
wiadomosc += 23.5;
Serial.println(wiadomosc);  // "Temp: 23.5"
```
- Dynamicznie zarządza pamięcią (heap)
- Wygodna w użyciu, ale może fragmentować RAM
- Na małych projektach OK, przy dużych — ostrożnie

---

## Typy o gwarantowanym rozmiarze

Kiedy piszesz kod przenośny lub komunikujesz się ze sprzętem:

```cpp
#include <stdint.h>  // zazwyczaj dołączone automatycznie

int8_t   val = -5;   // zawsze 1 bajt, ze znakiem
uint8_t  val = 200;  // zawsze 1 bajt, bez znaku
int16_t  val = 1000; // zawsze 2 bajty, ze znakiem
uint16_t val = 1000; // zawsze 2 bajty, bez znaku
int32_t  val = 1000; // zawsze 4 bajty, ze znakiem
uint32_t val = 1000; // zawsze 4 bajty, bez znaku
```

---

## Podsumowanie — szybki wybór

| Potrzebuję... | Użyj |
|---|---|
| flaga true/false | `bool` |
| numer pinu, wartość 0–255 | `byte` |
| liczba całkowita, może ujemna | `int` |
| wynik `millis()`, duży licznik | `unsigned long` |
| temperatura, napięcie, ułamki | `float` |
| pojedynczy znak | `char` |
| tekst stały | `char[]` |
| tekst budowany dynamicznie | `String` |

---

## Pamięć na Arduino UNO

| Pamięć | Rozmiar | Przechowuje |
|---|---|---|
| Flash | 32 KB | kod programu, stałe (`const`) |
| SRAM (RAM) | **2 KB** | zmienne, stos, heap |
| EEPROM | 1 KB | dane trwałe (przeżywają reset) |

2 KB RAM to bardzo mało — każdy bajt ma znaczenie. Preferuj `byte` nad `int`, `char[]` nad `String`, `const` nad zwykłą zmienną.
