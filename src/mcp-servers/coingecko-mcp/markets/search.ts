/**
 * Search the CoinGecko catalog for coins, exchanges, categories, and NFT collections.
 *
 * Use this to discover canonical coin IDs before price/market calls, or to find
 * exchanges and NFT collections matching a keyword.
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const SearchInputSchema = z.object({
	query: z.string().describe("Search query string"),
});

const SearchCoinSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		api_symbol: z.string().optional(),
		symbol: z.string(),
		market_cap_rank: z.number().nullable().optional(),
		thumb: z.string().url().optional(),
		large: z.string().url().optional(),
	})
	.loose();

const SearchExchangeSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		market_type: z.string().optional(),
		thumb: z.string().url().optional(),
		large: z.string().url().optional(),
	})
	.loose();

const SearchNftSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		symbol: z.string().nullable().optional(),
		thumb: z.string().url().optional(),
	})
	.loose();

const SearchCategorySchema = z.object({
	id: z.number(),
	name: z.string(),
});

export const SearchResponseSchema = z.object({
	coins: z.array(SearchCoinSchema),
	exchanges: z.array(SearchExchangeSchema).optional(),
	nfts: z.array(SearchNftSchema).optional(),
	categories: z.array(SearchCategorySchema).optional(),
	icos: z.array(z.unknown()).optional(),
});

export type SearchInput = z.infer<typeof SearchInputSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

/**
 * Search for coins, exchanges, and NFTs
 *
 * @param params.query - Search query
 *
 * @returns Search results
 *
 * @example
 * ```typescript
 * const results = await search({ query: 'bitcoin' });
 * ```
 */
export async function search(params: SearchInput): Promise<SearchResponse> {
	return executeTool("get_search", params) as Promise<SearchResponse>;
}
