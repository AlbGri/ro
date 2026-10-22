// Controlla la guida dopo ogni modifica:  node strumenti/valida.js
// - i due script della pagina sono JavaScript valido
// - nessun id di step duplicato, ogni quest citata esiste
// - ogni /navi (e ogni coordinata citata nei testi) punta a una cella calpestabile
// - i riferimenti "step X.YY" e "fase N" nei testi visibili puntano a step e fasi visibili
// - le fasi della pagina Altre quest (page: "altre") sono facoltative in ogni step
// - i testi inglesi corrispondono agli italiani, nomi del gioco compresi
const fs = require("fs");
const path = require("path");
const { leggiGuida, mappa, calpestabile, cellaVicina, FONTI, CAMPI_EN_STEP, CAMPI_EN_FASE } = require("./comune");

const g = leggiGuida(process.argv[2]);
new Function(g.script[1]);
let errori = 0;
const err = t => { errori++; console.log("ERRORE: " + t); };

const tutti = g.PHASES.flatMap(p => p.steps);
const ids = tutti.map(s => s.id);
ids.filter((x, i) => ids.indexOf(x) !== i).forEach(x => err("id duplicato " + x));
tutti.forEach(s => s.q.forEach(k => { if (!g.QUESTS[k]) err("quest sconosciuta " + k + " nello step " + s.id); }));

const fasiVisibili = g.PHASES.filter(p => !p.hidden);
const visibili = fasiVisibili.flatMap(p => p.steps.filter(s => !s.hidden));
const idVisibili = new Set(visibili.map(s => s.id));
const fasiId = new Set(fasiVisibili.map(p => p.id));

// Coordinate
let coordinate = 0;
function controlla(dove, testo) {
  const m = testo.match(/^(\S+) (\d+)\/(\d+)$/);
  if (!m) return err("formato /navi non valido in " + dove + ": " + testo);
  const mp = mappa(m[1]);
  if (!mp) return err("mappa assente nelle fonti, " + dove + ": " + testo);
  coordinate++;
  if (!calpestabile(mp, +m[2], +m[3])) {
    const v = cellaVicina(mp, +m[2], +m[3]);
    err("cella non calpestabile, " + dove + ": " + testo + " -> la più vicina è " + (v ? m[1] + " " + v.x + "/" + v.y : "nessuna"));
  }
}
tutti.forEach(s => {
  (s.navi || []).forEach(n => controlla("step " + s.id, n));
  ["d", "tip", "warn"].forEach(k => {
    for (const m of String(s[k] || "").matchAll(/\b([a-z]+_[a-z_0-9]+|[a-z]{4,}\d*) (\d+)\/(\d+)/g)) {
      if (mappa(m[1])) controlla("step " + s.id + " (" + k + ")", m[1] + " " + m[2] + "/" + m[3]);
    }
  });
});

// Riferimenti interni
// Stessa espressione della pagina (XREF_RE): step "9.03" e "Q4.07", fasi "fase 10", quest "Q3".
const RIF = /(?<![\dA-Za-z.\/])((?:Q\d{1,2}|\d{1,2})\.\d{2}(?:[a-z](?![a-zà-ÿ]))?)(?!\d|\.\d)|\b(?:fase|phase) (\d{1,2}[a-z]?)\b|\b(Q\d{1,2})\b(?!\.\d)/g;
function controllaTesto(dove, testo) {
  for (const m of String(testo || "").matchAll(RIF)) {
    if (m[1] && !idVisibili.has(m[1])) err("riferimento a step non visibile o inesistente " + m[1] + " in " + dove);
    if (m[2] && !fasiId.has(m[2])) err("riferimento a fase non visibile o inesistente " + m[2] + " in " + dove);
    if (m[3] && !fasiId.has(m[3])) err("riferimento a quest non visibile o inesistente " + m[3] + " in " + dove);
  }
  if (/\bfasi \d/.test(String(testo || ""))) err("elenco di fasi non controllabile in " + dove + ": scrivi \"fase N\" per ognuna");
  if (/\bphases \d/.test(String(testo || ""))) err("elenco di fasi non controllabile in " + dove + ": scrivi \"phase N\" per ognuna");
}
fasiVisibili.forEach(p => { controllaTesto("intro fase " + p.id, p.intro); controllaTesto("quando fase " + p.id, p.when); });

