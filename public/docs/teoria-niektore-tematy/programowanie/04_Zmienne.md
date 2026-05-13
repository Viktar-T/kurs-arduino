- są wprowadzone na [[../../../40_materialy/forbot.pl|forbot.pl]] w # Kurs Arduino – #3 – UART (komunikacja z PC), zmienne.
---

---
# #define

Wyobraź sobie **#define** jako funkcję „znajdź i zamień” w edytorze tekstu. Zanim Twój kod zostanie faktycznie wysłany do kompilatora, narzędzie zwane **preprocesorem** przeszukuje Twój plik i wszędzie tam, gdzie znajdzie nazwę (np. `pinLED`), wstawia przypisaną jej wartość (np. `13`).
```cpp
#define pinG 8 // Preprocesor zamieni każde "pinG" na "8" przed kompilacją
const byte pinG = 8;
```
##### Porównanie w kontekście Arduino UNO R3

|**Cecha**|**#define**|**const byte / const int**|
|---|---|---|
|**Kiedy działa?**|Przed kompilacją (preprocesor)|Podczas kompilacji|
|**Czy zajmuje RAM?**|Nie|Zazwyczaj nie (kompilator optymalizuje stałe)|
|**Sprawdzanie błędów**|Bardzo słabe|Bardzo silne (bezpieczeństwo typu)|
|**Zasięg (Scope)**|Globalny (cały plik)|Można ograniczyć (np. tylko do jednej funkcji)|
**#define** nie jest wynalazkiem twórców Arduino. To narzędzie, które pochodzi z samego „serca” języków **C** oraz **C++**. 
#### Skąd się wzięło #define?
Dyrektywa **#define** jest częścią tzw. **preprocesora**. Jest to mechanizm stworzony dla języka **C** (powstałego w latach 70. XX wieku) i przejęty później przez **C++**. Ponieważ środowisko Arduino (Arduino IDE) używa kompilatora C++, możesz korzystać ze wszystkich dobrodziejstw tych języków.
#### Gdzie jeszcze używa się #define?
Spotkasz go niemal wszędzie, gdzie programuje się w C lub C++:
1. **Systemy operacyjne:** Jądro systemu **Linux** czy **Windows** zawiera tysiące linii kodu z **#define**. Służą one do definiowania parametrów sprzętowych, kodów błędów czy konfiguracji systemu.
2. **Inne mikrokontrolery:** Jeśli kiedyś przesiądziesz się z **Arduino UNO R3** na inne układy, np. **STM32**, **ESP32** czy profesjonalne sterowniki przemysłowe, nadal będziesz używać **#define**.
3. **Aplikacje komputerowe:** Gry komputerowe, programy graficzne czy przeglądarki internetowe pisane w C++ również z tego korzystają.

---
## 1. Gdzie mieszkają stałe (`const`), skoro nie w RAM?

Jeśli kompilator widzi `const byte pin = 8;`, to traktuje tę wartość jako element samego programu.

- **Miejsce przechowywania:** Stałe są "zaszyte" bezpośrednio w **pamięci Flash** (tam, gdzie trafia Twój kod).
    
- **Mechanizm:** Kompilator podczas tworzenia pliku binarnego po prostu wstawia liczbę `8` wszędzie tam, gdzie użyłeś nazwy `pin`. Nie musi tworzyć komórki w pamięci operacyjnej (RAM), żeby ją tam trzymać i stamtąd czytać. To tak, jakbyś w przepisie na ciasto zamiast pisać "ilość mąki" (zmienna), od razu napisał "2 szklanki" (stała).

### **Typ `int` (Integer)**

- **Rozmiar:** Na Arduino UNO to **2 bajty** (16 bitów), a nie 8!
    
- **Zakres:** od **-32 768** do **32 767**.
    
- **Kiedy używać?** Gdy potrzebujesz liczb ujemnych lub wartości większych niż 255 (np. odczyt z czujnika analogowego `analogRead`, który zwraca wartości do 1023).
    

