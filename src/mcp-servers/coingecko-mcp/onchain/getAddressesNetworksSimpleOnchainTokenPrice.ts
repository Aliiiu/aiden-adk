/**
 * Get simple token prices for multiple addresses
 */

import { executeTool } from "../shared.js";

/**
 * Get simple price for tokens by their contract addresses
 *
 * @param params.network - Network ID
 * @param params.addresses - Comma-separated token addresses
 * @param params.vs_currencies - Comma-separated target currencies (default: 'usd')
 *
 * @returns Token prices for specified addresses
 *
 * @example
 * ```typescript
 * const prices = await getAddressesNetworksSimpleOnchainTokenPrice({
 *   network: 'eth',
 *   addresses: '0x...,0x...',
 *   vs_currencies: 'usd,eth'
 * });
 * ```
 */
export async function getAddressesNetworksSimpleOnchainTokenPrice(params: {
	network: string;
	addresses: string;
	vs_currencies?: string;
}): Promise<any> {
	return executeTool(
		"get_addresses_networks_simple_onchain_token_price",
		params,
	);
}
