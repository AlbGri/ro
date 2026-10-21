# Changelog - calcolatore

Le versioni della pagina `calcolatore/`.

## [1.3] - 2026-10-21

- Scelta del mostro: oltre al luogo, la mappa (per esempio Bio-life Labs 3F) e la categoria (MvP,
  boss non MvP, normali). Le mappe e i loro mostri vengono dagli spawn di rAthena; i luoghi di
  uaRO (Bio Labs 4, OGH, Byalan 6...) non hanno mappe. I luoghi comprendono ora tutti i mostri
  delle loro mappe

## [1.2] - 2026-10-21

Correzioni di errori ereditati dal calcolatore di Thrice:

- Sropho veniva trattato come un giocatore (PvP): alcune skill davano danni sbagliati (Throw
  Coins a meta', Estin, Estun ed Esma a zero) e mancava l'esperienza per colpo. Ora e' un mostro
  come gli altri, e il calcolo per i giocatori, che non si poteva scegliere, non c'e' piu'
- Cart Revolution con la Heavy Metaling Card: il +50% si applicava piu' volte al danno minimo e
  medio
- Rapid Smiting: Provoke e Aloevera ora aumentano il danno, come per Shield Boomerang
- Due armi: accanto al critico la mano sinistra era quella del calcolo precedente, e il danno
  massimo senza Double Attack non contava la sinistra
- Grand Cross: con questa skill scelta i danni magici subiti usavano una MDEF sbagliata
- Probabilita' di schivare: ora conta la skill del mostro scelta (per esempio la precisione in
  piu' di Magnum Break), che prima arrivava con un calcolo di ritardo o non contava
- Danno riflesso dall'equipaggiamento: il minimo di 1 usava la percentuale di Shield Reflect
- Random Attack del mostro: l'elemento cambiava a caso a ogni ricalcolo; ora e' Neutral, o quello
  scelto a mano

## [1.1] - 2026-10-21

- Build salvate: "Copia link" copia l'indirizzo che apre la build scelta nell'elenco, senza
  doverla prima caricare

## [1.0] - 2026-10-21

- Prima versione: statistiche, danni fatti e subiti di un personaggio di uaRO, con
  equipaggiamento, carte, incantamenti, skill passive, buff, cibo, mostri e debuff
- I calcoli sono quelli del calcolatore di Thrice e Arlix (versione del 12/10/2026): sulle 360
  build di prova la pagina da' gli stessi risultati, salvo le correzioni qui sotto
- Interfaccia in italiano, nello stile del sito, anche sul telefono; gli elenchi lunghi
  (oggetti, carte, mostri, skill) si scelgono con una ricerca
- La build resta nel browser; si possono salvare build con un nome e copiare un link che apre la
  build. Le build hanno un formato di questo calcolatore: i link del calcolatore di Thrice non si
  aprono, e i nostri non si aprono nel suo
- Confronto fra due build: si fissa la build attuale come A e la si confronta con quella che si
  sta modificando, contro lo stesso mostro (statistiche, danni fatti e subiti, con la differenza
  in verde se migliora e in rosso se peggiora)
- Solo uaRO: tolte le varianti degli altri server (iRO classic e renewal, private), che la
  pagina non permetteva di scegliere
- Correzioni per uaRO dalla wiki del server:
  - incantamenti Bastion: tutti e sette, con Movement Speed (+20% alla velocita' di movimento) e
    SP Consumption (si sceglie, ma non cambia i risultati: il costo in SP delle skill non e'
    calcolato); lo stesso incantamento su copricapo e calzature conta una volta sola
  - incantamenti di El Dicastes: ai livelli 2 e 3 AGI, DEX o INT +1 o +2 (+3 al livello 3 di
    Feral Tail e Feral Boots), che si sommano anche sulla stessa statistica
  - tirapugni: penalita' di taglia 100/100/75%
  - Soul Strike: +7% di danno per livello contro i non morti
  - Arrow Vulcan: ritardo di 2 secondi
  - Back Stab: ricarica fissa di 0,333 secondi
  - Adrenaline Rush, anche ricevuto dal party: vale con le spade a una mano
  - Super Novice: +2000 di peso trasportabile
  - Luna Bow: DEF +3 da +6 e +5 da +9
  - Mitra: MATK +10 con INT base 90
  - Anubis Helm: MDEF +5, livello 65
  - Defolty Doll Hat senza STR; Satanic Bone Helm dal livello 1
  - slot di Catapult, Dance Shoes, Golden Wrench, Alca Bringer e Two-Handed Chrome Metal Sword
  - oggetti che mancavano: Love Guard, Santa Poring Hat, Glaris Doll Hat, Umbala Spirit,
    Antique Smoking Pipe, Pecopeco Wing Ears, Old Mitra
