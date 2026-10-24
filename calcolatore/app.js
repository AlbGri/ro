// Interfaccia del calcolatore. Il motore (file in motore/) ha i suoi campi (motore/campi.js):
// qui la pagina ne rispecchia campi e risultati, in italiano o in inglese (tr() di gate.js), e
// gli riporta ogni scelta con
// scegli() del motore (valore e gestore del campo).
import { traduci } from "./traduzioni.js";

const tr = window.tr;

const STORAGE_KEY = "ragnarok-calcolatore/stato";
const virtuale = (nome) => window.c[nome];
// elenchi oltre questa lunghezza si scelgono con la ricerca
const LUNGO = 40;

// ---------- stato salvato: build corrente e build con nome ----------

let stato = { corrente: "", salvate: [], confronto: null };

function normalizza(dati) {
  const salvate = Array.isArray(dati?.salvate)
    ? dati.salvate.filter((s) => typeof s?.nome === "string" && typeof s?.build === "string")
    : [];
  // confronto: la build A del confronto e quando e' stata fissata
  const a = dati?.confronto;
  const confronto = typeof a?.build === "string" && typeof a?.quando === "number" ? { build: a.build, quando: a.quando } : null;
  return { corrente: typeof dati?.corrente === "string" ? dati.corrente : "", salvate, confronto };
}
function salva() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stato));
  } catch {
    // Senza localStorage i dati valgono per questa sola apertura.
  }
}
function ripristina() {
  try {
    stato = normalizza(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
  } catch {
    stato = normalizza({});
  }
}
// la build nel formato dell'indirizzo (il testo dopo #, vedi motore/build.js). scriviBuild()
// ricalcola: la pagina si riallinea, anche quando la chiama il salvataggio dopo 400 ms
function buildCorrente() {
  const build = String(window.scriviBuild());
  sincronizza();
  return build;
}
const LINK_ESTRANEO = tr("Il link non contiene una build di questo calcolatore.", "The link does not contain a build of this calculator.");
let timerSalva;
function salvaPresto() {
  clearTimeout(timerSalva);
  timerSalva = setTimeout(() => {
    try {
      stato.corrente = buildCorrente();
      salva();
    } catch (e) {
      console.error(e);
    }
  }, 400);
}
// Caricare una build in un motore gia' usato puo' lasciare tracce della precedente (succede
// anche nell'originale): si ricarica la pagina con la build nell'indirizzo, come un link.
function apriBuild(build) {
  history.replaceState(null, "", location.pathname + "#" + build);
  location.reload();
}

// ---------- scelte e calcolo ----------

function calcola() {
  try {
    window.calc();
    nascondiErrore();
  } catch (e) {
    mostraErrore(e);
  }
}

// una scelta dell'utente su un campo del motore: valore e gestore (window.scegli), poi calcolo
function scegli(v, valore) {
  try {
    window.scegli(v, valore);
  } catch (e) {
    mostraErrore(e);
  }
  calcola();
  sincronizza();
  salvaPresto();
}

const erroreBox = document.createElement("p");
erroreBox.className = "errore";
erroreBox.hidden = true;
function mostraErrore(e) {
  console.error(e);
  erroreBox.textContent = tr("Il calcolo si è fermato su un errore con questa combinazione: i risultati potrebbero non essere aggiornati.", "The calculation stopped on an error with this combination: the results may not be up to date.") + " (" + (e?.message || e) + ")";
  erroreBox.hidden = false;
}
function nascondiErrore() {
  erroreBox.hidden = true;
}

// ---------- dal motore alla pagina ----------

const TAG_TESTO = new Set(["b", "strong", "i", "em", "u", "s", "strike", "del", "small", "sup", "sub", "br", "span", "div", "p", "font", "ul", "ol", "li", "hr", "table", "tbody", "thead", "tr", "td", "th", "label", "center", "big", "a"]);
const STILI = /^(color|text-decoration|font-weight|font-style|background-color)$/;

// copia un nodo dell'HTML di un risultato, con i soli tag e stili del testo
function copia(n) {
  if (n.nodeType === Node.TEXT_NODE) return document.createTextNode(traduci(n.data));
  if (n.nodeType !== Node.ELEMENT_NODE) return null;
  const nome = n.localName;
  if (/^(select|input|option|optgroup|script|style)$/.test(nome)) return null;
  const tag = nome === "font" ? "span" : nome === "center" ? "div" : nome === "a" ? "span" : TAG_TESTO.has(nome) ? nome : "span";
  const el = document.createElement(tag);
  const stile = [];
  for (const { name: k, value: val } of n.attributes) {
    if (k === "class") el.className = val;
    else if (k === "colspan" || k === "rowspan") el.setAttribute(k, val);
    else if (k === "title") el.title = traduci(val);
    else if (k === "style") {
      for (const parte of val.split(";")) {
        const [p, ...resto] = parte.split(":");
        if (p && STILI.test(p.trim().toLowerCase())) stile.push(p.trim() + ":" + resto.join(":"));
      }
    } else if (k === "color" && nome === "font") stile.push("color:" + val);
  }
  if (stile.length) el.setAttribute("style", stile.join(";"));
  if (el.classList.contains("name")) el.tabIndex = 0;
  for (const f of n.childNodes) {
    const c = copia(f);
    if (c) el.appendChild(c);
  }
  return el;
}
function copiaNodi(nodi, dentro) {
  dentro.replaceChildren();
  for (const f of nodi) {
    const c = copia(f);
    if (c) dentro.appendChild(c);
  }
}
// un risultato del motore (uscite in motore/campi.js): HTML con pochi tag
const modello = document.createElement("template");
function copiaHtml(html, dentro) {
  modello.innerHTML = html;
  copiaNodi(modello.content.childNodes, dentro);
}

// controlli collegati: ogni controllo della pagina sa a quale campo del motore corrisponde
const collegati = new Set();

function controllo(v) {
  let el;
  if (v.tipo === "select") {
    el = v.elenco().length > LUNGO ? sceltaConRicerca(v) : selectSemplice(v);
  } else if (v.tipo === "checkbox") {
    el = document.createElement("input");
    el.type = "checkbox";
    el.addEventListener("change", () => scegli(el._v, el.checked));
  } else if (v.tipo === "pulsante") {
    el = document.createElement("button");
    el.type = "button";
    el.className = "btn small";
    el.textContent = traduci(v.value);
    el.addEventListener("click", () => { try { window.scegli(el._v); } catch (e) { mostraErrore(e); } calcola(); sincronizza(); });
  } else {
    el = document.createElement("input");
    el.type = "text";
    el.inputMode = "numeric";
    el.size = 5;
    el.addEventListener("change", () => scegli(el._v, el.value));
  }
  el._v = v;
  collegati.add(el);
  aggiornaControllo(el);
  return el;
}

function selectSemplice(v) {
  const el = document.createElement("select");
  el.addEventListener("change", () => scegli(el._v, el.value));
  return el;
}

// opzioni della <select> della pagina rifatte solo quando cambiano nel motore
function firma(v) {
  const l = v.elenco();
  let s = l.length + ":";
  for (const o of l) s += o.value + "\u0001" + o.text + "\u0002";
  return s;
}
function riempi(el, v) {
  const f = firma(v);
  if (el._firma === f) return;
  el._firma = f;
  const frammento = document.createDocumentFragment();
  for (const n of v.figli) {
    if (!n.figli) frammento.appendChild(new Option(traduci(n.text), n.value));
    else {
      const g = document.createElement("optgroup");
      g.label = traduci(n.label);
      for (const o of n.figli) g.appendChild(new Option(traduci(o.text), o.value));
      frammento.appendChild(g);
    }
  }
  el.replaceChildren(frammento);
}

function aggiornaControllo(el) {
  const v = el._v;
  if (!v) return;
  if (el.classList.contains("scelta")) {
    const o = v.elenco()[v.selectedIndex];
    el.firstChild.textContent = o ? traduci(o.text) : "";
    el.disabled = v.disabled;
  } else if (el.tagName === "SELECT") {
    riempi(el, v);
    el.selectedIndex = v.selectedIndex;
    el.disabled = v.disabled;
  } else if (el.type === "checkbox") {
    el.checked = v.checked;
    el.disabled = v.disabled;
  } else if (el.tagName === "INPUT") {
    if (document.activeElement !== el) el.value = v.value;
    el.disabled = v.disabled;
  }
  const voce = el.closest(".voce, .slot-campo");
  el.hidden = v.hidden;
  if (voce && voce.dataset.nascondi !== undefined) voce.hidden = v.hidden;
}

// ---------- scelta con ricerca, per elenchi lunghi ----------

const ricerca = document.getElementById("ricerca");
const ricercaTesto = document.getElementById("ricerca-testo");
const ricercaLista = document.getElementById("ricerca-lista");
let ricercaPer = null;

function sceltaConRicerca(v) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "scelta";
  el.appendChild(document.createElement("span"));
  el.addEventListener("click", () => apriRicerca(el));
  // frecce su e giu': l'opzione prima o dopo, come in una <select>, senza aprire la ricerca
  el.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const v = el._v, lista = v.elenco(), passo = e.key === "ArrowDown" ? 1 : -1;
    let i = v.selectedIndex + passo;
    while (lista[i] && lista[i].disabled) i += passo;
    if (lista[i]) scegli(v, lista[i].value);
  });
  return el;
}

