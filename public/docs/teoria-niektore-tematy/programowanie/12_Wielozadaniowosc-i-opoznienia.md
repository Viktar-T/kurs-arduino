
# Wielozadaniowość i opóźnienia — skrypt zajęć

**Blok 11 programu kursu** · **Czas: 1 dzień (8h dydaktycznych)** · **Forma: teoria + demo + ćwiczenia + mini-projekt**

---

## 0. Cele lekcji

Po zajęciach uczeń:

- rozumie, dlaczego `delay()` jest „złodziejem czasu" i kiedy nie wolno go używać,
- potrafi użyć funkcji `millis()` do mierzenia czasu bez blokowania programu,
- pisze kod, który wykonuje **kilka zadań „równocześnie"** (mruganie LED + obsługa przycisku + odczyt czujnika),
- rozumie pojęcie **maszyny stanów** i potrafi ją zaimplementować,
- potrafi zrobić **debouncing przycisku** bez `delay()`,
- zna różnicę `millis()` vs `micros()` i wie, kiedy której użyć.

---

## 1. Rozgrzewka — pytanie dla klasy (5 min)

> **Pytanie do uczniów:** Wyobraźcie sobie, że jesteście kucharzem w restauracji. Macie do zrobienia: zupę (gotuje się 30 minut), sałatkę (5 minut krojenia) i sok (1 minuta). **Co robicie najpierw?**
>
> Zły kucharz: gotuje zupę, czeka 30 min, kroi sałatkę, robi sok → **36 minut**.
>
> Dobry kucharz: stawia zupę na ogniu, **w międzyczasie** kroi sałatkę i robi sok → **30 minut**.
>
> Dziś nauczymy nasze Arduino być **dobrym kucharzem**.

Cel: pokazać, że `delay()` to ten zły kucharz — Arduino siedzi i nic nie robi. `millis()` to dobry kucharz — sprawdza co chwilę „czy zupa już gotowa?", a w międzyczasie robi inne rzeczy.

> **Uwaga „na zapas":** w naszej restauracji jest **tylko JEDEN kucharz**. Arduino UNO ma jeden procesor i wykonuje **jedną instrukcję naraz** — nigdy dwóch równocześnie. To, co dziś będziemy nazywać „wielozadaniowością", to tak naprawdę jeden kucharz biegający bardzo szybko między garnkami. Wrócimy do tego po demie z trzema LED-ami (sekcja 7) — wtedy zrobi to większe wrażenie.

---

## 2. Problem z `delay()` — co tak naprawdę robi? (15 min)

### 2.1. Klasyczny program — mruganie LED

Wszyscy znamy ten kod z pierwszych zajęć:

```cpp
void loop() {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
    digitalWrite(LED_BUILTIN, LOW);
    delay(1000);
}
```

**Pytanie do uczniów:** Co Arduino robi w trakcie `delay(1000)`?

**Odpowiedź:** **NIC.** Stoi w miejscu i liczy do 1000 milisekund. Nie czyta przycisku, nie odbiera danych z portu, nie obsługuje czujnika.

### 2.2. Demonstracja problemu — LED + przycisk

Podłącz: LED na pinie 13 (już jest na płytce), przycisk na pinie 2 do GND, drugi LED na pinie 8.

```cpp
const int PRZYCISK = 2;
const int LED_REAKCJA = 8;

void setup() {
    pinMode(LED_BUILTIN, OUTPUT);
    pinMode(LED_REAKCJA, OUTPUT);
    pinMode(PRZYCISK, INPUT_PULLUP);
}

void loop() {
    // Migamy diodą wbudowaną
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
    digitalWrite(LED_BUILTIN, LOW);
    delay(1000);

    // I równocześnie chcielibyśmy reagować na przycisk
    if (digitalRead(PRZYCISK) == LOW) {
        digitalWrite(LED_REAKCJA, HIGH);
    } else {
        digitalWrite(LED_REAKCJA, LOW);
    }
}
```

