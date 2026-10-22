/**
 * Pagina del party: giocatori, account, personaggi e jolly, e le run calcolate.
 *
 * I dati restano in questo browser, nella chiave `ragnarok-party/stato`, con il
 * prefisso del servizio come chiede il sito; si portano altrove con un file.
 * L'elenco della gilda si incolla in testo libero, letto da `testo.js`; i soprannomi
 * imparati stanno nello stato, in `soprannomi`.
 */

import { calcolaRun } from "./calcolo.js";
import { ALTRO, CLASSI, ISTANZE } from "./dati.js";
import { leggiElenco, scriviElenco } from "./testo.js";

const STORAGE_KEY = "ragnarok-party/stato";

const giocatoriEl = document.getElementById("giocatori");
const jollyEl = document.getElementById("jolly");
const risultatoEl = document.getElementById("risultato");
const istanzaEl = document.getElementById("istanza");

const escape = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// ----------------------------------------------------------------- stato ---

const nuovoPersonaggio = () => ({ classe: "" });
const nuovoAccount = () => ({ personaggi: [nuovoPersonaggio()] });

let stato = { istanza: ISTANZE[0].id, giocatori: [], jolly: [], soprannomi: {} };
const istanza = () => ISTANZE.find((i) => i.id === stato.istanza);

/**
 * Lo stato da un oggetto letto (localStorage o file), con i campi mancanti a posto.
 * La classe resta com'e' anche se non e' dell'istanza scelta: puo' contare per un'altra.
 */
