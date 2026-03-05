import {
  getStripeSync,
  getUncachableStripeClient,
  type StripeCheckoutSession,
  type StripeClient,
  type StripeInvoice,
  type StripeLineItem,
  type StripePriceProductObject,
  type StripeSubscription,
  type StripeWebhookEvent,
} from "./stripeClient";
import { storage } from "./storage";
import { sendOrderConfirmation, sendSubscriptionRenewalReminder } from "./email";
import { pushOrderToShipStation } from "./shipstation";
import type { Order, OrderLineItem, OrderStatus } from "@shared/schema";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asCheckoutSession(value: unknown): StripeCheckoutSession | null {
  if (!isObject(value) || typeof value.id !== "string") {
    return null;
  }

  return value as unknown as StripeCheckoutSession;
}

function asInvoice(value: unknown): StripeInvoice | null {
  if (!isObject(value)) {
    return null;
  }

  return value as StripeInvoice;
}

function asSubscription(value: unknown): StripeSubscription | null {
  if (!isObject(value) || typeof value.id !== "string") {
    return null;
  }

  return value as unknown as StripeSubscription;
}

function extractStripeId(value: string | { id: string } | null | undefined): string | null {
  if (!value) {
    return null;
  }
  if (typeof value === "string") {
    return value;
  }
  return value.id;
}

function extractProductMetadata(lineItem: StripeLineItem): Record<string, string> {
  const product = lineItem.price?.product;
  if (!isObject(product)) {
    return {};
  }

  const metadata = (product as StripePriceProductObject).metadata;
  if (!metadata || !isObject(metadata)) {
    return {};
  }

  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === "string") {
      result[key] = value;
    }
  }
  return result;
}

function extractSubscriptionId(invoice: StripeInvoice): string | null {
  return extractStripeId(invoice.subscription);
}

function isUniqueConstraintError(error: unknown): boolean {
  if (!isObject(error)) {
    return false;
  }
  return error.code === "23505";
}

function toOrderStatus(value: string): OrderStatus {
  switch (value) {
    case "pending":
    case "paid":
    case "active":
    case "past_due":
    case "cancelled":
    case "unpaid":
    case "paused":
    case "refunded":
      return value;
    default:
      return "pending";
  }
}

function extractDiscountCodeId(metadata: Record<string, string> | null | undefined): string | null {
  if (!metadata) {
    return null;
  }

  const candidate = metadata.discount_code_id;
  if (!candidate) {
    return null;
  }

  const trimmed = candidate.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function runPostPaymentActions(order: Order, items: OrderLineItem[], discountCodeId: string | null): Promise<void> {
  try {
    await storage.decrementInventoryByItems(items);
  } catch (error) {
    console.error(`[inventory] Failed to decrement stock for order ${order.id}:`, error);
  }

  if (discountCodeId) {
    try {
      const incremented = await storage.incrementDiscountCodeUses(discountCodeId);
      if (!incremented) {
        console.warn(
          `[discount] Discount code usage not incremented for order ${order.id} (max uses reached or code missing).`,
        );
      }
    } catch (error) {
      console.error(`[discount] Failed to increment code usage for order ${order.id}:`, error);
    }
  }

  if (order.status === "paid") {
    await pushOrderToShipStation(order);
  }
}

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    try {
      const stripeSync = await getStripeSync();
      await stripeSync.processWebhook(payload, signature);
    } catch (err) {
      console.warn("[webhook] Stripe sync processing skipped:", err);
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn(
        "[webhook] STRIPE_WEBHOOK_SECRET not set, skipping custom order processing. Orders will be created on session retrieval instead.",
      );
      return;
    }

    const stripe = await getUncachableStripeClient();
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    await WebhookHandlers.handleEvent(event, stripe);
  }

  static async handleCheckoutSessionDirect(sessionId: string): Promise<void> {
    const stripe = await getUncachableStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "subscription"],
    });

    if (session.mode === "subscription") {
      if (session.subscription) {
        await handleCheckoutCompleted(session, stripe);
      }
      return;
    }

    if (session.payment_status === "paid") {
      await handleCheckoutCompleted(session, stripe);
    }
  }

  private static async handleEvent(event: StripeWebhookEvent, stripe: StripeClient): Promise<void> {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = asCheckoutSession(event.data.object);
        if (!session) {
          console.warn(`[webhook] Invalid ${event.type} payload`);
          return;
        }
        await handleCheckoutCompleted(session, stripe);
        return;
      }
      case "checkout.session.async_payment_failed": {
        const session = asCheckoutSession(event.data.object);
        if (!session) {
          console.warn("[webhook] Invalid checkout.session.async_payment_failed payload");
          return;
        }
        const existing = await storage.getOrderByStripeSessionId(session.id);
        if (existing && existing.status !== "unpaid") {
          await storage.updateOrderStatus(existing.id, "unpaid");
        }
        return;
      }
      case "invoice.paid": {
        const invoice = asInvoice(event.data.object);
        if (!invoice) {
          console.warn("[webhook] Invalid invoice.paid payload");
          return;
        }
        await handleInvoicePaid(invoice);
        return;
      }
      case "invoice.payment_failed": {
        const invoice = asInvoice(event.data.object);
        if (!invoice) {
          console.warn("[webhook] Invalid invoice.payment_failed payload");
          return;
        }
        await handleInvoicePaymentFailed(invoice);
        return;
      }
      case "customer.subscription.updated": {
        const subscription = asSubscription(event.data.object);
        if (!subscription) {
          console.warn("[webhook] Invalid customer.subscription.updated payload");
          return;
        }
        await handleSubscriptionUpdated(subscription);
        return;
      }
      case "customer.subscription.deleted": {
        const subscription = asSubscription(event.data.object);
        if (!subscription) {
          console.warn("[webhook] Invalid customer.subscription.deleted payload");
          return;
        }
        await handleSubscriptionDeleted(subscription);
        return;
      }
      case "invoice.upcoming": {
        const invoice = asInvoice(event.data.object);
        if (!invoice) {
          console.warn("[webhook] Invalid invoice.upcoming payload");
          return;
        }
        await handleInvoiceUpcoming(invoice);
        return;
      }
      default:
        return;
    }
  }
}

