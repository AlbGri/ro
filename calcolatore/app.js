// Interfaccia del calcolatore. Il motore (file in motore/) lavora su un documento finto
// (motore/forma.js): qui la pagina ne rispecchia campi e risultati, in italiano, e gli
// riporta ogni scelta eseguendo il gestore che il campo aveva nella pagina originale.
import { traduci } from "./traduzioni.js";

const STORAGE_KEY = "ragnarok-calcolatore/stato";
const doc = window.documento;
const virtuale = (nome) => doc.calcForm[nome];
// elenchi oltre questa lunghezza si scelgono con la ricerca
const LUNGO = 40;

// ---------- stato salvato: build corrente e build con nome ----------

let stato = { corrente: "", salvate: [] };

function normalizza(dati) {
  const salvate = Array.isArray(dati?.salvate)
    ? dati.salvate.filter((s) => typeof s?.nome === "string" && typeof s?.build === "string")
    : [];
  return { corrente: typeof dati?.corrente === "string" ? dati.corrente : "", salvate };
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
// la build nel formato dell'indirizzo dell'originale: la capiscono anche gli altri calcolatori
function buildCorrente() {
  return String(window.URLOUT(1)).split("#")[1] || "";
}
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

// ---------- gestori del motore ----------

// il gestore scritto nel campo (onchange, onclick), con "this" che si comporta come una
// <select> del browser anche per this[this.selectedIndex]
function eseguiGestore(v) {
  const codice = v.getAttribute("onchange") || v.getAttribute("onclick");
  if (!codice) return;
  const questo = new Proxy(v, {
    get(t, p) {
      if (typeof p === "string" && /^\d+$/.test(p)) return t._lista()[Number(p)];
      const x = t[p];
      return typeof x === "function" ? x.bind(t) : x;
    },
  });
  new Function("event", codice).call(questo, { target: questo });
}

function calcola() {
  try {
    window.calc();
    nascondiErrore();
  } catch (e) {
    mostraErrore(e);
  }
}

// una scelta dell'utente su un campo del motore
function scegli(v, valore) {
  try {
    if (v.tag === "select") v.value = valore;
    else if (v.type === "checkbox") v.checked = valore;
    else v.value = valore;
    eseguiGestore(v);
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
    el.addEventListener("click", () => { try { eseguiGestore(el._v); } catch (e) { mostraErrore(e); } calcola(); sincronizza(); });
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
  return el;
}

function apriRicerca(el) {
  ricercaPer = el;
  ricercaTesto.value = "";
  disegnaRicerca();
  ricerca.showModal();
  ricercaTesto.focus();
}
function normale(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function disegnaRicerca() {
  const v = ricercaPer._v;
  const parole = normale(ricercaTesto.value).split(/\s+/).filter(Boolean);
  const frammento = document.createDocumentFragment();
  const scelta = v.selectedIndex;
  let gruppo = null, mostrate = 0;
  v._lista().forEach((o, i) => {
    const testo = traduci(o.text);
    if (parole.length && !parole.every((p) => normale(testo).includes(p))) return;
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
// coppie: testo prima del controllo, o dopo una casella; un controllo senza testo vicino
// prende il testo rimasto in attesa (la cella prima)
function coppie(g, inAttesa = null) {
  const out = [];
  for (let i = 0; i < g.length; i++) {
    const x = g[i];
    if (x.a_capo) continue;
    if (x.testo) {
      if (inAttesa) out.push({ nota: inAttesa });
      inAttesa = x.testo;
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
  const l = document.createElement(c.controllo.type === "checkbox" ? "label" : "div");
  l.className = "voce";
  const ctrl = controllo(c.controllo);
  if (c.etichetta) l.appendChild(testoDi(c.etichetta));
  l.appendChild(ctrl);
  return l;
}

// pannelli: righe di una tabella con intestazioni di colonna; ogni intestazione raccoglie le
// coppie delle colonne sotto di lei
function righeDi(n, out = []) {
  for (const f of n.figli) {
    if (!f.tag || f.tag === "select") continue;
    if (f.tag === "tr") out.push(f);
    else righeDi(f, out);
  }
  return out;
}
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
    for (const c of celle) {
      const largo = Number(c.attributi.colspan) || 1;
      const g = (colonne && colonne.find((x) => col >= x.da && col < x.a)?.gruppo) || (colonne ? colonne[colonne.length - 1].gruppo : semplice);
      col += largo;
      if (!contieneControlli(c)) {
        if (vuoto(c)) continue;
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
}

// ---------- azioni della pagina ----------

const selSalvate = document.getElementById("salvate");
const nomeBuild = document.getElementById("nome-build");
function disegnaSalvate() {
  selSalvate.replaceChildren(...(stato.salvate.length
    ? stato.salvate.map((s, i) => new Option(s.nome, i))
    : [new Option("(nessuna build salvata)", "")]));
  selSalvate.disabled = !stato.salvate.length;
}

document.addEventListener("click", async (e) => {
  const el = e.target.closest("[data-azione]");
  if (!el) return;
  const azione = el.dataset.azione;
  if (azione === "chiudi-ricerca") {
    ricerca.close();
  } else if (azione === "copia-link") {
    const link = location.origin + location.pathname + "#" + buildCorrente();
    try {
      await navigator.clipboard.writeText(link);
      avvisa("Link copiato: chi lo apre vede questa build.");
    } catch {
      prompt("Copia questo link:", link);
    }
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
  } else if (azione === "importa-indirizzo") {
    const testo = document.getElementById("indirizzo-esterno").value.trim();
    const build = testo.includes("#") ? testo.split("#")[1] : testo.includes("?") ? testo.split("?")[1] : "";
    if (!build) {
      avvisa("Nell'indirizzo non c'è una build: deve contenere # seguito dalla build.");
      return;
    }
    stato.corrente = build;
    salva();
    apriBuild(build);
  } else if (azione === "nuova") {
    if (!confirm("Ricominciare da un personaggio nuovo? Le build salvate restano.")) return;
    stato.corrente = "";
    salva();
    history.replaceState(null, "", location.pathname);
    location.reload();
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
  // altrimenti si riprende quella lasciata l'ultima volta
  if (location.hash.length > 1) {
    history.replaceState(null, "", location.pathname);
  } else if (stato.corrente) {
    doc.getElementById("otherURL_TEXT").value = "x#" + stato.corrente;
    try {
      window.URLIN(1);
    } catch (e) {
      mostraErrore(e);
    }
  }
  // tutti i pannelli aperti nel motore: i loro campi esistono sempre, la pagina li mostra o no
  for (const el of pannelli) window[el.dataset.apri](1);
  // la scheda dell'ultimo oggetto scelto resta sempre visibile
  window.ClickB_Item("SW");
  document.getElementById("app").before(erroreBox);
  collegaCampiFissi();
  calcola();
  sincronizza();
  disegnaSalvate();
  salvaPresto();
  document.getElementById("caricamento").remove();
  document.getElementById("app").hidden = false;
}

try {
  avvia();
} catch (e) {
  document.getElementById("caricamento").textContent = "Il calcolatore non si è avviato: " + (e?.message || e);
  console.error(e);
}
