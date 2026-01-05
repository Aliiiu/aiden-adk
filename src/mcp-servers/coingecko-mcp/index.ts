/**
 * CoinGecko MCP Server TypeScript Wrappers
 *
 * This module provides TypeScript wrappers for CoinGecko API
 * organized by category for filesystem-based discovery.
 *
 * Directory structure:
 * - markets/      - Market data, trending, search
 * - coins/        - Coin details and history
 * - categories/   - Coin categories
 * - utilities/    - Asset platforms, exchanges list, new coins
 * - contracts/    - Contract/token data and supported currencies
 * - prices/       - Simple price queries
 * - charts/       - Market charts and OHLC data
 * - nfts/         - NFT data and markets
 * - exchanges/    - Exchange data and tickers
 * - onchain/      - Onchain DEX data, pools, tokens, and trades
 */

// Import all functions for the default export
import { getCoinCategories } from "./categories/getCoinCategories";
import { getRangeCoinsMarketChart } from "./charts/getRangeCoinsMarketChart";
import { getRangeCoinsOhlc } from "./charts/getRangeCoinsOhlc";
import { getRangeContractCoinsMarketChart } from "./charts/getRangeContractCoinsMarketChart";
import { getCoinDetails } from "./coins/getCoinDetails";
import { getCoinsHistory } from "./coins/getCoinsHistory";
import { getCoinsContract } from "./contracts/getCoinsContract";
import { getSimpleSupportedVsCurrencies } from "./contracts/getSimpleSupportedVsCurrencies";
import { getExchangesById } from "./exchanges/getExchangesById";
import { getExchangesList as getExchangesListDetailed } from "./exchanges/getExchangesList";
import { getExchangesTickers } from "./exchanges/getExchangesTickers";
import { getRangeExchangesVolumeChart } from "./exchanges/getRangeExchangesVolumeChart";
import { getCoinsList } from "./markets/getCoinsList";
import { getCoinsMarkets } from "./markets/getCoinsMarkets";
import { getGlobal } from "./markets/getGlobal";
import { getTopGainersLosers } from "./markets/getTopGainersLosers";
import { getTrendingSearch } from "./markets/getTrendingSearch";
import { search } from "./markets/search";
import { getNftsById } from "./nfts/getNftsById";
import { getNftsList } from "./nfts/getNftsList";
import { getNftsMarketChart } from "./nfts/getNftsMarketChart";
import { getNftsMarkets } from "./nfts/getNftsMarkets";
import { getAddressesNetworksSimpleOnchainTokenPrice } from "./onchain/getAddressesNetworksSimpleOnchainTokenPrice";
import { getAddressesPoolsNetworksOnchainMulti } from "./onchain/getAddressesPoolsNetworksOnchainMulti";
import { getAddressesTokensNetworksOnchainMulti } from "./onchain/getAddressesTokensNetworksOnchainMulti";
import { getNetworkNetworksOnchainNewPools } from "./onchain/getNetworkNetworksOnchainNewPools";
import { getNetworksOnchainDexes } from "./onchain/getNetworksOnchainDexes";
import { getNetworksOnchainNewPools } from "./onchain/getNetworksOnchainNewPools";
import { getOnchainCategories } from "./onchain/getOnchainCategories";
import { getOnchainNetworks } from "./onchain/getOnchainNetworks";
import { getPoolsNetworksOnchainInfo } from "./onchain/getPoolsNetworksOnchainInfo";
import { getPoolsNetworksOnchainTrades } from "./onchain/getPoolsNetworksOnchainTrades";
import { getPoolsOnchainCategories } from "./onchain/getPoolsOnchainCategories";
import { getPoolsOnchainMegafilter } from "./onchain/getPoolsOnchainMegafilter";
import { getPoolsOnchainTrendingSearch } from "./onchain/getPoolsOnchainTrendingSearch";
import { getSearchOnchainPools } from "./onchain/getSearchOnchainPools";
import { getTimeframePoolsNetworksOnchainOhlcv } from "./onchain/getTimeframePoolsNetworksOnchainOhlcv";
import { getTimeframeTokensNetworksOnchainOhlcv } from "./onchain/getTimeframeTokensNetworksOnchainOhlcv";
import { getTokensNetworksOnchainHoldersChart } from "./onchain/getTokensNetworksOnchainHoldersChart";
import { getTokensNetworksOnchainInfo } from "./onchain/getTokensNetworksOnchainInfo";
import { getTokensNetworksOnchainPools } from "./onchain/getTokensNetworksOnchainPools";
import { getTokensNetworksOnchainTopHolders } from "./onchain/getTokensNetworksOnchainTopHolders";
import { getTokensNetworksOnchainTrades } from "./onchain/getTokensNetworksOnchainTrades";
import { getSimplePrice } from "./prices/getSimplePrice";
import { getSimpleTokenPrice } from "./prices/getSimpleTokenPrice";
import { executeTool, getToolset } from "./shared";
import { getAssetPlatforms } from "./utilities/getAssetPlatforms";
import { getExchangesList as getUtilitiesExchangesList } from "./utilities/getExchangesList";
import { getNewCoinsList } from "./utilities/getNewCoinsList";
import { searchDocs } from "./utilities/searchDocs";

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
export { getCoinsList } from "./markets/getCoinsList";
// Markets
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
// Onchain
export { getAddressesNetworksSimpleOnchainTokenPrice } from "./onchain/getAddressesNetworksSimpleOnchainTokenPrice";
export { getAddressesPoolsNetworksOnchainMulti } from "./onchain/getAddressesPoolsNetworksOnchainMulti";
export { getAddressesTokensNetworksOnchainMulti } from "./onchain/getAddressesTokensNetworksOnchainMulti";
export { getNetworkNetworksOnchainNewPools } from "./onchain/getNetworkNetworksOnchainNewPools";
export { getNetworksOnchainDexes } from "./onchain/getNetworksOnchainDexes";
export { getNetworksOnchainNewPools } from "./onchain/getNetworksOnchainNewPools";
export { getOnchainCategories } from "./onchain/getOnchainCategories";
export { getOnchainNetworks } from "./onchain/getOnchainNetworks";
export { getPoolsNetworksOnchainInfo } from "./onchain/getPoolsNetworksOnchainInfo";
export { getPoolsNetworksOnchainTrades } from "./onchain/getPoolsNetworksOnchainTrades";
export { getPoolsOnchainCategories } from "./onchain/getPoolsOnchainCategories";
export { getPoolsOnchainMegafilter } from "./onchain/getPoolsOnchainMegafilter";
export { getPoolsOnchainTrendingSearch } from "./onchain/getPoolsOnchainTrendingSearch";
export { getSearchOnchainPools } from "./onchain/getSearchOnchainPools";
export { getTimeframePoolsNetworksOnchainOhlcv } from "./onchain/getTimeframePoolsNetworksOnchainOhlcv";
export { getTimeframeTokensNetworksOnchainOhlcv } from "./onchain/getTimeframeTokensNetworksOnchainOhlcv";
export { getTokensNetworksOnchainHoldersChart } from "./onchain/getTokensNetworksOnchainHoldersChart";
export { getTokensNetworksOnchainInfo } from "./onchain/getTokensNetworksOnchainInfo";
export { getTokensNetworksOnchainPools } from "./onchain/getTokensNetworksOnchainPools";
export { getTokensNetworksOnchainTopHolders } from "./onchain/getTokensNetworksOnchainTopHolders";
export { getTokensNetworksOnchainTrades } from "./onchain/getTokensNetworksOnchainTrades";
// Prices
export { getSimplePrice } from "./prices/getSimplePrice";
export { getSimpleTokenPrice } from "./prices/getSimpleTokenPrice";
// Re-export shared utilities for advanced usage
export { executeTool, getToolset } from "./shared";
// Utilities
export { getAssetPlatforms } from "./utilities/getAssetPlatforms";
export { getExchangesList } from "./utilities/getExchangesList";
export { getNewCoinsList } from "./utilities/getNewCoinsList";
export { searchDocs } from "./utilities/searchDocs";

