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
	getBlockChainTimestamp: async (params?: any) =>
		(
			await import("./blockchain/getBlockChainTimestamp.js")
		).getBlockChainTimestamp(params),

	// Protocols
	getProtocols: async (params?: any) =>
		(await import("./protocols/getProtocols.js")).getProtocols(params),
	getHistoricalChainTvl: async (params?: any) =>
		(
			await import("./protocols/getHistoricalChainTvl.js")
		).getHistoricalChainTvl(params),

	// Chains
	getChains: async (params?: any) =>
		(await import("./chains/getChains.js")).getChains(params),

	// DEX
	getDexsData: async (params?: any) =>
		(await import("./dex/getDexsData.js")).getDexsData(params),

	// Fees
	getFeesAndRevenue: async (params?: any) =>
		(await import("./fees/getFeesAndRevenue.js")).getFeesAndRevenue(params),

	// Options
	getOptionsData: async (params?: any) =>
		(await import("./options/getOptionsData.js")).getOptionsData(params),

	// Prices
	getPricesCurrentCoins: async (params: any) =>
		(await import("./prices/getPricesCurrentCoins.js")).getPricesCurrentCoins(
			params,
		),
	getPricesFirstCoins: async (params: any) =>
		(await import("./prices/getPricesFirstCoins.js")).getPricesFirstCoins(
			params,
		),
	getBatchHistorical: async (params: any) =>
		(await import("./prices/getBatchHistorical.js")).getBatchHistorical(params),
	getHistoricalPricesByContractAddress: async (params: any) =>
		(
			await import("./prices/getHistoricalPricesByContractAddress.js")
		).getHistoricalPricesByContractAddress(params),
	getPercentageCoins: async (params: any) =>
		(await import("./prices/getPercentageCoins.js")).getPercentageCoins(params),
	getChartCoins: async (params: any) =>
		(await import("./prices/getChartCoins.js")).getChartCoins(params),

	// Stablecoins
	getStableCoin: async (params?: any) =>
		(await import("./stablecoins/getStableCoin.js")).getStableCoin(params),
	getStableCoinChains: async () =>
		(
			await import("./stablecoins/getStableCoinChains.js")
		).getStableCoinChains(),
	getStableCoinCharts: async (params?: any) =>
		(await import("./stablecoins/getStableCoinCharts.js")).getStableCoinCharts(
			params,
		),
	getStableCoinPrices: async () =>
		(
			await import("./stablecoins/getStableCoinPrices.js")
		).getStableCoinPrices(),

	// Yields
	getHistoricalPoolData: async (params: any) =>
		(await import("./yields/getHistoricalPoolData.js")).getHistoricalPoolData(
			params,
		),
	getLatestPoolData: async (params?: any) =>
		(await import("./yields/getLatestPoolData.js")).getLatestPoolData(params),
};
