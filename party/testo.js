/**
 * L'elenco della gilda in testo libero, come lo scrivono i giocatori su Discord
 * (Alberto, 22/10/2026: si raccolgono i messaggi in un testo solo e si incolla):
 *
 *   Efreeet
 *   1) HP/Devo/Clown/Sniper
 *   2) Prete
 *   3) Bragi
 *   Jolly Gilda1: Clown
 *
 * Una riga con un nome e' un giocatore; una riga che comincia con un numero o un
 * trattino e' un suo account, con le classi separate da / , + o "e". Va bene anche
 * il messaggio copiato da Discord, "[19:40]Efreeet: 1) HP/...": l'ora si toglie e
 * quello che segue il nome e' il primo account. "Jolly nome: classi" e' un jolly.
 * Solo le classi, niente nomi dei personaggi: "basta la classe" (Alberto).
 */

import { ALTRO, CLASSI } from "./dati.js";

// I soprannomi che si usano in gilda (Alberto, 22/10/2026: "non e' tanto standard").
// SP Song e Bragi sono le canzoni di Dancer e Bard. Gli altri li impara la pagina, quando chi
// incolla sceglie la classe.
export const SOPRANNOMI = {
  hp: "High Priest",
  prete: "Priest",
  sniper: "Sniper",
  bragi: "Clown/Bard",
  "sp song": "Gypsy/Dancer",
  prof: "Professor",
  champ: "Champion",
  devo: "Paladin",
  pala: "Paladin",
  creo: "Creator",
  bio: "Creator",
  biochem: "Creator",
  biochemist: "Creator",
  hw: "High Wizard",
  wiz: "High Wizard",
};

/** Una parola come chiave di confronto: minuscole, senza accenti, spazi semplici. */
export const chiave = (parola) =>
  parola
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Le parole note: nomi delle classi, ognuna delle due di "Clown/Bard", Altro e i soprannomi. */
function paroleNote(imparati) {
  const note = {};
  for (const classe of CLASSI) {
    note[chiave(classe)] = classe;
    for (const parte of classe.split("/")) note[chiave(parte)] = classe;
  }
  note[chiave(ALTRO)] = ALTRO;
  return { ...note, ...SOPRANNOMI, ...imparati };
}

/** Lettere da cambiare, aggiungere o togliere per passare da una parola all'altra. */
function distanza(a, b) {
  let riga = [...Array(b.length + 1).keys()];
  for (let i = 1; i <= a.length; i++) {
    const nuova = [i];
    for (let j = 1; j <= b.length; j++) {
      nuova.push(Math.min(riga[j] + 1, nuova[j - 1] + 1, riga[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)));
    }
    riga = nuova;
  }
  return riga[b.length];
}

/**
 * La classe di una parola, o null se non la riconosce. Una parola di almeno 5
 * lettere con una lettera sbagliata (due da 8 lettere in su) vale come la piu'
 * vicina, se e' una sola: "Processor" e' Professor. Le parole corte no, perche'
 * HP e HW sono a una lettera di distanza.
 *
 * @param {string} parola
 * @param {Object<string, string>} imparati chiave -> classe, scelti da chi incolla
 * @returns {{classe: string, corretta: boolean} | null}
 */
export function riconosci(parola, imparati = {}) {
  const k = chiave(parola);
  const note = paroleNote(imparati);
  if (note[k]) return { classe: note[k], corretta: false };
  if (k.length < 5) return null;
  const soglia = k.length >= 8 ? 2 : 1;
  let migliore = null;
  let pari = false;
  for (const [nota, classe] of Object.entries(note)) {
    if (nota.length < 5) continue;
    const d = distanza(k, nota);
    if (d > soglia) continue;
    if (!migliore || d < migliore.d) {
      migliore = { d, classe };
      pari = false;
    } else if (d === migliore.d && classe !== migliore.classe) pari = true;
  }
  return migliore && !pari ? { classe: migliore.classe, corretta: true } : null;
}

const ORA = /^\[\d{1,2}:\d{2}(?::\d{2})?\]\s*/;
const ACCOUNT = /^(?:\d+\s*[).:-]|[-*•])\s*(.*)$/;
const JOLLY = /^jolly\b([^:]*):(.*)$/i;
const SEPARATORI = /\s*(?:[/,+;&]|\s+e\s+)\s*/i;

