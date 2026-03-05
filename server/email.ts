import { createRequire } from "module";
import { emailLogs, type Order, type OrderLineItem } from "@shared/schema";
import { db } from "./storage";

interface ResendSendResult {
  data?: { id?: string };
  error?: unknown;
}

interface ResendClient {
  emails: {
    send(payload: {
      from: string;
      to: string | string[];
      subject: string;
      html: string;
    }): Promise<ResendSendResult>;
  };
}

type ResendConstructor = new (apiKey: string) => ResendClient;

const require = createRequire(import.meta.url);
let resendClientCache: ResendClient | null | undefined;

const FROM_EMAIL = "AGE REVIVE <orders@agerevive.com>";
const BRAND_COLOR = "#1fb8ac";
const NAVY = "#131d2e";

type EmailType =
  | "order_confirmation"
  | "shipping_notification"
  | "password_reset"
  | "subscription_renewal";

interface EmailMeta {
  emailType: EmailType;
  orderId?: string | null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeText(value: unknown): string {
  return escapeHtml(String(value ?? ""));
}

function baseLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${safeText(title)}</title></head>
<body style="margin:0;padding:0;background-color:${NAVY};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${NAVY};">
<tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:24px 0;text-align:center;">
<span style="font-size:20px;font-weight:700;letter-spacing:0.15em;color:${BRAND_COLOR};text-transform:uppercase;">AGE REVIVE</span>
</td></tr>
<tr><td style="background-color:#1a2a3e;border-radius:12px;padding:40px 32px;">
${content}
</td></tr>
<tr><td style="padding:24px 0;text-align:center;">
<p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;">
AGE REVIVE | Cellular Health Supplements<br>
Questions? Contact support@agerevive.com
</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function itemsTable(items: OrderLineItem[]): string {
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#fff;font-size:14px;">
        ${safeText(item.name)}${item.isSubscribe ? ` <span style="color:${BRAND_COLOR};font-size:11px;">(${safeText(item.frequency)})</span>` : ""}
        ${item.quantity > 1 ? ` x${item.quantity}` : ""}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#fff;font-size:14px;text-align:right;">
        $${item.price.toFixed(2)}
      </td>
    </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
}

function getResendClient(): ResendClient | null {
  if (resendClientCache !== undefined) {
    return resendClientCache;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    resendClientCache = null;
    return resendClientCache;
  }

  try {
    const resendModule = require("resend") as { Resend?: unknown };
    const Resend = resendModule.Resend as ResendConstructor | undefined;
    if (typeof Resend !== "function") {
      resendClientCache = null;
      return resendClientCache;
    }

    resendClientCache = new Resend(apiKey);
    return resendClientCache;
  } catch {
    resendClientCache = null;
    return resendClientCache;
  }
}

export async function sendOrderConfirmation(order: Order): Promise<boolean> {
  const items = order.items as OrderLineItem[];
  const isSubscription = order.orderType === "subscription";

  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#fff;">
      ${isSubscription ? "Subscription Confirmed" : "Order Confirmed"}
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.6);">
      Thank you for your ${isSubscription ? "subscription" : "order"}. We are preparing your shipment now.
    </p>

    <div style="background-color:rgba(255,255,255,0.04);border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND_COLOR};">Order ID</p>
      <p style="margin:0;font-size:14px;color:#fff;font-family:monospace;">${safeText(order.id)}</p>
    </div>

    ${itemsTable(items)}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr>
        <td style="padding:12px 0;font-size:16px;font-weight:700;color:#fff;">Total</td>
        <td style="padding:12px 0;font-size:16px;font-weight:700;color:${BRAND_COLOR};text-align:right;">${formatCurrency(order.totalAmount)}</td>
      </tr>
    </table>

