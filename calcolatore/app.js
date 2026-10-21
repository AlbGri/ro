// Interfaccia del calcolatore. Il motore (file in motore/) lavora su un documento finto
// (motore/forma.js): qui la pagina ne rispecchia campi e risultati, in italiano, e gli
// riporta ogni scelta con scegli() del motore (valore e gestore del campo).
import { traduci } from "./traduzioni.js";

const STORAGE_KEY = "ragnarok-calcolatore/stato";
const doc = window.documento;
const virtuale = (nome) => doc.calcForm[nome];
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
// la build nel formato dell'indirizzo (il testo dopo #, vedi motore/build.js)
function buildCorrente() {
  return String(window.scriviBuild());
}
const LINK_ESTRANEO = "Il link non contiene una build di questo calcolatore.";
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
  erroreBox.textContent = "Il calcolo si è fermato su un errore con questa combinazione: i risultati potrebbero non essere aggiornati. (" + (e?.message || e) + ")";
  erroreBox.hidden = false;
}
function nascondiErrore() {
  erroreBox.hidden = true;
}

// ---------- dal documento finto alla pagina ----------

const TAG_TESTO = new Set(["b", "strong", "i", "em", "u", "s", "strike", "del", "small", "sup", "sub", "br", "span", "div", "p", "font", "ul", "ol", "li", "hr", "table", "tbody", "thead", "tr", "td", "th", "label", "center", "big", "a"]);
const STILI = /^(color|text-decoration|font-weight|font-style|background-color)$/;

// copia un nodo del documento finto; i campi diventano controlli collegati al motore
function copia(n) {
  if (!n.tag) return document.createTextNode(traduci(n.testo));
  if (n.tag === "select" || n.tag === "input") return controllo(n);
  if (n.tag === "option" || n.tag === "optgroup" || n.tag === "script" || n.tag === "style") return null;
  const tag = n.tag === "font" ? "span" : n.tag === "center" ? "div" : n.tag === "a" ? "span" : TAG_TESTO.has(n.tag) ? n.tag : "span";
  const el = document.createElement(tag);
  const stile = [];
  for (const [k, val] of Object.entries(n.attributi)) {
    if (k === "class") el.className = val;
    else if (k === "colspan" || k === "rowspan") el.setAttribute(k, val);
    else if (k === "title") el.title = traduci(val);
    else if (k === "style") {
      for (const parte of val.split(";")) {
        const [p, ...resto] = parte.split(":");
        if (p && STILI.test(p.trim().toLowerCase())) stile.push(p.trim() + ":" + resto.join(":"));
      }
    } else if (k === "color" && n.tag === "font") stile.push("color:" + val);
  }
  if (stile.length) el.setAttribute("style", stile.join(";"));
  if (el.classList.contains("name")) el.tabIndex = 0;
  for (const f of n.figli) {
    const c = copia(f);
    if (c) el.appendChild(c);
  }
  return el;
}
function copiaFigli(n, dentro) {
  dentro.replaceChildren();
  for (const f of n.figli) {
    const c = copia(f);
    if (c) dentro.appendChild(c);
  }
}

// controlli collegati: ogni controllo della pagina sa a quale campo del motore corrisponde
const collegati = new Set();

function controllo(v) {
  let el;
  if (v.tag === "select") {
    el = v._lista().length > LUNGO ? sceltaConRicerca(v) : selectSemplice(v);
  } else if (v.type === "checkbox" || v.type === "radio") {
    el = document.createElement("input");
    el.type = "checkbox";
    el.addEventListener("change", () => scegli(el._v, el.checked));
  } else if (v.type === "button" || v.type === "submit") {
    el = document.createElement("button");
    el.type = "button";
    el.className = "btn small";
    el.textContent = traduci(v.value || v.textContent);
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
  const l = v._lista();
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
    if (n.tag === "option") frammento.appendChild(new Option(traduci(n.text), n.value));
    else if (n.tag === "optgroup") {
      const g = document.createElement("optgroup");
      g.label = traduci(n.label);
      for (const o of n.figli) if (o.tag === "option") g.appendChild(new Option(traduci(o.text), o.value));
      frammento.appendChild(g);
    }
  }
  el.replaceChildren(frammento);
}

