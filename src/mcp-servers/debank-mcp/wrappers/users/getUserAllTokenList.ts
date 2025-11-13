/**
 * Get user's token balances across all chains
 */

import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetUserAllTokenListInputSchema = z.object({
	id: z.string().describe("User wallet address"),
	is_all: z
		.boolean()
		.optional()
		.describe("Include all tokens (default true, false filters dust)"),
	has_balance: z
		.boolean()
		.optional()
		.describe("Filter to tokens with non-zero balance"),
});

const UserTokenBalanceSchema = z
	.object({
		id: z.string(),
		chain: z.string(),
		name: z.string(),
		symbol: z.string(),
		display_symbol: z.string().nullable().optional(),
		optimized_symbol: z.string().optional(),
		decimals: z.number(),
		logo_url: z.string(),
		protocol_id: z.string().optional(),
		price: z.number(),
		is_verified: z.boolean(),
		is_core: z.boolean(),
		is_wallet: z.boolean().optional(),
		time_at: z.number(),
		amount: z.number(),
		raw_amount: z.number(),
		raw_amount_hex_str: z.string(),
		usd_value: z.number().optional(),
	})
	.describe("User token balance snapshot");

export const GetUserAllTokenListResponseSchema = z
	.array(UserTokenBalanceSchema)
	.describe("Tokens across all chains");

export type GetUserAllTokenListInput = z.infer<
	typeof GetUserAllTokenListInputSchema
>;
export type GetUserAllTokenListResponse = z.infer<
	typeof GetUserAllTokenListResponseSchema
>;

/**
 * Retrieve a user's token balances across all supported chains
 *
 * @param input.id - User's wallet address
 * @param input.is_all - Optional: include all tokens (default: true)
 * @param input.has_balance - Optional: only include tokens with a positive balance
 *
 * @returns Array of tokens across all chains
 *
 * @example
 * ```typescript
 * const tokens = await getUserAllTokenList({
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
 * });
 * console.log(tokens);
 * ```
 */
export async function getUserAllTokenList(
	input: GetUserAllTokenListInput,
): Promise<GetUserAllTokenListResponse> {
	return executeServiceMethod(
		"user",
		"getUserAllTokenList",
		input,
	) as Promise<GetUserAllTokenListResponse>;
}