// Id: nel percorso "fase.numero", nelle altre quest "Qn.numero"; ogni step ha il prefisso della sua fase
g.PHASES.forEach(p => {
  const altre = p.page === "altre";
  if (altre !== /^Q\d{1,2}$/.test(p.id)) err("la fase " + p.id + " ha un id che non corrisponde alla sua pagina (le altre quest si chiamano Q1, Q2...)");
  p.steps.forEach(s => { if (!s.id.startsWith(p.id + ".")) err("lo step " + s.id + " non ha il prefisso della sua fase " + p.id); });
});
[["ID_MAP_V3", "7.0"], ["ID_MAP_V4", "8.0"], ["ID_MAP_V5", "9.0"]].forEach(([nome, versione]) => {
  if (!g.script[0].includes("const " + nome)) return err("manca " + nome + ": serve a convertire spunte e note salvate prima della versione " + versione);
  const valori = Object.values(new Function(g.script[0] + ";return " + nome + ";")());
  if (new Set(valori).size !== valori.length) err(nome + " manda due id vecchi sullo stesso id nuovo");
});
// L'ultima mappa deve arrivare agli id di oggi: uno step che non c'è perderebbe spunta e nota alla conversione.
{
  const v5 = Object.values(new Function(g.script[0] + ";return ID_MAP_V5;")());
  v5.filter(id => !ids.includes(id)).forEach(id => err("ID_MAP_V5 porta a uno step che non esiste: " + id));
}
visibili.forEach(s => ["h", "d", "tip", "warn", "verify"].forEach(k => controllaTesto("step " + s.id + " (" + k + ")", s[k])));

// Testi inglesi (campo en, dal 23/10/2026): per ogni testo italiano c'e' quello inglese, e i due hanno
// le stesse opzioni tra «», gli stessi rimandi, le stesse coordinate e gli stessi numeri.
// Uno step o una fase senza en si mostra in italiano anche in inglese: si contano, non sono errori.
const testiStep = s => Object.assign({}, ...CAMPI_EN_STEP.map(k => ({ [k]: k === "copy" ? (s.copy && s.copy.map(c => c.label)) : s[k] })));
const testiFase = p => Object.assign({}, ...CAMPI_EN_FASE.map(k => ({ [k]: p[k] })));
const multinsieme = a => a.slice().sort().join(" | ");
function pezzi(testo, inglese) {
  let t = String(testo);
  const opzioni = [...t.matchAll(/«[^»]*»/g)].map(m => m[0]);
  t = t.replace(/«[^»]*»/g, " ");
  const rimandi = [...t.matchAll(RIF)].map(m => m[1] || (m[2] ? "fase " + m[2] : m[3]));
  t = t.replace(RIF, " ");
  // "mappa x/y", oppure solo "x/y" quando la parola prima non e' una mappa ("a 213/277", "at 213/277")
  const COORD = /(?:\b([a-z_0-9]+) )?(\d+\/\d+)/g;
  const coord = [...t.matchAll(COORD)].map(m => (m[1] && mappa(m[1]) ? m[1] + " " : "") + m[2]);
  t = t.replace(COORD, " ");
  // 1.200 e 0,5 in italiano, 1,200 e 0.5 in inglese
  const numeri = [...t.matchAll(inglese ? /\d+(?:,\d{3})*(?:\.\d+)?/g : /\d+(?:\.\d{3})*(?:,\d+)?/g)]
    .map(m => String(Number(inglese ? m[0].replace(/,/g, "") : m[0].replace(/\./g, "").replace(",", "."))));
  return { opzioni: opzioni.join(" | "), rimandi: multinsieme(rimandi), coordinate: multinsieme(coord), numeri: multinsieme(numeri) };
}
function confronta(dove, it, en) {
  if (!en) return false;
  Object.keys(it).forEach(k => {
    const a = it[k], b = en[k];
    if (a === undefined) { if (b !== undefined) err("testo inglese senza italiano in " + dove + " (" + k + ")"); return; }
    if (b === undefined) return err("manca il testo inglese in " + dove + " (" + k + ")");
    const coppie = k === "copy" ? a.map((x, i) => [x, b[i]]) : [[a, b]];
    if (k === "copy" && (!Array.isArray(b) || b.length !== a.length)) return err("etichette copy inglesi in numero diverso in " + dove);
    coppie.forEach(([x, y]) => {
      controllaTesto(dove + " (en " + k + ")", y);
      const pi = pezzi(x, false), pe = pezzi(y, true);
      Object.keys(pi).forEach(c => { if (pi[c] !== pe[c]) err(c + " diversi fra italiano e inglese in " + dove + " (" + k + "): «" + pi[c] + "» / «" + pe[c] + "»"); });
    });
  });
  return true;
}
const senzaEn = [];
fasiVisibili.forEach(p => { if (!confronta("fase " + p.id, testiFase(p), p.en)) senzaEn.push(p.id); });
visibili.forEach(s => { if (!confronta("step " + s.id, testiStep(s), s.en)) senzaEn.push(s.id); });

