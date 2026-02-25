const path = require("path");

async function run() {
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

  const rootDir = path.resolve(__dirname, "..");
  const migrate = require(path.join(rootDir, "node_modules", "@medusajs", "medusa", "dist", "commands", "db", "migrate.js")).default;
  
  await migrate({
    directory: __dirname,
    skipLinks: false,
    skipScripts: false,
    executeAllLinks: false,
    executeSafeLinks: true,
  });

  console.log("Migrations completed successfully!");
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
