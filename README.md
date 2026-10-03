# Ragnarok

Strumenti e guide per Ragnarok Online in un solo sito statico, servito da
GitHub Pages: `https://albgri.github.io/ragnarok/`.

La home chiede un codice di accesso e poi fa scegliere il servizio.

| Servizio | Indirizzo | Cartella |
|---|---|---|
| Timer di respawn per MvP e quest, web e desktop | `/ragnarok/timers/` | [`timers/`](timers/README.md) |
| Guida uaRO "Nuovo Mondo", passo per passo | `/ragnarok/guide/nuovo-mondo.html` | `guide/` |

Tutto e' HTML, CSS e JavaScript senza framework ne' passaggi di build: le
pagine vengono servite cosi' come sono nel repository.

## Codice di accesso

`gate.js` contiene l'impronta SHA-256 di un codice, mai il codice. Ogni pagina
lo include e resta coperta finche' il codice non viene inserito; il browser lo
ricorda, quindi si inserisce una volta sola per tutto il sito.

```bash
node tools/set-access-code.mjs "codice scelto"
node tools/set-access-code.mjs --clear     # toglie il codice
```

Non e' una protezione. Il sito e' statico e il repository e' pubblico: il
contenuto si legge comunque dal sorgente, un codice corto si trova per
tentativi e chi lo conosce puo' passarlo a chiunque. Serve a tenere fuori i
curiosi di passaggio. I dati di ciascuno (timer, spunte e note della guida)
restano nel suo browser: non c'e' nulla di condiviso da proteggere.

## Struttura

| Percorso | Contenuto |
|---|---|
| `index.html` | home: elenco dei servizi |
| `gate.js` | codice di accesso e tema chiaro o scuro, incluso da ogni pagina |
| `tools/set-access-code.mjs` | imposta l'impronta del codice di accesso |
| `timers/` | applicazione web dei timer; in `timers/desktop/` la versione desktop in Python |
| `guide/` | guide in un solo file HTML ciascuna; in `guide/strumenti/` gli script Node che le validano |

Gli strumenti della guida leggono la cartella `guide/fonti` (copie di script e
database di rAthena e cache delle mappe), che non fa parte del repository. La
guida funziona anche senza.

### Aggiungere un servizio

1. Una cartella sua, con una pagina che include il codice di accesso
   nell'`<head>`: `<script src="../gate.js"></script>`.
2. Lo stile delle altre pagine (colori e caratteri della guida Nuovo Mondo), un
   pulsante Home verso la scelta dei servizi e uno per il tema, che chiama
   `toggleTheme()`.
3. Una scheda nella home, in `index.html`.

Il tema scelto vale per tutto il sito: `gate.js` lo ricorda e lo applica a ogni
pagina con l'attributo `data-theme`; senza una scelta decide il sistema.

## Prova in locale

Dalla radice del repository:

```bash
python -m http.server 8765
```

Il sito e' su `http://localhost:8765/`. Serve un server perche' i moduli
JavaScript e il service worker dei timer non funzionano aprendo i file dal
disco; la guida invece si apre anche con un doppio clic.

## Pubblicazione

Su GitHub, `Settings > Pages > Deploy from a branch`, ramo `main`, cartella
`/ (root)`. Il file `.nojekyll` dice a GitHub di servire i file senza
elaborarli.

## Licenza

[GPL-3.0](LICENSE).
