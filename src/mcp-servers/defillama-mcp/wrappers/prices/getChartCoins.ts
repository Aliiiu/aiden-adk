import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetChartCoinsInputSchema = z.object({
	coins: z.string().describe("Coin identifier or list for charting"),
	start: z
		.union([z.string(), z.number()])
		.optional()
		.describe("Start timestamp or ISO date"),
	end: z
		.union([z.string(), z.number()])
		.optional()
		.describe("End timestamp or ISO date"),
	span: z.number().optional().describe("Aggregation span in seconds"),
	period: z.string().optional().describe("Aggregation period (e.g., '1d')"),
	searchWidth: z
		.union([z.string(), z.number()])
		.optional()
		.describe("Search window width for price samples"),
});

const ChartPricePointSchema = z.object({
	timestamp: z.number().describe("Unix timestamp"),
	price: z.number().describe("Price in USD"),
});

const ChartCoinDataSchema = z.object({
	decimals: z.number().describe("Token decimals"),
	confidence: z.number().describe("Confidence score"),
	prices: z.array(ChartPricePointSchema).describe("Historical price samples"),
	symbol: z.string().describe("Token symbol"),
});

export const GetChartCoinsResponseSchema = z.object({
	coins: z
		.record(z.string(), ChartCoinDataSchema)
		.describe("Chart data grouped by coin identifier"),
});

export type GetChartCoinsInput = z.infer<typeof GetChartCoinsInputSchema>;
export type GetChartCoinsResponse = z.infer<typeof GetChartCoinsResponseSchema>;

/**
 * Get price chart data for coins
 */
export async function getChartCoins(
	input: GetChartCoinsInput,
): Promise<GetChartCoinsResponse> {
	return executeServiceMethod(
		"price",
		"getChartCoins",
		input,
	) as Promise<GetChartCoinsResponse>;
}
