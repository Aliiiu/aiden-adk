import { z } from "zod";
import { executeTool } from "../shared";

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
 * WORKFLOW:
 * 1. Use getSearchOnchainPools({ query: 'token-name', network: 'network-id' }) to find pools
 * 2. Extract pool address from search results
 * 3. Use getPoolsNetworksOnchainInfo with the discovered pool address
 *
 * @param params.network - Network ID (e.g., 'eth', 'bsc', 'polygon') - use getOnchainNetworks to get valid IDs
 * @param params.pool_address - Pool contract address on the specified network (must exist in CoinGecko database)
 *
 * @returns DEX pool details: name, symbol, token addresses, categories, social links
 *
 * @example
 * ```typescript
 * // CORRECT: Discover pools first, then get details
 * const pools = await getSearchOnchainPools({ query: 'USDC', network: 'eth' });
 * const poolAddress = pools.data[0]?.attributes.address;
 *
 * const poolInfo = await getPoolsNetworksOnchainInfo({
 *   network: 'eth',
 *   pool_address: poolAddress
 * });
 *
 * // WRONG: Using arbitrary address without verification (will likely 404)
 * // const poolInfo = await getPoolsNetworksOnchainInfo({
 * //   network: 'eth',
 * //   pool_address: '0x1234...' // Don't do this!
 * // });
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
