/**
 * Get OHLCV data for an onchain pool
 */

import { executeTool } from "../shared.js";

/**
 * Get OHLCV (Open, High, Low, Close, Volume) data for a pool
 *
 * @param params.network - Network ID
 * @param params.pool_address - Pool contract address
 * @param params.timeframe - Timeframe ('day', 'hour', 'minute')
 * @param params.aggregate - Aggregation period (e.g., '1', '5', '15')
 * @param params.before_timestamp - Get data before this timestamp
 * @param params.limit - Number of data points (default: 100, max: 1000)
 * @param params.currency - Price currency (default: 'usd')
 *
 * @returns OHLCV candlestick data
 *
 * @example
 * ```typescript
 * const ohlcv = await getTimeframePoolsNetworksOnchainOhlcv({
 *   network: 'eth',
 *   pool_address: '0x...',
 *   timeframe: 'hour',
 *   aggregate: '1',
 *   limit: 24
 * });
 * ```
 */
export async function getTimeframePoolsNetworksOnchainOhlcv(params: {
	network: string;
	pool_address: string;
	timeframe: string;
	aggregate: string;
	before_timestamp?: number;
	limit?: number;
	currency?: string;
}): Promise<any> {
	return executeTool("get_timeframe_pools_networks_onchain_ohlcv", params);
}
