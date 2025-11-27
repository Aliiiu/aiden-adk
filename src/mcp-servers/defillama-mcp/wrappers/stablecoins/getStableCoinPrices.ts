import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

const StablecoinPricePointSchema = z.object({
	date: z.number().describe("Unix timestamp"),
	prices: z
		.record(z.string(), z.number())
		.describe("Mapping of stablecoin id to price in USD"),
});

export const GetStableCoinPricesResponseSchema = z
	.array(StablecoinPricePointSchema)
	.describe("Historical stablecoin price snapshots");

export type GetStableCoinPricesResponse = z.infer<
	typeof GetStableCoinPricesResponseSchema
>;

/**
 * Get historical stablecoin price snapshots (peg tracking over time).
 *
 * Returns historical USD prices for stablecoins. This is for analyzing stablecoin peg stability over time.
 *
 * @returns Time-series array: [{ date: unix_timestamp, prices: { 'stablecoin_id': usd_price } }, ...]
 *
 * @example
 * ```typescript
 * const priceHistory = await getStableCoinPrices();
 * // Returns: [{ date: 1640995200, prices: { '1': 0.9998, '2': 1.0001 } }, ...]
 * // Useful for detecting de-peg events
 * ```
 */
export async function getStableCoinPrices(): Promise<GetStableCoinPricesResponse> {
	return executeServiceMethod(
		"stablecoin",
		"getStableCoinPrices",
		{},
	) as Promise<GetStableCoinPricesResponse>;
}
