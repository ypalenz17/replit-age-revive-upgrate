import { Resend } from "resend";
import type { Order, OrderLineItem } from "@shared/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "AGE REVIVE <onboarding@resend.dev>";
const BRAND_COLOR = "#1fb8ac";
const NAVY = "#131d2e";
const PAPER = "#f5f1eb";

function baseLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title}</title></head>
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
  let rows = items.map(item => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#fff;font-size:14px;">
        ${item.name}${item.isSubscribe ? ` <span style="color:${BRAND_COLOR};font-size:11px;">(${item.frequency})</span>` : ""}
        ${item.quantity > 1 ? ` x${item.quantity}` : ""}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#fff;font-size:14px;text-align:right;">
        $${item.price.toFixed(2)}
      </td>
    </tr>`).join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
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
      <p style="margin:0;font-size:14px;color:#fff;font-family:monospace;">${order.id}</p>
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
        ${order.shippingFirstName} ${order.shippingLastName}<br>
        ${order.shippingAddress}${order.shippingApt ? `, ${order.shippingApt}` : ""}<br>
        ${order.shippingCity}, ${order.shippingState} ${order.shippingZip}
      </p>
    </div>

    ${isSubscription ? `
    <div style="margin-top:24px;padding:16px 20px;border-left:3px solid ${BRAND_COLOR};background-color:rgba(31,184,172,0.06);border-radius:0 8px 8px 0;">
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7);">
        Your subscription will renew automatically. You can manage or cancel your subscription anytime from your account page.
      </p>
    </div>` : ""}
  `;

  return sendEmail(order.email, isSubscription ? "Your AGE REVIVE Subscription is Confirmed" : "Your AGE REVIVE Order is Confirmed", baseLayout("Order Confirmation", content));
}

export async function sendShippingNotification(order: Order): Promise<boolean> {
  const trackingUrl = order.trackingCarrier && order.trackingNumber
    ? getTrackingUrl(order.trackingCarrier, order.trackingNumber)
    : null;

  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#fff;">Your Order Has Shipped</h1>
    <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.6);">
      Great news -- your order is on its way.
    </p>

    <div style="background-color:rgba(255,255,255,0.04);border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND_COLOR};">Order ID</p>
      <p style="margin:0 0 16px;font-size:14px;color:#fff;font-family:monospace;">${order.id}</p>

      ${order.trackingCarrier ? `
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND_COLOR};">Carrier</p>
      <p style="margin:0 0 16px;font-size:14px;color:#fff;">${order.trackingCarrier}</p>` : ""}

      ${order.trackingNumber ? `
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND_COLOR};">Tracking Number</p>
      <p style="margin:0;font-size:14px;color:#fff;font-family:monospace;">${order.trackingNumber}</p>` : ""}
    </div>

    ${trackingUrl ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td align="center">
        <a href="${trackingUrl}" target="_blank" style="display:inline-block;padding:14px 32px;background-color:${BRAND_COLOR};color:${NAVY};font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;text-transform:uppercase;letter-spacing:0.05em;">
          Track Your Package
        </a>
      </td></tr>
    </table>` : ""}

    <div style="background-color:rgba(255,255,255,0.04);border-radius:8px;padding:20px;">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND_COLOR};">Shipping To</p>
      <p style="margin:0;font-size:14px;color:#fff;line-height:1.6;">
        ${order.shippingFirstName} ${order.shippingLastName}<br>
        ${order.shippingAddress}${order.shippingApt ? `, ${order.shippingApt}` : ""}<br>
        ${order.shippingCity}, ${order.shippingState} ${order.shippingZip}
      </p>
    </div>
  `;

  return sendEmail(order.email, "Your AGE REVIVE Order Has Shipped", baseLayout("Shipping Notification", content));
}

export async function sendPasswordResetEmail(email: string, resetToken: string, baseUrl: string): Promise<boolean> {
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#fff;">Reset Your Password</h1>
    <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.6);">
      We received a request to reset your password. Click the button below to choose a new one.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td align="center">
        <a href="${resetUrl}" target="_blank" style="display:inline-block;padding:14px 32px;background-color:${BRAND_COLOR};color:${NAVY};font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;text-transform:uppercase;letter-spacing:0.05em;">
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
        <span style="color:${BRAND_COLOR};">${resetUrl}</span>
      </p>
    </div>
  `;

  return sendEmail(email, "Reset Your AGE REVIVE Password", baseLayout("Password Reset", content));
}

export async function sendSubscriptionRenewalReminder(order: Order, daysUntilRenewal: number): Promise<boolean> {
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

  return sendEmail(order.email, "Your AGE REVIVE Subscription Renews Soon", baseLayout("Subscription Renewal", content));
}

function getTrackingUrl(carrier: string, trackingNumber: string): string | null {
  const c = carrier.toLowerCase();
  if (c.includes("usps")) return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
  if (c.includes("ups")) return `https://www.ups.com/track?tracknum=${trackingNumber}`;
  if (c.includes("fedex")) return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
  if (c.includes("dhl")) return `https://www.dhl.com/us-en/home/tracking.html?tracking-id=${trackingNumber}`;
  return null;
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set, skipping email send");
    return false;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[email] Send failed:", error);
      return false;
    }

    console.log(`[email] Sent "${subject}" to ${to} (id: ${data?.id})`);
    return true;
  } catch (err) {
    console.error("[email] Send error:", err);
    return false;
  }
}
