// Danni fatti e subiti: calc ricalcola tutto il combattimento

// Danni dell'attacco scelto (attacco normale o skill) sul mostro. Ogni calcolo scrive minimo, medio
// e massimo in w_DMG (il medio tiene conto dei colpi mancati), il testo mostrato in InnStr e il
// danno di un attacco in Last_DMG_A e Last_DMG_B; poi CastAndDelay aggiunge i tempi e BattleCalc998
// i colpi per uccidere
function BattleCalc999() {
  azzeraAttacco();
  var skill = n_A_ActiveSkill;
  if (skill == SKILLID.BASIC_ATTACK || (skill == SKILLID.POISON_REACT && mostroVeleno()))
    attaccoNormale();
  else if (skill == SKILLID.FOCUSED_ARROW_STRIKE || skill == SKILLID.SHADOW_SLASH) skillCritica();
  else if (SKILL_FISICHE[skill]) skillFisica(SKILL_FISICHE[skill]);
  else (DANNI_SKILL[skill] || skillMagica)();
  CastAndDelay();
  BattleCalc998();
}
// Poison React su un mostro di elemento Poison e' un attacco normale
function mostroVeleno() {
  return 50 <= targetData[3] && targetData[3] < 60;
}
// valori che ogni attacco imposta da capo; il danno critico si mostra solo per attacco normale,
// Focused Arrow Strike e Shadow Slash
function azzeraAttacco() {
  wCast = 0;
  wHITsuu = 1;
  n_rangedAtk = 0;
  wLAch = 0;
  w_DMG = [0, 0, 0];
  not_use_card = 0;
  cast_kotei = 0;
  str_PerHIT_DMG = 0;
  for (var e = 0; e <= 2; e++) Last_DMG_A[e] = Last_DMG_B[e] = 0;
  str_bSUBname = "";
  str_bSUB = "";
  var skill = n_A_ActiveSkill;
  if (
    skill == SKILLID.BASIC_ATTACK ||
    skill == SKILLID.FOCUSED_ARROW_STRIKE ||
    skill == SKILLID.SHADOW_SLASH ||
    (skill == SKILLID.POISON_REACT && mostroVeleno())
  )
    myInnerHtml("CRIATKname", "Critical damage (Critical rate)", 0);
  else {
    myInnerHtml("CRIATK", "", 0);
    myInnerHtml("CRInum", "", 0);
    myInnerHtml("CRIATKname", "", 0);
  }
  myInnerHtml("bSUB3name", "", 0);
  myInnerHtml("bSUB3", "", 0);
}
// danno di un colpo uguale per Last_DMG_A e Last_DMG_B, aggiunto al testo dei risultati
function scriviDanni(danni) {
  for (var e = 0; e <= 2; e++) {
    Last_DMG_A[e] = Last_DMG_B[e] = danni[e];
    InnStr[e] += danni[e];
  }
}
// w_DMG piu' il veleno di Enchant Deadly Poison o della pozione (EDP_DMG)
function danniConVeleno() {
  return [0, 1, 2].map((e) => w_DMG[e] + EDP_DMG(e));
}

// arco e armi da fuoco
var ARMI_A_DISTANZA = [10, 17, 18, 19, 20, 21];
// attacco normale, anche Poison React su un mostro di elemento Poison
function attaccoNormale() {
  if (n_A_ActiveSkill == SKILLID.BASIC_ATTACK && ARMI_A_DISTANZA.includes(n_A_WeaponType))
    n_rangedAtk = 1;
  if (n_A_ActiveSkill == SKILLID.POISON_REACT) n_Delay[0] = 1;
  TyouEnkakuSousa3dan = 0;
  if (n_Nitou) attaccoDueArmi();
  else attaccoUnArma();
}
// Star Crumb (carta 106) nell'arma sinistra: ATK in piu' che colpisce anche quando si manca
function stelleSinistra() {
  var stelle = 0;
  if (n_A_card[4] == 106 && n_A_card[5] == 106 && n_A_card[6] == 106) stelle += 40;
  else for (var e = 4; e <= 6; e++) if (m_Card[n_A_card[e]][0] == 106) stelle += 5;
  if (n_A_card[7] == 106) stelle += 10;
  return stelle;
}
// attacco normale con due armi: danno della destra piu' quello della sinistra, ridotto da Left
// Hand Mastery
function attaccoDueArmi() {
  n_A_workDEX = Math.floor(n_A_DEX * (1 + 0.2 * (n_A_Weapon2LV - 1)));
  var elemento = Math.max(0, element[targetData[3]][n_A_Weapon2_element]);
  var stelle = stelleSinistra();
  var atkArma = n_A_workDEX >= n_A_Weapon2_ATK ? n_A_Weapon2_ATK : n_A_Weapon2_ATK - 1;
  var massimo = n_A_ATK + n_A_Weapon2LV_Maxplus + Math.floor((atkArma + wImp) * wCSize);
  massimo = Math.max(1, BattleCalc4(massimo, 2, 1));
  massimo = Math.floor(massimo * elemento);
  massimo = Math.floor(((massimo + stelle) * (3 + SkillSearch(SKILLID.LEFT_HAND_MASTERY))) / 10);
  if (n_A_workDEX > n_A_Weapon2_ATK) n_A_workDEX = n_A_Weapon2_ATK;
  var minimo = n_A_ATK + n_A_Weapon2LV_Minplus + Math.floor((n_A_workDEX + wImp) * wCSize);
  minimo = Math.max(1, BattleCalc4(minimo, 0, 1));
  minimo = Math.floor(minimo * elemento);
  minimo = Math.floor((minimo + stelle) * (0.3 + SkillSearch(SKILLID.LEFT_HAND_MASTERY) / 10));
  var medio = (massimo + minimo) / 2;
  var sinistra = [tPlusDamCut(minimo), tPlusDamCut(medio), tPlusDamCut(massimo)];
  // calc lo mostra accanto al critico, ma prima di chiamare BattleCalc999: e' quello del calcolo
  // precedente (come nell'originale)
  wLeft = sinistra;
  ATKmod02(1, 0);
  n_Min_DMG += sinistra[0];
  n_Max_DMG += sinistra[2];

  w_DMG[0] = BattleCalc(n_A_DMG[0], 0);
  var destra = w_DMG[0] + EDP_DMG(0);
  Last_DMG_A[0] = Last_DMG_B[0] = destra + sinistra[0];
  InnStr[0] += Last_DMG_A[0] + " (" + destra + " + " + sinistra[0] + ")";
  if (w998D) {
    str_bSUBname += "Double Attack damage (chance)<BR>";
    str_bSUB += 2 * destra + sinistra[0] + "~";
  }
  if (destra + sinistra[0] < n_Min_DMG && critChance < 100) n_Min_DMG = destra + sinistra[0];
  w_DMG[0] = n_Min_DMG;

  w_DMG[2] = BattleCalc(n_A_DMG[2], 2);
  destra = w_DMG[2] + EDP_DMG(2);
  Last_DMG_A[2] = Last_DMG_B[2] = destra + sinistra[2];
  InnStr[2] += Last_DMG_A[2] + " (" + destra + " + " + sinistra[2] + ")";
  // senza Double Attack il massimo si confronta con la sola destra (come nell'originale)
  var piuAlto = destra;
  if (w998D) {
    piuAlto = 2 * destra + sinistra[2];
    str_bSUB += piuAlto + " (" + w998D + "%)<BR>";
  }
  if (piuAlto > n_Max_DMG && critChance < 100) n_Max_DMG = piuAlto;
  w_DMG[2] = n_Max_DMG;

  w_DMG[1] = BattleCalc(n_A_DMG[1], 1);
  destra = w_DMG[1] + EDP_DMG(1);
  Last_DMG_A[1] = Last_DMG_B[1] = destra + sinistra[1];
  InnStr[1] += Last_DMG_A[1] + " (" + destra + " + " + sinistra[1] + ")";
  w_DMG[1] = BattleCalc3(w_DMG[1]) + BattleCalc3left(sinistra[1]) + EDP_DMG(1);

  var mancato = BattleCalc2(0);
  var stelleMancato = Math.floor(stelle * (0.3 + SkillSearch(SKILLID.LEFT_HAND_MASTERY) / 10));
  n_PerHIT_DMG = mancato + stelleMancato;
  str_PerHIT_DMG = mancato + "+" + stelleMancato;
}
// attacco normale con un'arma: Raging Trifecta Blow, la parte in piu' del katar con Double
// Attack, il falco con Blitz Beat
function attaccoUnArma() {
  var falco = BattleTAKA();
  var triplo = SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW) ? ragingTrifectaBlow() : null;
  ATKmod02(1, 0);
  for (var e = 0; e <= 2; e++) w_DMG[e] = BattleCalc(n_A_DMG[e], e);
  var katar = [0, 0, 0],
    katarMedio = 0;
  if (n_A_WeaponType == 11) {
    for (e = 0; e <= 2; e++)
      katar[e] = Math.floor(
        (w_DMG[e] + EDP_DMG(e)) * (0.01 + 0.02 * SkillSearch(SKILLID.DOUBLE_ATTACK)),
      );
    katarMedio = Math.floor(w_DMG[1] * (0.01 + 0.02 * SkillSearch(SKILLID.DOUBLE_ATTACK)));
  }
  for (e = 0; e <= 2; e++) {
    Last_DMG_B[e] = w_DMG[e] + EDP_DMG(e);
    Last_DMG_A[e] = Last_DMG_B[e] + katar[e];
    if (n_A_WeaponType == 11)
      InnStr[e] = Last_DMG_A[e] + " (" + Last_DMG_B[e] + "+" + katar[e] + ")";
    else InnStr[e] += Last_DMG_A[e];
  }

  if (Last_DMG_A[0] < n_Min_DMG && critChance < 100) n_Min_DMG = Last_DMG_A[0];
  if (w998D) {
    str_bSUBname += chainAction()
      ? "Chain Action damage (chance)<BR>"
      : "Double Attack damage (chance)<BR>";
    str_bSUB += 2 * Last_DMG_A[0] + "~";
  }
  w_DMG[0] = n_Min_DMG;

  n_Max_DMG += n_TAKA_DMG;
  var piuAlto = Last_DMG_A[2] + n_TAKA_DMG;
  if (n_Max_DMG < piuAlto && critChance < 100) n_Max_DMG = piuAlto;
  if (w998D) {
    var doppio = 2 * Last_DMG_A[2];
    str_bSUB += doppio + " (" + w998D + "%)<BR>";
    if (n_Max_DMG < doppio + n_TAKA_DMG) n_Max_DMG = doppio + n_TAKA_DMG;
  }
  w_DMG[2] = n_Max_DMG;

  if (triplo) TyouEnkakuSousa3dan = triplo[1];
  w_DMG[1] = BattleCalc3(w_DMG[1] + katarMedio) + falco + EDP_DMG(1);
}
// Raging Trifecta Blow, che scatta al posto dell'attacco normale: danno nei risultati secondari e
// nel minimo e massimo
function ragingTrifectaBlow() {
  var lv = SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW);
  TyouEnkakuSousa3dan = -1;
  var triplo = [0, 0, 0];
  for (var e = 0; e <= 2; e++) {
    triplo[e] = BattleCalc(n_A_DMG[e] * (1 + 0.2 * lv), e) + EDP_DMG(e);
    triplo[e] = 3 * Math.floor(triplo[e] / 3);
    if (targetData[19] == 5) triplo[e] = 3;
  }
  var probabilita = 30 - lv;
  if (SkillSearch(SKILLID.SLS_TEAM_UP)) probabilita *= 1.5 + 0.5 * SkillSearch(SKILLID.SLS_TEAM_UP);
  str_bSUBname += skillName(SKILLID.RAGING_TRIFECTA_BLOW) + " damage<BR>";
  str_bSUB += triplo[0] + "~" + triplo[2] + " (" + probabilita + "% chance)<BR>";
  TyouEnkakuSousa3dan = 0;
  if (n_Min_DMG > triplo[0]) n_Min_DMG = triplo[0];
  if (n_Max_DMG < triplo[2]) n_Max_DMG = triplo[2];
  return triplo;
}
// il secondo colpo con il revolver e' Chain Action, se nient'altro da' Double Attack
function chainAction() {
  return (
    n_A_WeaponType == 17 &&
    SkillSearch(SKILLID.CHAIN_ACTION) &&
    !(
      CardNumSearch(43) ||
      n_A_Equip[2] == 570 ||
      n_A_Equip[2] == 1442 ||
      n_A_Equip[2] == 1443 ||
      n_A_Equip[2] == 1321 ||
      (EquipNumSearch(EQUIPID.WANDERERS_SAKKAT_PLUS_WANDERERS_COAT) && n_A_SHOULDER_REFINE >= 5)
    )
  );
}