**Co robimy na zajęciach:** wgrywamy program i każemy uczniom **klikać przycisk szybko**. Co widzą?

- LED reaguje na przycisk **z opóźnieniem do 2 sekund**,
- czasem klikają i nic się nie dzieje, bo Arduino „śpi" w `delay()`,
- przycisk działa „losowo" — w rzeczywistości program go zauważa tylko przez ułamek sekundy między dwoma `delay()`.

**Wniosek (zapisać na tablicy dużymi literami):**

> ⚠️ `delay()` BLOKUJE CAŁY PROGRAM. Nic innego się nie dzieje, dopóki nie skończy.

---

## 3. Rozwiązanie — funkcja `millis()` (20 min)

### 3.1. Co to jest `millis()`?

`millis()` to **wewnętrzny zegarek Arduino**. Od momentu włączenia (lub resetu) Arduino liczy milisekundy. Gdy zapytamy o `millis()`, dostajemy aktualną wartość tego licznika.

```cpp
void setup() {
    Serial.begin(9600);
}

void loop() {
    Serial.println(millis());
    delay(500);
}
```

W Serial Monitor zobaczymy: `0, 500, 1000, 1500, 2000, ...`

### 3.2. Jaki to typ?

```cpp
unsigned long czas = millis();
```

- `unsigned long` — 4 bajty, zakres 0 do 4 294 967 295,
- po przekroczeniu maksimum (po **~49 dniach**) licznik wraca do zera (overflow),
- **NIGDY** nie zapisujcie wyniku `millis()` do `int` ani `long` — przepełnicie zmienną w 33 sekundy lub po 25 dniach!

### 3.3. Główna idea — zamiast czekać, sprawdzaj

**Stary sposób (blokujący):**
> „Czekaj 1 sekundę." → Arduino stoi.

**Nowy sposób (nieblokujący):**
> „Sprawdź, czy minęła już sekunda od ostatniego razu. Jeśli tak — zrób coś. Jeśli nie — leć dalej, masz inne sprawy."

To jak budzik: nie siedzimy i nie patrzymy w zegar, tylko żyjemy normalnie i co chwilę zerkamy.

---

## 4. Wzorzec non-blocking — szablon do zapamiętania (20 min)

### 4.1. Mruganie LED bez `delay()` — wersja podstawowa

```cpp
const int LED = 13;
const unsigned long INTERWAL = 1000;  // 1 sekunda

unsigned long poprzedniCzas = 0;
bool stanLED = LOW;

void setup() {
    pinMode(LED, OUTPUT);
}

void loop() {
    unsigned long aktualnyCzas = millis();

    if (aktualnyCzas - poprzedniCzas >= INTERWAL) {
        poprzedniCzas = aktualnyCzas;     // zapamiętaj kiedy ostatnio
        stanLED = !stanLED;                // przełącz stan
        digitalWrite(LED, stanLED);
    }
}
```

### 4.2. Rozbiórka linii po linii

```cpp
unsigned long aktualnyCzas = millis();
```
Pobierz aktualny czas pracy Arduino.

```cpp
if (aktualnyCzas - poprzedniCzas >= INTERWAL)
```
**Najważniejsza linia.** Sprawdź: czy od ostatniego razu minął już cały interwał?

> **Dlaczego odejmowanie, a nie `aktualnyCzas >= poprzedniCzas + INTERWAL`?**
>
> Bo odejmowanie `unsigned long` jest **odporne na overflow**. Nawet gdy `millis()` przekręci się po 49 dniach, różnica wciąż wyjdzie poprawnie. Pełne porównanie z dodawaniem może się zepsuć. **Zawsze odejmujemy.**

```cpp
poprzedniCzas = aktualnyCzas;
```
Zaktualizuj „znacznik czasu" — od teraz odliczamy od nowa.

```cpp
stanLED = !stanLED;
digitalWrite(LED, stanLED);
```
Zrób właściwą akcję — przełącz LED.

### 4.3. Szablon do zapamiętania (zapisać na tablicy!)

