/**
 * Interfaccia della versione web: lista dei timer, form, allarmi.
 *
 * Vale la stessa divisione della versione desktop: qui sta solo cio' che tocca
 * il DOM, la logica sta in `core.js`. La cache di rendering (`rows`) e' parte
 * dell'interfaccia e non entra mai nel modello.
 */

import {
  HOUR,
  NO_TIME,
  Timer,
  TimerState,
  TimerStore,
  VERSION,
  ZONES,
  browserTimeZone,
  categoryColor,
  formatClock,
  formatClockSeconds,
  formatLeft,
  formatMinutes,
  getTimeZone,
  localAt,
  nowLocal,
  parseBeeps,
  parseHHMM,
  parseMinutes,
  setTimeZone,
  sortEntries,
} from "./core.js";
import {
  flashTitle,
  notificationsReady,
  notify,
  playBeep,
  requestNotifications,
  setWakeLock,
  unlockAudio,
} from "./alerts.js";
import {
  exportFile,
  importFile,
  isReturningVisitor,
  load,
  loadTimeZone,
  markVisited,
  save,
  saveTimeZone,
  storageAvailable,
} from "./storage.js";

const TICK_MS = 500;
const TOAST_MS = 6000;
const SAVE_DEBOUNCE_MS = 400;
const PURGE_MIN_AGE = HOUR;
const MAX_UNDO = 20;

const store = new TimerStore();
/** @type {Map<string, {el: HTMLElement, cache: string}>} Cache di rendering. */
const rows = new Map();
/** @type {Array<{payloads: object[], label: string}>} */
const undoStack = [];

let selectedId = null;
let unlockedOnce = false;
let editingId = null;
let actionsId = null;
let currentOrder = "";
let saveHandle = null;
let toastHandle = null;
let installPrompt = null;

const $ = (id) => document.getElementById(id);

const list = $("timer-list");
const emptyState = $("empty-state");
const editor = $("editor");
const editorForm = $("editor-form");
const editorError = $("editor-error");
const actionsDialog = $("actions");
const settingsDialog = $("settings");
const toastBox = $("toast");
const toastText = $("toast-text");
const toastAction = $("toast-action");

// ------------------------------------------------------------ salvataggio ---

/** Programma un salvataggio, accorpando le modifiche ravvicinate. */
function scheduleSave() {
  if (saveHandle !== null) clearTimeout(saveHandle);
  saveHandle = setTimeout(saveNow, SAVE_DEBOUNCE_MS);
}

function saveNow() {
  if (saveHandle !== null) clearTimeout(saveHandle);
  saveHandle = null;
  if (!save(store)) toast("Salvataggio non riuscito: la memoria del browser è piena o bloccata.");
}

// ---------------------------------------------------------------- toast -----

/**
 * Mostra un messaggio temporaneo, con un'azione facoltativa.
 *
 * @param {string} text Messaggio da mostrare.
 * @param {?string} [actionLabel] Testo del pulsante, null per nasconderlo.
 * @param {?Function} [onAction] Cosa fare al clic sul pulsante.
 */
function toast(text, actionLabel = null, onAction = null) {
  toastText.textContent = text;
  toastAction.hidden = actionLabel === null;
  if (actionLabel !== null) {
    toastAction.textContent = actionLabel;
    toastAction.onclick = () => {
      hideToast();
      onAction?.();
    };
  }
  toastBox.hidden = false;
  if (toastHandle !== null) clearTimeout(toastHandle);
  toastHandle = setTimeout(hideToast, TOAST_MS);
}

function hideToast() {
  toastBox.hidden = true;
  if (toastHandle !== null) clearTimeout(toastHandle);
  toastHandle = null;
}

// -------------------------------------------------------------- rendering ---

function createRow(timerId) {
  const el = document.createElement("li");
  el.className = "timer";
  el.dataset.id = timerId;
  // La casella sta in un'etichetta piu' grande di lei, per prenderla con il dito.
  el.innerHTML = `
    <label class="sound"><input type="checkbox" aria-label="Suono" /></label>
    <input class="beeps" inputmode="numeric" maxlength="2" autocomplete="off"
      aria-label="Numero di bip" title="Quante volte suona l'allarme" />
    <span class="name"></span>
    <div class="meta"><span class="map"></span><span class="category"></span></div>
    <div class="times"><span class="time"></span><span class="spawn"></span><span class="maxspawn"></span></div>
    <span class="left"></span>
    <button class="menu" type="button" aria-label="Azioni">&#8942;</button>`;
  list.append(el);
  return el;
}

