// Le correzioni per uaRO e le parti nostre del motore che le build registrate non coprono:
// ogni prova parte da un motore nuovo e sceglie i campi come una persona.
import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { creaMotore } from "./motore.mjs";

// imposta un campo ed esegue il suo gestore (scegli del motore), poi ricalcola
function scegli(m, nome, valore) {
  const v = m.c[nome];
  assert.ok(v, "campo " + nome);
  m.scegli(v, v.type === "checkbox" ? valore : String(valore));
  if (v.tipo === "select") assert.equal(v.value, String(valore), `${nome}: opzione ${valore} assente`);
  m.calc();
}
const testo = (m, id) => m.testo(id);
const numero = (m, id) => Number(testo(m, id).match(/-?\d+(\.\d+)?/)[0]);
// le costanti del motore sono const: non sono proprieta' del contesto
const costante = (m, nome) => vm.runInContext(nome, m);
const id = (m, nome) => costante(m, "itemData").findIndex((o) => o.name === nome);

test("tirapugni: penalita' di taglia 100/100/75%", () => {
  const m = creaMotore();
  assert.deepEqual([...m.m_WeaponSize[13]], [1, 1, 0.75]);
});

test("Luna Bow: DEF +2, +3 da +6, +5 da +9", () => {
  const m = creaMotore();
  scegli(m, "A_JOB", 10); // Hunter
  scegli(m, "A_weapon1", 521);
  const def = (r) => (scegli(m, "A_Weapon_refine", r), m.n_A_DEF);
  const base = def(0) - 2;
  assert.deepEqual([def(5) - base, def(6) - base, def(8) - base, def(9) - base], [2, 3, 3, 5]);
});

test("Adrenaline Rush anche con una spada a una mano", () => {
  const m = creaMotore();
  scegli(m, "A_JOB", 12); // Blacksmith
  const spada = costante(m, "itemData").findIndex((o) => o.equipType == 2 && o.name === "Sword");
  scegli(m, "A_weapon1", spada);
  const i = [...Array(22).keys()].find((k) => /^A(n)?drenaline Rush/.test(testo(m, "P_Skill" + k)));
  assert.ok(i !== undefined, "Adrenaline Rush fra le skill passive");
  const senza = numero(m, "A_ASPD");
  scegli(m, "A_skill" + i, 1);
  assert.ok(numero(m, "A_ASPD") > senza, `ASPD ${senza} -> ${testo(m, "A_ASPD")}`);
});

test("Mitra: MATK +10 con INT base 90", () => {
  const m = creaMotore();
  scegli(m, "A_JOB", 23); // High Priest
  scegli(m, "A_BaseLV", 99);
  scegli(m, "A_INT", 89);
  scegli(m, "A_head1", 1876);
  // la Mitra da' anche INT +1: si guarda il bonus di MATK piatto (BONUSID.MATK, 88)
  const a89 = m.bonusValues[88];
  scegli(m, "A_INT", 90);
  assert.equal(m.bonusValues[88] - a89, 10);
  scegli(m, "A_head1", m.c.A_head1.options[0].value);
  assert.equal(m.bonusValues[88], a89);
});

test("Old Mitra: ogni 2 raffinamenti MaxHP +1%", () => {
  const m = creaMotore();
  scegli(m, "A_JOB", 23);
  scegli(m, "A_BaseLV", 99);
  const om = id(m, "Old Mitra (UARO)");
  assert.ok(om > 0);
  scegli(m, "A_head1", om);
  scegli(m, "A_HEAD_REFINE", 0);
  const hp0 = numero(m, "A_MaxHP");
  scegli(m, "A_HEAD_REFINE", 10);
  assert.equal(numero(m, "A_MaxHP"), Math.floor(hp0 * 1.05));
});

test("oggetti aggiunti per uaRO negli elenchi", () => {
  const m = creaMotore();
  scegli(m, "A_JOB", 23);
  const elenco = (campo) => [...m.c[campo].options].map((o) => o.text);
  for (const n of ["Love Guard", "Glaris Doll Hat", "Santa Poring Hat", "Old Mitra (UARO)"]) {
    assert.ok(elenco("A_head1").some((t) => t.startsWith(n)), n);
  }
  assert.ok(elenco("A_head2").some((t) => t.startsWith("Pecopeco Wing Ears")));
  assert.ok(elenco("A_head3").some((t) => t.startsWith("Umbala Spirit")));
  assert.ok(elenco("A_head3").some((t) => t.startsWith("Antique Smoking Pipe")));
});

