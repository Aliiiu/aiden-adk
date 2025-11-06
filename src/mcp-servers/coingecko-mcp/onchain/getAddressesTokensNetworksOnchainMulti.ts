/**
 * Get info for multiple tokens by addresses
 */

import { executeTool } from "../shared.js";

/**
 * Get information for multiple tokens by their addresses
 *
 * @param params.network - Network ID
 * @param params.addresses - Comma-separated token addresses
 *
 * @returns Token information for specified addresses
 *
 * @example
 * ```typescript
 * const tokens = await getAddressesTokensNetworksOnchainMulti({
 *   network: 'eth',
 *   addresses: '0x...,0x...,0x...'
 * });
 * ```
 */
export async function getAddressesTokensNetworksOnchainMulti(params: {
	network: string;
	addresses: string;
}): Promise<any> {
	return executeTool("get_addresses_tokens_networks_onchain_multi", params);
}
