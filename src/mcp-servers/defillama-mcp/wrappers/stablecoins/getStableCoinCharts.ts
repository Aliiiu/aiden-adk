import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetStableCoinChartsInputSchema = z
	.object({
		chain: z.string().optional().describe("Filter chart by chain"),
		stablecoin: z
			.union([z.string(), z.number()])
			.optional()
			.describe("Stablecoin identifier"),
	})
	.strict()
	.optional();

const StablecoinChartPointSchema = z.object({
	date: z.number().describe("Unix timestamp"),
	totalCirculatingPeggedUSD: z
		.number()
		.describe("Total circulating supply pegged to USD"),
	totalUnreleased: z
		.record(z.string(), z.number())
		.optional()
		.describe("Unreleased supply details"),
	totalCirculatingUSD: z.number().optional(),
	totalMintedUSD: z.number().optional(),
	totalBridgedToUSD: z.number().optional(),
});

export const GetStableCoinChartsResponseSchema = z
	.array(StablecoinChartPointSchema)
	.describe("Historical stablecoin chart data");

export type GetStableCoinChartsInput = z.infer<
	typeof GetStableCoinChartsInputSchema
>;
export type GetStableCoinChartsResponse = z.infer<
	typeof GetStableCoinChartsResponseSchema
>;

/**
 * Get historical stablecoin circulation time-series data (total supply over time).
 *
 * Returns circulation trends over time. This is for analyzing stablecoin supply growth/contraction.
 * For current stablecoin rankings, use getStableCoin.
 * For chain distribution, use getStableCoinChains.
 * For price data, use getStableCoinPrices.
 *
 * @param input.chain - Optional chain filter for chain-specific circulation data
 * @param input.stablecoin - Optional stablecoin ID filter for specific stablecoin
 *
 * @returns Time-series array: [{ date: unix_timestamp, totalCirculatingPeggedUSD, ... }, ...]
 *
 * @example
 * ```typescript
 * const usdtHistory = await getStableCoinCharts({ stablecoin: '1' });
 * // Returns: [{ date: 1640995200, totalCirculatingPeggedUSD: 80000000000 }, ...]
 * ```
 */
export async function getStableCoinCharts(
	input?: GetStableCoinChartsInput,
): Promise<GetStableCoinChartsResponse> {
	return executeServiceMethod(
		"stablecoin",
		"getStableCoinCharts",
		input ?? {},
	) as Promise<GetStableCoinChartsResponse>;
}
