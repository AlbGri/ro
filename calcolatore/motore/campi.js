// I campi e i risultati del motore come li usa chi sta fuori (la pagina, i test, gli strumenti
// di prova).

// Un campo creato dal codice, non dall'HTML: tipo "select", "checkbox", "testo" o "pulsante";
// gestore: la funzione eseguita alla scelta (this e' il campo), o null. imp: opzioni
// ([valore, testo, scelta]), spuntato, disabilitato, nascosto, valore. Per ora e' un elemento
// del documento finto fuori dall'albero, registrato in c (calcForm)
function campo(nome, tipo, gestore, imp) {
  imp = imp || {};
  // gli attributi come li avrebbe letti il parser dall'HTML: stessi valori iniziali
  var attributi = { name: nome };
  if (tipo !== "select") attributi.type = { testo: "text", pulsante: "button" }[tipo] || tipo;
  if (imp.spuntato) attributi.checked = "";
  if (imp.disabilitato) attributi.disabled = "";
  if (imp.nascosto) attributi.hidden = "";
  if (imp.valore !== undefined) attributi.value = imp.valore;
  var el = new Elemento(documento, tipo === "select" ? "select" : "input", attributi);
  el._funzione = gestore;
  (imp.opzioni || []).forEach(function (o) {
    el.appendChild(new documento.Opzione(o[1], o[0], o[2], o[2]));
  });
  CAMPI_FISSI.add(nome);
  documento.calcForm[nome] = el;
  return el;
}

// Una scelta e' il valore nel campo, poi il suo gestore. Il ricalcolo (calc) lo chiede chi
// sceglie. campo: il campo o il suo nome; senza valore esegue solo il gestore (pulsanti)
function scegli(campo, valore) {
  if (typeof campo === "string") campo = c[campo];
  if (valore !== undefined) {
    if (campo.type === "checkbox") campo.checked = valore;
    else campo.value = valore;
  }
  if (campo.gestore) campo.gestore.call(campo);
}

// I risultati: uscite[id] e' il testo che il motore scrive con scrivi(id, valore). E' HTML con
// pochi tag (grassetto, colori, a capo, spiegazioni in span.name/.nametext, le tabelle di Altre
// informazioni e la scheda dell'oggetto). All'avvio vale il contenuto che l'id aveva nello
// scheletro della pagina, che poi non lo contiene piu'
var USCITE = ["A_STPOINT","A_BodySIZE","A_BodyELEMENT","A_STRp","A_AGIp","A_VITp","A_INTp","A_DEXp","A_LUKp","A_MaxHP","A_totalDEF","A_HIT","A_MaxSP","A_MDEF","A_PefHIT","A_HPR","A_RealMDEF","A_CRI","A_SPR","A_ATK2","A_CRITSHIELD","A_ASPD","A_RealATK","A_FLEE","A_MovSPEED","A_MATK","A_WoeFLEE","A_Weight","A_cTime","A_LUCKY","A_cDelay","A_SobWeaponName","ITEM_TITLE","ITEM1","ITEM_DATA","ITEM2","ITEM_W_LV","ITEM3","ITEM_LV","ITEM4","ITEM_WAIT","B_SETUMEI","B_6","B_16","B_agi","B_12","B_13","B_17","B_vit","B_14","B_AA","B_23","B_2","B_int","B_15","B_AB","B_25","B_3","B_dex","B_21","B_4","B_luk","B_22","B_type","nm053","BattleHIT","nm074","A_WeaponElement","nm076","A_WeaponSize","CRIATKname","CRIATK","CRInum","bSUB3name","bSUB3","bSUBname","bSUB","nm055","strID_0","nm056","strID_1","nm057","strID_2","bREFLECT1name","bREFLECT1","bREFLECT2name","bREFLECT2","bSUB2name","bSUB2","nm058","AveSecondATK","nm059","MinATKnum","nm060","AveATKnum","nm061","MaxATKnum","nm062","BattleTime","nm063","AtkBaseExp","nm064","AtkJobExp","nm054","BattleFLEE","nm075","B_WeaponElement","nm067","B_MinAtk","nm065","B_AveAtk","nm068","B_MaxAtk","aREFLECT1name","aREFLECT1","aREFLECT2name","aREFLECT2","nm066","B_Ave2Atk","B_EffectiveHP","B_ExpectedEffectiveHP","B_SurvivalHits"];
var uscite = {};
USCITE.forEach(function (id) {
  var el = documento.getElementById(id);
  uscite[id] = el.innerHTML;
  el.padre.removeChild(el);
});
function scrivi(id, valore) {
  uscite[id] = "" + valore;
}
// il testo di un risultato come lo vede una persona, spazi compressi (anche per gli id rimasti
// nel documento finto: etichette dei pannelli)
function testo(id) {
  var html = uscite[id];
  if (html === undefined) return documento.testo(id);
  return documento._analizza(html).map(function (n) { return n.textContent; }).join("").replace(/\s+/g, " ").trim();
}

