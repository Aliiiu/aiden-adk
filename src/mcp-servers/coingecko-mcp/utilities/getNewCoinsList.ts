/**
 * Get newly added coins (latest 200)
 */

import { executeTool } from "../shared.js";

/**
 * Get newly added coins (latest 200)
 *
 * @returns Array of recently added coins
 *
 * @example
 * ```typescript
 * const newCoins = await getNewCoinsList();
 * ```
 */
export async function getNewCoinsList(): Promise<any> {
	return executeTool("get_new_coins_list", {});
}
