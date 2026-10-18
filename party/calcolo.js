/**
 * Calcolo delle run di un'istanza (quelle di `dati.js`).
 *
 * Regole (Alberto, 18/10/2026): un giocatore entra al massimo una volta per run
 * (un client alla volta); ogni account, jolly compresi, entra una volta sola;
 * una run ha al massimo `maxParty` persone e copre i posti obbligatori.
 *
 * Ordine di preferenza: piu' run complete, piu' entrate, piu' personaggi del
 * ruolo preferito (Sniper), entrate divise fra i giocatori, meno jolly; poi run
 * di grandezza simile e preferiti divisi fra le run.
 *
 * Come calcola, in due passi, tutti e due esatti:
 * 1. quali personaggi entrano. Basta contare: K run complete esistono se e solo
 *    se i personaggi scelti hanno in tutto almeno K volte ogni posto, con ogni
 *    giocatore al piu' K personaggi. E' il teorema di Konig: un grafo bipartito
 *    (giocatori da una parte, posti dall'altra) con grado massimo K si colora
 *    con K colori, cioe' le run. Programmazione dinamica sui giocatori, con
 *    stato i posti coperti in tutto (piu' i jolly usati, e le entrate se i
 *    presenti sono piu' di `maxParty`);
 * 2. in quale run va ognuno: colorazione degli archi del grafo. I posti liberi
 *    sono nodi da K archi riempiti prima con i preferiti, cosi' persone e
 *    preferiti vengono divisi fra le run al meglio (al piu' uno di differenza).
 *
 * Una prima versione teneva nello stato ogni run separata: con 18 giocatori
 * serviva oltre un secondo, e gli account con piu' personaggi l'avrebbero
 * peggiorata.
 */

import { ISTANZE, ruoloDi } from "./dati.js";

/**
 * I modi di usare un account: uno per ruolo che conta (posti obbligatori e
 * preferito) fra i suoi personaggi, oppure uno solo se non ne ha. Un ruolo che
 * conta non e' mai peggio di "altro": oltre i posti vale come un posto libero.
 */
function usiAccount(account, istanza) {
  const contano = new Set([...istanza.posti.map((p) => p.ruolo), istanza.preferito]);
  const usi = [];
  account.personaggi.forEach((p, indice) => {
    const ruolo = ruoloDi(istanza, p.classe);
    if (contano.has(ruolo) && !usi.some((u) => u.ruolo === ruolo)) usi.push({ ruolo, personaggio: indice });
  });
  if (usi.length === 0 && account.personaggi.length > 0) usi.push({ ruolo: "altro", personaggio: 0 });
  return usi;
}

/**
 * Le scelte possibili di un giocatore: al piu' `nRun` account diversi (suoi o
 * jolly), ognuno con un personaggio. Due scelte con gli stessi ruoli e gli
 * stessi jolly sono una sola. Se `tutti`, un giocatore che entra meno di `nRun`
 * volte usa tutti i suoi account: senza limite di persone conviene sempre.
 */
function scelteGiocatore(giocatore, jolly, istanza, nRun, tutti) {
  const oggetti = [];
  giocatore.account.forEach((a, indice) => {
    for (const uso of usiAccount(a, istanza)) oggetti.push({ account: indice, jolly: null, ...uso });
  });
  jolly.forEach((a, indice) => {
    for (const uso of usiAccount(a, istanza)) oggetti.push({ account: null, jolly: indice, ...uso });
  });
  const propri = giocatore.account.filter((a) => a.personaggi.length > 0).length;

  const scelte = new Map();
  const presi = [];
  (function prova(da) {
    const nPropri = presi.filter((o) => o.jolly === null).length;
    if (!tutti || presi.length === nRun || nPropri === propri) {
      const chiave = presi.map((o) => `${o.jolly ?? ""}:${o.ruolo}`).sort().join("|");
      if (!scelte.has(chiave)) scelte.set(chiave, [...presi]);
    }
    if (presi.length === nRun) return;
    for (let i = da; i < oggetti.length; i++) {
      const o = oggetti[i];
      if (presi.some((x) => (o.jolly === null ? x.account === o.account && x.jolly === null : x.jolly === o.jolly))) continue;
      presi.push(o);
      prova(i + 1);
      presi.pop();
    }
  })(0);
  return [...scelte.values()];
}

