// Statistiche del sito: legge il file che l'azione di GitHub scrive ogni ora nel ramo
// "statistiche" (tools/statistiche.mjs) e lo disegna. Il token di GoatCounter non passa di qui.
const DATI = "https://raw.githubusercontent.com/AlbGri/ro/statistiche/statistiche.json";
const SVG = "http://www.w3.org/2000/svg";

const tr = window.tr;
const locale = tr("it-IT", "en-GB");
const numero = new Intl.NumberFormat(locale);
const decimale = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
const giornoBreve = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" });
const giornoLungo = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const nomePaese = new Intl.DisplayNames([tr("it", "en")], { type: "region" });
const nomeLingua = new Intl.DisplayNames([tr("it", "en")], { type: "language" });
const sconosciuto = tr("Sconosciuto", "Unknown");

// i nomi dei servizi, come nelle schede della home
const PAGINE = {
  "/ro/": ["Home", "Home"],
  "/ro/index.html": ["Home", "Home"],
  "/ro/timers/": ["Timer di respawn", "Respawn timers"],
  "/ro/timers/index.html": ["Timer di respawn", "Respawn timers"],
  "/ro/guide/nuovo-mondo.html": ["Guida Nuovo Mondo", "New World guide"],
  "/ro/guide/halloween-2026.html": ["Guida Halloween 2026", "Halloween 2026 guide"],
  "/ro/livelli/": ["Livelli fino all'84", "Levels up to 84"],
  "/ro/party/": ["Party", "Party"],
  "/ro/calcolatore/": ["Calcolatore", "Calculator"],
  "/ro/statistiche/": ["Statistiche", "Statistics"],
};
const AZIONI = {
  "lingua-inglese": ["Passaggi all'inglese", "Switches to English"],
  "lingua-italiano": ["Passaggi all'italiano", "Switches to Italian"],
  "timer-creato": ["Timer creati", "Timers created"],
  "timer-avvisi-attivati": ["Avvisi dei timer attivati", "Timer alerts enabled"],
  "timer-app-installata": ["App dei timer installate", "Timer app installs"],
  "timer-backup": ["Backup dei timer", "Timer data backups"],
  "timer-ripristino": ["Timer ripristinati da backup", "Timers restored from backup"],
  "calcolatore-build-salvata": ["Build salvate", "Builds saved"],
  "calcolatore-build-caricata": ["Build caricate", "Builds loaded"],
  "calcolatore-link-copiato": ["Link di build copiati", "Build links copied"],
  "calcolatore-importa-esterno": ["Build importate da altri calcolatori", "Builds imported from other calculators"],
  "calcolatore-confronto": ["Confronti fra due build", "Comparisons of two builds"],
  "calcolatore-backup": ["Backup del calcolatore", "Calculator data backups"],
  "calcolatore-ripristino": ["Calcolatore ripristinato da backup", "Calculator restored from backup"],
  "guida-note-esportate": ["Note della guida esportate", "Guide notes exported"],
  "guida-backup": ["Backup della guida", "Guide data backups"],
  "guida-ripristino": ["Guida ripristinata da backup", "Guide restored from backup"],
  "halloween-copia-discord": ["Sezioni di Halloween copiate per Discord", "Halloween sections copied for Discord"],
  "party-run-esportate": ["Run del party esportate", "Party runs exported"],
  "party-elenco-esportato": ["Elenchi del party esportati", "Party lists exported"],
  "party-backup": ["Backup del party", "Party data backups"],
  "party-ripristino": ["Party ripristinato da backup", "Party restored from backup"],
  "livelli-backup": ["Backup dei livelli", "Levels data backups"],
  "livelli-ripristino": ["Livelli ripristinati da backup", "Levels restored from backup"],
};
const SCHERMI = {
  phone: ["Telefono", "Phone"],
  tablet: ["Tablet", "Tablet"],
  desktop: ["Computer", "Computer"],
  desktophd: ["Computer, schermo grande", "Computer, large screen"],
};

