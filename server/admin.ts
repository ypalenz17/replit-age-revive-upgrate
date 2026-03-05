import AdminJS, {
  type ActionContext,
  type ActionRequest,
  type ActionResponse,
  ComponentLoader,
  type CurrentAdmin,
  type RecordActionResponse,
} from "adminjs";
import AdminJSExpress from "@adminjs/express";
import uploadFeature from "@adminjs/upload";
import express, { type Express } from "express";
import { Database, Resource } from "adminjs-drizzle/pg";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
import { pbkdf2 as pbkdf2Callback, timingSafeEqual } from "crypto";
import { promisify } from "util";
import {
  blogPosts,
  discountCodes,
  emailLogs,
  faqEntries,
  orders,
  products,
  users,
  type InsertProduct,
  type Order,
} from "@shared/schema";
import { db, storage } from "./storage";
import { getUncachableStripeClient } from "./stripeClient";
import { sendShippingNotification } from "./email";
import { PRODUCT_DETAIL_DATA, PRODUCT_IMAGES } from "../client/src/productData";

const require = createRequire(import.meta.url);
const pbkdf2 = promisify(pbkdf2Callback);
const PBKDF2_ITERATIONS = 210_000;
const PBKDF2_DIGEST = "sha256";
const ADMIN_ROOT_PATH = "/admin";
const ADMIN_UPLOAD_BASE_URL = "/admin/uploads";
const ADMIN_UPLOAD_DIR = path.resolve(process.cwd(), "attached_assets", "admin-uploads");

interface BcryptModule {
  compare(password: string, hash: string): Promise<boolean>;
}

