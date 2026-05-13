# fundamentalna sprawa, jak działa HC-SR04
```cpp
#define trigPin 12
#define echoPin 11

void setup() {
  Serial.begin (9600);
  pinMode(trigPin, OUTPUT); //Pin, do którego podłączymy trig jako wyjście
  pinMode(echoPin, INPUT); //a echo, jako wejście
}

void loop() {  
  Serial.print(zmierzOdleglosc());
  Serial.println(" cm");
  
  delay(500);
} 

int zmierzOdleglosc() {
  long czas, dystans;

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  czas = pulseIn(echoPin, HIGH);
  dystans = czas / 58;

  return dystans;
}
```
HC-SR04 nie reaguje na **stan** pinu trig (HIGH/LOW), tylko na **zbocze narastające** — czyli na **przejście** z LOW do HIGH. To jest tzw. wyzwalanie krawędziowe (edge-triggered). Sensor traktuje to przejście jako sygnał "dawaj, zacznij nowy pomiar".

**Dlatego sekwencja musi wyglądać tak:**

```
LOW (2 µs)    ──┐               ┌──   ← upewniamy się, że jest "czysty" LOW
                │               │
HIGH (10 µs)    └───────────────┘     ← TO jest sygnał wyzwalający
                ↑               ↑
            zbocze         zbocze
           narastające     opadające
           (start!)      (koniec impulsu)
```

Te 2 µs LOW na początku to **bezpiecznik** — gwarantuje, że pin faktycznie jest w LOW przed wyzwoleniem (gdyby z poprzedniej iteracji został w HIGH, brakowałoby zbocza). Te 10 µs HIGH to **minimum z karty katalogowej** — krótszy impuls sensor może zignorować.

**Co dokładnie dzieje się w sensorze po impulsie 10 µs:**

1. Sensor wykrywa zbocze narastające na Trig
2. Generuje **8 impulsów ultradźwiękowych 40 kHz** (~200 µs nadawania)
3. Ustawia pin echo na **HIGH** i zaczyna mierzyć czas
4. Gdy fala wraca odbita od przeszkody (lub mija ~38 ms timeout), echo idzie na **LOW**
5. **Czas trwania HIGH na echo = czas podróży fali tam i z powrotem**

I dopiero teraz `pulseIn(echoPin, HIGH)` ma sens — funkcja czeka aż echo pójdzie HIGH, mierzy ile czasu zostaje HIGH, i zwraca tę wartość w mikrosekundach.

**Analogia dla uczniów:**

Wyobraź sobie czujnik jako kogoś z dzwonkiem na recepcji.

- Stan HIGH = "trzymam palec na dzwonku"
- Trzymanie palca przyciśniętego cały czas → recepcjonista usłyszy **jedno** dzwonienie i potem cisza, dzwonek już zwarte styki, nie ma kolejnych "dzyń"
- Żeby zadzwonić ponownie, musisz **podnieść palec i nacisnąć ponownie** (LOW → HIGH → LOW)

Tak samo HC-SR04 wymaga **świeżego zbocza narastającego** za każdym razem, gdy chcesz nowy pomiar.

**Dlaczego cały ten cykl jest wewnątrz `loop()`:**

Bo chcemy **wielokrotnie** mierzyć odległość — np. 2 razy na sekundę (stąd `delay(500)` na końcu). Każdy obrót `loop()` to jeden pomiar, więc każdy obrót musi zawierać kompletny impuls wyzwalający.

# Co dokładnie dzieje się w sensorze po impulsie 10 µs:

Rozłóżmy to na atomy. HC-SR04 wewnątrz to mała płytka z **mikrokontrolerem, dwoma przetwornikami piezoelektrycznymi** (jeden nadajnik T, jeden odbiornik R), kwarcem 16 MHz i kilkoma tranzystorami. Oto co dzieje się krok po kroku po Twoim impulsie 10 µs na pinie TRIG:

### Faza 1: Wykrycie wyzwolenia (0 µs)

Mikrokontroler w sensorze cały czas obserwuje pin TRIG. Gdy zobaczy zbocze narastające, **zaczyna sekwencję pomiarową**. Sam Twój impuls 10 µs może już dawno się skończyć — sensor zapamiętał, że ma działać.

### Faza 2: Nadawanie ultradźwięków (~0–200 µs)

Mikrokontroler generuje **8 impulsów prostokątnych o częstotliwości 40 kHz** i podaje je na **nadajnik piezo (T)**.

Liczby:

- Okres dla 40 kHz: T = 1/40 000 = 25 µs
- 8 impulsów × 25 µs = **200 µs nadawania**

Nadajnik piezo wibruje mechanicznie w rytm tych impulsów i wysyła w powietrze **wiązkę ultradźwięków** o częstotliwości 40 kHz (poza zakresem słuchu człowieka — słyszymy do ~20 kHz).

**Dlaczego akurat 8 impulsów, a nie jeden?**

Piezoelement potrzebuje kilku cykli, żeby się "rozkręcić" mechanicznie (jak dzwon — pierwsze uderzenie nie wybrzmiewa głośno). Osiem impulsów daje wystarczająco silną i wyraźną falę, którą odbiornik łatwo odróżni od szumu tła.

**Dlaczego 40 kHz?**

To **częstotliwość rezonansowa** tanich piezo-przetworników używanych w HC-SR04. Przy tej częstotliwości element drga najefektywniej, a fala dobrze się propaguje w powietrzu (wyższe częstotliwości są mocno tłumione).

