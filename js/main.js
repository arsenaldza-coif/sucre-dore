/* ================================================================
   ⚡  MAIN.JS — RENDU DYNAMIQUE + ANIMATIONS + PARALLAX
   ================================================================
   - Rendu du contenu depuis config.js (bilingue FR/AR)
   - Animations au défilement (IntersectionObserver)
   - Effet parallax (héros + bandeau CTA)
   - Filtres boutique & galerie, lightbox, slider témoignages
   - Header, menu mobile, langue, particules...
   ================================================================ */

(function () {
  "use strict";

  const C = SITE_CONFIG;
  const $ = id => document.getElementById(id);

  const L = () => getLang();

  /* ══════════════ LIENS WHATSAPP ══════════════ */
  function waLink(message) {
    return "https://wa.me/" + C.whatsapp.number + "?text=" + encodeURIComponent(message);
  }
  function applyWhatsAppLinks() {
    const msg = C.whatsapp.defaultMessage[L()] || C.whatsapp.defaultMessage.fr;
    ["heroWa", "mmenuWa", "ctaWa", "waFloat", "footerWa"].forEach(id => {
      const el = $(id);
      if (el) el.href = waLink(msg);
    });
  }

  /* ══════════════ BANDEAU GROUPE WHATSAPP ══════════════ */
  function renderWhatsAppGroupBanner() {
    const track = $("waGroupTrack");
    if (!track) return;

    // Le lien de groupe est configurable. Sans lien d'invitation, on ouvre WhatsApp de la boutique.
    const groupUrl = C.whatsapp.groupUrl || waLink(C.whatsapp.defaultMessage[L()] || C.whatsapp.defaultMessage.fr);
    const label = t("wa_groupBanner");
    const item = `
      <a class="wa-group-banner__item" href="${groupUrl}" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
        <span>${label}</span>
        <i class="fa-solid fa-arrows-rotate wa-group-banner__motion" aria-hidden="true"></i>
      </a>`;

    // Deux groupes identiques de six items permettent un défilement continu, même sur grand écran.
    track.innerHTML = item.repeat(12);
  }

  /* ══════════════ BANDEAU DÉFILANT ══════════════ */
  function renderMarquee() {
    const track = $("marqueeTrack");
    const items = C.marquee[L()] || C.marquee.fr;
    // Double le contenu pour une boucle parfaite
    const html = items.map(w =>
      `<span class="marquee__item">${w} <i class="fa-solid fa-star-of-life"></i></span>`
    ).join("");
    track.innerHTML = html + html;
  }

  /* ══════════════ STATISTIQUES ══════════════ */
  function renderStats() {
    const list = $("statsList");
    list.innerHTML = C.stats.map((s, i) => `
      <li class="stat reveal" style="--d:${i * 0.1}s">
        <p class="stat__num"><bdi dir="ltr"><span class="counter" data-target="${s.value}">0</span><span class="stat__suffix">${s.suffix}</span></bdi></p>
        <p class="stat__label">${s.label[L()]}</p>
      </li>`).join("");
  }

  /* ══════════════ BOUTIQUE ══════════════ */
  function renderShopFilters() {
    const wrap = $("shopFilters");
    wrap.innerHTML = C.categories.map((c, i) =>
      `<button class="filter-btn ${i === 0 ? "is-active" : ""}" data-filter="${c.id}">${c[L()]}</button>`
    ).join("");
    bindFilters(wrap, ".pcard");
  }

  function renderProducts() {
    const grid = $("productsGrid");
    grid.innerHTML = C.products.map((p, i) => {
      const badge = p.badge && p.badge[L()] ? `<span class="pcard__badge">${p.badge[L()]}</span>` : "";
      const catName = (C.categories.find(c => c.id === p.cat) || {})[L()] || "";
      return `
      <article class="pcard reveal" data-cat="${p.cat}" data-id="${p.id}" style="--d:${(i % 4) * 0.08}s">
        <div class="pcard__media">
          <img src="${p.img}" alt="${p.name[L()]}" loading="lazy">
          ${badge}
          <button class="pcard__quick" data-add="${p.id}" aria-label="Ajouter">
            <i class="fa-solid fa-bag-shopping"></i>
          </button>
        </div>
        <div class="pcard__body">
          <span class="pcard__cat">${catName}</span>
          <h3 class="pcard__name">${p.name[L()]}</h3>
          <p class="pcard__desc">${p.desc[L()]}</p>
          <div class="pcard__foot">
            <span class="pcard__price">${fmtPrice(p.price)}</span>
            <button class="btn btn--gold btn--sm" data-add="${p.id}">
              <i class="fa-solid fa-plus"></i> <span>${t("product_add")}</span>
            </button>
          </div>
        </div>
      </article>`;
    }).join("");

    // Ajout au panier
    grid.querySelectorAll("[data-add]").forEach(btn => {
      btn.addEventListener("click", () => {
        CartAPI.addToCart(btn.dataset.add);
        const c = btn.closest(".pcard");
        if (c) { c.classList.add("added-flash"); setTimeout(() => c.classList.remove("added-flash"), 600); }
        btn.classList.add("added");
        setTimeout(() => btn.classList.remove("added"), 1200);
      });
    });

    bindTilt(grid.querySelectorAll(".pcard"));
  }

  function fmtPrice(n) {
    const amount = Number(n).toLocaleString("fr-FR").replace(/\u202f/g, " ");
    // bdi empêche l'inversion visuelle de la devise et des chiffres dans un bloc RTL.
    return `<bdi class="price-value" dir="ltr">${amount} <small>${C.currency}</small></bdi>`;
  }

  /* ══════════════ SERVICES ══════════════ */
  function renderServices() {
    const grid = $("servicesGrid");
    grid.innerHTML = C.services.map((s, i) => `
      <article class="scard reveal" style="--d:${i * 0.12}s">
        <span class="scard__icon"><i class="fa-solid ${s.icon}"></i></span>
        <h3>${s.title[L()]}</h3>
        <p>${s.desc[L()]}</p>
      </article>`).join("");
  }

  /* ══════════════ GALERIE ══════════════ */
  let galleryItems = [];

  function renderGalleryFilters() {
    const wrap = $("galleryFilters");
    wrap.innerHTML = C.galleryFilters.map((c, i) =>
      `<button class="filter-btn ${i === 0 ? "is-active" : ""}" data-filter="${c.id}">${c[L()]}</button>`
    ).join("");
    bindFilters(wrap, ".gcard");
  }

  function renderGallery() {
    galleryItems = C.gallery.map(g => ({
      ...g,
      caption: g.caption[L()] || g.caption.fr,
    }));
    const grid = $("galleryGrid");
    grid.innerHTML = galleryItems.map((g, i) => `
      <figure class="gcard reveal" data-cat="${g.cat}" data-size="${g.size || "normal"}" data-index="${i}" style="--d:${(i % 3) * 0.1}s">
        <img src="${g.img}" alt="${g.caption}" loading="lazy">
        <figcaption class="gcard__cap">
          <span>${g.caption}</span>
          <i class="fa-solid fa-magnifying-glass-plus"></i>
        </figcaption>
      </figure>`).join("");

    grid.querySelectorAll(".gcard").forEach(el => {
      el.addEventListener("click", () => openLightbox(+el.dataset.index));
    });
  }

  /* ══════════════ LIGHTBOX ══════════════ */
  let lbIndex = 0;
  function openLightbox(i) {
    lbIndex = i;
    updateLightbox();
    $("lightbox").classList.add("open");
    $("lightbox").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    $("lightbox").classList.remove("open");
    $("lightbox").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function updateLightbox() {
    const g = galleryItems[lbIndex];
    if (!g) return;
    $("lbImg").src = g.img;
    $("lbImg").alt = g.caption;
    $("lbCaption").textContent = g.caption;
    $("lbCounter").textContent = `${lbIndex + 1} ${t("lightbox_of")} ${galleryItems.length}`;
  }
  function lbStep(d) {
    lbIndex = (lbIndex + d + galleryItems.length) % galleryItems.length;
    updateLightbox();
  }

  function bindLightbox() {
    $("lbClose").addEventListener("click", closeLightbox);
    $("lbPrev").addEventListener("click", () => lbStep(-1));
    $("lbNext").addEventListener("click", () => lbStep(1));
    $("lightbox").addEventListener("click", e => {
      if (e.target === $("lightbox")) closeLightbox();
    });
    document.addEventListener("keydown", e => {
      if (!$("lightbox").classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lbStep(-1);
      if (e.key === "ArrowRight") lbStep(1);
    });
  }

  /* ══════════════ FILTRES (boutique + galerie) ══════════════ */
  function bindFilters(wrap, selector) {
    wrap.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        wrap.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const f = btn.dataset.filter;

        const cards = document.querySelectorAll(selector);
        cards.forEach(card => {
          const show = f === "all" || card.dataset.cat === f;
          if (show) {
            card.classList.remove("hide");
            card.style.display = "";
          } else {
            card.classList.add("hide");
            setTimeout(() => { card.style.display = "none"; }, 350);
          }
        });
      });
    });
  }

  /* ══════════════ SLIDER TÉMOIGNAGES ══════════════ */
  let tsIndex = 0, tsTimer = null, tsCount = 0;

  function renderTestimonials() {
    const track = $("tsTrack");
    const dots = $("tsDots");
    tsCount = C.testimonials.length;
    if (!tsCount) return;
    if (tsIndex >= tsCount) tsIndex = 0;

    track.innerHTML = C.testimonials.map(tm => `
      <div class="tslide">
        <div class="tslide__card">
          <i class="fa-solid fa-quote-right tslide__icon"></i>
          <div class="tslide__stars">★★★★★</div>
          <p class="tslide__text">${tm.text[L()]}</p>
          <p class="tslide__name">${tm.name[L()]}</p>
          <p class="tslide__role">${tm.role[L()]}</p>
        </div>
      </div>`).join("");

    dots.innerHTML = C.testimonials.map((_, i) =>
      `<button class="tslider__dot ${i === tsIndex ? "is-active" : ""}" data-i="${i}" aria-label="Témoignage ${i + 1}"></button>`
    ).join("");

    dots.querySelectorAll(".tslider__dot").forEach(d => {
      d.addEventListener("click", () => { goSlide(+d.dataset.i); restartAuto(); });
    });

    goSlide(0, true);
    restartAuto();
  }

  function bindSliderControls() {
    $("tsPrev").addEventListener("click", () => { goSlide(tsIndex - 1); restartAuto(); });
    $("tsNext").addEventListener("click", () => { goSlide(tsIndex + 1); restartAuto(); });
  }

  function goSlide(i, instant = false) {
    tsIndex = (i + tsCount) % tsCount;
    $("tsTrack").style.transition = instant ? "none" : "";
    $("tsTrack").style.transform = `translateX(-${tsIndex * 100}%)`;
    document.querySelectorAll(".tslider__dot").forEach((d, k) =>
      d.classList.toggle("is-active", k === tsIndex));
  }

  function restartAuto() {
    clearInterval(tsTimer);
    tsTimer = setInterval(() => goSlide(tsIndex + 1), 5500);
  }

  /* ══════════════ DIAPORAMA HÉROS : VIDÉOS + IMAGE ══════════════ */
  function bindHeroSlideshow() {
    const media = $("heroBg");
    if (!media) return;

    const slides = Array.from(media.querySelectorAll(".hero__slide"));
    if (slides.length < 2) return;

    const imageDelay = 6000;
    let active = slides.findIndex(slide => slide.classList.contains("is-active"));
    let imageTimer = null;

    const stopVideo = slide => {
      const video = slide.querySelector("video");
      if (!video) return;
      video.pause();
      try { video.currentTime = 0; } catch (_) { /* metadata not yet loaded */ }
    };

    const show = index => {
      clearTimeout(imageTimer);
      active = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === active);
        if (i !== active) stopVideo(slide);
      });

      const current = slides[active];
      const video = current.querySelector("video");
      if (!video) {
        // La photo hero.jpg reste visible 6 secondes avant le média suivant.
        imageTimer = setTimeout(() => show(active + 1), imageDelay);
        return;
      }

      // Les navigateurs autorisent l'autoplay seulement si la vidéo est muted + playsinline.
      try { video.currentTime = 0; } catch (_) { /* metadata not yet loaded */ }
      const play = video.play();
      if (play && typeof play.catch === "function") {
        play.catch(() => {
          // Si l'autoplay est bloqué, on conserve l'image de secours puis on avance.
          imageTimer = setTimeout(() => show(active + 1), imageDelay);
        });
      }
    };

    slides.forEach((slide, index) => {
      const video = slide.querySelector("video");
      if (!video) return;
      // Une vidéo se lit entièrement, puis le diaporama continue.
      video.addEventListener("ended", () => {
        if (index === active) show(active + 1);
      });
      // En cas de fichier absent ou illisible, l'image de secours évite un écran noir.
      video.addEventListener("error", () => {
        if (index === active) {
          clearTimeout(imageTimer);
          imageTimer = setTimeout(() => show(active + 1), imageDelay);
        }
      });
    });

    // Le diaporama est explicitement demandé : il reste actif même dans un aperçu
    // qui signale « réduire les animations ». Les vidéos restent sans son.
    slides.forEach(slide => {
      const video = slide.querySelector("video");
      if (!video) return;
      // Certains navigateurs exigent ces propriétés JavaScript, en plus des attributs HTML,
      // avant d'autoriser la lecture automatique mobile.
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.load();
    });

    show(active < 0 ? 0 : active);
  }

  /* ══════════════ HÉROS : MOTS ANIMÉS ══════════════ */
  let rotIndex = 0;
  function renderRotator() {
    const el = $("rotatorWord");
    const words = C.heroWords;
    if (!el || !words.length) return;
    const set = (i) => { el.textContent = words[i][L()]; };
    set(rotIndex % words.length);
    if (window.__rotTimer) clearInterval(window.__rotTimer);
    window.__rotTimer = setInterval(() => {
      el.classList.remove("rot-in");
      el.classList.add("rot-out");
      setTimeout(() => {
        rotIndex = (rotIndex + 1) % words.length;
        set(rotIndex);
        el.classList.remove("rot-out");
        el.classList.add("rot-in");
      }, 350);
    }, 3000);
  }

  /* ══════════════ PARTICULES HÉROS ══════════════ */
  function spawnSparks() {
    const hero = document.querySelector(".hero");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const glyphs = ["✦", "✧", "•", "✦"];
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("span");
      s.className = "hero__spark";
      s.textContent = glyphs[i % glyphs.length];
      s.style.left = Math.random() * 100 + "%";
      s.style.fontSize = (6 + Math.random() * 9) + "px";
      s.style.animationDuration = (9 + Math.random() * 12) + "s";
      s.style.animationDelay = (Math.random() * 10) + "s";
      hero.appendChild(s);
    }
  }

  /* ══════════════ PARALLAX ══════════════ */
  function bindParallax() {
    const heroBg = $("heroBg");
    const ctaBg = $("ctaBg");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let ticking = false;
    function update() {
      const y = window.scrollY;
      if (heroBg) heroBg.style.transform = `translate3d(0, ${y * 0.3}px, 0)`;
      if (ctaBg) {
        const rect = ctaBg.parentElement.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          ctaBg.style.transform = `translate3d(0, ${(window.innerHeight - rect.top) * -0.1}px, 0)`;
        }
      }
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ══════════════ ANIMATIONS AU DÉFILEMENT ══════════════ */
  let revealObserver = null;
  function observeReveals() {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    }
    document.querySelectorAll(".reveal:not(.in)").forEach(el => revealObserver.observe(el));
  }

  /* ══════════════ COMPTEURS ══════════════ */
  function bindCounters() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        obs.unobserve(el);
        const target = +el.dataset.target;
        const dur = 1600;
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString("fr-FR");
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll(".counter").forEach(el => obs.observe(el));
  }

  /* ══════════════ EFFET 3D (TILT) SUR LES CARTES ══════════════ */
  function bindTilt(cards) {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    cards.forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", (px * 7).toFixed(2) + "deg");
        card.style.setProperty("--rx", (-py * 7).toFixed(2) + "deg");
      });
      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
  }

  /* ══════════════ HEADER / NAVIGATION ══════════════ */
  function bindHeader() {
    const header = $("header");
    const progress = $("progress");
    const backtop = $("backtop");
    const nav = $("nav");

    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 40);
      backtop.classList.toggle("show", y > 650);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    backtop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    // Lien actif au défilement
    const sections = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          nav.querySelectorAll(".nav__link").forEach(a => {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id);
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(s => obs.observe(s));
  }

  /* ══════════════ MENU MOBILE ══════════════ */
  function bindMenu() {
    const burger = $("burger");
    const menu = $("mmenu");
    const overlay = $("mmenuOverlay");

    const open = () => {
      menu.classList.add("open");
      burger.classList.add("open");
      overlay.hidden = false;
      requestAnimationFrame(() => overlay.classList.add("show"));
      menu.setAttribute("aria-hidden", "false");
      burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      menu.classList.remove("open");
      burger.classList.remove("open");
      overlay.classList.remove("show");
      menu.setAttribute("aria-hidden", "true");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      setTimeout(() => { overlay.hidden = true; }, 400);
    };

    burger.addEventListener("click", () => menu.classList.contains("open") ? close() : open());
    $("mmenuClose").addEventListener("click", close);
    overlay.addEventListener("click", close);
    menu.querySelectorAll("a[href^='#']").forEach(a => a.addEventListener("click", close));
  }

  /* ══════════════ LANGUE ══════════════ */
  function bindLang() {
    document.querySelectorAll(".lang__btn").forEach(btn => {
      btn.addEventListener("click", () => {
        setLang(btn.dataset.lang);
        document.querySelectorAll(".lang__btn").forEach(b =>
          b.classList.toggle("is-active", b.dataset.lang === getLang()));
      });
    });
    // Applique aussi la direction et les textes de la langue sauvegardée au rechargement.
    // Sans cela, un visiteur ayant choisi l'arabe retrouvait un document encore en LTR.
    setLang(getLang());
    document.querySelectorAll(".lang__btn").forEach(b =>
      b.classList.toggle("is-active", b.dataset.lang === getLang()));
  }

  /* ══════════════ RENDU GLOBAL (à chaque changement de langue) ══════════════ */
  function renderAll() {
    renderWhatsAppGroupBanner();
    renderMarquee();
    renderStats();
    renderShopFilters();
    renderProducts();
    renderServices();
    renderGalleryFilters();
    renderGallery();
    renderTestimonials();
    renderRotator();
    applyWhatsAppLinks();
    observeReveals();
    bindCounters();
  }

  function setBidiText(el, value) {
    if (!el) return;
    if (getLang() !== "ar") {
      el.textContent = value;
      return;
    }
    // Isole les suites numériques (+213, horaires, 12…) afin qu'elles ne soient pas inversées en RTL.
    const escaped = String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
    el.innerHTML = escaped.replace(/(\+?\d[\d\s:–.\-]*\d|\b\d+\b)/g, '<bdi dir="ltr">$1</bdi>');
  }

  function bindContacts() {
    // Infos de contact depuis config
    $("aboutYears").innerHTML = `<bdi dir="ltr">${C.stats[0].value}+</bdi>`;
    $("aboutOwner").textContent = C.brand.owner;
    $("aboutOwnerRole").textContent = C.brand.ownerRole[getLang()];

    setBidiText($("contactPhone"), C.phoneDisplay);
    $("contactPhone").href = "tel:+" + C.whatsapp.number;
    setBidiText($("contactEmail"), C.email);
    $("contactEmail").href = "mailto:" + C.email;
    setBidiText($("contactAddress"), C.address[getLang()] || C.address.fr);
    setBidiText($("contactHours"), C.hours[getLang()] || C.hours.fr);
    setBidiText($("footerAddress"), C.address[getLang()] || C.address.fr);
    setBidiText($("footerPhone"), C.phoneDisplay);
    $("footerPhone").href = "tel:+" + C.whatsapp.number;
    setBidiText($("footerHours"), C.hours[getLang()] || C.hours.fr);
    setBidiText($("ctaPhone"), C.phoneDisplay);
    $("ctaTel").href = "tel:+" + C.whatsapp.number;
    $("mapFrame").src = C.mapsEmbed;

    // Réseaux sociaux
    const wrap = $("socialLinks");
    const icons = { facebook: "fa-facebook-f", instagram: "fa-instagram", tiktok: "fa-tiktok", youtube: "fa-youtube" };
    wrap.innerHTML = Object.entries(C.social)
      .filter(([, url]) => url)
      .map(([net, url]) =>
        `<a class="social-btn" href="${url}" target="_blank" rel="noopener" aria-label="${net}"><i class="fa-brands ${icons[net]}"></i></a>`
      ).join("");

    // Services (pied de page)
    $("footerServices").innerHTML = C.services.map(s =>
      `<li><a href="#services">${s.title[getLang()]}</a></li>`).join("");

    // Crédit développeur
    $("devLink").textContent = C.developer.name;
    $("devLink").href = C.developer.url;
    $("year").textContent = new Date().getFullYear();
  }

  function bindQuickForm() {
    // Formulaire rapide → WhatsApp (bindé une seule fois)
    $("quickForm").addEventListener("submit", e => {
      e.preventDefault();
      const name = $("qfName").value.trim();
      const msg = $("qfMsg").value.trim() || C.whatsapp.defaultMessage[getLang()];
      const full = name ? `*${name}* :\n${msg}` : msg;
      window.open(waLink(full), "_blank", "noopener");
    });
  }

  /* ══════════════ PRELOADER ══════════════ */
  function bindPreloader() {
    const done = () => $("preloader").classList.add("done");
    if (document.readyState === "complete") setTimeout(done, 600);
    else window.addEventListener("load", () => setTimeout(done, 600));
  }

  /* ══════════════ INIT ══════════════ */
  document.addEventListener("DOMContentLoaded", () => {
    bindPreloader();
    bindLang();
    bindHeader();
    bindMenu();
    bindLightbox();
    bindSliderControls();
    bindQuickForm();
    bindParallax();
    bindHeroSlideshow();
    spawnSparks();
    bindContacts();
    renderAll();

    document.addEventListener("langchange", () => {
      bindContacts();
      renderAll();
    });
  });
})();
