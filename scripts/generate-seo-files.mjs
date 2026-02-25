import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROUTES = [
  "/",
  "/shop",
  "/product/cellunad",
  "/product/cellubiome",
  "/product/cellunova",
  "/science",
  "/quality",
  "/faq",
  "/privacy",
  "/terms",
  "/shipping",
];

const SITE_URL_RAW = process.env.SITE_URL || process.env.VITE_SITE_URL || "https://agerevive.com";
const SITE_URL = SITE_URL_RAW.replace(/\/$/, "");

mkdirSync(resolve("client/public"), { recursive: true });

const priorities = {
  "/": "1.0",
  "/shop": "0.9",
  "/product/cellunad": "0.8",
  "/product/cellubiome": "0.8",
  "/product/cellunova": "0.8",
  "/science": "0.7",
  "/quality": "0.7",
  "/faq": "0.7",
  "/privacy": "0.4",
  "/terms": "0.4",
  "/shipping": "0.4",
};

const freqs = {
  "/": "weekly",
  "/shop": "weekly",
  "/privacy": "yearly",
  "/terms": "yearly",
  "/shipping": "yearly",
};

const sitemapXml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ROUTES.map((r) => {
    const loc = r === "/" ? SITE_URL : `${SITE_URL}${r}`;
    const freq = freqs[r] || "monthly";
    const priority = priorities[r] || "0.5";
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  }).join("\n") +
  `\n</urlset>\n`;

writeFileSync(resolve("client/public/sitemap.xml"), sitemapXml, "utf8");

const robotsTxt =
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

writeFileSync(resolve("client/public/robots.txt"), robotsTxt, "utf8");

const llmsTxt = `# Age Revive - Systemic Biological Architecture
# Protocol-grade cellular support supplements

> This file helps LLMs understand the site structure and high-signal pages.

## Brand
Name: Age Revive
Domain: ${SITE_URL}
Category: Dietary supplements (cellular health)

## Products
- CELLUNAD+ (NAD+ Optimization): ${SITE_URL}/product/cellunad
- CELLUBIOME (Gut-Mitochondria Signaling): ${SITE_URL}/product/cellubiome
- CELLUNOVA (7-Day Autophagy Cycle): ${SITE_URL}/product/cellunova
- Shop all: ${SITE_URL}/shop

## High-signal pages
- Science and research: ${SITE_URL}/science
- Quality standards: ${SITE_URL}/quality
- FAQ: ${SITE_URL}/faq

## Legal
- Privacy Policy: ${SITE_URL}/privacy
- Terms of Service: ${SITE_URL}/terms
- Shipping: ${SITE_URL}/shipping

## Structured data
- Every page includes JSON-LD (WebPage + BreadcrumbList)
- Product pages include Schema.org Product markup
- Site content is also available at /api/site-content (text/markdown)

## Disclaimers
- Products are dietary supplements, not medicines
- Statements have not been evaluated by the FDA
- Not intended to diagnose, treat, cure, or prevent any disease
`;

writeFileSync(resolve("client/public/llms.txt"), llmsTxt, "utf8");

console.log("Generated client/public/sitemap.xml, robots.txt, llms.txt using", SITE_URL);