function apriRicerca(el) {
  ricercaPer = el;
  ricercaTesto.value = "";
  effettiBtn.hidden = !tipoEffetti(el._v);
  disegnaRicerca();
  ricerca.showModal();
  ricercaTesto.focus();
}
function normale(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// ricerca negli effetti: per oggetti e carte anche il testo della loro scheda
const effettiBtn = document.getElementById("ricerca-effetti");
let cercaEffetti = false;
effettiBtn.addEventListener("click", () => {
  cercaEffetti = !cercaEffetti;
  effettiBtn.setAttribute("aria-pressed", String(cercaEffetti));
  disegnaRicerca();
  ricercaTesto.focus();
});
// "o" per gli oggetti (valore = posto in itemData), "c" per le carte (posto in m_Card)
function tipoEffetti(v) {
  const nome = v.name;
  if (/^A_(weapon[12]|head[123]|left|body|shoulder|shoes|acces[12])$/.test(nome)) return "o";
  if (/_card\d?$/.test(nome)) return "c";
  return null;
}
// le righe della scheda, con davanti gli altri oggetti per le righe di una combinazione
const effetti = new Map();
const appoggio = document.createElement("template");
function testoHtml(html) {
  appoggio.innerHTML = html;
  return appoggio.content.textContent.replace(/\s+/g, " ").trim();
}
function righeEffetti(tipo, id, nome) {
  const chiave = tipo + id;
  if (!effetti.has(chiave)) {
    const html = tipo === "o" ? window.descrizioneOggetto(id) : window.descrizioneCarta(id);
    const righe = [];
    html.split(/<hr\s*\/?>/i).forEach((parte, k) => {
      let prefisso = "";
      if (k > 0) {
        const testa = (parte.match(/<b>([\s\S]*?)<\/b>/i) || [])[1] || "";
        const altri = [...testoHtml(testa).matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]).filter((n) => !nome.includes(n) && !n.includes(nome));
        prefisso = (altri.length ? tr("con ", "with ") + [...new Set(altri)].join(" + ") : tr("in combinazione", "in combination")) + ": ";
        parte = parte.replace(/<b>[\s\S]*?<\/b>/i, "");
      }
      for (const riga of parte.split(/<br\s*\/?>/i)) {
        const t = testoHtml(riga);
        if (t) righe.push(prefisso + traduci(t));
      }
    });
    effetti.set(chiave, righe);
  }
  return effetti.get(chiave);
}

