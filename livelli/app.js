/**
 * Pagina dei livelli: legge il modulo, calcola il piano e lo disegna.
 *
 * Quello che si scrive nel modulo resta in questo browser, nella chiave
 * `ragnarok-livelli/stato`, con il prefisso del servizio come chiede il sito.
 */

import { calcolaPiano, jobMassimo, moltiplicatore, percentualeDi, percentualeJob, seguiJob } from "./calcolo.js";
import { EXP_NORMALE, EXP_RINATO, MEDUSA, QUEST } from "./dati.js";

const STORAGE_KEY = "ragnarok-livelli/stato";
const CACCIA_CON_MERCENARIO = 40;

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
    <div class="item">
      <div><span class="name">${escape(q.oggetto)}</span> <span class="sub">${q.quantita} a consegna</span></div>
      <div class="sub sub-npc">${escape(q.npc)}, livelli ${q.min}-${q.max}</div>
      <label class="mobile" data-label="Ne ho">
        <input type="number" name="posseduti-${q.id}" min="0" step="1" placeholder="0" aria-label="${escape(q.oggetto)} che hai">
      </label>
      <label class="mobile" data-label="Prezzo (zeny)">
        <input type="number" name="prezzo-${q.id}" min="0" step="1" placeholder="non compro"
          ${q.prezzoNpc ? `value="${q.prezzoNpc}"` : ""} aria-label="Prezzo di una ${escape(q.oggetto)}">
        ${q.prezzoNpc ? `<span class="npc-price">NPC: ${numero(q.prezzoNpc)}</span>` : ""}
      </label>
    </div>`,
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
  if (!stato) return;
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
  const caccia = intero(f.caccia.value, 2, 98, null);
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
    caccia: caccia !== null && caccia > livello ? caccia : null,
    mercenario: f.mercenario.checked,
    weekend: f.weekend.checked,
    manuale: Number(f.manuale.value),
    medusa: f.medusa.checked,
    rabbocco: f.rabbocchi.checked ? intero(f.soglia.value, 1, 50, 10) : null,
    cambio: intero(f.cambio.value, 0, 1e9, 0),
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
          ? `<span class="chip-label">${escape(q.negozio.nome)}${q.negozio.verificare ? " (da verificare)" : ""}</span>${chip(`/navi ${q.negozio.navi}`)}`
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
  } else if (tappa.tipo === "medusa") {
    titolo = `Medusa al ${MEDUSA.npc}`;
    parti.push(
      `<p>${tappa.consegne} consegn${tappa.consegne === 1 ? "a" : "e"} da ${MEDUSA.uccisioni} Medusa uccise. Ogni consegna conta da sola per il limite del livello.</p>`,
      `<div class="chips"><span class="chip-label">${MEDUSA.npc}</span>${chip(`/navi ${MEDUSA.navi}`)}</div>`,
      `<p class="stage-range">Città da cui partire: ${MEDUSA.citta} (da verificare).</p>`,
    );
    if (scelte.rinato) {
      parti.push(
        `<p class="note-line tip"><strong>Trucco:</strong> prendi le tre quest e uccidi le 150 Medusa prima di rinascere (la quest si prende fino al livello ${MEDUSA.max}), poi consegnale qui da rinato.</p>`,
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

function disegnaCaccia(scelte) {
  const testo = scelte.mercenario
    ? `<p>Les al Moscovia Dungeon, con il Double Strafe del mercenario arco. Il Warpra delle città porta al Moscovia Dungeon per 5.000 zeny, dopo che hai parlato una volta con il Warpra Helper del posto.</p>`
    : `<p>Caccia dove preferisci fino al livello ${scelte.caccia}.</p>`;
  return `
    <article class="stage">
      <div class="stage-num">0</div>
      <div>
        <h3 class="stage-title">A caccia</h3>
        <div class="stage-range">Dal ${scelte.livello} al ${scelte.caccia}</div>
        ${testo}
      </div>
    </article>`;
}

/** Perche' non c'e' un piano: il primo livello in cui nessuna quest e' utilizzabile. */
function spiegaVuoto(scelte, partenza) {
  const utilizzabili = QUEST.filter((q) => {
    const o = scelte.oggetti[q.id];
    return o.prezzo !== null || o.posseduti >= q.quantita;
  });
  for (let l = partenza; l < scelte.obiettivo; l++) {
    if (utilizzabili.some((q) => l >= q.min && l <= q.max)) continue;
    const dopo = utilizzabili.filter((q) => q.min > l).map((q) => q.min);
    const caccia = dopo.length > 0 ? ` oppure caccia fino al livello ${Math.min(...dopo)}` : "";
    return `Al livello ${l} non c'è una quest con un prezzo o con abbastanza oggetti tuoi. Metti il prezzo di un oggetto di una quest per quel livello${caccia}.`;
  }
  return "Con gli oggetti che hai e i prezzi inseriti non si arriva all'obiettivo: metti il prezzo di qualche altro oggetto.";
}

