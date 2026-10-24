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

/**
 * L'High Priest che regge la Horror Toy Factory da tank: una classe, perche' dipende dal
 * personaggio, non dal giocatore (Alberto, 23/10/2026: "alcuni HP non possono essere main tank"
 * anche se chi li gioca tanka con un altro). Nei dati `HP_TANKER`, scritto `TANKER`.
 */
export const HP_TANKER = "HP Tanker";
export const TANKER = tr("HP Tanker", "Tanker HP");
/** Lo Sniper che regge la run senza Professor (Alberto, 23/10/2026): stesso nome nelle due lingue. */
export const SNIPER_INCUBUS = "Sniper Incubus";

/** Come si mostra una classe: Altro e' "Other" in inglese, le altre sono nomi del gioco. */
export const nomeClasse = (classe) => (classe === ALTRO ? tr("Altro", "Other") : classe === HP_TANKER ? TANKER : classe);

// I posti di Clown e Bard, di Gypsy e Dancer: classi diverse, stesso posto.
const CLOWN = tr("Clown o Bard", "Clown or Bard");
const GYPSY = tr("Gypsy o Dancer", "Gypsy or Dancer");

export const ISTANZE = [
  {
    id: "htf",
    nome: "Horror Toy Factory",
    maxParty: 12,
    // Un id macchina entra al massimo 3 volte, un account alla volta.
    maxRun: 3,
    // `quanti`: posti obbligatori per run. `desiderati`: posti non obbligatori ma i primi fra i
    // liberi, fino a tanti per run: la Gypsy o Dancer non serve, ma se c'e' e' "la prima nella
    // lista delle priorita'" (Alberto, 19/10/2026). `alternativa`: il ruolo che copre un posto
    // desiderato se manca il suo: il Soul Linker fa il link al Clown, che cosi' usa la canzone
    // degli SP; con una Gypsy nella run non serve.
    posti: [
      { ruolo: "bard", nome: CLOWN, quanti: 1 },
      { ruolo: "dancer", nome: GYPSY, quanti: 0, desiderati: 1, alternativa: { ruolo: "sl", nome: "Soul Linker" } },
    ],
    // I tipi di run (Alberto, 23/10/2026), con i loro posti in piu' ai `posti`, in ordine di
    // preferenza: a parita' di run ed entrate prima meno run dell'ultimo tipo, poi del penultimo.
    // - HP Tanker: due High Priest "scarsi" non la completano, ne basta uno che ci riesce. Dal
    //   24/10/2026 e' la preferita (Alberto: "se si puo' evitare il champ come tanker lo preferirei");
    //   fino alla 1.24 lo era il Champion
    // - Champion: un Champion con Steel Body tanka, chiunque lo giochi; non puo' usare Safety Wall,
    //   quindi servono un High Priest di supporto e un secondo High Priest o un Priest (`ruoli`). Solo
    //   se l'HP Tanker costa run o entrate; prima dello Sniper Incubus
    // - Sniper Incubus: la run da 4 senza Professor, con lo Sniper Incubus e l'HP Tanker; in
    //   qualsiasi run, ma solo se una run completa costa run o entrate
    // `forti`: quanti dei posti li gioca un personaggio della classe `forte` del ruolo, anche di un
    // Account Gilda. `tank`: chi occupa il posto tanka (dei `forti`, se ci sono), con l'etichetta
    // Tanker nelle run.
    tipi: [
      {
        nome: TANKER,
        posti: [
          { ruolo: "hp", nome: "High Priest", quanti: 2, forti: 1, tank: true },
          { ruolo: "sniper", nome: "Sniper", quanti: 1 },
          { ruolo: "prof", nome: "Professor", quanti: 1 },
        ],
      },
      {
        nome: "Champion",
        posti: [
          { ruolo: "champion", nome: "Champion", quanti: 1, tank: true },
          { ruolo: "hp", nome: "High Priest", quanti: 1 },
          { ruoli: ["hp", "priest"], nome: tr("High Priest o Priest", "High Priest or Priest"), quanti: 1 },
          { ruolo: "sniper", nome: "Sniper", quanti: 1 },
          { ruolo: "prof", nome: "Professor", quanti: 1 },
        ],
      },
      {
        nome: SNIPER_INCUBUS,
        posti: [
          { ruolo: "hp", nome: "High Priest", quanti: 2, forti: 1, tank: true },
          // Il posto si chiama come la classe che chiede (Alberto, 23/10/2026): in una run completa uno
          // Sniper Incubus occupa il posto Sniper, qui serve proprio lui.
          { ruolo: "sniper", nome: SNIPER_INCUBUS, quanti: 1, forti: 1 },
        ],
      },
    ],
    // Bard e Dancer valgono anche non rinati, nello stesso posto di Clown e Gypsy (Alberto,
    // 18/10/2026); Priest, Hunter e Sage no, servono le skill da rinati. Dalla 1.18 sono classi
    // separate, perche' nelle run si veda quella scritta (Alberto: "non e' che deve uscire
    // Clown/Bard"). `forte`: la classe copre i posti `forti` del suo ruolo.
    classi: [
      { nome: "High Priest", ruolo: "hp" },
      { nome: HP_TANKER, ruolo: "hp", forte: true },
      { nome: "Champion", ruolo: "champion" },
      { nome: "Sniper", ruolo: "sniper" },
      { nome: SNIPER_INCUBUS, ruolo: "sniper", forte: true },
      { nome: "Clown", ruolo: "bard" },
      { nome: "Bard", ruolo: "bard" },
      { nome: "Gypsy", ruolo: "dancer" },
      { nome: "Dancer", ruolo: "dancer" },
      { nome: "Professor", ruolo: "prof" },
      { nome: "Priest", ruolo: "priest" },
      { nome: "Soul Linker", ruolo: "sl" },
    ],
    // A parita' di entrate, nei posti liberi, prima gli Sniper, poi gli High Priest, poi i Priest
    // (Alberto, 18/10/2026): lo Sniper "e' quello che scala meglio", e un Priest e' meglio di un
    // personaggio "totalmente inutile". Si contano tutti gli High Priest, obbligatori compresi:
    // con lo stesso tipo di run gli obbligatori sono gli stessi, e il tipo conta di piu'.
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
      { ruolo: "dancer", nome: GYPSY, quanti: 1 },
      { ruolo: "bard", nome: CLOWN, quanti: 1 },
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
      { nome: HP_TANKER, ruolo: "hp" },
      { nome: "Sniper", ruolo: "sniper" },
      { nome: SNIPER_INCUBUS, ruolo: "sniper" },
      { nome: "Gypsy", ruolo: "dancer" },
      { nome: "Dancer", ruolo: "dancer" },
      { nome: "Clown", ruolo: "bard" },
      { nome: "Bard", ruolo: "bard" },
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

/** Le run al massimo in un'istanza: quante ne fa un giocatore senza limite. */
export const MAX_RUN = Math.max(...ISTANZE.map((i) => i.maxRun));

/** Le classi di tutte le istanze, senza doppioni: quelle che il modulo txt riconosce. */
export const CLASSI = [...new Set(ISTANZE.flatMap((i) => i.classi.map((c) => c.nome)))];

/** Il ruolo di una classe nell'istanza: "altro" se non e' fra le sue. */
export function ruoloDi(istanza, classe) {
  return istanza.classi.find((c) => c.nome === classe)?.ruolo ?? "altro";
}

/** Se una classe copre i posti `forti` del suo ruolo nell'istanza: HP Tanker e Sniper Incubus. */
export const eForte = (istanza, classe) => istanza.classi.some((c) => c.nome === classe && c.forte);

/** La classe che copre i posti `forti` di un ruolo, come si mostra: "HP Tanker" per gli High Priest. */
export const classeForte = (istanza, ruolo) => nomeClasse(istanza.classi.find((c) => c.ruolo === ruolo && c.forte)?.nome ?? ruolo);

/** I ruoli che coprono un posto: il suo, o quelli di `ruoli`. */
export const ruoliDi = (posto) => posto.ruoli ?? [posto.ruolo];

/** Le composizioni possibili di una run, una per tipo (`tipi`), ognuna con i posti comuni. */
export const composizioni = (istanza) => (istanza.tipi ? istanza.tipi.map((t) => [...t.posti, ...istanza.posti]) : [istanza.posti]);

/**
 * Cosa deve avere una run con quei posti: per ogni posto, almeno tanti personaggi dei suoi ruoli
 * quanti ne chiedono lui e i posti con ruoli fra i suoi (un High Priest copre anche "High Priest
 * o Priest"), e i personaggi delle classi forti. Con ruoli annidati o separati basta (teorema di Hall).
 */
export function richieste(posti) {
  const esito = [];
  for (const p of posti) {
    const ruoli = ruoliDi(p);
    const quanti = posti.filter((q) => ruoliDi(q).every((r) => ruoli.includes(r))).reduce((n, q) => n + q.quanti, 0);
    if (quanti > 0 || p.massimo !== undefined) esito.push({ ruoli, quanti, massimo: p.massimo });
    if (p.forti) esito.push({ ruoli, quanti: p.forti, forte: true });
  }
  return esito;
}

/** Se un membro di una run conta per una richiesta. */
export const soddisfa = (membro, richiesta) => richiesta.ruoli.includes(membro.ruolo) && (!richiesta.forte || membro.forte === true);

/** Se i membri di una run hanno tutto quello che chiedono i posti. */
export const copre = (membri, posti) =>
  richieste(posti).every((q) => {
    const ci = membri.filter((m) => soddisfa(m, q)).length;
    return ci >= q.quanti && ci <= (q.massimo ?? Infinity);
  });
