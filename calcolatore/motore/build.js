// Formato della build, il testo dopo # nell'indirizzo: scriviBuild lo produce, leggiBuild lo
// carica nel motore.
//
// Ogni numero e' scritto in base 62 con le cifre di CIFRE_BUILD, in 1, 2 o 3 caratteri; un
// valore che non ci sta diventa 0. Le sequenze di "i" (lo zero) si accorciano: 4-9 "i" diventano
// la cifra 4-9, 10-13 "i" le cifre 0-3. Il primo carattere e' la versione.
//
// Il formato discende da quello del calcolatore di Thrice (versioni 10-18), ma e' di questo
// calcolatore: si parte da 40 perche' i due non si confondano, e si caricano solo le build di
// questa versione. Rispetto alla 18 cambia la coppia degli incantamenti Bastion (8 * copricapo +
// calzature, non 6 *). Le posizioni fisse vanno da 0 a 109, poi vengono le sezioni dei buff,
// ognuna con un carattere 1/0 di presenza (o un gruppo di presenze), e infine la coda.
var FORMATO_BUILD = 40;
var CIFRE_BUILD = "i'abcdefgh.jklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-:;,=$&+";

// Campi delle sezioni, nell'ordine in cui stanno nel testo: un numero e' l'indice di un valore
// di un carattere, L(i, n) un valore di n caratteri, C(a, b) una coppia in un carattere
// (6 * a + b), B(a, b, c, d, e) cinque interruttori in un carattere (16, 8, 4, 2, 1).
// null e' un posto che si scrive a 0 e non si legge.
function L(i, n) {
  return { i: i, n: n };
}
function C(a, b) {
  return { coppia: [a, b] };
}
function B() {
  return { bit: [].slice.call(arguments) };
}
function lunghi(da, a, n) {
  for (var out = [], i = da; i <= a; i++) out.push(L(i, n));
  return out;
}
// array: nome della variabile globale; presenza: indici da 0 a presenza-1 che, se uno non e' 0,
// fanno scrivere la sezione (alcuni non vengono salvati, come nell'originale)
// prettier-ignore
var SEZIONI_BUILD = {
  // skill di supporto e del party
  buf2: { array: "n_A_Buf2", presenza: 22, campi: [
    0, 1, 4, 9, 13, 14, C(2, 6), C(10, 11), C(12, 15), B(3, 5, 7, 8, 16), B(17, 18, 19, 20, 21),
  ] },
  // debuff sul nemico
  debuffNemico: { array: "n_B_debuf", presenza: 25, campi: [
    0, C(1, 18), B(2, 3, 4, 5, 6), B(7, 8, 9, 10, 19), 11, 12, B(13, 14, 15, 16, 17),
    B(20, 21, 22, null, null), C(23, 24),
  ] },
  // buff del nemico
  buffNemico: { array: "n_B_buf", presenza: 15, campi: [
    0, B(1, 2, 3, 4, 9), L(6, 2), C(7, 8), 5, 10, 11, 12, 13, 14,
  ] },
  // canti e danze
  buf3: { array: "n_A_Buf3", presenza: 37, campi: [
    0, 1, 2, 3, 4, 5, 6, C(7, 8), C(9, 10), B(11, 18, null, null, null),
    L(12, 2), L(13, 2), L(14, 2), L(15, 2), L(16, 2), L(17, 2), L(20, 2), 30, L(21, 2), 31,
    L(22, 2), L(29, 2), 32, L(23, 2), 33, L(24, 2), 34, L(25, 2), 35, L(26, 2), 36, L(19, 2),
    37, L(38, 2), L(39, 2), 27,
  ] },
  // skill di gilda (stesso array dei canti, indici 40-44)
  buf4: { array: "n_A_Buf3", da: 40, presenza: 45, campi: [
    B(40, null, null, null, null), C(41, 42), C(43, 44),
  ] },
  // altri effetti sul personaggio
  buf6: { array: "n_A_Buf6", presenza: 24, campi: [
    5, 20, C(0, 1), C(2, 4), C(18, 19), B(3, 6, 7, 8, 9), B(10, 11, 12, 13, 14),
    B(15, 16, 17, 21, 22),
  ] },
  // cibo, pozioni e altri oggetti
  buf7: { array: "n_A_Buf7", presenza: 61, campi: [
    3, 4, 5, 6, 7, 8, C(35, 42), C(39, 40), B(0, 1, 2, 9, 10), B(11, 12, 13, 14, null),
    B(16, 17, 18, 19, 20), B(21, 22, 23, 24, 25), B(26, 27, 28, 29, 30), B(31, 32, 33, 34, 36),
    B(37, 38, 41, null, 44), B(45, 46, 47, 48, 49), B(50, 51, 52, 53, 54), 55,
    B(56, null, null, null, null),
  ] },
  buf8: { array: "n_A_Buf8", presenza: 12, campi: [
    L(0, 2), L(3, 2), L(7, 2), L(8, 2), L(9, 2), L(10, 2), L(11, 2), 5, 6, C(1, null),
    B(2, null, null, null, null),
  ] },
  // incantamenti aggiuntivi e modifiche manuali al personaggio
  buf9: { array: "n_A_Buf9", presenza: 60, campi: [
    0, L(1, 2), 2, L(3, 2), 4, L(5, 2), 6, L(7, 2), 8, L(9, 2), 10, L(11, 2), 12, L(13, 2), 14,
    L(15, 2), 16, L(17, 2), 18, L(19, 2), L(20, 2), L(21, 2), L(22, 2), L(23, 2), 24, L(25, 2),
    L(26, 2), L(27, 2), L(28, 2), L(30, 3),
  ].concat(lunghi(31, 59, 2)) },
  // modifiche manuali al nemico
  manualeNemico: { array: "n_B_manual", presenza: 56, campi: [
    L(1, 2), 2, L(3, 2), 4, L(5, 2), L(7, 2), L(9, 2), L(21, 2), L(30, 3), L(31, 2),
  ].concat(lunghi(34, 39, 2), [L(40, 3), L(41, 2), L(42, 3), L(43, 3), L(44, 2)],
    lunghi(48, 52, 2), [L(53, 3), L(54, 2), L(55, 2)]) },
};
// campi della coda letti e scritti cosi' come sono, nell'ordine (dopo la skill del nemico)
// prettier-ignore
var CODA_DICASTES = [
  "SHOULDER_PRIMARY", "SHOULDER_STATS", "SHOES_PRIMARY", "SHOES_STATS", "ACCESSORY1_PRIMARY",
  "ACCESSORY1_STATS", "ACCESSORY2_PRIMARY", "ACCESSORY2_STATS", "SHOULDER_STATS2", "SHOES_STATS2",
  "ACCESSORY1_STATS2", "ACCESSORY2_STATS2",
];
// equipaggiamento dalla posizione 45: [campo, larghezza]
// prettier-ignore
var EQUIP_BUILD = [
  ["A_head1", 2], ["A_head1_card", 2], ["A_head2", 2], ["A_head2_card", 2], ["A_head3", 2],
  ["A_body", 2], ["A_body_card", 2], ["A_shoulder", 2], ["A_shoulder_card", 2], ["A_shoes", 2],
  ["A_shoes_card", 2], ["A_acces1", 2], ["A_acces1_card", 2], ["A_acces2", 2],
  ["A_acces2_card", 2], ["A_HEAD_REFINE", 1], ["A_BODY_REFINE", 1], ["A_SHOULDER_REFINE", 1],
  ["A_SHOES_REFINE", 1],
];
// skill del nemico che hanno un secondo valore (BSkillSubNum)
var SKILL_NEMICO_CON_VALORE = [444, 445, 125, 131];

