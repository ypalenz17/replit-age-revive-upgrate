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
  "Canonical pages:",
  `${SITE_URL}/`,
  `${SITE_URL}/science`,
  `${SITE_URL}/quality`,
  `${SITE_URL}/faq`,
  `${SITE_URL}/shop`,
  `${SITE_URL}/product/cellunad`,
  `${SITE_URL}/product/cellubiome`,
  `${SITE_URL}/product/cellunova`,
  `${SITE_URL}/privacy`,
  `${SITE_URL}/terms`,
  `${SITE_URL}/shipping`,
  "",
].join("\n");

writeFileSync(resolve("client/public/llms.txt"), llmsTxt, "utf8");

console.log("Generated client/public/sitemap.xml, robots.txt, llms.txt using", SITE_URL);
