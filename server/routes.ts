import type { Express } from "express";
import type { Server } from "http";
import { isKnownAppRoute, normalizePath } from "./prerender";
import { getUncachableStripeClient, getPublishableKey } from "./stripeClient";
import { storage } from "./storage";
import { WebhookHandlers } from "./webhookHandlers";
import type { Order } from "@shared/schema";

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
  ["/pages/contact", "/faq"],
  ["/pages/about", "/faq"],
  ["/contact", "/faq"],
]);

// SEO: remove irrelevant legacy sections from the index with 410 Gone.
const GONE_ROUTE_PATTERNS = [/^\/blogs(?:\/.*)?$/i];

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
      const { items, email, shipping } = req.body as {
        items: Array<{
          slug: string;
          name: string;
          price: number;
          quantity: number;
          isSubscribe: boolean;
          frequency: string;
        }>;
        email: string;
        shipping: {
          firstName: string;
          lastName: string;
          address: string;
          apt?: string;
          city: string;
          state: string;
          zip: string;
          country: string;
        };
      };

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Valid email is required" });
      }
      if (!shipping || !shipping.firstName || !shipping.lastName || !shipping.address || !shipping.city || !shipping.state || !shipping.zip) {
        return res.status(400).json({ message: "Complete shipping address is required" });
      }

      const SERVER_PRICES: Record<string, { oneTime: number; subscribe: number; name: string }> = {
        cellunad: { oneTime: 79.99, subscribe: 67.99, name: "CELLUNAD+" },
        cellubiome: { oneTime: 110.00, subscribe: 93.50, name: "CELLUBIOME" },
        cellunova: { oneTime: 145.00, subscribe: 123.25, name: "CELLUNOVA" },
      };

      for (const item of items) {
        const pricing = SERVER_PRICES[item.slug];
        if (!pricing) {
          return res.status(400).json({ message: `Unknown product: ${item.slug}` });
        }
        const expectedPrice = item.isSubscribe ? pricing.subscribe : pricing.oneTime;
        if (Math.round(item.price * 100) !== Math.round(expectedPrice * 100)) {
          console.warn(`[checkout] Price mismatch for ${item.slug}: client sent $${item.price}, expected $${expectedPrice}`);
          item.price = expectedPrice;
        }
        item.name = pricing.name;
      }

      const stripe = await getUncachableStripeClient();
      const host = req.get("host") || "localhost:5000";
      const protocol = req.protocol;
      const baseUrl = `${protocol}://${host}`;

      const hasSubscription = items.some((item) => item.isSubscribe);
      const checkoutMode = hasSubscription ? "subscription" : "payment";

      function parseInterval(frequency: string): "month" | "year" {
        const f = frequency.toLowerCase();
        if (f.includes("year") || f.includes("annual")) return "year";
        return "month";
      }

      function parseIntervalCount(frequency: string): number {
        const f = frequency.toLowerCase();
        if (f.includes("3") || f.includes("quarter")) return 3;
        if (f.includes("6")) return 6;
        return 1;
      }

      const lineItems = items.map((item) => {
        const priceData: any = {
          currency: "usd",
          product_data: {
            name: item.name,
            metadata: {
              slug: item.slug,
              isSubscribe: String(item.isSubscribe),
              frequency: item.frequency,
            },
          },
          unit_amount: Math.round(item.price * 100),
        };

        if (item.isSubscribe) {
          priceData.recurring = {
            interval: parseInterval(item.frequency),
            interval_count: parseIntervalCount(item.frequency),
          };
        }

        return { price_data: priceData, quantity: item.quantity };
      });

      const sessionParams: any = {
        mode: checkoutMode,
        payment_method_types: ["card"],
        customer_email: email,
        line_items: lineItems,
        metadata: {
          shipping_first_name: shipping.firstName,
          shipping_last_name: shipping.lastName,
          shipping_address: shipping.address,
          shipping_apt: shipping.apt || "",
          shipping_city: shipping.city,
          shipping_state: shipping.state,
          shipping_zip: shipping.zip,
          shipping_country: shipping.country || "US",
          order_type: hasSubscription ? "subscription" : "one_time",
        },
        success_url: `${baseUrl}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout`,
      };

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

      if (process.env.DATABASE_URL) {
        try {
          await storage.createOrder({
            stripeSessionId: session.id,
            stripePaymentIntentId: null,
            stripeSubscriptionId: null,
            email,
            status: "pending",
            orderType: hasSubscription ? "subscription" : "one_time",
            totalAmount: items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0),
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
    } catch (err: any) {
      console.error("[stripe] Checkout session error:", err);
      return res.status(500).json({ message: err?.message || "Failed to create checkout session" });
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
          } catch {}
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
    } catch (err: any) {
      console.error("[stripe] Session retrieve error:", err);
      return res.status(500).json({ message: "Failed to retrieve session" });
    }
  });

  app.get("/api/orders/:orderId", async (req, res) => {
    try {
      const order = await storage.getOrderById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const emailHeader = req.headers["x-order-email"] as string;
      if (!emailHeader || emailHeader.toLowerCase() !== order.email.toLowerCase()) {
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
    } catch (err: any) {
      return res.status(500).json({ message: "Failed to retrieve order" });
    }
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
