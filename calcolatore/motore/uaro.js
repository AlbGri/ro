// Correzioni per uaRO ai dati del calcolatore di Thrice, prese dalla wiki del server
// (wiki.uaro.net: Item Changes, Dimonka Headgear Quests, Scaraba Hole, patch note).
// Si caricano dopo i file dei dati e prima di foot.js, che costruisce gli elenchi.
// Le correzioni al codice sono in strumenti/modifiche.mjs.

// id dell'oggetto aggiunto qui che il codice modificato deve riconoscere
var OLD_MITRA_UARO = 0;

// Chiamata da StAllCalc dopo la somma dei bonus dell'equipaggiamento (strumenti/modifiche.mjs)
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
}

(function () {
  function correggi(id, campi) {
    Object.assign(itemData[id], campi);
    m_Item[id] = itemDataToLegacyRow(itemData[id]);
  }
  // Gli oggetti aggiunti qui hanno id fissi da 3000: quelli di Thrice possono crescere senza
  // cambiarli, e le build salvate restano valide (l'indirizzo arriva fino a 3843)
  var PRIMO_ID = 3000;
  if (itemData.length > PRIMO_ID) throw new Error("uaro.js: gli oggetti di Thrice superano l'id " + PRIMO_ID);
  function nuovo(campi) {
    while (itemData.length < PRIMO_ID) {
      var vuoto = { id: itemData.length, equipType: -1, jobMask: 0, attackOrDefense: 0, weaponLevel: 0, slots: 0, weight: 0, requiredLevel: 0, name: "", extraInfo: 0, description: "", bonuses: [] };
      itemData.push(vuoto);
      m_Item.push(itemDataToLegacyRow(vuoto));
    }
    var o = Object.assign({ id: itemData.length, jobMask: 0, weaponLevel: 0, extraInfo: 0, description: "", bonuses: [] }, campi);
    itemData.push(o);
    m_Item.push(itemDataToLegacyRow(o));
    ItemMax = m_Item.length - 1;
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
  nuovo({
    equipType: 51, attackOrDefense: 1, slots: 0, weight: 10, requiredLevel: 70, name: "Pecopeco Wing Ears",
    description: "The Darkness Helm combo is not simulated.",
    bonuses: [{ id: BONUSID.AGI, value: 1 }, { id: BONUSID.MDEF, value: 2 }],
  });
  // Old Mitra: i bonus per raffinamento li applica la modifica al codice (Item Changes)
  OLD_MITRA_UARO = nuovo({
    equipType: 50, attackOrDefense: 0, slots: 1, weight: 10, requiredLevel: 70, name: "Old Mitra (UARO)",
    description: "For each 2 refine levels: MaxHP +1%, MaxSP +1%, ATK +8, MATK +4, [Magnus Exorcismus] damage +4%.",
    bonuses: [{ id: BONUSID.INT, value: 1 }, { id: BONUSID.MDEF, value: 5 }],
  });
})();
