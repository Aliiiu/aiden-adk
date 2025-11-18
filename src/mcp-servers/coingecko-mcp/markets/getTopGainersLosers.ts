/**
 * Get today's top gainers and losers ranked by price change percentage on a vs_currency.
 *
 * Useful for daily market movers dashboards. Defaults to USD if no currency is provided.
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetTopGainersLosersInputSchema = z
	.object({
		vs_currency: z
			.string()
			.optional()
			.describe("Target currency (default 'usd')"),
		duration: z
			.enum(["1h", "24h"])
			.optional()
			.describe("Time window for price change"),
		top_coins: z
			.string()
			.optional()
			.describe("Filter by top N market cap coins (e.g., '300')"),
	})
	.optional();

const TopMoverSchema = z
	.object({
		id: z.string(),
		symbol: z.string(),
		name: z.string(),
		image: z.string().url().optional(),
		current_price: z.number().nullable().optional(),
		market_cap: z.number().nullable().optional(),
		price_change_percentage: z.number().nullable().optional(),
	})
	.loose();

export const GetTopGainersLosersResponseSchema = z.object({
	top_gainers: z.array(TopMoverSchema),
	top_losers: z.array(TopMoverSchema),
});

export type GetTopGainersLosersInput = z.infer<
	typeof GetTopGainersLosersInputSchema
>;
export type GetTopGainersLosersResponse = z.infer<
	typeof GetTopGainersLosersResponseSchema
>;

/**
 * Get top gainers and losers by price change percentage
 *
 * @param params.vs_currency - Target currency (default: 'usd')
 * @param params.duration - Time period: 1h, 24h (default: '24h')
 * @param params.top_coins - Filter by top N coins by market cap (e.g., '300')
 *
 * @returns Top gainers and losers data
 *
 * @example
 * ```typescript
 * const movers = await getTopGainersLosers({
 *   vs_currency: 'usd',
 *   duration: '24h',
 *   top_coins: '300'
 * });
 * ```
 */
export async function getTopGainersLosers(
	params?: GetTopGainersLosersInput,
): Promise<GetTopGainersLosersResponse> {
	return executeTool(
		"get_coins_top_gainers_losers",
		params ?? {},
	) as Promise<GetTopGainersLosersResponse>;
}
