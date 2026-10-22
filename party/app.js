/**
 * Pagina del party: giocatori con i loro account, jolly, e le run calcolate.
 *
 * I dati restano in questo browser, nella chiave `ragnarok-party/stato`, con il
 * prefisso del servizio come chiede il sito; si portano altrove con un file.
 * Giocatori e jolly stanno in una tabella compatta, una riga a testa (Alberto,
 * 22/10/2026): ogni account e' un testo come su Discord, "HP/Devo/Clown", letto
 * da `testo.js` con i soprannomi imparati (`soprannomi` dello stato).
 */

import { calcolaRun } from "./calcolo.js";
import { ALTRO, CLASSI, ISTANZE, nomeClasse, tr } from "./dati.js";
import { breve, leggiClassi, leggiElenco, pulisci, scriviElenco } from "./testo.js";

const STORAGE_KEY = "ragnarok-party/stato";
const LOCALE = tr("it-IT", "en-GB");
const NOME_GIOCATORE = tr("Giocatore", "Player");
const NOME_JOLLY = tr("Jolly", "Guild Account");

const giocatoriEl = document.getElementById("giocatori");
const jollyEl = document.getElementById("jolly");
const dubbiEl = document.getElementById("dubbi");
const risultatoEl = document.getElementById("risultato");
const istanzaEl = document.getElementById("istanza");

const escape = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// ----------------------------------------------------------------- stato ---

let stato = { istanza: ISTANZE[0].id, giocatori: [], jolly: [], soprannomi: {} };
const istanza = () => ISTANZE.find((i) => i.id === stato.istanza);

/**
 * Lo stato da un oggetto letto (localStorage o file), con i campi mancanti a posto.
 * I dati fino alla 1.5 avevano gli account come elenchi di personaggi: diventano testo.
 */
function normalizza(dati) {
  if (!dati || !Array.isArray(dati.giocatori) || !Array.isArray(dati.jolly)) throw new Error("formato non valido");
  const testo = (a) =>
    typeof a === "string"
      ? a
      : (Array.isArray(a?.personaggi) ? a.personaggi : [])
          .map((p) => breve(String(p?.classe ?? "")))
          .filter(Boolean)
          .join("/");
  return {
    istanza: ISTANZE.some((i) => i.id === dati.istanza) ? dati.istanza : ISTANZE[0].id,
    giocatori: dati.giocatori.map((g) => ({
      nome: String(g?.nome ?? ""),
      presente: g?.presente !== false,
      account: (Array.isArray(g?.account) ? g.account : []).map(testo),
    })),
    jolly: dati.jolly.map((j) => ({
      nome: String(j?.nome ?? ""),
      disponibile: j?.disponibile !== false,
      classi: typeof j?.classi === "string" ? j.classi : testo(j),
    })),
    soprannomi: Object.fromEntries(
      Object.entries(dati.soprannomi ?? {}).filter(([k, c]) => typeof k === "string" && typeof c === "string"),
    ),
  };
}

function salva() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stato));
  } catch {
    // Senza localStorage i dati valgono per questa sola apertura.
  }
}

function ripristina() {
  try {
    const letto = localStorage.getItem(STORAGE_KEY);
    if (letto) stato = normalizza(JSON.parse(letto));
  } catch {
    // Dati illeggibili: si riparte vuoti.
  }
}

/** Riscrive tutti gli account in forma breve, per esempio dopo un soprannome imparato. */
function pulisciTutto() {
  for (const g of stato.giocatori) g.account = g.account.map((a) => pulisci(a, stato.soprannomi));
  for (const j of stato.jolly) j.classi = pulisci(j.classi, stato.soprannomi);
}

// --------------------------------------------------------------- disegno ---

/** La classe come si mostra: una classe che non conta per l'istanza e' Altro. */
const classeMostrata = (classe) => nomeClasse(!classe || istanza().classi.some((c) => c.nome === classe) ? classe : ALTRO);

