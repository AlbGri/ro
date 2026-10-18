/**
 * Pagina dei livelli: legge il modulo, calcola il piano e lo disegna.
 *
 * Quello che si scrive nel modulo resta in questo browser, nella chiave
 * `ragnarok-livelli/stato`, con il prefisso del servizio come chiede il sito.
 */

import { calcolaPiano, jobMassimo, moltiplicatore, percentualeDi, percentualeJob, seguiJob } from "./calcolo.js";
import { CACCE, EXP_NORMALE, EXP_RINATO, MANUALE, QUEST, UCCISIONI_PER_CONSEGNA } from "./dati.js";

const STORAGE_KEY = "ragnarok-livelli/stato";

const form = document.getElementById("form");
const pianoEl = document.getElementById("piano");

const numero = (n) => Math.round(n).toLocaleString("it-IT");
const percento = (p) => p.toLocaleString("it-IT", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const escape = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// ------------------------------------------------------------- oggetti ---

document.getElementById("items").innerHTML =
  `<div class="item head"><span>Oggetto</span><span>Quest</span><span>Ne ho</span><span>Prezzo (zeny)</span></div>` +
  QUEST.map(
    (q) => `
    <div class="item" data-quest="${q.id}">
      <div><span class="name">${escape(q.oggetto)}</span> <span class="sub">${q.quantita} a consegna</span></div>
      <div class="sub sub-npc">${escape(q.npc)}, livelli ${q.min}-${q.max}</div>
      <label class="mobile" data-label="Ne ho">
        <input type="number" name="posseduti-${q.id}" min="0" step="1" placeholder="0" aria-label="${escape(q.oggetto)} che hai">
      </label>
      <label class="mobile" data-label="Prezzo (zeny)">
        <input type="number" name="prezzo-${q.id}" min="0" step="1" placeholder="${q.prezzo}"
          aria-label="Prezzo di una ${escape(q.oggetto)}">
      </label>
      <span class="npc-price">${q.negozio ? `prezzo NPC${q.senzaDiscount ? ` con Discount, ${q.senzaDiscount} senza` : ""}` : "stima, metti quello del mercato"}</span>
    </div>`,
  ).join("");

document.getElementById("cacce").innerHTML = CACCE.map(
  (c) => `
    <label class="field"><span>${escape(c.mostro)} (${escape(c.npc)}, si prende ai livelli ${c.min}-${c.max})</span>
      <select name="caccia-${c.id}">
        <option value="0">Nessuna</option>
        ${[1, 2, 3].map((n) => `<option value="${n}">${n * UCCISIONI_PER_CONSEGNA} uccisi</option>`).join("")}
      </select>
    </label>`,
).join("");

// ----------------------------------------------------------- salvataggio ---

function salva() {
  const stato = {};
  for (const el of form.elements) {
    if (!el.name) continue;
    if (el.type === "radio") {
      if (el.checked) stato[el.name] = el.value;
    } else {
      stato[el.name] = el.type === "checkbox" ? el.checked : el.value;
    }
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stato));
  } catch {
    // Senza localStorage il modulo vale per questa sola apertura.
  }
}

function ripristina() {
  let stato;
  try {
    stato = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return;
  }
  if (stato) applica(stato);
}

/** Rimette nel modulo le scelte salvate. */
function applica(stato) {
  for (const el of form.elements) {
    if (!el.name || !(el.name in stato)) continue;
    if (el.type === "radio") el.checked = el.value === stato[el.name];
    else if (el.type === "checkbox") el.checked = stato[el.name];
    else el.value = stato[el.name];
  }
}

// --------------------------------------------------------------- lettura ---

const intero = (valore, minimo, massimo, predefinito) => {
  const n = Math.floor(Number(valore));
  if (valore === "" || !Number.isFinite(n)) return predefinito;
  return Math.min(massimo, Math.max(minimo, n));
};

