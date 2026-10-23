/**
 * Calcolo delle run di un'istanza (quelle di `dati.js`).
 *
 * Regole (Alberto, 18/10/2026): un giocatore entra al massimo una volta per run
 * (un client alla volta); ogni account, jolly compresi, entra una volta sola;
 * una run ha al massimo `maxParty` persone e copre i posti obbligatori. Se
 * l'istanza ha `liberi` (l'Endless Cellar), nei posti liberi entrano solo
 * quei ruoli, e un posto con `massimo` ne ha al piu' tanti per run. Con `tipi`
 * (la Horror Toy Factory) ogni run ha in piu' i posti di uno dei tipi.
 *
 * Ordine di preferenza: piu' run complete, piu' entrate, piu' run del primo
 * tipo, piu' posti desiderati coperti (`desiderati` di un posto: non
 * obbligatori, ma i primi fra i liberi, fino a tanti per run; la Gypsy/Dancer
 * della Horror Toy Factory), piu' personaggi dei ruoli preferiti nell'ordine
 * dell'istanza (Sniper, poi High Priest, poi Priest), entrate divise fra i
 * giocatori, meno jolly; poi run di grandezza simile e Sniper divisi fra le run.
 *
 * Come calcola, per ogni numero di run e ogni ripartizione fra i tipi:
 * 1. quali personaggi entrano. Con un tipo solo basta contare: K run complete
 *    esistono se e solo se i personaggi scelti hanno in tutto K volte ogni
 *    posto, con ogni giocatore al piu' K personaggi. E' il teorema di Konig: un
 *    grafo bipartito (giocatori da una parte, posti dall'altra) con grado
 *    massimo K si colora con K colori, cioe' le run. Quindi e' un flusso di
 *    costo minimo: giocatori, account o jolly, ruoli, posti; il punteggio
 *    diventa il costo;
 * 2. in quale run va ognuno: con un tipo solo, colorazione degli archi del
 *    grafo. I posti liberi sono nodi da K archi riempiti prima con i preferiti,
 *    nel loro ordine, cosi' persone e Sniper vengono divisi fra le run al meglio
 *    (al piu' uno di differenza).
 * Con run di tipi diversi i conti possono tornare senza che una divisione
 * esista (il Champion e il Priest del suo tipo sono di due giocatori che
 * servono anche altrove). Il passo 2 sceglie allora il tipo di run di ogni
 * contributo con un altro flusso (`dividiMisto`), esatto per i personaggi
 * scelti; se non si possono dividere, si passa alla ripartizione successiva.
 * Scelta di Alberto (23/10/2026) fra questa e una ricerca esatta su tutto,
 * piu' lenta: il risultato e' sempre valido, ma in casi rari potrebbe non
 * essere il migliore (su 3.000 casi di prova con run miste non e' successo).
 *
 * Fino alla 1.4 il passo 1 era una programmazione dinamica sui giocatori, con
 * stato i posti coperti in tutto: con i nove ruoli dell'Endless Cellar 14
 * giocatori chiedevano 13 secondi.
 */

import { composizioni, copre, ISTANZE, richieste, ruoliDi, ruoloDi, soddisfa, TANKER, tr } from "./dati.js";

/**
 * I modi di usare un account: uno per ruolo che conta (posti obbligatori e
 * preferiti) fra i suoi personaggi, oppure uno solo se non ne ha. Un ruolo che
 * conta non e' mai peggio di "altro": oltre i posti vale come un posto libero.
 */
function usiAccount(account, istanza) {
  // Con i posti liberi riservati (`liberi`) entrano solo i ruoli dei posti: gli altri non hanno dove stare.
  const contano = new Set([
    ...composizioni(istanza).flat().flatMap((p) => [...ruoliDi(p), ...(p.alternativa ? [p.alternativa.ruolo] : [])]),
    ...(istanza.liberi ? [] : istanza.preferiti.map((p) => p.ruolo)),
  ]);
  const usi = [];
  account.personaggi.forEach((p, indice) => {
    const ruolo = ruoloDi(istanza, p.classe);
    if (contano.has(ruolo) && !usi.some((u) => u.ruolo === ruolo)) usi.push({ ruolo, personaggio: indice });
  });
  if (usi.length === 0 && account.personaggi.length > 0 && !istanza.liberi) usi.push({ ruolo: "altro", personaggio: 0 });
  return usi;
}

