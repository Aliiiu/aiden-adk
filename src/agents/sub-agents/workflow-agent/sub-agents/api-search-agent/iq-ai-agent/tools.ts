import { createTool } from "@iqai/adk";
import { z } from "zod";
import {
	agentInfoSchema,
	agentLogsSchema,
	agentStatsSchema,
	allAgentsSchema,
	holdingsSchema,
	topAgentsSchema,
} from "@/src/lib/helpers/_schema";
import { formatData } from "@/src/lib/helpers/custom-json-formatter";
import { callIqAiApi } from "@/src/mcp-servers/iqai/make-iq-ai-request";

export const getAllAgentsTool = createTool({
	name: "get_all_agents",
	description:
		"Get a paginated, sortable, and filterable list of all IQ AI agents with full metadata and contract details. Use first to find agents before calling other tools.",
	schema: z.object({
		sort: z
			.enum(["latest", "marketCap", "holders", "inferences"])
			.default("marketCap"),
		order: z.enum(["asc", "desc"]).default("desc"),
		category: z
			.enum([
				"OnChain",
				"Productivity",
				"Entertainment",
				"Informative",
				"Creative",
			])
			.optional(),
		status: z.enum(["alive", "latent"]).optional(),
		chainId: z.number().default(252),
		page: z.number().default(1),
		limit: z.number().max(100).default(50),
	}),
	fn: async (params): Promise<string> => {
		try {
			const response = await callIqAiApi(
				"/api/agents",
				params,
				allAgentsSchema,
			);

			if (!response.agents?.length) return "No agents found matching criteria.";

			const pagination = response.pagination;
			let result = `Total: ${pagination?.totalCount || response.agents.length} | Page: ${pagination?.currentPage || 1}/${pagination?.totalPages || 1}\n`;
			result += `Explorer: https://app.iqai.com/\n\n`;

			const headers = [
				"#",
				"name",
				"ticker",
				"category",
				"priceIQ",
				"priceUSD",
				"holders",
				"inferences",
				"tokenContract",
				"agentContract",
			];
			const rows = response.agents.map((a, i) => [
				i + 1,
				a.name || "N/A",
				a.ticker || "N/A",
				a.category || "N/A",
				a.currentPriceInIq?.toFixed(2) || "N/A",
				a.currentPriceInUSD?.toFixed(4) || "N/A",
				a.holdersCount || "N/A",
				a.inferenceCount || "N/A",
				a.tokenContract || "N/A",
				a.agentContract || "N/A",
			]);

			return result + formatData(headers, rows);
		} catch (err) {
			return `Unable to retrieve agents: ${err instanceof Error ? err.message : "Unknown error"}.`;
		}
	},
});

export const getTopAgentsTool = createTool({
	name: "get_top_agents",
	description:
		"Get top IQ AI agents ranked by market cap, holders, or inferences.",
	schema: z.object({
		sort: z.enum(["mcap", "holders", "inferences"]).default("mcap"),
		limit: z.number().min(1).max(100).default(10),
	}),
	fn: async ({ sort, limit }): Promise<string> => {
		try {
			const response = await callIqAiApi(
				"/api/agents/top",
				{ sort, limit },
				topAgentsSchema,
			);
			if (!response.agents?.length) return "No top agents found.";

			const headers = [
				"rank",
				"name",
				"ticker",
				"priceIQ",
				"priceUSD",
				"holders",
				"inferences",
			];
			const rows = response.agents.map((a, i) => [
				i + 1,
				a.name,
				a.ticker,
				a.currentPriceInIq?.toFixed(2) || "N/A",
				a.currentPriceInUSD?.toFixed(4) || "N/A",
				a.holdersCount || "N/A",
				a.inferenceCount || "N/A",
			]);

			return formatData(headers, rows);
		} catch (err) {
			return `Unable to retrieve top agents: ${err instanceof Error ? err.message : "Unknown error"}.`;
		}
	},
});

export const getAgentInfoTool = createTool({
	name: "get_agent_info",
	description:
		"Get detailed profile and metadata for an agent by address or ticker.",
	schema: z.object({
		address: z.string().optional(),
		ticker: z.string().optional(),
	}),
	fn: async ({ address, ticker }): Promise<string> => {
		try {
			if (!address && !ticker)
				return "Error: Provide either 'address' or 'ticker'. Use get_all_agents first.";

			const response = await callIqAiApi(
				"/api/agents/info",
				{ address, ticker },
				z.union([agentInfoSchema, z.array(agentInfoSchema)]),
			);

			if (Array.isArray(response)) {
				if (!response.length)
					return `No agents found with ticker: ${ticker}. Try get_all_agents.`;

				const headers = [
					"#",
					"name",
					"ticker",
					"priceIQ",
					"verified",
					"tokenContract",
				];
				const rows = response.map((a, i) => [
					i + 1,
					a.name,
					a.ticker,
					a.currentPriceInIq?.toFixed(2) || "N/A",
					a.isVerified ? "Yes" : "No",
					a.tokenContract,
				]);
				return `Found ${response.length} agent(s) with ticker "${ticker}":\n\n${formatData(headers, rows)}`;
			}

			const headers = ["field", "value"];
			const rows = [
				["name", response.name],
				["ticker", response.ticker],
				["bio", (response.bio || "N/A").slice(0, 200)],
				["category", response.category || "N/A"],
				["framework", response.framework || "N/A"],
				["verified", response.isVerified ? "Yes" : "No"],
				["active", response.isActive ? "Yes" : "No"],
				["createdAt", response.createdAt || "N/A"],
				[
					"explorerUrl",
					`https://app.iqai.com/agents/${response.tokenContract}`,
				],
			];

			return formatData(headers, rows);
		} catch (err) {
			return `Unable to retrieve agent info: ${err instanceof Error ? err.message : "Unknown error"}.`;
		}
	},
});