/** Le scritte dell'introduzione che dipendono dall'istanza. */
function disegnaIstanza() {
  const i = istanza();
  istanzaEl.innerHTML = ISTANZE.map(
    (x) => `<option value="${x.id}"${x.id === i.id ? " selected" : ""}>${escape(x.nome)}</option>`,
  ).join("");
  const obbligatori = i.posti.filter((p) => p.quanti > 0);
  const desiderati = i.posti.filter((p) => p.desiderati > 0);
  const quanti = (n, p) => `${n} ${p.nome}`;
  const nomeRuolo = (ruolo) => i.posti.find((p) => p.ruolo === ruolo)?.nome ?? ruolo;
  const massimi = i.posti
    .filter((p) => p.massimo !== undefined)
    .map((p) => tr(`al massimo ${quanti(p.massimo, p)} per run`, `at most ${quanti(p.massimo, p)} per run`));
  const liberi = i.liberi
    ? tr(`. Gli altri posti sono solo per ${i.liberi.map(nomeRuolo).join(" o ")}`, `. The other slots are only for ${i.liberi.map(nomeRuolo).join(" or ")}`)
    : tr(". Gli altri posti sono liberi, per qualsiasi classe", ". The other slots are free, for any class");
  document.getElementById("composizione").textContent =
    tr(`${i.nome}: ogni run ha al massimo ${i.maxParty} persone e deve avere `, `${i.nome}: each run has at most ${i.maxParty} people and must have `) +
    obbligatori.map((p) => quanti(p.quanti, p)).join(", ") +
    liberi +
    (massimi.length ? `, ${massimi.join(", ")}` : "") +
    (desiderati.length
      ? tr(
          `; fra questi, se c'è, viene prima ${desiderati.map((p) => quanti(p.desiderati, p)).join(" e ")} per run`,
          `; among these, if there is one, ${desiderati.map((p) => quanti(p.desiderati, p)).join(" and ")} per run comes first`,
        )
      : "") +
    tr(
      `. Un id macchina entra al massimo ${i.maxRun} volte, ogni volta con un account diverso.`,
      `. A Hardware ID enters at most ${i.maxRun} times, each time with a different account.`,
    );
  document.getElementById("ordine").textContent =
    tr("Le run migliori: prima il numero di run, poi far entrare tutti il più possibile, ", "The best runs: first the number of runs, then letting everyone in as much as possible, ") +
    desiderati.map((p) => tr(`poi ${quanti(p.desiderati, p)} per run, `, `then ${quanti(p.desiderati, p)} per run, `)).join("") +
    i.preferiti.map((p) => `${tr("poi più", "then more")} ${p.nome}${p.perche ? ` (${p.perche})` : ""}, `).join("") +
    tr("poi run equilibrate.", "then balanced runs.");
}

// Colonne di account nella tabella: almeno 3, o quante ne ha chi ne ha di piu'; "+" ne aggiunge una.
let minimoColonne = 3;
const colonne = () => Math.max(minimoColonne, ...stato.giocatori.map((g) => g.account.length));

/** Il campo di un account: rosso se contiene parole che la pagina non riconosce. */
function campoClassi(testo, attributi, segnaposto) {
  const ignoto = leggiClassi(testo, stato.soprannomi).ignote.length > 0;
  return `<input type="text" class="classi${ignoto ? " ignoto" : ""}" value="${escape(testo)}" placeholder="${segnaposto}"
    ${attributi} spellcheck="false" autocomplete="off" aria-label="${segnaposto}">`;
}

function disegnaGiocatori() {
  const n = colonne();
  const stile = `style="--colonne: ${n}"`;
  const intestazione = `<div class="riga intestazione" ${stile}>
    <span>${tr("Presente", "Present")}</span><span>${NOME_GIOCATORE}</span>${[...Array(n)].map((_, i) => `<span>Account ${i + 1}</span>`).join("")}
    <button class="btn small" type="button" data-azione="nuova-colonna" title="${tr("Una colonna di account in più", "One more account column")}" aria-label="${tr("Una colonna di account in più", "One more account column")}">+</button>
  </div>`;
  const righe = stato.giocatori.map(
    (g, gi) => `<div class="riga${g.presente ? "" : " spento"}" ${stile}>
      <input type="checkbox" data-g="${gi}" data-campo="presente"${g.presente ? " checked" : ""} aria-label="${tr("Presente", "Present")}">
      <input type="text" class="nome" value="${escape(g.nome)}" placeholder="${NOME_GIOCATORE} ${gi + 1}" data-g="${gi}" data-campo="nome" aria-label="${tr("Nome del giocatore", "Player name")}">
      ${[...Array(n)].map((_, ai) => campoClassi(g.account[ai] ?? "", `data-g="${gi}" data-a="${ai}" data-campo="account"`, `Account ${ai + 1}`)).join("")}
      <button class="btn small danger" type="button" data-g="${gi}" data-azione="togli-giocatore" title="${tr("Togli il giocatore", "Remove the player")}" aria-label="${tr("Togli il giocatore", "Remove the player")}">✕</button>
    </div>`,
  );
  giocatoriEl.innerHTML = stato.giocatori.length ? intestazione + righe.join("") : `<p class="hint">${tr("Nessun giocatore.", "No players.")}</p>`;
}

