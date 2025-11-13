/**
 * Get list of tokens held by a user on a chain
 */

import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetUserTokenListInputSchema = z.object({
	id: z.string().describe("User wallet address"),
	chain_id: z.string().describe("Chain ID (e.g., 'eth', 'bsc', 'matic')"),
	is_all: z
		.boolean()
		.optional()
		.describe("Include all tokens (default: true, false filters dust)"),
	has_balance: z
		.boolean()
		.optional()
		.describe("Filter out tokens with zero balance when true"),
});

const UserTokenBalanceSchema = z.object({
	id: z.string().describe("Token identifier"),
	chain: z.string().describe("Chain ID"),
	name: z.string().describe("Token name"),
	symbol: z.string().describe("Token symbol"),
	display_symbol: z
		.string()
		.nullable()
		.optional()
		.describe("Display-friendly symbol"),
	optimized_symbol: z.string().optional().describe("Optimized symbol"),
	decimals: z.number().describe("Token decimals"),
	logo_url: z.string().url().describe("Token logo URL"),
	protocol_id: z.string().describe("Owning protocol identifier"),
	price: z.number().describe("Current USD price"),
	is_verified: z.boolean().describe("Verification flag"),
	is_core: z.boolean().describe("Core token indicator"),
	is_wallet: z.boolean().describe("Wallet support indicator"),
	time_at: z.number().describe("Timestamp of last update"),
	amount: z.number().describe("Token amount (decimal-adjusted)"),
	raw_amount: z.number().describe("Raw integer amount"),
	raw_amount_hex_str: z.string().describe("Raw amount expressed as hex string"),
	usd_value: z.number().optional().describe("Computed USD value"),
});

export const GetUserTokenListResponseSchema = z
	.array(UserTokenBalanceSchema)
	.describe("Token balances for the user on the requested chain");

export type GetUserTokenListInput = z.infer<typeof GetUserTokenListInputSchema>;
export type GetUserTokenListResponse = z.infer<
	typeof GetUserTokenListResponseSchema
>;

/**
 * Retrieve a list of tokens held by a user on a specific chain
 *
 * @param input.id - User's wallet address
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param input.is_all - Optional: include all tokens (default: true)
 * @param input.has_balance - Optional: include only tokens with non-zero balance
 *
 * @returns Array of tokens with balances
 *
 * @example
 * ```typescript
 * const tokens = await getUserTokenList({
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   chain_id: 'eth'
 * });
 * console.log(tokens);
 * ```
 */
export async function getUserTokenList(
	input: GetUserTokenListInput,
): Promise<GetUserTokenListResponse> {
	return executeServiceMethod(
		"user",
		"getUserTokenList",
		input,
	) as Promise<GetUserTokenListResponse>;
}