### **Typ `byte`**

- **Rozmiar:** **1 bajt** (8 bitów).
    
- **Zakres:** od **0** do **255**. (Zawsze dodatnie!)
    
- **Twoja pomyłka:** Podałeś zakres -128 do 127 – to jest typ `char` lub `int8_t`. `byte` w Arduino jest zawsze **bezznakowy** (unsigned).
    
- **Kiedy używać?** Zawsze, gdy wartość mieści się w 0-255. Numery pinów, jasność LED (PWM), adresy urządzeń.
    

---

## 3. `const byte` vs `const int` – co wybrać?

Różnica polega na **precyzji i zajmowanej przestrzeni w kodzie**.

- Jeśli napiszesz `const int pin = 8;`, kompilator zarezerwuje w kodzie (Flash) miejsce na 2 bajty, mimo że liczba 8 mieści się w jednym.
    
- Jeśli napiszesz `const byte pin = 8;`, zużywasz tylko 1 bajt w pamięci programu.
    

**Zasada nauczyciela:** Na Arduino UNO zawsze walczymy o każdy bajt. Jeśli coś jest numerem pinu (0-19), zawsze używaj **`const byte`**.

## 4. Czy `#define` to naprawdę przeżytek?

Prawda jest pośrodku.

- **Dlaczego unikamy?** Bo `#define` nie ma typu. Jeśli napiszesz `#define PIN "osiem"`, kompilator może wyrzucić błąd w bardzo dziwnym miejscu, którego nie zrozumiesz.
    
- **Dlaczego `const` jest lepsze?** Bo jeśli napiszesz `const byte pin = "osiem"`, kompilator od razu powie: "Hej! Próbujesz wsadzić tekst do szuflady na małe liczby!". To ratuje Cię przed błędami, które trudno wyłapać w nocy podczas budowania projektu.

# char, char*
# '...' vs "..."
#### `" "` — cudzysłów podwójny = **string** (tekst)

```cpp
"A"   // to jest tablica: ['A', '\0'] — dwa bajty w pamięci
"Ala" // to jest tablica: ['A', 'l', 'a', '\0'] — cztery bajty
```

Zawsze kończy się `\0` (null terminator) — znak końca tekstu. Jest przechowywany **w pamięci**, a zmienna trzyma tylko **adres** do tego miejsca.

---

#### `' '` — cudzysłów pojedynczy = **char** (jeden znak)

```cpp
'A'   // to jest liczba 65 — jeden bajt
'B'   // to jest liczba 66 — jeden bajt
```

Bezpośrednio wartość — żadnego adresu, żadnego `\0`.

---

#### Porównanie

```cpp
char    litera = 'A';    // ✅ jeden bajt, wartość 65
char*   tekst  = "A";    // ✅ adres do tablicy ['A', '\0']

char    litera = "A";    // ❌ błąd: próbujesz wcisnąć adres do jednego bajtu
```

---

#### Analogia

Wyobraź sobie szafkę na listy:

- `'A'` → **wkładasz kartkę** z napisem A bezpośrednio do szafki
- `"A"` → **wkładasz kartkę** z adresem pokoju, w którym leży napis A

`char` to szafka na jedną kartkę. Nie zmieścisz tam adresu.

# Tabela ASCII
```cpp
const char litera = 'A'; // było: znak 'A' = wartość 65 
const char litera = 65; // bądzie wyświetlona 'A'
```

[https://pl.wikipedia.org/wiki/ASCII]

# Cwiczenia na typy danych
- Należy uważać na to, żeby nie przekroczyć zakresów poszczególnych typów danych. Jeżeli do zmiennej typu byte o wartości 255 dodasz 1, to w wyniku takiej operacji otrzymasz 0. Jeżeli do zmiennej typu int o wartości 32 767 dodasz 1, to w wyniku otrzymasz wartość –32 768.
```

```