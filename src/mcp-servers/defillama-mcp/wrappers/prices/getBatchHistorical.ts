import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetBatchHistoricalInputSchema = z
	.object({
		coins: z
			.string()
			.describe(
				"Comma-separated list of coin identifiers to fetch history for",
			),
		searchWidth: z
			.union([z.string(), z.number()])
			.optional()
			.describe("Search window width to find historical points"),
	})
	.strict();

const HistoricalPricePointSchema = z.object({
	timestamp: z.number().describe("Unix timestamp for the price point"),
	price: z.number().describe("Price in USD"),
	confidence: z.number().describe("Confidence score for the price"),
});

export const GetBatchHistoricalResponseSchema = z.object({
	coins: z
		.record(
			z.string(),
			z.object({
				symbol: z.string().describe("Token symbol"),
				prices: z
					.array(HistoricalPricePointSchema)
					.describe("Historical price samples"),
			}),
		)
		.describe("Historical pricing data grouped by coin identifier"),
});

export type GetBatchHistoricalInput = z.infer<
	typeof GetBatchHistoricalInputSchema
>;
export type GetBatchHistoricalResponse = z.infer<
	typeof GetBatchHistoricalResponseSchema
>;

/**
 * Get batch historical price samples for multiple coins (NOT date range queries).
 *
 * Returns sparse historical price samples. This is for batch historical snapshots, NOT continuous date ranges.
 * For date range queries ("last N days", "from X to Y"), use CoinGecko getRangeCoinsMarketChart instead.
 * For current prices, use getPricesCurrentCoins.
 * For continuous time-series chart data, use getChartCoins.
 *
 * @param input.coins - Comma-separated coin identifiers in 'chain:address' format
 * @param input.searchWidth - Search window width to find historical points
 *
 * @returns Historical price samples (not continuous): { coins: { 'id': { symbol, prices: [{timestamp, price, confidence}] } } }
 *
 * @example
 * ```typescript
 * const history = await getBatchHistorical({
 *   coins: 'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7'
 * });
 * // Returns sparse historical samples, NOT a complete date range
 * ```
 */
export async function getBatchHistorical(
	input: GetBatchHistoricalInput,
): Promise<GetBatchHistoricalResponse> {
	return executeServiceMethod(
		"price",
		"getBatchHistorical",
		input,
	) as Promise<GetBatchHistoricalResponse>;
}
