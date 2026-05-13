
```cpp
void setup() {
  pinMode(8, OUTPUT); //Konfiguracja pinu 8 jako wyjście
  
  digitalWrite(8, HIGH); //Włączenie diody
  delay(2000); //Odczekanie 1 sekundy
  digitalWrite(8, LOW); //Wyłączenie diody
  delay(2000); //Odczekanie jednej sekundy
  
  digitalWrite(8, HIGH); //Włączenie diody
  delay(2000); //Odczekanie 1 sekundy
  digitalWrite(8, LOW); //Wyłączenie diody
  delay(2000); //Odczekanie jednej sekundy
}

void loop() {
  
}
```


# loop()
```cpp
void setup() {
  pinMode(8, OUTPUT); //Konfiguracja pinu 8 jako wyjście
}

void loop() {
  digitalWrite(8, HIGH); //Włączenie diody
  delay(2000); //Odczekanie 1 sekundy
  digitalWrite(8, LOW); //Wyłączenie diody
  
}
```
#### Przeanalizujmy kod krok po kroku:  
1. Uruchom funkcję setup i zainicjuj złącze o numerze 8 tak, aby działało jako wyjście.  
2. Uruchom funkcję loop i włącz wysoki sygnał na złączu o numerze 8 (włącz diodę LED).  
3. Odczekaj dwie sekundy.  
4. Podaj niski sygnał na złącze o numerze 8 (wyłącz diodę LED).  
5. Uruchom ponownie funkcję loop — przejdź z powrotem do punktu drugiego i ponownie włącz wysoki sygnał na złączu o numerze 8 (włącz diodę LED).
- Problem znajduje się pomiędzy punktem czwartym i piątym. Dioda jest wyłączana, ale jest natychmiast włączana ponownie. Dzieje się to tak szybko, że wydaje się, że dioda LED jest cały czas włączona.
- Mikrokontroler znajdujący się na płytce Arduino jest w stanie przetwarzać 16 milionów instrukcji na sekundę. Nie jest to wykonywanie 16 milionów poleceń napisanych w języku C, lecz pomimo tego jest to bardzo duża wartość. Dioda będzie wyłączona tylko przez niewielki ułamek sekundy. Aby rozwiązać ten problem, należy dodać kolejną funkcję opóźniającą delay po wyłączeniu diody LED.

```cpp
void setup() {
  pinMode(8, OUTPUT); //Konfiguracja pinu 8 jako wyjście
}

void loop() {
  digitalWrite(8, HIGH); //Włączenie diody
  delay(2000); //Odczekanie 1 sekundy
  digitalWrite(8, LOW); //Wyłączenie diody
  delay(2000); //Odczekanie jednej sekundy
}
```

#### Przeanalizujmy kod krok po kroku:  
1. Uruchom funkcję setup i zainicjuj złącze o numerze 8 tak, aby działało jako wyjście.  
2. Uruchom funkcję loop i włącz wysoki sygnał na złączu o numerze 8 (włącz diodę LED).  
3. Odczekaj dwie sekundy.  
4. Podaj niski sygnał na złącze o numerze 8 (wyłącz diodę LED).  
5. Odczekaj dwie sekundy. 
6. Uruchom ponownie funkcję loop — przejdź z powrotem do punktu drugiego i ponownie włącz wysoki sygnał na złączu o numerze 8 (włącz diodę LED).