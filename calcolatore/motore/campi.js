// I campi e i risultati del motore come li usa chi sta fuori (la pagina, i test, gli strumenti
// di prova).

// Il motore viene da un calcolatore che leggeva un form HTML: un campo ha ancora la semantica
// delle <select> del browser, su cui il motore conta (una sola opzione scelta, la prima non
// disabilitata se nessuna lo e'; options[i] = ..., options.length = n, gruppi di opzioni). c e'
// l'insieme dei campi per nome, come era document.calcForm
var c = {};

// un'opzione: testo con gli spazi compressi, come quello di un'<option>; senza valore vale il testo
function Opzione(testo, valore, scelta) {
  this.text = testo === undefined ? "" : testo;
  this._valore = valore === undefined ? undefined : String(valore);
  this.selezionata = !!scelta;
  this.disabled = false;
  this.padre = null;
}
Object.defineProperty(Opzione.prototype, "text", {
  get: function () { return this._testo; },
  set: function (t) { this._testo = String(t).replace(/[\t\n\f\r ]+/g, " ").trim(); },
});
Object.defineProperty(Opzione.prototype, "value", {
  get: function () { return this._valore === undefined ? this.text : this._valore; },
});
// un gruppo di opzioni (optgroup)
function Gruppo() {
  this.label = "";
  this.figli = [];
  this.padre = null;
}
Gruppo.prototype.appendChild = function (n) { return attacca(this, n); };

// tipo: "select", "checkbox", "testo" o "pulsante"; gestore: la funzione eseguita alla scelta
// (this e' il campo), o null. figli: opzioni e gruppi in ordine; _elenco: le opzioni in fila,
// tenuto aggiornato nei casi comuni (aggiunta in fondo, rimozione). La regola della scelta si
// applica in ritardo (_sporco), prima del primo uso che ne dipende: stesso risultato, piu' veloce
function Campo(nome, tipo, gestore) {
  this.name = nome;
  this.tipo = tipo;
  this.gestore = gestore;
  this.style = {};
  this._disabilitato = this._nascosto = this._spuntato = false;
  this._valore = tipo === "checkbox" ? "on" : "";
  this.figli = [];
  this._elenco = null;
  this._sporco = false;
  this._collezione = null;
}
var CP = Campo.prototype;
// come nel browser, sempre vero o falso qualunque valore si assegni
Object.defineProperty(CP, "disabled", { get: function () { return this._disabilitato; }, set: function (v) { this._disabilitato = !!v; } });
Object.defineProperty(CP, "hidden", { get: function () { return this._nascosto; }, set: function (v) { this._nascosto = !!v; } });
Object.defineProperty(CP, "checked", { get: function () { return this._spuntato; }, set: function (v) { this._spuntato = !!v; } });
CP.appendChild = function (n) { return attacca(this, n); };
CP.elenco = function () {
  if (this._elenco) return this._elenco;
  var l = [];
  this.figli.forEach(function (f) {
    if (f instanceof Gruppo) l.push.apply(l, f.figli);
    else l.push(f);
  });
  return (this._elenco = l);
};
CP._assicura = function () {
  if (!this._sporco) return;
  this._sporco = false;
  var l = this.elenco(), scelte = 0, ultima = -1, i;
  for (i = 0; i < l.length; i++) if (l[i].selezionata) { scelte++; ultima = i; }
  if (scelte === 0) {
    for (i = 0; i < l.length; i++) if (!l[i].disabled) { l[i].selezionata = true; break; }
  } else if (scelte > 1) {
    for (i = 0; i < l.length; i++) l[i].selezionata = i === ultima;
  }
};
Object.defineProperty(CP, "selectedIndex", {
  get: function () {
    this._assicura();
    var l = this.elenco();
    for (var i = 0; i < l.length; i++) if (l[i].selezionata) return i;
    return -1;
  },
  set: function (v) {
    this._assicura();
    var l = this.elenco();
    v = Number(v);
    for (var i = 0; i < l.length; i++) l[i].selezionata = i === v;
  },
});
Object.defineProperty(CP, "value", {
  get: function () {
    if (this.tipo !== "select") return this._valore;
    var o = this.elenco()[this.selectedIndex];
    return o ? o.value : "";
  },
  set: function (v) {
    v = v === null ? "" : String(v);
    if (this.tipo !== "select") return void (this._valore = v);
    this._assicura();
    var trovata = false;
    this.elenco().forEach(function (o) {
      o.selezionata = !trovata && o.value === v;
      if (o.selezionata) trovata = true;
    });
  },
});
// options[i] = opzione (null la toglie; oltre la fine aggiunge opzioni vuote), options.length
Object.defineProperty(CP, "length", {
  get: function () { return this.elenco().length; },
  set: function (n) {
    n = Number(n) >>> 0;
    var l = this.elenco();
    if (n < l.length) for (var via = l.slice(n), i = via.length - 1; i >= 0; i--) stacca(via[i]);
    else while (this.elenco().length < n) attacca(this, new Opzione());
  },
});
CP._imposta = function (i, o) {
  var l = this.elenco();
  if (o === null || o === undefined) {
    if (i < l.length) stacca(l[i]);
    return;
  }
  if (i < l.length) return void sostituisci(l[i], o);
  while (this.elenco().length < i) attacca(this, new Opzione());
  attacca(this, o);
};
Object.defineProperty(CP, "options", {
  get: function () {
    if (this._collezione) return this._collezione;
    var campo = this;
    var base = {
      get length() { return campo.length; },
      set length(n) { campo.length = n; },
      [Symbol.iterator]: function () { return campo.elenco().slice()[Symbol.iterator](); },
    };
    return (this._collezione = new Proxy(base, {
      get: function (t, p) {
        if (typeof p === "string" && /^\d+$/.test(p)) return campo.elenco()[Number(p)];
        return t[p];
      },
      set: function (t, p, v) {
        if (typeof p === "string" && /^\d+$/.test(p)) campo._imposta(Number(p), v);
        else t[p] = v;
        return true;
      },
    }));
  },
});

