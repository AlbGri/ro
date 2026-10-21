// Documento finto su cui gira il motore del calcolatore, in pagina e nei test.
// Il motore viene da un calcolatore che leggeva e scriveva un form HTML: qui c'e' quanto
// basta di DOM (elementi, HTML scritto per id, campi del form con la semantica delle
// <select> del browser) perche' faccia gli stessi conti senza toccare la pagina vera.

var VUOTI = new Set(["input", "br", "img", "hr", "meta", "link", "col", "wbr", "area", "source"]);
// tag che chiudono da soli l'elemento aperto, come nel parser del browser
var CHIUDE = {
  option: ["option"],
  optgroup: ["option", "optgroup"],
  td: ["td", "th"],
  th: ["td", "th"],
  tr: ["td", "th", "tr"],
  li: ["li"],
  p: ["p"],
};
var ENTITA = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", times: "×", rarr: "→", larr: "←", middot: "·", hellip: "…", mdash: "—", ndash: "–", deg: "°", plusmn: "±", frac12: "½" };

function decodifica(s) {
  if (s.indexOf("&") < 0) return s;
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, function (tutto, e) {
    if (e[0] === "#") return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    var v = ENTITA[e.toLowerCase()];
    return v === undefined ? tutto : v;
  });
}
function codifica(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;");
}

function Testo(testo) {
  this.testo = testo;
  this.padre = null;
}
Object.defineProperty(Testo.prototype, "textContent", { get: function () { return this.testo; } });

function ListaClassi(el) { this.el = el; this.insieme = new Set(); }
ListaClassi.prototype.add = function () { for (var i = 0; i < arguments.length; i++) this.insieme.add(arguments[i]); };
ListaClassi.prototype.remove = function () { for (var i = 0; i < arguments.length; i++) this.insieme.delete(arguments[i]); };
ListaClassi.prototype.contains = function (c) { return this.insieme.has(c); };
ListaClassi.prototype.toggle = function (c, forza) {
  var si = forza === undefined ? !this.insieme.has(c) : !!forza;
  if (si) this.insieme.add(c); else this.insieme.delete(c);
  return si;
};

