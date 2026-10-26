// Ricarica una build dal suo indirizzo e legge i risultati, come il banco di prova
// dell'originale (stessi pannelli aperti, stessa voce di Other Info).
export const PANNELLI = ["BufSW", "Buf3SW", "Buf4SW", "Buf6SW", "Buf7SW", "Buf9SW", "Buf10SW", "debufSW", "EnemyBufSW"];
// descrizione dell'ultimo oggetto cliccato e segni "attivo" dei pannelli: interfaccia, non calcolo
export const IGNORATI = /^(ITEM_TITLE|ITEM\d|ITEM_DATA|ITEM_W_LV|ITEM_LV|ITEM_WAIT|B_SETUMEI|A\w*used)$/;

export function caricaBuild(m, url, kakutyou) {
  m.leggiBuild(url);
  for (const p of PANNELLI) m[p](1);
  const c = m.c;
  c.A_Kakutyou.value = kakutyou;
  m.preparaAltreInfo();
  m.StAllCalc();
  m.calc();
}

export function istantanea(m) {
  const out = {};
  for (const id in m.uscite) {
    const t = m.testo(id);
    if (t) out[id] = t;
  }
  return out;
}

export function differenze(attesi, ottenuti) {
  const chiavi = new Set([...Object.keys(attesi), ...Object.keys(ottenuti)]);
  return [...chiavi].filter((id) => attesi[id] !== ottenuti[id] && id && !IGNORATI.test(id))
    .map((id) => ({ id, atteso: attesi[id], ottenuto: ottenuti[id] }));
}
