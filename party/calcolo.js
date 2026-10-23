/**
 * Calcolo delle run di un'istanza (quelle di `dati.js`).
 *
 * Regole (Alberto, 18/10/2026): un giocatore entra al massimo una volta per run
 * (un client alla volta); ogni account, jolly compresi, entra una volta sola;
 * una run ha al massimo `maxParty` persone e copre i posti obbligatori. Se
 * l'istanza ha `liberi` (l'Endless Cellar), nei posti liberi entrano solo
 * quei ruoli, e un posto con `massimo` ne ha al piu' tanti per run.
 *
 * Ordine di preferenza: piu' run complete, piu' entrate, piu' posti desiderati
 * coperti (`desiderati` di un posto: non obbligatori, ma i primi fra i liberi,
 * fino a tanti per run; la Gypsy/Dancer della Horror Toy Factory), piu'
 * personaggi dei ruoli preferiti nell'ordine dell'istanza (Sniper, poi High Priest, poi
 * Priest), entrate divise fra i giocatori, meno jolly; poi run di grandezza
 * simile e Sniper divisi fra le run.
 *
 * Come calcola, in due passi, tutti e due esatti:
 * 1. quali personaggi entrano. Basta contare: K run complete esistono se e solo
 *    se i personaggi scelti hanno in tutto K volte ogni posto, con ogni
 *    giocatore al piu' K personaggi. E' il teorema di Konig: un grafo bipartito
 *    (giocatori da una parte, posti dall'altra) con grado massimo K si colora
 *    con K colori, cioe' le run. Quindi e' un flusso di costo minimo:
 *    giocatori, account o jolly, ruoli, posti; il punteggio diventa il costo;
 * 2. in quale run va ognuno: colorazione degli archi del grafo. I posti liberi
 *    sono nodi da K archi riempiti prima con i preferiti, nel loro ordine, cosi'
 *    persone e Sniper vengono divisi fra le run al meglio (al piu' uno di
 *    differenza).
 *
 * Fino alla 1.4 il passo 1 era una programmazione dinamica sui giocatori, con
 * stato i posti coperti in tutto: con i nove ruoli dell'Endless Cellar 14
 * giocatori chiedevano 13 secondi.
 */

import { ISTANZE, ruoloDi, tr } from "./dati.js";

/**
 * I modi di usare un account: uno per ruolo che conta (posti obbligatori e
 * preferiti) fra i suoi personaggi, oppure uno solo se non ne ha. Un ruolo che
 * conta non e' mai peggio di "altro": oltre i posti vale come un posto libero.
 */
function usiAccount(account, istanza) {
  // Con i posti liberi riservati (`liberi`) entrano solo i ruoli dei posti: gli altri non hanno dove stare.
  const contano = new Set([...istanza.posti.map((p) => p.ruolo), ...(istanza.liberi ? [] : istanza.preferiti.map((p) => p.ruolo))]);
  const usi = [];
  account.personaggi.forEach((p, indice) => {
    const ruolo = ruoloDi(istanza, p.classe);
    if (contano.has(ruolo) && !usi.some((u) => u.ruolo === ruolo)) usi.push({ ruolo, personaggio: indice });
  });
  if (usi.length === 0 && account.personaggi.length > 0 && !istanza.liberi) usi.push({ ruolo: "altro", personaggio: 0 });
  return usi;
}

/**
 * Le run migliori con i giocatori presenti e i jolly disponibili.
 *
 * @param {Array<{nome: string, account: Array<{personaggi: Array<{classe: string}>}>}>} giocatori
 *   solo i presenti
 * @param {Array<{personaggi: Array<{classe: string}>}>} jolly solo i disponibili
 * @param {object} [istanza] una di `ISTANZE`, la prima se non si indica
 * @returns {{run: Array<{membri: Array<object>, preferiti: number[]}>, entrate: number, preferiti: number[],
 *   jolly: number, fuori: Array<{giocatore: number, entrate: number, motivo: string}>, mancano: string[]}}
 *   Ogni membro: `giocatore`, `account` o `jolly` (indici), `personaggio`, `ruolo`, `posto` (null se libero)
 */
