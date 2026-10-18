/**
 * Test del calcolo dei livelli. Si eseguono senza installare nulla, dalla
 * cartella `livelli/`: `node --test tests/*.mjs`.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { aggiungiExp, aggiungiJob, calcolaPiano, moltiplicatore, seguiJob } from "../calcolo.js";
import { EXP_NORMALE, EXP_RINATO, JOB_PRIMA, JOB_SECONDA, JOB_SECONDA_RINATO, MEDUSA, QUEST } from "../dati.js";

const quest = (id) => QUEST.find((q) => q.id === id);

describe("moltiplicatore", () => {
  it("somma weekend e manuale", () => {
    assert.equal(moltiplicatore(false, 0), 1);
    assert.equal(moltiplicatore(true, 0), 1.5);
    assert.equal(moltiplicatore(false, 50), 1.5);
    assert.equal(moltiplicatore(true, 100), 2.5);
  });

  it("50 Huge Leaf nel weekend danno 77220 EXP, come visto in gioco", () => {
    assert.equal(Math.floor(quest("hugeleaf").base * moltiplicatore(true, 0)), 77220);
  });
});

describe("aggiungiExp", () => {
  it("tabelle con l'EXP di ratemyserver", () => {
    assert.equal(EXP_NORMALE[47], 75973); // dal 48 al 49
    assert.equal(EXP_NORMALE.length, 98);
    assert.equal(EXP_RINATO.length, 98);
  });

  it("dal 48 allo 0% con 77220 EXP si arriva al 49 con il resto", () => {
    assert.deepEqual(aggiungiExp(EXP_NORMALE, 48, 0, 77220), { livello: 49, exp: 1247, persa: 0 });
  });

  it("sotto la soglia il livello non cambia", () => {
    assert.deepEqual(aggiungiExp(EXP_NORMALE, 48, 100, 1000), { livello: 48, exp: 1100, persa: 0 });
  });

  it("un guadagno enorme fa salire un solo livello e il resto va perso", () => {
    const dopo = aggiungiExp(EXP_NORMALE, 80, 0, 12376800);
    assert.equal(dopo.livello, 81);
    assert.equal(dopo.exp, EXP_NORMALE[79] - 1);
    assert.equal(dopo.persa, 12376800 - EXP_NORMALE[79] - (EXP_NORMALE[79] - 1));
  });

  it("Medusa in tre consegne separate: dall'80 allo 0% all'83, con il manuale 100%", () => {
    const guadagno = MEDUSA.base * 2;
    let stato = { livello: 80, exp: 0 };
    for (let i = 0; i < 3; i++) stato = aggiungiExp(EXP_NORMALE, stato.livello, stato.exp, guadagno);
    assert.equal(stato.livello, 83);
    assert.equal(stato.persa, 0);
  });
});

/**
 * Ricerca esaustiva: prova ogni sequenza di mosse fino all'obiettivo. Lenta,
 * serve solo a controllare `calcolaPiano` su casi piccoli.
 */
function esaustiva({ rinato, livello, obiettivo, manuale = 0, rabbocco = null, cambio = 0, oggetti }) {
  const tabella = rinato ? EXP_RINATO : EXP_NORMALE;
  const molt = moltiplicatore(false, manuale);
  let migliore = Infinity;
  const visita = (l, exp, costo, ultima, rimasti) => {
    if (costo >= migliore) return;
    if (l >= obiettivo) {
      migliore = costo;
      return;
    }
    for (const q of QUEST) {
      const scelta = oggetti[q.id];
      if (!scelta || l < q.min || l > q.max) continue;
      const inInventario = rimasti[q.id] ?? 0;
      const daComprare = Math.max(0, q.quantita - inInventario);
      if (daComprare > 0 && scelta.prezzo == null) continue;
      const dopo = aggiungiExp(tabella, l, exp, Math.floor(q.base * molt));
      const extra = daComprare * (scelta.prezzo ?? 0) + (ultima === q.id ? 0 : cambio);
      visita(dopo.livello, dopo.exp, costo + extra, q.id, {
        ...rimasti,
        [q.id]: Math.max(0, inInventario - q.quantita),
      });
    }
    if (rabbocco !== null && tabella[l - 1] - exp <= (tabella[l - 1] * rabbocco) / 100) {
      visita(l + 1, 0, costo, ultima, rimasti);
    }
  };
  const posseduti = Object.fromEntries(Object.entries(oggetti).map(([id, o]) => [id, o.posseduti ?? 0]));
  visita(livello, 0, 0, null, posseduti);
  return migliore;
}

const costoDi = (piano, cambio) => piano.zeny + cambio * piano.tappe.filter((t) => t.tipo !== "rabbocco").length;

