import fs from "fs";
import path from "path";

interface ProductData {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  serving: string;
  ingredients: string[];
  description: string;
}

const PRODUCTS: ProductData[] = [
  {
    slug: "cellunad",
    name: "CELLUNAD+",
    category: "NAD+ Optimization",
    tagline: "Precision NAD+ support with co-factors, not hype.",
    serving: "2 capsules daily",
    ingredients: [
      "Nicotinamide Riboside (NR) 500 mg",
      "Betaine (TMG) 250 mg",
      "R-Lipoic Acid 200 mg",
      "Apigenin 100 mg",
      "P-5-P (active B6) 10 mg",
      "5-MTHF 400 mcg DFE",
      "Methylcobalamin 1,000 mcg",
      "BioPerine 5 mg",
    ],
    description:
      "CELLUNAD+ is the daily NAD+ backbone of the Age Revive protocol. NR supports NAD+ pools, apigenin supports NAD+ pathway activity, and TMG plus methylated B vitamins support methylation pathways. Designed for daily consistency, not cycling.",
  },
  {
    slug: "cellubiome",
    name: "CELLUBIOME",
    category: "Mitochondrial + Gut Signaling",
    tagline: "The Gut–Mitochondria Axis, simplified.",
    serving: "2 enteric-coated capsules daily",
    ingredients: ["Urolithin A 500 mg", "Tributyrin 500 mg"],
    description:
      "CELLUBIOME targets the gut–mitochondria signaling pathway. Urolithin A supports mitochondrial recycling signaling (mitophagy support) while tributyrin supports short-chain fatty acid activity through butyrate delivery. Enteric-coated for precision delivery.",
  },
  {
    slug: "cellunova",
    name: "CELLUNOVA",
    category: "7-Day Autophagy + Senolytic Protocol",
    tagline: "Seven days on. Designed as a cycle, not forever.",
    serving: "5 capsules daily for 7 consecutive days",
    ingredients: [
      "NAC 600 mg",
      "Trans-Resveratrol 500 mg",
      "Quercetin 500 mg",
      "Calcium Alpha-Ketoglutarate 300 mg",
      "Green Tea Extract (50% EGCG) 300 mg",
      "Fisetin 100 mg",
      "Spermidine (wheat germ) 15 mg",
      "PQQ 10 mg",
      "Astaxanthin 4 mg",
      "BioPerine 5 mg",
    ],
    description:
      "CELLUNOVA is a 7-day monthly cycle designed to support autophagy and cellular cleanup pathways. The polyphenol stack of resveratrol, quercetin, and EGCG supports cellular maintenance, while NAC and astaxanthin support oxidative stress defense during the cycle. The off-cycle is part of the protocol.",
  },
];

const NAV_LINKS = `
<nav aria-label="Site navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/shop">Shop</a></li>
    <li><a href="/product/cellunad">CELLUNAD+</a></li>
    <li><a href="/product/cellubiome">CELLUBIOME</a></li>
    <li><a href="/product/cellunova">CELLUNOVA</a></li>
    <li><a href="/science">Science</a></li>
    <li><a href="/quality">Quality</a></li>
    <li><a href="/faq">FAQ</a></li>
  </ul>
</nav>`;

const FOOTER_HTML = `
<footer>
  <p>&copy; 2026 Age Revive</p>
  <nav aria-label="Footer navigation">
    <a href="/">Home</a> |
    <a href="/shop">Shop</a> |
    <a href="/product/cellunad">CELLUNAD+</a> |
    <a href="/product/cellubiome">CELLUBIOME</a> |
    <a href="/product/cellunova">CELLUNOVA</a> |
    <a href="/science">Science</a> |
    <a href="/quality">Quality</a> |
    <a href="/faq">FAQ</a>
  </nav>
  <p>*These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease.</p>
</footer>`;

function productToHtml(p: ProductData): string {
  return `
<section itemscope itemtype="https://schema.org/Product">
  <h2 itemprop="name">${p.name}</h2>
  <p itemprop="category">${p.category}</p>
  <p itemprop="description">${p.tagline}</p>
  <p>${p.description}</p>
  <h3>Ingredients</h3>
  <ul>
    ${p.ingredients.map((i) => `<li>${i}</li>`).join("\n    ")}
  </ul>
  <p>Serving: ${p.serving}</p>
</section>`;
}

