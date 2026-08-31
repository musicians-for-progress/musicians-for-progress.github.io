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

  /**
   * The header floats transparently over a page's hero image (.hero or
   * .page-hero) and turns solid once that hero scrolls out of view, using
   * IntersectionObserver (cheap, no scroll-event polling). Pages with no
   * hero (e.g. 404) get a permanently solid header, with the <main>
   * pushed down to compensate for the header's fixed positioning.
   */
  function wireHeaderScrollState() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const heroEl = document.querySelector(".hero, .page-hero");
    const headerHeight = header.offsetHeight || 84;
    document.documentElement.style.setProperty("--header-height", headerHeight + "px");

    if (!heroEl) {
      header.classList.add("site-header--solid");
      const main = document.getElementById("main");
      if (main) main.classList.add("main--padded");
      return;
    }

    if (!("IntersectionObserver" in window)) {
      header.classList.add("site-header--solid"); // safe fallback
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          header.classList.toggle("site-header--solid", !entry.isIntersecting);
        });
      },
      { rootMargin: "-" + headerHeight + "px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(heroEl);
  }

  document.addEventListener("DOMContentLoaded", async function () {
    await Promise.all([
      include("site-header", "partials/header.html"),
      include("site-footer", "partials/footer.html"),
    ]);
    markActiveLink();
    wireMobileMenu();
    setCopyrightYear();
    wireHeaderScrollState();
  });
})();