function disegnaJolly() {
  const intestazione = `<div class="riga jolly intestazione"><span>${tr("Disponibile", "Available")}</span><span>${NOME_JOLLY}</span><span>${tr("Classi", "Classes")}</span><span></span></div>`;
  const righe = stato.jolly.map(
    (j, ji) => `<div class="riga jolly${j.disponibile ? "" : " spento"}">
      <input type="checkbox" data-j="${ji}" data-campo="disponibile"${j.disponibile ? " checked" : ""} aria-label="${tr("Disponibile", "Available")}">
      <input type="text" class="nome" value="${escape(j.nome)}" placeholder="${NOME_JOLLY} ${ji + 1}" data-j="${ji}" data-campo="nome" aria-label="${tr("Nome del jolly", "Guild Account name")}">
      ${campoClassi(j.classi, `data-j="${ji}" data-campo="classi"`, tr("Classi", "Classes"))}
      <button class="btn small danger" type="button" data-j="${ji}" data-azione="togli-jolly" title="${tr("Togli il jolly", "Remove the Guild Account")}" aria-label="${tr("Togli il jolly", "Remove the Guild Account")}">✕</button>
    </div>`,
  );
  jollyEl.innerHTML = stato.jolly.length ? intestazione + righe.join("") : `<p class="hint">${tr("Nessun jolly.", "No Guild Accounts.")}</p>`;
}

/** Le parole che la pagina non riconosce, con il menu per sceglierne la classe, e i soprannomi imparati. */
function disegnaDubbi() {
  const dubbi = new Map();
  const raccogli = (testo, chi) => {
    for (const parola of leggiClassi(testo, stato.soprannomi).ignote) {
      const k = parola.toLowerCase().trim();
      if (!dubbi.has(k)) dubbi.set(k, { parola, chi: [] });
      if (!dubbi.get(k).chi.includes(chi)) dubbi.get(k).chi.push(chi);
    }
  };
  stato.giocatori.forEach((g, i) => g.account.forEach((a) => raccogli(a, g.nome || `${NOME_GIOCATORE} ${i + 1}`)));
  stato.jolly.forEach((j, i) => raccogli(j.classi, `${tr("jolly", "Guild Account")} ${j.nome || i + 1}`));

  const html = [];
  if (dubbi.size) {
    const opzioni = [...CLASSI, ALTRO].map((c) => `<option value="${escape(c)}">${escape(nomeClasse(c))}</option>`).join("");
    const righe = [...dubbi].map(
      ([k, d]) => `<li><label class="dubbio">"${escape(d.parola)}" (${escape(d.chi.join(", "))}) ${tr("è", "is")}
        <select data-dubbio="${escape(k)}"><option value="">${tr("Classe…", "Class…")}</option>${opzioni}</select></label></li>`,
    );
    html.push(`<div class="note-line">${tr(
      "<strong>Parole da riconoscere:</strong> finché non scegli la classe non contano. La pagina se la ricorda.",
      "<strong>Words to recognize:</strong> until you choose the class they do not count. The page remembers it.",
    )}<ul>${righe.join("")}</ul></div>`);
  }
  const imparati = Object.entries(stato.soprannomi);
  if (imparati.length) {
    const voci = imparati.map(
      ([k, c]) => `<li>"${escape(k)}" ${tr("è", "is")} ${escape(nomeClasse(c))} <button class="btn small danger" type="button" data-azione="dimentica" data-chiave="${escape(k)}">${tr("Dimentica", "Forget")}</button></li>`,
    );
    html.push(`<details class="imparati"><summary>${tr("Soprannomi imparati", "Learned nicknames")} (${imparati.length})</summary><ul>${voci.join("")}</ul></details>`);
  }
  dubbiEl.innerHTML = html.join("");
}

// ----------------------------------------------------------------- calcolo ---

