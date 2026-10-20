// Le correzioni per uaRO (motore/uaro.js, strumenti/modifiche.mjs) che le build registrate non
// coprono: ogni prova parte da un motore nuovo e sceglie i campi come una persona.
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
const id = (m, nome) => m.m_Item.findIndex((r) => r[8] === nome);

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
  const spada = m.m_Item.findIndex((r) => r[1] == 2 && r[8] === "Sword");
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

test("Back Stab: ricarica fissa di 0,333 secondi", () => {
  const m = creaMotore();
  scegli(m, "A_JOB", 14); // Rogue
  scegli(m, "A_ActiveSkill", 169);
  // la ricarica e' fissa; il ritardo mostrato e' il piu' lungo fra lei e quello dell'ASPD
  assert.equal(m.n_Delay[3], 0.333);
  assert.equal(m.n_Delay[2], 0);
});
