"use client";

/**
 * Rejestrator CSV — live dashboard and CSV export for lines an Arduino sends
 * over USB. The engine (Web Serial, parsing, browser storage, CSV builder)
 * lives in `lib/serial-logger.ts`; this component only renders its state.
 *
 * Column names, units and the data checks follow the Monitorowanie project
 * spec (`content/projekty/monitorowanie/00-wprowadzenie.mdx` §4.4 and §4.7);
 * any other sketch that sends a CSV header still works with generic labels.
 */
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";

import {
  buildCsv,
  formatComputerTime,
  isNonNumberField,
  isNumberField,
  isSerialSupported,
  serialLogger,
  type CsvVariant,
  type LoggerNotice,
  type LoggerRow,
  type LoggerStatus,
  type Recording,
} from "@/lib/serial-logger";
import { Table } from "@/components/ui";
import { Sparkline, type SparkPoint } from "./Sparkline";

const COLUMN_INFO: Record<string, { label: string; unit: string }> = {
  swiatlo: { label: "Światło (odczyt 0–1023)", unit: "" },
  wiatr_m_s: { label: "Wiatr", unit: "m/s" },
  T_szafa_C: { label: "Temperatura w szafie", unit: "°C" },
  T_modul_C: { label: "Temperatura modułu PV", unit: "°C" },
  T_otoczenie_C: { label: "Temperatura otoczenia", unit: "°C" },
  wilgotnosc_proc: { label: "Wilgotność", unit: "%RH" },
  T_dht_C: { label: "Temperatura (DHT11)", unit: "°C" },
};

const TIME_COLUMN = "czas_ms";
const BAUD_RATES = [9600, 19200, 38400, 57600, 115200];
const CHART_POINTS = 150;
const TABLE_ROWS = 10;
/** Expected gap between lines is 2 s; warn after this much silence. */
const SILENCE_WARNING_MS = 6000;

const STATUS_LABEL: Record<LoggerStatus, string> = {
  idle: "Nie połączono",
  connecting: "Łączenie…",
  connected: "Połączono — odbieram dane",
  closing: "Rozłączanie…",
};

const STATUS_DOT: Record<LoggerStatus, string> = {
  idle: "bg-slate-400",
  connecting: "bg-amber-500",
  connected: "bg-[var(--forbot-green)]",
  closing: "bg-amber-500",
};

const NOTICE_STYLE: Record<LoggerNotice["tone"], string> = {
  info: "border-[var(--forbot-line)] bg-[var(--forbot-green-soft)]",
  warning: "border-[var(--forbot-warning-line)] bg-[var(--forbot-warning)]",
  error: "border-[var(--forbot-danger-line)] bg-[var(--forbot-danger)]",
};

const BUTTON =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const BUTTON_PRIMARY = `${BUTTON} bg-[var(--forbot-green-dark)] text-white hover:bg-[#005c4a]`;
const BUTTON_SECONDARY = `${BUTTON} border border-[var(--forbot-line)] bg-white text-[#243236] hover:border-[var(--forbot-green)]`;

const noSubscription = () => () => {};

/** `null` while rendering on the server / hydrating. */
function useSerialSupport(): boolean | null {
  return useSyncExternalStore(noSubscription, isSerialSupported, () => null);
}

function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function columnLabel(name: string) {
  return COLUMN_INFO[name]?.label ?? name;
}

function columnUnit(name: string) {
  return COLUMN_INFO[name]?.unit ?? "";
}

function isTemperatureColumn(name: string) {
  return name.startsWith("T_");
}

function isSuspiciousTemperature(field: string) {
  return isNumberField(field) && [-127, 85].includes(Number(field));
}

/** "1 pomiar", "3 pomiary", "12 pomiarów". */
function measurements(count: number) {
  const tens = count % 100;
  const units = count % 10;
  if (count === 1) return "1 pomiar";
  if (units >= 2 && units <= 4 && (tens < 12 || tens > 14)) return `${count} pomiary`;
  return `${count} pomiarów`;
}

