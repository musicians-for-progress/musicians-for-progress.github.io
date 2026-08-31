/**
 * Injects the shared header/footer partials (partials/header.html and
 * partials/footer.html) into every page, then wires up the small behaviors
 * that depend on them: the mobile menu toggle, marking the current page's
 * nav link, and the footer's copyright year.
 *
 * IMPORTANT — local preview: fetch() cannot load local files over a
 * file:// URL (browser security), so double-clicking an .html file will
 * show a page with no header/footer. Serve the folder over http instead:
 *
 *   python3 -m http.server 8000
 *
 * then open http://localhost:8000 in your browser. This is only a local-
 * preview detail — it works normally once GitHub Pages is serving the
 * site over https.
 *
 * If JavaScript is unavailable, each page falls back to the plain
 * <noscript> nav already included in its markup, so the site still works.
 */
(function () {
  async function include(mountId, path) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(path + " responded with " + res.status);
      mount.innerHTML = await res.text();
    } catch (err) {
      console.error("Could not load " + path + ":", err);
      // Leave the <noscript> fallback content (already in the page) in place.
    }
  }

  function markActiveLink() {
    const page = document.body.getAttribute("data-page");
    if (!page) return;
    document.querySelectorAll("[data-nav-link]").forEach(function (a) {
      if (a.getAttribute("data-nav-link") === page) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  function wireMobileMenu() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("primaryNav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the mobile menu after a link is chosen.
    nav.querySelectorAll(".nav-list > li > a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setCopyrightYear() {
    const el = document.getElementById("copyrightYear");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", async function () {
    await Promise.all([
      include("site-header", "partials/header.html"),
      include("site-footer", "partials/footer.html"),
    ]);
    markActiveLink();
    wireMobileMenu();
    setCopyrightYear();
  });
})();
