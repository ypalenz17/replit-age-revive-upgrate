import Stripe from "stripe";
import { getStripeSync, getUncachableStripeClient } from "./stripeClient";
import { storage } from "./storage";
import { sendOrderConfirmation, sendSubscriptionRenewalReminder } from "./email";
import type { OrderLineItem } from "@shared/schema";

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    const stripeSync = await getStripeSync();
    await stripeSync.processWebhook(payload, signature);

    const stripe = await getUncachableStripeClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret) {
      const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          await handleCheckoutCompleted(session, stripe);
          break;
        }
        case "invoice.paid": {
          const invoice = event.data.object as Stripe.Invoice;
          await handleInvoicePaid(invoice, stripe);
          break;
        }
        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionUpdated(subscription);
          break;
        }
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionDeleted(subscription);
          break;
        }
        case "invoice.upcoming": {
          const invoice = event.data.object as Stripe.Invoice;
          await handleInvoiceUpcoming(invoice);
          break;
        }
        default:
          break;
      }
    } else {
      console.warn("[webhook] STRIPE_WEBHOOK_SECRET not set, skipping custom order processing. Orders will be created on session retrieval instead.");
    }
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
    } else if (session.payment_status === "paid") {
      await handleCheckoutCompleted(session, stripe);
    }
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe): Promise<void> {
  const meta = session.metadata || {};
  const isSubscription = session.mode === "subscription";

  let lineItems: Stripe.LineItem[] = [];
  try {
    const expanded = await stripe.checkout.sessions.listLineItems(session.id);
    lineItems = expanded.data;
  } catch {}

  const items: OrderLineItem[] = lineItems.map((li) => ({
    slug: (li.price?.product as any)?.metadata?.slug || "",
    name: li.description || "",
    price: (li.amount_total || 0) / 100,
    quantity: li.quantity || 1,
    isSubscribe: (li.price?.product as any)?.metadata?.isSubscribe === "true",
    frequency: (li.price?.product as any)?.metadata?.frequency || "One-time",
  }));

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
    const newStatus = isSubscription ? "active" : "paid";
    await storage.updateOrderStatus(existing.id, newStatus);

    if (session.payment_intent) {
      await storage.updateOrderPaymentIntent(existing.id, session.payment_intent as string);
    }
    if (isSubscription && session.subscription) {
      await storage.updateOrderSubscription(existing.id, session.subscription as string);
    }

    const updatedOrder = await storage.getOrderById(existing.id);
    if (updatedOrder && (newStatus === "paid" || newStatus === "active")) {
      sendOrderConfirmation(updatedOrder).catch(err =>
        console.error("[email] Failed to send order confirmation:", err)
      );
    }
    return;
  }

  await storage.createOrder({
    stripeSessionId: session.id,
    stripePaymentIntentId: (session.payment_intent as string) || null,
    stripeSubscriptionId: isSubscription ? (session.subscription as string) || null : null,
    userId: null,
    email: session.customer_email || session.customer_details?.email || "",
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

  console.log(`[orders] ${isSubscription ? "Subscription" : "One-time"} order created for session ${session.id}, email: ${session.customer_email || session.customer_details?.email}`);

  const newOrder = await storage.getOrderByStripeSessionId(session.id);
  if (newOrder) {
    sendOrderConfirmation(newOrder).catch(err =>
      console.error("[email] Failed to send order confirmation:", err)
    );
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice, _stripe: Stripe): Promise<void> {
  const sub = (invoice as any).subscription;
  if (!sub) return;

  const subscriptionId = typeof sub === "string" ? sub : sub.id;
  const isFirstInvoice = invoice.billing_reason === "subscription_create";

  if (isFirstInvoice) {
    return;
  }

  const order = await storage.getOrderBySubscriptionId(subscriptionId);
  if (order) {
    await storage.updateOrderStatus(order.id, "active");
    console.log(`[orders] Renewal invoice paid for subscription ${subscriptionId}, order ${order.id} status set to active`);
  } else {
    console.warn(`[orders] Renewal invoice paid but no order found for subscription ${subscriptionId}`);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const subId = subscription.id;
  const status = subscription.status;

  const order = await storage.getOrderBySubscriptionId(subId);
  if (!order) {
    console.warn(`[orders] Subscription ${subId} updated but no order found`);
    return;
  }

  let orderStatus = order.status;
  if (status === "active") {
    orderStatus = "active";
  } else if (status === "past_due") {
    orderStatus = "past_due";
  } else if (status === "canceled") {
    orderStatus = "cancelled";
  } else if (status === "unpaid") {
    orderStatus = "unpaid";
  } else if (status === "paused") {
    orderStatus = "paused";
  }

  if (orderStatus !== order.status) {
    await storage.updateOrderStatus(order.id, orderStatus);
    console.log(`[orders] Subscription ${subId} status changed: ${order.status} -> ${orderStatus}`);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const subId = subscription.id;
  const order = await storage.getOrderBySubscriptionId(subId);
  if (order) {
    await storage.updateOrderStatus(order.id, "cancelled");
    console.log(`[orders] Subscription ${subId} cancelled, order ${order.id} status set to cancelled`);
  } else {
    console.warn(`[orders] Subscription ${subId} deleted but no order found`);
  }
}

async function handleInvoiceUpcoming(invoice: Stripe.Invoice): Promise<void> {
  const sub = (invoice as any).subscription;
  if (!sub) return;

  const subscriptionId = typeof sub === "string" ? sub : sub.id;
  const order = await storage.getOrderBySubscriptionId(subscriptionId);

  if (order && order.status === "active") {
    const daysUntilRenewal = invoice.due_date
      ? Math.max(1, Math.ceil((invoice.due_date * 1000 - Date.now()) / (1000 * 60 * 60 * 24)))
      : 3;

    sendSubscriptionRenewalReminder(order, daysUntilRenewal).catch(err =>
      console.error("[email] Failed to send subscription renewal reminder:", err)
    );
    console.log(`[orders] Renewal reminder sent for subscription ${subscriptionId}, order ${order.id}`);
  }
}
