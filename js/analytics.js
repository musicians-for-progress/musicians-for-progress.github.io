/**
 * Google Analytics (GA4) — optional, OFF by default.
 *
 *   1. Create a GA4 property at https://analytics.google.com
 *   2. Copy its Measurement ID (looks like "G-XXXXXXXXXX")
 *   3. Paste it into MEASUREMENT_ID below
 *
 * This file is included on every page, but makes zero network requests
 * and does nothing until MEASUREMENT_ID is set — so enabling analytics
 * site-wide is a one-line, one-file change.
 */
(function () {
  const MEASUREMENT_ID = ""; // TODO: paste your GA4 Measurement ID here, e.g. "G-XXXXXXXXXX"
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
