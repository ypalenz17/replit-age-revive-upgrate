import { PRODUCT_DETAIL_DATA, PRODUCT_IMAGES } from "../client/src/productData";

type ProductSlug = "cellunad" | "cellubiome" | "cellunova";

interface PageContent {
  title: string;
  description: string;
  html: string;
  imagePath?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface SeoMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  canonicalUrl: string;
  ogType: "website" | "product";
  ogImageUrl: string;
  jsonLd: unknown[];
}

const BRAND_NAME = "Age Revive";
const SITE_ORIGIN = "https://agerevive.com";
const DEFAULT_OG_IMAGE_PATH = "/images/lifestyle-wellness_1.jpg";

export const PRODUCT_SLUGS: ProductSlug[] = ["cellunad", "cellubiome", "cellunova"];

const PRODUCT_SLUG_SET = new Set<ProductSlug>(PRODUCT_SLUGS);
const PRODUCT_ROUTE_REGEX = /^\/product\/([a-z0-9-]+)$/;
const PRODUCT_PURCHASE_REGEX = /^\/product\/([a-z0-9-]+)\/purchase$/;

const UTILITY_ROUTE_SET = new Set<string>(["/checkout", "/order-confirmed"]);

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do the three products fit together?",
    answer:
      "Age Revive is structured as a three-layer protocol: CELLUNAD+ daily NAD+ support, CELLUBIOME gut-mito signaling support, and CELLUNOVA as a periodic 7-day reset cycle.",
  },
  {
    question: "Can I take all three together?",
    answer:
      "Yes. The intended stack is daily CELLUNAD+ and CELLUBIOME with CELLUNOVA layered in as a periodic 7-day cycle.",
  },
  {
    question: "What is Nicotinamide Riboside (NR)?",
    answer:
      "Nicotinamide Riboside is a precursor cells use to synthesize NAD+, a coenzyme involved in cellular energy metabolism.",
  },
  {
    question: "What is urolithin A?",
    answer:
      "Urolithin A is a compound studied for biomarkers tied to mitochondrial health and mitophagy support.",
  },
  {
    question: "Is CELLUNOVA taken daily?",
    answer:
      "No. CELLUNOVA is a 7-day protocol used periodically, commonly monthly.",
  },
  {
    question: "Are your products third-party tested?",
    answer:
      "Yes. Testing focuses on identity, potency verification, and screening for common contaminants.",
  },
];

const QUALITY_FAQ_ITEMS: FaqItem[] = [
  {
    question: "Are your products third-party tested?",
    answer:
      "Yes. Testing focuses on identity, potency verification, and screening for contaminants.",
  },
  {
    question: "Can I see a Certificate of Analysis (CoA)?",
    answer:
      "Yes. Documentation can be requested with the product name and lot number.",
  },
  {
    question: "Do you use proprietary blends?",
    answer:
      "No. Every ingredient and dose is fully disclosed.",
  },
];

function buildFaqHtml(items: FaqItem[]): string {
  return `<dl>${items
    .map((item) => `<dt>${escapeHtml(item.question)}</dt><dd>${escapeHtml(item.answer)}</dd>`)
    .join("")}</dl>`;
}

const BASE_NAV_HTML = `
<nav aria-label="Site navigation">
  <a href="/">Home</a> |
  <a href="/shop">Shop</a> |
  <a href="/science">Science</a> |
  <a href="/quality">Quality</a> |
  <a href="/faq">FAQ</a> |
  <a href="/privacy">Privacy</a> |
  <a href="/terms">Terms</a> |
  <a href="/shipping">Shipping</a>
</nav>`;

