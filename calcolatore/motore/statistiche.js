// Statistiche del personaggio: StAllCalc somma equipaggiamento, carte, skill e buff
function SkillSearch(e) {
  if (e == 258 && TimeItemNumSearch(35)) return 1;
  for (var _ = 0; _ <= 20; _++) if (m_JobBuff[n_A_JOB][_] == e) return n_A_Buf[_];
  return 0;
}
function StCalc(l) {
  for (
    n_A_STR = 1 * c.A_STR.value,
      n_A_AGI = 1 * c.A_AGI.value,
      n_A_VIT = 1 * c.A_VIT.value,
      n_A_DEX = 1 * c.A_DEX.value,
      n_A_INT = 1 * c.A_INT.value,
      n_A_LUK = 1 * c.A_LUK.value,
      StPoint = 0,
      i = 2;
    i <= n_A_STR;
    i++
  )
    StPoint += StCalc2(i);
  for (i = 2; i <= n_A_AGI; i++) StPoint += StCalc2(i);
  for (i = 2; i <= n_A_VIT; i++) StPoint += StCalc2(i);
  for (i = 2; i <= n_A_INT; i++) StPoint += StCalc2(i);
  for (i = 2; i <= n_A_DEX; i++) StPoint += StCalc2(i);
  for (i = 2; i <= n_A_LUK; i++) StPoint += StCalc2(i);
  if (
    ((n_A_BaseLV = c.A_BaseLV.value),
    n_A_JobSet(),
    (wStPoint = n_Reborn ? 100 : 48),
    l === 1 || c.BLVauto.checked == 0)
  )
    for (i = 1; i < n_A_BaseLV; i++) wStPoint += Math.floor(i / 5) + 3;
  else for (i = 1; StPoint > wStPoint && i < 99; i++) wStPoint += Math.floor(i / 5) + 3;
  (i > 99 && (i = 99), (c.A_BaseLV.value = i), myInnerHtml("A_STPOINT", wStPoint - StPoint, 0));
}
function StCalc2(l) {
  return Math.floor((l - 2) / 10) + 2;
}
function SuperNoviceFullWeapon(l) {
  l == 1
    ? ((SuperNoviceFullWeaponCHECK = 1), (m_JobASPD[20][7] = 1.6))
    : ((SuperNoviceFullWeaponCHECK = 0), (m_JobASPD[20][7] = 0));
  var A = n_A_WeaponTypesArray.length;
  for (i = 0; i < A; i++) n_A_WeaponTypesArray[0] = null;
  for (j = 0, i = 0; i <= 21; i++) m_JobASPD[20][i] != 0 && ((n_A_WeaponTypesArray[j] = i), j++);
  if (itemData[n_A_Equip[0]].jobMask != 7 && JobEquipItemSearch(itemData[n_A_Equip[0]].jobMask)) {
    var n = n_A_Equip[0];
    ((n_A_WeaponType = itemData[n].equipType),
      ClickWeaponType(itemData[n].equipType),
      WeaponSet2(),
      (c.A_weapon1.value = n));
  } else (ClickWeaponType(0), WeaponSet2());
  (JobEquipItemSearch(itemData[n_A_Equip[2]].jobMask, itemData[n_A_Equip[2]].equipType) &&
    (c.A_head1.value = n_A_Equip[2]),
    JobEquipItemSearch(itemData[n_A_Equip[3]].jobMask, itemData[n_A_Equip[3]].equipType) &&
      (c.A_head2.value = n_A_Equip[3]),
    JobEquipItemSearch(itemData[n_A_Equip[4]].jobMask, itemData[n_A_Equip[4]].equipType) &&
      (c.A_head3.value = n_A_Equip[4]),
    (c.A_left.value = n_A_Equip[5]),
    (c.A_body.value = n_A_Equip[6]),
    (c.A_shoulder.value = n_A_Equip[7]),
    (c.A_shoes.value = n_A_Equip[8]),
    (c.A_acces1.value = n_A_Equip[9]),
    (c.A_acces2.value = n_A_Equip[10]));
}
function uaroMaceMasteryCriticalBonus() {
  return n_A_WeaponType == 8 ? SkillSearch(SKILLID.MACE_MASTERY) : 0;
}
function applyForbiddenGrimoireComboBonuses() {
  n_A_Equip[5] != EQUIPID.FORBIDDEN_GRIMOIRE ||
    n_A_Equip[0] != EQUIPID.LEDGER_OF_DEATH ||
    ((bonusValues[BONUSID.MATK_PERCENT] += n_A_Weapon_refine),
    n_A_Weapon_refine >= 10 && (bonusValues[BONUSID.CAST_TIME_PERCENT] -= 10));
}
// Legge la build dal form, somma i bonus in bonusValues e calcola le statistiche mostrate. I passi
// si passano i risultati nelle variabili globali n_A_*: l'ordine conta
function StAllCalc() {
  leggiPersonaggio();
  leggiArmi();
  leggiCarte();
  leggiPannelli();
  for (var i = 0; i <= 22; i++) targetData[i] = m_Monster[c.B_Enemy.value][i];
  elementoDelCorpo();
  for (i = 0; i <= 6; i++) n_Delay[i] = 0;
  sommaBonus();
  limitaEquipaggiamento();
  calcolaATK();
  calcolaHP();
  calcolaSP();
  calcolaDEF();
  calcolaMDEF();
  calcolaHIT();
  calcolaFLEE();
  calcolaPerfectDodge();
  calcolaCritico();
  calcolaMATK();
  calcolaVelocita();
  calcolaASPD();
  calcolaLancio();
  var carico = calcolaPeso();
  rigenerazioneHP(carico);
  rigenerazioneSP(carico);
  bonusFinali();
  ClickB_Enemy();
  calcolaAltreInfo();
}
// classe, livelli, statistiche, skill scelta ed equipaggiamento
function leggiPersonaggio() {
  n_A_JobSet();
  // Super Novice: con Super Novice Spirit (skill 13) puo' usare piu' armi
  if (n_A_JOB == 20) {
    if (SuperNoviceFullWeaponCHECK == 0 && 1 * c.A_skill13.value == 1) SuperNoviceFullWeapon(1);
    else if (SuperNoviceFullWeaponCHECK == 1 && 1 * c.A_skill13.value == 0)
      SuperNoviceFullWeapon(0);
  }
  n_A_BaseLV = 1 * c.A_BaseLV.value;
  n_A_JobLV = 1 * c.A_JobLV.value;
  n_A_STR = 1 * c.A_STR.value;
  n_A_AGI = 1 * c.A_AGI.value;
  n_A_VIT = 1 * c.A_VIT.value;
  n_A_DEX = 1 * c.A_DEX.value;
  n_A_INT = 1 * c.A_INT.value;
  n_A_LUK = 1 * c.A_LUK.value;
  SU_STR = n_A_STR;
  SU_AGI = n_A_AGI;
  SU_VIT = n_A_VIT;
  SU_DEX = n_A_DEX;
  SU_INT = n_A_INT;
  SU_LUK = n_A_LUK;
  n_A_WeaponType = itemData[c.A_weapon1.value].equipType;
  if (n_Nitou) n_A_Weapon2Type = itemData[c.A_weapon2.value].equipType;
  n_A_Arrow = 1 * c.A_Arrow.value;
  n_A_HEAD_REFINE = 1 * c.A_HEAD_REFINE.value;
  n_A_BODY_REFINE = 1 * c.A_BODY_REFINE.value;
  n_A_LEFT_REFINE = 1 * c.A_LEFT_REFINE.value;
  n_A_SHOULDER_REFINE = 1 * c.A_SHOULDER_REFINE.value;
  n_A_SHOES_REFINE = 1 * c.A_SHOES_REFINE.value;
  n_A_ActiveSkill = 1 * c.A_ActiveSkill.value;
  if (n_A_ActiveSkill >= 3000) n_A_ActiveSkill = m_EnableSkill[n_A_ActiveSkill - 3000][2];
  else if (n_A_ActiveSkill >= 2000) n_A_ActiveSkill = m_AutoSpellSkill[n_A_ActiveSkill - 2000][2];
  else if (n_A_ActiveSkill >= 1500) n_A_ActiveSkill = m_EnableSkill[n_A_ActiveSkill - 1500][2];
  n_A_ActiveSkill = uaroSkillId(n_A_ActiveSkill);
  n_A_ActiveSkillLV = 1 * c.A_ActiveSkillLV.value;
  n_A_Equip[0] = 1 * c.A_weapon1.value;
  n_A_Equip[1] = 0;
  if (n_Nitou) n_A_Equip[1] = 1 * c.A_weapon2.value;
  n_A_Equip[2] = 1 * c.A_head1.value;
  n_A_Equip[3] = 1 * c.A_head2.value;
  n_A_Equip[4] = 1 * c.A_head3.value;
  n_A_Equip[5] = 1 * c.A_left.value;
  n_A_Equip[6] = 1 * c.A_body.value;
  n_A_Equip[7] = 1 * c.A_shoulder.value;
  n_A_Equip[8] = 1 * c.A_shoes.value;
  n_A_Equip[9] = 1 * c.A_acces1.value;
  n_A_Equip[10] = 1 * c.A_acces2.value;
  UpdateDicastesEnchantControls();
  if (
    (n_A_Equip[9] == 1001 && n_A_Equip[10] == 1863) ||
    (n_A_Equip[9] == 1863 && n_A_Equip[10] == 1001)
  ) {
    w_SE[59] = [999, "NULL"];
    w_SE[163] = [1864, "NULL"];
  } else {
    w_SE[59] = [999, 987, 998, 1001, "NULL"];
    w_SE[163] = [1864, 987, 998, 1863, "NULL"];
  }
  SetEquip();
}
// ATK dal raffinamento per livello dell'arma: [ATK per raffinamento, raffinamento sicuro, ATK
// massimo in piu' per ogni raffinamento oltre il sicuro]
var RAFFINAMENTO_ARMA = [null, [2, 7, 3], [3, 6, 5], [5, 5, 8], [7, 4, 13]];
// [ATK, minimo e massimo in piu' oltre il raffinamento sicuro]
function raffinamentoArma(livello, raffinamento) {
  var r = RAFFINAMENTO_ARMA[livello];
  if (!r) return [0, 0, 0];
  if (raffinamento > r[1]) return [r[0] * raffinamento, 1, r[2] * (raffinamento - r[1])];
  return [r[0] * raffinamento, 0, 0];
}
// livello, ATK e raffinamento delle armi (la seconda solo con due armi)
function leggiArmi() {
  n_A_WeaponLV = itemData[n_A_Equip[0]].weaponLevel;
  n_A_Weapon_ATK = itemData[n_A_Equip[0]].attackOrDefense;
  n_A_Weapon_refine = 1 * c.A_Weapon_refine.value;
  var r = raffinamentoArma(n_A_WeaponLV, n_A_Weapon_refine);
  n_A_WeaponLV_refineATK = r[0];
  n_A_WeaponLV_Minplus = r[1];
  n_A_WeaponLV_Maxplus = r[2];
  n_A_Weapon2LV = 0;
  n_A_Weapon2_ATK = 0;
  n_A_Weapon2_refine = 0;
  r = [0, 0, 0];
  if (n_Nitou) {
    n_A_Weapon2LV = itemData[n_A_Equip[1]].weaponLevel;
    n_A_Weapon2_ATK = itemData[n_A_Equip[1]].attackOrDefense;
    n_A_Weapon2_refine = 1 * c.A_Weapon2_refine.value;
    r = raffinamentoArma(n_A_Weapon2LV, n_A_Weapon2_refine);
  }
  n_A_Weapon2LV_refineATK = r[0];
  n_A_Weapon2LV_Minplus = r[1];
  n_A_Weapon2LV_Maxplus = r[2];
  if (!c.A_OverRefineBonus.checked) {
    n_A_WeaponLV_Minplus = 0;
    n_A_WeaponLV_Maxplus = 0;
    n_A_Weapon2LV_Minplus = 0;
    n_A_Weapon2LV_Maxplus = 0;
  }
}
// carte ed elemento delle armi
function leggiCarte() {
  n_A_card[0] = 1 * c.A_weapon1_card1.value;
  n_A_card[1] = 1 * c.A_weapon1_card2.value;
  n_A_card[2] = 1 * c.A_weapon1_card3.value;
  n_A_card[3] = 1 * c.A_weapon1_card4.value;
  if (n_Nitou) {
    n_A_card[4] = 1 * c.A_weapon2_card1.value;
    n_A_card[5] = 1 * c.A_weapon2_card2.value;
    n_A_card[6] = 1 * c.A_weapon2_card3.value;
    n_A_card[7] = 1 * c.A_weapon2_card4.value;
  } else {
    n_A_card[4] = 0;
    n_A_card[5] = 0;
    n_A_card[6] = 0;
    n_A_card[7] = 0;
  }
  n_A_card[8] = 1 * c.A_head1_card.value;
  n_A_card[9] = 1 * c.A_head2_card.value;
  n_A_card[10] = 1 * c.A_left_card.value;
  n_A_card[11] = 1 * c.A_body_card.value;
  n_A_card[12] = 1 * c.A_shoulder_card.value;
  n_A_card[13] = 1 * c.A_shoes_card.value;
  n_A_card[14] = 1 * c.A_acces1_card.value;
  n_A_card[15] = 1 * c.A_acces2_card.value;
  SetCard();
  n_A_Weapon_element = 1 * c.A_Weapon_element.value;
  n_A_Weapon2_element = n_A_Weapon_element;
  if (n_A_Weapon_element == 0) {
    for (const b of itemData[n_A_Equip[0]].bonuses) if (b.id == 20) n_A_Weapon_element = b.value;
    for (const b of itemData[n_A_Equip[1]].bonuses) if (b.id == 20) n_A_Weapon2_element = b.value;
    if (201 <= m_Card[n_A_card[0]][0] && m_Card[n_A_card[0]][0] <= 204)
      n_A_Weapon_element = m_Card[n_A_card[0]][0] - 200;
    if (201 <= m_Card[n_A_card[4]][0] && m_Card[n_A_card[4]][0] <= 204)
      n_A_Weapon2_element = m_Card[n_A_card[4]][0] - 200;
    if (
      (n_A_WeaponType == 10 || (17 <= n_A_WeaponType && n_A_WeaponType <= 21)) &&
      m_Arrow[n_A_Arrow][1] > 0
    )
      n_A_Weapon_element = m_Arrow[n_A_Arrow][1];
  }
}
// valore di un campo del form come numero; una spunta vale 1 o 0
function valoreCampo(nome) {
  var campo = c[nome];
  return 1 * (campo.type == "checkbox" ? campo.checked : campo.value);
}
function serieCampi(prefisso, da, a) {
  for (var out = [], i = da; i <= a; i++) out.push(prefisso + i);
  return out;
}
// array[da], array[da + 1]...: i valori dei campi nell'ordine (0 al posto del nome mette 0)
function leggiCampi(array, da, campi) {
  campi.forEach((nome, i) => (array[da + i] = nome === 0 ? 0 : valoreCampo(nome)));
}
// campi dei canti che esistono solo con il canto attivo: [canto, posizione, campo]
// prettier-ignore
var CAMPI_CANTI = [
  [0, 20, "A3_Skill0_2"], [0, 19, "A3_Skill0_4"], [0, 30, "A3_Skill0_3"],
  [1, 21, "A3_Skill1_2"], [1, 31, "A3_Skill1_3"],
  [2, 22, "A3_Skill2_2"], [2, 29, "A3_Skill2_3"], [2, 32, "A3_Skill2_4"],
  [3, 23, "A3_Skill3_2"], [3, 33, "A3_Skill3_3"],
  [4, 24, "A3_Skill4_2"], [4, 34, "A3_Skill4_3"],
  [5, 25, "A3_Skill5_2"], [5, 35, "A3_Skill5_3"],
  [6, 26, "A3_Skill6_2"], [6, 36, "A3_Skill6_3"],
  [37, 38, "A3_Skill12_2"], [37, 39, "A3_Skill12_3"], [37, 27, "A3_Skill12_4"],
];
// skill della classe e pannelli dei buff aperti (le posizioni non lette restano com'erano)
function leggiPannelli() {
  n_A_Buf = [];
  for (var i = 0; m_JobBuff[n_A_JOB][i] != 999; i++)
    n_A_Buf[i] = 1 * documento.getElementById("A_skill" + i).value;
  if (n_SkillSW)
    leggiCampi(n_A_Buf2, 0, serieCampi("A2_Skill", 0, 15).concat(serieCampi("A5_Skill", 0, 5)));
  if (n_Skill3SW) {
    for (i = 0; i <= 6; i++) n_A_Buf3[i] = valoreCampo("A3_Skill" + i + "_1");
    n_A_Buf3[37] = valoreCampo("A3_Skill12_1");
    leggiCampi(n_A_Buf3, 7, serieCampi("A3_Skill", 7, 11));
    // statistiche di chi controlla Marionette
    if (n_A_Buf3[11])
      leggiCampi(
        n_A_Buf3,
        12,
        ["STR", "AGI", "VIT", "INT", "DEX", "LUK"]
          .map((s) => "A3_Skill11_" + s)
          .concat("A3_Skill11a"),
      );
    for (const [canto, posizione, campo] of CAMPI_CANTI)
      if (n_A_Buf3[canto]) n_A_Buf3[posizione] = valoreCampo(campo);
  }
  if (n_Skill4SW) leggiCampi(n_A_Buf3, 40, serieCampi("A3_Skill", 40, 44));
  if (n_Skill6SW) {
    leggiCampi(n_A_Buf6, 0, ["A6_Skill0", "A6_Skill1"]);
    leggiCampi(n_A_Buf6, 3, serieCampi("A6_Skill", 3, 18).concat(serieCampi("A_debuf", 0, 3)));
    leggiCampi(n_A_Buf8, 0, serieCampi("A8_Skill", 0, 3));
    leggiCampi(n_A_Buf8, 5, serieCampi("A8_Skill", 5, 11));
  }
  if (n_Skill7SW) {
    leggiCampi(n_A_Buf7, 0, serieCampi("A7_Skill", 0, 14));
    leggiCampi(
      n_A_Buf7,
      16,
      serieCampi("A7_Skill", 16, 34).concat(
        "A_SpeedPOT",
        serieCampi("A7_Skill", 36, 42),
        0,
        serieCampi("A7_Skill", 44, 51),
      ),
    );
  }
  if (n_Skill9SW) {
    for (i = 0; i <= 7; i++) leggiCampi(n_A_Buf9, 2 * i, ["A9_Skill" + i, "ARG_RC" + i]);
    leggiCampi(
      n_A_Buf9,
      16,
      ["ARG_RC43", "ARG_RC44", "ARG_RC45", "ARG_RC47", "A9_Skill8", "ARG_RC48", "A9_Skill9"].concat(
        serieCampi("ARG_RC", 83, 88),
      ),
    );
    leggiCampi(n_A_Buf9, 30, serieCampi("ARG_RC", 15, 42).concat(0, 0));
  }
  if (n_Skill10SW) {
    leggiCampi(n_B_manual, 1, ["BRG_RC0", "Bman1", "BRG_RC1", "Bman2", "BRG_RC2"]);
    leggiCampi(n_B_manual, 7, ["BRG_RC3"]);
    leggiCampi(n_B_manual, 9, ["BRG_RC4"]);
    leggiCampi(n_B_manual, 21, ["BRG_RC10"]);
    leggiCampi(n_B_manual, 30, ["BRG_RC15", "BRG_RC16"]);
    leggiCampi(n_B_manual, 34, serieCampi("BRG_RC", 19, 29));
    leggiCampi(n_B_manual, 48, serieCampi("BRG_RC", 33, 40));
  }
}
// elemento del personaggio: armatura, carte e buff, scritto nella pagina
function elementoDelCorpo() {
  n_A_Bodyelement = StPlusCard(198);
  if (n_A_Bodyelement == 0) n_A_Bodyelement = StPlusCalc2(198);
  if ((n_A_JOB == 13 || n_A_JOB == 27) && CardNumSearch(456)) n_A_Bodyelement = 6;
  if (n_A_Buf6[6]) n_A_Bodyelement = 6;
  if (n_A_Buf6[13]) n_A_Bodyelement = 2;
  if (n_A_Buf6[15]) n_A_Bodyelement = 1;
  if (n_A_Buf6[8]) n_A_Bodyelement = 9;
  myInnerHtml("A_BodyELEMENT", v_Element[n_A_Bodyelement] + "1", 0);
}
// bonusValues: equipaggiamento, carte, raffinamenti, incantamenti
function sommaBonus() {
  var gruppi = [
    [1, BONUSID.WEAPON_SIZE_PENALTY],
    [BONUSID.DMG_NEUTRAL_PHYSICAL_MAGIC_PERCENT, BONUSID.WATER_MAGIC_DMG_PERCENT],
    [290, 339],
  ];
  for (const [da, a] of gruppi)
    for (var i = da; i <= a; i++) bonusValues[i] = StPlusCalc2(i) + StPlusCard(i);
  applyForbiddenGrimoireComboBonuses();
  // uaRO: Mitra e Old Mitra: bonus che dipendono da INT base e raffinamento (in motore/uaro.js)
  applyUaroHeadgearBonuses();
  bonusDaRaffinamento();
  StPlusCalc();
  ApplyBastionEnchants();
  ApplyDicastesPrimaryEnchants();
}
// oggetti con bonus che dipendono dal raffinamento
function bonusDaRaffinamento() {
  // Temporal Boots: ogni 3 raffinamenti
  var n = Math.floor(n_A_SHOES_REFINE / 3);
  switch (n_A_Equip[8]) {
    case EQUIPID.TEMPORAL_INT_BOOTS:
      bonusValues[BONUSID.HP] += 100 * n;
      bonusValues[BONUSID.SP] += 10 * n;
      bonusValues[BONUSID.INT] += n;
      bonusValues[BONUSID.DEX] += n;
      if (SU_INT >= 90) bonusValues[BONUSID.MATK_PERCENT] += 5;
      break;
    case EQUIPID.TEMPORAL_STR_BOOTS:
      bonusValues[BONUSID.HP] += 100 * n;
      bonusValues[BONUSID.SP] += 10 * n;
      bonusValues[BONUSID.STR] += n;
      if (SU_STR >= 90) bonusValues[BONUSID.ATK_PERCENT] += 5;
      break;
    case EQUIPID.TEMPORAL_DEX_BOOTS:
      bonusValues[BONUSID.HP] += 100 * n;
      bonusValues[BONUSID.SP] += 10 * n;
      bonusValues[BONUSID.DEX] += n;
      if (SU_DEX >= 90) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 5;
      break;
    case EQUIPID.TEMPORAL_AGI_BOOTS:
      bonusValues[BONUSID.HP] += 100 * n;
      bonusValues[BONUSID.SP] += 10 * n;
      bonusValues[BONUSID.ASPD] += 3 * n;
      if (SU_AGI >= 90) bonusValues[BONUSID.ASPD] += 3;
      break;
    case EQUIPID.TEMPORAL_VIT_BOOTS:
      bonusValues[BONUSID.HP] += 200 * n;
      bonusValues[BONUSID.SP] += 10 * n;
      bonusValues[BONUSID.HP_PERCENT] += 4 * n;
      if (SU_VIT >= 75) bonusValues[BONUSID.HP_PERCENT] += 10;
      break;
    case EQUIPID.TEMPORAL_LUK_BOOTS:
      bonusValues[BONUSID.HP] += 100 * n;
      bonusValues[BONUSID.SP] += 10 * n;
      bonusValues[BONUSID.CRIT_DMG_PERCENT] += 5 * n;
      if (SU_LUK >= 50) bonusValues[BONUSID.CRIT_DMG_PERCENT] += 10;
      if (SU_LUK >= 70) {
        bonusValues[BONUSID.CRIT_DMG_PERCENT] += 15;
        bonusValues[BONUSID.MDEF] += 5;
      }
      break;
  }
  if (EQUIPID.GOLDEN_WRENCH == n_A_Equip[0]) {
    if (n_A_Weapon_refine >= 7) bonusValues[BONUSID.CRIT] += 20;
    if (n_A_Weapon_refine >= 8) bonusValues[BONUSID.ASPD] += 10;
    if (n_A_Weapon_refine >= 9) bonusValues[BONUSID.ATK] += 50;
  }
  if (EQUIPID.DEATH_FIRE == n_A_Equip[0]) {
    var s = getDeathFireRefineBonuses(n_A_Weapon_refine);
    bonusValues[BONUSID.ASPD] += s.aspd;
    bonusValues[BONUSID.RANGED_ATK_PERCENT] += s.rangedDamage;
  }
  if (EQUIPID.BLACK_WING == n_A_Equip[0])
    bonusValues[BONUSID.ATK] += 5 * Math.max(0, n_A_Weapon_refine - 5);
  if (EQUIPID.BOLT_REVOLVER == n_A_Equip[0]) {
    if (n_A_Weapon_refine >= 7) bonusValues[BONUSID.ASPD] += 10;
    if (n_A_Weapon_refine >= 9) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 10;
  }
  if (EQUIPID.KING_COBRA == n_A_Equip[0]) {
    if (n_A_Weapon_refine >= 7) bonusValues[BONUSID.CRIT_DMG_PERCENT] += 20;
    if (n_A_Weapon_refine >= 9) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 10;
  }
  if (EQUIPID.AVENGER == n_A_Equip[0]) {
    bonusValues[BONUSID.ASPD] += 2 * n_A_Weapon_refine;
    if (n_A_Weapon_refine >= 9) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 10;
  }
  if (EQUIPID.LUST_CRUSHER == n_A_Equip[0]) {
    if (n_A_Weapon_refine >= 7) bonusValues[BONUSID.ATK] += 20;
    if (n_A_Weapon_refine >= 9) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 10;
  }
  if (EQUIPID.FORTIFIED_DAGGER == n_A_Equip[0]) {
    if (n_A_Weapon_refine >= 7) bonusValues[BONUSID.HP_PERCENT] += 5;
    if (n_A_Weapon_refine >= 9) {
      bonusValues[BONUSID.MATK_PERCENT] += 5;
      bonusValues[BONUSID.HP_PERCENT] += 10;
    }
  }
  if (EQUIPID.ILLUSION_WING_SHURIKEN == n_A_Equip[0] && n_A_Weapon_refine >= 9)
    bonusValues[BONUSID.RANGED_ATK_PERCENT] += 10;
  if (EQUIPID.VALKYRIE_KNIFE == n_A_Equip[0]) {
    if (n_A_Weapon_refine >= 7) {
      bonusValues[BONUSID.ASPD] += 10;
      bonusValues[BONUSID.HP] += 500;
      bonusValues[BONUSID.SP] += 200;
      bonusValues[BONUSID.CRIT] += 25;
      bonusValues[BONUSID.CRIT_DMG_PERCENT] += 20;
      bonusValues[BONUSID.MATK] += 40;
      bonusValues[BONUSID.ATK] += 30;
      bonusValues[BONUSID.RESIST_DEMI_HUMAN_PERCENT] += 10;
    }
    if (n_A_Weapon_refine >= 9) {
      bonusValues[BONUSID.ASPD] += 5;
      bonusValues[BONUSID.HP] += 300;
      bonusValues[BONUSID.SP] += 100;
      bonusValues[BONUSID.CRIT] += 10;
      bonusValues[BONUSID.CRIT_DMG_PERCENT] += 10;
      bonusValues[BONUSID.MATK] += 20;
      bonusValues[BONUSID.ATK] += 15;
    }
  }
  if (EQUIPID.OLD_PARASOL == n_A_Equip[0]) bonusValues[BONUSID.ATK] += 5 * n_A_Weapon_refine;
  if (n_A_card[13] == 572) {
    var meta = Math.floor(n_A_SHOES_REFINE / 2);
    bonusValues[BONUSID.ATK_PERCENT] += meta;
    bonusValues[BONUSID.MATK_PERCENT] += meta;
    bonusValues[BONUSID.HP_PERCENT] -= 2 * meta;
  }
}
// posti dell'equipaggiamento bloccati da altri oggetti (bonus 195 e 200)
function limitaEquipaggiamento() {
  restrictEquipslot();
  if (equip_restrict) {
    if (bonusValues[195]) {
      c.A_LEFT_REFINE.disabled = true;
      c.A_LEFT_REFINE.value = 0;
      c.A_left.disabled = true;
      c.A_left.value = 305;
      c.A_left_card.disabled = true;
      c.A_left_card.value = 0;
    } else if (n_A_WeaponType == 9) {
      c.A_LEFT_REFINE.disabled = false;
      c.A_left.disabled = false;
      if (card_restrict && itemData[c.A_left.value].slots != 0) c.A_left_card.disabled = false;
    }
    if (bonusValues[200] == 1) {
      c.A_head2.disabled = true;
      c.A_head2.value = 243;
      c.A_head2_card.disabled = true;
      c.A_head2_card.value = 0;
      c.A_head3.disabled = false;
    } else if (bonusValues[200] == 2) {
      c.A_head2.disabled = false;
      c.A_head2_card.disabled = false;
      c.A_head3.disabled = true;
      c.A_head3.value = 268;
    } else if (bonusValues[200] == 3) {
      c.A_head3.disabled = true;
      c.A_head3.value = 268;
    } else if (bonusValues[200] >= 4) {
      c.A_head2.disabled = true;
      c.A_head2.value = 243;
      c.A_head2_card.disabled = true;
      c.A_head2_card.value = 0;
      c.A_head3.disabled = true;
      c.A_head3.value = 268;
    } else {
      c.A_head2.disabled = false;
      c.A_head3.disabled = false;
    }
  } else {
    c.A_LEFT_REFINE.disabled = false;
    c.A_left.disabled = false;
    card_restrict = 1 * c.restrict_cardslot.checked;
    if (!card_restrict) {
      c.A_left_card.disabled = false;
      c.A_head2_card.disabled = false;
    }
    c.A_head2.disabled = false;
    c.A_head3.disabled = false;
  }
}
// ATK di stato (da STR, o da DEX con archi, strumenti, fruste e armi da fuoco) e ATK dell'arma
function calcolaATK() {
  var distanza = [10, 14, 15, 17, 18, 19, 20, 21].includes(n_A_WeaponType);
  var principale = distanza ? n_A_DEX : n_A_STR,
    secondaria = distanza ? n_A_STR : n_A_DEX,
    decine = Math.floor(principale / 10);
  n_A_ATK = principale + decine * decine + Math.floor(secondaria / 5) + Math.floor(n_A_LUK / 5);
  var bonus = bonusValues[BONUSID.ATK] + n_A_Buf9[40];
  if (n_A_Buf7[17]) bonus += 5;
  if (n_A_Buf7[38]) bonus += 30;
  else if (n_A_Buf7[9] || n_A_Buf7[46]) bonus += 20;
  else if (n_A_Buf7[29]) bonus += 15;
  else if (n_A_Buf7[2]) bonus += 10;
  if (SkillSearch(SKILLID.HILT_BINDING)) bonus += 4;
  if (SkillSearch(SKILLID.LAST_STAND)) bonus += 100;
  bonus += Math.floor(n_A_JobLV / 10) * CardNumSearch(492);
  if (n_A_JobClass() == 4) bonus += 10 * EquipNumSearch(EQUIPID.ARCHER_FIGURE);
  if (n_A_Equip[2] == 676) bonus += 2 * n_A_HEAD_REFINE;
  if (n_A_Equip[0] == 1165) bonus += 10 * SkillSearch(SKILLID.NUM_MASTERED_SMITH_SKILLS);
  if (n_A_Equip[7] == 1714) bonus += 2 * n_A_SHOULDER_REFINE;
  if (n_A_Equip[6] == 1723) bonus += 3 * n_A_BODY_REFINE;
  if (SU_AGI >= 90) bonus += 10 * EquipNumSearch(EQUIPID.ROGUES_TREASURE);
  if (SU_STR >= 80 && n_A_card[12] == 267) bonus += 20;
  if (SU_STR >= 95 && n_A_Equip[0] == 621) bonus += 340;
  if (SU_STR >= 44 && n_A_Equip[0] == 625) bonus += 44;
  if (SU_STR >= 95 && n_A_Equip[0] == 1160) bonus += 20;
  if (SU_LUK >= 90 && n_A_Equip[0] == 1164) bonus += 20;
  if (SU_STR >= 99 && EquipNumSearch(EQUIPID.NAB_SET_ARO)) bonus += 30;
  if (n_A_Equip[2] == 953 || n_A_Equip[2] == 1261) bonus += Math.floor((2 * n_A_JobLV) / 7);
  if (n_A_HEAD_REFINE >= 5 && n_A_Equip[2] == 1218) bonus += n_A_HEAD_REFINE - 4;
  if (n_A_HEAD_REFINE >= 5 && n_A_Equip[2] == 1495) bonus += n_A_HEAD_REFINE - 4;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1274) bonus += 15;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1474) bonus += 15;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1275) bonus += 15;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1475) bonus += 15;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1276) bonus += 15;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1477) bonus += 15;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1479) bonus += 15;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1480) bonus += 15;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1291) bonus += 5;
  if (n_A_HEAD_REFINE == 10 && n_A_Equip[2] == 1290) bonus += 5;
  if (n_A_SHOULDER_REFINE >= 7 && SU_STR >= 90 && n_A_Equip[7] == 1472) bonus += 20;
  if (n_A_SHOULDER_REFINE >= 9 && SU_STR >= 90 && n_A_Equip[7] == 1472) bonus += 10;
  if (SkillSearch(SKILLID.GATLING_FEVER) && (n_A_WeaponType == 20 || n_A_WeaponType == 0))
    bonus += 20 + 10 * SkillSearch(SKILLID.GATLING_FEVER);
  if (n_A_Buf6[0] == 0 && n_A_Buf6[1] >= 1 && n_A_Bodyelement == 3) bonus += 10 * n_A_Buf6[1];
  if (bonus < 0) bonus = 0;
  n_A_ATK += bonus;
  n_A_Weapon_ATK += bonusValues[BONUSID.WEAPON_ATK];
  var atk = Math.floor(n_A_Weapon_ATK + n_A_Weapon2_ATK + n_A_ATK);
  var percento = bonusValues[BONUSID.ATK_PERCENT] + n_A_Buf9[53];
  percento += 2 * SkillSearch(SKILLID.KIHOP) * SkillSearch(SKILLID.OTHER_PARTY_MEMBERS);
  if (n_A_Equip[2] == 1799) {
    var classe = n_A_JobClass();
    if (classe == 1 || classe == 2 || classe == 6) percento += 8;
  }
  atk += Math.floor(atk * (percento / 100));
  if (SkillSearch(SKILLID.SPEAR_DYNAMO))
    atk = Math.floor(atk * (1 + 0.05 * SkillSearch(SKILLID.SPEAR_DYNAMO)));
  n_A_ATK = Math.floor((n_A_ATK * (100 + percento)) / 100);
  wImp = 5 * n_A_Buf2[2];
  if (n_A_Buf3[9]) wImp += 25 + 25 * n_A_Buf3[9];
  if (n_A_Buf3[10] && (n_A_WeaponLV == 4 || n_A_Weapon2LV == 4)) atk += 50 + 25 * n_A_Buf3[10];
  if (n_A_Buf6[0] == 0 && n_A_Buf6[1] >= 1 && n_A_Bodyelement == 3) atk += 10 * n_A_Buf6[1];
  if (n_A_Buf2[19] == 1) atk *= 2;
  myInnerHtml(
    "A_ATK2",
    Math.floor(wImp + atk) + "+" + (n_A_WeaponLV_refineATK + n_A_Weapon2LV_refineATK),
    0,
  );
  myInnerHtml(
    "A_RealATK",
    wImp +
      atk +
      n_A_WeaponLV_refineATK +
      n_A_Weapon2LV_refineATK +
      n_A_WeaponLV_Minplus +
      "~" +
      (wImp + atk + n_A_WeaponLV_refineATK + n_A_Weapon2LV_refineATK + n_A_WeaponLV_Maxplus),
    0,
  );
}
// HP massimi: 35 + HP_CLASSE_B * livello + la somma di HP_CLASSE_A * l / 100 (arrotondato) per ogni
// livello l da 2; Ninja e Gunslinger (dal 10) hanno una tabella per livello. Indice: classe (n_A_JOB)
var HP_CLASSE_A = [
  0, 70, 50, 40, 50, 30, 40, 150, 110, 75, 85, 55, 90, 110, 85, 90, 75, 75, 75, 90, 0, 150, 110, 75,
  85, 55, 90, 110, 85, 90, 75, 75, 75, 90, 0, 0, 0, 0, 0, 0, 0, 70, 90, 75, 75, 84,
];
var HP_CLASSE_B = [
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 5, 6.5, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 5, 6.5, 3,
  3, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 6.5, 5, 3, 3.5,
];
var HP_NINJA = [
  131, 137, 144, 151, 159, 167, 175, 184, 193, 202, 212, 222, 232, 243, 254, 265, 277, 289, 301,
  316, 331, 346, 364, 382, 400, 420, 440, 460, 482, 504, 526, 548, 572, 596, 620, 646, 672, 698,
  726, 754, 784, 814, 844, 876, 908, 940, 975, 1010, 1100, 1140, 1180, 1220, 1260, 1300, 1340, 1385,
  1430, 1475, 1520, 1565, 1615, 1665, 1715, 1765, 1815, 1880, 1935, 1990, 2045, 2100, 2160, 2200,
  2280, 2340, 2400, 2460, 2520, 2580, 2640, 2705, 2770, 2835, 2900, 2965, 3030, 3100, 3170, 3240,
  3310, 3380, 3455, 3530, 3605, 3680, 3760, 3840, 3920, 4000, 4080,
];
var HP_GUNSLINGER = [
  202, 212, 222, 232, 243, 254, 265, 277, 289, 301, 316, 331, 346, 364, 382, 400, 420, 440, 460,
  490, 520, 550, 580, 610, 650, 680, 710, 740, 770, 800, 830, 860, 890, 920, 950, 990, 1020, 1050,
  1080, 1110, 1140, 1180, 1230, 1280, 1330, 1395, 1455, 1515, 1575, 1635, 1695, 1760, 1820, 1885,
  1950, 2015, 2080, 2145, 2210, 2275, 2340, 2410, 2480, 2550, 2620, 2690, 2760, 2830, 2900, 2970,
  3040, 3115, 3190, 3265, 3340, 3415, 3490, 3565, 3640, 3715, 3790, 3870, 3950, 4030, 4110, 4190,
  4270, 4350, 4430, 4510,
];
// HP massimi, scritti nella pagina
function calcolaHP() {
  var riduzione = 0;
  if (n_A_JOB == 43 && n_A_BaseLV >= 70) {
    if (n_A_BaseLV <= 79) riduzione = 40 * (n_A_BaseLV - 70);
    else if (n_A_BaseLV <= 84) riduzione = 50 * (n_A_BaseLV - 80);
    else if (n_A_BaseLV <= 89) riduzione = 50 * (n_A_BaseLV - 80) - 10;
    else if (n_A_BaseLV <= 92) riduzione = 50 * (n_A_BaseLV - 90);
    else if (n_A_BaseLV <= 97) riduzione = 50 * (n_A_BaseLV - 90) - 10;
    else if (n_A_BaseLV == 98) riduzione = 375;
    else riduzione = 4;
  }
  var somma = 0;
  for (var l = 2; l <= n_A_BaseLV; l++) somma += Math.round((HP_CLASSE_A[n_A_JOB] * l) / 100);
  n_A_MaxHP = Math.floor(HP_CLASSE_B[n_A_JOB] * n_A_BaseLV + 35 + somma);
  if (n_A_JOB == 44) n_A_MaxHP = HP_NINJA[n_A_BaseLV - 1];
  if (n_A_JOB == 45 && n_A_BaseLV >= 10) n_A_MaxHP = HP_GUNSLINGER[n_A_BaseLV - 10];
  if (n_A_JOB == 20 && n_A_BaseLV == 99) n_A_MaxHP += 2000;
  if (n_Reborn) n_A_MaxHP = Math.floor((125 * n_A_MaxHP) / 100);
  if (1 * c.A_adopted.checked) {
    n_A_MaxHP = Math.floor((70 * n_A_MaxHP) / 100);
    myInnerHtml("A_BodySIZE", "Demi-Human & Small", 0);
  } else myInnerHtml("A_BodySIZE", "Demi-Human & Medium", 0);
  n_A_MaxHP = Math.floor(((n_A_MaxHP - riduzione) * (100 + n_A_VIT)) / 100);
  if (n_A_JOB == 41 && n_A_BaseLV >= 70) {
    if (n_A_BaseLV <= 79)
      n_A_MaxHP = Math.floor(((2127 + 10 * (n_A_BaseLV - 70)) * (100 + n_A_VIT)) / 100);
    else if (n_A_BaseLV <= 89)
      n_A_MaxHP = Math.floor(((2200 + 50 * (n_A_BaseLV - 80)) * (100 + n_A_VIT)) / 100);
    else if (n_A_BaseLV <= 99) {
      n_A_MaxHP = ((2700 + 50 * (n_A_BaseLV - 90)) * (100 + n_A_VIT)) / 100;
      if (SkillSearch(SKILLID.TAEKWON_RANKER)) n_A_MaxHP *= 3;
      n_A_MaxHP = Math.floor(n_A_MaxHP);
    }
  }
  if (n_A_JOB == 42 && n_A_BaseLV >= 70) {
    var hpKensei = [3455, 3524, 3593, 3663, 3834, 3806, 3878, 3951, 4025, 4500];
    if (n_A_BaseLV <= 79)
      n_A_MaxHP = Math.floor(((2670 + 10 * (n_A_BaseLV - 70)) * (100 + n_A_VIT)) / 100);
    else if (n_A_BaseLV <= 89)
      n_A_MaxHP = Math.floor(((3000 + 20 * (n_A_BaseLV - 80)) * (100 + n_A_VIT)) / 100);
    else if (n_A_BaseLV <= 99)
      n_A_MaxHP = Math.floor((hpKensei[n_A_BaseLV - 90] * (100 + n_A_VIT)) / 100);
  }
  switch (n_A_Buf7[39]) {
    case 1:
      n_A_MaxHP += Math.floor(500 + (10 * n_A_BaseLV) / 3);
      break;
    case 2:
      n_A_MaxHP += Math.floor(1500 + (10 * n_A_BaseLV) / 3);
      break;
    case 3:
      n_A_MaxHP += Math.floor(2500 + (10 * n_A_BaseLV) / 3);
      break;
  }
  n_A_MaxHP += 200 * SkillSearch(SKILLID.FAITH);
  var fisso = bonusValues[BONUSID.HP] + n_A_Buf9[30];
  if (n_A_BaseLV <= 79) fisso += 400 * EquipNumSearch(EQUIPID.ACADEMY_OF_BADGE);
  if (n_A_JobClass() == 5) fisso -= 100 * CardNumSearch(474);
  if (n_A_JobClass() == 0) fisso += 30 * EquipNumSearch(EQUIPID.NOVICE_FIGURE);
  if (n_A_JobClass() == 1) fisso += 500 * CardNumSearch(477);
  if (n_A_card[11] == 186) fisso -= 40 * n_A_BODY_REFINE;
  if (n_A_Equip[8] == 836) fisso += 10 * n_A_BaseLV;
  if (n_A_Equip[6] == 859) fisso += 20 * n_A_BaseLV;
  if (n_A_Equip[6] == 762) fisso += 20 * n_A_BaseLV;
  if (EquipNumSearch(EQUIPID.MYSTIC_RING_PLUS_SMALL_BOOK_PEN)) fisso += 3 * n_A_BaseLV;
  if (n_A_Equip[6] == 986) fisso += 7 * n_A_BaseLV;
  if (n_A_Equip[0] == 1172) fisso += 25 * n_A_Weapon_refine;
  if (EquipNumSearch(EQUIPID.SHAMAN_SET)) fisso += 10 * n_A_BaseLV;
  if (n_A_Equip[5] == 1785 && SU_INT > 97) fisso += 800;
  if (EQUIPID.GEFFENIA_WATER_BOOK == n_A_Equip[5] && SU_INT >= 90) fisso += 800;
  if (n_A_BODY_REFINE >= 9 && n_A_card[11] == 225) fisso += 800;
  if (n_A_Weapon_refine >= 6 && n_A_Equip[0] == 1168) fisso -= 200 * (n_A_Weapon_refine - 5);
  if ((n_A_JOB == 0 || n_A_JOB == 20) && n_A_Equip[3] == 1670) fisso += 80;
  if (n_A_Equip[8] == 536) {
    var classe = n_A_JobClass();
    if (classe == 3 || classe == 4 || classe == 5) fisso += 5 * n_A_BaseLV;
  }
  n_A_MaxHP += fisso;
  if (n_A_MaxHP < 1) n_A_MaxHP = 1;
  var percento = bonusValues[BONUSID.HP_PERCENT] + n_A_Buf9[31];
  if (n_A_Buf3[3]) percento += 5 + 2 * n_A_Buf3[3] + n_A_Buf3[33] + Math.floor(n_A_Buf3[23] / 10);
  if (n_A_Buf2[17]) percento += 100;
  if (n_A_Buf7[16]) percento += 3;
  if (n_A_Equip[8] == 715) percento -= n_A_SHOES_REFINE;
  if (n_A_Equip[6] == 1730) percento += n_A_BODY_REFINE;
  if (SU_VIT >= 80 && n_A_card[12] == 267) percento += 3;
  if (n_A_SHOES_REFINE >= 9 && n_A_card[13] == 304) percento += 10;
  if (n_A_SHOES_REFINE <= 4 && n_A_card[13] == 407) percento += 4;
  if (n_A_SHOES_REFINE >= 8 && n_A_Equip[8] == 1732) percento += n_A_SHOES_REFINE - 7;
  if (n_A_card[12] == 405 && (n_A_JobClass() == 1 || n_A_JobClass() == 2 || n_A_JobClass() == 6))
    percento += 5;
  n_A_MaxHP = (n_A_MaxHP * (100 + percento)) / 100;
  if (n_A_Buf6[0] == 1 && n_A_Buf6[1] >= 1 && n_A_Bodyelement == 1)
    n_A_MaxHP = (n_A_MaxHP * (100 + [5, 9, 12, 14, 15][n_A_Buf6[1] - 1])) / 100;
  if (SkillSearch(SKILLID.FRENZY)) n_A_MaxHP *= 3;
  n_A_MaxHP = Math.floor(n_A_MaxHP);
  myInnerHtml("A_MaxHP", (n_A_MaxHP >= 100 && n_A_MaxHP < 10000 ? "" : " ") + n_A_MaxHP, 0);
}
// SP massimi: 10 + SP_CLASSE * livello
var SP_CLASSE = [
  1, 2, 2, 5, 2, 6, 3, 3, 4, 8, 4, 9, 4, 4.7, 5, 4.7, 6, 6, 7, 4, 1, 3, 4, 8, 4, 9, 4, 4.7, 5, 4.7,
  6, 6, 7, 4, 0, 0, 0, 0, 0, 0, 0, 2, 4.7, 9, 3.75, 3.75,
];
// SP massimi, scritti nella pagina
function calcolaSP() {
  var riduzione = 0;
  if (n_A_JOB == 43 && n_A_BaseLV >= 70) {
    if (n_A_BaseLV < 80) riduzione = 4 * (n_A_BaseLV - 70) + 5;
    else if (n_A_BaseLV < 90) riduzione = 4 * (n_A_BaseLV - 80);
    else if (n_A_BaseLV < 93) riduzione = 4 * (n_A_BaseLV - 90);
    else if (n_A_BaseLV < 99) riduzione = 4 * (n_A_BaseLV - 90) - 10;
    else riduzione = 1;
  }
  n_A_MaxSP = 10 + n_A_BaseLV * SP_CLASSE[n_A_JOB] - riduzione;
  if (n_A_JOB == 44) {
    if (n_A_BaseLV <= 20) n_A_MaxSP = 11 + 3 * n_A_BaseLV;
    else if (n_A_BaseLV <= 40) n_A_MaxSP = 71 + 4 * (n_A_BaseLV - 20);
    else if (n_A_BaseLV <= 60) n_A_MaxSP = 151 + 5 * (n_A_BaseLV - 40);
    else if (n_A_BaseLV <= 80) n_A_MaxSP = 251 + 6 * (n_A_BaseLV - 60);
    else n_A_MaxSP = 370 + 8 * (n_A_BaseLV - 80);
  }
  if (n_A_JOB == 45) {
    if (n_A_BaseLV <= 25) n_A_MaxSP = 10 + 3 * n_A_BaseLV;
    else if (n_A_BaseLV <= 35) n_A_MaxSP = 85 + 4 * (n_A_BaseLV - 25);
    else if (n_A_BaseLV <= 40) n_A_MaxSP = 126 + 3 * (n_A_BaseLV - 35);
    else if (n_A_BaseLV <= 50) n_A_MaxSP = 141 + 4 * (n_A_BaseLV - 40);
    else if (n_A_BaseLV <= 75) n_A_MaxSP = 181 + 5 * (n_A_BaseLV - 50);
    else if (n_A_BaseLV <= 78) n_A_MaxSP = 306 + 6 * (n_A_BaseLV - 75);
    else n_A_MaxSP = 330 + 6 * (n_A_BaseLV - 78);
  }
  if (n_Reborn) n_A_MaxSP = Math.floor((125 * n_A_MaxSP) / 100);
  if (1 * c.A_adopted.checked) n_A_MaxSP = Math.floor((70 * n_A_MaxSP) / 100);
  n_A_MaxSP = Math.floor((n_A_MaxSP * (100 + n_A_INT)) / 100);
  switch (n_A_Buf7[40]) {
    case 1:
      n_A_MaxSP = Math.floor((n_A_MaxSP * (95 + n_A_BaseLV / 10)) / 100);
      break;
    case 2:
      n_A_MaxSP = Math.floor((n_A_MaxSP * (100 + n_A_BaseLV / 10)) / 100);
      break;
    case 3:
      n_A_MaxSP = Math.floor((n_A_MaxSP * (105 + n_A_BaseLV / 10)) / 100);
      break;
  }
  if (n_A_JOB == 41 && n_A_BaseLV >= 70) {
    if (n_A_BaseLV <= 79)
      n_A_MaxSP = Math.floor(((150 + 1 * (n_A_BaseLV - 70)) * (100 + n_A_INT)) / 100);
    else if (n_A_BaseLV <= 89)
      n_A_MaxSP = Math.floor(((160 + 1 * (n_A_BaseLV - 70)) * (100 + n_A_INT)) / 100);
    else if (n_A_BaseLV <= 99) {
      n_A_MaxSP = (190 * (100 + n_A_INT)) / 100;
      if (SkillSearch(SKILLID.TAEKWON_RANKER)) n_A_MaxSP *= 3;
      n_A_MaxSP = Math.floor(n_A_MaxSP);
    }
  }
  if (n_A_JOB == 42 && n_A_BaseLV >= 70) {
    if (n_A_BaseLV <= 79)
      n_A_MaxSP = Math.floor(((339 + 2 * (n_A_BaseLV - 70)) * (100 + n_A_INT)) / 100);
    else if (n_A_BaseLV <= 89)
      n_A_MaxSP = Math.floor(((386 + 2 * (n_A_BaseLV - 80)) * (100 + n_A_INT)) / 100);
    else if (n_A_BaseLV <= 99)
      n_A_MaxSP = Math.floor(((430 + 3 * (n_A_BaseLV - 90)) * (100 + n_A_INT)) / 100);
  }
  var fisso = bonusValues[BONUSID.SP] + n_A_Buf9[32];
  fisso += StPlusCalc2(4);
  fisso += StPlusCalc2(7);
  fisso += 30 * SkillSearch(SKILLID.KAINA);
  if (n_A_BaseLV <= 79) fisso += 200 * EquipNumSearch(EQUIPID.ACADEMY_OF_BADGE);
  if (n_A_card[9] == 179) fisso += 40;
  if (n_A_JobClass() == 3) fisso += 50 * EquipNumSearch(EQUIPID.ACOLYTE_FIGURE);
  if (n_A_JobClass() == 5) fisso += 100 * CardNumSearch(474) + 100 * CardNumSearch(476);
  if (n_A_Equip[6] == 859) fisso += 5 * n_A_BaseLV;
  if (n_A_Equip[6] == 762) fisso += 5 * n_A_BaseLV;
  if (EquipNumSearch(EQUIPID.MYSTIC_RING_PLUS_SMALL_BOOK_PEN)) fisso += n_A_JobLV;
  if (n_A_Equip[6] == 986) fisso += Math.floor(0.5 * n_A_BaseLV);
  if (n_A_Equip[0] == 1671) fisso += 50 * Math.floor(n_A_Weapon_refine / 2);
  if (n_A_Equip[7] == 1193) fisso += Math.floor(n_A_BaseLV / 3) + 10 * n_A_SHOULDER_REFINE;
  if (EquipNumSearch(EQUIPID.SHAMAN_SET)) fisso += 2 * n_A_BaseLV;
  if (n_A_HEAD_REFINE <= 4 && n_A_card[8] == 179) fisso += 40;
  if (n_A_HEAD_REFINE >= 9 && n_A_card[8] == 298) fisso += 150;
  if (n_A_Weapon_refine >= 9 && n_A_Equip[0] == 642) fisso += 300;
  if (n_A_Weapon_refine >= 6 && n_A_Equip[0] == 1168) fisso -= 100 * (n_A_Weapon_refine - 5);
  if (n_A_HEAD_REFINE >= 6 && n_A_Equip[2] == 1593) fisso += 10 * (n_A_HEAD_REFINE - 5);
  if (n_A_HEAD_REFINE >= 6 && EquipNumSearch(EQUIPID.SAKURA_CORONET_PLUS_ROMANTIC_FLOWER))
    fisso += n_A_HEAD_REFINE;
  if ((n_A_JOB == 0 || n_A_JOB == 20) && n_A_Equip[3] == 1670) fisso += 30;
  if (n_A_Equip[8] == 536) {
    var classe = n_A_JobClass();
    if (classe == 1 || classe == 2 || classe == 6) fisso += 2 * n_A_JobLV;
  }
  n_A_MaxSP += fisso;
  if (n_A_MaxSP < 0) n_A_MaxSP = 0;
  var percento = bonusValues[BONUSID.SP_PERCENT] + n_A_Buf9[33];
  percento += SkillSearch(SKILLID.MEDIATIO);
  percento += 2 * SkillSearch(SKILLID.SOUL_DRAIN);
  if (n_A_Buf2[18]) percento += 100 + bonusValues[BONUSID.SP_PERCENT];
  if (n_A_Buf7[16]) percento += 3;
  if (n_A_Equip[8] == 715) percento -= n_A_SHOES_REFINE;
  if (n_A_HEAD_REFINE >= 6 && EquipNumSearch(EQUIPID.SAKURA_CORONET_PLUS_ROMANTIC_FLOWER))
    percento += n_A_HEAD_REFINE;
  if (n_A_SHOES_REFINE >= 9 && n_A_card[13] == 304) percento += 10;
  if (n_A_SHOES_REFINE <= 4 && n_A_card[13] == 407) percento += 4;
  if (n_A_card[12] == 405 && (n_A_JobClass() == 3 || n_A_JobClass() == 4 || n_A_JobClass() == 5))
    percento += 5;
  if (n_A_Buf3[6]) percento += 15 + n_A_Buf3[6] + n_A_Buf3[26] / 10 + n_A_Buf3[36];
  n_A_MaxSP = Math.floor(n_A_MaxSP * (1 + percento / 100));
  myInnerHtml("A_MaxSP", (n_A_MaxSP >= 100 ? "" : " ") + n_A_MaxSP, 0);
}
// DEF dell'equipaggiamento e DEF da VIT, scritte nella pagina
function calcolaDEF() {
  var raffinamenti =
    n_A_HEAD_REFINE + n_A_BODY_REFINE + n_A_LEFT_REFINE + n_A_SHOULDER_REFINE + n_A_SHOES_REFINE;
  n_A_DEF = bonusValues[BONUSID.DEF] + n_A_Buf9[34];
  for (var i = 2; i <= 10; i++) n_A_DEF += itemData[n_A_Equip[i]].attackOrDefense;
  // uaRO: Luna Bow: DEF +2, +3 da +6, +5 da +9 (Item Changes; patch del 04/08/2026). Nel
  // codice c'erano i valori ufficiali
  if (n_A_Equip[0] == 521) {
    if (n_A_Weapon_refine <= 5) n_A_DEF += 2;
    else if (n_A_Weapon_refine >= 9) n_A_DEF += 5;
    else n_A_DEF += 3;
  }
  if (n_A_LEFT_REFINE <= 5 && n_A_card[10] == 222) n_A_DEF += 2;
  if (n_A_BODY_REFINE <= 5 && n_A_card[11] == 283) n_A_DEF += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1272) n_A_DEF += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1273) n_A_DEF += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1274) n_A_DEF += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1474) n_A_DEF += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1275) n_A_DEF += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1475) n_A_DEF += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1276) n_A_DEF += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1280) n_A_DEF += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1282) n_A_DEF += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1286) n_A_DEF += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1287) n_A_DEF += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1486) n_A_DEF += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1487) n_A_DEF += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1485) n_A_DEF += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1550) n_A_DEF += 1;
  if (n_A_Buf3[9]) n_A_DEF += 2 + 2 * n_A_Buf3[9];
  if (n_A_Buf7[32]) n_A_DEF += 3;
  if (n_A_JobClass() == 1) n_A_DEF += 2 * EquipNumSearch(EQUIPID.SWORDMAN_FIGURE);
  if (n_A_Equip[0] == 658) n_A_DEF += n_A_Weapon_refine;
  if (n_A_Equip[8] == 715) n_A_DEF += Math.floor(n_A_SHOES_REFINE / 2);
  if (n_A_Equip[0] == 942) n_A_DEF += Math.floor(n_A_Weapon_refine / 2);
  if (n_A_Equip[2] == 1350) n_A_DEF -= n_A_HEAD_REFINE;
  if (EquipNumSearch(EQUIPID.SANTAS_BEARD)) n_A_DEF -= 5;
  if (EquipNumSearch(EQUIPID.ODINS_BLESSING_FRIGGS_CIRCLET_VALKYRIAN_SHIELD_SET))
    n_A_DEF -= n_A_HEAD_REFINE + n_A_LEFT_REFINE;
  if (EquipNumSearch(EQUIPID.ODINS_BLESSING_MAGNIS_CAP_STONE_BUCKLER_SET) && n_A_JobClass() == 1)
    n_A_DEF += 6;
  if (n_A_Equip[6] == 986 && (n_A_JobClass() == 1 || n_A_JobClass() == 2 || n_A_JobClass() == 6))
    n_A_DEF += 3;
  if (n_A_Equip[2] == 809) raffinamenti -= n_A_HEAD_REFINE;
  if (TimeItemNumSearch(9) || TimeItemNumSearch(50)) n_A_DEF += 20;
  if (TimeItemNumSearch(33) || TimeItemNumSearch(51)) n_A_DEF -= 20;
  n_A_totalDEF = n_A_DEF + Math.round((66 * raffinamenti) / 100);
  if (bonusValues[BONUSID.REDUCE_DEF_PER_X])
    n_A_totalDEF = Math.floor(n_A_totalDEF / bonusValues[BONUSID.REDUCE_DEF_PER_X]);
  if (bonusValues[BONUSID.LOWER_DEF_PERCENT])
    n_A_totalDEF -= Math.floor((n_A_totalDEF * bonusValues[BONUSID.LOWER_DEF_PERCENT]) / 100);
  if (n_A_Buf6[21]) n_A_totalDEF -= Math.floor((25 * n_A_totalDEF) / 100);
  if (SkillSearch(SKILLID.SPEAR_DYNAMO))
    n_A_totalDEF = Math.floor(n_A_totalDEF * (1 - 0.05 * SkillSearch(SKILLID.SPEAR_DYNAMO)));
  if (n_A_Buf6[13] || n_A_Buf6[15]) n_A_totalDEF -= Math.floor(0.5 * n_A_totalDEF);
  if (n_A_Buf2[21]) n_A_totalDEF += Math.floor(0.25 * n_A_totalDEF);
  if (n_A_totalDEF >= 100) n_A_totalDEF = 99;
  if (CardNumSearch(392)) n_A_totalDEF -= 50;
  if (c.B_num.value >= 2)
    n_A_totalDEF -= Math.floor((n_A_totalDEF * (1 * c.B_num.value - 1) * 5) / 100);
  if (SkillSearch(SKILLID.MENTAL_STRENGTH)) n_A_totalDEF = 90;
  // DEF da VIT mostrata, con Angelus (n_A_Buf2[4])
  var vit = parseInt(n_A_VIT + n_A_VIT * (0.05 * n_A_Buf2[4]));
  if (n_A_Buf6[5]) vit -= Math.floor((0.05 + 0.05 * n_A_Buf6[5]) * vit);
  else if (n_A_Buf7[31]) vit -= Math.floor(0.1 * vit);
  if (SkillSearch(SKILLID.FRENZY)) {
    n_A_totalDEF = 0;
    vit = 0;
  }
  myInnerHtml("A_totalDEF", n_A_totalDEF + "+" + vit, 0);
  // DEF da VIT usata nei danni: minima, media, massima
  n_A_VITDEF = [];
  n_A_VITDEF[0] = Math.floor(0.5 * n_A_VIT) + Math.floor(0.3 * n_A_VIT);
  n_A_VITDEF[2] = Math.floor(0.5 * n_A_VIT) + Math.floor((n_A_VIT * n_A_VIT) / 150) - 1;
  if (n_A_VITDEF[2] > n_A_VITDEF[0]) n_A_VITDEF[1] = (n_A_VITDEF[0] + n_A_VITDEF[2]) / 2;
  else {
    n_A_VITDEF[1] = n_A_VITDEF[0];
    n_A_VITDEF[2] = n_A_VITDEF[0];
  }
  var scala = (f) => (n_A_VITDEF = n_A_VITDEF.map(f));
  if (SkillSearch(SKILLID.AUTO_BERSERK)) scala((x) => Math.floor(0.45 * x));
  else if (n_A_Buf6[5]) scala((x) => Math.floor(x * (0.95 - 0.05 * n_A_Buf6[5])));
  else if (n_A_Buf7[31]) scala((x) => Math.floor(0.9 * x));
  if (bonusValues[BONUSID.REDUCE_DEF_PER_X])
    scala((x) => Math.floor(x / bonusValues[BONUSID.REDUCE_DEF_PER_X]));
  if (SkillSearch(SKILLID.SPEAR_DYNAMO))
    scala((x) => Math.floor(x * (1 - 0.05 * SkillSearch(SKILLID.SPEAR_DYNAMO))));
  if (n_A_Buf2[4]) scala((x) => Math.floor(x * (1 + 0.05 * n_A_Buf2[4])));
  if (n_A_Buf6[21]) scala((x) => x - Math.floor((25 * x) / 100));
  if (SkillSearch(SKILLID.FRENZY)) scala(() => 0);
  if (c.B_num.value >= 2) scala((x) => x - Math.floor((x * (1 * c.B_num.value - 1) * 5) / 100));
}
// MDEF dell'equipaggiamento e MDEF da INT, scritte nella pagina
function calcolaMDEF() {
  n_A_MDEF = bonusValues[BONUSID.MDEF] + n_A_Buf9[35];
  if (n_A_JobClass() == 3) n_A_MDEF += CardNumSearch(383);
  if (n_A_Buf7[33]) n_A_MDEF += 3;
  if (n_A_card[9] == 213) n_A_MDEF += 5;
  if (n_A_card[16] == 213) n_A_MDEF += 5;
  if (n_A_card[17] == 213) n_A_MDEF += 5;
  if (n_A_card[18] == 213) n_A_MDEF += 5;
  if (EquipNumSearch(EQUIPID.ODINS_BLESSING_FRIGGS_CIRCLET_VALKYRIAN_SHIELD_SET))
    n_A_MDEF += n_A_HEAD_REFINE + n_A_LEFT_REFINE;
  if (n_A_Equip[0] == 1169) n_A_MDEF += n_A_Weapon_refine;
  if (n_A_card[11] == 199 && n_A_JobClass() == 5) n_A_MDEF += 3;
  if (EquipNumSearch(EQUIPID.LEAF_CAT_HAT) || n_A_Equip[2] == 1350) n_A_MDEF += n_A_HEAD_REFINE;
  if (n_A_HEAD_REFINE <= 5 && n_A_card[8] == 213) n_A_MDEF += 5;
  if (n_A_LEFT_REFINE <= 5 && n_A_card[10] == 222) n_A_MDEF += 3;
  if (n_A_BODY_REFINE <= 5 && n_A_card[11] == 283) n_A_MDEF += 5;
  if (n_A_LEFT_REFINE >= 9 && n_A_card[10] == 310) n_A_MDEF += 5;
  if (n_A_SHOES_REFINE <= 5 && n_A_card[13] == 381) n_A_MDEF += 7;
  if (n_A_HEAD_REFINE >= 6 && n_A_Equip[2] == 1593) n_A_MDEF += n_A_HEAD_REFINE - 5;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1277) n_A_MDEF += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1281) n_A_MDEF += 7;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1478) n_A_MDEF += 7;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1483) n_A_MDEF += 5;
  if (n_A_SHOULDER_REFINE <= 5 && n_A_card[12] == 258) n_A_MDEF += 8;
  if (n_A_Equip[6] == 986 && (n_A_JobClass() == 3 || n_A_JobClass() == 4 || n_A_JobClass() == 5))
    n_A_MDEF += 5;
  if (SkillSearch(SKILLID.ENDURE)) n_A_MDEF += SkillSearch(SKILLID.ENDURE);
  else if (SkillSearch(SKILLID.SPEAR_DYNAMO)) n_A_MDEF += 1;
  if (TimeItemNumSearch(9) || TimeItemNumSearch(50)) n_A_MDEF -= 20;
  if (TimeItemNumSearch(33) || TimeItemNumSearch(51)) n_A_MDEF += 20;
  if (n_A_Buf6[13] || n_A_Buf6[15]) n_A_MDEF += Math.floor(0.25 * n_A_MDEF);
  if (SkillSearch(SKILLID.MENTAL_STRENGTH)) n_A_MDEF = 90;
  if (CardNumSearch(392)) n_A_MDEF -= 50;
  if (n_A_MDEF >= 99) n_A_MDEF = 99;
  var mdefInt = n_A_INT;
  n_A_softMDEF = n_A_INT + Math.floor(n_A_VIT / 2);
  if (n_A_Buf6[4]) n_A_softMDEF -= Math.floor(n_A_softMDEF * n_A_Buf6[4] * 0.12);
  if (SkillSearch(SKILLID.FRENZY)) {
    n_A_MDEF = 0;
    mdefInt = 0;
    n_A_softMDEF = 0;
  }
  myInnerHtml("A_MDEF", n_A_MDEF + "+" + mdefInt, 0);
  myInnerHtml("A_RealMDEF", n_A_MDEF + "+" + n_A_softMDEF, 0);
}
// HIT e Perfect Hit, scritti nella pagina
function calcolaHIT() {
  n_A_HIT = n_A_BaseLV + n_A_DEX + bonusValues[BONUSID.HIT] + n_A_Buf9[36];
  n_A_HIT += Math.floor(n_A_JobLV / 10) * CardNumSearch(492);
  if (n_A_Buf2[20]) n_A_HIT += 50;
  if (n_A_Buf3[4]) n_A_HIT += 10 + 2 * n_A_Buf3[4] + n_A_Buf3[34] + Math.floor(n_A_Buf3[24] / 10);
  if (n_A_Buf7[0]) n_A_HIT += 30;
  if (n_A_Buf7[27]) n_A_HIT += 33;
  else if (n_A_Buf7[46]) n_A_HIT += 30;
  else if (n_A_Buf7[18]) n_A_HIT += 10;
  if (n_A_WeaponType == 10) n_A_HIT += 5 * CardNumSearch(465);
  if (n_A_Equip[0] == 654) n_A_HIT += Math.floor(SU_AGI / 10);
  if (n_A_Equip[0] == 656) n_A_HIT -= Math.floor(SU_DEX / 3);
  if (n_A_Equip[0] == 1796) n_A_HIT += Math.floor(SU_LUK / 2);
  if (SU_STR >= 90) n_A_HIT += 10 * EquipNumSearch(EQUIPID.ROGUES_TREASURE);
  if (SU_STR >= 95 && n_A_Equip[0] == 1167) n_A_HIT += 10;
  if (n_A_WeaponType == 3 || n_A_WeaponType == 2) n_A_HIT += 5 * CardNumSearch(464);
  if (EquipNumSearch(EQUIPID.BLACK_CAT) & EquipNumSearch(EQUIPID.ROGUES_TREASURE))
    n_A_HIT += Math.floor(n_A_Weapon_refine / 2);
  if (n_A_Equip[0] == 1176 && SkillSearch(SKILLID.KATAR_MASTERY) == 10) n_A_HIT += 10;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1480) n_A_HIT += 5;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1549) n_A_HIT += 5;
  n_A_HIT += 1 * SkillSearch(SKILLID.VULTURES_EYE);
  n_A_HIT += 2 * SkillSearch(SKILLID.WEAPONRY_RESEARCH);
  n_A_HIT += 3 * SkillSearch(SKILLID.FALCON_EYES);
  n_A_HIT += 10 * SkillSearch(SKILLID.SPEAR_DYNAMO);
  n_A_HIT += 1 * SkillSearch(SKILLID.SNAKE_EYES);
  n_A_HIT += 2 * SkillSearch(SKILLID.SINGLE_ACTION);
  if (SkillSearch(SKILLID.GUNSLINGERS_PANIC)) n_A_HIT -= 30;
  if (SkillSearch(SKILLID.INCREASE_ACCURACY)) n_A_HIT += 20;
  if (n_A_Buf7[16]) n_A_HIT += Math.floor(0.03 * n_A_HIT);
  if (n_A_Buf6[11]) n_A_HIT = Math.round(0.75 * n_A_HIT);
  n_A_HIT += Math.floor(n_A_HIT * n_A_Buf9[23] * 0.01);
  if (n_A_HIT < 1) n_A_HIT = 1;
  myInnerHtml("A_HIT", n_A_HIT, 0);
  bonusValues[BONUSID.PERFECT_HIT_PERCENT] += n_A_Buf9[55];
  myInnerHtml("A_PefHIT", bonusValues[BONUSID.PERFECT_HIT_PERCENT], 0);
}
// FLEE, scritto nella pagina anche ridotto in WoE
function calcolaFLEE() {
  n_A_FLEE = n_A_BaseLV + n_A_AGI + bonusValues[BONUSID.FLEE] + n_A_Buf9[37];
  if (n_A_JOB == 24) n_A_FLEE += Math.round(SkillSearch(SKILLID.WIND_WALKER) / 2);
  if (SkillSearch(SKILLID.CLOSE_CONFINE)) n_A_FLEE += 10;
  if (SkillSearch(SKILLID.LUNAR_PROTECTION))
    n_A_FLEE += Math.floor((n_A_BaseLV + n_A_LUK + n_A_DEX) / 10);
  if (SkillSearch(SKILLID.GUNSLINGERS_PANIC)) n_A_FLEE += 30;
  if (n_A_Equip[0] == 483) n_A_FLEE -= n_A_BaseLV + SU_AGI;
  if (n_A_Equip[7] == 1714) n_A_FLEE += 2 * n_A_SHOULDER_REFINE;
  if (n_A_Equip[6] == 1718) n_A_FLEE += n_A_BODY_REFINE;
  if (n_A_Buf2[20]) n_A_FLEE += 50;
  if (n_A_Buf3[0])
    n_A_FLEE += n_A_Buf3[0] + Math.floor(n_A_Buf3[30] / 2) + Math.floor(n_A_Buf3[20] / 10);
  if (n_A_Buf7[1]) n_A_FLEE += 30;
  if (n_A_Buf7[28]) n_A_FLEE += 33;
  else if (n_A_Buf7[46]) n_A_FLEE += 30;
  if (TimeItemNumSearch(1)) n_A_FLEE += 30 * TimeItemNumSearch(1);
  if (SU_STR >= 90) n_A_FLEE += 10 * EquipNumSearch(EQUIPID.ROGUES_TREASURE);
  if (n_A_Buf2[9] && SkillSearch(SKILLID.WIND_WALKER) == 0) n_A_FLEE += Math.round(n_A_Buf2[9] / 2);
  if (n_A_JobClass() == 2 && n_A_card[12] == 295) n_A_FLEE += 20;
  if (n_A_HEAD_REFINE >= 6 && n_A_Equip[2] == 1555) n_A_FLEE += 2;
  if (n_A_HEAD_REFINE >= 5 && n_A_Equip[2] == 1576) n_A_FLEE += 5;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1576) n_A_FLEE += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1541) n_A_FLEE += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1276) n_A_FLEE += 10;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1280) n_A_FLEE += 10;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1282) n_A_FLEE += 10;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1283) n_A_FLEE += 10;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1481) n_A_FLEE += 10;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1550) n_A_FLEE += 10;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1285) n_A_FLEE += 5;
  if (n_A_SHOULDER_REFINE >= 9 && n_A_card[12] == 271) n_A_FLEE += 20;
  if (n_A_SHOULDER_REFINE <= 4 && n_A_card[12] == 401) n_A_FLEE += 10;
  if (n_A_SHOULDER_REFINE >= 9 && n_A_card[12] == 403) n_A_FLEE += 5;
  if (n_A_Buf6[0] == 2 && n_A_Buf6[1] >= 1 && n_A_Bodyelement == 4) n_A_FLEE += 3 * n_A_Buf6[1];
  if (n_A_JOB == 8 || n_A_JOB == 14 || n_A_JOB == 22 || n_A_JOB == 28)
    n_A_FLEE += 4 * SkillSearch(SKILLID.IMPROVE_DODGE);
  else n_A_FLEE += 3 * SkillSearch(SKILLID.IMPROVE_DODGE);
  if (SkillSearch(SKILLID.GATLING_FEVER) && (n_A_WeaponType == 20 || n_A_WeaponType == 0))
    n_A_FLEE -= 5 * SkillSearch(SKILLID.GATLING_FEVER);
  n_A_FLEE += [0, 1, 3, 4, 6, 7, 9, 10, 12, 13, 15][SkillSearch(SKILLID.FLEE)];
  // -10% per ogni nemico oltre il primo, fino a 10
  if (c.B_num.value >= 2) {
    var altri = Math.min(1 * c.B_num.value - 1, 10);
    n_A_FLEE -= Math.floor((n_A_FLEE * altri * 10) / 100);
  }
  if (SkillSearch(SKILLID.FRENZY)) n_A_FLEE = Math.round(n_A_FLEE / 2);
  if (n_A_Buf6[11]) n_A_FLEE = Math.round(0.75 * n_A_FLEE);
  if (n_A_Buf6[12]) n_A_FLEE = 0;
  if (n_A_Buf6[14]) n_A_FLEE = 0;
  if (n_A_Buf6[15]) n_A_FLEE = 0;
  if (n_A_FLEE < 1) n_A_FLEE = 1;
  myInnerHtml("A_FLEE", n_A_FLEE, 0);
  myInnerHtml("A_WoeFLEE", Math.floor(0.8 * n_A_FLEE), 0);
}
// Perfect Dodge (n_A_LUCKY), scritto nella pagina
function calcolaPerfectDodge() {
  n_A_LUCKY = 1 + 0.1 * n_A_LUK;
  n_A_LUCKY += bonusValues[BONUSID.PERFECT_DODGE] + n_A_Buf9[38];
  if (n_A_Buf7[18]) n_A_LUCKY += 20;
  if (n_A_Buf3[0])
    n_A_LUCKY +=
      Math.round(n_A_Buf3[0] / 2) + Math.floor(n_A_Buf3[19] / 10) + Math.floor(n_A_Buf3[30] / 2);
  if (n_A_JobClass() == 1) n_A_LUCKY += 3 * CardNumSearch(354);
  if (n_A_JobClass() == 2 && n_A_card[13] == 391) n_A_LUCKY += 5;
  if (n_A_SHOULDER_REFINE > 6 && n_A_Equip[7] == 1724) n_A_LUCKY += n_A_SHOULDER_REFINE - 6;
  if (n_A_SHOULDER_REFINE <= 4 && n_A_card[12] == 401) n_A_LUCKY += 1;
  if (n_A_Equip[7] == 535) {
    var classe = n_A_JobClass();
    if (classe == 3 || classe == 4 || classe == 5) {
      n_A_LUCKY += 5;
      n_A_LUCKY += 2 * n_A_SHOULDER_REFINE;
    }
  }
  if (n_A_JobClass() == 41 && n_A_Equip[3] == 678) n_A_LUCKY += 2;
  n_A_LUCKY = Math.round(10 * n_A_LUCKY) / 10;
  if (n_A_LUCKY < 0) n_A_LUCKY = 0;
  myInnerHtml("A_LUCKY", n_A_LUCKY, 0);
}
// critico, e difesa dai critici subiti (CRITSHIELD), scritti nella pagina
function calcolaCritico() {
  n_A_CRI = 1 + Math.floor(n_A_LUK / 3);
  var bonus = uaroMaceMasteryCriticalBonus();
  bonus += bonusValues[BONUSID.CRIT] + n_A_Buf9[39];
  bonus += bonusValues[110 + targetData[2]];
  bonus += Math.floor(n_A_JobLV / 10) * CardNumSearch(492);
  if (n_A_JOB == 24) bonus += SkillSearch(SKILLID.FALCON_EYES);
  if (SkillSearch(SKILLID.FURY_SUPERNOVICE)) bonus += 50;
  bonus += 7 * (n_A_Buf7[16] + n_A_Buf7[19]);
  if (n_A_JobClass() == 2) bonus += 4 * CardNumSearch(328);
  if (n_A_WeaponType == 10) bonus += 5 * CardNumSearch(465);
  if (n_A_card[12] == 402) bonus += n_A_SHOULDER_REFINE;
  if (n_A_Equip[0] == 640) bonus += Math.floor(SU_LUK / 5);
  if (n_A_Equip[6] == 689) bonus += Math.floor(SU_LUK / 10);
  if (n_A_Equip[0] == 623) bonus += n_A_Weapon_refine;
  if (n_A_Equip[0] == 1161) bonus += 2 * SkillSearch(SKILLID.MACE_MASTERY);
  if (n_A_Equip[7] == 1709) bonus += n_A_SHOULDER_REFINE;
  if (SU_AGI >= 90) bonus += 10 * EquipNumSearch(EQUIPID.ROGUES_TREASURE);
  if (SU_LUK >= 80 && n_A_card[12] == 267) bonus += 3;
  if (SU_DEX >= 90 && n_A_Equip[0] == 1164) bonus += 5;
  if (n_A_WeaponType == 3 || n_A_WeaponType == 2) bonus += 5 * CardNumSearch(464);
  if (n_A_JobClass() == 6) bonus += 5 * EquipNumSearch(EQUIPID.MERCHANT_FIGURE);
  if (n_A_JobClass() == 41 && n_A_Equip[2] == 675) bonus += 5;
  if (n_A_JobClass() == 3 && (targetData[2] == 1 || targetData[2] == 6))
    bonus += 9 * CardNumSearch(253);
  if (n_A_HEAD_REFINE >= 6 && n_A_Equip[2] == 785) bonus += n_A_HEAD_REFINE - 5;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1612) bonus += 10;
  if (n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1555) bonus += 10;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1851) bonus += 2;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1851) bonus += 2;
  if (n_A_Weapon_refine >= 6 && targetData[2] == 7 && n_A_Equip[0] == 1091) bonus += 5;
  if (n_A_WeaponType == 10 && n_A_Arrow == 15) bonus += 20;
  if (n_A_WeaponType == 10 || (17 <= n_A_WeaponType && n_A_WeaponType <= 21))
    bonus += 15 * CardNumSearch(462);
  if (SkillSearch(SKILLID.FURY)) bonus += 7.5 + 2.5 * SkillSearch(SKILLID.FURY);
  else if (TimeItemNumSearch(34)) bonus += 10;
  n_A_CRI += bonus;
  if (n_A_Buf3[5])
    n_A_CRI += 10 + n_A_Buf3[5] + Math.floor(n_A_Buf3[35] / 2) + Math.floor(n_A_Buf3[25] / 10);
  if (n_A_WeaponType == 11) n_A_CRI *= 2;
  n_A_CRI = Math.round(10 * n_A_CRI) / 10;
  if (n_A_Buf6[9]) n_A_CRI = 0;
  myInnerHtml("A_CRI", n_A_CRI, 0);
  myInnerHtml("A_CRITSHIELD", Math.round(10 * (1 + 0.2 * n_A_LUK)) / 10, 0);
}
// MATK minima, media e massima (n_A_MATK; BK_n_A_MATK prima di Mind Breaker e Mystical
// Amplification), scritta nella pagina
function calcolaMATK() {
  var bonus = bonusValues[BONUSID.MATK] + n_A_Buf9[42];
  if (EQUIPID.CELINES_RIBBON_UARO == n_A_Equip[2]) bonus += n_A_HEAD_REFINE;
  if (n_A_Buf7[2]) bonus += 10;
  if (n_A_Buf7[17]) bonus += 5;
  if (n_A_Buf7[10] || n_A_Buf7[46]) bonus += 20;
  else if (n_A_Buf7[30]) bonus += 15;
  if (n_A_Equip[5] == 1785 && SU_INT > 97) bonus += 10;
  if (EQUIPID.GEFFENIA_WATER_BOOK == n_A_Equip[5] && SU_INT >= 90) bonus += 30;
  if (n_A_Equip[2] == 1492 && n_A_Equip[0] == 89) bonus += 10 * n_A_Weapon_refine;
  if (n_A_Equip[2] == 1492 && n_A_Equip[0] == 936) bonus += 10 * n_A_Weapon_refine;
  if (n_A_Equip[2] == 1561 && n_A_Equip[3] == 1563) bonus += 30;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1280) bonus += 15;
  if (n_A_SHOULDER_REFINE >= 7 && SU_INT >= 90 && n_A_Equip[7] == 1472) bonus += 30;
  if (n_A_SHOULDER_REFINE >= 9 && SU_INT >= 90 && n_A_Equip[7] == 1472) bonus += 20;
  var percento = 100 + bonusValues[BONUSID.MATK_PERCENT] + n_A_Buf9[43];
  if (c.A8_Skill14.value != 1) percento += Math.min(5, n_A_Buf2[2]);
  if (n_A_Buf6[2]) percento += 10;
  if (n_A_Equip[0] == 646) percento += Math.floor(n_A_Weapon_refine / 2);
  if (n_A_Equip[0] == 1682) percento += 3 * n_A_Weapon_refine;
  if (n_A_Equip[0] == 1083) percento += n_A_Weapon_refine;
  if (n_A_Equip[0] == 1173) percento += Math.floor(n_A_Weapon_refine / 2);
  if (n_A_Equip[0] == 1569) percento += n_A_Weapon_refine;
  if (n_A_Weapon_refine >= 7 && EQUIPID.MENTAL_STICK == n_A_Equip[0]) percento += 15;
  if (n_A_Weapon_refine >= 10 && EQUIPID.MENTAL_STICK == n_A_Equip[0]) percento += 20;
  if (EquipNumSearch(EQUIPID.SURVIVORS_MANTEAU_SURVIVORS_ROD_SET)) percento += n_A_Weapon_refine;
  if (EquipNumSearch(EQUIPID.GENTLEMAN_SET)) percento += n_A_Weapon_refine;
  if (n_A_JOB == 14 || n_A_JOB == 28) percento += 10 * CardNumSearch(479);
  if (n_A_Equip[0] == 484 && SU_INT >= 70) percento += 5;
  if (n_A_JobClass() == 5 && CardNumSearch(454)) percento += 3;
  if (n_A_HEAD_REFINE >= 9 && n_A_card[8] == 177) percento += 2;
  if (n_A_HEAD_REFINE >= 5 && n_A_Equip[2] == 1492) percento += 3;
  if (n_A_HEAD_REFINE >= 5 && n_A_Equip[2] == 1218) percento += n_A_HEAD_REFINE - 4;
  if (n_A_HEAD_REFINE >= 5 && n_A_Equip[2] == 1495) percento += n_A_HEAD_REFINE - 4;
  if (n_A_HEAD_REFINE >= 6 && n_A_Equip[2] == 1029) percento += n_A_HEAD_REFINE - 5;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 565) percento += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1284) percento += 3;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1482) percento += 3;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1286) percento += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1287) percento += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1483) percento += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1484) percento += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1485) percento += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1277) percento += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1548) percento += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1281) percento += 8;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1478) percento += 8;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1551) percento += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1292) percento += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1293) percento += 1;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1492) percento += 3;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1407) percento += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1842) percento += 3;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1842) percento += 3;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1407) percento += 2;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1284) percento += 5;
  if (n_A_HEAD_REFINE == 10 && n_A_Equip[2] == 1289) percento += 4;
  if (n_A_Weapon_refine >= 9 && n_A_Equip[0] == 642) percento += 3;
  if (n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1084) percento += 5;
  if (n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1095) percento += 5;
  if (n_A_JobClass2() == 14 || n_A_JOB == 44)
    percento += 15 * EquipNumSearch(EQUIPID.BRAVE_ASSASSIN_DAMASCUS);
  if (n_A_JobClass2() == 14 || n_A_JOB == 44)
    percento += 15 * EquipNumSearch(EQUIPID.VALOROUS_ASSASSIN_DAMASCUS);
  if (n_A_Equip[2] == 1799) {
    var classe = n_A_JobClass();
    if (classe == 3 || classe == 5) {
      percento += 8;
      bonusValues[BONUSID.ALL_HEAL_PERCENT] += 7;
    }
    if (classe == 4) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 10;
  }
  // minima da INT / 7, massima da INT / 5; la media alla fine
  var settimi = Math.floor(n_A_INT / 7),
    quinti = Math.floor(n_A_INT / 5);
  n_A_MATK = [n_A_INT + settimi * settimi, 0, n_A_INT + quinti * quinti];
  var ogni = (f) => {
    n_A_MATK[0] = f(n_A_MATK[0]);
    n_A_MATK[2] = f(n_A_MATK[2]);
  };
  ogni((x) => Math.floor(((x + bonus) * percento) / 100));
  if (n_A_Equip[2] == 849) ogni((x) => x + Math.floor((x * Math.floor(n_A_HEAD_REFINE / 2)) / 100));
  BK_n_A_MATK = [n_A_MATK[0], 0, n_A_MATK[2]];
  if (BK_n_A_MATK[0] != BK_n_A_MATK[2]) BK_n_A_MATK[2] -= 1;
  BK_n_A_MATK[1] = (BK_n_A_MATK[2] + BK_n_A_MATK[0]) / 2;
  if (n_A_Buf6[4]) ogni((x) => Math.floor((x * (100 + 20 * n_A_Buf6[4])) / 100));
  if (SkillSearch(SKILLID.MYSTICAL_AMPLIFICATION))
    ogni((x) => Math.floor(x * (1 + 0.05 * SkillSearch(SKILLID.MYSTICAL_AMPLIFICATION))));
  myInnerHtml("A_MATK", n_A_MATK[0] + "~" + n_A_MATK[2], 0);
  if (n_A_MATK[0] != n_A_MATK[2]) n_A_MATK[2] -= 1;
  n_A_MATK[1] = (n_A_MATK[2] + n_A_MATK[0]) / 2;
}
// velocita' di movimento in percentuale, scritta nella pagina
function calcolaVelocita() {
  var cavallo = SkillSearch(SKILLID.CAVALIER_MASTERY) != 0;
  var velocita = 100;
  if (n_A_Equip[2] == 1324 && cavallo) velocita *= 1.96;
  else if (bonusValues[209] || n_A_Buf2[1] || n_A_Buf7[26]) velocita *= 1.4;
  else if (n_A_Buf2[9] || SkillSearch(SKILLID.WIND_WALKER)) velocita *= 1.24;
  else if (CardNumSearch(451)) velocita *= 1.05;
  if (n_A_Equip[2] != 1324 && cavallo) velocita *= 1.4;
  if (n_A_Equip[2] == 1324 && !cavallo) velocita *= 1.4;
  // uaRO: Bastion Movement Speed, +20% che si somma agli altri bonus (patch del 03/06/2026)
  if (HasBastionEnchant(BASTIONENCHANTID.MOVEMENT_SPEED)) velocita += 20;
  velocita -= 10 * n_A_Buf6[19];
  if (n_A_Buf3[37])
    velocita -= 2 * n_A_Buf3[37] + Math.floor(n_A_Buf3[39] / 10) + Math.round(n_A_Buf3[27] / 2);
  if (n_A_Buf6[22]) velocita = 25;
  else if (SkillSearch(SKILLID.MENTAL_STRENGTH)) velocita = 20;
  myInnerHtml("A_MovSPEED", velocita + " %", 0);
}
// ASPD, scritta nella pagina, e ritardo dell'attacco normale (n_Delay[1], sandanDelay)
function calcolaASPD() {
  if (n_A_Equip[0] == EQUIPID.CATAPULT) {
    var extra = (n_A_Weapon_refine >= 7 ? 10 : 0) + (n_A_Weapon_refine >= 10 ? 10 : 0);
    bonusValues[BONUSID.ASPD] += extra;
    bonusValues[BONUSID.RANGED_ATK_PERCENT] += extra;
  }
  var percento = percentualeASPD(),
    ritardo;
  if (n_Nitou == 1) {
    if (n_A_WeaponType == 0 && n_A_Weapon2Type != 0)
      ritardo = 50 * m_JobASPD[n_A_JOB][n_A_Weapon2Type];
    else ritardo = 35 * (m_JobASPD[n_A_JOB][n_A_WeaponType] + m_JobASPD[n_A_JOB][n_A_Weapon2Type]);
  } else ritardo = 50 * m_JobASPD[n_A_JOB][n_A_WeaponType];
  n_A_ASPD =
    200 -
    (ritardo -
      (Math.round((ritardo * n_A_AGI) / 25) + Math.round((ritardo * n_A_DEX) / 100)) / 10) *
      (1 - percento / 100);
  var fisso = n_A_Buf9[24];
  fisso += EquipNumSearch(EQUIPID.VALENTINE_PLEDGE);
  if (n_A_Buf2[15]) fisso -= 25 - 5 * n_A_Buf2[15];
  if (n_A_Equip[0] == 47) fisso += 2;
  if (EQUIPID.ALCA_BRINGER == n_A_Equip[0]) fisso += Math.floor(n_A_Weapon_refine / 2);
  if (n_A_Equip[4] == 1632) fisso += 1;
  if (n_A_Equip[2] == 1844) fisso += 1;
  if (EquipNumSearch(EQUIPID.WHITE_WING_SET_ARO)) fisso += 2;
  if (EquipNumSearch(EQUIPID.BLACK_WING_SET_ARO)) fisso -= 7;
  if (EquipNumSearch(EQUIPID.DEMON_SET)) fisso += 1;
  if (SU_AGI >= 120 && EquipNumSearch(EQUIPID.FAIRY_EARS_BRO)) fisso += 1;
  if (SU_AGI >= 120 && EquipNumSearch(EQUIPID.KERCHIEF)) fisso += 1;
  if (SU_STR >= 120 && EquipNumSearch(EQUIPID.SKULL_RING)) fisso += 1;
  if (n_A_WeaponType == 3 && n_A_Weapon_refine >= 10) fisso += CardNumSearch(525);
  if (n_A_WeaponType == 3 && n_A_Weapon_refine >= 14) fisso += CardNumSearch(525);
  if (n_A_WeaponType == 10 && n_A_Weapon_refine >= 10) fisso += CardNumSearch(528);
  if (n_A_WeaponType == 10 && n_A_Weapon_refine >= 14) fisso += CardNumSearch(528);
  if (n_A_SHOULDER_REFINE >= 9 && SU_AGI >= 90 && n_A_Equip[7] == 1472) fisso += 1;
  if (SkillSearch(SKILLID.FIGHTING_SPIRIT)) fisso += (SkillSearch(SKILLID.RUNE_MASTERY) / 10) * 4;
  if (
    SkillSearch(SKILLID.SUMMON_TYPE) == 1 &&
    SkillSearch(SKILLID.SUMMON_LEVEL) > 0 &&
    SkillSearch(SKILLID.SPIRIT_CONTROL) == 1
  )
    fisso += 5;
  n_A_ASPD += fisso;
  if (thirdClass === 1 && n_A_ASPD > 193) n_A_ASPD = 193;
  else if (n_A_ASPD > 190 + 1 * c.maxASPD.value) n_A_ASPD = 190 + 1 * c.maxASPD.value;
  n_A_ASPD = Math.floor(10 * n_A_ASPD) / 10;
  myInnerHtml("A_ASPD", n_A_ASPD, 0);
  n_A_ASPD = (200 - n_A_ASPD) / 50;
  n_Delay[1] = Math.floor(1000 * n_A_ASPD) / 1000;
  if (SKILLID.ENVENOM == n_A_ActiveSkill) n_Delay[1] = Math.floor(75 * n_A_ASPD) / 100;
  sandanDelay = 0;
  if (SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW) && SKILLID.BASIC_ATTACK == n_A_ActiveSkill) {
    sandanDelay = (1000 - 4 * n_A_AGI - 2 * n_A_DEX) / 1000;
    if (SkillSearch(SKILLID.ADD_DELAY_TIME))
      sandanDelay = Math.round(1000 * sandanDelay + 300) / 1000;
  }
}
// ASPD in percentuale: equipaggiamento, skill che accelerano, canti e pozioni
function percentualeASPD() {
  var percento = bonusValues[BONUSID.ASPD] + n_A_Buf9[44];
  if (n_A_Equip[0] == 624) percento += n_A_Weapon_refine;
  if (n_A_Equip[0] == 641) percento += n_A_Weapon_refine;
  if (n_A_Equip[0] == 654) percento += Math.floor(SU_AGI / 14);
  if (n_A_Equip[0] == 484 && SU_STR >= 50) percento += 5;
  if (SU_STR >= 77 && n_A_Equip[0] == 944) percento += 4;
  if (SU_STR >= 95 && n_A_Equip[0] == 621) percento -= 40;
  if (SU_STR >= 95 && n_A_Equip[0] == 1167) percento += 3;
  if (n_A_JOB == 21 && EquipNumSearch(EQUIPID.TOURNAMENT_SHIELD_SYSTEM_SET)) percento -= 5;
  if (n_A_JobClass() == 2) percento += 3 * EquipNumSearch(EQUIPID.THIEF_FIGURE);
  if (EquipNumSearch(EQUIPID.COLD_HEART_SET_UARO)) percento += Math.floor(n_A_Weapon_refine / 2);
  if (n_A_Equip[0] == 903 && n_A_JobClass2() == 13) percento += 20;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1842) percento += 3;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1283) percento += 3;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1481) percento += 3;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1288) percento += 2;
  if (n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1290) percento += 2;
  if (n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1555) percento += 8;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1851) percento += 2;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1851) percento += 2;
  if (n_A_HEAD_REFINE == 10 && n_A_Equip[2] == 1290) percento += 2;
  if (n_A_Weapon_refine >= 6 && n_A_Equip[0] == 1081) percento += 10;
  if (n_A_Weapon_refine >= 6 && n_A_Equip[0] == 1086) percento += 5;
  if (n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1086) percento += 5;
  if (n_A_Weapon_refine >= 6 && n_A_Equip[0] == 1088) percento += 5;
  if (n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1088) percento += 5;
  if (n_A_Weapon_refine >= 7 && n_A_Equip[0] == 1077) percento += 5;
  if (n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1077) percento += 5;
  if (n_A_Weapon2_refine >= 7 && n_A_Equip[1] == 1077) percento += 5;
  if (n_A_Weapon2_refine >= 9 && n_A_Equip[1] == 1077) percento += 5;
  if (n_A_SHOULDER_REFINE >= 7 && SU_AGI >= 90 && n_A_Equip[7] == 1472) percento += 8;
  var accelerato = 0;
  if (n_A_Buf6[19] == 0 && n_A_Buf6[20] == 0) {
    if (n_A_WeaponType == 3 && SkillSearch(SKILLID.TWOHAND_QUICKEN)) {
      percento += 30;
      accelerato = 1;
    }
    if (n_A_WeaponType == 2 && SkillSearch(SKILLID.ONE_HAND_QUICKEN_SOUL_LINKED)) {
      percento += 30;
      accelerato = 1;
    }
    // uaRO: Adrenaline Rush vale anche con le spade a una mano (Class Changes, Blacksmith)
    if (
      ((6 <= n_A_WeaponType && n_A_WeaponType <= 8) || n_A_WeaponType == 2) &&
      SkillSearch(SKILLID.ADRENALINE_RUSH)
    ) {
      percento += 30;
      accelerato = 1;
    }
    if (accelerato == 0 && SkillSearch(SKILLID.FULL_ADRENALINE_RUSH)) {
      percento += 30;
      accelerato = 1;
    }
    if (
      accelerato == 0 &&
      (TimeItemNumSearch(5) || TimeItemNumSearch(28)) &&
      n_A_WeaponType > 5 &&
      n_A_WeaponType < 9
    ) {
      percento += 30;
      accelerato = 1;
    }
    if (n_A_WeaponType == 5 && SkillSearch(SKILLID.SPEAR_QUICKEN)) {
      percento += SkillSearch(SKILLID.SPEAR_QUICKEN) + 20;
      accelerato = 1;
    }
  }
  if (SkillSearch(SKILLID.CAVALIER_MASTERY))
    percento -= 10 * (6 - SkillSearch(SKILLID.CAVALIER_MASTERY));
  percento += Math.round(SkillSearch(SKILLID.SINGLE_ACTION) / 2);
  if (n_A_WeaponType == 12 && SkillSearch(SKILLID.STUDY))
    percento += SkillSearch(SKILLID.STUDY) / 2;
  if (SkillSearch(SKILLID.MENTAL_STRENGTH)) percento -= 25;
  if (SkillSearch(SKILLID.FRENZY)) percento += 30;
  if (SkillSearch(SKILLID.LAST_STAND)) percento += 20;
  if (SkillSearch(SKILLID.GATLING_FEVER) && (n_A_WeaponType == 20 || n_A_WeaponType == 0))
    percento += 2 * SkillSearch(SKILLID.GATLING_FEVER);
  if (n_A_Buf3[37]) percento -= 3 * n_A_Buf3[37] + Math.floor(n_A_Buf3[38] / 10) + n_A_Buf3[27] + 5;
  var stellar = 0;
  if (SkillSearch(SKILLID.STELLAR_PROTECTION))
    stellar += Math.floor((n_A_BaseLV + n_A_LUK + n_A_DEX) / 10);
  var adrenalina = 0;
  if (n_A_Buf6[19] == 0 && n_A_Buf6[20] == 0 && accelerato == 0) {
    if (
      n_A_Buf2[6] != 2 ||
      n_A_WeaponType == 10 ||
      (17 <= n_A_WeaponType && n_A_WeaponType <= 21)
    ) {
      // uaRO: anche ricevuto dal party, con le spade a una mano (Class Changes, Blacksmith)
      if ((6 <= n_A_WeaponType && n_A_WeaponType <= 8) || n_A_WeaponType == 2) {
        if (n_A_Buf2[6] == 1) {
          adrenalina = 25;
          accelerato = 1;
        } else if (n_A_Buf2[6] == 3) {
          adrenalina = 30;
          accelerato = 1;
        }
      }
    } else {
      adrenalina = 25;
      accelerato = 1;
    }
  }
  var assassinCross = 0;
  if (
    n_A_Buf3[1] &&
    (accelerato == 0 || adrenalina) &&
    n_A_WeaponType != 10 &&
    !(17 <= n_A_WeaponType && n_A_WeaponType <= 21)
  )
    assassinCross +=
      10 + n_A_Buf3[1] + Math.round(n_A_Buf3[31] / 2) + Math.round(n_A_Buf3[21] / 10);
  if (SkillSearch(SKILLID.SLS_SHADOW) && n_A_JobLV >= 50)
    percento += Math.max(adrenalina, assassinCross) + 3 * SkillSearch(SKILLID.SLS_SHADOW) + stellar;
  else percento += Math.max(adrenalina, assassinCross, stellar);
  var pozione = 0;
  if (n_A_Buf7[35] == 4 && n_A_JOB == 22) pozione = 25;
  else if (n_A_Buf7[35] == 3) pozione = 20;
  else if (n_A_Buf7[44] || n_A_Buf7[35] == 2) pozione = 15;
  else if (n_A_Buf7[26] || n_A_Buf7[35] == 1) pozione = 10;
  percento += pozione;
  return percento;
}
// tempi di lancio e after cast delay, scritti nella pagina (n_A_CAST, n_B_Cast, AC_I)
function calcolaLancio() {
  n_A_CAST = 1 - n_A_DEX / 150;
  if (n_A_CAST < 0) n_A_CAST = 0;
  var lancio = 100;
  lancio += bonusValues[BONUSID.CAST_TIME_PERCENT] - n_A_Buf9[26];
  if (EquipNumSearch(EQUIPID.SPIRITUAL_RING_WIZARDRY_SOUL_STAFF_SET)) lancio -= n_A_Weapon_refine;
  if (EquipNumSearch(EQUIPID.BLACK_CAT) & EquipNumSearch(EQUIPID.ROGUES_TREASURE))
    lancio -= n_A_Weapon_refine / 2;
  if (n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1084) lancio -= 5;
  if (n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1095) lancio -= 5;
  if (n_A_Weapon_refine == 10 && EquipNumSearch(EQUIPID.SKULL_CAP_EVIL_BONE_WAND_THORN_STAFF_SET))
    lancio -= 10;
  if (n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1279) lancio -= 3;
  if (n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1476) lancio -= 3;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1289) lancio -= 3;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1289) lancio -= 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1842) lancio -= 5;
  if (n_A_JobClass() == 5 && CardNumSearch(454)) lancio -= 15;
  if ((n_A_JOB == 18 || n_A_JOB == 32) && CardNumSearch(460)) lancio -= 15;
  if (n_A_card[8] == 177) lancio -= n_A_HEAD_REFINE;
  // A Poem of Bragi (n_A_Buf3[2]): nb_tok e' la riduzione mostrata
  nb_tok = 0;
  if (n_A_Buf3[2] != 0) {
    var bragi = 3 * n_A_Buf3[2] + n_A_Buf3[32] + Math.floor(n_A_Buf3[22] / 10);
    lancio -= (lancio / 100) * (bragi / 100) * 100;
    nb_tok += (bragi / 100) * 100;
  }
  if ((lancio -= 50 * TimeItemNumSearch(1)) < 0) lancio = 0;
  n_B_Cast = lancio;
  n_A_CAST *= lancio / 100;
  var skill = 100;
  if (StPlusCalc2(7000 + n_A_ActiveSkill) != 0) skill -= StPlusCalc2(7000 + n_A_ActiveSkill);
  if (StPlusCard(7000 + n_A_ActiveSkill) != 0) skill -= StPlusCard(7000 + n_A_ActiveSkill);
  if (
    (SKILLID.GUILLOTINE_FIST_MAX_SP == n_A_ActiveSkill ||
      SKILLID.GUILLOTINE_FIST == n_A_ActiveSkill) &&
    SkillSearch(SKILLID.FURY) &&
    n_A_Weapon_refine >= 9 &&
    EquipNumSearch(EQUIPID.GLORIOUS_FIST)
  )
    skill -= 100;
  if (skill < 0) skill = 0;
  n_A_CAST *= skill / 100;
  if (n_A_Buf2[10]) n_A_CAST *= (100 - 15 * n_A_Buf2[10]) / 100;
  if (SkillSearch(SKILLID.MEMORIZE)) n_A_CAST /= 2;
  if (n_A_Equip[0] == 936)
    bonusValues[BONUSID.ACD_REDUCTION_PERCENT] += 3 * Math.floor(n_A_Weapon_refine / 2);
  if (n_A_Equip[0] == 934 && n_A_Weapon_refine >= 9)
    bonusValues[BONUSID.ACD_REDUCTION_PERCENT] += 20;
  if (n_A_Equip[2] == 1036 && n_A_HEAD_REFINE >= 6)
    bonusValues[BONUSID.ACD_REDUCTION_PERCENT] += n_A_HEAD_REFINE - 5;
  if (EquipNumSearch(EQUIPID.SAKURA_CORONET_PLUS_ROMANTIC_LEAF) && n_A_HEAD_REFINE >= 5)
    bonusValues[BONUSID.ACD_REDUCTION_PERCENT] += n_A_HEAD_REFINE - 4;
  if (n_A_Equip[0] == 1084 && n_A_Weapon_refine >= 9)
    bonusValues[BONUSID.ACD_REDUCTION_PERCENT] += 5;
  if (n_A_Equip[0] == 1095 && n_A_Weapon_refine >= 9)
    bonusValues[BONUSID.ACD_REDUCTION_PERCENT] += 5;
  if (EQUIPID.GIGANTIC_LANCE == n_A_Equip[0])
    bonusValues[BONUSID.ACD_REDUCTION_PERCENT] +=
      15 * Math.min(Math.max(n_A_Weapon_refine - 6, 0), 3);
  if (EQUIPID.GIANT_SHIELD == n_A_Equip[5] && n_A_LEFT_REFINE >= 9) bonusValues[192] += 10;
  if (EQUIPID.ELDERS_STAFF == n_A_Equip[0] && n_A_Weapon_refine >= 10)
    bonusValues[BONUSID.ACD_REDUCTION_PERCENT] += 15;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1842) bonusValues[BONUSID.ACD_REDUCTION_PERCENT] += 5;
  // after cast delay: AC_I dall'equipaggiamento, bonusValues[BONUSID.ACD_REDUCTION_PERCENT] da A Poem of Bragi
  AC_I = bonusValues[BONUSID.ACD_REDUCTION_PERCENT] + n_A_Buf9[27];
  var livello = n_A_Buf3[2];
  bonusValues[BONUSID.ACD_REDUCTION_PERCENT] = livello
    ? (livello == 10 ? 5 : 3) * livello + 2 * n_A_Buf3[32] + Math.floor(n_A_Buf3[29] / 5)
    : 0;
  if (AC_I > 100) AC_I = 100;
  if (bonusValues[BONUSID.ACD_REDUCTION_PERCENT] > 100)
    bonusValues[BONUSID.ACD_REDUCTION_PERCENT] = 100;
  var testo =
    '<span class=name style="color:var(--color-positive);">' +
    Math.floor(10000 * n_A_CAST) / 100 +
    " % <span class=nametext>" +
    skillName(204) +
    ": " +
    nb_tok +
    "%<br>Gear: " +
    -bonusValues[BONUSID.CAST_TIME_PERCENT] +
    "%<br>DEX: " +
    n_A_DEX +
    " </span></span>";
  myInnerHtml("A_cTime", testo, 0);
  testo =
    '<span class=name style="color:var(--color-positive);">' +
    Math.floor(100 - AC_I - ((100 - AC_I) * bonusValues[BONUSID.ACD_REDUCTION_PERCENT]) / 100) +
    " % <span class=nametext>" +
    skillName(204) +
    ": " +
    bonusValues[BONUSID.ACD_REDUCTION_PERCENT] +
    "%<br>Gear: " +
    AC_I +
    "%</span></span>";
  myInnerHtml("A_cDelay", testo, 0);
}
// peso trasportabile oltre 2000
var PESO_CLASSE = [
  0, 800, 400, 400, 600, 200, 800, 800, 400, 600, 700, 400, 1000, 800, 400, 600, 700, 700, 400,
  1000, 0, 800, 400, 600, 700, 400, 1000, 800, 400, 600, 700, 700, 400, 1000, 0, 0, 0, 0, 0, 0, 0,
  800, 800, 400, 600, 800,
];
// peso trasportato, in centesimi di percentuale del massimo, scritto nella pagina
function calcolaPeso() {
  var limite = 2000 + PESO_CLASSE[n_A_JOB];
  if (1 * c.A_adopted.checked) limite = 2000;
  // uaRO: Super Novice: +2000 di peso trasportabile (Class Changes, Super Novice)
  if (n_A_JOB == 20) limite += 2000;
  limite += 1 * c.A_STR.value * 30;
  limite += 1000 * SkillSearch(SKILLID.CAVALIER_MASTERY);
  limite += 200 * SkillSearch(SKILLID.ENLARGE_WEIGHT_LIMIT);
  limite *= 1 + 0.1 * SkillSearch(SKILLID.SLS_COURIER);
  limite = Math.floor(limite) + 200 * SkillSearch(SKILLID.ENLARGE_WEIGHT_LIMIT_R);
  var peso = n_A_Buf9[28];
  for (var i = 0; i <= 10; i++) peso += itemData[n_A_Equip[i]].weight;
  var carico = Math.floor((10000 * peso) / limite);
  var colore = carico < 5000 ? "var(--color-positive)" : "var(--color-negative)";
  myInnerHtml(
    "A_Weight",
    '<span class=name style="color:' +
      colore +
      ';">' +
      carico / 100 +
      " %<span class=nametext>" +
      peso +
      " / " +
      limite +
      "</span></span>",
    0,
  );
  return carico;
}
// rigenerazione in piu' da una skill o da un oggetto: " + valore", con la spiegazione al passaggio
// del mouse
function voceRigenerazione(colore, valore, spiegazione) {
  return (
    ' + <span class=name style="color:' +
    colore +
    ';">' +
    valore +
    "<span class=nametext>" +
    spiegazione +
    "</span></span>"
  );
}
// rigenerazione degli HP, con quella delle skill, scritta nella pagina
function rigenerazioneHP(carico) {
  n_A_HPR = Math.floor(n_A_VIT / 5) + Math.floor(n_A_MaxHP / 200);
  if (n_A_HPR < 1) n_A_HPR = 1;
  var percento = 100;
  percento += bonusValues[BONUSID.HP_RECOVERY_PERCENT] + n_A_Buf9[45];
  if (SU_LUK >= 77) percento += 100 * CardNumSearch(221);
  if (n_A_JobClass() == 41 && n_A_Equip[2] == 672) percento += 3;
  if (n_A_SHOES_REFINE <= 4 && n_A_card[13] == 407) percento += 5;
  n_A_HPR = Math.floor((n_A_HPR * percento) / 100);
  if (carico >= 5000 || n_A_Buf6[21] || n_A_Buf6[17] || n_A_card[11] == 333) n_A_HPR = 0;
  var extra = "";
  var voce = (valore, spiegazione) =>
    (extra += voceRigenerazione("var(--color-positive)", valore, spiegazione));
  var livello = SkillSearch(SKILLID.PEACEFUL_BREAK);
  if (livello) {
    if (n_A_Buf6[21]) voce(0, "Poison");
    else
      voce(
        Math.floor((30 + 0.3 * n_A_VIT) * livello) + 30,
        skillName(340) +
          " Lvl " +
          livello +
          "<br>(while sitting beside another Taekwon-type player, and with /doridori)<br>Each 10 seconds",
      );
  }
  livello = SkillSearch(SKILLID.SPIRITUAL_CADENCE);
  if (livello) {
    if (carico >= 9000) voce(0, "Over 90% weight");
    else if (n_A_Buf6[21]) voce(0, "Poison");
    else
      voce(
        Math.floor((4 + n_A_MaxHP / 500) * livello),
        skillName(184) + " Lvl " + livello + "<br>Each " + (carico < 5000 ? 10 : 20) + " seconds",
      );
  }
  livello = SkillSearch(SKILLID.INCREASED_HP_RECOVERY);
  if (livello || EquipNumSearch(EQUIPID.BEER_HAT)) {
    if (carico >= 5000) voce(0, "Overweight");
    else if (n_A_Buf6[21]) voce(0, "Poison");
    else if (EquipNumSearch(EQUIPID.BEER_HAT) && livello < 3)
      voce(
        Math.floor(3 * (5 + n_A_MaxHP / 500)),
        "Increase HP Recovery Lvl 3 (Beer Hat)<br>Each 10 seconds",
      );
    else if (livello)
      voce(
        Math.floor((5 + n_A_MaxHP / 500) * livello),
        "Increase HP Recovery Lvl " + livello + "<br>Each 10 seconds",
      );
  }
  myInnerHtml("A_HPR", n_A_HPR + extra, 0);
}
// rigenerazione degli SP, con quella delle skill, scritta nella pagina
function rigenerazioneSP(carico) {
  n_A_SPR = Math.floor(n_A_INT / 6) + Math.floor(n_A_MaxSP / 100) + 1;
  var percento = 100;
  percento += 3 * SkillSearch(SKILLID.MEDIATIO);
  percento += bonusValues[BONUSID.SP_RECOVERY_PERCENT] + n_A_Buf9[46];
  if (SU_LUK >= 77) percento += 100 * CardNumSearch(221);
  if (n_A_card[9] == 179) percento += 5;
  if (n_A_card[16] == 179) percento += 5;
  if (n_A_card[17] == 179) percento += 5;
  if (n_A_card[18] == 179) percento += 5;
  if (n_A_JobClass() == 5) percento += 5 * EquipNumSearch(EQUIPID.MAGICIAN_FIGURE);
  if (n_A_JobClass() == 41 && n_A_Equip[2] == 673) percento += 3;
  if (n_A_HEAD_REFINE <= 4 && n_A_card[8] == 179) percento += 5;
  if (n_A_SHOES_REFINE <= 4 && n_A_card[13] == 407) percento += 5;
  n_A_SPR = Math.floor((n_A_SPR * percento) / 100);
  if (n_A_INT >= 120) n_A_SPR += Math.floor((n_A_INT - 120) / 2) + 4;
  if (carico >= 5000 || n_A_Buf6[21] || n_A_Buf6[17] || CardNumSearch(334)) n_A_SPR = 0;
  var extra = "";
  var voce = (valore, spiegazione) => (extra += voceRigenerazione("blue", valore, spiegazione));
  var livello = SkillSearch(SKILLID.HAPPY_BREAK);
  if (livello) {
    if (n_A_Buf6[21]) voce(0, "Poison");
    else
      voce(
        Math.floor((3 + n_A_MaxSP / 500) * livello * (1 + 0.1 * SkillSearch(SKILLID.KAINA))) + 3,
        skillName(341) +
          " Lvl " +
          livello +
          "<br>(while sitting beside another Taekwon-type player, and with /doridori)<br>Each 10 seconds",
      );
  }
  livello = SkillSearch(SKILLID.SPIRITUAL_CADENCE);
  if (livello) {
    if (carico >= 9000) voce(0, "Over 90% weight");
    else if (n_A_Buf6[21]) voce(0, "Poison");
    else
      voce(
        Math.floor((2 + n_A_MaxSP / 500) * livello),
        skillName(184) + " Lvl " + livello + "<br>Each " + (carico < 5000 ? 10 : 20) + " seconds",
      );
  }
  livello = SkillSearch(SKILLID.NINJA_MASTERY);
  if (livello) {
    if (carico >= 5000) voce(0, "Overweight");
    else if (n_A_Buf6[21]) voce(0, "Poison");
    else voce(Math.floor((3 + n_A_MaxSP / 500) * livello), "Ninja Mastery Lvl " + livello);
  }
  livello = SkillSearch(SKILLID.INCREASED_SP_RECOVERY);
  if (livello || EquipNumSearch(EQUIPID.BEER_HAT)) {
    if (carico >= 5000) voce(0, "Overweight");
    else if (n_A_Buf6[21]) voce(0, "Poison");
    else if (EquipNumSearch(EQUIPID.BEER_HAT) && livello < 3)
      voce(
        Math.floor(3 * (3 + n_A_MaxSP / 500)),
        "Increase SP Recovery Lvl 3 (Beer Hat)<br>Each 10 seconds",
      );
    else if (livello)
      voce(
        Math.floor((3 + n_A_MaxSP / 500) * livello),
        "Increase SP Recovery Lvl " + livello + "<br>Each 10 seconds",
      );
  }
  myInnerHtml("A_SPR", n_A_SPR + extra, 0);
}
// bonus dopo le statistiche: danni per elemento, razza e taglia, resistenze, cure
function bonusFinali() {
  var i;
  if (m_Arrow[n_A_Arrow][2] == "Holy Arrow") bonusValues[BONUSID.DMG_DEMON_PERCENT] += 5;
  if (n_A_Weapon_refine >= 6) {
    if (
      n_A_Equip[0] == 1076 ||
      n_A_Equip[0] == 1077 ||
      n_A_Equip[0] == 1081 ||
      n_A_Equip[0] == 1082 ||
      n_A_Equip[0] == 1086 ||
      (1088 <= n_A_Equip[0] && n_A_Equip[0] <= 1094) ||
      n_A_Equip[0] == 1096 ||
      n_A_Equip[0] == 1097 ||
      (1099 <= n_A_Equip[0] && n_A_Equip[0] <= 1103)
    ) {
      if (n_A_Weapon_refine == 6) bonusValues[BONUSID.DMG_DEMI_HUMAN_PERCENT] += 4;
      if (n_A_Weapon_refine == 7) bonusValues[BONUSID.DMG_DEMI_HUMAN_PERCENT] += 9;
      if (n_A_Weapon_refine == 8) bonusValues[BONUSID.DMG_DEMI_HUMAN_PERCENT] += 16;
      if (n_A_Weapon_refine == 9) bonusValues[BONUSID.DMG_DEMI_HUMAN_PERCENT] += 25;
      if (n_A_Weapon_refine >= 10) bonusValues[BONUSID.DMG_DEMI_HUMAN_PERCENT] += 36;
    }
    if (n_A_Equip[0] == 1080 || n_A_Equip[0] == 1087 || n_A_Equip[0] == 1098) {
      if (n_A_Weapon_refine == 6) bonusValues[BONUSID.DMG_DEMI_HUMAN_PERCENT] += 9;
      if (n_A_Weapon_refine == 7) bonusValues[BONUSID.DMG_DEMI_HUMAN_PERCENT] += 16;
      if (n_A_Weapon_refine == 8) bonusValues[BONUSID.DMG_DEMI_HUMAN_PERCENT] += 25;
      if (n_A_Weapon_refine == 9) bonusValues[BONUSID.DMG_DEMI_HUMAN_PERCENT] += 36;
      if (n_A_Weapon_refine >= 10) bonusValues[BONUSID.DMG_DEMI_HUMAN_PERCENT] += 49;
    }
  }
  if (n_A_Buf7[42]) {
    bonusValues[150] += 10 * n_A_Buf7[42];
    bonusValues[151] += 10 * n_A_Buf7[42];
    bonusValues[152] += 10 * n_A_Buf7[42];
    bonusValues[153] += 10 * n_A_Buf7[42];
    bonusValues[154] += 10 * n_A_Buf7[42];
    bonusValues[155] += 10 * n_A_Buf7[42];
    bonusValues[156] += 10 * n_A_Buf7[42];
    bonusValues[157] += 10 * n_A_Buf7[42];
    bonusValues[158] += 10 * n_A_Buf7[42];
    bonusValues[159] += 10 * n_A_Buf7[42];
  }
  if (n_A_Buf9[54]) {
    bonusValues[170] += n_A_Buf9[54];
    bonusValues[171] += n_A_Buf9[54];
    bonusValues[172] += n_A_Buf9[54];
    bonusValues[173] += n_A_Buf9[54];
    bonusValues[174] += n_A_Buf9[54];
    bonusValues[175] += n_A_Buf9[54];
    bonusValues[176] += n_A_Buf9[54];
    bonusValues[177] += n_A_Buf9[54];
    bonusValues[178] += n_A_Buf9[54];
    bonusValues[179] += n_A_Buf9[54];
  }
  bonusValues[BONUSID.RANGED_ATK_PERCENT] += n_A_Buf9[56];
  bonusValues[BONUSID.CRIT_DMG_PERCENT] += n_A_Buf9[57];
  if (SkillSearch(SKILLID.FAITH))
    bonusValues[BONUSID.RESIST_HOLY_PERCENT] += 5 * SkillSearch(SKILLID.FAITH);
  if (SkillSearch(SKILLID.DRAGONOLOGY))
    bonusValues[BONUSID.RESIST_DRAGON_PERCENT] += 4 * SkillSearch(SKILLID.DRAGONOLOGY);
  if (SkillSearch(SKILLID.DRAGONOLOGY))
    bonusValues[BONUSID.DMG_DRAGON_PERCENT] += 4 * SkillSearch(SKILLID.DRAGONOLOGY);
  if (n_A_Buf7[45]) bonusValues[100] += 20;
  if (n_A_JobClass() == 2)
    bonusValues[BONUSID.CRIT_DMG_PERCENT] += CardNumSearch(550) * Math.floor(n_A_HEAD_REFINE / 2);
  if (n_A_Equip[0] == 624) bonusValues[191] += n_A_Weapon_refine;
  if (n_A_Equip[0] == 1089) bonusValues[BONUSID.CRIT_DMG_PERCENT] += 2 * n_A_Weapon_refine;
  if (n_A_Equip[6] == 1718) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 2 * n_A_BODY_REFINE;
  if (n_A_Equip[0] == 1161)
    bonusValues[BONUSID.ALL_HEAL_PERCENT] += SkillSearch(SKILLID.DIVINE_PROTECTION);
  if (n_A_Equip[0] == 1792) bonusValues[5054] += 3 * n_A_Weapon_refine;
  if (CardNumSearch(551)) bonusValues[BONUSID.ALL_HEAL_PERCENT] += n_A_HEAD_REFINE / 2;
  if (EquipNumSearch(EQUIPID.SURVIVORS_MANTEAU_SURVIVORS_ROD_SET))
    bonusValues[BONUSID.RESIST_NEUTRAL_PERCENT] += 3 * n_A_SHOULDER_REFINE;
  if (EquipNumSearch(EQUIPID.CAPTAINS_HAT_PLUS_CAPTAINS_PIPE))
    bonusValues[BONUSID.RANGED_ATK_PERCENT] += n_A_HEAD_REFINE;
  if (EquipNumSearch(EQUIPID.SHIP_CAPTAIN_HAT_PLUS_CAPTAINS_PIPE))
    bonusValues[BONUSID.RANGED_ATK_PERCENT] += n_A_HEAD_REFINE;
  if (n_A_Equip[0] == 626 && n_A_Arrow == 2) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 25;
  if (n_A_Equip[0] == 627 && n_A_Arrow == 5) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 25;
  if (n_A_Equip[0] == 628 && n_A_Arrow == 4) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 25;
  if (n_A_Equip[0] == 629 && n_A_Arrow == 6) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 25;
  if (n_A_Equip[0] == 630 && n_A_Arrow == 10) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 50;
  if (n_A_Equip[0] == 101 && n_A_Arrow == 17) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 50;
  if (n_A_Equip[0] == 1491 && n_A_Arrow == 18) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 50;
  if (n_A_HEAD_REFINE >= 9 && n_A_card[8] == 543) bonusValues[BONUSID.RESIST_INSECT_PERCENT] += 5;
  if (n_A_LEFT_REFINE >= 6 && n_A_Equip[5] == 1622)
    bonusValues[BONUSID.RESIST_NEUTRAL_PERCENT] += n_A_LEFT_REFINE - 5;
  if (n_A_LEFT_REFINE >= 9 && n_A_Equip[5] == 1797) bonusValues[192] += 5;
  if (n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1244) bonusValues[BONUSID.RESIST_WATER_PERCENT] += 5;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1288) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 5;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1285)
    bonusValues[BONUSID.ATK_NORMAL_BOSS_GUARDIAN_PERCENT] += 3;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1407)
    bonusValues[BONUSID.ATK_NORMAL_BOSS_GUARDIAN_PERCENT] += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1842)
    bonusValues[BONUSID.ATK_NORMAL_BOSS_GUARDIAN_PERCENT] += 3;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1842)
    bonusValues[BONUSID.ATK_NORMAL_BOSS_GUARDIAN_PERCENT] += 3;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1407)
    bonusValues[BONUSID.ATK_NORMAL_BOSS_GUARDIAN_PERCENT] += 2;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1812) bonusValues[BONUSID.CRIT_DMG_PERCENT] += 10;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1812)
    bonusValues[BONUSID.ATK_NORMAL_BOSS_GUARDIAN_PERCENT] += 5;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1612)
    bonusValues[BONUSID.ATK_NORMAL_BOSS_GUARDIAN_PERCENT] += 5;
  if (n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1612) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 5;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1768) bonusValues[BONUSID.ALL_HEAL_PERCENT] += 3;
  if (n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1101)
    bonusValues[BONUSID.ATK_NORMAL_BOSS_GUARDIAN_PERCENT] += n_A_Weapon_refine;
  if (n_A_Weapon_refine >= 9 && EquipNumSearch(EQUIPID.WEIHNA_IRO))
    bonusValues[BONUSID.ATK_NORMAL_BOSS_GUARDIAN_PERCENT] += n_A_Weapon_refine;
  if (n_A_Weapon_refine >= 6 && n_A_Equip[0] == 1083)
    bonusValues[177] += 2 * (n_A_Weapon_refine - 5);
  if (n_A_SHOULDER_REFINE >= 9 && n_A_card[12] == 403)
    bonusValues[BONUSID.RESIST_NEUTRAL_PERCENT] += 5;
  if (n_A_Buf2[11] && n_A_JOB != 13 && n_A_JOB != 27)
    bonusValues[BONUSID.RESIST_DEMON_PERCENT] += 5 * n_A_Buf2[11];
  if (n_A_Buf2[11] && n_A_JOB != 13 && n_A_JOB != 27)
    bonusValues[BONUSID.RESIST_HOLY_PERCENT] += 5 * n_A_Buf2[11];
  if (n_A_JOB == 14 || n_A_JOB == 28)
    bonusValues[BONUSID.ATK_NORMAL_BOSS_GUARDIAN_PERCENT] += 10 * CardNumSearch(479);
  if (n_A_SHOULDER_REFINE >= 7 && n_A_Equip[7] == 1472) {
    if (SU_DEX >= 90) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 5;
    if (SU_VIT >= 90) bonusValues[BONUSID.RESIST_NEUTRAL_PERCENT] += 5;
    if (SU_LUK >= 90) bonusValues[BONUSID.CRIT_DMG_PERCENT] += 10;
  }
  if (n_A_SHOULDER_REFINE >= 9 && n_A_Equip[7] == 1472) {
    if (SU_DEX >= 90) bonusValues[BONUSID.RANGED_ATK_PERCENT] += 5;
    if (SU_VIT >= 90) bonusValues[BONUSID.RESIST_NEUTRAL_PERCENT] += 5;
    if (SU_LUK >= 90) bonusValues[BONUSID.CRIT_DMG_PERCENT] += 5;
  }
  if (CardNumSearch(452) && n_A_JobClass() == 3) {
    bonusValues[BONUSID.RESIST_UNDEAD_PERCENT] += 30;
    bonusValues[BONUSID.RESIST_DEMON_PERCENT] += 30;
  }
  if (
    n_A_HEAD_REFINE >= 5 &&
    (n_A_Equip[2] == 1507 || n_A_Equip[2] == 1508 || n_A_Equip[2] == 1703)
  ) {
    bonusValues[BONUSID.RESIST_DEMI_HUMAN_PERCENT] += n_A_HEAD_REFINE - 4;
    bonusValues[BONUSID.DMG_DEMI_HUMAN_PERCENT] += n_A_HEAD_REFINE - 4;
  }
  for (i = 971; i <= 977; i++)
    if (EquipNumSearch(i)) {
      bonusValues[BONUSID.RESIST_FORMLESS_PERCENT] -= 200;
      bonusValues[BONUSID.RESIST_UNDEAD_PERCENT] -= 200;
      bonusValues[BONUSID.RESIST_BRUTE_PERCENT] -= 200;
      bonusValues[BONUSID.RESIST_PLANT_PERCENT] -= 200;
      bonusValues[BONUSID.RESIST_INSECT_PERCENT] -= 200;
      bonusValues[BONUSID.RESIST_FISH_PERCENT] -= 200;
      bonusValues[BONUSID.RESIST_DEMON_PERCENT] -= 200;
      bonusValues[BONUSID.RESIST_ANGEL_PERCENT] -= 200;
      bonusValues[BONUSID.RESIST_DRAGON_PERCENT] -= 200;
    }
  if (
    ((targetData[20] == 0 &&
      n_B_rangedAtk == 0 &&
      n_B_rangedMAtk == 0 &&
      c.B_AtkRange.value != 2) ||
      c.B_AtkRange.value == 1) &&
    n_A_Equip[7] == 957
  )
    for (i = 0; i <= 9; i++) bonusValues[60 + i] += 30;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1498)
    for (i = 0; i <= 9; i++) bonusValues[60 + i] += 5;
  if (SkillSearch(SKILLID.SKIN_TEMPERING)) {
    bonusValues[BONUSID.RESIST_NEUTRAL_PERCENT] += SkillSearch(SKILLID.SKIN_TEMPERING);
    bonusValues[BONUSID.RESIST_FIRE_PERCENT] += 4 * SkillSearch(SKILLID.SKIN_TEMPERING);
  }
  if (n_A_Buf3[7]) {
    for (i = 61; i <= 69; i++) bonusValues[i] += 55 + 5 * n_A_Buf3[7];
    for (i = 150; i <= 159; i++) bonusValues[i] += 10 * n_A_Buf3[7];
  }
  if (n_A_Buf7[11]) {
    bonusValues[BONUSID.RESIST_WATER_PERCENT] += 20;
    bonusValues[BONUSID.RESIST_WIND_PERCENT] -= 15;
  }
  if (n_A_Buf7[12]) {
    bonusValues[BONUSID.RESIST_EARTH_PERCENT] += 20;
    bonusValues[BONUSID.RESIST_FIRE_PERCENT] -= 15;
  }
  if (n_A_Buf7[13]) {
    bonusValues[BONUSID.RESIST_FIRE_PERCENT] += 20;
    bonusValues[BONUSID.RESIST_WATER_PERCENT] -= 15;
  }
  if (n_A_Buf7[14]) {
    bonusValues[BONUSID.RESIST_WIND_PERCENT] += 20;
    bonusValues[BONUSID.RESIST_EARTH_PERCENT] -= 15;
  }
  if (n_A_Equip[0] == 1085) {
    if (n_A_Weapon_refine >= 6)
      bonusValues[BONUSID.ALL_HEAL_PERCENT] += 5 + 2 * (n_A_Weapon_refine - 5);
    if (n_A_Weapon_refine >= 10) bonusValues[BONUSID.ALL_HEAL_PERCENT] += 10;
  }
  if (n_A_Equip[0] == 644)
    bonusValues[BONUSID.ALL_HEAL_PERCENT] += Math.floor(1.5 * n_A_Weapon_refine);
  if (EquipNumSearch(EQUIPID.RECOVERY_LIGHT_ARO))
    bonusValues[BONUSID.ALL_HEAL_PERCENT] += Math.floor(6 * n_A_Weapon_refine);
  if (EQUIPID.ELDERS_STAFF == n_A_Equip[0] && n_A_Weapon_refine >= 7)
    bonusValues[BONUSID.ALL_HEAL_PERCENT] += 5;
  if (EQUIPID.ELDERS_STAFF == n_A_Equip[0] && n_A_Weapon_refine >= 9)
    bonusValues[BONUSID.ALL_HEAL_PERCENT] += 10;
  if (n_A_HEAD_REFINE >= 7)
    bonusValues[BONUSID.ALL_HEAL_PERCENT] +=
      1 * EquipNumSearch(EQUIPID.DRESS_HAT) + 3 * EquipNumSearch(EQUIPID.CANCER_DIADEM);
  if (n_A_Equip[6] == 534) {
    var classe = n_A_JobClass();
    if (classe == 1 || classe == 2 || classe == 6) bonusValues[151] += 50;
    if (classe == 3 || classe == 4 || classe == 5) bonusValues[156] += 50;
  }
  if (n_A_Equip[2] == 828) {
    bonusValues[151] += 2 * n_A_HEAD_REFINE;
    bonusValues[152] += 2 * n_A_HEAD_REFINE;
    bonusValues[159] += 2 * n_A_HEAD_REFINE;
  }
  if (SU_AGI >= 90) {
    bonusValues[151] += 30 * CardNumSearch(176);
    bonusValues[156] += 30 * CardNumSearch(176);
  }
  if (SU_VIT >= 80) {
    bonusValues[155] += 50 * CardNumSearch(176);
    bonusValues[159] += 50 * CardNumSearch(176);
  }
  if (n_A_Buf8[0] == 42 && n_A_Equip[2] == 1218) bonusValues[151] += 10;
  // danno ricevuto per elemento dell'attacco, in percentuale
  n_A_element = [];
  for (i = 0; i <= 9; i++) {
    var base = 100 * element[10 * n_A_Bodyelement + 1][i];
    n_A_element[i] = base - Math.floor(base * bonusValues[60 + i]) / 100;
  }
  if ((n_A_Equip[1] == 1076 || n_A_Equip[1] == 1077) && n_A_Weapon2_refine >= 6)
    bonusValues[307] += 5;
  if (
    (n_A_Equip[0] == 1076 ||
      n_A_Equip[0] == 1077 ||
      n_A_Equip[0] == 1080 ||
      n_A_Equip[0] == 1081 ||
      n_A_Equip[0] == 1086 ||
      (1088 <= n_A_Equip[0] && n_A_Equip[0] <= 1090) ||
      n_A_Equip[0] == 1092 ||
      n_A_Equip[0] == 1093 ||
      (1097 <= n_A_Equip[0] && n_A_Equip[0] <= 1103)) &&
    n_A_Weapon_refine >= 6
  )
    bonusValues[307] += 5;
  if (
    (n_A_Equip[0] == 1082 ||
      n_A_Equip[0] == 1087 ||
      n_A_Equip[0] == 1094 ||
      n_A_Equip[0] == 1096) &&
    n_A_Weapon_refine >= 6
  )
    bonusValues[307] += 5;
  if (n_A_Equip[0] == 645) bonusValues[295] += 10 + n_A_Weapon_refine;
  if (n_A_WeaponType == 9) bonusValues[295] += 2 * CardNumSearch(466);
  if (targetData[19] == 1) bonusValues[297] += 30 * CardNumSearch(425);
  if (n_A_Equip[0] == 936) bonusValues[295] += 1 * n_A_Weapon_refine;
  if (targetData[19] == 1 && n_A_Equip[2] == 1228 && n_A_HEAD_REFINE >= 6)
    bonusValues[297] += n_A_HEAD_REFINE - 5;
  if (targetData[19] == 1) bonusValues[295] += bonusValues[297];
  if ((n_A_Equip[0] == 1084 || n_A_Equip[0] == 1095) && n_A_Weapon_refine >= 6)
    bonusValues[317] += 5;
  if (n_A_Equip[0] == 1085 && n_A_Weapon_refine >= 6) bonusValues[317] += 5;
  if (n_A_Equip[0] == 1083 && n_A_Weapon_refine >= 6)
    bonusValues[317] += 5 + 2 * (n_A_Weapon_refine - 5);
  bonusValues[BONUSID.CRIT_DMG_PERCENT] += bonusValues[320 + targetData[2]];
  if (n_A_Equip[7] == 535) {
    classe = n_A_JobClass();
    if (classe == 1 || classe == 2 || classe == 6) {
      bonusValues[BONUSID.REFLECT_MELEE_DMG_PERCENT] += 5;
      bonusValues[BONUSID.REFLECT_MELEE_DMG_PERCENT] += 2 * n_A_SHOULDER_REFINE;
    }
  }
  if (TimeItemNumSearch(52)) bonusValues[BONUSID.REFLECT_MELEE_DMG_PERCENT] += 3 * n_A_LEFT_REFINE;
}
// uaRO: lo stesso incantamento su copricapo e calzature conta una volta sola (patch del
// 26/05/2026). Movement Speed e' calcolato con la velocita' di movimento, SP Consumption non
// cambia nessun risultato: il calcolatore non mostra il costo in SP delle skill
function HasBastionEnchant(l) {
  return 1 * c.A_BASTION_HEAD.value == l || 1 * c.A_BASTION_SHOES.value == l;
}
function ApplyBastionEnchants() {
  if (HasBastionEnchant(BASTIONENCHANTID.RACE_RESISTANCE))
    for (var A = BONUSID.RESIST_FORMLESS_PERCENT; A <= BONUSID.RESIST_DRAGON_PERCENT; A++)
      bonusValues[A] += 5;
  HasBastionEnchant(BASTIONENCHANTID.MAGICAL_ATTACK) && (bonusValues[BONUSID.MATK_PERCENT] += 5);
  HasBastionEnchant(BASTIONENCHANTID.PHYSICAL_ATTACK) && (bonusValues[BONUSID.ATK_PERCENT] += 5);
  HasBastionEnchant(BASTIONENCHANTID.HEALING_EFFECTIVENESS) &&
    (bonusValues[BONUSID.ALL_HEAL_PERCENT] += 10);
}
function IsDicastesAccessory(l) {
  return l == EQUIPID.GOLDEN_TRINKET || l == EQUIPID.LIGHT_OF_EL_DICASTES;
}
// i menu degli incantamenti si vedono solo con un oggetto di El Dicastes; Feral Tail e Feral Boots
// non si raffinano e le Feral Boots non hanno Bastion
function UpdateDicastesEnchantControls() {
  var coda = 1 * c.A_shoulder.value == EQUIPID.FERAL_TAIL,
    stivali = 1 * c.A_shoes.value == EQUIPID.FERAL_BOOTS;
  var posti = [
    ["SHOULDER", coda],
    ["SHOES", stivali],
    ["ACCESSORY1", IsDicastesAccessory(1 * c.A_acces1.value)],
    ["ACCESSORY2", IsDicastesAccessory(1 * c.A_acces2.value)],
  ];
  for (const [posto, attivo] of posti)
    for (const livello of ["PRIMARY", "STATS", "STATS2"]) {
      var sel = c["A_DICASTES_" + posto + "_" + livello];
      sel.hidden = sel.disabled = !attivo;
      if (!attivo) sel.value = 0;
    }
  c.A_SHOULDER_REFINE.disabled = coda;
  if (coda) c.A_SHOULDER_REFINE.value = 0;
  c.A_SHOES_REFINE.disabled = stivali;
  if (stivali) c.A_SHOES_REFINE.value = 0;
  c.A_BASTION_SHOES.hidden = c.A_BASTION_SHOES.disabled = stivali;
  if (stivali) c.A_BASTION_SHOES.value = BASTIONENCHANTID.NONE;
}
function ResetDicastesEnchantControls() {
  for (
    var l = [
        c.A_DICASTES_SHOULDER_PRIMARY,
        c.A_DICASTES_SHOULDER_STATS,
        c.A_DICASTES_SHOULDER_STATS2,
        c.A_DICASTES_SHOES_PRIMARY,
        c.A_DICASTES_SHOES_STATS,
        c.A_DICASTES_SHOES_STATS2,
        c.A_DICASTES_ACCESSORY1_PRIMARY,
        c.A_DICASTES_ACCESSORY1_STATS,
        c.A_DICASTES_ACCESSORY1_STATS2,
        c.A_DICASTES_ACCESSORY2_PRIMARY,
        c.A_DICASTES_ACCESSORY2_STATS,
        c.A_DICASTES_ACCESSORY2_STATS2,
      ],
      A = 0;
    A < l.length;
    A++
  )
    l[A].value = 0;
}
function ApplyDicastesPrimaryEnchant(l) {
  l == DICASTESENCHANTID.AGILE_6
    ? (bonusValues[BONUSID.FLEE] += 6)
    : l == DICASTESENCHANTID.AGILE_12
      ? (bonusValues[BONUSID.FLEE] += 12)
      : l == DICASTESENCHANTID.STRONG_2
        ? (bonusValues[BONUSID.ATK_PERCENT] += 2)
        : l == DICASTESENCHANTID.STRONG_3
          ? (bonusValues[BONUSID.ATK_PERCENT] += 3)
          : l == DICASTESENCHANTID.WISE_1
            ? (bonusValues[BONUSID.MATK_PERCENT] += 1)
            : l == DICASTESENCHANTID.WISE_2
              ? (bonusValues[BONUSID.MATK_PERCENT] += 2)
              : l == DICASTESENCHANTID.CRITICAL_5
                ? (bonusValues[BONUSID.CRIT] += 5)
                : l == DICASTESENCHANTID.CRITICAL_7 && (bonusValues[BONUSID.CRIT] += 7);
}
function ApplyDicastesPrimaryEnchants() {
  (ApplyDicastesPrimaryEnchant(1 * c.A_DICASTES_SHOULDER_PRIMARY.value),
    ApplyDicastesPrimaryEnchant(1 * c.A_DICASTES_SHOES_PRIMARY.value),
    ApplyDicastesPrimaryEnchant(1 * c.A_DICASTES_ACCESSORY1_PRIMARY.value),
    ApplyDicastesPrimaryEnchant(1 * c.A_DICASTES_ACCESSORY2_PRIMARY.value));
}
function GetDicastesStatEnchantBonuses(l) {
  var A = [0, 0, 0, 0, 0, 0];
  if (l <= 0) return A;
  var n = [BONUSID.AGI, BONUSID.DEX, BONUSID.INT],
    s = Math.floor((l - 1) / 5);
  return ((A[n[s] - 1] = ((l - 1) % 5) + 1), A);
}
function GetAllDicastesStatEnchantBonuses() {
  for (
    var l = [0, 0, 0, 0, 0, 0],
      A = [
        c.A_DICASTES_SHOULDER_STATS,
        c.A_DICASTES_SHOULDER_STATS2,
        c.A_DICASTES_SHOES_STATS,
        c.A_DICASTES_SHOES_STATS2,
        c.A_DICASTES_ACCESSORY1_STATS,
        c.A_DICASTES_ACCESSORY1_STATS2,
        c.A_DICASTES_ACCESSORY2_STATS,
        c.A_DICASTES_ACCESSORY2_STATS2,
      ],
      n = 0;
    n < A.length;
    n++
  )
    for (var s = GetDicastesStatEnchantBonuses(1 * A[n].value), _ = 0; _ < l.length; _++)
      l[_] += s[_];
  return l;
}
function StPlusCalc() {
  (n_A_JobSet(), (n_A_JobLV = 1 * c.A_JobLV.value));
  for (
    var l = [0, 0, 0, 0, 0, 0], A = 0;
    m_Job[n_A_JOB][A] <= n_A_JobLV && m_Job[n_A_JOB][A] != "n";
    A += 2
  )
    l[m_Job[n_A_JOB][A + 1]] += 1;
  if (n_A_JOB == 0 && n_Reborn)
    for (A = 0; m_Job[34][A] <= n_A_JobLV && m_Job[34][A] != "n"; A += 2) l[m_Job[34][A + 1]] += 1;
  if (n_A_JobLV >= 70 && SkillSearch(SKILLID.NO_DEATH_BONUS)) for (A = 0; A < 6; A++) l[A] += 10;
  var n = l[0],
    s = l[1],
    _ = l[2],
    a = l[3],
    E = l[4],
    S = l[5],
    b = Math.floor(n_A_SHOES_REFINE / 3);
  (EQUIPID.TEMPORAL_INT_BOOTS == n_A_Equip[8] && ((a += b), (E += b)),
    EQUIPID.TEMPORAL_STR_BOOTS == n_A_Equip[8] && (n += b),
    EQUIPID.TEMPORAL_DEX_BOOTS == n_A_Equip[8] && (E += b),
    EQUIPID.DEATH_FIRE == n_A_Equip[0] && (E += getDeathFireRefineBonuses(n_A_Weapon_refine).dex),
    EQUIPID.AVENGER == n_A_Equip[0] && n_A_Weapon_refine >= 7 && (E += 3),
    EQUIPID.FORTIFIED_DAGGER == n_A_Equip[0] && n_A_Weapon_refine >= 7 && (a += 5),
    EQUIPID.VALKYRIE_KNIFE == n_A_Equip[0] &&
      (n_A_Weapon_refine >= 7 && ((a += 5), (E += 5)),
      n_A_Weapon_refine >= 9 && ((a += 2), (E += 2))),
    EQUIPID.GHOST_WHISPER == n_A_Equip[2] && n_A_HEAD_REFINE >= 9 && (n += 2));
  var m = HasBastionEnchant(BASTIONENCHANTID.ALL_STATS) ? 1 : 0;
  ((wSPCall = StPlusCalc2(7)),
    (n += StPlusCalc2(1) + wSPCall + m),
    (s += StPlusCalc2(2) + wSPCall),
    (_ += StPlusCalc2(3) + wSPCall + m),
    (_ += StPlusCalc2(213)),
    (a += StPlusCalc2(4) + wSPCall + m),
    (a += StPlusCalc2(214)),
    (E += StPlusCalc2(5) + wSPCall),
    (S += StPlusCalc2(6) + wSPCall + m),
    (E += SkillSearch(SKILLID.OWLS_EYE)),
    (SkillSearch(SKILLID.CRAZY_UPROAR) || TimeItemNumSearch(17)) && (n += 4),
    (n += SkillSearch(SKILLID.HILT_BINDING)),
    (n += SkillSearch(SKILLID.NINJA_AURA)),
    (a += SkillSearch(SKILLID.NINJA_AURA)),
    SkillSearch(SKILLID.DRAGONOLOGY) && (a += Math.round(SkillSearch(SKILLID.DRAGONOLOGY) / 2)),
    SkillSearch(SKILLID.STEALTH_STR) &&
      (SkillSearch(SKILLID.STEALTH_STR) == 5 && (n += 16),
      SkillSearch(SKILLID.STEALTH_STR) == 4 && (n += 8),
      SkillSearch(SKILLID.STEALTH_STR) == 3 && (n += 4),
      SkillSearch(SKILLID.STEALTH_STR) == 2 && (n += 2),
      SkillSearch(SKILLID.STEALTH_STR) == 1 && (n += 1)),
    (n_A_JobClass() != 1 &&
      n_A_JobClass() != 2 &&
      n_A_JobClass() != 6 &&
      n_A_JOB != 41 &&
      n_A_JOB != 42) ||
      (n += 1 * EquipNumSearch(EQUIPID.SIGRUNS_WINGS)),
    (n_A_JobClass() != 3 && n_A_JobClass() != 5 && n_A_JOB != 43 && n_A_JOB != 44) ||
      (a += 1 * EquipNumSearch(EQUIPID.SIGRUNS_WINGS)),
    (n_A_JobClass() != 4 && n_A_JOB != 45) || (E += 1 * EquipNumSearch(EQUIPID.SIGRUNS_WINGS)),
    (D = SkillSearch(SKILLID.IMPROVE_CONCENTRATION)),
    D
      ? ((D += 102),
        (E = Math.floor(((n_A_DEX + E) * D) / 100) - n_A_DEX),
        (s = Math.floor(((n_A_AGI + s) * D) / 100) - n_A_AGI))
      : TimeItemNumSearch(31)
        ? ((E = Math.floor((104 * (n_A_DEX + E)) / 100) - n_A_DEX),
          (s = Math.floor((104 * (n_A_AGI + s)) / 100) - n_A_AGI))
        : (n_A_Buf7[34] || TimeItemNumSearch(4)) &&
          ((E = Math.floor((103 * (n_A_DEX + E)) / 100) - n_A_DEX),
          (s = Math.floor((103 * (n_A_AGI + s)) / 100) - n_A_AGI)),
    (s += m),
    (E += m));
  var u = GetAllDicastesStatEnchantBonuses();
  ((n += u[0]),
    (s += u[1]),
    (_ += u[2]),
    (a += u[3]),
    (E += u[4]),
    (S += u[5]),
    SkillSearch(SKILLID.INCREASE_ACCURACY) && ((E += 4), (s += 4)),
    (s += StPlusCalc2(212)),
    (E += StPlusCalc2(215)),
    (n_A_Equip[6] != 1636 &&
      n_A_Equip[6] != 1643 &&
      n_A_Equip[6] != 1650 &&
      n_A_Equip[6] != 1657) ||
      (SU_INT >= 99 && (a += 1)),
    n_A_WeaponType == 9 && (a += CardNumSearch(466)),
    n_A_Equip[0] == 649 && (E -= SU_DEX),
    (n_A_Equip[0] != 1172 && n_A_Equip[0] != 1671) || (a += Math.floor(n_A_Weapon_refine / 2)),
    n_A_Equip[2] == 1799 && n_A_JobClass() == 4 && (E += 3),
    n_A_JobClass() == 41 && n_A_Equip[2] == 672 && (s += 1),
    n_A_JobClass() == 41 && n_A_Equip[2] == 673 && (a += 1),
    n_A_JobClass() == 41 && n_A_Equip[2] == 675 && (S += 2),
    n_A_JobClass() == 41 && n_A_Equip[2] == 676 && (E += 2),
    n_A_JobClass() == 41 && n_A_Equip[3] == 678 && (S += 1),
    SkillSearch(SKILLID.DRAGONOLOGY) == 5 && n_A_Equip[0] == 1171 && (a += 3),
    n_A_HEAD_REFINE >= 6 && n_A_Equip[2] == 1555 && (s += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1576 && (s += 2),
    n_A_HEAD_REFINE >= 5 && n_A_Equip[2] == 1069 && (S += n_A_HEAD_REFINE - 4),
    n_A_Weapon_refine >= 6 && n_A_Equip[0] == 1168 && (a += n_A_Weapon_refine - 5),
    n_A_SHOES_REFINE >= 9 && n_A_Equip[8] == 717 && (s += 2),
    n_A_SHOES_REFINE >= 8 && n_A_Equip[8] == 1737 && (s += n_A_SHOES_REFINE - 7),
    (n_A_Equip[0] != 1078 && n_A_Equip[0] != 1079) ||
      ((a += n_A_Weapon_refine),
      n_A_Equip[0] == 1078 && n_A_Weapon_refine >= 9 && (a += 5),
      n_A_Equip[0] == 1079 && n_A_Weapon_refine >= 10 && (a += 5)),
    (n_A_Equip[1] != 1078 && n_A_Equip[1] != 1079) ||
      ((a += n_A_Weapon2_refine),
      n_A_Equip[1] == 1078 && n_A_Weapon2_refine >= 9 && (a += 5),
      n_A_Equip[1] == 1079 && n_A_Weapon2_refine >= 10 && (a += 3)),
    (wSPCall = StPlusCard(7)),
    (n += StPlusCard(1) + wSPCall),
    (s += StPlusCard(2) + wSPCall),
    (_ += StPlusCard(3) + wSPCall),
    (a += StPlusCard(4) + wSPCall),
    (E += StPlusCard(5) + wSPCall),
    (S += StPlusCard(6) + wSPCall),
    n_A_JobClass() == 3 && (a += CardNumSearch(383)),
    n_A_JobClass() == 4 && n_A_card[8] == 540 && (E += Math.floor(n_A_HEAD_REFINE / 3)),
    n_A_JobClass() == 1 && n_A_card[8] == 581 && (n += Math.floor(n_A_HEAD_REFINE / 3)),
    n_A_card[8] == 180 && (n += n_A_HEAD_REFINE),
    n_A_card[10] == 173 && (a += n_A_LEFT_REFINE),
    n_A_card[11] == 198 && (_ += n_A_BODY_REFINE),
    n_A_card[12] == 402 && (S += n_A_SHOULDER_REFINE),
    n_A_card[13] == 406 && (s += n_A_SHOES_REFINE),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1272 && (_ += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1273 && (_ += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1277 && (bonusValues[99] += 3),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1279 && (a += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1476 && (a += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1484 && (a += 3),
    n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1279 && (bonusValues[99] += 4),
    n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1476 && (bonusValues[99] += 4),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1280 && (bonusValues[64] += 5),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1281 && (bonusValues[64] += 5),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1477 && (bonusValues[64] += 5),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1478 && (bonusValues[64] += 5),
    n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1288 && (s += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1291 && (E += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1292 && (E += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1293 && (E += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1486 && (bonusValues[63] += 7),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1487 && (_ += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1294 && (bonusValues[62] += 5),
    n_A_card[11] == 185 && (_ += Math.floor(SU_DEX / 18)),
    n_A_card[11] == 187 && (n += Math.floor(SU_INT / 18)),
    n_A_card[11] == 189 && (S += Math.floor(SU_AGI / 18)),
    n_A_card[11] == 191 && (s += Math.floor(SU_LUK / 18)),
    n_A_card[11] == 196 && (a += Math.floor(SU_STR / 18)),
    n_A_card[11] == 197 && (E += Math.floor(SU_VIT / 18)),
    n_A_card[14] == 98 && CardNumSearch(273) && (n += 3),
    n_A_card[15] == 98 && CardNumSearch(273) && (n += 3),
    n_A_card[14] == 98 && n_A_card[15] == 98 && CardNumSearch(273) == 1 && (n -= 3),
    n_A_Equip[2] == 872 && (bonusValues[77] += n_A_HEAD_REFINE),
    n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1850 && (bonusValues[77] += 10),
    n_A_HEAD_REFINE >= 9 &&
      n_A_Equip[2] == 1850 &&
      (bonusValues[BONUSID.PHYSICAL_BOSS_DMG_PERCENT] += 10),
    n_A_Equip[2] == 1847 && (bonusValues[75] += 10 * n_A_HEAD_REFINE),
    n_A_Equip[2] == 1847 && (bonusValues[76] += 10 * n_A_HEAD_REFINE),
    n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1847 && (bonusValues[56] += 10),
    n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1847 && (bonusValues[36] += 10),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 565 && ((bonusValues[80] += 1), (bonusValues[99] += 1)),
    n_A_HEAD_REFINE >= 6 &&
      n_A_Equip[2] == 1629 &&
      ((bonusValues[177] += n_A_HEAD_REFINE - 5), (bonusValues[57] += n_A_HEAD_REFINE - 5)),
    n_A_card[12] == 405 &&
      ((n_A_JobClass() != 1 && n_A_JobClass() != 2 && n_A_JobClass() != 6) || (n += 2),
      (n_A_JobClass() != 3 && n_A_JobClass() != 4 && n_A_JobClass() != 5) || (a += 2)),
    n_A_Equip[2] == 1687 &&
      ((n_A_JobClass() != 1 && n_A_JobClass() != 2 && n_A_JobClass() != 6) ||
        ((s += 2),
        (_ += 2),
        (bonusValues[60] += Math.floor(n_A_JobLV / 14)),
        (bonusValues[61] += Math.floor(n_A_JobLV / 14))),
      (n_A_JobClass() != 3 && n_A_JobClass() != 4 && n_A_JobClass() != 5) ||
        ((a += 2),
        (E += 2),
        (bonusValues[60] += Math.floor(n_A_JobLV / 14)),
        (bonusValues[61] += Math.floor(n_A_JobLV / 14)))),
    -n > n_A_STR && (n = -n_A_STR),
    -s > n_A_AGI && (s = -n_A_AGI),
    -_ > n_A_VIT && (_ = -n_A_VIT),
    -a > n_A_INT && (a = -n_A_INT),
    -E > n_A_DEX && (E = -n_A_DEX),
    -S > n_A_LUK && (S = -n_A_LUK),
    (n += n_A_Buf2[0]),
    (a += n_A_Buf2[0]),
    (E += n_A_Buf2[0]),
    n_A_Buf6[19] == 0 &&
      n_A_Buf6[20] == 0 &&
      (n_A_Buf7[26] && n_A_Buf2[1] < 6 ? (s += 7) : n_A_Buf2[1] > 0 && (s += n_A_Buf2[1] + 2)),
    (S += 30 * n_A_Buf2[3]),
    n_A_JOB == 24 &&
      SkillSearch(SKILLID.FALCON_EYES) &&
      ((n += 5), (s += 5), (_ += 5), (E += 5), (a += 5), (S += 5)),
    SkillSearch(SKILLID.SPRINT_STR_STATE) && n_A_WeaponType == 0 && (n += 10),
    n_A_Buf3[40] && ((n += 5), (E += 5), (a += 5)),
    (n += n_A_Buf3[41]),
    (_ += n_A_Buf3[42]),
    (s += n_A_Buf3[43]),
    (E += n_A_Buf3[44]),
    n_A_Buf2[16] && ((n += 20), (s += 20), (_ += 20), (E += 20), (a += 20), (S += 20)),
    n_A_Buf6[2] == 1 && ((n += 3), (s += 3), (_ += 3), (E += 3), (a += 3), (S += 3)),
    n_A_Buf6[2] == 2 && ((n += 5), (s += 5), (_ += 5), (E += 5), (a += 5), (S += 5)),
    n_A_Buf6[10] && ((n += 1), (s += 1), (_ += 1), (E += 1), (a += 1), (S += 1)),
    SkillSearch(SKILLID.UNDYING_LOVE) &&
      ((n -= 1), (s -= 1), (_ -= 1), (E -= 1), (a -= 1), (S -= 1)),
    n_A_Buf7[3] && (n += n_A_Buf7[3]),
    n_A_Buf7[4] && (s += n_A_Buf7[4]),
    n_A_Buf7[5] && (_ += n_A_Buf7[5]),
    n_A_Buf7[6] && (a += n_A_Buf7[6]),
    n_A_Buf7[7] && (E += n_A_Buf7[7]),
    n_A_Buf7[8] && (S += n_A_Buf7[8]),
    n_A_Buf7[36] && ((n += 3), (s += 3), (_ += 3), (E += 3), (a += 3), (S += 3)),
    n_A_Buf7[37] && (S += 21),
    n_A_Buf7[41] && (n += 20),
    n_A_Buf7[47] && (s += 20),
    n_A_Buf7[48] && (_ += 20),
    n_A_Buf7[49] && (a += 20),
    n_A_Buf7[50] && (E += 20),
    n_A_Buf7[51] && (S += 20));
  var I = 1 * c.A_HSE.value;
  if (I) {
    var D = I % 10;
    (1 <= I && I <= 9 && (n += D),
      11 <= I && I <= 19 && (s += D),
      21 <= I && I <= 29 && (_ += D),
      31 <= I && I <= 39 && (a += D),
      41 <= I && I <= 49 && (E += D),
      51 <= I && I <= 59 && (S += D));
  }
  var T,
    d = 1 * c.A_HSE_HEAD1.value;
  if (
    (d &&
      ((D = d % 10),
      1 <= d && d <= 9 && (n += D),
      11 <= d && d <= 19 && (s += D),
      21 <= d && d <= 29 && (_ += D),
      31 <= d && d <= 39 && (a += D),
      41 <= d && d <= 49 && (E += D),
      51 <= d && d <= 59 && (S += D)),
    SkillSearch(SKILLID.TRANSCENDENT_SPIRIT) == 1 &&
      n_Reborn == 1 &&
      n_A_BaseLV > 10 &&
      n_A_BaseLV < 70 &&
      (n_A_STR + n <= 50 && (n = 50 - n_A_STR),
      n_A_AGI + s <= 50 && (s = 50 - n_A_AGI),
      n_A_VIT + _ <= 50 && (_ = 50 - n_A_VIT),
      n_A_INT + a <= 50 && (a = 50 - n_A_INT),
      n_A_DEX + E <= 50 && (E = 50 - n_A_DEX),
      n_A_LUK + S <= 50 && (S = 50 - n_A_LUK)),
    SkillSearch(SKILLID.TRANSCENDENT_SPIRIT) == 2 &&
      n_Reborn == 1 &&
      n_A_BaseLV > 10 &&
      n_A_BaseLV < 70 &&
      ((B = n_A_BaseLV - 10) > 50
        ? ((n = 50), (s = 50), (_ = 50), (a = 50), (E = 50), (S = 50))
        : (n_A_STR < B && (n = B - n_A_STR),
          n_A_AGI < B && (s = B - n_A_AGI),
          n_A_VIT < B && (_ = B - n_A_VIT),
          n_A_INT < B && (a = B - n_A_INT),
          n_A_DEX < B && (E = B - n_A_DEX),
          n_A_LUK < B && (S = B - n_A_LUK))),
    SkillSearch(SKILLID.TRANSCENDENT_SPIRIT) == 3 &&
      n_Reborn == 1 &&
      n_A_BaseLV > 10 &&
      n_A_BaseLV < 70)
  ) {
    var B = n_A_BaseLV - 10;
    (n > 50 || (n + B > 50 ? (n = 50) : (n += B)),
      s > 50 || (s + B > 50 ? (s = 50) : (s += B)),
      _ > 50 || (_ + B > 50 ? (_ = 50) : (_ += B)),
      a > 50 || (a + B > 50 ? (a = 50) : (a += B)),
      E > 50 || (E + B > 50 ? (E = 50) : (E += B)),
      S > 50 || (S + B > 50 ? (S = 50) : (S += B)));
  }
  (n_A_Buf3[11] && n_A_Buf3[18] == 0
    ? (n_A_STR + n < 99 &&
        (n_A_STR + n + Math.floor(n_A_Buf3[12] / 2) < 99
          ? (n += Math.floor(n_A_Buf3[12] / 2))
          : (n = 99 - n_A_STR)),
      n_A_AGI + s < 99 &&
        (n_A_AGI + s + Math.floor(n_A_Buf3[13] / 2) < 99
          ? (s += Math.floor(n_A_Buf3[13] / 2))
          : (s = 99 - n_A_AGI)),
      n_A_VIT + _ < 99 &&
        (n_A_VIT + _ + Math.floor(n_A_Buf3[14] / 2) < 99
          ? (_ += Math.floor(n_A_Buf3[14] / 2))
          : (_ = 99 - n_A_VIT)),
      n_A_INT + a < 99 &&
        (n_A_INT + a + Math.floor(n_A_Buf3[15] / 2) < 99
          ? (a += Math.floor(n_A_Buf3[15] / 2))
          : (a = 99 - n_A_INT)),
      n_A_DEX + E < 99 &&
        (n_A_DEX + E + Math.floor(n_A_Buf3[16] / 2) < 99
          ? (E += Math.floor(n_A_Buf3[16] / 2))
          : (E = 99 - n_A_DEX)),
      n_A_LUK + S < 99 &&
        (n_A_LUK + S + Math.floor(n_A_Buf3[17] / 2) < 99
          ? (S += Math.floor(n_A_Buf3[17] / 2))
          : (S = 99 - n_A_LUK)))
    : n_A_Buf3[11] &&
      n_A_Buf3[18] &&
      ((D = 2),
      (n += Math.floor(n_A_Buf3[12] / D)),
      (s += Math.floor(n_A_Buf3[13] / D)),
      (_ += Math.floor(n_A_Buf3[14] / D)),
      (a += Math.floor(n_A_Buf3[15] / D)),
      (E += Math.floor(n_A_Buf3[16] / D)),
      (S += Math.floor(n_A_Buf3[17] / D))),
    n_A_Buf6[19] &&
      ((s -= (T = Math.floor((n_A_AGI + s) / 2)) > (l = 10 * n_A_Buf6[19]) ? l : T),
      (E -= (T = Math.floor((n_A_DEX + E) / 2)) > l ? l : T)),
    n_A_Buf6[20] && (s -= n_A_Buf6[20] + 2),
    n_A_Buf6[22] && (S = -1 * n_A_LUK),
    (n_A_STR += n),
    (n_A_AGI += s),
    (n_A_VIT += _),
    (n_A_INT += a),
    (n_A_DEX += E),
    (n_A_LUK += S),
    n >= 0
      ? myInnerHtml("A_STRp", " + " + n + " (" + n_A_STR + ")", 0)
      : myInnerHtml("A_STRp", " - " + -n + " (" + n_A_STR + ")", 0),
    s >= 0
      ? myInnerHtml("A_AGIp", " + " + s + " (" + n_A_AGI + ")", 0)
      : myInnerHtml("A_AGIp", " - " + -s + " (" + n_A_AGI + ")", 0),
    _ >= 0
      ? myInnerHtml("A_VITp", " + " + _ + " (" + n_A_VIT + ")", 0)
      : myInnerHtml("A_VITp", " - " + -_ + " (" + n_A_VIT + ")", 0),
    a >= 0
      ? myInnerHtml("A_INTp", " + " + a + " (" + n_A_INT + ")", 0)
      : myInnerHtml("A_INTp", " - " + -a + " (" + n_A_INT + ")", 0),
    E >= 0
      ? myInnerHtml("A_DEXp", " + " + E + " (" + n_A_DEX + ")", 0)
      : myInnerHtml("A_DEXp", " - " + -E + " (" + n_A_DEX + ")", 0),
    S >= 0
      ? myInnerHtml("A_LUKp", " + " + S + " (" + n_A_LUK + ")", 0)
      : myInnerHtml("A_LUKp", " - " + -S + " (" + n_A_LUK + ")", 0));
}
function StPlusCalc2(l) {
  for (var A = 0, n = 0; n <= 20; n++)
    for (const b of itemData[n_A_Equip[n]].bonuses) l == Math.abs(b.id) && (A += b.value);
  return A;
}
function StPlusCard(l) {
  for (var A = 0, n = 0; n <= 25; n++)
    for (var s = 0; m_Card[n_A_card[n]][s + 4] != 0; s += 2)
      l == Math.abs(m_Card[n_A_card[n]][s + 4]) && (A += m_Card[n_A_card[n]][s + 5]);
  for (s = 0; m_PET[n_A_Buf8[0]][s + 3] != 0; s += 2)
    l == Math.abs(m_PET[n_A_Buf8[0]][s + 3]) && (A += m_PET[n_A_Buf8[0]][s + 4]);
  var _ = [0, 0, 0, 0];
  for (n = 0; n <= 3; n++) _[n] = n_A_Buf8[8 + n];
  for (n = 0; n <= 2; n++) for (s = n + 1; s <= 3; s++) _[n] == _[s] && (_[s] = 0);
  for (n = 0; n <= 3; n++)
    for (s = 0; m_TempEffect[_[n]][5 + s] != 0; s += 2)
      l == Math.abs(m_TempEffect[_[n]][5 + s]) && (A += m_TempEffect[_[n]][6 + s]);
  for (n = 0; n < 8; n += 2) l == n_A_Buf9[n] + 30 && n_A_Buf9[n] < 20 && (A += n_A_Buf9[n + 1]);
  for (n = 0; n < 8; n += 2)
    l == n_A_Buf9[n] + 7 && n_A_Buf9[n] >= 20 && n_A_Buf9[n] < 23 && (A += n_A_Buf9[n + 1]);
  for (n = 0; n < 8; n += 2)
    (l == n_A_Buf9[n] + 3 && n_A_Buf9[n] == 23) ||
    (l == n_A_Buf9[n] + 57 && n_A_Buf9[n] == 24) ||
    (l == n_A_Buf9[n] + 59 && n_A_Buf9[n] == 25)
      ? (A += n_A_Buf9[n + 1])
      : (l != 1063 && l != 1064 && l != 1065 && l != 1575 && l != 1576) || n_A_Buf9[n] != 26
        ? (l == n_A_Buf9[n] + 55 && n_A_Buf9[n] == 27) ||
          (l == n_A_Buf9[n] + 55 && n_A_Buf9[n] == 28)
          ? (A += n_A_Buf9[n + 1])
          : (l != 1495 && l != 1496) || n_A_Buf9[n] != 29 || (A += n_A_Buf9[n + 1])
        : (A += n_A_Buf9[n + 1]);
  for (n = 8; n < 16; n += 2) l == n_A_Buf9[n] + 50 && n_A_Buf9[n] < 20 && (A += n_A_Buf9[n + 1]);
  for (n = 8; n < 16; n += 2)
    l == n_A_Buf9[n] + 170 && n_A_Buf9[n] >= 20 && n_A_Buf9[n] < 23 && (A += n_A_Buf9[n + 1]);
  for (n = 8; n < 16; n += 2)
    (l == n_A_Buf9[n] + 54 && n_A_Buf9[n] == 23) || (l == n_A_Buf9[n] + 55 && n_A_Buf9[n] == 24)
      ? (A += n_A_Buf9[n + 1])
      : (l != 3063 && l != 3064 && l != 3065) || n_A_Buf9[n] != 25 || (A += n_A_Buf9[n + 1]);
  for (n = 47; n < 53; n++) l == n - 46 && (A += n_A_Buf9[n]);
  return (
    l == 80 && (A += n_A_Buf9[41]),
    l == 290 && (A += n_A_Buf9[16]),
    l == 295 && (A += n_A_Buf9[17]),
    l == 78 && (A += n_A_Buf9[18]),
    A
  );
}
function JobEquipItemSearch(l, A) {
  if (n_A_JOB == 20 && A >= 50 && l == 3001) return 1;
  if (l == 152) return n_A_JOB != 41 && n_A_JOB != 42 && m_JobEquip[n_A_JOB].includes(1) ? 1 : 0;
  if (l == 153) return n_A_JOB == 23 || n_A_JOB == 29 ? 1 : 0;
  if (l == 154) return [24, 28, 30, 31].includes(n_A_JOB) ? 1 : 0;
  if (l >= 4e3 && l <= 4999) {
    if (((l -= 4e3), n_A_JOB > 40)) return 1;
    if (n_Reborn != 1) return 0;
  } else if (l >= 5e3 && l <= 5999) {
    if (((l -= 5e3), n_A_JOB >= 41 && n_A_JOB <= 45)) return 1;
  } else if ((l >= 2e3 && n_A_JOB <= 40 && (l -= 2e3), 1e3 <= l && l <= 1999)) {
    if (n_Reborn != 1) return 0;
    l -= 1e3;
  }
  for (var n = 0; m_JobEquip[n_A_JOB][n] != 999; n++) if (m_JobEquip[n_A_JOB][n] == l) return 1;
  return 0;
}
function n_A_JobSet() {
  ((n_A_JOB = 1 * documento.calcForm.A_JOB.value),
    21 <= n_A_JOB && n_A_JOB <= 40
      ? ((n_Reborn = 1), 34 <= n_A_JOB && n_A_JOB <= 40 && (n_A_JOB -= 34))
      : (n_Reborn = 0));
}
function n_A_JobClass() {
  return n_A_JOB <= 6
    ? n_A_JOB
    : n_A_JOB == 20
      ? 0
      : n_A_JOB == 7 || n_A_JOB == 13 || n_A_JOB == 21 || n_A_JOB == 27
        ? 1
        : n_A_JOB == 8 || n_A_JOB == 14 || n_A_JOB == 22 || n_A_JOB == 28
          ? 2
          : n_A_JOB == 9 || n_A_JOB == 15 || n_A_JOB == 23 || n_A_JOB == 29
            ? 3
            : n_A_JOB == 10 ||
                n_A_JOB == 16 ||
                n_A_JOB == 17 ||
                n_A_JOB == 24 ||
                n_A_JOB == 30 ||
                n_A_JOB == 31
              ? 4
              : n_A_JOB == 11 || n_A_JOB == 18 || n_A_JOB == 25 || n_A_JOB == 32
                ? 5
                : n_A_JOB == 12 || n_A_JOB == 19 || n_A_JOB == 26 || n_A_JOB == 33
                  ? 6
                  : n_A_JOB == 41 || n_A_JOB == 42 || n_A_JOB == 43
                    ? 41
                    : 7;
}
function n_A_JobClass2() {
  return n_A_JOB == 7 || n_A_JOB == 21
    ? 7
    : n_A_JOB == 8 || n_A_JOB == 22
      ? 8
      : n_A_JOB == 9 || n_A_JOB == 23
        ? 9
        : n_A_JOB == 10 || n_A_JOB == 24
          ? 10
          : n_A_JOB == 11 || n_A_JOB == 25
            ? 11
            : n_A_JOB == 12 || n_A_JOB == 26
              ? 12
              : n_A_JOB == 13 || n_A_JOB == 27
                ? 13
                : n_A_JOB == 14 || n_A_JOB == 28
                  ? 14
                  : n_A_JOB == 15 || n_A_JOB == 29
                    ? 15
                    : n_A_JOB == 16 || n_A_JOB == 30 || n_A_JOB == 17 || n_A_JOB == 31
                      ? 16
                      : n_A_JOB == 18 || n_A_JOB == 32
                        ? 18
                        : n_A_JOB == 19 || n_A_JOB == 33
                          ? 19
                          : 0;
}
function EquipNumSearch(l) {
  for (var A = 0, n = 0; n <= 20; n++) l == n_A_Equip[n] && (A += 1);
  return A;
}
function CardNumSearch(l) {
  for (var A = 0, n = 0; n <= 25; n++) l == n_A_card[n] && (A += 1);
  return A;
}
function TimeItemNumSearch(l) {
  for (var A = 0, n = 0; n <= 3; n++) l == n_A_Buf8[8 + n] && (A += 1);
  return A;
}
function NumSearch(l, A) {
  for (var n = A.length - 1, s = 0; s <= n; s++) if (l == A[s]) return 1;
  return 0;
}