interface AdminSessionUser extends CurrentAdmin {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

interface StripeAdminClient {
  refunds: {
    create(params: { payment_intent: string; reason?: string }): Promise<unknown>;
  };
  subscriptions: {
    cancel(subscriptionId: string): Promise<unknown>;
  };
}

let bcryptModuleCache: BcryptModule | null | undefined;
let adminAdapterRegistered = false;
let adminMounted = false;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function stripMarkupAndAsterisks(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getOptionalBcryptModule(): BcryptModule | null {
  if (bcryptModuleCache !== undefined) {
    return bcryptModuleCache;
  }

  try {
    const bcrypt = require("bcrypt") as { default?: unknown };
    const candidate = (bcrypt.default ?? bcrypt) as BcryptModule;
    if (typeof candidate.compare !== "function") {
      bcryptModuleCache = null;
      return bcryptModuleCache;
    }

    bcryptModuleCache = candidate;
    return bcryptModuleCache;
  } catch {
    bcryptModuleCache = null;
    return bcryptModuleCache;
  }
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (storedHash.startsWith("pbkdf2$")) {
    const parts = storedHash.split("$");
    if (parts.length !== 4) {
      return false;
    }

    const digest = parts[1];
    const salt = parts[2];
    const expectedHex = parts[3];

    if (!digest || !salt || !expectedHex) {
      return false;
    }

    const expected = Buffer.from(expectedHex, "hex");
    const derived = await pbkdf2(password, salt, PBKDF2_ITERATIONS, expected.length, digest);
    return expected.length === derived.length && timingSafeEqual(expected, derived);
  }

  const bcrypt = getOptionalBcryptModule();
  if (!bcrypt) {
    return false;
  }

  return bcrypt.compare(password, storedHash);
}

function toCents(value: number): number {
  return Math.round(value * 100);
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function reloadRecordResponse(
  context: ActionContext,
  fallbackRecord: NonNullable<ActionContext["record"]>,
  notice?: ActionResponse["notice"],
): Promise<RecordActionResponse> {
  const recordId = asNonEmptyString(fallbackRecord.params.id);
  if (!recordId) {
    return {
      record: fallbackRecord.toJSON(context.currentAdmin),
      notice,
    };
  }

  const refreshed = await context.resource.findOne(recordId);
  return {
    record: (refreshed ?? fallbackRecord).toJSON(context.currentAdmin),
    notice,
  };
}

async function authenticateAdmin(email: string, password: string): Promise<AdminSessionUser | null> {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    return null;
  }

  const user = await storage.getUserByEmail(normalizedEmail);
  if (!user || !user.isAdmin) {
    return null;
  }

  const validPassword = await verifyPassword(password, user.password);
  if (!validPassword) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    isAdmin: user.isAdmin,
  };
}

function buildSeedProducts(): InsertProduct[] {
  const seedConfig: Array<{ slug: "cellunad" | "cellubiome" | "cellunova"; price: number; subscriptionPrice: number }> = [
    { slug: "cellunad", price: 79.99, subscriptionPrice: 67.99 },
    { slug: "cellubiome", price: 110.0, subscriptionPrice: 93.5 },
    { slug: "cellunova", price: 49.99, subscriptionPrice: 42.49 },
  ];

  return seedConfig.map((config, index) => {
    const detail = PRODUCT_DETAIL_DATA[config.slug];
    const ingredientsText = detail.supplementFacts.items
      .map((item) => `${stripMarkupAndAsterisks(item.name)}: ${stripMarkupAndAsterisks(item.amount)}`)
      .join("; ");

    const otherIngredients = detail.supplementFacts.otherIngredients
      ? ` Other ingredients: ${stripMarkupAndAsterisks(detail.supplementFacts.otherIngredients)}`
      : "";

    return {
      slug: config.slug,
      name: stripMarkupAndAsterisks(detail.name),
      tagline: stripMarkupAndAsterisks(detail.tagline),
      description: stripMarkupAndAsterisks(detail.subtitle || detail.tagline),
      price: toCents(config.price),
      subscriptionPrice: toCents(config.subscriptionPrice),
      ingredients: `${ingredientsText}${otherIngredients}`,
      dosage: stripMarkupAndAsterisks(detail.serving),
      servingsPerContainer: detail.servingsPerContainer,
      imageUrl: PRODUCT_IMAGES[config.slug]?.[0] ?? null,
      thumbnailUrl: PRODUCT_IMAGES[config.slug]?.[1] ?? PRODUCT_IMAGES[config.slug]?.[0] ?? null,
      category: "supplement",
      isActive: true,
      sortOrder: index,
    };
  });
}

async function seedProductsIfEmpty(): Promise<void> {
  const productCount = await storage.countProducts();
  if (productCount > 0) {
    return;
  }

  await storage.createProductsSeed(buildSeedProducts());
  console.log("[admin] Seeded products table with default Age Revive catalog.");
}

async function logAdminUserHintIfNeeded(): Promise<void> {
  const adminCount = await storage.getAdminUserCount();
  if (adminCount === 0) {
    console.log("No admin users found. Create one by setting is_admin=true on a user record.");
  }
}

function createOrdersResourceOptions() {
  return {
    navigation: { name: "Commerce", icon: "ShoppingCart" },
    listProperties: ["displayId", "email", "status", "orderType", "totalAmount", "fulfillmentStatus", "createdAt"],
    filterProperties: ["status", "fulfillmentStatus", "orderType", "email"],
    editProperties: ["status", "fulfillmentStatus", "trackingNumber", "trackingCarrier", "trackingUrl"],
    properties: {
      displayId: {
        label: "id",
        isSortable: false,
        isVisible: { list: true, show: false, filter: false, edit: false },
      },
      id: {
        isVisible: { list: false, show: true, filter: true, edit: false },
      },
    },
    actions: {
      new: { isAccessible: false },
      delete: { isAccessible: false },
      bulkDelete: { isAccessible: false },
      list: {
        after: async (response: ActionResponse) => {
          const records = Array.isArray(response.records)
            ? response.records
            : [];

          for (const record of records) {
            const id = asNonEmptyString(record.params.id);
            record.params.displayId = id ? id.slice(0, 8) : "";

            const total = Number(record.params.totalAmount);
            if (Number.isFinite(total)) {
              record.params.totalAmount = `$${(total / 100).toFixed(2)}`;
            }
          }

          return response;
        },
      },
      issueRefund: {
        actionType: "record",
        icon: "Payment",
        label: "Issue Refund",
        guard: "Issue a Stripe refund for this order?",
        isAccessible: ({ record }: ActionContext) => Boolean(record && asNonEmptyString(record.params.stripePaymentIntentId)),
        handler: async (
          _request: ActionRequest,
          _response: unknown,
          context: ActionContext,
        ): Promise<ActionResponse | RecordActionResponse> => {
          const { record } = context;
          if (!record || !db) {
            return {
              notice: {
                message: "Order not found.",
                type: "error",
              },
            };
          }

          const recordId = asNonEmptyString(record.params.id);
          const paymentIntentId = asNonEmptyString(record.params.stripePaymentIntentId);
          if (!recordId || !paymentIntentId) {
            return {
              record: record.toJSON(context.currentAdmin),
              notice: {
                message: "Stripe payment intent is required to refund.",
                type: "error",
              },
            };
          }

          try {
            const stripe = (await getUncachableStripeClient()) as unknown as StripeAdminClient;
            await stripe.refunds.create({
              payment_intent: paymentIntentId,
              reason: "requested_by_customer",
            });

            await db
              .update(orders)
              .set({ status: "refunded", updatedAt: new Date() })
              .where(eq(orders.id, recordId));

            return reloadRecordResponse(context, record, {
              message: "Refund issued successfully.",
              type: "success",
            });
          } catch (error) {
            const message = error instanceof Error ? error.message : "Refund failed";
            return {
              record: record.toJSON(context.currentAdmin),
              notice: {
                message,
                type: "error",
              },
            };
          }
        },
      },
      markShipped: {
        actionType: "record",
        icon: "DeliveryTruck",
        label: "Mark Shipped",
        guard: "Mark this order as shipped and send a shipping notification?",
        handler: async (
          _request: ActionRequest,
          _response: unknown,
          context: ActionContext,
        ): Promise<ActionResponse | RecordActionResponse> => {
          const { record } = context;
          if (!record || !db) {
            return {
              notice: {
                message: "Order not found.",
                type: "error",
              },
            };
          }

          const recordId = asNonEmptyString(record.params.id);
          if (!recordId) {
            return {
              record: record.toJSON(context.currentAdmin),
              notice: {
                message: "Order id is missing.",
                type: "error",
              },
            };
          }

          try {
            const [updated] = await db
              .update(orders)
              .set({
                fulfillmentStatus: "shipped",
                shippedAt: new Date(),
                trackingNumber: asNonEmptyString(record.params.trackingNumber),
                trackingCarrier: asNonEmptyString(record.params.trackingCarrier),
                trackingUrl: asNonEmptyString(record.params.trackingUrl),
                updatedAt: new Date(),
              })
              .where(eq(orders.id, recordId))
              .returning();

            if (updated) {
              sendShippingNotification(updated as Order).catch((err) => {
                console.error("[admin] Failed to send shipping notification:", err);
              });
            }

            return reloadRecordResponse(context, record, {
              message: "Order marked as shipped.",
              type: "success",
            });
          } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to mark order shipped";
            return {
              record: record.toJSON(context.currentAdmin),
              notice: {
                message,
                type: "error",
              },
            };
          }
        },
      },
      cancelSubscription: {
        actionType: "record",
        icon: "Close",
        label: "Cancel Subscription",
        guard: "Cancel this Stripe subscription?",
        isAccessible: ({ record }: ActionContext) =>
          Boolean(
            record &&
              record.params.orderType === "subscription" &&
              asNonEmptyString(record.params.stripeSubscriptionId),
          ),
        handler: async (
          _request: ActionRequest,
          _response: unknown,
          context: ActionContext,
        ): Promise<ActionResponse | RecordActionResponse> => {
          const { record } = context;
          if (!record || !db) {
            return {
              notice: {
                message: "Order not found.",
                type: "error",
              },
            };
          }

          const recordId = asNonEmptyString(record.params.id);
          const subscriptionId = asNonEmptyString(record.params.stripeSubscriptionId);

          if (!recordId || !subscriptionId) {
            return {
              record: record.toJSON(context.currentAdmin),
              notice: {
                message: "Stripe subscription id is required.",
                type: "error",
              },
            };
          }

          try {
            const stripe = (await getUncachableStripeClient()) as unknown as StripeAdminClient;
            await stripe.subscriptions.cancel(subscriptionId);

            await db
              .update(orders)
              .set({ status: "cancelled", updatedAt: new Date() })
              .where(eq(orders.id, recordId));

            return reloadRecordResponse(context, record, {
              message: "Subscription cancelled successfully.",
              type: "success",
            });
          } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to cancel subscription";
            return {
              record: record.toJSON(context.currentAdmin),
              notice: {
                message,
                type: "error",
              },
            };
          }
        },
      },
    },
  };
}

