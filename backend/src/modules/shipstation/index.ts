import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import ShipStationProviderService from "./service.js";

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [ShipStationProviderService],
});
