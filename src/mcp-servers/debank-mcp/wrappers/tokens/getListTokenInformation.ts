/**
 * Get information for multiple tokens
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Retrieve detailed information for multiple tokens at once
 *
 * @param params.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param params.ids - Comma-separated token addresses (up to 100)
 *
 * @returns Array of token details
 *
 * @example
 * ```typescript
 * const tokens = await getListTokenInformation({
 *   chain_id: 'eth',
 *   ids: '0xdac17f958d2ee523a2206206994597c13d831ec7,0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
 * });
 * console.log(tokens);
 * ```
 */
export async function getListTokenInformation(params: {
	chain_id: string;
	ids: string;
}): Promise<any> {
	return executeServiceMethod("token", "getListTokenInformation", params);
}
