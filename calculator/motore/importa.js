// Importazione delle build di altri calcolatori per uaRO. Il link di una build si carica con
// leggiBuild, che fa passare per traduci() i valori che sono numeri degli elenchi di
// quel calcolatore. Le posizioni nel testo della build sono le nostre: Bish (versione 13) non ha
// Bastion e Dicastes, Thrice (versione 18) salva il Bastion come 6 * copricapo + calzature.
// Cio' che da noi non c'e', o che c'e' ma il motore non accetta (classe, slot, livello
// dell'incantamento), non si carica e importaBuild lo elenca.

// prettier-ignore
var CALCOLATORI_ESTERNI = [
  { nome: "rocalc (Bish)", indirizzo: "rocalc-temp.web.app", versione: 13, tabelle: ESTERNO_BISH },
  { nome: "uaro-calc (Thrice)", indirizzo: "uaro-calc.xdthrice.workers.dev", versione: 18 },
];

// i tratti [id esterno, quanti, nostro id] di esterni.js come elenco: id esterno -> nostro
function tabellaEsterna(tratti) {
  var t = [];
  tratti.forEach(([da, quanti, nostro]) => {
    for (var k = 0; k < quanti; k++) t[da + k] = nostro + k;
  });
  return t;
}

// Il calcolatore del link (dall'indirizzo, o senza indirizzo dalla versione) e la build;
// null se il link non e' di uno dei calcolatori che sappiamo leggere
function linkEsterno(link) {
  link = String(link).trim();
  var separa = link.search(/[#?]/);
  var indirizzo = separa >= 0 ? link.slice(0, separa) : "";
  var build = separa >= 0 ? link.slice(separa + 1) : link;
  var versione = CIFRE_BUILD.indexOf(build.charAt(0));
  var esterno = CALCOLATORI_ESTERNI.find((e) =>
    indirizzo ? indirizzo.includes(e.indirizzo) : e.versione == versione,
  );
  return esterno && esterno.versione == versione ? { esterno: esterno, build: build } : null;
}

// livello 2 e 3 dei Dicastes come li scrive Thrice: 1-5 AGI +1...+5, 6-10 DEX, 11-15 INT
function nomeDicastes(valore) {
  return ["AGI", "DEX", "INT"][Math.floor((valore - 1) / 5)] + " +" + (((valore - 1) % 5) + 1);
}
// il nome di un valore nei nostri elenchi
var NOMI_NOSTRI = {
  oggetto: (v) => itemData[v] && itemData[v].name,
  carta: (v) => m_Card[v] && m_Card[v][2],
  mostro: (v) => m_Monster[v] && m_Monster[v][1],
  // 3000+ e 1500+: skill date dall'equipaggiamento (m_EnableSkill), 2000+: autocast
  // (m_AutoSpellSkill), come le numera ActiveSkillSetPlus
  skill: (v) => {
    var id =
      v >= 3000
        ? m_EnableSkill[v - 3000]
        : v >= 2000
          ? m_AutoSpellSkill[v - 2000]
          : v >= 1500
            ? m_EnableSkill[v - 1500]
            : [0, 0, v];
    return id && m_Skill[id[2]] && m_Skill[id[2]][2];
  },
  freccia: (v) => m_Arrow[v] && m_Arrow[v][2],
  dicastes: nomeDicastes,
  // campo A_skill<k>: la skill passiva k della classe, al livello v
  passiva: (v, campo) => m_Skill[m_JobBuff[n_A_JOB][campo.slice(7)]][2] + " " + v,
};
function nomeNostro(tipo, valore, campo) {
  return (NOMI_NOSTRI[tipo] && NOMI_NOSTRI[tipo](valore, campo)) || "#" + valore;
}

// Carica nel motore la build di un altro calcolatore. Restituisce null se il link non e' di un
// calcolatore che sappiamo leggere, altrimenti { calcolatore, build, nonCaricati }: build e' nel
// nostro formato, nonCaricati e' l'elenco di { tipo, campo, nome, motivo } ("assente": da noi
// non c'e'; "non valido": c'e' ma il motore non l'ha accettato)
function importaBuild(link) {
  var trovato = linkEsterno(link);
  if (!trovato) return null;
  var esterno = trovato.esterno;
  var dati = esterno.tabelle;
  if (dati && !dati.tabelle)
    dati.tabelle = {
      oggetto: [tabellaEsterna(dati.oggetti), dati.senzaOggetti],
      carta: [tabellaEsterna(dati.carte), dati.senzaCarte],
      mostro: [tabellaEsterna(dati.mostri), dati.senzaMostri],
    };
  // una classe che da noi non c'e' fermerebbe il motore a meta' caricamento
  var testo = trovato.build
    .replace(/%(24|26|27|2B|2C|3A|3B|3D)/g, decodeURIComponent)
    .replace(/[0-9]/g, (d) => "i".repeat(d <= 3 ? +d + 10 : +d));
  var classe = 62 * CIFRE_BUILD.indexOf(testo.charAt(1)) + CIFRE_BUILD.indexOf(testo.charAt(2));
  if (!m_JobBuff[classe]) return null;

  var nonCaricati = [],
    richiesti = [],
    armaAssente = false;
  var scarta = (tipo, campo, nome, motivo) =>
    nonCaricati.push({ tipo: tipo, campo: campo, nome: nome, motivo: motivo });
  var traduci = function (tipo, valore, campo) {
    valore = Number(valore);
    if (tipo == "tipoArma") return armaAssente ? 0 : valore;
    if (tipo == "bastion")
      return esterno.versione == 18 ? 8 * Math.floor(valore / 6) + (valore % 6) : 0;
    var tabella = dati && dati.tabelle[tipo];
    if (tabella) {
      var nostro = tabella[0][valore];
      if (nostro === undefined) {
        scarta(tipo, campo, tabella[1][valore] || "#" + valore, "assente");
        if (campo == "A_weapon1") armaAssente = true;
        return 0;
      }
      valore = nostro;
    }
    if (campo) richiesti.push([tipo, campo, valore]);
    return valore;
  };
  if (!leggiBuild(trovato.build, { versione: esterno.versione, traduci: traduci })) return null;
  richiesti.forEach(([tipo, campo, valore]) => {
    if (c[campo] && String(c[campo].value) !== String(valore))
      scarta(tipo, campo, nomeNostro(tipo, valore, campo), "non valido");
  });
  // manuale dell'EXP: il +25% (valore 1) da noi non c'e' (vedi n_A_Buf8[1] in scelte.js)
  if (n_A_Buf8[1] == 1) {
    n_A_Buf8[1] = 0;
    scarta("manuale", "A8_Skill1", "EXP +25%", "assente");
  }
  return { calcolatore: esterno.nome, build: scriviBuild(), nonCaricati: nonCaricati };
}
