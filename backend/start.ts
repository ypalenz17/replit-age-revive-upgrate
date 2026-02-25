async function setupAndStart() {
  if (!process.env.STRIPE_API_KEY) {
    try {
      const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
      const xReplitToken = process.env.REPL_IDENTITY
        ? "repl " + process.env.REPL_IDENTITY
        : process.env.WEB_REPL_RENEWAL
          ? "depl " + process.env.WEB_REPL_RENEWAL
          : null;

      if (xReplitToken && hostname) {
        const isProduction = process.env.REPLIT_DEPLOYMENT === "1";
        const env = isProduction ? "production" : "development";
        const url = new URL(`https://${hostname}/api/v2/connection`);
        url.searchParams.set("include_secrets", "true");
        url.searchParams.set("connector_names", "stripe");
        url.searchParams.set("environment", env);

        const response = await fetch(url.toString(), {
          headers: {
            Accept: "application/json",
            "X-Replit-Token": xReplitToken,
          },
        });

        const data = await response.json();
        const settings = data.items?.[0]?.settings;

        if (settings?.secret) {
          process.env.STRIPE_API_KEY = settings.secret;
          console.log("Stripe API key loaded from Replit connection");
        }
      }
    } catch (err) {
      console.warn("Could not fetch Stripe key from Replit connection:", err);
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
  if (!process.env.PORT) process.env.PORT = "9000";

  const { execSync } = await import("child_process");
  const cmd = process.argv.includes("--migrate")
    ? "npx medusa db:migrate"
    : "npx medusa develop --port " + process.env.PORT;

  console.log(`Starting: ${cmd}`);
  execSync(cmd, {
    stdio: "inherit",
    cwd: process.cwd(),
    env: process.env,
  });
}

setupAndStart().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
