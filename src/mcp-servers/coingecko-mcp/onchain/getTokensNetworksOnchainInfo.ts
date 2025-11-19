import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetTokensNetworksOnchainInfoInputSchema = z.object({
	network: z.string().describe("Network identifier"),
	token_address: z.string().describe("Token contract address"),
});

const TokenInfoAttributesSchema = z
	.object({
		address: z.string(),
		name: z.string(),
		symbol: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		coingecko_coin_id: z.string().nullable().optional(),
		categories: z.array(z.string()).optional(),
		websites: z.array(z.string()).optional(),
		discord_url: z.string().nullable().optional(),
		twitter_handle: z.string().nullable().optional(),
		telegram_handle: z.string().nullable().optional(),
		image_url: z.string().nullable().optional(),
	})
	.loose();

export const GetTokensNetworksOnchainInfoResponseSchema = z.object({
	data: z.object({
		id: z.string(),
		type: z.string(),
		attributes: TokenInfoAttributesSchema,
	}),
});

export type GetTokensNetworksOnchainInfoInput = z.infer<
	typeof GetTokensNetworksOnchainInfoInputSchema
>;
export type GetTokensNetworksOnchainInfoResponse = z.infer<
	typeof GetTokensNetworksOnchainInfoResponseSchema
>;

/**
 * Get detailed information for a token on a network
 *
 * @param params.network - Network ID (e.g., 'eth', 'bsc')
 * @param params.token_address - Token contract address
 *
 * @returns Token details including supply, holders, price
 *
 * @example
 * ```typescript
 * const tokenInfo = await getTokensNetworksOnchainInfo({
 *   network: 'eth',
 *   token_address: '0x...'
 * });
 * ```
 */
export async function getTokensNetworksOnchainInfo(
	params: GetTokensNetworksOnchainInfoInput,
): Promise<GetTokensNetworksOnchainInfoResponse> {
	return executeTool(
		"get_tokens_networks_onchain_info",
		params,
	) as Promise<GetTokensNetworksOnchainInfoResponse>;
}
