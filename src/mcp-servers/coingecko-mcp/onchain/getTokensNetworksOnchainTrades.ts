import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetTokensNetworksOnchainTradesInputSchema = z.object({
	network: z.string().describe("Network identifier"),
	token_address: z.string().describe("Token contract address"),
	trade_volume_in_usd_greater_than: z
		.number()
		.optional()
		.describe("Filter trades above this USD volume"),
});

const TokenTradeAttributesSchema = z.object({
	block_number: z.number().nullable().optional(),
	block_timestamp: z.string(),
	kind: z.string(),
	pool_address: z.string().nullable().optional(),
	pool_dex: z.string().nullable().optional(),
	tx_hash: z.string(),
	tx_from_address: z.string().nullable().optional(),
	from_token_address: z.string().nullable().optional(),
	to_token_address: z.string().nullable().optional(),
	from_token_amount: z.string().nullable().optional(),
	to_token_amount: z.string().nullable().optional(),
	price_from_in_currency_token: z.string().nullable().optional(),
	price_from_in_usd: z.string().nullable().optional(),
	price_to_in_currency_token: z.string().nullable().optional(),
	price_to_in_usd: z.string().nullable().optional(),
	volume_in_usd: z.string().nullable().optional(),
});

const TokenTradeResourceSchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: TokenTradeAttributesSchema,
});

export const GetTokensNetworksOnchainTradesResponseSchema = z.object({
	data: z.array(TokenTradeResourceSchema),
});

export type GetTokensNetworksOnchainTradesInput = z.infer<
	typeof GetTokensNetworksOnchainTradesInputSchema
>;
export type GetTokensNetworksOnchainTradesResponse = z.infer<
	typeof GetTokensNetworksOnchainTradesResponseSchema
>;

/**
 * Get recent trades for a specific token across all pools
 *
 * @param params.network - Network ID
 * @param params.token_address - Token contract address
 * @param params.trade_volume_in_usd_greater_than - Minimum trade volume in USD
 *
 * @returns Recent trades involving the token
 *
 * @example
 * ```typescript
 * const trades = await getTokensNetworksOnchainTrades({
 *   network: 'eth',
 *   token_address: '0x...',
 *   trade_volume_in_usd_greater_than: 5000
 * });
 * ```
 */
export async function getTokensNetworksOnchainTrades(
	params: GetTokensNetworksOnchainTradesInput,
): Promise<GetTokensNetworksOnchainTradesResponse> {
	return executeTool(
		"get_tokens_networks_onchain_trades",
		params,
	) as Promise<GetTokensNetworksOnchainTradesResponse>;
}
