import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetHistoricalPricesByContractAddressInputSchema = z
	.object({
		coins: z
			.string()
			.describe("Comma-separated coin identifiers (chain:address format)"),
		timestamp: z
			.union([z.string(), z.number()])
			.describe("Target timestamp (seconds, milliseconds, or ISO string)"),
		searchWidth: z
			.union([z.string(), z.number()])
			.optional()
			.describe("Search window width to find historical quotes"),
	})
	.strict();

const HistoricalCoinPriceSchema = z.object({
	decimals: z.number().describe("Token decimals"),
	price: z.number().describe("Price in USD"),
	symbol: z.string().describe("Token symbol"),
	timestamp: z.number().describe("Unix timestamp of price quote"),
	confidence: z.number().optional().describe("Confidence score"),
});

export const GetHistoricalPricesByContractAddressResponseSchema = z.object({
	coins: z
		.record(z.string(), HistoricalCoinPriceSchema)
		.describe("Historical prices mapped by coin identifier"),
});

export type GetHistoricalPricesByContractAddressInput = z.infer<
	typeof GetHistoricalPricesByContractAddressInputSchema
>;
export type GetHistoricalPricesByContractAddressResponse = z.infer<
	typeof GetHistoricalPricesByContractAddressResponseSchema
>;

/**
 * Get historical prices for coins at a specific timestamp by contract address (point-in-time lookup).
 *
 * Returns price snapshot at a specific time. This is for point-in-time historical price lookups.
 *
 * @param input.coins - Comma-separated coin identifiers in 'chain:address' format
 * @param input.timestamp - Target timestamp (Unix seconds, milliseconds, or ISO string)
 * @param input.searchWidth - Search window width to find historical quotes
 *
 * @returns Historical price at timestamp: { coins: { 'id': { decimals, price, symbol, timestamp, confidence } } }
 *
 * @example
 * ```typescript
 * const historicalPrice = await getHistoricalPricesByContractAddress({
 *   coins: 'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7',
 *   timestamp: 1640995200
 * });
 * // Returns price at that specific timestamp
 * ```
 */
export async function getHistoricalPricesByContractAddress(
	input: GetHistoricalPricesByContractAddressInput,
): Promise<GetHistoricalPricesByContractAddressResponse> {
	return executeServiceMethod(
		"price",
		"getHistoricalPricesByContractAddress",
		input,
	) as Promise<GetHistoricalPricesByContractAddressResponse>;
}
