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
 * Get top IQ AI agents ranked by market cap, holders, or inferences.
 *
 * Returns top-performing agent tokens on IQ ATP DEX with prices in IQ and USD.
 * Use this to find trending agents on IQ chain (Chain ID 252).
 *
 * Keywords: IQ chain, IQ ATP, top agents, trending tokens, market leaders, rankings
 */
export async function getTopAgents(
	params: GetTopAgentsInput = {},
): Promise<GetTopAgentsResponse> {
	const { sort = "mcap", limit = 10 } = params;

	return callIqAiApi("/api/agents/top", { sort, limit }, topAgentsSchema);
}
