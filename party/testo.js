/**
 * L'elenco della gilda in testo libero, come lo scrivono i giocatori su Discord
 * (Alberto, 22/10/2026: si raccolgono i messaggi in un testo solo e si incolla):
 *
 *   Efreeet
 *   1) HP/Devo/Clown/Sniper
 *   2) Prete
 *   3) Bragi
 *   Account Gilda Gilda1: Clown
 *
 * Una riga con un nome e' un giocatore; una riga che comincia con un numero o un
 * trattino e' un suo account, con le classi separate da / , + o "e". Va bene anche
 * il messaggio copiato da Discord, "[19:40]Efreeet: 1) HP/...": l'ora si toglie e
 * quello che segue il nome e' il primo account. "Account Gilda nome: classi" e' un jolly.
 * Fra parentesi dopo il nome le run in cui c'e': "Efreeet (run 1-2)". Fino alla 1.17 anche la spunta
 * HP Tanker del giocatore, che diventa HP Tanker nei suoi High Priest.
 * Le parole valgono nelle due lingue, qualunque sia quella della pagina (Alberto,
 * 22/10/2026): "Guild Account nome: classi", "HP and Sniper", "Other".
 * Solo le classi, niente nomi dei personaggi: "basta la classe" (Alberto).
 */

import { ALTRO, CLASSI, HP_TANKER, MAX_RUN, TANKER, tr } from "./dati.js";

// I soprannomi che si usano in gilda (Alberto, 22/10/2026: "non e' tanto standard").
// SP Song e Bragi sono le canzoni di Dancer e Bard: valgono come Gypsy e Clown, le classi rinate
// (Alberto, 23/10/2026). Gli altri li impara la pagina, quando chi incolla sceglie la classe.
export const SOPRANNOMI = {
  hp: "High Priest",
  prete: "Priest",
  sniper: "Sniper",
  snip: "Sniper",
  bragi: "Clown",
  "sp song": "Gypsy",
  "tanker hp": HP_TANKER,
  prof: "Professor",
  champ: "Champion",
  devo: "Paladin",
  pala: "Paladin",
  pally: "Paladin",
  creo: "Creator",
  bio: "Creator",
  biochem: "Creator",
  biochemist: "Creator",
  hw: "High Wizard",
  wiz: "High Wizard",
  sl: "Soul Linker",
};

/** Una parola come chiave di confronto: minuscole, senza accenti, spazi semplici. */
export const chiave = (parola) =>
  parola
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Le parole note: nomi delle classi, Altro e i soprannomi. */
function paroleNote(imparati) {
  const note = {};
  for (const classe of CLASSI) note[chiave(classe)] = classe;
  note[chiave(ALTRO)] = ALTRO;
  note.other = ALTRO;
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
  [HP_TANKER]: TANKER,
  Professor: "Prof",
  Champion: "Champ",
  "High Wizard": "HW",
  "Soul Linker": "SL",
};
/** La forma breve di una classe ("HP" per High Priest); le altre restano come sono. */
export const breve = (classe) => BREVE[classe] ?? classe;

const ORA = /^\[\d{1,2}:\d{2}(?::\d{2})?\]\s*/;
const ACCOUNT = /^(?:\d+\s*[).:-]|[-*•])\s*(.*)$/;
// "Jolly" era il nome fino alla 1.11: lo hanno gli elenchi esportati prima
const JOLLY = /^(?:account gilda|jolly|guild account)\b([^:]*):(.*)$/i;
const SEPARATORI = /\s*(?:[/,+;&]|\s+(?:e|and)\s+)\s*/i;
// "Account Gilda" e "Guild Account": la parola che apre la riga di un jolly, e il suo nome predefinito
const JOLLY_PAROLA = tr("Account Gilda", "Guild Account");

const PARENTESI = /\s*\(([^)]*)\)\s*$/;
const PAROLE_TANKER = ["hp tanker", "tanker hp"];

/**
 * Le run di "run 1-2", "run 2", "run 1+3", o di "2 run" (fino alla 1.14: quante run, che si
 * leggono come le prime). Null se non e' una scritta cosi'.
 */
