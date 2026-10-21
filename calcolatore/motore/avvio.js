// Prepara il documento finto e cio' che il motore si aspetta dal browser, prima dei suoi file.
var documento = new Documento();
documento.carica(PAGINA_MOTORE);
// l'indirizzo vero solo in lettura: una build nel # si carica all'avvio, come nell'originale
var posizioneMotore = {
  href: typeof location !== "undefined" ? location.hash : "",
};
var Lang = 0, PvP = 0;