### Faza 3: Pin ECHO idzie w HIGH (~200 µs)

**Natychmiast po zakończeniu nadawania** mikrokontroler ustawia pin ECHO na **HIGH** i uruchamia wewnętrzny licznik czasu. Od tej chwili Arduino wie: "zegar tyka, mierzymy".

Twoja funkcja `pulseIn(echoPin, HIGH)` w tym momencie wykrywa zbocze narastające na ECHO i też zaczyna mierzyć czas.

### Faza 4: Czekanie na echo

Sensor **nasłuchuje** na odbiorniku piezo (R), czekając, aż wróci odbita fala. W tym czasie pin ECHO **cały czas jest w HIGH**. To jest właśnie ten "zmienny" odcinek, którego długość = czas przelotu fali tam i z powrotem.

Co może się teraz wydarzyć:

**Wariant A — fala wraca:** Fala odbija się od przeszkody, wraca do odbiornika piezo (R), który wytwarza drobny sygnał elektryczny. Mikrokontroler wykrywa ten sygnał (po wzmocnieniu i filtracji) i **w tym momencie ustawia ECHO na LOW**. Koniec pomiaru.

**Wariant B — przeszkoda za blisko (<2 cm):** Po nadawaniu odbiornik jeszcze przez chwilę "wybrzmiewa" mechanicznie (jak dzwon). Sensor ignoruje sygnały przez pierwsze ~150 µs po nadawaniu (tzw. **strefa martwa**), żeby nie pomylić własnego echa z odbiciem. Dlatego obiekty bliżej niż **~2 cm są niewidoczne** dla HC-SR04.

**Wariant C — nic nie wraca (timeout):** Jeśli przez **~38 ms** nie pojawi się echo, sensor "poddaje się" i ustawia ECHO na LOW. To odpowiada zasięgowi ~6,5 m w jedną stronę — daleko poza zalecany maksymalny zasięg sensora (4 m). `pulseIn()` w takiej sytuacji zwraca pełną zmierzoną wartość timeoutu, a domyślny timeout `pulseIn()` to 1 sekunda — dlatego czasem warto podać własny: `pulseIn(echoPin, HIGH, 30000UL)`.

### Faza 5: Pin ECHO wraca do LOW

`pulseIn()` mierzy zbocze opadające i zwraca **długość trwania HIGH na pinie ECHO w mikrosekundach**.

### Co oznacza ta zmierzona liczba

To jest **całkowity czas podróży fali** — najpierw od sensora do przeszkody, potem z powrotem. Czyli **dwa razy odległość**.

Prędkość dźwięku w powietrzu (przy 20°C) wynosi ok. **343 m/s**, czyli **0,0343 cm/µs**.

Wzór:

```
odległość = (czas × prędkość_dźwięku) / 2

odległość [cm] = (czas [µs] × 0,0343) / 2
odległość [cm] = czas [µs] / 58,3      ← uproszczona wersja
```

Konkretny przykład: jeśli `pulseIn()` zwróci **5800 µs**, to:

- 5800 µs × 0,0343 cm/µs = 198,9 cm (cała trasa fali)
- 198,9 cm / 2 = **~100 cm odległości** od przeszkody

### Cała sekwencja na osi czasu

```
TRIG:   ─┐               ┌──┐
         │   (10 µs)     │  │
         └───────────────┘  └─────────────────────────────────────
         t=0             10 µs

         (sensor wewnętrznie nadaje 8 impulsów 40 kHz przez ~200 µs)

ECHO:  ──────────────────┐                              ┌─────────
                         │                              │
                         └──────────────────────────────┘
                       ~200 µs                       echo wróciło
                       (start)                       (lub timeout)
                                  ←  pulseIn mierzy  →
                                     TEN odcinek
```

### Kilka praktycznych konsekwencji dla kursu

**Zakres pomiarowy:** 2 cm – 400 cm (deklarowany), realnie wiarygodnie do ~250 cm.

**Rozdzielczość:** ok. **3 mm** — wynika z prędkości dźwięku i rozdzielczości czasowej Arduino (1 µs ≈ 0,17 mm w jedną stronę).

**Kąt wiązki:** ~15° — wąska wiązka z przodu, nie wykryje przeszkody z boku.

**Wpływ temperatury:** prędkość dźwięku rośnie ~0,6 m/s na każdy stopień Celsjusza. W praktyce dla kursu można przyjąć stałą wartość, ale warto wspomnieć uczniom, że profesjonalne układy korygują pomiar o temperaturę.

**Maksymalna częstotliwość pomiarów:** maksymalny pomiar trwa do ~38 ms, więc realnie da się robić **maksymalnie ~25 pomiarów na sekundę**. W kodzie z forbota `delay(500)` daje 2 pomiary/s — więcej niż wystarczająco do nauki.

**Materiały, które źle się mierzą:** miękkie, gąbczaste, tkaniny — pochłaniają fale i echo nie wraca. Powierzchnie pod ostrym kątem odbijają falę w bok zamiast z powrotem do sensora — czujnik wtedy "nie widzi" obiektu.

To wszystko warto pokazać uczniom na dniu 5 zjazdu (HC-SR04 — funkcje), zwłaszcza demonstrację strefy martwej i kąta widzenia — to robi wrażenie i pomaga zrozumieć, że to fizyczne urządzenie, nie magia.