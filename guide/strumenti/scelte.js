// Elenca le scelte di dialogo (select) di uno script e cosa fa ogni opzione.
//   node strumenti/scelte.js quests_13_1.txt 8486 10420      (file in fonti, riga iniziale e finale facoltative)
// Per ogni opzione mostra gli effetti (variabili, quest, oggetti, warp, mostri) e come finisce:
// CHIUDE = il dialogo termina, CONTINUA = prosegue dopo il blocco.
// È un aiuto per trovare i punti da leggere: prima di scrivere uno step, leggi comunque lo script intorno alla riga.
const fs = require("fs");
const path = require("path");
const { FONTI } = require("./comune");
const file = path.join(FONTI, process.argv[2]);
const da = +(process.argv[3] || 1), a = +(process.argv[4] || 1e9);
const L = fs.readFileSync(file, "utf8").split(/\r?\n/);
const INTESTAZIONE = /^([a-z_0-9@-]+,\d+,\d+,\d+|-)\t(script|duplicate)/;
const EFFETTO = /\b(set\s+[a-zA-Z_0-9]+\s*,\s*[^;]+|setquest\s+\d+|changequest\s+[\d, ]+|completequest\s+\d+|erasequest\s+\d+|delitem\s+[^;]+|getitem\s+[^;]+|warp\s+"[^"]+"[^;]*|percentheal\s+[^;]+|monster\s+"[^"]+"[^;]*|getexp\s+[^;]+|Zeny\s*[-+]?=[^;]*|callfunc\s+"[^"]+"|sc_start[^;]*|goto\s+\w+|callsub\s+\w+|instance_create[^;]*)/g;
const rientro = s => s.match(/^\t*/)[0].length;
function esamina(i0, i1) {
  const eff = [];
  let fine = "CONTINUA";
  for (let j = i0; j < i1; j++) { const e = L[j].match(EFFETTO); if (e) eff.push(...e.map(x => x.trim())); }
  for (let j = i1 - 1; j >= i0; j--) {
    const t = L[j].trim();
    if (!t || t === "}") continue;
    if (/^(close|end|close2)\s*;/.test(t)) fine = "CHIUDE";
    break;
  }
  return (eff.length ? eff.join(" ; ") : "-") + " [" + fine + "]";
}
let npc = "";
for (let i = 0; i < L.length; i++) {
  if (INTESTAZIONE.test(L[i])) npc = L[i].split("\t").filter((x, k) => k !== 1 && k !== 3).join(" ").slice(0, 60);
  if (i + 1 < da || i + 1 > a) continue;
  const m = L[i].match(/select\("([^"]*)"\)/);
  if (!m) continue;
  const opzioni = m[1].split(":");
  const k = rientro(L[i]);
  const righe = [];
  if (/switch\s*\(\s*select/.test(L[i])) {
    const inizi = [];
    let j = i + 1;
    for (; j < Math.min(L.length, i + 600); j++) {
      const c = L[j].match(/^\t*case\s+(\d+)\s*:/);
      if (c && rientro(L[j]) === k) { inizi.push([+c[1], j + 1]); continue; }
      if (rientro(L[j]) === k && /^\t*\}/.test(L[j])) break;
      if (rientro(L[j]) < k && L[j].trim()) break;
    }
    inizi.forEach(([n, i0], x) => righe.push("   [" + n + "] " + (opzioni[n - 1] || "?") + " => " + esamina(i0, x + 1 < inizi.length ? inizi[x + 1][1] - 1 : j)));
  } else {
    const c = L[i].match(/select\("[^"]*"\)\s*==\s*(\d+)/);
    let j = i + 1;
    while (j < L.length && !(rientro(L[j]) === k && /^\t*\}/.test(L[j]))) j++;
    if (c) righe.push("   [" + c[1] + "] " + opzioni[c[1] - 1] + " => " + esamina(i + 1, j), "   [altre] => proseguono dopo il blocco");
    else righe.push("   opzioni: " + opzioni.join(" | ") + "   (una sola opzione, o il valore è usato dopo)");
  }
  console.log("riga " + (i + 1) + "  " + npc + "\n" + righe.join("\n"));
}
