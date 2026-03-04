import { type User, type InsertUser, type Order, type InsertOrder, orders } from "@shared/schema";
import { randomUUID } from "crypto";
import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderByStripeSessionId(sessionId: string): Promise<Order | undefined>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrdersByEmail(email: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  updateOrderFulfillment(id: string, fulfillmentStatus: string, trackingNumber?: string, trackingCarrier?: string): Promise<Order | undefined>;
  updateOrderPaymentIntent(id: string, paymentIntentId: string): Promise<Order | undefined>;
  updateOrderSubscription(id: string, subscriptionId: string): Promise<Order | undefined>;
  getOrderBySubscriptionId(subscriptionId: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
}

export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  async getUser(id: string): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    return { ...insertUser, id };
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
}

export const storage: IStorage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();