function Elemento(doc, tag, attributi) {
  this.doc = doc;
  this.tag = tag.toLowerCase();
  this.attributi = attributi || {};
  this.figli = [];
  this.padre = null;
  this.style = {};
  this.classList = new ListaClassi(this);
  if (this.attributi["class"]) this.attributi["class"].split(/\s+/).forEach(function (c) { if (c) this.classList.add(c); }, this);
  this._disabilitato = "disabled" in this.attributi;
  this._nascosto = "hidden" in this.attributi;
  if (this.tag === "input") {
    this._spuntato = "checked" in this.attributi;
    this._valore = "value" in this.attributi ? this.attributi.value : (this.type === "checkbox" || this.type === "radio" ? "on" : "");
  }
  if (this.tag === "option") this.selezionata = "selected" in this.attributi;
  if (this.tag === "select") { this._opzioni = null; this._collezione = null; }
}
var EP = Elemento.prototype;
// nel browser queste proprieta' sono sempre vero o falso, qualunque valore si assegni
Object.defineProperty(EP, "disabled", { get: function () { return this._disabilitato; }, set: function (v) { this._disabilitato = !!v; } });
Object.defineProperty(EP, "hidden", { get: function () { return this._nascosto; }, set: function (v) { this._nascosto = !!v; } });
Object.defineProperty(EP, "checked", { get: function () { return !!this._spuntato; }, set: function (v) { this._spuntato = !!v; } });
Object.defineProperty(EP, "tagName", { get: function () { return this.tag.toUpperCase(); } });
Object.defineProperty(EP, "nodeName", { get: function () { return this.tag.toUpperCase(); } });
Object.defineProperty(EP, "id", {
  get: function () { return this.attributi.id || ""; },
  set: function (v) { this.setAttribute("id", v); },
});
Object.defineProperty(EP, "name", {
  get: function () { return this.attributi.name || ""; },
  set: function (v) { this.setAttribute("name", v); },
});
Object.defineProperty(EP, "type", {
  get: function () {
    if (this.tag === "select") return "select-one";
    return (this.attributi.type || (this.tag === "input" ? "text" : "")).toLowerCase();
  },
});
Object.defineProperty(EP, "label", {
  get: function () { return this.attributi.label || (this.tag === "option" ? this.text : ""); },
  set: function (v) { this.attributi.label = String(v); },
});
Object.defineProperty(EP, "isConnected", {
  get: function () {
    for (var n = this; n; n = n.padre) if (n === this.doc.radice) return true;
    return false;
  },
});
EP.getAttribute = function (k) { k = k.toLowerCase(); return k in this.attributi ? this.attributi[k] : null; };
EP.removeAttribute = function (k) { delete this.attributi[k.toLowerCase()]; };
EP.setAttribute = function (k, v) {
  k = k.toLowerCase();
  var collegato = (k === "id" || k === "name") && this.isConnected;
  if (collegato) this.doc._togli(this);
  this.attributi[k] = String(v);
  if (k === "disabled") this.disabled = true;
  if (k === "hidden") this.hidden = true;
  if (collegato) this.doc._registra(this);
};
EP.contains = function (n) {
  for (; n; n = n.padre) if (n === this) return true;
  return false;
};
EP.hasChildNodes = function () { return this.figli.length > 0; };
Object.defineProperty(EP, "firstChild", { get: function () { return this.figli[0] || null; } });
EP._select = function () {
  for (var n = this; n; n = n.padre) if (n.tag === "select") return n;
  return null;
};
// la lista delle opzioni si aggiorna senza ricostruirla nei casi comuni (aggiunta in fondo,
// rimozione); la regola della scelta si applica prima del primo uso che ne dipende
EP._cambiato = function (aggiunto, tolto) {
  var s = this._select();
  if (!s) return;
  var l = s._opzioni;
  if (l && aggiunto && this === s && aggiunto.tag === "option" && s.figli[s.figli.length - 1] === aggiunto) l.push(aggiunto);
  else if (l && tolto && tolto.tag === "option") {
    if (l[l.length - 1] === tolto) l.pop();
    else if (l[0] === tolto) l.shift();
    else { var i = l.indexOf(tolto); if (i >= 0) l.splice(i, 1); else s._opzioni = null; }
  } else if (!((aggiunto || tolto) instanceof Testo)) s._opzioni = null;
  s._sporco = true;
};
EP._assicura = function () {
  if (this._sporco) { this._sporco = false; this._reimposta(); }
};
EP.removeChild = function (n) {
  var i = this.figli.indexOf(n);
  if (i < 0) throw new Error("removeChild: non e' un figlio");
  this.figli.splice(i, 1);
  if (this.isConnected) this.doc._scollega(n);
  n.padre = null;
  this._cambiato(null, n);
  return n;
};
EP.appendChild = function (n) { return this.insertBefore(n, null); };
EP.insertBefore = function (n, prima) {
  if (n.padre) n.padre.removeChild(n);
  var i = prima ? this.figli.indexOf(prima) : -1;
  if (i < 0) this.figli.push(n); else this.figli.splice(i, 0, n);
  n.padre = this;
  if (this.isConnected) this.doc._collega(n);
  // un'opzione scelta che entra in una <select> toglie la scelta alle altre
  var s = n.tag === "option" && n.selezionata ? this._select() : null;
  this._cambiato(n, null);
  if (s) for (var o of s._lista()) if (o !== n) o.selezionata = false;
  return n;
};
EP.replaceChild = function (nuovo, vecchio) {
  this.insertBefore(nuovo, vecchio);
  this.removeChild(vecchio);
  return vecchio;
};
EP._svuota = function () {
  var collegato = this.isConnected;
  for (var i = 0; i < this.figli.length; i++) {
    if (collegato) this.doc._scollega(this.figli[i]);
    this.figli[i].padre = null;
  }
  this.figli = [];
};
EP._aggiungiHtml = function (html) {
  var nodi = this.doc._analizza(html, this);
  for (var i = 0; i < nodi.length; i++) {
    nodi[i].padre = this;
    this.figli.push(nodi[i]);
    if (this.isConnected) this.doc._collega(nodi[i]);
  }
  this._cambiato();
};
Object.defineProperty(EP, "innerHTML", {
  get: function () { return this.figli.map(serializza).join(""); },
  set: function (html) { this._svuota(); this._aggiungiHtml(String(html)); },
});
EP.insertAdjacentHTML = function (dove, html) {
  if (String(dove).toLowerCase() !== "beforeend") throw new Error("insertAdjacentHTML: solo beforeend");
  this._aggiungiHtml(String(html));
};
Object.defineProperty(EP, "textContent", {
  get: function () { return this.figli.map(function (f) { return f.textContent; }).join(""); },
  set: function (t) { this._svuota(); var n = new Testo(String(t)); n.padre = this; this.figli.push(n); if (this.tag !== "option") this._cambiato(); },
});
Object.defineProperty(EP, "innerText", {
  get: function () { return this.textContent; },
  set: function (t) { this.textContent = t; },
});
// il gestore scritto nel campo (onchange, onclick) come funzione, compilata una volta;
// this[this.selectedIndex] e' l'opzione scelta. onkeyup non conta: la pagina non lo esegue
Object.defineProperty(EP, "gestore", {
  get: function () {
    if (this._funzione !== undefined) return this._funzione;
    var codice = this.attributi.onchange || this.attributi.onclick;
    if (!codice) return null;
    if (this._codice !== codice) {
      this._codice = codice;
      this._gestore = new Function("event", codice.replace(/this\[this\.selectedIndex\]/g, "this.options[this.selectedIndex]"));
    }
    return this._gestore;
  },
});
EP.focus = function () {};
EP.blur = function () {};
EP.addEventListener = function () {};
EP.removeEventListener = function () {};
EP.dispatchEvent = function () { return true; };
EP.querySelector = function () { return null; };
EP.querySelectorAll = function () { return []; };

