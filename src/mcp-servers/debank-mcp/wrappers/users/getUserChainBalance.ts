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
 * Get a specific wallet's total balance on a single chain.
 *
 * Returns USD value of all holdings for a wallet on one chain. This is wallet-specific balance.
 * For balances across all chains, use getUserTotalBalance.
 * For general token prices (not wallet-specific), use CoinGecko.
 *
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic', 'arb')
 * @param input.id - User's wallet address (e.g., '0x...')
 *
 * @returns Total USD value of wallet holdings on the specified chain
 *
 * @example
 * ```typescript
 * const balance = await getUserChainBalance({
 *   chain_id: 'eth',
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
 * });
 * console.log(balance.usd_value); // e.g., 15000
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
