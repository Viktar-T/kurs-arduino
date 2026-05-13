### pin Vin to "wejście/wyjście"
Jak to działa krok po kroku:

Kiedy podłączasz baterię 9 V do gniazda DC Jack, napięcie przechodzi przez diodę zabezpieczającą przed odwrotną polaryzacją i trafia na pin **Vin** (z niewielkim spadkiem ~0,7 V, czyli ok. 8,3 V). Dopiero stamtąd idzie do stabilizatora, który robi z tego 5 V dla mikrokontrolera. Pin Vin jest dwukierunkowy: możesz przez niego _zasilać_ Arduino, albo _pobierać_ z niego nieustabilizowane napięcie wejściowe.

Dlaczego nie 5 V z Arduino?

Silnik DC potrzebuje więcej mocy niż logika sterownika. Gdybyś poprowadził zasilanie silnika z pinu **5V**, prąd silnika (typowo 200–500 mA, a w skoku rozruchowym jeszcze więcej) przeszedłby przez **wbudowany stabilizator 5 V Arduino** — a ten ma limit ok. 800 mA i przy obciążeniu szybko się przegrzeje albo spali. Vin omija stabilizator i daje silnikowi pełne napięcie baterii bezpośrednio z gniazda DC.

Dlaczego nie 9 V?

W Arduino UNO **nie ma pinu oznaczonego "9V"** — jest tylko Vin (czyli to, co podałeś na wejściu, cokolwiek to było: 7 V, 9 V, 12 V). Stąd ta nazwa: "Voltage IN".