function createUsersResourceOptions() {
  return {
    navigation: { name: "Accounts", icon: "User" },
    listProperties: ["displayId", "email", "username", "isAdmin", "createdAt"],
    filterProperties: ["email", "username", "isAdmin"],
    editProperties: ["isAdmin"],
    showProperties: ["id", "email", "username", "isAdmin", "createdAt"],
    properties: {
      displayId: {
        label: "id",
        isSortable: false,
        isVisible: { list: true, show: false, filter: false, edit: false },
      },
      id: {
        isVisible: { list: false, show: true, filter: true, edit: false },
      },
      password: { isVisible: false },
      resetToken: { isVisible: false },
      resetTokenExpiresAt: { isVisible: false },
    },
    actions: {
      new: { isAccessible: false },
      delete: { isAccessible: false },
      bulkDelete: { isAccessible: false },
      list: {
        after: async (response: ActionResponse) => {
          const records = Array.isArray(response.records) ? response.records : [];
          for (const record of records) {
            const id = asNonEmptyString(record.params.id);
            record.params.displayId = id ? id.slice(0, 8) : "";
          }
          return response;
        },
      },
    },
  };
}

function createProductsResourceConfig(componentLoader: ComponentLoader) {
  const options = {
    navigation: { name: "Catalog", icon: "Catalog" },
    listProperties: ["name", "slug", "price", "subscriptionPrice", "isActive", "sortOrder"],
    editProperties: [
      "slug",
      "name",
      "tagline",
      "description",
      "price",
      "subscriptionPrice",
      "ingredients",
      "dosage",
      "servingsPerContainer",
      "imageUrl",
      "thumbnailUrl",
      "category",
      "isActive",
      "sortOrder",
    ],
    actions: {
      list: {
        after: async (response: ActionResponse) => {
          const records = Array.isArray(response.records)
            ? response.records
            : [];

          for (const record of records) {
            const price = Number(record.params.price);
            if (Number.isFinite(price)) {
              record.params.price = `$${(price / 100).toFixed(2)}`;
            }

            const subPrice = Number(record.params.subscriptionPrice);
            if (Number.isFinite(subPrice)) {
              record.params.subscriptionPrice = `$${(subPrice / 100).toFixed(2)}`;
            }
          }

          return response;
        },
      },
    },
  };

  const features = [
    uploadFeature({
      componentLoader,
      provider: {
        local: {
          bucket: ADMIN_UPLOAD_DIR,
          opts: {
            baseUrl: ADMIN_UPLOAD_BASE_URL,
          },
        },
      },
      properties: {
        key: "imageUrl",
        file: "imageUpload",
        filePath: "imageUrlPath",
      },
    }),
    uploadFeature({
      componentLoader,
      provider: {
        local: {
          bucket: ADMIN_UPLOAD_DIR,
          opts: {
            baseUrl: ADMIN_UPLOAD_BASE_URL,
          },
        },
      },
      properties: {
        key: "thumbnailUrl",
        file: "thumbnailUpload",
        filePath: "thumbnailUrlPath",
      },
    }),
  ];

  return { options, features };
}