function normalizza(dati) {
  if (!dati || !Array.isArray(dati.giocatori) || !Array.isArray(dati.jolly)) throw new Error("formato non valido");
  const personaggi = (lista) =>
    (Array.isArray(lista) ? lista : []).map((p) => ({ classe: String(p?.classe ?? "") }));
  return {
    istanza: ISTANZE.some((i) => i.id === dati.istanza) ? dati.istanza : ISTANZE[0].id,
    giocatori: dati.giocatori.map((g) => ({
      nome: String(g?.nome ?? ""),
      presente: g?.presente !== false,
      account: (Array.isArray(g?.account) ? g.account : []).map((a) => ({ personaggi: personaggi(a?.personaggi) })),
    })),
    soprannomi: Object.fromEntries(
      Object.entries(dati.soprannomi ?? {}).filter(([k, c]) => typeof k === "string" && typeof c === "string"),
    ),
    jolly: dati.jolly.map((j) => ({
      nome: String(j?.nome ?? ""),
      disponibile: j?.disponibile !== false,
      personaggi: personaggi(j?.personaggi),
    })),
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

// --------------------------------------------------------------- disegno ---

/** La classe come si mostra: una classe che non conta per l'istanza e' Altro. */
const classeMostrata = (classe) => (!classe || istanza().classi.some((c) => c.nome === classe) ? classe : ALTRO);

/** Le classi che contano per l'istanza e Altro. */
function opzioniClasse(scelta) {
  const nomi = [...istanza().classi.map((c) => c.nome), ALTRO];
  const mostrata = classeMostrata(scelta);
  return (
    `<option value=""${mostrata ? "" : " selected"}>Classe…</option>` +
    nomi.map((n) => `<option${n === mostrata ? " selected" : ""}>${escape(n)}</option>`).join("")
  );
}

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
  const massimi = i.posti.filter((p) => p.massimo !== undefined).map((p) => `al massimo ${quanti(p.massimo, p)} per run`);
  const liberi = i.liberi
    ? `. Gli altri posti sono solo per ${i.liberi.map(nomeRuolo).join(" o ")}`
    : ". Gli altri posti sono liberi, per qualsiasi classe";
  document.getElementById("composizione").textContent =
    `${i.nome}: ogni run ha al massimo ${i.maxParty} persone e deve avere ` +
    obbligatori.map((p) => quanti(p.quanti, p)).join(", ") +
    liberi +
    (massimi.length ? `, ${massimi.join(", ")}` : "") +
    (desiderati.length
      ? `; fra questi, se c'è, viene prima ${desiderati.map((p) => quanti(p.desiderati, p)).join(" e ")} per run`
      : "") +
    `. Un id macchina entra al massimo ${i.maxRun} volte, ogni volta con un account diverso.`;
  document.getElementById("ordine").textContent =
    "Le run migliori: prima il numero di run, poi far entrare tutti il più possibile, " +
    desiderati.map((p) => `poi ${quanti(p.desiderati, p)} per run, `).join("") +
    i.preferiti.map((p) => `poi più ${p.nome}${p.perche ? ` (${p.perche})` : ""}, `).join("") +
    "poi run equilibrate.";
}

/** Le righe dei personaggi di un account; `percorso` sono i data- che lo individuano. */
function disegnaPersonaggi(personaggi, percorso) {
  return personaggi
    .map(
      (p, i) => `
      <div class="pg">
        <select ${percorso} data-p="${i}" data-campo="classe" aria-label="Classe">${opzioniClasse(p.classe)}</select>
        <button class="btn small danger" type="button" ${percorso} data-p="${i}" data-azione="togli-pg" title="Togli il personaggio" aria-label="Togli il personaggio">✕</button>
      </div>`,
    )
    .join("");
}

function disegnaGiocatori() {
  giocatoriEl.innerHTML = stato.giocatori.length
    ? stato.giocatori
        .map(
          (g, gi) => `
      <div class="card${g.presente ? "" : " spento"}">
        <div class="card-head">
          <input type="text" placeholder="Giocatore ${gi + 1}" value="${escape(g.nome)}" data-g="${gi}" data-campo="nome" aria-label="Nome del giocatore">
          <label class="check"><input type="checkbox" data-g="${gi}" data-campo="presente"${g.presente ? " checked" : ""}> Presente</label>
          <button class="btn small danger" type="button" data-g="${gi}" data-azione="togli-giocatore">Togli</button>
        </div>
        <div class="accounts">${g.account
          .map(
            (a, ai) => `
          <div class="account">
            <div class="account-head">
              <span>Account ${ai + 1}</span>
              <button class="btn small danger" type="button" data-g="${gi}" data-a="${ai}" data-azione="togli-account">Togli</button>
            </div>
            ${disegnaPersonaggi(a.personaggi, `data-g="${gi}" data-a="${ai}"`)}
            <div><button class="btn small" type="button" data-g="${gi}" data-a="${ai}" data-azione="nuovo-pg">Aggiungi personaggio</button></div>
          </div>`,
          )
          .join("")}</div>
        <div class="card-foot"><button class="btn small" type="button" data-g="${gi}" data-azione="nuovo-account">Aggiungi account</button></div>
      </div>`,
        )
        .join("")
    : `<p class="hint">Nessun giocatore.</p>`;
}

function disegnaJolly() {
  jollyEl.innerHTML = stato.jolly.length
    ? stato.jolly
        .map(
          (j, ji) => `
      <div class="card${j.disponibile ? "" : " spento"}">
        <div class="card-head">
          <input type="text" placeholder="Jolly ${ji + 1}" value="${escape(j.nome)}" data-j="${ji}" data-campo="nome" aria-label="Nome del jolly">
          <label class="check"><input type="checkbox" data-j="${ji}" data-campo="disponibile"${j.disponibile ? " checked" : ""}> Disponibile</label>
          <button class="btn small danger" type="button" data-j="${ji}" data-azione="togli-jolly">Togli</button>
        </div>
        ${disegnaPersonaggi(j.personaggi, `data-j="${ji}"`)}
        <div class="card-foot"><button class="btn small" type="button" data-j="${ji}" data-azione="nuovo-pg">Aggiungi personaggio</button></div>
      </div>`,
        )
        .join("")
    : `<p class="hint">Nessun jolly.</p>`;
}

// ----------------------------------------------------------------- calcolo ---

/** Giocatori presenti e jolly disponibili, solo con i personaggi di cui e' scelta la classe. */
function datiCalcolo() {
  const conClasse = (lista) => lista.filter((p) => p.classe);
  const presenti = stato.giocatori
    .map((g, indice) => ({ indice, nome: g.nome || `Giocatore ${indice + 1}`, presente: g.presente, account: g.account }))
    .filter((g) => g.presente)
    .map((g) => ({ ...g, account: g.account.map((a) => ({ personaggi: conClasse(a.personaggi) })) }));
  const jolly = stato.jolly
    .map((j, indice) => ({ nome: j.nome || `Jolly ${indice + 1}`, disponibile: j.disponibile, personaggi: conClasse(j.personaggi) }))
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
  plurale(esito.run.length, "run", "run"),
  plurale(esito.entrate, "entrata", "entrate"),
  ...contoPreferiti(esito.preferiti),
  ...(esito.jolly ? [plurale(esito.jolly, "jolly usato", "jolly usati")] : []),
];
const nessunaRun = (esito) =>
  esito.mancano.length ? esito.mancano : ["servono combinazioni diverse: due personaggi dello stesso giocatore non stanno nella stessa run"];
const nonGiocano = (presenti, esito) =>
  esito.fuori.map((f) => {
    const perche = {
      piena: `le altre run sono piene (${istanza().maxParty} persone)`,
      posti: "per i personaggi dei suoi altri account non c'è posto",
      account: "non ha altri account e i jolly sono finiti",
    }[f.motivo];
    return `${presenti[f.giocatore].nome}: ${f.entrate} run su ${esito.run.length}, ${perche}`;
  });
/** Il personaggio di un membro e, se gioca un jolly, il nome del jolly. */
function membro(presenti, jolly, m) {
  const account = m.jolly === null ? presenti[m.giocatore].account[m.account] : jolly[m.jolly];
  return { giocatore: presenti[m.giocatore].nome, p: account.personaggi[m.personaggio], jolly: m.jolly === null ? null : jolly[m.jolly].nome };
}

function aggiorna() {
  const calcolo = calcola();
  if (!calcolo) {
    risultatoEl.innerHTML = `<p class="empty">Nessun giocatore presente.</p>`;
    return;
  }
  const { presenti, jolly, esito } = calcolo;
  const lista = (righe) => `<ul>${righe.map((r) => `<li>${escape(r)}</li>`).join("")}</ul>`;
  const html = [];

  if (esito.run.length === 0) {
    risultatoEl.innerHTML = `<div class="empty">Nessuna run possibile. Per farne una:${lista(nessunaRun(esito))}</div>`;
    return;
  }

  const [quanteRun, ...resto] = riepilogo(esito);
  html.push(`<p class="summary"><strong>${quanteRun}</strong>, ${escape(resto.join(", "))}.</p>`);

  esito.run.forEach((run, i) => {
    const righe = run.membri.map((m) => {
      const { giocatore, p, jolly: nomeJolly } = membro(presenti, jolly, m);
      const etichetta = nomeJolly === null ? "" : `<span class="tag">jolly: ${escape(nomeJolly)}</span>`;
      return `<tr>
        <td class="${m.posto ? "" : "libero"}">${m.posto ? escape(m.posto) : "libero"}</td>
        <td>${escape(giocatore)}</td>
        <td>${escape(classeMostrata(p.classe))}${etichetta}</td>
      </tr>`;
    });
    html.push(`
      <article class="stage">
        <div class="stage-num">${i + 1}</div>
        <div>
          <h3 class="stage-title">Run ${i + 1}</h3>
          <div class="stage-range">${escape([plurale(run.membri.length, "persona", "persone"), ...contoPreferiti(run.preferiti)].join(", "))}</div>
          <table><thead><tr><th>Posto</th><th>Giocatore</th><th>Classe</th></tr></thead><tbody>${righe.join("")}</tbody></table>
        </div>
      </article>`);
  });

  if (esito.fuori.length > 0) {
    html.push(`<div class="note-line"><strong>Non giocano tutte le run:</strong>${lista(nonGiocano(presenti, esito))}</div>`);
  }
  if (esito.mancano.length > 0) {
    html.push(`<div class="note-line"><strong>Per la run ${esito.run.length + 1}:</strong>${lista(esito.mancano)}</div>`);
  }
  risultatoEl.innerHTML = html.join("");
}

/** Le run calcolate in un testo da girare alla gilda. */
function testoRun({ presenti, jolly, esito }) {
  const oggi = new Date().toLocaleDateString("it-IT");
  const righe = [`${istanza().nome}, run del ${oggi}`];
  const elenco = (titolo, voci) => righe.push("", titolo, ...voci.map((v) => `- ${v}`));
  if (esito.run.length === 0) {
    elenco("Nessuna run possibile. Per farne una:", nessunaRun(esito));
    return righe.join("\n") + "\n";
  }
  righe.push(`${riepilogo(esito).join(", ")}.`);
  esito.run.forEach((run, i) => {
    const voci = run.membri.map((m) => {
      const { giocatore, p, jolly: nomeJolly } = membro(presenti, jolly, m);
      const classe = classeMostrata(p.classe);
      return (
        `${m.posto ?? "Libero"}: ${giocatore}` +
        (m.posto ? "" : ` (${classe})`) +
        (nomeJolly === null ? "" : `, jolly ${nomeJolly}`)
      );
    });
    elenco(`Run ${i + 1}, ${[plurale(run.membri.length, "persona", "persone"), ...contoPreferiti(run.preferiti)].join(", ")}`, voci);
  });
  if (esito.fuori.length > 0) elenco("Non giocano tutte le run:", nonGiocano(presenti, esito));
  if (esito.mancano.length > 0) elenco(`Per la run ${esito.run.length + 1}:`, esito.mancano);
  return righe.join("\n") + "\n";
}

// ------------------------------------------------------------- eventi ---

/** L'account o il jolly a cui si riferisce un elemento con data-g/data-a o data-j. */
function contenitore(el) {
  const d = el.dataset;
  if (d.j !== undefined) return stato.jolly[d.j];
  if (d.a !== undefined) return stato.giocatori[d.g].account[d.a];
  return stato.giocatori[d.g];
}

let attesa;
function cambiato(ridisegna) {
  salva();
  if (ridisegna) {
    disegnaGiocatori();
    disegnaJolly();
  }
  clearTimeout(attesa);
  attesa = setTimeout(aggiorna, 300);
}

document.addEventListener("input", (event) => {
  const el = event.target;
  const campo = el.dataset.campo;
  if (!campo) return;
  const oggetto = contenitore(el);
  if (campo === "classe") oggetto.personaggi[el.dataset.p].classe = el.value;
  else if (campo === "presente" || campo === "disponibile") {
    oggetto[campo] = el.checked;
    el.closest(".card").classList.toggle("spento", !el.checked);
  } else oggetto[campo] = el.value;
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
      stato.giocatori.push({ nome: "", presente: true, account: [nuovoAccount()] });
      break;
    case "togli-giocatore":
      if (!confirm(`Togliere ${stato.giocatori[d.g].nome || "il giocatore"}?`)) return;
      stato.giocatori.splice(d.g, 1);
      break;
    case "nuovo-account":
      stato.giocatori[d.g].account.push(nuovoAccount());
      break;
    case "togli-account":
      stato.giocatori[d.g].account.splice(d.a, 1);
      break;
    case "nuovo-pg":
      contenitore(el).personaggi.push(nuovoPersonaggio());
      break;
    case "togli-pg":
      contenitore(el).personaggi.splice(d.p, 1);
      break;
    case "nuovo-jolly":
      stato.jolly.push({ nome: "", disponibile: true, personaggi: [nuovoPersonaggio()] });
      break;
    case "togli-jolly":
      if (!confirm(`Togliere ${stato.jolly[d.j].nome || "il jolly"}?`)) return;
      stato.jolly.splice(d.j, 1);
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
    case "dimentica":
      delete stato.soprannomi[d.chiave];
      salva();
      disegnaAnteprima();
      return;
    case "esporta-elenco":
      scarica(`party-elenco-${oggi()}.txt`, scriviElenco(stato));
      return;
    case "esporta-run": {
      const calcolo = calcola();
      if (!calcolo) avvisa("Nessun giocatore presente.");
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
  avvisa(`Il browser scarica ${nome}: conservalo, e con Ripristina da backup recuperi i dati.`);
}

file.addEventListener("change", async () => {
  const scelto = file.files[0];
  file.value = "";
  if (!scelto) return;
  try {
    const nuovo = normalizza(JSON.parse(await scelto.text()));
    if (!confirm("Sostituire i dati della pagina con quelli del file?")) return;
    stato = nuovo;
    cambiato(true);
    avvisa("Dati importati.");
  } catch {
    avvisa("Il file non è un export di questa pagina.");
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

/** Cosa ha capito la pagina dell'elenco incollato, e le parole da riconoscere. */
function disegnaAnteprima() {
  const letto = elencoLetto();
  const html = [];
  const lista = (righe) => `<ul>${righe.join("")}</ul>`;
  if (letto) {
    if (letto.errori.length) {
      html.push(`<div class="empty"><strong>Da correggere nel testo:</strong>${lista(letto.errori.map((e) => `<li>${escape(e)}</li>`))}</div>`);
    }
    if (letto.dubbi.length) {
      const opzioni = [...CLASSI, ALTRO].map((c) => `<option>${escape(c)}</option>`).join("");
      const righe = letto.dubbi.map(
        (d) => `<li><label class="dubbio">"${escape(d.parola)}" (${escape(d.chi)}, riga ${d.riga}) è
          <select data-dubbio="${escape(d.chiave)}"><option value="">Classe…</option>${opzioni}</select></label></li>`,
      );
      html.push(`<div class="note-line"><strong>Parole da riconoscere:</strong> scegli la classe, la pagina se la ricorda.${lista(righe)}</div>`);
    }
    if (letto.corretti.length) {
      const righe = letto.corretti.map((c) => `<li>"${escape(c.parola)}" è ${escape(c.classe)} (${escape(c.chi)}, riga ${c.riga})</li>`);
      html.push(`<div class="note-line"><strong>Corretti:</strong>${lista(righe)}</div>`);
    }
    const classi = (personaggi) => personaggi.map((p) => escape(p.classe)).join(", ");
    const novita = (lista, nome) => (lista.some((x) => stessoNome(x.nome, nome)) ? "aggiornato" : "nuovo");
    const righe = [
      ...letto.giocatori.map(
        (g) => `<li><strong>${escape(g.nome)}</strong> (${novita(stato.giocatori, g.nome)}): ${g.account.map((a, i) => `${i + 1}) ${classi(a.personaggi)}`).join("; ")}</li>`,
      ),
      ...letto.jolly.map((j) => `<li><strong>Jolly ${escape(j.nome)}</strong> (${novita(stato.jolly, j.nome)}): ${classi(j.personaggi)}</li>`),
    ];
    if (righe.length) html.push(`<div class="anteprima-lista"><strong>La pagina ha capito:</strong>${lista(righe)}</div>`);
  }
  const imparati = Object.entries(stato.soprannomi);
  if (imparati.length) {
    const voci = imparati.map(
      ([k, c]) => `<li>"${escape(k)}" è ${escape(c)} <button class="btn small danger" type="button" data-azione="dimentica" data-chiave="${escape(k)}">Dimentica</button></li>`,
    );
    html.push(`<details class="imparati"><summary>Soprannomi imparati (${imparati.length})</summary>${lista(voci)}</details>`);
  }
  anteprimaEl.innerHTML = html.join("");
  aggiungiEl.disabled = !letto || letto.errori.length > 0 || letto.dubbi.length > 0 || letto.giocatori.length + letto.jolly.length === 0;
}

/**
 * Aggiunge l'elenco alla pagina: chi ha lo stesso nome di un giocatore o di un jolly
 * gia' presente prende gli account dell'elenco, gli altri si aggiungono.
 */
function aggiungiElenco() {
  const letto = elencoLetto();
  if (!letto) return;
  const aggiornati = [
    ...letto.giocatori.filter((g) => stato.giocatori.some((x) => stessoNome(x.nome, g.nome))),
    ...letto.jolly.filter((j) => stato.jolly.some((x) => stessoNome(x.nome, j.nome))),
  ].map((x) => x.nome);
  if (aggiornati.length && !confirm(`Sono già nella pagina: ${aggiornati.join(", ")}. Sostituire i loro account con quelli dell'elenco?`)) return;
  for (const g of letto.giocatori) {
    const esistente = stato.giocatori.find((x) => stessoNome(x.nome, g.nome));
    if (esistente) esistente.account = g.account;
    else stato.giocatori.push({ nome: g.nome, presente: true, account: g.account });
  }
  for (const j of letto.jolly) {
    const esistente = stato.jolly.find((x) => stessoNome(x.nome, j.nome));
    if (esistente) esistente.personaggi = j.personaggi;
    else stato.jolly.push({ nome: j.nome, disponibile: true, personaggi: j.personaggi });
  }
  cambiato(true);
  elencoEl.value = "";
  incollaEl.hidden = true;
  const nuovi = letto.giocatori.length + letto.jolly.length - aggiornati.length;
  avvisa(`Elenco aggiunto: ${plurale(nuovi, "nuovo", "nuovi")}, ${plurale(aggiornati.length, "aggiornato", "aggiornati")}.`);
}

elencoEl.addEventListener("input", disegnaAnteprima);
anteprimaEl.addEventListener("change", (event) => {
  const k = event.target.dataset.dubbio;
  if (k === undefined || !event.target.value) return;
  stato.soprannomi[k] = event.target.value;
  salva();
  disegnaAnteprima();
});

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
aggiorna();