```cpp
unsigned long ostatni_X = 0;
const unsigned long INTERWAL_X = 1000;

void loop() {
    unsigned long teraz = millis();

    if (teraz - ostatni_X >= INTERWAL_X) {
        ostatni_X = teraz;
        // tu robimy zadanie X
    }

    // tu może być kolejny if z innym zadaniem
    // ...

    // pętla loop() leci dalej, NIC jej nie blokuje
}
```

**Kluczowa myśl:** `loop()` nie zatrzymuje się ani na chwilę. Cały czas leci w kółko. Wewnątrz tylko **sprawdzamy**, czy coś trzeba zrobić.

---

## 5. Demo na żywo — porównanie delay() vs millis() (15 min)

Wgrywamy te dwa programy po kolei i klikamy przycisk:

**Program A — z delay() (zły kucharz):**

```cpp
const int LED = 13;
const int PRZYCISK = 2;
const int LED_REAKCJA = 8;

void setup() {
    pinMode(LED, OUTPUT);
    pinMode(LED_REAKCJA, OUTPUT);
    pinMode(PRZYCISK, INPUT_PULLUP);
}

void loop() {
    digitalWrite(LED, HIGH);
    delay(1000);
    digitalWrite(LED, LOW);
    delay(1000);

    digitalWrite(LED_REAKCJA, !digitalRead(PRZYCISK));
}
```

**Program B — z millis() (dobry kucharz):**

```cpp
const int LED = 13;
const int PRZYCISK = 2;
const int LED_REAKCJA = 8;

unsigned long ostatnieMrugniecie = 0;
const unsigned long INTERWAL = 1000;
bool stanLED = LOW;

void setup() {
    pinMode(LED, OUTPUT);
    pinMode(LED_REAKCJA, OUTPUT);
    pinMode(PRZYCISK, INPUT_PULLUP);
}

void loop() {
    unsigned long teraz = millis();

    // Zadanie 1: mruganie
    if (teraz - ostatnieMrugniecie >= INTERWAL) {
        ostatnieMrugniecie = teraz;
        stanLED = !stanLED;
        digitalWrite(LED, stanLED);
    }

    // Zadanie 2: przycisk — sprawdzany TYSIĄCE razy na sekundę
    digitalWrite(LED_REAKCJA, !digitalRead(PRZYCISK));
}
```

**Reakcja klasy:** Program B reaguje na przycisk **natychmiast**, niezależnie od mrugania. Program A — z opóźnieniem do 2 sekund.

> **Aha-moment:** „Czyli Arduino nie jest leniwe. Jest leniwe TYLKO przez `delay()`!"

---

## 6. Ćwiczenie 1 — pierwszy kod bez delay() (20 min)

### Zadanie 6.1 (poziom: łatwy)

Napisz program, który:
- miga LED-em na pinie 13 co **500 ms**,
- nie używa `delay()` ani razu.

**Sprawdzenie:** dodaj na końcu `loop()` linijkę:
```cpp
Serial.println(millis());
```
W Serial Monitor zobaczysz, jak szybko leci pętla — to dowód, że Arduino nie blokuje się na sekundę.

### Zadanie 6.2 (poziom: średni)

Rozbuduj program z 6.1 — dodaj **drugi LED** na pinie 8, który miga co **300 ms**, niezależnie od pierwszego.

**Wskazówka:** każdy LED ma swój `unsigned long ostatnie_X = 0;` i swój `INTERWAL`.

**Co uczniowie zauważają:** dwa LED-y mrugają w **różnym tempie**, jakby były niezależne — ale procesor jest jeden! Jest po prostu na tyle szybki, że wygląda to na równoczesność.

---

## 7. Wiele zadań jednocześnie — kuchnia z kilkoma garnkami (25 min)

Zasada: **każde niezależne zadanie ma swój `previousMillis` i swój `interval`.**

### 7.1. Trzy LED-y, trzy tempa

