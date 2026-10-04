# Changelog

## [1.3.0] - 2026-10-04

La versione web e' anche in inglese. L'applicazione desktop non cambia.

- Nelle impostazioni il pulsante `English` porta tutte le scritte in inglese, e `Italiano` le riporta in italiano. La scelta vale per tutto il sito: home, schermata del codice e timer
- Senza una scelta il sito resta in italiano: la lingua del browser non conta
- In inglese le colonne si chiamano `Sound`, `Beeps`, `Name`, `Map`, `Category`, `Time`, `Spawn`, `Max. Spawn` e `Left`
- Il nome dell'applicazione installata sul telefono resta `Timer di respawn` in entrambe le lingue
- La guida Nuovo Mondo resta solo in italiano: in inglese la sua scheda nella home lo dice

## [1.2.2] - 2026-10-04

Sul telefono il colore della barra del browser segue il tema scelto a mano.
L'applicazione desktop non cambia.

- Con `Cambia tema chiaro/scuro` la barra del browser prende il colore del tema scelto; prima restava su quello del sistema. Vale per tutto il sito

## [1.2.1] - 2026-10-04

L'intestazione della versione web si allinea alla tabella, come nella guida.
L'applicazione desktop non cambia.

- Su uno schermo largo il pulsante Home e i pulsanti di destra stanno sopra i bordi della tabella, invece di finire ai due estremi della finestra
- Accanto a Home c'e' il nome della pagina, `Timer di respawn`, come nella guida; sul telefono non c'e' posto e resta nascosto
- Nella home le due schede si chiamano `Timer di respawn` e `Timer di respawn per Windows`, ognuna con la sua versione: quella da scaricare e' la 1.0.0, piu' vecchia della versione web
- Nelle impostazioni il collegamento all'applicazione per Windows ha lo stesso nome e la stessa versione

## [1.2.0] - 2026-10-04

Nella versione web ogni timer decide quante volte suona il suo allarme.
L'applicazione desktop non cambia.

- Nuova colonna `Bip`, accanto a `Suono`: un numero da 1 a 99, che dice quante volte suona l'allarme di quel timer, una ogni 15 secondi finche' la riga non viene toccata. Il campo vuoto vale 1
- L'allarme non si ripete piu' da solo sei volte: i timer gia' salvati suonano una volta, finche' non si scrive un numero piu' alto
- Il numero di bip viaggia nel file dati (campo `beeps`). L'applicazione desktop lo conserva ma non lo usa: li' le ripetizioni restano quelle di `Repeat alert`
- La tabella a colonne compare da 880 px di larghezza, non piu' da 760: sotto, le righe uscivano dallo schermo a destra
- Fra 880 e 970 px il pulsante `Aggiungi` non finisce piu' fuori dallo schermo
- La pagina chiede ai motori di ricerca di non essere indicizzata, come il resto del sito

## [1.1.4] - 2026-10-03

Il repository cambia nome, da `ragnarok` a `ro`, e con lui l'indirizzo del sito.

- Nuovo indirizzo della versione web: `albgri.github.io/ro/timers/`. Quello della 1.1.1 non funziona piu'; i timer salvati nel browser restano validi
- Il collegamento per scaricare l'applicazione per Windows punta al repository con il nome nuovo

## [1.1.3] - 2026-10-03

La versione web diventa omogenea con la guida, nella lingua e nell'aspetto.
L'applicazione desktop resta in inglese.

- Interfaccia web in italiano, come il resto del sito: scritte, messaggi, istruzioni di installazione, nomi delle citta' dei fusi orari. I termini del gioco, come `Spawn` e `MvP`, restano in inglese
- Con il mouse i pulsanti hanno la misura di quelli della guida; restano piu' alti sui dispositivi a tocco
- Il pulsante del tema ha la stessa scritta in tutto il sito, `Cambia tema chiaro/scuro`
- Nella colonna `Suono` una casella di spunta vera, come quelle della guida, al posto dei caratteri ☑ e ☐: prende il colore della riga
- Icona nuova, la stessa per tutto il sito, al posto dell'orologio con i colori di prima
- Nelle impostazioni, collegamento per scaricare l'applicazione per Windows
- Il pulsante Home e' una scritta, come nella guida, al posto dell'icona
- Messaggio a comparsa con i colori invertiti, come quello della guida
- Nelle impostazioni il testo di aiuto non e' piu' attaccato all'ultimo pulsante, e la casella di spunta ha il colore del sito
- A larghezza desktop il pulsante Add non copre piu' l'ultima riga della lista
- Sotto i 350 px di larghezza l'orologio scende su una seconda riga dell'intestazione

## [1.1.2] - 2026-10-03

La versione web prende lo stile del resto del sito. L'applicazione desktop non cambia.

- Colori e caratteri della guida Nuovo Mondo, in tema chiaro o scuro secondo il sistema: prima c'era solo il tema scuro
- Le righe con la finestra aperta o scaduta hanno anche il fondo colorato, ambra o rosso, oltre al testo
- Nel tema chiaro il colore di categoria della riga e' scurito per restare leggibile
- Il tema si puo' scegliere a mano con `Light / dark theme` nelle impostazioni: la scelta vale per tutto il sito
- Pulsante Home nell'intestazione, per tornare alla scelta del servizio
- Corretto il riquadro del messaggio a comparsa, che restava a schermo anche dopo la scadenza
- Sui telefoni stretti le righe non escono piu' dallo schermo: se lo spazio non basta si accorcia il nome della mappa

