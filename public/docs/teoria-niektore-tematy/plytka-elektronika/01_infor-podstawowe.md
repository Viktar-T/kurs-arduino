# Arduino UNO — informacje podstawowe

Arduino UNO to płytka prototypowa oparta na mikrokontrolerze **ATmega328P** (AVR, 8-bit, 16 MHz). Jest najpopularniejszą płytką Arduino — większość tutoriali i bibliotek jest pisana właśnie pod UNO.

## Kluczowe parametry

| Parametr | Wartość |
|---|---|
| Mikrokontroler | ATmega328P |
| Napięcie robocze | 5V |
| Napięcie zasilania (zewnętrzne) | 7–12V (zalecane) |
| Piny cyfrowe I/O | 14 (w tym 6 PWM) |
| Piny analogowe wejściowe | 6 (A0–A5) |
| Prąd na pin cyfrowy | max 40 mA |
| Flash (pamięć programu) | 32 KB |
| SRAM (RAM) | 2 KB |
| EEPROM | 1 KB |
| Częstotliwość zegara | 16 MHz |

## Co oznaczają te liczby w praktyce

- **16 MHz** → procesor wykonuje ~16 milionów prostych instrukcji na sekundę
- **2 KB RAM** → bardzo mało; każda zmienna kosztuje; `String` i `float` są drogie
- **32 KB Flash** → tu mieszka Twój kod; stałe `const` też tu trafiają
- **5V / 40 mA na pin** → bezpośrednio można zasilić diodę LED (przez rezystor); silnik DC wymaga sterownika (mostek H)

## Układ pinów (pinout)

Piny podzielone są na grupy — każda ma inną funkcję:

- **Cyfrowe 0–13** — wejście lub wyjście, stan HIGH (5V) lub LOW (0V)
- **PWM: 3, 5, 6, 9, 10, 11** — sygnał PWM (pseudo-analogowe wyjście)
- **Analogowe A0–A5** — przetwornik ADC, odczyt napięcia 0–5V → wartość 0–1023
- **TX/RX (0, 1)** — komunikacja szeregowa UART z PC
- **SDA/SCL (A4/A5)** — magistrala I2C
- **MOSI/MISO/SCK/SS (10–13)** — magistrala SPI
