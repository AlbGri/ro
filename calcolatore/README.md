# Calcolatore

Statistiche, danni fatti e danni subiti di un personaggio di uaRO (pre-renewal), con
equipaggiamento, carte, buff e mostri. Pagina: `/ro/calcolatore/`.

## Da dove viene

Il motore di calcolo e' quello del calcolatore di uaRO di Thrice e Arlix
([uaro-calc.xdthrice.workers.dev](https://uaro-calc.xdthrice.workers.dev/)), che discende dal
simulatore di ROratorio, tradotto e adattato da Doddler e aggiornato da Gandi, Triper e kurimet.
Calcoli e dati sono loro; il codice in `motore/` (tranne `forma.js`, `avvio.js` e `uaro.js`)
resta dei rispettivi autori.

Qui ci sono:

- `motore/forma.js` e `motore/avvio.js`: un documento finto su cui il motore gira senza la sua
  pagina, nel browser e nei test
- `motore/uaro.js` e `strumenti/modifiche.mjs`: correzioni per uaRO prese dalla
  [wiki del server](https://wiki.uaro.net/), ognuna con la sua fonte
- `index.html`, `app.js`, `traduzioni.js`: la pagina in italiano
- `strumenti/importa.mjs`: importa una versione nuova del calcolatore di Thrice e riapplica le
  correzioni
- `tests/`: il motore deve dare gli stessi risultati dell'originale su 360 build registrate,
  salvo le correzioni per uaRO

## Prove

```bash
cd calcolatore
node --test tests/*.test.mjs
```
