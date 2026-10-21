// Prepara il documento finto e cio' che il motore si aspetta dal browser, prima dei suoi file.
var documento = new Documento();
documento.carica(PAGINA_MOTORE);
// la build nel # dell'indirizzo si carica all'avvio, come nell'originale
var buildIndirizzo = typeof location !== "undefined" ? location.hash.slice(1) : "";
var Lang = 0;
