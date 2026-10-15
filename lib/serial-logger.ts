/**
 * Serial logger — browser-only engine of the "Rejestrator CSV" tool
 * (`/narzedzia/rejestrator-csv`).
 *
 * Reads CSV lines sent by an Arduino over USB with the Web Serial API
 * (Chrome / Edge on a desktop), keeps them in memory and in `localStorage`
 * (so a closed tab does not lose the recording) and builds CSV files.
 * Nothing leaves the computer.
 *
 * It is an external store for `useSyncExternalStore`: React components read
 * immutable snapshots and call the action methods. Never import it from
 * server code paths that run it — module scope touches no browser API.
 *
 * Data format: see `content/projekty/monitorowanie/00-wprowadzenie.mdx` §4.4.
 */

/** Columns of the Monitorowanie project, in order (spec §4.4). */
export const SPEC_COLUMNS = [
  "czas_ms",
  "swiatlo",
  "wiatr_m_s",
  "T_szafa_C",
  "T_modul_C",
  "T_otoczenie_C",
  "wilgotnosc_proc",
  "T_dht_C",
] as const;

/** Column counts the project sends after parts 1, 2 and 3. */
const SPEC_STAGE_WIDTHS = [3, 6, 8];

const STORAGE_KEY = "kurs-arduino:rejestrator-csv:v2";
/** Version 1 kept one set-aside recording (`previous`); read once, then removed. */
const LEGACY_STORAGE_KEY = "kurs-arduino:rejestrator-csv:v1";
/** Per-viewer choice of the `czas_pc` column; "1" when on. */
const COMPUTER_TIME_KEY = "kurs-arduino:rejestrator-csv:czas-pc";
/** While lines keep arriving, write to browser storage at least this often. */
const SAVE_INTERVAL_MS = 3000;
const RAW_TAIL_SIZE = 30;
/** A line longer than this without a newline is not CSV — drop it. */
const MAX_LINE_LENGTH = 1000;

// ── Minimal Web Serial types (not part of TypeScript's DOM lib) ──────────

interface SerialPortInfo {
  usbVendorId?: number;
  usbProductId?: number;
}

interface SerialPort {
  readonly readable: ReadableStream<Uint8Array> | null;
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  getInfo(): SerialPortInfo;
}

interface Serial {
  requestPort(): Promise<SerialPort>;
}

function getSerial(): Serial | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as Navigator & { serial?: Serial }).serial;
}

/** True when this browser can talk to serial ports (Web Serial, HTTPS only). */
export function isSerialSupported(): boolean {
  return getSerial() !== undefined;
}

// ── State ────────────────────────────────────────────────────────────────

export interface LoggerRow {
  /** Computer clock (ms since epoch) when the line arrived. */
  receivedAt: number;
  /** The line exactly as received, without the line ending. */
  raw: string;
  fields: string[];
}

export interface Recording {
  header: string[];
  rows: LoggerRow[];
}

/** A finished recording kept for download after a header with other columns. */
export interface SetAsideRecording extends Recording {
  /** Stable key, unique within the list. */
  id: number;
}

export type LoggerStatus = "idle" | "connecting" | "connected" | "closing";

export interface LoggerNotice {
  tone: "info" | "warning" | "error";
  text: string;
}

export interface LoggerState {
  status: LoggerStatus;
  notice: LoggerNotice | null;
  /** Human-readable name of the open port. */
  portLabel: string | null;
  /** When the open port was connected (ms since epoch). */
  connectedAt: number | null;
  /** Column names of the current recording. */
  header: string[] | null;
  /** "spec" when no header line arrived and the names came from the project spec. */
  headerSource: "device" | "spec" | null;
  rows: LoggerRow[];
  /**
   * Lines of the current recording that are not valid CSV for its header.
   * Restarts with every new recording; before the first header it counts
   * the lines that arrived so far (for the "not CSV" warning).
   */
  rejectedLines: number;
  lastRejected: string | null;
  /** Last received lines of any kind, as in the Serial Monitor. */
  rawTail: string[];
  /**
   * Recordings set aside when a header with other columns arrived, oldest
   * first. Only `discardSetAside()` removes one.
   */
  setAside: SetAsideRecording[];
  /** When a recording was restored from browser storage (ms since epoch). */
  restoredAt: number | null;
  /** Add the `czas_pc` column to saved files. Remembered in this browser. */
  withComputerTime: boolean;
}

const INITIAL_STATE: LoggerState = {
  status: "idle",
  notice: null,
  portLabel: null,
  connectedAt: null,
  header: null,
  headerSource: null,
  rows: [],
  rejectedLines: 0,
  lastRejected: null,
  rawTail: [],
  setAside: [],
  restoredAt: null,
  withComputerTime: false,
};

