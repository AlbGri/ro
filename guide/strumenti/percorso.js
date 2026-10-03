// Ordina dei punti di una mappa nel giro a piedi più corto, partendo da una cella.
//   node strumenti/percorso.js man_fild01 36/235 180/170 147/157 114/174
// Con --fisso mostra invece le distanze lungo l'ordine dato (per confrontare due ordini).
// Le distanze sono celle percorse a piedi, calcolate sulle celle calpestabili della mappa.
const { mappa, distanze } = require("./comune");
const arg = process.argv.slice(2);
const fisso = arg.includes("--fisso");
const [nome, ...punti] = arg.filter(a => a !== "--fisso");
const m = mappa(nome);
if (!m) { console.log("Mappa non trovata: " + nome); process.exit(1); }
const P = punti.map(p => p.split("/").map(Number));
const W = m.xs;
const D = P.map(([x, y]) => { const d = distanze(m, x, y); return P.map(([a, b]) => d[a + b * W]); });
const n = P.length;

let ordine;
if (fisso) {
  ordine = P.map((_, i) => i).slice(1);
} else {
  if (n > 16) { console.log("Troppi punti (massimo 15 oltre la partenza)."); process.exit(1); }
  const TUTTI = 1 << (n - 1);
  const dp = Array.from({ length: TUTTI }, () => new Array(n).fill(Infinity));
  const prec = Array.from({ length: TUTTI }, () => new Array(n).fill(-1));
  for (let k = 1; k < n; k++) if (D[0][k] >= 0) dp[1 << (k - 1)][k] = D[0][k];
  for (let mask = 1; mask < TUTTI; mask++) for (let k = 1; k < n; k++) {
    if (!(mask & (1 << (k - 1))) || dp[mask][k] === Infinity) continue;
    for (let j = 1; j < n; j++) {
      if (mask & (1 << (j - 1)) || D[k][j] < 0) continue;
      const nm = mask | (1 << (j - 1)), v = dp[mask][k] + D[k][j];
      if (v < dp[nm][j]) { dp[nm][j] = v; prec[nm][j] = k; }
    }
  }
  let migliore = Infinity, ultimo = -1;
  for (let k = 1; k < n; k++) if (dp[TUTTI - 1][k] < migliore) { migliore = dp[TUTTI - 1][k]; ultimo = k; }
  ordine = [];
  let mask = TUTTI - 1;
  while (ultimo > 0) { ordine.unshift(ultimo); const p = prec[mask][ultimo]; mask &= ~(1 << (ultimo - 1)); ultimo = p; }
}
let tot = 0, da = 0;
ordine.forEach(k => {
  const d = D[da][k];
  tot += d;
  console.log(nome + " " + P[k].join("/") + "   +" + d + " celle (totale " + tot + ")" + (d < 0 ? "   NON RAGGIUNGIBILE" : ""));
  da = k;
});
