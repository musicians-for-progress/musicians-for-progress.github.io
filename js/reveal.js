/**
 * Lightweight scroll-reveal: adds .is-visible to any element with
 * data-reveal once it scrolls into view, using IntersectionObserver
 * (efficient — no scroll-event polling, no library).
 *
 * Usage: add data-reveal to an element that also has the .reveal class
 * in its markup. Respects prefers-reduced-motion via the global CSS rule
 * in style.css, which zeroes out the transition duration.
 */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el) { observer.observe(el); });
  });
})();
