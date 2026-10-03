// Modifica step e fasi della guida a partire da un file JSON, poi riscrive il blocco PHASES nello stesso formato.
//   node strumenti/modifica_step.js modifiche.json 4.1
// Formato del JSON (tutte le chiavi sono facoltative):
// {
//   "step":  { "11.12": { "d": "nuovo testo", "tip": null, "navi": ["man_fild01 70/246"] } },   null elimina il campo
//   "fasi":  { "11": { "intro": "nuova introduzione", "hidden": true } },
//   "nuovi": [ { "fase": "16", "dopo": "16.11", "step": { "id": "16.12", "q": ["GY"], "h": "Titolo" } } ],
//   "elimina": ["3.04"]
// }
// Per modifiche piccole va bene anche lo strumento Edit direttamente sul file HTML.
const fs = require("fs");
const { leggiGuida, scriviGuida } = require("./comune");
const [fileModifiche, versione] = process.argv.slice(2);
const mod = JSON.parse(fs.readFileSync(fileModifiche, "utf8"));
const g = leggiGuida();
const perId = {};
g.PHASES.forEach(p => p.steps.forEach(s => { perId[s.id] = s; }));

Object.entries(mod.step || {}).forEach(([id, campi]) => {
  const s = perId[id];
  if (!s) throw new Error("step mancante: " + id);
  Object.entries(campi).forEach(([k, v]) => { if (k === "id") throw new Error("gli id non si cambiano"); if (v === null) delete s[k]; else s[k] = v; });
});
Object.entries(mod.fasi || {}).forEach(([id, campi]) => {
  const p = g.PHASES.find(x => x.id === id);
  if (!p) throw new Error("fase mancante: " + id);
  Object.entries(campi).forEach(([k, v]) => { if (k === "id" || k === "steps") throw new Error("campo non modificabile: " + k); if (v === null) delete p[k]; else p[k] = v; });
});
(mod.nuovi || []).forEach(n => {
  const p = g.PHASES.find(x => x.id === n.fase);
  if (!p) throw new Error("fase mancante: " + n.fase);
  if (perId[n.step.id]) throw new Error("id già esistente: " + n.step.id);
  const pos = n.dopo ? p.steps.findIndex(s => s.id === n.dopo) + 1 : p.steps.length;
  p.steps.splice(pos || p.steps.length, 0, n.step);
  perId[n.step.id] = n.step;
});
(mod.elimina || []).forEach(id => {
  const p = g.PHASES.find(x => x.steps.some(s => s.id === id));
  if (!p) throw new Error("step mancante: " + id);
  p.steps = p.steps.filter(s => s.id !== id);
});
scriviGuida(g.src, g.PHASES, versione);
console.log("Guida aggiornata" + (versione ? " alla versione " + versione : "") + ". Ora esegui: node strumenti/valida.js");
