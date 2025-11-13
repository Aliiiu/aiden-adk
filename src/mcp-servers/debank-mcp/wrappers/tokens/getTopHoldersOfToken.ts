/**
 * Get top holders of a token
 */

import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

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
 * Fetch the top holders of a specified token
 *
 * @param input.id - Token contract address or native token ID
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param input.start - Optional pagination offset (default: 0, max: 10000)
 * @param input.limit - Optional max number of holders (default: 100)
 *
 * @returns Array of top token holders
 *
 * @example
 * ```typescript
 * const holders = await getTopHoldersOfToken({
 *   id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
 *   chain_id: 'eth',
 *   limit: 50
 * });
 * console.log(holders);
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
