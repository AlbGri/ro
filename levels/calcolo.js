/**
 * Calcolo del percorso piu' economico fino al livello obiettivo.
 *
 * Ogni consegna di una quest e' una mossa che da' EXP e costa gli oggetti da
 * comprare; passare a un altro NPC costa in piu' un prezzo fisso, che conta il
 * viaggio e impedisce piani che saltano da un NPC all'altro per pochi zeny.
 * La ricerca prova tutte le sequenze di consegne, scartando quelle che
 * un'altra batte su tutto (stesso livello, piu' EXP, meno costo, piu' cacce e
 * oggetti ancora da usare) e quelle che anche nel caso
 * migliore costerebbero piu' del piano gia' trovato: il risultato e' il piano
 * col costo minore e, a parita', con meno consegne.
 */

import {
  EXP_NORMALE,
  EXP_RINATO,
  JOB_PRIMA,
  JOB_PRIMA_RINATO,
  JOB_SECONDA,
  JOB_SECONDA_RINATO,
  CACCE,
  CONSEGNE_MASSIME,
  LIVELLO_MASSIMO,
  QUEST,
} from "./dati.js";

/**
 * Moltiplicatore dell'EXP delle quest su uaRO.
 *
 * Il bonus del weekend moltiplica quello del manuale: weekend e manuale al 50%
 * fanno 1,5 x 1,5 = 2,25 (visto in gioco: con 2 le Antelope Horn previste erano
 * 200 di troppo). Di due manuali conta solo il piu' forte, quindi si passa una
 * percentuale sola.
 *
 * @param {boolean} weekend True nel weekend (+50%).
 * @param {number} manuale Percentuale del manuale attivo: 0, 50 o 100.
 * @returns {number} Il moltiplicatore, da 1 a 3.
 */
export function moltiplicatore(weekend, manuale) {
  return (weekend ? 1.5 : 1) * (1 + manuale / 100);
}

/**
 * Aggiunge EXP come fa rAthena (`pc_checkbaselevelup`, `multi_level_up: no`).
 *
 * Un guadagno fa salire al massimo un livello: nel livello nuovo resta al piu'
 * l'EXP richiesta dal livello appena finito, meno 1. Il resto va perso.
 *
 * @param {number[]} tabella EXP per livello (`EXP_NORMALE` o `EXP_RINATO`).
 * @param {number} livello Livello di partenza.
 * @param {number} exp EXP gia' fatta nel livello.
 * @param {number} guadagno EXP ricevuta.
 * @returns {{livello: number, exp: number, persa: number}} Stato dopo il guadagno.
 */
export function aggiungiExp(tabella, livello, exp, guadagno) {
  return aggiungiFinoA(tabella, LIVELLO_MASSIMO, livello, exp, guadagno);
}

function aggiungiFinoA(tabella, massimo, livello, exp, guadagno) {
  let persa = 0;
  exp += guadagno;
  while (livello < massimo && exp >= tabella[livello - 1]) {
    const richiesta = tabella[livello - 1];
    exp -= richiesta;
    if (exp > richiesta - 1) {
      persa += exp - (richiesta - 1);
      exp = richiesta - 1;
    }
    livello++;
  }
  return { livello, exp, persa };
}

// Ogni consegna costa in piu' un millesimo di zeny: a parita' di zeny vince il piano
// con meno consegne, senza mai cambiare la scelta fra piani che differiscono di uno zeny.
const PER_CONSEGNA = 0.001;

/** Coda a priorita' minima (heap binario) con un confronto dato. */
class Coda {
  constructor(prima) {
    this.prima = prima;
    this.elementi = [];
  }

  get vuota() {
    return this.elementi.length === 0;
  }

  aggiungi(elemento) {
    const a = this.elementi;
    a.push(elemento);
    let i = a.length - 1;
    while (i > 0) {
      const padre = (i - 1) >> 1;
      if (!this.prima(a[i], a[padre])) break;
      [a[i], a[padre]] = [a[padre], a[i]];
      i = padre;
    }
  }