    <div style="background-color:rgba(255,255,255,0.04);border-radius:8px;padding:20px;margin-top:24px;">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND_COLOR};">Shipping To</p>
      <p style="margin:0;font-size:14px;color:#fff;line-height:1.6;">
        ${safeText(order.shippingFirstName)} ${safeText(order.shippingLastName)}<br>
        ${safeText(order.shippingAddress)}${order.shippingApt ? `, ${safeText(order.shippingApt)}` : ""}<br>
        ${safeText(order.shippingCity)}, ${safeText(order.shippingState)} ${safeText(order.shippingZip)}
      </p>
    </div>

    ${
      isSubscription
        ? `
    <div style="margin-top:24px;padding:16px 20px;border-left:3px solid ${BRAND_COLOR};background-color:rgba(31,184,172,0.06);border-radius:0 8px 8px 0;">
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7);">
        Your subscription will renew automatically. You can manage or cancel your subscription anytime from your account page.
      </p>
    </div>`
        : ""
    }
  `;

  return sendEmail(
    order.email,
    isSubscription ? "Your AGE REVIVE Subscription is Confirmed" : "Your AGE REVIVE Order is Confirmed",
    baseLayout("Order Confirmation", content),
    {
      emailType: "order_confirmation",
      orderId: order.id,
    },
  );
}

export async function sendShippingNotification(order: Order): Promise<boolean> {
  const trackingUrl =
    order.trackingCarrier && order.trackingNumber
      ? getTrackingUrl(order.trackingCarrier, order.trackingNumber)
      : null;

  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#fff;">Your Order Has Shipped</h1>
    <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.6);">
      Great news -- your order is on its way.
    </p>

    <div style="background-color:rgba(255,255,255,0.04);border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND_COLOR};">Order ID</p>
      <p style="margin:0 0 16px;font-size:14px;color:#fff;font-family:monospace;">${safeText(order.id)}</p>

      ${
        order.trackingCarrier
          ? `
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND_COLOR};">Carrier</p>
      <p style="margin:0 0 16px;font-size:14px;color:#fff;">${safeText(order.trackingCarrier)}</p>`
          : ""
      }

      ${
        order.trackingNumber
          ? `
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND_COLOR};">Tracking Number</p>
      <p style="margin:0;font-size:14px;color:#fff;font-family:monospace;">${safeText(order.trackingNumber)}</p>`
          : ""
      }
    </div>

    ${
      trackingUrl
        ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td align="center">
        <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 32px;background-color:${BRAND_COLOR};color:${NAVY};font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;text-transform:uppercase;letter-spacing:0.05em;">
          Track Your Package
        </a>
      </td></tr>
    </table>`
        : ""
    }

    <div style="background-color:rgba(255,255,255,0.04);border-radius:8px;padding:20px;">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND_COLOR};">Shipping To</p>
      <p style="margin:0;font-size:14px;color:#fff;line-height:1.6;">
        ${safeText(order.shippingFirstName)} ${safeText(order.shippingLastName)}<br>
        ${safeText(order.shippingAddress)}${order.shippingApt ? `, ${safeText(order.shippingApt)}` : ""}<br>
        ${safeText(order.shippingCity)}, ${safeText(order.shippingState)} ${safeText(order.shippingZip)}
      </p>
    </div>
  `;

  return sendEmail(order.email, "Your AGE REVIVE Order Has Shipped", baseLayout("Shipping Notification", content), {
    emailType: "shipping_notification",
    orderId: order.id,
  });
}

function normalizeBaseUrl(baseUrl: string): string {
  try {
    const parsed = new URL(baseUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return "https://agerevive.com";
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  baseUrl: string,
): Promise<boolean> {
  const resetUrl = `${normalizeBaseUrl(baseUrl)}/reset-password?token=${encodeURIComponent(resetToken)}`;

  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#fff;">Reset Your Password</h1>
    <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.6);">
      We received a request to reset your password. Click the button below to choose a new one.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td align="center">
        <a href="${resetUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 32px;background-color:${BRAND_COLOR};color:${NAVY};font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;text-transform:uppercase;letter-spacing:0.05em;">
          Reset Password
        </a>
      </td></tr>
    </table>

    <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.5);">
      This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.
    </p>

    <div style="margin-top:24px;padding:16px 20px;background-color:rgba(255,255,255,0.04);border-radius:8px;">
      <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);word-break:break-all;">
        If the button does not work, copy and paste this URL into your browser:<br>
        <span style="color:${BRAND_COLOR};">${safeText(resetUrl)}</span>
      </p>
    </div>
  `;

  return sendEmail(email, "Reset Your AGE REVIVE Password", baseLayout("Password Reset", content), {
    emailType: "password_reset",
    orderId: null,
  });
}