// ── Parsing ──────────────────────────────────────────────────────────────

const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;
const NUMBER = /^-?\d+(?:\.\d+)?$/;
/** Texts `Serial.print()` writes for non-numbers. Kept, but flagged. */
const NON_NUMBER = /^-?(?:nan|inf|ovf)$/i;

export function isNumberField(field: string): boolean {
  return NUMBER.test(field);
}

export function isNonNumberField(field: string): boolean {
  return NON_NUMBER.test(field);
}

function isHeaderLine(fields: string[]): boolean {
  return (
    fields.every((f) => IDENTIFIER.test(f)) &&
    fields.some((f) => !NON_NUMBER.test(f))
  );
}

function isDataLine(fields: string[]): boolean {
  return fields.every((f) => f === "" || NUMBER.test(f) || NON_NUMBER.test(f));
}

function sameColumns(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((name, i) => name === b[i]);
}

/** Column names for data that arrived without a header line. */
function fallbackHeader(width: number): string[] {
  if (SPEC_STAGE_WIDTHS.includes(width)) return SPEC_COLUMNS.slice(0, width);
  return Array.from({ length: width }, (_, i) => `kolumna_${i + 1}`);
}

function splitLine(line: string): string[] {
  return line.split(",").map((field) => field.trim());
}

// ── CSV export ───────────────────────────────────────────────────────────