  togli() {
    const a = this.elementi;
    const cima = a[0];
    const ultimo = a.pop();
    if (a.length > 0) {
      a[0] = ultimo;
      let i = 0;
      for (;;) {
        const s = 2 * i + 1;
        const d = s + 1;
        let minimo = i;
        if (s < a.length && this.prima(a[s], a[minimo])) minimo = s;
        if (d < a.length && this.prima(a[d], a[minimo])) minimo = d;
        if (minimo === i) break;
        [a[i], a[minimo]] = [a[minimo], a[i]];
        i = minimo;
      }
    }
    return cima;
  }
}

/**
 * Trova il piano che arriva al livello obiettivo con il costo minore.
 *
 * @param {object} opzioni
 * @param {boolean} opzioni.rinato Classe rinata (tabella dell'EXP dei trascendenti).
 * @param {number} opzioni.livello Livello di partenza.
 * @param {number} [opzioni.percentuale=0] Percentuale gia' fatta del livello di partenza.
 * @param {number} opzioni.obiettivo Livello da raggiungere.
 * @param {boolean} [opzioni.weekend=false] Bonus del weekend.
 * @param {number} [opzioni.manuale=0] Manuale attivo: 0, 50 o 100.
 * @param {Object<string, number>} [opzioni.cacce={}] Per id di caccia: quante consegne
 *   da 50 uccisioni sono pronte, da 0 a 3. Si consegnano a qualsiasi livello.
 * @param {?number} [opzioni.rabbocco=null] Se un numero: quando al livello manca al piu'
 *   questa percentuale lo si completa uccidendo mostri, senza consegne.
 * @param {number} [opzioni.cambio=0] Zeny che vale passare a un altro NPC: entra
 *   nel costo da minimizzare, non negli zeny spesi.
 * @param {Object<string, {posseduti?: number, prezzo?: ?number}>} [opzioni.oggetti={}]
 *   Per id di quest: oggetti gia' in inventario e prezzo di uno; senza prezzo
 *   vale quello di `dati.js`.
 * @returns {?object} Il piano, o null se l'obiettivo non si raggiunge: sotto il
 *   livello minimo delle quest.
 */
