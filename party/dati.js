/**
 * Le istanze che la pagina sa comporre.
 *
 * Ogni istanza ha i suoi posti obbligatori e le classi che contano, ognuna con
 * il ruolo che copre; tutto il resto e' "Altro" e va solo nei posti liberi.
 * Nell'elenco delle classi di un personaggio ci sono solo queste piu' "Altro"
 * (Alberto, 18/10/2026: l'elenco completo era "inutilmente lungo").
 */

export const ALTRO = "Altro";

export const ISTANZE = [
  {
    id: "htf",
    nome: "Horror Toy Factory",
    maxParty: 12,
    // Un id macchina entra al massimo 3 volte, un account alla volta.
    maxRun: 3,
    posti: [
      { ruolo: "hp", nome: "High Priest", quanti: 2 },
      { ruolo: "sniper", nome: "Sniper", quanti: 1 },
      { ruolo: "bard", nome: "Clown/Bard", quanti: 1 },
      { ruolo: "dancer", nome: "Gypsy/Dancer", quanti: 1 },
      { ruolo: "prof", nome: "Professor", quanti: 1 },
    ],
    // Bard e Dancer valgono anche non rinati, quindi una voce sola con Clown e Gypsy (Alberto,
    // 18/10/2026); Priest, Hunter e Sage no, servono le skill da rinati.
    classi: [
      { nome: "High Priest", ruolo: "hp" },
      { nome: "Sniper", ruolo: "sniper" },
      { nome: "Clown/Bard", ruolo: "bard" },
      { nome: "Gypsy/Dancer", ruolo: "dancer" },
      { nome: "Professor", ruolo: "prof" },
    ],
    // A parita' di entrate si preferisce questo ruolo anche nei posti liberi: gli Sniper scalano meglio.
    preferito: "sniper",
    nomePreferito: "Sniper",
    perchePreferito: "scalano meglio",
  },
];

/** Il ruolo di una classe nell'istanza: "altro" se non e' fra le sue. */
export function ruoloDi(istanza, classe) {
  return istanza.classi.find((c) => c.nome === classe)?.ruolo ?? "altro";
}
