/**
 * /narzedzia/rejestrator-csv — browser tool that records the CSV lines an
 * Arduino sends over USB (Web Serial) and saves them as a .csv file.
 * No installation, no backend: everything runs in the student's browser.
 * Built for the Monitorowanie project (part 4), works with any sketch that
 * sends a CSV header and data lines.
 */
import type { Metadata } from "next";
import Link from "next/link";

import { Callout } from "@/components/mdx";
import { Breadcrumb } from "@/components/ui";
import { SerialLogger } from "@/components/tools/SerialLogger";

export const metadata: Metadata = {
  title: "Rejestrator CSV — Kurs Arduino",
  description:
    "Odbiera pomiary z Arduino przez kabel USB, pokazuje je na żywo i zapisuje do pliku CSV. Działa w przeglądarce Chrome lub Edge, bez instalowania programów.",
};

export default function RejestratorCsvPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Kurs", href: "/" },
          { label: "Narzędzia" },
          { label: "Rejestrator CSV" },
        ]}
      />

      <article className="article-content max-w-none">
        <header className="mb-6">
          <p className="article-meta text-xs uppercase tracking-wider">
            Narzędzie · Projekt Monitorowanie
          </p>
          <h1 className="mt-1 text-3xl font-semibold">Rejestrator CSV</h1>
          <p className="article-summary mt-2 text-base">
            Odbiera linie danych, które Arduino wysyła kablem USB, pokazuje je na żywo
            i zapisuje do pliku CSV. Działa w przeglądarce, bez instalowania programów.
          </p>
        </header>

        <p>
          Arduino samo nie zapisze pliku na komputerze: potrafi tylko wysyłać tekst przez
          UART. Plik tworzy program po stronie komputera — tutaj jest nim ta strona. Pełni
          rolę rejestratora danych z systemu monitoringu: zbiera pomiary, pokazuje je jak
          ekran operatora i zapisuje do archiwum, czyli pliku CSV. Powstała do{" "}
          <Link href="/projekty/monitorowanie">projektu Monitorowanie</Link>, ale zapisze dane
          z każdego szkicu, który wysyła nagłówek i linie CSV.
        </p>

        <h2 id="jak-uzywac">Jak używać</h2>
        <ol>
          <li>
            Wgraj na płytkę szkic, który wysyła linie CSV, np.{" "}
            <code>stacja_monitoringu.ino</code>.
          </li>
          <li>
            <strong>Zamknij Monitor portu szeregowego i Serial Plotter</strong> w Arduino
            IDE. Port może mieć otwarty tylko jeden program naraz.
          </li>
          <li>
            Kliknij <strong>Połącz</strong> i wybierz port płytki (np. „COM3” albo nazwę
            z „Arduino” lub „USB”). Płytka się zrestartuje i najpierw wyśle nagłówek.
          </li>
          <li>
            Zbieraj pomiary tak długo, jak potrzebujesz. Na koniec kliknij{" "}
            <strong>Zapisz CSV</strong>. Plik trafi do folderu Pobrane.
          </li>
          <li>
            Zanim znowu wgrasz program z Arduino IDE, kliknij <strong>Rozłącz</strong>{" "}
            — inaczej port będzie zajęty.
          </li>
        </ol>

        <h2 id="kilka-zapisow">Kilka zapisów</h2>
        <p>
          Ten sam nagłówek po restarcie płytki nie przerywa zapisu: nowe pomiary są
          dopisywane do bieżącego. Gdy płytka wyśle nagłówek z innymi kolumnami (np. po
          wgraniu nowszej wersji szkicu), rejestrator zaczyna nowy zapis, a poprzedni
          odkłada na bok. Każdy odłożony zapis ma własny komunikat z przyciskami „Zapisz
          CSV”, „Zapisz CSV dla polskiego Excela” i „Odrzuć” i zostaje, dopóki go nie
          odrzucisz. Przycisk <strong>Wyczyść pomiary</strong> usuwa tylko bieżący zapis.
          Licznik odrzuconych linii w „Kontroli danych” też dotyczy bieżącego zapisu:
          liczy od nagłówka, który go zaczął.
        </p>

        <Callout type="note" title="Wymagania i prywatność">
          Rejestrator działa w przeglądarkach Google Chrome i Microsoft Edge na komputerze.
          Dane zostają na Twoim komputerze: strona niczego nie wysyła do internetu. Do
          czasu zapisania pliku pomiary są przechowywane w tej przeglądarce, więc
          przypadkowe zamknięcie karty ich nie skasuje.
        </Callout>
      </article>

      <section aria-label="Rejestrator" className="mt-8">
        <SerialLogger />
      </section>
    </>
  );
}
