// Gestori delle scelte (classe, armi, skill, mostro) ed elenchi delle opzioni
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
          itemData[c.A_left.value].slots != 0 &&
          (c.A_left_card.disabled = !1)));
}
function restrictCardslot(e) {
  if ((card_restrict = 1 * c.restrict_cardslot.checked)) {
    if (c.A_weapon1.value) {
      if (typeof (n = itemData[c.A_weapon1.value].slots) == "string") {
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
        (typeof (n = itemData[c.A_weapon2.value].slots) == "string" &&
          ((_ = n.split("/")), (n = _[1])),
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
    (c.A_head1.value && itemData[c.A_head1.value].slots != 0
      ? (c.A_head1_card.disabled = !1)
      : ((c.A_head1_card.disabled = !0), (c.A_head1_card.value = 0)),
      c.A_head2.value && itemData[c.A_head2.value].slots != 0
        ? (c.A_head2_card.disabled = !1)
        : ((c.A_head2_card.disabled = !0), (c.A_head2_card.value = 0)),
      c.A_left.value && itemData[c.A_left.value].slots != 0
        ? (c.A_left_card.disabled = !1)
        : ((c.A_left_card.disabled = !0), (c.A_left_card.value = 0)),
      c.A_body.value && itemData[c.A_body.value].slots != 0
        ? (c.A_body_card.disabled = !1)
        : ((c.A_body_card.disabled = !0), (c.A_body_card.value = 0)),
      c.A_shoulder.value && itemData[c.A_shoulder.value].slots != 0
        ? (c.A_shoulder_card.disabled = !1)
        : ((c.A_shoulder_card.disabled = !0), (c.A_shoulder_card.value = 0)),
      c.A_shoes.value && itemData[c.A_shoes.value].slots != 0
        ? (c.A_shoes_card.disabled = !1)
        : ((c.A_shoes_card.disabled = !0), (c.A_shoes_card.value = 0)),
      c.A_acces1.value && itemData[c.A_acces1.value].slots != 0
        ? (c.A_acces1_card.disabled = !1)
        : ((c.A_acces1_card.disabled = !0), (c.A_acces1_card.value = 0)),
      c.A_acces2.value && itemData[c.A_acces2.value].slots != 0
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
    _.value = itemData[n].weight;
  }
}
function ClickWeaponType(e) {
  (n_A_JobSet(), (e = itemData[c.A_weapon1.value].equipType));
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
  } else myInnerHtml("BBSkill", "", 0);
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
            (c.SkillSubNum.value = itemData[n_A_Equip[5]].weight));
          break;
        case 259:
          (myInnerHtml(
            "AASkill",
            'Weapon weight: <input type="text" inputmode="numeric" maxlength="4" name="SkillSubNum" size=2 onkeypress="return isNumeric(event)" onkeyup="calc()">',
            0,
          ),
            (c.SkillSubNum.value = itemData[n_A_Equip[0]].weight));
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
function ClickB_Enemy() {
  for (targetData = new Array(), n_B2 = new Array(), i = 0; i <= 22; i++)
    ((targetData[i] = m_Monster[c.B_Enemy.value][i]), (n_B2[i] = targetData[i]));
  ((targetData[6] += n_B_manual[30]),
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
    (n_B2[23] = targetData[7]),
    (n_B2[24] =
      targetData[7] + (Math.floor(targetData[7] / 20) * Math.floor(targetData[7] / 20) - 1)),
    n_B2[23] > n_B2[24] && (n_B2[24] = n_B2[23]),
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
      (n_B_debuf[13] = c.B_debuf13.checked),
      (n_B_debuf[14] = c.B_debuf14.checked),
      (n_B_debuf[15] = c.B_debuf15.checked),
      (n_B_debuf[16] = c.B_debuf16.checked),
      (n_B_debuf[21] = c.B_debuf21.checked),
      (n_B_debuf[22] = c.B_debuf22.checked),
      (n_B_debuf[23] = 1 * c.B_debuf23.value),
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
    n_B_debuf[22] && (n += 300),
    n_B_buf[4] && (n += 200),
    (targetData[12] += Math.floor((targetData[12] * n) / 100)),
    (targetData[13] += Math.floor((targetData[13] * n) / 100)),
    n_B_debuf[13] &&
      ((targetData[12] -= Math.floor((25 * targetData[12]) / 100)),
      (targetData[13] -= Math.floor((25 * targetData[13]) / 100))),
    e &&
      ((targetData[12] -= Math.floor((35 * targetData[12]) / 100)),
      (targetData[13] -= Math.floor((35 * targetData[13]) / 100))),
    n_B_buf[0] && (targetData[8] += 2 + n_B_buf[0]),
    n_B_debuf[1] &&
      ((_ = 10 * n_B_debuf[1]),
      (o = Math.floor(targetData[8] / 2)),
      (targetData[8] -= o > _ ? _ : o)),
    targetData[19] == 0 &&
      n_B_debuf[11] &&
      ((targetData[8] -= n_B_debuf[11] + 2), targetData[8] < 0 && (targetData[8] = 0)),
    n_B_debuf[1] &&
      ((_ = 10 * n_B_debuf[1]),
      (o = Math.floor(targetData[10] / 2)),
      (targetData[10] -= o > _ ? _ : o)),
    targetData[19] == 0 &&
      n_B_debuf[5] &&
      (targetData[2] == 6 || targetData[3] >= 90) &&
      (targetData[10] = targetData[10] - Math.floor(targetData[10] / 2)),
    n_B_debuf[15] && (targetData[7] -= Math.floor((40 * targetData[7]) / 100)),
    targetData[19] == 0 &&
      n_B_debuf[5] &&
      (targetData[2] == 6 || targetData[3] >= 90) &&
      (targetData[9] = targetData[9] - Math.floor(targetData[9] / 2)),
    n_B_debuf[16] && (targetData[9] -= Math.floor((40 * targetData[9]) / 100)),
    targetData[19] == 0 && n_B_debuf[10] && (targetData[11] = 0),
    (targetData[23] = targetData[7]),
    (targetData[24] =
      targetData[7] + (Math.floor(targetData[7] / 20) * Math.floor(targetData[7] / 20) - 1)),
    targetData[23] > targetData[24] && (targetData[24] = targetData[23]),
    (o = n_B_buf[10]) &&
      ((targetData[23] = Math.floor(targetData[23] * (1 + 0.05 * o))),
      (targetData[24] = Math.floor(targetData[24] * (1 + 0.05 * o)))),
    (targetData[25] = Math.floor(targetData[7] / 2) + targetData[9]),
    (targetData[26] = targetData[5] + targetData[10]),
    (targetData[27] = targetData[5] + targetData[8]));
  var a = 0;
  (targetData[19] == 0 && n_B_debuf[0] != 0 && targetData[3] < 90 && (a += 5 + 5 * n_B_debuf[0]),
    n_B_debuf[22] && (a += 50),
    n_B_debuf[24] && (a += 5 * n_B_debuf[24]),
    a > 100 && (a = 100),
    (targetData[14] -= Math.floor((targetData[14] * a) / 100)),
    targetData[19] == 0 &&
      n_B_debuf[2] &&
      (targetData[14] -= Math.floor((25 * targetData[14]) / 100)));
  var o = 0;
  ((o += bonusValues[290]),
    targetData[19] == 0 && (o += bonusValues[291]),
    targetData[19] == 1 && (o += bonusValues[292]),
    (o += bonusValues[300 + targetData[2]]),
    (SKILLID.GRAND_CROSS != baseSkillId(n_A_ActiveSkill) &&
      SKILLID.OCCULT_IMPACTION != n_A_ActiveSkill) ||
      (o = 0),
    o && (o < 0 && (o = 0), (targetData[14] -= Math.floor((targetData[14] * o) / 100))),
    n_B_debuf[14] && (targetData[14] -= Math.floor((15 * targetData[14]) / 100)),
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
    n_B_debuf[20] && (targetData[14] = 0),
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
    n_B_debuf[21] && (targetData[24] += 90),
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
    n_B_debuf[21] && (targetData[25] = 90),
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
    targetData[19] == 0 && (n_B_debuf[7] || n_B_debuf[8]) && (targetData[27] = -19));
  var t = 100;
  ((t += StPlusCard(120 + targetData[2])), (t += StPlusCalc2(120 + targetData[2])));
  var A = 0;
  ((t +=
    5 * (EquipNumSearch(EQUIPID.AUMDURAS_BENEFIT_B) + EquipNumSearch(EQUIPID.AUMDURAS_BENEFIT_C))),
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
function sort(l) {
  for (var A = 1; l[A] != "EOF"; A++)
    for (var n = A; n > 0; n--)
      if (itemData[l[n - 1]].name > itemData[l[n]].name) {
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
        itemData[i].equipType == n_A_WeaponType &&
          (JobEquipItemSearch(itemData[i].jobMask) == 1 &&
          (itemData[i].requiredLevel <= c.A_BaseLV.value || A == 0)
            ? ((work[j] = i), j++)
            : itemData[i].weaponLevel >= 1 &&
              SuperNoviceFullWeaponCHECK &&
              (itemData[i].equipType == 1 && itemData[i].weaponLevel == 4 && ((work[j] = i), j++),
              (itemData[i].equipType == 2 || itemData[i].equipType > 3) && ((work[j] = i), j++)));
      if (j > 0) {
        for (work[j] = "EOF", work = sort(work), i = 1; i < j + 1; i++) {
          var _ = "";
          (itemData[work[i - 1]].slots && (_ = " [" + itemData[work[i - 1]].slots + "]"),
            (c.A_weapon1.options[i + n] = new documento.Opzione(
              itemData[work[i - 1]].name + _,
              itemData[work[i - 1]].id,
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
        itemData[i].equipType == n_A_Weapon2Type &&
          JobEquipItemSearch(itemData[i].jobMask) == 1 &&
          (itemData[i].requiredLevel <= c.A_BaseLV.value || A == 0) &&
          ((work[j] = i), j++);
      if (j > 0) {
        for (work[j] = "EOF", work = sort(work), i = 1; i < j + 1; i++) {
          var _ = "";
          (itemData[work[i - 1]].slots && (_ = " [" + itemData[work[i - 1]].slots + "]"),
            (c.A_weapon2.options[i + n] = new documento.Opzione(
              itemData[work[i - 1]].name + _,
              itemData[work[i - 1]].id,
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
        (c.A_head1.options[0] = new documento.Opzione(itemData[142].name, itemData[142].id)),
        (c.A_head2.options[0] = new documento.Opzione(itemData[243].name, itemData[243].id)),
        (c.A_head3.options[0] = new documento.Opzione(itemData[268].name, itemData[268].id)),
        (c.A_left.options[0] = new documento.Opzione(itemData[305].name, itemData[305].id)),
        (c.A_body.options[0] = new documento.Opzione(itemData[279].name, itemData[279].id)),
        (c.A_shoulder.options[0] = new documento.Opzione(itemData[311].name, itemData[311].id)),
        (c.A_shoes.options[0] = new documento.Opzione(itemData[317].name, itemData[317].id)),
        (c.A_acces1.options[0] = new documento.Opzione(itemData[326].name, itemData[326].id)),
        void (c.A_acces2.options[0] = new documento.Opzione(itemData[326].name, itemData[326].id))
      );
    first_check = 2;
    var s = new Array(),
      _ = 1 * c.restrict_jobequip.checked;
    for (A = 1 * c.restrict_lvlequip.checked, n = 0; n <= 7; n++) s[n] = new Array();
    var a = new Array();
    for (n = 0; n <= 7; n++) a[n] = 0;
    for (n = 0; n <= ItemMax; n++)
      itemData[n].equipType == 50 &&
      (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) == 1 ||
        SuperNoviceFullWeaponCHECK ||
        _ == 0) &&
      (itemData[n].requiredLevel <= n_A_BaseLV || SuperNoviceFullWeaponCHECK || A == 0)
        ? ((s[0][a[0]] = n), a[0]++)
        : itemData[n].equipType == 51 &&
            (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) == 1 ||
              SuperNoviceFullWeaponCHECK ||
              _ == 0) &&
            (itemData[n].requiredLevel <= n_A_BaseLV || SuperNoviceFullWeaponCHECK || A == 0)
          ? ((s[1][a[1]] = n), a[1]++)
          : itemData[n].equipType == 52 &&
              (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) == 1 ||
                SuperNoviceFullWeaponCHECK ||
                _ == 0) &&
              (itemData[n].requiredLevel <= n_A_BaseLV || SuperNoviceFullWeaponCHECK || A == 0)
            ? ((s[2][a[2]] = n), a[2]++)
            : itemData[n].equipType != 61 ||
                (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) != 1 && _ != 0) ||
                !(itemData[n].requiredLevel <= n_A_BaseLV || A == 0)
              ? itemData[n].equipType != 60 ||
                (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) != 1 && _ != 0) ||
                !(itemData[n].requiredLevel <= n_A_BaseLV || A == 0)
                ? itemData[n].equipType != 62 ||
                  (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) != 1 && _ != 0) ||
                  !(itemData[n].requiredLevel <= n_A_BaseLV || A == 0)
                  ? itemData[n].equipType != 63 ||
                    (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) != 1 &&
                      _ != 0) ||
                    !(itemData[n].requiredLevel <= n_A_BaseLV || A == 0)
                    ? itemData[n].equipType != 64 ||
                      (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) != 1 &&
                        _ != 0) ||
                      !(itemData[n].requiredLevel <= n_A_BaseLV || A == 0) ||
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
        itemData[S].slots
          ? (c.A_head1.options[n] = new documento.Opzione(
              itemData[S].name + " [" + itemData[S].slots + "]",
              itemData[S].id,
            ))
          : (c.A_head1.options[n] = new documento.Opzione(itemData[S].name, itemData[S].id)));
    for (n = 0; n < a[1]; n++)
      ((S = s[1][n]),
        itemData[S].slots
          ? (c.A_head2.options[n] = new documento.Opzione(
              itemData[S].name + " [" + itemData[S].slots + "]",
              itemData[S].id,
            ))
          : (c.A_head2.options[n] = new documento.Opzione(itemData[S].name, itemData[S].id)));
    for (n = 0; n < a[2]; n++)
      ((S = s[2][n]),
        itemData[S].slots
          ? (c.A_head3.options[n] = new documento.Opzione(
              itemData[S].name + " [" + itemData[S].slots + "]",
              itemData[S].id,
            ))
          : (c.A_head3.options[n] = new documento.Opzione(itemData[S].name, itemData[S].id)));
    for (n = 0; n < a[3]; n++)
      ((S = s[3][n]),
        itemData[S].slots
          ? (c.A_left.options[n] = new documento.Opzione(
              itemData[S].name + " [" + itemData[S].slots + "]",
              itemData[S].id,
            ))
          : (c.A_left.options[n] = new documento.Opzione(itemData[S].name, itemData[S].id)));
    for (n = 0; n < a[4]; n++)
      ((S = s[4][n]),
        itemData[S].slots
          ? (c.A_body.options[n] = new documento.Opzione(
              itemData[S].name + " [" + itemData[S].slots + "]",
              itemData[S].id,
            ))
          : (c.A_body.options[n] = new documento.Opzione(itemData[S].name, itemData[S].id)));
    for (n = 0; n < a[5]; n++)
      ((S = s[5][n]),
        itemData[S].slots
          ? (c.A_shoulder.options[n] = new documento.Opzione(
              itemData[S].name + " [" + itemData[S].slots + "]",
              itemData[S].id,
            ))
          : (c.A_shoulder.options[n] = new documento.Opzione(itemData[S].name, itemData[S].id)));
    for (n = 0; n < a[6]; n++)
      ((S = s[6][n]),
        itemData[S].slots
          ? (c.A_shoes.options[n] = new documento.Opzione(
              itemData[S].name + " [" + itemData[S].slots + "]",
              itemData[S].id,
            ))
          : (c.A_shoes.options[n] = new documento.Opzione(itemData[S].name, itemData[S].id)));
    for (n = 0; n < a[7]; n++)
      ((S = s[7][n]),
        itemData[S].slots
          ? ((c.A_acces1.options[n] = new documento.Opzione(
              itemData[S].name + " [" + itemData[S].slots + "]",
              itemData[S].id,
            )),
            (c.A_acces2.options[n] = new documento.Opzione(
              itemData[S].name + " [" + itemData[S].slots + "]",
              itemData[S].id,
            )))
          : ((c.A_acces1.options[n] = new documento.Opzione(itemData[S].name, itemData[S].id)),
            (c.A_acces2.options[n] = new documento.Opzione(itemData[S].name, itemData[S].id))));
  }
}
function FirstNovis() {
  first_check == 1 && ((first_check = 2), WeaponSet2());
}
function ActiveSkillSetPlus() {
  for (w_ASSP0 = new Array(), w_ASSP9 = new Array(), n = 0; n < 20; n++)
    ((w_ASSP0[n] = 999), (w_ASSP9[n] = 0));
  j = 0;
  var l = 0;
  for (n = 0; n <= 20; n++)
    for (const b of itemData[n_A_Equip[n]].bonuses)
      ((l = b.value),
        Math.abs(b.id) == 220
          ? m_EnableSkill[l][1] == 1 &&
            ((w_ASSP0[j] = m_EnableSkill[l][2]), (w_ASSP9[j] = m_EnableSkill[l][0] + 3e3), j++)
          : Math.abs(b.id) == 221 &&
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
// toglie dall'elenco dei mostri (id, -1 = tolto) quelli fuori dai filtri: luogo (ENEMY_SORT2),
// mappa del luogo (ENEMY_MAP, da MAPPE_LUOGO) e tipo (ENEMY_TYPE). Se non resta nessun mostro resta
// quello scelto, perche' l'elenco non puo' essere vuoto
function SZ(l) {
  var luogo = 1 * c.ENEMY_SORT2.value,
    tipo = 1 * c.ENEMY_TYPE.value,
    ammessi = luogo != 0 ? mostriDelLuogo(luogo, c.ENEMY_MAP.value) : null,
    scelto = targetData[0],
    originale = l.slice(),
    restano = 0;
  for (var n = 0; n <= EnemyNum; n++) {
    if (l[n] == -1) continue;
    if ((ammessi && !ammessi.has(l[n])) || !mostroDelTipo(m_Monster[l[n]], tipo)) l[n] = -1;
    else restano++;
  }
  if (restano == 0) for (n = 0; n <= EnemyNum; n++) if (originale[n] == scelto) l[n] = scelto;
  return l;
}
// mostri di un luogo: quelli del suo elenco piu' quelli delle sue mappe, o solo quelli della mappa
function mostriDelLuogo(luogo, mappa) {
  var mappe = MAPPE_LUOGO[luogo] || [];
  if (mappa) {
    var trovata = mappe.find((x) => x[0] == mappa);
    if (trovata) return new Set(trovata[2]);
  }
  var ammessi = new Set(m_MonsterMap[luogo].filter((x) => x != "N"));
  for (var x of mappe) for (var id of x[2]) ammessi.add(id);
  return ammessi;
}
// tipo: 0 tutti, 1 MvP, 2 boss non MvP, 3 gli altri
function mostroDelTipo(mostro, tipo) {
  if (tipo == 0) return true;
  if (tipo == 1) return isMvpMonster(mostro);
  if (tipo == 2) return !isMvpMonster(mostro) && mostro[19] == 1;
  return !isMvpMonster(mostro) && mostro[19] != 1;
}
// mappe del luogo scelto nel campo ENEMY_MAP (senza mappe resta solo "All maps", e il campo si
// nasconde); il codice della mappa si aggiunge solo ai nomi ripetuti, come i Geffen Field
function riempiMappe() {
  var campo = c.ENEMY_MAP,
    mappe = MAPPE_LUOGO[1 * c.ENEMY_SORT2.value] || [];
  for (var i = campo.length; i > 0; i--) campo.options[0] = null;
  campo.options[0] = new documento.Opzione("All maps", "");
  mappe.forEach((x, i) => {
    var ripetuto = mappe.some((y) => y != x && y[1] == x[1]);
    campo.options[i + 1] = new documento.Opzione(ripetuto ? x[1] + " (" + x[0] + ")" : x[1], x[0]);
  });
  campo.value = "";
  campo.hidden = !mappe.length;
}
function MANUKU_MONSTER() {
  for (var l = 0; l < nMANUKU.length; l++) if (targetData[0] == nMANUKU[l]) return 1;
  return 0;
}
function SUPURE_MONSTER() {
  for (var l = 0; l < nSUPURE.length; l++) if (targetData[0] == nSUPURE[l]) return 1;
  return 0;
}