function createBlogPostsResourceOptions() {
  return {
    navigation: { name: "Content", icon: "Document" },
    listProperties: ["title", "status", "author", "publishedAt", "createdAt"],
    filterProperties: ["status", "author"],
    actions: {
      publish: {
        actionType: "record",
        icon: "Publish",
        label: "Publish",
        guard: "Publish this post now?",
        isVisible: ({ record }: ActionContext) => record?.params.status !== "published",
        handler: async (
          _request: ActionRequest,
          _response: unknown,
          context: ActionContext,
        ): Promise<ActionResponse | RecordActionResponse> => {
          const { record } = context;
          if (!record || !db) {
            return {
              notice: {
                message: "Post not found.",
                type: "error",
              },
            };
          }

          const recordId = asNonEmptyString(record.params.id);
          if (!recordId) {
            return {
              record: record.toJSON(context.currentAdmin),
              notice: {
                message: "Post id is missing.",
                type: "error",
              },
            };
          }

          await db
            .update(blogPosts)
            .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
            .where(eq(blogPosts.id, recordId));

          return reloadRecordResponse(context, record, {
            message: "Post published.",
            type: "success",
          });
        },
      },
    },
  };
}

function createDiscountCodesResourceOptions() {
  return {
    navigation: { name: "Commerce", icon: "Percentage" },
    listProperties: [
      "code",
      "discountType",
      "discountValue",
      "isActive",
      "currentUses",
      "maxUses",
      "expiresAt",
    ],
    filterProperties: ["isActive", "discountType"],
  };
}

