/**
 * Get recent trades for an onchain pool
 */

import { executeTool } from "../shared.js";

/**
 * Get recent trades for a specific pool
 *
 * @param params.network - Network ID
 * @param params.pool_address - Pool contract address
 * @param params.trade_volume_in_usd_greater_than - Minimum trade volume in USD
 *
 * @returns Recent trades with timestamps, amounts, prices
 *
 * @example
 * ```typescript
 * const trades = await getPoolsNetworksOnchainTrades({
 *   network: 'eth',
 *   pool_address: '0x...',
 *   trade_volume_in_usd_greater_than: 10000
 * });
 * ```
 */
export async function getPoolsNetworksOnchainTrades(params: {
	network: string;
	pool_address: string;
	trade_volume_in_usd_greater_than?: number;
}): Promise<any> {
	return executeTool("get_pools_networks_onchain_trades", params);
}
