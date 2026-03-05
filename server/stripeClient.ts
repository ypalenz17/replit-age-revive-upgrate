import { createRequire } from "module";

export interface StripePriceProductMetadata {
  slug?: string;
  isSubscribe?: string;
  frequency?: string;
  [key: string]: string | undefined;
}

export interface StripePriceProductObject {
  metadata?: StripePriceProductMetadata;
  [key: string]: unknown;
}

export interface StripeLineItem {
  description: string | null;
  amount_total: number | null;
  quantity: number | null;
  price?: {
    product?: string | StripePriceProductObject | null;
  } | null;
}

export interface StripeCheckoutSession {
  id: string;
  mode: string;
  payment_status?: string | null;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
  } | null;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: Record<string, string> | null;
  payment_intent?: string | { id: string } | null;
  subscription?: string | { id: string } | null;
  url?: string | null;
}

export interface StripeInvoice {
  billing_reason?: string | null;
  due_date?: number | null;
  subscription?: string | { id: string } | null;
}

export interface StripeSubscription {
  id: string;
  status: string;
}

export interface StripeWebhookEvent<TObject = unknown> {
  type: string;
  data: { object: TObject };
}

export interface StripeCoupon {
  id: string;
}

export interface StripeClient {
  checkout: {
    sessions: {
      create(params: Record<string, unknown>): Promise<StripeCheckoutSession>;
      retrieve(sessionId: string, params?: Record<string, unknown>): Promise<StripeCheckoutSession>;
      listLineItems(sessionId: string, params?: Record<string, unknown>): Promise<{ data: StripeLineItem[] }>;
    };
  };
  coupons: {
    create(
      params: {
        duration: "once";
        name?: string;
        percent_off?: number;
        amount_off?: number;
        currency?: string;
      },
    ): Promise<StripeCoupon>;
  };
  webhooks: {
    constructEvent(payload: Buffer, signature: string, webhookSecret: string): StripeWebhookEvent;
  };
}

export interface StripeSyncClient {
  processWebhook(payload: Buffer, signature: string): Promise<void>;
  findOrCreateManagedWebhook(webhookUrl: string): Promise<void>;
  syncBackfill(): Promise<void>;
}

type StripeConstructor = new (secretKey: string) => StripeClient;
type StripeSyncConstructor = new (params: { stripeSecretKey: string; databaseUrl: string }) => StripeSyncClient;
type RunMigrations = (params: { databaseUrl: string }) => Promise<void>;

interface StripeSyncRuntime {
  StripeSync: StripeSyncConstructor;
  runMigrations: RunMigrations;
}

const require = createRequire(import.meta.url);
let cachedSync: StripeSyncClient | null = null;
let cachedStripeConstructor: StripeConstructor | null = null;
let cachedStripeSyncRuntime: StripeSyncRuntime | null | undefined;

function getSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY not set");
  }
  return key;
}

function getStripeConstructor(): StripeConstructor {
  if (cachedStripeConstructor) {
    return cachedStripeConstructor;
  }

  try {
    const stripeModule = require("stripe") as { default?: unknown };
    const candidate = (stripeModule.default ?? stripeModule) as StripeConstructor;
    if (typeof candidate !== "function") {
      throw new Error("stripe module did not export a constructor");
    }

    cachedStripeConstructor = candidate;
    return candidate;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Stripe SDK unavailable. Install 'stripe' to enable payments. ${message}`);
  }
}

function getStripeSyncRuntime(): StripeSyncRuntime | null {
  if (cachedStripeSyncRuntime !== undefined) {
    return cachedStripeSyncRuntime;
  }

  try {
    const runtime = require("stripe-replit-sync") as {
      StripeSync?: unknown;
      runMigrations?: unknown;
    };

    const StripeSync = runtime.StripeSync as StripeSyncConstructor;
    const runMigrations = runtime.runMigrations as RunMigrations;

    if (typeof StripeSync !== "function" || typeof runMigrations !== "function") {
      cachedStripeSyncRuntime = null;
      return cachedStripeSyncRuntime;
    }

    cachedStripeSyncRuntime = { StripeSync, runMigrations };
    return cachedStripeSyncRuntime;
  } catch {
    cachedStripeSyncRuntime = null;
    return cachedStripeSyncRuntime;
  }
}

export async function getUncachableStripeClient(): Promise<StripeClient> {
  const Stripe = getStripeConstructor();
  return new Stripe(getSecretKey());
}

export async function getPublishableKey(): Promise<string> {
  const key = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error("STRIPE_PUBLISHABLE_KEY not set");
  }
  return key;
}

export async function getStripeSync(): Promise<StripeSyncClient> {
  if (cachedSync) {
    return cachedSync;
  }

  const runtime = getStripeSyncRuntime();
  if (!runtime) {
    throw new Error("stripe-replit-sync is not installed");
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL required");
  }

  cachedSync = new runtime.StripeSync({
    stripeSecretKey: getSecretKey(),
    databaseUrl,
  });

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

  const runtime = getStripeSyncRuntime();
  if (!runtime) {
    console.warn("[stripe] stripe-replit-sync not installed, skipping Stripe sync init");
    return;
  }

  console.log("[stripe] Running migrations...");
  await runtime.runMigrations({ databaseUrl });

  console.log("[stripe] Getting sync instance...");
  const stripeSync = await getStripeSync();

  const replitDomains = process.env.REPLIT_DOMAINS || process.env.REPL_SLUG;
  if (replitDomains) {
    const domain = replitDomains.split(",")[0]?.trim();
    if (domain) {
      const webhookUrl = `https://${domain}/api/stripe/webhook`;
      console.log(`[stripe] Setting up webhook at ${webhookUrl}`);
      try {
        await stripeSync.findOrCreateManagedWebhook(webhookUrl);
      } catch (err) {
        console.warn("[stripe] Webhook setup warning:", err);
      }
    }
  }

  console.log("[stripe] Syncing backfill...");
  await stripeSync.syncBackfill();
  console.log("[stripe] Initialization complete");
}
