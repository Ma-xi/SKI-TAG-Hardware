// Ansicht-Schalter: automatisch (wie das Gerät), hell oder dunkel.
// Die Wahl gilt für alle Seiten des Werkstattbuchs und wird im Browser gemerkt.
(function () {
  var KEY = "skitag-ansicht";
  var STUFEN = ["auto", "hell", "dunkel"];
  var NAMEN = { auto: "Automatisch", hell: "Hell", dunkel: "Dunkel" };

  function lesen() {
    try { var w = localStorage.getItem(KEY); return STUFEN.indexOf(w) >= 0 ? w : "auto"; }
    catch (e) { return "auto"; }
  }
  function speichern(w) {
    try { localStorage.setItem(KEY, w); } catch (e) {}
  }
  function anwenden(w) {
    var root = document.documentElement;
    if (w === "hell") root.setAttribute("data-theme", "light");
    else if (w === "dunkel") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
  }

  var aktuell = lesen();
  anwenden(aktuell); // sofort, damit die Seite nicht kurz in der falschen Farbe aufblitzt

  function knopfBauen() {
    var k = document.querySelector(".thema");
    if (!k) return;
    function zeigen() {
      k.textContent = "Ansicht: " + NAMEN[aktuell];
      k.setAttribute("aria-label", "Ansicht wechseln, gerade: " + NAMEN[aktuell]);
    }
    k.addEventListener("click", function () {
      aktuell = STUFEN[(STUFEN.indexOf(aktuell) + 1) % STUFEN.length];
      anwenden(aktuell);
      speichern(aktuell);
      zeigen();
    });
    zeigen();
    k.hidden = false;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", knopfBauen);
  else knopfBauen();
})();