/** Ogni modo di dividere `n` run fra `tipi` tipi: quante run per tipo. */
function ripartizioni(tipi, n) {
  if (tipi === 1) return [[n]];
  return [...Array(n + 1).keys()].flatMap((k) => ripartizioni(tipi - 1, n - k).map((resto) => [k, ...resto]));
}

/**
 * Le run migliori con i giocatori presenti e i jolly disponibili.
 *
 * @param {Array<{nome: string, tanker?: boolean, run?: number, account: Array<{personaggi: Array<{classe: string}>}>}>} giocatori
 *   solo i presenti; `tanker`: copre i posti `tanker` con i suoi account (non con i jolly);
 *   `run`: quante ne fa al massimo
 * @param {Array<{personaggi: Array<{classe: string}>}>} jolly solo i disponibili
 * @param {object} [istanza] una di `ISTANZE`, la prima se non si indica
 * @returns {{run: Array<{membri: Array<object>, preferiti: number[], tipo: number | null}>, entrate: number,
 *   preferiti: number[], jolly: number, fuori: Array<{giocatore: number, entrate: number, motivo: string}>,
 *   mancano: string[]}}
 *   Ogni membro: `giocatore`, `account` o `jolly` (indici), `personaggio`, `ruolo`, `posto` (null se libero),
 *   `tanker` se copre un posto `tanker`, `tank` se e' lui a tankare. `tipo`: l'indice in `istanza.tipi`
 */
export function calcolaRun(giocatori, jolly, istanza = ISTANZE[0]) {
  const tipi = composizioni(istanza);
  for (let nRun = istanza.maxRun; nRun > 0; nRun--) {
    // Prima il passo 1 per ogni ripartizione, che e' veloce; poi si divide dalla migliore in giu'.
    const candidate = ripartizioni(tipi.length, nRun)
      .map((quante) => {
        const tipoRun = quante.flatMap((n, t) => Array(n).fill(t));
        const postiRun = tipoRun.map((t) => tipi[t]);
        const trovato = cerca(giocatori, jolly, istanza, postiRun);
        // Piu' run del primo tipo: vale meno delle entrate e piu' di tutto il resto.
        return trovato && { ...trovato, costo: trovato.costo - quante[0] * trovato.pesi.tipo, quante, tipoRun, postiRun, misto: quante.filter((n) => n > 0).length > 1 };
      })
      .filter(Boolean)
      .sort((a, b) => a.costo - b.costo);
    for (const c of candidate) {
      const run = c.misto ? dividiMisto(c.scelti, istanza, c.quante, tipi) : dividi(c.scelti, istanza, c.postiRun[0], nRun);
      if (!run) continue;
      pareggia(run, istanza, c.postiRun);
      return componi(giocatori, jolly, istanza, run, c.tipoRun);
    }
  }
  return componi(giocatori, jolly, istanza, [], []);
}

/**
 * Passo 1: i personaggi che entrano in run complete con i posti `postiRun` (uno
 * per run), come `{scelti, costo, pesi}`: i contributi `{giocatore, account,
 * jolly, personaggio, ruolo}`, il costo senza i posti obbligatori, o null.
 *
 * La rete: sorgente, giocatori (una unita' per entrata), i loro account e i
 * jolly (una unita' ciascuno), ruoli, poi i posti obbligatori di ogni ruolo
 * dritti al pozzo, i posti con piu' ruoli in un nodo loro e il resto nel nodo
 * dei posti liberi, che ne tiene quanti le run hanno posti liberi. Il
 * punteggio e' una somma con un peso per criterio, ognuno piu' grande di tutto
 * quello che vale meno: i posti obbligatori coperti valgono piu' di ogni altra
 * cosa, quindi le run sono possibili (con un tipo solo: se e solo se) quando il
 * flusso migliore li copre tutti.
 */