const $ = (id) => document.getElementById(id);
let statistiche = null;
let periodo = "30";

// ---------- classifiche ----------

/** Una classifica: nome, valore (con la quota, se c'e' un totale) e barra. */
function barre(id, voci, totale) {
  const elenco = $(id);
  const visibili = voci.filter((v) => v.valore > 0);
  if (!visibili.length) {
    const vuoto = document.createElement("p");
    vuoto.className = "vuoto";
    vuoto.textContent = tr("Ancora nessun dato.", "No data yet.");
    elenco.replaceChildren(vuoto);
    return;
  }
  const massimo = Math.max(...visibili.map((v) => v.valore));
  elenco.replaceChildren(
    ...visibili.map((v) => {
      const li = document.createElement("li");
      const nome = document.createElement("span");
      nome.className = "nome";
      nome.textContent = v.nome;
      const valore = document.createElement("span");
      valore.className = "valore";
      valore.textContent = numero.format(v.valore);
      if (totale) {
        const quota = document.createElement("span");
        quota.textContent = `${Math.round((100 * v.valore) / totale)}%`;
        valore.append(quota);
      }
      const binario = document.createElement("div");
      binario.className = "binario";
      const barra = document.createElement("div");
      barra.className = "barra";
      barra.style.width = `${(100 * v.valore) / massimo}%`;
      binario.append(barra);
      li.append(nome, valore, binario);
      return li;
    }),
  );
}

// le voci di una suddivisione con il nome da mostrare, sommando quelle con lo stesso nome
function voci(elenco, nome) {
  const somme = new Map();
  for (const v of elenco) somme.set(nome(v), (somme.get(nome(v)) || 0) + v.visite);
  return [...somme].map(([nome, valore]) => ({ nome, valore })).sort((a, b) => b.valore - a.valore);
}
const scegli = (coppia) => (coppia ? tr(...coppia) : null);
const sicuro = (fn, valore) => {
  try {
    return fn(valore) || valore;
  } catch {
    return valore;
  }
};
const ignoto = (nome) => !nome || nome === "(unknown)";
const maiuscola = (testo) => testo.charAt(0).toLocaleUpperCase(locale) + testo.slice(1);

// ---------- andamento ----------

const crea = (tag, attributi) => {
  const el = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attributi)) el.setAttribute(k, v);
  return el;
};

// un massimo tondo per l'asse, con 4 tacche al piu': 1, 2 o 5 per una potenza di 10
function asse(massimo) {
  if (massimo <= 0) return { tetto: 4, passo: 1 };
  const grezzo = massimo / 4;
  const potenza = 10 ** Math.floor(Math.log10(grezzo));
  const passo = Math.max(1, [1, 2, 5, 10].map((m) => m * potenza).find((p) => p >= grezzo));
  return { tetto: Math.ceil(massimo / passo) * passo, passo };
}

