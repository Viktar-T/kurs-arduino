- 
## Teoria: Komunikacja Równoległa vs Szeregowa

Każda litera, którą chcesz wyświetlić (np. litera 'A'), jest w pamięci mikrokontrolera zapisana jako **1 bajt**, czyli równe **8 bitów** (jedynek i zer). W przypadku litery 'A' jest to kod: `01000001`.

Z mikrokontrolera do ekranu możemy wysłać ten kod na dwa sposoby:

**1. Sposób Szeregowy (np. UART, I2C, SPI) - Jeden za drugim** To sposób, o którym wspomniałeś. Używamy tylko jednego kabla komunikacyjnego (np. pinu **TX** – transmisji). Mikrokontroler wysyła bity "gęsiego", jeden po drugim: najpierw `0`, potem `1`, potem `0` itd.

- **Zaleta:** Bardzo mało kabli (oszczędność pinów).
    
- **Wymaganie:** Odbiorca musi być bardzo inteligentny. Musi posiadać wbudowany układ czasowy, aby wiedzieć, z jaką prędkością nadajesz (tzw. _Baud Rate_) i precyzyjnie łapać bity w locie, by na końcu złożyć z nich z powrotem literę 'A'.
    

**2. Sposób Równoległy (tak działa Twój LCD) - Wszystko naraz** Wyobraź sobie 8 równoległych kabli. Mikrokontroler na pierwszym kablu ustawia `0` (0V), na drugim `1` (5V), na trzecim `0` (0V) i tak dalej. Następnie wysyła sygnał na pin **E** (Enable - ten nasz "Enter"), mówiąc: _"Czytaj wszystkie 8 kabli w tej sekundzie!"_.

- **Zaleta:** Komunikacja jest potwornie szybka (wszystko idzie w jednym takcie) i sprzętowo bardzo prosta.
    
- **Wada:** Zużywa ogromną liczbę kabli i pinów.
    

Twój ekran pracuje w trybie równoległym. Używanie **4 pinów (D4-D7)**, jak ustaliliśmy wcześniej, to tylko sztuczka Arduino – dzieli 8 bitów na dwie czwórki i wysyła najpierw pierwszą czwórkę, a zaraz potem drugą, żeby oszczędzić chociaż te 4 kable.

### Dlaczego wyświetlacz nie używa UART? (Problem sprzętowy)

Odpowiedź jest brutalna: **ponieważ jego mózg jest z lat 80.**

Sercem Twojego wyświetlacza LCD jest układ scalony o nazwie **HD44780** (to ta czarna "kropka" twardego kleju z tyłu płytki ekranu). Został on zaprojektowany przez firmę Hitachi kilkadziesiąt lat temu. W tamtych czasach układy cyfrowe najchętniej rozmawiały ze sobą właśnie za pomocą prostych sygnałów równoległych.

Ten konkretny układ po prostu **nie potrafi mówić w języku UART, I2C czy SPI**. Nie ma wbudowanych "tłumaczy" sprzętowych dla tych nowocześniejszych protokołów. Jest głuchy na wszystko inne poza jednoczesnym uderzeniem napięcia na kilku pinach.

### Rozwiązanie: Jak profesjonaliści zmniejszają ilość kabli do dwóch?

Twoja intuicja podpowiada Ci doskonale. Skoro podłączanie 6 kabli (RS, E, D4, D5, D6, D7) do Arduino UNO jest marnotrawstwem pinów, to inżynierowie wymyślili rozwiązanie: **Konwerter / Ekspander I2C (PCF8574)**.

Zarówno w kursach Forbota (często w późniejszych modułach), jak i w książkach, bardzo szybko odchodzi się od podłączania ekranu bezpośrednio. Zamiast tego, do tyłu ekranu LCD przylutowuje się malutką płytkę (tzw. konwerter I2C).

**Jak to działa?**

1. Twoje **Arduino UNO R3** komunikuje się z tą malutką płytką za pomocą protokołu **I2C** (bardzo podobnego do UART, ale przeznaczonego do komunikacji między układami na krótkich dystansach).
    
2. Protokół **I2C** używa zaledwie **dwóch pinów** na Twoim UNO: wejść analogowych **A4 (SDA - linia danych)** oraz **A5 (SCL - linia zegara)**.
    
3. Konwerter odbiera dane szeregowo po dwóch kabelkach, a następnie – jako że jest przylutowany bezpośrednio do 16 nóżek ekranu – sam fizycznie, sprzętowo "rozpakowuje" te dane i steruje sygnałami równoległymi za Ciebie!
    

Dzięki temu na płytce Arduino zajmujesz tylko 2 piny (A4 i A5) zamiast 6, zyskując potężną ilość miejsca na czujniki. Zasilanie podpinasz tylko do 5V i GND.