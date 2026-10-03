/**
 * Rigenera i PNG dell'icona a partire da `icon.svg`.
 *
 * L'icona della scheda del browser e' `icon.svg` cosi' com'e'. I timer, che si
 * installano come applicazione, hanno bisogno anche di due PNG con il fondo
 * pieno e il disegno al centro, perche' il sistema li ritaglia a cerchio o a
 * quadrato arrotondato. Vanno rigenerati ogni volta che cambia il disegno.
 *
 * Il disegno passa da un canvas in Edge senza finestra: nessuna dipendenza.
 *
 * Uso:
 *   node tools/make-icons.mjs
 */

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const BACKGROUND = "#e6ebe2";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const svg = readFileSync(join(root, "icon.svg"), "utf-8");
const drawing = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
// Al 70% il disegno resta dentro la zona che nessun ritaglio taglia.
const padded =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">` +
  `<rect width="512" height="512" fill="${BACKGROUND}"/>` +
  `<g transform="translate(256 262) scale(0.7) translate(-256 -262)">${drawing}</g></svg>`;

const outputs = [
  { size: 512, file: "timers/icons/icon-512.png" },
  { size: 192, file: "timers/icons/icon-192.png" },
];

const source = `data:image/svg+xml;base64,${Buffer.from(padded).toString("base64")}`;
const page = `<!doctype html><meta charset="utf-8"><body><script>
const image = new Image();
image.onload = () => {
  for (const size of ${JSON.stringify(outputs.map((output) => output.size))}) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    canvas.getContext("2d").drawImage(image, 0, 0, size, size);
    const pre = document.createElement("pre");
    pre.id = "png-" + size;
    pre.textContent = canvas.toDataURL("image/png");
    document.body.append(pre);
  }
};
image.src = "${source}";
</script>`;

const workDir = mkdtempSync(join(tmpdir(), "ragnarok-icons-"));
const pagePath = join(workDir, "icons.html");
writeFileSync(pagePath, page);
const result = spawnSync(
  EDGE,
  [
    "--headless",
    "--disable-gpu",
    "--no-first-run",
    `--user-data-dir=${join(workDir, "profile")}`,
    "--virtual-time-budget=4000",
    "--dump-dom",
    `file:///${pagePath.replace(/\\/g, "/")}`,
  ],
  { encoding: "utf-8", timeout: 90000, maxBuffer: 64 * 1024 * 1024 },
);
try {
  rmSync(workDir, { recursive: true, force: true });
} catch {
  // Edge puo' tenere ancora aperto il profilo: la cartella temporanea resta li'.
}
if (result.error) {
  console.error(`Edge non ha risposto: ${result.error.message}`);
  process.exit(1);
}

for (const { size, file } of outputs) {
  const match = (result.stdout ?? "").match(
    new RegExp(`<pre id="png-${size}">data:image/png;base64,([^<]+)</pre>`),
  );
  if (match === null) {
    console.error(`Immagine da ${size}px non generata.`);
    process.exit(1);
  }
  writeFileSync(join(root, file), Buffer.from(match[1], "base64"));
  console.log(`${file} scritto.`);
}
