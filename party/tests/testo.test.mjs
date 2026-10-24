/**
 * Test dell'elenco della gilda e delle caselle degli account, `node --test tests/*.mjs` da `party/`.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { conTanker, leggiClassi, leggiElenco, pulisci, riconosci, scriviElenco } from "../testo.js";

describe("caselle degli account", () => {
  it("soprannomi, canzoni, sigle ed errori di battitura", () => {
    assert.deepEqual(leggiClassi("HP/Devo/Clown/Sniper"), { classi: ["High Priest", "Paladin", "Clown", "Sniper"], ignote: [] });
    assert.deepEqual(leggiClassi("Bragi, SP Song + bio e Wiz").classi, ["Clown", "Gypsy", "Creator", "High Wizard"]);
    assert.deepEqual(leggiClassi("Processor/Snipper/Hight Priest").classi, ["Professor", "Sniper", "High Priest"]);
    assert.deepEqual(leggiClassi("Stalker/HP"), { classi: ["High Priest"], ignote: ["Stalker"] });
    assert.deepEqual(leggiClassi("Stalker/HP", { stalker: "Altro" }).classi, ["Altro", "High Priest"]);
  });

  it("riscritte in forma breve, le sconosciute e quelle imparate come Altro restano come sono", () => {
    assert.equal(pulisci("high priest / devo, Processor/bragi/bard"), "HP/Paladin/Prof/Clown/Bard");
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

  it("Bard e Dancer restano come sono scritti, non diventano Clown e Gypsy (Alberto, 23/10/2026)", () => {
    assert.deepEqual(leggiClassi("Bard/Dancer/Clown/Gypsy").classi, ["Bard", "Dancer", "Clown", "Gypsy"]);
    assert.equal(pulisci("bard, dancer"), "Bard/Dancer");
  });

  it("HP Tanker e' una classe, scritta anche Tanker HP; conTanker la mette agli High Priest", () => {
    assert.deepEqual(leggiClassi("HP Tanker/Clown").classi, ["HP Tanker", "Clown"]);
    assert.deepEqual(leggiClassi("tanker hp, HP").classi, ["HP Tanker", "High Priest"]);
    assert.equal(pulisci("Snip HP Tanker Bragi"), "Sniper/HP Tanker/Clown");
    assert.equal(conTanker("HP/Clown/Stalker"), "HP Tanker/Clown/Stalker");
  });

  it("Sniper Incubus, anche scritto Incubus o Snip Incubus", () => {
    assert.deepEqual(leggiClassi("Sniper Incubus/HP").classi, ["Sniper Incubus", "High Priest"]);
    assert.equal(pulisci("incubus, Snip Incubus Prof"), "Sniper Incubus/Prof");
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
    assert.deepEqual(letto, { giocatori: [{ nome: "Efreeet", presente: true, run: null, account: ["HP/Paladin/Clown/Sniper", "Priest", "Clown"] }], jolly: [], errori: [] });
  });

  it("piu' giocatori, separatori diversi, trattini, Account Gilda (anche come Jolly), commenti e parole sconosciute", () => {
    const letto = leggiElenco("# gilda\nMario\n1. Bio, Champ\n- HW + gypsy\n\nAnna:\n1 - Prof e Stalker\nAccount Gilda Gilda1: Clown/Sniper\nJolly: HP\n");
    assert.deepEqual(letto.errori, []);
    assert.deepEqual(letto.giocatori, [
      { nome: "Mario", presente: true, run: null, account: ["Creator/Champ", "HW/Gypsy"] },
      { nome: "Anna", presente: true, run: null, account: ["Prof/Stalker"] },
    ]);
    assert.deepEqual(letto.jolly, [
      { nome: "Gilda1", disponibile: true, classi: "Clown/Sniper" },
      { nome: "Account Gilda 2", disponibile: true, classi: "HP" },
    ]);
  });

  it("le parole inglesi valgono come le italiane: Guild Account, and, Other", () => {
    const letto = leggiElenco("Mary\n1) HP and Sniper\n2) Other\nGuild Account Guild1: Clown\nguild account: HP\n");
    assert.deepEqual(letto.errori, []);
    assert.deepEqual(letto.giocatori, [{ nome: "Mary", presente: true, run: null, account: ["HP/Sniper", "Other"] }]);
    assert.deepEqual(letto.jolly, [
      { nome: "Guild1", disponibile: true, classi: "Clown" },
      { nome: "Account Gilda 2", disponibile: true, classi: "HP" },
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

  it("fra parentesi dopo il nome le run in cui c'e', anche in inglese; la vecchia spunta HP Tanker va negli High Priest", () => {
    const letto = leggiElenco(
      "[19:40]Alby (HP Tanker, run 2-3): 1) HP/Clown\n2) Sniper\nMary (tanker HP)\n1) HP\nJo (run 1+3)\n1) HP\nLia (run 1, 2)\n1) HP\nEd (runs 2)\n1) HP\n" +
        "Asimo (2 run)\n1) HP\nMario (Rossi)\n1) HP\nPasta\n1) HP\n",
    );
    assert.deepEqual(letto.giocatori.map((g) => [g.nome, g.run, g.account]), [
      ["Alby", [2, 3], ["HP Tanker/Clown", "Sniper"]], ["Mary", null, ["HP Tanker"]], ["Jo", [1, 3], ["HP"]], ["Lia", [1, 2], ["HP"]],
      // Fino alla 1.14 "2 run" era quante: sono le prime due.
      ["Ed", [2], ["HP"]], ["Asimo", [1, 2], ["HP"]], ["Mario (Rossi)", null, ["HP"]], ["Pasta", null, ["HP"]],
    ]);
  });

  it("assente fra parentesi, anche in inglese e insieme alle run", () => {
    const letto = leggiElenco("Jo (assente)\n1) HP\nMary (Absent, run 2)\n1) HP\nLia (run 1)\n1) HP\n");
    assert.deepEqual(letto.giocatori.map((g) => [g.nome, g.presente, g.run]), [["Jo", false, null], ["Mary", false, [2]], ["Lia", true, [1]]]);
  });

  it("l'elenco esportato si rilegge uguale", () => {
    const stato = {
      giocatori: [
        { nome: "Efreeet", presente: true, run: [1, 2], account: ["HP Tanker/Paladin/Clown/Sniper", "", "Bard"] },
        { nome: "", presente: true, run: [1, 2, 3], account: ["Stalker"] },
        { nome: "Senza", presente: true, run: [1, 2, 3], account: [""] },
        { nome: "Tardi", presente: false, run: [1, 3], account: ["HP"] },
      ],
      jolly: [{ nome: "Gilda 1", classi: "Gypsy/Altro" }, { nome: "Vuoto", classi: "" }, { nome: "Usato", disponibile: false, classi: "HP" }],
    };
    const testo = scriviElenco(stato);
    assert.match(testo, /Efreeet \(run 1-2\)\n1\) HP Tanker\/Paladin\/Clown\/Sniper\n2\) Bard/);
    assert.match(testo, /Tardi \(assente, run 1\+3\)/);
    assert.match(testo, /Account Gilda Gilda 1: Gypsy\/Altro/);
    assert.match(testo, /Account Gilda Usato \(non disponibile\): HP/);
    assert.deepEqual(leggiElenco(testo), {
      giocatori: [
        { nome: "Efreeet", presente: true, run: [1, 2], account: ["HP Tanker/Paladin/Clown/Sniper", "Bard"] },
        { nome: "Giocatore 2", presente: true, run: null, account: ["Stalker"] },
        { nome: "Tardi", presente: false, run: [1, 3], account: ["HP"] },
      ],
      jolly: [{ nome: "Gilda 1", disponibile: true, classi: "Gypsy/Altro" }, { nome: "Usato", disponibile: false, classi: "HP" }],
      errori: [],
    });
    // Il campo dell'elenco si apre senza intestazione, vuoto se non c'e' nessuno.
    assert.equal(scriviElenco(stato, false), testo.slice(testo.indexOf("\n\n") + 2));
    assert.equal(scriviElenco({ giocatori: [], jolly: [] }, false), "");
  });

  it("un nome due volte e' un errore, maiuscole a parte", () => {
    const letto = leggiElenco("Jo\n1) HP\nMary\n1) Prof\njo\n1) Sniper\nAccount Gilda G1: HP\nGuild Account g1 (unavailable): Clown\n");
    assert.deepEqual(letto.errori, ["jo compare due volte", "g1 compare due volte"]);
    assert.deepEqual(letto.jolly.map((j) => [j.nome, j.disponibile]), [["G1", true], ["g1", false]]);
  });
});