function leggiRun(parte) {
  const vecchia = parte.match(/^(\d)\s*runs?$/i);
  if (vecchia) return [...Array(Math.min(Number(vecchia[1]), MAX_RUN)).keys()].map((r) => r + 1);
  const nuova = parte.match(/^runs?\s+([1-9](?:\s*[-+]\s*[1-9])*)$/i);
  if (!nuova) return null;
  const run = new Set();
  for (const pezzo of nuova[1].replace(/\s/g, "").split("+")) {
    const [da, a = da] = pezzo.split("-").map(Number);
    for (let r = da; r <= a; r++) run.add(r);
  }
  const esito = [...run].filter((r) => r <= MAX_RUN).sort();
  return esito.length > 0 ? esito : null;
}

/** "run 1-2", "run 2" o "run 1+3": come `leggiRun` le rilegge. */
function scriviRun(run) {
  const consecutive = run.every((r, i) => i === 0 || r === run[i - 1] + 1);
  if (run.length === 1) return `run ${run[0]}`;
  return consecutive ? `run ${run[0]}-${run.at(-1)}` : `run ${run.join("+")}`;
}

/**
 * Nome, spunta HP Tanker (fino alla 1.17) e run in cui c'e' un giocatore: "Efreeet (HP Tanker, run 1-2)".
 * Una parentesi con altre parole resta nel nome. `run` e' null se la riga non lo dice.
 */
function segni(riga) {
  const trovata = riga.match(PARENTESI);
  const esito = { nome: riga, tanker: false, run: null };
  if (!trovata) return esito;
  for (const parte of trovata[1].split(",").map((p) => p.trim())) {
    const run = leggiRun(parte);
    if (PAROLE_TANKER.includes(chiave(parte))) esito.tanker = true;
    else if (run) esito.run = run;
    // "run 1, 2": la virgola separa anche le voci, quindi un numero da solo dopo le run e' un'altra run.
    else if (esito.run && /^[1-9]$/.test(parte) && Number(parte) <= MAX_RUN) esito.run = [...new Set([...esito.run, Number(parte)])].sort();
    else return { nome: riga, tanker: false, run: null };
  }
  return { ...esito, nome: riga.replace(PARENTESI, "") };
}

/**
 * Le parole di un account. Una parte fra due separatori che non e' una classe si divide negli
 * spazi: "Snip Prof Bragi" sono tre classi (Alberto, 23/10/2026). Si prende ogni volta la
 * sequenza piu' lunga che e' una classe, cosi' "High Priest" e "SP Song" restano intere; le parole
 * sconosciute vicine restano insieme, come "Lord Knight", da imparare una volta sola.
 */
function parole(testo, imparati) {
  const esito = [];
  for (const parte of testo.split(SEPARATORI).filter((p) => chiave(p))) {
    const spezzate = parte.trim().split(/\s+/);
    if (spezzate.length === 1 || riconosci(parte, imparati)) {
      esito.push(parte);
      continue;
    }
    let ignota = [];
    for (let i = 0; i < spezzate.length; ) {
      let j = spezzate.length;
      while (j > i && !riconosci(spezzate.slice(i, j).join(" "), imparati)) j--;
      if (j === i) {
        ignota.push(spezzate[i++]);
        continue;
      }
      if (ignota.length) esito.push(ignota.join(" "));
      ignota = [];
      esito.push(spezzate.slice(i, j).join(" "));
      i = j;
    }
    if (ignota.length) esito.push(ignota.join(" "));
  }
  return esito.filter((p) => chiave(p));
}

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
  for (const parola of parole(testo, imparati)) {
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
  for (const parola of parole(testo, imparati)) {
    const classe = riconosci(parola, imparati)?.classe;
    const scritta = !classe || classe === ALTRO ? parola.trim() : breve(classe);
    if (!fatte.some((f) => chiave(f) === chiave(scritta))) fatte.push(scritta);
  }
  return fatte.join("/");
}

/**
 * Il testo di un account con gli High Priest scritti come HP Tanker: per la spunta HP Tanker del
 * giocatore, fino alla 1.17, che valeva per tutti i suoi High Priest.
 */
export function conTanker(testo, imparati = {}) {
  return parole(testo, imparati)
    .map((p) => (riconosci(p, imparati)?.classe === "High Priest" ? TANKER : p.trim()))
    .join("/");
}

