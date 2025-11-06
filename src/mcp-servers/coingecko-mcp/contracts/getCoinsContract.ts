/**
 * Get coin data by contract address
 */

import { executeTool } from "../shared.js";

/**
 * Get coin data by contract address
 *
 * @param params.id - Asset platform ID (e.g., 'ethereum', 'binance-smart-chain')
 * @param params.contract_address - Token contract address
 * @param params.localization - Include all localized languages in response (default: true)
 * @param params.tickers - Include tickers data (default: true)
 * @param params.market_data - Include market data (default: true)
 * @param params.community_data - Include community data (default: true)
 * @param params.developer_data - Include developer data (default: true)
 * @param params.sparkline - Include sparkline 7 days data (default: false)
 *
 * @returns Coin data including market data, community stats, developer stats
 *
 * @example
 * ```typescript
 * const token = await getCoinsContract({
 *   id: 'ethereum',
 *   contract_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
 * });
 * ```
 */
export async function getCoinsContract(params: {
	id: string;
	contract_address: string;
	localization?: boolean;
	tickers?: boolean;
	market_data?: boolean;
	community_data?: boolean;
	developer_data?: boolean;
	sparkline?: boolean;
}): Promise<any> {
	return executeTool("get_coins_contract", params);
}
