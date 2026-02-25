import type {
  ShipStationCarrier,
  ShipStationService,
  ShipStationRate,
  ShipStationLabel,
  ShipStationAddress,
  ShipStationPackage,
} from "./types.js";

export class ShipStationClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || "https://api.shipstation.com/v2";
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "api-key": this.apiKey,
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `ShipStation API error ${response.status}: ${errorText}`
      );
    }

    return response.json() as Promise<T>;
  }

  async listCarriers(): Promise<{ carriers: ShipStationCarrier[] }> {
    return this.request("GET", "/carriers");
  }

  async listServices(
    carrierId: string
  ): Promise<{ services: ShipStationService[] }> {
    return this.request("GET", `/carriers/${carrierId}/services`);
  }

  async getRates(data: {
    carrier_ids: string[];
    from_country_code: string;
    from_postal_code: string;
    to_country_code: string;
    to_postal_code: string;
    weight: { value: number; unit: string };
    dimensions?: { length: number; width: number; height: number; unit: string };
  }): Promise<{ rate_response: { rates: ShipStationRate[] } }> {
    return this.request("POST", "/rates", {
      rate_options: { carrier_ids: data.carrier_ids },
      shipment: {
        ship_from: {
          country_code: data.from_country_code,
          postal_code: data.from_postal_code,
        },
        ship_to: {
          country_code: data.to_country_code,
          postal_code: data.to_postal_code,
        },
        packages: [
          {
            weight: data.weight,
            dimensions: data.dimensions,
          },
        ],
      },
    });
  }

  async createLabel(data: {
    shipment: {
      carrier_id: string;
      service_code: string;
      ship_from: ShipStationAddress;
      ship_to: ShipStationAddress;
      packages: ShipStationPackage[];
    };
  }): Promise<ShipStationLabel> {
    return this.request("POST", "/labels", data);
  }

  async voidLabel(labelId: string): Promise<{ approved: boolean }> {
    return this.request("PUT", `/labels/${labelId}/void`);
  }

  async getTracking(
    carrierCode: string,
    trackingNumber: string
  ): Promise<unknown> {
    return this.request(
      "GET",
      `/tracking?carrier_code=${carrierCode}&tracking_number=${trackingNumber}`
    );
  }
}