## [1.1.1] - 2026-10-03

I timer entrano nel sito unificato `albgri.github.io/ragnarok/`, accanto alle
guide. Le funzioni restano le stesse.

- Nuovo indirizzo della versione web: `albgri.github.io/ragnarok/timers/`. I timer salvati nel browser al vecchio indirizzo restano validi
- Il codice di accesso e' uno solo per tutto il sito: chi lo ha gia' inserito non deve ripeterlo
- Il service worker cancella solo le cache dei timer e non quelle di altri servizi dello stesso sito
- La pagina di presentazione non c'e' piu': ne prende il posto la home del sito
- Licenza: da MIT a GPL-3.0

## [1.1.0] - 2026-09-10

Versione web installabile, servita da GitHub Pages, accanto all'applicazione
desktop che resta invariata.

### Versione web

- Applicazione in HTML, CSS e JavaScript senza framework: si apre nel browser e si installa sulla schermata iniziale
- Layout unico: schede sul telefono, colonne della tabella oltre i 760px
- Stesso formato dati dell'applicazione desktop, con `Export data` e `Import data` per spostare i timer
- Timer conservati nel browser, senza account e senza invio di dati
- Allarmi con suono, notifica di sistema e titolo della scheda lampeggiante
- Funziona offline e continua a mostrare i timer senza rete
- Pulsante di installazione che riconosce il sistema e spiega come procedere dove il browser non offre l'installazione automatica
- Codice di accesso facoltativo, di cui nel sorgente resta la sola impronta SHA-256
- Pagina di presentazione con collegamento all'ultima release, ricavato dall'API di GitHub

### Fuso orario

- Orologio nell'intestazione con il fuso in uso, per accorgersi subito se non corrisponde al proprio
- Fuso selezionabile fra le citta' proposte: alcuni browser e VPN dichiarano UTC, e un orario digitato finirebbe spostato di ore senza altri segnali
- La scelta resta sul dispositivo e non viaggia con i dati esportati

### Note tecniche

- `docs/app/core.js` e' il gemello di `timers_core.py`, con i propri test eseguibili da `node --test`
- Nessuna dipendenza aggiunta: Node serve solo per i test e per impostare il codice di accesso

## [1.0.0] - 2026-09-06

Prima versione pubblica, nata da uno script personale riorganizzato in progetto.

### Funzionalita'

- Interfaccia in inglese; commenti, docstring e documentazione restano in italiano
- Finestre di respawn con durata minima e massima, mostrate come orari nelle colonne Spawn e Max. Spawn
- Stato comunicato dal colore della riga e dal contatore Left: colore della categoria in attesa, giallo dentro la finestra, rosso quando e' passata
- Timer a durata fissa lasciando vuoto il campo Max
- Colonna Sound con casella attiva di default: un clic disattiva l'allarme del singolo timer
- MvP come categoria predefinita, con migrazione automatica delle categorie precedenti
- Ordinamento automatico: prima le finestre aperte, poi quelle in attesa, infine quelle chiuse
- Allarme sonoro ripetuto con lampeggio della barra delle applicazioni; selezionare la riga ferma la ripetizione
- Preset appresi dai timer creati: riscrivendo un nome gia' usato si compilano mappa, categoria e durate
- Storico con completamento automatico su nome, mappa e categoria
- Modifica inline con doppio clic su nome, mappa, categoria, orario e durate
- Archiviazione solo su richiesta con Clear expired: nessun timer sparisce dalla lista da solo
- Left smette di contare oltre le 24 ore dalla scadenza e mostra un trattino
- Annullamento delle rimozioni e delle archiviazioni con Ctrl+Z
- Scorciatoie da tastiera: Invio, Canc, Ctrl+D, Ctrl+R, Ctrl+Z
- Volume, opzione "sempre in primo piano" e dimensioni della finestra ricordate fra le sessioni

### Affidabilita'

- Salvataggio atomico con copia di sicurezza e recupero automatico se il file dati risulta illeggibile
- Il countdown viene sempre riprogrammato, anche in caso di errore: non puo' fermarsi in silenzio
- Un orario che risulterebbe oltre 12 ore nel futuro viene interpretato come "ieri", per le uccisioni a cavallo della mezzanotte
- Date con offset esplicito: i countdown restano corretti attraverso il cambio dell'ora legale
- Nessun allarme arretrato all'avvio per le finestre aperte mentre l'applicazione era chiusa
- La posizione salvata viene ignorata se cade fuori dal desktop disponibile, per non riaprire la finestra invisibile dopo aver scollegato un monitor
- Input non validi segnalati nella barra di stato invece di essere ignorati
- Lettura del formato dati precedente, con migrazione automatica

### Note tecniche

- Nessuna dipendenza di runtime oltre alla libreria standard
- Logica separata dall'interfaccia in `timers_core.py`, coperta da test pytest
- Eseguibile Windows autonomo, senza Python installato sulla macchina
