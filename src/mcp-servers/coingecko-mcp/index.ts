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

import type { GetRangeCoinsMarketChartInput } from "./charts/getRangeCoinsMarketChart";
import type { GetRangeCoinsOhlcInput } from "./charts/getRangeCoinsOhlc";
import type { GetRangeContractCoinsMarketChartInput } from "./charts/getRangeContractCoinsMarketChart";
import type { GetCoinDetailsInput } from "./coins/getCoinDetails";
import type { GetCoinsHistoryInput } from "./coins/getCoinsHistory";
import type { GetCoinsContractInput } from "./contracts/getCoinsContract";
import type { GetExchangesByIdInput } from "./exchanges/getExchangesById";
import type { GetExchangesListInput } from "./exchanges/getExchangesList";
import type { GetExchangesTickersInput } from "./exchanges/getExchangesTickers";
import type { GetRangeExchangesVolumeChartInput } from "./exchanges/getRangeExchangesVolumeChart";
import type { GetCoinsListInput } from "./markets/getCoinsList";
import type { GetCoinsMarketsInput } from "./markets/getCoinsMarkets";
import type { GetTopGainersLosersInput } from "./markets/getTopGainersLosers";
import type { SearchInput } from "./markets/search";
import type { GetNftsByIdInput } from "./nfts/getNftsById";
import type { GetNftsListInput } from "./nfts/getNftsList";
import type { GetNftsMarketChartInput } from "./nfts/getNftsMarketChart";
import type { GetNftsMarketsInput } from "./nfts/getNftsMarkets";
import type { GetSimplePriceInput } from "./prices/getSimplePrice";
import type { GetSimpleTokenPriceInput } from "./prices/getSimpleTokenPrice";
import type { GetAssetPlatformsInput } from "./utilities/getAssetPlatforms";
import type { GetUtilitiesExchangesListInput } from "./utilities/getExchangesList";

// Categories
export { getCoinCategories } from "./categories/getCoinCategories";
// Charts/OHLC
export { getRangeCoinsMarketChart } from "./charts/getRangeCoinsMarketChart";
export { getRangeCoinsOhlc } from "./charts/getRangeCoinsOhlc";
export { getRangeContractCoinsMarketChart } from "./charts/getRangeContractCoinsMarketChart";
// Coins
export { getCoinDetails } from "./coins/getCoinDetails";
export { getCoinsHistory } from "./coins/getCoinsHistory";
// Contracts/Tokens
export { getCoinsContract } from "./contracts/getCoinsContract";
export { getSimpleSupportedVsCurrencies } from "./contracts/getSimpleSupportedVsCurrencies";
// Exchanges
export { getExchangesById } from "./exchanges/getExchangesById";
export { getExchangesList as getExchangesListDetailed } from "./exchanges/getExchangesList";
export { getExchangesTickers } from "./exchanges/getExchangesTickers";
export { getRangeExchangesVolumeChart } from "./exchanges/getRangeExchangesVolumeChart";
// Markets
export { getCoinsList } from "./markets/getCoinsList";
export { getCoinsMarkets } from "./markets/getCoinsMarkets";
export { getGlobal } from "./markets/getGlobal";
export { getTopGainersLosers } from "./markets/getTopGainersLosers";
export { getTrendingSearch } from "./markets/getTrendingSearch";
export { search } from "./markets/search";
// NFTs
export { getNftsById } from "./nfts/getNftsById";
export { getNftsList } from "./nfts/getNftsList";
export { getNftsMarketChart } from "./nfts/getNftsMarketChart";
export { getNftsMarkets } from "./nfts/getNftsMarkets";
export { getAddressesNetworksSimpleOnchainTokenPrice } from "./onchain/getAddressesNetworksSimpleOnchainTokenPrice";
export { getAddressesPoolsNetworksOnchainMulti } from "./onchain/getAddressesPoolsNetworksOnchainMulti";
export { getAddressesTokensNetworksOnchainMulti } from "./onchain/getAddressesTokensNetworksOnchainMulti";
export { getNetworkNetworksOnchainNewPools } from "./onchain/getNetworkNetworksOnchainNewPools";
export { getNetworksOnchainDexes } from "./onchain/getNetworksOnchainDexes";
export { getNetworksOnchainNewPools } from "./onchain/getNetworksOnchainNewPools";
export { getOnchainCategories } from "./onchain/getOnchainCategories";
// Onchain - Networks & General
export { getOnchainNetworks } from "./onchain/getOnchainNetworks";
export { getPoolsNetworksOnchainInfo } from "./onchain/getPoolsNetworksOnchainInfo";
export { getPoolsNetworksOnchainTrades } from "./onchain/getPoolsNetworksOnchainTrades";
export { getPoolsOnchainCategories } from "./onchain/getPoolsOnchainCategories";
export { getPoolsOnchainMegafilter } from "./onchain/getPoolsOnchainMegafilter";
// Onchain - Pools
export { getPoolsOnchainTrendingSearch } from "./onchain/getPoolsOnchainTrendingSearch";
export { getSearchOnchainPools } from "./onchain/getSearchOnchainPools";
export { getTimeframePoolsNetworksOnchainOhlcv } from "./onchain/getTimeframePoolsNetworksOnchainOhlcv";
export { getTimeframeTokensNetworksOnchainOhlcv } from "./onchain/getTimeframeTokensNetworksOnchainOhlcv";
export { getTokensNetworksOnchainHoldersChart } from "./onchain/getTokensNetworksOnchainHoldersChart";
// Onchain - Tokens
export { getTokensNetworksOnchainInfo } from "./onchain/getTokensNetworksOnchainInfo";
export { getTokensNetworksOnchainPools } from "./onchain/getTokensNetworksOnchainPools";
export { getTokensNetworksOnchainTopHolders } from "./onchain/getTokensNetworksOnchainTopHolders";
export { getTokensNetworksOnchainTrades } from "./onchain/getTokensNetworksOnchainTrades";
export { getSimplePrice } from "./prices/getSimplePrice";
export { getSimpleTokenPrice } from "./prices/getSimpleTokenPrice";
// Re-export shared utilities for advanced usage
export { executeTool, getToolset } from "./shared";
// Utilities
export { getAssetPlatforms } from "./utilities/getAssetPlatforms";
export { getExchangesList } from "./utilities/getExchangesList";
export { getNewCoinsList } from "./utilities/getNewCoinsList";
export { searchDocs } from "./utilities/searchDocs";

