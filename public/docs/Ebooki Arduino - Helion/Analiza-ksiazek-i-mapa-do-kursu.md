# Analiza książek Arduino (Helion / Simon Monk) i mapa do programu kursu

---

## 1. Przegląd trzech książek

### Książka A — *Arduino dla początkujących: Podstawy i szkice* (wydanie I)
- **Plik:** `arduino-dla-poczatkujacych-podstawy-i-szkice-krok-1-wydanie-1.pdf`
- **Stron:** 146
- **Poziom:** podstawowy
- **Status:** starsza wersja — **NIE czytać** (zastąpiona wydaniem II, różnice opisane poniżej)

### Książka B — *Arduino dla początkujących: Podstawy i szkice* (wydanie II)
- **Plik:** `arduino-dla-poczatkujacych-podstawy-i-szkice-krok-1-wydanie-2-169s..pdf`
- **Stron:** 169
- **Poziom:** podstawowy
- **Status:** ✅ **CZYTAĆ JAKO PIERWSZĄ**

### Książka C — *Arduino dla początkujących: Kolejny krok*
- **Plik:** `arduino-dla-poczatkujacych-kolejny-krok-2-239s..pdf`
- **Stron:** 239
- **Poziom:** średniozaawansowany
- **Status:** ✅ **CZYTAĆ JAKO DRUGĄ**

---

## 2. Różnice między wydaniem I a wydaniem II (Podstawy i szkice)

Obie książki mają identyczną strukturę (11 rozdziałów), ale wydanie II jest nowsze i rozszerzone:

| Rozdział | Wydanie I (146 s.) | Wydanie II (169 s.) | Zmiana |
|---|---|---|---|
| 1 | Oto Arduino | Oto Arduino | Dodano płytki Mega Due, Micro, Yun |
| 2 | Rozpoczynamy | Rozpoczynamy | Bez zmian |
| 3 | Podstawy C | Podstawy C | Dodano stałe (`const`) |
| 4 | Funkcje | Funkcje | Bez zmian |
| 5 | Tablice i łańcuchy | Tablice i łańcuchy | Bez zmian |
| 6 | Wejścia i wyjścia | Wejścia i wyjścia | Bez zmian |
| 7 | Biblioteka Arduino | Biblioteka Arduino | Bez zmian |
| 8 | Zapisywanie danych | Zapisywanie danych | Zaktualizowano obsługę EEPROM i flash |
| 9 | Wyświetlacze LCD | **Wyświetlacze** | Dodano wyświetlacze **OLED** |
| 10 | **Ethernet** | **Internet rzeczy (IoT)** | Całkowita przebudowa — Node MCU, ESP8266, IFTTT zamiast samego Ethernet |
| 11 | C++ i biblioteki | C++ i biblioteki | Bez zmian |

**Wniosek:** Wydanie II zawiera wszystko z wydania I plus aktualizacje. Wydanie I jest zbędne.

---

## 3. Różnica między Książką B a Książką C

| Aspekt | Książka B (Podstawy i szkice wyd. II) | Książka C (Kolejny krok) |
|---|---|---|
| Cel | Nauczyć programowania Arduino od zera | Pogłębić wiedzę o sprzęcie i zaawansowanych technikach |
| Wymagania wstępne | Żadnych | Znajomość treści Książki B |
| Język C/C++ | Szczegółowo (typy, pętle, funkcje, tablice, klasy) | Zakłada znajomość — skupia się na bibliotekach |
| Komunikacja | Brak | I2C, SPI, UART, 1-Wire, USB, Ethernet |
| Sprzęt | I/O cyfrowe/analogowe, LCD | Zaawansowane I/O, DS18B20, radio FM, GPS |
| Optymalizacja | Brak | Pamięć, szybkość, pobór prądu |
| Wielozadaniowość | Brak | Rozdział 14 — praca bez wątków, biblioteka Timer |
| Tworzenie bibliotek | Krótko | Szczegółowo z przykładem (radio TEA5767) |

---

## 4. Zalecana kolejność czytania

```cpp
1. Książka B — Podstawy i szkice (wydanie II)
   Rozdziały 1–9 → solidne podstawy programowania i sprzętu

2. Książka C — Kolejny krok
   Rozdział 1 → powtórzenie i uzupełnienie
   Rozdziały 3, 7, 8, 9, 10 → komunikacja i protokoły
   Rozdziały 14, 15 → wielozadaniowość i biblioteki
```

---

## 5. Mapa rozdziałów do programu kursu

### Blok 1. Podstawy Arduino oraz środowisko programowania
- **Książka B, Rozdział 1** — Oto Arduino (płytka, złącza, rodzina)
- **Książka B, Rozdział 2** — Instalacja IDE, pierwszy szkic Blink
- **Książka C, Rozdział 1** — Uzupełnienie: środowisko, typy płytek, polecenia Arduino

