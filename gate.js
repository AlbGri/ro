/**
 * Codice di accesso e tema, comuni a tutto il sito.
 *
 * Ogni pagina lo include nell'<head> con `<script src="../gate.js"></script>`:
 * finche' il codice non viene inserito il contenuto resta coperto dalla
 * schermata di accesso. Lo stile e' qui dentro perche' le pagine del sito non
 * condividono un foglio di stile.
 *
 * Girando prima che la pagina venga disegnata, e' anche il posto dove si
 * applica il tema chiaro o scuro scelto dall'utente, uguale per tutto il sito.
 * Per questo i due `<meta name="theme-color">` di una pagina stanno prima di
 * questo script.
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
  const root = document.documentElement;

  // ----------------------------------------------------------------- tema ---

  // La scelta vale per tutto il sito e sta in una chiave sua. Le pagine la
  // leggono dall'attributo `data-theme`; senza una scelta decide il sistema,
  // tramite i fogli di stile. La guida scrive la stessa chiave per conto suo,
  // perche' deve funzionare anche senza questo script.
  const THEME_KEY = "ragnarok/theme";

  try {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === "light" || theme === "dark") root.dataset.theme = theme;
  } catch {
    // Senza localStorage resta il tema del sistema.
  }

  /** Passa dal tema chiaro allo scuro e viceversa, e ricorda la scelta. */
  window.toggleTheme = () => {
    const dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, root.dataset.theme);
    } catch {
      // Senza localStorage la scelta vale per questa sola apertura.
    }
  };

  // Il colore della barra del browser sul telefono: ogni pagina lo dichiara due
  // volte, per il sistema chiaro e per quello scuro, prima di questo script.
  // Con un tema scelto a mano vale in entrambi i casi quello scelto. Si osserva
  // l'attributo perche' la guida lo cambia con codice suo.
  const syncThemeColor = () => {
    const metas = [...document.querySelectorAll('meta[name="theme-color"][media]')];
    for (const meta of metas) meta.dataset.color ??= meta.content;
    const theme = root.dataset.theme;
    const chosen = theme && metas.find((meta) => meta.getAttribute("media").includes(theme));
    for (const meta of metas) meta.content = (chosen || meta).dataset.color;
  };

  syncThemeColor();
  new MutationObserver(syncThemeColor).observe(root, { attributeFilter: ["data-theme"] });

  // -------------------------------------------------------------- accesso ---

  const ACCESS_HASH = "809770779ab9eed80d00159f4ddb738055d501c06ae1715c8e688ba7452f66cf";

  // La chiave e' nata con i timer e resta quella: cambiarla chiederebbe di
  // nuovo il codice a chi lo ha gia' inserito.
  const ACCESS_KEY = "ragnarok-timers/access";

  // Colori e caratteri sono quelli della guida Nuovo Mondo, chiari o scuri come
  // la pagina coperta, che lo dice con `data-theme` o lascia decidere al sistema.
  const DARK = `
      --gate-bg: #131a16; --gate-surface: #1b2420; --gate-ink: #e3eae2; --gate-muted: #9daa9f;
      --gate-line: #33413a; --gate-accent: #b79ceb; --gate-on-accent: #1b1530; --gate-error: #f08a72;
      color-scheme: dark;`;

  // Il contenuto si nasconde con `visibility` e non con `display`: le pagine
  // che misurano i propri elementi al caricamento troverebbero altezze nulle.
  const STYLE = `
    html.locked { overflow: hidden; }
    html.locked body > *:not(.gate) { visibility: hidden; }
    .gate {
      --gate-bg: #e6ebe2; --gate-surface: #f5f7f1; --gate-ink: #1d2821; --gate-muted: #56655b;
      --gate-line: #c6d0c1; --gate-accent: #6a4c9c; --gate-on-accent: #fff; --gate-error: #a3402c;
      color-scheme: light;
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: var(--gate-bg);
      color: var(--gate-ink);
      font: 16px/1.5 "Atkinson Hyperlegible", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) .gate {${DARK}
      }
    }
    :root[data-theme="dark"] .gate {${DARK}
    }
    .gate-box { width: 100%; max-width: 320px; margin: 0; text-align: center; }
    .gate-box h1 {
      margin: 0 0 20px;
      color: inherit;
      font: 700 2.1rem/1.05 "Alegreya", "Palatino Linotype", Palatino, Georgia, serif;
      letter-spacing: -0.01em;
    }
    .gate-box label { display: block; margin: 0 0 8px; color: var(--gate-muted); font: inherit; font-size: 0.9rem; }
    .gate-box input {
      box-sizing: border-box;
      width: 100%;
      margin: 0;
      padding: 11px 12px;
      background: var(--gate-surface);
      border: 1px solid var(--gate-line);
      border-radius: 8px;
      color: var(--gate-ink);
      font: inherit;
      text-align: center;
    }
    .gate-box input:focus-visible,
    .gate-box button:focus-visible { outline: 3px solid var(--gate-accent); outline-offset: 2px; }
    .gate-box p { margin: 12px 0 0; color: var(--gate-error); font: inherit; font-size: 0.9rem; }
    .gate-box p[hidden] { display: none; }
    .gate-box button {
      box-sizing: border-box;
      width: 100%;
      margin: 16px 0 0;
      padding: 11px 12px;
      background: var(--gate-accent);
      border: 1px solid var(--gate-accent);
      border-radius: 8px;
      color: var(--gate-on-accent);
      font: inherit;
      font-weight: 700;
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
            <h1>ro-tools</h1>
            <label for="gate-code">Codice di accesso</label>
            <input id="gate-code" type="password" autocomplete="off" autocapitalize="none" spellcheck="false" />
            <p id="gate-error" hidden>Codice sbagliato.</p>
            <button type="submit">Entra</button>
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
