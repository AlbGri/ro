// Funzioni comuni agli strumenti della guida uaRO. Leggono solo file locali (cartella fonti).
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const RADICE = path.join(__dirname, "..");
const GUIDA = path.join(RADICE, "nuovo-mondo.html");
const FONTI = path.join(RADICE, "fonti");

// ---- Guida ----
function leggiGuida(file) {
  const src = fs.readFileSync(file || GUIDA, "utf8");
  const script = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const dati = new Function(script[0] + ";return {GUIDE_VERSION, STORAGE_KEY, QUESTS, PHASES, ID_MAP_V2};")();
  return Object.assign({ src, script }, dati);
}

const ORDINE_CAMPI = ["d", "navi", "copy", "tip", "warn", "verify"];
const J = JSON.stringify;
function stepSrc(s) {
  const testa = "{ id: " + J(s.id) + ", q: " + J(s.q) + (s.opt ? ", opt: true" : "") + (s.hidden ? ", hidden: true" : "") + (s.group ? ", group: " + J(s.group) : "") + ", h: " + J(s.h);
  const resto = ORDINE_CAMPI.filter(k => s[k] !== undefined).map(k => {
    if (k === "copy") return "copy: [" + s.copy.map(g => "{ label: " + J(g.label) + ", items: " + J(g.items) + " }").join(", ") + "]";
    return k + ": " + J(s[k]);
  });
  if (!resto.length) return "      " + testa + " }";
  return "      " + testa + ",\n        " + resto.join(",\n        ") + " }";
}
// Riscrive il blocco PHASES nel file, nello stesso formato, e aggiorna la versione se indicata.
function scriviGuida(src, PHASES, versione, file) {
  const inizio = src.indexOf("const PHASES = [");
  const fine = src.indexOf("];\n\n</script>", inizio);
  if (inizio < 0 || fine < 0) throw new Error("Blocco PHASES non trovato");
  const corpo = PHASES.map(p => "  {\n    id: " + J(p.id) + ", branch: " + J(p.branch) + (p.hidden ? ", hidden: true" : "") + (p.opt ? ", opt: true" : "") + (p.page ? ", page: " + J(p.page) : "") + ", title: " + J(p.title) + ", where: " + J(p.where) + ",\n" +
    (p.sum ? "    sum: " + J(p.sum) + ",\n" : "") +
    (p.when ? "    when: " + J(p.when) + ",\n" : "") +
    "    intro: " + J(p.intro) + ",\n    steps: [\n" + p.steps.map(stepSrc).join(",\n") + "\n    ]\n  }").join(",\n");
  let out = src.slice(0, inizio) + "const PHASES = [\n" + corpo + "\n" + src.slice(fine);
  if (versione) out = out.replace(/const GUIDE_VERSION = "[^"]+";/, 'const GUIDE_VERSION = "' + versione + '";');
  fs.writeFileSync(file || GUIDA, out);
}

// ---- Mappe (map cache di rAthena): quali celle sono calpestabili ----
let mappe = null;
function caricaMappe() {
  if (mappe) return mappe;
  mappe = {};
  ["map_cache.dat", "map_cache_prere.dat"].forEach(nome => {
    const b = fs.readFileSync(path.join(FONTI, nome));
    const n = b.readUInt16LE(4);
    let o = 8;
    for (let i = 0; i < n; i++) {
      const nomeMappa = b.toString("latin1", o, o + 12).replace(/\0.*$/, "");
      const xs = b.readInt16LE(o + 12), ys = b.readInt16LE(o + 14), len = b.readInt32LE(o + 16);
      mappe[nomeMappa] = { xs, ys, dati: b.subarray(o + 20, o + 20 + len), celle: null };
      o += 20 + len;
    }
  });
  return mappe;
}
function mappa(nome) {
  const m = caricaMappe()[nome];
  if (!m) return null;
  if (!m.celle) m.celle = zlib.inflateSync(m.dati);
  return m;
}
function calpestabile(m, x, y) {
  if (x < 0 || y < 0 || x >= m.xs || y >= m.ys) return false;
  const t = m.celle[x + y * m.xs];
  return t === 0 || t === 3;
}
function cellaVicina(m, x, y) {
  for (let r = 1; r <= 12; r++) {
    let migliore = null;
    for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
      if (calpestabile(m, x + dx, y + dy)) {
        const d = dx * dx + dy * dy;
        if (!migliore || d < migliore.d) migliore = { x: x + dx, y: y + dy, d };
      }
    }
    if (migliore) return migliore;
  }
  return null;
}
// Distanze a piedi (in celle) da un punto a tutte le celle della mappa.
function distanze(m, sx, sy) {
  const W = m.xs, H = m.ys;
  const d = new Int32Array(W * H).fill(-1);
  const q = [sx + sy * W];
  d[q[0]] = 0;
  for (let h = 0; h < q.length; h++) {
    const i = q[h], x = i % W, y = (i / W) | 0;
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      if (!dx && !dy) continue;
      const nx = x + dx, ny = y + dy;
      if (!calpestabile(m, nx, ny)) continue;
      if (dx && dy && (!calpestabile(m, x + dx, y) || !calpestabile(m, x, y + dy))) continue;
      const j = nx + ny * W;
      if (d[j] < 0) { d[j] = d[i] + 1; q.push(j); }
    }
  }
  return d;
}

module.exports = { RADICE, GUIDA, FONTI, leggiGuida, scriviGuida, mappa, calpestabile, cellaVicina, distanze };