export function calcolaPiano(opzioni) {
  const {
    rinato,
    livello,
    percentuale = 0,
    obiettivo,
    weekend = false,
    manuale = 0,
    cacce = {},
    rabbocco = null,
    cambio = 0,
    oggetti = {},
  } = opzioni;
  const tabella = rinato ? EXP_RINATO : EXP_NORMALE;
  const molt = moltiplicatore(weekend, manuale);
  const expIniziale = Math.floor((tabella[livello - 1] * percentuale) / 100);

  // Solo le quest con oggetti posseduti hanno bisogno di un contatore nello stato.
  const quest = [];
  for (const q of QUEST) {
    const scelta = oggetti[q.id] ?? {};
    const posseduti = Math.max(0, Math.floor(scelta.posseduti ?? 0));
    const prezzo = scelta.prezzo ?? q.prezzo;
    if (q.min >= obiettivo) continue;
    quest.push({ ...q, posseduti, prezzo, guadagno: Math.floor(q.base * molt), resto: -1 });
  }
  let contatori = 0;
  for (const q of quest) if (q.posseduti > 0) q.resto = contatori++;
  // Cacce pronte: consegne gratis, una per volta, a qualsiasi livello: la quest e'
  // gia' completata e i suoi livelli contano solo per prenderla.
  const pronte = CACCE.map((c) => ({
    ...c,
    consegne: Math.min(CONSEGNE_MASSIME, Math.max(0, Math.floor(cacce[c.id] ?? 0))),
    guadagno: Math.floor(c.base * molt),
  })).filter((c) => c.consegne > 0);

  // EXP che una consegna di caccia perde per il limite di un livello, nel livello
  // migliore da l in poi partendo da 0. Una caccia si consegna solo se non spreca
  // di piu': consegnarla prima, sprecando tanto, non conviene mai in pratica e
  // moltiplicherebbe gli stati da provare.
  for (const c of pronte) {
    c.sprecoMinimo = new Array(obiettivo + 1).fill(Infinity);
    for (let l = obiettivo - 1; l >= 1; l--) {
      const spreco = Math.max(0, c.guadagno - (2 * tabella[l - 1] - 1));
      c.sprecoMinimo[l] = Math.min(c.sprecoMinimo[l + 1], spreco);
    }
  }
  /** EXP delle consegne di caccia ancora da fare, dalla piu' grande. */
  const restanti = (usate) =>
    pronte.flatMap((c, i) => new Array(c.consegne - usate[i]).fill(c.guadagno)).sort((a, b) => b - a);

  /** Zeny di una consegna con `rimasti` oggetti ancora in inventario. */
  const prezzoConsegna = (q, rimasti) => Math.max(0, q.quantita - rimasti) * q.prezzo;

  // Per il limite inferiore: EXP che manca dal livello l all'obiettivo, e il
  // minimo di zeny per punto di EXP fra le quest ancora utilizzabili da l in poi.
  const mancaDa = new Array(obiettivo + 1).fill(0);
  for (let l = obiettivo - 1; l >= 1; l--) mancaDa[l] = mancaDa[l + 1] + tabella[l - 1];
  const zenyPerExp = new Array(obiettivo + 1).fill(Infinity);
  for (let l = 1; l <= obiettivo; l++) {
    for (const q of quest) {
      if (q.max >= l) {
        zenyPerExp[l] = Math.min(zenyPerExp[l], (q.prezzo * q.quantita) / q.guadagno);
      }
    }
  }

  /** Costo minimo per finire da `stato`: l'EXP gratis va tolta, il resto al prezzo migliore. */
  const limiteInferiore = (stato) => {
    let gratis = 0;
    // Una consegna di caccia perde almeno lo spreco minimo dei livelli che restano.
    pronte.forEach((c, i) => {
      gratis += (c.consegne - stato.cacce[i]) * (c.guadagno - c.sprecoMinimo[stato.livello]);
    });
    if (rabbocco !== null) gratis += (mancaDa[stato.livello] * rabbocco) / 100;
    for (const q of quest) {
      if (q.resto >= 0) gratis += (stato.rimasti[q.resto] / q.quantita) * q.guadagno;
    }
    const resto = mancaDa[stato.livello] - stato.exp - gratis;
    if (resto <= 0) return 0;
    return resto * zenyPerExp[stato.livello];
  };

  // Trucco dei mostri: si finisce il livello uccidendo solo se ne manca al piu' la
  // soglia e la consegna che segue, fatta subito, perderebbe EXP per il limite di un
  // livello. Una quest che da' poco (Acorn) non perde niente: si consegna e basta.
  const entroSoglia = (l, exp) =>
    rabbocco !== null && l < LIVELLO_MASSIMO && tabella[l - 1] - exp <= (tabella[l - 1] * rabbocco) / 100;
  const sprecherebbe = (l, exp, guadagno) => aggiungiExp(tabella, l, exp, guadagno).persa > 0;
  const uccisione = (l, exp) => ({
    tipo: "rabbocco", da: { livello: l, exp }, a: { livello: l + 1, exp: 0 }, persa: 0, mancante: tabella[l - 1] - exp,
  });

  /** Le mosse possibili da uno stato, ognuna come stato successivo. */
  const successori = (stato) => {
    const { livello: l, exp } = stato;
    const risultato = [];
    const mostri = entroSoglia(l, exp);

    for (const q of quest) {
      // La consegna subito, o dopo aver finito il livello con i mostri.
      const prima = [];
      if (l >= q.min && l <= q.max) prima.push(null);
      if (mostri && l + 1 < obiettivo && l + 1 >= q.min && l + 1 <= q.max && sprecherebbe(l, exp, q.guadagno)) {
        prima.push(uccisione(l, exp));
      }
      for (const uccisa of prima) {
        const da = uccisa ? uccisa.a : { livello: l, exp };
        const rimasti = q.resto >= 0 ? stato.rimasti[q.resto] : 0;
        const zeny = prezzoConsegna(q, rimasti);
        const dopo = aggiungiExp(tabella, da.livello, da.exp, q.guadagno);
        let nuoviRimasti = stato.rimasti;
        if (q.resto >= 0) {
          nuoviRimasti = stato.rimasti.slice();
          nuoviRimasti[q.resto] = Math.max(0, rimasti - q.quantita);
        }
        const passi = uccisa && [
          uccisa,
          { tipo: "quest", da, a: { livello: dopo.livello, exp: dopo.exp }, persa: dopo.persa },
        ];
        risultato.push({
          livello: dopo.livello,
          exp: dopo.exp,
          costo: stato.costo + zeny + (stato.ultima === q.id ? 0 : cambio) + PER_CONSEGNA,
          zeny: stato.zeny + zeny,
          consegne: stato.consegne + 1,
          cacce: stato.cacce,
          gratis: stato.gratis,
          rimasti: nuoviRimasti,
          ultima: q.id,
          padre: stato,
          mossa: { tipo: "quest", quest: q, zeny, persa: dopo.persa, ...(passi && { passi }) },
        });
      }
    }

    // Una caccia si consegna in una volta sola, con un solo viaggio: 1, 2 o 3
    // consegne di fila, prima di ognuna le uccisioni che completano un livello se
    // la consegna perderebbe EXP (gratis e mai peggio, quindi sempre). Poi la caccia
    // e' chiusa: tiene basso il numero di combinazioni da provare.
    pronte.forEach((c, i) => {
      if (stato.cacce[i] >= c.consegne) return;
      const usate = stato.cacce.slice();
      usate[i] = c.consegne;
      const passi = [];
      let ora = { livello: l, exp };
      for (let k = 1; k <= c.consegne - stato.cacce[i]; k++) {
        const mostriPrima = entroSoglia(ora.livello, ora.exp) && sprecherebbe(ora.livello, ora.exp, c.guadagno);
        if (ora.livello + 1 < obiettivo && mostriPrima) {
          passi.push(uccisione(ora.livello, ora.exp));
          ora = { livello: ora.livello + 1, exp: 0 };
        }
        const dopo = aggiungiExp(tabella, ora.livello, ora.exp, c.guadagno);
        if (dopo.livello < obiettivo && dopo.persa > c.sprecoMinimo[ora.livello]) break;
        passi.push({ tipo: "caccia", da: ora, a: { livello: dopo.livello, exp: dopo.exp }, persa: dopo.persa });
        ora = { livello: dopo.livello, exp: dopo.exp };
        risultato.push({
          ...stato,
          livello: ora.livello,
          exp: ora.exp,
          costo: stato.costo + (stato.ultima === c.id ? 0 : cambio) + k * PER_CONSEGNA,
          consegne: stato.consegne + k,
          cacce: usate,
          gratis: restanti(usate),
          ultima: c.id,
          padre: stato,
          mossa: { tipo: "caccia", caccia: c, zeny: 0, passi: passi.slice() },
        });
        if (ora.livello >= obiettivo) break;
      }
    });

    // All'ultimo livello nessuna consegna segue i mostri: valgono se una di quelle
    // possibili qui perderebbe EXP.
    const ultimo =
      mostri &&
      l + 1 >= obiettivo &&
      (quest.some((q) => l >= q.min && l <= q.max && sprecherebbe(l, exp, q.guadagno)) ||
        pronte.some((c, i) => stato.cacce[i] < c.consegne && sprecherebbe(l, exp, c.guadagno)));
    if (ultimo) {
      risultato.push({
        ...stato,
        livello: l + 1,
        exp: 0,
        padre: stato,
        mossa: { tipo: "rabbocco", zeny: 0, persa: 0, mancante: tabella[l - 1] - exp },
      });
    }
    return risultato;
  };

  const migliorDi = (a, b) => a.costo < b.costo;

  const iniziale = {
    livello,
    exp: expIniziale,
    costo: 0,
    zeny: 0,
    consegne: 0,
    cacce: pronte.map(() => 0),
    gratis: restanti(pronte.map(() => 0)),
    rimasti: quest.filter((q) => q.resto >= 0).map((q) => q.posseduti),
    ultima: null,
    padre: null,
    mossa: null,
  };
  if (livello >= obiettivo) return componiPiano(iniziale, tabella, quest);

  // Un primo piano qualsiasi fa da tetto e permette di scartare subito i rami
  // che costerebbero di piu': uccisioni e cacce appena si puo', altrimenti la
  // quest che costa meno per punto di EXP, restando dallo stesso NPC a parita'.
  let migliore = null;
  for (let stato = iniziale; stato; ) {
    if (stato.livello >= obiettivo) {
      migliore = stato;
      break;
    }
    const mosse = successori(stato);
    const gratis = mosse.find((m) => m.mossa.tipo !== "quest");
    const prezzoPerExp = (m) => (m.zeny - stato.zeny) / m.mossa.quest.guadagno;
    stato =
      gratis ??
      mosse.reduce(
        (scelta, m) =>
          !scelta ||
          prezzoPerExp(m) < prezzoPerExp(scelta) ||
          (prezzoPerExp(m) === prezzoPerExp(scelta) && m.ultima === stato.ultima)
            ? m
            : scelta,
        null,
      );
  }

  // Due stati allo stesso livello: `a` batte `b` se ha almeno la stessa EXP,
  // costa meno anche contando il passaggio all'NPC di `b`, e gli restano almeno le
  // stesse cacce e gli stessi oggetti posseduti.
  const domina = (a, b) => {
    const passaggio = a.ultima === b.ultima ? 0 : cambio;
    if (a.exp < b.exp || a.costo + passaggio > b.costo) return false;
    // Una consegna di caccia piu' grande vale almeno quanto una piu' piccola.
    if (a.gratis.length < b.gratis.length) return false;
    for (let i = 0; i < b.gratis.length; i++) if (a.gratis[i] < b.gratis[i]) return false;
    for (let i = 0; i < contatori; i++) if (a.rimasti[i] < b.rimasti[i]) return false;
    return true;
  };

  const fronti = new Map();
  const coda = new Coda((a, b) => a.livello < b.livello || (a.livello === b.livello && a.exp < b.exp));

  const inserisci = (stato) => {
    if (stato.livello >= obiettivo) {
      if (!migliore || migliorDi(stato, migliore)) migliore = stato;
      return;
    }
    if (migliore && stato.costo + limiteInferiore(stato) > migliore.costo) return;
    let fronte = fronti.get(stato.livello);
    if (!fronte) fronti.set(stato.livello, (fronte = []));
    for (const altro of fronte) if (domina(altro, stato)) return;
    for (let i = fronte.length - 1; i >= 0; i--) {
      if (domina(stato, fronte[i])) {
        fronte[i].scartato = true;
        fronte.splice(i, 1);
      }
    }
    fronte.push(stato);
    coda.aggiungi(stato);
  };

  inserisci(iniziale);
  while (!coda.vuota) {
    const stato = coda.togli();
    if (stato.scartato) continue;
    if (migliore && stato.costo + limiteInferiore(stato) > migliore.costo) continue;
    for (const dopo of successori(stato)) inserisci(dopo);
  }

  return migliore && componiPiano(migliore, tabella, quest);
}