/** Le scelte del modulo, gia' corrette nei limiti. */
function leggi() {
  const f = form.elements;
  const livello = intero(f.livello.value, 1, 98, 1);
  const percentuale = Math.min(99.9, Math.max(0, Number(f.percentuale.value) || 0));
  const oggetti = {};
  for (const q of QUEST) {
    const prezzo = f[`prezzo-${q.id}`].value;
    oggetti[q.id] = {
      posseduti: intero(f[`posseduti-${q.id}`].value, 0, 1e7, 0),
      prezzo: prezzo === "" ? null : Math.max(0, Number(prezzo) || 0),
    };
  }
  const rinato = form.querySelector('input[name="rinato"]:checked').value === "si";
  const classe = Number(f.classe.value);
  return {
    rinato,
    seconda: classe === 2,
    job: intero(f.job.value, 1, jobMassimo(rinato, classe), 1),
    cambioJob: intero(f.cambioJob.value, 40, 50, 50),
    livello,
    percentuale,
    obiettivo: intero(f.obiettivo.value, 2, 99, 84),
    weekend: f.weekend.checked,
    manuale: Number(f.manuale.value),
    cacce: Object.fromEntries(CACCE.map((c) => [c.id, Number(f[`caccia-${c.id}`].value)])),
    rabbocco: f.rabbocchi.checked ? intero(f.soglia.value, 1, 50, 10) : null,
    cambio: intero(f.cambio.value, 0, 1e9, 0),
    poringCoin: intero(f.poringCoin.value, 0, 1e9, 13000),
    manuali50: intero(f.manuali50.value, 0, 1000, MANUALE.gratis50),
    mezzore: intero(f.mezzore.value, 1, 1000, 1),
    oggetti,
  };
}

// --------------------------------------------------------------- disegno ---

const nomeClasse = (classe) => (classe === 1 ? "prima classe" : "seconda classe");
const statoJob = (rinato, s) => `${s.livello} (${percento(percentualeJob(rinato, s))}%)`;

const chip = (testo) => `<button class="chip" type="button" data-copy="${escape(testo)}">${escape(testo)}</button>`;

function disegnaPassi(passi, tabella, rinato) {
  const stato = (s) => `${s.livello} (${percento(percentualeDi(tabella, s))}%)`;
  const righe = passi.map((p) =>
    p.tipo === "rabbocco"
      ? `<li class="kill">mostri: da ${stato(p.da)} a ${stato(p.a)}</li>`
      : `<li>da ${stato(p.da)} a ${stato(p.a)}${p.persa > 0 ? `, persi ${numero(p.persa)} EXP` : ""}; job ${statoJob(rinato, p.job.a)}${p.job.persa > 0 ? `, persi ${numero(p.job.persa)} job EXP` : ""}</li>`,
  );
  return `<details class="steps"><summary>Consegna per consegna</summary><ol>${righe.join("")}</ol></details>`;
}