/** Giocatori presenti e jolly disponibili, con le classi riconosciute dei loro account. */
function datiCalcolo() {
  const personaggi = (testo) => leggiClassi(testo, stato.soprannomi).classi.map((classe) => ({ classe }));
  const presenti = stato.giocatori
    .map((g, indice) => ({ nome: g.nome || `${NOME_GIOCATORE} ${indice + 1}`, presente: g.presente, account: g.account }))
    .filter((g) => g.presente)
    .map((g) => ({
      ...g,
      account: g.account.map(personaggi).filter((p) => p.length > 0).map((p) => ({ personaggi: p })),
    }));
  const jolly = stato.jolly
    .map((j, indice) => ({ nome: j.nome || `${NOME_JOLLY} ${indice + 1}`, disponibile: j.disponibile, personaggi: personaggi(j.classi) }))
    .filter((j) => j.disponibile);
  return { presenti, jolly };
}

const plurale = (n, uno, molti) => `${n} ${n === 1 ? uno : molti}`;

/** Il calcolo con i dati della pagina, o null senza giocatori presenti. */
function calcola() {
  const { presenti, jolly } = datiCalcolo();
  if (presenti.length === 0) return null;
  return { presenti, jolly, esito: calcolaRun(presenti, jolly, istanza()) };
}

// Le scritte del risultato, uguali nella pagina e nel txt delle run.
// Nel riepilogo solo il primo preferito: degli altri il conto comprenderebbe i posti obbligatori.
const contoPreferiti = (conti) => (istanza().preferiti.length ? [`${conti[0]} ${istanza().preferiti[0].nome}`] : []);
const riepilogo = (esito) => [
  plurale(esito.run.length, "run", tr("run", "runs")),
  plurale(esito.entrate, tr("entrata", "entry"), tr("entrate", "entries")),
  ...contoPreferiti(esito.preferiti),
  ...(esito.jolly ? [plurale(esito.jolly, tr("jolly usato", "Guild Account used"), tr("jolly usati", "Guild Accounts used"))] : []),
];
const nessunaRun = (esito) =>
  esito.mancano.length
    ? esito.mancano
    : [tr(
        "servono combinazioni diverse: due personaggi dello stesso giocatore non stanno nella stessa run",
        "different combinations are needed: two characters of the same player do not fit in the same run",
      )];
const nonGiocano = (presenti, esito) =>
  esito.fuori.map((f) => {
    const perche = {
      piena: tr(`le altre run sono piene (${istanza().maxParty} persone)`, `the other runs are full (${istanza().maxParty} people)`),
      posti: tr("per i personaggi dei suoi altri account non c'è posto", "there is no slot for the characters of their other accounts"),
      account: tr("non ha altri account e i jolly sono finiti", "they have no other accounts and the Guild Accounts are used up"),
    }[f.motivo];
    return tr(
      `${presenti[f.giocatore].nome}: ${f.entrate} run su ${esito.run.length}, ${perche}`,
      `${presenti[f.giocatore].nome}: ${f.entrate} ${f.entrate === 1 ? "run" : "runs"} out of ${esito.run.length}, ${perche}`,
    );
  });
/** Il personaggio di un membro e, se gioca un jolly, il nome del jolly. */
function membro(presenti, jolly, m) {
  const account = m.jolly === null ? presenti[m.giocatore].account[m.account] : jolly[m.jolly];
  return { giocatore: presenti[m.giocatore].nome, p: account.personaggi[m.personaggio], jolly: m.jolly === null ? null : jolly[m.jolly].nome };
}

