import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils";
import { ShipStationClient } from "./client.js";
import type { ShipStationModuleOptions } from "./types.js";

type FulfillmentOption = {
  id: string;
  name?: string;
  [key: string]: unknown;
};

class ShipStationProviderService extends AbstractFulfillmentProviderService {
  static identifier = "shipstation";
  protected client: ShipStationClient;

  constructor(container: Record<string, unknown>, options: ShipStationModuleOptions) {
    super(container, options);
    this.client = new ShipStationClient(options.api_key, options.base_url);
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    try {
      const { carriers } = await this.client.listCarriers();
      const options: FulfillmentOption[] = [];

      for (const carrier of carriers) {
        const { services } = await this.client.listServices(carrier.carrier_id);
        for (const service of services) {
          options.push({
            id: `${carrier.carrier_code}_${service.service_code}`,
            name: `${carrier.friendly_name || carrier.name} - ${service.name}`,
            carrier_id: carrier.carrier_id,
            carrier_code: carrier.carrier_code,
            service_code: service.service_code,
          });
        }
      }

      return options;
    } catch (error) {
      console.error("ShipStation getFulfillmentOptions error:", error);
      return [
        {
          id: "shipstation_manual",
          name: "ShipStation (manual)",
        },
      ];
    }
  }

  async canCalculate(data: Record<string, unknown>): Promise<boolean> {
    return !!(data.carrier_id && data.service_code);
  }

  async calculatePrice(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    cart: Record<string, unknown>
  ): Promise<number> {
    try {
      const shippingAddress = cart.shipping_address as Record<string, string> | undefined;
      if (!shippingAddress?.postal_code || !shippingAddress?.country_code) {
        return 0;
      }

      const items = (cart.items || []) as Array<{ variant?: { weight?: number } }>;
      const totalWeight = items.reduce((sum: number, item) => {
        return sum + (item.variant?.weight || 0.5);
      }, 0);

      const rateResponse = await this.client.getRates({
        carrier_ids: [optionData.carrier_id as string],
        from_country_code: "US",
        from_postal_code: "10001",
        to_country_code: shippingAddress.country_code,
        to_postal_code: shippingAddress.postal_code,
        weight: { value: totalWeight, unit: "pound" },
      });

      const rate = rateResponse.rate_response.rates.find(
        (r) => r.service_code === optionData.service_code
      );

      if (rate) {
        return rate.shipping_amount.amount * 100;
      }

      return 0;
    } catch (error) {
      console.error("ShipStation calculatePrice error:", error);
      return 0;
    }
  }

  async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return {
      ...data,
      ...optionData,
    };
  }

  async validateOption(data: Record<string, unknown>): Promise<boolean> {
    return !!data.id;
  }

  async createFulfillment(
    data: Record<string, unknown>,
    items: Record<string, unknown>[],
    order: Record<string, unknown> | undefined,
    fulfillment: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    try {
      const shippingAddress = (order as any)?.shipping_address;
      if (!shippingAddress) {
        return { message: "Fulfillment created without label (no address)" };
      }

      const totalWeight = items.reduce((sum: number, item: any) => {
        return sum + (item.variant?.weight || 0.5);
      }, 0);

      const label = await this.client.createLabel({
        shipment: {
          carrier_id: data.carrier_id as string,
          service_code: data.service_code as string,
          ship_from: {
            name: "Age Revive",
            address_line1: process.env.SHIP_FROM_ADDRESS || "123 Main St",
            city_locality: process.env.SHIP_FROM_CITY || "New York",
            state_province: process.env.SHIP_FROM_STATE || "NY",
            postal_code: process.env.SHIP_FROM_ZIP || "10001",
            country_code: "US",
          },
          ship_to: {
            name: `${shippingAddress.first_name || ""} ${shippingAddress.last_name || ""}`.trim(),
            address_line1: shippingAddress.address_1,
            address_line2: shippingAddress.address_2,
            city_locality: shippingAddress.city,
            state_province: shippingAddress.province,
            postal_code: shippingAddress.postal_code,
            country_code: shippingAddress.country_code,
          },
          packages: [
            {
              weight: { value: totalWeight, unit: "pound" as const },
            },
          ],
        },
      });

      return {
        label_id: label.label_id,
        tracking_number: label.tracking_number,
        carrier_code: label.carrier_code,
        label_url: label.label_download?.pdf,
      };
    } catch (error) {
      console.error("ShipStation createFulfillment error:", error);
      return { message: "Fulfillment created (label generation failed)" };
    }
  }

  async cancelFulfillment(fulfillment: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      const labelId = (fulfillment.data as any)?.label_id;
      if (labelId) {
        await this.client.voidLabel(labelId);
      }
      return { message: "Fulfillment cancelled" };
    } catch (error) {
      console.error("ShipStation cancelFulfillment error:", error);
      return { message: "Fulfillment cancelled (void label failed)" };
    }
  }

  async createReturnFulfillment(
    fromData: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return { message: "Return fulfillment created" };
  }
}

export default ShipStationProviderService;
