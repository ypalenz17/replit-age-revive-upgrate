const path = require("path");
const { execSync } = require("child_process");

async function setup() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!process.env.STRIPE_API_KEY && xReplitToken && hostname) {
    try {
      const isProduction = process.env.REPLIT_DEPLOYMENT === "1";
      const env = isProduction ? "production" : "development";
      const url = new URL(`https://${hostname}/api/v2/connection`);
      url.searchParams.set("include_secrets", "true");
      url.searchParams.set("connector_names", "stripe");
      url.searchParams.set("environment", env);

      const response = await fetch(url.toString(), {
        headers: { Accept: "application/json", "X-Replit-Token": xReplitToken },
      });

      const data = await response.json();
      const settings = data.items?.[0]?.settings;
      if (settings?.secret) {
        process.env.STRIPE_API_KEY = settings.secret;
        console.log("Stripe API key loaded from Replit connection");
      }
    } catch (err) {
      console.warn("Could not fetch Stripe key:", err.message);
    }
  }

  const replitDomains = process.env.REPLIT_DOMAINS || process.env.REPLIT_DEV_DOMAIN || "";
  const primaryDomain = replitDomains.split(",")[0]?.trim();

  if (primaryDomain) {
    const origin = `https://${primaryDomain}`;
    if (!process.env.STORE_CORS) process.env.STORE_CORS = origin;
    if (!process.env.ADMIN_CORS) process.env.ADMIN_CORS = origin;
    if (!process.env.AUTH_CORS) process.env.AUTH_CORS = origin;
    if (!process.env.MEDUSA_BACKEND_URL) process.env.MEDUSA_BACKEND_URL = origin;
  }

  process.env.HOST = "0.0.0.0";
  process.env.PORT = process.env.MEDUSA_PORT || "9000";
}

async function start() {
  await setup();

  const rootDir = path.resolve(__dirname, "..");
  const startCmd = require(path.join(rootDir, "node_modules", "@medusajs", "medusa", "dist", "commands", "start.js")).default;

  console.log("Starting Medusa on port " + process.env.PORT + "...");

  await startCmd({
    directory: __dirname,
    port: parseInt(process.env.PORT),
  });
}

start().catch((err) => {
  console.error("Medusa start failed:", err);
  process.exit(1);
});
