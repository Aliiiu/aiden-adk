/**
 * Get list of all coin categories
 */

import { executeTool } from "../shared.js";

/**
 * Get list of all coin categories
 *
 * @returns Array of coin categories
 *
 * @example
 * ```typescript
 * const categories = await getCoinCategories();
 * ```
 */
export async function getCoinCategories(): Promise<any> {
	return executeTool("get_list_coins_categories", {});
}
