import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetPricesFirstCoinsInputSchema = z
	.object({
		coins: z
			.string()
			.describe(
				"Comma-separated list of coin identifiers (e.g., 'ethereum:0x...,bitcoin')",
			),
	})
	.strict();

const FirstCoinPriceSchema = z.object({
	price: z.number().describe("First recorded price in USD"),
	symbol: z.string().describe("Token symbol"),
	timestamp: z.number().describe("Unix timestamp of the first price record"),
});

export const GetPricesFirstCoinsResponseSchema = z.object({
	coins: z
		.record(z.string(), FirstCoinPriceSchema)
		.describe("Mapping of coin identifiers to their first known price"),
});

export type GetPricesFirstCoinsInput = z.infer<
	typeof GetPricesFirstCoinsInputSchema
>;
export type GetPricesFirstCoinsResponse = z.infer<
	typeof GetPricesFirstCoinsResponseSchema
>;

/**
 * Get the first recorded price for coins (token launch price).
 *
 * Returns the earliest known price data. This is for finding token launch prices and initial listing dates.
 * For current prices, use getPricesCurrentCoins.
 * For historical prices at specific times, use getHistoricalPricesByContractAddress.
 *
 * @param input.coins - Comma-separated coin identifiers in 'chain:address' format
 *
 * @returns Mapping of coin IDs to first price: { coins: { 'id': { price, symbol, timestamp } } }
 *
 * @example
 * ```typescript
 * const firstPrices = await getPricesFirstCoins({
 *   coins: 'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7'
 * });
 * // Returns: { coins: { 'ethereum:0x...': { price: 1.0, timestamp: 1587945600 } } }
 * ```
 */
export async function getPricesFirstCoins(
	input: GetPricesFirstCoinsInput,
): Promise<GetPricesFirstCoinsResponse> {
	return executeServiceMethod(
		"price",
		"getPricesFirstCoins",
		input,
	) as Promise<GetPricesFirstCoinsResponse>;
}
