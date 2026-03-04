import Stripe from "stripe";
import { getStripeSync, getUncachableStripeClient } from "./stripeClient";
import { storage } from "./storage";
import type { OrderLineItem } from "@shared/schema";

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    const stripeSync = await getStripeSync();
    await stripeSync.processWebhook({ payload, signature });

    const stripe = await getUncachableStripeClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret) {
      const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, stripe);
      }
    } else {
      console.warn("[webhook] STRIPE_WEBHOOK_SECRET not set, skipping custom order processing. Orders will be created on session retrieval instead.");
    }
  }

  static async handleCheckoutSessionDirect(sessionId: string): Promise<void> {
    const stripe = await getUncachableStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
    if (session.payment_status === "paid") {
      await handleCheckoutCompleted(session, stripe);
    }
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe): Promise<void> {
  const meta = session.metadata || {};

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
      isSubscribe: false,
      frequency: "One-time",
    });
  }

  const existing = await storage.getOrderByStripeSessionId(session.id);
  if (existing) {
    await storage.updateOrderStatus(existing.id, "paid");
    if (session.payment_intent) {
      await storage.updateOrderPaymentIntent(existing.id, session.payment_intent as string);
    }
    return;
  }

  await storage.createOrder({
    stripeSessionId: session.id,
    stripePaymentIntentId: (session.payment_intent as string) || null,
    email: session.customer_email || session.customer_details?.email || "",
    status: "paid",
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

  console.log(`[orders] Order created for session ${session.id}, email: ${session.customer_email || session.customer_details?.email}`);
}
