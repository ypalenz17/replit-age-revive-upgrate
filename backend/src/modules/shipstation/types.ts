export interface ShipStationModuleOptions {
  api_key: string;
  base_url?: string;
}

export interface ShipStationCarrier {
  carrier_id: string;
  carrier_code: string;
  name: string;
  friendly_name: string;
}

export interface ShipStationService {
  carrier_id: string;
  carrier_code: string;
  service_code: string;
  name: string;
  domestic: boolean;
  international: boolean;
}

export interface ShipStationRate {
  rate_id: string;
  rate_type: string;
  carrier_id: string;
  shipping_amount: { currency: string; amount: number };
  service_type: string;
  service_code: string;
  delivery_days: number;
  estimated_delivery_date: string;
}

export interface ShipStationLabel {
  label_id: string;
  status: string;
  tracking_number: string;
  carrier_code: string;
  service_code: string;
  label_download: { pdf: string; png: string; zpl: string };
}

export interface ShipStationAddress {
  name: string;
  company_name?: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  city_locality: string;
  state_province: string;
  postal_code: string;
  country_code: string;
}

export interface ShipStationPackage {
  weight: { value: number; unit: "ounce" | "pound" | "gram" | "kilogram" };
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: "inch" | "centimeter";
  };
}
