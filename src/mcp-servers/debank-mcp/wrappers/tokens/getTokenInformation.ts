/**
 * Get detailed information about a token
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Fetch comprehensive details about a specific token
 *
 * @param params.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param params.id - Token contract address or native token ID
 *
 * @returns Token details including price, symbol, decimals, logo
 *
 * @example
 * ```typescript
 * const token = await getTokenInformation({
 *   chain_id: 'eth',
 *   id: '0xdac17f958d2ee523a2206206994597c13d831ec7' // USDT
 * });
 * console.log(token);
 * ```
 */
export async function getTokenInformation(params: {
	chain_id: string;
	id: string;
}): Promise<any> {
	return executeServiceMethod("token", "getTokenInformation", params);
}
