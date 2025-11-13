/**
 * Get NFT collection data (name, floor price, 24h volume, etc.) based on asset platform and/or collection id
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetNftsMarketsInputSchema = z.object({
	asset_platform_id: z
		.string()
		.describe("Asset platform ID (e.g., 'ethereum')"),
	order: z
		.string()
		.optional()
		.describe("Sort order (market_cap_usd_desc, h24_volume_native_desc, etc.)"),
	per_page: z
		.number()
		.int()
		.positive()
		.optional()
		.describe("Results per page (default 100)"),
	page: z
		.number()
		.int()
		.positive()
		.optional()
		.describe("Page number (default 1)"),
});

const NftMarketEntrySchema = z
	.object({
		id: z.string(),
		contract_address: z.string().nullable().optional(),
		name: z.string(),
		symbol: z.string().nullable().optional(),
		image: z.string().url().nullable().optional(),
		market_cap_usd: z.number().nullable().optional(),
		floor_price_usd: z.number().nullable().optional(),
		floor_price_native_currency: z.number().nullable().optional(),
		volume_24h: z.number().nullable().optional(),
		volume_24h_percentage_change: z.number().nullable().optional(),
		number_of_sales_24h: z.number().nullable().optional(),
	})
	.loose();

export const GetNftsMarketsResponseSchema = z.array(NftMarketEntrySchema);

export type GetNftsMarketsInput = z.infer<typeof GetNftsMarketsInputSchema>;
export type GetNftsMarketsResponse = z.infer<
	typeof GetNftsMarketsResponseSchema
>;

/**
 * Get NFT market data for collections
 *
 * @param params.asset_platform_id - Asset platform ID (required)
 * @param params.order - Sort order
 * @param params.per_page - Results per page (default: 100)
 * @param params.page - Page number (default: 1)
 *
 * @returns NFT market data including floor price, volume, market cap
 *
 * @example
 * ```typescript
 * const markets = await getNftsMarkets({
 *   asset_platform_id: 'ethereum',
 *   order: 'market_cap_usd_desc',
 *   per_page: 10
 * });
 * ```
 */
export async function getNftsMarkets(
	params: GetNftsMarketsInput,
): Promise<GetNftsMarketsResponse> {
	return executeTool(
		"get_markets_nfts",
		params,
	) as Promise<GetNftsMarketsResponse>;
}