function cifraBuild(k) {
  k = Number(k);
  return k >= 0 && k < 62 && k % 1 == 0 ? CIFRE_BUILD.charAt(k) : "i";
}
function numeroBuild(n, larghezza) {
  n = Number(n);
  if (larghezza == 3)
    return (
      cifraBuild(Math.floor(n / 3844)) +
      cifraBuild(Math.floor((n % 3844) / 62)) +
      cifraBuild(n % 62)
    );
  if (larghezza == 2) return cifraBuild(Math.floor(n / 62)) + cifraBuild(n % 62);
  return cifraBuild(n);
}
function bitBuild(a, b, c, d, e) {
  return cifraBuild(
    (a == 1 ? 16 : 0) + (b == 1 ? 8 : 0) + (c == 1 ? 4 : 0) + (d == 1 ? 2 : 0) + (e == 1 ? 1 : 0),
  );
}
function haValori(sezione) {
  var v = window[sezione.array];
  for (var i = sezione.da || 0; i < sezione.presenza; i++) if (v[i] != 0) return true;
  return false;
}
function scriviSezione(sezione) {
  var v = window[sezione.array],
    valore = (k) => (k == null ? 0 : v[k]);
  return sezione.campi
    .map((f) =>
      typeof f == "number"
        ? numeroBuild(v[f], 1)
        : f.coppia
          ? numeroBuild(6 * valore(f.coppia[0]) + valore(f.coppia[1]), 1)
          : f.bit
            ? bitBuild.apply(null, f.bit.map(valore))
            : numeroBuild(v[f.i], f.n),
    )
    .join("");
}

