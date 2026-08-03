/* Syllabus Library — progressive enhancement only.
   Every page must be fully usable with JavaScript disabled. */

(function () {
  "use strict";

  /* 1. Module rail: highlight the module currently in view. */
  var rail = document.querySelector(".rail-list");
  var modules = document.querySelectorAll(".module[id]");
  if (rail && modules.length && "IntersectionObserver" in window) {
    var items = {};
    rail.querySelectorAll('a[href^="#"]').forEach(function (a) {
      items[a.getAttribute("href").slice(1)] = a.closest(".rail-item");
    });
    var seen = new Set();
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { seen.add(e.target.id); } else { seen.delete(e.target.id); }
        });
        Object.keys(items).forEach(function (id) {
          items[id].classList.toggle("is-active", seen.has(id));
        });
      },
      { rootMargin: "-10% 0px -70% 0px" }
    );
    modules.forEach(function (m) { observer.observe(m); });
  }

  /* 2. Catalog filter on the index page. */
  var input = document.querySelector(".filter input");
  if (input) {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
    var count = document.querySelector(".filter-count");
    var total = cards.length;
    var render = function () {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var hit = !q || card.textContent.toLowerCase().indexOf(q) !== -1;
        card.hidden = !hit;
        if (hit) shown++;
      });
      document.querySelectorAll(".cat-group").forEach(function (g) {
        g.hidden = !g.querySelector(".card:not([hidden])");
      });
      if (count) count.textContent = shown + " of " + total + " topics";
    };
    input.addEventListener("input", render);
    render();
  }
})();