/**
 * Get historical price of a token
 */

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
 * Retrieve the historical price of a token for a given date
 *
 * @param input.id - Token contract address or native token ID
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param input.date_at - Date in format YYYY-MM-DD (e.g., '2023-05-18')
 *
 * @returns Historical price data for the specified date
 *
 * @example
 * ```typescript
 * const price = await getTokenHistoryPrice({
 *   id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
 *   chain_id: 'eth',
 *   date_at: '2023-05-18'
 * });
 * console.log(price);
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
