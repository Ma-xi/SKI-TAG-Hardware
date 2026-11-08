// Kapitel 5: Lineal im Größenvergleich verschieben (Maus, Finger, Pfeiltasten).
(function () {
  function los() {
    var g = document.getElementById("lineal");
    if (!g) return;
    var svg = g.ownerSVGElement;
    var dx = 0, dy = 0, start = null;
    var vb = svg.viewBox.baseVal;
    // Grenzen, damit das Lineal im Bild bleibt (Lineal ist 400 x 34, steht bei 20/540, Griff-Text darüber)
    function begrenzen() {
      dx = Math.max(-20, Math.min(vb.width - 420, dx));
      dy = Math.max(-520, Math.min(vb.height - 574, dy));
    }
    function setzen() {
      begrenzen();
      g.setAttribute("transform", "translate(" + dx + " " + dy + ")");
    }
    function punkt(e) {
      var p = svg.createSVGPoint();
      p.x = e.clientX; p.y = e.clientY;
      return p.matrixTransform(svg.getScreenCTM().inverse());
    }
    g.addEventListener("pointerdown", function (e) {
      var p = punkt(e);
      start = { x: p.x - dx, y: p.y - dy };
      g.setPointerCapture(e.pointerId);
      g.classList.add("zieht");
      e.preventDefault();
    });
    g.addEventListener("pointermove", function (e) {
      if (!start) return;
      var p = punkt(e);
      dx = p.x - start.x; dy = p.y - start.y;
      setzen();
    });
    function ende() { start = null; g.classList.remove("zieht"); }
    g.addEventListener("pointerup", ende);
    g.addEventListener("pointercancel", ende);
    g.addEventListener("keydown", function (e) {
      var s = e.shiftKey ? 40 : 8;
      if (e.key === "ArrowLeft") dx -= s;
      else if (e.key === "ArrowRight") dx += s;
      else if (e.key === "ArrowUp") dy -= s;
      else if (e.key === "ArrowDown") dy += s;
      else return;
      e.preventDefault();
      setzen();
    });
    var k = document.getElementById("lineal-zurueck");
    if (k) k.addEventListener("click", function () { dx = 0; dy = 0; setzen(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", los);
  else los();
})();