/**
 * Legge l'elenco incollato.
 *
 * @param {string} testo
 * @param {Object<string, string>} imparati i soprannomi imparati, chiave -> classe
 * @returns {{giocatori: Array<{nome: string, account: Array<{personaggi: Array<{classe: string}>}>}>,
 *   jolly: Array<{nome: string, personaggi: Array<{classe: string}>}>,
 *   dubbi: Array<{parola: string, chiave: string, chi: string, riga: number}>,
 *   corretti: Array<{parola: string, classe: string, chi: string, riga: number}>, errori: string[]}}
 *   `dubbi`: parole non riconosciute, una per chiave; `corretti`: errori di battitura corretti
 */
export function leggiElenco(testo, imparati = {}) {
  const esito = { giocatori: [], jolly: [], dubbi: [], corretti: [], errori: [] };
  let giocatore = null;

  const personaggi = (scritte, chi, riga) => {
    const classi = [];
    for (const parola of scritte.split(SEPARATORI).filter((p) => chiave(p))) {
      const trovata = riconosci(parola, imparati);
      if (!trovata) {
        if (!esito.dubbi.some((d) => d.chiave === chiave(parola))) esito.dubbi.push({ parola: parola.trim(), chiave: chiave(parola), chi, riga });
        continue;
      }
      if (trovata.corretta) esito.corretti.push({ parola: parola.trim(), classe: trovata.classe, chi, riga });
      if (!classi.includes(trovata.classe)) classi.push(trovata.classe);
    }
    return classi.map((classe) => ({ classe }));
  };
  const aggiungiAccount = (scritte, riga) => {
    const p = personaggi(scritte, giocatore.nome, riga);
    if (p.length > 0) giocatore.account.push({ personaggi: p });
  };

  testo.split(/\r?\n/).forEach((grezza, i) => {
    const riga = i + 1;
    const testoRiga = grezza.trim().replace(ORA, "");
    if (!testoRiga || testoRiga.startsWith("#")) return;

    const jolly = testoRiga.match(JOLLY);
    if (jolly) {
      const nome = jolly[1].trim() || `Jolly ${esito.jolly.length + 1}`;
      esito.jolly.push({ nome, personaggi: personaggi(jolly[2], nome, riga) });
      return;
    }
    const account = testoRiga.match(ACCOUNT);
    if (account) {
      if (!giocatore) esito.errori.push(`riga ${riga}: un account prima del nome del giocatore`);
      else aggiungiAccount(account[1], riga);
      return;
    }
    const dueP = testoRiga.indexOf(":");
    const nome = (dueP < 0 ? testoRiga : testoRiga.slice(0, dueP)).trim();
    const resto = dueP < 0 ? "" : testoRiga.slice(dueP + 1).trim();
    // "HP/Sniper" senza numero davanti sembrerebbe un giocatore che si chiama cosi'.
    const parole = nome.split(SEPARATORI).filter((p) => chiave(p));
    if (parole.length > 0 && parole.every((p) => riconosci(p, imparati)?.corretta === false)) {
      esito.errori.push(`riga ${riga}: "${nome}" sembra un account, non un giocatore: scrivi un numero davanti, come 1) ${nome}`);
      return;
    }
    giocatore = { nome, account: [] };
    esito.giocatori.push(giocatore);
    if (resto) aggiungiAccount(resto.match(ACCOUNT)?.[1] ?? resto, riga);
  });

  for (const g of esito.giocatori) {
    if (g.account.length === 0 && !esito.dubbi.some((d) => d.chi === g.nome)) esito.errori.push(`${g.nome} non ha account`);
  }
  return esito;
}

/** Come si scrive una classe nell'elenco: "Clown" per Clown/Bard, Altro per le classi che non contano. */
const scritta = (classe) => (CLASSI.includes(classe) ? classe.split("/")[0] : ALTRO);

/** Tutti i giocatori e i jolly in un testo che `leggiElenco` rilegge. */
export function scriviElenco(stato) {
  const classi = (personaggi) => [...new Set(personaggi.filter((p) => p.classe).map((p) => scritta(p.classe)))].join("/");
  const blocchi = [];
  stato.giocatori.forEach((g, i) => {
    const account = g.account.map((a) => classi(a.personaggi)).filter(Boolean);
    if (account.length > 0) blocchi.push([g.nome || `Giocatore ${i + 1}`, ...account.map((c, k) => `${k + 1}) ${c}`)].join("\n"));
  });
  const jolly = stato.jolly
    .map((j, i) => [j.nome || `Jolly ${i + 1}`, classi(j.personaggi)])
    .filter(([, c]) => c)
    .map(([nome, c]) => `Jolly ${nome}: ${c}`);
  if (jolly.length > 0) blocchi.push(jolly.join("\n"));
  return `# Elenco della gilda per la pagina Party: si incolla in "Incolla l'elenco della gilda".\n\n${blocchi.join("\n\n")}\n`;
}
