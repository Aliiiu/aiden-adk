/**
 * Get list of all supported NFT collections
 */

import { executeTool } from "../shared.js";

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
export async function getNftsList(params?: {
	order?: string;
	asset_platform_id?: string;
	per_page?: number;
	page?: number;
}): Promise<any> {
	return executeTool("get_list_nfts", params || {});
}