export function calcolaRun(giocatori, jolly, istanza = ISTANZE[0]) {
  for (let nRun = istanza.maxRun; nRun > 0; nRun--) {
    const scelti = cerca(giocatori, jolly, istanza, nRun);
    if (scelti) return componi(giocatori, jolly, istanza, dividi(scelti, istanza, nRun));
  }
  return componi(giocatori, jolly, istanza, []);
}

/**
 * Passo 1: i personaggi che entrano in `nRun` run complete, come lista di
 * contributi `{giocatore, account, jolly, personaggio, ruolo}`, o null.
 *
 * La rete: sorgente, giocatori (fino a `nRun` unita', una per entrata), i loro
 * account e i jolly (una unita' ciascuno), ruoli, poi i posti obbligatori di
 * ogni ruolo dritti al pozzo e il resto nel nodo dei posti liberi, che ne tiene
 * quanti le run hanno posti liberi. Il punteggio e' una somma con un peso per
 * criterio, ognuno piu' grande di tutto quello che vale meno: i posti
 * obbligatori coperti valgono piu' di ogni altra cosa, quindi le run sono
 * possibili se e solo se il flusso migliore li copre tutti.
 */
function cerca(giocatori, jolly, istanza, nRun) {
  const maxEntrate = istanza.maxParty * nRun;
  const liberiPerRun = istanza.maxParty - istanza.posti.reduce((n, p) => n + p.quanti, 0);

  // Pesi dal criterio meno importante: ogni criterio e' un intero fra 0 e il suo massimo.
  const pesi = {};
  let peso = 1;
  const criteri = [
    ["jolly", maxEntrate],
    ["quadrati", maxEntrate * nRun],
    ...istanza.preferiti.map((p) => [`preferito:${p.ruolo}`, maxEntrate]).reverse(),
    ["desiderati", maxEntrate],
    ["entrate", maxEntrate],
    ["posti", maxEntrate],
  ];
  for (const [nome, massimo] of criteri) {
    pesi[nome] = peso;
    peso *= massimo + 1;
  }
  // Le somme devono restare intere esatte; un cammino passa per al piu' un arco dei posti e uno delle entrate.
  if (!Number.isSafeInteger(peso)) throw new Error("Troppi criteri per i pesi del calcolo");

  // Nodi: 0 sorgente, 1 pozzo, 2 posti liberi, poi gli altri man mano.
  let nNodi = 3;
  const nodo = () => nNodi++;
  const archi = [];
  const arco = (da, a, cap, costo, info = {}) => archi.push({ da, a, cap, costo, ...info }) - 1;

  // Ruoli: un nodo per ruolo che conta, con i suoi posti obbligatori, desiderati e liberi.
  const ruoli = new Map();
  const nodoRuolo = (ruolo) => {
    if (ruoli.has(ruolo)) return ruoli.get(ruolo);
    const n = nodo();
    ruoli.set(ruolo, n);
    const posto = istanza.posti.find((p) => p.ruolo === ruolo);
    const quanti = (posto?.quanti ?? 0) * nRun;
    const ammesso = !istanza.liberi || istanza.liberi.includes(ruolo);
    const tetto = Math.min(posto?.massimo ?? Infinity, (posto?.quanti ?? 0) + (ammesso ? liberiPerRun : 0)) * nRun;
    const desiderati = Math.min((posto?.desiderati ?? 0) * nRun, tetto - quanti);
    if (quanti > 0) arco(n, 1, quanti, -pesi.posti, { obbligatorio: true });
    if (desiderati > 0) arco(n, 2, desiderati, -pesi.desiderati);
    if (tetto - quanti - desiderati > 0) arco(n, 2, tetto - quanti - desiderati, 0);
    return n;
  };
  const versoRuoli = (n, account) => {
    for (const uso of usiAccount(account, istanza)) {
      const preferito = pesi[`preferito:${uso.ruolo}`] ?? 0;
      arco(n, nodoRuolo(uso.ruolo), 1, -preferito, { uso });
    }
  };
  arco(2, 1, liberiPerRun * nRun, 0);
  // Tutti i posti subito: un posto che nessuno puo' coprire deve avere il suo arco obbligatorio.
  for (const p of istanza.posti) nodoRuolo(p.ruolo);

  const nodiJolly = jolly.map((a) => {
    const entrata = nodo();
    const uscita = nodo();
    arco(entrata, uscita, 1, 0);
    versoRuoli(uscita, a);
    return entrata;
  });
  giocatori.forEach((g, gi) => {
    const n = nodo();
    // La k-esima entrata costa 2k - 1 quadrati: in tutto entrate al quadrato.
    for (let k = 1; k <= nRun; k++) arco(0, n, 1, -pesi.entrate + (2 * k - 1) * pesi.quadrati);
    g.account.forEach((a, ai) => {
      const n2 = nodo();
      arco(n, n2, 1, 0, { giocatore: gi, account: ai });
      versoRuoli(n2, a);
    });
    nodiJolly.forEach((nj, ji) => arco(n, nj, 1, pesi.jolly, { giocatore: gi, jolly: ji }));
  });

  const flusso = flussoMinimo(nNodi, archi);
  if (archi.some((e, i) => e.obbligatorio && flusso[i] < e.cap)) return null;

  // Da ogni account o jolly usato, il ruolo con cui entra.
  const usoDi = new Map();
  archi.forEach((e, i) => {
    if (e.uso && flusso[i] > 0) usoDi.set(e.da, e.uso);
  });
  const scelti = [];
  archi.forEach((e, i) => {
    if (e.giocatore === undefined || flusso[i] === 0) return;
    // Il nodo dell'account e' `e.a`; per un jolly il ruolo esce dal nodo dopo l'entrata.
    const uso = e.jolly === undefined ? usoDi.get(e.a) : usoDi.get(e.a + 1);
    scelti.push({ giocatore: e.giocatore, account: e.account ?? null, jolly: e.jolly ?? null, ...uso });
  });
  return scelti;
}