test("Bastion: sette incantamenti, uno uguale su copricapo e calzature conta una volta", () => {
  const m = creaMotore();
  const B = costante(m, "BASTIONENCHANTID");
  const testi = [...m.c.A_BASTION_HEAD.options].map((o) => o.text);
  for (const n of ["All Stats", "Movement Speed", "Race Resist", "MATK", "ATK", "SP Consumption", "Healing"]) {
    assert.ok(testi.some((t) => t.startsWith(n)), n);
  }
  const atk = () => m.bonusValues[costante(m, "BONUSID").ATK_PERCENT];
  const senza = atk();
  scegli(m, "A_BASTION_HEAD", B.PHYSICAL_ATTACK);
  assert.equal(atk() - senza, 5);
  scegli(m, "A_BASTION_SHOES", B.PHYSICAL_ATTACK);
  assert.equal(atk() - senza, 5);
  scegli(m, "A_BASTION_SHOES", B.MAGICAL_ATTACK);
  assert.equal(atk() - senza, 5);
});

test("Bastion Movement Speed: +20% che si somma, non si moltiplica", () => {
  const m = creaMotore();
  assert.equal(numero(m, "A_MovSPEED"), 100);
  scegli(m, "A_BASTION_SHOES", costante(m, "BASTIONENCHANTID").MOVEMENT_SPEED);
  assert.equal(numero(m, "A_MovSPEED"), 120);
  scegli(m, "A_BASTION_HEAD", costante(m, "BASTIONENCHANTID").MOVEMENT_SPEED);
  assert.equal(numero(m, "A_MovSPEED"), 120);
});

test("formato della build: i Bastion nuovi tornano uguali, le build di Thrice no", () => {
  const m = creaMotore();
  scegli(m, "A_JOB", 23);
  scegli(m, "A_BASTION_HEAD", costante(m, "BASTIONENCHANTID").SP_CONSUMPTION);
  scegli(m, "A_BASTION_SHOES", costante(m, "BASTIONENCHANTID").MOVEMENT_SPEED);
  const build = String(m.scriviBuild());
  const carica = (b) => {
    const n = creaMotore();
    return [n.leggiBuild(b), n];
  };
  const [ok, n] = carica(build);
  assert.equal(ok, true);
  const c = n.c;
  assert.deepEqual([c.A_JOB.value, c.A_BASTION_HEAD.value, c.A_BASTION_SHOES.value].map(Number),
    [23, costante(m, "BASTIONENCHANTID").SP_CONSUMPTION, costante(m, "BASTIONENCHANTID").MOVEMENT_SPEED]);
  // la stessa build con la versione 18 del calcolatore di Thrice nel primo carattere
  const [okThrice, t] = carica("q" + build.slice(1));
  assert.equal(okThrice, false);
  assert.equal(Number(t.c.A_JOB.value), 0);
});

test("Back Stab: ricarica fissa di 0,333 secondi", () => {
  const m = creaMotore();
  scegli(m, "A_JOB", 14); // Rogue
  scegli(m, "A_ActiveSkill", 169);
  // la ricarica e' fissa; il ritardo mostrato e' il piu' lungo fra lei e quello dell'ASPD
  assert.equal(m.n_Delay[3], 0.333);
  assert.equal(m.n_Delay[2], 0);
});

test("El Dicastes: livelli 2 e 3 da +1/+2 (+3 sui Feral), sommabili sulla stessa statistica", () => {
  const m = creaMotore();
  const c = m.c;
  const testi = (nome) => [...c[nome].options].slice(1).map((o) => o.text);
  assert.deepEqual(testi("A_DICASTES_ACCESSORY1_STATS"), ["AGI +1", "AGI +2", "DEX +1", "DEX +2", "INT +1", "INT +2"]);
  assert.deepEqual(testi("A_DICASTES_ACCESSORY1_STATS2"), testi("A_DICASTES_ACCESSORY1_STATS"));
  assert.equal(testi("A_DICASTES_SHOES_STATS2").length, 9);
  scegli(m, "A_JOB", 7); // Knight
  scegli(m, "A_acces1", costante(m, "EQUIPID").LIGHT_OF_EL_DICASTES);
  const dex = () => numero(m, "A_DEXp");
  const senza = dex();
  scegli(m, "A_DICASTES_ACCESSORY1_STATS", 7); // DEX +2
  scegli(m, "A_DICASTES_ACCESSORY1_STATS2", 7); // DEX +2
  assert.deepEqual([c.A_DICASTES_ACCESSORY1_STATS.value, c.A_DICASTES_ACCESSORY1_STATS2.value].map(Number), [7, 7]);
  assert.equal(dex() - senza, 4);
});

