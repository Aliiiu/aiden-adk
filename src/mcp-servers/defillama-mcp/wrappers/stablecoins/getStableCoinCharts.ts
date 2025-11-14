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
 * Get historical stablecoin chart data
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
