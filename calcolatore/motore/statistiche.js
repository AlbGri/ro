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
function StAllCalc() {
  var t = 0;
  switch (
    (n_A_JobSet(),
    n_A_JOB == 20 &&
      (SuperNoviceFullWeaponCHECK == 0 && 1 * c.A_skill13.value == 1
        ? SuperNoviceFullWeapon(1)
        : SuperNoviceFullWeaponCHECK == 1 &&
          1 * c.A_skill13.value == 0 &&
          SuperNoviceFullWeapon(0)),
    (n_A_BaseLV = 1 * c.A_BaseLV.value),
    (n_A_JobLV = 1 * c.A_JobLV.value),
    (n_A_STR = 1 * c.A_STR.value),
    (n_A_AGI = 1 * c.A_AGI.value),
    (n_A_VIT = 1 * c.A_VIT.value),
    (n_A_DEX = 1 * c.A_DEX.value),
    (n_A_INT = 1 * c.A_INT.value),
    (n_A_LUK = 1 * c.A_LUK.value),
    (SU_STR = n_A_STR),
    (SU_AGI = n_A_AGI),
    (SU_VIT = n_A_VIT),
    (SU_DEX = n_A_DEX),
    (SU_INT = n_A_INT),
    (SU_LUK = n_A_LUK),
    (n_A_WeaponType = itemData[c.A_weapon1.value].equipType),
    n_Nitou && (n_A_Weapon2Type = itemData[c.A_weapon2.value].equipType),
    (n_A_Arrow = 1 * c.A_Arrow.value),
    (n_A_HEAD_REFINE = 1 * c.A_HEAD_REFINE.value),
    (n_A_BODY_REFINE = 1 * c.A_BODY_REFINE.value),
    (n_A_LEFT_REFINE = 1 * c.A_LEFT_REFINE.value),
    (n_A_SHOULDER_REFINE = 1 * c.A_SHOULDER_REFINE.value),
    (n_A_SHOES_REFINE = 1 * c.A_SHOES_REFINE.value),
    (n_A_ActiveSkill = 1 * c.A_ActiveSkill.value),
    n_A_ActiveSkill >= 3e3
      ? (n_A_ActiveSkill = m_EnableSkill[n_A_ActiveSkill - 3e3][2])
      : n_A_ActiveSkill >= 2e3
        ? (n_A_ActiveSkill = m_AutoSpellSkill[n_A_ActiveSkill - 2e3][2])
        : n_A_ActiveSkill >= 1500 && (n_A_ActiveSkill = m_EnableSkill[n_A_ActiveSkill - 1500][2]),
    (n_A_ActiveSkill = uaroSkillId(n_A_ActiveSkill)),
    (n_A_ActiveSkillLV = 1 * c.A_ActiveSkillLV.value),
    (n_A_Equip[0] = 1 * c.A_weapon1.value),
    (n_A_Equip[1] = 0),
    n_Nitou && (n_A_Equip[1] = 1 * c.A_weapon2.value),
    (n_A_Equip[2] = 1 * c.A_head1.value),
    (n_A_Equip[3] = 1 * c.A_head2.value),
    (n_A_Equip[4] = 1 * c.A_head3.value),
    (n_A_Equip[5] = 1 * c.A_left.value),
    (n_A_Equip[6] = 1 * c.A_body.value),
    (n_A_Equip[7] = 1 * c.A_shoulder.value),
    (n_A_Equip[8] = 1 * c.A_shoes.value),
    (n_A_Equip[9] = 1 * c.A_acces1.value),
    (n_A_Equip[10] = 1 * c.A_acces2.value),
    UpdateDicastesEnchantControls(),
    (n_A_Equip[9] == 1001 && n_A_Equip[10] == 1863) ||
    (n_A_Equip[9] == 1863 && n_A_Equip[10] == 1001)
      ? ((w_SE[59] = [999, "NULL"]), (w_SE[163] = [1864, "NULL"]))
      : ((w_SE[59] = [999, 987, 998, 1001, "NULL"]), (w_SE[163] = [1864, 987, 998, 1863, "NULL"])),
    SetEquip(),
    (n_A_WeaponLV = itemData[n_A_Equip[0]].weaponLevel),
    (n_A_Weapon_ATK = itemData[n_A_Equip[0]].attackOrDefense),
    (n_A_Weapon_refine = 1 * c.A_Weapon_refine.value),
    (W_REF = 0),
    (n_A_WeaponLV_refineATK = 0),
    (n_A_WeaponLV_Minplus = 0),
    (n_A_WeaponLV_Maxplus = 0),
    n_A_WeaponLV)
  ) {
    case 1:
      ((n_A_WeaponLV_refineATK = 2 * n_A_Weapon_refine),
        n_A_Weapon_refine >= 8 &&
          ((n_A_WeaponLV_Minplus = 1), (n_A_WeaponLV_Maxplus = 3 * (n_A_Weapon_refine - 7))));
      break;
    case 2:
      ((n_A_WeaponLV_refineATK = 3 * n_A_Weapon_refine),
        n_A_Weapon_refine >= 7 &&
          ((n_A_WeaponLV_Minplus = 1), (n_A_WeaponLV_Maxplus = 5 * (n_A_Weapon_refine - 6))));
      break;
    case 3:
      ((n_A_WeaponLV_refineATK = 5 * n_A_Weapon_refine),
        n_A_Weapon_refine >= 6 &&
          ((n_A_WeaponLV_Minplus = 1), (n_A_WeaponLV_Maxplus = 8 * (n_A_Weapon_refine - 5))));
      break;
    case 4:
      ((n_A_WeaponLV_refineATK = 7 * n_A_Weapon_refine),
        n_A_Weapon_refine >= 5 &&
          ((n_A_WeaponLV_Minplus = 1), (n_A_WeaponLV_Maxplus = 13 * (n_A_Weapon_refine - 4))));
      break;
  }
  if (
    ((n_A_Weapon2LV = 0),
    (n_A_Weapon2_ATK = 0),
    (n_A_Weapon2_refine = 0),
    (n_A_Weapon2LV_refineATK = 0),
    (n_A_Weapon2LV_Minplus = 0),
    (n_A_Weapon2LV_Maxplus = 0),
    n_Nitou &&
      ((W_REF2 = 0),
      (n_A_Weapon2LV = itemData[n_A_Equip[1]].weaponLevel),
      (n_A_Weapon2_ATK = itemData[n_A_Equip[1]].attackOrDefense),
      (n_A_Weapon2_refine = 1 * c.A_Weapon2_refine.value),
      n_A_Weapon2LV == 1
        ? ((n_A_Weapon2LV_refineATK = 2 * n_A_Weapon2_refine),
          n_A_Weapon2_refine >= 8 &&
            ((n_A_Weapon2LV_Minplus = 1), (n_A_Weapon2LV_Maxplus = 3 * (n_A_Weapon2_refine - 7))))
        : n_A_Weapon2LV == 2
          ? ((n_A_Weapon2LV_refineATK = 3 * n_A_Weapon2_refine),
            n_A_Weapon2_refine >= 7 &&
              ((n_A_Weapon2LV_Minplus = 1), (n_A_Weapon2LV_Maxplus = 5 * (n_A_Weapon2_refine - 6))))
          : n_A_Weapon2LV == 3
            ? ((n_A_Weapon2LV_refineATK = 5 * n_A_Weapon2_refine),
              n_A_Weapon2_refine >= 6 &&
                ((n_A_Weapon2LV_Minplus = 1),
                (n_A_Weapon2LV_Maxplus = 8 * (n_A_Weapon2_refine - 5))))
            : n_A_Weapon2LV == 4 &&
              ((n_A_Weapon2LV_refineATK = 7 * n_A_Weapon2_refine),
              n_A_Weapon2_refine >= 5 &&
                ((n_A_Weapon2LV_Minplus = 1),
                (n_A_Weapon2LV_Maxplus = 13 * (n_A_Weapon2_refine - 4))))),
    c.A_OverRefineBonus.checked ||
      ((n_A_WeaponLV_Minplus = 0),
      (n_A_WeaponLV_Maxplus = 0),
      (n_A_Weapon2LV_Minplus = 0),
      (n_A_Weapon2LV_Maxplus = 0)),
    (n_A_card[0] = 1 * c.A_weapon1_card1.value),
    (n_A_card[1] = 1 * c.A_weapon1_card2.value),
    (n_A_card[2] = 1 * c.A_weapon1_card3.value),
    (n_A_card[3] = 1 * c.A_weapon1_card4.value),
    n_Nitou
      ? ((n_A_card[4] = 1 * c.A_weapon2_card1.value),
        (n_A_card[5] = 1 * c.A_weapon2_card2.value),
        (n_A_card[6] = 1 * c.A_weapon2_card3.value),
        (n_A_card[7] = 1 * c.A_weapon2_card4.value))
      : ((n_A_card[4] = 0), (n_A_card[5] = 0), (n_A_card[6] = 0), (n_A_card[7] = 0)),
    (n_A_card[8] = 1 * c.A_head1_card.value),
    (n_A_card[9] = 1 * c.A_head2_card.value),
    (n_A_card[10] = 1 * c.A_left_card.value),
    (n_A_card[11] = 1 * c.A_body_card.value),
    (n_A_card[12] = 1 * c.A_shoulder_card.value),
    (n_A_card[13] = 1 * c.A_shoes_card.value),
    (n_A_card[14] = 1 * c.A_acces1_card.value),
    (n_A_card[15] = 1 * c.A_acces2_card.value),
    SetCard(),
    (n_A_Weapon_element = 1 * c.A_Weapon_element.value),
    (n_A_Weapon2_element = n_A_Weapon_element),
    n_A_Weapon_element == 0)
  ) {
    for (const b of itemData[n_A_Equip[0]].bonuses) b.id == 20 && (n_A_Weapon_element = b.value);
    for (const b of itemData[n_A_Equip[1]].bonuses) b.id == 20 && (n_A_Weapon2_element = b.value);
    (201 <= m_Card[n_A_card[0]][0] &&
      m_Card[n_A_card[0]][0] <= 204 &&
      (n_A_Weapon_element = m_Card[n_A_card[0]][0] - 200),
      201 <= m_Card[n_A_card[4]][0] &&
        m_Card[n_A_card[4]][0] <= 204 &&
        (n_A_Weapon2_element = m_Card[n_A_card[4]][0] - 200),
      (n_A_WeaponType == 10 || (17 <= n_A_WeaponType && n_A_WeaponType <= 21)) &&
        m_Arrow[n_A_Arrow][1] > 0 &&
        (n_A_Weapon_element = m_Arrow[n_A_Arrow][1]));
  }
  n_A_Buf = new Array();
  for (var l = 0; m_JobBuff[n_A_JOB][l] != 999; l++) {
    var A = documento.getElementById("A_skill" + l);
    n_A_Buf[l] = 1 * A.value;
  }
  for (
    n_SkillSW &&
      ((n_A_Buf2[0] = 1 * c.A2_Skill0.value),
      (n_A_Buf2[1] = 1 * c.A2_Skill1.value),
      (n_A_Buf2[2] = 1 * c.A2_Skill2.value),
      (n_A_Buf2[3] = 1 * c.A2_Skill3.checked),
      (n_A_Buf2[4] = 1 * c.A2_Skill4.value),
      (n_A_Buf2[5] = 1 * c.A2_Skill5.checked),
      (n_A_Buf2[6] = 1 * c.A2_Skill6.value),
      (n_A_Buf2[7] = 1 * c.A2_Skill7.checked),
      (n_A_Buf2[8] = 1 * c.A2_Skill8.checked),
      (n_A_Buf2[9] = 1 * c.A2_Skill9.value),
      (n_A_Buf2[10] = 1 * c.A2_Skill10.value),
      (n_A_Buf2[11] = 1 * c.A2_Skill11.value),
      (n_A_Buf2[12] = 1 * c.A2_Skill12.value),
      (n_A_Buf2[13] = 1 * c.A2_Skill13.value),
      (n_A_Buf2[14] = 1 * c.A2_Skill14.value),
      (n_A_Buf2[15] = 1 * c.A2_Skill15.value),
      (n_A_Buf2[16] = 1 * c.A5_Skill0.checked),
      (n_A_Buf2[17] = 1 * c.A5_Skill1.checked),
      (n_A_Buf2[18] = 1 * c.A5_Skill2.checked),
      (n_A_Buf2[19] = 1 * c.A5_Skill3.checked),
      (n_A_Buf2[20] = 1 * c.A5_Skill4.checked),
      (n_A_Buf2[21] = 1 * c.A5_Skill5.checked)),
      n_Skill3SW &&
        ((n_A_Buf3[0] = 1 * c.A3_Skill0_1.value),
        (n_A_Buf3[1] = 1 * c.A3_Skill1_1.value),
        (n_A_Buf3[2] = 1 * c.A3_Skill2_1.value),
        (n_A_Buf3[3] = 1 * c.A3_Skill3_1.value),
        (n_A_Buf3[4] = 1 * c.A3_Skill4_1.value),
        (n_A_Buf3[5] = 1 * c.A3_Skill5_1.value),
        (n_A_Buf3[6] = 1 * c.A3_Skill6_1.value),
        (n_A_Buf3[37] = 1 * c.A3_Skill12_1.value),
        (n_A_Buf3[7] = 1 * c.A3_Skill7.value),
        (n_A_Buf3[8] = 1 * c.A3_Skill8.value),
        (n_A_Buf3[9] = 1 * c.A3_Skill9.value),
        (n_A_Buf3[10] = 1 * c.A3_Skill10.value),
        (n_A_Buf3[11] = 1 * c.A3_Skill11.checked),
        n_A_Buf3[11] &&
          ((n_A_Buf3[12] = 1 * c.A3_Skill11_STR.value),
          (n_A_Buf3[13] = 1 * c.A3_Skill11_AGI.value),
          (n_A_Buf3[14] = 1 * c.A3_Skill11_VIT.value),
          (n_A_Buf3[15] = 1 * c.A3_Skill11_INT.value),
          (n_A_Buf3[16] = 1 * c.A3_Skill11_DEX.value),
          (n_A_Buf3[17] = 1 * c.A3_Skill11_LUK.value),
          (n_A_Buf3[18] = 1 * c.A3_Skill11a.checked)),
        n_A_Buf3[0] &&
          ((n_A_Buf3[20] = 1 * c.A3_Skill0_2.value),
          (n_A_Buf3[19] = 1 * c.A3_Skill0_4.value),
          (n_A_Buf3[30] = 1 * c.A3_Skill0_3.value)),
        n_A_Buf3[1] &&
          ((n_A_Buf3[21] = 1 * c.A3_Skill1_2.value), (n_A_Buf3[31] = 1 * c.A3_Skill1_3.value)),
        n_A_Buf3[2] &&
          ((n_A_Buf3[22] = 1 * c.A3_Skill2_2.value),
          (n_A_Buf3[29] = 1 * c.A3_Skill2_3.value),
          (n_A_Buf3[32] = 1 * c.A3_Skill2_4.value)),
        n_A_Buf3[3] &&
          ((n_A_Buf3[23] = 1 * c.A3_Skill3_2.value), (n_A_Buf3[33] = 1 * c.A3_Skill3_3.value)),
        n_A_Buf3[4] &&
          ((n_A_Buf3[24] = 1 * c.A3_Skill4_2.value), (n_A_Buf3[34] = 1 * c.A3_Skill4_3.value)),
        n_A_Buf3[5] &&
          ((n_A_Buf3[25] = 1 * c.A3_Skill5_2.value), (n_A_Buf3[35] = 1 * c.A3_Skill5_3.value)),
        n_A_Buf3[6] &&
          ((n_A_Buf3[26] = 1 * c.A3_Skill6_2.value), (n_A_Buf3[36] = 1 * c.A3_Skill6_3.value)),
        n_A_Buf3[37] &&
          ((n_A_Buf3[38] = 1 * c.A3_Skill12_2.value),
          (n_A_Buf3[39] = 1 * c.A3_Skill12_3.value),
          (n_A_Buf3[27] = 1 * c.A3_Skill12_4.value))),
      n_Skill4SW &&
        ((n_A_Buf3[40] = 1 * c.A3_Skill40.checked),
        (n_A_Buf3[41] = 1 * c.A3_Skill41.value),
        (n_A_Buf3[42] = 1 * c.A3_Skill42.value),
        (n_A_Buf3[43] = 1 * c.A3_Skill43.value),
        (n_A_Buf3[44] = 1 * c.A3_Skill44.value)),
      n_Skill6SW &&
        ((n_A_Buf6[0] = 1 * c.A6_Skill0.value),
        (n_A_Buf6[1] = 1 * c.A6_Skill1.value),
        (n_A_Buf6[3] = 1 * c.A6_Skill3.checked),
        (n_A_Buf6[4] = 1 * c.A6_Skill4.value),
        (n_A_Buf6[5] = 1 * c.A6_Skill5.value),
        (n_A_Buf6[6] = 1 * c.A6_Skill6.checked),
        (n_A_Buf6[7] = 1 * c.A6_Skill7.checked),
        (n_A_Buf6[8] = 1 * c.A6_Skill8.checked),
        (n_A_Buf6[9] = 1 * c.A6_Skill9.checked),
        (n_A_Buf6[10] = 1 * c.A6_Skill10.checked),
        (n_A_Buf6[11] = 1 * c.A6_Skill11.checked),
        (n_A_Buf6[12] = 1 * c.A6_Skill12.checked),
        (n_A_Buf6[13] = 1 * c.A6_Skill13.checked),
        (n_A_Buf6[14] = 1 * c.A6_Skill14.checked),
        (n_A_Buf6[15] = 1 * c.A6_Skill15.checked),
        (n_A_Buf6[16] = 1 * c.A6_Skill16.checked),
        (n_A_Buf6[17] = 1 * c.A6_Skill17.checked),
        (n_A_Buf6[18] = 1 * c.A6_Skill18.value),
        (n_A_Buf6[19] = 1 * c.A_debuf0.value),
        (n_A_Buf6[20] = 1 * c.A_debuf1.value),
        (n_A_Buf6[21] = 1 * c.A_debuf2.checked),
        (n_A_Buf6[22] = 1 * c.A_debuf3.checked),
        (n_A_Buf8[0] = 1 * c.A8_Skill0.value),
        (n_A_Buf8[1] = 1 * c.A8_Skill1.value),
        (n_A_Buf8[2] = 1 * c.A8_Skill2.checked),
        (n_A_Buf8[3] = 1 * c.A8_Skill3.value),
        (n_A_Buf8[5] = 1 * c.A8_Skill5.value),
        (n_A_Buf8[6] = 1 * c.A8_Skill6.value),
        (n_A_Buf8[7] = 1 * c.A8_Skill7.value),
        (n_A_Buf8[8] = 1 * c.A8_Skill8.value),
        (n_A_Buf8[9] = 1 * c.A8_Skill9.value),
        (n_A_Buf8[10] = 1 * c.A8_Skill10.value),
        (n_A_Buf8[11] = 1 * c.A8_Skill11.value)),
      n_Skill7SW &&
        ((n_A_Buf7[0] = 1 * c.A7_Skill0.checked),
        (n_A_Buf7[1] = 1 * c.A7_Skill1.checked),
        (n_A_Buf7[2] = 1 * c.A7_Skill2.checked),
        (n_A_Buf7[3] = 1 * c.A7_Skill3.value),
        (n_A_Buf7[4] = 1 * c.A7_Skill4.value),
        (n_A_Buf7[5] = 1 * c.A7_Skill5.value),
        (n_A_Buf7[6] = 1 * c.A7_Skill6.value),
        (n_A_Buf7[7] = 1 * c.A7_Skill7.value),
        (n_A_Buf7[8] = 1 * c.A7_Skill8.value),
        (n_A_Buf7[9] = 1 * c.A7_Skill9.checked),
        (n_A_Buf7[10] = 1 * c.A7_Skill10.checked),
        (n_A_Buf7[11] = 1 * c.A7_Skill11.checked),
        (n_A_Buf7[12] = 1 * c.A7_Skill12.checked),
        (n_A_Buf7[13] = 1 * c.A7_Skill13.checked),
        (n_A_Buf7[14] = 1 * c.A7_Skill14.checked),
        (n_A_Buf7[16] = 1 * c.A7_Skill16.checked),
        (n_A_Buf7[17] = 1 * c.A7_Skill17.checked),
        (n_A_Buf7[18] = 1 * c.A7_Skill18.checked),
        (n_A_Buf7[19] = 1 * c.A7_Skill19.checked),
        (n_A_Buf7[20] = 1 * c.A7_Skill20.checked),
        (n_A_Buf7[21] = 1 * c.A7_Skill21.checked),
        (n_A_Buf7[22] = 1 * c.A7_Skill22.checked),
        (n_A_Buf7[23] = 1 * c.A7_Skill23.checked),
        (n_A_Buf7[24] = 1 * c.A7_Skill24.checked),
        (n_A_Buf7[25] = 1 * c.A7_Skill25.checked),
        (n_A_Buf7[26] = 1 * c.A7_Skill26.checked),
        (n_A_Buf7[27] = 1 * c.A7_Skill27.checked),
        (n_A_Buf7[28] = 1 * c.A7_Skill28.checked),
        (n_A_Buf7[29] = 1 * c.A7_Skill29.checked),
        (n_A_Buf7[30] = 1 * c.A7_Skill30.checked),
        (n_A_Buf7[31] = 1 * c.A7_Skill31.checked),
        (n_A_Buf7[32] = 1 * c.A7_Skill32.checked),
        (n_A_Buf7[33] = 1 * c.A7_Skill33.checked),
        (n_A_Buf7[34] = 1 * c.A7_Skill34.checked),
        (n_A_Buf7[35] = 1 * c.A_SpeedPOT.value),
        (n_A_Buf7[36] = 1 * c.A7_Skill36.checked),
        (n_A_Buf7[37] = 1 * c.A7_Skill37.checked),
        (n_A_Buf7[38] = 1 * c.A7_Skill38.checked),
        (n_A_Buf7[39] = 1 * c.A7_Skill39.value),
        (n_A_Buf7[40] = 1 * c.A7_Skill40.value),
        (n_A_Buf7[41] = 1 * c.A7_Skill41.checked),
        (n_A_Buf7[42] = 1 * c.A7_Skill42.value),
        (n_A_Buf7[43] = 0),
        (n_A_Buf7[44] = 1 * c.A7_Skill44.checked),
        (n_A_Buf7[45] = 1 * c.A7_Skill45.checked),
        (n_A_Buf7[46] = 1 * c.A7_Skill46.checked),
        (n_A_Buf7[47] = 1 * c.A7_Skill47.checked),
        (n_A_Buf7[48] = 1 * c.A7_Skill48.checked),
        (n_A_Buf7[49] = 1 * c.A7_Skill49.checked),
        (n_A_Buf7[50] = 1 * c.A7_Skill50.checked),
        (n_A_Buf7[51] = 1 * c.A7_Skill51.checked)),
      n_Skill9SW &&
        ((n_A_Buf9[0] = 1 * c.A9_Skill0.value),
        (n_A_Buf9[1] = 1 * c.ARG_RC0.value),
        (n_A_Buf9[2] = 1 * c.A9_Skill1.value),
        (n_A_Buf9[3] = 1 * c.ARG_RC1.value),
        (n_A_Buf9[4] = 1 * c.A9_Skill2.value),
        (n_A_Buf9[5] = 1 * c.ARG_RC2.value),
        (n_A_Buf9[6] = 1 * c.A9_Skill3.value),
        (n_A_Buf9[7] = 1 * c.ARG_RC3.value),
        (n_A_Buf9[8] = 1 * c.A9_Skill4.value),
        (n_A_Buf9[9] = 1 * c.ARG_RC4.value),
        (n_A_Buf9[10] = 1 * c.A9_Skill5.value),
        (n_A_Buf9[11] = 1 * c.ARG_RC5.value),
        (n_A_Buf9[12] = 1 * c.A9_Skill6.value),
        (n_A_Buf9[13] = 1 * c.ARG_RC6.value),
        (n_A_Buf9[14] = 1 * c.A9_Skill7.value),
        (n_A_Buf9[15] = 1 * c.ARG_RC7.value),
        (n_A_Buf9[16] = 1 * c.ARG_RC43.value),
        (n_A_Buf9[17] = 1 * c.ARG_RC44.value),
        (n_A_Buf9[18] = 1 * c.ARG_RC45.value),
        (n_A_Buf9[19] = 1 * c.ARG_RC47.value),
        (n_A_Buf9[20] = 1 * c.A9_Skill8.value),
        (n_A_Buf9[21] = 1 * c.ARG_RC48.value),
        (n_A_Buf9[22] = 1 * c.A9_Skill9.value),
        (n_A_Buf9[23] = 1 * c.ARG_RC83.value),
        (n_A_Buf9[24] = 1 * c.ARG_RC84.value),
        (n_A_Buf9[25] = 1 * c.ARG_RC85.value),
        (n_A_Buf9[26] = 1 * c.ARG_RC86.value),
        (n_A_Buf9[27] = 1 * c.ARG_RC87.value),
        (n_A_Buf9[28] = 1 * c.ARG_RC88.value),
        (n_A_Buf9[30] = 1 * c.ARG_RC15.value),
        (n_A_Buf9[31] = 1 * c.ARG_RC16.value),
        (n_A_Buf9[32] = 1 * c.ARG_RC17.value),
        (n_A_Buf9[33] = 1 * c.ARG_RC18.value),
        (n_A_Buf9[34] = 1 * c.ARG_RC19.value),
        (n_A_Buf9[35] = 1 * c.ARG_RC20.value),
        (n_A_Buf9[36] = 1 * c.ARG_RC21.value),
        (n_A_Buf9[37] = 1 * c.ARG_RC22.value),
        (n_A_Buf9[38] = 1 * c.ARG_RC23.value),
        (n_A_Buf9[39] = 1 * c.ARG_RC24.value),
        (n_A_Buf9[40] = 1 * c.ARG_RC25.value),
        (n_A_Buf9[41] = 1 * c.ARG_RC26.value),
        (n_A_Buf9[42] = 1 * c.ARG_RC27.value),
        (n_A_Buf9[43] = 1 * c.ARG_RC28.value),
        (n_A_Buf9[44] = 1 * c.ARG_RC29.value),
        (n_A_Buf9[45] = 1 * c.ARG_RC30.value),
        (n_A_Buf9[46] = 1 * c.ARG_RC31.value),
        (n_A_Buf9[47] = 1 * c.ARG_RC32.value),
        (n_A_Buf9[48] = 1 * c.ARG_RC33.value),
        (n_A_Buf9[49] = 1 * c.ARG_RC34.value),
        (n_A_Buf9[50] = 1 * c.ARG_RC35.value),
        (n_A_Buf9[51] = 1 * c.ARG_RC36.value),
        (n_A_Buf9[52] = 1 * c.ARG_RC37.value),
        (n_A_Buf9[53] = 1 * c.ARG_RC38.value),
        (n_A_Buf9[54] = 1 * c.ARG_RC39.value),
        (n_A_Buf9[55] = 1 * c.ARG_RC40.value),
        (n_A_Buf9[56] = 1 * c.ARG_RC41.value),
        (n_A_Buf9[57] = 1 * c.ARG_RC42.value),
        (n_A_Buf9[58] = 0),
        (n_A_Buf9[59] = 0)),
      n_Skill10SW &&
        ((n_B_manual[1] = 1 * c.BRG_RC0.value),
        (n_B_manual[2] = 1 * c.Bman1.value),
        (n_B_manual[3] = 1 * c.BRG_RC1.value),
        (n_B_manual[4] = 1 * c.Bman2.value),
        (n_B_manual[5] = 1 * c.BRG_RC2.value),
        (n_B_manual[7] = 1 * c.BRG_RC3.value),
        (n_B_manual[9] = 1 * c.BRG_RC4.value),
        (n_B_manual[21] = 1 * c.BRG_RC10.value),
        (n_B_manual[30] = 1 * c.BRG_RC15.value),
        (n_B_manual[31] = 1 * c.BRG_RC16.value),
        (n_B_manual[34] = 1 * c.BRG_RC19.value),
        (n_B_manual[35] = 1 * c.BRG_RC20.value),
        (n_B_manual[36] = 1 * c.BRG_RC21.value),
        (n_B_manual[37] = 1 * c.BRG_RC22.value),
        (n_B_manual[38] = 1 * c.BRG_RC23.value),
        (n_B_manual[39] = 1 * c.BRG_RC24.value),
        (n_B_manual[40] = 1 * c.BRG_RC25.value),
        (n_B_manual[41] = 1 * c.BRG_RC26.value),
        (n_B_manual[42] = 1 * c.BRG_RC27.value),
        (n_B_manual[43] = 1 * c.BRG_RC28.value),
        (n_B_manual[44] = 1 * c.BRG_RC29.value),
        (n_B_manual[48] = 1 * c.BRG_RC33.value),
        (n_B_manual[49] = 1 * c.BRG_RC34.value),
        (n_B_manual[50] = 1 * c.BRG_RC35.value),
        (n_B_manual[51] = 1 * c.BRG_RC36.value),
        (n_B_manual[52] = 1 * c.BRG_RC37.value),
        (n_B_manual[53] = 1 * c.BRG_RC38.value),
        (n_B_manual[54] = 1 * c.BRG_RC39.value),
        (n_B_manual[55] = 1 * c.BRG_RC40.value)),
      l = 0;
    l <= 22;
    l++
  )
    targetData[l] = m_Monster[c.B_Enemy.value][l];
  for (
    n_A_Bodyelement = StPlusCard(198),
      n_A_Bodyelement == 0 && (n_A_Bodyelement = StPlusCalc2(198)),
      (n_A_JOB != 13 && n_A_JOB != 27) || !CardNumSearch(456) || (n_A_Bodyelement = 6),
      n_A_Buf6[6] && (n_A_Bodyelement = 6),
      n_A_Buf6[13] && (n_A_Bodyelement = 2),
      n_A_Buf6[15] && (n_A_Bodyelement = 1),
      n_A_Buf6[8] && (n_A_Bodyelement = 9),
      myInnerHtml("A_BodyELEMENT", v_Element[n_A_Bodyelement] + "1", 0),
      l = 0;
    l <= 6;
    l++
  )
    n_Delay[l] = 0;
  for (l = 1; l <= BONUSID.WEAPON_SIZE_PENALTY; l++)
    ((bonusValues[l] = 0), (bonusValues[l] += StPlusCalc2(l)), (bonusValues[l] += StPlusCard(l)));
  for (l = BONUSID.DMG_NEUTRAL_PHYSICAL_MAGIC_PERCENT; l <= BONUSID.WATER_MAGIC_DMG_PERCENT; l++)
    ((bonusValues[l] = 0), (bonusValues[l] += StPlusCalc2(l)), (bonusValues[l] += StPlusCard(l)));
  for (l = 290; l <= 339; l++)
    ((bonusValues[l] = 0), (bonusValues[l] += StPlusCalc2(l)), (bonusValues[l] += StPlusCard(l)));
  // uaRO: Mitra e Old Mitra: bonus che dipendono da INT base e raffinamento (in motore/uaro.js)
  (applyForbiddenGrimoireComboBonuses(), applyUaroHeadgearBonuses());
  var n = Math.floor(n_A_SHOES_REFINE / 3);
  switch (n_A_Equip[8]) {
    case EQUIPID.TEMPORAL_INT_BOOTS:
      ((bonusValues[BONUSID.HP] += 100 * n),
        (bonusValues[BONUSID.SP] += 10 * n),
        (bonusValues[BONUSID.INT] += n),
        (bonusValues[BONUSID.DEX] += n),
        SU_INT >= 90 && (bonusValues[BONUSID.MATK_PERCENT] += 5));
      break;
    case EQUIPID.TEMPORAL_STR_BOOTS:
      ((bonusValues[BONUSID.HP] += 100 * n),
        (bonusValues[BONUSID.SP] += 10 * n),
        (bonusValues[BONUSID.STR] += n),
        SU_STR >= 90 && (bonusValues[BONUSID.ATK_PERCENT] += 5));
      break;
    case EQUIPID.TEMPORAL_DEX_BOOTS:
      ((bonusValues[BONUSID.HP] += 100 * n),
        (bonusValues[BONUSID.SP] += 10 * n),
        (bonusValues[BONUSID.DEX] += n),
        SU_DEX >= 90 && (bonusValues[BONUSID.RANGED_ATK_PERCENT] += 5));
      break;
    case EQUIPID.TEMPORAL_AGI_BOOTS:
      ((bonusValues[BONUSID.HP] += 100 * n),
        (bonusValues[BONUSID.SP] += 10 * n),
        (bonusValues[BONUSID.ASPD] += 3 * n),
        SU_AGI >= 90 && (bonusValues[BONUSID.ASPD] += 3));
      break;
    case EQUIPID.TEMPORAL_VIT_BOOTS:
      ((bonusValues[BONUSID.HP] += 200 * n),
        (bonusValues[BONUSID.SP] += 10 * n),
        (bonusValues[BONUSID.HP_PERCENT] += 4 * n),
        SU_VIT >= 75 && (bonusValues[BONUSID.HP_PERCENT] += 10));
      break;
    case EQUIPID.TEMPORAL_LUK_BOOTS:
      ((bonusValues[BONUSID.HP] += 100 * n),
        (bonusValues[BONUSID.SP] += 10 * n),
        (bonusValues[BONUSID.CRIT_DMG_PERCENT] += 5 * n),
        SU_LUK >= 50 && (bonusValues[BONUSID.CRIT_DMG_PERCENT] += 10),
        SU_LUK >= 70 &&
          ((bonusValues[BONUSID.CRIT_DMG_PERCENT] += 15), (bonusValues[BONUSID.MDEF] += 5)));
      break;
  }
  if (
    (EQUIPID.GOLDEN_WRENCH == n_A_Equip[0] &&
      (n_A_Weapon_refine >= 7 && (bonusValues[BONUSID.CRIT] += 20),
      n_A_Weapon_refine >= 8 && (bonusValues[BONUSID.ASPD] += 10),
      n_A_Weapon_refine >= 9 && (bonusValues[BONUSID.ATK] += 50)),
    EQUIPID.DEATH_FIRE == n_A_Equip[0])
  ) {
    var s = getDeathFireRefineBonuses(n_A_Weapon_refine);
    ((bonusValues[BONUSID.ASPD] += s.aspd),
      (bonusValues[BONUSID.RANGED_ATK_PERCENT] += s.rangedDamage));
  }
  if (
    (EQUIPID.BLACK_WING == n_A_Equip[0] &&
      (bonusValues[BONUSID.ATK] += 5 * Math.max(0, n_A_Weapon_refine - 5)),
    EQUIPID.BOLT_REVOLVER == n_A_Equip[0] &&
      (n_A_Weapon_refine >= 7 && (bonusValues[BONUSID.ASPD] += 10),
      n_A_Weapon_refine >= 9 && (bonusValues[BONUSID.RANGED_ATK_PERCENT] += 10)),
    EQUIPID.KING_COBRA == n_A_Equip[0] &&
      (n_A_Weapon_refine >= 7 && (bonusValues[BONUSID.CRIT_DMG_PERCENT] += 20),
      n_A_Weapon_refine >= 9 && (bonusValues[BONUSID.RANGED_ATK_PERCENT] += 10)),
    EQUIPID.AVENGER == n_A_Equip[0] &&
      ((bonusValues[BONUSID.ASPD] += 2 * n_A_Weapon_refine),
      n_A_Weapon_refine >= 9 && (bonusValues[BONUSID.RANGED_ATK_PERCENT] += 10)),
    EQUIPID.LUST_CRUSHER == n_A_Equip[0] &&
      (n_A_Weapon_refine >= 7 && (bonusValues[BONUSID.ATK] += 20),
      n_A_Weapon_refine >= 9 && (bonusValues[BONUSID.RANGED_ATK_PERCENT] += 10)),
    EQUIPID.FORTIFIED_DAGGER == n_A_Equip[0] &&
      (n_A_Weapon_refine >= 7 && (bonusValues[BONUSID.HP_PERCENT] += 5),
      n_A_Weapon_refine >= 9 &&
        ((bonusValues[BONUSID.MATK_PERCENT] += 5), (bonusValues[BONUSID.HP_PERCENT] += 10))),
    EQUIPID.ILLUSION_WING_SHURIKEN == n_A_Equip[0] &&
      n_A_Weapon_refine >= 9 &&
      (bonusValues[BONUSID.RANGED_ATK_PERCENT] += 10),
    EQUIPID.VALKYRIE_KNIFE == n_A_Equip[0] &&
      (n_A_Weapon_refine >= 7 &&
        ((bonusValues[BONUSID.ASPD] += 10),
        (bonusValues[BONUSID.HP] += 500),
        (bonusValues[BONUSID.SP] += 200),
        (bonusValues[BONUSID.CRIT] += 25),
        (bonusValues[BONUSID.CRIT_DMG_PERCENT] += 20),
        (bonusValues[BONUSID.MATK] += 40),
        (bonusValues[BONUSID.ATK] += 30),
        (bonusValues[BONUSID.RESIST_DEMI_HUMAN_PERCENT] += 10)),
      n_A_Weapon_refine >= 9 &&
        ((bonusValues[BONUSID.ASPD] += 5),
        (bonusValues[BONUSID.HP] += 300),
        (bonusValues[BONUSID.SP] += 100),
        (bonusValues[BONUSID.CRIT] += 10),
        (bonusValues[BONUSID.CRIT_DMG_PERCENT] += 10),
        (bonusValues[BONUSID.MATK] += 20),
        (bonusValues[BONUSID.ATK] += 15))),
    EQUIPID.OLD_PARASOL == n_A_Equip[0] && (bonusValues[BONUSID.ATK] += 5 * n_A_Weapon_refine),
    n_A_card[13] == 572)
  ) {
    var _ = Math.floor(n_A_SHOES_REFINE / 2);
    ((bonusValues[BONUSID.ATK_PERCENT] += _),
      (bonusValues[BONUSID.MATK_PERCENT] += _),
      (bonusValues[BONUSID.HP_PERCENT] -= 2 * _));
  }
  for (
    StPlusCalc(),
      ApplyBastionEnchants(),
      ApplyDicastesPrimaryEnchants(),
      restrictEquipslot(),
      equip_restrict
        ? (bonusValues[195]
            ? ((c.A_LEFT_REFINE.disabled = !0),
              (c.A_LEFT_REFINE.value = 0),
              (c.A_left.disabled = !0),
              (c.A_left.value = 305),
              (c.A_left_card.disabled = !0),
              (c.A_left_card.value = 0))
            : n_A_WeaponType == 9 &&
              ((c.A_LEFT_REFINE.disabled = !1),
              (c.A_left.disabled = !1),
              card_restrict &&
                itemData[c.A_left.value].slots != 0 &&
                (c.A_left_card.disabled = !1)),
          bonusValues[200] == 1
            ? ((c.A_head2.disabled = !0),
              (c.A_head2.value = 243),
              (c.A_head2_card.disabled = !0),
              (c.A_head2_card.value = 0),
              (c.A_head3.disabled = !1))
            : bonusValues[200] == 2
              ? ((c.A_head2.disabled = !1),
                (c.A_head2_card.disabled = !1),
                (c.A_head3.disabled = !0),
                (c.A_head3.value = 268))
              : bonusValues[200] == 3
                ? ((c.A_head3.disabled = !0), (c.A_head3.value = 268))
                : bonusValues[200] >= 4
                  ? ((c.A_head2.disabled = !0),
                    (c.A_head2.value = 243),
                    (c.A_head2_card.disabled = !0),
                    (c.A_head2_card.value = 0),
                    (c.A_head3.disabled = !0),
                    (c.A_head3.value = 268))
                  : ((c.A_head2.disabled = !1), (c.A_head3.disabled = !1)))
        : ((c.A_LEFT_REFINE.disabled = !1),
          (c.A_left.disabled = !1),
          (card_restrict = 1 * c.restrict_cardslot.checked),
          card_restrict || ((c.A_left_card.disabled = !1), (c.A_head2_card.disabled = !1)),
          (c.A_head2.disabled = !1),
          (c.A_head3.disabled = !1)),
      n_A_WeaponType != 10 &&
      n_A_WeaponType != 14 &&
      n_A_WeaponType != 15 &&
      n_A_WeaponType != 17 &&
      n_A_WeaponType != 18 &&
      n_A_WeaponType != 19 &&
      n_A_WeaponType != 20 &&
      n_A_WeaponType != 21
        ? ((n_A_ATK_w = Math.round(Math.floor(n_A_STR / 10) * Math.floor(n_A_STR / 10))),
          (n_A_ATK = n_A_STR + n_A_ATK_w + Math.floor(n_A_DEX / 5) + Math.floor(n_A_LUK / 5)))
        : ((n_A_ATK_w = Math.round(Math.floor(n_A_DEX / 10) * Math.floor(n_A_DEX / 10))),
          (n_A_ATK = n_A_DEX + n_A_ATK_w + Math.floor(n_A_STR / 5) + Math.floor(n_A_LUK / 5))),
      t = bonusValues[17],
      t += n_A_Buf9[40],
      n_A_Buf7[17] && (t += 5),
      n_A_Buf7[38]
        ? (t += 30)
        : n_A_Buf7[9] || n_A_Buf7[46]
          ? (t += 20)
          : n_A_Buf7[29]
            ? (t += 15)
            : n_A_Buf7[2] && (t += 10),
      SkillSearch(SKILLID.HILT_BINDING) && (t += 4),
      SkillSearch(SKILLID.LAST_STAND) && (t += 100),
      t += Math.floor(n_A_JobLV / 10) * CardNumSearch(492),
      n_A_JobClass() == 4 && (t += 10 * EquipNumSearch(EQUIPID.ARCHER_FIGURE)),
      n_A_Equip[2] == 676 && (t += 2 * n_A_HEAD_REFINE),
      n_A_Equip[0] == 1165 && (t += 10 * SkillSearch(SKILLID.NUM_MASTERED_SMITH_SKILLS)),
      n_A_Equip[7] == 1714 && (t += 2 * n_A_SHOULDER_REFINE),
      n_A_Equip[6] == 1723 && (t += 3 * n_A_BODY_REFINE),
      SU_AGI >= 90 && (t += 10 * EquipNumSearch(EQUIPID.ROGUES_TREASURE)),
      SU_STR >= 80 && n_A_card[12] == 267 && (t += 20),
      SU_STR >= 95 && n_A_Equip[0] == 621 && (t += 340),
      SU_STR >= 44 && n_A_Equip[0] == 625 && (t += 44),
      SU_STR >= 95 && n_A_Equip[0] == 1160 && (t += 20),
      SU_LUK >= 90 && n_A_Equip[0] == 1164 && (t += 20),
      SU_STR >= 99 && EquipNumSearch(EQUIPID.NAB_SET_ARO) && (t += 30),
      (n_A_Equip[2] != 953 && n_A_Equip[2] != 1261) || (t += Math.floor((2 * n_A_JobLV) / 7)),
      n_A_HEAD_REFINE >= 5 && n_A_Equip[2] == 1218 && (t += n_A_HEAD_REFINE - 4),
      n_A_HEAD_REFINE >= 5 && n_A_Equip[2] == 1495 && (t += n_A_HEAD_REFINE - 4),
      n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1274 && (t += 15),
      n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1474 && (t += 15),
      n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1275 && (t += 15),
      n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1475 && (t += 15),
      n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1276 && (t += 15),
      n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1477 && (t += 15),
      n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1479 && (t += 15),
      n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1480 && (t += 15),
      n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1291 && (t += 5),
      n_A_HEAD_REFINE == 10 && n_A_Equip[2] == 1290 && (t += 5),
      n_A_SHOULDER_REFINE >= 7 && SU_STR >= 90 && n_A_Equip[7] == 1472 && (t += 20),
      n_A_SHOULDER_REFINE >= 9 && SU_STR >= 90 && n_A_Equip[7] == 1472 && (t += 10),
      !SkillSearch(SKILLID.GATLING_FEVER) ||
        (n_A_WeaponType != 20 && n_A_WeaponType != 0) ||
        (t += 20 + 10 * SkillSearch(SKILLID.GATLING_FEVER)),
      n_A_Buf6[0] == 0 && n_A_Buf6[1] >= 1 && n_A_Bodyelement == 3 && (t += 10 * n_A_Buf6[1]),
      t < 0 && (t = 0),
      n_A_ATK += t,
      n_A_Weapon_ATK += bonusValues[BONUSID.WEAPON_ATK],
      V_ATK = Math.floor(n_A_Weapon_ATK + n_A_Weapon2_ATK + n_A_ATK),
      t = bonusValues[87] + n_A_Buf9[53],
      t += 2 * SkillSearch(SKILLID.KIHOP) * SkillSearch(SKILLID.OTHER_PARTY_MEMBERS),
      n_A_Equip[2] == 1799 &&
        ((wSPVS = n_A_JobClass()), (wSPVS != 1 && wSPVS != 2 && wSPVS != 6) || (t += 8)),
      V_ATK,
      V_ATK += Math.floor(V_ATK * (t / 100)),
      SkillSearch(SKILLID.SPEAR_DYNAMO) &&
        (V_ATK = Math.floor(V_ATK * (1 + 0.05 * SkillSearch(SKILLID.SPEAR_DYNAMO)))),
      n_A_ATK,
      n_A_ATK = Math.floor((n_A_ATK * (100 + t)) / 100),
      wImp = 5 * n_A_Buf2[2],
      n_A_Buf3[9] && (wImp += 25 + 25 * n_A_Buf3[9]),
      !n_A_Buf3[10] ||
        (n_A_WeaponLV != 4 && n_A_Weapon2LV != 4) ||
        (V_ATK += 50 + 25 * n_A_Buf3[10]),
      n_A_Buf6[0] == 0 && n_A_Buf6[1] >= 1 && n_A_Bodyelement == 3 && (V_ATK += 10 * n_A_Buf6[1]),
      n_A_Buf2[19] == 1 && (V_ATK *= 2),
      myInnerHtml(
        "A_ATK2",
        Math.floor(wImp + V_ATK) + "+" + (n_A_WeaponLV_refineATK + n_A_Weapon2LV_refineATK),
        0,
      ),
      myInnerHtml(
        "A_RealATK",
        wImp +
          V_ATK +
          n_A_WeaponLV_refineATK +
          n_A_Weapon2LV_refineATK +
          n_A_WeaponLV_Minplus +
          "~" +
          (wImp + V_ATK + n_A_WeaponLV_refineATK + n_A_Weapon2LV_refineATK + n_A_WeaponLV_Maxplus),
        0,
      ),
      JobHP_A = new Array(
        0,
        70,
        50,
        40,
        50,
        30,
        40,
        150,
        110,
        75,
        85,
        55,
        90,
        110,
        85,
        90,
        75,
        75,
        75,
        90,
        0,
        150,
        110,
        75,
        85,
        55,
        90,
        110,
        85,
        90,
        75,
        75,
        75,
        90,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        70,
        90,
        75,
        75,
        84,
      ),
      JobHP_B = new Array(
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        7,
        5,
        6.5,
        3,
        3,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        7,
        5,
        6.5,
        3,
        3,
        5,
        5,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        5,
        6.5,
        5,
        3,
        3.5,
      ),
      wHPSL = 0,
      n_A_JOB == 43 &&
        n_A_BaseLV >= 70 &&
        (n_A_BaseLV <= 79
          ? (wHPSL = 40 * (n_A_BaseLV - 70))
          : n_A_BaseLV <= 84
            ? (wHPSL = 50 * (n_A_BaseLV - 80))
            : n_A_BaseLV <= 89
              ? (wHPSL = 50 * (n_A_BaseLV - 80) - 10)
              : n_A_BaseLV <= 92
                ? (wHPSL = 50 * (n_A_BaseLV - 90))
                : n_A_BaseLV <= 97
                  ? (wHPSL = 50 * (n_A_BaseLV - 90) - 10)
                  : n_A_BaseLV == 98
                    ? (wHPSL = 375)
                    : (wHPSL = 4)),
      t = 0,
      l = 2;
    l <= n_A_BaseLV;
    l++
  )
    t += Math.round((JobHP_A[n_A_JOB] * l) / 100);
  switch (
    ((n_A_MaxHP = Math.floor(JobHP_B[n_A_JOB] * n_A_BaseLV + 35 + t)),
    n_A_JOB == 44 &&
      ((NinHP = new Array(
        131,
        137,
        144,
        151,
        159,
        167,
        175,
        184,
        193,
        202,
        212,
        222,
        232,
        243,
        254,
        265,
        277,
        289,
        301,
        316,
        331,
        346,
        364,
        382,
        400,
        420,
        440,
        460,
        482,
        504,
        526,
        548,
        572,
        596,
        620,
        646,
        672,
        698,
        726,
        754,
        784,
        814,
        844,
        876,
        908,
        940,
        975,
        1010,
        1100,
        1140,
        1180,
        1220,
        1260,
        1300,
        1340,
        1385,
        1430,
        1475,
        1520,
        1565,
        1615,
        1665,
        1715,
        1765,
        1815,
        1880,
        1935,
        1990,
        2045,
        2100,
        2160,
        2200,
        2280,
        2340,
        2400,
        2460,
        2520,
        2580,
        2640,
        2705,
        2770,
        2835,
        2900,
        2965,
        3030,
        3100,
        3170,
        3240,
        3310,
        3380,
        3455,
        3530,
        3605,
        3680,
        3760,
        3840,
        3920,
        4e3,
        4080,
      )),
      (n_A_MaxHP = NinHP[n_A_BaseLV - 1])),
    n_A_JOB == 45 &&
      n_A_BaseLV >= 10 &&
      ((GunHP = new Array(
        202,
        212,
        222,
        232,
        243,
        254,
        265,
        277,
        289,
        301,
        316,
        331,
        346,
        364,
        382,
        400,
        420,
        440,
        460,
        490,
        520,
        550,
        580,
        610,
        650,
        680,
        710,
        740,
        770,
        800,
        830,
        860,
        890,
        920,
        950,
        990,
        1020,
        1050,
        1080,
        1110,
        1140,
        1180,
        1230,
        1280,
        1330,
        1395,
        1455,
        1515,
        1575,
        1635,
        1695,
        1760,
        1820,
        1885,
        1950,
        2015,
        2080,
        2145,
        2210,
        2275,
        2340,
        2410,
        2480,
        2550,
        2620,
        2690,
        2760,
        2830,
        2900,
        2970,
        3040,
        3115,
        3190,
        3265,
        3340,
        3415,
        3490,
        3565,
        3640,
        3715,
        3790,
        3870,
        3950,
        4030,
        4110,
        4190,
        4270,
        4350,
        4430,
        4510,
      )),
      (n_A_MaxHP = GunHP[n_A_BaseLV - 10])),
    n_A_JOB == 20 && n_A_BaseLV == 99 && (n_A_MaxHP += 2e3),
    n_Reborn && (n_A_MaxHP = Math.floor((125 * n_A_MaxHP) / 100)),
    1 * c.A_adopted.checked
      ? ((n_A_MaxHP = Math.floor((70 * n_A_MaxHP) / 100)),
        myInnerHtml("A_BodySIZE", "Demi-Human & Small", 0))
      : myInnerHtml("A_BodySIZE", "Demi-Human & Medium", 0),
    (n_A_MaxHP = Math.floor(((n_A_MaxHP - wHPSL) * (100 + n_A_VIT)) / 100)),
    n_A_JOB == 41 &&
      n_A_BaseLV >= 70 &&
      (n_A_BaseLV <= 79
        ? (n_A_MaxHP = Math.floor(((2127 + 10 * (n_A_BaseLV - 70)) * (100 + n_A_VIT)) / 100))
        : n_A_BaseLV <= 89
          ? (n_A_MaxHP = Math.floor(((2200 + 50 * (n_A_BaseLV - 80)) * (100 + n_A_VIT)) / 100))
          : n_A_BaseLV <= 99 &&
            ((n_A_MaxHP = ((2700 + 50 * (n_A_BaseLV - 90)) * (100 + n_A_VIT)) / 100),
            SkillSearch(SKILLID.TAEKWON_RANKER) && (n_A_MaxHP *= 3),
            (n_A_MaxHP = Math.floor(n_A_MaxHP)))),
    n_A_JOB == 42 &&
      n_A_BaseLV >= 70 &&
      ((wKenseiHP = [3455, 3524, 3593, 3663, 3834, 3806, 3878, 3951, 4025, 4500]),
      n_A_BaseLV <= 79
        ? (n_A_MaxHP = Math.floor(((2670 + 10 * (n_A_BaseLV - 70)) * (100 + n_A_VIT)) / 100))
        : n_A_BaseLV <= 89
          ? (n_A_MaxHP = Math.floor(((3e3 + 20 * (n_A_BaseLV - 80)) * (100 + n_A_VIT)) / 100))
          : n_A_BaseLV <= 99 &&
            (n_A_MaxHP = Math.floor((wKenseiHP[n_A_BaseLV - 90] * (100 + n_A_VIT)) / 100))),
    n_A_Buf7[39])
  ) {
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
  switch (
    ((n_A_MaxHP += 200 * SkillSearch(SKILLID.FAITH)),
    (t = 0),
    (t += bonusValues[13] + n_A_Buf9[30]),
    n_A_BaseLV <= 79 && (t += 400 * EquipNumSearch(EQUIPID.ACADEMY_OF_BADGE)),
    n_A_JobClass() == 5 && (t -= 100 * CardNumSearch(474)),
    n_A_JobClass() == 0 && (t += 30 * EquipNumSearch(EQUIPID.NOVICE_FIGURE)),
    n_A_JobClass() == 1 && (t += 500 * CardNumSearch(477)),
    n_A_card[11] == 186 && (t -= 40 * n_A_BODY_REFINE),
    n_A_Equip[8] == 836 && (t += 10 * n_A_BaseLV),
    n_A_Equip[6] == 859 && (t += 20 * n_A_BaseLV),
    n_A_Equip[6] == 762 && (t += 20 * n_A_BaseLV),
    EquipNumSearch(EQUIPID.MYSTIC_RING_PLUS_SMALL_BOOK_PEN) && (t += 3 * n_A_BaseLV),
    n_A_Equip[6] == 986 && (t += 7 * n_A_BaseLV),
    n_A_Equip[0] == 1172 && (t += 25 * n_A_Weapon_refine),
    EquipNumSearch(EQUIPID.SHAMAN_SET) && (t += 10 * n_A_BaseLV),
    n_A_Equip[5] == 1785 && SU_INT > 97 && (t += 800),
    EQUIPID.GEFFENIA_WATER_BOOK == n_A_Equip[5] && SU_INT >= 90 && (t += 800),
    n_A_BODY_REFINE >= 9 && n_A_card[11] == 225 && (t += 800),
    n_A_Weapon_refine >= 6 && n_A_Equip[0] == 1168 && (t -= 200 * (n_A_Weapon_refine - 5)),
    (n_A_JOB != 0 && n_A_JOB != 20) || n_A_Equip[3] != 1670 || (t += 80),
    n_A_Equip[8] == 536 &&
      (((I = n_A_JobClass()) != 3 && I != 4 && I != 5) || (t += 5 * n_A_BaseLV)),
    (n_A_MaxHP += t),
    n_A_MaxHP < 1 && (n_A_MaxHP = 1),
    (t = 0),
    (t += bonusValues[15] + n_A_Buf9[31]),
    n_A_Buf3[3] && (t += 5 + 2 * n_A_Buf3[3] + n_A_Buf3[33] + Math.floor(n_A_Buf3[23] / 10)),
    n_A_Buf2[17] && (t += 100),
    n_A_Buf7[16] && (t += 3),
    n_A_Equip[8] == 715 && (t -= n_A_SHOES_REFINE),
    n_A_Equip[6] == 1730 && (t += n_A_BODY_REFINE),
    SU_VIT >= 80 && n_A_card[12] == 267 && (t += 3),
    n_A_SHOES_REFINE >= 9 && n_A_card[13] == 304 && (t += 10),
    n_A_SHOES_REFINE <= 4 && n_A_card[13] == 407 && (t += 4),
    n_A_SHOES_REFINE >= 8 && n_A_Equip[8] == 1732 && (t += n_A_SHOES_REFINE - 7),
    n_A_card[12] != 405 ||
      (n_A_JobClass() != 1 && n_A_JobClass() != 2 && n_A_JobClass() != 6) ||
      (t += 5),
    (n_A_MaxHP = (n_A_MaxHP * (100 + t)) / 100),
    n_A_Buf6[0] == 1 &&
      n_A_Buf6[1] >= 1 &&
      n_A_Bodyelement == 1 &&
      (n_A_MaxHP = (n_A_MaxHP * (100 + [5, 9, 12, 14, 15][n_A_Buf6[1] - 1])) / 100),
    SkillSearch(SKILLID.FRENZY) && (n_A_MaxHP *= 3),
    (n_A_MaxHP = Math.floor(n_A_MaxHP)),
    n_A_MaxHP >= 100
      ? n_A_MaxHP >= 1e4
        ? myInnerHtml("A_MaxHP", " " + n_A_MaxHP, 0)
        : myInnerHtml("A_MaxHP", n_A_MaxHP, 0)
      : myInnerHtml("A_MaxHP", " " + n_A_MaxHP, 0),
    (JobSP_A = new Array(
      1,
      2,
      2,
      5,
      2,
      6,
      3,
      3,
      4,
      8,
      4,
      9,
      4,
      4.7,
      5,
      4.7,
      6,
      6,
      7,
      4,
      1,
      3,
      4,
      8,
      4,
      9,
      4,
      4.7,
      5,
      4.7,
      6,
      6,
      7,
      4,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      4.7,
      9,
      3.75,
      3.75,
    )),
    (wSPSL = 0),
    n_A_JOB == 43 &&
      n_A_BaseLV >= 70 &&
      (n_A_BaseLV < 80
        ? (wSPSL = 4 * (n_A_BaseLV - 70) + 5)
        : n_A_BaseLV < 90
          ? (wSPSL = 4 * (n_A_BaseLV - 80))
          : n_A_BaseLV < 93
            ? (wSPSL = 4 * (n_A_BaseLV - 90))
            : n_A_BaseLV < 99
              ? (wSPSL = 4 * (n_A_BaseLV - 90) - 10)
              : (wSPSL = 1)),
    (n_A_MaxSP = 10 + n_A_BaseLV * JobSP_A[n_A_JOB] - wSPSL),
    n_A_JOB == 44 &&
      (n_A_BaseLV <= 20
        ? (n_A_MaxSP = 11 + 3 * n_A_BaseLV)
        : n_A_BaseLV <= 40
          ? (n_A_MaxSP = 71 + 4 * (n_A_BaseLV - 20))
          : n_A_BaseLV <= 60
            ? (n_A_MaxSP = 151 + 5 * (n_A_BaseLV - 40))
            : n_A_BaseLV <= 80
              ? (n_A_MaxSP = 251 + 6 * (n_A_BaseLV - 60))
              : (n_A_MaxSP = 370 + 8 * (n_A_BaseLV - 80))),
    n_A_JOB == 45 &&
      (n_A_BaseLV <= 25
        ? (n_A_MaxSP = 10 + 3 * n_A_BaseLV)
        : n_A_BaseLV <= 35
          ? (n_A_MaxSP = 85 + 4 * (n_A_BaseLV - 25))
          : n_A_BaseLV <= 40
            ? (n_A_MaxSP = 126 + 3 * (n_A_BaseLV - 35))
            : n_A_BaseLV <= 50
              ? (n_A_MaxSP = 141 + 4 * (n_A_BaseLV - 40))
              : n_A_BaseLV <= 75
                ? (n_A_MaxSP = 181 + 5 * (n_A_BaseLV - 50))
                : n_A_BaseLV <= 78
                  ? (n_A_MaxSP = 306 + 6 * (n_A_BaseLV - 75))
                  : (n_A_MaxSP = 330 + 6 * (n_A_BaseLV - 78))),
    n_Reborn && (n_A_MaxSP = Math.floor((125 * n_A_MaxSP) / 100)),
    1 * c.A_adopted.checked && (n_A_MaxSP = Math.floor((70 * n_A_MaxSP) / 100)),
    (n_A_MaxSP = Math.floor((n_A_MaxSP * (100 + n_A_INT)) / 100)),
    n_A_Buf7[40])
  ) {
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
  for (
    n_A_JOB == 41 &&
      n_A_BaseLV >= 70 &&
      (n_A_BaseLV <= 79
        ? (n_A_MaxSP = Math.floor(((150 + 1 * (n_A_BaseLV - 70)) * (100 + n_A_INT)) / 100))
        : n_A_BaseLV <= 89
          ? (n_A_MaxSP = Math.floor(((160 + 1 * (n_A_BaseLV - 70)) * (100 + n_A_INT)) / 100))
          : n_A_BaseLV <= 99 &&
            ((n_A_MaxSP = (190 * (100 + n_A_INT)) / 100),
            SkillSearch(SKILLID.TAEKWON_RANKER) && (n_A_MaxSP *= 3),
            (n_A_MaxSP = Math.floor(n_A_MaxSP)))),
      n_A_JOB == 42 &&
        n_A_BaseLV >= 70 &&
        (n_A_BaseLV <= 79
          ? (n_A_MaxSP = Math.floor(((339 + 2 * (n_A_BaseLV - 70)) * (100 + n_A_INT)) / 100))
          : n_A_BaseLV <= 89
            ? (n_A_MaxSP = Math.floor(((386 + 2 * (n_A_BaseLV - 80)) * (100 + n_A_INT)) / 100))
            : n_A_BaseLV <= 99 &&
              (n_A_MaxSP = Math.floor(((430 + 3 * (n_A_BaseLV - 90)) * (100 + n_A_INT)) / 100))),
      t = 0,
      t += bonusValues[14] + n_A_Buf9[32],
      t += StPlusCalc2(4),
      t += StPlusCalc2(7),
      t += 30 * SkillSearch(SKILLID.KAINA),
      n_A_BaseLV <= 79 && (t += 200 * EquipNumSearch(EQUIPID.ACADEMY_OF_BADGE)),
      n_A_card[9] == 179 && (t += 40),
      n_A_JobClass() == 3 && (t += 50 * EquipNumSearch(EQUIPID.ACOLYTE_FIGURE)),
      n_A_JobClass() == 5 && (t += 100 * CardNumSearch(474) + 100 * CardNumSearch(476)),
      n_A_Equip[6] == 859 && (t += 5 * n_A_BaseLV),
      n_A_Equip[6] == 762 && (t += 5 * n_A_BaseLV),
      EquipNumSearch(EQUIPID.MYSTIC_RING_PLUS_SMALL_BOOK_PEN) && (t += n_A_JobLV),
      n_A_Equip[6] == 986 && (t += Math.floor(0.5 * n_A_BaseLV)),
      n_A_Equip[0] == 1671 && (t += 50 * Math.floor(n_A_Weapon_refine / 2)),
      n_A_Equip[7] == 1193 && (t += Math.floor(n_A_BaseLV / 3) + 10 * n_A_SHOULDER_REFINE),
      EquipNumSearch(EQUIPID.SHAMAN_SET) && (t += 2 * n_A_BaseLV),
      n_A_HEAD_REFINE <= 4 && n_A_card[8] == 179 && (t += 40),
      n_A_HEAD_REFINE >= 9 && n_A_card[8] == 298 && (t += 150),
      n_A_Weapon_refine >= 9 && n_A_Equip[0] == 642 && (t += 300),
      n_A_Weapon_refine >= 6 && n_A_Equip[0] == 1168 && (t -= 100 * (n_A_Weapon_refine - 5)),
      n_A_HEAD_REFINE >= 6 && n_A_Equip[2] == 1593 && (t += 10 * (n_A_HEAD_REFINE - 5)),
      n_A_HEAD_REFINE >= 6 &&
        EquipNumSearch(EQUIPID.SAKURA_CORONET_PLUS_ROMANTIC_FLOWER) &&
        (t += n_A_HEAD_REFINE),
      (n_A_JOB != 0 && n_A_JOB != 20) || n_A_Equip[3] != 1670 || (t += 30),
      n_A_Equip[8] == 536 &&
        ((wSPVS = n_A_JobClass()),
        (wSPVS != 1 && wSPVS != 2 && wSPVS != 6) || (t += 2 * n_A_JobLV)),
      n_A_MaxSP += t,
      n_A_MaxSP < 0 && (n_A_MaxSP = 0),
      t = 0,
      t += bonusValues[16] + n_A_Buf9[33],
      t += SkillSearch(SKILLID.MEDIATIO),
      t += 2 * SkillSearch(SKILLID.SOUL_DRAIN),
      n_A_Buf2[18] && (t += 100 + bonusValues[16]),
      n_A_Buf7[16] && (t += 3),
      n_A_Equip[8] == 715 && (t -= n_A_SHOES_REFINE),
      n_A_HEAD_REFINE >= 6 &&
        EquipNumSearch(EQUIPID.SAKURA_CORONET_PLUS_ROMANTIC_FLOWER) &&
        (t += n_A_HEAD_REFINE),
      n_A_SHOES_REFINE >= 9 && n_A_card[13] == 304 && (t += 10),
      n_A_SHOES_REFINE <= 4 && n_A_card[13] == 407 && (t += 4),
      n_A_card[12] != 405 ||
        (n_A_JobClass() != 3 && n_A_JobClass() != 4 && n_A_JobClass() != 5) ||
        (t += 5),
      n_A_Buf3[6] && (t += 15 + n_A_Buf3[6] + n_A_Buf3[26] / 10 + n_A_Buf3[36]),
      n_A_MaxSP = Math.floor(n_A_MaxSP * (1 + t / 100)),
      n_A_MaxSP >= 100
        ? myInnerHtml("A_MaxSP", n_A_MaxSP, 0)
        : myInnerHtml("A_MaxSP", " " + n_A_MaxSP, 0),
      n_A_DEFplus =
        n_A_HEAD_REFINE +
        n_A_BODY_REFINE +
        n_A_LEFT_REFINE +
        n_A_SHOULDER_REFINE +
        n_A_SHOES_REFINE,
      n_A_DEF = bonusValues[18] + n_A_Buf9[34],
      l = 2;
    l <= 10;
    l++
  )
    n_A_DEF += itemData[n_A_Equip[l]].attackOrDefense;
  // uaRO: Luna Bow: DEF +2, +3 da +6, +5 da +9 (Item Changes; patch del 04/08/2026). Nel
  // codice c'erano i valori ufficiali
  (n_A_Equip[0] == 521 &&
    (n_A_Weapon_refine <= 5
      ? (n_A_DEF += 2)
      : n_A_Weapon_refine >= 9
        ? (n_A_DEF += 5)
        : (n_A_DEF += 3)),
    n_A_LEFT_REFINE <= 5 && n_A_card[10] == 222 && (n_A_DEF += 2),
    n_A_BODY_REFINE <= 5 && n_A_card[11] == 283 && (n_A_DEF += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1272 && (n_A_DEF += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1273 && (n_A_DEF += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1274 && (n_A_DEF += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1474 && (n_A_DEF += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1275 && (n_A_DEF += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1475 && (n_A_DEF += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1276 && (n_A_DEF += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1280 && (n_A_DEF += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1282 && (n_A_DEF += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1286 && (n_A_DEF += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1287 && (n_A_DEF += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1486 && (n_A_DEF += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1487 && (n_A_DEF += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1485 && (n_A_DEF += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1550 && (n_A_DEF += 1),
    n_A_Buf3[9] && (n_A_DEF += 2 + 2 * n_A_Buf3[9]),
    n_A_Buf7[32] && (n_A_DEF += 3),
    n_A_JobClass() == 1 && (n_A_DEF += 2 * EquipNumSearch(EQUIPID.SWORDMAN_FIGURE)),
    n_A_Equip[0] == 658 && (n_A_DEF += n_A_Weapon_refine),
    n_A_Equip[8] == 715 && (n_A_DEF += Math.floor(n_A_SHOES_REFINE / 2)),
    n_A_Equip[0] == 942 && (n_A_DEF += Math.floor(n_A_Weapon_refine / 2)),
    n_A_Equip[2] == 1350 && (n_A_DEF -= n_A_HEAD_REFINE),
    EquipNumSearch(EQUIPID.SANTAS_BEARD) && (n_A_DEF -= 5),
    EquipNumSearch(EQUIPID.ODINS_BLESSING_FRIGGS_CIRCLET_VALKYRIAN_SHIELD_SET) &&
      (n_A_DEF -= n_A_HEAD_REFINE + n_A_LEFT_REFINE),
    EquipNumSearch(EQUIPID.ODINS_BLESSING_MAGNIS_CAP_STONE_BUCKLER_SET) &&
      n_A_JobClass() == 1 &&
      (n_A_DEF += 6),
    n_A_Equip[6] != 986 ||
      (n_A_JobClass() != 1 && n_A_JobClass() != 2 && n_A_JobClass() != 6) ||
      (n_A_DEF += 3),
    n_A_Equip[2] == 809 && (n_A_DEFplus -= n_A_HEAD_REFINE),
    (TimeItemNumSearch(9) || TimeItemNumSearch(50)) && (n_A_DEF += 20),
    (TimeItemNumSearch(33) || TimeItemNumSearch(51)) && (n_A_DEF -= 20),
    (n_A_totalDEF = n_A_DEF + Math.round((66 * n_A_DEFplus) / 100)),
    bonusValues[24] && (n_A_totalDEF = Math.floor(n_A_totalDEF / bonusValues[24])),
    bonusValues[85] && (n_A_totalDEF -= Math.floor((n_A_totalDEF * bonusValues[85]) / 100)),
    n_A_Buf6[21] && (n_A_totalDEF -= Math.floor((25 * n_A_totalDEF) / 100)),
    SkillSearch(SKILLID.SPEAR_DYNAMO) &&
      (n_A_totalDEF = Math.floor(n_A_totalDEF * (1 - 0.05 * SkillSearch(SKILLID.SPEAR_DYNAMO)))),
    (n_A_Buf6[13] || n_A_Buf6[15]) && (n_A_totalDEF -= Math.floor(0.5 * n_A_totalDEF)),
    n_A_Buf2[21] && (n_A_totalDEF += Math.floor(0.25 * n_A_totalDEF)));
  (n_A_totalDEF >= 100 && (n_A_totalDEF = 99),
    CardNumSearch(392) && (n_A_totalDEF -= 50),
    c.B_num.value >= 2 &&
      (n_A_totalDEF -= Math.floor((n_A_totalDEF * (1 * c.B_num.value - 1) * 5) / 100)),
    SkillSearch(SKILLID.MENTAL_STRENGTH) && (n_A_totalDEF = 90));
  var a;
  for (l = 0; l < 11; l++) n_A_Buf2[4] == l && (P_VIT1 = n_A_VIT * (0.05 * l));
  if (
    ((E = parseInt(n_A_VIT + P_VIT1)),
    n_A_Buf6[5]
      ? (E -= Math.floor((0.05 + 0.05 * n_A_Buf6[5]) * E))
      : n_A_Buf7[31] && (E -= Math.floor(0.1 * E)),
    SkillSearch(SKILLID.FRENZY) && ((n_A_totalDEF = 0), (E = 0)),
    myInnerHtml("A_totalDEF", n_A_totalDEF + "+" + E, 0),
    (n_A_VITDEF = new Array()),
    (n_A_VITDEF[0] = Math.floor(0.5 * n_A_VIT) + Math.floor(0.3 * n_A_VIT)),
    (n_A_VITDEF[2] = Math.floor(0.5 * n_A_VIT) + Math.floor((n_A_VIT * n_A_VIT) / 150) - 1),
    n_A_VITDEF[2] > n_A_VITDEF[0]
      ? (n_A_VITDEF[1] = (n_A_VITDEF[0] + n_A_VITDEF[2]) / 2)
      : ((n_A_VITDEF[1] = n_A_VITDEF[0]), (n_A_VITDEF[2] = n_A_VITDEF[0])),
    SkillSearch(SKILLID.AUTO_BERSERK))
  )
    for (l = 0; l <= 2; l++) n_A_VITDEF[l] = Math.floor(0.45 * n_A_VITDEF[l]);
  else if (n_A_Buf6[5])
    for (l = 0; l <= 2; l++)
      n_A_VITDEF[l] = Math.floor(n_A_VITDEF[l] * (0.95 - 0.05 * n_A_Buf6[5]));
  else if (n_A_Buf7[31]) for (l = 0; l <= 2; l++) n_A_VITDEF[l] = Math.floor(0.9 * n_A_VITDEF[l]);
  if (bonusValues[24])
    for (l = 0; l <= 2; l++) n_A_VITDEF[l] = Math.floor(n_A_VITDEF[l] / bonusValues[24]);
  if (SkillSearch(SKILLID.SPEAR_DYNAMO))
    for (l = 0; l <= 2; l++)
      n_A_VITDEF[l] = Math.floor(n_A_VITDEF[l] * (1 - 0.05 * SkillSearch(SKILLID.SPEAR_DYNAMO)));
  if (n_A_Buf2[4])
    for (l = 0; l <= 2; l++) n_A_VITDEF[l] = Math.floor(n_A_VITDEF[l] * (1 + 0.05 * n_A_Buf2[4]));
  if (n_A_Buf6[21])
    for (l = 0; l <= 2; l++) n_A_VITDEF[l] -= Math.floor((25 * n_A_VITDEF[l]) / 100);
  if (SkillSearch(SKILLID.FRENZY)) for (l = 0; l <= 2; l++) n_A_VITDEF[l] = 0;
  if (c.B_num.value >= 2)
    for (l = 0; l <= 2; l++)
      n_A_VITDEF[l] -= Math.floor((n_A_VITDEF[l] * (1 * c.B_num.value - 1) * 5) / 100);
  var E;
  var S, b;
  ((n_A_MDEF = bonusValues[19] + n_A_Buf9[35]),
    n_A_JobClass() == 3 && (n_A_MDEF += CardNumSearch(383)),
    n_A_Buf7[33] && (n_A_MDEF += 3),
    n_A_card[9] == 213 && (n_A_MDEF += 5),
    n_A_card[16] == 213 && (n_A_MDEF += 5),
    n_A_card[17] == 213 && (n_A_MDEF += 5),
    n_A_card[18] == 213 && (n_A_MDEF += 5),
    EquipNumSearch(EQUIPID.ODINS_BLESSING_FRIGGS_CIRCLET_VALKYRIAN_SHIELD_SET) &&
      (n_A_MDEF += n_A_HEAD_REFINE + n_A_LEFT_REFINE),
    n_A_Equip[0] == 1169 && (n_A_MDEF += n_A_Weapon_refine),
    n_A_card[11] == 199 && n_A_JobClass() == 5 && (n_A_MDEF += 3),
    (EquipNumSearch(EQUIPID.LEAF_CAT_HAT) || n_A_Equip[2] == 1350) && (n_A_MDEF += n_A_HEAD_REFINE),
    n_A_HEAD_REFINE <= 5 && n_A_card[8] == 213 && (n_A_MDEF += 5),
    n_A_LEFT_REFINE <= 5 && n_A_card[10] == 222 && (n_A_MDEF += 3),
    n_A_BODY_REFINE <= 5 && n_A_card[11] == 283 && (n_A_MDEF += 5),
    n_A_LEFT_REFINE >= 9 && n_A_card[10] == 310 && (n_A_MDEF += 5),
    n_A_SHOES_REFINE <= 5 && n_A_card[13] == 381 && (n_A_MDEF += 7),
    n_A_HEAD_REFINE >= 6 && n_A_Equip[2] == 1593 && (n_A_MDEF += n_A_HEAD_REFINE - 5),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1277 && (n_A_MDEF += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1281 && (n_A_MDEF += 7),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1478 && (n_A_MDEF += 7),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1483 && (n_A_MDEF += 5),
    n_A_SHOULDER_REFINE <= 5 && n_A_card[12] == 258 && (n_A_MDEF += 8),
    n_A_Equip[6] != 986 ||
      (n_A_JobClass() != 3 && n_A_JobClass() != 4 && n_A_JobClass() != 5) ||
      (n_A_MDEF += 5),
    SkillSearch(SKILLID.ENDURE)
      ? (n_A_MDEF += SkillSearch(SKILLID.ENDURE))
      : SkillSearch(SKILLID.SPEAR_DYNAMO) && (n_A_MDEF += 1),
    (TimeItemNumSearch(9) || TimeItemNumSearch(50)) && (n_A_MDEF -= 20),
    (TimeItemNumSearch(33) || TimeItemNumSearch(51)) && (n_A_MDEF += 20),
    (n_A_Buf6[13] || n_A_Buf6[15]) && (n_A_MDEF += Math.floor(0.25 * n_A_MDEF)));
  (SkillSearch(SKILLID.MENTAL_STRENGTH) && (n_A_MDEF = 90),
    CardNumSearch(392) && (n_A_MDEF -= 50),
    n_A_MDEF >= 99 && (n_A_MDEF = 99));
  var m;
  ((n_A_INTMDEF = n_A_INT),
    (n_A_softMDEF = n_A_INT + Math.floor(n_A_VIT / 2)),
    TimeItemNumSearch(9),
    n_A_Buf6[4] && (n_A_softMDEF -= Math.floor(n_A_softMDEF * n_A_Buf6[4] * 0.12)),
    SkillSearch(SKILLID.FRENZY) && ((n_A_MDEF = 0), (n_A_INTMDEF = 0), (n_A_softMDEF = 0)));
  (myInnerHtml("A_MDEF", n_A_MDEF + "+" + n_A_INTMDEF, 0),
    myInnerHtml("A_RealMDEF", n_A_MDEF + "+" + n_A_softMDEF, 0));
  var u;
  if (
    ((n_A_HIT = n_A_BaseLV + n_A_DEX),
    (n_A_HIT += bonusValues[8] + n_A_Buf9[36]),
    (n_A_HIT += Math.floor(n_A_JobLV / 10) * CardNumSearch(492)),
    n_A_Buf2[20] && (n_A_HIT += 50),
    n_A_Buf3[4] && (n_A_HIT += 10 + 2 * n_A_Buf3[4] + n_A_Buf3[34] + Math.floor(n_A_Buf3[24] / 10)),
    n_A_Buf7[0] && (n_A_HIT += 30),
    n_A_Buf7[27]
      ? (n_A_HIT += 33)
      : n_A_Buf7[46]
        ? (n_A_HIT += 30)
        : n_A_Buf7[18] && (n_A_HIT += 10),
    n_A_WeaponType == 10 && (n_A_HIT += 5 * CardNumSearch(465)),
    n_A_Equip[0] == 654 && (n_A_HIT += Math.floor(SU_AGI / 10)),
    n_A_Equip[0] == 656 && (n_A_HIT -= Math.floor(SU_DEX / 3)),
    n_A_Equip[0] == 1796 && (n_A_HIT += Math.floor(SU_LUK / 2)),
    SU_STR >= 90 && (n_A_HIT += 10 * EquipNumSearch(EQUIPID.ROGUES_TREASURE)),
    SU_STR >= 95 && n_A_Equip[0] == 1167 && (n_A_HIT += 10),
    (n_A_WeaponType != 3 && n_A_WeaponType != 2) || (n_A_HIT += 5 * CardNumSearch(464)),
    EquipNumSearch(EQUIPID.BLACK_CAT) & EquipNumSearch(EQUIPID.ROGUES_TREASURE) &&
      (n_A_HIT += Math.floor(n_A_Weapon_refine / 2)),
    n_A_Equip[0] == 1176 && SkillSearch(SKILLID.KATAR_MASTERY) == 10 && (n_A_HIT += 10),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1480 && (n_A_HIT += 5),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1549 && (n_A_HIT += 5),
    (n_A_HIT += 1 * SkillSearch(SKILLID.VULTURES_EYE)),
    (n_A_HIT += 2 * SkillSearch(SKILLID.WEAPONRY_RESEARCH)),
    (n_A_HIT += 3 * SkillSearch(SKILLID.FALCON_EYES)),
    (n_A_HIT += 10 * SkillSearch(SKILLID.SPEAR_DYNAMO)),
    (n_A_HIT += 1 * SkillSearch(SKILLID.SNAKE_EYES)),
    (n_A_HIT += 2 * SkillSearch(SKILLID.SINGLE_ACTION)),
    SkillSearch(SKILLID.GUNSLINGERS_PANIC) && (n_A_HIT -= 30),
    SkillSearch(SKILLID.INCREASE_ACCURACY) && (n_A_HIT += 20),
    n_A_Buf7[16] && (n_A_HIT += Math.floor(0.03 * n_A_HIT)),
    n_A_Buf6[11] && (n_A_HIT = Math.round(0.75 * n_A_HIT)),
    (n_A_HIT += Math.floor(n_A_HIT * n_A_Buf9[23] * 0.01)),
    n_A_HIT < 1 && (n_A_HIT = 1),
    myInnerHtml("A_HIT", n_A_HIT, 0),
    (bonusValues[86] += n_A_Buf9[55]),
    myInnerHtml("A_PefHIT", bonusValues[86], 0),
    (n_A_FLEE = n_A_BaseLV + n_A_AGI),
    (n_A_FLEE += bonusValues[9] + n_A_Buf9[37]),
    n_A_JOB == 24 && (n_A_FLEE += Math.round(SkillSearch(SKILLID.WIND_WALKER) / 2)),
    SkillSearch(SKILLID.CLOSE_CONFINE) && (n_A_FLEE += 10),
    SkillSearch(SKILLID.LUNAR_PROTECTION) &&
      (n_A_FLEE += Math.floor((n_A_BaseLV + n_A_LUK + n_A_DEX) / 10)),
    SkillSearch(SKILLID.GUNSLINGERS_PANIC) && (n_A_FLEE += 30),
    n_A_Equip[0] == 483 && (n_A_FLEE -= n_A_BaseLV + SU_AGI),
    n_A_Equip[7] == 1714 && (n_A_FLEE += 2 * n_A_SHOULDER_REFINE),
    n_A_Equip[6] == 1718 && (n_A_FLEE += n_A_BODY_REFINE),
    n_A_Buf2[20] && (n_A_FLEE += 50),
    n_A_Buf3[0] &&
      (n_A_FLEE += n_A_Buf3[0] + Math.floor(n_A_Buf3[30] / 2) + Math.floor(n_A_Buf3[20] / 10)),
    n_A_Buf7[1] && (n_A_FLEE += 30),
    n_A_Buf7[28] ? (n_A_FLEE += 33) : n_A_Buf7[46] && (n_A_FLEE += 30),
    TimeItemNumSearch(1) && (n_A_FLEE += 30 * TimeItemNumSearch(1)),
    SU_STR >= 90 && (n_A_FLEE += 10 * EquipNumSearch(EQUIPID.ROGUES_TREASURE)),
    n_A_Buf2[9] &&
      SkillSearch(SKILLID.WIND_WALKER) == 0 &&
      (n_A_FLEE += Math.round(n_A_Buf2[9] / 2)),
    n_A_JobClass() == 2 && n_A_card[12] == 295 && (n_A_FLEE += 20),
    n_A_HEAD_REFINE >= 6 && n_A_Equip[2] == 1555 && (n_A_FLEE += 2),
    n_A_HEAD_REFINE >= 5 && n_A_Equip[2] == 1576 && (n_A_FLEE += 5),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1576 && (n_A_FLEE += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1541 && (n_A_FLEE += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1276 && (n_A_FLEE += 10),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1280 && (n_A_FLEE += 10),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1282 && (n_A_FLEE += 10),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1283 && (n_A_FLEE += 10),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1481 && (n_A_FLEE += 10),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1550 && (n_A_FLEE += 10),
    n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1285 && (n_A_FLEE += 5),
    n_A_SHOULDER_REFINE >= 9 && n_A_card[12] == 271 && (n_A_FLEE += 20),
    n_A_SHOULDER_REFINE <= 4 && n_A_card[12] == 401 && (n_A_FLEE += 10),
    n_A_SHOULDER_REFINE >= 9 && n_A_card[12] == 403 && (n_A_FLEE += 5),
    n_A_Buf6[0] == 2 && n_A_Buf6[1] >= 1 && n_A_Bodyelement == 4 && (n_A_FLEE += 3 * n_A_Buf6[1]),
    n_A_JOB == 8 || n_A_JOB == 14 || n_A_JOB == 22 || n_A_JOB == 28
      ? (n_A_FLEE += 4 * SkillSearch(SKILLID.IMPROVE_DODGE))
      : (n_A_FLEE += 3 * SkillSearch(SKILLID.IMPROVE_DODGE)),
    SkillSearch(SKILLID.GATLING_FEVER) &&
      ((n_A_WeaponType != 20 && n_A_WeaponType != 0) ||
        (n_A_FLEE -= 5 * SkillSearch(SKILLID.GATLING_FEVER))),
    (Mikiri = new Array(0, 1, 3, 4, 6, 7, 9, 10, 12, 13, 15)),
    (n_A_FLEE += Mikiri[SkillSearch(SKILLID.FLEE)]),
    c.B_num.value >= 2 &&
      ((t = 1 * c.B_num.value - 1) > 10 && (t = 10),
      (n_A_FLEE -= Math.floor((n_A_FLEE * t * 10) / 100))),
    SkillSearch(SKILLID.FRENZY) && (n_A_FLEE = Math.round(n_A_FLEE / 2)),
    n_A_Buf6[11] && (n_A_FLEE = Math.round(0.75 * n_A_FLEE)),
    n_A_Buf6[12] && (n_A_FLEE = 0),
    n_A_Buf6[14] && (n_A_FLEE = 0),
    n_A_Buf6[15] && (n_A_FLEE = 0),
    n_A_FLEE,
    n_A_FLEE < 1 && (n_A_FLEE = 1),
    myInnerHtml("A_FLEE", n_A_FLEE, 0),
    myInnerHtml("A_WoeFLEE", Math.floor(0.8 * n_A_FLEE), 0),
    (n_A_LUCKY = 1 + 0.1 * n_A_LUK),
    (n_A_LUCKY += bonusValues[11] + n_A_Buf9[38]),
    n_A_Buf7[18] && (n_A_LUCKY += 20),
    n_A_Buf3[0] &&
      (n_A_LUCKY +=
        Math.round(n_A_Buf3[0] / 2) + Math.floor(n_A_Buf3[19] / 10) + Math.floor(n_A_Buf3[30] / 2)),
    n_A_JobClass() == 1 && (n_A_LUCKY += 3 * CardNumSearch(354)),
    n_A_JobClass() == 2 && n_A_card[13] == 391 && (n_A_LUCKY += 5),
    n_A_SHOULDER_REFINE > 6 && n_A_Equip[7] == 1724 && (n_A_LUCKY += n_A_SHOULDER_REFINE - 6),
    n_A_SHOULDER_REFINE <= 4 && n_A_card[12] == 401 && (n_A_LUCKY += 1),
    n_A_Equip[7] == 535)
  ) {
    var I = n_A_JobClass();
    (I != 3 && I != 4 && I != 5) || ((n_A_LUCKY += 5), (n_A_LUCKY += 2 * n_A_SHOULDER_REFINE));
  }
  (n_A_JobClass() == 41 && n_A_Equip[3] == 678 && (n_A_LUCKY += 2),
    (n_A_LUCKY = Math.round(10 * n_A_LUCKY) / 10),
    n_A_LUCKY < 0 && (n_A_LUCKY = 0),
    myInnerHtml("A_LUCKY", n_A_LUCKY, 0),
    (n_A_CRI = 1 + Math.floor(n_A_LUK / 3)),
    (t = 0),
    (t += uaroMaceMasteryCriticalBonus()),
    (t += bonusValues[10] + n_A_Buf9[39]),
    (t += bonusValues[110 + targetData[2]]),
    (t += Math.floor(n_A_JobLV / 10) * CardNumSearch(492)),
    n_A_JOB == 24 && (t += SkillSearch(SKILLID.FALCON_EYES)),
    SkillSearch(SKILLID.FURY_SUPERNOVICE) && (t += 50),
    (t += 7 * (n_A_Buf7[16] + n_A_Buf7[19])),
    n_A_JobClass() == 2 && (t += 4 * CardNumSearch(328)),
    n_A_WeaponType == 10 && (t += 5 * CardNumSearch(465)),
    n_A_card[12] == 402 && (t += n_A_SHOULDER_REFINE),
    n_A_Equip[0] == 640 && (t += Math.floor(SU_LUK / 5)),
    n_A_Equip[6] == 689 && (t += Math.floor(SU_LUK / 10)),
    n_A_Equip[0] == 623 && (t += n_A_Weapon_refine),
    n_A_Equip[0] == 1161 && (t += 2 * SkillSearch(SKILLID.MACE_MASTERY)),
    n_A_Equip[7] == 1709 && (t += n_A_SHOULDER_REFINE),
    SU_AGI >= 90 && (t += 10 * EquipNumSearch(EQUIPID.ROGUES_TREASURE)),
    SU_LUK >= 80 && n_A_card[12] == 267 && (t += 3),
    SU_DEX >= 90 && n_A_Equip[0] == 1164 && (t += 5),
    (n_A_WeaponType != 3 && n_A_WeaponType != 2) || (t += 5 * CardNumSearch(464)),
    n_A_JobClass() == 6 && (t += 5 * EquipNumSearch(EQUIPID.MERCHANT_FIGURE)),
    n_A_JobClass() == 41 && n_A_Equip[2] == 675 && (t += 5),
    n_A_JobClass() != 3 ||
      (targetData[2] != 1 && targetData[2] != 6) ||
      (t += 9 * CardNumSearch(253)),
    n_A_HEAD_REFINE >= 6 && n_A_Equip[2] == 785 && (t += n_A_HEAD_REFINE - 5),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1612 && (t += 10),
    n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1555 && (t += 10),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1851 && (t += 2),
    n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1851 && (t += 2),
    n_A_Weapon_refine >= 6 && targetData[2] == 7 && n_A_Equip[0] == 1091 && (t += 5),
    n_A_WeaponType == 10 && n_A_Arrow == 15 && (t += 20),
    (n_A_WeaponType == 10 || (17 <= n_A_WeaponType && n_A_WeaponType <= 21)) &&
      (t += 15 * CardNumSearch(462)),
    SkillSearch(SKILLID.FURY)
      ? (t += 7.5 + 2.5 * SkillSearch(SKILLID.FURY))
      : TimeItemNumSearch(34) && (t += 10),
    (n_A_CRI += t),
    n_A_Buf3[5] &&
      (n_A_CRI += 10 + n_A_Buf3[5] + Math.floor(n_A_Buf3[35] / 2) + Math.floor(n_A_Buf3[25] / 10)),
    n_A_WeaponType == 11 && (n_A_CRI *= 2),
    (n_A_CRI = Math.round(10 * n_A_CRI) / 10),
    n_A_Buf6[9] && (n_A_CRI = 0),
    myInnerHtml("A_CRI", n_A_CRI, 0),
    (n_A_CRITshield = 1 + 0.2 * n_A_LUK),
    (n_A_CRITshield = Math.round(10 * n_A_CRITshield) / 10),
    myInnerHtml("A_CRITSHIELD", n_A_CRITshield, 0),
    (t = bonusValues[88] + n_A_Buf9[42]),
    EQUIPID.CELINES_RIBBON_UARO == n_A_Equip[2] && (t += n_A_HEAD_REFINE),
    n_A_Buf7[2] && (t += 10),
    n_A_Buf7[17] && (t += 5),
    n_A_Buf7[10] || n_A_Buf7[46] ? (t += 20) : n_A_Buf7[30] && (t += 15),
    n_A_Equip[5] == 1785 && SU_INT > 97 && (t += 10),
    EQUIPID.GEFFENIA_WATER_BOOK == n_A_Equip[5] && SU_INT >= 90 && (t += 30),
    n_A_Equip[2] == 1492 && n_A_Equip[0] == 89 && (t += 10 * n_A_Weapon_refine),
    n_A_Equip[2] == 1492 && n_A_Equip[0] == 936 && (t += 10 * n_A_Weapon_refine),
    n_A_Equip[2] == 1561 && n_A_Equip[3] == 1563 && (t += 30),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1280 && (t += 15),
    n_A_SHOULDER_REFINE >= 7 && SU_INT >= 90 && n_A_Equip[7] == 1472 && (t += 30),
    n_A_SHOULDER_REFINE >= 9 && SU_INT >= 90 && n_A_Equip[7] == 1472 && (t += 20));
  var D = t;
  ((t = 100 + bonusValues[89] + n_A_Buf9[43]),
    c.A8_Skill14.value != 1 && (t += Math.min(5, n_A_Buf2[2])),
    n_A_Buf6[2] && (t += 10),
    n_A_Equip[0] == 646 && (t += Math.floor(n_A_Weapon_refine / 2)),
    n_A_Equip[0] == 1682 && (t += 3 * n_A_Weapon_refine),
    n_A_Equip[0] == 1083 && (t += n_A_Weapon_refine),
    n_A_Equip[0] == 1173 && (t += Math.floor(n_A_Weapon_refine / 2)),
    n_A_Equip[0] == 1569 && (t += n_A_Weapon_refine),
    n_A_Weapon_refine >= 7 && EQUIPID.MENTAL_STICK == n_A_Equip[0] && (t += 15),
    n_A_Weapon_refine >= 10 && EQUIPID.MENTAL_STICK == n_A_Equip[0] && (t += 20),
    EquipNumSearch(EQUIPID.SURVIVORS_MANTEAU_SURVIVORS_ROD_SET) && (t += n_A_Weapon_refine),
    EquipNumSearch(EQUIPID.GENTLEMAN_SET) && (t += n_A_Weapon_refine),
    (n_A_JOB != 14 && n_A_JOB != 28) || (t += 10 * CardNumSearch(479)),
    n_A_Equip[0] == 484 && SU_INT >= 70 && (t += 5),
    n_A_JobClass() == 5 && CardNumSearch(454) && (t += 3),
    n_A_HEAD_REFINE >= 9 && n_A_card[8] == 177 && (t += 2),
    n_A_HEAD_REFINE >= 5 && n_A_Equip[2] == 1492 && (t += 3),
    n_A_HEAD_REFINE >= 5 && n_A_Equip[2] == 1218 && (t += n_A_HEAD_REFINE - 4),
    n_A_HEAD_REFINE >= 5 && n_A_Equip[2] == 1495 && (t += n_A_HEAD_REFINE - 4),
    n_A_HEAD_REFINE >= 6 && n_A_Equip[2] == 1029 && (t += n_A_HEAD_REFINE - 5),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 565 && (t += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1284 && (t += 3),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1482 && (t += 3),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1286 && (t += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1287 && (t += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1483 && (t += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1484 && (t += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1485 && (t += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1277 && (t += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1548 && (t += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1281 && (t += 8),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1478 && (t += 8),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1551 && (t += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1292 && (t += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1293 && (t += 1),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1492 && (t += 3),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1407 && (t += 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1842 && (t += 3),
    n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1842 && (t += 3),
    n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1407 && (t += 2),
    n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1284 && (t += 5),
    n_A_HEAD_REFINE == 10 && n_A_Equip[2] == 1289 && (t += 4),
    n_A_Weapon_refine >= 9 && n_A_Equip[0] == 642 && (t += 3),
    n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1084 && (t += 5),
    n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1095 && (t += 5),
    (n_A_JobClass2() != 14 && n_A_JOB != 44) ||
      (t += 15 * EquipNumSearch(EQUIPID.BRAVE_ASSASSIN_DAMASCUS)),
    (n_A_JobClass2() != 14 && n_A_JOB != 44) ||
      (t += 15 * EquipNumSearch(EQUIPID.VALOROUS_ASSASSIN_DAMASCUS)),
    n_A_Equip[2] == 1799 &&
      ((wSPVS = n_A_JobClass()),
      (wSPVS != 3 && wSPVS != 5) || ((t += 8), (bonusValues[99] += 7)),
      wSPVS == 4 && (bonusValues[25] += 10)));
  var T = t;
  ((n_A_MATK = [0, 0, 0]),
    (t = Math.floor(n_A_INT / 7)),
    (n_A_MATK[0] = n_A_INT + t * t),
    (t = Math.floor(n_A_INT / 5)),
    (n_A_MATK[2] = n_A_INT + t * t),
    (n_A_MATK[0] += D),
    (n_A_MATK[2] += D),
    (n_A_MATK[0] = Math.floor((n_A_MATK[0] * T) / 100)),
    (n_A_MATK[2] = Math.floor((n_A_MATK[2] * T) / 100)),
    n_A_Equip[2] == 849 &&
      ((n_A_MATK[0] += Math.floor((n_A_MATK[0] * Math.floor(n_A_HEAD_REFINE / 2)) / 100)),
      (n_A_MATK[2] += Math.floor((n_A_MATK[2] * Math.floor(n_A_HEAD_REFINE / 2)) / 100))),
    (BK_n_A_MATK = [0, 0, 0]),
    (BK_n_A_MATK[0] = n_A_MATK[0]),
    (BK_n_A_MATK[2] = n_A_MATK[2]),
    BK_n_A_MATK[0] != BK_n_A_MATK[2] && (BK_n_A_MATK[2] -= 1),
    (BK_n_A_MATK[1] = (BK_n_A_MATK[2] + BK_n_A_MATK[0]) / 2),
    n_A_Buf6[4] &&
      ((t = 100 + 20 * n_A_Buf6[4]),
      (n_A_MATK[0] = Math.floor((n_A_MATK[0] * t) / 100)),
      (n_A_MATK[2] = Math.floor((n_A_MATK[2] * t) / 100))),
    SkillSearch(SKILLID.MYSTICAL_AMPLIFICATION) &&
      ((n_A_MATK[0] = Math.floor(
        n_A_MATK[0] * (1 + 0.05 * SkillSearch(SKILLID.MYSTICAL_AMPLIFICATION)),
      )),
      (n_A_MATK[2] = Math.floor(
        n_A_MATK[2] * (1 + 0.05 * SkillSearch(SKILLID.MYSTICAL_AMPLIFICATION)),
      ))));
  var d;
  var B, p;
  var e;
  (myInnerHtml("A_MATK", n_A_MATK[0] + "~" + n_A_MATK[2], 0),
    n_A_MATK[0] != n_A_MATK[2] && (n_A_MATK[2] -= 1),
    (n_A_MATK[1] = (n_A_MATK[2] + n_A_MATK[0]) / 2));
  var v = 0;
  if (
    (SkillSearch(SKILLID.CAVALIER_MASTERY) && (v = 1),
    (t = 100),
    n_A_Equip[2] == 1324 && v
      ? (t *= 1.96)
      : bonusValues[209] || n_A_Buf2[1] || n_A_Buf7[26]
        ? (t *= 1.4)
        : n_A_Buf2[9] || SkillSearch(SKILLID.WIND_WALKER)
          ? (t *= 1.24)
          : CardNumSearch(451) && (t *= 1.05),
    n_A_Equip[2] != 1324 && v && (t *= 1.4),
    n_A_Equip[2] != 1324 || v || (t *= 1.4),
    // uaRO: Bastion Movement Speed, +20% che si somma agli altri bonus (patch del 03/06/2026)
    HasBastionEnchant(BASTIONENCHANTID.MOVEMENT_SPEED) && (t += 20),
    (t -= 10 * n_A_Buf6[19]),
    n_A_Buf3[37] &&
      (t -= 2 * n_A_Buf3[37] + Math.floor(n_A_Buf3[39] / 10) + Math.round(n_A_Buf3[27] / 2)),
    n_A_Buf6[22] ? (t = 25) : SkillSearch(SKILLID.MENTAL_STRENGTH) && (t = 20),
    myInnerHtml("A_MovSPEED", t + " %", 0),
    n_A_Equip[0] == EQUIPID.CATAPULT)
  ) {
    var U = (n_A_Weapon_refine >= 7 ? 10 : 0) + (n_A_Weapon_refine >= 10 ? 10 : 0);
    ((bonusValues[BONUSID.ASPD] += U), (bonusValues[BONUSID.RANGED_ATK_PERCENT] += U));
  }
  ((t = bonusValues[12] + n_A_Buf9[44]),
    n_A_Equip[0] == 624 && (t += n_A_Weapon_refine),
    n_A_Equip[0] == 641 && (t += n_A_Weapon_refine),
    n_A_Equip[0] == 654 && (t += Math.floor(SU_AGI / 14)),
    n_A_Equip[0] == 484 && SU_STR >= 50 && (t += 5),
    SU_STR >= 77 && n_A_Equip[0] == 944 && (t += 4),
    SU_STR >= 95 && n_A_Equip[0] == 621 && (t -= 40),
    SU_STR >= 95 && n_A_Equip[0] == 1167 && (t += 3),
    n_A_JOB == 21 && EquipNumSearch(EQUIPID.TOURNAMENT_SHIELD_SYSTEM_SET) && (t -= 5),
    n_A_JobClass() == 2 && (t += 3 * EquipNumSearch(EQUIPID.THIEF_FIGURE)),
    EquipNumSearch(EQUIPID.COLD_HEART_SET_UARO) && (t += Math.floor(n_A_Weapon_refine / 2)),
    n_A_Equip[0] == 903 && n_A_JobClass2() == 13 && (t += 20),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1842 && (t += 3),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1283 && (t += 3),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1481 && (t += 3),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1288 && (t += 2),
    n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1290 && (t += 2),
    n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1555 && (t += 8),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1851 && (t += 2),
    n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1851 && (t += 2),
    n_A_HEAD_REFINE == 10 && n_A_Equip[2] == 1290 && (t += 2),
    n_A_Weapon_refine >= 6 && n_A_Equip[0] == 1081 && (t += 10),
    n_A_Weapon_refine >= 6 && n_A_Equip[0] == 1086 && (t += 5),
    n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1086 && (t += 5),
    n_A_Weapon_refine >= 6 && n_A_Equip[0] == 1088 && (t += 5),
    n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1088 && (t += 5),
    n_A_Weapon_refine >= 7 && n_A_Equip[0] == 1077 && (t += 5),
    n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1077 && (t += 5),
    n_A_Weapon2_refine >= 7 && n_A_Equip[1] == 1077 && (t += 5),
    n_A_Weapon2_refine >= 9 && n_A_Equip[1] == 1077 && (t += 5),
    n_A_SHOULDER_REFINE >= 7 && SU_AGI >= 90 && n_A_Equip[7] == 1472 && (t += 8));
  var C = t;
  ((V = 0),
    n_A_Buf6[19] == 0 &&
      n_A_Buf6[20] == 0 &&
      (n_A_WeaponType == 3 && SkillSearch(SKILLID.TWOHAND_QUICKEN) && ((t += 30), (V = 1)),
      n_A_WeaponType == 2 &&
        SkillSearch(SKILLID.ONE_HAND_QUICKEN_SOUL_LINKED) &&
        ((t += 30), (V = 1)),
      // uaRO: Adrenaline Rush vale anche con le spade a una mano (Class Changes, Blacksmith)
      ((6 <= n_A_WeaponType && n_A_WeaponType <= 8) || n_A_WeaponType == 2) &&
        SkillSearch(SKILLID.ADRENALINE_RUSH) &&
        ((t += 30), (V = 1)),
      V == 0 && SkillSearch(SKILLID.FULL_ADRENALINE_RUSH) && ((t += 30), (V = 1)),
      V == 0 &&
        (TimeItemNumSearch(5) || TimeItemNumSearch(28)) &&
        ((n_A_WeaponType > 5 && n_A_WeaponType < 9) || !1) &&
        ((t += 30), (V = 1)),
      n_A_WeaponType == 5 &&
        SkillSearch(SKILLID.SPEAR_QUICKEN) &&
        ((t += SkillSearch(SKILLID.SPEAR_QUICKEN) + 20), (V = 1))),
    SkillSearch(SKILLID.CAVALIER_MASTERY) &&
      (t -= 10 * (6 - SkillSearch(SKILLID.CAVALIER_MASTERY))),
    (t += Math.round(SkillSearch(SKILLID.SINGLE_ACTION) / 2)),
    n_A_WeaponType == 12 && SkillSearch(SKILLID.STUDY) && (t += SkillSearch(SKILLID.STUDY) / 2),
    SkillSearch(SKILLID.MENTAL_STRENGTH) && (t -= 25),
    SkillSearch(SKILLID.FRENZY) && (t += 30),
    SkillSearch(SKILLID.LAST_STAND) && (t += 20),
    SkillSearch(SKILLID.GATLING_FEVER) &&
      ((n_A_WeaponType != 20 && n_A_WeaponType != 0) ||
        (t += 2 * SkillSearch(SKILLID.GATLING_FEVER))),
    n_A_Buf3[37] && (t -= 3 * n_A_Buf3[37] + Math.floor(n_A_Buf3[38] / 10) + n_A_Buf3[27] + 5));
  var r = 0;
  SkillSearch(SKILLID.STELLAR_PROTECTION) &&
    (r += Math.floor((n_A_BaseLV + n_A_LUK + n_A_DEX) / 10));
  var h = 0;
  n_A_Buf6[19] == 0 &&
    n_A_Buf6[20] == 0 &&
    V == 0 &&
    (n_A_Buf2[6] != 2 || n_A_WeaponType == 10 || (17 <= n_A_WeaponType && n_A_WeaponType <= 21)
      ? // uaRO: anche ricevuto dal party, con le spade a una mano (Class Changes, Blacksmith)
        ((6 <= n_A_WeaponType && n_A_WeaponType <= 8) || n_A_WeaponType == 2) &&
        (n_A_Buf2[6] == 1 ? ((h = 25), (V = 1)) : n_A_Buf2[6] == 3 && ((h = 30), (V = 1)))
      : ((h = 25), (V = 1)));
  var f = 0;
  (n_A_Buf3[1] &&
    (V == 0 || h) &&
    (n_A_WeaponType == 10 ||
      (17 <= n_A_WeaponType && n_A_WeaponType <= 21) ||
      (f += 10 + n_A_Buf3[1] + Math.round(n_A_Buf3[31] / 2) + Math.round(n_A_Buf3[21] / 10))),
    SkillSearch(SKILLID.SLS_SHADOW) && n_A_JobLV >= 50
      ? ((t += Math.max(h, f) + 3 * SkillSearch(SKILLID.SLS_SHADOW) + r), (V = 1))
      : (t += Math.max(h, f, r)));
  var o = 0;
  (n_A_Buf7[35] == 4 && n_A_JOB == 22
    ? (o = 25)
    : n_A_Buf7[35] == 3
      ? (o = 20)
      : n_A_Buf7[44] || n_A_Buf7[35] == 2
        ? (o = 15)
        : (n_A_Buf7[26] || n_A_Buf7[35] == 1) && (o = 10),
    (t += o));
  (n_Nitou == 1
    ? n_A_WeaponType == 0 && n_A_Weapon2Type != 0
      ? (WD = 50 * m_JobASPD[n_A_JOB][n_A_Weapon2Type])
      : (WD = 35 * (m_JobASPD[n_A_JOB][n_A_WeaponType] + m_JobASPD[n_A_JOB][n_A_Weapon2Type]))
    : (WD = 50 * m_JobASPD[n_A_JOB][n_A_WeaponType]),
    (n_A_ASPD =
      200 -
      (WD - (Math.round((WD * n_A_AGI) / 25) + Math.round((WD * n_A_DEX) / 100)) / 10) *
        (1 - t / 100)));
  var g;
  var J;
  var L, V;
  var G;
  var Y;
  var t = n_A_Buf9[24];
  ((t += EquipNumSearch(EQUIPID.VALENTINE_PLEDGE)),
    n_A_Buf2[15] && (t -= 25 - 5 * n_A_Buf2[15]),
    n_A_Equip[0] == 47 && (t += 2),
    EQUIPID.ALCA_BRINGER == n_A_Equip[0] && (t += Math.floor(n_A_Weapon_refine / 2)),
    n_A_Equip[4] == 1632 && (t += 1),
    n_A_Equip[2] == 1844 && (t += 1),
    EquipNumSearch(EQUIPID.WHITE_WING_SET_ARO) && (t += 2),
    EquipNumSearch(EQUIPID.BLACK_WING_SET_ARO) && (t -= 7),
    EquipNumSearch(EQUIPID.DEMON_SET) && (t += 1),
    SU_AGI >= 120 && EquipNumSearch(EQUIPID.FAIRY_EARS_BRO) && (t += 1),
    SU_AGI >= 120 && EquipNumSearch(EQUIPID.KERCHIEF) && (t += 1),
    SU_STR >= 120 && EquipNumSearch(EQUIPID.SKULL_RING) && (t += 1),
    n_A_WeaponType == 3 && n_A_Weapon_refine >= 10 && (t += CardNumSearch(525)),
    n_A_WeaponType == 3 && n_A_Weapon_refine >= 14 && (t += CardNumSearch(525)),
    n_A_WeaponType == 10 && n_A_Weapon_refine >= 10 && (t += CardNumSearch(528)),
    n_A_WeaponType == 10 && n_A_Weapon_refine >= 14 && (t += CardNumSearch(528)),
    n_A_SHOULDER_REFINE >= 9 && SU_AGI >= 90 && n_A_Equip[7] == 1472 && (t += 1),
    SkillSearch(SKILLID.FIGHTING_SPIRIT) && (t += (SkillSearch(SKILLID.RUNE_MASTERY) / 10) * 4),
    SkillSearch(SKILLID.SUMMON_TYPE) == 1 &&
      SkillSearch(SKILLID.SUMMON_LEVEL) > 0 &&
      SkillSearch(SKILLID.SPIRIT_CONTROL) == 1 &&
      (t += 5),
    (n_A_ASPD += t),
    thirdClass === 1 && n_A_ASPD > 193
      ? (n_A_ASPD = 193)
      : n_A_ASPD > 190 + 1 * c.maxASPD.value && (n_A_ASPD = 190 + 1 * c.maxASPD.value),
    (n_A_ASPD = Math.floor(10 * n_A_ASPD) / 10),
    myInnerHtml("A_ASPD", n_A_ASPD, 0),
    (n_A_ASPD = (200 - n_A_ASPD) / 50),
    (n_Delay[1] = Math.floor(1e3 * n_A_ASPD) / 1e3),
    SKILLID.ENVENOM == n_A_ActiveSkill && (n_Delay[1] = Math.floor(75 * n_A_ASPD) / 100),
    (sandanDelay = 0),
    SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW) &&
      SKILLID.BASIC_ATTACK == n_A_ActiveSkill &&
      ((sandanDelay = (1e3 - 4 * n_A_AGI - 2 * n_A_DEX) / 1e3),
      SkillSearch(SKILLID.ADD_DELAY_TIME) &&
        (sandanDelay = Math.round(1e3 * sandanDelay + 300) / 1e3)),
    (n_A_CAST = 1 - n_A_DEX / 150),
    n_A_CAST < 0 && (n_A_CAST = 0),
    (t = 100),
    (nb_tok = 0),
    (t += bonusValues[73] - n_A_Buf9[26]),
    EquipNumSearch(EQUIPID.SPIRITUAL_RING_WIZARDRY_SOUL_STAFF_SET) && (t -= n_A_Weapon_refine),
    EquipNumSearch(EQUIPID.BLACK_CAT) & EquipNumSearch(EQUIPID.ROGUES_TREASURE) &&
      (t -= n_A_Weapon_refine / 2),
    n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1084 && (t -= 5),
    n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1095 && (t -= 5),
    n_A_Weapon_refine == 10 &&
      EquipNumSearch(EQUIPID.SKULL_CAP_EVIL_BONE_WAND_THORN_STAFF_SET) &&
      (t -= 10),
    n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1279 && (t -= 3),
    n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1476 && (t -= 3),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1289 && (t -= 3),
    n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1289 && (t -= 2),
    n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1842 && (t -= 5),
    n_A_JobClass() == 5 && CardNumSearch(454) && (t -= 15),
    (n_A_JOB != 18 && n_A_JOB != 32) || !CardNumSearch(460) || (t -= 15),
    n_A_card[8] == 177 && (t -= n_A_HEAD_REFINE),
    n_A_Buf3[2] != 0 &&
      ((t -=
        (t / 100) * ((3 * n_A_Buf3[2] + n_A_Buf3[32] + Math.floor(n_A_Buf3[22] / 10)) / 100) * 100),
      (nb_tok += ((3 * n_A_Buf3[2] + n_A_Buf3[32] + Math.floor(n_A_Buf3[22] / 10)) / 100) * 100)),
    (t -= 50 * TimeItemNumSearch(1)) < 0 && (t = 0),
    (n_B_Cast = t),
    (n_A_CAST *= t / 100),
    (t = 100),
    StPlusCalc2(7e3 + n_A_ActiveSkill) != 0 && (t -= StPlusCalc2(7e3 + n_A_ActiveSkill)),
    StPlusCard(7e3 + n_A_ActiveSkill) != 0 && (t -= StPlusCard(7e3 + n_A_ActiveSkill)),
    (SKILLID.GUILLOTINE_FIST_MAX_SP != n_A_ActiveSkill &&
      SKILLID.GUILLOTINE_FIST != n_A_ActiveSkill) ||
      (SkillSearch(SKILLID.FURY) &&
        n_A_Weapon_refine >= 9 &&
        EquipNumSearch(EQUIPID.GLORIOUS_FIST) &&
        (t -= 100)),
    t < 0 && (t = 0),
    (n_A_CAST *= t / 100),
    n_A_Buf2[10] && (n_A_CAST *= (100 - 15 * n_A_Buf2[10]) / 100),
    SkillSearch(SKILLID.MEMORIZE) && (n_A_CAST /= 2),
    (t = 100 + bonusValues[72]) < 50 && (t = 50),
    (n_A_fCAST = t / 100),
    n_A_Equip[0] == 936 && (bonusValues[74] += 3 * Math.floor(n_A_Weapon_refine / 2)),
    n_A_Equip[0] == 934 && n_A_Weapon_refine >= 9 && (bonusValues[74] += 20),
    n_A_Equip[2] == 1036 && n_A_HEAD_REFINE >= 6 && (bonusValues[74] += n_A_HEAD_REFINE - 5),
    EquipNumSearch(EQUIPID.SAKURA_CORONET_PLUS_ROMANTIC_LEAF) &&
      n_A_HEAD_REFINE >= 5 &&
      (bonusValues[74] += n_A_HEAD_REFINE - 4),
    n_A_Equip[0] == 1084 && n_A_Weapon_refine >= 9 && (bonusValues[74] += 5),
    n_A_Equip[0] == 1095 && n_A_Weapon_refine >= 9 && (bonusValues[74] += 5),
    EQUIPID.GIGANTIC_LANCE == n_A_Equip[0] &&
      (bonusValues[74] += 15 * Math.min(Math.max(n_A_Weapon_refine - 6, 0), 3)),
    EQUIPID.GIANT_SHIELD == n_A_Equip[5] && n_A_LEFT_REFINE >= 9 && (bonusValues[192] += 10),
    EQUIPID.ELDERS_STAFF == n_A_Equip[0] &&
      n_A_Weapon_refine >= 10 &&
      (bonusValues[BONUSID.ACD_REDUCTION_PERCENT] += 15),
    n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1842 && (bonusValues[74] += 5),
    (AC_I = bonusValues[74] + n_A_Buf9[27]));
  var F;
  ((t = n_A_Buf3[2]),
    (bonusValues[74] = t
      ? t == 10
        ? 5 * t + 2 * n_A_Buf3[32] + Math.floor(n_A_Buf3[29] / 5)
        : 3 * t + 2 * n_A_Buf3[32] + Math.floor(n_A_Buf3[29] / 5)
      : 0),
    AC_I > 100 && (AC_I = 100),
    bonusValues[74] > 100 && (bonusValues[74] = 100),
    (F =
      '<span class=name style="color:var(--color-positive);">' +
      Math.floor(1e4 * n_A_CAST) / 100 +
      " % <span class=nametext>" +
      skillName(204) +
      ": " +
      nb_tok +
      "%<br>Gear: " +
      -bonusValues[73] +
      "%<br>DEX: " +
      n_A_DEX +
      " </span></span>"),
    myInnerHtml("A_cTime", F, 0),
    (F =
      '<span class=name style="color:var(--color-positive);">' +
      Math.floor(100 - AC_I - ((100 - AC_I) * bonusValues[74]) / 100) +
      " % <span class=nametext>" +
      skillName(204) +
      ": " +
      bonusValues[74] +
      "%<br>Gear: " +
      AC_I +
      "%</span></span>"),
    myInnerHtml("A_cDelay", F, 0));
  var O =
    2e3 +
    [
      0, 800, 400, 400, 600, 200, 800, 800, 400, 600, 700, 400, 1e3, 800, 400, 600, 700, 700, 400,
      1e3, 0, 800, 400, 600, 700, 400, 1e3, 800, 400, 600, 700, 700, 400, 1e3, 0, 0, 0, 0, 0, 0, 0,
      800, 800, 400, 600, 800,
    ][n_A_JOB];
  (1 * c.A_adopted.checked && (O = 2e3),
    // uaRO: Super Novice: +2000 di peso trasportabile (Class Changes, Super Novice)
    n_A_JOB == 20 && (O += 2e3),
    (O += 1 * c.A_STR.value * 30),
    (O += 1e3 * SkillSearch(SKILLID.CAVALIER_MASTERY)),
    (O += 200 * SkillSearch(SKILLID.ENLARGE_WEIGHT_LIMIT)),
    (O *= 1 + 0.1 * SkillSearch(SKILLID.SLS_COURIER)),
    (wLimitR = 200 * SkillSearch(SKILLID.ENLARGE_WEIGHT_LIMIT_R)));
  var H = n_A_Buf9[28];
  for (l = 0; l <= 10; l++) H += itemData[n_A_Equip[l]].weight;
  var R = Math.floor((1e4 * H) / (Math.floor(O) + wLimitR)),
    q = "var(--color-negative)";
  (R < 5e3 && (q = "var(--color-positive)"),
    myInnerHtml(
      "A_Weight",
      '<span class=name style="color:' +
        q +
        ';">' +
        R / 100 +
        " %<span class=nametext>" +
        H +
        " / " +
        (Math.floor(O) + wLimitR) +
        "</span></span>",
      0,
    ),
    (n_A_HPR = Math.floor(n_A_VIT / 5) + Math.floor(n_A_MaxHP / 200)),
    n_A_HPR < 1 && (n_A_HPR = 1),
    (t = 100),
    (t += bonusValues[75] + n_A_Buf9[45]),
    SU_LUK >= 77 && (t += 100 * CardNumSearch(221)),
    n_A_JobClass() == 41 && n_A_Equip[2] == 672 && (t += 3),
    n_A_SHOES_REFINE <= 4 && n_A_card[13] == 407 && (t += 5),
    (n_A_HPR = Math.floor((n_A_HPR * t) / 100)),
    (R >= 5e3 || n_A_Buf6[21] || n_A_Buf6[17] || n_A_card[11] == 333) && (n_A_HPR = 0));
  var M = "",
    K =
      ' + <span class=name style="color:var(--color-positive);">0<span class=nametext>Poison</span></span>';
  (SkillSearch(SKILLID.PEACEFUL_BREAK) &&
    (n_A_Buf6[21]
      ? (M += K)
      : (M +=
          ' + <span class=name style="color:var(--color-positive);">' +
          (Math.floor((30 + 0.3 * n_A_VIT) * SkillSearch(SKILLID.PEACEFUL_BREAK)) + 30) +
          "<span class=nametext>" +
          skillName(340) +
          " Lvl " +
          SkillSearch(SKILLID.PEACEFUL_BREAK) +
          "<br>(while sitting beside another Taekwon-type player, and with /doridori)<br>Each 10 seconds</span></span>")),
    SkillSearch(SKILLID.SPIRITUAL_CADENCE) &&
      (R >= 9e3
        ? (M +=
            ' + <span class=name style="color:var(--color-positive);">0<span class=nametext>Over 90% weight</span></span>')
        : n_A_Buf6[21]
          ? (M += K)
          : ((M +=
              ' + <span class=name style="color:var(--color-positive);">' +
              Math.floor((4 + n_A_MaxHP / 500) * SkillSearch(SKILLID.SPIRITUAL_CADENCE)) +
              "<span class=nametext>" +
              skillName(184) +
              " Lvl " +
              SkillSearch(SKILLID.SPIRITUAL_CADENCE) +
              "<br>Each "),
            (M += R < 5e3 ? "10 seconds</span></span>" : "20 seconds</span></span>"))),
    (SkillSearch(SKILLID.INCREASED_HP_RECOVERY) || EquipNumSearch(EQUIPID.BEER_HAT)) &&
      (R >= 5e3
        ? (M +=
            ' + <span class=name style="color:var(--color-positive);">0<span class=nametext>Overweight</span></span>')
        : n_A_Buf6[21]
          ? (M += K)
          : EquipNumSearch(EQUIPID.BEER_HAT) && SkillSearch(SKILLID.INCREASED_HP_RECOVERY) < 3
            ? (M +=
                ' + <span class=name style="color:var(--color-positive);">' +
                Math.floor(3 * (5 + n_A_MaxHP / 500)) +
                "<span class=nametext>Increase HP Recovery Lvl 3 (Beer Hat)<br>Each 10 seconds</span></span>")
            : SkillSearch(SKILLID.INCREASED_HP_RECOVERY) &&
              (M +=
                ' + <span class=name style="color:var(--color-positive);">' +
                Math.floor((5 + n_A_MaxHP / 500) * SkillSearch(SKILLID.INCREASED_HP_RECOVERY)) +
                "<span class=nametext>Increase HP Recovery Lvl " +
                SkillSearch(SKILLID.INCREASED_HP_RECOVERY) +
                "<br>Each 10 seconds</span></span>")),
    myInnerHtml("A_HPR", n_A_HPR + M, 0),
    (n_A_SPR = Math.floor(n_A_INT / 6) + Math.floor(n_A_MaxSP / 100) + 1),
    (t = 100),
    (t += 3 * SkillSearch(SKILLID.MEDIATIO)),
    (t += bonusValues[76] + n_A_Buf9[46]),
    SU_LUK >= 77 && (t += 100 * CardNumSearch(221)),
    n_A_card[9] == 179 && (t += 5),
    n_A_card[16] == 179 && (t += 5),
    n_A_card[17] == 179 && (t += 5),
    n_A_card[18] == 179 && (t += 5),
    n_A_JobClass() == 5 && (t += 5 * EquipNumSearch(EQUIPID.MAGICIAN_FIGURE)),
    n_A_JobClass() == 41 && n_A_Equip[2] == 673 && (t += 3),
    n_A_HEAD_REFINE <= 4 && n_A_card[8] == 179 && (t += 5),
    n_A_SHOES_REFINE <= 4 && n_A_card[13] == 407 && (t += 5),
    (n_A_SPR = Math.floor((n_A_SPR * t) / 100)),
    n_A_INT >= 120 && (n_A_SPR += Math.floor((n_A_INT - 120) / 2) + 4),
    (R >= 5e3 || n_A_Buf6[21] || n_A_Buf6[17] || CardNumSearch(334)) && (n_A_SPR = 0));
  var N = "";
  for (
    K = ' + <span class=name style="color:blue;">0<span class=nametext>Poison</span></span>',
      SkillSearch(SKILLID.HAPPY_BREAK) &&
        (n_A_Buf6[21]
          ? (N += K)
          : (N +=
              ' + <span class=name style="color:blue;">' +
              (Math.floor(
                (3 + n_A_MaxSP / 500) *
                  SkillSearch(SKILLID.HAPPY_BREAK) *
                  (1 + 0.1 * SkillSearch(SKILLID.KAINA)),
              ) +
                3) +
              "<span class=nametext>" +
              skillName(341) +
              " Lvl " +
              SkillSearch(SKILLID.HAPPY_BREAK) +
              "<br>(while sitting beside another Taekwon-type player, and with /doridori)<br>Each 10 seconds</span></span>")),
      SkillSearch(SKILLID.SPIRITUAL_CADENCE) &&
        (R >= 9e3
          ? (N +=
              ' + <span class=name style="color:blue;">0<span class=nametext>Over 90% weight</span></span>')
          : n_A_Buf6[21]
            ? (N += K)
            : ((N +=
                ' + <span class=name style="color:blue;">' +
                Math.floor((2 + n_A_MaxSP / 500) * SkillSearch(SKILLID.SPIRITUAL_CADENCE)) +
                "<span class=nametext>" +
                skillName(184) +
                " Lvl " +
                SkillSearch(SKILLID.SPIRITUAL_CADENCE) +
                "<br>Each "),
              (N += R < 5e3 ? "10 seconds</span></span>" : "20 seconds</span></span>"))),
      SkillSearch(SKILLID.NINJA_MASTERY) &&
        (R >= 5e3
          ? (N +=
              ' + <span class=name style="color:blue;">0<span class=nametext>Overweight</span></span>')
          : n_A_Buf6[21]
            ? (N += K)
            : (N +=
                ' + <span class=name style="color:blue;">' +
                Math.floor((3 + n_A_MaxSP / 500) * SkillSearch(SKILLID.NINJA_MASTERY)) +
                "<span class=nametext>Ninja Mastery Lvl " +
                SkillSearch(SKILLID.NINJA_MASTERY) +
                "</span></span>")),
      (SkillSearch(SKILLID.INCREASED_SP_RECOVERY) || EquipNumSearch(EQUIPID.BEER_HAT)) &&
        (R >= 5e3
          ? (N +=
              ' + <span class=name style="color:blue;">0<span class=nametext>Overweight</span></span>')
          : n_A_Buf6[21]
            ? (N += K)
            : EquipNumSearch(EQUIPID.BEER_HAT) && SkillSearch(SKILLID.INCREASED_SP_RECOVERY) < 3
              ? (N +=
                  ' + <span class=name style="color:blue;">' +
                  Math.floor(3 * (3 + n_A_MaxSP / 500)) +
                  "<span class=nametext>Increase SP Recovery Lvl 3 (Beer Hat)<br>Each 10 seconds</span></span>")
              : SkillSearch(SKILLID.INCREASED_SP_RECOVERY) &&
                (N +=
                  ' + <span class=name style="color:blue;">' +
                  Math.floor((3 + n_A_MaxSP / 500) * SkillSearch(SKILLID.INCREASED_SP_RECOVERY)) +
                  "<span class=nametext>Increase SP Recovery Lvl " +
                  SkillSearch(SKILLID.INCREASED_SP_RECOVERY) +
                  "<br>Each 10 seconds</span></span>")),
      myInnerHtml("A_SPR", n_A_SPR + N, 0),
      m_Arrow[n_A_Arrow][2] == "Holy Arrow" && (bonusValues[36] += 5),
      n_A_Weapon_refine >= 6 &&
        ((n_A_Equip[0] == 1076 ||
          n_A_Equip[0] == 1077 ||
          n_A_Equip[0] == 1081 ||
          n_A_Equip[0] == 1082 ||
          n_A_Equip[0] == 1086 ||
          (1088 <= n_A_Equip[0] && n_A_Equip[0] <= 1094) ||
          n_A_Equip[0] == 1096 ||
          n_A_Equip[0] == 1097 ||
          (1099 <= n_A_Equip[0] && n_A_Equip[0] <= 1103)) &&
          (n_A_Weapon_refine == 6 && (bonusValues[37] += 4),
          n_A_Weapon_refine == 7 && (bonusValues[37] += 9),
          n_A_Weapon_refine == 8 && (bonusValues[37] += 16),
          n_A_Weapon_refine == 9 && (bonusValues[37] += 25),
          n_A_Weapon_refine >= 10 && (bonusValues[37] += 36)),
        (n_A_Equip[0] != 1080 && n_A_Equip[0] != 1087 && n_A_Equip[0] != 1098) ||
          (n_A_Weapon_refine == 6 && (bonusValues[37] += 9),
          n_A_Weapon_refine == 7 && (bonusValues[37] += 16),
          n_A_Weapon_refine == 8 && (bonusValues[37] += 25),
          n_A_Weapon_refine == 9 && (bonusValues[37] += 36),
          n_A_Weapon_refine >= 10 && (bonusValues[37] += 49))),
      n_A_Buf7[42] &&
        ((bonusValues[150] += 10 * n_A_Buf7[42]),
        (bonusValues[151] += 10 * n_A_Buf7[42]),
        (bonusValues[152] += 10 * n_A_Buf7[42]),
        (bonusValues[153] += 10 * n_A_Buf7[42]),
        (bonusValues[154] += 10 * n_A_Buf7[42]),
        (bonusValues[155] += 10 * n_A_Buf7[42]),
        (bonusValues[156] += 10 * n_A_Buf7[42]),
        (bonusValues[157] += 10 * n_A_Buf7[42]),
        (bonusValues[158] += 10 * n_A_Buf7[42]),
        (bonusValues[159] += 10 * n_A_Buf7[42])),
      n_A_Buf9[54] &&
        ((bonusValues[170] += n_A_Buf9[54]),
        (bonusValues[171] += n_A_Buf9[54]),
        (bonusValues[172] += n_A_Buf9[54]),
        (bonusValues[173] += n_A_Buf9[54]),
        (bonusValues[174] += n_A_Buf9[54]),
        (bonusValues[175] += n_A_Buf9[54]),
        (bonusValues[176] += n_A_Buf9[54]),
        (bonusValues[177] += n_A_Buf9[54]),
        (bonusValues[178] += n_A_Buf9[54]),
        (bonusValues[179] += n_A_Buf9[54])),
      bonusValues[25] += n_A_Buf9[56],
      bonusValues[70] += n_A_Buf9[57],
      SkillSearch(SKILLID.FAITH) && (bonusValues[66] += 5 * SkillSearch(SKILLID.FAITH)),
      SkillSearch(SKILLID.DRAGONOLOGY) && (bonusValues[59] += 4 * SkillSearch(SKILLID.DRAGONOLOGY)),
      SkillSearch(SKILLID.DRAGONOLOGY) && (bonusValues[39] += 4 * SkillSearch(SKILLID.DRAGONOLOGY)),
      n_A_Buf7[45] && (bonusValues[100] += 20),
      n_A_JobClass() == 2 &&
        (bonusValues[70] += CardNumSearch(550) * Math.floor(n_A_HEAD_REFINE / 2)),
      n_A_Equip[0] == 624 && (bonusValues[191] += n_A_Weapon_refine),
      n_A_Equip[0] == 1089 && (bonusValues[70] += 2 * n_A_Weapon_refine),
      n_A_Equip[6] == 1718 && (bonusValues[25] += 2 * n_A_BODY_REFINE),
      n_A_Equip[0] == 1161 && (bonusValues[99] += SkillSearch(SKILLID.DIVINE_PROTECTION)),
      n_A_Equip[0] == 1792 && (bonusValues[5054] += 3 * n_A_Weapon_refine),
      CardNumSearch(551) && (bonusValues[99] += n_A_HEAD_REFINE / 2),
      EquipNumSearch(EQUIPID.SURVIVORS_MANTEAU_SURVIVORS_ROD_SET) &&
        (bonusValues[60] += 3 * n_A_SHOULDER_REFINE),
      EquipNumSearch(EQUIPID.CAPTAINS_HAT_PLUS_CAPTAINS_PIPE) &&
        (bonusValues[25] += n_A_HEAD_REFINE),
      EquipNumSearch(EQUIPID.SHIP_CAPTAIN_HAT_PLUS_CAPTAINS_PIPE) &&
        (bonusValues[25] += n_A_HEAD_REFINE),
      n_A_Equip[0] == 626 && n_A_Arrow == 2 && (bonusValues[25] += 25),
      n_A_Equip[0] == 627 && n_A_Arrow == 5 && (bonusValues[25] += 25),
      n_A_Equip[0] == 628 && n_A_Arrow == 4 && (bonusValues[25] += 25),
      n_A_Equip[0] == 629 && n_A_Arrow == 6 && (bonusValues[25] += 25),
      n_A_Equip[0] == 630 && n_A_Arrow == 10 && (bonusValues[25] += 50),
      n_A_Equip[0] == 101 && n_A_Arrow == 17 && (bonusValues[25] += 50),
      n_A_Equip[0] == 1491 && n_A_Arrow == 18 && (bonusValues[25] += 50),
      n_A_HEAD_REFINE >= 9 && n_A_card[8] == 543 && (bonusValues[54] += 5),
      n_A_LEFT_REFINE >= 6 && n_A_Equip[5] == 1622 && (bonusValues[60] += n_A_LEFT_REFINE - 5),
      n_A_LEFT_REFINE >= 9 && n_A_Equip[5] == 1797 && (bonusValues[192] += 5),
      n_A_HEAD_REFINE >= 8 && n_A_Equip[2] == 1244 && (bonusValues[61] += 5),
      n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1288 && (bonusValues[25] += 5),
      n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1285 && (bonusValues[80] += 3),
      n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1407 && (bonusValues[80] += 2),
      n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1842 && (bonusValues[80] += 3),
      n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1842 && (bonusValues[80] += 3),
      n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1407 && (bonusValues[80] += 2),
      n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1812 && (bonusValues[70] += 10),
      n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1812 && (bonusValues[80] += 5),
      n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1612 && (bonusValues[80] += 5),
      n_A_HEAD_REFINE >= 9 && n_A_Equip[2] == 1612 && (bonusValues[25] += 5),
      n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1768 && (bonusValues[99] += 3),
      n_A_Weapon_refine >= 9 && n_A_Equip[0] == 1101 && (bonusValues[80] += n_A_Weapon_refine),
      n_A_Weapon_refine >= 9 &&
        EquipNumSearch(EQUIPID.WEIHNA_IRO) &&
        (bonusValues[80] += n_A_Weapon_refine),
      n_A_Weapon_refine >= 6 &&
        n_A_Equip[0] == 1083 &&
        (bonusValues[177] += 2 * (n_A_Weapon_refine - 5)),
      n_A_SHOULDER_REFINE >= 9 && n_A_card[12] == 403 && (bonusValues[60] += 5),
      n_A_Buf2[11] && n_A_JOB != 13 && n_A_JOB != 27 && (bonusValues[56] += 5 * n_A_Buf2[11]),
      n_A_Buf2[11] && n_A_JOB != 13 && n_A_JOB != 27 && (bonusValues[66] += 5 * n_A_Buf2[11]),
      (n_A_JOB != 14 && n_A_JOB != 28) || (bonusValues[80] += 10 * CardNumSearch(479)),
      n_A_SHOULDER_REFINE >= 7 &&
        n_A_Equip[7] == 1472 &&
        (SU_DEX >= 90 && (bonusValues[25] += 5),
        SU_VIT >= 90 && (bonusValues[60] += 5),
        SU_LUK >= 90 && (bonusValues[70] += 10)),
      n_A_SHOULDER_REFINE >= 9 &&
        n_A_Equip[7] == 1472 &&
        (SU_DEX >= 90 && (bonusValues[25] += 5),
        SU_VIT >= 90 && (bonusValues[60] += 5),
        SU_LUK >= 90 && (bonusValues[70] += 5)),
      CardNumSearch(452) &&
        n_A_JobClass() == 3 &&
        ((bonusValues[51] += 30), (bonusValues[56] += 30)),
      n_A_HEAD_REFINE >= 5 &&
        (n_A_Equip[2] == 1507 || n_A_Equip[2] == 1508 || n_A_Equip[2] == 1703) &&
        ((bonusValues[57] += n_A_HEAD_REFINE - 4), (bonusValues[37] += n_A_HEAD_REFINE - 4)),
      l = 971;
    l <= 977;
    l++
  )
    EquipNumSearch(l) &&
      ((bonusValues[50] -= 200),
      (bonusValues[51] -= 200),
      (bonusValues[52] -= 200),
      (bonusValues[53] -= 200),
      (bonusValues[54] -= 200),
      (bonusValues[55] -= 200),
      (bonusValues[56] -= 200),
      (bonusValues[58] -= 200),
      (bonusValues[59] -= 200));
  if (
    ((targetData[20] == 0 &&
      n_B_rangedAtk == 0 &&
      n_B_rangedMAtk == 0 &&
      c.B_AtkRange.value != 2) ||
      c.B_AtkRange.value == 1) &&
    n_A_Equip[7] == 957
  )
    for (l = 0; l <= 9; l++) bonusValues[60 + l] += 30;
  if (n_A_HEAD_REFINE >= 7 && n_A_Equip[2] == 1498)
    for (l = 0; l <= 9; l++) bonusValues[60 + l] += 5;
  if (
    (SkillSearch(SKILLID.SKIN_TEMPERING) &&
      ((bonusValues[60] += SkillSearch(SKILLID.SKIN_TEMPERING)),
      (bonusValues[63] += 4 * SkillSearch(SKILLID.SKIN_TEMPERING))),
    n_A_Buf3[7])
  ) {
    for (l = 61; l <= 69; l++) bonusValues[l] += 55 + 5 * n_A_Buf3[7];
    for (l = 150; l <= 159; l++) bonusValues[l] += 10 * n_A_Buf3[7];
  }
  for (
    n_A_Buf7[11] && ((bonusValues[61] += 20), (bonusValues[64] -= 15)),
      n_A_Buf7[12] && ((bonusValues[62] += 20), (bonusValues[63] -= 15)),
      n_A_Buf7[13] && ((bonusValues[63] += 20), (bonusValues[61] -= 15)),
      n_A_Buf7[14] && ((bonusValues[64] += 20), (bonusValues[62] -= 15)),
      n_A_Equip[0] == 1085 &&
        (n_A_Weapon_refine >= 6 && (bonusValues[99] += 5 + 2 * (n_A_Weapon_refine - 5)),
        n_A_Weapon_refine >= 10 && (bonusValues[99] += 10)),
      n_A_Equip[0] == 644 && (bonusValues[99] += Math.floor(1.5 * n_A_Weapon_refine)),
      EquipNumSearch(EQUIPID.RECOVERY_LIGHT_ARO) &&
        (bonusValues[99] += Math.floor(6 * n_A_Weapon_refine)),
      EQUIPID.ELDERS_STAFF == n_A_Equip[0] &&
        n_A_Weapon_refine >= 7 &&
        (bonusValues[BONUSID.ALL_HEAL_PERCENT] += 5),
      EQUIPID.ELDERS_STAFF == n_A_Equip[0] &&
        n_A_Weapon_refine >= 9 &&
        (bonusValues[BONUSID.ALL_HEAL_PERCENT] += 10),
      n_A_HEAD_REFINE >= 7 &&
        (bonusValues[99] +=
          1 * EquipNumSearch(EQUIPID.DRESS_HAT) + 3 * EquipNumSearch(EQUIPID.CANCER_DIADEM)),
      n_A_Equip[6] == 534 &&
        ((wSPVS = n_A_JobClass()),
        (wSPVS != 1 && wSPVS != 2 && wSPVS != 6) || (bonusValues[151] += 50),
        (wSPVS != 3 && wSPVS != 4 && wSPVS != 5) || (bonusValues[156] += 50)),
      n_A_Equip[2] == 828 &&
        ((bonusValues[151] += 2 * n_A_HEAD_REFINE),
        (bonusValues[152] += 2 * n_A_HEAD_REFINE),
        (bonusValues[159] += 2 * n_A_HEAD_REFINE)),
      SU_AGI >= 90 &&
        ((bonusValues[151] += 30 * CardNumSearch(176)),
        (bonusValues[156] += 30 * CardNumSearch(176))),
      SU_VIT >= 80 &&
        ((bonusValues[155] += 50 * CardNumSearch(176)),
        (bonusValues[159] += 50 * CardNumSearch(176))),
      n_A_Buf8[0] == 42 && n_A_Equip[2] == 1218 && (bonusValues[151] += 10),
      n_A_element = new Array(),
      l = 0;
    l <= 9;
    l++
  )
    ((n_A_element[l] = 100 * element[10 * n_A_Bodyelement + 1][l]),
      (n_A_element[l] = n_A_element[l] - Math.floor(n_A_element[l] * bonusValues[60 + l]) / 100));
  ((n_A_Equip[1] != 1076 && n_A_Equip[1] != 1077) ||
    (n_A_Weapon2_refine >= 6 && (bonusValues[307] += 5)),
    (n_A_Equip[0] == 1076 ||
      n_A_Equip[0] == 1077 ||
      n_A_Equip[0] == 1080 ||
      n_A_Equip[0] == 1081 ||
      n_A_Equip[0] == 1086 ||
      (1088 <= n_A_Equip[0] && n_A_Equip[0] <= 1090) ||
      n_A_Equip[0] == 1092 ||
      n_A_Equip[0] == 1093 ||
      (1097 <= n_A_Equip[0] && n_A_Equip[0] <= 1103)) &&
      n_A_Weapon_refine >= 6 &&
      (bonusValues[307] += 5),
    (n_A_Equip[0] != 1082 &&
      n_A_Equip[0] != 1087 &&
      n_A_Equip[0] != 1094 &&
      n_A_Equip[0] != 1096) ||
      (n_A_Weapon_refine >= 6 && (bonusValues[307] += 5)),
    n_A_Equip[0] == 645 && (bonusValues[295] += 10 + n_A_Weapon_refine),
    n_A_WeaponType == 9 && (bonusValues[295] += 2 * CardNumSearch(466)),
    targetData[19] == 1 && (bonusValues[297] += 30 * CardNumSearch(425)),
    n_A_Equip[0] == 936 && (bonusValues[295] += 1 * n_A_Weapon_refine),
    targetData[19] == 1 &&
      n_A_Equip[2] == 1228 &&
      n_A_HEAD_REFINE >= 6 &&
      (bonusValues[297] += n_A_HEAD_REFINE - 5),
    targetData[19] == 1 && (bonusValues[295] += bonusValues[297]),
    (n_A_Equip[0] != 1084 && n_A_Equip[0] != 1095) ||
      (n_A_Weapon_refine >= 6 && (bonusValues[317] += 5)),
    n_A_Equip[0] == 1085 && n_A_Weapon_refine >= 6 && (bonusValues[317] += 5),
    n_A_Equip[0] == 1083 &&
      n_A_Weapon_refine >= 6 &&
      (bonusValues[317] += 5 + 2 * (n_A_Weapon_refine - 5)),
    (bonusValues[70] += bonusValues[320 + targetData[2]]),
    n_A_Equip[7] == 535 &&
      (n_A_JobClass(),
      (I != 1 && I != 2 && I != 6) ||
        ((bonusValues[71] += 5), (bonusValues[71] += 2 * n_A_SHOULDER_REFINE))),
    TimeItemNumSearch(52) && (bonusValues[71] += 3 * n_A_LEFT_REFINE),
    ClickB_Enemy(),
    KakutyouKansuu());
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
function UpdateDicastesEnchantControls() {
  for (
    var l = 1 * c.A_shoulder.value == EQUIPID.FERAL_TAIL,
      A = 1 * c.A_shoes.value == EQUIPID.FERAL_BOOTS,
      n = [
        [
          c.A_DICASTES_SHOULDER_PRIMARY,
          c.A_DICASTES_SHOULDER_STATS,
          c.A_DICASTES_SHOULDER_STATS2,
          l,
          5,
        ],
        [c.A_DICASTES_SHOES_PRIMARY, c.A_DICASTES_SHOES_STATS, c.A_DICASTES_SHOES_STATS2, A, 5],
        [
          c.A_DICASTES_ACCESSORY1_PRIMARY,
          c.A_DICASTES_ACCESSORY1_STATS,
          c.A_DICASTES_ACCESSORY1_STATS2,
          IsDicastesAccessory(1 * c.A_acces1.value),
          4,
        ],
        [
          c.A_DICASTES_ACCESSORY2_PRIMARY,
          c.A_DICASTES_ACCESSORY2_STATS,
          c.A_DICASTES_ACCESSORY2_STATS2,
          IsDicastesAccessory(1 * c.A_acces2.value),
          4,
        ],
      ],
      s = 0;
    s < n.length;
    s++
  ) {
    for (var _ = 0; _ < 3; _++) {
      var a = n[s][_],
        E = n[s][3];
      ((a.hidden = !E), (a.disabled = !E), E || (a.value = 0));
    }
    n[s][3] && UpdateDicastesStatPairOptions(n[s][1], n[s][2], n[s][4]);
  }
  ((c.A_SHOULDER_REFINE.disabled = l),
    l && (c.A_SHOULDER_REFINE.value = 0),
    (c.A_SHOES_REFINE.disabled = A),
    A && (c.A_SHOES_REFINE.value = 0),
    (c.A_BASTION_SHOES.hidden = A),
    (c.A_BASTION_SHOES.disabled = A),
    A && (c.A_BASTION_SHOES.value = BASTIONENCHANTID.NONE));
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
function UpdateDicastesStatPairOptions(l, A, n) {
  var s = 1 * l.value,
    _ = 1 * A.value,
    a = s ? Math.floor((s - 1) / 5) : -1,
    E = _ ? Math.floor((_ - 1) / 5) : -1,
    S = s ? ((s - 1) % 5) + 1 : 0,
    b = _ ? ((_ - 1) % 5) + 1 : 0;
  (S > n && ((l.value = 0), (s = S = 0), (a = -1)),
    b > n && ((A.value = 0), (_ = b = 0), (E = -1)),
    s && _ && (a == E || S + b > n) && ((A.value = 0), (_ = b = 0), (E = -1)));
  for (var m = 1; m < l.options.length; m++) {
    var u = Math.floor((m - 1) / 5),
      I = ((m - 1) % 5) + 1;
    ((l.options[m].disabled = I > n || (_ && (u == E || I + b > n))),
      (A.options[m].disabled = I > n || (s && (u == a || I + S > n))));
  }
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
      ((s -=
        (T = Math.floor((n_A_AGI + s) / 2)) > (l = PvP ? 5 * n_A_Buf6[19] : 10 * n_A_Buf6[19])
          ? l
          : T),
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
