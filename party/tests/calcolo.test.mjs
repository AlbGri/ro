/**
 * Test del calcolo delle run. Si eseguono senza installare nulla, dalla
 * cartella `party/`: `node --test tests/*.mjs`.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { calcolaRun } from "../calcolo.js";
import { composizioni, copre, eForte, ISTANZE, ruoliDi, ruoloDi } from "../dati.js";

const ISTANZA = ISTANZE[0];

const account = (...classi) => ({ personaggi: classi.map((classe) => ({ classe })) });
// Nei casi che non riguardano gli HP Tanker tutti gli High Priest di `giocatore` lo sono; quelli
// di `scarso` no.
const tank = (a) => ({ ...a, personaggi: a.personaggi.map((p) => (p.classe === "High Priest" ? { classe: "HP Tanker" } : p)) });
const giocatore = (nome, ...accounts) => ({ nome, account: accounts.map(tank) });
const scarso = (nome, ...accounts) => ({ nome, account: accounts });

/** Il personaggio di un membro del risultato. */
function personaggio(giocatori, jolly, m) {
  const a = m.jolly === null ? giocatori[m.giocatore].account[m.account] : jolly[m.jolly];
  return a.personaggi[m.personaggio];
}

/** Una run rispetta persone, posti obbligatori, massimi e posti liberi riservati di una composizione. */
const validaCon = (membri, istanza, posti) =>
  membri.length <= istanza.maxParty &&
  copre(membri, posti) &&
  (!istanza.liberi ||
    (posti.every((p) => istanza.liberi.includes(p.ruolo) || membri.filter((m) => ruoliDi(p).includes(m.ruolo)).length <= p.quanti) &&
      membri.every((m) => posti.some((p) => ruoliDi(p).includes(m.ruolo)))));
const runValida = (membri, istanza) => composizioni(istanza).some((posti) => validaCon(membri, istanza, posti));

/** Controlla le regole e rende il punteggio da confrontare con la ricerca esaustiva. */
function verifica(giocatori, jolly, istanza, esito) {
  const accountUsati = new Set();
  for (const run of esito.run) {
    assert.ok(runValida(run.membri, istanza), "run che non rispetta la composizione");
    const giocatoriRun = new Set();
    for (const m of run.membri) {
      assert.ok(!giocatoriRun.has(m.giocatore), "un giocatore due volte nella stessa run");
      giocatoriRun.add(m.giocatore);
      const id = m.jolly === null ? `${m.giocatore}/${m.account}` : `j${m.jolly}`;
      assert.ok(!accountUsati.has(id), "un account in due run");
      accountUsati.add(id);
      assert.equal(ruoloDi(istanza, personaggio(giocatori, jolly, m).classe), m.ruolo);
      if (m.forte) assert.ok(eForte(istanza, personaggio(giocatori, jolly, m).classe), "posto forte senza la classe forte");
    }
  }
  return punteggio(esito.run.map((r) => r.membri.map((m) => ({ ...m }))), istanza);
}

/** Il punteggio di una ripartizione, nell'ordine di preferenza del calcolo. */
function punteggio(run, istanza) {
  const entrate = new Map();
  const preferiti = istanza.preferiti.map(() => 0);
  let jolly = 0;
  let persone2 = 0;
  let preferiti2 = 0;
  let desiderati = 0;
  let principali = 0;
  for (const membri of run) {
    for (const p of istanza.posti) {
      const propri = Math.max(0, membri.filter((m) => m.ruolo === p.ruolo).length - p.quanti);
      const alternativa = p.alternativa ? membri.filter((m) => m.ruolo === p.alternativa.ruolo).length : 0;
      desiderati += Math.min(propri + alternativa, p.desiderati ?? 0);
      principali += Math.min(propri, p.desiderati ?? 0);
    }
    istanza.preferiti.forEach((p, k) => (preferiti[k] += membri.filter((m) => m.ruolo === p.ruolo).length));
    const pref = membri.filter((m) => m.ruolo === istanza.preferiti[0].ruolo).length;
    jolly += membri.filter((m) => m.jolly !== null).length;
    persone2 += membri.length ** 2;
    preferiti2 += pref ** 2;
    for (const m of membri) entrate.set(m.giocatore, (entrate.get(m.giocatore) ?? 0) + 1);
  }
  const totale = [...entrate.values()].reduce((a, b) => a + b, 0);
  const quadrati = [...entrate.values()].reduce((a, b) => a + b * b, 0);
  // + 0 trasforma -0 in 0, che deepEqual distingue.
  // Le run che vanno bene per il primo tipo, quello preferito.
  // Meno run dell'ultimo tipo, poi del penultimo: ogni run vale come il primo tipo che rispetta.
  const tipi = composizioni(istanza);
  const tipo = istanza.tipi ? -run.reduce((n, m) => n + (run.length + 1) ** tipi.findIndex((posti) => validaCon(m, istanza, posti)), 0) : 0;
  return [run.length, totale, tipo, desiderati, principali, ...preferiti, -quadrati, -jolly, -persone2, -preferiti2].map((x) => x + 0);
}

