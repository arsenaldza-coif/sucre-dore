/* ================================================================
   🛒  PANIER — LOGIQUE E-COMMERCE + COMMANDE WHATSAPP
   ================================================================
   Le panier est stocké dans le navigateur (localStorage).
   La commande est envoyée au numéro WhatsApp du commerce (config.js).
   ================================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "scd_cart_v1";

  /* ---------- État ---------- */
  let cart = loadCart();          // { productId: qty }
  let orderMode = "delivery";

  /* ---------- Stockage ---------- */
  function loadCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  /* ---------- Utilitaires ---------- */
  function getProduct(id) {
    return SITE_CONFIG.products.find(p => p.id === id);
  }
  // Les nombres sont isolés en RTL afin que « 3 500 DA » ne devienne pas « DA 3 500 ».
  // Le format texte est aussi utilisé dans le message WhatsApp, tandis que fmtHTML()
  // garde le montant stable dans les éléments affichés par le navigateur.
  function formatMoneyValue(n) {
    return Number(n).toLocaleString("fr-FR").replace(/\u202f/g, " ") + " " + SITE_CONFIG.currency;
  }
  function fmt(n) {
    const value = formatMoneyValue(n);
    return getLang() === "ar" ? "\u2066" + value + "\u2069" : value;
  }
  function fmtHTML(n) {
    return `<bdi class="num-value" dir="ltr">${formatMoneyValue(n)}</bdi>`;
  }
  function cartCount() {
    return Object.values(cart).reduce((a, b) => a + b, 0);
  }
  function cartTotal() {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const p = getProduct(id);
      return sum + (p ? p.price * qty : 0);
    }, 0);
  }

  /* ---------- Éléments DOM ---------- */
  const $ = id => document.getElementById(id);
  const els = {
    btn: $("cartBtn"), count: $("cartCount"),
    drawer: $("cart"), overlay: $("cartOverlay"), close: $("cartClose"),
    body: $("cartBody"), empty: $("cartEmpty"), items: $("cartItems"),
    footer: $("cartFooter"), total: $("cartTotal"),
    checkout: $("checkoutBtn"), emptyCta: $("cartEmptyCta"),
    name: $("cartName"),
  };

  /* ---------- Rendu ---------- */
  function renderBadge() {
    const n = cartCount();
    els.count.textContent = n;
    // Un chiffre de quantité reste toujours lisible de gauche à droite, y compris en arabe.
    els.count.setAttribute("dir", "ltr");
    els.count.classList.toggle("show", n > 0);
  }

  function renderItems() {
    const entries = Object.entries(cart);
    const empty = entries.length === 0;
    els.empty.style.display = empty ? "flex" : "none";
    els.items.style.display = empty ? "none" : "flex";
    els.footer.style.display = empty ? "none" : "flex";

    if (empty) return;

    els.items.innerHTML = entries.map(([id, qty]) => {
      const p = getProduct(id);
      if (!p) return "";
      const name = p.name[getLang()] || p.name.fr;
      const price = fmtHTML(p.price);
      return `
        <li class="citem" data-id="${id}">
          <img class="citem__img" src="${p.img}" alt="${name}" loading="lazy">
          <div class="citem__info">
            <p class="citem__name">${name}</p>
            <p class="citem__price">${price}</p>
            <div class="citem__qty">
              <button class="qty-minus" aria-label="-"><i class="fa-solid fa-minus"></i></button>
              <span><bdi dir="ltr">${qty}</bdi></span>
              <button class="qty-plus" aria-label="+"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
          <div class="citem__side">
            <p class="citem__total">${fmtHTML(p.price * qty)}</p>
            <button class="citem__remove" title="${t("cart_remove")}" aria-label="${t("cart_remove")}">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </li>`;
    }).join("");

    const total = cartTotal();
    const fee = SITE_CONFIG.deliveryFee || 0;
    const finalTotal = orderMode === "delivery" ? total + fee : total;
    els.total.innerHTML = fmtHTML(finalTotal);
  }

  function renderCart() {
    renderBadge();
    renderItems();
  }

  /* ---------- Actions ---------- */
  function addToCart(id, opts = {}) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    renderCart();
    bumpBadge();
    if (opts.toast !== false) {
      const p = getProduct(id);
      const name = p ? (p.name[getLang()] || p.name.fr) : "";
      showToast(`✓ ${name} — ${t("toast_added")}`);
    }
    if (opts.open) openCart();
  }

  function setQty(id, qty) {
    if (qty <= 0) { delete cart[id]; }
    else { cart[id] = qty; }
    saveCart();
    renderCart();
  }

  function bumpBadge() {
    els.count.classList.remove("bump");
    void els.count.offsetWidth;   // relance l'animation
    els.count.classList.add("bump");
  }

  /* ---------- Ouverture / fermeture ---------- */
  function openCart() {
    els.drawer.classList.add("open");
    // L'attribut hidden doit être retiré avant d'ajouter la classe .show.
    // Sinon l'overlay reste masqué et le panier semble ne pas s'ouvrir sur certains navigateurs.
    els.overlay.hidden = false;
    requestAnimationFrame(() => els.overlay.classList.add("show"));
    els.drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    els.drawer.classList.remove("open");
    els.overlay.classList.remove("show");
    els.drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // Attend la fin du fondu avant de remettre hidden, sans casser une réouverture rapide.
    setTimeout(() => {
      if (!els.overlay.classList.contains("show")) els.overlay.hidden = true;
    }, 400);
  }

  /* ---------- Message WhatsApp ---------- */
  function buildOrderMessage() {
    const ar = getLang() === "ar";
    const brand = ar ? SITE_CONFIG.brand.nameAr : SITE_CONFIG.brand.name;
    const lines = [];
    lines.push(ar ? `مرحباً ${brand} 👋` : `Bonjour ${brand} 👋`);
    lines.push(ar ? "أود أن أطلب:" : "Je souhaite commander :");
    lines.push("");

    Object.entries(cart).forEach(([id, qty]) => {
      const p = getProduct(id);
      if (!p) return;
      const name = p.name[getLang()] || p.name.fr;
      lines.push(`• ${qty} × ${name} — ${fmt(p.price * qty)}`);
    });

    lines.push("");
    lines.push(ar ? `المجموع: ${fmt(cartTotal())}` : `Total : ${fmt(cartTotal())}`);

    if (orderMode === "delivery") {
      lines.push(ar ? `🛵 توصيل (${SITE_CONFIG.deliveryZone.ar})` : `🛵 Livraison (${SITE_CONFIG.deliveryZone.fr})`);
      if (!SITE_CONFIG.deliveryFee) lines.push(ar ? "🎁 التوصيل مجاني" : "🎁 Livraison offerte");
    } else {
      lines.push(ar ? "📍 استلام من المحل" : "📍 Retrait à la boutique");
    }

    const name = els.name.value.trim();
    if (name) lines.push(ar ? `الاسم: ${name}` : `Nom : ${name}`);

    return lines.join("\n");
  }

  function checkout() {
    const count = cartCount();
    if (!count) return;
    const msg = buildOrderMessage();
    const url = "https://wa.me/" + SITE_CONFIG.whatsapp.number + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank", "noopener");
  }

  /* ---------- Événements ---------- */
  function bindEvents() {
    els.btn.addEventListener("click", openCart);
    els.close.addEventListener("click", closeCart);
    els.overlay.addEventListener("click", closeCart);
    els.emptyCta.addEventListener("click", () => { closeCart(); scrollToId("boutique"); });

    els.items.addEventListener("click", e => {
      const li = e.target.closest(".citem");
      if (!li) return;
      const id = li.dataset.id;
      if (e.target.closest(".qty-plus")) setQty(id, (cart[id] || 0) + 1);
      if (e.target.closest(".qty-minus")) setQty(id, (cart[id] || 0) - 1);
      if (e.target.closest(".citem__remove")) setQty(id, 0);
    });

    document.querySelectorAll('input[name="orderMode"]').forEach(r => {
      r.addEventListener("change", () => {
        orderMode = r.value;
        renderItems();
      });
    });

    els.checkout.addEventListener("click", checkout);

    // Fermer avec Échap
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeCart();
    });

    // Re-rendu si la langue change
    document.addEventListener("langchange", renderCart);
  }

  /* ---------- Scroll vers une section ---------- */
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- Toast ---------- */
  function showToast(text) {
    const wrap = $("toasts");
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<i class="fa-solid fa-circle-check"></i><span></span>`;
    el.querySelector("span").textContent = text;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 3100);
  }

  /* ---------- Init ---------- */
  function init() {
    bindEvents();
    renderCart();
  }

  document.addEventListener("DOMContentLoaded", init);

  // API publique (utilisée par main.js)
  window.CartAPI = { addToCart, setQty, openCart, closeCart, cartCount };
})();