function cerca(giocatori, jolly, istanza, postiRun) {
  const nRun = postiRun.length;
  const maxEntrate = istanza.maxParty * nRun;
  const liberiRun = postiRun.map((posti) => istanza.maxParty - posti.reduce((n, p) => n + p.quanti, 0));
  if (liberiRun.some((l) => l < 0)) return null;

  // Pesi dal criterio meno importante: ogni criterio e' un intero fra 0 e il suo massimo.
  const pesi = {};
  let peso = 1;
  const criteri = [
    ["jolly", maxEntrate],
    ["quadrati", maxEntrate * nRun],
    ...istanza.preferiti.map((p) => [`preferito:${p.ruolo}`, maxEntrate]).reverse(),
    // Un posto desiderato coperto dal suo ruolo e non dall'alternativa: la Gypsy prima del Soul Linker.
    ["principali", maxEntrate],
    ["desiderati", maxEntrate],
    // Le run del primo tipo: le conta `calcolaRun`, che confronta le ripartizioni.
    ["tipo", nRun],
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
  let obbligatori = 0;
  const obbligatorio = (da, cap) => {
    obbligatori += cap;
    arco(da, 1, cap, -pesi.posti, { obbligatorio: true });
  };

  // I posti con piu' ruoli ("High Priest o Priest"): un nodo per gruppo di ruoli, con quelli di tutte le run.
  const multipli = new Map();
  for (const posti of postiRun) {
    for (const p of posti.filter((x) => x.ruoli && x.quanti > 0)) {
      const chiave = p.ruoli.join("+");
      if (!multipli.has(chiave)) multipli.set(chiave, { ruoli: p.ruoli, quanti: 0 });
      multipli.get(chiave).quanti += p.quanti;
    }
  }
  for (const m of multipli.values()) {
    m.nodo = nodo();
    obbligatorio(m.nodo, m.quanti);
  }

  // Un posto desiderato e' un nodo verso i liberi, condiviso fra il suo ruolo e l'alternativa.
  const desiderato = new Map();
  const nodoDesiderato = (posto) => {
    if (!desiderato.has(posto)) {
      desiderato.set(posto, nodo());
      arco(desiderato.get(posto), 2, posto.desiderati * nRun, 0);
    }
    return desiderato.get(posto);
  };
  // Ruoli: un nodo per ruolo che conta, con i suoi posti obbligatori, desiderati e liberi. Con
  // `tanker` un nodo in piu' per i personaggi dei giocatori tanker: copre quei posti, poi vale come gli altri.
  const ruoli = new Map();
  const nodiTanker = new Map();
  const nodoRuolo = (ruolo) => {
    if (ruoli.has(ruolo)) return ruoli.get(ruolo);
    const n = nodo();
    ruoli.set(ruolo, n);
    const ammesso = !istanza.liberi || istanza.liberi.includes(ruolo);
    let quanti = 0;
    let tanker = 0;
    let tetto = 0;
    postiRun.forEach((posti, r) => {
      const suoi = posti.filter((p) => !p.ruoli && p.ruolo === ruolo);
      const qui = suoi.reduce((s, p) => s + p.quanti, 0);
      quanti += qui;
      tanker += suoi.reduce((s, p) => s + (p.tanker ?? 0), 0);
      tetto += Math.min(...suoi.map((p) => p.massimo ?? Infinity), qui + (ammesso ? liberiRun[r] : 0));
    });
    const posto = istanza.posti.find((p) => p.ruolo === ruolo && p.desiderati > 0);
    const diAlternativa = istanza.posti.find((p) => p.alternativa?.ruolo === ruolo && p.desiderati > 0);
    const desiderati = posto ? Math.min(posto.desiderati * nRun, tetto - quanti) : 0;
    const alternativa = diAlternativa ? Math.min(diAlternativa.desiderati * nRun, tetto - quanti - desiderati) : 0;
    if (tanker > 0) {
      const c = nodo();
      nodiTanker.set(ruolo, c);
      obbligatorio(c, tanker);
      arco(c, n, maxEntrate, 0);
    }
    if (quanti > tanker) obbligatorio(n, quanti - tanker);
    for (const m of multipli.values()) if (m.ruoli.includes(ruolo)) arco(n, m.nodo, m.quanti, 0);
    if (desiderati > 0) arco(n, nodoDesiderato(posto), desiderati, -pesi.desiderati - pesi.principali);
    if (alternativa > 0) arco(n, nodoDesiderato(diAlternativa), alternativa, -pesi.desiderati);
    if (tetto - quanti - desiderati - alternativa > 0) arco(n, 2, tetto - quanti - desiderati - alternativa, 0);
    return n;
  };
  const versoRuoli = (n, account, tanker = false) => {
    for (const uso of usiAccount(account, istanza)) {
      const preferito = pesi[`preferito:${uso.ruolo}`] ?? 0;
      const verso = nodoRuolo(uso.ruolo);
      if (tanker && nodiTanker.has(uso.ruolo)) arco(n, nodiTanker.get(uso.ruolo), 1, -preferito, { uso: { ...uso, tanker: true } });
      else arco(n, verso, 1, -preferito, { uso });
    }
  };
  arco(2, 1, liberiRun.reduce((a, b) => a + b, 0), 0);
  // Tutti i posti subito: un posto che nessuno puo' coprire deve avere il suo arco obbligatorio.
  for (const p of postiRun.flat()) if (!p.ruoli) nodoRuolo(p.ruolo);

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
    for (let k = 1; k <= Math.min(nRun, g.run ?? nRun); k++) arco(0, n, 1, -pesi.entrate + (2 * k - 1) * pesi.quadrati);
    g.account.forEach((a, ai) => {
      const n2 = nodo();
      arco(n, n2, 1, 0, { giocatore: gi, account: ai });
      versoRuoli(n2, a, g.tanker);
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
  // Senza i posti obbligatori, che cambiano con la ripartizione: cosi' i costi si confrontano.
  const costo = archi.reduce((s, e, i) => s + flusso[i] * e.costo, 0) + obbligatori * pesi.posti;
  return { scelti, costo, pesi };
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
 * I posti obbligatori nell'ordine in cui si riempiono: prima quelli dei tanker,
 * poi quelli di un ruolo solo, poi quelli con piu' ruoli, cosi' nessuno prende i
 * personaggi che servono a un posto piu' stretto.
 */
const ordinePosti = (posti) =>
  [...posti.entries()]
    .filter(([, p]) => p.quanti > 0)
    .sort(([, a], [, b]) => (a.tanker ? 0 : a.ruoli ? 2 : 1) - (b.tanker ? 0 : b.ruoli ? 2 : 1));

/**
 * Passo 2 con run tutte dello stesso tipo: divide i contributi in `nRun` run.
 * Ogni posto obbligatorio e' un nodo con esattamente `nRun` archi, uno per run;
 * ogni posto desiderato un nodo con i personaggi di quel ruolo che ci sono,
 * completato con i liberi meno preziosi; gli altri liberi sono nodi da `nRun`
 * archi, riempiti prima con i preferiti, nel loro ordine. Gli archi si colorano
 * con l'algoritmo dei cammini alternati (Konig): ogni colore, cioe' run, ha al
 * piu' un arco per nodo. Cosi' le run hanno i posti obbligatori, i desiderati e
 * al piu' una persona di differenza; `pareggia` divide poi i preferiti.
 */
function dividi(scelti, istanza, posti, nRun) {
  const nodiGiocatore = new Map();
  const archi = [];
  const destri = [];
  const nuovoDestro = () => destri.push(0) - 1;

  const restanti = [...scelti];
  for (const [, posto] of ordinePosti(posti)) {
    for (let q = 0; q < posto.quanti; q++) {
      const nodo = nuovoDestro();
      const soloTanker = q < (posto.tanker ?? 0);
      for (let r = 0; r < nRun; r++) {
        const i = restanti.findIndex((c) => ruoliDi(posto).includes(c.ruolo) && (!soloTanker || c.tanker));
        archi.push({ contributo: restanti.splice(i, 1)[0], destro: nodo });
      }
    }
  }
  const buchi = [];
  for (const posto of posti) {
    for (let q = 0; q < (posto.desiderati ?? 0); q++) {
      const nodo = nuovoDestro();
      let archiNodo = 0;
      for (let r = 0; r < nRun; r++) {
        let i = restanti.findIndex((c) => c.ruolo === posto.ruolo);
        if (i < 0 && posto.alternativa) i = restanti.findIndex((c) => c.ruolo === posto.alternativa.ruolo);
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
  const conMassimo = (c) => posti.some((p) => p.ruolo === c.ruolo && p.massimo !== undefined);
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
  return run;
}

/**
 * Passo 2 con run di due tipi: prima si sceglie per ogni contributo il gruppo,
 * le run del primo tipo o quelle del secondo, poi ogni gruppo si divide con
 * `dividi`, esatto perche' le sue run sono tutte uguali. La scelta del gruppo e'
 * un flusso con limiti minimi e massimi, esatto anche lui: un contributo e' un
 * arco dal suo giocatore all'insieme di ruoli piu' stretto che lo contiene
 * (HP Tanker dentro High Priest dentro "High Priest o Priest": sono annidati),
 * e passa se va nel primo gruppo. Un giocatore ne manda al primo gruppo al piu'
 * tante quante le sue run, e al secondo al piu' tante quante le altre; un
 * insieme di ruoli ne riceve almeno quanti ne chiede il primo gruppo e ne lascia
 * almeno quanti ne chiede il secondo. Null se i contributi scelti non si
 * possono dividere cosi'.
 */
function dividiMisto(scelti, istanza, quante, tipi) {
  const [n0, n1] = quante;
  // Gli insiemi di ruoli chiesti dai due tipi, dal piu' stretto, con quanti ne servono a ogni gruppo.
  const insiemi = [];
  const aggiungi = (q, gruppo, volte) => {
    const chiave = `${[...q.ruoli].sort().join("+")}${q.tanker ? "+tanker" : ""}`;
    let s = insiemi.find((x) => x.chiave === chiave);
    if (!s) insiemi.push((s = { chiave, ruoli: q.ruoli, tanker: q.tanker === true, chiesti: [0, 0] }));
    s.chiesti[gruppo] = Math.max(s.chiesti[gruppo], q.quanti * volte);
  };
  richieste(tipi[0]).forEach((q) => aggiungi(q, 0, n0));
  richieste(tipi[1]).forEach((q) => aggiungi(q, 1, n1));
  insiemi.sort((x, y) => x.ruoli.length * 2 - x.tanker - (y.ruoli.length * 2 - y.tanker));
  const dentro = (x, y) => x !== y && x.ruoli.every((r) => y.ruoli.includes(r)) && (!y.tanker || x.tanker);

  // Nodi: 0 e 1 sorgente e pozzo dei limiti minimi, 2 sorgente e 3 pozzo veri, poi giocatori e insiemi.
  let nNodi = 4;
  const archi = [];
  const eccesso = [0, 0, 0, 0];
  // Un arco con un minimo diventa il resto della capacita', e il minimo passa dalla sorgente e dal pozzo nuovi.
  const arco = (da, a, minimo, massimo, info = {}) => {
    if (minimo > massimo) return false;
    eccesso[a] += minimo;
    eccesso[da] -= minimo;
    archi.push({ da, a, cap: massimo - minimo, costo: 0, ...info });
    return true;
  };
  const nuovo = () => {
    eccesso.push(0);
    return nNodi++;
  };
  let ok = arco(3, 2, Math.max(0, scelti.length - n1 * istanza.maxParty), n0 * istanza.maxParty);
  for (const s of insiemi) {
    s.nodo = nuovo();
    s.quanti = scelti.filter((c) => soddisfa(c, s)).length;
  }
  for (const s of insiemi) {
    const padre = insiemi.find((y) => dentro(s, y));
    ok &&= arco(s.nodo, padre ? padre.nodo : 3, s.chiesti[0], s.quanti - s.chiesti[1]);
  }
  const giocatori = new Map();
  scelti.forEach((c, i) => {
    if (!giocatori.has(c.giocatore)) giocatori.set(c.giocatore, { nodo: nuovo(), quanti: 0 });
    const g = giocatori.get(c.giocatore);
    g.quanti++;
    const foglia = insiemi.find((s) => soddisfa(c, s));
    arco(g.nodo, foglia ? foglia.nodo : 3, 0, 1, { contributo: i });
  });
  for (const g of giocatori.values()) ok &&= arco(2, g.nodo, Math.max(0, g.quanti - n1), Math.min(n0, g.quanti));
  if (!ok) return null;

  // I minimi sono rispettati se il flusso massimo dalla sorgente nuova la satura: costo -1 sui suoi archi.
  let dovuti = 0;
  eccesso.forEach((e, v) => {
    if (e > 0) {
      archi.push({ da: 0, a: v, cap: e, costo: -1 });
      dovuti += e;
    } else if (e < 0) archi.push({ da: v, a: 1, cap: -e, costo: 0 });
  });
  const flusso = flussoMinimo(nNodi, archi);
  if (archi.reduce((s, e, i) => s + (e.da === 0 ? flusso[i] : 0), 0) < dovuti) return null;

  const primo = new Set(archi.flatMap((e, i) => (e.contributo !== undefined && flusso[i] > 0 ? [e.contributo] : [])));
  const gruppi = [scelti.filter((_, i) => primo.has(i)), scelti.filter((_, i) => !primo.has(i))];
  return gruppi.flatMap((g, t) => (quante[t] > 0 ? dividi(g, istanza, tipi[t], quante[t]) : []));
}

/**
 * Migliora la divisione scambiando due membri di run diverse, o spostandone uno
 * se una run ci guadagna un posto desiderato, finche' serve. Uno scambio vale
 * solo se le due run tengono i loro posti. Conta prima i posti desiderati (con
 * run di tipi diversi la ricerca non li guarda), poi il primo preferito (lo
 * Sniper), poi gli altri nel loro ordine.
 */
function pareggia(run, istanza, postiRun) {
  const conta = (membri, ruolo) => membri.filter((m) => m.ruolo === ruolo).length;
  // I posti desiderati coperti in una run, e quanti dal loro ruolo e non dall'alternativa.
  const desiderati = (membri) =>
    istanza.posti.reduce(
      (n, p) => {
        const propri = Math.max(0, conta(membri, p.ruolo) - p.quanti);
        const alternativa = p.alternativa ? conta(membri, p.alternativa.ruolo) : 0;
        return [n[0] + Math.min(propri + alternativa, p.desiderati ?? 0), n[1] + Math.min(propri, p.desiderati ?? 0)];
      },
      [0, 0],
    );
  const valore = () => {
    const d = run.map(desiderati).reduce((a, b) => [a[0] + b[0], a[1] + b[1]]);
    return [...d, ...istanza.preferiti.map((p) => -run.reduce((n, m) => n + conta(m, p.ruolo) ** 2, 0))];
  };
  const meglio = (a, b) => {
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] > b[i];
    return false;
  };
  const presente = (membri, giocatore, tranne) => membri.some((m) => m !== tranne && m.giocatore === giocatore);
  const valide = (a, b) => copre(run[a], postiRun[a]) && copre(run[b], postiRun[b]);

  for (let migliorato = true; migliorato; ) {
    migliorato = false;
    for (let a = 0; a < run.length; a++) {
      for (let b = 0; b < run.length; b++) {
        if (a === b) continue;
        for (const x of [...run[a]]) {
          if (!run[a].includes(x)) continue;
          const prima = valore();
          // Spostamento: solo per un posto desiderato in piu', perche' cambia le persone per run.
          if (run[b].length < istanza.maxParty && !presente(run[b], x.giocatore)) {
            run[a].splice(run[a].indexOf(x), 1);
            run[b].push(x);
            const dopo = valore();
            if (valide(a, b) && (dopo[0] > prima[0] || (dopo[0] === prima[0] && dopo[1] > prima[1]))) {
              migliorato = true;
              continue;
            }
            run[b].pop();
            run[a].push(x);
          }
          if (b < a) continue;
          for (const y of [...run[b]]) {
            if (x.ruolo === y.ruolo || !run[a].includes(x)) continue;
            if (presente(run[b], x.giocatore, y) || presente(run[a], y.giocatore, x)) continue;
            run[a][run[a].indexOf(x)] = y;
            run[b][run[b].indexOf(y)] = x;
            if (valide(a, b) && meglio(valore(), prima)) {
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
function componi(giocatori, jolly, istanza, membri, tipoRun) {
  const tipi = composizioni(istanza);
  const run = membri.map((m, i) => ({
    membri: assegnaPosti(m, tipi[tipoRun[i]]),
    preferiti: istanza.preferiti.map((p) => m.filter((x) => x.ruolo === p.ruolo).length),
    tipo: istanza.tipi ? tipoRun[i] : null,
  }));
  const tutti = run.flatMap((r) => r.membri);

  const fuori = [];
  giocatori.forEach((_, g) => {
    const dentro = run.filter((r) => r.membri.some((m) => m.giocatore === g));
    // Chi fa meno run per scelta sua non e' fra quelli che restano fuori.
    if (run.length === 0 || dentro.length >= Math.min(run.length, giocatori[g].run ?? run.length)) return;
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

/** I membri di una run con il loro posto: prima gli obbligatori nell'ordine dei posti, poi i liberi. */
function assegnaPosti(membri, posti) {
  const liberi = [...membri];
  const obbligatori = [];
  for (const [indice, posto] of ordinePosti(posti)) {
    for (let i = 0; i < posto.quanti; i++) {
      const k = liberi.findIndex((m) => ruoliDi(posto).includes(m.ruolo) && (i >= (posto.tanker ?? 0) || m.tanker));
      const tank = posto.tank || i < (posto.tanker ?? 0);
      if (k >= 0) obbligatori.push({ ...liberi.splice(k, 1)[0], posto: posto.nome, indice, ...(tank ? { tank } : {}) });
    }
  }
  obbligatori.sort((a, b) => a.indice - b.indice);
  return [...obbligatori.map(({ indice, ...m }) => m), ...liberi.map((m) => ({ ...m, posto: null }))];
}

/** "A, B e C" o "A, B and C". */
const elenca = (parti) => (parti.length === 1 ? parti[0] : `${parti.slice(0, -1).join(", ")} ${tr("e", "and")} ${parti.at(-1)}`);

/**
 * La frase di un gruppo di posti che non basta, con gli account che lo coprono:
 * Alberto non capiva "ci sono 8 account che li coprono" senza vedere quali
 * (23/10/2026). Un account si indica con la sua colonna (`numero`, dalla pagina).
 */
function spiega(giocatori, jolly, gruppo, run, servono, ci, copreAccount) {
  const elenco = [];
  let n = 0;
  for (const g of giocatori) {
    const numeri = g.account.flatMap((a, ai) => (copreAccount(a, gruppo, g.tanker) ? [a.numero ?? ai + 1] : []));
    if (numeri.length) elenco.push(`${g.nome} (${numeri.join(", ")})`);
    n += numeri.length;
  }
  jolly.forEach((j, ji) => {
    if (!copreAccount(j, gruppo)) return;
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
    const conJolly = jolly.some((j) => copreAccount(j, gruppo));
    const limitati = giocatori.some((g) => (g.run ?? run) < run && g.account.some((a) => copreAccount(a, gruppo, g.tanker)));
    frase += tr(
      ` Un giocatore entra una volta per run${conJolly ? ", anche con un Account Gilda" : ""}${limitati ? `, e qualcuno fa meno di ${run} run` : ""}, quindi ne contano ${ci}.`,
      ` A player enters once per run${conJolly ? ", also with a Guild Account" : ""}${limitati ? `, and some play fewer than ${run} runs` : ""}, so ${ci} of them count.`,
    );
  }
  return frase;
}

/**
 * Perche' non si arriva a `run` run con i posti `posti`: i posti obbligatori per
 * cui mancano account. Si guarda anche ogni gruppo di posti insieme, perche' un
 * account con piu' classi conta per ognuna ma entra una volta sola: con
 * HP/Prof/Clown in un account, HP, Professor e Clown/Bard possono bastare uno
 * per uno e non insieme (Alberto, 23/10/2026: due run e nessuna spiegazione).
 * Un giocatore copre al massimo un posto per run, e un jolly lo gioca chi ha
 * ancora un'entrata libera. Si elencano solo i gruppi senza un gruppo piu'
 * piccolo che gia' non basta.
 */
function cosaMancaCon(giocatori, jolly, istanza, posti, run) {
  const mancano = [];
  const minimo = posti.reduce((n, p) => n + p.quanti, 0);
  // Le run che un giocatore puo' fare: tutte, o meno se ha un limite.
  const quante = (g) => Math.min(run, g.run ?? run);
  const entrate = giocatori.reduce((n, g) => n + quante(g), 0);
  if (giocatori.length < minimo) mancano.push(tr(`Servono almeno ${minimo} giocatori presenti, ce ne sono ${giocatori.length}.`, `At least ${minimo} players present are needed, there are ${giocatori.length}.`));
  else if (entrate < minimo * run) {
    mancano.push(tr(
      `Per ${run} run servono ${minimo * run} entrate, i giocatori presenti ne fanno ${entrate}: qualcuno fa meno di ${run} run.`,
      `${run} runs need ${minimo * run} entries, the players present make ${entrate}: some play fewer than ${run} runs.`,
    ));
  }
  // I posti dei tanker sono un posto in piu', contato da solo o con gli altri, ma non insieme al suo
  // posto: `quanti` li comprende gia'.
  const gruppi = posti
    .filter((p) => p.quanti > 0)
    .flatMap((p) => [p, ...(p.tanker ? [{ ruoli: ruoliDi(p), nome: `${p.nome} (${TANKER})`, quanti: p.tanker, di: p }] : [])]);
  const copreAccount = (account, gruppo, tanker = false) =>
    account.personaggi.some((p) => gruppo.some((posto) => ruoliDi(posto).includes(ruoloDi(istanza, p.classe)) && (!posto.di || tanker)));
  const scarsi = [];
  for (let maschera = 1; maschera < 1 << gruppi.length; maschera++) {
    if (scarsi.some((s) => (s & maschera) === s)) continue;
    const gruppo = gruppi.filter((_, i) => maschera & (1 << i));
    if (gruppo.some((p) => gruppo.includes(p.di))) continue;
    const servono = run * gruppo.reduce((n, p) => n + p.quanti, 0);
    // Piu' posti che entrate dei giocatori presenti: lo dice gia' la riga dei giocatori o delle entrate.
    if (servono > entrate) continue;
    let propri = 0;
    let liberi = 0;
    for (const g of giocatori) {
      const usati = Math.min(quante(g), g.account.filter((a) => copreAccount(a, gruppo, g.tanker)).length);
      propri += usati;
      liberi += quante(g) - usati;
    }
    const ci = propri + Math.min(liberi, jolly.filter((a) => copreAccount(a, gruppo)).length);
    if (ci >= servono) continue;
    scarsi.push(maschera);
    mancano.push(spiega(giocatori, jolly, gruppo, run, servono, ci, copreAccount));
  }
  if (mancano.length === 0) mancano.push(tr("I posti obbligatori basterebbero, ma gli account non si riescono a dividere fra le run con una entrata per run a giocatore.", "The required slots would be enough, but the accounts cannot be split among the runs with one entry per run per player."));
  return mancano;
}

/**
 * Cosa manca per `run` run. Con piu' tipi di run, per ognuno come se fossero
 * tutte di quel tipo: le righe uguali una volta sola, le altre con il tipo
 * davanti. Si lasciano fuori i tipi che non si possono fare per niente (nessuno
 * ha un Champion, o i giocatori sono meno del suo party minimo), se ne resta uno.
 */
function cosaManca(giocatori, jolly, istanza, run) {
  const tipi = composizioni(istanza);
  if (tipi.length === 1) return cosaMancaCon(giocatori, jolly, istanza, tipi[0], run);
  const account = [...giocatori.flatMap((g) => g.account), ...jolly];
  const possibile = (t) =>
    giocatori.length >= tipi[t].reduce((n, p) => n + p.quanti, 0) &&
    istanza.tipi[t].posti.every((p) => account.some((a) => a.personaggi.some((x) => ruoliDi(p).includes(ruoloDi(istanza, x.classe)))));
  const scelti = tipi.map((_, t) => t).filter(possibile);
  const usati = scelti.length > 0 ? scelti : tipi.map((_, t) => t);
  const perTipo = usati.map((t) => cosaMancaCon(giocatori, jolly, istanza, tipi[t], run));
  if (perTipo.length === 1) return perTipo[0];
  const comuni = perTipo[0].filter((riga) => perTipo.every((righe) => righe.includes(riga)));
  return [
    ...comuni,
    ...perTipo.flatMap((righe, i) => {
      const nome = istanza.tipi[usati[i]].nome;
      return righe.filter((riga) => !comuni.includes(riga)).map((riga) => tr(`Con ${nome}: `, `With ${nome}: `) + riga);
    }),
  ];
}