/** Il punteggio migliore provando tutte le ripartizioni. */
function forzaBruta(giocatori, jolly, istanza) {
  const ruolo = (p) => ruoloDi(istanza, p.classe);
  let migliore = null;
  const run = [...Array(istanza.maxRun)].map(() => []);
  const jollyUsati = new Set();

  const meglio = (a, b) => {
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] > b[i];
    return false;
  };
  const foglia = () => {
    const piene = run.filter((m) => m.length > 0);
    // Le run fatte sono sempre le prime.
    if (run.some((m, r) => m.length > 0 && r > 0 && run[r - 1].length === 0)) return;
    if (!piene.every((m) => runValida(m, istanza))) return;
    const p = punteggio(piene, istanza);
    if (!migliore || meglio(p, migliore)) migliore = p;
  };

  (function perGiocatore(g) {
    if (g === giocatori.length) return foglia();
    const usati = new Set();
    (function perRun(r) {
      if (r === istanza.maxRun) return perGiocatore(g + 1);
      perRun(r + 1);
      if (run[r].length >= istanza.maxParty) return;
      if (giocatori[g].run && !giocatori[g].run.includes(r + 1)) return;
      const scelte = [
        ...giocatori[g].account.map((a, i) => ({ a, id: `a${i}`, account: i, jolly: null })),
        ...jolly.map((a, j) => ({ a, id: `j${j}`, account: null, jolly: j })),
      ];
      for (const s of scelte) {
        if (usati.has(s.id) || (s.jolly !== null && jollyUsati.has(s.jolly))) continue;
        usati.add(s.id);
        if (s.jolly !== null) jollyUsati.add(s.jolly);
        for (const p of s.a.personaggi) {
          run[r].push({ giocatore: g, jolly: s.jolly, ruolo: ruolo(p), forte: eForte(istanza, p.classe) });
          perRun(r + 1);
          run[r].pop();
        }
        usati.delete(s.id);
        if (s.jolly !== null) jollyUsati.delete(s.jolly);
      }
    })(0);
  })(0);
  return migliore;
}

