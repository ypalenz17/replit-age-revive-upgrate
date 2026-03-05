import type { Order, OrderLineItem } from "@shared/schema";
import { createHmac, timingSafeEqual } from "crypto";

const SHIPSTATION_API_BASE = "https://api.shipstation.com/v2";

interface ShipStationApiError {
  message?: string;
  errors?: Array<{ message?: string }>;
}

interface ShipStationListShipmentsResponse {
  shipments?: Array<Record<string, unknown>>;
}

export interface ShipStationShipmentStatus {
  found: boolean;
  status: string;
  trackingNumber: string | null;
  trackingCarrier: string | null;
  trackingUrl: string | null;
  raw: Record<string, unknown> | null;
}

export interface ShipStationTrackingUpdate {
  orderNumber: string;
  fulfillmentStatus: "unfulfilled" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber: string | null;
  trackingCarrier: string | null;
  trackingUrl: string | null;
}

function getShipStationApiKey(): string | null {
  const apiKey = process.env.SHIPSTATION_API_KEY?.trim();
  return apiKey && apiKey.length > 0 ? apiKey : null;
}

function getHeaders(apiKey: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "API-Key": apiKey,
    Authorization: `Bearer ${apiKey}`,
  };
}

function constantTimeEquals(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function parseHeaderValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }
  return typeof value === "string" ? value.trim() : "";
}

function toRawBodyBuffer(rawBody: unknown): Buffer | null {
  if (Buffer.isBuffer(rawBody)) {
    return rawBody;
  }

  if (typeof rawBody === "string") {
    return Buffer.from(rawBody);
  }

  return null;
}

function extractWebhookSignature(headers: Readonly<Record<string, string | string[] | undefined>>): string {
  const signature =
    parseHeaderValue(headers["x-shipstation-signature"]) ||
    parseHeaderValue(headers["x-shipstation-hmac-sha256"]);

  if (!signature) {
    return "";
  }

  if (signature.toLowerCase().startsWith("sha256=")) {
    return signature.slice("sha256=".length).trim();
  }

  return signature;
}

function isValidWebhookSignature(signature: string, rawBody: Buffer, apiKey: string): boolean {
  const normalizedSignature = signature.trim();
  if (!normalizedSignature) {
    return false;
  }

  const expectedHex = createHmac("sha256", apiKey).update(rawBody).digest("hex");
  const expectedBase64 = createHmac("sha256", apiKey).update(rawBody).digest("base64");

  if (/^[a-f0-9]{64}$/i.test(normalizedSignature)) {
    return constantTimeEquals(normalizedSignature.toLowerCase(), expectedHex);
  }

  return constantTimeEquals(normalizedSignature, expectedBase64);
}

function extractWebhookCredential(headers: Readonly<Record<string, string | string[] | undefined>>): string {
  const explicitKey =
    parseHeaderValue(headers["x-shipstation-api-key"]) ||
    parseHeaderValue(headers["x-api-key"]) ||
    parseHeaderValue(headers["api-key"]);

  if (explicitKey) {
    return explicitKey;
  }

  const authHeader = parseHeaderValue(headers.authorization);
  const bearerPrefix = "bearer ";
  if (authHeader.toLowerCase().startsWith(bearerPrefix)) {
    return authHeader.slice(bearerPrefix.length).trim();
  }

  return "";
}

export function isAuthorizedShipStationWebhook(
  headers: Readonly<Record<string, string | string[] | undefined>>,
  rawBody?: unknown,
): boolean {
  const expectedKey = getShipStationApiKey();
  if (!expectedKey) {
    return false;
  }

  const enforceSignedWebhook =
    (process.env.SHIPSTATION_ENFORCE_SIGNED_WEBHOOK ?? "").trim().toLowerCase() === "true";
  const bodyBuffer = toRawBodyBuffer(rawBody);
  const signature = extractWebhookSignature(headers);

  if (signature && bodyBuffer) {
    return isValidWebhookSignature(signature, bodyBuffer, expectedKey);
  }

  if (enforceSignedWebhook) {
    return false;
  }

  const providedCredential = extractWebhookCredential(headers);
  if (!providedCredential) {
    return false;
  }

  return constantTimeEquals(providedCredential, expectedKey);
}

function toSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

async function parseErrorBody(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ShipStationApiError;
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const first = data.errors[0]?.message;
      if (first) {
        return first;
      }
    }

    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  } catch {
    // ignore parse errors
  }

  return `ShipStation request failed with status ${response.status}`;
}

function normalizeOrderLineItems(items: OrderLineItem[]): Array<{
  lineItemKey: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}> {
  return items.map((item, index) => ({
    lineItemKey: `${item.slug || "item"}-${index}`,
    sku: item.slug || `item-${index + 1}`,
    name: item.name || `Item ${index + 1}`,
    quantity: Math.max(1, Math.floor(item.quantity || 1)),
    unitPrice: Number(item.price || 0),
  }));
}

function toOrderDate(value: Date | null): string {
  return (value ?? new Date()).toISOString();
}

