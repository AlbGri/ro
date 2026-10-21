// Le correzioni per uaRO e le parti nostre del motore che le build registrate non coprono:
// ogni prova parte da un motore nuovo e sceglie i campi come una persona.
import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { creaMotore } from "./motore.mjs";

// imposta un campo ed esegue il suo gestore, poi ricalcola
function scegli(m, nome, valore) {
  const v = m.documento.calcForm[nome];
  assert.ok(v, "campo " + nome);
  if (v.type === "checkbox") v.checked = valore;
  else v.value = String(valore);
  if (v.tag === "select") assert.equal(v.value, String(valore), `${nome}: opzione ${valore} assente`);
  const codice = (v.getAttribute("onchange") || v.getAttribute("onclick") || "")
    .replace(/this\[this\.selectedIndex\]\.value/g, JSON.stringify(String(valore)));
  vm.runInContext("(function () {" + codice + "\n})()", m);
  m.calc();
}
const testo = (m, id) => m.documento.testo(id);
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
  scegli(m, "A_head1", m.documento.calcForm.A_head1.options[0].value);
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
  const elenco = (campo) => [...m.documento.calcForm[campo].options].map((o) => o.text);
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
  const testi = [...m.documento.calcForm.A_BASTION_HEAD.options].map((o) => o.text);
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
  const c = n.documento.calcForm;
  assert.deepEqual([c.A_JOB.value, c.A_BASTION_HEAD.value, c.A_BASTION_SHOES.value].map(Number),
    [23, costante(m, "BASTIONENCHANTID").SP_CONSUMPTION, costante(m, "BASTIONENCHANTID").MOVEMENT_SPEED]);
  // la stessa build con la versione 18 del calcolatore di Thrice nel primo carattere
  const [okThrice, t] = carica("q" + build.slice(1));
  assert.equal(okThrice, false);
  assert.equal(Number(t.documento.calcForm.A_JOB.value), 0);
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
  const c = m.documento.calcForm;
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
  const c = m.documento.calcForm;
  const valori = (campo) => c[campo]._lista().map((o) => Number(o.value));
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
  const v = m.documento.calcForm.A_JOB;
  assert.equal(v.figli.filter((f) => f.tag === "optgroup").length, 6);
  const valori = v._lista().map((o) => Number(o.value));
  assert.deepEqual([...valori].sort((a, b) => a - b), [...Array(46).keys()]);
  scegli(m, "A_JOB", 20); // Super Novice, fra le espanse: posizione diversa dal valore
  assert.equal(m.n_A_JOB, 20);
  assert.equal(v._lista()[v.selectedIndex].text, "Super Novice");
});
