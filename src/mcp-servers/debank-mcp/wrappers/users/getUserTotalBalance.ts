import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetUserTotalBalanceInputSchema = z.object({
	id: z.string().describe("User wallet address"),
});

const ChainBalanceBreakdownSchema = z.object({
	id: z.string().describe("Chain identifier"),
	community_id: z.number().describe("Internal DeBank identifier for the chain"),
	name: z.string().describe("Chain name"),
	logo_url: z.string().url().describe("Chain logo URL"),
	native_token_id: z.string().describe("Native token identifier"),
	wrapped_token_id: z.string().describe("Wrapped token identifier"),
	usd_value: z.number().describe("USD value held on this chain"),
});

export const GetUserTotalBalanceResponseSchema = z.object({
	total_usd_value: z.number().describe("Total USD value across all chains"),
	chain_list: z
		.array(ChainBalanceBreakdownSchema)
		.describe("Per-chain USD value breakdown"),
});

export type GetUserTotalBalanceInput = z.infer<
	typeof GetUserTotalBalanceInputSchema
>;
export type GetUserTotalBalanceResponse = z.infer<
	typeof GetUserTotalBalanceResponseSchema
>;

/**
 * Get a user's total wallet balance (net worth) aggregated across all supported chains.
 *
 * Returns the total USD value of a specific wallet address across all chains with per-chain breakdown.
 * This is wallet-specific analysis. For general token prices (not tied to a wallet), use CoinGecko.
 * For protocol-level TVL aggregates (not user-specific), use DefiLlama.
 *
 * @param input.id - User's wallet address (e.g., '0x...')
 *
 * @returns Total USD value across all chains with per-chain breakdown
 *
 * @example
 * ```typescript
 * const balance = await getUserTotalBalance({
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
 * });
 * console.log(balance.total_usd_value); // Total net worth
 * console.log(balance.chain_list); // Per-chain values
 * ```
 */
export async function getUserTotalBalance(
	input: GetUserTotalBalanceInput,
): Promise<GetUserTotalBalanceResponse> {
	return executeServiceMethod(
		"user",
		"getUserTotalBalance",
		input,
	) as Promise<GetUserTotalBalanceResponse>;
}
