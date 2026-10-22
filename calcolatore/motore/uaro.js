// Correzioni per uaRO ai dati del motore, prese dalla wiki del server
// (wiki.uaro.net: Item Changes, Dimonka Headgear Quests, Scaraba Hole, patch note).
// Si caricano dopo i file dei dati e prima di inizio.js, che costruisce gli elenchi.
// Le correzioni al codice sono nei file del motore, con un commento "uaRO:" e la fonte.

// id degli oggetti aggiunti qui che il resto del motore deve riconoscere
var OLD_MITRA_UARO = 0;
var GIGANTIC_GOAT_UARO = [];
var BOITATA_HAT_UARO = 0;
var OLD_MINSTREL_HAT_UARO = 0;

// Chiamata da StAllCalc (statistiche.js) dopo la somma dei bonus dell'equipaggiamento
function applyUaroHeadgearBonuses() {
  // Mitra: MATK +10 con INT base almeno 90 (Item Changes, Dimonka)
  if (n_A_Equip[2] == 1876 && SU_INT >= 90) bonusValues[BONUSID.MATK] += 10;
  // Old Mitra: ogni 2 raffinamenti MaxHP +1%, MaxSP +1%, ATK +8, MATK +4 (Item Changes)
  if (OLD_MITRA_UARO && n_A_Equip[2] == OLD_MITRA_UARO) {
    var k = Math.floor(n_A_HEAD_REFINE / 2);
    bonusValues[BONUSID.HP_PERCENT] += k;
    bonusValues[BONUSID.SP_PERCENT] += k;
    bonusValues[BONUSID.ATK] += 8 * k;
    bonusValues[BONUSID.MATK] += 4 * k;
  }
  // Gigantic Majestic Goat (ATK e DEF): ATK + livello job * 2 / 7 (rAthena, bBaseAtk)
  if (GIGANTIC_GOAT_UARO.some((id) => id == n_A_Equip[2]))
    bonusValues[BONUSID.ATK] += Math.floor((n_A_JobLV * 2) / 7);
  // Boitata Hat: resistenza ai Brute +5% a +5 e altri +5% a +7 (screen del gioco)
  if (BOITATA_HAT_UARO && n_A_Equip[2] == BOITATA_HAT_UARO)
    bonusValues[BONUSID.RESIST_BRUTE_PERCENT] += (n_A_HEAD_REFINE >= 5 ? 5 : 0) + (n_A_HEAD_REFINE >= 7 ? 5 : 0);
  // Old Minstrel Song's Hat: danno fisico a distanza +1% ogni 2 raffinamenti (screen del gioco)
  if (OLD_MINSTREL_HAT_UARO && n_A_Equip[2] == OLD_MINSTREL_HAT_UARO)
    bonusValues[BONUSID.RANGED_ATK_PERCENT] += Math.floor(n_A_HEAD_REFINE / 2);
}

