// Carica il motore in un contesto separato di Node, come lo carica la pagina.
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const ORDINE = ["forma", "pagina", "avvio", "constants", "skill", "head", "item", "etc", "monster", "card", "uaro", "foot"];
const CARTELLA = fileURLToPath(new URL("../motore/", import.meta.url));

export function creaMotore() {
  const ctx = vm.createContext({ console, setTimeout: () => 0, clearTimeout: () => {} });
  ctx.window = ctx;
  for (const f of ORDINE) vm.runInContext(readFileSync(CARTELLA + f + ".js", "utf8"), ctx, { filename: f + ".js" });
  return ctx;
}
