import { createTool, type BaseTool } from "@iqai/adk";
import { z } from "zod";
import {
	getChains,
	getProtocolData,
	getDexsData,
	getFeesAndRevenue,
	getStableCoin,
	getBridgeVolume,
	getHistoricalChainTvl,
	getPricesCurrentCoins,
	getAllTransactions,
	getBatchHistorical,
	getBlockChainTimestamp,
	getBridgeDayStats,
	getBridgeTotalVolume,
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
	listAllBridges,
} from "./handlers";

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
				.describe("Field to sort by"),
			order: z.enum(["asc", "desc"]).describe("Sort order"),
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
				.optional()
				.default(true)
				.describe("Exclude total data chart"),
			excludeTotalDataChartBreakdown: z
				.boolean()
				.optional()
				.default(true)
				.describe("Exclude chart breakdown"),
			chain: z.string().optional().describe("Filter by specific chain"),
			protocol: z.string().optional().describe("Filter by specific protocol"),
			sortCondition: z
				.enum([
					"total24h",
					"total7d",
					"total30d",
					"change_1d",
					"change_7d",
					"change_1m",
				])
				.optional()
				.default("total24h")
				.describe("Sort field"),
			order: z
				.enum(["asc", "desc"])
				.optional()
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
				.optional()
				.describe("Exclude total data chart"),
			excludeTotalDataChartBreakdown: z
				.boolean()
				.optional()
				.describe("Exclude chart breakdown"),
			dataType: z
				.string()
				.default("dailyFees")
				.describe("Type of data to retrieve"),
			chain: z.string().optional().describe("Filter by chain"),
			protocol: z.string().optional().describe("Filter by protocol"),
			sortCondition: z
				.enum([
					"change_1d",
					"change_7d",
					"change_1m",
					"dailyUserFees",
					"dailyHoldersRevenue",
					"dailySupplySideRevenue",
					"holdersRevenue30d",
				])
				.describe("Sort field"),
			order: z.enum(["asc", "desc"]).describe("Sort order"),
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
			stablecoinId: z.number().optional().describe("Filter by stablecoin ID"),
		}),
		execute: async (args: { chain?: string; stablecoinId?: number }) =>
			await getStableCoinCharts(args),
	},

	{
		name: "defillama_get_stablecoin_prices",
		description:
			"Fetches historical stablecoin price data. Returns last 3 data points",
		parameters: z.object({}),
		execute: async () => await getStableCoinPrices({}),
	},

	// Bridges
	{
		name: "defillama_get_bridge_volume",
		description:
			"Fetches bridge volume data for a specific chain. Returns last 10 data points with timestamps in ISO format",
		parameters: z.object({
			id: z.string().optional().describe("Bridge ID"),
			chain: z.string().describe("Chain name"),
		}),
		execute: async (args: { id?: string; chain: string }) =>
			await getBridgeVolume(args),
	},

	{
		name: "defillama_get_all_transactions",
		description:
			"Fetches all transactions for a given bridge ID with optional filtering by time range and chain",
		parameters: z.object({
			id: z.string().describe("Bridge ID"),
			limit: z.number().optional().describe("Limit number of results (max 10)"),
			address: z.string().optional().describe("Filter by address"),
			sourcechain: z.string().optional().describe("Filter by source chain"),
			starttimestamp: z
				.string()
				.optional()
				.describe("Start timestamp in ISO format"),
			endtimestamp: z
				.string()
				.optional()
				.describe("End timestamp in ISO format"),
		}),
		execute: async (args: any) => await getAllTransactions(args),
	},

	{
		name: "defillama_get_bridge_day_stats",
		description: "Fetches bridge statistics for a specific day and chain",
		parameters: z.object({
			timestamp: z.string().describe("Timestamp in ISO format"),
			chain: z.string().describe("Chain name"),
			id: z.string().optional().describe("Bridge ID"),
		}),
		execute: async (args: { timestamp: string; chain: string; id?: string }) =>
			await getBridgeDayStats(args),
	},

	{
		name: "defillama_get_bridge_total_volume",
		description:
			"Calculates total volume for all bridges for a specified time period",
		parameters: z.object({
			timePeriod: z
				.string()
				.describe(
					"Time period key (e.g., 'volumePrevDay', 'weeklyVolume', 'monthlyVolume')",
				),
		}),
		execute: async (args: { timePeriod: string }) =>
			await getBridgeTotalVolume(args),
	},

	{
		name: "defillama_list_all_bridges",
		description:
			"Lists all bridges with optional chain data and custom sorting",
		parameters: z.object({
			order: z.enum(["asc", "desc"]).describe("Sort order"),
			includeChains: z
				.boolean()
				.optional()
				.default(true)
				.describe("Include chain breakdown"),
			sortConditions: z
				.enum([
					"volumePrevDay",
					"volumePre2Day",
					"weeklyVolume",
					"monthlyVolume",
					"lastHourVolume",
					"currentDayVolume",
					"lastDailyVolume",
					"dayBeforeLastVolume",
				])
				.describe("Sort field"),
		}),
		execute: async (args: any) => await listAllBridges(args),
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
			searchWidth: z.string().optional().describe("Search width parameter"),
		}),
		execute: async (args: { coins: string; searchWidth?: string }) =>
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
			coins: z.string().describe("Comma-separated list of coin identifiers"),
			searchWidth: z.string().optional().describe("Search width parameter"),
		}),
		execute: async (args: { coins: string; searchWidth?: string }) =>
			await getBatchHistorical(args),
	},

	{
		name: "defillama_get_historical_prices_by_contract",
		description:
			"Fetches historical prices for coins at a specific timestamp by contract address",
		parameters: z.object({
			coins: z.string().describe("Comma-separated list of coin identifiers"),
			timestamp: z.string().describe("Timestamp in ISO format"),
			searchWidth: z.string().optional().describe("Search width parameter"),
		}),
		execute: async (args: {
			coins: string;
			timestamp: string;
			searchWidth?: string;
		}) => await getHistoricalPricesByContractAddress(args),
	},

	{
		name: "defillama_get_percentage_coins",
		description:
			"Fetches percentage change data for specified coins over a time period",
		parameters: z.object({
			coins: z.string().describe("Comma-separated list of coin identifiers"),
			period: z
				.string()
				.optional()
				.default("1d")
				.describe("Time period for percentage calculation"),
			lookForward: z
				.boolean()
				.optional()
				.default(false)
				.describe("Look forward in time"),
			timestamp: z
				.union([z.string(), z.number()])
				.optional()
				.describe("Reference timestamp (ISO format or Unix)"),
		}),
		execute: async (args: any) => await getPercentageCoins(args),
	},

	{
		name: "defillama_get_chart_coins",
		description:
			"Fetches historical chart data for specified coins with customizable time range and span",
		parameters: z.object({
			coins: z.string().describe("set of comma-separated tokens defined as {chain}:{address}. example: 'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1,coingecko:ethereum,bsc:0x762539b45a1dcce3d36d080f74d1aed37844b878,ethereum:0xdB25f211AB05b1c97D595516F45794528a807ad8'"),
			start: z.string().optional().describe("unix timestamp of earliest data point requested"),
			end: z.string().optional().describe("unix timestamp of latest data point requested"),
			span: z.number().optional().describe("number of data points returned, defaults to 0. example: 10"),
			period: z.string().optional().describe("duration between data points, defaults to 24 hours. example: '1h', '8h', '2d'"),
			searchWidth: z.string().optional().describe("time range on either side to find price data, defaults to 10% of period. example: '600"),
		}),
		execute: async (args: any) => await getChartCoins(args),
	},

	// Yields
	{
		name: "defillama_get_historical_pool_data",
		description:
			"Fetches historical APY and TVL data for a specific yield pool. Returns last 10 data points",
		parameters: z.object({
			pool: z.string().describe("Pool identifier"),
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
				.string()
				.describe("Field to sort by (e.g., 'tvlUsd', 'apy')"),
			order: z.string().describe("Sort order ('asc' or 'desc')"),
			limit: z.number().describe("Number of results to return"),
		}),
		execute: async (args: {
			sortCondition: string;
			order: string;
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
				.optional()
				.default("dailyNotionalVolume")
				.describe("Data type to retrieve"),
			chain: z.string().optional().describe("chain name"),
			protocol: z.string().optional().describe("protocol slug"),
			excludeTotalDataChart: z
				.boolean()
				.describe("Exclude total chart"),
			excludeTotalDataChartBreakdown: z
				.boolean()
				.describe("Exclude chart breakdown"),
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
			timestamp: z.string().describe("Timestamp in ISO format"),
		}),
		execute: async (args: { chain: string; timestamp: string }) =>
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
