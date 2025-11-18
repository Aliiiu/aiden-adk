/**
 * DefiLlama MCP TypeScript Wrappers
 *
 * This module provides TypeScript wrappers for DefiLlama services
 * organized by category for code execution and direct usage.
 *
 * Directory structure:
 * - blockchain/   - Block height and timestamp utilities
 * - protocols/    - Protocol data and TVL metrics
 * - chains/       - Chain rankings and data
 * - stablecoins/  - Stablecoin information
 * - yields/       - Yield farming data
 * - dex/          - DEX volumes and data
 * - prices/       - Token price data
 * - fees/         - Protocol fees and revenue
 * - options/      - Options protocol metrics
 */

import jsonata from "jsonata";
import type { GetBlockChainTimestampInput } from "./blockchain/getBlockChainTimestamp.js";
import type { GetChainsInput } from "./chains/getChains.js";
import type { GetDexsDataInput } from "./dex/getDexsData.js";
import type { GetFeesAndRevenueInput } from "./fees/getFeesAndRevenue.js";
import type { GetOptionsDataInput } from "./options/getOptionsData.js";
import type { GetBatchHistoricalInput } from "./prices/getBatchHistorical.js";
import type { GetChartCoinsInput } from "./prices/getChartCoins.js";
import type { GetHistoricalPricesByContractAddressInput } from "./prices/getHistoricalPricesByContractAddress.js";
import type { GetPercentageCoinsInput } from "./prices/getPercentageCoins.js";
import type { GetPricesCurrentCoinsInput } from "./prices/getPricesCurrentCoins.js";
import type { GetPricesFirstCoinsInput } from "./prices/getPricesFirstCoins.js";
import type { GetHistoricalChainTvlInput } from "./protocols/getHistoricalChainTvl.js";
import type { GetProtocolsInput } from "./protocols/getProtocols.js";
import type { GetStableCoinInput } from "./stablecoins/getStableCoin.js";
import type { GetStableCoinChartsInput } from "./stablecoins/getStableCoinCharts.js";
import type { GetHistoricalPoolDataInput } from "./yields/getHistoricalPoolData.js";
import type { GetLatestPoolDataInput } from "./yields/getLatestPoolData.js";

// Export jsonata for parameter discovery and filtering
export { jsonata };

export { bridgeIds } from "../enums/bridgeIds.js";
export { chains } from "../enums/chains.js";
export { options } from "../enums/options.js";
// Export enums for discovery
export { protocols } from "../enums/protocols.js";
export { stablecoins } from "../enums/stablecoinIds.js";
// Re-export shared utilities for advanced usage
export { executeServiceMethod } from "../shared.js";
// Blockchain
export { getBlockChainTimestamp } from "./blockchain/getBlockChainTimestamp.js";
// Chains
export { getChains } from "./chains/getChains.js";
// DEX
export { getDexsData } from "./dex/getDexsData.js";
// Fees
export { getFeesAndRevenue } from "./fees/getFeesAndRevenue.js";
// Options
export { getOptionsData } from "./options/getOptionsData.js";
export { getBatchHistorical } from "./prices/getBatchHistorical.js";
export { getChartCoins } from "./prices/getChartCoins.js";
export { getHistoricalPricesByContractAddress } from "./prices/getHistoricalPricesByContractAddress.js";
export { getPercentageCoins } from "./prices/getPercentageCoins.js";
// Prices
export { getPricesCurrentCoins } from "./prices/getPricesCurrentCoins.js";
export { getPricesFirstCoins } from "./prices/getPricesFirstCoins.js";
export { getHistoricalChainTvl } from "./protocols/getHistoricalChainTvl.js";
// Protocols
export { getProtocols } from "./protocols/getProtocols.js";
// Stablecoins
export { getStableCoin } from "./stablecoins/getStableCoin.js";
export { getStableCoinChains } from "./stablecoins/getStableCoinChains.js";
export { getStableCoinCharts } from "./stablecoins/getStableCoinCharts.js";
export { getStableCoinPrices } from "./stablecoins/getStableCoinPrices.js";
// Yields
export { getHistoricalPoolData } from "./yields/getHistoricalPoolData.js";
export { getLatestPoolData } from "./yields/getLatestPoolData.js";

// Default export with all functions grouped
export default {
	// Blockchain
	getBlockChainTimestamp: async (params: GetBlockChainTimestampInput) =>
		(
			await import("./blockchain/getBlockChainTimestamp.js")
		).getBlockChainTimestamp(params),

	// Protocols
	getProtocols: async (params: GetProtocolsInput) =>
		(await import("./protocols/getProtocols.js")).getProtocols(params),
	getHistoricalChainTvl: async (params?: GetHistoricalChainTvlInput) =>
		(
			await import("./protocols/getHistoricalChainTvl.js")
		).getHistoricalChainTvl(params),

	// Chains
	getChains: async (params?: GetChainsInput) =>
		(await import("./chains/getChains.js")).getChains(params),

	// DEX
	getDexsData: async (params?: GetDexsDataInput) =>
		(await import("./dex/getDexsData.js")).getDexsData(params),

	// Fees
	getFeesAndRevenue: async (params?: GetFeesAndRevenueInput) =>
		(await import("./fees/getFeesAndRevenue.js")).getFeesAndRevenue(params),

	// Options
	getOptionsData: async (params?: GetOptionsDataInput) =>
		(await import("./options/getOptionsData.js")).getOptionsData(params),

	// Prices
	getPricesCurrentCoins: async (params: GetPricesCurrentCoinsInput) =>
		(await import("./prices/getPricesCurrentCoins.js")).getPricesCurrentCoins(
			params,
		),
	getPricesFirstCoins: async (params: GetPricesFirstCoinsInput) =>
		(await import("./prices/getPricesFirstCoins.js")).getPricesFirstCoins(
			params,
		),
	getBatchHistorical: async (params: GetBatchHistoricalInput) =>
		(await import("./prices/getBatchHistorical.js")).getBatchHistorical(params),
	getHistoricalPricesByContractAddress: async (
		params: GetHistoricalPricesByContractAddressInput,
	) =>
		(
			await import("./prices/getHistoricalPricesByContractAddress.js")
		).getHistoricalPricesByContractAddress(params),
	getPercentageCoins: async (params: GetPercentageCoinsInput) =>
		(await import("./prices/getPercentageCoins.js")).getPercentageCoins(params),
	getChartCoins: async (params: GetChartCoinsInput) =>
		(await import("./prices/getChartCoins.js")).getChartCoins(params),

	// Stablecoins
	getStableCoin: async (params?: GetStableCoinInput) =>
		(await import("./stablecoins/getStableCoin.js")).getStableCoin(params),
	getStableCoinChains: async () =>
		(
			await import("./stablecoins/getStableCoinChains.js")
		).getStableCoinChains(),
	getStableCoinCharts: async (params?: GetStableCoinChartsInput) =>
		(await import("./stablecoins/getStableCoinCharts.js")).getStableCoinCharts(
			params,
		),
	getStableCoinPrices: async () =>
		(
			await import("./stablecoins/getStableCoinPrices.js")
		).getStableCoinPrices(),

	// Yields
	getHistoricalPoolData: async (params: GetHistoricalPoolDataInput) =>
		(await import("./yields/getHistoricalPoolData.js")).getHistoricalPoolData(
			params,
		),
	getLatestPoolData: async (params?: GetLatestPoolDataInput) =>
		(await import("./yields/getLatestPoolData.js")).getLatestPoolData(params),
};
