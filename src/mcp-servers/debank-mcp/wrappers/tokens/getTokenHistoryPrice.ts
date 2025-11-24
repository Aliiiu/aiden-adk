import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetTokenHistoryPriceInputSchema = z.object({
	id: z.string().describe("Token contract address or native token ID"),
	chain_id: z.string().describe("Chain ID (e.g., 'eth', 'bsc', 'matic')"),
	date_at: z.string().describe("Date in YYYY-MM-DD format"),
});

export const GetTokenHistoryPriceResponseSchema = z.object({
	id: z.string().describe("Token identifier"),
	chain: z.string().describe("Chain ID"),
	price: z.number().describe("Historical price in USD"),
	date: z.string().describe("Date corresponding to the price"),
});

export type GetTokenHistoryPriceInput = z.infer<
	typeof GetTokenHistoryPriceInputSchema
>;
export type GetTokenHistoryPriceResponse = z.infer<
	typeof GetTokenHistoryPriceResponseSchema
>;

/**
 * Get historical price of a token on a specific date by contract address.
 *
 * Returns single-day historical price. This is for point-in-time price lookups by contract address.
 * For price ranges ("last N days", "from X to Y"), use CoinGecko getRangeCoinsMarketChart.
 * For user's historical portfolio value, use getUserTokenList with historical wallet analysis.
 *
 * @param input.id - Token contract address or native token identifier
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic', 'arb')
 * @param input.date_at - Date in YYYY-MM-DD format (e.g., '2023-05-18')
 *
 * @returns Historical price in USD for the specified date
 *
 * @example
 * ```typescript
 * const price = await getTokenHistoryPrice({
 *   id: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
 *   chain_id: 'eth',
 *   date_at: '2023-05-18'
 * });
 * console.log(price.price); // e.g., 0.9998
 * ```
 */
export async function getTokenHistoryPrice(
	input: GetTokenHistoryPriceInput,
): Promise<GetTokenHistoryPriceResponse> {
	return executeServiceMethod(
		"token",
		"getTokenHistoryPrice",
		input,
	) as Promise<GetTokenHistoryPriceResponse>;
}
