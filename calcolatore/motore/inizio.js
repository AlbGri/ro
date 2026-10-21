// Avvio del motore: elenchi delle opzioni, stato iniziale e build nell'indirizzo
for (var c = documento.calcForm, i = 1; i <= 22; i++)
  c.B_num.options[i - 1] = new documento.Opzione(i, i - 1);
for (i = 1; i <= 20; i++) c.A8_Skill15.options[i] = new documento.Opzione(5 * i, i);
for (w_ASSP0bk = new Array(), i = 0; i < 20; i++) w_ASSP0bk[i] = 999;
for (wESx = new Array(), i = 0; i <= EnemyNum; i++) wESx[i] = new Array();
var nMANUKU = [523, 526, 527, 529, 530, 533, 540, 562, 563];
var nSUPURE = [524, 525, 528, 531, 532, 536, 561];
for (
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
    itemData[m_TempEffect[i][4]].description == 0
      ? (itemData[m_TempEffect[i][4]].description = str)
      : (itemData[m_TempEffect[i][4]].description += "<BR>" + str);
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
  leggiBuild(buildIndirizzo),
  refreshFields(),
  restrictCardslot(0));