describe("casi di Alberto", () => {
  it("tre Priest su tre account e un solo High Priest: il Priest entra dove gli High Priest ci sono gia'", () => {
    const giocatori = [
      giocatore("Alberto", account("High Priest"), account("Priest"), account("Priest")),
      giocatore("A", account("High Priest"), account("High Priest"), account("High Priest")),
      giocatore("B", account("High Priest"), account("High Priest")),
      giocatore("C", account("Sniper"), account("Sniper"), account("Sniper")),
      giocatore("D", account("Clown"), account("Clown"), account("Clown")),
      giocatore("E", account("Gypsy"), account("Gypsy"), account("Gypsy")),
      giocatore("F", account("Professor"), account("Professor"), account("Professor")),
    ];
    const esito = calcolaRun(giocatori, []);
    verifica(giocatori, [], ISTANZA, esito);
    assert.equal(esito.run.length, 3);
    assert.equal(esito.entrate, 20);
    assert.deepEqual(esito.run.map((r) => r.membri.length).sort(), [6, 7, 7]);
    const priest = esito.run.flatMap((r) => r.membri).filter((m) => m.giocatore === 0 && m.ruolo === "priest");
    assert.equal(priest.length, 2);
  });

  it("un jolly Clown/Bard completa la run anche se il giocatore ha un terzo account suo", () => {
    const giocatori = [
      giocatore("A", account("High Priest")),
      giocatore("B", account("High Priest")),
      giocatore("C", account("Sniper")),
      giocatore("D", account("Gypsy")),
      giocatore("E", account("Professor")),
      giocatore("F", account("Knight")),
    ];
    const jolly = [account("Clown")];
    const esito = calcolaRun(giocatori, jolly);
    verifica(giocatori, jolly, ISTANZA, esito);
    assert.equal(esito.run.length, 1);
    assert.equal(esito.jolly, 1);
    assert.equal(esito.run[0].membri.find((m) => m.ruolo === "bard").giocatore, 5);
  });

  it("un account con piu' personaggi gioca quello che serve", () => {
    const giocatori = [
      giocatore("Alberto", account("Professor", "Sniper", "Clown"), account("Priest"), account("Priest")),
      giocatore("A", account("High Priest")),
      giocatore("B", account("High Priest")),
      giocatore("C", account("Sniper")),
      giocatore("D", account("Gypsy")),
      giocatore("E", account("Clown")),
    ];
    const esito = calcolaRun(giocatori, []);
    verifica(giocatori, [], ISTANZA, esito);
    assert.equal(esito.run.length, 1);
    const alberto = esito.run[0].membri.find((m) => m.giocatore === 0);
    assert.equal(alberto.ruolo, "prof");
  });

  it("con la run piena entrano Sniper e terzo High Priest, restano fuori i Knight", () => {
    const base = [
      giocatore("A", account("High Priest")),
      giocatore("B", account("High Priest")),
      giocatore("C", account("Sniper")),
      giocatore("D", account("Clown")),
      giocatore("E", account("Gypsy")),
      giocatore("F", account("Professor")),
    ];
    const altri = [...Array(6)].map((_, i) => giocatore(`X${i}`, account("Knight")));
    const giocatori = [...base, ...altri, giocatore("HP", account("High Priest")), giocatore("SN", account("Sniper"))];
    const esito = calcolaRun(giocatori, []);
    verifica(giocatori, [], ISTANZA, esito);
    assert.equal(esito.run[0].membri.length, 12);
    assert.equal(esito.preferiti[0], 2);
    // Fuori, per la run piena: due dei Knight: prima gli Sniper, poi gli High Priest.
    const fuori = esito.fuori.map((f) => giocatori[f.giocatore].account[0].personaggi[0].classe).sort();
    assert.deepEqual(fuori, ["Knight", "Knight"]);
    assert.ok(esito.fuori.every((f) => f.motivo === "piena"));
  });

  it("la Gypsy/Dancer non e' obbligatoria ma entra per prima fra i liberi, prima di uno Sniper", () => {
    const minimo = ["High Priest", "High Priest", "Sniper", "Clown", "Professor"].map((c, i) =>
      giocatore(`M${i}`, account(c)),
    );
    assert.equal(calcolaRun(minimo, []).run.length, 1);
    const sniper = [...Array(7)].map((_, i) => giocatore(`S${i}`, account("Sniper")));
    const giocatori = [...minimo, ...sniper, giocatore("Gypsy", account("Gypsy"))];
    const esito = calcolaRun(giocatori, []);
    verifica(giocatori, [], ISTANZA, esito);
    assert.equal(esito.run[0].membri.length, 12);
    assert.ok(esito.run[0].membri.some((m) => m.ruolo === "dancer"));
    assert.deepEqual(esito.fuori.map((f) => giocatori[f.giocatore].account[0].personaggi[0].classe), ["Sniper"]);
  });

  it("senza Professor nessuna run, e lo dice", () => {
    const giocatori = ["High Priest", "High Priest", "Sniper", "Clown", "Gypsy", "Knight"].map((c, i) =>
      giocatore(`G${i}`, account(c)),
    );
    const esito = calcolaRun(giocatori, []);
    assert.equal(esito.run.length, 0);
    assert.deepEqual(esito.mancano, ["Per 1 run serve 1 Professor. Nessun account ha un Professor."]);
  });

  it("un giocatore con piu' account delle run ne conta al piu' uno per run, e lo dice", () => {
    const giocatori = [
      giocatore("Uno", account("High Priest"), account("High Priest"), account("High Priest"), account("High Priest")),
      giocatore("Due", account("High Priest")),
      ...["Sniper", "Clown", "Professor"].map((c, i) => giocatore(`G${i}`, account(c))),
    ];
    const esito = calcolaRun(giocatori, []);
    assert.equal(esito.run.length, 1);
    assert.equal(esito.mancano[0],
      "Per 2 run servono 4 High Priest. Gli account che lo hanno sono 5: Uno (1, 2, 3, 4) e Due (1). Un giocatore entra una volta per run, quindi ne contano 3.");
  });

  it("dice cosa manca anche quando i posti bastano uno per uno ma non insieme", () => {
    // L'elenco di Alberto del 23/10/2026: gli HP sono 6, ma due stanno su account che servono anche
    // come Professor o Clown/Bard, quindi la terza run non c'e'.
    const giocatori = [
      giocatore("Alberto", account("High Priest", "Professor", "Gypsy", "Clown"), account("High Priest"), account("Priest")),
      giocatore("Efreeet", account("High Priest", "Clown", "Sniper"), account("Priest"), account("Clown")),
      giocatore("Pastafarian", account("Sniper", "High Priest"), account("Sniper"), account("Sniper")),
      giocatore("Johnny", account("Sniper", "Professor"), account("Sniper"), account("Sniper")),
      giocatore("Negaz", account("High Priest")),
      giocatore("Mario", account("High Priest")),
    ];
    const jolly = [
      { nome: "Gypsy Gilda", ...account("Gypsy") },
      { nome: "Clown Gilda", ...account("Clown") },
      { nome: "Prof Gilda", ...account("Professor") },
    ];
    const esito = calcolaRun(giocatori, jolly);
    verifica(giocatori, jolly, ISTANZA, esito);
    assert.equal(esito.run.length, 2);
    assert.deepEqual(esito.mancano, [
      "Per 3 run servono 6 High Priest e 3 Professor, 9 personaggi su account diversi. Gli account che hanno almeno uno dei due sono 8: " +
        "Alberto (1, 2), Efreeet (1), Pastafarian (1), Johnny (1), Negaz (1), Mario (1) e Account Gilda Prof Gilda. Ogni account entra con un solo personaggio.",
      "Per 3 run servono 6 High Priest e 3 Clown o Bard, 9 personaggi su account diversi. Gli account che hanno almeno uno dei due sono 8: " +
        "Alberto (1, 2), Efreeet (1, 3), Pastafarian (1), Negaz (1), Mario (1) e Account Gilda Clown Gilda. Ogni account entra con un solo personaggio.",
    ]);
  });
});

