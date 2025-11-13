/**
 * Get onchain pools filtered by category
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetPoolsOnchainCategoriesInputSchema = z.object({
	category: z.string().describe("Category slug (e.g., 'meme')"),
	network: z.string().optional().describe("Optional network filter"),
	page: z.number().int().positive().optional().describe("Page number"),
});

const PriceChangeSchema = z.object({
	h1: z.string().nullable().optional(),
	h6: z.string().nullable().optional(),
	h24: z.string().nullable().optional(),
	m5: z.string().nullable().optional(),
	m15: z.string().nullable().optional(),
	m30: z.string().nullable().optional(),
});

const PoolAttributesSchema = z.object({
	name: z.string(),
	address: z.string(),
	base_token_price_usd: z.string().nullable().optional(),
	base_token_price_native_currency: z.string().nullable().optional(),
	base_token_price_quote_token: z.string().nullable().optional(),
	quote_token_price_usd: z.string().nullable().optional(),
	quote_token_price_native_currency: z.string().nullable().optional(),
	quote_token_price_base_token: z.string().nullable().optional(),
	fdv_usd: z.string().nullable().optional(),
	market_cap_usd: z.string().nullable().optional(),
	reserve_in_usd: z.string().nullable().optional(),
	h24_volume_usd: z.string().nullable().optional(),
	h24_tx_count: z.number().nullable().optional(),
	pool_created_at: z.string().nullable().optional(),
	price_change_percentage: PriceChangeSchema.optional(),
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

const PoolRelationshipsSchema = z.object({
	base_token: RelationshipRefSchema.optional(),
	quote_token: RelationshipRefSchema.optional(),
	dex: RelationshipRefSchema.optional(),
	network: RelationshipRefSchema.optional(),
});

const PoolResourceSchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: PoolAttributesSchema,
	relationships: PoolRelationshipsSchema.optional(),
});

const IncludedEntitySchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: z
		.object({
			address: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
			symbol: z.string().nullable().optional(),
			decimals: z.number().nullable().optional(),
			coingecko_coin_id: z.string().nullable().optional(),
			image_url: z.string().nullable().optional(),
		})
		.loose(),
});

export const GetPoolsOnchainCategoriesResponseSchema = z.object({
	data: z.array(PoolResourceSchema),
	included: z.array(IncludedEntitySchema).optional(),
});

export type GetPoolsOnchainCategoriesInput = z.infer<
	typeof GetPoolsOnchainCategoriesInputSchema
>;
export type GetPoolsOnchainCategoriesResponse = z.infer<
	typeof GetPoolsOnchainCategoriesResponseSchema
>;

/**
 * Get onchain pools filtered by category
 *
 * @param params.category - Category slug (e.g., 'meme', 'defi')
 * @param params.network - Optional network filter
 * @param params.page - Page number (default: 1)
 *
 * @returns Pools in the specified category
 *
 * @example
 * ```typescript
 * const memePools = await getPoolsOnchainCategories({
 *   category: 'meme',
 *   network: 'eth'
 * });
 * ```
 */
export async function getPoolsOnchainCategories(
	params: GetPoolsOnchainCategoriesInput,
): Promise<GetPoolsOnchainCategoriesResponse> {
	return executeTool(
		"get_pools_onchain_categories",
		params,
	) as Promise<GetPoolsOnchainCategoriesResponse>;
}
