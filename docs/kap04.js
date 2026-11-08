// Kapitel 4: Blockschaltbild zum Antippen und Notruf als Animation.
(function () {
  var ruhig = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Blockschaltbild ---------- */
  function blockbild() {
    var fig = document.getElementById("blockbild");
    if (!fig) return;
    var svg = fig.querySelector("svg");
    var info = fig.querySelector(".info-feld");
    var hits = fig.querySelectorAll(".b-hit");
    function zeigen(h) {
      hits.forEach(function (x) { x.classList.toggle("gewaehlt", x === h); });
      info.innerHTML = "";
      var b = document.createElement("strong");
      b.textContent = h.getAttribute("data-name") + ": ";
      info.appendChild(b);
      info.appendChild(document.createTextNode(h.getAttribute("data-info")));
    }
    hits.forEach(function (h) {
      h.addEventListener("click", function () { zeigen(h); });
      h.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); zeigen(h); }
      });
    });
    var knoepfe = document.querySelectorAll(".schalter[data-modus]");
    knoepfe.forEach(function (k) {
      k.addEventListener("click", function () {
        var an = k.getAttribute("aria-pressed") !== "true";
        knoepfe.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        svg.classList.remove("zeige-strom", "zeige-sig");
        if (an) {
          k.setAttribute("aria-pressed", "true");
          svg.classList.add("zeige-" + k.getAttribute("data-modus"));
        }
      });
    });
  }

  /* ---------- Notruf-Spieler ---------- */
  var SCHRITTE = [
    { pfade: ["p1"], boxen: ["b-knopf", "b-funk"],
      text: "Der Gast hält den Knopf 3 Sekunden gedrückt. Der Knopf meldet das dem Funkmodul." },
    { pfade: ["p2"], boxen: ["b-funk", "b-motor"], brummt: true,
      text: "Das Funkmodul lässt den Motor brummen und die LED rot blinken. Jetzt bleiben 5 Sekunden zum Abbrechen." },
    { pfade: ["p3"], boxen: ["b-gps", "b-funk"],
      text: "Das Funkmodul holt sich die letzte Position vom GPS." },
    { pfade: ["p4"], boxen: ["b-funk", "b-empf"], wellen: true,
      text: "Der Notruf geht mit der Position per Funk an die Empfänger am Berg." },
    { pfade: ["p5", "p2"], boxen: ["b-empf", "b-funk", "b-motor"], brummt: true,
      text: "Die Bergbahn nimmt den Notruf an. Die Antwort kommt per Funk zurück, das kann etwa 20 Sekunden dauern: Der Motor vibriert 2-mal lang, die LED blinkt rot. Hilfe ist unterwegs." }
  ];

  function spieler() {
    var fig = document.getElementById("notruf-spieler");
    if (!fig) return;
    var svg = fig.querySelector("svg");
    var punkt = svg.querySelector("#s-punkt");
    var zaehler = fig.querySelector(".s-zaehler");
    var text = fig.querySelector(".s-text");
    var kZur = fig.querySelector('[data-s="zurueck"]');
    var kSpiel = fig.querySelector('[data-s="spielen"]');
    var kWeit = fig.querySelector('[data-s="weiter"]');
    var liste = document.querySelectorAll("#notruf-schritte li");
    var motor = svg.querySelector("#b-motor");
    var wellen = svg.querySelector("#s-wellen");
    var nr = -1, laeuft = false, timer = null, anim = null;

    function fahren(pfade, fertig) {
      if (anim) cancelAnimationFrame(anim);
      if (ruhig) { var l = svg.querySelector("#" + pfade[pfade.length - 1]); var e = l.getPointAtLength(l.getTotalLength()); punkt.setAttribute("cx", e.x); punkt.setAttribute("cy", e.y); fertig && fertig(); return; }
      var i = 0, dauer = 1100, start = null;
      function schritt(t) {
        if (start === null) start = t;
        var pfad = svg.querySelector("#" + pfade[i]);
        var len = pfad.getTotalLength();
        var f = Math.min((t - start) / dauer, 1);
        var g = f < .5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
        var p = pfad.getPointAtLength(g * len);
        punkt.setAttribute("cx", p.x); punkt.setAttribute("cy", p.y);
        if (f < 1) { anim = requestAnimationFrame(schritt); }
        else if (++i < pfade.length) { start = null; anim = requestAnimationFrame(schritt); }
        else { anim = null; fertig && fertig(); }
      }
      anim = requestAnimationFrame(schritt);
    }

    function zeigen(n) {
      nr = n;
      var s = SCHRITTE[n];
      fig.classList.add("laeuft");
      svg.querySelectorAll(".s-pfad").forEach(function (p) { p.classList.toggle("an", s.pfade.indexOf(p.id) >= 0); });
      svg.querySelectorAll(".s-box").forEach(function (b) { b.classList.toggle("an", s.boxen.indexOf(b.id) >= 0); });
      liste.forEach(function (li, i) { li.classList.toggle("aktiv", i === n); });
      zaehler.textContent = "Schritt " + (n + 1) + " von " + SCHRITTE.length;
      text.textContent = s.text;
      motor.classList.remove("brummt"); wellen.classList.remove("an");
      punkt.classList.add("an");
      fahren(s.pfade, function () {
        if (s.brummt) { void motor.getBBox(); motor.classList.add("brummt"); }
        if (s.wellen) wellen.classList.add("an");
      });
      kZur.disabled = n <= 0;
      kWeit.disabled = n >= SCHRITTE.length - 1;
    }

    function stopp() {
      laeuft = false; clearTimeout(timer);
      kSpiel.textContent = "▶ Abspielen";
    }
    function naechster() {
      if (nr < SCHRITTE.length - 1) {
        zeigen(nr + 1);
        timer = setTimeout(naechster, ruhig ? 3500 : 3200);
      } else {
        stopp();
        kSpiel.textContent = "↺ Nochmal";
      }
    }
    kSpiel.addEventListener("click", function () {
      if (laeuft) { stopp(); return; }
      laeuft = true;
      kSpiel.textContent = "❚❚ Pause";
      if (nr >= SCHRITTE.length - 1) nr = -1;
      naechster();
    });
    kWeit.addEventListener("click", function () { stopp(); if (nr < SCHRITTE.length - 1) zeigen(nr + 1); });
    kZur.addEventListener("click", function () { stopp(); if (nr > 0) zeigen(nr - 1); });
  }

  function los() { blockbild(); spieler(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", los);
  else los();
})();
