/**
 * Pagina del party: giocatori con i loro account, jolly, e le run calcolate.
 *
 * I dati restano in questo browser, nella chiave `ragnarok-party/stato`, con il
 * prefisso del servizio come chiede il sito; si portano altrove con un file.
 * Giocatori e jolly stanno in una tabella compatta, una riga a testa (Alberto,
 * 22/10/2026): ogni account e' un testo come su Discord, "HP/Devo/Clown", letto
 * da `testo.js` con i soprannomi imparati (`soprannomi` dello stato).
 */

import { altraCombinazione, calcolaRun, firmaRun, suggerisci } from "./calcolo.js";
import { ALTRO, CLASSI, classeForte, ISTANZE, MAX_RUN, nomeClasse, tr } from "./dati.js";
import { breve, conTanker, leggiClassi, leggiElenco, pulisci, scriviElenco } from "./testo.js";

const STORAGE_KEY = "ragnarok-party/stato";
const LOCALE = tr("it-IT", "en-GB");
const NOME_GIOCATORE = tr("Giocatore", "Player");
const NOME_JOLLY = tr("Account Gilda", "Guild Account");

const giocatoriEl = document.getElementById("giocatori");
const jollyEl = document.getElementById("jolly");
const dubbiEl = document.getElementById("dubbi");
const risultatoEl = document.getElementById("risultato");
const esclusiEl = document.getElementById("escluse");
const suggerimentiEl = document.getElementById("suggerimenti");
const istanzaEl = document.getElementById("istanza");

const escape = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// ----------------------------------------------------------------- stato ---

// `escluse`: le classi da non proporre fra i personaggi da creare.
let stato = { istanza: ISTANZE[0].id, giocatori: [], jolly: [], soprannomi: {}, escluse: [] };
const istanza = () => ISTANZE.find((i) => i.id === stato.istanza);

const TUTTE_LE_RUN = [...Array(MAX_RUN).keys()].map((r) => r + 1);

/**
 * Le run in cui c'e' un giocatore, salvate come numeri da 1. Fino alla 1.14 era quante ne faceva:
 * diventano le prime, perche' le run fatte sono sempre le prime.
 */
function runSalvate(run) {
  if (Number.isInteger(run)) return TUTTE_LE_RUN.slice(0, Math.min(Math.max(run, 1), MAX_RUN));
  const valide = Array.isArray(run) ? TUTTE_LE_RUN.filter((r) => run.includes(r)) : [];
  return valide.length > 0 ? valide : TUTTE_LE_RUN;
}

// Fino alla 1.17 Clown e Bard, Gypsy e Dancer erano una classe sola.
const RINOMINATE = { "Clown/Bard": "Clown", "Gypsy/Dancer": "Gypsy" };
const rinominata = (classe) => RINOMINATE[classe] ?? classe;

/**
 * Lo stato da un oggetto letto (localStorage o file), con i campi mancanti a posto.
 * I dati fino alla 1.5 avevano gli account come elenchi di personaggi: diventano testo.
 * Fino alla 1.17 HP Tanker era una spunta del giocatore: diventa la classe dei suoi High Priest.
 */
