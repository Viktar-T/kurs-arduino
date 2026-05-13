## UART — jak to działa od podstaw

### 1. Problem: jak wysłać dane przez jeden drut?

Komputer operuje na bajtach (8 bitów jednocześnie). Ale port szeregowy ma **jeden drut danych** — TX (nadawanie) i RX (odbieranie). Trzeba więc wysłać bity **jeden po drugim**, w czasie.

```
Bajt 'A' = 01000001  (binarnie)

Drut TX:  _|-|-|-|-|_|_|_|-|_
           S 1 0 0 0 0 0 1 0 E
           ↑                 ↑
         START              STOP
```

`S` = bit startowy (zawsze 0), `E` = bit stopowy (zawsze 1) — to sygnał "zaraz nadaję" i "skończyłem".

---

### 2. Skąd odbiornik wie kiedy próbkować?

Tu właśnie wchodzi **baud**. Obie strony umawiają się: _"jeden bit trwa X mikrosekund"_.

Przy 9600 baud:

```
1 bit = 1/9600 s ≈ 104 µs
```

Odbiornik co 104 µs "zagląda" na drut i zapisuje: 0 czy 1? Jak zegarki zsynchronizowane — ale **bez wspólnego zegara**. Każda strona liczy czas samodzielnie.

---

### 3. Dlaczego akurat te liczby? (300, 9600, 115200...)

Arduino ma kwarc **16 MHz**. Żeby uzyskać dokładny timing, procesor dzieli tę częstotliwość przez pewną liczbę całkowitą (tzw. prescaler):

```
16 000 000 Hz / 1667 ≈ 9600 baud  ✅ błąd: 0,2%
16 000 000 Hz / 139  ≈ 115200 baud ✅ błąd: 0,8%
```

Inne "niestandartowe" wartości dają za duży błąd:

```
16 000 000 Hz / 1600 = 10 000 baud ❌ błąd: ~4% → przekłamania
```

Dlatego lista standardowych prędkości jest z góry ustalona — to te, gdzie matematyka wychodzi wystarczająco dokładnie.

---

### 4. Dlaczego niezgodność = śmieci?

Wyobraź sobie: Arduino wysyła bit co **104 µs** (9600 bd), ale komputer próbkuje co **3333 µs** (300 bd).

```
Arduino wysyła:  |A|B|C|D|E|F|G|H|  ← 8 bitów
Komputer widzi:  |        ?        |  ← tylko 1 próbkę na 8 bitów
```

Komputer trafi losowo w środek jakiegoś bitu, odczyta losową wartość — stąd śmieci i kwadraty które widziałeś.

---

### Podsumowanie jednym zdaniem

> UART to umowa: _"wysyłam bity jeden po drugim, każdy trwa dokładnie 1/baud sekundy — bądź gotowy żeby je czytać z tą samą prędkością"_. Różne prędkości = głuchy telefon.