/**
 * Test dell'elenco della gilda incollato, `node --test tests/*.mjs` da `party/`.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { leggiElenco, riconosci, scriviElenco } from "../testo.js";

const pg = (...classi) => ({ personaggi: classi.map((classe) => ({ classe })) });

describe("elenco della gilda", () => {
  it("il messaggio di Efreeet copiato da Discord, con l'ora e il primo account sulla riga del nome", () => {
    const letto = leggiElenco("[19:40]Efreeet: 1) HP/Devo/Clown/Sniper\n2) Prete\n3) Bragi\n");
    assert.deepEqual(letto.errori, []);
    assert.deepEqual(letto.dubbi, []);
    assert.deepEqual(letto.giocatori, [
      { nome: "Efreeet", account: [pg("High Priest", "Paladin", "Clown/Bard", "Sniper"), pg("Priest"), pg("Clown/Bard")] },
    ]);
  });

  it("piu' giocatori, separatori diversi, trattini, jolly e commenti", () => {
    const letto = leggiElenco(
      "# gilda\nMario\n1. Bio, Champ\n- HW + gypsy\n\nAnna:\n1 - Prof e Wiz\nJolly Gilda1: Clown/Sniper\nJolly: HP\n",
    );
    assert.deepEqual(letto.errori, []);
    assert.deepEqual(letto.giocatori, [
      { nome: "Mario", account: [pg("Creator", "Champion"), pg("High Wizard", "Gypsy/Dancer")] },
      { nome: "Anna", account: [pg("Professor", "High Wizard")] },
    ]);
    assert.deepEqual(letto.jolly, [
      { nome: "Gilda1", personaggi: pg("Clown/Bard", "Sniper").personaggi },
      { nome: "Jolly 2", personaggi: pg("High Priest").personaggi },
    ]);
  });

  it("errori di battitura corretti, parole sconosciute chieste una volta sola", () => {
    const testo = "Mario\n1) Processor/Snipper\n2) Stalker\nLuca\n1) stalker/Hight Priest/SP Song\n";
    const letto = leggiElenco(testo);
    assert.deepEqual(
      letto.corretti.map((c) => [c.parola, c.classe, c.chi]),
      [["Processor", "Professor", "Mario"], ["Snipper", "Sniper", "Mario"], ["Hight Priest", "High Priest", "Luca"]],
    );
    assert.deepEqual(letto.dubbi, [{ parola: "Stalker", chiave: "stalker", chi: "Mario", riga: 3 }]);
    // Imparato il soprannome, l'elenco si legge tutto.
    const imparato = leggiElenco(testo, { stalker: "Altro" });
    assert.deepEqual(imparato.dubbi, []);
    assert.deepEqual(imparato.giocatori[1].account, [pg("Altro", "High Priest", "Gypsy/Dancer")]);
  });

  it("le sigle corte non si correggono: HW non diventa HP", () => {
    assert.equal(riconosci("HQ"), null);
    assert.equal(riconosci("Wizard"), null);
    assert.equal(riconosci("Monk"), null);
    assert.deepEqual(riconosci("hw"), { classe: "High Wizard", corretta: false });
  });

  it("account senza giocatore, classi al posto del nome, giocatore senza account", () => {
    const letto = leggiElenco("1) HP\nHP/Sniper\nVuoto\nPieno\n1) Sniper\n");
    assert.deepEqual(letto.errori, [
      "riga 1: un account prima del nome del giocatore",
      'riga 2: "HP/Sniper" sembra un account, non un giocatore: scrivi un numero davanti, come 1) HP/Sniper',
      "Vuoto non ha account",
    ]);
  });

  it("l'elenco esportato si rilegge uguale", () => {
    const stato = {
      giocatori: [
        { nome: "Efreeet", account: [pg("High Priest", "Paladin", "Clown/Bard", "Sniper"), pg("Priest"), pg("Clown/Bard")] },
        { nome: "", account: [pg("Lord Knight"), pg("")] },
        { nome: "Senza", account: [pg("")] },
      ],
      jolly: [{ nome: "Gilda 1", personaggi: pg("Gypsy/Dancer", "Altro").personaggi }],
    };
    const testo = scriviElenco(stato);
    assert.match(testo, /Efreeet\n1\) High Priest\/Paladin\/Clown\/Sniper\n2\) Priest\n3\) Clown/);
    const letto = leggiElenco(testo);
    assert.deepEqual(letto.errori, []);
    assert.deepEqual(letto.giocatori, [stato.giocatori[0], { nome: "Giocatore 2", account: [pg("Altro")] }]);
    assert.deepEqual(letto.jolly, [{ nome: "Gilda 1", personaggi: pg("Gypsy/Dancer", "Altro").personaggi }]);
  });
});
