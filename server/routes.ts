import type { Express, NextFunction, Request, Response } from "express";
import type { Server } from "http";
import { randomBytes, createHash, pbkdf2 as pbkdf2Callback, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { createRequire } from "module";
import { isKnownAppRoute, normalizePath } from "./prerender";
import { getUncachableStripeClient, getPublishableKey } from "./stripeClient";
import { storage } from "./storage";
import { WebhookHandlers } from "./webhookHandlers";
import { sendPasswordResetEmail, sendShippingNotification } from "./email";
import {
  getShipStationShipmentStatus,
  isAuthorizedShipStationWebhook,
  parseShipStationTrackingUpdate,
} from "./shipstation";
import type { Order } from "@shared/schema";
import { PRODUCT_DETAIL_DATA } from "../client/src/productData";

const require = createRequire(import.meta.url);
const pbkdf2 = promisify(pbkdf2Callback);
const PBKDF2_ITERATIONS = 210_000;
const PBKDF2_KEY_LENGTH = 32;
const PBKDF2_DIGEST = "sha256";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AUTH_RATE_WINDOW_MS = 15 * 60 * 1000;
const AUTH_RATE_MAX_REQUESTS = 20;
const AUTH_RATE_BLOCK_MS = 15 * 60 * 1000;
const AUTH_RATE_MAX_BUCKETS = 10_000;

interface BcryptModule {
  hash(password: string, rounds: number): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

interface AuthRateBucket {
  count: number;
  windowStart: number;
  blockedUntil: number;
}

interface CheckoutRequestItem {
  slug: string;
  name: string;
  price: number;
  unitAmountCents: number;
  quantity: number;
  isSubscribe: boolean;
  frequency: string;
}

interface ParsedCheckoutRequestItem {
  slug: string;
  quantity: number;
  isSubscribe: boolean;
  frequency: string;
  clientPrice: number | null;
}

interface CheckoutShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface StripeRecurringConfig {
  interval: "month" | "year";
  interval_count: number;
}

interface StripeLineItemCreateInput {
  price_data: {
    currency: "usd";
    product_data: {
      name: string;
      metadata: Record<string, string>;
    };
    unit_amount: number;
    recurring?: StripeRecurringConfig;
  };
  quantity: number;
}

interface StripeCheckoutCreateParams extends Record<string, unknown> {
  mode: "payment" | "subscription";
  customer_email: string;
  line_items: StripeLineItemCreateInput[];
  metadata: Record<string, string>;
  success_url: string;
  cancel_url: string;
  discounts?: Array<{ coupon: string }>;
  subscription_data?: {
    metadata: Record<string, string>;
  };
  shipping_address_collection?: {
    allowed_countries: string[];
  };
}

type DiscountInvalidReason = "expired" | "max_uses" | "minimum_not_met";

const AUTH_RATE_LIMIT_PATHS = new Set<string>([
  "/api/auth/signup",
  "/api/auth/login",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
]);

const authRateBuckets = new Map<string, AuthRateBucket>();
let bcryptModuleCache: BcryptModule | null | undefined;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getStringField(body: unknown, key: string): string {
  if (!isObject(body)) {
    return "";
  }
  const value = body[key];
  return typeof value === "string" ? value : "";
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

function sanitizeHostHeader(hostHeader: string): string {
  const candidate = hostHeader.split(",")[0]?.trim() ?? "";
  if (!candidate) {
    return "localhost:5000";
  }

  if (!/^[a-z0-9.-]+(?::\d{1,5})?$/i.test(candidate)) {
    return CANONICAL_HOST;
  }

  return candidate;
}

function getRequestProtocol(req: Request): "http" | "https" {
  const forwarded = req.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();
  if (forwarded === "http" || forwarded === "https") {
    return forwarded;
  }

  return req.protocol === "http" ? "http" : "https";
}

function getRequestBaseUrl(req: Request): string {
  const protocol = getRequestProtocol(req);
  const host = sanitizeHostHeader(req.get("host") ?? "");
  return `${protocol}://${host}`;
}

function getOptionalBcryptModule(): BcryptModule | null {
  if (bcryptModuleCache !== undefined) {
    return bcryptModuleCache;
  }

  try {
    const bcryptModule = require("bcrypt") as { default?: unknown };
    const maybeModule = (bcryptModule.default ?? bcryptModule) as BcryptModule;
    if (
      typeof maybeModule.hash !== "function" ||
      typeof maybeModule.compare !== "function"
    ) {
      bcryptModuleCache = null;
      return bcryptModuleCache;
    }

    bcryptModuleCache = maybeModule;
    return bcryptModuleCache;
  } catch {
    bcryptModuleCache = null;
    return bcryptModuleCache;
  }
}

async function hashPassword(password: string): Promise<string> {
  const bcrypt = getOptionalBcryptModule();
  if (bcrypt) {
    return bcrypt.hash(password, 10);
  }

  const salt = randomBytes(16).toString("hex");
  const derived = await pbkdf2(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH, PBKDF2_DIGEST);
  return `pbkdf2$${PBKDF2_DIGEST}$${salt}$${derived.toString("hex")}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (storedHash.startsWith("pbkdf2$")) {
    const parts = storedHash.split("$");
    if (parts.length !== 4) {
      return false;
    }

    const digest = parts[1];
    const salt = parts[2];
    const expectedHex = parts[3];
    if (!digest || !salt || !expectedHex) {
      return false;
    }

    const expected = Buffer.from(expectedHex, "hex");
    const derived = await pbkdf2(password, salt, PBKDF2_ITERATIONS, expected.length, digest);
    return expected.length === derived.length && timingSafeEqual(expected, derived);
  }

  const bcrypt = getOptionalBcryptModule();
  if (!bcrypt) {
    if (storedHash.startsWith("$2")) {
      throw new Error("bcrypt module is required to verify existing bcrypt password hashes");
    }
    return false;
  }

  return bcrypt.compare(password, storedHash);
}

function regenerateSession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function saveSession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function getClientAddress(req: Request): string {
  return req.ip || req.socket.remoteAddress || "unknown";
}

function pruneAuthRateBuckets(now: number): void {
  if (authRateBuckets.size <= AUTH_RATE_MAX_BUCKETS) {
    return;
  }

  for (const [key, bucket] of authRateBuckets) {
    if (bucket.blockedUntil < now && now - bucket.windowStart > AUTH_RATE_WINDOW_MS) {
      authRateBuckets.delete(key);
    }
  }
}

function authRateLimit(req: Request, res: Response, next: NextFunction): void {
  if (!AUTH_RATE_LIMIT_PATHS.has(req.path)) {
    next();
    return;
  }

  const now = Date.now();
  pruneAuthRateBuckets(now);

  const key = `${req.path}:${getClientAddress(req)}`;
  const current = authRateBuckets.get(key);
  if (!current) {
    authRateBuckets.set(key, { count: 1, windowStart: now, blockedUntil: 0 });
    next();
    return;
  }

  if (current.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((current.blockedUntil - now) / 1000);
    res.setHeader("Retry-After", retryAfterSeconds.toString());
    res.status(429).json({ message: "Too many requests. Please try again later." });
    return;
  }

  if (now - current.windowStart > AUTH_RATE_WINDOW_MS) {
    current.windowStart = now;
    current.count = 1;
    current.blockedUntil = 0;
    next();
    return;
  }

  current.count += 1;
  if (current.count > AUTH_RATE_MAX_REQUESTS) {
    current.blockedUntil = now + AUTH_RATE_BLOCK_MS;
    res.setHeader("Retry-After", Math.ceil(AUTH_RATE_BLOCK_MS / 1000).toString());
    res.status(429).json({ message: "Too many requests. Please try again later." });
    return;
  }

  next();
}

function formatOrderResponse(order: Order) {
  return {
    status: order.status === "paid" || order.status === "active" ? "paid" : "unpaid",
    customerEmail: order.email,
    amountTotal: order.totalAmount / 100,
    currency: order.currency,
    orderId: order.id,
    orderType: order.orderType,
    subscriptionId: order.stripeSubscriptionId || null,
    items: order.items,
    metadata: {
      shipping_first_name: order.shippingFirstName,
      shipping_last_name: order.shippingLastName,
      shipping_address: order.shippingAddress,
      shipping_city: order.shippingCity,
      shipping_state: order.shippingState,
      shipping_zip: order.shippingZip,
    },
  };
}

async function hasOrderAccess(req: Request, order: Order): Promise<boolean> {
  if (req.session.userId && order.userId && req.session.userId === order.userId) {
    return true;
  }

  return isAdminSession(req);
}

async function isAdminSession(req: Request): Promise<boolean> {
  if (!req.session.userId) {
    return false;
  }

  const user = await storage.getUser(req.session.userId);
  return Boolean(user?.isAdmin);
}

function isDiscountExpired(expiresAt: Date | null, now: Date): boolean {
  if (!expiresAt) {
    return false;
  }

  return expiresAt.getTime() < now.getTime();
}

function getDiscountInvalidReason(params: {
  isActive: boolean;
  expiresAt: Date | null;
  maxUses: number | null;
  currentUses: number;
  minimumOrderAmount: number | null;
  orderSubtotal: number;
}): DiscountInvalidReason | null {
  if (!params.isActive || isDiscountExpired(params.expiresAt, new Date())) {
    return "expired";
  }

  if (params.maxUses !== null && params.currentUses >= params.maxUses) {
    return "max_uses";
  }

  if (params.minimumOrderAmount !== null && params.orderSubtotal < params.minimumOrderAmount) {
    return "minimum_not_met";
  }

  return null;
}

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
  ["/cellunad", "/product/cellunad"],
  ["/cellubiome", "/product/cellubiome"],
  ["/cellunova", "/product/cellunova"],
  ["/contact", "/faq"],
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

function buildSiteContentMarkdown(): string {
  const cn = PRODUCT_DETAIL_DATA.cellunad;
  const cb = PRODUCT_DETAIL_DATA.cellubiome;
  const cv = PRODUCT_DETAIL_DATA.cellunova;

  const lines: string[] = [];

  lines.push("# Age Revive — Premium Longevity Supplements");
  lines.push("");
  lines.push("## Brand Summary");
  lines.push("");
  lines.push(
    "Age Revive is a premium longevity supplement company offering a three-product cellular health system. " +
    "Every formula features full-dose disclosure (no proprietary blends), third-party testing, and cGMP manufacturing. " +
    "The system is designed so each product addresses a distinct biological layer — NAD+ metabolism, gut-mitochondria signaling, " +
    "and periodic autophagy-related support — and all three stack together for comprehensive cellular coverage."
  );
  lines.push("");

  lines.push("## Products");
  lines.push("");

  lines.push(`### ${cn.name} — ${cn.tagline}`);
  lines.push("");
  lines.push(cn.subtitle);
  lines.push("");
  lines.push(`- **Role**: Daily NAD+ foundation`);
  lines.push(`- **Form**: ${cn.form}`);
  lines.push(`- **Serving**: ${cn.serving}`);
  lines.push(`- **Servings per container**: ${cn.servingsPerContainer}`);
  lines.push(`- **Price (one-time)**: $${cn.priceOneTime.toFixed(2)}`);
  lines.push(`- **Price (subscribe)**: $${cn.priceSubscribe.toFixed(2)}/month`);
  lines.push(`- **Key Ingredients**: ${cn.supplementFacts.items.map(i => `${i.name} ${i.amount}`).join(", ")}`);
  lines.push(`- **Rating**: ${cn.rating}/5 (${cn.reviewCount} reviews)`);
  lines.push("");

  lines.push(`### ${cb.name} — ${cb.tagline}`);
  lines.push("");
  lines.push(cb.subtitle);
  lines.push("");
  lines.push(`- **Role**: Daily gut-barrier and mitochondrial support`);
  lines.push(`- **Form**: ${cb.form}`);
  lines.push(`- **Serving**: ${cb.serving}`);
  lines.push(`- **Servings per container**: ${cb.servingsPerContainer}`);
  lines.push(`- **Price (one-time)**: $${cb.priceOneTime.toFixed(2)}`);
  lines.push(`- **Price (subscribe)**: $${cb.priceSubscribe.toFixed(2)}/month`);
  lines.push(`- **Key Ingredients**: ${cb.supplementFacts.items.map(i => `${i.name} ${i.amount}`).join(", ")}`);
  lines.push(`- **Rating**: ${cb.rating}/5 (${cb.reviewCount} reviews)`);
  lines.push("");

  lines.push(`### ${cv.name} — ${cv.tagline}`);
  lines.push("");
  lines.push(cv.subtitle);
  lines.push("");
  lines.push(`- **Role**: 7-day monthly autophagy and cellular renewal protocol`);
  lines.push(`- **Form**: ${cv.form}`);
  lines.push(`- **Serving**: ${cv.serving}`);
  lines.push(`- **Servings per container**: ${cv.servingsPerContainer}`);
  lines.push(`- **Price (one-time)**: $${cv.priceOneTime.toFixed(2)}`);
  lines.push(`- **Price (subscribe)**: $${cv.priceSubscribe.toFixed(2)}/month`);
  lines.push(`- **Key Ingredients**: ${cv.supplementFacts.items.map(i => `${i.name} ${i.amount}`).join(", ")}`);
  lines.push(`- **Rating**: ${cv.rating}/5 (${cv.reviewCount} reviews)`);
  lines.push(`- **Allergen note**: ${cv.supplementFacts.allergenNote ?? "None"}`);
  lines.push("");

  lines.push("## System Overview — How the Three Products Work Together");
  lines.push("");
  lines.push(
    "Age Revive's protocol is a layered system. CELLUNAD+ provides daily NAD+ metabolic support as the foundational layer. " +
    "CELLUBIOME adds daily gut-barrier integrity and mitochondrial renewal via the gut-mitochondria axis. " +
    "CELLUNOVA is a periodic 7-day monthly protocol that layers autophagy-related and senescence-research compounds on top of the daily foundation. " +
    "Each product is designed to be effective on its own, but the three together address NAD+ metabolism, gut-mito signaling, and periodic cellular renewal."
  );
  lines.push("");

  lines.push("## Key Differentiators");
  lines.push("");
  lines.push("- **Full-dose disclosure**: Every ingredient and its exact dose are printed on the label. No proprietary blends.");
  lines.push("- **Third-party tested**: All products undergo independent third-party testing for purity and contaminants.");
  lines.push("- **cGMP manufactured**: Produced in cGMP-certified facilities following FDA manufacturing guidelines.");
  lines.push("- **Clinically studied doses**: Key ingredients are dosed at levels used in published human research.");
  lines.push("- **No artificial fillers**: Clean formulations with minimal excipients.");
  lines.push("");

  lines.push("## Canonical Pages");
  lines.push("");
  lines.push("- https://agerevive.com/ — Homepage and brand overview");
  lines.push("- https://agerevive.com/shop — Shop all products");
  lines.push("- https://agerevive.com/product/cellunad — CELLUNAD+ product page");
  lines.push("- https://agerevive.com/product/cellubiome — CELLUBIOME product page");
  lines.push("- https://agerevive.com/product/cellunova — CELLUNOVA product page");
  lines.push("- https://agerevive.com/science — Science and research references");
  lines.push("- https://agerevive.com/quality — Quality standards and testing");
  lines.push("- https://agerevive.com/faq — Frequently asked questions");
  lines.push("- https://agerevive.com/privacy — Privacy policy");
  lines.push("- https://agerevive.com/terms — Terms of service");
  lines.push("- https://agerevive.com/shipping — Shipping and returns policy");
  lines.push("");

  return lines.join("\n");
}

const SITE_CONTENT = buildSiteContentMarkdown();

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

  app.use(authRateLimit);

  app.get("/api/site-content", (req, res) => {
    if (Object.keys(req.query).length > 0) {
      return res.status(400).json({ message: "Query parameters are not supported for this endpoint." });
    }

    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    return res.send(SITE_CONTENT);
  });

  app.get("/api/blog", async (_req, res) => {
    try {
      const posts = await storage.listPublishedBlogPosts();
      return res.json(posts);
    } catch (err) {
      console.error("[content] Failed to load blog posts:", err);
      return res.status(500).json({ message: "Failed to retrieve blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const slug = normalizePath(`/${req.params.slug}`).slice(1).toLowerCase();
      if (!slug) {
        return res.status(400).json({ message: "Invalid blog slug" });
      }

      const post = await storage.getPublishedBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      return res.json(post);
    } catch (err) {
      console.error("[content] Failed to load blog post:", err);
      return res.status(500).json({ message: "Failed to retrieve blog post" });
    }
  });

  app.get("/api/products", async (_req, res) => {
    try {
      const productList = await storage.listActiveProducts();
      return res.json(productList);
    } catch (err) {
      console.error("[catalog] Failed to load products:", err);
      return res.status(500).json({ message: "Failed to retrieve products" });
    }
  });

  app.get("/api/products/:slug/availability", async (req, res) => {
    try {
      const slug = normalizePath(`/${req.params.slug}`).slice(1).toLowerCase();
      if (!slug) {
        return res.status(400).json({ message: "Invalid product slug" });
      }

      const product = await storage.getActiveProductBySlug(slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const quantity = product.stockQuantity;
      const inStock = product.trackInventory ? quantity > 0 : true;
      return res.json({ inStock, quantity });
    } catch (err) {
      console.error("[catalog] Failed to load product availability:", err);
      return res.status(500).json({ message: "Failed to retrieve product availability" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const slug = normalizePath(`/${req.params.slug}`).slice(1).toLowerCase();
      if (!slug) {
        return res.status(400).json({ message: "Invalid product slug" });
      }

      const product = await storage.getActiveProductBySlug(slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.json(product);
    } catch (err) {
      console.error("[catalog] Failed to load product:", err);
      return res.status(500).json({ message: "Failed to retrieve product" });
    }
  });

  app.get("/api/faq", async (_req, res) => {
    try {
      const faq = await storage.listActiveFaqEntries();
      return res.json(faq);
    } catch (err) {
      console.error("[content] Failed to load FAQ entries:", err);
      return res.status(500).json({ message: "Failed to retrieve FAQ entries" });
    }
  });

  app.post("/api/discount/validate", async (req, res) => {
    try {
      const code = getStringField(req.body, "code").trim();
      if (!code) {
        return res.json({ valid: false, reason: "invalid", code: "", description: "" });
      }

      const discount = await storage.validateDiscountCode(code);
      if (!discount) {
        return res.json({ valid: false, reason: "invalid", code: "", description: "" });
      }

      const cartTotal = typeof req.body?.cartTotal === "number" ? req.body.cartTotal : 0;
      if (discount.minimumOrderAmount && cartTotal < discount.minimumOrderAmount) {
        return res.json({ valid: false, reason: "minimum_not_met", code: discount.code, description: `Minimum order $${discount.minimumOrderAmount} required` });
      }

      const description = discount.discountType === "percentage"
        ? `${discount.discountValue}% off`
        : `$${(discount.discountValue / 100).toFixed(2)} off`;

      return res.json({ valid: true, code: discount.code, description });
    } catch (err) {
      console.error("[discount] Failed to validate discount code:", err);
      return res.json({ valid: false, reason: "invalid", code: "", description: "" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const email = getStringField(req.body, "email");
      const username = getStringField(req.body, "username");
      const password = getStringField(req.body, "password");

      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ message: "Valid email is required" });
      }
      if (!username || username.trim().length < 2) {
        return res.status(400).json({ message: "Username must be at least 2 characters" });
      }
      if (!password || password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      const normalizedEmail = normalizeEmail(email);
      const normalizedUsername = username.trim();

      const existingEmail = await storage.getUserByEmail(normalizedEmail);
      if (existingEmail) {
        return res.status(409).json({ message: "An account with these details already exists" });
      }

      const existingUsername = await storage.getUserByUsername(normalizedUsername);
      if (existingUsername) {
        return res.status(409).json({ message: "An account with these details already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email: normalizedEmail,
        username: normalizedUsername,
        password: hashedPassword,
      });

      await regenerateSession(req);
      req.session.userId = user.id;
      await saveSession(req);

      return res.status(201).json({
        id: user.id,
        email: user.email,
        username: user.username,
      });
    } catch (err) {
      console.error("[auth] Signup error:", err);
      return res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const email = getStringField(req.body, "email");
      const password = getStringField(req.body, "password");

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const normalizedEmail = normalizeEmail(email);
      const user = await storage.getUserByEmail(normalizedEmail);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const validPassword = await verifyPassword(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      await regenerateSession(req);
      req.session.userId = user.id;
      await saveSession(req);

      return res.json({
        id: user.id,
        email: user.email,
        username: user.username,
      });
    } catch (err) {
      console.error("[auth] Login error:", err);
      return res.status(500).json({ message: "Failed to log in" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log out" });
      }
      res.clearCookie("ar.sid");
      return res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "Not authenticated" });
      }

      return res.json({
        id: user.id,
        email: user.email,
        username: user.username,
      });
    } catch (err) {
      console.error("[auth] /me error:", err);
      return res.status(500).json({ message: "Failed to retrieve user" });
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const email = getStringField(req.body, "email");
      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ message: "Valid email is required" });
      }

      const normalizedEmail = normalizeEmail(email);
      const user = await storage.getUserByEmail(normalizedEmail);

      res.json({ message: "If an account with that email exists, a password reset link has been sent." });

      if (user) {
        const token = randomBytes(32).toString("hex");
        const tokenHash = createHash("sha256").update(token).digest("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await storage.setResetToken(user.id, tokenHash, expiresAt);

        const baseUrl = getRequestBaseUrl(req);
        sendPasswordResetEmail(normalizedEmail, token, baseUrl).catch((err) =>
          console.error("[auth] Failed to send password reset email:", err),
        );
      }
    } catch (err) {
      console.error("[auth] Forgot password error:", err);
      return res.status(500).json({ message: "Failed to process request" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const token = getStringField(req.body, "token");
      const password = getStringField(req.body, "password");
      if (!token) {
        return res.status(400).json({ message: "Reset token is required" });
      }
      if (!password || password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      const tokenHash = createHash("sha256").update(token).digest("hex");
      const user = await storage.getUserByResetToken(tokenHash);
      if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired reset link. Please request a new one." });
      }

      const hashedPassword = await hashPassword(password);
      await storage.updateUserPassword(user.id, hashedPassword);
      await storage.clearResetToken(user.id);

      return res.json({ message: "Password has been reset successfully. You can now log in." });
    } catch (err) {
      console.error("[auth] Reset password error:", err);
      return res.status(500).json({ message: "Failed to reset password" });
    }
  });

  app.post("/api/orders/:orderId/ship", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      if (!(await isAdminSession(req))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const trackingNumber = getStringField(req.body, "trackingNumber").trim();
      const trackingCarrier = getStringField(req.body, "trackingCarrier").trim();
      if (!trackingNumber || !trackingCarrier) {
        return res.status(400).json({ message: "Tracking number and carrier are required" });
      }

      const order = await storage.getOrderById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const updated = await storage.updateOrderFulfillment(
        order.id,
        "shipped",
        trackingNumber,
        trackingCarrier,
      );

      if (updated) {
        sendShippingNotification(updated).catch((err) =>
          console.error("[email] Failed to send shipping notification:", err),
        );
      }

      return res.json({ message: "Shipping notification sent", order: updated });
    } catch (err) {
      console.error("[orders] Ship error:", err);
      return res.status(500).json({ message: "Failed to update shipping" });
    }
  });

  app.get("/api/stripe/publishable-key", async (_req, res) => {
    try {
      const key = await getPublishableKey();
      return res.json({ publishableKey: key });
    } catch (err) {
      console.error("[stripe] Failed to get publishable key:", err);
      return res.status(500).json({ message: "Failed to load payment configuration" });
    }
  });

  app.post("/api/checkout/session", async (req, res) => {
    try {
      const body = isObject(req.body) ? req.body : null;
      const rawItems = Array.isArray(body?.items) ? body.items : [];
      const email = normalizeEmail(typeof body?.email === "string" ? body.email : "");
      const discountCodeInput = getStringField(body, "discountCode").trim();
      const shippingInput = isObject(body?.shipping) ? body.shipping : null;

      if (rawItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ message: "Valid email is required" });
      }

      const shipping: CheckoutShippingInfo = {
        firstName: getStringField(shippingInput, "firstName").trim(),
        lastName: getStringField(shippingInput, "lastName").trim(),
        address: getStringField(shippingInput, "address").trim(),
        apt: getStringField(shippingInput, "apt").trim() || undefined,
        city: getStringField(shippingInput, "city").trim(),
        state: getStringField(shippingInput, "state").trim(),
        zip: getStringField(shippingInput, "zip").trim(),
        country: getStringField(shippingInput, "country").trim() || "US",
      };

      const isExpressCheckout = body?.expressCheckout === true;

      if (
        !isExpressCheckout && (
          !shipping.firstName ||
          !shipping.lastName ||
          !shipping.address ||
          !shipping.city ||
          !shipping.state ||
          !shipping.zip
        )
      ) {
        return res.status(400).json({ message: "Complete shipping address is required" });
      }

      const parsedItems: ParsedCheckoutRequestItem[] = [];
      for (const rawItem of rawItems) {
        if (!isObject(rawItem)) {
          return res.status(400).json({ message: "Invalid cart item payload" });
        }

        const slug = getStringField(rawItem, "slug").trim().toLowerCase();
        if (!slug) {
          return res.status(400).json({ message: "Invalid product slug in cart" });
        }

        const clientPriceRaw = rawItem.price;
        const quantityRaw = rawItem.quantity;
        const isSubscribeRaw = rawItem.isSubscribe;
        const frequencyRaw = getStringField(rawItem, "frequency").trim();

        if (typeof quantityRaw !== "number" || !Number.isInteger(quantityRaw) || quantityRaw < 1 || quantityRaw > 10) {
          return res.status(400).json({ message: "Invalid quantity in cart" });
        }

        if (typeof isSubscribeRaw !== "boolean") {
          return res.status(400).json({ message: "Invalid subscription flag in cart" });
        }

        const clientPrice =
          typeof clientPriceRaw === "number" && Number.isFinite(clientPriceRaw) ? clientPriceRaw : null;

        parsedItems.push({
          slug,
          quantity: quantityRaw,
          isSubscribe: isSubscribeRaw,
          frequency: frequencyRaw || "One-time",
          clientPrice,
        });
      }

      const productRecords = await storage.getProductsBySlugs(
        Array.from(new Set(parsedItems.map((item) => item.slug))),
      );
      const productBySlug = new Map(productRecords.map((product) => [product.slug, product]));

      const items: CheckoutRequestItem[] = [];
      for (const item of parsedItems) {
        const product = productBySlug.get(item.slug);
        if (!product) {
          return res.status(400).json({ message: `Unknown or inactive product: ${item.slug}` });
        }

        if (item.isSubscribe && product.subscriptionPrice === null) {
          return res.status(400).json({
            message: `Subscription is not available for product: ${item.slug}`,
          });
        }

        const unitAmountCents = item.isSubscribe
          ? (product.subscriptionPrice ?? product.price)
          : product.price;

        if (item.clientPrice !== null && Math.round(item.clientPrice * 100) !== unitAmountCents) {
          console.warn(
            `[checkout] Price mismatch for ${item.slug}: client sent $${item.clientPrice.toFixed(2)}, expected $${(unitAmountCents / 100).toFixed(2)}`,
          );
        }

        items.push({
          slug: product.slug,
          name: product.name,
          price: unitAmountCents / 100,
          unitAmountCents,
          quantity: item.quantity,
          isSubscribe: item.isSubscribe,
          frequency: item.frequency,
        });
      }

      const requestedBySlug = new Map<string, number>();
      for (const item of items) {
        requestedBySlug.set(item.slug, (requestedBySlug.get(item.slug) ?? 0) + item.quantity);
      }

      for (const [slug, requestedQuantity] of requestedBySlug.entries()) {
        const product = productBySlug.get(slug);
        if (product?.trackInventory && product.stockQuantity < requestedQuantity) {
          return res.status(400).json({
            error: "insufficient_stock",
            product: slug,
            available: product.stockQuantity,
          });
        }
      }

      const subtotalCents = items.reduce((sum, item) => sum + item.unitAmountCents * item.quantity, 0);

      let validatedDiscount: Awaited<ReturnType<typeof storage.getDiscountCodeByCode>> | null = null;
      if (discountCodeInput) {
        const discount = await storage.getDiscountCodeByCode(discountCodeInput);
        if (!discount) {
          return res.status(400).json({
            error: "invalid_discount",
            reason: "expired" satisfies DiscountInvalidReason,
          });
        }

        const invalidReason = getDiscountInvalidReason({
          isActive: discount.isActive,
          expiresAt: discount.expiresAt,
          maxUses: discount.maxUses,
          currentUses: discount.currentUses,
          minimumOrderAmount: discount.minimumOrderAmount,
          orderSubtotal: subtotalCents,
        });

        if (invalidReason) {
          return res.status(400).json({
            error: "invalid_discount",
            reason: invalidReason,
          });
        }

        validatedDiscount = discount;
      }

      const stripe = await getUncachableStripeClient();
      const baseUrl = getRequestBaseUrl(req);

      const hasSubscription = items.some((item) => item.isSubscribe);
      const checkoutMode: "subscription" | "payment" = hasSubscription ? "subscription" : "payment";

      function parseInterval(frequency: string): "month" | "year" {
        const f = frequency.toLowerCase();
        if (f.includes("year") || f.includes("annual")) {
          return "year";
        }
        return "month";
      }

      function parseIntervalCount(frequency: string): number {
        const f = frequency.toLowerCase();
        if (f.includes("3") || f.includes("quarter")) {
          return 3;
        }
        if (f.includes("6")) {
          return 6;
        }
        return 1;
      }

      const lineItems = items.map((item) => {
        const priceData: StripeLineItemCreateInput["price_data"] = {
          currency: "usd",
          product_data: {
            name: item.name,
            metadata: {
              slug: item.slug,
              isSubscribe: String(item.isSubscribe),
              frequency: item.frequency,
            },
          },
          unit_amount: item.unitAmountCents,
        };

        if (item.isSubscribe) {
          priceData.recurring = {
            interval: parseInterval(item.frequency),
            interval_count: parseIntervalCount(item.frequency),
          };
        }

        return { price_data: priceData, quantity: item.quantity };
      });

      const isExpress = body?.expressCheckout === true;

      const sessionParams: StripeCheckoutCreateParams = {
        mode: checkoutMode,
        customer_email: email,
        line_items: lineItems,
        metadata: {
          shipping_first_name: isExpress ? "" : shipping.firstName,
          shipping_last_name: isExpress ? "" : shipping.lastName,
          shipping_address: isExpress ? "" : shipping.address,
          shipping_apt: isExpress ? "" : (shipping.apt || ""),
          shipping_city: isExpress ? "" : shipping.city,
          shipping_state: isExpress ? "" : shipping.state,
          shipping_zip: isExpress ? "" : shipping.zip,
          shipping_country: shipping.country || "US",
          order_type: hasSubscription ? "subscription" : "one_time",
          discount_code_id: validatedDiscount?.id ?? "",
          discount_code: validatedDiscount?.code ?? "",
          express_checkout: isExpress ? "true" : "false",
        },
        success_url: `${baseUrl}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout`,
      };

      if (isExpress) {
        sessionParams.shipping_address_collection = {
          allowed_countries: ["US"],
        };
      }

      if (validatedDiscount) {
        if (validatedDiscount.discountType === "percentage") {
          const percentOff = Math.min(100, Math.max(1, validatedDiscount.discountValue));
          const coupon = await stripe.coupons.create({
            duration: "once",
            name: `Discount ${validatedDiscount.code}`,
            percent_off: percentOff,
          });
          sessionParams.discounts = [{ coupon: coupon.id }];
        } else if (validatedDiscount.discountType === "fixed_amount") {
          const amountOff = Math.max(1, validatedDiscount.discountValue);
          const coupon = await stripe.coupons.create({
            duration: "once",
            name: `Discount ${validatedDiscount.code}`,
            amount_off: amountOff,
            currency: "usd",
          });
          sessionParams.discounts = [{ coupon: coupon.id }];
        } else {
          return res.status(400).json({
            error: "invalid_discount",
            reason: "expired" satisfies DiscountInvalidReason,
          });
        }
      }

      if (hasSubscription) {
        sessionParams.subscription_data = {
          metadata: {
            shipping_first_name: shipping.firstName,
            shipping_last_name: shipping.lastName,
            shipping_address: shipping.address,
            shipping_apt: shipping.apt || "",
            shipping_city: shipping.city,
            shipping_state: shipping.state,
            shipping_zip: shipping.zip,
            shipping_country: shipping.country || "US",
          },
        };
      }

      const session = await stripe.checkout.sessions.create(sessionParams);
      if (!session.url) {
        return res.status(500).json({ message: "Failed to create checkout session" });
      }

      if (process.env.DATABASE_URL) {
        try {
          await storage.createOrder({
            stripeSessionId: session.id,
            stripePaymentIntentId: null,
            stripeSubscriptionId: null,
            userId: req.session.userId || null,
            email,
            status: "pending",
            orderType: hasSubscription ? "subscription" : "one_time",
            totalAmount: subtotalCents,
            currency: "usd",
            shippingFirstName: shipping.firstName,
            shippingLastName: shipping.lastName,
            shippingAddress: shipping.address,
            shippingApt: shipping.apt || null,
            shippingCity: shipping.city,
            shippingState: shipping.state,
            shippingZip: shipping.zip,
            shippingCountry: shipping.country || "US",
            items: items.map((i) => ({
              slug: i.slug,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              isSubscribe: i.isSubscribe,
              frequency: i.frequency,
            })),
            fulfillmentStatus: "unfulfilled",
            trackingNumber: null,
            trackingCarrier: null,
            notes: null,
          });
        } catch (orderErr) {
          console.error("[orders] Failed to create pending order:", orderErr);
        }
      }

      return res.json({ url: session.url });
    } catch (err) {
      console.error("[stripe] Checkout session error:", err);
      const message = err instanceof Error && err.message ? err.message : "Failed to create checkout session";
      return res.status(500).json({ message });
    }
  });

  app.get("/api/checkout/session/:sessionId", async (req, res) => {
    try {
      if (process.env.DATABASE_URL) {
        const order = await storage.getOrderByStripeSessionId(req.params.sessionId);

        if (order && order.status === "pending") {
          try {
            await WebhookHandlers.handleCheckoutSessionDirect(req.params.sessionId);
            const updated = await storage.getOrderByStripeSessionId(req.params.sessionId);
            if (updated) {
              return res.json(formatOrderResponse(updated));
            }
          } catch (syncErr) {
            console.warn("[stripe] Deferred session sync failed:", syncErr);
          }
        }

        if (order) {
          return res.json(formatOrderResponse(order));
        }
      }

      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

      return res.json({
        status: session.payment_status,
        customerEmail: session.customer_email || session.customer_details?.email,
        amountTotal: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency,
        metadata: session.metadata,
      });
    } catch (err) {
      console.error("[stripe] Session retrieve error:", err);
      return res.status(500).json({ message: "Failed to retrieve session" });
    }
  });

  app.get("/api/orders/my", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const orders = await storage.getOrdersByUserId(req.session.userId);
      return res.json(orders);
    } catch (err) {
      console.error("[orders] Failed to fetch user order history:", err);
      return res.status(500).json({ message: "Failed to retrieve order history" });
    }
  });

  app.get("/api/orders/:orderId", async (req, res) => {
    try {
      const order = await storage.getOrderById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (!(await hasOrderAccess(req, order))) {
        return res.status(403).json({ message: "Access denied" });
      }

      return res.json({
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount / 100,
        currency: order.currency,
        items: order.items,
        fulfillmentStatus: order.fulfillmentStatus,
        trackingNumber: order.trackingNumber,
        trackingCarrier: order.trackingCarrier,
        createdAt: order.createdAt,
      });
    } catch (err) {
      console.error("[orders] Fetch order error:", err);
      return res.status(500).json({ message: "Failed to retrieve order" });
    }
  });

  app.get("/api/orders/:orderId/shipstation-status", async (req, res) => {
    try {
      const order = await storage.getOrderById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (!(await hasOrderAccess(req, order))) {
        return res.status(403).json({ message: "Access denied" });
      }

      const status = await getShipStationShipmentStatus(order.id);
      return res.json(status);
    } catch (err) {
      console.error("[shipstation] Failed to retrieve shipment status:", err);
      return res.status(500).json({ message: "Failed to retrieve ShipStation status" });
    }
  });

  app.post("/api/shipstation/webhook", async (req, res) => {
    try {
      const configuredShipStationKey = process.env.SHIPSTATION_API_KEY?.trim();
      if (!configuredShipStationKey) {
        return res.status(503).json({ message: "ShipStation integration is not configured" });
      }

      if (!isAuthorizedShipStationWebhook(req.headers, req.rawBody)) {
        return res.status(401).json({ message: "Unauthorized ShipStation webhook request" });
      }

      const update = parseShipStationTrackingUpdate(req.body);
      if (!update) {
        return res.status(400).json({ message: "Invalid ShipStation webhook payload" });
      }

      const order = await storage.getOrderById(update.orderNumber);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const previousStatus = order.fulfillmentStatus;
      const previousTrackingNumber = order.trackingNumber;
      const previousTrackingCarrier = order.trackingCarrier;
      const previousTrackingUrl = order.trackingUrl;

      const updated = await storage.updateOrderFulfillment(
        order.id,
        update.fulfillmentStatus,
        update.trackingNumber ?? undefined,
        update.trackingCarrier ?? undefined,
        update.trackingUrl ?? undefined,
      );

      if (
        updated &&
        (update.fulfillmentStatus === "shipped" || update.fulfillmentStatus === "delivered") &&
        (
          previousStatus !== updated.fulfillmentStatus ||
          previousTrackingNumber !== updated.trackingNumber ||
          previousTrackingCarrier !== updated.trackingCarrier ||
          previousTrackingUrl !== updated.trackingUrl
        )
      ) {
        sendShippingNotification(updated).catch((error) => {
          console.error("[email] Failed to send ShipStation shipping notification:", error);
        });
      }

      return res.json({ received: true });
    } catch (err) {
      console.error("[shipstation] Webhook processing error:", err);
      return res.status(500).json({ message: "Failed to process ShipStation webhook" });
    }
  });

  // SEO: unknown non-asset frontend paths must return a real 404, not a 200 app shell.
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return next();
    }

    if (req.path.startsWith("/api") || req.path.startsWith("/admin") || req.path.includes(".")) {
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
