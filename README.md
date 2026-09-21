# Winetime Asia — Website & PWA

A full redesign of [winetime-asia.odoo.com](https://winetime-asia.odoo.com/) as a fast, installable, static website — built with plain HTML/CSS/JS (no build step, no framework, no dependencies to install).

## Why the Shop still lives on Odoo

Every **Shop** link on this site (nav, footer, product cards, CTAs) points out to `https://winetime-asia.odoo.com/shop`, opening in a new tab. This is intentional: Odoo remains the system of record for inventory, pricing, checkout and **accounting**. This site is the marketing/discovery layer in front of it — it never duplicates cart, pricing or checkout logic, so there is only ever one source of truth for orders.

## What's here

- `index.html` — Home: hero, interactive wine finder, feature highlights, "Coup de Cœur" product carousel, wedding teaser, testimonials, newsletter.
- `about.html` — Story, promise, timeline, team.
- `event-wedding.html` — Gold / Platinum / Diamond / Emerald packages + enquiry form.
- `bar-a-vin.html` — Wine bar concept, hours, reservations.
- `contact.html` — Contact form, info, map.
- `blog.html`, `forum.html` — Community landing pages (content pipeline coming soon).
- `cookie-policy.html`, `offline.html`, `404.html` — Support pages.
- `css/style.css` — Design system (brand tokens sampled from the official logo artwork: `#e63a1b` red, `#333333` charcoal).
- `js/site.js` — Shared header/footer injection, navigation, carousels, forms, cookie banner, PWA install prompt, service worker registration.
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA: installable app, offline-friendly app-shell caching.
- `images/` — Licensed hero/banner photography (see **Images** below).
- `fr/`, `zh/`, `km/` — Full French, Simplified Chinese and Khmer translations (see **Languages** below).

## Languages

The site ships in English (root), French (`/fr/`), Simplified Chinese (`/zh/`) and Khmer (`/km/`) — pick one from the language switcher in the header (a globe menu on desktop, a row of buttons in the mobile drawer) or the footer. English is the default/canonical language; every page has matching translated copies at the same filename under `fr/`, `zh/` and `km/` (e.g. `about.html` ↔ `fr/about.html` ↔ `zh/about.html` ↔ `km/about.html`), plus `hreflang` alternate tags in each page's `<head>` and in `sitemap.xml` for search engines.

There's no i18n framework: each locale is a fully static, hand-translated HTML file (simplest option with no build step). Chrome text — nav labels, footer, cookie/install banners, form feedback — lives in one place, the `I18N` dictionary near the top of `js/site.js`; body copy is translated directly in each page. To add another language, add a locale to `LOCALES`/`I18N` in `site.js`, then copy the `fr/` (or `km/`) folder as a template and translate its 8 pages. `404.html` and `offline.html` are intentionally English-only fallbacks (edge cases, low value to translate); the language switcher on those pages links to each locale's homepage instead of a translated 404.

Because `fr/`, `zh/` and `km/` are one folder deep, every asset reference in those pages (`css/`, `js/`, `icons/`, `images/`, `manifest.webmanifest`) is prefixed with `../` — keep that in mind when copy-pasting sections between locales. Chinese glyphs aren't in the Fraunces/Inter web fonts, but every OS ships a CJK-capable system font so the browser falls back automatically. Khmer coverage is far less reliable across devices/OSes, so the `km/` pages additionally load the Noto Sans Khmer web font and `css/style.css` lists it in `--font-display`/`--font-body` as an explicit fallback (harmless on other locales, since it's simply never requested there).

## Images

`images/home-hero.jpg`, `about-hero.jpg`, `event-hero.jpg`, `bar-hero.jpg` and `collection-banner.jpg` are royalty-free stock photos licensed through Adobe Stock's free tier — cleared for this kind of commercial use, no attribution required. Swap any of them for real venue/product photography whenever it's available; each is referenced by a single `background-image` inline style at the top of its page, so replacing the file (same name) or updating the path is a one-line change.

## Forms

There is no backend. Contact / newsletter / event forms build a pre-filled `mailto:` link to `sale@winetime.asia` on submit. To collect submissions properly (a real inbox/CRM/analytics), swap `initForms()` in `js/site.js` for a call to a form service (e.g. Formspree, Brevo, a small serverless function) — the markup already has `name` attributes ready to map.

## Running locally

No build step. Serve the folder with any static server (opening `index.html` directly via `file://` also mostly works, except the service worker, which requires `http(s)://`):

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Deploying

Any static host works: GitHub Pages, Netlify, Vercel, Cloudflare Pages. Service workers require HTTPS (or `localhost`), so PWA install/offline will only activate once deployed (or served locally).

Before going live, update:
- `manifest.webmanifest` — `start_url`/`scope` if not deployed at the domain root.
- Canonical URLs and `sitemap.xml` — currently point at `https://www.winetime.asia/`.
- `contact.html` — the map embed and exact address.
- Social links in `js/site.js` (`footerHTML()`) — currently placeholder Facebook/Instagram/YouTube URLs.

## Next steps worth considering

- Real product photography instead of the illustrative bottle icons on the homepage.
- Khmer translation (the original site also supported it, alongside English and French — now covered here, plus Simplified Chinese).
- A real form backend for contact/newsletter/event submissions.
- Swap the placeholder team initials in `about.html`, and the stock hero photos, for real photos once available.