/**
 * Aggiorna una riga solo quando il contenuto e' cambiato.
 *
 * @param {string} timerId Identificatore del timer.
 * @param {Timer} timer Timer da mostrare.
 * @param {number} now Istante corrente.
 */
function renderRow(timerId, timer, now) {
  let row = rows.get(timerId);
  if (row === undefined) {
    row = { el: createRow(timerId), cache: "" };
    rows.set(timerId, row);
  }

  const state = timer.state(now);
  const cells = {
    name: timer.name,
    map: timer.mappa,
    category: timer.categoria,
    time: formatClock(timer.start),
    spawn: formatClock(timer.openAt),
    maxspawn: timer.isFixed ? NO_TIME : formatClock(timer.closeAt),
    left: formatLeft(timer, now),
  };
  const signature = `${Object.values(cells).join("")}|${timer.sound}|${timer.beeps}|${state}|${selectedId === timerId}`;
  if (row.cache === signature) return;
  row.cache = signature;

  for (const [key, value] of Object.entries(cells)) {
    row.el.querySelector(`.${key}`).textContent = value;
  }
  row.el.querySelector(".sound input").checked = timer.sound;
  // Il campo non va riscritto mentre ci si scrive dentro.
  const beeps = row.el.querySelector(".beeps");
  if (document.activeElement !== beeps) beeps.value = String(timer.beeps);
  row.el.dataset.state = state;
  row.el.classList.toggle("selected", selectedId === timerId);
  row.el.style.setProperty("--cat", categoryColor(timer.categoria));
}

/**
 * Ridisegna la lista, riordinandola quando l'ordine e' cambiato.
 *
 * @param {number} now Istante corrente.
 */
function render(now) {
  const ordered = sortEntries(store.timers, now);

  for (const [timerId, row] of rows) {
    if (!store.timers.has(timerId)) {
      row.el.remove();
      rows.delete(timerId);
    }
  }
  for (const [timerId, timer] of ordered) renderRow(timerId, timer, now);

  const order = ordered.map(([timerId]) => timerId).join(",");
  // Spostare una riga toglierebbe il fuoco al campo dei bip mentre ci si scrive.
  if (order !== currentOrder && !document.activeElement?.matches(".beeps")) {
    currentOrder = order;
    // append sposta i nodi gia' presenti: la lista si riordina senza ricrearla.
    list.append(...ordered.map(([timerId]) => rows.get(timerId).el));
  }

  emptyState.hidden = store.timers.size > 0;
}

// ----------------------------------------------------------------- allarmi --

/**
 * Emette gli allarmi dovuti e aggiorna il richiamo nel titolo.
 *
 * @param {number} now Istante corrente.
 */
function runAlerts(now) {
  let changed = false;
  let pending = 0;

  for (const timer of store.timers.values()) {
    if (!timer.acked && timer.state(now) !== TimerState.PENDING) pending += 1;
    // Quante volte suonare lo dice la colonna Bip del timer: `repeat_alert` e
    // `alert_max_count` delle impostazioni valgono solo per l'applicazione desktop.
    if (!timer.alertDue(now, timer.beeps)) continue;
    playBeep(store.settings.volume);
    notify(`${timer.name}: spawn aperto`, timer.mappa || "Finestra di spawn aperta", timer.name);
    timer.registerAlert(now, store.settings.alertRepeatSeconds);
    changed = true;
  }

  flashTitle(document.hidden ? pending : 0);
  if (changed) scheduleSave();
}

function tick() {
  const now = nowLocal();
  runAlerts(now);
  render(now);
  $("clock-time").textContent = formatClockSeconds(now);
}

// ----------------------------------------------------------- fuso orario ---

/** Nome breve del fuso attivo, per l'intestazione. */
function zoneLabel() {
  const zone = getTimeZone() ?? browserTimeZone();
  const known = ZONES.find(([name]) => name === zone);
  if (known !== undefined) return known[1];
  // Di un fuso non in elenco resta la parte utile: "America/Bogota" -> "Bogota".
  return zone.split("/").pop().replace(/_/g, " ");
}

function refreshZoneLabel() {
  const auto = getTimeZone() === null;
  $("clock-zone").textContent = auto ? `${zoneLabel()} (auto)` : zoneLabel();
}

