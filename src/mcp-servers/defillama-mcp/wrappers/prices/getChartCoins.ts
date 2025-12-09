import { z } from "zod";
import { executeServiceMethod } from "../../shared";

export const GetChartCoinsInputSchema = z
	.object({
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
	})
	.strict();

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
 * Get price chart time-series data for coins within a date range with optional aggregation.
 *
 * Returns continuous price series for charting. This is for visualizing price trends over custom date ranges.
 *
 * @param input.coins - Coin identifier in 'chain:address' format
 * @param input.start - Start timestamp (Unix seconds) or ISO date
 * @param input.end - End timestamp (Unix seconds) or ISO date
 * @param input.span - Aggregation span in seconds (e.g., 86400 for daily)
 * @param input.period - Aggregation period (e.g., '1d', '1h')
 * @param input.searchWidth - Search window width for price samples
 *
 * @returns Chart data: { coins: { 'id': { decimals, symbol, confidence, prices: [{timestamp, price}] } } }
 *
 * @example
 * ```typescript
 * const chart = await getChartCoins({
 *   coins: 'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7',
 *   start: 1640995200,
 *   end: 1643673600,
 *   period: '1d'
 * });
 * // Returns daily price series for date range
 * ```
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
