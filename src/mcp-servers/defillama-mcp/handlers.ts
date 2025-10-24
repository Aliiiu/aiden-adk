/**
 * DefiLlama API Handlers
 * Implementation of all DefiLlama API functions
 */

import { findProtocolSlug } from "./protocol-matcher";
import type {
	BatchHistoricalResponse,
	CacheEntry,
	ChainData,
	ChartResponse,
	CurrentPricesResponse,
	DexOverviewResponse,
	FeesOverviewResponse,
	FirstPricesResponse,
	HistoricalChainTvlItem,
	HistoricalPoolResponse,
	OptionsOverviewResponse,
	PercentageResponse,
	PoolsResponse,
	ProtocolData,
	StablecoinChainItem,
	StablecoinChartItem,
	StablecoinPriceItem,
	StablecoinsResponse,
} from "./types";

const BASE_URL = "https://api.llama.fi";
const COINS_URL = "https://coins.llama.fi";
const STABLECOINS_URL = "https://stablecoins.llama.fi";
const YIELDS_URL = "https://yields.llama.fi";
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new Map<string, CacheEntry>();

const getCachedData = async <T>(
	key: string,
	fetcher: () => Promise<T>,
	ttlMs: number = DEFAULT_CACHE_TTL_MS,
): Promise<T> => {
	const cached = cache.get(key);
	if (cached && cached.expiresAt > Date.now()) {
		return cached.data as T;
	}

	const data = await fetcher();
	cache.set(key, { data, expiresAt: Date.now() + ttlMs });
	return data;
};

/**
 * Helper function to convert timestamp inputs to Unix seconds
 */
const toUnixSeconds = (value: string | number): number => {
	if (typeof value === "number") {
		return Math.floor(value);
	}

	const trimmed = value.trim();
	if (/^\d+$/.test(trimmed)) {
		return Math.floor(Number(trimmed));
	}

	const parsed = Date.parse(trimmed);
	if (Number.isNaN(parsed)) {
		throw new Error(`Invalid timestamp value: ${value}`);
	}

	return Math.floor(parsed / 1000);
};

/**
 * Helper function to fetch data from API with type safety
 * Uses generics to ensure type safety throughout the codebase
 */
const fetchData = async <T>(url: string): Promise<T> => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`API request failed: ${response.statusText}`);
	}
	return (await response.json()) as T;
};

/**
 * Protocol & TVL Data
 */
export const getChains = async (args: {
	order: "asc" | "desc";
}): Promise<string> => {
	const data = await getCachedData<ChainData[]>("chains", () =>
		fetchData<ChainData[]>(`${BASE_URL}/v2/chains`),
	);

	const sorted = [...data].sort((a, b) => {
		return args.order === "asc" ? a.tvl - b.tvl : b.tvl - a.tvl;
	});
	const top20 = sorted.slice(0, 20).map((chain) => ({
		name: chain.name,
		tvl: chain.tvl,
	}));
	return JSON.stringify({
		topChainsChains: top20,
		totalChainsAvailable: data.length,
		note: "These are the top 20 chains. Chain names can be used in other defillama tools.",
	});
};

