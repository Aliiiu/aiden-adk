/**
 * Get onchain pools with advanced filtering
 */

import { executeTool } from "../shared.js";

/**
 * Get onchain pools with mega filter (advanced search)
 *
 * @param params.network - Network ID
 * @param params.dex - DEX filter
 * @param params.min_volume_usd - Minimum 24h volume in USD
 * @param params.max_volume_usd - Maximum 24h volume in USD
 * @param params.min_price_change_percentage_24h - Minimum 24h price change
 * @param params.max_price_change_percentage_24h - Maximum 24h price change
 * @param params.sort - Sort field
 * @param params.order - Sort order ('asc' or 'desc')
 * @param params.page - Page number
 *
 * @returns Filtered pools
 *
 * @example
 * ```typescript
 * const highVolumePools = await getPoolsOnchainMegafilter({
 *   network: 'eth',
 *   min_volume_usd: 1000000,
 *   sort: 'volume_usd_24h',
 *   order: 'desc'
 * });
 * ```
 */
export async function getPoolsOnchainMegafilter(params: {
	network?: string;
	dex?: string;
	min_volume_usd?: number;
	max_volume_usd?: number;
	min_price_change_percentage_24h?: number;
	max_price_change_percentage_24h?: number;
	sort?: string;
	order?: string;
	page?: number;
}): Promise<any> {
	return executeTool("get_pools_onchain_megafilter", params);
}
