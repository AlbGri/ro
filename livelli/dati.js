/**
 * Dati del calcolatore: tabelle dell'EXP base e job, quest che danno EXP.
 *
 * Le tabelle sono quelle pre-renewal di rAthena (`db/pre-re/job_exp.yml`),
 * uguali a quelle di uaRO: l'elemento `i` e' l'EXP che serve per passare dal
 * livello `i + 1` al successivo, base o job. Le quest ripetibili vengono dal wiki uaRO
 * (pagina Repeatable Quests, letta il 18/10/2026).
 */

/** EXP per livello delle classi non rinate (Novice, prime e seconde classi). */
export const EXP_NORMALE = [
  9, 16, 25, 36, 77, 112, 153, 200, 253, 320,
  385, 490, 585, 700, 830, 970, 1120, 1260, 1420, 1620,
  1860, 1990, 2240, 2504, 2950, 3426, 3934, 4474, 6889, 7995,
  9174, 10425, 11748, 13967, 15775, 17678, 19677, 21773, 30543, 34212,
  38065, 42102, 46323, 53026, 58419, 64041, 69892, 75973, 102468, 115254,
  128692, 142784, 157528, 178184, 196300, 215198, 234879, 255341, 330188, 365914,
  403224, 442116, 482590, 536948, 585191, 635278, 687211, 740988, 925400, 1473746,
  1594058, 1718928, 1848355, 1982340, 2230113, 2386162, 2547417, 2713878, 3206160, 3681024,
  4022472, 4377024, 4744680, 5125440, 5767272, 6204000, 6655464, 7121664, 7602600, 9738720,
  11649960, 13643520, 18339300, 23836800, 35658000, 48687000, 58135000, 99999998,
];

/** EXP per livello delle classi rinate (High Novice e classi trascendenti). */
export const EXP_RINATO = [
  10, 18, 28, 40, 85, 123, 168, 220, 278, 400,
  481, 613, 731, 875, 1038, 1213, 1400, 1575, 1775, 2268,
  2604, 2786, 3136, 3506, 4130, 4796, 5508, 6264, 9645, 12392,
  14220, 16159, 18209, 21649, 24451, 27401, 30499, 33748, 47342, 58160,
  64711, 71573, 78749, 90144, 99312, 108870, 118816, 129154, 174196, 213220,
  238080, 264150, 291427, 329640, 363155, 398116, 434526, 472381, 610848, 731828,
  806448, 884232, 965180, 1073896, 1170382, 1270556, 1374422, 1481976, 1850800, 3389616,
  3666333, 3953534, 4251217, 4559382, 5129260, 5488173, 5859059, 6241919, 7374168, 9570662,
  10458427, 11380262, 12336168, 13326144, 14994907, 16130400, 17304206, 18516326, 19766760, 29216160,
  34949880, 40930560, 55017900, 71510400, 106974000, 146061000, 174405000, 343210000,
];

export const LIVELLO_MASSIMO = 99;

// Tabelle della job EXP, stesso schema: il job massimo e' la lunghezza + 1.

/** Job EXP delle prime classi (Swordman, Mage...): job massimo 50. */
export const JOB_PRIMA = [
  30, 43, 58, 76, 116, 180, 220, 272, 336, 520,
  604, 699, 802, 948, 1125, 1668, 1937, 2226, 3040, 3988,
  5564, 6272, 7021, 9114, 11473, 15290, 16891, 18570, 23229, 28359,
  36478, 39716, 43088, 52417, 62495, 78160, 84175, 90404, 107611, 125915,
  153941, 191781, 204351, 248352, 286212, 386371, 409795, 482092, 509596,
];

/** Job EXP delle seconde classi (Knight, Priest...): job massimo 50. */
export const JOB_SECONDA = [
  144, 184, 284, 348, 603, 887, 1096, 1598, 2540, 3676,
  4290, 4946, 6679, 9492, 12770, 14344, 16005, 20642, 27434, 35108,
  38577, 42206, 52708, 66971, 82688, 89544, 96669, 117821, 144921, 174201,
  186677, 199584, 238617, 286366, 337147, 358435, 380376, 447685, 526989, 610246,
  644736, 793535, 921810, 1106758, 1260955, 1487304, 1557657, 1990632, 2083386,
];

/** Job EXP delle prime classi rinate (Swordman High...): job massimo 50. */
export const JOB_PRIMA_RINATO = [
  60, 86, 116, 152, 232, 360, 440, 544, 672, 1040,
  1208, 1398, 1604, 1896, 2250, 3336, 3874, 4452, 6080, 7976,
  11128, 12544, 14042, 18228, 28683, 38225, 42228, 46425, 58073, 70898,
  91195, 99290, 107720, 131043, 156238, 195400, 210438, 226010, 269028, 314788,
  384853, 479453, 510878, 620880, 715530, 965928, 1024488, 1205230, 1273990,
];

