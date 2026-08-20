/* ================================================================
   ⚙️  CONFIGURATION DU SITE — À PERSONNALISER POUR CHAQUE CLIENT
   ================================================================
   ▶ Modifiez UNIQUEMENT ce fichier pour adapter le site :
     nom, téléphone WhatsApp, adresse, Google Maps, produits,
     galerie, services, témoignages...
   ▶ Ne touchez PAS aux autres fichiers (style.css, main.js...).
   ================================================================ */

const SITE_CONFIG = {

  /* ---------------- MARQUE ---------------- */
  brand: {
    name: "Sucre d'Or",                    // Nom commercial (affiché partout)
    nameAr: "سكر دور",                     // Nom en arabe
    tagline: {                             // Slogan sous le logo
      fr: "Pâtisserie · Chocolaterie · Traiteur",
      ar: "حلويات · شوكولاتة · تقديم حفلات",
    },
    owner: "Chef Amina B.",                // Signature (section À propos)
    ownerRole: {
      fr: "Fondatrice & Pâtissière en chef",
      ar: "المؤسِّسة وكبيرة الطهاة",
    },
  },

  /* ---------------- WHATSAPP & TÉLÉPHONE ---------------- */
  whatsapp: {
    // ⚠️ Numéro AU FORMAT INTERNATIONAL, sans "+", sans espaces :
    //    Algérie = 213 + 9 chiffres  →  ex : 213550123456
    number: "213550123456",
    defaultMessage: {
      fr: "Bonjour ! Je souhaite commander.",
      ar: "مرحباً! أود تقديم طلب.",
    },
    // Collez ici le lien d'invitation WhatsApp du groupe (https://chat.whatsapp.com/...).
    // En attendant, le bandeau ouvre la discussion WhatsApp de la boutique.
    groupUrl: "",
  },
  phoneDisplay: "+213 550 12 34 56",       // Affiché sur le site
  email: "contact@sucredor-dz.com",

  /* ---------------- ADRESSE & HORAIRES ---------------- */
  address: {
    fr: "12, Rue Didouche Mourad, Alger Centre",
    ar: "12، شارع ديدوش مراد، الجزائر الوسطى",
  },
  hours: {
    fr: "Sam – Jeu : 9h00 – 20h00  ·  Ven : 14h00 – 20h00",
    ar: "السبت – الخميس: 9:00 – 20:00  ·  الجمعة: 14:00 – 20:00",
  },

  /* ---------------- GOOGLE MAPS ----------------
     Comment changer la carte :
     1) Ouvrez Google Maps → cherchez l'adresse du client
     2) Menu « Partager » → « Intégrer une carte »
     3) Copiez la valeur du src="..." (commence par
        https://www.google.com/maps/embed?pb=...)
     4) Collez-la ci-dessous                        */
  mapsEmbed: "https://www.google.com/maps?q=Alger+Centre,+Alger,+Alg%C3%A9rie&output=embed",

  /* ---------------- RÉSEAUX SOCIAUX ----------------
     Laissez "" (vide) pour masquer un réseau.         */
  social: {
    facebook:  "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok:    "https://tiktok.com/",
    youtube:   "",
  },

  /* ---------------- MONNAIE & LIVRAISON ---------------- */
  currency: "DA",          // Dinar Algérien
  deliveryFee: 0,          // 0 = livraison offerte (indiqué dans le panier)
  deliveryZone: {
    fr: "Alger & environs",
    ar: "الجزائر العاصمة وضواحيها",
  },

  /* ---------------- HÉROS : mots animés ---------------- */
  heroWords: [
    { fr: "Pâtisseries fines",     ar: "حلويات راقية" },
    { fr: "Chocolats artisanaux",  ar: "شوكولاتة حرفية" },
    { fr: "Traiteur d'événements", ar: "تقديم حفلات مميز" },
    { fr: "Livraison à Alger",     ar: "توصيل إلى الجزائر" },
  ],

  /* ---------------- BANDEAU DÉFILANT ---------------- */
  marquee: {
    fr: ["Pâtisserie fine", "Chocolaterie artisanale", "Traiteur événementiel",
         "Cake design", "Pièces montées", "Livraison à Alger"],
    ar: ["حلويات راقية", "شوكولاتة حرفية", "تقديم حفلات",
         "تصميم الكيك", "قطع فنية", "توصيل إلى الجزائر"],
  },

  /* ---------------- STATISTIQUES ---------------- */
  stats: [
    { value: 12,   suffix: "+", label: { fr: "Ans d'expérience",   ar: "سنة من الخبرة" } },
    { value: 850,  suffix: "+", label: { fr: "Événements réalisés", ar: "مناسبة نُظّمت" } },
    { value: 30,   suffix: "+", label: { fr: "Recettes signature",  ar: "وصفة مميزة" } },
    { value: 5000, suffix: "+", label: { fr: "Clients satisfaits",  ar: "زبون راضٍ" } },
  ],

  /* ---------------- BOUTIQUE : CATÉGORIES ---------------- */
  categories: [
    { id: "all",        fr: "Tout",      ar: "الكل" },
    { id: "gateaux",    fr: "Gâteaux",   ar: "الكعك" },
    { id: "macarons",   fr: "Macarons",  ar: "ماكارون" },
    { id: "chocolats",  fr: "Chocolats", ar: "الشوكولاتة" },
    { id: "orientales", fr: "Orientales", ar: "حلويات شرقية" },
    { id: "traiteur",   fr: "Traiteur",  ar: "تقديم الحفلات" },
  ],

  /* ---------------- BOUTIQUE : PRODUITS ----------------
     badge : "" = pas de badge. Ajoutez/retirez des produits
     librement, la page s'adapte toute seule.             */
  products: [
    {
      id: "p1", cat: "gateaux",
      badge: { fr: "Best-seller", ar: "الأكثر مبيعاً" },
      img: "images/p1.jpg",
      name: { fr: "Gâteau Chocolat Fondant", ar: "قالب الشوكولاتة الذائبة" },
      desc: { fr: "Génoise moelleuse, ganache 70% et feuille d'or.",
              ar: "كعكة هشّة، غاناش 70% وورق ذهب." },
      price: 3500,
    },
    {
      id: "p2", cat: "macarons",
      badge: "",
      img: "images/p2.jpg",
      name: { fr: "Macarons — Boîte de 12", ar: "ماكارون — علبة 12 حبة" },
      desc: { fr: "Coques croquantes, ganaches parfumées, couleurs pastel.",
              ar: "قشور مقرمشة وحشوات منكهة بألوان باستيل." },
      price: 2400,
    },
    {
      id: "p3", cat: "traiteur",
      badge: { fr: "Sur commande", ar: "حسب الطلب" },
      img: "images/p3.jpg",
      name: { fr: "Pièce Montée Mariage", ar: "كيك الزفاف الفني" },
      desc: { fr: "Pièce montée sur mesure, étages et fleurs personnalisés.",
              ar: "قطعة فنية حسب الطلب، طوابق وأزهار مخصصة." },
      price: 15000,
    },
    {
      id: "p4", cat: "chocolats",
      badge: "",
      img: "images/p4.jpg",
      name: { fr: "Coffret Chocolats Fins", ar: "علبة الشوكولاتة الفاخرة" },
      desc: { fr: "Pralinés, truffes et ganaches au chocolat d'exception.",
              ar: "برالين وترافل وغاناش بشوكولاتة استثنائية." },
      price: 3200,
    },
    {
      id: "p5", cat: "gateaux",
      badge: "",
      img: "images/p5.webp",
      name: { fr: "Mille-Feuille Signature", ar: "ميل فوي Signature" },
      desc: { fr: "Feuilletage croustillant, crème vanille de Madagascar.",
              ar: "عجينة مقرمشة وكريمة الفانيليا من مدغشقر." },
      price: 2800,
    },
    {
      id: "p6", cat: "orientales",
      badge: "",
      img: "images/p6.jpg",
      name: { fr: "Cornes de Gazelle — Boîte", ar: "قرن الغزال — علبة" },
      desc: { fr: "Amandes parfumées à la fleur d'oranger, miel doux.",
              ar: "لوز معطر بماء الزهر وعسل خفيف." },
      price: 2200,
    },
    {
      id: "p7", cat: "gateaux",
      badge: { fr: "Sur commande", ar: "حسب الطلب" },
      img: "images/p7.jpg",
      name: { fr: "Cake Design Anniversaire", ar: "كيك أعياد الميلاد المخصص" },
      desc: { fr: "Création unique selon le thème, le goût et les couleurs.",
              ar: "تصميم فريد حسب الثيمة والطعم والألوان." },
      price: 5500,
    },
    {
      id: "p8", cat: "orientales",
      badge: "",
      img: "images/p8.jpg",
      name: { fr: "Baklava Pistache — Plateau", ar: "بقلاوة بالفستق — صينية" },
      desc: { fr: "Feuilles croustillantes, pistaches de qualité, miel parfumé.",
              ar: "طبقات مقرمشة، فستق فاخر وعسل معطر." },
      price: 2600,
    },
  ],

  /* ---------------- SERVICES ---------------- */
  services: [
    {
      icon: "fa-cake-candles",
      title: { fr: "Pâtisserie Fine", ar: "الحلويات الفاخرة" },
      desc: { fr: "Gâteaux personnalisés, cake design, pièces montées et desserts de fête, préparés avec des produits nobles.",
              ar: "كعك مخصص، تصميم كيك، قطع فنية وحلويات مناسبات بمكونات راقية." },
    },
    {
      icon: "fa-chocolate-bar",
      title: { fr: "Chocolaterie Artisanale", ar: "الشوكولاتة الحرفية" },
      desc: { fr: "Truffes, pralinés, tablettes et coffrets cadeaux, fabriqués maison du cacao à la tablette.",
              ar: "ترافل، برالين، ألواح وعلب هدايا، مصنوعة يدوياً من الكاكاو." },
    },
    {
      icon: "fa-utensils",
      title: { fr: "Traiteur Événementiel", ar: "تقديم المناسبات" },
      desc: { fr: "Mariages, fiançailles, baptêmes et événements d'entreprise : buffets sucrés sur mesure.",
              ar: "أعراس، خطوبة، تعميد ومناسبات الشركات: بوفيهات حلويات حسب الطلب." },
    },
    {
      icon: "fa-truck-fast",
      title: { fr: "Livraison Express", ar: "توصيل سريع" },
      desc: { fr: "Livraison soignée et rapide, commande en ligne via WhatsApp en quelques clics.",
              ar: "توصيل سريع ومحكم، اطلب أونلاين عبر واتساب ببضع نقرات." },
    },
  ],

  /* ---------------- GALERIE PHOTOS ----------------
     cat  : gateaux | chocolats | evenements
     size : normal | tall | wide  (effet mosaïque)    */
  gallery: [
    { img: "images/g1.jpg", cat: "evenements", size: "tall",
      caption: { fr: "Pièce montée de mariage", ar: "قطعة فنية للعرس" } },
    { img: "images/g2.jpg", cat: "gateaux", size: "normal",
      caption: { fr: "Tour de macarons", ar: "برج الماكارون" } },
    { img: "images/g3.jpg", cat: "evenements", size: "wide",
      caption: { fr: "Buffet événementiel", ar: "بوفيه المناسبات" } },
    { img: "images/g4.jpg", cat: "chocolats", size: "normal",
      caption: { fr: "Chocolats artisanaux", ar: "شوكولاتة حرفية" } },
    { img: "images/g5.jpg", cat: "gateaux", size: "normal",
      caption: { fr: "Pâtisseries orientales", ar: "حلويات شرقية" } },
    { img: "images/g6.jpg", cat: "chocolats", size: "normal",
      caption: { fr: "Notre vitrine", ar: "واجهة متجرنا" } },
  ],
  galleryFilters: [
    { id: "all",        fr: "Tout",              ar: "الكل" },
    { id: "gateaux",    fr: "Gâteaux & Pâtisseries", ar: "الكعك والحلويات" },
    { id: "chocolats",  fr: "Chocolats",         ar: "الشوكولاتة" },
    { id: "evenements", fr: "Événements",        ar: "المناسبات" },
  ],

  /* ---------------- TÉMOIGNAGES ---------------- */
  testimonials: [
    {
      text: { fr: "Le gâteau de mariage a dépassé toutes nos attentes : sublime et délicieux. Tout le monde en parle encore !",
              ar: "كيكة العرس فاقت كل توقعاتنا: رائعة ولذيذة. الجميع ما زال يتحدث عنها!" },
      name: { fr: "Amina B.", ar: "أمينة ب." },
      role: { fr: "Mariage à Hydra", ar: "عرس في حيدرة" },
    },
    {
      text: { fr: "Les macarons sont juste incroyables, et la livraison était rapide et soignée. Je recommande à 100%.",
              ar: "الماكارون رائع بكل بساطة، والتوصيل كان سريعاً ومحكماً. أنصح به 100%." },
      name: { fr: "Karim M.", ar: "كريم م." },
      role: { fr: "Client régulier", ar: "زبون دائم" },
    },
    {
      text: { fr: "Buffet commandé pour la fête de fin d'année de l'entreprise : présentation magnifique, un vrai succès. Merci !",
              ar: "طلبنا بوفيه حفلة نهاية السنة للشركة: تقديم رائع ونجاح حقيقي. شكراً لكم!" },
      name: { fr: "SARL Atlas Consulting", ar: "شركة أطلس للاستشارات" },
      role: { fr: "Événement d'entreprise", ar: "مناسبة شركة" },
    },
  ],

  /* ---------------- CRÉDIT DU DÉVELOPPEUR ---------------- */
  developer: {
    name: "Votre Nom",                                  // ← votre nom / studio
    url: "https://github.com/votre-compte",             // ← votre lien
  },
};