// La build corrente nel formato dell'indirizzo
function scriviBuild() {
  calc();
  var testa = [];
  for (var k = 0; k <= 109; k++) testa[k] = "i";
  var metti = (pos, valore, larghezza) => {
    var s = numeroBuild(valore, larghezza);
    for (var k = 0; k < s.length; k++) testa[pos + k] = s[k];
  };
  metti(0, FORMATO_BUILD, 1);
  metti(1, c.A_JOB.value, 2);
  metti(3, c.A_BaseLV.value, 2);
  metti(5, c.A_JobLV.value, 2);
  ["A_STR", "A_AGI", "A_VIT", "A_DEX", "A_INT", "A_LUK"].forEach((campo, k) =>
    metti(7 + 2 * k, c[campo].value, 2),
  );
  metti(19, 10 * n_A_Buf7[35] + 1 * c.A_Weapon_element.value, 1);
  metti(20, itemData[c.A_weapon1.value].equipType, 1);
  if (n_Nitou) metti(21, itemData[c.A_weapon2.value].equipType, 1);
  if (n_A_JobClass() == 2 || n_A_JobClass() == 4 || (n_A_JOB == 45 && n_A_WeaponType != 0))
    metti(22, c.A_Arrow.value, 1);
  metti(23, c.A_weapon1.value, 2);
  metti(25, c.A_Weapon_refine.value, 1);
  for (k = 1; k <= 4; k++) metti(24 + 2 * k, c["A_weapon1_card" + k].value, 2);
  if (n_Nitou) {
    metti(34, c.A_weapon2.value, 2);
    metti(36, c.A_Weapon2_refine.value, 1);
    for (k = 1; k <= 4; k++) metti(35 + 2 * k, c["A_weapon2_card" + k].value, 2);
  } else {
    metti(34, c.A_left.value, 2);
    metti(36, c.A_LEFT_REFINE.value, 1);
    metti(37, c.A_left_card.value, 2);
  }
  var pos = 45;
  for (var [campo, larghezza] of EQUIP_BUILD) {
    metti(pos, c[campo].value, larghezza);
    pos += larghezza;
  }
  testa[79] = bitBuild(c.A_adopted.checked, 0, 0, 0, 0);
  metti(80, c.A_HSE.value, 2);
  metti(82, c.A_HSE_HEAD1.value, 2);
  metti(84, 8 * c.A_BASTION_HEAD.value + 1 * c.A_BASTION_SHOES.value, 2);
  testa[86] = bitBuild(
    0,
    c.all_dmgSkills.checked,
    c.restrict_jobequip.checked,
    c.restrict_lvlequip.checked,
    c.restrict_equipslot.checked,
  );
  testa[87] = bitBuild(c.restrict_cardslot.checked, c.all_card.checked, 0, 0, 0);
  // skill passive: quante (posizione 88) e i loro livelli dalla 89. Come nell'originale, una
  // classe senza 999 fra le prime 20 voci di m_JobBuff scrive le skill ma non quante sono
  n_A_JobSet();
  var fine = m_JobBuff[n_A_JOB].slice(0, 20).indexOf(999);
  for (k = 0; k < (fine < 0 ? 20 : fine); k++)
    metti(89 + k, documento.getElementById("A_skill" + k).value, 1);
  if (fine >= 0) metti(88, fine, 1);

  var S = SEZIONI_BUILD,
    parti = [testa.join("")];
  for (var nome of ["buf2", "debuffNemico", "buffNemico"])
    parti.push(haValori(S[nome]) ? "'" + scriviSezione(S[nome]) : "i");
  var presenti = [haValori(S.buf3), haValori(S.buf4), false, haValori(S.buf6), haValori(S.buf7)];
  parti.push(bitBuild.apply(null, presenti.map(Number)));
  [S.buf3, S.buf4, null, S.buf6, S.buf7].forEach(
    (s, k) => presenti[k] && parti.push(scriviSezione(s)),
  );
  for (nome of ["buf8", "buf9", "manualeNemico"])
    parti.push(haValori(S[nome]) ? "'" + scriviSezione(S[nome]) : "i");

  var coda = [
    numeroBuild(c.Conf01.value, 2),
    numeroBuild(c.B_num.value, 1),
    numeroBuild(c.A8_Skill14.value, 1),
    numeroBuild(c.A8_Skill15.value, 2),
    "i",
    numeroBuild(c.A_ActiveSkill.value, 2),
    numeroBuild(c.A_ActiveSkillLV.value, 1),
    numeroBuild(c.SkillSubNum ? c.SkillSubNum.value : 0, 3),
    numeroBuild(targetData[0], 2),
    numeroBuild(c.B_AtkSkill.value, 2),
    numeroBuild(SKILL_NEMICO_CON_VALORE.includes(n_B_AtkSkill) ? c.BSkillSubNum.value : 0, 3),
    numeroBuild(c.B_AtkRange.value, 1),
    numeroBuild(c.B_AtkElem.value, 1),
    "i",
    // posto del server nel formato dell'originale: sempre uaRO
    numeroBuild(10, 1),
    numeroBuild(c.maxASPD.value, 1),
  ].concat(CODA_DICASTES.map((nome) => numeroBuild(c["A_DICASTES_" + nome].value, 1)));
  return (parti.join("") + coda.join(""))
    .replace(/i{13}/g, "3")
    .replace(/i{12}/g, "2")
    .replace(/i{11}/g, "1")
    .replace(/i{10}/g, "0")
    .replace(/i{4,9}/g, (s) => String(s.length));
}