// Focused Arrow Strike e Shadow Slash: skill che possono essere critiche
function skillCritica() {
  var lv = n_A_ActiveSkillLV,
    mod = 1;
  if (n_A_ActiveSkill == SKILLID.FOCUSED_ARROW_STRIKE) {
    n_rangedAtk = 1;
    mod += 1 + 0.5 * lv;
    wCast = 2 * n_A_CAST;
    n_Delay[2] = 1.5;
  } else {
    n_Delay[0] = 1;
    n_rangedAtk = 0;
    mod += lv - 1;
  }
  for (var e = 0; e <= 2; e++) n_A_CriATK[e] = BK_n_A_CriATK[e];
  ATKmod02(mod, 1);
  wCriTyuu = 1;
  for (e = 0; e <= 2; e++) n_A_CriATK[e] = BattleCalc(n_A_CriATK[e], 10);
  wCriTyuu = 0;
  for (e = 0; e <= 2; e++) n_A_CriATK[e] += EDP_DMG(e);
  if (critChance >= 100) n_Min_DMG = n_A_CriATK[0];
  if (critChance > 0) n_Max_DMG = n_A_CriATK[2];
  myInnerHtml("CRIATK", n_A_CriATK[0] + "~" + n_A_CriATK[2], 0);
  ATKmod02(mod, 0);
  for (e = 0; e <= 2; e++) w_DMG[e] = BattleCalc(n_A_DMG[e], e);
  scriviDanni(danniConVeleno());
  if (critChance >= 100) w_DMG[0] = n_Min_DMG;
  if (critChance > 0) w_DMG[2] = n_Max_DMG;
  w_DMG[1] = BattleCalc3(w_DMG[1]);
  EDPplus(1);
}

