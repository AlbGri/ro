// I campi e i risultati del motore come li usa chi sta fuori (la pagina, i test, gli strumenti
// di prova).

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
