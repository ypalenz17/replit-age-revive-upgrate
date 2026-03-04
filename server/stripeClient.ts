import Stripe from "stripe";
import { runMigrations, StripeSync } from "stripe-replit-sync";

let cachedSync: StripeSync | null = null;

function getSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return key;
}

export async function getUncachableStripeClient(): Promise<Stripe> {
  return new Stripe(getSecretKey());
}

export async function getPublishableKey(): Promise<string> {
  const key = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!key) throw new Error("STRIPE_PUBLISHABLE_KEY not set");
  return key;
}

export async function getStripeSync(): Promise<StripeSync> {
  if (cachedSync) return cachedSync;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL required");

  cachedSync = new StripeSync({
    stripeSecretKey: getSecretKey(),
    databaseUrl,
  } as any);
  return cachedSync;
}

export async function initStripe(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn("[stripe] DATABASE_URL not set, skipping Stripe init");
    return;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("[stripe] STRIPE_SECRET_KEY not set, skipping Stripe init");
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
