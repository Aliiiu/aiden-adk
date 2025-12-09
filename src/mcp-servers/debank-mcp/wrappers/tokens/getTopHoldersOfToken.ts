import { z } from "zod";
import { executeServiceMethod } from "../../shared";

export const GetTopHoldersOfTokenInputSchema = z.object({
	id: z.string().describe("Token contract address or native token ID"),
	chain_id: z.string().describe("Chain ID (e.g., 'eth', 'bsc', 'matic')"),
	start: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe("Pagination offset (default: 0, max: 10000)"),
	limit: z
		.number()
		.int()
		.positive()
		.max(1000)
		.optional()
		.describe("Max number of holders to include (default: 100)"),
});

const TokenHolderSchema = z
	.object({
		address: z.string().describe("Holder address"),
		amount: z.number().describe("Token amount held (decimal-adjusted)"),
		usd_value: z.number().describe("USD value of the holding"),
	})
	.loose();

export const GetTopHoldersOfTokenResponseSchema = z
	.array(TokenHolderSchema)
	.describe("Top token holders ordered by balance");

export type GetTopHoldersOfTokenInput = z.infer<
	typeof GetTopHoldersOfTokenInputSchema
>;
export type GetTopHoldersOfTokenResponse = z.infer<
	typeof GetTopHoldersOfTokenResponseSchema
>;

/**
 * Get the largest wallet holders of a token by contract address with their balances and USD values.
 *
 * Returns top holders ranked by balance. This is for analyzing token distribution and whale wallets.
 * For a specific user's token holdings, use getUserTokenList.
 * For protocol-level user distribution, use getTopHoldersOfProtocol.
 *
 * @param input.id - Token contract address or native token identifier
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic', 'arb')
 * @param input.start - Pagination offset (default: 0, max: 10000)
 * @param input.limit - Number of top holders to return (default: 100, max: 1000)
 *
 * @returns Array of top holders: wallet address, token amount, USD value
 *
 * @example
 * ```typescript
 * const holders = await getTopHoldersOfToken({
 *   id: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
 *   chain_id: 'eth',
 *   limit: 50
 * });
 * // Returns: [{ address: '0x...', amount: 1000000, usd_value: 1000000 }, ...]
 * ```
 */
export async function getTopHoldersOfToken(
	input: GetTopHoldersOfTokenInput,
): Promise<GetTopHoldersOfTokenResponse> {
	return executeServiceMethod(
		"token",
		"getTopHoldersOfToken",
		input,
	) as Promise<GetTopHoldersOfTokenResponse>;
}
