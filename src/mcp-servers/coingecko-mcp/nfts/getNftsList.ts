/**
 * Get list of all supported NFT collections
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetNftsListInputSchema = z
	.object({
		order: z
			.string()
			.optional()
			.describe("Sort field (e.g., h24_volume_native_desc)"),
		asset_platform_id: z
			.string()
			.optional()
			.describe("Filter by asset platform"),
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
	})
	.optional();

const NftCollectionSchema = z
	.object({
		id: z.string(),
		contract_address: z.string().nullable().optional(),
		asset_platform_id: z.string().nullable().optional(),
		name: z.string(),
		symbol: z.string().nullable().optional(),
		image: z.string().url().nullable().optional(),
		market_cap: z.number().nullable().optional(),
		floor_price_in_native_currency: z.number().nullable().optional(),
		volume_24h: z.number().nullable().optional(),
		volume_24h_change: z.number().nullable().optional(),
	})
	.loose();

export const GetNftsListResponseSchema = z.array(NftCollectionSchema);

export type GetNftsListInput = z.infer<typeof GetNftsListInputSchema>;
export type GetNftsListResponse = z.infer<typeof GetNftsListResponseSchema>;

/**
 * Get list of all supported NFT collections
 *
 * @param params.order - Sort order: 'h24_volume_native_asc', 'h24_volume_native_desc', etc.
 * @param params.asset_platform_id - Filter by asset platform (e.g., 'ethereum')
 * @param params.per_page - Results per page (default: 100)
 * @param params.page - Page number (default: 1)
 *
 * @returns List of NFT collections with basic info
 *
 * @example
 * ```typescript
 * const nfts = await getNftsList({
 *   order: 'h24_volume_native_desc',
 *   per_page: 10
 * });
 * ```
 */
export async function getNftsList(
	params?: GetNftsListInput,
): Promise<GetNftsListResponse> {
	return executeTool(
		"get_list_nfts",
		params ?? {},
	) as Promise<GetNftsListResponse>;
}