/**
 * Flusso di costo minimo dal nodo 0 al nodo 1, di qualsiasi quantita':
 * cammini minimi successivi (Bellman-Ford con coda, i costi sono negativi),
 * finche' un cammino costa meno di zero. Rende il flusso di ogni arco.
 */
function flussoMinimo(nNodi, archi) {
  // Arco i: 2i in avanti, 2i + 1 all'indietro nel grafo residuo.
  const uscite = [...Array(nNodi)].map(() => []);
  const residuo = [];
  const verso = [];
  const costo = [];
  archi.forEach((e, i) => {
    uscite[e.da].push(2 * i);
    uscite[e.a].push(2 * i + 1);
    residuo.push(e.cap, 0);
    verso.push(e.a, e.da);
    costo.push(e.costo, -e.costo);
  });
  for (;;) {
    const distanza = new Array(nNodi).fill(Infinity);
    const arrivo = new Array(nNodi).fill(-1);
    const inCoda = new Array(nNodi).fill(false);
    distanza[0] = 0;
    const coda = [0];
    while (coda.length > 0) {
      const u = coda.shift();
      inCoda[u] = false;
      for (const r of uscite[u]) {
        const v = verso[r];
        if (residuo[r] > 0 && distanza[u] + costo[r] < distanza[v]) {
          distanza[v] = distanza[u] + costo[r];
          arrivo[v] = r;
          if (!inCoda[v]) {
            inCoda[v] = true;
            coda.push(v);
          }
        }
      }
    }
    if (!(distanza[1] < 0)) break;
    let quanto = Infinity;
    for (let v = 1; v !== 0; v = verso[arrivo[v] ^ 1]) quanto = Math.min(quanto, residuo[arrivo[v]]);
    for (let v = 1; v !== 0; v = verso[arrivo[v] ^ 1]) {
      residuo[arrivo[v]] -= quanto;
      residuo[arrivo[v] ^ 1] += quanto;
    }
  }
  return archi.map((_, i) => residuo[2 * i + 1]);
}


