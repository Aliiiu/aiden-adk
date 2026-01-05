import { z } from "zod";
import { executeTool } from "../shared";

export const GetRangeCoinsOhlcInputSchema = z.object({
	id: z.string().describe("Coin identifier (e.g., 'bitcoin')"),
	vs_currency: z.string().describe("Target currency (e.g., 'usd')"),
	from: z.number().describe("Start timestamp in seconds"),
	to: z.number().describe("End timestamp in seconds"),
	precision: z
		.union([z.number(), z.string()])
		.optional()
		.describe("Optional decimal precision"),
});

export const GetRangeCoinsOhlcResponseSchema = z
	.array(
		z.tuple([
			z.number().describe("Unix timestamp in milliseconds"),
			z.number().describe("Open price"),
			z.number().describe("High price"),
			z.number().describe("Low price"),
			z.number().describe("Close price"),
		]),
	)
	.describe("OHLC data points");

export type GetRangeCoinsOhlcInput = z.infer<
	typeof GetRangeCoinsOhlcInputSchema
>;
export type GetRangeCoinsOhlcResponse = z.infer<
	typeof GetRangeCoinsOhlcResponseSchema
>;

/**
 * Get OHLC (candlestick) data for a coin within a date range
 * Use this to build candlestick charts for the specified UNIX timestamp window.
 *
 * @param params.id - Coin ID
 * @param params.vs_currency - Target currency (e.g., 'usd')
 * @param params.from - From timestamp (UNIX)
 * @param params.to - To timestamp (UNIX)
 * @param params.precision - Decimal precision (default: 2)
 *
 * @returns OHLC data [timestamp, open, high, low, close]
 *
 * @example
 * ```typescript
 * const ohlc = await getRangeCoinsOhlc({
 *   id: 'bitcoin',
 *   vs_currency: 'usd',
 *   from: 1609459200,
 *   to: 1612137600
 * });
 * ```
 */
export async function getRangeCoinsOhlc(
	params: GetRangeCoinsOhlcInput,
): Promise<GetRangeCoinsOhlcResponse> {
	return executeTool(
		"get_range_coins_ohlc",
		params,
	) as Promise<GetRangeCoinsOhlcResponse>;
}