function andamento(giorni) {
  const contenitore = $("grafico");
  const suggerimento = $("suggerimento");
  contenitore.querySelector("svg")?.remove();
  const larghezza = contenitore.clientWidth;
  const altezza = contenitore.clientHeight;
  const margine = { sopra: 12, destra: 12, sotto: 26, sinistra: 36 };
  const w = larghezza - margine.sinistra - margine.destra;
  const h = altezza - margine.sopra - margine.sotto;
  const { tetto, passo } = asse(Math.max(...giorni.map((g) => g.visite)));
  const x = (i) => margine.sinistra + (giorni.length > 1 ? (i * w) / (giorni.length - 1) : w / 2);
  const y = (v) => margine.sopra + h - (v * h) / tetto;

  const svg = crea("svg", {
    viewBox: `0 0 ${larghezza} ${altezza}`,
    role: "img",
    tabindex: "0",
    "aria-label": tr("Visite giorno per giorno; con le frecce si passa da un giorno all'altro", "Visits by day; the arrow keys move from day to day"),
  });
  for (let v = 0; v <= tetto; v += passo) {
    svg.append(crea("line", { class: "griglia-y", x1: margine.sinistra, x2: larghezza - margine.destra, y1: y(v), y2: y(v) }));
    const testo = crea("text", { class: "testo-asse", x: margine.sinistra - 8, y: y(v) + 4, "text-anchor": "end" });
    testo.textContent = numero.format(v);
    svg.append(testo);
  }
  // una data ogni 80 px circa, sempre la prima e l'ultima
  const ogni = Math.max(1, Math.ceil(giorni.length / Math.max(2, Math.floor(w / 80))));
  giorni.forEach((g, i) => {
    if (i % ogni && i !== giorni.length - 1) return;
    if (i !== giorni.length - 1 && giorni.length - 1 - i < ogni) return;
    const testo = crea("text", {
      class: "testo-asse",
      x: x(i),
      y: altezza - 6,
      "text-anchor": giorni.length === 1 ? "middle" : i === 0 ? "start" : i === giorni.length - 1 ? "end" : "middle",
    });
    testo.textContent = giornoBreve.format(new Date(g.giorno));
    svg.append(testo);
  });
  const punti = giorni.map((g, i) => `${x(i)},${y(g.visite)}`);
  if (giorni.length > 1) {
    svg.append(crea("path", { class: "area", d: `M${x(0)},${y(0)} L${punti.join(" L")} L${x(giorni.length - 1)},${y(0)} Z` }));
    svg.append(crea("path", { class: "linea", d: `M${punti.join(" L")}` }));
  }
  const ultimo = giorni.length - 1;
  svg.append(crea("circle", { class: "punto", cx: x(ultimo), cy: y(giorni[ultimo].visite), r: 4 }));

  // il mirino si aggancia al giorno piu' vicino; lo stesso con le frecce
  const mirino = crea("line", { class: "mirino", y1: margine.sopra, y2: margine.sopra + h, visibility: "hidden" });
  const segno = crea("circle", { class: "punto", r: 4, visibility: "hidden" });
  svg.append(mirino, segno);
  let scelto = null;
  const mostra = (i) => {
    scelto = i;
    for (const el of [mirino, segno]) el.setAttribute("visibility", "visible");
    mirino.setAttribute("x1", x(i));
    mirino.setAttribute("x2", x(i));
    segno.setAttribute("cx", x(i));
    segno.setAttribute("cy", y(giorni[i].visite));
    const valore = document.createElement("strong");
    valore.textContent = `${numero.format(giorni[i].visite)} ${giorni[i].visite === 1 ? tr("visita", "visit") : tr("visite", "visits")}`;
    const data = document.createElement("span");
    data.textContent = giornoLungo.format(new Date(giorni[i].giorno));
    suggerimento.replaceChildren(valore, data);
    suggerimento.hidden = false;
    const largo = suggerimento.offsetWidth;
    suggerimento.style.left = `${Math.min(Math.max(x(i) - largo / 2, 0), larghezza - largo)}px`;
    suggerimento.style.top = `${Math.max(y(giorni[i].visite) - suggerimento.offsetHeight - 14, 0)}px`;
  };
  const nascondi = () => {
    scelto = null;
    for (const el of [mirino, segno]) el.setAttribute("visibility", "hidden");
    suggerimento.hidden = true;
  };
  svg.addEventListener("pointermove", (event) => {
    const dentro = event.clientX - svg.getBoundingClientRect().left;
    const i = giorni.length > 1 ? Math.round(((dentro - margine.sinistra) / w) * (giorni.length - 1)) : 0;
    mostra(Math.min(Math.max(i, 0), ultimo));
  });
  svg.addEventListener("pointerleave", nascondi);
  svg.addEventListener("blur", nascondi);
  svg.addEventListener("keydown", (event) => {
    const passo = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (!passo) return;
    event.preventDefault();
    mostra(Math.min(Math.max((scelto ?? ultimo + (passo > 0 ? -1 : 1)) + passo, 0), ultimo));
  });
  contenitore.prepend(svg);
}

// ---------- pagina ----------

