// Aggiorna i risultati attesi di tests/riferimento.json.gz con quelli del motore attuale,
// stampando ogni build che cambia. Va usato solo dopo aver controllato che le differenze siano
// quelle volute (per esempio una correzione per uaRO), con: node strumenti/aggiorna-riferimento.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { gunzipSync, gzipSync } from "node:zlib";
import { creaMotore } from "../tests/motore.mjs";
import { caricaBuild, istantanea, differenze, IGNORATI } from "../tests/riferimento.mjs";

const file = new URL("../tests/riferimento.json.gz", import.meta.url);
const dati = JSON.parse(gunzipSync(readFileSync(file)));
let cambiate = 0;
for (const [l, lotto] of dati.lotti.entries()) {
  const m = creaMotore();
  for (const [k, caso] of lotto.entries()) {
    caricaBuild(m, caso.url, caso.kakutyou);
    const ora = Object.fromEntries(Object.entries(istantanea(m)).filter(([id]) => id && !IGNORATI.test(id)));
    const d = differenze(caso.risultati, ora);
    if (!d.length) continue;
    cambiate++;
    console.log(`lotto ${l} caso ${k}: ` + d.map((x) => `${x.id} ${JSON.stringify(x.atteso)} -> ${JSON.stringify(x.ottenuto)}`).join("; "));
    caso.risultati = ora;
  }
}
dati.aggiornato = new Date().toISOString().slice(0, 10);
writeFileSync(file, gzipSync(JSON.stringify(dati), { level: 9 }));
console.log(`${cambiate} build aggiornate`);