describe("HP Tanker e Soul Linker (Alberto, 23/10/2026)", () => {
  const altri = ["Sniper", "Clown", "Professor"];

  it("due High Priest scarsi non bastano, e lo dice", () => {
    const giocatori = [scarso("A", account("High Priest")), scarso("B", account("High Priest")), ...altri.map((c) => giocatore(c, account(c)))];
    const esito = calcolaRun(giocatori, [account("High Priest")]);
    assert.equal(esito.run.length, 0);
    assert.deepEqual(esito.mancano, ["Per 1 run serve 1 High Priest (HP Tanker). Nessun account ha un High Priest (HP Tanker)."]);
    giocatori[0] = giocatore("A", account("High Priest"));
    const conTanker = calcolaRun(giocatori, []);
    verifica(giocatori, [], ISTANZA, conTanker);
    assert.equal(conTanker.run.length, 1);
    assert.deepEqual(conTanker.run[0].membri.filter((m) => m.ruolo === "hp").map((m) => [m.giocatore, m.forte ?? false]), [[0, true], [1, false]]);
  });

  it("l'HP Tanker e' del personaggio: un altro High Priest dello stesso giocatore non tanka (Alberto, 23/10/2026)", () => {
    const tre = (c) => [account(c), account(c), account(c)];
    const giocatori = [
      scarso("Alberto", account("HP Tanker"), account("High Priest")),
      scarso("H", ...tre("High Priest")),
      ...altri.map((c) => giocatore(c, ...tre(c))),
    ];
    const esito = calcolaRun(giocatori, []);
    verifica(giocatori, [], ISTANZA, esito);
    assert.equal(esito.run.length, 1);
    assert.deepEqual(esito.mancano, ["Per 2 run servono 2 High Priest (HP Tanker). Gli account che lo hanno sono 1: Alberto (1)."]);
    // Un account con un High Priest e un HP Tanker gioca l'HP Tanker.
    giocatori[0] = scarso("Alberto", account("HP Tanker"), account("High Priest", "HP Tanker"));
    assert.equal(calcolaRun(giocatori, []).run.length, 2);
  });

  it("un Account Gilda con un HP Tanker tanka, chiunque lo giochi", () => {
    const giocatori = [scarso("A", account("High Priest")), scarso("B", account("High Priest"), account("Knight")), ...altri.map((c) => giocatore(c, account(c)))];
    const jolly = [{ nome: "Tank Gilda", ...account("HP Tanker") }];
    const esito = calcolaRun(giocatori, jolly);
    verifica(giocatori, jolly, ISTANZA, esito);
    assert.equal(esito.run.length, 1);
    assert.deepEqual(esito.run[0].membri.filter((m) => m.tank).map((m) => m.jolly), [0]);
  });

  it("un tanker con tre account High Priest ne gioca uno per run, gli scarsi fanno il secondo", () => {
    const giocatori = [
      giocatore("Tanker", account("High Priest"), account("High Priest"), account("High Priest")),
      scarso("S1", account("High Priest"), account("High Priest")),
      scarso("S2", account("High Priest"), account("High Priest")),
      ...altri.map((c) => giocatore(c, account(c), account(c), account(c))),
    ];
    const esito = calcolaRun(giocatori, []);
    verifica(giocatori, [], ISTANZA, esito);
    assert.equal(esito.run.length, 3);
    for (const run of esito.run) assert.ok(run.membri.some((m) => m.giocatore === 0 && m.posto === "High Priest"));
    giocatori[0].account.pop();
    const due = calcolaRun(giocatori, []);
    assert.equal(due.run.length, 2);
    assert.deepEqual(due.mancano, [
      "Per 3 run servono 3 High Priest (HP Tanker). Gli account che lo hanno sono 2: Tanker (1, 2).",
    ]);
  });

  it("chi fa meno run non entra in piu' run, non e' fra chi resta fuori, e lo dice se manca", () => {
    const giocatori = ["High Priest", "High Priest", ...altri].map((c) => giocatore(c, account(c), account(c), account(c)));
    giocatori[2].run = [1, 2];
    const esito = calcolaRun(giocatori, []);
    verifica(giocatori, [], ISTANZA, esito);
    assert.equal(esito.run.length, 2);
    assert.deepEqual(esito.fuori, []);
    assert.deepEqual(esito.mancano, [
      "Per 3 run servono 15 entrate, i giocatori presenti ne fanno 14: qualcuno fa meno di 3 run.",
      "Per 3 run servono 3 Sniper. Gli account che lo hanno sono 3: Sniper (1, 2, 3). Un giocatore entra una volta per run, e qualcuno fa meno di 3 run, quindi ne contano 2.",
    ]);
  });

  it("a parita' di run ed entrate la run con l'HP Tanker; il Champion tanka solo se serve (Alberto, 24/10/2026)", () => {
    const giocatori = [
      giocatore("T", account("High Priest")),
      scarso("H", account("High Priest")),
      ...altri.map((c) => giocatore(c, account(c))),
      giocatore("C", account("Champion")),
    ];
    const esito = calcolaRun(giocatori, []);
    verifica(giocatori, [], ISTANZA, esito);
    // Il Champion entra lo stesso, in un posto libero: la run ha le stesse entrate.
    assert.equal(esito.run[0].tipo, 0);
    assert.equal(esito.run[0].membri.length, 6);
    assert.deepEqual(esito.run[0].membri.filter((m) => m.tank).map((m) => giocatori[m.giocatore].nome), ["T"]);
    // Senza HP Tanker tanka il Champion, con un High Priest e un secondo High Priest o Priest.
    const senzaTanker = [scarso("T", account("High Priest")), ...giocatori.slice(1)];
    const champion = calcolaRun(senzaTanker, []);
    verifica(senzaTanker, [], ISTANZA, champion);
    assert.equal(champion.run[0].tipo, 1);
    assert.deepEqual(champion.run[0].membri.slice(0, 3).map((m) => [m.posto, senzaTanker[m.giocatore].nome]), [
      ["Champion", "C"], ["High Priest", "T"], ["High Priest o Priest", "H"],
    ]);
    // Se il Champion e l'HP Tanker sono lo stesso account tanka l'HP Tanker, non l'altro High Priest.
    const soloTanker = calcolaRun([giocatore("T", account("High Priest", "Champion")), scarso("H", account("High Priest")), ...altri.map((c) => giocatore(c, account(c)))], []);
    assert.equal(soloTanker.run.length, 1);
    assert.equal(soloTanker.run[0].tipo, 0);
    assert.deepEqual(soloTanker.run[0].membri.filter((m) => m.tank).map((m) => m.giocatore), [0]);
  });

  it("un solo HP Tanker e due Champion: tre run, una con l'HP Tanker e due col Champion", () => {
    const tre = (c) => [account(c), account(c), account(c)];
    const giocatori = [
      giocatore("T", account("High Priest")),
      scarso("H", ...tre("High Priest")),
      scarso("P", ...tre("Priest")),
      giocatore("C", account("Champion"), account("Champion")),
      ...altri.map((c) => giocatore(c, ...tre(c))),
    ];
    const esito = calcolaRun(giocatori, []);
    verifica(giocatori, [], ISTANZA, esito);
    assert.equal(esito.run.length, 3);
    assert.deepEqual(esito.run.map((r) => r.tipo).sort(), [0, 1, 1]);
    assert.ok(esito.run.filter((r) => r.tipo === 0).every((r) => r.membri.some((m) => m.giocatore === 0 && m.forte)));
  });

  it("20 giocatori con tre account, pochi Champion e HP Tanker: run miste, e risponde in fretta", () => {
    let seme = 11;
    const caso = (n) => Math.floor((seme = (seme * 1103515245 + 12345) % 2147483648) / 2147483648 * n);
    const tutte = ["High Priest", "High Priest", "Sniper", "Clown", "Professor", "Gypsy", "Priest", "Soul Linker", "Knight"];
    // Un solo HP Tanker con un High Priest e due Champion: tre run solo mescolando i tipi.
    const giocatori = [
      giocatore("T", account("High Priest"), account("Knight"), account("Knight")),
      scarso("C1", account("Champion"), account("High Priest"), account("Priest")),
      scarso("C2", account("Champion"), account("High Priest"), account("Priest")),
      ...altri.map((c) => scarso(c, account(c), account(c), account(c))),
      ...[...Array(14)].map((_, g) => scarso(`G${g}`, ...[...Array(3)].map(() => account(...[...Array(1 + caso(2))].map(() => tutte[caso(tutte.length)]))))),
    ];
    const inizio = performance.now();
    const esito = calcolaRun(giocatori, [], ISTANZA);
    verifica(giocatori, [], ISTANZA, esito);
    assert.ok(performance.now() - inizio < 5000);
    assert.equal(esito.run.length, 3);
    assert.equal(new Set(esito.run.map((r) => r.tipo)).size, 2);
  });

  it("chi c'e' solo in alcune run entra solo in quelle: il Champion delle prime due, lo Sniper della terza", () => {
    const tre = (c) => [account(c), account(c), account(c)];
    const giocatori = [
      giocatore("T", ...tre("High Priest")),
      scarso("H", ...tre("High Priest")),
      ...altri.map((c) => giocatore(c, ...tre(c))),
      { ...scarso("Asimo", account("Champion"), account("Priest")), run: [1, 2] },
      { ...scarso("Tardi", account("Sniper")), run: [3] },
    ];
    const esito = calcolaRun(giocatori, []);
    verifica(giocatori, [], ISTANZA, esito);
    assert.equal(esito.run.length, 3);
    const dove = (nome) => esito.run.flatMap((r, i) => (r.membri.some((m) => giocatori[m.giocatore].nome === nome) ? [i + 1] : []));
    assert.deepEqual(dove("Asimo"), [1, 2]);
    assert.deepEqual(dove("Tardi"), [3]);
    // Una run col Champion, se c'e', e' una delle prime due, quelle di Asimo.
    assert.ok(esito.run.every((r, i) => r.tipo !== 1 || i < 2));
    assert.deepEqual(esito.fuori, []);
  });

  it("Sniper Incubus: run da 4 senza Professor, ma con il Professor la run e' completa (Alberto, 23/10/2026)", () => {
    const giocatori = [giocatore("T", account("High Priest")), scarso("H", account("High Priest")), scarso("S", account("Sniper Incubus")), scarso("C", account("Clown"))];
    const esito = calcolaRun(giocatori, []);
    verifica(giocatori, [], ISTANZA, esito);
    assert.deepEqual(esito.run.map((r) => [r.tipo, r.membri.length]), [[2, 4]]);
    assert.deepEqual(esito.run[0].membri.map((m) => m.posto), ["High Priest", "High Priest", "Sniper Incubus", "Clown o Bard"]);
    // Lo Sniper normale non basta, e "Per la run 1" lo spiega.
    const normale = [...giocatori.slice(0, 2), scarso("S", account("Sniper")), giocatori[3]];
    const senza = calcolaRun(normale, []);
    assert.equal(senza.run.length, 0);
    assert.ok(senza.mancano.includes("Con Sniper Incubus: Per 1 run serve 1 Sniper Incubus. Nessun account ha un Sniper Incubus."), senza.mancano.join(" | "));
    const conProf = [...giocatori, scarso("P", account("Professor"))];
    const completa = calcolaRun(conProf, []);
    verifica(conProf, [], ISTANZA, completa);
    assert.deepEqual(completa.run.map((r) => r.tipo), [0]);
  });

  it("Sniper Incubus in qualsiasi run: un solo Professor, due run, una completa e una senza", () => {
    const due = (c) => [account(c), account(c)];
    const giocatori = [
      giocatore("T", ...due("High Priest")),
      scarso("H", ...due("High Priest")),
      scarso("S", ...due("Sniper Incubus")),
      scarso("C", ...due("Clown")),
      scarso("P", account("Professor")),
    ];
    const esito = calcolaRun(giocatori, []);
    verifica(giocatori, [], ISTANZA, esito);
    assert.deepEqual(esito.run.map((r) => r.tipo).sort(), [0, 2]);
    assert.ok(esito.run.find((r) => r.tipo === 2).membri.some((m) => m.ruolo === "sniper" && m.forte && !m.tank));
  });

  it("il Soul Linker prende il posto della Gypsy/Dancer solo se manca", () => {
    const minimo = ["High Priest", "High Priest", "Sniper", "Clown", "Professor"].map((c, i) => giocatore(`M${i}`, account(c)));
    const sniper = [...Array(6)].map((_, i) => giocatore(`S${i}`, account("Sniper")));
    const soloLinker = [...minimo, ...sniper, giocatore("SL", account("Soul Linker")), giocatore("S6", account("Sniper"))];
    const esito = calcolaRun(soloLinker, []);
    verifica(soloLinker, [], ISTANZA, esito);
    assert.ok(esito.run[0].membri.some((m) => m.ruolo === "sl"));
    assert.deepEqual(esito.fuori.map((f) => soloLinker[f.giocatore].nome), ["S6"]);
    const conGypsy = [...soloLinker, giocatore("G", account("Gypsy"))];
    const conLaGypsy = calcolaRun(conGypsy, []);
    verifica(conGypsy, [], ISTANZA, conLaGypsy);
    assert.deepEqual(conLaGypsy.fuori.map((f) => conGypsy[f.giocatore].nome).sort(), ["S6", "SL"]);
  });
});

