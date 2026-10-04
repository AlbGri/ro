// Prova la pagina vera in Edge senza finestra, su una copia che non tocca i dati dell'utente.
//   node strumenti/prova_pagina.js prova.js
//   node strumenti/prova_pagina.js prova.js --foto foto.png --finestra 1280,1500 --query "tema=scuro"
// prova.js è codice che gira dentro la pagina, dopo il suo script. Per avere un risultato chiama esito("testo")
// una o più volte: le righe vengono stampate qui. Con --foto salva invece uno screenshot (senza scroll: per
// inquadrare una fase nascondi le altre da prova.js, perché lo scroll negli screenshot senza finestra non funziona;
// la finestra non scende sotto i 500 px di larghezza). --query aggiunge parametri all'indirizzo, letti da prova.js
// con new URLSearchParams(location.search). --semina dati.json mette nel localStorage della copia, prima che la
// pagina parta, il contenuto del file (lo stato salvato così come lo scrive la pagina, oppure un backup): serve a
// provare la conversione di spunte e note salvate con gli id vecchi.
// La copia usa un'altra chiave di localStorage, conferma da sola i confirm() e sostituisce la copia negli appunti
// e i download, che senza finestra restano appesi: il testo copiato finisce in window.appunti, i nomi dei file
// scaricati in window.scaricati.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { GUIDA } = require("./comune");

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const args = process.argv.slice(2);
const opz = nome => { const i = args.indexOf("--" + nome); return i < 0 ? null : args.splice(i, 2)[1]; };
const foto = opz("foto"), finestra = opz("finestra") || "1280,1500", query = opz("query"), semina = opz("semina");
if (!args[0]) { console.log("Uso: node strumenti/prova_pagina.js prova.js [--foto foto.png] [--finestra 1280,1500] [--query a=b]"); process.exit(1); }

const prima = [
  'window.confirm = function () { return true; };',
  'window.appunti = null; window.scaricati = [];',
  'try { Object.defineProperty(navigator, "clipboard", { value: { writeText: function (t) { window.appunti = t; return Promise.resolve(); } }, configurable: true }); } catch (e) {}',
  'HTMLAnchorElement.prototype.click = function () { if (this.download) window.scaricati.push(this.download); };',
  'window.esito = function (t) { document.getElementById("esito").textContent += String(t) + String.fromCharCode(10); };',
  'window.addEventListener("error", function (e) { window.esito("ERRORE: " + e.message); });',
  // Ogni prova parte da zero, oppure dai dati salvati di --semina (per provare la conversione di dati vecchi).
  'try { ["", "-ids1", "-ids2", "-ids3", "-ids4"].forEach(function (x) { localStorage.removeItem("uaro-nw-guide-PROVA" + x); }); localStorage.removeItem("ragnarok/theme-PROVA"); } catch (e) {}',
  semina ? 'try { localStorage.setItem("uaro-nw-guide-PROVA", ' + JSON.stringify(fs.readFileSync(semina, "utf8").trim()) + '); } catch (e) {}' : ''
].join("\n");
let html = fs.readFileSync(GUIDA, "utf8");
if (!html.includes('const STORAGE_KEY = "uaro-nw-guide";')) throw new Error("STORAGE_KEY non trovato nella guida");
html = html.replace('const STORAGE_KEY = "uaro-nw-guide";', 'const STORAGE_KEY = "uaro-nw-guide-PROVA";');
// Anche il tema ha la sua chiave di prova: quella vera vale per tutto il sito.
if (!html.includes('const THEME_KEY = "ragnarok/theme";')) throw new Error("THEME_KEY non trovato nella guida");
html = html.replace('const THEME_KEY = "ragnarok/theme";', 'const THEME_KEY = "ragnarok/theme-PROVA";');
// Le sostituzioni vanno prima del codice della pagina, la prova dopo.
html = html.replace("<body>", function () { return "<body><script>" + prima + "</script>"; });
const prova = fs.readFileSync(args[0], "utf8");
html = html.replace("</body>", function () { return '<pre id="esito" style="display:none"></pre><script>' + prova + "\n</script></body>"; });
const cartella = fs.mkdtempSync(path.join(os.tmpdir(), "uaro-prova-"));
const copia = path.join(cartella, "prova.html");
fs.writeFileSync(copia, html);
const url = "file:///" + copia.replace(/\\/g, "/") + (query ? "?" + query : "");

const comuni = ["--headless", "--disable-gpu", "--virtual-time-budget=6000", "--window-size=" + finestra];
const r = spawnSync(EDGE, comuni.concat(foto ? ["--hide-scrollbars", "--screenshot=" + path.resolve(foto), url] : ["--dump-dom", url]), { encoding: "utf8", timeout: 90000, maxBuffer: 64 * 1024 * 1024 });
fs.rmSync(cartella, { recursive: true, force: true });
if (r.error) { console.log("Edge non ha risposto: " + r.error.message); process.exit(1); }
if (foto) { console.log(fs.existsSync(foto) ? "Screenshot salvato in " + foto : "Screenshot non creato"); process.exit(fs.existsSync(foto) ? 0 : 1); }
const m = (r.stdout || "").match(/<pre id="esito"[^>]*>([\s\S]*?)<\/pre>/);
if (!m) { console.log("La pagina non ha prodotto un risultato (errore nel codice della pagina o della prova?)"); process.exit(1); }
const testo = m[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&").trim();
console.log(testo || "(la prova non ha chiamato esito)");
process.exit(/^ERRORE/m.test(testo) ? 1 : 0);