// il campo di un'opzione o di un gruppo (null se il gruppo non sta in un campo)
function campoDi(padre) {
  return padre instanceof Campo ? padre : padre && padre.padre;
}
// n (opzione o gruppo) in fondo a padre (il campo o un suo gruppo), tolto da dove stava. Come
// nel browser, un'opzione scelta che entra toglie la scelta alle altre
function attacca(padre, n) {
  if (n.padre) stacca(n);
  padre.figli.push(n);
  n.padre = padre;
  var campo = campoDi(padre);
  if (!campo) return n;
  if (campo._elenco && padre === campo && n instanceof Opzione) campo._elenco.push(n);
  else campo._elenco = null;
  campo._sporco = true;
  if (n instanceof Opzione && n.selezionata)
    campo.elenco().forEach(function (o) {
      if (o !== n) o.selezionata = false;
    });
  return n;
}
function stacca(n) {
  var padre = n.padre, campo = campoDi(padre);
  padre.figli.splice(padre.figli.lastIndexOf(n), 1);
  n.padre = null;
  if (!campo) return;
  var l = campo._elenco;
  if (l && n instanceof Opzione) {
    var i = l[l.length - 1] === n ? l.length - 1 : l.indexOf(n);
    if (i >= 0) l.splice(i, 1);
    else campo._elenco = null;
  } else campo._elenco = null;
  campo._sporco = true;
}
// l'opzione nuova al posto della vecchia, nel suo stesso gruppo
function sostituisci(vecchia, nuova) {
  if (nuova.padre) stacca(nuova);
  var padre = vecchia.padre, campo = campoDi(padre);
  padre.figli[padre.figli.indexOf(vecchia)] = nuova;
  nuova.padre = padre;
  vecchia.padre = null;
  if (campo._elenco) campo._elenco[campo._elenco.indexOf(vecchia)] = nuova;
  campo._sporco = true;
  if (nuova.selezionata)
    campo.elenco().forEach(function (o) {
      if (o !== nuova) o.selezionata = false;
    });
}

// Un campo nuovo: imp ha opzioni ([valore, testo, scelta], o { gruppo, opzioni } per un
// optgroup), spuntato, disabilitato, nascosto, valore (non per le tendine). Un campo con lo
// stesso nome lo sostituisce
function campo(nome, tipo, gestore, imp) {
  imp = imp || {};
  var el = new Campo(nome, tipo, gestore);
  el.checked = imp.spuntato;
  el.disabled = imp.disabilitato;
  el.hidden = imp.nascosto;
  if (imp.valore !== undefined && tipo !== "select") el.value = imp.valore;
  var opzioni = function (dentro, lista) {
    lista.forEach(function (o) {
      if (Array.isArray(o)) return dentro.appendChild(new Opzione(o[1], o[0], o[2]));
      var g = dentro.appendChild(new Gruppo());
      g.label = o.gruppo;
      opzioni(g, o.opzioni);
    });
  };
  opzioni(el, imp.opzioni || []);
  c[nome] = el;
  return el;
}
function togliCampo(nome) {
  delete c[nome];
}