function toFulfillmentStatus(rawStatus: string): ShipStationTrackingUpdate["fulfillmentStatus"] {
  const status = rawStatus.trim().toLowerCase();
  if (!status) {
    return "processing";
  }
  if (status.includes("deliver")) {
    return "delivered";
  }
  if (status.includes("cancel")) {
    return "cancelled";
  }
  if (status.includes("ship") || status.includes("transit") || status.includes("in_transit")) {
    return "shipped";
  }
  if (status.includes("process") || status.includes("await")) {
    return "processing";
  }

  return "processing";
}

function getStringField(object: Record<string, unknown>, key: string): string | null {
  const value = object[key];
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return {};
}

export async function pushOrderToShipStation(order: Order): Promise<void> {
  const apiKey = getShipStationApiKey();
  if (!apiKey) {
    return;
  }

  const payload = {
    orderNumber: order.id,
    orderKey: order.id,
    orderDate: toOrderDate(order.createdAt),
    orderStatus: "awaiting_shipment",
    customerEmail: order.email,
    billTo: {
      name: `${order.shippingFirstName} ${order.shippingLastName}`.trim(),
      phone: "",
      email: order.email,
    },
    shipTo: {
      name: `${order.shippingFirstName} ${order.shippingLastName}`.trim(),
      street1: order.shippingAddress,
      street2: order.shippingApt ?? "",
      city: order.shippingCity,
      state: order.shippingState,
      postalCode: order.shippingZip,
      country: order.shippingCountry,
      residential: true,
    },
    items: normalizeOrderLineItems(order.items),
    amountPaid: order.totalAmount / 100,
    orderTotal: order.totalAmount / 100,
    taxAmount: 0,
    shippingAmount: 0,
  };

  try {
    const response = await fetch(`${SHIPSTATION_API_BASE}/orders`, {
      method: "POST",
      headers: getHeaders(apiKey),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await parseErrorBody(response);
      console.warn(`[shipstation] Failed to push order ${order.id}: ${message}`);
      return;
    }

    console.log(`[shipstation] Pushed order ${order.id} to ShipStation`);
  } catch (error) {
    console.warn(`[shipstation] Failed to push order ${order.id}: ${toSafeErrorMessage(error)}`);
  }
}

export async function getShipStationShipmentStatus(orderId: string): Promise<ShipStationShipmentStatus> {
  const apiKey = getShipStationApiKey();
  if (!apiKey) {
    return {
      found: false,
      status: "shipstation_not_configured",
      trackingNumber: null,
      trackingCarrier: null,
      trackingUrl: null,
      raw: null,
    };
  }

  try {
    const response = await fetch(
      `${SHIPSTATION_API_BASE}/shipments?orderNumber=${encodeURIComponent(orderId)}&pageSize=1&sortBy=shipDate&sortDir=desc`,
      {
        method: "GET",
        headers: getHeaders(apiKey),
      },
    );

    if (!response.ok) {
      const message = await parseErrorBody(response);
      throw new Error(message);
    }

    const data = (await response.json()) as ShipStationListShipmentsResponse;
    const shipment = Array.isArray(data.shipments) ? asRecord(data.shipments[0]) : null;

    if (!shipment) {
      return {
        found: false,
        status: "not_found",
        trackingNumber: null,
        trackingCarrier: null,
        trackingUrl: null,
        raw: null,
      };
    }

    const trackingNumber =
      getStringField(shipment, "trackingNumber") ??
      getStringField(shipment, "tracking_number") ??
      null;

    const trackingCarrier =
      getStringField(shipment, "carrierCode") ??
      getStringField(shipment, "carrier_code") ??
      getStringField(shipment, "carrier") ??
      null;

    const trackingUrl =
      getStringField(shipment, "trackingUrl") ??
      getStringField(shipment, "tracking_url") ??
      null;

    const status =
      getStringField(shipment, "shipmentStatus") ??
      getStringField(shipment, "status") ??
      "unknown";

    return {
      found: true,
      status,
      trackingNumber,
      trackingCarrier,
      trackingUrl,
      raw: shipment,
    };
  } catch (error) {
    return {
      found: false,
      status: `error:${toSafeErrorMessage(error)}`,
      trackingNumber: null,
      trackingCarrier: null,
      trackingUrl: null,
      raw: null,
    };
  }
}

export function parseShipStationTrackingUpdate(payload: unknown): ShipStationTrackingUpdate | null {
  const event = asRecord(payload);
  const data = asRecord(event.data);
  const source = Object.keys(data).length > 0 ? data : event;

  const orderNumber =
    getStringField(source, "orderNumber") ??
    getStringField(source, "order_number") ??
    getStringField(source, "orderId") ??
    getStringField(source, "order_id") ??
    null;

  if (!orderNumber) {
    return null;
  }

  const trackingNumber =
    getStringField(source, "trackingNumber") ??
    getStringField(source, "tracking_number") ??
    null;

  const trackingCarrier =
    getStringField(source, "carrierCode") ??
    getStringField(source, "carrier_code") ??
    getStringField(source, "carrier") ??
    null;

  const trackingUrl =
    getStringField(source, "trackingUrl") ??
    getStringField(source, "tracking_url") ??
    null;

  const status =
    getStringField(source, "shipmentStatus") ??
    getStringField(source, "shipment_status") ??
    getStringField(source, "status") ??
    "processing";

  return {
    orderNumber,
    fulfillmentStatus: toFulfillmentStatus(status),
    trackingNumber,
    trackingCarrier,
    trackingUrl,
  };
}
