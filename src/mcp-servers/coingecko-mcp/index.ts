/**
 * CoinGecko MCP Server TypeScript Wrappers
 *
 * This module provides TypeScript wrappers for CoinGecko MCP tools
 * organized by category for filesystem-based discovery.
 *
 * Directory structure:
 * - markets/    - Market data, trending, search, global stats
 * - coins/      - Detailed coin information and prices
 * - categories/ - Coin categories and groupings
 * - utilities/  - Asset platforms, exchanges, new coins
 */

export { getCoinCategories } from "./categories/getCoinCategories.js";
export { getCoinsCategories } from "./categories/getCoinsCategories.js";
export { getCoinDetails } from "./coins/getCoinDetails.js";
export { getSimpleTokenPrice } from "./coins/getSimpleTokenPrice.js";
export { getCoinsList } from "./markets/getCoinsList.js";
// Re-export all functions for backward compatibility
export { getCoinsMarkets } from "./markets/getCoinsMarkets.js";
export { getGlobal } from "./markets/getGlobal.js";
export { getTopGainersLosers } from "./markets/getTopGainersLosers.js";
export { getTrendingSearch } from "./markets/getTrendingSearch.js";
export { search } from "./markets/search.js";
// Re-export shared utilities for advanced usage
export { executeTool, getToolset } from "./shared.js";
export { getAssetPlatforms } from "./utilities/getAssetPlatforms.js";
export { getExchangesList } from "./utilities/getExchangesList.js";
export { getNewCoinsList } from "./utilities/getNewCoinsList.js";

// Default export with all functions grouped
export default {
	// Markets
	getCoinsMarkets: async (params: any) =>
		(await import("./markets/getCoinsMarkets.js")).getCoinsMarkets(params),
	getTopGainersLosers: async (params?: any) =>
		(await import("./markets/getTopGainersLosers.js")).getTopGainersLosers(
			params,
		),
	getTrendingSearch: async () =>
		(await import("./markets/getTrendingSearch.js")).getTrendingSearch(),
	search: async (params: any) =>
		(await import("./markets/search.js")).search(params),
	getGlobal: async () => (await import("./markets/getGlobal.js")).getGlobal(),
	getCoinsList: async (params?: any) =>
		(await import("./markets/getCoinsList.js")).getCoinsList(params),

	// Coins
	getCoinDetails: async (params: any) =>
		(await import("./coins/getCoinDetails.js")).getCoinDetails(params),
	getSimpleTokenPrice: async (params: any) =>
		(await import("./coins/getSimpleTokenPrice.js")).getSimpleTokenPrice(
			params,
		),

	// Categories
	getCoinCategories: async () =>
		(await import("./categories/getCoinCategories.js")).getCoinCategories(),
	getCoinsCategories: async (params?: any) =>
		(await import("./categories/getCoinsCategories.js")).getCoinsCategories(
			params,
		),

	// Utilities
	getAssetPlatforms: async (params?: any) =>
		(await import("./utilities/getAssetPlatforms.js")).getAssetPlatforms(
			params,
		),
	getExchangesList: async (params?: any) =>
		(await import("./utilities/getExchangesList.js")).getExchangesList(params),
	getNewCoinsList: async () =>
		(await import("./utilities/getNewCoinsList.js")).getNewCoinsList(),
};
