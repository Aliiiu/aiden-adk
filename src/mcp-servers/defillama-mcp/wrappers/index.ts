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
import type { GetBlockChainTimestampInput } from "./blockchain/getBlockChainTimestamp";
import type { GetChainsInput } from "./chains/getChains";
import type { GetDexsDataInput } from "./dex/getDexsData";
import type { GetFeesAndRevenueInput } from "./fees/getFeesAndRevenue";
import type { GetOptionsDataInput } from "./options/getOptionsData";
import type { GetBatchHistoricalInput } from "./prices/getBatchHistorical";
import type { GetChartCoinsInput } from "./prices/getChartCoins";
import type { GetHistoricalPricesByContractAddressInput } from "./prices/getHistoricalPricesByContractAddress";
import type { GetPercentageCoinsInput } from "./prices/getPercentageCoins";
import type { GetPricesCurrentCoinsInput } from "./prices/getPricesCurrentCoins";
import type { GetPricesFirstCoinsInput } from "./prices/getPricesFirstCoins";
import type { GetHistoricalChainTvlInput } from "./protocols/getHistoricalChainTvl";
import type { GetProtocolsInput } from "./protocols/getProtocols";
import type { GetStableCoinInput } from "./stablecoins/getStableCoin";
import type { GetStableCoinChartsInput } from "./stablecoins/getStableCoinCharts";
import type { GetHistoricalPoolDataInput } from "./yields/getHistoricalPoolData";
import type { GetLatestPoolDataInput } from "./yields/getLatestPoolData";

// Export jsonata for parameter discovery and filtering
export { jsonata };

export { bridgeIds } from "../enums/bridgeIds";
export { chains } from "../enums/chains";
export { options } from "../enums/options";
// Export enums for discovery
export { protocols } from "../enums/protocols";
export { stablecoins } from "../enums/stablecoinIds";
// Re-export shared utilities for advanced usage
export { executeServiceMethod } from "../shared";
// Blockchain
export { getBlockChainTimestamp } from "./blockchain/getBlockChainTimestamp";
// Chains
export { getChains } from "./chains/getChains";
// DEX
export { getDexsData } from "./dex/getDexsData";
// Fees
export { getFeesAndRevenue } from "./fees/getFeesAndRevenue";
// Options
export { getOptionsData } from "./options/getOptionsData";
export { getBatchHistorical } from "./prices/getBatchHistorical";
export { getChartCoins } from "./prices/getChartCoins";
export { getHistoricalPricesByContractAddress } from "./prices/getHistoricalPricesByContractAddress";
export { getPercentageCoins } from "./prices/getPercentageCoins";
// Prices
export { getPricesCurrentCoins } from "./prices/getPricesCurrentCoins";
export { getPricesFirstCoins } from "./prices/getPricesFirstCoins";
export { getHistoricalChainTvl } from "./protocols/getHistoricalChainTvl";
// Protocols
export { getProtocols } from "./protocols/getProtocols";
// Stablecoins
export { getStableCoin } from "./stablecoins/getStableCoin";
export { getStableCoinChains } from "./stablecoins/getStableCoinChains";
export { getStableCoinCharts } from "./stablecoins/getStableCoinCharts";
export { getStableCoinPrices } from "./stablecoins/getStableCoinPrices";
// Yields
export { getHistoricalPoolData } from "./yields/getHistoricalPoolData";
export { getLatestPoolData } from "./yields/getLatestPoolData";

// Default export with all functions grouped
export default {
	// Blockchain
	getBlockChainTimestamp: async (params: GetBlockChainTimestampInput) =>
		(
			await import("./blockchain/getBlockChainTimestamp")
		).getBlockChainTimestamp(params),

	// Protocols
	getProtocols: async (params: GetProtocolsInput) =>
		(await import("./protocols/getProtocols")).getProtocols(params),
	getHistoricalChainTvl: async (params?: GetHistoricalChainTvlInput) =>
		(await import("./protocols/getHistoricalChainTvl")).getHistoricalChainTvl(
			params,
		),

	// Chains
	getChains: async (params?: GetChainsInput) =>
		(await import("./chains/getChains")).getChains(params),

	// DEX
	getDexsData: async (params?: GetDexsDataInput) =>
		(await import("./dex/getDexsData")).getDexsData(params),

	// Fees
	getFeesAndRevenue: async (params?: GetFeesAndRevenueInput) =>
		(await import("./fees/getFeesAndRevenue")).getFeesAndRevenue(params),

	// Options
	getOptionsData: async (params?: GetOptionsDataInput) =>
		(await import("./options/getOptionsData")).getOptionsData(params),

	// Prices
	getPricesCurrentCoins: async (params: GetPricesCurrentCoinsInput) =>
		(await import("./prices/getPricesCurrentCoins")).getPricesCurrentCoins(
			params,
		),
	getPricesFirstCoins: async (params: GetPricesFirstCoinsInput) =>
		(await import("./prices/getPricesFirstCoins")).getPricesFirstCoins(params),
	getBatchHistorical: async (params: GetBatchHistoricalInput) =>
		(await import("./prices/getBatchHistorical")).getBatchHistorical(params),
	getHistoricalPricesByContractAddress: async (
		params: GetHistoricalPricesByContractAddressInput,
	) =>
		(
			await import("./prices/getHistoricalPricesByContractAddress")
		).getHistoricalPricesByContractAddress(params),
	getPercentageCoins: async (params: GetPercentageCoinsInput) =>
		(await import("./prices/getPercentageCoins")).getPercentageCoins(params),
	getChartCoins: async (params: GetChartCoinsInput) =>
		(await import("./prices/getChartCoins")).getChartCoins(params),

	// Stablecoins
	getStableCoin: async (params?: GetStableCoinInput) =>
		(await import("./stablecoins/getStableCoin")).getStableCoin(params),
	getStableCoinChains: async () =>
		(await import("./stablecoins/getStableCoinChains")).getStableCoinChains(),
	getStableCoinCharts: async (params?: GetStableCoinChartsInput) =>
		(await import("./stablecoins/getStableCoinCharts")).getStableCoinCharts(
			params,
		),
	getStableCoinPrices: async () =>
		(await import("./stablecoins/getStableCoinPrices")).getStableCoinPrices(),

	// Yields
	getHistoricalPoolData: async (params: GetHistoricalPoolDataInput) =>
		(await import("./yields/getHistoricalPoolData")).getHistoricalPoolData(
			params,
		),
	getLatestPoolData: async (params?: GetLatestPoolDataInput) =>
		(await import("./yields/getLatestPoolData")).getLatestPoolData(params),
};