function disegnaTappa(numeroTappa, tappa, scelte, tabella) {
  const stato = (s) => `${s.livello} (${percento(percentualeDi(tabella, s))}%)`;
  const intervallo =
    `<div class="stage-range">Dal ${stato(tappa.da)} al ${stato(tappa.a)}</div>` +
    `<div class="stage-range">Job della ${nomeClasse(tappa.jobDa.classe)}: dal ${statoJob(scelte.rinato, tappa.jobDa)} al ${statoJob(scelte.rinato, tappa.jobA)}</div>`;
  const parti = [];
  let titolo;

  if (tappa.tipo === "quest") {
    const q = tappa.quest;
    titolo = `${q.oggetto} a ${q.npc}`;
    const totale = tappa.consegne * q.quantita;
    let testo = `${tappa.consegne} consegn${tappa.consegne === 1 ? "a" : "e"} da ${q.quantita} ${q.oggetto}: ${numero(totale)} oggetti.`;
    if (tappa.dallInventario > 0) testo += ` Ne usi ${numero(tappa.dallInventario)} dei tuoi.`;
    testo += tappa.comprati > 0
      ? ` Da comprare: ${numero(tappa.comprati)}, per ${numero(tappa.zeny)} zeny.`
      : " Non serve comprarne.";
    parti.push(`<p>${escape(testo)}</p>`);

    const chips = [`<span class="chip-label">${escape(q.npc)}</span>${chip(`/navi ${q.navi}`)}`];
    if (tappa.comprati > 0) {
      chips.push(
        q.negozio
          ? `<span class="chip-label">${escape(q.negozio.nome)}</span>${chip(`/navi ${q.negozio.navi}`)}`
          : `<span class="chip-label">Mercato</span>${chip(`@ws ${q.idOggetto}`)}`,
      );
    }
    parti.push(`<div class="chips">${chips.join("")}</div>`);
    if (q.citta) parti.push(`<p class="stage-range">Città da cui partire: ${escape(q.citta)} (da verificare).</p>`);
    if (tappa.rabbocchi > 0) {
      parti.push(
        `<p class="note-line tip"><strong>Mostri:</strong> quando al livello manca meno del ${scelte.rabbocco}%, uccidi qualche ${escape(q.mostro)} sulla mappa invece di consegnare. In questa tappa capita ${tappa.rabbocchi} volt${tappa.rabbocchi === 1 ? "a" : "e"}.</p>`,
      );
    }
  } else if (tappa.tipo === "caccia") {
    const c = tappa.caccia;
    titolo = `${c.mostro} a ${c.npc}`;
    parti.push(
      `<p>${tappa.consegne} consegn${tappa.consegne === 1 ? "a" : "e"} da ${UCCISIONI_PER_CONSEGNA} ${escape(c.mostro)} uccisi. Ogni consegna conta da sola per il limite del livello.</p>`,
      `<div class="chips"><span class="chip-label">${escape(c.npc)}</span>${chip(`/navi ${c.navi}`)}</div>`,
      `<p class="stage-range">Città da cui partire: ${escape(c.citta)} (da verificare).</p>`,
    );
    if (scelte.rinato) {
      parti.push(
        `<p class="note-line tip"><strong>Trucco:</strong> prendi la quest prima di rinascere (si prende ai livelli ${c.min}-${c.max}) e uccidi i mostri; da rinato la consegni qui, a qualsiasi livello.</p>`,
      );
    }
    if (tappa.rabbocchi > 0) {
      parti.push(
        `<p class="note-line tip"><strong>Mostri:</strong> quando al livello manca meno del ${scelte.rabbocco}%, finiscilo uccidendo mostri. Capita ${tappa.rabbocchi} volt${tappa.rabbocchi === 1 ? "a" : "e"}.</p>`,
      );
    }
  } else {
    titolo = "Mostri";
    parti.push(`<p>Manca poco al livello successivo: finiscilo uccidendo mostri.</p>`);
  }

  if (tappa.persa > 0) {
    parti.push(`<p class="stage-range">EXP persa per il limite di un livello a consegna: ${numero(tappa.persa)}.</p>`);
  }
  // L'avviso e' per le consegne fatte gia' al job massimo; il resto e' il limite di un livello.
  const massimo = jobMassimo(scelte.rinato, tappa.jobA.classe);
  const alMassimo = tappa.passi.filter((p) => p.tipo !== "rabbocco" && p.job.da.livello >= massimo);
  const persaAlMassimo = alMassimo.reduce((n, p) => n + p.job.persa, 0);
  if (alMassimo.length > 0) {
    parti.push(
      `<p class="note-line warn"><strong>Job EXP sprecata:</strong> al job ${massimo} della ${nomeClasse(tappa.jobA.classe)}, il massimo, la job EXP delle consegne non serve più. In questa tappa succede in ${alMassimo.length} consegn${alMassimo.length === 1 ? "a" : "e"}: ${numero(persaAlMassimo)} job EXP.</p>`,
    );
  }
  if (tappa.jobPersa > persaAlMassimo) {
    parti.push(
      `<p class="stage-range">Job EXP persa per il limite di un livello a consegna: ${numero(tappa.jobPersa - persaAlMassimo)}.</p>`,
    );
  }
  if (tappa.passi.length > 1) parti.push(disegnaPassi(tappa.passi, tabella, scelte.rinato));

  return `
    <article class="stage">
      <div class="stage-num">${numeroTappa}</div>
      <div>
        <h3 class="stage-title">${escape(titolo)}</h3>
        ${intervallo}
        ${parti.join("")}
      </div>
    </article>`;
}

function disegnaClasse(numeroTappa, tappa, tabella) {
  const base = `${tappa.base.livello} (${percento(percentualeDi(tabella, tappa.base))}%)`;
  const persa =
    tappa.persa > 0
      ? `<p class="stage-range">Con il cambio si perde la job EXP già fatta nel job ${tappa.job.livello}: ${numero(tappa.persa)}.</p>`
      : "";
  return `
    <article class="stage">
      <div class="stage-num">${numeroTappa}</div>
      <div>
        <h3 class="stage-title">Cambia classe</h3>
        <div class="stage-range">Al livello ${base}, job ${tappa.job.livello} della prima classe</div>
        <p class="note-line warn"><strong>Prima della prossima consegna:</strong> fai il cambio di classe. Il job riparte da 1 e la job EXP delle consegne torna a servire; se continui a consegnare senza cambiare, va sprecata.</p>
        ${persa}
      </div>
    </article>`;
}

