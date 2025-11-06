/**
 * Get global cryptocurrency statistics
 */

import { executeTool } from "../shared.js";

/**
 * Get global cryptocurrency statistics
 *
 * @returns Global market data including total market cap, volume, etc.
 *
 * @example
 * ```typescript
 * const global = await getGlobal();
 * console.log(global.data.total_market_cap.usd);
 * ```
 */
export async function getGlobal(): Promise<any> {
	return executeTool("get_global", {});
}
