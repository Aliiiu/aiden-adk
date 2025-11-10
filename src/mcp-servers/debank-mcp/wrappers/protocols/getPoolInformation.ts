/**
 * Get detailed information about a liquidity pool
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Retrieve detailed information about a specific liquidity pool
 *
 * @param params.id - Pool ID (typically a contract address)
 * @param params.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 *
 * @returns Pool details including protocol, TVL, user count
 *
 * @example
 * ```typescript
 * const pool = await getPoolInformation({
 *   id: '0x00000000219ab540356cbb839cbe05303d7705fa',
 *   chain_id: 'eth'
 * });
 * console.log(pool);
 * ```
 */
export async function getPoolInformation(params: {
	id: string;
	chain_id: string;
}): Promise<any> {
	return executeServiceMethod("protocol", "getPoolInformation", params);
}