// <option>
Object.defineProperty(EP, "text", {
  get: function () { return this.textContent.replace(/[\t\n\f\r ]+/g, " ").trim(); },
  set: function (t) { this.textContent = t; },
});
Object.defineProperty(EP, "selected", {
  get: function () { var s = this._select(); if (s) s._assicura(); return !!this.selezionata; },
  set: function (v) {
    var s = this._select();
    if (s) s._assicura();
    if (v && s) for (var o of s._lista()) o.selezionata = false;
    this.selezionata = !!v;
    if (s) s._reimposta();
  },
});
Object.defineProperty(EP, "index", {
  get: function () { var s = this._select(); return s ? s._lista().indexOf(this) : 0; },
});
Object.defineProperty(EP, "defaultSelected", {
  get: function () { return "selected" in this.attributi; },
  set: function (v) { if (v) this.attributi.selected = ""; else delete this.attributi.selected; },
});

// value: <input>, <select>, <option>
Object.defineProperty(EP, "value", {
  get: function () {
    if (this.tag === "option") return "value" in this.attributi ? this.attributi.value : this.text;
    if (this.tag === "select") {
      this._assicura();
      var o = this._lista()[this.selectedIndex];
      return o ? o.value : "";
    }
    if (this.tag === "input" || this.tag === "textarea") return this._valore;
    return this.attributi.value || "";
  },
  set: function (v) {
    v = v === null ? "" : String(v);
    if (this.tag === "option") { this.attributi.value = v; return; }
    if (this.tag === "select") {
      this._assicura();
      var trovata = false;
      for (var o of this._lista()) {
        o.selezionata = !trovata && o.value === v;
        if (o.selezionata) trovata = true;
      }
      return;
    }
    this._valore = v;
  },
});

