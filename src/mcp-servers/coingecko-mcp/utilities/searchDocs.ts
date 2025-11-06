/**
 * Search CoinGecko API documentation
 */

import { executeTool } from "../shared.js";

/**
 * Search CoinGecko API documentation
 *
 * @param params.query - Search query for documentation
 *
 * @returns Relevant documentation entries
 *
 * @example
 * ```typescript
 * const docs = await searchDocs({
 *   query: 'trending coins'
 * });
 * ```
 */
export async function searchDocs(params: { query: string }): Promise<any> {
	return executeTool("search_docs", params);
}
