// Correzioni per uaRO al codice del calcolatore di Thrice, dalla wiki del server (wiki.uaro.net).
// Le applica strumenti/importa.mjs dopo aver formattato i file: "cerca" e' il testo formattato
// da sostituire, e deve comparire una volta sola. Le correzioni ai dati sono in motore/uaro.js.
export const MODIFICHE = [
  {
    motivo: "Soul Strike: +7% di danno per livello contro i non morti, non +5% (Class Changes, Mage; patch del 24/11/2025)",
    file: "head.js",
    cerca: `        SKILLID.SOUL_STRIKE == n_A_ActiveSkill &&
        (wBMC2 = Math.floor(wBMC2 * (1 + 0.05 * n_A_ActiveSkillLV)))
      : 90 <= targetData[3] &&`,
    sostituisci: `        SKILLID.SOUL_STRIKE == n_A_ActiveSkill &&
        (wBMC2 = Math.floor(
          wBMC2 * (1 + (SRV == SERVERID.UARO ? 0.07 : 0.05) * n_A_ActiveSkillLV),
        ))
      : 90 <= targetData[3] &&`,
  },
  {
    motivo: "Arrow Vulcan: ritardo di 2 secondi, non 3 (Class Changes, Bard/Dancer; patch del 24/11/2025)",
    file: "head.js",
    cerca: `          n_A_ActiveSkillLV >= 6 ? (n_Delay[2] = 1) : (n_Delay[2] = 0.8),
          (n_Delay[3] = 3));`,
    sostituisci: `          n_A_ActiveSkillLV >= 6 ? (n_Delay[2] = 1) : (n_Delay[2] = 0.8),
          (n_Delay[3] = SRV == SERVERID.UARO ? 2 : 3));`,
  },
  {
    motivo: "Back Stab: ricarica fissa di 0,333 secondi al posto del ritardo dopo il lancio (Class Changes, Rogue; patch del 01/04/2026)",
    file: "head.js",
    cerca: `        ((wMod += 0.4 * n_A_ActiveSkillLV + 2),
          (n_Delay[2] = 0.5),`,
    sostituisci: `        ((wMod += 0.4 * n_A_ActiveSkillLV + 2),
          SRV == SERVERID.UARO ? (n_Delay[3] = 0.333) : (n_Delay[2] = 0.5),`,
  },
  {
    motivo: "Adrenaline Rush: vale anche con le spade a una mano (Class Changes, Blacksmith)",
    file: "foot.js",
    cerca: `      6 <= n_A_WeaponType &&
        n_A_WeaponType <= 8 &&
        SkillSearch(SKILLID.ADRENALINE_RUSH) &&`,
    sostituisci: `      ((6 <= n_A_WeaponType && n_A_WeaponType <= 8) ||
        (SRV == SERVERID.UARO && n_A_WeaponType == 2)) &&
        SkillSearch(SKILLID.ADRENALINE_RUSH) &&`,
  },
  {
    motivo: "Adrenaline Rush ricevuto dal party: vale anche con le spade a una mano (Class Changes, Blacksmith)",
    file: "foot.js",
    cerca: `      ? 6 <= n_A_WeaponType &&
        n_A_WeaponType <= 8 &&
        (n_A_Buf2[6] == 1`,
    sostituisci: `      ? ((6 <= n_A_WeaponType && n_A_WeaponType <= 8) ||
          (SRV == SERVERID.UARO && n_A_WeaponType == 2)) &&
        (n_A_Buf2[6] == 1`,
  },
  {
    motivo: "Luna Bow: DEF +2, +3 da +6, +5 da +9 (Item Changes; patch del 04/08/2026). Nel codice c'erano i valori ufficiali",
    file: "foot.js",
    cerca: `    (n_A_Equip[0] == 521 &&
      (n_A_Weapon_refine <= 5
        ? (n_A_DEF += 2)
        : n_A_Weapon_refine >= 9
          ? (n_A_DEF += 7)
          : (n_A_DEF += 5)),`,
    sostituisci: `    (n_A_Equip[0] == 521 &&
      (n_A_Weapon_refine <= 5
        ? (n_A_DEF += 2)
        : n_A_Weapon_refine >= 9
          ? (n_A_DEF += SRV == SERVERID.UARO ? 5 : 7)
          : (n_A_DEF += SRV == SERVERID.UARO ? 3 : 5)),`,
  },
  {
    motivo: "Super Novice: +2000 di peso trasportabile (Class Changes, Super Novice)",
    file: "foot.js",
    cerca: `  (1 * c.A_adopted.checked && (O = 2e3),
    (O += 1 * c.A_STR.value * 30),`,
    sostituisci: `  (1 * c.A_adopted.checked && (O = 2e3),
    SRV == SERVERID.UARO && n_A_JOB == 20 && (O += 2e3),
    (O += 1 * c.A_STR.value * 30),`,
  },
  {
    motivo: "Super Novice: +2000 di peso anche in Other Info (Class Changes, Super Novice)",
    file: "foot.js",
    cerca: `            1 * c.A_adopted.checked && (wLimit = 2e3),
            wLimit += 1 * c.A_STR.value * 30,`,
    sostituisci: `            1 * c.A_adopted.checked && (wLimit = 2e3),
            SRV == SERVERID.UARO && n_A_JOB == 20 && (wLimit += 2e3),
            wLimit += 1 * c.A_STR.value * 30,`,
  },
  {
    motivo: "Mitra e Old Mitra: bonus che dipendono da INT base e raffinamento (motore/uaro.js)",
    file: "foot.js",
    cerca: `  applyForbiddenGrimoireComboBonuses();`,
    sostituisci: `  (applyForbiddenGrimoireComboBonuses(), applyUaroHeadgearBonuses());`,
  },
  {
    motivo: "Old Mitra: Magnus Exorcismus +4% ogni 2 raffinamenti (Item Changes)",
    file: "head.js",
    cerca: `      (n += 4 * SkillSearch(SKILLID.IMPOSITIO_MANUS) * EquipNumSearch(EQUIPID.VALKYRIE_DROP)),`,
    sostituisci: `      (n += 4 * SkillSearch(SKILLID.IMPOSITIO_MANUS) * EquipNumSearch(EQUIPID.VALKYRIE_DROP)),
    a == SKILLID.MAGNUS_EXORCISMUS &&
      n_A_Equip[2] == OLD_MITRA_UARO &&
      (n += 4 * Math.floor(n_A_HEAD_REFINE / 2)),`,
  },
];