function disegnaRicerca() {
  const v = ricercaPer._v;
  const parole = normale(ricercaTesto.value).split(/\s+/).filter(Boolean);
  const frammento = document.createDocumentFragment();
  const scelta = v.selectedIndex;
  const tipo = cercaEffetti && parole.length ? tipoEffetti(v) : null;
  let gruppo = null, mostrate = 0;
  v.elenco().forEach((o, i) => {
    const testo = traduci(o.text);
    let trovate = [];
    if (tipo) {
      const righe = righeEffetti(tipo, o.value, o.text);
      const tutto = normale(testo + " " + righe.join(" "));
      if (!parole.every((p) => tutto.includes(p))) return;
      trovate = righe.filter((r) => parole.some((p) => normale(r).includes(p)));
    } else if (parole.length && !parole.every((p) => normale(testo).includes(p))) return;
    const g = o.padre !== v ? o.padre : null;
    if (g && g !== gruppo) {
      const li = document.createElement("li");
      li.className = "gruppo";
      li.textContent = traduci(g.label);
      frammento.appendChild(li);
    }
    gruppo = g;
    if (mostrate++ > 400) return;
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.className = "opz";
    b.textContent = testo;
    for (const r of trovate.slice(0, 2)) {
      const s = document.createElement("span");
      s.className = "effetto";
      s.textContent = r;
      b.appendChild(s);
    }
    b.dataset.indice = i;
    if (i === scelta) b.setAttribute("aria-current", "true");
    li.appendChild(b);
    frammento.appendChild(li);
  });
  ricercaLista.replaceChildren(frammento);
}
ricercaTesto.addEventListener("input", disegnaRicerca);
ricercaTesto.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    ricercaLista.querySelector("button.opz")?.click();
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    ricercaLista.querySelector("button.opz")?.focus();
  }
});
ricercaLista.addEventListener("click", (e) => {
  const b = e.target.closest("button.opz");
  if (!b || !ricercaPer) return;
  const v = ricercaPer._v;
  const o = v.elenco()[Number(b.dataset.indice)];
  ricerca.close();
  ricercaPer.focus();
  if (o) scegli(v, o.value);
});
ricercaLista.addEventListener("keydown", (e) => {
  const b = e.target.closest("button.opz");
  if (!b) return;
  const tutti = [...ricercaLista.querySelectorAll("button.opz")];
  const i = tutti.indexOf(b);
  if (e.key === "ArrowDown") { e.preventDefault(); tutti[i + 1]?.focus(); }
  if (e.key === "ArrowUp") { e.preventDefault(); (tutti[i - 1] || ricercaTesto).focus(); }
});
ricerca.addEventListener("click", (e) => {
  if (e.target === ricerca) ricerca.close();
});

// ---------- parti fisse della pagina ----------

// campi scritti nella pagina: <select>, casella o segnaposto per la scelta con ricerca
function collegaCampiFissi() {
  for (const el of document.querySelectorAll("[data-campo]")) {
    const v = virtuale(el.dataset.campo);
    if (!v) {
      (el.closest(".voce") || el).hidden = true;
      continue;
    }
    if ("cerca" in el.dataset) {
      // il segnaposto diventa la scelta con ricerca, con l'etichetta se c'e'
      const s = sceltaConRicerca(v);
      s._v = v;
      collegati.add(s);
      const etichetta = el.dataset.etichetta && tr(el.dataset.etichetta, el.dataset.enEtichetta);
      if (etichetta) {
        const e = document.createElement("span");
        e.className = "etichetta";
        e.textContent = etichetta;
        el.appendChild(e);
      }
      el.appendChild(s);
      s.setAttribute("aria-label", etichetta || el.closest(".slot")?.querySelector(".slot-nome")?.textContent || "");
      aggiornaControllo(s);
      continue;
    }
    el._v = v;
    collegati.add(el);
    if (el.tagName === "SELECT") el.addEventListener("change", () => scegli(el._v, el.value));
    else if (el.type === "checkbox") el.addEventListener("change", () => scegli(el._v, el.checked));
    else el.addEventListener("change", () => scegli(el._v, el.value));
    aggiornaControllo(el);
  }
}

// i campi possono essere rifatti dal motore (un'opzione cambiata ricrea la <select>): ogni
// controllo fisso si ricollega al campo con lo stesso nome
function ricollega() {
  for (const el of collegati) {
    if (!el.isConnected) {
      collegati.delete(el);
      continue;
    }
    const nuovo = el._v && virtuale(el._v.name);
    if (nuovo) el._v = nuovo;
  }
}