/**
 * Le run migliori con i giocatori presenti e i jolly disponibili.
 *
 * @param {Array<{nome: string, account: Array<{personaggi: Array<{nome: string, classe: string}>}>}>} giocatori
 *   solo i presenti
 * @param {Array<{personaggi: Array<{nome: string, classe: string}>}>} jolly solo i disponibili
 * @param {object} [istanza] una di `ISTANZE`, la prima se non si indica
 * @returns {{run: Array<{membri: Array<object>, preferiti: number}>, entrate: number, preferiti: number,
 *   jolly: number, fuori: Array<{giocatore: number, entrate: number, motivo: string}>, mancano: string[]}}
 *   Ogni membro: `giocatore`, `account` o `jolly` (indici), `personaggio`, `ruolo`, `posto` (null se libero)
 */
export function calcolaRun(giocatori, jolly, istanza = ISTANZE[0]) {
  if (jolly.length > 30) throw new Error("Al massimo 30 jolly disponibili");
  for (let nRun = istanza.maxRun; nRun > 0; nRun--) {
    // Con il limite di persone si cerca prima una soluzione con le run piene, che e' molto piu' veloce.
    const scelti =
      (giocatori.length > istanza.maxParty && cerca(giocatori, jolly, istanza, nRun, istanza.maxParty * nRun)) ||
      cerca(giocatori, jolly, istanza, nRun, 0);
    if (scelti) return componi(giocatori, jolly, istanza, dividi(scelti, istanza, nRun));
  }
  return componi(giocatori, jolly, istanza, []);
}

/**
 * Passo 1: i personaggi che entrano in `nRun` run complete, con almeno
 * `minEntrate` entrate, come lista di contributi
 * `{giocatore, account, jolly, personaggio, ruolo}`, o null.
 */
