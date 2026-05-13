
# Operatory w C++ / Arduino

Operator to symbol który mówi procesorowi co zrobić z wartościami. `a + b` — `+` to operator, `a` i `b` to operandy.

---

## 1. Arytmetyczne

```cpp
int a = 10;
int b = 3;

int suma    = a + b;  // 13
int roznica = a - b;  // 7
int iloczyn = a * b;  // 30
int iloraz  = a / b;  // 3  (dzielenie całkowite — reszta ginie!)
int reszta  = a % b;  // 1  (modulo — reszta z dzielenia)
```

**Uwaga na dzielenie całkowite:**
```cpp
int wynik = 10 / 3;    // 3  — nie 3.33!
float wynik = 10.0 / 3; // 3.333 — float ratuje sytuację
```

**Ogólna zasada — `int` zawsze przegrywa z `float`:**

Jeśli w dowolnym działaniu (`+`, `-`, `*`, `/`) jeden z operandów jest `float`, wynik zawsze jest `float`.

```cpp
int   a = 5;
float b = 2.0;

a + b   // 7.0  (float)
a - b   // 3.0  (float)
a * b   // 10.0 (float)
a / b   // 2.5  (float)
```

Wyjątek: gdy **oba** operandy są `int` — wynik jest `int` i reszta po dzieleniu ginie:
```cpp
int wynik = 9 / 5;      // 1  — nie 1.8!
float wynik = 9.0 / 5;  // 1.8 — wystarczy jeden float
```

**Modulo `%` w Arduino — przykład praktyczny:**
```cpp
// Miga diodą co 3 obieg pętli
if (i % 3 == 0) {
    digitalWrite(LED, HIGH);
}
```

---

## 2. Przypisania

```cpp
int x = 5;    // podstawowe przypisanie

x += 3;   // x = x + 3  →  8
x -= 2;   // x = x - 2  →  6
x *= 4;   // x = x * 4  →  24
x /= 6;   // x = x / 6  →  4
x %= 3;   // x = x % 3  →  1
```

Skróty `+=`, `-=` itp. to tylko wygoda — kompilator tłumaczy je identycznie jak pełną formę.

---

## 3. Inkrementacja i dekrementacja

```cpp
int i = 0;

i++;   // i = i + 1  →  1  (po użyciu)
i--;   // i = i - 1  →  0  (po użyciu)
++i;   // 1  (przed użyciem)
--i;   // 0  (przed użyciem)
```

**Różnica `i++` vs `++i`:**
```cpp
int a = 5;
int b = a++;  // b = 5, a = 6  (najpierw przypisz, potem zwiększ)
int c = ++a;  // c = 7, a = 7  (najpierw zwiększ, potem przypisz)
```

W prostych pętlach `i++` i `++i` dają ten sam efekt — różnica ma znaczenie tylko gdy używasz wartości w tym samym wyrażeniu.

```cpp
// Najczęstsze zastosowanie — licznik
int licznik = 0;

void loop() {
    licznik++;
    Serial.println(licznik);  // 1, 2, 3, 4...
    delay(1000);
}
```

---

## 4. Porównania

Zwracają `true` (1) lub `false` (0).

```cpp
int a = 5;
int b = 10;

a == b   // false — czy równe?
a != b   // true  — czy różne?
a < b    // true  — mniejsze?
a > b    // false — większe?
a <= b   // true  — mniejsze lub równe?
a >= b   // false — większe lub równe?
```

**Częsty błąd — jeden `=` zamiast dwóch `==`:**
```cpp
if (a = 5)  { }  // ❌ przypisanie! zawsze true, zmienia wartość a
if (a == 5) { }  // ✅ porównanie
```

**Przykład z czujnikiem:**
```cpp
int temperatura = analogRead(A0);

if (temperatura > 800) {
    digitalWrite(ALARM_PIN, HIGH);  // włącz alarm
}
```

---

## 5. Logiczne

Łączą kilka warunków w jeden.

```cpp
bool a = true;
bool b = false;

a && b   // false — AND: oba muszą być true
a || b   // true  — OR:  wystarczy jedno true
!a       // false — NOT: odwrócenie
```

**Przykład z Arduino:**
```cpp
int swiatlo = analogRead(A0);
int temperatura = analogRead(A1);

// Włącz wentylator gdy ciemno I gorąco
if (swiatlo < 200 && temperatura > 600) {
    digitalWrite(WENTYLATOR, HIGH);
}

// Włącz alarm gdy za gorąco LUB za zimno
if (temperatura > 900 || temperatura < 100) {
    digitalWrite(BUZZER, HIGH);
}

// Przełącz stan
bool aktywny = true;
aktywny = !aktywny;  // false
```

---

## 6. Bitowe (wprowadzenie)

Działają bezpośrednio na bitach — ważne przy sterowaniu rejestrami sprzętowymi.

```cpp
byte a = 0b00001111;  // 15
byte b = 0b11110000;  // 240

a & b   // 0b00000000 — AND: bit 1 tylko gdy oba 1
a | b   // 0b11111111 — OR:  bit 1 gdy choć jeden 1
a ^ b   // 0b11111111 — XOR: bit 1 gdy różne
~a      // 0b11110000 — NOT: odwrócenie wszystkich bitów
a << 1  // 0b00011110 — przesunięcie w lewo (×2)
a >> 1  // 0b00000111 — przesunięcie w prawo (÷2)
```

**Typowe zastosowanie — włączanie konkretnego pinu w rejestrze:**
```cpp
PORTB |= (1 << 3);   // ustaw bit 3 — szybsze niż digitalWrite
```

---

## Priorytet operatorów (kolejność działań)

Tak jak w matematyce `*` przed `+`, w C++ też obowiązuje kolejność:

```
Najwyższy:  !  ++  --  ~
            *  /  %
            +  -
            <  >  <=  >=
            ==  !=
            &
            ^
            |
            &&
            ||
Najniższy:  =  +=  -=  ...
```

**Zawsze używaj nawiasów gdy masz wątpliwości:**
```cpp
int wynik = 2 + 3 * 4;    // 14  (nie 20!)
int wynik = (2 + 3) * 4;  // 20  — nawiasy są zawsze bezpieczne
```