// I campi fissi della pagina (erano nello scheletro, pagina.js), nell'ordine in cui vi stavano
campo("maxASPD", "select", function () { StAllCalc(); calc(); }, { opzioni: [["0", "190"], ["1", "191"], ["2", "192"], ["3", "193"], ["4", "194"], ["5", "195"]] });
campo("restrict_jobequip", "checkbox", function () { ClickJob(); StAllCalc(); StCalc(); }, { spuntato: true, disabilitato: true });
campo("restrict_lvlequip", "checkbox", function () { WeaponSet(); ClickWeaponType(0); WeaponSet2(); }, { disabilitato: true });
campo("restrict_equipslot", "checkbox", function () { StAllCalc(); calc(); });
campo("restrict_cardslot", "checkbox", function () { restrictCardslot(0); });
campo("all_card", "checkbox", function () { allCard(); });
campo("A_BaseLV", "select", function () { StCalc(1); StAllCalc(); });
campo("BLVauto", "checkbox", null, { spuntato: true });
campo("A_JobLV", "select", function () { StAllCalc(); });
campo("A_JOB", "select", function () { ClickJob(this.value); StAllCalc(); StCalc(); restrictCardslot(0); });
campo("A_adopted", "checkbox", function () { calc(); });
campo("A_STR", "select", function () { StCalc(); StAllCalc(); });
campo("A_AGI", "select", function () { StCalc(); StAllCalc(); });
campo("A_VIT", "select", function () { StCalc(); StAllCalc(); });
campo("A_INT", "select", function () { StCalc(); StAllCalc(); });
campo("A_DEX", "select", function () { StCalc(); StAllCalc(); });
campo("A_LUK", "select", function () { StCalc(); StAllCalc(); });
campo("episode", "select", function () { ClickJob(); }, { opzioni: [["0", "All"], ["13", "Until episode 13.3: El Dicastes"], ["12", "Until episode 12: Nightmare of Midgard, Destruction of Morocc"], ["11", "Until episode 11: The Religious Nation, Arunafeltz"], ["10", "Until episode 10: The Republic of Schwarzwald"], ["9", "Until episode 9: Rebirth Job System"], ["8", "Until episode 8: Niflheim ~ City of the Dead"]] });
campo("A_Arrow", "select", function () { calc(); }, { opzioni: [["0", "(no arrow)"], ["1", "Silver Arrow"]], disabilitato: true });
campo("A_Weapon_refine", "select", function () { calc(); }, { disabilitato: true });
campo("A_OverRefineBonus", "checkbox", function () { calc(); }, { spuntato: true });
campo("A_Weapon_element", "select", function () { calc(); });
campo("A_cardshort", "select", function () { Setm_CardShort(); Click_Card(); ActiveSkillSetPlus(); });
campo("A_weapon1_card1", "select", function () { Click_Card(this.value); });
campo("A_weapon1_card2", "select", function () { Click_Card(this.value); });
campo("A_weapon1_card3", "select", function () { Click_Card(this.value); });
campo("A_weapon1_card4", "select", function () { Click_Card(this.value); });
campo("A_HEAD_REFINE", "select", function () { StAllCalc(); });
campo("A_head1", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(2); });
campo("A_head1_card", "select", function () { StAllCalc(); Card(this.value); });
campo("A_head2", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(3); });
campo("A_head2_card", "select", function () { StAllCalc(); Card(this.value); });
campo("A_BASTION_HEAD", "select", function () { StAllCalc(); });
campo("A_head3", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(4); });
campo("A_HSE_HEAD1", "select", function () { StAllCalc(); });
campo("A_LEFT_REFINE", "select", function () { StAllCalc(); });
campo("A_left", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(5); setShieldWeight(this.value); });
campo("A_left_card", "select", function () { StAllCalc(); Card(this.value); });
campo("A_BODY_REFINE", "select", function () { StAllCalc(); });
campo("A_body", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(6); });
campo("A_body_card", "select", function () { StAllCalc(); Card(this.value); });
campo("A_HSE", "select", function () { StAllCalc(); });
campo("A_SHOULDER_REFINE", "select", function () { StAllCalc(); });
campo("A_shoulder", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(7); });
campo("A_shoulder_card", "select", function () { StAllCalc(); Card(this.value); });
campo("A_DICASTES_SHOULDER_PRIMARY", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_SHOULDER_STATS", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_SHOULDER_STATS2", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_SHOES_REFINE", "select", function () { StAllCalc(); });
campo("A_shoes", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(8); });
campo("A_shoes_card", "select", function () { StAllCalc(); Card(this.value); });
campo("A_BASTION_SHOES", "select", function () { StAllCalc(); });
campo("A_DICASTES_SHOES_PRIMARY", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_SHOES_STATS", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_SHOES_STATS2", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_acces1", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(9); });
campo("A_acces1_card", "select", function () { Click_Card(this.value); });
campo("A_DICASTES_ACCESSORY1_PRIMARY", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_ACCESSORY1_STATS", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_ACCESSORY1_STATS2", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_acces2", "select", function () { StAllCalc(); ClickB_Item(this.value); restrictCardslot(10); });
campo("A_acces2_card", "select", function () { Click_Card(this.value); });
campo("A_DICASTES_ACCESSORY2_PRIMARY", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_ACCESSORY2_STATS", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_DICASTES_ACCESSORY2_STATS2", "select", function () { StAllCalc(); }, { disabilitato: true, nascosto: true });
campo("A_Kakutyou", "select", function () { preparaAltreInfo(); StAllCalc(); }, { opzioni: [["0", "-"], ["2", "Heal amount"], ["4", "Sanctuary amount"], ["12", "Player Resistance"], ["14", "+% ATK based Damage Modifiers"], ["16", "+% MATK based Damage Modifiers"], ["20", "Experience"], ["22", "Potion Pitcher HP/SP power"], ["24", "Forge/Potion/EDP Creation Success Rate"], ["28", "Strip chance & duration"], ["30", "Cooking Success Rates"], ["32", "Capture Pet Success Rate"], ["34", "NPC Refinement Cost & Success Rate"], ["36", "NPC Socket Enchant Cost & Success Rate"], ["40", "Non-Damage Skill Cast Time"]] });
campo("ENEMY_SORT2", "select", function () { riempiMappe(); EnemySort(); calc(); });
campo("ENEMY_MAP", "select", function () { EnemySort(); calc(); });
campo("ENEMY_TYPE", "select", function () { EnemySort(); calc(); }, { opzioni: [["0", "All types"], ["1", "MvP"], ["2", "Boss (not MvP)"], ["3", "Normal monsters"]] });
campo("ENEMY_SORT", "select", function () { EnemySort(); calc(); }, { opzioni: [["0", "Alphabetical"], ["1", "By attribute"], ["2", "By race"], ["8", "By size"], ["3", "By 100%Hit"], ["4", "By 95%Flee"], ["5", "By BaseExp"], ["6", "By JobExp"], ["7", "By MaxATK"], ["9", "By DEF"], ["10", "By MDEF"], ["11", "By Type"]] });
campo("B_Enemy", "select", function () { Bskill(true); scheduleMonsterCalculation(); });
campo("all_dmgSkills", "checkbox", function () { Askill(); calc(); });
campo("ReCalcButton", "pulsante", function () { calc(); }, { valore: "ReCalculate" });
campo("A_ActiveSkill", "select", function () { ClickActiveSkill(); calc(); });
campo("A_ActiveSkillLV", "select", function () { calc(); }, { opzioni: [["1", "Lvl 1"]] });
campo("B_AtkRange", "select", function () { calc(); }, { opzioni: [["0", "(unchanged)"], ["1", "Melee (4 or less cells away)"], ["2", "Long Range (5 or more cells away)"]] });
campo("B_AtkSkill", "select", function () { BClickAtkSkill(); }, { opzioni: [["0", "Basic Attack"], ["6", "Bash Lvl 10"], ["7", "Magnum Break Lvl 10"], ["17", "Envenom Lvl 10"], ["19", "Sand Attack Lvl 1"], ["40", "Double Strafe Lvl 10"], ["41", "Arrow Shower Lvl 10"], ["44", "Arrow Repel Lvl 1"], ["46", "Napalm Beat Lvl 10"], ["47", "Soul Strike Lvl 10"], ["51", "Fire Bolt Lvl 10"], ["52", "Fire Ball Lvl 10"], ["53", "Fire Wall Lvl 10"], ["54", "Cold Bolt Lvl 10"], ["55", "Frost Diver Lvl 10"], ["56", "Lightning Bolt Lvl 10"], ["57", "Thunder Storm Lvl 10"], ["65", "Mammonite Lvl 10"], ["66", "Cart Revolution Lvl 1"], ["70", "Pierce Lvl 10"], ["71", "Spear Stab Lvl 10"], ["72", "Spear Boomerang Lvl 5"], ["73", "Brandish Spear Lvl 10"], ["76", "Bowling Bash Lvl 10"], ["83", "Sonic Blow Lvl 10"], ["84", "Grimtooth Lvl 5"], ["88", "Venom Splasher Lvl 10"], ["104", "Magnus Exorcismus Lvl 10"], ["122", "Fire Pillar Lvl 10"], ["124", "Sightrasher Lvl 5"], ["125", "Meteor Storm Lvl 10"], ["126", "Jupitel Thunder Lvl 10"], ["127", "Lord of Vermillion Lvl 10"], ["128", "Water Ball Lvl 5"], ["130", "Frost Nova Lvl 10"], ["131", "Storm Gust Lvl 10"], ["132", "Earth Spike Lvl 5"], ["133", "Heaven's Drive Lvl 5"], ["158", "Smite Lvl 5"], ["161", "Holy Cross Lvl 10"], ["162", "Grand Cross Lvl 10"], ["167", "Snatch Lvl 10"], ["169", "Back Stab Lvl 10"], ["171", "Sightless Mind Lvl 5"], ["188", "Raging Quadruple Blow Lvl 5"], ["189", "Raging Thrust Lvl 5"], ["199", "Melody Strike Lvl 5"], ["207", "Slinging Arrow Lvl 5"], ["244", "Acid Terror Lvl 5"], ["248", "Bomb Lvl 5"], ["259", "Clashing Spiral Lvl 5"], ["260", "Traumatic Blow Lvl 5"], ["261", "Vital Strike Lvl 10"], ["264", "Meteor Assault Lvl 10"], ["277", "Napalm Vulcan Lvl 5"], ["326", "High Speed Cart Ram Lvl 10"]] });
campo("B_AtkElem", "select", function () { calc(); });
campo("B_num", "select", function () { calc(); });
campo("Conf01", "select", null, { opzioni: [["10", "0.1s (10 per second)"], ["15", "0.15s"], ["20", "0.2s (5 per second)", true], ["25", "0.25s (4 per second)"], ["30", "0.3s"], ["33", "0.33s (3 per second) [default]"], ["40", "0.4s"], ["50", "0.5s (2 per second)"]] });
campo("A8_Skill14", "select", function () { StAllCalc(); calc(); }, { opzioni: [["0", "PvM / PvP", true], ["1", "WoE / BG"], ["2", "Guild Dungeon"], ["3", "URDR Server"]] });
campo("A8_Skill15", "select", function () { calc(); }, { opzioni: [["0", "-", true]] });
