import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { setupAdmin } from "./admin";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { WebhookHandlers } from "./webhookHandlers";
import { initStripe } from "./stripeClient";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const app = express();
const httpServer = createServer(app);
app.disable("x-powered-by");

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

function getTrustProxySetting(): boolean | number {
  const configured = (process.env.TRUST_PROXY ?? "").trim().toLowerCase();
  if (configured === "true") {
    return true;
  }
  if (configured === "false") {
    return false;
  }

  const asNumber = Number.parseInt(configured, 10);
  if (Number.isFinite(asNumber) && asNumber >= 0) {
    return asNumber;
  }

  // Default to the first reverse proxy hop instead of trusting all.
  return 1;
}

app.set("trust proxy", getTrustProxySetting());

function getSessionSecret(): string {
  const sessionSecret = process.env.SESSION_SECRET;
  if (sessionSecret && sessionSecret.length >= 16) {
    return sessionSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set to a strong value in production");
  }

  console.warn("[auth] SESSION_SECRET not set; using development fallback secret");
  return "dev-session-secret-change-me";
}

const sessionSecret = getSessionSecret();

const configuredCorsOrigins = new Set(
  (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

if (process.env.NODE_ENV !== "production") {
  configuredCorsOrigins.add("http://localhost:5173");
  configuredCorsOrigins.add("http://127.0.0.1:5173");
}

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json", limit: "1mb" }),
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.status(400).json({ error: "Missing stripe-signature header" });
    }
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }
    const sig = Array.isArray(signature) ? signature[0] : signature;
    try {
      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      return res.status(200).json({ received: true });
    } catch (err) {
      console.error("[stripe] Webhook error:", err);
      return res.status(400).json({ error: "Webhook processing failed" });
    }
  },
);

app.use(
  express.json({
    limit: "100kb",
    strict: true,
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: "100kb" }));

const PgStore = connectPgSimple(session);
const pgSessionStore = process.env.DATABASE_URL
  ? new PgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      tableName: "user_sessions",
      errorLog: (err: Error) => {
        console.error("[session-store]", err.message);
      },
    })
  : undefined;

const sessionMiddleware = session({
  store: pgSessionStore,
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  name: "ar.sid",
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
});

app.use((req, res, next) => {
  sessionMiddleware(req, res, (err) => {
    if (err) {
      console.error("[session] middleware error:", err);
      return next();
    }
    next();
  });
});

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (process.env.NODE_ENV === "production") {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  }

  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  next();
});

app.use("/api", (req, res, next) => {
  const origin = req.get("origin");
  if (!origin) {
    return next();
  }

  const host = req.get("host");
  const sameHostOrigin = host
    ? origin === `http://${host}` || origin === `https://${host}`
    : false;
  const originAllowed = sameHostOrigin || configuredCorsOrigins.has(origin);

  if (!originAllowed) {
    return res.status(403).json({ message: "Origin not allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

process.on("unhandledRejection", (reason) => {
  console.error("[process] Unhandled rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[process] Uncaught exception:", error);
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    const errObject = typeof err === "object" && err !== null ? (err as Record<string, unknown>) : {};
    const status = Number(errObject.status ?? errObject.statusCode ?? 500);
    const isJsonSyntaxError =
      err instanceof SyntaxError &&
      errObject.status === 400 &&
      "body" in err;
    const safeStatus = Number.isFinite(status) && status >= 400 && status < 600 ? status : 500;
    const message = isJsonSyntaxError
      ? "Invalid JSON payload"
      : safeStatus >= 500
        ? "Internal Server Error"
        : typeof errObject.message === "string" && errObject.message
          ? errObject.message
          : "Bad Request";

    if (safeStatus >= 500) {
      log(`${req.method} ${req.path} ${safeStatus} :: internal error`, "error");
    } else {
      log(`${req.method} ${req.path} ${safeStatus}`, "error");
    }

    if (res.headersSent) {
      return next(err);
    }

    return res.status(safeStatus).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.on("error", (err) => {
    console.error("Server failed to start:", err);
    process.exit(1);
  });

  const listenOptions =
    process.platform === "win32"
      ? { port, host: "0.0.0.0" as const }
      : { port, host: "0.0.0.0" as const, reusePort: true };

  httpServer.listen(
    listenOptions,
    () => {
      log(`serving on port ${port}`);

      (async () => {
        try {
          await initStripe();
        } catch (err) {
          console.error("[stripe] Init failed (non-fatal):", err);
        }

        try {
          await setupAdmin(app);
        } catch (err) {
          console.error("[admin] Init failed (non-fatal):", err);
        }
      })();
    },
  );
})().catch((err) => {
  console.error("Failed during server startup:", err);
  process.exit(1);
});
