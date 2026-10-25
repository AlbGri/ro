/**
 * Scarica da GoatCounter le statistiche del sito e le scrive in un file JSON, che la pagina
 * `statistiche/` legge dal ramo `statistiche` del repository.
 *
 * Lo lancia ogni ora l'azione `.github/workflows/statistiche.yml`, con il token nel segreto
 * `GOATCOUNTER_TOKEN` del repository (solo lettura delle statistiche, solo il sito rotools):
 * il token non entra mai nel sito.
 *
 *   GOATCOUNTER_TOKEN=... node tools/statistiche.mjs <file di uscita>
 */
import { writeFileSync } from "node:fs";

const API = "https://rotools.goatcounter.com/api/v0";
// il primo giorno contato
const INIZIO = "2026-10-25T00:00:00Z";
const PERIODI = { 7: 7, 30: 30, tutto: null };
const SUDDIVISIONI = {
  browser: "browsers",
  sistemi: "systems",
  paesi: "locations",
  lingue: "languages",
  schermi: "sizes",
  provenienze: "toprefs",
};

const token = process.env.GOATCOUNTER_TOKEN;
const uscita = process.argv[2];
if (!token) throw new Error("Manca GOATCOUNTER_TOKEN");
if (!uscita) throw new Error("Uso: node tools/statistiche.mjs <file di uscita>");

const pausa = (ms) => new Promise((ok) => setTimeout(ok, ms));

/** Una richiesta all'API; il limite e' di 4 al secondo, quindi si va piano e si riprova. */
async function chiedi(percorso, parametri) {
  const url = `${API}${percorso}?${new URLSearchParams(parametri)}`;
  for (let tentativo = 1; ; tentativo++) {
    await pausa(300);
    const risposta = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (risposta.ok) return risposta.json();
    if (risposta.status === 429 && tentativo < 5) {
      await pausa(1000 * (Number(risposta.headers.get("X-Rate-Limit-Reset")) || 1));
      continue;
    }
    throw new Error(`${percorso}: ${risposta.status} ${await risposta.text()}`);
  }
}

// le date all'ora piena, come vuole l'API
const ora = (data) => new Date(Math.floor(data / 3600e3) * 3600e3).toISOString().replace(".000", "");

async function periodo(giorni, fine) {
  const inizio = giorni ? ora(fine - giorni * 86400e3) : INIZIO;
  const intervallo = { start: inizio, end: ora(fine + 3600e3) };

  const totale = await chiedi("/stats/total", intervallo);
  // pagine ed eventi, a blocchi: "more" dice che ce ne sono altri, esclusi quelli gia' letti
  const voci = [];
  for (let altre = true; altre; ) {
    const r = await chiedi("/stats/hits", {
      ...intervallo,
      limit: 100,
      ...(voci.length && { exclude_paths: voci.map((v) => v.path_id).join(",") }),
    });
    voci.push(...r.hits);
    altre = r.more && r.hits.length > 0;
  }
  const elenco = (filtro) =>
    voci
      .filter(filtro)
      .map((v) => ({ nome: v.path, titolo: v.title, visite: v.count }))
      .sort((a, b) => b.visite - a.visite);

  const dati = {
    inizio,
    visite: totale.total,
    eventi: totale.total_events,
    giorni: totale.stats.map((g) => ({ giorno: g.day, visite: g.daily })),
    pagine: elenco((v) => !v.event),
    azioni: elenco((v) => v.event),
  };
  for (const [nome, pagina] of Object.entries(SUDDIVISIONI)) {
    const r = await chiedi(`/stats/${pagina}`, { ...intervallo, limit: 20 });
    dati[nome] = r.stats.map((s) => ({ id: s.id, nome: s.name, visite: s.count }));
  }
  return dati;
}

const fine = Date.now();
const statistiche = { aggiornato: new Date(fine).toISOString(), periodi: {} };
for (const [nome, giorni] of Object.entries(PERIODI)) {
  statistiche.periodi[nome] = await periodo(giorni, fine);
}
writeFileSync(uscita, JSON.stringify(statistiche));
console.log(`Statistiche scritte in ${uscita}: ${statistiche.periodi.tutto.visite} visite in tutto`);
