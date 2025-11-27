import z from "zod";
import { callIqAiApi } from "../../../iqai/make-iq-ai-request.js";

export const GetAllAgentsInputSchema = z.object({
	sort: z
		.enum(["latest", "marketCap", "holders", "inferences"])
		.optional()
		.describe("Sort by: 'marketCap', 'holders', 'inferences', 'latest'"),
	order: z
		.enum(["asc", "desc"])
		.optional()
		.describe("Sort order: 'asc' or 'desc'"),
	category: z
		.enum([
			"OnChain",
			"Productivity",
			"Entertainment",
			"Informative",
			"Creative",
		])
		.optional()
		.describe("Filter by agent category"),
	status: z.enum(["alive", "latent"]).optional().describe("Filter by status"),
	chainId: z
		.number()
		.optional()
		.describe("Chain ID (default: 252 for IQ chain)"),
	page: z.number().optional().describe("Page number (default: 1)"),
	limit: z.number().optional().describe("Results per page (default: 50)"),
});

export type GetAllAgentsInput = z.infer<typeof GetAllAgentsInputSchema>;

const allAgentsSchema = z
	.object({
		agents: z.array(
			z.object({
				id: z.string(),
				avatar: z.string().optional(),
				ticker: z.string(),
				name: z.string(),
				bio: z.string().optional(),
				socials: z.any().optional(),
				creatorId: z.string().optional(),
				isActive: z.boolean().optional(),
				governanceContract: z.string().optional(),
				tokenContract: z.string(),
				managerContract: z.string().optional(),
				poolContract: z.string().optional(),
				agentContract: z.string().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				tokenUri: z.string().optional(),
				knowledge: z.array(z.string()).optional(),
				model: z.any().optional(),
				category: z.string().optional(),
				currentPriceInIq: z.number().optional(),
				currentPriceInUSD: z.number().optional(),
				inferenceCount: z.number().optional(),
				holdersCount: z.number().optional(),
				framework: z.string().optional(),
				volumeAllTime: z.number().optional(),
			}),
		),
		pagination: z
			.object({
				currentPage: z.number(),
				totalPages: z.number(),
				totalCount: z.number(),
				limit: z.number(),
				hasNextPage: z.boolean(),
				hasPreviousPage: z.boolean(),
			})
			.optional(),
	})
	.loose();

export type GetAllAgentsResponse = z.infer<typeof allAgentsSchema>;

/**
 * List all AI agent tokens on IQ ATP platform (e.g., Sophia, GPT, Eliza).
 *
 * Returns directory of AI agent tokens on IQ ATP DEX (Chain ID 252). These are AI agents, not regular crypto.
 * Use this to discover AI agent tickers before calling getAgentStats or getAgentInfo.
 *
 * NOT FOR: Regular cryptocurrency listings or base tokens.
 * For regular crypto listings, use CoinGecko search or getCoinsMarkets.
 *
 * @param params.sort - Sort by: 'marketCap', 'holders', 'inferences', 'latest'
 * @param params.order - Sort order: 'desc' or 'asc'
 * @param params.category - Filter by: 'OnChain', 'Productivity', 'Entertainment', 'Informative', 'Creative'
 * @param params.status - Filter by: 'alive' or 'latent'
 * @param params.chainId - Chain ID (default: 252 for IQ chain)
 * @param params.page - Page number (default: 1)
 * @param params.limit - Results per page (default: 50)
 *
 * @returns Object with agents array: { agents: [{ ticker, name, holdersCount, ... }], pagination }
 *
 * @example
 * ```typescript
 * const response = await getAllAgents({ sort: 'marketCap', limit: 10 });
 * const agents = response.agents;  // Access the agents array
 * const agent = agents.find(a => a.ticker.toLowerCase() === 'sophia');
 * // Returns: { agents: [{ticker: 'Sophia', name: 'Sophia AI', holdersCount: 100, ...}], pagination: {...} }
 * ```
 */
export async function getAllAgents(
	params: GetAllAgentsInput = {},
): Promise<GetAllAgentsResponse> {
	const parsed = GetAllAgentsInputSchema.parse(params);
	const {
		sort = "marketCap",
		order = "desc",
		category,
		status,
		chainId = 252,
		page = 1,
		limit = 50,
	} = parsed;

	return callIqAiApi(
		"/api/agents",
		{ sort, order, category, status, chainId, page, limit },
		allAgentsSchema,
	);
}
