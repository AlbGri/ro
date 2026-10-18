/**
 * Pagina del party: giocatori, account, personaggi e jolly, e le run calcolate.
 *
 * I dati restano in questo browser, nella chiave `ragnarok-party/stato`, con il
 * prefisso del servizio come chiede il sito; si portano altrove con un file.
 */

import { calcolaRun } from "./calcolo.js";
import { ALTRO, ISTANZE } from "./dati.js";

const STORAGE_KEY = "ragnarok-party/stato";

const giocatoriEl = document.getElementById("giocatori");
const jollyEl = document.getElementById("jolly");
const risultatoEl = document.getElementById("risultato");
const istanzaEl = document.getElementById("istanza");

const escape = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// ----------------------------------------------------------------- stato ---

const nuovoPersonaggio = () => ({ nome: "", classe: "" });
const nuovoAccount = () => ({ personaggi: [nuovoPersonaggio()] });

let stato = { istanza: ISTANZE[0].id, giocatori: [], jolly: [] };
const istanza = () => ISTANZE.find((i) => i.id === stato.istanza);

/**
 * Lo stato da un oggetto letto (localStorage o file), con i campi mancanti a posto.
 * La classe resta com'e' anche se non e' dell'istanza scelta: puo' contare per un'altra.
 */
function normalizza(dati) {
  if (!dati || !Array.isArray(dati.giocatori) || !Array.isArray(dati.jolly)) throw new Error("formato non valido");
  const personaggi = (lista) =>
    (Array.isArray(lista) ? lista : []).map((p) => ({
      nome: String(p?.nome ?? ""),
      classe: String(p?.classe ?? ""),
    }));
  return {
    istanza: ISTANZE.some((i) => i.id === dati.istanza) ? dati.istanza : ISTANZE[0].id,
    giocatori: dati.giocatori.map((g) => ({
      nome: String(g?.nome ?? ""),
      presente: g?.presente !== false,
      account: (Array.isArray(g?.account) ? g.account : []).map((a) => ({ personaggi: personaggi(a?.personaggi) })),
    })),
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
  document.getElementById("composizione").textContent =
    `${i.nome}: ogni run ha al massimo ${i.maxParty} persone e deve avere ` +
    i.posti.map((p) => `${p.quanti} ${p.nome}`).join(", ") +
    `. Gli altri posti sono liberi, per qualsiasi classe. Un id macchina entra al massimo ${i.maxRun} volte, ogni volta con un account diverso.`;
  document.getElementById("ordine").textContent =
    "Le run migliori: prima il numero di run, poi far entrare tutti il più possibile, " +
    (i.preferito ? `poi più ${i.nomePreferito} (${i.perchePreferito}), ` : "") +
    "poi run equilibrate.";
}

/** Le righe dei personaggi di un account; `percorso` sono i data- che lo individuano. */
function disegnaPersonaggi(personaggi, percorso) {
  return personaggi
    .map(
      (p, i) => `
      <div class="pg">
        <select ${percorso} data-p="${i}" data-campo="classe" aria-label="Classe">${opzioniClasse(p.classe)}</select>
        <input type="text" placeholder="Nome" value="${escape(p.nome)}" ${percorso} data-p="${i}" data-campo="nome-pg" aria-label="Nome del personaggio">
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

const nomePersonaggio = (p) => {
  const classe = escape(classeMostrata(p.classe));
  return p.nome ? `${escape(p.nome)} <span class="stage-range">${classe}</span>` : classe;
};
const plurale = (n, uno, molti) => `${n} ${n === 1 ? uno : molti}`;

function aggiorna() {
  const { presenti, jolly } = datiCalcolo();
  if (presenti.length === 0) {
    risultatoEl.innerHTML = `<p class="empty">Nessun giocatore presente.</p>`;
    return;
  }
  const i = istanza();
  const esito = calcolaRun(presenti, jolly, i);
  const preferiti = (n) => (i.preferito ? `, ${plurale(n, i.nomePreferito, i.nomePreferito)}` : "");
  const html = [];

  if (esito.run.length === 0) {
    html.push(`<div class="empty">Nessuna run possibile. Per farne una:<ul>${esito.mancano.map((m) => `<li>${escape(m)}</li>`).join("") || "<li>servono combinazioni diverse: due personaggi dello stesso giocatore non stanno nella stessa run</li>"}</ul></div>`);
    risultatoEl.innerHTML = html.join("");
    return;
  }

  html.push(
    `<p class="summary"><strong>${plurale(esito.run.length, "run", "run")}</strong>, ${plurale(esito.entrate, "entrata", "entrate")}${preferiti(esito.preferiti)}${esito.jolly ? `, ${plurale(esito.jolly, "jolly usato", "jolly usati")}` : ""}.</p>`,
  );

  esito.run.forEach((run, i) => {
    const righe = run.membri.map((m) => {
      const g = presenti[m.giocatore];
      const account = m.jolly === null ? g.account[m.account] : jolly[m.jolly];
      const p = account.personaggi[m.personaggio];
      const etichetta = m.jolly === null ? "" : `<span class="tag">jolly: ${escape(jolly[m.jolly].nome)}</span>`;
      return `<tr>
        <td class="${m.posto ? "" : "libero"}">${m.posto ? escape(m.posto) : "libero"}</td>
        <td>${escape(g.nome)}</td>
        <td>${nomePersonaggio(p)}${etichetta}</td>
      </tr>`;
    });
    html.push(`
      <article class="stage">
        <div class="stage-num">${i + 1}</div>
        <div>
          <h3 class="stage-title">Run ${i + 1}</h3>
          <div class="stage-range">${plurale(run.membri.length, "persona", "persone")}${preferiti(run.preferiti)}</div>
          <table><thead><tr><th>Posto</th><th>Giocatore</th><th>Personaggio</th></tr></thead><tbody>${righe.join("")}</tbody></table>
        </div>
      </article>`);
  });

  if (esito.fuori.length > 0) {
    const righe = esito.fuori.map((f) => {
      const perche = f.motivo === "piena"
        ? `le altre run sono piene (${i.maxParty} persone)`
        : "non ha altri account e i jolly sono finiti";
      return `<li>${escape(presenti[f.giocatore].nome)}: ${f.entrate} run su ${esito.run.length}, ${perche}</li>`;
    });
    html.push(`<div class="note-line"><strong>Non giocano tutte le run:</strong><ul>${righe.join("")}</ul></div>`);
  }
  if (esito.mancano.length > 0) {
    html.push(`<div class="note-line"><strong>Per la run ${esito.run.length + 1}:</strong><ul>${esito.mancano.map((m) => `<li>${escape(m)}</li>`).join("")}</ul></div>`);
  }
  risultatoEl.innerHTML = html.join("");
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
  if (campo === "nome-pg") oggetto.personaggi[el.dataset.p].nome = el.value;
  else if (campo === "classe") oggetto.personaggi[el.dataset.p].classe = el.value;
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
    default:
      return;
  }
  cambiato(true);
});

function esporta() {
  const blob = new Blob([JSON.stringify(stato, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `party-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  avvisa(`Il browser scarica ${link.download}: conservalo, e con Ripristina da backup recuperi i dati.`);
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
