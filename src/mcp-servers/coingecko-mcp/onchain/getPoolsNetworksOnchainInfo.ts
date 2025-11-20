import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetPoolsNetworksOnchainInfoInputSchema = z.object({
	network: z.string().describe("Network identifier"),
	pool_address: z.string().describe("Pool contract address"),
});

const PoolInfoAttributesSchema = z
	.object({
		name: z.string(),
		symbol: z.string().nullable().optional(),
		address: z.string(),
		description: z.string().nullable().optional(),
		image_url: z.string().nullable().optional(),
		categories: z.array(z.string()).optional(),
		websites: z.array(z.string()).optional(),
		discord_url: z.string().nullable().optional(),
		twitter_handle: z.string().nullable().optional(),
		telegram_handle: z.string().nullable().optional(),
	})
	.loose();

const PoolInfoResourceSchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: PoolInfoAttributesSchema,
});

const IncludedEntitySchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: z
		.object({
			base_token_address: z.string().nullable().optional(),
			quote_token_address: z.string().nullable().optional(),
			sentiment_vote_positive_percentage: z.number().nullable().optional(),
			sentiment_vote_negative_percentage: z.number().nullable().optional(),
		})
		.loose()
		.optional(),
});

export const GetPoolsNetworksOnchainInfoResponseSchema = z.object({
	data: z.array(PoolInfoResourceSchema),
	included: z.array(IncludedEntitySchema).optional(),
});

export type GetPoolsNetworksOnchainInfoInput = z.infer<
	typeof GetPoolsNetworksOnchainInfoInputSchema
>;
export type GetPoolsNetworksOnchainInfoResponse = z.infer<
	typeof GetPoolsNetworksOnchainInfoResponseSchema
>;

/**
 * Get detailed information for a specific DEX trading pool (liquidity pair) by contract address.
 *
 * Returns onchain DEX pool metadata, token pair info, and social links. This is for specific pool lookups by address.
 * For protocol TVL or yield data, use DefiLlama. For discovering pools by token, use getSearchOnchainPools.
 *
 * @param params.network - Network ID (e.g., 'eth', 'bsc', 'polygon')
 * @param params.pool_address - Pool contract address on the specified network
 *
 * @returns DEX pool details: name, symbol, token addresses, categories, social links
 *
 * @example
 * ```typescript
 * const poolInfo = await getPoolsNetworksOnchainInfo({
 *   network: 'eth',
 *   pool_address: '0x...'
 * });
 * ```
 */
export async function getPoolsNetworksOnchainInfo(
	params: GetPoolsNetworksOnchainInfoInput,
): Promise<GetPoolsNetworksOnchainInfoResponse> {
	return executeTool(
		"get_pools_networks_onchain_info",
		params,
	) as Promise<GetPoolsNetworksOnchainInfoResponse>;
}
