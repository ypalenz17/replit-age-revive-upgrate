import {
  EVIDENCE_TABLES,
  FAQ as SCIENCE_FAQ_ITEMS,
  FINAL_CTA,
  GLOSSARY,
  LAYERS,
  REFERENCES,
  STANDARDS,
  TRUST_MARKERS,
} from "../client/src/science/scienceContent";
import { FAQ_CATEGORIES } from "../client/src/content/faqContent";
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
const ORGANIZATION_LOGO_URL = `${SITE_ORIGIN}/favicon.png`;

export const PRODUCT_SLUGS: ProductSlug[] = ["cellunad", "cellubiome", "cellunova"];

const PRODUCT_SLUG_SET = new Set<ProductSlug>(PRODUCT_SLUGS);
const PRODUCT_ROUTE_REGEX = /^\/product\/([a-z0-9-]+)$/;
const PRODUCT_PURCHASE_REGEX = /^\/product\/([a-z0-9-]+)\/purchase$/;

const UTILITY_ROUTE_SET = new Set<string>(["/checkout", "/order-confirmed", "/login", "/signup", "/account"]);

const FAQ_ITEMS: FaqItem[] = FAQ_CATEGORIES.flatMap((category) =>
  category.items.map((item) => ({ question: item.q, answer: item.a })),
);

