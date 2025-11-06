/**
 * Get detailed info for an onchain token
 */

import { executeTool } from "../shared.js";

/**
 * Get detailed information for a token on a network
 *
 * @param params.network - Network ID (e.g., 'eth', 'bsc')
 * @param params.token_address - Token contract address
 *
 * @returns Token details including supply, holders, price
 *
 * @example
 * ```typescript
 * const tokenInfo = await getTokensNetworksOnchainInfo({
 *   network: 'eth',
 *   token_address: '0x...'
 * });
 * ```
 */
export async function getTokensNetworksOnchainInfo(params: {
	network: string;
	token_address: string;
}): Promise<any> {
	return executeTool("get_tokens_networks_onchain_info", params);
}