describe("Endless Cellar", () => {
  const EC = ISTANZE.find((i) => i.id === "ec");
  const MINIMO = ["Champion", "High Priest", "High Priest", "Sniper", "Sniper", "Gypsy", "Clown", "Professor", "Paladin", "Creator"];
  // Un giocatore per posto del party minimo, ognuno con `n` account della sua classe.
  const base = (n) => MINIMO.map((c, i) => giocatore(`M${i}`, ...[...Array(n)].map(() => account(c))));
  const classe = (giocatori, f) => giocatori[f.giocatore].account[0].personaggi[0].classe;

  it("tre run da 12: uno Sniper e un High Wizard in piu' per run, gli High Wizard divisi fra i due giocatori", () => {
    const giocatori = [
      ...base(3),
      giocatore("S", account("Sniper"), account("Sniper"), account("Sniper")),
      giocatore("W", account("High Wizard"), account("High Wizard"), account("High Wizard")),
      giocatore("W2", account("High Wizard")),
    ];
    const esito = calcolaRun(giocatori, [], EC);
    verifica(giocatori, [], EC, esito);
    assert.equal(esito.run.length, 3);
    assert.deepEqual(esito.run.map((r) => r.membri.length), [12, 12, 12]);
    assert.deepEqual(esito.preferiti, [9, 3]);
    // Entrate divise: W gioca due run e W2 una, invece di tre e nessuna.
    assert.deepEqual(esito.fuori.map((f) => [f.giocatore, f.entrate]), [[11, 2], [12, 1]]);
  });

  it("due Sniper in piu' battono Sniper e High Wizard", () => {
    const giocatori = [...base(1), giocatore("S1", account("Sniper")), giocatore("W", account("High Wizard")), giocatore("S2", account("Sniper"))];
    const esito = calcolaRun(giocatori, [], EC);
    verifica(giocatori, [], EC, esito);
    assert.equal(esito.run[0].membri.length, 12);
    assert.deepEqual(esito.preferiti, [4, 0]);
    assert.deepEqual(esito.fuori.map((f) => classe(giocatori, f)), ["High Wizard"]);
  });

  it("un Champion in piu' e un Knight non entrano, neanche con la run non piena", () => {
    const giocatori = [...base(1), giocatore("C", account("Champion")), giocatore("K", account("Knight"))];
    const esito = calcolaRun(giocatori, [], EC);
    verifica(giocatori, [], EC, esito);
    assert.equal(esito.run[0].membri.length, 10);
    assert.deepEqual(esito.fuori.map((f) => [classe(giocatori, f), f.motivo]), [["Champion", "posti"], ["Knight", "posti"]]);
  });

  it("un account con Champion e Sniper gioca lo Sniper se il Champion c'e' gia'", () => {
    const giocatori = [...base(1), giocatore("X", account("Champion", "Sniper"))];
    const esito = calcolaRun(giocatori, [], EC);
    verifica(giocatori, [], EC, esito);
    assert.equal(esito.run[0].membri.find((m) => m.giocatore === 10).ruolo, "sniper");
  });

  it("20 giocatori con tre account e piu' classi: risponde in fretta", () => {
    let seme = 7;
    const caso = (n) => Math.floor((seme = (seme * 1103515245 + 12345) % 2147483648) / 2147483648 * n);
    const tutte = [...MINIMO, "High Wizard", "Knight"];
    const giocatori = [...Array(20)].map((_, g) =>
      giocatore(`G${g}`, ...[...Array(3)].map(() => account(...[...Array(1 + caso(2))].map(() => tutte[caso(tutte.length)])))),
    );
    const jolly = [account("Clown"), account("Creator", "Paladin")];
    const inizio = performance.now();
    const esito = calcolaRun(giocatori, jolly, EC);
    verifica(giocatori, jolly, EC, esito);
    assert.ok(performance.now() - inizio < 5000);
  });
});

