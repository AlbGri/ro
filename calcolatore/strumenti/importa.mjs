// Importa il calcolatore di Thrice (uaro-calc.xdthrice.workers.dev) nel motore.
// Uso: node strumenti/importa.mjs <cartella con index.html e src/> <cartella calcolatore>
// I file vengono formattati e gli accessi al DOM vero passano al documento finto di
// motore/forma.js: il calcolo resta quello originale.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { MODIFICHE } from "./modifiche.mjs";

const [origine, destinazione] = process.argv.slice(2);
if (!origine || !destinazione) throw new Error("uso: node strumenti/importa.mjs <origine> <calcolatore>");
export const FILE = ["constants", "skill", "head", "item", "etc", "monster", "card", "foot"];

const SOSTITUZIONI = [
  [/\bdocument\./g, "documento."],
  [/\bnew Option\(/g, "new documento.Opzione("],
  [/\blocalStorage\b/g, "memoriaMotore"],
  [/\bwindow\.location\.replace\(/g, "posizioneMotore.replace("],
  [/\blocation\.href\b/g, "posizioneMotore.href"],
  [/\bnavigator\.clipboard\.writeText\(/g, "appuntiMotore("],
  [/\bwindow\.confirm\(/g, "confermaMotore("],
  [/(^|[^.\w])alert\(/g, "$1avvisoMotore("],
  [/(^|[^.\w])otherURL_TEXT\.value/g, '$1documento.getElementById("otherURL_TEXT").value'],
];

function trasforma(testo) {
  for (const [re, con] of SOSTITUZIONI) testo = testo.replace(re, con);
  if (/\bdocument\b|\bOption\(|\blocalStorage\b/.test(testo)) throw new Error("accesso al DOM rimasto");
  return testo;
}

const prettier = (file) => execSync(`npx --yes prettier@3 --print-width 100 --write "${file}"`, { stdio: "ignore" });
mkdirSync(join(destinazione, "motore"), { recursive: true });
for (const f of FILE) {
  const sorgente = readFileSync(join(origine, "src", f + ".js"), "utf8");
  const uscita = join(destinazione, "motore", f + ".js");
  writeFileSync(uscita, trasforma(sorgente));
  prettier(uscita);
}

// correzioni per uaRO al codice: ognuna deve trovare il suo punto una volta sola
const toccati = new Set();
for (const m of MODIFICHE) {
  const file = join(destinazione, "motore", m.file);
  const testo = readFileSync(file, "utf8");
  const volte = testo.split(m.cerca).length - 1;
  if (volte !== 1) throw new Error(`modifica non applicabile (${volte} punti): ${m.motivo}`);
  writeFileSync(file, testo.replace(m.cerca, () => m.sostituisci));
  toccati.add(file);
}
for (const file of toccati) prettier(file);

// lo scheletro della pagina originale: campi, opzioni iniziali, gestori, elementi per id
const html = readFileSync(join(origine, "index.html"), "utf8");
const corpo = html.slice(html.indexOf("<form"), html.lastIndexOf("</form>") + 7)
  .replace(/<script\b[\s\S]*?<\/script>/g, "");
writeFileSync(join(destinazione, "motore", "pagina.js"),
  "// Scheletro della pagina del calcolatore di Thrice, generato da strumenti/importa.mjs:\n" +
  "// i campi e gli elementi che il motore si aspetta di trovare.\n" +
  "var PAGINA_MOTORE = " + JSON.stringify(trasforma(corpo)) + ";\n");
console.log("importati", FILE.length, "file e lo scheletro della pagina, con", MODIFICHE.length, "modifiche per uaRO");
