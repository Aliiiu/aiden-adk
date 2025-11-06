/**
 * Get info for multiple pools by addresses
 */

import { executeTool } from "../shared.js";

/**
 * Get information for multiple pools by their addresses
 *
 * @param params.network - Network ID
 * @param params.addresses - Comma-separated pool addresses
 *
 * @returns Pool information for specified addresses
 *
 * @example
 * ```typescript
 * const pools = await getAddressesPoolsNetworksOnchainMulti({
 *   network: 'eth',
 *   addresses: '0x...,0x...,0x...'
 * });
 * ```
 */
export async function getAddressesPoolsNetworksOnchainMulti(params: {
	network: string;
	addresses: string;
}): Promise<any> {
	return executeTool("get_addresses_pools_networks_onchain_multi", params);
}
