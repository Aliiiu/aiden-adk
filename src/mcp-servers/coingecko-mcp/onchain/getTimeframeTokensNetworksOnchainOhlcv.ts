/**
 * Get OHLCV data for an onchain token
 */

import { executeTool } from "../shared.js";

/**
 * Get OHLCV (Open, High, Low, Close, Volume) data for a token
 *
 * @param params.network - Network ID
 * @param params.token_address - Token contract address
 * @param params.timeframe - Timeframe ('day', 'hour', 'minute')
 * @param params.aggregate - Aggregation period (e.g., '1', '5', '15')
 * @param params.before_timestamp - Get data before this timestamp
 * @param params.limit - Number of data points (default: 100, max: 1000)
 * @param params.currency - Price currency (default: 'usd')
 *
 * @returns OHLCV candlestick data for the token
 *
 * @example
 * ```typescript
 * const ohlcv = await getTimeframeTokensNetworksOnchainOhlcv({
 *   network: 'eth',
 *   token_address: '0x...',
 *   timeframe: 'hour',
 *   aggregate: '1',
 *   limit: 24
 * });
 * ```
 */
export async function getTimeframeTokensNetworksOnchainOhlcv(params: {
	network: string;
	token_address: string;
	timeframe: string;
	aggregate: string;
	before_timestamp?: number;
	limit?: number;
	currency?: string;
}): Promise<any> {
	return executeTool("get_timeframe_tokens_networks_onchain_ohlcv", params);
}