function createFaqResourceOptions() {
  return {
    navigation: { name: "Content", icon: "Help" },
    listProperties: ["question", "category", "sortOrder", "isActive"],
    actions: {
      list: {
        before: async (request: ActionRequest) => {
          const query = request.query ?? {};
          request.query = {
            ...query,
            sortBy: query.sortBy ?? "sortOrder",
            direction: query.direction ?? "asc",
          };
          return request;
        },
      },
    },
  };
}

function createEmailLogsResourceOptions() {
  return {
    navigation: { name: "Operations", icon: "Email" },
    listProperties: [
      "recipientEmail",
      "emailType",
      "subject",
      "orderId",
      "status",
      "resendMessageId",
      "createdAt",
    ],
    filterProperties: ["recipientEmail", "emailType", "status", "orderId", "createdAt"],
    showProperties: [
      "id",
      "recipientEmail",
      "emailType",
      "subject",
      "orderId",
      "status",
      "resendMessageId",
      "error",
      "createdAt",
    ],
    actions: {
      new: { isAccessible: false },
      edit: { isAccessible: false },
      delete: { isAccessible: false },
      bulkDelete: { isAccessible: false },
    },
  };
}

function getSessionSecret(): string {
  const sessionSecret = process.env.SESSION_SECRET;
  if (sessionSecret && sessionSecret.length >= 16) {
    return sessionSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set to a strong value in production");
  }

  return "dev-session-secret-change-me";
}

export async function setupAdmin(app: Express): Promise<void> {
  if (adminMounted) {
    return;
  }

  if (!db) {
    console.warn("[admin] DATABASE_URL not set. AdminJS is disabled.");
    return;
  }

  await fs.mkdir(ADMIN_UPLOAD_DIR, { recursive: true });
  app.use(ADMIN_UPLOAD_BASE_URL, express.static(ADMIN_UPLOAD_DIR));

  if (!adminAdapterRegistered) {
    AdminJS.registerAdapter({ Database, Resource });
    adminAdapterRegistered = true;
  }

  await seedProductsIfEmpty();
  await logAdminUserHintIfNeeded();

  const componentLoader = new ComponentLoader();
  const productsResource = createProductsResourceConfig(componentLoader);
  const admin = new AdminJS({
    rootPath: ADMIN_ROOT_PATH,
    resources: [
      {
        resource: { db, table: orders },
        options: createOrdersResourceOptions(),
      },
      {
        resource: { db, table: users },
        options: createUsersResourceOptions(),
      },
      {
        resource: { db, table: products },
        options: productsResource.options,
        features: productsResource.features,
      },
      {
        resource: { db, table: blogPosts },
        options: createBlogPostsResourceOptions(),
      },
      {
        resource: { db, table: discountCodes },
        options: createDiscountCodesResourceOptions(),
      },
      {
        resource: { db, table: faqEntries },
        options: createFaqResourceOptions(),
      },
      {
        resource: { db, table: emailLogs },
        options: createEmailLogsResourceOptions(),
      },
    ],
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: authenticateAdmin,
      cookieName: "ar.admin.sid",
      cookiePassword: getSessionSecret(),
    },
    null,
    {
      name: "ar.admin.sid",
      secret: getSessionSecret(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 8 * 60 * 60 * 1000,
      },
    },
  );

  app.use(admin.options.rootPath, adminRouter);
  adminMounted = true;
}