const elementiUscita = [...document.querySelectorAll("[data-uscita]")];
const righe = [...document.querySelectorAll("[data-riga]")];
const elementiContenitore = [...document.querySelectorAll("[data-contenitore]")];
const elementiPannello = [...document.querySelectorAll("[data-pannello]")];
const passive = document.getElementById("passive");
const manoSinistra = document.getElementById("mano-sinistra");

function aggiornaUscite() {
  for (const el of elementiUscita) {
    const html = window.uscite[el.dataset.uscita] ?? "";
    if (el._html === html) continue;
    el._html = html;
    copiaHtml(html, el);
  }
  for (const el of righe) el.hidden = !window.testo(el.dataset.riga);
}

// contenitori del motore che cambiano forma (campi della skill scelta, mano sinistra, Altre
// informazioni...): la descrizione del motore (contenitori in motore/campi.js), come le voci
// di un pannello
function aggiornaContenitori() {
  for (const el of elementiContenitore) {
    const voci = window.contenitori[el.dataset.contenitore] || [];
    const firma = JSON.stringify(firmaVoci(voci));
    if (el._html === firma) continue;
    el._html = firma;
    el.replaceChildren(...voci.filter(visibile).map(voceDescritta));
  }
  manoSinistra.hidden = !window.contenitori.A_w2?.length;
}

// pannelli dei buff: la descrizione del motore (pannelli[radice] in motore/campi.js), gruppi
// di voci. Una voce si vede se ci sono i suoi campi (canti e danze ne crea e toglie alcuni);
// un'etichetta con id e' un risultato del motore
const campiDi = (v) => (v.riga || [v]).filter((x) => x.campo).map((x) => x.campo);
const visibile = (v) => campiDi(v).every((n) => virtuale(n));
const htmlDi = (t) => (t && typeof t === "object" ? window.uscite[t.id] ?? "" : t || "");
const etichettaDi = (v) => (v.id ? window.uscite[v.id] ?? "" : v.etichetta || "");
function spanHtml(html, classe) {
  const s = document.createElement("span");
  s.className = classe;
  copiaHtml(html, s);
  return s;
}
function voceDescritta(v) {
  if (v.nota !== undefined) return spanHtml(htmlDi(v.nota), "nota hint");
  if (v.riga) {
    const d = document.createElement("div");
    d.className = "voce in-riga";
    for (const x of v.riga) d.appendChild(x.campo ? controllo(virtuale(x.campo)) : spanHtml(htmlDi(x), "testo"));
    return d;
  }
  const campo = virtuale(v.campo);
  const l = document.createElement(campo.tipo === "checkbox" ? "label" : "div");
  l.className = "voce";
  const ctrl = controllo(campo);
  // un'etichetta vuota (solo spazi) non c'e', come la cella vuota nell'HTML di prima
  const etichetta = etichettaDi(v);
  if (testoHtml(etichetta)) l.appendChild(spanHtml(etichetta, "etichetta"));
  if (v.segno) l.appendChild(spanHtml(v.segno, "segno"));
  l.appendChild(ctrl);
  return l;
}
// cio' che cambia il disegno: voci visibili, etichette, tipo dei campi, scelte con ricerca o tendine
const firmaVoci = (voci) => voci.map((v) => visibile(v) && [
  etichettaDi(v), htmlDi(v.nota), (v.riga || []).map(htmlDi), campiDi(v).map((n) => virtuale(n).tipo + (virtuale(n).elenco().length > LUNGO)),
]);
function firmaPannello(gruppi) {
  return JSON.stringify(gruppi.map((g) => [htmlDi(g.titolo), firmaVoci(g.voci)]));
}
function disegnaPannello(gruppi, corpo) {
  const parti = [];
  for (const g of gruppi) {
    const voci = g.voci.filter(visibile);
    if (!voci.length) continue;
    if (g.titolo) {
      const h = document.createElement("h4");
      copiaHtml(htmlDi(g.titolo), h);
      parti.push(h);
    }
    const griglia = document.createElement("div");
    griglia.className = "voci";
    griglia.append(...voci.map(voceDescritta));
    parti.push(griglia);
  }
  corpo.replaceChildren(...parti);
}

function aggiornaPannelli() {
  for (const el of elementiPannello) {
    const gruppi = window.pannelli[el.dataset.pannello];
    const corpo = el.querySelector(".corpo");
    const firma = gruppi ? firmaPannello(gruppi) : "";
    if (el._html !== firma) {
      el._html = firma;
      if (gruppi) disegnaPannello(gruppi, corpo);
      else corpo.replaceChildren();
    }
    const summary = el.querySelector("summary");
    let badge = summary.querySelector(".attivo");
    const attivo = !!window.testo(el.dataset.attivo);
    if (attivo && !badge) {
      badge = document.createElement("span");
      badge.className = "attivo";
      badge.textContent = tr("attivo", "active");
      summary.appendChild(badge);
    } else if (!attivo && badge) badge.remove();
  }
}

// skill passive: il contenitore P_Skill<n>s ha la voce del posto n; senza nome non si mostra
function aggiornaPassive() {
  const voci = [];
  for (let i = 0; i <= 21; i++)
    for (const v of window.contenitori["P_Skill" + i + "s"] || []) if (testoHtml(etichettaDi(v))) voci.push(v);
  const firma = JSON.stringify(firmaVoci(voci));
  if (passive._html === firma) return;
  passive._html = firma;
  passive.replaceChildren(...voci.map(voceDescritta));
}

