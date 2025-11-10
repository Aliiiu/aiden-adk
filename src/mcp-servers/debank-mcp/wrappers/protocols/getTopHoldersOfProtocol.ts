/**
 * Get top holders of a protocol
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Retrieve a list of top holders within a specified DeFi protocol
 *
 * @param params.id - Protocol ID (e.g., 'uniswap', 'aave')
 * @param params.start - Optional pagination offset (default: 0, max: 1000)
 * @param params.limit - Optional max number of holders (default and max: 100)
 *
 * @returns Array of top holders with their balances
 *
 * @example
 * ```typescript
 * const holders = await getTopHoldersOfProtocol({ id: 'uniswap', limit: 50 });
 * console.log(holders);
 * ```
 */
export async function getTopHoldersOfProtocol(params: {
	id: string;
	start?: number;
	limit?: number;
}): Promise<any> {
	return executeServiceMethod("protocol", "getTopHoldersOfProtocol", params);
}