/** La lista della spesa di tutto il piano, oggetto per oggetto. */
function disegnaSpesa(spesa) {
  if (spesa.length === 0) return "";
  const righe = spesa.map(({ quest: q, servono, dallInventario, comprati, zeny }) => {
    const dove = q.negozio
      ? `<span class="chip-label">${escape(q.negozio.nome)}</span>${chip(`/navi ${q.negozio.navi}`)}`
      : `<span class="chip-label">Mercato</span>${chip(`@ws ${q.idOggetto}`)}`;
    const cosa =
      comprati > 0
        ? `<strong>${numero(comprati)} ${escape(q.oggetto)}</strong> da comprare, ${numero(zeny)} zeny`
        : `<strong>${escape(q.oggetto)}</strong>: niente da comprare`;
    const dettaglio = dallInventario > 0 ? ` (ne servono ${numero(servono)}, ${numero(dallInventario)} li hai)` : "";
    return `<li>${cosa}<span class="stage-range">${dettaglio}</span>${comprati > 0 ? `<div class="chips">${dove}</div>` : ""}</li>`;
  });
  return `<div class="spesa"><h3>Da comprare</h3><ul>${righe.join("")}</ul></div>`;
}

/**
 * Lo stesso piano senza manuale, con il 50% e con il 100%: zeny degli oggetti
 * piu' il costo dei manuali, uno per ogni mezz'ora di consegne.
 */
function disegnaManuali(scelte) {
  const righe = [0, 50, 100].map((manuale) => {
    const piano = calcolaPiano({ ...scelte, manuale });
    let costo = 0;
    let nota = "";
    if (manuale === 50 && scelte.mezzore > scelte.manuali50) {
      nota = `ne servono ${scelte.mezzore}, ne hai ${scelte.manuali50}`;
    }
    if (manuale === 100) costo = scelte.mezzore * MANUALE.coin100 * scelte.poringCoin;
    return { manuale, oggetti: piano.zeny, costo, totale: piano.zeny + costo, nota };
  });
  const possibili = righe.filter((r) => !r.nota).sort((a, b) => a.totale - b.totale);
  const conviene = (m) => (m === 0 ? "non usare manuali" : `il manuale al ${m}%`);
  const rispetto = (m) => (m === 0 ? "a nessun manuale" : `al manuale al ${m}%`);
  const migliore = possibili[0];
  const tabella = righe.map(
    (r) => `<tr class="${r === migliore ? "best" : ""}">
      <td>${r.manuale === 0 ? "Nessuno" : r.manuale + "%"}</td>
      <td>${numero(r.oggetti)}</td>
      <td>${r.nota ? escape(r.nota) : numero(r.costo)}</td>
      <td>${r.nota ? "–" : numero(r.totale)}</td>
    </tr>`,
  );
  const secondo = possibili[1];
  const verdetto = secondo
    ? `Conviene ${conviene(migliore.manuale)}: rispetto ${rispetto(secondo.manuale)} risparmi ${numero(secondo.totale - migliore.totale)} zeny.`
    : `Conviene ${conviene(migliore.manuale)}.`;
  return `<table><thead><tr><th>Manuale</th><th>Oggetti</th><th>Manuali</th><th>Totale</th></tr></thead><tbody>${tabella.join("")}</tbody></table>
    <p class="verdetto">${verdetto}</p>`;
}