```cpp
const int LED1 = 8;
const int LED2 = 9;
const int LED3 = 10;

unsigned long ostatni1 = 0;
unsigned long ostatni2 = 0;
unsigned long ostatni3 = 0;

const unsigned long INT1 = 200;   // szybki
const unsigned long INT2 = 500;   // średni
const unsigned long INT3 = 1300;  // wolny

bool stan1 = LOW, stan2 = LOW, stan3 = LOW;

void setup() {
    pinMode(LED1, OUTPUT);
    pinMode(LED2, OUTPUT);
    pinMode(LED3, OUTPUT);
}

void loop() {
    unsigned long teraz = millis();

    if (teraz - ostatni1 >= INT1) {
        ostatni1 = teraz;
        stan1 = !stan1;
        digitalWrite(LED1, stan1);
    }

    if (teraz - ostatni2 >= INT2) {
        ostatni2 = teraz;
        stan2 = !stan2;
        digitalWrite(LED2, stan2);
    }

    if (teraz - ostatni3 >= INT3) {
        ostatni3 = teraz;
        stan3 = !stan3;
        digitalWrite(LED3, stan3);
    }
}
```

**Trzy zadania, jeden procesor, zerowa blokada.** To jest istota wielozadaniowości na Arduino.

### 7.2. Mieszanka — LED + odczyt czujnika + dane na port

```cpp
const int LED = 13;
const int CZUJNIK = A0;

unsigned long ostatnieMruganie = 0;
unsigned long ostatniOdczyt = 0;
unsigned long ostatniRaport = 0;

const unsigned long INT_MRUGANIE = 1000;
const unsigned long INT_ODCZYT   = 100;
const unsigned long INT_RAPORT   = 2000;

bool stanLED = LOW;
int aktualnaWartosc = 0;

void setup() {
    pinMode(LED, OUTPUT);
    Serial.begin(9600);
}

void loop() {
    unsigned long teraz = millis();

    // Zadanie A: mruganie co 1s
    if (teraz - ostatnieMruganie >= INT_MRUGANIE) {
        ostatnieMruganie = teraz;
        stanLED = !stanLED;
        digitalWrite(LED, stanLED);
    }

    // Zadanie B: odczyt czujnika co 100 ms
    if (teraz - ostatniOdczyt >= INT_ODCZYT) {
        ostatniOdczyt = teraz;
        aktualnaWartosc = analogRead(CZUJNIK);
    }

    // Zadanie C: raport na port co 2s
    if (teraz - ostatniRaport >= INT_RAPORT) {
        ostatniRaport = teraz;
        Serial.print("Czujnik: ");
        Serial.println(aktualnaWartosc);
    }
}
```

**Pytanie do klasy:** Ile razy na sekundę leci pętla `loop()`? **Odpowiedź:** kilka tysięcy. Procesor robi mnóstwo „nic" — dlatego ma czas na wszystko.

### 7.3. Czy to naprawdę równocześnie? (15 min — kluczowy moment lekcji)

