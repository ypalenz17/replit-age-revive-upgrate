import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROUTES = [
  "/",
  "/science",
  "/quality",
  "/faq",
  "/shop",
  "/product/cellunad",
  "/product/cellubiome",
  "/product/cellunova",
  "/privacy",
  "/terms",
  "/shipping",
];

const SITE_URL_RAW = process.env.SITE_URL || process.env.VITE_SITE_URL || "https://agerevive.com";
const SITE_URL = SITE_URL_RAW.replace(/\/$/, "");
const LASTMOD = new Date().toISOString().slice(0, 10);

mkdirSync(resolve("client/public"), { recursive: true });

const sitemapXml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ROUTES.map((routePath) => {
    const loc = routePath === "/" ? `${SITE_URL}/` : `${SITE_URL}${routePath}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n  </url>`;
  }).join("\n") +
  `\n</urlset>\n`;

writeFileSync(resolve("client/public/sitemap.xml"), sitemapXml, "utf8");

const robotsTxt = [
  "User-agent: OAI-SearchBot",
  "Allow: /",
  "",
  "User-agent: GPTBot",
  "Allow: /",
  "",
  "User-agent: ClaudeBot",
  "Allow: /",
  "",
  "User-agent: Claude-Web",
  "Allow: /",
  "",
  "User-agent: ChatGPT-User",
  "Allow: /",
  "",
  "User-agent: PerplexityBot",
  "Allow: /",
  "",
  "User-agent: Google-Extended",
  "Allow: /",
  "",
  "User-agent: Applebot",
  "Allow: /",
  "",
  "User-agent: Bytespider",
  "Allow: /",
  "",
  "User-agent: CCBot",
  "Allow: /",
  "",
  "User-agent: anthropic-ai",
  "Allow: /",
  "",
  "User-agent: *",
  "Allow: /",
  "Disallow: /api/",
  "Disallow: /checkout",
  "Disallow: /order-confirmed",
  "Disallow: /cart",
  "Disallow: /account",
  "Disallow: /product/*/purchase",
  "",
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  "",
].join("\n");

writeFileSync(resolve("client/public/robots.txt"), robotsTxt, "utf8");

const llmsTxt = [
  "# Age Revive",
  "",
  "> Age Revive is a premium longevity supplement brand offering a three-product cellular health system. Every formula uses clinically studied doses, full label disclosure (no proprietary blends), and third-party testing. The system targets NAD+ metabolism, gut-barrier integrity, mitochondrial renewal, and autophagy-related pathways.",
  "",
  "## Pages",
  "",
  `> ${SITE_URL}/ — Homepage. Overview of the Age Revive three-product longevity system, brand philosophy, and product navigation.`,
  `> ${SITE_URL}/science — Science page. Research-backed explanations of NAD+ metabolism, the gut–mitochondria axis, autophagy pathways, and how each product supports cellular health.`,
  `> ${SITE_URL}/quality — Quality page. Manufacturing standards, third-party testing protocols, cGMP compliance, and full label disclosure policy.`,
  `> ${SITE_URL}/faq — FAQ page. Answers to common questions about products, ingredients, dosing, subscriptions, shipping, and returns.`,
  `> ${SITE_URL}/shop — Shop all products. Browse CELLUNAD+, CELLUBIOME, and CELLUNOVA with pricing and quick-add functionality.`,
  `> ${SITE_URL}/product/cellunad — CELLUNAD+ product page. Daily NAD+ foundation: 500 mg Nicotinamide Riboside, TMG, active B vitamins, R-lipoic acid, apigenin. 2 capsules/day, 30-day supply. $79.99 one-time / $67.99 subscribe.`,
  `> ${SITE_URL}/product/cellubiome — CELLUBIOME product page. Daily gut-barrier and mitochondrial support: 500 mg Urolithin A, 500 mg enteric tributyrin. 2 capsules/day, 30-day supply. $110.00 one-time / $93.50 subscribe.`,
  `> ${SITE_URL}/product/cellunova — CELLUNOVA product page. 7-day monthly protocol for autophagy and mitochondrial resilience: trans-resveratrol, quercetin, fisetin, spermidine, NAC, PQQ, astaxanthin, Ca-AKG, EGCG. 5 capsules/day for 7 days. $49.99 one-time / $42.49 subscribe.`,
  `> ${SITE_URL}/privacy — Privacy Policy. Data collection, usage, and protection practices.`,
  `> ${SITE_URL}/terms — Terms of Service. Purchase terms, disclaimers, and legal conditions.`,
  `> ${SITE_URL}/shipping — Shipping & Returns. Delivery timelines, return policy, and refund procedures.`,
  "",
].join("\n");

writeFileSync(resolve("client/public/llms.txt"), llmsTxt, "utf8");

console.log("Generated client/public/sitemap.xml, robots.txt, llms.txt using", SITE_URL);
