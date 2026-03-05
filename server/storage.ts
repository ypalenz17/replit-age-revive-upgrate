import {
  type BlogPost,
  blogPosts,
  type DiscountCode,
  discountCodes,
  type InsertEmailLog,
  type FaqEntry,
  faqEntries,
  type InsertOrder,
  type InsertProduct,
  type InsertUser,
  type Order,
  type OrderLineItem,
  orders,
  type Product,
  products,
  type User,
  users,
  emailLogs,
} from "@shared/schema";
import { randomUUID } from "crypto";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  isNull,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  setResetToken(userId: string, token: string, expiresAt: Date): Promise<void>;
  clearResetToken(userId: string): Promise<void>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  getAdminUserCount(): Promise<number>;

  createOrder(order: InsertOrder): Promise<Order>;
  getOrderByStripeSessionId(sessionId: string): Promise<Order | undefined>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrdersByEmail(email: string): Promise<Order[]>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  transitionOrderStatus(id: string, fromStatuses: string[], toStatus: string): Promise<Order | undefined>;
  updateOrderFulfillment(
    id: string,
    fulfillmentStatus: string,
    trackingNumber?: string,
    trackingCarrier?: string,
    trackingUrl?: string,
  ): Promise<Order | undefined>;
  updateOrderPaymentIntent(id: string, paymentIntentId: string): Promise<Order | undefined>;
  updateOrderSubscription(id: string, subscriptionId: string): Promise<Order | undefined>;
  getOrderBySubscriptionId(subscriptionId: string): Promise<Order | undefined>;
  getActiveSubscriptionOrders(): Promise<Order[]>;

  listPublishedBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  listActiveProducts(): Promise<Product[]>;
  getProductsBySlugs(slugs: string[]): Promise<Product[]>;
  getActiveProductBySlug(slug: string): Promise<Product | undefined>;
  decrementInventoryByItems(items: OrderLineItem[]): Promise<void>;
  countProducts(): Promise<number>;
  createProductsSeed(productsToCreate: InsertProduct[]): Promise<void>;
  getDiscountCodeByCode(code: string): Promise<DiscountCode | undefined>;
  incrementDiscountCodeUses(id: string): Promise<boolean>;
  listActiveFaqEntries(): Promise<FaqEntry[]>;
  validateDiscountCode(code: string): Promise<DiscountCode | undefined>;
  createEmailLog(emailLog: InsertEmailLog): Promise<void>;
}

const databaseUrl = process.env.DATABASE_URL;
const pool = databaseUrl ? new pg.Pool({ connectionString: databaseUrl }) : null;

export const db: NodePgDatabase<Record<string, never>> | null = pool
  ? drizzle(pool)
  : null;

export class MemStorage implements IStorage {
  private userStore: Map<string, User>;

  constructor() {
    this.userStore = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.userStore.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(
      (user) => user.resetToken === token,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      isAdmin: insertUser.isAdmin ?? false,
      resetToken: null,
      resetTokenExpiresAt: null,
      createdAt: new Date(),
    };
    this.userStore.set(id, user);
    return user;
  }

  async setResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    const user = this.userStore.get(userId);
    if (user) {
      user.resetToken = token;
      user.resetTokenExpiresAt = expiresAt;
    }
  }

  async clearResetToken(userId: string): Promise<void> {
    const user = this.userStore.get(userId);
    if (user) {
      user.resetToken = null;
      user.resetTokenExpiresAt = null;
    }
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    const user = this.userStore.get(userId);
    if (user) {
      user.password = hashedPassword;
    }
  }

  async getAdminUserCount(): Promise<number> {
    let count = 0;
    for (const user of this.userStore.values()) {
      if (user.isAdmin) {
        count += 1;
      }
    }
    return count;
  }

  async createOrder(_order: InsertOrder): Promise<Order> {
    throw new Error("Database required for order operations");
  }

  async getOrderByStripeSessionId(_sessionId: string): Promise<Order | undefined> {
    throw new Error("Database required for order operations");
  }

  async getOrderById(_id: string): Promise<Order | undefined> {
    throw new Error("Database required for order operations");
  }

  async getOrdersByEmail(_email: string): Promise<Order[]> {
    throw new Error("Database required for order operations");
  }
  async getOrdersByUserId(_userId: string): Promise<Order[]> {
    throw new Error("Database required for order operations");
  }

  async updateOrderStatus(_id: string, _status: string): Promise<Order | undefined> {
    throw new Error("Database required for order operations");
  }
  async transitionOrderStatus(_id: string, _fromStatuses: string[], _toStatus: string): Promise<Order | undefined> {
    throw new Error("Database required for order operations");
  }

  async updateOrderFulfillment(
    _id: string,
    _fulfillmentStatus: string,
    _trackingNumber?: string,
    _trackingCarrier?: string,
    _trackingUrl?: string,
  ): Promise<Order | undefined> {
    throw new Error("Database required for order operations");
  }

  async updateOrderPaymentIntent(_id: string, _paymentIntentId: string): Promise<Order | undefined> {
    throw new Error("Database required for order operations");
  }

  async updateOrderSubscription(_id: string, _subscriptionId: string): Promise<Order | undefined> {
    throw new Error("Database required for order operations");
  }

  async getOrderBySubscriptionId(_subscriptionId: string): Promise<Order | undefined> {
    throw new Error("Database required for order operations");
  }

  async getActiveSubscriptionOrders(): Promise<Order[]> {
    throw new Error("Database required for order operations");
  }

  async listPublishedBlogPosts(): Promise<BlogPost[]> {
    return [];
  }

  async getPublishedBlogPostBySlug(_slug: string): Promise<BlogPost | undefined> {
    return undefined;
  }

  async listActiveProducts(): Promise<Product[]> {
    return [];
  }

  async getProductsBySlugs(_slugs: string[]): Promise<Product[]> {
    return [];
  }

  async getActiveProductBySlug(_slug: string): Promise<Product | undefined> {
    return undefined;
  }

  async decrementInventoryByItems(_items: OrderLineItem[]): Promise<void> {
    return;
  }

  async countProducts(): Promise<number> {
    return 0;
  }

  async createProductsSeed(_productsToCreate: InsertProduct[]): Promise<void> {
    return;
  }

  async getDiscountCodeByCode(_code: string): Promise<DiscountCode | undefined> {
    return undefined;
  }

  async incrementDiscountCodeUses(_id: string): Promise<boolean> {
    return true;
  }

  async listActiveFaqEntries(): Promise<FaqEntry[]> {
    return [];
  }

  async validateDiscountCode(_code: string): Promise<DiscountCode | undefined> {
    return undefined;
  }

  async createEmailLog(_emailLog: InsertEmailLog): Promise<void> {
    return;
  }
}

