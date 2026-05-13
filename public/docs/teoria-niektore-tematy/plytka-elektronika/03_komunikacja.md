# Komunikacja — przegląd protokołów

W elektronice wyróżniamy dwa główne typy komunikacji szeregowej:
1. **Synchroniczna (np. SPI, I2C):** Urządzenia są połączone dodatkowym przewodem zegarowym (**CLK** lub **SCK**). Nadajnik wysyła impulsy zegara, które mówią odbiorcy dokładnie, w którym momencie ma odczytać kolejny bit danych.
2. **Asynchroniczna (UART):** Nie ma wspólnego przewodu zegarowego. Urządzenia „nie wiedzą” o sobie nawzajem, kiedy dokładnie nastąpi transmisja, dopóki się ona nie rozpocznie.

Arduino UNO obsługuje trzy główne protokoły komunikacji szeregowej. Każdy ma inne zastosowanie, inną liczbę przewodów i inną prędkość.

## Porównanie protokołów

| Protokół | Przewody danych | Topologia | Prędkość | Typowe zastosowanie |
|---|---|---|---|---|
| **UART** | 2 (TX, RX) | punkt–punkt | do 115 200 bps | Monitor PC, moduły GPS, Bluetooth |
| **SPI** | 4 (MOSI, MISO, SCK, SS) | master–slave | do kilku MHz | karty SD, wyświetlacze, przetworniki ADC |
| **I2C** | 2 (SDA, SCL) | magistrala (wiele urządzeń) | 100–400 kHz | czujniki, LCD, ekspandery |

## Kiedy wybrać który protokół

- **UART** — gdy komunikujesz się z PC lub modułem (GPS, HC-05 Bluetooth, HC-SR04 w trybie serial). Jeden nadawca, jeden odbiornik.
- **SPI** — gdy potrzebujesz dużej prędkości (wyświetlacz TFT, karta SD). Więcej przewodów, ale szybszy.
- **I2C** — gdy masz wiele czujników i mało pinów. Wszystko na dwóch przewodach (SDA + SCL), każde urządzenie ma unikalny adres (np. 0x68 dla MPU-6050).

## Piny na Arduino UNO

```
UART:  TX → pin 1,  RX → pin 0
SPI:   MOSI → 11,  MISO → 12,  SCK → 13,  SS → 10
I2C:   SDA → A4,   SCL → A5
```

Szczegóły każdego protokołu w osobnych plikach:
- [[03.01_komunikacja-UART|UART]]
- [[03.02_komunikacja-SPI|SPI]]
- [[03.03_komunikacja-I2C|I2C]]
