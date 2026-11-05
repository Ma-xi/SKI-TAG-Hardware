// Sprungmarken: Liste aller Abschnitte einer Kapitelseite.
// Computer: Leiste rechts, wandert beim Scrollen mit und zeigt, wo man gerade ist.
// Handy: Knopf "Springen" unten rechts öffnet die Liste.
(function () {
  function bauen() {
    var blatt = document.querySelector(".blatt");
    var titel = document.querySelectorAll(".abschnitt > header h2[id]");
    if (!blatt || titel.length < 2) return;

    var nav = document.createElement("nav");
    nav.className = "sprung";
    nav.id = "sprung";
    nav.setAttribute("aria-label", "Abschnitte dieser Seite");
    var kopf = document.createElement("p");
    kopf.className = "mono sprung-kopf";
    kopf.textContent = "AUF DIESER SEITE";
    nav.appendChild(kopf);

    var liste = document.createElement("ol");
    var links = [];
    titel.forEach(function (h) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      liste.appendChild(li);
      links.push({ a: a, h: h });
    });
    nav.appendChild(liste);

    var oben = document.createElement("a");
    oben.href = "#";
    oben.className = "mono sprung-oben";
    oben.textContent = "↑ nach oben";
    nav.appendChild(oben);

    blatt.appendChild(nav);
    blatt.classList.add("mit-sprung");
    nav.style.gridRow = "1 / span " + (blatt.children.length - 1);

    // Handy: Knopf zum Öffnen
    var knopf = document.createElement("button");
    knopf.type = "button";
    knopf.className = "sprung-knopf mono";
    knopf.setAttribute("aria-controls", "sprung");
    knopf.setAttribute("aria-expanded", "false");
    knopf.textContent = "Springen";
    document.body.appendChild(knopf);

    function zu() {
      nav.classList.remove("offen");
      knopf.setAttribute("aria-expanded", "false");
      knopf.textContent = "Springen";
    }
    knopf.addEventListener("click", function () {
      var auf = !nav.classList.contains("offen");
      nav.classList.toggle("offen", auf);
      knopf.setAttribute("aria-expanded", auf ? "true" : "false");
      knopf.textContent = auf ? "Schließen" : "Springen";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") zu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") zu();
    });

    // Aktuellen Abschnitt hervorheben
    if ("IntersectionObserver" in window) {
      var sichtbar = new Map();
      var obs = new IntersectionObserver(function (eintraege) {
        eintraege.forEach(function (e) { sichtbar.set(e.target, e.isIntersecting); });
        var aktiv = null;
        links.forEach(function (l) {
          var sec = l.h.closest(".abschnitt");
          if (!aktiv && sichtbar.get(sec)) aktiv = l;
        });
        links.forEach(function (l) {
          if (l === aktiv) l.a.setAttribute("aria-current", "true");
          else l.a.removeAttribute("aria-current");
        });
      }, { rootMargin: "-20% 0px -55% 0px" });
      links.forEach(function (l) { obs.observe(l.h.closest(".abschnitt")); });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bauen);
  else bauen();
})();