// true se la build e' nel formato di questo calcolatore
function buildValida(build) {
  return CIFRE_BUILD.indexOf(String(build).charAt(0)) == FORMATO_BUILD;
}

// Carica una build nel motore; una build di un altro formato non si carica e la funzione
// restituisce false. I gestori dei campi (ClickJob, ClickWeaponType...) si chiamano nello stesso
// ordine dell'originale, perche' ognuno prepara gli elenchi che servono ai campi seguenti
function leggiBuild(build) {
  if (!build) return false;
  // "undefined" lo scriveva l'originale al posto di un valore che non ci stava
  build = String(build)
    .replace(/undefined/g, "i")
    .replace(/%(24|26|27|2B|2C|3A|3B|3D)/g, decodeURIComponent);
  if (!buildValida(build)) return false;
  var t = build.replace(/[0-9]/g, (d) => "i".repeat(d <= 3 ? +d + 10 : +d));
  var x = (pos, larghezza) => {
    for (var n = 0, k = 0; k < (larghezza || 1); k++)
      n = 62 * n + Math.max(0, CIFRE_BUILD.indexOf(t.charAt(pos + k)));
    return n;
  };
  var bit = (v) => [
    Math.floor(v / 16),
    Math.floor((v % 16) / 8),
    Math.floor((v % 8) / 4),
    Math.floor((v % 4) / 2),
    v % 2,
  ];

  for (var a = 0; a <= 21; a++) n_A_Buf2[a] = 0;
  for (a = 0; a <= 45; a++) n_A_Buf3[a] = 0;
  for (a = 0; a <= 23; a++) n_A_Buf6[a] = 0;
  for (a = 0; a <= 60; a++) n_A_Buf7[a] = 0;
  for (a = 0; a <= 15; a++) n_A_Buf8[a] = 0;
  for (a = 0; a <= 57; a++) n_A_Buf9[a] = 0;
  for (a = 0; a <= 55; a++) n_B_manual[a] = 0;
  for (a = 0; a <= 3; a++) n_A_debuf[a] = 0;
  for (a = 0; a <= 24; a++) n_B_debuf[a] = 0;
  for (a = 0; a <= 14; a++) n_B_buf[a] = 0;
  n_A_Buf9[2] = 10;
  n_A_Buf9[4] = 20;
  n_A_Buf9[6] = 23;
  n_A_Buf9[10] = 10;
  n_A_Buf9[12] = 20;
  n_A_Buf9[14] = 23;
  c.A_BASTION_HEAD.value = BASTIONENCHANTID.NONE;
  c.A_BASTION_SHOES.value = BASTIONENCHANTID.NONE;
  ResetDicastesEnchantControls();
  refreshFields();

  var classe = x(1, 2);
  // Super Novice con il livello 99 della skill passiva 9: puo' usare tutte le armi
  SuperNoviceFullWeaponCHECK = classe == 20 && x(98) ? 1 : 0;
  var f = bit(x(86));
  c.all_dmgSkills.checked = f[1];
  c.restrict_jobequip.checked = f[2];
  c.restrict_lvlequip.checked = f[3];
  c.restrict_equipslot.checked = f[4];
  f = bit(x(87));
  c.restrict_cardslot.checked = f[0];
  c.all_card.checked = f[1];
  if (c.all_card.checked) allCard();
  restrictCardslot(0);
  c.maxASPD.value = 0;
  c.A_JOB.value = classe;
  ClickJob(classe, 2);
  c.A_BaseLV.value = x(3, 2);
  c.A_JobLV.value = x(5, 2);
  ["A_STR", "A_AGI", "A_VIT", "A_DEX", "A_INT", "A_LUK"].forEach(
    (campo, k) => (c[campo].value = x(7 + 2 * k, 2)),
  );
  n_A_Buf7[35] = Math.floor(x(19) / 10);
  c.A_Weapon_element.value = x(19) % 10;
  var arma = x(23, 2);
  c.A_weapon1.value = arma;
  n_A_WeaponType = x(20);
  ClickWeaponType(n_A_WeaponType);
  // Assassin e Assassin Cross possono avere due armi
  if ((c.A_JOB.value == 8 || c.A_JOB.value == 22) && n_A_WeaponType != 11) {
    n_A_Weapon2Type = x(21);
    ClickWeaponType2(n_A_Weapon2Type);
  }
  n_A_JobSet();
  if (n_A_JobClass() == 2 || n_A_JobClass() == 4 || (n_A_JOB == 45 && n_A_WeaponType != 0))
    c.A_Arrow.value = x(22);
  ClickB_Item(arma);
  c.A_Weapon_refine.value = x(25);
  for (var k = 1; k <= 4; k++) c["A_weapon1_card" + k].value = x(24 + 2 * k, 2);
  if (n_Nitou) {
    c.A_weapon2.value = x(34, 2);
    c.A_Weapon2_refine.value = x(36);
    for (k = 1; k <= 4; k++) c["A_weapon2_card" + k].value = x(35 + 2 * k, 2);
    c.A_left.value = 305;
    c.A_LEFT_REFINE.value = 0;
    c.A_left_card.value = 0;
  } else {
    c.A_left.value = x(34, 2);
    c.A_LEFT_REFINE.value = x(36);
    c.A_left_card.value = x(37, 2);
  }
  var pos = 45;
  for (var [campo, larghezza] of EQUIP_BUILD) {
    c[campo].value = x(pos, larghezza);
    pos += larghezza;
  }
  // un oggetto che la classe non indossa (l'originale lo lasciava negli elenchi, vedi
  // WeaponSet2) torna alla voce vuota
  for (campo of ELENCHI_ARMATURE) if (c[campo].selectedIndex < 0) c[campo].selectedIndex = 0;
  c.A_adopted.checked = bit(x(79))[0];
  c.A_HSE.value = x(80, 2);
  c.A_HSE_HEAD1.value = x(82, 2);
  c.A_BASTION_HEAD.value = Math.floor(x(84, 2) / 8);
  c.A_BASTION_SHOES.value = x(84, 2) % 8;
  for (k = 0; k < x(88); k++) documento.getElementById("A_skill" + k).value = x(89 + k);

  // sezioni dei buff, in sequenza dalla posizione 110
  var p = 110;
  var leggiSezione = (sezione) => {
    var v = window[sezione.array];
    for (var f of sezione.campi) {
      if (typeof f == "number") v[f] = x(p++);
      else if (f.coppia) {
        var n = x(p++);
        v[f.coppia[0]] = Math.floor(n / 6);
        if (f.coppia[1] != null) v[f.coppia[1]] = n % 6;
      } else if (f.bit) {
        var b = bit(x(p++));
        f.bit.forEach((i, k) => i != null && (v[i] = b[k]));
      } else {
        v[f.i] = x(p, f.n);
        p += f.n;
      }
    }
  };
  var S = SEZIONI_BUILD;
  var conPresenza = (sezione) => x(p++) == 1 && leggiSezione(sezione);
  BufSW(0);
  conPresenza(S.buf2);
  debufSW(0);
  conPresenza(S.debuffNemico);
  EnemyBufSW(0);
  conPresenza(S.buffNemico);
  var presenti = bit(x(p++));
  Buf3SW(0);
  presenti[0] && leggiSezione(S.buf3);
  Buf4SW(0);
  presenti[1] && leggiSezione(S.buf4);
  Buf6SW(0);
  presenti[3] && leggiSezione(S.buf6);
  Buf7SW(0);
  presenti[4] && leggiSezione(S.buf7);
  Buf6SW(0);
  conPresenza(S.buf8);
  Buf9SW(0);
  conPresenza(S.buf9);
  Buf10SW(0);
  conPresenza(S.manualeNemico);

  // coda: condizioni, skill, nemico, Dicastes
  c.Conf01.value = x(p, 2);
  c.B_num.value = x(p + 2);
  c.A8_Skill14.value = x(p + 3);
  c.A8_Skill15.value = x(p + 4, 2);
  StCalc(1);
  ActiveSkillSetPlus();
  c.A_ActiveSkill.value = baseSkillId(x(p + 7, 2));
  ClickActiveSkill();
  c.A_ActiveSkillLV.value = x(p + 9);
  var valoreSkill = x(p + 10, 3);
  if (c.SkillSubNum) c.SkillSubNum.value = valoreSkill;
  // Double Bolt (skill passiva 441): la scelta della probabilita' la crea questa skill. Il
  // livello e' il testo del campo, come nell'originale: anche "0" conta
  var doppio = m_JobBuff[n_A_JOB].slice(0, 21).indexOf(441) >= 0 && c.A_skill6.value;
  var bolt = [
    SKILLID.FIRE_BOLT,
    SKILLID.COLD_BOLT,
    SKILLID.LIGHTNING_BOLT,
    SKILLID.FIRE_BOLT_HINDSIGHT,
    SKILLID.COLD_BOLT_HINDSIGHT,
    SKILLID.LIGHTNING_BOLT_HINDSIGHT,
  ];
  if (doppio && bolt.includes(n_A_ActiveSkill)) {
    var r = 1 * doppio + 3;
    myInnerHtml(
      "AASkill",
      'Double Bolt chance: <select name="SkillSubNum" onChange="calc()"></select>',
      0,
    );
    c.SkillSubNum.options[0] = new documento.Opzione("No chance (0%)", 0);
    c.SkillSubNum.options[1] = new documento.Opzione("Average chance (" + 10 * r + "%)", r);
    c.SkillSubNum.options[2] = new documento.Opzione("Max chance (100%)", 10);
    c.SkillSubNum.value = valoreSkill;
  }
  var mostro = normalizeSavedMonsterId(x(p + 13, 2));
  targetData[0] = mostro;
  c.B_Enemy.value = mostro;
  calc();
  Bskill();
  c.B_AtkSkill.value = x(p + 15, 2);
  BClickAtkSkill();
  n_B_AtkSkill = 1 * c.B_AtkSkill.value;
  if (SKILL_NEMICO_CON_VALORE.includes(n_B_AtkSkill)) c.BSkillSubNum.value = x(p + 17, 3);
  c.B_AtkRange.value = x(p + 20);
  c.B_AtkElem.value = x(p + 21);
  c.maxASPD.value = x(p + 24);
  CODA_DICASTES.forEach((nome, k) => (c["A_DICASTES_" + nome].value = x(p + 25 + k)));
  refreshFields();
  calc();
  return true;
}
