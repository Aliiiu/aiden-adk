import z from "zod";
import { callIqAiApi } from "../../../iqai/make-iq-ai-request.js";

export type GetTopAgentsInput = {
	sort?: "mcap" | "holders" | "inferences";
	limit?: number;
};

const topAgentsSchema = z
	.object({
		agents: z.array(
			z.object({
				tokenContract: z.string(),
				agentContract: z.string().optional(),
				isActive: z.boolean().optional(),
				currentPriceInIq: z.number().optional(),
				currentPriceInUSD: z.number().optional(),
				holdersCount: z.number().optional(),
				inferenceCount: z.number().optional(),
				name: z.string(),
				ticker: z.string(),
			}),
		),
	})
	.loose();

export type GetTopAgentsResponse = z.infer<typeof topAgentsSchema>;

/**
 * Get top IQ AI agent tokens ranked by market cap, holders, or inferences (e.g., Sophia, GPT).
 *
 * Returns top-performing agent tokens on IQ ATP DEX with prices in IQ and USD.
 * This is for finding trending AI agents on IQ chain (Chain ID 252).
 *
 * This is ONLY for agent tokens on IQ ATP, NOT for IQ base token itself.
 * For general crypto rankings across chains, use CoinGecko getCoinsMarkets.
 * For DeFi protocol rankings, use DefiLlama getProtocols.
 *
 * @param params.sort - Rank by: 'mcap' (market cap), 'holders', 'inferences' (default: 'mcap')
 * @param params.limit - Number of top agents to return (default: 10)
 *
 * @returns Top agents: { agents: [{ ticker, name, currentPriceInIQ, currentPriceInUSD, holdersCount, ... }] }
 *
 * @example
 * ```typescript
 * const topAgents = await getTopAgents({ sort: 'mcap', limit: 5 });
 * // Returns: { agents: [{ ticker: 'Sophia', currentPriceInIQ: 0.5, currentPriceInUSD: 0.003, ... }] }
 * ```
 */
export async function getTopAgents(
	params: GetTopAgentsInput = {},
): Promise<GetTopAgentsResponse> {
	const { sort = "mcap", limit = 10 } = params;

	return callIqAiApi("/api/agents/top", { sort, limit }, topAgentsSchema);
}
