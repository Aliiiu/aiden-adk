/**
 * Get detailed data for a specific coin
 */

import { executeTool } from "../shared.js";

/**
 * Get detailed data for a specific coin
 *
 * @param params.id - Coin ID (use getCoinsList to find IDs)
 * @param params.localization - Include localized languages (default: true)
 * @param params.tickers - Include ticker data (default: true)
 * @param params.market_data - Include market data (default: true)
 * @param params.community_data - Include community data (default: true)
 * @param params.developer_data - Include developer data (default: true)
 * @param params.sparkline - Include sparkline data (default: false)
 *
 * @returns Detailed coin data
 *
 * @example
 * ```typescript
 * const bitcoin = await getCoinDetails({
 *   id: 'bitcoin',
 *   market_data: true,
 *   sparkline: true
 * });
 * ```
 */
export async function getCoinDetails(params: {
	id: string;
	localization?: boolean | string;
	tickers?: boolean | string;
	market_data?: boolean | string;
	community_data?: boolean | string;
	developer_data?: boolean | string;
	sparkline?: boolean | string;
}): Promise<any> {
	return executeTool("get_id_coins", params);
}
