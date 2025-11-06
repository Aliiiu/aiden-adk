/**
 * Get new pools across a specific network (alternate endpoint)
 */

import { executeTool } from "../shared.js";

/**
 * Get newly created pools on a network (alternate endpoint)
 *
 * @param params.network - Network ID
 * @param params.page - Page number (default: 1)
 *
 * @returns Recently created pools
 *
 * @example
 * ```typescript
 * const newPools = await getNetworkNetworksOnchainNewPools({
 *   network: 'eth'
 * });
 * ```
 */
export async function getNetworkNetworksOnchainNewPools(params: {
	network: string;
	page?: number;
}): Promise<any> {
	return executeTool("get_network_networks_onchain_new_pools", params);
}
