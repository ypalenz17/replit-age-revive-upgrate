import { execSync } from "child_process";
import { existsSync, symlinkSync, unlinkSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const backendDir = __dirname;

const nodeModulesLink = resolve(backendDir, "node_modules");
const rootNodeModules = resolve(rootDir, "node_modules");

if (!existsSync(nodeModulesLink)) {
  try {
    symlinkSync(rootNodeModules, nodeModulesLink, "dir");
    console.log("Symlinked node_modules from root");
  } catch (err) {
    console.warn("Could not symlink node_modules:", err.message);
  }
}

async function setupStripeKey() {
  if (process.env.STRIPE_API_KEY) return;

  try {
    const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    const xReplitToken = process.env.REPL_IDENTITY
      ? "repl " + process.env.REPL_IDENTITY
      : process.env.WEB_REPL_RENEWAL
        ? "depl " + process.env.WEB_REPL_RENEWAL
        : null;

    if (!xReplitToken || !hostname) return;

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

async function setupCors() {
  const replitDomains =
    process.env.REPLIT_DOMAINS || process.env.REPLIT_DEV_DOMAIN || "";
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
}

await setupStripeKey();
await setupCors();

const action = process.argv[2] || "develop";
const port = process.env.PORT || "9000";

const commands = {
  migrate: "npx medusa migrations run",
  develop: `npx medusa develop --port ${port}`,
  start: `npx medusa start --port ${port}`,
  seed: "npx medusa exec ./src/scripts/seed.ts",
  "db:setup": "npx medusa migrations run && npx medusa links sync",
};

const cmd = commands[action] || commands.develop;
console.log(`Running: ${cmd} (from ${backendDir})`);

try {
  execSync(cmd, {
    stdio: "inherit",
    cwd: backendDir,
    env: process.env,
  });
} catch (err) {
  process.exit(err.status || 1);
}
