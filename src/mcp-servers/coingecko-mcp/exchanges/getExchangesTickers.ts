/**
 * Get exchange tickers (trading pairs) by exchange ID
 */

import { executeTool } from "../shared.js";

/**
 * Get exchange tickers (trading pairs) by exchange ID
 *
 * @param params.id - Exchange ID (e.g., 'binance')
 * @param params.coin_ids - Filter tickers by coin IDs (comma-separated)
 * @param params.include_exchange_logo - Include exchange logo (default: false)
 * @param params.page - Page number (default: 1)
 * @param params.depth - Include orderbook depth (default: false)
 * @param params.order - Sort order
 *
 * @returns Exchange trading pairs with volume, price data
 *
 * @example
 * ```typescript
 * const tickers = await getExchangesTickers({
 *   id: 'binance',
 *   coin_ids: 'bitcoin',
 *   page: 1
 * });
 * ```
 */
export async function getExchangesTickers(params: {
	id: string;
	coin_ids?: string;
	include_exchange_logo?: boolean;
	page?: number;
	depth?: boolean;
	order?: string;
}): Promise<any> {
	return executeTool("get_exchanges_tickers", params);
}
