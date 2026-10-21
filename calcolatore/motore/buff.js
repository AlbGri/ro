// Pannelli di buff e debuff: BufSW, Buf3SW... disegnano i campi, A2, A3... li leggono
function BufSW(e) {
  if (((n_SkillSW = e), n_SkillSW)) {
    for (
      _ =
        '<TR><TD id="A2TD" ColSpan="6" class="subheader point" onclick="BufSW(0)" role="button" tabindex="0" aria-expanded="true">Supportive / Party Skills <span id="A2used"></span>',
        _ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>',
        _ += '<TR class="center">',
        _ += '<TD ColSpan="2" class="data"><B><U>Gospel Effects</U></B></TD>',
        _ += '<TD ColSpan="2" class="data"><B><U>Acolyte Class Buffs</U></B></TD>',
        _ += '<TD ColSpan="2"><B><U>Other Party Buffs</U></B></TD>',
        _ += "</TR><TR>",
        _ += '<TD id="EN50"></TD><TD class="data"></TD>',
        _ += '<TD id="AS0_1" class="center">Blessing</TD><TD id="AS0_2" class="data"></TD>',
        _ += '<TD id="AS6_1" class="center">Andrenaline Rush</TD><TD id="AS6_2"></TD>',
        _ += "</TR><TR>",
        _ += '<TD id="EN51"></TD><TD class="data"></TD>',
        _ += '<TD id="AS1_1" class="center">Increase AGI</TD><TD id="AS1_2" class="data"></TD>',
        _ += '<TD id="AS7_1" class="center">Weapon Perfection</TD><TD id="AS7_2"></TD>',
        _ += "</TR><TR>",
        _ += '<TD id="EN52"></TD><TD class="data"></TD>',
        _ += '<TD id="AS4_1" class="center">Angelus</TD><TD id="AS4_2" class="data"></TD>',
        _ += '<TD id="AS8_1" class="center">' + skillName(154) + '</TD><TD id="AS8_2"></TD>',
        _ += "</TR><TR>",
        _ += '<TD id="EN53"></TD><TD class="data"></TD>',
        _ += '<TD id="AS2_1" class="center">Impositio Manus</TD><TD id="AS2_2" class="data"></TD>',
        _ += '<TD id="AS9_1" class="center">Wind Walker</TD><TD id="AS9_2"></TD>',
        _ += "</TR><TR>",
        _ += '<TD id="EN55"></TD><TD class="data"></TD>',
        _ += '<TD id="AS3_1" class="center">Gloria</TD><TD id="AS3_2" class="data"></TD>',
        _ += '<TD id="" class="center">' + skillName(157) + '</TD><TD id="AS13_2"></TD>',
        _ += "</TR><TR>",
        _ += '<TD id="EN54"></TD><TD class="data"></TD>',
        _ += '<TD id="AS10_1" class="center">Suffragium</TD><TD id="AS10_2" class="data"></TD>',
        _ += '<TD id="" class="center">Shield Reflect</TD><TD id="AS14_2"></TD>',
        _ += "</TR><TR>",
        _ += '<TD></TD><TD class="data"></TD>',
        _ += '<TD id="AS5_1" class="center">Assumptio</TD><TD id="AS5_2" class="data"></TD>',
        _ += '<TD id="" class="center">' + skillName(165) + '</TD><TD id="AS15_2"></TD>',
        _ += "</TR><TR>",
        _ += '<TD></TD><TD class="data"></TD>',
        _ +=
          '<TD id="AS12_1" class="center"># of Spirit Spheres</TD><TD id="AS12_2" class="data"></TD>',
        _ += '<TD id="AS11_1" class="center">' + skillName(164) + '</TD><TD id="AS11_2"></TD>',
        myInnerHtml("SIENSKILL", (_ += "</TR>"), 0),
        myInnerHtml("AS0_2", '<select name="A2_Skill0" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS1_2", '<select name="A2_Skill1" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS2_2", '<select name="A2_Skill2" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS3_2", '<input type="checkbox" name="A2_Skill3" onClick="A2(1)">', 0),
        myInnerHtml("AS4_2", '<select name="A2_Skill4" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS5_2", '<input type="checkbox" name="A2_Skill5" onClick="A2(1)">', 0),
        myInnerHtml(
          "AS6_2",
          '<select name="A2_Skill6" onChange="A2(1)" style="width:50px;"></select>',
          0,
        ),
        myInnerHtml("AS7_2", '<input type="checkbox" name="A2_Skill7" onClick="A2(1)">', 0),
        myInnerHtml("AS8_2", '<input type="checkbox" name="A2_Skill8" onClick="A2(1)">', 0),
        myInnerHtml("AS9_2", '<select name="A2_Skill9" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS10_2", '<select name="A2_Skill10" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS11_2", '<select name="A2_Skill11" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS12_2", '<select name="A2_Skill12" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS13_2", '<select name="A2_Skill13" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS14_2", '<select name="A2_Skill14" onChange="A2(1)"></select>', 0),
        myInnerHtml("AS15_2", '<select name="A2_Skill15" onChange="A2(1)"></select>', 0),
        myInnerHtml(
          "EN50",
          '<input type="checkbox" name="A5_Skill0" onClick="A2(1)">All Stats +20',
          0,
        ),
        myInnerHtml("EN51", '<input type="checkbox" name="A5_Skill1" onClick="A2(1)">HP +100%', 0),
        myInnerHtml("EN52", '<input type="checkbox" name="A5_Skill2" onClick="A2(1)">SP +100%', 0),
        myInnerHtml("EN53", '<input type="checkbox" name="A5_Skill3" onClick="A2(1)">ATK +100%', 0),
        myInnerHtml(
          "EN54",
          '<input type="checkbox" name="A5_Skill4" onClick="A2(1)">HIT & FLEE +50',
          0,
        ),
        myInnerHtml("EN55", '<input type="checkbox" name="A5_Skill5" onClick="A2(1)">DEF +25%', 0),
        i = 0;
      i <= 10;
      i++
    )
      ((c.A2_Skill0.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill1.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill4.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill9.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill13.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill14.options[i] = new documento.Opzione(i, i)));
    for (i = 0; i <= 5; i++)
      ((c.A2_Skill2.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill11.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill12.options[i] = new documento.Opzione(i, i)),
        (c.A2_Skill15.options[i] = new documento.Opzione(i, i)));
    for (
      n_A_JOB == 45
        ? (myInnerHtml("AS12_1", "<S># of Spirit Spheres</S>", 0),
          (c.A2_Skill12.disabled = !0),
          (c.A2_Skill12.value = 0),
          (n_A_Buf2[12] = 0))
        : (myInnerHtml("AS12_1", "# of Spirit Spheres", 0), (c.A2_Skill12.disabled = !1)),
        n_A_JOB == 13 || n_A_JOB == 27
          ? (myInnerHtml("AS11_1", "<S>" + skillName(164) + "</S>", 0),
            (documento.getElementById("AS11_1").style.textDecoration = "line-through"),
            (c.A2_Skill11.disabled = !0),
            (c.A2_Skill11.value = 0),
            (n_A_Buf2[11] = 0))
          : (myInnerHtml("AS11_1", skillName(164), 0),
            (documento.getElementById("AS11_1").style.textDecoration = ""),
            (c.A2_Skill11.disabled = !1)),
        i = 0;
      i <= 3;
      i++
    )
      c.A2_Skill10.options[i] = new documento.Opzione(i, i);
    ((c.A2_Skill6.options[0] = new documento.Opzione("OFF", 0)),
      (c.A2_Skill6.options[1] = new documento.Opzione("Regular AR", 1)),
      (c.A2_Skill6.options[2] = new documento.Opzione("Full AR", 2)),
      (c.A2_Skill6.options[3] = new documento.Opzione("AR Scroll", 3)),
      (c.A2_Skill0.value = n_A_Buf2[0]),
      (c.A2_Skill1.value = n_A_Buf2[1]),
      (c.A2_Skill2.value = n_A_Buf2[2]),
      (c.A2_Skill3.checked = n_A_Buf2[3]),
      (c.A2_Skill4.value = n_A_Buf2[4]),
      (c.A2_Skill5.checked = n_A_Buf2[5]),
      (c.A2_Skill6.value = n_A_Buf2[6]),
      (c.A2_Skill7.checked = n_A_Buf2[7]),
      (c.A2_Skill8.checked = n_A_Buf2[8]),
      (c.A2_Skill9.value = n_A_Buf2[9]),
      (c.A2_Skill10.value = n_A_Buf2[10]),
      (c.A2_Skill11.value = n_A_Buf2[11]),
      (c.A2_Skill12.value = n_A_Buf2[12]),
      (c.A2_Skill13.value = n_A_Buf2[13]),
      (c.A2_Skill14.value = n_A_Buf2[14]),
      (c.A2_Skill15.value = n_A_Buf2[15]),
      (c.A5_Skill0.checked = n_A_Buf2[16]),
      (c.A5_Skill1.checked = n_A_Buf2[17]),
      (c.A5_Skill2.checked = n_A_Buf2[18]),
      (c.A5_Skill3.checked = n_A_Buf2[19]),
      (c.A5_Skill4.checked = n_A_Buf2[20]),
      (c.A5_Skill5.checked = n_A_Buf2[21]));
  } else {
    var _;
    ((_ =
      '<TR><TD id="A2TD" class="subheader point" onclick="BufSW(1)" role="button" tabindex="0" aria-expanded="false">Supportive / Party Skills <span id="A2used"></span>'),
      myInnerHtml(
        "SIENSKILL",
        (_ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  A2(0);
}
function A2(e) {
  e == 1 && calc();
  for (var _ = 0, n = 0; n <= 21; n++)
    if (n_A_Buf2[n] != 0) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("A2TD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("A2used", _ == 0 ? "" : " [active]", 0));
}
function Buf3SW(e) {
  if (((n_Skill3SW = e), n_Skill3SW)) {
    ((n =
      '<TR><TD id="A3TD" ColSpan="6" class="subheader point" onclick="Buf3SW(0)" role="button" tabindex="0" aria-expanded="true" style="text-align:left;">Music and Dance Skills <span id="A3used"></span>'),
      (n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
      (n +=
        '<TR><TD id="EN0_1"></TD><TD id="EN0_2" class="data"></TD><TD id="EN0_3" style="line-height:165%;"></TD><TD id="EN0_4" class="data"></TD><TD id="EN0_5"></TD><TD id="EN0_6"></TD></TR>'),
      (n +=
        '<TR><TD id="EN1_1"></TD><TD id="EN1_2" class="data"></TD><TD id="EN1_3"></TD><TD id="EN1_4" class="data"></TD><TD id="EN1_5"></TD><TD id="EN1_6"></TD></TR>'),
      (n +=
        '<TR><TD id="EN2_1"></TD><TD id="EN2_2" class="data"></TD><TD id="EN2_3" style="line-height:165%;"></TD><TD id="EN2_4" class="data"></TD><TD id="EN2_5"></TD><TD id="EN2_6"></TD></TR>'),
      (n +=
        '<TR><TD id="EN3_1"></TD><TD id="EN3_2" class="data"></TD><TD id="EN3_3"></TD><TD id="EN3_4" class="data"></TD><TD id="EN3_5"></TD><TD id="EN3_6"></TD></TR>'),
      (n +=
        '<TR><TD id="EN4_1"></TD><TD id="EN4_2" class="data"></TD><TD id="EN4_3"></TD><TD id="EN4_4" class="data"></TD><TD id="EN4_5"></TD><TD id="EN4_6"></TD></TR>'),
      (n +=
        '<TR><TD id="EN5_1"></TD><TD id="EN5_2" class="data"></TD><TD id="EN5_3"></TD><TD id="EN5_4" class="data"></TD><TD id="EN5_5"></TD><TD id="EN5_6"></TD></TR>'),
      (n +=
        '<TR><TD id="EN6_1"></TD><TD id="EN6_2" class="data"></TD><TD id="EN6_3"></TD><TD id="EN6_4" class="data"></TD><TD id="EN6_5"></TD><TD id="EN6_6"></TD></TR>'),
      (n +=
        '<TR><TD id="EN12_1" class="dotB"></TD><TD id="EN12_2" class="data dotB"></TD><TD id="EN12_3" class="dotB" style="line-height:165%;"></TD><TD id="EN12_4" class="data dotB"></TD><TD id="EN12_5" class="dotB"></TD><TD id="EN12_6" class="dotB"></TD></TR>'),
      (n +=
        '<TR><TD id="EN7_1"></TD><TD id="EN7_2" class="data"></TD><TD id="EN8_1" ColSpan="3"></TD><TD id="EN8_2" class="left"></TD></TR>'),
      (n +=
        '<TR><TD id="EN9_1" class="dotB"></TD><TD id="EN9_2" class="data dotB"></TD><TD id="EN10_1" class="dotB" ColSpan="3"></TD><TD id="EN10_2" class="dotB left"></TD></TR>'),
      myInnerHtml(
        "SP_SIEN01",
        (n +=
          '<TR style="text-align:left;"><TD colspan=6><span id="EN11_1"></span><span id="EN11_2"></span><span id="EN11_1a"></span></TD></TR>'),
        0,
      ));
    var _ = [202, 203, 204, 205, 210, 212, 213, 223, 217, 219, 220, 0, 211];
    for (i = 0; i <= 12; i++) myInnerHtml("EN" + i + "_1", skillName(_[i]), 0);
    for (
      myInnerHtml("EN0_2", '<select name="A3_Skill0_1" onChange="Skill3SW_2()|A3(1)"></select>', 0),
        myInnerHtml(
          "EN1_2",
          '<select name="A3_Skill1_1" onChange="Skill3SW_2()|A3(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN2_2",
          '<select name="A3_Skill2_1" onChange="Skill3SW_2()|A3(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN3_2",
          '<select name="A3_Skill3_1" onChange="Skill3SW_2()|A3(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN4_2",
          '<select name="A3_Skill4_1" onChange="Skill3SW_2()|A3(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN5_2",
          '<select name="A3_Skill5_1" onChange="Skill3SW_2()|A3(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN6_2",
          '<select name="A3_Skill6_1" onChange="Skill3SW_2()|A3(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN12_2",
          '<select name="A3_Skill12_1" onChange="Skill3SW_2()|A3(1)"></select>',
          0,
        ),
        myInnerHtml("EN7_2", '<select name="A3_Skill7" onChange="A3(1)"></select>', 0),
        myInnerHtml("EN8_2", '<select name="A3_Skill8" onChange="A3(1)"></select>', 0),
        myInnerHtml("EN9_2", '<select name="A3_Skill9" onChange="A3(1)"></select>', 0),
        myInnerHtml("EN10_2", '<select name="A3_Skill10" onChange="A3(1)"></select>', 0),
        myInnerHtml(
          "EN11_1",
          '<input type="checkbox" name="A3_Skill11" onClick="Skill3SW_2()|calc()">Marionette Control',
          0,
        ),
        i = 0;
      i <= 10;
      i++
    )
      ((c.A3_Skill0_1.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill1_1.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill2_1.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill3_1.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill4_1.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill5_1.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill6_1.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill12_1.options[i] = new documento.Opzione(i, i)));
    for (i = 0; i <= 5; i++)
      ((c.A3_Skill7.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill8.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill9.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill10.options[i] = new documento.Opzione(i, i)));
    ((c.A3_Skill0_1.value = n_A_Buf3[0]),
      (c.A3_Skill1_1.value = n_A_Buf3[1]),
      (c.A3_Skill2_1.value = n_A_Buf3[2]),
      (c.A3_Skill3_1.value = n_A_Buf3[3]),
      (c.A3_Skill4_1.value = n_A_Buf3[4]),
      (c.A3_Skill5_1.value = n_A_Buf3[5]),
      (c.A3_Skill6_1.value = n_A_Buf3[6]),
      (c.A3_Skill12_1.value = n_A_Buf3[37]),
      (c.A3_Skill7.value = n_A_Buf3[7]),
      (c.A3_Skill8.value = n_A_Buf3[8]),
      (c.A3_Skill9.value = n_A_Buf3[9]),
      (c.A3_Skill10.value = n_A_Buf3[10]),
      (c.A3_Skill11.checked = n_A_Buf3[11]),
      Skill3SW_2());
  } else {
    var n;
    for (
      n =
        '<TR><TD id="A3TD" class="subheader point" onclick="Buf3SW(1)" role="button" tabindex="0" aria-expanded="false" style="text-align:left;">Music and Dance Skills <span id="A3used"></span>',
        myInnerHtml(
          "SP_SIEN01",
          (n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
          0,
        ),
        i = 0;
      i <= 11;
      i++
    )
      SWs3sw[i] = 0;
  }
  A3(0);
}
function Skill3SW_2() {
  if (
    ((n_A_Buf3[0] = 1 * c.A3_Skill0_1.value),
    (n_A_Buf3[1] = 1 * c.A3_Skill1_1.value),
    (n_A_Buf3[2] = 1 * c.A3_Skill2_1.value),
    (n_A_Buf3[3] = 1 * c.A3_Skill3_1.value),
    (n_A_Buf3[4] = 1 * c.A3_Skill4_1.value),
    (n_A_Buf3[5] = 1 * c.A3_Skill5_1.value),
    (n_A_Buf3[6] = 1 * c.A3_Skill6_1.value),
    (n_A_Buf3[37] = 1 * c.A3_Skill12_1.value),
    (n_A_Buf3[11] = 1 * c.A3_Skill11.checked),
    n_A_Buf3[0] != 0)
  ) {
    if (SWs3sw[0] == 0) {
      for (
        n_A_Buf3[20] == 0 && ((n_A_Buf3[20] = 100), (n_A_Buf3[19] = 100), (n_A_Buf3[30] = 10)),
          myInnerHtml("EN0_3", "Bard's AGI<br>Bard's LUK", 0),
          myInnerHtml(
            "EN0_4",
            '<select name="A3_Skill0_2" onChange="A3(1)"></select><br><select name="A3_Skill0_4" onChange="A3(1)"></select>',
            0,
          ),
          myInnerHtml("EN0_5", "Musical Lessons", 0),
          myInnerHtml("EN0_6", '<select name="A3_Skill0_3" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 200;
        i++
      )
        ((c.A3_Skill0_2.options[i - 1] = new documento.Opzione(i, i)),
          (c.A3_Skill0_4.options[i - 1] = new documento.Opzione(i, i)));
      for (i = 0; i <= 10; i++) c.A3_Skill0_3.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[0] = 1),
        (c.A3_Skill0_2.value = n_A_Buf3[20]),
        (c.A3_Skill0_4.value = n_A_Buf3[19]),
        (c.A3_Skill0_3.value = n_A_Buf3[30]));
    }
  } else
    ((SWs3sw[0] = 0),
      myInnerHtml("EN0_3", "", 0),
      myInnerHtml("EN0_4", "", 0),
      myInnerHtml("EN0_5", "", 0),
      myInnerHtml("EN0_6", "", 0));
  if (n_A_Buf3[1] != 0) {
    if (SWs3sw[1] == 0) {
      for (
        n_A_Buf3[21] == 0 && ((n_A_Buf3[21] = 100), (n_A_Buf3[31] = 10)),
          myInnerHtml("EN1_3", "Bard's AGI", 0),
          myInnerHtml("EN1_4", '<select name="A3_Skill1_2" onChange="A3(1)"></select>', 0),
          myInnerHtml("EN1_5", "Musical Lessons", 0),
          myInnerHtml("EN1_6", '<select name="A3_Skill1_3" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 200;
        i++
      )
        c.A3_Skill1_2.options[i - 1] = new documento.Opzione(i, i);
      for (i = 0; i <= 10; i++) c.A3_Skill1_3.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[1] = 1), (c.A3_Skill1_2.value = n_A_Buf3[21]), (c.A3_Skill1_3.value = n_A_Buf3[31]));
    }
  } else
    ((SWs3sw[1] = 0),
      myInnerHtml("EN1_3", "", 0),
      myInnerHtml("EN1_4", "", 0),
      myInnerHtml("EN1_5", "", 0),
      myInnerHtml("EN1_6", "", 0));
  if (n_A_Buf3[2] != 0) {
    if (SWs3sw[2] == 0) {
      for (
        n_A_Buf3[22] == 0 && ((n_A_Buf3[22] = 100), (n_A_Buf3[29] = 100), (n_A_Buf3[32] = 10)),
          myInnerHtml("EN2_3", "Bard's DEX<br>Bard's INT", 0),
          myInnerHtml(
            "EN2_4",
            '<select name="A3_Skill2_2" onChange="A3(1)"></select><br><select name="A3_Skill2_3" onChange="A3(1)"></select>',
            0,
          ),
          myInnerHtml("EN2_5", "Musical Lessons", 0),
          myInnerHtml("EN2_6", '<select name="A3_Skill2_4" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 150;
        i++
      )
        ((c.A3_Skill2_2.options[i - 1] = new documento.Opzione(i, i)),
          (c.A3_Skill2_3.options[i - 1] = new documento.Opzione(i, i)));
      for (i = 151; i <= 200; i++) c.A3_Skill2_2.options[i - 1] = new documento.Opzione(i, i);
      for (i = 0; i <= 10; i++) c.A3_Skill2_4.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[2] = 1),
        (c.A3_Skill2_2.value = n_A_Buf3[22]),
        (c.A3_Skill2_3.value = n_A_Buf3[29]),
        (c.A3_Skill2_4.value = n_A_Buf3[32]));
    }
  } else
    ((SWs3sw[2] = 0),
      myInnerHtml("EN2_3", "", 0),
      myInnerHtml("EN2_4", "", 0),
      myInnerHtml("EN2_5", "", 0),
      myInnerHtml("EN2_6", "", 0));
  if (n_A_Buf3[3] != 0) {
    if (SWs3sw[3] == 0) {
      for (
        n_A_Buf3[23] == 0 && ((n_A_Buf3[23] = 100), (n_A_Buf3[33] = 10)),
          myInnerHtml("EN3_3", "Bard's VIT", 0),
          myInnerHtml("EN3_4", '<select name="A3_Skill3_2" onChange="A3(1)"></select>', 0),
          myInnerHtml("EN3_5", "Musical Lessons", 0),
          myInnerHtml("EN3_6", '<select name="A3_Skill3_3" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 200;
        i++
      )
        c.A3_Skill3_2.options[i - 1] = new documento.Opzione(i, i);
      for (i = 0; i <= 10; i++) c.A3_Skill3_3.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[3] = 1), (c.A3_Skill3_2.value = n_A_Buf3[23]), (c.A3_Skill3_3.value = n_A_Buf3[33]));
    }
  } else
    ((SWs3sw[3] = 0),
      myInnerHtml("EN3_3", "", 0),
      myInnerHtml("EN3_4", "", 0),
      myInnerHtml("EN3_5", "", 0),
      myInnerHtml("EN3_6", "", 0));
  if (n_A_Buf3[4] != 0) {
    if (SWs3sw[4] == 0) {
      for (
        n_A_Buf3[24] == 0 && ((n_A_Buf3[24] = 130), (n_A_Buf3[34] = 10)),
          myInnerHtml("EN4_3", "Dancer's DEX", 0),
          myInnerHtml("EN4_4", '<select name="A3_Skill4_2" onChange="A3(1)"></select>', 0),
          myInnerHtml("EN4_5", "Dancing Lessons", 0),
          myInnerHtml("EN4_6", '<select name="A3_Skill4_3" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 200;
        i++
      )
        c.A3_Skill4_2.options[i - 1] = new documento.Opzione(i, i);
      for (i = 0; i <= 10; i++) c.A3_Skill4_3.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[4] = 1), (c.A3_Skill4_2.value = n_A_Buf3[24]), (c.A3_Skill4_3.value = n_A_Buf3[34]));
    }
  } else
    ((SWs3sw[4] = 0),
      myInnerHtml("EN4_3", "", 0),
      myInnerHtml("EN4_4", "", 0),
      myInnerHtml("EN4_5", "", 0),
      myInnerHtml("EN4_6", "", 0));
  if (n_A_Buf3[5] != 0) {
    if (SWs3sw[5] == 0) {
      for (
        n_A_Buf3[25] == 0 && ((n_A_Buf3[25] = 50), (n_A_Buf3[35] = 10)),
          myInnerHtml("EN5_3", "Dancer's LUK", 0),
          myInnerHtml("EN5_4", '<select name="A3_Skill5_2" onChange="A3(1)"></select>', 0),
          myInnerHtml("EN5_5", "Dancing Lessons", 0),
          myInnerHtml("EN5_6", '<select name="A3_Skill5_3" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 200;
        i++
      )
        c.A3_Skill5_2.options[i - 1] = new documento.Opzione(i, i);
      for (i = 0; i <= 10; i++) c.A3_Skill5_3.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[5] = 1), (c.A3_Skill5_2.value = n_A_Buf3[25]), (c.A3_Skill5_3.value = n_A_Buf3[35]));
    }
  } else
    ((SWs3sw[5] = 0),
      myInnerHtml("EN5_3", "", 0),
      myInnerHtml("EN5_4", "", 0),
      myInnerHtml("EN5_5", "", 0),
      myInnerHtml("EN5_6", "", 0));
  if (n_A_Buf3[6] != 0) {
    if (SWs3sw[6] == 0) {
      for (
        n_A_Buf3[26] == 0 && ((n_A_Buf3[26] = 50), (n_A_Buf3[36] = 10)),
          myInnerHtml("EN6_3", "Dancer's INT", 0),
          myInnerHtml("EN6_4", '<select name="A3_Skill6_2" onChange="A3(1)"></select>', 0),
          myInnerHtml("EN6_5", "Dancing Lessons", 0),
          myInnerHtml("EN6_6", '<select name="A3_Skill6_3" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 200;
        i++
      )
        c.A3_Skill6_2.options[i - 1] = new documento.Opzione(i, i);
      for (i = 0; i <= 10; i++) c.A3_Skill6_3.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[6] = 1), (c.A3_Skill6_2.value = n_A_Buf3[26]), (c.A3_Skill6_3.value = n_A_Buf3[36]));
    }
  } else
    ((SWs3sw[6] = 0),
      myInnerHtml("EN6_3", "", 0),
      myInnerHtml("EN6_4", "", 0),
      myInnerHtml("EN6_5", "", 0),
      myInnerHtml("EN6_6", "", 0));
  if (n_A_Buf3[37] != 0) {
    if (SWs3sw[7] == 0) {
      for (
        n_A_Buf3[38] == 0 && ((n_A_Buf3[38] = 130), (n_A_Buf3[39] = 130), (n_A_Buf3[27] = 10)),
          myInnerHtml("EN12_3", "Dancer's DEX<br>Dancer's AGI", 0),
          myInnerHtml(
            "EN12_4",
            '<select name="A3_Skill12_2" onChange="A3(1)"></select><br><select name="A3_Skill12_3" onChange="A3(1)"></select>',
            0,
          ),
          myInnerHtml("EN12_5", "Dancing Lessons", 0),
          myInnerHtml("EN12_6", '<select name="A3_Skill12_4" onChange="A3(1)"></select>', 0),
          i = 1;
        i <= 200;
        i++
      )
        ((c.A3_Skill12_2.options[i - 1] = new documento.Opzione(i, i)),
          (c.A3_Skill12_3.options[i - 1] = new documento.Opzione(i, i)));
      for (i = 0; i <= 10; i++) c.A3_Skill12_4.options[i] = new documento.Opzione(i, i);
      ((SWs3sw[7] = 1),
        (c.A3_Skill12_2.value = n_A_Buf3[38]),
        (c.A3_Skill12_3.value = n_A_Buf3[39]),
        (c.A3_Skill12_4.value = n_A_Buf3[27]));
    }
  } else
    ((SWs3sw[7] = 0),
      myInnerHtml("EN12_3", "", 0),
      myInnerHtml("EN12_4", "", 0),
      myInnerHtml("EN12_5", "", 0),
      myInnerHtml("EN12_6", "", 0));
  if (n_A_Buf3[11] != 0) {
    if (SWs3sw[11] == 0) {
      for (
        myInnerHtml(
          "EN11_2",
          '<br>Controller\'s Stats: <select name="A3_Skill11_STR" onChange="A3(1)"></select><select name="A3_Skill11_AGI" onChange="A3(1)"></select><select name="A3_Skill11_VIT" onChange="A3(1)"></select><select name="A3_Skill11_INT" onChange="A3(1)"></select><select name="A3_Skill11_DEX" onChange="A3(1)"></select><select name="A3_Skill11_LUK" onChange="A3(1)"></select><BR><input type="checkbox" name="A3_Skill11a" onClick="A3(1)">Status compensation (adjustment for equipment / human calculation)',
          0,
        ),
          c.A3_Skill11_STR.options[0] = new documento.Opzione("STR", 0),
          c.A3_Skill11_AGI.options[0] = new documento.Opzione("AGI", 0),
          c.A3_Skill11_VIT.options[0] = new documento.Opzione("VIT", 0),
          c.A3_Skill11_INT.options[0] = new documento.Opzione("INT", 0),
          c.A3_Skill11_DEX.options[0] = new documento.Opzione("DEX", 0),
          c.A3_Skill11_LUK.options[0] = new documento.Opzione("LUK", 0),
          i = 1;
        i <= 99;
        i++
      )
        ((c.A3_Skill11_STR.options[i] = new documento.Opzione(i, i)),
          (c.A3_Skill11_AGI.options[i] = new documento.Opzione(i, i)),
          (c.A3_Skill11_VIT.options[i] = new documento.Opzione(i, i)),
          (c.A3_Skill11_INT.options[i] = new documento.Opzione(i, i)),
          (c.A3_Skill11_DEX.options[i] = new documento.Opzione(i, i)),
          (c.A3_Skill11_LUK.options[i] = new documento.Opzione(i, i)));
      ((SWs3sw[11] = 1),
        (c.A3_Skill11_STR.value = n_A_Buf3[12]),
        (c.A3_Skill11_AGI.value = n_A_Buf3[13]),
        (c.A3_Skill11_VIT.value = n_A_Buf3[14]),
        (c.A3_Skill11_INT.value = n_A_Buf3[15]),
        (c.A3_Skill11_DEX.value = n_A_Buf3[16]),
        (c.A3_Skill11_LUK.value = n_A_Buf3[17]),
        (c.A3_Skill11a.checked = n_A_Buf3[18]));
    }
  } else ((SWs3sw[11] = 0), myInnerHtml("EN11_2", "", 0));
}
function A3(e) {
  e == 1 && calc();
  for (var _ = 0, n = 0; n <= 17; n++)
    if ((n != 11 && n_A_Buf3[n] != 0) || (n == 11 && n_A_Buf3[37] != 0)) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("A3TD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("A3used", _ == 0 ? "" : " [active]", 0));
}
function Buf4SW(e) {
  if (((n_Skill4SW = e), n_Skill4SW)) {
    for (
      _ =
        '<TR><TD id="A4TD" ColSpan="2" class="subheader point" onclick="Buf4SW(0)" role="button" tabindex="0" aria-expanded="true">Guild Skills <span id="A4used"></span>',
        _ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>',
        _ += '<TR><TD id="EN40_1" class="center"></TD><TD id="EN40_2"></TD></TR>',
        _ += '<TR><TD id="EN41_1" class="center"></TD><TD id="EN41_2"></TD></TR>',
        _ += '<TR><TD id="EN42_1" class="center"></TD><TD id="EN42_2"></TD></TR>',
        _ += '<TR><TD id="EN43_1" class="center"></TD><TD id="EN43_2"></TD></TR>',
        myInnerHtml(
          "SP_SIEN02",
          (_ += '<TR><TD id="EN44_1" class="center"></TD><TD id="EN44_2"></TD></TR>'),
          0,
        ),
        name_CS4SW_SKILL = [
          "Battle Orders",
          "Great Leadership",
          "Wounds of Glory",
          "Soul of Cold",
          "Sharp Hawk Eyes",
        ],
        i = 0;
      i <= 4;
      i++
    )
      myInnerHtml("EN4" + i + "_1", name_CS4SW_SKILL[i], 0);
    for (
      myInnerHtml("EN40_2", '<input type="checkbox" name="A3_Skill40" onClick="A4(1)">', 0),
        myInnerHtml("EN41_2", '<select name="A3_Skill41" onChange="A4(1)"></select>', 0),
        myInnerHtml("EN42_2", '<select name="A3_Skill42" onChange="A4(1)"></select>', 0),
        myInnerHtml("EN43_2", '<select name="A3_Skill43" onChange="A4(1)"></select>', 0),
        myInnerHtml("EN44_2", '<select name="A3_Skill44" onChange="A4(1)"></select>', 0),
        i = 0;
      i <= 5;
      i++
    )
      ((c.A3_Skill41.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill42.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill43.options[i] = new documento.Opzione(i, i)),
        (c.A3_Skill44.options[i] = new documento.Opzione(i, i)));
    ((c.A3_Skill40.checked = n_A_Buf3[40]),
      (c.A3_Skill41.value = n_A_Buf3[41]),
      (c.A3_Skill42.value = n_A_Buf3[42]),
      (c.A3_Skill43.value = n_A_Buf3[43]),
      (c.A3_Skill44.value = n_A_Buf3[44]));
  } else {
    var _;
    ((_ =
      '<TR><TD id="A4TD" class="subheader point" onclick="Buf4SW(1)" role="button" tabindex="0" aria-expanded="false">Guild Skills <span id="A4used"></span>'),
      myInnerHtml(
        "SP_SIEN02",
        (_ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  A4(0);
}
function A4(e) {
  e == 1 && calc();
  for (var _ = 0, n = 40; n <= 44; n++)
    if (n_A_Buf3[n] != 0) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("A4TD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("A4used", _ == 0 ? "" : " [active]", 0));
}
function Buf6SW(e) {
  if (((n_Skill6SW = e), n_Skill6SW)) {
    ((o =
      '<TR><TD id="A6TD" ColSpan="5" class="subheader point" onclick="Buf6SW(0)" role="button" tabindex="0" aria-expanded="true">Miscellaneous Effects on Player<span id="A6used"></span>'),
      (o += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
      (o +=
        '<TR><TD class="dotB" ColSpan="5"><Font size="2"><B>Pets </B></Font><select name="A8_Skill0" onChange="A6(1)" style="width:520px;"></select></TD></TR>'),
      (o +=
        '<TR><TD class="data"><span class=name><Font size="2"><b>Temporary Card/Item active effects </b></Font><span class=nametext>(Duration and chance are ignored)</span></span></TD><TD id="EN60_1" class="right"></TD><TD id="EN60_2" class="data"></TD><TD class="right">Poison</TD><TD id="EN62_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data"><select name="A8_Skill8" onChange="A6(1)" style="width:240px;"></select></TD><TD class="right">Provoke (self)</TD><TD id="EN63_2" class="data"></TD><TD class="right">Stun</TD><TD id="EN75_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data"><select name="A8_Skill9" onChange="A6(1)" style="width:240px;"></select></TD><TD class="right">Mind Breaker (self)</TD><TD id="EN61_2" class="data"></TD><TD class="right">Freeze</TD><TD id="EN78_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data"><select name="A8_Skill10" onChange="A6(1)" style="width:240px;"></select></TD><TD class="right">AGI Down</TD><TD id="EN66_2" class="data"></TD><TD class="right">Curse</TD><TD id="EN64_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data dotB"><select name="A8_Skill11" onChange="A6(1)" style="width:240px;"></select></TD><TD class="right">Quagmire</TD><TD id="EN68_2" class="data"></TD><TD class="right">Blind</TD><TD id="EN74_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data"><Font size="2"><B>EXP Items & Variables</B></Font></TD><TD class="right">' +
        skillName(442) +
        '</TD><TD id="EN70_2" class="data"></TD><TD class="right">Sleep</TD><TD id="EN77_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data">Server Base Experience Rate <select name="A8_Skill3" onChange="A6(1)"></select></TD><TD class="right">Undead Attribute Change</TD><TD id="EN65_2" class="data"></TD><TD class="right">Stone</TD><TD id="EN76_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data">Server Job Experience Rate <select name="A8_Skill7" onChange="A6(1)"></select></TD><TD class="right">Holy Armor [B.S.S.]</TD><TD id="EN67_2" class="data"></TD><TD class="right">Bleeding</TD><TD id="EN80_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data">Partymember Count <select name="A8_Skill5" onChange="A6(1)"></select></TD><TD class="right">Magnum Break Bonus</TD><TD id="EN69_2" class="data"></TD><TD class="right">Lex Aeterna</TD><TD id="EN79_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data">Exp Tap Bonus <select name="A8_Skill6" onChange="A6(1)"></select></TD><TD class="right">Set CRIT to 0%</TD><TD id="EN71_2" class="data"></TD><TD class="right">Critical Wounds</TD><TD id="EN81_2"></TD></TR>'),
      (o +=
        '<TR><TD class="data">Battle Manual <select name="A8_Skill1" onChange="A6(1)"></select></TD><TD id="EN72_1" class="center" colspan="3">All Stats +1 [SuperNovice wife Undying Love bonus]</TD><TD id="EN72_2"></TD></TR>'),
      myInnerHtml(
        "SP_SIEN04",
        (o +=
          '<TR><TD class="data"><input type="checkbox" name="A8_Skill2" onClick="A6(1)">Job Manual 50</TD><TD id="EN73_1" class="center" colspan="3"></TD><TD id="EN73_2"></TD></TR>'),
        0,
      ),
      (c.A8_Skill0.options[0] = new documento.Opzione(
        m_PET[m_PET_SORT[0]][1],
        m_PET[m_PET_SORT[0]][0],
      )));
    var _ = documento.createElement("OPTGROUP");
    for (_.label = "CLASSIC PETS", c.A8_Skill0.appendChild(_), i = 1; i < 61; i++) {
      var n = m_PET_SORT[i];
      ((c.A8_Skill0.options[i] = new documento.Opzione(m_PET[n][1], m_PET[n][0])),
        _.appendChild(c.A8_Skill0.options[i]));
    }
    var a = documento.createElement("OPTGROUP");
    for (
      a.label = "EVOLVED PETS & OTHER NEW PETS", c.A8_Skill0.appendChild(a), j = i;
      j < m_PET_SORT.length;
      j++
    )
      ((n = m_PET_SORT[j]),
        (c.A8_Skill0.options[j] = new documento.Opzione(m_PET[n][1], m_PET[n][0])),
        a.appendChild(c.A8_Skill0.options[j]));
    for (i = 0; i < m_TempEffect_SORT.length; i++)
      ((n = m_TempEffect_SORT[i]),
        (c.A8_Skill8.options[i] = new documento.Opzione(
          m_TempEffect[n][1] + " [" + m_TempEffect[n][2] + "]",
          n,
        )),
        (c.A8_Skill9.options[i] = new documento.Opzione(
          m_TempEffect[n][1] + " [" + m_TempEffect[n][2] + "]",
          n,
        )),
        (c.A8_Skill10.options[i] = new documento.Opzione(
          m_TempEffect[n][1] + " [" + m_TempEffect[n][2] + "]",
          n,
        )),
        (c.A8_Skill11.options[i] = new documento.Opzione(
          m_TempEffect[n][1] + " [" + m_TempEffect[n][2] + "]",
          n,
        )));
    for (
      c.A8_Skill1.options[0] = new documento.Opzione("None", 0),
        c.A8_Skill1.options[1] = new documento.Opzione("25", 1),
        c.A8_Skill1.options[2] = new documento.Opzione("50", 2),
        c.A8_Skill1.options[3] = new documento.Opzione("100", 4),
        c.A8_Skill3.options[0] = new documento.Opzione("1x", 0),
        i = 1;
      i <= 199;
      i++
    )
      c.A8_Skill3.options[i] = new documento.Opzione(1 + 1 * i + "x", i);
    for (c.A8_Skill7.options[0] = new documento.Opzione("1x", 0), i = 1; i <= 199; i++)
      c.A8_Skill7.options[i] = new documento.Opzione(1 + 1 * i + "x", i);
    for (i = 1; i <= 12; i++) c.A8_Skill5.options[i - 1] = new documento.Opzione(i, i - 1);
    for (c.A8_Skill6.options[0] = new documento.Opzione("-", 0), i = 1; i <= 20; i++)
      c.A8_Skill6.options[i] = new documento.Opzione("+" + 25 * i + "%", i);
    for (
      c.A8_Skill0.value = n_A_Buf8[0],
        c.A8_Skill1.value = n_A_Buf8[1],
        c.A8_Skill2.checked = n_A_Buf8[2],
        c.A8_Skill3.value = n_A_Buf8[3],
        c.A8_Skill5.value = n_A_Buf8[5],
        c.A8_Skill6.value = n_A_Buf8[6],
        c.A8_Skill7.value = n_A_Buf8[7],
        c.A8_Skill8.value = n_A_Buf8[8],
        c.A8_Skill9.value = n_A_Buf8[9],
        c.A8_Skill10.value = n_A_Buf8[10],
        c.A8_Skill11.value = n_A_Buf8[11],
        myInnerHtml("EN60_1", '<select name="A6_Skill0" onChange="StAllCalc()"></select>', 0),
        myInnerHtml("EN60_2", '<select name="A6_Skill1" onChange="A6(1)"></select>', 0),
        myInnerHtml("EN61_2", '<select name="A6_Skill4" onChange="A6(1)"></select>', 0),
        myInnerHtml("EN62_2", '<input type="checkbox" name="A_debuf2" onClick="A6(1)">', 0),
        myInnerHtml("EN63_2", '<select name="A6_Skill5" onChange="A6(1)"></select>', 0),
        myInnerHtml("EN64_2", '<input type="checkbox" name="A_debuf3" onClick="A6(1)">', 0),
        myInnerHtml("EN65_2", '<input type="checkbox" name="A6_Skill8" onClick="A6(1)">', 0),
        myInnerHtml("EN66_2", '<select name="A_debuf1" onChange="A6(1)"></select>', 0),
        myInnerHtml("EN67_2", '<input type="checkbox" name="A6_Skill6" onClick="A6(1)">', 0),
        myInnerHtml("EN68_2", '<select name="A_debuf0" onChange="A6(1)"></select>', 0),
        myInnerHtml("EN69_2", '<input type="checkbox" name="A6_Skill7" onClick="A6(1)">', 0),
        myInnerHtml("EN70_2", '<input type="checkbox" name="A6_Skill3" onClick="A6(1)">', 0),
        myInnerHtml("EN71_2", '<input type="checkbox" name="A6_Skill9" onClick="A6(1)">', 0),
        myInnerHtml("EN72_2", '<input type="checkbox" name="A6_Skill10" onClick="A6(1)">', 0),
        myInnerHtml("EN74_2", '<input type="checkbox" name="A6_Skill11" onClick="A6(1)">', 0),
        myInnerHtml("EN75_2", '<input type="checkbox" name="A6_Skill12" onClick="A6(1)">', 0),
        myInnerHtml("EN76_2", '<input type="checkbox" name="A6_Skill13" onClick="A6(1)">', 0),
        myInnerHtml("EN77_2", '<input type="checkbox" name="A6_Skill14" onClick="A6(1)">', 0),
        myInnerHtml("EN78_2", '<input type="checkbox" name="A6_Skill15" onClick="A6(1)">', 0),
        myInnerHtml("EN79_2", '<input type="checkbox" name="A6_Skill16" onClick="A6(1)">', 0),
        myInnerHtml("EN80_2", '<input type="checkbox" name="A6_Skill17" onClick="A6(1)">', 0),
        myInnerHtml("EN81_2", '<select name="A6_Skill18" onChange="A6(1)"></select>', 0),
        c.A6_Skill0.options[0] = new documento.Opzione("Volcano", 0),
        c.A6_Skill0.options[1] = new documento.Opzione("Deluge", 1),
        c.A6_Skill0.options[2] = new documento.Opzione("Violent Gale", 2),
        i = 0;
      i <= 5;
      i++
    )
      c.A6_Skill1.options[i] = new documento.Opzione(i, i);
    for (i = 0; i <= 5; i++)
      ((c.A6_Skill4.options[i] = new documento.Opzione(i, i)),
        (c.A6_Skill18.options[i] = new documento.Opzione(i, i)));
    for (i = 0; i <= 10; i++) c.A6_Skill5.options[i] = new documento.Opzione(i, i);
    for (c.A_debuf0.options[0] = new documento.Opzione("-", 0), i = 1; i <= 5; i++)
      c.A_debuf0.options[i] = new documento.Opzione(i, i);
    for (c.A_debuf1.options[0] = new documento.Opzione("-", 0), i = 1; i <= 10; i++)
      c.A_debuf1.options[i] = new documento.Opzione("Lvl " + i, i);
    ((c.A_debuf1.options[11] = new documento.Opzione("Lvl 46", 46)),
      (c.A6_Skill0.value = n_A_Buf6[0]),
      (c.A6_Skill1.value = n_A_Buf6[1]),
      (c.A6_Skill3.checked = n_A_Buf6[3]),
      (c.A6_Skill4.value = n_A_Buf6[4]),
      (c.A6_Skill5.value = n_A_Buf6[5]),
      (c.A6_Skill6.checked = n_A_Buf6[6]),
      (c.A6_Skill7.checked = n_A_Buf6[7]),
      (c.A6_Skill8.checked = n_A_Buf6[8]),
      (c.A6_Skill9.checked = n_A_Buf6[9]),
      (c.A6_Skill10.checked = n_A_Buf6[10]),
      (c.A6_Skill11.checked = n_A_Buf6[11]),
      (c.A6_Skill12.checked = n_A_Buf6[12]),
      (c.A6_Skill13.checked = n_A_Buf6[13]),
      (c.A6_Skill14.checked = n_A_Buf6[14]),
      (c.A6_Skill15.checked = n_A_Buf6[15]),
      (c.A6_Skill16.checked = n_A_Buf6[16]),
      (c.A6_Skill17.checked = n_A_Buf6[17]),
      (c.A6_Skill18.value = n_A_Buf6[18]),
      (c.A_debuf0.value = n_A_Buf6[19]),
      (c.A_debuf1.value = n_A_Buf6[20]),
      (c.A_debuf2.checked = n_A_Buf6[21]),
      (c.A_debuf3.checked = n_A_Buf6[22]));
  } else {
    var o;
    ((o =
      '<TR><TD id="A6TD" class="subheader point" onclick="Buf6SW(1)" role="button" tabindex="0" aria-expanded="false">Miscellaneous Effects on Player<span id="A6used"></span>'),
      myInnerHtml(
        "SP_SIEN04",
        (o += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  A6(0);
}
function A6(e) {
  e == 1 && calc();
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
  var a = documento.getElementById("A6TD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("A6used", _ == 0 ? "" : " [active]", 0));
}
function SetSpeedPotionOptions() {
  ((c.A_SpeedPOT.options[2] =
    n_A_JOB != 3 && n_A_JobClass2() != 9 && n_A_JobClass2() != 16
      ? new documento.Opzione(SpeedPotName[2], 2)
      : new documento.Opzione("-", 0)),
    (c.A_SpeedPOT.options[3] =
      n_A_JobClass() == 1 ||
      n_A_JobClass() == 6 ||
      n_A_JobClass() == 41 ||
      n_A_JobClass2() == 14 ||
      n_A_JobClass2() == 11 ||
      n_A_JOB == 5 ||
      n_A_JOB == 45
        ? new documento.Opzione(SpeedPotName[3] + " (Lvl 85)", 3)
        : new documento.Opzione("* (" + m_Skill[304][2] + ", Lvl 85)", 3)),
    n_A_JOB == 22
      ? (c.A_SpeedPOT.options[4] = new documento.Opzione("Poison Bottle", 4))
      : ((c.A_SpeedPOT.options.length = 4), n_A_Buf7[35] == 4 && (n_A_Buf7[35] = 0)),
    (c.A_SpeedPOT.value = n_A_Buf7[35]));
}
function Buf7SW(e) {
  if (((n_Skill7SW = e), n_Skill7SW)) {
    for (
      _ =
        '<TR><TD id="A7TD" ColSpan="4" class="subheader point" onclick="Buf7SW(0)" role="button" tabindex="0" aria-expanded="true">Food, Speed Potions & other Items <span id="A7used"></span>',
        _ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>',
        _ +=
          '<TR><TD id="EN717" class="data" style="width:142px;"></TD><TD id="EN722" class="dotB" colspan="2" rowspan="2"></TD><TD id="EN715" style="width:140px;"></TD></TR>',
        _ += '<TR><TD id="EN745" class="data"></TD><TD id="EN744" class="dotB"></TD></TR>',
        _ +=
          '<TR><TD id="EN718" class="data" colspan="2"></TD><TD class="data" style="width:80px;"><Font size="2"><B>Stat Foods</B></Font></TD><TD><Font size="2"><B>Stat+20 Foods</B></Font></TD></TR>',
        _ +=
          '<TR><TD id="EN719" class="data" colspan="2"></TD><TD id="EN73" class="data"></TD><TD id="EN741"></TD></TR>',
        _ +=
          '<TR><TD id="EN742" class="data" colspan="2"></TD><TD id="EN74" class="data"></TD><TD id="EN747"></TD></TR>',
        _ +=
          '<TR><TD id="EN739" class="data" colspan="2"></TD><TD id="EN75" class="data"></TD><TD id="EN748"></TD></TR>',
        _ +=
          '<TR><TD id="EN740" class="data" colspan="2"></TD><TD id="EN76" class="data"></TD><TD id="EN749"></TD></TR>',
        _ +=
          '<TR><TD id="EN721" class="data" colspan="2"></TD><TD id="EN77" class="data"></TD><TD id="EN750"></TD></TR>',
        _ +=
          '<TR><TD id="EN737"></TD><TD class="data dotB"></TD><TD id="EN78" class="data dotB"></TD><TD id="EN751" class="dotB"></TD></TR>',
        _ +=
          '<TR><TD id="EN720" class="data"></TD><TD class="data" colspan="2"><Font size="2"><B>New World Food</B></Font></TD><TD><Font size="2"><B>Battle Grounds Food</B></Font></TD></TR>',
        _ +=
          '<TR><TD id="EN710" class="data"></TD><TD id="EN727" class="data" colspan="2"></TD><TD id="EN723"></TD></TR>',
        _ +=
          '<TR><TD id="EN79" class="data"></TD><TD id="EN728" class="data" colspan="2"></TD><TD id="EN724"></TD></TR>',
        _ +=
          '<TR><TD id="EN738" class="data"></TD><TD id="EN729" class="data" colspan="2"></TD><TD id="EN725"></TD></TR>',
        _ +=
          '<TR><TD id="EN716" class="data"></TD><TD id="EN730" class="data" colspan="2"></TD><TD id="EN726" class="dotB"></TD></TR>',
        _ +=
          '<TR><TD id="EN746" class="data"></TD><TD id="EN731" class="data" colspan="2"></TD><TD><Font size="2"><B>Elemental Resist Pot.</B></Font></TD></TR>',
        _ +=
          '<TR><TD id="EN72" class="data"></TD><TD id="EN732" class="data" colspan="2"></TD><TD id="EN711"></TD></TR>',
        _ +=
          '<TR><TD id="EN71" class="data"></TD><TD id="EN733" class="data" colspan="2"></TD><TD id="EN712"></TD></TR>',
        _ +=
          '<TR><TD id="EN70" class="data"></TD><TD id="EN734" class="data" colspan="2"></TD><TD id="EN713"></TD></TR>',
        myInnerHtml(
          "SP_SIEN05",
          (_ +=
            '<TR><TD id="EN743" class="data" class="data"></TD><TD id="EN735" class="data" colspan="2"></TD><TD id="EN714"></TD></TR>'),
          0,
        ),
        myInnerHtml(
          "EN70",
          '<input type="checkbox" name="A7_Skill0" onClick="A7(1)"><span class=name>Sesame Pastry<span class=nametext>HIT +30</span></span>',
          0,
        ),
        myInnerHtml(
          "EN71",
          '<input type="checkbox" name="A7_Skill1" onClick="A7(1)"><span class=name>Honey Pastry<span class=nametext>FLEE +30</span></span>',
          0,
        ),
        myInnerHtml(
          "EN72",
          '<input type="checkbox" name="A7_Skill2" onClick="A7(1)"><span class=name>Rainbow Cake<span class=nametext>ATK +10, MATK +10</span></span>',
          0,
        ),
        myInnerHtml(
          "EN79",
          '<input type="checkbox" name="A7_Skill9" onClick="A7(1)"><span class=name>Box of Resentment<span class=nametext>ATK +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN710",
          '<input type="checkbox" name="A7_Skill10" onClick="A7(1)"><span class=name>Box of Drowsiness<span class=nametext>MATK +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN711",
          '<input type="checkbox" name="A7_Skill11" onClick="A7(1)">Coldproof Potion',
          0,
        ),
        myInnerHtml(
          "EN712",
          '<input type="checkbox" name="A7_Skill12" onClick="A7(1)">Earthproof Potion',
          0,
        ),
        myInnerHtml(
          "EN713",
          '<input type="checkbox" name="A7_Skill13" onClick="A7(1)">Fireproof Potion',
          0,
        ),
        myInnerHtml(
          "EN714",
          '<input type="checkbox" name="A7_Skill14" onClick="A7(1)">Thunderproof Potion',
          0,
        ),
        myInnerHtml(
          "EN715",
          '<input type="checkbox" name="A7_Skill26" onClick="A7(1)"><span class=name>Guarana Candy<span class=nametext>Increase AGI Lvl 5, ASPD +10% (same as Concentration Potion)</span></span>',
          0,
        ),
        myInnerHtml(
          "EN716",
          '<input type="checkbox" name="A7_Skill16" onClick="A7(1)"><span class=name>Buche de Noel<span class=nametext>HIT +3%, CRIT +7, MaxHP&SP +3%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN717",
          '<input type="checkbox" name="A7_Skill31" onClick="A7(1)"><span class=name>Aloevera<span class=nametext>Self Provoke Lvl 1</span></span>',
          0,
        ),
        myInnerHtml(
          "EN718",
          '<input type="checkbox" name="A7_Skill32" onClick="A7(1)"><span class=name>Small/Big Defense Potion<span class=nametext>DEF +3</span></span>',
          0,
        ),
        myInnerHtml(
          "EN719",
          '<input type="checkbox" name="A7_Skill33" onClick="A7(1)"><span class=name>Small/Big Magic Defense Potion<span class=nametext>MDEF +3</span></span>',
          0,
        ),
        myInnerHtml(
          "EN720",
          '<input type="checkbox" name="A7_Skill34" onClick="A7(1)"><span class=name>Box of Gloom<span class=nametext>' +
            skillName(42) +
            " Lvl 1</span></span>",
          0,
        ),
        myInnerHtml(
          "EN721",
          '<input type="checkbox" name="A7_Skill36" onClick="A7(1)"><span class=name>Halo-Halo / Luxurious Western Food<span class=nametext>All Stats +3</span></span>',
          0,
        ),
        myInnerHtml(
          "EN722",
          '<select name="A_SpeedPOT" onChange="A7(1)" style="width:168px; height:26px;"><option value="0">(no Speed Potion)</option></select>',
          0,
        ),
        myInnerHtml(
          "EN723",
          '<input type="checkbox" name="A7_Skill27" onClick="A7(1)"><span class=name>Military Ration B<span class=nametext>HIT +33</span></span>',
          0,
        ),
        myInnerHtml(
          "EN724",
          '<input type="checkbox" name="A7_Skill28" onClick="A7(1)"><span class=name>Military Ration C<span class=nametext>FLEE +33</span></span>',
          0,
        ),
        myInnerHtml(
          "EN725",
          '<input type="checkbox" name="A7_Skill29" onClick="A7(1)"><span class=name>Tasty Pink Ration<span class=nametext>ATK +15</span></span>',
          0,
        ),
        myInnerHtml(
          "EN726",
          '<input type="checkbox" name="A7_Skill30" onClick="A7(1)"><span class=name>Tasty White Ration<span class=nametext>MATK +15</span></span>',
          0,
        ),
        myInnerHtml(
          "EN727",
          '<input type="checkbox" name="A7_Skill17" onClick="A7(1)"><span class=name>Rune Strawberry Cake<span class=nametext>ATK +5, MATK +5</span></span>',
          0,
        ),
        myInnerHtml(
          "EN728",
          '<input type="checkbox" name="A7_Skill18" onClick="A7(1)"><span class=name>Schwartzwald Pine Jubilee<span class=nametext>HIT +10, Perfect Dodge +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN729",
          '<input type="checkbox" name="A7_Skill19" onClick="A7(1)"><span class=name>Arunafeltz Desert Sandwich<span class=nametext>CRIT +7</span></span>',
          0,
        ),
        myInnerHtml(
          "EN730",
          '<input type="checkbox" name="A7_Skill20" onClick="A7(1)"><span class=name>Manuk\'s Sturdiness<span class=nametext>ATK based damage on Manuk maps +10%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN731",
          '<input type="checkbox" name="A7_Skill21" onClick="A7(1)"><span class=name>Manuk\'s Faith<span class=nametext>MATK based damage on Manuk maps +10%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN732",
          '<input type="checkbox" name="A7_Skill22" onClick="A7(1)"><span class=name>Manuk\'s Will<span class=nametext>Received damage on Manuk maps -10%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN733",
          '<input type="checkbox" name="A7_Skill23" onClick="A7(1)"><span class=name>Pinguicula\'s Fruit Jam<span class=nametext>ATK based dmg on Splendide maps +10%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN734",
          '<input type="checkbox" name="A7_Skill24" onClick="A7(1)"><span class=name>Cornus\' Tear<span class=nametext>MATK based damage on Splendide maps +10%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN735",
          '<input type="checkbox" name="A7_Skill25" onClick="A7(1)"><span class=name>Luciola\'s Honey Jam<span class=nametext>Received damage on Splendide maps -10%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN737",
          '<input type="checkbox" name="A7_Skill37" onClick="A7(1)"><span class=name>Lucky Rice Cake<span class=nametext>LUK +21</span></span>',
          0,
        ),
        myInnerHtml(
          "EN738",
          '<input type="checkbox" name="A7_Skill38" onClick="A7(1)"><span class=name>Distilled Fighting Spirit<span class=nametext>ATK +30</span></span>',
          0,
        ),
        myInnerHtml(
          "EN746",
          "<input type=checkbox name=A7_Skill46 onClick=A7(1)><span class=name>Tyr's Blessing<span class=nametext>FLEE +30, HIT +30, ATK +20, MATK +20</span></span>",
          0,
        ),
        myInnerHtml(
          "EN742",
          '<select name="A7_Skill42" onChange="A7(1)" style="width:205px;"><option value="0">(none)</option></select>',
          0,
        ),
        myInnerHtml(
          "EN744",
          '<input type="checkbox" name="A7_Skill44" onClick="A7(1)"><span class=name>Ginger Bread<span class=nametext>ASPD +15% (same as Awakening Potion)</span></span>',
          0,
        ),
        myInnerHtml(
          "EN745",
          '<input type="checkbox" name="A7_Skill45" onClick="A7(1)"><span class=name>Regeneration Potion<span class=nametext>Items/skills recover +20%</span></span>',
          0,
        ),
        myInnerHtml(
          "EN739",
          '<select name="A7_Skill39" onChange="A7(1)"><option value="0">(no HP Increase Potion)</option></select>',
          0,
        ),
        myInnerHtml(
          "EN740",
          '<select name="A7_Skill40" onChange="A7(1)"><option value="0">(no SP Increase Potion)</option></select>',
          0,
        ),
        myInnerHtml(
          "EN741",
          '<input type="checkbox" name="A7_Skill41" onClick="A7(1)"><span class=name>Savage BBQ<span class=nametext>STR +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN747",
          '<input type="checkbox" name="A7_Skill47" onClick="A7(1)"><span class=name>Cocktail Warg Blood<span class=nametext>AGI +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN748",
          '<input type="checkbox" name="A7_Skill48" onClick="A7(1)"><span class=name>Minor Stew<span class=nametext>VIT +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN749",
          '<input type="checkbox" name="A7_Skill49" onClick="A7(1)"><span class=name>Siroma Iced Tea<span class=nametext>INT +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN750",
          '<input type="checkbox" name="A7_Skill50" onClick="A7(1)"><span class=name>Drosera Herb Salad<span class=nametext>DEX +20</span></span>',
          0,
        ),
        myInnerHtml(
          "EN751",
          '<input type="checkbox" name="A7_Skill51" onClick="A7(1)"><span class=name>Petite Tail Noodles<span class=nametext>LUK +20</span></span>',
          0,
        ),
        myInnerHtml("EN73", '<select name="A7_Skill3" onChange="A7(1)"></select>&nbsp', 0),
        myInnerHtml("EN74", '<select name="A7_Skill4" onChange="A7(1)"></select> ', 0),
        myInnerHtml("EN75", '<select name="A7_Skill5" onChange="A7(1)"></select> ', 0),
        myInnerHtml("EN76", '<select name="A7_Skill6" onChange="A7(1)"></select> ', 0),
        myInnerHtml("EN77", '<select name="A7_Skill7" onChange="A7(1)"></select> ', 0),
        myInnerHtml("EN78", '<select name="A7_Skill8" onChange="A7(1)"></select> ', 0),
        c.A7_Skill3.options[0] = new documento.Opzione("STR+", 0),
        c.A7_Skill4.options[0] = new documento.Opzione("AGI+", 0),
        c.A7_Skill5.options[0] = new documento.Opzione("VIT+", 0),
        c.A7_Skill6.options[0] = new documento.Opzione("INT+", 0),
        c.A7_Skill7.options[0] = new documento.Opzione("DEX+", 0),
        c.A7_Skill8.options[0] = new documento.Opzione("LUK+", 0),
        i = 1;
      i <= 10;
      i++
    )
      ((c.A7_Skill3.options[i] = new documento.Opzione("+" + i, i)),
        (c.A7_Skill4.options[i] = new documento.Opzione("+" + i, i)),
        (c.A7_Skill5.options[i] = new documento.Opzione("+" + i, i)),
        (c.A7_Skill6.options[i] = new documento.Opzione("+" + i, i)),
        (c.A7_Skill7.options[i] = new documento.Opzione("+" + i, i)),
        (c.A7_Skill8.options[i] = new documento.Opzione("+" + i, i)));
    ((c.A7_Skill39.options[0] = new documento.Opzione("(no HP Increase Potion)", 0)),
      (c.A7_Skill39.options[1] = new documento.Opzione("Small HP Increase Potion", 1)),
      (c.A7_Skill39.options[2] = new documento.Opzione("Medium HP Increase Potion", 2)),
      (c.A7_Skill39.options[3] = new documento.Opzione("Large HP Increase Potion", 3)),
      (c.A7_Skill40.options[0] = new documento.Opzione("(no SP Increase Potion)", 0)),
      (c.A7_Skill40.options[1] = new documento.Opzione("Small SP Increase Potion", 1)),
      (c.A7_Skill40.options[2] = new documento.Opzione("Medium SP Increase Potion", 2)),
      (c.A7_Skill40.options[3] = new documento.Opzione("Large SP Increase Potion", 3)),
      (c.A7_Skill42.options[0] = new documento.Opzione("(no Mega Resist Potion)", 0)),
      (c.A7_Skill42.options[1] = new documento.Opzione(
        "Mega Resist Potion [+10% resistance to Blind, Bleeding, Confusion, Curse, Frozen, Poison, Silence, Sleep, Stun and Stone Curse status effects]",
        1,
      )),
      (c.A7_Skill42.options[2] = new documento.Opzione(
        "Mega Resist Potion (iRO) [+20% resistance to Blind, Bleeding, Confusion, Curse, Frozen, Poison, Silence, Sleep, Stun and Stone Curse status effects]",
        2,
      )),
      (SpeedPotName = [
        "(no ASPD potion/item)",
        "Concentration Potion",
        "Awakening Potion (Lvl 40)",
        "Berserk Potion",
      ]),
      (c.A_SpeedPOT.options[0] = new documento.Opzione(SpeedPotName[0], 0)),
      (c.A_SpeedPOT.options[1] = new documento.Opzione(SpeedPotName[1], 1)),
      SetSpeedPotionOptions(),
      (c.A7_Skill0.checked = n_A_Buf7[0]),
      (c.A7_Skill1.checked = n_A_Buf7[1]),
      (c.A7_Skill2.checked = n_A_Buf7[2]),
      (c.A7_Skill3.value = n_A_Buf7[3]),
      (c.A7_Skill4.value = n_A_Buf7[4]),
      (c.A7_Skill5.value = n_A_Buf7[5]),
      (c.A7_Skill6.value = n_A_Buf7[6]),
      (c.A7_Skill7.value = n_A_Buf7[7]),
      (c.A7_Skill8.value = n_A_Buf7[8]),
      (c.A7_Skill9.checked = n_A_Buf7[9]),
      (c.A7_Skill10.checked = n_A_Buf7[10]),
      (c.A7_Skill11.checked = n_A_Buf7[11]),
      (c.A7_Skill12.checked = n_A_Buf7[12]),
      (c.A7_Skill13.checked = n_A_Buf7[13]),
      (c.A7_Skill14.checked = n_A_Buf7[14]),
      (c.A7_Skill16.checked = n_A_Buf7[16]),
      (c.A7_Skill17.checked = n_A_Buf7[17]),
      (c.A7_Skill18.checked = n_A_Buf7[18]),
      (c.A7_Skill19.checked = n_A_Buf7[19]),
      (c.A7_Skill20.checked = n_A_Buf7[20]),
      (c.A7_Skill21.checked = n_A_Buf7[21]),
      (c.A7_Skill22.checked = n_A_Buf7[22]),
      (c.A7_Skill23.checked = n_A_Buf7[23]),
      (c.A7_Skill24.checked = n_A_Buf7[24]),
      (c.A7_Skill25.checked = n_A_Buf7[25]),
      (c.A7_Skill26.checked = n_A_Buf7[26]),
      (c.A7_Skill27.checked = n_A_Buf7[27]),
      (c.A7_Skill28.checked = n_A_Buf7[28]),
      (c.A7_Skill29.checked = n_A_Buf7[29]),
      (c.A7_Skill30.checked = n_A_Buf7[30]),
      (c.A7_Skill31.checked = n_A_Buf7[31]),
      (c.A7_Skill32.checked = n_A_Buf7[32]),
      (c.A7_Skill33.checked = n_A_Buf7[33]),
      (c.A7_Skill34.checked = n_A_Buf7[34]),
      (c.A_SpeedPOT.value = n_A_Buf7[35]),
      (c.A7_Skill36.checked = n_A_Buf7[36]),
      (c.A7_Skill37.checked = n_A_Buf7[37]),
      (c.A7_Skill38.checked = n_A_Buf7[38]),
      (c.A7_Skill39.value = n_A_Buf7[39]),
      (c.A7_Skill40.value = n_A_Buf7[40]),
      (c.A7_Skill41.checked = n_A_Buf7[41]),
      (c.A7_Skill42.value = n_A_Buf7[42]),
      (c.A7_Skill44.checked = n_A_Buf7[44]),
      (c.A7_Skill45.checked = n_A_Buf7[45]),
      (c.A7_Skill46.checked = n_A_Buf7[46]),
      (c.A7_Skill47.checked = n_A_Buf7[47]),
      (c.A7_Skill48.checked = n_A_Buf7[48]),
      (c.A7_Skill49.checked = n_A_Buf7[49]),
      (c.A7_Skill50.checked = n_A_Buf7[50]),
      (c.A7_Skill51.checked = n_A_Buf7[51]));
  } else {
    var _;
    ((_ =
      '<TR><TD id="A7TD" class="subheader point" onclick="Buf7SW(1)" role="button" tabindex="0" aria-expanded="false">Food, Speed Potions & other Items <span id="A7used"></span>'),
      myInnerHtml(
        "SP_SIEN05",
        (_ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  A7(0);
}
function A7(e) {
  e == 1 && calc();
  for (var _ = 0, n = 0; n < n_A_Buf7.length; n++)
    if (n_A_Buf7[n] != 0) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("A7TD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("A7used", _ == 0 ? "" : " [active]", 0));
}
function Buf9SW(e) {
  if (((n_Skill9SW = e), n_Skill9SW)) {
    ((n =
      '<TR><TD id="A9TD" Colspan="5" class="subheader point" onclick="Buf9SW(0)" role="button" tabindex="0" aria-expanded="true">Additional Enchants & Manual Edits on Player <SPAN id="A9used"></SPAN>'),
      (n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
      (n += '<TR><TD class="dotB" Colspan="5"><table>'),
      (n +=
        '<tr><td class="data"><Font size="2"><B>Player Stats</B></Font></td><td Colspan="3"><Font size="2"><B>Player Sub-Stats</B></Font></td></tr>'),
      (n +=
        '<tr><td class="data" id="EN965"></td><TD id="EN931"></TD><TD id="EN939"></TD><TD id="EN945"></TD><TD id="EN984"></TD></tr>'),
      (n +=
        '<tr><td class="data" id="EN967"></td><TD id="EN933"></TD><TD id="EN941"></TD><TD id="EN947"></TD><TD id="EN959"></TD></tr>'),
      (n +=
        '<tr><td class="data" id="EN969"></td><TD id="EN935"></TD><TD id="EN951"></TD><TD id="EN943"></TD><TD id="EN985"></TD></tr>'),
      (n +=
        '<tr><td class="data" id="EN971"></td><TD id="EN937"></TD><TD id="EN955"></TD><TD id="EN983"></TD><TD id="EN986"></TD></tr>'),
      (n +=
        '<tr><td class="data" id="EN973"></td><TD id="EN961"></TD><TD id="EN953"></TD><TD id="EN944"></TD><TD id="EN987"></TD></tr>'),
      (n +=
        '<tr><td class="data" id="EN975"></td><TD id="EN963"></TD><TD id="EN957"></TD><TD id="EN949"></TD><TD id="EN988"></TD></tr>'),
      (n += "</table></TD></TR>"),
      (n +=
        '<TR><TD class="data"><Font size="2"><B>+% ATK based damage</B></Font></TD><TD colspan="4"><Font size="2"><B>Other</B></Font></TD></TR>'),
      (n += '<tr><TD id="EN900" class="data"></TD><TD id="EN915" colspan="4"></TD></tr>'),
      (n += '<tr><TD id="EN901" class="data"></TD><TD id="EN916" colspan="4"></TD></tr>'),
      (n += '<tr><TD id="EN902" class="data"></TD><TD id="EN976" colspan="4"></TD></tr>'),
      (n += '<tr><TD id="EN903" class="data dotB"></TD><TD id="EN977" colspan="4"></TD></tr>'),
      (n +=
        '<TR><TD class="data"><Font size="2"><B>+% Resistance</B></Font></TD><TD id="EN980" colspan="4"></TD></TR>'),
      (n += '<tr><TD id="EN904" class="data"></TD><TD id="EN978" colspan="4"></TD></tr>'),
      (n += '<tr><TD id="EN905" class="data"></TD><TD id="EN979" colspan="4"></TD></tr>'),
      (n += '<tr><TD id="EN906" class="data"></TD><TD id="EN981" colspan="4"></TD></tr>'),
      myInnerHtml(
        "ID_ARG",
        (n += '<tr><TD id="EN907" class="data"></TD><TD id="EN982" colspan="4"></TD></tr>'),
        0,
      ));
    var _ =
      '<optgroup label="Race"><option value="0">Formless</option><option value="1">Undead</option><option value="2">Brute</option><option value="3">Plant</option><option value="4">Insect</option><option value="5">Fish</option><option value="6">Demon</option><option value="7">Demi-Human</option><option value="8">Angel</option><option value="9">Dragon</option></optgroup><optgroup label="Element"><option value="10">Neutral </option><option value="11">Water </option><option value="12">Earth </option><option value="13">Fire </option><option value="14">Wind </option><option value="15">Poison </option><option value="16">Holy </option><option value="17">Shadow </option><option value="18">Ghost </option><option value="19">Undead </option></optgroup><optgroup label="Size"><option value="20">Small</option><option value="21">Medium</option><option value="22">Large</option></optgroup>';
    for (i = 0; i < 4; i++)
      myInnerHtml(
        "EN90" + i,
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC' +
          i +
          '" value="0" class="center">% vs<select name="A9_Skill' +
          i +
          '" onChange="A9(1)">' +
          _ +
          '<optgroup label="Type"><option value="23">Boss</option><option value="24">Goblin</option><option value="25">Golem</option><option value="26">Guardian</option><option value="27">Kobold</option><option value="28">Orc</option><option value="29">Satan Morroc</option></optgroup></select>',
        0,
      );
    for (i = 4; i < 8; i++)
      myInnerHtml(
        "EN90" + i,
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC' +
          i +
          '" value="0" class="center">% vs<select name="A9_Skill' +
          i +
          '" onChange="A9(1)">' +
          _ +
          '<optgroup label="Type"><option value="23">Boss</option><option value="24">Normal</option><option value="25">Guardian</option></optgroup></select>',
        0,
      );
    for (
      myInnerHtml(
        "EN965",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC32" value="0" class="center">STR',
        0,
      ),
        myInnerHtml(
          "EN967",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC33" value="0" class="center">AGI',
          0,
        ),
        myInnerHtml(
          "EN969",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC34" value="0" class="center">VIT',
          0,
        ),
        myInnerHtml(
          "EN971",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC35" value="0" class="center">INT',
          0,
        ),
        myInnerHtml(
          "EN973",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC36" value="0" class="center">DEX',
          0,
        ),
        myInnerHtml(
          "EN975",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC37" value="0" class="center">LUK',
          0,
        ),
        myInnerHtml(
          "EN931",
          '+<input type="text" inputmode="numeric" maxlength="5" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC15" value="0" class="center" style="width:44px;">MaxHP',
          0,
        ),
        myInnerHtml(
          "EN933",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC16" value="0" class="center">% MaxHP',
          0,
        ),
        myInnerHtml(
          "EN935",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC17" value="0" class="center">MaxSP',
          0,
        ),
        myInnerHtml(
          "EN937",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC18" value="0" class="center">% MaxSP',
          0,
        ),
        myInnerHtml(
          "EN961",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC30" value="0" class="center">% HP Regen',
          0,
        ),
        myInnerHtml(
          "EN963",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC31" value="0" class="center">% SP Regen',
          0,
        ),
        myInnerHtml(
          "EN939",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC19" value="0" class="center">DEF',
          0,
        ),
        myInnerHtml(
          "EN941",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC20" value="0" class="center">MDEF',
          0,
        ),
        myInnerHtml(
          "EN943",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC21" value="0" class="center">HIT',
          0,
        ),
        myInnerHtml(
          "EN983",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC83" value="0" class="center">% HIT',
          0,
        ),
        myInnerHtml(
          "EN944",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC40" value="0" class="center">Perfect HIT',
          0,
        ),
        myInnerHtml(
          "EN945",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC22" value="0" class="center">FLEE',
          0,
        ),
        myInnerHtml(
          "EN947",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC23" value="0" class="center">Perfect Dodge',
          0,
        ),
        myInnerHtml(
          "EN949",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC24" value="0" class="center">Critical Rate',
          0,
        ),
        myInnerHtml(
          "EN951",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC25" value="0" class="center">ATK',
          0,
        ),
        myInnerHtml(
          "EN953",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC38" value="0" class="center">% ATK',
          0,
        ),
        myInnerHtml(
          "EN955",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC27" value="0" class="center">MATK',
          0,
        ),
        myInnerHtml(
          "EN957",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC28" value="0" class="center">% MATK',
          0,
        ),
        myInnerHtml(
          "EN984",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC84" value="0" class="center">ASPD',
          0,
        ),
        myInnerHtml(
          "EN959",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC29" value="0" class="center">% ASPD',
          0,
        ),
        myInnerHtml(
          "EN985",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC85" value="0" class="center">Mastery ATK',
          0,
        ),
        myInnerHtml(
          "EN986",
          '&ndash;<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC86" value="0" class="center">% Cast Time',
          0,
        ),
        myInnerHtml(
          "EN987",
          '&ndash;<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC87" value="0" class="center">% Cast Delay',
          0,
        ),
        myInnerHtml(
          "EN988",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC88" value="0" class="center">Weight',
          0,
        ),
        myInnerHtml(
          "EN915",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC26" value="0" class="center">% ATK based damage on any target.',
          0,
        ),
        myInnerHtml(
          "EN916",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC39" value="0" class="center">% MATK based damage on any target.',
          0,
        ),
        myInnerHtml(
          "EN976",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC41" value="0" class="center">% Long-range ATK based damage on any target.',
          0,
        ),
        myInnerHtml(
          "EN977",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC42" value="0" class="center">% Critical damage on any target.',
          0,
        ),
        myInnerHtml(
          "EN978",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC43" value="0" class="center">% DEF ignoring on any target.',
          0,
        ),
        myInnerHtml(
          "EN979",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC44" value="0" class="center">% MDEF ignoring on any target.',
          0,
        ),
        myInnerHtml(
          "EN980",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC45" value="0" class="center">% Long-range ATK and MATK based damage resistance.',
          0,
        ),
        myInnerHtml(
          "EN981",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC47" value="0" class="center">% <select name="A9_Skill8" onChange="A9(1)" style="width:170px;"></select> skill damage.',
          0,
        ),
        myInnerHtml(
          "EN982",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A9(1)" name="ARG_RC48" value="0" class="center">% <select name="A9_Skill9" onChange="A9(1)" style="width:170px;"></select> skill damage.',
          0,
        ),
        c.A9_Skill8.options[0] = new documento.Opzione("(no skill selected)", 0),
        i = 1;
      i < All_DMGskill.length;
      i++
    )
      c.A9_Skill8.options[i] = new documento.Opzione(
        skillNameInSelect(m_Skill[All_DMGskill[i]][0]),
        All_DMGskill[i],
      );
    for (
      c.A9_Skill9.options[0] = new documento.Opzione("(no skill selected)", 0), i = 1;
      i < All_DMGskill.length;
      i++
    )
      c.A9_Skill9.options[i] = new documento.Opzione(
        skillNameInSelect(m_Skill[All_DMGskill[i]][0]),
        All_DMGskill[i],
      );
    ((c.A9_Skill0.value = n_A_Buf9[0]),
      (c.ARG_RC0.value = n_A_Buf9[1]),
      (c.A9_Skill1.value = n_A_Buf9[2]),
      (c.ARG_RC1.value = n_A_Buf9[3]),
      (c.A9_Skill2.value = n_A_Buf9[4]),
      (c.ARG_RC2.value = n_A_Buf9[5]),
      (c.A9_Skill3.value = n_A_Buf9[6]),
      (c.ARG_RC3.value = n_A_Buf9[7]),
      (c.A9_Skill4.value = n_A_Buf9[8]),
      (c.ARG_RC4.value = n_A_Buf9[9]),
      (c.A9_Skill5.value = n_A_Buf9[10]),
      (c.ARG_RC5.value = n_A_Buf9[11]),
      (c.A9_Skill6.value = n_A_Buf9[12]),
      (c.ARG_RC6.value = n_A_Buf9[13]),
      (c.A9_Skill7.value = n_A_Buf9[14]),
      (c.ARG_RC7.value = n_A_Buf9[15]),
      (c.ARG_RC43.value = n_A_Buf9[16]),
      (c.ARG_RC44.value = n_A_Buf9[17]),
      (c.ARG_RC45.value = n_A_Buf9[18]),
      (c.ARG_RC47.value = n_A_Buf9[19]),
      (c.A9_Skill8.value = n_A_Buf9[20]),
      (c.ARG_RC48.value = n_A_Buf9[21]),
      (c.A9_Skill9.value = n_A_Buf9[22]),
      (c.ARG_RC83.value = n_A_Buf9[23]),
      (c.ARG_RC84.value = n_A_Buf9[24]),
      (c.ARG_RC85.value = n_A_Buf9[25]),
      (c.ARG_RC86.value = n_A_Buf9[26]),
      (c.ARG_RC87.value = n_A_Buf9[27]),
      (c.ARG_RC88.value = n_A_Buf9[28]),
      (c.ARG_RC15.value = n_A_Buf9[30]),
      (c.ARG_RC16.value = n_A_Buf9[31]),
      (c.ARG_RC17.value = n_A_Buf9[32]),
      (c.ARG_RC18.value = n_A_Buf9[33]),
      (c.ARG_RC19.value = n_A_Buf9[34]),
      (c.ARG_RC20.value = n_A_Buf9[35]),
      (c.ARG_RC21.value = n_A_Buf9[36]),
      (c.ARG_RC22.value = n_A_Buf9[37]),
      (c.ARG_RC23.value = n_A_Buf9[38]),
      (c.ARG_RC24.value = n_A_Buf9[39]),
      (c.ARG_RC25.value = n_A_Buf9[40]),
      (c.ARG_RC26.value = n_A_Buf9[41]),
      (c.ARG_RC27.value = n_A_Buf9[42]),
      (c.ARG_RC28.value = n_A_Buf9[43]),
      (c.ARG_RC29.value = n_A_Buf9[44]),
      (c.ARG_RC30.value = n_A_Buf9[45]),
      (c.ARG_RC31.value = n_A_Buf9[46]),
      (c.ARG_RC32.value = n_A_Buf9[47]),
      (c.ARG_RC33.value = n_A_Buf9[48]),
      (c.ARG_RC34.value = n_A_Buf9[49]),
      (c.ARG_RC35.value = n_A_Buf9[50]),
      (c.ARG_RC36.value = n_A_Buf9[51]),
      (c.ARG_RC37.value = n_A_Buf9[52]),
      (c.ARG_RC38.value = n_A_Buf9[53]),
      (c.ARG_RC39.value = n_A_Buf9[54]),
      (c.ARG_RC40.value = n_A_Buf9[55]),
      (c.ARG_RC41.value = n_A_Buf9[56]),
      (c.ARG_RC42.value = n_A_Buf9[57]));
  } else {
    var n;
    ((n =
      '<TR><TD id="A9TD" class="subheader point" onclick="Buf9SW(1)" role="button" tabindex="0" aria-expanded="false">Additional Enchants & Manual Edits on Player <SPAN id="A9used"></SPAN>'),
      myInnerHtml(
        "ID_ARG",
        (n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  A9(0);
}
function A9(e) {
  e == 1 && calc();
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
  var a = documento.getElementById("A9TD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("A9used", _ == 0 ? "" : " [active]", 0));
}
function Buf10SW(e) {
  if (((n_Skill10SW = e), n_Skill10SW)) {
    for (
      _ =
        '<TR><TD id="A10TD" Colspan="4" class="subheader point" onclick="Buf10SW(0)" role="button" tabindex="0" aria-expanded="true">Manual Edits on Enemy <SPAN id="A10used"></SPAN>',
        _ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>',
        _ +=
          '<TR><TD class="data"><Font size="2"><B>Enemy Stats</B></Font></td><td colspan="3"><Font size="2"><B>Enemy Sub-Stats</B></Font></td></tr>',
        _ +=
          '<tr><td id="EN1067" class="data"></td><TD id="EN1031"></TD><TD id="EN1051"></TD><TD id="EN1043"></TD></tr>',
        _ +=
          '<tr><td id="EN1069" class="data"></td><TD id="EN1033"></TD><TD id="EN1055"></TD><TD id="EN1044"></TD></tr>',
        _ +=
          '<tr><td id="EN1071" class="data"></td><TD id="EN1039"></TD><TD id="EN1053"></TD><TD id="EN1049"></TD></tr>',
        _ +=
          '<tr><td id="EN1073" class="data"></td><TD id="EN1041"></TD><TD id="EN1057"></TD><TD id="EN1045"></TD></tr>',
        _ +=
          '<tr><td id="EN1075" class="data dotB"></td><TD class="dotB"></TD><TD id="EN1059" class="dotB"></TD><TD id="EN1047" class="dotB"></TD></tr>',
        _ +=
          "<TR><TD colspan='4'><Font size='2'><B>Enemy's damage reductions:</B></Font></TD></TR>",
        _ +=
          '<tr><TD id="EN1001" class="data" colspan="2"></TD><TD id="EN1003" colspan="2"></TD></tr>',
        _ +=
          '<tr><TD id="EN1002" class="data" colspan="2"></TD><TD id="EN1004" colspan="2"></TD></tr>',
        _ +=
          '<tr><TD id="EN1000" class="data dotB" colspan="2"></TD><TD id="EN1010" class="dotB" colspan="2"></TD></tr>',
        _ += '<TR><TD id="EN1015" colspan="4"></TD></TR>',
        myInnerHtml("B_MANUAL", (_ += '<TR><TD id="EN1016" colspan="4"></TD></TR>'), 0),
        myInnerHtml(
          "EN1000",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC0" value="0" class="center">% Racial Resistance',
          0,
        ),
        myInnerHtml(
          "EN1001",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC1" value="0" class="center">vs<select name="Bman1" onChange="A10(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN1002",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC2" value="0" class="center">vs<select name="Bman2" onChange="A10(1)"></select>',
          0,
        ),
        myInnerHtml(
          "EN1003",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC3" value="0" class="center">% Size Resistance',
          0,
        ),
        myInnerHtml(
          "EN1004",
          '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC4" value="0" class="center">% Long-range Resistance',
          0,
        ),
        myInnerHtml(
          "EN1010",
          '+<input type="text" inputmode="numeric" onkeypress="return isNumeric(event)" maxlength="3" onkeyup="A10(1)" name="BRG_RC10" value="0" class="center">% Additional Reflect (equip/card)',
          0,
        ),
        i = 0;
      i < v_Element_.length;
      i++
    )
      ((c.Bman1.options[i] = new documento.Opzione(v_Element_[i], i)),
        (c.Bman2.options[i] = new documento.Opzione(v_Element_[i], i)));
    (myInnerHtml(
      "EN1015",
      '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC26" value="0" class="center">% ATK based damage on any target.',
      0,
    ),
      myInnerHtml(
        "EN1016",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC39" value="0" class="center">% MATK based damage on any target.',
        0,
      ),
      myInnerHtml(
        "EN1031",
        '+<input type="text" inputmode="numeric" maxlength="5" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC15" value="0" class="center" style="width:44px;">MaxHP',
        0,
      ),
      myInnerHtml(
        "EN1033",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC16" value="0" class="center" disabled><S>% MaxHP</S>',
        0,
      ),
      myInnerHtml(
        "EN1039",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC19" value="0" class="center">DEF',
        0,
      ),
      myInnerHtml(
        "EN1041",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC20" value="0" class="center">MDEF',
        0,
      ),
      myInnerHtml(
        "EN1043",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC21" value="0" class="center">HIT',
        0,
      ),
      myInnerHtml(
        "EN1044",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC40" value="0" class="center" disabled><S>Perfect HIT</S>',
        0,
      ),
      myInnerHtml(
        "EN1045",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC22" value="0" class="center">FLEE',
        0,
      ),
      myInnerHtml(
        "EN1047",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC23" value="0" class="center" disabled><S>Perfect Dodge</S>',
        0,
      ),
      myInnerHtml(
        "EN1049",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC24" value="0" class="center">Critical Rate',
        0,
      ),
      myInnerHtml(
        "EN1051",
        '+<input type="text" inputmode="numeric" maxlength="5" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC25" value="0" class="center">ATK',
        0,
      ),
      myInnerHtml(
        "EN1055",
        '+<input type="text" inputmode="numeric" maxlength="5" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC38" value="0" class="center" disabled><S>Max ATK</S>',
        0,
      ),
      myInnerHtml(
        "EN1053",
        '+<input type="text" inputmode="numeric" maxlength="5" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC27" value="0" class="center">MATK',
        0,
      ),
      myInnerHtml(
        "EN1057",
        '+<input type="text" inputmode="numeric" maxlength="5" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC28" value="0" class="center" disabled><S>Max MATK</S>',
        0,
      ),
      myInnerHtml(
        "EN1059",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC29" value="0" class="center" disabled><S>% ASPD</S>',
        0,
      ),
      myInnerHtml(
        "EN1067",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC33" value="0" class="center">AGI ',
        0,
      ),
      myInnerHtml(
        "EN1069",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC34" value="0" class="center">VIT',
        0,
      ),
      myInnerHtml(
        "EN1071",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC35" value="0" class="center">INT',
        0,
      ),
      myInnerHtml(
        "EN1073",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC36" value="0" class="center">DEX',
        0,
      ),
      myInnerHtml(
        "EN1075",
        '+<input type="text" inputmode="numeric" maxlength="3" onkeypress="return isNumeric(event)" onkeyup="A10(1)" name="BRG_RC37" value="0" class="center">LUK',
        0,
      ),
      (c.BRG_RC0.value = n_B_manual[1]),
      (c.Bman1.value = n_B_manual[2]),
      (c.BRG_RC1.value = n_B_manual[3]),
      (c.Bman2.value = n_B_manual[4]),
      (c.BRG_RC2.value = n_B_manual[5]),
      (c.BRG_RC3.value = n_B_manual[7]),
      (c.BRG_RC4.value = n_B_manual[9]),
      (c.BRG_RC10.value = n_B_manual[21]),
      (c.BRG_RC15.value = n_B_manual[30]),
      (c.BRG_RC16.value = n_B_manual[31]),
      (c.BRG_RC19.value = n_B_manual[34]),
      (c.BRG_RC20.value = n_B_manual[35]),
      (c.BRG_RC21.value = n_B_manual[36]),
      (c.BRG_RC22.value = n_B_manual[37]),
      (c.BRG_RC23.value = n_B_manual[38]),
      (c.BRG_RC24.value = n_B_manual[39]),
      (c.BRG_RC25.value = n_B_manual[40]),
      (c.BRG_RC26.value = n_B_manual[41]),
      (c.BRG_RC27.value = n_B_manual[42]),
      (c.BRG_RC28.value = n_B_manual[43]),
      (c.BRG_RC29.value = n_B_manual[44]),
      (c.BRG_RC33.value = n_B_manual[48]),
      (c.BRG_RC34.value = n_B_manual[49]),
      (c.BRG_RC35.value = n_B_manual[50]),
      (c.BRG_RC36.value = n_B_manual[51]),
      (c.BRG_RC37.value = n_B_manual[52]),
      (c.BRG_RC38.value = n_B_manual[53]),
      (c.BRG_RC39.value = n_B_manual[54]),
      (c.BRG_RC40.value = n_B_manual[55]));
  } else {
    var _;
    ((_ =
      '<TR><TD id="A10TD" class="subheader point" onclick="Buf10SW(1)" role="button" tabindex="0" aria-expanded="false">Manual Edits on Enemy <SPAN id="A10used"></SPAN>'),
      myInnerHtml(
        "B_MANUAL",
        (_ += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  A10(0);
}
function isNumeric(e) {
  var _ = e || window.event,
    n = _.keyCode || _.which;
  ((n = String.fromCharCode(n)),
    /[0-9]|-/.test(n) || ((_.returnValue = !1), _.preventDefault && _.preventDefault()));
}
function A10(e) {
  e == 1 && calc();
  for (var _ = 0, n = 0; n < n_B_manual.length; n++)
    if (n_B_manual[n] != 0) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("A10TD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("A10used", _ == 0 ? "" : " [active]", 0));
}
function debufSW(e) {
  if (((n_debufSW = e), n_debufSW)) {
    ((n =
      '<TR><TD id="AITD" ColSpan="4" class="subheader point" onClick="debufSW(0)" role="button" tabindex="0" aria-expanded="true">Debuffs on Enemy <span id="AIused"></span>'),
      (n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
      (n +=
        '<TR><TD id="BI18_1" class="center" style="width:90px;">Mind Breaker</TD><TD id="BI18_2" class="data"></TD><TD id="BI2_1" class="center">Poison</TD><TD id="BI2_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI0_1" class="center">Provoke</TD><TD id="BI0_2" class="data"></TD><TD id="BI3_1" class="center">Blind</TD><TD id="BI3_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI12_1" class="center">Signum Crucis</TD><TD id="BI12_2" class="data"></TD><TD id="BI10_1" class="center">Curse</TD><TD id="BI10_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI5_1" class="center">Blessing</TD><TD id="BI5_2" class="data"></TD><TD id="BI7_1" class="center">Stun</TD><TD id="BI7_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI6_1" class="center">Lex Aeterna</TD><TD id="BI6_2" class="data"></TD><TD id="BI4_1" class="center">Frozen</TD><TD id="BI4_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI11_1" class="center">Decrease AGI</TD><TD id="BI11_2" class="data"></TD><TD id="BI9_1" class="center">Stone</TD><TD id="BI9_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI17_1" class="center">Spider Web</TD><TD id="BI17_2" class="data"></TD><TD id="BI8_1" class="center">Sleep</TD><TD id="BI8_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI1_1" class="center">Quagmire</TD><TD id="BI1_2" class="data"></TD><TD id="BI19_1" class="center">' +
        skillName(211) +
        '</TD><TD id="BI19_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI24_1" class="center dotB">Flying</TD><TD id="BI24_2" class="data dotB"></TD><TD id="BI20_1" class="center dotB">' +
        skillName(218) +
        '</TD><TD id="BI20_2" class="dotB"></TD></TR>'),
      (n += '<TR><TD class="center" ColSpan="4"><b>Monster Exclusive Debuffs</b></TD></TR>'),
      (n +=
        '<TR><TD id="BI13_1" class="center">' +
        skillName(172) +
        ' / Disarm</TD><TD id="BI13_2" class="data"></TD><TD id="BI14_1" class="center">' +
        skillName(173) +
        '</TD><TD id="BI14_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI15_1" class="center">' +
        skillName(174) +
        '</TD><TD id="BI15_2" class="data"></TD><TD id="BI16_1" class="center">' +
        skillName(175) +
        '</TD><TD id="BI16_2"></TD></TR>'),
      (n +=
        '<TR><TD id="BI21_1" class="center">Eska</TD><TD id="BI21_2" class="data"></TD><TD id="BI22_1" class="center">Eske</TD><TD id="BI22_2"></TD></TR>'),
      myInnerHtml(
        "EnemyDebuf",
        (n += '<TR><TD id="BI23_1" class="center" colspan="4"></TD></TR>'),
        0,
      ),
      myInnerHtml("BI0_2", '<select name="B_debuf0" onChange="AI(1)"></select>', 0),
      myInnerHtml("BI1_2", '<select name="B_debuf1" onChange="AI(1)"></select>', 0),
      myInnerHtml("BI2_2", '<input type="checkbox" name="B_debuf2" onClick="AI(1)">', 0),
      myInnerHtml("BI3_2", '<input type="checkbox" name="B_debuf3" onClick="AI(1)">', 0),
      myInnerHtml("BI4_2", '<input type="checkbox" name="B_debuf4" onClick="AI(1)">', 0),
      myInnerHtml("BI5_2", '<input type="checkbox" name="B_debuf5" onClick="AI(1)">', 0),
      myInnerHtml("BI6_2", '<input type="checkbox" name="B_debuf6" onClick="AI(1)">', 0),
      myInnerHtml("BI7_2", '<input type="checkbox" name="B_debuf7" onClick="AI(1)">', 0),
      myInnerHtml("BI8_2", '<input type="checkbox" name="B_debuf8" onClick="AI(1)">', 0),
      myInnerHtml("BI9_2", '<input type="checkbox" name="B_debuf9" onClick="AI(1)">', 0),
      myInnerHtml("BI10_2", '<input type="checkbox" name="B_debuf10" onClick="AI(1)">', 0),
      myInnerHtml("BI11_2", '<select name="B_debuf11" onChange="AI(1)"></select>', 0),
      myInnerHtml("BI12_2", '<select name="B_debuf12" onChange="AI(1)"></select>', 0),
      myInnerHtml("BI17_2", '<input type="checkbox" name="B_debuf17" onClick="AI(1)">', 0),
      myInnerHtml("BI18_2", '<select name="B_debuf18" onChange="AI(1)"></select>', 0),
      myInnerHtml("BI19_2", '<input type="checkbox" name="B_debuf19" onClick="AI(1)">', 0),
      myInnerHtml("BI20_2", '<input type="checkbox" name="B_debuf20" onClick="AI(1)">', 0),
      myInnerHtml("BI24_2", '<select name="B_debuf24" onChange="AI(1)"></select>', 0),
      myInnerHtml("BI13_2", '<input type="checkbox" name="B_debuf13" onClick="AI(1)">', 0),
      myInnerHtml("BI14_2", '<input type="checkbox" name="B_debuf14" onClick="AI(1)">', 0),
      myInnerHtml("BI15_2", '<input type="checkbox" name="B_debuf15" onClick="AI(1)">', 0),
      myInnerHtml("BI16_2", '<input type="checkbox" name="B_debuf16" onClick="AI(1)">', 0),
      myInnerHtml("BI21_2", '<input type="checkbox" name="B_debuf21" onClick="AI(1)">', 0),
      myInnerHtml("BI22_2", '<input type="checkbox" name="B_debuf22" onClick="AI(1)">', 0),
      myInnerHtml(
        "BI23_1",
        'Elemental Change (Sage Skill) <select name="B_debuf23" onChange="AI(1)||debufSW(1)"></select>',
        0,
      ));
    var _ = ["(none)", "Water", "Earth", "Fire", "Wind"];
    for (i = 0; i <= 4; i++) c.B_debuf23.options[i] = new documento.Opzione(_[i], i);
    for (
      targetData[19]
        ? (myInnerHtml("BI18_1", "<S>Mind Breaker</S>", 0),
          (c.B_debuf18.disabled = !0),
          (c.B_debuf18.value = 0),
          (n_B_debuf[18] = 0),
          myInnerHtml("BI0_1", "<S>Provoke</S>", 0),
          (c.B_debuf0.disabled = !0),
          (c.B_debuf0.value = 0),
          (n_B_debuf[0] = 0),
          myInnerHtml("BI11_1", "<S>Decrease AGI</S>", 0),
          (c.B_debuf11.disabled = !0),
          (c.B_debuf11.value = 0),
          (n_B_debuf[11] = 0),
          myInnerHtml("BI2_1", "<S>Poison</S>", 0),
          (c.B_debuf2.disabled = !0),
          (c.B_debuf2.value = 0),
          (n_B_debuf[2] = 0),
          myInnerHtml("BI3_1", "<S>Blind</S>", 0),
          (c.B_debuf3.disabled = !0),
          (c.B_debuf3.value = 0),
          (n_B_debuf[3] = 0),
          myInnerHtml("BI10_1", "<S>Curse</S>", 0),
          (c.B_debuf10.disabled = !0),
          (c.B_debuf10.value = 0),
          (n_B_debuf[10] = 0),
          myInnerHtml("BI7_1", "<S>Stun</S>", 0),
          (c.B_debuf7.disabled = !0),
          (c.B_debuf7.value = 0),
          (n_B_debuf[7] = 0),
          myInnerHtml("BI4_1", "<S>Frozen</S>", 0),
          (c.B_debuf4.disabled = !0),
          (c.B_debuf4.value = 0),
          (n_B_debuf[4] = 0),
          myInnerHtml("BI9_1", "<S>Stone</S>", 0),
          (c.B_debuf9.disabled = !0),
          (c.B_debuf9.value = 0),
          (n_B_debuf[9] = 0),
          myInnerHtml("BI8_1", "<S>Sleep</S>", 0),
          (c.B_debuf8.disabled = !0),
          (c.B_debuf8.value = 0),
          (n_B_debuf[8] = 0))
        : targetData[3] < 90 ||
            c.B_debuf23.value != 0 ||
            n_B_debuf[23] != 0 ||
            (n_B_buf[6] < 90 && n_B_buf[6] != 0)
          ? (myInnerHtml("BI18_1", "Mind Breaker", 0),
            (c.B_debuf18.disabled = !1),
            myInnerHtml("BI0_1", "Provoke", 0),
            (c.B_debuf0.disabled = !1),
            myInnerHtml("BI11_1", "Decrease AGI", 0),
            (c.B_debuf11.disabled = !1),
            myInnerHtml("BI4_1", "Frozen", 0),
            (c.B_debuf4.disabled = !1),
            myInnerHtml("BI9_1", "Stone", 0),
            (c.B_debuf9.disabled = !1))
          : (myInnerHtml("BI2_1", "Poison", 0),
            (c.B_debuf2.disabled = !1),
            myInnerHtml("BI3_1", "Blind", 0),
            (c.B_debuf3.disabled = !1),
            myInnerHtml("BI10_1", "Curse", 0),
            (c.B_debuf10.disabled = !1),
            myInnerHtml("BI7_1", "Stun", 0),
            (c.B_debuf7.disabled = !1),
            myInnerHtml("BI8_1", "Sleep", 0),
            (c.B_debuf8.disabled = !1),
            myInnerHtml("BI18_1", "<S>Mind Breaker</S>", 0),
            (c.B_debuf18.disabled = !0),
            (c.B_debuf18.value = 0),
            (n_B_debuf[18] = 0),
            myInnerHtml("BI0_1", "<S>Provoke</S>", 0),
            (c.B_debuf0.disabled = !0),
            (c.B_debuf0.value = 0),
            (n_B_debuf[0] = 0),
            myInnerHtml("BI4_1", "<S>Frozen</S>", 0),
            (c.B_debuf4.disabled = !0),
            (c.B_debuf4.value = 0),
            (n_B_debuf[4] = 0),
            myInnerHtml("BI9_1", "<S>Stone</S>", 0),
            (c.B_debuf9.disabled = !0),
            (c.B_debuf9.value = 0),
            (n_B_debuf[9] = 0)),
        targetData[2] == 6 ||
        (targetData[3] >= 90 && (c.B_debuf23.value == 0 || n_B_debuf[23] == 0 || n_B_buf[6] >= 90))
          ? (myInnerHtml("BI5_1", "Blessing", 0),
            (c.B_debuf5.disabled = !1),
            myInnerHtml("BI12_1", "Signum Crucis", 0),
            (c.B_debuf12.disabled = !1))
          : (myInnerHtml("BI5_1", "<S>Blessing</S>", 0),
            (c.B_debuf5.disabled = !0),
            (c.B_debuf5.value = 0),
            (n_B_debuf[5] = 0),
            myInnerHtml("BI12_1", "<S>Signum Crucis</S>", 0),
            (c.B_debuf12.disabled = !0),
            (c.B_debuf12.value = 0),
            (n_B_debuf[12] = 0)),
        i = 0;
      i <= 10;
      i++
    )
      ((c.B_debuf0.options[i] = new documento.Opzione(i, i)),
        (c.B_debuf11.options[i] = new documento.Opzione(i, i)),
        (c.B_debuf12.options[i] = new documento.Opzione(i, i)));
    for (i = 0; i <= 5; i++)
      ((c.B_debuf1.options[i] = new documento.Opzione(i, i)),
        (c.B_debuf18.options[i] = new documento.Opzione(i, i)),
        (c.B_debuf24.options[i] = new documento.Opzione(i, i)));
    ((c.B_debuf0.value = n_B_debuf[0]),
      (c.B_debuf1.value = n_B_debuf[1]),
      (c.B_debuf2.checked = n_B_debuf[2]),
      (c.B_debuf3.checked = n_B_debuf[3]),
      (c.B_debuf4.checked = n_B_debuf[4]),
      (c.B_debuf5.checked = n_B_debuf[5]),
      (c.B_debuf6.checked = n_B_debuf[6]),
      (c.B_debuf7.checked = n_B_debuf[7]),
      (c.B_debuf8.checked = n_B_debuf[8]),
      (c.B_debuf9.checked = n_B_debuf[9]),
      (c.B_debuf10.checked = n_B_debuf[10]),
      (c.B_debuf11.value = n_B_debuf[11]),
      (c.B_debuf12.value = n_B_debuf[12]),
      (c.B_debuf17.checked = n_B_debuf[17]),
      (c.B_debuf18.value = n_B_debuf[18]),
      (c.B_debuf19.checked = n_B_debuf[19]),
      (c.B_debuf20.checked = n_B_debuf[20]),
      PvP == 0 &&
        ((c.B_debuf13.checked = n_B_debuf[13]),
        (c.B_debuf14.checked = n_B_debuf[14]),
        (c.B_debuf15.checked = n_B_debuf[15]),
        (c.B_debuf16.checked = n_B_debuf[16]),
        (c.B_debuf21.checked = n_B_debuf[21]),
        (c.B_debuf22.checked = n_B_debuf[22]),
        (c.B_debuf23.value = n_B_debuf[23])),
      (c.B_debuf24.value = n_B_debuf[24]));
  } else {
    var n;
    ((n =
      '<TR><TD id="AITD" class="subheader point" onClick="debufSW(1)" role="button" tabindex="0" aria-expanded="false">Debuffs on Enemy <span id="AIused"></span>'),
      myInnerHtml(
        "EnemyDebuf",
        (n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  AI(0);
}
function AI(e) {
  e == 1 && calc();
  for (var _ = 0, n = 0; n <= 24; n++)
    if (n_B_debuf[n] != 0) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("AITD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("AIused", _ == 0 ? "" : " [active]", 0));
}
function EnemyBufSW(e) {
  if (((n_BbufSW = e), n_BbufSW)) {
    for (
      n =
        '<TR><TD id="AKTD" colspan="4" class="subheader point" onClick="EnemyBufSW(0)" role="button" tabindex="0" aria-expanded="true">Buffs on Enemy <span id="AKused"></span>',
        n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>',
        n +=
          '<TR><TD class="center">Increase AGI</TD><TD id="ID_Kb0" class="data"></TD><TD class="center">Assumptio</TD><TD id="ID_Kb1"></TD></TR>',
        n +=
          '<TR><TD class="center">Angelus</TD><TD id="ID_Kb10" class="data"></TD><TD class="center">Maximize Power</TD><TD id="ID_Kb3"></TD></TR>',
        n +=
          '<TR><TD class="center">' +
          skillName(157) +
          '</TD><TD id="ID_Kb11" class="data"></TD><TD class="center">Adrenaline Rush</TD><TD id="ID_Kb2"></TD></TR>',
        n +=
          '<TR><TD class="center">Shield Reflect</TD><TD id="ID_Kb12" class="data"></TD><TD class="center">' +
          skillName(165) +
          '</TD><TD id="ID_Kb13"></TD></TR>',
        n +=
          '<TR><TD class="center dotB">Energy Coat</TD><TD id="ID_Kb14" class="dotB" colspan="3"></TD></TR>',
        n += '<TR><TD class="center" colspan="4"><b>Monster Exclusive buffs</b></TD></TR>',
        n +=
          '<TR><TD class="center">Attrib. Change</TD><TD id="ID_Kb6" class="data"></TD><TD class="center">Stone Skin</TD><TD id="ID_Kb7"></TD></TR>',
        n +=
          '<TR><TD class="center">Keeping</TD><TD id="ID_Kb9" class="data"></TD><TD class="center">Anti-Magic</TD><TD id="ID_Kb8"></TD></TR>',
        n +=
          '<TR><TD class="center">Agi Up (Flee Up)</TD><TD id="ID_Kb5" class="data"></TD><TD class="center"></TD><TD id="ID_Kb15"></TD></TR>',
        myInnerHtml(
          "EnemyBuf",
          (n +=
            '<TR><TD class="center" colspan="2">POWER UP (ATK x3, HIT x2)</TD><TD id="ID_Kb4" colspan="2"></TD></TR>'),
          0,
        ),
        myInnerHtml("ID_Kb0", '<select name="B_buf0" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb1", '<input type="checkbox" name="B_buf1" onClick="AK(1)">', 0),
        myInnerHtml("ID_Kb2", '<input type="checkbox" name="B_buf2" onClick="AK(1)">', 0),
        myInnerHtml("ID_Kb3", '<input type="checkbox" name="B_buf3" onClick="AK(1)">', 0),
        myInnerHtml("ID_Kb10", '<select name="B_buff10" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb11", '<select name="B_buff11" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb12", '<select name="B_buff12" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb13", '<select name="B_buff13" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb14", '<select name="B_buff14" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb4", '<input type="checkbox" name="B_buf4" onClick="AK(1)">', 0),
        myInnerHtml("ID_Kb5", '<select name="B_buf5" onChange="AK(1)"></select>', 0),
        myInnerHtml(
          "ID_Kb6",
          '<select name="B_buf6" onChange="AK(1)||debufSW(n_debufSW)"></select>',
          0,
        ),
        myInnerHtml("ID_Kb7", '<select name="B_buf7" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb8", '<select name="B_buf8" onChange="AK(1)"></select>', 0),
        myInnerHtml("ID_Kb9", '<input type="checkbox" name="B_buf9" onClick="AK(1)">', 0),
        i = 0;
      i <= 10;
      i++
    )
      ((c.B_buf0.options[i] = new documento.Opzione(i, i)),
        (c.B_buff10.options[i] = new documento.Opzione(i, i)),
        (c.B_buff11.options[i] = new documento.Opzione(i, i)),
        (c.B_buff12.options[i] = new documento.Opzione(i, i)));
    for (i = 0; i <= 5; i++)
      ((c.B_buf5.options[i] = new documento.Opzione(i, i)),
        (c.B_buf7.options[i] = new documento.Opzione(i, i)),
        (c.B_buf8.options[i] = new documento.Opzione(i, i)),
        (c.B_buff13.options[i] = new documento.Opzione(i, i)),
        (c.B_buff14.options[i] = new documento.Opzione(v_EnergyCoat[i], i)));
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
    for (i = 0; i <= 40; i++) c.B_buf6.options[i] = new documento.Opzione(_[0][i], _[1][i]);
    ((c.B_buf0.value = n_B_buf[0]),
      (c.B_buf1.checked = n_B_buf[1]),
      (c.B_buf2.checked = n_B_buf[2]),
      (c.B_buf3.checked = n_B_buf[3]),
      (c.B_buf4.checked = n_B_buf[4]),
      (c.B_buf5.value = n_B_buf[5]),
      (c.B_buf6.value = n_B_buf[6]),
      (c.B_buf7.value = n_B_buf[7]),
      (c.B_buf8.value = n_B_buf[8]),
      (c.B_buf9.checked = n_B_buf[9]),
      (c.B_buff10.value = n_B_buf[10]),
      (c.B_buff11.value = n_B_buf[11]),
      (c.B_buff12.value = n_B_buf[12]),
      (c.B_buff13.value = n_B_buf[13]),
      (c.B_buff14.value = n_B_buf[14]));
  } else {
    var n;
    ((n =
      '<TR><TD id="AKTD" class="subheader point" onClick="EnemyBufSW(1)" role="button" tabindex="0" aria-expanded="false">Buffs on Enemy <span id="AKused"></span>'),
      myInnerHtml(
        "EnemyBuf",
        (n += '<span class="disclosure-chevron" aria-hidden="true"></span></TD></TR>'),
        0,
      ));
  }
  AK(0);
}
function AK(e) {
  e == 1 && calc();
  for (var _ = 0, n = 0; n <= 14; n++)
    if (n_B_buf[n] != 0) {
      _ = 1;
      break;
    }
  var a = documento.getElementById("AKTD");
  (a && a.classList.toggle("subheader-active", _ != 0),
    myInnerHtml("AKused", _ == 0 ? "" : " [active]", 0));
}
function refreshFields() {
  (ClickB_Item("SW"),
    debufSW(n_debufSW),
    EnemyBufSW(n_BbufSW),
    BufSW(n_SkillSW),
    Buf3SW(n_Skill3SW),
    Buf4SW(n_Skill4SW),
    Buf6SW(n_Skill6SW),
    Buf7SW(n_Skill7SW),
    Buf9SW(n_Skill9SW),
    Buf10SW(n_Skill10SW));
}
