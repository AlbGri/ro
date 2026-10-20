# Calcolatore

Statistiche, danni fatti e danni subiti di un personaggio di uaRO (pre-renewal), con
equipaggiamento, carte, buff e mostri. Pagina: `/ro/calcolatore/`.

## Da dove viene

Il motore di calcolo e' quello del calcolatore di uaRO di Thrice e Arlix
([uaro-calc.xdthrice.workers.dev](https://uaro-calc.xdthrice.workers.dev/)), che discende dal
simulatore di ROratorio, tradotto e adattato da Doddler e aggiornato da Gandi, Triper e kurimet.
Calcoli e dati sono loro; il codice in `motore/` (tranne `forma.js`, `avvio.js` e `uaro.js`)
resta dei rispettivi autori. Da qui il calcolatore prosegue per conto suo: gli aggiornamenti
dell'originale non si importano, e le build hanno un formato loro, che l'originale non legge.

Qui ci sono:

- `motore/forma.js` e `motore/avvio.js`: un documento finto su cui il motore gira senza la sua
  pagina, nel browser e nei test
- `motore/uaro.js` e i commenti `uaRO:` nel motore: correzioni per uaRO prese dalla
  [wiki del server](https://wiki.uaro.net/), ognuna con la sua fonte
- `index.html`, `app.js`, `traduzioni.js`: la pagina in italiano
- `tests/`: il motore deve dare i risultati attesi su 360 build registrate con l'originale,
  salvo le correzioni per uaRO; `strumenti/aggiorna-riferimento.mjs` aggiorna i risultati attesi
  dopo una correzione voluta

## Prove

```bash
cd calcolatore
node --test tests/*.test.mjs
```