// skill fisiche con il calcolo dell'attacco normale: SKILL_FISICHE prepara elemento, ritardi e
// lancio e porta il moltiplicatore dell'ATK (s.mod) e i colpi in cui si divide il danno (s.colpi)
function skillFisica(prepara) {
  var s = { mod: 1, colpi: 1 };
  prepara(s, n_A_ActiveSkillLV);
  ATKmod02(s.mod, 0);
  if (n_A_ActiveSkill != SKILLID.TRACKING && n_A_ActiveSkill != SKILLID.CROWD_CONTROL_SHOT)
    wCast *= n_A_CAST;
  for (var e = 0; e <= 2; e++) {
    w_MagiclBulet = e;
    w_DMG[e] = BattleCalc(n_A_DMG[e], e);
    if (s.colpi > 1) w_DMG[e] = Math.floor(w_DMG[e] / s.colpi) * s.colpi;
    Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e] + EDP_DMG(e);
    InnStr[e] += Last_DMG_A[e];
    if (n_A_ActiveSkill == SKILLID.SMITE && senzaScudo()) {
      w_DMG[e] = 0;
      InnStr[e] = w_DMG[e] + " (no shield equiped)";
    }
    if (s.colpi > 1) InnStr[e] += " (" + w_DMG[e] / s.colpi + " x " + s.colpi + " hits)";
  }
  w_MagiclBulet = 1;
  w_DMG[1] = (w_DMG[1] * w_HIT + BattleCalc2(0) * (100 - w_HIT)) / 100;
  EDPplus(1);
}
function senzaScudo() {
  return itemData[n_A_Equip[5]].id == 305;
}
// elemento della freccia, o quello scelto a mano
function elementoFreccia() {
  n_A_Weapon_element = m_Arrow[n_A_Arrow][1];
  if (1 * c.A_Weapon_element.value != 0) n_A_Weapon_element = 1 * c.A_Weapon_element.value;
}
// ritardi delle combo del Monk
function ritardoMonaco(base) {
  n_Delay[0] = 1;
  n_Delay[1] = 0.1;
  n_Delay[3] = base - 0.004 * n_A_AGI - 0.002 * n_A_DEX;
}
function heat(s, lv) {
  n_Delay[5] = targetData[19] == 1 ? 0.1 : 0.05;
  if (PvP == 1) {
    n_Delay[0] = 1;
    str_bSUBname += "SP damage<BR>";
    str_bSUB += "15<BR>";
  }
}
// prepara(s, lv) per skill: s.mod e s.colpi partono da 1
var SKILL_FISICHE = {
  [SKILLID.BASH]: function (s, lv) {
    s.mod += 0.3 * lv;
  },
  [SKILLID.MAGNUM_BREAK]: function (s, lv) {
    s.mod += 0.2 * lv;
    n_A_Weapon_element = 3;
    n_Delay[2] = 2;
  },
  [SKILLID.SAND_ATTACK]: function (s, lv) {
    not_use_card = 1;
    s.mod += 0.3;
    n_A_Weapon_element = 2;
  },
  [SKILLID.ARROW_SHOWER]: function (s, lv) {
    n_rangedAtk = 1;
    s.mod += 0.05 * lv - 0.25;
    n_Delay[2] = 1;
  },
  [SKILLID.ARROW_REPEL]: function (s, lv) {
    n_rangedAtk = 1;
    wCast = 1.5;
    s.mod += 0.5;
  },
  [SKILLID.MAMMONITE]: function (s, lv) {
    s.mod += 0.5 * lv;
  },
  [SKILLID.SPEAR_STAB]: function (s, lv) {
    s.mod += 0.2 * lv;
    n_rangedAtk = 1;
  },
  [SKILLID.GRIMTOOTH]: function (s, lv) {
    if (lv >= 3) n_rangedAtk = 1;
    s.mod += 0.2 * lv;
  },
  [SKILLID.SMITE]: function (s, lv) {
    s.mod += 0.2 * lv;
    if (senzaScudo()) s.mod = 0;
  },
  [SKILLID.HOLY_CROSS]: function (s, lv) {
    s.mod += 0.35 * lv;
    n_A_Weapon_element = 6;
  },
  // doppio danno con le lance a due mani
  [SKILLID.HOLY_CROSS_UARO]: function (s, lv) {
    s.mod += 0.35 * lv;
    if (n_A_WeaponType == 5) s.mod *= 2;
    n_A_Weapon_element = 6;
  },
  [SKILLID.SIGHTLESS_MIND]: function (s, lv) {
    s.mod += 0.4 * lv;
  },
  [SKILLID.SPEAR_BOOMERANG]: function (s, lv) {
    s.mod += 0.5 * lv;
    n_Delay[2] = 1;
    n_rangedAtk = 1;
  },
  [SKILLID.BRANDISH_SPEAR]: function (s, lv) {
    var a = 1 + 0.2 * lv;
    if (lv == 10) s.mod += 4.625;
    else if (lv >= 7) s.mod += a + a / 2 + a / 4 - 1;
    else if (lv >= 4) s.mod += a + a / 2 - 1;
    else s.mod += a - 1;
    wCast = 0.7;
  },
  [SKILLID.SONIC_BLOW]: function (s, lv) {
    s.colpi = 8;
    s.mod += 0.5 * lv + 2;
    n_Delay[3] = 2;
  },
  // doppio danno, x 1,25 in WoE
  [SKILLID.SONIC_BLOW_SOUL_LINKED]: function (s, lv) {
    s.colpi = 8;
    s.mod += 0.5 * lv + 2;
    if (PvP == 0) s.mod *= 2;
    if (PvP == 1) s.mod *= n_WoE ? 1.25 : 2;
    n_Delay[3] = 2;
  },
  [SKILLID.FREEZING_TRAP]: function (s, lv) {
    n_Delay[0] = 1;
    not_use_card = 1;
    n_A_Weapon_element = 1;
  },
  [SKILLID.BACK_STAB]: function (s, lv) {
    s.mod += 0.4 * lv + 2;
    // uaRO: ricarica fissa di 0,333 secondi al posto del ritardo dopo il lancio (Class
    // Changes, Rogue; patch del 01/04/2026)
    n_Delay[3] = 0.333;
    w_HIT = 100;
    w_HIT_HYOUJI = 100;
  },
  [SKILLID.GANK]: function (s, lv) {
    s.mod += 0.3 * lv;
    n_Delay[2] = 1;
  },
  [SKILLID.RAGING_QUADRUPLE_BLOW]: function (s, lv) {
    s.colpi = 4;
    s.mod += 0.5 + 0.5 * lv;
    ritardoMonaco(1);
  },
  [SKILLID.RAGING_THRUST]: function (s, lv) {
    s.mod += 1.4 + 0.6 * lv;
    ritardoMonaco(0.7);
  },
  [SKILLID.MELODY_STRIKE]: function (s, lv) {
    wCast = 1.5;
    s.mod += 0.4 * lv - 0.4;
    elementoFreccia();
    n_rangedAtk = 1;
  },
  [SKILLID.SLINGING_ARROW]: function (s, lv) {
    SKILL_FISICHE[SKILLID.MELODY_STRIKE](s, lv);
  },
  [SKILLID.BOMB]: function (s, lv) {
    not_use_card = 1;
    n_A_Weapon_element = 3;
    n_Delay[0] = 1;
    wCast = 1;
    s.mod += 0.2 * lv;
    w_HIT = 100;
    w_HIT_HYOUJI = 100;
  },
  [SKILLID.TRAUMATIC_BLOW]: function (s, lv) {
    n_rangedAtk = 1;
    s.mod += 0.4 * lv;
    n_Delay[2] = 0.5;
  },
  [SKILLID.VITAL_STRIKE]: function (s, lv) {
    n_rangedAtk = 1;
    s.mod += 0.1 * lv - 0.5;
    n_Delay[2] = lv > 5 ? 1 : 0.8;
  },
  [SKILLID.METEOR_ASSAULT]: function (s, lv) {
    not_use_card = 1;
    s.mod += 0.4 * lv - 0.6;
    wCast = 0.5;
    n_Delay[2] = 0.5;
  },
  [SKILLID.RAGING_PALM_STRIKE]: function (s, lv) {
    s.mod += 1 + lv;
    n_Delay[2] = 0.3;
  },
  [SKILLID.GLACIER_FIST]: function (s, lv) {
    s.mod += lv - 0.6;
    ritardoMonaco(0.7);
  },
  [SKILLID.CHAIN_CRUSH_COMBO]: function (s, lv) {
    n_Delay[0] = 1;
    s.mod += 3 + lv;
    n_Delay[2] = lv > 6 ? 1 : 0.8;
  },
  [SKILLID.ARROW_VULCAN]: function (s, lv) {
    s.colpi = 9;
    s.mod += 1 + lv;
    elementoFreccia();
    n_rangedAtk = 1;
    wCast = 1.8 + 0.2 * lv;
    if (n_A_Equip[0] == EQUIPID.GREEN_WHISTLE || n_A_Equip[0] == EQUIPID.STEM_WHIP)
      wCast = Math.max(0, wCast - 2);
    n_Delay[2] = lv >= 6 ? 1 : 0.8;
    // uaRO: Arrow Vulcan: ritardo di 2 secondi, non 3 (Class Changes, Bard/Dancer; patch del
    // 24/11/2025)
    n_Delay[3] = 2;
  },
  [SKILLID.TOMAHAWK_THROWING]: function (s, lv) {
    n_rangedAtk = 1;
    not_use_card = 1;
    n_A_Weapon_element = 4;
  },
  [SKILLID.PULSE_STRIKE]: function (s, lv) {
    s.mod += lv - 1;
  },
  [SKILLID.THROW_VENOM_KNIFE]: function (s, lv) {
    n_rangedAtk = 1;
    not_use_card = 1;
    n_A_DMG[1] += Math.floor(14.5 * wCSize);
    n_A_DMG[2] += Math.floor(29 * wCSize);
  },
  [SKILLID.PHANTASMIC_ARROW]: function (s, lv) {
    n_rangedAtk = 1;
    not_use_card = 1;
    s.mod += 0.5;
  },
  // fascia di distanza dal nemico (0-4) nel campo della skill
  [SKILLID.CHARGE_ATTACK]: function (s, lv) {
    var celle = 1 * c.SkillSubNum.value;
    s.mod += celle;
    wCast = Math.min(1.5, 0.5 * (celle + 1));
  },
  [SKILLID.HEAT]: function (s, lv) {
    n_Delay[0] = 1;
    heat(s, lv);
  },
  [SKILLID.HEAT_NO_PUSHBACK]: heat,
  // peso del carro nel campo della skill; 0 = calcolo senza carro
  [SKILLID.HIGH_SPEED_CART_RAM]: function (s, lv) {
    not_use_card = 1;
    var peso = 1 * c.SkillSubNum.value;
    var thrust = SkillSearch(SKILLID.POWER_THRUST),
      maximum = SkillSearch(SKILLID.MAXIMUM_POWER_THRUST);
    if (peso == 0) {
      if (thrust) s.mod += 0.146 + Math.floor((((bonusValues[22] + 5 * thrust) / 100) * 100) / 100);
      if (maximum)
        s.mod += 0.215 + Math.floor((((bonusValues[22] + 10 * maximum) / 100) * 100) / 100);
    } else
      s.mod +=
        0.02 +
        Math.floor(
          (((peso / (16 - lv) + bonusValues[22] + 5 * thrust + 20 * maximum) / 100) * 100) / 100,
        );
  },
  [SKILLID.EXCRUCIATING_PALM]: function (s, lv) {
    not_use_card = 1;
    s.mod += 2;
  },
  [SKILLID.TORNADO_KICK]: function (s, lv) {
    n_Delay[0] = 1;
    s.mod += 0.6 + 0.2 * lv;
  },
  [SKILLID.HEEL_DROP]: function (s, lv) {
    SKILL_FISICHE[SKILLID.TORNADO_KICK](s, lv);
  },
  [SKILLID.ROUNDHOUSE]: function (s, lv) {
    n_Delay[0] = 1;
    s.mod += 0.9 + 0.3 * lv;
  },
  [SKILLID.COUNTER_KICK]: function (s, lv) {
    SKILL_FISICHE[SKILLID.ROUNDHOUSE](s, lv);
    s.colpi = 3;
  },
  [SKILLID.FLYING_KICK_2]: function (s, lv) {
    n_Delay[0] = 1;
    s.mod += 0.1 * lv - 0.7;
  },
  [SKILLID.FLYING_KICK]: function (s, lv) {
    n_Delay[0] = 1;
    if (SkillSearch(SKILLID.SPRINT_STR_STATE) && n_A_WeaponType == 0)
      s.mod += 0.08 * n_A_BaseLV - 1;
    else s.mod += 0.04 * n_A_BaseLV - 1;
  },
  [SKILLID.FLIP_TATAMI]: function (s, lv) {
    s.mod += 0.1 * lv;
    n_Delay[2] = 3;
  },
  [SKILLID.HAZE_SLASHER]: function (s, lv) {
    n_Delay[0] = 1;
    s.mod += 0.1 * lv;
    n_Delay[2] = 1;
  },
  // ATK x 5 in piu' su mostri Brute e Demi-Human
  [SKILLID.BULLS_EYE]: function (s, lv) {
    not_use_card = 1;
    wCast = 0.5;
    n_Delay[2] = 1;
    n_rangedAtk = 1;
    s.colpi = 5;
    if (targetData[2] == 2 || targetData[2] == 7) s.mod += 4;
  },
  [SKILLID.MAGICAL_BULLET]: function (s, lv) {
    n_rangedAtk = 1;
    n_Delay[2] = 0.5;
    n_A_Weapon_element = 8;
    not_use_card = 1;
  },
  [SKILLID.TRIGGER_HAPPY_SHOT]: function (s, lv) {
    n_rangedAtk = 1;
    s.colpi = 5;
    s.mod += 0.5 * lv + 4;
    n_Delay[2] = 0.75;
  },
  // tempo di lancio fisso (cast_kotei), piu' breve con Soldier Rifle e Glorious Rifle
  [SKILLID.TRACKING]: function (s, lv) {
    var lancio =
      n_A_Weapon_refine > 8 && EquipNumSearch(EQUIPID.GLORIOUS_RIFLE)
        ? 1.25
        : EquipNumSearch(EQUIPID.SOLDIER_RIFLE)
          ? 0.75
          : 1;
    wCast = Math.floor(100 * (1 + 0.2 * lv) * lancio) / 100;
    cast_kotei = 1;
    n_rangedAtk = 1;
    s.mod += lv + 1;
    w_HIT = Math.min(100, 5 * w_HIT + 5);
    w_HIT_HYOUJI = w_HIT;
  },
  [SKILLID.DISARM]: function (s, lv) {
    wCast = 2;
    n_Delay[2] = 1;
    n_rangedAtk = 1;
  },
  [SKILLID.WOUNDING_SHOT]: function (s, lv) {
    wCast = 1.5;
    n_rangedAtk = 1;
    s.mod += 0.2 * lv;
    n_Delay[2] = 0.5;
    w_HIT = 100;
    w_HIT_HYOUJI = 100;
  },
  [SKILLID.CROWD_CONTROL_SHOT]: function (s, lv) {
    wCast = 1;
    n_rangedAtk = 0;
    s.mod += 0.5 * lv;
    n_Delay[3] = 1;
  },
  [SKILLID.FULL_BLAST]: function (s, lv) {
    n_rangedAtk = 1;
    s.mod += lv + 2;
    n_Delay[2] = Math.min(2, 1 + 0.2 * lv);
  },
  [SKILLID.SPREAD_SHOT]: function (s, lv) {
    n_rangedAtk = 1;
    s.mod += 0.2 * lv - 0.2;
    wCast = 1;
    n_Delay[2] = 1;
  },
  [SKILLID.GUNSLINGER_MINE]: function (s, lv) {
    n_rangedAtk = 1;
    not_use_card = 1;
    wCast = 1;
    n_Delay[2] = 1;
  },
};

// skill con un calcolo loro; le altre sono in SKILL_FISICHE o sono magie (skillMagica)
var DANNI_SKILL = {
  [SKILLID.STAVE_CRASHER]: staveCrasher,
  [SKILLID.MAGIC_CRASHER_UARO]: staveCrasher,
  [SKILLID.DOUBLE_STRAFE]: colpiMultipli,
  [SKILLID.PIERCE]: colpiMultipli,
  [SKILLID.THROW_SPIRIT_SPHERES]: colpiMultipli,
  [SKILLID.BOWLING_BASH]: colpiMultipli,
  [SKILLID.TRIPLE_ACTION]: colpiMultipli,
  [SKILLID.BEAST_CHARGE]: colpiMultipli,
  [SKILLID.DESPERADO]: colpiMultipli,
  [SKILLID.BLITZ_BEAT]: falco,
  [SKILLID.FALCON_ASSAULT]: falco,
  [SKILLID.ENVENOM]: envenom,
  [SKILLID.POISON_REACT]: envenom,
  [SKILLID.SHIELD_BOOMERANG]: shieldBoomerang,
  [SKILLID.SHIELD_BOOMERANG_SOUL_LINKED]: shieldBoomerang,
  [SKILLID.RAPID_SMITING]: rapidSmiting,
  [SKILLID.CLASHING_SPIRAL]: clashingSpiral,
  [SKILLID.VENOM_SPLASHER]: venomSplasher,
  [SKILLID.SOUL_DESTROYER]: soulDestroyer,
  [SKILLID.GRAND_CROSS]: grandCross,
  [SKILLID.GRAND_CROSS_UARO]: grandCross,
  [SKILLID.CART_REVOLUTION]: cartRevolution,
  [SKILLID.GLORIA_DOMINI]: gloriaDomini,
  [SKILLID.MARTYRS_RECKONING]: martyrsReckoning,
  [SKILLID.OCCULT_IMPACTION]: occultImpaction,
  [SKILLID.GUILLOTINE_FIST]: guillotineFist,
  [SKILLID.GUILLOTINE_FIST_MAX_SP]: guillotineFist,
  [SKILLID.THROW_SHURIKEN]: throwShuriken,
  [SKILLID.THROW_KUNAI]: throwKunai,
  [SKILLID.THROW_HUUMA_SHURIKEN]: throwHuumaShuriken,
  [SKILLID.THROW_COINS]: throwCoins,
  [SKILLID.KILLING_STROKE]: killingStroke,
  [SKILLID.FINAL_STRIKE_MAX_HP]: killingStroke,
  [SKILLID.ACID_TERROR]: acidTerror,
  [SKILLID.ACID_BOMB]: acidBomb,
  [SKILLID.LAND_MINE]: trappola,
  [SKILLID.BLAST_MINE]: trappola,
  [SKILLID.CLAYMORE_TRAP]: trappola,
  [SKILLID.HEAL]: heal,
  [SKILLID.SANCTUARY]: sanctuary,
  [SKILLID.TURN_UNDEAD]: turnUndead,
  [SKILLID.RESURRECTION]: turnUndead,
  [SKILLID.GRAVITY_FIELD]: gravityField,
  [SKILLID.COIN_FLING]: coinFling,
};

