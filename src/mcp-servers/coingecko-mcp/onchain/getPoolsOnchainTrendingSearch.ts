import { z } from "zod";
import { executeTool } from "../shared";

const RelationshipRefSchema = z.object({
	data: z
		.object({
			id: z.string(),
			type: z.string(),
		})
		.nullable()
		.optional(),
});

const TrendingPoolAttributesSchema = z
	.object({
		name: z.string(),
		address: z.string(),
		trending_rank: z.number().nullable().optional(),
		fdv_usd: z.string().nullable().optional(),
		market_cap_usd: z.string().nullable().optional(),
		reserve_in_usd: z.string().nullable().optional(),
		volume_usd: z
			.object({
				h24: z.string().nullable().optional(),
			})
			.optional(),
	})
	.loose();

const TrendingPoolSchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: TrendingPoolAttributesSchema,
	relationships: z
		.object({
			base_token: RelationshipRefSchema.optional(),
			quote_token: RelationshipRefSchema.optional(),
			dex: RelationshipRefSchema.optional(),
			network: RelationshipRefSchema.optional(),
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

export const GetPoolsOnchainTrendingSearchResponseSchema = z.object({
	data: z.array(TrendingPoolSchema),
	included: z.array(IncludedEntitySchema).optional(),
});

export type GetPoolsOnchainTrendingSearchResponse = z.infer<
	typeof GetPoolsOnchainTrendingSearchResponseSchema
>;

/**
 * Get trending onchain pools across all networks
 *
 * @returns List of trending pools with volume, price change data
 *
 * @example
 * ```typescript
 * const trending = await getPoolsOnchainTrendingSearch();
 * ```
 */
export async function getPoolsOnchainTrendingSearch(): Promise<GetPoolsOnchainTrendingSearchResponse> {
	return executeTool(
		"get_pools_onchain_trending_search",
		{},
	) as Promise<GetPoolsOnchainTrendingSearchResponse>;
}