// Pannelli dei buff (buff.js): pannelli[radice] e' la descrizione del pannello aperto, una lista
// di gruppi { titolo, voci }. Una voce e' un campo ({ campo, tipo, gestore, etichetta, id,
// segno, ... }), una nota ({ nota }) o una riga con testi e campi ({ riga: [...] }). La pagina
// la disegna; il motore ne crea i campi. Un'etichetta con id e' un risultato (uscite[id]) che
// il motore puo' cambiare; etichetta e' allora il suo contenuto iniziale. Le voci facoltative
// le crea e le toglie il motore (canti e danze), e aprire il pannello le toglie, come prima
// faceva l'HTML riscritto
var pannelli = {};
function vociDi(gruppi, f) {
  gruppi.forEach(function (g) {
    g.voci.forEach(function (v) {
      (v.riga || [v]).forEach(function (x) {
        if (x.campo) f(x);
      });
    });
  });
}
function apriPannello(radice, gestore, gruppi) {
  pannelli[radice] = gruppi;
  vociDi(gruppi, function (v) {
    if (v.facoltativo) togliCampo(v.campo);
    else campo(v.campo, v.tipo || "select", v.gestore === undefined ? gestore : v.gestore, v);
    if (v.id) scrivi(v.id, v.etichetta || "");
  });
}
function chiudiPannello(radice) {
  var gruppi = pannelli[radice];
  if (!gruppi) return;
  vociDi(gruppi, function (v) {
    togliCampo(v.campo);
    if (v.id) delete uscite[v.id];
  });
  delete pannelli[radice];
}

// Parti che il motore riempie di campi secondo le scelte (skill passive, campo in piu' della
// skill, seconda arma, Altre informazioni): contenitori[id] e' la lista delle voci, come in un
// pannello. contenitore toglie i campi e i risultati (id) delle voci di prima e crea i campi
// nuovi; senza voci svuota la parte. Il gestore di un campo e' il suo o nessuno; un'etichetta
// con id si scrive nel risultato, le altre note e righe con id le scrive il motore
var contenitori = {};
function contenitore(id, voci) {
  var prima = contenitori[id] || [];
  vociDi([{ voci: prima }], function (v) {
    togliCampo(v.campo);
  });
  prima.forEach(function (v) {
    [v, v.nota].concat(v.riga || []).forEach(function (x) {
      if (x && x.id) delete uscite[x.id];
    });
  });
  contenitori[id] = voci || [];
  vociDi([{ voci: contenitori[id] }], function (v) {
    campo(v.campo, v.tipo || "select", v.gestore || null, v);
    if (v.id) scrivi(v.id, v.etichetta || "");
  });
}

// Una scelta e' il valore nel campo, poi il suo gestore. Il ricalcolo (calc) lo chiede chi
// sceglie. campo: il campo o il suo nome; senza valore esegue solo il gestore (pulsanti)
function scegli(campo, valore) {
  if (typeof campo === "string") campo = c[campo];
  if (valore !== undefined) {
    if (campo.tipo === "checkbox") campo.checked = valore;
    else campo.value = valore;
  }
  if (campo.gestore) campo.gestore.call(campo);
}

