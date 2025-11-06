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
 * - utilities/  - Asset platforms, exchanges, new coins, docs search
 * - contracts/  - Contract addresses and token prices
 * - charts/     - Historical market data and OHLC
 * - nfts/       - NFT collection data
 * - exchanges/  - Exchange data and tickers
 * - onchain/    - Onchain/DEX data, pools, tokens
 */

// Categories
export { getCoinCategories } from "./categories/getCoinCategories.js";
export { getCoinsCategories } from "./categories/getCoinsCategories.js";
// Charts/OHLC
export { getRangeCoinsMarketChart } from "./charts/getRangeCoinsMarketChart.js";
export { getRangeCoinsOhlc } from "./charts/getRangeCoinsOhlc.js";
export { getRangeContractCoinsMarketChart } from "./charts/getRangeContractCoinsMarketChart.js";
// Coins
export { getCoinDetails } from "./coins/getCoinDetails.js";
export { getCoinsHistory } from "./coins/getCoinsHistory.js";
export { getSimpleTokenPrice } from "./coins/getSimpleTokenPrice.js";
// Contracts/Tokens
export { getCoinsContract } from "./contracts/getCoinsContract.js";
export { getSimplePrice } from "./contracts/getSimplePrice.js";
export { getSimpleSupportedVsCurrencies } from "./contracts/getSimpleSupportedVsCurrencies.js";
// Exchanges
export { getExchangesById } from "./exchanges/getExchangesById.js";
export { getExchangesList as getExchangesListDetailed } from "./exchanges/getExchangesList.js";
export { getExchangesTickers } from "./exchanges/getExchangesTickers.js";
export { getRangeExchangesVolumeChart } from "./exchanges/getRangeExchangesVolumeChart.js";
// Markets
export { getCoinsList } from "./markets/getCoinsList.js";
export { getCoinsMarkets } from "./markets/getCoinsMarkets.js";
export { getGlobal } from "./markets/getGlobal.js";
export { getTopGainersLosers } from "./markets/getTopGainersLosers.js";
export { getTrendingSearch } from "./markets/getTrendingSearch.js";
export { search } from "./markets/search.js";

// NFTs
export { getNftsById } from "./nfts/getNftsById.js";
export { getNftsList } from "./nfts/getNftsList.js";
export { getNftsMarketChart } from "./nfts/getNftsMarketChart.js";
export { getNftsMarkets } from "./nfts/getNftsMarkets.js";
export { getAddressesNetworksSimpleOnchainTokenPrice } from "./onchain/getAddressesNetworksSimpleOnchainTokenPrice.js";
export { getAddressesPoolsNetworksOnchainMulti } from "./onchain/getAddressesPoolsNetworksOnchainMulti.js";
export { getAddressesTokensNetworksOnchainMulti } from "./onchain/getAddressesTokensNetworksOnchainMulti.js";
export { getNetworkNetworksOnchainNewPools } from "./onchain/getNetworkNetworksOnchainNewPools.js";
export { getNetworksOnchainDexes } from "./onchain/getNetworksOnchainDexes.js";
export { getNetworksOnchainNewPools } from "./onchain/getNetworksOnchainNewPools.js";
export { getOnchainCategories } from "./onchain/getOnchainCategories.js";
// Onchain - Networks & General
export { getOnchainNetworks } from "./onchain/getOnchainNetworks.js";
export { getPoolsNetworksOnchainInfo } from "./onchain/getPoolsNetworksOnchainInfo.js";
export { getPoolsNetworksOnchainTrades } from "./onchain/getPoolsNetworksOnchainTrades.js";
export { getPoolsOnchainCategories } from "./onchain/getPoolsOnchainCategories.js";
export { getPoolsOnchainMegafilter } from "./onchain/getPoolsOnchainMegafilter.js";
// Onchain - Pools
export { getPoolsOnchainTrendingSearch } from "./onchain/getPoolsOnchainTrendingSearch.js";
export { getSearchOnchainPools } from "./onchain/getSearchOnchainPools.js";
export { getTimeframePoolsNetworksOnchainOhlcv } from "./onchain/getTimeframePoolsNetworksOnchainOhlcv.js";
export { getTimeframeTokensNetworksOnchainOhlcv } from "./onchain/getTimeframeTokensNetworksOnchainOhlcv.js";
export { getTokensNetworksOnchainHoldersChart } from "./onchain/getTokensNetworksOnchainHoldersChart.js";

// Onchain - Tokens
export { getTokensNetworksOnchainInfo } from "./onchain/getTokensNetworksOnchainInfo.js";
export { getTokensNetworksOnchainPools } from "./onchain/getTokensNetworksOnchainPools.js";
export { getTokensNetworksOnchainTopHolders } from "./onchain/getTokensNetworksOnchainTopHolders.js";
export { getTokensNetworksOnchainTrades } from "./onchain/getTokensNetworksOnchainTrades.js";
// Re-export shared utilities for advanced usage
export { executeTool, getToolset } from "./shared.js";
// Utilities
export { getAssetPlatforms } from "./utilities/getAssetPlatforms.js";
export { getExchangesList } from "./utilities/getExchangesList.js";
export { getNewCoinsList } from "./utilities/getNewCoinsList.js";
export { searchDocs } from "./utilities/searchDocs.js";

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
	getCoinsHistory: async (params: any) =>
		(await import("./coins/getCoinsHistory.js")).getCoinsHistory(params),
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

	// Contracts/Tokens
	getCoinsContract: async (params: any) =>
		(await import("./contracts/getCoinsContract.js")).getCoinsContract(params),
	getSimplePrice: async (params: any) =>
		(await import("./contracts/getSimplePrice.js")).getSimplePrice(params),
	getSimpleSupportedVsCurrencies: async () =>
		(
			await import("./contracts/getSimpleSupportedVsCurrencies.js")
		).getSimpleSupportedVsCurrencies(),

	// Charts/OHLC
	getRangeCoinsMarketChart: async (params: any) =>
		(
			await import("./charts/getRangeCoinsMarketChart.js")
		).getRangeCoinsMarketChart(params),
	getRangeCoinsOhlc: async (params: any) =>
		(await import("./charts/getRangeCoinsOhlc.js")).getRangeCoinsOhlc(params),
	getRangeContractCoinsMarketChart: async (params: any) =>
		(
			await import("./charts/getRangeContractCoinsMarketChart.js")
		).getRangeContractCoinsMarketChart(params),

	// NFTs
	getNftsById: async (params: any) =>
		(await import("./nfts/getNftsById.js")).getNftsById(params),
	getNftsList: async (params?: any) =>
		(await import("./nfts/getNftsList.js")).getNftsList(params),
	getNftsMarketChart: async (params: any) =>
		(await import("./nfts/getNftsMarketChart.js")).getNftsMarketChart(params),
	getNftsMarkets: async (params: any) =>
		(await import("./nfts/getNftsMarkets.js")).getNftsMarkets(params),

	// Exchanges
	getExchangesById: async (params: any) =>
		(await import("./exchanges/getExchangesById.js")).getExchangesById(params),
	getExchangesListDetailed: async (params?: any) =>
		(await import("./exchanges/getExchangesList.js")).getExchangesList(params),
	getExchangesTickers: async (params: any) =>
		(await import("./exchanges/getExchangesTickers.js")).getExchangesTickers(
			params,
		),
	getRangeExchangesVolumeChart: async (params: any) =>
		(
			await import("./exchanges/getRangeExchangesVolumeChart.js")
		).getRangeExchangesVolumeChart(params),
};
