// Importa da esterno: le build del calcolatore di Bish (rocalc-temp.web.app, versione 13) e di
// Thrice (uaro-calc.xdthrice.workers.dev, versione 18) caricate e riscritte nel nostro formato.
// I due link d'esempio sono quelli mandati da Alberto il 24/10/2026; i campi attesi sono quelli
// che mostrano i due calcolatori aprendoli.
import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { creaMotore } from "./motore.mjs";

const BISH =
  "https://rocalc-temp.web.app/#liw'J'fi''Ji''Ji'ixy.ii'F.iDiDiDiCc,9o-iiy=iicsn$a$rndCoe'zlK'KlK'KifcciiO4ci.i....d...2'..0'1pii.ii.30Caj.7W.3iidik2''B3iii'iii.iisiiv5.iisiiv3336'339'6F'4cwdiiig7.iii";
const THRICE =
  "https://uaro-calc.xdthrice.workers.dev/#qiu'J'g'Ji''qi&i'i'ijii'Qfititiqiic,9lta;sBiilirka$rncrCkiifgiiojiihffeiib4cihi..dd.dd'2'..4Ciigi'ii'4ci'1'diiid3i''f3iii'iii.iisiiv5.iisiiv3333330s5eo.iiihv6.i.3";
const CIFRE = "i'abcdefgh.jklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-:;,=$&+";

// la build importata, riaperta in un motore nuovo come fa la pagina: nome del campo -> testo
function apri(build) {
  const m = creaMotore();
  assert.equal(m.leggiBuild(build), true);
  return (nome) => {
    const f = m.c[nome];
    return f.elenco()[f.selectedIndex].text;
  };
}
const campi = (testo, nomi) => Object.fromEntries(nomi.map((n) => [n, testo(n)]));
// le sequenze di "i" accorciate in cifre, distese: le posizioni tornano quelle del formato
const distendi = (b) => b.replace(/[0-9]/g, (d) => "i".repeat(d <= 3 ? +d + 10 : +d));
const numero = (n, larghezza) =>
  larghezza == 2 ? CIFRE[Math.floor(n / 62)] + CIFRE[n % 62] : CIFRE[n];
const metti = (b, pos, valore, larghezza = 1) =>
  b.slice(0, pos) + numero(valore, larghezza) + b.slice(pos + larghezza);

test("Bish: lo Sniper dell'esempio, tutto caricato, il mostro con il suo numero tradotto", () => {
  const r = creaMotore().importaBuild(BISH);
  assert.equal(r.calcolatore, "rocalc (Bish)");
  assert.deepEqual([...r.nonCaricati], []);
  assert.equal(CIFRE.indexOf(r.build[0]), 40);
  const testo = apri(r.build);
  assert.deepEqual(campi(testo, ["A_JOB", "A_weapon1", "A_Weapon_refine", "A_weapon1_card1", "A_weapon1_card4", "A_head1", "A_body", "A_acces1_card", "B_Enemy"]), {
    A_JOB: "Sniper",
    A_weapon1: "Composite Bow [3/4]",
    A_Weapon_refine: "+10",
    A_weapon1_card1: "Abysmal Knight",
    A_weapon1_card4: "Minorous",
    A_head1: "Festival Pumpkin Hat (UARO)",
    A_body: "Armor of Naga [1]",
    A_acces1_card: "Zerom",
    // in Bish e' il mostro 595, da noi un altro numero
    B_Enemy: "Wounded Morroc",
  });
});

test("Thrice: l'Assassin Cross dell'esempio, tutto caricato", () => {
  const r = creaMotore().importaBuild(THRICE);
  assert.equal(r.calcolatore, "uaro-calc (Thrice)");
  assert.deepEqual([...r.nonCaricati], []);
  const testo = apri(r.build);
  assert.deepEqual(campi(testo, ["A_JOB", "A_weapon1", "A_weapon1_card1", "A_head2", "A_shoes", "B_Enemy", "A_ActiveSkillLV"]), {
    A_JOB: "Assassin Cross",
    A_weapon1: "Katar of Piercing Wind [0/3]",
    A_weapon1_card1: "Drainliar",
    A_head2: "Angel Spirit (UARO)",
    A_shoes: "Temporal STR Boots (UARO) [1]",
    B_Enemy: "Chen (UARO)",
    A_ActiveSkillLV: "Lvl 10",
  });
});

test("Bish: un copricapo che da noi non c'e' resta vuoto e si elenca", () => {
  // Bao Bao, oggetto 145 di Bish, come copricapo alto (posizione 45)
  const link = "https://rocalc-temp.web.app/#" + metti(distendi(BISH.split("#")[1]), 45, 145, 2);
  const r = creaMotore().importaBuild(link);
  assert.deepEqual(JSON.parse(JSON.stringify(r.nonCaricati)), [
    { tipo: "oggetto", campo: "A_head1", nome: "Bao Bao", motivo: "assente" },
  ]);
  const testo = apri(r.build);
  assert.equal(testo("A_head1"), "(no upper headgear)");
  assert.equal(testo("A_weapon1"), "Composite Bow [3/4]");
});

test("Thrice: Bastion da 6 * copricapo + calzature; un Dicastes oltre +2 non si carica", () => {
  const m = creaMotore();
  const scegli = (nome, valore) => (m.scegli(m.c[nome], String(valore)), m.calc());
  scegli("A_JOB", 7); // Knight
  scegli("A_acces1", vm.runInContext("EQUIPID.LIGHT_OF_EL_DICASTES", m));
  scegli("A_DICASTES_ACCESSORY1_STATS", 6); // DEX +1
  let b = distendi(String(m.scriviBuild()));
  b = metti(b, 0, 18);
  b = metti(b, 84, 6 * 2 + 3, 2); // Bastion 2 sul copricapo, 3 sulle calzature
  // ACCESSORY1_STATS, sesto dei dodici Dicastes in fondo: DEX +4, che da noi non c'e'
  b = metti(b, b.length - 12 + 5, 9);
  const r = creaMotore().importaBuild("https://uaro-calc.xdthrice.workers.dev/#" + b);
  assert.deepEqual(JSON.parse(JSON.stringify(r.nonCaricati)), [
    { tipo: "dicastes", campo: "A_DICASTES_ACCESSORY1_STATS", nome: "DEX +4", motivo: "non valido" },
  ]);
  const n = creaMotore();
  assert.equal(n.leggiBuild(r.build), true);
  assert.deepEqual([n.c.A_BASTION_HEAD.value, n.c.A_BASTION_SHOES.value].map(Number), [2, 3]);
  assert.equal(n.c.A_acces1.value, String(vm.runInContext("EQUIPID.LIGHT_OF_EL_DICASTES", m)));
});

test("link non riconosciuti: altro sito, versione diversa, la nostra build", () => {
  const m = creaMotore();
  const nostra = String(m.scriviBuild());
  for (const link of [
    "https://example.com/#" + BISH.split("#")[1],
    "https://rocalc-temp.web.app/#" + THRICE.split("#")[1],
    "https://uaro-calc.xdthrice.workers.dev/#" + nostra,
    nostra,
    "",
  ])
    assert.equal(m.importaBuild(link), null, link.slice(0, 50));
  // senza indirizzo vale la versione
  assert.equal(m.importaBuild(BISH.split("#")[1]).calcolatore, "rocalc (Bish)");
});