/**
 * Ricostruisce le mosse del piano e le raggruppa in tappe: consegne
 * consecutive alla stessa quest. Le uccisioni che completano un livello
 * stanno nella tappa in cui capitano.
 */
function componiPiano(finale, tabella, quest) {
  const stati = [];
  for (let s = finale; s; s = s.padre) stati.push(s);
  stati.reverse();

  const rimasti = new Map(quest.map((q) => [q.id, q.posseduti]));
  const tappe = [];
  let inSospeso = [];
  let tappa = null;

  // Una mossa di caccia contiene gia' i suoi passi; le altre sono un passo solo.
  const elementari = [];
  for (let i = 1; i < stati.length; i++) {
    const prima = stati[i - 1];
    const dopo = stati[i];
    const mossa = dopo.mossa;
    const passi = mossa.passi ?? [
      {
        tipo: mossa.tipo,
        da: { livello: prima.livello, exp: prima.exp },
        a: { livello: dopo.livello, exp: dopo.exp },
        persa: mossa.persa,
        mancante: mossa.mancante,
      },
    ];
    for (const p of passi) elementari.push({ mossa, passo: { ...p, zeny: 0, dallInventario: 0, comprati: 0 } });
  }

  for (const { mossa, passo } of elementari) {
    if (passo.tipo === "rabbocco") {
      if (tappa) tappa.passi.push(passo);
      else inSospeso.push(passo);
      continue;
    }
    if (mossa.tipo === "quest") {
      const q = mossa.quest;
      passo.zeny = mossa.zeny;
      passo.dallInventario = Math.min(q.quantita, rimasti.get(q.id));
      passo.comprati = q.quantita - passo.dallInventario;
      rimasti.set(q.id, rimasti.get(q.id) - passo.dallInventario);
    }
    const chiave = mossa.tipo === "caccia" ? mossa.caccia.id : mossa.quest.id;
    if (!tappa || tappa.chiave !== chiave) {
      tappa = { chiave, tipo: mossa.tipo, quest: mossa.quest ?? null, caccia: mossa.caccia ?? null, passi: inSospeso };
      inSospeso = [];
      tappe.push(tappa);
    }
    tappa.passi.push(passo);
  }
  // Un piano fatto solo di uccisioni, senza consegne.
  if (inSospeso.length > 0) tappe.push({ chiave: "rabbocco", tipo: "rabbocco", quest: null, passi: inSospeso });

  const riassunte = tappe.map(riassumi);

  // La lista della spesa: per oggetto, quanti ne servono in tutto il piano.
  const spesa = new Map();
  for (const t of riassunte) {
    if (t.tipo !== "quest") continue;
    const voce = spesa.get(t.quest.id) ?? { quest: t.quest, servono: 0, dallInventario: 0, comprati: 0, zeny: 0 };
    voce.servono += t.consegne * t.quest.quantita;
    voce.dallInventario += t.dallInventario;
    voce.comprati += t.comprati;
    voce.zeny += t.zeny;
    spesa.set(t.quest.id, voce);
  }

  return {
    partenza: { livello: stati[0].livello, exp: stati[0].exp },
    arrivo: { livello: finale.livello, exp: finale.exp },
    zeny: finale.zeny,
    consegne: finale.consegne,
    tappe: riassunte,
    spesa: [...spesa.values()],
    percentuale: (stato) => percentualeDi(tabella, stato),
  };
}

