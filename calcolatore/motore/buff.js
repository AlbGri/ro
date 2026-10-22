// Pannelli di buff e debuff: BufSW, Buf3SW... disegnano i campi, A2, A3... li leggono
function BufSW(e) {
  n_SkillSW = e;
  if (n_SkillSW) {
    apriPannello(
      "SIENSKILL",
      function () {
        A2(1);
      },
      [
        {
          titolo: "<b><u>Gospel Effects</u></b>",
          voci: [
            {
              campo: "A5_Skill0",
              tipo: "checkbox",
              etichetta: "All Stats +20",
            },
            {
              campo: "A5_Skill1",
              tipo: "checkbox",
              etichetta: "HP +100%",
            },
            {
              campo: "A5_Skill2",
              tipo: "checkbox",
              etichetta: "SP +100%",
            },
            {
              campo: "A5_Skill3",
              tipo: "checkbox",
              etichetta: "ATK +100%",
            },
            {
              campo: "A5_Skill5",
              tipo: "checkbox",
              etichetta: "DEF +25%",
            },
            {
              campo: "A5_Skill4",
              tipo: "checkbox",
              etichetta: "HIT &amp; FLEE +50",
            },
          ],
        },
        {
          titolo: "<b><u>Acolyte Class Buffs</u></b>",
          voci: [
            {
              campo: "A2_Skill0",
              id: "AS0_1",
              etichetta: "Blessing",
            },
            {
              campo: "A2_Skill1",
              id: "AS1_1",
              etichetta: "Increase AGI",
            },
            {
              campo: "A2_Skill4",
              id: "AS4_1",
              etichetta: "Angelus",
            },
            {
              campo: "A2_Skill2",
              id: "AS2_1",
              etichetta: "Impositio Manus",
            },
            {
              campo: "A2_Skill3",
              tipo: "checkbox",
              id: "AS3_1",
              etichetta: "Gloria",
            },
            {
              campo: "A2_Skill10",
              id: "AS10_1",
              etichetta: "Suffragium",
            },
            {
              campo: "A2_Skill5",
              tipo: "checkbox",
              id: "AS5_1",
              etichetta: "Assumptio",
            },
            {
              campo: "A2_Skill12",
              id: "AS12_1",
              etichetta: "# of Spirit Spheres",
            },
          ],
        },
        {
          titolo: "<b><u>Other Party Buffs</u></b>",
          voci: [
            {
              campo: "A2_Skill6",
              id: "AS6_1",
              etichetta: "Andrenaline Rush",
            },
            {
              campo: "A2_Skill7",
              tipo: "checkbox",
              id: "AS7_1",
              etichetta: "Weapon Perfection",
            },
            {
              campo: "A2_Skill8",
              tipo: "checkbox",
              id: "AS8_1",
              etichetta: skillName(154),
            },
            {
              campo: "A2_Skill9",
              id: "AS9_1",
              etichetta: "Wind Walker",
            },
            {
              campo: "A2_Skill13",
              etichetta: skillName(157),
            },
            {
              campo: "A2_Skill14",
              etichetta: "Shield Reflect",
            },
            {
              campo: "A2_Skill15",
              etichetta: skillName(165),
            },
            {
              campo: "A2_Skill11",
              id: "AS11_1",
              etichetta: skillName(164),
            },
          ],
        },
      ],
    );
    opzioni(c.A2_Skill0, numeri(0, 10));
    opzioni(c.A2_Skill1, numeri(0, 10));
    opzioni(c.A2_Skill4, numeri(0, 10));
    opzioni(c.A2_Skill9, numeri(0, 10));
    opzioni(c.A2_Skill13, numeri(0, 10));
    opzioni(c.A2_Skill14, numeri(0, 10));
    opzioni(c.A2_Skill2, numeri(0, 5));
    opzioni(c.A2_Skill11, numeri(0, 5));
    opzioni(c.A2_Skill12, numeri(0, 5));
    opzioni(c.A2_Skill15, numeri(0, 5));
    if (n_A_JOB == 45) {
      scrivi("AS12_1", "<S># of Spirit Spheres</S>");
      c.A2_Skill12.disabled = true;
      c.A2_Skill12.value = 0;
      n_A_Buf2[12] = 0;
    } else {
      scrivi("AS12_1", "# of Spirit Spheres");
      c.A2_Skill12.disabled = false;
    }
    if (n_A_JOB == 13 || n_A_JOB == 27) {
      scrivi("AS11_1", "<S>" + skillName(164) + "</S>");
      c.A2_Skill11.disabled = true;
      c.A2_Skill11.value = 0;
      n_A_Buf2[11] = 0;
    } else {
      scrivi("AS11_1", skillName(164));
      c.A2_Skill11.disabled = false;
    }
    opzioni(c.A2_Skill10, numeri(0, 3));
    opzioni(c.A2_Skill6, [
      [0, "OFF"],
      [1, "Regular AR"],
      [2, "Full AR"],
      [3, "AR Scroll"],
    ]);
    c.A2_Skill0.value = n_A_Buf2[0];
    c.A2_Skill1.value = n_A_Buf2[1];
    c.A2_Skill2.value = n_A_Buf2[2];
    c.A2_Skill3.checked = n_A_Buf2[3];
    c.A2_Skill4.value = n_A_Buf2[4];
    c.A2_Skill5.checked = n_A_Buf2[5];
    c.A2_Skill6.value = n_A_Buf2[6];
    c.A2_Skill7.checked = n_A_Buf2[7];
    c.A2_Skill8.checked = n_A_Buf2[8];
    c.A2_Skill9.value = n_A_Buf2[9];
    c.A2_Skill10.value = n_A_Buf2[10];
    c.A2_Skill11.value = n_A_Buf2[11];
    c.A2_Skill12.value = n_A_Buf2[12];
    c.A2_Skill13.value = n_A_Buf2[13];
    c.A2_Skill14.value = n_A_Buf2[14];
    c.A2_Skill15.value = n_A_Buf2[15];
    c.A5_Skill0.checked = n_A_Buf2[16];
    c.A5_Skill1.checked = n_A_Buf2[17];
    c.A5_Skill2.checked = n_A_Buf2[18];
    c.A5_Skill3.checked = n_A_Buf2[19];
    c.A5_Skill4.checked = n_A_Buf2[20];
    c.A5_Skill5.checked = n_A_Buf2[21];
  } else chiudiPannello("SIENSKILL");
  A2(0);
}
function A2(e) {
  if (e == 1) calc();
  for (var _ = 0, n = 0; n <= 21; n++)
    if (n_A_Buf2[n] != 0) {
      _ = 1;
      break;
    }
  scrivi("A2used", _ == 0 ? "" : " [active]");
}
function Buf3SW(e) {
  n_Skill3SW = e;
  if (n_Skill3SW) {
    var canzone = function () {
      Skill3SW_2();
      A3(1);
    };
    apriPannello(
      "SP_SIEN01",
      function () {
        A3(1);
      },
      [
        {
          titolo: null,
          voci: [
            {
              campo: "A3_Skill0_1",
              gestore: canzone,
              id: "EN0_1",
            },
            {
              campo: "A3_Skill0_2",
              id: "EN0_3",
              facoltativo: true,
            },
            {
              campo: "A3_Skill0_4",
              facoltativo: true,
            },
            {
              campo: "A3_Skill0_3",
              id: "EN0_5",
              facoltativo: true,
            },
            {
              campo: "A3_Skill1_1",
              gestore: canzone,
              id: "EN1_1",
            },
            {
              campo: "A3_Skill1_2",
              id: "EN1_3",
              facoltativo: true,
            },
            {
              campo: "A3_Skill1_3",
              id: "EN1_5",
              facoltativo: true,
            },
            {
              campo: "A3_Skill2_1",
              gestore: canzone,
              id: "EN2_1",
            },
            {
              campo: "A3_Skill2_2",
              id: "EN2_3",
              facoltativo: true,
            },
            {
              campo: "A3_Skill2_3",
              facoltativo: true,
            },
            {
              campo: "A3_Skill2_4",
              id: "EN2_5",
              facoltativo: true,
            },
            {
              campo: "A3_Skill3_1",
              gestore: canzone,
              id: "EN3_1",
            },
            {
              campo: "A3_Skill3_2",
              id: "EN3_3",
              facoltativo: true,
            },
            {
              campo: "A3_Skill3_3",
              id: "EN3_5",
              facoltativo: true,
            },
            {
              campo: "A3_Skill4_1",
              gestore: canzone,
              id: "EN4_1",
            },
            {
              campo: "A3_Skill4_2",
              id: "EN4_3",
              facoltativo: true,
            },
            {
              campo: "A3_Skill4_3",
              id: "EN4_5",
              facoltativo: true,
            },
            {
              campo: "A3_Skill5_1",
              gestore: canzone,
              id: "EN5_1",
            },
            {
              campo: "A3_Skill5_2",
              id: "EN5_3",
              facoltativo: true,
            },
            {
              campo: "A3_Skill5_3",
              id: "EN5_5",
              facoltativo: true,
            },
            {
              campo: "A3_Skill6_1",
              gestore: canzone,
              id: "EN6_1",
            },
            {
              campo: "A3_Skill6_2",
              id: "EN6_3",
              facoltativo: true,
            },
            {
              campo: "A3_Skill6_3",
              id: "EN6_5",
              facoltativo: true,
            },
            {
              campo: "A3_Skill12_1",
              gestore: canzone,
              id: "EN12_1",
            },
            {
              campo: "A3_Skill12_2",
              id: "EN12_3",
              facoltativo: true,
            },
            {
              campo: "A3_Skill12_3",
              facoltativo: true,
            },
            {
              campo: "A3_Skill12_4",
              id: "EN12_5",
              facoltativo: true,
            },
            {
              campo: "A3_Skill7",
              id: "EN7_1",
            },
            {
              campo: "A3_Skill8",
              id: "EN8_1",
            },
            {
              campo: "A3_Skill9",
              id: "EN9_1",
            },
            {
              campo: "A3_Skill10",
              id: "EN10_1",
            },
            {
              campo: "A3_Skill11",
              tipo: "checkbox",
              gestore: function () {
                Skill3SW_2();
                calc();
              },
              etichetta: "Marionette Control",
            },
            {
              campo: "A3_Skill11_STR",
              etichetta: "Controller's Stats: ",
              facoltativo: true,
            },
            {
              campo: "A3_Skill11_AGI",
              facoltativo: true,
            },
            {
              campo: "A3_Skill11_VIT",
              facoltativo: true,
            },
            {
              campo: "A3_Skill11_INT",
              facoltativo: true,
            },
            {
              campo: "A3_Skill11_DEX",
              facoltativo: true,
            },
            {
              campo: "A3_Skill11_LUK",
              facoltativo: true,
            },
            {
              campo: "A3_Skill11a",
              tipo: "checkbox",
              etichetta: "Status compensation (adjustment for equipment / human calculation)",
              facoltativo: true,
            },
          ],
        },
      ],
    );
    n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>';
    var _ = [202, 203, 204, 205, 210, 212, 213, 223, 217, 219, 220, 0, 211];
    // EN11_1 e' la riga di Marionette Control, senza nome di skill
    for (i = 0; i <= 12; i++) if (i != 11) scrivi("EN" + i + "_1", skillName(_[i]));
    opzioni(c.A3_Skill0_1, numeri(0, 10));
    opzioni(c.A3_Skill1_1, numeri(0, 10));
    opzioni(c.A3_Skill2_1, numeri(0, 10));
    opzioni(c.A3_Skill3_1, numeri(0, 10));
    opzioni(c.A3_Skill4_1, numeri(0, 10));
    opzioni(c.A3_Skill5_1, numeri(0, 10));
    opzioni(c.A3_Skill6_1, numeri(0, 10));
    opzioni(c.A3_Skill12_1, numeri(0, 10));
    opzioni(c.A3_Skill7, numeri(0, 5));
    opzioni(c.A3_Skill8, numeri(0, 5));
    opzioni(c.A3_Skill9, numeri(0, 5));
    opzioni(c.A3_Skill10, numeri(0, 5));
    c.A3_Skill0_1.value = n_A_Buf3[0];
    c.A3_Skill1_1.value = n_A_Buf3[1];
    c.A3_Skill2_1.value = n_A_Buf3[2];
    c.A3_Skill3_1.value = n_A_Buf3[3];
    c.A3_Skill4_1.value = n_A_Buf3[4];
    c.A3_Skill5_1.value = n_A_Buf3[5];
    c.A3_Skill6_1.value = n_A_Buf3[6];
    c.A3_Skill12_1.value = n_A_Buf3[37];
    c.A3_Skill7.value = n_A_Buf3[7];
    c.A3_Skill8.value = n_A_Buf3[8];
    c.A3_Skill9.value = n_A_Buf3[9];
    c.A3_Skill10.value = n_A_Buf3[10];
    c.A3_Skill11.checked = n_A_Buf3[11];
    Skill3SW_2();
  } else {
    chiudiPannello("SP_SIEN01");
    var n;
    for (i = 0; i <= 11; i++) SWs3sw[i] = 0;
  }
  A3(0);
}
function Skill3SW_2() {
  n_A_Buf3[0] = 1 * c.A3_Skill0_1.value;
  n_A_Buf3[1] = 1 * c.A3_Skill1_1.value;
  n_A_Buf3[2] = 1 * c.A3_Skill2_1.value;
  n_A_Buf3[3] = 1 * c.A3_Skill3_1.value;
  n_A_Buf3[4] = 1 * c.A3_Skill4_1.value;
  n_A_Buf3[5] = 1 * c.A3_Skill5_1.value;
  n_A_Buf3[6] = 1 * c.A3_Skill6_1.value;
  n_A_Buf3[37] = 1 * c.A3_Skill12_1.value;
  n_A_Buf3[11] = 1 * c.A3_Skill11.checked;
  if (n_A_Buf3[0] != 0) {
    if (SWs3sw[0] == 0) {
      if (n_A_Buf3[20] == 0) {
        n_A_Buf3[20] = 100;
        n_A_Buf3[19] = 100;
        n_A_Buf3[30] = 10;
      }
      scrivi("EN0_3", "Bard's AGI<br>Bard's LUK");
      campo("A3_Skill0_2", "select", function () {
        A3(1);
      });
      campo("A3_Skill0_4", "select", function () {
        A3(1);
      });
      scrivi("EN0_5", "Musical Lessons");
      campo("A3_Skill0_3", "select", function () {
        A3(1);
      });
      opzioni(c.A3_Skill0_2, numeri(1, 200));
      opzioni(c.A3_Skill0_4, numeri(1, 200));
      opzioni(c.A3_Skill0_3, numeri(0, 10));
      SWs3sw[0] = 1;
      c.A3_Skill0_2.value = n_A_Buf3[20];
      c.A3_Skill0_4.value = n_A_Buf3[19];
      c.A3_Skill0_3.value = n_A_Buf3[30];
    }
  } else {
    SWs3sw[0] = 0;
    scrivi("EN0_3", "");
    togliCampo("A3_Skill0_2");
    togliCampo("A3_Skill0_4");
    scrivi("EN0_5", "");
    togliCampo("A3_Skill0_3");
  }
  if (n_A_Buf3[1] != 0) {
    if (SWs3sw[1] == 0) {
      if (n_A_Buf3[21] == 0) {
        n_A_Buf3[21] = 100;
        n_A_Buf3[31] = 10;
      }
      scrivi("EN1_3", "Bard's AGI");
      campo("A3_Skill1_2", "select", function () {
        A3(1);
      });
      scrivi("EN1_5", "Musical Lessons");
      campo("A3_Skill1_3", "select", function () {
        A3(1);
      });
      opzioni(c.A3_Skill1_2, numeri(1, 200));
      opzioni(c.A3_Skill1_3, numeri(0, 10));
      SWs3sw[1] = 1;
      c.A3_Skill1_2.value = n_A_Buf3[21];
      c.A3_Skill1_3.value = n_A_Buf3[31];
    }
  } else {
    SWs3sw[1] = 0;
    scrivi("EN1_3", "");
    togliCampo("A3_Skill1_2");
    scrivi("EN1_5", "");
    togliCampo("A3_Skill1_3");
  }
  if (n_A_Buf3[2] != 0) {
    if (SWs3sw[2] == 0) {
      if (n_A_Buf3[22] == 0) {
        n_A_Buf3[22] = 100;
        n_A_Buf3[29] = 100;
        n_A_Buf3[32] = 10;
      }
      scrivi("EN2_3", "Bard's DEX<br>Bard's INT");
      campo("A3_Skill2_2", "select", function () {
        A3(1);
      });
      campo("A3_Skill2_3", "select", function () {
        A3(1);
      });
      scrivi("EN2_5", "Musical Lessons");
      campo("A3_Skill2_4", "select", function () {
        A3(1);
      });
      opzioni(c.A3_Skill2_2, numeri(1, 150));
      opzioni(c.A3_Skill2_3, numeri(1, 150));
      opzioni(c.A3_Skill2_2, numeri(151, 200), 150);
      opzioni(c.A3_Skill2_4, numeri(0, 10));
      SWs3sw[2] = 1;
      c.A3_Skill2_2.value = n_A_Buf3[22];
      c.A3_Skill2_3.value = n_A_Buf3[29];
      c.A3_Skill2_4.value = n_A_Buf3[32];
    }
  } else {
    SWs3sw[2] = 0;
    scrivi("EN2_3", "");
    togliCampo("A3_Skill2_2");
    togliCampo("A3_Skill2_3");
    scrivi("EN2_5", "");
    togliCampo("A3_Skill2_4");
  }
  if (n_A_Buf3[3] != 0) {
    if (SWs3sw[3] == 0) {
      if (n_A_Buf3[23] == 0) {
        n_A_Buf3[23] = 100;
        n_A_Buf3[33] = 10;
      }
      scrivi("EN3_3", "Bard's VIT");
      campo("A3_Skill3_2", "select", function () {
        A3(1);
      });
      scrivi("EN3_5", "Musical Lessons");
      campo("A3_Skill3_3", "select", function () {
        A3(1);
      });
      opzioni(c.A3_Skill3_2, numeri(1, 200));
      opzioni(c.A3_Skill3_3, numeri(0, 10));
      SWs3sw[3] = 1;
      c.A3_Skill3_2.value = n_A_Buf3[23];
      c.A3_Skill3_3.value = n_A_Buf3[33];
    }
  } else {
    SWs3sw[3] = 0;
    scrivi("EN3_3", "");
    togliCampo("A3_Skill3_2");
    scrivi("EN3_5", "");
    togliCampo("A3_Skill3_3");
  }
  if (n_A_Buf3[4] != 0) {
    if (SWs3sw[4] == 0) {
      if (n_A_Buf3[24] == 0) {
        n_A_Buf3[24] = 130;
        n_A_Buf3[34] = 10;
      }
      scrivi("EN4_3", "Dancer's DEX");
      campo("A3_Skill4_2", "select", function () {
        A3(1);
      });
      scrivi("EN4_5", "Dancing Lessons");
      campo("A3_Skill4_3", "select", function () {
        A3(1);
      });
      opzioni(c.A3_Skill4_2, numeri(1, 200));
      opzioni(c.A3_Skill4_3, numeri(0, 10));
      SWs3sw[4] = 1;
      c.A3_Skill4_2.value = n_A_Buf3[24];
      c.A3_Skill4_3.value = n_A_Buf3[34];
    }
  } else {
    SWs3sw[4] = 0;
    scrivi("EN4_3", "");
    togliCampo("A3_Skill4_2");
    scrivi("EN4_5", "");
    togliCampo("A3_Skill4_3");
  }
  if (n_A_Buf3[5] != 0) {
    if (SWs3sw[5] == 0) {
      if (n_A_Buf3[25] == 0) {
        n_A_Buf3[25] = 50;
        n_A_Buf3[35] = 10;
      }
      scrivi("EN5_3", "Dancer's LUK");
      campo("A3_Skill5_2", "select", function () {
        A3(1);
      });
      scrivi("EN5_5", "Dancing Lessons");
      campo("A3_Skill5_3", "select", function () {
        A3(1);
      });
      opzioni(c.A3_Skill5_2, numeri(1, 200));
      opzioni(c.A3_Skill5_3, numeri(0, 10));
      SWs3sw[5] = 1;
      c.A3_Skill5_2.value = n_A_Buf3[25];
      c.A3_Skill5_3.value = n_A_Buf3[35];
    }
  } else {
    SWs3sw[5] = 0;
    scrivi("EN5_3", "");
    togliCampo("A3_Skill5_2");
    scrivi("EN5_5", "");
    togliCampo("A3_Skill5_3");
  }
  if (n_A_Buf3[6] != 0) {
    if (SWs3sw[6] == 0) {
      if (n_A_Buf3[26] == 0) {
        n_A_Buf3[26] = 50;
        n_A_Buf3[36] = 10;
      }
      scrivi("EN6_3", "Dancer's INT");
      campo("A3_Skill6_2", "select", function () {
        A3(1);
      });
      scrivi("EN6_5", "Dancing Lessons");
      campo("A3_Skill6_3", "select", function () {
        A3(1);
      });
      opzioni(c.A3_Skill6_2, numeri(1, 200));
      opzioni(c.A3_Skill6_3, numeri(0, 10));
      SWs3sw[6] = 1;
      c.A3_Skill6_2.value = n_A_Buf3[26];
      c.A3_Skill6_3.value = n_A_Buf3[36];
    }
  } else {
    SWs3sw[6] = 0;
    scrivi("EN6_3", "");
    togliCampo("A3_Skill6_2");
    scrivi("EN6_5", "");
    togliCampo("A3_Skill6_3");
  }
  if (n_A_Buf3[37] != 0) {
    if (SWs3sw[7] == 0) {
      if (n_A_Buf3[38] == 0) {
        n_A_Buf3[38] = 130;
        n_A_Buf3[39] = 130;
        n_A_Buf3[27] = 10;
      }
      scrivi("EN12_3", "Dancer's DEX<br>Dancer's AGI");
      campo("A3_Skill12_2", "select", function () {
        A3(1);
      });
      campo("A3_Skill12_3", "select", function () {
        A3(1);
      });
      scrivi("EN12_5", "Dancing Lessons");
      campo("A3_Skill12_4", "select", function () {
        A3(1);
      });
      opzioni(c.A3_Skill12_2, numeri(1, 200));
      opzioni(c.A3_Skill12_3, numeri(1, 200));
      opzioni(c.A3_Skill12_4, numeri(0, 10));
      SWs3sw[7] = 1;
      c.A3_Skill12_2.value = n_A_Buf3[38];
      c.A3_Skill12_3.value = n_A_Buf3[39];
      c.A3_Skill12_4.value = n_A_Buf3[27];
    }
  } else {
    SWs3sw[7] = 0;
    scrivi("EN12_3", "");
    togliCampo("A3_Skill12_2");
    togliCampo("A3_Skill12_3");
    scrivi("EN12_5", "");
    togliCampo("A3_Skill12_4");
  }
  if (n_A_Buf3[11] != 0) {
    if (SWs3sw[11] == 0) {
      campo("A3_Skill11_STR", "select", function () {
        A3(1);
      });
      campo("A3_Skill11_AGI", "select", function () {
        A3(1);
      });
      campo("A3_Skill11_VIT", "select", function () {
        A3(1);
      });
      campo("A3_Skill11_INT", "select", function () {
        A3(1);
      });
      campo("A3_Skill11_DEX", "select", function () {
        A3(1);
      });
      campo("A3_Skill11_LUK", "select", function () {
        A3(1);
      });
      campo("A3_Skill11a", "checkbox", function () {
        A3(1);
      });
      opzioni(c.A3_Skill11_STR, [[0, "STR"]]);
      opzioni(c.A3_Skill11_AGI, [[0, "AGI"]]);
      opzioni(c.A3_Skill11_VIT, [[0, "VIT"]]);
      opzioni(c.A3_Skill11_INT, [[0, "INT"]]);
      opzioni(c.A3_Skill11_DEX, [[0, "DEX"]]);
      opzioni(c.A3_Skill11_LUK, [[0, "LUK"]]);
      opzioni(c.A3_Skill11_STR, numeri(1, 99), 1);
      opzioni(c.A3_Skill11_AGI, numeri(1, 99), 1);
      opzioni(c.A3_Skill11_VIT, numeri(1, 99), 1);
      opzioni(c.A3_Skill11_INT, numeri(1, 99), 1);
      opzioni(c.A3_Skill11_DEX, numeri(1, 99), 1);
      opzioni(c.A3_Skill11_LUK, numeri(1, 99), 1);
      SWs3sw[11] = 1;
      c.A3_Skill11_STR.value = n_A_Buf3[12];
      c.A3_Skill11_AGI.value = n_A_Buf3[13];
      c.A3_Skill11_VIT.value = n_A_Buf3[14];
      c.A3_Skill11_INT.value = n_A_Buf3[15];
      c.A3_Skill11_DEX.value = n_A_Buf3[16];
      c.A3_Skill11_LUK.value = n_A_Buf3[17];
      c.A3_Skill11a.checked = n_A_Buf3[18];
    }
  } else {
    SWs3sw[11] = 0;
    togliCampo("A3_Skill11_STR");
    togliCampo("A3_Skill11_AGI");
    togliCampo("A3_Skill11_VIT");
    togliCampo("A3_Skill11_INT");
    togliCampo("A3_Skill11_DEX");
    togliCampo("A3_Skill11_LUK");
    togliCampo("A3_Skill11a");
  }
}
function A3(e) {
  if (e == 1) calc();
  for (var _ = 0, n = 0; n <= 17; n++)
    if ((n != 11 && n_A_Buf3[n] != 0) || (n == 11 && n_A_Buf3[37] != 0)) {
      _ = 1;
      break;
    }
  scrivi("A3used", _ == 0 ? "" : " [active]");
}
function Buf4SW(e) {
  n_Skill4SW = e;
  if (n_Skill4SW) {
    apriPannello(
      "SP_SIEN02",
      function () {
        A4(1);
      },
      [
        {
          titolo: null,
          voci: [
            {
              campo: "A3_Skill40",
              tipo: "checkbox",
              id: "EN40_1",
            },
            {
              campo: "A3_Skill41",
              id: "EN41_1",
            },
            {
              campo: "A3_Skill42",
              id: "EN42_1",
            },
            {
              campo: "A3_Skill43",
              id: "EN43_1",
            },
            {
              campo: "A3_Skill44",
              id: "EN44_1",
            },
          ],
        },
      ],
    );
    _ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>';
    name_CS4SW_SKILL = [
      "Battle Orders",
      "Great Leadership",
      "Wounds of Glory",
      "Soul of Cold",
      "Sharp Hawk Eyes",
    ];
    for (i = 0; i <= 4; i++) scrivi("EN4" + i + "_1", name_CS4SW_SKILL[i]);
    opzioni(c.A3_Skill41, numeri(0, 5));
    opzioni(c.A3_Skill42, numeri(0, 5));
    opzioni(c.A3_Skill43, numeri(0, 5));
    opzioni(c.A3_Skill44, numeri(0, 5));
    c.A3_Skill40.checked = n_A_Buf3[40];
    c.A3_Skill41.value = n_A_Buf3[41];
    c.A3_Skill42.value = n_A_Buf3[42];
    c.A3_Skill43.value = n_A_Buf3[43];
    c.A3_Skill44.value = n_A_Buf3[44];
  } else {
    chiudiPannello("SP_SIEN02");
    var _;
  }
  A4(0);
}
function A4(e) {
  if (e == 1) calc();
  for (var _ = 0, n = 40; n <= 44; n++)
    if (n_A_Buf3[n] != 0) {
      _ = 1;
      break;
    }
  scrivi("A4used", _ == 0 ? "" : " [active]");
}
function Buf6SW(e) {
  n_Skill6SW = e;
  if (n_Skill6SW) {
    apriPannello(
      "SP_SIEN04",
      function () {
        A6(1);
      },
      [
        {
          titolo: null,
          voci: [
            {
              campo: "A8_Skill0",
              etichetta: '<font size="2"><b>Pets </b></font>',
            },
            {
              campo: "A6_Skill0",
              gestore: function () {
                StAllCalc();
              },
              etichetta:
                '<span class="name"><font size="2"><b>Temporary Card/Item active effects </b></font><span class="nametext">(Duration and chance are ignored)</span></span>',
            },
            {
              campo: "A6_Skill1",
            },
            {
              campo: "A_debuf2",
              tipo: "checkbox",
              etichetta: "Poison",
            },
            {
              campo: "A8_Skill8",
            },
            {
              campo: "A6_Skill5",
              etichetta: "Provoke (self)",
            },
            {
              campo: "A6_Skill12",
              tipo: "checkbox",
              etichetta: "Stun",
            },
            {
              campo: "A8_Skill9",
            },
            {
              campo: "A6_Skill4",
              etichetta: "Mind Breaker (self)",
            },
            {
              campo: "A6_Skill15",
              tipo: "checkbox",
              etichetta: "Freeze",
            },
            {
              campo: "A8_Skill10",
            },
            {
              campo: "A_debuf1",
              etichetta: "AGI Down",
            },
            {
              campo: "A_debuf3",
              tipo: "checkbox",
              etichetta: "Curse",
            },
            {
              campo: "A8_Skill11",
            },
            {
              campo: "A_debuf0",
              etichetta: "Quagmire",
            },
            {
              campo: "A6_Skill11",
              tipo: "checkbox",
              etichetta: "Blind",
            },
            {
              nota: '<font size="2"><b>EXP Items &amp; Variables</b></font>',
            },
            {
              campo: "A6_Skill3",
              tipo: "checkbox",
              etichetta: skillName(442),
            },
            {
              campo: "A6_Skill14",
              tipo: "checkbox",
              etichetta: "Sleep",
            },
            {
              campo: "A8_Skill3",
              etichetta: "Server Base Experience Rate ",
            },
            {
              campo: "A6_Skill8",
              tipo: "checkbox",
              etichetta: "Undead Attribute Change",
            },
            {
              campo: "A6_Skill13",
              tipo: "checkbox",
              etichetta: "Stone",
            },
            {
              campo: "A8_Skill7",
              etichetta: "Server Job Experience Rate ",
            },
            {
              campo: "A6_Skill6",
              tipo: "checkbox",
              etichetta: "Holy Armor [B.S.S.]",
            },
            {
              campo: "A6_Skill17",
              tipo: "checkbox",
              etichetta: "Bleeding",
            },
            {
              campo: "A8_Skill5",
              etichetta: "Partymember Count ",
            },
            {
              campo: "A6_Skill7",
              tipo: "checkbox",
              etichetta: "Magnum Break Bonus",
            },
            {
              campo: "A6_Skill16",
              tipo: "checkbox",
              etichetta: "Lex Aeterna",
            },
            {
              campo: "A8_Skill6",
              etichetta: "Exp Tap Bonus ",
            },
            {
              campo: "A6_Skill9",
              tipo: "checkbox",
              etichetta: "Set CRIT to 0%",
            },
            {
              campo: "A6_Skill18",
              etichetta: "Critical Wounds",
            },
            {
              campo: "A8_Skill1",
              etichetta: "Battle Manual ",
            },
            {
              campo: "A6_Skill10",
              tipo: "checkbox",
              id: "EN72_1",
              etichetta: "All Stats +1 [SuperNovice wife Undying Love bonus]",
            },
            {
              campo: "A8_Skill2",
              tipo: "checkbox",
              etichetta: "Job Manual 50",
            },
          ],
        },
      ],
    );
    o += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>';
    var pet = function (n) {
      return [m_PET[n][0], m_PET[n][1]];
    };
    opzioni(c.A8_Skill0, [pet(m_PET_SORT[0])]);
    gruppo(c.A8_Skill0, "CLASSIC PETS", m_PET_SORT.slice(1, 61).map(pet));
    gruppo(c.A8_Skill0, "EVOLVED PETS & OTHER NEW PETS", m_PET_SORT.slice(61).map(pet));
    var effetti = m_TempEffect_SORT.map(function (n) {
      return [n, m_TempEffect[n][1] + " [" + m_TempEffect[n][2] + "]"];
    });
    opzioni(c.A8_Skill8, effetti);
    opzioni(c.A8_Skill9, effetti);
    opzioni(c.A8_Skill10, effetti);
    opzioni(c.A8_Skill11, effetti);
    opzioni(c.A8_Skill1, [
      [0, "None"],
      [1, "25"],
      [2, "50"],
      [4, "100"],
    ]);
    opzioni(c.A8_Skill3, [[0, "1x"]]);
    opzioni(
      c.A8_Skill3,
      serie(1, 199, function (i) {
        return [i, 1 + 1 * i + "x"];
      }),
      1,
    );
    opzioni(c.A8_Skill7, [[0, "1x"]]);
    opzioni(
      c.A8_Skill7,
      serie(1, 199, function (i) {
        return [i, 1 + 1 * i + "x"];
      }),
      1,
    );
    opzioni(
      c.A8_Skill5,
      serie(1, 12, function (i) {
        return [i - 1, i];
      }),
    );
    opzioni(c.A8_Skill6, [[0, "-"]]);
    opzioni(
      c.A8_Skill6,
      serie(1, 20, function (i) {
        return [i, "+" + 25 * i + "%"];
      }),
      1,
    );
    c.A8_Skill0.value = n_A_Buf8[0];
    c.A8_Skill1.value = n_A_Buf8[1];
    c.A8_Skill2.checked = n_A_Buf8[2];
    c.A8_Skill3.value = n_A_Buf8[3];
    c.A8_Skill5.value = n_A_Buf8[5];
    c.A8_Skill6.value = n_A_Buf8[6];
    c.A8_Skill7.value = n_A_Buf8[7];
    c.A8_Skill8.value = n_A_Buf8[8];
    c.A8_Skill9.value = n_A_Buf8[9];
    c.A8_Skill10.value = n_A_Buf8[10];
    c.A8_Skill11.value = n_A_Buf8[11];
    opzioni(c.A6_Skill0, [
      [0, "Volcano"],
      [1, "Deluge"],
      [2, "Violent Gale"],
    ]);
    opzioni(c.A6_Skill1, numeri(0, 5));
    opzioni(c.A6_Skill4, numeri(0, 5));
    opzioni(c.A6_Skill18, numeri(0, 5));
    opzioni(c.A6_Skill5, numeri(0, 10));
    opzioni(c.A_debuf0, [[0, "-"]]);
    opzioni(c.A_debuf0, numeri(1, 5), 1);
    opzioni(c.A_debuf1, [[0, "-"]]);
    opzioni(
      c.A_debuf1,
      serie(1, 10, function (i) {
        return [i, "Lvl " + i];
      }),
      1,
    );
    opzioni(c.A_debuf1, [[46, "Lvl 46"]], 11);
    c.A6_Skill0.value = n_A_Buf6[0];
    c.A6_Skill1.value = n_A_Buf6[1];
    c.A6_Skill3.checked = n_A_Buf6[3];
    c.A6_Skill4.value = n_A_Buf6[4];
    c.A6_Skill5.value = n_A_Buf6[5];
    c.A6_Skill6.checked = n_A_Buf6[6];
    c.A6_Skill7.checked = n_A_Buf6[7];
    c.A6_Skill8.checked = n_A_Buf6[8];
    c.A6_Skill9.checked = n_A_Buf6[9];
    c.A6_Skill10.checked = n_A_Buf6[10];
    c.A6_Skill11.checked = n_A_Buf6[11];
    c.A6_Skill12.checked = n_A_Buf6[12];
    c.A6_Skill13.checked = n_A_Buf6[13];
    c.A6_Skill14.checked = n_A_Buf6[14];
    c.A6_Skill15.checked = n_A_Buf6[15];
    c.A6_Skill16.checked = n_A_Buf6[16];
    c.A6_Skill17.checked = n_A_Buf6[17];
    c.A6_Skill18.value = n_A_Buf6[18];
    c.A_debuf0.value = n_A_Buf6[19];
    c.A_debuf1.value = n_A_Buf6[20];
    c.A_debuf2.checked = n_A_Buf6[21];
    c.A_debuf3.checked = n_A_Buf6[22];
  } else {
    chiudiPannello("SP_SIEN04");
    var o;
  }
  A6(0);
}
function A6(e) {
  if (e == 1) calc();
  for (var _ = 0, n = 0; n < n_A_Buf6.length; n++)
    if (n != 0 && n_A_Buf6[n] != 0) {
      _ = 1;
      break;
    }
  for (n = 0; n < n_A_Buf8.length; n++)
    if (n_A_Buf8[n] != 0) {
      _ = 1;
      break;
    }
  scrivi("A6used", _ == 0 ? "" : " [active]");
}
function SetSpeedPotionOptions() {
  var puoBerserk =
    n_A_JobClass() == 1 ||
    n_A_JobClass() == 6 ||
    n_A_JobClass() == 41 ||
    n_A_JobClass2() == 14 ||
    n_A_JobClass2() == 11 ||
    n_A_JOB == 5 ||
    n_A_JOB == 45;
  opzioni(
    c.A_SpeedPOT,
    [
      n_A_JOB != 3 && n_A_JobClass2() != 9 && n_A_JobClass2() != 16
        ? [2, SpeedPotName[2]]
        : [0, "-"],
      puoBerserk ? [3, SpeedPotName[3] + " (Lvl 85)"] : [3, "* (" + m_Skill[304][2] + ", Lvl 85)"],
    ],
    2,
  );
  if (n_A_JOB == 22) opzioni(c.A_SpeedPOT, [[4, "Poison Bottle"]], 4);
  else {
    c.A_SpeedPOT.length = 4;
    if (n_A_Buf7[35] == 4) n_A_Buf7[35] = 0;
  }
  c.A_SpeedPOT.value = n_A_Buf7[35];
}
function Buf7SW(e) {
  n_Skill7SW = e;
  if (n_Skill7SW) {
    apriPannello(
      "SP_SIEN05",
      function () {
        A7(1);
      },
      [
        {
          titolo: null,
          voci: [
            {
              campo: "A_SpeedPOT",
              opzioni: [["0", "(no Speed Potion)"]],
            },
            {
              campo: "A7_Skill42",
              opzioni: [["0", "(none)"]],
            },
            {
              campo: "A7_Skill39",
              opzioni: [["0", "(no HP Increase Potion)"]],
            },
            {
              campo: "A7_Skill40",
              opzioni: [["0", "(no SP Increase Potion)"]],
            },
            {
              campo: "A7_Skill31",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Aloevera<span class="nametext">Self Provoke Lvl 1</span></span>',
            },
            {
              campo: "A7_Skill26",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Guarana Candy<span class="nametext">Increase AGI Lvl 5, ASPD +10% (same as Concentration Potion)</span></span>',
            },
            {
              campo: "A7_Skill45",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Regeneration Potion<span class="nametext">Items/skills recover +20%</span></span>',
            },
            {
              campo: "A7_Skill44",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Ginger Bread<span class="nametext">ASPD +15% (same as Awakening Potion)</span></span>',
            },
            {
              campo: "A7_Skill32",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Small/Big Defense Potion<span class="nametext">DEF +3</span></span>',
            },
            {
              campo: "A7_Skill33",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Small/Big Magic Defense Potion<span class="nametext">MDEF +3</span></span>',
            },
            {
              campo: "A7_Skill36",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Halo-Halo / Luxurious Western Food<span class="nametext">All Stats +3</span></span>',
            },
            {
              campo: "A7_Skill37",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Lucky Rice Cake<span class="nametext">LUK +21</span></span>',
            },
            {
              campo: "A7_Skill34",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Box of Gloom<span class="nametext">' +
                skillName(42) +
                " Lvl 1</span></span>",
            },
            {
              campo: "A7_Skill10",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Box of Drowsiness<span class="nametext">MATK +20</span></span>',
            },
            {
              campo: "A7_Skill9",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Box of Resentment<span class="nametext">ATK +20</span></span>',
            },
            {
              campo: "A7_Skill38",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Distilled Fighting Spirit<span class="nametext">ATK +30</span></span>',
            },
            {
              campo: "A7_Skill16",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Buche de Noel<span class="nametext">HIT +3%, CRIT +7, MaxHP&amp;SP +3%</span></span>',
            },
            {
              campo: "A7_Skill46",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Tyr\'s Blessing<span class="nametext">FLEE +30, HIT +30, ATK +20, MATK +20</span></span>',
            },
            {
              campo: "A7_Skill2",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Rainbow Cake<span class="nametext">ATK +10, MATK +10</span></span>',
            },
            {
              campo: "A7_Skill1",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Honey Pastry<span class="nametext">FLEE +30</span></span>',
            },
            {
              campo: "A7_Skill0",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Sesame Pastry<span class="nametext">HIT +30</span></span>',
            },
          ],
        },
        {
          titolo: "Stat Foods",
          voci: [
            {
              campo: "A7_Skill3",
              etichetta: "STR",
            },
            {
              campo: "A7_Skill4",
              etichetta: "AGI",
            },
            {
              campo: "A7_Skill5",
              etichetta: "VIT",
            },
            {
              campo: "A7_Skill6",
              etichetta: "INT",
            },
            {
              campo: "A7_Skill7",
              etichetta: "DEX",
            },
            {
              campo: "A7_Skill8",
              etichetta: "LUK",
            },
          ],
        },
        {
          titolo: "Stat+20 Foods",
          voci: [
            {
              campo: "A7_Skill41",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Savage BBQ<span class="nametext">STR +20</span></span>',
            },
            {
              campo: "A7_Skill47",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Cocktail Warg Blood<span class="nametext">AGI +20</span></span>',
            },
            {
              campo: "A7_Skill48",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Minor Stew<span class="nametext">VIT +20</span></span>',
            },
            {
              campo: "A7_Skill49",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Siroma Iced Tea<span class="nametext">INT +20</span></span>',
            },
            {
              campo: "A7_Skill50",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Drosera Herb Salad<span class="nametext">DEX +20</span></span>',
            },
            {
              campo: "A7_Skill51",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Petite Tail Noodles<span class="nametext">LUK +20</span></span>',
            },
          ],
        },
        {
          titolo: "New World Food",
          voci: [
            {
              campo: "A7_Skill17",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Rune Strawberry Cake<span class="nametext">ATK +5, MATK +5</span></span>',
            },
            {
              campo: "A7_Skill18",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Schwartzwald Pine Jubilee<span class="nametext">HIT +10, Perfect Dodge +20</span></span>',
            },
            {
              campo: "A7_Skill19",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Arunafeltz Desert Sandwich<span class="nametext">CRIT +7</span></span>',
            },
            {
              campo: "A7_Skill20",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Manuk\'s Sturdiness<span class="nametext">ATK based damage on Manuk maps +10%</span></span>',
            },
            {
              campo: "A7_Skill21",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Manuk\'s Faith<span class="nametext">MATK based damage on Manuk maps +10%</span></span>',
            },
            {
              campo: "A7_Skill22",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Manuk\'s Will<span class="nametext">Received damage on Manuk maps -10%</span></span>',
            },
            {
              campo: "A7_Skill23",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Pinguicula\'s Fruit Jam<span class="nametext">ATK based dmg on Splendide maps +10%</span></span>',
            },
            {
              campo: "A7_Skill24",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Cornus\' Tear<span class="nametext">MATK based damage on Splendide maps +10%</span></span>',
            },
            {
              campo: "A7_Skill25",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Luciola\'s Honey Jam<span class="nametext">Received damage on Splendide maps -10%</span></span>',
            },
          ],
        },
        {
          titolo: "Battle Grounds Food",
          voci: [
            {
              campo: "A7_Skill27",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Military Ration B<span class="nametext">HIT +33</span></span>',
            },
            {
              campo: "A7_Skill28",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Military Ration C<span class="nametext">FLEE +33</span></span>',
            },
            {
              campo: "A7_Skill29",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Tasty Pink Ration<span class="nametext">ATK +15</span></span>',
            },
            {
              campo: "A7_Skill30",
              tipo: "checkbox",
              etichetta:
                '<span class="name">Tasty White Ration<span class="nametext">MATK +15</span></span>',
            },
          ],
        },
        {
          titolo: "Elemental Resist Pot.",
          voci: [
            {
              campo: "A7_Skill11",
              tipo: "checkbox",
              etichetta: "Coldproof Potion",
            },
            {
              campo: "A7_Skill12",
              tipo: "checkbox",
              etichetta: "Earthproof Potion",
            },
            {
              campo: "A7_Skill13",
              tipo: "checkbox",
              etichetta: "Fireproof Potion",
            },
            {
              campo: "A7_Skill14",
              tipo: "checkbox",
              etichetta: "Thunderproof Potion",
            },
          ],
        },
      ],
    );
    _ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>';
    // Stat Foods: +0 ... +10 (il nome della statistica e' l'etichetta)
    ["A7_Skill3", "A7_Skill4", "A7_Skill5", "A7_Skill6", "A7_Skill7", "A7_Skill8"].forEach(
      function (nome) {
        opzioni(
          c[nome],
          serie(0, 10, function (i) {
            return [i, "+" + i];
          }),
        );
      },
    );
    opzioni(c.A7_Skill39, [
      [0, "(no HP Increase Potion)"],
      [1, "Small HP Increase Potion"],
      [2, "Medium HP Increase Potion"],
      [3, "Large HP Increase Potion"],
    ]);
    opzioni(c.A7_Skill40, [
      [0, "(no SP Increase Potion)"],
      [1, "Small SP Increase Potion"],
      [2, "Medium SP Increase Potion"],
      [3, "Large SP Increase Potion"],
    ]);
    opzioni(c.A7_Skill42, [
      [0, "(no Mega Resist Potion)"],
      [
        1,
        "Mega Resist Potion [+10% resistance to Blind, Bleeding, Confusion, Curse, Frozen, Poison, Silence, Sleep, Stun and Stone Curse status effects]",
      ],
      [
        2,
        "Mega Resist Potion (iRO) [+20% resistance to Blind, Bleeding, Confusion, Curse, Frozen, Poison, Silence, Sleep, Stun and Stone Curse status effects]",
      ],
    ]);
    SpeedPotName = [
      "(no ASPD potion/item)",
      "Concentration Potion",
      "Awakening Potion (Lvl 40)",
      "Berserk Potion",
    ];
    opzioni(c.A_SpeedPOT, [
      [0, SpeedPotName[0]],
      [1, SpeedPotName[1]],
    ]);
    SetSpeedPotionOptions();
    c.A7_Skill0.checked = n_A_Buf7[0];
    c.A7_Skill1.checked = n_A_Buf7[1];
    c.A7_Skill2.checked = n_A_Buf7[2];
    c.A7_Skill3.value = n_A_Buf7[3];
    c.A7_Skill4.value = n_A_Buf7[4];
    c.A7_Skill5.value = n_A_Buf7[5];
    c.A7_Skill6.value = n_A_Buf7[6];
    c.A7_Skill7.value = n_A_Buf7[7];
    c.A7_Skill8.value = n_A_Buf7[8];
    c.A7_Skill9.checked = n_A_Buf7[9];
    c.A7_Skill10.checked = n_A_Buf7[10];
    c.A7_Skill11.checked = n_A_Buf7[11];
    c.A7_Skill12.checked = n_A_Buf7[12];
    c.A7_Skill13.checked = n_A_Buf7[13];
    c.A7_Skill14.checked = n_A_Buf7[14];
    c.A7_Skill16.checked = n_A_Buf7[16];
    c.A7_Skill17.checked = n_A_Buf7[17];
    c.A7_Skill18.checked = n_A_Buf7[18];
    c.A7_Skill19.checked = n_A_Buf7[19];
    c.A7_Skill20.checked = n_A_Buf7[20];
    c.A7_Skill21.checked = n_A_Buf7[21];
    c.A7_Skill22.checked = n_A_Buf7[22];
    c.A7_Skill23.checked = n_A_Buf7[23];
    c.A7_Skill24.checked = n_A_Buf7[24];
    c.A7_Skill25.checked = n_A_Buf7[25];
    c.A7_Skill26.checked = n_A_Buf7[26];
    c.A7_Skill27.checked = n_A_Buf7[27];
    c.A7_Skill28.checked = n_A_Buf7[28];
    c.A7_Skill29.checked = n_A_Buf7[29];
    c.A7_Skill30.checked = n_A_Buf7[30];
    c.A7_Skill31.checked = n_A_Buf7[31];
    c.A7_Skill32.checked = n_A_Buf7[32];
    c.A7_Skill33.checked = n_A_Buf7[33];
    c.A7_Skill34.checked = n_A_Buf7[34];
    c.A_SpeedPOT.value = n_A_Buf7[35];
    c.A7_Skill36.checked = n_A_Buf7[36];
    c.A7_Skill37.checked = n_A_Buf7[37];
    c.A7_Skill38.checked = n_A_Buf7[38];
    c.A7_Skill39.value = n_A_Buf7[39];
    c.A7_Skill40.value = n_A_Buf7[40];
    c.A7_Skill41.checked = n_A_Buf7[41];
    c.A7_Skill42.value = n_A_Buf7[42];
    c.A7_Skill44.checked = n_A_Buf7[44];
    c.A7_Skill45.checked = n_A_Buf7[45];
    c.A7_Skill46.checked = n_A_Buf7[46];
    c.A7_Skill47.checked = n_A_Buf7[47];
    c.A7_Skill48.checked = n_A_Buf7[48];
    c.A7_Skill49.checked = n_A_Buf7[49];
    c.A7_Skill50.checked = n_A_Buf7[50];
    c.A7_Skill51.checked = n_A_Buf7[51];
  } else {
    chiudiPannello("SP_SIEN05");
    var _;
  }
  A7(0);
}
function A7(e) {
  if (e == 1) calc();
  for (var _ = 0, n = 0; n < n_A_Buf7.length; n++)
    if (n_A_Buf7[n] != 0) {
      _ = 1;
      break;
    }
  scrivi("A7used", _ == 0 ? "" : " [active]");
}
function Buf9SW(e) {
  n_Skill9SW = e;
  if (n_Skill9SW) {
    var aggiorna = function () {
      A9(1);
    };
    // "+ [casella] etichetta"; ogni casella aggiorna il segno "attivo" (nell'originale onkeyup)
    var piu = function (campo, etichetta, segno) {
      return {
        campo: campo,
        tipo: "testo",
        gestore: aggiorna,
        etichetta: etichetta,
        segno: segno || "+",
        valore: "0",
      };
    };
    var bersagli = [
      {
        gruppo: "Race",
        opzioni: [
          ["0", "Formless"],
          ["1", "Undead"],
          ["2", "Brute"],
          ["3", "Plant"],
          ["4", "Insect"],
          ["5", "Fish"],
          ["6", "Demon"],
          ["7", "Demi-Human"],
          ["8", "Angel"],
          ["9", "Dragon"],
        ],
      },
      {
        gruppo: "Element",
        opzioni: [
          ["10", "Neutral "],
          ["11", "Water "],
          ["12", "Earth "],
          ["13", "Fire "],
          ["14", "Wind "],
          ["15", "Poison "],
          ["16", "Holy "],
          ["17", "Shadow "],
          ["18", "Ghost "],
          ["19", "Undead "],
        ],
      },
      {
        gruppo: "Size",
        opzioni: [
          ["20", "Small"],
          ["21", "Medium"],
          ["22", "Large"],
        ],
      },
    ];
    // "+ [casella] % vs [razza, elemento, taglia o tipo]": danno (0-3) e resistenza (4-7)
    var contro = function (k, tipi) {
      var elenco = {
        campo: "A9_Skill" + k,
        gestore: aggiorna,
        opzioni: bersagli.concat([
          {
            gruppo: "Type",
            opzioni: tipi,
          },
        ]),
      };
      return {
        riga: [
          "+",
          {
            campo: "ARG_RC" + k,
            tipo: "testo",
            gestore: aggiorna,
            valore: "0",
          },
          "% vs",
          elenco,
        ],
      };
    };
    var tipiDanno = [
      ["23", "Boss"],
      ["24", "Goblin"],
      ["25", "Golem"],
      ["26", "Guardian"],
      ["27", "Kobold"],
      ["28", "Orc"],
      ["29", "Satan Morroc"],
    ];
    var tipiResistenza = [
      ["23", "Boss"],
      ["24", "Normal"],
      ["25", "Guardian"],
    ];
    // "+ [casella] % [skill] skill damage."
    var danniSkill = function (k, j) {
      return {
        riga: [
          "+",
          {
            campo: "ARG_RC" + k,
            tipo: "testo",
            gestore: aggiorna,
            valore: "0",
          },
          "% ",
          {
            campo: "A9_Skill" + j,
            gestore: aggiorna,
          },
          " skill damage.",
        ],
      };
    };
    apriPannello("ID_ARG", null, [
      {
        titolo: '<font size="2"><b>Player Stats</b></font>',
        voci: [
          piu("ARG_RC32", "STR"),
          piu("ARG_RC33", "AGI"),
          piu("ARG_RC34", "VIT"),
          piu("ARG_RC35", "INT"),
          piu("ARG_RC36", "DEX"),
          piu("ARG_RC37", "LUK"),
        ],
      },
      {
        titolo: '<font size="2"><b>Player Sub-Stats</b></font>',
        voci: [
          piu("ARG_RC15", "MaxHP"),
          piu("ARG_RC19", "DEF"),
          piu("ARG_RC22", "FLEE"),
          piu("ARG_RC84", "ASPD"),
          piu("ARG_RC16", "% MaxHP"),
          piu("ARG_RC20", "MDEF"),
          piu("ARG_RC23", "Perfect Dodge"),
          piu("ARG_RC29", "% ASPD"),
          piu("ARG_RC17", "MaxSP"),
          piu("ARG_RC25", "ATK"),
          piu("ARG_RC21", "HIT"),
          piu("ARG_RC85", "Mastery ATK"),
          piu("ARG_RC18", "% MaxSP"),
          piu("ARG_RC27", "MATK"),
          piu("ARG_RC83", "% HIT"),
          piu("ARG_RC86", "% Cast Time", "–"),
          piu("ARG_RC30", "% HP Regen"),
          piu("ARG_RC38", "% ATK"),
          piu("ARG_RC40", "Perfect HIT"),
          piu("ARG_RC87", "% Cast Delay", "–"),
          piu("ARG_RC31", "% SP Regen"),
          piu("ARG_RC28", "% MATK"),
          piu("ARG_RC24", "Critical Rate"),
          piu("ARG_RC88", "Weight"),
        ],
      },
      {
        titolo: '<font size="2"><b>+% ATK based damage</b></font>',
        voci: [
          contro(0, tipiDanno),
          contro(1, tipiDanno),
          contro(2, tipiDanno),
          contro(3, tipiDanno),
        ],
      },
      {
        titolo: '<font size="2"><b>Other</b></font>',
        voci: [
          piu("ARG_RC26", "% ATK based damage on any target."),
          piu("ARG_RC39", "% MATK based damage on any target."),
          piu("ARG_RC41", "% Long-range ATK based damage on any target."),
          piu("ARG_RC42", "% Critical damage on any target."),
          piu("ARG_RC45", "% Long-range ATK and MATK based damage resistance."),
          piu("ARG_RC43", "% DEF ignoring on any target."),
          piu("ARG_RC44", "% MDEF ignoring on any target."),
          danniSkill(47, 8),
          danniSkill(48, 9),
        ],
      },
      {
        titolo: '<font size="2"><b>+% Resistance</b></font>',
        voci: [
          contro(4, tipiResistenza),
          contro(5, tipiResistenza),
          contro(6, tipiResistenza),
          contro(7, tipiResistenza),
        ],
      },
    ]);
    n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>';
    n += "</table></TD></TR>";
    opzioni(c.A9_Skill8, [[0, "(no skill selected)"]]);
    opzioni(
      c.A9_Skill8,
      serie(1, All_DMGskill.length - 1, function (i) {
        return [All_DMGskill[i], skillNameInSelect(m_Skill[All_DMGskill[i]][0])];
      }),
      1,
    );
    opzioni(c.A9_Skill9, [[0, "(no skill selected)"]]);
    opzioni(
      c.A9_Skill9,
      serie(1, All_DMGskill.length - 1, function (i) {
        return [All_DMGskill[i], skillNameInSelect(m_Skill[All_DMGskill[i]][0])];
      }),
      1,
    );
    c.A9_Skill0.value = n_A_Buf9[0];
    c.ARG_RC0.value = n_A_Buf9[1];
    c.A9_Skill1.value = n_A_Buf9[2];
    c.ARG_RC1.value = n_A_Buf9[3];
    c.A9_Skill2.value = n_A_Buf9[4];
    c.ARG_RC2.value = n_A_Buf9[5];
    c.A9_Skill3.value = n_A_Buf9[6];
    c.ARG_RC3.value = n_A_Buf9[7];
    c.A9_Skill4.value = n_A_Buf9[8];
    c.ARG_RC4.value = n_A_Buf9[9];
    c.A9_Skill5.value = n_A_Buf9[10];
    c.ARG_RC5.value = n_A_Buf9[11];
    c.A9_Skill6.value = n_A_Buf9[12];
    c.ARG_RC6.value = n_A_Buf9[13];
    c.A9_Skill7.value = n_A_Buf9[14];
    c.ARG_RC7.value = n_A_Buf9[15];
    c.ARG_RC43.value = n_A_Buf9[16];
    c.ARG_RC44.value = n_A_Buf9[17];
    c.ARG_RC45.value = n_A_Buf9[18];
    c.ARG_RC47.value = n_A_Buf9[19];
    c.A9_Skill8.value = n_A_Buf9[20];
    c.ARG_RC48.value = n_A_Buf9[21];
    c.A9_Skill9.value = n_A_Buf9[22];
    c.ARG_RC83.value = n_A_Buf9[23];
    c.ARG_RC84.value = n_A_Buf9[24];
    c.ARG_RC85.value = n_A_Buf9[25];
    c.ARG_RC86.value = n_A_Buf9[26];
    c.ARG_RC87.value = n_A_Buf9[27];
    c.ARG_RC88.value = n_A_Buf9[28];
    c.ARG_RC15.value = n_A_Buf9[30];
    c.ARG_RC16.value = n_A_Buf9[31];
    c.ARG_RC17.value = n_A_Buf9[32];
    c.ARG_RC18.value = n_A_Buf9[33];
    c.ARG_RC19.value = n_A_Buf9[34];
    c.ARG_RC20.value = n_A_Buf9[35];
    c.ARG_RC21.value = n_A_Buf9[36];
    c.ARG_RC22.value = n_A_Buf9[37];
    c.ARG_RC23.value = n_A_Buf9[38];
    c.ARG_RC24.value = n_A_Buf9[39];
    c.ARG_RC25.value = n_A_Buf9[40];
    c.ARG_RC26.value = n_A_Buf9[41];
    c.ARG_RC27.value = n_A_Buf9[42];
    c.ARG_RC28.value = n_A_Buf9[43];
    c.ARG_RC29.value = n_A_Buf9[44];
    c.ARG_RC30.value = n_A_Buf9[45];
    c.ARG_RC31.value = n_A_Buf9[46];
    c.ARG_RC32.value = n_A_Buf9[47];
    c.ARG_RC33.value = n_A_Buf9[48];
    c.ARG_RC34.value = n_A_Buf9[49];
    c.ARG_RC35.value = n_A_Buf9[50];
    c.ARG_RC36.value = n_A_Buf9[51];
    c.ARG_RC37.value = n_A_Buf9[52];
    c.ARG_RC38.value = n_A_Buf9[53];
    c.ARG_RC39.value = n_A_Buf9[54];
    c.ARG_RC40.value = n_A_Buf9[55];
    c.ARG_RC41.value = n_A_Buf9[56];
    c.ARG_RC42.value = n_A_Buf9[57];
  } else {
    chiudiPannello("ID_ARG");
    var n;
  }
  A9(0);
}
function A9(e) {
  if (e == 1) calc();
  for (var _ = 0, n = 1; n < 14; n += 2)
    if (n_A_Buf9[n] != 0) {
      _ = 1;
      break;
    }
  for (n = 15; n < n_A_Buf9.length; n++)
    if (n_A_Buf9[n] != 0) {
      _ = 1;
      break;
    }
  scrivi("A9used", _ == 0 ? "" : " [active]");
}
function Buf10SW(e) {
  n_Skill10SW = e;
  if (n_Skill10SW) {
    var aggiorna = function () {
      A10(1);
    };
    // "+ [casella] etichetta": ogni casella aggiorna il segno "attivo" (nell'originale onkeyup);
    // le voci barrate sono disabilitate
    var piu = function (campo, etichetta, disabilitato) {
      var v = {
        campo: campo,
        tipo: "testo",
        gestore: aggiorna,
        etichetta: etichetta,
        segno: "+",
        valore: "0",
      };
      if (disabilitato) v.disabilitato = true;
      return v;
    };
    var contro = function (k) {
      return {
        riga: [
          "+",
          {
            campo: "BRG_RC" + k,
            tipo: "testo",
            gestore: aggiorna,
            valore: "0",
          },
          "vs",
          {
            campo: "Bman" + k,
            gestore: aggiorna,
          },
        ],
      };
    };
    apriPannello("B_MANUAL", null, [
      {
        titolo: '<font size="2"><b>Enemy Stats</b></font>',
        voci: [
          piu("BRG_RC33", "AGI "),
          piu("BRG_RC34", "VIT"),
          piu("BRG_RC35", "INT"),
          piu("BRG_RC36", "DEX"),
          piu("BRG_RC37", "LUK"),
        ],
      },
      {
        titolo: '<font size="2"><b>Enemy Sub-Stats</b></font>',
        voci: [
          piu("BRG_RC15", "MaxHP"),
          piu("BRG_RC25", "ATK"),
          piu("BRG_RC21", "HIT"),
          piu("BRG_RC16", "<s>% MaxHP</s>", true),
          piu("BRG_RC38", "<s>Max ATK</s>", true),
          piu("BRG_RC40", "<s>Perfect HIT</s>", true),
          piu("BRG_RC19", "DEF"),
          piu("BRG_RC27", "MATK"),
          piu("BRG_RC24", "Critical Rate"),
          piu("BRG_RC20", "MDEF"),
          piu("BRG_RC28", "<s>Max MATK</s>", true),
          piu("BRG_RC22", "FLEE"),
          piu("BRG_RC29", "<s>% ASPD</s>", true),
          piu("BRG_RC23", "<s>Perfect Dodge</s>", true),
        ],
      },
      {
        titolo: '<font size="2"><b>Enemy\'s damage reductions:</b></font>',
        voci: [
          contro(1),
          piu("BRG_RC3", "% Size Resistance"),
          contro(2),
          piu("BRG_RC4", "% Long-range Resistance"),
          piu("BRG_RC0", "% Racial Resistance"),
          piu("BRG_RC10", "% Additional Reflect (equip/card)"),
          piu("BRG_RC26", "% ATK based damage on any target."),
          piu("BRG_RC39", "% MATK based damage on any target."),
        ],
      },
    ]);
    _ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>';
    opzioni(
      c.Bman1,
      serie(0, v_Element_.length - 1, function (i) {
        return [i, v_Element_[i]];
      }),
    );
    opzioni(
      c.Bman2,
      serie(0, v_Element_.length - 1, function (i) {
        return [i, v_Element_[i]];
      }),
    );
    c.BRG_RC0.value = n_B_manual[1];
    c.Bman1.value = n_B_manual[2];
    c.BRG_RC1.value = n_B_manual[3];
    c.Bman2.value = n_B_manual[4];
    c.BRG_RC2.value = n_B_manual[5];
    c.BRG_RC3.value = n_B_manual[7];
    c.BRG_RC4.value = n_B_manual[9];
    c.BRG_RC10.value = n_B_manual[21];
    c.BRG_RC15.value = n_B_manual[30];
    c.BRG_RC16.value = n_B_manual[31];
    c.BRG_RC19.value = n_B_manual[34];
    c.BRG_RC20.value = n_B_manual[35];
    c.BRG_RC21.value = n_B_manual[36];
    c.BRG_RC22.value = n_B_manual[37];
    c.BRG_RC23.value = n_B_manual[38];
    c.BRG_RC24.value = n_B_manual[39];
    c.BRG_RC25.value = n_B_manual[40];
    c.BRG_RC26.value = n_B_manual[41];
    c.BRG_RC27.value = n_B_manual[42];
    c.BRG_RC28.value = n_B_manual[43];
    c.BRG_RC29.value = n_B_manual[44];
    c.BRG_RC33.value = n_B_manual[48];
    c.BRG_RC34.value = n_B_manual[49];
    c.BRG_RC35.value = n_B_manual[50];
    c.BRG_RC36.value = n_B_manual[51];
    c.BRG_RC37.value = n_B_manual[52];
    c.BRG_RC38.value = n_B_manual[53];
    c.BRG_RC39.value = n_B_manual[54];
    c.BRG_RC40.value = n_B_manual[55];
  } else {
    chiudiPannello("B_MANUAL");
    var _;
  }
  A10(0);
}
function isNumeric(e) {
  var _ = e || window.event,
    n = _.keyCode || _.which;
  n = String.fromCharCode(n);
  if (!/[0-9]|-/.test(n)) {
    _.returnValue = false;
    if (_.preventDefault) _.preventDefault();
  }
}
function A10(e) {
  if (e == 1) calc();
  for (var _ = 0, n = 0; n < n_B_manual.length; n++)
    if (n_B_manual[n] != 0) {
      _ = 1;
      break;
    }
  scrivi("A10used", _ == 0 ? "" : " [active]");
}
function debufSW(e) {
  n_debufSW = e;
  if (n_debufSW) {
    apriPannello(
      "EnemyDebuf",
      function () {
        AI(1);
      },
      [
        {
          titolo: null,
          voci: [
            {
              campo: "B_debuf18",
              id: "BI18_1",
              etichetta: "Mind Breaker",
            },
            {
              campo: "B_debuf2",
              tipo: "checkbox",
              id: "BI2_1",
              etichetta: "Poison",
            },
            {
              campo: "B_debuf0",
              id: "BI0_1",
              etichetta: "Provoke",
            },
            {
              campo: "B_debuf3",
              tipo: "checkbox",
              id: "BI3_1",
              etichetta: "Blind",
            },
            {
              campo: "B_debuf12",
              id: "BI12_1",
              etichetta: "Signum Crucis",
            },
            {
              campo: "B_debuf10",
              tipo: "checkbox",
              id: "BI10_1",
              etichetta: "Curse",
            },
            {
              campo: "B_debuf5",
              tipo: "checkbox",
              id: "BI5_1",
              etichetta: "Blessing",
            },
            {
              campo: "B_debuf7",
              tipo: "checkbox",
              id: "BI7_1",
              etichetta: "Stun",
            },
            {
              campo: "B_debuf6",
              tipo: "checkbox",
              id: "BI6_1",
              etichetta: "Lex Aeterna",
            },
            {
              campo: "B_debuf4",
              tipo: "checkbox",
              id: "BI4_1",
              etichetta: "Frozen",
            },
            {
              campo: "B_debuf11",
              id: "BI11_1",
              etichetta: "Decrease AGI",
            },
            {
              campo: "B_debuf9",
              tipo: "checkbox",
              id: "BI9_1",
              etichetta: "Stone",
            },
            {
              campo: "B_debuf17",
              tipo: "checkbox",
              id: "BI17_1",
              etichetta: "Spider Web",
            },
            {
              campo: "B_debuf8",
              tipo: "checkbox",
              id: "BI8_1",
              etichetta: "Sleep",
            },
            {
              campo: "B_debuf1",
              id: "BI1_1",
              etichetta: "Quagmire",
            },
            {
              campo: "B_debuf19",
              tipo: "checkbox",
              id: "BI19_1",
              etichetta: skillName(211),
            },
            {
              campo: "B_debuf24",
              id: "BI24_1",
              etichetta: "Flying",
            },
            {
              campo: "B_debuf20",
              tipo: "checkbox",
              id: "BI20_1",
              etichetta: skillName(218),
            },
          ],
        },
        {
          titolo: "<b>Monster Exclusive Debuffs</b>",
          voci: [
            {
              campo: "B_debuf13",
              tipo: "checkbox",
              id: "BI13_1",
              etichetta: skillName(172) + " / Disarm",
            },
            {
              campo: "B_debuf14",
              tipo: "checkbox",
              id: "BI14_1",
              etichetta: skillName(173),
            },
            {
              campo: "B_debuf15",
              tipo: "checkbox",
              id: "BI15_1",
              etichetta: skillName(174),
            },
            {
              campo: "B_debuf16",
              tipo: "checkbox",
              id: "BI16_1",
              etichetta: skillName(175),
            },
            {
              campo: "B_debuf21",
              tipo: "checkbox",
              id: "BI21_1",
              etichetta: "Eska",
            },
            {
              campo: "B_debuf22",
              tipo: "checkbox",
              id: "BI22_1",
              etichetta: "Eske",
            },
            {
              campo: "B_debuf23",
              gestore: function () {
                if (!AI(1)) debufSW(1);
              },
              etichetta: "Elemental Change (Sage Skill) ",
            },
          ],
        },
      ],
    );
    n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>';
    var _ = ["(none)", "Water", "Earth", "Fire", "Wind"];
    opzioni(
      c.B_debuf23,
      serie(0, 4, function (i) {
        return [i, _[i]];
      }),
    );
    if (targetData[19]) {
      scrivi("BI18_1", "<S>Mind Breaker</S>");
      c.B_debuf18.disabled = true;
      c.B_debuf18.value = 0;
      n_B_debuf[18] = 0;
      scrivi("BI0_1", "<S>Provoke</S>");
      c.B_debuf0.disabled = true;
      c.B_debuf0.value = 0;
      n_B_debuf[0] = 0;
      scrivi("BI11_1", "<S>Decrease AGI</S>");
      c.B_debuf11.disabled = true;
      c.B_debuf11.value = 0;
      n_B_debuf[11] = 0;
      scrivi("BI2_1", "<S>Poison</S>");
      c.B_debuf2.disabled = true;
      c.B_debuf2.value = 0;
      n_B_debuf[2] = 0;
      scrivi("BI3_1", "<S>Blind</S>");
      c.B_debuf3.disabled = true;
      c.B_debuf3.value = 0;
      n_B_debuf[3] = 0;
      scrivi("BI10_1", "<S>Curse</S>");
      c.B_debuf10.disabled = true;
      c.B_debuf10.value = 0;
      n_B_debuf[10] = 0;
      scrivi("BI7_1", "<S>Stun</S>");
      c.B_debuf7.disabled = true;
      c.B_debuf7.value = 0;
      n_B_debuf[7] = 0;
      scrivi("BI4_1", "<S>Frozen</S>");
      c.B_debuf4.disabled = true;
      c.B_debuf4.value = 0;
      n_B_debuf[4] = 0;
      scrivi("BI9_1", "<S>Stone</S>");
      c.B_debuf9.disabled = true;
      c.B_debuf9.value = 0;
      n_B_debuf[9] = 0;
      scrivi("BI8_1", "<S>Sleep</S>");
      c.B_debuf8.disabled = true;
      c.B_debuf8.value = 0;
      n_B_debuf[8] = 0;
    } else if (
      targetData[3] < 90 ||
      c.B_debuf23.value != 0 ||
      n_B_debuf[23] != 0 ||
      (n_B_buf[6] < 90 && n_B_buf[6] != 0)
    ) {
      scrivi("BI18_1", "Mind Breaker");
      c.B_debuf18.disabled = false;
      scrivi("BI0_1", "Provoke");
      c.B_debuf0.disabled = false;
      scrivi("BI11_1", "Decrease AGI");
      c.B_debuf11.disabled = false;
      scrivi("BI4_1", "Frozen");
      c.B_debuf4.disabled = false;
      scrivi("BI9_1", "Stone");
      c.B_debuf9.disabled = false;
    } else {
      scrivi("BI2_1", "Poison");
      c.B_debuf2.disabled = false;
      scrivi("BI3_1", "Blind");
      c.B_debuf3.disabled = false;
      scrivi("BI10_1", "Curse");
      c.B_debuf10.disabled = false;
      scrivi("BI7_1", "Stun");
      c.B_debuf7.disabled = false;
      scrivi("BI8_1", "Sleep");
      c.B_debuf8.disabled = false;
      scrivi("BI18_1", "<S>Mind Breaker</S>");
      c.B_debuf18.disabled = true;
      c.B_debuf18.value = 0;
      n_B_debuf[18] = 0;
      scrivi("BI0_1", "<S>Provoke</S>");
      c.B_debuf0.disabled = true;
      c.B_debuf0.value = 0;
      n_B_debuf[0] = 0;
      scrivi("BI4_1", "<S>Frozen</S>");
      c.B_debuf4.disabled = true;
      c.B_debuf4.value = 0;
      n_B_debuf[4] = 0;
      scrivi("BI9_1", "<S>Stone</S>");
      c.B_debuf9.disabled = true;
      c.B_debuf9.value = 0;
      n_B_debuf[9] = 0;
    }
    if (
      targetData[2] == 6 ||
      (targetData[3] >= 90 && (c.B_debuf23.value == 0 || n_B_debuf[23] == 0 || n_B_buf[6] >= 90))
    ) {
      scrivi("BI5_1", "Blessing");
      c.B_debuf5.disabled = false;
      scrivi("BI12_1", "Signum Crucis");
      c.B_debuf12.disabled = false;
    } else {
      scrivi("BI5_1", "<S>Blessing</S>");
      c.B_debuf5.disabled = true;
      c.B_debuf5.value = 0;
      n_B_debuf[5] = 0;
      scrivi("BI12_1", "<S>Signum Crucis</S>");
      c.B_debuf12.disabled = true;
      c.B_debuf12.value = 0;
      n_B_debuf[12] = 0;
    }
    opzioni(c.B_debuf0, numeri(0, 10));
    opzioni(c.B_debuf11, numeri(0, 10));
    opzioni(c.B_debuf12, numeri(0, 10));
    opzioni(c.B_debuf1, numeri(0, 5));
    opzioni(c.B_debuf18, numeri(0, 5));
    opzioni(c.B_debuf24, numeri(0, 5));
    c.B_debuf0.value = n_B_debuf[0];
    c.B_debuf1.value = n_B_debuf[1];
    c.B_debuf2.checked = n_B_debuf[2];
    c.B_debuf3.checked = n_B_debuf[3];
    c.B_debuf4.checked = n_B_debuf[4];
    c.B_debuf5.checked = n_B_debuf[5];
    c.B_debuf6.checked = n_B_debuf[6];
    c.B_debuf7.checked = n_B_debuf[7];
    c.B_debuf8.checked = n_B_debuf[8];
    c.B_debuf9.checked = n_B_debuf[9];
    c.B_debuf10.checked = n_B_debuf[10];
    c.B_debuf11.value = n_B_debuf[11];
    c.B_debuf12.value = n_B_debuf[12];
    c.B_debuf17.checked = n_B_debuf[17];
    c.B_debuf18.value = n_B_debuf[18];
    c.B_debuf19.checked = n_B_debuf[19];
    c.B_debuf20.checked = n_B_debuf[20];
    c.B_debuf13.checked = n_B_debuf[13];
    c.B_debuf14.checked = n_B_debuf[14];
    c.B_debuf15.checked = n_B_debuf[15];
    c.B_debuf16.checked = n_B_debuf[16];
    c.B_debuf21.checked = n_B_debuf[21];
    c.B_debuf22.checked = n_B_debuf[22];
    c.B_debuf23.value = n_B_debuf[23];
    c.B_debuf24.value = n_B_debuf[24];
  } else {
    chiudiPannello("EnemyDebuf");
    var n;
  }
  AI(0);
}
function AI(e) {
  if (e == 1) calc();
  for (var _ = 0, n = 0; n <= 24; n++)
    if (n_B_debuf[n] != 0) {
      _ = 1;
      break;
    }
  scrivi("AIused", _ == 0 ? "" : " [active]");
}
function EnemyBufSW(e) {
  n_BbufSW = e;
  if (n_BbufSW) {
    apriPannello(
      "EnemyBuf",
      function () {
        AK(1);
      },
      [
        {
          titolo: null,
          voci: [
            {
              campo: "B_buf0",
              etichetta: "Increase AGI",
            },
            {
              campo: "B_buf1",
              tipo: "checkbox",
              etichetta: "Assumptio",
            },
            {
              campo: "B_buff10",
              etichetta: "Angelus",
            },
            {
              campo: "B_buf3",
              tipo: "checkbox",
              etichetta: "Maximize Power",
            },
            {
              campo: "B_buff11",
              etichetta: skillName(157),
            },
            {
              campo: "B_buf2",
              tipo: "checkbox",
              etichetta: "Adrenaline Rush",
            },
            {
              campo: "B_buff12",
              etichetta: "Shield Reflect",
            },
            {
              campo: "B_buff13",
              etichetta: skillName(165),
            },
            {
              campo: "B_buff14",
              etichetta: "Energy Coat",
            },
          ],
        },
        {
          titolo: "<b>Monster Exclusive buffs</b>",
          voci: [
            {
              campo: "B_buf6",
              gestore: function () {
                if (!AK(1)) debufSW(n_debufSW);
              },
              etichetta: "Attrib. Change",
            },
            {
              campo: "B_buf7",
              etichetta: "Stone Skin",
            },
            {
              campo: "B_buf9",
              tipo: "checkbox",
              etichetta: "Keeping",
            },
            {
              campo: "B_buf8",
              etichetta: "Anti-Magic",
            },
            {
              campo: "B_buf5",
              etichetta: "Agi Up (Flee Up)",
            },
            {
              campo: "B_buf4",
              tipo: "checkbox",
              etichetta: "POWER UP (ATK x3, HIT x2)",
            },
          ],
        },
      ],
    );
    n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>';
    opzioni(c.B_buf0, numeri(0, 10));
    opzioni(c.B_buff10, numeri(0, 10));
    opzioni(c.B_buff11, numeri(0, 10));
    opzioni(c.B_buff12, numeri(0, 10));
    opzioni(c.B_buf5, numeri(0, 5));
    opzioni(c.B_buf7, numeri(0, 5));
    opzioni(c.B_buf8, numeri(0, 5));
    opzioni(c.B_buff13, numeri(0, 5));
    opzioni(
      c.B_buff14,
      serie(0, 5, function (i) {
        return [i, v_EnergyCoat[i]];
      }),
    );
    var _ = [
      [
        "(none)",
        "Neutral 1",
        "Neutral 2",
        "Neutral 3",
        "Neutral 4",
        "Water 1",
        "Water 2",
        "Water 3",
        "Water 4",
        "Earth 1",
        "Earth 2",
        "Earth 3",
        "Earth 4",
        "Fire 1",
        "Fire 2",
        "Fire 3",
        "Fire 4",
        "Wind 1",
        "Wind 2",
        "Wind 3",
        "Wind 4",
        "Poison 1",
        "Poison 2",
        "Poison 3",
        "Poison 4",
        "Holy 1",
        "Holy 2",
        "Holy 3",
        "Holy 4",
        "Shadow 1",
        "Shadow 2",
        "Shadow 3",
        "Shadow 4",
        "Ghost 1",
        "Ghost 2",
        "Ghost 3",
        "Ghost 4",
        "Undead 1",
        "Undead 2",
        "Undead 3",
        "Undead 4",
      ],
      [
        0, 1, 2, 3, 4, 11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44, 51, 52, 53,
        54, 61, 62, 63, 64, 71, 72, 73, 74, 81, 82, 83, 84, 91, 92, 93, 94,
      ],
    ];
    opzioni(
      c.B_buf6,
      serie(0, 40, function (i) {
        return [_[1][i], _[0][i]];
      }),
    );
    c.B_buf0.value = n_B_buf[0];
    c.B_buf1.checked = n_B_buf[1];
    c.B_buf2.checked = n_B_buf[2];
    c.B_buf3.checked = n_B_buf[3];
    c.B_buf4.checked = n_B_buf[4];
    c.B_buf5.value = n_B_buf[5];
    c.B_buf6.value = n_B_buf[6];
    c.B_buf7.value = n_B_buf[7];
    c.B_buf8.value = n_B_buf[8];
    c.B_buf9.checked = n_B_buf[9];
    c.B_buff10.value = n_B_buf[10];
    c.B_buff11.value = n_B_buf[11];
    c.B_buff12.value = n_B_buf[12];
    c.B_buff13.value = n_B_buf[13];
    c.B_buff14.value = n_B_buf[14];
  } else {
    chiudiPannello("EnemyBuf");
    var n;
  }
  AK(0);
}
function AK(e) {
  if (e == 1) calc();
  for (var _ = 0, n = 0; n <= 14; n++)
    if (n_B_buf[n] != 0) {
      _ = 1;
      break;
    }
  scrivi("AKused", _ == 0 ? "" : " [active]");
}
function refreshFields() {
  ClickB_Item("SW");
  debufSW(n_debufSW);
  EnemyBufSW(n_BbufSW);
  BufSW(n_SkillSW);
  Buf3SW(n_Skill3SW);
  Buf4SW(n_Skill4SW);
  Buf6SW(n_Skill6SW);
  Buf7SW(n_Skill7SW);
  Buf9SW(n_Skill9SW);
  Buf10SW(n_Skill10SW);
}
