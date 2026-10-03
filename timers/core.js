/**
 * Modello dati, parsing e serializzazione della versione web.
 *
 * Questo modulo non tocca il DOM ne' localStorage: e' il gemello di
 * `timers_core.py` e vale la stessa regola, la logica sta qui e resta
 * testabile fuori dal browser (`node --test tests_web/`).
 *
 * Unita' di misura, da non mescolare: `start` e gli istanti sono millisecondi
 * epoch, le durate `dmin` e `dmax` sono minuti.
 */

export const VERSION = "1.1.0";
export const DATA_VERSION = 4;

export const DEFAULT_CATEGORIES = ["MvP", "Quest"];
export const HISTORY_KEYS = ["nome", "mappa", "categoria"];

// Rinomine di categoria applicate ai file salvati con un formato precedente.
export const CATEGORY_RENAMES = { Mostro: "MvP", MVP: "MvP" };

export const MAX_ARCHIVE = 200;

export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;

// Un HH:MM inserito a mano che cade oltre questo margine nel futuro viene letto
// come "ieri": serve per le uccisioni a cavallo della mezzanotte.
export const FUTURE_TOLERANCE = 12 * HOUR;

const TIME_RE = /^([0-1]?[0-9]|2[0-3])[:.]([0-5][0-9])$/;
const DURATION_HM_RE = /^(\d+)\s*[h:]\s*(\d{1,2})$/;
const DURATION_H_RE = /^(\d+(?:\.\d+)?)\s*h$/;
const GEOMETRY_RE = /^(\d+)x(\d+)(?:\+(-?\d+)\+(-?\d+))?$/;

// ------------------------------------------------------------- date e ore ---

/**
 * Istante corrente in millisecondi epoch.
 *
 * @returns {number}
 */
export function nowLocal() {
  return Date.now();
}

// ------------------------------------------------------------ fuso orario ---

/*
 * Il fuso del browser non e' sempre quello di chi lo usa: la modalita' anti
 * tracciamento di Firefox, Tor e certe VPN dichiarano UTC. Un orario digitato a
 * mano finirebbe due ore avanti senza che nulla lo segnali, perche' anche la
 * rilettura userebbe il fuso sbagliato e le colonne resterebbero coerenti fra
 * loro. Per questo il fuso e' una scelta esplicita, non un dato dedotto.
 */

/** @type {?string} Fuso attivo in formato IANA, null per quello del browser. */
let activeZone = null;

/** Fusi proposti nell'interfaccia, con l'etichetta mostrata. */
export const ZONES = [
  ["Europe/Rome", "Rome"],
  ["Europe/London", "London"],
  ["Europe/Madrid", "Madrid"],
  ["Europe/Berlin", "Berlin"],
  ["Europe/Lisbon", "Lisbon"],
  ["Europe/Athens", "Athens"],
  ["Europe/Moscow", "Moscow"],
  ["Europe/Istanbul", "Istanbul"],
  ["America/New_York", "New York"],
  ["America/Sao_Paulo", "Sao Paulo"],
  ["America/Los_Angeles", "Los Angeles"],
  ["Asia/Jakarta", "Jakarta"],
  ["Asia/Bangkok", "Bangkok"],
  ["Asia/Singapore", "Singapore"],
  ["Asia/Manila", "Manila"],
  ["Asia/Seoul", "Seoul"],
  ["Asia/Tokyo", "Tokyo"],
  ["Australia/Sydney", "Sydney"],
  ["UTC", "UTC"],
];

/**
 * Imposta il fuso usato per leggere e mostrare gli orari.
 *
 * @param {?string} zone Nome IANA, oppure null per seguire il browser.
 * @returns {boolean} True se il fuso e' stato accettato.
 */
export function setTimeZone(zone) {
  if (zone === null || zone === "") {
    activeZone = null;
    return true;
  }
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: zone });
  } catch {
    console.warn("Fuso non riconosciuto:", zone);
    return false;
  }
  activeZone = zone;
  return true;
}

/** @returns {?string} Il fuso scelto, null se si segue il browser. */
export function getTimeZone() {
  return activeZone;
}

/** @returns {string} Il fuso che il browser dichiara. */
export function browserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

const formatters = new Map();

function formatterFor(zone) {
  let formatter = formatters.get(zone);
  if (formatter === undefined) {
    formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    formatters.set(zone, formatter);
  }
  return formatter;
}

