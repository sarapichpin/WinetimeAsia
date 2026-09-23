/*!
 * Winetime Asia — shared site behavior
 * Injects header/footer, wires navigation, carousels, forms, PWA install,
 * i18n chrome (EN/FR/ZH/KM) and service-worker registration. No build step.
 */
(function () {
  "use strict";

  var SHOP_URL = "https://winetime-asia.odoo.com/shop";
  var INTRANET_URL = "https://winetime-asia.odoo.com/odoo";
  var PHONE = "+855 85 31 32 03";
  var PHONE_HREF = "tel:+855853132 03".replace(/\s/g, "");
  var EMAIL = "sale@winetime.asia";
  var LOCALES = ["en", "fr", "zh", "km"];
  var LOCALE_SHORT = { en: "EN", fr: "FR", zh: "中文", km: "ខ្មែរ" };
  var LOCALE_NAME = { en: "English", fr: "Français", zh: "中文", km: "ខ្មែរ" };
  var PAGE_FILE = {
    home: "index.html", about: "about.html", event: "event-wedding.html",
    bar: "bar-a-vin.html", contact: "contact.html", blog: "blog.html",
    forum: "forum.html", cookie: "cookie-policy.html"
  };

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
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/></svg>',
    intranet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></svg>'
  };

  /* ------------------------------------------------------------------ */
  /* Translations (site chrome only — page body copy lives per file)     */
  /* ------------------------------------------------------------------ */
  var I18N = {
    en: {
      navHome: "Home", navShop: "Shop", navEvent: "Event &amp; Wedding", navBar: "Bar &agrave; Vin", navAbout: "About",
      navCommunities: "Communities", navBlog: "Blog", navForum: "Forum", navContact: "Contact us", navIntranet: "Intranet",
      shopAria: "opens the official Winetime shop in a new tab",
      intranetAria: "opens the Winetime intranet in a new tab",
      callAria: "Call Winetime Asia", shopIconAria: "Open the Winetime shop",
      openMenuAria: "Open menu", closeMenuAria: "Close menu", menuDialogAria: "Menu",
      shopCollectionCta: "Shop the collection", langLabel: "Language",
      footerBrandTitle: "We are Winetime&hellip;",
      footerBlockquote: "Winetime Cambodia is your official distributor of quality wines and spirits, proudly offering an unparalleled range of products paired with the best service, every time.",
      footerExplore: "Explore", footerHome: "Home", footerAboutUs: "About us", footerEvent: "Event &amp; Wedding", footerBar: "Bar &agrave; Vin",
      footerCommunity: "Community", footerBlog: "Blog", footerForum: "Forum", footerShopCollection: "Shop the collection", footerContact: "Contact us",
      footerGetInTouch: "Get in touch", footerBasedIn: "Phnom Penh, Cambodia",
      footerCookiePolicy: "Cookie Policy", footerBackToTop: "Back to top", footerIntranet: "Intranet",
      footerRights: "All rights reserved.",
      cookieText: "We use a few essential cookies to make this site work, plus optional analytics to improve it. See our <a href=\"{cookieHref}\" style=\"color:#fff;text-decoration:underline;\">Cookie Policy</a>.",
      cookieDecline: "Decline", cookieAccept: "Accept", cookieAria: "Cookie notice",
      installTitle: "Install Winetime Asia", installBody: "Add the app to your home screen for faster, offline-friendly browsing.",
      installNotNow: "Not now", installGo: "Install",
      installIOSBody: "Tap the Share icon, then \"Add to Home Screen\", for faster, offline-friendly browsing.",
      installGotIt: "Got it",
      finderPick: "Pick a style to narrow down the shop search &mdash; or browse everything.",
      finderSearching: "Searching for <strong>{terms}</strong> in the shop",
      backToTopAria: "Back to top",
      mailtoThanks: "Thanks! Your email app is opening with your message pre-filled to {email}.",
      goToSlide: "Go to slide {n}"
    },
    fr: {
      navHome: "Accueil", navShop: "Boutique", navEvent: "Événement &amp; Mariage", navBar: "Bar &agrave; Vin", navAbout: "À propos",
      navCommunities: "Communauté", navBlog: "Blog", navForum: "Forum", navContact: "Contact", navIntranet: "Intranet",
      shopAria: "ouvre la boutique officielle Winetime dans un nouvel onglet",
      intranetAria: "ouvre l'intranet Winetime dans un nouvel onglet",
      callAria: "Appeler Winetime Asia", shopIconAria: "Ouvrir la boutique Winetime",
      openMenuAria: "Ouvrir le menu", closeMenuAria: "Fermer le menu", menuDialogAria: "Menu",
      shopCollectionCta: "Découvrir la boutique", langLabel: "Langue",
      footerBrandTitle: "Nous sommes Winetime&hellip;",
      footerBlockquote: "Winetime Cambodge est votre distributeur officiel de vins et spiritueux de qualité, fier de proposer une gamme inégalée de produits alliée au meilleur service, à chaque fois.",
      footerExplore: "Explorer", footerHome: "Accueil", footerAboutUs: "À propos", footerEvent: "Événement &amp; Mariage", footerBar: "Bar &agrave; Vin",
      footerCommunity: "Communauté", footerBlog: "Blog", footerForum: "Forum", footerShopCollection: "Découvrir la boutique", footerContact: "Contact",
      footerGetInTouch: "Nous contacter", footerBasedIn: "Phnom Penh, Cambodge",
      footerCookiePolicy: "Politique de cookies", footerBackToTop: "Retour en haut", footerIntranet: "Intranet",
      footerRights: "Tous droits réservés.",
      cookieText: "Nous utilisons quelques cookies essentiels au fonctionnement du site, ainsi que des cookies analytiques facultatifs pour l'améliorer. Voir notre <a href=\"{cookieHref}\" style=\"color:#fff;text-decoration:underline;\">politique de cookies</a>.",
      cookieDecline: "Refuser", cookieAccept: "Accepter", cookieAria: "Avis relatif aux cookies",
      installTitle: "Installer Winetime Asia", installBody: "Ajoutez l'application à votre écran d'accueil pour une navigation plus rapide, même hors ligne.",
      installNotNow: "Plus tard", installGo: "Installer",
      installIOSBody: "Appuyez sur l'icône Partager, puis « Sur l'écran d'accueil », pour une navigation plus rapide, même hors ligne.",
      installGotIt: "Compris",
      finderPick: "Choisissez un style pour affiner la recherche dans la boutique &mdash; ou parcourez tout le catalogue.",
      finderSearching: "Recherche de <strong>{terms}</strong> dans la boutique",
      backToTopAria: "Retour en haut",
      mailtoThanks: "Merci ! Votre application e-mail s'ouvre avec votre message pré-rempli à destination de {email}.",
      goToSlide: "Aller à la diapositive {n}"
    },
    zh: {
      navHome: "首页", navShop: "商店", navEvent: "活动与婚礼", navBar: "品酒吧", navAbout: "关于我们",
      navCommunities: "社区", navBlog: "博客", navForum: "论坛", navContact: "联系我们", navIntranet: "内部系统",
      shopAria: "在新标签页中打开 Winetime 官方商店",
      intranetAria: "在新标签页中打开 Winetime 内部系统",
      callAria: "致电 Winetime Asia", shopIconAria: "打开 Winetime 商店",
      openMenuAria: "打开菜单", closeMenuAria: "关闭菜单", menuDialogAria: "菜单",
      shopCollectionCta: "选购精选葡萄酒", langLabel: "语言",
      footerBrandTitle: "关于 Winetime&hellip;",
      footerBlockquote: "Winetime 柬埔寨是您值得信赖的优质葡萄酒和烈酒官方经销商,始终以卓越的服务,为您呈现丰富多样的产品。",
      footerExplore: "探索", footerHome: "首页", footerAboutUs: "关于我们", footerEvent: "活动与婚礼", footerBar: "品酒吧",
      footerCommunity: "社区", footerBlog: "博客", footerForum: "论坛", footerShopCollection: "选购精选葡萄酒", footerContact: "联系我们",
      footerGetInTouch: "联系方式", footerBasedIn: "柬埔寨金边",
      footerCookiePolicy: "Cookie 政策", footerBackToTop: "返回顶部", footerIntranet: "内部系统",
      footerRights: "版权所有。",
      cookieText: "我们使用一些必要的 Cookie 以保证网站正常运行,并使用可选的分析类 Cookie 来改进网站体验。详情请见我们的<a href=\"{cookieHref}\" style=\"color:#fff;text-decoration:underline;\">Cookie 政策</a>。",
      cookieDecline: "拒绝", cookieAccept: "接受", cookieAria: "Cookie 提示",
      installTitle: "安装 Winetime Asia", installBody: "将应用添加到主屏幕,浏览更快,并支持离线访问。",
      installNotNow: "暂不安装", installGo: "安装",
      installIOSBody: "点击“分享”图标,然后选择“添加到主屏幕”,浏览更快,并支持离线访问。",
      installGotIt: "知道了",
      finderPick: "选择一种风格以缩小商店搜索范围&mdash;或浏览全部商品。",
      finderSearching: "正在商店中搜索<strong>{terms}</strong>",
      backToTopAria: "返回顶部",
      mailtoThanks: "感谢您!您的邮件应用即将打开,消息已预先填写并发送至 {email}。",
      goToSlide: "转到第 {n} 张幻灯片"
    },
    km: {
      navHome: "ទំព័រដើម", navShop: "ហាង", navEvent: "កម្មវិធី &amp; អាពាហ៍ពិពាហ៍", navBar: "បារស្រាទំពាំងបាយជូរ", navAbout: "អំពីយើង",
      navCommunities: "សហគមន៍", navBlog: "ប្លុក", navForum: "វេទិកា", navContact: "ទាក់ទងយើង", navIntranet: "អ៊ីនត្រាណែត",
      shopAria: "បើកហាងផ្លូវការ Winetime នៅផ្ទាំងថ្មី",
      intranetAria: "បើកអ៊ីនត្រាណែត Winetime នៅផ្ទាំងថ្មី",
      callAria: "ទូរស័ព្ទទៅ Winetime Asia", shopIconAria: "បើកហាង Winetime",
      openMenuAria: "បើកម៉ឺនុយ", closeMenuAria: "បិទម៉ឺនុយ", menuDialogAria: "ម៉ឺនុយ",
      shopCollectionCta: "ជ្រើសទិញនៅហាង", langLabel: "ភាសា",
      footerBrandTitle: "យើងគឺ Winetime&hellip;",
      footerBlockquote: "Winetime កម្ពុជាគឺជាអ្នកចែកចាយផ្លូវការនៃស្រាទំពាំងបាយជូរ និងគ្រឿងស្រវឹងគុណភាពខ្ពស់ ដោយមានមោទនភាពក្នុងការផ្តល់ជូននូវផលិតផលចម្រុះបំផុត ភ្ជាប់ជាមួយសេវាកម្មល្អបំផុតគ្រប់ពេលវេលា។",
      footerExplore: "ស្វែងយល់", footerHome: "ទំព័រដើម", footerAboutUs: "អំពីយើង", footerEvent: "កម្មវិធី &amp; អាពាហ៍ពិពាហ៍", footerBar: "បារស្រាទំពាំងបាយជូរ",
      footerCommunity: "សហគមន៍", footerBlog: "ប្លុក", footerForum: "វេទិកា", footerShopCollection: "ជ្រើសទិញនៅហាង", footerContact: "ទាក់ទងយើង",
      footerGetInTouch: "ទំនាក់ទំនងមកយើង", footerBasedIn: "ភ្នំពេញ កម្ពុជា",
      footerCookiePolicy: "គោលការណ៍ខូគី", footerBackToTop: "ត្រឡប់ទៅលើ", footerIntranet: "អ៊ីនត្រាណែត",
      footerRights: "រក្សាសិទ្ធិគ្រប់យ៉ាង។",
      cookieText: "យើងប្រើខូគីសំខាន់ៗមួយចំនួនដើម្បីឱ្យគេហទំព័រនេះដំណើរការបាន ព្រមទាំងខូគីវិភាគជាជម្រើសបន្ថែមដើម្បីកែលម្អគេហទំព័រ។ សូមមើល<a href=\"{cookieHref}\" style=\"color:#fff;text-decoration:underline;\">គោលការណ៍ខូគី</a>របស់យើង។",
      cookieDecline: "បដិសេធ", cookieAccept: "យល់ព្រម", cookieAria: "សេចក្តីជូនដំណឹងអំពីខូគី",
      installTitle: "ដំឡើង Winetime Asia", installBody: "បន្ថែមកម្មវិធីទៅកាន់អេក្រង់ដើមរបស់អ្នក ដើម្បីរុករកបានលឿន និងប្រើប្រាស់បានទោះគ្មានអ៊ីនធឺណិត។",
      installNotNow: "មិនទាន់ទេ", installGo: "ដំឡើង",
      installIOSBody: "ចុចលើរូបតំណាង Share រួចជ្រើសរើស \"បន្ថែមទៅអេក្រង់ដើម\" ដើម្បីរុករកបានលឿន និងប្រើប្រាស់បានទោះគ្មានអ៊ីនធឺណិត។",
      installGotIt: "យល់ហើយ",
      finderPick: "ជ្រើសរើសម៉ូដមួយ ដើម្បីកំណត់លទ្ធផលស្វែងរកក្នុងហាង&mdash;ឬរុករកមើលផលិតផលទាំងអស់។",
      finderSearching: "កំពុងស្វែងរក <strong>{terms}</strong> នៅក្នុងហាង",
      backToTopAria: "ត្រឡប់ទៅលើ",
      mailtoThanks: "អរគុណ! កម្មវិធីអ៊ីមែលរបស់អ្នកកំពុងបើក ដោយសារបានបំពេញសារជាមុនផ្ញើទៅកាន់ {email}។",
      goToSlide: "ទៅកាន់ស្លាយទី {n}"
    }
  };

  function getLocale() {
    var loc = document.body.getAttribute("data-locale");
    return LOCALES.indexOf(loc) > -1 ? loc : "en";
  }
  function t(key) {
    var locale = getLocale();
    return (I18N[locale] && I18N[locale][key] != null) ? I18N[locale][key] : I18N.en[key];
  }
  function fmt(str, vars) {
    return str.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ""; });
  }

  function extAttrs() {
    return ' target="_blank" rel="noopener"';
  }

  /* ------------------------------------------------------------------ */
  /* Navigation model (single source of truth for header + drawer)       */
  /* ------------------------------------------------------------------ */
  function getNav() {
    return [
      { key: "home", label: t("navHome"), href: "index.html" },
      { key: "shop", label: t("navShop"), href: SHOP_URL, external: true, shop: true, ariaSuffix: t("shopAria") },
      { key: "event", label: t("navEvent"), href: "event-wedding.html" },
      { key: "bar", label: t("navBar"), href: "bar-a-vin.html" },
      { key: "about", label: t("navAbout"), href: "about.html" },
      { key: "communities", label: t("navCommunities"), children: [
        { key: "blog", label: t("navBlog"), href: "blog.html" },
        { key: "forum", label: t("navForum"), href: "forum.html" }
      ] },
      { key: "contact", label: t("navContact"), href: "contact.html" }
    ];
  }

  function renderDesktopNav(current, nav) {
    return nav.map(function (item) {
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
        (item.external ? ' aria-label="' + item.label.replace(/&amp;/g, "&") + " (" + item.ariaSuffix + ')"' : "") +
        ">" + item.label + icon + "</a></li>"
      );
    }).join("");
  }

  function renderMobileNav(current, nav) {
    return nav.map(function (item) {
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

  /* ------------------------------------------------------------------ */
  /* Language switcher: builds correct relative link to the same page   */
  /* in another locale, from any folder depth (root, /fr/, /zh/).       */
  /* ------------------------------------------------------------------ */
  function localeHref(targetLocale, currentLocale, filename) {
    var rootPrefix = currentLocale === "en" ? "" : "../";
    return rootPrefix + (targetLocale === "en" ? "" : targetLocale + "/") + filename;
  }

  function renderLangSwitcher(currentLocale, filename, variant) {
    var items = LOCALES.map(function (loc) {
      var isCurrent = loc === currentLocale;
      var label = variant === "short" ? LOCALE_SHORT[loc] : LOCALE_NAME[loc];
      if (isCurrent) {
        return '<span class="lang-current" aria-current="true">' + label + "</span>";
      }
      return '<a href="' + localeHref(loc, currentLocale, filename) + '" hreflang="' + loc + '" lang="' + loc + '">' + label + "</a>";
    }).join("");
    return items;
  }

  function headerHTML(current, locale) {
    var nav = getNav();
    var filename = PAGE_FILE[current] || "index.html";
    var depth = locale === "en" ? "" : "../";
    return (
      '<nav class="nav" aria-label="Main">' +
        '<div class="container">' +
          '<a class="brand" href="index.html" aria-label="Winetime Asia — Home">' +
            '<img class="brand-logo" src="' + depth + 'icons/logo-horizontal.png" alt="Winetime Asia" width="900" height="356">' +
          "</a>" +
          '<ul class="nav-links">' + renderDesktopNav(current, nav) + "</ul>" +
          '<div class="nav-actions">' +
            '<div class="dropdown lang-dropdown">' +
              '<button type="button" class="nav-link" aria-haspopup="true" aria-label="' + t("langLabel") + '">' + ICON.globe + LOCALE_SHORT[locale] + "</button>" +
              '<div class="dropdown-menu lang-menu">' + renderLangSwitcher(locale, filename, "full") + "</div>" +
            "</div>" +
            '<a class="icon-btn desktop-only" href="' + PHONE_HREF + '" aria-label="' + t("callAria") + '">' + ICON.phone + "</a>" +
            '<a class="icon-btn" href="' + SHOP_URL + '"' + extAttrs() + ' aria-label="' + t("shopIconAria") + '">' + ICON.cart + "</a>" +
            '<a class="icon-btn desktop-only" href="' + INTRANET_URL + '"' + extAttrs() + ' aria-label="' + t("navIntranet") + " (" + t("intranetAria") + ')">' + ICON.intranet + "</a>" +
            '<button type="button" class="icon-btn hamburger" id="menu-open" aria-label="' + t("openMenuAria") + '" aria-expanded="false" aria-controls="mobile-drawer">' + ICON.menu + "</button>" +
          "</div>" +
        "</div>" +
      "</nav>" +
      '<div class="mobile-drawer" id="mobile-drawer">' +
        '<div class="mobile-drawer__scrim" data-close-drawer></div>' +
        '<div class="mobile-drawer__panel" role="dialog" aria-modal="true" aria-label="' + t("menuDialogAria") + '">' +
          '<div class="mobile-drawer__head">' +
            '<a class="brand" href="index.html" aria-label="Winetime Asia — Home"><img class="brand-logo" src="' + depth + 'icons/logo-horizontal.png" alt="Winetime Asia" width="900" height="356"></a>' +
            '<button type="button" class="icon-btn" id="menu-close" aria-label="' + t("closeMenuAria") + '">' + ICON.close + "</button>" +
          "</div>" +
          '<nav><ul>' + renderMobileNav(current, nav) + "</ul></nav>" +
          '<div class="mobile-lang-switcher">' + renderLangSwitcher(locale, filename, "short") + "</div>" +
          '<a class="btn btn-primary" href="' + SHOP_URL + '"' + extAttrs() + ">" + t("shopCollectionCta") + " " + ICON.external + "</a>" +
          '<a class="btn btn-outline" href="' + PHONE_HREF + '">' + ICON.phone + " " + PHONE + "</a>" +
          '<a class="btn btn-outline" href="' + INTRANET_URL + '"' + extAttrs() + ">" + ICON.intranet + " " + t("navIntranet") + "</a>" +
        "</div>" +
      "</div>"
    );
  }

  function footerHTML(current, locale) {
    var year = new Date().getFullYear();
    var filename = PAGE_FILE[current] || "index.html";
    return (
      '<div class="container footer-top">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            "<h2>" + t("footerBrandTitle") + "</h2>" +
            "<blockquote>" + t("footerBlockquote") + "</blockquote>" +
            '<div class="footer-social">' +
              '<a href="https://www.facebook.com/" aria-label="Winetime on Facebook"' + extAttrs() + ">" + ICON.fb + "</a>" +
              '<a href="https://www.instagram.com/" aria-label="Winetime on Instagram"' + extAttrs() + ">" + ICON.ig + "</a>" +
              '<a href="https://www.youtube.com/" aria-label="Winetime on YouTube"' + extAttrs() + ">" + ICON.yt + "</a>" +
            "</div>" +
            '<div class="footer-lang">' + renderLangSwitcher(locale, filename, "short") + "</div>" +
          "</div>" +
          '<div class="footer-col">' +
            "<h4>" + t("footerExplore") + "</h4>" +
            "<ul>" +
              '<li><a href="index.html">' + t("footerHome") + "</a></li>" +
              '<li><a href="about.html">' + t("footerAboutUs") + "</a></li>" +
              '<li><a href="event-wedding.html">' + t("footerEvent") + "</a></li>" +
              '<li><a href="bar-a-vin.html">' + t("footerBar") + "</a></li>" +
            "</ul>" +
          "</div>" +
          '<div class="footer-col">' +
            "<h4>" + t("footerCommunity") + "</h4>" +
            "<ul>" +
              '<li><a href="blog.html">' + t("footerBlog") + "</a></li>" +
              '<li><a href="forum.html">' + t("footerForum") + "</a></li>" +
              '<li><a href="' + SHOP_URL + '"' + extAttrs() + ">" + t("footerShopCollection") + " " + ICON.external + "</a></li>" +
              '<li><a href="contact.html">' + t("footerContact") + "</a></li>" +
            "</ul>" +
          "</div>" +
          '<div class="footer-col">' +
            "<h4>" + t("footerGetInTouch") + "</h4>" +
            '<ul class="footer-contact">' +
              '<li>' + ICON.phone + '<a href="' + PHONE_HREF + '">' + PHONE + "</a></li>" +
              '<li>' + ICON.mail + '<a href="mailto:' + EMAIL + '">' + EMAIL + "</a></li>" +
              '<li>' + ICON.pin + "<span>" + t("footerBasedIn") + "</span></li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="container footer-bottom">' +
        "<span>&copy; " + year + " Winetime Asia &mdash; Sarapich PIN. " + t("footerRights") + "</span>" +
        '<div style="display:flex;gap:18px;flex-wrap:wrap;">' +
          '<a href="cookie-policy.html">' + t("footerCookiePolicy") + "</a>" +
          '<a href="' + INTRANET_URL + '"' + extAttrs() + ">" + t("footerIntranet") + " " + ICON.external + "</a>" +
          '<a href="#top">' + t("footerBackToTop") + "</a>" +
        "</div>" +
      "</div>"
    );
  }

  /* ------------------------------------------------------------------ */
  /* Mount header/footer                                                 */
  /* ------------------------------------------------------------------ */
  function mountChrome() {
    var current = document.body.getAttribute("data-page") || "";
    var locale = getLocale();
    var headerEl = document.getElementById("site-header");
    var footerEl = document.getElementById("site-footer");
    if (headerEl) headerEl.innerHTML = headerHTML(current, locale);
    if (footerEl) footerEl.innerHTML = footerHTML(current, locale);
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
  function initSlider(rootSelector, slideSelector, dotsSelector, interval, onShow, holdMs) {
    var root = document.querySelector(rootSelector);
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll(slideSelector));
    var dotsWrap = root.querySelector(dotsSelector) || document.querySelector(dotsSelector);
    if (slides.length < 2) return;
    var index = 0;
    var timer;
    var pendingSwap;

    if (dotsWrap) {
      dotsWrap.innerHTML = slides.map(function (_, i) {
        return '<button type="button" aria-label="' + fmt(t("goToSlide"), { n: i + 1 }) + '"' + (i === 0 ? ' class="is-active"' : "") + "></button>";
      }).join("");
    }
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];

    function show(i) {
      var newIndex = (i + slides.length) % slides.length;
      if (newIndex === index) return;
      clearTimeout(pendingSwap);
      slides[index].classList.remove("is-active");
      if (dots[index]) dots[index].classList.remove("is-active");
      index = newIndex;
      function activate() {
        slides[index].classList.add("is-active");
        if (dots[index]) dots[index].classList.add("is-active");
        if (onShow) onShow(index, slides[index]);
      }
      if (holdMs) {
        pendingSwap = setTimeout(activate, holdMs);
      } else {
        activate();
      }
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
  /* Hero background crossfade (staggered after the text slide change)  */
  /* ------------------------------------------------------------------ */
  function initHeroBackgrounds() {
    var hero = document.querySelector(".hero");
    if (!hero) return null;
    var layers = Array.prototype.slice.call(hero.querySelectorAll(".hero-bg"));
    if (layers.length < 2) return null;
    var activeIndex = layers.findIndex(function (l) { return l.classList.contains("is-visible"); });
    if (activeIndex < 0) activeIndex = 0;
    return function setHeroBg(url) {
      if (!url) return;
      var current = layers[activeIndex];
      if (current.style.backgroundImage.indexOf(url) !== -1) return;
      var nextIndex = (activeIndex + 1) % layers.length;
      var next = layers[nextIndex];
      next.style.backgroundImage = "url('" + url + "')";
      next.classList.add("is-visible");
      current.classList.remove("is-visible");
      activeIndex = nextIndex;
    };
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
          ? fmt(t("finderSearching"), { terms: terms.join(", ") })
          : t("finderPick");
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
    btn.setAttribute("aria-label", t("backToTopAria"));
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
  function grantAnalyticsConsent() {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "granted" });
    }
  }

  function initCookieBanner() {
    var stored = localStorage.getItem("wt-cookie-consent");
    if (stored === "accept") grantAnalyticsConsent();
    if (stored) return;
    var el = document.createElement("div");
    el.className = "sheet-banner";
    el.id = "cookie-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", t("cookieAria"));
    el.innerHTML =
      "<p>" + fmt(t("cookieText"), { cookieHref: "cookie-policy.html" }) + "</p>" +
      '<div class="actions">' +
        '<button type="button" class="btn btn-outline btn-sm" data-cookie="decline">' + t("cookieDecline") + "</button>" +
        '<button type="button" class="btn btn-primary btn-sm" data-cookie="accept">' + t("cookieAccept") + "</button>" +
      "</div>";
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    el.addEventListener("click", function (e) {
      var choice = e.target.getAttribute("data-cookie");
      if (!choice) return;
      localStorage.setItem("wt-cookie-consent", choice);
      if (choice === "accept") grantAnalyticsConsent();
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
    var ua = window.navigator.userAgent;
    var isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    var isIOSSafari = isIOS && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);

    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredPrompt = e;
      if (isStandalone || localStorage.getItem("wt-install-dismissed")) return;
      showInstallBanner();
    });

    // Safari on iOS never fires beforeinstallprompt, so there is no native
    // install popup to trigger there — show our own instructions instead.
    if (isIOSSafari && !isStandalone && !localStorage.getItem("wt-install-dismissed")) {
      setTimeout(showIOSInstallBanner, 2000);
    }

    function showInstallBanner() {
      if (document.getElementById("install-banner")) return;
      var el = document.createElement("div");
      el.className = "sheet-banner";
      el.id = "install-banner";
      el.innerHTML =
        "<p><strong>" + t("installTitle") + "</strong><br>" + t("installBody") + "</p>" +
        '<div class="actions">' +
          '<button type="button" class="btn btn-outline btn-sm" data-install="dismiss">' + t("installNotNow") + "</button>" +
          '<button type="button" class="btn btn-primary btn-sm" data-install="go">' + t("installGo") + "</button>" +
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
    function showIOSInstallBanner() {
      if (document.getElementById("install-banner")) return;
      var el = document.createElement("div");
      el.className = "sheet-banner";
      el.id = "install-banner";
      el.innerHTML =
        "<p><strong>" + t("installTitle") + "</strong><br>" + t("installIOSBody") + "</p>" +
        '<div class="actions">' +
          '<button type="button" class="btn btn-primary btn-sm" data-install="dismiss">' + t("installGotIt") + "</button>" +
        "</div>";
      document.body.appendChild(el);
      requestAnimationFrame(function () { el.classList.add("show"); });
      el.addEventListener("click", function (e) {
        if (e.target.getAttribute("data-install") === "dismiss") {
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
        var depth = getLocale() === "en" ? "" : "../";
        navigator.serviceWorker.register(depth + "sw.js", { scope: depth || "./" }).catch(function (err) {
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
          feedback.textContent = fmt(t("mailtoThanks"), { email: EMAIL });
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
    var setHeroBg = initHeroBackgrounds();
    initSlider(".hero", ".hero-slide", ".hero-dots", 6000, function (i, slideEl) {
      if (!setHeroBg) return;
      var bg = slideEl.getAttribute("data-bg");
      if (!bg) return;
      setTimeout(function () { setHeroBg(bg); }, 900);
    }, 1100);
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
