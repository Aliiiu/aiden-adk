import { z } from "zod";
import { executeServiceMethod } from "../../shared";

export const GetListTokenInformationInputSchema = z
	.object({
		chain_id: z.string().describe("Chain ID (e.g., 'eth', 'bsc', 'matic')"),
		ids: z
			.string()
			.describe("Comma-separated list of token contract addresses (max 100)"),
	})
	.strict();

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
 * Get general information for multiple tokens (prices, symbols, decimals) by contract addresses.
 *
 * Returns metadata and current prices for up to 100 tokens in one call. This is for batch token lookups.
 * For user-specific token balances in a wallet, use getUserTokenList or getUserAllTokenList.
 *
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic', 'arb')
 * @param input.ids - Comma-separated token contract addresses (max: 100)
 *
 * @returns Array of token metadata: name, symbol, decimals, current USD price, logo, verification
 *
 * @example
 * ```typescript
 * const tokens = await getListTokenInformation({
 *   chain_id: 'eth',
 *   ids: '0xdac17f958d2ee523a2206206994597c13d831ec7,0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
 * });
 * // Returns: [{ name: 'Tether USD', price: 1.0 }, { name: 'USD Coin', price: 1.0 }]
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