// Stave Crasher e Magic Crasher di uaRO
function staveCrasher() {
  n_rangedAtk = 1;
  wCast = 0.3 * n_A_CAST;
  n_Delay[2] = 0.3;
  for (var e = 0; e <= 2; e++) {
    if (n_A_ActiveSkill == SKILLID.MAGIC_CRASHER_UARO)
      w_DMG[e] = BattleCalc(2 * (BK_n_A_MATK[0] + BK_n_A_DMG[e] - n_A_ATK), e);
    else {
      w_DMG[e] = BattleCalc(BK_n_A_MATK[e] * (1 + 0.05 * n_A_Buf2[8]), e) - 1;
      if (n_A_WeaponType == 0) w_DMG[1] = w_DMG[2] = w_DMG[0];
    }
    Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e] + EDP_DMG(e);
    InnStr[e] += Last_DMG_A[e];
  }
  n_PerHIT_DMG = BattleCalc2(0) + n_A_WeaponLV_refineATK;
  w_DMG[1] = (w_DMG[1] * w_HIT + n_PerHIT_DMG * (100 - w_HIT)) / 100;
  EDPplus(1);
}
// skill che colpiscono piu' volte (wHITsuu); Double Strafe calcola i due colpi insieme
function colpiMultipli() {
  var skill = n_A_ActiveSkill,
    lv = n_A_ActiveSkillLV,
    mod = 1;
  if (skill == SKILLID.DOUBLE_STRAFE) {
    n_rangedAtk = 1;
    mod += 0.1 * lv - 0.1;
    wHITsuu = 2;
  } else if (skill == SKILLID.PIERCE) {
    mod += 0.1 * lv;
    wHITsuu = targetData[4] + 1;
  } else if (skill == SKILLID.BOWLING_BASH) {
    mod += 0.4 * lv;
    wCast = 0.7 * n_A_CAST;
    wLAch = 1;
    // un colpo in piu' sul mostro con Lex Aeterna (n_B_debuf[6])
    wHITsuu = (lv == 1 ? 1 : 2) + (n_B_debuf[6] == 1 ? 1 : 0);
  } else if (skill == SKILLID.THROW_SPIRIT_SPHERES) {
    mod += 0.5 * lv;
    var sfere = n_A_Buf2[12];
    if (sfere > lv) sfere = lv;
    wHITsuu = sfere;
    wCast = (1 + sfere) * n_A_CAST;
    n_Delay[2] = 0.5;
    n_rangedAtk = 1;
  } else if (skill == SKILLID.TRIPLE_ACTION) {
    n_rangedAtk = 1;
    n_Delay[2] = 1;
    mod += 0.5;
    wHITsuu = 3;
  } else if (skill == SKILLID.BEAST_CHARGE) {
    n_Delay[0] = 1;
    n_rangedAtk = 1;
    mod += 0.08 * n_A_STR - 0.5;
    wHITsuu = 2;
  } else if (skill == SKILLID.DESPERADO) {
    n_rangedAtk = 0;
    mod += 0.5 * lv - 0.5;
    n_Delay[2] = 1;
    // colpi a segno in media, scelti nel campo della skill
    wHITsuu = [1, 1.2, 1.6, 2, 2.4, 3, 3.6, 4, 5, 6, 7, 8, 9, 10][1 * c.SkillSubNum.value];
  }
  ATKmod02(mod, 0);
  var insieme = skill == SKILLID.DOUBLE_STRAFE;
  for (var e = 0; e <= 2; e++) {
    var molt = insieme ? wHITsuu : 1,
      veleno = EDP_DMG(e) * molt;
    w_DMG[e] = BattleCalc(n_A_DMG[e] * molt, e);
    // Beast Charge colpisce solo mostri Brute e Insect
    if (skill == SKILLID.BEAST_CHARGE && targetData[2] != 2 && targetData[2] != 4) w_DMG[e] = 0;
    w_DMG[e] += veleno;
    var colpo = insieme ? Math.floor(w_DMG[e] / wHITsuu) : w_DMG[e];
    Last_DMG_B[e] = colpo;
    if (skill == SKILLID.BOWLING_BASH) Last_DMG_B[e] = 2 * w_DMG[e];
    Last_DMG_A[e] = insieme ? w_DMG[e] : w_DMG[e] * wHITsuu;
    if (n_B_debuf[6] == 0 || wLAch == 0)
      InnStr[e] += Math.floor(Last_DMG_A[e]) + " (" + colpo + SubName[8] + wHITsuu + " hits)";
    else {
      InnStr[e] += 3 * w_DMG[e] + "(" + 2 * w_DMG[e] + "+" + w_DMG[e] + ")";
      Last_DMG_B[e] = 3 * w_DMG[e];
    }
    w_DMG[e] -= veleno;
    if (!insieme) w_DMG[e] *= wHITsuu;
  }
  var mancato = BattleCalc2(0);
  w_DMG[1] = (w_DMG[1] * w_HIT + mancato * wHITsuu * (100 - w_HIT)) / 100;
  if (wHITsuu == 0 && skill == SKILLID.THROW_SPIRIT_SPHERES)
    InnStr[0] =
      "<B style='color:red'># of Spirit Spheres must be<BR> higher than 0. Please change it<BR> at [Supportive/Party skills]</B>";
  EDPplus(wHITsuu);
  n_PerHIT_DMG = mancato * wHITsuu;
  str_PerHIT_DMG = mancato * wHITsuu + " (" + wHITsuu + SubName[8] + mancato + " damage)";
}
// Blitz Beat e Falcon Assault: il danno del falco non dipende dall'ATK
function falco() {
  var lv = n_A_ActiveSkillLV;
  n_PerHIT_DMG = 0;
  n_A_Weapon_element = 0;
  n_rangedAtk = 1;
  var danno =
    80 +
    2 * Math.floor(n_A_DEX / 10) +
    2 * Math.floor(n_A_INT / 2) +
    6 * SkillSearch(SKILLID.STEEL_CROW);
  danno = (danno * skill_dmg(n_A_ActiveSkill)) / 100;
  if (n_A_ActiveSkill == SKILLID.FALCON_ASSAULT) {
    danno = Math.floor((danno * (150 + 70 * lv)) / 100);
    danno = tPlusDamCut(Math.floor(danno * element[targetData[3]][0]));
    danno *= 5;
    if (targetData[19] == 5) danno = 1;
    wCast = n_A_CAST;
    n_Delay[2] = 3;
  } else {
    danno = tPlusDamCut(Math.floor(danno * element[targetData[3]][0]));
    danno *= lv;
    wCast = 1.5 * n_A_CAST;
    n_Delay[2] = 1;
  }
  for (var e = 0; e <= 2; e++) {
    Last_DMG_A[e] = Last_DMG_B[e] = danno;
    InnStr[e] += Last_DMG_A[e];
    if (n_A_ActiveSkill == SKILLID.BLITZ_BEAT) {
      Last_DMG_B[e] = danno / lv;
      InnStr[e] += " (" + Last_DMG_B[e] + " x " + lv + " hits)";
    }
    w_DMG[e] = danno;
  }
  w_HIT_HYOUJI = 100;
}
// Envenom, e Poison React su un mostro non di elemento Poison: elemento Poison
function envenom() {
  ATKmod02(1, 0);
  n_A_Weapon_element = 5;
  var veleno = Math.max(0, element[targetData[3]][5]);
  n_PerHIT_DMG = Math.floor(BattleCalc2(0) * veleno);
  for (var e = 0; e <= 2; e++) w_DMG[e] = Math.floor(BattleCalc(n_A_DMG[e], e) * veleno);
  scriviDanni(danniConVeleno());
  w_DMG[1] = (w_DMG[1] * w_HIT + n_PerHIT_DMG * (100 - w_HIT)) / 100;
  EDPplus(1);
}
// armi che fanno ignorare a Shield Boomerang la DEF del mostro
function ignoraDEF() {
  return (
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
  );
}
// Shield Boomerang: danno dal peso dello scudo (campo della skill) e dal suo raffinamento
function shieldBoomerang() {
  n_PerHIT_DMG = 0;
  n_rangedAtk = 1;
  n_A_Weapon_element = 0;
  var pesoScudo = 1 * c.SkillSubNum.value;
  n_Delay[2] = 0.7;
  var mod = 1 + 0.3 * n_A_ActiveSkillLV;
  if (n_A_ActiveSkill == SKILLID.SHIELD_BOOMERANG_SOUL_LINKED) {
    n_Delay[2] = 0.35;
    mod *= 2;
  }
  var raffinamento = 10 * n_A_LEFT_REFINE;
  var ignora = ignoraDEF();
  var defDura = ignora ? targetData[14] : 0,
    defVIT = ignora ? n_B_DEF2[0] : 0;
  var atk = n_A_ATK + 0.05 * n_A_ATK * n_A_Buf2[8];
  if (SkillSearch(SKILLID.AUTO_BERSERK)) atk += 0.32 * atk;
  else if (n_A_Buf6[5]) atk += Math.floor(atk * (0.02 + 0.03 * n_A_Buf6[5]));
  else if (n_A_Buf7[31]) atk += Math.floor(0.05 * atk);
  for (var e = 0; e <= 2; e++) {
    if (bonusValues[23] > 0)
      w_DMG[e] = Math.round(((atk + pesoScudo) * (n_B_DEF2[2 - e] + targetData[14])) / 100);
    else
      w_DMG[e] = Math.floor(
        (atk + pesoScudo) * defReduction(targetData[14] - defDura) - (n_B_DEF2[e] - defVIT),
      );
    w_DMG[e] = Math.floor(w_DMG[e] * mod);
    w_DMG[e] = ApplyModifiers(w_DMG[e]) + raffinamento;
    if (defDura != 0) w_DMG[2] = w_DMG[1] = w_DMG[0];
    if (w_DMG[e] < 1) w_DMG[e] = 1;
    if (senzaScudo()) {
      w_DMG[e] = 0;
      InnStr[e] += w_DMG[e] + " (no shield equiped)";
    } else {
      w_DMG[e] = Math.floor(w_DMG[e] * element[targetData[3]][0]);
      Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e];
      InnStr[e] += Last_DMG_A[e];
    }
  }
  w_DMG[1] = (w_DMG[1] * w_HIT) / 100;
}
// carte con ATK che Rapid Smiting non conta: [carta, ATK]
// prettier-ignore
var CARTE_ATK = [
  [11, 20], [28, 5], [29, 5], [30, 5], [33, 5], [34, 5], [35, 5], [36, 5], [37, 5], [38, 10],
  [39, 5], [110, 5], [163, 5], [165, 5], [254, 5], [259, 5], [326, 5], [356, 5], [366, 5],
  [380, 5], [463, 5], [498, 5], [525, 5],
];
// Rapid Smiting: 5 colpi dal peso dello scudo (campo della skill) e dal suo raffinamento
function rapidSmiting() {
  n_PerHIT_DMG = 0;
  n_rangedAtk = 1;
  n_A_Weapon_element = 0;
  wCast = n_A_CAST;
  if (n_A_Equip[5] == EQUIPID.IMPERIAL_GUARD && n_A_LEFT_REFINE >= 8) wCast *= 0.5;
  n_Delay[2] = 1;
  var pesoScudo = 1 * c.SkillSubNum.value;
  var mod = 1 + 0.3 * n_A_ActiveSkillLV;
  var atk =
    n_A_ATK -
    CARTE_ATK.reduce((somma, [carta, valore]) => somma + valore * CardNumSearch(carta), 0);
  // Provoke e Aloevera, che Shield Boomerang conta, nell'originale non avevano effetto: si
  // sommavano a una variabile di Shield Boomerang
  if (SkillSearch(SKILLID.AUTO_BERSERK)) atk += 0.32 * atk;
  for (var e = 0; e <= 2; e++) {
    w_DMG[e] = atk + pesoScudo;
    w_DMG[e] =
      Math.floor(Math.floor(5 * w_DMG[e] * defReduction(targetData[14]) - n_B_DEF2[e]) * mod) +
      10 * n_A_LEFT_REFINE;
    w_DMG[e] = ApplyModifiers(w_DMG[e]);
    if (w_DMG[e] < 1) w_DMG[e] = 1;
    if (senzaScudo()) {
      w_DMG[e] = 0;
      InnStr[e] += w_DMG[e] + " (no shield equiped)";
    } else {
      w_DMG[e] = Math.floor(w_DMG[e] * element[targetData[3]][0]);
      Last_DMG_B[e] = Math.floor(w_DMG[e] / 5) + Math.floor(n_B_DEF2[e] / 3 - 1);
      Last_DMG_A[e] = 5 * Last_DMG_B[e];
      InnStr[e] += Last_DMG_A[e] + " (" + Last_DMG_B[e] + SubName[8] + "5 hits)";
      w_DMG[e] = Last_DMG_A[e];
    }
  }
  w_DMG[1] = (w_DMG[1] * w_HIT) / 100;
}
// Clashing Spiral: 5 colpi dal peso dell'arma (campo della skill) e da STR
function clashingSpiral() {
  var lv = n_A_ActiveSkillLV;
  n_rangedAtk = 1;
  var elemento = Math.max(0, element[targetData[3]][n_A_Weapon_element]);
  var raffinamento = tPlusDamCut(ApplyModifiers(n_A_Weapon_refine * elemento));
  n_PerHIT_DMG = 5 * raffinamento;
  if (lv == 5) wCast = n_A_CAST;
  else wCast = (0.1 + 0.2 * lv) * n_A_CAST;
  n_Delay[2] = 1 + 0.2 * lv;
  var str = Math.floor(n_A_STR / 10);
  var pesoArma = 1 * c.SkillSubNum.value;
  var danno = str * str + 0.8 * pesoArma * (1 + 0.5 * lv);
  danno = Math.floor(danno * (1.25 - 0.25 * targetData[4])) + 10 + 1.5 * n_A_Weapon_refine;
  danno = ApplyModifiers(danno * elemento);
  w_DMG = [danno, danno, danno];
  for (var e = 0; e <= 2; e++) {
    Last_DMG_B[e] = w_DMG[e] + EDP_DMG(e);
    Last_DMG_A[e] = 5 * Last_DMG_B[e];
    InnStr[e] += Last_DMG_A[e] + " (" + Last_DMG_B[e] + SubName[8] + "5 hits)";
    w_DMG[e] = Last_DMG_A[e];
  }
  w_DMG[1] = (w_DMG[1] * w_HIT) / 100 + (n_PerHIT_DMG * (100 - w_HIT)) / 100;
  EDPplus(5);
}
// Venom Splasher: solo sui mostri normali (targetData[19] == 0), 1 sui Plant; Poison React nel
// campo della skill
function venomSplasher() {
  n_PerHIT_DMG = 0;
  not_use_card = 1;
  n_Delay[0] = 1;
  wCast = n_A_CAST;
  if (targetData[19] == 0) {
    ATKmod02(1 + (400 + 50 * n_A_ActiveSkillLV + 20 * c.SkillSubNum.value) / 100, 0);
    for (var e = 0; e <= 2; e++) w_DMG[e] = Math.floor(BattleCalc(n_A_DMG[e], e));
  } else if (targetData[19] == 5) w_DMG = [1, 1, 1];
  else w_DMG = [0, 0, 0];
  scriviDanni(w_DMG);
  w_HIT_HYOUJI = 100;
}
// Soul Destroyer: ATK per livello piu' una parte magica da INT, ridotta dalle difese
function soulDestroyer() {
  var lv = n_A_ActiveSkillLV;
  not_use_card = 1;
  n_rangedAtk = 1;
  wCast = 0.5 * n_A_CAST;
  n_Delay[2] = 0.8 + 0.2 * lv;
  var difese = targetData[14] + targetData[15] + n_B_MDEF2;
  var magia = [500, 750, 1000].map((base, e) =>
    tPlusDamCut(5 * n_A_INT * lv + base - Math.floor((difese + n_B_DEF2[e]) / 2)),
  );
  for (var e = 0; e <= 2; e++) {
    w_DMG[e] = BattleCalc(n_A_DMG[e], e) * lv;
    Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e] + magia[e];
    InnStr[e] += Last_DMG_A[e] + " (" + w_DMG[e] + " + " + magia[e] + ")";
    w_DMG[e] = Last_DMG_A[e];
  }
  var mancato = BattleCalc2(0) * lv;
  n_PerHIT_DMG = mancato + magia[1];
  str_PerHIT_DMG = mancato + magia[0] + "~" + (mancato + magia[2]);
  if (targetData[19] == 5) {
    w_DMG = [1, 1, 1];
    scriviDanni(w_DMG);
  }
  w_DMG[1] = (w_DMG[1] * w_HIT + n_PerHIT_DMG * (100 - w_HIT)) / 100;
}
// Grand Cross: ATK e MATK, elemento Holy; il personaggio perde HP e subisce una parte del danno
function grandCross() {
  var lv = n_A_ActiveSkillLV;
  n_PerHIT_DMG = 0;
  myInnerHtml("CRIATKname", '<Font color="#FF0000">Health drain</Font>', 0);
  myInnerHtml("CRIATK", '<Font color="#FF0000">' + Math.floor(n_A_MaxHP / 5) + "</Font>", 0);
  myInnerHtml("bSUB3name", '<Font color="#FF0000">Damage backlash</Font>', 0);
  var contraccolpo = [0, 0, 0];
  var vitDEF = [n_A_VITDEF[2], n_A_VITDEF[1], n_A_VITDEF[0]];
  // MDEF da INT senza le riduzioni di StAllCalc: come nell'originale cambia anche quella usata
  // dopo per i danni magici subiti (BattleHiDam)
  n_A_softMDEF = n_A_INT + Math.floor(n_A_VIT / 2);
  for (var e = 0; e <= 2; e++) {
    var d = BK_n_A_DMG[e] * defReduction(n_A_DEF) - vitDEF[e] + n_A_WeaponLV_refineATK;
    d = Math.floor(d * (1 + 0.4 * lv));
    var m = BK_n_A_MATK[e] * mdefReduction(n_A_MDEF) - n_A_softMDEF;
    d += Math.floor(m * (0.4 * lv + 1));
    d = Math.floor((d * (100 - bonusValues[57])) / 100);
    d = Math.floor((d * (100 - bonusValues[66])) / 100);
    d = Math.floor((d * (100 - bonusValues[78])) / 100);
    if (1 * c.A_adopted.checked) d = Math.floor((d * (100 - bonusValues[190])) / 100);
    else d = Math.floor((d * (100 - bonusValues[191])) / 100);
    d = Math.floor(d * Math.max(0, element[10 * n_A_Bodyelement + 1][6]));
    d = Math.floor(d / 2);
    contraccolpo[e] = Math.floor((d * skill_dmg(n_A_ActiveSkill)) / 100);
  }
  myInnerHtml(
    "bSUB3",
    '<Font color="#FF0000">3(hits) x ' + contraccolpo[0] + "~" + contraccolpo[2] + " damage</Font>",
    0,
  );
  n_rangedAtk = 2;
  n_A_Weapon_element = 6;
  wCast = 3 * n_A_CAST;
  n_Delay[2] = 1.5;
  wLAch = 1;
  var sacro = Math.max(0, element[targetData[3]][6]);
  for (e = 0; e <= 2; e++) {
    d = BK_n_A_DMG[e] * defReduction(targetData[14]) - n_B_DEF2[e] + n_A_WeaponLV_refineATK;
    d *= 1 + 0.4 * lv;
    d = Math.floor(d * sacro);
    m = BK_n_A_MATK[e] * mdefReduction(targetData[15]) - n_B_MDEF2;
    m *= 0.4 * lv + 1;
    if (n_A_ActiveSkill == SKILLID.GRAND_CROSS_UARO) d += n_A_Buf[2] * 40 + n_A_Buf[8] * 3 * 30;
    m = Math.floor(m * sacro);
    d = tPlusDamCut(Math.floor((m + d) * sacro));
    d = Math.floor((d * skill_dmg(n_A_ActiveSkill)) / 100);
    if (d < 1) d = 1;
    // nessun danno ai mostri di elemento Holy
    if (60 <= targetData[3] && targetData[3] <= 69) d = 0;
    w_DMG[e] = d;
  }
  // con Lex Aeterna (n_B_debuf[6]) il primo dei 3 colpi vale doppio
  var colpi = n_B_debuf[6] == 0 ? 3 : 4;
  for (e = 0; e <= 2; e++) {
    Last_DMG_A[e] = Last_DMG_B[e] = colpi * w_DMG[e];
    if (colpi == 3) InnStr[e] += Last_DMG_A[e] + " (" + w_DMG[e] + SubName[8] + "3 hits)";
    else
      InnStr[e] += Last_DMG_A[e] + " (" + 2 * w_DMG[e] + " + " + w_DMG[e] + SubName[8] + "2 hits)";
    w_DMG[e] = Last_DMG_A[e];
  }
  w_HIT_HYOUJI = 100;
}
// Cart Revolution: danno in piu' dal peso del carro (campo della skill, su 8000)
function cartRevolution() {
  var potenza = 100;
  n_PerHIT_DMG = Math.floor(2 * BattleCalc2(0) * element[targetData[3]][0]);
  if (SkillSearch(SKILLID.MAXIMUM_POWER_THRUST))
    potenza += 20 * SkillSearch(SKILLID.MAXIMUM_POWER_THRUST);
  else {
    if (SkillSearch(SKILLID.POWER_THRUST)) potenza += 5 * SkillSearch(SKILLID.POWER_THRUST);
    if (SkillSearch(SKILLID.POWER_THRUST) == 0 && n_A_Buf2[8]) potenza += 5 * n_A_Buf2[8];
  }
  var carro = (1 * c.SkillSubNum.value) / 8000;
  var dannoCarro = [0, 1, 2].map((e) => Math.floor((n_A_DMG[e] * potenza) / 100));
  ATKmod02(1.5, 0);
  for (var e = 0; e <= 2; e++) {
    w_DMG[e] = BattleCalc(n_A_DMG[e], e);
    w_DMG[e] += Math.floor(BattleCalc(dannoCarro[e], e) * carro);
    w_DMG[e] = Math.floor(w_DMG[e] * element[targetData[3]][0]);
    // Heavy Metaling Card: +50% per i Merchant. Come nell'originale, a ogni giro moltiplica
    // tutti e tre i valori, anche quelli gia' moltiplicati
    if (CardNumSearch(523) && [6, 12, 19, 26, 33, 40].includes(n_A_JOB))
      for (var i = 0; i <= 2; i++) w_DMG[i] *= 1.5;
    Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e] + EDP_DMG(e);
    InnStr[e] += Last_DMG_A[e];
  }
  w_DMG[1] = (w_DMG[1] * w_HIT + 2 * BattleCalc2(0) * (100 - w_HIT)) / 100;
  w_DMG[1] = Math.floor(w_DMG[1] * element[targetData[3]][0]);
  EDPplus(1);
}
// Gloria Domini: danno fisso, 1 sui Plant
function gloriaDomini() {
  var lv = n_A_ActiveSkillLV;
  n_PerHIT_DMG = 0;
  var danno = targetData[19] == 5 ? 1 : 500 + 300 * lv;
  w_DMG = [danno, danno, danno];
  scriviDanni(w_DMG);
  wCast = (1.5 + 0.5 * lv) * n_A_CAST;
  n_Delay[2] = 1.5 + 0.5 * lv;
  w_HIT_HYOUJI = 100;
}
// Martyr's Reckoning: danno dagli HP massimi
function martyrsReckoning() {
  n_PerHIT_DMG = 0;
  n_A_Weapon_element = 0;
  var danno = Math.floor(0.09 * n_A_MaxHP * (0.9 + 0.1 * n_A_ActiveSkillLV));
  danno = Math.floor(ApplyModifiers(danno) * element[targetData[3]][0]);
  w_DMG = [danno, danno, danno];
  scriviDanni(w_DMG);
  w_HIT_HYOUJI = 100;
}
// Occult Impaction: piu' danno quanto piu' alta e' la DEF del mostro
function occultImpaction() {
  n_PerHIT_DMG = 0;
  w_HIT_HYOUJI = 100;
  n_A_Weapon_element = 0;
  ATKmod02(1, 0);
  var mod = 1 + 0.75 * n_A_ActiveSkillLV;
  for (var e = 0; e <= 2; e++) {
    w_DMG[e] = Math.floor(
      (Math.floor(BK_n_A_DMG[e] * mod) * (n_B_DEF2[2 - e] + targetData[14])) / 50,
    );
    w_DMG[e] = Math.floor(ApplyModifiers(w_DMG[e]) * element[targetData[3]][0]);
  }
  scriviDanni(danniConVeleno());
  EDPplus(1);
  wCast = n_A_CAST;
  n_Delay[2] = 0.5;
}
// Guillotine Fist: danno dagli SP (campo della skill, o tutti gli SP)
function guillotineFist() {
  var lv = n_A_ActiveSkillLV;
  n_PerHIT_DMG = 0;
  w_HIT_HYOUJI = 100;
  n_A_Weapon_element = 0;
  ATKmod02(1, 0);
  var sp = n_A_ActiveSkill == SKILLID.GUILLOTINE_FIST ? 1 * c.SkillSubNum.value : n_A_MaxSP - 1;
  var mod = 1 + (8 + sp / 10);
  for (var e = 0; e <= 2; e++) {
    w_DMG[e] = Math.floor(BK_n_A_DMG[e] * mod) + (250 + 150 * lv);
    w_DMG[e] = Math.floor(ApplyModifiers(w_DMG[e]) * element[targetData[3]][0]);
    if (n_A_Buf6[5]) w_DMG[e] += Math.floor((0.02 + 0.03 * n_A_Buf6[5]) * w_DMG[e]);
    else if (n_A_Buf7[31]) w_DMG[e] += Math.floor(0.05 * w_DMG[e]);
    if (n_A_Buf2[19] == 1) w_DMG[e] = 2 * w_DMG[e];
  }
  scriviDanni(danniConVeleno());
  EDPplus(1);
  wCast = (4.5 - 0.5 * lv) * n_A_CAST;
  n_Delay[2] = 3.5 - 0.5 * lv;
}
// Throw Shuriken, Throw Kunai e Throw Huuma Shuriken: senza carte, con l'elemento Neutral del
// mostro
function throwShuriken() {
  n_rangedAtk = 1;
  not_use_card = 1;
  ATKmod02(1, 0);
  for (var e = 0; e <= 2; e++)
    w_DMG[e] = Math.floor(BattleCalc(n_A_DMG[e], e) * element[targetData[3]][0]);
  scriviDanni(w_DMG);
  n_PerHIT_DMG = BattleCalc2(0) * element[targetData[3]][0];
  w_DMG[1] = (w_DMG[1] * w_HIT + n_PerHIT_DMG * (100 - w_HIT)) / 100;
}
// kunai scelto nel campo della skill; 3 colpi
function throwKunai() {
  n_rangedAtk = 1;
  n_Delay[2] = 0.5;
  not_use_card = 1;
  ATKmod02(1, 0);
  n_A_Weapon_element = m_Kunai[1 * c.SkillSubNum.value][1];
  for (var e = 0; e <= 2; e++) {
    w_DMG[e] = Math.floor(BattleCalc(n_A_DMG[e], e) * element[targetData[3]][0]);
    Last_DMG_B[e] = w_DMG[e];
    Last_DMG_A[e] = 3 * w_DMG[e];
    InnStr[e] += Last_DMG_A[e] + " (" + Last_DMG_B[e] + SubName[8] + "3 hits)";
    w_DMG[e] = Last_DMG_A[e];
  }
  var mancato = Math.floor(BattleCalc2(0) * element[targetData[3]][0]);
  w_DMG[1] = (w_DMG[1] * w_HIT + 3 * mancato * (100 - w_HIT)) / 100;
  n_PerHIT_DMG = 3 * mancato;
  str_PerHIT_DMG = 3 * mancato + " (3" + SubName[8] + mancato + " damage)";
}
function throwHuumaShuriken() {
  var lv = n_A_ActiveSkillLV;
  n_rangedAtk = 1;
  ATKmod02(1 + (1.5 * lv + 0.5), 0);
  wCast = 3 * n_A_CAST;
  n_Delay[2] = 1.5;
  var colpi = 2 + Math.round(lv / 2);
  for (var e = 0; e <= 2; e++) {
    w_DMG[e] = Math.floor(BattleCalc(n_A_DMG[e], e) * element[targetData[3]][0]);
    w_DMG[e] = Math.floor(w_DMG[e] / colpi) * colpi;
    Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e];
    InnStr[e] += Last_DMG_A[e] + " (" + Last_DMG_A[e] / colpi + " x " + colpi + " hits)";
  }
  n_PerHIT_DMG = BattleCalc2(0) * element[targetData[3]][0];
  w_DMG[1] = (w_DMG[1] * w_HIT + n_PerHIT_DMG * (100 - w_HIT)) / 100;
}
// Throw Coins: danno fisso per livello, dimezzato sui boss e sul mostro 586 (oggi Sropho, forse
// un id cambiato dai dati di uaRO)
function throwCoins() {
  var lv = n_A_ActiveSkillLV;
  n_rangedAtk = 1;
  n_A_Weapon_element = 0;
  wCast = 0;
  n_Delay[2] = 2;
  w_HIT_HYOUJI = 100;
  var base = targetData[19] == 1 || targetData[0] == 586 ? 250 : 500;
  w_DMG = [base * lv, base * lv + (base / 2) * lv, base * lv + base * lv];
  for (var e = 0; e <= 2; e++) {
    w_DMG[e] = (w_DMG[e] * skill_dmg(n_A_ActiveSkill)) / 100;
    w_DMG[e] = w_DMG[e] * Math.max(0, element[targetData[3]][n_A_Weapon_element]);
    w_DMG[e] = tPlusDamCut(w_DMG[e]);
  }
  if (targetData[19] == 5) w_DMG = [1, 1, 1];
  for (e = 0; e <= 2; e++) InnStr[e] += w_DMG[e];
  EDPplus(5);
}
// Killing Stroke e Final Strike: danno da STR e dagli HP rimasti (campo della skill, o tutti gli
// HP meno 1)
function killingStroke() {
  var lv = n_A_ActiveSkillLV;
  n_PerHIT_DMG = 0;
  n_A_Weapon_element = 0;
  n_rangedAtk = 1;
  ATKmod02(1, 0);
  var hp = n_A_ActiveSkill == SKILLID.KILLING_STROKE ? 1 * c.SkillSubNum.value : n_A_MaxHP - 1;
  var danno = 40 * (n_A_STR - SkillSearch(SKILLID.NINJA_AURA)) + lv * (hp / 10 + 35);
  danno = ApplyModifiers(danno * defReduction(targetData[14]));
  danno = Math.floor(danno * element[targetData[3]][0]);
  w_DMG = [danno, danno, danno];
  scriviDanni(w_DMG);
  w_HIT_HYOUJI = 100;
}
// Acid Terror: ignora la DEF dura del mostro, senza carte
function acidTerror() {
  n_PerHIT_DMG = 0;
  not_use_card = 1;
  n_rangedAtk = 1;
  n_A_Weapon_element = 0;
  var mod = (50 + 50 * n_A_ActiveSkillLV) / 100;
  for (var e = 0; e <= 2; e++) {
    w_DMG[e] = Math.floor((BK_n_A_DMG[e] - n_B_DEF2[e]) * mod);
    w_DMG[e] = Math.floor(w_DMG[e] * element[targetData[3]][0]);
    w_DMG[e] = Math.floor(ApplyModifiers(w_DMG[e]));
  }
  scriviDanni(w_DMG);
  wCast = n_A_CAST;
  w_HIT_HYOUJI = 100;
}
// Acid Bomb: danno da INT del personaggio e VIT del mostro, un colpo per livello
function acidBomb() {
  n_PerHIT_DMG = 0;
  n_rangedAtk = 1;
  n_A_Weapon_element = 0;
  wHITsuu = n_A_ActiveSkillLV;
  var danno = (0.7 * n_A_INT * n_A_INT * targetData[7]) / (n_A_INT + targetData[7]);
  danno = Math.floor((danno * skill_dmg(n_A_ActiveSkill)) / 100);
  danno = tPlusDamCut(Math.floor(danno * element[targetData[3]][0]));
  if (PvP == 1) danno = Math.floor(danno / 2);
  for (var e = 0; e <= 2; e++) {
    Last_DMG_B[e] = danno;
    Last_DMG_A[e] = danno * wHITsuu;
    InnStr[e] += Last_DMG_A[e] + " (" + Last_DMG_B[e] + SubName[8] + wHITsuu + " hits)";
    w_DMG[e] = Last_DMG_A[e];
  }
  wCast = n_A_CAST;
  n_Delay[2] = 1;
  w_HIT_HYOUJI = 100;
}
// Land Mine, Blast Mine, Claymore Trap: danno da DEX e INT
function trappola() {
  n_PerHIT_DMG = 0;
  n_Delay[0] = 1;
  var dex;
  if (n_A_ActiveSkill == SKILLID.LAND_MINE) {
    n_A_Weapon_element = 2;
    dex = 75 + n_A_DEX;
  } else if (n_A_ActiveSkill == SKILLID.BLAST_MINE) {
    n_A_Weapon_element = 4;
    dex = 50 + n_A_DEX / 2;
  } else {
    n_A_Weapon_element = 3;
    dex = 75 + n_A_DEX / 2;
  }
  var danno = Math.floor(
    dex *
      (1 + n_A_INT / 100) *
      n_A_ActiveSkillLV *
      Math.max(0, element[targetData[3]][n_A_Weapon_element]),
  );
  danno = tPlusDamCut(danno);
  danno = Math.floor((danno * skill_dmg(n_A_ActiveSkill)) / 100);
  w_DMG = [danno, danno, danno];
  scriviDanni(w_DMG);
  w_HIT_HYOUJI = 100;
}
// Heal sui mostri Undead: meta' della cura
function heal() {
  n_PerHIT_DMG = 0;
  n_A_Weapon_element = 6;
  n_Delay[2] = 1;
  n_rangedAtk = 2;
  var danno = HealCalc(n_A_ActiveSkillLV, 0);
  danno = Math.floor(Math.floor(danno / 2) * Math.max(0, element[targetData[3]][6]));
  if (targetData[3] < 90) danno = 0;
  danno = Math.floor((danno * (100 + bonusValues[170 + targetData[2]])) / 100);
  danno = Math.floor((danno * (100 + bonusValues[93])) / 100);
  danno = tPlusDamCut(danno);
  w_DMG = [danno, danno, danno];
  scriviDanni(w_DMG);
  w_HIT_HYOUJI = 100;
}
// Sanctuary sui mostri Undead e Demon: meta' della cura
function sanctuary() {
  var lv = n_A_ActiveSkillLV;
  n_PerHIT_DMG = 0;
  n_A_Weapon_element = 6;
  wCast = 5 * n_A_CAST;
  n_Delay[0] = 1;
  n_rangedAtk = 2;
  var danno = lv <= 6 ? 100 * lv : 777;
  danno = Math.floor((danno * (100 + bonusValues[94] + bonusValues[99])) / 100);
  danno = Math.floor(Math.floor(danno / 2) * Math.max(0, element[targetData[3]][6]));
  if (targetData[3] < 90 && targetData[2] != 6) danno = 0;
  danno = Math.floor((danno * (100 + bonusValues[170 + targetData[2]])) / 100);
  danno = Math.floor((danno * (100 + bonusValues[96])) / 100);
  danno = tPlusDamCut(danno);
  w_DMG = [danno, danno, danno];
  scriviDanni(w_DMG);
  w_HIT_HYOUJI = 100;
}
// Turn Undead e Resurrection sui mostri Undead: uccidono con una probabilita', altrimenti danno
function turnUndead() {
  var lv = n_A_ActiveSkillLV;
  n_PerHIT_DMG = 0;
  if (n_A_ActiveSkill == SKILLID.TURN_UNDEAD) {
    n_A_Weapon_element = 6;
    wCast = n_A_CAST;
  } else {
    n_A_Weapon_element = 0;
    wCast = (8 - 2 * lv) * n_A_CAST;
  }
  n_rangedAtk = 2;
  var elemento = Math.max(0, element[targetData[3]][n_A_Weapon_element]);
  var probabilita = 0;
  if (targetData[3] < 90) w_DMG = [0, 0, 0];
  else {
    w_DMG[2] = 0;
    // sui boss non riesce mai
    if (targetData[19] != 1) {
      probabilita = (20 * lv + n_A_BaseLV + n_A_INT + n_A_LUK) / 1000;
      w_DMG[2] = targetData[6];
    }
    w_DMG[0] = Math.floor((n_A_BaseLV + n_A_INT + 10 * lv) * elemento);
    w_DMG[1] = Math.round(targetData[6] * probabilita + (w_DMG[0] * (100 - probabilita)) / 100);
  }
  for (var e = 0; e <= 2; e++) Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e];
  InnStr[0] += w_DMG[0] + " <span style='font-weight:100;'>(damage on failure)</span>";
  InnStr[1] += w_DMG[1] + " <span style='font-weight:100;'>(considering success chance)</span>";
  InnStr[2] +=
    Math.floor(w_DMG[2] * elemento) +
    " <span style='font-weight:100;'>(" +
    Math.floor(10000 * probabilita) / 100 +
    "% success chance)</span>";
  n_Delay[2] = 3;
  w_HIT_HYOUJI = 100;
}
// Gravity Field: danno fisso per colpo
function gravityField() {
  var lv = n_A_ActiveSkillLV;
  n_PerHIT_DMG = 0;
  n_A_Weapon_element = 0;
  n_Delay[6] = 9;
  n_rangedAtk = 2;
  wHITsuu = 4 + lv;
  var danno = Math.floor(((200 + 200 * lv) * skill_dmg(n_A_ActiveSkill)) / 100);
  if (targetData[19] == 5) danno = 1;
  // Emperium
  if (targetData[0] == 44) danno = 400;
  for (var e = 0; e <= 2; e++) {
    Last_DMG_A[e] = Last_DMG_B[e] = danno * wHITsuu;
    w_DMG[e] = Last_DMG_A[e];
    InnStr[e] += Last_DMG_A[e] + " (" + danno + " x " + wHITsuu + " hits)";
  }
  wCast = 5 * n_A_CAST;
  n_Delay[2] = 2;
  w_HIT_HYOUJI = 100;
}
// Coin Fling: danno uguale al livello job
function coinFling() {
  n_rangedAtk = 1;
  n_A_Weapon_element = 0;
  wCast = 0;
  w_HIT_HYOUJI = 100;
  var danno = 1;
  if (targetData[19] != 5) danno = (1 * c.A_JobLV.value * skill_dmg(n_A_ActiveSkill)) / 100;
  danno = Math.floor(danno);
  w_DMG = [danno, danno, danno];
  for (var e = 0; e <= 2; e++) InnStr[e] += w_DMG[e];
  EDPplus(5);
}