function aggiorna() {
  const calcolo = calcola();
  if (!calcolo) {
    risultatoEl.innerHTML = `<p class="empty">${tr("Nessun giocatore presente.", "No players present.")}</p>`;
    return;
  }
  const { presenti, jolly, esito } = calcolo;
  const lista = (righe) => `<ul>${righe.map((r) => `<li>${escape(r)}</li>`).join("")}</ul>`;
  const html = [];

  if (esito.run.length === 0) {
    risultatoEl.innerHTML = `<div class="empty">${tr("Nessuna run possibile. Per farne una:", "No run is possible. To make one:")}${lista(nessunaRun(esito))}</div>`;
    return;
  }

  const [quanteRun, ...resto] = riepilogo(esito);
  html.push(`<p class="summary"><strong>${quanteRun}</strong>, ${escape(resto.join(", "))}.</p>`);

  esito.run.forEach((run, i) => {
    const righe = run.membri.map((m) => {
      const { giocatore, p, jolly: nomeJolly } = membro(presenti, jolly, m);
      const etichetta = nomeJolly === null ? "" : `<span class="tag">${tr("jolly", "Guild Account")}: ${escape(nomeJolly)}</span>`;
      return `<tr>
        <td class="${m.posto ? "" : "libero"}">${m.posto ? escape(m.posto) : tr("libero", "free")}</td>
        <td>${escape(giocatore)}</td>
        <td>${escape(classeMostrata(p.classe))}${etichetta}</td>
      </tr>`;
    });
    html.push(`
      <article class="stage">
        <div class="stage-num">${i + 1}</div>
        <div>
          <h3 class="stage-title">Run ${i + 1}</h3>
          <div class="stage-range">${escape([plurale(run.membri.length, tr("persona", "person"), tr("persone", "people")), ...contoPreferiti(run.preferiti)].join(", "))}</div>
          <table><thead><tr><th>${tr("Posto", "Slot")}</th><th>${NOME_GIOCATORE}</th><th>${tr("Classe", "Class")}</th></tr></thead><tbody>${righe.join("")}</tbody></table>
        </div>
      </article>`);
  });

  if (esito.fuori.length > 0) {
    html.push(`<div class="note-line"><strong>${tr("Non giocano tutte le run:", "Not playing all the runs:")}</strong>${lista(nonGiocano(presenti, esito))}</div>`);
  }
  if (esito.mancano.length > 0) {
    html.push(`<div class="note-line"><strong>${tr(`Per la run ${esito.run.length + 1}:`, `For run ${esito.run.length + 1}:`)}</strong>${lista(esito.mancano)}</div>`);
  }
  risultatoEl.innerHTML = html.join("");
}

/** Le run calcolate in un testo da girare alla gilda. */
function testoRun({ presenti, jolly, esito }) {
  const oggi = new Date().toLocaleDateString(LOCALE);
  const righe = [tr(`${istanza().nome}, run del ${oggi}`, `${istanza().nome}, runs of ${oggi}`)];
  const elenco = (titolo, voci) => righe.push("", titolo, ...voci.map((v) => `- ${v}`));
  if (esito.run.length === 0) {
    elenco(tr("Nessuna run possibile. Per farne una:", "No run is possible. To make one:"), nessunaRun(esito));
    return righe.join("\n") + "\n";
  }
  righe.push(`${riepilogo(esito).join(", ")}.`);
  esito.run.forEach((run, i) => {
    const voci = run.membri.map((m) => {
      const { giocatore, p, jolly: nomeJolly } = membro(presenti, jolly, m);
      const classe = classeMostrata(p.classe);
      return (
        `${m.posto ?? tr("Libero", "Free")}: ${giocatore}` +
        (m.posto ? "" : ` (${classe})`) +
        (nomeJolly === null ? "" : `, ${tr("jolly", "Guild Account")} ${nomeJolly}`)
      );
    });
    elenco(`Run ${i + 1}, ${[plurale(run.membri.length, tr("persona", "person"), tr("persone", "people")), ...contoPreferiti(run.preferiti)].join(", ")}`, voci);
  });
  if (esito.fuori.length > 0) elenco(tr("Non giocano tutte le run:", "Not playing all the runs:"), nonGiocano(presenti, esito));
  if (esito.mancano.length > 0) elenco(tr(`Per la run ${esito.run.length + 1}:`, `For run ${esito.run.length + 1}:`), esito.mancano);
  return righe.join("\n") + "\n";
}

// ------------------------------------------------------------- eventi ---

let attesa;
function cambiato(ridisegna) {
  salva();
  if (ridisegna) {
    disegnaGiocatori();
    disegnaJolly();
    disegnaDubbi();
  }
  clearTimeout(attesa);
  attesa = setTimeout(aggiorna, 300);
}

/** Il giocatore o il jolly di un elemento con data-g o data-j. */
const proprietario = (el) => (el.dataset.j !== undefined ? stato.jolly[el.dataset.j] : stato.giocatori[el.dataset.g]);

// Mentre si scrive si salva il testo com'e'; il campo diventa rosso se ha parole sconosciute.
document.addEventListener("input", (event) => {
  const el = event.target;
  const campo = el.dataset.campo;
  if (!campo) return;
  const oggetto = proprietario(el);
  if (campo === "presente" || campo === "disponibile") {
    oggetto[campo] = el.checked;
    el.closest(".riga").classList.toggle("spento", !el.checked);
  } else if (campo === "account") {
    while (oggetto.account.length <= el.dataset.a) oggetto.account.push("");
    oggetto.account[el.dataset.a] = el.value;
  } else oggetto[campo] = el.value;
  if (campo === "account" || campo === "classi") {
    el.classList.toggle("ignoto", leggiClassi(el.value, stato.soprannomi).ignote.length > 0);
  }
  cambiato(false);
});

