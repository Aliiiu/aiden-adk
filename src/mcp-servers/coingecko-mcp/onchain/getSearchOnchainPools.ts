/**
 * Search for onchain pools
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetSearchOnchainPoolsInputSchema = z.object({
	query: z.string().describe("Search term (token name, symbol, or address)"),
	network: z.string().optional().describe("Optional network filter"),
});

const RelationshipRefSchema = z.object({
	data: z
		.object({
			id: z.string(),
			type: z.string(),
		})
		.nullable()
		.optional(),
});

const SearchPoolAttributesSchema = z
	.object({
		name: z.string(),
		address: z.string(),
		base_token_price_usd: z.string().nullable().optional(),
		quote_token_price_usd: z.string().nullable().optional(),
		reserve_in_usd: z.string().nullable().optional(),
		h24_volume_usd: z.string().nullable().optional(),
	})
	.loose();

const SearchPoolResourceSchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: SearchPoolAttributesSchema,
	relationships: z
		.object({
			base_token: RelationshipRefSchema.optional(),
			quote_token: RelationshipRefSchema.optional(),
			dex: RelationshipRefSchema.optional(),
		})
		.partial()
		.optional(),
});

const IncludedEntitySchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: z
		.object({
			address: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
			symbol: z.string().nullable().optional(),
			image_url: z.string().nullable().optional(),
		})
		.loose()
		.optional(),
});

export const GetSearchOnchainPoolsResponseSchema = z.object({
	data: z.array(SearchPoolResourceSchema),
	included: z.array(IncludedEntitySchema).optional(),
});

export type GetSearchOnchainPoolsInput = z.infer<
	typeof GetSearchOnchainPoolsInputSchema
>;
export type GetSearchOnchainPoolsResponse = z.infer<
	typeof GetSearchOnchainPoolsResponseSchema
>;

/**
 * Search for DEX trading pools (liquidity pairs) by token name, symbol, or contract address.
 *
 * Returns onchain DEX pools for trading specific token pairs. For protocol TVL data or yield farming pools, use DefiLlama functions instead.
 *
 * @param params.query - Search query (token name, symbol, or contract address)
 * @param params.network - Optional network filter (e.g., 'eth', 'bsc')
 *
 * @returns Matching DEX pools with trading pair info, token prices, 24h volume, reserves
 *
 * @example
 * ```typescript
 * const results = await getSearchOnchainPools({
 *   query: 'USDC',
 *   network: 'eth'
 * });
 * ```
 */
export async function getSearchOnchainPools(
	params: GetSearchOnchainPoolsInput,
): Promise<GetSearchOnchainPoolsResponse> {
	return executeTool(
		"get_search_onchain_pools",
		params,
	) as Promise<GetSearchOnchainPoolsResponse>;
}
