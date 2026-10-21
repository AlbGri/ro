// I campi del motore come li usa chi sta fuori (la pagina, gli strumenti di prova): una scelta
// e' il valore nel campo, poi il suo gestore. Il ricalcolo (calc) lo chiede chi sceglie.
// campo: il campo o il suo nome; senza valore esegue solo il gestore (pulsanti)
function scegli(campo, valore) {
  if (typeof campo === "string") campo = c[campo];
  if (valore !== undefined) {
    if (campo.type === "checkbox") campo.checked = valore;
    else campo.value = valore;
  }
  if (campo.gestore) campo.gestore.call(campo);
}