// magie: SKILL_MAGICHE prepara elemento, colpi (wHITsuu), lancio, ritardi e moltiplicatore della
// MATK (s.mod); una magia che non c'e' fa un colpo di MATK
function skillMagica() {
  n_PerHIT_DMG = 0;
  n_rangedAtk = 2;
  w_HIT_HYOUJI = 100;
  var s = { mod: 1 };
  var prepara = SKILL_MAGICHE[n_A_ActiveSkill];
  if (prepara) prepara(s, n_A_ActiveSkillLV);
  wCast *= n_A_CAST;
  // Exploding Dragon divide il danno in 3 colpi, le altre ripetono il colpo
  if (n_A_ActiveSkill == SKILLID.EXPLODING_DRAGON)
    for (var e = 0; e <= 2; e++) {
      w_DMG[e] = Math.floor(BattleMagicCalc(n_A_MATK[e] * s.mod) / wHITsuu);
      Last_DMG_A[e] = Last_DMG_B[e] = w_DMG[e] * wHITsuu;
      InnStr[e] += Last_DMG_A[e] + " (" + w_DMG[e] + SubName[8] + wHITsuu + " hits)";
      w_DMG[e] *= wHITsuu;
    }
  else
    for (e = 0; e <= 2; e++) {
      w_DMG[e] = BattleMagicCalc(n_A_MATK[e] * s.mod);
      if (SG_Special_HITnum != 0) SG_Special_DMG[e] = w_DMG[e];
      Last_DMG_B[e] = w_DMG[e];
      Last_DMG_A[e] = w_DMG[e] * wHITsuu;
      InnStr[e] += Last_DMG_A[e] + " (" + Last_DMG_B[e] + SubName[8] + wHITsuu + " hits)";
      w_DMG[e] = Last_DMG_A[e];
    }
}
// Fire Bolt, Cold Bolt, Lightning Bolt
function bolt(elemento) {
  return function (s, lv) {
    n_A_Weapon_element = elemento;
    wHITsuu = lv;
    wCast = 0.7 * lv;
    n_Delay[2] = 0.8 + 0.2 * lv;
  };
}
// i bolt lanciati da Hindsight: senza lancio e ritardo, 25% di probabilita'
function boltHindsight(elemento) {
  return function (s, lv) {
    n_A_Weapon_element = elemento;
    wHITsuu = lv;
    wCast = 0;
    n_Delay[2] = 0;
    w_HIT_HYOUJI = 25;
  };
}
// Magnus Exorcismus colpisce solo mostri Undead e Demon (canMagnusExorcismusHitTarget)
function magnusExorcismus(s, lv) {
  n_Delay[0] = 1;
  n_A_Weapon_element = 6;
  wHITsuu = lv;
  wCast = 15;
  n_Delay[2] = 4;
  if (!canMagnusExorcismusHitTarget(n_A_ActiveSkill)) n_A_MATK[0] = n_A_MATK[1] = n_A_MATK[2] = 0;
}
// Estin, Estun, Esma: elemento scelto a mano, nessun danno in PvP
function estin(s, lv) {
  n_A_Weapon_element = 1 * c.A_Weapon_element.value;
  wCast = 0.1;
  n_Delay[2] = 0.5;
  s.mod = targetData[4] == 0 ? 0.1 * lv : 0.01;
  if (PvP == 1) s.mod = 0;
}
function estun(s, lv) {
  n_A_Weapon_element = 1 * c.A_Weapon_element.value;
  wCast = 0.1;
  n_Delay[2] = 0.5;
  s.mod = 0.05 * lv;
  if (PvP == 1) s.mod = 0;
}
function esma(s, lv) {
  n_A_Weapon_element = 1 * c.A_Weapon_element.value;
  n_Delay[0] = 1;
  wHITsuu = lv;
  wCast = 2;
  n_Delay[2] = 0.5;
  s.mod = 0.4 + n_A_BaseLV / 100;
  if (PvP == 1) s.mod = 0;
}
function waterBall(s, lv) {
  n_A_Weapon_element = 1;
  if (lv >= 4) wHITsuu = 25;
  else if (lv >= 2) wHITsuu = 9;
  SG_Special_HITnum = wHITsuu;
  wCast = lv;
  s.mod = 1 + 0.3 * lv;
  n_Delay[3] = 0.1 * wHITsuu;
}
function heavensDrive(s, lv) {
  n_A_Weapon_element = 2;
  wHITsuu = lv;
  wCast = lv;
  n_Delay[2] = 1;
}
function holyLight(s, lv) {
  n_A_Weapon_element = 6;
  wCast = 2;
  s.mod = 1.25;
}
// prepara(s, lv) per magia: s.mod parte da 1, wHITsuu da 1
var SKILL_MAGICHE = {
  [SKILLID.FIRE_BOLT]: bolt(3),
  [SKILLID.COLD_BOLT]: bolt(1),
  [SKILLID.LIGHTNING_BOLT]: bolt(4),
  [SKILLID.FIRE_BOLT_HINDSIGHT]: boltHindsight(3),
  [SKILLID.COLD_BOLT_HINDSIGHT]: boltHindsight(1),
  [SKILLID.LIGHTNING_BOLT_HINDSIGHT]: boltHindsight(4),
  [SKILLID.FIRE_BALL]: function (s, lv) {
    n_A_Weapon_element = 3;
    wCast = n_Delay[2] = lv <= 5 ? 1.5 : 1;
    s.mod = 0.7 + 0.1 * lv;
  },
  [SKILLID.FIRE_WALL]: function (s, lv) {
    n_A_Weapon_element = 3;
    wHITsuu = 4 + lv;
    wCast = 2.15 - 0.15 * lv;
    n_Delay[2] = 0.1;
    s.mod = 0.5;
  },
  [SKILLID.FROST_DIVER]: function (s, lv) {
    n_A_Weapon_element = 1;
    wCast = 0.8;
    n_Delay[2] = 1.5;
    s.mod = 1 + 0.1 * lv;
  },
  [SKILLID.THUNDER_STORM]: function (s, lv) {
    n_A_Weapon_element = 4;
    wHITsuu = lv;
    wCast = lv;
    n_Delay[2] = 2;
    s.mod = 0.8;
  },
  [SKILLID.NAPALM_BEAT]: function (s, lv) {
    n_A_Weapon_element = 8;
    wCast = 0.5;
    if (lv == 10) n_Delay[2] = 0.5;
    else if (lv == 9) n_Delay[2] = 0.6;
    else if (lv == 8) n_Delay[2] = 0.7;
    else if (lv >= 6) n_Delay[2] = 0.8;
    else if (lv >= 4) n_Delay[2] = 0.9;
    else n_Delay[2] = 1;
    s.mod = 0.7 + 0.1 * lv;
  },
  [SKILLID.SOUL_STRIKE]: function (s, lv) {
    n_A_Weapon_element = 8;
    wHITsuu = Math.round(lv / 2);
    wCast = 0.5;
    if (lv % 2 == 0) n_Delay[2] = 0.8 + (lv / 2) * 0.2;
    else n_Delay[2] = 1 + ((lv + 1) / 2) * 0.2;
  },
  [SKILLID.FIRE_PILLAR]: function (s, lv) {
    n_A_Weapon_element = 3;
    wHITsuu = lv + 2;
    wCast = 3.3 - 0.3 * lv;
    n_Delay[2] = 1;
    s.mod = 0.2;
  },
  [SKILLID.SIGHTRASHER]: function (s, lv) {
    n_A_Weapon_element = 3;
    wCast = 0.7;
    n_Delay[2] = 2;
    s.mod = 1 + 0.2 * lv;
  },
  [SKILLID.METEOR_STORM]: function (s, lv) {
    n_A_Weapon_element = 3;
    wHITsuu = Math.round(lv / 2) * (Math.floor(lv / 2) + 2);
    wCast = 15;
    n_Delay[2] = Math.floor(lv / 2) + 2;
  },
  [SKILLID.JUPITEL_THUNDER]: function (s, lv) {
    n_A_Weapon_element = 4;
    wHITsuu = lv + 2;
    wCast = 2 + 0.5 * lv;
  },
  [SKILLID.LORD_OF_VERMILLION]: function (s, lv) {
    n_A_Weapon_element = 4;
    wHITsuu = 4;
    wCast = 15.5 - 0.5 * lv;
    n_Delay[2] = 5;
    n_Delay[6] = 4;
    s.mod = 0.8 + 0.2 * lv;
  },
  [SKILLID.WATER_BALL]: waterBall,
  [SKILLID.WATER_BALL_2]: waterBall,
  [SKILLID.FROST_NOVA]: function (s, lv) {
    s.mod = 0.66 + 0.066 * lv;
    n_A_Weapon_element = 1;
    wCast = 6 - 0.5 * Math.floor((lv - 1) / 2);
    n_Delay[2] = 1;
  },
  // colpi nel campo della skill; lancio piu' breve con Lacryma Stick e il suo set
  [SKILLID.STORM_GUST]: function (s, lv) {
    n_A_Weapon_element = 1;
    wHITsuu = 1 * c.SkillSubNum.value;
    SG_Special_HITnum = wHITsuu;
    var lancio = 1;
    if (n_A_Weapon_refine == 10 && EquipNumSearch(EQUIPID.LACRYMA_STICK)) lancio -= 0.08;
    if (EquipNumSearch(EQUIPID.LACRYMA_SET)) lancio -= 0.04 * n_A_LEFT_REFINE;
    wCast = (5 + lv) * lancio;
    n_Delay[2] = 5;
    n_Delay[6] = 4.5;
    s.mod = 1 + 0.4 * lv;
  },
  [SKILLID.EARTH_SPIKE]: function (s, lv) {
    n_A_Weapon_element = 2;
    wHITsuu = lv;
    wCast = 0.7 * lv;
    n_Delay[2] = 0.8 + 0.2 * lv;
  },
  [SKILLID.HEAVENS_DRIVE]: heavensDrive,
  [SKILLID.HEAVENS_DRIVE_2]: heavensDrive,
  [SKILLID.NAPALM_VULCAN]: function (s, lv) {
    wHITsuu = lv;
    n_A_Weapon_element = 8;
    wCast = 1;
    n_Delay[2] = 1;
    s.mod = 0.7 + 0.1 * lv;
  },
  [SKILLID.HOLY_LIGHT]: holyLight,
  [SKILLID.HOLY_LIGHT_SOUL_LINKED]: function (s, lv) {
    holyLight(s, lv);
    s.mod *= 5;
  },
  [SKILLID.MAGNUS_EXORCISMUS]: magnusExorcismus,
  // lancio -25% con l'oggetto 863 (Holy Stick)
  [SKILLID.MAGNUS_EXORCISMUS_UARO]: function (s, lv) {
    magnusExorcismus(s, lv);
    if (n_A_Equip[0] == 863) wCast *= 0.75;
  },
  [SKILLID.DARK_STRIKE]: function (s, lv) {
    n_A_Weapon_element = 7;
    wHITsuu = Math.ceil(lv / 2);
  },
  [SKILLID.ESTIN]: estin,
  [SKILLID.ESTUN]: estun,
  [SKILLID.ESMA]: esma,
  [SKILLID.FLAMING_PETALS]: function (s, lv) {
    n_A_Weapon_element = 3;
    s.mod = 0.9;
    wHITsuu = lv;
    wCast = 0.7 * lv;
  },
  [SKILLID.BLAZE_SHIELD]: function (s, lv) {
    n_A_Weapon_element = 3;
    s.mod = 0.5;
    wHITsuu = Math.round(lv / 2) + 4;
    wCast = 6.5 - 0.5 * lv;
    n_Delay[2] = 1;
    n_Delay[0] = 1;
  },
  [SKILLID.EXPLODING_DRAGON]: function (s, lv) {
    n_A_Weapon_element = 3;
    s.mod = 1.5 + 1.5 * lv;
    wHITsuu = 3;
    wCast = 3;
    n_Delay[2] = 3;
  },
  [SKILLID.FREEZING_SPEAR]: function (s, lv) {
    n_A_Weapon_element = 1;
    wHITsuu = lv + 2;
    wCast = 0.7 * lv;
  },
  [SKILLID.SNOW_FLAKE_DRAFT]: function (s, lv) {
    n_A_Weapon_element = 1;
    s.mod = 1 + 0.5 * lv;
    wCast = 3;
    n_Delay[2] = 3;
  },
  [SKILLID.WIND_BLADE]: function (s, lv) {
    n_A_Weapon_element = 4;
    wHITsuu = Math.floor(lv / 2) + 1;
    wCast = Math.floor(lv / 2) + 1;
    n_Delay[2] = 1;
  },
  [SKILLID.LIGHTNING_JOLT]: function (s, lv) {
    n_A_Weapon_element = 4;
    s.mod = 1.6 + 0.4 * lv;
    wCast = 4;
  },
  [SKILLID.FIRST_WIND]: function (s, lv) {
    n_A_Weapon_element = 4;
    s.mod = 1 + lv;
    wCast = 4;
  },
};
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
function canApplyUaroMeltdownDebuff(e) {
  return PvP == 0 && SkillSearch(SKILLID.MELTDOWN) && !isMvpMonster(e);
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
