# **`setup()`** i **`loop()`**
- Musisz zrozumieć, że w przytoczonym przykładzie nie wywołujesz funkcji setup oraz loop tak, jak wcześniej wywoływaliśmy funkcję digitalWrite. Tworzysz te funkcje po to, aby Arduino mogło je samodzielnie wywoływać.
- Podział na **`setup()`** i **`loop()`** to genialne posunięcie pedagogiczne, które idealnie pasuje do elektroniki:
	1. **`setup()` (Konfiguracja):** W elektronice zawsze musisz najpierw „ustawić” sprzęt. Na Twoim **UNO R3** musisz zdecydować, który pin jest wejściem, a który wyjściem (**`pinMode`**), albo uruchomić komunikację szeregową (**`Serial.begin`**). Robisz to raz, bo piny nie zmieniają swojej roli co sekundę.
	2. **`loop()` (Działanie):** Mikrokontrolery nie działają tak jak programy na komputerze (które się kończą). Urządzenie elektroniczne (np. termometr lub sterownik bramy) musi pracować **non-stop**. Dlatego potrzebujemy pętli, która sprawdza stan czujników tysiące razy na sekundę.
### Teoria: Ukryta funkcja `main()`

W standardowym języku C lub C++ (używanym do pisania programów na Windowsa, Linuxa czy inne mikrokontrolery) punktem startowym programu **zawsze** jest funkcja o nazwie **`int main()`**.

Twórcy Arduino chcieli jednak ułatwić życie początkującym i ukryli tę funkcję przed Tobą. Gdybyś zajrzał głęboko w pliki systemowe środowiska Arduino, znalazłbyś fragment kodu, który wygląda mniej więcej tak:

C++

```cpp
// Tak wygląda ukryty fragment kodu w systemie Arduino
int main(void) {
    init();          // Inicjalizacja sprzętowa mikrokontrolera ATmega328P
    setup();         // Wywołanie Twojej funkcji setup() raz
    
    for (;;) {       // Nieskończona pętla (to samo co while(1))
        loop();      // Wywoływanie Twojej funkcji loop() w kółko
        if (serialEventRun) serialEventRun();
    }
    return 0;
}
```

# funkcja **`digitalWrite()`**
- Gdybyś otworzył plik `wiring_digital.c` w rdzeniu Arduino, zobaczyłbyś, że `digitalWrite()` wykonuje kilka kroków.:
	- C:\Users\Vikta\AppData\Local\Arduino15\packages\arduino\hardware\avr\1.8.7\cores\arduino
- `digitalWrite()` jest bezpieczna, ale... dość wolna. Wykonanie tej funkcji zajmuje około **3-5 mikrosekund** (około 50-80 cykli zegara). Gdybyś pisał bezpośrednio do rejestrów (np. `PORTB |= (1 << 5);`), zajęłoby to tylko **1 cykl zegara (0.0625 mikrosekundy)**!

**Dlaczego więc nie piszemy zawsze do rejestrów?**

- `digitalWrite(13, HIGH)` zadziała na Arduino UNO, Leonardo i Mega.   
- Kod na rejestrach napisany dla UNO nie zadziała na innych płytkach, bo mają inne procesory i inne mapowanie pinów.

> **Ciekawostka:** Jeśli budujesz bardzo szybki projekt (np. sterownik silnika krokowego o wysokiej częstotliwości), wtedy warto zrezygnować z `digitalWrite()` na rzecz operacji na portach, o których uczy m.in. **Kurs Arduino Poziom 2**.