// Default export with all functions grouped
export default {
	// Markets
	getCoinsMarkets: async (params: GetCoinsMarketsInput) =>
		(await import("./markets/getCoinsMarkets.js")).getCoinsMarkets(params),
	getTopGainersLosers: async (params: GetTopGainersLosersInput) =>
		(await import("./markets/getTopGainersLosers.js")).getTopGainersLosers(
			params,
		),
	getTrendingSearch: async () =>
		(await import("./markets/getTrendingSearch.js")).getTrendingSearch(),
	search: async (params: SearchInput) =>
		(await import("./markets/search.js")).search(params),
	getGlobal: async () => (await import("./markets/getGlobal.js")).getGlobal(),
	getCoinsList: async (params?: GetCoinsListInput) =>
		(await import("./markets/getCoinsList.js")).getCoinsList(params),

	// Coins
	getCoinDetails: async (params: GetCoinDetailsInput) =>
		(await import("./coins/getCoinDetails.js")).getCoinDetails(params),
	getCoinsHistory: async (params: GetCoinsHistoryInput) =>
		(await import("./coins/getCoinsHistory.js")).getCoinsHistory(params),
	getSimpleTokenPrice: async (params: GetSimpleTokenPriceInput) =>
		(await import("./prices/getSimpleTokenPrice.js")).getSimpleTokenPrice(
			params,
		),

	// Categories
	getCoinCategories: async () =>
		(await import("./categories/getCoinCategories.js")).getCoinCategories(),

	// Utilities
	getAssetPlatforms: async (params?: GetAssetPlatformsInput) =>
		(await import("./utilities/getAssetPlatforms.js")).getAssetPlatforms(
			params,
		),
	getExchangesList: async (params?: GetUtilitiesExchangesListInput) =>
		(await import("./utilities/getExchangesList.js")).getExchangesList(params),
	getNewCoinsList: async () =>
		(await import("./utilities/getNewCoinsList.js")).getNewCoinsList(),

	// Contracts/Tokens
	getCoinsContract: async (params: GetCoinsContractInput) =>
		(await import("./contracts/getCoinsContract.js")).getCoinsContract(params),
	getSimplePrice: async (params: GetSimplePriceInput) =>
		(await import("./prices/getSimplePrice.js")).getSimplePrice(params),
	getSimpleSupportedVsCurrencies: async () =>
		(
			await import("./contracts/getSimpleSupportedVsCurrencies.js")
		).getSimpleSupportedVsCurrencies(),

	// Charts/OHLC
	getRangeCoinsMarketChart: async (params: GetRangeCoinsMarketChartInput) =>
		(
			await import("./charts/getRangeCoinsMarketChart.js")
		).getRangeCoinsMarketChart(params),
	getRangeCoinsOhlc: async (params: GetRangeCoinsOhlcInput) =>
		(await import("./charts/getRangeCoinsOhlc.js")).getRangeCoinsOhlc(params),
	getRangeContractCoinsMarketChart: async (
		params: GetRangeContractCoinsMarketChartInput,
	) =>
		(
			await import("./charts/getRangeContractCoinsMarketChart.js")
		).getRangeContractCoinsMarketChart(params),

	// NFTs
	getNftsById: async (params: GetNftsByIdInput) =>
		(await import("./nfts/getNftsById.js")).getNftsById(params),
	getNftsList: async (params?: GetNftsListInput) =>
		(await import("./nfts/getNftsList.js")).getNftsList(params),
	getNftsMarketChart: async (params: GetNftsMarketChartInput) =>
		(await import("./nfts/getNftsMarketChart.js")).getNftsMarketChart(params),
	getNftsMarkets: async (params: GetNftsMarketsInput) =>
		(await import("./nfts/getNftsMarkets.js")).getNftsMarkets(params),

	// Exchanges
	getExchangesById: async (params: GetExchangesByIdInput) =>
		(await import("./exchanges/getExchangesById.js")).getExchangesById(params),
	getExchangesListDetailed: async (params?: GetExchangesListInput) =>
		(await import("./exchanges/getExchangesList.js")).getExchangesList(params),
	getExchangesTickers: async (params: GetExchangesTickersInput) =>
		(await import("./exchanges/getExchangesTickers.js")).getExchangesTickers(
			params,
		),
	getRangeExchangesVolumeChart: async (
		params: GetRangeExchangesVolumeChartInput,
	) =>
		(
			await import("./exchanges/getRangeExchangesVolumeChart.js")
		).getRangeExchangesVolumeChart(params),
};