function setupTimeZone() {
  const select = $("zone-select");
  const auto = document.createElement("option");
  auto.value = "";
  auto.textContent = `Automatico (${browserTimeZone()})`;
  select.append(auto);
  for (const [zone, label] of ZONES) {
    const option = document.createElement("option");
    option.value = zone;
    option.textContent = label;
    select.append(option);
  }

  const saved = loadTimeZone();
  if (saved !== null) setTimeZone(saved);
  select.value = getTimeZone() ?? "";
  $("zone-detected").textContent = `Il tuo browser dichiara ${browserTimeZone()}.`;
  refreshZoneLabel();

  select.addEventListener("change", () => {
    const zone = select.value === "" ? null : select.value;
    if (!setTimeZone(zone)) return;
    saveTimeZone(zone);
    refreshZoneLabel();
    // Gli orari mostrati cambiano tutti insieme: la cache va buttata.
    for (const row of rows.values()) row.cache = "";
    tick();
  });

  $("clock").addEventListener("click", () => $("timezone").showModal());
}

// ------------------------------------------------------------- form timer ---

function refreshDatalists() {
  const fill = (id, values) => {
    $(id).innerHTML = "";
    for (const value of values) {
      const option = document.createElement("option");
      option.value = value;
      $(id).append(option);
    }
  };
  fill("names", store.history.nome);
  fill("maps", store.history.mappa);
  fill("categories", store.history.categoria);
}

/**
 * Apre il form.
 *
 * @param {?string} timerId Timer da modificare, null per crearne uno nuovo.
 */
function openEditor(timerId) {
  editingId = timerId;
  editorError.hidden = true;
  refreshDatalists();

  const timer = timerId === null ? null : store.timers.get(timerId);
  $("editor-title").textContent = timer === null ? "Nuovo timer" : "Modifica timer";
  $("editor-submit").textContent = timer === null ? "Aggiungi" : "Salva";
  editorForm.reset();
  if (timer !== null) {
    $("field-name").value = timer.name;
    $("field-map").value = timer.mappa;
    $("field-category").value = timer.categoria;
    $("field-time").value = formatClock(timer.start);
    $("field-min").value = formatMinutes(timer.dmin);
    $("field-max").value = timer.isFixed ? "" : formatMinutes(timer.dmax);
  }
  editor.showModal();
  if (timer === null) $("field-name").focus();
}

/** Compila i campi vuoti con i valori dell'ultimo timer omonimo. */
function applyPreset() {
  const preset = store.presetFor($("field-name").value);
  if (preset === null) return;
  if (!$("field-map").value.trim()) $("field-map").value = preset.mappa;
  if (!$("field-category").value.trim()) $("field-category").value = preset.categoria;
  if (!$("field-min").value.trim()) $("field-min").value = formatMinutes(preset.dmin);
  if (!$("field-max").value.trim() && preset.dmin !== preset.dmax) {
    $("field-max").value = formatMinutes(preset.dmax);
  }
}

/**
 * Legge il form.
 *
 * @returns {?{name: string, mappa: string, categoria: string, start: number,
 *   dmin: number, dmax: number}} null se i valori non sono validi.
 */
function readEditor() {
  const dmin = parseMinutes($("field-min").value);
  if (dmin === null) {
    showEditorError("Min deve essere una durata positiva, come 190 o 1h30.");
    return null;
  }
  const rawMax = $("field-max").value.trim();
  const dmax = rawMax === "" ? dmin : parseMinutes(rawMax);
  if (dmax === null) {
    showEditorError("Max non è una durata valida. Lascialo vuoto per un timer fisso.");
    return null;
  }

  const rawTime = $("field-time").value.trim();
  let start = nowLocal();
  if (rawTime !== "") {
    const clock = parseHHMM(rawTime);
    if (clock === null) {
      showEditorError("L'ora va scritta come 23:50. Lasciala vuota per partire da adesso.");
      return null;
    }
    start = localAt(clock.hour, clock.minute);
  }

  return {
    name: $("field-name").value.trim() || "Timer",
    mappa: $("field-map").value.trim(),
    categoria: $("field-category").value.trim() || "MvP",
    start,
    dmin: Math.min(dmin, dmax),
    dmax: Math.max(dmin, dmax),
  };
}

function showEditorError(message) {
  editorError.textContent = message;
  editorError.hidden = false;
}