function cerca(giocatori, jolly, istanza, nRun, minEntrate) {
  const posti = istanza.posti;
  const serve = posti.map((p) => p.quanti * nRun);
  // Con al piu' maxParty presenti il limite di persone non si raggiunge mai.
  const conLimite = giocatori.length > istanza.maxParty;
  const maxEntrate = istanza.maxParty * nRun;

  // Stato in un numero: posti coperti per ruolo (fermi a quanti ne servono), entrate se c'e' il limite, jolly.
  const basi = [...serve.map((n) => n + 1), conLimite ? maxEntrate + 1 : 1];
  const pesoJolly = 2 ** jolly.length;
  const chiave = (coperti, entrate, maschera) => {
    let k = 0;
    coperti.forEach((c, i) => (k = k * basi[i] + c));
    return (k * basi[posti.length] + (conLimite ? entrate : 0)) * pesoJolly + maschera;
  };

  // Per scartare presto gli stati senza speranza: quanti posti di ogni ruolo possono
  // ancora coprire i giocatori da g in poi (uno per run al massimo) e i jolly liberi.
  const haRuolo = (account, ruolo) => account.personaggi.some((p) => ruoloDi(istanza, p.classe) === ruolo);
  const offerta = [...Array(giocatori.length + 1)].map(() => posti.map(() => 0));
  for (let g = giocatori.length - 1; g >= 0; g--) {
    posti.forEach((p, i) => {
      offerta[g][i] = offerta[g + 1][i] + Math.min(nRun, giocatori[g].account.filter((a) => haRuolo(a, p.ruolo)).length);
    });
  }
  const jollyDi = posti.map((p) => jolly.reduce((m, a, j) => (haRuolo(a, p.ruolo) ? m | (1 << j) : m), 0));
  const contaBit = (n) => {
    let c = 0;
    for (; n; n &= n - 1) c++;
    return c;
  };
  // Entrate che i giocatori da g in poi possono ancora aggiungere, al massimo.
  const altreEntrate = [0];
  for (let g = giocatori.length - 1; g >= 0; g--) {
    altreEntrate.unshift(altreEntrate[0] + Math.min(nRun, giocatori[g].account.length + jolly.length));
  }
  const speranza = (coperti, maschera, g, entrate) =>
    entrate + altreEntrate[g] >= minEntrate &&
    coperti.every((c, i) => serve[i] - c <= offerta[g][i] + contaBit(jollyDi[i] & ~maschera));

  const iniziale = { coperti: posti.map(() => 0), entrate: 0, maschera: 0, punti: 0 };
  if (!speranza(iniziale.coperti, 0, 0, 0)) return null;
  let strato = new Map([[chiave(iniziale.coperti, 0, 0), iniziale]]);
  const strati = [strato];

  for (const [g, giocatore] of giocatori.entries()) {
    const scelte = scelteGiocatore(giocatore, jolly, istanza, nRun, !conLimite).map((presi) => {
      const entrate = presi.length;
      const nJolly = presi.filter((o) => o.jolly !== null).length;
      const preferiti = presi.filter((o) => o.ruolo === istanza.preferito).length;
      return {
        presi,
        entrate,
        aggiunti: posti.map((p) => presi.filter((o) => o.ruolo === p.ruolo).length),
        maschera: presi.reduce((m, o) => (o.jolly === null ? m : m | (1 << o.jolly)), 0),
        // Il punteggio in un numero solo, in ordine di importanza; quadrati e jolly restano sotto 1000.
        punti: entrate * 1e9 + preferiti * 1e6 - entrate ** 2 * 1e3 - nJolly,
      };
    });
    const prossimo = new Map();
    const scartati = new Set();
    for (const [chiavePrima, stato] of strato) {
      for (const scelta of scelte) {
        if (stato.maschera & scelta.maschera) continue;
        const entrate = stato.entrate + scelta.entrate;
        if (conLimite && entrate > maxEntrate) continue;
        // La chiave senza creare array: e' il punto in cui passa quasi tutto il tempo.
        let k = 0;
        for (let i = 0; i < posti.length; i++) k = k * basi[i] + Math.min(serve[i], stato.coperti[i] + scelta.aggiunti[i]);
        const maschera = stato.maschera | scelta.maschera;
        k = (k * basi[posti.length] + (conLimite ? entrate : 0)) * pesoJolly + maschera;
        const punti = stato.punti + scelta.punti;
        const esistente = prossimo.get(k);
        if (esistente) {
          if (punti > esistente.punti) Object.assign(esistente, { punti, prima: chiavePrima, scelta });
          continue;
        }
        if (scartati.has(k)) continue;
        const coperti = stato.coperti.map((c, i) => Math.min(serve[i], c + scelta.aggiunti[i]));
        if (!speranza(coperti, maschera, g + 1, entrate)) {
          scartati.add(k);
          continue;
        }
        prossimo.set(k, { coperti, entrate, maschera, punti, prima: chiavePrima, scelta });
      }
    }
    strato = prossimo;
    strati.push(strato);
  }

  let migliore = null;
  for (const [k, stato] of strato) {
    if (stato.coperti.some((c, i) => c < serve[i])) continue;
    if (!migliore || stato.punti > migliore.punti) migliore = { chiave: k, punti: stato.punti };
  }
  if (!migliore) return null;

  const scelti = [];
  let k = migliore.chiave;
  for (let g = giocatori.length; g > 0; g--) {
    const stato = strati[g].get(k);
    for (const o of stato.scelta.presi) scelti.push({ giocatore: g - 1, account: o.account, jolly: o.jolly, personaggio: o.personaggio, ruolo: o.ruolo });
    k = stato.prima;
  }
  return scelti.reverse();
}

/**
 * Passo 2: divide i contributi in `nRun` run. Ogni posto obbligatorio e' un
 * nodo con esattamente `nRun` archi, uno per run; i liberi sono nodi da `nRun`
 * archi riempiti prima con i preferiti. Gli archi si colorano con l'algoritmo
 * dei cammini alternati (Konig): ogni colore, cioe' run, ha un arco per nodo.
 */