// I risultati: uscite[id] e' il testo che il motore scrive con scrivi(id, valore). E' HTML con
// pochi tag (grassetto, colori, a capo, spiegazioni in span.name/.nametext, le tabelle di Altre
// informazioni e la scheda dell'oggetto). USCITE: i risultati con il loro contenuto iniziale,
// come stavano nella pagina del calcolatore di Thrice
var USCITE = {
  A_STPOINT: "48",
  A_BodySIZE: "Demi-Human &amp; Medium",
  A_BodyELEMENT: "<b style=\"color: var(--color-neutral)\">Neutral</b>1",
  A_STRp: " + 0",
  A_AGIp: " + 0",
  A_VITp: " + 1",
  A_INTp: " + 0",
  A_DEXp: " + 0",
  A_LUKp: " + 0",
  A_MaxHP: "57",
  A_totalDEF: "16+2",
  A_HIT: "2",
  A_MaxSP: "19",
  A_MDEF: "0+1",
  A_PefHIT: "0",
  A_HPR: "1",
  A_RealMDEF: "0+2",
  A_CRI: "1",
  A_SPR: "1",
  A_ATK2: "6+0",
  A_CRITSHIELD: "1.2",
  A_ASPD: "150.3",
  A_RealATK: "6~6",
  A_FLEE: "2",
  A_MovSPEED: "100 %",
  A_MATK: "1~1",
  A_WoeFLEE: "1",
  A_Weight: " <span class=\"name\" style=\"color: green\">14.03 %<span class=\"nametext\">285 / 2030</span></span> ",
  A_cTime: " <span class=\"name\" style=\"color: green\">99.33 % <span class=\"nametext\"><span class=\"name\">Magic Strings<span class=\"nametext\"><b><u>Alt. name</u>:</b><br>A Poem of Bragi</span></span>: 0%<br>Gear: 0%<br>DEX: 1 </span></span> ",
  A_LUCKY: "1.1",
  A_cDelay: " <span class=\"name\" style=\"color: green\">100 % <span class=\"nametext\"><span class=\"name\">Magic Strings<span class=\"nametext\"><b><u>Alt. name</u>:</b><br>A Poem of Bragi</span></span>: 0%<br>Gear: 0%</span></span> ",
  A_SobWeaponName: "",
  ITEM_TITLE: "(no weapon) [0]",
  ITEM1: "ATK:",
  ITEM_DATA: "0",
  ITEM2: "Weapon Lvl:",
  ITEM_W_LV: "1",
  ITEM3: "Req. Lvl:",
  ITEM_LV: "0",
  ITEM4: "Weight:",
  ITEM_WAIT: "0",
  B_SETUMEI: "",
  B_6: "1",
  B_16: "1",
  B_agi: "0",
  B_12: "1",
  B_13: "1",
  B_17: "1",
  B_vit: "0",
  B_14: "0",
  B_AA: " + ",
  B_23: "0",
  B_2: "<b style=\"color: orange\">Demi-Human</b>",
  B_int: "0",
  B_15: "0",
  B_AB: " + ",
  B_25: "0",
  B_3: " <b><b style=\"color: var(--color-neutral)\">Neutral</b>1</b> ",
  B_dex: "0",
  B_21: "21",
  B_4: "Medium",
  B_luk: "0",
  B_22: "76",
  B_type: "Normal",
  nm053: "Player's Hit Ratio",
  BattleHIT: "81.2",
  nm074: "Attack Element",
  A_WeaponElement: "<b style=\"color: var(--color-neutral)\">Neutral</b> (100% vs <b style=\"color: var(--color-neutral)\">Neutral</b>1)",
  nm076: "Weapon/Skill Size Modifier",
  A_WeaponSize: "100% <span class=\"font-light\">(Bare Hand vs Medium)</span>",
  CRIATKname: "Critical damage (Critical rate)",
  CRIATK: "6",
  CRInum: " (1.1%)",
  bSUB3name: "",
  bSUB3: "",
  bSUBname: "",
  bSUB: "",
  nm055: "Minimum Damage",
  strID_0: "6",
  nm056: "Average Damage",
  strID_1: "6",
  nm057: "Maximum Damage",
  strID_2: "6",
  bREFLECT1name: "",
  bREFLECT1: "",
  bREFLECT2name: "",
  bREFLECT2: "",
  bSUB2name: "Time/Hit<br>",
  bSUB2: "0.993 seconds<br>",
  nm058: "Damage Per Second",
  AveSecondATK: "4.91",
  nm059: "Minimum Number of Hits",
  MinATKnum: "1",
  nm060: "Average Number of Hits",
  AveATKnum: "1",
  nm061: "Maximum Number of Hits",
  MaxATKnum: "Infinite (no 100% hit)",
  nm062: "Average Battle Duration",
  BattleTime: "0.99 seconds",
  nm063: "",
  AtkBaseExp: "",
  nm064: "",
  AtkJobExp: "",
  nm054: "Player's Dodge Ratio",
  BattleFLEE: "21.86",
  nm075: "Enemy Attack Element",
  B_WeaponElement: "<b style=\"color: var(--color-neutral)\">Neutral</b> (100% vs <b style=\"color: var(--color-neutral)\">Neutral</b>1)",
  nm067: "Minimum Damage Received",
  B_MinAtk: "1",
  nm065: "Average Damage Received",
  B_AveAtk: "1",
  nm068: "Maximum Damage Received",
  B_MaxAtk: "1",
  aREFLECT1name: "",
  aREFLECT1: "",
  aREFLECT2name: "",
  aREFLECT2: "",
  nm066: "Average Dmg Received (w/dodge)",
  B_Ave2Atk: "0.78",
  B_EffectiveHP: "—",
  B_ExpectedEffectiveHP: "—",
  B_SurvivalHits: "—",
  A_KakutyouData: "",
};
var uscite = Object.assign({}, USCITE);
function scrivi(id, valore) {
  uscite[id] = "" + valore;
}
var ENTITA = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", times: "×", rarr: "→", larr: "←", middot: "·", hellip: "…", mdash: "—", ndash: "–", deg: "°", plusmn: "±", frac12: "½" };
// il testo di un risultato come lo vede una persona: senza tag, entita' lette, spazi compressi
function testo(id) {
  var html = uscite[id];
  if (html === undefined) return "";
  return html
    .replace(/<!--[\s\S]*?-->|<\/?[a-zA-Z][a-zA-Z0-9]*(?:[^>"']|"[^"]*"|'[^']*')*>/g, "")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, function (tutto, e) {
      if (e[0] === "#") return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
      var v = ENTITA[e.toLowerCase()];
      return v === undefined ? tutto : v;
    })
    .replace(/\s+/g, " ")
    .trim();
}

// I campi fissi della pagina, nell'ordine in cui stavano nella pagina di Thrice
campo("maxASPD", "select", function () { StAllCalc(); calc(); }, { opzioni: [["0", "190"], ["1", "191"], ["2", "192"], ["3", "193"], ["4", "194"], ["5", "195"]] });
campo("restrict_jobequip", "checkbox", function () { ClickJob(); StAllCalc(); StCalc(); }, { spuntato: true, disabilitato: true });
campo("restrict_lvlequip", "checkbox", function () { WeaponSet(); ClickWeaponType(0); WeaponSet2(); }, { disabilitato: true });
campo("restrict_equipslot", "checkbox", function () { StAllCalc(); calc(); });
campo("restrict_cardslot", "checkbox", function () { restrictCardslot(0); });
campo("all_card", "checkbox", function () { allCard(); });
campo("A_BaseLV", "select", function () { StCalc(1); StAllCalc(); });
campo("BLVauto", "checkbox", null, { spuntato: true });
campo("A_JobLV", "select", function () { StAllCalc(); });
campo("A_JOB", "select", function () { ClickJob(this.value); StAllCalc(); StCalc(); restrictCardslot(0); });
campo("A_adopted", "checkbox", function () { calc(); });
campo("A_STR", "select", function () { StCalc(); StAllCalc(); });
campo("A_AGI", "select", function () { StCalc(); StAllCalc(); });
campo("A_VIT", "select", function () { StCalc(); StAllCalc(); });
campo("A_INT", "select", function () { StCalc(); StAllCalc(); });
campo("A_DEX", "select", function () { StCalc(); StAllCalc(); });
campo("A_LUK", "select", function () { StCalc(); StAllCalc(); });
campo("episode", "select", function () { ClickJob(); }, { opzioni: [["0", "All"], ["13", "Until episode 13.3: El Dicastes"], ["12", "Until episode 12: Nightmare of Midgard, Destruction of Morocc"], ["11", "Until episode 11: The Religious Nation, Arunafeltz"], ["10", "Until episode 10: The Republic of Schwarzwald"], ["9", "Until episode 9: Rebirth Job System"], ["8", "Until episode 8: Niflheim ~ City of the Dead"]] });
campo("A_Arrow", "select", function () { calc(); }, { opzioni: [["0", "(no arrow)"], ["1", "Silver Arrow"]], disabilitato: true });
campo("A_Weapon_refine", "select", function () { calc(); }, { disabilitato: true });
campo("A_OverRefineBonus", "checkbox", function () { calc(); }, { spuntato: true });
campo("A_Weapon_element", "select", function () { calc(); });
campo("A_cardshort", "select", function () { Setm_CardShort(); Click_Card(); ActiveSkillSetPlus(); });
campo("A_weapon1_card1", "select", function () { Click_Card(this.value); });
campo("A_weapon1_card2", "select", function () { Click_Card(this.value); });
campo("A_weapon1_card3", "select", function () { Click_Card(this.value); });
campo("A_weapon1_card4", "select", function () { Click_Card(this.value); });
campo("A_HEAD_REFINE", "select", function () { StAllCalc(); });
campo("A_head1", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(2); });
campo("A_head1_card", "select", function () { StAllCalc(); Card(this.value); });
campo("A_head2", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(3); });
campo("A_head2_card", "select", function () { StAllCalc(); Card(this.value); });
campo("A_BASTION_HEAD", "select", function () { StAllCalc(); });
campo("A_head3", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(4); });
campo("A_HSE_HEAD1", "select", function () { StAllCalc(); });
campo("A_LEFT_REFINE", "select", function () { StAllCalc(); });
campo("A_left", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(5); setShieldWeight(this.value); });
campo("A_left_card", "select", function () { StAllCalc(); Card(this.value); });
campo("A_BODY_REFINE", "select", function () { StAllCalc(); });
campo("A_body", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(6); });
campo("A_body_card", "select", function () { StAllCalc(); Card(this.value); });
campo("A_HSE", "select", function () { StAllCalc(); });
campo("A_SHOULDER_REFINE", "select", function () { StAllCalc(); });
campo("A_shoulder", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(7); });
campo("A_shoulder_card", "select", function () { StAllCalc(); Card(this.value); });
campo("A_DICASTES_SHOULDER_PRIMARY", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_SHOULDER_STATS", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_SHOULDER_STATS2", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_SHOES_REFINE", "select", function () { StAllCalc(); });
campo("A_shoes", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(8); });
campo("A_shoes_card", "select", function () { StAllCalc(); Card(this.value); });
campo("A_BASTION_SHOES", "select", function () { StAllCalc(); });
campo("A_DICASTES_SHOES_PRIMARY", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_SHOES_STATS", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_SHOES_STATS2", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_acces1", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(9); });
campo("A_acces1_card", "select", function () { Click_Card(this.value); });
campo("A_DICASTES_ACCESSORY1_PRIMARY", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_ACCESSORY1_STATS", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_ACCESSORY1_STATS2", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_acces2", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(10); });
campo("A_acces2_card", "select", function () { Click_Card(this.value); });
campo("A_DICASTES_ACCESSORY2_PRIMARY", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_ACCESSORY2_STATS", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_ACCESSORY2_STATS2", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_Kakutyou", "select", function () { preparaAltreInfo(); StAllCalc(); }, { opzioni: [["0", "-"], ["2", "Heal amount"], ["4", "Sanctuary amount"], ["12", "Player Resistance"], ["14", "+% ATK based Damage Modifiers"], ["16", "+% MATK based Damage Modifiers"], ["20", "Experience"], ["22", "Potion Pitcher HP/SP power"], ["24", "Forge/Potion/EDP Creation Success Rate"], ["28", "Strip chance & duration"], ["30", "Cooking Success Rates"], ["32", "Capture Pet Success Rate"], ["34", "NPC Refinement Cost & Success Rate"], ["36", "NPC Socket Enchant Cost & Success Rate"], ["40", "Non-Damage Skill Cast Time"]] });
campo("ENEMY_SORT2", "select", function () { riempiMappe(); EnemySort(); calc(); });
campo("ENEMY_MAP", "select", function () { EnemySort(); calc(); });
campo("ENEMY_TYPE", "select", function () { EnemySort(); calc(); }, { opzioni: [["0", "All types"], ["1", "MvP"], ["2", "Boss (not MvP)"], ["3", "Normal monsters"]] });
campo("ENEMY_SORT", "select", function () { EnemySort(); calc(); }, { opzioni: [["0", "Alphabetical"], ["1", "By attribute"], ["2", "By race"], ["8", "By size"], ["3", "By 100%Hit"], ["4", "By 95%Flee"], ["5", "By BaseExp"], ["6", "By JobExp"], ["7", "By MaxATK"], ["9", "By DEF"], ["10", "By MDEF"], ["11", "By Type"]] });
campo("B_Enemy", "select", function () { Bskill(true); scheduleMonsterCalculation(); });
campo("all_dmgSkills", "checkbox", function () { Askill(); calc(); });
campo("ReCalcButton", "pulsante", function () { calc(); }, { valore: "ReCalculate" });
campo("A_ActiveSkill", "select", function () { ClickActiveSkill(); calc(); });
campo("A_ActiveSkillLV", "select", function () { calc(); }, { opzioni: [["1", "Lvl 1"]] });
campo("B_AtkRange", "select", function () { calc(); }, { opzioni: [["0", "(unchanged)"], ["1", "Melee (4 or less cells away)"], ["2", "Long Range (5 or more cells away)"]] });
campo("B_AtkSkill", "select", function () { BClickAtkSkill(); }, { opzioni: [["0", "Basic Attack"], ["6", "Bash Lvl 10"], ["7", "Magnum Break Lvl 10"], ["17", "Envenom Lvl 10"], ["19", "Sand Attack Lvl 1"], ["40", "Double Strafe Lvl 10"], ["41", "Arrow Shower Lvl 10"], ["44", "Arrow Repel Lvl 1"], ["46", "Napalm Beat Lvl 10"], ["47", "Soul Strike Lvl 10"], ["51", "Fire Bolt Lvl 10"], ["52", "Fire Ball Lvl 10"], ["53", "Fire Wall Lvl 10"], ["54", "Cold Bolt Lvl 10"], ["55", "Frost Diver Lvl 10"], ["56", "Lightning Bolt Lvl 10"], ["57", "Thunder Storm Lvl 10"], ["65", "Mammonite Lvl 10"], ["66", "Cart Revolution Lvl 1"], ["70", "Pierce Lvl 10"], ["71", "Spear Stab Lvl 10"], ["72", "Spear Boomerang Lvl 5"], ["73", "Brandish Spear Lvl 10"], ["76", "Bowling Bash Lvl 10"], ["83", "Sonic Blow Lvl 10"], ["84", "Grimtooth Lvl 5"], ["88", "Venom Splasher Lvl 10"], ["104", "Magnus Exorcismus Lvl 10"], ["122", "Fire Pillar Lvl 10"], ["124", "Sightrasher Lvl 5"], ["125", "Meteor Storm Lvl 10"], ["126", "Jupitel Thunder Lvl 10"], ["127", "Lord of Vermillion Lvl 10"], ["128", "Water Ball Lvl 5"], ["130", "Frost Nova Lvl 10"], ["131", "Storm Gust Lvl 10"], ["132", "Earth Spike Lvl 5"], ["133", "Heaven's Drive Lvl 5"], ["158", "Smite Lvl 5"], ["161", "Holy Cross Lvl 10"], ["162", "Grand Cross Lvl 10"], ["167", "Snatch Lvl 10"], ["169", "Back Stab Lvl 10"], ["171", "Sightless Mind Lvl 5"], ["188", "Raging Quadruple Blow Lvl 5"], ["189", "Raging Thrust Lvl 5"], ["199", "Melody Strike Lvl 5"], ["207", "Slinging Arrow Lvl 5"], ["244", "Acid Terror Lvl 5"], ["248", "Bomb Lvl 5"], ["259", "Clashing Spiral Lvl 5"], ["260", "Traumatic Blow Lvl 5"], ["261", "Vital Strike Lvl 10"], ["264", "Meteor Assault Lvl 10"], ["277", "Napalm Vulcan Lvl 5"], ["326", "High Speed Cart Ram Lvl 10"]] });
campo("B_AtkElem", "select", function () { calc(); });
campo("B_num", "select", function () { calc(); });
campo("Conf01", "select", null, { opzioni: [["10", "0.1s (10 per second)"], ["15", "0.15s"], ["20", "0.2s (5 per second)", true], ["25", "0.25s (4 per second)"], ["30", "0.3s"], ["33", "0.33s (3 per second) [default]"], ["40", "0.4s"], ["50", "0.5s (2 per second)"]] });
campo("A8_Skill14", "select", function () { StAllCalc(); calc(); }, { opzioni: [["0", "PvM / PvP", true], ["1", "WoE / BG"], ["2", "Guild Dungeon"], ["3", "URDR Server"]] });
campo("A8_Skill15", "select", function () { calc(); }, { opzioni: [["0", "-", true]] });
