import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetPercentageCoinsInputSchema = z
	.object({
		coins: z
			.string()
			.describe(
				"Comma-separated coin identifiers (e.g., 'ethereum:0x...,bitcoin')",
			),
		period: z
			.string()
			.optional()
			.describe("Lookback period (e.g., '1d', '7d')"),
		lookForward: z
			.boolean()
			.optional()
			.describe("When true, look forward instead of backward"),
		timestamp: z
			.union([z.string(), z.number()])
			.optional()
			.describe("Reference timestamp for the percentage calculation"),
	})
	.strict();

export const GetPercentageCoinsResponseSchema = z.object({
	coins: z
		.record(z.string(), z.number())
		.describe("Percentage change per coin identifier"),
});

export type GetPercentageCoinsInput = z.infer<
	typeof GetPercentageCoinsInputSchema
>;
export type GetPercentageCoinsResponse = z.infer<
	typeof GetPercentageCoinsResponseSchema
>;

/**
 * Get percentage price changes for coins over a time period (e.g., 24h, 7d change).
 *
 * Returns price change percentages. This is for calculating price performance over custom periods.
 * For current prices with built-in change metrics, use CoinGecko getCoinsMarkets.
 * For continuous price series to calculate changes, use getChartCoins.
 *
 * @param input.coins - Comma-separated coin identifiers in 'chain:address' format
 * @param input.period - Lookback period (e.g., '1d', '7d', '30d')
 * @param input.timestamp - Reference timestamp for the calculation
 * @param input.lookForward - Look forward instead of backward from timestamp
 *
 * @returns Percentage changes: { coins: { 'id': percentage_change_number } }
 *
 * @example
 * ```typescript
 * const changes = await getPercentageCoins({
 *   coins: 'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7',
 *   period: '7d'
 * });
 * // Returns: { coins: { 'ethereum:0x...': 2.5 } } // 2.5% increase
 * ```
 */
export async function getPercentageCoins(
	input: GetPercentageCoinsInput,
): Promise<GetPercentageCoinsResponse> {
	return executeServiceMethod(
		"price",
		"getPercentageCoins",
		input,
	) as Promise<GetPercentageCoinsResponse>;
}
