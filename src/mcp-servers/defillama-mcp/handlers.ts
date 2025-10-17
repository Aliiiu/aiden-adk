/**
 * DefiLlama API Handlers
 * Implementation of all DefiLlama API functions
 */

const BASE_URL = "https://api.llama.fi";
const COINS_URL = "https://coins.llama.fi";
const BRIDGES_URL = "https://bridges.llama.fi";
const STABLECOINS_URL = "https://stablecoins.llama.fi";
const YIELDS_URL = "https://yields.llama.fi";

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
 * Helper function to fetch data from API
 */
const fetchData = async (url: string): Promise<any> => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`API request failed: ${response.statusText}`);
	}
	return await response.json();
};

/**
 * Protocol & TVL Data
 */
export const getChains = async (args: {
	order: "asc" | "desc";
}): Promise<string> => {
	const data = await fetchData(`${BASE_URL}/v2/chains`);
	const sorted = data.sort((a: any, b: any) => {
		return args.order === "asc" ? a.tvl - b.tvl : b.tvl - a.tvl;
	});
	const top20 = sorted.slice(0, 20).map((chain: any) => ({
		name: chain.name,
		tvl: chain.tvl,
	}));
	return JSON.stringify({ topChainsChains: top20 });
};

export const getProtocolData = async (args: {
	protocol?: string;
	sortCondition: "change_1h" | "change_1d" | "change_7d" | "tvl";
	order: "asc" | "desc";
}): Promise<string> => {
	if (args.protocol) {
		const data = await fetchData(`${BASE_URL}/protocol/${args.protocol}`);
		return JSON.stringify({ protocolInfo: data });
	}

	const data = await fetchData(`${BASE_URL}/protocols`);
	const sorted = data.sort((a: any, b: any) => {
		const aVal = a[args.sortCondition] || 0;
		const bVal = b[args.sortCondition] || 0;
		return args.order === "asc" ? aVal - bVal : bVal - aVal;
	});

	const top10 = sorted.slice(0, 10).map((protocol: any) => ({
		name: protocol.name,
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

	const data = await fetchData(url);
	const last10 = data.slice(-10).map((item: any) => ({
		date: item.date,
		tvl: item.tvl,
	}));

	return JSON.stringify({ histoticalChainInfo: last10 });
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
		args.excludeTotalDataChart !== undefined ? args.excludeTotalDataChart : true;
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
		const data = await fetchData(url);
		return JSON.stringify({ protocolData: data });
	}

	const url = args.chain
		? `${BASE_URL}/overview/dexs/${args.chain}?${params.toString()}`
		: `${BASE_URL}/overview/dexs?${params.toString()}`;
	const data = await fetchData(url);

	if (data.protocols) {
		const sortCondition = args.sortCondition || "total24h";
		const order = args.order || "desc";

		const sorted = data.protocols.sort((a: any, b: any) => {
			const aVal = a[sortCondition] || 0;
			const bVal = b[sortCondition] || 0;
			return order === "asc" ? aVal - bVal : bVal - aVal;
		});

		const top10 = sorted.slice(0, 10).map((protocol: any) => ({
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
		args.excludeTotalDataChart !== undefined ? args.excludeTotalDataChart : true;
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
		const data = await fetchData(url);

		return JSON.stringify({ data });
	} else if (args.chain) {
		const url = `${BASE_URL}/overview/fees/${args.chain}?${params.toString()}`;
		const data = await fetchData(url);
		return processFeesResponse(data, args);
	} else {
		const url = `${BASE_URL}/overview/fees?${params.toString()}`;
		const data = await fetchData(url);
		return processFeesResponse(data, args);
	}
};

const processFeesResponse = (
	data: any,
	args: { sortCondition: string; order: "asc" | "desc" },
): string => {
	if (data.protocols) {
		const sorted = data.protocols.sort((a: any, b: any) => {
			const aVal = a[args.sortCondition] || 0;
			const bVal = b[args.sortCondition] || 0;
			return args.order === "asc" ? aVal - bVal : bVal - aVal;
		});

		const top10 = sorted.slice(0, 10).map((protocol: any) => ({
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
			ProtocolsData: top10,
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
	const data = await fetchData(
		`${STABLECOINS_URL}/stablecoins?includePrices=${includePrices}`,
	);

	const sorted = data.peggedAssets.sort(
		(a: any, b: any) => b.circulating.peggedUSD - a.circulating.peggedUSD,
	);

	const top20 = sorted.slice(0, 20).map((coin: any) => ({
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

export const getStableCoinChains = async (args: any): Promise<string> => {
	const data = await fetchData(`${STABLECOINS_URL}/stablecoinchains`);

	const last3 = data.slice(-3).map((item: any) => ({
		chainName: Object.keys(item)[0],
		mcapsum: Object.values(item)[0],
	}));

	return JSON.stringify({ histoticalChainInfo: last3 });
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

	const data = await fetchData(
		params.toString() ? `${url}?${params.toString()}` : url,
	);

	const last10 = data.slice(-10).map((item: any) => ({
		date: item.date,
		totalCirculating: item.totalCirculating,
		totalUnreleased: item.totalUnreleased,
		totalCirculatingUSD: item.totalCirculatingUSD,
		totalMintedUSD: item.totalMintedUSD,
		totalBridgedToUSD: item.totalBridgedToUSD,
	}));

	return JSON.stringify({ data: last10 });
};

export const getStableCoinPrices = async (args: any): Promise<string> => {
	const data = await fetchData(`${STABLECOINS_URL}/stablecoinprices`);

	const last3 = data.slice(-3).map((item: any) => ({
		date: item.date,
		Prices: item.prices,
	}));

	return JSON.stringify({ histoticalChainInfo: last3 });
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

	const data = await fetchData(url);
	return JSON.stringify({ url, data });
};

export const getPricesFirstCoins = async (args: {
	coins: string;
}): Promise<string> => {
	const url = `${COINS_URL}/prices/first/${args.coins}`;
	const data = await fetchData(url);
	return JSON.stringify({ url, data });
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

	const data = await fetchData(url);
	return JSON.stringify({ url, data });
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

	const data = await fetchData(url);
	return JSON.stringify({ url, data });
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
	const data = await fetchData(url);
	return JSON.stringify({ url, data });
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

	const data = await fetchData(url);
	return JSON.stringify({ url, data });
};

/**
 * Yields
 */
export const getHistoricalPoolData = async (args: {
	pool: string;
}): Promise<string> => {
	const data = await fetchData(`${YIELDS_URL}/chart/${args.pool}`);

	const last10 = data.data.slice(-10).map((item: any) => ({
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
	const data = await fetchData(`${YIELDS_URL}/pools`);

	const sorted = data.data.sort((a: any, b: any) => {
		const aVal = a[args.sortCondition] || 0;
		const bVal = b[args.sortCondition] || 0;
		return args.order === "asc" ? aVal - bVal : bVal - aVal;
	});

	const limited = sorted.slice(0, args.limit).map((pool: any) => ({
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
		args.excludeTotalDataChart !== undefined ? args.excludeTotalDataChart : true;
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
		const data = await fetchData(url);

		return JSON.stringify({ data });
	} else if (args.chain) {
		const url = `${BASE_URL}/overview/options/${args.chain}?${params.toString()}`;
		const data = await fetchData(url);
		return processOptionsResponse(data, args);
	} else {
		const url = `${BASE_URL}/overview/options?${params.toString()}`;
		const data = await fetchData(url);
		return processOptionsResponse(data, args);
	}
};

const processOptionsResponse = (
	data: any,
	args: { sortCondition: string; order: "asc" | "desc" },
): string => {
	if (data.protocols) {
		const sorted = data.protocols.sort((a: any, b: any) => {
			const aVal = a[args.sortCondition] || 0;
			const bVal = b[args.sortCondition] || 0;
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
	return JSON.stringify({ url, data });
};