function pageMetaTags(
  title: string,
  description: string,
  path: string
): string {
  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="https://agerevive.com${path}" />
    <link rel="canonical" href="https://agerevive.com${path}" />`;
}

const PAGE_CONTENT: Record<
  string,
  { title: string; description: string; html: string }
> = {
  "/": {
    title: "AGE REVIVE | Systemic Biological Architecture",
    description:
      "Protocol-grade cellular support. Three engineered formulas — CELLUNAD+ for NAD+ optimization, CELLUBIOME for gut–mitochondria signaling, and CELLUNOVA for 7-day autophagy cycling.",
    html: `
<article>
  <h1>Age Revive — Cellular Energy. Gut Resilience.</h1>
  <p>Three formulas. One system. NAD+ support, gut-mitochondria support, and a 7-day monthly cellular cleanup cycle.</p>
  ${NAV_LINKS}
  <ul>
    <li><a href="/product/cellunad">CELLUNAD+ — NAD+ Optimization</a></li>
    <li><a href="/product/cellubiome">CELLUBIOME — Gut–Mitochondria Support</a></li>
    <li><a href="/product/cellunova">CELLUNOVA — 7-Day Cellular Cleanup</a></li>
  </ul>
  ${FOOTER_HTML}
</article>`,
  },
  "/shop": {
    title: "Shop All Products | Age Revive",
    description:
      "Browse the complete Age Revive product line: CELLUNAD+ for NAD+ optimization, CELLUBIOME for gut–mitochondria support, and CELLUNOVA for 7-day cellular cleanup.",
    html: `
<article>
  <h1>Shop — Age Revive</h1>
  ${NAV_LINKS}
  <ul>
    ${PRODUCTS.map((p) => `<li><a href="/product/${p.slug}">${p.name} — ${p.category}</a>: ${p.tagline}</li>`).join("\n    ")}
  </ul>
  ${FOOTER_HTML}
</article>`,
  },
  "/science": {
    title: "Science & Research | Age Revive",
    description:
      "The scientific rationale behind every Age Revive formula. Evidence-based ingredients at clinically studied doses.",
    html: `
<article>
  <h1>Science & Research — Age Revive</h1>
  ${NAV_LINKS}
  <p>Every ingredient is chosen for its evidence base. Full dosing, sourcing, and rationale published for every ingredient.</p>
  ${FOOTER_HTML}
</article>`,
  },
  "/quality": {
    title: "Quality & Standards | Age Revive",
    description:
      "Third-party tested, cGMP manufactured, no proprietary blends. Full label disclosure on every product.",
    html: `
<article>
  <h1>Quality & Standards — Age Revive</h1>
  ${NAV_LINKS}
  <p>Third-party tested. cGMP manufactured. No proprietary blends. Every ingredient and dose fully disclosed.</p>
  ${FOOTER_HTML}
</article>`,
  },
  "/faq": {
    title: "Frequently Asked Questions | Age Revive",
    description:
      "Common questions about Age Revive products, ingredients, dosing, and the three-product system.",
    html: `
<article>
  <h1>Frequently Asked Questions — Age Revive</h1>
  ${NAV_LINKS}
  <p>Find answers about our products, ingredients, dosing, and how the three-product system works together.</p>
  ${FOOTER_HTML}
</article>`,
  },
};

function getProductPage(slug: string): { title: string; description: string; html: string } | null {
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;
  return {
    title: `${product.name} — ${product.category} | Age Revive`,
    description: `${product.tagline} ${product.description}`,
    html: `
<article>
  <h1>${product.name} — ${product.category}</h1>
  ${NAV_LINKS}
  ${productToHtml(product)}
  <p>${product.description}</p>

  <h2>Other Products</h2>
  <ul>
    ${PRODUCTS.filter((p) => p.slug !== slug)
      .map((p) => `<li><a href="/product/${p.slug}">${p.name} — ${p.category}</a></li>`)
      .join("\n    ")}
  </ul>
  ${FOOTER_HTML}
</article>`,
  };
}

export function getPageContent(routePath: string): { title: string; description: string; html: string } | null {
  if (PAGE_CONTENT[routePath]) return PAGE_CONTENT[routePath];

  const productMatch = routePath.match(/^\/product\/([a-z]+)$/);
  if (productMatch) return getProductPage(productMatch[1]);

  const productsMatch = routePath.match(/^\/products\/([a-z]+)$/);
  if (productsMatch) return getProductPage(productsMatch[1]);

  return null;
}

export function injectContent(html: string, routePath: string): string {
  const page = getPageContent(routePath);
  if (!page) return html;

  let result = html;

  result = result.replace(
    /<title>[^<]*<\/title>/,
    `<title>${page.title}</title>`
  );

  result = result.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${page.description}" />`
  );

  result = result.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${page.title}" />`
  );

  result = result.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${page.description}" />`
  );

  result = result.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="https://agerevive.com${routePath}" />`
  );

  result = result.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="https://agerevive.com${routePath}" />`
  );

  result = result.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n<div id="prerender" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${page.html}</div>`
  );

  return result;
}

export const ALL_ROUTES = [
  "/",
  "/shop",
  "/product/cellunad",
  "/product/cellubiome",
  "/product/cellunova",
  "/products/cellunad",
  "/products/cellubiome",
  "/products/cellunova",
  "/science",
  "/quality",
  "/faq",
];