const PAGE_CONTENT: Record<string, PageContent> = {
  "/": {
    title: "AGE REVIVE | Systemic Biological Architecture",
    description:
      "Protocol-grade cellular support. Three engineered formulas for NAD+ optimization, gut-mito signaling, and a 7-day autophagy cadence.",
    imagePath: "/images/lifestyle-wellness_1.jpg",
    html: `
<article>
  <h1>Age Revive - Systemic Biological Architecture</h1>
  ${BASE_NAV_HTML}
  <p>Three protocols designed as one system: CELLUNAD+, CELLUBIOME, and CELLUNOVA.</p>
  <ul>
    <li><a href="/product/cellunad">CELLUNAD+ - NAD+ Optimization</a></li>
    <li><a href="/product/cellubiome">CELLUBIOME - Gut-Mito Signaling</a></li>
    <li><a href="/product/cellunova">CELLUNOVA - 7-Day Autophagy Cycle</a></li>
  </ul>
</article>`,
  },
  "/shop": {
    title: "Shop All Products | Age Revive",
    description:
      "Browse the complete Age Revive product line: CELLUNAD+, CELLUBIOME, and CELLUNOVA.",
    imagePath: "/images/product-bottle_1.jpg",
    html: `
<article>
  <h1>Shop - Age Revive</h1>
  ${BASE_NAV_HTML}
  <ul>
    <li><a href="/product/cellunad">CELLUNAD+</a></li>
    <li><a href="/product/cellubiome">CELLUBIOME</a></li>
    <li><a href="/product/cellunova">CELLUNOVA</a></li>
  </ul>
</article>`,
  },
  "/science": {
    title: "Science & Research | Age Revive",
    description:
      "The scientific rationale behind Age Revive formulas, including NAD+ support, gut-mito signaling, and autophagy cadence.",
    imagePath: "/images/science-gut.jpg",
    html: `
<article>
  <h1>Science & Research</h1>
  ${BASE_NAV_HTML}
  <p>Age Revive formulas are built around transparent doses, delivery choices, and mechanism-first design.</p>
  <ul>
    <li>CELLUNAD+: daily NAD+ support with co-factors</li>
    <li>CELLUBIOME: gut-mito axis support with urolithin A and tributyrin</li>
    <li>CELLUNOVA: periodic 7-day autophagy-aligned cycle</li>
  </ul>
</article>`,
  },
  "/quality": {
    title: "Quality & Standards | Age Revive",
    description:
      "Third-party tested, cGMP manufactured, and fully disclosed formulas with lot traceability and documentation.",
    imagePath: "/images/lab-testing.jpg",
    html: `
<article>
  <h1>Quality You Can Verify</h1>
  ${BASE_NAV_HTML}
  <p>Quality is built around identity and potency verification, contaminant screening, and traceability.</p>
  <h2>Quality FAQ</h2>
  ${buildFaqHtml(QUALITY_FAQ_ITEMS)}
</article>`,
  },
  "/faq": {
    title: "FAQ | Protocol, Ingredients, Safety, Quality | Age Revive",
    description:
      "Common questions about protocol design, ingredients, safety, quality controls, and ordering.",
    imagePath: "/images/how-to-use.jpg",
    html: `
<article>
  <h1>Frequently Asked Questions</h1>
  ${BASE_NAV_HTML}
  ${buildFaqHtml(FAQ_ITEMS)}
</article>`,
  },
  "/privacy": {
    title: "Privacy Policy | Age Revive",
    description:
      "Privacy Policy for Age Revive, including data collection, usage, cookies, and rights requests.",
    html: `
<article>
  <h1>Privacy Policy</h1>
  ${BASE_NAV_HTML}
  <p>We collect the minimum data needed to run the store, fulfill orders, and support customers.</p>
</article>`,
  },
  "/terms": {
    title: "Terms of Service | Age Revive",
    description:
      "Terms of Service for Age Revive covering eligibility, orders, billing, shipping, and disclaimers.",
    html: `
<article>
  <h1>Terms of Service</h1>
  ${BASE_NAV_HTML}
  <p>These terms govern website use and purchases from the Age Revive store.</p>
</article>`,
  },
  "/shipping": {
    title: "Shipping | Age Revive",
    description:
      "Shipping information for Age Revive. Shipping is included in pricing, with tracking details provided after fulfillment.",
    html: `
<article>
  <h1>Shipping</h1>
  ${BASE_NAV_HTML}
  <p>Shipping is included in product pricing. Tracking is sent when available from carriers.</p>
</article>`,
  },
};

export const CANONICAL_ROUTES = [
  "/",
  "/science",
  "/quality",
  "/faq",
  "/privacy",
  "/terms",
  "/shipping",
  "/shop",
  "/product/cellunad",
  "/product/cellubiome",
  "/product/cellunova",
] as const;

const CANONICAL_ROUTE_SET = new Set<string>(CANONICAL_ROUTES);

export function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/";
  }

  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed || "/";
}

export function isKnownAppRoute(routePath: string): boolean {
  const normalizedPath = normalizePath(routePath);

  if (CANONICAL_ROUTE_SET.has(normalizedPath) || UTILITY_ROUTE_SET.has(normalizedPath)) {
    return true;
  }

  const purchaseMatch = normalizedPath.match(PRODUCT_PURCHASE_REGEX);
  if (!purchaseMatch) {
    return false;
  }

  return PRODUCT_SLUG_SET.has(purchaseMatch[1] as ProductSlug);
}

