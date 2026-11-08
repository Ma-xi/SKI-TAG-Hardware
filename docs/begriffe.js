// Fachwörter erklären: Ein Wort mit data-erklaerung zeigt beim Antippen
// (oder mit der Maus darüber) ein kleines Kästchen mit der Erklärung.
(function () {
  var box = null, aktiv = null;

  function schliessen() {
    if (box) { box.remove(); box = null; }
    if (aktiv) { aktiv.setAttribute("aria-expanded", "false"); aktiv = null; }
  }

  function zeigen(w) {
    if (aktiv === w) { schliessen(); return; }
    schliessen();
    aktiv = w;
    w.setAttribute("aria-expanded", "true");
    box = document.createElement("div");
    box.className = "begriff-box";
    box.setAttribute("role", "tooltip");
    var t = document.createElement("strong");
    t.textContent = w.getAttribute("data-wort") || w.textContent;
    var p = document.createElement("span");
    p.textContent = w.getAttribute("data-erklaerung");
    box.appendChild(t);
    box.appendChild(p);
    document.body.appendChild(box);
    var r = w.getBoundingClientRect();
    var bw = box.offsetWidth, vw = document.documentElement.clientWidth;
    var x = Math.min(Math.max(8, r.left + window.scrollX), window.scrollX + vw - bw - 8);
    var y = r.bottom + window.scrollY + 6;
    if (r.bottom + box.offsetHeight + 12 > window.innerHeight && r.top > box.offsetHeight + 12) {
      y = r.top + window.scrollY - box.offsetHeight - 6;
    }
    box.style.left = x + "px";
    box.style.top = y + "px";
  }

  function los() {
    var woerter = document.querySelectorAll(".wort[data-erklaerung]");
    woerter.forEach(function (w) {
      w.setAttribute("tabindex", "0");
      w.setAttribute("role", "button");
      w.setAttribute("aria-expanded", "false");
      w.addEventListener("click", function (e) { e.stopPropagation(); zeigen(w); });
      w.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); zeigen(w); }
      });
      w.addEventListener("mouseenter", function () { if (window.matchMedia("(hover: hover)").matches && aktiv !== w) zeigen(w); });
      w.addEventListener("mouseleave", function () { if (window.matchMedia("(hover: hover)").matches && aktiv === w) schliessen(); });
    });
    document.addEventListener("click", schliessen);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") schliessen(); });
    window.addEventListener("resize", schliessen);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", los);
  else los();
})();