// <select>
EP._lista = function () {
  if (this._opzioni) return this._opzioni;
  var l = [];
  (function giu(n) {
    for (var f of n.figli) {
      if (!(f instanceof Elemento)) continue;
      if (f.tag === "option") l.push(f);
      else if (f.tag === "optgroup") giu(f);
    }
  })(this);
  return (this._opzioni = l);
};
// algoritmo del browser per una <select> semplice: sempre una sola opzione scelta, la
// prima non disabilitata se nessuna lo e', l'ultima se piu' d'una
EP._reimposta = function () {
  var l = this._lista(), scelte = 0, ultima = -1;
  for (var i = 0; i < l.length; i++) if (l[i].selezionata) { scelte++; ultima = i; }
  if (scelte === 0) {
    for (i = 0; i < l.length; i++) if (!l[i].disabled) { l[i].selezionata = true; break; }
  } else if (scelte > 1) {
    for (i = 0; i < l.length; i++) l[i].selezionata = i === ultima;
  }
};
Object.defineProperty(EP, "selectedIndex", {
  get: function () {
    this._assicura();
    var l = this._lista();
    for (var i = 0; i < l.length; i++) if (l[i].selezionata) return i;
    return -1;
  },
  set: function (v) {
    this._assicura();
    var l = this._lista();
    v = Number(v);
    for (var i = 0; i < l.length; i++) l[i].selezionata = i === v;
  },
});
EP._lunghezza = function (n) {
  n = Number(n) >>> 0;
  var l = this._lista();
  if (n < l.length) {
    var via = l.slice(n);
    for (var i = via.length - 1; i >= 0; i--) via[i].padre.removeChild(via[i]);
  } else {
    for (i = l.length; i < n; i++) this.appendChild(new this.doc.Opzione());
  }
};
EP._imposta = function (i, o) {
  var l = this._lista();
  if (o === null || o === undefined) {
    if (i < l.length) l[i].padre.removeChild(l[i]);
    return;
  }
  var mancano = i - l.length;
  for (var k = 0; k < mancano; k++) this.appendChild(new this.doc.Opzione());
  if (mancano >= 0) this.appendChild(o);
  else l[i].padre.replaceChild(o, l[i]);
};
EP.add = function (o, prima) {
  if (prima === undefined || prima === null) this.appendChild(o);
  else {
    var rif = typeof prima === "number" ? this._lista()[prima] : prima;
    if (rif) rif.padre.insertBefore(o, rif); else this.appendChild(o);
  }
};
EP.remove = function (i) {
  if (this.tag === "select" && arguments.length) this._imposta(Number(i), null);
  else if (this.padre) this.padre.removeChild(this);
};
EP.item = function (i) { return this._lista()[i] || null; };
Object.defineProperty(EP, "options", {
  get: function () {
    if (this._collezione) return this._collezione;
    var sel = this;
    var base = {
      get length() { return sel._lista().length; },
      set length(n) { sel._lunghezza(n); },
      get selectedIndex() { return sel.selectedIndex; },
      set selectedIndex(v) { sel.selectedIndex = v; },
      add: function (o, p) { sel.add(o, p); },
      remove: function (i) { sel._imposta(Number(i), null); },
      item: function (i) { return sel._lista()[i] || null; },
      [Symbol.iterator]: function () { return sel._lista().slice()[Symbol.iterator](); },
    };
    return (this._collezione = new Proxy(base, {
      get: function (t, p) {
        if (typeof p === "string" && /^\d+$/.test(p)) return sel._lista()[Number(p)];
        return t[p];
      },
      set: function (t, p, v) {
        if (typeof p === "string" && /^\d+$/.test(p)) { sel._imposta(Number(p), v); return true; }
        t[p] = v;
        return true;
      },
    }));
  },
});
Object.defineProperty(EP, "length", {
  get: function () { return this.tag === "select" ? this._lista().length : 0; },
  set: function (n) { if (this.tag === "select") this._lunghezza(n); },
});

