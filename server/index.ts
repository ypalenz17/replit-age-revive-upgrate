import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
app.disable("x-powered-by");

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

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");

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

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = Number(err?.status || err?.statusCode || 500);
    const isJsonSyntaxError =
      err instanceof SyntaxError &&
      (err as { status?: number }).status === 400 &&
      "body" in err;
    const safeStatus = Number.isFinite(status) && status >= 400 && status < 600 ? status : 500;
    const message = isJsonSyntaxError
      ? "Invalid JSON payload"
      : safeStatus >= 500
        ? "Internal Server Error"
        : typeof err?.message === "string" && err.message
          ? err.message
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

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
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
    },
  );
})().catch((err) => {
  console.error("Failed during server startup:", err);
  process.exit(1);
});