(function () {
  function correggi(id, campi) {
    Object.assign(itemData[id], campi);
  }
  // Gli oggetti aggiunti qui hanno id fissi da 3000: gli elenchi dei dati possono crescere
  // senza cambiarli, e le build salvate restano valide (l'indirizzo arriva fino a 3843)
  var PRIMO_ID = 3000;
  if (itemData.length > PRIMO_ID) throw new Error("uaro.js: gli oggetti di item.js superano l'id " + PRIMO_ID);
  function nuovo(campi) {
    while (itemData.length < PRIMO_ID) {
      var vuoto = { id: itemData.length, equipType: -1, jobMask: 0, attackOrDefense: 0, weaponLevel: 0, slots: 0, weight: 0, requiredLevel: 0, name: "", extraInfo: 0, description: "", bonuses: [] };
      itemData.push(vuoto);
    }
    var o = Object.assign({ id: itemData.length, jobMask: 0, weaponLevel: 0, extraInfo: 0, description: "", bonuses: [] }, campi);
    itemData.push(o);
    ItemMax = itemData.length - 1;
    return o.id;
  }
  function senzaBonus(id, bonus) {
    return itemData[id].bonuses.filter(function (b) { return b.id !== bonus; });
  }

  // Tirapugni: penalita' di taglia 100/100/75% (Item Changes, "Knuckle weapons")
  m_WeaponSize[13] = [1, 1, 0.75];

  // Slot (Item Changes; Scaraba Hole, Queen Scaraba)
  correggi(1891, { slots: 2 }); // Catapult [2]
  correggi(1910, { slots: 1 }); // Dance Shoes [1]
  correggi(1900, { slots: 2 }); // Golden Wrench [2]
  correggi(1434, { slots: 2 }); // Alca Bringer [2]
  correggi(1196, { slots: 2 }); // Two-Handed Chrome Metal Sword [2]

  // Defolty Doll Hat: niente STR (Item Changes)
  correggi(891, { bonuses: senzaBonus(891, BONUSID.STR) });
  // Satanic Bone Helm: livello richiesto 1 (Item Changes)
  correggi(1417, { requiredLevel: 1 });
  // Anubis Helm: MDEF +5, livello 65 (Dimonka Headgear Quests)
  correggi(1258, {
    requiredLevel: 65,
    bonuses: itemData[1258].bonuses.concat([{ id: BONUSID.MDEF, value: 5 }]),
  });
  // Mitra: il MATK +10 con INT base 90 lo applica la modifica al codice
  correggi(1876, { description: "Base INT at least 90: MATK +10" });

  // bonus 100: cure ricevute, da Heal e Sanctuary
  // Love Guard (Benevolent Guardian), tolto da Thrice ma ancora usato dal codice per il +3% a
  // +7: cure ricevute +5%, cure proprie +2% (Item Changes, Dimonka)
  correggi(1768, {
    equipType: 50,
    attackOrDefense: 4,
    slots: 1,
    weight: 50,
    requiredLevel: 30,
    name: "Love Guard",
    description: "Occupies upper and middle headgear.<br>Healing received +5%.<br>Your healing skills +2%.<br><b>[Refine Rate 7~10]</b><br>Your healing skills +3%.",
    bonuses: [{ id: 200, value: 1 }, { id: 100, value: 5 }, { id: BONUSID.ALL_HEAL_PERCENT, value: 2 }],
  });
  // Santa Poring Hat, tolto da Thrice: dalla versione di Arlix, uguale alla wiki (Dimonka)
  correggi(870, {
    equipType: 50,
    attackOrDefense: 2,
    weight: 10,
    requiredLevel: 1,
    name: "Santa Poring Hat",
    description: "Physical damage against Shadow element +3%.<br>Damage from Shadow element -3%.<br>Unrefinable.",
    bonuses: [{ id: BONUSID.MDEF, value: 2 }, { id: BONUSID.DMG_SHADOW_PERCENT, value: 3 }, { id: BONUSID.RESIST_SHADOW_PERCENT, value: 3 }, { id: 193, value: 2 }],
  });

  // Copricapi di Dimonka assenti
  nuovo({
    equipType: 50, attackOrDefense: 0, slots: 1, weight: 50, requiredLevel: 60, name: "Glaris Doll Hat",
    description: "Recover 50 HP when killing a monster with magic.",
    bonuses: [{ id: BONUSID.RESIST_DEMI_HUMAN_PERCENT, value: 5 }],
  });
  nuovo({
    equipType: 52, attackOrDefense: 1, slots: 0, weight: 0, requiredLevel: 1, name: "Umbala Spirit",
    description: "Meat recovery +25%; chance to drop Meat when killing a monster.",
    bonuses: [{ id: BONUSID.HP_PERCENT, value: 1 }],
  });
  nuovo({
    equipType: 52, attackOrDefense: 0, slots: 0, weight: 10, requiredLevel: 0, name: "Antique Smoking Pipe",
    bonuses: [{ id: BONUSID.RESIST_DEMI_HUMAN_PERCENT, value: 2 }],
  });
  // posto vuoto: nella 1.6 c'era Pecopeco Wing Ears, doppione di Peco Ears (805), che ora ha il nome
  // del gioco e la combinazione con il Darkness Helm
  nuovo({ equipType: -1, attackOrDefense: 0, slots: 0, weight: 0, requiredLevel: 0, name: "" });
  // Old Mitra: i bonus per raffinamento li applica la modifica al codice (Item Changes)
  OLD_MITRA_UARO = nuovo({
    equipType: 50, attackOrDefense: 0, slots: 1, weight: 10, requiredLevel: 70, name: "Old Mitra (UARO)",
    description: "For each 2 refine levels: MaxHP +1%, MaxSP +1%, ATK +8, MATK +4, [Magnus Exorcismus] damage +4%.",
    bonuses: [{ id: BONUSID.INT, value: 1 }, { id: BONUSID.MDEF, value: 5 }],
  });

  // Dagli screen del gioco di Alberto (21/10/2026), con rAthena per cio' che non dicono: la
  // formula dell'ATK delle Goat. Dove i due non coincidono vale lo screen: Meteor Plate senza
  // slot (rAthena 1), Blood Sucker 1% di assorbire il 3% (rAthena 3% il 5%)
  GIGANTIC_GOAT_UARO.push(
    nuovo({
      equipType: 50, attackOrDefense: 5, slots: 0, weight: 80, requiredLevel: 1, name: "Gigantic Majestic Goat (ATK)",
      description: "ATK + Job Level * 2 / 7.",
      bonuses: [{ id: BONUSID.DMG_DEMI_HUMAN_PERCENT, value: 12 }],
    }),
    nuovo({
      equipType: 50, attackOrDefense: 5, slots: 0, weight: 80, requiredLevel: 50, name: "Gigantic Majestic Goat (DEF)",
      description: "ATK + Job Level * 2 / 7.",
      bonuses: [{ id: BONUSID.RESIST_DEMI_HUMAN_PERCENT, value: 12 }],
    }),
  );
  // jobMask 1070: Swordman e Merchant con le loro classi, solo rinati; 151 e 152: resistenza a
  // Stun e Freeze
  nuovo({
    equipType: 60, attackOrDefense: 10, slots: 0, weight: 300, requiredLevel: 55, name: "Meteor Plate", jobMask: 1070,
    bonuses: [{ id: 151, value: 30 }, { id: 152, value: 30 }],
  });
  nuovo({
    equipType: 52, attackOrDefense: 0, slots: 0, weight: 30, requiredLevel: 40, name: "Blood Sucker",
    description: "1% chance to absorb 3% of the physical damage dealt as HP (not simulated).",
    bonuses: [{ id: BONUSID.HP_RECOVERY_PERCENT, value: -100 }, { id: BONUSID.SP_RECOVERY_PERCENT, value: -100 }],
  });

  // Dagli screen del gioco di Alberto (22/10/2026). Il danno di una skill e' il bonus 5000 + skill
  // (nomi iRO: Triple Attack = Raging Trifecta Blow 187, Chain Combo = Raging Quadruple Blow 188,
  // Combo Finish = Raging Thrust 189, Tiger Fist = Glacier Fist 289, Chain Crush Combo 290)
  correggi(805, { name: "Pecopeco Wing Ears" }); // era "Peco Ears"
  // Necktie: VIT +1 e HIT -5 (tolti nella fase 3 del refactoring perche' il motore non li leggeva)
  correggi(1182, {
    name: "Necktie",
    bonuses: itemData[1182].bonuses.concat([{ id: BONUSID.VIT, value: 1 }, { id: BONUSID.HIT, value: -5 }]),
  });
  // Blush, posto vuoto in Thrice: serve alla combinazione con la Necktie (ASPD +3%, lancio +3%).
  // Dati da rAthena (copricapo medio, peso 10, nessun bonus)
  correggi(247, { equipType: 51, attackOrDefense: 0, slots: 0, weight: 10, requiredLevel: 0, name: "Blush" });
  BOITATA_HAT_UARO = nuovo({
    equipType: 50, attackOrDefense: 5, slots: 1, weight: 30, requiredLevel: 20, name: "Boitata Hat",
    description: "When killing a Brute monster with physical attacks: SP +5.<br>When killing a monster with physical attacks: HP +100.<br><b>[Refine Rate 5~10]</b><br>Damage from Brute race -5%.<br><b>[Refine Rate 7~10]</b><br>Damage from Brute race -5%.",
    bonuses: [{ id: BONUSID.MDEF, value: 5 }],
  });
  // jobMask 150: Clown e Gypsy
  OLD_MINSTREL_HAT_UARO = nuovo({
    equipType: 50, attackOrDefense: 3, slots: 1, weight: 10, requiredLevel: 90, name: "Old Minstrel Song's Hat", jobMask: 150,
    description: "<b>For each 2 refine levels:</b><br>Ranged physical damage +1%.",
    bonuses: [{ id: BONUSID.ALL_STATS, value: 1 }, { id: 5292, value: 20 }],
  });
  nuovo({
    equipType: 52, attackOrDefense: 1, slots: 0, weight: 10, requiredLevel: 10, name: "Handkerchief in Mouth",
    bonuses: [{ id: BONUSID.RESIST_DEMI_HUMAN_PERCENT, value: 2 }, { id: BONUSID.RESIST_WIND_PERCENT, value: 5 }],
  });
  var yinYang = nuovo({
    equipType: 51, attackOrDefense: 0, slots: 0, weight: 10, requiredLevel: 70, name: "Yin Yang Earrings",
    bonuses: [{ id: 5188, value: 10 }, { id: 5187, value: 5 }, { id: 5189, value: 5 }],
  });
  // combinazione con l'Hot-Blooded Headband (357), come quelle di w_SE in item.js
  var yinYangCombo = nuovo({
    equipType: 100, attackOrDefense: 0, slots: 0, weight: 0, requiredLevel: 0, name: "Yin Yang Earrings & Hot-Blooded Headband",
    bonuses: [{ id: 5187, value: 5 }, { id: 5189, value: 5 }, { id: 5289, value: 3 }, { id: 5290, value: 3 }],
  });
  w_SE.push([yinYangCombo, 357, yinYang, "NULL"]);
  SE_MAXnum = w_SE.length - 1;
  itemData[357].bonuses.push({ id: BONUSID.GEAR_SET_ID, value: SE_MAXnum });
  itemData[yinYang].bonuses.push({ id: BONUSID.GEAR_SET_ID, value: SE_MAXnum });

  // Kraken Card (mantello): FLEE +10, resistenza a tutti gli elementi +25%, Hiding livello 1 (220,
  // 22 come la Smokie Card)
  var kraken = m_Card.length;
  m_Card.push([kraken, 5, "Kraken", 0, BONUSID.FLEE, 10, 60, 25, 61, 25, 62, 25, 63, 25, 64, 25, 65, 25, 66, 25, 67, 25, 68, 25, 69, 25, 220, 22, 0]);
  var mantelli = m_CardSort[5];
  var dove = mantelli.findIndex(function (id, k) {
    return k > 0 && (id == "NULL" || m_Card[id][2].localeCompare("Kraken") > 0);
  });
  mantelli.splice(dove, 0, kraken);
})();
