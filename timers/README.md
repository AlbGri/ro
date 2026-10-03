# Ragnarok Timers

Timer per le finestre di respawn di MvP e quest di Ragnarok Online.

Applicazione desktop in tkinter, senza dipendenze esterne: registri l'ora dell'uccisione e la finestra di respawn del mostro, e la riga cambia colore quando la finestra si apre. Un allarme sonoro ripetuto e il lampeggio nella barra delle applicazioni avvisano anche se stai facendo altro.

Esiste anche una [versione web](#versione-web) installabile come applicazione, pensata per il telefono, che tiene i dati nel browser e scambia file con quella desktop.

L'interfaccia dell'applicazione desktop e' in inglese, quella della versione web in italiano come il resto del sito; commenti, docstring e documentazione sono in italiano. Le sezioni che seguono usano i nomi dell'applicazione desktop.

## Finestre di respawn

Ogni timer ha una durata minima e una massima, che diventano due orari: `Spawn` e `Max. Spawn`. Uccidendo un MvP alle 13:12 con respawn dichiarato di 180-190 minuti si inserisce `13:12`, `180` e `190`, e la tabella mostra `Spawn 16:12` e `Max. Spawn 16:22`.

| Fase | Colore riga | `Left` |
|---|---|---|
| Prima di `Spawn` | colore della categoria | quanto manca a `Spawn` |
| Fra `Spawn` e `Max. Spawn` | giallo, puo' gia' essere apparso | quanto manca a `Max. Spawn` |
| Dopo `Max. Spawn` | rosso | da quanto e' passato, poi `-` |

Se lasci vuoto il campo `Max` il timer diventa un countdown classico a durata fissa: la colonna `Max. Spawn` mostra `-` e la riga diventa rossa alla scadenza.

La lista si riordina da sola: prima le finestre aperte in ordine di chiusura, poi quelle ancora in attesa in ordine di apertura, infine quelle passate.

## Colonne

| Colonna | Contenuto |
|---|---|
| `Sound` | casella di spunta, attiva di default. Un clic la inverte: deselezionata, quel timer non emette allarmi |
| `Name`, `Map`, `Category` | dati del timer. La categoria determina il colore della riga |
| `Time` | ora dell'uccisione |
| `Spawn` | `Time` piu' la durata minima |
| `Max. Spawn` | `Time` piu' la durata massima, `-` per i timer a durata fissa |
| `Left` | contatore verso la soglia corrente, negativo quando e' passata, `-` oltre le 24 ore dalla scadenza |

## Setup

```bash
conda create -n ragnarok-timers python=3.12 -y
conda activate ragnarok-timers
cd timers/desktop
python ragnarok_timers.py
```

L'applicazione usa solo la libreria standard: per eseguirla non serve installare nulla. Le dipendenze in `requirements-dev.txt` servono solo per i test e per la build dell'eseguibile.

## Utilizzo

Compila il form e premi `Add` o `Invio`:

- **Name, Map, Category**: campi con storico e completamento automatico. La categoria determina il colore della riga e per impostazione predefinita e' `MvP`.
- **Time**: ora dell'uccisione in formato `HH:MM`. Se lo lasci vuoto parte da adesso. Un orario che risulterebbe oltre 12 ore nel futuro viene letto come "ieri", cosi' un'uccisione delle 23:50 registrata dopo mezzanotte non parte fra un giorno.
- **Min / Max**: durata della finestra in minuti. Accetta `190`, `90,5`, `1h30`, `3:10`. Lasciando `Max` vuoto il timer e' a durata fissa.

Scrivendo un nome gia' usato, mappa, categoria e durate vengono compilate con i valori dell'ultima volta. I preset si imparano dai timer che crei: non c'e' una tabella di respawn precaricata, perche' i tempi variano da server a server.

### Comandi

| Comando | Effetto |
|---|---|
| Clic sulla casella `Sound` | attiva o disattiva l'allarme di quel timer |
| Doppio clic su una cella | modifica nome, mappa, categoria, orario o durate |
| `+1 (duplicate)` / `Ctrl+D` | ricrea il timer selezionato a partire da adesso |
| `Refresh` / `Ctrl+R` | fa ripartire il timer selezionato da adesso |
| `Remove` / `Canc` | elimina i timer selezionati, con conferma |
| `Undo` / `Ctrl+Z` | ripristina l'ultimo gruppo rimosso o archiviato |
| `Clear expired` | archivia i timer con la finestra chiusa da almeno un'ora |

Selezionare una riga vale come "l'ho visto" e ferma la ripetizione dell'allarme senza spegnerlo per le volte successive; togliere la spunta a `Sound` lo disattiva stabilmente per quel timer.

Niente sparisce dalla lista da solo: i timer restano finche' non li togli tu. `Clear expired` sposta nella sezione `archive` del file dati quelli con la finestra chiusa da almeno un'ora, e anche quello si annulla con `Ctrl+Z`.

## Dati e impostazioni

Tutto sta in `ragnarok_timers.json`, accanto allo script o all'eseguibile: timer, storico dei nomi, preset, archivio, volume, posizione della finestra e opzione "sempre in primo piano".

Il salvataggio e' atomico e mantiene una copia `.bak`: se il file principale risulta illeggibile, all'avvio i dati vengono recuperati dal backup. Gli errori finiscono in `ragnarok_timers.log`.

## Versione web

I file in questa cartella sono l'applicazione web, in HTML, CSS e JavaScript,
senza framework ne' passaggi di build: GitHub Pages li serve cosi' come sono
all'indirizzo `albgri.github.io/ro/timers/`. E' una PWA: installabile
sulla schermata iniziale e utilizzabile offline.

I dati stanno in `localStorage`, quindi restano nel browser che li ha scritti:
non c'e' sincronizzazione fra dispositivi e cancellare i dati del sito cancella
i timer. Il formato e' pero' identico a quello dell'applicazione desktop, e i
comandi `Esporta i dati` e `Importa i dati` spostano i timer da una all'altra.

Il layout e' unico: su telefono ogni timer e' una scheda, da 760px in su le
stesse celle diventano le colonne della tabella.

Le scritte sono in italiano. Le colonne si chiamano `Suono`, `Nome`, `Mappa`,
`Categoria`, `Ora`, `Spawn`, `Spawn max` e `Manca`, e corrispondono nell'ordine a
`Sound`, `Name`, `Map`, `Category`, `Time`, `Spawn`, `Max. Spawn` e `Left` del
desktop. I termini del gioco, come `Spawn` e `MvP`, restano in inglese.

Differenze rispetto al desktop, tutte volute:

| Desktop | Web |
|---|---|
| doppio clic su una cella per modificarla | un form unico, dal doppio clic o dal menu `⋮` |
| conferma prima di rimuovere | rimozione immediata con `Annulla` nel messaggio |
| `Ctrl+D`, `Ctrl+R` | `d`, `r`, piu' `n` per un timer nuovo. Nel browser quelle combinazioni sono gia' occupate |
| colore di categoria per ordine di apparizione | colore derivato dal nome, uguale su ogni dispositivo |
| allarme sonoro e lampeggio della barra | suono, notifica di sistema e titolo della scheda lampeggiante |

### Fuso orario

L'intestazione mostra un orologio con il fuso in uso. Non e' un ornamento: la
modalita' anti tracciamento di Firefox, Tor e alcune VPN dichiarano UTC invece
del fuso reale, e in quel caso ogni orario digitato viene collocato con ore di
scarto. Il sintomo non e' evidente, perche' anche la rilettura usa il fuso
sbagliato e le colonne `Ora` e `Spawn` restano coerenti fra loro: se ne accorge
solo il contatore `Manca`.

Toccando l'orologio si sceglie la propria citta'. La scelta e' salvata su quel
dispositivo e non viaggia con i dati esportati, perche' descrive dove ci si
trova e non i timer. Cambiare fuso non sposta i timer gia' creati: quelli
inseriti con il fuso sbagliato vanno corretti a mano.

Il pulsante `Installa` in alto compare solo quando l'applicazione non e' gia'
installata: dove il browser lo permette apre l'installazione automatica, altrove
mostra le istruzioni del sistema riconosciuto, perche' Safari non emette
`beforeinstallprompt` e la voce resta nascosta nel menu di condivisione.

Limiti del browser, da conoscere prima di affidarcisi:

- **gli allarmi suonano solo con la pagina aperta**: una PWA chiusa non puo'
  svegliarsi da sola senza un server che invii notifiche push
- il suono parte solo dopo la prima interazione con la pagina, da cui il
  pulsante `Attiva avvisi`
- su iPhone le notifiche funzionano solo se l'applicazione e' stata installata
  sulla schermata iniziale

### Codice di accesso e pubblicazione

Il codice di accesso e' quello del sito, uguale per tutti i servizi, e la
pubblicazione riguarda il repository intero: sono descritti nel
[README alla radice](../README.md).

## Struttura

I percorsi partono da questa cartella, `timers/`.

| File | Descrizione |
|---|---|
| `desktop/ragnarok_timers.py` | interfaccia tkinter: finestra, tabella, editing inline, entry point |
| `desktop/timers_core.py` | modello dati, persistenza, audio, parsing. Nessun import di tkinter |
| `desktop/tests/test_core.py` | test pytest della logica non grafica |
| `index.html`, `style.css` | pagina e stile dell'applicazione web |
| `core.js` | gemello JavaScript di `timers_core.py`. Non tocca il DOM |
| `app.js` | interfaccia web: lista, form, comandi, allarmi |
| `storage.js` | persistenza su `localStorage`, esportazione e importazione |
| `alerts.js` | suono, notifiche, titolo lampeggiante, wake lock |
| `sw.js` | service worker: uso offline e installazione |
| `tests_web/core.test.mjs` | test della logica web |
| `desktop/ragnarok_timers.json` | dati e impostazioni (generato automaticamente) |

## Test

```bash
conda activate ragnarok-timers
cd timers/desktop
pip install -r requirements-dev.txt
pytest
```

La logica della versione web ha i suoi test, che girano con il solo Node
installato:

```bash
cd timers
node --test tests_web/*.mjs
```

Per provare le pagine serve un server locale, perche' i moduli JavaScript e il
service worker non funzionano aprendo il file dal disco. Va avviato dalla
radice del repository, perche' la pagina carica `gate.js` da li':

```bash
python -m http.server 8765
```

L'applicazione e' su `http://localhost:8765/timers/`. Service worker e
installazione richiedono `localhost` oppure HTTPS: dall'indirizzo di rete
locale in HTTP semplice la pagina si apre ma non si installa.

## Build eseguibile

```bash
cd timers/desktop
pyinstaller RagnarokTimers.spec --noconfirm
```

L'eseguibile viene creato in `dist/RagnarokTimers/`. Il file dati viene scritto nella cartella dell'exe al primo salvataggio, cioe' appena aggiungi un timer o chiudi la finestra: la cartella si puo' quindi spostare o copiare mantenendo i timer.

La build va lanciata da un environment conda con tkinter. Lo spec copia dalla cartella `Library/bin` dell'environment le DLL native che PyInstaller non rileva da solo (Tcl/Tk e libffi); se non le trova si ferma con un errore invece di produrre un eseguibile che non parte.

Distribuzione:

```powershell
Compress-Archive -Path "dist\RagnarokTimers\*" -DestinationPath "RagnarokTimers-v1.0.0-windows.zip"
```

Lo zip si pubblica come release del repository, con il tag `timers-v` seguito
dalla versione. L'eseguibile pubblicato si scarica dalle
[release](https://github.com/AlbGri/ro/releases); la home del sito e le
impostazioni dei timer hanno un collegamento diretto allo zip, da aggiornare a
ogni nuova release.

## Compatibilita'

Sviluppato e testato su Windows 11. Su Linux l'allarme sonoro richiede `aplay` (pacchetto `alsa-utils`) e il lampeggio della barra delle applicazioni non e' disponibile.
