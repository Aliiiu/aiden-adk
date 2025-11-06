/**
 * Get list of DEXes on a specific network
 */

import { executeTool } from "../shared.js";

/**
 * Get list of DEXes on a specific blockchain network
 *
 * @param params.network - Network ID (e.g., 'eth', 'bsc', 'polygon')
 *
 * @returns List of DEXes on the specified network
 *
 * @example
 * ```typescript
 * const dexes = await getNetworksOnchainDexes({
 *   network: 'eth'
 * });
 * ```
 */
export async function getNetworksOnchainDexes(params: {
	network: string;
}): Promise<any> {
	return executeTool("get_networks_onchain_dexes", params);
}