### Blok 2. Podstawy programowania (C++, typy, zmienne, petle, tablice, klasy)
- **Książka B, Rozdział 3** — Podstawy języka C: zmienne, if, for, while, stałe
- **Książka B, Rozdział 4** — Funkcje: parametry, zasięg zmiennych, typy danych (float, boolean)
- **Książka B, Rozdział 5** — Tablice i łańcuchy (z projektem: alfabet Morse'a)
- **Książka B, Rozdział 11** — C++ i biblioteki: klasy, metody, plik nagłówkowy

### Blok 3. Płytka Arduino — porty I/O, PWM, ADC, komunikacja
- **Książka B, Rozdział 6** — Wejścia/wyjścia: cyfrowe, analogowe (ADC), PWM (wyjście analogowe)
- **Książka C, Rozdział 1** — Uzupełnienie: wejścia/wyjścia cyfrowe i analogowe, polecenia

### Blok 4. UART i komunikacja z PC
- **Książka C, Rozdział 10** — Szeregowa transmisja danych (UART): protokół, polecenia, USB↔PC, komunikacja między płytkami, GPS

### Blok 5. Przetwornik ADC
- **Książka B, Rozdział 6** — Wejścia analogowe (podstawy ADC, odczyt czujnika)
- **Książka C, Rozdział 4** — Przyspieszanie wejść analogowych (zaawansowane)

### Blok 6. PWM, serwomechanizmy, biblioteki
- **Książka B, Rozdział 6** — Wyjścia analogowe (PWM, `analogWrite`)
- **Książka B, Rozdział 7** — Biblioteka standardowa: tony, rejestry przesuwne
- **Książka C, Rozdział 15** — Tworzenie własnych bibliotek (klasy, plik .h i .cpp)

### Blok 7. Wyświetlacz tekstowy LCD 2×16
- **Książka B, Rozdział 9** — Wyświetlacze: LCD alfanumeryczny, OLED (bonus)

### Blok 8. Sterowanie silnikami DC i pętla `for`
- **Książka B, Rozdział 3** — Pętla `for` (szczegółowo)
- *(Sterowanie silnikami DC nie jest wprost omówione w żadnej z tych książek — wymaga materiałów uzupełniających o mostku H / L298N)*

### Blok 9. Czujnik odległości HC-SR04 i funkcje
- **Książka B, Rozdział 4** — Funkcje (składnia, parametry — fundament do napisania własnej obsługi HC-SR04)
- **Książka C, Rozdział 3** — Przerwania sprzętowe (można użyć do precyzyjnego pomiaru czasu echa)

### Blok 10. Wykresy, liczby losowe, warunki
- **Książka B, Rozdział 7** — Liczby losowe (`random()`), funkcje matematyczne
- **Książka B, Rozdział 3** — Instrukcja `if` / warunki

### Blok 11. Wielozadaniowość i opóźnienia
- **Książka C, Rozdział 14** — Praca z jednym procesem: `millis()` zamiast `delay()`, biblioteka Timer

### Blok 12. Projekty praktyczne z czujnikami

| Projekt | Gdzie w książkach |
|---|---|
| Diody RGB | Książka B, Rozdział 6 (PWM + wyjścia cyfrowe) |
| Syrena alarmowa | Książka B, Rozdział 7 (tony — `tone()`) |
| Przerwania (kontaktron, PIR) | Książka C, Rozdział 3 (przerwania sprzętowe, ISR) |
| Klawiatura i system alarmowy | Książka B, Rozdział 6 (wejścia cyfrowe, rezystory podciągające) |
| Wyświetlacze LCD / segmentowe | Książka B, Rozdział 9 (LCD) |
| Termometr analogowy | Książka B, Rozdział 6 (wejścia analogowe) |
| Termometr cyfrowy DS18B20 | Książka C, Rozdział 8 (interfejs 1-Wire, biblioteka OneWire) |
| Czujnik ultradźwiękowy HC-SR04 | Książka B, Rozdział 4 (funkcje) + Książka C, Rozdział 3 |
| Czujnik wilgotności (DHT) | *(brak wprost — wymaga dokumentacji biblioteki DHT)* |

### Blok 13. Programowanie robotów line follower / robosumo

| Zagadnienie | Gdzie w książkach |
|---|---|
| Sterownik robota (mostek H) | *(brak wprost — dokumentacja L298N/TB6612)* |
| Czujniki linii (IR) | Książka B, Rozdział 6 (wejścia analogowe/cyfrowe) |
| Omijanie przeszkód | Książka B, Rozdział 4 (funkcje) + Rozdział 3 (`if`) |
| Zdalne sterowanie IR | Książka C, Rozdział 3 (przerwania) + zewnętrzna biblioteka IRremote |
| Ekspander I/O (I2C) | Książka C, Rozdział 7 (magistrala I2C, biblioteka Wire) |
| Serwo | Książka B, Rozdział 6 (PWM) + zewnętrzna biblioteka Servo |
| Sterowanie źródłem światła | Książka B, Rozdział 6 (wejścia analogowe + PWM) |
| Komunikacja SPI | Książka C, Rozdział 9 (magistrala SPI, operacje bitowe) |

---

## 6. Podsumowanie — co dają książki, a czego nie pokrywają

### Dobrze pokryte przez książki
- Całe podstawy C/C++ dla Arduino (Bloki 1–2)
- Wejścia/wyjścia cyfrowe i analogowe (Blok 3, 5, 6)
- LCD i wyświetlacze (Blok 7)
- Liczby losowe, warunki, pętle (Blok 10)
- Przerwania (Blok 12: kontaktron, PIR)
- Wielozadaniowość bez wątków — `millis()` (Blok 11)
- UART / komunikacja z PC (Blok 4)
- I2C, SPI, 1-Wire / DS18B20 (Bloki 3, 12, 13)

### Wymagają materiałów uzupełniających (spoza tych książek)
- Sterowanie silnikami DC — mostek H (L298N / TB6612) — Blok 8, 13
- Czujnik wilgotności DHT11/DHT22 — Blok 12
- Zdalne sterowanie IR — biblioteka IRremote — Blok 13
- Serwo — biblioteka Servo (wspomniana, ale nie opisana szczegółowo)
- Serwomechanizmy w kontekście robota — Blok 6, 13
- Wyświetlacze 7-segmentowe — Blok 12

---

*Dokument wygenerowany: 2026-04-19*
                               