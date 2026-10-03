/**
 * Imposta il codice di accesso del sito.
 *
 * Scrive in `gate.js` solo l'impronta SHA-256 del codice, mai il codice.
 * Con `--clear` rimuove il codice e lascia il sito aperto.
 *
 * Uso:
 *   node tools/set-access-code.mjs "codice"
 *   node tools/set-access-code.mjs --clear
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const gatePath = join(dirname(fileURLToPath(import.meta.url)), "..", "gate.js");
const argument = process.argv[2];

if (argument === undefined) {
  console.error('Uso: node tools/set-access-code.mjs "codice" | --clear');
  process.exit(1);
}

// Il confronto nel browser normalizza allo stesso modo: niente spazi ai bordi,
// niente distinzione fra maiuscole e minuscole.
const hash =
  argument === "--clear"
    ? ""
    : createHash("sha256").update(argument.trim().toLowerCase()).digest("hex");

const source = readFileSync(gatePath, "utf-8");
const updated = source.replace(/const ACCESS_HASH = "[^"]*";/, `const ACCESS_HASH = "${hash}";`);
if (updated === source) {
  console.error("Impronta non trovata in gate.js: il file e' stato modificato a mano?");
  process.exit(1);
}
writeFileSync(gatePath, updated, "utf-8");

console.log(
  hash === ""
    ? "Codice rimosso: il sito e' aperto a tutti."
    : `Codice impostato. Impronta: ${hash.slice(0, 16)}...`,
);
