import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetNftsMarketChartInputSchema = z.object({
	id: z.string().describe("NFT collection ID"),
	days: z
		.union([z.number(), z.string()])
		.describe("Number of days of data (or 'max')"),
});

const ChartPointSchema = z.tuple([
	z.number().describe("Timestamp in milliseconds"),
	z.number().describe("Value at timestamp"),
]);

export const GetNftsMarketChartResponseSchema = z.object({
	floor_price_native_currency: z
		.array(ChartPointSchema)
		.describe("Floor price in native currency"),
	floor_price_usd: z.array(ChartPointSchema).describe("Floor price in USD"),
	volume_native_currency: z
		.array(ChartPointSchema)
		.describe("Volume in native currency"),
	volume_usd: z.array(ChartPointSchema).describe("Volume in USD"),
});

export type GetNftsMarketChartInput = z.infer<
	typeof GetNftsMarketChartInputSchema
>;
export type GetNftsMarketChartResponse = z.infer<
	typeof GetNftsMarketChartResponseSchema
>;

/**
 * Get historical floor price and volume chart data for an NFT collection.
 *
 * Use this to analyze NFT collection trends over a time window (days or 'max').
 *
 * @param params.id - NFT collection ID
 * @param params.days - Data window (number of days or 'max')
 *
 * @returns Historical floor price and volume arrays
 *
 * @example
 * ```typescript
 * const chart = await getNftsMarketChart({
 *   id: 'cryptopunks',
 *   days: 30
 * });
 * ```
 */
export async function getNftsMarketChart(
	params: GetNftsMarketChartInput,
): Promise<GetNftsMarketChartResponse> {
	return executeTool(
		"get_nfts_market_chart",
		params,
	) as Promise<GetNftsMarketChartResponse>;
}
