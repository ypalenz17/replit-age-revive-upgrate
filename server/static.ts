import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { injectContent } from "./prerender";

function toPosixPath(filePath: string): string {
  return filePath.replace(/\\/g, "/");
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const indexHtml = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");

  app.use(
    express.static(distPath, {
      etag: true,
      lastModified: true,
      index: false,
      setHeaders: (res, filePath) => {
        const normalized = toPosixPath(filePath);
        if (normalized.includes("/assets/")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          return;
        }

        if (
          normalized.endsWith("/robots.txt") ||
          normalized.endsWith("/sitemap.xml") ||
          normalized.endsWith("/llms.txt")
        ) {
          res.setHeader("Cache-Control", "public, max-age=3600");
          return;
        }

        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      },
    }),
  );

  app.use((req, res, next) => {
    if ((req.method !== "GET" && req.method !== "HEAD") || req.path.startsWith("/api") || req.path.includes(".")) {
      return next();
    }
    try {
      const injected = injectContent(indexHtml, req.path);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      res.send(injected);
    } catch {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      res.send(indexHtml);
    }
  });
}