/**
 * Passo 2: divide i contributi in `nRun` run. Ogni posto obbligatorio e' un
 * nodo con esattamente `nRun` archi, uno per run; ogni posto desiderato un nodo
 * con i personaggi di quel ruolo che ci sono, completato con i liberi meno
 * preziosi; gli altri liberi sono nodi da `nRun` archi, riempiti prima con i
 * preferiti, nel loro ordine. Gli archi si colorano con l'algoritmo dei cammini
 * alternati (Konig): ogni colore, cioe' run, ha al piu' un arco per nodo. Cosi'
 * le run hanno i posti obbligatori, i desiderati e al piu' una persona di
 * differenza; `pareggia` divide poi i preferiti.
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
  const buchi = [];
  for (const posto of istanza.posti) {
    for (let q = 0; q < (posto.desiderati ?? 0); q++) {
      const nodo = nuovoDestro();
      let archiNodo = 0;
      for (let r = 0; r < nRun; r++) {
        const i = restanti.findIndex((c) => c.ruolo === posto.ruolo);
        if (i < 0) break;
        archi.push({ contributo: restanti.splice(i, 1)[0], destro: nodo });
        archiNodo++;
      }
      for (let r = archiNodo; r < nRun; r++) buchi.push(nodo);
    }
  }
  const rango = (c) => {
    const i = istanza.preferiti.findIndex((p) => p.ruolo === c.ruolo);
    return i < 0 ? istanza.preferiti.length : i;
  };
  // Prima i ruoli con un massimo per run (l'High Wizard), cosi' finiscono nel primo nodo libero e
  // ogni run ne prende al piu' uno. Basta finche' c'e' un solo ruolo cosi', con massimo uno oltre
  // gli obbligatori.
  const conMassimo = (c) => istanza.posti.some((p) => p.ruolo === c.ruolo && p.massimo !== undefined);
  restanti.sort((a, b) => conMassimo(b) - conMassimo(a) || rango(a) - rango(b));
  // I buchi dei posti desiderati prendono i liberi meno preziosi, dalla fine.
  for (const nodo of buchi) {
    if (restanti.length === 0) break;
    archi.push({ contributo: restanti.pop(), destro: nodo });
  }
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
  pareggia(run, istanza);
  return run;
}

/**
 * Divide i preferiti fra le run scambiando due membri di run diverse, finche'
 * serve: le persone per run non cambiano, e uno scambio vale solo se le due run
 * tengono posti obbligatori e desiderati. Conta il primo preferito (lo Sniper),
 * poi gli altri nel loro ordine.
 */
function pareggia(run, istanza) {
  const conta = (membri, ruolo) => membri.filter((m) => m.ruolo === ruolo).length;
  const desiderati = (membri) =>
    istanza.posti.reduce((n, p) => n + Math.min(Math.max(0, conta(membri, p.ruolo) - p.quanti), p.desiderati ?? 0), 0);
  const copre = (membri) =>
    istanza.posti.every((p) => conta(membri, p.ruolo) >= p.quanti && conta(membri, p.ruolo) <= (p.massimo ?? Infinity));
  const squilibrio = () => istanza.preferiti.map((p) => run.reduce((n, m) => n + conta(m, p.ruolo) ** 2, 0));
  const meno = (a, b) => {
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i];
    return false;
  };
  const presente = (membri, giocatore, tranne) => membri.some((m) => m !== tranne && m.giocatore === giocatore);

  for (let migliorato = true; migliorato; ) {
    migliorato = false;
    for (let a = 0; a < run.length; a++) {
      for (let b = a + 1; b < run.length; b++) {
        for (const x of [...run[a]]) {
          for (const y of [...run[b]]) {
            if (x.ruolo === y.ruolo || !run[a].includes(x)) continue;
            if (presente(run[b], x.giocatore, y) || presente(run[a], y.giocatore, x)) continue;
            const prima = { squilibrio: squilibrio(), desiderati: desiderati(run[a]) + desiderati(run[b]) };
            const scambia = () => {
              run[a][run[a].indexOf(x)] = y;
              run[b][run[b].indexOf(y)] = x;
            };
            scambia();
            const valido = copre(run[a]) && copre(run[b]) && desiderati(run[a]) + desiderati(run[b]) >= prima.desiderati;
            if (valido && meno(squilibrio(), prima.squilibrio)) {
              migliorato = true;
              break;
            }
            run[a][run[a].indexOf(y)] = x;
            run[b][run[b].indexOf(x)] = y;
          }
        }
      }
    }
  }
}