function aggiorna() {
  const scelte = leggi();
  // In seconda classe non c'e' un altro cambio, e il job massimo dipende dalla classe.
  document.getElementById("campoCambio").hidden = scelte.seconda;
  form.elements.job.max = jobMassimo(scelte.rinato, scelte.seconda ? 2 : 1);

  // Nella tabella solo gli oggetti delle quest che servono fra il livello e l'obiettivo.
  for (const q of QUEST) {
    const riga = form.querySelector(`[data-quest="${q.id}"]`);
    riga.hidden = q.max < scelte.livello || q.min >= scelte.obiettivo;
  }
  const molt = moltiplicatore(scelte.weekend, scelte.manuale);
  document.getElementById("moltiplicatore").textContent =
    `EXP delle quest: ×${molt.toLocaleString("it-IT")}`;

  const tabella = scelte.rinato ? EXP_RINATO : EXP_NORMALE;
  const confronto = document.getElementById("confrontoManuali");
  if (scelte.livello >= scelte.obiettivo) {
    pianoEl.innerHTML = `<p class="summary">Sei già all'obiettivo.</p>`;
    confronto.innerHTML = "";
    return;
  }

  // Sotto il primo livello delle quest si sale uccidendo mostri: il piano, e il
  // confronto dei manuali, partono da li' (prima la pagina non mostrava niente).
  const minimo = Math.min(...QUEST.map((q) => q.min));
  const daiMostri = scelte.livello < minimo;
  if (daiMostri) {
    if (scelte.obiettivo <= minimo) {
      pianoEl.innerHTML = `<p class="empty">Le quest cominciano dal livello ${minimo}: fino al ${scelte.obiettivo} si sale solo uccidendo mostri.</p>`;
      confronto.innerHTML = "";
      return;
    }
    Object.assign(scelte, { livello: minimo, percentuale: 0 });
  }

  const piano = calcolaPiano(scelte);
  if (!piano) {
    pianoEl.innerHTML = `<p class="empty">Nessun piano possibile con queste scelte.</p>`;
    confronto.innerHTML = "";
    return;
  }
  confronto.innerHTML = disegnaManuali(scelte);

  const stato = (s) => `${s.livello} (${percento(percentualeDi(tabella, s))}%)`;
  const job = seguiJob(piano, { ...scelte, cambio: scelte.cambioJob });
  // Le tappe del piano, prima che il cambio di classe ne spezzi una.
  const tappe = piano.tappe.length;
  const html = [
    daiMostri
      ? `<p class="note-line tip"><strong>Fino al ${minimo}:</strong> sotto il livello ${minimo} non ci sono quest ripetibili, si sale uccidendo mostri. Il piano parte dal ${minimo} allo 0%.</p>`
      : "",
    `<p class="summary">Dal ${stato(piano.partenza)} al ${stato(piano.arrivo)}: <strong>${numero(piano.consegne)}</strong> consegne in ${tappe} tapp${tappe === 1 ? "a" : "e"}, <strong>${numero(piano.zeny)}</strong> zeny di oggetti. Alla fine: job ${statoJob(scelte.rinato, job.finale)} della ${nomeClasse(job.finale.classe)}.</p>`,
  ];
  html.push(disegnaSpesa(piano.spesa));
  job.tappe.forEach((t, i) =>
    html.push(t.tipo === "classe" ? disegnaClasse(i + 1, t, tabella) : disegnaTappa(i + 1, t, scelte, tabella)),
  );
  pianoEl.innerHTML = html.join("");
}

// ------------------------------------------------------------- eventi ---

let attesa;
form.addEventListener("input", () => {
  salva();
  clearTimeout(attesa);
  attesa = setTimeout(aggiorna, 250);
});
form.addEventListener("submit", (event) => event.preventDefault());

const toast = document.getElementById("toast");
let toastTimer;
function avvisa(testo, durata = 1800) {
  toast.textContent = testo;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), durata);
}

pianoEl.addEventListener("click", async (event) => {
  const bottone = event.target.closest("[data-copy]");
  if (!bottone) return;
  try {
    await navigator.clipboard.writeText(bottone.dataset.copy);
    avvisa(`Copiato: ${bottone.dataset.copy}`);
  } catch {
    avvisa("Non riesco a copiare: selezionalo a mano.");
  }
});

// Backup e ripristino in un file, dal menu Altro come nelle altre pagine.
document.getElementById("btnBackup").addEventListener("click", () => {
  salva();
  let testo;
  try {
    testo = localStorage.getItem(STORAGE_KEY);
  } catch {
    testo = null;
  }
  const blob = new Blob([testo ?? "{}"], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `livelli-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  avvisa(`Il browser scarica ${link.download}: conservalo, e con Ripristina da backup recuperi i dati.`, 3500);
});

const file = document.getElementById("file");
document.getElementById("btnRipristina").addEventListener("click", () => file.click());
file.addEventListener("change", async () => {
  const scelto = file.files[0];
  file.value = "";
  if (!scelto) return;
  let stato;
  try {
    stato = JSON.parse(await scelto.text());
    if (!stato || typeof stato !== "object" || Array.isArray(stato)) throw new Error("formato");
  } catch {
    avvisa("Il file non è un backup di questa pagina.", 3500);
    return;
  }
  if (!confirm("Sostituire i dati della pagina con quelli del file?")) return;
  applica(stato);
  salva();
  aggiorna();
  avvisa("Dati ripristinati.");
});

ripristina();
aggiorna();
