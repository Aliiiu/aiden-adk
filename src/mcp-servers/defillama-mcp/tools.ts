import { type BaseTool, createTool } from "@iqai/adk";
import { z } from "zod";
import {
	getBatchHistorical,
	getBlockChainTimestamp,
	getChains,
	getChartCoins,
	getDexsData,
	getFeesAndRevenue,
	getHistoricalChainTvl,
	getHistoricalPoolData,
	getHistoricalPricesByContractAddress,
	getLatestPoolData,
	getOptionsData,
	getPercentageCoins,
	getPricesCurrentCoins,
	getPricesFirstCoins,
	getProtocolData,
	getStableCoin,
	getStableCoinChains,
	getStableCoinCharts,
	getStableCoinPrices,
} from "./handlers";

const unixTimestampArg = () =>
	z.union([z.number().int().nonnegative(), z.string().min(1)]);

const optionalSearchWidthArg = () =>
	z.union([z.string().min(1), z.number().positive()]).optional();

/**
 * Tool definitions for FastMCP (MCP Server usage)
 * These are exported as plain objects with Zod schemas for FastMCP compatibility
 */
export const defillamaTools = [
	// Protocol & TVL Data
	{
		name: "defillama_get_chains",
		description:
			"Fetches blockchain chains ranked by Total Value Locked (TVL), returning the top 20. Use this tool to: (1) answer user queries about leading DeFi blockchains, or (2) discover valid chain name formats before calling other tools. The returned chain names (e.g., 'Ethereum', 'Arbitrum', 'Polygon') can be used directly in the 'chain' parameter of defillama_get_dexs_data, defillama_get_fees_and_revenue, and defillama_get_historical_chain_tvl",
		parameters: z.object({
			order: z
				.enum(["asc", "desc"])
				.default("desc")
				.describe(
					"Sort order by TVL. Use 'desc' (default) for highest TVL first (e.g., Ethereum, BSC, Tron), or 'asc' for lowest TVL first",
				),
		}),
		execute: async (args: { order: "asc" | "desc" }) => await getChains(args),
	},

	{
		name: "defillama_get_protocol_data",
		description:
			"Fetches TVL (Total Value Locked) data for DeFi protocols. **Two modes:** (1) WITH protocol parameter - returns detailed data for that specific protocol including all chains and historical data. (2) WITHOUT protocol parameter - returns top 10 protocols with basic info INCLUDING their slugs, which can be used as the protocol parameter in subsequent calls. Use mode (2) first when you need to discover the correct slug format for a user-mentioned protocol name",
		parameters: z.object({
			protocol: z
				.string()
				.optional()
				.describe(
					"Protocol slug in lowercase (e.g., 'aave', 'curve', 'lido'). **Discovery workflow:** If user mentions a protocol but you don't know the exact slug, call this tool WITHOUT this parameter to get a list containing protocol names and their corresponding slugs, then call again WITH the correct slug for detailed data",
				),
			sortCondition: z
				.enum(["change_1h", "change_1d", "change_7d", "tvl"])
				.default("tvl")
				.describe(
					"Field to sort results by. Only used when protocol parameter is omitted",
				),
			order: z
				.enum(["asc", "desc"])
				.default("desc")
				.describe("Sort order. Only used when protocol parameter is omitted"),
		}),
		execute: async (args: {
			protocol?: string;
			sortCondition: "change_1h" | "change_1d" | "change_7d" | "tvl";
			order: "asc" | "desc";
		}) => await getProtocolData(args),
	},

	{
		name: "defillama_get_historical_chain_tvl",
		description:
			"Fetches historical TVL (Total Value Locked) data for blockchain chains over time. Returns the last 10 data points showing TVL evolution. Can return data for a specific chain or aggregated data across all chains",
		parameters: z.object({
			chain: z
				.string()
				.optional()
				.describe(
					"Blockchain name to get historical TVL for (e.g., 'Ethereum', 'Arbitrum', 'Polygon', 'Avalanche'). **When the user mentions a specific blockchain, always call defillama_get_chains first** to discover the correct chain name format and ensure it's available. If omitted, returns aggregated historical TVL across all chains combined",
				),
		}),
		execute: async (args: { chain?: string }) =>
			await getHistoricalChainTvl(args),
	},

	// DEX Data
	{
		name: "defillama_get_dexs_data",
		description:
			"Fetches DEX (decentralized exchange) trading volume data and metrics. Returns different levels of data based on parameters: specific protocol data (most detailed), chain-specific overview, or global overview (all DEXs)",
		parameters: z.object({
			excludeTotalDataChart: z
				.boolean()
				.default(true)
				.describe("Whether to exclude total data chart from response"),
			excludeTotalDataChartBreakdown: z
				.boolean()
				.default(true)
				.describe("Whether to exclude chart breakdown from response"),
			protocol: z
				.string()
				.optional()
				.describe(
					"Protocol slug for a specific DEX (e.g., 'uniswap', 'pancakeswap', 'curve'). When provided, returns detailed data for that protocol only. If the user mentions a DEX name but you're unsure of the exact slug format, call defillama_get_protocol_data first to find the correct slug. Takes priority over chain parameter",
				),
			chain: z
				.string()
				.optional()
				.describe(
					"Blockchain name to filter DEXs by (e.g., 'Ethereum', 'BSC', 'Polygon', 'Arbitrum'). Returns overview of all DEXs operating on that chain. Only used when protocol is not specified. If the user mentions a chain but you're unsure of the exact name format, call defillama_get_chains first to discover valid chain names. If both protocol and chain are omitted, returns global overview of all DEXs",
				),
			sortCondition: z
				.enum([
					"total24h",
					"total7d",
					"total30d",
					"change_1d",
					"change_7d",
					"change_1m",
				])
				.default("total24h")
				.describe("Field to sort results by"),
			order: z
				.enum(["asc", "desc"])
				.default("desc")
				.describe("Sort order (ascending or descending)"),
		}),
		execute: async (args: {
			excludeTotalDataChart: boolean;
			excludeTotalDataChartBreakdown: boolean;
			protocol?: string;
			chain?: string;
			sortCondition:
				| "total24h"
				| "total7d"
				| "total30d"
				| "change_1d"
				| "change_7d"
				| "change_1m";
			order: "asc" | "desc";
		}) => await getDexsData(args),
	},

	// Fees & Revenue
	{
		name: "defillama_get_fees_and_revenue",
		description:
			"Fetches fees and revenue metrics for DeFi protocols. Can filter by specific protocol and/or chain",
		parameters: z.object({
			excludeTotalDataChart: z
				.boolean()
				.default(true)
				.describe("Whether to exclude total data chart"),
			excludeTotalDataChartBreakdown: z
				.boolean()
				.default(true)
				.describe("Whether to exclude chart breakdown"),
			dataType: z
				.enum(["dailyFees", "dailyRevenue", "dailyHoldersRevenue"])
				.default("dailyFees")
				.describe("Type of metric to retrieve"),
			chain: z
				.string()
				.optional()
				.describe(
					"Chain name (e.g., 'Ethereum', 'Polygon'). If omitted, includes all chains. Use defillama_get_chains to discover available chains",
				),
			protocol: z
				.string()
				.optional()
				.describe(
					"Protocol slug (e.g., 'uniswap'). If omitted, includes all protocols. Use defillama_get_protocol_data to discover valid slugs",
				),
			sortCondition: z
				.enum([
					"change_1d",
					"change_7d",
					"change_1m",
					"total24h",
					"total7d",
					"total30d",
					"dailyUserFees",
					"dailyHoldersRevenue",
					"dailySupplySideRevenue",
					"holdersRevenue30d",
				])
				.default("total24h")
				.describe("Field to sort results by"),
			order: z.enum(["asc", "desc"]).default("desc").describe("Sort order"),
		}),
		execute: async (args: {
			excludeTotalDataChart: boolean;
			excludeTotalDataChartBreakdown: boolean;
			dataType: "dailyFees" | "dailyRevenue" | "dailyHoldersRevenue";
			chain?: string;
			protocol?: string;
			sortCondition: string;
			order: "asc" | "desc";
		}) => await getFeesAndRevenue(args),
	},

	// Stablecoins
	{
		name: "defillama_get_stablecoin",
		description:
			"Fetches stablecoin data including circulation and price information. Returns top 20 stablecoins",
		parameters: z.object({
			includePrices: z
				.boolean()
				.optional()
				.describe("Whether to include price data"),
		}),
		execute: async (args: { includePrices?: boolean }) =>
			await getStableCoin(args),
	},

	{
		name: "defillama_get_stablecoin_chains",
		description:
			"Fetches stablecoin data by chains. Returns last 3 chains with market cap data",
		parameters: z.object({}),
		execute: async () => await getStableCoinChains(),
	},

	{
		name: "defillama_get_stablecoin_charts",
		description:
			"Fetches historical market cap charts for stablecoins over time. Returns the last 10 data points showing circulation, USD values, and bridged amounts. Can filter by blockchain or specific stablecoin, or show global aggregated data",
		parameters: z.object({
			stablecoin: z
				.number()
				.int()
				.optional()
				.describe(
					"Stablecoin ID to get data for a specific stablecoin (e.g., 1 for USDT, 2 for USDC). **IMPORTANT: This must be a numeric ID, not a name. If the user mentions a stablecoin by name (like 'USDC', 'Tether', 'DAI'), you must first call defillama_get_stablecoins to find the corresponding ID**. Can be combined with chain parameter to show that stablecoin's data on a specific chain",
				),
			chain: z
				.string()
				.optional()
				.describe(
					"Blockchain name to filter stablecoin data by (e.g., 'Ethereum', 'Polygon', 'Arbitrum'). Returns stablecoin market cap data for that specific chain. **If the user mentions a blockchain but you're unsure of the exact name format, call defillama_get_chains first to discover valid chain names**. If omitted, returns global aggregated data across all chains",
				),
		}),
		execute: async (args: { chain?: string; stablecoin?: number }) =>
			await getStableCoinCharts(args),
	},

	{
		name: "defillama_get_stablecoin_prices",
		description:
			"Fetches historical stablecoin price data. Returns last 3 data points",
		parameters: z.object({}),
		execute: async () => await getStableCoinPrices(),
	},

	// Prices
	{
		name: "defillama_get_prices_current_coins",
		description:
			"Fetches current token prices from DefiLlama. Requires token addresses in the format chain:address (e.g., 'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7' for USDT). Can fetch multiple tokens at once by comma-separating them",
		parameters: z.object({
			coins: z
				.string()
				.describe(
					"Comma-separated list of tokens in the format {chain}:{contractAddress}. Examples: 'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7' (single token), 'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7,bsc:0x55d398326f99059ff775485246999027b3197955' (multiple tokens). If the user mentions a token but you don't know its contract address, you may need to search for it first or ask the user. If unsure about the exact chain name format, call defillama_get_chains to see available chains (e.g., 'ethereum', 'bsc', 'polygon', 'arbitrum')",
				),
			searchWidth: z
				.union([z.string(), z.number()])
				.default("4h")
				.describe(
					"Time window to search for price data. Accepts duration strings (e.g., '4h', '1d', '30m') or seconds as a number (e.g., 600 for 10 minutes). Defaults to 4 hours. Use larger values if recent price data might not be available",
				),
		}),
		execute: async (args: { coins: string; searchWidth: string | number }) =>
			await getPricesCurrentCoins(args),
	},

	{
		name: "defillama_get_prices_first_coins",
		description:
			"Fetches the first recorded historical prices for specified cryptocurrency tokens. Useful for finding when a token was first listed/tracked or its initial price point",
		parameters: z.object({
			coins: z
				.string()
				.describe(
					"Comma-separated list of tokens in the format '{chain}:{tokenAddress}'. Each token must specify its blockchain and contract address. Examples: 'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7' (USDT), 'bsc:0x55d398326f99059ff775485246999027b3197955' (USDT on BSC), or multiple tokens: 'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7,ethereum:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'. Chain names must match exactly - if unsure about the correct chain name format, call defillama_get_chains first to discover valid chain names (e.g., 'ethereum' not 'Ethereum', 'bsc' not 'BSC'). Token addresses are checksummed contract addresses on the specified chain",
				),
		}),
		execute: async (args: { coins: string }) => await getPricesFirstCoins(args),
	},

	{
		name: "defillama_get_batch_historical",
		description:
			"Fetches historical price data for multiple cryptocurrencies at specific timestamps. Useful for getting prices of multiple coins at the same or different points in time",
		parameters: z.object({
			coins: z
				.union([
					z.string().min(1),
					z.record(
						z.string(),
						z
							.array(
								z.union([z.number().int().nonnegative(), z.string().min(1)]),
							)
							.min(1),
					),
				])
				.describe(
					"Coin identifiers with timestamps. Use object format: { 'chain:address': [timestamp1, timestamp2, ...] }. Examples: { 'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7': [1648680149] } for USDT on Ethereum, or { 'coingecko:bitcoin': [1648680149, 1648766549] } for Bitcoin at multiple times. Chain names should match format from defillama_get_chains (e.g., 'ethereum', 'bsc', 'polygon'). For well-known coins, use 'coingecko:' prefix with coin ID. Timestamps are Unix timestamps in seconds. If you're unsure about the correct chain:address format for a token, you may need to search for the token's contract address first",
				),
			searchWidth: z
				.union([z.string(), z.number()])
				.default("6h")
				.describe(
					"Time range around each timestamp to search for price data. Accepts duration strings (e.g., '4h', '1d', '30m') or seconds as a number (e.g., 600 for 10 minutes). Defaults to '6h' (6 hours). Wider ranges increase chances of finding data but may be less precise",
				),
		}),
		execute: async (args: {
			coins: string | Record<string, Array<number | string>>;
			searchWidth?: string | number;
		}) =>
			await getBatchHistorical({
				coins:
					typeof args.coins === "string"
						? args.coins
						: encodeURIComponent(JSON.stringify(args.coins)),
				searchWidth: args.searchWidth,
			}),
	},

	{
		name: "defillama_get_historical_prices_by_contract",
		description:
			"Fetches historical prices for tokens at a specific point in time using their contract addresses. Useful for getting price data at exact timestamps for analysis or backtesting",
		parameters: z.object({
			coins: z
				.string()
				.describe(
					"Comma-separated list of tokens in format '{chain}:{contractAddress}'. Each token must specify its blockchain and contract address. Examples: 'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1' (single token) or 'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1,bsc:0x762539b45a1dcce3d36d080f74d1aed37844b878' (multiple tokens). **IMPORTANT: If user mentions a chain name, call defillama_get_chains first to get the correct chain identifier. For contract addresses, ensure you have the exact address for the token on that specific chain**",
				),
			timestamp: unixTimestampArg().describe(
				"Point in time to query prices for. Accepts Unix timestamp (seconds) or ISO 8601 format (e.g., '2024-01-15T12:00:00Z'). Example: 1705320000 or '2024-01-15T12:00:00Z'",
			),
			searchWidth: optionalSearchWidthArg()
				.default("6h")
				.describe(
					"Time window to search for price data around the timestamp if exact data unavailable. Accepts duration string (e.g., '4h', '1d') or seconds (e.g., 600). Defaults to 6 hours. Larger windows increase chances of finding data but may be less accurate",
				),
		}),
		execute: async (args: {
			coins: string;
			timestamp: number | string;
			searchWidth: string | number;
		}) => await getHistoricalPricesByContractAddress(args),
	},

	{
		name: "defillama_get_percentage_coins",
		description:
			"Fetches percentage price change for tokens over a specified time period. Calculates how much token prices changed from a starting point, either looking backward (default) or forward in time",
		parameters: z.object({
			coins: z
				.string()
				.describe(
					"Comma-separated list of tokens in format '{chain}:{contractAddress}'. Each token must specify its blockchain and contract address. Examples: 'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1' (single token) or 'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1,bsc:0x762539b45a1dcce3d36d080f74d1aed37844b878,ethereum:0xdB25f211AB05b1c97D595516F45794528a807ad8' (multiple tokens). **IMPORTANT: If user mentions a chain name, call defillama_get_chains first to get the correct chain identifier. For contract addresses, ensure you have the exact address for the token on that specific chain**",
				),
			timestamp: unixTimestampArg()
				.optional()
				.describe(
					"Starting point in time for percentage calculation. Accepts Unix timestamp (seconds) or ISO 8601 format. If omitted, uses current time. Examples: 1705320000 or '2024-01-15T12:00:00Z'",
				),
			period: z
				.string()
				.default("1d")
				.describe(
					"Time period over which to calculate percentage change. Format: number + unit (h=hours, d=days). Examples: '1h' (1 hour), '8h' (8 hours), '2d' (2 days), '7d' (7 days). Defaults to '1d' (24 hours)",
				),
			lookForward: z
				.boolean()
				.default(false)
				.describe(
					"Direction to calculate change. If false (default), calculates change from [timestamp - period] to [timestamp] (looking backward). If true, calculates change from [timestamp] to [timestamp + period] (looking forward). Use true for historical predictions/projections",
				),
		}),
		execute: async (args: {
			coins: string;
			timestamp?: string | number;
			period: string;
			lookForward: boolean;
		}) => await getPercentageCoins(args),
	},

	{
		name: "defillama_get_chart_coins",
		description:
			"Fetches historical price chart data for one or more cryptocurrency tokens across different blockchains. Returns time-series price data with customizable time range and data point frequency",
		parameters: z.object({
			coins: z
				.string()
				.describe(
					"Comma-separated list of tokens in the format '{chain}:{contractAddress}'. Each token must be specified with its blockchain and contract address. Examples: 'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1' (single token), 'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1,bsc:0x762539b45a1dcce3d36d080f74d1aed37844b878' (multiple tokens). You can also use CoinGecko IDs like 'coingecko:ethereum'. If you don't know the contract address for a token, search for it first using other available tools or use the CoinGecko ID format",
				),
			start: unixTimestampArg()
				.optional()
				.describe(
					"Unix timestamp (in seconds) for the earliest data point. If omitted, defaults to earliest available data. Example: 1640995200 (Jan 1, 2022)",
				),
			end: unixTimestampArg()
				.optional()
				.describe(
					"Unix timestamp (in seconds) for the latest data point. If omitted, defaults to current time. Example: 1672531200 (Jan 1, 2023)",
				),
			span: z
				.number()
				.int()
				.nonnegative()
				.optional()
				.describe(
					"Number of data points to return in the chart. Higher values provide more granular data. If omitted, returns all available points within the time range. Example: 10 returns 10 evenly-spaced data points",
				),
			period: z
				.string()
				.optional()
				.describe(
					"Time interval between data points. Determines chart granularity. Format: number + unit (h for hours, d for days). Examples: '1h' (hourly data), '8h' (every 8 hours), '1d' (daily data), '7d' (weekly data). If omitted, defaults to 24 hours (daily)",
				),
			searchWidth: optionalSearchWidthArg()
				.default("6h")
				.describe(
					"Time window for finding price data around each period point. Can be specified as seconds (number) or duration string. Wider search windows are more forgiving but may be less precise. Examples: '600' (10 minutes), '6h' (6 hours). Defaults to 6 hours",
				),
		}),
		execute: async (args: {
			coins: string;
			start?: number;
			end?: number;
			span?: number;
			period?: string;
			searchWidth: string | number;
		}) => await getChartCoins(args),
	},

	// Yields
	{
		name: "defillama_get_latest_pool_data",
		description:
			"Fetches current yield farming pool data including APY rates, TVL, and rewards. Returns a list of pools that can be filtered and sorted by various metrics",
		parameters: z.object({
			sortCondition: z
				.enum([
					"tvlUsd",
					"apy",
					"apyBase",
					"apyReward",
					"apyPct1D",
					"apyPct7D",
					"apyPct30D",
					"apyMean30d",
				])
				.default("tvlUsd")
				.describe(
					"Field to sort results by (e.g., tvlUsd for total value locked, apy for annual percentage yield)",
				),
			order: z
				.enum(["asc", "desc"])
				.default("desc")
				.describe("Sort order (ascending or descending)"),
			limit: z
				.number()
				.int()
				.min(1)
				.max(100)
				.default(10)
				.describe("Number of pools to return (between 1-100)"),
		}),
		execute: async (args: {
			sortCondition:
				| "tvlUsd"
				| "apy"
				| "apyBase"
				| "apyReward"
				| "apyPct1D"
				| "apyPct7D"
				| "apyPct30D"
				| "apyMean30d";
			order: "asc" | "desc";
			limit: number;
		}) => await getLatestPoolData(args),
	},

	{
		name: "defillama_get_historical_pool_data",
		description:
			"Fetches historical APY and TVL data for a specific yield farming pool over time. Returns the last 10 data points showing how the pool's metrics have changed",
		parameters: z.object({
			pool: z
				.string()
				.describe(
					"Unique pool identifier (UUID format). **IMPORTANT: Always call defillama_get_latest_pool_data first** to discover available pools and their IDs. The pool ID is returned in the 'pool' property of each result (e.g., '742c4e8f-1f3d-4c3e-9c1e-2a3b4c5d6e7f')",
				),
		}),
		execute: async (args: { pool: string }) =>
			await getHistoricalPoolData(args),
	},

	// Options
	{
		name: "defillama_get_options_data",
		description:
			"Fetches options protocol data including trading volume and premium metrics. Returns different levels of data: specific protocol data (most detailed), chain-specific overview, or global overview (all options protocols)",
		parameters: z.object({
			dataType: z
				.enum(["dailyPremiumVolume", "dailyNotionalVolume"])
				.default("dailyNotionalVolume")
				.describe(
					"Type of volume data to retrieve: premium volume (actual premiums paid) or notional volume (value of underlying assets)",
				),
			protocol: z
				.string()
				.optional()
				.describe(
					"Protocol slug for a specific options protocol (e.g., 'lyra', 'hegic', 'opyn'). When provided, returns detailed data for that protocol only. If the user mentions an options protocol name but you're unsure of the exact slug format, call defillama_get_protocol_data first to find the correct slug. Takes priority over chain parameter",
				),
			chain: z
				.string()
				.optional()
				.describe(
					"Blockchain name to filter options protocols by (e.g., 'Ethereum', 'Arbitrum', 'Optimism'). Returns overview of all options protocols operating on that chain. Only used when protocol is not specified. If the user mentions a chain but you're unsure of the exact name format, call defillama_get_chains first to discover valid chain names. If both protocol and chain are omitted, returns global overview of all options protocols",
				),
			sortCondition: z
				.enum([
					"total24h",
					"total7d",
					"total30d",
					"change_1d",
					"change_7d",
					"change_1m",
				])
				.default("total24h")
				.describe("Field to sort results by"),
			order: z
				.enum(["asc", "desc"])
				.default("desc")
				.describe("Sort order (ascending or descending)"),
			excludeTotalDataChart: z
				.boolean()
				.default(true)
				.describe("Whether to exclude aggregated chart data from response"),
			excludeTotalDataChartBreakdown: z
				.boolean()
				.default(true)
				.describe("Whether to exclude broken down chart data from response"),
		}),
		execute: async (args: {
			dataType: "dailyPremiumVolume" | "dailyNotionalVolume";
			protocol?: string;
			chain?: string;
			sortCondition:
				| "total24h"
				| "total7d"
				| "total30d"
				| "change_1d"
				| "change_7d"
				| "change_1m";
			order: "asc" | "desc";
			excludeTotalDataChart: boolean;
			excludeTotalDataChartBreakdown: boolean;
		}) => await getOptionsData(args),
	},

	// Blockchain
	{
		name: "defillama_get_blockchain_timestamp",
		description:
			"Fetches blockchain block information for a specific chain at a given timestamp. Returns the block number, timestamp, and height that existed at that point in time. This is essential for historical DeFi queries - many blockchain APIs require a specific block number to retrieve historical state (e.g., 'What was the TVL on date X?' requires knowing which block number corresponded to date X). Use this tool to convert human-readable dates into block numbers",
		parameters: z.object({
			chain: z
				.string()
				.describe(
					"Blockchain name (e.g., 'Ethereum', 'Polygon', 'Arbitrum', 'Avalanche'). If the user mentions a blockchain but you're unsure of the exact name format, call defillama_get_chains first to discover the correct chain name",
				),
			timestamp: unixTimestampArg().describe(
				"Time to query block data for. Accepts both Unix timestamp in seconds (e.g., 1640000000) or ISO 8601 date string (e.g., '2024-01-15T10:30:00Z', '2024-01-15'). Relative dates work too - the converter will handle them. Will be automatically converted to Unix timestamp for the API call",
			),
		}),
		execute: async (args: { chain: string; timestamp: number | string }) =>
			await getBlockChainTimestamp(args),
	},
] as const;

/**
 * Get all DefiLlama tools as ADK BaseTool instances
 * Use this function when integrating with ADK agents
 */
export const getDefillamaTools = (): BaseTool[] => {
	return defillamaTools.map((tool: any) =>
		createTool({
			name: tool.name,
			description: tool.description,
			schema: tool.parameters,
			fn: tool.execute,
		}),
	);
};