/** Le run nel formato del risultato, con chi resta fuori e perche'. */
function componi(giocatori, jolly, istanza, membri) {
  const run = membri.map((m) => ({
    membri: assegnaPosti(m, istanza),
    preferiti: istanza.preferiti.map((p) => m.filter((x) => x.ruolo === p.ruolo).length),
  }));
  const tutti = run.flatMap((r) => r.membri);

  const fuori = [];
  giocatori.forEach((_, g) => {
    const dentro = run.filter((r) => r.membri.some((m) => m.giocatore === g));
    if (run.length === 0 || dentro.length === run.length) return;
    const assenti = run.filter((r) => !dentro.includes(r));
    const piene = assenti.every((r) => r.membri.length >= istanza.maxParty);
    const propri = giocatori[g].account.filter((a) => a.personaggi.length > 0).length;
    const usati = tutti.filter((m) => m.giocatore === g && m.jolly === null).length;
    // "posti": ha altri account, ma i loro personaggi non hanno un posto (posti liberi riservati).
    const motivo = piene ? "piena" : usati < propri ? "posti" : "account";
    fuori.push({ giocatore: g, entrate: dentro.length, motivo });
  });

  return {
    run,
    entrate: tutti.length,
    preferiti: istanza.preferiti.map((p) => tutti.filter((m) => m.ruolo === p.ruolo).length),
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

/** "A, B e C" o "A, B and C". */
const elenca = (parti) => (parti.length === 1 ? parti[0] : `${parti.slice(0, -1).join(", ")} ${tr("e", "and")} ${parti.at(-1)}`);

/**
 * La frase di un gruppo di posti che non basta, con gli account che lo coprono:
 * Alberto non capiva "ci sono 8 account che li coprono" senza vedere quali
 * (23/10/2026). Un account si indica con la sua colonna (`numero`, dalla pagina).
 */
function spiega(giocatori, jolly, gruppo, run, servono, ci, copre) {
  const elenco = [];
  let n = 0;
  for (const g of giocatori) {
    const numeri = g.account.flatMap((a, ai) => (copre(a, gruppo) ? [a.numero ?? ai + 1] : []));
    if (numeri.length) elenco.push(`${g.nome} (${numeri.join(", ")})`);
    n += numeri.length;
  }
  jolly.forEach((j, ji) => {
    if (!copre(j, gruppo)) return;
    elenco.push(`${tr("Account Gilda", "Guild Account")} ${j.nome ?? ji + 1}`);
    n++;
  });
  const posti = elenca(gruppo.map((p) => `${p.quanti * run} ${p.nome}`));
  const runIt = `Per ${run} run ${servono === 1 ? "serve" : "servono"} ${posti}`;
  const runEn = `${run} ${run === 1 ? "run needs" : "runs need"} ${posti}`;
  let frase;
  if (gruppo.length === 1) {
    const nome = gruppo[0].nome;
    frase = n === 0
      ? tr(`${runIt}. Nessun account ha un ${nome}.`, `${runEn}. No account has a ${nome}.`)
      : tr(`${runIt}. Gli account che lo hanno sono ${n}: ${elenca(elenco)}.`,
        `${runEn}. There ${n === 1 ? "is 1 account" : `are ${n} accounts`} with one: ${elenca(elenco)}.`);
  } else {
    frase = tr(
      `${runIt}, ${servono} personaggi su account diversi. Gli account che hanno almeno uno ${gruppo.length === 2 ? "dei due" : "di questi"} sono ${n}: ${elenca(elenco)}. Ogni account entra con un solo personaggio.`,
      `${runEn}, ${servono} characters on different accounts. There ${n === 1 ? "is 1 account" : `are ${n} accounts`} with at least one of ${gruppo.length === 2 ? "the two" : "these"}: ${elenca(elenco)}. Each account enters with one character only.`,
    );
  }
  // Un giocatore entra al piu' una volta per run, anche con un jolly: chi ha piu' account delle
  // run, o jolly senza chi li giochi, ne conta meno di quanti ne elenca.
  if (n !== ci) {
    const conJolly = jolly.some((j) => copre(j, gruppo));
    frase += tr(` Un giocatore entra una volta per run${conJolly ? ", anche con un Account Gilda" : ""}, quindi ne contano ${ci}.`,
      ` A player enters once per run${conJolly ? ", also with a Guild Account" : ""}, so ${ci} of them count.`);
  }
  return frase;
}

/**
 * Perche' non si arriva a `run` run: i posti obbligatori per cui mancano account.
 * Si guarda anche ogni gruppo di posti insieme, perche' un account con piu' classi
 * conta per ognuna ma entra una volta sola: con HP/Prof/Clown in un account, HP,
 * Professor e Clown/Bard possono bastare uno per uno e non insieme (Alberto,
 * 23/10/2026: due run e nessuna spiegazione). Un giocatore copre al massimo un
 * posto per run, e un jolly lo gioca chi ha ancora un'entrata libera. Si
 * elencano solo i gruppi senza un gruppo piu' piccolo che gia' non basta.
 */
function cosaManca(giocatori, jolly, istanza, run) {
  const mancano = [];
  const minimo = istanza.posti.reduce((n, p) => n + p.quanti, 0);
  if (giocatori.length < minimo) mancano.push(tr(`Servono almeno ${minimo} giocatori presenti, ce ne sono ${giocatori.length}.`, `At least ${minimo} players present are needed, there are ${giocatori.length}.`));
  const posti = istanza.posti.filter((p) => p.quanti > 0);
  const copre = (account, gruppo) => account.personaggi.some((p) => gruppo.some((posto) => ruoloDi(istanza, p.classe) === posto.ruolo));
  const scarsi = [];
  for (let maschera = 1; maschera < 1 << posti.length; maschera++) {
    if (scarsi.some((s) => (s & maschera) === s)) continue;
    const gruppo = posti.filter((_, i) => maschera & (1 << i));
    const servono = run * gruppo.reduce((n, p) => n + p.quanti, 0);
    // Piu' posti per run che giocatori presenti: lo dice gia' la riga dei giocatori.
    if (servono > run * giocatori.length) continue;
    let propri = 0;
    let liberi = 0;
    for (const g of giocatori) {
      const usati = Math.min(run, g.account.filter((a) => copre(a, gruppo)).length);
      propri += usati;
      liberi += run - usati;
    }
    const ci = propri + Math.min(liberi, jolly.filter((a) => copre(a, gruppo)).length);
    if (ci >= servono) continue;
    scarsi.push(maschera);
    mancano.push(spiega(giocatori, jolly, gruppo, run, servono, ci, copre));
  }
  if (mancano.length === 0) mancano.push(tr("I posti obbligatori basterebbero, ma gli account non si riescono a dividere fra le run con una entrata per run a giocatore.", "The required slots would be enough, but the accounts cannot be split among the runs with one entry per run per player."));
  return mancano;
}