export const getProtocolData = async (args: {
	protocol?: string;
	sortCondition: "change_1h" | "change_1d" | "change_7d" | "tvl";
	order: "asc" | "desc";
}): Promise<string> => {
	if (args.protocol) {
		// Use Gemini cached input to find the correct protocol slug
		const matchedSlug = await findProtocolSlug(args.protocol);

		if (!matchedSlug) {
			return JSON.stringify({
				error: "Protocol not found",
				message: `Could not find a protocol matching "${args.protocol}". Please check the protocol name or try calling this tool without the protocol parameter to discover available protocols.`,
				suggestedProtocol: args.protocol,
			});
		}

		try {
			const data = await getCachedData(`protocol:${matchedSlug}`, () =>
				fetchData<ProtocolData>(`${BASE_URL}/protocol/${matchedSlug}`),
			);

			// Extract only essential fields to reduce response size
			const essentialData = {
				id: data.id,
				name: data.name,
				symbol: data.symbol,
				category: data.category,
				chains: data.chains,
				tvl: data.tvl,
				chainTvls: data.chainTvls,
				change_1h: data.change_1h,
				change_1d: data.change_1d,
				change_7d: data.change_7d,
				currentChainTvls: data.currentChainTvls,
				mcap: data.mcap,
			};

			return JSON.stringify({
				protocolInfo: essentialData,
				matchedSlug,
				originalQuery: args.protocol,
			});
		} catch (_error) {
			return JSON.stringify({
				error: "Failed to fetch protocol data",
				message: `Found matching slug "${matchedSlug}" for "${args.protocol}", but failed to fetch data from API.`,
				matchedSlug,
				originalQuery: args.protocol,
			});
		}
	}

	const data = await getCachedData<ProtocolData[]>("protocols", () =>
		fetchData<ProtocolData[]>(`${BASE_URL}/protocols`),
	);

	const sorted = [...data].sort((a, b) => {
		const aVal = a[args.sortCondition] || 0;
		const bVal = b[args.sortCondition] || 0;
		return args.order === "asc" ? aVal - bVal : bVal - aVal;
	});

	const top10 = sorted.slice(0, 10).map((protocol) => ({
		name: protocol.name,
		slug: protocol.symbol,
		tvl: protocol.tvl,
		chainTvls: protocol.chainTvls,
		change_1h: protocol.change_1h,
		change_1d: protocol.change_1d,
		change_7d: protocol.change_7d,
		currentChainTvls: protocol.currentChainTvls,
	}));

	return JSON.stringify({ protocolsData: top10 });
};

export const getHistoricalChainTvl = async (args: {
	chain?: string;
}): Promise<string> => {
	const url = args.chain
		? `${BASE_URL}/v2/historicalChainTvl/${args.chain}`
		: `${BASE_URL}/v2/historicalChainTvl`;

	const data = await fetchData<HistoricalChainTvlItem[]>(url);
	const last10 = data.slice(-10).map((item) => ({
		date: item.date,
		tvl: item.tvl,
	}));

	return JSON.stringify({ historicalChainInfo: last10 });
};

/**
 * DEX Data
 */
export const getDexsData = async (args: {
	excludeTotalDataChart?: boolean;
	excludeTotalDataChartBreakdown?: boolean;
	chain?: string;
	protocol?: string;
	sortCondition?: string;
	order?: "asc" | "desc";
}): Promise<string> => {
	const excludeTotalDataChart =
		args.excludeTotalDataChart !== undefined
			? args.excludeTotalDataChart
			: true;
	const excludeTotalDataChartBreakdown =
		args.excludeTotalDataChartBreakdown !== undefined
			? args.excludeTotalDataChartBreakdown
			: true;

	const params = new URLSearchParams({
		excludeTotalDataChart: String(excludeTotalDataChart),
		excludeTotalDataChartBreakdown: String(excludeTotalDataChartBreakdown),
	});

	if (args.protocol) {
		const url = `${BASE_URL}/summary/dexs/${args.protocol}?${params.toString()}`;
		const data = await fetchData<DexOverviewResponse>(url);
		return JSON.stringify({ protocolData: data });
	}

	const url = args.chain
		? `${BASE_URL}/overview/dexs/${args.chain}?${params.toString()}`
		: `${BASE_URL}/overview/dexs?${params.toString()}`;
	const data = await fetchData<DexOverviewResponse>(url);

	if (data.protocols) {
		const sortCondition = args.sortCondition || "total24h";
		const order = args.order || "desc";

		const sorted = data.protocols.sort((a, b) => {
			const aVal = (a[sortCondition as keyof typeof a] as number) || 0;
			const bVal = (b[sortCondition as keyof typeof b] as number) || 0;
			return order === "asc" ? aVal - bVal : bVal - aVal;
		});

		const top10 = sorted.slice(0, 10).map((protocol) => ({
			displayName: protocol.displayName,
			breakdown24h: protocol.breakdown24h,
			dailyVolume: protocol.dailyVolume,
			total24h: protocol.total24h,
			total7d: protocol.total7d,
			total30d: protocol.total30d,
			change_1d: protocol.change_1d,
			change_7d: protocol.change_7d,
			change_1m: protocol.change_1m,
		}));

		return JSON.stringify({
			protocolsData: top10,
			overallDexsChainVolumes: data.totalDataChart || [],
		});
	}

	return JSON.stringify(data);
};

/**
 * Fees & Revenue
 */
