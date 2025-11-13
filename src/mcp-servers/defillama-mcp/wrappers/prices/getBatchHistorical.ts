import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetBatchHistoricalInputSchema = z.object({
	coins: z
		.string()
		.describe("Comma-separated list of coin identifiers to fetch history for"),
	searchWidth: z
		.union([z.string(), z.number()])
		.optional()
		.describe("Search window width to find historical points"),
});

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
 * Get batch historical prices for multiple coins
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
