// Il motore deve dare, su ogni build registrata, gli stessi risultati del calcolatore di
// Thrice. Le build (indirizzo e testo di ogni risultato) le ha registrate il banco di prova
// in _local/prova_calcolatore, facendo girare l'originale; ogni lotto e' stato ricaricato in
// ordine in una pagina nuova, e cosi' si ricarica qui, un lotto per thread.
import { test } from "node:test";
import assert from "node:assert/strict";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { creaMotore } from "./motore.mjs";
import { caricaBuild, istantanea, differenze } from "./riferimento.mjs";

if (isMainThread) {
  const { lotti } = JSON.parse(gunzipSync(readFileSync(new URL("riferimento.json.gz", import.meta.url))));
  test("stessi risultati dell'originale su " + lotti.reduce((s, l) => s + l.length, 0) + " build", async () => {
    const esiti = await Promise.all(lotti.map((lotto) => new Promise((ok, ko) => {
      const w = new Worker(new URL(import.meta.url), { workerData: lotto });
      w.once("message", ok);
      w.once("error", ko);
    })));
    const diversi = esiti.flatMap((e, l) => e.map((x) => ({ lotto: l, ...x })));
    assert.deepEqual(diversi.slice(0, 5), []);
  });
} else {
  const m = creaMotore();
  const esito = [];
  for (const [k, caso] of workerData.entries()) {
    try {
      caricaBuild(m, caso.url, caso.kakutyou);
      const d = differenze(caso.risultati, istantanea(m));
      if (d.length) esito.push({ caso: k, url: caso.url, differenze: d.slice(0, 5) });
    } catch (e) {
      esito.push({ caso: k, url: caso.url, errore: String(e.stack).split("\n").slice(0, 3).join(" | ") });
    }
  }
  parentPort.postMessage(esito);
}