function sincronizza() {
  aggiornaUscite();
  aggiornaContenitori();
  aggiornaPannelli();
  aggiornaPassive();
  ricollega();
  for (const el of collegati) aggiornaControllo(el);
  aggiornaConfronto();
}

// ---------- confronto fra due build ----------

// La build A gira in un secondo motore, in un iframe nascosto: caricarla nel motore della
// pagina lascerebbe tracce della build B (vedi apriBuild). A usa il mostro scelto per B.
// Metriche e regole vengono dal confronto A/B del calcolatore di Thrice, e in inglese anche i
// nomi delle voci; le voci in piu' hanno quelli della pagina.
const METRICHE = [
  { gruppo: tr("Statistiche", "Stats") },
  { voce: "Max HP", id: "A_MaxHP" },
  { voce: "Max SP", id: "A_MaxSP" },
  { voce: "ATK", id: "A_ATK2" },
  { voce: tr("ATK reale", "Real ATK"), id: "A_RealATK" },
  { voce: "MATK", id: "A_MATK" },
  { voce: "DEF", id: "A_totalDEF" },
  { voce: "MDEF", id: "A_MDEF" },
  { voce: "HIT", id: "A_HIT" },
  { voce: tr("Flee", "FLEE"), id: "A_FLEE" },
  { voce: "Perfect Dodge", id: "A_LUCKY" },
  { voce: "Critical", id: "A_CRI" },
  { voce: "ASPD", id: "A_ASPD" },
  { voce: tr("Tempo di lancio", "Cast Time"), id: "A_cTime", meno: true, primo: true },
  { voce: tr("Ritardo dopo il lancio", "Cast Delay"), id: "A_cDelay", meno: true, primo: true },
  { voce: tr("Velocità di movimento", "Mov. Speed"), id: "A_MovSPEED" },
  { gruppo: tr("Il tuo attacco", "Your attack") },
  { voce: tr("Probabilità di colpire", "Hit ratio"), id: "BattleHIT", percento: true },
  { voce: tr("Probabilità di critico", "Critical chance"), id: "CRInum", percento: true },
  { voce: tr("Danno critico", "Critical damage"), id: "CRIATK" },
  { voce: tr("Danno minimo", "Minimum damage"), id: "strID_0" },
  { voce: tr("Danno medio", "Average damage"), id: "strID_1" },
  { voce: tr("Danno massimo", "Maximum damage"), id: "strID_2" },
  { voce: tr("Danno al secondo", "Damage per second"), id: "AveSecondATK" },
  { voce: tr("Colpi per ucciderlo, in media", "Average Number of Hits"), id: "AveATKnum", meno: true },
  { gruppo: tr("L'attacco del nemico", "Enemy's attack") },
  { voce: tr("Probabilità di schivare", "Dodge ratio"), id: "BattleFLEE", percento: true },
  { voce: tr("Danno subito, minimo", "Minimum damage received"), id: "B_MinAtk", meno: true },
  { voce: tr("Danno subito, in media", "Average damage received"), id: "B_AveAtk", meno: true },
  { voce: tr("Danno subito, massimo", "Maximum damage received"), id: "B_MaxAtk", meno: true },
  { voce: tr("HP effettivi", "Effective HP"), id: "B_EffectiveHP" },
  { voce: tr("HP effettivi, con le schivate", "Expected EHP incl. avoidance"), id: "B_ExpectedEffectiveHP" },
];
// scelte che cambiano i danni senza essere la build: se A e B le hanno diverse, si avvisa
const CONTESTO = [
  ["A_ActiveSkill", tr("la tua skill", "your skill")],
  ["A_ActiveSkillLV", tr("il livello della tua skill", "your skill level")],
  ["B_AtkSkill", tr("la skill del nemico", "the enemy's skill")],
  ["A8_Skill14", tr("l'ambiente", "the environment")],
];

const confronto = document.getElementById("confronto");
const confrontoCorpo = confronto.querySelector("tbody");
const soloDifferenze = document.getElementById("solo-differenze");
let motoreA = null; // { iframe, finestra, nemico }: il motore della build A, quando e' pronto
let preparazioneA = 0;

function togliMotoreA() {
  preparazioneA++;
  motoreA?.iframe.remove();
  motoreA = null;
}

async function preparaA() {
  togliMotoreA();
  const mia = preparazioneA;
  aggiornaConfronto();
  const iframe = document.createElement("iframe");
  iframe.hidden = true;
  iframe.tabIndex = -1;
  iframe.setAttribute("aria-hidden", "true");
  // gli stessi file del motore della pagina, nello stesso ordine
  iframe.srcdoc = "<!DOCTYPE html><meta charset=\"utf-8\">" + [...document.querySelectorAll('script[src^="motore/"]')]
    .map((s) => `<script src="${s.getAttribute("src")}"></` + "script>").join("");
  const caricato = new Promise((ok) => iframe.addEventListener("load", ok, { once: true }));
  document.body.appendChild(iframe);
  await caricato;
  if (mia !== preparazioneA) return iframe.remove();
  const w = iframe.contentWindow;
  try {
    if (!w.leggiBuild(stato.confronto.build)) throw new Error(tr("la build A non è di questo calcolatore", "build A is not from this calculator"));
    for (const el of elementiPannello) w[el.dataset.apri](1);
    w.StAllCalc();
    w.calc();
  } catch (e) {
    iframe.remove();
    mostraErrore(e);
    return;
  }
  motoreA = { iframe, finestra: w, nemico: null };
  aggiornaConfronto();
}