function aggiornaControllo(el) {
  const v = el._v;
  if (!v) return;
  if (el.classList.contains("scelta")) {
    const o = v._lista()[v.selectedIndex];
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
    const v = el._v, lista = v._lista(), passo = e.key === "ArrowDown" ? 1 : -1;
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
  const nome = v.getAttribute("name") || "";
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
        prefisso = (altri.length ? "con " + [...new Set(altri)].join(" + ") : "in combinazione") + ": ";
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
  v._lista().forEach((o, i) => {
    const testo = traduci(o.text);
    let trovate = [];
    if (tipo) {
      const righe = righeEffetti(tipo, o.value, o.text);
      const tutto = normale(testo + " " + righe.join(" "));
      if (!parole.every((p) => tutto.includes(p))) return;
      trovate = righe.filter((r) => parole.some((p) => normale(r).includes(p)));
    } else if (parole.length && !parole.every((p) => normale(testo).includes(p))) return;
    const g = o.padre && o.padre.tag === "optgroup" ? o.padre : null;
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
  const o = v._lista()[Number(b.dataset.indice)];
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
      if (el.dataset.etichetta) {
        const e = document.createElement("span");
        e.className = "etichetta";
        e.textContent = el.dataset.etichetta;
        el.appendChild(e);
      }
      el.appendChild(s);
      s.setAttribute("aria-label", el.dataset.etichetta || el.closest(".slot")?.querySelector(".slot-nome")?.textContent || "");
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
    const nome = el._v && (el._v.name || el._v.id);
    if (nome && !el._v.isConnected) {
      const nuovo = virtuale(nome);
      if (nuovo) el._v = nuovo;
    }
  }
}

const uscite = [...document.querySelectorAll("[data-uscita]")];
const righe = [...document.querySelectorAll("[data-riga]")];
const contenitori = [...document.querySelectorAll("[data-contenitore]")];
const pannelli = [...document.querySelectorAll("[data-pannello]")];
const passive = document.getElementById("passive");
const manoSinistra = document.getElementById("mano-sinistra");

function aggiornaUscite() {
  for (const el of uscite) {
    const v = doc.getElementById(el.dataset.uscita);
    const html = v ? v.innerHTML : "";
    if (el._html === html) continue;
    el._html = html;
    if (v) copiaFigli(v, el);
    else el.replaceChildren();
  }
  for (const el of righe) {
    const v = doc.getElementById(el.dataset.riga);
    el.hidden = !v || !v.textContent.trim();
  }
}

// contenitori del motore che cambiano forma (campi della skill scelta, mano sinistra...)
function aggiornaContenitori() {
  for (const el of contenitori) {
    const v = doc.getElementById(el.dataset.contenitore);
    const html = v ? v.innerHTML : "";
    if (el._html !== html) {
      el._html = html;
      if (v) disegnaLibero(v, el);
      else el.replaceChildren();
    }
  }
  manoSinistra.hidden = !doc.getElementById("A_w2")?.figli.length;
}

// contenuto libero: coppie di etichetta e controllo dove ci sono controlli, testo altrove
function disegnaLibero(v, el) {
  if (!contieneControlli(v)) {
    copiaFigli(v, el);
    return;
  }
  el.replaceChildren(...coppie(gettoni(v)).map(voce));
}

function contieneControlli(n) {
  for (const f of n.figli) {
    if (!f.tag) continue;
    if (f.tag === "select" || f.tag === "input") return true;
    if (contieneControlli(f)) return true;
  }
  return false;
}
const vuoto = (n) => !n.tag ? !n.testo.trim() : n.tag !== "br" && !n.textContent.trim() && !contieneControlli(n);

// sequenza di testi e controlli di un nodo, in ordine
function gettoni(n, out = []) {
  for (const f of n.figli) {
    if (f.tag === "select" || f.tag === "input") {
      if (f.type !== "hidden") out.push({ controllo: f });
    } else if (f.tag && contieneControlli(f)) gettoni(f, out);
    else if (f.tag === "br") out.push({ a_capo: true });
    else if (!vuoto(f)) {
      const ultimo = out[out.length - 1];
      if (ultimo && ultimo.testo) ultimo.testo.push(f);
      else out.push({ testo: [f] });
    }
  }
  return out;
}
// un testo che finisce con un "+" o un meno da solo: il segno va con il controllo che segue
function staccaSegno(nodi) {
  const ultimo = nodi[nodi.length - 1];
  const t = ultimo && (ultimo.tag ? ultimo.textContent : ultimo.testo).trim();
  return /^[+\-–]$/.test(t) ? { resto: nodi.slice(0, -1), segno: ultimo } : { resto: nodi, segno: null };
}
// coppie: testo prima del controllo, o dopo una casella; un controllo senza testo vicino
// prende il testo rimasto in attesa (la cella prima). Nelle modifiche manuali le righe sono
// "+ [casella] AGI": l'etichetta e' il testo dopo; "+ [casella] vs [elemento]" resta intera
function coppie(g, inAttesa = null) {
  const out = [];
  let segno = null;
  for (let i = 0; i < g.length; i++) {
    const x = g[i];
    if (x.a_capo) continue;
    if (x.testo) {
      if (inAttesa) out.push({ nota: inAttesa });
      ({ resto: inAttesa, segno } = staccaSegno(x.testo));
      if (!inAttesa.length) inAttesa = null;
      continue;
    }
    if (segno) {
      if (inAttesa) out.push({ nota: inAttesa });
      inAttesa = null;
      const s = segno;
      segno = null;
      const dopo = g[i + 1]?.testo ? staccaSegno(g[i + 1].testo) : null;
      if (dopo && !dopo.segno && g[i + 2]?.controllo) {
        const riga = [s, x.controllo, ...dopo.resto, g[i + 2].controllo];
        i += 2;
        const coda = g[i + 1]?.testo ? staccaSegno(g[i + 1].testo) : null;
        if (coda) {
          riga.push(...coda.resto);
          segno = coda.segno;
          i++;
        }
        out.push({ riga });
      } else if (dopo) {
        out.push({ etichetta: dopo.resto.length ? dopo.resto : null, segno: s, controllo: x.controllo });
        segno = dopo.segno;
        i++;
      } else out.push({ segno: s, controllo: x.controllo });
      continue;
    }
    if (inAttesa) {
      out.push({ etichetta: inAttesa, controllo: x.controllo });
      inAttesa = null;
    } else if (x.controllo.type === "checkbox" && g[i + 1] && g[i + 1].testo) {
      out.push({ etichetta: g[i + 1].testo, controllo: x.controllo });
      i++;
    } else out.push({ controllo: x.controllo });
  }
  if (inAttesa) out.push({ nota: inAttesa });
  return out;
}
function testoDi(nodi) {
  const s = document.createElement("span");
  s.className = "etichetta";
  for (const n of nodi) {
    const c = copia(n);
    if (c) s.appendChild(c);
  }
  return s;
}
function voce(c) {
  if (c.nota) {
    const p = testoDi(c.nota);
    p.className = "nota hint";
    return p;
  }
  if (c.riga) {
    const d = document.createElement("div");
    d.className = "voce in-riga";
    for (const n of c.riga) {
      if (n.tag === "select" || n.tag === "input") d.appendChild(controllo(n));
      else d.appendChild(testoDi([n])).className = "testo";
    }
    return d;
  }
  const l = document.createElement(c.controllo.type === "checkbox" ? "label" : "div");
  l.className = "voce";
  const ctrl = controllo(c.controllo);
  if (c.etichetta) l.appendChild(testoDi(c.etichetta));
  if (c.segno) l.appendChild(testoDi([c.segno])).className = "segno";
  l.appendChild(ctrl);
  return l;
}

// pannelli: righe di una tabella con intestazioni di colonna; ogni intestazione raccoglie le
// coppie delle colonne sotto di lei. Una riga che contiene un'altra tabella vale per le righe
// di quella (modifiche manuali al personaggio)
function righeDi(n, out = []) {
  for (const f of n.figli) {
    if (!f.tag || f.tag === "select") continue;
    if (f.tag === "tr" && !contieneTabella(f)) out.push(f);
    else righeDi(f, out);
  }
  return out;
}
const contieneTabella = (n) => n.figli.some((f) => f.tag && (f.tag === "table" || contieneTabella(f)));
function disegnaPannello(v, corpo) {
  const gruppi = [];
  let colonne = null; // intestazioni attive: [{da, a, gruppo}]
  const nuovoGruppo = (titolo) => {
    const g = { titolo, voci: [] };
    gruppi.push(g);
    return g;
  };
  let semplice = nuovoGruppo(null);
  for (const r of righeDi(v)) {
    const celle = r.figli.filter((f) => f.tag === "td" || f.tag === "th");
    // la riga del titolo del pannello, quella che lo apriva e chiudeva
    if (celle.some((c) => /TD$/.test(c.id))) continue;
    if (!celle.some(contieneControlli)) {
      const piene = celle.filter((c) => c.textContent.trim());
      if (!piene.length) continue;
      colonne = [];
      let col = 0;
      for (const c of celle) {
        const largo = Number(c.attributi.colspan) || 1;
        if (c.textContent.trim()) colonne.push({ da: col, a: col + largo, gruppo: nuovoGruppo(c) });
        col += largo;
      }
      continue;
    }
    let col = 0, inAttesa = null, gruppoAttesa = null;
    const colonnaDi = (k) => colonne && (colonne.find((x) => k >= x.da && k < x.a) || colonne[colonne.length - 1]);
    for (const [k, c] of celle.entries()) {
      const largo = Number(c.attributi.colspan) || 1;
      const colonna = colonnaDi(col);
      const g = colonna ? colonna.gruppo : semplice;
      col += largo;
      if (!contieneControlli(c)) {
        if (vuoto(c)) continue;
        // un testo seguito da una cella di un'altra colonna e' l'intestazione della sua
        // colonna da qui in giu' ("+% Resistance" nelle modifiche manuali al personaggio)
        if (colonna && k < celle.length - 1 && colonnaDi(col) !== colonna) {
          colonna.gruppo = nuovoGruppo(c);
          continue;
        }
        if (inAttesa) gruppoAttesa.voci.push({ nota: inAttesa });
        inAttesa = [c];
        gruppoAttesa = g;
        continue;
      }
      const lista = coppie(gettoni(c), inAttesa);
      inAttesa = null;
      g.voci.push(...lista);
    }
    if (inAttesa) gruppoAttesa.voci.push({ nota: inAttesa });
  }
  const parti = [];
  for (const g of gruppi) {
    if (!g.voci.length) continue;
    if (g.titolo) {
      const h = document.createElement("h4");
      for (const f of g.titolo.figli) { const c = copia(f); if (c) h.appendChild(c); }
      parti.push(h);
    }
    const griglia = document.createElement("div");
    griglia.className = "voci";
    griglia.append(...g.voci.map(voce));
    parti.push(griglia);
  }
  corpo.replaceChildren(...parti);
}

function aggiornaPannelli() {
  for (const el of pannelli) {
    const v = doc.getElementById(el.dataset.pannello);
    const corpo = el.querySelector(".corpo");
    const html = v ? v.innerHTML : "";
    if (el._html !== html) {
      el._html = html;
      if (v) disegnaPannello(v, corpo);
      else corpo.replaceChildren();
    }
    const summary = el.querySelector("summary");
    let badge = summary.querySelector(".attivo");
    const attivo = !!doc.getElementById(el.dataset.attivo)?.textContent.trim();
    if (attivo && !badge) {
      badge = document.createElement("span");
      badge.className = "attivo";
      badge.textContent = "attivo";
      summary.appendChild(badge);
    } else if (!attivo && badge) badge.remove();
  }
}

// skill passive: P_SkillN e' il nome, P_SkillNs il controllo
function aggiornaPassive() {
  const parti = [];
  for (let i = 0; i <= 21; i++) {
    const nome = doc.getElementById("P_Skill" + i);
    const cella = doc.getElementById("P_Skill" + i + "s");
    if (!nome || !cella || !nome.textContent.trim() || !contieneControlli(cella)) continue;
    parti.push({ nome, cella });
  }
  const firmaPassive = parti.map((p) => p.nome.innerHTML + "|" + p.cella.innerHTML).join("#");
  if (passive._html === firmaPassive) return;
  passive._html = firmaPassive;
  passive.replaceChildren(...parti.flatMap((p) => coppie(gettoni(p.cella), p.nome.figli.slice())).map(voce));
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
// Metriche e regole vengono dal confronto A/B del calcolatore di Thrice.
const METRICHE = [
  { gruppo: "Statistiche" },
  { voce: "Max HP", id: "A_MaxHP" },
  { voce: "Max SP", id: "A_MaxSP" },
  { voce: "ATK", id: "A_ATK2" },
  { voce: "ATK reale", id: "A_RealATK" },
  { voce: "MATK", id: "A_MATK" },
  { voce: "DEF", id: "A_totalDEF" },
  { voce: "MDEF", id: "A_MDEF" },
  { voce: "HIT", id: "A_HIT" },
  { voce: "Flee", id: "A_FLEE" },
  { voce: "Perfect Dodge", id: "A_LUCKY" },
  { voce: "Critical", id: "A_CRI" },
  { voce: "ASPD", id: "A_ASPD" },
  { voce: "Tempo di lancio", id: "A_cTime", meno: true, primo: true },
  { voce: "Ritardo dopo il lancio", id: "A_cDelay", meno: true, primo: true },
  { voce: "Velocità di movimento", id: "A_MovSPEED" },
  { gruppo: "Il tuo attacco" },
  { voce: "Probabilità di colpire", id: "BattleHIT", percento: true },
  { voce: "Probabilità di critico", id: "CRInum", percento: true },
  { voce: "Danno critico", id: "CRIATK" },
  { voce: "Danno minimo", id: "strID_0" },
  { voce: "Danno medio", id: "strID_1" },
  { voce: "Danno massimo", id: "strID_2" },
  { voce: "Danno al secondo", id: "AveSecondATK" },
  { voce: "Colpi per ucciderlo, in media", id: "AveATKnum", meno: true },
  { gruppo: "L'attacco del nemico" },
  { voce: "Probabilità di schivare", id: "BattleFLEE", percento: true },
  { voce: "Danno subito, minimo", id: "B_MinAtk", meno: true },
  { voce: "Danno subito, in media", id: "B_AveAtk", meno: true },
  { voce: "Danno subito, massimo", id: "B_MaxAtk", meno: true },
  { voce: "HP effettivi", id: "B_EffectiveHP" },
  { voce: "HP effettivi, con le schivate", id: "B_ExpectedEffectiveHP" },
];
// scelte che cambiano i danni senza essere la build: se A e B le hanno diverse, si avvisa
const CONTESTO = [
  ["A_ActiveSkill", "la tua skill"],
  ["A_ActiveSkillLV", "il livello della tua skill"],
  ["B_AtkSkill", "la skill del nemico"],
  ["A8_Skill14", "l'ambiente"],
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
    if (!w.leggiBuild(stato.confronto.build)) throw new Error("la build A non è di questo calcolatore");
    for (const el of pannelli) w[el.dataset.apri](1);
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

function valoreDi(m, d) {
  const testo = d.testo(m.id).replace(/\s+/g, " ").trim();
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

function sceltaDi(d, nome) {
  const v = d.calcForm[nome];
  if (!v) return "";
  if (v.tag !== "select") return String(v.value);
  return v._lista()[v.selectedIndex]?.text ?? "";
}

// il mostro di A segue quello di B; restituisce false se A non lo trova nel suo elenco
function allineaMostro() {
  const nemico = String(virtuale("B_Enemy").value);
  if (motoreA.nemico === nemico) return true;
  const w = motoreA.finestra;
  const campo = w.documento.calcForm.B_Enemy;
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
  confronto.querySelector('[data-azione="fissa-a"]').textContent = a ? "Sostituisci A con questa build" : "Fissa questa build come A";
  confronto.querySelector('[data-azione="scambia-ab"]').hidden = !a;
  confronto.querySelector('[data-azione="togli-a"]').hidden = !a;
  document.getElementById("confronto-stato").textContent = a
    ? "A fissata il " + new Date(a.quando).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" }) + "."
    : "Nessuna build A.";
  document.getElementById("confronto-risultati").hidden = !a;
  if (!a) return;
  const avviso = document.getElementById("confronto-avviso");
  if (!motoreA) {
    avviso.hidden = true;
    confrontoCorpo.replaceChildren(riga([["Calcolo della build A…"]]));
    return;
  }
  let stessoMostro;
  try {
    stessoMostro = allineaMostro();
  } catch (e) {
    mostraErrore(e);
    return;
  }
  const dA = motoreA.finestra.documento;
  const diversi = CONTESTO.filter(([nome]) => sceltaDi(dA, nome) !== sceltaDi(doc, nome)).map(([, d]) => d);
  if (!stessoMostro) diversi.unshift("il mostro");
  avviso.hidden = !diversi.length;
  avviso.textContent = diversi.length
    ? `Non sono uguali in A e B: ${diversi.join(", ")}. Le differenze nei danni non vengono solo dalla build.`
    : "";
  const righe = [];
  let gruppo = null;
  for (const m of METRICHE) {
    if (m.gruppo) {
      gruppo = m.gruppo;
      continue;
    }
    const va = valoreDi(m, dA), vb = valoreDi(m, doc);
    const diff = differenza(m, va, vb);
    if (soloDifferenze.checked && !diff.diversa) continue;
    if (gruppo) righe.push(riga([[gruppo]], "gruppo"));
    gruppo = null;
    righe.push(riga([[m.voce], [va.mostra], [vb.mostra], [diff.testo, diff.classe]]));
  }
  if (!righe.length) righe.push(riga([["Nessuna differenza."]]));
  confrontoCorpo.replaceChildren(...righe);
}
soloDifferenze.addEventListener("change", aggiornaConfronto);

// ---------- azioni della pagina ----------

const selSalvate = document.getElementById("salvate");
const nomeBuild = document.getElementById("nome-build");
function disegnaSalvate() {
  selSalvate.replaceChildren(...(stato.salvate.length
    ? stato.salvate.map((s, i) => new Option(s.nome, i))
    : [new Option("(nessuna build salvata)", "")]));
  selSalvate.disabled = !stato.salvate.length;
}

async function copiaLink(build, messaggio) {
  const link = location.origin + location.pathname + "#" + build;
  try {
    await navigator.clipboard.writeText(link);
    avvisa(messaggio);
  } catch {
    prompt("Copia questo link:", link);
  }
}

document.addEventListener("click", async (e) => {
  const el = e.target.closest("[data-azione]");
  if (!el) return;
  const azione = el.dataset.azione;
  if (azione === "chiudi-ricerca") {
    ricerca.close();
  } else if (azione === "copia-link") {
    await copiaLink(buildCorrente(), "Link copiato: chi lo apre vede questa build.");
  } else if (azione === "copia-link-salvata") {
    const s = stato.salvate[Number(selSalvate.value)];
    if (!s) return;
    await copiaLink(s.build, `Link copiato: chi lo apre vede la build "${s.nome}".`);
  } else if (azione === "salva") {
    const nome = nomeBuild.value.trim();
    if (!nome) {
      avvisa("Scrivi un nome per la build.");
      nomeBuild.focus();
      return;
    }
    const build = buildCorrente();
    const esistente = stato.salvate.find((s) => s.nome === nome);
    if (esistente) {
      if (!confirm(`Sostituire la build salvata "${nome}"?`)) return;
      esistente.build = build;
    } else stato.salvate.push({ nome, build });
    stato.salvate.sort((a, b) => a.nome.localeCompare(b.nome, "it"));
    salva();
    disegnaSalvate();
    selSalvate.value = String(stato.salvate.findIndex((s) => s.nome === nome));
    avvisa(`Build "${nome}" salvata.`);
  } else if (azione === "carica") {
    const s = stato.salvate[Number(selSalvate.value)];
    if (!s) return;
    stato.corrente = s.build;
    salva();
    apriBuild(s.build);
  } else if (azione === "elimina") {
    const i = Number(selSalvate.value);
    const s = stato.salvate[i];
    if (!s || !confirm(`Eliminare la build salvata "${s.nome}"?`)) return;
    stato.salvate.splice(i, 1);
    salva();
    disegnaSalvate();
  } else if (azione === "nuova") {
    if (!confirm("Ricominciare da un personaggio nuovo? Le build salvate restano.")) return;
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
  } else if (azione === "esporta") {
    esporta();
  } else if (azione === "importa") {
    file.click();
  }
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
  avvisa(`Il browser scarica ${link.download}: conservalo, e con Ripristina da backup recuperi i dati.`);
}
file.addEventListener("change", async () => {
  const scelto = file.files[0];
  file.value = "";
  if (!scelto) return;
  try {
    const nuovo = normalizza(JSON.parse(await scelto.text()));
    if (!confirm("Sostituire le build della pagina con quelle del file?")) return;
    stato = nuovo;
    salva();
    if (stato.corrente) apriBuild(stato.corrente);
    else location.reload();
  } catch {
    avvisa("Il file non è un backup di questa pagina.");
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
  for (const el of pannelli) window[el.dataset.apri](1);
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
  document.getElementById("caricamento").textContent = "Il calcolatore non si è avviato: " + (e?.message || e);
  console.error(e);
}
