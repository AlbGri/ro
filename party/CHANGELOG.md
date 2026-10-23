# Changelog - party

Le versioni della pagina `party/`.

## [1.14] - 2026-10-23

- Nelle run, accanto alla classe di chi tanka (il Champion o l'HP Tanker), l'etichetta `Tanker`,
  come quella degli Account Gilda; nel txt delle run `, Tanker`

## [1.13] - 2026-10-23

- Horror Toy Factory: in ogni run qualcuno tanka. Puo' essere un HP Tanker, nuova colonna per i
  giocatori che la reggono da High Priest: dei due High Priest della run almeno uno e' di un
  giocatore con la spunta, con uno qualsiasi dei suoi account (l'equipaggiamento si passa); un
  Account Gilda non conta come HP Tanker. Oppure un Champion con Steel Body, chiunque lo giochi,
  con un High Priest di supporto e un secondo High Priest o un Priest, perche' il Champion non
  puo' usare Safety Wall. A parita' di run ed entrate si preferisce il Champion. Ogni run dice
  chi tanka, e `Per la run N` spiega cosa manca per l'uno e per l'altro. Nell'elenco della gilda:
  `Nome (HP Tanker)`; in inglese Tanker HP
- Nuova colonna `Run`: quante run puo' fare al massimo un giocatore, 3 se non si cambia. Chi ne
  fa meno per scelta non e' fra quelli che "non giocano tutte le run". Nell'elenco della gilda:
  `Nome (2 run)`, anche insieme alla spunta: `Nome (HP Tanker, 2 run)`
- Soul Linker riconosciuto (anche `SL`): con il link il Clown usa la canzone degli SP, quindi in
  una run senza Gypsy/Dancer prende il suo posto fra i liberi
- Nell'elenco della gilda e nelle caselle `Snip` vale come Sniper, e le classi separate solo da
  spazi si leggono una per una: `Snip Prof Bragi` sono Sniper, Professor e Clown/Bard

## [1.12] - 2026-10-23

- I jolly si chiamano Account Gilda, come Guild Account nella versione inglese. Nell'elenco della
  gilda la riga e' `Account Gilda nome: classi`; `Jolly nome: classi` vale ancora, quindi gli
  elenchi esportati prima si rileggono. Dati salvati e backup restano validi

## [1.11] - 2026-10-23

- Menu ⚙: "Ricomincia da zero", come nel calcolatore e nei livelli, toglie tutti i giocatori e i
  jolly (chiede conferma). Istanza e soprannomi imparati restano: l'elenco esportato non li ha

## [1.10] - 2026-10-23

- `Per la run N` dice quanti personaggi servono e quali account potrebbero coprirli, con il
  numero della loro casella: per esempio "Per 3 run servono 6 High Priest e 3 Professor, 9
  personaggi su account diversi. Gli account che hanno almeno uno dei due sono 8: Alberto (1,
  2), ... Ogni account entra con un solo personaggio."
- Se un giocatore ha piu' account di quante sono le run, la riga ricorda che ne contano al piu'
  uno per run

## [1.9] - 2026-10-23

- Quando le run sono meno di tre, `Per la run N` dice cosa manca anche se ogni posto basta da
  solo ma non insieme agli altri, perche' gli stessi account servono per piu' posti: per esempio
  "High Priest e Professor insieme: per 3 run ne servono 9, ci sono 8 account che li coprono"

## [1.8] - 2026-10-23

- Il pulsante della lingua esce dal menu ⚙ e sta in alto, subito prima dell'ingranaggio, con la
  bandiera della lingua in cui si passa (`EN` in italiano, `IT` in inglese; sul telefono solo
  la bandiera)
- `Pally` vale come Paladin, come `Pala` e `Devo`

## [1.7] - 2026-10-23

- La pagina e' anche in inglese: con `English` nel menu ⚙ si passa all'inglese, e la scelta vale
  per tutto il sito. I jolly in inglese si chiamano Guild Account, l'id macchina Hardware ID
- L'elenco della gilda e le caselle degli account capiscono le parole delle due lingue,
  qualunque sia quella della pagina: `Jolly` o `Guild Account`, `e` o `and`, `Altro` o `Other`.
  L'elenco esportato usa le parole della lingua della pagina
- Sul telefono l'etichetta del jolly accanto alla classe va a capo invece di allargare la
  pagina, e il menu Istanza si restringe

## [1.6] - 2026-10-22

- Giocatori e jolly in una tabella compatta, una riga a testa: in ogni casella le classi di un account come le scrivete su Discord, per esempio HP/Devo/Clown/Sniper. Uscendo dalla casella la pagina le riscrive come le ha capite; le parole che non conosce restano in rosso
- Sotto la tabella le parole da riconoscere, con il nome di chi le ha scritte: scelta la classe, la pagina se la ricorda e corregge tutte le caselle
- L'elenco incollato riempie la tabella, e i pulsanti di export non dicono più "(txt)"

## [1.5] - 2026-10-22

- Nuova istanza, l'Endless Cellar: party minimo di 10 (Champion, 2 High Priest, 2 Sniper, Gypsy/Dancer, Clown/Bard, Professor, Paladin, Creator) e fino a 2 posti in più solo per Sniper o High Wizard, al massimo un High Wizard per run
- Incolla l'elenco della gilda: account e classi come li scrivono i giocatori su Discord, anche il messaggio copiato con l'ora (un nome, poi "1) HP/Devo/Clown/Sniper", "2) Prete"...). La pagina conosce i soprannomi più usati, corregge gli errori di battitura, chiede la classe delle parole che non conosce e se la ricorda. Prima di aggiungere mostra cosa ha capito; chi è già nella pagina viene aggiornato
- L'elenco di tutti i giocatori e jolly si esporta in un file di testo nello stesso formato, e le run calcolate in un file di testo da girare alla gilda
- Il calcolo è molto più veloce con tanti giocatori, e a parità di tutto il resto usa davvero meno jolly possibile: prima in qualche caso ne usava uno di troppo
- Se un giocatore non gioca tutte le run perché i suoi altri personaggi non hanno posto, la pagina lo dice
- Tolto il nome dei personaggi: basta la classe. Nelle run la terza colonna è la classe

## [1.4] - 2026-10-21

- I testi occupano tutta la larghezza della pagina e vanno a capo solo dove finisce lo spazio, invece che a metà pagina

## [1.3] - 2026-10-19

- Il party minimo è fisso, di 5: 2 High Priest, 1 Sniper, 1 Clown/Bard, 1 Professor. Tolti i campi per cambiarlo
- La Gypsy/Dancer non è più obbligatoria: se c'è, una per run entra per prima fra i posti liberi, prima degli Sniper

## [1.2] - 2026-10-18

- Sotto l'istanza, un campo per ogni posto obbligatorio: per esempio 0 Gypsy/Dancer se il Professor passa gli SP, o 3 High Priest. Composizione standard la rimette com'era
- Un posto tolto dalla composizione standard resta il primo fra i liberi: senza Gypsy/Dancer obbligatoria, una Gypsy/Dancer per run entra prima del secondo Sniper
- La composizione scelta resta salvata ed entra nel backup

## [1.1] - 2026-10-18

- Nei posti liberi, a parità di entrate, prima gli Sniper, poi gli High Priest, poi i Priest, poi tutti gli altri. Priest è una classe nuova nell'elenco
- Il menu in alto a destra si apre con l'ingranaggio, come in tutte le pagine del sito

## [1.0] - 2026-10-18

Prima versione.

- Scegli l'istanza e la pagina trova le run migliori. Per ora c'è la Horror Toy Factory: fino a tre run, con 2 High Priest, 1 Sniper, 1 Clown/Bard, 1 Gypsy/Dancer e 1 Professor, e al massimo 12 persone
- Nella classe di un personaggio ci sono solo quelle che contano per l'istanza, e Altro per tutte le altre
- Giocatori con i loro account, e in ogni account uno o più personaggi: l'account entra una volta sola, con il personaggio che serve
- Jolly della gilda, giocati da chi ne ha bisogno per completare le run o per giocarle tutte e tre
- Le run migliori: prima il numero di run, poi far entrare tutti il più possibile, poi più Sniper, poi run equilibrate
- Chi non gioca tutte le run e perché, e cosa manca per la run successiva
- Presenti e jolly disponibili si spuntano; i dati restano nel browser, e dal menu Altro si fa un backup in un file e lo si ripristina
