/**
 * Test della logica della versione web, gemelli di `tests/test_core.py`.
 *
 * Si eseguono senza installare nulla: `node --test tests_web/`.
 */

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  COLOR_PALETTE,
  DATA_VERSION,
  HOUR,
  MAX_ARCHIVE,
  MINUTE,
  NO_TIME,
  Preset,
  Settings,
  Timer,
  TimerState,
  TimerStore,
  categoryColor,
  formatClock,
  formatClockSeconds,
  formatDuration,
  formatLeft,
  formatMinutes,
  getTimeZone,
  localAt,
  msFromParts,
  nowLocal,
  parseBeeps,
  parseHHMM,
  parseMinutes,
  setTimeZone,
  sortEntries,
  toLocalISO,
  zoneOffsetMinutes,
} from "../core.js";

/** Crea un timer partito un dato numero di minuti fa. */
function makeTimer({ name = "Atroce", minutesAgo = 0, dmin = 190, dmax = 370 } = {}) {
  return new Timer({
    name,
    mappa: "ve_fild01",
    categoria: "MvP",
    start: nowLocal() - minutesAgo * MINUTE,
    dmin,
    dmax,
  });
}

// ----------------------------------------------------------------- durate ---

describe("durate", () => {
  it("interpreta i formati validi", () => {
    const casi = [
      ["190", 190],
      ["90.5", 90.5],
      ["90,5", 90.5],
      ["1h30", 90],
      ["3:10", 190],
      ["2h", 120],
      ["  60  ", 60],
    ];
    for (const [testo, atteso] of casi) {
      assert.equal(parseMinutes(testo), atteso, testo);
    }
  });

  it("rifiuta i formati non validi", () => {
    for (const testo of ["", "   ", "abc", "0", "-30", "h", "10:99x", "1h2m", "Infinity"]) {
      assert.equal(parseMinutes(testo), null, testo);
    }
  });

  it("formatta le durate", () => {
    assert.equal(formatDuration(3725), "1:02:05");
    assert.equal(formatDuration(65), "01:05");
    assert.equal(formatDuration(0), "00:00");
  });

  it("formatta i minuti senza decimali inutili", () => {
    assert.equal(formatMinutes(190.0), "190");
    assert.equal(formatMinutes(90.5), "90.5");
  });
});

// ------------------------------------------------------------- rendering ---

describe("rendering", () => {
  it("formatta l'orario del giorno", () => {
    assert.equal(formatClock(new Date(2026, 8, 1, 9, 5).getTime()), "09:05");
  });

  it("conta verso la soglia, poi all'indietro, poi si ferma", () => {
    const now = nowLocal();
    const atteso = makeTimer({ dmin: 60, dmax: 90 });
    assert.match(formatLeft(atteso, now), /^59:5\d$|^1:00:00$/);

    const chiuso = makeTimer({ minutesAgo: 100, dmin: 10, dmax: 20 });
    assert.match(formatLeft(chiuso, now), /^-1:19:5\d$|^-1:20:00$/);

    // Oltre le 24 ore dalla chiusura il contatore non dice piu' nulla di utile.
    const antico = makeTimer({ minutesAgo: 3000, dmin: 10, dmax: 20 });
    assert.equal(formatLeft(antico, now), NO_TIME);
  });

  it("assegna un colore stabile a ogni categoria", () => {
    assert.equal(categoryColor("MvP"), COLOR_PALETTE[0]);
    assert.equal(categoryColor("Quest"), COLOR_PALETTE[1]);
    // Il colore dipende dal nome, non dall'ordine di apparizione.
    assert.equal(categoryColor("Boss"), categoryColor("boss"));
    assert.ok(COLOR_PALETTE.includes(categoryColor("Boss")));
    // Le prime posizioni restano alle categorie predefinite.
    assert.notEqual(categoryColor("Boss"), COLOR_PALETTE[0]);
  });
});

// -------------------------------------------------------------- orari HH:MM -

