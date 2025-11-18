import z from "zod";
import { callIqAiApi } from "../../../iqai/make-iq-ai-request.js";

export type GetAgentStatsInput = {
	address?: string;
	ticker?: string;
	extendedStats?: boolean;
};

const agentStatsSchema = z
	.object({
		name: z.string(),
		currentPriceInIq: z.number().optional(),
		currentPriceInUSD: z.number().optional(),
		marketCap: z.number().optional(),
		changeIn24h: z.number().optional(),
		priceChangeIn24h: z.number().optional(),
		holdersCount: z.number().optional(),
		inferenceCount: z.number().optional(),
		category: z.string().optional(),
		totalSupply: z.number().optional(),
		performanceTimeline: z
			.object({
				"7d": z.number().optional(),
				"14d": z.number().optional(),
				"30d": z.number().optional(),
				"200d": z.number().optional(),
				"1y": z.number().optional(),
			})
			.optional(),
		tradingStats24h: z
			.object({
				high: z.number().optional(),
				low: z.number().optional(),
				volume: z.number().optional(),
			})
			.optional(),
		ath: z
			.object({
				price: z.number(),
				timestamp: z.string(),
			})
			.optional(),
		atl: z
			.object({
				price: z.number(),
				timestamp: z.string(),
			})
			.optional(),
	})
	.loose();

export type GetAgentStatsResponse =
	| z.infer<typeof agentStatsSchema>
	| Array<z.infer<typeof agentStatsSchema>>;

/**
 * Get live market and performance stats for an agent by address or ticker.
 *
 * Returns real-time price data (IQ and USD), market cap, 24h price changes, and performance metrics.
 * Primary source for live pricing of agent tokens on IQ ATP DEX (IQ chain, Chain ID 252).
 *
 * Keywords: IQ chain, IQ ATP, agent token price, live price, market stats, price change, trading volume
 */
export async function getAgentStats(
	params: GetAgentStatsInput,
): Promise<GetAgentStatsResponse> {
	const { address, ticker, extendedStats = true } = params;

	if (!address && !ticker) {
		throw new Error("Provide either 'address' or 'ticker'.");
	}

	if (ticker && extendedStats) {
		throw new Error(
			"`extendedStats` is only supported when using address lookup.",
		);
	}

	return callIqAiApi(
		"/api/agents/stats",
		{ address, ticker, extendedStats },
		agentStatsSchema.or(agentStatsSchema.array()),
	);
}
