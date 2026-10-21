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
    scrivi("CRIATKname", "Critical damage (Critical rate)");
  else {
    scrivi("CRIATK", "");
    scrivi("CRInum", "");
    scrivi("CRIATKname", "");
  }
  scrivi("bSUB3name", "");
  scrivi("bSUB3", "");
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
  // calc lo mostra accanto al critico
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
  var piuAlto = destra + sinistra[2];
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
  scrivi("CRIATK", n_A_CriATK[0] + "~" + n_A_CriATK[2]);
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
  // doppio danno
  [SKILLID.SONIC_BLOW_SOUL_LINKED]: function (s, lv) {
    s.colpi = 8;
    s.mod += 0.5 * lv + 2;
    s.mod *= 2;
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
  // Provoke e Aloevera come per Shield Boomerang (nell'originale si sommavano a una variabile di
  // Shield Boomerang e non avevano effetto)
  if (SkillSearch(SKILLID.AUTO_BERSERK)) atk += 0.32 * atk;
  else if (n_A_Buf6[5]) atk += Math.floor(atk * (0.02 + 0.03 * n_A_Buf6[5]));
  else if (n_A_Buf7[31]) atk += Math.floor(0.05 * atk);
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
  scrivi("CRIATKname", '<Font color="#FF0000">Health drain</Font>');
  scrivi("CRIATK", '<Font color="#FF0000">' + Math.floor(n_A_MaxHP / 5) + "</Font>");
  scrivi("bSUB3name", '<Font color="#FF0000">Damage backlash</Font>');
  var contraccolpo = [0, 0, 0];
  var vitDEF = [n_A_VITDEF[2], n_A_VITDEF[1], n_A_VITDEF[0]];
  // MDEF da INT senza le riduzioni di StAllCalc (l'originale la scriveva in n_A_softMDEF, e
  // cambiava anche i danni magici subiti)
  var mdefINT = n_A_INT + Math.floor(n_A_VIT / 2);
  for (var e = 0; e <= 2; e++) {
    var d = BK_n_A_DMG[e] * defReduction(n_A_DEF) - vitDEF[e] + n_A_WeaponLV_refineATK;
    d = Math.floor(d * (1 + 0.4 * lv));
    var m = BK_n_A_MATK[e] * mdefReduction(n_A_MDEF) - mdefINT;
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
  scrivi(
    "bSUB3",
    '<Font color="#FF0000">3(hits) x ' + contraccolpo[0] + "~" + contraccolpo[2] + " damage</Font>",
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
    // Heavy Metaling Card: +50% per i Merchant (l'originale moltiplicava a ogni giro tutti e tre
    // i valori, anche quelli gia' moltiplicati)
    if (CardNumSearch(523) && [6, 12, 19, 26, 33, 40].includes(n_A_JOB)) w_DMG[e] *= 1.5;
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
// Throw Coins: danno fisso per livello, dimezzato sui boss
function throwCoins() {
  var lv = n_A_ActiveSkillLV;
  n_rangedAtk = 1;
  n_A_Weapon_element = 0;
  wCast = 0;
  n_Delay[2] = 2;
  w_HIT_HYOUJI = 100;
  var base = targetData[19] == 1 ? 250 : 500;
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
// Estin, Estun, Esma: elemento scelto a mano
function estin(s, lv) {
  n_A_Weapon_element = 1 * c.A_Weapon_element.value;
  wCast = 0.1;
  n_Delay[2] = 0.5;
  s.mod = targetData[4] == 0 ? 0.1 * lv : 0.01;
}
function estun(s, lv) {
  n_A_Weapon_element = 1 * c.A_Weapon_element.value;
  wCast = 0.1;
  n_Delay[2] = 0.5;
  s.mod = 0.05 * lv;
}
function esma(s, lv) {
  n_A_Weapon_element = 1 * c.A_Weapon_element.value;
  n_Delay[0] = 1;
  wHITsuu = lv;
  wCast = 2;
  n_Delay[2] = 0.5;
  s.mod = 0.4 + n_A_BaseLV / 100;
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
// moltiplicatore in percentuale dell'ATK da skill e buff (Auto Berserk, Spear Dynamo...), che
// Occult Impaction e Guillotine Fist non hanno
function ATKmod01Percent() {
  var percento = 100;
  if (
    SKILLID.OCCULT_IMPACTION != n_A_ActiveSkill &&
    SKILLID.GUILLOTINE_FIST != n_A_ActiveSkill &&
    SKILLID.GUILLOTINE_FIST_MAX_SP != n_A_ActiveSkill
  ) {
    if (SkillSearch(SKILLID.AUTO_BERSERK)) percento += 32;
    else if (n_A_Buf6[5]) percento += 2 + 3 * n_A_Buf6[5];
    else if (n_A_Buf7[31]) percento += 5;
    if (SkillSearch(SKILLID.SPEAR_DYNAMO)) percento += 5 * SkillSearch(SKILLID.SPEAR_DYNAMO);
    if (SkillSearch(SKILLID.FALCON_EYES)) percento += 2 * SkillSearch(SKILLID.FALCON_EYES);
    if (n_A_Buf2[19]) percento += 100;
    if (n_A_Buf6[2]) percento += 10;
    if (StPlusCalc2(87)) percento += StPlusCalc2(87);
    if (n_A_Buf6[22]) percento -= 25;
  }
  return percento;
}
// applica il moltiplicatore di ATKmod01Percent ad ATK normale e critico
function ATKmod01(percento) {
  if (percento == null) percento = ATKmod01Percent();
  for (var e = 0; e <= 2; e++) {
    n_A_CriATK[e] = (n_A_CriATK[e] * percento) / 100;
    n_A_DMG[e] = (n_A_DMG[e] * percento) / 100;
  }
}
// moltiplica l'ATK normale (critico = 0) o critico (critico = 1) per il moltiplicatore della
// skill (mod, 1 = 100%) piu' Power Thrust o Maximum Power Thrust
function ATKmod02(mod, critico) {
  var percento = 100 * mod;
  if (SkillSearch(SKILLID.MAXIMUM_POWER_THRUST))
    percento += 20 * SkillSearch(SKILLID.MAXIMUM_POWER_THRUST);
  else {
    if (SkillSearch(SKILLID.POWER_THRUST)) percento += 5 * SkillSearch(SKILLID.POWER_THRUST);
    if (SkillSearch(SKILLID.POWER_THRUST) == 0 && n_A_Buf2[8]) percento += 5 * n_A_Buf2[8];
  }
  var atk = critico == 0 ? n_A_DMG : n_A_CriATK;
  for (var e = 0; e <= 2; e++) atk[e] = Math.floor((atk[e] * percento) / 100);
}
// Blitz Beat automatico del falco durante l'attacco normale con l'arco: scrive il danno nei
// risultati secondari (n_TAKA_DMG) e restituisce quello medio per attacco
function BattleTAKA() {
  if (
    n_A_WeaponType != 10 ||
    !SkillSearch(SKILLID.BLITZ_BEAT) ||
    n_A_ActiveSkill == SKILLID.FOCUSED_ARROW_STRIKE
  ) {
    n_TAKA_DMG = 0;
    return 0;
  }
  // colpi: 1 ogni 10 livelli job, al massimo 5 e non oltre il livello di Blitz Beat.
  // tPlusDamCut legge wBTw1 (non raddoppia per Lex Aeterna): torna 0 alla fine
  wBTw1 = Math.min(5, Math.floor((n_A_JobLV - 1) / 10 + 1));
  if (SkillSearch(SKILLID.BLITZ_BEAT) < wBTw1) wBTw1 = SkillSearch(SKILLID.BLITZ_BEAT);
  var danno =
    80 +
    2 * Math.floor(n_A_DEX / 10) +
    2 * Math.floor(n_A_INT / 2) +
    6 * SkillSearch(SKILLID.STEEL_CROW);
  danno = tPlusDamCut(Math.floor(danno * element[targetData[3]][0]));
  // probabilita': 1 + LUK x 0,3 %; con il buff 65 in uno dei posti 8-11 di n_A_Buf8 e' sempre
  // 100% e il danno si divide fra i mostri (B_num)
  var probabilita;
  if (n_A_Buf8[8] == 65 || n_A_Buf8[9] == 65 || n_A_Buf8[10] == 65 || n_A_Buf8[11] == 65) {
    probabilita = 100;
    danno = Math.floor(danno / (1 + 1 * c.B_num.value));
  } else probabilita = Math.min(100, Math.round(100 * (1 + 0.3 * n_A_LUK)) / 100);
  // Emperium
  if (targetData[0] == 44) danno = 0;
  str_bSUBname += "Falcon damage (hits) (chance)<BR>";
  n_TAKA_DMG = danno * wBTw1;
  str_bSUB += n_TAKA_DMG + " (" + danno + " x " + wBTw1 + " hits)";
  str_bSUB += " (" + probabilita + "%)<BR>";
  var medio = (n_TAKA_DMG * probabilita) / 100;
  medio = (medio * (w_HIT + ((100 - w_HIT) * w_Cri) / 100)) / 100;
  wBTw1 = 0;
  return Math.round(100 * medio) / 100;
}
// cura di Heal al livello lv, su di se' (suSe = 1) o su un altro
function HealCalc(lv, suSe) {
  var cura = Math.floor((n_A_BaseLV + n_A_INT) / 8) * (8 * lv + 4);
  cura = Math.floor((cura * (100 + 2 * SkillSearch(SKILLID.MEDIATIO))) / 100);
  var bonus = 100 + bonusValues[91] + bonusValues[99];
  if (suSe == 1) bonus += bonusValues[92] + bonusValues[100];
  return Math.floor(cura * (bonus / 100) * (1 - (20 * n_A_Buf6[18]) / 100));
}
// cura di Sanctuary al livello lv, su di se' (suSe = 1) o su un altro
function SanctuaryCalc(lv, suSe) {
  var cura = lv < 7 ? 100 * lv : 777;
  var bonus = 100 + bonusValues[94] + bonusValues[99];
  if (suSe == 1) bonus += bonusValues[95] + bonusValues[100];
  return Math.floor(cura * (bonus / 100) * (1 - (20 * n_A_Buf6[18]) / 100));
}
// dopo il calcolo dell'attacco: risultati secondari, probabilita' di colpire, colpi per uccidere,
// esperienza per colpo, tempo e danno al secondo; poi i danni subiti (BattleHiDam) ridotti dalla
// probabilita' di schivarli
function BattleCalc998() {
  if (n_PerHIT_DMG > 0 && w_HIT_HYOUJI < 100) {
    str_bSUBname += "Damage when missing";
    if (str_PerHIT_DMG == 0) str_bSUB += n_PerHIT_DMG;
    else str_bSUB += str_PerHIT_DMG;
  }
  if (SKILLID.BASIC_ATTACK == n_A_ActiveSkill)
    w_HIT_HYOUJI -= (n_B_manual[38] * w_HIT_HYOUJI) / 100;
  scrivi("bSUBname", str_bSUBname);
  scrivi("bSUB", str_bSUB);
  scrivi("BattleHIT", w_HIT_HYOUJI);
  if (
    targetData[0] == 44 &&
    SKILLID.BASIC_ATTACK != n_A_ActiveSkill &&
    SKILLID.GRAVITY_FIELD != n_A_ActiveSkill
  )
    for (i = 0; i <= 2; i++) {
      w_DMG[i] = 0;
      myInnerHtml("ATK_0" + i, 0, 0);
    }
  tPlusAG();
  // Double Bolt: un colpo in piu' su dieci (campo della skill); i bolt di Hindsight valgono 1/4
  var doubleBolt = 1;
  var hindsight =
    n_A_ActiveSkill == SKILLID.FIRE_BOLT_HINDSIGHT ||
    n_A_ActiveSkill == SKILLID.COLD_BOLT_HINDSIGHT ||
    n_A_ActiveSkill == SKILLID.LIGHTNING_BOLT_HINDSIGHT;
  if (
    hindsight ||
    n_A_ActiveSkill == SKILLID.FIRE_BOLT ||
    n_A_ActiveSkill == SKILLID.COLD_BOLT ||
    n_A_ActiveSkill == SKILLID.LIGHTNING_BOLT
  ) {
    if (SkillSearch(SKILLID.DOUBLE_BOLT)) doubleBolt = 1 + c.SkillSubNum.value / 10;
    for (var e = 0; e <= 2; e++)
      w_DMG[e] = hindsight
        ? Math.floor((w_DMG[e] * doubleBolt) / 4)
        : Math.floor(w_DMG[e] * doubleBolt);
  }
  var colpi = colpiPerUccidere(w_DMG[2]);
  scrivi("MinATKnum", colpi < 10000 ? colpi : SubName[5]);
  if (SG_Special_HITnum != 0) {
    if (colpi == 1) scrivi("MinATKnum", "1 (" + probabilitaUnColpo() + "% chance)");
    SG_Special_HITnum = 0;
  }
  if (w_HIT_HYOUJI < 100 && n_PerHIT_DMG == 0)
    scrivi("MaxATKnum", "Infinite (no 100% hit)");
  else {
    colpi = colpiPerUccidere(w_HIT_HYOUJI < 100 ? n_PerHIT_DMG : w_DMG[0]);
    scrivi("MaxATKnum", colpi < 10000 ? colpi : SubName[5]);
  }
  // con il danno medio il resto si calcola senza arrotondare il danno (come nell'originale)
  colpi = Math.floor(targetData[6] / w_DMG[1]);
  if (targetData[6] % w_DMG[1] != 0) colpi += 1;
  scrivi("nm064", "");
  scrivi("AtkJobExp", "");
  scrivi("nm063", "Exp Per Hit");
  scrivi(
    "AtkBaseExp",
    colpi < 10000
      ? Math.round(targetData[16] / colpi) + " base, " + Math.round(targetData[17] / colpi) + " job"
      : SubName[7],
  );
  if (colpi < 10000) {
    scrivi("AveATKnum", colpi);
    var tempo = Math.floor(100 * ((wCast + wDelay) * colpi)) / 100;
    if (n_Delay[0]) scrivi("BattleTime", "Special");
    else scrivi("BattleTime", tempo + " seconds");
  } else {
    scrivi("AveATKnum", SubName[5]);
    scrivi("BattleTime", SubName[6]);
  }
  var alSecondo = Math.round((1 / (wCast + wDelay)) * w_DMG[1] * 100) / 100;
  if (n_Delay[0]) scrivi("AveSecondATK", "Special");
  else scrivi("AveSecondATK", alSecondo);
  var subito = BattleHiDam();
  subito = Math.round(subito * (100 - n_A_LUCKY)) / 100;
  subito = Math.max(0, Math.round(subito * (100 - w_FLEE)) / 100);
  if (n_A_Buf2[13]) subito = Math.round(subito * w_AG[n_A_Buf2[13]]) / 100;
  if (n_A_WeaponType == 3 && SkillSearch(SKILLID.PARRY))
    subito = Math.round(subito * (80 - 3 * SkillSearch(SKILLID.PARRY))) / 100;
  if (SkillSearch(SKILLID.COUNTER_INSTINCT))
    subito = Math.round(subito * (100 - 7.5 * SkillSearch(SKILLID.COUNTER_INSTINCT))) / 100;
  subito = Math.round(100 * subito * BskillHitNum) / 100;
  scrivi("B_Ave2Atk", subito);
  updateAttackSurvivability(subito);
}
// colpi per togliere tutti gli HP al mostro con un danno per colpo
function colpiPerUccidere(danno) {
  var colpi = Math.floor(targetData[6] / danno);
  if (targetData[6] % Math.floor(danno) != 0) colpi += 1;
  return colpi;
}
// Storm Gust, Water Ball e simili (SG_Special_HITnum colpi): probabilita' in % di uccidere con un
// solo lancio, dalla distribuzione della somma dei colpi
function probabilitaUnColpo() {
  var colpi = SG_Special_HITnum,
    minimo = SG_Special_DMG[0] * wHITsuu,
    massimo = SG_Special_DMG[2] * wHITsuu;
  var p = (massimo - targetData[6]) / (massimo - minimo);
  if (p > 1) p = 1;
  if (p < 0) p = 0;
  if (colpi == 2) {
    if (p < 0.5) p *= 2 * p;
    else p = 1 - 2 * (1 - p) * (1 - p);
  }
  if (colpi == 3) {
    if (p < 1 / 3) p = 4.5 * Math.pow(p, 3);
    else if (1 / 3 <= p && p < 2 / 3) p = 4.5 * (Math.pow(p, 3) - 3 * Math.pow(p - 1 / 3, 3));
    else if (2 / 3 <= p) p = 1 - 4.5 * Math.pow(1 - p, 3);
  }
  if (colpi >= 4) {
    var scarto = Math.sqrt((Math.pow(SG_Special_DMG[2] - SG_Special_DMG[0], 2) / 12) * colpi);
    var z = (SG_Special_DMG[1] * wHITsuu - targetData[6]) / scarto;
    var meta = 0.5 * Math.sqrt(1 - Math.exp((-2 * Math.pow(z, 2)) / Math.PI));
    p = z >= 0 ? 0.5 + meta : 0.5 - meta;
  }
  return Math.floor(10000 * p) / 100;
}
function formatEffectiveHP(hp) {
  return hp == Infinity
    ? "∞"
    : !isFinite(hp) || hp < 0
      ? "—"
      : Math.round(hp).toLocaleString("en-US");
}
function formatSurvivalHits(minimo, massimo) {
  if (minimo == Infinity && massimo == Infinity) return "∞ hits";
  var da = minimo == Infinity ? "∞" : minimo.toLocaleString("en-US"),
    a = massimo == Infinity ? "∞" : massimo.toLocaleString("en-US");
  return da == a ? da + (minimo == 1 ? " hit" : " hits") : da + "–" + a + " hits";
}
// HP effettivi (gli HP divisi per la parte di danno che passa le difese, anche con la schivata
// media subitoMedio) e colpi del mostro per uccidere il personaggio
function updateAttackSurvivability(subitoMedio) {
  var grezzo = n_B_rawAverageDamage * BskillHitNum,
    medio = n_B_averageDamage * BskillHitNum,
    effettivi = grezzo > 0 ? (medio > 0 ? (n_A_MaxHP * grezzo) / medio : Infinity) : NaN,
    attesi = grezzo > 0 ? (subitoMedio > 0 ? (n_A_MaxHP * grezzo) / subitoMedio : Infinity) : NaN;
  scrivi("B_EffectiveHP", formatEffectiveHP(effettivi));
  scrivi("B_ExpectedEffectiveHP", formatEffectiveHP(attesi));
  var minimo = n_B_minDamage * BskillHitNum,
    massimo = n_B_maxDamage * BskillHitNum,
    colpiMin = massimo > 0 ? Math.ceil(n_A_MaxHP / massimo) : Infinity,
    colpiMax = minimo > 0 ? Math.ceil(n_A_MaxHP / minimo) : Infinity;
  scrivi("B_SurvivalHits", formatSurvivalHits(colpiMin, colpiMax));
}
// Danni che il mostro fa al personaggio con l'attacco o la skill scelti (B_AtkSkill), su sette
// punti fra il minimo e il massimo: scritti nella pagina e in n_B_*Damage; restituisce il medio.
// SKILL_NEMICO prepara la skill, poi danni fisici o magici, riduzioni, elemento e casi speciali
function BattleHiDam() {
  var s = skillNemico,
    lv = s.lv;
  var d = n_B_rangedMAtk == 0 ? danniFisiciNemico(s, lv) : danniMagiciNemico(s);
  riduzioniSubite(d);
  var senzaElemento = elementoSubito(d, s);
  var i;
  if (n_A_Buf2[5])
    if (c.A8_Skill14.value > 0 || n_A_Buf6[2])
      for (i = 0; i <= 6; i++) d[i] = Math.floor((2 * d[i]) / 3);
    else for (i = 0; i <= 6; i++) d[i] = Math.floor(d[i] / 2);
  if (n_A_Buf6[16]) for (i = 0; i <= 6; i++) d[i] = Math.floor(2 * d[i]);
  if (n_A_Buf2[21]) for (i = 0; i <= 6; i++) d[i] = Math.floor(d[i] / 2);
  d[0] = Math.floor(d[0]);
  d[6] = Math.floor(d[6]);
  casiSpecialiNemico(d, s, lv);
  if (CardNumSearch(126) && n_B_rangedMAtk == 1) for (i = 0; i <= 6; i++) d[i] = 0;
  scrivi(
    "B_WeaponElement",
    senzaElemento
      ? "<span class=name><b style='color:#A89682'>None</b><span class=nametext>Monster's basic attacks are non-elemental, not Neutral; they bypass armor-property modifiers such as Ghostring, but are still reduced by Neutral-resistance gear/cards.</span></span> (100% vs any element)"
      : v_Element[s.elemento] +
          " (" +
          100 * element[10 * n_A_Bodyelement + 1][s.elemento] +
          "% vs " +
          v_Element[n_A_Bodyelement] +
          "1)",
  );
  var somma = 0;
  for (i = 0; i <= 6; i++) {
    d[i] = Math.max(0, Math.floor(d[i]));
    somma += d[i];
  }
  var medio = Math.round(somma / 7);
  n_B_rawAverageDamage = s.grezzo;
  n_B_averageDamage = medio;
  n_B_minDamage = d[0];
  n_B_maxDamage = d[6];
  riflessoSubito(
    "aREFLECT1",
    n_A_Buf2[14] ? 10 + 3 * n_A_Buf2[14] : 0,
    "Damage reflected (Shield Reflect)",
    medio,
    d,
  );
  riflessoSubito("aREFLECT2", bonusValues[71], "Damage reflected (equip/cards)", medio, d);
  if (BskillHitNum > 1) {
    scrivi("B_MinAtk", d[0] * BskillHitNum + " (" + d[0] + " x " + BskillHitNum + " hits)");
    scrivi(
      "B_AveAtk",
      medio * BskillHitNum + " (" + medio + " x " + BskillHitNum + " hits)",
    );
    scrivi("B_MaxAtk", d[6] * BskillHitNum + " (" + d[6] + " x " + BskillHitNum + " hits)");
  } else {
    scrivi("B_MinAtk", d[0] + "");
    scrivi("B_AveAtk", medio + "");
    scrivi("B_MaxAtk", d[6] + "");
  }
  return medio;
}
// skill del mostro scelta (B_AtkSkill), preparata da SKILL_NEMICO in skillNemico: calc la chiama
// prima della probabilita' di schivare, che dipende da HIT e distanza della skill (l'originale la
// preparava solo dopo, e la schivata usava la skill del calcolo precedente)
var skillNemico;
function preparaSkillNemico() {
  n_B_rangedAtk = 0;
  n_B_rangedMAtk = 0;
  n_B_AtkSkill = c.B_AtkSkill.value;
  BskillHitNum = 1;
  var lv = m_Monster[targetData[0]][2 * c.B_AtkSkill.selectedIndex + 22];
  skillNemico = {
    lv: lv,
    mod: 100,
    elemento: 0,
    ignoraDEF: false,
    matk: matkNemico(n_B_manual[42], n_B_manual[43]),
    grezzo: 0,
  };
  if (SKILL_NEMICO[n_B_AtkSkill]) SKILL_NEMICO[n_B_AtkSkill](skillNemico, lv);
}
// MATK minima, media e massima del mostro (da targetData[9]), con i bonus scritti a mano
function matkNemico(piu, percento) {
  var matk = [0, 0, 0];
  var n = Math.floor(targetData[9] / 7);
  matk[0] = targetData[9] + piu + n * n;
  matk[0] += (percento * matk[0]) / 100;
  n = Math.floor(targetData[9] / 5);
  matk[2] = targetData[9] + piu + n * n;
  matk[2] += (percento * matk[2]) / 100;
  matk[1] = (matk[2] + matk[0]) / 2;
  return matk;
}
// sette punti dal minimo al massimo, con il moltiplicatore della skill in percentuale
function settePunti(minimo, massimo, mod) {
  return [
    (mod / 100) * minimo,
    ((mod / 100) * (5 * minimo + massimo)) / 6,
    ((mod / 100) * (4 * minimo + 2 * massimo)) / 6,
    ((mod / 100) * (minimo + massimo)) / 2,
    ((mod / 100) * (2 * minimo + 4 * massimo)) / 6,
    ((mod / 100) * (minimo + 5 * massimo)) / 6,
    (mod / 100) * massimo,
  ];
}
// media dei sette punti, prima delle difese (n_B_rawAverageDamage)
function mediaPunti(d) {
  var somma = 0;
  for (var i = 0; i <= 6; i++) somma += d[i];
  return somma / 7;
}
// quale VIT DEF (minima, media, massima) riduce ciascuno dei sette punti
var VIT_DEF_PUNTO = [2, 2, 2, 1, 0, 0, 0];
// danni fisici: ATK del mostro (targetData[12]-[13]), poi DEF e VIT DEF se la skill non le ignora
function danniFisiciNemico(s, lv) {
  var d;
  // Clashing Spiral: ATK senza il moltiplicatore della skill, piu' un bonus da targetData[5]
  if (n_B_AtkSkill == SKILLID.CLASHING_SPIRAL) {
    var str = Math.floor(targetData[5]),
      bonus = str + 2 * (Math.floor(str / 10) * Math.floor(str / 10));
    d = settePunti(targetData[12], targetData[13], 100).map((x) => x + bonus);
  } else d = settePunti(targetData[12], targetData[13], s.mod);
  s.grezzo = mediaPunti(d);
  if (!s.ignoraDEF)
    for (var i = 0; i <= 6; i++)
      d[i] = d[i] * defReduction(n_A_totalDEF) - n_A_VITDEF[VIT_DEF_PUNTO[i]];
  return d;
}
// danni magici: MATK del mostro, poi MDEF e MDEF da INT
function danniMagiciNemico(s) {
  var d = settePunti(s.matk[0], s.matk[2], s.mod);
  s.grezzo = mediaPunti(d);
  for (var i = 0; i <= 6; i++) d[i] = d[i] * mdefReduction(n_A_MDEF) - n_A_softMDEF;
  return d;
}
// attacco del mostro da lontano: lo decidono il mostro, la skill o la scelta nel campo B_AtkRange
function nemicoDaLontano() {
  return (
    (targetData[20] || n_B_rangedAtk || n_B_rangedMAtk || c.B_AtkRange.value == 2) &&
    c.B_AtkRange.value != 1
  );
}
// toglie a ogni punto la percentuale data
function riduci(d, percento) {
  for (var i = 0; i <= 6; i++) d[i] -= Math.floor((d[i] * percento) / 100);
}
// riduzioni dei danni subiti: skill, resistenze per razza, taglia, boss, distanza, elemento e
// mostro, buff
function riduzioniSubite(d) {
  var i;
  if (SkillSearch(SKILLID.DIVINE_PROTECTION) && (targetData[3] >= 90 || targetData[2] == 6)) {
    var protezione = Math.floor((3 + 0.04 * n_A_BaseLV) * SkillSearch(SKILLID.DIVINE_PROTECTION));
    for (i = 0; i <= 6; i++) d[i] -= protezione;
  }
  if (SkillSearch(SKILLID.SOLAR_PROTECTION)) {
    protezione = Math.floor((n_A_BaseLV + n_A_LUK + n_A_DEX) / 2);
    for (i = 0; i <= 6; i++) d[i] -= protezione;
  }
  if (SkillSearch(SKILLID.ENERGY_COAT)) riduci(d, 6 * SkillSearch(SKILLID.ENERGY_COAT));
  riduci(d, bonusValues[50 + targetData[2]]);
  riduci(d, bonusValues[190 + targetData[4]]);
  if (targetData[19] == 0) riduci(d, bonusValues[79]);
  if (nemicoDaLontano()) {
    riduci(d, bonusValues[78]);
    if (SkillSearch(SKILLID.GUNSLINGERS_PANIC)) riduci(d, 20);
  }
  if ((targetData[20] || c.B_AtkRange.value == 2) && c.B_AtkRange.value != 1) {
    if (n_A_Buf2[15]) riduci(d, 5 + 15 * n_A_Buf2[15]);
    if (n_A_Buf6[3]) riduci(d, 75);
  }
  if (n_A_Buf6[3] && n_B_AtkSkill == SKILLID.CLASHING_SPIRAL) riduci(d, 25);
  if (targetData[19] == 1) riduci(d, bonusValues[77]);
  riduci(d, bonusValues[330 + Math.floor(targetData[3] / 10)]);
  riduci(d, StPlusCard(3000 + targetData[0]) + StPlusCalc2(3000 + targetData[0]));
  if (n_A_Buf7[22] && MANUKU_MONSTER()) for (i = 0; i <= 6; i++) d[i] -= Math.floor(d[i] / 10);
  if (n_A_Buf7[25] && SUPURE_MONSTER()) for (i = 0; i <= 6; i++) d[i] -= Math.floor(d[i] / 10);
  for (i = 0; i <= 6; i++) if (d[i] < 1) d[i] = 1;
}
// elemento dell'attacco (scelto in B_AtkElem, o quello della skill) contro l'armatura; restituisce
// true se e' l'attacco normale senza elemento, che vale 100% su qualunque elemento Ghost
function elementoSubito(d, s) {
  var scelto = 1 * c.B_AtkElem.value;
  if (scelto < 10) s.elemento = scelto;
  var senzaElemento = scelto == 10 && n_B_AtkSkill == 0;
  var resistenza =
    n_A_Bodyelement == 8 && senzaElemento
      ? 100
      : 100 * Math.max(0, element[10 * n_A_Bodyelement + 1][s.elemento]);
  var fattore = resistenza - Math.floor(resistenza * bonusValues[60 + 1 * s.elemento]) / 100;
  for (var i = 0; i <= 6; i++) d[i] = Math.floor((d[i] * fattore) / 100);
  return senzaElemento;
}
// skill del mostro con un danno che non viene dall'ATK
function casiSpecialiNemico(d, s, lv) {
  var id = n_B_AtkSkill,
    i;
  // colpi divisi fra i bersagli (campo della skill)
  if (id == SKILLID.EARTHQUAKE_MELEE || id == SKILLID.EARTHQUAKE_RANGED) {
    var bersagli = 1 * c.BSkillSubNum.value;
    for (i = 0; i <= 6; i++) d[i] = Math.floor(d[i] / bersagli);
  }
  if (
    (id == SKILLID.HELLS_JUDGEMENT_MELEE || id == SKILLID.HELLS_JUDGEMENT_RANGED) &&
    n_A_Bodyelement == 7
  )
    for (i = 0; i <= 6; i++) d[i] = 0;
  if (id == SKILLID.DARK_BREATH) {
    s.grezzo = Math.floor((lv * n_A_MaxHP) / 10);
    for (i = 0; i <= 6; i++) d[i] = s.grezzo;
  }
  if (id == SKILLID.DARK_BLESSING)
    if (n_A_Bodyelement == 7) for (i = 0; i <= 6; i++) d[i] = 0;
    else {
      s.grezzo = n_A_MaxHP - 1;
      for (i = 0; i <= 6; i++) d[i] = s.grezzo;
    }
  // danno scritto nel campo della skill, ridotto dalla resistenza al fuoco
  if (id == SKILLID.SUICIDE_BOMBING) {
    s.elemento = 3;
    s.grezzo = 1 * c.BSkillSubNum.value;
    for (i = 0; i <= 6; i++)
      d[i] = 1 * c.BSkillSubNum.value - Math.floor((c.BSkillSubNum.value * bonusValues[63]) / 100);
  }
}
// danno che lo scudo o l'equipaggiamento riflettono al mostro, solo dagli attacchi in mischia
function riflessoSubito(id, percento, nome, medio, d) {
  if (!percento) {
    scrivi(id, "");
    scrivi(id + "name", "");
    return;
  }
  if (nemicoDaLontano()) scrivi(id, '<B style="color:blue">(no melee dmg to reflect)</B>');
  else {
    var minimo = Math.floor((d[0] * percento) / 100),
      massimo = Math.floor((d[6] * percento) / 100);
    if (medio > 0) {
      if (minimo == 0) minimo = 1;
      if (massimo == 0) massimo = 1;
    }
    scrivi(id, '<B style="color:blue">' + minimo + " ~ " + massimo + "</B>");
  }
  scrivi(id + "name", '<SPAN style="color:blue">' + nome + "</SPAN>");
}
// Earthquake: ATK in piu' per livello (1-10)
var PIU_EARTHQUAKE = [0, 200, 400, 500, 700, 900, 1100, 1200, 1400, 1500, 1700];
// prepara(s, lv) per skill del mostro: s.mod (100 = ATK pieno), s.elemento, s.ignoraDEF, s.matk;
// la skill imposta anche colpi (BskillHitNum), distanza (n_B_rangedAtk) e magia (n_B_rangedMAtk)
var SKILL_NEMICO = {
  [SKILLID.EARTHQUAKE_MELEE]: function (s, lv) {
    BskillHitNum = 3;
    n_B_rangedAtk = n_B_AtkSkill - SKILLID.EARTHQUAKE_MELEE;
    s.ignoraDEF = true;
    if (CardNumSearch(126)) s.mod = 0;
    else s.mod += PIU_EARTHQUAKE[lv] || 0;
  },
  [SKILLID.HELLS_JUDGEMENT_MELEE]: function (s, lv) {
    s.mod += 100 * lv;
    n_B_rangedAtk = n_B_AtkSkill - SKILLID.HELLS_JUDGEMENT_MELEE;
  },
  [SKILLID.PULSE_STRIKE_MELEE]: function (s, lv) {
    s.mod += 100 * lv - 100;
    n_B_rangedAtk = n_B_AtkSkill - SKILLID.PULSE_STRIKE_MELEE;
  },
  [SKILLID.CURSE_ATTACK]: function (s, lv) {
    s.elemento = 7;
  },
  [SKILLID.MULTI_STAGE_ATTACK]: function (s, lv) {
    BskillHitNum = 1 + lv;
    s.mod += 100 * lv - 100;
  },
  [SKILLID.SOUL_STRIKE_OF_DARKNESS]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 7;
    BskillHitNum = Math.round(lv / 2);
  },
  [SKILLID.DARKNESS_JUPITEL]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 7;
    BskillHitNum = 2 + lv;
  },
  [SKILLID.CROSS_OF_DARKNESS]: function (s, lv) {
    s.elemento = 7;
    s.mod += 35 * lv;
  },
  [SKILLID.GRAND_CROSS_OF_DARKNESS]: function (s, lv) {
    s.elemento = 7;
    s.mod += 40 * lv;
  },
  [SKILLID.DEMON_SHOCK_ATTACK]: function (s, lv) {
    s.matk = matkNemico(0, 0);
    s.mod = targetData[9];
  },
  [SKILLID.BLEEDING]: function (s, lv) {
    n_B_HIT += 20;
  },
  [SKILLID.VAMPIRE_GIFT]: function (s, lv) {
    if (lv < 6) s.mod = 100 * lv - 100;
    else s.mod += 100 * (lv - 5) - 100;
  },
  [SKILLID.PIERCING_ATTACK]: function (s, lv) {
    s.ignoraDEF = true;
  },
  // in gioco l'elemento e' a caso: qui Neutral, o quello scelto in B_AtkElem (l'originale ne
  // estraeva uno a ogni calcolo)
  [SKILLID.RANDOM_ATTACK]: function (s, lv) {
    s.mod += 100 * lv - 100;
  },
  [SKILLID.STAND_OFF_ATTACK]: function (s, lv) {
    n_B_rangedAtk = 1;
  },
  // ignora la DEF e colpisce sempre con l'ATK massimo
  [SKILLID.DEFENSE_DISREGARD_ATTACK]: function (s, lv) {
    s.ignoraDEF = true;
    targetData[12] = targetData[13];
  },
  [SKILLID.BASH]: function (s, lv) {
    s.mod += 30 * lv;
    n_B_HIT *= 1 + 0.05 * lv;
  },
  [SKILLID.MAGNUM_BREAK]: function (s, lv) {
    s.mod += 20 * lv;
    n_B_HIT *= 1 + 0.1 * lv;
    s.elemento = 3;
  },
  [SKILLID.ENVENOM]: function (s, lv) {
    s.mod += 20 * lv;
    s.elemento = 5;
  },
  [SKILLID.SAND_ATTACK]: function (s, lv) {
    s.mod += 30;
    s.elemento = 2;
  },
  [SKILLID.DOUBLE_STRAFE]: function (s, lv) {
    s.mod += 10 * lv - 10;
    BskillHitNum = 2;
  },
  [SKILLID.ARROW_SHOWER]: function (s, lv) {
    n_B_rangedAtk = 1;
    s.mod += 5 * lv - 25;
  },
  [SKILLID.ARROW_REPEL]: function (s, lv) {
    n_B_rangedAtk = 1;
    s.mod += 50;
  },
  [SKILLID.NAPALM_BEAT]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 8;
    s.mod += 10 * lv - 30;
  },
  [SKILLID.SOUL_STRIKE]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 8;
    BskillHitNum = Math.round(lv / 2);
    if (targetData[3] == 91 || targetData[3] == 92 || targetData[3] == 93 || targetData[3] == 94)
      s.mod += 5 * lv;
  },
  [SKILLID.FIRE_BOLT]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 3;
    BskillHitNum = lv;
  },
  [SKILLID.FIRE_BALL]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 3;
    s.mod += 10 * lv - 30;
  },
  [SKILLID.FIRE_WALL]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 3;
    BskillHitNum = 4 + lv;
    s.mod -= 50;
  },
  [SKILLID.COLD_BOLT]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 1;
    BskillHitNum = lv;
  },
  [SKILLID.FROST_DIVER]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 1;
    s.mod += 10 * lv;
  },
  [SKILLID.LIGHTNING_BOLT]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 4;
    BskillHitNum = lv;
  },
  [SKILLID.THUNDER_STORM]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 4;
    BskillHitNum = lv;
    s.mod -= 20;
  },
  [SKILLID.MAMMONITE]: function (s, lv) {
    s.mod += 50 * lv;
  },
  [SKILLID.CART_REVOLUTION]: function (s, lv) {
    s.elemento = 3;
    s.mod += 50 * lv + (100 * c.BSkillSubNum.value) / 8000;
  },
  [SKILLID.PIERCE]: function (s, lv) {
    s.mod += 10 * lv;
    BskillHitNum = 2;
  },
  [SKILLID.SPEAR_STAB]: function (s, lv) {
    s.mod += 20 * lv;
    n_B_rangedAtk = 1;
  },
  [SKILLID.SPEAR_BOOMERANG]: function (s, lv) {
    s.mod += 50 * lv;
    n_B_rangedAtk = 1;
  },
  [SKILLID.BRANDISH_SPEAR]: function (s, lv) {
    var a = 20 * lv + 100;
    s.mod +=
      lv == 10 ? 462.5 : lv >= 7 ? a + a / 2 + a / 4 - 100 : lv >= 4 ? a + a / 2 - 100 : a - 100;
  },
  [SKILLID.BOWLING_BASH]: function (s, lv) {
    s.mod += 40 * lv;
    BskillHitNum = 2;
  },
  [SKILLID.SONIC_BLOW]: function (s, lv) {
    s.mod += 50 * lv + 200;
  },
  // doppio danno
  [SKILLID.SONIC_BLOW_SOUL_LINKED]: function (s, lv) {
    s.mod += 50 * lv + 200;
    s.mod *= 2;
  },
  [SKILLID.GRIMTOOTH]: function (s, lv) {
    if (lv >= 3) n_B_rangedAtk = 1;
    s.mod += 20 * lv;
  },
  [SKILLID.VENOM_SPLASHER]: function (s, lv) {
    s.mod += 400 + 50 * lv + 30 * c.BSkillSubNum.value;
    s.elemento = 5;
  },
  // Magnus Exorcismus: solo su chi ha la carta 139 nell'armatura
  [SKILLID.MAGNUS_EXORCISMUS]: function (s, lv) {
    if (n_A_card[11] == 139) s.mod += 30 * lv;
    else s.mod = 0;
    n_B_rangedMAtk = 1;
    s.elemento = 6;
  },
  [SKILLID.FREEZING_TRAP]: function (s, lv) {
    s.elemento = 1;
  },
  [SKILLID.FIRE_PILLAR]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 3;
    BskillHitNum = 2 + lv;
    s.mod -= 30;
  },
  [SKILLID.SIGHTRASHER]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 3;
    s.mod += 20 * lv;
  },
  [SKILLID.METEOR_STORM]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 3;
    BskillHitNum = c.BSkillSubNum.value * Math.round(lv / 2);
  },
  [SKILLID.JUPITEL_THUNDER]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 4;
    BskillHitNum = 2 + lv;
  },
  [SKILLID.LORD_OF_VERMILLION]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 4;
    BskillHitNum = 4;
    s.mod += 20 * lv - 20;
  },
  [SKILLID.WATER_BALL]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 1;
    BskillHitNum = lv >= 4 ? 25 : lv >= 2 ? 9 : 1;
    s.mod += 30 * lv;
  },
  [SKILLID.FROST_NOVA]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 1;
    s.mod += 7 * lv - 34;
  },
  [SKILLID.STORM_GUST]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 1;
    BskillHitNum = c.BSkillSubNum.value;
    s.mod += 40 * lv;
  },
  [SKILLID.EARTH_SPIKE]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 2;
    BskillHitNum = lv;
  },
  [SKILLID.SMITE]: function (s, lv) {
    s.mod += 20 * lv;
  },
  [SKILLID.SHIELD_BOOMERANG]: function (s, lv) {
    n_B_rangedAtk = 1;
    s.mod += 30 * lv;
  },
  [SKILLID.HOLY_CROSS]: function (s, lv) {
    s.mod += 35 * lv;
    s.elemento = 6;
  },
  [SKILLID.GRAND_CROSS]: function (s, lv) {
    s.mod += 40 * lv;
    n_B_rangedMAtk = 1;
    s.elemento = 6;
  },
  [SKILLID.BACK_STAB]: function (s, lv) {
    s.mod += 40 * lv + 200;
  },
  [SKILLID.SIGHTLESS_MIND]: function (s, lv) {
    s.mod += 40 * lv;
  },
  [SKILLID.GANK]: function (s, lv) {
    s.mod += 30 * lv;
  },
  [SKILLID.RAGING_QUADRUPLE_BLOW]: function (s, lv) {
    BskillHitNum = 4;
    s.mod += 50 * lv + 50;
  },
  [SKILLID.RAGING_THRUST]: function (s, lv) {
    s.mod += 60 * lv + 140;
  },
  [SKILLID.MELODY_STRIKE]: function (s, lv) {
    s.mod += 40 * lv - 40;
    n_B_rangedAtk = 1;
  },
  [SKILLID.BOMB]: function (s, lv) {
    s.elemento = 3;
    s.mod += 0.2 * lv;
  },
  [SKILLID.CLASHING_SPIRAL]: function (s, lv) {
    BskillHitNum = 5;
    n_B_rangedAtk = 1;
    s.ignoraDEF = true;
  },
  [SKILLID.TRAUMATIC_BLOW]: function (s, lv) {
    n_B_rangedAtk = 1;
    s.mod += 40 * lv;
  },
  [SKILLID.VITAL_STRIKE]: function (s, lv) {
    n_B_rangedAtk = 1;
    s.mod += 10 * lv - 50;
  },
  [SKILLID.METEOR_ASSAULT]: function (s, lv) {
    s.mod += 40 * lv - 60;
  },
  [SKILLID.NAPALM_VULCAN]: function (s, lv) {
    n_B_rangedMAtk = 1;
    s.elemento = 8;
    BskillHitNum = lv;
  },
  [SKILLID.RAGING_PALM_STRIKE]: function (s, lv) {
    s.mod += 100 * (1 + lv);
  },
  [SKILLID.GLACIER_FIST]: function (s, lv) {
    s.mod += 100 * lv - 60;
  },
  [SKILLID.CHAIN_CRUSH_COMBO]: function (s, lv) {
    s.mod += 100 * (3 + lv);
  },
  [SKILLID.ARROW_VULCAN]: function (s, lv) {
    BskillHitNum = 9;
    s.mod += 100 * (1 + lv);
    n_B_rangedAtk = 1;
  },
  [SKILLID.TOMAHAWK_THROWING]: function (s, lv) {
    n_B_rangedAtk = 1;
    s.elemento = 4;
  },
  [SKILLID.PULSE_STRIKE]: function (s, lv) {
    s.mod += 100 * (lv - 1);
  },
  [SKILLID.FLYING_KICK]: function (s, lv) {
    s.mod += 4 * n_A_BaseLV - 100;
  },
  [SKILLID.THROW_VENOM_KNIFE]: function (s, lv) {
    n_B_rangedAtk = 1;
  },
  [SKILLID.PHANTASMIC_ARROW]: function (s, lv) {
    n_B_rangedAtk = 1;
    s.mod += 50;
  },
  // come nell'originale legge il campo della skill del personaggio, non quello del mostro
  [SKILLID.CHARGE_ATTACK]: function (s, lv) {
    s.mod += 100 * (1 * c.SkillSubNum.value);
  },
  [SKILLID.RAPID_SMITING]: function (s, lv) {
    n_B_HIT += 20;
    BskillHitNum = 5;
    n_B_rangedAtk = 1;
    s.mod += 30 * lv;
  },
  [SKILLID.HIGH_SPEED_CART_RAM]: function (s, lv) {
    not_use_card = 1;
    s.mod += Math.floor(100 * ((1 * c.BSkillSubNum.value) / (16 - lv) / 100 - 1));
  },
  [SKILLID.EXCRUCIATING_PALM]: function (s, lv) {
    s.mod += 200;
  },
};
// skill uguali a un'altra, e gruppi di skill che cambiano solo elemento o distanza
SKILL_NEMICO[SKILLID.EARTHQUAKE_RANGED] = SKILL_NEMICO[SKILLID.EARTHQUAKE_MELEE];
SKILL_NEMICO[SKILLID.HELLS_JUDGEMENT_RANGED] = SKILL_NEMICO[SKILLID.HELLS_JUDGEMENT_MELEE];
SKILL_NEMICO[SKILLID.PULSE_STRIKE_RANGED] = SKILL_NEMICO[SKILLID.PULSE_STRIKE_MELEE];
SKILL_NEMICO[SKILLID.BLIND_ATTACK] =
  SKILL_NEMICO[SKILLID.SUCKING_BLOOD] =
  SKILL_NEMICO[SKILLID.ENERGY_DRAIN] =
    SKILL_NEMICO[SKILLID.CURSE_ATTACK];
