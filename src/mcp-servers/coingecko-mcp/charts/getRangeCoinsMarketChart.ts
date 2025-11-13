/**
 * Get historical market data for a coin within a date range
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetRangeCoinsMarketChartInputSchema = z.object({
	id: z.string().describe("Coin identifier (e.g., 'bitcoin')"),
	vs_currency: z.string().describe("Target currency (e.g., 'usd')"),
	from: z.number().describe("Start timestamp in seconds"),
	to: z.number().describe("End timestamp in seconds"),
	precision: z
		.union([z.number(), z.string()])
		.optional()
		.describe("Optional decimal precision for values"),
});

const ValuePointSchema = z.tuple([
	z.number().describe("Unix timestamp in milliseconds"),
	z.number().describe("Value at timestamp"),
]);

export const GetRangeCoinsMarketChartResponseSchema = z.object({
	prices: z.array(ValuePointSchema).describe("Price series [timestamp, price]"),
	market_caps: z
		.array(ValuePointSchema)
		.describe("Market cap series [timestamp, cap]"),
	total_volumes: z
		.array(ValuePointSchema)
		.describe("Trading volume series [timestamp, volume]"),
});

export type GetRangeCoinsMarketChartInput = z.infer<
	typeof GetRangeCoinsMarketChartInputSchema
>;
export type GetRangeCoinsMarketChartResponse = z.infer<
	typeof GetRangeCoinsMarketChartResponseSchema
>;

/**
 * Get historical market data for a coin within a date range
 *
 * @param params.id - Coin ID
 * @param params.vs_currency - Target currency (e.g., 'usd')
 * @param params.from - From timestamp (UNIX)
 * @param params.to - To timestamp (UNIX)
 * @param params.precision - Decimal precision (default: 2)
 *
 * @returns Historical price, market cap, and volume data
 *
 * @example
 * ```typescript
 * const data = await getRangeCoinsMarketChart({
 *   id: 'bitcoin',
 *   vs_currency: 'usd',
 *   from: 1609459200,
 *   to: 1612137600
 * });
 * ```
 */
export async function getRangeCoinsMarketChart(
	params: GetRangeCoinsMarketChartInput,
): Promise<GetRangeCoinsMarketChartResponse> {
	return executeTool(
		"get_range_coins_market_chart",
		params,
	) as Promise<GetRangeCoinsMarketChartResponse>;
}