describe("orari HH:MM", () => {
  it("interpreta gli orari validi", () => {
    assert.deepEqual(parseHHMM("23:50"), { hour: 23, minute: 50, second: 0 });
    assert.deepEqual(parseHHMM("09.05"), { hour: 9, minute: 5, second: 0 });
    assert.deepEqual(parseHHMM("23:50:30"), { hour: 23, minute: 50, second: 30 });
    assert.deepEqual(parseHHMM("9.05.07"), { hour: 9, minute: 5, second: 7 });
  });

  it("rifiuta gli orari non validi", () => {
    for (const testo of ["24:00", "12:60", "1250", "", "abc", "12:30:60", "12:30:5", "12:30:"]) {
      assert.equal(parseHHMM(testo), null, testo);
    }
  });

  it("tiene nel passato un orario recente", () => {
    const now = nowLocal();
    const dueOreFa = new Date(now - 2 * HOUR);
    assert.ok(localAt(dueOreFa.getHours(), dueOreFa.getMinutes()) < now);
  });

  it("legge come ieri un orario serale registrato dopo mezzanotte", () => {
    // Senza questa regola un'uccisione delle 23:50 registrata alle 00:05
    // partirebbe fra quasi 24 ore invece che 15 minuti fa.
    const now = nowLocal();
    const lontano = new Date(now + 13 * HOUR);
    assert.ok(localAt(lontano.getHours(), lontano.getMinutes()) < now);
  });

  it("permette la programmazione a breve", () => {
    const now = nowLocal();
    const fraUnOra = new Date(now + HOUR);
    assert.ok(localAt(fraUnOra.getHours(), fraUnOra.getMinutes()) > now);
  });
});

// ---------------------------------------------------------- fuso orario ----

describe("fuso orario", () => {
  afterEach(() => setTimeZone(null));

  it("accetta solo fusi riconosciuti", () => {
    assert.equal(setTimeZone("Europe/Rome"), true);
    assert.equal(getTimeZone(), "Europe/Rome");
    assert.equal(setTimeZone("Marte/Olympus"), false);
    // Un fuso non valido non sostituisce quello buono.
    assert.equal(getTimeZone(), "Europe/Rome");
    assert.equal(setTimeZone(null), true);
    assert.equal(getTimeZone(), null);
  });

  it("mostra l'orario nel fuso scelto, non in quello del browser", () => {
    const estate = Date.UTC(2026, 6, 15, 10, 0);
    setTimeZone("UTC");
    assert.equal(formatClock(estate), "10:00");
    setTimeZone("Europe/Rome");
    assert.equal(formatClock(estate), "12:00");
    setTimeZone("Asia/Tokyo");
    assert.equal(formatClock(estate), "19:00");
  });

  it("segue il cambio dell'ora legale", () => {
    setTimeZone("Europe/Rome");
    assert.equal(msFromParts(2026, 7, 15, 12, 0), Date.UTC(2026, 6, 15, 10, 0));
    assert.equal(msFromParts(2026, 1, 15, 12, 0), Date.UTC(2026, 0, 15, 11, 0));
    assert.equal(zoneOffsetMinutes(Date.UTC(2026, 6, 15, 10, 0)), 120);
    assert.equal(zoneOffsetMinutes(Date.UTC(2026, 0, 15, 11, 0)), 60);
  });

  it("scrive l'offset del fuso scelto nelle date salvate", () => {
    setTimeZone("Europe/Rome");
    assert.equal(toLocalISO(Date.UTC(2026, 6, 15, 10, 0)), "2026-07-15T12:00:00+02:00");
    assert.equal(toLocalISO(Date.UTC(2026, 0, 15, 11, 0)), "2026-01-15T12:00:00+01:00");
    setTimeZone("UTC");
    assert.equal(toLocalISO(Date.UTC(2026, 6, 15, 10, 0)), "2026-07-15T10:00:00+00:00");
  });

  it("rilegge un orario digitato come lo stesso orario", () => {
    // Il difetto d'origine: con il browser in UTC un orario digitato finiva due
    // ore avanti, e la rilettura nel fuso sbagliato lo faceva sembrare giusto.
    for (const zone of ["Europe/Rome", "UTC", "Asia/Manila"]) {
      setTimeZone(zone);
      assert.equal(formatClock(localAt(18, 34)), "18:34", zone);
      assert.equal(formatClockSeconds(localAt(18, 34, 27)), "18:34:27", zone);
      assert.equal(formatClockSeconds(localAt(18, 34)), "18:34:00", zone);
    }
  });

  it("colloca l'orario digitato nel fuso scelto", () => {
    const estate = Date.UTC(2026, 6, 15, 10, 0);
    setTimeZone("Europe/Rome");
    const aRoma = msFromParts(2026, 7, 15, 18, 34);
    setTimeZone("UTC");
    const aUTC = msFromParts(2026, 7, 15, 18, 34);
    // Lo stesso orario in due fusi e' lo stesso numero, distanziato dall'offset.
    assert.equal(aUTC - aRoma, 2 * HOUR);
    assert.ok(estate > 0);
  });
});

