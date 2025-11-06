/**
 * Get top holders of a token
 */

import { executeTool } from "../shared.js";

/**
 * Get top holders/wallets for a specific token
 *
 * @param params.network - Network ID
 * @param params.token_address - Token contract address
 * @param params.page - Page number (default: 1)
 *
 * @returns Top holders with balances and percentages
 *
 * @example
 * ```typescript
 * const holders = await getTokensNetworksOnchainTopHolders({
 *   network: 'eth',
 *   token_address: '0x...'
 * });
 * ```
 */
export async function getTokensNetworksOnchainTopHolders(params: {
	network: string;
	token_address: string;
	page?: number;
}): Promise<any> {
	return executeTool("get_tokens_networks_onchain_top_holders", params);
}