/**
 * Scompone un istante nel fuso attivo.
 *
 * @param {number} ms Millisecondi epoch.
 * @returns {{year: number, month: number, day: number, hour: number,
 *   minute: number, second: number}}
 */
export function partsIn(ms) {
  if (activeZone === null) {
    const moment = new Date(ms);
    return {
      year: moment.getFullYear(),
      month: moment.getMonth() + 1,
      day: moment.getDate(),
      hour: moment.getHours(),
      minute: moment.getMinutes(),
      second: moment.getSeconds(),
    };
  }
  const parts = {};
  for (const { type, value } of formatterFor(activeZone).formatToParts(new Date(ms))) {
    if (type !== "literal") parts[type] = Number(value);
  }
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
  };
}

/**
 * Scostamento del fuso attivo da UTC a un dato istante.
 *
 * @param {number} ms Millisecondi epoch.
 * @returns {number} Minuti, positivi a est di Greenwich.
 */
export function zoneOffsetMinutes(ms) {
  if (activeZone === null) return -new Date(ms).getTimezoneOffset();
  const { year, month, day, hour, minute, second } = partsIn(ms);
  const asUTC = Date.UTC(year, month - 1, day, hour, minute, second);
  return Math.round((asUTC - (ms - (ms % 1000))) / 60000);
}

/**
 * Costruisce l'istante corrispondente a una data e a un'ora del fuso attivo.
 *
 * @param {number} year Anno.
 * @param {number} month Mese, da 1 a 12.
 * @param {number} day Giorno del mese.
 * @param {number} hour Ora del giorno.
 * @param {number} minute Minuti.
 * @returns {number} Millisecondi epoch.
 */
export function msFromParts(year, month, day, hour, minute) {
  if (activeZone === null) {
    return new Date(year, month - 1, day, hour, minute, 0, 0).getTime();
  }
  const naive = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  // Il primo scostamento e' quello di un istante sbagliato di qualche ora: a
  // cavallo del cambio dell'ora legale la seconda passata lo corregge.
  const ms = naive - zoneOffsetMinutes(naive) * 60000;
  return naive - zoneOffsetMinutes(ms) * 60000;
}

function pad(value, width = 2) {
  return String(Math.floor(Math.abs(value))).padStart(width, "0");
}

/**
 * Formatta un istante come ISO 8601 con l'offset locale esplicito.
 *
 * Il formato e' quello prodotto da `datetime.isoformat()` su una data aware,
 * cosi' il JSON esportato dal web resta leggibile dall'applicazione desktop.
 * La parte frazionaria si omette quando e' nulla, come fa Python.
 *
 * @param {number} ms Millisecondi epoch.
 * @param {object} [options]
 * @param {boolean} [options.fractional] False per troncare al secondo.
 * @returns {string}
 */
export function toLocalISO(ms, { fractional = true } = {}) {
  const { year, month, day, hour, minute, second } = partsIn(ms);
  const offset = zoneOffsetMinutes(ms);
  const sign = offset >= 0 ? "+" : "-";
  const millis = ((ms % 1000) + 1000) % 1000;
  const frac = fractional && millis ? `.${pad(millis, 3)}` : "";
  return (
    `${pad(year, 4)}-${pad(month)}-${pad(day)}` +
    `T${pad(hour)}:${pad(minute)}:${pad(second)}${frac}` +
    `${sign}${pad(offset / 60)}:${pad(offset % 60)}`
  );
}

/**
 * Interpreta una data ISO letta dal file dati.
 *
 * Una stringa senza offset viene letta come ora locale, che e' lo stesso
 * comportamento di `as_aware` sul lato Python: i file della versione 1
 * contengono date naive e vanno interpretati nel fuso di chi li ha scritti.
 *
 * @param {unknown} text Testo da interpretare.
 * @returns {number} Millisecondi epoch, oppure NaN se il testo non e' una data.
 */
export function parseISO(text) {
  if (typeof text !== "string") return NaN;
  return Date.parse(text.trim());
}

/**
 * Interpreta un orario nel formato HH:MM.
 *
 * @param {string} text Testo inserito dall'utente, per esempio "23:50" o "23.50".
 * @returns {?{hour: number, minute: number}} null se il testo non e' un orario valido.
 */