/** Ricalcola dai passi i totali di una tappa. */
function riassumi(tappa) {
  const consegne = tappa.passi.filter((p) => p.tipo !== "rabbocco");
  const somma = (campo, passi = tappa.passi) => passi.reduce((n, p) => n + p[campo], 0);
  const risultato = {
    ...tappa,
    consegne: consegne.length,
    zeny: somma("zeny"),
    persa: somma("persa"),
    dallInventario: somma("dallInventario"),
    comprati: somma("comprati"),
    rabbocchi: tappa.passi.length - consegne.length,
    da: tappa.passi[0].da,
    a: tappa.passi[tappa.passi.length - 1].a,
  };
  if (tappa.passi[0].job) {
    risultato.jobDa = tappa.passi[0].job.da;
    risultato.jobA = tappa.passi[tappa.passi.length - 1].job.a;
    risultato.jobPersa = tappa.passi.reduce((n, p) => n + p.job.persa, 0);
  }
  return risultato;
}

/** Tabelle job della prima e della seconda classe. */
const tabelleJob = (rinato) => (rinato ? [JOB_PRIMA_RINATO, JOB_SECONDA_RINATO] : [JOB_PRIMA, JOB_SECONDA]);

/**
 * Aggiunge job EXP con la stessa regola dell'EXP base (`pc_checkjoblevelup`).
 * Al job massimo della classe la job EXP non serve piu' e conta come persa.
 *
 * @param {number[]} tabella Job EXP per livello: il job massimo e' `tabella.length + 1`.
 * @param {number} livello Livello job di partenza.
 * @param {number} exp Job EXP gia' fatta nel livello.
 * @param {number} guadagno Job EXP ricevuta.
 * @returns {{livello: number, exp: number, persa: number}} Stato dopo il guadagno.
 */