export const getFeesAndRevenue = async (args: {
	excludeTotalDataChart?: boolean;
	excludeTotalDataChartBreakdown?: boolean;
	dataType?: string;
	chain?: string;
	protocol?: string;
	sortCondition: string;
	order: "asc" | "desc";
}): Promise<string> => {
	const excludeTotalDataChart =
		args.excludeTotalDataChart !== undefined
			? args.excludeTotalDataChart
			: true;
	const excludeTotalDataChartBreakdown =
		args.excludeTotalDataChartBreakdown !== undefined
			? args.excludeTotalDataChartBreakdown
			: true;
	const dataType = args.dataType ?? "dailyFees";

	const params = new URLSearchParams({
		excludeTotalDataChart: String(excludeTotalDataChart),
		excludeTotalDataChartBreakdown: String(excludeTotalDataChartBreakdown),
		dataType,
	});

	if (args.protocol) {
		const url = `${BASE_URL}/summary/fees/${args.protocol}?${params.toString()}`;
		const data = await fetchData<FeesOverviewResponse>(url);

		return JSON.stringify({ data });
	} else if (args.chain) {
		const url = `${BASE_URL}/overview/fees/${args.chain}?${params.toString()}`;
		const data = await fetchData<FeesOverviewResponse>(url);
		return processFeesResponse(data, args);
	} else {
		const url = `${BASE_URL}/overview/fees?${params.toString()}`;
		const data = await fetchData<FeesOverviewResponse>(url);
		return processFeesResponse(data, args);
	}
};

const processFeesResponse = (
	data: FeesOverviewResponse,
	args: { sortCondition: string; order: "asc" | "desc" },
): string => {
	if (data.protocols) {
		const sorted = data.protocols.sort((a, b) => {
			const aVal = (a[args.sortCondition as keyof typeof a] as number) || 0;
			const bVal = (b[args.sortCondition as keyof typeof b] as number) || 0;
			return args.order === "asc" ? aVal - bVal : bVal - aVal;
		});

		const top10 = sorted.slice(0, 10).map((protocol) => ({
			name: protocol.name,
			change_1d: protocol.change_1d,
			change_7d: protocol.change_7d,
			change_1m: protocol.change_1m,
			dailyUserFees: protocol.dailyUserFees,
			dailyHoldersRevenue: protocol.dailyHoldersRevenue,
			dailySupplySideRevenue: protocol.dailySupplySideRevenue,
			holdersRevenue30d: protocol.holdersRevenue30d,
		}));

		return JSON.stringify({
			protocolsData: top10,
			overall: data.totalDataChart || [],
		});
	}

	return JSON.stringify({ data });
};

/**
 * Stablecoins
 */
export const getStableCoin = async (args: {
	includePrices?: boolean;
}): Promise<string> => {
	const includePrices = args.includePrices ?? false;
	const data = await fetchData<StablecoinsResponse>(
		`${STABLECOINS_URL}/stablecoins?includePrices=${includePrices}`,
	);

	const sorted = data.peggedAssets.sort(
		(a, b) => b.circulating.peggedUSD - a.circulating.peggedUSD,
	);

	const top20 = sorted.slice(0, 20).map((coin) => ({
		id: coin.id,
		name: coin.name,
		symbol: coin.symbol,
		circulating: coin.circulating,
		circulatingPrevDay: coin.circulatingPrevDay,
		circulatingPrevWeek: coin.circulatingPrevWeek,
		circulatingPrevMonth: coin.circulatingPrevMonth,
		price: coin.price,
	}));

	return JSON.stringify({ stableCoins: top20 });
};

export const getStableCoinChains = async (): Promise<string> => {
	const data = await fetchData<StablecoinChainItem[]>(
		`${STABLECOINS_URL}/stablecoinchains`,
	);

	const last3 = data.slice(-3).map((item) => ({
		chainName: item.name,
		mcapsum: item.totalCirculating.peggedUSD,
	}));

	return JSON.stringify({ historicalChainInfo: last3 });
};