/** Job EXP delle classi trascendenti (Lord Knight, High Priest...): job massimo 70. */
export const JOB_SECONDA_RINATO = [
  288, 368, 568, 696, 1206, 1774, 2192, 3196, 5080, 7352,
  8580, 9892, 13358, 18984, 31925, 35860, 40013, 51605, 68585, 87770,
  96443, 105515, 131770, 167428, 206720, 223860, 241673, 294553, 362303, 479053,
  513362, 548856, 656197, 787507, 927154, 985696, 1046034, 1231134, 1449220, 1678177,
  1773024, 2182221, 2534978, 3043585, 3782865, 4461912, 4672971, 5971896, 6250158, 6875174,
  7562691, 8318960, 9150856, 10065942, 11877812, 14015818, 16538665, 19515624, 23028437, 28094693,
  34275525, 41816141, 51015692, 62239144, 79666104, 101972614, 130524946, 167071930, 213852071,
];

/**
 * Quest ripetibili a consegna di oggetti, solo quelle scelte per il sito. Ogni
 * consegna da' `base` EXP per `quantita` oggetti, se il livello e' fra `min` e
 * `max`. Le altre quest del wiki si aggiungono qui con lo stesso schema.
 *
 * `prezzo` e' quello usato se non se ne scrive un altro: per gli oggetti
 * venduti da un NPC (quelli con `negozio`) e' il prezzo dell'NPC, cioe' il
 * `Buy` di rAthena, che su uaRO e' tornato per le Antelope Horn; per gli altri
 * e' lo stesso `Buy`, una stima e non il prezzo del mercato. `mostro` e' quello
 * della quest di caccia dello stesso NPC: sta sulla mappa e serve per
 * completare un livello con poche uccisioni. `citta` e' la citta' da cui partire.
 */
export const QUEST = [
  {
    id: "bill", npc: "Gregor", navi: "moc_fild02 74/329", min: 10, max: 30,
    oggetto: "Bill of Birds", idOggetto: 925, quantita: 25, base: 8000, job: 4000,
    mostro: "Peco Peco", citta: "Morroc",
    prezzo: 64, negozio: { nome: "Item Collector", navi: "moc_ruins 93/53", verificare: true },
  },
  {
    id: "acorn", npc: "Nutters", navi: "mjolnir_01 293/20", min: 18, max: 60,
    oggetto: "Acorn", idOggetto: 1026, quantita: 25, base: 7200, job: 7810,
    mostro: "Coco",
    prezzo: 100, negozio: { nome: "Acorn Dealer", navi: "moscovia 208/182", verificare: true },
  },
  {
    id: "hugeleaf", npc: "Lella", navi: "ayo_fild01 44/241", min: 36, max: 65,
    oggetto: "Huge Leaf", idOggetto: 7198, quantita: 50, base: 51480, job: 63024,
    mostro: "Leaf Cat", citta: "Ayothaya", prezzo: 610,
  },
  {
    id: "anolian", npc: "Cuir", navi: "cmd_fild01 362/256", min: 45, max: 80,
    oggetto: "Anolian Skin", idOggetto: 7003, quantita: 20, base: 137900, job: 86600,
    mostro: "Alligator", citta: "Comodo", prezzo: 968,
  },
  {
    id: "sharpleaf", npc: "Lilla", navi: "um_fild01 35/281", min: 60, max: 85,
    oggetto: "Sharp Leaf", idOggetto: 7100, quantita: 50, base: 524970, job: 283670,
    mostro: "Dryad", citta: "Umbala", prezzo: 806,
  },
  {
    id: "antelope", npc: "Vegetable Farmer", navi: "ein_fild06 82/171", min: 70, max: 85,
    oggetto: "Antelope Horn", idOggetto: 7106, quantita: 50, base: 516978, job: 310310,
    mostro: "Goat", citta: "Einbroch",
    prezzo: 672, negozio: { nome: "Tool Dealer", navi: "nif_in 145/23" },
  },
];

/**
 * Quest di caccia che si possono preparare, per esempio prima di rinascere: si
 * prendono entro i livelli `min`-`max`, si uccidono i mostri e si consegnano
 * dopo, a qualsiasi livello, anche sotto il minimo (visto in gioco con la
 * Medusa). Una caccia da 150 sono tre consegne da 50, e ognuna conta come un
 * guadagno di EXP a se' per il limite del livello. Premi per 50 uccisioni.
 */
export const UCCISIONI_PER_CONSEGNA = 50;
export const CONSEGNE_MASSIME = 3;

export const CACCE = [
  {
    id: "goat", npc: "Vegetable Farmer", navi: "ein_fild06 82/171", min: 70, max: 85,
    mostro: "Goat", base: 1033956, job: 620620, citta: "Einbroch",
  },
  {
    id: "titan", npc: "Henry", navi: "ice_dun03 140/26", min: 70, max: 95,
    mostro: "Ice Titan", base: 3640000, job: 2600000, citta: "Rachel",
  },
  {
    id: "medusa", npc: "Miner", navi: "beach_dun 269/71", min: 75, max: 97,
    mostro: "Medusa", base: 2062800, job: 1409100, citta: "Comodo",
  },
];
