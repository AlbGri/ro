/**
 * Schermata di accesso.
 *
 * Nel sorgente sta solo l'impronta SHA-256 del codice, non il codice: chi apre
 * il repository o gli strumenti per sviluppatori non lo legge scritto in chiaro.
 * Non e' pero' una protezione: la pagina e' servita statica, quindi un codice
 * corto si trova per tentativi e chi lo conosce puo' passarlo a chiunque. Serve
 * a tenere fuori i curiosi di passaggio, niente di piu'.
 *
 * L'impronta si imposta con `node tools/set-access-code.mjs "codice"`.
 * A stringa vuota l'applicazione e' aperta a tutti.
 */

const ACCESS_HASH = "809770779ab9eed80d00159f4ddb738055d501c06ae1715c8e688ba7452f66cf";

const ACCESS_KEY = "ragnarok-timers/access";

/**
 * Calcola l'impronta SHA-256 di un testo.
 *
 * @param {string} text Testo da cifrare.
 * @returns {Promise<string>} L'impronta in esadecimale.
 */
async function sha256(text) {
  const data = new TextEncoder().encode(text.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** @returns {boolean} True se questo browser ha gia' superato il controllo. */
function alreadyUnlocked() {
  try {
    return localStorage.getItem(ACCESS_KEY) === ACCESS_HASH;
  } catch {
    return false;
  }
}

function remember() {
  try {
    localStorage.setItem(ACCESS_KEY, ACCESS_HASH);
  } catch {
    // Senza localStorage il codice va reinserito a ogni apertura.
  }
}

/**
 * Blocca l'applicazione finche' non viene inserito il codice giusto.
 *
 * @returns {Promise<void>} Si risolve quando l'accesso e' consentito.
 */
export function requireAccess() {
  if (ACCESS_HASH === "" || alreadyUnlocked()) return Promise.resolve();
  if (!("crypto" in window) || crypto.subtle === undefined) {
    // Senza Web Crypto (pagina servita in HTTP semplice) non si puo' verificare.
    console.warn("Web Crypto non disponibile: accesso consentito senza codice.");
    return Promise.resolve();
  }

  document.body.classList.add("locked");
  const gate = document.createElement("div");
  gate.className = "gate";
  gate.innerHTML = `
    <form class="gate-box">
      <h1>Ragnarok Timers</h1>
      <label for="gate-code">Access code</label>
      <input id="gate-code" type="password" autocomplete="off" autocapitalize="none" spellcheck="false" />
      <p class="error" id="gate-error" hidden>Wrong code.</p>
      <button type="submit" class="primary">Enter</button>
    </form>`;
  document.body.append(gate);

  const input = gate.querySelector("#gate-code");
  const error = gate.querySelector("#gate-error");
  input.focus();

  return new Promise((resolve) => {
    gate.querySelector("form").addEventListener("submit", async (event) => {
      event.preventDefault();
      if ((await sha256(input.value)) !== ACCESS_HASH) {
        error.hidden = false;
        input.select();
        return;
      }
      remember();
      gate.remove();
      document.body.classList.remove("locked");
      resolve();
    });
  });
}