export const getAgentStatsTool = createTool({
	name: "get_agent_stats",
	description:
		"Get live market and performance stats for an agent by address or ticker.",
	schema: z.object({
		address: z.string().optional(),
		ticker: z.string().optional(),
		extendedStats: z.boolean().default(true),
	}),
	fn: async ({ address, ticker, extendedStats }): Promise<string> => {
		try {
			if (!address && !ticker) return "Error: Provide address or ticker.";
			if (ticker && extendedStats)
				return "Error: extendedStats only works with address.";

			const response = await callIqAiApi(
				"/api/agents/stats",
				{ address, ticker, extendedStats },
				z.union([agentStatsSchema, z.array(agentStatsSchema)]),
			);

			if (Array.isArray(response)) {
				if (!response.length) return `No stats found for ticker: ${ticker}.`;

				const headers = [
					"#",
					"name",
					"priceIQ",
					"priceUSD",
					"marketCap",
					"24hChg%",
					"holders",
					"inferences",
				];
				const rows = response.map((a, i) => [
					i + 1,
					a.name,
					a.currentPriceInIq?.toFixed(2) || "N/A",
					a.currentPriceInUSD?.toFixed(4) || "N/A",
					a.marketCap?.toFixed(0) || "N/A",
					a.changeIn24h?.toFixed(2) || "N/A",
					a.holdersCount || "N/A",
					a.inferenceCount || "N/A",
				]);
				return formatData(headers, rows);
			}

			const headers = ["metric", "value"];
			const rows = [
				["name", response.name],
				["priceIQ", response.currentPriceInIq?.toFixed(4) || "N/A"],
				["priceUSD", response.currentPriceInUSD?.toFixed(6) || "N/A"],
				["marketCap", response.marketCap?.toFixed(2) || "N/A"],
				["24hChange%", response.changeIn24h?.toFixed(2) || "N/A"],
				["holders", response.holdersCount || "N/A"],
				["inferences", response.inferenceCount || "N/A"],
			];

			let result = formatData(headers, rows);

			if (response.performanceTimeline) {
				result += `\n\nPerformance Timeline:`;
				result += `\n7d: ${response.performanceTimeline["7d"]?.toFixed(2)}% | 30d: ${response.performanceTimeline["30d"]?.toFixed(2)}% | 1y: ${response.performanceTimeline["1y"]?.toFixed(2)}%`;
			}

			return result;
		} catch (err) {
			return `Unable to retrieve stats: ${err instanceof Error ? err.message : "Unknown error"}.`;
		}
	},
});

export const getAgentLogsTool = createTool({
	name: "get_agent_logs",
	description:
		"Get chronological logs and activity history for a specific agent.",
	schema: z.object({
		agentTokenContract: z.string(),
		page: z.number().default(1),
		limit: z.number().max(100).default(10),
	}),
	fn: async ({ agentTokenContract, page, limit }): Promise<string> => {
		try {
			const response = await callIqAiApi(
				"/api/logs",
				{ agentTokenContract, page, limit },
				agentLogsSchema,
			);

			if (!response.logs?.length)
				return `No logs found for ${agentTokenContract}.`;

			const headers = ["#", "type", "content", "txHash", "timestamp"];
			const rows = response.logs.map((log, i) => [
				i + 1,
				log.type,
				log.content.substring(0, 80),
				log.txHash || "N/A",
				new Date(log.createdAt).toLocaleString(),
			]);

			return `Page ${response.page}/${response.totalPages} | Total: ${response.total}\n${formatData(headers, rows)}`;
		} catch (err) {
			return `Unable to retrieve logs: ${err instanceof Error ? err.message : "Unknown error"}.`;
		}
	},
});

export const getHoldingsTool = createTool({
	name: "get_holdings",
	description:
		"Get IQ AI token holdings for a wallet with token amounts and USD values.",
	schema: z.object({
		address: z.string(),
		chainId: z.string().default("252"),
	}),
	fn: async ({ address, chainId }): Promise<string> => {
		try {
			const response = await callIqAiApi(
				"/api/holdings",
				{ address, chainId },
				holdingsSchema,
			);

			if (response.count === 0) return `No holdings found for ${address}.`;

			const headers = ["#", "agent", "amount", "priceUSD", "valueUSD"];
			const rows = response.holdings.map((h, i) => {
				const amt = parseFloat(h.tokenAmount);
				const val = amt * h.currentPriceInUsd;
				return [
					i + 1,
					h.name,
					amt.toFixed(4),
					h.currentPriceInUsd.toFixed(6),
					val.toFixed(2),
				];
			});

			const totalValue = response.holdings.reduce(
				(sum, h) => sum + parseFloat(h.tokenAmount) * h.currentPriceInUsd,
				0,
			);

			return `Holdings for ${address} (Chain ${chainId})\n\n${formatData(headers, rows)}\nTotal Portfolio Value: $${totalValue.toFixed(2)} USD`;
		} catch (err) {
			return `Unable to retrieve holdings: ${err instanceof Error ? err.message : "Unknown error"}.`;
		}
	},
});