export type CsvVariant = "original" | "excel-pl";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Local computer time as `YYYY-MM-DD HH:MM:SS`. */
export function formatComputerTime(ms: number): string {
  const d = new Date(ms);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

/**
 * Build a CSV file. "original" keeps the lines exactly as the board sent
 * them; "excel-pl" uses `;` between columns and decimal commas, which is
 * what a Polish spreadsheet opens correctly with a double click.
 */
export function buildCsv(
  recording: Recording,
  { variant, withComputerTime }: { variant: CsvVariant; withComputerTime: boolean },
): string {
  const separator = variant === "excel-pl" ? ";" : ",";
  const header = withComputerTime
    ? ["czas_pc", ...recording.header]
    : recording.header;
  const lines = [header.join(separator)];
  for (const row of recording.rows) {
    const fields =
      variant === "excel-pl"
        ? row.fields.map((f) => f.replace(".", ","))
        : row.fields;
    const all = withComputerTime
      ? [formatComputerTime(row.receivedAt), ...fields]
      : fields;
    lines.push(all.join(separator));
  }
  return lines.join("\r\n") + "\r\n";
}

// ── Store ────────────────────────────────────────────────────────────────

type StoredRows = [number, string][];

interface StoredStateV1 {
  v: 1;
  savedAt: number;
  header: string[] | null;
  headerSource: "device" | "spec" | null;
  rows: StoredRows;
  previous: { header: string[]; rows: StoredRows } | null;
}

interface StoredState {
  v: 2;
  savedAt: number;
  current: {
    header: string[] | null;
    headerSource: "device" | "spec" | null;
    rows: StoredRows;
    rejectedLines: number;
    lastRejected: string | null;
  };
  setAside: { id: number; header: string[]; rows: StoredRows }[];
}

function readStored<T>(key: string): T | null {
  const text = localStorage.getItem(key);
  return text ? (JSON.parse(text) as T) : null;
}

function fromV1(old: StoredStateV1): StoredState {
  return {
    v: 2,
    savedAt: old.savedAt,
    current: {
      header: old.header,
      headerSource: old.headerSource,
      rows: old.rows,
      rejectedLines: 0,
      lastRejected: null,
    },
    setAside: old.previous ? [{ id: 1, ...old.previous }] : [],
  };
}

function nextSetAsideId(list: SetAsideRecording[]): number {
  return list.reduce((max, recording) => Math.max(max, recording.id), 0) + 1;
}

function toRows(stored: StoredRows): LoggerRow[] {
  return stored.map(([receivedAt, raw]) => ({
    receivedAt,
    raw,
    fields: splitLine(raw),
  }));
}

function fromRows(rows: LoggerRow[]): StoredRows {
  return rows.map((row) => [row.receivedAt, row.raw]);
}

class SerialLogger {
  private state: LoggerState = INITIAL_STATE;
  private listeners = new Set<() => void>();
  private restored = false;
  private saveTimer: ReturnType<typeof setTimeout> | undefined;
  private reader: ReadableStreamDefaultReader<string> | null = null;
  private readLoop: Promise<void> | null = null;
  private stopping = false;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    if (!this.restored) {
      this.restored = true;
      queueMicrotask(() => this.restore());
      // Closing the tab, reloading or switching away must not wait for the timer.
      window.addEventListener("pagehide", this.flushSave);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") this.flushSave();
      });
    }
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.state;

  getServerSnapshot = () => INITIAL_STATE;

  private set(patch: Partial<LoggerState>, { save = false } = {}) {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener();
    if (save) this.scheduleSave();
  }

  // ── Persistence ──

  private restore() {
    try {
      if (localStorage.getItem(COMPUTER_TIME_KEY) === "1") {
        this.set({ withComputerTime: true });
      }
    } catch {
      // storage blocked — the checkbox starts off
    }

    let stored: StoredState | null = null;
    let migrated = false;
    let rows: LoggerRow[];
    let setAside: SetAsideRecording[];
    try {
      stored = readStored<StoredState>(STORAGE_KEY);
      if (!stored) {
        const old = readStored<StoredStateV1>(LEGACY_STORAGE_KEY);
        if (old?.v === 1) {
          stored = fromV1(old);
          migrated = true;
        }
      }
      if (!stored || stored.v !== 2) return;
      rows = toRows(stored.current.rows);
      setAside = stored.setAside
        .map(({ id, header, rows }) => ({ id, header, rows: toRows(rows) }))
        .filter((recording) => recording.rows.length > 0);
    } catch {
      return; // storage blocked or corrupt — start empty
    }

    const { current } = stored;
    if (rows.length > 0 || setAside.length > 0) {
      // A current recording without rows is not worth restoring: the next
      // header starts it again.
      const hasRows = rows.length > 0;
      this.set({
        header: hasRows ? current.header : null,
        headerSource: hasRows ? current.headerSource : null,
        rows,
        rejectedLines: hasRows ? current.rejectedLines : 0,
        lastRejected: hasRows ? current.lastRejected : null,
        setAside,
        restoredAt: stored.savedAt,
      });
    }
    // Move version-1 data to the new key once; keep it if that write fails.
    if (migrated && this.save()) {
      try {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch {
        // storage blocked — the next visit migrates again
      }
    }
  }

  /**
   * Save within `SAVE_INTERVAL_MS`. A pending save is not postponed: lines
   * arrive every 2 s, so restarting the timer would never let it fire.
   */
  private scheduleSave() {
    if (this.saveTimer !== undefined) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = undefined;
      this.save();
    }, SAVE_INTERVAL_MS);
  }

  /** Run the pending save now, if there is one. */
  private flushSave = () => {
    if (this.saveTimer === undefined) return;
    clearTimeout(this.saveTimer);
    this.saveTimer = undefined;
    this.save();
  };

  /** Write the state to browser storage. False when the browser refused. */
  private save(): boolean {
    const { header, headerSource, rows, rejectedLines, lastRejected, setAside } =
      this.state;
    try {
      if (rows.length === 0 && setAside.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
        return true;
      }
      const stored: StoredState = {
        v: 2,
        savedAt: Date.now(),
        current: {
          header,
          headerSource,
          rows: fromRows(rows),
          rejectedLines,
          lastRejected,
        },
        setAside: setAside.map(({ id, header, rows }) => ({
          id,
          header,
          rows: fromRows(rows),
        })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      return true;
    } catch {
      this.set({
        notice: {
          tone: "warning",
          text:
            "Przeglądarka nie może już przechowywać pomiarów (brak miejsca albo zablokowana pamięć strony). Rejestracja trwa, ale zapisz teraz plik CSV, żeby niczego nie stracić." +
            (setAside.length > 0
              ? " Odłożone zapisy też zajmują miejsce: zapisz je do plików i odrzuć te, których już nie potrzebujesz."
              : ""),
        },
      });
      return false;
    }
  }

  // ── Lines from the board ──

  private handleLines(lines: string[], receivedAt: number) {
    let { header, headerSource, rows, rejectedLines, lastRejected, setAside, notice } =
      this.state;
    const rawTail = [...this.state.rawTail];
    const added: LoggerRow[] = [];

    for (const line of lines) {
      if (line.trim() === "") continue;
      rawTail.push(line);
      const fields = splitLine(line);

      if (isHeaderLine(fields)) {
        if (header && sameColumns(header, fields)) {
          // The board restarted: same columns, same recording, same count.
          headerSource = "device";
          continue;
        }
        if (header && rows.length + added.length > 0) {
          setAside = [
            ...setAside,
            { id: nextSetAsideId(setAside), header, rows: [...rows, ...added] },
          ];
          rows = [];
          added.length = 0;
          notice = {
            tone: "warning",
            text: "Płytka wysłała nagłówek z innymi kolumnami, więc zaczynam nowy zapis. Wcześniejsze pomiary możesz jeszcze pobrać poniżej.",
          };
        }
        // This header starts a recording, and the rejected lines with it.
        header = fields;
        headerSource = "device";
        rejectedLines = 0;
        lastRejected = null;
        continue;
      }

      if (!isDataLine(fields)) {
        rejectedLines += 1;
        lastRejected = line;
        continue;
      }
      if (!header) {
        // Data without a header line also starts a recording.
        header = fallbackHeader(fields.length);
        headerSource = "spec";
        rejectedLines = 0;
        lastRejected = null;
      }
      if (fields.length !== header.length) {
        rejectedLines += 1;
        lastRejected = line;
        continue;
      }
      added.push({ receivedAt, raw: line, fields });
    }

    this.set(
      {
        header,
        headerSource,
        rows: added.length > 0 ? [...rows, ...added] : rows,
        rejectedLines,
        lastRejected,
        setAside,
        notice,
        rawTail: rawTail.slice(-RAW_TAIL_SIZE),
      },
      { save: true },
    );
  }

  // ── Actions ──

  connect = async (baudRate: number) => {
    const serial = getSerial();
    if (!serial || this.state.status !== "idle") return;

    let port: SerialPort;
    try {
      port = await serial.requestPort();
    } catch {
      return; // the person closed the port picker
    }

    this.set({ status: "connecting", notice: null });
    try {
      await port.open({ baudRate });
    } catch {
      this.set({
        status: "idle",
        notice: {
          tone: "error",
          text: "Nie udało się otworzyć portu. Najczęściej jest zajęty: zamknij Monitor portu szeregowego i Serial Plotter w Arduino IDE (oraz inne karty z rejestratorem) i kliknij „Połącz” jeszcze raz.",
        },
      });
      return;
    }

    const { usbVendorId, usbProductId } = port.getInfo();
    const portLabel =
      usbVendorId === undefined
        ? "port szeregowy"
        : `USB ${usbVendorId.toString(16).padStart(4, "0")}:${(usbProductId ?? 0)
            .toString(16)
            .padStart(4, "0")}`;
    this.set({ status: "connected", portLabel, connectedAt: Date.now(), restoredAt: null });
    this.readLoop = this.read(port);
  };

  disconnect = async () => {
    if (this.state.status !== "connected" || !this.reader) return;
    this.stopping = true;
    this.set({ status: "closing" });
    await this.reader.cancel().catch(() => {});
    await this.readLoop;
    this.stopping = false;
  };

  private async read(port: SerialPort) {
    if (!port.readable) return;
    const decoder = new TextDecoderStream();
    const piped = port.readable
      .pipeTo(decoder.writable as WritableStream<Uint8Array>)
      .catch(() => {});
    const reader = decoder.readable.getReader();
    this.reader = reader;

    let buffer = "";
    let lost = false;
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const parts = buffer.split("\n");
        buffer = parts.pop() ?? "";
        if (buffer.length > MAX_LINE_LENGTH) buffer = "";
        if (parts.length > 0) {
          this.handleLines(
            parts.map((part) => part.replace(/\r$/, "")),
            Date.now(),
          );
        }
      }
    } catch {
      lost = !this.stopping;
    } finally {
      reader.releaseLock();
    }

    await piped;
    await port.close().catch(() => {});
    this.reader = null;
    this.set({
      status: "idle",
      portLabel: null,
      connectedAt: null,
      notice: lost
        ? {
            tone: "error",
            text: "Połączenie z płytką zostało przerwane (np. odłączony kabel USB). Zebrane pomiary są zachowane — możesz je zapisać albo połączyć się ponownie.",
          }
        : this.state.notice,
    });
  }

  /**
   * Delete the current recording and its rejected-lines count. Set-aside
   * recordings stay. Keeps the header while connected.
   */
  clear = () => {
    const connected = this.state.status === "connected";
    this.set(
      {
        rows: [],
        rejectedLines: 0,
        lastRejected: null,
        notice: null,
        restoredAt: null,
        header: connected ? this.state.header : null,
        headerSource: connected ? this.state.headerSource : null,
      },
      { save: true },
    );
  };

  /** Delete one set-aside recording. */
  discardSetAside = (id: number) => {
    const setAside = this.state.setAside.filter((recording) => recording.id !== id);
    this.set(
      // The "new recording" notice points at the set-aside list: drop it with the last one.
      { setAside, notice: setAside.length > 0 ? this.state.notice : null },
      { save: true },
    );
  };

  dismissNotice = () => {
    this.set({ notice: null });
  };

  setWithComputerTime = (withComputerTime: boolean) => {
    this.set({ withComputerTime });
    try {
      if (withComputerTime) localStorage.setItem(COMPUTER_TIME_KEY, "1");
      else localStorage.removeItem(COMPUTER_TIME_KEY);
    } catch {
      // storage blocked — the choice lasts until the page is reloaded
    }
  };
}

/** The one logger of the page. */
export const serialLogger = new SerialLogger();
