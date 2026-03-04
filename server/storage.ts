import { type User, type InsertUser, type Order, type InsertOrder, users, orders } from "@shared/schema";
import { randomUUID } from "crypto";
import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
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
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderByStripeSessionId(sessionId: string): Promise<Order | undefined>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrdersByEmail(email: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  updateOrderFulfillment(id: string, fulfillmentStatus: string, trackingNumber?: string, trackingCarrier?: string): Promise<Order | undefined>;
  updateOrderPaymentIntent(id: string, paymentIntentId: string): Promise<Order | undefined>;
  updateOrderSubscription(id: string, subscriptionId: string): Promise<Order | undefined>;
  getOrderBySubscriptionId(subscriptionId: string): Promise<Order | undefined>;
  getActiveSubscriptionOrders(): Promise<Order[]>;
}

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
    const user: User = { ...insertUser, id, resetToken: null, resetTokenExpiresAt: null, createdAt: new Date() };
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
  async updateOrderStatus(_id: string, _status: string): Promise<Order | undefined> {
    throw new Error("Database required for order operations");
  }
  async updateOrderFulfillment(_id: string, _fulfillmentStatus: string, _trackingNumber?: string, _trackingCarrier?: string): Promise<Order | undefined> {
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
}

export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.resetToken, token)).limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [created] = await this.db.insert(users).values(insertUser).returning();
    return created;
  }

  async setResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await this.db.update(users).set({ resetToken: token, resetTokenExpiresAt: expiresAt }).where(eq(users.id, userId));
  }

  async clearResetToken(userId: string): Promise<void> {
    await this.db.update(users).set({ resetToken: null, resetTokenExpiresAt: null }).where(eq(users.id, userId));
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await this.db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [created] = await this.db.insert(orders).values(order).returning();
    return created;
  }

  async getOrderByStripeSessionId(sessionId: string): Promise<Order | undefined> {
    const [order] = await this.db.select().from(orders).where(eq(orders.stripeSessionId, sessionId)).limit(1);
    return order;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const [order] = await this.db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return order;
  }

  async getOrdersByEmail(email: string): Promise<Order[]> {
    return this.db.select().from(orders).where(eq(orders.email, email)).orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await this.db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    return updated;
  }

  async updateOrderFulfillment(id: string, fulfillmentStatus: string, trackingNumber?: string, trackingCarrier?: string): Promise<Order | undefined> {
    const [updated] = await this.db.update(orders).set({
      fulfillmentStatus,
      trackingNumber: trackingNumber || null,
      trackingCarrier: trackingCarrier || null,
      updatedAt: new Date(),
    }).where(eq(orders.id, id)).returning();
    return updated;
  }

  async updateOrderPaymentIntent(id: string, paymentIntentId: string): Promise<Order | undefined> {
    const [updated] = await this.db.update(orders).set({
      stripePaymentIntentId: paymentIntentId,
      updatedAt: new Date(),
    }).where(eq(orders.id, id)).returning();
    return updated;
  }

  async updateOrderSubscription(id: string, subscriptionId: string): Promise<Order | undefined> {
    const [updated] = await this.db.update(orders).set({
      stripeSubscriptionId: subscriptionId,
      updatedAt: new Date(),
    }).where(eq(orders.id, id)).returning();
    return updated;
  }

  async getOrderBySubscriptionId(subscriptionId: string): Promise<Order | undefined> {
    const [order] = await this.db.select().from(orders).where(eq(orders.stripeSubscriptionId, subscriptionId)).limit(1);
    return order;
  }

  async getActiveSubscriptionOrders(): Promise<Order[]> {
    return this.db.select().from(orders)
      .where(eq(orders.orderType, "subscription"))
      .orderBy(desc(orders.createdAt));
  }
}

export const storage: IStorage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();
