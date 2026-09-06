(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";

  /* ---------------------------------------------------------------------
     Nav: solid background once the hero has been scrolled past
  --------------------------------------------------------------------- */
  var nav = document.getElementById("nav");
  var toggleNavState = function () {
    if (window.scrollY > 60) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  };
  toggleNavState();
  window.addEventListener("scroll", toggleNavState, { passive: true });

  var navToggle = document.querySelector(".nav__toggle");
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var links = document.querySelector(".nav__links");
      var cta = document.querySelector(".nav__cta");
      var open = nav.classList.toggle("nav--open");
      if (links) links.style.cssText = open
        ? "display:flex;position:absolute;top:100%;left:0;right:0;flex-direction:column;gap:0;background:#100e0c;padding:10px 6vw 26px;border-bottom:1px solid rgba(239,232,218,.14);"
        : "";
      if (links) Array.prototype.forEach.call(links.children, function (li) {
        li.style.padding = "14px 0";
      });
      if (cta) cta.style.display = open ? "inline-flex" : "";
    });
  }

  if (reduceMotion) {
    document.querySelectorAll(".reveal, [data-reveal]").forEach(function (el) {
      el.classList.add("is-visible");
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    return;
  }

  /* ---------------------------------------------------------------------
     Hero entrance — a single orchestrated moment on load
  --------------------------------------------------------------------- */
  var heroEls = document.querySelectorAll(".hero [data-reveal]");

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(heroEls, { opacity: 0, y: 28 });
    var tl = gsap.timeline({ delay: 0.2, defaults: { ease: "power3.out" } });
    tl.to(".hero__bg img", { scale: 1, duration: 1.8, ease: "power2.out" }, 0)
      .to(heroEls, { opacity: 1, y: 0, duration: 1, stagger: 0.16 }, 0.3);

    /* Parallax drift on the hero image while scrolling */
    gsap.to(".hero__bg img", {
      yPercent: 10,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    /* Generic scroll reveals, grouped per section rather than per element */
    document.querySelectorAll("section:not(.hero)").forEach(function (section) {
      var targets = section.querySelectorAll("[data-reveal]");
      if (!targets.length) return;
      gsap.set(targets, { opacity: 0, y: 30 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 78%" }
      });
    });

  } else {
    /* -------------------------------------------------------------------
       Fallback: IntersectionObserver-based reveal, no GSAP dependency
    ------------------------------------------------------------------- */
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("reveal");
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      io.observe(el);
    });

    /* Hero fires immediately since it's visible on load */
    setTimeout(function () {
      heroEls.forEach(function (el, i) {
        setTimeout(function () {
          el.style.transition = "opacity 0.9s ease, transform 0.9s ease";
          el.style.opacity = 1;
          el.style.transform = "translateY(0)";
        }, i * 140);
      });
    }, 150);
  }
})();

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";

  /* ---------------------------------------------------------------------
     1. Dark / Light Mode Toggle
  --------------------------------------------------------------------- */
  var themeToggleBtn = document.getElementById("themeToggle");
  var savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      var currentTheme = document.documentElement.getAttribute("data-theme");
      var newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  /* ---------------------------------------------------------------------
     2. Translation System (French & Arabic)
  --------------------------------------------------------------------- */
  var translations = {
    fr: {
      "nav.menu": "La carte",
      "nav.story": "L'histoire",
      "nav.ambiance": "L'ambiance",
      "nav.reserve": "Réserver",
      "nav.reserveBtn": "Réserver",
      "hero.kicker": "Néo-bistrot · Tanger",
      "hero.tagline": "Un lieu où le temps s'arrête, où les saveurs sont franches et les rencontres authentiques.",
      "hero.seeMenu": "Voir la carte",
      "hero.reserveTable": "Réserver une table",
      "hero.scroll": "Défiler",
      "menu.kicker": "À la carte",
      "menu.title": "Chaque assiette<br>raconte une histoire.",
      "menu.desc": "Des produits choisis avec soin, une cuisine de bistrot revisitée avec précision : pièces grillées à la minute, sauces maison, desserts qui rappellent la maison. La carte change au fil des saisons — l'exigence, jamais.",
      "story.kicker": "Notre histoire",
      "story.quote": "« Ô Rendez-Vous est né d'une envie simple : créer un lieu où le temps s'arrête, où les saveurs sont franches et les rencontres authentiques. Plus qu'un bistrot, c'est une invitation. »",
      "story.welcome": "Bienvenue chez vous",
      "reasons.kicker": "Ce qu'on aime chez nous",
      "reasons.title": "Toutes ces petites raisons<br>que vous nous appréciez",
      "reasons.r1": "268 avis, une seule note qui compte : 4,9 étoiles.",
      "reasons.r2": "Lui aussi, il avait trouvé son petit coin préféré.",
      "reasons.r3": "Baptiste est venu poser son bureau chez nous.",
      "dishes.kicker": "Nos incontournables",
      "dishes.title": "Grillé, mijoté, servi<br>avec la même exigence.",
      "dish1.idx": "La pièce du boucher",
      "dish1.title": "Médaillons de bœuf, sauce champignons",
      "dish1.desc": "Saisis à la plancha pour une croûte franche, servis avec une sauce aux champignons montée au beurre et un trait de romarin frais.",
      "dish2.idx": "Le déjeuner sur le pouce",
      "dish2.title": "Le poulet grillé, brioche toastée",
      "dish2.desc": "Filet de poulet grillé, roquette fraîche et sauce maison, entre deux tranches de brioche toastée au beurre. Servi avec ses pommes de terre rôties.",
      "dish3.idx": "Pour finir en douceur",
      "dish3.title": "Pain perdu caramélisé, glace vanille",
      "dish3.desc": "Brioche caramélisée à la poêle, nappée d'une crème anglaise tiède et de deux boules de glace vanille de Madagascar.",
      "cta.kicker": "Le rendez-vous",
      "cta.title": "What's the occasion?<br>It's Friday.",
      "cta.desc": "Réservez votre table et laissez-nous nous occuper du reste — de l'apéritif au dernier carré de chocolat.",
      "cta.addressLabel": "Adresse",
      "cta.addressValue": "12 Avenue Mohammed VI<br>Tanger, Maroc",
      "cta.hoursLabel": "Horaires",
      "cta.hoursValue": "Du mardi au dimanche<br> 12:00PM – 12:00 AM",
      "cta.contactLabel": "Contact",
      "footer.explore": "Explorer",
      "footer.visit": "Visiter",
      "footer.follow": "Suivre",
      "footer.copyright": "© 2026 Ô Rendez-Vous — Néo-bistrot, Tanger",
      "footer.crafted": "Site conçu avec soin",
      "hero.orderGlovo": "Commander sur Glovo",
            "reviews.kicker": "Avis Google",
        "reviews.title": "Ce que disent nos clients",
        "reviews.desc": "268 avis, une note qui ne bouge pas : 4,9 sur 5.",
        "reviews.badge": "Avis Google",
        "reviews.r1": "« This is a wonderful place to eat with fresh food and various options. We enjoyed the chicken Milanese, brioche sandwich, and chicken in mustard sauce. Everything was delicious and cooked perfectly, including the nicely crisped potatoes »",
        "reviews.d1": "Il y a 2 semaines",
        "reviews.r2": "« 10/10 The ambience, The food, The service everything is just Top Notch . 100% recommended if you're in Tangeir i would highly suggest you to come and enjoy the food here »",
        "reviews.d2": "Il y a 1 mois",
        "reviews.r3": "« What an amazing discovery in Tangier. We travel frequently for work and eat all over the world, and this restaurant is one of my favorites I've discovered so far. Everything is prepared to perfection and overall the place has so much class, from the food to the service to the playlist. If I'm ever back here, I'll be sure to stop by again! »",
        "reviews.d3": "Il y a 3 semaines",
        "reviews.cta": "Voir tous les avis Google"
    },
    ar: {
      "nav.menu": "قائمة الطعام",
      "nav.story": "قصتنا",
      "nav.ambiance": "الأجواء",
      "nav.reserve": "حجز",
      "nav.reserveBtn": "احجز الآن",
      "hero.kicker": "نيو بيسترو · طنجة",
      "hero.tagline": "مكان يتوقف فيه الزمن، حيث النكهات أصيلة واللقاءات حقيقية.",
      "hero.seeMenu": "عرض القائمة",
      "hero.reserveTable": "حجز طاولة",
      "hero.scroll": "تمرير",
      "menu.kicker": "قائمة الطعام",
      "menu.title": "كل طبق<br>يحكي حكاية.",
      "menu.desc": "منتجات مختارة بعناية، وطهي بيسترو عصري بإتقان: أطباق مشوية فوراً، صلصلات منزلية، وحلويات تذكرك بالبيت. تتغير القائمة مع الفصول — بينما يبقى الجودة ثابتة.",
      "story.kicker": "قصتنا",
      "story.quote": "« ولد Ô Rendez-Vous من رغبة بسيطة: خلق مكان يتوقف فيه الزمن، وتكون فيه النكهات أصيلة واللقاءات حقيقية. إنه أكثر من مجرد بيسترو، إنه دعوة. »",
      "story.welcome": "مرحباً بكم في بيتكم",
      "reasons.kicker": "ما يحبه زوارنا",
      "reasons.title": "كل التفاصيل الصغيرة<br>التي تجعلكم تحبوننا",
      "reasons.r1": "268 تقييماً، والنتيجة الوحيدة المهمة: 4,9 نجوم.",
      "reasons.r2": "هو أيضاً وجد ركنه المفضل لدينا.",
      "reasons.r3": "باتيست جاء ليعمل ويقضي يومه عندنا.",
      "dishes.kicker": "أطباقنا المميزة",
      "dishes.title": "مشوي، مطبوخ، ومقدم<br>بنفس أعلى معايير الجودة.",
      "dish1.idx": "اختيار الجزار",
      "dish1.title": "ميداليات لحم البقر بصلصة الفطر",
      "dish1.desc": "مطهوة على الجريل للقرمشة المثالية، تقدم مع صلصة الفطر بالزبدة ولمسة إكليل الجبل الطازج.",
      "dish2.idx": "وجبة غداء سريعة",
      "dish2.title": "دجاج مشوي بفرنش توست",
      "dish2.desc": "شرائح دجاج مشوي، جرجير طازج وصلصة خاصة بين شريحتي بريوش محمص بالزبدة. يقدم مع بطاطس محمصة.",
      "dish3.idx": "نهاية حلوة",
      "dish3.title": "فرنش توست مكرمل مع أيس كريم فانيليا",
      "dish3.desc": "بريوش مكرمل بالمقلاة، مغطى بصلصة الكاسترد الدافئة ومكعبين من أيس كريم فانيليا مدغشقر.",
      "cta.kicker": "الموعد",
      "cta.title": "ما هي المناسبة؟<br>إنه يوم الجمعة.",
      "cta.desc": "احجز طاولتك ودعنا نهتم بالباقي — من المقبلات حتى آخر قطعة شوكولاتة.",
      "cta.addressLabel": "العنوان",
      "cta.addressValue": "12 شارع محمد السادس<br>طنجة، المغرب",
      "cta.hoursLabel": "أوقات العمل",
      "cta.hoursValue": "من الثلاثاء إلى الأحد<br> 12:00 مساءً – 12:00 صباحاً",
      "cta.contactLabel": "الاتصال",
      "footer.explore": "استكشف",
      "footer.visit": "زيارة",
      "footer.follow": "تابعنا",
      "footer.copyright": "© 2026 Ô Rendez-Vous — نيو بيسترو، طنجة",
      "footer.crafted": "تم التصميم بعناية",
      "hero.orderGlovo": "الطلب عبر جلوفو",
            "reviews.kicker": "آراء جوجل",
        "reviews.title": "ما يقوله زبناؤنا",
        "reviews.desc": "268 تقييماً، بنتيجة ثابتة: 4,9 من 5.",
        "reviews.badge": "تقييم جوجل",
        "reviews.r1": "« مكان رائع لتناول الطعام مع أطباق طازجة وخيارات متنوعة. استمتعنا بالدجاج على الطريقة الميلانية، وساندويتش البريوش، والدجاج بصلصة الخردل. كان كل شيء لذيذاً ومطبوخاً بإتقان »",
        "reviews.d1": "منذ أسبوعين",
        "reviews.r2": "« 10/10 الأجواء، الطعام، والخدمة.. كل شيء على أعلى مستوى. أنصح به بنسبة 100% إذا كنت في طنجة »",
        "reviews.d2": "منذ شهر",
        "reviews.r3": "« اكتشاف رائع في طنجة! نسافر كثيراً بحكم العمل وناكل في مختلف أنحاء العالم، وهذا المطعم من أفضل الأماكن التي اكتشفتها. كل شيء محضر بإتقان والمكان يتمتع برقي كبير »",
        "reviews.d3": "منذ 3 أسابيع",
        "reviews.cta": "عرض جميع تقييمات جوجل"
    }
  };

  var langToggleBtn = document.getElementById("langToggle");
  var currentLang = localStorage.getItem("lang") || "fr";

  function applyLanguage(lang) {
    var isAr = lang === "ar";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", isAr ? "rtl" : "ltr");
    
    if (langToggleBtn) {
      langToggleBtn.textContent = isAr ? "FR" : "AR";
    }

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    localStorage.setItem("lang", lang);
  }

  applyLanguage(currentLang);

  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", function () {
      currentLang = currentLang === "fr" ? "ar" : "fr";
      applyLanguage(currentLang);
    });
  }

  /* ---------------------------------------------------------------------
     3. Nav Scroll State & Mobile Toggle
  --------------------------------------------------------------------- */
  var nav = document.getElementById("nav");
  var toggleNavState = function () {
    if (window.scrollY > 60) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  };
  toggleNavState();
  window.addEventListener("scroll", toggleNavState, { passive: true });

  var navToggle = document.querySelector(".nav__toggle");
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var links = document.querySelector(".nav__links");
      var cta = document.querySelector(".nav__cta");
      var open = nav.classList.toggle("nav--open");
      if (links) links.style.cssText = open
        ? "display:flex;position:absolute;top:100%;left:0;right:0;flex-direction:column;gap:0;background:var(--nav-bg);padding:10px 6vw 26px;border-bottom:1px solid rgba(239,232,218,.14);"
        : "";
      if (links) Array.prototype.forEach.call(links.children, function (li) {
        li.style.padding = "14px 0";
      });
      if (cta) cta.style.display = open ? "inline-flex" : "";
    });
  }

  if (reduceMotion) {
    document.querySelectorAll(".reveal, [data-reveal]").forEach(function (el) {
      el.classList.add("is-visible");
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    return;
  }

  /* ---------------------------------------------------------------------
     4. Hero entrance & GSAP ScrollTrigger
  --------------------------------------------------------------------- */
  var heroEls = document.querySelectorAll(".hero [data-reveal]");

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(heroEls, { opacity: 0, y: 28 });
    var tl = gsap.timeline({ delay: 0.2, defaults: { ease: "power3.out" } });
    tl.to(".hero__bg img", { scale: 1, duration: 1.8, ease: "power2.out" }, 0)
      .to(heroEls, { opacity: 1, y: 0, duration: 1, stagger: 0.16 }, 0.3);

    gsap.to(".hero__bg img", {
      yPercent: 10,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    document.querySelectorAll("section:not(.hero)").forEach(function (section) {
      var targets = section.querySelectorAll("[data-reveal]");
      if (!targets.length) return;
      gsap.set(targets, { opacity: 0, y: 30 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 78%" }
      });
    });

  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("reveal");
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      io.observe(el);
    });

    setTimeout(function () {
      heroEls.forEach(function (el, i) {
        setTimeout(function () {
          el.style.transition = "opacity 0.9s ease, transform 0.9s ease";
          el.style.opacity = 1;
          el.style.transform = "translateY(0)";
        }, i * 140);
      });
    }, 150);
  }
})();