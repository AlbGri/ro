/**
 * Codice di accesso, unico per tutto il sito.
 *
 * Ogni pagina lo include nell'<head> con `<script src="../gate.js"></script>`:
 * finche' il codice non viene inserito il contenuto resta coperto dalla
 * schermata di accesso. Lo stile e' qui dentro perche' le pagine del sito non
 * condividono un foglio di stile.
 *
 * Nel sorgente sta solo l'impronta SHA-256 del codice, non il codice: chi apre
 * il repository o gli strumenti per sviluppatori non lo legge scritto in chiaro.
 * Non e' pero' una protezione: il sito e' statico, quindi il contenuto si legge
 * comunque dal sorgente delle pagine, un codice corto si trova per tentativi e
 * chi lo conosce puo' passarlo a chiunque. Serve a tenere fuori i curiosi di
 * passaggio, niente di piu'.
 *
 * L'impronta si imposta con `node tools/set-access-code.mjs "codice"`.
 * A stringa vuota il sito e' aperto a tutti.
 *
 * E' uno script classico e non un modulo: le guide si aprono anche da file
 * locale, dove i moduli non si caricano.
 */

(() => {
  const ACCESS_HASH = "809770779ab9eed80d00159f4ddb738055d501c06ae1715c8e688ba7452f66cf";

  // La chiave e' nata con i timer e resta quella: cambiarla chiederebbe di
  // nuovo il codice a chi lo ha gia' inserito.
  const ACCESS_KEY = "ragnarok-timers/access";

  // Il contenuto si nasconde con `visibility` e non con `display`: le pagine
  // che misurano i propri elementi al caricamento troverebbero altezze nulle.
  const STYLE = `
    html.locked { overflow: hidden; }
    html.locked body > *:not(.gate) { visibility: hidden; }
    .gate {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: #1e1e1e;
      color: #e8e8e8;
      font: 15px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
    }
    .gate-box { width: 100%; max-width: 320px; margin: 0; text-align: center; }
    .gate-box h1 { margin: 0 0 24px; color: inherit; font: inherit; font-size: 20px; font-weight: 700; }
    .gate-box label { display: block; margin: 0 0 8px; color: #8a8a8a; font: inherit; font-size: 13px; }
    .gate-box input {
      box-sizing: border-box;
      width: 100%;
      margin: 0;
      padding: 12px;
      background: #2b2b2b;
      border: 1px solid #ffffff22;
      border-radius: 8px;
      color: #e8e8e8;
      font: inherit;
      font-size: 16px;
      text-align: center;
    }
    .gate-box input:focus-visible,
    .gate-box button:focus-visible { outline: 2px solid #e8e8e8; outline-offset: 2px; }
    .gate-box p { margin: 12px 0 0; color: #d1495b; font: inherit; font-size: 13px; }
    .gate-box p[hidden] { display: none; }
    .gate-box button {
      box-sizing: border-box;
      width: 100%;
      margin: 16px 0 0;
      padding: 12px;
      background: #4a7fb5;
      border: 0;
      border-radius: 8px;
      color: #fff;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }`;

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
   * Copre la pagina finche' non viene inserito il codice giusto.
   *
   * @returns {Promise<void>} Si risolve quando l'accesso e' consentito.
   */
  function requireAccess() {
    if (ACCESS_HASH === "" || alreadyUnlocked()) return Promise.resolve();
    if (!("crypto" in window) || crypto.subtle === undefined) {
      // Senza Web Crypto (pagina servita in HTTP semplice) non si puo' verificare.
      console.warn("Web Crypto non disponibile: accesso consentito senza codice.");
      return Promise.resolve();
    }

    // Lo script gira nell'<head>, prima che il contenuto venga disegnato: la
    // classe lo nasconde subito, la schermata arriva quando esiste il <body>.
    const root = document.documentElement;
    const style = document.createElement("style");
    style.textContent = STYLE;
    document.head.append(style);
    root.classList.add("locked");

    return new Promise((resolve) => {
      const show = () => {
        const gate = document.createElement("div");
        gate.className = "gate";
        gate.innerHTML = `
          <form class="gate-box">
            <h1>Ragnarok</h1>
            <label for="gate-code">Access code</label>
            <input id="gate-code" type="password" autocomplete="off" autocapitalize="none" spellcheck="false" />
            <p id="gate-error" hidden>Wrong code.</p>
            <button type="submit">Enter</button>
          </form>`;
        document.body.append(gate);

        const input = gate.querySelector("#gate-code");
        const error = gate.querySelector("#gate-error");
        input.focus();

        gate.querySelector("form").addEventListener("submit", async (event) => {
          event.preventDefault();
          if ((await sha256(input.value)) !== ACCESS_HASH) {
            error.hidden = false;
            input.select();
            return;
          }
          remember();
          gate.remove();
          style.remove();
          root.classList.remove("locked");
          resolve();
        });
      };

      if (document.body) show();
      else document.addEventListener("DOMContentLoaded", show);
    });
  }

  /** Si risolve quando l'accesso e' consentito: la attende chi non deve partire prima. */
  window.accessGranted = requireAccess();
})();