// Uscendo dal campo il testo si riscrive in forma breve: si vede cosa ha capito la pagina.
document.addEventListener("change", (event) => {
  const el = event.target;
  const campo = el.dataset.campo;
  if (campo !== "account" && campo !== "classi") return;
  const oggetto = proprietario(el);
  const pulito = pulisci(el.value, stato.soprannomi);
  el.value = pulito;
  if (campo === "classi") oggetto.classi = pulito;
  else {
    oggetto.account[el.dataset.a] = pulito;
    while (oggetto.account.length && !oggetto.account.at(-1)) oggetto.account.pop();
  }
  salva();
  disegnaDubbi();
});

dubbiEl.addEventListener("change", (event) => {
  const k = event.target.dataset.dubbio;
  if (k === undefined || !event.target.value) return;
  stato.soprannomi[k] = event.target.value;
  pulisciTutto();
  cambiato(true);
});

const file = document.getElementById("file");

istanzaEl.addEventListener("change", () => {
  stato.istanza = istanzaEl.value;
  disegnaIstanza();
  cambiato(true);
});

document.addEventListener("click", (event) => {
  const el = event.target.closest("[data-azione]");
  if (!el) return;
  const d = el.dataset;
  switch (d.azione) {
    case "nuovo-giocatore":
      stato.giocatori.push({ nome: "", presente: true, account: [] });
      cambiato(true);
      giocatoriEl.querySelector(".riga:last-child .nome").focus();
      return;
    case "togli-giocatore":
      if (!confirm(tr(`Togliere ${stato.giocatori[d.g].nome || "il giocatore"}?`, `Remove ${stato.giocatori[d.g].nome || "the player"}?`))) return;
      stato.giocatori.splice(d.g, 1);
      break;
    case "nuova-colonna":
      minimoColonne = colonne() + 1;
      disegnaGiocatori();
      return;
    case "nuovo-jolly":
      stato.jolly.push({ nome: "", disponibile: true, classi: "" });
      cambiato(true);
      jollyEl.querySelector(".riga:last-child .nome").focus();
      return;
    case "togli-jolly":
      if (!confirm(tr(`Togliere ${stato.jolly[d.j].nome || "il jolly"}?`, `Remove ${stato.jolly[d.j].nome || "the Guild Account"}?`))) return;
      stato.jolly.splice(d.j, 1);
      break;
    case "dimentica":
      delete stato.soprannomi[d.chiave];
      break;
    case "esporta":
      esporta();
      return;
    case "importa":
      file.click();
      return;
    case "apri-elenco":
      incollaEl.hidden = false;
      disegnaAnteprima();
      elencoEl.focus();
      return;
    case "chiudi-elenco":
      incollaEl.hidden = true;
      return;
    case "aggiungi-elenco":
      aggiungiElenco();
      return;
    case "esporta-elenco":
      scarica(`party-elenco-${oggi()}.txt`, scriviElenco(stato));
      return;
    case "esporta-run": {
      const calcolo = calcola();
      if (!calcolo) avvisa(tr("Nessun giocatore presente.", "No players present."));
      else scarica(`party-run-${oggi()}.txt`, testoRun(calcolo));
      return;
    }
    default:
      return;
  }
  cambiato(true);
});

const oggi = () => new Date().toISOString().slice(0, 10);

function scarica(nome, testo, tipo = "text/plain") {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([testo], { type: `${tipo};charset=utf-8` }));
  link.download = nome;
  link.click();
  URL.revokeObjectURL(link.href);
}

function esporta() {
  const nome = `party-backup-${oggi()}.json`;
  scarica(nome, JSON.stringify(stato, null, 2), "application/json");
  avvisa(tr(`Il browser scarica ${nome}: conservalo, e con Ripristina da backup recuperi i dati.`, `The browser downloads ${nome}: keep it, and Restore from backup brings the data back.`));
}