// ------------------------------------------------ finestra di respawn -------

describe("finestra di respawn", () => {
  it("attraversa i tre stati", () => {
    const now = nowLocal();
    const timer = makeTimer({ dmin: 60, dmax: 90 });
    assert.equal(timer.state(now), TimerState.PENDING);
    assert.equal(timer.state(now + 70 * MINUTE), TimerState.OPEN);
    assert.equal(timer.state(now + 100 * MINUTE), TimerState.CLOSED);
  });

  it("non ha finestra quando le durate coincidono", () => {
    const now = nowLocal();
    const timer = makeTimer({ dmin: 60, dmax: 60 });
    assert.ok(timer.isFixed);
    assert.equal(timer.state(now + 61 * MINUTE), TimerState.CLOSED);
  });

  it("conta verso la soglia corrente", () => {
    const now = nowLocal();
    const timer = makeTimer({ dmin: 60, dmax: 90 });
    assert.ok(Math.abs(timer.countdown(now) - 3600) < 1);
    // A finestra aperta il conto passa alla chiusura.
    assert.ok(Math.abs(timer.countdown(now + 70 * MINUTE) - 1200) < 1);
    // A finestra chiusa diventa negativo.
    assert.ok(timer.countdown(now + 100 * MINUTE) < 0);
  });

  it("ordina prima gli aperti, poi gli attesi, poi i chiusi", () => {
    const now = nowLocal();
    const entries = [
      ["3", makeTimer({ name: "Chiuso", minutesAgo: 200, dmin: 10, dmax: 20 })],
      ["2", makeTimer({ name: "Atteso", dmin: 60, dmax: 90 })],
      ["1", makeTimer({ name: "Aperto", minutesAgo: 30, dmin: 10, dmax: 90 })],
    ];
    const ordinati = sortEntries(entries, now).map(([, timer]) => timer.name);
    assert.deepEqual(ordinati, ["Aperto", "Atteso", "Chiuso"]);
  });

  it("scambia le durate invertite", () => {
    const timer = makeTimer({ dmin: 190, dmax: 370 });
    timer.setWindow(400, timer.dmax);
    assert.equal(timer.dmin, 370);
    assert.equal(timer.dmax, 400);
  });

  it("riarma l'allarme quando si riprogramma", () => {
    const timer = makeTimer({ minutesAgo: 500 });
    timer.acked = true;
    timer.alertsSent = 6;
    timer.reschedule(nowLocal());
    assert.equal(timer.acked, false);
    assert.equal(timer.alertsSent, 0);
    assert.equal(timer.nextAlert, null);
  });
});

// ---------------------------------------------------------------- allarmi ---

