import { z } from "zod";
import { executeTool } from "../shared";

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
 * Search for coins, exchanges, NFTs, and categories by name or symbol to discover CoinGecko IDs.
 *
 * Use this FIRST when you need to find a coin's CoinGecko ID before calling price functions.
 * Many coins have different IDs than their ticker symbols, so always search to confirm the correct ID.
 *
 * Workflow for price lookups:
 * 1. Use search({ query: 'coin name or symbol' }) to find the coin ID
 * 2. Extract the 'id' field from results.coins[0]
 * 3. Use getSimplePrice({ ids: 'found-id', vs_currencies: 'usd' })
 *
 * Returns coins, exchanges, NFTs, and categories matching the query.
 *
 * @param params.query - Search query (coin name, symbol, or keyword)
 *
 * @returns Search results: { coins: [{ id, name, symbol, ... }], exchanges: [...], nfts: [...] }
 *
 * @example
 * ```typescript
 * const results = await search({ query: 'bitcoin' });
 * // Returns: { coins: [{ id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', ... }], ... }
 *
 * // Then use the ID for price lookup
 * const price = await getSimplePrice({ ids: results.coins[0].id, vs_currencies: 'usd' });
 * ```
 */
export async function search(params: SearchInput): Promise<SearchResponse> {
	return executeTool("get_search", params) as Promise<SearchResponse>;
}
