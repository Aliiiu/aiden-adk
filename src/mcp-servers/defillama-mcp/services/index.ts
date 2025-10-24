/**
 * DefiLlama Services
 * Centralized exports for all service classes and singleton instances
 */

import { BlockchainService } from "./blockchain.service";
import { DexService } from "./dex.service";
import { FeesService } from "./fees.service";
import { OptionsService } from "./options.service";
import { PriceService } from "./price.service";
import { ProtocolService } from "./protocol.service";
import { StablecoinService } from "./stablecoin.service";
import { YieldService } from "./yield.service";

// Export service classes
export { BaseService } from "./base.service";
export { BlockchainService } from "./blockchain.service";
export { DexService } from "./dex.service";
export { FeesService } from "./fees.service";
export { OptionsService } from "./options.service";
export { PriceService } from "./price.service";
export { ProtocolService } from "./protocol.service";
export { StablecoinService } from "./stablecoin.service";
export { YieldService } from "./yield.service";

// Create and export singleton instances
export const blockchainService = new BlockchainService();
export const dexService = new DexService();
export const feesService = new FeesService();
export const optionsService = new OptionsService();
export const priceService = new PriceService();
export const protocolService = new ProtocolService();
export const stablecoinService = new StablecoinService();
export const yieldService = new YieldService();
