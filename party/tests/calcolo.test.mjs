/**
 * Test del calcolo delle run. Si eseguono senza installare nulla, dalla
 * cartella `party/`: `node --test tests/*.mjs`.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { calcolaRun } from "../calcolo.js";
import { ISTANZE, ruoloDi } from "../dati.js";

const ISTANZA = ISTANZE[0];

const account = (...classi) => ({ personaggi: classi.map((classe) => ({ nome: "", classe })) });
const giocatore = (nome, ...accounts) => ({ nome, account: accounts });

/** Il personaggio di un membro del risultato. */
function personaggio(giocatori, jolly, m) {
  const a = m.jolly === null ? giocatori[m.giocatore].account[m.account] : jolly[m.jolly];
  return a.personaggi[m.personaggio];
}

/** Controlla le regole e rende il punteggio da confrontare con la ricerca esaustiva. */
function verifica(giocatori, jolly, istanza, esito) {
  const accountUsati = new Set();
  for (const run of esito.run) {
    assert.ok(run.membri.length <= istanza.maxParty, "run oltre il limite di persone");
    const giocatoriRun = new Set();
    for (const m of run.membri) {
      assert.ok(!giocatoriRun.has(m.giocatore), "un giocatore due volte nella stessa run");
      giocatoriRun.add(m.giocatore);
      const id = m.jolly === null ? `${m.giocatore}/${m.account}` : `j${m.jolly}`;
      assert.ok(!accountUsati.has(id), "un account in due run");
      accountUsati.add(id);
      assert.equal(ruoloDi(istanza, personaggio(giocatori, jolly, m).classe), m.ruolo);
    }
    for (const p of istanza.posti) {
      assert.ok(run.membri.filter((m) => m.ruolo === p.ruolo).length >= p.quanti, `run senza ${p.nome}`);
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
  for (const membri of run) {
    for (const p of istanza.posti) {
      const ci = membri.filter((m) => m.ruolo === p.ruolo).length;
      desiderati += Math.min(Math.max(0, ci - p.quanti), p.desiderati ?? 0);
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
  return [run.length, totale, desiderati, ...preferiti, -quadrati, -jolly, -persone2, -preferiti2].map((x) => x + 0);
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
    for (const m of piene) {
      if (m.length > istanza.maxParty) return;
      if (!istanza.posti.every((p) => m.filter((x) => x.ruolo === p.ruolo).length >= p.quanti)) return;
    }
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
      const scelte = [
        ...giocatori[g].account.map((a, i) => ({ a, id: `a${i}`, account: i, jolly: null })),
        ...jolly.map((a, j) => ({ a, id: `j${j}`, account: null, jolly: j })),
      ];
      for (const s of scelte) {
        if (usati.has(s.id) || (s.jolly !== null && jollyUsati.has(s.jolly))) continue;
        usati.add(s.id);
        if (s.jolly !== null) jollyUsati.add(s.jolly);
        for (const p of s.a.personaggi) {
          run[r].push({ giocatore: g, jolly: s.jolly, ruolo: ruolo(p) });
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
      giocatore("D", account("Clown/Bard"), account("Clown/Bard"), account("Clown/Bard")),
      giocatore("E", account("Gypsy/Dancer"), account("Gypsy/Dancer"), account("Gypsy/Dancer")),
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
      giocatore("D", account("Gypsy/Dancer")),
      giocatore("E", account("Professor")),
      giocatore("F", account("Knight")),
    ];
    const jolly = [account("Clown/Bard")];
    const esito = calcolaRun(giocatori, jolly);
    verifica(giocatori, jolly, ISTANZA, esito);
    assert.equal(esito.run.length, 1);
    assert.equal(esito.jolly, 1);
    assert.equal(esito.run[0].membri.find((m) => m.ruolo === "bard").giocatore, 5);
  });

  it("un account con piu' personaggi gioca quello che serve", () => {
    const giocatori = [
      giocatore("Alberto", account("Professor", "Sniper", "Clown/Bard"), account("Priest"), account("Priest")),
      giocatore("A", account("High Priest")),
      giocatore("B", account("High Priest")),
      giocatore("C", account("Sniper")),
      giocatore("D", account("Gypsy/Dancer")),
      giocatore("E", account("Clown/Bard")),
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
      giocatore("D", account("Clown/Bard")),
      giocatore("E", account("Gypsy/Dancer")),
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
    const minimo = ["High Priest", "High Priest", "Sniper", "Clown/Bard", "Professor"].map((c, i) =>
      giocatore(`M${i}`, account(c)),
    );
    assert.equal(calcolaRun(minimo, []).run.length, 1);
    const sniper = [...Array(7)].map((_, i) => giocatore(`S${i}`, account("Sniper")));
    const giocatori = [...minimo, ...sniper, giocatore("Gypsy", account("Gypsy/Dancer"))];
    const esito = calcolaRun(giocatori, []);
    verifica(giocatori, [], ISTANZA, esito);
    assert.equal(esito.run[0].membri.length, 12);
    assert.ok(esito.run[0].membri.some((m) => m.ruolo === "dancer"));
    assert.deepEqual(esito.fuori.map((f) => giocatori[f.giocatore].account[0].personaggi[0].classe), ["Sniper"]);
  });

  it("senza Professor nessuna run, e lo dice", () => {
    const giocatori = ["High Priest", "High Priest", "Sniper", "Clown/Bard", "Gypsy/Dancer", "Knight"].map((c, i) =>
      giocatore(`G${i}`, account(c)),
    );
    const esito = calcolaRun(giocatori, []);
    assert.equal(esito.run.length, 0);
    assert.deepEqual(esito.mancano, ["Professor: per 1 run ne servono 1, ce ne sono 0"]);
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
});