function submitEditor(event) {
  event.preventDefault();
  const fields = readEditor();
  if (fields === null) return;

  if (editingId === null) {
    const timerId = store.add(new Timer(fields));
    selectedId = timerId;
  } else {
    const timer = store.timers.get(editingId);
    if (timer === undefined) {
      editor.close();
      return;
    }
    timer.name = fields.name;
    timer.mappa = fields.mappa;
    timer.categoria = fields.categoria;
    // Spostare la partenza o la finestra riarma l'allarme, come nel desktop.
    if (timer.start !== fields.start) timer.reschedule(fields.start);
    if (timer.dmin !== fields.dmin || timer.dmax !== fields.dmax) {
      timer.setWindow(fields.dmin, fields.dmax);
    }
  }

  const timer = store.timers.get(editingId ?? selectedId);
  if (timer === undefined) return;
  store.remember("nome", timer.name);
  store.remember("mappa", timer.mappa);
  store.remember("categoria", timer.categoria);
  store.rememberPreset(timer);

  editor.close();
  saveNow();
  tick();
}

// ---------------------------------------------------------------- comandi ---

function selectTimer(timerId) {
  selectedId = timerId;
  // Guardare un timer vale come averlo visto: ferma la ripetizione dell'allarme.
  const timer = store.timers.get(timerId);
  if (timer !== undefined && timer.acknowledge()) scheduleSave();
  tick();
}

function duplicate(timerId) {
  const timer = store.timers.get(timerId);
  if (timer === undefined) return;
  const copy = new Timer({
    name: timer.name,
    mappa: timer.mappa,
    categoria: timer.categoria,
    start: nowLocal(),
    dmin: timer.dmin,
    dmax: timer.dmax,
    sound: timer.sound,
    beeps: timer.beeps,
  });
  selectedId = store.add(copy);
  saveNow();
  tick();
}

function refresh(timerId) {
  const timer = store.timers.get(timerId);
  if (timer === undefined) return;
  timer.reschedule(nowLocal());
  saveNow();
  tick();
}

/**
 * Rimuove i timer indicati, lasciando l'annullamento nel toast.
 *
 * @param {string[]} timerIds Identificatori da rimuovere.
 */
function removeTimers(timerIds) {
  const payloads = store.remove(timerIds);
  if (payloads.length === 0) return;
  pushUndo(payloads, `${payloads.length} timer ${payloads.length > 1 ? "rimossi" : "rimosso"}`);
  if (timerIds.includes(selectedId)) selectedId = null;
  saveNow();
  tick();
}

function clearExpired() {
  const now = nowLocal();
  const ids = store.staleIds(now, PURGE_MIN_AGE);
  if (ids.length === 0) {
    toast("Niente da togliere: nessuna finestra chiusa da più di un'ora.");
    return;
  }
  const payloads = store.archiveIds(ids, now);
  pushUndo(payloads, `${payloads.length} timer ${payloads.length > 1 ? "archiviati" : "archiviato"}`);
  saveNow();
  tick();
}

function pushUndo(payloads, label) {
  undoStack.push({ payloads, label });
  if (undoStack.length > MAX_UNDO) undoStack.shift();
  toast(label, "Annulla", undo);
}

function undo() {
  const entry = undoStack.pop();
  if (entry === undefined) {
    toast("Niente da annullare.");
    return;
  }
  store.restore(entry.payloads);
  saveNow();
  tick();
  toast("Ripristinato.");
}

function toggleSound(timerId) {
  const timer = store.timers.get(timerId);
  if (timer === undefined) return;
  timer.sound = !timer.sound;
  scheduleSave();
  tick();
}

/**
 * Imposta quante volte suona l'allarme di un timer.
 *
 * @param {string} timerId Identificatore del timer.
 * @param {HTMLInputElement} input Campo della riga: viene riscritto con il
 *   valore accettato, 1 se era vuoto o non era un numero.
 */
function setBeeps(timerId, input) {
  const timer = store.timers.get(timerId);
  if (timer === undefined) return;
  timer.beeps = parseBeeps(input.value);
  input.value = String(timer.beeps);
  scheduleSave();
}

// -------------------------------------------------------------- impostazioni

/** Aggiorna il pulsante che chiede il permesso per suono e notifiche. */
function refreshAlertsButton() {
  const audioMissing = !unlockedOnce;
  $("btn-alerts").hidden = !audioMissing;
  $("btn-notifications").textContent = notificationsReady()
    ? "Notifiche attive"
    : "Attiva le notifiche";
  $("btn-notifications").disabled = notificationsReady();
}

/** Sblocca l'audio: i browser lo consentono solo da un gesto dell'utente. */
async function enableAudio() {
  unlockedOnce = (await unlockAudio()) || unlockedOnce;
  refreshAlertsButton();
}

