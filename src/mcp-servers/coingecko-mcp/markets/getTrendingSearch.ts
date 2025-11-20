import { z } from "zod";
import { executeTool } from "../shared.js";

const TrendingCoinItemSchema = z
	.object({
		id: z.string(),
		coin_id: z.number().nullable().optional(),
		name: z.string(),
		symbol: z.string(),
		market_cap_rank: z.number().nullable().optional(),
		thumb: z.string().url().optional(),
		small: z.string().url().optional(),
		large: z.string().url().optional(),
		slug: z.string().nullable().optional(),
		price_btc: z.number().nullable().optional(),
		score: z.number().optional(),
	})
	.loose();

const TrendingCoinSchema = z.object({
	item: TrendingCoinItemSchema,
});

const TrendingCategorySchema = z.object({
	id: z.number(),
	name: z.string(),
	market_cap_1h_change: z.number().nullable().optional(),
	top_3_coins: z.array(z.string()).optional(),
	volume_24h: z.number().nullable().optional(),
});

const TrendingNftSchema = z.object({
	id: z.string(),
	name: z.string(),
	symbol: z.string().nullable().optional(),
	thumb: z.string().url().optional(),
	nft_contract_id: z.number().nullable().optional(),
	score: z.number().optional(),
});

export const GetTrendingSearchResponseSchema = z.object({
	coins: z.array(TrendingCoinSchema),
	nfts: z.array(z.object({ item: TrendingNftSchema }).optional()).optional(),
	categories: z.array(TrendingCategorySchema).optional(),
});

export type GetTrendingSearchResponse = z.infer<
	typeof GetTrendingSearchResponseSchema
>;

/**
 * Get CoinGecko's trending search coins and NFT collections over the last 24 hours.
 *
 * Use this to surface currently popular assets based on user search activity.
 *
 * @returns Trending coins and NFT collections
 *
 * @example
 * ```typescript
 * const trending = await getTrendingSearch();
 * ```
 */
export async function getTrendingSearch(): Promise<GetTrendingSearchResponse> {
	return executeTool(
		"get_search_trending",
		{},
	) as Promise<GetTrendingSearchResponse>;
}
