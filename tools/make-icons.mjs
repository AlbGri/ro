/**
 * Rigenera da `icon.svg` le icone in PNG e in ICO.
 *
 * L'icona della scheda del browser e' `icon.svg` cosi' com'e'. I timer, che si
 * installano come applicazione, hanno bisogno anche di due PNG con il fondo
 * pieno e il disegno al centro, perche' il sistema li ritaglia a cerchio o a
 * quadrato arrotondato. L'applicazione desktop usa il disegno intero su fondo
 * trasparente: un PNG per la finestra e un ICO per l'eseguibile. Vanno
 * rigenerati ogni volta che cambia il disegno.
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
  { size: 512, padded: true, file: "timers/icons/icon-512.png" },
  { size: 192, padded: true, file: "timers/icons/icon-192.png" },
  { size: 256, padded: false, file: "timers/desktop/icon.png" },
];
// Le misure che Windows chiede a un eseguibile, dalla barra del titolo a Esplora file.
const ICO_FILE = "timers/desktop/icon.ico";
const ICO_SIZES = [16, 24, 32, 48, 64, 256];

const images = [
  ...outputs.map(({ size, padded: full }) => ({ size, padded: full })),
  ...ICO_SIZES.map((size) => ({ size, padded: false })),
];
const imageId = ({ size, padded: full }) => `png-${full ? "padded" : "plain"}-${size}`;

const dataUrl = (text) => `data:image/svg+xml;base64,${Buffer.from(text).toString("base64")}`;
const page = `<!doctype html><meta charset="utf-8"><body><script>
const sources = { padded: "${dataUrl(padded)}", plain: "${dataUrl(svg)}" };
const images = ${JSON.stringify(images.map((image) => ({ ...image, id: imageId(image) })))};
let pending = images.length;
for (const { id, size, padded } of images) {
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    canvas.getContext("2d").drawImage(image, 0, 0, size, size);
    const pre = document.createElement("pre");
    pre.id = id;
    pre.textContent = canvas.toDataURL("image/png");
    document.body.append(pre);
  };
  image.src = padded ? sources.padded : sources.plain;
}
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

function readPng(image) {
  const match = (result.stdout ?? "").match(
    new RegExp(`<pre id="${imageId(image)}">data:image/png;base64,([^<]+)</pre>`),
  );
  if (match === null) {
    console.error(`Immagine ${imageId(image)} non generata.`);
    process.exit(1);
  }
  return Buffer.from(match[1], "base64");
}

/**
 * Impacchetta dei PNG in un file ICO: Windows li accetta cosi' da Vista in poi.
 *
 * @param {Array<{size: number, data: Buffer}>} pngs Immagini quadrate.
 * @returns {Buffer} Il file ICO.
 */
function makeIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const directory = Buffer.alloc(16 * pngs.length);
  let offset = header.length + directory.length;
  pngs.forEach(({ size, data }, index) => {
    const entry = index * 16;
    // 0 vuol dire 256: il campo e' di un byte.
    directory.writeUInt8(size % 256, entry);
    directory.writeUInt8(size % 256, entry + 1);
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(data.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, directory, ...pngs.map(({ data }) => data)]);
}

for (const output of outputs) {
  writeFileSync(join(root, output.file), readPng(output));
  console.log(`${output.file} scritto.`);
}
const icoImages = ICO_SIZES.map((size) => ({ size, data: readPng({ size, padded: false }) }));
writeFileSync(join(root, ICO_FILE), makeIco(icoImages));
console.log(`${ICO_FILE} scritto.`);