file.addEventListener("change", async () => {
  const scelto = file.files[0];
  file.value = "";
  if (!scelto) return;
  try {
    const nuovo = normalizza(JSON.parse(await scelto.text()));
    if (!confirm(tr("Sostituire i dati della pagina con quelli del file?", "Replace the page's data with those in the file?"))) return;
    stato = nuovo;
    cambiato(true);
    avvisa(tr("Dati importati.", "Data restored."));
  } catch {
    avvisa(tr("Il file non è un export di questa pagina.", "The file is not a backup of this page."));
  }
});

// ------------------------------------------------------ elenco incollato ---

const incollaEl = document.getElementById("incolla");
const elencoEl = document.getElementById("elenco");
const anteprimaEl = document.getElementById("anteprima");
const aggiungiEl = document.getElementById("aggiungi");
const stessoNome = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** L'elenco letto con i soprannomi imparati; null se il campo e' vuoto. */
const elencoLetto = () => (elencoEl.value.trim() ? leggiElenco(elencoEl.value, stato.soprannomi) : null);

/** Chi ha trovato la pagina nel testo incollato, o cosa va corretto. */
function disegnaAnteprima() {
  const letto = elencoLetto();
  aggiungiEl.disabled = !letto || letto.errori.length > 0 || letto.giocatori.length + letto.jolly.length === 0;
  if (!letto) {
    anteprimaEl.innerHTML = "";
  } else if (letto.errori.length) {
    anteprimaEl.innerHTML = `<div class="empty"><strong>${tr("Da correggere nel testo:", "To fix in the text:")}</strong><ul>${letto.errori.map((e) => `<li>${escape(e)}</li>`).join("")}</ul></div>`;
  } else {
    const gia = letto.giocatori.filter((g) => stato.giocatori.some((x) => stessoNome(x.nome, g.nome))).length;
    const parti = [
      plurale(letto.giocatori.length - gia, tr("giocatore nuovo", "new player"), tr("giocatori nuovi", "new players")),
      ...(gia ? [tr(`${gia} da aggiornare`, `${gia} to update`)] : []),
      ...(letto.jolly.length ? [plurale(letto.jolly.length, tr("jolly", "Guild Account"), tr("jolly", "Guild Accounts"))] : []),
    ];
    anteprimaEl.innerHTML = `<p class="hint">${tr("Trovati", "Found")}: ${escape(parti.join(", "))}.</p>`;
  }
}

/**
 * Aggiunge l'elenco alla tabella: chi ha lo stesso nome di un giocatore o di un jolly
 * gia' presente prende gli account dell'elenco, gli altri si aggiungono.
 */
function aggiungiElenco() {
  const letto = elencoLetto();
  if (!letto) return;
  const aggiornati = [
    ...letto.giocatori.filter((g) => stato.giocatori.some((x) => stessoNome(x.nome, g.nome))),
    ...letto.jolly.filter((j) => stato.jolly.some((x) => stessoNome(x.nome, j.nome))),
  ].map((x) => x.nome);
  if (aggiornati.length && !confirm(tr(
    `Sono già nella tabella: ${aggiornati.join(", ")}. Sostituire i loro account con quelli dell'elenco?`,
    `Already in the table: ${aggiornati.join(", ")}. Replace their accounts with those in the list?`,
  ))) return;
  for (const g of letto.giocatori) {
    const esistente = stato.giocatori.find((x) => stessoNome(x.nome, g.nome));
    if (esistente) esistente.account = g.account;
    else stato.giocatori.push({ nome: g.nome, presente: true, account: g.account });
  }
  for (const j of letto.jolly) {
    const esistente = stato.jolly.find((x) => stessoNome(x.nome, j.nome));
    if (esistente) esistente.classi = j.classi;
    else stato.jolly.push({ nome: j.nome, disponibile: true, classi: j.classi });
  }
  cambiato(true);
  elencoEl.value = "";
  incollaEl.hidden = true;
  const nuovi = letto.giocatori.length + letto.jolly.length - aggiornati.length;
  avvisa(tr(
    `Elenco aggiunto: ${plurale(nuovi, "nuovo", "nuovi")}, ${plurale(aggiornati.length, "aggiornato", "aggiornati")}.`,
    `List added: ${nuovi} new, ${aggiornati.length} updated.`,
  ));
}

elencoEl.addEventListener("input", disegnaAnteprima);

const toast = document.getElementById("toast");
let toastTimer;
function avvisa(testo) {
  toast.textContent = testo;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

ripristina();
disegnaIstanza();
disegnaGiocatori();
disegnaJolly();
disegnaDubbi();
aggiorna();
