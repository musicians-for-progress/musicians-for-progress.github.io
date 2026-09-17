/**
 * Loads data/events.json and renders event listings. Used on both
 * index.html (a short "upcoming" preview) and events.html (the full
 * upcoming + past list).
 *
 * To add, edit, or remove an event: edit data/events.json directly (works
 * fine from GitHub.com's web editor — no local setup needed). Events are
 * sorted and split into "upcoming" vs. "past" automatically by comparing
 * each event's date to the current date, so nothing needs to be
 * re-categorized by hand as time passes.
 */
(function () {
  async function loadEvents() {
    try {
      const res = await fetch("data/events.json");
      if (!res.ok) throw new Error("events.json responded with " + res.status);
      return await res.json();
    } catch (err) {
      console.error("Could not load data/events.json:", err);
      return [];
    }
  }

  function splitUpcomingPast(events) {
    const now = new Date();
    const upcoming = [];
    const past = [];
    events.forEach(function (e) {
      (new Date(e.date) >= now ? upcoming : past).push(e);
    });
    upcoming.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
    past.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    return { upcoming: upcoming, past: past };
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      day: d.toLocaleDateString("en-US", { day: "numeric" }),
      full: d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    };
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function eventCard(e, isPast) {
    const f = formatDate(e.date);
    const metaBits = [f.full];
    if (e.location) metaBits.push(e.location);
    return (
      '<li class="event-card' + (isPast ? " event-card--past" : "") + '">' +
        '<div class="event-card__date">' +
          '<span class="event-card__month">' + escapeHtml(f.month) + "</span>" +
          '<span class="event-card__day">' + escapeHtml(f.day) + "</span>" +
        "</div>" +
        '<div class="event-card__body">' +
          "<h3>" + escapeHtml(e.title) + "</h3>" +
          '<p class="event-card__meta">' + escapeHtml(metaBits.join(" \u00b7 ")) + "</p>" +
          (e.description ? "<p>" + escapeHtml(e.description) + "</p>" : "") +
        "</div>" +
      "</li>"
    );
  }

  const EMPTY_STATE =
    '<p class="empty-state">No events at the moment — check back soon, or follow ' +
    '<a class="text-link" href="https://www.instagram.com/musiciansforprogress/" target="_blank" rel="noopener">@musiciansforprogress</a> on Instagram for updates.</p>';

  async function renderHomePreview() {
    const mount = document.getElementById("home-events");
    if (!mount) return;
    const events = await loadEvents();
    const upcoming = splitUpcomingPast(events).upcoming;
    mount.innerHTML = upcoming.length
      ? '<ul class="event-list">' + upcoming.slice(0, 2).map(function (e) { return eventCard(e, false); }).join("") + "</ul>"
      : EMPTY_STATE;
  }

  async function renderEventsPage() {
    const upcomingMount = document.getElementById("upcoming-events");
    const pastMount = document.getElementById("past-events");
    if (!upcomingMount && !pastMount) return;

    const events = await loadEvents();
    const split = splitUpcomingPast(events);

    if (upcomingMount) {
      upcomingMount.innerHTML = split.upcoming.length
        ? '<ul class="event-list">' + split.upcoming.map(function (e) { return eventCard(e, false); }).join("") + "</ul>"
        : EMPTY_STATE;
    }
    if (pastMount) {
      pastMount.innerHTML = split.past.length
        ? '<ul class="event-list event-list--past">' + split.past.map(function (e) { return eventCard(e, true); }).join("") + "</ul>"
        : '<p class="empty-state">No past events yet.</p>';
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderHomePreview();
    renderEventsPage();
  });
})();