SKILL_NEMICO[SKILLID.MAGNUS_EXORCISMUS_UARO] = SKILL_NEMICO[SKILLID.MAGNUS_EXORCISMUS];
SKILL_NEMICO[SKILLID.WATER_BALL_2] = SKILL_NEMICO[SKILLID.WATER_BALL];
SKILL_NEMICO[SKILLID.HEAVENS_DRIVE] = SKILL_NEMICO[SKILLID.EARTH_SPIKE];
SKILL_NEMICO[SKILLID.SLINGING_ARROW] = SKILL_NEMICO[SKILLID.MELODY_STRIKE];
SKILL_NEMICO[SKILLID.SHIELD_BOOMERANG_SOUL_LINKED] = SKILL_NEMICO[SKILLID.SHIELD_BOOMERANG];
// 450-459 corpo a corpo, 490-499 corpo a corpo e 500-509 a distanza: elemento = id - base
for (let elemento = 0; elemento <= 9; elemento++) {
  SKILL_NEMICO[450 + elemento] = function (s, lv) {
    s.elemento = elemento;
    s.mod += 100 * lv - 100;
  };
  SKILL_NEMICO[490 + elemento] = function (s, lv) {
    n_B_rangedAtk = 0;
    s.elemento = elemento;
    s.mod += 100 * lv - 100;
  };
  SKILL_NEMICO[500 + elemento] = function (s, lv) {
    n_B_rangedAtk = 1;
    s.elemento = elemento;
    s.mod += 100 * lv - 100;
  };
}
function getTargetElementDamageBonus() {
  var elemento = Math.floor(targetData[3] / 10);
  return elemento == 0
    ? bonusValues[BONUSID.DMG_NEUTRAL_PHYSICAL_MAGIC_PERCENT]
    : elemento == 7
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
function canMagnusExorcismusHitTarget(skill) {
  return skill == SKILLID.MAGNUS_EXORCISMUS
    ? targetData[2] == RACEID.DEMON || targetData[3] >= ELEMENTID.UNDEAD_1
    : skill != SKILLID.MAGNUS_EXORCISMUS_UARO ||
        targetData[2] == RACEID.UNDEAD ||
        targetData[2] == RACEID.DEMON ||
        targetData[3] >= ELEMENTID.SHADOW_1;
}
// danno di un colpo di magia con quella MATK: MDEF, elemento, bonus per razza, elemento, boss e
// skill
function BattleMagicCalc(matk) {
  var mdef = targetData[15];
  // la carta 424 ignora la MDEF dei mostri normali (e azzera n_B_MDEF2 anche dopo)
  if (targetData[19] == 0 && CardNumSearch(424)) {
    mdef = 0;
    n_B_MDEF2 = 0;
  }
  var danno;
  if (SKILLID.FIRE_PILLAR == n_A_ActiveSkill) danno = Math.floor(matk + 50);
  else if (CardNumSearch(571)) danno = Math.floor((matk * (mdef + n_B_MDEF2)) / 100);
  else danno = Math.floor(matk * mdefReduction(mdef) - n_B_MDEF2);
  if (danno < 1) danno = 1;
  if (
    (SKILLID.MAGNUS_EXORCISMUS == n_A_ActiveSkill ||
      SKILLID.MAGNUS_EXORCISMUS_UARO == n_A_ActiveSkill) &&
    !canMagnusExorcismusHitTarget(n_A_ActiveSkill)
  )
    danno = 0;
  danno = Math.floor(danno * Math.max(0, element[targetData[3]][n_A_Weapon_element]));
  if (targetData[3] > 89 && targetData[3] < 95 && SKILLID.SOUL_STRIKE == n_A_ActiveSkill)
    // uaRO: Soul Strike: +7% di danno per livello contro i non morti, non +5% (Class Changes,
    // Mage; patch del 24/11/2025)
    danno = Math.floor(danno * (1 + 0.07 * n_A_ActiveSkillLV));
  var bonus = bonusValues[170 + targetData[2]];
  if (targetData[2] == 9 && SkillSearch(SKILLID.DRAGONOLOGY))
    bonus += 2 * SkillSearch(SKILLID.DRAGONOLOGY);
  danno = (danno * (100 + bonus)) / 100;
  danno = (danno * (100 + getTargetElementDamageBonus())) / 100;
  if (targetData[19] == 1)
    danno = (danno * (100 + bonusValues[BONUSID.MAGIC_BOSS_DMG_PERCENT])) / 100;
  danno = tPlusDamCut(danno);
  var skillBase = baseSkillId(n_A_ActiveSkill);
  bonus = StPlusCalc2(5000 + skillBase) + StPlusCard(5000 + skillBase);
  if (skillBase == SKILLID.MAGNUS_EXORCISMUS)
    bonus += 4 * SkillSearch(SKILLID.IMPOSITIO_MANUS) * EquipNumSearch(EQUIPID.VALKYRIE_DROP);
  // uaRO: Old Mitra: Magnus Exorcismus +4% ogni 2 raffinamenti (Item Changes)
  if (skillBase == SKILLID.MAGNUS_EXORCISMUS && n_A_Equip[2] == OLD_MITRA_UARO)
    bonus += 4 * Math.floor(n_A_HEAD_REFINE / 2);
  bonus += getMagicElementDamageBonus();
  if (n_A_Buf9[20] == skillBase && n_A_Buf9[20] != 0) bonus += n_A_Buf9[19];
  if (n_A_Buf9[22] == skillBase && n_A_Buf9[22] != 0) bonus += n_A_Buf9[21];
  if (
    (SKILLID.NAPALM_BEAT == n_A_ActiveSkill ||
      SKILLID.SOUL_STRIKE == n_A_ActiveSkill ||
      SKILLID.NAPALM_VULCAN == n_A_ActiveSkill) &&
    n_A_JobClass() == 5
  )
    bonus += 20 * CardNumSearch(474);
  if (
    (SKILLID.EARTH_SPIKE == n_A_ActiveSkill || SKILLID.HEAVENS_DRIVE == n_A_ActiveSkill) &&
    EquipNumSearch(EQUIPID.RJC_KATUSA_FLOWER)
  )
    bonus += 15 + n_A_HEAD_REFINE;
  if (SKILLID.STORM_GUST == n_A_ActiveSkill && EquipNumSearch(EQUIPID.LACRYMA_STICK))
    bonus += n_A_Weapon_refine;
  if (SKILLID.FIRE_BOLT_HINDSIGHT == n_A_ActiveSkill) bonus += 25 * CardNumSearch(493);
  if (SKILLID.COLD_BOLT_HINDSIGHT == n_A_ActiveSkill) bonus += 25 * CardNumSearch(488);
  if (
    (SKILLID.HOLY_LIGHT == n_A_ActiveSkill || SKILLID.HOLY_LIGHT_SOUL_LINKED == n_A_ActiveSkill) &&
    n_A_JobClass() == 3 &&
    EquipNumSearch(EQUIPID.NOAHS_HAT)
  ) {
    bonus += 5;
    if (n_A_HEAD_REFINE >= 7) bonus += 5;
  }
  danno = (danno * (100 + bonus)) / 100;
  if (n_A_Buf7[21] && MANUKU_MONSTER()) danno = (110 * danno) / 100;
  if (n_A_Buf7[24] && SUPURE_MONSTER()) danno = (110 * danno) / 100;
  if (
    SKILLID.STORM_GUST == n_A_ActiveSkill &&
    n_B_debuf[4] &&
    targetData[19] == 0 &&
    targetData[3] < 90
  )
    danno = 0;
  danno = Math.floor(danno);
  return danno;
}
function canApplyUaroMeltdownDebuff(mostro) {
  return SkillSearch(SKILLID.MELTDOWN) && !isMvpMonster(mostro);
}
// Ricalcola tutto: statistiche (StAllCalc), probabilita' di colpire e di schivare, ATK e critico
// dell'attacco normale, l'attacco scelto (BattleCalc999) e i danni riflessi. I passi si passano i
// risultati nelle globali (w_HIT, w998*, n_A_DMG, n_A_CriATK...): l'ordine conta
function calc() {
  for (var e = 0; e <= 2; e++) InnStr[e] = "";
  StAllCalc();
  penalitaTaglia();
  probabilitaColpire();
  preparaSkillNemico();
  probabilitaSchivare();
  atkAttaccoNormale();
  var dueArmi = criticoAttaccoNormale();
  n_Max_DMG = 0;
  n_Min_DMG = 9999999;
  if (
    (n_A_ActiveSkill == SKILLID.BASIC_ATTACK ||
      (n_A_ActiveSkill == SKILLID.POISON_REACT && mostroVeleno())) &&
    critChance > 0
  ) {
    n_Min_DMG = n_A_CriATK[0];
    n_Max_DMG = n_A_CriATK[2];
  }
  BattleCalc999();
  // con due armi il critico mostra anche la sinistra, calcolata da BattleCalc999 (wLeft); le
  // altre skill hanno gia' riscritto o tolto il critico
  if (
    dueArmi &&
    (n_A_ActiveSkill == SKILLID.BASIC_ATTACK ||
      (n_A_ActiveSkill == SKILLID.POISON_REACT && mostroVeleno()))
  )
    scrivi(
      "CRIATK",
      dueArmi.unValore
        ? n_A_CriATK[0] + " + " + wLeft[2]
        : n_A_CriATK[0] + "~" + n_A_CriATK[2] + " + " + wLeft[1] + "~" + wLeft[2],
    );
  if (n_A_ActiveSkill == SKILLID.COIN_FLING)
    scrivi("A_WeaponElement", "<b style='color:#A89682'>None</b> (100% vs any element)");
  else
    scrivi(
      "A_WeaponElement",
      v_Element[n_A_Weapon_element] +
        " (" +
        100 * element[targetData[3]][n_A_Weapon_element] +
        "% vs " +
        v_Element[Math.floor(targetData[3] / 10)] +
        (targetData[3] % 10) +
        ")",
    );
  riflessiAttacco();
  for (e = 0; e < InnStr.length; e++) scrivi("strID_" + e, InnStr[e]);
}
// moltiplicatore dell'arma per la taglia del mostro (wCSize), con le eccezioni, scritto nella pagina
function penalitaTaglia() {
  wCSize = m_WeaponSize[n_A_WeaponType][targetData[4]];
  // il valore del campo e' un testo: i confronti con == lo convertono
  var skill = c.A_ActiveSkill.value,
    nome = WeaponNameShort[n_A_WeaponType] + " vs " + v_Size[targetData[4]],
    mostra = false;
  if (
    skill == SKILLID.SMITE ||
    skill == SKILLID.SHIELD_BOOMERANG ||
    skill == SKILLID.SHIELD_BOOMERANG_SOUL_LINKED ||
    skill == SKILLID.RAPID_SMITING
  ) {
    nome = "Shield";
    wCSize = 1;
    mostra = true;
  }
  if (
    SkillSearch(SKILLID.CAVALIER_MASTERY) &&
    (n_A_WeaponType == 4 || n_A_WeaponType == 5) &&
    targetData[4] == 1
  ) {
    nome = skillName(SKILLID.CAVALIER_MASTERY);
    wCSize = 1;
    if (skill == 0) mostra = true;
  }
  if (SkillSearch(SKILLID.WEAPON_PERFECTION) || n_A_Buf2[7]) {
    nome = "Weapon Perfection";
    wCSize = 1;
    if (skill == 0) mostra = true;
  }
  if (CardNumSearch(32)) {
    nome = "Drake Card";
    wCSize = 1;
    mostra = true;
  }
  if (bonusValues[BONUSID.WEAPON_SIZE_PENALTY]) {
    nome = "Weapon Size Penalty Nullified";
    wCSize = 1;
    if (skill == 0) mostra = true;
  }
  if (skill == SKILLID.CLASHING_SPIRAL) {
    nome = skillName(SKILLID.CLASHING_SPIRAL) + " vs " + v_Size[targetData[4]];
    wCSize = 1.25 - 0.25 * targetData[4];
    mostra = true;
  }
  if (m_Skill[n_A_ActiveSkill][4] < 0) mostra = false;
  if (mostra || skill == 0) {
    scrivi("nm076", "Weapon/Skill Size Modifier");
    scrivi(
      "A_WeaponSize",
      100 * wCSize + '% <span style="font-weight:100;">(' + nome + ")</span>",
    );
  } else {
    scrivi("nm076", "");
    scrivi("A_WeaponSize", "");
  }
}
// probabilita' di colpire (w_HIT, mostrata in w_HIT_HYOUJI), di critico (w_Cri), di Raging
// Trifecta Blow e di Double Attack; poi la ripartizione degli attacchi normali in w998A-L e
// critChance (percentuali: triplo, doppio, critico, normale, mancato)
function probabilitaColpire() {
  w_HIT = n_A_HIT + 80 - n_B_FLEE;
  w_HIT_EDP = Math.max(5, Math.min(100, w_HIT));
  if (SkillSearch(SKILLID.WEAPONRY_RESEARCH))
    w_HIT = Math.floor((w_HIT * (100 + 2 * SkillSearch(SKILLID.WEAPONRY_RESEARCH))) / 100);
  if (n_A_ActiveSkill == SKILLID.PIERCE || n_A_ActiveSkill == SKILLID.BASH)
    w_HIT *= 1 + 0.05 * n_A_ActiveSkillLV;
  if (
    (n_A_ActiveSkill == SKILLID.SONIC_BLOW || n_A_ActiveSkill == SKILLID.SONIC_BLOW_SOUL_LINKED) &&
    SkillSearch(SKILLID.SONIC_ACCELERATION)
  )
    w_HIT *= 1.5;
  if (n_A_ActiveSkill == SKILLID.MAGNUM_BREAK) w_HIT *= 1 + 0.1 * n_A_ActiveSkillLV;
  if (n_A_ActiveSkill == SKILLID.FOCUSED_ARROW_STRIKE) w_HIT *= 1 + 0.1 * n_A_ActiveSkillLV;
  if (n_A_ActiveSkill == SKILLID.COUNTER_KICK) w_HIT = 100;
  if (n_A_ActiveSkill == SKILLID.RAPID_SMITING) w_HIT += 20;
  if (n_A_ActiveSkill == SKILLID.SHIELD_BOOMERANG_SOUL_LINKED) w_HIT = 100;
  if (SkillSearch(SKILLID.SLS_UNION)) w_HIT = 100;
  if (w_HIT > 100) w_HIT = 100;
  else if (w_HIT < 5) w_HIT = 5;
  if (bonusValues[86]) w_HIT += ((100 - w_HIT) * bonusValues[86]) / 100;
  w_HIT = Math.floor(100 * w_HIT) / 100;
  w_HIT_HYOUJI = w_HIT;

  if (n_A_ActiveSkill == SKILLID.FOCUSED_ARROW_STRIKE) n_A_CRI += 20;
  if (n_A_ActiveSkill == SKILLID.SHADOW_SLASH) n_A_CRI += 25 + 5 * n_A_ActiveSkillLV;
  w_Cri = n_A_CRI - 0.2 * targetData[11] + 0.1;
  if (n_B_debuf[8]) w_Cri *= 2;
  if (w_Cri < 0) w_Cri = 0;
  else if (w_Cri > 100) w_Cri = 100;

  TyouEnkakuSousa3dan = 0;
  wBC3_3danHatudouRitu = 0;
  if (SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW)) {
    wBC3_3danHatudouRitu = 30 - SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW);
    if (SkillSearch(SKILLID.SLS_TEAM_UP))
      wBC3_3danHatudouRitu *= 1.5 + 0.5 * SkillSearch(SKILLID.SLS_TEAM_UP);
  }
  var doppio = probabilitaDoppio();
  var hitDoppio = w_HIT;
  if (doppio != 0 && n_A_WeaponType != 17)
    hitDoppio = Math.min(100, (hitDoppio * (100 + SkillSearch(SKILLID.DOUBLE_ATTACK))) / 100);

  w998A = 100 - wBC3_3danHatudouRitu;
  w998B = (wBC3_3danHatudouRitu * w_HIT) / 100;
  w998D = (w998A * doppio) / 100;
  w998E = (w998D * hitDoppio) / 100;
  critChance = ((100 - wBC3_3danHatudouRitu - w998D) * w_Cri) / 100;
  var normali = 100 - wBC3_3danHatudouRitu - w998D - critChance;
  w998I = (normali * w_HIT) / 100;
  w998K = w998B + w998E + critChance + w998I;
  w998L = 100 - w998K;
  if (
    n_A_ActiveSkill == SKILLID.BASIC_ATTACK ||
    n_A_ActiveSkill == SKILLID.FOCUSED_ARROW_STRIKE ||
    n_A_ActiveSkill == SKILLID.SHADOW_SLASH ||
    (n_A_ActiveSkill == SKILLID.POISON_REACT && mostroVeleno())
  ) {
    w_HIT_HYOUJI = Math.floor(100 * w998K) / 100;
    scrivi("CRInum", " (" + Math.round(100 * critChance) / 100 + "%)");
  }
}
// probabilita' di Double Attack (o Chain Action con il revolver), anche da carte e oggetti
function probabilitaDoppio() {
  var da = SkillSearch(SKILLID.DOUBLE_ATTACK),
    doppio = n_A_WeaponType == 1 ? 5 * da : 0;
  // Sidewinder Card
  if (CardNumSearch(43)) doppio = da > 1 ? 5 * da : 5;
  if (n_A_WeaponType != 0) {
    if (
      EquipNumSearch(EQUIPID.BABY_CHICK) ||
      EquipNumSearch(EQUIPID.BABY_CHICK_ARO) ||
      EquipNumSearch(EQUIPID.BABY_CHICK_IRO)
    )
      doppio = da > 2 ? 5 * da : 10;
    if (EquipNumSearch(EQUIPID.WANDERERS_SAKKAT_PLUS_WANDERERS_COAT)) {
      doppio = 5 * da;
      if ((n_A_SHOULDER_REFINE == 5 || n_A_SHOULDER_REFINE == 6) && da < 1) doppio = 5;
      if (n_A_SHOULDER_REFINE >= 7 && da < 5) doppio = 25;
    }
    if (EquipNumSearch(EQUIPID.SNAKE_HEAD_HAT)) doppio = da > 5 ? 5 * da : 25;
  }
  if (EquipNumSearch(EQUIPID.NAGAN) || EquipNumSearch(EQUIPID.REFINED_NAGAN))
    doppio = da > 5 ? 5 * da : 25;
  if (n_A_WeaponType == 17) {
    var chain = SkillSearch(SKILLID.CHAIN_ACTION);
    doppio = 5 * chain;
    if (CardNumSearch(43)) doppio = 5 * chain + (5 * (100 - 5 * chain)) / 100;
    if (
      EquipNumSearch(EQUIPID.BABY_CHICK) ||
      EquipNumSearch(EQUIPID.BABY_CHICK_ARO) ||
      EquipNumSearch(EQUIPID.BABY_CHICK_IRO)
    )
      doppio = 5 * chain + (10 * (100 - 5 * chain)) / 100;
  }
  return doppio;
}
// probabilita' di schivare l'attacco del mostro (w_FLEE, e n_A_LUCKY per il Perfect Dodge), con la
// HIT e la distanza della skill del mostro (preparaSkillNemico), scritta nella pagina
function probabilitaSchivare() {
  w_FLEE = n_A_FLEE + 20 - n_B_HIT;
  if (w_FLEE > 95) w_FLEE = 95;
  else if (w_FLEE < 5) w_FLEE = 5;
  if (
    n_B_AtkSkill == SKILLID.EARTHQUAKE_MELEE ||
    n_B_AtkSkill == SKILLID.EARTHQUAKE_RANGED ||
    n_B_AtkSkill == SKILLID.GUIDED_ATTACK ||
    n_B_AtkSkill == SKILLID.DEMON_SHOCK_ATTACK ||
    n_B_AtkSkill == SKILLID.ENERGY_DRAIN
  ) {
    w_FLEE = 0;
    n_A_LUCKY = 0;
  }
  var flee = w_FLEE;
  if (n_A_Buf6[3] && n_B_rangedAtk != 0) w_FLEE = Math.max(75, w_FLEE);
  if (n_B_AtkSkill != 0) n_A_LUCKY = 0;
  var schivata;
  if (n_A_Buf6[3] && n_B_AtkSkill == SKILLID.CLASHING_SPIRAL) {
    w_FLEE = 75 + flee / 4;
    schivata = Math.floor(100 * w_FLEE);
  } else if (n_A_Buf6[3] && Math.abs(m_Skill[c.B_AtkSkill.value][4]) == 3) {
    w_FLEE = 75;
    schivata = 7500;
  } else if (m_Skill[c.B_AtkSkill.value][4] < 0) {
    w_FLEE = 0;
    schivata = 0;
  } else schivata = Math.floor(100 * (w_FLEE + ((100 - w_FLEE) * n_A_LUCKY) / 100));
  if (schivata > 10000) schivata = 10000;
  if (schivata <= 0) {
    schivata = 0;
    scrivi("nm066", "");
  } else {
    scrivi("nm066", "Average Dmg Received (w/dodge)");
  }
  scrivi("BattleFLEE", schivata / 100);
}
// ATK minimo, medio e massimo dell'attacco normale (n_A_DMG, BK_n_A_DMG prima dei moltiplicatori)
// e quello critico (n_A_CriATK, BK_n_A_CriATK); con arco e armi da fuoco conta la freccia
function atkAttaccoNormale() {
  n_A_workDEX = Math.floor(n_A_DEX * (1 + 0.2 * (n_A_WeaponLV - 1)));
  var atkArma =
    n_A_Weapon_ATK +
    (wImp +
      (!n_A_Buf3[10] || (n_A_WeaponLV != 4 && n_A_Weapon2LV != 4) ? 0 : 50 + 25 * n_A_Buf3[10]));
  var distanza = ARMI_A_DISTANZA.includes(n_A_WeaponType);
  var freccia = Math.floor((m_Arrow[n_A_Arrow][0] - 1) * wCSize);
  n_A_DMG = [0, 0, 0];
  if (n_A_workDEX >= atkArma || SkillSearch(SKILLID.POWER_MAXIMIZE))
    n_A_DMG[2] = n_A_ATK + n_A_WeaponLV_Maxplus + Math.floor(atkArma * wCSize);
  else n_A_DMG[2] = n_A_ATK + n_A_WeaponLV_Maxplus + Math.floor((atkArma - 1) * wCSize);
  if (distanza) {
    n_A_DMG[2] += freccia;
    var daAtk = n_A_ATK + n_A_WeaponLV_Maxplus + Math.floor(((atkArma * atkArma) / 100) * wCSize);
    var daDEX =
      n_A_ATK + n_A_WeaponLV_Maxplus + Math.floor(((atkArma * n_A_workDEX) / 100) * wCSize);
    daAtk += freccia;
    daDEX += freccia;
    if (daAtk > daDEX) daAtk = daDEX;
    if (n_A_DMG[2] < daAtk) n_A_DMG[2] = daAtk;
    n_A_DMG[0] = n_A_ATK + n_A_WeaponLV_Minplus + Math.floor(((atkArma * atkArma) / 100) * wCSize);
    var minDEX =
      n_A_ATK + n_A_WeaponLV_Minplus + Math.floor(((atkArma * n_A_workDEX) / 100) * wCSize);
    if (n_A_DMG[0] > minDEX) n_A_DMG[0] = minDEX;
  } else if (n_A_workDEX >= atkArma)
    n_A_DMG[0] = n_A_ATK + n_A_WeaponLV_Minplus + Math.floor(atkArma * wCSize);
  else {
    if (SkillSearch(SKILLID.POWER_MAXIMIZE)) n_A_workDEX = atkArma;
    n_A_DMG[0] = n_A_ATK + n_A_WeaponLV_Minplus + Math.floor(n_A_workDEX * wCSize);
  }
  n_A_DMG[1] = (n_A_DMG[0] + n_A_DMG[2]) / 2;
  n_rangedAtk = 0;
  n_A_CriATK = [0, 0, 0];
  n_A_CriATK[1] =
    n_A_ATK + (n_A_WeaponLV_Minplus + n_A_WeaponLV_Maxplus) / 2 + Math.floor(atkArma * wCSize);
  n_A_CriATK[0] = n_A_ATK + n_A_WeaponLV_Minplus + Math.floor(atkArma * wCSize);
  n_A_CriATK[2] = n_A_ATK + n_A_WeaponLV_Maxplus + Math.floor(atkArma * wCSize);
  if (distanza) n_rangedAtk = 1;
  if (n_A_WeaponType == 10)
    for (var e = 0; e <= 2; e++) n_A_CriATK[e] += Math.floor(m_Arrow[n_A_Arrow][0] * wCSize);
  BK_n_A_DMG = [n_A_DMG[0], n_A_DMG[1], n_A_DMG[2]];
  var percento = ATKmod01Percent();
  ATKmod01(percento);
  var piuFreccia = 0;
  if (n_A_WeaponType == 10)
    piuFreccia =
      Math.floor(m_Arrow[n_A_Arrow][0] * wCSize) - Math.floor((m_Arrow[n_A_Arrow][0] - 1) * wCSize);
  var base = BK_n_A_DMG[2] - n_A_WeaponLV_Maxplus + piuFreccia;
  BK_n_A_CriATK[0] = ((base + n_A_WeaponLV_Minplus) * percento) / 100;
  BK_n_A_CriATK[1] = ((base + (n_A_WeaponLV_Minplus + n_A_WeaponLV_Maxplus) / 2) * percento) / 100;
  BK_n_A_CriATK[2] = ((base + n_A_WeaponLV_Maxplus) * percento) / 100;
}
// danno critico dell'attacco normale, con il veleno, il katar e la mano sinistra, scritto nella
// pagina
function criticoAttaccoNormale() {
  ATKmod02(1, 1);
  n_PerHIT_DMG = BattleCalc2(0);
  wCriTyuu = 1;
  n_A_CriATK[1] = BattleCalc(n_A_CriATK[1], 10);
  n_A_CriATK[0] = BattleCalc(n_A_CriATK[0], 10);
  n_A_CriATK[2] = BattleCalc(n_A_CriATK[2], 10);
  wCriTyuu = 0;
  n_A_EDP_DMG = [0, 0, 0];
  for (var e = 0; e <= 2; e++) n_A_EDP_DMG[e] = BattleCalcEDP(n_A_DMG[e], e);
  for (e = 0; e <= 2; e++) n_A_CriATK[e] += EDP_DMG(e);
  if (n_A_WeaponType == 11) {
    var katar = [0, 0, 0];
    for (e = 0; e <= 2; e++) {
      katar[e] = Math.floor(n_A_CriATK[e] * (0.01 + 0.02 * SkillSearch(SKILLID.DOUBLE_ATTACK)));
      n_A_CriATK[e] += katar[e];
    }
    if (n_A_CriATK[0] == n_A_CriATK[2])
      scrivi("CRIATK", n_A_CriATK[0] - katar[0] + " + " + katar[0]);
    else
      scrivi(
        "CRIATK",
        n_A_CriATK[0] -
          katar[0] +
          "~" +
          (n_A_CriATK[2] - katar[2]) +
          " + " +
          katar[0] +
          "~" +
          katar[2],
      );
  } else if (n_Nitou) {
    // il critico della sinistra serve solo a decidere se mostrare un valore o un intervallo; il
    // valore lo scrive calc dopo BattleCalc999, che calcola la sinistra (wLeft)
    var sinistra = [
      n_A_ATK + n_A_Weapon2LV_Minplus + Math.floor((n_A_Weapon2_ATK + wImp) * wCSize),
      n_A_ATK +
        (n_A_Weapon2LV_Minplus + n_A_Weapon2LV_Maxplus) / 2 +
        Math.floor((n_A_Weapon2_ATK + wImp) * wCSize),
      n_A_ATK + n_A_Weapon2LV_Maxplus + Math.floor((n_A_Weapon2_ATK + wImp) * wCSize),
    ];
    sinistra[1] = BattleCalc(sinistra[1], 10);
    sinistra[0] = BattleCalc(sinistra[0], 10);
    sinistra[2] = BattleCalc(sinistra[2], 10);
    return { unValore: n_A_CriATK[0] == n_A_CriATK[2] && sinistra[0] == sinistra[2] };
  } else if (n_A_CriATK[0] == n_A_CriATK[2]) scrivi("CRIATK", n_A_CriATK[1]);
  else scrivi("CRIATK", n_A_CriATK[0] + "~" + n_A_CriATK[2]);
  return null;
}
// danno che il mostro riflette al personaggio negli attacchi in mischia: Shield Reflect del
// mostro (n_B_buf[12]) ed equipaggiamento (n_B_manual[21]), x 1,5 con n_B_buf[1]
function riflessiAttacco() {
  if (n_rangedAtk != 0) {
    scrivi("bREFLECT2", "");
    scrivi("bREFLECT2name", "");
    return;
  }
  var scudo = n_B_buf[12],
    equip = n_B_manual[21],
    molt = n_B_buf[1] == 1 ? 1.5 : 1,
    e;
  if (scudo > 0 && n_A_ActiveSkill != SKILLID.HIGH_SPEED_CART_RAM) {
    scudo = 10 + 3 * scudo;
    var riflesso = [];
    for (e = 0; e <= 2; e++) {
      riflesso[e] = Math.floor((Last_DMG_A[e] * molt * scudo) / 100);
      if (Math.ceil((Last_DMG_A[e] * molt * scudo) / 100) == 1) riflesso[e] = 1;
    }
    scrivi(
      "bREFLECT1",
      '<B style="color:red">' + riflesso[0] + " ~ " + riflesso[2] + "</B>",
    );
    scrivi(
      "bREFLECT1name",
      '<SPAN style="color:red">Damage reflected (Shield Reflect)</SPAN>',
    );
  } else {
    scrivi("bREFLECT1", "");
    scrivi("bREFLECT1name", "");
  }
  if (equip) {
    var woe = 1;
    if (n_WoE == 1) woe = n_A_ActiveSkill != SKILLID.BASIC_ATTACK ? 100 / 60 : 1.25;
    var riflessoEquip = [];
    for (e = 0; e <= 2; e++) {
      riflessoEquip[e] = Math.floor((Last_DMG_B[e] * molt * woe * equip) / 100);
      if (Math.ceil((Last_DMG_B[e] * molt * woe * equip) / 100) == 1) riflessoEquip[e] = 1;
    }
    scrivi(
      "bREFLECT2",
      '<B style="color:red">' + riflessoEquip[0] + " ~ " + riflessoEquip[2] + "</B>",
    );
    scrivi("bREFLECT2name", '<SPAN style="color:red">Damage reflected (equip/card)</SPAN>');
  } else {
    scrivi("bREFLECT2", "");
    scrivi("bREFLECT2name", "");
  }
}
// danno fisico da un ATK: quale = 0, 1, 2 per minimo, medio, massimo (la DEF da VIT usata), 10 per
// il critico, che ignora la DEF. Poi maestrie e BattleCalc2
function BattleCalc(danno, quale) {
  danno = applyPreRenewalEnchantDeadlyPoison(danno);
  if (quale == 10) danno += n_A_WeaponLV_refineATK;
  else danno = BattleCalc4(danno, quale, 0);
  if (danno < 1) danno = 1;
  danno += n_A_Buf9[25];
  if (n_A_WeaponType == 1 || n_A_WeaponType == 2) danno += 4 * SkillSearch(SKILLID.SWORD_MASTERY);
  else if (n_A_WeaponType == 3) danno += 4 * SkillSearch(SKILLID.TWO_HAND_SWORD_MASTERY);
  else if (n_A_WeaponType == 4 || n_A_WeaponType == 5) {
    if (SkillSearch(SKILLID.CAVALIER_MASTERY) == 0) danno += 4 * SkillSearch(SKILLID.SPEAR_MASTERY);
    else danno += 5 * SkillSearch(SKILLID.SPEAR_MASTERY);
  } else if (n_A_WeaponType == 8) danno += 3 * SkillSearch(SKILLID.MACE_MASTERY);
  else if (n_A_WeaponType == 11) danno += 3 * SkillSearch(SKILLID.KATAR_MASTERY);
  else if (n_A_WeaponType == 14) danno += 3 * SkillSearch(SKILLID.MUSIC_LESSONS);
  else if (n_A_WeaponType == 15) danno += 3 * SkillSearch(SKILLID.DANCE_LESSONS);
  else if (n_A_WeaponType == 12) danno += 3 * SkillSearch(SKILLID.STUDY);
  else if (n_A_WeaponType == 6 || n_A_WeaponType == 7)
    danno += 3 * SkillSearch(SKILLID.AXE_MASTERY);
  else if (n_A_WeaponType == 13 || n_A_WeaponType == 0) danno += 3 * SkillSearch(SKILLID.IRON_FIST);
  if (n_A_WeaponType == 0 && SkillSearch(SKILLID.SPRINT_UNARMED_MASTERY))
    danno += 10 * SkillSearch(SKILLID.SPRINT_UNARMED_MASTERY);
  if (
    (targetData[2] == 6 || (90 <= targetData[3] && targetData[3] <= 99)) &&
    SkillSearch(SKILLID.DEMON_BANE)
  )
    danno += Math.floor((3 + 0.05 * n_A_BaseLV) * SkillSearch(SKILLID.DEMON_BANE));
  if (targetData[2] == 2 || targetData[2] == 4) {
    danno += 4 * SkillSearch(SKILLID.BEAST_BANE);
    if (SkillSearch(SKILLID.HUNTER_SPIRIT)) danno += n_A_STR;
  }
  danno = BattleCalc2(danno);
  return Math.floor(danno);
}
// danno in piu' che non dipende dall'ATK (Weaponry Research, sfere, Star Crumb, shuriken...),
// elemento e ApplyModifiers. Con 0 e' il danno quando si manca (n_PerHIT_DMG)
function BattleCalc2(danno) {
  w999_AB = 0;
  if (danno > 0) w999_AB = 1;
  danno += 2 * SkillSearch(SKILLID.WEAPONRY_RESEARCH);
  if (wBCEDPch == 0)
    danno = Math.floor(danno * Math.max(0, element[targetData[3]][n_A_Weapon_element]));
  if (
    n_A_WeaponType == 0 &&
    SkillSearch(SKILLID.SPRINT_UNARMED_MASTERY) &&
    (n_A_ActiveSkill == SKILLID.TORNADO_KICK ||
      n_A_ActiveSkill == SKILLID.HEEL_DROP ||
      n_A_ActiveSkill == SKILLID.ROUNDHOUSE ||
      n_A_ActiveSkill == SKILLID.COUNTER_KICK)
  )
    danno += 10 * SkillSearch(SKILLID.SPRINT_UNARMED_MASTERY);
  danno += 3 * n_A_Buf2[12];
  danno += 3 * SkillSearch(SKILLID.COIN_FLIP);
  if (n_A_WeaponType != 0 && w999_AB == 1) danno += 20 * SkillSearch(SKILLID.AURA_BLADE);
  if (wBCEDPch == 0) {
    if (n_A_ActiveSkill == SKILLID.ENVENOM || n_A_ActiveSkill == SKILLID.PHANTASMIC_ARROW)
      danno += 15 * n_A_ActiveSkillLV;
    if (SKILLID.POISON_REACT == n_A_ActiveSkill && (targetData[3] < 50 || 60 <= targetData[3]))
      danno += 75;
  }
  if (n_A_ActiveSkill == SKILLID.MAGICAL_BULLET)
    danno += Math.floor(n_A_MATK[w_MagiclBulet] * mdefReduction(targetData[15]) - n_B_MDEF2);
  if (n_A_ActiveSkill == SKILLID.GUNSLINGER_MINE) danno += 50 * n_A_ActiveSkillLV;
  if (
    m_Card[n_A_card[0]][0] == 106 &&
    m_Card[n_A_card[1]][0] == 106 &&
    m_Card[n_A_card[2]][0] == 106
  )
    danno += 40;
  else for (i = 0; i <= 2; i++) if (m_Card[n_A_card[i]][0] == 106) danno += 5;
  if (n_A_card[3] == 106) danno += 10;
  if (n_A_ActiveSkill == SKILLID.THROW_SHURIKEN) {
    danno += m_Syuriken[1 * documento.calcForm.SkillSubNum.value][0];
    danno += 3 * SkillSearch(SKILLID.DAGGER_THROWING_PRACTICE);
    danno += 4 * n_A_ActiveSkillLV;
  }
  if (n_A_ActiveSkill == SKILLID.THROW_KUNAI)
    danno += 3 * m_Kunai[1 * documento.calcForm.SkillSubNum.value][0];
  danno = ApplyModifiers(danno);
  if (n_A_ActiveSkill == SKILLID.BACK_STAB && n_A_WeaponType == 10) danno = Math.floor(danno / 2);
  if (n_Nitou && SKILLID.BASIC_ATTACK == n_A_ActiveSkill && n_A_WeaponType != 0)
    danno = Math.floor((danno * (50 + 10 * SkillSearch(SKILLID.RIGHT_HAND_MASTERY))) / 100);
  if (n_A_ActiveSkill == SKILLID.MAGICAL_BULLET) danno *= Math.max(0, element[targetData[3]][8]);
  if (n_A_ActiveSkill == SKILLID.GUNSLINGER_MINE) danno *= element[targetData[3]][0];
  return danno;
}
// bonus percentuali al danno: contro il mostro (bonusContro), poi tPlusDamCut (riduzioni del
// mostro) e i bonus per skill (bonusSkill). Quelli contro il mostro non contano con not_use_card e
// per il veleno di Enchant Deadly Poison (wBCEDPch)
function ApplyModifiers(danno) {
  if (wBCEDPch == 0 && not_use_card == 0) danno = bonusContro(danno);
  danno = Math.floor(tPlusDamCut(danno));
  var skillBase = baseSkillId(n_A_ActiveSkill);
  var bonus = bonusSkill(skillBase);
  danno =
    (danno * (100 + StPlusCalc2(5000 + skillBase) + StPlusCard(5000 + skillBase) + bonus)) / 100;
  if (n_A_Buf7[20] && MANUKU_MONSTER()) danno = (110 * danno) / 100;
  if (n_A_Buf7[23] && SUPURE_MONSTER()) danno = (110 * danno) / 100;
  return danno;
}
// bonus contro il mostro: razza, elemento, taglia, distanza, boss, mostri precisi, critico, Frenzy,
// katar, Stellar/Solar/Lunar Wrath
function bonusContro(danno) {
  var bonus = bonusValues[30 + targetData[2]];
  danno = Math.floor((danno * (100 + bonus)) / 100);
  bonus = bonusValues[40 + Math.floor(targetData[3] / 10)] + getTargetElementDamageBonus();
  danno = Math.floor((danno * (100 + bonus)) / 100);
  bonus = bonusValues[27 + targetData[4]];
  danno = Math.floor((danno * (100 + bonus)) / 100);
  if (n_rangedAtk == 1 && TyouEnkakuSousa3dan != -1) {
    bonus = bonusValues[25];
    danno = Math.floor((danno * (100 + bonus)) / 100);
  }
  bonus = 0;
  if (targetData[19] == 1) bonus += bonusValues[BONUSID.PHYSICAL_BOSS_DMG_PERCENT];
  else bonus += bonusValues[BONUSID.NON_BOSS_DMG_PERCENT];
  bonus += bonusValues[80];
  if (/^((Gold )?.*Scaraba|Queen Scaraba)$/i.test(targetData[1])) bonus += 30 * CardNumSearch(571);
  danno = Math.floor((danno * (100 + bonus)) / 100);
  if (EquipNumSearch(EQUIPID.CANNON_SPEAR))
    danno = Math.floor((danno * (100 + 4 * n_A_Weapon_refine)) / 100);
  if (wCriTyuu == 1 && SKILLID.SHADOW_SLASH != n_A_ActiveSkill)
    danno = Math.floor((danno * (100 + bonusValues[70])) / 100);
  if ((108 <= targetData[0] && targetData[0] <= 115) || targetData[0] == 319)
    danno = Math.floor((danno * (100 + bonusValues[81])) / 100);
  if (116 <= targetData[0] && targetData[0] <= 120)
    danno = Math.floor((danno * (100 + bonusValues[82])) / 100);
  if ((49 <= targetData[0] && targetData[0] <= 52) || targetData[0] == 55 || targetData[0] == 221)
    danno = Math.floor((danno * (100 + bonusValues[83])) / 100);
  if (
    targetData[0] == 106 ||
    targetData[0] == 152 ||
    targetData[0] == 308 ||
    targetData[0] == 32 ||
    targetData[0] == 541
  )
    danno = Math.floor((danno * (100 + bonusValues[84])) / 100);
  danno = Math.floor(
    (danno * (100 + StPlusCalc2(1000 + targetData[0]) + StPlusCard(1000 + targetData[0]))) / 100,
  );
  if (SkillSearch(SKILLID.FRENZY)) danno *= 2;
  if (n_A_ActiveSkill == SKILLID.POISON_REACT && 50 <= targetData[3] && targetData[3] < 60)
    danno = Math.floor((danno * (100 + 30 * n_A_ActiveSkillLV)) / 100);
  var katar = SkillSearch(SKILLID.ADVANCED_KATAR_MASTERY);
  if (n_A_WeaponType == 11 && katar) danno = Math.floor((danno * (110 + 2 * katar)) / 100);
  bonus = 0;
  var stellar = SkillSearch(SKILLID.STELLAR_WRATH),
    solar = SkillSearch(SKILLID.SOLAR_WRATH),
    lunar = SkillSearch(SKILLID.LUNAR_WRATH);
  var stellarAttiva =
    (stellar && SkillSearch(SKILLID.SLS_MIRACLE)) ||
    (stellar && targetData[4] == 2 && targetData[6] >= 17392);
  if (stellarAttiva) bonus += (n_A_BaseLV + n_A_STR + n_A_LUK + n_A_DEX) / (12 - 3 * stellar);
  else if (solar && targetData[4] == 0)
    bonus += (n_A_BaseLV + n_A_LUK + n_A_DEX) / (12 - 3 * solar);
  else if (lunar && targetData[4] == 1 && targetData[6] >= 5218)
    bonus += (n_A_BaseLV + n_A_LUK + n_A_DEX) / (12 - 3 * lunar);
  danno = Math.floor((danno * (100 + bonus)) / 100);
  return danno;
}
// bonus in percentuale per la skill scelta: dai buff delle skill (n_A_Buf9) e da oggetti e carte
function bonusSkill(skillBase) {
  var bonus = 0;
  if (n_A_Buf9[20] == skillBase && n_A_Buf9[20] != 0) bonus += n_A_Buf9[19];
  if (n_A_Buf9[22] == skillBase && n_A_Buf9[22] != 0) bonus += n_A_Buf9[21];
  if (n_A_ActiveSkill == SKILLID.BASH && n_A_SHOES_REFINE >= 9 && CardNumSearch(362)) bonus += 10;
  if (n_A_ActiveSkill == SKILLID.BOWLING_BASH && (n_A_WeaponType == 2 || n_A_WeaponType == 3))
    bonus += 25 * CardNumSearch(464);
  if (n_A_ActiveSkill == SKILLID.ARROW_SHOWER && n_A_WeaponType == 10)
    bonus += 50 * CardNumSearch(465);
  if (
    n_A_ActiveSkill == SKILLID.DOUBLE_STRAFE &&
    n_A_Weapon_refine >= 9 &&
    EquipNumSearch(EQUIPID.GLORIOUS_HUNTER_BOW)
  )
    bonus += 20;
  if (
    n_A_ActiveSkill == SKILLID.TRIGGER_HAPPY_SHOT &&
    n_A_Weapon_refine >= 9 &&
    EquipNumSearch(EQUIPID.GLORIOUS_PISTOL)
  )
    bonus += 2 * n_A_Weapon_refine;
  if (
    n_A_ActiveSkill == SKILLID.TRACKING &&
    n_A_Weapon_refine >= 9 &&
    EquipNumSearch(EQUIPID.GLORIOUS_RIFLE)
  )
    bonus += 3 * n_A_Weapon_refine;
  if (
    n_A_ActiveSkill == SKILLID.SPREAD_SHOT &&
    n_A_Weapon_refine >= 9 &&
    EquipNumSearch(EQUIPID.GLORIOUS_SHOTGUN)
  )
    bonus += 2 * n_A_Weapon_refine;
  if (
    n_A_ActiveSkill == SKILLID.GUNSLINGER_MINE &&
    n_A_Weapon_refine >= 9 &&
    EquipNumSearch(EQUIPID.GLORIOUS_GRENADE_LAUNCHER)
  )
    bonus += 2 * n_A_Weapon_refine;
  if (
    (n_A_ActiveSkill == SKILLID.BASH || n_A_ActiveSkill == SKILLID.BOWLING_BASH) &&
    n_A_ActiveSkillLV == 10 &&
    EquipNumSearch(EQUIPID.VETERAN_SWORD)
  )
    bonus += 50;
  if (
    n_A_ActiveSkill == SKILLID.MAMMONITE &&
    SU_LUK >= 90 &&
    SU_DEX >= 90 &&
    EquipNumSearch(EQUIPID.BERCHEL_AXE)
  )
    bonus += 15;
  if (
    n_A_ActiveSkill == SKILLID.METEOR_ASSAULT &&
    EquipNumSearch(EQUIPID.CHAKRAM) &&
    SkillSearch(SKILLID.KATAR_MASTERY) == 10
  )
    bonus += 20;
  if (n_A_ActiveSkill == SKILLID.METEOR_ASSAULT && EquipNumSearch(EQUIPID.GHOST_WHISPER))
    bonus += n_A_HEAD_REFINE >= 9 ? 20 : n_A_HEAD_REFINE >= 7 ? 10 : 0;
  if (
    n_A_ActiveSkill == SKILLID.THROW_HUUMA_SHURIKEN &&
    n_A_Equip[0] == EQUIPID.ILLUSION_WING_SHURIKEN &&
    n_A_Weapon_refine >= 7
  )
    bonus += 40;
  if (
    (n_A_ActiveSkill == SKILLID.THROW_SPIRIT_SPHERES ||
      n_A_ActiveSkill == SKILLID.OCCULT_IMPACTION) &&
    n_A_Equip[0] == EQUIPID.SURAS_RAMPAGE
  ) {
    if (n_A_Weapon_refine >= 7) bonus += 5;
    if (n_A_Weapon_refine >= 10) bonus += 10;
  }
  if (n_A_ActiveSkill == SKILLID.BACK_STAB && n_A_Equip[0] == EQUIPID.BLACK_WING)
    bonus += 5 * Math.max(0, n_A_Weapon_refine - 5);
  if (
    n_A_ActiveSkill == SKILLID.ARROW_VULCAN &&
    (n_A_Equip[0] == EQUIPID.GREEN_WHISTLE || n_A_Equip[0] == EQUIPID.STEM_WHIP)
  ) {
    if (n_A_Weapon_refine >= 7) bonus += 10;
    if (n_A_Weapon_refine >= 10) bonus += 20;
  }
  if (n_A_ActiveSkill == SKILLID.RAPID_SMITING && EquipNumSearch(EQUIPID.IMPERIAL_GUARD))
    bonus += n_A_LEFT_REFINE;
  if (
    (n_A_ActiveSkill == SKILLID.SMITE ||
      n_A_ActiveSkill == SKILLID.SHIELD_BOOMERANG ||
      n_A_ActiveSkill == SKILLID.SHIELD_BOOMERANG_SOUL_LINKED) &&
    EquipNumSearch(EQUIPID.IMPERIAL_SPEAR)
  )
    bonus += n_A_Weapon_refine;
  if (TyouEnkakuSousa3dan == -1 && EquipNumSearch(EQUIPID.COMBO_BATTLE_GLOVE)) bonus += 15;
  if (
    (n_A_ActiveSkill == SKILLID.SONIC_BLOW || n_A_ActiveSkill == SKILLID.SONIC_BLOW_SOUL_LINKED) &&
    SkillSearch(SKILLID.SONIC_ACCELERATION) &&
    wBCEDPch == 0
  )
    bonus += 10;
  if (
    (n_A_ActiveSkill == SKILLID.HOLY_CROSS || n_A_ActiveSkill == SKILLID.HOLY_CROSS_UARO) &&
    EquipNumSearch(EQUIPID.CANNON_SPEAR)
  )
    bonus += 3 * n_A_Weapon_refine;
  return bonus;
}
// danno medio dell'attacco normale da quello di un colpo: media pesata di Raging Trifecta Blow,
// Double Attack, critico, colpo normale e mancato (le probabilita' w998* di calc)
function BattleCalc3(colpo) {
  var triplo = w998B * TyouEnkakuSousa3dan,
    doppio = w998E * colpo * 2,
    critico = critChance * n_A_CriATK[1],
    normale = w998I * colpo,
    mancato = w998L * BattleCalc2(0);
  return (triplo + doppio + critico + normale + mancato) / 100;
}
// lo stesso per la mano sinistra: colpo o, se manca, le Star Crumb dell'arma sinistra
function BattleCalc3left(colpo) {
  var stelle = 0;
  for (i = 4; i <= 7; i++) if (m_Card[n_A_card[i]][0] == 106) stelle += 5;
  var medio = (colpo * w_HIT) / 100 + (stelle * (100 - w_HIT)) / 100;
  return tPlusDamCut(medio);
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
function applyPreRenewalEnchantDeadlyPoison(atk) {
  var lv = SkillSearch(SKILLID.ENCHANT_DEADLY_POISON);
  return lv && !wBCEDPch && canApplyEnchantDeadlyPoison()
    ? Math.floor((atk * (150 + 50 * lv)) / 100)
    : atk;
}
// ATK meno DEF del mostro (DEF dura in percentuale, DEF da VIT minima, media o massima secondo
// quale), piu' l'ATK del raffinamento della destra (mano = 0) o della sinistra
function BattleCalc4(atk, quale, mano) {
  if (SKILLID.MAGIC_CRASHER_UARO == n_A_ActiveSkill) {
    var defDura = Math.floor(targetData[14] * 0.25);
    var defVITMax = Math.max(1, Math.floor(n_B_DEF2[2] * 0.25)),
      piuVIT = Math.max(0, Math.floor(defVITMax / 20) ** 2 - 1);
    var defVIT = defVITMax + (quale == 0 ? piuVIT : quale == 1 ? Math.floor(piuVIT / 2) : 0);
    var raffinamentoMC = mano == 0 ? n_A_WeaponLV_refineATK : n_A_Weapon2LV_refineATK;
    return Math.floor(atk * defReduction(defDura)) - defVIT + raffinamentoMC;
  }
  var raffinamento = mano == 0 ? n_A_WeaponLV_refineATK : n_A_Weapon2LV_refineATK;
  if (SKILLID.STAVE_CRASHER == n_A_ActiveSkill)
    return Math.floor(atk * defReduction(targetData[14])) - n_B_DEF2[quale] + raffinamento;
  // ignorano la DEF: Wounding Shot, bonus che la ignorano (per razza, per i mostri normali), Union
  if (
    SKILLID.WOUNDING_SHOT == n_A_ActiveSkill ||
    bonusValues[180 + targetData[2]] >= 1 ||
    (bonusValues[22] >= 1 && targetData[19] == 0) ||
    bonusValues[22] >= 10 ||
    SkillSearch(SKILLID.SLS_UNION)
  )
    return atk + raffinamento;
  // bonusValues[23]: piu' danno quanto piu' DEF ha il mostro
  if (bonusValues[23] == 0) atk = Math.floor(atk * defReduction(targetData[14])) - n_B_DEF2[quale];
  else atk = Math.floor((atk * (n_B_DEF2[2 - quale] + targetData[14])) / 100);
  atk += raffinamento;
  return atk < 1 ? 1 : atk;
}
function BattleCalcEDP(atk, quale) {
  if (
    atk <= 0 ||
    SKILLID.SAND_ATTACK == n_A_ActiveSkill ||
    SKILLID.SOUL_DESTROYER == n_A_ActiveSkill ||
    SKILLID.VENOM_SPLASHER == n_A_ActiveSkill ||
    SKILLID.METEOR_ASSAULT == n_A_ActiveSkill ||
    SKILLID.BOMB == n_A_ActiveSkill
  )
    return 0;
  wBCEDPch = 1;
  var edp = 0,
    pozione = 0;
  if (SkillSearch(SKILLID.ENCHANT_DEADLY_POISON)) {
    edp = BattleCalc(atk, quale);
    edp = Math.floor((edp * Math.max(0, element[targetData[3]][5])) / 4);
  }
  if (n_A_Buf6[7]) {
    pozione = BattleCalc(atk, quale);
    pozione = Math.floor((pozione * Math.max(0, element[targetData[3]][3])) / 5);
  }
  wBCEDPch = 0;
  return edp + pozione;
}
function EDPplus(e) {
  if (SkillSearch(SKILLID.ENCHANT_DEADLY_POISON) || n_A_Buf6[7]) {
    w_DMG[2] += EDP_DMG(2) * e;
    w_DMG[1] += EDP_DMG(1) * e;
    if (w_HIT_EDP == 100) w_DMG[0] += EDP_DMG(0) * e;
  }
}
function EDP_DMG(quale) {
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
    if (quale == 0) return w_HIT_EDP == 100 ? n_A_EDP_DMG[0] : 0;
    if (quale == 1) {
      var pieno = 0;
      if (w_HIT_HYOUJI == 100) pieno = 1;
      if (n_PerHIT_DMG) pieno = 1;
      return Math.floor(
        pieno
          ? (n_A_EDP_DMG[1] * w_HIT_EDP) / 100
          : (((n_A_EDP_DMG[1] * w_HIT) / 100) * w_HIT_EDP) / 100,
      );
    }
    if (quale == 2) return n_A_EDP_DMG[2];
  }
  return 0;
}
// ritardo dell'attacco normale dall'ASPD (calcolato da StAllCalc)
function AspdMotionDelayForSkill() {
  return n_Delay[1];
}
// tempo di lancio e ritardo dopo la skill (wDelay): il piu' lungo fra quelli in n_Delay, scritto
// nei risultati secondari con la sua origine
function CastAndDelay() {
  if (wCast != 0) {
    str_bSUBname += SubName[9] + "<BR>";
    str_bSUB += Math.floor(100 * wCast) / 100 + SubName[1] + "<BR>";
  }
  var nomi = "",
    valori = "";
  wDelay = 0;
  var origine = 0,
    ritardoASPD = AspdMotionDelayForSkill();
  if (ritardoASPD > wDelay) {
    wDelay = ritardoASPD;
    origine = 1;
  }
  n_Delay[2] = Math.floor(n_Delay[2] * (100 - AC_I - ((100 - AC_I) * bonusValues[74]) / 100)) / 100;
  if (n_Delay[2] > wDelay) {
    wDelay = n_Delay[2];
    origine = 2;
  }
  if (n_Delay[3] > wDelay) {
    wDelay = n_Delay[3];
    origine = 3;
  }
  if (
    SKILLID.BASIC_ATTACK != n_A_ActiveSkill &&
    SKILLID.MARTYRS_RECKONING != n_A_ActiveSkill &&
    SKILLID.FIRE_BOLT_HINDSIGHT != n_A_ActiveSkill &&
    SKILLID.COLD_BOLT_HINDSIGHT != n_A_ActiveSkill &&
    SKILLID.LIGHTNING_BOLT_HINDSIGHT != n_A_ActiveSkill
  )
    n_Delay[4] = (1 * documento.calcForm.Conf01.value) / 100;
  if (n_Delay[4] > wDelay + wCast) {
    wDelay = n_Delay[4] - wCast;
    origine = 4;
  }
  if (n_Delay[5] != 0) {
    wDelay = n_Delay[5];
    origine = 5;
  }
  if (n_Delay[6] > wDelay + wCast) {
    wDelay = n_Delay[6] - wCast;
    origine = 6;
  }
  if (origine == 1) {
    if (SKILLID.BASIC_ATTACK == n_A_ActiveSkill) {
      if (SkillSearch(SKILLID.RAGING_TRIFECTA_BLOW)) {
        nomi += "Attack interval (normal)<BR>Attack interval (" + skillName(187) + ")<BR>";
        valori += n_Delay[1] + " seconds<BR>" + sandanDelay + " seconds<BR>";
        wDelay = (n_Delay[1] * w998A) / 100 + (sandanDelay * wBC3_3danHatudouRitu) / 100;
      } else {
        nomi += "Time/Hit<BR>";
        valori += ritardoASPD + " seconds<BR>";
      }
    } else {
      nomi += "Motion Delay (ASPD based)<BR>";
      valori += ritardoASPD + " seconds<BR>";
    }
  }
  if (origine == 2) {
    nomi += "Delay (fixed skills)<BR>";
    valori += n_Delay[2] + " seconds<BR>";
  }
  if (origine == 3) {
    if (
      SKILLID.RAGING_QUADRUPLE_BLOW == n_A_ActiveSkill ||
      SKILLID.RAGING_THRUST == n_A_ActiveSkill ||
      SKILLID.GLACIER_FIST == n_A_ActiveSkill
    ) {
      nomi += "Delay (+delay reception combo)<BR>";
      valori +=
        Math.round(1000 * n_Delay[3]) / 1000 +
        "~" +
        Math.round(1000 * n_Delay[3] + 300) / 1000 +
        " seconds<BR>";
    } else {
      nomi += "Delay (forced motion)<BR>";
      valori += Math.round(1000 * n_Delay[3]) / 1000 + " seconds<BR>";
    }
  }
  if (origine == 4) {
    nomi +=
      "Delay (<span class=name>input limit<span class=nametext>This limit varies with ''Minimum delay between active skills'' in ''COMBAT SIMULATOR''.</span></span>)<BR>";
    valori += n_Delay[4] + " seconds<BR>";
  }
  if (origine == 5) {
    nomi += "Damage interval<BR>";
    valori += n_Delay[5] + " seconds<BR>";
  }
  if (origine == 6) {
    nomi += "Limited Skill-Duration(?)<BR>";
    valori += Math.floor(100 * wDelay) / 100 + " seconds<BR>";
  }
  scrivi("bSUB2name", nomi);
  scrivi("bSUB2", valori);
}
// riduzioni del danno dalla parte del mostro: WoE, resistenze scritte a mano (n_B_manual), buff
// del mostro (n_B_buf), Lex Aeterna, terreno elementale; 1 sui Plant
function tPlusDamCut(danno) {
  var w;
  if (n_WoE) {
    danno =
      n_A_WeaponType == 10 ||
      n_A_WeaponType == 17 ||
      n_A_WeaponType == 18 ||
      n_A_WeaponType == 19 ||
      n_A_WeaponType == 20 ||
      n_A_WeaponType == 21 ||
      SKILLID.BASIC_ATTACK != n_A_ActiveSkill
        ? Math.floor(0.6 * danno)
        : Math.floor(0.8 * danno);
    if (c.A8_Skill15.value > 0) danno = Math.floor(danno * (10 / (5 * c.A8_Skill15.value)));
  }
  danno = Math.floor((danno * (100 - n_B_manual[1])) / 100);
  danno = Math.floor((danno * (100 - n_B_manual[7])) / 100);
  if (n_rangedAtk || n_A_WeaponType == 10) {
    w = n_B_manual[9];
    danno = Math.floor((danno * (100 - w)) / 100);
  }
  if (1 * c.A_adopted.checked == 0) {
    w = n_B_buf[14];
    danno = Math.floor((danno * (100 - w)) / 100);
  }
  w = n_B_manual[2];
  if (n_A_Weapon_element == w) {
    w = n_B_manual[3];
    danno = Math.floor((danno * (100 - w)) / 100);
  }
  w = n_B_manual[4];
  if (n_A_Weapon_element == w) {
    w = n_B_manual[5];
    danno = Math.floor((danno * (100 - w)) / 100);
  }
  w = n_B_buf[13];
  if (w != 0 && (n_rangedAtk == 1 || n_A_WeaponType == 10)) {
    w = 95 - 15 * n_B_buf[13];
    danno = Math.floor((danno * w) / 100);
  }
  w = n_B_buf[14];
  if (w > 0 && n_rangedAtk != 2) danno -= Math.floor((danno * w * 6) / 100);
  if (wBTw1 == 0) {
    if (n_B_debuf[6] && wLAch == 0) danno *= 2;
    if (n_B_debuf[17] && n_A_Weapon_element == 3) danno *= 2;
    // terreno elementale (Volcano, Deluge, Violent Gale) per livello
    var terreno = [110, 114, 117, 119, 120];
    if (n_A_Buf6[0] == 0 && n_A_Buf6[1] >= 1 && n_A_Weapon_element == 3)
      danno = Math.floor((danno * terreno[n_A_Buf6[1] - 1]) / 100);
    if (n_A_Buf6[0] == 1 && n_A_Buf6[1] >= 1 && n_A_Weapon_element == 1)
      danno = Math.floor((danno * terreno[n_A_Buf6[1] - 1]) / 100);
    if (n_A_Buf6[0] == 2 && n_A_Buf6[1] >= 1 && n_A_Weapon_element == 4)
      danno = Math.floor((danno * terreno[n_A_Buf6[1] - 1]) / 100);
  }
  if (n_B_buf[1]) danno = Math.floor(danno / 2);
  if (n_rangedAtk == 2) danno += Math.floor((20 * danno * (n_B_buf[7] - n_B_buf[8])) / 100);
  else danno += Math.floor((20 * danno * (n_B_buf[8] - n_B_buf[7])) / 100);
  if (targetData[19] == 5) {
    danno = 1;
    if (SKILLID.FIRE_PILLAR == n_A_ActiveSkill) danno = 0;
  }
  return danno;
}
// buff del mostro n_B_buf[11] (percentuali di w_AG): riduce i danni non magici
function tPlusAG() {
  if (n_rangedAtk != 2 && n_B_buf[11] > 0) {
    var percento = w_AG[n_B_buf[11]];
    for (var e = 0; e <= 2; e++) w_DMG[e] *= percento / 100;
  }
}
function skill_dmg(skill) {
  skill = baseSkillId(skill);
  var percento = 100;
  if (n_A_Buf9[20] == skill) percento += n_A_Buf9[19];
  if (n_A_Buf9[22] == skill) percento += n_A_Buf9[21];
  return percento;
}
function defReduction(def) {
  return (100 - def) / 100;
}
function mdefReduction(mdef) {
  return (100 - mdef) / 100;
}
