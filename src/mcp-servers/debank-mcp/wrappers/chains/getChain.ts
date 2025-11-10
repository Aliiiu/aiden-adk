/**
 * Get detailed information about a specific chain
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Retrieve detailed information about a specific blockchain chain
 *
 * @param params.id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 *
 * @returns Chain details including ID, name, logo, native token, wrapped token
 *
 * @example
 * ```typescript
 * const chain = await getChain({ id: 'eth' });
 * console.log(chain);
 * ```
 */
export async function getChain(params: { id: string }): Promise<any> {
	return executeServiceMethod("chain", "getChain", params);
}
