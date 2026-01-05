import z from "zod";
import { callIqAiApi } from "../../../iqai/make-iq-ai-request";

export const GetTopAgentsInputSchema = z.object({
	sort: z
		.enum(["mcap", "holders", "inferences"])
		.optional()
		.describe("Rank by: 'mcap' (market cap), 'holders', or 'inferences'"),
	limit: z.number().optional().describe("Number of top agents to return"),
});

export type GetTopAgentsInput = z.infer<typeof GetTopAgentsInputSchema>;

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
 * Get top AI agent tokens ranked by market cap, holders, or inferences (Sophia, GPT, Eliza).
 *
 * Returns top AI agents on IQ ATP platform (Chain ID 252). These are AI agents, not regular crypto rankings.
 *
 * NOT FOR: Regular cryptocurrency rankings or base token rankings.
 * For crypto rankings across chains, use CoinGecko getCoinsMarkets.
 * For DeFi protocol rankings, use DefiLlama getProtocols.
 *
 * @param params.sort - Rank by: 'mcap' (market cap), 'holders', 'inferences' (default: 'mcap')
 * @param params.limit - Number of top agents to return (default: 10)
 *
 * @returns Top AI agents: { agents: [{ ticker, name, holdersCount, ... }] }
 *
 * @example
 * ```typescript
 * const topAgents = await getTopAgents({ sort: 'mcap', limit: 5 });
 * // Returns top 5 AI agents: { agents: [{ ticker: 'Sophia', ... }] }
 * ```
 */
export async function getTopAgents(
	params: GetTopAgentsInput = {},
): Promise<GetTopAgentsResponse> {
	const { sort = "mcap", limit = 10 } = GetTopAgentsInputSchema.parse(params);

	return callIqAiApi("/api/agents/top", { sort, limit }, topAgentsSchema);
}