describe("calcolaPiano", () => {
  const casi = [
    {
      nome: "non rinato dal 60 al 64, tre quest",
      rinato: false, livello: 60, obiettivo: 64,
      oggetti: { sharpleaf: { prezzo: 800 }, bacillus: { prezzo: 700 }, anolian: { prezzo: 1500 } },
    },
    {
      nome: "con il cambio di NPC che costa",
      rinato: false, livello: 60, obiettivo: 64, cambio: 30000,
      oggetti: { sharpleaf: { prezzo: 800 }, bacillus: { prezzo: 700 }, anolian: { prezzo: 1500 } },
    },
    {
      nome: "con oggetti in inventario",
      rinato: false, livello: 60, obiettivo: 63, manuale: 50,
      oggetti: { sharpleaf: { prezzo: 900 }, bacillus: { prezzo: 700, posseduti: 70 }, anolian: { posseduti: 45 } },
    },
    {
      nome: "rinato con il trucco dei mostri",
      rinato: true, livello: 45, obiettivo: 48, manuale: 100, rabbocco: 10,
      oggetti: { anolian: { prezzo: 1000 }, hugeleaf: { prezzo: 500 }, frill: { prezzo: 300 } },
    },
  ];

  for (const caso of casi) {
    it(`costo uguale alla ricerca esaustiva: ${caso.nome}`, () => {
      const piano = calcolaPiano(caso);
      assert.ok(piano);
      assert.equal(costoDi(piano, caso.cambio ?? 0), esaustiva(caso));
    });
  }

  it("con abbastanza oggetti in inventario non si spende niente", () => {
    const piano = calcolaPiano({
      rinato: false, livello: 70, obiettivo: 72, manuale: 100,
      oggetti: { antelope: { prezzo: 672, posseduti: 1000 } },
    });
    assert.equal(piano.zeny, 0);
    assert.equal(piano.tappe[0].comprati, 0);
  });

  it("ogni consegna avviene dentro la fascia di livello della quest", () => {
    const piano = calcolaPiano({
      rinato: true, livello: 10, obiettivo: 84, manuale: 100, cambio: 30000,
      oggetti: Object.fromEntries(QUEST.map((q) => [q.id, { prezzo: 500 }])),
    });
    for (const tappa of piano.tappe) {
      for (const passo of tappa.passi) {
        if (passo.tipo !== "quest") continue;
        assert.ok(passo.da.livello >= tappa.quest.min && passo.da.livello <= tappa.quest.max);
      }
    }
    assert.ok(piano.arrivo.livello >= 84);
  });

  it("le uccisioni completano un livello solo entro la soglia", () => {
    const piano = calcolaPiano({
      rinato: false, livello: 60, obiettivo: 75, manuale: 100, rabbocco: 10, cambio: 30000,
      oggetti: { sharpleaf: { prezzo: 800 }, antelope: { prezzo: 672 } },
    });
    const uccisioni = piano.tappe.flatMap((t) => t.passi).filter((p) => p.tipo === "rabbocco");
    assert.ok(uccisioni.length > 0);
    for (const p of uccisioni) assert.ok(p.mancante <= EXP_NORMALE[p.da.livello - 1] * 0.1);
  });

  it("la Medusa si usa al massimo tre volte, fra il 75 e il 97", () => {
    const piano = calcolaPiano({
      rinato: true, livello: 74, obiettivo: 84, manuale: 100, medusa: true,
      oggetti: { antelope: { prezzo: 672 } },
    });
    const medusa = piano.tappe.filter((t) => t.tipo === "medusa");
    assert.equal(medusa.reduce((n, t) => n + t.consegne, 0), 3);
    for (const t of medusa) assert.ok(t.da.livello >= 75 && t.a.livello <= 97);
  });

  it("senza quest utilizzabili non c'e' piano", () => {
    assert.equal(calcolaPiano({ rinato: true, livello: 2, obiettivo: 84, oggetti: {} }), null);
  });

  it("gia' all'obiettivo il piano e' vuoto", () => {
    const piano = calcolaPiano({ rinato: false, livello: 84, obiettivo: 84, oggetti: {} });
    assert.equal(piano.tappe.length, 0);
    assert.equal(piano.zeny, 0);
  });
});

describe("job", () => {
  it("tabelle con il job massimo giusto", () => {
    assert.equal(JOB_PRIMA.length + 1, 50);
    assert.equal(JOB_SECONDA.length + 1, 50);
    assert.equal(JOB_SECONDA_RINATO.length + 1, 70);
  });

  it("aggiungiJob: un livello a consegna, e al job massimo tutto va perso", () => {
    const dopo = aggiungiJob(JOB_PRIMA, 48, 0, 2000000);
    assert.equal(dopo.livello, 49);
    assert.equal(dopo.exp, JOB_PRIMA[47] - 1);
    const alMassimo = aggiungiJob(JOB_PRIMA, 50, 0, 1000);
    assert.deepEqual(alMassimo, { livello: 50, exp: 0, persa: 1000 });
  });

  const piano = () =>
    calcolaPiano({
      rinato: false, livello: 60, obiettivo: 72, manuale: 100, cambio: 30000,
      oggetti: { sharpleaf: { prezzo: 800 }, antelope: { prezzo: 672 } },
    });

  it("al job del cambio la tappa si spezza e compare il cambio di classe", () => {
    const p = piano();
    const { tappe, finale } = seguiJob(p, { rinato: false, job: 45, cambio: 50, manuale: 100 });
    const indice = tappe.findIndex((t) => t.tipo === "classe");
    assert.ok(indice > 0);
    assert.equal(tappe[indice].job.livello, 50);
    assert.deepEqual(tappe[indice + 1].jobDa, { classe: 2, livello: 1, exp: 0 });
    assert.equal(finale.classe, 2);
    // Spezzare le tappe non cambia consegne e zeny.
    const consegne = tappe.reduce((n, t) => n + (t.consegne ?? 0), 0);
    const zeny = tappe.reduce((n, t) => n + (t.zeny ?? 0), 0);
    assert.equal(consegne, p.consegne);
    assert.equal(zeny, p.zeny);
  });

  it("gia' al job del cambio si cambia classe prima di cominciare", () => {
    const { tappe } = seguiJob(piano(), { rinato: false, job: 50, cambio: 50, manuale: 100 });
    assert.equal(tappe[0].tipo, "classe");
  });

  it("in seconda classe non si cambia piu' e al massimo la job EXP si perde", () => {
    const { tappe, persa } = seguiJob(piano(), { rinato: false, seconda: true, job: 50, manuale: 100 });
    assert.ok(tappe.every((t) => t.tipo !== "classe"));
    assert.ok(persa > 0);
  });
});