describe("allarmi", () => {
  it("non scatta prima dell'apertura", () => {
    const timer = makeTimer({ dmin: 60, dmax: 90 });
    assert.equal(timer.alertDue(nowLocal(), 6), false);
  });

  it("si ripete fino al massimo", () => {
    let now = nowLocal();
    const timer = makeTimer({ minutesAgo: 30, dmin: 10, dmax: 90 });

    for (let emessi = 0; emessi < 6; emessi += 1) {
      assert.equal(timer.alertDue(now, 6), true);
      timer.registerAlert(now, 15);
      // Subito dopo non deve ripetersi: si aspetta l'intervallo.
      assert.equal(timer.alertDue(now, 6), false);
      now += 15 * 1000;
      assert.equal(timer.alertsSent, emessi + 1);
    }

    assert.equal(timer.alertDue(now, 6), false);
  });

  it("si ferma quando l'utente prende atto", () => {
    const now = nowLocal();
    const timer = makeTimer({ minutesAgo: 30, dmin: 10, dmax: 90 });
    assert.equal(timer.acknowledge(), true);
    assert.equal(timer.acknowledge(), false);
    assert.equal(timer.alertDue(now, 6), false);
  });

  it("resta muto se il suono e' disattivato sul timer", () => {
    // La casella Sound tolta zittisce il singolo timer, non tutta la lista.
    const now = nowLocal();
    const timer = makeTimer({ minutesAgo: 30, dmin: 10, dmax: 90 });
    assert.equal(timer.alertDue(now, 6), true);
    timer.sound = false;
    assert.equal(timer.alertDue(now, 6), false);
  });

  it("ha il suono attivo per impostazione predefinita", () => {
    assert.equal(makeTimer().sound, true);
  });
});

// ----------------------------------------------------- serializzazione -----

describe("serializzazione", () => {
  it("sopravvive al round trip", () => {
    const timer = makeTimer({ minutesAgo: 10, dmin: 190, dmax: 370 });
    timer.alertsSent = 3;
    timer.sound = false;
    timer.beeps = 4;
    assert.deepStrictEqual(Timer.fromDict(timer.toDict()), timer);
  });

  it("legge il numero di bip", () => {
    const casi = [
      [3, 3],
      ["3", 3],
      [" 12 ", 12],
      [3.0, 3],
      [null, 1],
      [undefined, 1],
      ["", 1],
      ["0", 1],
      ["-2", 1],
      ["2.5", 1],
      ["abc", 1],
      [true, 1],
      [500, 99],
    ];
    for (const [valore, atteso] of casi) assert.equal(parseBeeps(valore), atteso);
  });

  it("suona una volta sui file scritti prima della colonna Bip", () => {
    const payload = {
      name: "Atroce",
      start: toLocalISO(nowLocal()),
      duration_min_minutes: 190,
      duration_max_minutes: 370,
    };
    assert.equal(Timer.fromDict(payload).beeps, 1);
  });

  it("scrive una data ISO rileggibile", () => {
    const start = new Date(2026, 8, 1, 22, 58, 0, 0).getTime();
    const testo = toLocalISO(start);
    assert.match(testo, /^2026-09-01T22:58:00[+-]\d{2}:\d{2}$/);
    assert.equal(Date.parse(testo), start);
  });

  it("attiva il suono sui file scritti prima della colonna Sound", () => {
    const payload = {
      name: "Atroce",
      start: toLocalISO(nowLocal()),
      duration_min_minutes: 190,
      duration_max_minutes: 370,
    };
    assert.equal(Timer.fromDict(payload).sound, true);
  });

  it("migra dal formato della versione 1", () => {
    // Il vecchio formato aveva una sola durata e il flag notified.
    const timer = Timer.fromDict({
      name: "Gryphon",
      mappa: "ra_fild01",
      categoria: "Mostro",
      start: "2026-09-01T22:58:00",
      duration_minutes: 60.0,
      notified: true,
    });
    assert.notEqual(timer, null);
    assert.equal(timer.dmin, 60);
    assert.equal(timer.dmax, 60);
    assert.equal(timer.acked, true);
    assert.ok(timer.isFixed);
    // La data naive del vecchio file viene letta come ora locale.
    assert.equal(timer.start, new Date(2026, 8, 1, 22, 58, 0, 0).getTime());
  });

  it("ordina le durate invertite nel file", () => {
    const timer = Timer.fromDict({
      name: "Atroce",
      start: toLocalISO(nowLocal()),
      duration_min_minutes: 370,
      duration_max_minutes: 190,
    });
    assert.notEqual(timer, null);
    assert.ok(timer.dmin < timer.dmax);
  });

  it("scarta le voci malformate", () => {
    const casi = [
      {},
      { start: "non-una-data", duration_minutes: 60 },
      { start: "2026-09-01T22:58:00", duration_minutes: "abc" },
      { start: "2026-09-01T22:58:00", duration_minutes: 0 },
    ];
    for (const payload of casi) {
      assert.equal(Timer.fromDict(payload), null, JSON.stringify(payload));
    }
  });

  it("ignora chiavi sconosciute e geometria non valida", () => {
    const settings = Settings.fromDict({
      volume: 33,
      topmost: true,
      geometry: "non-valida",
      sconosciuta: 1,
    });
    assert.equal(settings.volume, 33);
    assert.equal(settings.topmost, true);
    assert.equal(settings.geometry, "");
    assert.equal("sconosciuta" in settings, false);
  });

  it("accetta una geometria valida", () => {
    assert.equal(Settings.fromDict({ geometry: "820x560+100+50" }).geometry, "820x560+100+50");
  });

  it("crea un preset da un timer", () => {
    const preset = Preset.fromTimer(makeTimer({ dmin: 190, dmax: 370 }));
    assert.equal(preset.dmin, 190);
    assert.equal(preset.dmax, 370);
    assert.deepStrictEqual(Preset.fromDict(preset.toDict()), preset);
  });
});

