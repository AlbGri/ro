/**
 * Pagina dei livelli: legge il modulo, calcola il piano e lo disegna.
 *
 * Quello che si scrive nel modulo resta in questo browser, nella chiave
 * `ragnarok-livelli/stato`, con il prefisso del servizio come chiede il sito.
 */

import { calcolaPiano, jobMassimo, moltiplicatore, percentualeDi, percentualeJob, seguiJob } from "./calcolo.js";
import { CACCE, EXP_NORMALE, EXP_RINATO, MANUALE, QUEST, UCCISIONI_PER_CONSEGNA } from "./dati.js";

const STORAGE_KEY = "ragnarok-livelli/stato";

// Le scritte nelle due lingue: tr() di gate.js. I numeri seguono la lingua (1.000 o 1,000).
const tr = window.tr;
const LOCALE = tr("it-IT", "en-GB");
// "1 turn-in", "2 turn-ins": in italiano il plurale e' scritto nella frase
const plurale = (n, uno, piu) => (n === 1 ? uno : piu);

const form = document.getElementById("form");
const pianoEl = document.getElementById("piano");

const numero = (n) => Math.round(n).toLocaleString(LOCALE);
const percento = (p) => p.toLocaleString(LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const escape = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// ------------------------------------------------------------- oggetti ---

document.getElementById("items").innerHTML =
  `<div class="item head"><span>${tr("Oggetto", "Item")}</span><span>Quest</span><span>${tr("Ne ho", "I have")}</span><span>${tr("Prezzo (zeny)", "Price (zeny)")}</span></div>` +
  QUEST.map(
    (q) => `
    <div class="item" data-quest="${q.id}">
      <div><span class="name">${escape(q.oggetto)}</span> <span class="sub">${q.quantita} ${tr("a consegna", "per turn-in")}</span></div>
      <div class="sub sub-npc">${escape(q.npc)}, ${tr("livelli", "levels")} ${q.min}-${q.max}</div>
      <label class="mobile" data-label="${tr("Ne ho", "I have")}">
        <input type="number" name="posseduti-${q.id}" min="0" step="1" placeholder="0" aria-label="${escape(tr(`${q.oggetto} che hai`, `${q.oggetto} you have`))}">
      </label>
      <label class="mobile" data-label="${tr("Prezzo (zeny)", "Price (zeny)")}">
        <input type="number" name="prezzo-${q.id}" min="0" step="1" placeholder="${q.prezzo}"
          aria-label="${escape(tr(`Prezzo di una ${q.oggetto}`, `Price of one ${q.oggetto}`))}">
      </label>
      <span class="npc-price">${q.negozio
        ? tr("prezzo NPC", "NPC price") + (q.senzaDiscount ? tr(` con Discount, ${q.senzaDiscount} senza`, ` with Discount, ${q.senzaDiscount} without`) : "")
        : tr("stima, metti quello del mercato", "estimate, enter the market one")}</span>
    </div>`,
  ).join("");

document.getElementById("cacce").innerHTML = CACCE.map(
  (c) => `
    <label class="field"><span>${escape(c.mostro)} (${escape(c.npc)}, ${tr("si prende ai livelli", "taken at levels")} ${c.min}-${c.max})</span>
      <select name="caccia-${c.id}">
        <option value="0">${tr("Nessuna", "None")}</option>
        ${[1, 2, 3].map((n) => `<option value="${n}">${n * UCCISIONI_PER_CONSEGNA} ${tr("uccisi", "killed")}</option>`).join("")}
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
    manuale: f.manuale.value === "battle" ? 50 : Number(f.manuale.value),
    // il Battle Manual da' anche job EXP, il Field Manual solo base
    manualeJob: f.manuale.value === "battle",
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

const nomeClasse = (classe) => (classe === 1 ? tr("prima classe", "first class") : tr("seconda classe", "second class"));
const statoJob = (rinato, s) => `${s.livello} (${percento(percentualeJob(rinato, s))}%)`;

const chip = (testo) => `<button class="chip" type="button" data-copy="${escape(testo)}">${escape(testo)}</button>`;

function disegnaPassi(passi, tabella, rinato) {
  const stato = (s) => `${s.livello} (${percento(percentualeDi(tabella, s))}%)`;
  const righe = passi.map((p) =>
    p.tipo === "rabbocco"
      ? `<li class="kill">${tr("mostri: da", "monsters: from")} ${stato(p.da)} ${tr("a", "to")} ${stato(p.a)}</li>`
      : `<li>${tr("da", "from")} ${stato(p.da)} ${tr("a", "to")} ${stato(p.a)}${p.persa > 0 ? tr(`, persi ${numero(p.persa)} EXP`, `, ${numero(p.persa)} EXP lost`) : ""}; job ${statoJob(rinato, p.job.a)}${p.job.persa > 0 ? tr(`, persi ${numero(p.job.persa)} job EXP`, `, ${numero(p.job.persa)} Job EXP lost`) : ""}</li>`,
  );
  return `<details class="steps"><summary>${tr("Consegna per consegna", "Turn-in by turn-in")}</summary><ol>${righe.join("")}</ol></details>`;
}

function disegnaTappa(numeroTappa, tappa, scelte, tabella) {
  const stato = (s) => `${s.livello} (${percento(percentualeDi(tabella, s))}%)`;
  const intervallo =
    `<div class="stage-range">${tr("Dal", "From")} ${stato(tappa.da)} ${tr("al", "to")} ${stato(tappa.a)}</div>` +
    `<div class="stage-range">${tr(`Job della ${nomeClasse(tappa.jobDa.classe)}: dal`, `Job Level (${nomeClasse(tappa.jobDa.classe)}): from`)} ${statoJob(scelte.rinato, tappa.jobDa)} ${tr("al", "to")} ${statoJob(scelte.rinato, tappa.jobA)}</div>`;
  const parti = [];
  let titolo;

  if (tappa.tipo === "quest") {
    const q = tappa.quest;
    titolo = tr(`${q.oggetto} a ${q.npc}`, `${q.oggetto} to ${q.npc}`);
    const totale = tappa.consegne * q.quantita;
    let testo = tr(
      `${tappa.consegne} consegn${tappa.consegne === 1 ? "a" : "e"} da ${q.quantita} ${q.oggetto}: ${numero(totale)} oggetti.`,
      `${tappa.consegne} ${plurale(tappa.consegne, "turn-in", "turn-ins")} of ${q.quantita} ${q.oggetto}: ${numero(totale)} items.`,
    );
    if (tappa.dallInventario > 0) testo += tr(` Ne usi ${numero(tappa.dallInventario)} dei tuoi.`, ` You use ${numero(tappa.dallInventario)} of yours.`);
    testo += tappa.comprati > 0
      ? tr(` Da comprare: ${numero(tappa.comprati)}, per ${numero(tappa.zeny)} zeny.`, ` To buy: ${numero(tappa.comprati)}, for ${numero(tappa.zeny)} zeny.`)
      : tr(" Non serve comprarne.", " No need to buy any.");
    parti.push(`<p>${escape(testo)}</p>`);

    const chips = [`<span class="chip-label">${escape(q.npc)}</span>${chip(`/navi ${q.navi}`)}`];
    if (tappa.comprati > 0) {
      chips.push(
        q.negozio
          ? `<span class="chip-label">${escape(q.negozio.nome)}</span>${chip(`/navi ${q.negozio.navi}`)}`
          : `<span class="chip-label">${tr("Mercato", "Market")}</span>${chip(`@ws ${q.idOggetto}`)}`,
      );
    }
    parti.push(`<div class="chips">${chips.join("")}</div>`);
    if (q.citta) parti.push(`<p class="stage-range">${tr("Città da cui partire", "Starting town")}: ${escape(q.citta)} ${tr("(da verificare)", "(to be verified)")}.</p>`);
    if (tappa.rabbocchi > 0) {
      parti.push(
        tr(
          `<p class="note-line tip"><strong>Mostri:</strong> quando al livello manca meno del ${scelte.rabbocco}%, uccidi qualche ${escape(q.mostro)} sulla mappa invece di consegnare. In questa tappa capita ${tappa.rabbocchi} volt${tappa.rabbocchi === 1 ? "a" : "e"}.</p>`,
          `<p class="note-line tip"><strong>Monsters:</strong> when less than ${scelte.rabbocco}% of the level is left, kill a few ${escape(q.mostro)} on the map instead of turning in. In this stage it happens ${tappa.rabbocchi} ${plurale(tappa.rabbocchi, "time", "times")}.</p>`,
        ),
      );
    }
  } else if (tappa.tipo === "caccia") {
    const c = tappa.caccia;
    titolo = tr(`${c.mostro} a ${c.npc}`, `${c.mostro} to ${c.npc}`);
    parti.push(
      tr(
        `<p>${tappa.consegne} consegn${tappa.consegne === 1 ? "a" : "e"} da ${UCCISIONI_PER_CONSEGNA} ${escape(c.mostro)} uccisi. Ogni consegna conta da sola per il limite del livello.</p>`,
        `<p>${tappa.consegne} ${plurale(tappa.consegne, "turn-in", "turn-ins")} of ${UCCISIONI_PER_CONSEGNA} ${escape(c.mostro)} killed. Each turn-in counts on its own for the level limit.</p>`,
      ),
      `<div class="chips"><span class="chip-label">${escape(c.npc)}</span>${chip(`/navi ${c.navi}`)}</div>`,
      `<p class="stage-range">${tr("Città da cui partire", "Starting town")}: ${escape(c.citta)} ${tr("(da verificare)", "(to be verified)")}.</p>`,
    );
    if (scelte.rinato) {
      parti.push(
        tr(
          `<p class="note-line tip"><strong>Trucco:</strong> prendi la quest prima di rinascere (si prende ai livelli ${c.min}-${c.max}) e uccidi i mostri; da rinato la consegni qui, a qualsiasi livello.</p>`,
          `<p class="note-line tip"><strong>Trick:</strong> take the quest before rebirth (it is taken at levels ${c.min}-${c.max}) and kill the monsters; as Transcendent you turn it in here, at any level.</p>`,
        ),
      );
    }
    if (tappa.rabbocchi > 0) {
      parti.push(
        tr(
          `<p class="note-line tip"><strong>Mostri:</strong> quando al livello manca meno del ${scelte.rabbocco}%, finiscilo uccidendo mostri. Capita ${tappa.rabbocchi} volt${tappa.rabbocchi === 1 ? "a" : "e"}.</p>`,
          `<p class="note-line tip"><strong>Monsters:</strong> when less than ${scelte.rabbocco}% of the level is left, finish it by killing monsters. It happens ${tappa.rabbocchi} ${plurale(tappa.rabbocchi, "time", "times")}.</p>`,
        ),
      );
    }
  } else {
    titolo = tr("Mostri", "Monsters");
    parti.push(`<p>${tr("Manca poco al livello successivo: finiscilo uccidendo mostri.", "Little is left to the next level: finish it by killing monsters.")}</p>`);
  }

  if (tappa.persa > 0) {
    parti.push(`<p class="stage-range">${tr("EXP persa per il limite di un livello a consegna", "EXP lost to the limit of one level per turn-in")}: ${numero(tappa.persa)}.</p>`);
  }
  // L'avviso e' per le consegne fatte gia' al job massimo; il resto e' il limite di un livello.
  const massimo = jobMassimo(scelte.rinato, tappa.jobA.classe);
  const alMassimo = tappa.passi.filter((p) => p.tipo !== "rabbocco" && p.job.da.livello >= massimo);
  const persaAlMassimo = alMassimo.reduce((n, p) => n + p.job.persa, 0);
  if (alMassimo.length > 0) {
    parti.push(
      tr(
        `<p class="note-line warn"><strong>Job EXP sprecata:</strong> al job ${massimo} della ${nomeClasse(tappa.jobA.classe)}, il massimo, la job EXP delle consegne non serve più. In questa tappa succede in ${alMassimo.length} consegn${alMassimo.length === 1 ? "a" : "e"}: ${numero(persaAlMassimo)} job EXP.</p>`,
        `<p class="note-line warn"><strong>Wasted Job EXP:</strong> at Job Level ${massimo} of the ${nomeClasse(tappa.jobA.classe)}, the maximum, the Job EXP of the turn-ins is no longer useful. In this stage it happens in ${alMassimo.length} ${plurale(alMassimo.length, "turn-in", "turn-ins")}: ${numero(persaAlMassimo)} Job EXP.</p>`,
      ),
    );
  }
  if (tappa.jobPersa > persaAlMassimo) {
    parti.push(
      `<p class="stage-range">${tr("Job EXP persa per il limite di un livello a consegna", "Job EXP lost to the limit of one level per turn-in")}: ${numero(tappa.jobPersa - persaAlMassimo)}.</p>`,
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
      ? `<p class="stage-range">${tr(`Con il cambio si perde la job EXP già fatta nel job ${tappa.job.livello}`, `With the change you lose the Job EXP already made in Job Level ${tappa.job.livello}`)}: ${numero(tappa.persa)}.</p>`
      : "";
  return `
    <article class="stage">
      <div class="stage-num">${numeroTappa}</div>
      <div>
        <h3 class="stage-title">${tr("Cambia classe", "Job change")}</h3>
        <div class="stage-range">${tr(`Al livello ${base}, job ${tappa.job.livello} della prima classe`, `At level ${base}, Job Level ${tappa.job.livello} of the first class`)}</div>
        <p class="note-line warn">${tr(
          "<strong>Prima della prossima consegna:</strong> fai il cambio di classe. Il job riparte da 1 e la job EXP delle consegne torna a servire; se continui a consegnare senza cambiare, va sprecata.",
          "<strong>Before the next turn-in:</strong> do the job change. The Job Level starts again from 1 and the Job EXP of the turn-ins is useful again; if you keep turning in without changing, it is wasted.",
        )}</p>
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
      : `<span class="chip-label">${tr("Mercato", "Market")}</span>${chip(`@ws ${q.idOggetto}`)}`;
    const cosa =
      comprati > 0
        ? `<strong>${numero(comprati)} ${escape(q.oggetto)}</strong> ${tr("da comprare", "to buy")}, ${numero(zeny)} zeny`
        : `<strong>${escape(q.oggetto)}</strong>: ${tr("niente da comprare", "nothing to buy")}`;
    const dettaglio = dallInventario > 0
      ? tr(` (ne servono ${numero(servono)}, ${numero(dallInventario)} li hai)`, ` (${numero(servono)} needed, you have ${numero(dallInventario)})`)
      : "";
    return `<li>${cosa}<span class="stage-range">${dettaglio}</span>${comprati > 0 ? `<div class="chips">${dove}</div>` : ""}</li>`;
  });
  return `<div class="spesa"><h3>${tr("Da comprare", "To buy")}</h3><ul>${righe.join("")}</ul></div>`;
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
      nota = tr(`ne servono ${scelte.mezzore}, ne hai ${scelte.manuali50}`, `${scelte.mezzore} needed, you have ${scelte.manuali50}`);
    }
    if (manuale === 100) costo = scelte.mezzore * MANUALE.coin100 * scelte.poringCoin;
    return { manuale, oggetti: piano.zeny, costo, totale: piano.zeny + costo, nota };
  });
  const possibili = righe.filter((r) => !r.nota).sort((a, b) => a.totale - b.totale);
  const nome = (m) => (m === 100 ? "the Field Manual 100%" : "a 50% manual");
  const conviene = (m) => (m === 0 ? tr("non usare manuali", "no manual") : tr(`il manuale al ${m}%`, nome(m)));
  const rispetto = (m) => (m === 0 ? tr("a nessun manuale", "no manual") : tr(`al manuale al ${m}%`, nome(m)));
  const migliore = possibili[0];
  const tabella = righe.map(
    (r) => `<tr class="${r === migliore ? "best" : ""}">
      <td>${r.manuale === 0 ? tr("Nessuno", "None") : r.manuale + "%"}</td>
      <td>${numero(r.oggetti)}</td>
      <td>${r.nota ? escape(r.nota) : numero(r.costo)}</td>
      <td>${r.nota ? "–" : numero(r.totale)}</td>
    </tr>`,
  );
  const secondo = possibili[1];
  const verdetto = secondo
    ? tr(
        `Conviene ${conviene(migliore.manuale)}: rispetto ${rispetto(secondo.manuale)} risparmi ${numero(secondo.totale - migliore.totale)} zeny.`,
        `Best choice: ${conviene(migliore.manuale)}. Compared with ${rispetto(secondo.manuale)} you save ${numero(secondo.totale - migliore.totale)} zeny.`,
      )
    : tr(`Conviene ${conviene(migliore.manuale)}.`, `Best choice: ${conviene(migliore.manuale)}.`);
  return `<table><thead><tr><th>${tr("Manuale", "Manual")}</th><th>${tr("Oggetti", "Items")}</th><th>${tr("Manuali", "Manuals")}</th><th>${tr("Totale", "Total")}</th></tr></thead><tbody>${tabella.join("")}</tbody></table>
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
  const moltJob = moltiplicatore(scelte.weekend, scelte.manualeJob ? scelte.manuale : 0);
  document.getElementById("moltiplicatore").textContent =
    `${tr("EXP delle quest", "Quest EXP")}: ×${molt.toLocaleString(LOCALE)}` +
    (moltJob === molt ? "" : `, job ×${moltJob.toLocaleString(LOCALE)}`);

  const tabella = scelte.rinato ? EXP_RINATO : EXP_NORMALE;
  const confronto = document.getElementById("confrontoManuali");
  if (scelte.livello >= scelte.obiettivo) {
    pianoEl.innerHTML = `<p class="summary">${tr("Sei già all'obiettivo.", "You are already at the target.")}</p>`;
    confronto.innerHTML = "";
    return;
  }

  // Sotto il primo livello delle quest si sale uccidendo mostri: il piano, e il
  // confronto dei manuali, partono da li' (prima la pagina non mostrava niente).
  const minimo = Math.min(...QUEST.map((q) => q.min));
  const daiMostri = scelte.livello < minimo;
  if (daiMostri) {
    if (scelte.obiettivo <= minimo) {
      pianoEl.innerHTML = `<p class="empty">${tr(
        `Le quest cominciano dal livello ${minimo}: fino al ${scelte.obiettivo} si sale solo uccidendo mostri.`,
        `The quests start at level ${minimo}: up to ${scelte.obiettivo} you level up only by killing monsters.`,
      )}</p>`;
      confronto.innerHTML = "";
      return;
    }
    Object.assign(scelte, { livello: minimo, percentuale: 0 });
  }

  const piano = calcolaPiano(scelte);
  if (!piano) {
    pianoEl.innerHTML = `<p class="empty">${tr("Nessun piano possibile con queste scelte.", "No plan is possible with these choices.")}</p>`;
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
      ? tr(
          `<p class="note-line tip"><strong>Fino al ${minimo}:</strong> sotto il livello ${minimo} non ci sono quest ripetibili, si sale uccidendo mostri. Il piano parte dal ${minimo} allo 0%.</p>`,
          `<p class="note-line tip"><strong>Up to ${minimo}:</strong> below level ${minimo} there are no repeatable quests, you level up by killing monsters. The plan starts from ${minimo} at 0%.</p>`,
        )
      : "",
    tr(
      `<p class="summary">Dal ${stato(piano.partenza)} al ${stato(piano.arrivo)}: <strong>${numero(piano.consegne)}</strong> consegne in ${tappe} tapp${tappe === 1 ? "a" : "e"}, <strong>${numero(piano.zeny)}</strong> zeny di oggetti. Alla fine: job ${statoJob(scelte.rinato, job.finale)} della ${nomeClasse(job.finale.classe)}.</p>`,
      `<p class="summary">From ${stato(piano.partenza)} to ${stato(piano.arrivo)}: <strong>${numero(piano.consegne)}</strong> ${plurale(piano.consegne, "turn-in", "turn-ins")} in ${tappe} ${plurale(tappe, "stage", "stages")}, <strong>${numero(piano.zeny)}</strong> zeny of items. At the end: Job Level ${statoJob(scelte.rinato, job.finale)} of the ${nomeClasse(job.finale.classe)}.</p>`,
    ),
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
    avvisa(`${tr("Copiato", "Copied")}: ${bottone.dataset.copy}`);
  } catch {
    avvisa(tr("Non riesco a copiare: selezionalo a mano.", "Cannot copy: select it by hand."));
  }
});

// Backup e ripristino in un file, dal menu ⚙ come nelle altre pagine.
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
  avvisa(tr(`Il browser scarica ${link.download}: conservalo, e con Ripristina da backup recuperi i dati.`, `The browser downloads ${link.download}: keep it, and Restore from backup brings the data back.`), 3500);
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
    avvisa(tr("Il file non è un backup di questa pagina.", "The file is not a backup of this page."), 3500);
    return;
  }
  if (!confirm(tr("Sostituire i dati della pagina con quelli del file?", "Replace the page's data with those in the file?"))) return;
  applica(stato);
  salva();
  aggiorna();
  avvisa(tr("Dati ripristinati.", "Data restored."));
});

ripristina();
aggiorna();
