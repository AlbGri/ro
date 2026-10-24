/**
 * Test dei personaggi da creare. Si eseguono dalla cartella `party/`: `node --test tests/*.mjs`.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { calcolaRun, suggerisci } from "../calcolo.js";
import { ISTANZE } from "../dati.js";

const [HTF, EC] = ISTANZE;
const account = (...classi) => ({ personaggi: classi.map((classe) => ({ classe })) });
const giocatore = (nome, ...accounts) => ({ nome, account: accounts.map((a, i) => ({ ...a, numero: i + 1 })) });

/** I giocatori con i personaggi proposti fino al passo `k` compreso, con le classi vere. */
function applica(giocatori, esito, k, classe = (nome) => nome.split(" o ")[0]) {
  const con = giocatori.map((g) => ({ ...g, account: g.account.map((a) => ({ ...a, personaggi: [...a.personaggi] })) }));
  for (const passo of esito.passi.slice(0, k + 1)) {
    for (const n of passo.nuovi) {
      const g = con[n.giocatore];
      let a = g.account.find((x) => x.numero === n.numero);
      if (!a) g.account.push((a = { numero: n.numero, personaggi: [] }));
      a.personaggi.push({ classe: classe(n.classe) });
    }
  }
  return con;
}

/** Ogni passo, applicato, fa davvero le sue run e le sue entrate; le run crescono di uno. */
function controllaPassi(giocatori, jolly, istanza, esito) {
  let run = esito.run;
  esito.passi.forEach((passo, k) => {
    const dopo = calcolaRun(applica(giocatori, esito, k), jolly, istanza);
    if (passo.run !== null) {
      assert.equal(passo.run, ++run);
      assert.equal(dopo.run.length, passo.run);
    } else {
      assert.equal(k, esito.passi.length - 1, "il passo delle entrate e' l'ultimo");
      assert.equal(dopo.run.length, run);
    }
    assert.equal(dopo.entrate, passo.entrate);
    assert.ok(passo.nuovi.length > 0);
  });
}

describe("elenco della gilda (Alberto, 24/10/2026)", () => {
  const gilda = [
    giocatore("Alberto", account("HP Tanker", "Professor", "Gypsy", "Clown"), account("Priest")),
    giocatore("Efreeet", account("High Priest", "Paladin", "Clown", "Sniper"), account("Priest"), account("Clown")),
    giocatore("Johnny", account("Sniper", "Professor"), account("Gypsy"), account("Clown")),
    giocatore("Negaz", account("High Priest")),
    giocatore("Pasta", account("HP Tanker", "Sniper Incubus", "Professor"), account("Sniper Incubus", "Professor", "Clown"), account("Sniper Incubus"), account("Paladin"), account("High Priest", "Soul Linker")),
    giocatore("Aucaman", account("HP Tanker", "Sniper", "Clown"), account("HP Tanker"), account("HP Tanker", "Priest")),
    giocatore("Gebber", account("High Priest", "Sniper")),
    giocatore("Oreto", account("Sniper", "Clown"), account("Sniper", "High Priest"), account("Sniper")),
    giocatore("Asimo", account("Champion"), account("Sniper")),
    giocatore("Mario", account("High Priest"), account("Priest")),
  ];
  const jolly = [account("Gypsy"), account("Clown"), account("Professor")];
  const presenti = gilda.filter((g) => !["Oreto", "Asimo", "Mario"].includes(g.nome));

  it("Endless Cellar con tutti: 7 personaggi per le 3 run, il minimo trovato a mano", () => {
    const esito = suggerisci(gilda, jolly, EC);
    controllaPassi(gilda, jolly, EC, esito);
    assert.equal(esito.run, 0);
    assert.deepEqual(esito.passi.map((p) => [p.run, p.nuovi.length]), [[1, 1], [2, 2], [3, 4]]);
    assert.equal(esito.bloccate, null);
  });

  it("Endless Cellar senza gli assenti: nessun personaggio basta, servono giocatori", () => {
    assert.deepEqual(suggerisci(presenti, jolly, EC), { run: 0, entrate: 0, passi: [], bloccate: { run: 1, escluse: [] } });
  });

  it("Endless Cellar senza Champion: si ferma a una run e dice che serve il Champion escluso", () => {
    const esito = suggerisci(gilda, jolly, EC, ["Champion"]);
    controllaPassi(gilda, jolly, EC, esito);
    assert.deepEqual(esito.passi.map((p) => p.run), [1]);
    assert.deepEqual(esito.bloccate, { run: 2, escluse: ["Champion"] });
  });

  it("Horror Toy Factory senza gli assenti: un account nuovo a Negaz e uno a Gebber, delle classi ammesse", () => {
    const escluse = ["HP Tanker", "Sniper Incubus", "Champion"];
    const esito = suggerisci(presenti, jolly, HTF, escluse);
    controllaPassi(presenti, jolly, HTF, esito);
    assert.equal(esito.passi.length, 1);
    const [passo] = esito.passi;
    assert.equal(passo.run, null);
    assert.equal(passo.entrate, 21);
    assert.deepEqual(passo.nuovi.map((n) => [presenti[n.giocatore].nome, n.numero, n.nuovo]), [["Negaz", 2, true], ["Gebber", 2, true]]);
    assert.ok(passo.nuovi.every((n) => !escluse.some((c) => n.classe.includes(c))));
  });

  it("i nomi dicono le classi ammesse dello stesso posto: Gypsy o Dancer", () => {
    const esito = suggerisci(presenti, jolly, HTF, ["HP Tanker", "Sniper Incubus", "Champion", "Sniper"]);
    assert.ok(esito.passi[0].nuovi.some((n) => n.classe === "Gypsy o Dancer"));
  });
});

