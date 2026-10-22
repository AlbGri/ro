/**
 * Le istanze che la pagina sa comporre.
 *
 * Ogni istanza ha i suoi posti e le classi che contano, ognuna con
 * il ruolo che copre; tutto il resto e' "Altro" e va solo nei posti liberi,
 * se l'istanza li lascia a qualsiasi classe.
 * Nell'elenco delle classi di un personaggio ci sono solo queste piu' "Altro"
 * (Alberto, 18/10/2026: l'elenco completo era "inutilmente lungo").
 */

export const ALTRO = "Altro";

/**
 * Le scritte nelle due lingue: `tr(italiano, inglese)` di gate.js. Nei test, senza gate.js,
 * l'italiano.
 */
export const tr = globalThis.tr ?? ((it) => it);

/** Come si mostra una classe: Altro e' "Other" in inglese, le altre sono nomi del gioco. */
export const nomeClasse = (classe) => (classe === ALTRO ? tr("Altro", "Other") : classe);

export const ISTANZE = [
  {
    id: "htf",
    nome: "Horror Toy Factory",
    maxParty: 12,
    // Un id macchina entra al massimo 3 volte, un account alla volta.
    maxRun: 3,
    // `quanti`: posti obbligatori per run. `desiderati`: posti non obbligatori ma i primi fra i
    // liberi, fino a tanti per run. Il party minimo e' fisso, di 5 (Alberto, 19/10/2026): la
    // Gypsy/Dancer non serve, ma se c'e' e' "la prima nella lista delle priorita'".
    posti: [
      { ruolo: "hp", nome: "High Priest", quanti: 2 },
      { ruolo: "sniper", nome: "Sniper", quanti: 1 },
      { ruolo: "bard", nome: "Clown/Bard", quanti: 1 },
      { ruolo: "prof", nome: "Professor", quanti: 1 },
      { ruolo: "dancer", nome: "Gypsy/Dancer", quanti: 0, desiderati: 1 },
    ],
    // Bard e Dancer valgono anche non rinati, quindi una voce sola con Clown e Gypsy (Alberto,
    // 18/10/2026); Priest, Hunter e Sage no, servono le skill da rinati.
    classi: [
      { nome: "High Priest", ruolo: "hp" },
      { nome: "Sniper", ruolo: "sniper" },
      { nome: "Clown/Bard", ruolo: "bard" },
      { nome: "Gypsy/Dancer", ruolo: "dancer" },
      { nome: "Professor", ruolo: "prof" },
      { nome: "Priest", ruolo: "priest" },
    ],
    // A parita' di entrate, nei posti liberi, prima gli Sniper, poi gli High Priest, poi i Priest
    // (Alberto, 18/10/2026): lo Sniper "e' quello che scala meglio", e un Priest e' meglio di un
    // personaggio "totalmente inutile". Contare tutti gli High Priest, obbligatori compresi,
    // ordina come contare i soli liberi: gli obbligatori sono sempre due per run.
    preferiti: [
      { ruolo: "sniper", nome: "Sniper", perche: tr("scalano meglio", "they scale better") },
      { ruolo: "hp", nome: "High Priest" },
      { ruolo: "priest", nome: "Priest", perche: tr("meglio di un personaggio inutile", "better than a useless character") },
    ],
  },
  {
    id: "ec",
    nome: "Endless Cellar",
    maxParty: 12,
    maxRun: 3,
    // Party minimo di 10; i 2 posti in piu' solo per Sniper o High Wizard, al massimo un High
    // Wizard per run (Alberto, 22/10/2026). `massimo`: personaggi di quel ruolo per run al piu'.
    posti: [
      { ruolo: "champion", nome: "Champion", quanti: 1 },
      { ruolo: "hp", nome: "High Priest", quanti: 2 },
      { ruolo: "sniper", nome: "Sniper", quanti: 2 },
      { ruolo: "dancer", nome: "Gypsy/Dancer", quanti: 1 },
      { ruolo: "bard", nome: "Clown/Bard", quanti: 1 },
      { ruolo: "prof", nome: "Professor", quanti: 1 },
      { ruolo: "paladin", nome: "Paladin", quanti: 1 },
      { ruolo: "creator", nome: "Creator", quanti: 1 },
      { ruolo: "hw", nome: "High Wizard", quanti: 0, massimo: 1 },
    ],
    // I ruoli ammessi nei posti liberi; senza `liberi` ci va qualsiasi classe.
    liberi: ["sniper", "hw"],
    // Bard e Dancer valgono anche qui non rinati, le altre classi no (Alberto, 22/10/2026).
    classi: [
      { nome: "Champion", ruolo: "champion" },
      { nome: "High Priest", ruolo: "hp" },
      { nome: "Sniper", ruolo: "sniper" },
      { nome: "Gypsy/Dancer", ruolo: "dancer" },
      { nome: "Clown/Bard", ruolo: "bard" },
      { nome: "Professor", ruolo: "prof" },
      { nome: "Paladin", ruolo: "paladin" },
      { nome: "Creator", ruolo: "creator" },
      { nome: "High Wizard", ruolo: "hw" },
    ],
    // "2 sniper o 1 sniper e 1 high wizard o 1 solo sniper": prima gli Sniper.
    preferiti: [
      { ruolo: "sniper", nome: "Sniper" },
      { ruolo: "hw", nome: "High Wizard" },
    ],
  },
];

/** Le classi di tutte le istanze, senza doppioni: quelle che il modulo txt riconosce. */
export const CLASSI = [...new Set(ISTANZE.flatMap((i) => i.classi.map((c) => c.nome)))];

/** Il ruolo di una classe nell'istanza: "altro" se non e' fra le sue. */
export function ruoloDi(istanza, classe) {
  return istanza.classi.find((c) => c.nome === classe)?.ruolo ?? "altro";
}
