/**
 * Get list of onchain categories for pools
 */

import { executeTool } from "../shared.js";

/**
 * Get list of onchain categories for filtering pools
 *
 * @returns List of categories (e.g., 'Meme', 'DeFi', 'GameFi')
 *
 * @example
 * ```typescript
 * const categories = await getOnchainCategories();
 * ```
 */
export async function getOnchainCategories(): Promise<any> {
	return executeTool("get_onchain_categories", {});
}