test("oggetti dagli screen del gioco: Gigantic Majestic Goat, Meteor Plate, Blood Sucker", () => {
  const m = creaMotore();
  const c = m.c;
  const valori = (campo) => c[campo].elenco().map((o) => Number(o.value));
  scegli(m, "A_JOB", 7); // Knight
  assert.ok(!valori("A_body").includes(id(m, "Meteor Plate")), "Meteor Plate solo ai rinati");
  scegli(m, "A_JOB", 21); // Lord Knight
  assert.ok(valori("A_body").includes(id(m, "Meteor Plate")));
  scegli(m, "A_BaseLV", 99);
  scegli(m, "A_JobLV", 50);
  const atk = () => m.bonusValues[17]; // BONUSID.ATK
  const senza = atk();
  scegli(m, "A_head1", id(m, "Gigantic Majestic Goat (ATK)"));
  assert.equal(atk() - senza, 14); // 50 * 2 / 7
  assert.equal(m.bonusValues[37], 12); // danno contro Demihuman
  scegli(m, "A_head1", id(m, "Gigantic Majestic Goat (DEF)"));
  assert.equal(atk() - senza, 14);
  assert.equal(m.bonusValues[57], 12); // resistenza a Demihuman
  scegli(m, "A_head3", id(m, "Blood Sucker"));
  assert.deepEqual([numero(m, "A_HPR"), numero(m, "A_SPR")], [0, 0]);
});

test("menu Classe: 6 sezioni, ogni classe una volta, scelta per valore", () => {
  const m = creaMotore();
  const v = m.c.A_JOB;
  assert.equal(v.figli.filter((f) => f.figli).length, 6);
  const valori = v.elenco().map((o) => Number(o.value));
  assert.deepEqual([...valori].sort((a, b) => a - b), [...Array(46).keys()]);
  scegli(m, "A_JOB", 20); // Super Novice, fra le espanse: posizione diversa dal valore
  assert.equal(m.n_A_JOB, 20);
  assert.equal(v.elenco()[v.selectedIndex].text, "Super Novice");
});

test("Grimtooth a distanza dal livello 4; Kiel D-01 +5% solo in mischia; Baphomet MaxSP +7%", () => {
  const m = creaMotore();
  scegli(m, "A_JOB", 8); // Assassin
  scegli(m, "A_weapon1", id(m, "Jur"));
  scegli(m, "A_ActiveSkill", 84); // Grimtooth
  scegli(m, "B_Enemy", 1);
  m.Buf6SW(1);
  const danni = (pet) => {
    scegli(m, "A8_Skill0", pet);
    m.A6(1); // il pannello legge i suoi campi
    m.StAllCalc();
    return [3, 4].map((lv) => (scegli(m, "A_ActiveSkillLV", lv), [m.n_rangedAtk, m.Last_DMG_A[2]]));
  };
  const senza = danni(0);
  const kiel = danni(100);
  assert.deepEqual(senza.map((d) => d[0]), [0, 1]);
  assert.equal(kiel[0][1], Math.floor((senza[0][1] * 105) / 100));
  assert.equal(kiel[1][1], senza[1][1]);
  scegli(m, "A_Kakutyou", 14); // +% ATK based Damage Modifiers
  assert.match(testo(m, "A_KakutyouData"), /\+5%\s*melee dmg/);
  scegli(m, "A_BaseLV", 99);
  m.Buf6SW(1);
  const sp = () => (m.A6(1), m.StAllCalc(), m.n_A_MaxSP);
  scegli(m, "A8_Skill0", 0);
  const spSenza = sp();
  scegli(m, "A8_Skill0", 102); // Baphomet: MaxSP +7%, danno a distanza +5%
  assert.equal(sp(), Math.floor((spSenza * 107) / 100));
  assert.equal(m.bonusValues[25], 5);
});

test("manuali di uaRO: Battle Manual +50% base e job, Field Manual solo base; niente Job Manual", () => {
  const m = creaMotore();
  scegli(m, "B_Enemy", 1);
  m.Buf6SW(1);
  assert.deepEqual([...m.c.A8_Skill1.elenco()].map((o) => Number(o.value)), [0, 2, 3, 4]);
  assert.equal(m.c.A8_Skill2, undefined);
  const exp = (manuale) => {
    scegli(m, "A8_Skill1", manuale);
    m.A6(1);
    m.StAllCalc();
    m.calc();
    return [numero(m, "B_16"), numero(m, "B_17")];
  };
  const [base, job] = exp(0);
  assert.deepEqual(exp(2), [Math.floor(base * 1.5), Math.floor(job * 1.5)]);
  assert.deepEqual(exp(3), [Math.floor(base * 1.5), job]);
  assert.deepEqual(exp(4), [base * 2, job]);
});

test("limite degli slot attivo di partenza: copricapo doppio e arma a due mani", () => {
  const m = creaMotore();
  assert.equal(m.c.restrict_equipslot.checked, true);
  scegli(m, "A_JOB", 7); // Knight
  scegli(m, "A_head1", id(m, "Crown of Deceit (UARO)")); // copricapo alto e centro
  assert.equal(m.c.A_head2.disabled, true);
  assert.equal(m.c.A_head2.value, "243"); // (no middle headgear)
  scegli(m, "A_weapon1", id(m, "Two-handed Sword"));
  assert.equal(m.c.A_left.disabled, true);
  assert.equal(m.c.A_left.value, "305"); // (no shield)
});

