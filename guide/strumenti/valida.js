// Controlla la guida dopo ogni modifica:  node strumenti/valida.js
// - i due script della pagina sono JavaScript valido
// - nessun id di step duplicato, ogni quest citata esiste
// - ogni /navi (e ogni coordinata citata nei testi) punta a una cella calpestabile
// - i riferimenti "step X.YY" e "fase N" nei testi visibili puntano a step e fasi visibili
// - le fasi della pagina Altre quest (page: "altre") sono facoltative in ogni step
const { leggiGuida, mappa, calpestabile, cellaVicina } = require("./comune");

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
const RIF = /(?<![\dA-Za-z.\/])((?:Q\d{1,2}|\d{1,2})\.\d{2}(?:[a-z](?![a-zà-ÿ]))?)(?!\d|\.\d)|\bfase (\d{1,2}[a-z]?)\b|\b(Q\d{1,2})\b(?!\.\d)/g;
function controllaTesto(dove, testo) {
  for (const m of String(testo || "").matchAll(RIF)) {
    if (m[1] && !idVisibili.has(m[1])) err("riferimento a step non visibile o inesistente " + m[1] + " in " + dove);
    if (m[2] && !fasiId.has(m[2])) err("riferimento a fase non visibile o inesistente " + m[2] + " in " + dove);
    if (m[3] && !fasiId.has(m[3])) err("riferimento a quest non visibile o inesistente " + m[3] + " in " + dove);
  }
  if (/\bfasi \d/.test(String(testo || ""))) err("elenco di fasi non controllabile in " + dove + ": scrivi \"fase N\" per ognuna");
}
fasiVisibili.forEach(p => { controllaTesto("intro fase " + p.id, p.intro); controllaTesto("quando fase " + p.id, p.when); });

// Id: nel percorso "fase.numero", nelle altre quest "Qn.numero"; ogni step ha il prefisso della sua fase
g.PHASES.forEach(p => {
  const altre = p.page === "altre";
  if (altre !== /^Q\d{1,2}$/.test(p.id)) err("la fase " + p.id + " ha un id che non corrisponde alla sua pagina (le altre quest si chiamano Q1, Q2...)");
  p.steps.forEach(s => { if (!s.id.startsWith(p.id + ".")) err("lo step " + s.id + " non ha il prefisso della sua fase " + p.id); });
});
if (g.script[0].includes("const ID_MAP_V3")) {
  const v3 = new Function(g.script[0] + ";return ID_MAP_V3;")();
  const valori = Object.values(v3);
  if (new Set(valori).size !== valori.length) err("ID_MAP_V3 manda due id vecchi sullo stesso id nuovo");
} else err("manca ID_MAP_V3: serve a convertire spunte e note salvate prima della versione 7.0");
visibili.forEach(s => ["h", "d", "tip", "warn", "verify"].forEach(k => controllaTesto("step " + s.id + " (" + k + ")", s[k])));

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
console.log(errori ? errori + " errori." : "Nessun errore.");
process.exit(errori ? 1 : 0);
