/**
 * Allarmi: suono, notifiche di sistema e richiamo nel titolo della pagina.
 *
 * Sostituiscono il beep e il lampeggio della barra delle applicazioni della
 * versione desktop. Valgono due limiti del browser che l'interfaccia deve
 * rendere evidenti: l'audio parte solo dopo un'interazione dell'utente, e una
 * pagina chiusa non puo' avvisare di nulla.
 */

const FREQ = 880;
const DURATION = 0.3;
const FADE = 0.01;

let context = null;
let baseTitle = document.title;

/**
 * Prepara l'audio. Va chiamata da un gestore di evento di input.
 *
 * @returns {Promise<boolean>} True se il contesto audio e' pronto.
 */
export async function unlockAudio() {
  try {
    if (context === null) context = new AudioContext();
    // resume() e' asincrona: senza attenderla lo stato risulta ancora sospeso
    // e l'interfaccia continuerebbe a chiedere di abilitare il suono.
    if (context.state === "suspended") await context.resume();
    return context.state === "running";
  } catch (error) {
    console.warn("Audio non disponibile:", error);
    return false;
  }
}

/** @returns {boolean} True se il browser ha gia' concesso l'audio. */
export function audioReady() {
  return context !== null && context.state === "running";
}

/**
 * Riproduce la nota di allarme.
 *
 * @param {number} volume Volume da 0 a 100. A zero non suona nulla.
 */
export function playBeep(volume) {
  if (volume <= 0 || !audioReady()) return;
  const start = context.currentTime;
  const gain = context.createGain();
  // Le rampe evitano il click a inizio e fine nota.
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(Math.min(volume, 100) / 100, start + FADE);
  gain.gain.setValueAtTime(Math.min(volume, 100) / 100, start + DURATION - FADE);
  gain.gain.linearRampToValueAtTime(0, start + DURATION);

  const oscillator = context.createOscillator();
  oscillator.frequency.value = FREQ;
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + DURATION);
}

/**
 * Chiede il permesso di inviare notifiche. Va chiamata da un gesto dell'utente.
 *
 * @returns {Promise<boolean>} True se il permesso e' stato concesso.
 */
export async function requestNotifications() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  return (await Notification.requestPermission()) === "granted";
}

/** @returns {boolean} True se le notifiche sono utilizzabili. */
export function notificationsReady() {
  return "Notification" in window && Notification.permission === "granted";
}

/**
 * Mostra una notifica di sistema per un timer.
 *
 * @param {string} title Titolo della notifica.
 * @param {string} body Testo della notifica.
 * @param {string} tag Identificatore: una nuova notifica con lo stesso tag
 *   sostituisce la precedente invece di accumularsi.
 */
export function notify(title, body, tag) {
  if (!notificationsReady()) return;
  try {
    new Notification(title, { body, tag, icon: "icons/icon-192.png" });
  } catch (error) {
    // Su Android la notifica va creata dal service worker: se la costruzione
    // diretta fallisce restano il suono e il titolo.
    console.warn("Notifica non mostrata:", error);
  }
}

let flashTimer = null;

/**
 * Richiama l'attenzione alternando il titolo della pagina.
 *
 * @param {number} count Quanti timer sono in attesa di essere visti. A zero il
 *   titolo torna quello originale.
 */
export function flashTitle(count) {
  if (count <= 0) {
    if (flashTimer !== null) {
      clearInterval(flashTimer);
      flashTimer = null;
    }
    document.title = baseTitle;
    return;
  }
  const alert = `(${count}) Spawn!`;
  if (flashTimer !== null) return;
  let showAlert = true;
  document.title = alert;
  flashTimer = setInterval(() => {
    showAlert = !showAlert;
    document.title = showAlert ? alert : baseTitle;
  }, 1000);
}

let wakeLock = null;

/**
 * Impedisce allo schermo di spegnersi mentre l'applicazione e' in primo piano.
 *
 * Su un telefono i countdown restano corretti comunque, perche' sono ricalcolati
 * dall'orologio, ma con lo schermo spento nessun allarme puo' suonare.
 *
 * @param {boolean} enabled True per tenere lo schermo acceso.
 */
export async function setWakeLock(enabled) {
  if (!("wakeLock" in navigator)) return;
  try {
    if (enabled) {
      if (wakeLock === null) wakeLock = await navigator.wakeLock.request("screen");
    } else if (wakeLock !== null) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch (error) {
    // Il permesso decade quando la pagina passa in secondo piano: non e' un errore.
    console.warn("Wake lock non disponibile:", error);
    wakeLock = null;
  }
}

/** Riacquisisce il wake lock dopo un ritorno in primo piano. */
export function wakeLockActive() {
  return wakeLock !== null;
}