// ------------------------------------------------------------ persistenza ---

describe("persistenza", () => {
  it("esporta il formato del file dati", () => {
    const store = new TimerStore();
    store.add(makeTimer());
    const dati = store.toDict();
    assert.equal(dati.version, DATA_VERSION);
    assert.ok("duration_max_minutes" in dati.timers[0]);
    assert.ok("sound" in dati.timers[0]);
  });

  it("sopravvive al round trip completo", () => {
    const store = new TimerStore();
    store.add(makeTimer({ name: "Atroce", minutesAgo: 10 }));
    store.add(makeTimer({ name: "Valkyrie", minutesAgo: 200, dmin: 120, dmax: 120 }));
    store.remember("mappa", "odin_tem02");
    store.rememberPreset(store.timers.get("1"));
    store.settings.volume = 33;
    store.settings.topmost = true;

    const riletto = new TimerStore();
    riletto.loadDict(JSON.parse(JSON.stringify(store.toDict())));
    assert.deepEqual([...riletto.timers.values()].map((t) => t.name), ["Atroce", "Valkyrie"]);
    assert.ok(riletto.history.mappa.includes("odin_tem02"));
    assert.equal(riletto.presets.get("atroce").dmax, 370);
    assert.equal(riletto.settings.volume, 33);
    assert.equal(riletto.settings.topmost, true);
  });

  it("non si rompe su dati assenti", () => {
    const store = new TimerStore();
    store.loadDict(null);
    assert.equal(store.timers.size, 0);
  });

  it("silenzia le finestre gia' aperte all'avvio", () => {
    // Riaprendo l'applicazione non devono partire tutti gli allarmi arretrati.
    const store = new TimerStore();
    store.add(makeTimer({ name: "Aperto", minutesAgo: 200, dmin: 10, dmax: 400 }));
    store.add(makeTimer({ name: "Atteso", dmin: 60, dmax: 90 }));

    const riletto = new TimerStore();
    riletto.loadDict(store.toDict());
    const perNome = Object.fromEntries([...riletto.timers.values()].map((t) => [t.name, t]));
    assert.equal(perNome.Aperto.acked, true);
    assert.equal(perNome.Atteso.acked, false);
  });

  it("migra la categoria Mostro in MvP", () => {
    // I file salvati prima della versione 3 usavano Mostro come categoria.
    const store = new TimerStore();
    store.loadDict({
      version: 2,
      timers: [
        {
          name: "Atroce",
          mappa: "ve_fild01",
          categoria: "Mostro",
          start: toLocalISO(nowLocal()),
          duration_min_minutes: 190,
          duration_max_minutes: 370,
        },
      ],
      history: { nome: ["Atroce"], mappa: ["ve_fild01"], categoria: ["Mostro", "Quest"] },
      presets: {
        atroce: { nome: "Atroce", mappa: "ve_fild01", categoria: "Mostro", min: 190, max: 370 },
      },
      archive: [
        {
          name: "Gryphon",
          categoria: "Mostro",
          start: toLocalISO(nowLocal()),
          duration_min_minutes: 60,
          duration_max_minutes: 60,
        },
      ],
    });
    assert.deepEqual([...store.timers.values()].map((t) => t.categoria), ["MvP"]);
    assert.deepEqual(store.history.categoria, ["MvP", "Quest"]);
    assert.equal(store.presets.get("atroce").categoria, "MvP");
    assert.equal(store.archive[0].categoria, "MvP");
  });

  it("non migra la categoria sui file gia' aggiornati", () => {
    // Su un file della versione corrente Mostro e' una scelta dell'utente.
    const store = new TimerStore();
    const timerId = store.add(makeTimer({ name: "Atroce" }));
    store.timers.get(timerId).categoria = "Mostro";
    store.remember("categoria", "Mostro");

    const riletto = new TimerStore();
    riletto.loadDict(store.toDict());
    assert.equal(riletto.timers.get("1").categoria, "Mostro");
    assert.ok(riletto.history.categoria.includes("Mostro"));
  });

  it("impara i preset dai timer del file", () => {
    const store = new TimerStore();
    store.add(makeTimer({ name: "Atroce", dmin: 190, dmax: 370 }));

    const riletto = new TimerStore();
    riletto.loadDict(store.toDict());
    assert.equal(riletto.presetFor("atroce").dmin, 190);
    assert.equal(riletto.presetFor("  ATROCE  ").dmax, 370);
    assert.equal(riletto.presetFor("sconosciuto"), null);
  });
});