function normalizza(dati) {
  if (!dati || !Array.isArray(dati.giocatori) || !Array.isArray(dati.jolly)) throw new Error("formato non valido");
  const soprannomi = Object.fromEntries(
    Object.entries(dati.soprannomi ?? {})
      .filter(([k, c]) => typeof k === "string" && typeof c === "string")
      .map(([k, c]) => [k, rinominata(c)]),
  );
  const testo = (a) =>
    typeof a === "string"
      ? a
      : (Array.isArray(a?.personaggi) ? a.personaggi : [])
          .map((p) => breve(rinominata(String(p?.classe ?? ""))))
          .filter(Boolean)
          .join("/");
  return {
    istanza: ISTANZE.some((i) => i.id === dati.istanza) ? dati.istanza : ISTANZE[0].id,
    giocatori: dati.giocatori.map((g) => ({
      nome: String(g?.nome ?? ""),
      presente: g?.presente !== false,
      run: runSalvate(g?.run),
      account: (Array.isArray(g?.account) ? g.account : []).map((a) => (g?.tanker === true ? conTanker(testo(a), soprannomi) : testo(a))),
    })),
    jolly: dati.jolly.map((j) => ({
      nome: String(j?.nome ?? ""),
      disponibile: j?.disponibile !== false,
      classi: typeof j?.classi === "string" ? j.classi : testo(j),
    })),
    soprannomi,
    escluse: Array.isArray(dati.escluse) ? dati.escluse.filter((c) => typeof c === "string").map(rinominata) : [],
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
  // "2 High Priest (almeno 1 HP Tanker)", o "1 Sniper Incubus" se lo sono tutti.
  const obbligatorio = (p) => {
    if (!p.forti) return quanti(p.quanti, p);
    const forte = classeForte(i, p.ruolo);
    return p.forti === p.quanti ? `${p.quanti} ${forte}` : quanti(p.quanti, p) + tr(` (almeno ${p.forti} ${forte})`, ` (at least ${p.forti} ${forte})`);
  };
  const desiderato = (p) =>
    `${quanti(p.desiderati, p)} per run` +
    (p.alternativa ? tr(` (se manca, ${quanti(p.desiderati, p.alternativa)})`, ` (or, if there is none, ${quanti(p.desiderati, p.alternativa)})`) : "");
  const elenca = (parti) => (parti.length === 1 ? parti[0] : `${parti.slice(0, -1).join(", ")} ${tr("e", "and")} ${parti.at(-1)}`);
  // I posti di ogni tipo di run: "1 Champion, 1 High Priest, ... e 1 Professor; oppure ...".
  const tipi = i.tipi
    ? tr(" e una di queste composizioni: ", " and one of these: ") +
      i.tipi.map((t) => elenca(t.posti.filter((p) => p.quanti > 0).map(obbligatorio))).join(tr("; oppure ", "; or "))
    : "";
  const nomeRuolo = (ruolo) => i.posti.find((p) => p.ruolo === ruolo)?.nome ?? ruolo;
  const massimi = i.posti
    .filter((p) => p.massimo !== undefined)
    .map((p) => tr(`al massimo ${quanti(p.massimo, p)} per run`, `at most ${quanti(p.massimo, p)} per run`));
  const liberi = i.liberi
    ? tr(`. Gli altri posti sono solo per ${i.liberi.map(nomeRuolo).join(" o ")}`, `. The other slots are only for ${i.liberi.map(nomeRuolo).join(" or ")}`)
    : tr(". Gli altri posti sono liberi, per qualsiasi classe", ". The other slots are free, for any class");
  document.getElementById("composizione").textContent =
    tr(`${i.nome}: ogni run ha al massimo ${i.maxParty} persone e deve avere `, `${i.nome}: each run has at most ${i.maxParty} people and must have `) +
    obbligatori.map(obbligatorio).join(", ") +
    tipi +
    liberi +
    (massimi.length ? `, ${massimi.join(", ")}` : "") +
    (desiderati.length
      ? tr(
          `; fra questi, se c'è, viene prima ${desiderati.map(desiderato).join(" e ")}`,
          `; among these, if there is one, ${desiderati.map(desiderato).join(" and ")} comes first`,
        )
      : "") +
    tr(
      `. Un id macchina entra al massimo ${i.maxRun} volte, ogni volta con un account diverso.`,
      `. A Hardware ID enters at most ${i.maxRun} times, each time with a different account.`,
    );
  document.getElementById("ordine").textContent =
    tr("Le run migliori: prima il numero di run, poi far entrare tutti il più possibile, ", "The best runs: first the number of runs, then letting everyone in as much as possible, ") +
    // Meno run dell'ultimo tipo, poi del penultimo: "poi meno run con Sniper Incubus, poi meno run con HP Tanker".
    (i.tipi ?? []).slice(1).reverse().map((t) => tr(`poi meno run con ${t.nome}, `, `then fewer runs with ${t.nome}, `)).join("") +
    desiderati.map((p) => tr(`poi ${desiderato(p)}, `, `then ${desiderato(p)}, `)).join("") +
    i.preferiti.map((p) => `${tr("poi più", "then more")} ${p.nome}${p.perche ? ` (${p.perche})` : ""}, `).join("") +
    tr("poi run equilibrate.", "then balanced runs.");
  disegnaEscluse();
}

// Colonne di account nella tabella: almeno 3, o quante ne ha chi ne ha di piu'; "+" ne aggiunge una.
let minimoColonne = 3;
const colonne = () => Math.max(minimoColonne, ...stato.giocatori.map((g) => g.account.length));
// Ogni colonna di account larga in proporzione al testo piu' lungo che contiene (fra 7 e 18
// caratteri, piu' 3 per il margine della casella): le colonne quasi vuote lasciano spazio a
// quelle piene (Alberto, 23/10/2026).
const modelloAccount = () =>
  [...Array(colonne())]
    .map((_, ai) => {
      const piuLungo = Math.max(0, ...stato.giocatori.map((g) => (g.account[ai] ?? "").length));
      return `minmax(0, ${Math.min(18, Math.max(7, piuLungo)) + 3}fr)`;
    })
    .join(" ");
const aggiornaColonne = () => giocatoriEl.style.setProperty("--account", modelloAccount());

/** Il campo di un account: rosso se contiene parole che la pagina non riconosce. Il testo intero
 *  sta anche nel suggerimento, per le caselle troppo strette. */
function campoClassi(testo, attributi, segnaposto) {
  const ignoto = leggiClassi(testo, stato.soprannomi).ignote.length > 0;
  return `<input type="text" class="classi${ignoto ? " ignoto" : ""}" value="${escape(testo)}" title="${escape(testo)}" placeholder="${segnaposto}"
    ${attributi} spellcheck="false" autocomplete="off" aria-label="${segnaposto}">`;
}

function disegnaGiocatori() {
  const n = colonne();
  aggiornaColonne();
  const intestazione = `<div class="riga intestazione">
    <span>${tr("Presente", "Present")}</span><span>${NOME_GIOCATORE}</span><span>Run</span>${[...Array(n)].map((_, i) => `<span>Account ${i + 1}</span>`).join("")}
    <button class="btn small" type="button" data-azione="nuova-colonna" title="${tr("Una colonna di account in più", "One more account column")}" aria-label="${tr("Una colonna di account in più", "One more account column")}">+</button>
  </div>`;
  const righe = stato.giocatori.map(
    (g, gi) => `<div class="riga${g.presente ? "" : " spento"}">
      <input type="checkbox" data-g="${gi}" data-campo="presente"${g.presente ? " checked" : ""} aria-label="${tr("Presente", "Present")}">
      <input type="text" class="nome" value="${escape(g.nome)}" placeholder="${NOME_GIOCATORE} ${gi + 1}" data-g="${gi}" data-campo="nome" aria-label="${tr("Nome del giocatore", "Player name")}">
      <span class="quante"><span>Run</span>${[...Array(istanza().maxRun)].map((_, k) => {
        const titolo = tr(`C'è nella run ${k + 1}`, `Present in run ${k + 1}`);
        return `<button class="btn small" type="button" data-g="${gi}" data-r="${k + 1}" data-azione="run" aria-pressed="${g.run.includes(k + 1)}" title="${titolo}" aria-label="${titolo}">${k + 1}</button>`;
      }).join("")}</span>
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
      <input type="text" class="nome" value="${escape(j.nome)}" placeholder="${NOME_JOLLY} ${ji + 1}" data-j="${ji}" data-campo="nome" aria-label="${tr("Nome dell'Account Gilda", "Guild Account name")}">
      ${campoClassi(j.classi, `data-j="${ji}" data-campo="classi"`, tr("Classi", "Classes"))}
      <button class="btn small danger" type="button" data-j="${ji}" data-azione="togli-jolly" title="${tr("Togli l'Account Gilda", "Remove the Guild Account")}" aria-label="${tr("Togli l'Account Gilda", "Remove the Guild Account")}">✕</button>
    </div>`,
  );
  jollyEl.innerHTML = stato.jolly.length ? intestazione + righe.join("") : `<p class="hint">${tr("Nessun Account Gilda.", "No Guild Accounts.")}</p>`;
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
  stato.jolly.forEach((j, i) => raccogli(j.classi, `${tr("Account Gilda", "Guild Account")} ${j.nome || i + 1}`));

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
    .map((g, indice) => ({ nome: g.nome || `${NOME_GIOCATORE} ${indice + 1}`, presente: g.presente, run: g.run, account: g.account }))
    .filter((g) => g.presente)
    .map((g) => ({
      ...g,
      // `numero`: la colonna della tabella, per "Per la run N" (le caselle vuote non entrano nel calcolo).
      account: g.account.map((testo, i) => ({ personaggi: personaggi(testo), numero: i + 1 })).filter((a) => a.personaggi.length > 0),
    }));
  const jolly = stato.jolly
    .map((j, indice) => ({ nome: j.nome || `${NOME_JOLLY} ${indice + 1}`, disponibile: j.disponibile, personaggi: personaggi(j.classi) }))
    .filter((j) => j.disponibile);
  return { presenti, jolly };
}

const plurale = (n, uno, molti) => `${n} ${n === 1 ? uno : molti}`;

// Le combinazioni di run trovate con gli stessi dati (Alberto, 24/10/2026): la prima e' quella del
// calcolo, le altre le aggiunge `›`, e le frecce le scorrono. Si riparte quando i dati cambiano.
let combinazioni = { chiave: null, lista: [], mostrata: 0 };

/** Il calcolo con i dati della pagina nella combinazione mostrata, o null senza giocatori presenti. */
function calcola() {
  const { presenti, jolly } = datiCalcolo();
  const chiave = JSON.stringify([stato.istanza, presenti, jolly]);
  if (chiave !== combinazioni.chiave) {
    const lista = presenti.length > 0 ? [{ presenti, jolly, esito: calcolaRun(presenti, jolly, istanza()) }] : [];
    combinazioni = { chiave, lista, mostrata: 0 };
  }
  return combinazioni.lista[combinazioni.mostrata] ?? null;
}

/** Ridisegna le run e rimette il fuoco sulla freccia premuta, che il disegno ha sostituito. */
function mostraCombinazione(azione) {
  disegnaRun(calcola());
  const freccia = risultatoEl.querySelector(`[data-azione="${azione}"]`);
  (freccia.disabled ? risultatoEl.querySelector("[data-azione=\"combinazione-dopo\"]") : freccia).focus();
}

/** Cerca una combinazione diversa da quelle gia' trovate; falso se non ne trova. */
function nuovaCombinazione() {
  const [base] = combinazioni.lista;
  const viste = new Set(combinazioni.lista.map((c) => firmaRun(c.esito)));
  const inizio = performance.now();
  // Dieci tentativi bastano quasi sempre; il tempo e' un limite per le gilde grandi.
  for (let tentativo = 0; tentativo < 10 && performance.now() - inizio < 1500; tentativo++) {
    const esito = altraCombinazione(base.presenti, base.jolly, istanza(), base.esito);
    if (esito && !viste.has(firmaRun(esito))) {
      combinazioni.lista.push({ ...base, esito });
      combinazioni.mostrata = combinazioni.lista.length - 1;
      return true;
    }
  }
  return false;
}

// Le scritte del risultato, uguali nella pagina e nel txt delle run.
/** Persone, Sniper e chi tanka in una run: "7 persone, 2 Sniper, con Champion". */
const descriviRun = (run) =>
  [
    plurale(run.membri.length, tr("persona", "person"), tr("persone", "people")),
    ...contoPreferiti(run.preferiti),
    ...(run.tipo === null ? [] : [tr(`con ${istanza().tipi[run.tipo].nome}`, `with ${istanza().tipi[run.tipo].nome}`)]),
  ].join(", ");

// Nel riepilogo solo il primo preferito: degli altri il conto comprenderebbe i posti obbligatori.
const contoPreferiti = (conti) => (istanza().preferiti.length ? [`${conti[0]} ${istanza().preferiti[0].nome}`] : []);
const riepilogo = (esito) => [
  plurale(esito.run.length, "run", tr("run", "runs")),
  plurale(esito.entrate, tr("entrata", "entry"), tr("entrate", "entries")),
  ...contoPreferiti(esito.preferiti),
  ...(esito.jolly ? [plurale(esito.jolly, tr("Account Gilda usato", "Guild Account used"), tr("Account Gilda usati", "Guild Accounts used"))] : []),
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
      account: tr("non ha altri account e gli Account Gilda sono finiti", "they have no other accounts and the Guild Accounts are used up"),
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
  disegnaRun(calcola());
  disegnaSuggerimenti(combinazioni.lista[0] ?? null);
}

function disegnaRun(calcolo) {
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
  const { lista: trovate, mostrata } = combinazioni;
  html.push(`<div class="combinazioni">
    <button class="btn small" type="button" data-azione="combinazione-prima"${mostrata === 0 ? " disabled" : ""} aria-label="${tr("Combinazione precedente", "Previous arrangement")}" title="${tr("Combinazione precedente", "Previous arrangement")}">‹</button>
    <span>${tr(`Combinazione ${mostrata + 1} di ${trovate.length}`, `Arrangement ${mostrata + 1} of ${trovate.length}`)}</span>
    <button class="btn small" type="button" data-azione="combinazione-dopo" aria-label="${mostrata < trovate.length - 1 ? tr("Combinazione successiva", "Next arrangement") : tr("Cerca un'altra combinazione", "Find another arrangement")}" title="${mostrata < trovate.length - 1 ? tr("Combinazione successiva", "Next arrangement") : tr("Cerca un'altra combinazione con lo stesso risultato", "Find another arrangement with the same result")}">›</button>
  </div>`);

  esito.run.forEach((run, i) => {
    const righe = run.membri.map((m) => {
      const { giocatore, p, jolly: nomeJolly } = membro(presenti, jolly, m);
      const etichette =
        (m.tank ? `<span class="tag">Tanker</span>` : "") +
        (nomeJolly === null ? "" : `<span class="tag">${tr("Account Gilda", "Guild Account")}: ${escape(nomeJolly)}</span>`);
      return `<tr>
        <td class="${m.posto ? "" : "libero"}">${m.posto ? escape(m.posto) : tr("libero", "free")}</td>
        <td>${escape(giocatore)}</td>
        <td>${escape(classeMostrata(p.classe))}${etichette}</td>
      </tr>`;
    });
    html.push(`
      <article class="stage">
        <div class="stage-num">${i + 1}</div>
        <div>
          <h3 class="stage-title">Run ${i + 1}</h3>
          <div class="stage-range">${escape(descriviRun(run))}</div>
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

