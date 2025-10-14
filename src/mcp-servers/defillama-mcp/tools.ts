import { createTool, type BaseTool } from "@iqai/adk";
import { z } from "zod";
import {
	getChains,
	getProtocolData,
	getDexsData,
	getFeesAndRevenue,
	getHistoricalChainTvl,
} from "./handlers";

/**
 * Get all DefiLlama MCP tools
 */
export const getDefillamaTools = (): BaseTool[] => {
	return [
		// Protocol & TVL Data
		createTool({
			name: "defillama_get_chains",
			description:
				"Fetches TVL data for all DeFi chains and returns the top 20 chains sorted by TVL",
			schema: z.object({
				order: z
					.enum(["asc", "desc"])
					.describe("Sort order for chains by TVL"),
			}),
			fn: async (args) => await getChains(args),
		}),

		createTool({
			name: "defillama_get_protocol_data",
			description:
				"Fetches TVL-related data for protocols. Can fetch all protocols or a specific protocol with change metrics",
			schema: z.object({
				protocol: z
					.string()
					.optional()
					.describe("Specific protocol name to fetch"),
				sortCondition: z
					.enum(["change_1h", "change_1d", "change_7d", "tvl"])
					.describe("Field to sort by"),
				order: z.enum(["asc", "desc"]).describe("Sort order"),
			}),
			fn: async (args) => await getProtocolData(args),
		}),

		createTool({
			name: "defillama_get_historical_chain_tvl",
			description:
				"Fetches historical TVL data for chains. Can retrieve data for all chains or a specific chain. Returns last 10 data points",
			schema: z.object({
				chain: z.string().optional().describe("Specific chain name"),
			}),
			fn: async (args) => await getHistoricalChainTvl(args),
		}),

		// DEX Data
		createTool({
			name: "defillama_get_dexs_data",
			description:
				"Fetches DEX volume data. Can retrieve overview data for all DEXs, DEXs on a specific chain, or a specific protocol",
			schema: z.object({
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
			fn: async (args) => await getDexsData(args),
		}),

		// Fees & Revenue
		createTool({
			name: "defillama_get_fees_and_revenue",
			description:
				"Fetches fees and revenue data from protocols. Supports filtering by chain or protocol with various revenue metrics",
			schema: z.object({
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
			fn: async (args) => await getFeesAndRevenue(args),
		}),
	];
};
