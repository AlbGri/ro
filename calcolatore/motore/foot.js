for (var c = documento.calcForm, i = 1; i <= 22; i++)
  c.B_num.options[i - 1] = new documento.Opzione(i, i - 1);
for (i = 1; i <= 20; i++) c.A8_Skill15.options[i] = new documento.Opzione(5 * i, i);
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
  if (m_Item[n_A_Equip[0]][2] != 7 && JobEquipItemSearch(m_Item[n_A_Equip[0]][2])) {
    var n = n_A_Equip[0];
    ((n_A_WeaponType = m_Item[n][1]),
      ClickWeaponType(m_Item[n][1]),
      WeaponSet2(),
      (c.A_weapon1.value = n));
  } else (ClickWeaponType(0), WeaponSet2());
  (JobEquipItemSearch(m_Item[n_A_Equip[2]][2], m_Item[n_A_Equip[2]][1]) &&
    (c.A_head1.value = n_A_Equip[2]),
    JobEquipItemSearch(m_Item[n_A_Equip[3]][2], m_Item[n_A_Equip[3]][1]) &&
      (c.A_head2.value = n_A_Equip[3]),
    JobEquipItemSearch(m_Item[n_A_Equip[4]][2], m_Item[n_A_Equip[4]][1]) &&
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
    (n_A_WeaponType = m_Item[c.A_weapon1.value][1]),
    n_Nitou && (n_A_Weapon2Type = m_Item[c.A_weapon2.value][1]),
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
    (n_A_WeaponLV = m_Item[n_A_Equip[0]][4]),
    (n_A_Weapon_ATK = m_Item[n_A_Equip[0]][3]),
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
      (n_A_Weapon2LV = m_Item[n_A_Equip[1]][4]),
      (n_A_Weapon2_ATK = m_Item[n_A_Equip[1]][3]),
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
    for (p = 0; m_Item[n_A_Equip[0]][p + 11] != 0; p += 2)
      m_Item[n_A_Equip[0]][p + 11] == 20 && (n_A_Weapon_element = m_Item[n_A_Equip[0]][p + 12]);
    for (p = 0; m_Item[n_A_Equip[1]][p + 11] != 0; p += 2)
      m_Item[n_A_Equip[1]][p + 11] == 20 && (n_A_Weapon2_element = m_Item[n_A_Equip[1]][p + 12]);
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
    EQUIPID.DEATH_FIRE == n_A_Equip[0] || EQUIPID.DEATH_FIRE_LEGACY_PLUS_9 == n_A_Equip[0])
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
              card_restrict && m_Item[c.A_left.value][5] != 0 && (c.A_left_card.disabled = !1)),
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
    n_A_DEF += m_Item[n_A_Equip[l]][3];
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
  for (l = 0; l <= 10; l++) H += m_Item[n_A_Equip[l]][6];
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
    (EQUIPID.DEATH_FIRE == n_A_Equip[0] || EQUIPID.DEATH_FIRE_LEGACY_PLUS_9 == n_A_Equip[0]) &&
      (E += getDeathFireRefineBonuses(n_A_Weapon_refine).dex),
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
    for (var s = 0; m_Item[n_A_Equip[n]][s + 11] != 0; s += 2)
      l == Math.abs(m_Item[n_A_Equip[n]][s + 11]) && (A += m_Item[n_A_Equip[n]][s + 12]);
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
function sort(l) {
  for (var A = 1; l[A] != "EOF"; A++)
    for (var n = A; n > 0; n--)
      if (m_Item[l[n - 1]][8] > m_Item[l[n]][8]) {
        var s = l[n - 1];
        ((l[n - 1] = l[n]), (l[n] = s));
      }
  return l;
}
function WeaponSet(l) {
  (l === void 0 && (l = n_A_JOB),
    myInnerHtml(
      "A_w1",
      '<select name="A_weapon1" style="width:185px;" onchange="ClickWeaponType(this[this.selectedIndex].value) | Click_Item(this[this.selectedIndex].value)|restrictCardslot(1)"><option value="0">(no weapon)</option></select>',
      0,
    ));
  var A = 1 * c.restrict_lvlequip.checked,
    n = 0;
  for (k = 1; k <= 21; k++)
    if (m_JobASPD[l][k] != 0) {
      var s = documento.createElement("OPTGROUP");
      for (
        s.label = WeaponName[k],
          c.A_weapon1.appendChild(s),
          n_A_JobSet(),
          n_A_WeaponType = k,
          work = new Array(),
          j = 0,
          i = 0;
        i <= ItemMax;
        i++
      )
        m_Item[i][1] == n_A_WeaponType &&
          (JobEquipItemSearch(m_Item[i][2]) == 1 && (m_Item[i][7] <= c.A_BaseLV.value || A == 0)
            ? ((work[j] = i), j++)
            : m_Item[i][4] >= 1 &&
              SuperNoviceFullWeaponCHECK &&
              (m_Item[i][1] == 1 && m_Item[i][4] == 4 && ((work[j] = i), j++),
              (m_Item[i][1] == 2 || m_Item[i][1] > 3) && ((work[j] = i), j++)));
      if (j > 0) {
        for (work[j] = "EOF", work = sort(work), i = 1; i < j + 1; i++) {
          var _ = "";
          (m_Item[work[i - 1]][5] && (_ = " [" + m_Item[work[i - 1]][5] + "]"),
            (c.A_weapon1.options[i + n] = new documento.Opzione(
              m_Item[work[i - 1]][8] + _,
              m_Item[work[i - 1]][0],
            )),
            s.appendChild(c.A_weapon1.options[i + n]));
        }
        n += j;
      } else
        ((c.A_weapon1.options[n] = new documento.Opzione("(Restricted by Base Lvl)", 0)),
          s.appendChild(c.A_weapon1.options[n]),
          n++);
    }
  ClickWeaponType(0);
}
function WeaponSetLeft(l) {
  l === void 0 && (l = n_A_JOB);
  var A = 1 * c.restrict_lvlequip.checked;
  (myInnerHtml(
    "A_w2",
    '<select name="A_weapon2" style="width:185px;" onchange="ClickWeaponType2(this[this.selectedIndex].value) | StAllCalc()|ClickB_Item(this[this.selectedIndex].value)|restrictCardslot(1)"><option value="0">(Fist or Shield)</option></select>',
    0,
  ),
    myInnerHtml("A_weapon2refine", "", 0),
    myInnerHtml("A_weapon2_cardshort", "", 0),
    myInnerHtml("nA_weapon2_c1", "", 0),
    myInnerHtml("nA_weapon2_c2", "", 0),
    myInnerHtml("nA_weapon2_c3", "", 0),
    myInnerHtml("nA_weapon2_c4", "", 0),
    (n_Nitou = 0));
  var n = 0;
  for (k = 1; k <= 6; k++)
    if (m_JobASPD[l][k] != 0) {
      var s = documento.createElement("OPTGROUP");
      for (
        s.label = WeaponName[k],
          c.A_weapon2.appendChild(s),
          n_A_JobSet(),
          n_A_Weapon2Type = k,
          work = new Array(),
          j = 0,
          i = 0;
        i <= ItemMax;
        i++
      )
        m_Item[i][1] == n_A_Weapon2Type &&
          JobEquipItemSearch(m_Item[i][2]) == 1 &&
          (m_Item[i][7] <= c.A_BaseLV.value || A == 0) &&
          ((work[j] = i), j++);
      if (j > 0) {
        for (work[j] = "EOF", work = sort(work), i = 1; i < j + 1; i++) {
          var _ = "";
          (m_Item[work[i - 1]][5] && (_ = " [" + m_Item[work[i - 1]][5] + "]"),
            (c.A_weapon2.options[i + n] = new documento.Opzione(
              m_Item[work[i - 1]][8] + _,
              m_Item[work[i - 1]][0],
            )),
            s.appendChild(c.A_weapon2.options[i + n]));
        }
        n += j;
      } else
        ((c.A_weapon1.options[n] = new documento.Opzione("(restricted by Base Lvl)", 0)),
          s.appendChild(c.A_weapon1.options[n]),
          n++);
    }
}
function WeaponSet2(l) {
  var A = 1 * c.restrict_lvlequip.checked;
  if (!l || A != 1) {
    n_A_JobSet();
    for (var n = 0; n < c.A_head1.length; n++) c.A_head1.options[0] = null;
    for (n = 0; n < c.A_head2.length; n++) c.A_head2.options[0] = null;
    for (n = 0; n < c.A_head3.length; n++) c.A_head3.options[0] = null;
    for (n = 0; n < c.A_left.length; n++) c.A_left.options[0] = null;
    for (n = 0; n < c.A_body.length; n++) c.A_body.options[0] = null;
    for (n = 0; n < c.A_shoulder.length; n++) c.A_shoulder.options[0] = null;
    for (n = 0; n < c.A_shoes.length; n++) c.A_shoes.options[0] = null;
    for (n = 0; n < c.A_acces1.length; n++)
      ((c.A_acces1.options[0] = null), (c.A_acces2.options[0] = null));
    if (first_check == 0)
      return (
        (first_check = 1),
        (c.A_head1.options[0] = new documento.Opzione(m_Item[142][8], m_Item[142][0])),
        (c.A_head2.options[0] = new documento.Opzione(m_Item[243][8], m_Item[243][0])),
        (c.A_head3.options[0] = new documento.Opzione(m_Item[268][8], m_Item[268][0])),
        (c.A_left.options[0] = new documento.Opzione(m_Item[305][8], m_Item[305][0])),
        (c.A_body.options[0] = new documento.Opzione(m_Item[279][8], m_Item[279][0])),
        (c.A_shoulder.options[0] = new documento.Opzione(m_Item[311][8], m_Item[311][0])),
        (c.A_shoes.options[0] = new documento.Opzione(m_Item[317][8], m_Item[317][0])),
        (c.A_acces1.options[0] = new documento.Opzione(m_Item[326][8], m_Item[326][0])),
        void (c.A_acces2.options[0] = new documento.Opzione(m_Item[326][8], m_Item[326][0]))
      );
    first_check = 2;
    var s = new Array(),
      _ = 1 * c.restrict_jobequip.checked;
    for (A = 1 * c.restrict_lvlequip.checked, n = 0; n <= 7; n++) s[n] = new Array();
    var a = new Array();
    for (n = 0; n <= 7; n++) a[n] = 0;
    for (n = 0; n <= ItemMax; n++)
      m_Item[n][1] == 50 &&
      (JobEquipItemSearch(m_Item[n][2], m_Item[n][1]) == 1 ||
        SuperNoviceFullWeaponCHECK ||
        _ == 0) &&
      (m_Item[n][7] <= n_A_BaseLV || SuperNoviceFullWeaponCHECK || A == 0)
        ? ((s[0][a[0]] = n), a[0]++)
        : m_Item[n][1] == 51 &&
            (JobEquipItemSearch(m_Item[n][2], m_Item[n][1]) == 1 ||
              SuperNoviceFullWeaponCHECK ||
              _ == 0) &&
            (m_Item[n][7] <= n_A_BaseLV || SuperNoviceFullWeaponCHECK || A == 0)
          ? ((s[1][a[1]] = n), a[1]++)
          : m_Item[n][1] == 52 &&
              (JobEquipItemSearch(m_Item[n][2], m_Item[n][1]) == 1 ||
                SuperNoviceFullWeaponCHECK ||
                _ == 0) &&
              (m_Item[n][7] <= n_A_BaseLV || SuperNoviceFullWeaponCHECK || A == 0)
            ? ((s[2][a[2]] = n), a[2]++)
            : m_Item[n][1] != 61 ||
                (JobEquipItemSearch(m_Item[n][2], m_Item[n][1]) != 1 && _ != 0) ||
                !(m_Item[n][7] <= n_A_BaseLV || A == 0)
              ? m_Item[n][1] != 60 ||
                (JobEquipItemSearch(m_Item[n][2], m_Item[n][1]) != 1 && _ != 0) ||
                !(m_Item[n][7] <= n_A_BaseLV || A == 0)
                ? m_Item[n][1] != 62 ||
                  (JobEquipItemSearch(m_Item[n][2], m_Item[n][1]) != 1 && _ != 0) ||
                  !(m_Item[n][7] <= n_A_BaseLV || A == 0)
                  ? m_Item[n][1] != 63 ||
                    (JobEquipItemSearch(m_Item[n][2], m_Item[n][1]) != 1 && _ != 0) ||
                    !(m_Item[n][7] <= n_A_BaseLV || A == 0)
                    ? m_Item[n][1] != 64 ||
                      (JobEquipItemSearch(m_Item[n][2], m_Item[n][1]) != 1 && _ != 0) ||
                      !(m_Item[n][7] <= n_A_BaseLV || A == 0) ||
                      ((s[7][a[7]] = n), a[7]++)
                    : ((s[6][a[6]] = n), a[6]++)
                  : ((s[5][a[5]] = n), a[5]++)
                : ((s[4][a[4]] = n), a[4]++)
              : ((s[3][a[3]] = n), a[3]++);
    for (n = 0; n <= 7; n++) s[n][a[n]] = "EOF";
    for (var E = 0; E <= 7; E++) s[E] = sort(s[E]);
    var S = 0;
    for (n = 0; n < a[0]; n++)
      ((S = s[0][n]),
        m_Item[S][5]
          ? (c.A_head1.options[n] = new documento.Opzione(
              m_Item[S][8] + " [" + m_Item[S][5] + "]",
              m_Item[S][0],
            ))
          : (c.A_head1.options[n] = new documento.Opzione(m_Item[S][8], m_Item[S][0])));
    for (n = 0; n < a[1]; n++)
      ((S = s[1][n]),
        m_Item[S][5]
          ? (c.A_head2.options[n] = new documento.Opzione(
              m_Item[S][8] + " [" + m_Item[S][5] + "]",
              m_Item[S][0],
            ))
          : (c.A_head2.options[n] = new documento.Opzione(m_Item[S][8], m_Item[S][0])));
    for (n = 0; n < a[2]; n++)
      ((S = s[2][n]),
        m_Item[S][5]
          ? (c.A_head3.options[n] = new documento.Opzione(
              m_Item[S][8] + " [" + m_Item[S][5] + "]",
              m_Item[S][0],
            ))
          : (c.A_head3.options[n] = new documento.Opzione(m_Item[S][8], m_Item[S][0])));
    for (n = 0; n < a[3]; n++)
      ((S = s[3][n]),
        m_Item[S][5]
          ? (c.A_left.options[n] = new documento.Opzione(
              m_Item[S][8] + " [" + m_Item[S][5] + "]",
              m_Item[S][0],
            ))
          : (c.A_left.options[n] = new documento.Opzione(m_Item[S][8], m_Item[S][0])));
    for (n = 0; n < a[4]; n++)
      ((S = s[4][n]),
        m_Item[S][5]
          ? (c.A_body.options[n] = new documento.Opzione(
              m_Item[S][8] + " [" + m_Item[S][5] + "]",
              m_Item[S][0],
            ))
          : (c.A_body.options[n] = new documento.Opzione(m_Item[S][8], m_Item[S][0])));
    for (n = 0; n < a[5]; n++)
      ((S = s[5][n]),
        m_Item[S][5]
          ? (c.A_shoulder.options[n] = new documento.Opzione(
              m_Item[S][8] + " [" + m_Item[S][5] + "]",
              m_Item[S][0],
            ))
          : (c.A_shoulder.options[n] = new documento.Opzione(m_Item[S][8], m_Item[S][0])));
    for (n = 0; n < a[6]; n++)
      ((S = s[6][n]),
        m_Item[S][5]
          ? (c.A_shoes.options[n] = new documento.Opzione(
              m_Item[S][8] + " [" + m_Item[S][5] + "]",
              m_Item[S][0],
            ))
          : (c.A_shoes.options[n] = new documento.Opzione(m_Item[S][8], m_Item[S][0])));
    for (n = 0; n < a[7]; n++)
      ((S = s[7][n]),
        m_Item[S][5]
          ? ((c.A_acces1.options[n] = new documento.Opzione(
              m_Item[S][8] + " [" + m_Item[S][5] + "]",
              m_Item[S][0],
            )),
            (c.A_acces2.options[n] = new documento.Opzione(
              m_Item[S][8] + " [" + m_Item[S][5] + "]",
              m_Item[S][0],
            )))
          : ((c.A_acces1.options[n] = new documento.Opzione(m_Item[S][8], m_Item[S][0])),
            (c.A_acces2.options[n] = new documento.Opzione(m_Item[S][8], m_Item[S][0]))));
  }
}
function FirstNovis() {
  first_check == 1 && ((first_check = 2), WeaponSet2());
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
for (w_ASSP0bk = new Array(), i = 0; i < 20; i++) w_ASSP0bk[i] = 999;
function ActiveSkillSetPlus() {
  for (w_ASSP0 = new Array(), w_ASSP9 = new Array(), n = 0; n < 20; n++)
    ((w_ASSP0[n] = 999), (w_ASSP9[n] = 0));
  j = 0;
  var l = 0;
  for (n = 0; n <= 20; n++)
    for (j2 = 0; m_Item[n_A_Equip[n]][11 + j2] != 0; j2 += 2)
      ((l = m_Item[n_A_Equip[n]][12 + j2]),
        Math.abs(m_Item[n_A_Equip[n]][11 + j2]) == 220
          ? m_EnableSkill[l][1] == 1 &&
            ((w_ASSP0[j] = m_EnableSkill[l][2]), (w_ASSP9[j] = m_EnableSkill[l][0] + 3e3), j++)
          : Math.abs(m_Item[n_A_Equip[n]][11 + j2]) == 221 &&
            m_AutoSpellSkill[l][1] == 1 &&
            ((w_ASSP0[j] = m_AutoSpellSkill[l][2]),
            (w_ASSP9[j] = m_AutoSpellSkill[l][0] + 2e3),
            j++));
  for (n = 0; n <= 25; n++)
    for (j2 = 0; m_Card[n_A_card[n]][4 + j2] != 0; j2 += 2)
      m_Card[n_A_card[n]][4 + j2] == 220
        ? m_EnableSkill[m_Card[n_A_card[n]][5 + j2]][1] == 1 &&
          ((w_ASSP0[j] = m_EnableSkill[m_Card[n_A_card[n]][5 + j2]][2]),
          (w_ASSP9[j] = m_Card[n_A_card[n]][5 + j2] + 3e3),
          j++)
        : m_Card[n_A_card[n]][4 + j2] == 221 &&
          m_AutoSpellSkill[m_Card[n_A_card[n]][5 + j2]][1] == 1 &&
          ((w_ASSP0[j] = m_AutoSpellSkill[m_Card[n_A_card[n]][5 + j2]][2]),
          (w_ASSP9[j] = m_Card[n_A_card[n]][5 + j2] + 2e3),
          j++);
  (!CardNumSearch(164) ||
    (n_A_JOB != 9 && n_A_JOB != 23) ||
    ((w_ASSP0[j] = 162), (w_ASSP9[j] = 2095), j++),
    CardNumSearch(277) && n_A_JobClass() == 1 && ((w_ASSP0[j] = 76), (w_ASSP9[j] = 2096), j++),
    EquipNumSearch(EQUIPID.GLORIOUS_CLAW) &&
      n_A_JobClass2() != 9 &&
      ((w_ASSP0[j] = 193), (w_ASSP9[j] = 2108), j++));
  for (var A = [33, 34, 35, 36, 13, 37, 38, 39, 7], n = 0; n <= 8; n++)
    ((w_ASSP0[j] = m_EnableSkill[A[n]][2]), (w_ASSP9[j] = A[n] + 1500), j++);
  for (w_ASSP0[j] = m_EnableSkill[40][2], w_ASSP9[j] = 1540, j++, w_ASSPch = 0, n = 0; n < 20; n++)
    w_ASSP0bk[n] != w_ASSP0[n] && (w_ASSPch = 1);
  if (w_ASSPch) {
    if (c.all_dmgSkills.checked) k = c.A_ActiveSkill.length;
    else for (k = 0; m_JobAtkSkill[n_A_JOB][k] != 999; k++);
    for (n = k + 20; n >= k; n--) c.A_ActiveSkill.options[n] = null;
    for (j = 0, n = k; w_ASSP0[j] != 999; n++, j++)
      w_ASSP9[j] >= 3e3
        ? (c.A_ActiveSkill.options[n] = new documento.Opzione(
            m_Skill[w_ASSP0[j]][2] + " (adquired skill)",
            w_ASSP9[j],
          ))
        : w_ASSP9[j] >= 2e3
          ? (c.A_ActiveSkill.options[n] = new documento.Opzione(
              m_Skill[w_ASSP0[j]][2] + " (auto-casted skill)",
              w_ASSP9[j],
            ))
          : w_ASSP9[j] == 1540
            ? (c.A_ActiveSkill.options[n] = new documento.Opzione(
                m_Skill[w_ASSP0[j]][2] + " (Yggdrasil Leaf)",
                w_ASSP9[j],
              ))
            : w_ASSP9[j] >= 1500 &&
              (c.A_ActiveSkill.options[n] = new documento.Opzione(
                m_Skill[w_ASSP0[j]][2] + " (scroll)",
                w_ASSP9[j],
              ));
  }
  for (n = 0; n < 20; n++) w_ASSP0bk[n] = w_ASSP0[n];
  1 * c.A_ActiveSkill.value == 0 && (c.A_ActiveSkillLV.style.visibility = "hidden");
}
function KakutyouKansuu() {
  if (((wKK = 1 * c.A_Kakutyou.value), wKK == 40)) {
    var l = documento.getElementById("NonDamageCastSkill"),
      A = documento.getElementById("NonDamageCastSkillLevel");
    if (!l || !A) return;
    var n = 1 * l.value,
      s = 1 * A.value,
      _ = m_NonDamageSkillCast[n];
    if (!_) {
      myInnerHtml("A_KakutyouData", "", 0);
      return;
    }
    var a = Array.isArray(_[0]) ? _[0][s - 1] : _[0],
      E = NonDamageSkillCastMultiplier(n, _[1]),
      S = Math.floor((a * E) / 10 + 1e-9) / 100,
      b = Math.floor(a / 10) / 100,
      m = Math.floor(1e4 * (1 - E)) / 100,
      u = Array.isArray(_[2]) ? _[2][s - 1] : _[2] || 0,
      I = 100 - AC_I - ((100 - AC_I) * bonusValues[74]) / 100,
      D = Math.floor((u / 1e3) * I) / 100,
      T = Math.floor(u / 10) / 100,
      d = AspdMotionDelayForSkill(),
      B = Math.max(D, d),
      p = D > d ? "ACD" : D < d ? "ASPD motion" : "ACD / ASPD motion",
      e = (1 * c.Conf01.value) / 100,
      v = Math.max(S + B, e),
      U = v > 0 ? Math.floor(1e3 / v + 1e-9) / 1e3 : 0,
      C = '<table><tr><td class="right"><b>Base cast time:</b></td><td>' + b + " seconds</td></tr>";
    ((C += '<tr><td class="right"><b>Cast-time reduction:</b></td><td>' + m + "%</td></tr>"),
      (C += '<tr><td class="right"><b>Final cast time:</b></td><td>' + S + " seconds</td></tr>"),
      (C += '<tr><td class="right"><b>Base ACD:</b></td><td>' + T + " seconds</td></tr>"),
      (C += '<tr><td class="right"><b>Final ACD:</b></td><td>' + D + " seconds</td></tr>"),
      (C += '<tr><td class="right"><b>ASPD motion delay:</b></td><td>' + d + " seconds</td></tr>"),
      (C +=
        '<tr><td class="right"><b>Effective post-cast delay:</b></td><td>' +
        B +
        " seconds (" +
        p +
        ")</td></tr>"),
      (C += '<tr><td class="right"><b>Skills per second:</b></td><td>' + U + "</td></tr></table>"),
      (C +=
        "<small>Repeat rate includes final cast time and the configured minimum input delay.</small><br>"),
      _[1] & 1 && (C += "<small>DEX does not reduce this skill's cast time.</small><br>"),
      _[1] & 2 && (C += "<small>Status effects do not reduce this skill's cast time.</small><br>"),
      myInnerHtml("A_KakutyouData", C, 0));
    return;
  }
  if (wKK != 0) {
    if (((Heal = new Array()), (Heal2 = new Array()), wKK == 2)) {
      for (
        r =
          "<table><tr><td></td><td class=title>Heal on yourself</td><td class=title>Heal on other player</td></tr>",
          o = 0;
        o <= 10;
        o++
      )
        ((Heal[o] = HealCalc(o, 1)), (Heal2[o] = HealCalc(o, 0)));
      (n_A_JobClass() == 3 ||
      n_A_JOB == 13 ||
      n_A_JOB == 14 ||
      n_A_JOB == 20 ||
      n_A_JOB == 27 ||
      n_A_JOB == 28
        ? ((r +=
            "<tr><td><b>Heal Level 1</b></td><td class=center>" +
            Heal[1] +
            "</td><td class=center>" +
            Heal2[1] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Heal Level 2</b></td><td class=center>" +
            Heal[2] +
            "</td><td class=center>" +
            Heal2[2] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Heal Level 3</b></td><td class=center>" +
            Heal[3] +
            "</td><td class=center>" +
            Heal2[3] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Heal Level 4</b></td><td class=center>" +
            Heal[4] +
            "</td><td class=center>" +
            Heal2[4] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Heal Level 5</b></td><td class=center>" +
            Heal[5] +
            "</td><td class=center>" +
            Heal2[5] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Heal Level 6</b></td><td class=center>" +
            Heal[6] +
            "</td><td class=center>" +
            Heal2[6] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Heal Level 7</b></td><td class=center>" +
            Heal[7] +
            "</td><td class=center>" +
            Heal2[7] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Heal Level 8</b></td><td class=center>" +
            Heal[8] +
            "</td><td class=center>" +
            Heal2[8] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Heal Level 9</b></td><td class=center>" +
            Heal[9] +
            "</td><td class=center>" +
            Heal2[9] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Heal Level 10</b></td><td class=center>" +
            Heal[10] +
            "</td><td class=center>" +
            Heal2[10] +
            "</td></tr></table>"))
        : ((r +=
            "<tr><td><b>Heal Level 1 [Vitata Card]</b></td><td class=center>" +
            Heal[1] +
            "</td><td class=center>" +
            Heal2[1] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Heal Level 2</b></td><td class=center>" +
            Heal[2] +
            "</td><td class=center>" +
            Heal2[2] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Heal Level 3</b></td><td class=center>" +
            Heal[3] +
            "</td><td class=center>" +
            Heal2[3] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Heal Level 4</b></td><td class=center>" +
            Heal[4] +
            "</td><td class=center>" +
            Heal2[4] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Heal Level 5 [Scroll]</b></td><td class=center>" +
            Heal[5] +
            "</td><td class=center>" +
            Heal2[5] +
            "</td></tr></table>")),
        (r +=
          "<BR><B>Heal Boost:</B> " +
          (Math.floor(
            (1 + (bonusValues[91] + bonusValues[99]) / 100) *
              (1 + 0.02 * SkillSearch(SKILLID.MEDIATIO)) *
              100,
          ) -
            100) +
          "%"),
        (r += "<br><b>Required Int/Lvl for next bonus:</b> +" + (8 - ((n_A_BaseLV + n_A_INT) % 8))),
        myInnerHtml("A_KakutyouData", r, 0));
    } else if (wKK == 4) {
      if (n_A_JOB == 9 || n_A_JOB == 14 || n_A_JOB == 23 || n_A_JOB == 28) {
        for (Sanctuary = new Array(), Sanctuary2 = new Array(), o = 0; o <= 10; o++)
          ((Sanctuary[o] = SanctuaryCalc(o, 1)), (Sanctuary2[o] = SanctuaryCalc(o, 0)));
        ((r =
          "<table><tr><td></td><td class=title>Sanctuary on yourself</td><td class=title>Sanctuary on other player</td></tr>"),
          (r +=
            "<tr><td><b>Sanctuary Level 1</b></td><td class=center>" +
            Sanctuary[1] +
            " x 4 = " +
            4 * Sanctuary[1] +
            "</td><td class=center>" +
            Sanctuary2[1] +
            " x 4 = " +
            4 * Sanctuary2[1] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Sanctuary Level 2</b></td><td class=center>" +
            Sanctuary[2] +
            " x 5 = " +
            5 * Sanctuary[2] +
            "</td><td class=center>" +
            Sanctuary2[2] +
            " x 5 = " +
            5 * Sanctuary2[2] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Sanctuary Level 3</b></td><td class=center>" +
            Sanctuary[3] +
            " x 6 = " +
            6 * Sanctuary[3] +
            "</td><td class=center>" +
            Sanctuary2[3] +
            " x 6 = " +
            6 * Sanctuary2[3] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Sanctuary Level 4</b></td><td class=center>" +
            Sanctuary[4] +
            " x 7 = " +
            7 * Sanctuary[4] +
            "</td><td class=center>" +
            Sanctuary2[4] +
            " x 7 = " +
            7 * Sanctuary2[4] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Sanctuary Level 5</b></td><td class=center>" +
            Sanctuary[5] +
            " x 8 = " +
            8 * Sanctuary[5] +
            "</td><td class=center>" +
            Sanctuary2[5] +
            " x 8 = " +
            8 * Sanctuary2[5] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Sanctuary Level 6</b></td><td class=center>" +
            Sanctuary[6] +
            " x 9 = " +
            9 * Sanctuary[6] +
            "</td><td class=center>" +
            Sanctuary2[6] +
            " x 9 = " +
            9 * Sanctuary2[6] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Sanctuary Level 7</b></td><td class=center>" +
            Sanctuary[7] +
            " x 10 = " +
            10 * Sanctuary[7] +
            "</td><td class=center>" +
            Sanctuary2[7] +
            " x 10 = " +
            10 * Sanctuary2[7] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Sanctuary Level 8</b></td><td class=center>" +
            Sanctuary[8] +
            " x 11 = " +
            11 * Sanctuary[8] +
            "</td><td class=center>" +
            Sanctuary2[8] +
            " x 11 = " +
            11 * Sanctuary2[8] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Sanctuary Level 9</b></td><td class=center>" +
            Sanctuary[9] +
            " x 12 = " +
            12 * Sanctuary[9] +
            "</td><td class=center>" +
            Sanctuary2[9] +
            " x 12 = " +
            12 * Sanctuary2[9] +
            "</td></tr>"),
          (r +=
            "<tr><td><b>Sanctuary Level 10</b></td><td class=center>" +
            Sanctuary[10] +
            " x 13 = " +
            13 * Sanctuary[10] +
            "</td><td class=center>" +
            Sanctuary2[10] +
            " x 13 = " +
            13 * Sanctuary2[10] +
            "</td></tr></table>"),
          (r += "<BR><B>Heal Boost:</B> " + (1 * bonusValues[94] + 1 * bonusValues[99]) + "%"));
      } else r = '<p class="center">Not available for this class.</p>';
      myInnerHtml("A_KakutyouData", r, 0);
    } else if (wKK != 5)
      if (wKK == 6)
        n_A_JobClass() == 1 || n_A_JOB == 20
          ? ((HPRLV = 1 * c.A_KakutyouSelNum.value),
            (r = "<br>HP regen: " + Math.floor((5 + n_A_MaxHP / 500) * HPRLV)),
            (EquipNumSearch(EQUIPID.BEER_HAT) || n_A_JOB == 20) &&
              ((SPRLV = 1 * c.A_KakutyouSelNumSP.value),
              (r += "<br>SP regen: " + Math.floor((3 + n_A_MaxSP / 500) * SPRLV))),
            myInnerHtml("A_KakutyouData", r, 0))
          : n_A_JobClass() == 5 || n_A_JOB == 9 || n_A_JOB == 23 || n_A_JOB == 44
            ? ((SPRLV = 1 * c.A_KakutyouSelNum.value),
              (r = "<br>SP regen: " + Math.floor((3 + n_A_MaxSP / 500) * SPRLV)),
              EquipNumSearch(EQUIPID.BEER_HAT) &&
                ((HPRLV = 1 * c.A_KakutyouSelNumHP.value),
                (r += "<br>HP regen: " + Math.floor((5 + n_A_MaxHP / 500) * HPRLV))),
              myInnerHtml("A_KakutyouData", r, 0))
            : EquipNumSearch(EQUIPID.BEER_HAT)
              ? ((HPRLV = 1 * c.A_KakutyouSelNumHP.value),
                (SPRLV = 1 * c.A_KakutyouSelNumSP.value),
                (N = Math.floor((5 + n_A_MaxHP / 500) * HPRLV)),
                (w2 = Math.floor((3 + n_A_MaxSP / 500) * SPRLV)),
                myInnerHtml("A_KakutyouData", "<br>HP regen: " + N + "<br>SP regen: " + w2, 0))
              : myInnerHtml("A_KakutyouData", "", 0);
      else if (wKK == 7) {
        ((Pot1 = 1 * c.pot1.value),
          (Pot2 = 1 * c.pot2.value),
          (Pot3 = 1 * c.pot3.value),
          (Pot4 = 1 * c.pot4.value),
          (Pot5 = 1 * c.pot5.value),
          (Pot6 = 1 * c.pot6.value),
          (Pot7 = 1 * c.pot7.value),
          (c.zEA1.value = m_HPpotion[Pot1][1]),
          (c.zEA2.value = m_HPpotion[Pot2][1]),
          (c.zEA3.value = m_HPpotion[Pot3][1]),
          (c.zEA4.value = m_HPpotion[Pot4][1]),
          (c.zEA5.value = m_HPpotion[Pot5][1]),
          (c.zEA6.value = m_HPpotion[Pot6][1]),
          (c.zEA7.value = m_HPpotion[Pot7][1]),
          (H_Bonus = 0),
          EquipNumSearch(EQUIPID.ASSAULTER_SET) && (H_Bonus += 10),
          n_A_Equip[2] == 1768 && (H_Bonus += 5),
          n_A_Equip[8] == 1194 && (H_Bonus += 5),
          n_A_Equip[8] == 712 && Pot1 < 4 && (H_Bonus += 20),
          n_A_Equip[4] == 712 && Pot1 == 37 && (H_Bonus += 25),
          n_A_Equip[2] == 1448 && Pot1 == 71 && (H_Bonus += 25),
          CardNumSearch(487) && Pot1 == 35 && (H_Bonus += 100),
          CardNumSearch(495) && Pot1 == 40 && (H_Bonus += 100),
          CardNumSearch(262) &&
            (Pot1 == 56 && (H_Bonus += 50),
            Pot1 == 57 && (H_Bonus += 50),
            Pot1 == 58 && (H_Bonus += 50)),
          CardNumSearch(297) && Pot1 == 48 && (H_Bonus += 50),
          CardNumSearch(297) && Pot1 == 55 && (H_Bonus += 50),
          CardNumSearch(314) && Pot1 == 39 && (H_Bonus += 50),
          CardNumSearch(314) && Pot1 == 40 && (H_Bonus += 50),
          CardNumSearch(324) && Pot1 == 34 && (H_Bonus += 50),
          CardNumSearch(324) && Pot1 == 49 && (H_Bonus += 50),
          CardNumSearch(389) &&
            (Pot1 == 38 && (H_Bonus += 50),
            Pot1 == 63 && (H_Bonus += 50),
            Pot1 == 72 && (H_Bonus += 50)),
          CardNumSearch(450) &&
            n_A_JobClass() == 1 &&
            (Pot1 == 0 && (H_Bonus += 50),
            Pot1 == 2 && (H_Bonus += 50),
            Pot1 == 3 && (H_Bonus += 50)));
        for (var r = "", h = 1; h <= 7; h++)
          (m_HPpotion["Pot" + h][4] == 0
            ? (r = Math.floor((m_HPpotion["Pot" + h][3] * n_A_MaxHP) / 100))
            : ((potheal1 = Math.floor(
                m_HPpotion["Pot" + h][3] * (1 + 0.02 * n_A_VIT) * (1 + H_Bonus / 100),
              )),
              (potheal2 = Math.floor(
                m_HPpotion["Pot" + h][4] * (1 + 0.02 * n_A_VIT) * (1 + H_Bonus / 100),
              )),
              (r = potheal1 + " ~ " + potheal2)),
            myInnerHtml("AmRe" + h, r, 0),
            myInnerHtml(
              "AmWe" + h,
              Math.floor((potheal1 + potheal2) / 2 / m_HPpotion["Pot" + h][2]),
              0,
            ),
            myInnerHtml(
              "AmZe" + h,
              Math.floor((potheal1 + potheal2) / 2 / (1 * ("c.zEA" + h + ".value"))),
              0,
            ));
        myInnerHtml("A_KakutyouData", "", 0);
      } else if (wKK == 8)
        n_A_JOB == 15 || n_A_JOB == 29
          ? ((SPRLV = 1 * c.A_KakutyouSelNum.value),
            (N = Math.floor((4 + n_A_MaxHP / 500) * SPRLV)),
            (w2 = Math.floor((2 + n_A_MaxSP / 500) * SPRLV)),
            myInnerHtml("A_KakutyouData", "<br>HP regen: " + N + "<br>SP regen: " + w2, 0))
          : myInnerHtml("A_KakutyouData", "", 0);
      else if (wKK == 10) {
        for (
          wLimitJob = [
            0, 800, 400, 400, 600, 200, 800, 800, 400, 600, 700, 400, 1e3, 800, 400, 600, 700, 700,
            400, 1e3, 0, 800, 400, 600, 700, 400, 1e3, 800, 400, 600, 700, 700, 400, 1e3, 0, 0, 0,
            0, 0, 0, 0, 800, 800, 400, 600, 800,
          ],
            wLimit = 2e3 + wLimitJob[n_A_JOB],
            wLimitR = 1 * c.A_KakutyouSelNum2.value * 200,
            1 * c.A_adopted.checked && (wLimit = 2e3),
            // uaRO: Super Novice: +2000 di peso anche in Other Info (Class Changes, Super Novice)
            n_A_JOB == 20 && (wLimit += 2e3),
            wLimit += 1 * c.A_STR.value * 30,
            SkillSearch(SKILLID.CAVALIER_MASTERY) && (wLimit += 1e3),
            (n_A_JobClass() != 6 && n_A_JOB != 20) ||
              (wLimit += 1 * c.A_KakutyouSelNum.value * 200),
            n_A_JOB == 42 ? (Knowledge = 1 + 1 * c.SG_Weight.value * 0.1) : (Knowledge = 1),
            EquipKG = 0,
            o = 0;
          o <= 10;
          o++
        )
          EquipKG += m_Item[n_A_Equip[o]][6];
        ((r = "<table>"),
          (r +=
            "<tr><td><b><font color=red>Weight Limit: </font></b>" +
            (Math.floor(wLimit * Knowledge) + wLimitR) +
            "</td></tr><tr><td><b>Total Weight of Equipment: </b>" +
            EquipKG),
          (r += "</td></tr></table>"),
          myInnerHtml("A_KakutyouData", r, 0));
      } else if (wKK == 12) {
        var f = new Array();
        ((f[0] = Math.floor((100 * (3 + n_A_VIT)) / 100)),
          (f[1] = f[0]),
          (f[2] = Math.floor((100 * (3 + n_A_MDEF)) / 100)),
          (f[3] = Math.floor((100 * (3 + n_A_LUK)) / 100)),
          (f[4] = Math.floor((100 * (3 + (n_A_INT + n_A_VIT) / 2)) / 100)),
          (f[5] = Math.floor((100 * (3 + n_A_INT)) / 100)),
          (f[6] = f[0]),
          (f[7] = Math.floor((100 * (3 + (n_A_STR + n_A_INT) / 2)) / 100)),
          (f[8] = f[0]),
          (f[9] = Math.floor(100 * n_A_MDEF) / 100),
          n_A_LUK < 1 && (f[3] = 100),
          n_A_VIT >= 100 && (f[3] = 100),
          n_A_Bodyelement == 9 && ((f[2] = 100), (f[8] = 100), (f[9] = 100)));
        for (var o = 0; o <= 9; o++)
          ((f[o] += Math.floor((100 - f[o]) * bonusValues[150 + o]) / 100),
            (f[o] = Math.floor(100 * f[o]) / 100),
            f[o] > 100 && (f[o] = 100),
            f[o] < 0 && (f[o] = 0));
        var g = [
            0.75 * n_A_VIT,
            n_A_VIT,
            n_A_MDEF,
            n_A_VIT,
            (n_A_VIT + n_A_INT) / 2,
            n_A_INT,
            n_A_VIT,
            (n_A_STR + n_A_INT) / 2,
            n_A_VIT,
            0,
          ],
          J = [
            n_A_LUK / 10,
            n_A_LUK / 100,
            0,
            n_A_LUK / 100,
            n_A_LUK / 100,
            n_A_LUK / 100,
            n_A_LUK / 100,
            n_A_LUK / 100,
            n_A_LUK / 100,
            0,
          ],
          L = new Array();
        for (o = 0; o <= 8; o++) {
          ((g[o] = Math.min(100, Math.floor(g[o] * 100) / 100)),
            (J[o] = Math.floor(J[o] * 100) / 100));
          var V = Math.max(1, 1e3 - Math.floor((1e3 * g[o]) / 100) - 1e3 * J[o]),
            G = Math.floor(V) / 1e3,
            Y = Math.floor(((1e3 - V) / 10) * 100) / 100;
          L[o] = " <small>(duration " + G + "s, -" + Y + "%)</small>";
        }
        ((L[9] = " <small>(duration 1s, -0%)</small>"),
          (r = "<table>"),
          (r +=
            "<tr><td class='right'><b>" +
            (100 - n_A_element[0]) +
            "</b> % vs</td><td class='data'>" +
            v_Element[0] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            bonusValues[50] +
            "</b> % vs</td><td class='data'>" +
            v_Race[0] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            f[0] +
            "</b> % vs</td><td><b>" +
            v_Effect[0] +
            "</b>" +
            L[0] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>" +
            (100 - n_A_element[1]) +
            "</b> % vs</td><td class='data'>" +
            v_Element[1] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            bonusValues[51] +
            "</b> % vs</td><td class='data'>" +
            v_Race[1] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            f[1] +
            "</b> % vs</td><td><b>" +
            v_Effect[1] +
            "</b>" +
            L[1] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>" +
            (100 - n_A_element[2]) +
            "</b> % vs</td><td class='data'>" +
            v_Element[2] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            bonusValues[52] +
            "</b> % vs</td><td class='data'>" +
            v_Race[2] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            f[2] +
            "</b> % vs</td><td><b>" +
            v_Effect[2] +
            "</b>" +
            L[2] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>" +
            (100 - n_A_element[3]) +
            "</b> % vs</td><td class='data'>" +
            v_Element[3] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            bonusValues[53] +
            "</b> % vs</td><td class='data'>" +
            v_Race[3] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            f[3] +
            "</b> % vs</td><td><b>" +
            v_Effect[3] +
            "</b>" +
            L[3] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>" +
            (100 - n_A_element[4]) +
            "</b> % vs</td><td class='data'>" +
            v_Element[4] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            bonusValues[54] +
            "</b> % vs</td><td class='data'>" +
            v_Race[4] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            f[4] +
            "</b> % vs</td><td><b>" +
            v_Effect[4] +
            "</b>" +
            L[4] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>" +
            (100 - n_A_element[5]) +
            "</b> % vs</td><td class='data'>" +
            v_Element[5] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            bonusValues[55] +
            "</b> % vs</td><td class='data'>" +
            v_Race[5] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            f[5] +
            "</b> % vs</td><td><b>" +
            v_Effect[5] +
            "</b>" +
            L[5] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>" +
            (100 - n_A_element[6]) +
            "</b> % vs</td><td class='data'>" +
            v_Element[6] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            bonusValues[56] +
            "</b> % vs</td><td class='data'>" +
            v_Race[6] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            f[6] +
            "</b> % vs</td><td><b>" +
            v_Effect[6] +
            "</b>" +
            L[6] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>" +
            (100 - n_A_element[7]) +
            "</b> % vs</td><td class='data'>" +
            v_Element[7] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            bonusValues[57] +
            "</b> % vs</td><td class='data'>" +
            v_Race[7] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            f[7] +
            "</b> % vs</td><td><b>" +
            v_Effect[7] +
            "</b>" +
            L[7] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>" +
            (100 - n_A_element[8]) +
            "</b> % vs</td><td class='data'>" +
            v_Element[8] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            bonusValues[58] +
            "</b> % vs</td><td class='data'>" +
            v_Race[8] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            f[8] +
            "</b> % vs</td><td><b>" +
            v_Effect[8] +
            "</b>" +
            L[8] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>" +
            (100 - n_A_element[9]) +
            "</b> % vs</td><td class='data'>" +
            v_Element[9] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            bonusValues[59] +
            "</b> % vs</td><td class='data'>" +
            v_Race[9] +
            "</td>"),
          (r +=
            "<td class='right'><b>" +
            f[9] +
            "</b> % vs</td><td><b>" +
            v_Effect[9] +
            "</b>" +
            L[9] +
            "</td></tr>"),
          (r +=
            "<tr><td colspan='6' class='center'>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</td></tr></table>"),
          (r +=
            "<small>Displayed duration assumes a 1s base duration. Freeze is additionally extended by 0.01s per point of caster LUK.</small>"),
          (r += "<table>"),
          (r +=
            "<tr><td class='right'><b>" +
            bonusValues[190] +
            "</b> % vs</td><td class='data'><b>Small size</b></td>"),
          (r +=
            "<td class='right'><b>" +
            bonusValues[77] +
            "</b> % vs</td><td><b>Boss monsters</b></td></tr>"),
          (r +=
            "<tr><td class='right'><b>" +
            bonusValues[191] +
            "</b> % vs</td><td class='data'><b>Medium size</b></td>"),
          (r +=
            "<td class='right'><b>" +
            bonusValues[79] +
            "</b> % vs</td><td><b>Normal monsters</b></td></tr>"),
          (r +=
            "<tr><td class='right'><b>" +
            bonusValues[192] +
            "</b> % vs</td><td class='data'><b>Large size</b></td>"),
          (r +=
            "<td class='right'><b>" +
            bonusValues[78] +
            "</b> % vs</td><td><b>Long-range attacks</b></td></tr>"),
          (r += "</table>"),
          myInnerHtml("A_KakutyouData", r, 0));
      } else if (wKK == 14) {
        for (
          F_MOD = 0,
            G_MOD = bonusValues[80],
            B_MOD = bonusValues[80] + bonusValues[BONUSID.PHYSICAL_BOSS_DMG_PERCENT],
            SM_MOD = 0,
            o = 0;
          o <= 7;
          o++
        )
          n_A_card[o] == 244 && (G_MOD += 40);
        for (
          EquipNumSearch(EQUIPID.DIABOLUS_MANTEAU) && (SM_MOD += 10),
            (n_A_Equip[9] != 844 && n_A_Equip[9] != 1753) || (SM_MOD += 10),
            (n_A_Equip[10] != 844 && n_A_Equip[10] != 1753) || (SM_MOD += 10),
            o = 0;
          o < 8;
          o += 2
        )
          n_A_Buf9[o] == 29 && (SM_MOD += n_A_Buf9[o + 1]);
        for (o = 0; o < 8; o += 2) n_A_Buf9[o] == 26 && (G_MOD += n_A_Buf9[o + 1]);
        switch (
          ((F_M1 = 1 * c.R_OBJ.value),
          (F_M2 = 1 * c.S_OBJ.value),
          (F_M3 = 1 * c.E_OBJ.value),
          (F_M4 = 1 * c.B_OBJ.value),
          (F_M5 = 1 * c.SP_OBJ.value),
          F_M1)
        ) {
          case 0:
            F_M1 = bonusValues[30];
            break;
          case 1:
            F_M1 = bonusValues[31];
            break;
          case 2:
            F_M1 = bonusValues[32];
            break;
          case 3:
            F_M1 = bonusValues[33];
            break;
          case 4:
            F_M1 = bonusValues[34];
            break;
          case 5:
            F_M1 = bonusValues[35];
            break;
          case 6:
            F_M1 = bonusValues[36];
            break;
          case 7:
            F_M1 = bonusValues[37];
            break;
          case 8:
            F_M1 = bonusValues[38];
            break;
          case 9:
            F_M1 = bonusValues[39];
            break;
        }
        switch (F_M2) {
          case 0:
            F_M2 = bonusValues[27];
            break;
          case 1:
            F_M2 = bonusValues[28];
            break;
          case 2:
            F_M2 = bonusValues[29];
            break;
        }
        switch (F_M3) {
          case 0:
            F_M3 = bonusValues[40];
            break;
          case 1:
            F_M3 = bonusValues[41];
            break;
          case 2:
            F_M3 = bonusValues[42];
            break;
          case 3:
            F_M3 = bonusValues[43];
            break;
          case 4:
            F_M3 = bonusValues[44];
            break;
          case 5:
            F_M3 = bonusValues[45];
            break;
          case 6:
            F_M3 = bonusValues[46];
            break;
          case 7:
            F_M3 = bonusValues[47];
            break;
          case 8:
            F_M3 = bonusValues[48];
            break;
          case 9:
            F_M3 = bonusValues[49];
            break;
        }
        switch (F_M4) {
          case 0:
            F_M4 = bonusValues[80];
            break;
          case 1:
            F_M4 = B_MOD;
            break;
        }
        switch (F_M5) {
          case 0:
            F_M5 = 0;
            break;
          case 1:
            F_M5 = bonusValues[81];
            break;
          case 2:
            F_M5 = bonusValues[84];
            break;
          case 3:
            F_M5 = G_MOD;
            break;
          case 4:
            F_M5 = bonusValues[82];
            break;
          case 5:
            F_M5 = bonusValues[83];
            break;
          case 6:
            F_M5 = SM_MOD;
            break;
        }
        ((F_M1 = 1 + F_M1 / 100),
          (F_M2 = 1 + F_M2 / 100),
          (F_M3 = 1 + F_M3 / 100),
          (F_M4 = 1 + F_M4 / 100),
          (F_M5 = 1 + F_M5 / 100),
          (F_M6 = 1 + bonusValues[25] / 100),
          (F_M7 = 1 + bonusValues[70] / 100),
          (F_MOD = Math.round(F_M1 * F_M2 * F_M3 * F_M4 * F_M5 * 100)),
          (F_MOD2 = Math.round(F_M1 * F_M2 * F_M3 * F_M4 * F_M5 * F_M6 * 100)),
          (F_MOD3 = Math.round(F_M1 * F_M2 * F_M3 * F_M4 * F_M5 * F_M7 * 100)),
          (F_MOD4 = Math.round(F_M1 * F_M2 * F_M3 * F_M4 * F_M5 * F_M6 * F_M7 * 100)),
          (r = "<table>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[40] +
            "</b>%</td><td class='data'>vs " +
            v_Element[0] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[30] +
            "</b>%</td><td class='data'>vs " +
            v_Race[0] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[81] +
            "</b>%</td><td>vs <b>Goblin</b></td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[41] +
            "</b>%</td><td class='data'>vs " +
            v_Element[1] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[31] +
            "</b>%</td><td class='data'>vs " +
            v_Race[1] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" + bonusValues[84] + "</b>%</td><td>vs <b>Golem</b></td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[42] +
            "</b>%</td><td class='data'>vs " +
            v_Element[2] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[32] +
            "</b>%</td><td class='data'>vs " +
            v_Race[2] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[82] +
            "</b>%</td><td>vs <b>Kobold</b></td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[43] +
            "</b>%</td><td class='data'>vs " +
            v_Element[3] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[33] +
            "</b>%</td><td class='data'>vs " +
            v_Race[3] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" + bonusValues[83] + "</b>%</td><td>vs <b>Orc</b></td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[44] +
            "</b>%</td><td class='data'>vs " +
            v_Element[4] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[34] +
            "</b>%</td><td class='data'>vs " +
            v_Race[4] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" + SM_MOD + "</b>%</td><td>vs <b>Satan Morroc</b></td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[45] +
            "</b>%</td><td class='data'>vs " +
            v_Element[5] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[35] +
            "</b>%</td><td class='data'>vs " +
            v_Race[5] +
            "</td>"),
          (r += "<td class='right'><b>+" + G_MOD + "</b>%</td><td>vs <b>Guardian</b></td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[46] +
            "</b>%</td><td class='data'>vs " +
            v_Element[6] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[36] +
            "</b>%</td><td class='data'>vs " +
            v_Race[6] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[80] +
            "</b>%</td><td>vs <b>Normal</b></td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[47] +
            "</b>%</td><td class='data'>vs " +
            v_Element[7] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[37] +
            "</b>%</td><td class='data'>vs " +
            v_Race[7] +
            "</td>"),
          (r += "<td class='right'><b>+" + B_MOD + "</b>%</td><td>vs <b>Boss</b></td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[48] +
            "</b>%</td><td class='data'>vs " +
            v_Element[8] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[38] +
            "</b>%</td><td class='data'>vs " +
            v_Race[8] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[25] +
            "</b>%</td><td><b>long-range dmg</b></td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[49] +
            "</b>%</td><td class='data'>vs " +
            v_Element[9] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[39] +
            "</b>%</td><td class='data'>vs " +
            v_Race[9] +
            "</td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[70] +
            "</b>%</td><td><b>critical damage</b></td></tr>"),
          (r +=
            "<tr><td colspan='6' class='center'>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</td></tr></table>"),
          (r += "<table>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[27] +
            "</b>% vs</td><td class='data'><b>Small</b></td>"),
          (r +=
            "<td class='right'><b>+" +
            bonusValues[28] +
            "</b>% vs</td><td class='data'><b>Medium</b></td>"),
          (r +=
            "<td class='right'><b>+" + bonusValues[29] + "</b>% vs</td><td><b>Large</b></td></tr>"),
          (r += "</table>"),
          (r += "<hr><table>"),
          (r +=
            "<tr><td><b>Final non-critical melee ATK based damage modifier: </b>" +
            F_MOD +
            " %</td></tr>"),
          (r +=
            "<tr><td><b>Final non-critical long-range ATK based damage modifier: </b>" +
            F_MOD2 +
            " %</td></tr>"),
          (r +=
            "<tr><td><b>Final critical melee ATK based damage modifier: </b>" +
            F_MOD3 +
            " %</td></tr>"),
          (r +=
            "<tr><td><b>Final critical long-range ATK based damage modifier: </b>" +
            F_MOD4 +
            " %</td></tr>"),
          (r += "</table>"),
          myInnerHtml("A_KakutyouSel", r, 0));
      } else if (wKK == 16)
        ((r = "<table>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[170] +
            "</b> % vs</td><td>" +
            v_Race[0] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[171] +
            "</b> % vs</td><td>" +
            v_Race[1] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[172] +
            "</b> % vs</td><td>" +
            v_Race[2] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[173] +
            "</b> % vs</td><td>" +
            v_Race[3] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[174] +
            "</b> % vs</td><td>" +
            v_Race[4] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[175] +
            "</b> % vs</td><td>" +
            v_Race[5] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[176] +
            "</b> % vs</td><td>" +
            v_Race[6] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[177] +
            "</b> % vs</td><td>" +
            v_Race[7] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[178] +
            "</b> % vs</td><td>" +
            v_Race[8] +
            "</td></tr>"),
          (r +=
            "<tr><td class='right'><b>+" +
            bonusValues[179] +
            "</b> % vs</td><td>" +
            v_Race[9] +
            "</td></tr>"),
          (r += "</table>"),
          myInnerHtml("A_KakutyouData", r, 0));
      else if (wKK == 18) {
        var t;
        ((t =
          "<b>Cast Time: </b>" +
          Math.floor(1e4 * n_A_CAST) / 100 +
          " % (<b>" +
          skillName(204) +
          ":</b> " +
          nb_tok +
          " %| <b>Gear:</b> " +
          -bonusValues[73] +
          " % | <b>DEX:</b> " +
          n_A_DEX +
          " )<BR>"),
          (t +=
            "<b>Cast Delay: </b>" +
            Math.floor(100 - AC_I - ((100 - AC_I) * bonusValues[74]) / 100) +
            " % (<b>" +
            skillName(204) +
            ":</b> " +
            bonusValues[74] +
            " % | <b>Gear:</b> " +
            AC_I +
            " %)<BR>"),
          myInnerHtml("A_KakutyouData", t, 0));
      } else if (wKK == 20) {
        var F = 1 * c.A_KakutyouSelNum.value,
          O = 1 * c.A_KakutyouSelNum2.value;
        ((0 <= F && F < 100) || ((F = 0), (c.A_KakutyouSelNum.value = 0)),
          (0 <= O && O < 100) || ((O = 0), (c.A_KakutyouSelNum2.value = 0)));
        var H = 0;
        (n_A_JOB == 0 && n_Reborn && (H = 1),
          ((1 <= n_A_JOB && n_A_JOB <= 6) || n_A_JOB == 41 || n_A_JOB == 20) &&
            ((H = 2), n_Reborn && (H = 3)),
          ((7 <= n_A_JOB && n_A_JOB <= 19) || n_A_JOB == 43) && (H = 4),
          21 <= n_A_JOB && n_A_JOB <= 33 && (H = 5),
          n_A_JOB == 42 && (H = 7),
          (n_A_JOB != 44 && n_A_JOB != 45) || (H = 6),
          (F = Math.floor((PC_BaseExp[n_Reborn][n_A_BaseLV] * F) / 100)),
          (r =
            "Required BaseExp for Base Up: <B>" +
            Kanma(PC_BaseExp[n_Reborn][n_A_BaseLV] - F) +
            " </B>exp<BR>"));
        var R = 0,
          q = 0;
        if (targetData[16] != 0) {
          for (o = n_A_BaseLV; o < 99; o++) {
            var M = PC_BaseExp[n_Reborn][o];
            for (R += N = Math.floor((M - F) / targetData[16]), F += N * targetData[16]; F < M;)
              ((F += targetData[16]), (R += 1));
            (q == 0 &&
              ((q = 1),
              (r +=
                "(Equals <B>" +
                Kanma(R) +
                "</B> " +
                targetData[1] +
                " kill" +
                (Kanma(R) != 1 ? "s" : "") +
                ")<BR>")),
              (F -= M) > M - 1 && (F = M - 1));
          }
          r +=
            "Until Base Lvl 99: <B>" +
            Kanma(R) +
            "</B> more " +
            targetData[1] +
            " kill" +
            (Kanma(R) != 1 ? "s" : "") +
            "<BR><BR>";
        }
        if (
          ((O = Math.floor((PC_JobExp[H][n_A_JobLV] * O) / 100)),
          ((1 <= n_A_JOB && n_A_JOB <= 6) || n_A_JOB == 41) && n_A_JobLV == 50 && (O = 0),
          (r +=
            "Required JobExp for Job Up: <B>" +
            Kanma(PC_JobExp[H][n_A_JobLV] - O) +
            "</B> exp<BR>"),
          (R = 0),
          (q = 0),
          targetData[17] != 0)
        ) {
          for (o = 1; PC_JobExp[H][o] != 0; o++);
          var K = o;
          for (
            ((1 <= n_A_JOB && n_A_JOB <= 6) || n_A_JOB == 41) && (K = 50), o = n_A_JobLV;
            o < K;
            o++
          ) {
            var N;
            for (
              M = PC_JobExp[H][o],
                R += N = Math.floor((M - O) / targetData[17]),
                O += N * targetData[17];
              O < M;
            )
              ((O += targetData[17]), (R += 1));
            (q == 0 &&
              ((q = 1),
              (r +=
                "(Equals <B>" +
                Kanma(R) +
                "</B> " +
                targetData[1] +
                " kill" +
                (Kanma(R) != 1 ? "s" : "") +
                ")<BR>")),
              (O -= M) > M - 1 && (O = M - 1));
          }
          r +=
            "Until JobLvl " +
            K +
            ": <B>" +
            Kanma(R) +
            "</B> more " +
            targetData[1] +
            " kill" +
            (Kanma(R) != 1 ? "s" : "") +
            "<BR>";
        }
        myInnerHtml("A_KakutyouData", r, 0);
      } else if (wKK == 22)
        if (((H_Bonus = 1), (H_Bonus2 = 1), (H_Bonus3 = 1), n_A_JOB == 19 || n_A_JOB == 33)) {
          for (
            slv = 1 * c.SL_LV.value,
              evit = 1 * c.E_VIT.value,
              eint = 1 * c.E_INT.value,
              potr = 1 * c.POT_RLevel.value,
              isp = 1 * c.ISP.value,
              irp = 1 * c.IRP.value,
              rank_bonus = 1 * c.RNK_BNS.value,
              pot1 = 1 * c.PP.value,
              prate1 = m_Potion2[pot1][1],
              prate2 = m_Potion2[pot1][2],
              rank_bonus == 1 && (prate1 *= 1.5),
              rank_bonus == 1 && (prate2 *= 1.5),
              n_A_JOB == 33 &&
                ((pot2 = 1 * c.SPP.value),
                (prate3 = m_Potion3[pot2][1]),
                (prate4 = m_Potion3[pot2][2])),
              EquipNumSearch(EQUIPID.FRICCOS_SHOES) && (H_Bonus2 += 0.2),
              EquipNumSearch(EQUIPID.VITAL_TREE_SHOES) && (H_Bonus3 += 0.05),
              o = 8;
            o < 12;
            o++
          )
            n_A_Buf8[o] == 10 && EquipNumSearch(1e3) && (H_Bonus += 0.2);
          for (o = 8; o <= 9; o++)
            (n_A_card[o] == 332 && (H_Bonus += 0.3), n_A_card[o] == 513 && (H_Bonus += 0.03));
          ((n_A_Equip[9] != 844 && n_A_Equip[9] != 1753) || (H_Bonus += 0.05),
            (n_A_Equip[10] != 844 && n_A_Equip[10] != 1753) || (H_Bonus += 0.05),
            n_A_Equip[9] == 1111 && (H_Bonus += 0.05),
            n_A_Equip[10] == 1111 && (H_Bonus += 0.05),
            EquipNumSearch(EQUIPID.ERDE) && (H_Bonus += 0.1),
            EquipNumSearch(EQUIPID.ANUBIS_HAT) && (H_Bonus += 0.1),
            EquipNumSearch(EQUIPID.VITAL_TREE_SHOES) && (H_Bonus += 0.05),
            n_A_HEAD_REFINE >= 7 && EquipNumSearch(EQUIPID.CANCER_DIADEM) && (H_Bonus += 0.03),
            n_A_HEAD_REFINE >= 9 &&
              EquipNumSearch(EQUIPID.CAPRICORN_DIADEM_OLD) &&
              (H_Bonus += 0.04),
            n_A_HEAD_REFINE >= 9 && EquipNumSearch(EQUIPID.CAPRICORN_DIADEM) && (H_Bonus += 0.04),
            ((n_A_Equip[9] == 1111 && n_A_Equip[10] == 983) ||
              (n_A_Equip[10] == 1111 && n_A_Equip[9] == 983)) &&
              (H_Bonus += 0.05),
            EquipNumSearch(EQUIPID.GLORIOUS_SUIT) &&
              EquipNumSearch(EQUIPID.GLORIOUS_SHOES) &&
              EquipNumSearch(EQUIPID.GLORIOUS_MUFFLER) &&
              (H_Bonus += 0.03),
            EquipNumSearch(EQUIPID.ELITE_ENGINEERS_ARMOR) &&
              EquipNumSearch(EQUIPID.CAPTAINS_MANTEAU) &&
              EquipNumSearch(EQUIPID.BATTLE_GREAVES) &&
              (H_Bonus += 0.1),
            (H_HEALS = 1 + 0.1 * irp),
            (S_HEALS = 1 + 0.1 * isp),
            pot1 == 4
              ? ((potheal1 = Math.floor(
                  prate1 *
                    (1 + 0.1 * potr + 0.05 * pot1) *
                    (1 + slv / 100) *
                    (1 + 0.02 * eint) *
                    S_HEALS,
                )),
                (potheal2 = Math.floor(
                  prate2 *
                    (1 + 0.1 * potr + 0.05 * pot1) *
                    (1 + slv / 100) *
                    (1 + 0.02 * eint) *
                    S_HEALS,
                )))
              : ((potheal1 = Math.floor(
                  prate1 *
                    (1 + 0.1 * potr + 0.05 * pot1) *
                    (1 + slv / 100) *
                    (1 + 0.02 * evit) *
                    H_HEALS *
                    H_Bonus *
                    H_Bonus2 *
                    H_Bonus3,
                )),
                (potheal2 = Math.floor(
                  prate2 *
                    (1 + 0.1 * potr + 0.05 * pot1) *
                    (1 + slv / 100) *
                    (1 + 0.02 * evit) *
                    H_HEALS *
                    H_Bonus *
                    H_Bonus2 *
                    H_Bonus3,
                ))),
            n_A_JOB == 33 &&
              ((potheal3 = Math.floor(
                prate3 * (1 + 0.1 * potr + 0.1 * pot2) * (1 + 0.02 * evit) * H_HEALS * H_Bonus3,
              )),
              (potheal4 = Math.floor(
                prate4 * (1 + 0.1 * potr + 0.1 * pot2) * (1 + 0.02 * evit) * H_HEALS * H_Bonus3,
              ))),
            (Heal_POT =
              "<table><tr><td><b>Potion Pitcher heals: </b>" +
              potheal1 +
              " ~ " +
              potheal2 +
              "</td>"),
            n_A_JOB == 33 &&
              (Heal_POT += "<td><b>Slim Potion Pitch heals: </b>" + potheal3 + " ~ " + potheal4),
            (Heal_POT += "</td></tr></table>"),
            myInnerHtml("A_KakutyouData", Heal_POT, 0));
        } else myInnerHtml("A_KakutyouData", "", 0);
      else if (wKK == 24)
        switch (n_A_JOB) {
          case 12:
          case 26:
            ((smithing = 1 * c.A_SmithT.value),
              (orideconres = 1 * c.A_OriR.value),
              (weaponres = 1 * c.A_WepR.value),
              (starcrumb = 1 * c.A_StarC.value),
              (elemstone = 1 * c.A_ElemS.value),
              (anvil = 1 * c.A_KakutyouSelNum.value),
              (iron = 1 * c.A_Iron.value),
              (steel = 1 * c.A_Steel.value),
              (stone = 1 * c.A_StoneC.value),
              (anvil2 = m_Anvil[anvil][1]),
              (adopted = 1 * c.A_adopted.checked),
              (srate1 =
                Math.floor(
                  100 *
                    (50 +
                      5 * smithing +
                      weaponres +
                      anvil2 +
                      0.2 * n_A_JobLV +
                      0.1 * (n_A_DEX + n_A_LUK) -
                      15 * starcrumb -
                      20 * elemstone),
                ) / 100),
              (srate2 =
                Math.floor(
                  100 *
                    (50 +
                      5 * smithing +
                      weaponres +
                      anvil2 +
                      0.2 * n_A_JobLV +
                      0.1 * (n_A_DEX + n_A_LUK) -
                      15 * starcrumb -
                      20 * elemstone -
                      20),
                ) / 100),
              (srate3 =
                Math.floor(
                  100 *
                    (50 +
                      5 * smithing +
                      orideconres +
                      weaponres +
                      anvil2 +
                      0.2 * n_A_JobLV +
                      0.1 * (n_A_DEX + n_A_LUK) -
                      15 * starcrumb -
                      20 * elemstone -
                      30),
                ) / 100),
              (srate4 =
                Math.floor(100 * (40 + 0.2 * n_A_JobLV + 0.1 * (n_A_DEX + n_A_LUK) + 5 * iron)) /
                100),
              (srate5 =
                Math.floor(100 * (30 + 0.2 * n_A_JobLV + 0.1 * (n_A_DEX + n_A_LUK) + 5 * steel)) /
                100),
              (srate6 =
                Math.floor(100 * (10 + 0.2 * n_A_JobLV + 0.1 * (n_A_DEX + n_A_LUK) + 5 * stone)) /
                100),
              (srate1 < 0 || smithing == 0) && (srate1 = 0),
              (srate2 < 0 || smithing == 0) && (srate2 = 0),
              (srate3 < 0 || smithing == 0) && (srate3 = 0),
              (srate4 < 0 || iron == 0) && (srate4 = 0),
              (srate5 < 0 || steel == 0) && (srate5 = 0),
              (srate6 < 0 || stone == 0) && (srate6 = 0),
              adopted &&
                ((srate1 = Math.floor(0.7 * srate1 * 100) / 100),
                (srate2 = Math.floor(0.7 * srate2 * 100) / 100),
                (srate3 = Math.floor(0.7 * srate3 * 100) / 100)),
              (r = "<br><table><tr><td><b>Weapon Lvl 1: </b>" + srate1 + " %</td>"),
              (r += "<td><b>Weapon Lvl 2: </b>" + srate2 + " %</td>"),
              (r += "<td><b>Weapon Lvl 3: </b>" + srate3 + " %</td></tr>"),
              (r += "<tr><td><b>Iron: </b>" + srate4 + " %</td>"),
              (r += "<td><b>Steel: </b>" + srate5 + " %</td>"),
              (r += "<td><b>Elemental Stone: </b>" + srate6 + " %</td></tr></table>"),
              myInnerHtml("A_KakutyouData", r, 0));
            break;
          case 19:
          case 33:
            ((potionr = 1 * c.A_PotionRLevel.value),
              (vani = 1 * c.A_Van.value),
              (preparep = 1 * c.A_PreparePLevel.value),
              (selpot = 1 * c.A_KakutyouSelNum.value),
              (potrate = m_Potion[selpot][1]),
              (adopted = 1 * c.A_adopted.checked),
              (srate =
                Math.floor(
                  100 * potionr +
                    300 * preparep +
                    20 * n_A_JobLV +
                    10 * (n_A_DEX + n_A_LUK) +
                    5 * n_A_INT +
                    100 * potrate +
                    100 * vani,
                ) / 100),
              (srate < 0 || potionr == 0 || preparep == 0) && (srate = 0),
              adopted && (srate = Math.floor(0.7 * srate)),
              (brate = m_Potion[selpot][3]),
              (frate1 = Math.floor(100 * (srate - brate)) / 100),
              frate1 < 0 && (frate1 = 0),
              (frate2 = Math.floor(100 * (srate + brate)) / 100),
              frate2 < 0 && (frate2 = 0),
              myInnerHtml(
                "A_KakutyouData",
                "<b><br>Sucess rate: </b>" + srate + " % [ " + frate1 + " % ~ " + frate2 + " % ]",
                0,
              ));
            break;
          case 22:
            (myInnerHtml(
              "A_KakutyouSel",
              'Potion to Create: <select name="A_KakutyouSelNum" onChange="StAllCalc()"></select><BR>',
              0,
            ),
              (documento.calcForm.A_KakutyouSelNum.options[0] = new documento.Opzione(
                "Poison Bottle",
                0,
              )),
              (srate = Math.floor(200 + 4 * n_A_DEX + 2 * n_A_LUK) / 10),
              myInnerHtml("A_KakutyouData", "<b><br>Sucess rate: </b>" + srate + " %", 0));
            break;
          default:
            myInnerHtml("A_KakutyouData", "", 0);
        }
      else if (wKK == 26)
        ((r = ""),
          (n_A_JobClass() == 2 ||
            EquipNumSearch(EQUIPID.ANNIVERSARY_THIEF_HAT) ||
            CardNumSearch(152)) &&
            ((E_DEX1 = 1 * c.E_DEX.value),
            (StealLV = 1 * c.Steal_LV.value),
            (DropC = 1 * c.DropChance.value),
            (StealC = Math.round(DropC * (10 + 3 * StealLV + n_A_DEX - E_DEX1)) / 100),
            myInnerHtml("Steal_CHANCE", StealC + " %", 0),
            (n_A_JOB != 14 && n_A_JOB != 28) ||
              ((SmugLV = 1 * c.Steal_LV.value),
              (SmugC = Math.round(DropC * (10 + 3 * SmugLV + n_A_DEX - E_DEX1)) / 100),
              myInnerHtml("Smug_CHANCE", SmugC + " %", 0))),
          myInnerHtml("A_KakutyouData", "", 0));
      else if (wKK == 28)
        ((CardNumSearch(157) ||
          CardNumSearch(413) ||
          EquipNumSearch(EQUIPID.DRILL_KATAR) ||
          n_A_JOB == 14 ||
          n_A_JOB == 28 ||
          n_A_JOB == 45) &&
          ((E_DEX1 = 1 * c.E_DEX.value),
          (n_A_JOB != 14 && n_A_JOB != 28 && n_A_JOB != 45) ||
            ((S_LV1 = 1 * c.S_LV.value),
            (Strip = 5 + 5 * S_LV1 + (n_A_DEX - E_DEX1) / 5),
            (S_Time = 60 + 15 * S_LV1 + (n_A_DEX - E_DEX1) / 2),
            Strip < 5 + 5 * S_LV1 && (Strip = 5 + 5 * S_LV1),
            S_Time < 60 && (S_Time = 60),
            myInnerHtml("S_CHANCE", Math.floor(10 * Strip) / 10 + " %", 0),
            myInnerHtml("S_TIME", Math.floor(10 * S_Time) / 10 + " seconds", 0)),
          n_A_JOB == 28 &&
            ((FS_LV1 = 1 * c.FS_LV.value),
            (FStrip = 5 + 2 * FS_LV1 + (n_A_DEX - E_DEX1) / 5),
            (FS_Time = 60 + 15 * FS_LV1 + (n_A_DEX - E_DEX1) / 2),
            FStrip < 5 + 2 * FS_LV1 && (FStrip = 5 + 2 * FS_LV1),
            FS_Time < 60 && (FS_Time = 60),
            myInnerHtml("FS_CHANCE", Math.floor(10 * FStrip) / 10 + " %", 0),
            myInnerHtml("FS_TIME", Math.floor(10 * FS_Time) / 10 + " seconds", 0)),
          CardNumSearch(157) &&
            ((S_LV1 = 1 * c.S2_LV.value),
            (Strip = 5 + 5 * S_LV1 + (n_A_DEX - E_DEX1) / 5),
            (S_Time = 60 + 15 * S_LV1 + (n_A_DEX - E_DEX1) / 2),
            Strip < 5 + 5 * S_LV1 && (Strip = 5 + 5 * S_LV1),
            S_Time < 60 && (S_Time = 60),
            myInnerHtml("S2_CHANCE", Math.floor(10 * Strip) / 10 + " %", 0),
            myInnerHtml("S2_TIME", Math.floor(10 * S_Time) / 10 + " seconds", 0)),
          CardNumSearch(413) &&
            ((S_LV1 = 1 * c.S3_LV.value),
            (Strip = 5 + 5 * S_LV1 + (n_A_DEX - E_DEX1) / 5),
            (S_Time = 60 + 15 * S_LV1 + (n_A_DEX - E_DEX1) / 2),
            Strip < 5 + 5 * S_LV1 && (Strip = 5 + 5 * S_LV1),
            S_Time < 60 && (S_Time = 60),
            myInnerHtml("S3_CHANCE", Math.floor(10 * Strip) / 10 + " %", 0),
            myInnerHtml("S3_TIME", Math.floor(10 * S_Time) / 10 + " seconds", 0)),
          EquipNumSearch(EQUIPID.DRILL_KATAR) &&
            ((FS_LV1 = 1 * c.FS2_LV.value),
            (FStrip = 5 + 2 * FS_LV1 + (n_A_DEX - E_DEX1) / 5),
            (FS_Time = 60 + 15 * FS_LV1 + (n_A_DEX - E_DEX1) / 2),
            FStrip < 5 + 2 * FS_LV1 && (FStrip = 5 + 2 * FS_LV1),
            FS_Time < 60 && (FS_Time = 60),
            myInnerHtml("FS2_CHANCE", Math.floor(10 * FStrip) / 10 + " %", 0),
            myInnerHtml("FS2_TIME", Math.floor(10 * FS_Time) / 10 + " seconds", 0))),
          myInnerHtml("A_KakutyouData", "", 0));
      else if (wKK == 30)
        ((Flv1 = 1 * c.Flv.value),
          (FStat1 = 1 * c.FStat.value),
          (CKit1 = 1 * c.CKit.value),
          (CExp1 = 1 * c.CExp.value),
          (adopted = 1 * c.A_adopted.checked),
          (ItemN = 1),
          CExp1 > 2e3 && (CExp1 = 2e3),
          adopted ? (adp = 0.7) : (adp = 1),
          Flv1 == 1 && FStat1 == 4 && (ItemN = 2),
          ((Flv1 == 1 && FStat1 != 4) ||
            (Flv1 == 2 && FStat1 == 4) ||
            (Flv1 == 3 && FStat1 == 4)) &&
            (ItemN = 3),
          ((Flv1 == 2 && FStat1 != 4) ||
            (Flv1 == 3 && (FStat1 == 2 || FStat1 == 3 || FStat1 == 6)) ||
            (Flv1 == 6 && FStat1 == 2)) &&
            (ItemN = 4),
          ((Flv1 == 3 && (FStat1 == 1 || FStat1 == 5)) ||
            (Flv1 == 4 && (FStat1 != 1 || FStat1 != 5)) ||
            (Flv1 == 5 && FStat1 != 5) ||
            (Flv1 == 6 && (FStat1 != 2 || FStat1 != 5)) ||
            (Flv1 == 7 && FStat1 == 4)) &&
            (ItemN = 5),
          ((Flv1 == 4 && (FStat1 == 4 || FStat1 == 5)) ||
            (Flv1 == 5 && FStat1 == 5) ||
            (Flv1 == 6 && FStat1 == 5) ||
            (Flv1 == 7 && FStat1 != 4) ||
            (Flv1 == 8 && FStat1 != 5)) &&
            (ItemN = 6),
          ((Flv1 == 8 && FStat1 == 5) || Flv1 == 9) && (ItemN = 7),
          Flv1 == 10 && (ItemN = 8),
          (Food_Powa =
            1200 * (CKit1 + 1) +
            20 * (n_A_BaseLV + 1) +
            20 * n_A_DEX -
            400 * Flv1 -
            10 * (100 - (n_A_LUK + 1)) -
            500 * (ItemN - 1)),
          (Food_MIN = Math.round(Food_Powa + 100 * (6 + CExp1 / 80 + 0) * adp) / 100),
          (Food_AVG = Math.round(Food_Powa + 100 * (6 + CExp1 / 80 + 12) * adp) / 100),
          (Food_MAX = Math.round(Food_Powa + 100 * (6 + CExp1 / 80 + 24) * adp) / 100),
          (FDA1 = Math.round(100 * (Food_MIN - 5)) / 100),
          (FDA2 = Math.round(100 * (Food_MIN - 1)) / 100),
          (FDB1 = Math.round(100 * (Food_AVG - 5)) / 100),
          (FDB2 = Math.round(100 * (Food_AVG - 1)) / 100),
          (FDC1 = Math.round(100 * (Food_MAX - 5)) / 100),
          (FDC2 = Math.round(100 * (Food_MAX - 1)) / 100),
          Food_MIN <= 0 && ((Food_MIN = 0), (FDA1 = 0), (FDA2 = 0)),
          FDA1 <= 0 && (FDA1 = 0),
          FDA2 <= 0 && ((FDA1 = 0), (FDA2 = 0)),
          Food_AVG <= 0 && ((Food_AVG = 0), (FDB1 = 0), (FDB2 = 0)),
          FDB1 <= 0 && (FDB1 = 0),
          FDB2 <= 0 && ((FDB1 = 0), (FDB2 = 0)),
          Food_MAX <= 0 && ((Food_MAX = 0), (FDC1 = 0), (FDC2 = 0)),
          FDC1 <= 0 && (FDC1 = 0),
          FDC2 <= 0 && ((FDC1 = 0), (FDC2 = 0)),
          Food_MIN > 100 && (Food_MIN = 100),
          FDA1 > 100 && (FDA1 = 100),
          FDA2 > 100 && (FDA2 = 100),
          Food_AVG > 100 && (Food_AVG = 100),
          FDB1 > 100 && (FDB1 = 100),
          FDB2 > 100 && (FDB2 = 100),
          Food_MAX > 100 && (Food_MAX = 100),
          FDC1 > 100 && (FDC1 = 100),
          FDC2 > 100 && (FDC2 = 100),
          CKit1 == 4
            ? (myInnerHtml("COOK_MIN", "100%", 0),
              myInnerHtml("COOK_AVE", "", 0),
              myInnerHtml("COOK_MAX", "", 0))
            : (myInnerHtml(
                "COOK_MIN",
                "Minimum: " + Food_MIN + "% [" + FDA1 + "% ~ " + FDA2 + "%]",
                0,
              ),
              myInnerHtml(
                "COOK_AVE",
                "Average: " + Food_AVG + "% [" + FDB1 + "% ~ " + FDB2 + "%]",
                0,
              ),
              myInnerHtml(
                "COOK_MAX",
                "Maximum: " + Food_MAX + "% [" + FDC1 + "% ~ " + FDC2 + "%]",
                0,
              )),
          myInnerHtml("A_KakutyouData", "", 0));
      else if (wKK == 32) {
        var X = 1 * c.Pet.value,
          Z = 1 * c.PetHP.value,
          x =
            Math.round(
              ((m_Pets[0][X] + 30 * (n_A_BaseLV - m_Monster[X][5]) + 20 * n_A_LUK) *
                (100 - (Z - 100))) /
                100,
            ) / 100;
        (x < 0 && (x = 0),
          (r = "<HR><table><tr><td>Chance to pet: " + x + " %</td></tr></table>"),
          myInnerHtml("A_KakutyouData", r, 0));
      } else if (wKK == 34) {
        refinetype = [
          [
            [1, 1, 1, 1, 1, 1, 1, 0.6, 0.24, 0.048],
            [1, 1, 1, 1, 1, 1, 0.6, 0.24, 0.048, 0.0096],
            [1, 1, 1, 1, 1, 0.6, 0.3, 0.06, 0.012, 0.0024],
            [1, 1, 1, 1, 0.6, 0.24, 0.096, 0.0192, 0.00384, 384e-6],
            [1, 1, 1, 1, 0.6, 0.24, 0.096, 0.0192, 0.00384, 384e-6],
          ],
          [
            [1, 1, 1, 1, 1, 1, 1, 0.9, 0.54, 0.108],
            [1, 1, 1, 1, 1, 1, 0.9, 0.54, 0.162, 0.0324],
            [1, 1, 1, 1, 1, 0.9, 0.675, 0.2025, 0.06075, 0.0121],
            [1, 1, 1, 1, 0.9, 0.54, 0.324, 0.0972, 0.02916, 0.002916],
            [1, 1, 1, 1, 0.9, 0.54, 0.324, 0.0972, 0.02916, 0.002916],
          ],
          [
            [
              0.9, 0.81, 0.729, 0.6561, 0.52488, 0.419904, 0.2519424, 0.15116544, 0.060466176,
              0.0120932352,
            ],
            [
              0.9, 0.81, 0.729, 0.5832, 0.46656, 0.279936, 0.1679616, 0.06718464, 0.013436928,
              0.0026873856,
            ],
            [
              0.9, 0.81, 0.648, 0.5184, 0.31104, 0.186624, 0.093312, 0.0186624, 0.00373248,
              746496e-9,
            ],
            [
              0.9, 0.72, 0.576, 0.3456, 0.20736, 0.082944, 0.0331776, 0.00663552, 0.001327104,
              0.0001327104,
            ],
            [
              0.8, 0.64, 0.512, 0.3072, 0.18432, 0.073728, 0.0294912, 0.00589824, 0.001179648,
              0.0001179648,
            ],
          ],
          [
            [1, 1, 1, 1, 1, 1, 1, 0.6, 0.24, 0.048],
            [1, 1, 1, 1, 1, 1, 0.6, 0.24, 0.048, 0.0096],
            [1, 1, 1, 1, 1, 0.6, 0.3, 0.06, 0.012, 0.0024],
            [1, 1, 1, 1, 0.6, 0.24, 0.096, 0.0192, 0.00384, 384e-6],
            [1, 1, 1, 1, 0.6, 0.24, 0.096, 0.0192, 0.00384, 384e-6],
          ],
        ];
        var y = 1 * c.EquipValue.value,
          P = 1 * c.EquipType.value,
          $ = 1 * c.OreType.value,
          __ = 1 * c.OreValue.value,
          W = 1 * c.npcCost.value,
          Q = 1 * c.DesiredRefine.value,
          z = refinetype[$][P][Q - 1],
          e_ = Math.round((y + (__ + W) * Q) / z) - y;
        ((r =
          "<HR><table><tr><td>Chance to refine up to +" +
          Q +
          " = " +
          Math.round(1e6 * z) / 1e4 +
          " %</td></tr>"),
          (r += "<tr><td>Mean investment = " + e_ + " zeny</td></tr></table>"),
          myInnerHtml("A_KakutyouData", r, 0));
      } else if (wKK == 36) {
        y = 1 * c.EquipValue.value;
        var a_ = 1 * c.ItemValue.value,
          n_ = ((W = 1 * c.npcCost.value), 1 * c.SocketChance.value);
        ((r =
          "<HR><table><tr><td>Mean investment = " +
          Math.round((y + a_ + W) / (n_ / 100)) +
          " zeny</td></tr></table>"),
          myInnerHtml("A_KakutyouData", r, 0));
      } else
        wKK == 38
          ? ((hiddentype = [
              [0.2, 0.4, 0.0667, 0.2667, 0.0444, 0.1333, 0.0222],
              [0.28, 0.36, 0.06, 0.24, 0.04, 0.12, 0.02],
              [0.3333, 0.3333, 0.0555, 0.2222, 0.037, 0.1111, 0.0185],
            ]),
            (y = 1 * c.EquipValue.value),
            (P = 1 * c.EquipType.value),
            (W = 1 * c.npcCost.value),
            (r =
              '<HR><table style="text-align:right;"><tr><td></td><td class=title>Chance to get</td><td class=title>Mean zeny cost</td></tr>'),
            (r +=
              "<tr><td>Any +1 stat enchant</td><td>" +
              (1e6 * hiddentype[P][1]) / 1e4 +
              " %</td><td>" +
              Math.round((y + W) / hiddentype[P][1]) +
              "</td></tr>"),
            (r +=
              "<tr><td>Specific +1 stat enchant</td><td>" +
              (1e6 * hiddentype[P][2]) / 1e4 +
              " %</td><td>" +
              Math.round((y + W) / hiddentype[P][2]) +
              "</td></tr>"),
            (r +=
              "<tr><td>Any +2 stat enchant</td><td>" +
              (1e6 * hiddentype[P][3]) / 1e4 +
              " %</td><td>" +
              Math.round((y + W) / hiddentype[P][3]) +
              "</td></tr>"),
            (r +=
              "<tr><td>Specific +2 stat enchant</td><td>" +
              (1e6 * hiddentype[P][4]) / 1e4 +
              " %</td><td>" +
              Math.round((y + W) / hiddentype[P][4]) +
              "</td></tr>"),
            (r +=
              "<tr><td>Any +3 stat enchant</td><td>" +
              (1e6 * hiddentype[P][5]) / 1e4 +
              " %</td><td>" +
              Math.round((y + W) / hiddentype[P][5]) +
              "</td></tr>"),
            (r +=
              "<tr><td>Specific +3 stat enchant</td><td>" +
              (1e6 * hiddentype[P][6]) / 1e4 +
              " %</td><td>" +
              Math.round((y + W) / hiddentype[P][6]) +
              "</td></tr>"),
            (r +=
              "<tr><td>Break</td><td>" + (1e6 * hiddentype[P][0]) / 1e4 + " %</td><td></td></tr>"),
            (r += "</table>"),
            myInnerHtml("A_KakutyouData", r, 0))
          : wKK == 40 &&
            (n_A_JOB == 19 || n_A_JOB == 33
              ? ((Amistr = n_A_STR + n_A_AGI + n_A_VIT),
                (Filir = n_A_STR + n_A_AGI + n_A_LUK),
                (Vanilmirth = n_A_INT + n_A_DEX + n_A_LUK),
                (Lif = n_A_VIT + n_A_INT + n_A_DEX),
                (homontotal = Amistr + Filir + Vanilmirth + Lif),
                (Amistr = (Amistr / homontotal) * 100),
                (Filir = (Filir / homontotal) * 100),
                (Vanilmirth = (Vanilmirth / homontotal) * 100),
                (Lif = (Lif / homontotal) * 100),
                (r =
                  "<table><tr><td>Chance to get Amistr: </td><td>" +
                  Math.floor(10 * Amistr) / 10 +
                  " %</td></tr>"),
                (r +=
                  "<tr><td>Chance to get Filir: </td><td>" +
                  Math.floor(10 * Filir) / 10 +
                  " %</td></tr>"),
                (r +=
                  "<tr><td>Chance to get Vanilmirth: </td><td>" +
                  Math.floor(10 * Vanilmirth) / 10 +
                  " %</td></tr>"),
                (r +=
                  "<tr><td>Chance to get Lif: </td><td>" +
                  Math.floor(10 * Lif) / 10 +
                  " %</td></tr></table>"))
              : (r = '<p class="center">Not available for this class.</p>'),
            myInnerHtml("A_KakutyouData", r, 0));
  } else myInnerHtml("A_KakutyouData", "", 0);
}
function Kanma(l) {
  var A = "",
    n = new Array();
  l < 0 && ((l *= -1), (A += "-"));
  for (var s = 0; Math.floor(l / 1e3) != 0; s++) {
    var _ = l % 1e3;
    ((n[s] = _ == 0 ? ",000" : _ < 10 ? ",00" + _ : _ < 100 ? ",0" + _ : "," + _),
      (l = Math.floor(l / 1e3)));
  }
  for (n[s] = l; s >= 0;) ((A += n[s]), s--);
  return A;
}
function NonDamageSkillCastMultiplier(l, A) {
  var n = A & 1 ? 1 : Math.max(0, 1 - n_A_DEX / 150),
    s = n_B_Cast;
  (A & 2 && nb_tok < 100 && (s /= 1 - nb_tok / 100), (n *= s / 100));
  var _ = 100 - StPlusCalc2(7e3 + l) - StPlusCard(7e3 + l);
  return (
    _ < 0 && (_ = 0),
    (n *= _ / 100),
    A & 2 ||
      (n_A_Buf2[10] && (n *= (100 - 15 * n_A_Buf2[10]) / 100),
      SkillSearch(SKILLID.MEMORIZE) && (n /= 2)),
    Math.max(0, n)
  );
}
function NonDamageCastSkillChanged(l) {
  var A = documento.getElementById("NonDamageCastSkill"),
    n = documento.getElementById("NonDamageCastSkillLevel");
  if (A && n) {
    var s = 1 * A.value;
    n.length = 0;
    for (var _ = 1; _ <= m_Skill[s][1]; _++) n.options[_ - 1] = new documento.Opzione(_, _);
    ((n.value = m_Skill[s][1]), l && StAllCalc());
  }
}
function KakutyouKansuu2() {
  if (((wKK = 1 * c.A_Kakutyou.value), wKK == 40)) {
    var l =
      '<table><tr><td class="right">Skill:</td><td><select id="NonDamageCastSkill" name="NonDamageCastSkill" onChange="NonDamageCastSkillChanged(1)"></select></td></tr>';
    ((l +=
      '<tr><td class="right">Skill level:</td><td><select id="NonDamageCastSkillLevel" name="NonDamageCastSkillLevel" onChange="StAllCalc()"></select></td></tr></table>'),
      myInnerHtml("A_KakutyouSel", l, 0));
    var A = documento.getElementById("NonDamageCastSkill"),
      n = Object.keys(m_NonDamageSkillCast);
    n.sort(function (E, S) {
      return skillNameInSelect(1 * E).localeCompare(skillNameInSelect(1 * S));
    });
    for (var s = 0; s < n.length; s++) {
      var _ = 1 * n[s];
      A.options[s] = new documento.Opzione(skillNameInSelect(_), _);
    }
    ((A.value = SKILLID.ASSUMPTIO), NonDamageCastSkillChanged(0));
    return;
  }
  if (wKK == 6) {
    if (n_A_JobClass() == 1 || n_A_JOB == 20) {
      for (
        HPRname =
          'Increase HP Recovery Lvl: <select name="A_KakutyouSelNum" onChange="StAllCalc()"></select>',
          n_A_JOB == 20
            ? (HPRname +=
                '<br>Increase SP Recovery Lvl: <select name="A_KakutyouSelNumSP" onChange="StAllCalc()"></select>')
            : EquipNumSearch(EQUIPID.BEER_HAT) &&
              (HPRname +=
                '<br>Increase SP Recovery Lvl: <select name="A_KakutyouSelNumSP" onChange="StAllCalc()"><option value="3">3</option></select>'),
          myInnerHtml("A_KakutyouSel", HPRname, 0),
          i = 0;
        i <= 10;
        i++
      )
        c.A_KakutyouSelNum.options[i] = new documento.Opzione(i, i);
      if (((c.A_KakutyouSelNum.value = 10), n_A_JOB == 20)) {
        for (i = 0; i <= 10; i++) c.A_KakutyouSelNumSP.options[i] = new documento.Opzione(i, i);
        c.A_KakutyouSelNumSP.value = 10;
      }
      return;
    }
    if (n_A_JobClass() == 5 || n_A_JOB == 9 || n_A_JOB == 23 || n_A_JOB == 44) {
      for (
        SPRname = "Increase SP Recovery Lvl: ",
          n_A_JOB == 44 && (SPRname = "Ninja Mastery Lvl: "),
          SPRname += '<select name="A_KakutyouSelNum" onChange="StAllCalc()"></select>',
          EquipNumSearch(EQUIPID.BEER_HAT) &&
            (SPRname +=
              '<br>Increase HP Recovery Lvl: <select name="A_KakutyouSelNumHP" onChange="StAllCalc()"><option value="3">3</option></select>'),
          myInnerHtml("A_KakutyouSel", SPRname, 0),
          i = 0;
        i <= 10;
        i++
      )
        c.A_KakutyouSelNum.options[i] = new documento.Opzione(i, i);
      return void (c.A_KakutyouSelNum.value = 10);
    }
    return EquipNumSearch(EQUIPID.BEER_HAT)
      ? ((a =
          'Increase HP Recovery Lvl: <select name="A_KakutyouSelNumHP" onChange="StAllCalc()"><option value="3">3</option></select><br>'),
        (a +=
          'Increase SP Recovery Lvl: <select name="A_KakutyouSelNumSP" onChange="StAllCalc()"><option value="3">3</option></select><br>'),
        void myInnerHtml("A_KakutyouSel", a, 0))
      : void myInnerHtml("A_KakutyouSel", '<p class="center">Not available for this class.</p>', 0);
  }
  if (wKK != 7)
    if (wKK != 8)
      if (wKK != 10)
        if (wKK != 14) {
          var a;
          if (wKK == 20)
            return (
              (a =
                'Current Base Exp <input type="tel" name="A_KakutyouSelNum" value="0" size=4 onkeyup="StAllCalc()" style="text-align: right;">%<BR>'),
              (a +=
                'Current Job Exp <input type="tel" name="A_KakutyouSelNum2" value="0" size=4 onkeyup="StAllCalc()" style="text-align: right;">%<BR>'),
              void myInnerHtml("A_KakutyouSel", a, 0)
            );
          if (wKK != 22)
            if (wKK != 24) {
              if (wKK != 26) {
                if (wKK != 28)
                  if (wKK != 30)
                    if (wKK != 32)
                      if (wKK != 34)
                        if (wKK != 36) {
                          if (wKK == 38)
                            return (
                              (a =
                                '<table style="text-align:right;"><tr><td>Equipment zeny value:</td><td><input type="text" name="EquipValue" onkeyup="StAllCalc()" value="0" size="9" class="center"></td></tr>'),
                              (a +=
                                '<tr><td>Equipment type:</td><td><select name="EquipType" onChange="StAllCalc()"><option value="0">Non slotted</option><option value="1">Slotted</option><option value="2">Special</option></select></td></tr>'),
                              (a +=
                                '<tr><td>Enchanting zeny cost:</td><td><input type="text" name="npcCost" onkeyup="StAllCalc()" value="0" size="6" class="center"></td></tr></table>'),
                              void myInnerHtml("A_KakutyouSel", a, 0)
                            );
                          myInnerHtml("A_KakutyouSel", "", 0);
                        } else {
                          for (
                            a =
                              '<table style="text-align:right;"><tr><td>Equipment zeny value:</td><td class=left><input type="text" name="EquipValue" onkeyup="StAllCalc()" value="0" size="9" class="center"></td></tr>',
                              a +=
                                '<tr><td>Used item zeny value:</td><td class=left><input type="text" name="ItemValue" onkeyup="StAllCalc()" value="0" size="6" class="center"></td></tr>',
                              a +=
                                '<tr><td>Enchanting zeny cost:</td><td class=left><input type="text" name="npcCost" onkeyup="StAllCalc()" value="0" size="6" class="center"></td></tr>',
                              a +=
                                '<tr><td>Enchanting success chance:</td><td class=left><select name="SocketChance" onChange="StAllCalc()"></select></td></tr></table>',
                              myInnerHtml("A_KakutyouSel", a, 0),
                              i = 1;
                            i <= 100;
                            i++
                          )
                            c.SocketChance.options[i - 1] = new documento.Opzione(i + " %", i);
                          c.SocketChance.value = 1;
                        }
                      else {
                        for (
                          a =
                            '<table style="text-align:right;"><tr><td>Equipment zeny value:</td><td class=left><input type="text" name="EquipValue" onkeyup="StAllCalc()" value="0" size="9" class="center"></td></tr>',
                            a +=
                              '<tr><td>Equipment type:</td><td class=left><select name="EquipType" onChange="StAllCalc()"><option value="0">Weapon Lvl 1</option><option value="1">Weapon Lvl 2</option><option value="2">Weapon Lvl 3</option><option value="3">Weapon Lvl 4</option><option value="4">Armor</option></select></td></tr>',
                            a +=
                              '<tr><td>Ore type:</td><td class=left><select name="OreType" onChange="StAllCalc()"><option value="0">Normal Ores</option><option value="1">Enriched Ores</option><option value="2">Normal Ores (F2P server)</option><option value="3">Enriched Ores (F2P server)</option></select></td></tr>',
                            a +=
                              '<tr><td>Ore zeny value:</td><td class=left><input type="text" name="OreValue" onkeyup="StAllCalc()" value="0" size="4" class="center"></td></tr>',
                            a +=
                              '<tr><td>Refining zeny cost:</td><td class=left><input type="text" name="npcCost" onkeyup="StAllCalc()" value="0" size="4" class="center"></td></tr>',
                            a +=
                              '<tr><td>Desired refine:</td><td class=left><select name="DesiredRefine" onChange="StAllCalc()"></select></td></tr></table>',
                            myInnerHtml("A_KakutyouSel", a, 0),
                            i = 1;
                          i <= 10;
                          i++
                        )
                          c.DesiredRefine.options[i - 1] = new documento.Opzione("+" + i, i);
                        c.DesiredRefine.value = 1;
                      }
                    else {
                      for (
                        a =
                          '<table style="text-align:right;"><tr><td>Monster to pet:</td><td class=left><select name="Pet" onChange="StAllCalc()"></select></td></tr>',
                          a +=
                            '<tr><td>Monster remaining HP:</td><td class=left><select name="PetHP" onChange="StAllCalc()"></select></td></tr>',
                          myInnerHtml("A_KakutyouSel", a, 0),
                          i = 0;
                        i <= 55;
                        i++
                      )
                        c.Pet.options[i] = new documento.Opzione(m_Monster[m_Pets[1][i]][1], i);
                      for (c.Pet.value = 0, i = 0; i <= 100; i++)
                        c.PetHP.options[i] = new documento.Opzione(i + " %", i);
                      c.PetHP.value = 100;
                    }
                  else {
                    for (
                      a =
                        '<table><tr><td>Level of the Food:</td><td><select name="Flv" onChange="StAllCalc()"></select></td><td class="title">Success Rate</td></tr>',
                        a +=
                          '<tr><td>Stat of the Food:</td><td><select name="FStat" onChange="StAllCalc()"></select></td><td class="center"><span id="COOK_MIN"></span></td></tr>',
                        a +=
                          '<tr><td>Cooking Kit Used:</td><td><select name="CKit" onChange="StAllCalc()" style="width:130px;"></select></td><td class="center"><span id="COOK_AVE"></span></td></tr>',
                        a +=
                          '<tr><td>Cooking Experience:</td><td><input type="text" onkeyup="StAllCalc()" name="CExp" value="0" size=2></td><td class="center"><span id="COOK_MAX"></span></td></tr></table>',
                        myInnerHtml("A_KakutyouSel", a, 0),
                        i = 1;
                      i <= 10;
                      i++
                    )
                      c.Flv.options[i - 1] = new documento.Opzione(i, i);
                    for (c.Flv.value = 10, i = 0; i <= 5; i++)
                      c.FStat.options[i] = new documento.Opzione(m_Stat_Food[i][1], i);
                    for (c.FStat.value = 0, i = 0; i < Cook_Kit_Max; i++)
                      c.CKit.options[i] = new documento.Opzione(m_Cook_Kit[i][1], i);
                    c.CKit.value = 0;
                  }
                else if (
                  ((a = ""),
                  CardNumSearch(157) ||
                  CardNumSearch(413) ||
                  EquipNumSearch(EQUIPID.DRILL_KATAR) ||
                  n_A_JOB == 14 ||
                  n_A_JOB == 28 ||
                  n_A_JOB == 45
                    ? ((a +=
                        '<table><tr><td>Enemy DEX: <select name="E_DEX" onChange="StAllCalc()"></select></td><td class="title">Skill Lvl</td><td class="title">Chance</td><td class="title">Duration Time</td></tr>'),
                      (n_A_JOB != 14 && n_A_JOB != 28) ||
                        (a +=
                          '<tr class="center"><td>' +
                          skillName(538) +
                          ' Helm, Armor, Weapon or Shield</td><td><select name="S_LV" onChange="StAllCalc()"></select></td><td><span id="S_CHANCE"></span></td><td><span id="S_TIME"></span></td></tr>'),
                      n_A_JOB == 28 &&
                        (a +=
                          '<tr class="center"><td>' +
                          skillName(440) +
                          '</td><td><select name="FS_LV" onChange="StAllCalc()"></select></td><td><span id="FS_CHANCE"></span></td><td><span id="FS_TIME"></span></td></tr>'),
                      n_A_JOB == 45 &&
                        (a +=
                          '<tr class="center"><td>Disarm</td><td><select name="S_LV" onChange="StAllCalc()"></select></td><td><span id="S_CHANCE"></span></td><td><span id="S_TIME"></span></td></tr>'),
                      CardNumSearch(157) &&
                        (a +=
                          '<tr class="center"><td>' +
                          skillName(172) +
                          ' (Auto-Casted)</td><td><select name="S2_LV" onChange="StAllCalc()"><option value="1">1</option></select></td><td><span id="S2_CHANCE"></span></td><td><span id="S2_TIME"></span></td></tr>'),
                      CardNumSearch(413) &&
                        (a +=
                          '<tr class="center"><td>' +
                          skillName(174) +
                          ' (Auto-Casted)</td><td><select name="S3_LV" onChange="StAllCalc()"></select></td><td><span id="S3_CHANCE"></span></td><td><span id="S3_TIME"></span></td></tr>'),
                      EquipNumSearch(EQUIPID.DRILL_KATAR) &&
                        (a +=
                          '<tr class="center"><td>' +
                          skillName(440) +
                          ' (Auto-Casted)</td><td><select name="FS2_LV" onChange="StAllCalc()"><option value="1">1</option></select></td><td><span id="FS2_CHANCE"></span></td><td><span id="FS2_TIME"></span></td></tr>'),
                      (a += "</table>"),
                      myInnerHtml("A_KakutyouSel", a, 0))
                    : myInnerHtml(
                        "A_KakutyouSel",
                        '<p class="center">Not available for this class.</p>',
                        0,
                      ),
                  CardNumSearch(157) ||
                    CardNumSearch(413) ||
                    EquipNumSearch(EQUIPID.DRILL_KATAR) ||
                    n_A_JOB == 14 ||
                    n_A_JOB == 28 ||
                    n_A_JOB == 45)
                ) {
                  for (i = 0; i <= 200; i++) c.E_DEX.options[i] = new documento.Opzione(i, i);
                  if (((c.E_DEX.value = 0), n_A_JOB == 14 || n_A_JOB == 28 || n_A_JOB == 45)) {
                    for (i = 1; i <= 5; i++) c.S_LV.options[i - 1] = new documento.Opzione(i, i);
                    c.S_LV.value = 1;
                  }
                  if (n_A_JOB == 28) {
                    for (i = 1; i <= 5; i++) c.FS_LV.options[i - 1] = new documento.Opzione(i, i);
                    c.FS_LV.value = 1;
                  }
                  CardNumSearch(413) &&
                    (CardNumSearch(113) &&
                    CardNumSearch(295) &&
                    CardNumSearch(391) &&
                    CardNumSearch(260) &&
                    (n_A_JOB == 14 || n_A_JOB == 28)
                      ? (c.S3_LV.options[0] = new documento.Opzione("5", 5))
                      : (c.S3_LV.options[0] = new documento.Opzione("1", 1)));
                }
              } else if (
                ((a =
                  '<table><tr><td>Enemy DEX: <select name="E_DEX" onChange="StAllCalc()"></select></td><td></td><td></td></tr>'),
                (a +=
                  '<tr><td>Monster Item Drop Chance: <input type="text" name="DropChance" onkeyup="StAllCalc()" value="0" size="4" class="center">%</td><td class="title">Skill Lvl</td><td class="title">Chance</td></tr>'),
                n_A_JobClass() == 2 ||
                EquipNumSearch(EQUIPID.ANNIVERSARY_THIEF_HAT) ||
                CardNumSearch(152)
                  ? ((a +=
                      '<tr class="center"><td style="text-align:right;">Steal</td><td><select name="Steal_LV" onChange="StAllCalc()"></select></td><td><span id="Steal_CHANCE"></span></td></tr>'),
                    (n_A_JOB != 14 && n_A_JOB != 28) ||
                      (a +=
                        '<tr class="center"><td style="text-align:right;">Smug</td><td><select name="Smug_LV" onChange="StAllCalc()"></select></td><td><span id="Smug_CHANCE"></span></td></tr>'),
                    (a += "</table>"))
                  : (a = '<p class="center">Not available for this class.</p>'),
                myInnerHtml("A_KakutyouSel", a, 0),
                n_A_JobClass() == 2 ||
                  EquipNumSearch(EQUIPID.ANNIVERSARY_THIEF_HAT) ||
                  CardNumSearch(152))
              ) {
                for (i = 0; i <= 200; i++) c.E_DEX.options[i] = new documento.Opzione(i, i);
                if (((c.E_DEX.value = 0), n_A_JobClass() == 2)) {
                  for (i = 1; i <= 10; i++) c.Steal_LV.options[i - 1] = new documento.Opzione(i, i);
                  c.Steal_LV.value = 1;
                } else if (EquipNumSearch(EQUIPID.ANNIVERSARY_THIEF_HAT) || CardNumSearch(152)) {
                  for (i = 1; i <= 1; i++) c.Steal_LV.options[i - 1] = new documento.Opzione(i, i);
                  c.Steal_LV.value = 1;
                }
                if (n_A_JOB == 14 || n_A_JOB == 28) {
                  for (i = 1; i <= 5; i++) c.Smug_LV.options[i - 1] = new documento.Opzione(i, i);
                  c.Smug_LV.value = 1;
                }
              }
            } else {
              if (n_A_JOB == 12 || n_A_JOB == 26) {
                for (
                  a = '<table style="text-align:right;">',
                    a +=
                      '<tr><td>Oridecon Research: </td><td class="data"><select name="A_OriR" onChange="StAllCalc()"></select></td><td>Anvil:</td><td class=left><select name="A_KakutyouSelNum" onChange="StAllCalc()"></select></td></tr>',
                    a +=
                      '<tr><td>Weapon Research: </td><td class="data"><select name="A_WepR" onChange="StAllCalc()"></select></td><td>Star Crumb:</td><td class=left><select name="A_StarC" onChange="StAllCalc()"></select></td></tr>',
                    a +=
                      '<tr><td>Iron Tempering: </td><td class="data"><select name="A_Iron" onChange="StAllCalc()"></select></td><td>Elemental Stone:</td><td class=left><select name="A_ElemS" onChange="StAllCalc()"></select></td></tr>',
                    a +=
                      '<tr><td>Steel Tempering: </td><td class="data"><select name="A_Steel" onChange="StAllCalc()"></select></td><td>Enchanted Stone Craft:</td><td class=left><select name="A_StoneC" onChange="StAllCalc()"></select></td></tr>',
                    a +=
                      '<tr><td>Smith (weapon) Lvl: </td><td class="data"><select name="A_SmithT" onChange="StAllCalc()"></select></td><td></td></tr>',
                    a += "</table>",
                    myInnerHtml("A_KakutyouSel", a, 0),
                    i = 0;
                  i < Anvil_Max;
                  i++
                )
                  c.A_KakutyouSelNum.options[i] = new documento.Opzione(m_Anvil[i][2], i);
                for (c.A_KakutyouSelNum.value = 0, i = 0; i <= 5; i++)
                  c.A_OriR.options[i] = new documento.Opzione(i, i);
                for (c.A_OriR.value = 0, i = 0; i <= 10; i++)
                  c.A_WepR.options[i] = new documento.Opzione(i, i);
                for (c.A_WepR.value = 0, i = 0; i <= 3; i++)
                  c.A_StarC.options[i] = new documento.Opzione(i, i);
                for (c.A_StarC.value = 0, i = 0; i <= 1; i++)
                  c.A_ElemS.options[i] = new documento.Opzione(i, i);
                for (c.A_ElemS.value = 0, i = 0; i <= 3; i++)
                  c.A_SmithT.options[i] = new documento.Opzione(i, i);
                for (c.A_SmithT.value = 0, i = 0; i <= 5; i++)
                  c.A_Iron.options[i] = new documento.Opzione(i, i);
                for (c.A_Iron.value = 0, i = 0; i <= 5; i++)
                  c.A_Steel.options[i] = new documento.Opzione(i, i);
                for (c.A_Steel.value = 0, i = 0; i <= 5; i++)
                  c.A_StoneC.options[i] = new documento.Opzione(i, i);
                return void (c.A_StoneC.value = 0);
              }
              if (n_A_JOB == 19 || n_A_JOB == 33) {
                for (
                  potiontext =
                    '<table style="text-align:right;"><tr><td>Potion to Create:</td><td class=left><select name="A_KakutyouSelNum" onChange="StAllCalc()"></select></td></tr>',
                    potiontext +=
                      '<tr><td>Learning Potion:</td><td class=left><select name="A_PotionRLevel" onChange="StAllCalc()"></select></td></tr>',
                    potiontext +=
                      '<tr><td>Change Instruction Level:</td><td class=left><select name="A_Van" onChange="StAllCalc()"></select><td></tr>',
                    potiontext +=
                      '<tr><td>Pharmacy:</td><td class=left><select name="A_PreparePLevel" onChange="StAllCalc()"></select></td></tr></table>',
                    myInnerHtml("A_KakutyouSel", potiontext + "", 0),
                    i = 0;
                  i < Potion_Max;
                  i++
                )
                  c.A_KakutyouSelNum.options[i] = new documento.Opzione(m_Potion[i][2], i);
                for (c.A_KakutyouSelNum.value = 0, i = 0; i <= 10; i++)
                  c.A_PotionRLevel.options[i] = new documento.Opzione(i, i);
                for (c.A_PotionRLevel.value = 0, i = 0; i <= 5; i++)
                  c.A_Van.options[i] = new documento.Opzione(i, i);
                for (c.A_Van.value = 0, i = 0; i <= 10; i++)
                  c.A_PreparePLevel.options[i] = new documento.Opzione(i, i);
                return void (c.A_PreparePLevel.value = 0);
              }
              myInnerHtml(
                "A_KakutyouSel",
                '<p class="center">Not available for this class.</p>',
                0,
              );
            }
          else {
            if (n_A_JOB == 19 || n_A_JOB == 33) {
              for (
                a = '<table style="text-align:right;">',
                  n_A_JOB == 33 &&
                    (a +=
                      '<tr><td>Slim Potion Pitcher:</td><td colspan="3"><select style="float:left" name="SPP" onChange="StAllCalc()"></select></td><td></td></tr>'),
                  a +=
                    '<tr><td>Potion Pitcher:</td><td colspan="2"><select style="float:left" name="PP" onChange="StAllCalc()"></select></td><td>Target\'s VIT:</td><td class=left><select name="E_VIT" onChange="StAllCalc()"></select></td></tr>',
                  a +=
                    '<tr><td>Learning Potion:</td><td class=left><select name="POT_RLevel" onChange="StAllCalc()"></select></td><td></td><td>Target\'s INT:</td><td class=left><select name="E_INT" onChange="StAllCalc()"></select></td></tr>',
                  a +=
                    '<tr><td>Ranked:</td><td class=left><select name="RNK_BNS" onChange="StAllCalc()"></select></td><td colspan=2>Increase SP Recovery: <td class=left><select name="ISP" onChange="StAllCalc()"></select></td></tr>',
                  a +=
                    '<tr><td>Soul Linker Lvl:</td><td class=left><select name="SL_LV" onChange="StAllCalc()"></select></td><td colspan=2>Increase HP Recovery: <td class=left><select name="IRP" onChange="StAllCalc()"></select></td></tr>',
                  a += "</tr></table>",
                  myInnerHtml("A_KakutyouSel", a + "<br>", 0),
                  i = 0;
                i < Potion_Max_2;
                i++
              )
                c.PP.options[i] = new documento.Opzione(m_Potion2[i][3], i);
              if (((c.PP.value = 0), n_A_JOB == 33)) {
                for (i = 0; i < Potion_Max_3; i++)
                  c.SPP.options[i] = new documento.Opzione(m_Potion3[i][3], i);
                c.SPP.value = 0;
              }
              for (i = 0; i <= 10; i++) c.POT_RLevel.options[i] = new documento.Opzione(i, i);
              for (c.POT_RLevel.value = 0, i = 0; i <= 1; i++)
                c.RNK_BNS.options[i] = new documento.Opzione(Pot_Rank[i][1], i);
              for (c.RNK_BNS.value = 0, i = 0; i <= 200; i++)
                c.E_VIT.options[i] = new documento.Opzione(i, i);
              for (c.E_VIT.value = 0, i = 0; i <= 200; i++)
                c.E_INT.options[i] = new documento.Opzione(i, i);
              for (c.E_INT.value = 0, i = 0; i <= 99; i++)
                c.SL_LV.options[i] = new documento.Opzione(i, i);
              for (c.SL_LV.value = 0, i = 0; i <= 10; i++)
                c.ISP.options[i] = new documento.Opzione(i, i);
              for (c.ISP.value = 0, i = 0; i <= 10; i++)
                c.IRP.options[i] = new documento.Opzione(i, i);
              return void (c.IRP.value = 0);
            }
            myInnerHtml("A_KakutyouSel", '<p class="center">Not available for this class.</p>', 0);
          }
        } else {
          for (
            a = "<table>",
              a +=
                '<tr><td>Target: <select name="R_OBJ" onChange = "StAllCalc()"></select><select name="S_OBJ" onChange = "StAllCalc()"></select><select name="E_OBJ" onChange = "calc()"></select><select name="B_OBJ" onChange = "calc()"></select><select name="SP_OBJ" onChange = "calc()"></select></td></tr>',
              a += "</table>",
              myInnerHtml("A_KakutyouData", a, 0),
              i = 0;
            i < v_Race_.length;
            i++
          )
            c.R_OBJ.options[i] = new documento.Opzione(v_Race_[i], i);
          for (c.R_OBJ.value = 0, i = 0; i < v_Size.length; i++)
            c.S_OBJ.options[i] = new documento.Opzione(v_Size[i], i);
          for (c.S_OBJ.value = 0, i = 0; i < v_Element_.length; i++)
            c.E_OBJ.options[i] = new documento.Opzione(v_Element_[i], i);
          for (c.E_OBJ.value = 0, i = 0; i < v_Type.length; i++)
            c.B_OBJ.options[i] = new documento.Opzione(v_Type[i], i);
          for (c.B_OBJ.value = 0, i = 0; i < v_Race2.length; i++)
            c.SP_OBJ.options[i] = new documento.Opzione(v_Race2[i], i);
          c.SP_OBJ.value = 0;
        }
      else if (n_A_JobClass() == 6 || n_A_JOB == 20) {
        for (
          myInnerHtml(
            "A_KakutyouSel",
            'Enlarge Weight Limit Lvl: <select name="A_KakutyouSelNum" onChange="StAllCalc()"></select><BR>Enlarge Weight Limit R Lvl: <select name="A_KakutyouSelNum2" onChange="StAllCalc()"></select><BR>',
            0,
          ),
            i = 0;
          i <= 10;
          i++
        )
          c.A_KakutyouSelNum2.options[i] = new documento.Opzione(i, i);
        for (i = 0; i <= 10; i++) c.A_KakutyouSelNum.options[i] = new documento.Opzione(i, i);
        n_A_JOB == 20 ? (c.A_KakutyouSelNum.value = 0) : (c.A_KakutyouSelNum.value = 10);
      } else if (n_A_JOB == 42) {
        for (
          myInnerHtml(
            "A_KakutyouSel",
            'Enlarge Weight Limit R Lvl: <select name="A_KakutyouSelNum2" onChange="StAllCalc()"></select><BR>Knowledge of the Sun, Moon and Stars Lvl: <select name="SG_Weight" onChange="StAllCalc()"></select><BR>',
            0,
          ),
            i = 0;
          i <= 10;
          i++
        )
          c.A_KakutyouSelNum2.options[i] = new documento.Opzione(i, i);
        for (i = 0; i <= 10; i++) c.SG_Weight.options[i] = new documento.Opzione(i, i);
      } else
        for (
          myInnerHtml(
            "A_KakutyouSel",
            'Enlarge Weight Limit R Lvl: <select name="A_KakutyouSelNum2" onChange="StAllCalc()"></select><BR>',
            0,
          ),
            i = 0;
          i <= 10;
          i++
        )
          c.A_KakutyouSelNum2.options[i] = new documento.Opzione(i, i);
    else {
      if (n_A_JOB == 15 || n_A_JOB == 29) {
        for (
          myInnerHtml(
            "A_KakutyouSel",
            'Spiritual Cadence Lvl: <select name="A_KakutyouSelNum" onChange="StAllCalc()"></select>',
            0,
          ),
            i = 0;
          i <= 5;
          i++
        )
          c.A_KakutyouSelNum.options[i] = new documento.Opzione(i, i);
        return void (c.A_KakutyouSelNum.value = 5);
      }
      myInnerHtml("A_KakutyouSel", '<p class="center">Not available for this class.</p>', 0);
    }
  else
    for (
      a =
        '<table><tr><td class="title">Potions</td><td class="title">Zeny/each</td><td class="title">Amount restored</td><td class="title">Amount/Weight</td><td class="title">Amount/Zeny</td></tr>',
        a +=
          '<tr><td><select name="pot1" onChange="StAllCalc()" style="width:99px;"></select></td><td><input type="text" name="zEA1" onkeyup="m_HPpotion[pot1.value][1]=this.value | StAllCalc()" value="m_HPpotion[pot1.value][1]" size="1" class="center"></td><td class="center"><span id="AmRe1"></span></td><td class="center"><span id="AmWe1"></span></td><td class="center"><span id="AmZe1"></span></td></tr>',
        a +=
          '<tr><td><select name="pot2" onChange="StAllCalc()" style="width:99px;"></select></td><td><input type="text" name="zEA2" onkeyup="PotZenySet(this.value) | StAllCalc()" value="m_HPpotion[pot1.value][1]" size="1" class="center"></td><td class="center"><span id="AmRe2"></span></td><td class="center"><span id="AmWe2"></span></td><td class="center"><span id="AmZe2"></span></td></tr>',
        a +=
          '<tr><td><select name="pot3" onChange="StAllCalc()" style="width:99px;"></select></td><td><input type="text" name="zEA3" onkeyup="PotZenySet(this.value) | StAllCalc()" value="m_HPpotion[pot1.value][1]" size="1" class="center"></td><td class="center"><span id="AmRe3"></span></td><td class="center"><span id="AmWe3"></span></td><td class="center"><span id="AmZe3"></span></td></tr>',
        a +=
          '<tr><td><select name="pot4" onChange="StAllCalc()" style="width:99px;"></select></td><td><input type="text" name="zEA4" onkeyup="PotZenySet(this.value) | StAllCalc()" value="m_HPpotion[pot1.value][1]" size="1" class="center"></td><td class="center"><span id="AmRe4"></span></td><td class="center"><span id="AmWe4"></span></td><td class="center"><span id="AmZe4"></span></td></tr>',
        a +=
          '<tr><td><select name="pot5" onChange="StAllCalc()" style="width:99px;"></select></td><td><input type="text" name="zEA5" onkeyup="PotZenySet(this.value) | StAllCalc()" value="m_HPpotion[pot1.value][1]" size="1" class="center"></td><td class="center"><span id="AmRe5"></span></td><td class="center"><span id="AmWe5"></span></td><td class="center"><span id="AmZe5"></span></td></tr>',
        a +=
          '<tr><td><select name="pot6" onChange="StAllCalc()" style="width:99px;"></select></td><td><input type="text" name="zEA6" onkeyup="PotZenySet(this.value) | StAllCalc()" value="38" size="1" class="center"></td><td class="center"><span id="AmRe6"></span></td><td class="center"><span id="AmWe6"></span></td><td class="center"><span id="AmZe6"></span></td></tr>',
        a +=
          '<tr><td><select name="pot7" onChange="StAllCalc()" style="width:99px;"></select></td><td><input type="text" name="zEA7" onkeyup="PotZenySet(this.value) | StAllCalc()" value="38" size="1" class="center"></td><td class="center"><span id="AmRe7"></span></td><td class="center"><span id="AmWe7"></span></td><td class="center"><span id="AmZe7"></span></td></tr>',
        a += "</tr></table>",
        myInnerHtml("A_KakutyouSel", a, 0),
        i = 0;
      i <= 69;
      i++
    )
      ((c.pot1.options[i] = new documento.Opzione(m_HPpotion[i][5], i)),
        (c.pot2.options[i] = new documento.Opzione(m_HPpotion[i][5], i)),
        (c.pot3.options[i] = new documento.Opzione(m_HPpotion[i][5], i)),
        (c.pot4.options[i] = new documento.Opzione(m_HPpotion[i][5], i)),
        (c.pot5.options[i] = new documento.Opzione(m_HPpotion[i][5], i)),
        (c.pot6.options[i] = new documento.Opzione(m_HPpotion[i][5], i)),
        (c.pot7.options[i] = new documento.Opzione(m_HPpotion[i][5], i)));
}
function SetEquipShort() {
  ((w = 1 * c.A_equipshort.value),
    w > 0 &&
      (m_CardShort[w][0] != "Remove All Cards"
        ? (m_CardShort[w][2] != 0 && (c.A_weapon1_card1.value = m_CardShort[w][2]),
          m_CardShort[w][3] != 0 && (c.A_head1_card.value = m_CardShort[w][3]),
          m_CardShort[w][4] != 0 && (c.A_left_card.value = m_CardShort[w][4]),
          m_CardShort[w][5] != 0 && (c.A_body_card.value = m_CardShort[w][5]),
          m_CardShort[w][6] != 0 && (c.A_shoulder_card.value = m_CardShort[w][6]),
          m_CardShort[w][7] != 0 && (c.A_shoes_card.value = m_CardShort[w][7]),
          m_CardShort[w][8] != 0 && (c.A_acces1_card.value = m_CardShort[w][8]),
          m_CardShort[w][9] != 0 && (c.A_acces2_card.value = m_CardShort[w][9]),
          m_CardShort[w][10] != 0 && (c.A_head2_card.value = m_CardShort[w][10]))
        : ((c.A_weapon1_card1.value = 0),
          (c.A_weapon1_card2.value = 0),
          (c.A_weapon1_card3.value = 0),
          (c.A_weapon1_card4.value = 0),
          (c.A_head1_card.value = 0),
          (c.A_head2_card.value = 0),
          (c.A_left_card.value = 0),
          (c.A_body_card.value = 0),
          (c.A_shoulder_card.value = 0),
          (c.A_shoes_card.value = 0),
          (c.A_acces1_card.value = 0),
          (c.A_acces2_card.value = 0)),
      ActiveSkillSetPlus()));
}
function Setm_CardShort() {
  ((w = 1 * c.A_cardshort.value),
    w > 0 &&
      (m_CardShort[w][1] < 1e4
        ? ((c.A_weapon1_card1.value = m_CardShort[w][1]),
          (c.A_weapon1_card2.value = m_CardShort[w][2]),
          (c.A_weapon1_card3.value = m_CardShort[w][3]),
          (c.A_weapon1_card4.value = m_CardShort[w][4]),
          (w != 16 && w != 17) ||
            ((w = m_Monster[1 * c.B_Enemy.value][3]),
            10 <= w && w <= 14 && (c.A_weapon1_card1.value = 204),
            ((20 <= w && w <= 24) || (80 <= w && w <= 94)) && (c.A_weapon1_card1.value = 203),
            30 <= w && w <= 34 && (c.A_weapon1_card1.value = 201),
            40 <= w && w <= 44 && (c.A_weapon1_card1.value = 202)))
        : m_CardShort[w][0] != "Remove All Cards"
          ? (m_CardShort[w][2] != 0 && (c.A_weapon1_card1.value = m_CardShort[w][2]),
            m_CardShort[w][3] != 0 && (c.A_head1_card.value = m_CardShort[w][3]),
            m_CardShort[w][4] != 0 && (c.A_left_card.value = m_CardShort[w][4]),
            m_CardShort[w][5] != 0 && (c.A_body_card.value = m_CardShort[w][5]),
            m_CardShort[w][6] != 0 && (c.A_shoulder_card.value = m_CardShort[w][6]),
            m_CardShort[w][7] != 0 && (c.A_shoes_card.value = m_CardShort[w][7]),
            m_CardShort[w][8] != 0 && (c.A_acces1_card.value = m_CardShort[w][8]),
            m_CardShort[w][9] != 0 && (c.A_acces2_card.value = m_CardShort[w][9]))
          : ((c.A_weapon1_card1.value = 0),
            (c.A_weapon1_card2.value = 0),
            (c.A_weapon1_card3.value = 0),
            (c.A_weapon1_card4.value = 0),
            typeof A_weapon2_card1 < "u" &&
              ((c.A_weapon2_card1.value = 0),
              (c.A_weapon2_card2.value = 0),
              (c.A_weapon2_card3.value = 0),
              (c.A_weapon2_card4.value = 0)),
            (c.A_head1_card.value = 0),
            (c.A_head2_card.value = 0),
            (c.A_left_card.value = 0),
            (c.A_body_card.value = 0),
            (c.A_shoulder_card.value = 0),
            (c.A_shoes_card.value = 0),
            (c.A_acces1_card.value = 0),
            (c.A_acces2_card.value = 0)),
      ActiveSkillSetPlus()));
}
function Setm_CardShortLeft() {
  ((w = 1 * c.A_cardshortLeft.value),
    w > 0 &&
      ((c.A_weapon2_card1.value = m_CardShort[w][1]),
      (c.A_weapon2_card2.value = m_CardShort[w][2]),
      (c.A_weapon2_card3.value = m_CardShort[w][3]),
      (c.A_weapon2_card4.value = m_CardShort[w][4]),
      (w != 16 && w != 17) ||
        ((w = m_Monster[1 * c.B_Enemy.value][3]),
        10 <= w && w <= 14 && (c.A_weapon2_card1.value = 204),
        ((20 <= w && w <= 24) || (80 <= w && w <= 94)) && (c.A_weapon2_card1.value = 203),
        30 <= w && w <= 34 && (c.A_weapon2_card1.value = 201),
        40 <= w && w <= 44 && (c.A_weapon2_card1.value = 202))));
}
for (wESx = new Array(), i = 0; i <= EnemyNum; i++) wESx[i] = new Array();
function EnemySort() {
  for (var l = c.B_Enemy.length, A = 0; A < l; A++) c.B_Enemy.options[0] = null;
  if (((ESNum = [1, 3, 2, 21, 22, 16, 17, 13, 4, 14, 15, 19, 100]), 1 * c.ENEMY_SORT.value != 0)) {
    for (
      wES = ESNum[1 * c.ENEMY_SORT.value],
        wESx[0][0] = "S",
        wESx[0][1] = "E",
        STERTw = 0,
        ENDw = 0,
        A = 1;
      A <= EnemyNum;
      A++
    )
      if (((s = ENDw), m_Monster[A][wES] >= m_Monster[s][wES]))
        ((wESx[s][1] = A), (wESx[A][0] = s), (wESx[A][1] = "E"), (ENDw = A));
      else if (((s = STERTw), m_Monster[A][wES] <= m_Monster[s][wES]))
        ((wESx[s][0] = A), (wESx[A][0] = "S"), (wESx[A][1] = s), (STERTw = A));
      else {
        for (s = STERTw, jbk = STERTw; m_Monster[A][wES] > m_Monster[s][wES];)
          ((jbk = s), (s = wESx[s][1]));
        ((wESx[jbk][1] = A), (wESx[A][0] = jbk), (wESx[A][1] = s), (wESx[s][0] = A));
      }
    for ((n = new Array())[0] = A = STERTw, s = 1; wESx[A][1] != "E"; s++)
      ((n[s] = wESx[A][1]), (A = wESx[A][1]));
    if (((n = SZ(n)), (ESwork2 = new Array()), wES == 21 || wES == 22 || wES == 14 || wES == 15))
      for (A = 0; A <= EnemyNum; A++) ESwork2[A] = "[" + m_Monster[A][wES] + "] ";
    else if (wES == 2)
      for (A = 0; A <= EnemyNum; A++) ESwork2[A] = "[" + v_Race_[m_Monster[A][2]] + "] ";
    else if (wES == 4)
      for (A = 0; A <= EnemyNum; A++) ESwork2[A] = "[" + v_Size[m_Monster[A][4]] + "] ";
    else if (wES == 19)
      for (A = 0; A <= EnemyNum; A++) ESwork2[A] = "[" + v_Type[m_Monster[A][19]] + "] ";
    else if (wES == 3)
      for (A = 0; A <= EnemyNum; A++)
        ESwork2[A] =
          "[" + v_Element_[Math.floor(m_Monster[A][3] / 10)] + (m_Monster[A][3] % 10) + "] ";
    else for (A = 0; A <= EnemyNum; A++) ESwork2[A] = "";
    for (s = 0, A = 0; A <= EnemyNum; A++)
      n[A] != -1 &&
        ((c.B_Enemy.options[s] = new documento.Opzione(ESwork2[n[A]] + m_Monster[n[A]][1], n[A])),
        s++);
  } else {
    for (var n = new Array(), A = 0; A <= EnemyNum; A++) n[A] = v_MonsterSort[A];
    n = SZ(n);
    var s = 0;
    for (A = 0; A <= EnemyNum; A++)
      n[A] != -1 && ((c.B_Enemy.options[s] = new documento.Opzione(m_Monster[n[A]][1], n[A])), s++);
  }
}
function SZ(l) {
  var A = documento.calcForm.ENEMY_SORT2.value;
  if (A != 0)
    for (var n = 0; n <= EnemyNum; n++)
      if (l[n] != -1) {
        for (var s = 0; m_MonsterMap[A][s] != "N" && l[n] != m_MonsterMap[A][s]; s++);
        m_MonsterMap[A][s] == "N" && (l[n] = -1);
      }
  return l;
}
var nMANUKU = [523, 526, 527, 529, 530, 533, 540, 562, 563];
function MANUKU_MONSTER() {
  for (var l = 0; l < nMANUKU.length; l++) if (targetData[0] == nMANUKU[l]) return 1;
  return 0;
}
var nSUPURE = [524, 525, 528, 531, 532, 536, 561];
function SUPURE_MONSTER() {
  for (var l = 0; l < nSUPURE.length; l++) if (targetData[0] == nSUPURE[l]) return 1;
  return 0;
}
// Versione del formato della build, nel primo carattere. Il formato discende da quello del
// calcolatore di Thrice (versioni 10-18), ma e' di questo calcolatore: si parte da 40 perche'
// i due non si confondano, e URLIN carica solo le build di questa versione
var FORMATO_BUILD = 40;
// La build corrente nel formato dell'indirizzo (il testo dopo #)
function URLOUT() {
  (calc(), (SaveData = new Array()));
  for (var A = 0; A <= 88; A++) SaveData[A] = "i";
  ((SaveData[0] = NtoS2(FORMATO_BUILD, 1)),
    (SaveData[1] = NtoS2(1 * c.A_JOB.value, 2)),
    (SaveData[2] = NtoS2(1 * c.A_BaseLV.value, 2)),
    (SaveData[3] = NtoS2(1 * c.A_JobLV.value, 2)),
    (SaveData[4] = NtoS2(1 * c.A_STR.value, 2)),
    (SaveData[5] = NtoS2(1 * c.A_AGI.value, 2)),
    (SaveData[6] = NtoS2(1 * c.A_VIT.value, 2)),
    (SaveData[7] = NtoS2(1 * c.A_DEX.value, 2)),
    (SaveData[8] = NtoS2(1 * c.A_INT.value, 2)),
    (SaveData[9] = NtoS2(1 * c.A_LUK.value, 2)),
    (SaveData[10] = NtoS2(10 * n_A_Buf7[35] + 1 * c.A_Weapon_element.value, 1)),
    (SaveData[11] = NtoS2(m_Item[c.A_weapon1.value][1], 1)),
    n_Nitou && (SaveData[12] = NtoS2(m_Item[c.A_weapon2.value][1], 1)),
    (n_A_JobClass() == 2 || n_A_JobClass() == 4 || (n_A_JOB == 45 && n_A_WeaponType != 0)) &&
      (SaveData[13] = NtoS2(1 * c.A_Arrow.value, 1)),
    (SaveData[14] = NtoS2(1 * c.A_weapon1.value, 2)),
    (SaveData[15] = NtoS2(1 * c.A_Weapon_refine.value, 1)),
    (SaveData[16] = NtoS2(1 * c.A_weapon1_card1.value, 2)),
    (SaveData[17] = NtoS2(1 * c.A_weapon1_card2.value, 2)),
    (SaveData[18] = NtoS2(1 * c.A_weapon1_card3.value, 2)),
    (SaveData[19] = NtoS2(1 * c.A_weapon1_card4.value, 2)),
    n_Nitou
      ? ((SaveData[20] = NtoS2(1 * c.A_weapon2.value, 2)),
        (SaveData[21] = NtoS2(1 * c.A_Weapon2_refine.value, 1)),
        (SaveData[22] = NtoS2(1 * c.A_weapon2_card1.value, 2)),
        (SaveData[23] = NtoS2(1 * c.A_weapon2_card2.value, 2)),
        (SaveData[24] = NtoS2(1 * c.A_weapon2_card3.value, 2)),
        (SaveData[25] = NtoS2(1 * c.A_weapon2_card4.value, 2)))
      : ((SaveData[20] = NtoS2(1 * c.A_left.value, 2)),
        (SaveData[21] = NtoS2(1 * c.A_LEFT_REFINE.value, 1)),
        (SaveData[22] = NtoS2(1 * c.A_left_card.value, 2)),
        (SaveData[24] = SaveData[25] = SaveData[23] = NtoS2(0, 2))),
    (SaveData[26] = NtoS2(1 * c.A_head1.value, 2)),
    (SaveData[27] = NtoS2(1 * c.A_head1_card.value, 2)),
    (SaveData[28] = NtoS2(1 * c.A_head2.value, 2)),
    (SaveData[29] = NtoS2(1 * c.A_head2_card.value, 2)),
    (SaveData[30] = NtoS2(1 * c.A_head3.value, 2)),
    (SaveData[31] = NtoS2(1 * c.A_body.value, 2)),
    (SaveData[32] = NtoS2(1 * c.A_body_card.value, 2)),
    (SaveData[33] = NtoS2(1 * c.A_shoulder.value, 2)),
    (SaveData[34] = NtoS2(1 * c.A_shoulder_card.value, 2)),
    (SaveData[35] = NtoS2(1 * c.A_shoes.value, 2)),
    (SaveData[36] = NtoS2(1 * c.A_shoes_card.value, 2)),
    (SaveData[37] = NtoS2(1 * c.A_acces1.value, 2)),
    (SaveData[38] = NtoS2(1 * c.A_acces1_card.value, 2)),
    (SaveData[39] = NtoS2(1 * c.A_acces2.value, 2)),
    (SaveData[40] = NtoS2(1 * c.A_acces2_card.value, 2)),
    (SaveData[41] = NtoS2(1 * c.A_HEAD_REFINE.value, 1)),
    (SaveData[42] = NtoS2(1 * c.A_BODY_REFINE.value, 1)),
    (SaveData[43] = NtoS2(1 * c.A_SHOULDER_REFINE.value, 1)),
    (SaveData[44] = NtoS2(1 * c.A_SHOES_REFINE.value, 1)),
    (SaveData[45] = NtoS01(c.A_adopted.checked, 0, 0, 0, 0)),
    (SaveData[46] = NtoS2(1 * c.A_HSE.value, 2)),
    (SaveData[47] = NtoS2(1 * c.A_HSE_HEAD1.value, 2)),
    (SaveData[48] = NtoS2(8 * c.A_BASTION_HEAD.value + 1 * c.A_BASTION_SHOES.value, 2)),
    (SaveData[49] = NtoS01(
      0,
      c.all_dmgSkills.checked,
      c.restrict_jobequip.checked,
      c.restrict_lvlequip.checked,
      c.restrict_equipslot.checked,
    )),
    (SaveData[50] = NtoS01(c.restrict_cardslot.checked, c.all_card.checked, 0, 0, 0)),
    n_A_JobSet());
  var n = n_A_JOB,
    s = 0;
  for (A = 0; A <= 19 && s == 0; A++)
    if (m_JobBuff[n][A] != 999) {
      var _ = documento.getElementById("A_skill" + A);
      SaveData[52 + A] = NtoS2(1 * _.value, 1);
    } else ((SaveData[51] = NtoS2(A, 1)), (s = 1));
  var a = 73;
  for (A = 0; A <= 21 && n_A_Buf2[A] == 0; A++);
  for (
    A == 22
      ? (SaveData[a] = NtoS2(0, 1))
      : ((SaveData[a] = NtoS2(1, 1)),
        (SaveData[a + 1] = NtoS2(n_A_Buf2[0], 1)),
        (SaveData[a + 2] = NtoS2(n_A_Buf2[1], 1)),
        (SaveData[a + 3] = NtoS2(n_A_Buf2[4], 1)),
        (SaveData[a + 4] = NtoS2(n_A_Buf2[9], 1)),
        (SaveData[a + 5] = NtoS2(n_A_Buf2[13], 1)),
        (SaveData[a + 6] = NtoS2(n_A_Buf2[14], 1)),
        (SaveData[a + 7] = NtoS05(n_A_Buf2[2], n_A_Buf2[6])),
        (SaveData[a + 8] = NtoS05(n_A_Buf2[10], n_A_Buf2[11])),
        (SaveData[a + 9] = NtoS05(n_A_Buf2[12], n_A_Buf2[15])),
        (SaveData[a + 10] = NtoS01(
          n_A_Buf2[3],
          n_A_Buf2[5],
          n_A_Buf2[7],
          n_A_Buf2[8],
          n_A_Buf2[16],
        )),
        (SaveData[a + 11] = NtoS01(
          n_A_Buf2[17],
          n_A_Buf2[18],
          n_A_Buf2[19],
          n_A_Buf2[20],
          n_A_Buf2[21],
        )),
        (a += 11)),
      a += 1,
      A = 0;
    A <= 24 && n_B_debuf[A] == 0;
    A++
  );
  for (
    A == 25
      ? (SaveData[a] = NtoS2(0, 1))
      : ((SaveData[a] = NtoS2(1, 1)),
        (SaveData[a + 1] = NtoS2(n_B_debuf[0], 1)),
        (SaveData[a + 2] = NtoS05(n_B_debuf[1], n_B_debuf[18])),
        (SaveData[a + 3] = NtoS01(
          n_B_debuf[2],
          n_B_debuf[3],
          n_B_debuf[4],
          n_B_debuf[5],
          n_B_debuf[6],
        )),
        (SaveData[a + 4] = NtoS01(
          n_B_debuf[7],
          n_B_debuf[8],
          n_B_debuf[9],
          n_B_debuf[10],
          n_B_debuf[19],
        )),
        (SaveData[a + 5] = NtoS2(n_B_debuf[11], 1)),
        (SaveData[a + 6] = NtoS2(n_B_debuf[12], 1)),
        (SaveData[a + 7] = NtoS01(
          n_B_debuf[13],
          n_B_debuf[14],
          n_B_debuf[15],
          n_B_debuf[16],
          n_B_debuf[17],
        )),
        (SaveData[a + 8] = NtoS01(n_B_debuf[20], n_B_debuf[21], n_B_debuf[22], 0, 0)),
        (SaveData[a + 9] = NtoS05(n_B_debuf[23], n_B_debuf[24])),
        (a += 9)),
      a += 1,
      A = 0;
    A <= 19 && n_B_buf[A] == 0;
    A++
  );
  (A == 10
    ? (SaveData[a] = NtoS2(0, 1))
    : ((SaveData[a] = NtoS2(1, 1)),
      (SaveData[a + 1] = NtoS2(n_B_buf[0], 1)),
      (SaveData[a + 2] = NtoS01(n_B_buf[1], n_B_buf[2], n_B_buf[3], n_B_buf[4], n_B_buf[9])),
      (SaveData[a + 3] = NtoS2(n_B_buf[6], 2)),
      (SaveData[a + 4] = NtoS05(n_B_buf[7], n_B_buf[8])),
      (SaveData[a + 5] = NtoS2(n_B_buf[5], 1)),
      (SaveData[a + 6] = NtoS2(n_B_buf[10], 1)),
      (SaveData[a + 7] = NtoS2(n_B_buf[11], 1)),
      (SaveData[a + 8] = NtoS2(n_B_buf[12], 1)),
      (SaveData[a + 9] = NtoS2(n_B_buf[13], 1)),
      (SaveData[a + 10] = NtoS2(n_B_buf[14], 1)),
      (a += 10)),
    (a += 1));
  var E = [0, 0, 0, 0, 0];
  for (A = 0; A <= 36 && n_A_Buf3[A] == 0; A++);
  for (A != 37 && (E[0] = 1), A = 0; A <= 4 && n_A_Buf3[40 + A] == 0; A++);
  for (A != 5 && (E[1] = 1), A = 0; A <= 23 && n_A_Buf6[A] == 0; A++);
  for (A != 24 && (E[3] = 1), A = 0; A <= 60 && n_A_Buf7[A] == 0; A++);
  for (
    A != 61 && (E[4] = 1),
      SaveData[a] = NtoS01(E[0], E[1], E[2], E[3], E[4]),
      E[0] &&
        ((SaveData[a + 1] = NtoS2(n_A_Buf3[0], 1)),
        (SaveData[a + 2] = NtoS2(n_A_Buf3[1], 1)),
        (SaveData[a + 3] = NtoS2(n_A_Buf3[2], 1)),
        (SaveData[a + 4] = NtoS2(n_A_Buf3[3], 1)),
        (SaveData[a + 5] = NtoS2(n_A_Buf3[4], 1)),
        (SaveData[a + 6] = NtoS2(n_A_Buf3[5], 1)),
        (SaveData[a + 7] = NtoS2(n_A_Buf3[6], 1)),
        (SaveData[a + 8] = NtoS05(n_A_Buf3[7], n_A_Buf3[8])),
        (SaveData[a + 9] = NtoS05(n_A_Buf3[9], n_A_Buf3[10])),
        (SaveData[a + 10] = NtoS01(n_A_Buf3[11], n_A_Buf3[18], 0, 0, 0)),
        (SaveData[a + 11] = NtoS2(n_A_Buf3[12], 2)),
        (SaveData[a + 12] = NtoS2(n_A_Buf3[13], 2)),
        (SaveData[a + 13] = NtoS2(n_A_Buf3[14], 2)),
        (SaveData[a + 14] = NtoS2(n_A_Buf3[15], 2)),
        (SaveData[a + 15] = NtoS2(n_A_Buf3[16], 2)),
        (SaveData[a + 16] = NtoS2(n_A_Buf3[17], 2)),
        (SaveData[a + 17] = NtoS2(n_A_Buf3[20], 2)),
        (SaveData[a + 18] = NtoS2(n_A_Buf3[30], 1)),
        (SaveData[a + 19] = NtoS2(n_A_Buf3[21], 2)),
        (SaveData[a + 20] = NtoS2(n_A_Buf3[31], 1)),
        (SaveData[a + 21] = NtoS2(n_A_Buf3[22], 2)),
        (SaveData[a + 22] = NtoS2(n_A_Buf3[29], 2)),
        (SaveData[a + 23] = NtoS2(n_A_Buf3[32], 1)),
        (SaveData[a + 24] = NtoS2(n_A_Buf3[23], 2)),
        (SaveData[a + 25] = NtoS2(n_A_Buf3[33], 1)),
        (SaveData[a + 26] = NtoS2(n_A_Buf3[24], 2)),
        (SaveData[a + 27] = NtoS2(n_A_Buf3[34], 1)),
        (SaveData[a + 28] = NtoS2(n_A_Buf3[25], 2)),
        (SaveData[a + 29] = NtoS2(n_A_Buf3[35], 1)),
        (SaveData[a + 30] = NtoS2(n_A_Buf3[26], 2)),
        (SaveData[a + 31] = NtoS2(n_A_Buf3[36], 1)),
        (SaveData[a + 32] = NtoS2(n_A_Buf3[19], 2)),
        (SaveData[a + 33] = NtoS2(n_A_Buf3[37], 1)),
        (SaveData[a + 34] = NtoS2(n_A_Buf3[38], 2)),
        (SaveData[a + 35] = NtoS2(n_A_Buf3[39], 2)),
        (SaveData[a + 36] = NtoS2(n_A_Buf3[27], 1)),
        (a += 36)),
      E[1] &&
        ((SaveData[a + 1] = NtoS01(n_A_Buf3[40], 0, 0, 0, 0)),
        (SaveData[a + 2] = NtoS05(n_A_Buf3[41], n_A_Buf3[42])),
        (SaveData[a + 3] = NtoS05(n_A_Buf3[43], n_A_Buf3[44])),
        (a += 3)),
      E[3] &&
        ((SaveData[a + 1] = NtoS2(n_A_Buf6[5], 1)),
        (SaveData[a + 2] = NtoS2(n_A_Buf6[20], 1)),
        (SaveData[a + 3] = NtoS05(n_A_Buf6[0], n_A_Buf6[1])),
        (SaveData[a + 4] = NtoS05(n_A_Buf6[2], n_A_Buf6[4])),
        (SaveData[a + 5] = NtoS05(n_A_Buf6[18], n_A_Buf6[19])),
        (SaveData[a + 6] = NtoS01(n_A_Buf6[3], n_A_Buf6[6], n_A_Buf6[7], n_A_Buf6[8], n_A_Buf6[9])),
        (SaveData[a + 7] = NtoS01(
          n_A_Buf6[10],
          n_A_Buf6[11],
          n_A_Buf6[12],
          n_A_Buf6[13],
          n_A_Buf6[14],
        )),
        (SaveData[a + 8] = NtoS01(
          n_A_Buf6[15],
          n_A_Buf6[16],
          n_A_Buf6[17],
          n_A_Buf6[21],
          n_A_Buf6[22],
        )),
        (a += 8)),
      E[4] &&
        ((SaveData[a + 1] = NtoS2(n_A_Buf7[3], 1)),
        (SaveData[a + 2] = NtoS2(n_A_Buf7[4], 1)),
        (SaveData[a + 3] = NtoS2(n_A_Buf7[5], 1)),
        (SaveData[a + 4] = NtoS2(n_A_Buf7[6], 1)),
        (SaveData[a + 5] = NtoS2(n_A_Buf7[7], 1)),
        (SaveData[a + 6] = NtoS2(n_A_Buf7[8], 1)),
        (SaveData[a + 7] = NtoS05(n_A_Buf7[35], n_A_Buf7[42])),
        (SaveData[a + 8] = NtoS05(n_A_Buf7[39], n_A_Buf7[40])),
        (SaveData[a + 9] = NtoS01(
          n_A_Buf7[0],
          n_A_Buf7[1],
          n_A_Buf7[2],
          n_A_Buf7[9],
          n_A_Buf7[10],
        )),
        (SaveData[a + 10] = NtoS01(n_A_Buf7[11], n_A_Buf7[12], n_A_Buf7[13], n_A_Buf7[14], 0)),
        (SaveData[a + 11] = NtoS01(
          n_A_Buf7[16],
          n_A_Buf7[17],
          n_A_Buf7[18],
          n_A_Buf7[19],
          n_A_Buf7[20],
        )),
        (SaveData[a + 12] = NtoS01(
          n_A_Buf7[21],
          n_A_Buf7[22],
          n_A_Buf7[23],
          n_A_Buf7[24],
          n_A_Buf7[25],
        )),
        (SaveData[a + 13] = NtoS01(
          n_A_Buf7[26],
          n_A_Buf7[27],
          n_A_Buf7[28],
          n_A_Buf7[29],
          n_A_Buf7[30],
        )),
        (SaveData[a + 14] = NtoS01(
          n_A_Buf7[31],
          n_A_Buf7[32],
          n_A_Buf7[33],
          n_A_Buf7[34],
          n_A_Buf7[36],
        )),
        (SaveData[a + 15] = NtoS01(n_A_Buf7[37], n_A_Buf7[38], n_A_Buf7[41], 0, n_A_Buf7[44])),
        (SaveData[a + 16] = NtoS01(
          n_A_Buf7[45],
          n_A_Buf7[46],
          n_A_Buf7[47],
          n_A_Buf7[48],
          n_A_Buf7[49],
        )),
        (SaveData[a + 17] = NtoS01(
          n_A_Buf7[50],
          n_A_Buf7[51],
          n_A_Buf7[52],
          n_A_Buf7[53],
          n_A_Buf7[54],
        )),
        (SaveData[a + 18] = NtoS2(n_A_Buf7[55], 1)),
        (SaveData[a + 19] = NtoS01(n_A_Buf7[56], 0, 0, 0, 0)),
        (a += 19)),
      a += 1,
      A = 0;
    A <= 11 && n_A_Buf8[A] == 0;
    A++
  );
  for (
    A == 12
      ? (SaveData[a] = NtoS2(0, 1))
      : ((SaveData[a] = NtoS2(1, 1)),
        (SaveData[a + 1] = NtoS2(n_A_Buf8[0], 2)),
        (SaveData[a + 2] = NtoS2(n_A_Buf8[3], 2)),
        (SaveData[a + 3] = NtoS2(n_A_Buf8[7], 2)),
        (SaveData[a + 4] = NtoS2(n_A_Buf8[8], 2)),
        (SaveData[a + 5] = NtoS2(n_A_Buf8[9], 2)),
        (SaveData[a + 6] = NtoS2(n_A_Buf8[10], 2)),
        (SaveData[a + 7] = NtoS2(n_A_Buf8[11], 2)),
        (SaveData[a + 8] = NtoS2(n_A_Buf8[5], 1)),
        (SaveData[a + 9] = NtoS2(n_A_Buf8[6], 1)),
        (SaveData[a + 10] = NtoS05(n_A_Buf8[1], 0)),
        (SaveData[a + 11] = NtoS01(n_A_Buf8[2], 0, 0, 0, 0)),
        (a += 11)),
      a += 1,
      A = 0;
    A <= 59 && n_A_Buf9[A] == 0;
    A++
  );
  if (A == 60) SaveData[a] = NtoS2(0, 1);
  else {
    for (
      SaveData[a] = NtoS2(1, 1),
        SaveData[a + 1] = NtoS2(n_A_Buf9[0], 1),
        SaveData[a + 2] = NtoS2(n_A_Buf9[1], 2),
        SaveData[a + 3] = NtoS2(n_A_Buf9[2], 1),
        SaveData[a + 4] = NtoS2(n_A_Buf9[3], 2),
        SaveData[a + 5] = NtoS2(n_A_Buf9[4], 1),
        SaveData[a + 6] = NtoS2(n_A_Buf9[5], 2),
        SaveData[a + 7] = NtoS2(n_A_Buf9[6], 1),
        SaveData[a + 8] = NtoS2(n_A_Buf9[7], 2),
        SaveData[a + 9] = NtoS2(n_A_Buf9[8], 1),
        SaveData[a + 10] = NtoS2(n_A_Buf9[9], 2),
        SaveData[a + 11] = NtoS2(n_A_Buf9[10], 1),
        SaveData[a + 12] = NtoS2(n_A_Buf9[11], 2),
        SaveData[a + 13] = NtoS2(n_A_Buf9[12], 1),
        SaveData[a + 14] = NtoS2(n_A_Buf9[13], 2),
        SaveData[a + 15] = NtoS2(n_A_Buf9[14], 1),
        SaveData[a + 16] = NtoS2(n_A_Buf9[15], 2),
        SaveData[a + 17] = NtoS2(n_A_Buf9[16], 1),
        SaveData[a + 18] = NtoS2(n_A_Buf9[17], 2),
        SaveData[a + 19] = NtoS2(n_A_Buf9[18], 1),
        SaveData[a + 20] = NtoS2(n_A_Buf9[19], 2),
        SaveData[a + 21] = NtoS2(n_A_Buf9[20], 2),
        SaveData[a + 22] = NtoS2(n_A_Buf9[21], 2),
        SaveData[a + 23] = NtoS2(n_A_Buf9[22], 2),
        SaveData[a + 24] = NtoS2(n_A_Buf9[23], 2),
        SaveData[a + 25] = NtoS2(n_A_Buf9[24], 1),
        SaveData[a + 26] = NtoS2(n_A_Buf9[25], 2),
        SaveData[a + 27] = NtoS2(n_A_Buf9[26], 2),
        SaveData[a + 28] = NtoS2(n_A_Buf9[27], 2),
        SaveData[a + 29] = NtoS2(n_A_Buf9[28], 2),
        SaveData[a + 30] = NtoS2(n_A_Buf9[30], 3),
        A = 31;
      A <= 59;
      A++
    )
      SaveData[a + A] = NtoS2(n_A_Buf9[A], 2);
    a += 59;
  }
  for (a += 1, A = 0; A <= 55 && n_B_manual[A] == 0; A++);
  for (
    A == 56
      ? (SaveData[a] = NtoS2(0, 1))
      : ((SaveData[a] = NtoS2(1, 1)),
        (SaveData[a + 1] = NtoS2(n_B_manual[1], 2)),
        (SaveData[a + 2] = NtoS2(n_B_manual[2], 1)),
        (SaveData[a + 3] = NtoS2(n_B_manual[3], 2)),
        (SaveData[a + 4] = NtoS2(n_B_manual[4], 1)),
        (SaveData[a + 5] = NtoS2(n_B_manual[5], 2)),
        (SaveData[a + 6] = NtoS2(n_B_manual[7], 2)),
        (SaveData[a + 7] = NtoS2(n_B_manual[9], 2)),
        (SaveData[a + 8] = NtoS2(n_B_manual[21], 2)),
        (SaveData[a + 9] = NtoS2(n_B_manual[30], 3)),
        (SaveData[a + 10] = NtoS2(n_B_manual[31], 2)),
        (SaveData[a + 11] = NtoS2(n_B_manual[34], 2)),
        (SaveData[a + 12] = NtoS2(n_B_manual[35], 2)),
        (SaveData[a + 13] = NtoS2(n_B_manual[36], 2)),
        (SaveData[a + 14] = NtoS2(n_B_manual[37], 2)),
        (SaveData[a + 15] = NtoS2(n_B_manual[38], 2)),
        (SaveData[a + 16] = NtoS2(n_B_manual[39], 2)),
        (SaveData[a + 17] = NtoS2(n_B_manual[40], 3)),
        (SaveData[a + 18] = NtoS2(n_B_manual[41], 2)),
        (SaveData[a + 19] = NtoS2(n_B_manual[42], 3)),
        (SaveData[a + 20] = NtoS2(n_B_manual[43], 3)),
        (SaveData[a + 21] = NtoS2(n_B_manual[44], 2)),
        (SaveData[a + 22] = NtoS2(n_B_manual[48], 2)),
        (SaveData[a + 23] = NtoS2(n_B_manual[49], 2)),
        (SaveData[a + 24] = NtoS2(n_B_manual[50], 2)),
        (SaveData[a + 25] = NtoS2(n_B_manual[51], 2)),
        (SaveData[a + 26] = NtoS2(n_B_manual[52], 2)),
        (SaveData[a + 27] = NtoS2(n_B_manual[53], 3)),
        (SaveData[a + 28] = NtoS2(n_B_manual[54], 2)),
        (SaveData[a + 29] = NtoS2(n_B_manual[55], 2)),
        (a += 29)),
      SaveData[a + 1] = NtoS2(1 * c.Conf01.value, 2),
      SaveData[a + 2] = NtoS2(c.B_num.value, 1),
      SaveData[a + 3] = NtoS2(c.A8_Skill14.value, 1),
      SaveData[a + 4] = NtoS2(c.A8_Skill15.value, 2),
      SaveData[a + 5] = NtoS01(0, 0, 0, 0, 0),
      SaveData[a + 6] = NtoS2(c.A_ActiveSkill.value, 2),
      SaveData[a + 7] = NtoS2(1 * c.A_ActiveSkillLV.value, 1),
      c.contains(c.SkillSubNum)
        ? (SaveData[a + 8] = NtoS2(1 * c.SkillSubNum.value, 3))
        : (SaveData[a + 8] = NtoS2(0, 3)),
      SaveData[a + 9] = NtoS2(targetData[0], 2),
      SaveData[a + 10] = NtoS2(c.B_AtkSkill.value, 2),
      n_B_AtkSkill == 444 || n_B_AtkSkill == 445 || n_B_AtkSkill == 125 || n_B_AtkSkill == 131
        ? (SaveData[a + 11] = NtoS2(c.BSkillSubNum.value, 3))
        : (SaveData[a + 11] = NtoS2(0, 3)),
      a += 11,
      SaveData[a + 1] = NtoS2(c.B_AtkRange.value, 1),
      SaveData[a + 2] = NtoS2(c.B_AtkElem.value, 1),
      SaveData[a + 3] = NtoS2(0, 1),
      // posto del server nel formato dell'originale: sempre uaRO
      SaveData[a + 4] = NtoS2(10, 1),
      SaveData[a + 5] = NtoS2(c.maxASPD.value, 1),
      SaveData[a + 6] = NtoS2(1 * c.A_DICASTES_SHOULDER_PRIMARY.value, 1),
      SaveData[a + 7] = NtoS2(1 * c.A_DICASTES_SHOULDER_STATS.value, 1),
      SaveData[a + 8] = NtoS2(1 * c.A_DICASTES_SHOES_PRIMARY.value, 1),
      SaveData[a + 9] = NtoS2(1 * c.A_DICASTES_SHOES_STATS.value, 1),
      SaveData[a + 10] = NtoS2(1 * c.A_DICASTES_ACCESSORY1_PRIMARY.value, 1),
      SaveData[a + 11] = NtoS2(1 * c.A_DICASTES_ACCESSORY1_STATS.value, 1),
      SaveData[a + 12] = NtoS2(1 * c.A_DICASTES_ACCESSORY2_PRIMARY.value, 1),
      SaveData[a + 13] = NtoS2(1 * c.A_DICASTES_ACCESSORY2_STATS.value, 1),
      SaveData[a + 14] = NtoS2(1 * c.A_DICASTES_SHOULDER_STATS2.value, 1),
      SaveData[a + 15] = NtoS2(1 * c.A_DICASTES_SHOES_STATS2.value, 1),
      SaveData[a + 16] = NtoS2(1 * c.A_DICASTES_ACCESSORY1_STATS2.value, 1),
      SaveData[a + 17] = NtoS2(1 * c.A_DICASTES_ACCESSORY2_STATS2.value, 1),
      a += 17,
      wStr = "" + SaveData[0],
      A = 1;
    A <= a;
    A++
  )
    wStr += "" + SaveData[A];
  ((wStr = wStr.replace(/i{13}/g, "3")),
    (wStr = wStr.replace(/i{12}/g, "2")),
    (wStr = wStr.replace(/i{11}/g, "1")),
    (wStr = wStr.replace(/i{10}/g, "0")),
    (wStr = wStr.replace(/i{9}/g, "9")),
    (wStr = wStr.replace(/i{8}/g, "8")),
    (wStr = wStr.replace(/i{7}/g, "7")),
    (wStr = wStr.replace(/i{6}/g, "6")),
    (wStr = wStr.replace(/i{5}/g, "5")),
    (wStr = wStr.replace(/i{4}/g, "4")));
  return wStr;
}
function NtoS2(l, A) {
  var n = "";
  return (
    A == 3
      ? ((n += n_NtoS3[Math.floor(l / 3844)]),
        (n += n_NtoS3[Math.floor((l % 3844) / 62)]),
        (n += n_NtoS3[l % 62]))
      : A == 2
        ? ((n += n_NtoS3[Math.floor(l / 62)]), (n += n_NtoS3[l % 62]))
        : (n += n_NtoS3[l]),
    n
  );
}
function NtoS01(l, A, n, s, _) {
  var a = 0;
  return (
    l == 1 && (a += 16),
    A == 1 && (a += 8),
    n == 1 && (a += 4),
    s == 1 && (a += 2),
    _ == 1 && (a += 1),
    NtoS2(a, 1)
  );
}
function NtoS05(l, A) {
  var n;
  return ((n = 6 * l), NtoS2((n += A), 1));
}
function new_StoNx(l) {
  l += "";
  for (var A = 0; A <= 61; A++) if (l == n_NtoS3[A]) return A;
}
function StoN3(l) {
  var A = (l += "").length;
  if (A == 3) {
    var n = 62 * new_StoNx(l.charAt(0)) * 62;
    ((n += 62 * new_StoNx(l.charAt(1))), (n += new_StoNx(l.charAt(2))));
  } else
    A == 2
      ? ((n = 62 * new_StoNx(l.charAt(0))), (n += new_StoNx(l.charAt(1))))
      : (n = new_StoNx(l.charAt(0)));
  return n;
}
// Carica una build del formato FORMATO_BUILD, dall'indirizzo (l = 0) o da otherURL_TEXT (l = 1);
// una build di un altro formato non si carica e la funzione restituisce false
function URLIN(l) {
  var _ = (l ? documento.getElementById("otherURL_TEXT").value : posizioneMotore.href).split(
    "#",
  )[1];
  if (!_) return !1;
  _ = _.replace(/undefined/g, "i").replace(/%(24|26|27|2B|2C|3A|3B|3D)/g, decodeURIComponent);
  if (StoN3(_.substr(0, 1)) != FORMATO_BUILD) return !1;
  for (var cifra = 0; cifra <= 9; cifra++)
    _ = _.split(String(cifra)).join("i".repeat(cifra <= 3 ? cifra + 10 : cifra));
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
  ((n_A_Buf9[2] = 10),
    (n_A_Buf9[4] = 20),
    (n_A_Buf9[6] = 23),
    (n_A_Buf9[10] = 10),
    (n_A_Buf9[12] = 20),
    (n_A_Buf9[14] = 23),
    (c.A_BASTION_HEAD.value = BASTIONENCHANTID.NONE),
    (c.A_BASTION_SHOES.value = BASTIONENCHANTID.NONE),
    ResetDicastesEnchantControls(),
    refreshFields());
  var b = 98;
  (StoN3(_.substr(1, 2)) == 20 && StoN3(_.substr(b, 1))
    ? (SuperNoviceFullWeaponCHECK = 1)
    : (SuperNoviceFullWeaponCHECK = 0),
    (u = StoN3(_.substr(86, 1))),
    (c.all_dmgSkills.checked = Math.floor((u % 16) / 8)),
    (c.restrict_jobequip.checked = Math.floor((u % 8) / 4)),
    (c.restrict_lvlequip.checked = Math.floor((u % 4) / 2)),
    (c.restrict_equipslot.checked = Math.floor((u % 2) / 1)),
    (u = StoN3(_.substr(87, 1))),
    (c.restrict_cardslot.checked = Math.floor(u / 16)),
    (c.all_card.checked = Math.floor((u % 16) / 8)),
    c.all_card.checked && allCard(),
    restrictCardslot(0),
    (c.maxASPD.value = 0),
    (c.A_JOB.value = StoN3(_.substr(1, 2))),
    ClickJob(StoN3(_.substr(1, 2)), 2),
    (c.A_BaseLV.value = StoN3(_.substr(3, 2))),
    (c.A_JobLV.value = StoN3(_.substr(5, 2))),
    (c.A_STR.value = StoN3(_.substr(7, 2))),
    (c.A_AGI.value = StoN3(_.substr(9, 2))),
    (c.A_VIT.value = StoN3(_.substr(11, 2))),
    (c.A_DEX.value = StoN3(_.substr(13, 2))),
    (c.A_INT.value = StoN3(_.substr(15, 2))),
    (c.A_LUK.value = StoN3(_.substr(17, 2))),
    (n_A_Buf7[35] = Math.floor(StoN3(_.substr(19, 1)) / 10)),
    (c.A_Weapon_element.value = StoN3(_.substr(19, 1)) % 10));
  var m = normalizeEquipmentId(StoN3(_.substr(23, 2)));
  ((c.A_weapon1.value = m),
    (n_A_WeaponType = StoN3(_.substr(20, 1))),
    ClickWeaponType(n_A_WeaponType),
    (c.A_JOB.value != 8 && c.A_JOB.value != 22) ||
      n_A_WeaponType == 11 ||
      ((n_A_Weapon2Type = StoN3(_.substr(21, 1))), ClickWeaponType2(n_A_Weapon2Type)),
    n_A_JobSet(),
    (n_A_JobClass() == 2 || n_A_JobClass() == 4 || (n_A_JOB == 45 && n_A_WeaponType != 0)) &&
      (c.A_Arrow.value = StoN3(_.substr(22, 1))),
    ClickB_Item(m),
    (c.A_Weapon_refine.value = StoN3(_.substr(25, 1))),
    (c.A_weapon1_card1.value = StoN3(_.substr(26, 2))),
    (c.A_weapon1_card2.value = StoN3(_.substr(28, 2))),
    (c.A_weapon1_card3.value = StoN3(_.substr(30, 2))),
    (c.A_weapon1_card4.value = StoN3(_.substr(32, 2))),
    n_Nitou
      ? ((c.A_weapon2.value = StoN3(_.substr(34, 2))),
        (c.A_Weapon2_refine.value = StoN3(_.substr(36, 1))),
        (c.A_weapon2_card1.value = StoN3(_.substr(37, 2))),
        (c.A_weapon2_card2.value = StoN3(_.substr(39, 2))),
        (c.A_weapon2_card3.value = StoN3(_.substr(41, 2))),
        (c.A_weapon2_card4.value = StoN3(_.substr(43, 2))),
        (c.A_left.value = 305),
        (c.A_LEFT_REFINE.value = 0),
        (c.A_left_card.value = 0))
      : ((c.A_left.value = StoN3(_.substr(34, 2))),
        (c.A_LEFT_REFINE.value = StoN3(_.substr(36, 1))),
        (c.A_left_card.value = StoN3(_.substr(37, 2)))),
    (c.A_head1.value = StoN3(_.substr(45, 2))),
    (c.A_head1_card.value = StoN3(_.substr(47, 2))),
    (c.A_head2.value = StoN3(_.substr(49, 2))),
    (c.A_head2_card.value = StoN3(_.substr(51, 2))),
    (c.A_head3.value = StoN3(_.substr(53, 2))),
    (c.A_body.value = StoN3(_.substr(55, 2))),
    (c.A_body_card.value = StoN3(_.substr(57, 2))),
    (c.A_shoulder.value = StoN3(_.substr(59, 2))),
    (c.A_shoulder_card.value = StoN3(_.substr(61, 2))),
    (c.A_shoes.value = StoN3(_.substr(63, 2))),
    (c.A_shoes_card.value = StoN3(_.substr(65, 2))),
    (c.A_acces1.value = StoN3(_.substr(67, 2))),
    (c.A_acces1_card.value = StoN3(_.substr(69, 2))),
    (c.A_acces2.value = StoN3(_.substr(71, 2))),
    (c.A_acces2_card.value = StoN3(_.substr(73, 2))),
    (c.A_HEAD_REFINE.value = StoN3(_.substr(75, 1))),
    (c.A_BODY_REFINE.value = StoN3(_.substr(76, 1))),
    (c.A_SHOULDER_REFINE.value = StoN3(_.substr(77, 1))),
    (c.A_SHOES_REFINE.value = StoN3(_.substr(78, 1))));
  var u = StoN3(_.substr(79, 1));
  ((c.A_adopted.checked = Math.floor(u / 16)),
    (c.A_HSE.value = StoN3(_.substr(80, 2))),
    (c.A_HSE_HEAD1.value = StoN3(_.substr(82, 2))),
    (u = StoN3(_.substr(84, 2))),
    (c.A_BASTION_HEAD.value = Math.floor(u / 8)),
    (c.A_BASTION_SHOES.value = u % 8));
  var d = StoN3(_.substr(88, 1));
  for (a = 0; a < d; a++)
    documento.getElementById("A_skill" + a).value = StoN3(_.substr(89 + a, 1));
  BufSW(0);
  var e = 110;
  (StoN3(_.substr(e, 1)) == 1 &&
    ((n_A_Buf2[0] = StoN3(_.substr(e + 1, 1))),
    (n_A_Buf2[1] = StoN3(_.substr(e + 2, 1))),
    (n_A_Buf2[4] = StoN3(_.substr(e + 3, 1))),
    (n_A_Buf2[9] = StoN3(_.substr(e + 4, 1))),
    (n_A_Buf2[13] = StoN3(_.substr(e + 5, 1))),
    (n_A_Buf2[14] = StoN3(_.substr(e + 6, 1))),
    (n_A_Buf2[2] = Math.floor(StoN3(_.substr(e + 7, 1)) / 6)),
    (n_A_Buf2[6] = StoN3(_.substr(e + 7, 1)) % 6),
    (n_A_Buf2[10] = Math.floor(StoN3(_.substr(e + 8, 1)) / 6)),
    (n_A_Buf2[11] = StoN3(_.substr(e + 8, 1)) % 6),
    (n_A_Buf2[12] = Math.floor(StoN3(_.substr(e + 9, 1)) / 6)),
    (n_A_Buf2[15] = StoN3(_.substr(e + 9, 1)) % 6),
    (u = StoN3(_.substr(e + 10, 1))),
    (n_A_Buf2[3] = Math.floor(u / 16)),
    (n_A_Buf2[5] = Math.floor((u % 16) / 8)),
    (n_A_Buf2[7] = Math.floor((u % 8) / 4)),
    (n_A_Buf2[8] = Math.floor((u % 4) / 2)),
    (n_A_Buf2[16] = Math.floor((u % 2) / 1)),
    (u = StoN3(_.substr(e + 11, 1))),
    (n_A_Buf2[17] = Math.floor(u / 16)),
    (n_A_Buf2[18] = Math.floor((u % 16) / 8)),
    (n_A_Buf2[19] = Math.floor((u % 8) / 4)),
    (n_A_Buf2[20] = Math.floor((u % 4) / 2)),
    (n_A_Buf2[21] = Math.floor((u % 2) / 1)),
    (e += 11)),
    debufSW(0),
    (e += 1),
    StoN3(_.substr(e, 1)) == 1 &&
      ((n_B_debuf[0] = StoN3(_.substr(e + 1, 1))),
      (n_B_debuf[1] = Math.floor(StoN3(_.substr(e + 2, 1)) / 6)),
      (n_B_debuf[18] = StoN3(_.substr(e + 2, 1)) % 6),
      (u = StoN3(_.substr(e + 3, 1))),
      (n_B_debuf[2] = Math.floor(u / 16)),
      (n_B_debuf[3] = Math.floor((u % 16) / 8)),
      (n_B_debuf[4] = Math.floor((u % 8) / 4)),
      (n_B_debuf[5] = Math.floor((u % 4) / 2)),
      (n_B_debuf[6] = Math.floor((u % 2) / 1)),
      (u = StoN3(_.substr(e + 4, 1))),
      (n_B_debuf[7] = Math.floor(u / 16)),
      (n_B_debuf[8] = Math.floor((u % 16) / 8)),
      (n_B_debuf[9] = Math.floor((u % 8) / 4)),
      (n_B_debuf[10] = Math.floor((u % 4) / 2)),
      (n_B_debuf[19] = Math.floor((u % 2) / 1)),
      (n_B_debuf[11] = StoN3(_.substr(e + 5, 1))),
      (n_B_debuf[12] = StoN3(_.substr(e + 6, 1))),
      (u = StoN3(_.substr(e + 7, 1))),
      (n_B_debuf[13] = Math.floor(u / 16)),
      (n_B_debuf[14] = Math.floor((u % 16) / 8)),
      (n_B_debuf[15] = Math.floor((u % 8) / 4)),
      (n_B_debuf[16] = Math.floor((u % 4) / 2)),
      (n_B_debuf[17] = Math.floor((u % 2) / 1)),
      (u = StoN3(_.substr(e + 8, 1))),
      (n_B_debuf[20] = Math.floor(u / 16)),
      (n_B_debuf[21] = Math.floor((u % 16) / 8)),
      (n_B_debuf[22] = Math.floor((u % 8) / 4)),
      (n_B_debuf[23] = Math.floor(StoN3(_.substr(e + 9, 1)) / 6)),
      (n_B_debuf[24] = StoN3(_.substr(e + 9, 1)) % 6),
      (e += 9)),
    EnemyBufSW(0),
    (e += 1),
    StoN3(_.substr(e, 1)) == 1 &&
      ((n_B_buf[0] = StoN3(_.substr(e + 1, 1))),
      (u = StoN3(_.substr(e + 2, 1))),
      (n_B_buf[1] = Math.floor(u / 16)),
      (n_B_buf[2] = Math.floor((u % 16) / 8)),
      (n_B_buf[3] = Math.floor((u % 8) / 4)),
      (n_B_buf[4] = Math.floor((u % 4) / 2)),
      (n_B_buf[9] = Math.floor((u % 2) / 1)),
      (n_B_buf[6] = StoN3(_.substr(e + 3, 2))),
      (n_B_buf[7] = Math.floor(StoN3(_.substr(e + 5, 1)) / 6)),
      (n_B_buf[8] = StoN3(_.substr(e + 5, 1)) % 6),
      (n_B_buf[5] = StoN3(_.substr(e + 6, 1))),
      (n_B_buf[10] = StoN3(_.substr(e + 7, 1))),
      (n_B_buf[11] = StoN3(_.substr(e + 8, 1))),
      (n_B_buf[12] = StoN3(_.substr(e + 9, 1))),
      (n_B_buf[13] = StoN3(_.substr(e + 10, 1))),
      (n_B_buf[14] = StoN3(_.substr(e + 11, 1))),
      (e += 5),
      (e += 6)));
  var v = [0, 0, 0, 0, 0];
  if (
    ((u = StoN3(_.substr(e + 1, 1))),
    (v[0] = Math.floor(u / 16)),
    (v[1] = Math.floor((u % 16) / 8)),
    (v[2] = Math.floor((u % 8) / 4)),
    (v[3] = Math.floor((u % 4) / 2)),
    (v[4] = Math.floor((u % 2) / 1)),
    (e += 1),
    Buf3SW(0),
    v[0] &&
      ((n_A_Buf3[0] = StoN3(_.substr(e + 1, 1))),
      (n_A_Buf3[1] = StoN3(_.substr(e + 2, 1))),
      (n_A_Buf3[2] = StoN3(_.substr(e + 3, 1))),
      (n_A_Buf3[3] = StoN3(_.substr(e + 4, 1))),
      (n_A_Buf3[4] = StoN3(_.substr(e + 5, 1))),
      (n_A_Buf3[5] = StoN3(_.substr(e + 6, 1))),
      (n_A_Buf3[6] = StoN3(_.substr(e + 7, 1))),
      (n_A_Buf3[7] = Math.floor(StoN3(_.substr(e + 8, 1)) / 6)),
      (n_A_Buf3[8] = StoN3(_.substr(e + 8, 1)) % 6),
      (n_A_Buf3[9] = Math.floor(StoN3(_.substr(e + 9, 1)) / 6)),
      (n_A_Buf3[10] = StoN3(_.substr(e + 9, 1)) % 6),
      (n_A_Buf3[11] = Math.floor(StoN3(_.substr(e + 10, 1)) / 16)),
      (n_A_Buf3[18] = Math.floor((StoN3(_.substr(e + 10, 1)) % 16) / 8)),
      (n_A_Buf3[12] = StoN3(_.substr(e + 11, 2))),
      (n_A_Buf3[13] = StoN3(_.substr(e + 13, 2))),
      (n_A_Buf3[14] = StoN3(_.substr(e + 15, 2))),
      (n_A_Buf3[15] = StoN3(_.substr(e + 17, 2))),
      (n_A_Buf3[16] = StoN3(_.substr(e + 19, 2))),
      (n_A_Buf3[17] = StoN3(_.substr(e + 21, 2))),
      (n_A_Buf3[20] = StoN3(_.substr(e + 23, 2))),
      (n_A_Buf3[30] = StoN3(_.substr(e + 25, 1))),
      (n_A_Buf3[21] = StoN3(_.substr(e + 26, 2))),
      (n_A_Buf3[31] = StoN3(_.substr(e + 28, 1))),
      (n_A_Buf3[22] = StoN3(_.substr(e + 29, 2))),
      (n_A_Buf3[29] = StoN3(_.substr(e + 31, 2))),
      (n_A_Buf3[32] = StoN3(_.substr(e + 33, 1))),
      (n_A_Buf3[23] = StoN3(_.substr(e + 34, 2))),
      (n_A_Buf3[33] = StoN3(_.substr(e + 36, 1))),
      (n_A_Buf3[24] = StoN3(_.substr(e + 37, 2))),
      (n_A_Buf3[34] = StoN3(_.substr(e + 39, 1))),
      (n_A_Buf3[25] = StoN3(_.substr(e + 40, 2))),
      (n_A_Buf3[35] = StoN3(_.substr(e + 42, 1))),
      (n_A_Buf3[26] = StoN3(_.substr(e + 43, 2))),
      (n_A_Buf3[36] = StoN3(_.substr(e + 45, 1))),
      (n_A_Buf3[19] = StoN3(_.substr(e + 46, 2))),
      (n_A_Buf3[37] = StoN3(_.substr(e + 48, 1))),
      (n_A_Buf3[38] = StoN3(_.substr(e + 49, 2))),
      (n_A_Buf3[39] = StoN3(_.substr(e + 51, 2))),
      (n_A_Buf3[27] = StoN3(_.substr(e + 53, 1))),
      (e += 8),
      (e += 45)),
    Buf4SW(0),
    v[1] &&
      ((u = StoN3(_.substr(e + 1, 1))),
      (n_A_Buf3[40] = Math.floor(u / 16)),
      (n_A_Buf3[41] = Math.floor(StoN3(_.substr(e + 2, 1)) / 6)),
      (n_A_Buf3[42] = StoN3(_.substr(e + 2, 1)) % 6),
      (n_A_Buf3[43] = Math.floor(StoN3(_.substr(e + 3, 1)) / 6)),
      (n_A_Buf3[44] = StoN3(_.substr(e + 3, 1)) % 6),
      (e += 3)),
    Buf6SW(0),
    v[3] &&
      ((n_A_Buf6[5] = StoN3(_.substr(e + 1, 1))),
      (n_A_Buf6[20] = StoN3(_.substr(e + 2, 1))),
      (n_A_Buf6[0] = Math.floor(StoN3(_.substr(e + 3, 1)) / 6)),
      (n_A_Buf6[1] = StoN3(_.substr(e + 3, 1)) % 6),
      (n_A_Buf6[2] = Math.floor(StoN3(_.substr(e + 4, 1)) / 6)),
      (n_A_Buf6[4] = StoN3(_.substr(e + 4, 1)) % 6),
      (n_A_Buf6[18] = Math.floor(StoN3(_.substr(e + 5, 1)) / 6)),
      (n_A_Buf6[19] = StoN3(_.substr(e + 5, 1)) % 6),
      (u = StoN3(_.substr(e + 6, 1))),
      (n_A_Buf6[3] = Math.floor(u / 16)),
      (n_A_Buf6[6] = Math.floor((u % 16) / 8)),
      (n_A_Buf6[7] = Math.floor((u % 8) / 4)),
      (n_A_Buf6[8] = Math.floor((u % 4) / 2)),
      (n_A_Buf6[9] = Math.floor((u % 2) / 1)),
      (u = StoN3(_.substr(e + 7, 1))),
      (n_A_Buf6[10] = Math.floor(u / 16)),
      (n_A_Buf6[11] = Math.floor((u % 16) / 8)),
      (n_A_Buf6[12] = Math.floor((u % 8) / 4)),
      (n_A_Buf6[13] = Math.floor((u % 4) / 2)),
      (n_A_Buf6[14] = Math.floor((u % 2) / 1)),
      (u = StoN3(_.substr(e + 8, 1))),
      (n_A_Buf6[15] = Math.floor(u / 16)),
      (n_A_Buf6[16] = Math.floor((u % 16) / 8)),
      (n_A_Buf6[17] = Math.floor((u % 8) / 4)),
      (n_A_Buf6[21] = Math.floor((u % 4) / 2)),
      (n_A_Buf6[22] = Math.floor((u % 2) / 1)),
      (e += 8)),
    Buf7SW(0),
    v[4] &&
      ((n_A_Buf7[3] = StoN3(_.substr(e + 1, 1))),
      (n_A_Buf7[4] = StoN3(_.substr(e + 2, 1))),
      (n_A_Buf7[5] = StoN3(_.substr(e + 3, 1))),
      (n_A_Buf7[6] = StoN3(_.substr(e + 4, 1))),
      (n_A_Buf7[7] = StoN3(_.substr(e + 5, 1))),
      (n_A_Buf7[8] = StoN3(_.substr(e + 6, 1))),
      (n_A_Buf7[35] = Math.floor(StoN3(_.substr(e + 7, 1)) / 6)),
      (n_A_Buf7[42] = StoN3(_.substr(e + 7, 1)) % 6),
      (n_A_Buf7[39] = Math.floor(StoN3(_.substr(e + 8, 1)) / 6)),
      (n_A_Buf7[40] = StoN3(_.substr(e + 8, 1)) % 6),
      (u = StoN3(_.substr(e + 9, 1))),
      (n_A_Buf7[0] = Math.floor(u / 16)),
      (n_A_Buf7[1] = Math.floor((u % 16) / 8)),
      (n_A_Buf7[2] = Math.floor((u % 8) / 4)),
      (n_A_Buf7[9] = Math.floor((u % 4) / 2)),
      (n_A_Buf7[10] = Math.floor((u % 2) / 1)),
      (u = StoN3(_.substr(e + 10, 1))),
      (n_A_Buf7[11] = Math.floor(u / 16)),
      (n_A_Buf7[12] = Math.floor((u % 16) / 8)),
      (n_A_Buf7[13] = Math.floor((u % 8) / 4)),
      (n_A_Buf7[14] = Math.floor((u % 4) / 2)),
      (u = StoN3(_.substr(e + 11, 1))),
      (n_A_Buf7[16] = Math.floor(u / 16)),
      (n_A_Buf7[17] = Math.floor((u % 16) / 8)),
      (n_A_Buf7[18] = Math.floor((u % 8) / 4)),
      (n_A_Buf7[19] = Math.floor((u % 4) / 2)),
      (n_A_Buf7[20] = Math.floor((u % 2) / 1)),
      (u = StoN3(_.substr(e + 12, 1))),
      (n_A_Buf7[21] = Math.floor(u / 16)),
      (n_A_Buf7[22] = Math.floor((u % 16) / 8)),
      (n_A_Buf7[23] = Math.floor((u % 8) / 4)),
      (n_A_Buf7[24] = Math.floor((u % 4) / 2)),
      (n_A_Buf7[25] = Math.floor((u % 2) / 1)),
      (u = StoN3(_.substr(e + 13, 1))),
      (n_A_Buf7[26] = Math.floor(u / 16)),
      (n_A_Buf7[27] = Math.floor((u % 16) / 8)),
      (n_A_Buf7[28] = Math.floor((u % 8) / 4)),
      (n_A_Buf7[29] = Math.floor((u % 4) / 2)),
      (n_A_Buf7[30] = Math.floor((u % 2) / 1)),
      (u = StoN3(_.substr(e + 14, 1))),
      (n_A_Buf7[31] = Math.floor(u / 16)),
      (n_A_Buf7[32] = Math.floor((u % 16) / 8)),
      (n_A_Buf7[33] = Math.floor((u % 8) / 4)),
      (n_A_Buf7[34] = Math.floor((u % 4) / 2)),
      (n_A_Buf7[36] = Math.floor((u % 2) / 1)),
      (u = StoN3(_.substr(e + 15, 1))),
      (n_A_Buf7[37] = Math.floor(u / 16)),
      (n_A_Buf7[38] = Math.floor((u % 16) / 8)),
      (n_A_Buf7[41] = Math.floor((u % 8) / 4)),
      (n_A_Buf7[43] = Math.floor((u % 4) / 2)),
      n_A_Buf7[43] && (n_A_Buf7[36] = 1),
      (n_A_Buf7[44] = Math.floor((u % 2) / 1)),
      (u = StoN3(_.substr(e + 16, 1))),
      (n_A_Buf7[45] = Math.floor(u / 16)),
      (n_A_Buf7[46] = Math.floor((u % 16) / 8)),
      (n_A_Buf7[47] = Math.floor((u % 8) / 4)),
      (n_A_Buf7[48] = Math.floor((u % 4) / 2)),
      (n_A_Buf7[49] = Math.floor((u % 2) / 1)),
      (u = StoN3(_.substr(e + 17, 1))),
      (n_A_Buf7[50] = Math.floor(u / 16)),
      (n_A_Buf7[51] = Math.floor((u % 16) / 8)),
      (n_A_Buf7[52] = Math.floor((u % 8) / 4)),
      (n_A_Buf7[53] = Math.floor((u % 4) / 2)),
      (n_A_Buf7[54] = Math.floor((u % 2) / 1)),
      (n_A_Buf7[55] = StoN3(_.substr(e + 18, 1))),
      (u = StoN3(_.substr(e + 19, 1))),
      (n_A_Buf7[56] = Math.floor(u / 16)),
      (n_A_Buf7[57] = Math.floor((u % 16) / 8)),
      (n_A_Buf7[58] = Math.floor((u % 8) / 4)),
      (n_A_Buf7[59] = Math.floor((u % 4) / 2)),
      (n_A_Buf7[60] = Math.floor((u % 2) / 1)),
      (e += 3),
      (e += 16)),
    Buf6SW(0),
    (e += 1),
    StoN3(_.substr(e, 1)) == 1 &&
      ((n_A_Buf8[0] = StoN3(_.substr(e + 1, 2))),
      (n_A_Buf8[3] = StoN3(_.substr(e + 3, 2))),
      (n_A_Buf8[7] = StoN3(_.substr(e + 5, 2))),
      (n_A_Buf8[8] = StoN3(_.substr(e + 7, 2))),
      (n_A_Buf8[9] = StoN3(_.substr(e + 9, 2))),
      (n_A_Buf8[10] = StoN3(_.substr(e + 11, 2))),
      (n_A_Buf8[11] = StoN3(_.substr(e + 13, 2))),
      (n_A_Buf8[5] = StoN3(_.substr(e + 15, 1))),
      (n_A_Buf8[6] = StoN3(_.substr(e + 16, 1))),
      (n_A_Buf8[1] = Math.floor(StoN3(_.substr(e + 17, 1)) / 6)),
      (u = StoN3(_.substr(e + 18, 1))),
      (n_A_Buf8[2] = Math.floor(u / 16)),
      (e += 18)),
    Buf9SW(0),
    (e += 1),
    StoN3(_.substr(e, 1)) == 1)
  ) {
    for (
      n_A_Buf9[0] = StoN3(_.substr(e + 1, 1)),
        n_A_Buf9[1] = StoN3(_.substr(e + 2, 2)),
        n_A_Buf9[2] = StoN3(_.substr(e + 4, 1)),
        n_A_Buf9[3] = StoN3(_.substr(e + 5, 2)),
        n_A_Buf9[4] = StoN3(_.substr(e + 7, 1)),
        n_A_Buf9[5] = StoN3(_.substr(e + 8, 2)),
        n_A_Buf9[6] = StoN3(_.substr(e + 10, 1)),
        n_A_Buf9[7] = StoN3(_.substr(e + 11, 2)),
        n_A_Buf9[8] = StoN3(_.substr(e + 13, 1)),
        n_A_Buf9[9] = StoN3(_.substr(e + 14, 2)),
        n_A_Buf9[10] = StoN3(_.substr(e + 16, 1)),
        n_A_Buf9[11] = StoN3(_.substr(e + 17, 2)),
        n_A_Buf9[12] = StoN3(_.substr(e + 19, 1)),
        n_A_Buf9[13] = StoN3(_.substr(e + 20, 2)),
        n_A_Buf9[14] = StoN3(_.substr(e + 22, 1)),
        n_A_Buf9[15] = StoN3(_.substr(e + 23, 2)),
        n_A_Buf9[16] = StoN3(_.substr(e + 25, 1)),
        n_A_Buf9[17] = StoN3(_.substr(e + 26, 2)),
        n_A_Buf9[18] = StoN3(_.substr(e + 28, 1)),
        n_A_Buf9[19] = StoN3(_.substr(e + 29, 2)),
        n_A_Buf9[20] = StoN3(_.substr(e + 31, 2)),
        n_A_Buf9[21] = StoN3(_.substr(e + 33, 2)),
        n_A_Buf9[22] = StoN3(_.substr(e + 35, 2)),
        n_A_Buf9[23] = StoN3(_.substr(e + 37, 2)),
        n_A_Buf9[24] = StoN3(_.substr(e + 39, 1)),
        n_A_Buf9[25] = StoN3(_.substr(e + 40, 2)),
        n_A_Buf9[26] = StoN3(_.substr(e + 42, 2)),
        n_A_Buf9[27] = StoN3(_.substr(e + 44, 2)),
        n_A_Buf9[28] = StoN3(_.substr(e + 46, 2)),
        n_A_Buf9[29] = 0,
        n_A_Buf9[30] = StoN3(_.substr(e + 48, 3)),
        a = 31;
      a <= 59;
      a++
    )
      n_A_Buf9[a] = StoN3(_.substr(e - 11 + 2 * a, 2));
    e += 108;
  } else {
    for (
      n_A_Buf9[20] = StoN3(_.substr(e + 31, 1)),
        n_A_Buf9[21] = StoN3(_.substr(e + 32, 2)),
        n_A_Buf9[22] = StoN3(_.substr(e + 34, 1)),
        n_A_Buf9[23] = StoN3(_.substr(e + 35, 2)),
        n_A_Buf9[24] = StoN3(_.substr(e + 37, 1)),
        n_A_Buf9[25] = StoN3(_.substr(e + 38, 2)),
        n_A_Buf9[26] = StoN3(_.substr(e + 40, 1)),
        n_A_Buf9[27] = StoN3(_.substr(e + 41, 2)),
        n_A_Buf9[28] = StoN3(_.substr(e + 43, 1)),
        n_A_Buf9[29] = StoN3(_.substr(e + 44, 2)),
        n_A_Buf9[30] = StoN3(_.substr(e + 46, 3)),
        a = 31;
      a <= 55;
      a++
    )
      n_A_Buf9[a] = StoN3(_.substr(e - 13 + 2 * a, 2));
    e += 98;
  }
  (Buf10SW(0),
    (e += 1),
    StoN3(_.substr(e, 1)) == 1 &&
      ((n_B_manual[1] = StoN3(_.substr(e + 1, 2))),
      (n_B_manual[2] = StoN3(_.substr(e + 3, 1))),
      (n_B_manual[3] = StoN3(_.substr(e + 4, 2))),
      (n_B_manual[4] = StoN3(_.substr(e + 6, 1))),
      (n_B_manual[5] = StoN3(_.substr(e + 7, 2))),
      (n_B_manual[7] = StoN3(_.substr(e + 9, 2))),
      (n_B_manual[9] = StoN3(_.substr(e + 11, 2))),
      (n_B_manual[21] = StoN3(_.substr(e + 13, 2))),
      (n_B_manual[30] = StoN3(_.substr(e + 15, 3))),
      (n_B_manual[31] = StoN3(_.substr(e + 18, 2))),
      (n_B_manual[34] = StoN3(_.substr(e + 20, 2))),
      (n_B_manual[35] = StoN3(_.substr(e + 22, 2))),
      (n_B_manual[36] = StoN3(_.substr(e + 24, 2))),
      (n_B_manual[37] = StoN3(_.substr(e + 26, 2))),
      (n_B_manual[38] = StoN3(_.substr(e + 28, 2))),
      (n_B_manual[39] = StoN3(_.substr(e + 30, 2))),
      (n_B_manual[40] = StoN3(_.substr(e + 32, 3))),
      (n_B_manual[41] = StoN3(_.substr(e + 35, 2))),
      (n_B_manual[42] = StoN3(_.substr(e + 37, 3))),
      (n_B_manual[43] = StoN3(_.substr(e + 40, 3))),
      (n_B_manual[44] = StoN3(_.substr(e + 43, 2))),
      (n_B_manual[48] = StoN3(_.substr(e + 45, 2))),
      (n_B_manual[49] = StoN3(_.substr(e + 47, 2))),
      (n_B_manual[50] = StoN3(_.substr(e + 49, 2))),
      (n_B_manual[51] = StoN3(_.substr(e + 51, 2))),
      (n_B_manual[52] = StoN3(_.substr(e + 53, 2))),
      (n_B_manual[53] = StoN3(_.substr(e + 55, 3))),
      (n_B_manual[54] = StoN3(_.substr(e + 58, 2))),
      (n_B_manual[55] = StoN3(_.substr(e + 60, 2))),
      (e += 61)),
    (c.Conf01.value = StoN3(_.substr(e + 1, 2))),
    (c.B_num.value = StoN3(_.substr(e + 3, 1))),
    (c.A8_Skill14.value = StoN3(_.substr(e + 4, 1))),
    (c.A8_Skill15.value = StoN3(_.substr(e + 5, 2))),
    (u = StoN3(_.substr(e + 7, 1))),
    StCalc(1),
    ActiveSkillSetPlus(),
    (c.A_ActiveSkill.value = baseSkillId(StoN3(_.substr(e + 8, 2)))),
    ClickActiveSkill(),
    (c.A_ActiveSkillLV.value = StoN3(_.substr(e + 10, 1))),
    c.contains(c.SkillSubNum) && (c.SkillSubNum.value = StoN3(_.substr(e + 11, 3))));
  for (var U = 0, C = 0; C <= 20; C++)
    if (m_JobBuff[n_A_JOB][C] == 441) {
      if (
        (U = c.A_skill6.value) &&
        (SKILLID.FIRE_BOLT == n_A_ActiveSkill ||
          SKILLID.COLD_BOLT == n_A_ActiveSkill ||
          SKILLID.LIGHTNING_BOLT == n_A_ActiveSkill ||
          SKILLID.FIRE_BOLT_HINDSIGHT == n_A_ActiveSkill ||
          SKILLID.COLD_BOLT_HINDSIGHT == n_A_ActiveSkill ||
          SKILLID.LIGHTNING_BOLT_HINDSIGHT == n_A_ActiveSkill)
      ) {
        var r = 1 * U + 3;
        (myInnerHtml(
          "AASkill",
          'Double Bolt chance: <select name="SkillSubNum" onChange="calc()"></select>',
          0,
        ),
          (c.SkillSubNum.options[0] = new documento.Opzione("No chance (0%)", 0)),
          (c.SkillSubNum.options[1] = new documento.Opzione("Average chance (" + 10 * r + "%)", r)),
          (c.SkillSubNum.options[2] = new documento.Opzione("Max chance (100%)", 10)),
          (c.SkillSubNum.value = StoN3(_.substr(e + 11, 3))));
      }
      break;
    }
  var h = normalizeSavedMonsterId(StoN3(_.substr(e + 14, 2)), !1);
  ((targetData[0] = h),
    (c.B_Enemy.value = h),
    calc(),
    Bskill(),
    (c.B_AtkSkill.value = StoN3(_.substr(e + 16, 2))),
    BClickAtkSkill(),
    (n_B_AtkSkill = 1 * c.B_AtkSkill.value),
    (n_B_AtkSkill != 444 && n_B_AtkSkill != 445 && n_B_AtkSkill != 125 && n_B_AtkSkill != 131) ||
      (c.BSkillSubNum.value = StoN3(_.substr(e + 18, 3))),
    (c.B_AtkRange.value = StoN3(_.substr(e + 21, 1))),
    (c.B_AtkElem.value = StoN3(_.substr(e + 22, 1))),
    (c.maxASPD.value = StoN3(_.substr(e + 25, 1))),
    (c.A_DICASTES_SHOULDER_PRIMARY.value = StoN3(_.substr(e + 26, 1))),
    (c.A_DICASTES_SHOULDER_STATS.value = StoN3(_.substr(e + 27, 1))),
    (c.A_DICASTES_SHOES_PRIMARY.value = StoN3(_.substr(e + 28, 1))),
    (c.A_DICASTES_SHOES_STATS.value = StoN3(_.substr(e + 29, 1))),
    (c.A_DICASTES_ACCESSORY1_PRIMARY.value = StoN3(_.substr(e + 30, 1))),
    (c.A_DICASTES_ACCESSORY1_STATS.value = StoN3(_.substr(e + 31, 1))),
    (c.A_DICASTES_ACCESSORY2_PRIMARY.value = StoN3(_.substr(e + 32, 1))),
    (c.A_DICASTES_ACCESSORY2_STATS.value = StoN3(_.substr(e + 33, 1))),
    (c.A_DICASTES_SHOULDER_STATS2.value = StoN3(_.substr(e + 34, 1))),
    (c.A_DICASTES_SHOES_STATS2.value = StoN3(_.substr(e + 35, 1))),
    (c.A_DICASTES_ACCESSORY1_STATS2.value = StoN3(_.substr(e + 36, 1))),
    (c.A_DICASTES_ACCESSORY2_STATS2.value = StoN3(_.substr(e + 37, 1))),
    refreshFields(),
    calc());
  return !0;
}
for (
  n_NtoS3 = [
    "i",
    "'",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    ".",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "-",
    ":",
    ";",
    ",",
    "=",
    "$",
    "&",
    "+",
  ],
    EnName = [
      "Neutral",
      "Water",
      "Earth",
      "Fire",
      "Wind",
      "Poison",
      "Holy",
      "Shadow",
      "Ghost",
      "Undead",
    ],
    i = 0;
  i <= 9;
  i++
)
  ((documento.calcForm.A_Weapon_element.options[i] = new documento.Opzione(v_Element_[i], i)),
    (documento.calcForm.B_AtkElem.options[i] = new documento.Opzione(v_Element_[i], i)));
for (
  documento.calcForm.A_Weapon_element.options[0] = new documento.Opzione("(unchanged)", 0),
    documento.calcForm.A_Weapon_element.value = 0,
    documento.calcForm.B_AtkElem.options[i] = new documento.Opzione("(unchanged)", 10),
    m_CardShort = [
      ["(card shortcuts)", 0, 0, 0, 0],
      ["Remove All Cards", 1e4, 0],
      ["Remove Weapon's Cards", 0, 0, 0, 0],
      ["+40% [2 Race Card]", 1, 1, 0, 0],
      ["+60% [3 Race Card]", 1, 1, 1, 0],
      ["+80% [4 Race Card]", 1, 1, 1, 1],
      ["+61% [2 Race + 1 Size Cards]", 1, 1, 3, 0],
      ["+68% [2 Race + 1 Element Cards]", 1, 1, 2, 0],
      ["+84% [3 Race + 1 Size Cards]", 1, 1, 1, 3],
      ["+96% [2 Race + 2 Element Cards]", 1, 1, 2, 2],
      ["+110% [2 AK + 2 Race Cards]", 31, 31, 1, 1],
      ["+110% [3 AK + 1 Race Cards]", 31, 31, 31, 1],
      ["+110% [3 AK + 1 Element Cards]", 31, 31, 31, 2],
      ["2 Size Cards", 3, 3, 0, 0],
      ["3 Size Cards", 3, 3, 3, 0],
      ["4 Size Cards", 3, 3, 3, 3],
      ["1 Elemental Stone + 1 Star Crumb", 0, 106, 0, 0],
      ["1 Elemental Stone + 2 Star Crumbs", 0, 106, 106, 0],
      ["3 Star Crumbs", 106, 106, 106, 0],
      ["+40 ATK [2 Andre Cards]", 11, 11, 0, 0],
      ["+60 ATK [3 Andre Cards]", 11, 11, 11, 0],
      ["+80 ATK [4 Andre Cards]", 11, 11, 11, 11],
      ["+60 ATK [2 Zipper Bear Cards]", 326, 326, 0, 0],
      ["+90 ATK [3 Zipper Bear Cards]", 326, 326, 326, 0],
      ["+120 ATK [4 Zipper Bear Cards]", 326, 326, 326, 326],
      ["+18 CRIT [2 Soldier Skeleton Cards]", 41, 41, 0, 0],
      ["+27 CRIT [3 Soldier Skeleton Cards]", 41, 41, 41, 0],
      ["+36 CRIT [4 Soldier Skeleton Cards]", 41, 41, 41, 41],
      ["+40 HIT [2 Mummy Cards]", 40, 40, 0, 0],
      ["+60 HIT [3 Mummy Cards]", 40, 40, 40, 0],
      ["+80 HIT [4 Mummy Cards]", 40, 40, 40, 40],
      ["+60% [2 Orc Lady Cards]", 252, 252, 0, 0],
      ["+92% [2 Orc Lady + 1 Hydra Cards]", 252, 252, 13, 0],
      ["+128% [3 Orc Lady + 1 Hydra Cards]", 252, 252, 252, 13],
      ["+20% [2 Archer Skeleton Cards]", 107, 107, 0, 0],
      ["+30% [3 Archer Skeleton Cards]", 107, 107, 107, 0],
      ["+40% [4 Archer Skeleton Cards]", 107, 107, 107, 107],
      ["2 Fabre Cards", 4, 4, 0, 0],
      ["3 Fabre Cards", 4, 4, 4, 0],
      ["4 Fabre Cards", 4, 4, 4, 4],
      ["2 Drops Cards", 5, 5, 0, 0],
      ["3 Drops Cards", 5, 5, 5, 0],
      ["4 Drops Cards", 5, 5, 5, 5],
      ["+50% [2 Abysmal Knight Cards]", 31, 31, 0, 0],
      ["+75% [3 Abysmal Knight Cards]", 31, 31, 31, 0],
      ["+100% [4 Abysmal Knight Cards]", 31, 31, 31, 31],
      ["2 Crit Dmg +10%, CRIT +7 Cards", 156, 156, 0, 0],
      ["3 Crit Dmg +10%, CRIT +7 Cards", 156, 156, 156, 0],
      ["4 Crit Dmg +10%, CRIT +7 Cards", 156, 156, 156, 156],
      ["2 Cecil Damon Cards", 160, 160, 0, 0],
      ["3 Cecil Damon Cards", 160, 160, 160, 0],
      ["4 Cecil Damon Cards", 160, 160, 160, 160],
      ["Swordman Set", 1e4, 223, 347, 0, 317, 0, 362, 354, 0],
      ["Thief Set", 1e4, 233, 0, 0, 0, 295, 391, 395, 260],
      ["Acolyte Set", 1e4, 253, 383, 307, 301, 0, 0, 270, 0],
      ["Archer Set", 1e4, 279, 0, 0, 224, 340, 351, 230, 0],
      ["Magician Set", 1e4, 0, 337, 358, 220, 346, 379, 350, 0],
      ["Merchant Set", 1e4, 326, 376, 0, 281, 0, 388, 216, 0],
      ["Crusader Set", 1e4, 0, 347, 0, 190, 0, 362, 354, 0],
      ["Rogue Set", 1e4, 0, 113, 0, 0, 295, 391, 260, 413],
      ["Monk Set", 1e4, 253, 383, 0, 181, 0, 0, 270, 0],
      ["Bard/Dancer Set", 1e4, 279, 0, 0, 224, 340, 408, 230, 0],
      ["Sage Set", 1e4, 0, 337, 0, 193, 346, 379, 350, 0],
      ["Alchemist Set", 1e4, 326, 175, 0, 281, 0, 388, 104, 0],
      ["Test (for now)", 0, 0, 0, 0],
    ],
    i = 0;
  i <= 63;
  i++
)
  documento.calcForm.A_cardshort.options[i] = new documento.Opzione(m_CardShort[i][0], i);
var HSEname = ["STR", "AGI", "VIT", "INT", "DEX", "LUK"];
documento.calcForm.A_HSE.options[0] = new documento.Opzione("(enchant)", 0);
var iHSE = 1;
for (i = 0; i <= 5; i++)
  for (var j = 1; j <= 3; j++)
    ((documento.calcForm.A_HSE.options[iHSE] = new documento.Opzione(
      HSEname[i] + "+" + j,
      10 * i + j,
    )),
      iHSE++);
for (
  documento.calcForm.A_HSE_HEAD1.options[0] = new documento.Opzione(
    "(headgear Hidden Slot Enchant)",
    0,
  ),
    iHSE = 1,
    i = 0;
  i <= 5;
  i++
)
  for (j = 1; j <= 3; j++)
    ((documento.calcForm.A_HSE_HEAD1.options[iHSE] = new documento.Opzione(
      HSEname[i] + "+" + j,
      10 * i + j,
    )),
      iHSE++);
for (
  var BastionEnchantOptions = [
      ["(Bastion enchant)", BASTIONENCHANTID.NONE],
      ["All Stats +1", BASTIONENCHANTID.ALL_STATS],
      ["Movement Speed +20%", BASTIONENCHANTID.MOVEMENT_SPEED],
      ["Race Resist +5%", BASTIONENCHANTID.RACE_RESISTANCE],
      ["MATK +5%", BASTIONENCHANTID.MAGICAL_ATTACK],
      ["ATK +5%", BASTIONENCHANTID.PHYSICAL_ATTACK],
      ["SP Consumption -20%", BASTIONENCHANTID.SP_CONSUMPTION],
      ["Healing +10%", BASTIONENCHANTID.HEALING_EFFECTIVENESS],
    ],
    bastionControlIndex = 0;
  bastionControlIndex < 2;
  bastionControlIndex++
)
  for (
    var bastionControl =
        bastionControlIndex == 0
          ? documento.calcForm.A_BASTION_HEAD
          : documento.calcForm.A_BASTION_SHOES,
      bastionOptionIndex = 0;
    bastionOptionIndex < BastionEnchantOptions.length;
    bastionOptionIndex++
  )
    bastionControl.options[bastionOptionIndex] = new documento.Opzione(
      BastionEnchantOptions[bastionOptionIndex][0],
      BastionEnchantOptions[bastionOptionIndex][1],
    );
for (
  var DicastesPrimaryEnchantOptions = [
      ["(primary enchant)", DICASTESENCHANTID.NONE],
      ["Agile: FLEE +6", DICASTESENCHANTID.AGILE_6],
      ["Agile: FLEE +12", DICASTESENCHANTID.AGILE_12],
      ["Strong: ATK +2%", DICASTESENCHANTID.STRONG_2],
      ["Strong: ATK +3%", DICASTESENCHANTID.STRONG_3],
      ["Wise: MATK +1%", DICASTESENCHANTID.WISE_1],
      ["Wise: MATK +2%", DICASTESENCHANTID.WISE_2],
      ["Critical: CRIT +5", DICASTESENCHANTID.CRITICAL_5],
      ["Critical: CRIT +7", DICASTESENCHANTID.CRITICAL_7],
    ],
    DicastesStatEnchantOptions = [["(stat enchant)", 0]],
    DicastesStatNames = ["AGI", "DEX", "INT"],
    dicastesStatIndex = 0;
  dicastesStatIndex < DicastesStatNames.length;
  dicastesStatIndex++
)
  for (var dicastesSingleAmount = 1; dicastesSingleAmount <= 5; dicastesSingleAmount++) {
    var dicastesSingleId = 5 * dicastesStatIndex + dicastesSingleAmount;
    DicastesStatEnchantOptions.push([
      DicastesStatNames[dicastesStatIndex] + " +" + dicastesSingleAmount,
      dicastesSingleId,
    ]);
  }
for (
  var DicastesEnchantControls = [
      [
        documento.calcForm.A_DICASTES_SHOULDER_PRIMARY,
        documento.calcForm.A_DICASTES_SHOULDER_STATS,
        documento.calcForm.A_DICASTES_SHOULDER_STATS2,
      ],
      [
        documento.calcForm.A_DICASTES_SHOES_PRIMARY,
        documento.calcForm.A_DICASTES_SHOES_STATS,
        documento.calcForm.A_DICASTES_SHOES_STATS2,
      ],
      [
        documento.calcForm.A_DICASTES_ACCESSORY1_PRIMARY,
        documento.calcForm.A_DICASTES_ACCESSORY1_STATS,
        documento.calcForm.A_DICASTES_ACCESSORY1_STATS2,
      ],
      [
        documento.calcForm.A_DICASTES_ACCESSORY2_PRIMARY,
        documento.calcForm.A_DICASTES_ACCESSORY2_STATS,
        documento.calcForm.A_DICASTES_ACCESSORY2_STATS2,
      ],
    ],
    dicastesControlIndex = 0;
  dicastesControlIndex < DicastesEnchantControls.length;
  dicastesControlIndex++
) {
  for (
    var dicastesOptionIndex = 0;
    dicastesOptionIndex < DicastesPrimaryEnchantOptions.length;
    dicastesOptionIndex++
  )
    DicastesEnchantControls[dicastesControlIndex][0].options[dicastesOptionIndex] =
      new documento.Opzione(
        DicastesPrimaryEnchantOptions[dicastesOptionIndex][0],
        DicastesPrimaryEnchantOptions[dicastesOptionIndex][1],
      );
  for (
    dicastesOptionIndex = 0;
    dicastesOptionIndex < DicastesStatEnchantOptions.length;
    dicastesOptionIndex++
  )
    ((DicastesEnchantControls[dicastesControlIndex][1].options[dicastesOptionIndex] =
      new documento.Opzione(
        DicastesStatEnchantOptions[dicastesOptionIndex][0],
        DicastesStatEnchantOptions[dicastesOptionIndex][1],
      )),
      (DicastesEnchantControls[dicastesControlIndex][2].options[dicastesOptionIndex] =
        new documento.Opzione(
          DicastesStatEnchantOptions[dicastesOptionIndex][0],
          DicastesStatEnchantOptions[dicastesOptionIndex][1],
        )));
}
for (n_A_Buf2 = new Array(), i = 0; i <= 21; i++) n_A_Buf2[i] = 0;
for (n_A_Buf3 = new Array(), i = 0; i <= 46; i++) n_A_Buf3[i] = 0;
for (n_A_Buf6 = new Array(), i = 0; i <= 23; i++) n_A_Buf6[i] = 0;
for (n_A_Buf7 = new Array(), i = 0; i <= 60; i++) n_A_Buf7[i] = 0;
for (n_A_Buf8 = new Array(), i = 0; i <= 15; i++) n_A_Buf8[i] = 0;
for (n_A_Buf9 = new Array(), i = 0; i <= 59; i++) n_A_Buf9[i] = 0;
for (
  n_A_Buf9[2] = 10,
    n_A_Buf9[4] = 20,
    n_A_Buf9[6] = 23,
    n_A_Buf9[10] = 10,
    n_A_Buf9[12] = 20,
    n_A_Buf9[14] = 23,
    n_B_manual = new Array(),
    i = 0;
  i <= 55;
  i++
)
  n_B_manual[i] = 0;
for (n_A_debuf = new Array(), i = 0; i <= 3; i++) n_A_debuf[i] = 0;
for (n_B_debuf = new Array(), i = 0; i <= 24; i++) n_B_debuf[i] = 0;
for (n_B_buf = new Array(), i = 0; i <= 14; i++) n_B_buf[i] = 0;
for (n_A_Equip = new Array(), i = 0; i <= 20; i++) n_A_Equip[i] = 0;
for (n_A_card = new Array(), i = 0; i <= 25; i++) n_A_card[i] = 0;
for (tPlusTaiseiSyokia(), i = 0; i < m_TempEffect.length; i++)
  if (m_TempEffect[i][3] == 1) {
    var str =
      "<B>(Special Effect: [" +
      m_TempEffect[i][2] +
      "] can be activated under 'Additional Effects' at 'BUFF, ITEMS AND OTHER STUFF')</B>";
    m_Item[m_TempEffect[i][4]][10] == 0
      ? (m_Item[m_TempEffect[i][4]][10] = str)
      : (m_Item[m_TempEffect[i][4]][10] += "<BR>" + str);
  }
for (i = 0; i < m_TempEffect.length; i++)
  m_TempEffect[i][3] == 2 &&
    ((str =
      "<B>(Special Effect: [" +
      m_TempEffect[i][2] +
      "] can be activated under 'Additional Effects' at 'BUFF, ITEMS AND OTHER STUFF')</B>"),
    m_Card[m_TempEffect[i][4]][3] == 0
      ? (m_Card[m_TempEffect[i][4]][3] = str)
      : (m_Card[m_TempEffect[i][4]][3] += "<BR>" + str));
function refreshFields() {
  (ClickB_Item("SW"),
    debufSW(n_debufSW),
    EnemyBufSW(n_BbufSW),
    BufSW(n_SkillSW),
    Buf3SW(n_Skill3SW),
    Buf4SW(n_Skill4SW),
    Buf6SW(n_Skill6SW),
    Buf7SW(n_Skill7SW),
    Buf9SW(n_Skill9SW),
    Buf10SW(n_Skill10SW));
}
((documento.calcForm.B_AtkRange.value = 0),
  (documento.calcForm.B_AtkElem.value = 10),
  (c.maxASPD.value = 0),
  (documento.calcForm.all_dmgSkills.checked = !1),
  (documento.calcForm.restrict_jobequip.checked = !0),
  (documento.calcForm.restrict_lvlequip.checked = !1),
  (documento.calcForm.restrict_equipslot.checked = !1),
  (documento.calcForm.restrict_cardslot.checked = !1),
  (documento.calcForm.all_card.checked = !1),
  (documento.calcForm.A_JOB.value = 0),
  ClickJob(0),
  allCard(),
  EnemySort(),
  StCalc(),
  servers(),
  Bskill(),
  URLIN(),
  refreshFields(),
  restrictCardslot(0));