Tu wracamy do uwagi z sekcji 1. Pora powiedzieć uczniom prawdę: **Arduino UNO ma jeden rdzeń procesora i wykonuje JEDNĄ instrukcję naraz**. To, co właśnie zobaczyli (trzy LED-y mrugające „równolegle"), to **pseudo-równoczesność** — jeden bardzo szybki kucharz biegający między garnkami.

#### Eksperyment 1 — policzmy obiegi pętli

Wgraj na żywo:

```cpp
unsigned long licznikLoop = 0;
unsigned long ostatniRaport = 0;

void setup() {
    Serial.begin(9600);
}

void loop() {
    licznikLoop++;

    if (millis() - ostatniRaport >= 1000) {
        ostatniRaport = millis();
        Serial.print("Pętla loop() wykonała się ");
        Serial.print(licznikLoop);
        Serial.println(" razy w ciągu sekundy");
        licznikLoop = 0;
    }
}
```

W Serial Monitor uczniowie zobaczą **ok. 100 000–200 000 obiegów na sekundę** (na pustej pętli z samym `Serial.print` raz na sekundę).

> **Aha-moment:** „W ciągu sekundy procesor zdąży zerknąć na każdy stolik 100 tysięcy razy. Dlatego *wygląda*, że robi wszystko naraz."

#### Eksperyment 2 — zepsujmy kucharza jednym `delay()`

Weź działający program z trzema LED-ami (sekcja 7.1). Dodaj **jedną** linię:

```cpp
void loop() {
    unsigned long teraz = millis();

    if (teraz - ostatni1 >= INT1) { ... }
    if (teraz - ostatni2 >= INT2) { ... }
    if (teraz - ostatni3 >= INT3) { ... }

    delay(500);   // ← TYLKO TA JEDNA LINIA
}
```

Wgraj. Co się dzieje? Wszystkie trzy LED-y nagle mrugają **nieregularnie i wolno**.

**Pytanie do klasy:** „Czemu? Przecież każdy LED ma swój `millis()`, swój licznik, swój interwał. Powinny działać niezależnie."

**Odpowiedź ich własna (po naprowadzeniu):** bo `delay()` zatrzymuje **całego kucharza**. Nieważne, ile garnków stoi na ogniu — jeśli kucharz stoi w miejscu pół sekundy, każdy garnek czeka pół sekundy. To dowód, że **jest tylko jeden procesor**.

#### Metafora kelnera (do zapamiętania)

> Wyobraźcie sobie kelnera w restauracji z 10 stolikami. Nie ma 10 kelnerów. Jest **jeden**, który kręci się błyskawicznie między stolikami — przyjmuje zamówienie, biegnie do następnego, sprawdza czy komuś dolać wody. Z perspektywy gości wygląda, jakby każdy miał „swojego" kelnera. To dokładnie tak działa nasze Arduino z `millis()`.

#### A czy są procesory z wieloma kucharzami?

Tak — to się nazywa **wielordzeniowość** (multi-core).

| Procesor | Liczba rdzeni | Komentarz |
|---|---|---|
| Arduino UNO (ATmega328P) | **1** | nasz dzisiejszy bohater |
| ESP32 | 2 | popularny w IoT — Wi-Fi + Bluetooth |
| Raspberry Pi 5 | 4 | minikomputer, działa pod Linuxem |
| Typowy laptop / telefon | 4–10 | tu już jest **prawdziwa** równoczesność |

Na Arduino można też uruchomić tzw. **system czasu rzeczywistego** (RTOS, np. FreeRTOS), który symuluje wiele zadań na jednym rdzeniu w bardziej zorganizowany sposób — ale pod spodem **wciąż** jeden kucharz biega między zadaniami. Tyle że według sztywnego harmonogramu zamiast naszych ręcznych `if (teraz - ostatni >= ...)`. Tym zajmiemy się na bardziej zaawansowanym kursie.

> **Wniosek dnia:** Wielozadaniowość na Arduino UNO to **iluzja stworzona przez prędkość procesora**. Cały trick polega na tym, żeby `loop()` była zawsze **szybka** — wtedy iluzja działa. Jak tylko coś ją spowolni (`delay()`, długi `for`, wolny czujnik) — iluzja się rozpada i widać, że kucharz jest jeden.

---

## 8. Ćwiczenie 2 — sygnalizacja świetlna (25 min)

### Zadanie 8.1 (poziom: średni)

Zbuduj **sygnalizację świetlną** dla skrzyżowania:

- LED czerwony (pin 8): świeci 5 s,
- LED żółty (pin 9): świeci 2 s,
- LED zielony (pin 10): świeci 4 s,
- potem znów żółty 2 s i wracamy do czerwonego.

**Wymóg:** ani jednego `delay()` w kodzie. Program **musi** móc równocześnie obsługiwać pomarańczową diodę „migającą awarię" na pinie 11 (mruga co 250 ms cały czas, niezależnie od cyklu sygnalizacji).

**Wskazówka:** to jest klasyczna **maszyna stanów** — patrz sekcja 9.

---

## 9. Maszyny stanów (state machines) (25 min)

Gdy zadanie ma **kilka faz**, które zmieniają się w czasie, używamy maszyny stanów.

### 9.1. Co to jest stan?

Stan = aktualna „faza" programu. Sygnalizacja może być w stanie: CZERWONY, ŻÓŁTY_PO_CZERWONYM, ZIELONY, ŻÓŁTY_PO_ZIELONYM. Naraz tylko jeden.

### 9.2. Sygnalizacja jako maszyna stanów

```cpp
enum Stan {
    CZERWONY,
    ZOLTY_PO_CZERWONYM,
    ZIELONY,
    ZOLTY_PO_ZIELONYM
};

Stan aktualnyStan = CZERWONY;
unsigned long wejscieWStan = 0;

const int CZER = 8, ZOL = 9, ZIE = 10;

void setup() {
    pinMode(CZER, OUTPUT);
    pinMode(ZOL,  OUTPUT);
    pinMode(ZIE,  OUTPUT);
    wejscieWStan = millis();
}

void loop() {
    unsigned long teraz = millis();
    unsigned long wStanieOd = teraz - wejscieWStan;

    switch (aktualnyStan) {
        case CZERWONY:
            digitalWrite(CZER, HIGH);
            digitalWrite(ZOL, LOW);
            digitalWrite(ZIE, LOW);
            if (wStanieOd >= 5000) {
                aktualnyStan = ZOLTY_PO_CZERWONYM;
                wejscieWStan = teraz;
            }
            break;

        case ZOLTY_PO_CZERWONYM:
            digitalWrite(CZER, HIGH);
            digitalWrite(ZOL, HIGH);
            digitalWrite(ZIE, LOW);
            if (wStanieOd >= 2000) {
                aktualnyStan = ZIELONY;
                wejscieWStan = teraz;
            }
            break;

        case ZIELONY:
            digitalWrite(CZER, LOW);
            digitalWrite(ZOL, LOW);
            digitalWrite(ZIE, HIGH);
            if (wStanieOd >= 4000) {
                aktualnyStan = ZOLTY_PO_ZIELONYM;
                wejscieWStan = teraz;
            }
            break;

        case ZOLTY_PO_ZIELONYM:
            digitalWrite(CZER, LOW);
            digitalWrite(ZOL, HIGH);
            digitalWrite(ZIE, LOW);
            if (wStanieOd >= 2000) {
                aktualnyStan = CZERWONY;
                wejscieWStan = teraz;
            }
            break;
    }
}
```

**Co tu się dzieje:**
- `enum Stan` — definiuje nazwy stanów (zamiast magicznych liczb 0,1,2,3),
- `aktualnyStan` — pamięta, w którym stanie jesteśmy,
- `wejscieWStan` — kiedy weszliśmy w ten stan,
- `switch` — wykonuje akcję pasującą do aktualnego stanu,
- każdy `if (wStanieOd >= ...)` — przejście do następnego stanu po zadanym czasie.

**Aha-moment:** to jest jak gra planszowa. Jesteś na jednym polu, czasem przeskakujesz na inne — ale nigdy nie ma cię w dwóch jednocześnie.

---

## 10. Debouncing przycisku bez delay() (15 min)

### 10.1. Problem — drgania styków

Mechaniczny przycisk po naciśnięciu „brzęczy" elektrycznie przez ~5–20 ms. Arduino widzi: HIGH, LOW, HIGH, LOW, HIGH, LOW, HIGH... — choć fizycznie to jedno kliknięcie.

Klasyczne rozwiązanie z `delay(50)` po wykryciu zbocza — **blokuje program na 50 ms**. W projektach z wieloma zadaniami to katastrofa.

### 10.2. Debouncing przez `millis()`

```cpp
const int PRZYCISK = 2;
const unsigned long DEBOUNCE = 50;

bool stanPrzycisku = HIGH;        // pull-up: nieaktywny = HIGH
bool poprzedniOdczyt = HIGH;
unsigned long czasZmiany = 0;

int licznik = 0;

void setup() {
    pinMode(PRZYCISK, INPUT_PULLUP);
    Serial.begin(9600);
}

void loop() {
    bool aktualnyOdczyt = digitalRead(PRZYCISK);

    // Wykryto zmianę odczytu — startuj timer
    if (aktualnyOdczyt != poprzedniOdczyt) {
        czasZmiany = millis();
    }

    // Jeśli odczyt jest stabilny dłużej niż DEBOUNCE — zaakceptuj go
    if (millis() - czasZmiany >= DEBOUNCE) {
        if (aktualnyOdczyt != stanPrzycisku) {
            stanPrzycisku = aktualnyOdczyt;

            // Reaguj na zbocze opadające (naciśnięcie)
            if (stanPrzycisku == LOW) {
                licznik++;
                Serial.print("Klik #");
                Serial.println(licznik);
            }
        }
    }

    poprzedniOdczyt = aktualnyOdczyt;
}
```

**Klucz:** akceptujemy stan dopiero, gdy jest stabilny przez 50 ms. W tym czasie pętla `loop()` leci normalnie i może robić inne rzeczy.

---

## 11. `millis()` vs `micros()` (5 min)

| Funkcja | Jednostka | Overflow | Zastosowanie |
|---|---|---|---|
| `millis()` | milisekundy (1/1000 s) | po ~49 dniach | typowe zadania (mruganie, przyciski, raporty) |
| `micros()` | mikrosekundy (1/1 000 000 s) | po **~70 minutach** | ultradźwięki HC-SR04, precyzyjne timery, pomiary impulsów |

```cpp
unsigned long t0 = micros();
// jakieś szybkie zadanie
unsigned long t1 = micros();
Serial.print("Trwało: ");
Serial.print(t1 - t0);
Serial.println(" us");
```

**Uwaga:** `micros()` ma rozdzielczość **4 µs** na klasycznym Arduino UNO (16 MHz). Nie liczcie krócej.

---

## 12. Najczęstsze błędy uczniów (10 min — przejrzeć razem!)

### Błąd 1 — `int` zamiast `unsigned long`

```cpp
int ostatni = 0;          // ❌ przepełni się w 33 sekundy
unsigned long ostatni = 0; // ✅
```

### Błąd 2 — porównanie zamiast odejmowania

```cpp
if (millis() >= ostatni + INTERWAL) { ... }  // ❌ łamie się po overflow
if (millis() - ostatni >= INTERWAL) { ... }  // ✅ overflow-safe
```

### Błąd 3 — zapomnienie o aktualizacji znacznika

```cpp
if (teraz - ostatni >= INTERWAL) {
    // BRAK linii: ostatni = teraz;
    digitalWrite(LED, !digitalRead(LED));
}
// efekt: warunek ZAWSZE prawdziwy → LED miga z maksymalną prędkością → wygląda jakby świecił
```

### Błąd 4 — `delay()` ukryty w bibliotece

Niektóre biblioteki (np. niektóre wersje DHT) wewnątrz wywołują `delay()`. Jeśli w projekcie millis() z czujnikiem DHT „dziwnie się zacina" — to może być to.

### Błąd 5 — mieszanie delay() i millis()

```cpp
if (teraz - ostatni >= 1000) {
    ostatni = teraz;
    digitalWrite(LED, HIGH);
    delay(100);                  // ❌ ZNISZCZYŁEŚ całą filozofię
    digitalWrite(LED, LOW);
}
```

Jak chcesz krótki impuls — zrób z tego osobne zadanie millis() („zgaś LED 100 ms po zapaleniu").

---

## 13. Mini-projekt końcowy — wybór ucznia (60 min)

Każdy uczeń lub para wybiera jeden z trzech projektów. Wymóg: **0 razy `delay()`**.

### Projekt A — Stoper (poziom: średni)
- przycisk START/STOP na pinie 2,
- LED stanu na pinie 13 (świeci, gdy stoper działa),
- co 100 ms wypisuje na port aktualny czas w formacie `MM:SS.s`.

### Projekt B — Reakcja gracza (poziom: średni-trudny)
- po naciśnięciu „start" (przycisk 1) program czeka **losowy czas** 2–5 s,
- potem zapala LED,
- gracz musi jak najszybciej nacisnąć przycisk 2,
- program mierzy czas reakcji w milisekundach i wypisuje na port,
- jeśli gracz naciśnie przycisk 2 **przed** zapaleniem LED — komunikat „falstart!".

### Projekt C — Tablet z trzema alarmami (poziom: trudny)
- 3 przyciski ustawiają 3 alarmy o różnych czasach,
- każdy alarm ma swój LED i swój brzęczyk (lub osobny LED zamiast brzęczyka),
- alarmy działają **równocześnie** — zadziałanie jednego nie blokuje pozostałych.

---

## 14. Podsumowanie — co zabieramy z lekcji (5 min)

Trener zapisuje na tablicy z udziałem uczniów:

0. **Arduino UNO ma jeden procesor — to pseudo-równoczesność.** Kucharz jest jeden, tylko bardzo szybki. Cały trick = pętla `loop()` musi być błyskawiczna.
1. **`delay()` blokuje wszystko.** Używamy go tylko w trywialnych projektach albo na samym początku programu.
2. **`millis()` to nasz zegarek** — działa w tle, nie blokuje.
3. **Wzorzec do zapamiętania:**
   ```cpp
   if (teraz - ostatni >= INTERWAL) {
       ostatni = teraz;
       // zadanie
   }
   ```
4. **Każde zadanie ma swój `previousMillis`.**
5. **Zawsze `unsigned long`.** Zawsze odejmowanie.
6. **Maszyna stanów** — gdy zadanie ma kilka faz w czasie.
7. **Debouncing** — to też wzorzec millis(), nie `delay()`.

---

## 15. Co dalej (zapowiedź następnej lekcji)

Następny blok: **projekty praktyczne — RGB, syrena, przerwania, PIR, klawiatura, termometry, DHT, HC-SR04, wyświetlacze**. Wszystkie będziemy pisać **bez `delay()`** — to będzie nasza nowa norma.

---

## 16. Pomoce dydaktyczne — co przygotować przed zajęciami

- [ ] 10 zestawów: Arduino UNO, breadboard, 4× LED (różne kolory), 4× rezystor 220 Ω, 1× przycisk, kable,
- [ ] 10 zestawów: 1× potencjometr (do ćwiczenia z czujnikiem analogowym),
- [ ] projektor — do pokazania kodu i monitorowania portu,
- [ ] tablica z napisanym **szablonem millis()** przez całą lekcję,
- [ ] wydruk „ściągi" dla każdego ucznia ze wzorcem millis() i listą najczęstszych błędów (sekcja 12),
- [ ] przygotowane gotowe szkice z sekcji 5 (demo) i 7 (trzy LED-y) — wgrać szybko, gdy uczniowie utkną.

---

## 17. Uwagi metodyczne dla prowadzącego

- **Najwięcej czasu poświęcić demo z sekcji 5** (porównanie A vs B). To moment, w którym uczniowie „łapią" pojęcie blokowania. Bez tego cała reszta jest abstrakcyjna.
- Po sekcji 4.3 (szablon na tablicy) zostawić tablicę z tym kodem **przez resztę lekcji** — uczniowie będą do niego wracać przy każdym ćwiczeniu.
- Maszyna stanów (sekcja 9) jest **trudna**. Jeśli klasa nie nadąża — pominąć teorię, ale pokazać działający kod sygnalizacji jako „ciekawostka" i wrócić na następnych zajęciach.
- Mini-projekt końcowy (sekcja 13) jest **najważniejszą częścią dnia**. Lepiej skrócić teorię niż obciąć projekt.
- Uczniów, którzy szybciej kończą, zachęcić do dodawania **czwartego zadania** do projektu (np. raport co 5 s na port).