export class DatabaseStorage implements IStorage {
  private db: NodePgDatabase<Record<string, never>>;

  constructor(database: NodePgDatabase<Record<string, never>>) {
    this.db = database;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.resetToken, token))
      .limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [created] = await this.db
      .insert(users)
      .values({ ...insertUser, isAdmin: insertUser.isAdmin ?? false })
      .returning();
    return created;
  }

  async setResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await this.db
      .update(users)
      .set({ resetToken: token, resetTokenExpiresAt: expiresAt })
      .where(eq(users.id, userId));
  }

  async clearResetToken(userId: string): Promise<void> {
    await this.db
      .update(users)
      .set({ resetToken: null, resetTokenExpiresAt: null })
      .where(eq(users.id, userId));
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await this.db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
  }

  async getAdminUserCount(): Promise<number> {
    const [result] = await this.db
      .select({ value: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.isAdmin, true));

    return Number(result?.value ?? 0);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [created] = await this.db
      .insert(orders)
      .values({ ...order, items: [...order.items] as OrderLineItem[] })
      .returning();
    return created;
  }

  async getOrderByStripeSessionId(sessionId: string): Promise<Order | undefined> {
    const [order] = await this.db
      .select()
      .from(orders)
      .where(eq(orders.stripeSessionId, sessionId))
      .limit(1);
    return order;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const [order] = await this.db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);
    return order;
  }

  async getOrdersByEmail(email: string): Promise<Order[]> {
    return this.db
      .select()
      .from(orders)
      .where(eq(orders.email, email))
      .orderBy(desc(orders.createdAt));
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await this.db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();

    return updated;
  }

  async transitionOrderStatus(id: string, fromStatuses: string[], toStatus: string): Promise<Order | undefined> {
    if (fromStatuses.length === 0) {
      return undefined;
    }

    const [updated] = await this.db
      .update(orders)
      .set({ status: toStatus, updatedAt: new Date() })
      .where(and(eq(orders.id, id), inArray(orders.status, fromStatuses)))
      .returning();

    return updated;
  }

  async updateOrderFulfillment(
    id: string,
    fulfillmentStatus: string,
    trackingNumber?: string,
    trackingCarrier?: string,
    trackingUrl?: string,
  ): Promise<Order | undefined> {
    const existing = await this.getOrderById(id);
    if (!existing) {
      return undefined;
    }

    const now = new Date();
    const isShipped = fulfillmentStatus === "shipped";
    const isDelivered = fulfillmentStatus === "delivered";
    const shippedAt = isShipped || isDelivered ? existing.shippedAt ?? now : null;
    const deliveredAt = isDelivered ? existing.deliveredAt ?? now : null;

    const [updated] = await this.db
      .update(orders)
      .set({
        fulfillmentStatus,
        trackingNumber: trackingNumber || null,
        trackingCarrier: trackingCarrier || null,
        trackingUrl: trackingUrl || null,
        shippedAt,
        deliveredAt,
        updatedAt: now,
      })
      .where(eq(orders.id, id))
      .returning();

    return updated;
  }

  async updateOrderPaymentIntent(id: string, paymentIntentId: string): Promise<Order | undefined> {
    const [updated] = await this.db
      .update(orders)
      .set({
        stripePaymentIntentId: paymentIntentId,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    return updated;
  }

  async updateOrderSubscription(id: string, subscriptionId: string): Promise<Order | undefined> {
    const [updated] = await this.db
      .update(orders)
      .set({
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    return updated;
  }

  async getOrderBySubscriptionId(subscriptionId: string): Promise<Order | undefined> {
    const [order] = await this.db
      .select()
      .from(orders)
      .where(eq(orders.stripeSubscriptionId, subscriptionId))
      .limit(1);

    return order;
  }

  async getActiveSubscriptionOrders(): Promise<Order[]> {
    return this.db
      .select()
      .from(orders)
      .where(eq(orders.orderType, "subscription"))
      .orderBy(desc(orders.createdAt));
  }

  async listPublishedBlogPosts(): Promise<BlogPost[]> {
    const now = new Date();

    return this.db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.status, "published"),
          or(isNull(blogPosts.publishedAt), lte(blogPosts.publishedAt, now)),
        ),
      )
      .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));
  }

  async getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const now = new Date();
    const [post] = await this.db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.slug, slug),
          eq(blogPosts.status, "published"),
          or(isNull(blogPosts.publishedAt), lte(blogPosts.publishedAt, now)),
        ),
      )
      .limit(1);

    return post;
  }

  async listActiveProducts(): Promise<Product[]> {
    return this.db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(asc(products.sortOrder), asc(products.name));
  }

  async getProductsBySlugs(slugs: string[]): Promise<Product[]> {
    if (slugs.length === 0) {
      return [];
    }

    return this.db
      .select()
      .from(products)
      .where(and(eq(products.isActive, true), inArray(products.slug, slugs)));
  }

  async getActiveProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await this.db
      .select()
      .from(products)
      .where(and(eq(products.slug, slug), eq(products.isActive, true)))
      .limit(1);

    return product;
  }

  async decrementInventoryByItems(items: OrderLineItem[]): Promise<void> {
    const quantitiesBySlug = new Map<string, number>();
    for (const item of items) {
      const slug = item.slug.trim().toLowerCase();
      if (!slug) {
        continue;
      }
      const quantity = Number.isFinite(item.quantity) ? Math.max(0, Math.floor(item.quantity)) : 0;
      if (quantity <= 0) {
        continue;
      }
      quantitiesBySlug.set(slug, (quantitiesBySlug.get(slug) ?? 0) + quantity);
    }

    for (const [slug, quantity] of quantitiesBySlug.entries()) {
      const [updated] = await this.db
        .update(products)
        .set({
          stockQuantity: sql`GREATEST(${products.stockQuantity} - ${quantity}, 0)`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(products.slug, slug),
            eq(products.trackInventory, true),
            gte(products.stockQuantity, quantity),
          ),
        )
        .returning({ id: products.id });

      if (!updated) {
        continue;
      }
    }
  }

  async countProducts(): Promise<number> {
    const [result] = await this.db.select({ value: sql<number>`count(*)` }).from(products);
    return Number(result?.value ?? 0);
  }

  async createProductsSeed(productsToCreate: InsertProduct[]): Promise<void> {
    if (productsToCreate.length === 0) {
      return;
    }

    await this.db
      .insert(products)
      .values(productsToCreate)
      .onConflictDoNothing({ target: products.slug });
  }

  async getDiscountCodeByCode(code: string): Promise<DiscountCode | undefined> {
    const normalized = code.trim().toLowerCase();
    if (!normalized) {
      return undefined;
    }

    const [discount] = await this.db
      .select()
      .from(discountCodes)
      .where(sql`lower(${discountCodes.code}) = ${normalized}`)
      .limit(1);

    return discount;
  }

  async incrementDiscountCodeUses(id: string): Promise<boolean> {
    const updated = await this.db
      .update(discountCodes)
      .set({
        currentUses: sql`${discountCodes.currentUses} + 1`,
      })
      .where(
        and(
          eq(discountCodes.id, id),
          or(
            isNull(discountCodes.maxUses),
            sql`${discountCodes.currentUses} < ${discountCodes.maxUses}`,
          ),
        ),
      )
      .returning({ id: discountCodes.id });

    return updated.length > 0;
  }

  async listActiveFaqEntries(): Promise<FaqEntry[]> {
    return this.db
      .select()
      .from(faqEntries)
      .where(eq(faqEntries.isActive, true))
      .orderBy(asc(faqEntries.sortOrder), asc(faqEntries.question));
  }

  async validateDiscountCode(code: string): Promise<DiscountCode | undefined> {
    const normalized = code.trim().toLowerCase();
    if (!normalized) {
      return undefined;
    }

    const now = new Date();

    const [discount] = await this.db
      .select()
      .from(discountCodes)
      .where(
        and(
          sql`lower(${discountCodes.code}) = ${normalized}`,
          eq(discountCodes.isActive, true),
          or(isNull(discountCodes.expiresAt), gte(discountCodes.expiresAt, now)),
          or(
            isNull(discountCodes.maxUses),
            sql`${discountCodes.currentUses} < ${discountCodes.maxUses}`,
          ),
        ),
      )
      .limit(1);

    return discount;
  }

  async createEmailLog(emailLog: InsertEmailLog): Promise<void> {
    await this.db.insert(emailLogs).values(emailLog);
  }
}

export const storage: IStorage = db ? new DatabaseStorage(db) : new MemStorage();