function formatBoardTime(ms: number) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mmss = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return h > 0 ? `${h}:${mmss}` : mmss;
}

function fileName(variant: CsvVariant, rows: LoggerRow[]) {
  const stamp = formatComputerTime(rows[0]?.receivedAt ?? Date.now())
    .replace(" ", "_")
    .replaceAll(":", "-")
    .slice(0, 16);
  return `pomiary_${stamp}${variant === "excel-pl" ? "_excel" : ""}.csv`;
}

function download(text: string, name: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Counts used by the "Kontrola danych" panel. */
function checkData(header: string[], rows: LoggerRow[]) {
  let emptyFields = 0;
  let nonNumbers = 0;
  let suspicious = 0;
  for (const row of rows) {
    row.fields.forEach((field, i) => {
      if (field === "") emptyFields += 1;
      else if (isNonNumberField(field)) nonNumbers += 1;
      else if (isTemperatureColumn(header[i]) && isSuspiciousTemperature(field))
        suspicious += 1;
    });
  }
  return { emptyFields, nonNumbers, suspicious };
}

function Notice({
  tone,
  children,
}: {
  tone: LoggerNotice["tone"];
  children: React.ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-md border px-4 py-3 text-sm leading-6 text-[#243236] ${NOTICE_STYLE[tone]}`}
    >
      {children}
    </div>
  );
}

export function SerialLogger() {
  const supported = useSerialSupport();
  const state = useSyncExternalStore(
    serialLogger.subscribe,
    serialLogger.getSnapshot,
    serialLogger.getServerSnapshot,
  );
  const now = useNow(1000);
  const [baudRate, setBaudRate] = useState(9600);

  const { status, header, rows, setAside, withComputerTime } = state;
  const recording: Recording | null = header ? { header, rows } : null;
  const timeIndex = header ? header.indexOf(TIME_COLUMN) : -1;
  const lastRow = rows.at(-1);

  const checks = useMemo(
    () => (header ? checkData(header, rows) : null),
    [header, rows],
  );

  const tiles = useMemo(() => {
    if (!header) return [];
    const recent = rows.slice(-CHART_POINTS);
    return header
      .map((name, index) => ({ name, index }))
      .filter(({ name }) => name !== TIME_COLUMN)
      .map(({ name, index }) => {
        let decimals = 0;
        const points: SparkPoint[] = recent.map((row) => {
          const field = row.fields[index];
          // Error codes (-127, 85) would flatten the chart: draw them as gaps.
          const usable =
            isNumberField(field) &&
            !(isTemperatureColumn(name) && isSuspiciousTemperature(field));
          if (usable) decimals = Math.max(decimals, field.split(".")[1]?.length ?? 0);
          return {
            value: usable ? Number(field) : null,
            label: formatComputerTime(row.receivedAt).slice(11),
          };
        });
        return { name, index, points, decimals };
      });
  }, [header, rows]);

  if (supported === null) {
    return <p className="text-sm text-[var(--article-muted)]">Sprawdzam przeglądarkę…</p>;
  }

  if (!supported) {
    return (
      <Notice tone="error">
        <p className="font-semibold">Ta przeglądarka nie obsługuje połączenia z płytką</p>
        <p className="mt-1">
          Rejestrator korzysta z interfejsu Web Serial, którego ta przeglądarka nie
          udostępnia. Otwórz tę stronę w przeglądarce Google Chrome albo Microsoft Edge
          na komputerze (Windows, macOS, Linux).
        </p>
      </Notice>
    );
  }

  const connected = status === "connected";
  // After a pause, count from "Połącz", not from the last line before the pause.
  const silentFor =
    connected && lastRow
      ? now - Math.max(lastRow.receivedAt, state.connectedAt ?? 0)
      : 0;
  const showGarbageWarning =
    connected && rows.length === 0 && state.rejectedLines >= 3;

  function save(variant: CsvVariant, data: Recording) {
    download(buildCsv(data, { variant, withComputerTime }), fileName(variant, data.rows));
  }

  function clear() {
    const ok = window.confirm(
      `Usunąć bieżący zapis (${measurements(rows.length)})? Pomiary, których nie zapisano do pliku CSV, przepadną.` +
        (setAside.length > 0
          ? ` Odłożone zapisy (${setAside.length}) zostaną — każdy z nich usuniesz przyciskiem „Odrzuć” w jego komunikacie.`
          : ""),
    );
    if (ok) serialLogger.clear();
  }

  return (
    <div className="space-y-6">
      {/* ── Połączenie ── */}
      <section className="forbot-panel space-y-4 px-4 py-4" aria-label="Połączenie z płytką">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={BUTTON_PRIMARY}
            onClick={() => serialLogger.connect(baudRate)}
            disabled={status !== "idle"}
          >
            Połącz
          </button>
          <button
            type="button"
            className={BUTTON_SECONDARY}
            onClick={() => serialLogger.disconnect()}
            disabled={!connected}
          >
            Rozłącz
          </button>
          <label className="flex items-center gap-2 text-sm text-[#243236]">
            Prędkość
            <select
              value={baudRate}
              onChange={(event) => setBaudRate(Number(event.target.value))}
              disabled={status !== "idle"}
              className="rounded-md border border-[var(--forbot-line)] bg-white px-2 py-1.5 text-sm"
            >
              {BAUD_RATES.map((rate) => (
                <option key={rate} value={rate}>
                  {rate} baud
                </option>
              ))}
            </select>
          </label>
          <p className="flex items-center gap-2 text-sm font-semibold text-[#243236] sm:ml-auto">
            <span aria-hidden className={`inline-block h-2.5 w-2.5 rounded-full ${STATUS_DOT[status]}`} />
            {STATUS_LABEL[status]}
            {state.portLabel && (
              <span className="font-normal text-[var(--article-muted)]">({state.portLabel})</span>
            )}
          </p>
        </div>

        <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-[var(--article-muted)]">Zebrane pomiary</dt>
            <dd className="text-lg font-semibold text-[#111]">{rows.length}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--article-muted)]">Pierwszy pomiar (czas komputera)</dt>
            <dd className="text-lg font-semibold text-[#111]">
              {rows[0] ? formatComputerTime(rows[0].receivedAt).slice(11) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--article-muted)]">Czas płytki (czas_ms)</dt>
            <dd className="text-lg font-semibold text-[#111]">
              {lastRow && timeIndex >= 0 && isNumberField(lastRow.fields[timeIndex])
                ? formatBoardTime(Number(lastRow.fields[timeIndex]))
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--article-muted)]">Ostatnia linia</dt>
            <dd className="text-lg font-semibold text-[#111]">
              {lastRow ? `${Math.max(0, Math.round((now - lastRow.receivedAt) / 1000))} s temu` : "—"}
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Komunikaty ── */}
      {state.notice && (
        <Notice tone={state.notice.tone}>
          <div className="flex items-start justify-between gap-3">
            <p>{state.notice.text}</p>
            <button
              type="button"
              onClick={serialLogger.dismissNotice}
              className="shrink-0 text-xs font-semibold underline"
            >
              Zamknij
            </button>
          </div>
        </Notice>
      )}

      {state.restoredAt && rows.length > 0 && !connected && (
        <Notice tone="info">
          Przywrócono z pamięci tej przeglądarki {measurements(rows.length)} (
          {formatComputerTime(state.restoredAt).slice(0, 16)}). Możesz je zapisać do pliku
          albo połączyć się z płytką — nowe pomiary zostaną dopisane. Żeby zacząć bieżący
          zapis od zera, kliknij „Wyczyść pomiary”.
        </Notice>
      )}

      {showGarbageWarning && (
        <Notice tone="warning">
          Odbierane znaki nie wyglądają jak linie CSV. Sprawdź, czy prędkość w rejestratorze
          zgadza się z <code>Serial.begin()</code> w szkicu (w projekcie: 9600) i czy na
          płytce jest wgrany właściwy program.
        </Notice>
      )}

      {connected && silentFor > SILENCE_WARNING_MS && (
        <Notice tone="warning">
          Od {Math.round(silentFor / 1000)} s nie przyszła żadna linia. Czy płytka jest
          podłączona i czy program wysyła dane?
        </Notice>
      )}

      {state.headerSource === "spec" && (
        <Notice tone="info">
          Nie odebrano nagłówka, więc nazwy kolumn przyjęto ze specyfikacji projektu
          Monitorowanie. Żeby odebrać prawdziwy nagłówek, rozłącz i połącz ponownie albo
          naciśnij przycisk RESET na płytce.
        </Notice>
      )}

      {setAside.map((recording) => {
        // "2026-10-15 12:05–12:40", or one time when it fits in a minute.
        const start = formatComputerTime(recording.rows[0].receivedAt).slice(0, 16);
        const end = formatComputerTime(recording.rows.at(-1)!.receivedAt).slice(0, 16);
        const span = start === end ? start : `${start}–${end.slice(11)}`;
        return (
          <Notice key={recording.id} tone="warning">
            <p>
              Poprzedni zapis ({measurements(recording.rows.length)} z {span}, kolumny:{" "}
              <code>{recording.header.join(",")}</code>) czeka na pobranie.
              Zostaje tutaj, dopóki go nie odrzucisz.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className={BUTTON_SECONDARY} onClick={() => save("original", recording)}>
                Zapisz CSV
              </button>
              <button type="button" className={BUTTON_SECONDARY} onClick={() => save("excel-pl", recording)}>
                Zapisz CSV dla polskiego Excela
              </button>
              <button
                type="button"
                className={BUTTON_SECONDARY}
                onClick={() => serialLogger.discardSetAside(recording.id)}
              >
                Odrzuć
              </button>
            </div>
          </Notice>
        );
      })}

      {/* ── Bieżące wartości ── */}
      <section aria-label="Bieżące wartości">
        <h2 className="mb-3 text-lg font-bold text-[#111]">Bieżące wartości</h2>
        {tiles.length === 0 ? (
          <p className="text-sm text-[var(--article-muted)]">
            {connected
              ? "Czekam na nagłówek i pierwsze pomiary…"
              : "Połącz się z płytką, żeby zobaczyć pomiary."}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map(({ name, index, points, decimals }) => {
              const field = lastRow?.fields[index] ?? "";
              const unit = columnUnit(name);
              return (
                <article key={name} className="forbot-card px-4 py-3">
                  <p className="text-xs text-[var(--article-muted)]">
                    {columnLabel(name)} <code className="text-[11px]">{name}</code>
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[#111]">
                    {field === "" ? (
                      <span className="text-base font-normal text-[var(--article-muted)]">
                        brak pomiaru
                      </span>
                    ) : (
                      <>
                        {field}
                        {unit && <span className="ml-1 text-base font-normal">{unit}</span>}
                      </>
                    )}
                  </p>
                  <div className="mt-2">
                    <Sparkline
                      points={points}
                      unit={unit}
                      decimals={decimals}
                      title={columnLabel(name)}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Zapis ── */}
      <section className="forbot-panel space-y-3 px-4 py-4" aria-label="Zapis do pliku">
        <h2 className="text-lg font-bold text-[#111]">Zapis do pliku CSV</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={BUTTON_PRIMARY}
            disabled={!recording || rows.length === 0}
            onClick={() => recording && save("original", recording)}
          >
            Zapisz CSV
          </button>
          <button
            type="button"
            className={BUTTON_PRIMARY}
            disabled={!recording || rows.length === 0}
            onClick={() => recording && save("excel-pl", recording)}
          >
            Zapisz CSV dla polskiego Excela
          </button>
          <button
            type="button"
            className={`${BUTTON_SECONDARY} sm:ml-auto`}
            disabled={rows.length === 0}
            onClick={clear}
          >
            Wyczyść pomiary
          </button>
        </div>
        <label className="flex items-start gap-2 text-sm text-[#243236]">
          <input
            type="checkbox"
            checked={withComputerTime}
            onChange={(event) => serialLogger.setWithComputerTime(event.target.checked)}
            className="mt-1"
          />
          <span>
            Dodaj na początku kolumnę <code>czas_pc</code> z datą i godziną komputera
            (Arduino nie ma zegara — <code>czas_ms</code> liczy tylko czas od startu płytki).
          </span>
        </label>
        <p className="text-xs leading-5 text-[var(--article-muted)]">
          „Zapisz CSV” zapisuje linie dokładnie tak, jak wysłała je płytka (przecinki między
          kolumnami, kropka w liczbach). Wersja „dla polskiego Excela” ma średniki i przecinki
          dziesiętne, więc otwiera się poprawnie podwójnym kliknięciem.
        </p>
      </section>

      {/* ── Kontrola danych ── */}
      {checks && rows.length > 0 && header && (
        <section aria-label="Kontrola danych">
          <h2 className="mb-3 text-lg font-bold text-[#111]">Kontrola danych</h2>
          <ul className="space-y-1 text-sm text-[#243236]">
            <li>
              Kolumny: <code>{header.join(",")}</code>
            </li>
            <li>Puste pola (brak pomiaru): {checks.emptyFields}</li>
            <li className={checks.nonNumbers > 0 ? "font-semibold text-[#9b2c1f]" : undefined}>
              Wartości „nan”, „inf” lub „ovf”: {checks.nonNumbers}
              {checks.nonNumbers > 0 && (
                <>
                  {" "}— specyfikacja wymaga w takim miejscu pustego pola (
                  <Link href="/projekty/monitorowanie#47-błędne-odczyty">punkt 4.7</Link>).
                </>
              )}
            </li>
            <li className={checks.suspicious > 0 ? "font-semibold text-[#9b2c1f]" : undefined}>
              Temperatury -127 lub 85 (kody błędów DS18B20): {checks.suspicious}
              {checks.suspicious > 0 && " — powinny trafić do pliku jako puste pola."}
            </li>
            <li className={state.rejectedLines > 0 ? "font-semibold text-[#8a5a00]" : undefined}>
              Odrzucone linie w tym zapisie (zła liczba kolumn albo nie-CSV):{" "}
              {state.rejectedLines}
              {state.lastRejected && (
                <>
                  {" "}— ostatnia: <code>{state.lastRejected.slice(0, 80)}</code>
                </>
              )}
            </li>
          </ul>
        </section>
      )}

      {/* ── Ostatnie pomiary (widok tabeli) ── */}
      {header && rows.length > 0 && (
        <section aria-label="Ostatnie pomiary">
          <h2 className="mb-3 text-lg font-bold text-[#111]">
            Ostatnie pomiary{" "}
            <span className="text-sm font-normal text-[var(--article-muted)]">
              (najnowszy na górze)
            </span>
          </h2>
          <Table
            headers={[
              "czas komputera",
              // CSV names are case-sensitive: show them as sent, not upper-cased.
              ...header.map((name) => (
                <span key={name} className="normal-case tracking-normal">
                  {name}
                </span>
              )),
            ]}
            rows={rows
              .slice(-TABLE_ROWS)
              .reverse()
              .map((row) => [
                formatComputerTime(row.receivedAt).slice(11),
                ...row.fields.map((field, i) =>
                  field === "" ? (
                    <span key={i} className="text-[var(--article-muted)]" title="brak pomiaru">
                      —
                    </span>
                  ) : (
                    field
                  ),
                ),
              ])}
          />
        </section>
      )}

      {state.rawTail.length > 0 && (
        <details className="rounded-md border border-[var(--forbot-line)] bg-white px-4 py-3">
          <summary className="cursor-pointer text-sm font-semibold text-[#243236]">
            Surowe linie z płytki (jak w Monitorze portu szeregowego)
          </summary>
          <pre className="mt-3 max-h-72 overflow-auto rounded bg-[var(--forbot-code)] p-3 text-xs leading-5">
            {state.rawTail.join("\n")}
          </pre>
        </details>
      )}
    </div>
  );
}