function giorniDelPeriodo(dati) {
  // per 7 e 30 giorni l'API da' anche il giorno in cui cade l'inizio: si tengono gli ultimi, e
  // non quelli prima del primo giorno contato, che falserebbero grafico e media
  const primo = statistiche.periodi.tutto.inizio.slice(0, 10);
  const giorni = periodo === "tutto" ? dati.giorni : dati.giorni.slice(-Number(periodo));
  return giorni.filter((g) => g.giorno >= primo);
}

function disegna() {
  const dati = statistiche.periodi[periodo];
  const giorni = giorniDelPeriodo(dati);
  for (const b of document.querySelectorAll("[data-periodo]")) b.setAttribute("aria-pressed", String(b.dataset.periodo === periodo));

  $("visite").textContent = numero.format(dati.visite);
  $("media").textContent = decimale.format(dati.visite / Math.max(giorni.length, 1));
  $("azioni-totale").textContent = numero.format(dati.azioni.reduce((somma, a) => somma + a.visite, 0));

  andamento(giorni);
  $("tabella-giorni").replaceChildren(
    ...[...giorni].reverse().map((g) => {
      const riga = document.createElement("tr");
      const data = document.createElement("th");
      data.textContent = giornoLungo.format(new Date(g.giorno));
      const valore = document.createElement("td");
      valore.textContent = numero.format(g.visite);
      riga.append(data, valore);
      return riga;
    }),
  );

  barre("pagine", voci(dati.pagine, (p) => scegli(PAGINE[p.nome]) || p.titolo || p.nome), dati.visite);
  barre("azioni", voci(dati.azioni, (a) => scegli(AZIONI[a.nome]) || a.nome));
  const totale = (elenco) => elenco.reduce((somma, v) => somma + v.visite, 0);
  barre("schermi", voci(dati.schermi, (s) => scegli(SCHERMI[s.id]) || sconosciuto), totale(dati.schermi));
  barre("paesi", voci(dati.paesi, (p) => (ignoto(p.id) ? sconosciuto : sicuro((id) => nomePaese.of(id), p.id))), totale(dati.paesi));
  barre("lingue", voci(dati.lingue, (l) => (ignoto(l.id) ? tr("Sconosciuta", "Unknown") : maiuscola(sicuro((id) => nomeLingua.of(id), l.id)))), totale(dati.lingue));
  barre("provenienze", voci(dati.provenienze, (p) => p.nome || tr("Indirizzo scritto o salvato", "Typed or bookmarked address")), totale(dati.provenienze));
  barre("browser", voci(dati.browser, (b) => (ignoto(b.nome) ? sconosciuto : b.nome)), totale(dati.browser));
  barre("sistemi", voci(dati.sistemi, (s) => (ignoto(s.nome) ? sconosciuto : s.nome)), totale(dati.sistemi));
}

for (const bottone of document.querySelectorAll("[data-periodo]")) {
  bottone.addEventListener("click", () => {
    periodo = bottone.dataset.periodo;
    if (statistiche) disegna();
  });
}
let ridisegno;
new ResizeObserver(() => {
  clearTimeout(ridisegno);
  ridisegno = setTimeout(() => statistiche && andamento(giorniDelPeriodo(statistiche.periodi[periodo])), 100);
}).observe($("grafico"));

try {
  const risposta = await fetch(DATI, { cache: "no-cache" });
  if (!risposta.ok) throw new Error(String(risposta.status));
  statistiche = await risposta.json();
  const quando = new Date(statistiche.aggiornato);
  $("aggiornato").textContent = tr(
    `Aggiornate ogni ora; l'ultima volta il ${quando.toLocaleDateString(locale)} alle ${quando.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}.`,
    `Updated every hour; last on ${quando.toLocaleDateString(locale)} at ${quando.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}.`,
  );
  $("contenuto").classList.remove("carica");
  disegna();
} catch (errore) {
  console.error(errore);
  $("errore").textContent = tr("Le statistiche adesso non si riescono a leggere: riprova più tardi.", "The statistics cannot be read right now: try again later.");
  $("errore").hidden = false;
}
