import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ORDER_STATUS_VALUES = [
  "pending",
  "paid",
  "active",
  "past_due",
  "cancelled",
  "unpaid",
  "paused",
  "refunded",
] as const;

export const ORDER_TYPE_VALUES = ["one_time", "subscription"] as const;

export const FULFILLMENT_STATUS_VALUES = [
  "unfulfilled",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number];
export type OrderType = (typeof ORDER_TYPE_VALUES)[number];
export type FulfillmentStatus = (typeof FULFILLMENT_STATUS_VALUES)[number];
export type BlogPostStatus = "draft" | "published" | "archived";
export type DiscountType = "percentage" | "fixed_amount";

export interface OrderLineItem {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  isSubscribe: boolean;
  frequency: string;
}

export const orderLineItemSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().finite().nonnegative(),
  quantity: z.number().int().positive(),
  isSubscribe: z.boolean(),
  frequency: z.string().min(1),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  resetToken: text("reset_token"),
  resetTokenExpiresAt: timestamp("reset_token_expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  username: z.string().min(2),
  password: z.string().min(8),
}).omit({
    id: true,
    createdAt: true,
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  email: text("email").notNull(),
  status: text("status").notNull().default("pending"),
  orderType: text("order_type").notNull().default("one_time"),
  totalAmount: integer("total_amount").notNull(),
  currency: text("currency").notNull().default("usd"),
  shippingFirstName: text("shipping_first_name").notNull(),
  shippingLastName: text("shipping_last_name").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  shippingApt: text("shipping_apt"),
  shippingCity: text("shipping_city").notNull(),
  shippingState: text("shipping_state").notNull(),
  shippingZip: text("shipping_zip").notNull(),
  shippingCountry: text("shipping_country").notNull().default("US"),
  items: jsonb("items").notNull().$type<OrderLineItem[]>(),
  fulfillmentStatus: text("fulfillment_status").notNull().default("unfulfilled"),
  trackingNumber: text("tracking_number"),
  trackingCarrier: text("tracking_carrier"),
  trackingUrl: text("tracking_url"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders, {
  email: z.string().email(),
  status: z.enum(ORDER_STATUS_VALUES),
  orderType: z.enum(ORDER_TYPE_VALUES),
  currency: z.string().min(3).max(8),
  shippingCountry: z.string().min(2).max(64),
  items: z.array(orderLineItemSchema).min(1),
  fulfillmentStatus: z.enum(FULFILLMENT_STATUS_VALUES),
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  price: integer("price").notNull(),
  subscriptionPrice: integer("subscription_price"),
  ingredients: text("ingredients"),
  dosage: text("dosage"),
  servingsPerContainer: integer("servings_per_container"),
  imageUrl: text("image_url"),
  thumbnailUrl: text("thumbnail_url"),
  category: text("category"),
  isActive: boolean("is_active").default(true).notNull(),
  stockQuantity: integer("stock_quantity").default(100).notNull(),
  lowStockThreshold: integer("low_stock_threshold").default(10).notNull(),
  trackInventory: boolean("track_inventory").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: varchar("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImageUrl: text("featured_image_url"),
  author: text("author"),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  tags: text("tags").array(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const discountCodes = pgTable("discount_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code").notNull().unique(),
  description: text("description"),
  discountType: text("discount_type").notNull(),
  discountValue: integer("discount_value").notNull(),
  minimumOrderAmount: integer("minimum_order_amount"),
  maxUses: integer("max_uses"),
  currentUses: integer("current_uses").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const faqEntries = pgTable("faq_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const emailLogs = pgTable("email_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recipientEmail: text("recipient_email").notNull(),
  emailType: text("email_type").notNull(),
  subject: text("subject"),
  orderId: varchar("order_id").references(() => orders.id, { onDelete: "set null" }),
  status: text("status").notNull().default("sent"),
  resendMessageId: text("resend_message_id"),
  error: text("error"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts, {
  status: z.enum(["draft", "published", "archived"] as const),
  tags: z.array(z.string()).optional().nullable(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDiscountCodeSchema = createInsertSchema(discountCodes, {
  discountType: z.enum(["percentage", "fixed_amount"] as const),
}).omit({
  id: true,
  createdAt: true,
});

export const insertFaqEntrySchema = createInsertSchema(faqEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmailLogSchema = createInsertSchema(emailLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertDiscountCode = z.infer<typeof insertDiscountCodeSchema>;
export type DiscountCode = typeof discountCodes.$inferSelect;
export type InsertFaqEntry = z.infer<typeof insertFaqEntrySchema>;
export type FaqEntry = typeof faqEntries.$inferSelect;
export type InsertEmailLog = z.infer<typeof insertEmailLogSchema>;
export type EmailLog = typeof emailLogs.$inferSelect;