async function handleCheckoutCompleted(session: StripeCheckoutSession, stripe: StripeClient): Promise<void> {
  const meta = session.metadata || {};
  const isSubscription = session.mode === "subscription";
  const discountCodeId = extractDiscountCodeId(meta);

  let lineItems: StripeLineItem[] = [];
  try {
    const expanded = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });
    lineItems = expanded.data;
  } catch (err) {
    console.warn("[webhook] Failed to list line items:", err);
  }

  const items: OrderLineItem[] = lineItems.map((lineItem) => {
    const metadata = extractProductMetadata(lineItem);
    return {
      slug: metadata.slug || "",
      name: lineItem.description || "",
      price: (lineItem.amount_total || 0) / 100,
      quantity: lineItem.quantity || 1,
      isSubscribe: metadata.isSubscribe === "true",
      frequency: metadata.frequency || "One-time",
    };
  });

  if (items.length === 0) {
    items.push({
      slug: "unknown",
      name: "Order item",
      price: (session.amount_total || 0) / 100,
      quantity: 1,
      isSubscribe: isSubscription,
      frequency: isSubscription ? "Delivered monthly" : "One-time",
    });
  }

  const existing = await storage.getOrderByStripeSessionId(session.id);
  if (existing) {
    const newStatus: OrderStatus = isSubscription ? "active" : "paid";
    const shouldTransitionFromPendingState = existing.status === "pending" || existing.status === "unpaid";

    let transitionedOrder: Order | undefined;
    if (shouldTransitionFromPendingState) {
      transitionedOrder = await storage.transitionOrderStatus(existing.id, ["pending", "unpaid"], newStatus);
    } else if (existing.status !== newStatus) {
      await storage.updateOrderStatus(existing.id, newStatus);
    }

    const paymentIntentId = extractStripeId(session.payment_intent);
    if (paymentIntentId && existing.stripePaymentIntentId !== paymentIntentId) {
      await storage.updateOrderPaymentIntent(existing.id, paymentIntentId);
    }

    const subscriptionId = isSubscription ? extractStripeId(session.subscription) : null;
    if (subscriptionId && existing.stripeSubscriptionId !== subscriptionId) {
      await storage.updateOrderSubscription(existing.id, subscriptionId);
    }

    if (transitionedOrder && (transitionedOrder.status === "paid" || transitionedOrder.status === "active")) {
      sendOrderConfirmation(transitionedOrder).catch((err) =>
          console.error("[email] Failed to send order confirmation:", err),
      );
      await runPostPaymentActions(transitionedOrder, items, discountCodeId);
    }
    return;
  }

  const paymentIntentId = extractStripeId(session.payment_intent);
  const subscriptionId = isSubscription ? extractStripeId(session.subscription) : null;
  const email = session.customer_email || session.customer_details?.email || "";
  let createdOrder = false;

  try {
    await storage.createOrder({
      stripeSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      stripeSubscriptionId: subscriptionId,
      userId: null,
      email,
      status: isSubscription ? "active" : "paid",
      orderType: isSubscription ? "subscription" : "one_time",
      totalAmount: session.amount_total || 0,
      currency: session.currency || "usd",
      shippingFirstName: meta.shipping_first_name || "",
      shippingLastName: meta.shipping_last_name || "",
      shippingAddress: meta.shipping_address || "",
      shippingApt: meta.shipping_apt || null,
      shippingCity: meta.shipping_city || "",
      shippingState: meta.shipping_state || "",
      shippingZip: meta.shipping_zip || "",
      shippingCountry: meta.shipping_country || "US",
      items,
      fulfillmentStatus: "unfulfilled",
      trackingNumber: null,
      trackingCarrier: null,
      notes: null,
    });
    createdOrder = true;
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }
    console.warn(`[orders] Duplicate order create ignored for session ${session.id}`);
  }

  console.log(
    `[orders] ${isSubscription ? "Subscription" : "One-time"} order processed for session ${session.id}, email: ${email}`,
  );

  if (!createdOrder) {
    return;
  }

  const newOrder = await storage.getOrderByStripeSessionId(session.id);
  if (newOrder && (newOrder.status === "paid" || newOrder.status === "active")) {
    sendOrderConfirmation(newOrder).catch((err) =>
      console.error("[email] Failed to send order confirmation:", err),
    );
    await runPostPaymentActions(newOrder, items, discountCodeId);
  }
}

