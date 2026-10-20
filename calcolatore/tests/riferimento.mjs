// Ricarica una build dal suo indirizzo e legge i risultati, come il banco di prova
// dell'originale (stessi pannelli aperti, stessa voce di Other Info).
export const PANNELLI = ["BufSW", "Buf3SW", "Buf4SW", "Buf6SW", "Buf7SW", "Buf9SW", "Buf10SW", "debufSW", "EnemyBufSW"];
// descrizione dell'ultimo oggetto cliccato e titoli dei pannelli: interfaccia, non calcolo
export const IGNORATI = /^(item-disclosure|ITEM_TITLE|ITEM\d|ITEM_DATA|ITEM_W_LV|ITEM_LV|ITEM_WAIT|B_SETUMEI|A\w*TD|A\w*used)$/;

export function caricaBuild(m, url, kakutyou) {
  m.documento.getElementById("otherURL_TEXT").value = "x#" + url;
  m.URLIN(1);
  for (const p of PANNELLI) m[p](1);
  const c = m.documento.calcForm;
  c.A_Kakutyou.value = kakutyou;
  m.KakutyouKansuu2();
  m.StAllCalc();
  m.calc();
}

export function istantanea(m) {
  const d = m.documento, out = {};
  const escluso = (el) => {
    for (let n = el; n; n = n.padre) if (n.id === "build-comparison" || n.classList.contains("save-tools")) return true;
    return false;
  };
  const conControlli = (el) => el.figli.some((f) => f.tag && (f.tag === "select" || f.tag === "input" || conControlli(f)));
  for (const [id, l] of d.perId) {
    const el = l[0];
    if (/^(input|select|option|textarea|button)$/.test(el.tag) || conControlli(el) || escluso(el)) continue;
    const t = el.textContent.replace(/\s+/g, " ").trim();
    if (t) out[id] = t;
  }
  return out;
}

export function differenze(attesi, ottenuti) {
  const chiavi = new Set([...Object.keys(attesi), ...Object.keys(ottenuti)]);
  return [...chiavi].filter((id) => attesi[id] !== ottenuti[id] && id && !IGNORATI.test(id))
    .map((id) => ({ id, atteso: attesi[id], ottenuto: ottenuti[id] }));
}
