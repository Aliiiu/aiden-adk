/**
 * Get coins by category with market data
 */

import { executeTool } from "../shared.js";

/**
 * Get coins by category with market data
 *
 * @param params.order - Sort order: market_cap_desc, market_cap_asc, etc.
 *
 * @returns Categories with market data
 *
 * @example
 * ```typescript
 * const categories = await getCoinsCategories({
 *   order: 'market_cap_desc'
 * });
 * ```
 */
export async function getCoinsCategories(params?: {
	order?: string;
}): Promise<any> {
	return executeTool("get_coins_categories", params || {});
}