async function handleInvoicePaid(invoice: StripeInvoice): Promise<void> {
  const subscriptionId = extractSubscriptionId(invoice);
  if (!subscriptionId) {
    return;
  }

  const isFirstInvoice = invoice.billing_reason === "subscription_create";
  if (isFirstInvoice) {
    return;
  }

  const order = await storage.getOrderBySubscriptionId(subscriptionId);
  if (!order) {
    console.warn(`[orders] Renewal invoice paid but no order found for subscription ${subscriptionId}`);
    return;
  }

  if (order.status !== "active") {
    await storage.updateOrderStatus(order.id, "active");
  }
}

async function handleInvoicePaymentFailed(invoice: StripeInvoice): Promise<void> {
  const subscriptionId = extractSubscriptionId(invoice);
  if (!subscriptionId) {
    return;
  }

  const order = await storage.getOrderBySubscriptionId(subscriptionId);
  if (!order) {
    console.warn(`[orders] invoice.payment_failed but no order found for subscription ${subscriptionId}`);
    return;
  }

  if (order.status !== "past_due") {
    await storage.updateOrderStatus(order.id, "past_due");
  }
}

function mapSubscriptionStatusToOrderStatus(status: string, currentStatus: string): OrderStatus {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
      return "cancelled";
    case "unpaid":
    case "incomplete_expired":
      return "unpaid";
    case "paused":
      return "paused";
    default:
      return toOrderStatus(currentStatus);
  }
}

async function handleSubscriptionUpdated(subscription: StripeSubscription): Promise<void> {
  const order = await storage.getOrderBySubscriptionId(subscription.id);
  if (!order) {
    console.warn(`[orders] Subscription ${subscription.id} updated but no order found`);
    return;
  }

  const nextStatus = mapSubscriptionStatusToOrderStatus(subscription.status, order.status);
  if (nextStatus !== order.status) {
    await storage.updateOrderStatus(order.id, nextStatus);
    console.log(`[orders] Subscription ${subscription.id} status changed: ${order.status} -> ${nextStatus}`);
  }
}

async function handleSubscriptionDeleted(subscription: StripeSubscription): Promise<void> {
  const order = await storage.getOrderBySubscriptionId(subscription.id);
  if (!order) {
    console.warn(`[orders] Subscription ${subscription.id} deleted but no order found`);
    return;
  }

  if (order.status !== "cancelled") {
    await storage.updateOrderStatus(order.id, "cancelled");
  }
}

async function handleInvoiceUpcoming(invoice: StripeInvoice): Promise<void> {
  const subscriptionId = extractSubscriptionId(invoice);
  if (!subscriptionId) {
    return;
  }

  const order = await storage.getOrderBySubscriptionId(subscriptionId);
  if (!order || order.status !== "active") {
    return;
  }

  const dueDateUnix = invoice.due_date;
  const daysUntilRenewal =
    typeof dueDateUnix === "number"
      ? Math.max(1, Math.ceil((dueDateUnix * 1000 - Date.now()) / (1000 * 60 * 60 * 24)))
      : 3;

  sendSubscriptionRenewalReminder(order, daysUntilRenewal).catch((err) =>
    console.error("[email] Failed to send subscription renewal reminder:", err),
  );
  console.log(`[orders] Renewal reminder sent for subscription ${subscriptionId}, order ${order.id}`);
}
