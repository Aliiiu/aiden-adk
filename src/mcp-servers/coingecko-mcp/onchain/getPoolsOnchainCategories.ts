/**
 * Get onchain pools filtered by category
 */

import { executeTool } from "../shared.js";

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
export async function getPoolsOnchainCategories(params: {
	category: string;
	network?: string;
	page?: number;
}): Promise<any> {
	return executeTool("get_pools_onchain_categories", params);
}