describe("confronto con la ricerca esaustiva", () => {
  let seme = 12345;
  const caso = () => (seme = (seme * 1103515245 + 12345) % 2147483648) / 2147483648;
  const intero = (n) => Math.floor(caso() * n);

  // Istanza piccola, perche' la ricerca esaustiva finisca: stessi meccanismi della vera.
  const piccola = {
    nome: "Prova",
    maxParty: 3,
    maxRun: 3,
    posti: [
      { ruolo: "hp", nome: "High Priest", quanti: 1 },
      { ruolo: "sniper", nome: "Sniper", quanti: 1 },
    ],
    classi: [
      { nome: "High Priest", ruolo: "hp" },
      { nome: "HP Tanker", ruolo: "hp", forte: true },
      { nome: "Sniper", ruolo: "sniper" },
      { nome: "Priest", ruolo: "priest" },
    ],
    preferiti: [{ ruolo: "sniper" }, { ruolo: "hp" }, { ruolo: "priest" }],
  };
  const classi = ["High Priest", "Sniper", "Priest", "Knight"];

  it("300 casi casuali: stesso punteggio e regole rispettate", () => {
    for (let n = 0; n < 300; n++) {
      // Composizione casuale: un posto tolto diventa desiderato, ma almeno uno resta obbligatorio.
      const tolto = intero(3);
      const posti = piccola.posti.map((p, i) => (i === tolto ? { ...p, quanti: 0, desiderati: 1 } : p));
      const istanza = { ...piccola, posti, maxParty: 2 + intero(3), maxRun: 1 + intero(3) };
      // Casi piccoli: la ricerca esaustiva cresce come (scelte per run) ^ (run x giocatori).
      const nGiocatori = istanza.maxRun === 3 ? 2 + intero(2) : 2 + intero(3);
      const giocatori = [...Array(nGiocatori)].map((_, g) =>
        giocatore(
          `G${g}`,
          ...[...Array(intero(3))].map(() => account(...[...Array(1 + intero(2))].map(() => classi[intero(4)]))),
        ),
      );
      const jolly = [...Array(intero(2))].map(() => account(classi[intero(4)]));
      const esito = calcolaRun(giocatori, jolly, istanza);
      const atteso = forzaBruta(giocatori, jolly, istanza);
      assert.deepEqual(verifica(giocatori, jolly, istanza, esito), atteso, JSON.stringify({ giocatori, jolly, istanza }));
    }
  });

  it("300 casi casuali con posti dei tanker, un'alternativa al posto desiderato e giocatori con meno run", () => {
    for (let n = 0; n < 300; n++) {
      const istanza = {
        ...piccola,
        maxParty: 2 + intero(3),
        maxRun: 1 + intero(3),
        posti: [
          { ruolo: "hp", nome: "High Priest", quanti: 1 + intero(2), forti: 1 },
          { ruolo: "sniper", nome: "Sniper", quanti: 0, desiderati: 1, alternativa: { ruolo: "priest", nome: "Priest" } },
        ],
      };
      const nGiocatori = istanza.maxRun === 3 ? 2 + intero(2) : 2 + intero(3);
      const giocatori = [...Array(nGiocatori)].map((_, g) => ({
        ...(intero(2) ? giocatore : scarso)(
          `G${g}`,
          ...[...Array(intero(3))].map(() => account(...[...Array(1 + intero(2))].map(() => classi[intero(4)]))),
        ),
        // Un giocatore su tre c'e' solo in alcune run.
        ...(intero(3) === 0 ? { run: [[1], [2], [3], [1, 2], [2, 3], [1, 3]][intero(6)] } : {}),
      }));
      // Anche un Account Gilda puo' essere un HP Tanker.
      const jolly = [...Array(intero(2))].map(() => account([...classi, "HP Tanker"][intero(5)]));
      const esito = calcolaRun(giocatori, jolly, istanza);
      const atteso = forzaBruta(giocatori, jolly, istanza);
      assert.deepEqual(verifica(giocatori, jolly, istanza, esito), atteso, JSON.stringify({ giocatori, jolly, istanza }));
    }
  });

  it("300 casi casuali con due tipi di run, come Champion e HP Tanker", () => {
    // Pensati per mescolare i tipi: meno run, piu' Champion e High Priest. Misurato il 23/10/2026: su
    // 3.000 casi (47 con run miste) sempre lo stesso punteggio della ricerca esaustiva.
    const istanzaTipi = {
      ...piccola,
      posti: [
        { ruolo: "sniper", nome: "Sniper", quanti: 0, desiderati: 1, alternativa: { ruolo: "sl", nome: "Soul Linker" } },
        { ruolo: "knight", nome: "Knight", quanti: 1 },
      ],
      tipi: [
        { nome: "Champion", posti: [{ ruolo: "champion", nome: "Champion", quanti: 1 }, { ruoli: ["hp", "priest"], nome: "HP o Priest", quanti: 1 }] },
        { nome: "Tanker", posti: [{ ruolo: "hp", nome: "High Priest", quanti: 1, forti: 1, tank: true }] },
      ],
      classi: [...piccola.classi, { nome: "Champion", ruolo: "champion" }, { nome: "Knight", ruolo: "knight" }, { nome: "Soul Linker", ruolo: "sl" }],
    };
    const classiTipi = ["High Priest", "Sniper", "Priest", "Champion", "Knight", "Soul Linker"];
    let misti = 0;
    for (let n = 0; n < 300; n++) {
      const istanza = { ...istanzaTipi, maxParty: 3 + intero(2), maxRun: 2 + intero(2) };
      const nGiocatori = istanza.maxRun === 3 ? 3 : 3 + intero(2);
      const giocatori = [...Array(nGiocatori)].map((_, g) =>
        (intero(3) ? scarso : giocatore)(`G${g}`, ...[...Array(1 + intero(2))].map(() => account(...[...Array(1 + intero(2))].map(() => classiTipi[intero(6)])))),
      );
      const esito = calcolaRun(giocatori, [], istanza);
      if (new Set(esito.run.map((r) => r.tipo)).size > 1) misti++;
      assert.deepEqual(verifica(giocatori, [], istanza, esito), forzaBruta(giocatori, [], istanza), JSON.stringify({ giocatori, istanza }));
    }
    assert.ok(misti > 0, "nessun caso con run miste");
  });

  // Con run miste il calcolo e' esatto per i personaggi scelti dal passo 1, non in assoluto: se non
  // si dividono, passa alla ripartizione successiva. Misurato il 23/10/2026 su 3.000 casi: 6 con un
  // tipo meno preferito, 5 con gli Sniper divisi peggio, 1 con una run in meno (party da 2, senza
  // posti liberi). Sull'istanza vera, 1.500 casi casuali da 4 a 13 giocatori: nessuna run persa.
  it("300 casi casuali con tre tipi di run, l'ultimo con un posto forte che non tanka, come lo Sniper Incubus", () => {
    const istanzaTre = {
      ...piccola,
      posti: [{ ruolo: "knight", nome: "Knight", quanti: 0, desiderati: 1 }],
      tipi: [
        { nome: "Champion", posti: [{ ruolo: "champion", nome: "Champion", quanti: 1, tank: true }, { ruolo: "sniper", nome: "Sniper", quanti: 1 }] },
        { nome: "Tanker", posti: [{ ruolo: "hp", nome: "HP", quanti: 1, forti: 1, tank: true }, { ruolo: "sniper", nome: "Sniper", quanti: 1 }, { ruolo: "priest", nome: "Priest", quanti: 1 }] },
        { nome: "Incubus", posti: [{ ruolo: "hp", nome: "HP", quanti: 1, forti: 1, tank: true }, { ruolo: "sniper", nome: "Sniper", quanti: 1, forti: 1 }] },
      ],
      classi: [...piccola.classi, { nome: "Sniper Incubus", ruolo: "sniper", forte: true }, { nome: "Champion", ruolo: "champion" }, { nome: "Knight", ruolo: "knight" }],
    };
    const classiTre = ["High Priest", "HP Tanker", "Sniper", "Sniper Incubus", "Priest", "Champion", "Knight"];
    const tipiVisti = new Set();
    let diversi = 0;
    for (let n = 0; n < 300; n++) {
      const istanza = { ...istanzaTre, maxParty: 2 + intero(3), maxRun: 1 + intero(3) };
      const nGiocatori = istanza.maxRun === 3 ? 2 + intero(2) : 2 + intero(3);
      const giocatori = [...Array(nGiocatori)].map((_, g) =>
        scarso(`G${g}`, ...[...Array(1 + intero(2))].map(() => account(...[...Array(1 + intero(2))].map(() => classiTre[intero(7)])))),
      );
      const jolly = [...Array(intero(2))].map(() => account(classiTre[intero(7)]));
      const esito = calcolaRun(giocatori, jolly, istanza);
      for (const r of esito.run) tipiVisti.add(r.tipo);
      const trovato = verifica(giocatori, jolly, istanza, esito);
      const atteso = forzaBruta(giocatori, jolly, istanza);
      assert.deepEqual(trovato.slice(0, 2), atteso.slice(0, 2), JSON.stringify({ giocatori, jolly, istanza }));
      if (trovato.some((x, i) => x !== atteso[i])) diversi++;
    }
    assert.deepEqual([...tipiVisti].sort(), [0, 1, 2]);
    assert.ok(diversi <= 3, `${diversi} casi diversi dalla ricerca esaustiva`);
  });

  it("300 casi casuali con i posti liberi riservati, come l'Endless Cellar", () => {
    const classiHW = [...classi, "High Wizard"];
    for (let n = 0; n < 300; n++) {
      const istanza = {
        ...piccola,
        maxParty: 2 + intero(3),
        maxRun: 1 + intero(3),
        posti: [...piccola.posti, { ruolo: "hw", nome: "High Wizard", quanti: 0, massimo: 1 }],
        liberi: [["sniper", "hw"], ["sniper"], ["hw"]][intero(3)],
        classi: [...piccola.classi, { nome: "High Wizard", ruolo: "hw" }],
        preferiti: [{ ruolo: "sniper" }, { ruolo: "hw" }],
      };
      const nGiocatori = istanza.maxRun === 3 ? 2 + intero(2) : 2 + intero(3);
      const giocatori = [...Array(nGiocatori)].map((_, g) =>
        giocatore(
          `G${g}`,
          ...[...Array(intero(3))].map(() => account(...[...Array(1 + intero(2))].map(() => classiHW[intero(5)]))),
        ),
      );
      const jolly = [...Array(intero(2))].map(() => account(classiHW[intero(5)]));
      const esito = calcolaRun(giocatori, jolly, istanza);
      const atteso = forzaBruta(giocatori, jolly, istanza);
      assert.deepEqual(verifica(giocatori, jolly, istanza, esito), atteso, JSON.stringify({ giocatori, jolly, istanza }));
    }
  });
});
