// Altre informazioni (Other Info): per ogni voce di A_Kakutyou, controlli() disegna i campi in
// A_KakutyouSel e calcolo() scrive il risultato in A_KakutyouData. Le funzioni vengono da
// calcolaAltreInfo e preparaAltreInfo dell'originale, specializzate per voce con terser il
// 21/10/2026; i rami delle voci che la pagina non offre (6, 7, 8, 10, 18, 26, 38 e il calcolo
// degli homunculus per la 40) non si eseguivano mai e non ci sono piu'
// i campi di una voce stanno nel contenitore A_KakutyouSel, il risultato in A_KakutyouData.
// Un campo: tendina che ricalcola le statistiche (gestore StAllCalc, se non e' detto), o con
// valore una casella di testo senza gestore (il calcolo partiva scrivendo, onkeyup, che la
// pagina non esegue)
function campoInfo(nome, etichetta, valore, gestore) {
  return valore === undefined
    ? {
        campo: nome,
        etichetta: etichetta,
        gestore:
          gestore ||
          function () {
            StAllCalc();
          },
      }
    : {
        campo: nome,
        tipo: "testo",
        etichetta: etichetta,
        valore: valore,
      };
}
var NON_DISPONIBILE = '<p class="center">Not available for this class.</p>';
// una voce che la classe non ha: nessun campo, e l'avviso subito (anche se il calcolo si ferma)
function nonDisponibile() {
  contenitore("A_KakutyouSel");
  scrivi("A_KakutyouData", NON_DISPONIBILE);
}
var ALTRE_INFO = {
  // nessuna voce
  0: {
    controlli: function () {
      contenitore("A_KakutyouSel");
    },
    calcolo: function () {
      scrivi("A_KakutyouData", "");
    },
  },
  // Heal amount
  2: {
    controlli: function () {
      contenitore("A_KakutyouSel");
    },
    calcolo: function () {
      var Heal = [],
        Heal2 = [];
      r =
        "<table><tr><td></td><td class=title>Heal on yourself</td><td class=title>Heal on other player</td></tr>";
      for (o = 0; o <= 10; o++) {
        Heal[o] = HealCalc(o, 1);
        Heal2[o] = HealCalc(o, 0);
      }
      if (
        n_A_JobClass() == 3 ||
        n_A_JOB == 13 ||
        n_A_JOB == 14 ||
        n_A_JOB == 20 ||
        n_A_JOB == 27 ||
        n_A_JOB == 28
      ) {
        r +=
          "<tr><td><b>Heal Level 1</b></td><td class=center>" +
          Heal[1] +
          "</td><td class=center>" +
          Heal2[1] +
          "</td></tr>";
        r +=
          "<tr><td><b>Heal Level 2</b></td><td class=center>" +
          Heal[2] +
          "</td><td class=center>" +
          Heal2[2] +
          "</td></tr>";
        r +=
          "<tr><td><b>Heal Level 3</b></td><td class=center>" +
          Heal[3] +
          "</td><td class=center>" +
          Heal2[3] +
          "</td></tr>";
        r +=
          "<tr><td><b>Heal Level 4</b></td><td class=center>" +
          Heal[4] +
          "</td><td class=center>" +
          Heal2[4] +
          "</td></tr>";
        r +=
          "<tr><td><b>Heal Level 5</b></td><td class=center>" +
          Heal[5] +
          "</td><td class=center>" +
          Heal2[5] +
          "</td></tr>";
        r +=
          "<tr><td><b>Heal Level 6</b></td><td class=center>" +
          Heal[6] +
          "</td><td class=center>" +
          Heal2[6] +
          "</td></tr>";
        r +=
          "<tr><td><b>Heal Level 7</b></td><td class=center>" +
          Heal[7] +
          "</td><td class=center>" +
          Heal2[7] +
          "</td></tr>";
        r +=
          "<tr><td><b>Heal Level 8</b></td><td class=center>" +
          Heal[8] +
          "</td><td class=center>" +
          Heal2[8] +
          "</td></tr>";
        r +=
          "<tr><td><b>Heal Level 9</b></td><td class=center>" +
          Heal[9] +
          "</td><td class=center>" +
          Heal2[9] +
          "</td></tr>";
        r +=
          "<tr><td><b>Heal Level 10</b></td><td class=center>" +
          Heal[10] +
          "</td><td class=center>" +
          Heal2[10] +
          "</td></tr></table>";
      } else {
        r +=
          "<tr><td><b>Heal Level 1 [Vitata Card]</b></td><td class=center>" +
          Heal[1] +
          "</td><td class=center>" +
          Heal2[1] +
          "</td></tr>";
        r +=
          "<tr><td><b>Heal Level 2</b></td><td class=center>" +
          Heal[2] +
          "</td><td class=center>" +
          Heal2[2] +
          "</td></tr>";
        r +=
          "<tr><td><b>Heal Level 3</b></td><td class=center>" +
          Heal[3] +
          "</td><td class=center>" +
          Heal2[3] +
          "</td></tr>";
        r +=
          "<tr><td><b>Heal Level 4</b></td><td class=center>" +
          Heal[4] +
          "</td><td class=center>" +
          Heal2[4] +
          "</td></tr>";
        r +=
          "<tr><td><b>Heal Level 5 [Scroll]</b></td><td class=center>" +
          Heal[5] +
          "</td><td class=center>" +
          Heal2[5] +
          "</td></tr></table>";
      }
      r +=
        "<BR><B>Heal Boost:</B> " +
        (Math.floor(
          (1 + (bonusValues[91] + bonusValues[99]) / 100) *
            (1 + 0.02 * SkillSearch(SKILLID.MEDIATIO)) *
            100,
        ) -
          100) +
        "%";
      r += "<br><b>Required Int/Lvl for next bonus:</b> +" + (8 - ((n_A_BaseLV + n_A_INT) % 8));
      scrivi("A_KakutyouData", r);
      var r;
      var o;
    },
  },
  // Sanctuary amount
  4: {
    controlli: function () {
      contenitore("A_KakutyouSel");
    },
    calcolo: function () {
      if (n_A_JOB == 9 || n_A_JOB == 14 || n_A_JOB == 23 || n_A_JOB == 28) {
        Sanctuary = new Array();
        Sanctuary2 = new Array();
        for (o = 0; o <= 10; o++) {
          Sanctuary[o] = SanctuaryCalc(o, 1);
          Sanctuary2[o] = SanctuaryCalc(o, 0);
        }
        r =
          "<table><tr><td></td><td class=title>Sanctuary on yourself</td><td class=title>Sanctuary on other player</td></tr>";
        r +=
          "<tr><td><b>Sanctuary Level 1</b></td><td class=center>" +
          Sanctuary[1] +
          " x 4 = " +
          4 * Sanctuary[1] +
          "</td><td class=center>" +
          Sanctuary2[1] +
          " x 4 = " +
          4 * Sanctuary2[1] +
          "</td></tr>";
        r +=
          "<tr><td><b>Sanctuary Level 2</b></td><td class=center>" +
          Sanctuary[2] +
          " x 5 = " +
          5 * Sanctuary[2] +
          "</td><td class=center>" +
          Sanctuary2[2] +
          " x 5 = " +
          5 * Sanctuary2[2] +
          "</td></tr>";
        r +=
          "<tr><td><b>Sanctuary Level 3</b></td><td class=center>" +
          Sanctuary[3] +
          " x 6 = " +
          6 * Sanctuary[3] +
          "</td><td class=center>" +
          Sanctuary2[3] +
          " x 6 = " +
          6 * Sanctuary2[3] +
          "</td></tr>";
        r +=
          "<tr><td><b>Sanctuary Level 4</b></td><td class=center>" +
          Sanctuary[4] +
          " x 7 = " +
          7 * Sanctuary[4] +
          "</td><td class=center>" +
          Sanctuary2[4] +
          " x 7 = " +
          7 * Sanctuary2[4] +
          "</td></tr>";
        r +=
          "<tr><td><b>Sanctuary Level 5</b></td><td class=center>" +
          Sanctuary[5] +
          " x 8 = " +
          8 * Sanctuary[5] +
          "</td><td class=center>" +
          Sanctuary2[5] +
          " x 8 = " +
          8 * Sanctuary2[5] +
          "</td></tr>";
        r +=
          "<tr><td><b>Sanctuary Level 6</b></td><td class=center>" +
          Sanctuary[6] +
          " x 9 = " +
          9 * Sanctuary[6] +
          "</td><td class=center>" +
          Sanctuary2[6] +
          " x 9 = " +
          9 * Sanctuary2[6] +
          "</td></tr>";
        r +=
          "<tr><td><b>Sanctuary Level 7</b></td><td class=center>" +
          Sanctuary[7] +
          " x 10 = " +
          10 * Sanctuary[7] +
          "</td><td class=center>" +
          Sanctuary2[7] +
          " x 10 = " +
          10 * Sanctuary2[7] +
          "</td></tr>";
        r +=
          "<tr><td><b>Sanctuary Level 8</b></td><td class=center>" +
          Sanctuary[8] +
          " x 11 = " +
          11 * Sanctuary[8] +
          "</td><td class=center>" +
          Sanctuary2[8] +
          " x 11 = " +
          11 * Sanctuary2[8] +
          "</td></tr>";
        r +=
          "<tr><td><b>Sanctuary Level 9</b></td><td class=center>" +
          Sanctuary[9] +
          " x 12 = " +
          12 * Sanctuary[9] +
          "</td><td class=center>" +
          Sanctuary2[9] +
          " x 12 = " +
          12 * Sanctuary2[9] +
          "</td></tr>";
        r +=
          "<tr><td><b>Sanctuary Level 10</b></td><td class=center>" +
          Sanctuary[10] +
          " x 13 = " +
          13 * Sanctuary[10] +
          "</td><td class=center>" +
          Sanctuary2[10] +
          " x 13 = " +
          13 * Sanctuary2[10] +
          "</td></tr></table>";
        r += "<BR><B>Heal Boost:</B> " + (1 * bonusValues[94] + 1 * bonusValues[99]) + "%";
      } else r = NON_DISPONIBILE;
      scrivi("A_KakutyouData", r);
      var r;
      var o;
    },
  },
  // Player Resistance
  12: {
    controlli: function () {
      contenitore("A_KakutyouSel");
    },
    calcolo: function () {
      var r;
      var f = new Array();
      f[0] = Math.floor((100 * (3 + n_A_VIT)) / 100);
      f[1] = f[0];
      f[2] = Math.floor((100 * (3 + n_A_MDEF)) / 100);
      f[3] = Math.floor((100 * (3 + n_A_LUK)) / 100);
      f[4] = Math.floor((100 * (3 + (n_A_INT + n_A_VIT) / 2)) / 100);
      f[5] = Math.floor((100 * (3 + n_A_INT)) / 100);
      f[6] = f[0];
      f[7] = Math.floor((100 * (3 + (n_A_STR + n_A_INT) / 2)) / 100);
      f[8] = f[0];
      f[9] = Math.floor(100 * n_A_MDEF) / 100;
      if (n_A_LUK < 1) f[3] = 100;
      if (n_A_VIT >= 100) f[3] = 100;
      if (n_A_Bodyelement == 9) {
        f[2] = 100;
        f[8] = 100;
        f[9] = 100;
      }
      for (var o = 0; o <= 9; o++) {
        f[o] += Math.floor((100 - f[o]) * bonusValues[150 + o]) / 100;
        f[o] = Math.floor(100 * f[o]) / 100;
        if (f[o] > 100) f[o] = 100;
        if (f[o] < 0) f[o] = 0;
      }
      var g = [
          0.75 * n_A_VIT,
          n_A_VIT,
          n_A_MDEF,
          n_A_VIT,
          (n_A_VIT + n_A_INT) / 2,
          n_A_INT,
          n_A_VIT,
          (n_A_STR + n_A_INT) / 2,
          n_A_VIT,
          0,
        ],
        J = [
          n_A_LUK / 10,
          n_A_LUK / 100,
          0,
          n_A_LUK / 100,
          n_A_LUK / 100,
          n_A_LUK / 100,
          n_A_LUK / 100,
          n_A_LUK / 100,
          n_A_LUK / 100,
          0,
        ],
        L = new Array();
      for (o = 0; o <= 8; o++) {
        g[o] = Math.min(100, Math.floor(g[o] * 100) / 100);
        J[o] = Math.floor(J[o] * 100) / 100;
        var V = Math.max(1, 1000 - Math.floor((1000 * g[o]) / 100) - 1000 * J[o]),
          G = Math.floor(V) / 1000,
          Y = Math.floor(((1000 - V) / 10) * 100) / 100;
        L[o] = " <small>(duration " + G + "s, -" + Y + "%)</small>";
      }
      L[9] = " <small>(duration 1s, -0%)</small>";
      r = "<table>";
      r +=
        "<tr><td class='right'><b>" +
        (100 - n_A_element[0]) +
        "</b> % vs</td><td class='data'>" +
        v_Element[0] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        bonusValues[50] +
        "</b> % vs</td><td class='data'>" +
        v_Race[0] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        f[0] +
        "</b> % vs</td><td><b>" +
        v_Effect[0] +
        "</b>" +
        L[0] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>" +
        (100 - n_A_element[1]) +
        "</b> % vs</td><td class='data'>" +
        v_Element[1] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        bonusValues[51] +
        "</b> % vs</td><td class='data'>" +
        v_Race[1] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        f[1] +
        "</b> % vs</td><td><b>" +
        v_Effect[1] +
        "</b>" +
        L[1] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>" +
        (100 - n_A_element[2]) +
        "</b> % vs</td><td class='data'>" +
        v_Element[2] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        bonusValues[52] +
        "</b> % vs</td><td class='data'>" +
        v_Race[2] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        f[2] +
        "</b> % vs</td><td><b>" +
        v_Effect[2] +
        "</b>" +
        L[2] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>" +
        (100 - n_A_element[3]) +
        "</b> % vs</td><td class='data'>" +
        v_Element[3] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        bonusValues[53] +
        "</b> % vs</td><td class='data'>" +
        v_Race[3] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        f[3] +
        "</b> % vs</td><td><b>" +
        v_Effect[3] +
        "</b>" +
        L[3] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>" +
        (100 - n_A_element[4]) +
        "</b> % vs</td><td class='data'>" +
        v_Element[4] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        bonusValues[54] +
        "</b> % vs</td><td class='data'>" +
        v_Race[4] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        f[4] +
        "</b> % vs</td><td><b>" +
        v_Effect[4] +
        "</b>" +
        L[4] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>" +
        (100 - n_A_element[5]) +
        "</b> % vs</td><td class='data'>" +
        v_Element[5] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        bonusValues[55] +
        "</b> % vs</td><td class='data'>" +
        v_Race[5] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        f[5] +
        "</b> % vs</td><td><b>" +
        v_Effect[5] +
        "</b>" +
        L[5] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>" +
        (100 - n_A_element[6]) +
        "</b> % vs</td><td class='data'>" +
        v_Element[6] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        bonusValues[56] +
        "</b> % vs</td><td class='data'>" +
        v_Race[6] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        f[6] +
        "</b> % vs</td><td><b>" +
        v_Effect[6] +
        "</b>" +
        L[6] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>" +
        (100 - n_A_element[7]) +
        "</b> % vs</td><td class='data'>" +
        v_Element[7] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        bonusValues[57] +
        "</b> % vs</td><td class='data'>" +
        v_Race[7] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        f[7] +
        "</b> % vs</td><td><b>" +
        v_Effect[7] +
        "</b>" +
        L[7] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>" +
        (100 - n_A_element[8]) +
        "</b> % vs</td><td class='data'>" +
        v_Element[8] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        bonusValues[58] +
        "</b> % vs</td><td class='data'>" +
        v_Race[8] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        f[8] +
        "</b> % vs</td><td><b>" +
        v_Effect[8] +
        "</b>" +
        L[8] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>" +
        (100 - n_A_element[9]) +
        "</b> % vs</td><td class='data'>" +
        v_Element[9] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        bonusValues[59] +
        "</b> % vs</td><td class='data'>" +
        v_Race[9] +
        "</td>";
      r +=
        "<td class='right'><b>" +
        f[9] +
        "</b> % vs</td><td><b>" +
        v_Effect[9] +
        "</b>" +
        L[9] +
        "</td></tr>";
      r +=
        "<tr><td colspan='6' class='center'>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</td></tr></table>";
      r +=
        "<small>Displayed duration assumes a 1s base duration. Freeze is additionally extended by 0.01s per point of caster LUK.</small>";
      r += "<table>";
      r +=
        "<tr><td class='right'><b>" +
        bonusValues[190] +
        "</b> % vs</td><td class='data'><b>Small size</b></td>";
      r +=
        "<td class='right'><b>" +
        bonusValues[77] +
        "</b> % vs</td><td><b>Boss monsters</b></td></tr>";
      r +=
        "<tr><td class='right'><b>" +
        bonusValues[191] +
        "</b> % vs</td><td class='data'><b>Medium size</b></td>";
      r +=
        "<td class='right'><b>" +
        bonusValues[79] +
        "</b> % vs</td><td><b>Normal monsters</b></td></tr>";
      r +=
        "<tr><td class='right'><b>" +
        bonusValues[192] +
        "</b> % vs</td><td class='data'><b>Large size</b></td>";
      r +=
        "<td class='right'><b>" +
        bonusValues[78] +
        "</b> % vs</td><td><b>Long-range attacks</b></td></tr>";
      r += "</table>";
      scrivi("A_KakutyouData", r);
    },
  },
  // +% ATK based Damage Modifiers
  14: {
    controlli: function () {
      var ricalcola = function () {
        calc();
      };
      contenitore("A_KakutyouSel", [
        {
          riga: [
            "Target",
            campoInfo("R_OBJ"),
            campoInfo("S_OBJ"),
            campoInfo("E_OBJ", "", undefined, ricalcola),
            campoInfo("B_OBJ", "", undefined, ricalcola),
            campoInfo("SP_OBJ", "", undefined, ricalcola),
          ],
        },
      ]);
      opzioni(
        c.R_OBJ,
        serie(0, v_Race_.length - 1, function (i) {
          return [i, v_Race_[i]];
        }),
      );
      c.R_OBJ.value = 0;
      opzioni(
        c.S_OBJ,
        serie(0, v_Size.length - 1, function (i) {
          return [i, v_Size[i]];
        }),
      );
      c.S_OBJ.value = 0;
      opzioni(
        c.E_OBJ,
        serie(0, v_Element_.length - 1, function (i) {
          return [i, v_Element_[i]];
        }),
      );
      c.E_OBJ.value = 0;
      opzioni(
        c.B_OBJ,
        serie(0, v_Type.length - 1, function (i) {
          return [i, v_Type[i]];
        }),
      );
      c.B_OBJ.value = 0;
      opzioni(
        c.SP_OBJ,
        serie(0, v_Race2.length - 1, function (i) {
          return [i, v_Race2[i]];
        }),
      );
      c.SP_OBJ.value = 0;
    },
    calcolo: function () {
      var r;
      var o;
      F_MOD = 0;
      G_MOD = bonusValues[80];
      B_MOD = bonusValues[80] + bonusValues[BONUSID.PHYSICAL_BOSS_DMG_PERCENT];
      SM_MOD = 0;
      for (o = 0; o <= 7; o++) if (n_A_card[o] == 244) G_MOD += 40;
      if (EquipNumSearch(EQUIPID.DIABOLUS_MANTEAU)) SM_MOD += 10;
      if (n_A_Equip[9] == 844 || n_A_Equip[9] == 1753) SM_MOD += 10;
      if (n_A_Equip[10] == 844 || n_A_Equip[10] == 1753) SM_MOD += 10;
      for (o = 0; o < 8; o += 2) if (n_A_Buf9[o] == 29) SM_MOD += n_A_Buf9[o + 1];
      for (o = 0; o < 8; o += 2) if (n_A_Buf9[o] == 26) G_MOD += n_A_Buf9[o + 1];
      F_M1 = 1 * c.R_OBJ.value;
      F_M2 = 1 * c.S_OBJ.value;
      F_M3 = 1 * c.E_OBJ.value;
      F_M4 = 1 * c.B_OBJ.value;
      F_M5 = 1 * c.SP_OBJ.value;
      switch (F_M1) {
        case 0:
          F_M1 = bonusValues[30];
          break;
        case 1:
          F_M1 = bonusValues[31];
          break;
        case 2:
          F_M1 = bonusValues[32];
          break;
        case 3:
          F_M1 = bonusValues[33];
          break;
        case 4:
          F_M1 = bonusValues[34];
          break;
        case 5:
          F_M1 = bonusValues[35];
          break;
        case 6:
          F_M1 = bonusValues[36];
          break;
        case 7:
          F_M1 = bonusValues[37];
          break;
        case 8:
          F_M1 = bonusValues[38];
          break;
        case 9:
          F_M1 = bonusValues[39];
          break;
      }
      switch (F_M2) {
        case 0:
          F_M2 = bonusValues[27];
          break;
        case 1:
          F_M2 = bonusValues[28];
          break;
        case 2:
          F_M2 = bonusValues[29];
          break;
      }
      switch (F_M3) {
        case 0:
          F_M3 = bonusValues[40];
          break;
        case 1:
          F_M3 = bonusValues[41];
          break;
        case 2:
          F_M3 = bonusValues[42];
          break;
        case 3:
          F_M3 = bonusValues[43];
          break;
        case 4:
          F_M3 = bonusValues[44];
          break;
        case 5:
          F_M3 = bonusValues[45];
          break;
        case 6:
          F_M3 = bonusValues[46];
          break;
        case 7:
          F_M3 = bonusValues[47];
          break;
        case 8:
          F_M3 = bonusValues[48];
          break;
        case 9:
          F_M3 = bonusValues[49];
          break;
      }
      switch (F_M4) {
        case 0:
          F_M4 = bonusValues[80];
          break;
        case 1:
          F_M4 = B_MOD;
          break;
      }
      switch (F_M5) {
        case 0:
          F_M5 = 0;
          break;
        case 1:
          F_M5 = bonusValues[81];
          break;
        case 2:
          F_M5 = bonusValues[84];
          break;
        case 3:
          F_M5 = G_MOD;
          break;
        case 4:
          F_M5 = bonusValues[82];
          break;
        case 5:
          F_M5 = bonusValues[83];
          break;
        case 6:
          F_M5 = SM_MOD;
          break;
      }
      F_M1 = 1 + F_M1 / 100;
      F_M2 = 1 + F_M2 / 100;
      F_M3 = 1 + F_M3 / 100;
      F_M4 = 1 + F_M4 / 100;
      F_M5 = 1 + F_M5 / 100;
      F_M6 = 1 + bonusValues[25] / 100;
      F_M7 = 1 + bonusValues[70] / 100;
      F_MOD = Math.round(F_M1 * F_M2 * F_M3 * F_M4 * F_M5 * 100);
      F_MOD2 = Math.round(F_M1 * F_M2 * F_M3 * F_M4 * F_M5 * F_M6 * 100);
      F_MOD3 = Math.round(F_M1 * F_M2 * F_M3 * F_M4 * F_M5 * F_M7 * 100);
      F_MOD4 = Math.round(F_M1 * F_M2 * F_M3 * F_M4 * F_M5 * F_M6 * F_M7 * 100);
      r = "<table>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[40] +
        "</b>%</td><td class='data'>vs " +
        v_Element[0] +
        "</td>";
      r +=
        "<td class='right'><b>+" +
        bonusValues[30] +
        "</b>%</td><td class='data'>vs " +
        v_Race[0] +
        "</td>";
      r += "<td class='right'><b>+" + bonusValues[81] + "</b>%</td><td>vs <b>Goblin</b></td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[41] +
        "</b>%</td><td class='data'>vs " +
        v_Element[1] +
        "</td>";
      r +=
        "<td class='right'><b>+" +
        bonusValues[31] +
        "</b>%</td><td class='data'>vs " +
        v_Race[1] +
        "</td>";
      r += "<td class='right'><b>+" + bonusValues[84] + "</b>%</td><td>vs <b>Golem</b></td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[42] +
        "</b>%</td><td class='data'>vs " +
        v_Element[2] +
        "</td>";
      r +=
        "<td class='right'><b>+" +
        bonusValues[32] +
        "</b>%</td><td class='data'>vs " +
        v_Race[2] +
        "</td>";
      r += "<td class='right'><b>+" + bonusValues[82] + "</b>%</td><td>vs <b>Kobold</b></td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[43] +
        "</b>%</td><td class='data'>vs " +
        v_Element[3] +
        "</td>";
      r +=
        "<td class='right'><b>+" +
        bonusValues[33] +
        "</b>%</td><td class='data'>vs " +
        v_Race[3] +
        "</td>";
      r += "<td class='right'><b>+" + bonusValues[83] + "</b>%</td><td>vs <b>Orc</b></td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[44] +
        "</b>%</td><td class='data'>vs " +
        v_Element[4] +
        "</td>";
      r +=
        "<td class='right'><b>+" +
        bonusValues[34] +
        "</b>%</td><td class='data'>vs " +
        v_Race[4] +
        "</td>";
      r += "<td class='right'><b>+" + SM_MOD + "</b>%</td><td>vs <b>Satan Morroc</b></td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[45] +
        "</b>%</td><td class='data'>vs " +
        v_Element[5] +
        "</td>";
      r +=
        "<td class='right'><b>+" +
        bonusValues[35] +
        "</b>%</td><td class='data'>vs " +
        v_Race[5] +
        "</td>";
      r += "<td class='right'><b>+" + G_MOD + "</b>%</td><td>vs <b>Guardian</b></td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[46] +
        "</b>%</td><td class='data'>vs " +
        v_Element[6] +
        "</td>";
      r +=
        "<td class='right'><b>+" +
        bonusValues[36] +
        "</b>%</td><td class='data'>vs " +
        v_Race[6] +
        "</td>";
      r += "<td class='right'><b>+" + bonusValues[80] + "</b>%</td><td>vs <b>Normal</b></td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[47] +
        "</b>%</td><td class='data'>vs " +
        v_Element[7] +
        "</td>";
      r +=
        "<td class='right'><b>+" +
        bonusValues[37] +
        "</b>%</td><td class='data'>vs " +
        v_Race[7] +
        "</td>";
      r += "<td class='right'><b>+" + B_MOD + "</b>%</td><td>vs <b>Boss</b></td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[48] +
        "</b>%</td><td class='data'>vs " +
        v_Element[8] +
        "</td>";
      r +=
        "<td class='right'><b>+" +
        bonusValues[38] +
        "</b>%</td><td class='data'>vs " +
        v_Race[8] +
        "</td>";
      r +=
        "<td class='right'><b>+" +
        bonusValues[25] +
        "</b>%</td><td><b>long-range dmg</b></td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[49] +
        "</b>%</td><td class='data'>vs " +
        v_Element[9] +
        "</td>";
      r +=
        "<td class='right'><b>+" +
        bonusValues[39] +
        "</b>%</td><td class='data'>vs " +
        v_Race[9] +
        "</td>";
      r +=
        "<td class='right'><b>+" +
        bonusValues[70] +
        "</b>%</td><td><b>critical damage</b></td></tr>";
      r +=
        "<tr><td colspan='6' class='center'>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</td></tr></table>";
      r += "<table>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[27] +
        "</b>% vs</td><td class='data'><b>Small</b></td>";
      r +=
        "<td class='right'><b>+" +
        bonusValues[28] +
        "</b>% vs</td><td class='data'><b>Medium</b></td>";
      r += "<td class='right'><b>+" + bonusValues[29] + "</b>% vs</td><td><b>Large</b></td></tr>";
      r += "</table>";
      r += "<hr><table>";
      r +=
        "<tr><td><b>Final non-critical melee ATK based damage modifier: </b>" +
        F_MOD +
        " %</td></tr>";
      r +=
        "<tr><td><b>Final non-critical long-range ATK based damage modifier: </b>" +
        F_MOD2 +
        " %</td></tr>";
      r +=
        "<tr><td><b>Final critical melee ATK based damage modifier: </b>" + F_MOD3 + " %</td></tr>";
      r +=
        "<tr><td><b>Final critical long-range ATK based damage modifier: </b>" +
        F_MOD4 +
        " %</td></tr>";
      r += "</table>";
      scrivi("A_KakutyouData", r);
    },
  },
  // +% MATK based Damage Modifiers
  16: {
    controlli: function () {
      contenitore("A_KakutyouSel");
    },
    calcolo: function () {
      var r;
      r = "<table>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[170] +
        "</b> % vs</td><td>" +
        v_Race[0] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[171] +
        "</b> % vs</td><td>" +
        v_Race[1] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[172] +
        "</b> % vs</td><td>" +
        v_Race[2] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[173] +
        "</b> % vs</td><td>" +
        v_Race[3] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[174] +
        "</b> % vs</td><td>" +
        v_Race[4] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[175] +
        "</b> % vs</td><td>" +
        v_Race[5] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[176] +
        "</b> % vs</td><td>" +
        v_Race[6] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[177] +
        "</b> % vs</td><td>" +
        v_Race[7] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[178] +
        "</b> % vs</td><td>" +
        v_Race[8] +
        "</td></tr>";
      r +=
        "<tr><td class='right'><b>+" +
        bonusValues[179] +
        "</b> % vs</td><td>" +
        v_Race[9] +
        "</td></tr>";
      r += "</table>";
      scrivi("A_KakutyouData", r);
    },
  },
  // Experience
  20: {
    controlli: function () {
      contenitore("A_KakutyouSel", [
        campoInfo("A_KakutyouSelNum", "Current Base Exp (%)", "0"),
        campoInfo("A_KakutyouSelNum2", "Current Job Exp (%)", "0"),
      ]);
    },
    calcolo: function () {
      var r;
      var o;
      var F = 1 * c.A_KakutyouSelNum.value,
        O = 1 * c.A_KakutyouSelNum2.value;
      if (!(0 <= F) || !(F < 100)) {
        F = 0;
        c.A_KakutyouSelNum.value = 0;
      }
      if (!(0 <= O) || !(O < 100)) {
        O = 0;
        c.A_KakutyouSelNum2.value = 0;
      }
      var H = 0;
      if (n_A_JOB == 0 && n_Reborn) H = 1;
      if ((1 <= n_A_JOB && n_A_JOB <= 6) || n_A_JOB == 41 || n_A_JOB == 20) {
        H = 2;
        if (n_Reborn) H = 3;
      }
      if ((7 <= n_A_JOB && n_A_JOB <= 19) || n_A_JOB == 43) H = 4;
      if (21 <= n_A_JOB && n_A_JOB <= 33) H = 5;
      if (n_A_JOB == 42) H = 7;
      if (n_A_JOB == 44 || n_A_JOB == 45) H = 6;
      F = Math.floor((PC_BaseExp[n_Reborn][n_A_BaseLV] * F) / 100);
      r =
        "Required BaseExp for Base Up: <B>" +
        Kanma(PC_BaseExp[n_Reborn][n_A_BaseLV] - F) +
        " </B>exp<BR>";
      var R = 0,
        q = 0;
      if (targetData[16] != 0) {
        for (o = n_A_BaseLV; o < 99; o++) {
          var M = PC_BaseExp[n_Reborn][o];
          R += N = Math.floor((M - F) / targetData[16]);
          for (F += N * targetData[16]; F < M;) {
            F += targetData[16];
            R += 1;
          }
          if (q == 0) {
            q = 1;
            r +=
              "(Equals <B>" +
              Kanma(R) +
              "</B> " +
              targetData[1] +
              " kill" +
              (Kanma(R) != 1 ? "s" : "") +
              ")<BR>";
          }
          if ((F -= M) > M - 1) F = M - 1;
        }
        r +=
          "Until Base Lvl 99: <B>" +
          Kanma(R) +
          "</B> more " +
          targetData[1] +
          " kill" +
          (Kanma(R) != 1 ? "s" : "") +
          "<BR><BR>";
      }
      O = Math.floor((PC_JobExp[H][n_A_JobLV] * O) / 100);
      if (((1 <= n_A_JOB && n_A_JOB <= 6) || n_A_JOB == 41) && n_A_JobLV == 50) O = 0;
      r += "Required JobExp for Job Up: <B>" + Kanma(PC_JobExp[H][n_A_JobLV] - O) + "</B> exp<BR>";
      R = 0;
      q = 0;
      if (targetData[17] != 0) {
        for (o = 1; PC_JobExp[H][o] != 0; o++);
        var K = o;
        if ((1 <= n_A_JOB && n_A_JOB <= 6) || n_A_JOB == 41) K = 50;
        for (o = n_A_JobLV; o < K; o++) {
          var N;
          M = PC_JobExp[H][o];
          R += N = Math.floor((M - O) / targetData[17]);
          for (O += N * targetData[17]; O < M;) {
            O += targetData[17];
            R += 1;
          }
          if (q == 0) {
            q = 1;
            r +=
              "(Equals <B>" +
              Kanma(R) +
              "</B> " +
              targetData[1] +
              " kill" +
              (Kanma(R) != 1 ? "s" : "") +
              ")<BR>";
          }
          if ((O -= M) > M - 1) O = M - 1;
        }
        r +=
          "Until JobLvl " +
          K +
          ": <B>" +
          Kanma(R) +
          "</B> more " +
          targetData[1] +
          " kill" +
          (Kanma(R) != 1 ? "s" : "") +
          "<BR>";
      }
      scrivi("A_KakutyouData", r);
    },
  },
  // Potion Pitcher HP/SP power
  22: {
    controlli: function () {
      if (n_A_JOB != 19 && n_A_JOB != 33) nonDisponibile();
      else {
        contenitore(
          "A_KakutyouSel",
          (n_A_JOB == 33 ? [campoInfo("SPP", "Slim Potion Pitcher")] : []).concat([
            campoInfo("PP", "Potion Pitcher"),
            campoInfo("POT_RLevel", "Learning Potion"),
            campoInfo("RNK_BNS", "Ranked"),
            campoInfo("SL_LV", "Soul Linker Lvl"),
            campoInfo("E_VIT", "Target's VIT"),
            campoInfo("E_INT", "Target's INT"),
            campoInfo("ISP", "Increase SP Recovery"),
            campoInfo("IRP", "Increase HP Recovery"),
          ]),
        );
        opzioni(
          c.PP,
          serie(0, Potion_Max_2 - 1, function (i) {
            return [i, m_Potion2[i][3]];
          }),
        );
        c.PP.value = 0;
        if (n_A_JOB == 33) {
          opzioni(
            c.SPP,
            serie(0, Potion_Max_3 - 1, function (i) {
              return [i, m_Potion3[i][3]];
            }),
          );
          c.SPP.value = 0;
        }
        opzioni(c.POT_RLevel, numeri(0, 10));
        c.POT_RLevel.value = 0;
        opzioni(
          c.RNK_BNS,
          serie(0, 1, function (i) {
            return [i, Pot_Rank[i][1]];
          }),
        );
        c.RNK_BNS.value = 0;
        opzioni(c.E_VIT, numeri(0, 200));
        c.E_VIT.value = 0;
        opzioni(c.E_INT, numeri(0, 200));
        c.E_INT.value = 0;
        opzioni(c.SL_LV, numeri(0, 99));
        c.SL_LV.value = 0;
        opzioni(c.ISP, numeri(0, 10));
        c.ISP.value = 0;
        opzioni(c.IRP, numeri(0, 10));
        c.IRP.value = 0;
      }
    },
    calcolo: function () {
      var o;
      H_Bonus = 1;
      H_Bonus2 = 1;
      H_Bonus3 = 1;
      if (n_A_JOB == 19 || n_A_JOB == 33) {
        slv = 1 * c.SL_LV.value;
        evit = 1 * c.E_VIT.value;
        eint = 1 * c.E_INT.value;
        potr = 1 * c.POT_RLevel.value;
        isp = 1 * c.ISP.value;
        irp = 1 * c.IRP.value;
        rank_bonus = 1 * c.RNK_BNS.value;
        pot1 = 1 * c.PP.value;
        prate1 = m_Potion2[pot1][1];
        prate2 = m_Potion2[pot1][2];
        if (rank_bonus == 1) prate1 *= 1.5;
        if (rank_bonus == 1) prate2 *= 1.5;
        if (n_A_JOB == 33) {
          pot2 = 1 * c.SPP.value;
          prate3 = m_Potion3[pot2][1];
          prate4 = m_Potion3[pot2][2];
        }
        if (EquipNumSearch(EQUIPID.FRICCOS_SHOES)) H_Bonus2 += 0.2;
        if (EquipNumSearch(EQUIPID.VITAL_TREE_SHOES)) H_Bonus3 += 0.05;
        for (o = 8; o < 12; o++) if (n_A_Buf8[o] == 10 && EquipNumSearch(1000)) H_Bonus += 0.2;
        for (o = 8; o <= 9; o++) {
          if (n_A_card[o] == 332) H_Bonus += 0.3;
          if (n_A_card[o] == 513) H_Bonus += 0.03;
        }
        if (n_A_Equip[9] == 844 || n_A_Equip[9] == 1753) H_Bonus += 0.05;
        if (n_A_Equip[10] == 844 || n_A_Equip[10] == 1753) H_Bonus += 0.05;
        if (n_A_Equip[9] == 1111) H_Bonus += 0.05;
        if (n_A_Equip[10] == 1111) H_Bonus += 0.05;
        if (EquipNumSearch(EQUIPID.ERDE)) H_Bonus += 0.1;
        if (EquipNumSearch(EQUIPID.ANUBIS_HAT)) H_Bonus += 0.1;
        if (EquipNumSearch(EQUIPID.VITAL_TREE_SHOES)) H_Bonus += 0.05;
        if (n_A_HEAD_REFINE >= 7 && EquipNumSearch(EQUIPID.CANCER_DIADEM)) H_Bonus += 0.03;
        if (n_A_HEAD_REFINE >= 9 && EquipNumSearch(EQUIPID.CAPRICORN_DIADEM_OLD)) H_Bonus += 0.04;
        if (n_A_HEAD_REFINE >= 9 && EquipNumSearch(EQUIPID.CAPRICORN_DIADEM)) H_Bonus += 0.04;
        if (
          (n_A_Equip[9] == 1111 && n_A_Equip[10] == 983) ||
          (n_A_Equip[10] == 1111 && n_A_Equip[9] == 983)
        )
          H_Bonus += 0.05;
        if (
          EquipNumSearch(EQUIPID.GLORIOUS_SUIT) &&
          EquipNumSearch(EQUIPID.GLORIOUS_SHOES) &&
          EquipNumSearch(EQUIPID.GLORIOUS_MUFFLER)
        )
          H_Bonus += 0.03;
        if (
          EquipNumSearch(EQUIPID.ELITE_ENGINEERS_ARMOR) &&
          EquipNumSearch(EQUIPID.CAPTAINS_MANTEAU) &&
          EquipNumSearch(EQUIPID.BATTLE_GREAVES)
        )
          H_Bonus += 0.1;
        H_HEALS = 1 + 0.1 * irp;
        S_HEALS = 1 + 0.1 * isp;
        if (pot1 == 4) {
          potheal1 = Math.floor(
            prate1 * (1 + 0.1 * potr + 0.05 * pot1) * (1 + slv / 100) * (1 + 0.02 * eint) * S_HEALS,
          );
          potheal2 = Math.floor(
            prate2 * (1 + 0.1 * potr + 0.05 * pot1) * (1 + slv / 100) * (1 + 0.02 * eint) * S_HEALS,
          );
        } else {
          potheal1 = Math.floor(
            prate1 *
              (1 + 0.1 * potr + 0.05 * pot1) *
              (1 + slv / 100) *
              (1 + 0.02 * evit) *
              H_HEALS *
              H_Bonus *
              H_Bonus2 *
              H_Bonus3,
          );
          potheal2 = Math.floor(
            prate2 *
              (1 + 0.1 * potr + 0.05 * pot1) *
              (1 + slv / 100) *
              (1 + 0.02 * evit) *
              H_HEALS *
              H_Bonus *
              H_Bonus2 *
              H_Bonus3,
          );
        }
        if (n_A_JOB == 33) {
          potheal3 = Math.floor(
            prate3 * (1 + 0.1 * potr + 0.1 * pot2) * (1 + 0.02 * evit) * H_HEALS * H_Bonus3,
          );
          potheal4 = Math.floor(
            prate4 * (1 + 0.1 * potr + 0.1 * pot2) * (1 + 0.02 * evit) * H_HEALS * H_Bonus3,
          );
        }
        Heal_POT =
          "<table><tr><td><b>Potion Pitcher heals: </b>" + potheal1 + " ~ " + potheal2 + "</td>";
        if (n_A_JOB == 33)
          Heal_POT += "<td><b>Slim Potion Pitch heals: </b>" + potheal3 + " ~ " + potheal4;
        Heal_POT += "</td></tr></table>";
        scrivi("A_KakutyouData", Heal_POT);
      } else scrivi("A_KakutyouData", NON_DISPONIBILE);
    },
  },
  // Forge/Potion/EDP Creation Success Rate
  24: {
    controlli: function () {
      if (n_A_JOB != 12 && n_A_JOB != 26) {
        if (n_A_JOB != 19 && n_A_JOB != 33) nonDisponibile();
        else {
          contenitore("A_KakutyouSel", [
            campoInfo("A_KakutyouSelNum", "Potion to Create"),
            campoInfo("A_PotionRLevel", "Learning Potion"),
            campoInfo("A_Van", "Change Instruction Level"),
            campoInfo("A_PreparePLevel", "Pharmacy"),
          ]);
          opzioni(
            c.A_KakutyouSelNum,
            serie(0, Potion_Max - 1, function (i) {
              return [i, m_Potion[i][2]];
            }),
          );
          c.A_KakutyouSelNum.value = 0;
          opzioni(c.A_PotionRLevel, numeri(0, 10));
          c.A_PotionRLevel.value = 0;
          opzioni(c.A_Van, numeri(0, 5));
          c.A_Van.value = 0;
          opzioni(c.A_PreparePLevel, numeri(0, 10));
          c.A_PreparePLevel.value = 0;
        }
      } else {
        contenitore("A_KakutyouSel", [
          campoInfo("A_OriR", "Oridecon Research"),
          campoInfo("A_WepR", "Weapon Research"),
          campoInfo("A_Iron", "Iron Tempering"),
          campoInfo("A_Steel", "Steel Tempering"),
          campoInfo("A_SmithT", "Smith (weapon) Lvl"),
          campoInfo("A_KakutyouSelNum", "Anvil"),
          campoInfo("A_StarC", "Star Crumb"),
          campoInfo("A_ElemS", "Elemental Stone"),
          campoInfo("A_StoneC", "Enchanted Stone Craft"),
        ]);
        opzioni(
          c.A_KakutyouSelNum,
          serie(0, Anvil_Max - 1, function (i) {
            return [i, m_Anvil[i][2]];
          }),
        );
        c.A_KakutyouSelNum.value = 0;
        opzioni(c.A_OriR, numeri(0, 5));
        c.A_OriR.value = 0;
        opzioni(c.A_WepR, numeri(0, 10));
        c.A_WepR.value = 0;
        opzioni(c.A_StarC, numeri(0, 3));
        c.A_StarC.value = 0;
        opzioni(c.A_ElemS, numeri(0, 1));
        c.A_ElemS.value = 0;
        opzioni(c.A_SmithT, numeri(0, 3));
        c.A_SmithT.value = 0;
        opzioni(c.A_Iron, numeri(0, 5));
        c.A_Iron.value = 0;
        opzioni(c.A_Steel, numeri(0, 5));
        c.A_Steel.value = 0;
        opzioni(c.A_StoneC, numeri(0, 5));
        c.A_StoneC.value = 0;
      }
    },
    calcolo: function () {
      var r;
      switch (n_A_JOB) {
        case 12:
        case 26:
          smithing = 1 * c.A_SmithT.value;
          orideconres = 1 * c.A_OriR.value;
          weaponres = 1 * c.A_WepR.value;
          starcrumb = 1 * c.A_StarC.value;
          elemstone = 1 * c.A_ElemS.value;
          anvil = 1 * c.A_KakutyouSelNum.value;
          iron = 1 * c.A_Iron.value;
          steel = 1 * c.A_Steel.value;
          stone = 1 * c.A_StoneC.value;
          anvil2 = m_Anvil[anvil][1];
          adopted = 1 * c.A_adopted.checked;
          srate1 =
            Math.floor(
              100 *
                (50 +
                  5 * smithing +
                  weaponres +
                  anvil2 +
                  0.2 * n_A_JobLV +
                  0.1 * (n_A_DEX + n_A_LUK) -
                  15 * starcrumb -
                  20 * elemstone),
            ) / 100;
          srate2 =
            Math.floor(
              100 *
                (50 +
                  5 * smithing +
                  weaponres +
                  anvil2 +
                  0.2 * n_A_JobLV +
                  0.1 * (n_A_DEX + n_A_LUK) -
                  15 * starcrumb -
                  20 * elemstone -
                  20),
            ) / 100;
          srate3 =
            Math.floor(
              100 *
                (50 +
                  5 * smithing +
                  orideconres +
                  weaponres +
                  anvil2 +
                  0.2 * n_A_JobLV +
                  0.1 * (n_A_DEX + n_A_LUK) -
                  15 * starcrumb -
                  20 * elemstone -
                  30),
            ) / 100;
          srate4 =
            Math.floor(100 * (40 + 0.2 * n_A_JobLV + 0.1 * (n_A_DEX + n_A_LUK) + 5 * iron)) / 100;
          srate5 =
            Math.floor(100 * (30 + 0.2 * n_A_JobLV + 0.1 * (n_A_DEX + n_A_LUK) + 5 * steel)) / 100;
          srate6 =
            Math.floor(100 * (10 + 0.2 * n_A_JobLV + 0.1 * (n_A_DEX + n_A_LUK) + 5 * stone)) / 100;
          if (srate1 < 0 || smithing == 0) srate1 = 0;
          if (srate2 < 0 || smithing == 0) srate2 = 0;
          if (srate3 < 0 || smithing == 0) srate3 = 0;
          if (srate4 < 0 || iron == 0) srate4 = 0;
          if (srate5 < 0 || steel == 0) srate5 = 0;
          if (srate6 < 0 || stone == 0) srate6 = 0;
          if (adopted) {
            srate1 = Math.floor(0.7 * srate1 * 100) / 100;
            srate2 = Math.floor(0.7 * srate2 * 100) / 100;
            srate3 = Math.floor(0.7 * srate3 * 100) / 100;
          }
          r = "<br><table><tr><td><b>Weapon Lvl 1: </b>" + srate1 + " %</td>";
          r += "<td><b>Weapon Lvl 2: </b>" + srate2 + " %</td>";
          r += "<td><b>Weapon Lvl 3: </b>" + srate3 + " %</td></tr>";
          r += "<tr><td><b>Iron: </b>" + srate4 + " %</td>";
          r += "<td><b>Steel: </b>" + srate5 + " %</td>";
          r += "<td><b>Elemental Stone: </b>" + srate6 + " %</td></tr></table>";
          scrivi("A_KakutyouData", r);
          break;
        case 19:
        case 33:
          potionr = 1 * c.A_PotionRLevel.value;
          vani = 1 * c.A_Van.value;
          preparep = 1 * c.A_PreparePLevel.value;
          selpot = 1 * c.A_KakutyouSelNum.value;
          potrate = m_Potion[selpot][1];
          adopted = 1 * c.A_adopted.checked;
          srate =
            Math.floor(
              100 * potionr +
                300 * preparep +
                20 * n_A_JobLV +
                10 * (n_A_DEX + n_A_LUK) +
                5 * n_A_INT +
                100 * potrate +
                100 * vani,
            ) / 100;
          if (srate < 0 || potionr == 0 || preparep == 0) srate = 0;
          if (adopted) srate = Math.floor(0.7 * srate);
          brate = m_Potion[selpot][3];
          frate1 = Math.floor(100 * (srate - brate)) / 100;
          if (frate1 < 0) frate1 = 0;
          frate2 = Math.floor(100 * (srate + brate)) / 100;
          if (frate2 < 0) frate2 = 0;
          scrivi(
            "A_KakutyouData",
            "<b><br>Sucess rate: </b>" + srate + " % [ " + frate1 + " % ~ " + frate2 + " % ]",
          );
          break;
        case 22:
          contenitore("A_KakutyouSel", [campoInfo("A_KakutyouSelNum", "Potion to Create")]);
          opzioni(c.A_KakutyouSelNum, [[0, "Poison Bottle"]]);
          srate = Math.floor(200 + 4 * n_A_DEX + 2 * n_A_LUK) / 10;
          scrivi("A_KakutyouData", "<b><br>Sucess rate: </b>" + srate + " %");
          break;
        default:
          scrivi("A_KakutyouData", NON_DISPONIBILE);
      }
    },
  },
  // Strip chance & duration
  28: {
    controlli: function () {
      // una voce per skill: livello, poi probabilita' e durata (risultati <id>_CHANCE, <id>_TIME)
      var voci = [];
      var skill = function (nome, campo, id, opzioni) {
        var v = campoInfo(campo, nome);
        if (opzioni) v.opzioni = opzioni;
        voci.push(v, {
          riga: [
            "Chance",
            {
              id: id + "_CHANCE",
            },
            "Duration",
            {
              id: id + "_TIME",
            },
          ],
        });
      };
      var attiva = stripAttivi();
      if (attiva) {
        voci.push(campoInfo("E_DEX", "Enemy DEX"));
        if (n_A_JOB == 14 || n_A_JOB == 28)
          skill(skillName(538) + " Helm, Armor, Weapon or Shield", "S_LV", "S");
        if (n_A_JOB == 28) skill(skillName(440), "FS_LV", "FS");
        if (n_A_JOB == 45) skill("Disarm", "S_LV", "S");
        if (CardNumSearch(157))
          skill(skillName(172) + " (Auto-Casted)", "S2_LV", "S2", [["1", "1"]]);
        if (CardNumSearch(413)) skill(skillName(174) + " (Auto-Casted)", "S3_LV", "S3");
        if (EquipNumSearch(EQUIPID.DRILL_KATAR))
          skill(skillName(440) + " (Auto-Casted)", "FS2_LV", "FS2", [["1", "1"]]);
      }
      if (attiva) contenitore("A_KakutyouSel", voci);
      else nonDisponibile();
      if (attiva) {
        opzioni(c.E_DEX, numeri(0, 200));
        c.E_DEX.value = 0;
        if (n_A_JOB == 14 || n_A_JOB == 28 || n_A_JOB == 45) {
          opzioni(c.S_LV, numeri(1, 5));
          c.S_LV.value = 1;
        }
        if (n_A_JOB == 28) {
          opzioni(c.FS_LV, numeri(1, 5));
          c.FS_LV.value = 1;
        }
        if (CardNumSearch(413)) {
          if (
            CardNumSearch(113) &&
            CardNumSearch(295) &&
            CardNumSearch(391) &&
            CardNumSearch(260) &&
            (n_A_JOB == 14 || n_A_JOB == 28)
          )
            opzioni(c.S3_LV, [[5, "5"]]);
          else opzioni(c.S3_LV, [[1, "1"]]);
        }
      }
    },
    calcolo: function () {
      var attiva = stripAttivi();
      if (attiva) {
        E_DEX1 = 1 * c.E_DEX.value;
        if (n_A_JOB == 14 || n_A_JOB == 28 || n_A_JOB == 45) {
          S_LV1 = 1 * c.S_LV.value;
          Strip = 5 + 5 * S_LV1 + (n_A_DEX - E_DEX1) / 5;
          S_Time = 60 + 15 * S_LV1 + (n_A_DEX - E_DEX1) / 2;
          if (Strip < 5 + 5 * S_LV1) Strip = 5 + 5 * S_LV1;
          if (S_Time < 60) S_Time = 60;
          scrivi("S_CHANCE", Math.floor(10 * Strip) / 10 + " %");
          scrivi("S_TIME", Math.floor(10 * S_Time) / 10 + " seconds");
        }
        if (n_A_JOB == 28) {
          FS_LV1 = 1 * c.FS_LV.value;
          FStrip = 5 + 2 * FS_LV1 + (n_A_DEX - E_DEX1) / 5;
          FS_Time = 60 + 15 * FS_LV1 + (n_A_DEX - E_DEX1) / 2;
          if (FStrip < 5 + 2 * FS_LV1) FStrip = 5 + 2 * FS_LV1;
          if (FS_Time < 60) FS_Time = 60;
          scrivi("FS_CHANCE", Math.floor(10 * FStrip) / 10 + " %");
          scrivi("FS_TIME", Math.floor(10 * FS_Time) / 10 + " seconds");
        }
        if (CardNumSearch(157)) {
          S_LV1 = 1 * c.S2_LV.value;
          Strip = 5 + 5 * S_LV1 + (n_A_DEX - E_DEX1) / 5;
          S_Time = 60 + 15 * S_LV1 + (n_A_DEX - E_DEX1) / 2;
          if (Strip < 5 + 5 * S_LV1) Strip = 5 + 5 * S_LV1;
          if (S_Time < 60) S_Time = 60;
          scrivi("S2_CHANCE", Math.floor(10 * Strip) / 10 + " %");
          scrivi("S2_TIME", Math.floor(10 * S_Time) / 10 + " seconds");
        }
        if (CardNumSearch(413)) {
          S_LV1 = 1 * c.S3_LV.value;
          Strip = 5 + 5 * S_LV1 + (n_A_DEX - E_DEX1) / 5;
          S_Time = 60 + 15 * S_LV1 + (n_A_DEX - E_DEX1) / 2;
          if (Strip < 5 + 5 * S_LV1) Strip = 5 + 5 * S_LV1;
          if (S_Time < 60) S_Time = 60;
          scrivi("S3_CHANCE", Math.floor(10 * Strip) / 10 + " %");
          scrivi("S3_TIME", Math.floor(10 * S_Time) / 10 + " seconds");
        }
        if (EquipNumSearch(EQUIPID.DRILL_KATAR)) {
          FS_LV1 = 1 * c.FS2_LV.value;
          FStrip = 5 + 2 * FS_LV1 + (n_A_DEX - E_DEX1) / 5;
          FS_Time = 60 + 15 * FS_LV1 + (n_A_DEX - E_DEX1) / 2;
          if (FStrip < 5 + 2 * FS_LV1) FStrip = 5 + 2 * FS_LV1;
          if (FS_Time < 60) FS_Time = 60;
          scrivi("FS2_CHANCE", Math.floor(10 * FStrip) / 10 + " %");
          scrivi("FS2_TIME", Math.floor(10 * FS_Time) / 10 + " seconds");
        }
      }
      // l'avviso lo decidono i controlli: carte ed equipaggiamento cambiano dopo, senza rifarli
      scrivi("A_KakutyouData", contenitori.A_KakutyouSel.length ? "" : NON_DISPONIBILE);
    },
  },
  // Cooking Success Rates
  30: {
    controlli: function () {
      contenitore("A_KakutyouSel", [
        campoInfo("Flv", "Level of the Food"),
        campoInfo("FStat", "Stat of the Food"),
        campoInfo("CKit", "Cooking Kit Used"),
        campoInfo("CExp", "Cooking Experience", "0"),
        {
          nota: "Success Rate",
        },
        {
          nota: {
            id: "COOK_MIN",
          },
        },
        {
          nota: {
            id: "COOK_AVE",
          },
        },
        {
          nota: {
            id: "COOK_MAX",
          },
        },
      ]);
      opzioni(c.Flv, numeri(1, 10));
      c.Flv.value = 10;
      opzioni(
        c.FStat,
        serie(0, 5, function (i) {
          return [i, m_Stat_Food[i][1]];
        }),
      );
      c.FStat.value = 0;
      opzioni(
        c.CKit,
        serie(0, Cook_Kit_Max - 1, function (i) {
          return [i, m_Cook_Kit[i][1]];
        }),
      );
      c.CKit.value = 0;
    },
    calcolo: function () {
      Flv1 = 1 * c.Flv.value;
      FStat1 = 1 * c.FStat.value;
      CKit1 = 1 * c.CKit.value;
      CExp1 = 1 * c.CExp.value;
      adopted = 1 * c.A_adopted.checked;
      ItemN = 1;
      if (CExp1 > 2000) CExp1 = 2000;
      if (adopted) adp = 0.7;
      else adp = 1;
      if (Flv1 == 1 && FStat1 == 4) ItemN = 2;
      if ((Flv1 == 1 && FStat1 != 4) || (Flv1 == 2 && FStat1 == 4) || (Flv1 == 3 && FStat1 == 4))
        ItemN = 3;
      if (
        (Flv1 == 2 && FStat1 != 4) ||
        (Flv1 == 3 && (FStat1 == 2 || FStat1 == 3 || FStat1 == 6)) ||
        (Flv1 == 6 && FStat1 == 2)
      )
        ItemN = 4;
      if (
        (Flv1 == 3 && (FStat1 == 1 || FStat1 == 5)) ||
        (Flv1 == 4 && (FStat1 != 1 || FStat1 != 5)) ||
        (Flv1 == 5 && FStat1 != 5) ||
        (Flv1 == 6 && (FStat1 != 2 || FStat1 != 5)) ||
        (Flv1 == 7 && FStat1 == 4)
      )
        ItemN = 5;
      if (
        (Flv1 == 4 && (FStat1 == 4 || FStat1 == 5)) ||
        (Flv1 == 5 && FStat1 == 5) ||
        (Flv1 == 6 && FStat1 == 5) ||
        (Flv1 == 7 && FStat1 != 4) ||
        (Flv1 == 8 && FStat1 != 5)
      )
        ItemN = 6;
      if ((Flv1 == 8 && FStat1 == 5) || Flv1 == 9) ItemN = 7;
      if (Flv1 == 10) ItemN = 8;
      Food_Powa =
        1200 * (CKit1 + 1) +
        20 * (n_A_BaseLV + 1) +
        20 * n_A_DEX -
        400 * Flv1 -
        10 * (100 - (n_A_LUK + 1)) -
        500 * (ItemN - 1);
      Food_MIN = Math.round(Food_Powa + 100 * (6 + CExp1 / 80 + 0) * adp) / 100;
      Food_AVG = Math.round(Food_Powa + 100 * (6 + CExp1 / 80 + 12) * adp) / 100;
      Food_MAX = Math.round(Food_Powa + 100 * (6 + CExp1 / 80 + 24) * adp) / 100;
      FDA1 = Math.round(100 * (Food_MIN - 5)) / 100;
      FDA2 = Math.round(100 * (Food_MIN - 1)) / 100;
      FDB1 = Math.round(100 * (Food_AVG - 5)) / 100;
      FDB2 = Math.round(100 * (Food_AVG - 1)) / 100;
      FDC1 = Math.round(100 * (Food_MAX - 5)) / 100;
      FDC2 = Math.round(100 * (Food_MAX - 1)) / 100;
      if (Food_MIN <= 0) {
        Food_MIN = 0;
        FDA1 = 0;
        FDA2 = 0;
      }
      if (FDA1 <= 0) FDA1 = 0;
      if (FDA2 <= 0) {
        FDA1 = 0;
        FDA2 = 0;
      }
      if (Food_AVG <= 0) {
        Food_AVG = 0;
        FDB1 = 0;
        FDB2 = 0;
      }
      if (FDB1 <= 0) FDB1 = 0;
      if (FDB2 <= 0) {
        FDB1 = 0;
        FDB2 = 0;
      }
      if (Food_MAX <= 0) {
        Food_MAX = 0;
        FDC1 = 0;
        FDC2 = 0;
      }
      if (FDC1 <= 0) FDC1 = 0;
      if (FDC2 <= 0) {
        FDC1 = 0;
        FDC2 = 0;
      }
      if (Food_MIN > 100) Food_MIN = 100;
      if (FDA1 > 100) FDA1 = 100;
      if (FDA2 > 100) FDA2 = 100;
      if (Food_AVG > 100) Food_AVG = 100;
      if (FDB1 > 100) FDB1 = 100;
      if (FDB2 > 100) FDB2 = 100;
      if (Food_MAX > 100) Food_MAX = 100;
      if (FDC1 > 100) FDC1 = 100;
      if (FDC2 > 100) FDC2 = 100;
      if (CKit1 == 4) {
        scrivi("COOK_MIN", "100%");
        scrivi("COOK_AVE", "");
        scrivi("COOK_MAX", "");
      } else {
        scrivi("COOK_MIN", "Minimum: " + Food_MIN + "% [" + FDA1 + "% ~ " + FDA2 + "%]");
        scrivi("COOK_AVE", "Average: " + Food_AVG + "% [" + FDB1 + "% ~ " + FDB2 + "%]");
        scrivi("COOK_MAX", "Maximum: " + Food_MAX + "% [" + FDC1 + "% ~ " + FDC2 + "%]");
      }
      scrivi("A_KakutyouData", "");
    },
  },
  // Capture Pet Success Rate
  32: {
    controlli: function () {
      contenitore("A_KakutyouSel", [
        campoInfo("Pet", "Monster to pet"),
        campoInfo("PetHP", "Monster remaining HP"),
      ]);
      opzioni(
        c.Pet,
        serie(0, 55, function (i) {
          return [i, m_Monster[m_Pets[1][i]][1]];
        }),
      );
      c.Pet.value = 0;
      opzioni(
        c.PetHP,
        serie(0, 100, function (i) {
          return [i, i + " %"];
        }),
      );
      c.PetHP.value = 100;
    },
    calcolo: function () {
      var r;
      var X = 1 * c.Pet.value,
        Z = 1 * c.PetHP.value,
        x =
          Math.round(
            ((m_Pets[0][X] + 30 * (n_A_BaseLV - m_Monster[X][5]) + 20 * n_A_LUK) *
              (100 - (Z - 100))) /
              100,
          ) / 100;
      if (x < 0) x = 0;
      r = "<HR><table><tr><td>Chance to pet: " + x + " %</td></tr></table>";
      scrivi("A_KakutyouData", r);
    },
  },
  // NPC Refinement Cost & Success Rate
  34: {
    controlli: function () {
      var tipo = campoInfo("EquipType", "Equipment type");
      tipo.opzioni = [
        ["0", "Weapon Lvl 1"],
        ["1", "Weapon Lvl 2"],
        ["2", "Weapon Lvl 3"],
        ["3", "Weapon Lvl 4"],
        ["4", "Armor"],
      ];
      var minerale = campoInfo("OreType", "Ore type");
      minerale.opzioni = [
        ["0", "Normal Ores"],
        ["1", "Enriched Ores"],
        ["2", "Normal Ores (F2P server)"],
        ["3", "Enriched Ores (F2P server)"],
      ];
      contenitore("A_KakutyouSel", [
        campoInfo("EquipValue", "Equipment zeny value", "0"),
        tipo,
        minerale,
        campoInfo("OreValue", "Ore zeny value", "0"),
        campoInfo("npcCost", "Refining zeny cost", "0"),
        campoInfo("DesiredRefine", "Desired refine"),
      ]);
      opzioni(
        c.DesiredRefine,
        serie(1, 10, function (i) {
          return [i, "+" + i];
        }),
      );
      c.DesiredRefine.value = 1;
    },
    calcolo: function () {
      var r;
      refinetype = [
        [
          [1, 1, 1, 1, 1, 1, 1, 0.6, 0.24, 0.048],
          [1, 1, 1, 1, 1, 1, 0.6, 0.24, 0.048, 0.0096],
          [1, 1, 1, 1, 1, 0.6, 0.3, 0.06, 0.012, 0.0024],
          [1, 1, 1, 1, 0.6, 0.24, 0.096, 0.0192, 0.00384, 0.000384],
          [1, 1, 1, 1, 0.6, 0.24, 0.096, 0.0192, 0.00384, 0.000384],
        ],
        [
          [1, 1, 1, 1, 1, 1, 1, 0.9, 0.54, 0.108],
          [1, 1, 1, 1, 1, 1, 0.9, 0.54, 0.162, 0.0324],
          [1, 1, 1, 1, 1, 0.9, 0.675, 0.2025, 0.06075, 0.0121],
          [1, 1, 1, 1, 0.9, 0.54, 0.324, 0.0972, 0.02916, 0.002916],
          [1, 1, 1, 1, 0.9, 0.54, 0.324, 0.0972, 0.02916, 0.002916],
        ],
        [
          [
            0.9, 0.81, 0.729, 0.6561, 0.52488, 0.419904, 0.2519424, 0.15116544, 0.060466176,
            0.0120932352,
          ],
          [
            0.9, 0.81, 0.729, 0.5832, 0.46656, 0.279936, 0.1679616, 0.06718464, 0.013436928,
            0.0026873856,
          ],
          [
            0.9, 0.81, 0.648, 0.5184, 0.31104, 0.186624, 0.093312, 0.0186624, 0.00373248,
            0.000746496,
          ],
          [
            0.9, 0.72, 0.576, 0.3456, 0.20736, 0.082944, 0.0331776, 0.00663552, 0.001327104,
            0.0001327104,
          ],
          [
            0.8, 0.64, 0.512, 0.3072, 0.18432, 0.073728, 0.0294912, 0.00589824, 0.001179648,
            0.0001179648,
          ],
        ],
        [
          [1, 1, 1, 1, 1, 1, 1, 0.6, 0.24, 0.048],
          [1, 1, 1, 1, 1, 1, 0.6, 0.24, 0.048, 0.0096],
          [1, 1, 1, 1, 1, 0.6, 0.3, 0.06, 0.012, 0.0024],
          [1, 1, 1, 1, 0.6, 0.24, 0.096, 0.0192, 0.00384, 0.000384],
          [1, 1, 1, 1, 0.6, 0.24, 0.096, 0.0192, 0.00384, 0.000384],
        ],
      ];
      var y = 1 * c.EquipValue.value,
        P = 1 * c.EquipType.value,
        $ = 1 * c.OreType.value,
        __ = 1 * c.OreValue.value,
        W = 1 * c.npcCost.value,
        Q = 1 * c.DesiredRefine.value,
        z = refinetype[$][P][Q - 1],
        e_ = Math.round((y + (__ + W) * Q) / z) - y;
      r =
        "<HR><table><tr><td>Chance to refine up to +" +
        Q +
        " = " +
        Math.round(1000000 * z) / 10000 +
        " %</td></tr>";
      r += "<tr><td>Mean investment = " + e_ + " zeny</td></tr></table>";
      scrivi("A_KakutyouData", r);
    },
  },
  // NPC Socket Enchant Cost & Success Rate
  36: {
    controlli: function () {
      contenitore("A_KakutyouSel", [
        campoInfo("EquipValue", "Equipment zeny value", "0"),
        campoInfo("ItemValue", "Used item zeny value", "0"),
        campoInfo("npcCost", "Enchanting zeny cost", "0"),
        campoInfo("SocketChance", "Enchanting success chance"),
      ]);
      opzioni(
        c.SocketChance,
        serie(1, 100, function (i) {
          return [i, i + " %"];
        }),
      );
      c.SocketChance.value = 1;
    },
    calcolo: function () {
      var r;
      var y, W;
      y = 1 * c.EquipValue.value;
      var a_ = 1 * c.ItemValue.value,
        n_ = ((W = 1 * c.npcCost.value), 1 * c.SocketChance.value);
      r =
        "<HR><table><tr><td>Mean investment = " +
        Math.round((y + a_ + W) / (n_ / 100)) +
        " zeny</td></tr></table>";
      scrivi("A_KakutyouData", r);
    },
  },
  // Non-Damage Skill Cast Time
  40: {
    controlli: function () {
      contenitore("A_KakutyouSel", [
        campoInfo("NonDamageCastSkill", "Skill", undefined, function () {
          NonDamageCastSkillChanged(1);
        }),
        campoInfo("NonDamageCastSkillLevel", "Skill level"),
      ]);
      var A = c.NonDamageCastSkill,
        n = Object.keys(m_NonDamageSkillCast);
      n.sort(function (E, S) {
        return skillNameInSelect(1 * E).localeCompare(skillNameInSelect(1 * S));
      });
      opzioni(
        A,
        n.map(function (id) {
          return [1 * id, skillNameInSelect(1 * id)];
        }),
      );
      A.value = SKILLID.ASSUMPTIO;
      NonDamageCastSkillChanged(0);
    },
    calcolo: function () {
      var l = c.NonDamageCastSkill,
        A = c.NonDamageCastSkillLevel;
      if (l && A) {
        var n = 1 * l.value,
          s = 1 * A.value,
          _ = m_NonDamageSkillCast[n];
        if (_) {
          var a = Array.isArray(_[0]) ? _[0][s - 1] : _[0],
            E = NonDamageSkillCastMultiplier(n, _[1]),
            S = Math.floor((a * E) / 10 + 1e-9) / 100,
            b = Math.floor(a / 10) / 100,
            m = Math.floor(10000 * (1 - E)) / 100,
            u = Array.isArray(_[2]) ? _[2][s - 1] : _[2] || 0,
            I = 100 - AC_I - ((100 - AC_I) * bonusValues[74]) / 100,
            D = Math.floor((u / 1000) * I) / 100,
            T = Math.floor(u / 10) / 100,
            d = AspdMotionDelayForSkill(),
            B = Math.max(D, d),
            p = D > d ? "ACD" : D < d ? "ASPD motion" : "ACD / ASPD motion",
            e = (1 * c.Conf01.value) / 100,
            v = Math.max(S + B, e),
            U = v > 0 ? Math.floor(1000 / v + 1e-9) / 1000 : 0,
            C =
              '<table><tr><td class="right"><b>Base cast time:</b></td><td>' +
              b +
              " seconds</td></tr>";
          C += '<tr><td class="right"><b>Cast-time reduction:</b></td><td>' + m + "%</td></tr>";
          C += '<tr><td class="right"><b>Final cast time:</b></td><td>' + S + " seconds</td></tr>";
          C += '<tr><td class="right"><b>Base ACD:</b></td><td>' + T + " seconds</td></tr>";
          C += '<tr><td class="right"><b>Final ACD:</b></td><td>' + D + " seconds</td></tr>";
          C +=
            '<tr><td class="right"><b>ASPD motion delay:</b></td><td>' + d + " seconds</td></tr>";
          C +=
            '<tr><td class="right"><b>Effective post-cast delay:</b></td><td>' +
            B +
            " seconds (" +
            p +
            ")</td></tr>";
          C +=
            '<tr><td class="right"><b>Skills per second:</b></td><td>' + U + "</td></tr></table>";
          C +=
            "<small>Repeat rate includes final cast time and the configured minimum input delay.</small><br>";
          if (_[1] & 1) C += "<small>DEX does not reduce this skill's cast time.</small><br>";
          if (_[1] & 2)
            C += "<small>Status effects do not reduce this skill's cast time.</small><br>";
          scrivi("A_KakutyouData", C);
        } else scrivi("A_KakutyouData", "");
      }
    },
  },
};
// Strip: le classi e gli oggetti con una skill che toglie l'equipaggiamento
function stripAttivi() {
  return (
    CardNumSearch(157) ||
    CardNumSearch(413) ||
    EquipNumSearch(EQUIPID.DRILL_KATAR) ||
    n_A_JOB == 14 ||
    n_A_JOB == 28 ||
    n_A_JOB == 45
  );
}
// la voce scelta: risultato
function calcolaAltreInfo() {
  var voce = ALTRE_INFO[1 * c.A_Kakutyou.value];
  if (voce) voce.calcolo();
}
// la voce scelta: campi
function preparaAltreInfo() {
  var voce = ALTRE_INFO[1 * c.A_Kakutyou.value];
  if (voce) voce.controlli();
}
function Kanma(l) {
  var A = "",
    n = new Array();
  if (l < 0) {
    l *= -1;
    A += "-";
  }
  for (var s = 0; Math.floor(l / 1000) != 0; s++) {
    var _ = l % 1000;
    n[s] = _ == 0 ? ",000" : _ < 10 ? ",00" + _ : _ < 100 ? ",0" + _ : "," + _;
    l = Math.floor(l / 1000);
  }
  for (n[s] = l; s >= 0;) {
    A += n[s];
    s--;
  }
  return A;
}
function NonDamageSkillCastMultiplier(l, A) {
  var n = A & 1 ? 1 : Math.max(0, 1 - n_A_DEX / 150),
    s = n_B_Cast;
  if (A & 2 && nb_tok < 100) s /= 1 - nb_tok / 100;
  n *= s / 100;
  var _ = 100 - StPlusCalc2(7000 + l) - StPlusCard(7000 + l);
  if (_ < 0) _ = 0;
  n *= _ / 100;
  if (!(A & 2)) {
    if (n_A_Buf2[10]) n *= (100 - 15 * n_A_Buf2[10]) / 100;
    if (SkillSearch(SKILLID.MEMORIZE)) n /= 2;
  }
  return Math.max(0, n);
}
function NonDamageCastSkillChanged(l) {
  var A = c.NonDamageCastSkill,
    n = c.NonDamageCastSkillLevel;
  if (A && n) {
    var s = 1 * A.value;
    n.length = 0;
    opzioni(n, numeri(1, m_Skill[s][1]));
    n.value = m_Skill[s][1];
    if (l) StAllCalc();
  }
}
