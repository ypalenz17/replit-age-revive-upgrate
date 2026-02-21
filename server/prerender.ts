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
  <p>Three protocols designed as a system: daily NAD+ support, the gut–mito signaling layer, and a 7-day monthly renewal cadence.</p>
  ${NAV_LINKS}

  <h2>The Age Revive Product Line</h2>
  ${PRODUCTS.map(productToHtml).join("\n")}

  <h2>The Age Revive Systems Axis</h2>
  <p>Three biological layers working together as an integrated protocol system:</p>
  <ul>
    <li><strong>Gut–Mito Axis</strong> — Urolithin A and tributyrin support the gut–mitochondria signaling pathway, linking digestive health to cellular energy.</li>
    <li><strong>NAD+ Backbone</strong> — NR, TMG, and apigenin provide the daily substrate for cellular repair, energy metabolism, and sirtuin activation.</li>
    <li><strong>Autophagy Cadence</strong> — A 7-day monthly cycle of fisetin, spermidine, and PQQ to trigger cellular cleanup and renewal.</li>
  </ul>

  <h2>Hallmarks of Aging</h2>
  <ul>
    <li>Genomic Stability — supported by CELLUNAD+ (NAD+, Sirtuins)</li>
    <li>Telomere Integrity — supported by CELLUNAD+ (NMN, Longevity)</li>
    <li>Epigenetic Signaling — supported by CELLUBIOME (Methylation, Gut Axis)</li>
    <li>Nutrient Sensing — supported by CELLUNOVA (AMPK, mTOR)</li>
    <li>Mitochondrial Function — supported by CELLUBIOME (Mitophagy, ATP)</li>
    <li>Cellular Senescence — supported by CELLUNOVA (Fisetin, Quercetin)</li>
  </ul>

  <h2>Protocol Design Principles</h2>
  <ul>
    <li>Standardized Actives: Every ingredient is dosed at clinically relevant levels with full transparency.</li>
    <li>Defined Cadence: Daily protocols (CELLUNAD+, CELLUBIOME) plus a monthly 7-day cycle (CELLUNOVA).</li>
    <li>Quality Controls: Third-party tested, GMP manufactured, no proprietary blends.</li>
  </ul>

  ${FOOTER_HTML}
</article>`,
  },
  "/shop": {
    title: "Shop All Products | Age Revive",
    description:
      "Browse the complete Age Revive protocol system: CELLUNAD+ for NAD+ optimization, CELLUBIOME for gut–mitochondria signaling, and CELLUNOVA for 7-day autophagy cycling.",
    html: `
<article>
  <h1>Shop — Age Revive Protocol System</h1>
  ${NAV_LINKS}
  <p>Three protocols designed as a system. Choose individual products or build your full protocol stack.</p>
  ${PRODUCTS.map(productToHtml).join("\n")}
  ${FOOTER_HTML}
</article>`,
  },
  "/science": {
    title: "Science & Research | Age Revive",
    description:
      "The scientific rationale behind every Age Revive formula. Mechanistic evidence, not marketing trends. Full dosing, sourcing, and rationale published for every ingredient.",
    html: `
<article>
  <h1>Science & Research — Age Revive</h1>
  ${NAV_LINKS}
  <p>Every ingredient is chosen for its mechanistic evidence, not marketing trends. Age Revive publishes full dosing, sourcing, and rationale.</p>

  <h2>The Systems Axis</h2>
  <p>The Age Revive protocol addresses aging through three coordinated biological layers:</p>
  <ul>
    <li><strong>NAD+ Metabolism</strong> — Nicotinamide Riboside (NR) as a precursor to NAD+, essential for energy metabolism, DNA repair, and sirtuin activation.</li>
    <li><strong>Gut–Mitochondria Signaling</strong> — Urolithin A supports mitophagy (mitochondrial recycling) while tributyrin provides butyrate for gut barrier integrity.</li>
    <li><strong>Autophagy & Cellular Maintenance</strong> — Cyclical protocols with polyphenols (fisetin, quercetin, resveratrol) to support cellular cleanup pathways.</li>
  </ul>

  <h2>Hallmarks of Aging Addressed</h2>
  <ul>
    <li>Genomic Stability</li>
    <li>Telomere Integrity</li>
    <li>Epigenetic Signaling</li>
    <li>Nutrient Sensing</li>
    <li>Mitochondrial Function</li>
    <li>Cellular Senescence</li>
  </ul>

  <h2>Ingredient Transparency</h2>
  <p>No proprietary blends. Every ingredient is listed with its exact dose, form, and purpose. All products are third-party tested and GMP manufactured.</p>
  ${FOOTER_HTML}
</article>`,
  },
  "/quality": {
    title: "Quality & Standards | Age Revive",
    description:
      "Third-party tested, GMP manufactured, no proprietary blends. Every Age Revive formula is built on transparency, standardized dosing, and clinical-grade sourcing.",
    html: `
<article>
  <h1>Quality & Standards — Age Revive</h1>
  ${NAV_LINKS}

  <h2>Manufacturing Standards</h2>
  <ul>
    <li>GMP (Good Manufacturing Practice) certified facilities</li>
    <li>Third-party tested for purity, potency, and contaminants</li>
    <li>No proprietary blends — every ingredient dose is fully disclosed</li>
  </ul>

  <h2>Ingredient Sourcing</h2>
  <ul>
    <li>Clinically relevant dosing based on published research</li>
    <li>Standardized extracts where applicable (e.g., 50% EGCG, ≥99% Urolithin A)</li>
    <li>Bioavailability-enhanced formulations (BioPerine, enteric coating)</li>
  </ul>

  <h2>Transparency Principles</h2>
  <p>Age Revive publishes full ingredient lists, doses, and rationale for every formula. We believe supplement transparency is a baseline, not a differentiator.</p>
  ${FOOTER_HTML}
</article>`,
  },
  "/faq": {
    title: "Frequently Asked Questions | Age Revive",
    description:
      "Common questions about Age Revive protocols, ingredients, dosing, cycling, and the Systems Axis approach to cellular health.",
    html: `
<article>
  <h1>Frequently Asked Questions — Age Revive</h1>
  ${NAV_LINKS}

  <h2>What is the Age Revive protocol?</h2>
  <p>The Age Revive protocol is a three-product system targeting cellular energy, gut–mitochondria signaling, and autophagy. CELLUNAD+ and CELLUBIOME are taken daily, while CELLUNOVA is cycled for 7 consecutive days per month.</p>

  <h2>Do I need to take all three products?</h2>
  <p>Each product works independently, but they are designed as an integrated system. CELLUNAD+ is the daily NAD+ backbone, CELLUBIOME targets the gut–mito axis, and CELLUNOVA provides periodic cellular cleanup support.</p>

  <h2>Why is CELLUNOVA a 7-day cycle?</h2>
  <p>CELLUNOVA is designed as a cyclical protocol, not a daily supplement. The 7-day on / 23-day off cadence is intentional — the off-cycle is part of the protocol design, allowing the body's natural cellular maintenance processes to respond.</p>

  <h2>Are your products third-party tested?</h2>
  <p>Yes. All Age Revive products are manufactured in GMP-certified facilities and undergo third-party testing for purity, potency, and contaminants. No proprietary blends are used.</p>

  <h2>What does "protocol-grade" mean?</h2>
  <p>Protocol-grade means every ingredient is dosed at clinically relevant levels, sourced for standardized potency, and designed as part of a defined system — not a standalone multivitamin or generic blend.</p>

  <h2>Can I take these with other supplements?</h2>
  <p>Consult your healthcare provider before combining with other supplements or medications, especially if you have existing health conditions.</p>
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