// -------------------------------------------------------------- archivio ---

describe("archivio", () => {
  it("seleziona solo le finestre chiuse da tempo", () => {
    const store = new TimerStore();
    const vecchio = store.add(makeTimer({ name: "Vecchio", minutesAgo: 3000, dmin: 10, dmax: 20 }));
    store.add(makeTimer({ name: "Recente", minutesAgo: 30, dmin: 10, dmax: 90 }));
    assert.deepEqual(store.staleIds(nowLocal(), 24 * HOUR), [vecchio]);
  });

  it("sposta i timer nell'archivio", () => {
    const store = new TimerStore();
    const vecchio = store.add(makeTimer({ name: "Vecchio", minutesAgo: 3000, dmin: 10, dmax: 20 }));
    const payloads = store.archiveIds([vecchio], nowLocal());

    assert.equal(store.timers.has(vecchio), false);
    assert.equal(payloads.length, 1);
    assert.equal(store.archive[0].name, "Vecchio");
    assert.ok("archived_at" in store.archive[0]);
    // I payload restituiti servono per l'annullamento e non hanno la data.
    assert.equal("archived_at" in payloads[0], false);
  });

  it("limita la dimensione dell'archivio", () => {
    const store = new TimerStore();
    for (let i = 0; i < MAX_ARCHIVE + 10; i += 1) {
      const timerId = store.add(makeTimer({ name: "Vecchio", minutesAgo: 3000, dmin: 10, dmax: 20 }));
      store.archiveIds([timerId], nowLocal());
    }
    assert.equal(store.archive.length, MAX_ARCHIVE);
  });

  it("reinserisce i timer rimossi", () => {
    const store = new TimerStore();
    const timerId = store.add(makeTimer({ name: "Atroce" }));
    const payloads = store.remove([timerId]);
    assert.equal(store.timers.size, 0);

    const nuovi = store.restore(payloads);
    assert.equal(nuovi.length, 1);
    assert.equal(store.timers.get(nuovi[0]).name, "Atroce");
  });
});

// ---------------------------------------------------------------- storico ---

describe("storico", () => {
  it("ignora duplicati e maiuscole", () => {
    const store = new TimerStore();
    assert.equal(store.remember("nome", "Atroce"), true);
    assert.equal(store.remember("nome", "atroce"), false);
    assert.equal(store.remember("nome", "  "), false);
    assert.deepEqual(store.history.nome, ["Atroce"]);
  });

  it("mantiene l'ordine alfabetico", () => {
    const store = new TimerStore();
    for (const nome of ["Valkyrie", "Atroce", "gryphon"]) store.remember("nome", nome);
    assert.deepEqual(store.history.nome, ["Atroce", "gryphon", "Valkyrie"]);
  });
});
