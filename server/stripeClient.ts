import Stripe from "stripe";
import { runMigrations, StripeSync } from "stripe-replit-sync";

let cachedSync: StripeSync | null = null;

interface TokenData {
  access_token: string;
  token_type: string;
}

async function fetchStripeCredentials(): Promise<{ secretKey: string; publishableKey: string }> {
  const connectorsHost = process.env.REPLIT_CONNECTORS_HOSTNAME;
  if (!connectorsHost) {
    throw new Error("REPLIT_CONNECTORS_HOSTNAME not set");
  }

  const identityToken = process.env.REPL_IDENTITY;
  const renewalToken = process.env.WEB_REPL_RENEWAL;

  let token = identityToken;
  if (renewalToken) {
    try {
      const renewRes = await fetch(renewalToken);
      if (renewRes.ok) {
        const data = (await renewRes.json()) as TokenData;
        token = data.access_token;
      }
    } catch {}
  }

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(
    `http://${connectorsHost}/proxy/stripe/getCredentials`,
    {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({}),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch Stripe credentials: ${res.status} ${text}`);
  }

  const creds = (await res.json()) as { publishableKey: string; secretKey: string };
  return { secretKey: creds.secretKey, publishableKey: creds.publishableKey };
}

export async function getUncachableStripeClient(): Promise<Stripe> {
  const { secretKey } = await fetchStripeCredentials();
  return new Stripe(secretKey);
}

export async function getPublishableKey(): Promise<string> {
  const { publishableKey } = await fetchStripeCredentials();
  return publishableKey;
}

export async function getStripeSync(): Promise<StripeSync> {
  if (cachedSync) return cachedSync;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL required");

  const stripe = await getUncachableStripeClient();
  cachedSync = new StripeSync({ stripe, databaseUrl });
  return cachedSync;
}

export async function initStripe(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn("[stripe] DATABASE_URL not set, skipping Stripe init");
    return;
  }

  console.log("[stripe] Running migrations...");
  await runMigrations({ databaseUrl });

  console.log("[stripe] Getting sync instance...");
  const stripeSync = await getStripeSync();

  const replitDomains = process.env.REPLIT_DOMAINS || process.env.REPL_SLUG;
  if (replitDomains) {
    const domain = replitDomains.split(",")[0];
    const webhookUrl = `https://${domain}/api/stripe/webhook`;
    console.log(`[stripe] Setting up webhook at ${webhookUrl}`);
    try {
      await stripeSync.findOrCreateManagedWebhook(webhookUrl);
    } catch (err) {
      console.warn("[stripe] Webhook setup warning:", err);
    }
  }

  console.log("[stripe] Syncing backfill...");
  await stripeSync.syncBackfill();
  console.log("[stripe] Initialization complete");
}