function isProductSlug(value: string): value is ProductSlug {
  return PRODUCT_SLUG_SET.has(value as ProductSlug);
}

function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  if (!pathOrUrl.startsWith("/")) {
    return `${SITE_ORIGIN}/${pathOrUrl}`;
  }

  return `${SITE_ORIGIN}${pathOrUrl}`;
}

function buildBreadcrumb(path: string, label: string): unknown {
  const baseItems: Array<{ "@type": "ListItem"; position: number; name: string; item: string }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_ORIGIN}/`,
    },
  ];

  if (path.startsWith("/product/")) {
    baseItems.push({
      "@type": "ListItem",
      position: 2,
      name: "Shop",
      item: `${SITE_ORIGIN}/shop`,
    });

    baseItems.push({
      "@type": "ListItem",
      position: 3,
      name: label,
      item: `${SITE_ORIGIN}${path}`,
    });
  } else {
    baseItems.push({
      "@type": "ListItem",
      position: 2,
      name: label,
      item: `${SITE_ORIGIN}${path}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: baseItems,
  };
}

function buildCommonJsonLd(): unknown[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: BRAND_NAME,
      url: `${SITE_ORIGIN}/`,
      brand: {
        "@type": "Brand",
        name: BRAND_NAME,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: BRAND_NAME,
      url: `${SITE_ORIGIN}/`,
    },
  ];
}

function getProductPage(slug: ProductSlug): PageContent {
  const detail = PRODUCT_DETAIL_DATA[slug];
  const imagePath = PRODUCT_IMAGES[slug]?.[0] || DEFAULT_OG_IMAGE_PATH;
  const ingredientRows = detail.supplementFacts.items
    .map((item) => `<li>${escapeHtml(item.name)}: ${escapeHtml(item.amount)}</li>`)
    .join("");

  const subtitle = (detail.subtitle || detail.tagline || "").replace(/\*/g, "").trim();

  return {
    title: `${detail.name} | Age Revive`,
    description: subtitle,
    imagePath,
    html: `
<article>
  <h1>${escapeHtml(detail.name)}</h1>
  ${BASE_NAV_HTML}
  <p>${escapeHtml(subtitle)}</p>
  <p>Price: $${detail.priceOneTime.toFixed(2)} USD</p>
  <p>Serving: ${escapeHtml(detail.serving)}</p>
  <h2>Supplement Facts</h2>
  <ul>${ingredientRows}</ul>
  <p><a href="/shop">Back to shop</a></p>
</article>`,
  };
}

function buildProductJsonLd(slug: ProductSlug, canonicalUrl: string): unknown {
  const detail = PRODUCT_DETAIL_DATA[slug];
  const images = PRODUCT_IMAGES[slug]?.map((imagePath) => toAbsoluteUrl(imagePath)) || [toAbsoluteUrl(DEFAULT_OG_IMAGE_PATH)];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: detail.name,
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
    },
    description: (detail.subtitle || detail.tagline || "").replace(/\*/g, "").trim(),
    image: images,
    url: canonicalUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: detail.priceOneTime.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: canonicalUrl,
    },
  };
}

