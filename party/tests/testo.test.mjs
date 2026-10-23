/**
 * Test dell'elenco della gilda e delle caselle degli account, `node --test tests/*.mjs` da `party/`.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { leggiClassi, leggiElenco, pulisci, riconosci, scriviElenco } from "../testo.js";

describe("caselle degli account", () => {
  it("soprannomi, canzoni, sigle ed errori di battitura", () => {
    assert.deepEqual(leggiClassi("HP/Devo/Clown/Sniper"), { classi: ["High Priest", "Paladin", "Clown/Bard", "Sniper"], ignote: [] });
    assert.deepEqual(leggiClassi("Bragi, SP Song + bio e Wiz").classi, ["Clown/Bard", "Gypsy/Dancer", "Creator", "High Wizard"]);
    assert.deepEqual(leggiClassi("Processor/Snipper/Hight Priest").classi, ["Professor", "Sniper", "High Priest"]);
    assert.deepEqual(leggiClassi("Stalker/HP"), { classi: ["High Priest"], ignote: ["Stalker"] });
    assert.deepEqual(leggiClassi("Stalker/HP", { stalker: "Altro" }).classi, ["Altro", "High Priest"]);
  });

  it("riscritte in forma breve, le sconosciute e quelle imparate come Altro restano come sono", () => {
    assert.equal(pulisci("high priest / devo, Processor/bragi/bard"), "HP/Paladin/Prof/Clown");
    assert.equal(pulisci("Stalker/hw"), "Stalker/HW");
    assert.equal(pulisci("Stalker/hw", { stalker: "Altro" }), "Stalker/HW");
    assert.equal(pulisci(""), "");
  });

  it("classi separate solo da spazi, Snip e SL: l'elenco di Pasta (Alberto, 23/10/2026)", () => {
    assert.equal(pulisci("Snip Prof Bragi"), "Sniper/Prof/Clown");
    assert.equal(pulisci("HP,SNIP,Prof"), "HP/Sniper/Prof");
    assert.equal(pulisci("SL"), "SL");
    assert.deepEqual(leggiClassi("SL").classi, ["Soul Linker"]);
    // Le classi di piu' parole restano intere, le parole sconosciute vicine anche.
    assert.equal(pulisci("High Priest SP Song"), "HP/Gypsy");
    assert.deepEqual(leggiClassi("HP Lord Knight Hight Priest Snip"), { classi: ["High Priest", "Sniper"], ignote: ["Lord Knight"] });
  });

  it("le sigle corte non si correggono: HQ non diventa HP", () => {
    assert.equal(riconosci("HQ"), null);
    assert.equal(riconosci("Wizard"), null);
    assert.equal(riconosci("Monk"), null);
    assert.deepEqual(riconosci("hw"), { classe: "High Wizard", corretta: false });
  });
});

describe("elenco della gilda", () => {
  it("il messaggio di Efreeet copiato da Discord, con l'ora e il primo account sulla riga del nome", () => {
    const letto = leggiElenco("[19:40]Efreeet: 1) HP/Devo/Clown/Sniper\n2) Prete\n3) Bragi\n");
    assert.deepEqual(letto, { giocatori: [{ nome: "Efreeet", capace: false, account: ["HP/Paladin/Clown/Sniper", "Priest", "Clown"] }], jolly: [], errori: [] });
  });

  it("piu' giocatori, separatori diversi, trattini, Account Gilda (anche come Jolly), commenti e parole sconosciute", () => {
    const letto = leggiElenco("# gilda\nMario\n1. Bio, Champ\n- HW + gypsy\n\nAnna:\n1 - Prof e Stalker\nAccount Gilda Gilda1: Clown/Sniper\nJolly: HP\n");
    assert.deepEqual(letto.errori, []);
    assert.deepEqual(letto.giocatori, [
      { nome: "Mario", capace: false, account: ["Creator/Champ", "HW/Gypsy"] },
      { nome: "Anna", capace: false, account: ["Prof/Stalker"] },
    ]);
    assert.deepEqual(letto.jolly, [
      { nome: "Gilda1", classi: "Clown/Sniper" },
      { nome: "Account Gilda 2", classi: "HP" },
    ]);
  });

  it("le parole inglesi valgono come le italiane: Guild Account, and, Other", () => {
    const letto = leggiElenco("Mary\n1) HP and Sniper\n2) Other\nGuild Account Guild1: Clown\nguild account: HP\n");
    assert.deepEqual(letto.errori, []);
    assert.deepEqual(letto.giocatori, [{ nome: "Mary", capace: false, account: ["HP/Sniper", "Other"] }]);
    assert.deepEqual(letto.jolly, [
      { nome: "Guild1", classi: "Clown" },
      { nome: "Account Gilda 2", classi: "HP" },
    ]);
    assert.deepEqual(leggiClassi("Other/Prof").classi, ["Altro", "Professor"]);
  });

  it("account senza giocatore, classi al posto del nome, giocatore senza account", () => {
    const letto = leggiElenco("1) HP\nHP/Sniper\nVuoto\nPieno\n1) Sniper\n");
    assert.deepEqual(letto.errori, [
      "riga 1: un account prima del nome del giocatore",
      'riga 2: "HP/Sniper" sembra un account, non un giocatore: scrivi un numero davanti, come 1) HP/Sniper',
      "Vuoto non ha account",
    ]);
  });

  it("(HP capace) dopo il nome mette la spunta, anche nel messaggio copiato e in inglese", () => {
    const letto = leggiElenco("[19:40]Alby (HP capace): 1) HP\nMary (skilled HP)\n1) HP\nPasta\n1) HP\n");
    assert.deepEqual(letto.giocatori.map((g) => [g.nome, g.capace]), [["Alby", true], ["Mary", true], ["Pasta", false]]);
  });

  it("l'elenco esportato si rilegge uguale", () => {
    const stato = {
      giocatori: [
        { nome: "Efreeet", capace: true, account: ["HP/Paladin/Clown/Sniper", "", "Clown"] },
        { nome: "", capace: false, account: ["Stalker"] },
        { nome: "Senza", capace: false, account: [""] },
      ],
      jolly: [{ nome: "Gilda 1", classi: "Gypsy/Altro" }, { nome: "Vuoto", classi: "" }],
    };
    const testo = scriviElenco(stato);
    assert.match(testo, /Efreeet \(HP capace\)\n1\) HP\/Paladin\/Clown\/Sniper\n2\) Clown/);
    assert.match(testo, /Account Gilda Gilda 1: Gypsy\/Altro/);
    assert.deepEqual(leggiElenco(testo), {
      giocatori: [
        { nome: "Efreeet", capace: true, account: ["HP/Paladin/Clown/Sniper", "Clown"] },
        { nome: "Giocatore 2", capace: false, account: ["Stalker"] },
      ],
      jolly: [{ nome: "Gilda 1", classi: "Gypsy/Altro" }],
      errori: [],
    });
  });
});
