/**
 * Get trending search coins in the last 24 hours
 */

import { executeTool } from "../shared.js";

/**
 * Get trending search coins in the last 24 hours
 *
 * @returns Trending coins data
 *
 * @example
 * ```typescript
 * const trending = await getTrendingSearch();
 * ```
 */
export async function getTrendingSearch(): Promise<any> {
	return executeTool("get_search_trending", {});
}