function serializza(n) {
  if (n instanceof Testo) return codifica(n.testo);
  var a = "";
  for (var k in n.attributi) a += " " + k + (n.attributi[k] === "" ? "" : '="' + n.attributi[k].replace(/"/g, "&quot;") + '"');
  if (VUOTI.has(n.tag)) return "<" + n.tag + a + ">";
  return "<" + n.tag + a + ">" + n.figli.map(serializza).join("") + "</" + n.tag + ">";
}

function Documento() {
  var doc = this;
  this.perId = new Map();
  this.perNome = new Map();
  this.radice = new Elemento(this, "html", {});
  this.documentElement = this.radice;
  this.radice.clientWidth = this.radice.scrollWidth = this.radice.offsetWidth = 1600;
  this.head = new Elemento(this, "head", {});
  this.body = new Elemento(this, "body", {});
  this.body.scrollWidth = this.body.offsetWidth = 1600;
  this.radice.appendChild(this.head);
  this.radice.appendChild(this.body);
  this.form = null;
  this.calcForm = undefined;
  // costruttore di <option> del documento, come "new Option(testo, valore)"
  this.Opzione = function (testo, valore, predefinita, scelta) {
    var o = new Elemento(doc, "option", {});
    if (testo !== undefined && String(testo) !== "") { var t = new Testo(String(testo)); t.padre = o; o.figli.push(t); }
    if (valore !== undefined) o.attributi.value = String(valore);
    if (predefinita) o.attributi.selected = "";
    o.selezionata = !!scelta;
    return o;
  };
}
var DP = Documento.prototype;
DP.getElementById = function (id) { var l = this.perId.get(String(id)); return (l && l[0]) || null; };
DP.createElement = function (tag) { return new Elemento(this, tag, {}); };
DP.createTextNode = function (t) { return new Testo(String(t)); };
DP.addEventListener = function () {};
DP.querySelector = function () { return null; };
DP.querySelectorAll = function () { return []; };
// per id e per nome si tiene la lista degli elementi collegati: vale il primo
function metti(mappa, chiave, el) {
  var l = mappa.get(chiave);
  if (l) l.push(el); else mappa.set(chiave, [el]);
}
function leva(mappa, chiave, el) {
  var l = mappa.get(chiave);
  if (!l) return;
  var i = l.indexOf(el);
  if (i >= 0) l.splice(i, 1);
  if (!l.length) mappa.delete(chiave);
}
var CONTROLLI = new Set(["input", "select", "textarea", "button"]);
DP._registra = function (el) {
  var id = el.attributi.id, nome = el.attributi.name;
  if (id) metti(this.perId, id, el);
  if (CONTROLLI.has(el.tag)) {
    if (nome) { metti(this.perNome, nome, el); this._campo(nome); }
    if (id && id !== nome) { metti(this.perNome, id, el); this._campo(id); }
  }
  if (el.tag === "form" && nome === "calcForm" && !this.form) {
    this.form = el;
    this.calcForm = {};
    for (var k of this.perNome.keys()) this._campo(k);
  }
};
DP._togli = function (el) {
  var id = el.attributi.id, nome = el.attributi.name;
  if (id) leva(this.perId, id, el);
  if (CONTROLLI.has(el.tag)) {
    if (nome) { leva(this.perNome, nome, el); this._campo(nome); }
    if (id && id !== nome) { leva(this.perNome, id, el); this._campo(id); }
  }
};
// calcForm.NOME e' il campo con quel name o id dentro il form, come nel browser: il primo
// registrato, se ce n'e' piu' d'uno. I campi creati da campo() (campi.js) non stanno
// nell'albero: li registra campo() e qui non si toccano
var CAMPI_CODICE = new Set();
DP._campo = function (nome) {
  if (!this.form || CAMPI_CODICE.has(nome)) return;
  var l = this.perNome.get(nome);
  if (l) for (var i = 0; i < l.length; i++) if (this.form.contains(l[i])) { this.calcForm[nome] = l[i]; return; }
  delete this.calcForm[nome];
};
DP._collega = function (n) {
  if (!(n instanceof Elemento)) return;
  this._registra(n);
  for (var f of n.figli) this._collega(f);
};
DP._scollega = function (n) {
  if (!(n instanceof Elemento)) return;
  for (var f of n.figli) this._scollega(f);
  this._togli(n);
};
// HTML -> nodi, con le chiusure implicite del browser che servono al motore
DP._analizza = function (html, contenitore) {
  var doc = this, radice = { figli: [], tag: "#frammento" }, pila = [radice];
  var re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  var ultimo = 0, m;
  function cima() { return pila[pila.length - 1]; }
  function testo(t) {
    if (!t) return;
    var n = new Testo(decodifica(t));
    cima().figli.push(n);
  }
  while ((m = re.exec(html))) {
    testo(html.slice(ultimo, m.index));
    ultimo = re.lastIndex;
    if (m[0].startsWith("<!--")) continue;
    var chiusura = m[1] === "/", tag = m[2].toLowerCase();
    if (chiusura) {
      for (var i = pila.length - 1; i > 0; i--) {
        if (pila[i].tag === tag) { pila.length = i; break; }
      }
      continue;
    }
    var chiude = CHIUDE[tag];
    if (chiude) while (pila.length > 1 && chiude.indexOf(cima().tag) >= 0) pila.pop();
    var attributi = {}, ra = /([^\s=\/]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g, a;
    while ((a = ra.exec(m[3]))) {
      var v = a[2] === undefined ? "" : a[2].replace(/^["']|["']$/g, "");
      attributi[a[1].toLowerCase()] = decodifica(v);
    }
    var el = new Elemento(doc, tag, attributi);
    cima().figli.push(el);
    if (!VUOTI.has(tag) && !/\/\s*$/.test(m[3])) pila.push(el);
  }
  testo(html.slice(ultimo));
  // i padri si collegano qui: i nodi in cima tornano al chiamante
  (function padri(n) { for (var f of n.figli) { f.padre = n === radice ? null : n; if (f instanceof Elemento) padri(f); } })(radice);
  // le opzioni lette dall'HTML: dentro una <select> vale l'algoritmo di scelta
  (function scelte(n) {
    for (var f of n.figli) if (f instanceof Elemento) { scelte(f); if (f.tag === "select") f._sporco = true; }
  })(radice);
  return radice.figli;
};
DP.carica = function (html) {
  this.body.innerHTML = html;
};
// testo di un elemento come lo mostra il browser, spazi compressi
DP.testo = function (id) {
  var el = this.getElementById(id);
  return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
};
