/* ==========================================================================
   H.S Anlegg – interaksjon
   Små, dempede effekter. Respekterer prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* --- Årstall i footer -------------------------------------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* --- Tema (lys/mørk) --------------------------------------------------- */
  const root = document.documentElement;
  const themeMeta = $('meta[name="theme-color"]');
  const themeToggle = $(".theme-toggle");
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(theme, persist) {
    const dark = theme === "dark";
    root.setAttribute("data-theme", dark ? "dark" : "light");
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", dark ? "true" : "false");
      themeToggle.setAttribute("aria-label", dark ? "Bytt til lyst tema" : "Bytt til mørkt tema");
    }
    if (themeMeta) themeMeta.setAttribute("content", dark ? "#14171a" : "#ffffff");
    if (persist) {
      try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
    }
  }

  applyTheme(root.getAttribute("data-theme") || (darkQuery.matches ? "dark" : "light"), false);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    });
  }

  function onSchemeChange(e) {
    let stored = null;
    try { stored = localStorage.getItem("theme"); } catch (err) {}
    if (!stored) applyTheme(e.matches ? "dark" : "light", false);
  }
  if (darkQuery.addEventListener) darkQuery.addEventListener("change", onSchemeChange);
  else if (darkQuery.addListener) darkQuery.addListener(onSchemeChange);

  /* --- Header: krymp + aktiv seksjon ------------------------------------ */
  const header = $(".site-header");
  let headerOffset = 66;

  function updateHeaderOffset() {
    headerOffset = header ? header.offsetHeight : 66;
  }
  updateHeaderOffset();

  const sections = $$("main section[id]");
  const navLinks = $$(".nav__list a");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40 || header.classList.contains("menu-open"));

    if (sections.length) {
      const probe = headerOffset + 80;
      let current = "";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= probe) current = section.id;
      }
      for (const link of navLinks) {
        const match = link.getAttribute("href") === "#" + current;
        link.classList.toggle("is-active", match);
      }
    }
  }

  let ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });
  window.addEventListener("resize", function () {
    updateHeaderOffset();
    onScroll();
  });
  onScroll();

  /* --- Mobilmeny --------------------------------------------------------- */
  const navToggle = $(".nav-toggle");
  const mobileNav = $("#mobile-nav");
  let menuOpen = false;

  function openMenu() {
    if (!mobileNav) return;
    menuOpen = true;
    mobileNav.hidden = false;
    requestAnimationFrame(() => mobileNav.classList.add("is-open"));
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Lukk meny");
    header.classList.add("menu-open");
    document.body.classList.add("menu-locked");
    onScroll();
  }

  function closeMenu() {
    if (!mobileNav || !menuOpen) return;
    menuOpen = false;
    mobileNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Åpne meny");
    header.classList.remove("menu-open");
    document.body.classList.remove("menu-locked");
    window.setTimeout(() => { if (!menuOpen) mobileNav.hidden = true; }, prefersReduced ? 0 : 300);
    onScroll();
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => (menuOpen ? closeMenu() : openMenu()));
    $$("a", mobileNav).forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("click", (e) => {
      if (!menuOpen) return;
      if (!mobileNav.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 900) closeMenu(); });
  }

  /* --- Scroll-reveal ----------------------------------------------------- */
  const revealEls = $$("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* --- Telle-animasjon for nøkkeltall ----------------------------------- */
  const statValues = $$(".stat__value");
  let statsDone = false;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function runCountUp() {
    if (statsDone) return;
    statsDone = true;
    statValues.forEach((el) => {
      if (el.dataset.count === undefined) return;
      const target = parseInt(el.dataset.count || "0", 10);
      const suffix = el.dataset.suffix || "";
      if (prefersReduced || target === 0) {
        el.textContent = target + suffix;
        return;
      }
      const duration = 1500;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * easeOutCubic(p)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  if (statValues.length) {
    if (!("IntersectionObserver" in window) || prefersReduced) {
      runCountUp();
    } else {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCountUp();
            statsObserver.disconnect();
          }
        });
      }, { threshold: 0.4 });
      const statsSection = $(".stats");
      if (statsSection) statsObserver.observe(statsSection);
    }
  }

  /* --- Lightbox ---------------------------------------------------------- */
  const galleryItems = $$(".gallery__item");
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightbox-img");
  const lightboxCaption = $("#lightbox-caption");
  let lbIndex = 0;
  let lastFocused = null;

  function renderLightbox() {
    const item = galleryItems[lbIndex];
    if (!item) return;
    const inner = $("img", item);
    lightboxImg.src = item.dataset.full || (inner && inner.src) || "";
    lightboxImg.alt = (inner && inner.alt) || "";
    lightboxCaption.textContent = item.dataset.caption || "";
  }

  function openLightbox(index) {
    if (!lightbox || !galleryItems.length) return;
    lbIndex = (index + galleryItems.length) % galleryItems.length;
    lastFocused = document.activeElement;
    renderLightbox();
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    document.body.classList.add("menu-locked");
    const closeBtn = $(".lightbox__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("menu-locked");
    window.setTimeout(() => {
      lightbox.hidden = true;
    }, prefersReduced ? 0 : 300);
    if (lastFocused) lastFocused.focus();
  }

  function stepLightbox(dir) {
    lbIndex = (lbIndex + dir + galleryItems.length) % galleryItems.length;
    renderLightbox();
  }

  if (lightbox && galleryItems.length) {
    galleryItems.forEach((item, i) => item.addEventListener("click", () => openLightbox(i)));
    $(".lightbox__close").addEventListener("click", closeLightbox);
    $(".lightbox__nav--prev").addEventListener("click", () => stepLightbox(-1));
    $(".lightbox__nav--next").addEventListener("click", () => stepLightbox(1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") stepLightbox(-1);
      else if (e.key === "ArrowRight") stepLightbox(1);
    });
  }

  /* --- Kontaktskjema (prototype – sender ikke e-post) ------------------- */
  const form = $("#contact-form");
  if (form) {
    const success = $(".form-success", form);

    const validators = {
      navn: (v) => v.trim().length >= 2,
      telefon: (v) => (v.replace(/\D/g, "").length >= 6),
      epost: (v) => v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      tjeneste: (v) => v !== "",
      melding: (v) => v.trim().length >= 5,
    };

    function fieldOf(input) { return input.closest(".field"); }

    function validateField(input) {
      const rule = validators[input.name];
      if (!rule) return true;
      const ok = rule(input.value);
      const field = fieldOf(input);
      field.classList.toggle("has-error", !ok);
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      return ok;
    }

    $$("input, select, textarea", form).forEach((input) => {
      const evt = input.tagName === "SELECT" ? "change" : "input";
      input.addEventListener(evt, () => {
        if (fieldOf(input).classList.contains("has-error")) validateField(input);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let firstInvalid = null;
      $$("input, select, textarea", form).forEach((input) => {
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
        if (success) success.hidden = true;
        return;
      }

      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
      }
      form.reset();
    });
  }
})();
