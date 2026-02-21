import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { injectContent } from "./prerender";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

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
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api") || req.path.includes(".")) {
      return next();
    }
    const routePath = req.path;
    const originalEnd = res.end.bind(res);
    const originalSend = res.send.bind(res);

    res.send = function (body?: any) {
      const contentType = res.getHeader("content-type");
      if (
        contentType &&
        typeof contentType === "string" &&
        contentType.includes("text/html") &&
        typeof body === "string"
      ) {
        body = injectContent(body, routePath);
      }
      return originalSend(body);
    } as any;

    res.end = function (chunk?: any, ...args: any[]) {
      const contentType = res.getHeader("content-type");
      if (
        contentType &&
        typeof contentType === "string" &&
        contentType.includes("text/html") &&
        chunk
      ) {
        const str = typeof chunk === "string" ? chunk : chunk.toString("utf-8");
        const injected = injectContent(str, routePath);
        return (originalEnd as any)(injected, ...args);
      }
      return (originalEnd as any)(chunk, ...args);
    } as any;
    next();
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
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
