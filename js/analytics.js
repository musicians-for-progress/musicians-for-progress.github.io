/**
 * Google Analytics (GA4) — optional, OFF by default.
 *
 *
 * This file is included on every page, but makes zero network requests
 * and does nothing until MEASUREMENT_ID is set — so enabling analytics
 * site-wide is a one-line, one-file change.
 */
(function () {
  const MEASUREMENT_ID = "G-54M8WNP26T";
  if (!MEASUREMENT_ID) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID);
})();
document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href*="donate.html"]');

  if (!link) return;

  window.trackEvent?.("donate_click", {
    link_text: link.textContent.trim(),
    link_url: link.href,
    source_page: window.location.pathname
  });
});