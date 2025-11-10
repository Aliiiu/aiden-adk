/**
 * Get top holders of a token
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Fetch the top holders of a specified token
 *
 * @param params.id - Token contract address or native token ID
 * @param params.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param params.start - Optional pagination offset (default: 0, max: 10000)
 * @param params.limit - Optional max number of holders (default: 100)
 *
 * @returns Array of top token holders
 *
 * @example
 * ```typescript
 * const holders = await getTopHoldersOfToken({
 *   id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
 *   chain_id: 'eth',
 *   limit: 50
 * });
 * console.log(holders);
 * ```
 */
export async function getTopHoldersOfToken(params: {
	id: string;
	chain_id: string;
	start?: number;
	limit?: number;
}): Promise<any> {
	return executeServiceMethod("token", "getTopHoldersOfToken", params);
}
