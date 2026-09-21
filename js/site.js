/*!
 * Winetime Asia — shared site behavior
 * Injects header/footer, wires navigation, carousels, forms, PWA install
 * and service-worker registration. No build step, no dependencies.
 */
(function () {
  "use strict";

  var SHOP_URL = "https://winetime-asia.odoo.com/shop";
  var PHONE = "+855 85 31 32 03";
  var PHONE_HREF = "tel:+855853132 03".replace(/\s/g, "");
  var EMAIL = "sale@winetime.asia";

  /* ------------------------------------------------------------------ */
  /* Icons (inline SVG strings, stroke-based, brand-neutral)             */
  /* ------------------------------------------------------------------ */
  var ICON = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    external: '<svg class="icon-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2.1z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M3 6l9 7 9-7"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C16.3 3.6 12 3.6 12 3.6h0s-4.3 0-7.3.3c-.4 0-1.4.1-2.3 1-.7.7-.9 2.3-.9 2.3S1.2 9 1.2 10.9v2.1c0 1.9.3 3.7.3 3.7s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.1.3 7.1.3s4.3 0 7.3-.3c.4 0 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.3-1.8.3-3.7v-2.1c0-1.9-.3-3.7-.3-3.7zM9.8 14.9V8.9l5.7 3-5.7 3z"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21 7H6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
  };

  /* ------------------------------------------------------------------ */
  /* Navigation model (single source of truth for header + drawer)       */
  /* ------------------------------------------------------------------ */
  var NAV = [
    { key: "home", label: "Home", href: "index.html" },
    { key: "shop", label: "Shop", href: SHOP_URL, external: true, shop: true },
    { key: "event", label: "Event &amp; Wedding", href: "event-wedding.html" },
    { key: "bar", label: "Bar &agrave; Vin", href: "bar-a-vin.html" },
    { key: "about", label: "About", href: "about.html" },
    { key: "communities", label: "Communities", children: [
      { key: "blog", label: "Blog", href: "blog.html" },
      { key: "forum", label: "Forum", href: "forum.html" }
    ] },
    { key: "contact", label: "Contact us", href: "contact.html" }
  ];

  function extAttrs() {
    return ' target="_blank" rel="noopener"';
  }

  function renderDesktopNav(current) {
    return NAV.map(function (item) {
      if (item.children) {
        var open = item.children.some(function (c) { return c.key === current; });
        return (
          '<li class="dropdown">' +
            '<button type="button" class="nav-link' + (open ? " active" : "") + '" aria-haspopup="true">' +
              item.label + ICON.chevron +
            "</button>" +
            '<ul class="dropdown-menu">' +
              item.children.map(function (c) {
                return '<li><a href="' + c.href + '"' + (c.key === current ? ' aria-current="page"' : "") + ">" + c.label + "</a></li>";
              }).join("") +
            "</ul>" +
          "</li>"
        );
      }
      var isActive = item.key === current;
      var isShop = item.shop ? " nav-link--shop" : "";
      var ext = item.external ? extAttrs() : "";
      var icon = item.external ? ICON.external : "";
      return (
        '<li><a class="' + (isActive ? "active" : "") + isShop + '" href="' + item.href + '"' + ext +
        (isActive ? ' aria-current="page"' : "") +
        (item.external ? ' aria-label="' + item.label.replace(/&amp;/g, "&") + ' (opens the official Winetime shop in a new tab)"' : "") +
        ">" + item.label + icon + "</a></li>"
      );
    }).join("");
  }

  function renderMobileNav(current) {
    return NAV.map(function (item) {
      if (item.children) {
        var open = item.children.some(function (c) { return c.key === current; });
        return (
          '<li>' +
            '<button type="button" class="js-sub-toggle" aria-expanded="' + open + '">' + item.label + ICON.chevron + "</button>" +
            '<ul class="sub-links' + (open ? " open" : "") + '">' +
              item.children.map(function (c) {
                return '<li><a href="' + c.href + '"' + (c.key === current ? ' aria-current="page"' : "") + ">" + c.label + "</a></li>";
              }).join("") +
            "</ul>" +
          "</li>"
        );
      }
      var ext = item.external ? extAttrs() : "";
      var icon = item.external ? ICON.external : "";
      return '<li><a href="' + item.href + '"' + ext + (item.key === current ? ' aria-current="page"' : "") + ">" + item.label + icon + "</a></li>";
    }).join("");
  }

  function headerHTML(current) {
    return (
      '<nav class="nav" aria-label="Main">' +
        '<div class="container">' +
          '<a class="brand" href="index.html">' +
            '<span class="brand-mark" aria-hidden="true">W</span>' +
            "wine<small>time</small>" +
          "</a>" +
          '<ul class="nav-links">' + renderDesktopNav(current) + "</ul>" +
          '<div class="nav-actions">' +
            '<a class="icon-btn desktop-only" href="' + PHONE_HREF + '" aria-label="Call Winetime Asia">' + ICON.phone + "</a>" +
            '<a class="icon-btn" href="' + SHOP_URL + '"' + extAttrs() + ' aria-label="Open the Winetime shop">' + ICON.cart + "</a>" +
            '<button type="button" class="icon-btn hamburger" id="menu-open" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-drawer">' + ICON.menu + "</button>" +
          "</div>" +
        "</div>" +
      "</nav>" +
      '<div class="mobile-drawer" id="mobile-drawer">' +
        '<div class="mobile-drawer__scrim" data-close-drawer></div>' +
        '<div class="mobile-drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">' +
          '<div class="mobile-drawer__head">' +
            '<a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true">W</span>wine<small>time</small></a>' +
            '<button type="button" class="icon-btn" id="menu-close" aria-label="Close menu">' + ICON.close + "</button>" +
          "</div>" +
          '<nav><ul>' + renderMobileNav(current) + "</ul></nav>" +
          '<a class="btn btn-primary" href="' + SHOP_URL + '"' + extAttrs() + ">Shop the collection " + ICON.external + "</a>" +
          '<a class="btn btn-outline" href="' + PHONE_HREF + '">' + ICON.phone + " " + PHONE + "</a>" +
        "</div>" +
      "</div>"
    );
  }

  function footerHTML() {
    var year = new Date().getFullYear();
    return (
      '<div class="container footer-top">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            "<h2>We are Winetime&hellip;</h2>" +
            "<blockquote>Winetime Cambodia is your official distributor of quality wines and spirits, proudly offering an unparalleled range of products paired with the best service, every time.</blockquote>" +
            '<div class="footer-social">' +
              '<a href="https://www.facebook.com/" aria-label="Winetime on Facebook"' + extAttrs() + ">" + ICON.fb + "</a>" +
              '<a href="https://www.instagram.com/" aria-label="Winetime on Instagram"' + extAttrs() + ">" + ICON.ig + "</a>" +
              '<a href="https://www.youtube.com/" aria-label="Winetime on YouTube"' + extAttrs() + ">" + ICON.yt + "</a>" +
            "</div>" +
          "</div>" +
          '<div class="footer-col">' +
            "<h4>Explore</h4>" +
            "<ul>" +
              '<li><a href="index.html">Home</a></li>' +
              '<li><a href="about.html">About us</a></li>' +
              '<li><a href="event-wedding.html">Event &amp; Wedding</a></li>' +
              '<li><a href="bar-a-vin.html">Bar &agrave; Vin</a></li>' +
            "</ul>" +
          "</div>" +
          '<div class="footer-col">' +
            "<h4>Community</h4>" +
            "<ul>" +
              '<li><a href="blog.html">Blog</a></li>' +
              '<li><a href="forum.html">Forum</a></li>' +
              '<li><a href="' + SHOP_URL + '"' + extAttrs() + ">Shop the collection " + ICON.external + "</a></li>" +
              '<li><a href="contact.html">Contact us</a></li>' +
            "</ul>" +
          "</div>" +
          '<div class="footer-col">' +
            "<h4>Get in touch</h4>" +
            '<ul class="footer-contact">' +
              '<li>' + ICON.phone + '<a href="' + PHONE_HREF + '">' + PHONE + "</a></li>" +
              '<li>' + ICON.mail + '<a href="mailto:' + EMAIL + '">' + EMAIL + "</a></li>" +
              '<li>' + ICON.pin + "<span>Phnom Penh, Cambodia</span></li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="container footer-bottom">' +
        "<span>&copy; " + year + " Winetime Asia &mdash; Sarapich PIN. All rights reserved.</span>" +
        '<div style="display:flex;gap:18px;">' +
          '<a href="cookie-policy.html">Cookie Policy</a>' +
          '<a href="#top">Back to top</a>' +
        "</div>" +
      "</div>"
    );
  }

  /* ------------------------------------------------------------------ */
  /* Mount header/footer                                                 */
  /* ------------------------------------------------------------------ */
  function mountChrome() {
    var current = document.body.getAttribute("data-page") || "";
    var headerEl = document.getElementById("site-header");
    var footerEl = document.getElementById("site-footer");
    if (headerEl) headerEl.innerHTML = headerHTML(current);
    if (footerEl) footerEl.innerHTML = footerHTML();
  }

  /* ------------------------------------------------------------------ */
  /* Mobile drawer                                                       */
  /* ------------------------------------------------------------------ */
  function initDrawer() {
    var drawer = document.getElementById("mobile-drawer");
    var openBtn = document.getElementById("menu-open");
    var closeBtn = document.getElementById("menu-close");
    if (!drawer || !openBtn) return;

    function open() {
      drawer.classList.add("open");
      openBtn.setAttribute("aria-expanded", "true");
      document.documentElement.style.overflow = "hidden";
    }
    function close() {
      drawer.classList.remove("open");
      openBtn.setAttribute("aria-expanded", "false");
      document.documentElement.style.overflow = "";
    }
    openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    drawer.querySelectorAll("[data-close-drawer]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    drawer.querySelectorAll(".js-sub-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var list = btn.nextElementSibling;
        var isOpen = list.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(isOpen));
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Generic auto-rotating slider (hero + quotes)                        */
  /* ------------------------------------------------------------------ */
  function initSlider(rootSelector, slideSelector, dotsSelector, interval) {
    var root = document.querySelector(rootSelector);
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll(slideSelector));
    var dotsWrap = root.querySelector(dotsSelector) || document.querySelector(dotsSelector);
    if (slides.length < 2) return;
    var index = 0;
    var timer;

    if (dotsWrap) {
      dotsWrap.innerHTML = slides.map(function (_, i) {
        return '<button type="button" aria-label="Go to slide ' + (i + 1) + '"' + (i === 0 ? ' class="is-active"' : "") + "></button>";
      }).join("");
    }
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];

    function show(i) {
      slides[index].classList.remove("is-active");
      if (dots[index]) dots[index].classList.remove("is-active");
      index = (i + slides.length) % slides.length;
      slides[index].classList.add("is-active");
      if (dots[index]) dots[index].classList.add("is-active");
    }
    function next() { show(index + 1); }
    function restart() {
      clearInterval(timer);
      timer = setInterval(next, interval || 5500);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { show(i); restart(); });
    });
    restart();
  }

  /* ------------------------------------------------------------------ */
  /* Horizontal product carousels                                        */
  /* ------------------------------------------------------------------ */
  function initCarousels() {
    document.querySelectorAll("[data-carousel]").forEach(function (wrap) {
      var track = wrap.querySelector(".carousel-track");
      var prev = wrap.querySelector("[data-prev]");
      var next = wrap.querySelector("[data-next]");
      if (!track) return;
      var pos = 0;
      function step() {
        var card = track.firstElementChild;
        if (!card) return 0;
        var style = getComputedStyle(track);
        var gap = parseFloat(style.gap || 24);
        return card.getBoundingClientRect().width + gap;
      }
      function maxScroll() {
        return Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
      }
      function update() {
        track.style.transform = "translateX(" + (-pos) + "px)";
        if (prev) prev.disabled = pos <= 0;
        if (next) next.disabled = pos >= maxScroll() - 2;
      }
      if (next) next.addEventListener("click", function () {
        pos = Math.min(maxScroll(), pos + step() * 2);
        update();
      });
      if (prev) prev.addEventListener("click", function () {
        pos = Math.max(0, pos - step() * 2);
        update();
      });
      window.addEventListener("resize", update);
      update();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Wine finder (interactive filter -> deep link into the real shop)    */
  /* ------------------------------------------------------------------ */
  function initFinder() {
    var finder = document.querySelector("[data-finder]");
    if (!finder) return;
    var chips = finder.querySelectorAll(".chip");
    var resultEl = finder.querySelector("[data-finder-result]");
    var goBtn = finder.querySelector("[data-finder-go]");
    var selections = {};

    function refresh() {
      var terms = Object.keys(selections).map(function (k) { return selections[k]; }).filter(Boolean);
      if (resultEl) {
        resultEl.innerHTML = terms.length
          ? "Searching for <strong>" + terms.join(", ") + "</strong> in the shop"
          : "Pick a style to narrow down the shop search &mdash; or browse everything.";
      }
    }
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var group = chip.getAttribute("data-group");
        var pressed = chip.getAttribute("aria-pressed") === "true";
        finder.querySelectorAll('.chip[data-group="' + group + '"]').forEach(function (c) {
          c.setAttribute("aria-pressed", "false");
        });
        if (!pressed) {
          chip.setAttribute("aria-pressed", "true");
          selections[group] = chip.textContent.trim();
        } else {
          delete selections[group];
        }
        refresh();
      });
    });
    if (goBtn) {
      goBtn.addEventListener("click", function () {
        var terms = Object.keys(selections).map(function (k) { return selections[k]; });
        var url = SHOP_URL + (terms.length ? "?search=" + encodeURIComponent(terms.join(" ")) : "");
        window.open(url, "_blank", "noopener");
      });
    }
    refresh();
  }

  /* ------------------------------------------------------------------ */
  /* Reveal on scroll                                                     */
  /* ------------------------------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* Back to top                                                         */
  /* ------------------------------------------------------------------ */
  function initBackToTop() {
    var btn = document.createElement("button");
    btn.className = "back-to-top";
    btn.type = "button";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = ICON.up;
    document.body.appendChild(btn);
    window.addEventListener("scroll", function () {
      btn.classList.toggle("show", window.scrollY > 480);
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Cookie consent banner                                               */
  /* ------------------------------------------------------------------ */
  function initCookieBanner() {
    if (localStorage.getItem("wt-cookie-consent")) return;
    var el = document.createElement("div");
    el.className = "sheet-banner";
    el.id = "cookie-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Cookie notice");
    el.innerHTML =
      "<p>We use a few essential cookies to make this site work, plus optional analytics to improve it. See our <a href=\"cookie-policy.html\" style=\"color:#fff;text-decoration:underline;\">Cookie Policy</a>.</p>" +
      '<div class="actions">' +
        '<button type="button" class="btn btn-outline btn-sm" data-cookie="decline">Decline</button>' +
        '<button type="button" class="btn btn-primary btn-sm" data-cookie="accept">Accept</button>' +
      "</div>";
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    el.addEventListener("click", function (e) {
      var choice = e.target.getAttribute("data-cookie");
      if (!choice) return;
      localStorage.setItem("wt-cookie-consent", choice);
      el.classList.remove("show");
      setTimeout(function () { el.remove(); }, 400);
    });
  }

  /* ------------------------------------------------------------------ */
  /* PWA: install prompt + service worker                                */
  /* ------------------------------------------------------------------ */
  function initPWA() {
    var deferredPrompt = null;
    var isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredPrompt = e;
      if (isStandalone || localStorage.getItem("wt-install-dismissed")) return;
      showInstallBanner();
    });

    function showInstallBanner() {
      if (document.getElementById("install-banner")) return;
      var el = document.createElement("div");
      el.className = "sheet-banner";
      el.id = "install-banner";
      el.innerHTML =
        "<p><strong>Install Winetime Asia</strong><br>Add the app to your home screen for faster, offline-friendly browsing.</p>" +
        '<div class="actions">' +
          '<button type="button" class="btn btn-outline btn-sm" data-install="dismiss">Not now</button>' +
          '<button type="button" class="btn btn-primary btn-sm" data-install="go">Install</button>' +
        "</div>";
      document.body.appendChild(el);
      requestAnimationFrame(function () { el.classList.add("show"); });
      el.addEventListener("click", function (e) {
        var action = e.target.getAttribute("data-install");
        if (action === "go" && deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.finally(function () {
            deferredPrompt = null;
            dismissInstallBanner();
          });
        } else if (action === "dismiss") {
          localStorage.setItem("wt-install-dismissed", "1");
          dismissInstallBanner();
        }
      });
    }
    function dismissInstallBanner() {
      var el = document.getElementById("install-banner");
      if (!el) return;
      el.classList.remove("show");
      setTimeout(function () { el.remove(); }, 400);
    }
    window.addEventListener("appinstalled", dismissInstallBanner);

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function (err) {
          console.warn("Service worker registration failed:", err);
        });
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Forms: contact / event / newsletter (mailto fallback, no backend)   */
  /* ------------------------------------------------------------------ */
  function initForms() {
    document.querySelectorAll("form[data-mailto]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var feedback = form.querySelector(".form-feedback");
        var data = new FormData(form);
        var lines = [];
        data.forEach(function (value, key) {
          if (!value) return;
          var field = form.querySelector('[name="' + key + '"]');
          var fieldLabel = field && field.closest(".field") ? field.closest(".field").querySelector("label") : null;
          lines.push((fieldLabel ? fieldLabel.textContent : key) + ": " + value);
        });
        var subject = form.getAttribute("data-subject") || "Message from winetime.asia";
        var body = encodeURIComponent(lines.join("\n"));
        var href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + body;
        if (feedback) {
          feedback.textContent = "Thanks! Your email app is opening with your message pre-filled to " + EMAIL + ".";
          feedback.className = "form-feedback show ok";
        }
        window.location.href = href;
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                 */
  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    mountChrome();
    initDrawer();
    initSlider(".hero", ".hero-slide", ".hero-dots", 6000);
    initSlider(".quote-carousel", ".quote-slide", ".quote-dots", 7000);
    initCarousels();
    initFinder();
    initReveal();
    initBackToTop();
    initCookieBanner();
    initPWA();
    initForms();
  });
})();
