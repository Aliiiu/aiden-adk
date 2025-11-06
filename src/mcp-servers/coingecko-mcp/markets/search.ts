/**
 * Search for coins, exchanges, and NFTs
 */

import { executeTool } from "../shared.js";

/**
 * Search for coins, exchanges, and NFTs
 *
 * @param params.query - Search query
 *
 * @returns Search results
 *
 * @example
 * ```typescript
 * const results = await search({ query: 'bitcoin' });
 * ```
 */
export async function search(params: { query: string }): Promise<any> {
	return executeTool("get_search", params);
}
