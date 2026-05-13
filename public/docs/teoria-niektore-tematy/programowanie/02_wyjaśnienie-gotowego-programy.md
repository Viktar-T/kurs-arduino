# Przykładowy program który posiada wszystko czemu musze nauczyć.
	1. Kompilator po dokonaniu optymalizacji zapisuje program w języku asemblera, a następnie dopiero przechodzi na kod maszynowy. Wszystkie te pliki możemy podejrzeć w katalogu z naszym projektem. **.HEX,** to plik wykonywalny, natomiast w plikach **.LSS** i **.LST** znajdują się komendy asemblerowe oraz ich maszynowe odpowiedniki.

---
# C lub C++ lub Arduino Language?

Krótka odpowiedź brzmi: **Arduino programujemy w języku C++, który jest oparty na języku C.**

W praktyce wygląda to tak:

1. **Język C**: To fundament. Z niego pochodzi większość składni, którą będziesz widzieć: instrukcje warunkowe (`if`), pętle (`for`, `while`), typy zmiennych (`int`, `char`, `float`) oraz sposób operowania na rejestrach procesora **ATmega328P**.
    
2. **Język C++**: Arduino wykorzystuje jego najważniejszą cechę – **programowanie obiektowe**. Kiedy będziesz używać komend takich jak `Serial.print()` czy obsługiwać wyświetlacze i czujniki za pomocą bibliotek, będziesz korzystać właśnie z obiektów C++.
    
3. **Arduino Language**: Często spotkasz się z tym określeniem. To nie jest osobny język, a raczej zestaw gotowych funkcji i ułatwień przygotowanych przez twórców Arduino (tzw. _wiring_), które sprawiają, że nie musisz znać bardzo skomplikowanych aspektów C++, aby zacząć.
## Dlaczego to ważne dla Twojego Arduino UNO R3?

Twoja płytka posiada mikrokontroler **ATmega328P**. On nie rozumie bezpośrednio języka C++. Kiedy klikasz przycisk "Wgraj" w programie:

- **Kompilator (avr-gcc)** zamienia Twój kod C/C++ na **kod maszynowy** (zera i jedynki).
    
- Ten kod jest przesyłany kablem USB do pamięci Flash Twojego Arduino.
    

Dzięki temu, że używamy C++, Twój kod jest bardzo wydajny, co jest kluczowe, bo UNO R3 ma tylko **32 KB** pamięci na program – to bardzo mało w porównaniu do komputera czy smartfona!



---
# prezentacja AI asystenta do **wyjaśnienia** kodu.
