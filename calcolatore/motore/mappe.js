// Mappe di ogni luogo (v_Place) con i mostri che ci compaiono: [mappa, nome, id dei mostri].
// Generato dagli spawn di rAthena pre-re (npc/pre-re/mobs, 2026-10-21) con
// _local/prova_calcolatore/rathena/genera.mjs: i luoghi di uaRO non ci sono
var MAPPE_LUOGO = {
  // Abyss Lake Dungeon
  1: [
    ["abyss_01", "Abyss Lakes Underground Cave F1", [265, 298, 400, 401, 404, 405, 408, 411]],
    ["abyss_02", "Abyss Lakes Underground Cave F2", [298, 400, 401, 405, 406, 407, 408, 411]],
    ["abyss_03", "Abyss Lakes Underground Cave F3", [298, 404, 405, 406, 407, 408, 409, 410, 411]],
  ],
  // Amatsu
  2: [
    ["ama_dun01", "Tatami Maze", [73, 140, 299]],
    ["ama_dun02", "Battle Field in the Underground Forest", [21, 53, 73, 140, 274, 299]],
    ["ama_dun03", "Amatsu Underground Shrine", [21, 61, 73, 124, 140, 298, 299]],
    ["ama_fild01", "Amatsu Field", [53, 70, 74, 239, 241, 271, 299]],
  ],
  // Ant Hell
  3: [
    ["anthell01", "Ant Hell F1", [14, 18, 67, 191, 236, 237, 244, 282]],
    ["anthell02", "Ant Hell F2", [14, 18, 67, 191, 236, 237, 244, 281]],
  ],
  // Ayothaya
  4: [
    ["ayo_dun01", "Ancient Shrine Maze", [26, 85, 342, 345]],
    ["ayo_dun02", "Inside Ancient Shrine", [26, 342, 344, 427]],
    ["ayo_fild01", "Ayothaya Field", [103, 161, 295, 307, 345]],
    ["ayo_fild02", "Ayothaya Field", [30, 76, 235, 345]],
  ],
  // Bibilan
  6: [
    ["iz_dun00", "Undersea Tunnel F1", [86, 99, 226, 241, 254, 284]],
    ["iz_dun01", "Undersea Tunnel F2", [71, 86, 99, 226, 241, 254, 284]],
    ["iz_dun02", "Undersea Tunnel F3", [60, 71, 99, 230, 241, 287]],
    ["iz_dun03", "Undersea Tunnel F4", [166, 230, 241, 248, 285, 286]],
    ["iz_dun04", "Undersea Tunnel F5", [157, 166, 192, 230, 241, 285]],
  ],
  // Bio Labs
  7: [
    ["lhz_dun01", "Bio-life Labs 1F", [346, 357, 358, 359, 360, 361, 362, 376, 380, 381]],
    ["lhz_dun02", "Bio-life Labs 2F", [357, 358, 359, 360, 361, 362, 363, 365, 380, 381]],
    ["lhz_dun03", "Bio-life Labs 3F", [364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 496, 497, 498, 499, 500, 501]],
  ],
  // Brasilis
  10: [
    ["bra_dun01", "Behind the Waterfall", [99, 241, 254, 284, 554, 555]],
    ["bra_dun02", "Behind the Waterfall", [99, 241, 254, 284, 554, 555, 557]],
    ["bra_fild01", "Brasilis Field", [3, 127, 205, 551, 552, 553, 556]],
    ["brasilis", "Brasilis", [241]],
  ],
  // Clock Tower
  11: [
    ["alde_dun01", "Clock Tower B1", [5, 213]],
    ["alde_dun02", "Clock Tower B2", [5, 49, 221, 257]],
    ["alde_dun03", "Clock Tower B3", [90, 213, 265]],
    ["alde_dun04", "Clock Tower B4", [26, 35, 48, 141, 218, 291]],
    ["c_tower1", "Clock Tower F1", [204, 218, 231, 309]],
    ["c_tower2", "Clock Tower F2", [39, 100, 204, 231, 298, 309]],
    ["c_tower3", "Clock Tower F3", [11, 204, 298, 309]],
    ["c_tower4", "Clock Tower F4", [11, 26, 35, 39, 46, 100, 204, 298, 309]],
  ],
  // Coal Mine
  12: [
    ["mjo_dun01", "Mjolnir Dead Pit F1", [179, 244, 277]],
    ["mjo_dun02", "Mjolnir Dead Pit F2", [67, 148, 213, 277]],
    ["mjo_dun03", "Mjolnir Dead Pit F3", [67, 90, 148, 277, 292]],
  ],
  // Comodo Caves
  13: [
    ["beach_dun", "Karu, the West Cave", [217, 230, 264, 306, 343]],
    ["beach_dun2", "Ruande, the North Cave", [132, 152, 217, 241, 303]],
    ["beach_dun3", "Mao, the East Cave", [178, 217, 241, 304]],
  ],
  // Comodo Fields
  14: [
    ["cmd_fild01", "Papuchicha Forest", [2, 12, 68, 127, 267, 271, 295]],
    ["cmd_fild02", "Kokomo Beach", [12, 58, 59, 71, 72, 75, 185, 240, 317]],
    ["cmd_fild03", "Zenhai Marsh", [8, 68, 203, 264, 271, 300]],
    ["cmd_fild04", "Kokomo Beach", [12, 59, 72, 133, 240, 317]],
    ["cmd_fild05", "Border of Papuchica Forest", [12, 68, 76, 155, 258, 264, 271, 295]],
    ["cmd_fild06", "Fortress Saint Darmain (West)", [76, 113, 119, 214, 219]],
    ["cmd_fild07", "Beacon Island, Pharos", [59, 72, 214, 240, 317]],
    ["cmd_fild08", "Fortress Saint Darmain (East)", [76, 96, 113, 119, 122, 131, 155, 214]],
    ["cmd_fild09", "Fortress Saint Darmain (South)", [7, 62, 121, 153, 214, 269]],
  ],
  // Culverts
  15: [
    ["prt_sewb1", "Prontera Culvert F1", [179, 199, 202, 244]],
    ["prt_sewb2", "Prontera Culvert F2", [160, 179, 199, 201, 202, 244, 254]],
    ["prt_sewb3", "Prontera Culvert F3", [179, 199, 200, 201, 202, 244, 267]],
    ["prt_sewb4", "Prontera Culvert F4", [45, 90, 199, 200, 201, 202, 213]],
  ],
  // Dimensional Crack
  17: [
    ["moc_fild20", "Dimensional Gorge", [14, 18, 149, 150, 191, 214, 236, 238, 305, 490, 492, 493]],
    ["moc_fild21", "Dimensional Gorge", [106, 152, 308, 490, 492, 493]],
    ["moc_fild22", "Dimensional Gorge", [490, 492, 493, 494]],
  ],
  // Einbroch Dungeon
  18: [
    ["ein_dun01", "Mine Dungeon F1", [347, 348, 349, 350, 353, 354]],
    ["ein_dun02", "Mine Dungeon F2", [351, 352, 353, 355, 356]],
  ],
  // Einbroch Fields
  19: [
    ["ein_fild01", "Einbroch Field", [187, 231]],
    ["ein_fild02", "Einbroch Field", [187, 211, 354]],
    ["ein_fild03", "Einbroch Field", [76, 82, 136, 273, 295, 346, 377]],
    ["ein_fild04", "Einbroch Field", [4, 67, 76, 136, 295, 346, 352, 377]],
    ["ein_fild05", "Einbroch Field", [136, 187, 351, 352, 376]],
    ["ein_fild06", "Einbroch Field", [4, 67, 76, 99, 105, 219, 252]],
    ["ein_fild07", "Einbroch Field", [3, 4, 76, 136, 261, 271, 272, 346, 354]],
    ["ein_fild08", "Einbroch Field", [3, 4, 76, 199, 214, 271, 272, 346, 347]],
    ["ein_fild09", "Einbroch Field", [3, 4, 76, 199, 202, 261, 346, 347]],
    ["ein_fild10", "Einbroch Field", [2, 4, 76, 136, 261, 307, 347]],
  ],
  // Geffenia
  22: [
    ["gefenia01", "Geffenia", [23, 25, 35, 48, 123, 144, 247, 253, 291, 296]],
    ["gefenia02", "Geffenia", [23, 25, 35, 48, 123, 144, 247, 253, 291, 296]],
    ["gefenia03", "Geffenia", [23, 25, 35, 48, 123, 144, 247, 253, 291, 296]],
    ["gefenia04", "Geffenia", [23, 25, 35, 48, 123, 144, 247, 253, 291, 296]],
  ],
  // Geffen Dungeon
  23: [
    ["gef_dun00", "Geffen Dungeon F1", [4, 68, 76, 99, 232, 267, 271, 295]],
    ["gef_dun01", "Geffen Dungeon F2", [2, 48, 85, 99, 139, 143, 170, 207, 213, 215]],
    ["gef_dun02", "Geffenia", [26, 68, 85, 143, 193, 206, 215, 232, 283]],
    ["gef_dun03", "Geffenia (Event Map)", [28, 68, 143, 190, 312, 482]],
  ],
  // Geffen Fields
  24: [
    ["gef_fild00", "Geffen Field", [2, 242, 252, 271, 272, 295]],
    ["gef_fild01", "Geffen Field", [203, 271, 295, 321]],
    ["gef_fild02", "Geffen Field", [2, 3, 50, 54, 68, 103, 161, 183, 295, 307]],
    ["gef_fild03", "Geffen Field", [50, 127, 221, 271, 295]],
    ["gef_fild04", "Geffen Field", [184, 242, 252, 272, 295, 321]],
    ["gef_fild05", "Geffen Field", [4, 119, 177, 272, 323]],
    ["gef_fild06", "Geffen Field", [68, 116, 117, 250, 271, 289]],
    ["gef_fild07", "Geffen Field", [2, 68, 184, 242, 252, 272, 295]],
    ["gef_fild08", "Geffen Field", [2, 106, 116, 117, 153, 267]],
    ["gef_fild09", "Geffen Field", [2, 3, 19, 267, 271]],
    ["gef_fild10", "Geffen Field", [2, 50, 55, 56, 271, 295, 428]],
    ["gef_fild11", "Geffen Field", [94, 99, 108, 111, 112, 113, 115, 271, 319]],
    ["gef_fild12", "Kordt Forest", [116, 117, 119, 120, 271]],
    ["gef_fild13", "Britoniah", [19, 92, 271]],
    ["gef_fild14", "West Orc Village", [49, 50, 54, 55, 221]],
  ],
  // Glast Heim
  25: [
    ["gl_cas01", "Glast Heim F1", [13, 26, 46, 47, 48, 134, 163, 174, 309]],
    ["gl_cas02", "Glast Heim F2", [13, 22, 26, 48, 66, 79, 129, 144, 291, 298, 309, 313, 314]],
    ["gl_church", "Glast Heim St. Abbey", [22, 85, 173, 298, 312]],
    ["gl_chyard", "Glast Heim Churchyard", [22, 85, 170, 175, 232, 298, 312]],
    ["gl_in01", "Inside Glast Heim", [13, 129, 163, 174, 283, 309]],
    ["gl_knt01", "Inside Glast Heim Chivalry F1", [13, 66, 83, 99, 144, 309, 313, 314]],
    ["gl_knt02", "Inside Glast Heim Chivalry F2", [13, 66, 144, 253, 291, 313, 314]],
    ["gl_prison", "Glast Heim Underprison F1", [24, 171, 232, 310]],
    ["gl_prison1", "Glast Heim Underprison F2", [24, 90, 142, 147, 232, 249, 310]],
    ["gl_step", "Glast Heim Staircase Dungeon", [28, 298, 314]],
    ["glast_01", "Glast Heim", [2, 62, 68, 144, 295]],
  ],
  // Glast Heim Dungeons
  26: [
    ["gl_dun01", "The Lowest Cave in Glast Heim F1", [5, 154]],
    ["gl_dun02", "The Lowest Cave in Glast Heim F2", [62, 107]],
    ["gl_sew01", "Glast Heim Culvert F1", [5, 26, 62]],
    ["gl_sew02", "Glast Heim Culvert F2", [62, 90]],
    ["gl_sew03", "Glast Heim Culvert F3", [62, 154]],
    ["gl_sew04", "Glast Heim Culvert F4", [8, 62, 213]],
  ],
  // Gonryun
  27: [
    ["gon_dun01", "Shrine of Kunlun Queen", [4, 76, 143, 145, 182, 227]],
    ["gon_dun02", "Hermit's Checkers", [76, 102, 145, 197, 227]],
    ["gon_dun03", "Arcadia", [101, 143, 197, 198, 318]],
    ["gon_fild01", "Kunlun Field", [68, 102, 180, 182, 271, 295, 318]],
  ],
  // Guild Dungeon [Aldebaran]
  28: [
    ["gld_dun02", "Luina Guild Dungeon", [43, 47, 84, 137, 138, 206]],
  ],
  // Guild Dungeon [Arunafeltz]
  29: [
    ["arug_dun01", "Arunafeltz Guild Dungeon", [477, 518, 519, 520, 521]],
  ],
  // Guild Dungeon [Geffen]
  30: [
    ["gld_dun04", "Britoniah Guild Dungeon", [104, 172, 173, 175, 190, 296]],
  ],
  // Guild Dungeon [Payon]
  31: [
    ["gld_dun01", "Baldur Guild Dungeon", [10, 38, 69, 81, 126, 135]],
  ],
  // Guild Dungeon [Prontera]
  32: [
    ["gld_dun03", "Valkyrie Guild Dungeon", [80, 93, 97, 281, 282, 315]],
  ],
  // Guild Dungeon [Schwartzvald]
  33: [
    ["schg_dun01", "Schwarzwald Guild Dungeon", [513, 514, 515, 516]],
  ],
  // Hidden Temple
  34: [
    ["prt_maze01", "Labyrinth Forest F1", [2, 3, 4, 15, 16, 33, 68, 76, 82, 92, 99, 103, 122, 126, 127, 143, 151, 153, 158, 161, 177, 183, 184, 232, 239, 242, 252, 271, 272, 273, 277, 289, 307, 311, 320]],
    ["prt_maze02", "Labyrinth Forest F2", [125, 239, 271, 315]],
    ["prt_maze03", "Labyrinth Forest F3", [2, 3, 4, 37, 68, 76, 84, 99, 104, 122, 126, 155, 228, 229, 232, 268, 271, 279, 289]],
  ],
  // Hugel Fields
  35: [
    ["hu_fild01", "Hugel Field", [136, 187, 403, 422, 423, 424, 425, 426]],
    ["hu_fild02", "Hugel Field", [136, 187, 376, 400, 401, 402, 403]],
    ["hu_fild03", "Hugel Field", [3, 99, 199, 271, 400, 402]],
    ["hu_fild04", "Hugel Field", [2, 76, 162, 194, 195, 250, 251, 295, 376, 400, 401, 402, 403]],
    ["hu_fild05", "Hugel Field", [300, 376, 400, 401, 402, 408]],
    ["hu_fild06", "Hugel Field", [76, 82, 271, 272, 295, 346, 377]],
    ["hu_fild07", "Hugel Field", [76, 136, 187, 194, 195, 250, 251, 376, 400, 401, 402, 403]],
  ],
  // Ice Cave
  36: [
    ["ice_dun01", "Ice Cave", [445, 448, 451, 452]],
    ["ice_dun02", "Ice Cave", [450, 451, 452, 453, 454]],
    ["ice_dun03", "Ice Cave", [450, 452, 453, 454]],
  ],
  // Juperos Dungeon
  37: [
    ["jupe_core", "Juperos Core", [383, 384, 387, 388, 390, 391, 392, 393, 394]],
    ["juperos_01", "Juperos Ruins F1", [384, 385, 387, 388, 390, 391, 392, 393]],
    ["juperos_02", "Juperos Ruins F2", [9, 384, 385, 387, 388]],
  ],
  // Kiel Dungeon
  38: [
    ["kh_dun01", "Machine doll factory, 1st floor", [13, 429, 430, 431, 432]],
    ["kh_dun02", "Machine doll factory, 2nd floor", [429, 430, 431, 432, 434]],
    ["kh_kiehl01", "Kiel Hyre's Mansion", [429, 430, 431, 432]],
  ],
  // Lighthalzen Fields
  39: [
    ["lhz_fild01", "Lighthalzen Field", [4, 76, 82, 295, 346, 377]],
    ["lhz_fild02", "Lighthalzen Field (Grim Ripper's Valley)", [76, 82, 273, 295, 346, 376, 377]],
    ["lhz_fild03", "Lighthalzen Field", [4, 82, 155, 273, 295, 346, 376, 379, 399]],
  ],
  // Louyang
  40: [
    ["lou_dun01", "The Royal Tomb", [68, 95, 99, 122, 274, 315, 335, 338]],
    ["lou_dun02", "Inside the Royal Tomb", [298, 302, 336, 337]],
    ["lou_dun03", "Suei Long Gon", [334, 336, 337, 397, 398]],
    ["lou_fild01", "Luoyang Field", [7, 76, 82, 99, 239, 289, 335]],
  ],
  // Lutie & Toy Factory
  41: [
    ["xmas_dun01", "Toy Factory Warehouse", [41, 87, 88, 181, 214, 271, 272, 278, 279, 293]],
    ["xmas_dun02", "Toy Monitoring Room", [87, 88, 98, 156, 293, 339]],
    ["xmas_fild01", "Lutie Field", [125, 225, 278, 339]],
  ],
  // Magma Dungeon
  42: [
    ["mag_dun01", "Nogg Road F1", [36, 95, 259, 308, 341]],
    ["mag_dun02", "Nogg Road F2", [77, 186, 194, 195, 216, 259]],
  ],
  // Manuk
  44: [
    ["man_fild01", "Manuk Field", [523, 526, 529, 530]],
    ["man_fild02", "Manuk Field", [527, 530, 540]],
    ["man_fild03", "Manuk Field", [526, 527, 530, 533]],
  ],
  // Morroc Fields
  45: [
    ["moc_fild01", "Sograt Desert", [14, 76, 189, 214, 238, 263, 272]],
    ["moc_fild02", "Sograt Desert", [14, 76, 214, 238, 262, 263, 295]],
    ["moc_fild03", "Sograt Desert", [27, 34, 40, 126, 196, 271, 295]],
    ["moc_fild07", "Sograt Desert", [76, 149, 214, 238, 263]],
    ["moc_fild11", "Sograt Desert", [14, 18, 68, 106, 191, 223, 236, 269, 301]],
    ["moc_fild12", "Sograt Desert", [76, 149, 214, 238, 263]],
    ["moc_fild13", "Sograt Desert", [3, 7, 76, 122, 158, 188, 214, 271]],
    ["moc_fild16", "Sograt Desert", [14, 18, 131, 191, 223, 269]],
    ["moc_fild17", "Sograt Desert", [2, 14, 76, 150, 153, 223, 256, 258, 269]],
    ["moc_fild18", "Sograt Desert", [14, 76, 153, 184, 209, 232, 301, 305]],
  ],
  // Moscovia
  46: [
    ["mosk_dun01", "Moscovia Dungeon 1", [271, 289, 484, 485]],
    ["mosk_dun02", "Moscovia Dungeon 2", [484, 485, 486, 487]],
    ["mosk_dun03", "Moscovia Dungeon 3", [68, 76, 143, 486, 487, 488, 489]],
    ["mosk_fild02", "Moscovia Field", [76, 82, 143, 239, 272, 289]],
  ],
  // Mt. Mjolnir
  47: [
    ["mjolnir_01", "Mt.Mjolnir", [2, 68, 82, 92, 103, 151, 273, 295]],
    ["mjolnir_02", "Mt.Mjolnir", [2, 4, 92, 251, 261, 270, 271, 295]],
    ["mjolnir_03", "Mt.Mjolnir", [16, 68, 92, 250, 261, 271, 289, 295]],
    ["mjolnir_04", "Mt.Mjolnir", [15, 68, 261, 270, 271, 289, 294, 295]],
    ["mjolnir_05", "Mt.Mjolnir", [2, 4, 15, 16, 68, 261, 271, 289]],
    ["mjolnir_06", "Mt.Mjolnir", [2, 3, 82, 103, 151, 271, 273]],
    ["mjolnir_07", "Mt.Mjolnir", [2, 3, 19, 103, 267, 270, 271, 273, 295]],
    ["mjolnir_08", "Mt.Mjolnir", [2, 15, 16, 271, 272, 289, 295]],
    ["mjolnir_09", "Mt.Mjolnir", [3, 33, 103, 151, 271, 273]],
    ["mjolnir_10", "Mt.Mjolnir", [16, 68, 251, 261, 271, 289, 295]],
    ["mjolnir_11", "Mt.Mjolnir", [2, 15, 200, 261, 271, 290, 295]],
    ["mjolnir_12", "Mt.Mjolnir", [155, 177, 201]],
  ],
  // Nameless Island
  48: [
    ["abbey01", "Cursed Abbey F1", [85, 472, 473, 474, 475, 476]],
    ["abbey02", "Cursed Abbey F2", [472, 474, 475, 477, 478]],
    ["abbey03", "Cursed Abbey F3", [472, 476, 477, 479]],
    ["nameless_n", "Nameless Island", [85, 472, 473, 474, 475, 476]],
  ],
  // Nidhoggr's Nest
  49: [
    ["nyd_dun01", "Yggdrasil Root Dungeon", [534, 535, 536, 537, 542, 543]],
  ],
  // Niflheim
  50: [
    ["nif_fild01", "Skellington, a Solitary Village in Niflheim", [325, 327, 328, 329, 330]],
    ["nif_fild02", "Valley of Gyoll", [324, 326, 327, 328, 329, 331]],
    ["niflheim", "Niflheim, Realm of the Dead", [324, 325, 326, 327, 328, 329, 330, 331, 332]],
  ],
  // Odins Shrine
  51: [
    ["odin_tem01", "Odin Temple F1", [2, 76, 295, 403, 422, 423, 424, 425, 426, 435, 436]],
    ["odin_tem02", "Odin Temple F2", [2, 426, 435, 436, 437, 438, 480]],
    ["odin_tem03", "Odin Temple F3", [2, 68, 426, 435, 436, 437, 438, 439, 480]],
  ],
  // Orc Dungeon
  52: [
    ["orcsdun01", "Orc Dungeon F1", [51, 52, 99, 143, 153, 213, 244]],
    ["orcsdun02", "Orc Dungeon F2", [49, 51, 99, 143, 153, 164, 213]],
  ],
  // Payon Dungeon
  53: [
    ["pay_dun00", "Payon Cave F1", [4, 99, 146, 170, 244, 271]],
    ["pay_dun01", "Payon Cave F2", [1, 4, 34, 99, 169, 213]],
    ["pay_dun02", "Payon Cave F3", [1, 4, 89, 99, 143, 169, 241, 271, 275, 290, 302]],
    ["pay_dun03", "Payon Cave F4", [2, 4, 26, 76, 83, 89, 143, 167, 196, 241, 275, 290, 295, 302]],
    ["pay_dun04", "Payon Cave F5", [1, 4, 10, 31, 68, 81, 89, 135, 143, 196, 205, 274]],
  ],
  // Payon Fields
  54: [
    ["pay_fild01", "Payon Forest", [27, 99, 160, 271, 272, 295]],
    ["pay_fild02", "Payon Forest", [3, 33, 158, 160, 271, 295]],
    ["pay_fild03", "Payon Forest", [3, 27, 252, 272, 295, 311]],
    ["pay_fild05", "Payon Forest", [208, 267, 271, 295]],
    ["pay_fild06", "Payon Forest", [3, 68, 160, 201, 271, 295, 322]],
    ["pay_fild07", "Payon Forest", [27, 34, 40, 239, 271, 295]],
    ["pay_fild08", "Payon Forest", [27, 68, 160, 252, 272, 295]],
    ["pay_fild09", "Payon Forest", [68, 161, 239, 271, 295]],
    ["pay_fild10", "Payon Forest", [2, 89, 196, 205, 267, 295]],
    ["pay_fild11", "Payon Forest", [3, 38, 89, 196, 208]],
  ],
  // Poring Island
  55: [
    ["pay_fild04", "Sograt Desert", [41, 68, 104, 214, 271, 272, 278, 279, 295, 340]],
  ],
  // Prontera Fields
  56: [
    ["prt_fild00", "Prontera Field", [68, 92, 242, 252, 270, 272, 295, 311]],
    ["prt_fild01", "Prontera Field", [2, 199, 242, 252, 272, 295, 311]],
    ["prt_fild02", "Prontera Field", [37, 68, 242, 252, 272, 290, 311]],
    ["prt_fild03", "Prontera Field", [2, 161, 183, 271, 295, 307]],
    ["prt_fild04", "Prontera Field", [92, 252, 268, 272, 295, 320]],
    ["prt_fild05", "Prontera Field", [2, 199, 202, 252, 272, 295, 311]],
    ["prt_fild06", "Prontera Field", [199, 202, 252, 272, 295, 311]],
    ["prt_fild07", "Prontera Field", [99, 268, 271, 320]],
    ["prt_fild08", "Prontera Field", [214, 252, 272, 311]],
    ["prt_fild09", "Prontera Field", [76, 121, 128, 189, 238, 263]],
    ["prt_fild10", "Prontera Field", [3, 68, 127, 128, 199, 271]],
    ["prt_fild11", "Prontera Field", [3, 94, 108, 111, 112, 113, 114, 233]],
  ],
  // Pyramid
  57: [
    ["moc_pryd01", "Inside Pyramid F1", [244, 271]],
    ["moc_pryd02", "Inside Pyramid F2", [1, 20, 169, 213, 271, 280]],
    ["moc_pryd03", "Inside Pyramid F3", [213, 266, 276, 280, 298]],
    ["moc_pryd04", "Inside Pyramid F4", [20, 42, 57, 276, 280, 298]],
    ["moc_pryd05", "Inside Pyramid B1", [266, 280, 297]],
    ["moc_pryd06", "Inside Pyramid B2", [5, 42, 266, 298, 333]],
  ],
  // Rachel Fields
  58: [
    ["ra_fild01", "Rachel Field", [96, 136, 446, 447, 448]],
    ["ra_fild02", "Rachel Field", [446, 447, 448, 449]],
    ["ra_fild03", "Rachel Field", [444, 445, 446, 447, 449]],
    ["ra_fild04", "Rachel Field", [323, 444, 445, 446, 449]],
    ["ra_fild05", "Rachel Field", [136, 379, 447]],
    ["ra_fild06", "Rachel Field", [376, 379, 447]],
    ["ra_fild07", "Rachel Field", [444, 445, 446]],
    ["ra_fild08", "Rachel Field", [214, 444, 447]],
    ["ra_fild09", "Rachel Field", [219, 346, 379, 447]],
    ["ra_fild10", "Rachel Field", [444, 445, 446]],
    ["ra_fild11", "Rachel Field", [4, 76, 214, 444, 445]],
    ["ra_fild12", "Rachel Field", [4, 76, 214, 271, 444]],
    ["ra_fild13", "Rachel Field", [214, 444, 445]],
  ],
  // Rachel Sanctuary
  59: [
    ["ra_san01", "Rachel Sanctuary F1", [395, 396, 456, 457, 458]],
    ["ra_san02", "Rachel Sanctuary F2", [395, 396, 456, 457, 458, 459]],
    ["ra_san03", "Rachel Sanctuary F3", [395, 396, 457, 459]],
    ["ra_san04", "Rachel Sanctuary F4", [457, 459, 460, 461]],
    ["ra_san05", "Rachel Sanctuary F5", [457, 458, 459, 460, 461, 462]],
  ],
  // Sphinx
  61: [
    ["in_sphinx1", "Sphinx F1", [165, 213, 276, 316]],
    ["in_sphinx2", "Sphinx F2", [165, 213, 276, 316]],
    ["in_sphinx3", "Sphinx F3", [224, 276, 288, 298]],
    ["in_sphinx4", "Sphinx F4", [224, 297, 298, 483]],
    ["in_sphinx5", "Sphinx F5", [122, 224, 245, 276, 298, 483]],
  ],
  // Splendide
  62: [
    ["spl_fild01", "Splendide Field", [524, 528, 531]],
    ["spl_fild02", "Splendide Field", [524, 525]],
    ["spl_fild03", "Splendide Field", [525, 528, 531, 532]],
  ],
  // Sunken Ship
  63: [
    ["treasure01", "Sunken Ship F1", [26, 86, 222, 241, 267]],
    ["treasure02", "Sunken Ship F2", [26, 86, 104, 129, 212, 222, 241, 265, 283, 298]],
  ],
  // Thanatos Tower
  64: [
    ["tha_t01", "Thanatos Tower F1", [13, 298, 309, 413, 424]],
    ["tha_t02", "Thanatos Tower F2", [13, 39, 298, 309, 411, 412, 414, 422]],
    ["tha_t03", "Thanatos Tower F3", [39, 298, 309, 411, 412, 415, 425]],
    ["tha_t04", "Thanatos Tower F4", [39, 46, 47, 298, 309, 411, 412, 416, 423]],
    ["tha_t05", "Thanatos Tower F5", [39, 46, 47, 411, 412, 418, 422, 423, 424, 425]],
    ["tha_t06", "Thanatos Tower F6", [39, 46, 47, 411, 412, 417, 422, 423, 424, 425]],
    ["tha_t07", "Thanatos Tower F7", [411, 412, 413, 414, 415, 416, 419]],
    ["tha_t08", "Thanatos Tower F8", [411, 412, 413, 414, 415, 416, 420]],
    ["tha_t09", "Thanatos Tower F9", [413, 414, 415, 416, 418, 423]],
    ["tha_t10", "Thanatos Tower F10", [413, 414, 415, 416, 417, 422]],
    ["tha_t11", "Thanatos Tower F11", [413, 414, 415, 416, 419, 424]],
    ["tha_t12", "Thanatos Tower F12", [413, 414, 415, 416, 420, 426]],
  ],
  // Thor's Volcano
  65: [
    ["thor_v01", "Thor's Volcano F1", [463, 465, 466, 467, 468, 469, 470]],
    ["thor_v02", "Thor's Volcano F2", [341, 463, 464, 465, 466, 468, 470]],
    ["thor_v03", "Thor's Volcano F3", [466, 467, 468, 469, 470, 471]],
  ],
  // Turtle Island
  66: [
    ["tur_dun01", "Turtle Island", [159, 178, 208, 220, 264]],
    ["tur_dun02", "Turtle Island Dungeon", [168, 220, 255, 264]],
    ["tur_dun03", "Good Turtles Village", [6, 220, 234, 255]],
    ["tur_dun04", "Turtle Palace", [6, 129, 176, 220, 234, 255]],
    ["tur_dun05", "Underground swamp zone", [6, 220, 255]],
  ],
  // Umbala Dungeon
  67: [
    ["um_dun01", "Carpenter's Shop in the Tree", [29, 30, 76, 260, 295]],
    ["um_dun02", "Passage to a Foreign World", [4, 29, 32, 68, 76, 210, 211]],
  ],
  // Umbala Fields
  68: [
    ["um_fild01", "Luluka Forest", [30, 68, 76, 155, 177, 210, 219, 295]],
    ["um_fild02", "Hoomga Forest", [4, 30, 76, 103, 177, 183, 235, 260, 261]],
    ["um_fild03", "Kalala Swamp", [2, 12, 68, 96, 208, 246, 295]],
    ["um_fild04", "Hoomga Jungle", [4, 29, 76, 183, 235, 273]],
  ],
  // Veins Fields
  69: [
    ["ve_fild01", "Veins Field", [2, 4, 68, 76, 122, 214, 301, 444, 449]],
    ["ve_fild02", "Veins Field", [4, 76, 122, 127, 444, 445, 449]],
    ["ve_fild03", "Veins Field", [4, 76, 131, 162, 444, 463]],
    ["ve_fild04", "Veins Field", [2, 76, 188, 444, 445, 448]],
    ["ve_fild05", "Veins Field", [68, 131, 143, 162, 445, 446, 447]],
    ["ve_fild06", "Veins Field", [68, 444]],
    ["ve_fild07", "Veins Field", [59, 122, 143, 240, 317, 444]],
  ],
  // Yuno Fields
  71: [
    ["yuno_fild01", "Border Posts", [2, 4, 68, 76, 91, 177, 271, 272, 295]],
    ["yuno_fild02", "Kiel Khayr's Cottage", [4, 76, 177, 232, 235, 273, 295, 323, 400, 401]],
    ["yuno_fild03", "El Mes Plateau", [2, 4, 41, 68, 76, 122, 136, 214, 271, 272, 278, 295, 340]],
    ["yuno_fild04", "El Mes Plateau", [4, 76, 121, 214, 252, 272, 279, 295]],
    ["yuno_fild05", "El Mes Plateau", [2, 4, 76, 177, 235, 273, 295, 399]],
    ["yuno_fild06", "Juno Field", [4, 76, 105, 162, 187, 295]],
    ["yuno_fild07", "El Mes Gorge (Valley of Abyss)", [4, 76, 105, 136, 211, 219, 295]],
    ["yuno_fild08", "Kiel Khayr's Academy", [4, 76, 91, 136, 177, 295, 323]],
    ["yuno_fild09", "Schwarzwald Guards Camp", [4, 76, 151, 177, 232, 235, 273, 295, 323]],
    ["yuno_fild10", "Juno Field", [136, 151, 177, 232, 235]],
    ["yuno_fild11", "Juno Field", [4, 76, 136, 162, 187, 295]],
    ["yuno_fild12", "Border Checkpoint", [136, 177, 187, 271]],
  ],
};
