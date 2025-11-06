/**
 * Get newly created pools on a network
 */

import { executeTool } from "../shared.js";

/**
 * Get newly created pools on a specific network
 *
 * @param params.network - Network ID (e.g., 'eth', 'bsc')
 * @param params.page - Page number (default: 1)
 *
 * @returns Recently created pools
 *
 * @example
 * ```typescript
 * const newPools = await getNetworksOnchainNewPools({
 *   network: 'eth'
 * });
 * ```
 */
export async function getNetworksOnchainNewPools(params: {
	network: string;
	page?: number;
}): Promise<any> {
	return executeTool("get_networks_onchain_new_pools", params);
}
