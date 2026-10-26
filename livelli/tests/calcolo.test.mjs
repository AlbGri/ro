/**
 * Test del calcolo dei livelli. Si eseguono senza installare nulla, dalla
 * cartella `livelli/`: `node --test tests/*.mjs`.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { aggiungiExp, aggiungiJob, calcolaPiano, moltiplicatore, seguiJob } from "../calcolo.js";
import { EXP_NORMALE, EXP_RINATO, JOB_PRIMA, JOB_SECONDA, JOB_SECONDA_RINATO, CACCE, QUEST } from "../dati.js";

const quest = (id) => QUEST.find((q) => q.id === id);
const caccia = (id) => CACCE.find((c) => c.id === id);

describe("moltiplicatore", () => {
  it("il weekend moltiplica il manuale", () => {
    assert.equal(moltiplicatore(false, 0), 1);
    assert.equal(moltiplicatore(true, 0), 1.5);
    assert.equal(moltiplicatore(false, 50), 1.5);
    assert.equal(moltiplicatore(true, 50), 2.25);
    assert.equal(moltiplicatore(true, 100), 3);
  });

  it("weekend e manuale 50%, dal 53 al 36%: 380 Anolian, 150 Sharp Leaf e 1.650 Antelope fino all'84, come in gioco", () => {
    const molt = moltiplicatore(true, 50);
    let stato = { livello: 53, exp: Math.floor(EXP_NORMALE[52] * 0.36) };
    const consegna = (id) => (stato = aggiungiExp(EXP_NORMALE, stato.livello, stato.exp, Math.floor(quest(id).base * molt)));
    for (let i = 0; i < 19; i++) consegna("anolian");
    for (let i = 0; i < 3; i++) consegna("sharpleaf");
    let antelope = 0;
    while (stato.livello < 84) {
      consegna("antelope");
      antelope += quest("antelope").quantita;
    }
    assert.equal(antelope, 1650);
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
    const guadagno = caccia("medusa").base * 2;
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
    const entroSoglia = rabbocco !== null && tabella[l - 1] - exp <= (tabella[l - 1] * rabbocco) / 100;
    const spreca = (q) => aggiungiExp(tabella, l, exp, Math.floor(q.base * molt)).persa > 0;
    // Prima le quest che danno piu' EXP: un buon piano trovato presto taglia il resto.
    for (const q of [...QUEST].reverse()) {
      // Consegna al livello l, o al livello l + 1 dopo i mostri se a l perderebbe EXP.
      const livelli = [];
      if (l >= q.min && l <= q.max) livelli.push(l);
      if (entroSoglia && l + 1 < obiettivo && l + 1 >= q.min && l + 1 <= q.max && spreca(q)) livelli.push(l + 1);
      for (const da of livelli) {
        const inInventario = rimasti[q.id] ?? 0;
        const daComprare = Math.max(0, q.quantita - inInventario);
        const dopo = aggiungiExp(tabella, da, da === l ? exp : 0, Math.floor(q.base * molt));
        const extra = daComprare * (oggetti[q.id]?.prezzo ?? q.prezzo) + (ultima === q.id ? 0 : cambio);
        visita(dopo.livello, dopo.exp, costo + extra, q.id, {
          ...rimasti,
          [q.id]: Math.max(0, inInventario - q.quantita),
        });
      }
    }
    if (entroSoglia && l + 1 >= obiettivo && QUEST.some((q) => l >= q.min && l <= q.max && spreca(q))) {
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
      nome: "non rinato dal 70 al 73, tre quest",
      rinato: false, livello: 70, obiettivo: 73, manuale: 100,
      oggetti: { sharpleaf: { prezzo: 800 }, anolian: { prezzo: 300 } },
    },
    {
      nome: "con il cambio di quest che costa",
      rinato: false, livello: 70, obiettivo: 73, manuale: 100, cambio: 30000,
      oggetti: { sharpleaf: { prezzo: 800 }, anolian: { prezzo: 300 } },
    },
    {
      nome: "con oggetti in inventario",
      rinato: false, livello: 70, obiettivo: 72, manuale: 50,
      oggetti: { sharpleaf: { posseduti: 70 }, anolian: { posseduti: 45 } },
    },
    {
      nome: "rinato con il trucco dei mostri",
      rinato: true, livello: 62, obiettivo: 64, manuale: 100, rabbocco: 10,
      oggetti: { hugeleaf: { prezzo: 100 }, anolian: { prezzo: 500 } },
    },
    {
      nome: "mostri prima delle consegne che perderebbero EXP",
      rinato: false, livello: 61, obiettivo: 64, manuale: 100, rabbocco: 10, oggetti: {},
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
    const passi = piano.tappe.flatMap((t) => t.passi.map((p) => ({ ...p, quest: t.quest })));
    const uccisioni = passi.filter((p) => p.tipo === "rabbocco");
    assert.ok(uccisioni.length > 0);
    for (const p of uccisioni) {
      assert.ok(p.mancante <= EXP_NORMALE[p.da.livello - 1] * 0.1);
      // La consegna che segue, fatta prima dei mostri, avrebbe perso EXP.
      const dopo = passi[passi.indexOf(p) + 1];
      if (!dopo) continue;
      const guadagno = Math.floor(dopo.quest.base * moltiplicatore(false, 100));
      assert.ok(aggiungiExp(EXP_NORMALE, p.da.livello, p.da.exp, guadagno).persa > 0);
    }
  });

  it("con una quest che da' poco i mostri non servono: nessuna consegna perderebbe EXP", () => {
    const caro = { prezzo: 1e6 };
    const piano = calcolaPiano({
      rinato: false, livello: 31, obiettivo: 45, rabbocco: 10,
      oggetti: { bill: caro, hugeleaf: caro, anolian: caro, sharpleaf: caro, antelope: caro },
    });
    assert.deepEqual(piano.tappe.map((t) => t.chiave), ["acorn"]);
    assert.equal(piano.tappe[0].passi.filter((p) => p.tipo === "rabbocco").length, 0);
  });

  it("le cacce pronte si consegnano tutte, ognuna in una tappa sola", () => {
    const pronte = { goat: 2, titan: 1, medusa: 3 };
    const piano = calcolaPiano({ rinato: true, livello: 70, obiettivo: 84, manuale: 100, cacce: pronte });
    for (const [id, consegne] of Object.entries(pronte)) {
      const tappe = piano.tappe.filter((t) => t.tipo === "caccia" && t.caccia.id === id);
      assert.equal(tappe.length, 1, id);
      assert.equal(tappe[0].consegne, consegne, id);
    }
    const senza = calcolaPiano({ rinato: true, livello: 70, obiettivo: 84, manuale: 100 });
    assert.ok(piano.zeny < senza.zeny);
  });

  it("una caccia completata si consegna anche sotto il livello minimo della quest", () => {
    const piano = calcolaPiano({ rinato: true, livello: 50, obiettivo: 70, manuale: 100, cacce: { titan: 3 } });
    const titan = piano.tappe.filter((t) => t.tipo === "caccia");
    assert.ok(titan.length > 0);
    assert.ok(titan.every((t) => t.da.livello < caccia("titan").min));
  });

  it("sotto il livello minimo delle quest non c'e' piano", () => {
    assert.equal(calcolaPiano({ rinato: true, livello: 2, obiettivo: 84, oggetti: {} }), null);
  });

  it("senza niente nel modulo dice quanti oggetti comprare, e quelli posseduti li risparmia", () => {
    const senza = calcolaPiano({ rinato: false, livello: 40, obiettivo: 84, manuale: 100, cambio: 30000 });
    assert.ok(senza.spesa.length > 0);
    assert.equal(senza.spesa.reduce((n, v) => n + v.zeny, 0), senza.zeny);
    for (const voce of senza.spesa) assert.equal(voce.comprati, voce.servono);

    const conAntelope = calcolaPiano({
      rinato: false, livello: 40, obiettivo: 84, manuale: 100, cambio: 30000,
      oggetti: { antelope: { posseduti: 500 } },
    });
    const antelope = conAntelope.spesa.find((v) => v.quest.id === "antelope");
    assert.equal(antelope.dallInventario, 500);
    assert.equal(antelope.comprati, antelope.servono - 500);
    assert.ok(conAntelope.zeny < senza.zeny);
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

  it("il cambio di classe non lascia tappe senza consegne", () => {
    const opzioni = { rinato: true, livello: 40, obiettivo: 84, manuale: 100, cambio: 30000, rabbocco: 10 };
    const p = calcolaPiano({ ...opzioni, cacce: { goat: 3, titan: 3, medusa: 3 } });
    const { tappe } = seguiJob(p, { ...opzioni, job: 1, cambio: 50 });
    assert.ok(tappe.some((t) => t.tipo === "classe"));
    for (const t of tappe) if (t.tipo === "quest" || t.tipo === "caccia") assert.ok(t.consegne > 0);
  });

  it("il manuale senza manualeJob non cambia la job EXP, con manualeJob e il weekend si'", () => {
    const fine = (opzioni) => {
      const { finale, persa } = seguiJob(piano(), { rinato: false, job: 1, cambio: 50, ...opzioni });
      return { finale, persa };
    };
    assert.deepEqual(fine({ manuale: 50 }), fine({}));
    assert.notDeepEqual(fine({ weekend: true }), fine({}));
    assert.notDeepEqual(fine({ manuale: 50, manualeJob: true }), fine({}));
  });

  it("in seconda classe non si cambia piu' e al massimo la job EXP si perde", () => {
    const { tappe, persa } = seguiJob(piano(), { rinato: false, seconda: true, job: 50, manuale: 100 });
    assert.ok(tappe.every((t) => t.tipo !== "classe"));
    assert.ok(persa > 0);
  });
});