async function chooseImport(file) {
  try {
    const imported = await importFile(file);
    store.timers = imported.timers;
    store.history = imported.history;
    store.presets = imported.presets;
    store.archive = imported.archive;
    store.settings = imported.settings;
    store.nextId = imported.nextId;
    rows.clear();
    list.innerHTML = "";
    currentOrder = "";
    selectedId = null;
    applySettings();
    saveNow();
    tick();
    toast(`Importati ${store.timers.size} timer.`);
  } catch (error) {
    console.error(error);
    toast("Quel file non è un'esportazione dei timer.");
  }
}

function applySettings() {
  $("field-volume").value = String(store.settings.volume);
  $("volume-value").textContent = String(store.settings.volume);
}

// ------------------------------------------------------------------ eventi --

function bindEvents() {
  // Un gesto qualsiasi sblocca l'audio: il primo tap sulla pagina basta.
  document.addEventListener("pointerdown", enableAudio, { once: true });

  list.addEventListener("click", (event) => {
    const row = event.target.closest(".timer");
    if (row === null) return;
    const timerId = row.dataset.id;
    if (event.target.closest(".sound") !== null) {
      // Il clic sull'etichetta ne genera un secondo sulla casella: conta solo quello.
      if (event.target.matches("input")) toggleSound(timerId);
      return;
    }
    // Scrivere il numero di bip non vale come aver visto il timer.
    if (event.target.matches(".beeps")) return;
    if (event.target.closest(".menu") !== null) {
      openActions(timerId);
      return;
    }
    selectTimer(timerId);
  });

  list.addEventListener("dblclick", (event) => {
    const row = event.target.closest(".timer");
    if (row !== null && event.target.closest("button, .sound, .beeps") === null) {
      openEditor(row.dataset.id);
    }
  });

  list.addEventListener("change", (event) => {
    if (!event.target.matches(".beeps")) return;
    setBeeps(event.target.closest(".timer").dataset.id, event.target);
  });
  list.addEventListener("keydown", (event) => {
    // Invio conferma il numero, come l'uscita dal campo.
    if (event.key === "Enter" && event.target.matches(".beeps")) event.target.blur();
  });

  $("btn-add").addEventListener("click", () => openEditor(null));
  $("btn-settings").addEventListener("click", () => settingsDialog.showModal());
  $("btn-alerts").addEventListener("click", async () => {
    await enableAudio();
    await requestNotifications();
    refreshAlertsButton();
  });

  editorForm.addEventListener("submit", submitEditor);
  $("field-name").addEventListener("change", applyPreset);
  $("field-name").addEventListener("blur", applyPreset);

  actionsDialog.addEventListener("click", (event) => {
    const action = event.target.dataset?.action;
    if (action === undefined) return;
    actionsDialog.close();
    if (action === "edit") openEditor(actionsId);
    if (action === "duplicate") duplicate(actionsId);
    if (action === "refresh") refresh(actionsId);
    if (action === "remove") removeTimers([actionsId]);
  });

  for (const button of document.querySelectorAll("[data-close]")) {
    button.addEventListener("click", () => button.closest("dialog").close());
  }

  $("field-volume").addEventListener("input", (event) => {
    store.settings.volume = Number(event.target.value);
    $("volume-value").textContent = event.target.value;
    scheduleSave();
  });
  $("field-volume").addEventListener("change", () => playBeep(store.settings.volume));

  $("field-wakelock").addEventListener("change", (event) => {
    setWakeLock(event.target.checked);
  });

  $("btn-notifications").addEventListener("click", async () => {
    const granted = await requestNotifications();
    refreshAlertsButton();
    if (!granted) toast("Le notifiche sono bloccate nelle impostazioni del browser.");
  });

  $("btn-clear").addEventListener("click", () => {
    settingsDialog.close();
    clearExpired();
  });
  $("btn-export").addEventListener("click", () => exportFile(store));
  $("btn-import").addEventListener("click", () => $("file-import").click());
  $("file-import").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file !== undefined) {
      settingsDialog.close();
      chooseImport(file);
    }
    event.target.value = "";
  });
  // Il tema e' del sito, non dei timer: lo cambia e lo ricorda gate.js.
  $("btn-theme").addEventListener("click", () => window.toggleTheme());

  // Scorciatoie a lettera singola invece delle combinazioni del desktop:
  // Ctrl+R e Ctrl+D nel browser sono gia' prese da ricarica e segnalibro.
  document.addEventListener("keydown", (event) => {
    if (event.target.matches("input, textarea, select")) return;
    const key = event.key.toLowerCase();
    if (event.ctrlKey && key === "z") {
      event.preventDefault();
      undo();
    } else if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    } else if (key === "n") {
      event.preventDefault();
      openEditor(null);
    } else if (key === "d" && selectedId !== null) {
      duplicate(selectedId);
    } else if (key === "r" && selectedId !== null) {
      refresh(selectedId);
    } else if (event.key === "Delete" && selectedId !== null) {
      removeTimers([selectedId]);
    }
  });

  document.addEventListener("visibilitychange", () => {
    // Con la scheda nascosta i timer del browser rallentano: al ritorno si
    // ricalcola tutto dall'orologio, mai per accumulo.
    if (!document.hidden) {
      if ($("field-wakelock").checked) setWakeLock(true);
      tick();
    }
  });
  window.addEventListener("pagehide", saveNow);

}