const QUALITY_FAQ_ITEMS: FaqItem[] = [
  {
    question: "What does third-party tested mean here?",
    answer:
      "It means independent testing is used to verify identity and potency and to screen for common contaminants. Exact panels can vary by ingredient and risk profile.",
  },
  {
    question: "Do you provide Certificates of Analysis (CoAs)?",
    answer:
      "Documentation can be provided upon request. Provide product name and the lot number printed on the bottle so the correct batch records are retrieved.",
  },
  {
    question: "Do you use proprietary blends?",
    answer:
      "No. Proprietary blends hide doses and prevent meaningful evaluation. Age Revive discloses core actives and doses so the product can be audited.",
  },
  {
    question: "What contaminants do you screen for?",
    answer:
      "Common screening categories include identity verification, potency, heavy metals, and microbiological contaminants. Additional panels may apply based on ingredient sourcing and extraction methods.",
  },
  {
    question: "How do you handle allergens?",
    answer:
      "Known allergens should be disclosed on-label. CELLUNOVA contains wheat (spermidine source). If you have allergies or sensitivities, review Supplement Facts and consult a clinician if needed.",
  },
  {
    question: "How do I find my lot number?",
    answer:
      "Lot numbers are printed on the bottle, often near the label edge or on the bottom. Use that lot number when requesting documentation so the correct records are pulled.",
  },
  {
    question: "Is this page medical advice?",
    answer:
      "No. This page explains manufacturing and quality concepts. Products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease.",
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

function buildSimpleList(items: string[]): string {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function buildScienceHtml(): string {
  const trustMarkers = `<section><h2>Trust markers</h2>${buildSimpleList(
    TRUST_MARKERS.map((item) => `${item.title}: ${item.detail}`),
  )}</section>`;

  const protocolLayers = `<section><h2>Three layers, one system</h2>${LAYERS.map(
    (layer) => `<article>
  <h3>${escapeHtml(layer.productName)}</h3>
  <p><strong>${escapeHtml(layer.roleTitle)}.</strong> ${escapeHtml(layer.roleBody)}</p>
  ${buildSimpleList(layer.bullets)}
</article>`,
  ).join("")}</section>`;

  const standards = `<section><h2>Our standards</h2>${buildSimpleList(
    STANDARDS.map((item) => `${item.title}: ${item.body}`),
  )}</section>`;

  const evidence = `<section><h2>Evidence and dosing</h2>${EVIDENCE_TABLES.map(
    (table) => `<article>
  <h3>${escapeHtml(table.product)}</h3>
  <p>${escapeHtml(table.caption)}</p>
  <table>
    <thead><tr><th>Ingredient</th><th>Dose</th><th>Purpose</th></tr></thead>
    <tbody>${table.rows
      .map((row) => `<tr><td>${escapeHtml(row.ingredient)}</td><td>${escapeHtml(row.dose)}</td><td>${escapeHtml(row.why)}${row.notes ? ` (${escapeHtml(row.notes)})` : ""}</td></tr>`)
      .join("")}</tbody>
  </table>
</article>`,
  ).join("")}</section>`;

  const glossary = `<section><h2>Glossary</h2><dl>${GLOSSARY.map(
    (item) => `<dt>${escapeHtml(item.term)}</dt><dd>${escapeHtml(item.definition)}</dd>`,
  ).join("")}</dl></section>`;

  const references = `<section><h2>References</h2><ol>${REFERENCES.map(
    (item) => `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a>${item.note ? `<p>${escapeHtml(item.note)}</p>` : ""}</li>`,
  ).join("")}</ol></section>`;

  const deepDive = `<section>
  <h2>NAD+ foundation</h2>
  <p>NAD+ is a coenzyme central to cellular energy metabolism and enzymatic processes associated with cellular maintenance. NR is a precursor cells use to synthesize NAD+.</p>
  <p>CELLUNAD+ uses 500 mg Nicotinamide Riboside (NR) as a daily foundation to support intracellular NAD+ availability, with methylation and co-factor support including TMG, 5-MTHF, methylcobalamin, and P-5-P.</p>
  <h2>Gut-mitochondria axis</h2>
  <p>CELLUBIOME targets the gut-mito interface by pairing urolithin A mitophagy support with tributyrin butyrate delivery and enteric protection.</p>
  <h2>Controlled reset</h2>
  <p>CELLUNOVA is intentionally not daily. It is a 7-day protocol designed to periodically support autophagy-related pathways, mitochondrial resilience, and exposure to senescence research compounds.</p>
  <h2>Delivery matters</h2>
  <p>If the goal is intestinal action, formulation delivery integrity is required. Enteric protection is used when stomach exposure compromises intended downstream action.</p>
  <h2>Quality and testing</h2>
  <p>Quality is built around cGMP manufacturing baseline, label transparency, and third-party testing for identity, potency, and contaminant screening.</p>
</section>`;

  const finalCta = `<section><h2>${escapeHtml(FINAL_CTA.headline)}</h2><p>${escapeHtml(FINAL_CTA.body)}</p><ul>${FINAL_CTA.cards
    .map((card) => `<li><a href="${escapeHtml(card.href)}">${escapeHtml(card.title)}</a> - ${escapeHtml(card.body)}</li>`)
    .join("")}</ul></section>`;

  return `<article>
  <h1>Science | Age Revive</h1>
  ${BASE_NAV_HTML}
  <p>This page explains protocol architecture, ingredient rationale, delivery, testing, and evidence summaries.</p>
  ${trustMarkers}
  ${protocolLayers}
  ${standards}
  ${deepDive}
  <section><h2>Science FAQ</h2>${buildFaqHtml(SCIENCE_FAQ_ITEMS.map((item) => ({ question: item.q, answer: item.a })))}</section>
  ${evidence}
  ${glossary}
  ${references}
  ${finalCta}
</article>`;
}

function buildQualityHtml(): string {
  const qualityChecklist = [
    "Is the full dose disclosed for each core active (no proprietary blend)?",
    "Is there identity verification for each lot?",
    "Is there potency verification for the finished product?",
    "Is there contaminant screening appropriate to ingredient risk profile?",
    "Is there traceability with lot numbers and batch records?",
    "If delivery claims exist, is delivery integrity validated?",
  ];

  return `<article>
  <h1>Quality Standards</h1>
  ${BASE_NAV_HTML}
  <p>Quality is built around transparent dosing, identity and potency verification, contaminant screening, and lot traceability.</p>
  <p>Credibility comes from discipline: transparent dosing, identity and potency verification, contaminant screening concepts, lot traceability, and documentation that matches what is on label.</p>
  <section>
    <h2>Quality overview</h2>
    ${buildSimpleList([
      "Identity and potency verification for finished product",
      "Contaminant screening categories aligned to ingredient risk profile",
      "Lot-level traceability and documentation support",
      "Delivery integrity validation for targeted release formats",
    ])}
  </section>
  <section>
    <h2>Simple buyer audit checklist</h2>
    ${buildSimpleList(qualityChecklist)}
  </section>
  <section>
    <h2>Testing standards</h2>
    <table>
      <thead><tr><th>Category</th><th>What it checks</th><th>Why it matters</th></tr></thead>
      <tbody>
        <tr><td>Identity</td><td>Confirms ingredient matches label claim.</td><td>Prevents substitution and sourcing errors.</td></tr>
        <tr><td>Potency</td><td>Confirms labeled actives are present at labeled dose.</td><td>Dose connects research and product output.</td></tr>
        <tr><td>Heavy metals</td><td>Screens for lead, arsenic, cadmium, mercury.</td><td>Reduces avoidable exposure risk.</td></tr>
        <tr><td>Microbiological</td><td>Screens for microbial contamination.</td><td>Protects production and storage quality.</td></tr>
        <tr><td>Residual solvents</td><td>Screens extraction-related residues where relevant.</td><td>Supports extraction quality control.</td></tr>
        <tr><td>Format integrity</td><td>Checks delivery integrity where enteric or targeted release is used.</td><td>Delivery claims require verification.</td></tr>
      </tbody>
    </table>
  </section>
  <section>
    <h2>Manufacturing and compliance</h2>
    ${buildSimpleList([
      "cGMP manufacturing is baseline, not a premium signal by itself.",
      "Supplier qualification is required because raw material variability exists.",
      "Release criteria should tie to identity, potency, and contaminant thresholds.",
      "For longevity protocols, consistency across lots matters as much as mechanism selection.",
    ])}
  </section>
  <section>
    <h2>Traceability and documentation</h2>
    ${buildSimpleList([
      "Lot numbers should be printed on bottles.",
      "Batch records should tie raw material and finished product checks to each lot.",
      "Documentation requests should include product name and lot number.",
    ])}
  </section>
  <section>
    <h2>Label transparency</h2>
    ${buildSimpleList([
      "No proprietary blends.",
      "Core actives and doses are disclosed so research comparisons are possible.",
      "Known allergens are disclosed on-label (CELLUNOVA contains wheat).",
    ])}
  </section>
  <section>
    <h2>Product-specific notes</h2>
    <ul>
      <li><strong>CELLUNAD+:</strong> Daily NAD+ pathway support where consistency and dose transparency are critical.</li>
      <li><strong>CELLUBIOME:</strong> Gut and mitochondrial support where enteric delivery integrity is part of design intent.</li>
      <li><strong>CELLUNOVA:</strong> 7-day protocol where batch controls and allergen disclosure are important.</li>
    </ul>
  </section>
  <section>
    <h2>Quality FAQ</h2>
    ${buildFaqHtml(QUALITY_FAQ_ITEMS)}
  </section>
</article>`;
}

function buildPrivacyHtml(): string {
  return `<article>
  <h1>Privacy Policy</h1>
  ${BASE_NAV_HTML}
  <p>A clear summary of what we collect, why we collect it, and how you can control it.</p>
  <section><h2>Summary</h2><p>We collect the minimum data needed to operate the store, support customers, prevent fraud, and improve site performance.</p><p>We do not sell personal information for money and use service providers to run the store and fulfill orders.</p></section>
  <section><h2>Data we collect</h2>${buildSimpleList([
    "Account data: name, email, password hash, and account preferences.",
    "Order data: shipping address, billing details, purchased items, and order history.",
    "Support data: support messages and related metadata.",
    "Device and usage data: pages viewed, referral source, browser details, and approximate location.",
    "Payment data is handled by payment providers; full card numbers are not stored on Age Revive servers.",
  ])}</section>
  <section><h2>How data is used</h2>${buildSimpleList([
    "Order fulfillment, shipping, and customer support.",
    "Payment processing and fraud prevention.",
    "Site performance and UX improvements.",
    "Transactional messages and permitted marketing communications.",
  ])}</section>
  <section><h2>Sharing and service providers</h2><p>Data is shared with service providers only as needed to operate the store, including payments, fulfillment, analytics, and support. Providers are expected to handle data securely and only for services they provide.</p><p>Information may also be disclosed if required by law or to protect customers, systems, and company integrity.</p></section>
  <section><h2>Cookies and analytics</h2><p>Cookies and similar technologies help keep users signed in, maintain cart state, and measure site performance. Browser settings can be used to control cookies.</p></section>
  <section><h2>Security</h2><p>Administrative, technical, and physical safeguards are used to protect personal information. No system can guarantee perfect security.</p></section>
  <section><h2>Retention</h2><p>Data is retained only as long as required for store operations, legal obligations, dispute handling, and agreement enforcement.</p></section>
  <section><h2>Your rights</h2><p>Depending on location, users may have rights to access, correct, delete, or export certain personal information, and to opt out of some marketing communications.</p></section>
  <section><h2>Children</h2><p>The website is not directed to children under 13, and Age Revive does not knowingly collect personal information from children under 13.</p></section>
  <section><h2>Policy changes</h2><p>This policy may be updated over time. Material updates will be posted on this page with a revised date.</p></section>
  <section><h2>Rights and contact</h2><p>Requests and privacy questions can be sent to support@agerevive.com.</p></section>
</article>`;
}

function buildTermsHtml(): string {
  return `<article>
  <h1>Terms of Service</h1>
  ${BASE_NAV_HTML}
  <section><h2>Overview</h2><p>These terms govern website access and purchases through the Age Revive store. By using the website, you agree to these terms.</p></section>
  <section><h2>Eligibility</h2><p>You must be able to form a binding contract in your jurisdiction and provide accurate account and checkout information.</p></section>
  <section><h2>Orders and billing</h2><p>Prices and availability may change without notice. Orders may be refused or canceled for suspected fraud, inventory issues, or pricing errors. Payment processing is handled by third-party processors.</p></section>
  <section><h2>Subscriptions</h2><p>If subscriptions are offered, terms for management, pause, and cancellation are provided on product pages or checkout flows.</p></section>
  <section><h2>Shipping</h2><p>Shipping is included in product pricing. Taxes and delivery estimates are shown at checkout. Shipping details are also available on the Shipping page.</p></section>
  <section><h2>Returns and refunds</h2><p>Return/refund terms, where applicable, are presented in policy information and checkout flows. For order-specific issues, contact support with order number.</p></section>
  <section><h2>Disclaimers</h2><p>Products are dietary supplements and are not intended to diagnose, treat, cure, or prevent disease. Site content is informational and not medical advice. Individual response varies.</p></section>
  <section><h2>Limitation of liability</h2><p>To the maximum extent permitted by law, Age Revive is not liable for indirect, incidental, special, consequential, or punitive damages arising from site or product use.</p></section>
  <section><h2>Intellectual property</h2><p>Website content, trademarks, and design elements are owned by Age Revive or licensors and protected by applicable law.</p></section>
  <section><h2>Governing law</h2><p>These terms are governed by applicable law in the jurisdiction where Age Revive operates.</p></section>
  <section><h2>Contact</h2><p>Questions about these terms can be sent to support@agerevive.com.</p></section>
</article>`;
}

function buildShippingHtml(): string {
  return `<article>
  <h1>Shipping</h1>
  ${BASE_NAV_HTML}
  <p>Shipping is always included in product pricing. The listed product price includes shipping to your door.</p>
  <section><h2>Rates and taxes</h2><p>Shipping is included in product pricing. Applicable taxes are calculated at checkout based on location.</p></section>
  <section><h2>Processing and tracking</h2><p>Orders are processed before shipment. Tracking links are typically emailed after the order ships when available from carriers.</p></section>
  <section><h2>Address changes and issues</h2>${buildSimpleList([
    "Address changes may be possible before processing completes.",
    "For delayed, lost, or damaged shipments, contact support with order number and tracking details.",
  ])}</section>
  <section><h2>International</h2><p>If international shipping is offered, options appear at checkout. Import duties or customs fees may apply by destination unless otherwise stated.</p></section>
  <section><h2>Shipping FAQ</h2>${buildFaqHtml([
    {
      question: "Is shipping really included?",
      answer: "Yes. Shipping is included in the listed product price.",
    },
    {
      question: "When do I get tracking?",
      answer: "When available from carriers, tracking is sent by email after the order ships.",
    },
    {
      question: "Can I change my address after ordering?",
      answer: "Possibly, if the order has not been processed. Contact support immediately with order number.",
    },
    {
      question: "What if my package is damaged?",
      answer: "Contact support with package and product photos for resolution.",
    },
  ])}</section>
</article>`;
}

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
  <p>Three formulas. One system. Build your protocol from the ground up.</p>
  <ul>${PRODUCT_SLUGS.map((slug) => {
    const detail = PRODUCT_DETAIL_DATA[slug];
    const subtitle = (detail.subtitle || detail.tagline || "").replace(/\*/g, "").trim();
    return `<li><a href="/product/${slug}">${escapeHtml(detail.name)}</a> - ${escapeHtml(subtitle)} ($${detail.priceOneTime.toFixed(2)} USD)</li>`;
  }).join("")}</ul>
</article>`,
  },
  "/science": {
    title: "Science | Age Revive",
    description:
      "Learn the protocol design behind Age Revive: NAD+ restoration, gut-mitochondria support, and periodic cellular reset.",
    imagePath: "/images/science-gut.jpg",
    html: buildScienceHtml(),
  },
  "/quality": {
    title: "Quality Standards | Testing, Traceability, Transparency | Age Revive",
    description:
      "How Age Revive approaches supplement quality: transparent dosing, identity and potency verification, contaminant screening concepts, lot traceability, and documentation requests.",
    imagePath: "/images/lab-testing.jpg",
    html: buildQualityHtml(),
  },
  "/faq": {
    title: "FAQ | Protocol, Ingredients, Safety, Quality | Age Revive",
    description:
      "Frequently asked questions about Age Revive: protocol structure, ingredients, safety, quality testing, and ordering support.",
    imagePath: "/images/how-to-use.jpg",
    html: `
<article>
  <h1>Frequently Asked Questions</h1>
  ${BASE_NAV_HTML}
  <p>Direct answers about protocol structure, ingredients, safety, quality verification, and practical ordering topics.</p>
  ${buildFaqHtml(FAQ_ITEMS)}
</article>`,
  },
  "/privacy": {
    title: "Privacy Policy | Age Revive",
    description:
      "Privacy Policy for Age Revive. Learn what data we collect, how we use it, and how to request access or deletion.",
    html: buildPrivacyHtml(),
  },
  "/terms": {
    title: "Terms of Service | Age Revive",
    description:
      "Terms of Service for Age Revive. Review eligibility, orders, billing, shipping, disclaimers, and limitations of liability.",
    html: buildTermsHtml(),
  },
  "/shipping": {
    title: "Shipping | Age Revive",
    description:
      "Shipping information for Age Revive. Shipping is always included in price, with tracking details provided when available.",
    html: buildShippingHtml(),
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
      logo: ORGANIZATION_LOGO_URL,
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
  const heroBullets = detail.heroBullets.points
    .map((point) => `<li>${escapeHtml(point.replace(/\*/g, "").trim())}</li>`)
    .join("");
  const benefitRows = detail.benefitHighlights
    .map((item) => `<li><strong>${escapeHtml(item.title)}:</strong> ${escapeHtml(item.desc.replace(/\*/g, "").trim())}</li>`)
    .join("");
  const faqRows = detail.faq
    .map((item) => `<dt>${escapeHtml(item.q)}</dt><dd>${escapeHtml(item.a)}</dd>`)
    .join("");

  const subtitle = (detail.subtitle || detail.tagline || "").replace(/\*/g, "").trim();
  const lead = detail.heroBullets.lead.replace(/\*/g, "").trim();

  return {
    title: `${detail.name} | Age Revive`,
    description: subtitle,
    imagePath,
    html: `
<article>
  <h1>${escapeHtml(detail.name)}</h1>
  ${BASE_NAV_HTML}
  <p>${escapeHtml(subtitle)}</p>
  <p>${escapeHtml(lead)}</p>
  <p>Price: $${detail.priceOneTime.toFixed(2)} USD</p>
  <p>Serving: ${escapeHtml(detail.serving)}</p>
  <h2>Protocol highlights</h2>
  <ul>${heroBullets}</ul>
  <h2>Key benefits</h2>
  <ul>${benefitRows}</ul>
  <h2>Supplement Facts</h2>
  <ul>${ingredientRows}</ul>
  <h2>Common questions</h2>
  <dl>${faqRows}</dl>
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