export function parseHHMM(text) {
  const match = TIME_RE.exec(String(text).trim());
  if (!match) return null;
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

/**
 * Costruisce l'istante piu' plausibile per un orario inserito a mano.
 *
 * @param {number} hour Ora del giorno, da 0 a 23.
 * @param {number} minute Minuti, da 0 a 59.
 * @returns {number} L'istante di oggi corrispondente, oppure quello di ieri se
 *   cade oltre FUTURE_TOLERANCE nel futuro. Senza questa correzione
 *   un'uccisione delle 23:50 registrata alle 00:05 partirebbe fra quasi 24 ore.
 */
export function localAt(hour, minute) {
  const now = nowLocal();
  const today = partsIn(now);
  const moment = msFromParts(today.year, today.month, today.day, hour, minute);
  if (moment - now <= FUTURE_TOLERANCE) return moment;

  // Un giorno prima nel fuso attivo, non 24 ore prima: a cavallo del cambio
  // dell'ora legale i due valori non coincidono.
  const yesterday = partsIn(moment - 24 * HOUR);
  return msFromParts(yesterday.year, yesterday.month, yesterday.day, hour, minute);
}

/**
 * Interpreta una durata espressa in minuti.
 *
 * @param {string} text Testo inserito dall'utente: "190", "90,5", "1h30", "3:10".
 * @returns {?number} I minuti, oppure null se il testo non e' una durata valida
 *   o non e' positivo.
 */
export function parseMinutes(text) {
  const cleaned = String(text).trim().toLowerCase().replace(",", ".");
  if (!cleaned) return null;

  let value;
  const hourMinute = DURATION_HM_RE.exec(cleaned);
  const hourOnly = DURATION_H_RE.exec(cleaned);
  if (hourMinute) {
    value = Number(hourMinute[1]) * 60 + Number(hourMinute[2]);
  } else if (hourOnly) {
    value = Number(hourOnly[1]) * 60;
  } else {
    value = Number(cleaned);
  }
  // Number() accetta "Infinity" e la stringa di soli spazi: entrambe non sono durate.
  return Number.isFinite(value) && value > 0 ? value : null;
}

/**
 * Formatta una durata in H:MM:SS, oppure MM:SS se sotto l'ora.
 *
 * @param {number} totalSeconds Durata in secondi.
 * @returns {string}
 */
export function formatDuration(totalSeconds) {
  const total = Math.trunc(totalSeconds);
  const hours = Math.trunc(total / 3600);
  const minutes = Math.trunc((total % 3600) / 60);
  const seconds = total % 60;
  if (hours) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Formatta un numero di minuti senza decimali inutili.
 *
 * @param {number} minutes Minuti da formattare.
 * @returns {string}
 */
export function formatMinutes(minutes) {
  const value = Number(minutes);
  if (Number.isInteger(value)) return String(value);
  // Sei cifre significative come il %g di Python: 190.00000000001 resta "190".
  return String(Number(value.toPrecision(6)));
}

/**
 * Formatta un istante come orario del giorno.
 *
 * @param {number} ms Millisecondi epoch.
 * @returns {string} L'orario nel formato HH:MM.
 */
export function formatClock(ms) {
  const { hour, minute } = partsIn(ms);
  return `${pad(hour)}:${pad(minute)}`;
}

/**
 * Orario corrente completo di secondi, per l'orologio dell'intestazione.
 *
 * @param {number} ms Millisecondi epoch.
 * @returns {string} L'orario nel formato HH:MM:SS.
 */
export function formatClockSeconds(ms) {
  const { hour, minute, second } = partsIn(ms);
  return `${pad(hour)}:${pad(minute)}:${pad(second)}`;
}

// Oltre questa anzianita' il contatore smette di essere informativo:
// "-111:25:21" non dice niente di piu' di "e' passato da un pezzo".
export const LEFT_HIDE_AFTER = 24 * HOUR;

export const NO_TIME = "-";

/**
 * Testo del contatore verso la soglia corrente.
 *
 * @param {Timer} timer Timer da formattare.
 * @param {number} now Istante corrente.
 * @returns {string} La durata mancante, preceduta da un meno quando la finestra
 *   e' gia' chiusa, oppure NO_TIME oltre le 24 ore dalla chiusura.
 */
export function formatLeft(timer, now) {
  const remaining = timer.countdown(now);
  if (remaining >= 0) return formatDuration(remaining);
  const elapsed = -remaining;
  return elapsed > LEFT_HIDE_AFTER / 1000 ? NO_TIME : `-${formatDuration(elapsed)}`;
}

// Colori delle categorie, gli stessi dell'applicazione desktop.
export const COLOR_PALETTE = [
  "#e07b39",
  "#3b82c4",
  "#4caf82",
  "#c9a227",
  "#a15fcb",
  "#d1495b",
];

/**
 * Colore associato a una categoria.
 *
 * A differenza del desktop, dove il colore dipende dall'ordine di apparizione,
 * qui e' derivato dal nome: la stessa categoria ha lo stesso colore su tutti i
 * dispositivi, che e' cio' che ci si aspetta da dati sincronizzati a mano.
 *
 * @param {string} category Nome della categoria.
 * @returns {string} Un colore della palette.
 */
export function categoryColor(category) {
  const name = String(category).trim();
  const predefinita = DEFAULT_CATEGORIES.findIndex(
    (value) => value.toLowerCase() === name.toLowerCase(),
  );
  if (predefinita >= 0) return COLOR_PALETTE[predefinita % COLOR_PALETTE.length];

  let hash = 0;
  for (const char of name.toLowerCase()) {
    hash = (hash * 31 + char.codePointAt(0)) % 1_000_003;
  }
  // Le prime posizioni restano alle categorie predefinite.
  const offset = DEFAULT_CATEGORIES.length;
  const disponibili = COLOR_PALETTE.length - offset;
  return COLOR_PALETTE[offset + (hash % disponibili)];
}

/**
 * Verifica che una geometria di finestra sia sintatticamente valida.
 *
 * Serve solo a non corrompere l'impostazione dell'applicazione desktop quando
 * il file viene riscritto dal web: la posizione della finestra qui non si usa.
 *
 * @param {string} geometry Testo nel formato "820x560" oppure "820x560+100+50".
 * @returns {boolean}
 */
export function isValidGeometry(geometry) {
  return GEOMETRY_RE.test(String(geometry));
}

// ---------------------------------------------------------------- modello ---

/** Stato di un timer rispetto alla sua finestra di respawn. */
export const TimerState = Object.freeze({
  PENDING: "pending",
  OPEN: "open",
  CLOSED: "closed",
});

const STATE_RANK = { [TimerState.OPEN]: 0, [TimerState.PENDING]: 1, [TimerState.CLOSED]: 2 };

/**
 * Un respawn da sorvegliare.
 *
 * La finestra di respawn va da `start + dmin` a `start + dmax`. Quando le due
 * durate coincidono il timer si comporta come un countdown classico.
 */
export class Timer {
  /**
   * @param {object} fields
   * @param {string} fields.name Nome del mostro o della quest.
   * @param {string} [fields.mappa] Mappa di riferimento.
   * @param {string} [fields.categoria] Categoria usata per il colore della riga.
   * @param {number} fields.start Istante di partenza in millisecondi epoch.
   * @param {number} fields.dmin Durata minima in minuti.
   * @param {number} fields.dmax Durata massima in minuti.
   * @param {boolean} [fields.sound] False se questo timer non deve suonare.
   * @param {boolean} [fields.acked] True se l'utente ha preso atto dell'allarme.
   * @param {number} [fields.alertsSent] Quanti allarmi sono gia' stati emessi.
   * @param {?number} [fields.nextAlert] Istante del prossimo allarme.
   */
  constructor({
    name,
    mappa = "",
    categoria = DEFAULT_CATEGORIES[0],
    start,
    dmin,
    dmax,
    sound = true,
    acked = false,
    alertsSent = 0,
    nextAlert = null,
  }) {
    this.name = name;
    this.mappa = mappa;
    this.categoria = categoria;
    this.start = start;
    this.dmin = dmin;
    this.dmax = dmax;
    this.sound = sound;
    this.acked = acked;
    this.alertsSent = alertsSent;
    this.nextAlert = nextAlert;
  }

  /** @returns {number} Istante di apertura della finestra. */
  get openAt() {
    return this.start + this.dmin * MINUTE;
  }

  /** @returns {number} Istante di chiusura della finestra. */
  get closeAt() {
    return this.start + this.dmax * MINUTE;
  }

  /** @returns {boolean} True se non c'e' finestra, cioe' se le due durate coincidono. */
  get isFixed() {
    return this.dmin === this.dmax;
  }

  /**
   * Stato del timer a un dato istante.
   *
   * @param {number} now Istante corrente.
   * @returns {string} Un valore di TimerState.
   */
  state(now) {
    if (now < this.openAt) return TimerState.PENDING;
    if (now < this.closeAt) return TimerState.OPEN;
    return TimerState.CLOSED;
  }

  /**
   * Secondi alla prossima soglia.
   *
   * @param {number} now Istante corrente.
   * @returns {number} Secondi mancanti all'apertura se il timer e' in attesa,
   *   alla chiusura se la finestra e' aperta, e un valore negativo pari al
   *   tempo trascorso dalla chiusura se e' chiusa.
   */
  countdown(now) {
    const target = this.state(now) === TimerState.PENDING ? this.openAt : this.closeAt;
    return (target - now) / 1000;
  }

  /**
   * Chiave di ordinamento: prima gli aperti, poi gli attesi, poi i chiusi.
   *
   * @param {number} now Istante corrente.
   * @returns {[number, number]}
   */
  sortKey(now) {
    const state = this.state(now);
    if (state === TimerState.CLOSED) {
      return [STATE_RANK[state], (now - this.closeAt) / 1000];
    }
    const target = state === TimerState.OPEN ? this.closeAt : this.openAt;
    return [STATE_RANK[state], (target - now) / 1000];
  }

  /**
   * Sposta la partenza e riarma l'allarme.
   *
   * @param {number} start Nuovo istante di partenza.
   */
  reschedule(start) {
    this.start = start;
    this.acked = false;
    this.alertsSent = 0;
    this.nextAlert = null;
  }

  /**
   * Imposta la finestra di respawn, ordinando le durate se invertite.
   *
   * @param {number} dmin Durata minima in minuti.
   * @param {number} dmax Durata massima in minuti.
   */
  setWindow(dmin, dmax) {
    [this.dmin, this.dmax] = dmin <= dmax ? [dmin, dmax] : [dmax, dmin];
    this.acked = false;
    this.alertsSent = 0;
    this.nextAlert = null;
  }

  /**
   * Indica se va emesso un allarme adesso.
   *
   * @param {number} now Istante corrente.
   * @param {number} maxAlerts Numero massimo di allarmi per questo timer.
   * @returns {boolean} True se il suono e' attivo per questo timer, la finestra
   *   e' aperta o chiusa, l'utente non ha ancora preso atto e il numero massimo
   *   di allarmi non e' stato raggiunto.
   */
  alertDue(now, maxAlerts) {
    if (!this.sound || this.acked || this.state(now) === TimerState.PENDING) return false;
    if (this.alertsSent >= maxAlerts) return false;
    return this.nextAlert === null || now >= this.nextAlert;
  }

  /**
   * Registra un allarme emesso e programma la ripetizione.
   *
   * @param {number} now Istante corrente.
   * @param {number} repeatSeconds Intervallo fra due allarmi.
   */
  registerAlert(now, repeatSeconds) {
    this.alertsSent += 1;
    this.nextAlert = now + repeatSeconds * 1000;
  }

  /**
   * Segna l'allarme come visto.
   *
   * @returns {boolean} True se lo stato e' cambiato, False se era gia' stato
   *   preso atto.
   */
  acknowledge() {
    if (this.acked) return false;
    this.acked = true;
    this.nextAlert = null;
    return true;
  }

  /**
   * Serializza il timer per il file dati.
   *
   * @returns {object}
   */
  toDict() {
    return {
      name: this.name,
      mappa: this.mappa,
      categoria: this.categoria,
      start: toLocalISO(this.start),
      duration_min_minutes: this.dmin,
      duration_max_minutes: this.dmax,
      sound: this.sound,
      acked: this.acked,
      alerts_sent: this.alertsSent,
    };
  }

  /**
   * Ricostruisce un timer dal file dati.
   *
   * Accetta anche il formato della versione 1, che aveva la sola chiave
   * `duration_minutes` e il flag `notified`.
   *
   * @param {object} payload Oggetto letto dal JSON.
   * @returns {?Timer} null se la voce e' incompleta o malformata.
   */
  static fromDict(payload) {
    if (!payload || typeof payload !== "object") return null;

    const start = parseISO(payload.start);
    if (Number.isNaN(start)) {
      console.warn("Voce del file dati scartata, partenza non valida:", payload);
      return null;
    }

    const rawMin = payload.duration_min_minutes ?? payload.duration_minutes;
    const rawMax = payload.duration_max_minutes ?? rawMin;
    let dmin = toNumber(rawMin);
    let dmax = toNumber(rawMax);
    if (dmin === null || dmax === null) {
      console.warn("Voce del file dati scartata, durata non valida:", payload);
      return null;
    }
    if (dmin <= 0) {
      console.warn("Voce del file dati scartata, durata non positiva:", payload);
      return null;
    }
    if (dmax < dmin) [dmin, dmax] = [dmax, dmin];

    return new Timer({
      name: String(payload.name ?? "Timer"),
      mappa: String(payload.mappa ?? ""),
      categoria: String(payload.categoria ?? DEFAULT_CATEGORIES[0]),
      start,
      dmin,
      dmax,
      sound: Boolean(payload.sound ?? true),
      acked: Boolean(payload.acked ?? payload.notified ?? false),
      alertsSent: toNumber(payload.alerts_sent) ?? 0,
    });
  }
}

/** Valori ricordati per un nome, usati per compilare il form. */
export class Preset {
  /**
   * @param {object} fields
   * @param {string} fields.name Nome del timer.
   * @param {string} [fields.mappa] Mappa ricordata.
   * @param {string} [fields.categoria] Categoria ricordata.
   * @param {number} fields.dmin Durata minima in minuti.
   * @param {number} fields.dmax Durata massima in minuti.
   */
  constructor({ name, mappa = "", categoria = DEFAULT_CATEGORIES[0], dmin, dmax }) {
    this.name = name;
    this.mappa = mappa;
    this.categoria = categoria;
    this.dmin = dmin;
    this.dmax = dmax;
  }

  /** @returns {object} Il preset serializzato per il file dati. */
  toDict() {
    return {
      nome: this.name,
      mappa: this.mappa,
      categoria: this.categoria,
      min: this.dmin,
      max: this.dmax,
    };
  }

  /**
   * Ricostruisce un preset dal file dati.
   *
   * @param {object} payload Oggetto letto dal JSON.
   * @returns {?Preset} null se il formato non e' valido.
   */
  static fromDict(payload) {
    if (!payload || typeof payload !== "object" || typeof payload.nome !== "string") {
      console.warn("Preset scartato, formato non valido:", payload);
      return null;
    }
    const dmin = toNumber(payload.min);
    const dmax = payload.max === undefined ? dmin : toNumber(payload.max);
    if (dmin === null || dmax === null) {
      console.warn("Preset scartato, formato non valido:", payload);
      return null;
    }
    return new Preset({
      name: payload.nome,
      mappa: String(payload.mappa ?? ""),
      categoria: String(payload.categoria ?? DEFAULT_CATEGORIES[0]),
      dmin,
      dmax,
    });
  }

  /**
   * Crea un preset a partire da un timer esistente.
   *
   * @param {Timer} timer Timer di origine.
   * @returns {Preset}
   */
  static fromTimer(timer) {
    return new Preset({
      name: timer.name,
      mappa: timer.mappa,
      categoria: timer.categoria,
      dmin: timer.dmin,
      dmax: timer.dmax,
    });
  }
}

/**
 * Converte un valore numerico del file dati.
 *
 * @param {unknown} value Valore letto dal JSON.
 * @returns {?number} null se il valore non e' un numero utilizzabile.
 */
function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "boolean") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/** Coercizione a intero, con le stesse esclusioni di `int()` in Python. */
function toInt(value) {
  const number = toNumber(value);
  if (number === null) throw new TypeError(`valore non intero: ${value}`);
  return Math.trunc(number);
}

// Chiave nel file dati, campo dell'oggetto, coercizione.
const SETTINGS_FIELDS = [
  ["volume", "volume", toInt],
  ["topmost", "topmost", Boolean],
  ["geometry", "geometry", String],
  ["repeat_alert", "repeatAlert", Boolean],
  ["alert_repeat_seconds", "alertRepeatSeconds", toInt],
  ["alert_max_count", "alertMaxCount", toInt],
];

/**
 * Preferenze dell'utente, salvate insieme ai timer.
 *
 * `topmost` e `geometry` non hanno effetto nel browser: restano per non
 * cancellare le preferenze dell'applicazione desktop nel file condiviso.
 */
export class Settings {
  constructor() {
    this.volume = 60;
    this.topmost = false;
    this.geometry = "";
    this.repeatAlert = true;
    this.alertRepeatSeconds = 15;
    this.alertMaxCount = 6;
  }

  /** @returns {object} Le impostazioni serializzate per il file dati. */
  toDict() {
    const data = {};
    for (const [key, field] of SETTINGS_FIELDS) data[key] = this[field];
    return data;
  }

  /**
   * Legge le impostazioni scartando le chiavi sconosciute o non valide.
   *
   * @param {object} payload Oggetto letto dal JSON.
   * @returns {Settings}
   */
  static fromDict(payload) {
    const settings = new Settings();
    if (!payload || typeof payload !== "object") return settings;
    for (const [key, field, cast] of SETTINGS_FIELDS) {
      if (!(key in payload)) continue;
      try {
        settings[field] = cast(payload[key]);
      } catch {
        console.warn(`Impostazione ${key} ignorata, valore non valido:`, payload[key]);
      }
    }
    if (!isValidGeometry(settings.geometry)) settings.geometry = "";
    return settings;
  }
}

// ------------------------------------------------------------ persistenza ---

/** Confronto per code point sul testo minuscolo, come `key=str.lower` in Python. */
function byLower(a, b) {
  const left = a.toLowerCase();
  const right = b.toLowerCase();
  if (left < right) return -1;
  return left > right ? 1 : 0;
}

/**
 * Contiene lo stato dell'applicazione e lo converte da e verso il JSON.
 *
 * Non conosce localStorage: lo strato di persistenza gli passa e gli richiede
 * un oggetto semplice, cosi' questa classe resta verificabile in node.
 */
export class TimerStore {
  constructor() {
    /** @type {Map<string, Timer>} Timer attivi, indicizzati per identificatore. */
    this.timers = new Map();
    /** @type {Object<string, string[]>} Valori gia' usati nei campi del form. */
    this.history = { nome: [], mappa: [], categoria: [...DEFAULT_CATEGORIES] };
    /** @type {Map<string, Preset>} Valori ricordati per nome. */
    this.presets = new Map();
    /** @type {object[]} Timer archiviati, serializzati. */
    this.archive = [];
    this.settings = new Settings();
    this.nextId = 1;
  }

  // ---- timer ----

  /**
   * Inserisce un timer.
   *
   * @param {Timer} timer Timer da inserire.
   * @returns {string} L'identificatore assegnato.
   */
  add(timer) {
    const timerId = String(this.nextId++);
    this.timers.set(timerId, timer);
    return timerId;
  }

  /**
   * Elimina i timer indicati.
   *
   * @param {string[]} timerIds Identificatori da eliminare.
   * @returns {object[]} I timer serializzati, nell'ordine ricevuto, per poterli
   *   ripristinare.
   */
  remove(timerIds) {
    const payloads = [];
    for (const timerId of timerIds) {
      const timer = this.timers.get(timerId);
      if (timer !== undefined) {
        payloads.push(timer.toDict());
        this.timers.delete(timerId);
      }
    }
    return payloads;
  }

  /**
   * Reinserisce timer precedentemente serializzati.
   *
   * @param {object[]} payloads Timer serializzati.
   * @returns {string[]} I nuovi identificatori.
   */
  restore(payloads) {
    const restored = [];
    for (const payload of payloads) {
      const timer = Timer.fromDict(payload);
      if (timer !== null) restored.push(this.add(timer));
    }
    return restored;
  }

  /**
   * Identificatori dei timer con la finestra chiusa da abbastanza tempo.
   *
   * @param {number} now Istante corrente.
   * @param {number} olderThan Anzianita' minima della chiusura, in millisecondi.
   * @returns {string[]}
   */
  staleIds(now, olderThan) {
    const cutoff = now - olderThan;
    const ids = [];
    for (const [timerId, timer] of this.timers) {
      if (timer.closeAt < cutoff) ids.push(timerId);
    }
    return ids;
  }

  /**
   * Sposta i timer indicati nell'archivio.
   *
   * @param {string[]} timerIds Identificatori da archiviare.
   * @param {number} now Istante da registrare come momento dell'archiviazione.
   * @returns {object[]} I timer serializzati, senza il campo di archiviazione,
   *   per poterli ripristinare.
   */
  archiveIds(timerIds, now) {
    const payloads = this.remove(timerIds);
    const stamp = toLocalISO(now, { fractional: false });
    for (const payload of payloads) {
      this.archive.push({ ...payload, archived_at: stamp });
    }
    if (this.archive.length > MAX_ARCHIVE) {
      this.archive = this.archive.slice(-MAX_ARCHIVE);
    }
    return payloads;
  }

  // ---- storico e preset ----

  /**
   * Aggiunge un valore allo storico di un campo.
   *
   * @param {string} key Uno fra "nome", "mappa" e "categoria".
   * @param {string} value Valore inserito dall'utente.
   * @returns {boolean} True se lo storico e' cambiato.
   */
  remember(key, value) {
    const cleaned = String(value).trim();
    const values = this.history[key];
    if (!cleaned || values.some((v) => v.toLowerCase() === cleaned.toLowerCase())) {
      return false;
    }
    values.push(cleaned);
    values.sort(byLower);
    return true;
  }

  /**
   * Memorizza mappa, categoria e durate associate al nome del timer.
   *
   * @param {Timer} timer Timer di origine.
   */
  rememberPreset(timer) {
    this.presets.set(timer.name.trim().toLowerCase(), Preset.fromTimer(timer));
  }

  /**
   * Preset associato a un nome, se esiste.
   *
   * @param {string} name Nome cercato.
   * @returns {?Preset}
   */
  presetFor(name) {
    return this.presets.get(String(name).trim().toLowerCase()) ?? null;
  }

  // ---- serializzazione ----

  /** @returns {object} Lo stato completo, nel formato del file dati. */
  toDict() {
    const presets = {};
    for (const [key, preset] of this.presets) presets[key] = preset.toDict();
    return {
      version: DATA_VERSION,
      settings: this.settings.toDict(),
      timers: [...this.timers.values()].map((timer) => timer.toDict()),
      history: this.history,
      presets,
      archive: this.archive,
    };
  }

  /**
   * Carica timer, storico, preset, archivio e impostazioni.
   *
   * I timer la cui finestra risulta gia' aperta all'avvio vengono segnati come
   * visti: altrimenti riaprendo l'applicazione partirebbero tutti gli allarmi
   * arretrati insieme.
   *
   * @param {object} data Oggetto letto dal JSON.
   * @param {number} [now] Istante di riferimento, utile nei test.
   */
  loadDict(data, now = nowLocal()) {
    if (!data || typeof data !== "object") return;

    this.settings = Settings.fromDict(data.settings);

    const history = data.history;
    if (history && typeof history === "object") {
      for (const key of HISTORY_KEYS) {
        const seen = new Set(this.history[key].map((value) => value.toLowerCase()));
        for (const value of history[key] ?? []) {
          if (typeof value === "string" && !seen.has(value.toLowerCase())) {
            this.history[key].push(value);
            seen.add(value.toLowerCase());
          }
        }
        this.history[key].sort(byLower);
      }
    }

    const presets = data.presets;
    if (presets && typeof presets === "object") {
      for (const [key, payload] of Object.entries(presets)) {
        const preset = Preset.fromDict(payload);
        if (preset !== null) this.presets.set(key, preset);
      }
    }

    if (Array.isArray(data.archive)) {
      this.archive = data.archive.slice(-MAX_ARCHIVE);
    }

    for (const payload of data.timers ?? []) {
      const timer = Timer.fromDict(payload);
      if (timer === null) continue;
      if (timer.openAt <= now) timer.acked = true;
      this.add(timer);
      const key = timer.name.trim().toLowerCase();
      if (!this.presets.has(key)) this.presets.set(key, Preset.fromTimer(timer));
    }

    if ((data.version ?? 1) < DATA_VERSION) this.migrateCategories();
  }

  /**
   * Applica le rinomine di categoria ai dati appena caricati.
   *
   * Viene eseguita solo sui file salvati prima della versione corrente, in modo
   * che una categoria riscritta a mano dall'utente non venga cambiata.
   */
  migrateCategories() {
    const renamed = (value) => CATEGORY_RENAMES[value] ?? value;
    for (const timer of this.timers.values()) timer.categoria = renamed(timer.categoria);
    for (const preset of this.presets.values()) preset.categoria = renamed(preset.categoria);
    for (const entry of this.archive) {
      if (entry.categoria in CATEGORY_RENAMES) entry.categoria = renamed(entry.categoria);
    }

    const unica = [];
    for (const value of this.history.categoria.map(renamed)) {
      if (!unica.some((existing) => existing.toLowerCase() === value.toLowerCase())) {
        unica.push(value);
      }
    }
    this.history.categoria = unica.sort(byLower);
  }
}

/**
 * Ordina i timer: prima le finestre aperte, poi le attese, infine le passate.
 *
 * @param {Array<[string, Timer]>} entries Coppie identificatore/timer.
 * @param {number} now Istante corrente.
 * @returns {Array<[string, Timer]>} Un nuovo array ordinato.
 */
export function sortEntries(entries, now) {
  return [...entries].sort(([, a], [, b]) => {
    const [rankA, valueA] = a.sortKey(now);
    const [rankB, valueB] = b.sortKey(now);
    return rankA - rankB || valueA - valueB;
  });
}
