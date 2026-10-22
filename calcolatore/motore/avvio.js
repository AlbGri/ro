// Cio' che il motore si aspetta dal browser, prima dei suoi file.
// la build nel # dell'indirizzo si carica all'avvio, come nell'originale
var buildIndirizzo = typeof location !== "undefined" ? location.hash.slice(1) : "";
var Lang = 0;