export const getStableCoinCharts = async (args: {
	chain?: string;
	stablecoin?: number;
}): Promise<string> => {
	let url: string;
	const params = new URLSearchParams();

	if (args.stablecoin !== undefined) {
		params.append("stablecoin", args.stablecoin.toString());
	}

	if (args.chain) {
		url = `${STABLECOINS_URL}/stablecoincharts/${args.chain}`;
	} else {
		url = `${STABLECOINS_URL}/stablecoincharts/all`;
	}

	const data = await fetchData<StablecoinChartItem[]>(
		params.toString() ? `${url}?${params.toString()}` : url,
	);

	const last10 = data.slice(-10).map((item) => ({
		date: item.date,
		totalCirculatingPeggedUSD: item.totalCirculating.peggedUSD,
		totalUnreleased: item.totalUnreleased,
		totalCirculatingUSD: item.totalCirculatingUSD,
		totalMintedUSD: item.totalMintedUSD,
		totalBridgedToUSD: item.totalBridgedToUSD,
	}));

	return JSON.stringify({ data: last10 });
};

export const getStableCoinPrices = async (): Promise<string> => {
	const data = await fetchData<StablecoinPriceItem[]>(
		`${STABLECOINS_URL}/stablecoinprices`,
	);

	const last3 = data.slice(-3).map((item) => ({
		date: item.date,
		Prices: item.prices,
	}));

	return JSON.stringify({ historicalChainInfo: last3 });
};

/**
 * Prices
 */
export const getPricesCurrentCoins = async (args: {
	coins: string;
	searchWidth?: string | number;
}): Promise<string> => {
	const coinsSegment = encodeURIComponent(args.coins);
	const params = new URLSearchParams();

	if (args.searchWidth !== undefined) {
		params.append("searchWidth", String(args.searchWidth));
	}

	const url = `${COINS_URL}/prices/current/${coinsSegment}${
		params.toString() ? `?${params.toString()}` : ""
	}`;

	const data = await fetchData<CurrentPricesResponse>(url);
	return JSON.stringify({ data });
};

export const getPricesFirstCoins = async (args: {
	coins: string;
}): Promise<string> => {
	const url = `${COINS_URL}/prices/first/${args.coins}`;
	const data = await fetchData<FirstPricesResponse>(url);
	return JSON.stringify({ data });
};

export const getBatchHistorical = async (args: {
	coins: string;
	searchWidth?: string | number;
}): Promise<string> => {
	const params = new URLSearchParams({
		coins: args.coins,
	});

	if (args.searchWidth !== undefined) {
		params.append("searchWidth", String(args.searchWidth));
	}

	const url = `${COINS_URL}/batchHistorical?${params.toString()}`;

	const data = await fetchData<BatchHistoricalResponse>(url);
	return JSON.stringify({ data });
};

export const getHistoricalPricesByContractAddress = async (args: {
	coins: string;
	timestamp: string | number;
	searchWidth?: string | number;
}): Promise<string> => {
	const unixTime = toUnixSeconds(args.timestamp);
	const coinsSegment = encodeURIComponent(args.coins);
	const params = new URLSearchParams();

	if (args.searchWidth !== undefined) {
		params.append("searchWidth", String(args.searchWidth));
	}

	const url = `${COINS_URL}/prices/historical/${unixTime}/${coinsSegment}${
		params.toString() ? `?${params.toString()}` : ""
	}`;

	const data = await fetchData<CurrentPricesResponse>(url);
	return JSON.stringify({ data });
};

export const getPercentageCoins = async (args: {
	coins: string;
	period?: string;
	lookForward?: boolean;
	timestamp?: string | number;
}): Promise<string> => {
	const coinsSegment = encodeURIComponent(args.coins);
	const params = new URLSearchParams();

	if (args.period) params.append("period", args.period);
	if (args.lookForward) params.append("lookForward", "true");
	if (args.timestamp) {
		const unixTime = toUnixSeconds(args.timestamp);
		params.append("timestamp", unixTime.toString());
	}

	const url = `${COINS_URL}/percentage/${coinsSegment}${
		params.toString() ? `?${params.toString()}` : ""
	}`;
	const data = await fetchData<PercentageResponse>(url);
	return JSON.stringify({ data });
};

export const getChartCoins = async (args: {
	coins: string;
	start?: string | number;
	end?: string | number;
	span?: number;
	period?: string;
	searchWidth?: string | number;
}): Promise<string> => {
	let url = `${COINS_URL}/chart/${args.coins}`;
	const params = new URLSearchParams();

	if (args.start !== undefined) params.append("start", String(args.start));
	if (args.end !== undefined) params.append("end", String(args.end));
	if (args.span !== undefined) params.append("span", args.span.toString());
	if (args.period) params.append("period", args.period);
	if (args.searchWidth !== undefined)
		params.append("searchWidth", String(args.searchWidth));

	if (params.toString()) url += `?${params.toString()}`;

	const data = await fetchData<ChartResponse>(url);
	return JSON.stringify({ data });
};

