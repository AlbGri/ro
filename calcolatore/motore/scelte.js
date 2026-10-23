// Gestori delle scelte (classe, armi, skill, mostro) ed elenchi delle opzioni

// Il menu della classe diviso in sezioni: le opzioni non sono piu' nell'ordine dei numeri, e
// la classe si sceglie per valore (c.A_JOB.value), mai per posizione
var SEZIONI_CLASSI = [
  ["Novice", [0]],
  ["First classes", [1, 2, 3, 4, 5, 6]],
  ["Second classes", [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]],
  ["Transcendent classes", [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33]],
  ["High classes", [34, 35, 36, 37, 38, 39, 40]],
  ["Expanded classes", [20, 41, 42, 43, 44, 45]],
];
var NOMI_CLASSE_MENU = {
  30: "Clown (iRO name: Minstrel)",
  32: "Professor (iRO name: Scholar)",
  33: "Creator (iRO name: Biochemist)",
  42: "Star Gladiator (iRO name: Taekwon Master)",
};
function servers() {
  if (firstLoad == 0) {
    for (var [sezione, classi] of SEZIONI_CLASSI)
      gruppo(
        c.A_JOB,
        sezione,
        classi.map(function (classe) {
          return [classe, NOMI_CLASSE_MENU[classe] || JobName[classe]];
        }),
      );
    c.A_Weapon_refine.length = 0;
    if (n_Nitou) c.A_Weapon2_refine.length = 0;
    c.A_HEAD_REFINE.length = 0;
    c.A_LEFT_REFINE.length = 0;
    c.A_BODY_REFINE.length = 0;
    c.A_SHOULDER_REFINE.length = 0;
    c.A_SHOES_REFINE.length = 0;
    var raffinamenti = serie(0, 10, function (i) {
      return [i, "+" + i];
    });
    opzioni(c.A_Weapon_refine, raffinamenti);
    if (n_Nitou) opzioni(c.A_Weapon2_refine, raffinamenti);
    opzioni(c.A_HEAD_REFINE, raffinamenti);
    opzioni(c.A_LEFT_REFINE, raffinamenti);
    opzioni(c.A_BODY_REFINE, raffinamenti);
    opzioni(c.A_SHOULDER_REFINE, raffinamenti);
    opzioni(c.A_SHOES_REFINE, raffinamenti);
  }
  firstLoad = 1;
  for (var e of c.A_ActiveSkill.options)
    if (1 * e.value == SKILLID.STAVE_CRASHER) e.text = skillNameInSelect(SKILLID.STAVE_CRASHER);
  calc();
}
function restrictEquipslot() {
  equip_restrict = 1 * c.restrict_equipslot.checked;
  if (
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
  ) {
    c.A_LEFT_REFINE.disabled = true;
    c.A_LEFT_REFINE.value = 0;
    c.A_left.disabled = true;
    c.A_left.value = 305;
    c.A_left_card.disabled = true;
    c.A_left_card.value = 0;
  } else {
    c.A_LEFT_REFINE.disabled = false;
    c.A_left.disabled = false;
    if (c.A_left.value && card_restrict && itemData[c.A_left.value].slots != 0)
      c.A_left_card.disabled = false;
  }
}
function restrictCardslot(e) {
  if ((card_restrict = 1 * c.restrict_cardslot.checked)) {
    if (c.A_weapon1.value) {
      if (typeof (n = itemData[c.A_weapon1.value].slots) == "string") {
        var _ = n.split("/");
        n = _[1];
      }
      c.A_weapon1_card1.disabled = !(n > 0);
      c.A_weapon1_card2.disabled = !(n > 1);
      c.A_weapon1_card3.disabled = !(n > 2);
      c.A_weapon1_card4.disabled = !(n > 3);
    } else {
      c.A_weapon1_card1.disabled = true;
      c.A_weapon1_card1.value = 0;
      c.A_weapon1_card2.disabled = true;
      c.A_weapon1_card2.value = 0;
      c.A_weapon1_card3.disabled = true;
      c.A_weapon1_card3.value = 0;
      c.A_weapon1_card4.disabled = true;
      c.A_weapon1_card4.value = 0;
    }
    if (n_Nitou)
      if (c.A_weapon2.value) {
        var n;
        if (typeof (n = itemData[c.A_weapon2.value].slots) == "string") {
          _ = n.split("/");
          n = _[1];
        }
        c.A_weapon2_card1.disabled = !(n > 0);
        c.A_weapon2_card2.disabled = !(n > 1);
        c.A_weapon2_card3.disabled = !(n > 2);
        c.A_weapon2_card4.disabled = !(n > 3);
      } else {
        c.A_weapon2_card1.disabled = true;
        c.A_weapon2_card1.value = 0;
        c.A_weapon2_card2.disabled = true;
        c.A_weapon2_card2.value = 0;
        c.A_weapon2_card3.disabled = true;
        c.A_weapon2_card3.value = 0;
        c.A_weapon2_card4.disabled = true;
        c.A_weapon2_card4.value = 0;
      }
    if (c.A_head1.value && itemData[c.A_head1.value].slots != 0) c.A_head1_card.disabled = false;
    else {
      c.A_head1_card.disabled = true;
      c.A_head1_card.value = 0;
    }
    if (c.A_head2.value && itemData[c.A_head2.value].slots != 0) c.A_head2_card.disabled = false;
    else {
      c.A_head2_card.disabled = true;
      c.A_head2_card.value = 0;
    }
    if (c.A_left.value && itemData[c.A_left.value].slots != 0) c.A_left_card.disabled = false;
    else {
      c.A_left_card.disabled = true;
      c.A_left_card.value = 0;
    }
    if (c.A_body.value && itemData[c.A_body.value].slots != 0) c.A_body_card.disabled = false;
    else {
      c.A_body_card.disabled = true;
      c.A_body_card.value = 0;
    }
    if (c.A_shoulder.value && itemData[c.A_shoulder.value].slots != 0)
      c.A_shoulder_card.disabled = false;
    else {
      c.A_shoulder_card.disabled = true;
      c.A_shoulder_card.value = 0;
    }
    if (c.A_shoes.value && itemData[c.A_shoes.value].slots != 0) c.A_shoes_card.disabled = false;
    else {
      c.A_shoes_card.disabled = true;
      c.A_shoes_card.value = 0;
    }
    if (c.A_acces1.value && itemData[c.A_acces1.value].slots != 0) c.A_acces1_card.disabled = false;
    else {
      c.A_acces1_card.disabled = true;
      c.A_acces1_card.value = 0;
    }
    if (c.A_acces2.value && itemData[c.A_acces2.value].slots != 0) c.A_acces2_card.disabled = false;
    else {
      c.A_acces2_card.disabled = true;
      c.A_acces2_card.value = 0;
    }
  } else {
    c.A_weapon1_card1.disabled = false;
    c.A_weapon1_card2.disabled = false;
    c.A_weapon1_card3.disabled = false;
    c.A_weapon1_card4.disabled = false;
    if (n_Nitou) {
      c.A_weapon2_card1.disabled = false;
      c.A_weapon2_card2.disabled = false;
      c.A_weapon2_card3.disabled = false;
      c.A_weapon2_card4.disabled = false;
    }
    c.A_head1_card.disabled = false;
    if (c.A_head2.disabled) c.A_head2_card.disabled = true;
    else c.A_head2_card.disabled = false;
    if (c.A_left.disabled) c.A_left_card.disabled = true;
    else c.A_left_card.disabled = false;
    c.A_body_card.disabled = false;
    c.A_shoulder_card.disabled = false;
    c.A_shoes_card.disabled = false;
    c.A_acces1_card.disabled = false;
    c.A_acces2_card.disabled = false;
  }
  calc();
}
// la skill passiva al posto n: nome (risultato P_Skill<n>) e livello (campo A_skill<n>); il
// gestore, se non e' detto, ricalcola le statistiche
function passiva(n, nome, gestore) {
  contenitore("P_Skill" + n + "s", [
    {
      campo: "A_skill" + n,
      id: "P_Skill" + n,
      etichetta: nome,
      gestore:
        gestore ||
        function () {
          StAllCalc();
        },
    },
  ]);
}
// i campi della seconda arma oltre all'arma: raffinamento, combinazione di carte, carte
var CONTENITORI_SINISTRA = [
  "A_weapon2refine",
  "A_weapon2_cardshort",
  "nA_weapon2_c1",
  "nA_weapon2_c2",
  "nA_weapon2_c3",
  "nA_weapon2_c4",
];
function svuotaSinistra() {
  CONTENITORI_SINISTRA.forEach(function (id) {
    contenitore(id);
  });
}
// il campo in piu' di una skill (SkillSubNum per la tua, BSkillSubNum per quella del nemico,
// nel contenitore dove): una tendina che ricalcola o, con valore, una casella di testo senza
// gestore (il calcolo partiva scrivendo, onkeyup, che la pagina non esegue)
function campoSkill(dove, nome, etichetta, valore) {
  contenitore(dove, [
    valore === undefined
      ? {
          campo: nome,
          etichetta: etichetta,
          gestore: function () {
            calc();
          },
        }
      : {
          campo: nome,
          tipo: "testo",
          etichetta: etichetta,
          valore: valore,
        },
  ]);
}
function ClickJob(e) {
  contenitore("A_KakutyouSel");
  scrivi("A_KakutyouData", "");
  c.A_Kakutyou.value = 0;
  n_A_JobSet();
  var _;
  if ((e = n_A_JOB) < 46) {
    opzioni(c.A_BaseLV, numeri(1, 99));
    opzioni(c.A_STR, numeri(1, 99));
    opzioni(c.A_AGI, numeri(1, 99));
    opzioni(c.A_VIT, numeri(1, 99));
    opzioni(c.A_INT, numeri(1, 99));
    opzioni(c.A_DEX, numeri(1, 99));
    opzioni(c.A_LUK, numeri(1, 99));
  } else {
    thirdClass = 1;
    opzioni(c.A_BaseLV, numeri(1, 175));
    opzioni(c.A_STR, numeri(1, 130));
    opzioni(c.A_AGI, numeri(1, 130));
    opzioni(c.A_VIT, numeri(1, 130));
    opzioni(c.A_INT, numeri(1, 130));
    opzioni(c.A_DEX, numeri(1, 130));
    opzioni(c.A_LUK, numeri(1, 130));
  }
  c.A_JobLV.length = 0;
  var a = 0;
  a = e == 0 ? 10 : e <= 19 || (41 <= e && e <= 43) ? 50 : e == 20 ? 99 : e > 45 ? 60 : 70;
  opzioni(c.A_JobLV, numeri(1, a));
  if (n_SkillSW) {
    if (n_A_JOB == 45) {
      scrivi("AS12_1", "<S># of Spirit Spheres</S>");
      c.A2_Skill12.disabled = true;
      c.A2_Skill12.value = 0;
      n_A_Buf2[12] = 0;
    } else {
      scrivi("AS12_1", "# of Spirit Spheres");
      c.A2_Skill12.disabled = false;
    }
    if (n_A_JOB == 13 || n_A_JOB == 27) {
      scrivi("AS11_1", "<S>" + skillName(164) + "</S>");
      c.A2_Skill11.disabled = true;
      c.A2_Skill11.value = 0;
      n_A_Buf2[11] = 0;
    } else {
      scrivi("AS11_1", skillName(164));
      c.A2_Skill11.disabled = false;
    }
  }
  if (n_Skill7SW) SetSpeedPotionOptions();
  if (n_A_JOB != 20) SuperNoviceFullWeaponCHECK = 0;
  if (SuperNoviceFullWeaponCHECK) m_JobASPD[20][7] = 1.6;
  else m_JobASPD[20][7] = 0;
  if (n_A_JobClass2() == 8 && n_Nitou == 1) {
    n_Nitou = 0;
    ClickWeaponType2(0);
  }
  WeaponSet(e);
  for (_ = 0; _ <= 20; _++)
    switch (m_JobBuff[e][_]) {
      case 385:
        passiva(_, m_Skill[m_JobBuff[e][_]][2], function () {
          StAllCalc();
          WeaponSet(20);
          restrictCardslot(1);
        });
        break;
      case 392:
        passiva(_, skillName(m_Skill[m_JobBuff[e][_]][0]));
        if (n_Reborn == 0) scrivi("P_Skill" + _, "");
        break;
      case 441:
        passiva(_, m_Skill[m_JobBuff[e][_]][2], function () {
          StAllCalc();
          ClickActiveSkill2();
          calc();
        });
        if (n_Reborn == 0) scrivi("P_Skill" + _, "");
        break;
      case SKILLID.IMPOSITIO_MANUS:
        passiva(_, skillName(SKILLID.IMPOSITIO_MANUS) + " (passive)");
        break;
      default:
        if (m_JobBuff[e][_] != 999) passiva(_, skillName(m_Skill[m_JobBuff[e][_]][0]));
        else {
          contenitore("P_Skill" + _ + "s");
          scrivi("P_Skill" + _, "");
        }
    }
  for (var o = 0; o <= 20; o++) {
    a = m_JobBuff[e][o];
    if (
      NumSearch(
        a,
        [
          12, 68, 152, 253, 258, 301, 309, 310, 322, 345, 364, 365, 379, 383, 385, 386, 390, 420,
          421, 422,
        ],
      )
    ) {
      opzioni((t = c["A_skill" + o]), [[0, "off"]]);
      opzioni(t, [[1, "on"]], 1);
    } else if (a != 999) {
      var t = c["A_skill" + o];
      for (_ = 10; _ >= 0; _--) togliOpzione(t, _);
      opzioni(t, numeri(0, m_Skill[m_JobBuff[e][o]][1]));
      if (m_Skill[m_JobBuff[e][o]][0] == 392) {
        n_ECname = ["off", "eAthena (max stats)", "iRO", "Original"];
        opzioni(
          t,
          serie(0, 3, function (_) {
            return [_, n_ECname[_]];
          }),
        );
        if (n_Reborn == 0) t.style.visibility = "hidden";
      }
    }
  }
  if (m_JobBuff[e][2] == 58) {
    for (_ = 10; _ >= 0; _--) togliOpzione(c.A_skill2, _);
    n_ECname = [
      "0",
      "6% Reduction",
      "12% Reduction",
      "18% Reduction",
      "24% Reduction",
      "30% Reduction",
    ];
    opzioni(
      c.A_skill2,
      serie(0, 5, function (_) {
        return [_, n_ECname[_]];
      }),
    );
  }
  if (m_JobBuff[e][7] == 78) {
    for (_ = 10; _ >= 0; _--) togliOpzione(c.A_skill7, _);
    n_ECname = ["(no Peco)", "0", "1", "2", "3", "4", "5"];
    opzioni(
      c.A_skill7,
      serie(0, 6, function (_) {
        return [_, n_ECname[_]];
      }),
    );
  }
  if (m_JobBuff[e][10] == 78) {
    for (_ = 10; _ >= 0; _--) togliOpzione(c.A_skill10, _);
    n_ECname = ["(no Peco)", "0", "1", "2", "3", "4", "5"];
    opzioni(
      c.A_skill10,
      serie(0, 6, function (_) {
        return [_, n_ECname[_]];
      }),
    );
  }
  if (m_JobBuff[e][15] == 367) {
    for (_ = 10; _ >= 0; _--) togliOpzione(c.A_skill15, _);
    n_ECname = [0, 1, 2, 3, 4, 5, 6, 8, 10];
    opzioni(
      c.A_skill15,
      serie(0, 8, function (_) {
        return [n_ECname[_], 10 * n_ECname[_] + "%"];
      }),
    );
  }
  Askill();
  WeaponSet2();
}
function Askill() {
  var _;
  c.A_ActiveSkill.length = 0;
  if (c.all_dmgSkills.checked)
    opzioni(
      c.A_ActiveSkill,
      serie(0, All_DMGskill.length - 1, function (_) {
        return [All_DMGskill[_], skillNameInSelect(m_Skill[All_DMGskill[_]][0])];
      }),
    );
  else
    opzioni(
      c.A_ActiveSkill,
      m_JobAtkSkill[n_A_JOB].slice(0, m_JobAtkSkill[n_A_JOB].indexOf(999)).map(function (id) {
        return [id, skillNameInSelect(m_Skill[id][0])];
      }),
    );
  for (_ = 0; _ < 20; _++) w_ASSP0bk[_] = 999;
  ActiveSkillSetPlus();
  ClickActiveSkill();
}
function Bskill(e) {
  c.B_AtkSkill.length = 0;
  var mostro = m_Monster[c.B_Enemy.value],
    skill = [[0, "Basic Attack"]];
  for (i = 23; mostro[i] != 0; i += 2)
    skill.push([mostro[i], m_Skill[mostro[i]][2] + " Lvl " + mostro[i + 1]]);
  opzioni(c.B_AtkSkill, skill);
  contenitore("BBSkill");
  if (n_A_Equip[7] == 957 && !e) calc();
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
  n_A_JobSet();
  e = itemData[c.A_weapon1.value].equipType;
  var _ = 0 <= c.A_Arrow.selectedIndex ? c.A_Arrow.options[c.A_Arrow.selectedIndex].text : "";
  c.A_Arrow.disabled = false;
  for (var n = 0; n < 23; n++) togliOpzione(c.A_Arrow, 0);
  if (e == 10 || e == 14 || e == 15) {
    j = 23;
    for (n = 0; n <= 4; n++) m_Arrow[n] = m_Arrow_[n];
  } else if (e == 17 || e == 18 || e == 19 || e == 20) {
    j = 2;
    for (n = 0; n <= 2; n++) m_Arrow[n] = m_Bullet[n];
  } else if (e == 21) {
    j = 4;
    for (n = 0; n <= 4; n++) m_Arrow[n] = m_Grenade[n];
  } else {
    j = 1;
    m_Arrow[0] = [0, 0, "(no arrow)"];
    c.A_Arrow.value = 0;
    c.A_Arrow.disabled = true;
  }
  opzioni(
    c.A_Arrow,
    serie(0, j, function (n) {
      return [n, m_Arrow[n][2]];
    }),
  );
  for (n = 0; n < c.A_Arrow.options.length; n++)
    if (c.A_Arrow.options[n].text == _) {
      c.A_Arrow.selectedIndex = n;
      break;
    }
  if (e == 0) {
    c.A_Weapon_refine.disabled = true;
    c.A_Weapon_refine.value = 0;
  } else c.A_Weapon_refine.disabled = false;
  n_A_JobSet();
  if ((n_A_JOB != 8 && n_A_JOB != 22) || e == 11) {
    scrivi("A_SobWeaponName", "");
    contenitore("A_w2");
    svuotaSinistra();
    n_Nitou = 0;
  } else if (n_Nitou == 0) {
    scrivi("A_SobWeaponName", "Left Hand: ");
    WeaponSetLeft(n_A_JOB);
  }
  n_A_Equip[0] = 1 * c.A_weapon1.value;
  UpdateSpiralPierceWeaponWeight();
  ActiveSkillSetPlus();
  ClickB_Item(n_A_Equip[0]);
}
function ClickWeaponType2(e) {
  n_A_JobSet();
  if (e != 0) {
    if (n_Nitou == 0) {
      contenitore("A_weapon2refine", [
        {
          campo: "A_Weapon2_refine",
          etichetta: "Refine (Left): ",
          gestore: function () {
            StAllCalc();
          },
        },
      ]);
      opzioni(
        c.A_Weapon2_refine,
        serie(0, 10, function (i) {
          return [i, "+" + i];
        }),
      );
      contenitore("A_weapon2_cardshort", [
        {
          campo: "A_cardshortLeft",
          gestore: function () {
            Setm_CardShortLeft();
            Click_Card();
            ActiveSkillSetPlus();
          },
        },
      ]);
      opzioni(c.A_cardshortLeft, [[0, "(card shortcuts)"]]);
      opzioni(
        c.A_cardshortLeft,
        serie(1, 50, function (i) {
          return [i + 1, m_CardShort[i + 1][0]];
        }),
        1,
      );
      for (var k = 1; k <= 4; k++)
        contenitore("nA_weapon2_c" + k, [
          {
            campo: "A_weapon2_card" + k,
            gestore: function () {
              Click_Card(this.value);
            },
          },
        ]);
      opzioni(c.A_weapon2_card1, carte(0));
      opzioni(c.A_weapon2_card2, carte(1));
      opzioni(c.A_weapon2_card3, carte(1));
      opzioni(c.A_weapon2_card4, carte(1));
      opzioni(c.A_weapon2_card4, [[106, "* Top10 ranked"]], 1);
    }
    n_Nitou = 1;
  } else {
    c.A_weapon2.value = 0;
    svuotaSinistra();
    n_Nitou = 0;
  }
  if (n_Nitou) {
    n_A_Equip[1] = 1 * c.A_weapon2.value;
    ActiveSkillSetPlus();
    ClickB_Item(n_A_Equip[1]);
  }
}
function ClickActiveSkill() {
  n_A_ActiveSkill = 1 * c.A_ActiveSkill.value;
  if (n_A_ActiveSkill >= 3000) {
    n_A_ActiveSkillLV = m_EnableSkill[n_A_ActiveSkill - 3000][3];
    n_A_ActiveSkill = m_EnableSkill[n_A_ActiveSkill - 3000][2];
  } else if (n_A_ActiveSkill >= 2000) {
    n_A_ActiveSkillLV = m_AutoSpellSkill[n_A_ActiveSkill - 2000][3];
    n_A_ActiveSkill = m_AutoSpellSkill[n_A_ActiveSkill - 2000][2];
  } else if (n_A_ActiveSkill >= 1500) {
    n_A_ActiveSkillLV = m_EnableSkill[n_A_ActiveSkill - 1500][3];
    n_A_ActiveSkill = m_EnableSkill[n_A_ActiveSkill - 1500][2];
  } else {
    n_A_ActiveSkillLV = m_Skill[n_A_ActiveSkill][1];
    if (
      n_A_JobClass2() == 14 &&
      (SKILLID.WATER_BALL == n_A_ActiveSkill || SKILLID.HEAVENS_DRIVE == n_A_ActiveSkill)
    )
      n_A_ActiveSkillLV = 10;
  }
  var e = c.A_ActiveSkillLV.length;
  for (i = 0; i < e; i++) togliOpzione(c.A_ActiveSkillLV, 0);
  if (n_A_ActiveSkill >= SKILLID.BASIC_ATTACK)
    opzioni(
      c.A_ActiveSkillLV,
      serie(1, n_A_ActiveSkillLV, function (i) {
        return [i, "Lvl " + i];
      }),
    );
  if (m_Skill[n_A_ActiveSkill][1] == 1) c.A_ActiveSkillLV.style.visibility = "hidden";
  else {
    c.A_ActiveSkillLV.style.visibility = "visible";
    c.A_ActiveSkillLV.value = n_A_ActiveSkillLV;
  }
  ClickActiveSkill2();
}
function BClickAtkSkill() {
  if ((n_B_AtkSkill = 1 * c.B_AtkSkill.value) == 444 || n_B_AtkSkill == 445) {
    campoSkill("BBSkill", "BSkillSubNum", "Players in Range: ");
    opzioni(c.BSkillSubNum, numeri(1, 99));
  } else if (n_B_AtkSkill == 489)
    campoSkill("BBSkill", "BSkillSubNum", "Enemy Remaining HP: ", targetData[6]);
  else if (n_B_AtkSkill == 125) {
    campoSkill("BBSkill", "BSkillSubNum", "Meteors landing on Player: ");
    var e;
    e = m_Monster[targetData[0]][2 * c.B_AtkSkill.selectedIndex + 22];
    var _ = 2 + Math.floor(e / 2);
    opzioni(c.BSkillSubNum, numeri(1, _));
    c.BSkillSubNum.value = 2;
  } else if (n_B_AtkSkill == 131) {
    campoSkill("BBSkill", "BSkillSubNum", "Hits: ");
    opzioni(c.BSkillSubNum, numeri(1, 15));
    c.BSkillSubNum.value = 3;
  } else contenitore("BBSkill");
  calc();
  if (n_A_Equip[7] == 957) calc();
}
function ClickActiveSkill2() {
  if (SKILLID.CART_REVOLUTION == n_A_ActiveSkill || SKILLID.HIGH_SPEED_CART_RAM == n_A_ActiveSkill)
    campoSkill("AASkill", "SkillSubNum", "Cart weight: ", "8000");
  else if (SKILLID.STORM_GUST == n_A_ActiveSkill) {
    campoSkill("AASkill", "SkillSubNum", "Hits: ");
    opzioni(c.SkillSubNum, numeri(1, 15));
    c.SkillSubNum.value = 3;
  } else if (SKILLID.VENOM_SPLASHER == n_A_ActiveSkill) {
    campoSkill("AASkill", "SkillSubNum", "Poison React Lvl: ");
    opzioni(c.SkillSubNum, numeri(0, 10));
    c.SkillSubNum.value = 0;
    if (n_A_JobClass2() == 14) c.SkillSubNum.value = 0;
  } else if (SKILLID.GUILLOTINE_FIST == n_A_ActiveSkill) {
    campoSkill("AASkill", "SkillSubNum", "Remaining SP: ", "");
    c.SkillSubNum.value = n_A_MaxSP - 1;
  } else if (SKILLID.THROW_SHURIKEN == n_A_ActiveSkill) {
    campoSkill("AASkill", "SkillSubNum", "");
    opzioni(
      c.SkillSubNum,
      serie(0, 4, function (i) {
        return [i, m_Syuriken[i][2]];
      }),
    );
    c.SkillSubNum.value = 0;
  } else if (SKILLID.THROW_KUNAI == n_A_ActiveSkill) {
    campoSkill("AASkill", "SkillSubNum", "");
    opzioni(
      c.SkillSubNum,
      serie(0, 4, function (i) {
        return [i, m_Kunai[i][2]];
      }),
    );
    c.SkillSubNum.value = 0;
  } else if (SKILLID.KILLING_STROKE == n_A_ActiveSkill) {
    campoSkill("AASkill", "SkillSubNum", "Remaining HP: ", "");
    c.SkillSubNum.value = n_A_MaxHP - 1;
  } else if (SKILLID.DESPERADO == n_A_ActiveSkill) {
    var e = ["1", "1.2", "1.6", "2", "2.4", "3", "3.6", "4", "5", "6", "7", "8", "9", "10"];
    campoSkill("AASkill", "SkillSubNum", "Hits (considering the success chance): ");
    opzioni(
      c.SkillSubNum,
      serie(0, 13, function (i) {
        return [i, e[i] + " hits"];
      }),
    );
    c.SkillSubNum.value = 6;
  } else if (
    !SkillSearch(SKILLID.DOUBLE_BOLT) ||
    (SKILLID.FIRE_BOLT != n_A_ActiveSkill &&
      SKILLID.COLD_BOLT != n_A_ActiveSkill &&
      SKILLID.LIGHTNING_BOLT != n_A_ActiveSkill &&
      SKILLID.FIRE_BOLT_HINDSIGHT != n_A_ActiveSkill &&
      SKILLID.COLD_BOLT_HINDSIGHT != n_A_ActiveSkill &&
      SKILLID.LIGHTNING_BOLT_HINDSIGHT != n_A_ActiveSkill)
  ) {
    if (SKILLID.CHARGE_ATTACK == n_A_ActiveSkill) {
      campoSkill("AASkill", "SkillSubNum", "Enemy distance: ");
      var _ = ["0~3 Cells", "4~6 Cells", "7~9 Cells", "10~12 Cells", "13+ Cells"];
      opzioni(
        c.SkillSubNum,
        serie(0, 4, function (i) {
          return [i, _[i]];
        }),
      );
      c.SkillSubNum.value = 4;
    } else
      switch (n_A_ActiveSkill) {
        case 159:
        case 384:
        case 324:
          campoSkill("AASkill", "SkillSubNum", "Shield weight: ", "");
          c.SkillSubNum.value = itemData[n_A_Equip[5]].weight;
          break;
        case 259:
          campoSkill("AASkill", "SkillSubNum", "Weapon weight: ", "");
          c.SkillSubNum.value = itemData[n_A_Equip[0]].weight;
          break;
        default:
          contenitore("AASkill");
      }
  } else {
    var n = SkillSearch(SKILLID.DOUBLE_BOLT) + 3;
    campoSkill("AASkill", "SkillSubNum", "Double Bolt chance: ");
    opzioni(c.SkillSubNum, [
      [0, "Bad luck (0%)"],
      [n, "Average chance (" + 10 * n + "%)"],
      [10, "Good luck (100%)"],
    ]);
    c.SkillSubNum.value = n;
  }
}
function ClickB_Enemy() {
  targetData = new Array();
  n_B2 = new Array();
  for (i = 0; i <= 22; i++) {
    targetData[i] = m_Monster[c.B_Enemy.value][i];
    n_B2[i] = targetData[i];
  }
  targetData[6] += n_B_manual[30];
  targetData[6] += Math.floor((targetData[6] * n_B_manual[31]) / 100);
  targetData[7] += n_B_manual[49];
  targetData[8] += n_B_manual[48];
  targetData[9] += n_B_manual[50];
  targetData[10] += n_B_manual[51];
  targetData[11] += n_B_manual[52];
  targetData[12] += n_B_manual[40];
  targetData[12] += Math.floor((targetData[12] * n_B_manual[53]) / 100);
  targetData[13] += n_B_manual[40];
  targetData[13] += Math.floor((targetData[13] * n_B_manual[53]) / 100);
  targetData[14] += n_B_manual[34];
  targetData[15] += n_B_manual[35];
  if (targetData[0] == 586) {
    targetData[23] = Math.floor(0.5 * targetData[7]) + Math.floor(0.3 * targetData[7]);
    targetData[24] =
      Math.floor(0.5 * targetData[7]) + Math.floor((targetData[7] * targetData[7]) / 150) - 1;
    if (targetData[23] > targetData[24]) targetData[24] = targetData[23];
  } else {
    n_B2[23] = targetData[7];
    n_B2[24] =
      targetData[7] + (Math.floor(targetData[7] / 20) * Math.floor(targetData[7] / 20) - 1);
    if (n_B2[23] > n_B2[24]) n_B2[24] = n_B2[23];
  }
  scrivi("B_6", targetData[6]);
  scrivi("B_16", targetData[16]);
  scrivi("B_12", targetData[12]);
  scrivi("B_13", targetData[13]);
  scrivi("B_17", targetData[17]);
  scrivi("B_14", targetData[14]);
  scrivi("B_23", targetData[23]);
  scrivi("B_15", targetData[15]);
  scrivi("B_vit", targetData[7]);
  scrivi("B_agi", targetData[8]);
  scrivi("B_int", targetData[9]);
  scrivi("B_dex", targetData[10]);
  scrivi("B_luk", targetData[11]);
  n_B2[23] = targetData[7];
  n_B2[24] = targetData[7] + (Math.floor(targetData[7] / 20) * Math.floor(targetData[7] / 20) - 1);
  if (n_B2[23] > n_B2[24]) n_B2[24] = n_B2[23];
  n_B2[25] = Math.floor(targetData[7] / 2) + targetData[9];
  n_B2[26] = targetData[5] + targetData[10];
  n_B2[27] = targetData[5] + targetData[8];
  if (n_debufSW) {
    n_B_debuf[0] = 1 * c.B_debuf0.value;
    n_B_debuf[1] = 1 * c.B_debuf1.value;
    n_B_debuf[2] = c.B_debuf2.checked;
    n_B_debuf[3] = c.B_debuf3.checked;
    n_B_debuf[4] = c.B_debuf4.checked;
    n_B_debuf[5] = c.B_debuf5.checked;
    n_B_debuf[6] = c.B_debuf6.checked;
    n_B_debuf[7] = c.B_debuf7.checked;
    n_B_debuf[8] = c.B_debuf8.checked;
    n_B_debuf[9] = c.B_debuf9.checked;
    n_B_debuf[10] = c.B_debuf10.checked;
    n_B_debuf[11] = 1 * c.B_debuf11.value;
    n_B_debuf[12] = 1 * c.B_debuf12.value;
    n_B_debuf[17] = c.B_debuf17.checked;
    n_B_debuf[18] = 1 * c.B_debuf18.value;
    n_B_debuf[19] = c.B_debuf19.checked;
    n_B_debuf[20] = c.B_debuf20.checked;
    n_B_debuf[24] = 1 * c.B_debuf24.value;
    n_B_debuf[13] = c.B_debuf13.checked;
    n_B_debuf[14] = c.B_debuf14.checked;
    n_B_debuf[15] = c.B_debuf15.checked;
    n_B_debuf[16] = c.B_debuf16.checked;
    n_B_debuf[21] = c.B_debuf21.checked;
    n_B_debuf[22] = c.B_debuf22.checked;
    n_B_debuf[23] = 1 * c.B_debuf23.value;
    debufSW(n_debufSW);
  }
  if (n_BbufSW) {
    n_B_buf[0] = 1 * c.B_buf0.value;
    n_B_buf[1] = c.B_buf1.checked;
    n_B_buf[2] = c.B_buf2.checked;
    n_B_buf[3] = c.B_buf3.checked;
    n_B_buf[4] = c.B_buf4.checked;
    n_B_buf[5] = 1 * c.B_buf5.value;
    n_B_buf[6] = 1 * c.B_buf6.value;
    n_B_buf[7] = 1 * c.B_buf7.value;
    n_B_buf[8] = 1 * c.B_buf8.value;
    n_B_buf[9] = c.B_buf9.checked;
    n_B_buf[10] = 1 * c.B_buff10.value;
    n_B_buf[11] = 1 * c.B_buff11.value;
    n_B_buf[12] = 1 * c.B_buff12.value;
    n_B_buf[13] = 1 * c.B_buff13.value;
    n_B_buf[14] = 1 * c.B_buff14.value;
  }
  if (n_B_buf[6]) targetData[3] = n_B_buf[6];
  var e = canApplyUaroMeltdownDebuff(targetData);
  if (n_B_debuf[23]) targetData[3] = 10 * n_B_debuf[23] + (targetData[3] % 10);
  if (targetData[19] == 0 && targetData[3] < 90 && n_B_debuf[4]) targetData[3] = 11;
  if (targetData[19] == 0 && targetData[3] < 90 && n_B_debuf[9]) targetData[3] = 21;
  if (n_B_buf[3]) targetData[12] = targetData[13];
  if (targetData[19] == 0 && n_B_debuf[10]) {
    targetData[12] -= Math.floor((25 * targetData[12]) / 100);
    targetData[13] -= Math.floor((25 * targetData[13]) / 100);
  }
  var _,
    n = 0;
  if (targetData[19] == 0 && n_B_debuf[0] != 0 && targetData[3] < 90) n += 2 + 3 * n_B_debuf[0];
  if (n_B_debuf[22]) n += 300;
  if (n_B_buf[4]) n += 200;
  targetData[12] += Math.floor((targetData[12] * n) / 100);
  targetData[13] += Math.floor((targetData[13] * n) / 100);
  if (n_B_debuf[13]) {
    targetData[12] -= Math.floor((25 * targetData[12]) / 100);
    targetData[13] -= Math.floor((25 * targetData[13]) / 100);
  }
  if (e) {
    targetData[12] -= Math.floor((35 * targetData[12]) / 100);
    targetData[13] -= Math.floor((35 * targetData[13]) / 100);
  }
  if (n_B_buf[0]) targetData[8] += 2 + n_B_buf[0];
  if (n_B_debuf[1]) {
    _ = 10 * n_B_debuf[1];
    o = Math.floor(targetData[8] / 2);
    targetData[8] -= o > _ ? _ : o;
  }
  if (targetData[19] == 0 && n_B_debuf[11]) {
    targetData[8] -= n_B_debuf[11] + 2;
    if (targetData[8] < 0) targetData[8] = 0;
  }
  if (n_B_debuf[1]) {
    _ = 10 * n_B_debuf[1];
    o = Math.floor(targetData[10] / 2);
    targetData[10] -= o > _ ? _ : o;
  }
  if (targetData[19] == 0 && n_B_debuf[5] && (targetData[2] == 6 || targetData[3] >= 90))
    targetData[10] = targetData[10] - Math.floor(targetData[10] / 2);
  if (n_B_debuf[15]) targetData[7] -= Math.floor((40 * targetData[7]) / 100);
  if (targetData[19] == 0 && n_B_debuf[5] && (targetData[2] == 6 || targetData[3] >= 90))
    targetData[9] = targetData[9] - Math.floor(targetData[9] / 2);
  if (n_B_debuf[16]) targetData[9] -= Math.floor((40 * targetData[9]) / 100);
  if (targetData[19] == 0 && n_B_debuf[10]) targetData[11] = 0;
  targetData[23] = targetData[7];
  targetData[24] =
    targetData[7] + (Math.floor(targetData[7] / 20) * Math.floor(targetData[7] / 20) - 1);
  if (targetData[23] > targetData[24]) targetData[24] = targetData[23];
  if ((o = n_B_buf[10])) {
    targetData[23] = Math.floor(targetData[23] * (1 + 0.05 * o));
    targetData[24] = Math.floor(targetData[24] * (1 + 0.05 * o));
  }
  targetData[25] = Math.floor(targetData[7] / 2) + targetData[9];
  targetData[26] = targetData[5] + targetData[10];
  targetData[27] = targetData[5] + targetData[8];
  var a = 0;
  if (targetData[19] == 0 && n_B_debuf[0] != 0 && targetData[3] < 90) a += 5 + 5 * n_B_debuf[0];
  if (n_B_debuf[22]) a += 50;
  if (n_B_debuf[24]) a += 5 * n_B_debuf[24];
  if (a > 100) a = 100;
  targetData[14] -= Math.floor((targetData[14] * a) / 100);
  if (targetData[19] == 0 && n_B_debuf[2])
    targetData[14] -= Math.floor((25 * targetData[14]) / 100);
  var o = 0;
  o += bonusValues[290];
  if (targetData[19] == 0) o += bonusValues[291];
  if (targetData[19] == 1) o += bonusValues[292];
  o += bonusValues[300 + targetData[2]];
  if (
    SKILLID.GRAND_CROSS == baseSkillId(n_A_ActiveSkill) ||
    SKILLID.OCCULT_IMPACTION == n_A_ActiveSkill
  )
    o = 0;
  if (o) {
    if (o < 0) o = 0;
    targetData[14] -= Math.floor((targetData[14] * o) / 100);
  }
  if (n_B_debuf[14]) targetData[14] -= Math.floor((15 * targetData[14]) / 100);
  if (targetData[19] == 0 && n_B_debuf[4] && targetData[3] < 90)
    targetData[14] -= Math.floor((50 * targetData[14]) / 100);
  if (targetData[19] == 0 && n_B_debuf[9] && targetData[3] < 90)
    targetData[14] -= Math.floor((50 * targetData[14]) / 100);
  if (n_B_buf[9]) {
    targetData[14] = 90;
    targetData[15] *= 2;
  }
  if (n_B_debuf[12] && (targetData[2] == 6 || targetData[3] >= 90))
    targetData[14] -= Math.floor((targetData[14] * (10 + 4 * n_B_debuf[12])) / 100);
  if (n_B_debuf[20]) targetData[14] = 0;
  if (e) targetData[14] -= Math.floor((35 * targetData[14]) / 100);
  targetData[23] -= Math.floor((targetData[23] * a) / 100);
  targetData[24] -= Math.floor((targetData[24] * a) / 100);
  if (targetData[19] == 0 && n_B_debuf[2]) {
    targetData[23] -= Math.floor((25 * targetData[23]) / 100);
    targetData[24] -= Math.floor((25 * targetData[24]) / 100);
  }
  if (targetData[19] == 0 && n_B_debuf[4] && targetData[3] < 90) {
    targetData[23] -= Math.floor((50 * targetData[23]) / 100);
    targetData[24] -= Math.floor((50 * targetData[24]) / 100);
  }
  if (targetData[19] == 0 && n_B_debuf[9] && targetData[3] < 90) {
    targetData[23] -= Math.floor((50 * targetData[23]) / 100);
    targetData[24] -= Math.floor((50 * targetData[24]) / 100);
  }
  if (n_B_debuf[21]) targetData[24] += 90;
  if (n_B_debuf[20]) {
    targetData[23] = 0;
    targetData[24] = 0;
  }
  if (e) {
    targetData[23] -= Math.floor((35 * targetData[23]) / 100);
    targetData[24] -= Math.floor((35 * targetData[24]) / 100);
  }
  o = 0;
  o += bonusValues[295];
  if ((o += bonusValues[310 + targetData[2]])) {
    if (o < 0) o = 0;
    targetData[15] -= Math.floor((targetData[15] * o) / 100);
  }
  if (targetData[19] == 0 && n_B_debuf[4] && targetData[3] < 90)
    targetData[15] += Math.floor((25 * targetData[15]) / 100);
  if (targetData[19] == 0 && n_B_debuf[9] && targetData[3] < 90)
    targetData[15] += Math.floor((25 * targetData[15]) / 100);
  if (targetData[19] == 0 && n_B_debuf[18] && targetData[3] < 90)
    targetData[25] -= Math.floor((targetData[25] * (12 * n_B_debuf[18])) / 100);
  if (n_B_debuf[21]) targetData[25] = 90;
  targetData[26] += n_B_manual[36];
  if (targetData[19] == 0 && n_B_debuf[3]) {
    targetData[26] -= 25;
    if (targetData[26] < 1) targetData[26] = 1;
  }
  if ((targetData[20] || c.B_AtkRange.value == 2) && c.B_AtkRange.value != 1 && n_A_Buf6[3]) {
    targetData[26] -= 50;
    if (targetData[26] < 1) targetData[26] = 1;
  }
  if (n_B_buf[4]) targetData[26] = 2 * targetData[26];
  targetData[27] += n_B_manual[37];
  if (targetData[19] == 0 && n_B_debuf[3])
    targetData[27] -= Math.floor((25 * targetData[27]) / 100);
  if (n_B_buf[5] != 0) targetData[27] = Math.floor(targetData[27] * (1 + 0.2 * n_B_buf[5]));
  if (n_B_debuf[17]) {
    targetData[27] -= 50;
    if (targetData[27] < 0) targetData[27] = 0;
  }
  if (targetData[19] == 0 && n_B_debuf[4] && targetData[3] < 90) targetData[27] = -19;
  if (targetData[19] == 0 && n_B_debuf[9] && targetData[3] < 90) targetData[27] = -19;
  if (targetData[19] == 0 && (n_B_debuf[7] || n_B_debuf[8])) targetData[27] = -19;
  var t = 100;
  t += StPlusCard(120 + targetData[2]);
  t += StPlusCalc2(120 + targetData[2]);
  var soloBase = 0;
  t +=
    5 * (EquipNumSearch(EQUIPID.AUMDURAS_BENEFIT_B) + EquipNumSearch(EQUIPID.AUMDURAS_BENEFIT_C));
  if (n_A_JobClass() == 3 && CardNumSearch(452) && (targetData[2] == 1 || targetData[2] == 6))
    t += 5;
  if (targetData[2] == 2 && n_A_JobClass() == 4 && CardNumSearch(453)) t += 5;
  // manuali di uaRO (wiki, Server Info): 2 Battle Manual, +50% base e job; 3 Field Manual, +50%
  // base; 4 Field Manual 100%, +100% base. 1 (+25%) delle build vecchie non c'e' su uaRO
  if (n_A_Buf8[1] == 2) t += 50;
  if (n_A_Buf8[1] == 3) soloBase += 50;
  if (n_A_Buf8[1] == 4) soloBase += 100;
  if (n_A_Buf6[2]) t += 100;
  if (c.A8_Skill14.value == 3 || n_A_Buf6[2]) {
    t *= 2;
    soloBase *= 2;
  }
  if (t != 0 || soloBase != 0) {
    targetData[16] = Math.floor((targetData[16] * (t + soloBase)) / 100);
    targetData[17] = Math.floor((targetData[17] * t) / 100);
  }
  if (n_A_Buf8[5]) {
    targetData[16] = Math.floor(targetData[16] / (1 + n_A_Buf8[5]) + 1);
    targetData[17] = Math.floor(targetData[17] / (1 + n_A_Buf8[5]) + 1);
  }
  if (n_A_Buf8[6]) {
    targetData[16] = Math.floor((targetData[16] * (100 + 25 * n_A_Buf8[6])) / 100);
    targetData[17] = Math.floor((targetData[17] * (100 + 25 * n_A_Buf8[6])) / 100);
  }
  if (SkillSearch(SKILLID.SLS_BLESSINGS)) {
    targetData[16] = Math.floor(
      (targetData[16] * (100 + 10 * SkillSearch(SKILLID.SLS_BLESSINGS))) / 100,
    );
    targetData[17] = Math.floor(
      (targetData[17] * (100 + 10 * SkillSearch(SKILLID.SLS_BLESSINGS))) / 100,
    );
  }
  if (n_A_Buf8[7]) targetData[17] = Math.floor(targetData[17] * (1 + n_A_Buf8[7]));
  if (n_A_Buf8[3]) targetData[16] = Math.floor(targetData[16] * (1 + n_A_Buf8[3]));
  if (targetData[19] == 0 && n_A_Buf3[8]) {
    targetData[16] = Math.floor((targetData[16] * (125 + 11 * n_A_Buf3[8])) / 100);
    targetData[17] = Math.floor((targetData[17] * (125 + 11 * n_A_Buf3[8])) / 100);
  }
  targetData[21] = targetData[27] + 20;
  targetData[22] = targetData[26] + 75;
  scrivi("B_AA", " + ");
  scrivi("B_AB", " + ");
  var s = [6, 12, 13, 21, 22, 14, 15, 23, 25],
    u = [16, 17],
    I = "<B style='color:blue'>",
    D = "<B style='color:red'>",
    f = "</B>";
  for (i = 0; i <= 8; i++) {
    var r = targetData[s[i]];
    if (targetData[s[i]] < n_B2[s[i]]) r = I + targetData[s[i]] + f;
    if (targetData[s[i]] > n_B2[s[i]]) r = D + targetData[s[i]] + f;
    scrivi("B_" + s[i], r);
  }
  for (i = 0; i <= 1; i++) {
    r = targetData[u[i]];
    if (targetData[u[i]] < n_B2[u[i]]) r = D + targetData[u[i]] + f;
    if (targetData[u[i]] > n_B2[u[i]]) r = I + targetData[u[i]] + f;
    scrivi("B_" + u[i], r);
  }
  scrivi("B_2", v_Race[targetData[2]]);
  o = Math.floor(targetData[3] / 10);
  if (targetData[3] != n_B2[3])
    scrivi("B_3", "<b>" + D + (v_Element[o] + (targetData[3] % 10)) + f + "</b>");
  else scrivi("B_3", "<b>" + (v_Element[o] + (targetData[3] % 10)) + "</b>");
  scrivi("B_4", v_Size[targetData[4]]);
  scrivi("B_type", v_Type[targetData[19]]);
  targetData[27] += n_B_manual[37];
  if (c.A8_Skill14.value == 1) n_WoE = 1;
  else n_WoE = 0;
  if (n_WoE) targetData[27] = Math.floor(0.8 * targetData[27]);
  n_B_DEF2 = [0, 0, 0];
  n_B_DEF2[2] = targetData[23];
  n_B_DEF2[0] = targetData[24];
  n_B_DEF2[1] = Math.floor((n_B_DEF2[2] + n_B_DEF2[0]) / 2);
  n_B_MDEF2 = targetData[25];
  n_B_HIT = targetData[26];
  n_B_FLEE = targetData[27];
}
function sort(l) {
  for (var A = 1; l[A] != "EOF"; A++)
    for (var n = A; n > 0; n--)
      if (itemData[l[n - 1]].name > itemData[l[n]].name) {
        var s = l[n - 1];
        l[n - 1] = l[n];
        l[n] = s;
      }
  return l;
}
function WeaponSet(l) {
  if (l === void 0) l = n_A_JOB;
  campo(
    "A_weapon1",
    "select",
    function () {
      ClickWeaponType(this.value);
      Click_Item(this.value);
      restrictCardslot(1);
    },
    {
      opzioni: [["0", "(no weapon)"]],
    },
  );
  var A = 1 * c.restrict_lvlequip.checked,
    n = 0;
  for (k = 1; k <= 21; k++)
    if (m_JobASPD[l][k] != 0) {
      var s = new Gruppo();
      s.label = WeaponName[k];
      c.A_weapon1.appendChild(s);
      n_A_JobSet();
      n_A_WeaponType = k;
      work = new Array();
      j = 0;
      for (i = 0; i <= ItemMax; i++)
        if (itemData[i].equipType == n_A_WeaponType) {
          if (
            JobEquipItemSearch(itemData[i].jobMask) == 1 &&
            (itemData[i].requiredLevel <= c.A_BaseLV.value || A == 0)
          ) {
            work[j] = i;
            j++;
          } else if (itemData[i].weaponLevel >= 1 && SuperNoviceFullWeaponCHECK) {
            if (itemData[i].equipType == 1 && itemData[i].weaponLevel == 4) {
              work[j] = i;
              j++;
            }
            if (itemData[i].equipType == 2 || itemData[i].equipType > 3) {
              work[j] = i;
              j++;
            }
          }
        }
      if (j > 0) {
        work[j] = "EOF";
        work = sort(work);
        for (i = 1; i < j + 1; i++) {
          var _ = "";
          if (itemData[work[i - 1]].slots) _ = " [" + itemData[work[i - 1]].slots + "]";
          opzioni(c.A_weapon1, [[itemData[work[i - 1]].id, itemData[work[i - 1]].name + _]], i + n);
          s.appendChild(c.A_weapon1.options[i + n]);
        }
        n += j;
      } else {
        opzioni(c.A_weapon1, [[0, "(Restricted by Base Lvl)"]], n);
        s.appendChild(c.A_weapon1.options[n]);
        n++;
      }
    }
  ClickWeaponType(0);
}
function WeaponSetLeft(l) {
  if (l === void 0) l = n_A_JOB;
  var A = 1 * c.restrict_lvlequip.checked;
  contenitore("A_w2", [
    {
      campo: "A_weapon2",
      gestore: function () {
        ClickWeaponType2(this.value);
        StAllCalc();
        ClickB_Item(this.value);
        restrictCardslot(1);
      },
      opzioni: [["0", "(no weapon)"]],
    },
  ]);
  svuotaSinistra();
  n_Nitou = 0;
  var n = 0;
  for (k = 1; k <= 6; k++)
    if (m_JobASPD[l][k] != 0) {
      var s = new Gruppo();
      s.label = WeaponName[k];
      c.A_weapon2.appendChild(s);
      n_A_JobSet();
      n_A_Weapon2Type = k;
      work = new Array();
      j = 0;
      for (i = 0; i <= ItemMax; i++)
        if (
          itemData[i].equipType == n_A_Weapon2Type &&
          JobEquipItemSearch(itemData[i].jobMask) == 1 &&
          (itemData[i].requiredLevel <= c.A_BaseLV.value || A == 0)
        ) {
          work[j] = i;
          j++;
        }
      if (j > 0) {
        work[j] = "EOF";
        work = sort(work);
        for (i = 1; i < j + 1; i++) {
          var _ = "";
          if (itemData[work[i - 1]].slots) _ = " [" + itemData[work[i - 1]].slots + "]";
          opzioni(c.A_weapon2, [[itemData[work[i - 1]].id, itemData[work[i - 1]].name + _]], i + n);
          s.appendChild(c.A_weapon2.options[i + n]);
        }
        n += j;
      } else {
        opzioni(c.A_weapon1, [[0, "(restricted by Base Lvl)"]], n);
        s.appendChild(c.A_weapon1.options[n]);
        n++;
      }
    }
}
var ELENCHI_ARMATURE = [
  "A_head1",
  "A_head2",
  "A_head3",
  "A_left",
  "A_body",
  "A_shoulder",
  "A_shoes",
  "A_acces1",
  "A_acces2",
];
function WeaponSet2(l) {
  var A = 1 * c.restrict_lvlequip.checked;
  if (!l || A != 1) {
    n_A_JobSet();
    // uaRO: l'originale toglieva options[0] mentre n saliva e la lunghezza scendeva: in fondo
    // al nuovo elenco restava meta' di quello della classe precedente
    for (var campo of ELENCHI_ARMATURE) c[campo].length = 0;
    // uaRO: nell'originale la prima chiamata metteva solo le voci vuote, e gli elenchi si
    // riempivano al primo passaggio del mouse sulla tabella (FirstNovis), che la pagina non ha
    var n,
      s = new Array(),
      _ = 1 * c.restrict_jobequip.checked;
    A = 1 * c.restrict_lvlequip.checked;
    for (n = 0; n <= 7; n++) s[n] = new Array();
    var a = new Array();
    for (n = 0; n <= 7; n++) a[n] = 0;
    for (n = 0; n <= ItemMax; n++)
      if (
        itemData[n].equipType == 50 &&
        (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) == 1 ||
          SuperNoviceFullWeaponCHECK ||
          _ == 0) &&
        (itemData[n].requiredLevel <= n_A_BaseLV || SuperNoviceFullWeaponCHECK || A == 0)
      ) {
        s[0][a[0]] = n;
        a[0]++;
      } else if (
        itemData[n].equipType == 51 &&
        (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) == 1 ||
          SuperNoviceFullWeaponCHECK ||
          _ == 0) &&
        (itemData[n].requiredLevel <= n_A_BaseLV || SuperNoviceFullWeaponCHECK || A == 0)
      ) {
        s[1][a[1]] = n;
        a[1]++;
      } else if (
        itemData[n].equipType == 52 &&
        (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) == 1 ||
          SuperNoviceFullWeaponCHECK ||
          _ == 0) &&
        (itemData[n].requiredLevel <= n_A_BaseLV || SuperNoviceFullWeaponCHECK || A == 0)
      ) {
        s[2][a[2]] = n;
        a[2]++;
      } else if (
        itemData[n].equipType != 61 ||
        (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) != 1 && _ != 0) ||
        !(itemData[n].requiredLevel <= n_A_BaseLV || A == 0)
      ) {
        if (
          itemData[n].equipType != 60 ||
          (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) != 1 && _ != 0) ||
          !(itemData[n].requiredLevel <= n_A_BaseLV || A == 0)
        ) {
          if (
            itemData[n].equipType != 62 ||
            (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) != 1 && _ != 0) ||
            !(itemData[n].requiredLevel <= n_A_BaseLV || A == 0)
          ) {
            if (
              itemData[n].equipType != 63 ||
              (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) != 1 && _ != 0) ||
              !(itemData[n].requiredLevel <= n_A_BaseLV || A == 0)
            ) {
              if (
                itemData[n].equipType == 64 &&
                (JobEquipItemSearch(itemData[n].jobMask, itemData[n].equipType) == 1 || _ == 0) &&
                (itemData[n].requiredLevel <= n_A_BaseLV || A == 0)
              ) {
                s[7][a[7]] = n;
                a[7]++;
              }
            } else {
              s[6][a[6]] = n;
              a[6]++;
            }
          } else {
            s[5][a[5]] = n;
            a[5]++;
          }
        } else {
          s[4][a[4]] = n;
          a[4]++;
        }
      } else {
        s[3][a[3]] = n;
        a[3]++;
      }
    for (n = 0; n <= 7; n++) s[n][a[n]] = "EOF";
    for (var E = 0; E <= 7; E++) s[E] = sort(s[E]);
    // nome con gli slot; s[k] ha a[k] oggetti, ordinati, poi "EOF"; i due accessori hanno lo stesso
    var voce = function (S) {
      var o = itemData[S];
      return [o.id, o.slots ? o.name + " [" + o.slots + "]" : o.name];
    };
    ELENCHI_ARMATURE.forEach(function (campo, k) {
      k = Math.min(k, 7);
      opzioni(c[campo], s[k].slice(0, a[k]).map(voce));
    });
  }
}
function ActiveSkillSetPlus() {
  w_ASSP0 = new Array();
  w_ASSP9 = new Array();
  for (n = 0; n < 20; n++) {
    w_ASSP0[n] = 999;
    w_ASSP9[n] = 0;
  }
  j = 0;
  var l = 0;
  for (n = 0; n <= 20; n++)
    for (const b of itemData[n_A_Equip[n]].bonuses) {
      l = b.value;
      if (Math.abs(b.id) == 220) {
        if (m_EnableSkill[l][1] == 1) {
          w_ASSP0[j] = m_EnableSkill[l][2];
          w_ASSP9[j] = m_EnableSkill[l][0] + 3000;
          j++;
        }
      } else if (Math.abs(b.id) == 221 && m_AutoSpellSkill[l][1] == 1) {
        w_ASSP0[j] = m_AutoSpellSkill[l][2];
        w_ASSP9[j] = m_AutoSpellSkill[l][0] + 2000;
        j++;
      }
    }
  for (n = 0; n <= 25; n++)
    for (j2 = 0; m_Card[n_A_card[n]][4 + j2] != 0; j2 += 2)
      if (m_Card[n_A_card[n]][4 + j2] == 220) {
        if (m_EnableSkill[m_Card[n_A_card[n]][5 + j2]][1] == 1) {
          w_ASSP0[j] = m_EnableSkill[m_Card[n_A_card[n]][5 + j2]][2];
          w_ASSP9[j] = m_Card[n_A_card[n]][5 + j2] + 3000;
          j++;
        }
      } else if (
        m_Card[n_A_card[n]][4 + j2] == 221 &&
        m_AutoSpellSkill[m_Card[n_A_card[n]][5 + j2]][1] == 1
      ) {
        w_ASSP0[j] = m_AutoSpellSkill[m_Card[n_A_card[n]][5 + j2]][2];
        w_ASSP9[j] = m_Card[n_A_card[n]][5 + j2] + 2000;
        j++;
      }
  if (CardNumSearch(164) && (n_A_JOB == 9 || n_A_JOB == 23)) {
    w_ASSP0[j] = 162;
    w_ASSP9[j] = 2095;
    j++;
  }
  if (CardNumSearch(277) && n_A_JobClass() == 1) {
    w_ASSP0[j] = 76;
    w_ASSP9[j] = 2096;
    j++;
  }
  if (EquipNumSearch(EQUIPID.GLORIOUS_CLAW) && n_A_JobClass2() != 9) {
    w_ASSP0[j] = 193;
    w_ASSP9[j] = 2108;
    j++;
  }
  for (var A = [33, 34, 35, 36, 13, 37, 38, 39, 7], n = 0; n <= 8; n++) {
    w_ASSP0[j] = m_EnableSkill[A[n]][2];
    w_ASSP9[j] = A[n] + 1500;
    j++;
  }
  w_ASSP0[j] = m_EnableSkill[40][2];
  w_ASSP9[j] = 1540;
  j++;
  w_ASSPch = 0;
  for (n = 0; n < 20; n++) if (w_ASSP0bk[n] != w_ASSP0[n]) w_ASSPch = 1;
  if (w_ASSPch) {
    if (c.all_dmgSkills.checked) k = c.A_ActiveSkill.length;
    else for (k = 0; m_JobAtkSkill[n_A_JOB][k] != 999; k++);
    for (n = k + 20; n >= k; n--) togliOpzione(c.A_ActiveSkill, n);
    j = 0;
    for (n = k; w_ASSP0[j] != 999; n++, j++) {
      var tipo =
        w_ASSP9[j] >= 3000
          ? " (adquired skill)"
          : w_ASSP9[j] >= 2000
            ? " (auto-casted skill)"
            : w_ASSP9[j] == 1540
              ? " (Yggdrasil Leaf)"
              : w_ASSP9[j] >= 1500
                ? " (scroll)"
                : null;
      if (tipo) opzioni(c.A_ActiveSkill, [[w_ASSP9[j], m_Skill[w_ASSP0[j]][2] + tipo]], n);
    }
  }
  for (n = 0; n < 20; n++) w_ASSP0bk[n] = w_ASSP0[n];
  if (1 * c.A_ActiveSkill.value == 0) c.A_ActiveSkillLV.style.visibility = "hidden";
}
function SetEquipShort() {
  w = 1 * c.A_equipshort.value;
  if (w > 0) {
    if (m_CardShort[w][0] != "Remove All Cards") {
      if (m_CardShort[w][2] != 0) c.A_weapon1_card1.value = m_CardShort[w][2];
      if (m_CardShort[w][3] != 0) c.A_head1_card.value = m_CardShort[w][3];
      if (m_CardShort[w][4] != 0) c.A_left_card.value = m_CardShort[w][4];
      if (m_CardShort[w][5] != 0) c.A_body_card.value = m_CardShort[w][5];
      if (m_CardShort[w][6] != 0) c.A_shoulder_card.value = m_CardShort[w][6];
      if (m_CardShort[w][7] != 0) c.A_shoes_card.value = m_CardShort[w][7];
      if (m_CardShort[w][8] != 0) c.A_acces1_card.value = m_CardShort[w][8];
      if (m_CardShort[w][9] != 0) c.A_acces2_card.value = m_CardShort[w][9];
      if (m_CardShort[w][10] != 0) c.A_head2_card.value = m_CardShort[w][10];
    } else {
      c.A_weapon1_card1.value = 0;
      c.A_weapon1_card2.value = 0;
      c.A_weapon1_card3.value = 0;
      c.A_weapon1_card4.value = 0;
      c.A_head1_card.value = 0;
      c.A_head2_card.value = 0;
      c.A_left_card.value = 0;
      c.A_body_card.value = 0;
      c.A_shoulder_card.value = 0;
      c.A_shoes_card.value = 0;
      c.A_acces1_card.value = 0;
      c.A_acces2_card.value = 0;
    }
    ActiveSkillSetPlus();
  }
}
function Setm_CardShort() {
  w = 1 * c.A_cardshort.value;
  if (w > 0) {
    if (m_CardShort[w][1] < 10000) {
      c.A_weapon1_card1.value = m_CardShort[w][1];
      c.A_weapon1_card2.value = m_CardShort[w][2];
      c.A_weapon1_card3.value = m_CardShort[w][3];
      c.A_weapon1_card4.value = m_CardShort[w][4];
      if (w == 16 || w == 17) {
        w = m_Monster[1 * c.B_Enemy.value][3];
        if (10 <= w && w <= 14) c.A_weapon1_card1.value = 204;
        if ((20 <= w && w <= 24) || (80 <= w && w <= 94)) c.A_weapon1_card1.value = 203;
        if (30 <= w && w <= 34) c.A_weapon1_card1.value = 201;
        if (40 <= w && w <= 44) c.A_weapon1_card1.value = 202;
      }
    } else if (m_CardShort[w][0] != "Remove All Cards") {
      if (m_CardShort[w][2] != 0) c.A_weapon1_card1.value = m_CardShort[w][2];
      if (m_CardShort[w][3] != 0) c.A_head1_card.value = m_CardShort[w][3];
      if (m_CardShort[w][4] != 0) c.A_left_card.value = m_CardShort[w][4];
      if (m_CardShort[w][5] != 0) c.A_body_card.value = m_CardShort[w][5];
      if (m_CardShort[w][6] != 0) c.A_shoulder_card.value = m_CardShort[w][6];
      if (m_CardShort[w][7] != 0) c.A_shoes_card.value = m_CardShort[w][7];
      if (m_CardShort[w][8] != 0) c.A_acces1_card.value = m_CardShort[w][8];
      if (m_CardShort[w][9] != 0) c.A_acces2_card.value = m_CardShort[w][9];
    } else {
      c.A_weapon1_card1.value = 0;
      c.A_weapon1_card2.value = 0;
      c.A_weapon1_card3.value = 0;
      c.A_weapon1_card4.value = 0;
      if (typeof A_weapon2_card1 < "u") {
        c.A_weapon2_card1.value = 0;
        c.A_weapon2_card2.value = 0;
        c.A_weapon2_card3.value = 0;
        c.A_weapon2_card4.value = 0;
      }
      c.A_head1_card.value = 0;
      c.A_head2_card.value = 0;
      c.A_left_card.value = 0;
      c.A_body_card.value = 0;
      c.A_shoulder_card.value = 0;
      c.A_shoes_card.value = 0;
      c.A_acces1_card.value = 0;
      c.A_acces2_card.value = 0;
    }
    ActiveSkillSetPlus();
  }
}
function Setm_CardShortLeft() {
  w = 1 * c.A_cardshortLeft.value;
  if (w > 0) {
    c.A_weapon2_card1.value = m_CardShort[w][1];
    c.A_weapon2_card2.value = m_CardShort[w][2];
    c.A_weapon2_card3.value = m_CardShort[w][3];
    c.A_weapon2_card4.value = m_CardShort[w][4];
    if (w == 16 || w == 17) {
      w = m_Monster[1 * c.B_Enemy.value][3];
      if (10 <= w && w <= 14) c.A_weapon2_card1.value = 204;
      if ((20 <= w && w <= 24) || (80 <= w && w <= 94)) c.A_weapon2_card1.value = 203;
      if (30 <= w && w <= 34) c.A_weapon2_card1.value = 201;
      if (40 <= w && w <= 44) c.A_weapon2_card1.value = 202;
    }
  }
}
function EnemySort() {
  var A, s;
  c.B_Enemy.length = 0;
  ESNum = [1, 3, 2, 21, 22, 16, 17, 13, 4, 14, 15, 19, 100];
  if (1 * c.ENEMY_SORT.value != 0) {
    wES = ESNum[1 * c.ENEMY_SORT.value];
    wESx[0][0] = "S";
    wESx[0][1] = "E";
    STERTw = 0;
    ENDw = 0;
    for (A = 1; A <= EnemyNum; A++) {
      s = ENDw;
      if (m_Monster[A][wES] >= m_Monster[s][wES]) {
        wESx[s][1] = A;
        wESx[A][0] = s;
        wESx[A][1] = "E";
        ENDw = A;
      } else {
        s = STERTw;
        if (m_Monster[A][wES] <= m_Monster[s][wES]) {
          wESx[s][0] = A;
          wESx[A][0] = "S";
          wESx[A][1] = s;
          STERTw = A;
        } else {
          s = STERTw;
          for (jbk = STERTw; m_Monster[A][wES] > m_Monster[s][wES];) {
            jbk = s;
            s = wESx[s][1];
          }
          wESx[jbk][1] = A;
          wESx[A][0] = jbk;
          wESx[A][1] = s;
          wESx[s][0] = A;
        }
      }
    }
    (n = new Array())[0] = A = STERTw;
    for (s = 1; wESx[A][1] != "E"; s++) {
      n[s] = wESx[A][1];
      A = wESx[A][1];
    }
    n = SZ(n);
    ESwork2 = new Array();
    if (wES == 21 || wES == 22 || wES == 14 || wES == 15)
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
    var mostri = [];
    for (A = 0; A <= EnemyNum; A++)
      if (n[A] != -1) mostri.push([n[A], ESwork2[n[A]] + m_Monster[n[A]][1]]);
    opzioni(c.B_Enemy, mostri);
  } else {
    for (var n = new Array(), A = 0; A <= EnemyNum; A++) n[A] = v_MonsterSort[A];
    n = SZ(n);
    var mostri = [];
    for (A = 0; A <= EnemyNum; A++) if (n[A] != -1) mostri.push([n[A], m_Monster[n[A]][1]]);
    opzioni(c.B_Enemy, mostri);
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
// tipo: 0 tutti, 1 MVP, 2 Mini (boss non MVP), 3 gli altri
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
  campo.length = 0;
  opzioni(
    campo,
    [["", "All maps"]].concat(
      mappe.map((x) => {
        var ripetuto = mappe.some((y) => y != x && y[1] == x[1]);
        return [x[0], ripetuto ? x[1] + " (" + x[0] + ")" : x[1]];
      }),
    ),
  );
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
