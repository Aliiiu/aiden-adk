import z from "zod";
import { callIqAiApi } from "../../../iqai/make-iq-ai-request";

export const GetAgentStatsInputSchema = z
	.object({
		address: z
			.string()
			.optional()
			.describe("Agent token contract address on IQ chain (Chain ID 252)"),
		ticker: z
			.string()
			.optional()
			.describe("Agent ticker symbol, e.g., 'Sophia', 'GPT', 'Eliza'"),
		extendedStats: z
			.boolean()
			.optional()
			.describe(
				"Include extended metrics (default: true). Must be false when using ticker lookup.",
			),
	})
	.refine((data) => Boolean(data.address || data.ticker), {
		message: "Provide either 'address' or 'ticker'.",
	})
	.refine((data) => !(data.ticker && data.extendedStats), {
		message: "`extendedStats` is only supported when using address lookup.",
		path: ["extendedStats"],
	});

export type GetAgentStatsInput = z.infer<typeof GetAgentStatsInputSchema>;

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
 * Get market stats for AI agent tokens on IQ ATP DEX by ticker (e.g., Sophia, GPT, Eliza).
 *
 * Returns market data for AI agent tokens traded on IQ ATP (IQ chain, Chain ID 252).
 * These are NOT regular cryptocurrencies - they are AI agent tokens on IQ ATP platform.
 *
 * NOT FOR: Regular crypto tokens, base tokens, or non-agent tokens.
 * For regular cryptocurrency prices, use CoinGecko search and getSimplePrice.
 *
 * @param params.address - Agent token contract address on IQ chain
 * @param params.ticker - Agent ticker symbol (e.g., 'Sophia', 'GPT', 'Eliza')
 * @param params.extendedStats - Include extended metrics (default: true). MUST be false when using ticker.
 *
 * @returns Agent stats: market cap, holders, inference count for AI agents
 *
 * @example
 * ```typescript
 * // When using ticker, MUST set extendedStats: false
 * const sophiaStats = await getAgentStats({ ticker: 'Sophia', extendedStats: false });
 * // Returns: { name: 'Sophia', currentPriceInIQ: 0.5, marketCap: 500000, ... }
 * ```
 */
export async function getAgentStats(
	params: GetAgentStatsInput,
): Promise<GetAgentStatsResponse> {
	const { address, ticker, extendedStats } =
		GetAgentStatsInputSchema.parse(params);
	const resolvedExtendedStats = extendedStats ?? !ticker;

	return callIqAiApi(
		"/api/agents/stats",
		{ address, ticker, extendedStats: resolvedExtendedStats },
		agentStatsSchema.or(agentStatsSchema.array()),
	);
}