// Nomi del gioco uguali nelle due lingue, perche' un nome tradotto non si trova in gioco: un nome delle
// fonti scritto nell'italiano c'e' anche nell'inglese, e un nome con la maiuscola scritto nell'inglese
// c'e' nell'italiano o nelle fonti. Il plurale inglese e' ammesso (Tool Dealers per Tool Dealer, scelta
// di Alberto del 23/10/2026): si confronta tutto senza la "s" finale delle parole.
const singolare = t => t.toLowerCase().replace(/\^[0-9a-f]{6}/g, "").replace(/['’]s\b/g, "").replace(/_/g, " ").replace(/(?<!s)s\b/g, "");
const fonti = singolare(fs.readdirSync(FONTI).filter(f => /\.(txt|yml)$/.test(f))
  .map(f => fs.readFileSync(path.join(FONTI, f), "utf8")).concat(Object.values(g.QUESTS).map(q => q.name)).join("\n"));
// Parole con la maiuscola che non sono nomi del gioco: inizi di frase, giorni, sigle.
const PAROLE_EN = new Set(("A All Also An Answer Any Are Ask At Back Before Both Bring Buy Can Check Choose Click Close " +
  "Come Could Do Don Done Each Either Enter Even Every Exchanges Follow For Fourth From Get Give Go Has Have He Help Here How HP If " +
  "In Is It Italy Just Keep Kill Leave Look Make Many May Monday Most Must Neither Nest No Not Note Now On Once One Only Open " +
  "Optional Phase Pick Portals Put Read Rightmost Same Save Select Sell She Shortest Should Skip Sliding SP Step Steps " +
  "Still Take Talk That The Then There They This Timed To Unlocks Use Wait Walk Warp We What When Where Which Who Whoever " +
  "Why Will With Without Would Yes You Your").split(" ").map(singolare));
const NOME = /\b[A-Z][\w'’-]*(?:\s+(?:(?:of|the|de|to|from|in|and|on|for|a)\s+)*[A-Z][\w'’-]*)*/g;
const NOME_FONTI = /\b[A-Z][\w'’-]*(?:\s+(?:(?:of|the|de|to|from)\s+)*[A-Z][\w'’-]*)+/g;
function controllaNomi(dove, it, en) {
  if (typeof it !== "string" || typeof en !== "string") return;
  const itS = singolare(it), enS = singolare(en);
  for (const m of it.matchAll(NOME_FONTI)) {
    const n = singolare(m[0]);
    if (fonti.includes(n) && !enS.includes(n)) err("nome del gioco assente nell'inglese in " + dove + ": " + m[0]);
  }
  const noto = t => PAROLE_EN.has(t) || itS.includes(t) || fonti.includes(t);
  for (const m of en.matchAll(NOME)) {
    const parole = m[0].split(/\s+/);
    while (parole.length > 1 && PAROLE_EN.has(singolare(parole[0]))) parole.shift();
    const n = singolare(parole.join(" "));
    if (noto(n)) continue;
    // "Alliance Manager in Prontera": basta che sia noto ogni pezzo
    const pezzi = n.split(/\s+(?:and|in|to|from|on|of|for|the)\s+/).map(t => t.replace(/^(?:(?:the|to|on|a)\s+)+/, ""));
    if (!pezzi.every(noto)) err("nome inglese che non e' nell'italiano ne' nelle fonti in " + dove + ": " + parole.join(" "));
  }
}
const lista = v => Array.isArray(v) ? v.join(" | ") : v;
fasiVisibili.filter(p => p.en).forEach(p => CAMPI_EN_FASE.forEach(k => controllaNomi("fase " + p.id + " (" + k + ")", p[k], p.en[k])));
visibili.filter(s => s.en).forEach(s => ["h", "d", "tip", "warn", "verify"].forEach(k => controllaNomi("step " + s.id + " (" + k + ")", lista(s[k]), lista(s.en[k]))));

// Pagina "Altre quest": le sue fasi (page: "altre") non devono entrare nel progresso del percorso
g.PHASES.forEach(p => {
  if (p.page !== undefined && p.page !== "altre") err("valore di page non previsto nella fase " + p.id + ": " + p.page);
  if (p.page !== "altre") return;
  if (!p.opt) err("la fase " + p.id + " è nella pagina Altre quest ma non ha opt: true");
  p.steps.filter(s => !s.opt).forEach(s => err("lo step " + s.id + " è nella pagina Altre quest ma non ha opt: true"));
  p.steps.filter(s => s.group).forEach(s => err("lo step " + s.id + " è nella pagina Altre quest e non può avere group"));
});
const fasiAltre = fasiVisibili.filter(p => p.page === "altre");

const obbligatori = visibili.filter(s => !s.opt).length;
console.log("Versione " + g.GUIDE_VERSION + ": " + tutti.length + " step nel file, " + visibili.length + " visibili, " + obbligatori + " obbligatori, " +
  visibili.filter(s => s.verify).length + " con dubbio aperto, " + coordinate + " coordinate controllate.");
console.log("Percorso: " + (fasiVisibili.length - fasiAltre.length) + " fasi. Altre quest: " + fasiAltre.length + " (" + fasiAltre.map(p => p.id).join(", ") + "), " +
  fasiAltre.reduce((n, p) => n + p.steps.filter(s => !s.hidden).length, 0) + " step.");
console.log(senzaEn.length ? "Senza testo inglese: " + senzaEn.length + " fra fasi e step (" + senzaEn.slice(0, 12).join(", ") + (senzaEn.length > 12 ? "..." : "") + ")." : "Testo inglese completo.");
console.log(errori ? errori + " errori." : "Nessun errore.");
process.exit(errori ? 1 : 0);
