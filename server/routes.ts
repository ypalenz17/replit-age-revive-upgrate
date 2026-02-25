import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getPageContent, ALL_ROUTES } from "./prerender";

const BOT_UA_PATTERNS = [
  /chatgpt/i,
  /gptbot/i,
  /oai-searchbot/i,
  /claudebot/i,
  /anthropic/i,
  /perplexity/i,
  /cohere/i,
  /google-extended/i,
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /applebot/i,
  /ia_archiver/i,
  /semrushbot/i,
  /ahrefsbot/i,
  /mj12bot/i,
  /dotbot/i,
  /petalbot/i,
  /bytespider/i,
  /ccbot/i,
];

function isBot(ua: string): boolean {
  return BOT_UA_PATTERNS.some((p) => p.test(ua));
}

function buildFullPage(routePath: string): string | null {
  const page = getPageContent(routePath);
  if (!page) return null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page.title}</title>
  <meta name="description" content="${page.description}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Age Revive" />
  <meta property="og:title" content="${page.title}" />
  <meta property="og:description" content="${page.description}" />
  <meta property="og:url" content="https://agerevive.com${routePath === "/" ? "" : routePath}" />
  <link rel="canonical" href="https://agerevive.com${routePath === "/" ? "" : routePath}" />
</head>
<body>
${page.html}
</body>
</html>`;
}

const SITE_CONTENT = `# Age Revive — Systemic Biological Architecture

Protocol-grade cellular support. One system. Three protocols. NAD+ support, gut-mito support, and a 7-day monthly pulse.

## Products

### CELLUNAD+ — NAD+ Optimization
Precision NAD+ support with co-factors, not hype.
- NR (Nicotinamide Riboside) 500 mg
- TMG (Trimethylglycine) 250 mg
- Apigenin 100 mg
Serving: 2 capsules daily

### CELLUBIOME — Gut + Mito Signaling
The Gut–Mitochondria Axis, simplified.
- Urolithin A 500 mg
- Tributyrin 500 mg
Serving: 2 enteric-coated capsules daily

### CELLUNOVA — 7-Day Autophagy Pulse
Seven days on. Designed as a cycle, not forever.
- Fisetin
- Spermidine
- PQQ
Serving: 5 capsules daily for 7 days

## The Age Revive Systems Axis

Three biological layers working together:
1. **Gut–Mito Axis** — Urolithin A and tributyrin support the gut–mitochondria signaling pathway, linking digestive health to cellular energy.
2. **NAD+ Backbone** — NR, TMG, and apigenin provide the daily substrate for cellular repair, energy metabolism, and sirtuin activation.
3. **Autophagy Cadence** — A 7-day monthly cycle of fisetin, spermidine, and PQQ to trigger cellular cleanup and renewal.

## Protocol Design Principles
- **Standardized Actives**: Every ingredient is dosed at clinically relevant levels with full transparency.
- **Defined Cadence**: Daily protocols (CELLUNAD+, CELLUBIOME) plus a monthly 7-day cycle (CELLUNOVA).
- **Quality Controls**: Third-party tested, GMP manufactured, no proprietary blends.

## Science & Transparency
Every ingredient is chosen for its mechanistic evidence, not marketing trends. Age Revive publishes full dosing, sourcing, and rationale for every formula.

## Pages
- Home: https://agerevive.com/
- Shop: https://agerevive.com/shop
- CELLUNAD+: https://agerevive.com/product/cellunad
- CELLUBIOME: https://agerevive.com/product/cellubiome
- CELLUNOVA: https://agerevive.com/product/cellunova
- Science: https://agerevive.com/science
- Quality: https://agerevive.com/quality
- FAQ: https://agerevive.com/faq
- Privacy: https://agerevive.com/privacy
- Terms: https://agerevive.com/terms
- Shipping: https://agerevive.com/shipping

---
Brand: Age Revive
Website: https://agerevive.com
`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api") || req.path.includes(".")) return next();

    const ua = req.get("user-agent") || "";
    if (!isBot(ua)) return next();

    const html = buildFullPage(req.path);
    if (!html) return next();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Robots-Tag", "all");
    res.send(html);
  });

  app.get('/api/site-content', (req, res) => {
    if (Object.keys(req.query).length > 0) {
      return res.status(400).json({ message: 'Query parameters are not supported for this endpoint.' });
    }

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.send(SITE_CONTENT);
  });

  return httpServer;
}
