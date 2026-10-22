/**
 * Codice di accesso, tema, lingua e menu ⚙, comuni a tutto il sito.
 *
 * Ogni pagina lo include nell'<head> con `<script src="../gate.js"></script>`:
 * finche' il codice non viene inserito il contenuto resta coperto dalla
 * schermata di accesso. Lo stile e' qui dentro perche' le pagine del sito non
 * condividono un foglio di stile.
 *
 * Girando prima che la pagina venga disegnata, e' anche il posto dove si
 * applica il tema chiaro o scuro scelto dall'utente, uguale per tutto il sito.
 * Per questo i due `<meta name="theme-color">` di una pagina stanno prima di
 * questo script. Per lo stesso motivo qui si applica la lingua scelta.
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

  // --------------------------------------------------------------- lingua ---

  // Come il tema, la lingua scelta vale per tutto il sito e sta in una chiave
  // sua. Senza una scelta il sito e' in italiano: l'inglese si sceglie con il
  // pulsante, la lingua del browser non conta.
  const LANG_KEY = "ragnarok/lang";

  let english = false;
  try {
    english = localStorage.getItem(LANG_KEY) === "en";
  } catch {
    // Senza localStorage il sito resta in italiano.
  }

  /** Sceglie fra le due versioni di una scritta: `tr("Chiudi", "Close")`. */
  const tr = (it, en) => (english ? en : it);
  window.tr = tr;

  /** Passa dall'italiano all'inglese e viceversa, e ricarica la pagina. */
  window.toggleLang = () => {
    try {
      localStorage.setItem(LANG_KEY, english ? "it" : "en");
    } catch {
      // Senza localStorage la scelta non si puo' ricordare: resta l'italiano.
      return;
    }
    location.reload();
  };

  // Una pagina tradotta lo dichiara con `data-bilingual` su <html> e tiene
  // l'inglese accanto all'italiano: `data-en` per il contenuto di un elemento,
  // `data-en-title` e simili per gli attributi. La sostituzione avviene appena
  // la pagina e' stata letta: prima dei moduli, che trovano gia' le scritte
  // giuste, e prima che venga disegnata. Fino ad allora la pagina resta
  // nascosta, per non mostrare l'italiano per un istante.
  const EN_ATTRIBUTES = ["title", "aria-label", "placeholder", "content"];

  if (english && root.hasAttribute("data-bilingual")) {
    root.lang = "en";
    root.style.visibility = "hidden";
    document.addEventListener(
      "readystatechange",
      () => {
        for (const el of document.querySelectorAll("[data-en]")) el.innerHTML = el.dataset.en;
        for (const name of EN_ATTRIBUTES) {
          for (const el of document.querySelectorAll(`[data-en-${name}]`)) {
            el.setAttribute(name, el.getAttribute(`data-en-${name}`));
          }
        }
        root.style.visibility = "";
      },
      { once: true },
    );
  }

  // Il pulsante della lingua sta nell'intestazione, subito prima del menu ⚙,
  // perche' si veda che la pagina c'e' anche in inglese (Alberto, 23/10/2026).
  // Mostra la lingua in cui si passa: bandiera e sigla, "EN" nell'HTML e "IT"
  // in `data-en`. La bandiera la disegna questo foglio di stile e non una
  // emoji, che su Windows compare come due lettere; sta qui per non ripeterla
  // in ogni pagina, e arriva prima che la pagina venga disegnata. Lo stesso
  // pulsante c'e' anche nelle pagine solo in italiano, che in inglese dicono in
  // cima che non sono tradotte (Alberto, 18/10/2026).
  const FLAG_UK =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'>" +
    "<clipPath id='c'><path d='M30 15h30v15zv15H0zH0V0zV0h30z'/></clipPath>" +
    "<path d='M0 0v30h60V0z' fill='#012169'/>" +
    "<path d='M0 0l60 30m0-30L0 30' stroke='#fff' stroke-width='6'/>" +
    "<path d='M0 0l60 30m0-30L0 30' clip-path='url(#c)' stroke='#C8102E' stroke-width='4'/>" +
    "<path d='M30 0v30M0 15h60' stroke='#fff' stroke-width='10'/>" +
    "<path d='M30 0v30M0 15h60' stroke='#C8102E' stroke-width='6'/></svg>";
  const FLAG_IT =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'>" +
    "<path d='M0 0h1v2H0z' fill='#009246'/><path d='M1 0h1v2H1z' fill='#fff'/>" +
    "<path d='M2 0h1v2H2z' fill='#CE2B37'/></svg>";
  const flagStyle = document.createElement("style");
  flagStyle.textContent = `
    [data-lang] { white-space: nowrap; }
    [data-lang]::before {
      content: ""; display: inline-block; width: 1.4em; height: 0.93em; margin-right: 0.4em; vertical-align: -0.14em;
      background: url("data:image/svg+xml,${encodeURIComponent(english ? FLAG_IT : FLAG_UK)}") center / cover;
      border-radius: 2px; box-shadow: 0 0 0 1px rgb(128 128 128 / 0.45);
    }
    @media (max-width: 430px) {
      header [data-lang] > span { display: none; }
      header [data-lang]::before { margin-right: 0; }
    }`;
  document.head.append(flagStyle);
  document.addEventListener("readystatechange", () => {
    for (const el of document.querySelectorAll("[data-lang]")) {
      el.title = tr("English", "Italiano");
      el.setAttribute("aria-label", el.title);
    }
  }, { once: true });

  if (english && !root.hasAttribute("data-bilingual")) {
    document.addEventListener("DOMContentLoaded", () => {
      for (const el of document.querySelectorAll("[data-lang] > span")) el.textContent = "IT";
      const notice = document.createElement("p");
      notice.className = "solo-italiano";
      notice.textContent = "This page is available in Italian only for now.";
      const style = document.createElement("style");
      style.textContent = `
        .solo-italiano {
          margin: 0; padding: 8px 16px; text-align: center; font: 0.9rem/1.4 "Atkinson Hyperlegible", "Segoe UI", sans-serif;
          background: #6a4c9c; color: #fff;
        }`;
      document.head.append(style);
      document.body.prepend(notice);
    });
  }

  // ---------------------------------------------------------------- menu ⚙ ---

  // Ogni pagina ha in alto a destra lo stesso menu, un `<details class="more">` aperto
  // dall'ingranaggio:
  // si chiude cliccando fuori o su una delle sue voci.
  document.addEventListener("click", (event) => {
    for (const menu of document.querySelectorAll("details.more[open]")) {
      if (!menu.contains(event.target) || event.target.closest(".more-menu button")) menu.open = false;
    }
  });

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
    }
    .gate-box .gate-lang {
      width: auto;
      margin: 24px 0 0;
      padding: 7px 12px;
      background: var(--gate-surface);
      border-color: var(--gate-line);
      color: var(--gate-ink);
      font-size: 0.92rem;
      font-weight: 400;
      line-height: 1.2;
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
            <label for="gate-code">${tr("Codice di accesso", "Access code")}</label>
            <input id="gate-code" type="password" autocomplete="off" autocapitalize="none" spellcheck="false" />
            <p id="gate-error" hidden>${tr("Codice sbagliato.", "Wrong code.")}</p>
            <button type="submit">${tr("Entra", "Enter")}</button>
            <button type="button" class="gate-lang" data-lang title="${tr("English", "Italiano")}"
              aria-label="${tr("English", "Italiano")}">${tr("EN", "IT")}</button>
          </form>`;
        document.body.append(gate);

        const input = gate.querySelector("#gate-code");
        const error = gate.querySelector("#gate-error");
        input.focus();
        gate.querySelector(".gate-lang").addEventListener("click", window.toggleLang);

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
