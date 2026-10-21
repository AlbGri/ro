((PvP = 0),
  (n_A_WeaponLV = 0),
  (n_A_Weapon2LV = 0),
  (n_Nitou = 0),
  (n_Reborn = 0),
  (n_WoE = 0),
  (n_rangedAtk = 0),
  (w_AG = [100, 95, 90, 86, 82, 79, 76, 74, 72, 71, 70]),
  (n_FeatSW = 0),
  (n_LogSW = 0),
  (n_itemSW = 0),
  (n_SkillSW = 0),
  (n_Skill3SW = 0),
  (n_Skill4SW = 0),
  (n_Skill5SW = 0),
  (n_Skill6SW = 0),
  (n_Skill7SW = 0),
  (n_Skill8SW = 0),
  (n_Skill9SW = 0),
  (n_Skill10SW = 0),
  (n_debufSW = 0),
  (n_BbufSW = 0),
  (wBCEDPch = 0),
  (wLAch = 0),
  (wCriTyuu = 0),
  (wBTw1 = 0),
  (n_TAKA_DMG = 0),
  (TyouEnkakuSousa3dan = 0),
  (not_use_card = 0));
var n_B_AtkSkill = 0,
  n_B_rangedAtk = 0,
  n_B_rangedMAtk = 0,
  BskillHitNum = 1,
  n_B_rawAverageDamage = 0,
  n_B_averageDamage = 0,
  n_B_minDamage = 0,
  n_B_maxDamage = 0;
((str_bSUBname = ""),
  (str_bSUB = ""),
  (SuperNoviceFullWeaponCHECK = 0),
  (cast_kotei = 0),
  (b = 0),
  (n_PerHIT_DMG = 0),
  (n_Delay = [0, 0, 0, 0, 0, 0, 0]),
  (wDelay = 0),
  (BK_n_A_CriATK = [0, 0, 0]),
  (bonusValues = new Array()));
for (var i = 0; i <= 450; i++) bonusValues[i] = 0;
var first_check = 0,
  targetData = new Array();
((Last_DMG_A = [0, 0, 0]),
  (Last_DMG_B = [0, 0, 0]),
  (InnStr = new Array()),
  (SG_Special_HITnum = 0),
  (SG_Special_DMG = [0, 0, 0]),
  (Item_or_Card = "Item"),
  (ItemCardNumberCheck = 142));
var c = documento.calcForm,
  equip_restrict = 1,
  card_restrict = 0,
  thirdClass = 0;
wLeft = [0, 0, 0];
var firstLoad = 0;
n_A_WeaponTypesArray = new Array();
var n_A_WeaponType = 0;
((v_Race = [
  "<b style='color:var(--color-formless)'>Formless</b>",
  "<b style='color:var(--color-undead)'>Undead</b>",
  "<b style='color:var(--color-earth)'>Brute</b>",
  "<b style='color:var(--color-plant)'>Plant</b>",
  "<b style='color:var(--color-positive)'>Insect</b>",
  "<b style='color:var(--color-water)'>Fish</b>",
  "<b style='color:var(--text)'>Demon</b>",
  "<b style='color:var(--color-human)'>Demi-Human</b>",
  "<b style='color:var(--color-angel)'>Angel</b>",
  "<b style='color:var(--color-negative)'>Dragon</b>",
]),
  (v_Race_ = [
    "Formless",
    "Undead",
    "Brute",
    "Plant",
    "Insect",
    "Fish",
    "Demon",
    "Demi-Human",
    "Angel",
    "Dragon",
  ]),
  (v_Element = [
    "<b style='color:var(--color-neutral)'>Neutral</b>",
    "<b style='color:var(--color-water)'>Water</b>",
    "<b style='color:var(--color-earth)'>Earth</b>",
    "<b style='color:var(--color-negative)'>Fire</b>",
    "<b style='color:var(--color-wind)'>Wind</b>",
    "<b style='color:var(--color-poison)'>Poison</b>",
    "<b style='color:var(--color-holy)'>Holy</b>",
    "<b style='color:var(--text)'>Shadow</b>",
    "<b style='color:var(--color-ghost)'>Ghost</b>",
    "<b style='color:var(--color-undead)'>Undead</b>",
  ]),
  (v_Element_ = [
    "Neutral ",
    "Water ",
    "Earth ",
    "Fire ",
    "Wind ",
    "Poison ",
    "Holy ",
    "Shadow ",
    "Ghost ",
    "Undead ",
  ]),
  (v_Size = ["Small", "Medium", "Large"]),
  (v_Effect = [
    "Poison",
    "Stun",
    "Freeze",
    "Curse",
    "Blind",
    "Sleep",
    "Silence",
    "Chaos",
    "Bleeding",
    "Stone",
    "Weapon Break",
    "Armor Break",
  ]),
  (v_EnergyCoat = [
    "0",
    "6% Reduction",
    "12% Reduction",
    "18% Reduction",
    "24% Reduction",
    "30% Reduction",
  ]),
  (v_Race2 = ["(none)", "Goblin", "Golem", "Guardian", "Kobold", "Orc", "Satan Morroc"]),
  (v_Type = ["Normal", "Boss"]),
  (SubName = [
    "%",
    " seconds",
    "Damage",
    "Critical Damage",
    "Critical Rate",
    "Over 10000 hits",
    "Too high to calculate",
    "Immesurable",
    " x ",
    "Cast Time",
    "Off",
    "On",
  ]),
  (JobName = [
    "Novice",
    "Swordman",
    "Thief",
    "Acolyte",
    "Archer",
    "Magician",
    "Merchant",
    "Knight",
    "Assassin",
    "Priest",
    "Hunter",
    "Wizard",
    "Blacksmith",
    "Crusader",
    "Rogue",
    "Monk",
    "Bard",
    "Dancer",
    "Sage",
    "Alchemist",
    "Super Novice",
    "Lord Knight",
    "Assassin Cross",
    "High Priest",
    "Sniper",
    "High Wizard",
    "Whitesmith",
    "Paladin",
    "Stalker",
    "Champion",
    "Minstrel (alt. name: Clown)",
    "Gypsy",
    "Scholar (alt. name: Professor)",
    "Biochemist (alt. name: Creator)",
    "High Novice",
    "High Swordman",
    "High Thief",
    "High Acolyte",
    "High Archer",
    "High Magician",
    "High Merchant",
    "Taekwon Kid",
    "Taekwon Master (alt. name: Star Gladiator)",
    "Soul Linker",
    "Ninja",
    "Gunslinger",
    "Rune Knight (non-trans)",
    "Rune Knight (trans)",
    "Guillotine Cross (non-trans)",
    "Guillotine Cross (trans)",
    "Arch Bishop (non-trans)",
    "Arch Bishop (trans)",
    "Ranger (non-trans)",
    "Ranger (trans)",
    "Warlock (non-trans)",
    "Warlock (trans)",
    "Mechanic (non-trans)",
    "Mechanic (trans)",
    "Royal Guard (non-trans)",
    "Royal Guard (trans)",
    "Shadow Chaser (non-trans)",
    "Shadow Chaser (trans)",
    "Sura (non-trans)",
    "Sura (trans)",
    "Maestro (non-trans)",
    "Maestro (trans)",
    "Wanderer (non-trans)",
    "Wanderer (trans)",
    "Sorcerer (non-trans)",
    "Sorcerer (trans)",
    "Geneticist (non-trans)",
    "Geneticist (trans)",
    "Kagero/Oboro",
    "Expanded Super Novice",
  ]));
var All_DMGskill = [
  0, 328, 244, 44, 41, 292, 169, 6, 391, 112, 408, 118, 248, 76, 73, 419, 66, 308, 259, 113, 417,
  54, 337, 424, 312, 40, 132, 17, 375, 373, 374, 382, 409, 271, 438, 52, 51, 122, 53, 415, 407, 398,
  272, 410, 111, 55, 130, 339, 162, 325, 84, 197, 321, 400, 25, 317, 318, 133, 333, 326, 161, 37,
  126, 405, 106, 56, 414, 127, 423, 7, 104, 65, 199, 264, 125, 46, 277, 193, 307, 70, 188, 189, 324,
  97, 335, 19, 399, 401, 159, 384, 171, 124, 207, 158, 167, 412, 83, 388, 263, 47, 72, 71, 275, 131,
  397, 192, 306, 57, 302, 331, 260, 418, 102, 88, 261, 128, 413,
];
function servers() {
  if (firstLoad == 0) {
    for (c.A_JOB.length = new documento.Opzione(JobName[i], i), i = 0; i <= 45; i++)
      c.A_JOB.options[i] = new documento.Opzione(JobName[i], i);
    for (
      c.A_Weapon_refine.length = 0,
        n_Nitou && (c.A_Weapon2_refine.length = 0),
        c.A_HEAD_REFINE.length = 0,
        c.A_LEFT_REFINE.length = 0,
        c.A_BODY_REFINE.length = 0,
        c.A_SHOULDER_REFINE.length = 0,
        c.A_SHOES_REFINE.length = 0,
        i = 0;
      i <= 10;
      i++
    )
      ((c.A_Weapon_refine.options[i] = new documento.Opzione("+" + i, i)),
        n_Nitou && (c.A_Weapon2_refine.options[i] = new documento.Opzione("+" + i, i)),
        (c.A_HEAD_REFINE.options[i] = new documento.Opzione("+" + i, i)),
        (c.A_LEFT_REFINE.options[i] = new documento.Opzione("+" + i, i)),
        (c.A_BODY_REFINE.options[i] = new documento.Opzione("+" + i, i)),
        (c.A_SHOULDER_REFINE.options[i] = new documento.Opzione("+" + i, i)),
        (c.A_SHOES_REFINE.options[i] = new documento.Opzione("+" + i, i)));
  }
  ((firstLoad = 1),
    (c.A_JOB.options[30].innerHTML = "Clown (iRO name: Minstrel)"),
    (c.A_JOB.options[32].innerHTML = "Professor (iRO name: Scholar)"),
    (c.A_JOB.options[33].innerHTML = "Creator (iRO name: Biochemist)"),
    (c.A_JOB.options[42].innerHTML = "Star Gladiator (iRO name: Taekwon Master)"));
  for (var e of c.A_ActiveSkill.options)
    1 * e.value == SKILLID.STAVE_CRASHER && (e.text = skillNameInSelect(SKILLID.STAVE_CRASHER));
  calc();
}
function restrictEquipslot() {
  ((equip_restrict = 1 * c.restrict_equipslot.checked),
    (n_A_WeaponType == 3 ||
      n_A_WeaponType == 5 ||
      n_A_WeaponType == 7 ||
      n_A_WeaponType == 10 ||
      n_A_WeaponType == 11 ||
      n_A_WeaponType == 16 ||
      n_A_WeaponType == 17 ||
      n_A_WeaponType == 18 ||
      n_A_WeaponType == 19 ||
      n_A_WeaponType == 20 ||
      n_A_WeaponType == 21 ||
      n_Nitou) &&
    equip_restrict
      ? ((c.A_LEFT_REFINE.disabled = !0),
        (c.A_LEFT_REFINE.value = 0),
        (c.A_left.disabled = !0),
        (c.A_left.value = 305),
        (c.A_left_card.disabled = !0),
        (c.A_left_card.value = 0))
      : ((c.A_LEFT_REFINE.disabled = !1),
        (c.A_left.disabled = !1),
        c.A_left.value &&
          card_restrict &&
          m_Item[c.A_left.value][5] != 0 &&
          (c.A_left_card.disabled = !1)));
}
function restrictCardslot(e) {
  if ((card_restrict = 1 * c.restrict_cardslot.checked)) {
    if (c.A_weapon1.value) {
      if (typeof (n = m_Item[c.A_weapon1.value][5]) == "string") {
        var _ = n.split("/");
        n = _[1];
      }
      ((c.A_weapon1_card1.disabled = !(n > 0)),
        (c.A_weapon1_card2.disabled = !(n > 1)),
        (c.A_weapon1_card3.disabled = !(n > 2)),
        (c.A_weapon1_card4.disabled = !(n > 3)));
    } else
      ((c.A_weapon1_card1.disabled = !0),
        (c.A_weapon1_card1.value = 0),
        (c.A_weapon1_card2.disabled = !0),
        (c.A_weapon1_card2.value = 0),
        (c.A_weapon1_card3.disabled = !0),
        (c.A_weapon1_card3.value = 0),
        (c.A_weapon1_card4.disabled = !0),
        (c.A_weapon1_card4.value = 0));
    if (n_Nitou)
      if (c.A_weapon2.value) {
        var n;
        (typeof (n = m_Item[c.A_weapon2.value][5]) == "string" && ((_ = n.split("/")), (n = _[1])),
          (c.A_weapon2_card1.disabled = !(n > 0)),
          (c.A_weapon2_card2.disabled = !(n > 1)),
          (c.A_weapon2_card3.disabled = !(n > 2)),
          (c.A_weapon2_card4.disabled = !(n > 3)));
      } else
        ((c.A_weapon2_card1.disabled = !0),
          (c.A_weapon2_card1.value = 0),
          (c.A_weapon2_card2.disabled = !0),
          (c.A_weapon2_card2.value = 0),
          (c.A_weapon2_card3.disabled = !0),
          (c.A_weapon2_card3.value = 0),
          (c.A_weapon2_card4.disabled = !0),
          (c.A_weapon2_card4.value = 0));
    (c.A_head1.value && m_Item[c.A_head1.value][5] != 0
      ? (c.A_head1_card.disabled = !1)
      : ((c.A_head1_card.disabled = !0), (c.A_head1_card.value = 0)),
      c.A_head2.value && m_Item[c.A_head2.value][5] != 0
        ? (c.A_head2_card.disabled = !1)
        : ((c.A_head2_card.disabled = !0), (c.A_head2_card.value = 0)),
      c.A_left.value && m_Item[c.A_left.value][5] != 0
        ? (c.A_left_card.disabled = !1)
        : ((c.A_left_card.disabled = !0), (c.A_left_card.value = 0)),
      c.A_body.value && m_Item[c.A_body.value][5] != 0
        ? (c.A_body_card.disabled = !1)
        : ((c.A_body_card.disabled = !0), (c.A_body_card.value = 0)),
      c.A_shoulder.value && m_Item[c.A_shoulder.value][5] != 0
        ? (c.A_shoulder_card.disabled = !1)
        : ((c.A_shoulder_card.disabled = !0), (c.A_shoulder_card.value = 0)),
      c.A_shoes.value && m_Item[c.A_shoes.value][5] != 0
        ? (c.A_shoes_card.disabled = !1)
        : ((c.A_shoes_card.disabled = !0), (c.A_shoes_card.value = 0)),
      c.A_acces1.value && m_Item[c.A_acces1.value][5] != 0
        ? (c.A_acces1_card.disabled = !1)
        : ((c.A_acces1_card.disabled = !0), (c.A_acces1_card.value = 0)),
      c.A_acces2.value && m_Item[c.A_acces2.value][5] != 0
        ? (c.A_acces2_card.disabled = !1)
        : ((c.A_acces2_card.disabled = !0), (c.A_acces2_card.value = 0)));
  } else
    ((c.A_weapon1_card1.disabled = !1),
      (c.A_weapon1_card2.disabled = !1),
      (c.A_weapon1_card3.disabled = !1),
      (c.A_weapon1_card4.disabled = !1),
      n_Nitou &&
        ((c.A_weapon2_card1.disabled = !1),
        (c.A_weapon2_card2.disabled = !1),
        (c.A_weapon2_card3.disabled = !1),
        (c.A_weapon2_card4.disabled = !1)),
      (c.A_head1_card.disabled = !1),
      c.A_head2.disabled ? (c.A_head2_card.disabled = !0) : (c.A_head2_card.disabled = !1),
      c.A_left.disabled ? (c.A_left_card.disabled = !0) : (c.A_left_card.disabled = !1),
      (c.A_body_card.disabled = !1),
      (c.A_shoulder_card.disabled = !1),
      (c.A_shoes_card.disabled = !1),
      (c.A_acces1_card.disabled = !1),
      (c.A_acces2_card.disabled = !1));
  calc();
}
function myInnerHtml(e, _, n) {
  if (n == 0) {
    for (wIHOB = documento.getElementById(e); wIHOB.hasChildNodes();)
      wIHOB.removeChild(wIHOB.firstChild);
    wIHOB.innerHTML = _;
  } else ((wIHOB = documento.getElementById(e)), wIHOB.insertAdjacentHTML("BeforeEnd", _));
}
function BattleCalc999() {
  ((wMod = 1),
    (wCast = 0),
    (wHITsuu = 1),
    (n_rangedAtk = 0),
    (wLAch = 0),
    (w_DMG = [0, 0, 0]),
    (not_use_card = 0),
    (cast_kotei = 0),
    (str_PerHIT_DMG = 0),
    (SG_Special_ch = 0));
  for (var e = 0; e <= 2; e++) ((Last_DMG_A[e] = 0), (Last_DMG_B[e] = 0));
  if (
    ((str_bSUBname = ""),
    (str_bSUB = ""),
    SKILLID.BASIC_ATTACK == n_A_ActiveSkill ||
      SKILLID.FOCUSED_ARROW_STRIKE == n_A_ActiveSkill ||
      SKILLID.SHADOW_SLASH == n_A_ActiveSkill ||
      (SKILLID.POISON_REACT == n_A_ActiveSkill && 50 <= targetData[3] && targetData[3] < 60) ||
      (myInnerHtml("CRIATK", "", 0),
      myInnerHtml("CRInum", "", 0),
      myInnerHtml("CRIATKname", "", 0),
      myInnerHtml("bSUB3name", "", 0),
      myInnerHtml("bSUB3", "", 0)),
    (n_A_WeaponType != 10 &&
      n_A_WeaponType != 17 &&
      n_A_WeaponType != 18 &&
      n_A_WeaponType != 19 &&
      n_A_WeaponType != 20 &&
      n_A_WeaponType != 21) ||
      SKILLID.BASIC_ATTACK != n_A_ActiveSkill ||
      (n_rangedAtk = 1),
    SKILLID.BASIC_ATTACK == n_A_ActiveSkill ||
      (SKILLID.POISON_REACT == n_A_ActiveSkill && 50 <= targetData[3] && targetData[3] < 60))
  )
    if (
      (myInnerHtml("CRIATKname", "Critical damage (Critical rate)", 0),
      myInnerHtml("bSUB3name", "", 0),
      myInnerHtml("bSUB3", "", 0),
      SKILLID.POISON_REACT == n_A_ActiveSkill && (n_Delay[0] = 1),
      n_Nitou)
    ) {
      if (
        ((TyouEnkakuSousa3dan = 0),
        (n_A_workDEX = Math.floor(n_A_DEX * (1 + 0.2 * (n_A_Weapon2LV - 1)))),
        n_A_workDEX >= n_A_Weapon2_ATK
          ? (w_left_Maxatk =
              n_A_ATK + n_A_Weapon2LV_Maxplus + Math.floor((n_A_Weapon2_ATK + wImp) * wCSize))
          : (w_left_Maxatk =
              n_A_ATK + n_A_Weapon2LV_Maxplus + Math.floor((n_A_Weapon2_ATK - 1 + wImp) * wCSize)),
        (w_left_Maxatk = BattleCalc4(w_left_Maxatk * wMod, 2, 1)),
        w_left_Maxatk < 1 && (w_left_Maxatk = 1),
        (w_left_Maxatk = Math.floor(
          w_left_Maxatk * Math.max(0, element[targetData[3]][n_A_Weapon2_element]),
        )),
        (w_left_star = 0),
        n_A_card[4] == 106 && n_A_card[5] == 106 && n_A_card[6] == 106)
      )
        w_left_star += 40;
      else for (e = 4; e <= 6; e++) m_Card[n_A_card[e]][0] == 106 && (w_left_star += 5);
      (n_A_card[7] == 106 && (w_left_star += 10),
        (w_left_Maxatk += w_left_star),
        (w_left_Maxatk = (w_left_Maxatk * (3 + SkillSearch(SKILLID.LEFT_HAND_MASTERY))) / 10),
        (w_left_Maxatk = Math.floor(w_left_Maxatk)),
        n_A_workDEX > n_A_Weapon2_ATK && (n_A_workDEX = n_A_Weapon2_ATK),
        (w_left_Minatk =
          n_A_ATK + n_A_Weapon2LV_Minplus + Math.floor((n_A_workDEX + wImp) * wCSize)),
        (w_left_Minatk = BattleCalc4(w_left_Minatk * wMod, 0, 1)),
        w_left_Minatk < 1 && (w_left_Minatk = 1),
        (w_left_Minatk = Math.floor(
          w_left_Minatk * Math.max(0, element[targetData[3]][n_A_Weapon2_element]),
        )),
        (w_left_Minatk += w_left_star),
        (w_left_Minatk *= 0.3 + SkillSearch(SKILLID.LEFT_HAND_MASTERY) / 10),
        (w_left_Minatk = Math.floor(w_left_Minatk)),
        (w_left_Aveatk = (w_left_Maxatk + w_left_Minatk) / 2),
        (w_left_Maxatk = tPlusDamCut(w_left_Maxatk)),
        (w_left_Minatk = tPlusDamCut(w_left_Minatk)),
        (w_left_Aveatk = tPlusDamCut(w_left_Aveatk)),
        (wLeft = [w_left_Minatk, w_left_Aveatk, w_left_Maxatk]),
        ATKmod02(wMod, 0),
        (n_Min_DMG += w_left_Minatk),
        (n_Max_DMG += w_left_Maxatk),
        (w_DMG[0] = BattleCalc(n_A_DMG[0], 0)));
      var _ = w_DMG[0] + EDP_DMG(0);
      ((Last_DMG_A[0] = Last_DMG_B[0] = _ + w_left_Minatk),
        (InnStr[0] += Last_DMG_A[0] + " (" + _ + " + " + w_left_Minatk + ")"),
        w998D &&
          ((str_bSUBname += "Double Attack damage (chance)<BR>"),
          (str_bSUB += 2 * _ + w_left_Minatk + "~")),
        _ + w_left_Minatk < n_Min_DMG && critChance < 100 && (n_Min_DMG = _ + w_left_Minatk),
        (w_DMG[0] = n_Min_DMG),
        (w_DMG[2] = BattleCalc(n_A_DMG[2], 2)),
        (_ = w_DMG[2] + EDP_DMG(2)),
        (Last_DMG_A[2] = Last_DMG_B[2] = _ + w_left_Maxatk),
        (InnStr[2] += Last_DMG_A[2] + " (" + _ + " + " + w_left_Maxatk + ")"),
        w998D &&
          ((_ = 2 * (w_DMG[2] + EDP_DMG(2)) + w_left_Maxatk),
          (str_bSUB += _ + " (" + w998D + "%)<BR>")),
        _ > n_Max_DMG && critChance < 100 && (n_Max_DMG = _),
        (w_DMG[2] = n_Max_DMG),
        (w_DMG[1] = BattleCalc(n_A_DMG[1], 1)),
        (_ = w_DMG[1] + EDP_DMG(1)),
        (Last_DMG_A[1] = Last_DMG_B[1] = _ + w_left_Aveatk),
        (InnStr[1] += Last_DMG_A[1] + " (" + _ + " + " + w_left_Aveatk + ")"),
        (w_DMG[1] = BattleCalc3(w_DMG[1])),
        (w_DMG[1] += BattleCalc3left(w_left_Aveatk)),
        (w_DMG[1] += EDP_DMG(1)),
        (_ = BattleCalc2(0)));
      var n = Math.floor(w_left_star * (0.3 + SkillSearch(SKILLID.LEFT_HAND_MASTERY) / 10));
      ((n_PerHIT_DMG = _ + n), (str_PerHIT_DMG = _ + "+" + n), CastAndDelay(), BattleCalc998());
    } else {
      if (
        ((n_TAKA_DMG = 0),
        (wTAKA = BattleTAKA()),
        (TyouEnkakuSousa3dan = 0),
        SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW))
      ) {
        ((TyouEnkakuSousa3dan = -1),
          (wBC3_3danAtkMod = 0.2 * SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW)));
        var a = [0, 0, 0];
        for (e = 0; e <= 2; e++)
          ((a[e] = BattleCalc(n_A_DMG[e] * (wMod + wBC3_3danAtkMod), e) + EDP_DMG(e)),
            (a[e] = 3 * Math.floor(a[e] / 3)),
            targetData[19] == 5 && (a[e] = 3));
        ((str_bSUBname += skillName(187) + " damage<BR>"),
          SkillSearch(SKILLID.SLS_TEAM_UP)
            ? (str_bSUB +=
                a[0] +
                "~" +
                a[2] +
                " (" +
                (30 - SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW)) *
                  (1.5 + 0.5 * SkillSearch(SKILLID.SLS_TEAM_UP)) +
                "% chance)<BR>")
            : (str_bSUB +=
                a[0] +
                "~" +
                a[2] +
                " (" +
                (30 - SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW)) +
                "% chance)<BR>"),
          (TyouEnkakuSousa3dan = 0),
          n_Min_DMG > a[0] && (n_Min_DMG = a[0]),
          n_Max_DMG < a[2] && (n_Max_DMG = a[2]));
      }
      for (ATKmod02(wMod, 0), e = 0; e <= 2; e++) w_DMG[e] = BattleCalc(n_A_DMG[e], e);
      var o = [0, 0, 0],
        t = 0;
      if (n_A_WeaponType == 11) {
        for (e = 0; e <= 2; e++)
          o[e] = Math.floor(
            (w_DMG[e] + EDP_DMG(e)) * (0.01 + 0.02 * SkillSearch(SKILLID.DOUBLE_ATTACK)),
          );
        t = Math.floor(w_DMG[1] * (0.01 + 0.02 * SkillSearch(SKILLID.DOUBLE_ATTACK)));
      }
      ((Last_DMG_B[0] = w_DMG[0] + EDP_DMG(0)),
        (Last_DMG_A[0] = Last_DMG_B[0] + o[0]),
        (InnStr[0] += Last_DMG_A[0]),
        n_A_WeaponType == 11 &&
          (InnStr[0] = Last_DMG_A[0] + " (" + Last_DMG_B[0] + "+" + o[0] + ")"),
        Last_DMG_A[0] < n_Min_DMG && critChance < 100 && (n_Min_DMG = Last_DMG_A[0]),
        w998D &&
          (n_A_WeaponType == 17 && SkillSearch(SKILLID.CHAIN_ACTION)
            ? CardNumSearch(43) ||
              n_A_Equip[2] == 570 ||
              n_A_Equip[2] == 1442 ||
              n_A_Equip[2] == 1443 ||
              n_A_Equip[2] == 1321 ||
              (EquipNumSearch(EQUIPID.WANDERERS_SAKKAT_PLUS_WANDERERS_COAT) &&
                n_A_SHOULDER_REFINE >= 5)
              ? (str_bSUBname += "Double Attack damage (chance)<BR>")
              : (str_bSUBname += "Chain Action damage (chance)<BR>")
            : (str_bSUBname += "Double Attack damage (chance)<BR>"),
          (str_bSUB += 2 * Last_DMG_A[0] + "~")),
        (w_DMG[0] = n_Min_DMG),
        (Last_DMG_B[2] = w_DMG[2] + EDP_DMG(2)),
        (Last_DMG_A[2] = Last_DMG_B[2] + o[2]),
        (InnStr[2] += Last_DMG_A[2]),
        n_A_WeaponType == 11 &&
          (InnStr[2] = Last_DMG_A[2] + " (" + Last_DMG_B[2] + "+" + o[2] + ")"),
        (n_Max_DMG += n_TAKA_DMG),
        (_ = Last_DMG_A[2]),
        (_ += n_TAKA_DMG),
        n_Max_DMG < _ && critChance < 100 && (n_Max_DMG = _),
        w998D &&
          ((_ = 2 * (w_DMG[2] + EDP_DMG(2) + o[2])),
          (str_bSUB += _ + " (" + w998D + "%)<BR>"),
          (_ += n_TAKA_DMG),
          n_Max_DMG < _ && (n_Max_DMG = _)),
        (w_DMG[2] = n_Max_DMG),
        (Last_DMG_B[1] = w_DMG[1] + EDP_DMG(1)),
        (Last_DMG_A[1] = Last_DMG_B[1] + o[1]),
        (InnStr[1] += Last_DMG_A[1]),
        n_A_WeaponType == 11 &&
          (InnStr[1] = Last_DMG_A[1] + " (" + Last_DMG_B[1] + "+" + o[1] + ")"),
        SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW) && (TyouEnkakuSousa3dan = a[1]),
        (w_DMG[1] += t),
        (w_DMG[1] = BattleCalc3(w_DMG[1])),
        (w_DMG[1] += wTAKA),
        (w_DMG[1] += EDP_DMG(1)),
        CastAndDelay(),
        BattleCalc998());
    }
  else {
    if (
      SKILLID.FOCUSED_ARROW_STRIKE == n_A_ActiveSkill ||
      SKILLID.SHADOW_SLASH == n_A_ActiveSkill
    ) {
      for (
        myInnerHtml("CRIATKname", "Critical damage (Critical rate)", 0),
          myInnerHtml("bSUB3name", "", 0),
          myInnerHtml("bSUB3", "", 0),
          SKILLID.FOCUSED_ARROW_STRIKE == n_A_ActiveSkill
            ? ((n_rangedAtk = 1),
              (wMod += 1 + 0.5 * n_A_ActiveSkillLV),
              (wCast = 2 * n_A_CAST),
              (n_Delay[2] = 1.5))
            : ((n_Delay[0] = 1), (n_rangedAtk = 0), (wMod += n_A_ActiveSkillLV - 1)),
          e = 0;
        e <= 2;
        e++
      )
        n_A_CriATK[e] = BK_n_A_CriATK[e];
      for (ATKmod02(wMod, 1), wCriTyuu = 1, e = 0; e <= 2; e++)
        n_A_CriATK[e] = BattleCalc(n_A_CriATK[e], 10);
      for (wCriTyuu = 0, e = 0; e <= 2; e++) n_A_CriATK[e] += EDP_DMG(e);
      for (
        critChance >= 100 && (n_Min_DMG = n_A_CriATK[0]),
          critChance > 0 && (n_Max_DMG = n_A_CriATK[2]),
          myInnerHtml("CRIATK", n_A_CriATK[0] + "~" + n_A_CriATK[2], 0),
          ATKmod02(wMod, 0),
          e = 0;
        e <= 2;
        e++
      )
        ((w_DMG[e] = BattleCalc(n_A_DMG[e], e)),
          (Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e] + EDP_DMG(e)),
          (InnStr[e] += Last_DMG_A[e]));
      return (
        critChance >= 100 && (w_DMG[0] = n_Min_DMG),
        critChance > 0 && (w_DMG[2] = n_Max_DMG),
        (w_DMG[1] = BattleCalc3(w_DMG[1])),
        EDPplus(1),
        CastAndDelay(),
        void BattleCalc998()
      );
    }
    for (
      w_ActS = [
        6,
        7,
        19,
        41,
        44,
        65,
        71,
        72,
        73,
        83,
        84,
        111,
        158,
        161,
        847,
        169,
        171,
        176,
        188,
        189,
        199,
        207,
        248,
        260,
        261,
        264,
        288,
        289,
        290,
        292,
        302,
        303,
        305,
        306,
        307,
        308,
        326,
        317,
        318,
        331,
        333,
        335,
        337,
        339,
        382,
        388,
        398,
        400,
        419,
        423,
        428,
        430,
        431,
        432,
        434,
        435,
        436,
        437,
        "NULL",
      ],
        iw = 0;
      w_ActS[iw] != n_A_ActiveSkill && w_ActS[iw] != "NULL";
      iw++
    );
    if (n_A_ActiveSkill == w_ActS[iw]) {
      if (((wActiveHitNum = 1), SKILLID.BASH == n_A_ActiveSkill)) wMod += 0.3 * n_A_ActiveSkillLV;
      else if (SKILLID.MAGNUM_BREAK == n_A_ActiveSkill)
        ((wMod += 0.2 * n_A_ActiveSkillLV), (n_A_Weapon_element = 3), (n_Delay[2] = 2));
      else if (SKILLID.SAND_ATTACK == n_A_ActiveSkill)
        ((not_use_card = 1), (wMod += 0.3), (n_A_Weapon_element = 2));
      else if (SKILLID.ARROW_SHOWER == n_A_ActiveSkill)
        ((n_rangedAtk = 1), (wMod += 0.05 * n_A_ActiveSkillLV - 0.25), (n_Delay[2] = 1));
      else if (SKILLID.ARROW_REPEL == n_A_ActiveSkill)
        ((n_rangedAtk = 1), (wCast = 1.5), (wMod += 0.5));
      else if (SKILLID.MAMMONITE == n_A_ActiveSkill) wMod += 0.5 * n_A_ActiveSkillLV;
      else if (SKILLID.SPEAR_STAB == n_A_ActiveSkill)
        ((wMod += 0.2 * n_A_ActiveSkillLV), (n_rangedAtk = 1));
      else if (SKILLID.GRIMTOOTH == n_A_ActiveSkill)
        (n_A_ActiveSkillLV >= 3 && (n_rangedAtk = 1), (wMod += 0.2 * n_A_ActiveSkillLV));
      else if (SKILLID.SMITE == n_A_ActiveSkill)
        ((wMod += 0.2 * n_A_ActiveSkillLV), m_Item[n_A_Equip[5]][0] == 305 && (wMod = 0));
      else if (SKILLID.HOLY_CROSS == n_A_ActiveSkill || SKILLID.HOLY_CROSS_UARO == n_A_ActiveSkill)
        ((wMod += 0.35 * n_A_ActiveSkillLV),
          SKILLID.HOLY_CROSS_UARO == n_A_ActiveSkill && n_A_WeaponType == 5 && (wMod *= 2),
          (n_A_Weapon_element = 6));
      else if (SKILLID.SIGHTLESS_MIND == n_A_ActiveSkill) wMod += 0.4 * n_A_ActiveSkillLV;
      else if (SKILLID.SPEAR_BOOMERANG == n_A_ActiveSkill)
        ((wMod += 0.5 * n_A_ActiveSkillLV), (n_Delay[2] = 1), (n_rangedAtk = 1));
      else if (SKILLID.BRANDISH_SPEAR == n_A_ActiveSkill)
        ((A = 1 + 0.2 * n_A_ActiveSkillLV),
          SKILLID.HP_RECOVERY_WHILE_MOVING == n_A_ActiveSkillLV
            ? (wMod += 4.625)
            : n_A_ActiveSkillLV >= 7
              ? (wMod += A + A / 2 + A / 4 - 1)
              : n_A_ActiveSkillLV >= 4
                ? (wMod += A + A / 2 - 1)
                : (wMod += A - 1),
          (wCast = 0.7));
      else if (
        SKILLID.SONIC_BLOW == n_A_ActiveSkill ||
        SKILLID.SONIC_BLOW_SOUL_LINKED == n_A_ActiveSkill
      )
        ((wActiveHitNum = 8),
          (wMod += 0.5 * n_A_ActiveSkillLV + 2),
          SKILLID.SONIC_BLOW_SOUL_LINKED == n_A_ActiveSkill && PvP == 0 && (wMod *= 2),
          SKILLID.SONIC_BLOW_SOUL_LINKED == n_A_ActiveSkill &&
            PvP == 1 &&
            (n_WoE ? (wMod *= 1.25) : (wMod *= 2)),
          (n_Delay[3] = 2));
      else if (SKILLID.FREEZING_TRAP == n_A_ActiveSkill)
        ((n_Delay[0] = 1), (not_use_card = 1), (n_A_Weapon_element = 1));
      else if (SKILLID.BACK_STAB == n_A_ActiveSkill)
        ((wMod += 0.4 * n_A_ActiveSkillLV + 2),
          // uaRO: ricarica fissa di 0,333 secondi al posto del ritardo dopo il lancio (Class
          // Changes, Rogue; patch del 01/04/2026)
          (n_Delay[3] = 0.333),
          (w_HIT = 100),
          (w_HIT_HYOUJI = 100));
      else if (SKILLID.GANK == n_A_ActiveSkill)
        ((wMod += 0.3 * n_A_ActiveSkillLV), (n_Delay[2] = 1));
      else if (SKILLID.RAGING_QUADRUPLE_BLOW == n_A_ActiveSkill)
        ((wActiveHitNum = 4),
          (wMod += 0.5 + 0.5 * n_A_ActiveSkillLV),
          (n_Delay[0] = 1),
          (n_Delay[1] = 0.1),
          (n_Delay[3] = 1 - 0.004 * n_A_AGI - 0.002 * n_A_DEX));
      else if (SKILLID.RAGING_THRUST == n_A_ActiveSkill)
        ((wMod += 1.4 + 0.6 * n_A_ActiveSkillLV),
          (n_Delay[0] = 1),
          (n_Delay[1] = 0.1),
          (n_Delay[3] = 0.7 - 0.004 * n_A_AGI - 0.002 * n_A_DEX));
      else if (
        SKILLID.MELODY_STRIKE == n_A_ActiveSkill ||
        SKILLID.SLINGING_ARROW == n_A_ActiveSkill
      )
        ((wCast = 1.5),
          (wMod += 0.4 * n_A_ActiveSkillLV - 0.4),
          (n_A_Weapon_element = m_Arrow[n_A_Arrow][1]),
          1 * c.A_Weapon_element.value != 0 && (n_A_Weapon_element = 1 * c.A_Weapon_element.value),
          (n_rangedAtk = 1));
      else if (SKILLID.BOMB == n_A_ActiveSkill)
        ((not_use_card = 1),
          (n_A_Weapon_element = 3),
          (n_Delay[0] = 1),
          (wCast = 1),
          (wMod += 0.2 * n_A_ActiveSkillLV),
          (w_HIT = 100),
          (w_HIT_HYOUJI = 100));
      else if (SKILLID.TRAUMATIC_BLOW == n_A_ActiveSkill)
        ((n_rangedAtk = 1), (wMod += 0.4 * n_A_ActiveSkillLV), (n_Delay[2] = 0.5));
      else if (SKILLID.VITAL_STRIKE == n_A_ActiveSkill)
        ((n_rangedAtk = 1),
          (wMod += 0.1 * n_A_ActiveSkillLV - 0.5),
          n_A_ActiveSkillLV > 5 ? (n_Delay[2] = 1) : (n_Delay[2] = 0.8));
      else if (SKILLID.METEOR_ASSAULT == n_A_ActiveSkill)
        ((not_use_card = 1),
          (wMod += 0.4 * n_A_ActiveSkillLV - 0.6),
          (wCast = 0.5),
          (n_Delay[2] = 0.5));
      else if (SKILLID.RAGING_PALM_STRIKE == n_A_ActiveSkill)
        ((wMod += 1 + n_A_ActiveSkillLV), (n_Delay[2] = 0.3));
      else if (SKILLID.GLACIER_FIST == n_A_ActiveSkill)
        ((n_Delay[0] = 1),
          (wMod += n_A_ActiveSkillLV - 0.6),
          (n_Delay[1] = 0.1),
          (n_Delay[3] = 0.7 - 0.004 * n_A_AGI - 0.002 * n_A_DEX));
      else if (SKILLID.CHAIN_CRUSH_COMBO == n_A_ActiveSkill)
        ((n_Delay[0] = 1),
          (wMod += 3 + n_A_ActiveSkillLV),
          n_A_ActiveSkillLV > 6 ? (n_Delay[2] = 1) : (n_Delay[2] = 0.8));
      else if (SKILLID.ARROW_VULCAN == n_A_ActiveSkill)
        ((wActiveHitNum = 9),
          (wMod += 1 + n_A_ActiveSkillLV),
          (n_A_Weapon_element = m_Arrow[n_A_Arrow][1]),
          1 * c.A_Weapon_element.value != 0 && (n_A_Weapon_element = 1 * c.A_Weapon_element.value),
          (n_rangedAtk = 1),
          (wCast = 1.8 + 0.2 * n_A_ActiveSkillLV),
          (n_A_Equip[0] == EQUIPID.GREEN_WHISTLE || n_A_Equip[0] == EQUIPID.STEM_WHIP) &&
            (wCast = Math.max(0, wCast - 2)),
          n_A_ActiveSkillLV >= 6 ? (n_Delay[2] = 1) : (n_Delay[2] = 0.8),
          // uaRO: Arrow Vulcan: ritardo di 2 secondi, non 3 (Class Changes, Bard/Dancer; patch del
          // 24/11/2025)
          (n_Delay[3] = 2));
      else if (SKILLID.TOMAHAWK_THROWING == n_A_ActiveSkill)
        ((n_rangedAtk = 1), (not_use_card = 1), (n_A_Weapon_element = 4));
      else if (SKILLID.PULSE_STRIKE == n_A_ActiveSkill) wMod += 1 * (n_A_ActiveSkillLV - 1);
      else if (SKILLID.THROW_VENOM_KNIFE == n_A_ActiveSkill)
        ((n_rangedAtk = 1),
          (not_use_card = 1),
          (n_A_DMG[1] += Math.floor(14.5 * wCSize)),
          (n_A_DMG[2] += Math.floor(29 * wCSize)));
      else if (SKILLID.PHANTASMIC_ARROW == n_A_ActiveSkill)
        ((n_rangedAtk = 1), (not_use_card = 1), (wMod += 0.5));
      else if (SKILLID.CHARGE_ATTACK == n_A_ActiveSkill) {
        var A;
        ((A = 1 * c.SkillSubNum.value),
          (wMod += A),
          (wCast = 0.5 * (A + 1)),
          wCast > 1.5 && (wCast = 1.5));
      } else
        switch (n_A_ActiveSkill) {
          case 317:
            ((n_Delay[0] = 1),
              (n_Delay[5] = 0.05),
              targetData[19] == 1 && (n_Delay[5] = 0.1),
              PvP == 1 && ((str_bSUBname += "SP damage<BR>"), (str_bSUB += "15<BR>")));
            break;
          case 318:
            ((n_Delay[5] = 0.05),
              targetData[19] == 1 && (n_Delay[5] = 0.1),
              PvP == 1 &&
                ((n_Delay[0] = 1), (str_bSUBname += "SP damage<BR>"), (str_bSUB += "15<BR>")));
            break;
          case 326:
            ((not_use_card = 1),
              (CT_WEIGHT = 1 * c.SkillSubNum.value),
              CT_WEIGHT == 0
                ? (SkillSearch(SKILLID.POWER_THRUST) &&
                    (wMod +=
                      0.146 +
                      Math.floor(
                        (((bonusValues[22] + 5 * SkillSearch(SKILLID.POWER_THRUST)) / 100) * 100) /
                          100,
                      )),
                  SkillSearch(SKILLID.MAXIMUM_POWER_THRUST) &&
                    (wMod +=
                      0.215 +
                      Math.floor(
                        (((bonusValues[22] + 10 * SkillSearch(SKILLID.MAXIMUM_POWER_THRUST)) /
                          100) *
                          100) /
                          100,
                      )))
                : (wMod +=
                    0.02 +
                    Math.floor(
                      (((CT_WEIGHT / (16 - n_A_ActiveSkillLV) +
                        bonusValues[22] +
                        5 * SkillSearch(SKILLID.POWER_THRUST) +
                        20 * SkillSearch(SKILLID.MAXIMUM_POWER_THRUST)) /
                        100) *
                        100) /
                        100,
                    )));
            break;
          case 382:
            ((not_use_card = 1), (wMod += 2));
            break;
          case 331:
          case 333:
            ((n_Delay[0] = 1), (wMod += 0.6 + 0.2 * n_A_ActiveSkillLV));
            break;
          case 335:
          case 337:
            ((n_Delay[0] = 1),
              (wMod += 0.9 + 0.3 * n_A_ActiveSkillLV),
              SKILLID.COUNTER_KICK == n_A_ActiveSkill && (wActiveHitNum = 3));
            break;
          case 339:
            ((n_Delay[0] = 1), (wMod += 0.1 * n_A_ActiveSkillLV - 0.7));
            break;
          case 305:
            ((n_Delay[0] = 1),
              SkillSearch(SKILLID.SPRINT_STR_STATE) && n_A_WeaponType == 0
                ? (wMod += 0.08 * n_A_BaseLV - 1)
                : (wMod += 0.04 * n_A_BaseLV - 1));
            break;
          case 398:
            ((wMod += 0.1 * n_A_ActiveSkillLV), (n_Delay[2] = 3));
            break;
          case 400:
            ((n_Delay[0] = 1), (wMod += 0.1 * n_A_ActiveSkillLV), (n_Delay[2] = 1));
            break;
          case 419:
            ((not_use_card = 1),
              (wCast = 0.5),
              (n_Delay[2] = 1),
              (n_rangedAtk = 1),
              (wActiveHitNum = 5),
              (targetData[2] != 2 && targetData[2] != 7) || (wMod += 4));
            break;
          case 423:
            ((n_rangedAtk = 1), (n_Delay[2] = 0.5), (n_A_Weapon_element = 8), (not_use_card = 1));
            break;
          case SKILLID.TRIGGER_HAPPY_SHOT:
            ((n_rangedAtk = 1),
              (wActiveHitNum = 5),
              (wMod += 0.5 * n_A_ActiveSkillLV + 4),
              (n_Delay[2] = 0.75));
            break;
          case 430:
            (n_A_Weapon_refine > 8 && EquipNumSearch(EQUIPID.GLORIOUS_RIFLE)
              ? (TCcast = 1.25)
              : EquipNumSearch(EQUIPID.SOLDIER_RIFLE)
                ? (TCcast = 0.75)
                : (TCcast = 1),
              (wCast = Math.floor(100 * (1 + 0.2 * n_A_ActiveSkillLV) * TCcast) / 100),
              (cast_kotei = 1),
              (n_rangedAtk = 1),
              (wMod += 1 * n_A_ActiveSkillLV + 1),
              (w_HIT = 5 * w_HIT + 5),
              w_HIT > 100 && (w_HIT = 100),
              (w_HIT_HYOUJI = w_HIT));
            break;
          case 431:
            ((wCast = 2), (n_Delay[2] = 1), (n_rangedAtk = 1));
            break;
          case 432:
            ((wCast = 1.5),
              (n_rangedAtk = 1),
              (wMod += 0.2 * n_A_ActiveSkillLV),
              (n_Delay[2] = 0.5),
              (w_HIT = 100),
              (w_HIT_HYOUJI = 100));
            break;
          case 434:
            ((wCast = 1), (n_rangedAtk = 0), (wMod += 0.5 * n_A_ActiveSkillLV), (n_Delay[3] = 1));
            break;
          case SKILLID.FULL_BLAST:
            ((n_rangedAtk = 1),
              (wMod += 1 * n_A_ActiveSkillLV + 2),
              (n_Delay[2] = Math.min(2, 1 + 0.2 * n_A_ActiveSkillLV)));
            break;
          case 436:
            ((n_rangedAtk = 1),
              (wMod += 0.2 * n_A_ActiveSkillLV - 0.2),
              (wCast = 1),
              (n_Delay[2] = 1));
            break;
          case 437:
            ((n_rangedAtk = 1), (not_use_card = 1), (wCast = 1), (n_Delay[2] = 1));
            break;
        }
      for (
        ATKmod02(wMod, 0),
          SKILLID.TRACKING != n_A_ActiveSkill &&
            SKILLID.CROWD_CONTROL_SHOT != n_A_ActiveSkill &&
            (wCast *= n_A_CAST),
          e = 0;
        e <= 2;
        e++
      )
        ((w_MagiclBulet = e),
          (w_DMG[e] = BattleCalc(n_A_DMG[e], e)),
          wActiveHitNum > 1 && (w_DMG[e] = Math.floor(w_DMG[e] / wActiveHitNum) * wActiveHitNum),
          (Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e] + EDP_DMG(e)),
          (InnStr[e] += Last_DMG_A[e]),
          SKILLID.SMITE == n_A_ActiveSkill &&
            m_Item[n_A_Equip[5]][0] == 305 &&
            ((w_DMG[e] = 0), (InnStr[e] = w_DMG[e] + " (no shield equiped)")),
          wActiveHitNum > 1 &&
            (InnStr[e] += " (" + w_DMG[e] / wActiveHitNum + " x " + wActiveHitNum + " hits)"));
      ((w_MagiclBulet = 1),
        (w_DMG[1] = (w_DMG[1] * w_HIT + BattleCalc2(0) * (100 - w_HIT)) / 100),
        EDPplus(1),
        CastAndDelay(),
        BattleCalc998());
    } else if (
      SKILLID.STAVE_CRASHER == n_A_ActiveSkill ||
      SKILLID.MAGIC_CRASHER_UARO == n_A_ActiveSkill
    ) {
      for (n_rangedAtk = 1, wCast = 0.3, n_Delay[2] = 0.3, wCast *= n_A_CAST, e = 0; e <= 2; e++) {
        if (SKILLID.MAGIC_CRASHER_UARO == n_A_ActiveSkill) {
          var s = BK_n_A_MATK[0] + BK_n_A_DMG[e] - n_A_ATK;
          w_DMG[e] = BattleCalc(2 * s, e);
        } else
          ((w_DMG[e] = BattleCalc(BK_n_A_MATK[e] * (1 + 0.05 * n_A_Buf2[8]), e) - 1),
            n_A_WeaponType == 0 && ((w_DMG[1] = w_DMG[0]), (w_DMG[2] = w_DMG[0])));
        ((Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e] + EDP_DMG(e)), (InnStr[e] += Last_DMG_A[e]));
      }
      ((n_PerHIT_DMG = BattleCalc2(0) + n_A_WeaponLV_refineATK),
        (w_DMG[1] = (w_DMG[1] * w_HIT + n_PerHIT_DMG * (100 - w_HIT)) / 100),
        EDPplus(1),
        CastAndDelay(),
        BattleCalc998());
    } else if (
      SKILLID.DOUBLE_STRAFE == n_A_ActiveSkill ||
      SKILLID.PIERCE == n_A_ActiveSkill ||
      SKILLID.FREEZING_TRAP == n_A_ActiveSkill ||
      SKILLID.THROW_SPIRIT_SPHERES == n_A_ActiveSkill ||
      SKILLID.BOWLING_BASH == n_A_ActiveSkill ||
      SKILLID.TRIPLE_ACTION == n_A_ActiveSkill ||
      SKILLID.BEAST_CHARGE == n_A_ActiveSkill ||
      SKILLID.DESPERADO == n_A_ActiveSkill
    ) {
      (SKILLID.DOUBLE_STRAFE == n_A_ActiveSkill
        ? ((n_rangedAtk = 1), (wMod += 0.1 * n_A_ActiveSkillLV - 0.1), (wHITsuu = 2))
        : SKILLID.PIERCE == n_A_ActiveSkill
          ? ((wMod += 0.1 * n_A_ActiveSkillLV), (wHITsuu = targetData[4] + 1))
          : SKILLID.BOWLING_BASH == n_A_ActiveSkill
            ? ((wMod += 0.4 * n_A_ActiveSkillLV),
              (wCast = 0.7 * n_A_CAST),
              (wHITsuu = 2),
              SKILLID.FIRST_AID == n_A_ActiveSkillLV && (wHITsuu = 1),
              (wLAch = 1),
              n_B_debuf[6] == 1 &&
                ((wHITsuu = 3), SKILLID.FIRST_AID == n_A_ActiveSkillLV && (wHITsuu = 2)))
            : SKILLID.THROW_SPIRIT_SPHERES == n_A_ActiveSkill
              ? ((wMod += 0.5 * n_A_ActiveSkillLV),
                (A = n_A_Buf2[12]) > n_A_ActiveSkillLV && (A = n_A_ActiveSkillLV),
                (wHITsuu = A),
                (wCast = (1 + A) * n_A_CAST),
                (n_Delay[2] = 0.5),
                (n_rangedAtk = 1))
              : SKILLID.TRIPLE_ACTION == n_A_ActiveSkill
                ? ((n_rangedAtk = 1), (n_Delay[2] = 1), (wMod += 0.5), (wHITsuu = 3))
                : SKILLID.BEAST_CHARGE == n_A_ActiveSkill
                  ? ((n_Delay[0] = 1),
                    (n_rangedAtk = 1),
                    (wMod += 0.08 * n_A_STR - 0.5),
                    (wHITsuu = 2))
                  : SKILLID.DESPERADO == n_A_ActiveSkill &&
                    ((n_rangedAtk = 0),
                    (wMod += 0.5 * n_A_ActiveSkillLV - 0.5),
                    (n_Delay[2] = 1),
                    (wHITsuu = [1, 1.2, 1.6, 2, 2.4, 3, 3.6, 4, 5, 6, 7, 8, 9, 10][
                      1 * c.SkillSubNum.value
                    ])),
        ATKmod02(wMod, 0));
      var u = SKILLID.DOUBLE_STRAFE == n_A_ActiveSkill;
      for (e = 0; e <= 2; e++) {
        var I = u ? wHITsuu : 1,
          D = EDP_DMG(e) * I;
        ((w_DMG[e] = BattleCalc(n_A_DMG[e] * I, e)),
          SKILLID.BEAST_CHARGE == n_A_ActiveSkill &&
            targetData[2] != 2 &&
            targetData[2] != 4 &&
            (w_DMG[e] = 0),
          (w_DMG[e] += D));
        var f = u ? Math.floor(w_DMG[e] / wHITsuu) : w_DMG[e];
        ((Last_DMG_B[e] = f),
          SKILLID.BOWLING_BASH == n_A_ActiveSkill && (Last_DMG_B[e] = 2 * w_DMG[e]),
          (Last_DMG_A[e] = u ? w_DMG[e] : w_DMG[e] * wHITsuu),
          n_B_debuf[6] == 0 || wLAch == 0
            ? (InnStr[e] += Math.floor(Last_DMG_A[e]) + " (" + f + SubName[8] + wHITsuu + " hits)")
            : ((InnStr[e] += 3 * w_DMG[e] + "(" + 2 * w_DMG[e] + "+" + w_DMG[e] + ")"),
              (Last_DMG_B[e] = 3 * w_DMG[e])),
          (w_DMG[e] -= D),
          u || (w_DMG[e] *= wHITsuu));
      }
      ((_ = BattleCalc2(0)),
        (w_DMG[1] = (w_DMG[1] * w_HIT + _ * wHITsuu * (100 - w_HIT)) / 100),
        wHITsuu == 0 &&
          SKILLID.THROW_SPIRIT_SPHERES == n_A_ActiveSkill &&
          (InnStr[0] =
            "<B style='color:red'># of Spirit Spheres must be<BR> higher than 0. Please change it<BR> at [Supportive/Party skills]</B>"),
        EDPplus(wHITsuu),
        (n_PerHIT_DMG = _ * wHITsuu),
        (str_PerHIT_DMG = _ * wHITsuu + " (" + wHITsuu + SubName[8] + _ + " damage)"),
        CastAndDelay(),
        BattleCalc998());
    } else if (SKILLID.BLITZ_BEAT == n_A_ActiveSkill || SKILLID.FALCON_ASSAULT == n_A_ActiveSkill) {
      for (
        n_PerHIT_DMG = 0,
          n_A_Weapon_element = 0,
          n_rangedAtk = 1,
          wBT =
            80 +
            2 * Math.floor(n_A_DEX / 10) +
            2 * Math.floor(n_A_INT / 2) +
            6 * SkillSearch(SKILLID.STEEL_CROW),
          wBT = (wBT * skill_dmg(n_A_ActiveSkill)) / 100,
          SKILLID.FALCON_ASSAULT == n_A_ActiveSkill
            ? ((wBT = Math.floor((wBT * (150 + 70 * n_A_ActiveSkillLV)) / 100)),
              (wBT = Math.floor(wBT * element[targetData[3]][0])),
              (wBT = tPlusDamCut(wBT)),
              (wBT *= 5),
              targetData[19] == 5 && (wBT = 1),
              (wCast = 1 * n_A_CAST),
              (n_Delay[2] = 3))
            : ((wBT = Math.floor(wBT * element[targetData[3]][0])),
              (wBT = tPlusDamCut(wBT)),
              (wBT *= n_A_ActiveSkillLV),
              (wCast = 1.5 * n_A_CAST),
              (n_Delay[2] = 1)),
          e = 0;
        e <= 2;
        e++
      )
        ((Last_DMG_A[e] = Last_DMG_B[e] = wBT),
          (InnStr[e] += Last_DMG_A[e]),
          SKILLID.BLITZ_BEAT == n_A_ActiveSkill &&
            ((Last_DMG_B[e] = wBT / n_A_ActiveSkillLV),
            (InnStr[e] += " (" + Last_DMG_B[e] + " x " + n_A_ActiveSkillLV + " hits)")),
          (w_DMG[e] = wBT));
      ((w_HIT_HYOUJI = 100), CastAndDelay(), BattleCalc998());
    } else if (
      SKILLID.ENVENOM == n_A_ActiveSkill ||
      (SKILLID.POISON_REACT == n_A_ActiveSkill && (targetData[3] < 50 || 60 <= targetData[3]))
    ) {
      for (
        ATKmod02(wMod, 0),
          n_A_Weapon_element = 5,
          wINV = Math.floor(BattleCalc2(0) * Math.max(0, element[targetData[3]][5])),
          n_PerHIT_DMG = wINV,
          e = 0;
        e <= 2;
        e++
      )
        ((w_DMG[e] = BattleCalc(n_A_DMG[e], e)),
          (w_DMG[e] = Math.floor(w_DMG[e] * Math.max(0, element[targetData[3]][5]))),
          (Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e] + EDP_DMG(e)),
          (InnStr[e] += Last_DMG_A[e]));
      ((w_DMG[1] = (w_DMG[1] * w_HIT + wINV * (100 - w_HIT)) / 100),
        EDPplus(1),
        CastAndDelay(),
        BattleCalc998());
    } else if (
      SKILLID.SHIELD_BOOMERANG == n_A_ActiveSkill ||
      SKILLID.SHIELD_BOOMERANG_SOUL_LINKED == n_A_ActiveSkill
    ) {
      ((n_PerHIT_DMG = 0),
        (n_rangedAtk = 1),
        (n_A_Weapon_element = 0),
        (Shieldw = 1 * c.SkillSubNum.value),
        (n_Delay[2] = 0.7),
        (wMod2 = 1 + 0.3 * n_A_ActiveSkillLV),
        SKILLID.SHIELD_BOOMERANG_SOUL_LINKED == n_A_ActiveSkill &&
          ((n_Delay[2] = 0.35), (wMod2 *= 2)));
      ((wSBr = 10 * n_A_LEFT_REFINE),
        EquipNumSearch(EQUIPID.AHLSPIESS) ||
        EquipNumSearch(EQUIPID.BROCCA) ||
        CardNumSearch(255) ||
        EquipNumSearch(EQUIPID.EXECUTIONER) ||
        ((EquipNumSearch(EQUIPID.COMBAT_KNIFE) || EquipNumSearch(EQUIPID.ASSAULTER_LANCE)) &&
          targetData[2] == 7) ||
        ((EquipNumSearch(EQUIPID.WEEDER_KNIFE) || EquipNumSearch(EQUIPID.CAESARS_SWORD)) &&
          targetData[2] == 3) ||
        ((EquipNumSearch(EQUIPID.DRAGON_KILLER) ||
          EquipNumSearch(EQUIPID.DRAGON_SLAYER) ||
          EquipNumSearch(EQUIPID.GAE_BOLG)) &&
          targetData[2] == 9) ||
        (EquipNumSearch(EQUIPID.EXORCISER) && targetData[2] == 6)
          ? ((M_DEF1 = targetData[14]), (M_DEF2 = n_B_DEF2[0]))
          : ((M_DEF1 = 0), (M_DEF2 = 0)));
      var r = n_A_ATK + 0.05 * n_A_ATK * n_A_Buf2[8];
      for (
        SkillSearch(SKILLID.AUTO_BERSERK)
          ? (r += 0.32 * r)
          : n_A_Buf6[5]
            ? (r += Math.floor(r * (0.02 + 0.03 * n_A_Buf6[5])))
            : n_A_Buf7[31] && (r += Math.floor(0.05 * r)),
          e = 0;
        e <= 2;
        e++
      )
        (bonusValues[23] > 0
          ? ((n_A_ATK_IP = Math.round(((r + Shieldw) * (n_B_DEF2[2 - e] + targetData[14])) / 100)),
            (w_DMG[e] = n_A_ATK_IP * wMod))
          : ((w_DMG[e] = (r + Shieldw) * wMod),
            (w_DMG[e] = Math.floor(
              w_DMG[e] * defReduction(targetData[14] - M_DEF1) - (n_B_DEF2[e] - M_DEF2),
            ))),
          (w_DMG[e] = Math.floor(w_DMG[e] * wMod2)),
          (w_DMG[e] = ApplyModifiers(w_DMG[e]) + wSBr),
          M_DEF1 != 0 && (w_DMG[2] = w_DMG[1] = w_DMG[0]),
          w_DMG[e] < 1 && (w_DMG[e] = 1),
          m_Item[n_A_Equip[5]][0] == 305
            ? ((w_DMG[e] = 0), (InnStr[e] += w_DMG[e] + " (no shield equiped)"))
            : ((w_DMG[e] = Math.floor(w_DMG[e] * element[targetData[3]][0])),
              (Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e]),
              (InnStr[e] += Last_DMG_A[e])));
      ((w_DMG[1] = (w_DMG[1] * w_HIT) / 100), CastAndDelay(), BattleCalc998());
    } else if (SKILLID.RAPID_SMITING == n_A_ActiveSkill) {
      ((n_PerHIT_DMG = 0),
        (n_rangedAtk = 1),
        (n_A_Weapon_element = 0),
        (wCast = 1 * n_A_CAST),
        EQUIPID.IMPERIAL_GUARD == n_A_Equip[5] && n_A_LEFT_REFINE >= 8 && (wCast *= 0.5),
        (n_Delay[2] = 1),
        (Shieldw = 1 * c.SkillSubNum.value));
      wMod2 = 1 + 0.3 * n_A_ActiveSkillLV;
      var k =
          20 * CardNumSearch(11) +
          5 * CardNumSearch(28) +
          5 * CardNumSearch(29) +
          5 * CardNumSearch(30) +
          5 * CardNumSearch(33) +
          5 * CardNumSearch(34) +
          5 * CardNumSearch(35) +
          5 * CardNumSearch(36) +
          5 * CardNumSearch(37) +
          10 * CardNumSearch(38) +
          5 * CardNumSearch(39) +
          5 * CardNumSearch(110) +
          5 * CardNumSearch(163) +
          5 * CardNumSearch(165) +
          5 * CardNumSearch(254) +
          5 * CardNumSearch(259) +
          5 * CardNumSearch(326) +
          5 * CardNumSearch(356) +
          5 * CardNumSearch(366) +
          5 * CardNumSearch(380) +
          5 * CardNumSearch(463) +
          5 * CardNumSearch(498) +
          5 * CardNumSearch(525),
        T = n_A_ATK - k;
      for (
        SkillSearch(SKILLID.AUTO_BERSERK)
          ? (T += 0.32 * T)
          : n_A_Buf6[5]
            ? (r += Math.floor(r * (0.02 + 0.03 * n_A_Buf6[5])))
            : n_A_Buf7[31] && (r += Math.floor(0.05 * r)),
          e = 0;
        e <= 2;
        e++
      )
        ((w_DMG[e] = T * wMod + Shieldw),
          (w_DMG[e] =
            Math.floor(
              Math.floor(5 * w_DMG[e] * defReduction(targetData[14]) - n_B_DEF2[e]) * wMod2,
            ) +
            5 * n_A_LEFT_REFINE * 2),
          (w_DMG[e] = ApplyModifiers(w_DMG[e])),
          w_DMG[e] < 1 && (w_DMG[e] = 1),
          m_Item[n_A_Equip[5]][0] == 305
            ? ((w_DMG[e] = 0), (InnStr[e] += w_DMG[e] + " (no shield equiped)"))
            : ((w_DMG[e] = Math.floor(w_DMG[e] * element[targetData[3]][0])),
              (Last_DMG_B[e] = Math.floor(w_DMG[e] / 5) + Math.floor(n_B_DEF2[e] / 3 - 1)),
              (Last_DMG_A[e] = 5 * Last_DMG_B[e]),
              (InnStr[e] += Last_DMG_A[e] + " (" + Last_DMG_B[e] + SubName[8] + "5 hits)"),
              (w_DMG[e] = Last_DMG_A[e])));
      w_DMG[1] = (w_DMG[1] * w_HIT) / 100;
      (CastAndDelay(), BattleCalc998());
    } else if (SKILLID.CLASHING_SPIRAL == n_A_ActiveSkill) {
      for (
        n_rangedAtk = 1,
          wSPP2 = n_A_Weapon_refine * Math.max(0, element[targetData[3]][n_A_Weapon_element]),
          wSPP2 = ApplyModifiers(wSPP2),
          wSPP2 = tPlusDamCut(wSPP2),
          n_PerHIT_DMG = 5 * wSPP2,
          SKILLID.INCREASED_HP_RECOVERY == n_A_ActiveSkillLV
            ? (wCast = 1 * n_A_CAST)
            : (wCast = (0.1 + 0.2 * n_A_ActiveSkillLV) * n_A_CAST),
          n_Delay[2] = 1 + 0.2 * n_A_ActiveSkillLV,
          wSPP = Math.floor(n_A_STR / 10),
          Weaponw = 1 * c.SkillSubNum.value,
          w_DMG[2] = wSPP * wSPP + 0.8 * Weaponw * (1 + 0.5 * n_A_ActiveSkillLV),
          wSPP = 1.25 - 0.25 * targetData[4],
          w_DMG[2] = Math.floor(w_DMG[2] * wSPP) + 10 + 1.5 * n_A_Weapon_refine,
          w_DMG[2] = w_DMG[2] * Math.max(0, element[targetData[3]][n_A_Weapon_element]),
          w_DMG[2] = ApplyModifiers(w_DMG[2]),
          w_DMG[0] = w_DMG[1] = w_DMG[2],
          e = 0;
        e <= 2;
        e++
      )
        ((Last_DMG_B[e] = w_DMG[e] + EDP_DMG(e)),
          (Last_DMG_A[e] = 5 * Last_DMG_B[e]),
          (InnStr[e] += Last_DMG_A[e] + " (" + Last_DMG_B[e] + SubName[8] + "5 hits)"),
          (w_DMG[e] = Last_DMG_A[e]));
      ((w_DMG[1] = (w_DMG[1] * w_HIT) / 100 + (n_PerHIT_DMG * (100 - w_HIT)) / 100),
        EDPplus(5),
        CastAndDelay(),
        BattleCalc998());
    } else if (SKILLID.VENOM_SPLASHER == n_A_ActiveSkill) {
      if (
        ((n_PerHIT_DMG = 0),
        (not_use_card = 1),
        (n_Delay[0] = 1),
        (wCast = 1 * n_A_CAST),
        targetData[19] == 0)
      )
        for (
          wMod += (400 + 50 * n_A_ActiveSkillLV + 20 * c.SkillSubNum.value) / 100,
            ATKmod02(wMod, 0),
            e = 0;
          e <= 2;
          e++
        )
          ((w_DMG[e] = BattleCalc(n_A_DMG[e], e)), (w_DMG[e] = Math.floor(w_DMG[e])));
      else
        targetData[19] == 5
          ? (w_DMG[0] = w_DMG[1] = w_DMG[2] = 1)
          : (w_DMG[0] = w_DMG[1] = w_DMG[2] = 0);
      for (e = 0; e <= 2; e++)
        ((Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e]), (InnStr[e] += Last_DMG_A[e]));
      ((w_HIT_HYOUJI = 100), CastAndDelay(), BattleCalc998());
    } else if (SKILLID.SOUL_DESTROYER == n_A_ActiveSkill) {
      for (
        not_use_card = 1,
          n_rangedAtk = 1,
          wCast = 0.5 * n_A_CAST,
          n_Delay[2] = 0.8 + 0.2 * n_A_ActiveSkillLV,
          w_SBr = new Array(),
          A = 5 * n_A_INT * n_A_ActiveSkillLV,
          w_SBr[2] =
            A + 1e3 - Math.floor((targetData[14] + targetData[15] + n_B_MDEF2 + n_B_DEF2[2]) / 2),
          w_SBr[1] =
            A + 750 - Math.floor((targetData[14] + targetData[15] + n_B_MDEF2 + n_B_DEF2[1]) / 2),
          w_SBr[0] =
            A + 500 - Math.floor((targetData[14] + targetData[15] + n_B_MDEF2 + n_B_DEF2[0]) / 2),
          e = 0;
        e <= 2;
        e++
      )
        w_SBr[e] = tPlusDamCut(w_SBr[e]);
      for (e = 0; e <= 2; e++)
        ((w_DMG[e] = BattleCalc(n_A_DMG[e], e)),
          (w_DMG[e] *= n_A_ActiveSkillLV),
          (Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e] + w_SBr[e]),
          (InnStr[e] += Last_DMG_A[e] + " (" + w_DMG[e] + " + " + w_SBr[e] + ")"),
          (w_DMG[e] = Last_DMG_A[e]));
      if (
        ((_ = BattleCalc2(0) * n_A_ActiveSkillLV),
        (n_PerHIT_DMG = _ + w_SBr[1]),
        (str_PerHIT_DMG = _ + w_SBr[0] + "~" + (_ + w_SBr[2])),
        targetData[19] == 5)
      )
        for (e = 0; e <= 2; e++)
          ((Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e] = 1), (InnStr[e] += Last_DMG_A[e]));
      ((w_DMG[1] = (w_DMG[1] * w_HIT + n_PerHIT_DMG * (100 - w_HIT)) / 100),
        CastAndDelay(),
        BattleCalc998());
    } else if (
      SKILLID.GRAND_CROSS == n_A_ActiveSkill ||
      SKILLID.GRAND_CROSS_UARO == n_A_ActiveSkill
    ) {
      for (
        n_PerHIT_DMG = 0,
          myInnerHtml("CRIATKname", '<Font color="#FF0000">Health drain</Font>', 0),
          myInnerHtml(
            "CRIATK",
            '<Font color="#FF0000">' + Math.floor(n_A_MaxHP / 5) + "</Font>",
            0,
          ),
          myInnerHtml("bSUB3name", '<Font color="#FF0000">Damage backlash</Font>', 0),
          work_A_VITDEF = [0, 0, 0],
          work_A_VITDEF[0] = n_A_VITDEF[2],
          work_A_VITDEF[1] = n_A_VITDEF[1],
          work_A_VITDEF[2] = n_A_VITDEF[0],
          n_A_softMDEF = n_A_INT + Math.floor(n_A_VIT / 2),
          e = 0;
        e <= 2;
        e++
      )
        ((w_DMG[e] =
          BK_n_A_DMG[e] * defReduction(n_A_DEF) - work_A_VITDEF[e] + n_A_WeaponLV_refineATK),
          (w_DMG[e] = Math.floor(w_DMG[e] * (wMod + 0.4 * n_A_ActiveSkillLV))),
          (A = BK_n_A_MATK[e] * mdefReduction(n_A_MDEF) - n_A_softMDEF),
          (A = Math.floor(A * (0.4 * n_A_ActiveSkillLV + 1))),
          (w_DMG[e] += A),
          (w_DMG[e] = Math.floor((w_DMG[e] * (100 - bonusValues[57])) / 100)),
          (w_DMG[e] = Math.floor((w_DMG[e] * (100 - bonusValues[66])) / 100)),
          (w_DMG[e] = Math.floor((w_DMG[e] * (100 - bonusValues[78])) / 100)),
          1 * c.A_adopted.checked
            ? (w_DMG[e] = Math.floor((w_DMG[e] * (100 - bonusValues[190])) / 100))
            : (w_DMG[e] = Math.floor((w_DMG[e] * (100 - bonusValues[191])) / 100)),
          (w_DMG[e] = Math.floor(w_DMG[e] * Math.max(0, element[10 * n_A_Bodyelement + 1][6]))),
          (w_DMG[e] = Math.floor(w_DMG[e] / 2)),
          (w_DMG[e] = (w_DMG[e] * skill_dmg(n_A_ActiveSkill)) / 100),
          (w_DMG[e] = Math.floor(w_DMG[e])));
      for (
        myInnerHtml(
          "bSUB3",
          '<Font color="#FF0000">3(hits) x ' + w_DMG[0] + "~" + w_DMG[2] + " damage</Font>",
          0,
        ),
          n_rangedAtk = 2,
          n_A_Weapon_element = 6,
          wCast = 3 * n_A_CAST,
          n_Delay[2] = 1.5,
          wLAch = 1,
          e = 0;
        e <= 2;
        e++
      ) {
        if (
          ((w_DMG[e] =
            BK_n_A_DMG[e] * defReduction(targetData[14]) - n_B_DEF2[e] + n_A_WeaponLV_refineATK),
          (w_DMG[e] *= wMod + 0.4 * n_A_ActiveSkillLV),
          (w_DMG[e] = Math.floor(w_DMG[e] * Math.max(0, element[targetData[3]][6]))),
          (A = BK_n_A_MATK[e] * mdefReduction(targetData[15]) - n_B_MDEF2),
          (A *= 0.4 * n_A_ActiveSkillLV + 1),
          SKILLID.GRAND_CROSS_UARO == n_A_ActiveSkill)
        ) {
          let S = n_A_Buf[2] * 40 + n_A_Buf[8] * 3 * 30;
          w_DMG[e] += S;
        }
        ((A = Math.floor(A * Math.max(0, element[targetData[3]][6]))),
          (w_DMG[e] = tPlusDamCut(
            Math.floor((A + w_DMG[e]) * Math.max(0, element[targetData[3]][6])),
          )),
          (w_DMG[e] = (w_DMG[e] * skill_dmg(n_A_ActiveSkill)) / 100),
          (w_DMG[e] = Math.floor(w_DMG[e])),
          w_DMG[e] < 1 && (w_DMG[e] = 1),
          60 <= targetData[3] && targetData[3] <= 69 && (w_DMG[e] = 0));
      }
      if (n_B_debuf[6] == 0)
        for (var l = 0; l <= 2; l++)
          ((Last_DMG_A[l] = Last_DMG_B[l] = 3 * w_DMG[l]),
            (InnStr[l] += Last_DMG_A[l] + " (" + w_DMG[l] + SubName[8] + "3 hits)"),
            (w_DMG[l] = Last_DMG_A[l]));
      else
        for (l = 0; l <= 2; l++)
          ((Last_DMG_A[l] = Last_DMG_B[l] = 4 * w_DMG[l]),
            (InnStr[l] +=
              Last_DMG_A[l] + " (" + 2 * w_DMG[l] + " + " + w_DMG[l] + SubName[8] + "2 hits)"),
            (w_DMG[l] = Last_DMG_A[l]));
      ((w_HIT_HYOUJI = 100), CastAndDelay(), BattleCalc998());
    } else if (SKILLID.CART_REVOLUTION == n_A_ActiveSkill) {
      for (
        wCR = 100,
          n_PerHIT_DMG = Math.floor(2 * BattleCalc2(0) * element[targetData[3]][0]),
          SkillSearch(SKILLID.MAXIMUM_POWER_THRUST)
            ? (wCR += 20 * SkillSearch(SKILLID.MAXIMUM_POWER_THRUST))
            : (SkillSearch(SKILLID.POWER_THRUST) && (wCR += 5 * SkillSearch(SKILLID.POWER_THRUST)),
              SkillSearch(SKILLID.POWER_THRUST) == 0 && n_A_Buf2[8] && (wCR += 5 * n_A_Buf2[8])),
          CR_n_A_DMG = [0, 0, 0],
          CRmod = (1 * c.SkillSubNum.value) / 8e3,
          l = 0;
        l <= 2;
        l++
      )
        CR_n_A_DMG[l] = Math.floor((n_A_DMG[l] * wCR) / 100);
      for (wMod += 0.5, ATKmod02(wMod, 0), l = 0; l <= 2; l++)
        ((w_DMG[l] = BattleCalc(n_A_DMG[l], l)),
          (w_DMG[l] += Math.floor(BattleCalc(CR_n_A_DMG[l], l) * CRmod)),
          (w_DMG[l] = Math.floor(w_DMG[l] * element[targetData[3]][0])),
          !CardNumSearch(523) ||
            (n_A_JOB != 6 &&
              n_A_JOB != 12 &&
              n_A_JOB != 19 &&
              n_A_JOB != 26 &&
              n_A_JOB != 33 &&
              n_A_JOB != 40) ||
            ((w_DMG[0] *= 1.5), (w_DMG[1] *= 1.5), (w_DMG[2] *= 1.5)),
          (Last_DMG_A[l] = Last_DMG_B[l] = w_DMG[l] + EDP_DMG(l)),
          (InnStr[l] += Last_DMG_A[l]));
      ((w_DMG[1] = (w_DMG[1] * w_HIT + 2 * BattleCalc2(0) * (100 - w_HIT)) / 100),
        (w_DMG[1] = Math.floor(w_DMG[1] * element[targetData[3]][0])),
        EDPplus(1),
        CastAndDelay(),
        BattleCalc998());
    } else if (SKILLID.GLORIA_DOMINI == n_A_ActiveSkill) {
      for (
        n_PerHIT_DMG = 0,
          w_DMG[2] = 500 + 300 * n_A_ActiveSkillLV,
          targetData[19] == 5 && (w_DMG[2] = 1),
          w_DMG[0] = w_DMG[1] = w_DMG[2],
          e = 0;
        e <= 2;
        e++
      )
        ((Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e]), (InnStr[e] += Last_DMG_A[e]));
      ((wCast = (1.5 + 0.5 * n_A_ActiveSkillLV) * n_A_CAST),
        (n_Delay[2] = 1.5 + 0.5 * n_A_ActiveSkillLV),
        (w_HIT_HYOUJI = 100),
        CastAndDelay(),
        BattleCalc998());
    } else if (SKILLID.MARTYRS_RECKONING == n_A_ActiveSkill) {
      for (
        n_PerHIT_DMG = 0,
          n_A_Weapon_element = 0,
          w_DMG[2] = Math.floor(0.09 * n_A_MaxHP * (0.9 + 0.1 * n_A_ActiveSkillLV)),
          w_DMG[2] = ApplyModifiers(w_DMG[2]),
          w_DMG[2] = Math.floor(w_DMG[2] * element[targetData[3]][0]),
          w_DMG[0] = w_DMG[1] = w_DMG[2],
          e = 0;
        e <= 2;
        e++
      )
        ((Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e]), (InnStr[e] += Last_DMG_A[e]));
      ((w_HIT_HYOUJI = 100), CastAndDelay(), BattleCalc998());
    } else if (SKILLID.OCCULT_IMPACTION == n_A_ActiveSkill) {
      for (
        n_PerHIT_DMG = 0,
          w_HIT_HYOUJI = 100,
          n_A_Weapon_element = 0,
          ATKmod02(wMod, 0),
          wMod += 0.75 * n_A_ActiveSkillLV,
          work_B_DEF2 = [0, 0, 0],
          work_B_DEF2[0] = n_B_DEF2[2],
          work_B_DEF2[1] = n_B_DEF2[1],
          work_B_DEF2[2] = n_B_DEF2[0],
          l = 0;
        l <= 2;
        l++
      )
        ((w_DMG[l] = Math.floor(
          (Math.floor(BK_n_A_DMG[l] * wMod) * (work_B_DEF2[l] + targetData[14])) / 50,
        )),
          (w_DMG[l] = ApplyModifiers(w_DMG[l])),
          (w_DMG[l] = Math.floor(w_DMG[l] * element[targetData[3]][0])),
          (Last_DMG_A[l] = Last_DMG_B[l] = w_DMG[l] + EDP_DMG(l)),
          (InnStr[l] += Last_DMG_A[l]));
      (EDPplus(1), (wCast = 1 * n_A_CAST), (n_Delay[2] = 0.5), CastAndDelay(), BattleCalc998());
    } else if (
      SKILLID.GUILLOTINE_FIST == n_A_ActiveSkill ||
      SKILLID.GUILLOTINE_FIST_MAX_SP == n_A_ActiveSkill
    ) {
      for (
        n_PerHIT_DMG = 0,
          w_HIT_HYOUJI = 100,
          n_A_Weapon_element = 0,
          ATKmod02(wMod, 0),
          SKILLID.GUILLOTINE_FIST == n_A_ActiveSkill
            ? (wMod += 8 + (1 * c.SkillSubNum.value) / 10)
            : (wMod += 8 + (n_A_MaxSP - 1) / 10),
          wASYU = 250 + 150 * n_A_ActiveSkillLV,
          l = 0;
        l <= 2;
        l++
      )
        ((w_DMG[l] = Math.floor(BK_n_A_DMG[l] * wMod) + wASYU),
          (w_DMG[l] = ApplyModifiers(w_DMG[l])),
          (w_DMG[l] = Math.floor(w_DMG[l] * element[targetData[3]][0])),
          n_A_Buf6[5]
            ? (w_DMG[l] += Math.floor((0.02 + 0.03 * n_A_Buf6[5]) * w_DMG[l]))
            : n_A_Buf7[31] && (w_DMG[l] += Math.floor(0.05 * w_DMG[l])),
          n_A_Buf2[19] == 1 && (w_DMG[l] = 2 * w_DMG[l]),
          (Last_DMG_A[l] = Last_DMG_B[l] = w_DMG[l] + EDP_DMG(l)),
          (InnStr[l] += Last_DMG_A[l]));
      (EDPplus(1),
        (wCast = (4.5 - 0.5 * n_A_ActiveSkillLV) * n_A_CAST),
        (n_Delay[2] = 3.5 - 0.5 * n_A_ActiveSkillLV),
        CastAndDelay(),
        BattleCalc998());
    } else if (SKILLID.THROW_SHURIKEN == n_A_ActiveSkill) {
      for (n_rangedAtk = 1, not_use_card = 1, ATKmod02(wMod, 0), l = 0; l <= 2; l++)
        ((w_DMG[l] = BattleCalc(n_A_DMG[l], l)),
          (w_DMG[l] = Math.floor(w_DMG[l] * element[targetData[3]][0])),
          (Last_DMG_A[l] = Last_DMG_B[l] = w_DMG[l]),
          (InnStr[l] += Last_DMG_A[l]));
      ((w_DMG[1] =
        (w_DMG[1] * w_HIT + BattleCalc2(0) * element[targetData[3]][0] * (100 - w_HIT)) / 100),
        (n_PerHIT_DMG = BattleCalc2(0) * element[targetData[3]][0]),
        CastAndDelay(),
        BattleCalc998());
    } else if (SKILLID.THROW_KUNAI == n_A_ActiveSkill) {
      for (
        n_rangedAtk = 1,
          n_Delay[2] = 0.5,
          not_use_card = 1,
          ATKmod02(wMod, 0),
          n_A_Weapon_element = m_Kunai[1 * c.SkillSubNum.value][1],
          l = 0;
        l <= 2;
        l++
      )
        ((w_DMG[l] = BattleCalc(n_A_DMG[l], l)),
          (w_DMG[l] = Math.floor(w_DMG[l] * element[targetData[3]][0])),
          (Last_DMG_B[l] = w_DMG[l]),
          (Last_DMG_A[l] = 3 * w_DMG[l]),
          (InnStr[l] += Last_DMG_A[l] + " (" + Last_DMG_B[l] + SubName[8] + "3 hits)"),
          (w_DMG[l] = Last_DMG_A[l]));
      ((_ = Math.floor(BattleCalc2(0) * element[targetData[3]][0])),
        (w_DMG[1] = (w_DMG[1] * w_HIT + 3 * _ * (100 - w_HIT)) / 100),
        (n_PerHIT_DMG = 3 * _),
        (str_PerHIT_DMG = 3 * _ + " (3" + SubName[8] + _ + " damage)"),
        CastAndDelay(),
        BattleCalc998());
    } else if (SKILLID.THROW_HUUMA_SHURIKEN == n_A_ActiveSkill) {
      for (
        wMod += 1.5 * n_A_ActiveSkillLV + 0.5,
          n_rangedAtk = 1,
          ATKmod02(wMod, 0),
          wCast = 3 * n_A_CAST,
          n_Delay[2] = 1.5,
          wActiveHitNum = 2 + Math.round(n_A_ActiveSkillLV / 2),
          l = 0;
        l <= 2;
        l++
      )
        ((w_DMG[l] = BattleCalc(n_A_DMG[l], l)),
          (w_DMG[l] = Math.floor(w_DMG[l] * element[targetData[3]][0])),
          wActiveHitNum > 1 && (w_DMG[l] = Math.floor(w_DMG[l] / wActiveHitNum) * wActiveHitNum),
          (Last_DMG_A[l] = Last_DMG_B[l] = w_DMG[l]),
          (InnStr[l] += Last_DMG_A[l]),
          (InnStr[l] += " (" + Last_DMG_A[l] / wActiveHitNum + " x " + wActiveHitNum + " hits)"));
      ((w_DMG[1] =
        (w_DMG[1] * w_HIT + BattleCalc2(0) * element[targetData[3]][0] * (100 - w_HIT)) / 100),
        (n_PerHIT_DMG = BattleCalc2(0) * element[targetData[3]][0]),
        CastAndDelay(),
        BattleCalc998());
    } else if (SKILLID.THROW_COINS == n_A_ActiveSkill) {
      for (
        n_rangedAtk = 1,
          n_A_Weapon_element = 0,
          wCast = 0,
          n_Delay[2] = 2,
          w_HIT_HYOUJI = 100,
          targetData[19] == 1 || targetData[0] == 586
            ? ((w_DMG[0] = 250 * n_A_ActiveSkillLV),
              (w_DMG[1] = 250 * n_A_ActiveSkillLV + 125 * n_A_ActiveSkillLV),
              (w_DMG[2] = 250 * n_A_ActiveSkillLV + 250 * n_A_ActiveSkillLV))
            : ((w_DMG[0] = 500 * n_A_ActiveSkillLV),
              (w_DMG[1] = 500 * n_A_ActiveSkillLV + 250 * n_A_ActiveSkillLV),
              (w_DMG[2] = 500 * n_A_ActiveSkillLV + 500 * n_A_ActiveSkillLV)),
          e = 0;
        e <= 2;
        e++
      )
        ((w_DMG[e] = (w_DMG[e] * skill_dmg(n_A_ActiveSkill)) / 100),
          (w_DMG[e] = w_DMG[e] * Math.max(0, element[targetData[3]][n_A_Weapon_element])),
          (w_DMG[e] = tPlusDamCut(w_DMG[e])));
      for (targetData[19] == 5 && (w_DMG[0] = w_DMG[1] = w_DMG[2] = 1), e = 0; e <= 2; e++)
        InnStr[e] += w_DMG[e];
      (EDPplus(5), CastAndDelay(), BattleCalc998());
    } else if (
      SKILLID.KILLING_STROKE == n_A_ActiveSkill ||
      SKILLID.FINAL_STRIKE_MAX_HP == n_A_ActiveSkill
    ) {
      for (
        n_PerHIT_DMG = 0,
          n_A_Weapon_element = 0,
          n_rangedAtk = 1,
          ATKmod02(wMod, 0),
          SKILLID.KILLING_STROKE == n_A_ActiveSkill
            ? (w_1senHP = 1 * c.SkillSubNum.value)
            : (w_1senHP = n_A_MaxHP - 1),
          w_DMG[0] =
            40 * (n_A_STR - SkillSearch(SKILLID.NINJA_AURA)) +
            n_A_ActiveSkillLV * (w_1senHP / 10 + 35),
          w_DMG[0] = w_DMG[0] * defReduction(targetData[14]),
          w_DMG[0] = ApplyModifiers(w_DMG[0]),
          w_DMG[0] = Math.floor(w_DMG[0] * element[targetData[3]][0]),
          w_DMG[2] = w_DMG[1] = w_DMG[0],
          e = 0;
        e <= 2;
        e++
      )
        ((Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e]), (InnStr[e] += Last_DMG_A[e]));
      (CastAndDelay(), (w_HIT_HYOUJI = 100), BattleCalc998());
    } else if (SKILLID.ACID_TERROR == n_A_ActiveSkill) {
      for (
        n_PerHIT_DMG = 0,
          not_use_card = 1,
          n_rangedAtk = 1,
          n_A_Weapon_element = 0,
          wMod = (50 + 50 * n_A_ActiveSkillLV) / 100,
          l = 0;
        l <= 2;
        l++
      )
        ((w_DMG[l] = Math.floor((BK_n_A_DMG[l] - n_B_DEF2[l]) * wMod)),
          (w_DMG[l] = Math.floor(w_DMG[l] * element[targetData[3]][0])),
          (w_DMG[l] = Math.floor(ApplyModifiers(w_DMG[l]))),
          (Last_DMG_A[l] = Last_DMG_B[l] = w_DMG[l]),
          (InnStr[l] += Last_DMG_A[l]));
      ((wCast = 1 * n_A_CAST), (w_HIT_HYOUJI = 100), CastAndDelay(), BattleCalc998());
    } else if (SKILLID.ACID_BOMB == n_A_ActiveSkill) {
      for (
        n_PerHIT_DMG = 0,
          n_rangedAtk = 1,
          n_A_Weapon_element = 0,
          wHITsuu = n_A_ActiveSkillLV,
          wAD = (0.7 * n_A_INT * n_A_INT * targetData[7]) / (n_A_INT + targetData[7]),
          wAD = (wAD * skill_dmg(n_A_ActiveSkill)) / 100,
          w_DMG[2] = Math.floor(wAD),
          w_DMG[2] = tPlusDamCut(Math.floor(w_DMG[2] * element[targetData[3]][0])),
          PvP == 1 && (w_DMG[2] = Math.floor(w_DMG[2] / 2)),
          w_DMG[0] = w_DMG[1] = w_DMG[2],
          e = 0;
        e <= 2;
        e++
      )
        ((Last_DMG_B[e] = w_DMG[e]),
          (Last_DMG_A[e] = w_DMG[e] * wHITsuu),
          (InnStr[e] += Last_DMG_A[e] + " (" + Last_DMG_B[e] + SubName[8] + wHITsuu + " hits)"),
          (w_DMG[e] = Last_DMG_A[e]));
      ((wCast = 1 * n_A_CAST),
        (n_Delay[2] = 1),
        (w_HIT_HYOUJI = 100),
        CastAndDelay(),
        BattleCalc998());
    } else if (
      SKILLID.LAND_MINE == n_A_ActiveSkill ||
      SKILLID.BLAST_MINE == n_A_ActiveSkill ||
      SKILLID.CLAYMORE_TRAP == n_A_ActiveSkill
    ) {
      switch (((n_PerHIT_DMG = 0), (n_Delay[0] = 1), n_A_ActiveSkill)) {
        case 106:
          ((n_A_Weapon_element = 2),
            (w_DMG[2] = Math.floor(
              (75 + n_A_DEX) *
                (1 + n_A_INT / 100) *
                n_A_ActiveSkillLV *
                Math.max(0, element[targetData[3]][2]),
            )));
          break;
        case 112:
          ((n_A_Weapon_element = 4),
            (w_DMG[2] = Math.floor(
              (50 + n_A_DEX / 2) *
                (1 + n_A_INT / 100) *
                n_A_ActiveSkillLV *
                Math.max(0, element[targetData[3]][4]),
            )));
          break;
        case 113:
          ((n_A_Weapon_element = 3),
            (w_DMG[2] = Math.floor(
              (75 + n_A_DEX / 2) *
                (1 + n_A_INT / 100) *
                n_A_ActiveSkillLV *
                Math.max(0, element[targetData[3]][3]),
            )));
          break;
      }
      for (
        w_DMG[2] = tPlusDamCut(w_DMG[2]),
          w_DMG[2] = (w_DMG[2] * skill_dmg(n_A_ActiveSkill)) / 100,
          w_DMG[2] = Math.floor(w_DMG[2]),
          w_DMG[0] = w_DMG[1] = w_DMG[2],
          e = 0;
        e <= 2;
        e++
      )
        ((Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e]), (InnStr[e] += Last_DMG_A[e]));
      ((w_HIT_HYOUJI = 100), CastAndDelay(), BattleCalc998());
    } else if (SKILLID.HEAL == n_A_ActiveSkill) {
      for (
        n_PerHIT_DMG = 0,
          n_A_Weapon_element = 6,
          n_Delay[2] = 1,
          n_rangedAtk = 2,
          w_DMG[2] = HealCalc(n_A_ActiveSkillLV, 0),
          w_DMG[2] = Math.floor(Math.floor(w_DMG[2] / 2) * Math.max(0, element[targetData[3]][6])),
          targetData[3] < 90 && (w_DMG[2] = 0),
          _ = bonusValues[170 + targetData[2]],
          w_DMG[2] = Math.floor((w_DMG[2] * (100 + _)) / 100),
          wHealMOD = 100 + bonusValues[93],
          w_DMG[2] = Math.floor((w_DMG[2] * wHealMOD) / 100),
          w_DMG[2] = tPlusDamCut(w_DMG[2]),
          w_DMG[0] = w_DMG[1] = w_DMG[2],
          e = 0;
        e <= 2;
        e++
      )
        ((Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e]), (InnStr[e] += Last_DMG_A[e]));
      ((w_HIT_HYOUJI = 100), CastAndDelay(), BattleCalc998());
    } else if (SKILLID.SANCTUARY == n_A_ActiveSkill) {
      for (
        n_PerHIT_DMG = 0,
          n_A_Weapon_element = 6,
          wCast = 5 * n_A_CAST,
          n_Delay[0] = 1,
          n_rangedAtk = 2,
          n_A_ActiveSkillLV <= 6 ? (w_DMG[2] = 100 * n_A_ActiveSkillLV) : (w_DMG[2] = 777),
          w_HEAL_MOD = 100 + bonusValues[94] + bonusValues[99],
          w_DMG[2] = Math.floor((w_DMG[2] * w_HEAL_MOD) / 100),
          w_DMG[2] = Math.floor(Math.floor(w_DMG[2] / 2) * Math.max(0, element[targetData[3]][6])),
          targetData[3] < 90 && targetData[2] != 6 && (w_DMG[2] = 0),
          _ = bonusValues[170 + targetData[2]],
          w_DMG[2] = Math.floor((w_DMG[2] * (100 + _)) / 100),
          w_HEAL_MOD = 100 + bonusValues[96],
          w_DMG[2] = Math.floor((w_DMG[2] * w_HEAL_MOD) / 100),
          w_DMG[2] = tPlusDamCut(w_DMG[2]),
          w_DMG[0] = w_DMG[1] = w_DMG[2],
          e = 0;
        e <= 2;
        e++
      )
        ((Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e]), (InnStr[e] += Last_DMG_A[e]));
      ((w_HIT_HYOUJI = 100), CastAndDelay(), BattleCalc998());
    } else if (SKILLID.TURN_UNDEAD == n_A_ActiveSkill || SKILLID.RESURRECTION == n_A_ActiveSkill) {
      for (
        n_PerHIT_DMG = 0,
          SKILLID.TURN_UNDEAD == n_A_ActiveSkill
            ? ((n_A_Weapon_element = 6), (wCast = 1 * n_A_CAST))
            : ((n_A_Weapon_element = 0), (wCast = 8 - 2 * n_A_ActiveSkillLV), (wCast *= n_A_CAST)),
          n_rangedAtk = 2,
          targetData[3] < 90
            ? ((A = 0), (w_DMG[2] = 0), (w_DMG[0] = 0), (w_DMG[1] = 0))
            : (targetData[19] != 1
                ? ((A = (20 * n_A_ActiveSkillLV + n_A_BaseLV + n_A_INT + n_A_LUK) / 1e3),
                  (w_DMG[2] = targetData[6]))
                : ((A = 0), (w_DMG[2] = 0)),
              (w_DMG[0] = n_A_BaseLV + n_A_INT + 10 * n_A_ActiveSkillLV),
              (w_DMG[0] = Math.floor(
                w_DMG[0] * Math.max(0, element[targetData[3]][n_A_Weapon_element]),
              )),
              (w_DMG[1] = Math.round(targetData[6] * A + (w_DMG[0] * (100 - A)) / 100))),
          e = 0;
        e <= 2;
        e++
      )
        Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e];
      ((InnStr[0] += w_DMG[0] + " <span style='font-weight:100;'>(damage on failure)</span>"),
        (InnStr[1] +=
          w_DMG[1] + " <span style='font-weight:100;'>(considering success chance)</span>"),
        (InnStr[2] +=
          Math.floor(w_DMG[2] * Math.max(0, element[targetData[3]][n_A_Weapon_element])) +
          " <span style='font-weight:100;'>(" +
          Math.floor(1e4 * A) / 100 +
          "% success chance)</span>"),
        (n_Delay[2] = 3),
        (w_HIT_HYOUJI = 100),
        CastAndDelay(),
        BattleCalc998());
    } else if (SKILLID.GRAVITY_FIELD == n_A_ActiveSkill) {
      for (
        n_PerHIT_DMG = 0,
          n_A_Weapon_element = 0,
          n_Delay[6] = 9,
          n_rangedAtk = 2,
          wHITsuu = 4 + n_A_ActiveSkillLV,
          w_DMG[2] = 200 + 200 * n_A_ActiveSkillLV,
          w_DMG[2] = (w_DMG[2] * skill_dmg(n_A_ActiveSkill)) / 100,
          w_DMG[2] = Math.floor(w_DMG[2]),
          targetData[19] == 5 && (w_DMG[2] = 1),
          targetData[0] == 44 && (w_DMG[2] = 400),
          w_DMG[0] = w_DMG[1] = w_DMG[2],
          e = 0;
        e <= 2;
        e++
      )
        ((Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e] * wHITsuu), (w_DMG[e] = Last_DMG_A[e]));
      var d = Last_DMG_A[0] + " (" + w_DMG[0] / wHITsuu + " x " + wHITsuu + " hits)";
      for (e = 0; e <= 2; e++) InnStr[e] += d;
      ((wCast = 5 * n_A_CAST),
        (n_Delay[2] = 2),
        (w_HIT_HYOUJI = 100),
        CastAndDelay(),
        BattleCalc998());
    } else if (SKILLID.COIN_FLING == n_A_ActiveSkill) {
      for (
        n_rangedAtk = 1,
          n_A_Weapon_element = 0,
          wCast = 0,
          w_HIT_HYOUJI = 100,
          targetData[19] == 5
            ? (w_DMG[2] = 1)
            : ((w_DMG[2] = 1 * c.A_JobLV.value),
              (w_DMG[2] = (w_DMG[2] * skill_dmg(n_A_ActiveSkill)) / 100)),
          w_DMG[2] = Math.floor(w_DMG[2]),
          w_DMG[0] = w_DMG[1] = w_DMG[2],
          e = 0;
        e <= 2;
        e++
      )
        InnStr[e] += w_DMG[e];
      (EDPplus(5), CastAndDelay(), BattleCalc998());
    } else {
      switch (
        ((n_PerHIT_DMG = 0),
        (n_rangedAtk = 2),
        (wMod = 1),
        (n_bunkatuHIT = 0),
        (w_HIT_HYOUJI = 100),
        n_A_ActiveSkill)
      ) {
        case 51:
          ((n_A_Weapon_element = 3),
            (wHITsuu = n_A_ActiveSkillLV),
            (wCast = 0.7 * n_A_ActiveSkillLV),
            (n_Delay[2] = 0.8 + 0.2 * n_A_ActiveSkillLV));
          break;
        case 54:
          ((n_A_Weapon_element = 1),
            (wHITsuu = n_A_ActiveSkillLV),
            (wCast = 0.7 * n_A_ActiveSkillLV),
            (n_Delay[2] = 0.8 + 0.2 * n_A_ActiveSkillLV));
          break;
        case 56:
          ((n_A_Weapon_element = 4),
            (wHITsuu = n_A_ActiveSkillLV),
            (wCast = 0.7 * n_A_ActiveSkillLV),
            (n_Delay[2] = 0.8 + 0.2 * n_A_ActiveSkillLV));
          break;
      }
      switch (n_A_ActiveSkill) {
        case 540:
          ((n_A_Weapon_element = 3),
            (wHITsuu = n_A_ActiveSkillLV),
            (wCast = 0),
            (n_Delay[2] = 0),
            (w_HIT_HYOUJI = 25));
          break;
        case 541:
          ((n_A_Weapon_element = 1),
            (wHITsuu = n_A_ActiveSkillLV),
            (wCast = 0),
            (n_Delay[2] = 0),
            (w_HIT_HYOUJI = 25));
          break;
        case 542:
          ((n_A_Weapon_element = 4),
            (wHITsuu = n_A_ActiveSkillLV),
            (wCast = 0),
            (n_Delay[2] = 0),
            (w_HIT_HYOUJI = 25));
          break;
        case 52:
          ((n_A_Weapon_element = 3),
            n_A_ActiveSkillLV <= 5
              ? ((wCast = 1.5), (n_Delay[2] = 1.5))
              : ((wCast = 1), (n_Delay[2] = 1)),
            (wMod = 0.7 + 0.1 * n_A_ActiveSkillLV));
          break;
        case 53:
          ((n_A_Weapon_element = 3),
            (wHITsuu = 4 + n_A_ActiveSkillLV),
            (wCast = 2.15 - 0.15 * n_A_ActiveSkillLV),
            (n_Delay[2] = 0.1),
            (wMod = 0.5));
          break;
        case 55:
          ((n_A_Weapon_element = 1),
            (wCast = 0.8),
            (n_Delay[2] = 1.5),
            (wMod = 1 + 0.1 * n_A_ActiveSkillLV));
          break;
        case 57:
          ((n_A_Weapon_element = 4),
            (wHITsuu = n_A_ActiveSkillLV),
            (wCast = 1 * n_A_ActiveSkillLV),
            (n_Delay[2] = 2),
            (wMod = 0.8));
          break;
        case 46:
          switch (((n_A_Weapon_element = 8), (wCast = 0.5), n_A_ActiveSkillLV)) {
            case 10:
              n_Delay[2] = 0.5;
              break;
            case 9:
              n_Delay[2] = 0.6;
              break;
            case 8:
              n_Delay[2] = 0.7;
              break;
            default:
              n_A_ActiveSkillLV >= 6
                ? (n_Delay[2] = 0.8)
                : n_A_ActiveSkillLV >= 4
                  ? (n_Delay[2] = 0.9)
                  : (n_Delay[2] = 1);
          }
          wMod = 0.7 + 0.1 * n_A_ActiveSkillLV;
          break;
        case 47:
          ((n_A_Weapon_element = 8),
            (wHITsuu = Math.round(n_A_ActiveSkillLV / 2)),
            (wCast = 0.5),
            n_A_ActiveSkillLV % 2 == 0
              ? (n_Delay[2] = 0.8 + (n_A_ActiveSkillLV / 2) * 0.2)
              : (n_Delay[2] = 1 + ((n_A_ActiveSkillLV + 1) / 2) * 0.2));
          break;
        case 122:
          ((n_A_Weapon_element = 3),
            (wHITsuu = n_A_ActiveSkillLV + 2),
            (wCast = 3.3 - 0.3 * n_A_ActiveSkillLV),
            (n_Delay[2] = 1),
            (wMod = 0.2));
          break;
        case 124:
          ((n_A_Weapon_element = 3),
            (wCast = 0.7),
            (n_Delay[2] = 2),
            (wMod = 1 + 0.2 * n_A_ActiveSkillLV));
          break;
        case 125:
          ((n_A_Weapon_element = 3),
            (wHITsuu = Math.round(n_A_ActiveSkillLV / 2) * (Math.floor(n_A_ActiveSkillLV / 2) + 2)),
            (wCast = 15),
            (n_Delay[2] = 1 * Math.floor(n_A_ActiveSkillLV / 2) + 2));
          break;
        case 126:
          ((n_A_Weapon_element = 4),
            (wHITsuu = n_A_ActiveSkillLV + 2),
            (wCast = 2 + 0.5 * n_A_ActiveSkillLV));
          break;
        case 127:
          ((n_A_Weapon_element = 4),
            (wHITsuu = 4),
            (wCast = 15.5 - 0.5 * n_A_ActiveSkillLV),
            (n_Delay[2] = 5),
            (n_Delay[6] = 4),
            (wMod = 0.8 + 0.2 * n_A_ActiveSkillLV));
          break;
        case 128:
        case 320:
          ((n_A_Weapon_element = 1),
            n_A_ActiveSkillLV >= 4 ? (wHITsuu = 25) : n_A_ActiveSkillLV >= 2 && (wHITsuu = 9),
            (SG_Special_HITnum = wHITsuu),
            (wCast = n_A_ActiveSkillLV),
            (wMod = 1 + 0.3 * n_A_ActiveSkillLV),
            (n_Delay[3] = 0.1 * wHITsuu));
          break;
        case 130:
          ((wMod = 0.66 + 0.066 * n_A_ActiveSkillLV),
            (n_A_Weapon_element = 1),
            (wCast = 6 - 0.5 * Math.floor((n_A_ActiveSkillLV - 1) / 2)),
            (n_Delay[2] = 1));
          break;
        case 131:
          ((n_A_Weapon_element = 1),
            (wHITsuu = 1 * c.SkillSubNum.value),
            (SG_Special_HITnum = wHITsuu),
            (SGcast = 1),
            n_A_Weapon_refine == 10 && EquipNumSearch(EQUIPID.LACRYMA_STICK) && (SGcast -= 0.08),
            EquipNumSearch(EQUIPID.LACRYMA_SET) && (SGcast -= 0.04 * n_A_LEFT_REFINE),
            (wCast = (5 + n_A_ActiveSkillLV) * SGcast),
            (n_Delay[2] = 5),
            (n_Delay[6] = 4.5),
            (wMod = 1 + 0.4 * n_A_ActiveSkillLV));
          break;
        case 132:
        case 133:
        case 319:
          ((n_A_Weapon_element = 2),
            (wHITsuu = n_A_ActiveSkillLV),
            SKILLID.EARTH_SPIKE == n_A_ActiveSkill
              ? ((wCast = 0.7 * n_A_ActiveSkillLV), (n_Delay[2] = 0.8 + 0.2 * n_A_ActiveSkillLV))
              : ((wCast = n_A_ActiveSkillLV), (n_Delay[2] = 1)));
          break;
        case 277:
          ((wHITsuu = n_A_ActiveSkillLV),
            (n_A_Weapon_element = 8),
            (wCast = 1),
            (n_Delay[2] = 1),
            (wMod = 0.7 + 0.1 * n_A_ActiveSkillLV));
          break;
        case 37:
        case 387:
          ((n_A_Weapon_element = 6),
            (wCast = 2),
            (wMod = 1.25),
            SKILLID.HOLY_LIGHT_SOUL_LINKED == n_A_ActiveSkill && (wMod *= 5));
          break;
        case 104:
          ((n_Delay[0] = 1),
            (n_A_Weapon_element = 6),
            (wHITsuu = n_A_ActiveSkillLV),
            (wCast = 15),
            (n_Delay[2] = 4),
            canMagnusExorcismusHitTarget(n_A_ActiveSkill) ||
              ((n_A_MATK[2] = 0), (n_A_MATK[0] = 0), (n_A_MATK[1] = 0)));
          break;
        case 845:
          ((n_Delay[0] = 1),
            (n_A_Weapon_element = 6),
            (wHITsuu = n_A_ActiveSkillLV),
            (wCast = 15),
            n_A_Equip[0] == 863 && (wCast *= 0.75),
            (n_Delay[2] = 4),
            canMagnusExorcismusHitTarget(n_A_ActiveSkill) ||
              ((n_A_MATK[0] = 0), (n_A_MATK[1] = 0), (n_A_MATK[2] = 0)));
          break;
        case SKILLID.DARK_STRIKE:
          ((n_A_Weapon_element = 7), (wHITsuu = Math.ceil(n_A_ActiveSkillLV / 2)));
          break;
        case 373:
          ((n_A_Weapon_element = 1 * c.A_Weapon_element.value),
            (wCast = 0.1),
            (n_Delay[2] = 0.5),
            targetData[4] == 0 ? (wMod = 0.1 * n_A_ActiveSkillLV) : (wMod = 0.01),
            PvP == 1 && (wMod = 0));
          break;
        case 374:
          ((n_A_Weapon_element = 1 * c.A_Weapon_element.value),
            (wCast = 0.1),
            (n_Delay[2] = 0.5),
            (wMod = 0.05 * n_A_ActiveSkillLV),
            PvP == 1 && (wMod = 0));
          break;
        case 375:
          ((n_A_Weapon_element = 1 * c.A_Weapon_element.value),
            (n_Delay[0] = 1),
            (wHITsuu = n_A_ActiveSkillLV),
            (wCast = 2),
            (n_Delay[2] = 0.5),
            (wMod = 0.4 + n_A_BaseLV / 100),
            PvP == 1 && (wMod = 0));
          break;
        case 407:
          ((n_A_Weapon_element = 3),
            (wMod = 0.9),
            (wHITsuu = n_A_ActiveSkillLV),
            (wCast = 0.7 * n_A_ActiveSkillLV));
          break;
        case 408:
          ((n_A_Weapon_element = 3),
            (wMod = 0.5),
            (wHITsuu = Math.round(n_A_ActiveSkillLV / 2) + 4),
            (wCast = 6.5 - 0.5 * n_A_ActiveSkillLV),
            (n_Delay[2] = 1),
            (n_Delay[0] = 1));
          break;
        case 409:
          ((n_bunkatuHIT = 1),
            (n_A_Weapon_element = 3),
            (wMod = 1.5 + 1.5 * n_A_ActiveSkillLV),
            (wHITsuu = 3),
            (wCast = 3),
            (n_Delay[2] = 3));
          break;
        case 410:
          ((n_A_Weapon_element = 1),
            (wMod = 1),
            (wHITsuu = n_A_ActiveSkillLV + 2),
            (wCast = 0.7 * n_A_ActiveSkillLV));
          break;
        case 412:
          ((n_A_Weapon_element = 1),
            (wMod = 1 + 0.5 * n_A_ActiveSkillLV),
            (wHITsuu = 1),
            (wCast = 3),
            (n_Delay[2] = 3));
          break;
        case 413:
          ((n_A_Weapon_element = 4),
            (wMod = 1),
            (wHITsuu = Math.floor(n_A_ActiveSkillLV / 2) + 1),
            (wCast = Math.floor(n_A_ActiveSkillLV / 2) + 1),
            (n_Delay[2] = 1));
          break;
        case 414:
          ((n_A_Weapon_element = 4),
            (wMod = 1.6 + 0.4 * n_A_ActiveSkillLV),
            (wHITsuu = 1),
            (wCast = 4));
          break;
        case 415:
          ((n_A_Weapon_element = 4),
            (wMod = 1 + 1 * n_A_ActiveSkillLV),
            (wHITsuu = 1),
            (wCast = 4));
          break;
      }
      if (((wCast *= n_A_CAST), n_bunkatuHIT == 0))
        for (l = 0; l <= 2; l++)
          ((w_DMG[l] = BattleMagicCalc(n_A_MATK[l] * wMod)),
            SG_Special_HITnum != 0 && (SG_Special_DMG[l] = w_DMG[l]),
            (Last_DMG_B[l] = w_DMG[l]),
            (Last_DMG_A[l] = w_DMG[l] * wHITsuu),
            (InnStr[l] += Last_DMG_A[l] + " (" + Last_DMG_B[l] + SubName[8] + wHITsuu + " hits)"),
            (w_DMG[l] = Last_DMG_A[l]));
      else
        for (l = 0; l <= 2; l++)
          ((w_DMG[l] = Math.floor(BattleMagicCalc(n_A_MATK[l] * wMod) / wHITsuu)),
            (Last_DMG_A[l] = Last_DMG_B[l] = w_DMG[l] * wHITsuu),
            (InnStr[l] += Last_DMG_A[l] + " (" + w_DMG[l] + SubName[8] + wHITsuu + " hits)"),
            (w_DMG[l] *= wHITsuu));
      (CastAndDelay(), BattleCalc998());
    }
  }
}
function ATKmod01Percent() {
  var e = 100;
  return (
    SKILLID.OCCULT_IMPACTION != n_A_ActiveSkill &&
      SKILLID.GUILLOTINE_FIST != n_A_ActiveSkill &&
      SKILLID.GUILLOTINE_FIST_MAX_SP != n_A_ActiveSkill &&
      (SkillSearch(SKILLID.AUTO_BERSERK)
        ? (e += 32)
        : n_A_Buf6[5]
          ? (e += 2 + 3 * n_A_Buf6[5])
          : n_A_Buf7[31] && (e += 5),
      SkillSearch(SKILLID.SPEAR_DYNAMO) && (e += 5 * SkillSearch(SKILLID.SPEAR_DYNAMO)),
      SkillSearch(SKILLID.FALCON_EYES) && (e += 2 * SkillSearch(SKILLID.FALCON_EYES)),
      n_A_Buf2[19] && (e += 100),
      n_A_Buf6[2] && (e += 10),
      StPlusCalc2(87) && (e += StPlusCalc2(87)),
      n_A_Buf6[22] && (e -= 25)),
    e
  );
}
function ATKmod01(e) {
  e == null && (e = ATKmod01Percent());
  for (var _ = 0; _ <= 2; _++)
    ((n_A_CriATK[_] = (n_A_CriATK[_] * e) / 100), (n_A_DMG[_] = (n_A_DMG[_] * e) / 100));
}
function ATKmod02(e, _) {
  ((wA02 = 100 * e),
    SkillSearch(SKILLID.MAXIMUM_POWER_THRUST)
      ? (wA02 += 20 * SkillSearch(SKILLID.MAXIMUM_POWER_THRUST))
      : (SkillSearch(SKILLID.POWER_THRUST) && (wA02 += 5 * SkillSearch(SKILLID.POWER_THRUST)),
        SkillSearch(SKILLID.POWER_THRUST) == 0 && n_A_Buf2[8] && (wA02 += 5 * n_A_Buf2[8])),
    _ == 0
      ? ((n_A_DMG[2] = Math.floor((n_A_DMG[2] * wA02) / 100)),
        (n_A_DMG[0] = Math.floor((n_A_DMG[0] * wA02) / 100)),
        (n_A_DMG[1] = Math.floor((n_A_DMG[1] * wA02) / 100)))
      : ((n_A_CriATK[1] = Math.floor((n_A_CriATK[1] * wA02) / 100)),
        (n_A_CriATK[0] = Math.floor((n_A_CriATK[0] * wA02) / 100)),
        (n_A_CriATK[2] = Math.floor((n_A_CriATK[2] * wA02) / 100))));
}
function BattleTAKA() {
  return n_A_WeaponType == 10 &&
    SkillSearch(SKILLID.BLITZ_BEAT) &&
    SKILLID.FOCUSED_ARROW_STRIKE != n_A_ActiveSkill
    ? ((wBTw1 = Math.floor((n_A_JobLV - 1) / 10 + 1)),
      wBTw1 > 5 && (wBTw1 = 5),
      (wBTw2 = SkillSearch(SKILLID.BLITZ_BEAT)),
      wBTw2 < wBTw1 && (wBTw1 = wBTw2),
      (wBT =
        80 +
        2 * Math.floor(n_A_DEX / 10) +
        2 * Math.floor(n_A_INT / 2) +
        6 * SkillSearch(SKILLID.STEEL_CROW)),
      (wBT = Math.floor(wBT * element[targetData[3]][0])),
      (wBT = tPlusDamCut(wBT)),
      n_A_Buf8[8] == 65 || n_A_Buf8[9] == 65 || n_A_Buf8[10] == 65 || n_A_Buf8[11] == 65
        ? ((wBTw3 = 100), (wBT = Math.floor(wBT / (1 + 1 * c.B_num.value))))
        : (wBTw3 = Math.round(100 * (1 + 0.3 * n_A_LUK)) / 100),
      wBTw3 > 100 && (wBTw3 = 100),
      targetData[0] == 44 && (wBT = 0),
      (str_bSUBname += "Falcon damage (hits) (chance)<BR>"),
      (n_TAKA_DMG = wBT * wBTw1),
      (str_bSUB += n_TAKA_DMG + " (" + wBT + " x " + wBTw1 + " hits)"),
      (str_bSUB += " (" + wBTw3 + "%)<BR>"),
      (wBT = (n_TAKA_DMG * wBTw3) / 100),
      (wBT = (wBT * (w_HIT + ((100 - w_HIT) * w_Cri) / 100)) / 100),
      (wBTw1 = 0),
      Math.round(100 * wBT) / 100)
    : ((n_TAKA_DMG = 0), 0);
}
function HealCalc(e, _) {
  wHeal = Math.floor((n_A_BaseLV + n_A_INT) / 8) * (8 * e + 4);
  var n = 100 + 2 * SkillSearch(SKILLID.MEDIATIO);
  wHeal = Math.floor((wHeal * n) / 100);
  var a = 100 + bonusValues[91] + bonusValues[99];
  return (
    _ == 1 && (a += bonusValues[92] + bonusValues[100]),
    (wHeal = Math.floor(wHeal * (a / 100) * (1 - (20 * n_A_Buf6[18]) / 100))),
    wHeal
  );
}
function SanctuaryCalc(e, _) {
  wSanctuary = e < 7 ? 100 * e : 777;
  var n = 100 + bonusValues[94] + bonusValues[99];
  return (
    _ == 1 && (n += bonusValues[95] + bonusValues[100]),
    (wSanctuary = Math.floor(wSanctuary * (n / 100) * (1 - (20 * n_A_Buf6[18]) / 100))),
    wSanctuary
  );
}
function BattleCalc998() {
  if (
    (n_PerHIT_DMG > 0 &&
      w_HIT_HYOUJI < 100 &&
      ((str_bSUBname += "Damage when missing"),
      str_PerHIT_DMG == 0 ? (str_bSUB += n_PerHIT_DMG) : (str_bSUB += str_PerHIT_DMG)),
    SKILLID.BASIC_ATTACK == n_A_ActiveSkill &&
      (w_HIT_HYOUJI -= (n_B_manual[38] * w_HIT_HYOUJI) / 100),
    myInnerHtml("bSUBname", str_bSUBname, 0),
    myInnerHtml("bSUB", str_bSUB, 0),
    myInnerHtml("BattleHIT", w_HIT_HYOUJI, 0),
    targetData[0] == 44 &&
      SKILLID.BASIC_ATTACK != n_A_ActiveSkill &&
      SKILLID.GRAVITY_FIELD != n_A_ActiveSkill)
  )
    for (i = 0; i <= 2; i++) ((w_DMG[i] = 0), myInnerHtml("ATK_0" + i, 0, 0));
  tPlusAG();
  var e = 1;
  if (
    (SKILLID.FIRE_BOLT_HINDSIGHT == n_A_ActiveSkill ||
    SKILLID.COLD_BOLT_HINDSIGHT == n_A_ActiveSkill ||
    SKILLID.LIGHTNING_BOLT_HINDSIGHT == n_A_ActiveSkill
      ? (SkillSearch(SKILLID.DOUBLE_BOLT) && (e = 1 + c.SkillSubNum.value / 10),
        (w_DMG[0] = Math.floor((w_DMG[0] * e) / 4)),
        (w_DMG[1] = Math.floor((w_DMG[1] * e) / 4)),
        (w_DMG[2] = Math.floor((w_DMG[2] * e) / 4)))
      : (SKILLID.FIRE_BOLT != n_A_ActiveSkill &&
          SKILLID.COLD_BOLT != n_A_ActiveSkill &&
          SKILLID.LIGHTNING_BOLT != n_A_ActiveSkill) ||
        (SkillSearch(SKILLID.DOUBLE_BOLT) && (e = 1 + c.SkillSubNum.value / 10),
        (w_DMG[0] = Math.floor(w_DMG[0] * e)),
        (w_DMG[1] = Math.floor(w_DMG[1] * e)),
        (w_DMG[2] = Math.floor(w_DMG[2] * e))),
    (A = Math.floor(targetData[6] / w_DMG[2])),
    targetData[6] % Math.floor(w_DMG[2]) != 0 && (A += 1),
    myInnerHtml("MinATKnum", A < 1e4 ? A : SubName[5], 0),
    SG_Special_HITnum != 0)
  ) {
    if (A == 1) {
      var _, n;
      if (
        ((_ = SG_Special_HITnum),
        (n =
          (SG_Special_DMG[2] * wHITsuu - targetData[6]) /
          (SG_Special_DMG[2] * wHITsuu - SG_Special_DMG[0] * wHITsuu)) > 1 && (n = 1),
        n < 0 && (n = 0),
        _ == 2 && (n < 0.5 ? (n *= 2 * n) : (n = 1 - 2 * (1 - n) * (1 - n))),
        _ == 3 &&
          (n < 1 / 3
            ? (n = 4.5 * Math.pow(n, 3))
            : 1 / 3 <= n && n < 2 / 3
              ? (n = 4.5 * (Math.pow(n, 3) - 3 * Math.pow(n - 1 / 3, 3)))
              : 2 / 3 <= n && (n = 1 - 4.5 * Math.pow(1 - n, 3))),
        _ >= 4)
      ) {
        var a = Math.sqrt((Math.pow(SG_Special_DMG[2] - SG_Special_DMG[0], 2) / 12) * _);
        n =
          (n = (SG_Special_DMG[1] * wHITsuu - targetData[6]) / a) >= 0
            ? 0.5 + 0.5 * Math.sqrt(1 - Math.exp((-2 * Math.pow(n, 2)) / Math.PI))
            : 0.5 - 0.5 * Math.sqrt(1 - Math.exp((-2 * Math.pow(n, 2)) / Math.PI));
      }
      myInnerHtml("MinATKnum", "1 (" + (n = Math.floor(1e4 * n) / 100) + "% chance)", 0);
    }
    SG_Special_HITnum = 0;
  }
  if (w_HIT_HYOUJI < 100 && n_PerHIT_DMG == 0)
    myInnerHtml("MaxATKnum", "Infinite (no 100% hit)", 0);
  else {
    var o = w_DMG[0];
    (w_HIT_HYOUJI < 100 && (o = n_PerHIT_DMG),
      (A = Math.floor(targetData[6] / o)),
      targetData[6] % Math.floor(o) != 0 && (A += 1),
      myInnerHtml("MaxATKnum", A < 1e4 ? A : SubName[5], 0));
  }
  if (
    ((A = Math.floor(targetData[6] / w_DMG[1])),
    targetData[6] % w_DMG[1] != 0 && (A += 1),
    myInnerHtml("nm064", "", 0),
    myInnerHtml("AtkJobExp", "", 0),
    PvP == 0
      ? (myInnerHtml("nm063", "Exp Per Hit", 0),
        myInnerHtml(
          "AtkBaseExp",
          A < 1e4
            ? Math.round(targetData[16] / A) + " base, " + Math.round(targetData[17] / A) + " job"
            : SubName[7],
          0,
        ))
      : (myInnerHtml("nm063", "", 0), myInnerHtml("AtkBaseExp", "", 0)),
    A < 1e4)
  ) {
    (myInnerHtml("AveATKnum", A, 0), (n_AveATKnum = A));
    var t = (wCast + wDelay) * n_AveATKnum;
    ((t = Math.floor(100 * t) / 100),
      n_Delay[0]
        ? myInnerHtml("BattleTime", "Special", 0)
        : myInnerHtml("BattleTime", t + " seconds", 0));
  } else (myInnerHtml("AveATKnum", SubName[5], 0), myInnerHtml("BattleTime", SubName[6], 0));
  var A = (1 / (wCast + wDelay)) * w_DMG[1];
  ((A *= 100),
    (A = Math.round(A)),
    (A /= 100),
    n_Delay[0] ? myInnerHtml("AveSecondATK", "Special", 0) : myInnerHtml("AveSecondATK", A, 0),
    (A = BattleHiDam()),
    (A = Math.round(A * (100 - n_A_LUCKY)) / 100),
    (A = Math.round(A * (100 - w_FLEE)) / 100) < 0 && (A = 0),
    n_A_Buf2[13] && (A = Math.round(A * w_AG[n_A_Buf2[13]]) / 100),
    n_A_WeaponType == 3 &&
      SkillSearch(SKILLID.PARRY) &&
      (A = Math.round(A * (80 - 3 * SkillSearch(SKILLID.PARRY))) / 100),
    SkillSearch(SKILLID.COUNTER_INSTINCT) &&
      (A = Math.round(A * (100 - 7.5 * SkillSearch(SKILLID.COUNTER_INSTINCT))) / 100));
  var s = Math.round(100 * A * BskillHitNum) / 100;
  (myInnerHtml("B_Ave2Atk", s, 0), updateAttackSurvivability(s));
}
function formatEffectiveHP(e) {
  return e == 1 / 0 ? "∞" : !isFinite(e) || e < 0 ? "—" : Math.round(e).toLocaleString("en-US");
}
function formatSurvivalHits(e, _) {
  if (e == 1 / 0 && _ == 1 / 0) return "∞ hits";
  var n = e == 1 / 0 ? "∞" : e.toLocaleString("en-US"),
    a = _ == 1 / 0 ? "∞" : _.toLocaleString("en-US");
  return n == a ? n + (e == 1 ? " hit" : " hits") : n + "–" + a + " hits";
}
function updateAttackSurvivability(e) {
  var _ = n_B_rawAverageDamage * BskillHitNum,
    n = n_B_averageDamage * BskillHitNum,
    a = _ > 0 ? (n > 0 ? (n_A_MaxHP * _) / n : 1 / 0) : NaN,
    o = _ > 0 ? (e > 0 ? (n_A_MaxHP * _) / e : 1 / 0) : NaN;
  (myInnerHtml("B_EffectiveHP", formatEffectiveHP(a), 0),
    myInnerHtml("B_ExpectedEffectiveHP", formatEffectiveHP(o), 0));
  var t = n_B_minDamage * BskillHitNum,
    A = n_B_maxDamage * BskillHitNum,
    s = A > 0 ? Math.ceil(n_A_MaxHP / A) : 1 / 0,
    u = t > 0 ? Math.ceil(n_A_MaxHP / t) : 1 / 0;
  myInnerHtml("B_SurvivalHits", formatSurvivalHits(s, u), 0);
}
function BattleHiDam() {
  var e = 100,
    _ = [0, 0, 0],
    n = Math.floor(targetData[9] / 7);
  ((_[0] = targetData[9] + n_B_manual[42] + n * n),
    (_[0] += (n_B_manual[43] * _[0]) / 100),
    (n = Math.floor(targetData[9] / 5)),
    (_[2] = targetData[9] + n_B_manual[42] + n * n),
    (_[2] += (n_B_manual[43] * _[2]) / 100),
    (_[1] = (_[2] + _[0]) / 2));
  var a = 0;
  ((n_B_rangedAtk = 0), (n_B_rangedMAtk = 0));
  var o = 0;
  n_B_AtkSkill = c.B_AtkSkill.value;
  var t;
  if (
    ((t = m_Monster[targetData[0]][2 * c.B_AtkSkill.selectedIndex + 22]),
    (BskillHitNum = 1),
    n_B_AtkSkill == 444 || n_B_AtkSkill == 445)
  )
    if (((BskillHitNum = 3), (n_B_rangedAtk = n_B_AtkSkill - 444), (o = 1), CardNumSearch(126)))
      e = 0;
    else
      switch (t) {
        case 1:
          e += 200;
          break;
        case 2:
          e += 400;
          break;
        case 3:
          e += 500;
          break;
        case 4:
          e += 700;
          break;
        case 5:
          e += 900;
          break;
        case 6:
          e += 1100;
          break;
        case 7:
          e += 1200;
          break;
        case 8:
          e += 1400;
          break;
        case 9:
          e += 1500;
          break;
        case 10:
          e += 1700;
      }
  else if (n_B_AtkSkill == 446 || n_B_AtkSkill == 447)
    ((e += 100 * t), (n_B_rangedAtk = n_B_AtkSkill - 446));
  else if (n_B_AtkSkill == 448 || n_B_AtkSkill == 449)
    ((e += 100 * t - 100), (n_B_rangedAtk = n_B_AtkSkill - 448));
  else if (n_B_AtkSkill >= 450 && n_B_AtkSkill <= 459)
    ((a = n_B_AtkSkill - 450), (e += 100 * t - 100));
  else if (n_B_AtkSkill == 463) a = 7;
  else if (n_B_AtkSkill == 464) a = 7;
  else if (n_B_AtkSkill == 470) ((BskillHitNum = 1 + t), (e += 100 * t - 100));
  else if (n_B_AtkSkill == 471) ((n_B_rangedMAtk = 1), (a = 7), (BskillHitNum = Math.round(t / 2)));
  else if (n_B_AtkSkill == 472) ((n_B_rangedMAtk = 1), (a = 7), (BskillHitNum = 2 + t));
  else if (n_B_AtkSkill == 473) ((a = 7), (e += 35 * t));
  else if (n_B_AtkSkill == 474) ((a = 7), (e += 40 * t));
  else if (n_B_AtkSkill == 475) e += 0;
  else if (n_B_AtkSkill == 476)
    ((n = Math.floor(targetData[9] / 7)),
      (_[0] = targetData[9] + n * n),
      (n = Math.floor(targetData[9] / 5)),
      (_[2] = targetData[9] + n * n),
      (_[1] = (_[2] + _[0]) / 2),
      (e = targetData[9]));
  else if (n_B_AtkSkill == 477) n_B_HIT += 20;
  else if (n_B_AtkSkill == 480) a = 7;
  else if (n_B_AtkSkill == 481) a = 7;
  else if (n_B_AtkSkill == 482) t < 6 ? (e = 100 * t - 100) : (e += 100 * (t - 5) - 100);
  else if (n_B_AtkSkill == 483) o = 1;
  else if (n_B_AtkSkill == 484) ((e += 100 * t - 100), (a = Math.floor(10 * Math.random())));
  else if (n_B_AtkSkill == 485) n_B_rangedAtk = 1;
  else if (n_B_AtkSkill == 487) ((o = 1), (targetData[12] = targetData[13]));
  else if (n_B_AtkSkill >= 490 && n_B_AtkSkill <= 499)
    ((n_B_rangedAtk = 0), (a = n_B_AtkSkill - 490), (e += 100 * t - 100));
  else if (n_B_AtkSkill >= 500 && n_B_AtkSkill <= 509)
    ((n_B_rangedAtk = 1), (a = n_B_AtkSkill - 500), (e += 100 * t - 100));
  else if (n_B_AtkSkill == 6) ((e += 30 * t), (n_B_HIT *= 1 + 0.05 * t));
  else if (n_B_AtkSkill == 7) ((e += 20 * t), (n_B_HIT *= 1 + 0.1 * t), (a = 3));
  else if (n_B_AtkSkill == 17) ((e += 20 * t), (a = 5));
  else if (n_B_AtkSkill == 19) ((e += 30), (a = 2));
  else if (n_B_AtkSkill == 40) ((e += 10 * t - 10), (BskillHitNum = 2));
  else if (n_B_AtkSkill == 41) ((n_B_rangedAtk = 1), (e += 5 * t - 25));
  else if (n_B_AtkSkill == 44) ((n_B_rangedAtk = 1), (e += 50));
  else if (n_B_AtkSkill == 46) ((n_B_rangedMAtk = 1), (a = 8), (e += 10 * t - 30));
  else if (n_B_AtkSkill == 47)
    ((n_B_rangedMAtk = 1),
      (a = 8),
      (BskillHitNum = Math.round(t / 2)),
      (targetData[3] != 91 && targetData[3] != 92 && targetData[3] != 93 && targetData[3] != 94) ||
        (e += 5 * t));
  else if (n_B_AtkSkill == 51) ((n_B_rangedMAtk = 1), (a = 3), (BskillHitNum = t));
  else if (n_B_AtkSkill == 52) ((n_B_rangedMAtk = 1), (a = 3), (e += 10 * t - 30));
  else if (n_B_AtkSkill == 53) ((n_B_rangedMAtk = 1), (a = 3), (BskillHitNum = 4 + t), (e -= 50));
  else if (n_B_AtkSkill == 54) ((n_B_rangedMAtk = 1), (a = 1), (BskillHitNum = t));
  else if (n_B_AtkSkill == 55) ((n_B_rangedMAtk = 1), (a = 1), (e += 10 * t));
  else if (n_B_AtkSkill == 56) ((n_B_rangedMAtk = 1), (a = 4), (BskillHitNum = t));
  else if (n_B_AtkSkill == 57) ((n_B_rangedMAtk = 1), (a = 4), (BskillHitNum = t), (e -= 20));
  else if (n_B_AtkSkill == 65) e += 50 * t;
  else if (n_B_AtkSkill == 66) ((a = 3), (e += 50 * t + (100 * c.BSkillSubNum.value) / 8e3));
  else if (n_B_AtkSkill == 70) ((e += 10 * t), (BskillHitNum = 2));
  else if (n_B_AtkSkill == 71) ((e += 20 * t), (n_B_rangedAtk = 1));
  else if (n_B_AtkSkill == 76) ((e += 40 * t), (BskillHitNum = 2));
  else if (n_B_AtkSkill == 84) (t >= 3 && (n_B_rangedAtk = 1), (e += 20 * t));
  else if (n_B_AtkSkill == 88) ((e += 400 + 50 * t + 30 * c.BSkillSubNum.value), (a = 5));
  else if (n_B_AtkSkill == 104)
    (n_A_card[11] == 139 ? (e += 30 * t) : (e = 0), (n_B_rangedMAtk = 1), (a = 6));
  else if (n_B_AtkSkill == 845)
    (n_A_card[11] == 139 ? (e += 30 * t) : (e = 0), (n_B_rangedMAtk = 1), (a = 6));
  else if (n_B_AtkSkill == 158) e += 20 * t;
  else if (n_B_AtkSkill == 161) ((e += 35 * t), (a = 6));
  else if (n_B_AtkSkill == 162) ((e += 40 * t), (n_B_rangedMAtk = 1), (a = 6));
  else if (n_B_AtkSkill == 171) e += 40 * t;
  else if (n_B_AtkSkill == 72) ((e += 50 * t), (n_B_rangedAtk = 1));
  else if (n_B_AtkSkill == 73)
    ((n = 20 * t + 100),
      (e +=
        t == 10 ? 462.5 : t >= 7 ? n + n / 2 + n / 4 - 100 : t >= 4 ? n + n / 2 - 100 : n - 100));
  else if (n_B_AtkSkill == 83 || n_B_AtkSkill == 388)
    ((e += 50 * t + 200),
      n_B_AtkSkill == 388 && PvP == 0 && (e *= 2),
      n_B_AtkSkill == 388 && PvP == 1 && (n_WoE ? (e *= 1.25) : (e *= 2)));
  else if (n_B_AtkSkill == 111) a = 1;
  else if (n_B_AtkSkill == 122) ((n_B_rangedMAtk = 1), (a = 3), (BskillHitNum = 2 + t), (e -= 30));
  else if (n_B_AtkSkill == 124) ((n_B_rangedMAtk = 1), (a = 3), (e += 20 * t));
  else if (n_B_AtkSkill == 125)
    ((n_B_rangedMAtk = 1), (a = 3), (BskillHitNum = c.BSkillSubNum.value * Math.round(t / 2)));
  else if (n_B_AtkSkill == 126) ((n_B_rangedMAtk = 1), (a = 4), (BskillHitNum = 2 + t));
  else if (n_B_AtkSkill == 127)
    ((n_B_rangedMAtk = 1), (a = 4), (BskillHitNum = 4), (e += 20 * t - 20));
  else if (n_B_AtkSkill == 128 || n_B_AtkSkill == 320)
    ((n_B_rangedMAtk = 1), (a = 1), (BskillHitNum = t >= 4 ? 25 : t >= 2 ? 9 : 1), (e += 30 * t));
  else if (n_B_AtkSkill == 130) ((n_B_rangedMAtk = 1), (a = 1), (e += 7 * t - 34));
  else if (n_B_AtkSkill == 131)
    ((n_B_rangedMAtk = 1), (a = 1), (BskillHitNum = c.BSkillSubNum.value), (e += 40 * t));
  else if (n_B_AtkSkill == 132) ((n_B_rangedMAtk = 1), (a = 2), (BskillHitNum = t));
  else if (n_B_AtkSkill == 133) ((n_B_rangedMAtk = 1), (a = 2), (BskillHitNum = t));
  else if (n_B_AtkSkill == 169) e += 40 * t + 200;
  else if (n_B_AtkSkill == 176) e += 30 * t;
  else if (n_B_AtkSkill == 188) ((BskillHitNum = 4), (e += 50 * t + 50));
  else if (n_B_AtkSkill == 189) e += 60 * t + 140;
  else if (n_B_AtkSkill == 199 || n_B_AtkSkill == 207) ((e += 40 * t - 40), (n_B_rangedAtk = 1));
  else if (n_B_AtkSkill == 248) ((a = 3), (e += 0.2 * t));
  else if ((n_B_AtkSkill != 159 && n_B_AtkSkill != 384) || PvP != 0)
    if (n_B_AtkSkill == 259 && PvP == 0) ((BskillHitNum = 5), (n_B_rangedAtk = 1), (o = 1));
    else if (n_B_AtkSkill == 324 && PvP == 0)
      ((n_B_HIT += 20), (BskillHitNum = 5), (n_B_rangedAtk = 1), (e += 30 * t));
    else if (n_B_AtkSkill == 260) ((n_B_rangedAtk = 1), (e += 40 * t));
    else if (n_B_AtkSkill == 261) ((n_B_rangedAtk = 1), (e += 10 * t - 50));
    else if (n_B_AtkSkill == 264) e += 40 * t - 60;
    else if (n_B_AtkSkill == 277) ((n_B_rangedMAtk = 1), (a = 8), (BskillHitNum = t));
    else if (n_B_AtkSkill == 288) e += 100 * (1 + t);
    else if (n_B_AtkSkill == 289) e += 100 * t - 60;
    else if (n_B_AtkSkill == 290) e += 100 * (3 + t);
    else if (n_B_AtkSkill == 292) ((BskillHitNum = 9), (e += 100 * (1 + t)), (n_B_rangedAtk = 1));
    else if (n_B_AtkSkill == 302) ((n_B_rangedAtk = 1), (a = 4));
    else if (n_B_AtkSkill == 303) e += 100 * (t - 1);
    else if (n_B_AtkSkill == 305) e += 4 * n_A_BaseLV - 100;
    else if (n_B_AtkSkill == 306) n_B_rangedAtk = 1;
    else if (n_B_AtkSkill == 307) ((n_B_rangedAtk = 1), (e += 50));
    else if (n_B_AtkSkill == 308) e += 100 * (n = 1 * c.SkillSubNum.value);
    else
      switch (n_B_AtkSkill) {
        case 326:
          ((not_use_card = 1),
            (e += Math.floor(100 * ((1 * c.BSkillSubNum.value) / (16 - t) / 100 - 1))));
          break;
        case 382:
          e += 200;
          break;
        default:
          e = 100;
      }
  else ((n_B_rangedAtk = 1), (e += 30 * t));
  w_HiDam = new Array();
  var A = 0;
  if (n_B_rangedMAtk == 0) {
    if ((n_B_AtkSkill != 159 && n_B_AtkSkill != 384) || PvP != 1)
      if (n_B_AtkSkill == 259 && PvP == 0) {
        var s = Math.floor(targetData[5]),
          u = Math.floor(s / 10) * Math.floor(s / 10),
          I = s + 2 * u;
        ((wBHD = targetData[13]),
          (w_HiDam[0] = targetData[12] + I),
          (w_HiDam[1] = (5 * targetData[12] + wBHD) / 6 + I),
          (w_HiDam[2] = (4 * targetData[12] + 2 * wBHD) / 6 + I),
          (w_HiDam[3] = (targetData[12] + wBHD) / 2 + I),
          (w_HiDam[4] = (2 * targetData[12] + 4 * wBHD) / 6 + I),
          (w_HiDam[5] = (targetData[12] + 5 * wBHD) / 6 + I),
          (w_HiDam[6] = wBHD + I));
      } else if (n_B_AtkSkill == 259 && PvP == 1)
        for (
          BskillHitNum = 5,
            n_B_rangedAtk = 1,
            o = 1,
            PvP == 1 &&
              ((bWeaponw = Math.floor(c.BSkillSubNum.value)),
              (bSTR = Math.floor(c.BSkillSubNum2.value))),
            bDMG = Math.floor(bSTR / 10) * Math.floor(bSTR / 10) + 0.8 * bWeaponw * (1 + 0.5 * t),
            i = 0;
          i <= 6;
          i++
        )
          w_HiDam[i] = bDMG;
      else if (n_B_AtkSkill == 324 && PvP == 1)
        for (
          n_B_HIT += 20,
            BskillHitNum = 5,
            n_B_rangedAtk = 1,
            PvP == 1 && (bShieldw = Math.floor(c.BSkillSubNum.value)),
            i = 0;
          i <= 6;
          i++
        )
          w_HiDam[i] =
            Math.floor(
              Math.floor(
                5 * (targetData[13] * (1 + 0.3 * t) + bShieldw) * defReduction(n_A_totalDEF) -
                  n_A_VITDEF[Math.floor(i / 2)],
              ) *
                (1 + 0.3 * t),
            ) +
            5 * n_A_LEFT_REFINE * 2;
      else
        ((wBHD = targetData[13]),
          (w_HiDam[0] = (e / 100) * targetData[12]),
          (w_HiDam[1] = ((e / 100) * (5 * targetData[12] + wBHD)) / 6),
          (w_HiDam[2] = ((e / 100) * (4 * targetData[12] + 2 * wBHD)) / 6),
          (w_HiDam[3] = ((e / 100) * (targetData[12] + wBHD)) / 2),
          (w_HiDam[4] = ((e / 100) * (2 * targetData[12] + 4 * wBHD)) / 6),
          (w_HiDam[5] = ((e / 100) * (targetData[12] + 5 * wBHD)) / 6),
          (w_HiDam[6] = (e / 100) * wBHD));
    else {
      for (
        n_B_rangedAtk = 1, PvP == 1 && (bShieldw = Math.floor(c.BSkillSubNum.value)), i = 0;
        i <= 6;
        i++
      )
        w_HiDam[i] =
          Math.floor(
            Math.floor(
              5 * (targetData[13] * (1 + 0.3 * t) + bShieldw) * defReduction(n_A_totalDEF) -
                n_A_VITDEF[Math.floor(i / 2)],
            ) *
              (1 + 0.3 * t),
          ) +
          5 * n_A_LEFT_REFINE * 2;
      w_HiDam[i] = Math.floor(
        Math.floor(targetData[13] + bShieldw) * (1 + 0.3 * n_A_ActiveSkillLV),
      );
    }
    for (i = 0; i <= 6; i++) A += w_HiDam[i];
    ((A /= 7),
      o == 0 &&
        ((w_HiDam[0] = w_HiDam[0] * defReduction(n_A_totalDEF) - n_A_VITDEF[2]),
        (w_HiDam[1] = w_HiDam[1] * defReduction(n_A_totalDEF) - n_A_VITDEF[2]),
        (w_HiDam[2] = w_HiDam[2] * defReduction(n_A_totalDEF) - n_A_VITDEF[2]),
        (w_HiDam[3] = w_HiDam[3] * defReduction(n_A_totalDEF) - n_A_VITDEF[1]),
        (w_HiDam[4] = w_HiDam[4] * defReduction(n_A_totalDEF) - n_A_VITDEF[0]),
        (w_HiDam[5] = w_HiDam[5] * defReduction(n_A_totalDEF) - n_A_VITDEF[0]),
        (w_HiDam[6] = w_HiDam[6] * defReduction(n_A_totalDEF) - n_A_VITDEF[0])));
  } else {
    for (
      wBHD = _[2],
        w_HiDam[0] = (e / 100) * _[0],
        w_HiDam[1] = ((e / 100) * (5 * _[0] + wBHD)) / 6,
        w_HiDam[2] = ((e / 100) * (4 * _[0] + 2 * wBHD)) / 6,
        w_HiDam[3] = ((e / 100) * (_[0] + wBHD)) / 2,
        w_HiDam[4] = ((e / 100) * (2 * _[0] + 4 * wBHD)) / 6,
        w_HiDam[5] = ((e / 100) * (_[0] + 5 * wBHD)) / 6,
        w_HiDam[6] = (e / 100) * wBHD,
        i = 0;
      i <= 6;
      i++
    )
      A += w_HiDam[i];
    ((A /= 7),
      (w_HiDam[0] = w_HiDam[0] * mdefReduction(n_A_MDEF) - n_A_softMDEF),
      (w_HiDam[1] = w_HiDam[1] * mdefReduction(n_A_MDEF) - n_A_softMDEF),
      (w_HiDam[2] = w_HiDam[2] * mdefReduction(n_A_MDEF) - n_A_softMDEF),
      (w_HiDam[3] = w_HiDam[3] * mdefReduction(n_A_MDEF) - n_A_softMDEF),
      (w_HiDam[4] = w_HiDam[4] * mdefReduction(n_A_MDEF) - n_A_softMDEF),
      (w_HiDam[5] = w_HiDam[5] * mdefReduction(n_A_MDEF) - n_A_softMDEF),
      (w_HiDam[6] = w_HiDam[6] * mdefReduction(n_A_MDEF) - n_A_softMDEF));
  }
  if (SkillSearch(SKILLID.DIVINE_PROTECTION) && (targetData[3] >= 90 || targetData[2] == 6))
    for (
      wBHD = Math.floor((3 + 0.04 * n_A_BaseLV) * SkillSearch(SKILLID.DIVINE_PROTECTION)), i = 0;
      i <= 6;
      i++
    )
      w_HiDam[i] -= wBHD;
  if (SkillSearch(SKILLID.SOLAR_PROTECTION))
    for (wBHD = Math.floor((n_A_BaseLV + n_A_LUK + n_A_DEX) / 2), i = 0; i <= 6; i++)
      w_HiDam[i] -= wBHD;
  if (SkillSearch(SKILLID.ENERGY_COAT))
    for (wBHD = 6 * SkillSearch(SKILLID.ENERGY_COAT), i = 0; i <= 6; i++)
      w_HiDam[i] -= Math.floor((w_HiDam[i] * wBHD) / 100);
  if (((wBHD = bonusValues[50 + targetData[2]]), wBHD != 0))
    for (i = 0; i <= 6; i++) w_HiDam[i] -= Math.floor((w_HiDam[i] * wBHD) / 100);
  if (((wBHD = bonusValues[190 + targetData[4]]), wBHD != 0))
    for (i = 0; i <= 6; i++) w_HiDam[i] -= Math.floor((w_HiDam[i] * wBHD) / 100);
  if (targetData[19] == 0)
    for (wBHD = bonusValues[79], i = 0; i <= 6; i++)
      w_HiDam[i] -= Math.floor((w_HiDam[i] * wBHD) / 100);
  if (
    (targetData[20] || n_B_rangedAtk || n_B_rangedMAtk || c.B_AtkRange.value == 2) &&
    c.B_AtkRange.value != 1
  ) {
    for (wBHD = bonusValues[78], i = 0; i <= 6; i++)
      w_HiDam[i] -= Math.floor((w_HiDam[i] * wBHD) / 100);
    if (SkillSearch(SKILLID.GUNSLINGERS_PANIC))
      for (wBHD = 20, i = 0; i <= 6; i++) w_HiDam[i] -= Math.floor((w_HiDam[i] * wBHD) / 100);
  }
  if ((targetData[20] || c.B_AtkRange.value == 2) && c.B_AtkRange.value != 1) {
    if (n_A_Buf2[15])
      for (wBHD = 5 + 15 * n_A_Buf2[15], i = 0; i <= 6; i++)
        w_HiDam[i] -= Math.floor((w_HiDam[i] * wBHD) / 100);
    if (n_A_Buf6[3])
      for (wBHD = 75, i = 0; i <= 6; i++) w_HiDam[i] -= Math.floor((w_HiDam[i] * wBHD) / 100);
  }
  if (n_A_Buf6[3] && SKILLID.CLASHING_SPIRAL == n_B_AtkSkill)
    for (wBHD = 25, i = 0; i <= 6; i++) w_HiDam[i] -= Math.floor((w_HiDam[i] * wBHD) / 100);
  if (targetData[19] == 1)
    for (i = 0; i <= 6; i++) w_HiDam[i] -= Math.floor((w_HiDam[i] * bonusValues[77]) / 100);
  0;
  if (((wBHD = bonusValues[330 + Math.floor(targetData[3] / 10)]), wBHD != 0))
    for (i = 0; i <= 6; i++) w_HiDam[i] -= Math.floor((w_HiDam[i] * wBHD) / 100);
  for (
    wBHD = StPlusCard(3e3 + targetData[0]), wBHD += StPlusCalc2(3e3 + targetData[0]), i = 0;
    i <= 6;
    i++
  )
    w_HiDam[i] -= Math.floor((w_HiDam[i] * wBHD) / 100);
  if (n_A_Buf7[22] && MANUKU_MONSTER())
    for (i = 0; i <= 6; i++) w_HiDam[i] -= Math.floor(w_HiDam[i] / 10);
  if (n_A_Buf7[25] && SUPURE_MONSTER())
    for (i = 0; i <= 6; i++) w_HiDam[i] -= Math.floor(w_HiDam[i] / 10);
  for (i = 0; i <= 6; i++) w_HiDam[i] < 1 && (w_HiDam[i] = 1);
  var D = 1 * c.B_AtkElem.value;
  D < 10 && (a = D);
  var f = D == 10 && PvP == 0 && n_B_AtkSkill == 0,
    r = D == 10 && PvP == 0 && !1,
    k = n_A_Bodyelement == 8 && (f || r);
  ((n_A_ResElem = k ? 100 : 100 * Math.max(0, element[10 * n_A_Bodyelement + 1][a])),
    (wBHD = n_A_ResElem - Math.floor(n_A_ResElem * bonusValues[60 + 1 * a]) / 100),
    k || (n_A_Bodyelement != 8 && D == 10) || D != 10 || PvP);
  for (i = 0; i <= 6; i++) w_HiDam[i] = Math.floor((w_HiDam[i] * wBHD) / 100);
  if (n_A_Buf2[5])
    if (c.A8_Skill14.value > 0 || n_A_Buf6[2])
      for (i = 0; i <= 6; i++) w_HiDam[i] = Math.floor((2 * w_HiDam[i]) / 3);
    else for (i = 0; i <= 6; i++) w_HiDam[i] = Math.floor(w_HiDam[i] / 2);
  if (n_A_Buf6[16]) for (i = 0; i <= 6; i++) w_HiDam[i] = Math.floor(2 * w_HiDam[i]);
  if (n_A_Buf2[21]) for (i = 0; i <= 6; i++) w_HiDam[i] = Math.floor(w_HiDam[i] / 2);
  if (
    ((w_HiDam[0] = Math.floor(w_HiDam[0])),
    (w_HiDam[6] = Math.floor(w_HiDam[6])),
    n_B_AtkSkill == 444 || n_B_AtkSkill == 445)
  ) {
    var T = 1 * c.BSkillSubNum.value;
    for (i = 0; i <= 6; i++) w_HiDam[i] = Math.floor(w_HiDam[i] / T);
  }
  if ((n_B_AtkSkill == 446 || n_B_AtkSkill == 447) && n_A_Bodyelement == 7)
    for (i = 0; i <= 6; i++) w_HiDam[i] = 0;
  if (n_B_AtkSkill == 488)
    for (A = Math.floor((t * n_A_MaxHP) / 10), i = 0; i <= 6; i++) w_HiDam[i] = A;
  if (n_B_AtkSkill == 510)
    if (n_A_Bodyelement == 7) for (i = 0; i <= 6; i++) w_HiDam[i] = 0;
    else for (A = n_A_MaxHP - 1, i = 0; i <= 6; i++) w_HiDam[i] = A;
  if (n_B_AtkSkill == 489)
    for (a = 3, wBHD = bonusValues[60 + a], A = 1 * c.BSkillSubNum.value, i = 0; i <= 6; i++)
      w_HiDam[i] = 1 * c.BSkillSubNum.value - Math.floor((c.BSkillSubNum.value * wBHD) / 100);
  if (CardNumSearch(126) && n_B_rangedMAtk == 1) for (i = 0; i <= 6; i++) w_HiDam[i] = 0;
  for (
    myInnerHtml(
      "B_WeaponElement",
      f
        ? "<span class=name><b style='color:#A89682'>None</b><span class=nametext>Monster's basic attacks are non-elemental, not Neutral; they bypass armor-property modifiers such as Ghostring, but are still reduced by Neutral-resistance gear/cards.</span></span> (100% vs any element)"
        : v_Element[a] +
            " (" +
            100 * element[10 * n_A_Bodyelement + 1][a] +
            "% vs " +
            v_Element[n_A_Bodyelement] +
            "1)",
      0,
    ),
      wBHD = 0,
      i = 0;
    i <= 6;
    i++
  )
    ((w_HiDam[i] = Math.floor(w_HiDam[i])),
      (w_HiDam[i] = Math.max(0, w_HiDam[i])),
      (wBHD += w_HiDam[i]));
  if (
    ((wBHD = Math.round(wBHD / 7)),
    (n_B_rawAverageDamage = A),
    (n_B_averageDamage = wBHD),
    (n_B_minDamage = w_HiDam[0]),
    (n_B_maxDamage = w_HiDam[6]),
    n_A_Buf2[14])
  ) {
    if (
      (targetData[20] || n_B_rangedAtk || n_B_rangedMAtk || c.B_AtkRange.value == 2) &&
      c.B_AtkRange.value != 1
    )
      myInnerHtml("aREFLECT1", '<B style="color:blue">(no melee dmg to reflect)</B>', 0);
    else {
      var l = 1 * (10 + 3 * n_A_Buf2[14]),
        d = new Array();
      ((d[0] = Math.floor((wBHD * l) / 100)),
        (d[1] = Math.floor((w_HiDam[0] * l) / 100)),
        (d[2] = Math.floor((w_HiDam[6] * l) / 100)),
        wBHD > 0 && (d[0] == 0 && (d[0] = 1), d[1] == 0 && (d[1] = 1), d[2] == 0 && (d[2] = 1)),
        myInnerHtml("aREFLECT1", '<B style="color:blue">' + d[1] + " ~ " + d[2] + "</B>", 0));
    }
    myInnerHtml(
      "aREFLECT1name",
      '<SPAN style="color:blue">Damage reflected (Shield Reflect)</SPAN>',
      0,
    );
  } else (myInnerHtml("aREFLECT1", "", 0), myInnerHtml("aREFLECT1name", "", 0));
  if (bonusValues[71]) {
    if (
      (targetData[20] || n_B_rangedAtk || n_B_rangedMAtk || c.B_AtkRange.value == 2) &&
      c.B_AtkRange.value != 1
    )
      myInnerHtml("aREFLECT2", '<B style="color:blue">(no melee dmg to reflect)</B>', 0);
    else {
      var S = new Array();
      ((n = 1 * bonusValues[71]),
        (S[0] = Math.floor((wBHD * n) / 100)),
        (S[1] = Math.floor((w_HiDam[0] * n) / 100)),
        (S[2] = Math.floor((w_HiDam[6] * n) / 100)),
        wBHD > 0 && (S[0] == 0 && (S[0] = 1), S[1] == 0 && (S[1] = 1), S[2] == 0 && (S[2] = 1)),
        myInnerHtml("aREFLECT2", '<B style="color:blue">' + S[1] + " ~ " + S[2] + "</B>", 0));
    }
    myInnerHtml(
      "aREFLECT2name",
      '<SPAN style="color:blue">Damage reflected (equip/cards)</SPAN>',
      0,
    );
  } else (myInnerHtml("aREFLECT2", "", 0), myInnerHtml("aREFLECT2name", "", 0));
  return (
    BskillHitNum > 1
      ? (myInnerHtml(
          "B_MinAtk",
          w_HiDam[0] * BskillHitNum + " (" + w_HiDam[0] + " x " + BskillHitNum + " hits)",
          0,
        ),
        myInnerHtml(
          "B_AveAtk",
          wBHD * BskillHitNum + " (" + wBHD + " x " + BskillHitNum + " hits)",
          0,
        ),
        myInnerHtml(
          "B_MaxAtk",
          w_HiDam[6] * BskillHitNum + " (" + w_HiDam[6] + " x " + BskillHitNum + " hits)",
          0,
        ))
      : (myInnerHtml("B_MinAtk", w_HiDam[0] + "", 0),
        myInnerHtml("B_AveAtk", wBHD + "", 0),
        myInnerHtml("B_MaxAtk", w_HiDam[6] + "", 0)),
    wBHD
  );
}
function getTargetElementDamageBonus() {
  var e = Math.floor(targetData[3] / 10);
  return e == 0
    ? bonusValues[BONUSID.DMG_NEUTRAL_PHYSICAL_MAGIC_PERCENT]
    : e == 7
      ? bonusValues[BONUSID.DMG_SHADOW_PHYSICAL_MAGIC_PERCENT]
      : 0;
}
function getMagicElementDamageBonus() {
  return n_A_Weapon_element == 3
    ? bonusValues[BONUSID.FIRE_MAGIC_DMG_PERCENT]
    : n_A_Weapon_element == 1
      ? bonusValues[BONUSID.WATER_MAGIC_DMG_PERCENT]
      : n_A_Weapon_element == 2 &&
          n_A_Equip[5] == EQUIPID.FORBIDDEN_GRIMOIRE &&
          n_A_LEFT_REFINE >= 7
        ? 20
        : 0;
}
function canMagnusExorcismusHitTarget(e) {
  return e == SKILLID.MAGNUS_EXORCISMUS
    ? targetData[2] == RACEID.DEMON || targetData[3] >= ELEMENTID.UNDEAD_1
    : e != SKILLID.MAGNUS_EXORCISMUS_UARO ||
        targetData[2] == RACEID.UNDEAD ||
        targetData[2] == RACEID.DEMON ||
        targetData[3] >= ELEMENTID.SHADOW_1;
}
function BattleMagicCalc(e) {
  wBMC_MDEF = targetData[15];
  var _ = 0;
  (targetData[19] == 0 && CardNumSearch(424) && (_ = 1),
    _ != 0 && ((wBMC_MDEF = 0), (n_B_MDEF2 = 0)),
    SKILLID.FIRE_PILLAR == n_A_ActiveSkill
      ? (wBMC2 = Math.floor(e + 50))
      : CardNumSearch(571)
        ? (wBMC2 = Math.floor((e * (wBMC_MDEF + n_B_MDEF2)) / 100))
        : (wBMC2 = Math.floor(e * mdefReduction(wBMC_MDEF) - n_B_MDEF2)),
    wBMC2 < 1 && (wBMC2 = 1),
    (SKILLID.MAGNUS_EXORCISMUS == n_A_ActiveSkill ||
      SKILLID.MAGNUS_EXORCISMUS_UARO == n_A_ActiveSkill) &&
      !canMagnusExorcismusHitTarget(n_A_ActiveSkill) &&
      (wBMC2 = 0),
    (wBMC2 = Math.floor(wBMC2 * Math.max(0, element[targetData[3]][n_A_Weapon_element]))),
    targetData[3] > 89 &&
      targetData[3] < 95 &&
      SKILLID.SOUL_STRIKE == n_A_ActiveSkill &&
      // uaRO: Soul Strike: +7% di danno per livello contro i non morti, non +5% (Class Changes,
      // Mage; patch del 24/11/2025)
      (wBMC2 = Math.floor(wBMC2 * (1 + 0.07 * n_A_ActiveSkillLV))));
  var n = bonusValues[170 + targetData[2]];
  (targetData[2] == 9 &&
    SkillSearch(SKILLID.DRAGONOLOGY) &&
    (n += 2 * SkillSearch(SKILLID.DRAGONOLOGY)),
    (wBMC2 = (wBMC2 * (100 + n)) / 100),
    (wBMC2 = (wBMC2 * (100 + getTargetElementDamageBonus())) / 100),
    targetData[19] == 1 &&
      (wBMC2 = (wBMC2 * (100 + bonusValues[BONUSID.MAGIC_BOSS_DMG_PERCENT])) / 100),
    (wBMC2 = tPlusDamCut(wBMC2)));
  var a = baseSkillId(n_A_ActiveSkill);
  return (
    (n = StPlusCalc2(5e3 + a) + StPlusCard(5e3 + a)),
    a == SKILLID.MAGNUS_EXORCISMUS &&
      (n += 4 * SkillSearch(SKILLID.IMPOSITIO_MANUS) * EquipNumSearch(EQUIPID.VALKYRIE_DROP)),
    // uaRO: Old Mitra: Magnus Exorcismus +4% ogni 2 raffinamenti (Item Changes)
    a == SKILLID.MAGNUS_EXORCISMUS &&
      n_A_Equip[2] == OLD_MITRA_UARO &&
      (n += 4 * Math.floor(n_A_HEAD_REFINE / 2)),
    (n += getMagicElementDamageBonus()),
    n_A_Buf9[20] == a && n_A_Buf9[20] != 0 && (n += n_A_Buf9[19]),
    n_A_Buf9[22] == a && n_A_Buf9[22] != 0 && (n += n_A_Buf9[21]),
    (SKILLID.NAPALM_BEAT != n_A_ActiveSkill &&
      SKILLID.SOUL_STRIKE != n_A_ActiveSkill &&
      SKILLID.NAPALM_VULCAN != n_A_ActiveSkill) ||
      (n_A_JobClass() == 5 && (n += 20 * CardNumSearch(474))),
    (SKILLID.EARTH_SPIKE != n_A_ActiveSkill && SKILLID.HEAVENS_DRIVE != n_A_ActiveSkill) ||
      (EquipNumSearch(EQUIPID.RJC_KATUSA_FLOWER) && (n += 15 + n_A_HEAD_REFINE)),
    SKILLID.STORM_GUST == n_A_ActiveSkill &&
      EquipNumSearch(EQUIPID.LACRYMA_STICK) &&
      (n += n_A_Weapon_refine),
    SKILLID.FIRE_BOLT_HINDSIGHT == n_A_ActiveSkill && (n += 25 * CardNumSearch(493)),
    SKILLID.COLD_BOLT_HINDSIGHT == n_A_ActiveSkill && (n += 25 * CardNumSearch(488)),
    (SKILLID.HOLY_LIGHT != n_A_ActiveSkill && SKILLID.HOLY_LIGHT_SOUL_LINKED != n_A_ActiveSkill) ||
      (n_A_JobClass() == 3 &&
        EquipNumSearch(EQUIPID.NOAHS_HAT) &&
        ((n += 5), n_A_HEAD_REFINE >= 7 && (n += 5))),
    (wBMC2 = (wBMC2 * (100 + n)) / 100),
    n_A_Buf7[21] && MANUKU_MONSTER() && (wBMC2 = (110 * wBMC2) / 100),
    n_A_Buf7[24] && SUPURE_MONSTER() && (wBMC2 = (110 * wBMC2) / 100),
    SKILLID.STORM_GUST == n_A_ActiveSkill &&
      n_B_debuf[4] &&
      targetData[19] == 0 &&
      targetData[3] < 90 &&
      (wBMC2 = 0),
    (wBMC2 = Math.floor(wBMC2)),
    wBMC2
  );
}
function ClickJob(e) {
  if (
    (myInnerHtml("A_KakutyouSel", "", 0),
    myInnerHtml("A_KakutyouData", "", 0),
    (c.A_Kakutyou.value = 0),
    n_A_JobSet(),
    (e = n_A_JOB) < 46)
  )
    for (var _ = 1; _ <= 99; _++)
      ((c.A_BaseLV.options[_ - 1] = new documento.Opzione(_, _)),
        (c.A_STR.options[_ - 1] = new documento.Opzione(_, _)),
        (c.A_AGI.options[_ - 1] = new documento.Opzione(_, _)),
        (c.A_VIT.options[_ - 1] = new documento.Opzione(_, _)),
        (c.A_INT.options[_ - 1] = new documento.Opzione(_, _)),
        (c.A_DEX.options[_ - 1] = new documento.Opzione(_, _)),
        (c.A_LUK.options[_ - 1] = new documento.Opzione(_, _)));
  else {
    for (thirdClass = 1, _ = 1; _ <= 175; _++)
      c.A_BaseLV.options[_ - 1] = new documento.Opzione(_, _);
    for (_ = 1; _ <= 130; _++)
      ((c.A_STR.options[_ - 1] = new documento.Opzione(_, _)),
        (c.A_AGI.options[_ - 1] = new documento.Opzione(_, _)),
        (c.A_VIT.options[_ - 1] = new documento.Opzione(_, _)),
        (c.A_INT.options[_ - 1] = new documento.Opzione(_, _)),
        (c.A_DEX.options[_ - 1] = new documento.Opzione(_, _)),
        (c.A_LUK.options[_ - 1] = new documento.Opzione(_, _)));
  }
  var n = c.A_JobLV.length;
  for (_ = 0; _ < n; _++) c.A_JobLV.options[0] = null;
  var a = 0;
  for (
    a = e == 0 ? 10 : e <= 19 || (41 <= e && e <= 43) ? 50 : e == 20 ? 99 : e > 45 ? 60 : 70, _ = 1;
    _ <= a;
    _++
  )
    c.A_JobLV.options[_ - 1] = new documento.Opzione(_, _);
  for (
    n_SkillSW &&
      (n_A_JOB == 45
        ? (myInnerHtml("AS12_1", "<S># of Spirit Spheres</S>", 0),
          (c.A2_Skill12.disabled = !0),
          (c.A2_Skill12.value = 0),
          (n_A_Buf2[12] = 0))
        : (myInnerHtml("AS12_1", "# of Spirit Spheres", 0), (c.A2_Skill12.disabled = !1)),
      n_A_JOB == 13 || n_A_JOB == 27
        ? (myInnerHtml("AS11_1", "<S>" + skillName(164) + "</S>", 0),
          (documento.getElementById("AS11_1").style.textDecoration = "line-through"),
          (c.A2_Skill11.disabled = !0),
          (c.A2_Skill11.value = 0),
          (n_A_Buf2[11] = 0))
        : (myInnerHtml("AS11_1", skillName(164), 0),
          (documento.getElementById("AS11_1").style.textDecoration = ""),
          (c.A2_Skill11.disabled = !1))),
      n_Skill7SW && SetSpeedPotionOptions(),
      n_A_JOB != 20 && (SuperNoviceFullWeaponCHECK = 0),
      SuperNoviceFullWeaponCHECK ? (m_JobASPD[20][7] = 1.6) : (m_JobASPD[20][7] = 0),
      n_A_JobClass2() == 8 && n_Nitou == 1 && ((n_Nitou = 0), ClickWeaponType2(0)),
      WeaponSet(e),
      _ = 0;
    _ <= 20;
    _++
  )
    switch (m_JobBuff[e][_]) {
      case 385:
        (myInnerHtml("P_Skill" + _, m_Skill[m_JobBuff[e][_]][2], 0),
          myInnerHtml(
            "P_Skill" + _ + "s",
            "<select name=A_skill" +
              _ +
              " id=A_skill" +
              _ +
              ' onChange="StAllCalc() | WeaponSet(20) | restrictCardslot(1)"></select>',
            0,
          ));
        break;
      case 392:
        (myInnerHtml("P_Skill" + _, skillName(m_Skill[m_JobBuff[e][_]][0]), 0),
          myInnerHtml(
            "P_Skill" + _ + "s",
            "<select name=A_skill" +
              _ +
              " id=A_skill" +
              _ +
              ' onChange="StAllCalc()" style="width:70px;"></select>',
            0,
          ),
          n_Reborn == 0 && myInnerHtml("P_Skill" + _, "", 0));
        break;
      case 441:
        (myInnerHtml("P_Skill" + _, m_Skill[m_JobBuff[e][_]][2], 0),
          myInnerHtml(
            "P_Skill" + _ + "s",
            "<select name=A_skill" +
              _ +
              " id=A_skill" +
              _ +
              ' onChange="StAllCalc() | ClickActiveSkill2() | calc()"></select>',
            0,
          ),
          n_Reborn == 0 && myInnerHtml("P_Skill" + _, "", 0));
        break;
      case SKILLID.IMPOSITIO_MANUS:
        (myInnerHtml("P_Skill" + _, skillName(SKILLID.IMPOSITIO_MANUS) + " (passive)", 0),
          myInnerHtml(
            "P_Skill" + _ + "s",
            "<select name=A_skill" + _ + " id=A_skill" + _ + " onChange=StAllCalc()></select>",
            0,
          ));
        break;
      default:
        m_JobBuff[e][_] != 999
          ? (myInnerHtml("P_Skill" + _, skillName(m_Skill[m_JobBuff[e][_]][0]), 0),
            myInnerHtml(
              "P_Skill" + _ + "s",
              "<select name=A_skill" + _ + " id=A_skill" + _ + " onChange=StAllCalc()></select>",
              0,
            ))
          : (myInnerHtml("P_Skill" + _, "", 0), myInnerHtml("P_Skill" + _ + "s", "", 0));
    }
  for (var o = 0; o <= 20; o++)
    if (
      ((a = m_JobBuff[e][o]),
      NumSearch(
        a,
        [
          12, 68, 152, 253, 258, 301, 309, 310, 322, 345, 364, 365, 379, 383, 385, 386, 390, 420,
          421, 422,
        ],
      ))
    )
      (((t = documento.getElementById("A_skill" + o)).options[0] = new documento.Opzione("off", 0)),
        (t.options[1] = new documento.Opzione("on", 1)));
    else if (a != 999) {
      var t = documento.getElementById("A_skill" + o);
      for (_ = 10; _ >= 0; _--) t.options[_] = null;
      for (_ = 0; _ <= m_Skill[m_JobBuff[e][o]][1]; _++) t.options[_] = new documento.Opzione(_, _);
      if (m_Skill[m_JobBuff[e][o]][0] == 392) {
        for (n_ECname = ["off", "eAthena (max stats)", "iRO", "Original"], _ = 0; _ <= 3; _++)
          t.options[_] = new documento.Opzione(n_ECname[_], _);
        n_Reborn == 0 && (t.style.visibility = "hidden");
      }
    }
  if (m_JobBuff[e][2] == 58) {
    for (_ = 10; _ >= 0; _--) c.A_skill2.options[_] = null;
    for (
      n_ECname = [
        "0",
        "6% Reduction",
        "12% Reduction",
        "18% Reduction",
        "24% Reduction",
        "30% Reduction",
      ],
        _ = 0;
      _ <= 5;
      _++
    )
      c.A_skill2.options[_] = new documento.Opzione(n_ECname[_], _);
  }
  if (m_JobBuff[e][7] == 78) {
    for (_ = 10; _ >= 0; _--) c.A_skill7.options[_] = null;
    for (n_ECname = ["(no Peco)", "0", "1", "2", "3", "4", "5"], _ = 0; _ <= 6; _++)
      c.A_skill7.options[_] = new documento.Opzione(n_ECname[_], _);
  }
  if (m_JobBuff[e][10] == 78) {
    for (_ = 10; _ >= 0; _--) c.A_skill10.options[_] = null;
    for (n_ECname = ["(no Peco)", "0", "1", "2", "3", "4", "5"], _ = 0; _ <= 6; _++)
      c.A_skill10.options[_] = new documento.Opzione(n_ECname[_], _);
  }
  if (m_JobBuff[e][15] == 367) {
    for (_ = 10; _ >= 0; _--) c.A_skill15.options[_] = null;
    for (n_ECname = [0, 1, 2, 3, 4, 5, 6, 8, 10], _ = 0; _ <= 8; _++)
      c.A_skill15.options[_] = new documento.Opzione(10 * n_ECname[_] + "%", n_ECname[_]);
  }
  (Askill(), WeaponSet2());
}
function Askill() {
  for (var e = c.A_ActiveSkill.length, _ = 0; _ < e; _++) c.A_ActiveSkill.options[0] = null;
  if (c.all_dmgSkills.checked)
    for (_ = 0; _ < All_DMGskill.length; _++)
      c.A_ActiveSkill.options[_] = new documento.Opzione(
        skillNameInSelect(m_Skill[All_DMGskill[_]][0]),
        All_DMGskill[_],
      );
  else
    for (_ = 0; m_JobAtkSkill[n_A_JOB][_] != 999; _++)
      c.A_ActiveSkill.options[_] = new documento.Opzione(
        skillNameInSelect(m_Skill[m_JobAtkSkill[n_A_JOB][_]][0]),
        m_JobAtkSkill[n_A_JOB][_],
      );
  for (_ = 0; _ < 20; _++) w_ASSP0bk[_] = 999;
  (ActiveSkillSetPlus(), ClickActiveSkill());
}
function Bskill(e) {
  var _ = 0;
  for (
    c.B_AtkSkill.options.length = 0,
      c.B_AtkSkill.options[0] = new documento.Opzione("Basic Attack", 0),
      i = 23;
    m_Monster[c.B_Enemy.value][i] != 0;
    i += 2
  )
    (_++,
      (c.B_AtkSkill.options[_] = new documento.Opzione(
        m_Skill[m_Monster[c.B_Enemy.value][i]][2] + " Lvl " + m_Monster[c.B_Enemy.value][i + 1],
        m_Monster[c.B_Enemy.value][i],
      )));
  (myInnerHtml("BBSkill", "", 0), n_A_Equip[7] == 957 && !e && calc());
}
var monsterCalculationTimer = 0,
  MONSTER_CALCULATION_DEBOUNCE_MS = 120;
function scheduleMonsterCalculation() {
  (monsterCalculationTimer && window.clearTimeout(monsterCalculationTimer),
    (monsterCalculationTimer = window.setTimeout(function () {
      ((monsterCalculationTimer = 0), calc());
    }, MONSTER_CALCULATION_DEBOUNCE_MS)));
}
function UpdateSpiralPierceWeaponWeight() {
  var e = 1 * c.A_ActiveSkill.value,
    _ = c.SkillSubNum;
  if (e == SKILLID.CLASHING_SPIRAL && _) {
    var n = n_A_Equip[0];
    _.value = m_Item[n][6];
  }
}
function ClickWeaponType(e) {
  (n_A_JobSet(), (e = m_Item[c.A_weapon1.value][1]));
  var _ = 0 <= c.A_Arrow.selectedIndex ? c.A_Arrow.options[c.A_Arrow.selectedIndex].text : "";
  c.A_Arrow.disabled = !1;
  for (var n = 0; n < 23; n++) c.A_Arrow.options[0] = null;
  if (e == 10 || e == 14 || e == 15) for (j = 23, n = 0; n <= 4; n++) m_Arrow[n] = m_Arrow_[n];
  else if (e == 17 || e == 18 || e == 19 || e == 20)
    for (j = 2, n = 0; n <= 2; n++) m_Arrow[n] = m_Bullet[n];
  else if (e == 21) for (j = 4, n = 0; n <= 4; n++) m_Arrow[n] = m_Grenade[n];
  else
    ((j = 1),
      (m_Arrow[0] = [0, 0, "(no arrow)"]),
      (c.A_Arrow.value = 0),
      (c.A_Arrow.disabled = !0));
  for (n = 0; n <= j; n++) c.A_Arrow.options[n] = new documento.Opzione(m_Arrow[n][2], n);
  for (n = 0; n < c.A_Arrow.options.length; n++)
    if (c.A_Arrow.options[n].text == _) {
      c.A_Arrow.selectedIndex = n;
      break;
    }
  if (
    (e == 0
      ? ((c.A_Weapon_refine.disabled = !0), (c.A_Weapon_refine.value = 0))
      : (c.A_Weapon_refine.disabled = !1),
    n_A_JobSet(),
    (n_A_JOB != 8 && n_A_JOB != 22) || e == 11)
  )
    (myInnerHtml("A_SobWeaponName", "", 0),
      myInnerHtml("A_w2", "", 0),
      myInnerHtml("A_weapon2refine", "", 0),
      myInnerHtml("A_weapon2_cardshort", "", 0),
      myInnerHtml("nA_weapon2_c1", "", 0),
      myInnerHtml("nA_weapon2_c2", "", 0),
      myInnerHtml("nA_weapon2_c3", "", 0),
      myInnerHtml("nA_weapon2_c4", "", 0),
      (n_Nitou = 0),
      (c.A_weapon1.style.width = "auto"),
      (c.A_cardshort.style.width = "auto"),
      (c.A_weapon1_card1.style.width = "auto"),
      (c.A_weapon1_card2.style.width = "auto"),
      (c.A_weapon1_card3.style.width = "auto"),
      (c.A_weapon1_card4.style.width = "auto"),
      (c.A_head1.style.width = "200px"),
      (c.A_head2.style.width = "200px"),
      (c.A_head3.style.width = "200px"),
      (c.A_left.style.width = "200px"),
      (c.A_body.style.width = "200px"),
      (c.A_shoulder.style.width = "200px"),
      (c.A_shoes.style.width = "200px"),
      (c.A_acces1.style.width = "200px"),
      (c.A_acces2.style.width = "200px"),
      (c.A_head1_card.style.width = "auto"),
      (c.A_head2_card.style.width = "auto"),
      (c.A_left_card.style.width = "auto"),
      (c.A_body_card.style.width = "auto"),
      (c.A_shoulder_card.style.width = "auto"),
      (c.A_shoes_card.style.width = "auto"),
      (c.A_acces1_card.style.width = "auto"),
      (c.A_acces2_card.style.width = "auto"));
  else if (n_Nitou == 0) {
    (myInnerHtml("A_SobWeaponName", "Left Hand: ", 0),
      myInnerHtml(
        "A_w2",
        '<select name="A_weapon2" style="width:185px;" onchange="ClickWeaponType2(this[this.selectedIndex].value) | Click_Item(this[this.selectedIndex].value)|restrictCardslot(1)"><option value="0">(Fist or Shield)</option></select>',
        0,
      ),
      WeaponSetLeft(n_A_JOB));
    var a = Math.max(
      documento.documentElement.clientWidth,
      documento.body.scrollWidth,
      documento.documentElement.scrollWidth,
      documento.body.offsetWidth,
      documento.documentElement.offsetWidth,
    );
    (1262 <= a && a < 1480) || a < 1013
      ? ((c.A_weapon1.style.width = "95%"),
        (c.A_cardshort.style.width = "95%"),
        (c.A_weapon1_card1.style.width = "95%"),
        (c.A_weapon1_card2.style.width = "95%"),
        (c.A_weapon1_card3.style.width = "95%"),
        (c.A_weapon1_card4.style.width = "95%"),
        (c.A_head1.style.width = "47%"),
        (c.A_head2.style.width = "53%"),
        (c.A_head3.style.width = "53%"),
        (c.A_left.style.width = "47%"),
        (c.A_body.style.width = "47%"),
        (c.A_shoulder.style.width = "47%"),
        (c.A_shoes.style.width = "47%"),
        (c.A_acces1.style.width = "53%"),
        (c.A_acces2.style.width = "53%"),
        (c.A_HSE_HEAD1.style.width = "43%"),
        (c.A_left_card.style.width = "37%"),
        (c.A_body_card.style.width = "37%"),
        (c.A_shoes_card.style.width = "37%"),
        (c.A_acces1_card.style.width = "43%"),
        (c.A_acces2_card.style.width = "43%"))
      : ((c.A_weapon1.style.width = "auto"),
        (c.A_cardshort.style.width = "auto"),
        (c.A_weapon1_card1.style.width = "auto"),
        (c.A_weapon1_card2.style.width = "auto"),
        (c.A_weapon1_card3.style.width = "auto"),
        (c.A_weapon1_card4.style.width = "auto"),
        (c.A_head1.style.width = "200px"),
        (c.A_head2.style.width = "200px"),
        (c.A_head3.style.width = "200px"),
        (c.A_left.style.width = "200px"),
        (c.A_body.style.width = "200px"),
        (c.A_shoulder.style.width = "200px"),
        (c.A_shoes.style.width = "200px"),
        (c.A_acces1.style.width = "200px"),
        (c.A_acces2.style.width = "200px"),
        (c.A_left_card.style.width = "auto"),
        (c.A_body_card.style.width = "auto"),
        (c.A_shoes_card.style.width = "auto"),
        (c.A_acces1_card.style.width = "auto"),
        (c.A_acces2_card.style.width = "auto"));
  }
  ((n_A_Equip[0] = 1 * c.A_weapon1.value),
    UpdateSpiralPierceWeaponWeight(),
    ActiveSkillSetPlus(),
    ClickB_Item(n_A_Equip[0]));
}
function ClickWeaponType2(e) {
  if ((n_A_JobSet(), e != 0)) {
    if (n_Nitou == 0) {
      for (
        myInnerHtml(
          "A_weapon2refine",
          'Refine (Left): <select name="A_Weapon2_refine" onChange = "StAllCalc()"></select>',
          0,
        ),
          i = 0;
        i <= 10;
        i++
      )
        c.A_Weapon2_refine.options[i] = new documento.Opzione("+" + i, i);
      for (
        myInnerHtml(
          "A_weapon2_cardshort",
          '<select name="A_cardshortLeft" onChange="Setm_CardShortLeft()|Click_Card()|ActiveSkillSetPlus()"></select>',
          0,
        ),
          c.A_cardshortLeft.options[0] = new documento.Opzione("(card shortcuts)", 0),
          i = 1;
        i <= 50;
        i++
      )
        c.A_cardshortLeft.options[i] = new documento.Opzione(m_CardShort[i + 1][0], i + 1);
      for (
        myInnerHtml(
          "nA_weapon2_c1",
          '<select name="A_weapon2_card1" onChange="Click_Card(this[this.selectedIndex].value)"></select>',
          0,
        ),
          myInnerHtml(
            "nA_weapon2_c2",
            '<select name="A_weapon2_card2" onChange="Click_Card(this[this.selectedIndex].value)"></select>',
            0,
          ),
          myInnerHtml(
            "nA_weapon2_c3",
            '<select name="A_weapon2_card3" onChange="Click_Card(this[this.selectedIndex].value)"></select>',
            0,
          ),
          myInnerHtml(
            "nA_weapon2_c4",
            '<select name="A_weapon2_card4" onChange="Click_Card(this[this.selectedIndex].value)"></select>',
            0,
          ),
          i = 0;
        m_CardSort[0][i] != "NULL";
        i++
      )
        c.A_weapon2_card1.options[i] = new documento.Opzione(
          m_Card[m_CardSort[0][i]][2],
          m_Card[m_CardSort[0][i]][0],
        );
      for (i = 0; m_CardSort[1][i] != "NULL"; i++)
        ((c.A_weapon2_card2.options[i] = new documento.Opzione(
          m_Card[m_CardSort[1][i]][2],
          m_Card[m_CardSort[1][i]][0],
        )),
          (c.A_weapon2_card3.options[i] = new documento.Opzione(
            m_Card[m_CardSort[1][i]][2],
            m_Card[m_CardSort[1][i]][0],
          )),
          (c.A_weapon2_card4.options[i] = new documento.Opzione(
            m_Card[m_CardSort[1][i]][2],
            m_Card[m_CardSort[1][i]][0],
          )));
      c.A_weapon2_card4.options[1] = new documento.Opzione("* Top10 ranked", 106);
      var _ = Math.max(
        documento.documentElement.clientWidth,
        documento.body.scrollWidth,
        documento.documentElement.scrollWidth,
        documento.body.offsetWidth,
        documento.documentElement.offsetWidth,
      );
      (1262 <= _ && _ < 1480) || _ < 1013
        ? ((c.A_weapon2.style.width = "95%"),
          (c.A_cardshortLeft.style.width = "95%"),
          (c.A_weapon2_card1.style.width = "95%"),
          (c.A_weapon2_card2.style.width = "95%"),
          (c.A_weapon2_card3.style.width = "95%"),
          (c.A_weapon2_card4.style.width = "95%"))
        : ((c.A_weapon2.style.width = "auto"),
          (c.A_cardshortLeft.style.width = "auto"),
          (c.A_weapon2_card1.style.width = "auto"),
          (c.A_weapon2_card2.style.width = "auto"),
          (c.A_weapon2_card3.style.width = "auto"),
          (c.A_weapon2_card4.style.width = "auto"));
    }
    n_Nitou = 1;
  } else
    ((c.A_weapon2.value = 0),
      myInnerHtml("A_weapon2refine", "", 0),
      myInnerHtml("A_weapon2_cardshort", "", 0),
      myInnerHtml("nA_weapon2_c1", "", 0),
      myInnerHtml("nA_weapon2_c2", "", 0),
      myInnerHtml("nA_weapon2_c3", "", 0),
      myInnerHtml("nA_weapon2_c4", "", 0),
      (n_Nitou = 0));
  n_Nitou &&
    ((n_A_Equip[1] = 1 * c.A_weapon2.value), ActiveSkillSetPlus(), ClickB_Item(n_A_Equip[1]));
}
function ClickActiveSkill() {
  ((n_A_ActiveSkill = 1 * c.A_ActiveSkill.value),
    n_A_ActiveSkill >= 3e3
      ? ((n_A_ActiveSkillLV = m_EnableSkill[n_A_ActiveSkill - 3e3][3]),
        (n_A_ActiveSkill = m_EnableSkill[n_A_ActiveSkill - 3e3][2]))
      : n_A_ActiveSkill >= 2e3
        ? ((n_A_ActiveSkillLV = m_AutoSpellSkill[n_A_ActiveSkill - 2e3][3]),
          (n_A_ActiveSkill = m_AutoSpellSkill[n_A_ActiveSkill - 2e3][2]))
        : n_A_ActiveSkill >= 1500
          ? ((n_A_ActiveSkillLV = m_EnableSkill[n_A_ActiveSkill - 1500][3]),
            (n_A_ActiveSkill = m_EnableSkill[n_A_ActiveSkill - 1500][2]))
          : ((n_A_ActiveSkillLV = m_Skill[n_A_ActiveSkill][1]),
            n_A_JobClass2() != 14 ||
              (SKILLID.WATER_BALL != n_A_ActiveSkill && SKILLID.HEAVENS_DRIVE != n_A_ActiveSkill) ||
              (n_A_ActiveSkillLV = 10)));
  var e = c.A_ActiveSkillLV.length;
  for (i = 0; i < e; i++) c.A_ActiveSkillLV.options[0] = null;
  if (n_A_ActiveSkill >= SKILLID.BASIC_ATTACK)
    for (i = 1; i <= n_A_ActiveSkillLV; i++)
      c.A_ActiveSkillLV.options[i - 1] = new documento.Opzione("Lvl " + i, i);
  (m_Skill[n_A_ActiveSkill][1] == 1
    ? (c.A_ActiveSkillLV.style.visibility = "hidden")
    : ((c.A_ActiveSkillLV.style.visibility = "visible"),
      (c.A_ActiveSkillLV.value = n_A_ActiveSkillLV)),
    ClickActiveSkill2());
}
function BClickAtkSkill() {
  if ((n_B_AtkSkill = 1 * c.B_AtkSkill.value) == 444 || n_B_AtkSkill == 445)
    for (
      myInnerHtml(
        "BBSkill",
        'Players in Range: <select name="BSkillSubNum" onChange="calc()"></select>',
        0,
      ),
        i = 1;
      i <= 99;
      i++
    )
      c.BSkillSubNum.options[i - 1] = new documento.Opzione(i, i);
  else if (n_B_AtkSkill == 489)
    myInnerHtml(
      "BBSkill",
      'Enemy Remaining HP: <input type="text" inputmode="numeric" name="BSkillSubNum" onkeypress="return isNumeric(event)" onkeyup="calc()" value="' +
        targetData[6] +
        '" size="7" class="center">',
      0,
    );
  else if (n_B_AtkSkill == 125) {
    myInnerHtml(
      "BBSkill",
      'Meteors landing on Player: <select name="BSkillSubNum" onChange="calc()"></select>',
      0,
    );
    var e;
    e = m_Monster[targetData[0]][2 * c.B_AtkSkill.selectedIndex + 22];
    var _ = 2 + Math.floor(e / 2);
    for (i = 1; i <= _; i++) c.BSkillSubNum.options[i - 1] = new documento.Opzione(i, i);
    c.BSkillSubNum.value = 2;
  } else if (n_B_AtkSkill == 131) {
    for (
      myInnerHtml("BBSkill", 'Hits: <select name="BSkillSubNum" onChange="calc()"></select>', 0),
        i = 1;
      i <= 15;
      i++
    )
      c.BSkillSubNum.options[i - 1] = new documento.Opzione(i, i);
    c.BSkillSubNum.value = 3;
  } else if (PvP)
    if (n_B_AtkSkill == 66 || n_B_AtkSkill == 326)
      myInnerHtml(
        "BBSkill",
        'Cart weight: <input type="text" inputmode="numeric" maxlength="4" name="BSkillSubNum" value="8000" size=3 onkeypress="return isNumeric(event)" onkeyup="calc()">',
        0,
      );
    else if (n_B_AtkSkill == 88) {
      for (
        myInnerHtml(
          "BBSkill",
          'Poison React Lvl: <select name="BSkillSubNum" onChange="calc()"></select>',
          0,
        ),
          i = 0;
        i <= 10;
        i++
      )
        c.BSkillSubNum.options[i] = new documento.Opzione(i, i);
      ((c.BSkillSubNum.value = 0), n_A_JobClass2() == 14 && (c.BSkillSubNum.value = 0));
    } else if (n_B_AtkSkill == 197)
      (myInnerHtml(
        "BBSkill",
        'Remaining SP: <input type="text" inputmode="numeric" maxlength="5" name="BSkillSubNum" value="0" size=3 onkeyup="calc()">',
        0,
      ),
        (c.BSkillSubNum.value = 0));
    else if (n_B_AtkSkill == 394) {
      for (
        myInnerHtml("BBSkill", '<select name="BSkillSubNum" onChange="calc()"></select>', 0), i = 0;
        i <= 4;
        i++
      )
        c.BSkillSubNum.options[i] = new documento.Opzione(m_Syuriken[i][2], i);
      c.BSkillSubNum.value = 0;
    } else if (n_B_AtkSkill == 395) {
      for (
        myInnerHtml("BBSkill", '<select name="BSkillSubNum" onChange="calc()"></select>', 0), i = 0;
        i <= 4;
        i++
      )
        c.BSkillSubNum.options[i] = new documento.Opzione(m_Kunai[i][2], i);
      c.BSkillSubNum.value = 0;
    } else if (n_B_AtkSkill == 405)
      myInnerHtml(
        "BBSkill",
        'Remaining HP: <input type="text" inputmode="numeric" maxlength="5" name="BSkillSubNum" value="0" size=4 onkeypress="return isNumeric(event)" onkeyup="calc()">',
        0,
      );
    else if (n_B_AtkSkill == 429) {
      var n = ["1", "1.2", "1.6", "2", "2.4", "3", "3.6", "4", "5", "6", "7", "8", "9", "10"];
      for (
        myInnerHtml(
          "BBSkill",
          'Hits (considering the success chance): <select name="BSkillSubNum" onChange="calc()"></select>',
          0,
        ),
          i = 0;
        i <= 13;
        i++
      )
        c.BSkillSubNum.options[i] = new documento.Opzione(n[i] + " hits", i);
      c.BSkillSubNum.value = 6;
    } else if (n_B_AtkSkill == 308) {
      myInnerHtml(
        "BBSkill",
        'Enemy distance: <select name="BSkillSubNum" onChange="calc()"></select>',
        0,
      );
      var a = ["0~3 Cells", "4~6 Cells", "7~9 Cells", "10~12 Cells", "13+ Cells"];
      for (i = 0; i <= 4; i++) c.BSkillSubNum.options[i] = new documento.Opzione(a[i], i);
      c.BSkillSubNum.value = 4;
    } else
      myInnerHtml(
        "BBSkill",
        n_B_AtkSkill == 159 || n_B_AtkSkill == 384 || n_B_AtkSkill == 324
          ? 'Shield weight: <input type="text" inputmode="numeric" maxlength="5" name="BSkillSubNum" value="0" size=2 onkeypress="return isNumeric(event)" onkeyup="calc()"><BR>Enemy STR: <input type="text" inputmode="numeric" maxlength="3" name="BSkillSubNum2" value="0" size=1 onkeypress="return isNumeric(event)" onkeyup="calc()">'
          : n_B_AtkSkill == 259
            ? 'Weapon weight: <input type="text" inputmode="numeric" maxlength="5" name="BSkillSubNum" value="0" size=2 onkeypress="return isNumeric(event)" onkeyup="calc()"><BR>Enemy STR: <input type="text" inputmode="numeric" maxlength="3" name="BSkillSubNum2" value="0" size=1 onkeypress="return isNumeric(event)" onkeyup="calc()">'
            : "",
        0,
      );
  else myInnerHtml("BBSkill", "", 0);
  (calc(), n_A_Equip[7] == 957 && calc());
}
function ClickActiveSkill2() {
  if (SKILLID.CART_REVOLUTION == n_A_ActiveSkill || SKILLID.HIGH_SPEED_CART_RAM == n_A_ActiveSkill)
    myInnerHtml(
      "AASkill",
      'Cart weight: <input type="text" inputmode="numeric" maxlength="4" name="SkillSubNum" value="8000" size=3 onkeypress="return isNumeric(event)" onkeyup="calc()">',
      0,
    );
  else if (SKILLID.STORM_GUST == n_A_ActiveSkill) {
    for (
      myInnerHtml("AASkill", 'Hits: <select name="SkillSubNum" onChange="calc()"></select>', 0),
        i = 1;
      i <= 15;
      i++
    )
      c.SkillSubNum.options[i - 1] = new documento.Opzione(i, i);
    c.SkillSubNum.value = 3;
  } else if (SKILLID.VENOM_SPLASHER == n_A_ActiveSkill) {
    for (
      myInnerHtml(
        "AASkill",
        'Poison React Lvl: <select name="SkillSubNum" onChange="calc()"></select>',
        0,
      ),
        i = 0;
      i <= 10;
      i++
    )
      c.SkillSubNum.options[i] = new documento.Opzione(i, i);
    ((c.SkillSubNum.value = 0), n_A_JobClass2() == 14 && (c.SkillSubNum.value = 0));
  } else if (SKILLID.GUILLOTINE_FIST == n_A_ActiveSkill)
    (myInnerHtml(
      "AASkill",
      'Remaining SP: <input type="text" inputmode="numeric" maxlength="5" name="SkillSubNum" size=3 onkeypress="return isNumeric(event)" onkeyup="calc()">',
      0,
    ),
      (c.SkillSubNum.value = n_A_MaxSP - 1));
  else if (SKILLID.THROW_SHURIKEN == n_A_ActiveSkill) {
    for (
      myInnerHtml("AASkill", '<select name="SkillSubNum" onChange="calc()"></select>', 0), i = 0;
      i <= 4;
      i++
    )
      c.SkillSubNum.options[i] = new documento.Opzione(m_Syuriken[i][2], i);
    c.SkillSubNum.value = 0;
  } else if (SKILLID.THROW_KUNAI == n_A_ActiveSkill) {
    for (
      myInnerHtml("AASkill", '<select name="SkillSubNum" onChange="calc()"></select>', 0), i = 0;
      i <= 4;
      i++
    )
      c.SkillSubNum.options[i] = new documento.Opzione(m_Kunai[i][2], i);
    c.SkillSubNum.value = 0;
  } else if (SKILLID.KILLING_STROKE == n_A_ActiveSkill)
    (myInnerHtml(
      "AASkill",
      'Remaining HP: <input type="text" inputmode="numeric" maxlength="5" name="SkillSubNum" size=4 onkeypress="return isNumeric(event)" onkeyup="calc()">',
      0,
    ),
      (c.SkillSubNum.value = n_A_MaxHP - 1));
  else if (SKILLID.DESPERADO == n_A_ActiveSkill) {
    var e = ["1", "1.2", "1.6", "2", "2.4", "3", "3.6", "4", "5", "6", "7", "8", "9", "10"];
    for (
      myInnerHtml(
        "AASkill",
        'Hits (considering the success chance): <select name="SkillSubNum" onChange="calc()"></select>',
        0,
      ),
        i = 0;
      i <= 13;
      i++
    )
      c.SkillSubNum.options[i] = new documento.Opzione(e[i] + " hits", i);
    c.SkillSubNum.value = 6;
  } else if (
    !SkillSearch(SKILLID.DOUBLE_BOLT) ||
    (SKILLID.FIRE_BOLT != n_A_ActiveSkill &&
      SKILLID.COLD_BOLT != n_A_ActiveSkill &&
      SKILLID.LIGHTNING_BOLT != n_A_ActiveSkill &&
      SKILLID.FIRE_BOLT_HINDSIGHT != n_A_ActiveSkill &&
      SKILLID.COLD_BOLT_HINDSIGHT != n_A_ActiveSkill &&
      SKILLID.LIGHTNING_BOLT_HINDSIGHT != n_A_ActiveSkill)
  )
    if (SKILLID.CHARGE_ATTACK == n_A_ActiveSkill) {
      myInnerHtml(
        "AASkill",
        'Enemy distance: <select name="SkillSubNum" onChange="calc()"></select>',
        0,
      );
      var _ = ["0~3 Cells", "4~6 Cells", "7~9 Cells", "10~12 Cells", "13+ Cells"];
      for (i = 0; i <= 4; i++) c.SkillSubNum.options[i] = new documento.Opzione(_[i], i);
      c.SkillSubNum.value = 4;
    } else
      switch (n_A_ActiveSkill) {
        case 159:
        case 384:
        case 324:
          (myInnerHtml(
            "AASkill",
            'Shield weight: <input type="text" inputmode="numeric" maxlength="4" name="SkillSubNum" size=2 onkeypress="return isNumeric(event)" onkeyup="calc()">',
            0,
          ),
            (c.SkillSubNum.value = m_Item[n_A_Equip[5]][6]));
          break;
        case 259:
          (myInnerHtml(
            "AASkill",
            'Weapon weight: <input type="text" inputmode="numeric" maxlength="4" name="SkillSubNum" size=2 onkeypress="return isNumeric(event)" onkeyup="calc()">',
            0,
          ),
            (c.SkillSubNum.value = m_Item[n_A_Equip[0]][6]));
          break;
        default:
          myInnerHtml("AASkill", "", 0);
      }
  else {
    var n = SkillSearch(SKILLID.DOUBLE_BOLT) + 3;
    (myInnerHtml(
      "AASkill",
      'Double Bolt chance: <select name="SkillSubNum" onChange="calc()"></select>',
      0,
    ),
      (c.SkillSubNum.options[0] = new documento.Opzione("Bad luck (0%)", 0)),
      (c.SkillSubNum.options[1] = new documento.Opzione("Average chance (" + 10 * n + "%)", n)),
      (c.SkillSubNum.options[2] = new documento.Opzione("Good luck (100%)", 10)),
      (c.SkillSubNum.value = n));
  }
}
function BufSW(e) {
  if (((n_SkillSW = e), n_SkillSW)) {
    for (
      _ =
        '<TR><TD id="A2TD" ColSpan="6" class="subheader point" onclick="BufSW(0)" role="button" tabindex="0" aria-expanded="true">Supportive / Party Skills <span id="A2used"></span>',
        _ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>',
        _ += '<TR class="center">',
        _ += '<TD ColSpan="2" class="data"><B><U>Gospel Effects</U></B></TD>',
        _ += '<TD ColSpan="2" class="data"><B><U>Acolyte Class Buffs</U></B></TD>',
        _ += '<TD ColSpan="2"><B><U>Other Party Buffs</U></B></TD>',
        _ += "</TR><TR>",
        _ += '<TD id="EN50"></TD><TD class="data"></TD>',
        _ += '<TD id="AS0_1" class="center">Blessing</TD><TD id="AS0_2" class="data"></TD>',
        _ += '<TD id="AS6_1" class="center">Andrenaline Rush</TD><TD id="AS6_2"></TD>',
        _ += "</TR><TR>",
        _ += '<TD id="EN51"></TD><TD class="data"></TD>',
        _ += '<TD id="AS1_1" class="center">Increase AGI</TD><TD id="AS1_2" class="data"></TD>',
        _ += '<TD id="AS7_1" class="center">Weapon Perfection</TD><TD id="AS7_2"></TD>',
        _ += "</TR><TR>",
        _ += '<TD id="EN52"></TD><TD class="data"></TD>',
        _ += '<TD id="AS4_1" class="center">Angelus</TD><TD id="AS4_2" class="data"></TD>',
        _ += '<TD id="AS8_1" class="center">' + skillName(154) + '</TD><TD id="AS8_2"></TD>',
        _ += "</TR><TR>",
        _ += '<TD id="EN53"></TD><TD class="data"></TD>',
        _ += '<TD id="AS2_1" class="center">Impositio Manus</TD><TD id="AS2_2" class="data"></TD>',
        _ += '<TD id="AS9_1" class="center">Wind Walker</TD><TD id="AS9_2"></TD>',
        _ += "</TR><TR>",
        _ += '<TD id="EN55"></TD><TD class="data"></TD>',
        _ += '<TD id="AS3_1" class="center">Gloria</TD><TD id="AS3_2" class="data"></TD>',
        _ += '<TD id="" class="center">' + skillName(157) + '</TD><TD id="AS13_2"></TD>',
        _ += "</TR><TR>",
        _ += '<TD id="EN54"></TD><TD class="data"></TD>',
        _ += '<TD id="AS10_1" class="center">Suffragium</TD><TD id="AS10_2" class="data"></TD>',
        _ += '<TD id="" class="center">Shield Reflect</TD><TD id="AS14_2"></TD>',
        _ += "</TR><TR>",
        _ += '<TD></TD><TD class="data"></TD>',
        _ += '<TD id="AS5_1" class="center">Assumptio</TD><TD id="AS5_2" class="data"></TD>',
        _ += '<TD id="" class="center">' + skillName(165) + '</TD><TD id="AS15_2"></TD>',
        _ += "</TR><TR>",
        _ += '<TD></TD><TD class="data"></TD>',
        _ +=
          '<TD id="AS12_1" class="center"># of Spirit Spheres</TD><TD id="AS12_2" class="data"></TD>',
        _ += '<TD id="AS11_1" class="center">' + skillName(164) + '</TD><TD id="AS11_2"></TD>',
        myInnerHtml("SIENSKILL", (_ += "</TR>"), 0),
        myInnerHtml("AS0_2", '<select name="A2_Skill0" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS1_2", '<select name="A2_Skill1" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS2_2", '<select name="A2_Skill2" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS3_2", '<input type="checkbox" name="A2_Skill3" onClick="A2(1)">', 0),
        myInnerHtml("AS4_2", '<select name="A2_Skill4" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS5_2", '<input type="checkbox" name="A2_Skill5" onClick="A2(1)">', 0),
        myInnerHtml(
          "AS6_2",
          '<select name="A2_Skill6" onChange="A2(1)" style="width:50px;"></select>',
          0,
        ),
        myInnerHtml("AS7_2", '<input type="checkbox" name="A2_Skill7" onClick="A2(1)">', 0),
        myInnerHtml("AS8_2", '<input type="checkbox" name="A2_Skill8" onClick="A2(1)">', 0),
        myInnerHtml("AS9_2", '<select name="A2_Skill9" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS10_2", '<select name="A2_Skill10" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS11_2", '<select name="A2_Skill11" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS12_2", '<select name="A2_Skill12" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS13_2", '<select name="A2_Skill13" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS14_2", '<select name="A2_Skill14" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS15_2", '<select name="A2_Skill15" onChange="A2(1)"></select>', 0),
        myInnerHtml(
          "EN50",
          '<input type="checkbox" name="A5_Skill0" onClick="A2(1)">All Stats +20',
          0,
        ),
        myInnerHtml("EN51", '<input type="checkbox" name="A5_Skill1" onClick="A2(1)">HP +100%', 0),
        myInnerHtml("EN52", '<input type="checkbox" name="A5_Skill2" onClick="A2(1)">SP +100%', 0),
        myInnerHtml("EN53", '<input type="checkbox" name="A5_Skill3" onClick="A2(1)">ATK +100%', 0),
        myInnerHtml(
          "EN54",
          '<input type="checkbox" name="A5_Skill4" onClick="A2(1)">HIT & FLEE +50',
          0,
        ),
        myInnerHtml("EN55", '<input type="checkbox" name="A5_Skill5" onClick="A2(1)">DEF +25%', 0),
        i = 0;
      i <= 10;
      i++
    )
      ((c.A2_Skill0.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill1.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill4.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill9.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill13.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill14.options[i] = new documento.Opzione(i, i)));
    for (i = 0; i <= 5; i++)
      ((c.A2_Skill2.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill11.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill12.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill15.options[i] = new documento.Opzione(i, i)));
    for (
      n_A_JOB == 45
        ? (myInnerHtml("AS12_1", "<S># of Spirit Spheres</S>", 0),
          (c.A2_Skill12.disabled = !0),
          (c.A2_Skill12.value = 0),
          (n_A_Buf2[12] = 0))
        : (myInnerHtml("AS12_1", "# of Spirit Spheres", 0), (c.A2_Skill12.disabled = !1)),
        n_A_JOB == 13 || n_A_JOB == 27
          ? (myInnerHtml("AS11_1", "<S>" + skillName(164) + "</S>", 0),
            (documento.getElementById("AS11_1").style.textDecoration = "line-through"),
            (c.A2_Skill11.disabled = !0),
            (c.A2_Skill11.value = 0),
            (n_A_Buf2[11] = 0))
          : (myInnerHtml("AS11_1", skillName(164), 0),
            (documento.getElementById("AS11_1").style.textDecoration = ""),
            (c.A2_Skill11.disabled = !1)),
        i = 0;
      i <= 3;
      i++
    )
      c.A2_Skill10.options[i] = new documento.Opzione(i, i);
    ((c.A2_Skill6.options[0] = new documento.Opzione("OFF", 0)),
      (c.A2_Skill6.options[1] = new documento.Opzione("Regular AR", 1)),
      (c.A2_Skill6.options[2] = new documento.Opzione("Full AR", 2)),
      (c.A2_Skill6.options[3] = new documento.Opzione("AR Scroll", 3)),
      (c.A2_Skill0.value = n_A_Buf2[0]),
      (c.A2_Skill1.value = n_A_Buf2[1]),
      (c.A2_Skill2.value = n_A_Buf2[2]),
      (c.A2_Skill3.checked = n_A_Buf2[3]),
      (c.A2_Skill4.value = n_A_Buf2[4]),
      (c.A2_Skill5.checked = n_A_Buf2[5]),
      (c.A2_Skill6.value = n_A_Buf2[6]),
      (c.A2_Skill7.checked = n_A_Buf2[7]),
      (c.A2_Skill8.checked = n_A_Buf2[8]),
      (c.A2_Skill9.value = n_A_Buf2[9]),
      (c.A2_Skill10.value = n_A_Buf2[10]),
      (c.A2_Skill11.value = n_A_Buf2[11]),
      (c.A2_Skill12.value = n_A_Buf2[12]),
      (c.A2_Skill13.value = n_A_Buf2[13]),
      (c.A2_Skill14.value = n_A_Buf2[14]),
      (c.A2_Skill15.value = n_A_Buf2[15]),
      (c.A5_Skill0.checked = n_A_Buf2[16]),
      (c.A5_Skill1.checked = n_A_Buf2[17]),
      (c.A5_Skill2.checked = n_A_Buf2[18]),
      (c.A5_Skill3.checked = n_A_Buf2[19]),
      (c.A5_Skill4.checked = n_A_Buf2[20]),
      (c.A5_Skill5.checked = n_A_Buf2[21]));
  } else {
    var _;
    ((_ =
      '<TR><TD id="A2TD" class="subheader point" onclick="BufSW(1)" role="button" tabindex="0" aria-expanded="false">Supportive / Party Skills <span id="A2used"></span>'),
      myInnerHtml(
        "SIENSKILL",
        (_ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  A2(0);
}
function A2(e) {
  e == 1 && calc();
  for (var _ = 0, n = 0; n <= 21; n++)
    if (n_A_Buf2[n] != 0) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("A2TD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("A2used", _ == 0 ? "" : " [active]", 0));
}
function Buf3SW(e) {
  if (((n_Skill3SW = e), n_Skill3SW)) {
    ((n =
      '<TR><TD id="A3TD" ColSpan="6" class="subheader point" onclick="Buf3SW(0)" role="button" tabindex="0" aria-expanded="true" style="text-align:left;">Music and Dance Skills <span id="A3used"></span>'),
      (n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
      (n +=
        '<TR><TD id="EN0_1"></TD><TD id="EN0_2" class="data"></TD><TD id="EN0_3" style="line-height:165%;"></TD><TD id="EN0_4" class="data"></TD><TD id="EN0_5"></TD><TD id="EN0_6"></TD></TR>'),
      (n +=
        '<TR><TD id="EN1_1"></TD><TD id="EN1_2" class="data"></TD><TD id="EN1_3"></TD><TD id="EN1_4" class="data"></TD><TD id="EN1_5"></TD><TD id="EN1_6"></TD></TR>'),
      (n +=
        '<TR><TD id="EN2_1"></TD><TD id="EN2_2" class="data"></TD><TD id="EN2_3" style="line-height:165%;"></TD><TD id="EN2_4" class="data"></TD><TD id="EN2_5"></TD><TD id="EN2_6"></TD></TR>'),
      (n +=
        '<TR><TD id="EN3_1"></TD><TD id="EN3_2" class="data"></TD><TD id="EN3_3"></TD><TD id="EN3_4" class="data"></TD><TD id="EN3_5"></TD><TD id="EN3_6"></TD></TR>'),
      (n +=
        '<TR><TD id="EN4_1"></TD><TD id="EN4_2" class="data"></TD><TD id="EN4_3"></TD><TD id="EN4_4" class="data"></TD><TD id="EN4_5"></TD><TD id="EN4_6"></TD></TR>'),
      (n +=
        '<TR><TD id="EN5_1"></TD><TD id="EN5_2" class="data"></TD><TD id="EN5_3"></TD><TD id="EN5_4" class="data"></TD><TD id="EN5_5"></TD><TD id="EN5_6"></TD></TR>'),
      (n +=
        '<TR><TD id="EN6_1"></TD><TD id="EN6_2" class="data"></TD><TD id="EN6_3"></TD><TD id="EN6_4" class="data"></TD><TD id="EN6_5"></TD><TD id="EN6_6"></TD></TR>'),
      (n +=
        '<TR><TD id="EN12_1" class="dotB"></TD><TD id="EN12_2" class="data dotB"></TD><TD id="EN12_3" class="dotB" style="line-height:165%;"></TD><TD id="EN12_4" class="data dotB"></TD><TD id="EN12_5" class="dotB"></TD><TD id="EN12_6" class="dotB"></TD></TR>'),
      (n +=
        '<TR><TD id="EN7_1"></TD><TD id="EN7_2" class="data"></TD><TD id="EN8_1" ColSpan="3"></TD><TD id="EN8_2" class="left"></TD></TR>'),
      (n +=
        '<TR><TD id="EN9_1" class="dotB"></TD><TD id="EN9_2" class="data dotB"></TD><TD id="EN10_1" class="dotB" ColSpan="3"></TD><TD id="EN10_2" class="dotB left"></TD></TR>'),
      myInnerHtml(
        "SP_SIEN01",
        (n +=
          '<TR style="text-align:left;"><TD colspan=6><span id="EN11_1"></span><span id="EN11_2"></span><span id="EN11_1a"></span></TD></TR>'),
        0,
      ));
    var _ = [202, 203, 204, 205, 210, 212, 213, 223, 217, 219, 220, 0, 211];
    for (i = 0; i <= 12; i++) myInnerHtml("EN" + i + "_1", skillName(_[i]), 0);
    for (
      myInnerHtml("EN0_2", '<select name="A3_Skill0_1" onChange="Skill3SW_2()|A3(1)"></select>', 0),
        myInnerHtml(
          "EN1_2",
          '<select name="A3_Skill1_1" onChange="Skill3SW_2()|A3(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN2_2",
          '<select name="A3_Skill2_1" onChange="Skill3SW_2()|A3(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN3_2",
          '<select name="A3_Skill3_1" onChange="Skill3SW_2()|A3(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN4_2",
          '<select name="A3_Skill4_1" onChange="Skill3SW_2()|A3(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN5_2",
          '<select name="A3_Skill5_1" onChange="Skill3SW_2()|A3(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN6_2",
          '<select name="A3_Skill6_1" onChange="Skill3SW_2()|A3(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN12_2",
          '<select name="A3_Skill12_1" onChange="Skill3SW_2()|A3(1)"></select>',
          0,
        ),
        myInnerHtml("EN7_2", '<select name="A3_Skill7" onChange="A3(1)"></select>', 0),
        myInnerHtml("EN8_2", '<select name="A3_Skill8" onChange="A3(1)"></select>', 0),
        myInnerHtml("EN9_2", '<select name="A3_Skill9" onChange="A3(1)"></select>', 0),
        myInnerHtml("EN10_2", '<select name="A3_Skill10" onChange="A3(1)"></select>', 0),
        myInnerHtml(
          "EN11_1",
          '<input type="checkbox" name="A3_Skill11" onClick="Skill3SW_2()|calc()">Marionette Control',
          0,
        ),
        i = 0;
      i <= 10;
      i++
    )
      ((c.A3_Skill0_1.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill1_1.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill2_1.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill3_1.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill4_1.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill5_1.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill6_1.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill12_1.options[i] = new documento.Opzione(i, i)));
    for (i = 0; i <= 5; i++)
      ((c.A3_Skill7.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill8.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill9.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill10.options[i] = new documento.Opzione(i, i)));
    ((c.A3_Skill0_1.value = n_A_Buf3[0]),
      (c.A3_Skill1_1.value = n_A_Buf3[1]),
      (c.A3_Skill2_1.value = n_A_Buf3[2]),
      (c.A3_Skill3_1.value = n_A_Buf3[3]),
      (c.A3_Skill4_1.value = n_A_Buf3[4]),
      (c.A3_Skill5_1.value = n_A_Buf3[5]),
      (c.A3_Skill6_1.value = n_A_Buf3[6]),
      (c.A3_Skill12_1.value = n_A_Buf3[37]),
      (c.A3_Skill7.value = n_A_Buf3[7]),
      (c.A3_Skill8.value = n_A_Buf3[8]),
      (c.A3_Skill9.value = n_A_Buf3[9]),
      (c.A3_Skill10.value = n_A_Buf3[10]),
      (c.A3_Skill11.checked = n_A_Buf3[11]),
      Skill3SW_2());
  } else {
    var n;
    for (
      n =
        '<TR><TD id="A3TD" class="subheader point" onclick="Buf3SW(1)" role="button" tabindex="0" aria-expanded="false" style="text-align:left;">Music and Dance Skills <span id="A3used"></span>',
        myInnerHtml(
          "SP_SIEN01",
          (n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
          0,
        ),
        i = 0;
      i <= 11;
      i++
    )
      SWs3sw[i] = 0;
  }
  A3(0);
}
function Skill3SW_2() {
  if (
    ((n_A_Buf3[0] = 1 * c.A3_Skill0_1.value),
    (n_A_Buf3[1] = 1 * c.A3_Skill1_1.value),
    (n_A_Buf3[2] = 1 * c.A3_Skill2_1.value),
    (n_A_Buf3[3] = 1 * c.A3_Skill3_1.value),
    (n_A_Buf3[4] = 1 * c.A3_Skill4_1.value),
    (n_A_Buf3[5] = 1 * c.A3_Skill5_1.value),
    (n_A_Buf3[6] = 1 * c.A3_Skill6_1.value),
    (n_A_Buf3[37] = 1 * c.A3_Skill12_1.value),
    (n_A_Buf3[11] = 1 * c.A3_Skill11.checked),
    n_A_Buf3[0] != 0)
  ) {
    if (SWs3sw[0] == 0) {
      for (
        n_A_Buf3[20] == 0 && ((n_A_Buf3[20] = 100), (n_A_Buf3[19] = 100), (n_A_Buf3[30] = 10)),
          myInnerHtml("EN0_3", "Bard's AGI<br>Bard's LUK", 0),
          myInnerHtml(
            "EN0_4",
            '<select name="A3_Skill0_2" onChange="A3(1)"></select><br><select name="A3_Skill0_4" onChange="A3(1)"></select>',
            0,
          ),
          myInnerHtml("EN0_5", "Musical Lessons", 0),
          myInnerHtml("EN0_6", '<select name="A3_Skill0_3" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 200;
        i++
      )
        ((c.A3_Skill0_2.options[i - 1] = new documento.Opzione(i, i)),
          (c.A3_Skill0_4.options[i - 1] = new documento.Opzione(i, i)));
      for (i = 0; i <= 10; i++) c.A3_Skill0_3.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[0] = 1),
        (c.A3_Skill0_2.value = n_A_Buf3[20]),
        (c.A3_Skill0_4.value = n_A_Buf3[19]),
        (c.A3_Skill0_3.value = n_A_Buf3[30]));
    }
  } else
    ((SWs3sw[0] = 0),
      myInnerHtml("EN0_3", "", 0),
      myInnerHtml("EN0_4", "", 0),
      myInnerHtml("EN0_5", "", 0),
      myInnerHtml("EN0_6", "", 0));
  if (n_A_Buf3[1] != 0) {
    if (SWs3sw[1] == 0) {
      for (
        n_A_Buf3[21] == 0 && ((n_A_Buf3[21] = 100), (n_A_Buf3[31] = 10)),
          myInnerHtml("EN1_3", "Bard's AGI", 0),
          myInnerHtml("EN1_4", '<select name="A3_Skill1_2" onChange="A3(1)"></select>', 0),
          myInnerHtml("EN1_5", "Musical Lessons", 0),
          myInnerHtml("EN1_6", '<select name="A3_Skill1_3" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 200;
        i++
      )
        c.A3_Skill1_2.options[i - 1] = new documento.Opzione(i, i);
      for (i = 0; i <= 10; i++) c.A3_Skill1_3.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[1] = 1), (c.A3_Skill1_2.value = n_A_Buf3[21]), (c.A3_Skill1_3.value = n_A_Buf3[31]));
    }
  } else
    ((SWs3sw[1] = 0),
      myInnerHtml("EN1_3", "", 0),
      myInnerHtml("EN1_4", "", 0),
      myInnerHtml("EN1_5", "", 0),
      myInnerHtml("EN1_6", "", 0));
  if (n_A_Buf3[2] != 0) {
    if (SWs3sw[2] == 0) {
      for (
        n_A_Buf3[22] == 0 && ((n_A_Buf3[22] = 100), (n_A_Buf3[29] = 100), (n_A_Buf3[32] = 10)),
          myInnerHtml("EN2_3", "Bard's DEX<br>Bard's INT", 0),
          myInnerHtml(
            "EN2_4",
            '<select name="A3_Skill2_2" onChange="A3(1)"></select><br><select name="A3_Skill2_3" onChange="A3(1)"></select>',
            0,
          ),
          myInnerHtml("EN2_5", "Musical Lessons", 0),
          myInnerHtml("EN2_6", '<select name="A3_Skill2_4" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 150;
        i++
      )
        ((c.A3_Skill2_2.options[i - 1] = new documento.Opzione(i, i)),
          (c.A3_Skill2_3.options[i - 1] = new documento.Opzione(i, i)));
      for (i = 151; i <= 200; i++) c.A3_Skill2_2.options[i - 1] = new documento.Opzione(i, i);
      for (i = 0; i <= 10; i++) c.A3_Skill2_4.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[2] = 1),
        (c.A3_Skill2_2.value = n_A_Buf3[22]),
        (c.A3_Skill2_3.value = n_A_Buf3[29]),
        (c.A3_Skill2_4.value = n_A_Buf3[32]));
    }
  } else
    ((SWs3sw[2] = 0),
      myInnerHtml("EN2_3", "", 0),
      myInnerHtml("EN2_4", "", 0),
      myInnerHtml("EN2_5", "", 0),
      myInnerHtml("EN2_6", "", 0));
  if (n_A_Buf3[3] != 0) {
    if (SWs3sw[3] == 0) {
      for (
        n_A_Buf3[23] == 0 && ((n_A_Buf3[23] = 100), (n_A_Buf3[33] = 10)),
          myInnerHtml("EN3_3", "Bard's VIT", 0),
          myInnerHtml("EN3_4", '<select name="A3_Skill3_2" onChange="A3(1)"></select>', 0),
          myInnerHtml("EN3_5", "Musical Lessons", 0),
          myInnerHtml("EN3_6", '<select name="A3_Skill3_3" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 200;
        i++
      )
        c.A3_Skill3_2.options[i - 1] = new documento.Opzione(i, i);
      for (i = 0; i <= 10; i++) c.A3_Skill3_3.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[3] = 1), (c.A3_Skill3_2.value = n_A_Buf3[23]), (c.A3_Skill3_3.value = n_A_Buf3[33]));
    }
  } else
    ((SWs3sw[3] = 0),
      myInnerHtml("EN3_3", "", 0),
      myInnerHtml("EN3_4", "", 0),
      myInnerHtml("EN3_5", "", 0),
      myInnerHtml("EN3_6", "", 0));
  if (n_A_Buf3[4] != 0) {
    if (SWs3sw[4] == 0) {
      for (
        n_A_Buf3[24] == 0 && ((n_A_Buf3[24] = 130), (n_A_Buf3[34] = 10)),
          myInnerHtml("EN4_3", "Dancer's DEX", 0),
          myInnerHtml("EN4_4", '<select name="A3_Skill4_2" onChange="A3(1)"></select>', 0),
          myInnerHtml("EN4_5", "Dancing Lessons", 0),
          myInnerHtml("EN4_6", '<select name="A3_Skill4_3" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 200;
        i++
      )
        c.A3_Skill4_2.options[i - 1] = new documento.Opzione(i, i);
      for (i = 0; i <= 10; i++) c.A3_Skill4_3.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[4] = 1), (c.A3_Skill4_2.value = n_A_Buf3[24]), (c.A3_Skill4_3.value = n_A_Buf3[34]));
    }
  } else
    ((SWs3sw[4] = 0),
      myInnerHtml("EN4_3", "", 0),
      myInnerHtml("EN4_4", "", 0),
      myInnerHtml("EN4_5", "", 0),
      myInnerHtml("EN4_6", "", 0));
  if (n_A_Buf3[5] != 0) {
    if (SWs3sw[5] == 0) {
      for (
        n_A_Buf3[25] == 0 && ((n_A_Buf3[25] = 50), (n_A_Buf3[35] = 10)),
          myInnerHtml("EN5_3", "Dancer's LUK", 0),
          myInnerHtml("EN5_4", '<select name="A3_Skill5_2" onChange="A3(1)"></select>', 0),
          myInnerHtml("EN5_5", "Dancing Lessons", 0),
          myInnerHtml("EN5_6", '<select name="A3_Skill5_3" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 200;
        i++
      )
        c.A3_Skill5_2.options[i - 1] = new documento.Opzione(i, i);
      for (i = 0; i <= 10; i++) c.A3_Skill5_3.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[5] = 1), (c.A3_Skill5_2.value = n_A_Buf3[25]), (c.A3_Skill5_3.value = n_A_Buf3[35]));
    }
  } else
    ((SWs3sw[5] = 0),
      myInnerHtml("EN5_3", "", 0),
      myInnerHtml("EN5_4", "", 0),
      myInnerHtml("EN5_5", "", 0),
      myInnerHtml("EN5_6", "", 0));
  if (n_A_Buf3[6] != 0) {
    if (SWs3sw[6] == 0) {
      for (
        n_A_Buf3[26] == 0 && ((n_A_Buf3[26] = 50), (n_A_Buf3[36] = 10)),
          myInnerHtml("EN6_3", "Dancer's INT", 0),
          myInnerHtml("EN6_4", '<select name="A3_Skill6_2" onChange="A3(1)"></select>', 0),
          myInnerHtml("EN6_5", "Dancing Lessons", 0),
          myInnerHtml("EN6_6", '<select name="A3_Skill6_3" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 200;
        i++
      )
        c.A3_Skill6_2.options[i - 1] = new documento.Opzione(i, i);
      for (i = 0; i <= 10; i++) c.A3_Skill6_3.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[6] = 1), (c.A3_Skill6_2.value = n_A_Buf3[26]), (c.A3_Skill6_3.value = n_A_Buf3[36]));
    }
  } else
    ((SWs3sw[6] = 0),
      myInnerHtml("EN6_3", "", 0),
      myInnerHtml("EN6_4", "", 0),
      myInnerHtml("EN6_5", "", 0),
      myInnerHtml("EN6_6", "", 0));
  if (n_A_Buf3[37] != 0) {
    if (SWs3sw[7] == 0) {
      for (
        n_A_Buf3[38] == 0 && ((n_A_Buf3[38] = 130), (n_A_Buf3[39] = 130), (n_A_Buf3[27] = 10)),
          myInnerHtml("EN12_3", "Dancer's DEX<br>Dancer's AGI", 0),
          myInnerHtml(
            "EN12_4",
            '<select name="A3_Skill12_2" onChange="A3(1)"></select><br><select name="A3_Skill12_3" onChange="A3(1)"></select>',
            0,
          ),
          myInnerHtml("EN12_5", "Dancing Lessons", 0),
          myInnerHtml("EN12_6", '<select name="A3_Skill12_4" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 200;
        i++
      )
        ((c.A3_Skill12_2.options[i - 1] = new documento.Opzione(i, i)),
          (c.A3_Skill12_3.options[i - 1] = new documento.Opzione(i, i)));
      for (i = 0; i <= 10; i++) c.A3_Skill12_4.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[7] = 1),
        (c.A3_Skill12_2.value = n_A_Buf3[38]),
        (c.A3_Skill12_3.value = n_A_Buf3[39]),
        (c.A3_Skill12_4.value = n_A_Buf3[27]));
    }
  } else
    ((SWs3sw[7] = 0),
      myInnerHtml("EN12_3", "", 0),
      myInnerHtml("EN12_4", "", 0),
      myInnerHtml("EN12_5", "", 0),
      myInnerHtml("EN12_6", "", 0));
  if (n_A_Buf3[11] != 0) {
    if (SWs3sw[11] == 0) {
      for (
        myInnerHtml(
          "EN11_2",
          '<br>Controller\'s Stats: <select name="A3_Skill11_STR" onChange="A3(1)"></select><select name="A3_Skill11_AGI" onChange="A3(1)"></select><select name="A3_Skill11_VIT" onChange="A3(1)"></select><select name="A3_Skill11_INT" onChange="A3(1)"></select><select name="A3_Skill11_DEX" onChange="A3(1)"></select><select name="A3_Skill11_LUK" onChange="A3(1)"></select><BR><input type="checkbox" name="A3_Skill11a" onClick="A3(1)">Status compensation (adjustment for equipment / human calculation)',
          0,
        ),
          c.A3_Skill11_STR.options[0] = new documento.Opzione("STR", 0),
          c.A3_Skill11_AGI.options[0] = new documento.Opzione("AGI", 0),
          c.A3_Skill11_VIT.options[0] = new documento.Opzione("VIT", 0),
          c.A3_Skill11_INT.options[0] = new documento.Opzione("INT", 0),
          c.A3_Skill11_DEX.options[0] = new documento.Opzione("DEX", 0),
          c.A3_Skill11_LUK.options[0] = new documento.Opzione("LUK", 0),
          i = 1;
        i <= 99;
        i++
      )
        ((c.A3_Skill11_STR.options[i] = new documento.Opzione(i, i)),
          (c.A3_Skill11_AGI.options[i] = new documento.Opzione(i, i)),
          (c.A3_Skill11_VIT.options[i] = new documento.Opzione(i, i)),
          (c.A3_Skill11_INT.options[i] = new documento.Opzione(i, i)),
          (c.A3_Skill11_DEX.options[i] = new documento.Opzione(i, i)),
          (c.A3_Skill11_LUK.options[i] = new documento.Opzione(i, i)));
      ((SWs3sw[11] = 1),
        (c.A3_Skill11_STR.value = n_A_Buf3[12]),
        (c.A3_Skill11_AGI.value = n_A_Buf3[13]),
        (c.A3_Skill11_VIT.value = n_A_Buf3[14]),
        (c.A3_Skill11_INT.value = n_A_Buf3[15]),
        (c.A3_Skill11_DEX.value = n_A_Buf3[16]),
        (c.A3_Skill11_LUK.value = n_A_Buf3[17]),
        (c.A3_Skill11a.checked = n_A_Buf3[18]));
    }
  } else ((SWs3sw[11] = 0), myInnerHtml("EN11_2", "", 0));
}
function A3(e) {
  e == 1 && calc();
  for (var _ = 0, n = 0; n <= 17; n++)
    if ((n != 11 && n_A_Buf3[n] != 0) || (n == 11 && n_A_Buf3[37] != 0)) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("A3TD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("A3used", _ == 0 ? "" : " [active]", 0));
}
function Buf4SW(e) {
  if (((n_Skill4SW = e), n_Skill4SW)) {
    for (
      _ =
        '<TR><TD id="A4TD" ColSpan="2" class="subheader point" onclick="Buf4SW(0)" role="button" tabindex="0" aria-expanded="true">Guild Skills <span id="A4used"></span>',
        _ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>',
        _ += '<TR><TD id="EN40_1" class="center"></TD><TD id="EN40_2"></TD></TR>',
        _ += '<TR><TD id="EN41_1" class="center"></TD><TD id="EN41_2"></TD></TR>',
        _ += '<TR><TD id="EN42_1" class="center"></TD><TD id="EN42_2"></TD></TR>',
        _ += '<TR><TD id="EN43_1" class="center"></TD><TD id="EN43_2"></TD></TR>',
        myInnerHtml(
          "SP_SIEN02",
          (_ += '<TR><TD id="EN44_1" class="center"></TD><TD id="EN44_2"></TD></TR>'),
          0,
        ),
        name_CS4SW_SKILL = [
          "Battle Orders",
          "Great Leadership",
          "Wounds of Glory",
          "Soul of Cold",
          "Sharp Hawk Eyes",
        ],
        i = 0;
      i <= 4;
      i++
    )
      myInnerHtml("EN4" + i + "_1", name_CS4SW_SKILL[i], 0);
    for (
      myInnerHtml("EN40_2", '<input type="checkbox" name="A3_Skill40" onClick="A4(1)">', 0),
        myInnerHtml("EN41_2", '<select name="A3_Skill41" onChange="A4(1)"></select>', 0),
        myInnerHtml("EN42_2", '<select name="A3_Skill42" onChange="A4(1)"></select>', 0),
        myInnerHtml("EN43_2", '<select name="A3_Skill43" onChange="A4(1)"></select>', 0),
        myInnerHtml("EN44_2", '<select name="A3_Skill44" onChange="A4(1)"></select>', 0),
        i = 0;
      i <= 5;
      i++
    )
      ((c.A3_Skill41.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill42.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill43.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill44.options[i] = new documento.Opzione(i, i)));
    ((c.A3_Skill40.checked = n_A_Buf3[40]),
      (c.A3_Skill41.value = n_A_Buf3[41]),
      (c.A3_Skill42.value = n_A_Buf3[42]),
      (c.A3_Skill43.value = n_A_Buf3[43]),
      (c.A3_Skill44.value = n_A_Buf3[44]));
  } else {
    var _;
    ((_ =
      '<TR><TD id="A4TD" class="subheader point" onclick="Buf4SW(1)" role="button" tabindex="0" aria-expanded="false">Guild Skills <span id="A4used"></span>'),
      myInnerHtml(
        "SP_SIEN02",
        (_ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  A4(0);
}
function A4(e) {
  e == 1 && calc();
  for (var _ = 0, n = 40; n <= 44; n++)
    if (n_A_Buf3[n] != 0) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("A4TD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("A4used", _ == 0 ? "" : " [active]", 0));
}
function Buf6SW(e) {
  if (((n_Skill6SW = e), n_Skill6SW)) {
    ((o =
      '<TR><TD id="A6TD" ColSpan="5" class="subheader point" onclick="Buf6SW(0)" role="button" tabindex="0" aria-expanded="true">Miscellaneous Effects on Player<span id="A6used"></span>'),
      (o += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
      (o +=
        '<TR><TD class="dotB" ColSpan="5"><Font size="2"><B>Pets </B></Font><select name="A8_Skill0" onChange="A6(1)" style="width:520px;"></select></TD></TR>'),
      (o +=
        '<TR><TD class="data"><span class=name><Font size="2"><b>Temporary Card/Item active effects </b></Font><span class=nametext>(Duration and chance are ignored)</span></span></TD><TD id="EN60_1" class="right"></TD><TD id="EN60_2" class="data"></TD><TD class="right">Poison</TD><TD id="EN62_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data"><select name="A8_Skill8" onChange="A6(1)" style="width:240px;"></select></TD><TD class="right">Provoke (self)</TD><TD id="EN63_2" class="data"></TD><TD class="right">Stun</TD><TD id="EN75_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data"><select name="A8_Skill9" onChange="A6(1)" style="width:240px;"></select></TD><TD class="right">Mind Breaker (self)</TD><TD id="EN61_2" class="data"></TD><TD class="right">Freeze</TD><TD id="EN78_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data"><select name="A8_Skill10" onChange="A6(1)" style="width:240px;"></select></TD><TD class="right">AGI Down</TD><TD id="EN66_2" class="data"></TD><TD class="right">Curse</TD><TD id="EN64_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data dotB"><select name="A8_Skill11" onChange="A6(1)" style="width:240px;"></select></TD><TD class="right">Quagmire</TD><TD id="EN68_2" class="data"></TD><TD class="right">Blind</TD><TD id="EN74_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data"><Font size="2"><B>EXP Items & Variables</B></Font></TD><TD class="right">' +
        skillName(442) +
        '</TD><TD id="EN70_2" class="data"></TD><TD class="right">Sleep</TD><TD id="EN77_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data">Server Base Experience Rate <select name="A8_Skill3" onChange="A6(1)"></select></TD><TD class="right">Undead Attribute Change</TD><TD id="EN65_2" class="data"></TD><TD class="right">Stone</TD><TD id="EN76_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data">Server Job Experience Rate <select name="A8_Skill7" onChange="A6(1)"></select></TD><TD class="right">Holy Armor [B.S.S.]</TD><TD id="EN67_2" class="data"></TD><TD class="right">Bleeding</TD><TD id="EN80_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data">Partymember Count <select name="A8_Skill5" onChange="A6(1)"></select></TD><TD class="right">Magnum Break Bonus</TD><TD id="EN69_2" class="data"></TD><TD class="right">Lex Aeterna</TD><TD id="EN79_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data">Exp Tap Bonus <select name="A8_Skill6" onChange="A6(1)"></select></TD><TD class="right">Set CRIT to 0%</TD><TD id="EN71_2" class="data"></TD><TD class="right">Critical Wounds</TD><TD id="EN81_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data">Battle Manual <select name="A8_Skill1" onChange="A6(1)"></select></TD><TD id="EN72_1" class="center" colspan="3">All Stats +1 [SuperNovice wife Undying Love bonus]</TD><TD id="EN72_2"></TD></TR>'),
      myInnerHtml(
        "SP_SIEN04",
        (o +=
          '<TR><TD class="data"><input type="checkbox" name="A8_Skill2" onClick="A6(1)">Job Manual 50</TD><TD id="EN73_1" class="center" colspan="3"></TD><TD id="EN73_2"></TD></TR>'),
        0,
      ),
      (c.A8_Skill0.options[0] = new documento.Opzione(
        m_PET[m_PET_SORT[0]][1],
        m_PET[m_PET_SORT[0]][0],
      )));
    var _ = documento.createElement("OPTGROUP");
    for (_.label = "CLASSIC PETS", c.A8_Skill0.appendChild(_), i = 1; i < 61; i++) {
      var n = m_PET_SORT[i];
      ((c.A8_Skill0.options[i] = new documento.Opzione(m_PET[n][1], m_PET[n][0])),
        _.appendChild(c.A8_Skill0.options[i]));
    }
    var a = documento.createElement("OPTGROUP");
    for (
      a.label = "EVOLVED PETS & OTHER NEW PETS", c.A8_Skill0.appendChild(a), j = i;
      j < m_PET_SORT.length;
      j++
    )
      ((n = m_PET_SORT[j]),
        (c.A8_Skill0.options[j] = new documento.Opzione(m_PET[n][1], m_PET[n][0])),
        a.appendChild(c.A8_Skill0.options[j]));
    for (i = 0; i < m_TempEffect_SORT.length; i++)
      ((n = m_TempEffect_SORT[i]),
        (c.A8_Skill8.options[i] = new documento.Opzione(
          m_TempEffect[n][1] + " [" + m_TempEffect[n][2] + "]",
          n,
        )),
        (c.A8_Skill9.options[i] = new documento.Opzione(
          m_TempEffect[n][1] + " [" + m_TempEffect[n][2] + "]",
          n,
        )),
        (c.A8_Skill10.options[i] = new documento.Opzione(
          m_TempEffect[n][1] + " [" + m_TempEffect[n][2] + "]",
          n,
        )),
        (c.A8_Skill11.options[i] = new documento.Opzione(
          m_TempEffect[n][1] + " [" + m_TempEffect[n][2] + "]",
          n,
        )));
    for (
      c.A8_Skill1.options[0] = new documento.Opzione("None", 0),
        c.A8_Skill1.options[1] = new documento.Opzione("25", 1),
        c.A8_Skill1.options[2] = new documento.Opzione("50", 2),
        c.A8_Skill1.options[3] = new documento.Opzione("100", 4),
        c.A8_Skill3.options[0] = new documento.Opzione("1x", 0),
        i = 1;
      i <= 199;
      i++
    )
      c.A8_Skill3.options[i] = new documento.Opzione(1 + 1 * i + "x", i);
    for (c.A8_Skill7.options[0] = new documento.Opzione("1x", 0), i = 1; i <= 199; i++)
      c.A8_Skill7.options[i] = new documento.Opzione(1 + 1 * i + "x", i);
    for (i = 1; i <= 12; i++) c.A8_Skill5.options[i - 1] = new documento.Opzione(i, i - 1);
    for (c.A8_Skill6.options[0] = new documento.Opzione("-", 0), i = 1; i <= 20; i++)
      c.A8_Skill6.options[i] = new documento.Opzione("+" + 25 * i + "%", i);
    for (
      c.A8_Skill0.value = n_A_Buf8[0],
        c.A8_Skill1.value = n_A_Buf8[1],
        c.A8_Skill2.checked = n_A_Buf8[2],
        c.A8_Skill3.value = n_A_Buf8[3],
        c.A8_Skill5.value = n_A_Buf8[5],
        c.A8_Skill6.value = n_A_Buf8[6],
        c.A8_Skill7.value = n_A_Buf8[7],
        c.A8_Skill8.value = n_A_Buf8[8],
        c.A8_Skill9.value = n_A_Buf8[9],
        c.A8_Skill10.value = n_A_Buf8[10],
        c.A8_Skill11.value = n_A_Buf8[11],
        myInnerHtml("EN60_1", '<select name="A6_Skill0" onChange="StAllCalc()"></select>', 0),
        myInnerHtml("EN60_2", '<select name="A6_Skill1" onChange="A6(1)"></select>', 0),
        myInnerHtml("EN61_2", '<select name="A6_Skill4" onChange="A6(1)"></select>', 0),
        myInnerHtml("EN62_2", '<input type="checkbox" name="A_debuf2" onClick="A6(1)">', 0),
        myInnerHtml("EN63_2", '<select name="A6_Skill5" onChange="A6(1)"></select>', 0),
        myInnerHtml("EN64_2", '<input type="checkbox" name="A_debuf3" onClick="A6(1)">', 0),
        myInnerHtml("EN65_2", '<input type="checkbox" name="A6_Skill8" onClick="A6(1)">', 0),
        myInnerHtml("EN66_2", '<select name="A_debuf1" onChange="A6(1)"></select>', 0),
        myInnerHtml("EN67_2", '<input type="checkbox" name="A6_Skill6" onClick="A6(1)">', 0),
        myInnerHtml("EN68_2", '<select name="A_debuf0" onChange="A6(1)"></select>', 0),
        myInnerHtml("EN69_2", '<input type="checkbox" name="A6_Skill7" onClick="A6(1)">', 0),
        myInnerHtml("EN70_2", '<input type="checkbox" name="A6_Skill3" onClick="A6(1)">', 0),
        myInnerHtml("EN71_2", '<input type="checkbox" name="A6_Skill9" onClick="A6(1)">', 0),
        myInnerHtml("EN72_2", '<input type="checkbox" name="A6_Skill10" onClick="A6(1)">', 0),
        myInnerHtml("EN74_2", '<input type="checkbox" name="A6_Skill11" onClick="A6(1)">', 0),
        myInnerHtml("EN75_2", '<input type="checkbox" name="A6_Skill12" onClick="A6(1)">', 0),
        myInnerHtml("EN76_2", '<input type="checkbox" name="A6_Skill13" onClick="A6(1)">', 0),
        myInnerHtml("EN77_2", '<input type="checkbox" name="A6_Skill14" onClick="A6(1)">', 0),
        myInnerHtml("EN78_2", '<input type="checkbox" name="A6_Skill15" onClick="A6(1)">', 0),
        myInnerHtml("EN79_2", '<input type="checkbox" name="A6_Skill16" onClick="A6(1)">', 0),
        myInnerHtml("EN80_2", '<input type="checkbox" name="A6_Skill17" onClick="A6(1)">', 0),
        myInnerHtml("EN81_2", '<select name="A6_Skill18" onChange="A6(1)"></select>', 0),
        c.A6_Skill0.options[0] = new documento.Opzione("Volcano", 0),
        c.A6_Skill0.options[1] = new documento.Opzione("Deluge", 1),
        c.A6_Skill0.options[2] = new documento.Opzione("Violent Gale", 2),
        i = 0;
      i <= 5;
      i++
    )
      c.A6_Skill1.options[i] = new documento.Opzione(i, i);
    for (i = 0; i <= 5; i++)
      ((c.A6_Skill4.options[i] = new documento.Opzione(i, i)),
        (c.A6_Skill18.options[i] = new documento.Opzione(i, i)));
    for (i = 0; i <= 10; i++) c.A6_Skill5.options[i] = new documento.Opzione(i, i);
    for (c.A_debuf0.options[0] = new documento.Opzione("-", 0), i = 1; i <= 5; i++)
      c.A_debuf0.options[i] = new documento.Opzione(i, i);
    for (c.A_debuf1.options[0] = new documento.Opzione("-", 0), i = 1; i <= 10; i++)
      c.A_debuf1.options[i] = new documento.Opzione("Lvl " + i, i);
    ((c.A_debuf1.options[11] = new documento.Opzione("Lvl 46", 46)),
      (c.A6_Skill0.value = n_A_Buf6[0]),
      (c.A6_Skill1.value = n_A_Buf6[1]),
      (c.A6_Skill3.checked = n_A_Buf6[3]),
      (c.A6_Skill4.value = n_A_Buf6[4]),
      (c.A6_Skill5.value = n_A_Buf6[5]),
      (c.A6_Skill6.checked = n_A_Buf6[6]),
      (c.A6_Skill7.checked = n_A_Buf6[7]),
      (c.A6_Skill8.checked = n_A_Buf6[8]),
      (c.A6_Skill9.checked = n_A_Buf6[9]),
      (c.A6_Skill10.checked = n_A_Buf6[10]),
      (c.A6_Skill11.checked = n_A_Buf6[11]),
      (c.A6_Skill12.checked = n_A_Buf6[12]),
      (c.A6_Skill13.checked = n_A_Buf6[13]),
      (c.A6_Skill14.checked = n_A_Buf6[14]),
      (c.A6_Skill15.checked = n_A_Buf6[15]),
      (c.A6_Skill16.checked = n_A_Buf6[16]),
      (c.A6_Skill17.checked = n_A_Buf6[17]),
      (c.A6_Skill18.value = n_A_Buf6[18]),
      (c.A_debuf0.value = n_A_Buf6[19]),
      (c.A_debuf1.value = n_A_Buf6[20]),
      (c.A_debuf2.checked = n_A_Buf6[21]),
      (c.A_debuf3.checked = n_A_Buf6[22]));
  } else {
    var o;
    ((o =
      '<TR><TD id="A6TD" class="subheader point" onclick="Buf6SW(1)" role="button" tabindex="0" aria-expanded="false">Miscellaneous Effects on Player<span id="A6used"></span>'),
      myInnerHtml(
        "SP_SIEN04",
        (o += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  A6(0);
}
function A6(e) {
  e == 1 && calc();
  for (var _ = 0, n = 0; n < n_A_Buf6.length; n++)
    if (n != 0 && n_A_Buf6[n] != 0) {
      _ = 1;
      break;
    }
  for (n = 0; n < n_A_Buf8.length; n++)
    if (n_A_Buf8[n] != 0) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("A6TD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("A6used", _ == 0 ? "" : " [active]", 0));
}
function SetSpeedPotionOptions() {
  ((c.A_SpeedPOT.options[2] =
    n_A_JOB != 3 && n_A_JobClass2() != 9 && n_A_JobClass2() != 16
      ? new documento.Opzione(SpeedPotName[2], 2)
      : new documento.Opzione("-", 0)),
    (c.A_SpeedPOT.options[3] =
      n_A_JobClass() == 1 ||
      n_A_JobClass() == 6 ||
      n_A_JobClass() == 41 ||
      n_A_JobClass2() == 14 ||
      n_A_JobClass2() == 11 ||
      n_A_JOB == 5 ||
      n_A_JOB == 45
        ? new documento.Opzione(SpeedPotName[3] + " (Lvl 85)", 3)
        : new documento.Opzione("* (" + m_Skill[304][2] + ", Lvl 85)", 3)),
    n_A_JOB == 22
      ? (c.A_SpeedPOT.options[4] = new documento.Opzione("Poison Bottle", 4))
      : ((c.A_SpeedPOT.options.length = 4), n_A_Buf7[35] == 4 && (n_A_Buf7[35] = 0)),
    (c.A_SpeedPOT.value = n_A_Buf7[35]));
}
function Buf7SW(e) {
  if (((n_Skill7SW = e), n_Skill7SW)) {
    for (
      _ =
        '<TR><TD id="A7TD" ColSpan="4" class="subheader point" onclick="Buf7SW(0)" role="button" tabindex="0" aria-expanded="true">Food, Speed Potions & other Items <span id="A7used"></span>',
        _ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>',
        _ +=
          '<TR><TD id="EN717" class="data" style="width:142px;"></TD><TD id="EN722" class="dotB" colspan="2" rowspan="2"></TD><TD id="EN715" style="width:140px;"></TD></TR>',
        _ += '<TR><TD id="EN745" class="data"></TD><TD id="EN744" class="dotB"></TD></TR>',
        _ +=
          '<TR><TD id="EN718" class="data" colspan="2"></TD><TD class="data" style="width:80px;"><Font size="2"><B>Stat Foods</B></Font></TD><TD><Font size="2"><B>Stat+20 Foods</B></Font></TD></TR>',
        _ +=
          '<TR><TD id="EN719" class="data" colspan="2"></TD><TD id="EN73" class="data"></TD><TD id="EN741"></TD></TR>',
        _ +=
          '<TR><TD id="EN742" class="data" colspan="2"></TD><TD id="EN74" class="data"></TD><TD id="EN747"></TD></TR>',
        _ +=
          '<TR><TD id="EN739" class="data" colspan="2"></TD><TD id="EN75" class="data"></TD><TD id="EN748"></TD></TR>',
        _ +=
          '<TR><TD id="EN740" class="data" colspan="2"></TD><TD id="EN76" class="data"></TD><TD id="EN749"></TD></TR>',
        _ +=
          '<TR><TD id="EN721" class="data" colspan="2"></TD><TD id="EN77" class="data"></TD><TD id="EN750"></TD></TR>',
        _ +=
          '<TR><TD id="EN737"></TD><TD class="data dotB"></TD><TD id="EN78" class="data dotB"></TD><TD id="EN751" class="dotB"></TD></TR>',
        _ +=
          '<TR><TD id="EN720" class="data"></TD><TD class="data" colspan="2"><Font size="2"><B>New World Food</B></Font></TD><TD><Font size="2"><B>Battle Grounds Food</B></Font></TD></TR>',
        _ +=
          '<TR><TD id="EN710" class="data"></TD><TD id="EN727" class="data" colspan="2"></TD><TD id="EN723"></TD></TR>',
        _ +=
          '<TR><TD id="EN79" class="data"></TD><TD id="EN728" class="data" colspan="2"></TD><TD id="EN724"></TD></TR>',
        _ +=
          '<TR><TD id="EN738" class="data"></TD><TD id="EN729" class="data" colspan="2"></TD><TD id="EN725"></TD></TR>',
        _ +=
          '<TR><TD id="EN716" class="data"></TD><TD id="EN730" class="data" colspan="2"></TD><TD id="EN726" class="dotB"></TD></TR>',
        _ +=
          '<TR><TD id="EN746" class="data"></TD><TD id="EN731" class="data" colspan="2"></TD><TD><Font size="2"><B>Elemental Resist Pot.</B></Font></TD></TR>',
        _ +=
          '<TR><TD id="EN72" class="data"></TD><TD id="EN732" class="data" colspan="2"></TD><TD id="EN711"></TD></TR>',
        _ +=
          '<TR><TD id="EN71" class="data"></TD><TD id="EN733" class="data" colspan="2"></TD><TD id="EN712"></TD></TR>',
        _ +=
          '<TR><TD id="EN70" class="data"></TD><TD id="EN734" class="data" colspan="2"></TD><TD id="EN713"></TD></TR>',
        myInnerHtml(
          "SP_SIEN05",
          (_ +=
            '<TR><TD id="EN743" class="data" class="data"></TD><TD id="EN735" class="data" colspan="2"></TD><TD id="EN714"></TD></TR>'),
          0,
        ),
        myInnerHtml(
          "EN70",
          '<input type="checkbox" name="A7_Skill0" onClick="A7(1)"><span class=name>Sesame Pastry<span class=nametext>HIT +30</span></span>',
          0,
        ),
        myInnerHtml(
          "EN71",
          '<input type="checkbox" name="A7_Skill1" onClick="A7(1)"><span class=name>Honey Pastry<span class=nametext>FLEE +30</span></span>',
          0,
        ),
        myInnerHtml(
          "EN72",
          '<input type="checkbox" name="A7_Skill2" onClick="A7(1)"><span class=name>Rainbow Cake<span class=nametext>ATK +10, MATK +10</span></span>',
          0,
        ),
        myInnerHtml(
          "EN79",
          '<input type="checkbox" name="A7_Skill9" onClick="A7(1)"><span class=name>Box of Resentment<span class=nametext>ATK +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN710",
          '<input type="checkbox" name="A7_Skill10" onClick="A7(1)"><span class=name>Box of Drowsiness<span class=nametext>MATK +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN711",
          '<input type="checkbox" name="A7_Skill11" onClick="A7(1)">Coldproof Potion',
          0,
        ),
        myInnerHtml(
          "EN712",
          '<input type="checkbox" name="A7_Skill12" onClick="A7(1)">Earthproof Potion',
          0,
        ),
        myInnerHtml(
          "EN713",
          '<input type="checkbox" name="A7_Skill13" onClick="A7(1)">Fireproof Potion',
          0,
        ),
        myInnerHtml(
          "EN714",
          '<input type="checkbox" name="A7_Skill14" onClick="A7(1)">Thunderproof Potion',
          0,
        ),
        myInnerHtml(
          "EN715",
          '<input type="checkbox" name="A7_Skill26" onClick="A7(1)"><span class=name>Guarana Candy<span class=nametext>Increase AGI Lvl 5, ASPD +10% (same as Concentration Potion)</span></span>',
          0,
        ),
        myInnerHtml(
          "EN716",
          '<input type="checkbox" name="A7_Skill16" onClick="A7(1)"><span class=name>Buche de Noel<span class=nametext>HIT +3%, CRIT +7, MaxHP&SP +3%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN717",
          '<input type="checkbox" name="A7_Skill31" onClick="A7(1)"><span class=name>Aloevera<span class=nametext>Self Provoke Lvl 1</span></span>',
          0,
        ),
        myInnerHtml(
          "EN718",
          '<input type="checkbox" name="A7_Skill32" onClick="A7(1)"><span class=name>Small/Big Defense Potion<span class=nametext>DEF +3</span></span>',
          0,
        ),
        myInnerHtml(
          "EN719",
          '<input type="checkbox" name="A7_Skill33" onClick="A7(1)"><span class=name>Small/Big Magic Defense Potion<span class=nametext>MDEF +3</span></span>',
          0,
        ),
        myInnerHtml(
          "EN720",
          '<input type="checkbox" name="A7_Skill34" onClick="A7(1)"><span class=name>Box of Gloom<span class=nametext>' +
            skillName(42) +
            " Lvl 1</span></span>",
          0,
        ),
        myInnerHtml(
          "EN721",
          '<input type="checkbox" name="A7_Skill36" onClick="A7(1)"><span class=name>Halo-Halo / Luxurious Western Food<span class=nametext>All Stats +3</span></span>',
          0,
        ),
        myInnerHtml(
          "EN722",
          '<select name="A_SpeedPOT" onChange="A7(1)" style="width:168px; height:26px;"><option value="0">(no Speed Potion)</option></select>',
          0,
        ),
        myInnerHtml(
          "EN723",
          '<input type="checkbox" name="A7_Skill27" onClick="A7(1)"><span class=name>Military Ration B<span class=nametext>HIT +33</span></span>',
          0,
        ),
        myInnerHtml(
          "EN724",
          '<input type="checkbox" name="A7_Skill28" onClick="A7(1)"><span class=name>Military Ration C<span class=nametext>FLEE +33</span></span>',
          0,
        ),
        myInnerHtml(
          "EN725",
          '<input type="checkbox" name="A7_Skill29" onClick="A7(1)"><span class=name>Tasty Pink Ration<span class=nametext>ATK +15</span></span>',
          0,
        ),
        myInnerHtml(
          "EN726",
          '<input type="checkbox" name="A7_Skill30" onClick="A7(1)"><span class=name>Tasty White Ration<span class=nametext>MATK +15</span></span>',
          0,
        ),
        myInnerHtml(
          "EN727",
          '<input type="checkbox" name="A7_Skill17" onClick="A7(1)"><span class=name>Rune Strawberry Cake<span class=nametext>ATK +5, MATK +5</span></span>',
          0,
        ),
        myInnerHtml(
          "EN728",
          '<input type="checkbox" name="A7_Skill18" onClick="A7(1)"><span class=name>Schwartzwald Pine Jubilee<span class=nametext>HIT +10, Perfect Dodge +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN729",
          '<input type="checkbox" name="A7_Skill19" onClick="A7(1)"><span class=name>Arunafeltz Desert Sandwich<span class=nametext>CRIT +7</span></span>',
          0,
        ),
        myInnerHtml(
          "EN730",
          '<input type="checkbox" name="A7_Skill20" onClick="A7(1)"><span class=name>Manuk\'s Sturdiness<span class=nametext>ATK based damage on Manuk maps +10%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN731",
          '<input type="checkbox" name="A7_Skill21" onClick="A7(1)"><span class=name>Manuk\'s Faith<span class=nametext>MATK based damage on Manuk maps +10%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN732",
          '<input type="checkbox" name="A7_Skill22" onClick="A7(1)"><span class=name>Manuk\'s Will<span class=nametext>Received damage on Manuk maps -10%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN733",
          '<input type="checkbox" name="A7_Skill23" onClick="A7(1)"><span class=name>Pinguicula\'s Fruit Jam<span class=nametext>ATK based dmg on Splendide maps +10%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN734",
          '<input type="checkbox" name="A7_Skill24" onClick="A7(1)"><span class=name>Cornus\' Tear<span class=nametext>MATK based damage on Splendide maps +10%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN735",
          '<input type="checkbox" name="A7_Skill25" onClick="A7(1)"><span class=name>Luciola\'s Honey Jam<span class=nametext>Received damage on Splendide maps -10%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN737",
          '<input type="checkbox" name="A7_Skill37" onClick="A7(1)"><span class=name>Lucky Rice Cake<span class=nametext>LUK +21</span></span>',
          0,
        ),
        myInnerHtml(
          "EN738",
          '<input type="checkbox" name="A7_Skill38" onClick="A7(1)"><span class=name>Distilled Fighting Spirit<span class=nametext>ATK +30</span></span>',
          0,
        ),
        myInnerHtml(
          "EN746",
          "<input type=checkbox name=A7_Skill46 onClick=A7(1)><span class=name>Tyr's Blessing<span class=nametext>FLEE +30, HIT +30, ATK +20, MATK +20</span></span>",
          0,
        ),
        myInnerHtml(
          "EN742",
          '<select name="A7_Skill42" onChange="A7(1)" style="width:205px;"><option value="0">(none)</option></select>',
          0,
        ),
        myInnerHtml(
          "EN744",
          '<input type="checkbox" name="A7_Skill44" onClick="A7(1)"><span class=name>Ginger Bread<span class=nametext>ASPD +15% (same as Awakening Potion)</span></span>',
          0,
        ),
        myInnerHtml(
          "EN745",
          '<input type="checkbox" name="A7_Skill45" onClick="A7(1)"><span class=name>Regeneration Potion<span class=nametext>Items/skills recover +20%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN739",
          '<select name="A7_Skill39" onChange="A7(1)"><option value="0">(no HP Increase Potion)</option></select>',
          0,
        ),
        myInnerHtml(
          "EN740",
          '<select name="A7_Skill40" onChange="A7(1)"><option value="0">(no SP Increase Potion)</option></select>',
          0,
        ),
        myInnerHtml(
          "EN741",
          '<input type="checkbox" name="A7_Skill41" onClick="A7(1)"><span class=name>Savage BBQ<span class=nametext>STR +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN747",
          '<input type="checkbox" name="A7_Skill47" onClick="A7(1)"><span class=name>Cocktail Warg Blood<span class=nametext>AGI +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN748",
          '<input type="checkbox" name="A7_Skill48" onClick="A7(1)"><span class=name>Minor Stew<span class=nametext>VIT +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN749",
          '<input type="checkbox" name="A7_Skill49" onClick="A7(1)"><span class=name>Siroma Iced Tea<span class=nametext>INT +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN750",
          '<input type="checkbox" name="A7_Skill50" onClick="A7(1)"><span class=name>Drosera Herb Salad<span class=nametext>DEX +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN751",
          '<input type="checkbox" name="A7_Skill51" onClick="A7(1)"><span class=name>Petite Tail Noodles<span class=nametext>LUK +20</span></span>',
          0,
        ),
        myInnerHtml("EN73", '<select name="A7_Skill3" onChange="A7(1)"></select>&nbsp', 0),
        myInnerHtml("EN74", '<select name="A7_Skill4" onChange="A7(1)"></select> ', 0),
        myInnerHtml("EN75", '<select name="A7_Skill5" onChange="A7(1)"></select> ', 0),
        myInnerHtml("EN76", '<select name="A7_Skill6" onChange="A7(1)"></select> ', 0),
        myInnerHtml("EN77", '<select name="A7_Skill7" onChange="A7(1)"></select> ', 0),
        myInnerHtml("EN78", '<select name="A7_Skill8" onChange="A7(1)"></select> ', 0),
        c.A7_Skill3.options[0] = new documento.Opzione("STR+", 0),
        c.A7_Skill4.options[0] = new documento.Opzione("AGI+", 0),
        c.A7_Skill5.options[0] = new documento.Opzione("VIT+", 0),
        c.A7_Skill6.options[0] = new documento.Opzione("INT+", 0),
        c.A7_Skill7.options[0] = new documento.Opzione("DEX+", 0),
        c.A7_Skill8.options[0] = new documento.Opzione("LUK+", 0),
        i = 1;
      i <= 10;
      i++
    )
      ((c.A7_Skill3.options[i] = new documento.Opzione("+" + i, i)),
        (c.A7_Skill4.options[i] = new documento.Opzione("+" + i, i)),
        (c.A7_Skill5.options[i] = new documento.Opzione("+" + i, i)),
        (c.A7_Skill6.options[i] = new documento.Opzione("+" + i, i)),
        (c.A7_Skill7.options[i] = new documento.Opzione("+" + i, i)),
        (c.A7_Skill8.options[i] = new documento.Opzione("+" + i, i)));
    ((c.A7_Skill39.options[0] = new documento.Opzione("(no HP Increase Potion)", 0)),
      (c.A7_Skill39.options[1] = new documento.Opzione("Small HP Increase Potion", 1)),
      (c.A7_Skill39.options[2] = new documento.Opzione("Medium HP Increase Potion", 2)),
      (c.A7_Skill39.options[3] = new documento.Opzione("Large HP Increase Potion", 3)),
      (c.A7_Skill40.options[0] = new documento.Opzione("(no SP Increase Potion)", 0)),
      (c.A7_Skill40.options[1] = new documento.Opzione("Small SP Increase Potion", 1)),
      (c.A7_Skill40.options[2] = new documento.Opzione("Medium SP Increase Potion", 2)),
      (c.A7_Skill40.options[3] = new documento.Opzione("Large SP Increase Potion", 3)),
      (c.A7_Skill42.options[0] = new documento.Opzione("(no Mega Resist Potion)", 0)),
      (c.A7_Skill42.options[1] = new documento.Opzione(
        "Mega Resist Potion [+10% resistance to Blind, Bleeding, Confusion, Curse, Frozen, Poison, Silence, Sleep, Stun and Stone Curse status effects]",
        1,
      )),
      (c.A7_Skill42.options[2] = new documento.Opzione(
        "Mega Resist Potion (iRO) [+20% resistance to Blind, Bleeding, Confusion, Curse, Frozen, Poison, Silence, Sleep, Stun and Stone Curse status effects]",
        2,
      )),
      (SpeedPotName = [
        "(no ASPD potion/item)",
        "Concentration Potion",
        "Awakening Potion (Lvl 40)",
        "Berserk Potion",
      ]),
      (c.A_SpeedPOT.options[0] = new documento.Opzione(SpeedPotName[0], 0)),
      (c.A_SpeedPOT.options[1] = new documento.Opzione(SpeedPotName[1], 1)),
      SetSpeedPotionOptions(),
      (c.A7_Skill0.checked = n_A_Buf7[0]),
      (c.A7_Skill1.checked = n_A_Buf7[1]),
      (c.A7_Skill2.checked = n_A_Buf7[2]),
      (c.A7_Skill3.value = n_A_Buf7[3]),
      (c.A7_Skill4.value = n_A_Buf7[4]),
      (c.A7_Skill5.value = n_A_Buf7[5]),
      (c.A7_Skill6.value = n_A_Buf7[6]),
      (c.A7_Skill7.value = n_A_Buf7[7]),
      (c.A7_Skill8.value = n_A_Buf7[8]),
      (c.A7_Skill9.checked = n_A_Buf7[9]),
      (c.A7_Skill10.checked = n_A_Buf7[10]),
      (c.A7_Skill11.checked = n_A_Buf7[11]),
      (c.A7_Skill12.checked = n_A_Buf7[12]),
      (c.A7_Skill13.checked = n_A_Buf7[13]),
      (c.A7_Skill14.checked = n_A_Buf7[14]),
      (c.A7_Skill16.checked = n_A_Buf7[16]),
      (c.A7_Skill17.checked = n_A_Buf7[17]),
      (c.A7_Skill18.checked = n_A_Buf7[18]),
      (c.A7_Skill19.checked = n_A_Buf7[19]),
      (c.A7_Skill20.checked = n_A_Buf7[20]),
      (c.A7_Skill21.checked = n_A_Buf7[21]),
      (c.A7_Skill22.checked = n_A_Buf7[22]),
      (c.A7_Skill23.checked = n_A_Buf7[23]),
      (c.A7_Skill24.checked = n_A_Buf7[24]),
      (c.A7_Skill25.checked = n_A_Buf7[25]),
      (c.A7_Skill26.checked = n_A_Buf7[26]),
      (c.A7_Skill27.checked = n_A_Buf7[27]),
      (c.A7_Skill28.checked = n_A_Buf7[28]),
      (c.A7_Skill29.checked = n_A_Buf7[29]),
      (c.A7_Skill30.checked = n_A_Buf7[30]),
      (c.A7_Skill31.checked = n_A_Buf7[31]),
      (c.A7_Skill32.checked = n_A_Buf7[32]),
      (c.A7_Skill33.checked = n_A_Buf7[33]),
      (c.A7_Skill34.checked = n_A_Buf7[34]),
      (c.A_SpeedPOT.value = n_A_Buf7[35]),
      (c.A7_Skill36.checked = n_A_Buf7[36]),
      (c.A7_Skill37.checked = n_A_Buf7[37]),
      (c.A7_Skill38.checked = n_A_Buf7[38]),
      (c.A7_Skill39.value = n_A_Buf7[39]),
      (c.A7_Skill40.value = n_A_Buf7[40]),
      (c.A7_Skill41.checked = n_A_Buf7[41]),
      (c.A7_Skill42.value = n_A_Buf7[42]),
      (c.A7_Skill44.checked = n_A_Buf7[44]),
      (c.A7_Skill45.checked = n_A_Buf7[45]),
      (c.A7_Skill46.checked = n_A_Buf7[46]),
      (c.A7_Skill47.checked = n_A_Buf7[47]),
      (c.A7_Skill48.checked = n_A_Buf7[48]),
      (c.A7_Skill49.checked = n_A_Buf7[49]),
      (c.A7_Skill50.checked = n_A_Buf7[50]),
      (c.A7_Skill51.checked = n_A_Buf7[51]));
  } else {
    var _;
    ((_ =
      '<TR><TD id="A7TD" class="subheader point" onclick="Buf7SW(1)" role="button" tabindex="0" aria-expanded="false">Food, Speed Potions & other Items <span id="A7used"></span>'),
      myInnerHtml(
        "SP_SIEN05",
        (_ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  A7(0);
}
function A7(e) {
  e == 1 && calc();
  for (var _ = 0, n = 0; n < n_A_Buf7.length; n++)
    if (n_A_Buf7[n] != 0) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("A7TD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("A7used", _ == 0 ? "" : " [active]", 0));
}
function Buf9SW(e) {
  if (((n_Skill9SW = e), n_Skill9SW)) {
    ((n =
      '<TR><TD id="A9TD" Colspan="5" class="subheader point" onclick="Buf9SW(0)" role="button" tabindex="0" aria-expanded="true">Additional Enchants & Manual Edits on Player <SPAN id="A9used"></SPAN>'),
      (n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
      (n += '<TR><TD class="dotB" Colspan="5"><table>'),
      (n +=
        '<tr><td class="data"><Font size="2"><B>Player Stats</B></Font></td><td Colspan="3"><Font size="2"><B>Player Sub-Stats</B></Font></td></tr>'),
      (n +=
        '<tr><td class="data" id="EN965"></td><TD id="EN931"></TD><TD id="EN939"></TD><TD id="EN945"></TD><TD id="EN984"></TD></tr>'),
      (n +=
        '<tr><td class="data" id="EN967"></td><TD id="EN933"></TD><TD id="EN941"></TD><TD id="EN947"></TD><TD id="EN959"></TD></tr>'),
      (n +=
        '<tr><td class="data" id="EN969"></td><TD id="EN935"></TD><TD id="EN951"></TD><TD id="EN943"></TD><TD id="EN985"></TD></tr>'),
      (n +=
        '<tr><td class="data" id="EN971"></td><TD id="EN937"></TD><TD id="EN955"></TD><TD id="EN983"></TD><TD id="EN986"></TD></tr>'),
      (n +=
        '<tr><td class="data" id="EN973"></td><TD id="EN961"></TD><TD id="EN953"></TD><TD id="EN944"></TD><TD id="EN987"></TD></tr>'),
      (n +=
        '<tr><td class="data" id="EN975"></td><TD id="EN963"></TD><TD id="EN957"></TD><TD id="EN949"></TD><TD id="EN988"></TD></tr>'),
      (n += "</table></TD></TR>"),
      (n +=
        '<TR><TD class="data"><Font size="2"><B>+% ATK based damage</B></Font></TD><TD colspan="4"><Font size="2"><B>Other</B></Font></TD></TR>'),
      (n += '<tr><TD id="EN900" class="data"></TD><TD id="EN915" colspan="4"></TD></tr>'),
      (n += '<tr><TD id="EN901" class="data"></TD><TD id="EN916" colspan="4"></TD></tr>'),
      (n += '<tr><TD id="EN902" class="data"></TD><TD id="EN976" colspan="4"></TD></tr>'),
      (n += '<tr><TD id="EN903" class="data dotB"></TD><TD id="EN977" colspan="4"></TD></tr>'),
      (n +=
        '<TR><TD class="data"><Font size="2"><B>+% Resistance</B></Font></TD><TD id="EN980" colspan="4"></TD></TR>'),
      (n += '<tr><TD id="EN904" class="data"></TD><TD id="EN978" colspan="4"></TD></tr>'),
      (n += '<tr><TD id="EN905" class="data"></TD><TD id="EN979" colspan="4"></TD></tr>'),
      (n += '<tr><TD id="EN906" class="data"></TD><TD id="EN981" colspan="4"></TD></tr>'),
      myInnerHtml(
        "ID_ARG",
        (n += '<tr><TD id="EN907" class="data"></TD><TD id="EN982" colspan="4"></TD></tr>'),
        0,
      ));
    var _ =
      '<optgroup label="Race"><option value="0">Formless</option><option value="1">Undead</option><option value="2">Brute</option><option value="3">Plant</option><option value="4">Insect</option><option value="5">Fish</option><option value="6">Demon</option><option value="7">Demi-Human</option><option value="8">Angel</option><option value="9">Dragon</option></optgroup><optgroup label="Element"><option value="10">Neutral </option><option value="11">Water </option><option value="12">Earth </option><option value="13">Fire </option><option value="14">Wind </option><option value="15">Poison </option><option value="16">Holy </option><option value="17">Shadow </option><option value="18">Ghost </option><option value="19">Undead </option></optgroup><optgroup label="Size"><option value="20">Small</option><option value="21">Medium</option><option value="22">Large</option></optgroup>';
    for (i = 0; i < 4; i++)
      myInnerHtml(
        "EN90" + i,
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC' +
          i +
          '" value="0" class="center">% vs<select name="A9_Skill' +
          i +
          '" onChange="A9(1)">' +
          _ +
          '<optgroup label="Type"><option value="23">Boss</option><option value="24">Goblin</option><option value="25">Golem</option><option value="26">Guardian</option><option value="27">Kobold</option><option value="28">Orc</option><option value="29">Satan Morroc</option></optgroup></select>',
        0,
      );
    for (i = 4; i < 8; i++)
      myInnerHtml(
        "EN90" + i,
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC' +
          i +
          '" value="0" class="center">% vs<select name="A9_Skill' +
          i +
          '" onChange="A9(1)">' +
          _ +
          '<optgroup label="Type"><option value="23">Boss</option><option value="24">Normal</option><option value="25">Guardian</option></optgroup></select>',
        0,
      );
    for (
      myInnerHtml(
        "EN965",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC32" value="0" class="center">STR',
        0,
      ),
        myInnerHtml(
          "EN967",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC33" value="0" class="center">AGI',
          0,
        ),
        myInnerHtml(
          "EN969",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC34" value="0" class="center">VIT',
          0,
        ),
        myInnerHtml(
          "EN971",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC35" value="0" class="center">INT',
          0,
        ),
        myInnerHtml(
          "EN973",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC36" value="0" class="center">DEX',
          0,
        ),
        myInnerHtml(
          "EN975",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC37" value="0" class="center">LUK',
          0,
        ),
        myInnerHtml(
          "EN931",
          '+<input type="text" inputmode="numeric" maxlength="5" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC15" value="0" class="center" style="width:44px;">MaxHP',
          0,
        ),
        myInnerHtml(
          "EN933",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC16" value="0" class="center">% MaxHP',
          0,
        ),
        myInnerHtml(
          "EN935",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC17" value="0" class="center">MaxSP',
          0,
        ),
        myInnerHtml(
          "EN937",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC18" value="0" class="center">% MaxSP',
          0,
        ),
        myInnerHtml(
          "EN961",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC30" value="0" class="center">% HP Regen',
          0,
        ),
        myInnerHtml(
          "EN963",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC31" value="0" class="center">% SP Regen',
          0,
        ),
        myInnerHtml(
          "EN939",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC19" value="0" class="center">DEF',
          0,
        ),
        myInnerHtml(
          "EN941",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC20" value="0" class="center">MDEF',
          0,
        ),
        myInnerHtml(
          "EN943",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC21" value="0" class="center">HIT',
          0,
        ),
        myInnerHtml(
          "EN983",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC83" value="0" class="center">% HIT',
          0,
        ),
        myInnerHtml(
          "EN944",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC40" value="0" class="center">Perfect HIT',
          0,
        ),
        myInnerHtml(
          "EN945",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC22" value="0" class="center">FLEE',
          0,
        ),
        myInnerHtml(
          "EN947",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC23" value="0" class="center">Perfect Dodge',
          0,
        ),
        myInnerHtml(
          "EN949",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC24" value="0" class="center">Critical Rate',
          0,
        ),
        myInnerHtml(
          "EN951",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC25" value="0" class="center">ATK',
          0,
        ),
        myInnerHtml(
          "EN953",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC38" value="0" class="center">% ATK',
          0,
        ),
        myInnerHtml(
          "EN955",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC27" value="0" class="center">MATK',
          0,
        ),
        myInnerHtml(
          "EN957",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC28" value="0" class="center">% MATK',
          0,
        ),
        myInnerHtml(
          "EN984",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC84" value="0" class="center">ASPD',
          0,
        ),
        myInnerHtml(
          "EN959",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC29" value="0" class="center">% ASPD',
          0,
        ),
        myInnerHtml(
          "EN985",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC85" value="0" class="center">Mastery ATK',
          0,
        ),
        myInnerHtml(
          "EN986",
          '&ndash;<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC86" value="0" class="center">% Cast Time',
          0,
        ),
        myInnerHtml(
          "EN987",
          '&ndash;<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC87" value="0" class="center">% Cast Delay',
          0,
        ),
        myInnerHtml(
          "EN988",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC88" value="0" class="center">Weight',
          0,
        ),
        myInnerHtml(
          "EN915",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC26" value="0" class="center">% ATK based damage on any target.',
          0,
        ),
        myInnerHtml(
          "EN916",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC39" value="0" class="center">% MATK based damage on any target.',
          0,
        ),
        myInnerHtml(
          "EN976",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC41" value="0" class="center">% Long-range ATK based damage on any target.',
          0,
        ),
        myInnerHtml(
          "EN977",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC42" value="0" class="center">% Critical damage on any target.',
          0,
        ),
        myInnerHtml(
          "EN978",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC43" value="0" class="center">% DEF ignoring on any target.',
          0,
        ),
        myInnerHtml(
          "EN979",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC44" value="0" class="center">% MDEF ignoring on any target.',
          0,
        ),
        myInnerHtml(
          "EN980",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC45" value="0" class="center">% Long-range ATK and MATK based damage resistance.',
          0,
        ),
        myInnerHtml(
          "EN981",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC47" value="0" class="center">% <select name="A9_Skill8" onChange="A9(1)" style="width:170px;"></select> skill damage.',
          0,
        ),
        myInnerHtml(
          "EN982",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC48" value="0" class="center">% <select name="A9_Skill9" onChange="A9(1)" style="width:170px;"></select> skill damage.',
          0,
        ),
        c.A9_Skill8.options[0] = new documento.Opzione("(no skill selected)", 0),
        i = 1;
      i < All_DMGskill.length;
      i++
    )
      c.A9_Skill8.options[i] = new documento.Opzione(
        skillNameInSelect(m_Skill[All_DMGskill[i]][0]),
        All_DMGskill[i],
      );
    for (
      c.A9_Skill9.options[0] = new documento.Opzione("(no skill selected)", 0), i = 1;
      i < All_DMGskill.length;
      i++
    )
      c.A9_Skill9.options[i] = new documento.Opzione(
        skillNameInSelect(m_Skill[All_DMGskill[i]][0]),
        All_DMGskill[i],
      );
    ((c.A9_Skill0.value = n_A_Buf9[0]),
      (c.ARG_RC0.value = n_A_Buf9[1]),
      (c.A9_Skill1.value = n_A_Buf9[2]),
      (c.ARG_RC1.value = n_A_Buf9[3]),
      (c.A9_Skill2.value = n_A_Buf9[4]),
      (c.ARG_RC2.value = n_A_Buf9[5]),
      (c.A9_Skill3.value = n_A_Buf9[6]),
      (c.ARG_RC3.value = n_A_Buf9[7]),
      (c.A9_Skill4.value = n_A_Buf9[8]),
      (c.ARG_RC4.value = n_A_Buf9[9]),
      (c.A9_Skill5.value = n_A_Buf9[10]),
      (c.ARG_RC5.value = n_A_Buf9[11]),
      (c.A9_Skill6.value = n_A_Buf9[12]),
      (c.ARG_RC6.value = n_A_Buf9[13]),
      (c.A9_Skill7.value = n_A_Buf9[14]),
      (c.ARG_RC7.value = n_A_Buf9[15]),
      (c.ARG_RC43.value = n_A_Buf9[16]),
      (c.ARG_RC44.value = n_A_Buf9[17]),
      (c.ARG_RC45.value = n_A_Buf9[18]),
      (c.ARG_RC47.value = n_A_Buf9[19]),
      (c.A9_Skill8.value = n_A_Buf9[20]),
      (c.ARG_RC48.value = n_A_Buf9[21]),
      (c.A9_Skill9.value = n_A_Buf9[22]),
      (c.ARG_RC83.value = n_A_Buf9[23]),
      (c.ARG_RC84.value = n_A_Buf9[24]),
      (c.ARG_RC85.value = n_A_Buf9[25]),
      (c.ARG_RC86.value = n_A_Buf9[26]),
      (c.ARG_RC87.value = n_A_Buf9[27]),
      (c.ARG_RC88.value = n_A_Buf9[28]),
      (c.ARG_RC15.value = n_A_Buf9[30]),
      (c.ARG_RC16.value = n_A_Buf9[31]),
      (c.ARG_RC17.value = n_A_Buf9[32]),
      (c.ARG_RC18.value = n_A_Buf9[33]),
      (c.ARG_RC19.value = n_A_Buf9[34]),
      (c.ARG_RC20.value = n_A_Buf9[35]),
      (c.ARG_RC21.value = n_A_Buf9[36]),
      (c.ARG_RC22.value = n_A_Buf9[37]),
      (c.ARG_RC23.value = n_A_Buf9[38]),
      (c.ARG_RC24.value = n_A_Buf9[39]),
      (c.ARG_RC25.value = n_A_Buf9[40]),
      (c.ARG_RC26.value = n_A_Buf9[41]),
      (c.ARG_RC27.value = n_A_Buf9[42]),
      (c.ARG_RC28.value = n_A_Buf9[43]),
      (c.ARG_RC29.value = n_A_Buf9[44]),
      (c.ARG_RC30.value = n_A_Buf9[45]),
      (c.ARG_RC31.value = n_A_Buf9[46]),
      (c.ARG_RC32.value = n_A_Buf9[47]),
      (c.ARG_RC33.value = n_A_Buf9[48]),
      (c.ARG_RC34.value = n_A_Buf9[49]),
      (c.ARG_RC35.value = n_A_Buf9[50]),
      (c.ARG_RC36.value = n_A_Buf9[51]),
      (c.ARG_RC37.value = n_A_Buf9[52]),
      (c.ARG_RC38.value = n_A_Buf9[53]),
      (c.ARG_RC39.value = n_A_Buf9[54]),
      (c.ARG_RC40.value = n_A_Buf9[55]),
      (c.ARG_RC41.value = n_A_Buf9[56]),
      (c.ARG_RC42.value = n_A_Buf9[57]));
  } else {
    var n;
    ((n =
      '<TR><TD id="A9TD" class="subheader point" onclick="Buf9SW(1)" role="button" tabindex="0" aria-expanded="false">Additional Enchants & Manual Edits on Player <SPAN id="A9used"></SPAN>'),
      myInnerHtml(
        "ID_ARG",
        (n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  A9(0);
}
function A9(e) {
  e == 1 && calc();
  for (var _ = 0, n = 1; n < 14; n += 2)
    if (n_A_Buf9[n] != 0) {
      _ = 1;
      break;
    }
  for (n = 15; n < n_A_Buf9.length; n++)
    if (n_A_Buf9[n] != 0) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("A9TD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("A9used", _ == 0 ? "" : " [active]", 0));
}
function Buf10SW(e) {
  if (((n_Skill10SW = e), n_Skill10SW)) {
    for (
      _ =
        '<TR><TD id="A10TD" Colspan="4" class="subheader point" onclick="Buf10SW(0)" role="button" tabindex="0" aria-expanded="true">Manual Edits on Enemy <SPAN id="A10used"></SPAN>',
        _ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>',
        _ +=
          '<TR><TD class="data"><Font size="2"><B>Enemy Stats</B></Font></td><td colspan="3"><Font size="2"><B>Enemy Sub-Stats</B></Font></td></tr>',
        _ +=
          '<tr><td id="EN1067" class="data"></td><TD id="EN1031"></TD><TD id="EN1051"></TD><TD id="EN1043"></TD></tr>',
        _ +=
          '<tr><td id="EN1069" class="data"></td><TD id="EN1033"></TD><TD id="EN1055"></TD><TD id="EN1044"></TD></tr>',
        _ +=
          '<tr><td id="EN1071" class="data"></td><TD id="EN1039"></TD><TD id="EN1053"></TD><TD id="EN1049"></TD></tr>',
        _ +=
          '<tr><td id="EN1073" class="data"></td><TD id="EN1041"></TD><TD id="EN1057"></TD><TD id="EN1045"></TD></tr>',
        _ +=
          '<tr><td id="EN1075" class="data dotB"></td><TD class="dotB"></TD><TD id="EN1059" class="dotB"></TD><TD id="EN1047" class="dotB"></TD></tr>',
        _ +=
          "<TR><TD colspan='4'><Font size='2'><B>Enemy's damage reductions:</B></Font></TD></TR>",
        _ +=
          '<tr><TD id="EN1001" class="data" colspan="2"></TD><TD id="EN1003" colspan="2"></TD></tr>',
        _ +=
          '<tr><TD id="EN1002" class="data" colspan="2"></TD><TD id="EN1004" colspan="2"></TD></tr>',
        _ +=
          '<tr><TD id="EN1000" class="data dotB" colspan="2"></TD><TD id="EN1010" class="dotB" colspan="2"></TD></tr>',
        _ += '<TR><TD id="EN1015" colspan="4"></TD></TR>',
        myInnerHtml("B_MANUAL", (_ += '<TR><TD id="EN1016" colspan="4"></TD></TR>'), 0),
        myInnerHtml(
          "EN1000",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC0" value="0" class="center">% Racial Resistance',
          0,
        ),
        myInnerHtml(
          "EN1001",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC1" value="0" class="center">vs<select name="Bman1" onChange="A10(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN1002",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC2" value="0" class="center">vs<select name="Bman2" onChange="A10(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN1003",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC3" value="0" class="center">% Size Resistance',
          0,
        ),
        myInnerHtml(
          "EN1004",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC4" value="0" class="center">% Long-range Resistance',
          0,
        ),
        myInnerHtml(
          "EN1010",
          '+<input type="text" inputmode="numeric" onkeypress="return isNumeric(event)" maxlength="3" onkeyup="A10(1)" name="BRG_RC10" value="0" class="center">% Additional Reflect (equip/card)',
          0,
        ),
        i = 0;
      i < v_Element_.length;
      i++
    )
      ((c.Bman1.options[i] = new documento.Opzione(v_Element_[i], i)),
        (c.Bman2.options[i] = new documento.Opzione(v_Element_[i], i)));
    (myInnerHtml(
      "EN1015",
      '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC26" value="0" class="center">% ATK based damage on any target.',
      0,
    ),
      myInnerHtml(
        "EN1016",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC39" value="0" class="center">% MATK based damage on any target.',
        0,
      ),
      myInnerHtml(
        "EN1031",
        '+<input type="text" inputmode="numeric" maxlength="5" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC15" value="0" class="center" style="width:44px;">MaxHP',
        0,
      ),
      myInnerHtml(
        "EN1033",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC16" value="0" class="center" disabled><S>% MaxHP</S>',
        0,
      ),
      myInnerHtml(
        "EN1039",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC19" value="0" class="center">DEF',
        0,
      ),
      myInnerHtml(
        "EN1041",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC20" value="0" class="center">MDEF',
        0,
      ),
      myInnerHtml(
        "EN1043",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC21" value="0" class="center">HIT',
        0,
      ),
      myInnerHtml(
        "EN1044",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC40" value="0" class="center" disabled><S>Perfect HIT</S>',
        0,
      ),
      myInnerHtml(
        "EN1045",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC22" value="0" class="center">FLEE',
        0,
      ),
      myInnerHtml(
        "EN1047",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC23" value="0" class="center" disabled><S>Perfect Dodge</S>',
        0,
      ),
      myInnerHtml(
        "EN1049",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC24" value="0" class="center">Critical Rate',
        0,
      ),
      myInnerHtml(
        "EN1051",
        '+<input type="text" inputmode="numeric" maxlength="5" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC25" value="0" class="center">ATK',
        0,
      ),
      myInnerHtml(
        "EN1055",
        '+<input type="text" inputmode="numeric" maxlength="5" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC38" value="0" class="center" disabled><S>Max ATK</S>',
        0,
      ),
      myInnerHtml(
        "EN1053",
        '+<input type="text" inputmode="numeric" maxlength="5" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC27" value="0" class="center">MATK',
        0,
      ),
      myInnerHtml(
        "EN1057",
        '+<input type="text" inputmode="numeric" maxlength="5" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC28" value="0" class="center" disabled><S>Max MATK</S>',
        0,
      ),
      myInnerHtml(
        "EN1059",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC29" value="0" class="center" disabled><S>% ASPD</S>',
        0,
      ),
      myInnerHtml(
        "EN1067",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC33" value="0" class="center">AGI ',
        0,
      ),
      myInnerHtml(
        "EN1069",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC34" value="0" class="center">VIT',
        0,
      ),
      myInnerHtml(
        "EN1071",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC35" value="0" class="center">INT',
        0,
      ),
      myInnerHtml(
        "EN1073",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC36" value="0" class="center">DEX',
        0,
      ),
      myInnerHtml(
        "EN1075",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC37" value="0" class="center">LUK',
        0,
      ),
      (c.BRG_RC0.value = n_B_manual[1]),
      (c.Bman1.value = n_B_manual[2]),
      (c.BRG_RC1.value = n_B_manual[3]),
      (c.Bman2.value = n_B_manual[4]),
      (c.BRG_RC2.value = n_B_manual[5]),
      (c.BRG_RC3.value = n_B_manual[7]),
      (c.BRG_RC4.value = n_B_manual[9]),
      (c.BRG_RC10.value = n_B_manual[21]),
      (c.BRG_RC15.value = n_B_manual[30]),
      (c.BRG_RC16.value = n_B_manual[31]),
      (c.BRG_RC19.value = n_B_manual[34]),
      (c.BRG_RC20.value = n_B_manual[35]),
      (c.BRG_RC21.value = n_B_manual[36]),
      (c.BRG_RC22.value = n_B_manual[37]),
      (c.BRG_RC23.value = n_B_manual[38]),
      (c.BRG_RC24.value = n_B_manual[39]),
      (c.BRG_RC25.value = n_B_manual[40]),
      (c.BRG_RC26.value = n_B_manual[41]),
      (c.BRG_RC27.value = n_B_manual[42]),
      (c.BRG_RC28.value = n_B_manual[43]),
      (c.BRG_RC29.value = n_B_manual[44]),
      (c.BRG_RC33.value = n_B_manual[48]),
      (c.BRG_RC34.value = n_B_manual[49]),
      (c.BRG_RC35.value = n_B_manual[50]),
      (c.BRG_RC36.value = n_B_manual[51]),
      (c.BRG_RC37.value = n_B_manual[52]),
      (c.BRG_RC38.value = n_B_manual[53]),
      (c.BRG_RC39.value = n_B_manual[54]),
      (c.BRG_RC40.value = n_B_manual[55]));
  } else {
    var _;
    ((_ =
      '<TR><TD id="A10TD" class="subheader point" onclick="Buf10SW(1)" role="button" tabindex="0" aria-expanded="false">Manual Edits on Enemy <SPAN id="A10used"></SPAN>'),
      myInnerHtml(
        "B_MANUAL",
        (_ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  A10(0);
}
function isNumeric(e) {
  var _ = e || window.event,
    n = _.keyCode || _.which;
  ((n = String.fromCharCode(n)),
    /[0-9]|-/.test(n) || ((_.returnValue = !1), _.preventDefault && _.preventDefault()));
}
function A10(e) {
  e == 1 && calc();
  for (var _ = 0, n = 0; n < n_B_manual.length; n++)
    if (n_B_manual[n] != 0) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("A10TD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("A10used", _ == 0 ? "" : " [active]", 0));
}
function debufSW(e) {
  if (((n_debufSW = e), n_debufSW)) {
    ((n =
      '<TR><TD id="AITD" ColSpan="4" class="subheader point" onClick="debufSW(0)" role="button" tabindex="0" aria-expanded="true">Debuffs on Enemy <span id="AIused"></span>'),
      (n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
      (n +=
        '<TR><TD id="BI18_1" class="center" style="width:90px;">Mind Breaker</TD><TD id="BI18_2" class="data"></TD><TD id="BI2_1" class="center">Poison</TD><TD id="BI2_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI0_1" class="center">Provoke</TD><TD id="BI0_2" class="data"></TD><TD id="BI3_1" class="center">Blind</TD><TD id="BI3_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI12_1" class="center">Signum Crucis</TD><TD id="BI12_2" class="data"></TD><TD id="BI10_1" class="center">Curse</TD><TD id="BI10_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI5_1" class="center">Blessing</TD><TD id="BI5_2" class="data"></TD><TD id="BI7_1" class="center">Stun</TD><TD id="BI7_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI6_1" class="center">Lex Aeterna</TD><TD id="BI6_2" class="data"></TD><TD id="BI4_1" class="center">Frozen</TD><TD id="BI4_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI11_1" class="center">Decrease AGI</TD><TD id="BI11_2" class="data"></TD><TD id="BI9_1" class="center">Stone</TD><TD id="BI9_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI17_1" class="center">Spider Web</TD><TD id="BI17_2" class="data"></TD><TD id="BI8_1" class="center">Sleep</TD><TD id="BI8_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI1_1" class="center">Quagmire</TD><TD id="BI1_2" class="data"></TD><TD id="BI19_1" class="center">' +
        skillName(211) +
        '</TD><TD id="BI19_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI24_1" class="center dotB">Flying</TD><TD id="BI24_2" class="data dotB"></TD><TD id="BI20_1" class="center dotB">' +
        skillName(218) +
        '</TD><TD id="BI20_2" class="dotB"></TD></TR>'),
      (n += '<TR><TD class="center" ColSpan="4"><b>Monster Exclusive Debuffs</b></TD></TR>'),
      (n +=
        '<TR><TD id="BI13_1" class="center">' +
        skillName(172) +
        ' / Disarm</TD><TD id="BI13_2" class="data"></TD><TD id="BI14_1" class="center">' +
        skillName(173) +
        '</TD><TD id="BI14_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI15_1" class="center">' +
        skillName(174) +
        '</TD><TD id="BI15_2" class="data"></TD><TD id="BI16_1" class="center">' +
        skillName(175) +
        '</TD><TD id="BI16_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI21_1" class="center">Eska</TD><TD id="BI21_2" class="data"></TD><TD id="BI22_1" class="center">Eske</TD><TD id="BI22_2"></TD></TR>'),
      myInnerHtml(
        "EnemyDebuf",
        (n += '<TR><TD id="BI23_1" class="center" colspan="4"></TD></TR>'),
        0,
      ),
      myInnerHtml("BI0_2", '<select name="B_debuf0" onChange="AI(1)"></select>', 0),
      myInnerHtml("BI1_2", '<select name="B_debuf1" onChange="AI(1)"></select>', 0),
      myInnerHtml("BI2_2", '<input type="checkbox" name="B_debuf2" onClick="AI(1)">', 0),
      myInnerHtml("BI3_2", '<input type="checkbox" name="B_debuf3" onClick="AI(1)">', 0),
      myInnerHtml("BI4_2", '<input type="checkbox" name="B_debuf4" onClick="AI(1)">', 0),
      myInnerHtml("BI5_2", '<input type="checkbox" name="B_debuf5" onClick="AI(1)">', 0),
      myInnerHtml("BI6_2", '<input type="checkbox" name="B_debuf6" onClick="AI(1)">', 0),
      myInnerHtml("BI7_2", '<input type="checkbox" name="B_debuf7" onClick="AI(1)">', 0),
      myInnerHtml("BI8_2", '<input type="checkbox" name="B_debuf8" onClick="AI(1)">', 0),
      myInnerHtml("BI9_2", '<input type="checkbox" name="B_debuf9" onClick="AI(1)">', 0),
      myInnerHtml("BI10_2", '<input type="checkbox" name="B_debuf10" onClick="AI(1)">', 0),
      myInnerHtml("BI11_2", '<select name="B_debuf11" onChange="AI(1)"></select>', 0),
      myInnerHtml("BI12_2", '<select name="B_debuf12" onChange="AI(1)"></select>', 0),
      myInnerHtml("BI17_2", '<input type="checkbox" name="B_debuf17" onClick="AI(1)">', 0),
      myInnerHtml("BI18_2", '<select name="B_debuf18" onChange="AI(1)"></select>', 0),
      myInnerHtml("BI19_2", '<input type="checkbox" name="B_debuf19" onClick="AI(1)">', 0),
      myInnerHtml("BI20_2", '<input type="checkbox" name="B_debuf20" onClick="AI(1)">', 0),
      myInnerHtml("BI24_2", '<select name="B_debuf24" onChange="AI(1)"></select>', 0),
      myInnerHtml("BI13_2", '<input type="checkbox" name="B_debuf13" onClick="AI(1)">', 0),
      myInnerHtml("BI14_2", '<input type="checkbox" name="B_debuf14" onClick="AI(1)">', 0),
      myInnerHtml("BI15_2", '<input type="checkbox" name="B_debuf15" onClick="AI(1)">', 0),
      myInnerHtml("BI16_2", '<input type="checkbox" name="B_debuf16" onClick="AI(1)">', 0),
      myInnerHtml("BI21_2", '<input type="checkbox" name="B_debuf21" onClick="AI(1)">', 0),
      myInnerHtml("BI22_2", '<input type="checkbox" name="B_debuf22" onClick="AI(1)">', 0),
      myInnerHtml(
        "BI23_1",
        'Elemental Change (Sage Skill) <select name="B_debuf23" onChange="AI(1)||debufSW(1)"></select>',
        0,
      ));
    var _ = ["(none)", "Water", "Earth", "Fire", "Wind"];
    for (i = 0; i <= 4; i++) c.B_debuf23.options[i] = new documento.Opzione(_[i], i);
    for (
      targetData[19]
        ? (myInnerHtml("BI18_1", "<S>Mind Breaker</S>", 0),
          (c.B_debuf18.disabled = !0),
          (c.B_debuf18.value = 0),
          (n_B_debuf[18] = 0),
          myInnerHtml("BI0_1", "<S>Provoke</S>", 0),
          (c.B_debuf0.disabled = !0),
          (c.B_debuf0.value = 0),
          (n_B_debuf[0] = 0),
          myInnerHtml("BI11_1", "<S>Decrease AGI</S>", 0),
          (c.B_debuf11.disabled = !0),
          (c.B_debuf11.value = 0),
          (n_B_debuf[11] = 0),
          myInnerHtml("BI2_1", "<S>Poison</S>", 0),
          (c.B_debuf2.disabled = !0),
          (c.B_debuf2.value = 0),
          (n_B_debuf[2] = 0),
          myInnerHtml("BI3_1", "<S>Blind</S>", 0),
          (c.B_debuf3.disabled = !0),
          (c.B_debuf3.value = 0),
          (n_B_debuf[3] = 0),
          myInnerHtml("BI10_1", "<S>Curse</S>", 0),
          (c.B_debuf10.disabled = !0),
          (c.B_debuf10.value = 0),
          (n_B_debuf[10] = 0),
          myInnerHtml("BI7_1", "<S>Stun</S>", 0),
          (c.B_debuf7.disabled = !0),
          (c.B_debuf7.value = 0),
          (n_B_debuf[7] = 0),
          myInnerHtml("BI4_1", "<S>Frozen</S>", 0),
          (c.B_debuf4.disabled = !0),
          (c.B_debuf4.value = 0),
          (n_B_debuf[4] = 0),
          myInnerHtml("BI9_1", "<S>Stone</S>", 0),
          (c.B_debuf9.disabled = !0),
          (c.B_debuf9.value = 0),
          (n_B_debuf[9] = 0),
          myInnerHtml("BI8_1", "<S>Sleep</S>", 0),
          (c.B_debuf8.disabled = !0),
          (c.B_debuf8.value = 0),
          (n_B_debuf[8] = 0))
        : targetData[3] < 90 ||
            c.B_debuf23.value != 0 ||
            n_B_debuf[23] != 0 ||
            (n_B_buf[6] < 90 && n_B_buf[6] != 0)
          ? (myInnerHtml("BI18_1", "Mind Breaker", 0),
            (c.B_debuf18.disabled = !1),
            myInnerHtml("BI0_1", "Provoke", 0),
            (c.B_debuf0.disabled = !1),
            myInnerHtml("BI11_1", "Decrease AGI", 0),
            (c.B_debuf11.disabled = !1),
            myInnerHtml("BI4_1", "Frozen", 0),
            (c.B_debuf4.disabled = !1),
            myInnerHtml("BI9_1", "Stone", 0),
            (c.B_debuf9.disabled = !1))
          : (myInnerHtml("BI2_1", "Poison", 0),
            (c.B_debuf2.disabled = !1),
            myInnerHtml("BI3_1", "Blind", 0),
            (c.B_debuf3.disabled = !1),
            myInnerHtml("BI10_1", "Curse", 0),
            (c.B_debuf10.disabled = !1),
            myInnerHtml("BI7_1", "Stun", 0),
            (c.B_debuf7.disabled = !1),
            myInnerHtml("BI8_1", "Sleep", 0),
            (c.B_debuf8.disabled = !1),
            myInnerHtml("BI18_1", "<S>Mind Breaker</S>", 0),
            (c.B_debuf18.disabled = !0),
            (c.B_debuf18.value = 0),
            (n_B_debuf[18] = 0),
            myInnerHtml("BI0_1", "<S>Provoke</S>", 0),
            (c.B_debuf0.disabled = !0),
            (c.B_debuf0.value = 0),
            (n_B_debuf[0] = 0),
            myInnerHtml("BI4_1", "<S>Frozen</S>", 0),
            (c.B_debuf4.disabled = !0),
            (c.B_debuf4.value = 0),
            (n_B_debuf[4] = 0),
            myInnerHtml("BI9_1", "<S>Stone</S>", 0),
            (c.B_debuf9.disabled = !0),
            (c.B_debuf9.value = 0),
            (n_B_debuf[9] = 0)),
        targetData[2] == 6 ||
        (targetData[3] >= 90 && (c.B_debuf23.value == 0 || n_B_debuf[23] == 0 || n_B_buf[6] >= 90))
          ? (myInnerHtml("BI5_1", "Blessing", 0),
            (c.B_debuf5.disabled = !1),
            myInnerHtml("BI12_1", "Signum Crucis", 0),
            (c.B_debuf12.disabled = !1))
          : (myInnerHtml("BI5_1", "<S>Blessing</S>", 0),
            (c.B_debuf5.disabled = !0),
            (c.B_debuf5.value = 0),
            (n_B_debuf[5] = 0),
            myInnerHtml("BI12_1", "<S>Signum Crucis</S>", 0),
            (c.B_debuf12.disabled = !0),
            (c.B_debuf12.value = 0),
            (n_B_debuf[12] = 0)),
        i = 0;
      i <= 10;
      i++
    )
      ((c.B_debuf0.options[i] = new documento.Opzione(i, i)),
        (c.B_debuf11.options[i] = new documento.Opzione(i, i)),
        (c.B_debuf12.options[i] = new documento.Opzione(i, i)));
    for (i = 0; i <= 5; i++)
      ((c.B_debuf1.options[i] = new documento.Opzione(i, i)),
        (c.B_debuf18.options[i] = new documento.Opzione(i, i)),
        (c.B_debuf24.options[i] = new documento.Opzione(i, i)));
    ((c.B_debuf0.value = n_B_debuf[0]),
      (c.B_debuf1.value = n_B_debuf[1]),
      (c.B_debuf2.checked = n_B_debuf[2]),
      (c.B_debuf3.checked = n_B_debuf[3]),
      (c.B_debuf4.checked = n_B_debuf[4]),
      (c.B_debuf5.checked = n_B_debuf[5]),
      (c.B_debuf6.checked = n_B_debuf[6]),
      (c.B_debuf7.checked = n_B_debuf[7]),
      (c.B_debuf8.checked = n_B_debuf[8]),
      (c.B_debuf9.checked = n_B_debuf[9]),
      (c.B_debuf10.checked = n_B_debuf[10]),
      (c.B_debuf11.value = n_B_debuf[11]),
      (c.B_debuf12.value = n_B_debuf[12]),
      (c.B_debuf17.checked = n_B_debuf[17]),
      (c.B_debuf18.value = n_B_debuf[18]),
      (c.B_debuf19.checked = n_B_debuf[19]),
      (c.B_debuf20.checked = n_B_debuf[20]),
      PvP == 0 &&
        ((c.B_debuf13.checked = n_B_debuf[13]),
        (c.B_debuf14.checked = n_B_debuf[14]),
        (c.B_debuf15.checked = n_B_debuf[15]),
        (c.B_debuf16.checked = n_B_debuf[16]),
        (c.B_debuf21.checked = n_B_debuf[21]),
        (c.B_debuf22.checked = n_B_debuf[22]),
        (c.B_debuf23.value = n_B_debuf[23])),
      (c.B_debuf24.value = n_B_debuf[24]));
  } else {
    var n;
    ((n =
      '<TR><TD id="AITD" class="subheader point" onClick="debufSW(1)" role="button" tabindex="0" aria-expanded="false">Debuffs on Enemy <span id="AIused"></span>'),
      myInnerHtml(
        "EnemyDebuf",
        (n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  AI(0);
}
function AI(e) {
  e == 1 && calc();
  for (var _ = 0, n = 0; n <= 24; n++)
    if (n_B_debuf[n] != 0) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("AITD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("AIused", _ == 0 ? "" : " [active]", 0));
}
function EnemyBufSW(e) {
  if (((n_BbufSW = e), n_BbufSW)) {
    for (
      n =
        '<TR><TD id="AKTD" colspan="4" class="subheader point" onClick="EnemyBufSW(0)" role="button" tabindex="0" aria-expanded="true">Buffs on Enemy <span id="AKused"></span>',
        n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>',
        n +=
          '<TR><TD class="center">Increase AGI</TD><TD id="ID_Kb0" class="data"></TD><TD class="center">Assumptio</TD><TD id="ID_Kb1"></TD></TR>',
        n +=
          '<TR><TD class="center">Angelus</TD><TD id="ID_Kb10" class="data"></TD><TD class="center">Maximize Power</TD><TD id="ID_Kb3"></TD></TR>',
        n +=
          '<TR><TD class="center">' +
          skillName(157) +
          '</TD><TD id="ID_Kb11" class="data"></TD><TD class="center">Adrenaline Rush</TD><TD id="ID_Kb2"></TD></TR>',
        n +=
          '<TR><TD class="center">Shield Reflect</TD><TD id="ID_Kb12" class="data"></TD><TD class="center">' +
          skillName(165) +
          '</TD><TD id="ID_Kb13"></TD></TR>',
        n +=
          '<TR><TD class="center dotB">Energy Coat</TD><TD id="ID_Kb14" class="dotB" colspan="3"></TD></TR>',
        n += '<TR><TD class="center" colspan="4"><b>Monster Exclusive buffs</b></TD></TR>',
        n +=
          '<TR><TD class="center">Attrib. Change</TD><TD id="ID_Kb6" class="data"></TD><TD class="center">Stone Skin</TD><TD id="ID_Kb7"></TD></TR>',
        n +=
          '<TR><TD class="center">Keeping</TD><TD id="ID_Kb9" class="data"></TD><TD class="center">Anti-Magic</TD><TD id="ID_Kb8"></TD></TR>',
        n +=
          '<TR><TD class="center">Agi Up (Flee Up)</TD><TD id="ID_Kb5" class="data"></TD><TD class="center"></TD><TD id="ID_Kb15"></TD></TR>',
        myInnerHtml(
          "EnemyBuf",
          (n +=
            '<TR><TD class="center" colspan="2">POWER UP (ATK x3, HIT x2)</TD><TD id="ID_Kb4" colspan="2"></TD></TR>'),
          0,
        ),
        myInnerHtml("ID_Kb0", '<select name="B_buf0" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb1", '<input type="checkbox" name="B_buf1" onClick="AK(1)">', 0),
        myInnerHtml("ID_Kb2", '<input type="checkbox" name="B_buf2" onClick="AK(1)">', 0),
        myInnerHtml("ID_Kb3", '<input type="checkbox" name="B_buf3" onClick="AK(1)">', 0),
        myInnerHtml("ID_Kb10", '<select name="B_buff10" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb11", '<select name="B_buff11" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb12", '<select name="B_buff12" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb13", '<select name="B_buff13" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb14", '<select name="B_buff14" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb4", '<input type="checkbox" name="B_buf4" onClick="AK(1)">', 0),
        myInnerHtml("ID_Kb5", '<select name="B_buf5" onChange="AK(1)"></select>', 0),
        myInnerHtml(
          "ID_Kb6",
          '<select name="B_buf6" onChange="AK(1)||debufSW(n_debufSW)"></select>',
          0,
        ),
        myInnerHtml("ID_Kb7", '<select name="B_buf7" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb8", '<select name="B_buf8" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb9", '<input type="checkbox" name="B_buf9" onClick="AK(1)">', 0),
        i = 0;
      i <= 10;
      i++
    )
      ((c.B_buf0.options[i] = new documento.Opzione(i, i)),
        (c.B_buff10.options[i] = new documento.Opzione(i, i)),
        (c.B_buff11.options[i] = new documento.Opzione(i, i)),
        (c.B_buff12.options[i] = new documento.Opzione(i, i)));
    for (i = 0; i <= 5; i++)
      ((c.B_buf5.options[i] = new documento.Opzione(i, i)),
        (c.B_buf7.options[i] = new documento.Opzione(i, i)),
        (c.B_buf8.options[i] = new documento.Opzione(i, i)),
        (c.B_buff13.options[i] = new documento.Opzione(i, i)),
        (c.B_buff14.options[i] = new documento.Opzione(v_EnergyCoat[i], i)));
    var _ = [
      [
        "(none)",
        "Neutral 1",
        "Neutral 2",
        "Neutral 3",
        "Neutral 4",
        "Water 1",
        "Water 2",
        "Water 3",
        "Water 4",
        "Earth 1",
        "Earth 2",
        "Earth 3",
        "Earth 4",
        "Fire 1",
        "Fire 2",
        "Fire 3",
        "Fire 4",
        "Wind 1",
        "Wind 2",
        "Wind 3",
        "Wind 4",
        "Poison 1",
        "Poison 2",
        "Poison 3",
        "Poison 4",
        "Holy 1",
        "Holy 2",
        "Holy 3",
        "Holy 4",
        "Shadow 1",
        "Shadow 2",
        "Shadow 3",
        "Shadow 4",
        "Ghost 1",
        "Ghost 2",
        "Ghost 3",
        "Ghost 4",
        "Undead 1",
        "Undead 2",
        "Undead 3",
        "Undead 4",
      ],
      [
        0, 1, 2, 3, 4, 11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44, 51, 52, 53,
        54, 61, 62, 63, 64, 71, 72, 73, 74, 81, 82, 83, 84, 91, 92, 93, 94,
      ],
    ];
    for (i = 0; i <= 40; i++) c.B_buf6.options[i] = new documento.Opzione(_[0][i], _[1][i]);
    ((c.B_buf0.value = n_B_buf[0]),
      (c.B_buf1.checked = n_B_buf[1]),
      (c.B_buf2.checked = n_B_buf[2]),
      (c.B_buf3.checked = n_B_buf[3]),
      (c.B_buf4.checked = n_B_buf[4]),
      (c.B_buf5.value = n_B_buf[5]),
      (c.B_buf6.value = n_B_buf[6]),
      (c.B_buf7.value = n_B_buf[7]),
      (c.B_buf8.value = n_B_buf[8]),
      (c.B_buf9.checked = n_B_buf[9]),
      (c.B_buff10.value = n_B_buf[10]),
      (c.B_buff11.value = n_B_buf[11]),
      (c.B_buff12.value = n_B_buf[12]),
      (c.B_buff13.value = n_B_buf[13]),
      (c.B_buff14.value = n_B_buf[14]));
  } else {
    var n;
    ((n =
      '<TR><TD id="AKTD" class="subheader point" onClick="EnemyBufSW(1)" role="button" tabindex="0" aria-expanded="false">Buffs on Enemy <span id="AKused"></span>'),
      myInnerHtml(
        "EnemyBuf",
        (n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  AK(0);
}
function AK(e) {
  e == 1 && calc();
  for (var _ = 0, n = 0; n <= 14; n++)
    if (n_B_buf[n] != 0) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("AKTD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("AKused", _ == 0 ? "" : " [active]", 0));
}
function canApplyUaroMeltdownDebuff(e) {
  return PvP == 0 && SkillSearch(SKILLID.MELTDOWN) && !isMvpMonster(e);
}
function ClickB_Enemy() {
  for (targetData = new Array(), n_B2 = new Array(), i = 0; i <= 22; i++)
    ((targetData[i] = m_Monster[c.B_Enemy.value][i]), (n_B2[i] = targetData[i]));
  (targetData[0] == 586 ? (PvP = 1) : (PvP = 0),
    (targetData[6] += n_B_manual[30]),
    (targetData[6] += Math.floor((targetData[6] * n_B_manual[31]) / 100)),
    (targetData[7] += n_B_manual[49]),
    (targetData[8] += n_B_manual[48]),
    (targetData[9] += n_B_manual[50]),
    (targetData[10] += n_B_manual[51]),
    (targetData[11] += n_B_manual[52]),
    (targetData[12] += n_B_manual[40]),
    (targetData[12] += Math.floor((targetData[12] * n_B_manual[53]) / 100)),
    (targetData[13] += n_B_manual[40]),
    (targetData[13] += Math.floor((targetData[13] * n_B_manual[53]) / 100)),
    (targetData[14] += n_B_manual[34]),
    (targetData[15] += n_B_manual[35]),
    targetData[0] == 586
      ? ((targetData[23] = Math.floor(0.5 * targetData[7]) + Math.floor(0.3 * targetData[7])),
        (targetData[24] =
          Math.floor(0.5 * targetData[7]) + Math.floor((targetData[7] * targetData[7]) / 150) - 1),
        targetData[23] > targetData[24] && (targetData[24] = targetData[23]))
      : ((n_B2[23] = targetData[7]),
        (n_B2[24] =
          targetData[7] + (Math.floor(targetData[7] / 20) * Math.floor(targetData[7] / 20) - 1)),
        n_B2[23] > n_B2[24] && (n_B2[24] = n_B2[23])),
    myInnerHtml("B_6", targetData[6], 0),
    myInnerHtml("B_16", targetData[16], 0),
    myInnerHtml("B_12", targetData[12], 0),
    myInnerHtml("B_13", targetData[13], 0),
    myInnerHtml("B_17", targetData[17], 0),
    myInnerHtml("B_14", targetData[14], 0),
    myInnerHtml("B_23", targetData[23], 0),
    myInnerHtml("B_15", targetData[15], 0),
    myInnerHtml("B_vit", targetData[7], 0),
    myInnerHtml("B_agi", targetData[8], 0),
    myInnerHtml("B_int", targetData[9], 0),
    myInnerHtml("B_dex", targetData[10], 0),
    myInnerHtml("B_luk", targetData[11], 0),
    PvP
      ? ((targetData[23] = Math.floor(0.5 * targetData[7]) + Math.floor(0.3 * targetData[7])),
        (targetData[24] =
          Math.floor(0.5 * targetData[7]) + Math.floor((targetData[7] * targetData[7]) / 150) - 1),
        targetData[23] > targetData[24] && (targetData[24] = targetData[23]))
      : ((n_B2[23] = targetData[7]),
        (n_B2[24] =
          targetData[7] + (Math.floor(targetData[7] / 20) * Math.floor(targetData[7] / 20) - 1)),
        n_B2[23] > n_B2[24] && (n_B2[24] = n_B2[23])),
    (n_B2[25] = Math.floor(targetData[7] / 2) + targetData[9]),
    (n_B2[26] = targetData[5] + targetData[10]),
    (n_B2[27] = targetData[5] + targetData[8]),
    n_debufSW &&
      ((n_B_debuf[0] = 1 * c.B_debuf0.value),
      (n_B_debuf[1] = 1 * c.B_debuf1.value),
      (n_B_debuf[2] = c.B_debuf2.checked),
      (n_B_debuf[3] = c.B_debuf3.checked),
      (n_B_debuf[4] = c.B_debuf4.checked),
      (n_B_debuf[5] = c.B_debuf5.checked),
      (n_B_debuf[6] = c.B_debuf6.checked),
      (n_B_debuf[7] = c.B_debuf7.checked),
      (n_B_debuf[8] = c.B_debuf8.checked),
      (n_B_debuf[9] = c.B_debuf9.checked),
      (n_B_debuf[10] = c.B_debuf10.checked),
      (n_B_debuf[11] = 1 * c.B_debuf11.value),
      (n_B_debuf[12] = 1 * c.B_debuf12.value),
      (n_B_debuf[17] = c.B_debuf17.checked),
      (n_B_debuf[18] = 1 * c.B_debuf18.value),
      (n_B_debuf[19] = c.B_debuf19.checked),
      (n_B_debuf[20] = c.B_debuf20.checked),
      (n_B_debuf[24] = 1 * c.B_debuf24.value),
      PvP == 0 &&
        ((n_B_debuf[13] = c.B_debuf13.checked),
        (n_B_debuf[14] = c.B_debuf14.checked),
        (n_B_debuf[15] = c.B_debuf15.checked),
        (n_B_debuf[16] = c.B_debuf16.checked),
        (n_B_debuf[21] = c.B_debuf21.checked),
        (n_B_debuf[22] = c.B_debuf22.checked),
        (n_B_debuf[23] = 1 * c.B_debuf23.value)),
      debufSW(n_debufSW)),
    n_BbufSW &&
      ((n_B_buf[0] = 1 * c.B_buf0.value),
      (n_B_buf[1] = c.B_buf1.checked),
      (n_B_buf[2] = c.B_buf2.checked),
      (n_B_buf[3] = c.B_buf3.checked),
      (n_B_buf[4] = c.B_buf4.checked),
      (n_B_buf[5] = 1 * c.B_buf5.value),
      (n_B_buf[6] = 1 * c.B_buf6.value),
      (n_B_buf[7] = 1 * c.B_buf7.value),
      (n_B_buf[8] = 1 * c.B_buf8.value),
      (n_B_buf[9] = c.B_buf9.checked),
      (n_B_buf[10] = 1 * c.B_buff10.value),
      (n_B_buf[11] = 1 * c.B_buff11.value),
      (n_B_buf[12] = 1 * c.B_buff12.value),
      (n_B_buf[13] = 1 * c.B_buff13.value),
      (n_B_buf[14] = 1 * c.B_buff14.value)),
    n_B_buf[6] && (targetData[3] = n_B_buf[6]));
  var e = canApplyUaroMeltdownDebuff(targetData);
  (n_B_debuf[23] && (targetData[3] = 10 * n_B_debuf[23] + (targetData[3] % 10)),
    targetData[19] == 0 && targetData[3] < 90 && n_B_debuf[4] && (targetData[3] = 11),
    targetData[19] == 0 && targetData[3] < 90 && n_B_debuf[9] && (targetData[3] = 21),
    n_B_buf[3] && (targetData[12] = targetData[13]),
    targetData[19] == 0 &&
      n_B_debuf[10] &&
      ((targetData[12] -= Math.floor((25 * targetData[12]) / 100)),
      (targetData[13] -= Math.floor((25 * targetData[13]) / 100))));
  var _,
    n = 0;
  (targetData[19] == 0 && n_B_debuf[0] != 0 && targetData[3] < 90 && (n += 2 + 3 * n_B_debuf[0]),
    PvP == 0 && n_B_debuf[22] && (n += 300),
    n_B_buf[4] && (n += 200),
    (targetData[12] += Math.floor((targetData[12] * n) / 100)),
    (targetData[13] += Math.floor((targetData[13] * n) / 100)),
    n_B_debuf[13] &&
      PvP == 0 &&
      ((targetData[12] -= Math.floor((25 * targetData[12]) / 100)),
      (targetData[13] -= Math.floor((25 * targetData[13]) / 100))),
    e &&
      ((targetData[12] -= Math.floor((35 * targetData[12]) / 100)),
      (targetData[13] -= Math.floor((35 * targetData[13]) / 100))),
    n_B_buf[0] && (targetData[8] += 2 + n_B_buf[0]),
    n_B_debuf[1] &&
      (PvP
        ? ((_ = 5 * n_B_debuf[1]), (o = Math.floor(targetData[8] / 4)))
        : ((_ = 10 * n_B_debuf[1]), (o = Math.floor(targetData[8] / 2))),
      (targetData[8] -= o > _ ? _ : o)),
    targetData[19] == 0 &&
      n_B_debuf[11] &&
      ((targetData[8] -= n_B_debuf[11] + 2), targetData[8] < 0 && (targetData[8] = 0)),
    n_B_debuf[1] &&
      (PvP
        ? ((_ = 5 * n_B_debuf[1]), (o = Math.floor(targetData[10] / 4)))
        : ((_ = 10 * n_B_debuf[1]), (o = Math.floor(targetData[10] / 2))),
      (targetData[10] -= o > _ ? _ : o)),
    targetData[19] == 0 &&
      n_B_debuf[5] &&
      (targetData[2] == 6 || targetData[3] >= 90) &&
      (targetData[10] = targetData[10] - Math.floor(targetData[10] / 2)),
    n_B_debuf[15] && PvP == 0 && (targetData[7] -= Math.floor((40 * targetData[7]) / 100)),
    targetData[19] == 0 &&
      n_B_debuf[5] &&
      (targetData[2] == 6 || targetData[3] >= 90) &&
      (targetData[9] = targetData[9] - Math.floor(targetData[9] / 2)),
    n_B_debuf[16] && PvP == 0 && (targetData[9] -= Math.floor((40 * targetData[9]) / 100)),
    targetData[19] == 0 && n_B_debuf[10] && (targetData[11] = 0),
    PvP == 0 &&
      ((targetData[23] = targetData[7]),
      (targetData[24] =
        targetData[7] + (Math.floor(targetData[7] / 20) * Math.floor(targetData[7] / 20) - 1)),
      targetData[23] > targetData[24] && (targetData[24] = targetData[23])),
    (o = n_B_buf[10]) &&
      ((targetData[23] = Math.floor(targetData[23] * (1 + 0.05 * o))),
      (targetData[24] = Math.floor(targetData[24] * (1 + 0.05 * o)))),
    (targetData[25] = Math.floor(targetData[7] / 2) + targetData[9]),
    (targetData[26] = targetData[5] + targetData[10]),
    (targetData[27] = targetData[5] + targetData[8]));
  var a = 0;
  (targetData[19] == 0 && n_B_debuf[0] != 0 && targetData[3] < 90 && (a += 5 + 5 * n_B_debuf[0]),
    PvP == 0 && n_B_debuf[22] && (a += 50),
    PvP == 0 && n_B_debuf[24] && (a += 5 * n_B_debuf[24]),
    a > 100 && (a = 100),
    PvP == 0 && (targetData[14] -= Math.floor((targetData[14] * a) / 100)),
    targetData[19] == 0 &&
      n_B_debuf[2] &&
      (targetData[14] -= Math.floor((25 * targetData[14]) / 100)));
  var o = 0;
  if (
    ((o += bonusValues[290]),
    targetData[19] == 0 && (o += bonusValues[291]),
    targetData[19] == 1 && (o += bonusValues[292]),
    (o += bonusValues[300 + targetData[2]]),
    (SKILLID.GRAND_CROSS != baseSkillId(n_A_ActiveSkill) &&
      SKILLID.OCCULT_IMPACTION != n_A_ActiveSkill) ||
      (o = 0),
    o && (o < 0 && (o = 0), (targetData[14] -= Math.floor((targetData[14] * o) / 100))),
    n_B_debuf[14] && PvP == 0 && (targetData[14] -= Math.floor((15 * targetData[14]) / 100)),
    targetData[19] == 0 &&
      n_B_debuf[4] &&
      targetData[3] < 90 &&
      (targetData[14] -= Math.floor((50 * targetData[14]) / 100)),
    targetData[19] == 0 &&
      n_B_debuf[9] &&
      targetData[3] < 90 &&
      (targetData[14] -= Math.floor((50 * targetData[14]) / 100)),
    n_B_buf[9] && ((targetData[14] = 90), (targetData[15] *= 2)),
    n_B_debuf[12] &&
      (targetData[2] == 6 || targetData[3] >= 90) &&
      (targetData[14] -= Math.floor((targetData[14] * (10 + 4 * n_B_debuf[12])) / 100)),
    n_B_debuf[20] && PvP == 0 && (targetData[14] = 0),
    e && (targetData[14] -= Math.floor((35 * targetData[14]) / 100)),
    (targetData[23] -= Math.floor((targetData[23] * a) / 100)),
    (targetData[24] -= Math.floor((targetData[24] * a) / 100)),
    targetData[19] == 0 &&
      n_B_debuf[2] &&
      ((targetData[23] -= Math.floor((25 * targetData[23]) / 100)),
      (targetData[24] -= Math.floor((25 * targetData[24]) / 100))),
    targetData[19] == 0 &&
      n_B_debuf[4] &&
      targetData[3] < 90 &&
      ((targetData[23] -= Math.floor((50 * targetData[23]) / 100)),
      (targetData[24] -= Math.floor((50 * targetData[24]) / 100))),
    targetData[19] == 0 &&
      n_B_debuf[9] &&
      targetData[3] < 90 &&
      ((targetData[23] -= Math.floor((50 * targetData[23]) / 100)),
      (targetData[24] -= Math.floor((50 * targetData[24]) / 100))),
    PvP == 0 && n_B_debuf[21] && (targetData[24] += 90),
    n_B_debuf[20] && ((targetData[23] = 0), (targetData[24] = 0)),
    e &&
      ((targetData[23] -= Math.floor((35 * targetData[23]) / 100)),
      (targetData[24] -= Math.floor((35 * targetData[24]) / 100))),
    (o = 0),
    (o += bonusValues[295]),
    (o += bonusValues[310 + targetData[2]]) &&
      (o < 0 && (o = 0), (targetData[15] -= Math.floor((targetData[15] * o) / 100))),
    targetData[19] == 0 &&
      n_B_debuf[4] &&
      targetData[3] < 90 &&
      (targetData[15] += Math.floor((25 * targetData[15]) / 100)),
    targetData[19] == 0 &&
      n_B_debuf[9] &&
      targetData[3] < 90 &&
      (targetData[15] += Math.floor((25 * targetData[15]) / 100)),
    targetData[19] == 0 &&
      n_B_debuf[18] &&
      targetData[3] < 90 &&
      (targetData[25] -= Math.floor((targetData[25] * (12 * n_B_debuf[18])) / 100)),
    PvP == 0 && n_B_debuf[21] && (targetData[25] = 90),
    (targetData[26] += n_B_manual[36]),
    targetData[19] == 0 &&
      n_B_debuf[3] &&
      ((targetData[26] -= 25), targetData[26] < 1 && (targetData[26] = 1)),
    (!targetData[20] && c.B_AtkRange.value != 2) ||
      c.B_AtkRange.value == 1 ||
      (n_A_Buf6[3] && ((targetData[26] -= 50), targetData[26] < 1 && (targetData[26] = 1))),
    n_B_buf[4] && (targetData[26] = 2 * targetData[26]),
    (targetData[27] += n_B_manual[37]),
    targetData[19] == 0 &&
      n_B_debuf[3] &&
      (targetData[27] -= Math.floor((25 * targetData[27]) / 100)),
    n_B_buf[5] != 0 && (targetData[27] = Math.floor(targetData[27] * (1 + 0.2 * n_B_buf[5]))),
    n_B_debuf[17] && ((targetData[27] -= 50), targetData[27] < 0 && (targetData[27] = 0)),
    targetData[19] == 0 && n_B_debuf[4] && targetData[3] < 90 && (targetData[27] = -19),
    targetData[19] == 0 && n_B_debuf[9] && targetData[3] < 90 && (targetData[27] = -19),
    targetData[19] == 0 && (n_B_debuf[7] || n_B_debuf[8]) && (targetData[27] = -19),
    PvP == 0)
  ) {
    var t = 100;
    ((t += StPlusCard(120 + targetData[2])), (t += StPlusCalc2(120 + targetData[2])));
    var A = 0;
    ((t +=
      5 *
      (EquipNumSearch(EQUIPID.AUMDURAS_BENEFIT_B) + EquipNumSearch(EQUIPID.AUMDURAS_BENEFIT_C))),
      n_A_JobClass() != 3 ||
        !CardNumSearch(452) ||
        (targetData[2] != 1 && targetData[2] != 6) ||
        (t += 5),
      targetData[2] == 2 && n_A_JobClass() == 4 && CardNumSearch(453) && (t += 5),
      n_A_Buf8[1] && (t += 25 * n_A_Buf8[1]),
      n_A_Buf8[2] && (A += 50),
      n_A_Buf6[2] && (t += 100),
      (c.A8_Skill14.value == 3 || n_A_Buf6[2]) && ((t *= 2), (A *= 2)),
      (t == 0 && A == 0) ||
        ((targetData[16] = Math.floor((targetData[16] * t) / 100)),
        (targetData[17] = Math.floor((targetData[17] * (t + A)) / 100))),
      n_A_Buf8[5] &&
        ((targetData[16] = Math.floor(targetData[16] / (1 + n_A_Buf8[5]) + 1)),
        (targetData[17] = Math.floor(targetData[17] / (1 + n_A_Buf8[5]) + 1))),
      n_A_Buf8[6] &&
        ((targetData[16] = Math.floor((targetData[16] * (100 + 25 * n_A_Buf8[6])) / 100)),
        (targetData[17] = Math.floor((targetData[17] * (100 + 25 * n_A_Buf8[6])) / 100))),
      SkillSearch(SKILLID.SLS_BLESSINGS) &&
        ((targetData[16] = Math.floor(
          (targetData[16] * (100 + 10 * SkillSearch(SKILLID.SLS_BLESSINGS))) / 100,
        )),
        (targetData[17] = Math.floor(
          (targetData[17] * (100 + 10 * SkillSearch(SKILLID.SLS_BLESSINGS))) / 100,
        ))),
      n_A_Buf8[7] && (targetData[17] = Math.floor(targetData[17] * (1 + n_A_Buf8[7]))),
      n_A_Buf8[3] && (targetData[16] = Math.floor(targetData[16] * (1 + n_A_Buf8[3]))),
      targetData[19] == 0 &&
        n_A_Buf3[8] &&
        ((targetData[16] = Math.floor((targetData[16] * (125 + 11 * n_A_Buf3[8])) / 100)),
        (targetData[17] = Math.floor((targetData[17] * (125 + 11 * n_A_Buf3[8])) / 100))));
  }
  ((targetData[21] = targetData[27] + 20),
    (targetData[22] = targetData[26] + 75),
    myInnerHtml("B_AA", " + ", 0),
    myInnerHtml("B_AB", " + ", 0));
  var s = [6, 12, 13, 21, 22, 14, 15, 23, 25],
    u = [16, 17],
    I = "<B style='color:blue'>",
    D = "<B style='color:red'>",
    f = "</B>";
  for (i = 0; i <= 8; i++) {
    var r = targetData[s[i]];
    (targetData[s[i]] < n_B2[s[i]] && (r = I + targetData[s[i]] + f),
      targetData[s[i]] > n_B2[s[i]] && (r = D + targetData[s[i]] + f),
      myInnerHtml("B_" + s[i], r, 0));
  }
  if (PvP == 0)
    for (i = 0; i <= 1; i++)
      ((r = targetData[u[i]]),
        targetData[u[i]] < n_B2[u[i]] && (r = D + targetData[u[i]] + f),
        targetData[u[i]] > n_B2[u[i]] && (r = I + targetData[u[i]] + f),
        myInnerHtml("B_" + u[i], r, 0));
  (myInnerHtml("B_2", v_Race[targetData[2]], 0),
    (o = Math.floor(targetData[3] / 10)),
    targetData[3] != n_B2[3]
      ? myInnerHtml("B_3", "<b>" + D + (v_Element[o] + (targetData[3] % 10)) + f + "</b>", 0)
      : myInnerHtml("B_3", "<b>" + (v_Element[o] + (targetData[3] % 10)) + "</b>", 0),
    myInnerHtml("B_4", v_Size[targetData[4]], 0),
    myInnerHtml("B_type", v_Type[targetData[19]], 0),
    (targetData[27] += n_B_manual[37]),
    c.A8_Skill14.value == 1 ? (n_WoE = 1) : (n_WoE = 0),
    n_WoE && (targetData[27] = Math.floor(0.8 * targetData[27])),
    (n_B_DEF2 = [0, 0, 0]),
    (n_B_DEF2[2] = targetData[23]),
    (n_B_DEF2[0] = targetData[24]),
    (n_B_DEF2[1] = Math.floor((n_B_DEF2[2] + n_B_DEF2[0]) / 2)),
    (n_B_MDEF2 = targetData[25]),
    (n_B_HIT = targetData[26]),
    (n_B_FLEE = targetData[27]));
}
function calc() {
  for (var e = 0; e <= 2; e++) InnStr[e] = "";
  (StAllCalc(), (wCSize = m_WeaponSize[n_A_WeaponType][targetData[4]]));
  var _ = c.A_ActiveSkill.value,
    n = WeaponNameShort[n_A_WeaponType] + " vs " + v_Size[targetData[4]],
    a = 0;
  ((_ != 158 && _ != 159 && _ != 384 && _ != 324) || ((n = "Shield"), (wCSize = 1), (a = 1)),
    SkillSearch(SKILLID.CAVALIER_MASTERY) &&
      ((n_A_WeaponType != 4 && n_A_WeaponType != 5) ||
        targetData[4] != 1 ||
        ((n = skillName(78)), (wCSize = 1), _ == 0 && (a = 1))),
    (SkillSearch(SKILLID.WEAPON_PERFECTION) || n_A_Buf2[7]) &&
      ((n = "Weapon Perfection"), (wCSize = 1), _ == 0 && (a = 1)),
    CardNumSearch(32) && ((n = "Drake Card"), (wCSize = 1), (a = 1)),
    bonusValues[BONUSID.WEAPON_SIZE_PENALTY] &&
      ((n = "Weapon Size Penalty Nullified"), (wCSize = 1), _ == 0 && (a = 1)),
    _ == 259 &&
      ((n = skillName(259) + " vs " + v_Size[targetData[4]]),
      (wCSize = 1.25 - 0.25 * targetData[4]),
      (a = 1)),
    m_Skill[n_A_ActiveSkill][4] < 0 && (a = 0),
    a || _ == 0
      ? (myInnerHtml("nm076", "Weapon/Skill Size Modifier", 0),
        myInnerHtml(
          "A_WeaponSize",
          100 * wCSize + '% <span style="font-weight:100;">(' + n + ")</span>",
          0,
        ))
      : (myInnerHtml("nm076", "", 0), myInnerHtml("A_WeaponSize", "", 0)),
    (w_HIT = n_A_HIT + 80 - n_B_FLEE),
    (w_HIT_EDP = w_HIT),
    w_HIT_EDP > 100 && (w_HIT_EDP = 100),
    w_HIT_EDP < 5 && (w_HIT_EDP = 5),
    SkillSearch(SKILLID.WEAPONRY_RESEARCH) &&
      (w_HIT = Math.floor((w_HIT * (100 + 2 * SkillSearch(SKILLID.WEAPONRY_RESEARCH))) / 100)),
    (SKILLID.PIERCE != n_A_ActiveSkill && SKILLID.BASH != n_A_ActiveSkill) ||
      (w_HIT *= 1 + 0.05 * n_A_ActiveSkillLV),
    (SKILLID.SONIC_BLOW != n_A_ActiveSkill && SKILLID.SONIC_BLOW_SOUL_LINKED != n_A_ActiveSkill) ||
      !SkillSearch(SKILLID.SONIC_ACCELERATION) ||
      (w_HIT *= 1.5),
    SKILLID.MAGNUM_BREAK == n_A_ActiveSkill && (w_HIT *= 1 + 0.1 * n_A_ActiveSkillLV),
    SKILLID.FOCUSED_ARROW_STRIKE == n_A_ActiveSkill && (w_HIT *= 1 + 0.1 * n_A_ActiveSkillLV),
    SKILLID.COUNTER_KICK == n_A_ActiveSkill && (w_HIT = 100),
    SKILLID.RAPID_SMITING == n_A_ActiveSkill && (w_HIT += 20),
    SKILLID.SHIELD_BOOMERANG_SOUL_LINKED == n_A_ActiveSkill && (w_HIT = 100),
    SkillSearch(SKILLID.SLS_UNION) && (w_HIT = 100),
    w_HIT > 100 ? (w_HIT = 100) : w_HIT < 5 && (w_HIT = 5),
    bonusValues[86] && (w_HIT += ((100 - w_HIT) * bonusValues[86]) / 100),
    (w_HIT = Math.floor(100 * w_HIT) / 100),
    (w_HIT_HYOUJI = w_HIT),
    SKILLID.FOCUSED_ARROW_STRIKE == n_A_ActiveSkill && (n_A_CRI += 20),
    SKILLID.SHADOW_SLASH == n_A_ActiveSkill && (n_A_CRI += 25 + 5 * n_A_ActiveSkillLV),
    (w_Cri = n_A_CRI - 0.2 * targetData[11] + 0.1),
    n_B_debuf[8] && (w_Cri *= 2),
    w_Cri < 0 ? (w_Cri = 0) : w_Cri > 100 && (w_Cri = 100),
    (TyouEnkakuSousa3dan = 0),
    (wBC3_3danHatudouRitu = 0),
    SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW) &&
      ((wBC3_3danHatudouRitu = 30 - SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW)),
      SkillSearch(SKILLID.SLS_TEAM_UP) &&
        (wBC3_3danHatudouRitu *= 1.5 + 0.5 * SkillSearch(SKILLID.SLS_TEAM_UP))),
    (wDA = 5 * SkillSearch(SKILLID.DOUBLE_ATTACK)),
    n_A_WeaponType != 1 && (wDA = 0),
    CardNumSearch(43) &&
      (SkillSearch(SKILLID.DOUBLE_ATTACK) > 1
        ? (wDA = 5 * SkillSearch(SKILLID.DOUBLE_ATTACK))
        : (wDA = 5)),
    n_A_WeaponType != 0 &&
      ((EquipNumSearch(EQUIPID.BABY_CHICK) ||
        EquipNumSearch(EQUIPID.BABY_CHICK_ARO) ||
        EquipNumSearch(EQUIPID.BABY_CHICK_IRO)) &&
        (SkillSearch(SKILLID.DOUBLE_ATTACK) > 2
          ? (wDA = 5 * SkillSearch(SKILLID.DOUBLE_ATTACK))
          : (wDA = 10)),
      EquipNumSearch(EQUIPID.WANDERERS_SAKKAT_PLUS_WANDERERS_COAT) &&
        ((wDA = 5 * SkillSearch(SKILLID.DOUBLE_ATTACK)),
        (n_A_SHOULDER_REFINE != 5 && n_A_SHOULDER_REFINE != 6) ||
          (SkillSearch(SKILLID.DOUBLE_ATTACK) < 1 && (wDA = 5)),
        n_A_SHOULDER_REFINE >= 7 && SkillSearch(SKILLID.DOUBLE_ATTACK) < 5 && (wDA = 25)),
      EquipNumSearch(EQUIPID.SNAKE_HEAD_HAT) &&
        (SkillSearch(SKILLID.DOUBLE_ATTACK) > 5
          ? (wDA = 5 * SkillSearch(SKILLID.DOUBLE_ATTACK))
          : (wDA = 25))),
    (EquipNumSearch(EQUIPID.NAGAN) || EquipNumSearch(EQUIPID.REFINED_NAGAN)) &&
      (SkillSearch(SKILLID.DOUBLE_ATTACK) > 5
        ? (wDA = 5 * SkillSearch(SKILLID.DOUBLE_ATTACK))
        : (wDA = 25)),
    n_A_WeaponType == 17 &&
      ((wDA = 5 * SkillSearch(SKILLID.CHAIN_ACTION)),
      CardNumSearch(43) &&
        (wDA =
          5 * SkillSearch(SKILLID.CHAIN_ACTION) +
          (5 * (100 - 5 * SkillSearch(SKILLID.CHAIN_ACTION))) / 100),
      (EquipNumSearch(EQUIPID.BABY_CHICK) ||
        EquipNumSearch(EQUIPID.BABY_CHICK_ARO) ||
        EquipNumSearch(EQUIPID.BABY_CHICK_IRO)) &&
        (wDA =
          5 * SkillSearch(SKILLID.CHAIN_ACTION) +
          (10 * (100 - 5 * SkillSearch(SKILLID.CHAIN_ACTION))) / 100)),
    (w_HIT_DA = w_HIT),
    wDA != 0 &&
      n_A_WeaponType != 17 &&
      ((w_HIT_DA = (w_HIT_DA * (100 + SkillSearch(SKILLID.DOUBLE_ATTACK))) / 100),
      w_HIT_DA >= 100 && (w_HIT_DA = 100)),
    (w998A = 100 - wBC3_3danHatudouRitu),
    (w998B = (wBC3_3danHatudouRitu * w_HIT) / 100),
    (w998C = wBC3_3danHatudouRitu - w998B),
    (w998D = (w998A * wDA) / 100),
    (w998E = (w998D * w_HIT_DA) / 100),
    (w998F = w998D - w998E),
    (critChance = ((100 - wBC3_3danHatudouRitu - w998D) * w_Cri) / 100),
    (w998H = 100 - wBC3_3danHatudouRitu - w998D - critChance),
    (w998I = (w998H * w_HIT) / 100),
    (w998J = w998H - w998I),
    (w998K = w998B + w998E + critChance + w998I),
    (w998L = 100 - w998K),
    (SKILLID.BASIC_ATTACK == n_A_ActiveSkill ||
      SKILLID.FOCUSED_ARROW_STRIKE == n_A_ActiveSkill ||
      SKILLID.SHADOW_SLASH == n_A_ActiveSkill ||
      (SKILLID.POISON_REACT == n_A_ActiveSkill && 50 <= targetData[3] && targetData[3] < 60)) &&
      ((w_HIT_HYOUJI = Math.floor(100 * w998K) / 100),
      myInnerHtml("CRInum", " (" + Math.round(100 * critChance) / 100 + "%)", 0)));
  var o;
  switch (((o = m_Monster[targetData[0]][2 * c.B_AtkSkill.selectedIndex + 22]), n_B_AtkSkill)) {
    case 477:
      n_B_HIT += 20;
      break;
    case 6:
      n_B_HIT *= 1 + 0.05 * o;
      break;
    case 7:
      n_B_HIT *= 1 + 0.1 * o;
      break;
    case 324:
      n_B_HIT += 20;
      break;
  }
  ((w_FLEE = n_A_FLEE + 20 - n_B_HIT),
    w_FLEE > 95 ? (w_FLEE = 95) : w_FLEE < 5 && (w_FLEE = 5),
    (n_B_AtkSkill != 444 &&
      n_B_AtkSkill != 445 &&
      n_B_AtkSkill != 475 &&
      n_B_AtkSkill != 476 &&
      n_B_AtkSkill != 481) ||
      ((w_FLEE = 0), (n_A_LUCKY = 0)));
  var t = w_FLEE;
  if (
    (n_A_Buf6[3] && n_B_rangedAtk != 0 && (w_FLEE = Math.max(75, w_FLEE)),
    n_B_AtkSkill != 0 && (n_A_LUCKY = 0),
    n_A_Buf6[3] && SKILLID.CLASHING_SPIRAL == n_B_AtkSkill)
  ) {
    w_FLEE = 75 + t / 4;
    var A = Math.floor(100 * w_FLEE);
  } else
    n_A_Buf6[3] && Math.abs(m_Skill[c.B_AtkSkill.value][4]) == 3
      ? ((w_FLEE = 75), (A = 7500))
      : m_Skill[c.B_AtkSkill.value][4] < 0
        ? ((w_FLEE = 0), (A = 0))
        : (A = Math.floor(100 * (w_FLEE + ((100 - w_FLEE) * n_A_LUCKY) / 100)));
  (A > 1e4 && (A = 1e4),
    A <= 0
      ? ((A = 0),
        myInnerHtml("nm066", "", 0),
        (documento.getElementById("B_Ave2Atk").style.visibility = "hidden"))
      : (myInnerHtml("nm066", "Average Dmg Received (w/dodge)", 0),
        (documento.getElementById("B_Ave2Atk").style.visibility = "visible")),
    myInnerHtml("BattleFLEE", A / 100, 0),
    (n_A_workDEX = Math.floor(n_A_DEX * (1 + 0.2 * (n_A_WeaponLV - 1)))));
  var s = n_A_Weapon_ATK,
    u = wImp,
    I = !n_A_Buf3[10] || (n_A_WeaponLV != 4 && n_A_Weapon2LV != 4) ? 0 : 50 + 25 * n_A_Buf3[10];
  ((s += u + I), (u = 0), (n_A_DMG = [0, 0, 0]));
  (n_A_workDEX >= s || SkillSearch(SKILLID.POWER_MAXIMIZE)
    ? (n_A_DMG[2] = n_A_ATK + n_A_WeaponLV_Maxplus + Math.floor((s + u) * wCSize))
    : (n_A_DMG[2] = n_A_ATK + n_A_WeaponLV_Maxplus + Math.floor((s - 1 + u) * wCSize)),
    (n_A_WeaponType != 10 &&
      n_A_WeaponType != 17 &&
      n_A_WeaponType != 18 &&
      n_A_WeaponType != 19 &&
      n_A_WeaponType != 20 &&
      n_A_WeaponType != 21) ||
      (n_A_DMG[2] += Math.floor((m_Arrow[n_A_Arrow][0] - 1) * wCSize)),
    (n_A_WeaponType != 10 &&
      n_A_WeaponType != 17 &&
      n_A_WeaponType != 18 &&
      n_A_WeaponType != 19 &&
      n_A_WeaponType != 20 &&
      n_A_WeaponType != 21) ||
      ((w1 =
        n_A_ATK +
        n_A_WeaponLV_Maxplus +
        Math.floor(((s * s) / 100) * wCSize) +
        Math.floor(u * wCSize)),
      (p =
        n_A_ATK +
        n_A_WeaponLV_Maxplus +
        Math.floor(((s * n_A_workDEX) / 100) * wCSize) +
        Math.floor(u * wCSize)),
      (S = Math.floor((m_Arrow[n_A_Arrow][0] - 1) * wCSize)),
      (w1 += S),
      (p += S),
      w1 > p && (w1 = p),
      n_A_DMG[2] < w1 && (n_A_DMG[2] = w1)),
    n_A_WeaponType == 10 ||
    n_A_WeaponType == 17 ||
    n_A_WeaponType == 18 ||
    n_A_WeaponType == 19 ||
    n_A_WeaponType == 20 ||
    n_A_WeaponType == 21
      ? ((n_A_DMG[0] = n_A_ATK + n_A_WeaponLV_Minplus + Math.floor(((s * s) / 100 + u) * wCSize)),
        (S = n_A_ATK + n_A_WeaponLV_Minplus + Math.floor(((s * n_A_workDEX) / 100 + u) * wCSize)),
        n_A_DMG[0] > S && (n_A_DMG[0] = S))
      : n_A_workDEX >= s
        ? (n_A_DMG[0] = n_A_ATK + n_A_WeaponLV_Minplus + Math.floor((s + u) * wCSize))
        : (SkillSearch(SKILLID.POWER_MAXIMIZE) && (n_A_workDEX = s),
          (n_A_DMG[0] = n_A_ATK + n_A_WeaponLV_Minplus + Math.floor((n_A_workDEX + u) * wCSize))));
  var D;
  if (
    ((n_A_DMG[1] = (n_A_DMG[0] + n_A_DMG[2]) / 2),
    (n_rangedAtk = 0),
    (n_A_CriATK = [0, 0, 0]),
    (n_A_CriATK[1] =
      n_A_ATK + (n_A_WeaponLV_Minplus + n_A_WeaponLV_Maxplus) / 2 + Math.floor((s + u) * wCSize)),
    (n_A_CriATK[0] = n_A_ATK + n_A_WeaponLV_Minplus + Math.floor((s + u) * wCSize)),
    (n_A_CriATK[2] = n_A_ATK + n_A_WeaponLV_Maxplus + Math.floor((s + u) * wCSize)),
    (n_A_WeaponType == 10 ||
      n_A_WeaponType == 17 ||
      n_A_WeaponType == 18 ||
      n_A_WeaponType == 19 ||
      n_A_WeaponType == 20 ||
      n_A_WeaponType == 21) &&
      ((n_rangedAtk = 1), n_A_WeaponType == 10))
  )
    for (e = 0; e <= 2; e++) n_A_CriATK[e] += Math.floor(m_Arrow[n_A_Arrow][0] * wCSize);
  ((BK_n_A_DMG = [0, 0, 0]),
    (BK_n_A_DMG[2] = n_A_DMG[2]),
    (BK_n_A_DMG[0] = n_A_DMG[0]),
    (BK_n_A_DMG[1] = n_A_DMG[1]));
  var f = ATKmod01Percent();
  ATKmod01(f);
  var r = 0;
  n_A_WeaponType == 10 &&
    (r =
      Math.floor(m_Arrow[n_A_Arrow][0] * wCSize) -
      Math.floor((m_Arrow[n_A_Arrow][0] - 1) * wCSize));
  var k = BK_n_A_DMG[2] - n_A_WeaponLV_Maxplus + r;
  for (
    BK_n_A_CriATK[0] = ((k + n_A_WeaponLV_Minplus) * f) / 100,
      BK_n_A_CriATK[1] = ((k + (n_A_WeaponLV_Minplus + n_A_WeaponLV_Maxplus) / 2) * f) / 100,
      BK_n_A_CriATK[2] = ((k + n_A_WeaponLV_Maxplus) * f) / 100,
      ATKmod02(1, 1),
      n_PerHIT_DMG = BattleCalc2(0),
      wCriTyuu = 1,
      n_A_CriATK[1] = BattleCalc(n_A_CriATK[1], 10),
      n_A_CriATK[0] = BattleCalc(n_A_CriATK[0], 10),
      n_A_CriATK[2] = BattleCalc(n_A_CriATK[2], 10),
      wCriTyuu = 0,
      n_A_EDP_DMG = [0, 0, 0],
      e = 0;
    e <= 2;
    e++
  )
    n_A_EDP_DMG[e] = BattleCalcEDP(n_A_DMG[e], e);
  for (e = 0; e <= 2; e++) n_A_CriATK[e] += EDP_DMG(e);
  var T = [0, 0, 0];
  if (n_A_WeaponType == 11) {
    for (e = 0; e <= 2; e++)
      ((T[e] = Math.floor(n_A_CriATK[e] * (0.01 + 0.02 * SkillSearch(SKILLID.DOUBLE_ATTACK)))),
        (n_A_CriATK[e] += T[e]));
    n_A_CriATK[0] == n_A_CriATK[2]
      ? myInnerHtml("CRIATK", n_A_CriATK[0] - T[0] + " + " + T[0], 0)
      : myInnerHtml(
          "CRIATK",
          n_A_CriATK[0] - T[0] + "~" + (n_A_CriATK[2] - T[2]) + " + " + T[0] + "~" + T[2],
          0,
        );
  } else
    n_Nitou
      ? ((n_A_CriATKleft = [0, 0, 0]),
        (n_A_CriATKleft[1] =
          n_A_ATK +
          (n_A_Weapon2LV_Minplus + n_A_Weapon2LV_Maxplus) / 2 +
          Math.floor((n_A_Weapon2_ATK + wImp) * wCSize)),
        (n_A_CriATKleft[0] =
          n_A_ATK + n_A_Weapon2LV_Minplus + Math.floor((n_A_Weapon2_ATK + wImp) * wCSize)),
        (n_A_CriATKleft[2] =
          n_A_ATK + n_A_Weapon2LV_Maxplus + Math.floor((n_A_Weapon2_ATK + wImp) * wCSize)),
        (n_A_CriATKleft[1] = BattleCalc(n_A_CriATKleft[1], 10)),
        (n_A_CriATKleft[0] = BattleCalc(n_A_CriATKleft[0], 10)),
        (n_A_CriATKleft[2] = BattleCalc(n_A_CriATKleft[2], 10)),
        n_A_CriATK[0] == n_A_CriATK[2] && n_A_CriATKleft[0] == n_A_CriATKleft[2]
          ? myInnerHtml("CRIATK", n_A_CriATK[0] + " + " + wLeft[2], 0)
          : myInnerHtml(
              "CRIATK",
              n_A_CriATK[0] + "~" + n_A_CriATK[2] + " + " + wLeft[1] + "~" + wLeft[2],
              0,
            ))
      : n_A_CriATK[0] == n_A_CriATK[2]
        ? myInnerHtml("CRIATK", n_A_CriATK[1], 0)
        : myInnerHtml("CRIATK", n_A_CriATK[0] + "~" + n_A_CriATK[2], 0);
  if (
    ((n_Max_DMG = 0),
    (n_Min_DMG = 9999999),
    (SKILLID.BASIC_ATTACK == n_A_ActiveSkill ||
      (SKILLID.POISON_REACT == n_A_ActiveSkill && 50 <= targetData[3] && targetData[3] < 60)) &&
      critChance > 0 &&
      ((n_Min_DMG = n_A_CriATK[0]), (n_Max_DMG = n_A_CriATK[2])),
    BattleCalc999(),
    SKILLID.COIN_FLING == n_A_ActiveSkill
      ? myInnerHtml("A_WeaponElement", "<b style='color:#A89682'>None</b> (100% vs any element)", 0)
      : myInnerHtml(
          "A_WeaponElement",
          v_Element[n_A_Weapon_element] +
            " (" +
            100 * element[targetData[3]][n_A_Weapon_element] +
            "% vs " +
            v_Element[Math.floor(targetData[3] / 10)] +
            (targetData[3] % 10) +
            ")",
          0,
        ),
    n_rangedAtk == 0)
  ) {
    var l = n_B_buf[12],
      d = n_B_manual[21];
    if (l > 0 && SKILLID.HIGH_SPEED_CART_RAM != n_A_ActiveSkill) {
      l = 10 + 3 * l;
      var S = 0,
        p = 1;
      n_B_buf[1] == 1 && (p = 1.5);
      var B = new Array();
      for (new Array(), e = 0; e <= 2; e++)
        ((B[e] = Math.floor((Last_DMG_A[e] * p * l) / 100)),
          (S = Math.ceil((Last_DMG_A[e] * p * l) / 100)) == 1 && (B[e] = 1));
      (myInnerHtml("bREFLECT1", '<B style="color:red">' + B[0] + " ~ " + B[2] + "</B>", 0),
        myInnerHtml(
          "bREFLECT1name",
          '<SPAN style="color:red">Damage reflected (Shield Reflect)</SPAN>',
          0,
        ));
    } else (myInnerHtml("bREFLECT1", "", 0), myInnerHtml("bREFLECT1name", "", 0));
    if (d) {
      ((S = 0), (p = 1));
      var m = 1;
      (n_B_buf[1] == 1 && (p = 1.5),
        n_WoE == 1 && (m = SKILLID.BASIC_ATTACK != n_A_ActiveSkill ? 100 / 60 : 1.25));
      var M = new Array();
      for (new Array(), e = 0; e <= 2; e++)
        ((M[e] = Math.floor((Last_DMG_B[e] * p * m * d) / 100)),
          (S = Math.ceil((Last_DMG_B[e] * p * l) / 100)) == 1 && (M[e] = 1));
      (myInnerHtml("bREFLECT2", '<B style="color:red">' + M[0] + " ~ " + M[2] + "</B>", 0),
        myInnerHtml(
          "bREFLECT2name",
          '<SPAN style="color:red">Damage reflected (equip/card)</SPAN>',
          0,
        ));
    } else (myInnerHtml("bREFLECT2", "", 0), myInnerHtml("bREFLECT2name", "", 0));
  } else (myInnerHtml("bREFLECT2", "", 0), myInnerHtml("bREFLECT2name", "", 0));
  for (e = 0; e < InnStr.length; e++) myInnerHtml("strID_" + e, InnStr[e], 0);
}
function BattleCalc(e, _) {
  return (
    (e = applyPreRenewalEnchantDeadlyPoison(e)),
    _ == 10 ? (e += n_A_WeaponLV_refineATK) : (e = BattleCalc4(e, _, 0)),
    e < 1 && (e = 1),
    (e += n_A_Buf9[25]),
    n_A_WeaponType == 1 || n_A_WeaponType == 2
      ? (e += 4 * SkillSearch(SKILLID.SWORD_MASTERY))
      : n_A_WeaponType == 3
        ? (e += 4 * SkillSearch(SKILLID.TWO_HAND_SWORD_MASTERY))
        : n_A_WeaponType == 4 || n_A_WeaponType == 5
          ? SkillSearch(SKILLID.CAVALIER_MASTERY) == 0
            ? (e += 4 * SkillSearch(SKILLID.SPEAR_MASTERY))
            : (e += 5 * SkillSearch(SKILLID.SPEAR_MASTERY))
          : n_A_WeaponType == 8
            ? (e += 3 * SkillSearch(SKILLID.MACE_MASTERY))
            : n_A_WeaponType == 11
              ? (e += 3 * SkillSearch(SKILLID.KATAR_MASTERY))
              : n_A_WeaponType == 14
                ? (e += 3 * SkillSearch(SKILLID.MUSIC_LESSONS))
                : n_A_WeaponType == 15
                  ? (e += 3 * SkillSearch(SKILLID.DANCE_LESSONS))
                  : n_A_WeaponType == 12
                    ? (e += 3 * SkillSearch(SKILLID.STUDY))
                    : n_A_WeaponType == 6 || n_A_WeaponType == 7
                      ? (e += 3 * SkillSearch(SKILLID.AXE_MASTERY))
                      : (n_A_WeaponType == 13 || n_A_WeaponType == 0) &&
                        (e += 3 * SkillSearch(SKILLID.IRON_FIST)),
    n_A_WeaponType == 0 &&
      SkillSearch(SKILLID.SPRINT_UNARMED_MASTERY) &&
      (e += 10 * SkillSearch(SKILLID.SPRINT_UNARMED_MASTERY)),
    n_A_Buf3[10] && (n_A_WeaponLV == 4 || n_A_Weapon2LV),
    (targetData[2] == 6 || (90 <= targetData[3] && targetData[3] <= 99)) &&
      SkillSearch(SKILLID.DEMON_BANE) &&
      (e += Math.floor((3 + 0.05 * n_A_BaseLV) * SkillSearch(SKILLID.DEMON_BANE))),
    (targetData[2] == 2 || targetData[2] == 4) &&
      ((e += 4 * SkillSearch(SKILLID.BEAST_BANE)),
      SkillSearch(SKILLID.HUNTER_SPIRIT) && (e += n_A_STR)),
    (e = BattleCalc2(e)),
    Math.floor(e)
  );
}
function BattleCalc2(e) {
  if (
    ((w999_AB = 0),
    e > 0 && (w999_AB = 1),
    (e += 2 * SkillSearch(SKILLID.WEAPONRY_RESEARCH)),
    wBCEDPch == 0 && (e = Math.floor(e * Math.max(0, element[targetData[3]][n_A_Weapon_element]))),
    n_A_WeaponType == 0 &&
      SkillSearch(SKILLID.SPRINT_UNARMED_MASTERY) &&
      (n_A_ActiveSkill == SKILLID.TORNADO_KICK ||
        n_A_ActiveSkill == SKILLID.HEEL_DROP ||
        n_A_ActiveSkill == SKILLID.ROUNDHOUSE ||
        n_A_ActiveSkill == SKILLID.COUNTER_KICK) &&
      (e += 10 * SkillSearch(SKILLID.SPRINT_UNARMED_MASTERY)),
    (e += 3 * n_A_Buf2[12]),
    (e += 3 * SkillSearch(SKILLID.COIN_FLIP)),
    n_A_WeaponType != 0 && w999_AB == 1 && (e += 20 * SkillSearch(SKILLID.AURA_BLADE)),
    wBCEDPch == 0 &&
      ((n_A_ActiveSkill == SKILLID.ENVENOM || n_A_ActiveSkill == SKILLID.PHANTASMIC_ARROW) &&
        (e += 15 * n_A_ActiveSkillLV),
      SKILLID.POISON_REACT == n_A_ActiveSkill &&
        (targetData[3] < 50 || 60 <= targetData[3]) &&
        (e += 75)),
    n_A_ActiveSkill == SKILLID.MAGICAL_BULLET &&
      (e += Math.floor(n_A_MATK[w_MagiclBulet] * mdefReduction(targetData[15]) - n_B_MDEF2)),
    n_A_ActiveSkill == SKILLID.GUNSLINGER_MINE && (e += 50 * n_A_ActiveSkillLV),
    m_Card[n_A_card[0]][0] == 106 && m_Card[n_A_card[1]][0] == 106 && m_Card[n_A_card[2]][0] == 106)
  )
    e += 40;
  else for (i = 0; i <= 2; i++) m_Card[n_A_card[i]][0] == 106 && (e += 5);
  return (
    n_A_card[3] == 106 && (e += 10),
    n_A_ActiveSkill == SKILLID.THROW_SHURIKEN &&
      ((e += m_Syuriken[1 * documento.calcForm.SkillSubNum.value][0]),
      (e += 3 * SkillSearch(SKILLID.DAGGER_THROWING_PRACTICE)),
      (e += 4 * n_A_ActiveSkillLV)),
    n_A_ActiveSkill == SKILLID.THROW_KUNAI &&
      (e += 3 * m_Kunai[1 * documento.calcForm.SkillSubNum.value][0]),
    (e = ApplyModifiers(e)),
    n_A_ActiveSkill == SKILLID.BACK_STAB && n_A_WeaponType == 10 && (e = Math.floor(e / 2)),
    n_Nitou &&
      SKILLID.BASIC_ATTACK == n_A_ActiveSkill &&
      n_A_WeaponType != 0 &&
      (e = Math.floor((e * (50 + 10 * SkillSearch(SKILLID.RIGHT_HAND_MASTERY))) / 100)),
    n_A_ActiveSkill == SKILLID.MAGICAL_BULLET && (e *= Math.max(0, element[targetData[3]][8])),
    n_A_ActiveSkill == SKILLID.GUNSLINGER_MINE && (e *= element[targetData[3]][0]),
    PvP == 1 &&
      (n_A_ActiveSkill == SKILLID.HEAT || n_A_ActiveSkill == SKILLID.HEAT_NO_PUSHBACK) &&
      (e = 0),
    e
  );
}
function ApplyModifiers(e) {
  var _ = 0;
  if (wBCEDPch == 0 && not_use_card == 0) {
    ((_ = bonusValues[30 + targetData[2]]),
      (e = Math.floor((e * (100 + _)) / 100)),
      (_ = bonusValues[40 + Math.floor(targetData[3] / 10)] + getTargetElementDamageBonus()),
      (e = Math.floor((e * (100 + _)) / 100)),
      (_ = bonusValues[27 + targetData[4]]),
      (e = Math.floor((e * (100 + _)) / 100)),
      n_rangedAtk == 1 &&
        TyouEnkakuSousa3dan != -1 &&
        ((_ = bonusValues[25]), (e = Math.floor((e * (100 + _)) / 100))),
      (_ = 0),
      targetData[19] == 1
        ? (_ += bonusValues[BONUSID.PHYSICAL_BOSS_DMG_PERCENT])
        : (_ += bonusValues[BONUSID.NON_BOSS_DMG_PERCENT]),
      (_ += bonusValues[80]),
      /^((Gold )?.*Scaraba|Queen Scaraba)$/i.test(targetData[1]) && (_ += 30 * CardNumSearch(571)),
      (e = Math.floor((e * (100 + _)) / 100)),
      EquipNumSearch(EQUIPID.CANNON_SPEAR) &&
        (e = Math.floor((e * (100 + 4 * n_A_Weapon_refine)) / 100)),
      wCriTyuu == 1 &&
        SKILLID.SHADOW_SLASH != n_A_ActiveSkill &&
        (e = Math.floor((e * (100 + bonusValues[70])) / 100)),
      ((108 <= targetData[0] && targetData[0] <= 115) || targetData[0] == 319) &&
        (e = Math.floor((e * (100 + bonusValues[81])) / 100)),
      116 <= targetData[0] &&
        targetData[0] <= 120 &&
        (e = Math.floor((e * (100 + bonusValues[82])) / 100)),
      ((49 <= targetData[0] && targetData[0] <= 52) ||
        targetData[0] == 55 ||
        targetData[0] == 221) &&
        (e = Math.floor((e * (100 + bonusValues[83])) / 100)),
      (targetData[0] == 106 ||
        targetData[0] == 152 ||
        targetData[0] == 308 ||
        targetData[0] == 32 ||
        targetData[0] == 541) &&
        (e = Math.floor((e * (100 + bonusValues[84])) / 100)),
      (e = Math.floor(
        (e * (100 + StPlusCalc2(1e3 + targetData[0]) + StPlusCard(1e3 + targetData[0]))) / 100,
      )),
      SkillSearch(SKILLID.FRENZY) && (e *= 2),
      n_A_ActiveSkill == SKILLID.POISON_REACT &&
        50 <= targetData[3] &&
        targetData[3] < 60 &&
        (e = Math.floor((e * (100 + 30 * n_A_ActiveSkillLV)) / 100)));
    var n = SkillSearch(SKILLID.ADVANCED_KATAR_MASTERY);
    (n_A_WeaponType == 11 && n && (e = Math.floor((e * (110 + 2 * n)) / 100)), (_ = 0));
    var a = SkillSearch(SKILLID.STELLAR_WRATH),
      o = SkillSearch(SKILLID.SOLAR_WRATH),
      t = SkillSearch(SKILLID.LUNAR_WRATH);
    if (PvP == 0) {
      var A =
        (a && SkillSearch(SKILLID.SLS_MIRACLE)) ||
        (a && targetData[4] == 2 && targetData[6] >= 17392);
      A
        ? (_ += (n_A_BaseLV + n_A_STR + n_A_LUK + n_A_DEX) / (12 - 3 * a))
        : o && targetData[4] == 0
          ? (_ += (n_A_BaseLV + n_A_LUK + n_A_DEX) / (12 - 3 * o))
          : t &&
            targetData[4] == 1 &&
            targetData[6] >= 5218 &&
            (_ += (n_A_BaseLV + n_A_LUK + n_A_DEX) / (12 - 3 * t));
    } else
      a
        ? (_ += (n_A_BaseLV + n_A_STR + n_A_LUK + n_A_DEX) / (12 - 3 * a))
        : o
          ? (_ += (n_A_BaseLV + n_A_LUK + n_A_DEX) / (12 - 3 * o))
          : t && (_ += (n_A_BaseLV + n_A_LUK + n_A_DEX) / (12 - 3 * t));
    e = Math.floor((e * (100 + _)) / 100);
  }
  ((e = Math.floor(tPlusDamCut(e))), (_ = 0));
  var s = baseSkillId(n_A_ActiveSkill);
  return (
    n_A_Buf9[20] == s && n_A_Buf9[20] != 0 && (_ += n_A_Buf9[19]),
    n_A_Buf9[22] == s && n_A_Buf9[22] != 0 && (_ += n_A_Buf9[21]),
    n_A_ActiveSkill == SKILLID.BASH && n_A_SHOES_REFINE >= 9 && CardNumSearch(362) && (_ += 10),
    n_A_ActiveSkill == SKILLID.BOWLING_BASH &&
      (n_A_WeaponType == 2 || n_A_WeaponType == 3) &&
      (_ += 25 * CardNumSearch(464)),
    n_A_ActiveSkill == SKILLID.ARROW_SHOWER &&
      n_A_WeaponType == 10 &&
      (_ += 50 * CardNumSearch(465)),
    n_A_ActiveSkill == SKILLID.DOUBLE_STRAFE &&
      n_A_Weapon_refine >= 9 &&
      EquipNumSearch(EQUIPID.GLORIOUS_HUNTER_BOW) &&
      (_ += 20),
    n_A_ActiveSkill == SKILLID.TRIGGER_HAPPY_SHOT &&
      n_A_Weapon_refine >= 9 &&
      EquipNumSearch(EQUIPID.GLORIOUS_PISTOL) &&
      (_ += 2 * n_A_Weapon_refine),
    n_A_ActiveSkill == SKILLID.TRACKING &&
      n_A_Weapon_refine >= 9 &&
      EquipNumSearch(EQUIPID.GLORIOUS_RIFLE) &&
      (_ += 3 * n_A_Weapon_refine),
    n_A_ActiveSkill == SKILLID.SPREAD_SHOT &&
      n_A_Weapon_refine >= 9 &&
      EquipNumSearch(EQUIPID.GLORIOUS_SHOTGUN) &&
      (_ += 2 * n_A_Weapon_refine),
    n_A_ActiveSkill == SKILLID.GUNSLINGER_MINE &&
      n_A_Weapon_refine >= 9 &&
      EquipNumSearch(EQUIPID.GLORIOUS_GRENADE_LAUNCHER) &&
      (_ += 2 * n_A_Weapon_refine),
    (n_A_ActiveSkill == SKILLID.BASH || n_A_ActiveSkill == SKILLID.BOWLING_BASH) &&
      SKILLID.HP_RECOVERY_WHILE_MOVING == n_A_ActiveSkillLV &&
      EquipNumSearch(EQUIPID.VETERAN_SWORD) &&
      (_ += 50),
    n_A_ActiveSkill == SKILLID.MAMMONITE &&
      SU_LUK >= 90 &&
      SU_DEX >= 90 &&
      EquipNumSearch(EQUIPID.BERCHEL_AXE) &&
      (_ += 15),
    n_A_ActiveSkill == SKILLID.METEOR_ASSAULT &&
      EquipNumSearch(EQUIPID.CHAKRAM) &&
      SkillSearch(SKILLID.KATAR_MASTERY) == 10 &&
      (_ += 20),
    n_A_ActiveSkill == SKILLID.METEOR_ASSAULT &&
      EquipNumSearch(EQUIPID.GHOST_WHISPER) &&
      (_ += n_A_HEAD_REFINE >= 9 ? 20 : n_A_HEAD_REFINE >= 7 ? 10 : 0),
    n_A_ActiveSkill == SKILLID.THROW_HUUMA_SHURIKEN &&
      n_A_Equip[0] == EQUIPID.ILLUSION_WING_SHURIKEN &&
      n_A_Weapon_refine >= 7 &&
      (_ += 40),
    (n_A_ActiveSkill == SKILLID.THROW_SPIRIT_SPHERES ||
      n_A_ActiveSkill == SKILLID.OCCULT_IMPACTION) &&
      n_A_Equip[0] == EQUIPID.SURAS_RAMPAGE &&
      (n_A_Weapon_refine >= 7 && (_ += 5), n_A_Weapon_refine >= 10 && (_ += 10)),
    n_A_ActiveSkill == SKILLID.BACK_STAB &&
      n_A_Equip[0] == EQUIPID.BLACK_WING &&
      (_ += 5 * Math.max(0, n_A_Weapon_refine - 5)),
    n_A_ActiveSkill == SKILLID.ARROW_VULCAN &&
      (n_A_Equip[0] == EQUIPID.GREEN_WHISTLE || n_A_Equip[0] == EQUIPID.STEM_WHIP) &&
      (n_A_Weapon_refine >= 7 && (_ += 10), n_A_Weapon_refine >= 10 && (_ += 20)),
    n_A_ActiveSkill == SKILLID.RAPID_SMITING &&
      EquipNumSearch(EQUIPID.IMPERIAL_GUARD) &&
      (_ += n_A_LEFT_REFINE),
    (n_A_ActiveSkill == SKILLID.SMITE ||
      n_A_ActiveSkill == SKILLID.SHIELD_BOOMERANG ||
      n_A_ActiveSkill == SKILLID.SHIELD_BOOMERANG_SOUL_LINKED) &&
      EquipNumSearch(EQUIPID.IMPERIAL_SPEAR) &&
      (_ += n_A_Weapon_refine),
    TyouEnkakuSousa3dan == -1 && EquipNumSearch(EQUIPID.COMBO_BATTLE_GLOVE) && (_ += 15),
    (n_A_ActiveSkill == SKILLID.SONIC_BLOW || n_A_ActiveSkill == SKILLID.SONIC_BLOW_SOUL_LINKED) &&
      SkillSearch(SKILLID.SONIC_ACCELERATION) &&
      wBCEDPch == 0 &&
      (_ += 10),
    (n_A_ActiveSkill == SKILLID.HOLY_CROSS || n_A_ActiveSkill == SKILLID.HOLY_CROSS_UARO) &&
      EquipNumSearch(EQUIPID.CANNON_SPEAR) &&
      (_ += 3 * n_A_Weapon_refine),
    (e = (e * (100 + StPlusCalc2(5e3 + s) + StPlusCard(5e3 + s) + _)) / 100),
    n_A_Buf7[20] && MANUKU_MONSTER() && (e = (110 * e) / 100),
    n_A_Buf7[23] && SUPURE_MONSTER() && (e = (110 * e) / 100),
    e
  );
}
function BattleCalc3(e) {
  return (
    (wBC3_3dan = w998B * TyouEnkakuSousa3dan),
    (wBC3_DA = w998E * e * 2),
    (wBC3_Cri = critChance * n_A_CriATK[1]),
    (wBC3_Normal = w998I * e),
    (wBC3_Miss = w998L * BattleCalc2(0)),
    (wBC3_X = (wBC3_3dan + wBC3_DA + wBC3_Cri + wBC3_Normal + wBC3_Miss) / 100),
    tPlusLucky(wBC3_X)
  );
}
function BattleCalc3left(e) {
  for (wBC3L2 = 0, i = 4; i <= 7; i++) m_Card[n_A_card[i]][0] == 106 && (wBC3L2 += 5);
  return (
    (wBC3_Normal = (e * w_HIT) / 100),
    (wBC3_Miss = (wBC3L2 * (100 - w_HIT)) / 100),
    (wBC3_X = wBC3_Normal + wBC3_Miss),
    (wBC3_X = tPlusDamCut(wBC3_X)),
    tPlusLucky(wBC3_X)
  );
}
function SkillSearch(e) {
  if (e == 258 && TimeItemNumSearch(35)) return 1;
  for (var _ = 0; _ <= 20; _++) if (m_JobBuff[n_A_JOB][_] == e) return n_A_Buf[_];
  return 0;
}
function canApplyEnchantDeadlyPoison() {
  return !(
    SKILLID.SAND_ATTACK == n_A_ActiveSkill ||
    SKILLID.SOUL_DESTROYER == n_A_ActiveSkill ||
    SKILLID.VENOM_SPLASHER == n_A_ActiveSkill ||
    SKILLID.METEOR_ASSAULT == n_A_ActiveSkill ||
    SKILLID.BOMB == n_A_ActiveSkill
  );
}
function applyPreRenewalEnchantDeadlyPoison(e) {
  var _ = SkillSearch(SKILLID.ENCHANT_DEADLY_POISON);
  return _ && !wBCEDPch && canApplyEnchantDeadlyPoison()
    ? Math.floor((e * (150 + 50 * _)) / 100)
    : e;
}
function BattleCalc4(e, _, n) {
  if (SKILLID.MAGIC_CRASHER_UARO == n_A_ActiveSkill) {
    var a = PvP == 0 ? Math.floor(targetData[14] * 0.25) : targetData[14],
      o = n_B_DEF2[_];
    if (PvP == 0) {
      var t = Math.max(1, Math.floor(n_B_DEF2[2] * 0.25)),
        A = Math.max(0, Math.floor(t / 20) ** 2 - 1);
      o = t + (_ == 0 ? A : _ == 1 ? Math.floor(A / 2) : 0);
    }
    var s = n == 0 ? n_A_WeaponLV_refineATK : n_A_Weapon2LV_refineATK;
    return Math.floor(e * defReduction(a)) - o + s;
  }
  return (
    (n = n == 0 ? n_A_WeaponLV_refineATK : n_A_Weapon2LV_refineATK),
    SKILLID.STAVE_CRASHER == n_A_ActiveSkill
      ? Math.floor(e * defReduction(targetData[14])) - n_B_DEF2[_] + n
      : SKILLID.WOUNDING_SHOT == n_A_ActiveSkill ||
          bonusValues[180 + targetData[2]] >= 1 ||
          (bonusValues[22] >= 1 && targetData[19] == 0) ||
          bonusValues[22] >= 10 ||
          SkillSearch(SKILLID.SLS_UNION)
        ? e + n
        : ((e =
            bonusValues[23] == 0
              ? Math.floor(e * defReduction(targetData[14])) - n_B_DEF2[_] + n
              : _ == 0
                ? Math.floor((e * (n_B_DEF2[2] + targetData[14])) / 100) + n
                : _ == 1
                  ? Math.floor((e * (n_B_DEF2[1] + targetData[14])) / 100) + n
                  : Math.floor((e * (n_B_DEF2[0] + targetData[14])) / 100) + n),
          e < 1 && (e = 1),
          e)
  );
}
function BattleCalcEDP(e, _) {
  if (
    e <= 0 ||
    SKILLID.SAND_ATTACK == n_A_ActiveSkill ||
    SKILLID.SOUL_DESTROYER == n_A_ActiveSkill ||
    SKILLID.VENOM_SPLASHER == n_A_ActiveSkill ||
    SKILLID.METEOR_ASSAULT == n_A_ActiveSkill ||
    SKILLID.BOMB == n_A_ActiveSkill
  )
    return 0;
  wBCEDPch = 1;
  var n = 0,
    a = 0;
  return (
    SkillSearch(SKILLID.ENCHANT_DEADLY_POISON) &&
      ((n = BattleCalc(e, _)), (n = Math.floor((n * Math.max(0, element[targetData[3]][5])) / 4))),
    n_A_Buf6[7] &&
      ((a = BattleCalc(e, _)), (a = Math.floor((a * Math.max(0, element[targetData[3]][3])) / 5))),
    (wBCEDPch = 0),
    n + a
  );
}
function EDPplus(e) {
  (SkillSearch(SKILLID.ENCHANT_DEADLY_POISON) || n_A_Buf6[7]) &&
    ((w_DMG[2] += EDP_DMG(2) * e),
    (w_DMG[1] += EDP_DMG(1) * e),
    w_HIT_EDP == 100 && (w_DMG[0] += EDP_DMG(0) * e));
}
function EDP_DMG(e) {
  if (SkillSearch(SKILLID.ENCHANT_DEADLY_POISON) || n_A_Buf6[7]) {
    if (
      SkillSearch(SKILLID.ENCHANT_DEADLY_POISON) ||
      (SKILLID.ENVENOM == n_A_ActiveSkill && 52 <= targetData[3] && targetData[3] <= 59) ||
      ((SKILLID.CART_REVOLUTION == n_A_ActiveSkill ||
        SKILLID.OCCULT_IMPACTION == n_A_ActiveSkill ||
        SKILLID.GUILLOTINE_FIST == n_A_ActiveSkill ||
        SKILLID.GUILLOTINE_FIST_MAX_SP == n_A_ActiveSkill) &&
        83 <= targetData[3] &&
        targetData[3] <= 89) ||
      (element[targetData[3]][n_A_Weapon_element] <= 0 && n_PerHIT_DMG == 0)
    )
      return 0;
    if (e == 0) return w_HIT_EDP == 100 ? n_A_EDP_DMG[0] : 0;
    if (e == 1) {
      var _ = 0;
      return (
        w_HIT_HYOUJI == 100 && (_ = 1),
        n_PerHIT_DMG && (_ = 1),
        Math.floor(
          _
            ? (n_A_EDP_DMG[1] * w_HIT_EDP) / 100
            : (((n_A_EDP_DMG[1] * w_HIT) / 100) * w_HIT_EDP) / 100,
        )
      );
    }
    if (e == 2) return n_A_EDP_DMG[2];
  }
  return 0;
}
function AspdMotionDelayForSkill() {
  var e = n_Delay[1];
  return e;
}
function CastAndDelay() {
  wCast != 0 &&
    ((str_bSUBname += SubName[9] + "<BR>"),
    (str_bSUB += Math.floor(100 * wCast) / 100 + SubName[1] + "<BR>"));
  var e = "",
    _ = "";
  wDelay = 0;
  var n = 0,
    a = AspdMotionDelayForSkill();
  (a > wDelay && ((wDelay = a), (n = 1)),
    (n_Delay[2] =
      Math.floor(n_Delay[2] * (100 - AC_I - ((100 - AC_I) * bonusValues[74]) / 100)) / 100),
    n_Delay[2] > wDelay && ((wDelay = n_Delay[2]), (n = 2)),
    n_Delay[3] > wDelay && ((wDelay = n_Delay[3]), (n = 3)),
    SKILLID.BASIC_ATTACK != n_A_ActiveSkill &&
      SKILLID.MARTYRS_RECKONING != n_A_ActiveSkill &&
      SKILLID.FIRE_BOLT_HINDSIGHT != n_A_ActiveSkill &&
      SKILLID.COLD_BOLT_HINDSIGHT != n_A_ActiveSkill &&
      SKILLID.LIGHTNING_BOLT_HINDSIGHT != n_A_ActiveSkill &&
      (n_Delay[4] = (1 * documento.calcForm.Conf01.value) / 100),
    n_Delay[4] > wDelay + wCast && ((wDelay = n_Delay[4] - wCast), (n = 4)),
    n_Delay[5] != 0 && ((wDelay = n_Delay[5]), (n = 5)),
    n_Delay[6] > wDelay + wCast && ((wDelay = n_Delay[6] - wCast), (n = 6)),
    n == 1 &&
      (SKILLID.BASIC_ATTACK == n_A_ActiveSkill
        ? SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW)
          ? ((e += "Attack interval (normal)<BR>Attack interval (" + skillName(187) + ")<BR>"),
            (_ += n_Delay[1] + " seconds<BR>" + sandanDelay + " seconds<BR>"),
            (wDelay = (n_Delay[1] * w998A) / 100 + (sandanDelay * wBC3_3danHatudouRitu) / 100))
          : ((e += "Time/Hit<BR>"), (_ += a + " seconds<BR>"))
        : ((e += "Motion Delay (ASPD based)<BR>"), (_ += a + " seconds<BR>"))),
    n == 2 && ((e += "Delay (fixed skills)<BR>"), (_ += n_Delay[2] + " seconds<BR>")),
    n == 3 &&
      (SKILLID.RAGING_QUADRUPLE_BLOW == n_A_ActiveSkill ||
      SKILLID.RAGING_THRUST == n_A_ActiveSkill ||
      SKILLID.GLACIER_FIST == n_A_ActiveSkill
        ? ((e += "Delay (+delay reception combo)<BR>"),
          (_ +=
            Math.round(1e3 * n_Delay[3]) / 1e3 +
            "~" +
            Math.round(1e3 * n_Delay[3] + 300) / 1e3 +
            " seconds<BR>"))
        : ((e += "Delay (forced motion)<BR>"),
          (_ += Math.round(1e3 * n_Delay[3]) / 1e3 + " seconds<BR>"))),
    n == 4 &&
      ((e +=
        "Delay (<span class=name>input limit<span class=nametext>This limit varies with ''Minimum delay between active skills'' in ''COMBAT SIMULATOR''.</span></span>)<BR>"),
      (_ += n_Delay[4] + " seconds<BR>")),
    n == 5 && ((e += "Damage interval<BR>"), (_ += n_Delay[5] + " seconds<BR>")),
    n == 6 &&
      ((e += "Limited Skill-Duration(?)<BR>"),
      (_ += Math.floor(100 * wDelay) / 100 + " seconds<BR>")),
    myInnerHtml("bSUB2name", e, 0),
    myInnerHtml("bSUB2", _, 0));
}
function tPlusDamCut(e) {
  return (
    n_WoE &&
      ((e =
        n_A_WeaponType == 10 ||
        n_A_WeaponType == 17 ||
        n_A_WeaponType == 18 ||
        n_A_WeaponType == 19 ||
        n_A_WeaponType == 20 ||
        n_A_WeaponType == 21 ||
        SKILLID.BASIC_ATTACK != n_A_ActiveSkill
          ? Math.floor(0.6 * e)
          : Math.floor(0.8 * e)),
      c.A8_Skill15.value > 0 && (e = Math.floor(e * (10 / (5 * c.A8_Skill15.value))))),
    (e = Math.floor((e * (100 - n_B_manual[1])) / 100)),
    (e = Math.floor((e * (100 - n_B_manual[7])) / 100)),
    (n_rangedAtk || n_A_WeaponType == 10) &&
      ((w = n_B_manual[9]), (e = Math.floor((e * (100 - w)) / 100))),
    1 * c.A_adopted.checked == 0 && ((w = n_B_buf[14]), (e = Math.floor((e * (100 - w)) / 100))),
    (w = n_B_manual[2]),
    n_A_Weapon_element == w && ((w = n_B_manual[3]), (e = Math.floor((e * (100 - w)) / 100))),
    (w = n_B_manual[4]),
    n_A_Weapon_element == w && ((w = n_B_manual[5]), (e = Math.floor((e * (100 - w)) / 100))),
    (w = n_B_buf[13]),
    w == 0 ||
      (n_rangedAtk != 1 && n_A_WeaponType != 10) ||
      ((w = 95 - 15 * n_B_buf[13]), (e = Math.floor((e * w) / 100))),
    (w = n_B_buf[14]),
    w > 0 && n_rangedAtk != 2 && (e -= Math.floor((e * w * 6) / 100)),
    wBTw1 == 0 &&
      (n_B_debuf[6] && wLAch == 0 && (e *= 2),
      n_B_debuf[17] && n_A_Weapon_element == 3 && (e *= 2),
      (groundEleMod = [110, 114, 117, 119, 120]),
      n_A_Buf6[0] == 0 &&
        n_A_Buf6[1] >= 1 &&
        n_A_Weapon_element == 3 &&
        (e = Math.floor((e * groundEleMod[n_A_Buf6[1] - 1]) / 100)),
      n_A_Buf6[0] == 1 &&
        n_A_Buf6[1] >= 1 &&
        n_A_Weapon_element == 1 &&
        (e = Math.floor((e * groundEleMod[n_A_Buf6[1] - 1]) / 100)),
      n_A_Buf6[0] == 2 &&
        n_A_Buf6[1] >= 1 &&
        n_A_Weapon_element == 4 &&
        (e = Math.floor((e * groundEleMod[n_A_Buf6[1] - 1]) / 100))),
    n_B_buf[1] && PvP == 0 && (e = Math.floor(e / 2)),
    n_B_buf[1] && PvP == 1 && (e = Math.floor((2 * e) / 3)),
    n_rangedAtk == 2
      ? (e += Math.floor((20 * e * (n_B_buf[7] - n_B_buf[8])) / 100))
      : (e += Math.floor((20 * e * (n_B_buf[8] - n_B_buf[7])) / 100)),
    targetData[19] == 5 && ((e = 1), SKILLID.FIRE_PILLAR == n_A_ActiveSkill && (e = 0)),
    e
  );
}
function tPlusTaiseiSyokia() {
  if (PvP) {
    for (i = 1; i <= 150; i++)
      ((c.B_AGI.options[i - 1] = new documento.Opzione(i, i)),
        (c.B_VIT.options[i - 1] = new documento.Opzione(i, i)),
        (c.B_INT.options[i - 1] = new documento.Opzione(i, i)),
        (c.B_LUK.options[i - 1] = new documento.Opzione(i, i)));
    for (i = 0; i <= 100; i++)
      ((c.B_DEF.options[i] = new documento.Opzione(i, i)),
        (c.B_MDEF.options[i] = new documento.Opzione(i, i)));
    for (i = 1; i <= 99; i++) c.B_LV.options[i - 1] = new documento.Opzione(i, i);
    for (i = 0; i <= 9; i++)
      c.B_element.options[i] = new documento.Opzione(v_Element[i] + "1", 10 * i + 1);
    for (i = 0; i <= 9; i++)
      ((c.B_TAISEI2_1.options[i] = new documento.Opzione(v_Element[i], i)),
        (c.B_TAISEI3_1.options[i] = new documento.Opzione(v_Element[i], i)));
    for (i = 0; i <= 10; i++) c.B_TAISEI4.options[i] = new documento.Opzione(i, i);
    for (i = 0; i <= 5; i++) c.B_TAISEI5.options[i] = new documento.Opzione(i, i);
    for (i = 0; i <= 10; i++) c.B_TAISEI10.options[i] = new documento.Opzione(i, i);
    for (i = 0; i <= 5; i++) c.B_TAISEI13.options[i] = new documento.Opzione(v_EnergyCoat[i], i);
    for (i = 0; i <= 10; i++) c.B_TAISEI14.options[i] = new documento.Opzione(i, i);
    for (targetData = new Array(), i = 0; i <= 26; i++)
      targetData[i] = m_Monster2[c.B_Enemy.value][i];
    ((i = 1 * c.B_Enemy.value),
      (c.B_LV.value = m_Monster2[i][5]),
      (c.B_VIT.value = m_Monster2[i][7]),
      (c.B_AGI.value = m_Monster2[i][8]),
      (c.B_INT.value = m_Monster2[i][9]),
      (c.B_LUK.value = m_Monster2[i][11]),
      (c.B_DEF.value = m_Monster2[i][14]),
      (c.B_MDEF.value = m_Monster2[i][15]));
  }
}
function tPlusLucky(e) {
  return PvP
    ? ((w = n_B_manual[38]), (w += targetData[11] / 10), (w = (e * (100 - w)) / 100), w)
    : e;
}
function tPlusAG() {
  n_rangedAtk != 2 &&
    n_B_buf[11] > 0 &&
    ((wPAG = w_AG[n_B_buf[11]]),
    (w_DMG[0] *= wPAG / 100),
    (w_DMG[1] *= wPAG / 100),
    (w_DMG[2] *= wPAG / 100));
}
function skill_dmg(e) {
  e = baseSkillId(e);
  var _ = 100;
  return (n_A_Buf9[20] == e && (_ += n_A_Buf9[19]), n_A_Buf9[22] == e && (_ += n_A_Buf9[21]), _);
}
function defReduction(e) {
  return (100 - e) / 100;
}
function mdefReduction(e) {
  return (100 - e) / 100;
}
SWs3sw = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
