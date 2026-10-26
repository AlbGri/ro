# Calcolatore

Statistiche, danni fatti e danni subiti di un personaggio di uaRO (pre-renewal), con
equipaggiamento, carte, buff e mostri. Pagina: `/ro/calculator/`.

## Da dove viene

Il motore di calcolo e' quello del calcolatore di uaRO di Thrice e Arlix
([uaro-calc.xdthrice.workers.dev](https://uaro-calc.xdthrice.workers.dev/)), che discende dal
simulatore di ROratorio, tradotto e adattato da Doddler e aggiornato da Gandi, Triper e kurimet.
Calcoli e dati sono loro; il codice in `motore/` (tranne `campi.js`, `avvio.js`, `mappe.js`, `uaro.js`,
`importa.js` ed `esterni.js`) resta dei rispettivi autori. Da qui il calcolatore prosegue per conto
suo: gli aggiornamenti dell'originale non si importano, e le build hanno un formato loro, che
l'originale non legge. Le build dell'originale e del calcolatore di Bish
([rocalc-temp.web.app](https://rocalc-temp.web.app/)) si possono pero' importare dal menu.

Qui ci sono:

- `motore/campi.js` e `motore/avvio.js`: i campi e i risultati del motore, con cui lo usano la
  pagina e i test, al posto della pagina dell'originale
- `motore/mappe.js`: le mappe di ogni luogo con i mostri che ci compaiono, generate dagli spawn
  di [rAthena](https://github.com/rathena/rathena) (pre-renewal); i luoghi di uaRO non ci sono
- `motore/uaro.js` e i commenti `uaRO:` nel motore: correzioni per uaRO prese dalla
  [wiki del server](https://wiki.uaro.net/), ognuna con la sua fonte
- `motore/importa.js` ed `motore/esterni.js`: "Importa da esterno", le build degli altri due
  calcolatori tradotte nel formato di questo; `esterni.js` abbina per nome oggetti, carte e mostri
  dell'elenco di Bish ai nostri
- `index.html`, `app.js`, `traduzioni.js`: la pagina, in italiano e in inglese
- `tests/`: il motore deve dare i risultati attesi su 360 build registrate con l'originale,
  salvo le correzioni per uaRO; `strumenti/aggiorna-riferimento.mjs` aggiorna i risultati attesi
  dopo una correzione voluta

## Prove

```bash
cd calcolatore
node --test tests/*.test.mjs
```
