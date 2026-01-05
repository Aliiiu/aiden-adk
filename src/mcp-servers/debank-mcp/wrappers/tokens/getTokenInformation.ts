import { z } from "zod";
import { executeServiceMethod } from "../../shared";

export const GetTokenInformationInputSchema = z.object({
	chain_id: z.string().describe("Chain ID (e.g., 'eth', 'bsc', 'matic')"),
	id: z.string().describe("Token contract address or native token identifier"),
});

const TokenInformationSchema = z.object({
	id: z.string().describe("Token identifier"),
	chain: z.string().describe("Chain ID"),
	name: z.string().describe("Token name"),
	symbol: z.string().describe("Token symbol"),
	display_symbol: z
		.string()
		.nullable()
		.optional()
		.describe("Display-friendly symbol"),
	optimized_symbol: z.string().optional().describe("Optimized symbol for UI"),
	decimals: z.number().describe("Token decimals"),
	logo_url: z.string().url().describe("Token logo URL"),
	protocol_id: z.string().describe("Owning protocol identifier"),
	price: z.number().describe("Current USD price"),
	is_verified: z.boolean().describe("Whether token is verified by DeBank"),
	is_core: z.boolean().describe("Whether token is considered core"),
	is_wallet: z.boolean().describe("Whether token is supported in wallets"),
	time_at: z.number().describe("Unix timestamp when token was first tracked"),
	amount: z.number().describe("Token amount if returned with balances"),
});

export const GetTokenInformationResponseSchema = TokenInformationSchema;

export type GetTokenInformationInput = z.infer<
	typeof GetTokenInformationInputSchema
>;
export type GetTokenInformationResponse = z.infer<
	typeof GetTokenInformationResponseSchema
>;

/**
 * Get general token information (price, symbol, decimals, logo) by contract address.
 *
 * Returns token metadata and current price. This is for general token lookups by contract address.
 * For user-specific token balances in a wallet, use getUserTokenList.
 *
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic', 'arb')
 * @param input.id - Token contract address or native token identifier
 *
 * @returns Token metadata: name, symbol, decimals, current USD price, logo, verification status
 *
 * @example
 * ```typescript
 * const token = await getTokenInformation({
 *   chain_id: 'eth',
 *   id: '0xdac17f958d2ee523a2206206994597c13d831ec7' // USDT
 * });
 * console.log(token.price); // Current price
 * ```
 */
export async function getTokenInformation(
	input: GetTokenInformationInput,
): Promise<GetTokenInformationResponse> {
	return executeServiceMethod(
		"token",
		"getTokenInformation",
		input,
	) as Promise<GetTokenInformationResponse>;
}