/** Le classi dell'istanza da proporre, come i pulsanti delle run: accese le proposte, spente le escluse. */
function disegnaEscluse() {
  esclusiEl.innerHTML =
    `<span>${tr("Classi da proporre:", "Classes to suggest:")}</span>` +
    istanza()
      .classi.map((c) => {
        const proposta = !stato.escluse.includes(c.nome);
        const titolo = proposta ? tr("Proposta: un clic la esclude", "Suggested: click to exclude it") : tr("Esclusa: un clic la propone", "Excluded: click to suggest it");
        return `<button class="btn small" type="button" data-esclusa="${escape(c.nome)}" aria-pressed="${proposta}" title="${titolo}">${escape(nomeClasse(c.nome))}</button>`;
      })
      .join("");
}

/** I personaggi da creare, un passo dopo l'altro (`suggerisci`). */
function disegnaSuggerimenti(calcolo) {
  if (!calcolo) {
    suggerimentiEl.innerHTML = "";
    return;
  }
  const { presenti, jolly } = calcolo;
  const esito = suggerisci(presenti, jolly, istanza(), stato.escluse);
  const voce = (n) => {
    const nome = presenti[n.giocatore].nome;
    return n.nuovo
      ? tr(`${nome}: ${n.classe}, account ${n.numero} nuovo`, `${nome}: ${n.classe}, new account ${n.numero}`)
      : tr(`${nome}: ${n.classe} nell'account ${n.numero}`, `${nome}: ${n.classe} in account ${n.numero}`);
  };
  const blocco = (titolo, righe) =>
    `<div class="note-line"><strong>${escape(titolo)}</strong>${righe.length ? `<ul>${righe.map((r) => `<li>${escape(r)}</li>`).join("")}</ul>` : ""}</div>`;
  const html = [];
  let entrate = esito.entrate;
  for (const passo of esito.passi) {
    const titolo =
      passo.run !== null
        ? tr(`Per la run ${passo.run}:`, `For run ${passo.run}:`)
        : tr(
            `Per far giocare più persone, ${passo.entrate} entrate invece di ${entrate}:`,
            `To let more people play, ${passo.entrate} entries instead of ${entrate}:`,
          );
    html.push(blocco(titolo, passo.nuovi.map(voce)));
    entrate = passo.entrate;
  }
  if (esito.bloccate) {
    const { run, escluse } = esito.bloccate;
    html.push(
      blocco(
        escluse.length
          ? tr(`Per la run ${run} servono classi escluse: ${escluse.join(", ")}.`, `Run ${run} needs excluded classes: ${escluse.join(", ")}.`)
          : tr(`Per la run ${run} non bastano personaggi nuovi: servono più giocatori.`, `New characters are not enough for run ${run}: more players are needed.`),
        [],
      ),
    );
  }
  suggerimentiEl.innerHTML = html.length
    ? html.join("")
    : `<p class="summary">${tr("Nessun personaggio nuovo aggiunge run o fa giocare più persone.", "No new character adds runs or lets more people play.")}</p>`;
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
        (m.tank ? ", Tanker" : "") +
        (nomeJolly === null ? "" : `, ${tr("Account Gilda", "Guild Account")} ${nomeJolly}`)
      );
    });
    elenco(`Run ${i + 1}, ${descriviRun(run)}`, voci);
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
    el.title = el.value;
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
  el.value = el.title = pulito;
  if (campo === "classi") oggetto.classi = pulito;
  else {
    oggetto.account[el.dataset.a] = pulito;
    while (oggetto.account.length && !oggetto.account.at(-1)) oggetto.account.pop();
    aggiornaColonne();
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

esclusiEl.addEventListener("click", (event) => {
  const classe = event.target.closest("[data-esclusa]")?.dataset.esclusa;
  if (classe === undefined) return;
  stato.escluse = stato.escluse.includes(classe) ? stato.escluse.filter((c) => c !== classe) : [...stato.escluse, classe];
  disegnaEscluse();
  cambiato(false);
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
    case "run": {
      // Una run accesa o spenta; almeno una resta accesa, se no il giocatore non c'e' e basta togliere Presente.
      const g = stato.giocatori[d.g];
      const r = Number(d.r);
      const altre = g.run.filter((x) => x !== r);
      if (altre.length === 0) return;
      g.run = g.run.includes(r) ? altre : [...g.run, r].sort();
      break;
    }
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
      if (!confirm(tr(`Togliere ${stato.jolly[d.j].nome || "l'Account Gilda"}?`, `Remove ${stato.jolly[d.j].nome || "the Guild Account"}?`))) return;
      stato.jolly.splice(d.j, 1);
      break;
    case "dimentica":
      delete stato.soprannomi[d.chiave];
      break;
    // Svuota giocatori e jolly; istanza e soprannomi imparati restano, perche' l'elenco in txt non li ha.
    case "ricomincia":
      if (!confirm(tr("Togliere tutti i giocatori e gli Account Gilda? I soprannomi imparati restano. Prima puoi salvarli con Backup dei dati o Esporta l'elenco.", "Remove all players and Guild Accounts? The learned nicknames stay. You can save them first with Data backup or Export the list."))) return;
      stato.giocatori = [];
      stato.jolly = [];
      minimoColonne = 3;
      break;
    case "esporta":
      esporta();
      return;
    case "importa":
      file.click();
      return;
    case "apri-elenco":
      apriElenco();
      return;
    case "chiudi-elenco":
      incollaEl.hidden = true;
      return;
    case "applica-elenco":
      applicaElenco();
      return;
    case "esporta-elenco":
      scarica(`party-elenco-${oggi()}.txt`, scriviElenco(stato));
      return;
    case "combinazione-prima":
      combinazioni.mostrata = Math.max(combinazioni.mostrata - 1, 0);
      mostraCombinazione("combinazione-prima");
      return;
    case "combinazione-dopo":
      if (combinazioni.mostrata < combinazioni.lista.length - 1) combinazioni.mostrata++;
      else if (!nuovaCombinazione()) {
        avvisa(tr("Non ho trovato altre combinazioni con lo stesso risultato.", "No other arrangement with the same result found."));
        return;
      }
      mostraCombinazione("combinazione-dopo");
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
    disegnaIstanza();
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
const applicaEl = document.getElementById("applica");

/** L'elenco letto con i soprannomi imparati; null se il campo e' vuoto. */
const elencoLetto = () => (elencoEl.value.trim() ? leggiElenco(elencoEl.value, stato.soprannomi) : null);

/** Il campo si apre con l'elenco della pagina, per correggerlo e scrivere i nuovi in fondo (Alberto, 24/10/2026). */
function apriElenco() {
  const testo = scriviElenco(stato, false);
  elencoEl.value = testo ? `${testo}\n` : "";
  elencoEl.rows = Math.min(Math.max(elencoEl.value.split("\n").length, 9), 24);
  incollaEl.hidden = false;
  disegnaAnteprima();
  elencoEl.focus();
  elencoEl.setSelectionRange(elencoEl.value.length, elencoEl.value.length);
  elencoEl.scrollTop = elencoEl.scrollHeight;
}

/**
 * Cosa cambia nella tabella con l'elenco del campo, per nome (maiuscole a parte). La tabella si
 * confronta riletta dal suo elenco, cosi' le due parti hanno la stessa forma.
 */
function cambiamenti(letto) {
  const prima = leggiElenco(scriviElenco(stato, false), stato.soprannomi);
  const esito = { nuovi: [], modificati: [], tolti: [] };
  for (const lista of ["giocatori", "jolly"]) {
    const vecchi = new Map(prima[lista].map((x) => [x.nome.toLowerCase(), x]));
    for (const x of letto[lista]) {
      const vecchio = vecchi.get(x.nome.toLowerCase());
      if (!vecchio) esito.nuovi.push(x.nome);
      else if (JSON.stringify(vecchio) !== JSON.stringify(x)) esito.modificati.push(x.nome);
      vecchi.delete(x.nome.toLowerCase());
    }
    esito.tolti.push(...[...vecchi.values()].map((x) => x.nome));
  }
  // Le righe senza account (o un Account Gilda senza classi) non sono nell'elenco: si tolgono anche loro.
  const vuoti = [...stato.giocatori.filter((g) => !g.account.some((a) => a.trim())), ...stato.jolly.filter((j) => !j.classi.trim())];
  esito.tolti.push(...vuoti.map((x) => x.nome.trim()).filter(Boolean));
  return esito;
}

/** Cosa cambia nella tabella con il testo del campo, o cosa va corretto. */
function disegnaAnteprima() {
  const letto = elencoLetto();
  applicaEl.disabled = !letto || letto.errori.length > 0 || letto.giocatori.length + letto.jolly.length === 0;
  if (!letto) {
    anteprimaEl.innerHTML = "";
  } else if (letto.errori.length) {
    anteprimaEl.innerHTML = `<div class="empty"><strong>${tr("Da correggere nel testo:", "To fix in the text:")}</strong><ul>${letto.errori.map((e) => `<li>${escape(e)}</li>`).join("")}</ul></div>`;
  } else {
    const { nuovi, modificati, tolti } = cambiamenti(letto);
    const parti = [
      [tr("Nuovi", "New"), nuovi],
      [tr("Modificati", "Changed"), modificati],
      [tr("Da togliere", "To remove"), tolti],
    ].filter(([, nomi]) => nomi.length > 0);
    anteprimaEl.innerHTML = `<p class="hint">${parti.length
      ? parti.map(([titolo, nomi]) => `${titolo}: ${escape(nomi.join(", "))}.`).join(" ")
      : tr("Nessuna modifica alla tabella.", "No changes to the table.")}</p>`;
  }
}

/** La tabella diventa l'elenco del campo: chi non c'e' piu' si toglie, dopo una conferma. */
function applicaElenco() {
  const letto = elencoLetto();
  if (!letto) return;
  const { nuovi, modificati, tolti } = cambiamenti(letto);
  if (tolti.length && !confirm(tr(
    `Togliere dalla tabella ${tolti.join(", ")}? Non sono nell'elenco.`,
    `Remove ${tolti.join(", ")} from the table? They are not in the list.`,
  ))) return;
  stato.giocatori = letto.giocatori.map((g) => ({ nome: g.nome, presente: g.presente, run: g.run ?? TUTTE_LE_RUN, account: g.account }));
  stato.jolly = letto.jolly.map((j) => ({ nome: j.nome, disponibile: j.disponibile, classi: j.classi }));
  cambiato(true);
  incollaEl.hidden = true;
  avvisa(tr(
    `Elenco applicato: ${plurale(nuovi.length, "nuovo", "nuovi")}, ${plurale(modificati.length, "modificato", "modificati")}, ${plurale(tolti.length, "tolto", "tolti")}.`,
    `List applied: ${nuovi.length} new, ${modificati.length} changed, ${tolti.length} removed.`,
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