// il numero di un risultato: media degli intervalli (a~b), somma delle parti (a+b),
// altrimenti il primo numero ("1170 (234 x 5 hits)", "16.47 % ...", "(4.7%)")
function numeroDi(testo) {
  const t = testo.replace(/,/g, "").replace(/\s+/g, "");
  if (/^-?[\d.]+(~-?[\d.]+)?(\+-?[\d.]+(~-?[\d.]+)?)*$/.test(t)) {
    return t.split("+").reduce((s, p) => {
      const [a, b = a] = p.split("~").map(Number);
      return s + (a + b) / 2;
    }, 0);
  }
  const m = t.match(/^\(?(-?\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}
const arrotonda = (x) => String(Math.round(x * 100) / 100);

function valoreDi(m, motore) {
  const testo = motore.testo(m.id).replace(/\s+/g, " ").trim();
  const numero = testo ? numeroDi(testo) : null;
  let mostra = traduci(testo) || "—";
  if (m.primo) mostra = testo.match(/^[-\d.]+\s*%?/)?.[0] ?? mostra;
  if (m.percento && numero !== null) mostra = arrotonda(numero) + "%";
  return { mostra, numero };
}

function differenza(m, a, b) {
  if (a.numero === null || b.numero === null) return { testo: "—", diversa: a.mostra !== b.mostra };
  const d = b.numero - a.numero;
  if (Math.abs(d) < 1e-6) return { testo: "0", diversa: false };
  let testo = (d > 0 ? "+" : "") + arrotonda(d);
  // per le probabilita' la differenza e' gia' in punti percentuali
  if (a.numero !== 0 && !m.percento) testo += ` (${d > 0 ? "+" : ""}${arrotonda((d / Math.abs(a.numero)) * 100)}%)`;
  return { testo, diversa: true, classe: (m.meno ? d < 0 : d > 0) ? "meglio" : "peggio" };
}

function sceltaDi(w, nome) {
  const v = w.c[nome];
  if (!v) return "";
  if (v.tipo !== "select") return String(v.value);
  return v.elenco()[v.selectedIndex]?.text ?? "";
}

// il mostro di A segue quello di B; restituisce false se A non lo trova nel suo elenco
function allineaMostro() {
  const nemico = String(virtuale("B_Enemy").value);
  if (motoreA.nemico === nemico) return true;
  const w = motoreA.finestra;
  const campo = w.c.B_Enemy;
  campo.value = nemico;
  if (String(campo.value) !== nemico) {
    w.EnemySort();
    campo.value = nemico;
  }
  if (String(campo.value) !== nemico) return false;
  w.Bskill(true);
  w.calc();
  motoreA.nemico = nemico;
  return true;
}

function riga(celle, classe) {
  const tr = document.createElement("tr");
  if (classe) tr.className = classe;
  for (const [testo, c] of celle) {
    const td = document.createElement("td");
    td.textContent = testo;
    if (c) td.className = c;
    if (celle.length === 1) td.colSpan = 4;
    tr.appendChild(td);
  }
  return tr;
}

function aggiornaConfronto() {
  const a = stato.confronto;
  confronto.querySelector('[data-azione="fissa-a"]').textContent = a
    ? tr("Sostituisci A con questa build", "Replace A with this build")
    : tr("Fissa questa build come A", "Pin current build as A");
  confronto.querySelector('[data-azione="scambia-ab"]').hidden = !a;
  confronto.querySelector('[data-azione="togli-a"]').hidden = !a;
  document.getElementById("confronto-stato").textContent = a
    ? tr("A fissata il ", "A pinned on ") + new Date(a.quando).toLocaleString(tr("it-IT", "en-GB"), { dateStyle: "short", timeStyle: "short" }) + "."
    : tr("Nessuna build A.", "No Build A pinned.");
  document.getElementById("confronto-risultati").hidden = !a;
  if (!a) return;
  const avviso = document.getElementById("confronto-avviso");
  if (!motoreA) {
    avviso.hidden = true;
    confrontoCorpo.replaceChildren(riga([[tr("Calcolo della build A…", "Calculating build A…")]]));
    return;
  }
  let stessoMostro;
  try {
    stessoMostro = allineaMostro();
  } catch (e) {
    mostraErrore(e);
    return;
  }
  const diversi = CONTESTO.filter(([nome]) => sceltaDi(motoreA.finestra, nome) !== sceltaDi(window, nome)).map(([, d]) => d);
  if (!stessoMostro) diversi.unshift(tr("il mostro", "the monster"));
  avviso.hidden = !diversi.length;
  avviso.textContent = diversi.length
    ? tr(`Non sono uguali in A e B: ${diversi.join(", ")}. Le differenze nei danni non vengono solo dalla build.`, `Not the same in A and B: ${diversi.join(", ")}. The differences in damage do not come from the build alone.`)
    : "";
  const righe = [];
  let gruppo = null;
  for (const m of METRICHE) {
    if (m.gruppo) {
      gruppo = m.gruppo;
      continue;
    }
    const va = valoreDi(m, motoreA.finestra), vb = valoreDi(m, window);
    const diff = differenza(m, va, vb);
    if (soloDifferenze.checked && !diff.diversa) continue;
    if (gruppo) righe.push(riga([[gruppo]], "gruppo"));
    gruppo = null;
    righe.push(riga([[m.voce], [va.mostra], [vb.mostra], [diff.testo, diff.classe]]));
  }
  if (!righe.length) righe.push(riga([[tr("Nessuna differenza.", "No differences.")]]));
  confrontoCorpo.replaceChildren(...righe);
}
soloDifferenze.addEventListener("change", aggiornaConfronto);

// ---------- azioni della pagina ----------

const selSalvate = document.getElementById("salvate");
const nomeBuild = document.getElementById("nome-build");
function disegnaSalvate() {
  selSalvate.replaceChildren(...(stato.salvate.length
    ? stato.salvate.map((s, i) => new Option(s.nome, i))
    : [new Option(tr("(nessuna build salvata)", "(no saved builds)"), "")]));
  selSalvate.disabled = !stato.salvate.length;
}

async function copiaLink(build, messaggio) {
  const link = location.origin + location.pathname + "#" + build;
  try {
    await navigator.clipboard.writeText(link);
    avvisa(messaggio);
  } catch {
    prompt(tr("Copia questo link:", "Copy this link:"), link);
  }
}

document.addEventListener("click", async (e) => {
  const el = e.target.closest("[data-azione]");
  if (!el) return;
  const azione = el.dataset.azione;
  if (azione === "chiudi-ricerca") {
    ricerca.close();
  } else if (azione === "copia-link") {
    await copiaLink(buildCorrente(), tr("Link copiato: chi lo apre vede questa build.", "Link copied: whoever opens it sees this build."));
  } else if (azione === "copia-link-salvata") {
    const s = stato.salvate[Number(selSalvate.value)];
    if (!s) return;
    await copiaLink(s.build, tr(`Link copiato: chi lo apre vede la build "${s.nome}".`, `Link copied: whoever opens it sees the build "${s.nome}".`));
  } else if (azione === "salva") {
    const nome = nomeBuild.value.trim();
    if (!nome) {
      avvisa(tr("Scrivi un nome per la build.", "Write a name for the build."));
      nomeBuild.focus();
      return;
    }
    const build = buildCorrente();
    const esistente = stato.salvate.find((s) => s.nome === nome);
    if (esistente) {
      if (!confirm(tr(`Sostituire la build salvata "${nome}"?`, `Replace the saved build "${nome}"?`))) return;
      esistente.build = build;
    } else stato.salvate.push({ nome, build });
    stato.salvate.sort((a, b) => a.nome.localeCompare(b.nome, "it"));
    salva();
    disegnaSalvate();
    selSalvate.value = String(stato.salvate.findIndex((s) => s.nome === nome));
    avvisa(tr(`Build "${nome}" salvata.`, `Build "${nome}" saved.`));
  } else if (azione === "carica") {
    const s = stato.salvate[Number(selSalvate.value)];
    if (!s) return;
    stato.corrente = s.build;
    salva();
    apriBuild(s.build);
  } else if (azione === "elimina") {
    const i = Number(selSalvate.value);
    const s = stato.salvate[i];
    if (!s || !confirm(tr(`Eliminare la build salvata "${s.nome}"?`, `Delete the saved build "${s.nome}"?`))) return;
    stato.salvate.splice(i, 1);
    salva();
    disegnaSalvate();
  } else if (azione === "nuova") {
    if (!confirm(tr("Ricominciare da un personaggio nuovo? Le build salvate restano.", "Start over with a new character? The saved builds stay."))) return;
    stato.corrente = "";
    salva();
    history.replaceState(null, "", location.pathname);
    location.reload();
  } else if (azione === "fissa-a") {
    stato.confronto = { build: buildCorrente(), quando: Date.now() };
    salva();
    preparaA();
  } else if (azione === "togli-a") {
    stato.confronto = null;
    salva();
    togliMotoreA();
    aggiornaConfronto();
  } else if (azione === "scambia-ab") {
    const a = stato.confronto.build;
    stato.confronto = { build: buildCorrente(), quando: Date.now() };
    stato.corrente = a;
    salva();
    apriBuild(a);
  } else if (azione === "esterno") {
    apriEsterno();
  } else if (azione === "importa-link") {
    importaLink();
  } else if (azione === "chiudi-esterno" || azione === "apri-importata") {
    esterno.close();
  } else if (azione === "esporta") {
    esporta();
  } else if (azione === "importa") {
    file.click();
  }
});

// ---------- Importa da esterno ----------

const esterno = document.getElementById("esterno");
const esternoLink = document.getElementById("esterno-link");
const esternoErrore = document.getElementById("esterno-errore");
// la build importata, gia' nel motore: chiudendo la finestra si apre
let importata = null;
function apriEsterno() {
  importata = null;
  document.getElementById("esterno-chiedi").hidden = false;
  document.getElementById("esterno-esito").hidden = true;
  esternoErrore.hidden = true;
  esternoLink.value = "";
  esterno.showModal();
  esternoLink.focus();
}
const TIPI_NON_CARICATI = {
  oggetto: ["Oggetto", "Item"],
  carta: ["Carta", "Card"],
  mostro: ["Mostro", "Monster"],
  skill: ["Skill", "Skill"],
  passiva: ["Skill passiva", "Passive skill"],
  freccia: ["Freccia", "Arrow"],
  incantamento: ["Incantamento", "Enchant"],
  dicastes: ["Incantamento El Dicastes", "El Dicastes enchant"],
  manuale: ["Manuale dell'EXP", "EXP manual"],
};
function voceNonCaricata(x) {
  let tipo = tr(...(TIPI_NON_CARICATI[x.tipo] || [x.tipo, x.tipo]));
  if (x.campo === "B_AtkSkill") tipo = tr("Skill del nemico", "Enemy skill");
  // lo slot dell'equipaggiamento, con il nome che ha nella pagina
  const slot = /^A_weapon2/.test(x.campo)
    ? tr("seconda arma", "second weapon")
    : document.querySelector(`[data-campo="${x.campo}"]`)?.closest(".slot")?.querySelector(".slot-nome")?.textContent;
  if (slot) tipo += ` (${slot})`;
  const motivo = x.motivo === "assente" ? tr("non c'è in questo calcolatore", "not in this calculator") : tr("non si può usare in questa build", "cannot be used in this build");
  return `${tipo}: ${x.nome}, ${motivo}`;
}
function importaLink() {
  let r;
  try {
    r = window.importaBuild(esternoLink.value);
  } catch (e) {
    // il motore si e' fermato a meta' della build: si torna a quella di prima
    console.error(e);
    location.reload();
    return;
  }
  if (!r) {
    esternoErrore.textContent = tr("Il link non è di rocalc-temp.web.app né di uaro-calc.xdthrice.workers.dev, o non contiene una build.", "The link is not from rocalc-temp.web.app or uaro-calc.xdthrice.workers.dev, or it does not contain a build.");
    esternoErrore.hidden = false;
    return;
  }
  clearTimeout(timerSalva);
  stato.corrente = r.build;
  salva();
  if (!r.nonCaricati.length) return apriBuild(r.build);
  importata = r.build;
  document.getElementById("esterno-sintesi").textContent = tr(`Build importata da ${r.calcolatore}. Non sono stati caricati:`, `Build imported from ${r.calcolatore}. These were not loaded:`);
  const elenco = document.getElementById("esterno-elenco");
  elenco.replaceChildren(...r.nonCaricati.map((x) => Object.assign(document.createElement("li"), { textContent: voceNonCaricata(x) })));
  document.getElementById("esterno-chiedi").hidden = true;
  document.getElementById("esterno-esito").hidden = false;
}
esternoLink.addEventListener("keydown", (e) => {
  if (e.key === "Enter") importaLink();
});
esterno.addEventListener("close", () => {
  if (importata) apriBuild(importata);
});

const file = document.getElementById("file");
function esporta() {
  stato.corrente = buildCorrente();
  const blob = new Blob([JSON.stringify(stato, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `calcolatore-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  avvisa(tr(`Il browser scarica ${link.download}: conservalo, e con Ripristina da backup recuperi i dati.`, `The browser downloads ${link.download}: keep it, and Restore from backup brings the data back.`));
}
file.addEventListener("change", async () => {
  const scelto = file.files[0];
  file.value = "";
  if (!scelto) return;
  try {
    const nuovo = normalizza(JSON.parse(await scelto.text()));
    if (!confirm(tr("Sostituire le build della pagina con quelle del file?", "Replace the page's builds with those in the file?"))) return;
    stato = nuovo;
    salva();
    if (stato.corrente) apriBuild(stato.corrente);
    else location.reload();
  } catch {
    avvisa(tr("Il file non è un backup di questa pagina.", "The file is not a backup of this page."));
  }
});

const toast = document.getElementById("toast");
let toastTimer;
function avvisa(testo) {
  toast.textContent = testo;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

// ---------- avvio ----------

function avvia() {
  ripristina();
  // una build nell'indirizzo l'ha gia' caricata il motore all'avvio (come l'originale);
  // altrimenti, o se non e' del formato di questo calcolatore, si riprende quella lasciata
  // l'ultima volta
  const daLink = location.hash.length > 1;
  const estranea = daLink && !window.buildValida(location.hash.slice(1));
  if (daLink) history.replaceState(null, "", location.pathname);
  if ((!daLink || estranea) && stato.corrente) {
    try {
      window.leggiBuild(stato.corrente);
    } catch (e) {
      mostraErrore(e);
    }
  }
  // tutti i pannelli aperti nel motore: i loro campi esistono sempre, la pagina li mostra o no
  for (const el of elementiPannello) window[el.dataset.apri](1);
  document.getElementById("app").before(erroreBox);
  collegaCampiFissi();
  calcola();
  sincronizza();
  disegnaSalvate();
  salvaPresto();
  document.getElementById("caricamento").remove();
  document.getElementById("app").hidden = false;
  if (estranea) avvisa(LINK_ESTRANEO);
  if (stato.confronto) preparaA();
}

// un link incollato nella barra con la pagina gia' aperta cambia solo il #, senza ricaricare
addEventListener("hashchange", () => {
  const build = location.hash.slice(1);
  if (!build) return;
  if (!window.buildValida(build)) {
    history.replaceState(null, "", location.pathname);
    avvisa(LINK_ESTRANEO);
    return;
  }
  clearTimeout(timerSalva);
  stato.corrente = build;
  salva();
  apriBuild(build);
});

try {
  avvia();
} catch (e) {
  document.getElementById("caricamento").textContent = tr("Il calcolatore non si è avviato: ", "The calculator did not start: ") + (e?.message || e);
  console.error(e);
}
