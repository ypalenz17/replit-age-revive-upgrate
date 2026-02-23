import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { injectContent } from "./prerender";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const indexHtml = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");

  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api") || req.path.includes(".")) {
      return next();
    }
    const injected = injectContent(indexHtml, req.path);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(injected);
  });

  app.use(express.static(distPath));
}
