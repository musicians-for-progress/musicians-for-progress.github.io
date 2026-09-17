/**
 * Homepage email sign-up form.
 *   1. Create account at https://formspree.io
 *   2. Create a form and copy its endpoint URL (looks like
 *      https://formspree.io/f/xxxxxxxx)
 *   3. Paste it into FORM_ENDPOINT below
 */
(function () {
  const FORM_ENDPOINT = ""; // TODO: paste your Formspree (or similar) endpoint here

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("newsletter-form");
    if (!form) return;
    const status = document.getElementById("newsletter-status");
    const submitBtn = form.querySelector("button[type=submit]");

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!FORM_ENDPOINT) {
        status.textContent = "Sign-ups aren't connected yet: please check back soon.";
        return;
      }

      submitBtn.disabled = true;
      status.textContent = "Sending...";
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (res.ok) {
          form.reset();
          status.textContent = "Thanks for signing up!";
        } else {
          status.textContent = "Something went wrong: please try again.";
        }
      } catch (err) {
        status.textContent = "Something went wrong: please try again.";
      } finally {
        submitBtn.disabled = false;
      }
    });
  });
})();
