/**
 * Get pools for a specific token
 */

import { executeTool } from "../shared.js";

/**
 * Get all trading pools for a specific token
 *
 * @param params.network - Network ID
 * @param params.token_address - Token contract address
 * @param params.page - Page number (default: 1)
 *
 * @returns Pools where the token is traded
 *
 * @example
 * ```typescript
 * const pools = await getTokensNetworksOnchainPools({
 *   network: 'eth',
 *   token_address: '0x...'
 * });
 * ```
 */
export async function getTokensNetworksOnchainPools(params: {
	network: string;
	token_address: string;
	page?: number;
}): Promise<any> {
	return executeTool("get_tokens_networks_onchain_pools", params);
}