/**
 * Legge l'elenco incollato.
 *
 * @param {string} testo
 * @param {Object<string, string>} imparati i soprannomi imparati, chiave -> classe
 * @returns {{giocatori: Array<{nome: string, run: number[] | null, account: string[]}>, jolly: Array<{nome: string, classi: string}>,
 *   errori: string[]}} gli account e le classi dei jolly gia' riscritti con `pulisci`
 */
export function leggiElenco(testo, imparati = {}) {
  const esito = { giocatori: [], jolly: [], errori: [] };
  let giocatore = null;
  const aggiungiAccount = (scritte) => {
    const pulito = pulisci(giocatore.tanker ? conTanker(scritte, imparati) : scritte, imparati);
    if (pulito) giocatore.account.push(pulito);
  };

  testo.split(/\r?\n/).forEach((grezza, i) => {
    const riga = i + 1;
    const testoRiga = grezza.trim().replace(ORA, "");
    if (!testoRiga || testoRiga.startsWith("#")) return;

    const jolly = testoRiga.match(JOLLY);
    if (jolly) {
      esito.jolly.push({ nome: jolly[1].trim() || `${JOLLY_PAROLA} ${esito.jolly.length + 1}`, classi: pulisci(jolly[2], imparati) });
      return;
    }
    const account = testoRiga.match(ACCOUNT);
    if (account) {
      if (!giocatore) esito.errori.push(tr(`riga ${riga}: un account prima del nome del giocatore`, `line ${riga}: an account before the player's name`));
      else aggiungiAccount(account[1]);
      return;
    }
    const dueP = testoRiga.indexOf(":");
    const { nome, tanker, run } = segni((dueP < 0 ? testoRiga : testoRiga.slice(0, dueP)).trim());
    const resto = dueP < 0 ? "" : testoRiga.slice(dueP + 1).trim();
    // "HP/Sniper" senza numero davanti sembrerebbe un giocatore che si chiama cosi'.
    const scritte = parole(nome, imparati);
    if (scritte.length > 0 && scritte.every((p) => riconosci(p, imparati)?.corretta === false)) {
      esito.errori.push(tr(
        `riga ${riga}: "${nome}" sembra un account, non un giocatore: scrivi un numero davanti, come 1) ${nome}`,
        `line ${riga}: "${nome}" looks like an account, not a player: write a number in front, like 1) ${nome}`,
      ));
      return;
    }
    giocatore = { nome, tanker, run, account: [] };
    esito.giocatori.push(giocatore);
    if (resto) aggiungiAccount(resto.match(ACCOUNT)?.[1] ?? resto);
  });
  esito.giocatori = esito.giocatori.map(({ tanker, ...g }) => g);

  for (const g of esito.giocatori) if (g.account.length === 0) esito.errori.push(tr(`${g.nome} non ha account`, `${g.nome} has no accounts`));
  return esito;
}

/** Tutti i giocatori e i jolly in un testo che `leggiElenco` rilegge. */
export function scriviElenco(stato) {
  const blocchi = [];
  stato.giocatori.forEach((g, i) => {
    const account = g.account.filter((a) => a.trim());
    const run = g.run && g.run.length < MAX_RUN ? ` (${scriviRun(g.run)})` : "";
    const nome = (g.nome || `${tr("Giocatore", "Player")} ${i + 1}`) + run;
    if (account.length > 0) blocchi.push([nome, ...account.map((a, k) => `${k + 1}) ${a}`)].join("\n"));
  });
  const jolly = stato.jolly
    .filter((j) => j.classi.trim())
    .map((j, i) => `${JOLLY_PAROLA} ${j.nome || `${JOLLY_PAROLA} ${i + 1}`}: ${j.classi}`);
  if (jolly.length > 0) blocchi.push(jolly.join("\n"));
  const testa = tr(
    "# Elenco della gilda per la pagina Party: si incolla in \"Incolla l'elenco della gilda\".",
    "# Guild list for the Party page: paste it in \"Paste the guild list\".",
  );
  return `${testa}\n\n${blocchi.join("\n\n")}\n`;
}
