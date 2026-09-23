/*
 * Orville site — content hydration.
 * Loads content.json and writes each field into the page as PLAIN TEXT
 * (textContent only — content can never inject HTML or scripts).
 * The HTML already contains the same copy as a fallback, so the page
 * works even if this script or content.json fails to load.
 */
(function () {
  "use strict";

  // selector → path into content.json (all values written via textContent)
  var MAP = {
    ".nav .brand-name": "site.name",
    ".nav-cta .btn:not(.primary)": "buttons.live_demo_nav",
    ".hero .eyebrow-text": "hero.eyebrow",
    ".hero h1": "hero.title",
    ".hero .sub-brand": "hero.sub_brand",
    ".hero .sub-main": "hero.sub_main",
    ".hero .sub-bold": "hero.sub_bold",

    "#why-now .sec-eyebrow": "why_now.eyebrow",
    "#why-now .sec-title": "why_now.title",
    "#why-now .sec-sub": "why_now.sub",
    "#why-now .src-note": "why_now.sources",

    "#problem .sec-eyebrow": "problem.eyebrow",
    "#problem .sec-title": "problem.title",
    "#problem .sec-sub": "problem.sub",
    "#problem .gap-note strong": "problem.gap_label",
    "#problem .gap-before": "problem.gap_before",
    "#problem .mono-q": "problem.gap_quote",
    "#problem .gap-after": "problem.gap_after",

    "#product .sec-eyebrow": "solution.eyebrow",
    "#product .sec-title": "solution.title",
    "#product .sec-sub": "solution.sub",
    "#product .aside-note strong": "solution.aside_bold",
    "#product .aside-tail": "solution.aside_tail",

    "#how .sec-eyebrow": "how.eyebrow",
    "#how .sec-title": "how.title",
    "#how .sec-sub": "how.sub",
    "#how .aside-note strong": "how.aside_bold",
    "#how .aside-tail": "how.aside_tail",

    "#payoff .sec-eyebrow": "payoff.eyebrow",
    "#payoff .sec-title": "payoff.title",
    "#payoff .sec-sub": "payoff.sub",
    "#payoff .po-col.sim .po-head": "payoff.sim_head",
    "#payoff .po-col.opt .po-head": "payoff.opt_head",
    "#payoff .po-lever strong": "payoff.lever_label",
    "#payoff .lever-tail": "payoff.lever_tail",

    "#team .sec-eyebrow": "team.eyebrow",
    "#team .sec-title": "team.title",
    "#team .sec-sub": "team.sub",

    ".final h2": "final_cta.title",
    ".final p": "final_cta.sub",

    "footer .foot-company": "footer.company",
    "footer .foot-location": "footer.location",
    "footer .foot-copyright": "footer.copyright"
  };

  function get(obj, path) {
    return path.split(".").reduce(function (o, k) {
      return o == null ? undefined : o[k];
    }, obj);
  }

  function setText(el, value) {
    if (el && typeof value === "string" && value.length) el.textContent = value;
  }

  function setAll(sel, value) {
    document.querySelectorAll(sel).forEach(function (el) { setText(el, value); });
  }

  function hydrate(c) {
    Object.keys(MAP).forEach(function (sel) {
      setAll(sel, get(c, MAP[sel]));
    });

    // Repeated blocks (fixed slots — extra JSON entries beyond the markup are ignored)
    function slots(sel, items, fields) {
      if (!Array.isArray(items)) return;
      document.querySelectorAll(sel).forEach(function (el, i) {
        var item = items[i];
        if (!item) return;
        Object.keys(fields).forEach(function (childSel) {
          setText(el.querySelector(childSel), item[fields[childSel]]);
        });
      });
    }

    slots("#why-now .stat", c.why_now && c.why_now.stats, { ".num": "num", ".cap": "cap" });
    slots("#problem .cas-step", c.problem && c.problem.cascade, { ".idx": "idx", ".t": "title", ".d": "desc" });
    slots("#product .card", c.solution && c.solution.cards, { ".step-num": "step", "h3": "title", "p": "desc" });
    slots("#how .step", c.how && c.how.steps, { ".k": "k", "h4": "title", "p": "desc" });
    slots("#payoff .po-col.sim .po-row", c.payoff && c.payoff.sim_rows, { "span:first-child": "label", ".v": "value" });
    slots("#payoff .po-col.opt .po-row", c.payoff && c.payoff.opt_rows, { "span:first-child": "label", ".v": "value" });
    slots("#team .founder", c.team && c.team.founders, {
      ".avatar": "initials", "h3": "name", ".role": "role", ".bio": "bio", ".tags": "tags"
    });

    // Trust badges (rebuilt as text spans + separators)
    var badges = c.hero && c.hero.trust_badges;
    if (Array.isArray(badges) && badges.length) {
      document.querySelectorAll(".hero .trust-row").forEach(function (row) {
        row.textContent = "";
        badges.forEach(function (b, i) {
          if (i > 0) {
            var sep = document.createElement("span");
            sep.className = "sep";
            sep.textContent = "·";
            row.appendChild(sep);
          }
          var s = document.createElement("span");
          s.textContent = String(b);
          row.appendChild(s);
        });
      });
    }

    // Buttons with icons keep their arrow SVG; only the label span changes
    document.querySelectorAll(".btn .btn-label").forEach(function (el) {
      setText(el, c.buttons && c.buttons.live_demo);
    });
    document.querySelectorAll(".btn.primary").forEach(function (el) {
      if (el.textContent.trim() === "Book a demo") setText(el, c.buttons && c.buttons.book_demo);
    });

    // Contact email → mailto links (validated; always rendered as mailto:)
    var email = c.site && c.site.contact_email;
    if (typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      var subject = (c.site && c.site.email_subject) || "";
      var href = "mailto:" + email + (subject ? "?subject=" + encodeURIComponent(subject) : "");
      document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
        a.setAttribute("href", href);
      });
    }

    document.title = ((c.site && c.site.name) || "Orville AI") + " — Disruption Intelligence for Airline Operations";
  }

  fetch("content.json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(hydrate)
    .catch(function () { /* fall back to the copy baked into the HTML */ });
})();
