/**
 * Get information for multiple tokens
 */

import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetListTokenInformationInputSchema = z.object({
	chain_id: z.string().describe("Chain ID (e.g., 'eth', 'bsc', 'matic')"),
	ids: z
		.string()
		.describe("Comma-separated list of token contract addresses (max 100)"),
});

const TokenSummarySchema = z.object({
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
	is_core: z.boolean().describe("Whether token is core"),
	is_wallet: z.boolean().describe("Wallet support indicator"),
	time_at: z.number().describe("Unix timestamp when token was added"),
	amount: z.number().describe("Token amount contextually returned"),
});

export const GetListTokenInformationResponseSchema = z
	.array(TokenSummarySchema)
	.describe("Detailed info for each requested token");

export type GetListTokenInformationInput = z.infer<
	typeof GetListTokenInformationInputSchema
>;
export type GetListTokenInformationResponse = z.infer<
	typeof GetListTokenInformationResponseSchema
>;

/**
 * Retrieve detailed information for multiple tokens at once
 *
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param input.ids - Comma-separated token addresses (up to 100)
 *
 * @returns Array of token details
 *
 * @example
 * ```typescript
 * const tokens = await getListTokenInformation({
 *   chain_id: 'eth',
 *   ids: '0xdac17f958d2ee523a2206206994597c13d831ec7,0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
 * });
 * console.log(tokens);
 * ```
 */
export async function getListTokenInformation(
	input: GetListTokenInformationInput,
): Promise<GetListTokenInformationResponse> {
	return executeServiceMethod(
		"token",
		"getListTokenInformation",
		input,
	) as Promise<GetListTokenInformationResponse>;
}