function buildFaqJsonLd(items: FaqItem[]): unknown {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function getRouteLabel(routePath: string, productName?: string): string {
  switch (routePath) {
    case "/science":
      return "Science";
    case "/quality":
      return "Quality";
    case "/faq":
      return "FAQ";
    case "/shop":
      return "Shop";
    default:
      return productName || "Page";
  }
}

function buildSeoMetadata(routePath: string, page: PageContent): SeoMetadata {
  const canonicalPath = routePath === "/" ? "/" : routePath;
  const canonicalUrl = canonicalPath === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${canonicalPath}`;
  const productMatch = routePath.match(PRODUCT_ROUTE_REGEX);
  const routeJsonLd = buildCommonJsonLd();

  let ogType: "website" | "product" = "website";

  if (productMatch && isProductSlug(productMatch[1])) {
    const slug = productMatch[1];
    ogType = "product";
    routeJsonLd.push(buildProductJsonLd(slug, canonicalUrl));
    routeJsonLd.push(buildBreadcrumb(routePath, getRouteLabel(routePath, PRODUCT_DETAIL_DATA[slug].name)));
  }

  if (routePath === "/faq") {
    routeJsonLd.push(buildFaqJsonLd(FAQ_ITEMS));
    routeJsonLd.push(buildBreadcrumb(routePath, getRouteLabel(routePath)));
  }

  if (routePath === "/quality") {
    routeJsonLd.push(buildFaqJsonLd(QUALITY_FAQ_ITEMS));
    routeJsonLd.push(buildBreadcrumb(routePath, getRouteLabel(routePath)));
  }

  if (routePath === "/science" || routePath === "/shop") {
    routeJsonLd.push(buildBreadcrumb(routePath, getRouteLabel(routePath)));
  }

  return {
    title: page.title,
    description: page.description,
    canonicalPath,
    canonicalUrl,
    ogType,
    ogImageUrl: toAbsoluteUrl(page.imagePath || DEFAULT_OG_IMAGE_PATH),
    jsonLd: routeJsonLd,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stringifyJsonLd(jsonLd: unknown): string {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

const SEO_BLOCK_REGEX = /<!-- SEO:BEGIN -->[\s\S]*?<!-- SEO:END -->/;

function renderSeoBlock(metadata: SeoMetadata): string {
  const jsonLdScripts = metadata.jsonLd
    .map((schema) => `  <script type="application/ld+json">${stringifyJsonLd(schema)}</script>`)
    .join("\n");

  return [
    "<!-- SEO:BEGIN -->",
    `  <title>${escapeHtml(metadata.title)}</title>`,
    `  <meta name=\"description\" content=\"${escapeHtml(metadata.description)}\" />`,
    "  <meta name=\"robots\" content=\"index,follow\" />",
    `  <link rel=\"canonical\" href=\"${metadata.canonicalUrl}\" />`,
    `  <meta property=\"og:type\" content=\"${metadata.ogType}\" />`,
    `  <meta property=\"og:site_name\" content=\"${escapeHtml(BRAND_NAME)}\" />`,
    `  <meta property=\"og:title\" content=\"${escapeHtml(metadata.title)}\" />`,
    `  <meta property=\"og:description\" content=\"${escapeHtml(metadata.description)}\" />`,
    `  <meta property=\"og:url\" content=\"${metadata.canonicalUrl}\" />`,
    `  <meta property=\"og:image\" content=\"${metadata.ogImageUrl}\" />`,
    "  <meta name=\"twitter:card\" content=\"summary_large_image\" />",
    `  <meta name=\"twitter:title\" content=\"${escapeHtml(metadata.title)}\" />`,
    `  <meta name=\"twitter:description\" content=\"${escapeHtml(metadata.description)}\" />`,
    `  <meta name=\"twitter:image\" content=\"${metadata.ogImageUrl}\" />`,
    jsonLdScripts,
    "<!-- SEO:END -->",
  ].join("\n");
}

function injectSeoBlock(html: string, seoBlock: string): string {
  if (SEO_BLOCK_REGEX.test(html)) {
    return html.replace(SEO_BLOCK_REGEX, seoBlock);
  }

  return html.replace("</head>", `${seoBlock}\n</head>`);
}

function buildPrerenderNode(contentHtml: string): string {
  return `<div id="prerender" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${contentHtml}</div>`;
}

export function getPageContent(routePath: string): PageContent | null {
  const normalizedPath = normalizePath(routePath);

  if (PAGE_CONTENT[normalizedPath]) {
    return PAGE_CONTENT[normalizedPath];
  }

  const productMatch = normalizedPath.match(PRODUCT_ROUTE_REGEX);
  if (!productMatch || !isProductSlug(productMatch[1])) {
    return null;
  }

  return getProductPage(productMatch[1]);
}

export function renderPrerenderedPage(routePath: string): string | null {
  const normalizedPath = normalizePath(routePath);
  const page = getPageContent(normalizedPath);
  if (!page) {
    return null;
  }

  const metadata = buildSeoMetadata(normalizedPath, page);
  const seoBlock = renderSeoBlock(metadata).replace(/<!-- SEO:BEGIN -->\n?|\n?<!-- SEO:END -->/g, "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${seoBlock}
</head>
<body>
${page.html}
</body>
</html>`;
}

export function injectContent(html: string, routePath: string): string {
  const normalizedPath = normalizePath(routePath);
  const page = getPageContent(normalizedPath);
  if (!page) {
    return html;
  }

  const metadata = buildSeoMetadata(normalizedPath, page);
  const seoBlock = renderSeoBlock(metadata);

  let result = injectSeoBlock(html, seoBlock);

  if (result.includes("<div id=\"prerender\"")) {
    result = result.replace(/<div id=\"prerender\"[\s\S]*?<\/div>/, buildPrerenderNode(page.html));
  } else {
    result = result.replace("<div id=\"root\"></div>", `<div id=\"root\"></div>\n${buildPrerenderNode(page.html)}`);
  }

  return result;
}

export const ALL_ROUTES = [...CANONICAL_ROUTES];
