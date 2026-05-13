# Struktury danych — Arduino

Na Arduino UNO mamy tylko **2 KB RAM**, dlatego używamy głównie prostych struktur z języka C. Dynamiczne struktury z C++ STL (vector, map) są możliwe, ale ryzykowne — mogą sfragmentować pamięć.

---

## 1. Tablica (array)

Stała liczba elementów **tego samego typu** w ciągłym bloku pamięci.

```cpp
// deklaracja z inicjalizacją
int temperatury[5] = {20, 21, 23, 19, 22};

// deklaracja bez inicjalizacji
byte piny[3];
piny[0] = 8;
piny[1] = 9;
piny[2] = 10;

// dostęp do elementu — indeks od 0
Serial.println(temperatury[0]);  // 20
Serial.println(temperatury[4]);  // 22
```

Rozmiar tablicy jest stały — nie można go zmienić w trakcie działania programu.

**Iterowanie pętlą `for`:**
```cpp
int pomiary[5] = {100, 200, 300, 400, 500};

for (int i = 0; i < 5; i++) {
    Serial.println(pomiary[i]);
}
```

**Tablica znaków (C-string):**
```cpp
char nazwa[] = "Arduino";
// w pamięci: ['A','r','d','u','i','n','o','\0']
Serial.println(nazwa);  // Arduino
```

---

## 2. Tablica wielowymiarowa

```cpp
// 3 czujniki × 4 odczyty
int odczyty[3][4] = {
    {10, 11, 12, 13},  // czujnik 0
    {20, 21, 22, 23},  // czujnik 1
    {30, 31, 32, 33}   // czujnik 2
};

Serial.println(odczyty[1][2]);  // 22 — czujnik 1, odczyt 2
```

---

## 3. `struct` — struktura

Grupuje **różne typy** pod jedną nazwą. Pozwala opisać złożony obiekt.

```cpp
struct Czujnik {
    byte pin;
    float wartosc;
    bool aktywny;
    char nazwa[10];
};

// tworzenie zmiennej
Czujnik temp;
temp.pin     = A0;
temp.wartosc = 23.5;
temp.aktywny = true;

// inicjalizacja od razu
Czujnik wilg = {A1, 60.0, true, "wilgosc"};

Serial.println(temp.wartosc);  // 23.5
```

**Tablica struktur** — opisuje wiele podobnych obiektów:
```cpp
Czujnik czujniki[3] = {
    {A0, 0.0, true,  "temp"},
    {A1, 0.0, true,  "wilg"},
    {A2, 0.0, false, "swiatlo"}
};

for (int i = 0; i < 3; i++) {
    if (czujniki[i].aktywny) {
        czujniki[i].wartosc = analogRead(czujniki[i].pin);
    }
}
```

---

## 4. `enum` — wyliczenie

Nadaje **czytelne nazwy** stałym całkowitym. Zastępuje "magiczne liczby" w kodzie.

```cpp
enum Stan {
    STOP   = 0,
    START  = 1,
    ALARM  = 2,
    PAUZA  = 3
};

Stan aktualny = START;

if (aktualny == ALARM) {
    digitalWrite(BUZZER, HIGH);
}
```

Bez `enum` kod wyglądałby tak: `if (aktualny == 2)` — co oznacza 2? Trudno powiedzieć bez komentarza.

**`enum` w maszynie stanów** — typowe zastosowanie w robotyce:
```cpp
enum StanRobota { SZUKA, JEDZIE, OMIJA, STOP };
StanRobota stan = SZUKA;

void loop() {
    switch (stan) {
        case SZUKA:  // logika szukania linii
            break;
        case JEDZIE: // logika jazdy
            break;
        case OMIJA:  // logika omijania przeszkody
            break;
        case STOP:
            digitalWrite(MOTOR_L, LOW);
            digitalWrite(MOTOR_R, LOW);
            break;
    }
}
```

---

## 5. `union` — unia

Kilka typów **w tym samym miejscu pamięci**. Rozmiar unii = rozmiar największego pola.

```cpp
union Dane {
    int   calkowita;      // 2 bajty
    float zmiennoprzec;   // 4 bajty — unia zajmuje 4 bajty
    byte  bajty[4];
};

Dane d;
d.zmiennoprzec = 3.14;
Serial.println(d.bajty[0]);  // surowe bajty floata
```

Typowe zastosowanie — konwersja między typami bez rzutowania, odczyt rejestrów sprzętowych.

---

## 6. Wskaźnik (pointer)

Przechowuje **adres** zmiennej w pamięci, a nie jej wartość.

```cpp
int wartosc = 42;
int* wsk = &wartosc;   // wsk trzyma adres zmiennej wartosc

Serial.println(wartosc);   // 42
Serial.println(*wsk);      // 42 — dereferencja: wartość pod adresem
Serial.println((int)wsk);  // np. 312 — sam adres w RAM

*wsk = 100;                // zmiana przez wskaźnik
Serial.println(wartosc);   // 100
```

Wskaźniki są niezbędne przy przekazywaniu tablic do funkcji i pracy z bibliotekami sprzętowymi.

---

## 7. `String` — klasa tekstowa Arduino

Dynamiczna struktura do budowania i łączenia tekstów.

```cpp
String komunikat = "Temp: ";
float t = 23.5;
komunikat += t;
komunikat += " C";
Serial.println(komunikat);  // "Temp: 23.5 C"

// przydatne metody
komunikat.length();          // długość
komunikat.toUpperCase();     // wielkie litery
komunikat.indexOf("Temp");   // pozycja podtekstu
komunikat.substring(6, 10);  // wycinek
```

Uwaga: `String` dynamicznie alokuje pamięć — przy intensywnym użyciu na Arduino UNO może prowadzić do fragmentacji RAM i niestabilności.

---

## Podsumowanie — kiedy co używać

| Struktura | Kiedy użyć |
|---|---|
| `tablica[]` | wiele wartości tego samego typu, stała liczba |
| `struct` | opis złożonego obiektu (czujnik, silnik, robot) |
| `enum` | nazwane stany, tryby, komendy — zamiast liczb |
| `union` | konwersja typów, parsowanie rejestrów sprzętowych |
| `wskaźnik` | przekazywanie tablic do funkcji, praca z pamięcią |
| `String` | budowanie komunikatów tekstowych (ostrożnie z RAM) |
| `char[]` | tekst stały, oszczędność pamięci |
