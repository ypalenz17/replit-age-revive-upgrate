import type { Express } from "express";
import type { Server } from "http";
import { isKnownAppRoute, normalizePath } from "./prerender";

const CANONICAL_HOST = (process.env.CANONICAL_HOST ?? "agerevive.com").toLowerCase();

// SEO: hard-map known duplicate legacy routes to a single canonical URL.
const LEGACY_REDIRECTS = new Map<string, string>([
  ["/pages/science", "/science"],
  ["/pages/faq", "/faq"],
  ["/pages/data-sharing-opt-out", "/privacy"],
  ["/collections/all", "/shop"],
  ["/products/cellunad", "/product/cellunad"],
  ["/products/cellubiome", "/product/cellubiome"],
  ["/products/cellunova", "/product/cellunova"],
  ["/products/products-cellunad-nad-booster", "/product/cellunad"],
  ["/products/cellubiome-gut-mito-support", "/product/cellubiome"],
  ["/products/products-cellunova-cellular-renewal", "/product/cellunova"],
]);

// SEO: remove irrelevant legacy sections from the index with 410 Gone.
const GONE_ROUTE_PATTERNS = [/^\/blogs(?:\/.*)?$/i, /^\/pages\/contact$/i, /^\/pages\/about$/i];

// SEO: prevent checkout/account utility routes from entering the index.
const NOINDEX_ROUTE_PATTERNS = [
  /^\/checkout$/i,
  /^\/order-confirmed$/i,
  /^\/product\/[a-z0-9-]+\/purchase$/i,
  /^\/cart(?:\/.*)?$/i,
  /^\/account(?:\/.*)?$/i,
];

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function extractHost(hostHeader: string): string {
  const [host] = hostHeader.split(":");
  return host.trim().toLowerCase();
}

function extractSearch(originalUrl: string): string {
  const queryStart = originalUrl.indexOf("?");
  return queryStart === -1 ? "" : originalUrl.slice(queryStart);
}

const SITE_CONTENT = `# Age Revive\n\nCanonical pages:\n- https://agerevive.com/\n- https://agerevive.com/science\n- https://agerevive.com/quality\n- https://agerevive.com/faq\n- https://agerevive.com/shop\n- https://agerevive.com/product/cellunad\n- https://agerevive.com/product/cellubiome\n- https://agerevive.com/product/cellunova\n- https://agerevive.com/privacy\n- https://agerevive.com/terms\n- https://agerevive.com/shipping\n`;

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return next();
    }

    const normalizedPath = normalizePath(req.path);
    const canonicalPath = LEGACY_REDIRECTS.get(normalizedPath) ?? normalizedPath;
    const hostHeader = req.get("host") ?? "";
    const requestHost = extractHost(hostHeader);
    const queryString = extractSearch(req.originalUrl);

    const enforceCanonicalOrigin =
      process.env.NODE_ENV === "production" && requestHost !== "" && !isLocalHost(requestHost);

    const needsOriginRedirect =
      enforceCanonicalOrigin && (requestHost !== CANONICAL_HOST || req.protocol !== "https");

    const needsPathRedirect = canonicalPath !== req.path;

    if (!needsOriginRedirect && !needsPathRedirect) {
      return next();
    }

    if (needsOriginRedirect) {
      return res.redirect(301, `https://${CANONICAL_HOST}${canonicalPath}${queryString}`);
    }

    return res.redirect(301, `${canonicalPath}${queryString}`);
  });

  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return next();
    }

    const normalizedPath = normalizePath(req.path);
    if (!GONE_ROUTE_PATTERNS.some((pattern) => pattern.test(normalizedPath))) {
      return next();
    }

    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    if (req.method === "HEAD") {
      return res.sendStatus(410);
    }

    return res.status(410).type("text/plain; charset=utf-8").send("Gone");
  });

  app.use((req, res, next) => {
    const normalizedPath = normalizePath(req.path);
    if (NOINDEX_ROUTE_PATTERNS.some((pattern) => pattern.test(normalizedPath))) {
      res.setHeader("X-Robots-Tag", "noindex, follow");
    }

    next();
  });

  app.get("/api/site-content", (req, res) => {
    if (Object.keys(req.query).length > 0) {
      return res.status(400).json({ message: "Query parameters are not supported for this endpoint." });
    }

    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    return res.send(SITE_CONTENT);
  });

  // SEO: unknown non-asset frontend paths must return a real 404, not a 200 app shell.
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return next();
    }

    if (req.path.startsWith("/api") || req.path.includes(".")) {
      return next();
    }

    const normalizedPath = normalizePath(req.path);
    if (isKnownAppRoute(normalizedPath)) {
      return next();
    }

    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    if (req.method === "HEAD") {
      return res.sendStatus(404);
    }

    return res.status(404).type("text/html; charset=utf-8").send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>404 | Age Revive</title></head>
<body><h1>404 Not Found</h1><p>The requested page does not exist.</p></body>
</html>`);
  });

  return httpServer;
}
