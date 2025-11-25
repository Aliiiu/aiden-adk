import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetPricesCurrentCoinsInputSchema = z
	.object({
		coins: z
			.string()
			.describe(
				"Comma-separated list of coin identifiers (e.g., 'ethereum:0x...,bitcoin')",
			),
		searchWidth: z
			.union([z.string(), z.number()])
			.optional()
			.describe("Search window width to find nearby price points"),
	})
	.strict();

const CurrentCoinPriceSchema = z.object({
	decimals: z.number().describe("Token decimals"),
	price: z.number().describe("Current price in USD"),
	symbol: z.string().describe("Token symbol"),
	timestamp: z.number().describe("Unix timestamp for price quote"),
	confidence: z.number().optional().describe("Price confidence score"),
});

export const GetPricesCurrentCoinsResponseSchema = z.object({
	coins: z
		.record(z.string(), CurrentCoinPriceSchema)
		.describe("Mapping of coin identifiers to price data"),
});

export type GetPricesCurrentCoinsInput = z.infer<
	typeof GetPricesCurrentCoinsInputSchema
>;
export type GetPricesCurrentCoinsResponse = z.infer<
	typeof GetPricesCurrentCoinsResponseSchema
>;

/**
 * Get current prices for multiple coins/tokens by their DefiLlama identifiers (chain:address format).
 *
 * Returns current USD prices for batch lookups. This is for general price lookups across many chains.
 *
 * @param input.coins - Comma-separated coin identifiers in 'chain:address' format (e.g., 'ethereum:0x...bitcoin')
 * @param input.searchWidth - Search window width to find nearby price points
 *
 * @returns Mapping of coin identifiers to price data: { decimals, price, symbol, timestamp, confidence }
 *
 * @example
 * ```typescript
 * const prices = await getPricesCurrentCoins({
 *   coins: 'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7,coingecko:bitcoin'
 * });
 * // Returns: { coins: { 'ethereum:0x...': { price: 1.0, symbol: 'USDT', ... } } }
 * ```
 */
export async function getPricesCurrentCoins(
	input: GetPricesCurrentCoinsInput,
): Promise<GetPricesCurrentCoinsResponse> {
	return executeServiceMethod(
		"price",
		"getPricesCurrentCoins",
		input,
	) as Promise<GetPricesCurrentCoinsResponse>;
}
