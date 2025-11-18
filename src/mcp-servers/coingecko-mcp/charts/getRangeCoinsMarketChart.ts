/**
 * Get historical market chart (prices, market caps, volumes) for a coin over a date range.
 *
 * Use this for time-series analysis between two UNIX timestamps. For single-date snapshots,
 * use `getCoinsHistory`.
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
 * Get historical market data (prices, market cap, volume) for a coin within a time range.
 *
 * Use this for date range queries: "last N days", "from date X to date Y", "between dates".
 * Returns time-series data suitable for trend analysis, averaging, and charting.
 *
 * @param params.id - Coin ID (e.g., 'bitcoin', 'ethereum')
 * @param params.vs_currency - Target currency (e.g., 'usd', 'eur')
 * @param params.from - Start timestamp in Unix seconds
 * @param params.to - End timestamp in Unix seconds
 * @param params.precision - Decimal precision (default: 2)
 *
 * @returns Time-series arrays: prices [[timestamp_ms, price], ...], market_caps, total_volumes
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