// ------------------------------------------------------------ installazione -

/** @returns {boolean} True se la pagina gira gia' come applicazione installata. */
function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true
  );
}

/**
 * Istruzioni per i browser che non offrono l'installazione automatica.
 *
 * Safari non emette `beforeinstallprompt` e non installa da solo: senza queste
 * indicazioni su iPhone la voce resta nascosta nel menu di condivisione.
 *
 * @returns {string} Il testo delle istruzioni, in HTML.
 */
function installSteps() {
  const ua = navigator.userAgent;
  // Gli iPad recenti si dichiarano Macintosh: il tocco li distingue.
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);

  if (isIOS) {
    return `
      <p>In <strong>Safari</strong>:</p>
      <ol>
        <li>Tocca il pulsante <strong>Condividi</strong>, il quadrato con la freccia.</li>
        <li>Scorri in basso e tocca <strong>Aggiungi alla schermata Home</strong>.</li>
        <li>Conferma con <strong>Aggiungi</strong>.</li>
      </ol>
      <p class="hint">Su iPhone e iPad lo può fare solo Safari. Le notifiche
      funzionano solo dopo aver installato l'applicazione in questo modo.</p>`;
  }
  if (/Android/.test(ua)) {
    return `
      <p>Dal menu del browser:</p>
      <ol>
        <li>Tocca il menu <strong>&#8942;</strong>, in alto a destra.</li>
        <li>Tocca <strong>Installa app</strong> o <strong>Aggiungi a schermata Home</strong>.</li>
        <li>Conferma.</li>
      </ol>`;
  }
  return `
    <p>Nel menu del browser cerca <strong>Installa</strong> o
    <strong>Aggiungi a schermata Home</strong>. In Chrome e in Edge lo stesso
    comando è l'icona in fondo a destra nella barra dell'indirizzo.</p>`;
}

/** Mostra il pulsante di installazione, con il prompt nativo dove esiste. */
function setupInstall() {
  const button = $("btn-install");
  if (isStandalone()) return;
  button.hidden = false;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
  });

  button.addEventListener("click", async () => {
    if (installPrompt !== null) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      return;
    }
    $("install-steps").innerHTML = installSteps();
    $("install").showModal();
  });

  window.addEventListener("appinstalled", () => {
    button.hidden = true;
    installPrompt = null;
    $("install").close();
  });
}

function openActions(timerId) {
  actionsId = timerId;
  const timer = store.timers.get(timerId);
  $("actions-title").textContent = timer?.name ?? "Timer";
  actionsDialog.showModal();
}

// -------------------------------------------------------------------- avvio -

function init() {
  $("version").textContent = `Versione ${VERSION}`;

  if (!storageAvailable()) {
    toast("Navigazione privata: i timer si perdono alla chiusura di questa scheda.");
  } else {
    const { fromBackup } = load(store);
    if (fromBackup) toast("Dati principali illeggibili: recuperati dalla copia di sicurezza.");
  }

  applySettings();
  refreshAlertsButton();
  bindEvents();
  setupTimeZone();
  setupInstall();
  tick();
  setInterval(tick, TICK_MS);

  if (!isReturningVisitor()) {
    markVisited();
    toast("I timer sono salvati solo in questo browser. Esporta un file per tenerne una copia.");
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch((error) => {
      console.warn("Service worker non registrato:", error);
    });
  }
}

// `accessGranted` la espone gate.js, caricato dall'<head> prima di questo modulo.
window.accessGranted.then(init);