// Default export with all functions grouped (for backwards compatibility)
export default {
	// Markets
	getCoinsMarkets,
	getTopGainersLosers,
	getTrendingSearch,
	search,
	getGlobal,
	getCoinsList,

	// Coins
	getCoinDetails,
	getCoinsHistory,
	getSimpleTokenPrice,

	// Categories
	getCoinCategories,

	// Utilities
	getAssetPlatforms,
	getExchangesList: getUtilitiesExchangesList,
	getNewCoinsList,
	searchDocs,

	// Contracts/Tokens
	getCoinsContract,
	getSimplePrice,
	getSimpleSupportedVsCurrencies,

	// Charts/OHLC
	getRangeCoinsMarketChart,
	getRangeCoinsOhlc,
	getRangeContractCoinsMarketChart,

	// NFTs
	getNftsById,
	getNftsList,
	getNftsMarketChart,
	getNftsMarkets,

	// Exchanges
	getExchangesById,
	getExchangesListDetailed,
	getExchangesTickers,
	getRangeExchangesVolumeChart,

	// Default export (Onchain section)
	getAddressesNetworksSimpleOnchainTokenPrice,
	getAddressesPoolsNetworksOnchainMulti,
	getAddressesTokensNetworksOnchainMulti,
	getNetworkNetworksOnchainNewPools,
	getNetworksOnchainDexes,
	getNetworksOnchainNewPools,
	getOnchainCategories,
	getOnchainNetworks,
	getPoolsNetworksOnchainInfo,
	getPoolsNetworksOnchainTrades,
	getPoolsOnchainCategories,
	getPoolsOnchainMegafilter,
	getPoolsOnchainTrendingSearch,
	getSearchOnchainPools,
	getTimeframePoolsNetworksOnchainOhlcv,
	getTimeframeTokensNetworksOnchainOhlcv,
	getTokensNetworksOnchainHoldersChart,
	getTokensNetworksOnchainInfo,
	getTokensNetworksOnchainPools,
	getTokensNetworksOnchainTopHolders,
	getTokensNetworksOnchainTrades,

	// Shared
	executeTool,
	getToolset,
};