describe("confronto con la ricerca esaustiva", () => {
  let seme = 4242;
  const caso = () => (seme = (seme * 1103515245 + 12345) % 2147483648) / 2147483648;
  const intero = (n) => Math.floor(caso() * n);
  const classi = ["High Priest", "HP Tanker", "Sniper", "Priest"];
  const piccola = {
    nome: "Prova",
    maxParty: 3,
    maxRun: 3,
    posti: [
      { ruolo: "hp", nome: "High Priest", quanti: 1, forti: 1 },
      { ruolo: "sniper", nome: "Sniper", quanti: 1 },
    ],
    classi: [
      { nome: "High Priest", ruolo: "hp" },
      { nome: "HP Tanker", ruolo: "hp", forte: true },
      { nome: "Sniper", ruolo: "sniper" },
      { nome: "Priest", ruolo: "priest" },
    ],
    preferiti: [{ ruolo: "sniper" }, { ruolo: "hp" }],
  };

  /** Le run con `k` personaggi nuovi al massimo, provando ogni scelta: su account vecchi o nuovi. */
  function runMigliori(giocatori, istanza, k) {
    const scelte = giocatori.flatMap((g, gi) => [...Array(g.account.length + 2).keys()].flatMap((a) => classi.map((c) => [gi, a, c])));
    let migliori = calcolaRun(giocatori, [], istanza).run.length;
    (function prova(da, presi) {
      if (presi.length > 0) {
        const con = giocatori.map((g, gi) => {
          const account = [...g.account.map((a) => ({ ...a, personaggi: [...a.personaggi] })), account0(), account0()];
          for (const [x, a, c] of presi) if (x === gi) account[a].personaggi.push({ classe: c });
          return { ...g, account: account.filter((a) => a.personaggi.length > 0) };
        });
        migliori = Math.max(migliori, calcolaRun(con, [], istanza).run.length);
      }
      if (presi.length === k) return;
      for (let i = da; i < scelte.length; i++) prova(i, [...presi, scelte[i]]);
    })(0, []);
    return migliori;
  }
  const account0 = () => ({ personaggi: [] });

  it("60 casi casuali: il minimo di personaggi per il massimo delle run, e passi validi", () => {
    for (let n = 0; n < 60; n++) {
      const istanza = { ...piccola, maxParty: 2 + intero(2), maxRun: 1 + intero(3) };
      const giocatori = [...Array(2 + intero(2))].map((_, g) =>
        giocatore(`G${g}`, ...[...Array(intero(3))].map(() => account(...[...Array(1 + intero(2))].map(() => classi[intero(4)])))),
      );
      const esito = suggerisci(giocatori, [], istanza);
      controllaPassi(giocatori, [], istanza, esito);
      const passiRun = esito.passi.filter((p) => p.run !== null);
      const massimo = passiRun.at(-1)?.run ?? esito.run;
      const usati = passiRun.reduce((s, p) => s + p.nuovi.length, 0);
      const dati = JSON.stringify({ giocatori, istanza });
      // Con un personaggio in meno il massimo non si raggiunge; con due in piu' non si va oltre.
      if (usati > 0 && usati <= 3) assert.ok(runMigliori(giocatori, istanza, usati - 1) < massimo, `non minimo: ${dati}`);
      if (usati <= 1) assert.equal(runMigliori(giocatori, istanza, usati + 2), massimo, `run perse: ${dati}`);
      assert.equal(esito.bloccate?.run ?? null, massimo < istanza.maxRun ? massimo + 1 : null);
    }
  });
});