export function aggiungiJob(tabella, livello, exp, guadagno) {
  const massimo = tabella.length + 1;
  if (livello >= massimo) return { livello, exp: 0, persa: guadagno };
  const dopo = aggiungiFinoA(tabella, massimo, livello, exp, guadagno);
  if (dopo.livello >= massimo) {
    dopo.persa += dopo.exp;
    dopo.exp = 0;
  }
  return dopo;
}

/**
 * Segue il livello job lungo il piano e inserisce il cambio di classe.
 *
 * Il job non entra nella scelta del piano: si mostra accanto. Quando la prima
 * classe arriva al job del cambio, la tappa si spezza e in mezzo compare una
 * tappa `classe`; la job EXP rimasta in quel momento si perde, come nel gioco.
 *
 * @param {object} piano Il risultato di `calcolaPiano`.
 * @param {object} opzioni
 * @param {boolean} opzioni.rinato Classe rinata (tabelle job dei trascendenti).
 * @param {boolean} [opzioni.seconda=false] Gia' in seconda classe.
 * @param {number} opzioni.job Livello job di partenza.
 * @param {number} [opzioni.cambio=50] Job della prima classe a cui si cambia classe.
 * @param {boolean} [opzioni.weekend=false] Bonus del weekend.
 * @param {number} [opzioni.manuale=0] Manuale attivo: 0, 50 o 100.
 * @param {boolean} [opzioni.manualeJob=false] Il manuale vale anche per la job EXP (Battle Manual,
 *   Field Manual 100%).
 * @returns {{tappe: object[], finale: {classe: number, livello: number, exp: number}, persa: number}}
 *   Le tappe con il job in ogni passo, il job alla fine e la job EXP persa in tutto.
 */
