/**
 * Get user's balance on a specific chain
 */

import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetUserChainBalanceInputSchema = z.object({
	chain_id: z.string().describe("Chain ID (e.g., 'eth', 'bsc', 'matic')"),
	id: z.string().describe("User wallet address"),
});

export const GetUserChainBalanceResponseSchema = z.object({
	usd_value: z.number().describe("Balance value in USD"),
});

export type GetUserChainBalanceInput = z.infer<
	typeof GetUserChainBalanceInputSchema
>;
export type GetUserChainBalanceResponse = z.infer<
	typeof GetUserChainBalanceResponseSchema
>;

/**
 * Fetch the current balance of a user on a specified chain
 *
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param input.id - User's wallet address
 *
 * @returns Balance in USD value
 *
 * @example
 * ```typescript
 * const balance = await getUserChainBalance({
 *   chain_id: 'eth',
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
 * });
 * console.log(balance);
 * ```
 */
export async function getUserChainBalance(
	input: GetUserChainBalanceInput,
): Promise<GetUserChainBalanceResponse> {
	return executeServiceMethod(
		"user",
		"getUserChainBalance",
		input,
	) as Promise<GetUserChainBalanceResponse>;
}
