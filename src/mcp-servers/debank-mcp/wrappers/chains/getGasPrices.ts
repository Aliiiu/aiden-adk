/**
 * Get current gas prices for a chain
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Fetch current gas prices for different transaction speed levels
 *
 * @param params.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 *
 * @returns Gas prices for slow, normal, and fast speeds
 *
 * @example
 * ```typescript
 * const gasPrices = await getGasPrices({ chain_id: 'eth' });
 * console.log(gasPrices);
 * ```
 */
export async function getGasPrices(params: { chain_id: string }): Promise<any> {
	return executeServiceMethod("chain", "getGasPrices", params);
}
