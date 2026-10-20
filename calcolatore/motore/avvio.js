// Prepara il documento finto e cio' che il motore si aspetta dal browser, prima dei suoi file.
var documento = new Documento();
documento.carica(PAGINA_MOTORE);
// salvataggi e indirizzi li gestisce la pagina: il motore non tocca quelli veri
var memoriaMotore = {};
Object.defineProperties(memoriaMotore, {
  getItem: { value: function (k) { return Object.prototype.hasOwnProperty.call(this, k) ? String(this[k]) : null; } },
  setItem: { value: function (k, v) { this[k] = String(v); } },
  removeItem: { value: function (k) { delete this[k]; } },
});
// l'indirizzo vero solo in lettura: una build nel # si carica all'avvio, come nell'originale.
// Senza la parte dopo ?, che l'originale leggerebbe come una build
var posizioneMotore = {
  href: typeof location !== "undefined" ? location.origin + location.pathname + location.hash : "https://calcolatore/",
  replace: function () {},
};
function avvisoMotore() {}
function confermaMotore() { return true; }
function appuntiMotore() { return Promise.resolve(); }
var Lang = 0, PvP = 0;
