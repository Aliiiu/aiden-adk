/**
 * Get trending onchain pools
 */

import { executeTool } from "../shared.js";

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
export async function getPoolsOnchainTrendingSearch(): Promise<any> {
	return executeTool("get_pools_onchain_trending_search", {});
}