function dividi(scelti, istanza, nRun) {
  const nodiGiocatore = new Map();
  const archi = [];
  const destri = [];
  const nuovoDestro = () => destri.push(0) - 1;

  const restanti = [...scelti];
  for (const posto of istanza.posti) {
    for (let q = 0; q < posto.quanti; q++) {
      const nodo = nuovoDestro();
      for (let r = 0; r < nRun; r++) {
        const i = restanti.findIndex((c) => c.ruolo === posto.ruolo);
        archi.push({ contributo: restanti.splice(i, 1)[0], destro: nodo });
      }
    }
  }
  restanti.sort((a, b) => (b.ruolo === istanza.preferito) - (a.ruolo === istanza.preferito));
  restanti.forEach((c, i) => {
    if (i % nRun === 0) nuovoDestro();
    archi.push({ contributo: c, destro: destri.length - 1 });
  });

  // Nodi: prima i destri (posti), poi un nodo per giocatore. colore[nodo][c] = arco con quel colore.
  for (const a of archi) {
    if (!nodiGiocatore.has(a.contributo.giocatore)) nodiGiocatore.set(a.contributo.giocatore, destri.length + nodiGiocatore.size);
    a.sinistro = nodiGiocatore.get(a.contributo.giocatore);
  }
  const colore = [...Array(destri.length + nodiGiocatore.size)].map(() => new Array(nRun).fill(null));
  const libero = (nodo) => colore[nodo].indexOf(null);
  const altroCapo = (arco, nodo) => (arco.sinistro === nodo ? arco.destro : arco.sinistro);
  const togli = (arco) => {
    colore[arco.sinistro][arco.colore] = null;
    colore[arco.destro][arco.colore] = null;
  };
  const metti = (arco, c) => {
    arco.colore = c;
    colore[arco.sinistro][c] = arco;
    colore[arco.destro][c] = arco;
  };

  for (const arco of archi) {
    const a = libero(arco.sinistro);
    const b = libero(arco.destro);
    if (colore[arco.destro][a] !== null) {
      // Cammino da destro con colori a, b, a...: scambiandoli, a si libera sul destro.
      // In un grafo bipartito il cammino non arriva al sinistro.
      const cammino = [];
      let nodo = arco.destro;
      for (let c = a; colore[nodo][c] !== null; c = c === a ? b : a) {
        const passo = colore[nodo][c];
        cammino.push(passo);
        nodo = altroCapo(passo, nodo);
      }
      cammino.forEach(togli);
      for (const passo of cammino) metti(passo, passo.colore === a ? b : a);
    }
    metti(arco, a);
  }

  const run = [...Array(nRun)].map(() => []);
  for (const arco of archi) run[arco.colore].push(arco.contributo);
  return run;
}

/** Le run nel formato del risultato, con chi resta fuori e perche'. */
function componi(giocatori, jolly, istanza, membri) {
  const run = membri.map((m) => ({
    membri: assegnaPosti(m, istanza),
    preferiti: m.filter((x) => x.ruolo === istanza.preferito).length,
  }));
  const tutti = run.flatMap((r) => r.membri);

  const fuori = [];
  giocatori.forEach((_, g) => {
    const dentro = run.filter((r) => r.membri.some((m) => m.giocatore === g));
    if (run.length === 0 || dentro.length === run.length) return;
    const assenti = run.filter((r) => !dentro.includes(r));
    const piene = assenti.every((r) => r.membri.length >= istanza.maxParty);
    fuori.push({ giocatore: g, entrate: dentro.length, motivo: piene ? "piena" : "account" });
  });

  return {
    run,
    entrate: tutti.length,
    preferiti: tutti.filter((m) => m.ruolo === istanza.preferito).length,
    jolly: tutti.filter((m) => m.jolly !== null).length,
    fuori,
    mancano: run.length < istanza.maxRun ? cosaManca(giocatori, jolly, istanza, run.length + 1) : [],
  };
}

/** I membri di una run con il loro posto: prima gli obbligatori nell'ordine dell'istanza, poi i liberi. */
function assegnaPosti(membri, istanza) {
  const liberi = [...membri];
  const obbligatori = [];
  for (const posto of istanza.posti) {
    for (let i = 0; i < posto.quanti; i++) {
      const k = liberi.findIndex((m) => m.ruolo === posto.ruolo);
      if (k >= 0) obbligatori.push({ ...liberi.splice(k, 1)[0], posto: posto.nome });
    }
  }
  return [...obbligatori, ...liberi.map((m) => ({ ...m, posto: null }))];
}

/**
 * Perche' non si arriva a `run` run: i posti per cui mancano account, contando
 * che un giocatore copre al massimo un posto per run.
 */
function cosaManca(giocatori, jolly, istanza, run) {
  const mancano = [];
  const minimo = istanza.posti.reduce((n, p) => n + p.quanti, 0);
  if (giocatori.length < minimo) mancano.push(`servono almeno ${minimo} giocatori presenti, ce ne sono ${giocatori.length}`);
  const haRuolo = (account, ruolo) => account.personaggi.some((p) => ruoloDi(istanza, p.classe) === ruolo);
  for (const posto of istanza.posti) {
    const servono = posto.quanti * run;
    let ci = jolly.filter((a) => haRuolo(a, posto.ruolo)).length;
    for (const g of giocatori) ci += Math.min(run, g.account.filter((a) => haRuolo(a, posto.ruolo)).length);
    if (ci < servono) mancano.push(`${posto.nome}: per ${run} run ne servono ${servono}, ce ne sono ${ci}`);
  }
  return mancano;
}
