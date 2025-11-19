import z from "zod";
import { callIqAiApi } from "../../../iqai/make-iq-ai-request.js";

export type GetAllAgentsInput = {
	sort?: "latest" | "marketCap" | "holders" | "inferences";
	order?: "asc" | "desc";
	category?:
		| "OnChain"
		| "Productivity"
		| "Entertainment"
		| "Informative"
		| "Creative";
	status?: "alive" | "latent";
	chainId?: number;
	page?: number;
	limit?: number;
};

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
 * @returns AI agent directory: { agents: [{ ticker, name, ... }], pagination }
 *
 * @example
 * ```typescript
 * const agentList = await getAllAgents({ sort: 'marketCap', limit: 10 });
 * // Returns top 10 AI agents: { agents: [{ ticker: 'Sophia', name: 'Sophia AI', ... }], ... }
 * ```
 */
export async function getAllAgents(
	params: GetAllAgentsInput = {},
): Promise<GetAllAgentsResponse> {
	const {
		sort = "marketCap",
		order = "desc",
		category,
		status,
		chainId = 252,
		page = 1,
		limit = 50,
	} = params;

	return callIqAiApi(
		"/api/agents",
		{ sort, order, category, status, chainId, page, limit },
		allAgentsSchema,
	);
}
