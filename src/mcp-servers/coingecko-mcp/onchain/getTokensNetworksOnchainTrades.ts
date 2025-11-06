/**
 * Get recent trades for a token
 */

import { executeTool } from "../shared.js";

/**
 * Get recent trades for a specific token across all pools
 *
 * @param params.network - Network ID
 * @param params.token_address - Token contract address
 * @param params.trade_volume_in_usd_greater_than - Minimum trade volume in USD
 *
 * @returns Recent trades involving the token
 *
 * @example
 * ```typescript
 * const trades = await getTokensNetworksOnchainTrades({
 *   network: 'eth',
 *   token_address: '0x...',
 *   trade_volume_in_usd_greater_than: 5000
 * });
 * ```
 */
export async function getTokensNetworksOnchainTrades(params: {
	network: string;
	token_address: string;
	trade_volume_in_usd_greater_than?: number;
}): Promise<any> {
	return executeTool("get_tokens_networks_onchain_trades", params);
}
