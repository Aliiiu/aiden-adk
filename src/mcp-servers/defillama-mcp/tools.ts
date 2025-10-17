import { createTool, type BaseTool } from "@iqai/adk";
import { z } from "zod";
import {
	getChains,
	getProtocolData,
	getDexsData,
	getFeesAndRevenue,
	getStableCoin,
	getHistoricalChainTvl,
	getPricesCurrentCoins,
	getBatchHistorical,
	getBlockChainTimestamp,
	getChartCoins,
	getHistoricalPoolData,
	getHistoricalPricesByContractAddress,
	getLatestPoolData,
	getOptionsData,
	getPercentageCoins,
	getPricesFirstCoins,
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
			"Fetches TVL data for all DeFi chains and returns the top 20 chains sorted by TVL",
		parameters: z.object({
			order: z.enum(["asc", "desc"]).describe("Sort order for chains by TVL"),
		}),
		execute: async (args: { order: "asc" | "desc" }) => await getChains(args),
	},

	{
		name: "defillama_get_protocol_data",
		description:
			"Fetches TVL-related data for protocols. Can fetch all protocols or a specific protocol with change metrics",
		parameters: z.object({
			protocol: z
				.string()
				.optional()
				.describe("Specific protocol name to fetch"),
			sortCondition: z
				.enum(["change_1h", "change_1d", "change_7d", "tvl"])
				.describe("Field to sort by")
				.default("tvl"),
			order: z.enum(["asc", "desc"]).describe("Sort order").default("desc"),
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
			"Fetches historical TVL data for chains. Can retrieve data for all chains or a specific chain. Returns last 10 data points",
		parameters: z.object({
			chain: z.string().optional().describe("Specific chain name"),
		}),
		execute: async (args: { chain?: string }) =>
			await getHistoricalChainTvl(args),
	},

	// DEX Data
	{
		name: "defillama_get_dexs_data",
		description:
			"Fetches DEX volume data. Can retrieve overview data for all DEXs, DEXs on a specific chain, or a specific protocol",
		parameters: z.object({
			excludeTotalDataChart: z
				.boolean()
				.default(true)
				.describe("Exclude total data chart"),
			excludeTotalDataChartBreakdown: z
				.boolean()
				.default(true)
				.describe("Exclude chart breakdown"),
			chain: z
				.string()
				.optional()
				.describe("Filter by specific chain (slug from /overview/dexs)"),
			protocol: z
				.string()
				.optional()
				.describe("Filter by specific protocol slug"),
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
				.describe("Sort field"),
			order: z
				.enum(["asc", "desc"])
				.default("desc")
				.describe("Sort order"),
		}),
		execute: async (args: any) => await getDexsData(args),
	},

	// Fees & Revenue
	{
		name: "defillama_get_fees_and_revenue",
		description:
			"Fetches fees and revenue data from protocols. Supports filtering by chain or protocol with various revenue metrics",
		parameters: z.object({
			excludeTotalDataChart: z
				.boolean()
				.default(true)
				.describe("Exclude total data chart"),
			excludeTotalDataChartBreakdown: z
				.boolean()
				.default(true)
				.describe("Exclude chart breakdown"),
			dataType: z
				.enum(["dailyFees", "dailyRevenue", "dailyHoldersRevenue"])
				.default("dailyFees")
				.describe("Type of data to retrieve"),
			chain: z.string().optional().describe("Filter by chain"),
			protocol: z.string().optional().describe("Filter by protocol"),
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
				.describe("Sort field"),
			order: z.enum(["asc", "desc"]).describe("Sort order").default("desc"),
		}),
		execute: async (args: any) => await getFeesAndRevenue(args),
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
		execute: async () => await getStableCoinChains({}),
	},

	{
		name: "defillama_get_stablecoin_charts",
		description:
			"Fetches stablecoin market cap charts. Can filter by chain or stablecoin ID. Returns last 10 data points",
		parameters: z.object({
			chain: z.string().optional().describe("Filter by chain"),
			stablecoin: z
				.number()
				.int()
				.optional()
				.describe("Stablecoin ID from /stablecoins"),
		}),
		execute: async (args: { chain?: string; stablecoin?: number }) =>
			await getStableCoinCharts(args),
	},

	{
		name: "defillama_get_stablecoin_prices",
		description:
			"Fetches historical stablecoin price data. Returns last 3 data points",
		parameters: z.object({}),
		execute: async () => await getStableCoinPrices({}),
	},

	// Prices
	{
		name: "defillama_get_prices_current_coins",
		description: "Fetches current prices for specified coins from DefiLlama",
		parameters: z.object({
			coins: z
				.string()
				.describe(
					"Comma-separated list of coin identifiers (e.g., 'ethereum:0x...,bsc:0x...')",
				),
			searchWidth: optionalSearchWidthArg().describe(
				"Time range to find price data (e.g., '4h' or 600 seconds)",
			).default("4h"),
		}),
		execute: async (args: { coins: string; searchWidth?: string | number }) =>
			await getPricesCurrentCoins(args),
	},

	{
		name: "defillama_get_prices_first_coins",
		description: "Fetches the first recorded prices for specified coins",
		parameters: z.object({
			coins: z.string().describe("Comma-separated list of coin identifiers"),
		}),
		execute: async (args: { coins: string }) => await getPricesFirstCoins(args),
	},

	{
		name: "defillama_get_batch_historical",
		description: "Fetches historical price data for a batch of coins",
		parameters: z.object({
			coins: z
				.union([
					z.string().min(1),
					z.record(
						z.string(),
						z
							.array(z.union([z.number().int().nonnegative(), z.string().min(1)]))
							.min(1),
					),
				])
				.describe(
					"Either a pre-encoded coins query string or an object mapping {chain}:{address} to an array of timestamps",
				),
			searchWidth: optionalSearchWidthArg().describe(
				"Time range to find price data (e.g., '4h' or 600 seconds)",
			).default('6h'),
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
			"Fetches historical prices for coins at a specific timestamp by contract address",
		parameters: z.object({
			coins: z.string().describe("set of comma-separated tokens defined as {chain}:{address}. example: 'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1,bsc:0x762539b45a1dcce3d36d080f74d1aed37844b878"),
			timestamp: unixTimestampArg().describe(
				"Timestamp to query (Unix seconds or ISO 8601)",
			),
			searchWidth: optionalSearchWidthArg().describe(
				"Time range to find price data (e.g., '4h' or 600 seconds)",
			).default('6h'),
		}),
		execute: async (args: {
			coins: string;
			timestamp: number | string;
			searchWidth?: string | number;
		}) => await getHistoricalPricesByContractAddress(args),
	},

	{
		name: "defillama_get_percentage_coins",
		description:
			"Fetches percentage change data for specified coins over a time period",
		parameters: z.object({
			coins: z.string().describe("set of comma-separated tokens defined as {chain}:{address}. example: 'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1,bsc:0x762539b45a1dcce3d36d080f74d1aed37844b878,ethereum:0xdB25f211AB05b1c97D595516F45794528a807ad8'"),
			period: z
				.string()
				.optional()
				.default("1d")
				.describe("duration between data points. example: '1h', '8h', '2d'"),
			lookForward: z
				.boolean()
				.optional()
				.default(false)
				.describe("whether you want the duration after your given timestamp or not, defaults to false (looking back)"),
			timestamp: unixTimestampArg()
				.optional()
				.describe("timestamp (Unix seconds or ISO 8601) of data point requested, defaults to time now."),
		}),
		execute: async (args: any) => await getPercentageCoins(args),
	},

	{
		name: "defillama_get_chart_coins",
		description:
			"Fetches historical chart data for specified coins with customizable time range and span",
		parameters: z.object({
			coins: z.string().describe("set of comma-separated tokens defined as {chain}:{address}. example: 'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1,coingecko:ethereum,bsc:0x762539b45a1dcce3d36d080f74d1aed37844b878,ethereum:0xdB25f211AB05b1c97D595516F45794528a807ad8'"),
			start: unixTimestampArg()
				.optional()
				.describe("Unix timestamp in seconds for earliest data point"),
			end: unixTimestampArg()
				.optional()
				.describe("Unix timestamp in seconds for latest data point"),
			span: z
				.number()
				.int()
				.nonnegative()
				.optional()
				.describe("Number of data points requested (defaults to 0). example: 10"),
			period: z.string().optional().describe("duration between data points, defaults to 24 hours. example: '1h', '8h', '2d'"),
			searchWidth: optionalSearchWidthArg().describe(
				"time range on either side to find price data, defaults to 10% of period. example: '600' or '6h",
			).default('6h'),
		}),
		execute: async (args: any) => await getChartCoins(args),
	},

	// Yields
	{
		name: "defillama_get_historical_pool_data",
		description:
			"Fetches historical APY and TVL data for a specific yield pool. Returns last 10 data points",
		parameters: z.object({
			pool: z.string().describe("pool id, can be retrieved from /pools (property is called pool)"),
		}),
		execute: async (args: { pool: string }) =>
			await getHistoricalPoolData(args),
	},

	{
		name: "defillama_get_latest_pool_data",
		description:
			"Fetches latest yield pool data with sorting and limiting capabilities",
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
				.describe("Field to sort by"),
			order: z.enum(["asc", "desc"]).describe("Sort order").default("desc"),
			limit: z
				.number()
				.int()
				.min(1)
				.max(100)
				.default(10)
				.describe("Number of results to return (max 100)"),
		}),
		execute: async (args: {
			sortCondition: string;
			order: "asc" | "desc";
			limit: number;
		}) => await getLatestPoolData(args),
	},

	// Options
	{
		name: "defillama_get_options_data",
		description:
			"Fetches options protocol data including volume and premium data",
		parameters: z.object({
			sortCondition: z
				.enum([
					"total24h",
					"total7d",
					"total30d",
					"change_1d",
					"change_7d",
					"change_1m",
				])
				.describe("Sort field"),
			order: z.enum(["asc", "desc"]).describe("Sort order"),
			dataType: z
				.enum([
					"dailyPremiumVolume",
					"dailyNotionalVolume",
				])
				.default("dailyNotionalVolume")
				.describe("Data type to retrieve"),
			chain: z.string().optional().describe("chain name"),
			protocol: z.string().optional().describe("protocol slug"),
			excludeTotalDataChart: z
				.boolean()
				.default(true)
				.describe("true to exclude aggregated chart from response"),
			excludeTotalDataChartBreakdown: z
				.boolean()
				.default(true)
				.describe("true to exclude broken down chart from response"),
		}),
		execute: async (args: any) => await getOptionsData(args),
	},

	// Blockchain
	{
		name: "defillama_get_blockchain_timestamp",
		description:
			"Fetches blockchain block data for a specific chain and timestamp",
		parameters: z.object({
			chain: z.string().describe("Chain name"),
			timestamp: unixTimestampArg().describe(
				"Timestamp to query (Unix seconds or ISO 8601)",
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