/**
 * Yields
 */
export const getHistoricalPoolData = async (args: {
	pool: string;
}): Promise<string> => {
	const data = await fetchData<HistoricalPoolResponse>(
		`${YIELDS_URL}/chart/${args.pool}`,
	);

	const last10 = data.data.slice(-10).map((item) => ({
		timestamp: item.timestamp,
		tvlUsd: item.tvlUsd,
		apy: item.apy,
		apyBase: item.apyBase,
	}));

	return JSON.stringify({ data: last10 });
};

export const getLatestPoolData = async (args: {
	sortCondition: string;
	order: string;
	limit: number;
}): Promise<string> => {
	const data = await fetchData<PoolsResponse>(`${YIELDS_URL}/pools`);

	const sorted = data.data.sort((a, b) => {
		const aVal = (a[args.sortCondition as keyof typeof a] as number) || 0;
		const bVal = (b[args.sortCondition as keyof typeof b] as number) || 0;
		return args.order === "asc" ? aVal - bVal : bVal - aVal;
	});

	const limited = sorted.slice(0, args.limit).map((pool) => ({
		chain: pool.chain,
		project: pool.project,
		tvlUsd: pool.tvlUsd,
		apyPct1D: pool.apyPct1D,
		apyPct7D: pool.apyPct7D,
		apyPct30D: pool.apyPct30D,
		apy: pool.apy,
		predictions: pool.predictions,
	}));

	return JSON.stringify({ listOfPools: limited });
};

/**
 * Options
 */
export const getOptionsData = async (args: {
	sortCondition: string;
	order: "asc" | "desc";
	dataType: string;
	chain?: string;
	protocol?: string;
	excludeTotalDataChart?: boolean;
	excludeTotalDataChartBreakdown?: boolean;
}): Promise<string> => {
	const excludeTotalDataChart =
		args.excludeTotalDataChart !== undefined
			? args.excludeTotalDataChart
			: true;
	const excludeTotalDataChartBreakdown =
		args.excludeTotalDataChartBreakdown !== undefined
			? args.excludeTotalDataChartBreakdown
			: true;
	const dataType = args.dataType ?? "dailyNotionalVolume";

	const params = new URLSearchParams({
		excludeTotalDataChart: String(excludeTotalDataChart),
		excludeTotalDataChartBreakdown: String(excludeTotalDataChartBreakdown),
		dataType,
	});

	if (args.protocol) {
		const summaryParams = new URLSearchParams({
			dataType,
		});
		const url = `${BASE_URL}/summary/options/${args.protocol}?${summaryParams.toString()}`;
		const data = await fetchData<OptionsOverviewResponse>(url);

		return JSON.stringify({ data });
	} else if (args.chain) {
		const url = `${BASE_URL}/overview/options/${args.chain}?${params.toString()}`;
		const data = await fetchData<OptionsOverviewResponse>(url);
		return processOptionsResponse(data, args);
	} else {
		const url = `${BASE_URL}/overview/options?${params.toString()}`;
		const data = await fetchData<OptionsOverviewResponse>(url);
		return processOptionsResponse(data, args);
	}
};

const processOptionsResponse = (
	data: OptionsOverviewResponse,
	args: { sortCondition: string; order: "asc" | "desc" },
): string => {
	if (data.protocols) {
		const sorted = data.protocols.sort((a, b) => {
			const aVal = (a[args.sortCondition as keyof typeof a] as number) || 0;
			const bVal = (b[args.sortCondition as keyof typeof b] as number) || 0;
			return args.order === "asc" ? aVal - bVal : bVal - aVal;
		});

		return JSON.stringify({
			protocolsData: sorted.slice(0, 10),
			overall: data.totalDataChart || [],
		});
	}

	return JSON.stringify({ data });
};

/**
 * Blockchain
 */
export const getBlockChainTimestamp = async (args: {
	chain: string;
	timestamp: string | number;
}): Promise<string> => {
	const unixTime = toUnixSeconds(args.timestamp);
	const url = `${COINS_URL}/block/${args.chain}/${unixTime}`;

	const data = await fetchData(url);
	return JSON.stringify({ data });
};
