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

// Come la pagina riscrive una classe riconosciuta: corta, come la si scrive su Discord.
const BREVE = {
  "High Priest": "HP",
  "Clown/Bard": "Clown",
  "Gypsy/Dancer": "Gypsy",
  Professor: "Prof",
  Champion: "Champ",
  "High Wizard": "HW",
};
/** La forma breve di una classe ("HP" per High Priest); le altre restano come sono. */
export const breve = (classe) => BREVE[classe] ?? classe;

const ORA = /^\[\d{1,2}:\d{2}(?::\d{2})?\]\s*/;
const ACCOUNT = /^(?:\d+\s*[).:-]|[-*•])\s*(.*)$/;
const JOLLY = /^jolly\b([^:]*):(.*)$/i;
const SEPARATORI = /\s*(?:[/,+;&]|\s+e\s+)\s*/i;

const parole = (testo) => testo.split(SEPARATORI).filter((p) => chiave(p));

/**
 * Le classi scritte in un account, come "HP/Devo/Clown".
 *
 * @param {string} testo
 * @param {Object<string, string>} imparati i soprannomi imparati, chiave -> classe
 * @returns {{classi: string[], ignote: string[]}} le classi senza doppioni e le parole non riconosciute
 */
export function leggiClassi(testo, imparati = {}) {
  const classi = [];
  const ignote = [];
  for (const parola of parole(testo)) {
    const classe = riconosci(parola, imparati)?.classe;
    if (!classe) ignote.push(parola);
    else if (!classi.includes(classe)) classi.push(classe);
  }
  return { classi, ignote };
}

/**
 * Il testo di un account riscritto: le classi riconosciute nella forma breve, le
 * parole sconosciute come sono, tutto separato da "/". Una parola imparata come
 * Altro resta com'e' scritta: "Stalker" dice piu' di "Altro".
 */
export function pulisci(testo, imparati = {}) {
  const fatte = [];
  for (const parola of parole(testo)) {
    const classe = riconosci(parola, imparati)?.classe;
    const scritta = !classe || classe === ALTRO ? parola.trim() : breve(classe);
    if (!fatte.some((f) => chiave(f) === chiave(scritta))) fatte.push(scritta);
  }
  return fatte.join("/");
}

/**
 * Legge l'elenco incollato.
 *
 * @param {string} testo
 * @param {Object<string, string>} imparati i soprannomi imparati, chiave -> classe
 * @returns {{giocatori: Array<{nome: string, account: string[]}>, jolly: Array<{nome: string, classi: string}>,
 *   errori: string[]}} gli account e le classi dei jolly gia' riscritti con `pulisci`
 */
export function leggiElenco(testo, imparati = {}) {
  const esito = { giocatori: [], jolly: [], errori: [] };
  let giocatore = null;
  const aggiungiAccount = (scritte) => {
    const pulito = pulisci(scritte, imparati);
    if (pulito) giocatore.account.push(pulito);
  };

  testo.split(/\r?\n/).forEach((grezza, i) => {
    const riga = i + 1;
    const testoRiga = grezza.trim().replace(ORA, "");
    if (!testoRiga || testoRiga.startsWith("#")) return;

    const jolly = testoRiga.match(JOLLY);
    if (jolly) {
      esito.jolly.push({ nome: jolly[1].trim() || `Jolly ${esito.jolly.length + 1}`, classi: pulisci(jolly[2], imparati) });
      return;
    }
    const account = testoRiga.match(ACCOUNT);
    if (account) {
      if (!giocatore) esito.errori.push(`riga ${riga}: un account prima del nome del giocatore`);
      else aggiungiAccount(account[1]);
      return;
    }
    const dueP = testoRiga.indexOf(":");
    const nome = (dueP < 0 ? testoRiga : testoRiga.slice(0, dueP)).trim();
    const resto = dueP < 0 ? "" : testoRiga.slice(dueP + 1).trim();
    // "HP/Sniper" senza numero davanti sembrerebbe un giocatore che si chiama cosi'.
    const scritte = parole(nome);
    if (scritte.length > 0 && scritte.every((p) => riconosci(p, imparati)?.corretta === false)) {
      esito.errori.push(`riga ${riga}: "${nome}" sembra un account, non un giocatore: scrivi un numero davanti, come 1) ${nome}`);
      return;
    }
    giocatore = { nome, account: [] };
    esito.giocatori.push(giocatore);
    if (resto) aggiungiAccount(resto.match(ACCOUNT)?.[1] ?? resto);
  });

  for (const g of esito.giocatori) if (g.account.length === 0) esito.errori.push(`${g.nome} non ha account`);
  return esito;
}

/** Tutti i giocatori e i jolly in un testo che `leggiElenco` rilegge. */
export function scriviElenco(stato) {
  const blocchi = [];
  stato.giocatori.forEach((g, i) => {
    const account = g.account.filter((a) => a.trim());
    if (account.length > 0) blocchi.push([g.nome || `Giocatore ${i + 1}`, ...account.map((a, k) => `${k + 1}) ${a}`)].join("\n"));
  });
  const jolly = stato.jolly
    .filter((j) => j.classi.trim())
    .map((j, i) => `Jolly ${j.nome || `Jolly ${i + 1}`}: ${j.classi}`);
  if (jolly.length > 0) blocchi.push(jolly.join("\n"));
  return `# Elenco della gilda per la pagina Party: si incolla in "Incolla l'elenco della gilda".\n\n${blocchi.join("\n\n")}\n`;
}
