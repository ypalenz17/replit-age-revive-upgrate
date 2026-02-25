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
      if (settings?.secret) process.env.STRIPE_API_KEY = settings.secret;
    } catch (err) {}
  }

  const rootDir = path.resolve(__dirname, "..");
  const createUser = require(path.join(rootDir, "node_modules", "@medusajs", "medusa", "dist", "commands", "user.js")).default;
  
  await createUser({
    directory: __dirname,
    email: "admin@agerevive.com",
    password: "admin123",
  });

  console.log("Admin user created: admin@agerevive.com / admin123");
}

run().catch((err) => {
  console.error("User creation failed:", err);
  process.exit(1);
});
