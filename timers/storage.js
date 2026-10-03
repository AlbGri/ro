/**
 * Persistenza su localStorage e scambio di file con l'applicazione desktop.
 *
 * localStorage e' per browser e per dispositivo: non c'e' sincronizzazione fra
 * telefono e computer, e cancellare i dati del sito cancella i timer. Per
 * questo l'esportazione non e' un accessorio ma l'unica copia trasferibile.
 */

import { TimerStore } from "./core.js";

const DATA_KEY = "ragnarok-timers/data";
const BACKUP_KEY = "ragnarok-timers/data.bak";
const SEEN_KEY = "ragnarok-timers/seen";
const ZONE_KEY = "ragnarok-timers/timezone";

/**
 * Verifica che localStorage sia utilizzabile.
 *
 * In navigazione privata e con i cookie di terze parti bloccati l'accesso puo'
 * sollevare un'eccezione: va scoperto subito per avvisare l'utente invece di
 * perdere i dati al primo salvataggio.
 *
 * @returns {boolean}
 */
export function storageAvailable() {
  try {
    const probe = "ragnarok-timers/probe";
    localStorage.setItem(probe, "1");
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/**
 * Salva lo stato, conservando la versione precedente come copia di sicurezza.
 *
 * @param {TimerStore} store Stato da salvare.
 * @returns {boolean} True se il salvataggio e' riuscito.
 */
export function save(store) {
  try {
    const payload = JSON.stringify(store.toDict());
    const previous = localStorage.getItem(DATA_KEY);
    if (previous !== null) localStorage.setItem(BACKUP_KEY, previous);
    localStorage.setItem(DATA_KEY, payload);
    return true;
  } catch (error) {
    console.error("Salvataggio fallito:", error);
    return false;
  }
}

/**
 * Carica lo stato, ripiegando sulla copia di sicurezza.
 *
 * @param {TimerStore} store Stato da riempire.
 * @returns {{loaded: boolean, fromBackup: boolean}}
 */
export function load(store) {
  for (const key of [DATA_KEY, BACKUP_KEY]) {
    let raw;
    try {
      raw = localStorage.getItem(key);
    } catch (error) {
      console.error("Lettura dei dati fallita:", error);
      return { loaded: false, fromBackup: false };
    }
    if (raw === null) continue;
    try {
      store.loadDict(JSON.parse(raw));
      return { loaded: true, fromBackup: key === BACKUP_KEY };
    } catch (error) {
      console.warn(`Dati illeggibili in ${key}:`, error);
    }
  }
  return { loaded: false, fromBackup: false };
}

/**
 * Indica se questo browser ha gia' aperto l'applicazione.
 *
 * @returns {boolean}
 */
export function isReturningVisitor() {
  try {
    return localStorage.getItem(SEEN_KEY) !== null;
  } catch {
    return false;
  }
}

/** Registra che l'applicazione e' stata aperta almeno una volta. */
export function markVisited() {
  try {
    localStorage.setItem(SEEN_KEY, new Date().toISOString());
  } catch {
    // Senza localStorage si perde solo il messaggio di benvenuto.
  }
}

/**
 * Fuso scelto su questo dispositivo.
 *
 * Sta fuori dal file dei timer di proposito: e' una caratteristica di dove ci
 * si trova, non dei dati. Importando i propri timer da un altro paese il fuso
 * giusto resta quello del dispositivo che li apre.
 *
 * @returns {?string} Il nome IANA salvato, null se si segue il browser.
 */
export function loadTimeZone() {
  try {
    return localStorage.getItem(ZONE_KEY);
  } catch {
    return null;
  }
}

/**
 * Salva il fuso scelto.
 *
 * @param {?string} zone Nome IANA, null per tornare a seguire il browser.
 */
export function saveTimeZone(zone) {
  try {
    if (zone === null) localStorage.removeItem(ZONE_KEY);
    else localStorage.setItem(ZONE_KEY, zone);
  } catch {
    // Senza localStorage la scelta vale per la sola sessione.
  }
}

/**
 * Scarica lo stato come file JSON, nello stesso formato dell'app desktop.
 *
 * @param {TimerStore} store Stato da esportare.
 */
export function exportFile(store) {
  const blob = new Blob([JSON.stringify(store.toDict(), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ragnarok_timers.json";
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Legge un file JSON e ne ricava uno stato completo.
 *
 * @param {File} file File scelto dall'utente.
 * @returns {Promise<TimerStore>} Lo stato importato.
 * @throws {Error} Se il file non e' un JSON con la struttura attesa.
 */
export async function importFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!data || typeof data !== "object" || !Array.isArray(data.timers)) {
    throw new Error("Not a Ragnarok Timers file");
  }
  const imported = new TimerStore();
  imported.loadDict(data);
  return imported;
}
