/**
 * Search for onchain pools
 */

import { executeTool } from "../shared.js";

/**
 * Search for onchain pools by query
 *
 * @param params.query - Search query (token name, symbol, or address)
 * @param params.network - Optional network filter
 *
 * @returns Matching pools
 *
 * @example
 * ```typescript
 * const results = await getSearchOnchainPools({
 *   query: 'USDC',
 *   network: 'eth'
 * });
 * ```
 */
export async function getSearchOnchainPools(params: {
	query: string;
	network?: string;
}): Promise<any> {
	return executeTool("get_search_onchain_pools", params);
}