test("Garling Card: CRI +2, danno critico +5%, CRI +1 ogni 2 raffinamenti delle calzature", () => {
  const m = creaMotore();
  const garling = costante(m, "GARLING_CARD_UARO");
  assert.equal(costante(m, "m_Card")[garling][2], "Garling");
  assert.ok(costante(m, "m_CardSort")[6].includes(garling)); // fra le carte delle calzature
  scegli(m, "A_shoes", m.c.A_shoes.elenco()[1].value); // la prima calzatura che il Novice puo' usare
  const conCarta = (carta, raffinamento) => {
    scegli(m, "A_shoes_card", carta);
    scegli(m, "A_SHOES_REFINE", raffinamento);
    return [m.n_A_CRI, costante(m, "bonusValues")[costante(m, "BONUSID").CRIT_DMG_PERCENT]];
  };
  const [cri, danno] = conCarta(0, 0);
  assert.deepEqual(conCarta(garling, 0), [cri + 2, danno + 5]);
  assert.deepEqual(conCarta(garling, 5), [cri + 4, danno + 5]);
  assert.deepEqual(conCarta(garling, 9), [cri + 6, danno + 5]);
});

test("Garling: mostro dell'evento Halloween 2026 con i dati di @mi", () => {
  const m = creaMotore();
  const mostri = costante(m, "m_Monster");
  const garling = mostri.findIndex((x) => x[1] === "Garling");
  assert.equal(garling, mostri.length - 1);
  assert.equal(costante(m, "EnemyNum"), garling);
  assert.ok(costante(m, "v_MonsterSort").includes(garling));
  scegli(m, "B_Enemy", garling);
  assert.deepEqual(["B_6", "B_12", "B_13", "B_14", "B_16", "B_17"].map((id) => testo(m, id)), ["5800", "420", "620", "22", "2300", "1600"]);
});

test("armi di Halloween 2026: The Ripper, Witch's Broom, Jack O' Rush", () => {
  const m = creaMotore();
  const bonus = (nome) => costante(m, "bonusValues")[costante(m, "BONUSID")[nome]];
  const skill = (s) => (scegli(m, "A_ActiveSkill", s), costante(m, "bonusSkill")(s));
  const arma = (job, nome) => {
    scegli(m, "A_JOB", job);
    const i = id(m, nome);
    assert.ok(m.c.A_weapon1.elenco().some((o) => o.value == i), `${nome} fra le armi`);
    scegli(m, "A_weapon1", i);
    assert.equal(costante(m, "itemData")[i].slots, 1);
  };
  const raff = (r) => scegli(m, "A_Weapon_refine", r);

  arma(8, "The Ripper"); // Assassin
  raff(0);
  const [critico, aspd] = [bonus("CRIT_DMG_PERCENT"), bonus("ASPD")];
  assert.equal(skill(83), 0); // Sonic Blow: il +5% base e' nei bonus dell'oggetto (5083)
  raff(5);
  assert.equal(skill(83), 10);
  raff(7);
  assert.equal(bonus("CRIT_DMG_PERCENT"), critico + 5);
  raff(10);
  assert.deepEqual([skill(83), bonus("CRIT_DMG_PERCENT"), bonus("ASPD")], [20, critico + 5, aspd + 5]);

  arma(5, "Witch's Broom"); // Magician
  raff(0);
  const [lancio, formless] = [bonus("CAST_TIME_PERCENT"), costante(m, "bonusValues")[170]];
  assert.equal(formless, 5);
  raff(9);
  assert.deepEqual([bonus("CAST_TIME_PERCENT"), costante(m, "bonusValues")[170]], [lancio - 5, 10]);
  assert.match(m.descrizioneOggetto(id(m, "Witch's Broom")), /3% chance to cast \[Quagmire\] Lvl 1/);

  arma(20, "Jack O' Rush"); // Super Novice
  raff(0);
  const [atk, undead] = [bonus("ATK"), bonus("DMG_UNDEAD_PERCENT")];
  assert.equal(skill(6), 0); // Bash: il +20% base e' nei bonus dell'oggetto (5006)
  raff(6);
  assert.deepEqual([skill(6), bonus("ATK")], [10, atk + 20]);
  raff(9);
  assert.deepEqual([skill(6), bonus("ATK"), bonus("DMG_UNDEAD_PERCENT"), bonus("DMG_DEMON_PERCENT")], [30, atk + 30, undead + 10, 10]);
  arma(0, "Jack O' Rush"); // Novice
});