export async function sendSubscriptionRenewalReminder(
  order: Order,
  daysUntilRenewal: number,
): Promise<boolean> {
  const items = order.items as OrderLineItem[];

  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#fff;">Subscription Renewal Reminder</h1>
    <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.6);">
      Your subscription will renew in ${daysUntilRenewal} day${daysUntilRenewal !== 1 ? "s" : ""}.
    </p>

    ${itemsTable(items)}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr>
        <td style="padding:12px 0;font-size:16px;font-weight:700;color:#fff;">Renewal Amount</td>
        <td style="padding:12px 0;font-size:16px;font-weight:700;color:${BRAND_COLOR};text-align:right;">${formatCurrency(order.totalAmount)}</td>
      </tr>
    </table>

    <p style="margin:24px 0 0;font-size:13px;color:rgba(255,255,255,0.5);">
      No action is needed -- your subscription will renew automatically. If you would like to make changes or cancel, please visit your account page or contact support@agerevive.com.
    </p>
  `;

  return sendEmail(
    order.email,
    "Your AGE REVIVE Subscription Renews Soon",
    baseLayout("Subscription Renewal", content),
    {
      emailType: "subscription_renewal",
      orderId: order.id,
    },
  );
}

function getTrackingUrl(carrier: string, trackingNumber: string): string | null {
  const c = carrier.toLowerCase();
  const encodedTracking = encodeURIComponent(trackingNumber);
  if (c.includes("usps")) return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodedTracking}`;
  if (c.includes("ups")) return `https://www.ups.com/track?tracknum=${encodedTracking}`;
  if (c.includes("fedex")) return `https://www.fedex.com/fedextrack/?trknbr=${encodedTracking}`;
  if (c.includes("dhl")) return `https://www.dhl.com/us-en/home/tracking.html?tracking-id=${encodedTracking}`;
  return null;
}

function normalizeRecipient(to: string): string {
  return to.trim();
}

function normalizeUnknownError(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

async function logEmailAttempt(params: {
  recipientEmail: string;
  emailType: EmailType;
  subject: string;
  orderId: string | null;
  status: string;
  resendMessageId?: string | null;
  error?: string | null;
}): Promise<void> {
  if (!db) {
    return;
  }

  try {
    await db.insert(emailLogs).values({
      recipientEmail: params.recipientEmail,
      emailType: params.emailType,
      subject: params.subject,
      orderId: params.orderId,
      status: params.status,
      resendMessageId: params.resendMessageId ?? null,
      error: params.error ?? null,
    });
  } catch (error) {
    console.warn("[email] Failed to log email attempt:", error);
  }
}

async function sendEmail(to: string, subject: string, html: string, meta: EmailMeta): Promise<boolean> {
  const recipient = normalizeRecipient(to);
  if (!recipient || !subject.trim()) {
    return false;
  }

  const resend = getResendClient();
  if (!resend) {
    console.warn("[email] Resend client unavailable, skipping email send");
    await logEmailAttempt({
      recipientEmail: recipient,
      emailType: meta.emailType,
      subject,
      orderId: meta.orderId ?? null,
      status: "failed",
      error: "resend_client_unavailable",
    });
    return false;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipient,
      subject,
      html,
    });

    if (error) {
      console.error("[email] Send failed:", error);
      await logEmailAttempt({
        recipientEmail: recipient,
        emailType: meta.emailType,
        subject,
        orderId: meta.orderId ?? null,
        status: "failed",
        error: normalizeUnknownError(error),
      });
      return false;
    }

    console.log(`[email] Sent "${subject}" to ${recipient} (id: ${data?.id ?? "n/a"})`);
    await logEmailAttempt({
      recipientEmail: recipient,
      emailType: meta.emailType,
      subject,
      orderId: meta.orderId ?? null,
      status: "sent",
      resendMessageId: data?.id ?? null,
    });
    return true;
  } catch (err) {
    console.error("[email] Send error:", err);
    await logEmailAttempt({
      recipientEmail: recipient,
      emailType: meta.emailType,
      subject,
      orderId: meta.orderId ?? null,
      status: "failed",
      error: normalizeUnknownError(err),
    });
    return false;
  }
}
