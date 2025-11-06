/**
 * Get detailed info for a specific onchain pool
 */

import { executeTool } from "../shared.js";

/**
 * Get detailed information for a specific pool on a network
 *
 * @param params.network - Network ID (e.g., 'eth', 'bsc')
 * @param params.pool_address - Pool contract address
 *
 * @returns Pool details including reserves, fees, volume
 *
 * @example
 * ```typescript
 * const poolInfo = await getPoolsNetworksOnchainInfo({
 *   network: 'eth',
 *   pool_address: '0x...'
 * });
 * ```
 */
export async function getPoolsNetworksOnchainInfo(params: {
	network: string;
	pool_address: string;
}): Promise<any> {
	return executeTool("get_pools_networks_onchain_info", params);
}