export function seguiJob(piano, opzioni) {
  const { rinato, seconda = false, job, cambio = 50, weekend = false, manuale = 0, manualeJob = false } = opzioni;
  const molt = moltiplicatore(weekend, manualeJob ? manuale : 0);
  const tabelle = tabelleJob(rinato);
  let stato = { classe: seconda ? 2 : 1, livello: job, exp: 0 };
  let persa = 0;
  const tappe = [];

  const cambiaSePronto = (base) => {
    if (stato.classe !== 1 || stato.livello < cambio) return false;
    tappe.push({ tipo: "classe", job: { ...stato }, base, persa: stato.exp });
    persa += stato.exp;
    stato = { classe: 2, livello: 1, exp: 0 };
    return true;
  };

  // Il cambio di classe va prima della consegna successiva: le uccisioni che
  // completano un livello restano nella tappa in cui capitano.
  let ultimo = piano.partenza;
  for (const tappa of piano.tappe) {
    let passi = [];
    const chiudi = () => {
      if (passi.length > 0) tappe.push(riassumi({ ...tappa, passi }));
      passi = [];
    };
    for (const passo of tappa.passi) {
      if (passo.tipo !== "rabbocco" && stato.classe === 1 && stato.livello >= cambio) {
        chiudi();
        cambiaSePronto(passo.da);
      }
      const da = { ...stato };
      let persaPasso = 0;
      if (passo.tipo !== "rabbocco") {
        const base = passo.tipo === "caccia" ? tappa.caccia.job : tappa.quest.job;
        const dopo = aggiungiJob(tabelle[stato.classe - 1], stato.livello, stato.exp, Math.floor(base * molt));
        stato = { classe: stato.classe, livello: dopo.livello, exp: dopo.exp };
        persaPasso = dopo.persa;
        persa += persaPasso;
      }
      passi.push({ ...passo, job: { da, a: { ...stato }, persa: persaPasso } });
      ultimo = passo.a;
    }
    chiudi();
  }
  cambiaSePronto(ultimo);
  return { tappe, finale: stato, persa };
}

/**
 * Massimo del livello job di una classe.
 *
 * @param {boolean} rinato Classe rinata.
 * @param {number} classe 1 per la prima classe, 2 per la seconda.
 * @returns {number} Il job massimo.
 */
export function jobMassimo(rinato, classe) {
  return tabelleJob(rinato)[classe - 1].length + 1;
}

/**
 * Percentuale del livello job raggiunta.
 *
 * @param {boolean} rinato Classe rinata.
 * @param {{classe: number, livello: number, exp: number}} stato
 * @returns {number} Percentuale da 0 a 100.
 */
export function percentualeJob(rinato, stato) {
  const tabella = tabelleJob(rinato)[stato.classe - 1];
  if (stato.livello > tabella.length) return 0;
  return (100 * stato.exp) / tabella[stato.livello - 1];
}

/**
 * Percentuale del livello raggiunta, come la mostra il gioco.
 *
 * @param {number[]} tabella EXP per livello.
 * @param {{livello: number, exp: number}} stato
 * @returns {number} Percentuale da 0 a 100.
 */
export function percentualeDi(tabella, stato) {
  if (stato.livello >= LIVELLO_MASSIMO) return 0;
  return (100 * stato.exp) / tabella[stato.livello - 1];
}
