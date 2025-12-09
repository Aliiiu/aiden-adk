// Markets

// Categories
import { getCoinCategories } from "./categories/getCoinCategories";
// Charts/OHLC
import { getRangeCoinsMarketChart } from "./charts/getRangeCoinsMarketChart";
import { getRangeCoinsOhlc } from "./charts/getRangeCoinsOhlc";
import { getRangeContractCoinsMarketChart } from "./charts/getRangeContractCoinsMarketChart";
// Coins
import { getCoinDetails } from "./coins/getCoinDetails";
import { getCoinsHistory } from "./coins/getCoinsHistory";
// Contracts/Tokens
import { getCoinsContract } from "./contracts/getCoinsContract";
import { getSimpleSupportedVsCurrencies } from "./contracts/getSimpleSupportedVsCurrencies";
// Exchanges
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
// NFTs
import { getNftsById } from "./nfts/getNftsById";
import { getNftsList } from "./nfts/getNftsList";
import { getNftsMarketChart } from "./nfts/getNftsMarketChart";
import { getNftsMarkets } from "./nfts/getNftsMarkets";

// Onchain - General
import { getAddressesNetworksSimpleOnchainTokenPrice } from "./onchain/getAddressesNetworksSimpleOnchainTokenPrice";
import { getAddressesPoolsNetworksOnchainMulti } from "./onchain/getAddressesPoolsNetworksOnchainMulti";
import { getAddressesTokensNetworksOnchainMulti } from "./onchain/getAddressesTokensNetworksOnchainMulti";
import { getNetworkNetworksOnchainNewPools } from "./onchain/getNetworkNetworksOnchainNewPools";
import { getNetworksOnchainDexes } from "./onchain/getNetworksOnchainDexes";
import { getNetworksOnchainNewPools } from "./onchain/getNetworksOnchainNewPools";
import { getOnchainCategories } from "./onchain/getOnchainCategories";

// Onchain - Networks & General
import { getOnchainNetworks } from "./onchain/getOnchainNetworks";
import { getPoolsNetworksOnchainInfo } from "./onchain/getPoolsNetworksOnchainInfo";
import { getPoolsNetworksOnchainTrades } from "./onchain/getPoolsNetworksOnchainTrades";
import { getPoolsOnchainCategories } from "./onchain/getPoolsOnchainCategories";
import { getPoolsOnchainMegafilter } from "./onchain/getPoolsOnchainMegafilter";

// Onchain - Pools
import { getPoolsOnchainTrendingSearch } from "./onchain/getPoolsOnchainTrendingSearch";
import { getSearchOnchainPools } from "./onchain/getSearchOnchainPools";
import { getTimeframePoolsNetworksOnchainOhlcv } from "./onchain/getTimeframePoolsNetworksOnchainOhlcv";
import { getTimeframeTokensNetworksOnchainOhlcv } from "./onchain/getTimeframeTokensNetworksOnchainOhlcv";
import { getTokensNetworksOnchainHoldersChart } from "./onchain/getTokensNetworksOnchainHoldersChart";

// Onchain - Tokens
import { getTokensNetworksOnchainInfo } from "./onchain/getTokensNetworksOnchainInfo";
import { getTokensNetworksOnchainPools } from "./onchain/getTokensNetworksOnchainPools";
import { getTokensNetworksOnchainTopHolders } from "./onchain/getTokensNetworksOnchainTopHolders";
import { getTokensNetworksOnchainTrades } from "./onchain/getTokensNetworksOnchainTrades";

import { getSimplePrice } from "./prices/getSimplePrice";
import { getSimpleTokenPrice } from "./prices/getSimpleTokenPrice";
// Shared
import { executeTool, getToolset } from "./shared";
// Utilities
import { getAssetPlatforms } from "./utilities/getAssetPlatforms";
import { getExchangesList as getUtilitiesExchangesList } from "./utilities/getExchangesList";
import { getNewCoinsList } from "./utilities/getNewCoinsList";
import { searchDocs } from "./utilities/searchDocs";

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
