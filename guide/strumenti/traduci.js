// Mette i testi inglesi nel campo en di fasi e step, poi riscrive il blocco PHASES.
//   node strumenti/traduci.js traduzioni.json [versione]
// Formato: { "7": { "title": "...", "intro": "..." }, "7.03": { "h": "...", "d": "...", "copy": ["..."] } }
// Una chiave e' l'id di una fase o di uno step; il valore sostituisce il suo en per intero. Le chiavi
// ammesse sono quelle di CAMPI_EN_FASE e CAMPI_EN_STEP di comune.js. Poi: node strumenti/valida.js
const fs = require("fs");
const { leggiGuida, scriviGuida, CAMPI_EN_STEP, CAMPI_EN_FASE } = require("./comune");
const [fileTraduzioni, versione] = process.argv.slice(2);
const traduzioni = JSON.parse(fs.readFileSync(fileTraduzioni, "utf8"));
const g = leggiGuida();
const fasi = Object.fromEntries(g.PHASES.map(p => [p.id, p]));
const step = Object.fromEntries(g.PHASES.flatMap(p => p.steps).map(s => [s.id, s]));

Object.entries(traduzioni).forEach(([id, en]) => {
  const fase = fasi[id];
  const oggetto = fase || step[id];
  if (!oggetto) throw new Error("id sconosciuto: " + id);
  const ammesse = fase ? CAMPI_EN_FASE : CAMPI_EN_STEP;
  Object.keys(en).forEach(k => { if (!ammesse.includes(k)) throw new Error("campo non previsto in " + id + ": " + k); });
  oggetto.en = en;
});
scriviGuida(g.src, g.PHASES, versione);
console.log("Testi inglesi scritti per " + Object.keys(traduzioni).length + " fasi e step.");