function aggiorna() {
  const scelte = leggi();
  const molt = moltiplicatore(scelte.weekend, scelte.manuale);
  document.getElementById("moltiplicatore").textContent =
    `EXP delle quest: ×${molt.toLocaleString("it-IT")}`;

  const tabella = scelte.rinato ? EXP_RINATO : EXP_NORMALE;
  const partenza = scelte.caccia ?? scelte.livello;
  if (partenza >= scelte.obiettivo) {
    pianoEl.innerHTML = `<p class="summary">Sei già all'obiettivo, o ci arrivi cacciando.</p>`;
    return;
  }

  const piano = calcolaPiano({
    ...scelte,
    livello: partenza,
    percentuale: scelte.caccia ? 0 : scelte.percentuale,
  });
  if (!piano) {
    pianoEl.innerHTML = `<p class="empty">${escape(spiegaVuoto(scelte, partenza))}</p>`;
    return;
  }

  const stato = (s) => `${s.livello} (${percento(percentualeDi(tabella, s))}%)`;
  const job = seguiJob(piano, { ...scelte, cambio: scelte.cambioJob });
  const tappe = job.tappe.filter((t) => t.tipo !== "classe").length;
  const html = [
    `<p class="summary">Dal ${stato(piano.partenza)} al ${stato(piano.arrivo)}: <strong>${numero(piano.consegne)}</strong> consegne in ${tappe} tapp${tappe === 1 ? "a" : "e"}, <strong>${numero(piano.zeny)}</strong> zeny di oggetti. Alla fine: job ${statoJob(scelte.rinato, job.finale)} della ${nomeClasse(job.finale.classe)}.</p>`,
  ];
  if (scelte.caccia) {
    html.push(
      `<p class="note-line verify"><strong>Job:</strong> il calcolo non conta la job EXP della caccia iniziale. Quando arrivi al livello ${scelte.caccia}, aggiorna nel modulo livello, classe e job.</p>`,
    );
  }
  if (scelte.caccia) html.push(disegnaCaccia(scelte));
  job.tappe.forEach((t, i) =>
    html.push(t.tipo === "classe" ? disegnaClasse(i + 1, t, tabella) : disegnaTappa(i + 1, t, scelte, tabella)),
  );
  pianoEl.innerHTML = html.join("");
}

// ------------------------------------------------------------- eventi ---

let attesa;
form.addEventListener("input", (event) => {
  // Con il mercenario si caccia fino al 40, se non e' scritto altro.
  if (event.target.name === "mercenario" && event.target.checked && form.elements.caccia.value === "") {
    form.elements.caccia.value = CACCIA_CON_MERCENARIO;
  }
  salva();
  clearTimeout(attesa);
  attesa = setTimeout(aggiorna, 250);
});
form.addEventListener("submit", (event) => event.preventDefault());

const toast = document.getElementById("toast");
let toastTimer;
pianoEl.addEventListener("click", async (event) => {
  const bottone = event.target.closest("[data-copy]");
  if (!bottone) return;
  try {
    await navigator.clipboard.writeText(bottone.dataset.copy);
    toast.textContent = `Copiato: ${bottone.dataset.copy}`;
  } catch {
    toast.textContent = "Non riesco a copiare: selezionalo a mano.";
  }
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
});

ripristina();
aggiorna();
