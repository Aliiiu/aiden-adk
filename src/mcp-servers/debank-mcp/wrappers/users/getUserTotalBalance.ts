/**
 * Get user's total balance across all chains
 */

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
 * Retrieve a user's total net assets across all supported chains
 *
 * @param input.id - User's wallet address
 *
 * @returns Total USD value of assets
 *
 * @example
 * ```typescript
 * const balance = await getUserTotalBalance({
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
 * });
 * console.log(balance);
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
