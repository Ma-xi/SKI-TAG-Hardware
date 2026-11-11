// Kapitel 7: Schaltplan Schritt für Schritt aufbauen.
(function () {
  function los() {
    var svg = document.querySelector("svg.sp");
    var liste = document.getElementById("s-liste");
    if (!svg || !liste) return;
    var schritte = Array.prototype.slice.call(liste.querySelectorAll(".schritt"));
    var punkte = document.getElementById("s-punkte");
    var zurueck = document.getElementById("s-zurueck");
    var weiter = document.getElementById("s-weiter");
    var rollen = document.getElementById("sp-rollen");
    var ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var jetzt = 0;
    svg.classList.add("schritte");
    schritte.forEach(function () { punkte.appendChild(document.createElement("i")); });

    function zeige(n) {
      jetzt = Math.max(0, Math.min(schritte.length - 1, n));
      var sichtbar = {}, neu = schritte[jetzt].getAttribute("data-g");
      var alle = neu === "alle";
      schritte.forEach(function (s, i) {
        s.hidden = i !== jetzt;
        if (i <= jetzt) sichtbar[s.getAttribute("data-g")] = true;
      });
      svg.querySelectorAll("g[data-g]").forEach(function (g) {
        var name = g.getAttribute("data-g");
        g.classList.toggle("da", alle || !!sichtbar[name]);
        g.classList.toggle("neu", !alle && name === neu);
      });
      punkte.querySelectorAll("i").forEach(function (p, i) {
        p.classList.toggle("da", i < jetzt);
        p.classList.toggle("jetzt", i === jetzt);
      });
      zurueck.disabled = jetzt === 0;
      document.querySelectorAll('[data-schritt="-1"]').forEach(function (k) { k.disabled = jetzt === 0; });
      document.querySelectorAll('[data-schritt="1"]').forEach(function (k) { k.textContent = jetzt === schritte.length - 1 ? "Von vorne" : "Weiter →"; });
      weiter.textContent = jetzt === schritte.length - 1 ? "Von vorne" : "Weiter →";
      // am Handy: das neue Teil in den sichtbaren Bereich schieben
      if (!alle && rollen && rollen.scrollWidth > rollen.clientWidth) {
        var gs = svg.querySelectorAll('g.neu');
        if (gs.length) {
          var r = gs[0].getBoundingClientRect(), c = rollen.getBoundingClientRect();
          rollen.scrollBy({ left: r.left + r.width / 2 - (c.left + c.width / 2), behavior: ruhig ? "auto" : "smooth" });
        }
      }
    }
    weiter.addEventListener("click", function () { zeige(jetzt === schritte.length - 1 ? 0 : jetzt + 1); });
    document.querySelectorAll("[data-schritt]").forEach(function (k) {
      k.addEventListener("click", function () {
        var d = Number(k.getAttribute("data-schritt"));
        zeige(d > 0 && jetzt === schritte.length - 1 ? 0 : jetzt + d);
        svg.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "start" });
      });
    });
    zurueck.addEventListener("click", function () { zeige(jetzt - 1); });
    zeige(0);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", los);
  else los();
})();
