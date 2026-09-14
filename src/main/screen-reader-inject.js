if (!window.__ai11yScreenReader) {
  window.__ai11yScreenReader = true;

  var TAG_ROLES = {
    a: "link",
    button: "button",
    input: "textbox",
    select: "combobox",
    textarea: "textbox",
    img: "image",
    nav: "navigation",
    main: "main",
    aside: "complementary",
    header: "banner",
    footer: "contentinfo",
    form: "form",
    table: "table",
    ul: "list",
    ol: "list",
    li: "listitem",
    h1: "heading",
    h2: "heading",
    h3: "heading",
    h4: "heading",
    h5: "heading",
    h6: "heading",
  };

  function getImplicitRole(el) {
    var tag = el.tagName.toLowerCase();
    if (tag === "a" && el.hasAttribute("href")) return "link";
    if (tag === "input") {
      var t = (el.getAttribute("type") || "text").toLowerCase();
      if (t === "checkbox") return "checkbox";
      if (t === "radio") return "radio";
      if (t === "submit" || t === "button" || t === "reset") return "button";
      if (t === "range") return "slider";
      if (t === "search") return "searchbox";
      return "textbox";
    }
    return TAG_ROLES[tag] || null;
  }

  function getManualName(el) {
    var label = el.getAttribute("aria-label");
    if (label) return label;
    var labelledBy = el.getAttribute("aria-labelledby");
    if (labelledBy) {
      var parts = labelledBy
        .split(/\s+/)
        .map(function (id) {
          var ref = document.getElementById(id);
          return ref ? ref.textContent.trim() : "";
        })
        .filter(Boolean);
      if (parts.length) return parts.join(" ");
    }
    if (el.alt) return el.alt;
    if (el.title) return el.title;
    if (el.placeholder) return el.placeholder;
    var text = el.textContent || "";
    text = text.trim().substring(0, 150);
    return text || null;
  }

  document.addEventListener("focusin", function (e) {
    var el = e.target;
    if (!el || !el.tagName) return;
    var tag = el.tagName.toLowerCase();

    var computedRole = el.computedRole || null;
    var computedName = el.computedName || null;

    var manualRole = el.getAttribute("role") || getImplicitRole(el);
    var manualName = getManualName(el);

    var level = null;
    var match = tag.match(/^h([1-6])$/);
    if (match) level = parseInt(match[1]);

    window.parent.postMessage(
      {
        type: "ai11y:screen-reader",
        role: computedRole || manualRole || tag,
        name: computedName || manualName || null,
        tag: tag,
        href: el.href || null,
        level: level,
        inputType:
          tag === "input" ? el.getAttribute("type") || "text" : null,
        hasComputed: !!(computedRole || computedName),
      },
      "*",
    );
  });
}
true;
