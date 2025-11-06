/**
 * Get exchange data by ID
 */

import { executeTool } from "../shared.js";

/**
 * Get detailed exchange data by exchange ID
 *
 * @param params.id - Exchange ID (e.g., 'binance', 'coinbase_exchange')
 *
 * @returns Detailed exchange data including volume, tickers, trust score
 *
 * @example
 * ```typescript
 * const exchange = await getExchangesById({
 *   id: 'binance'
 * });
 * ```
 */
export async function getExchangesById(params: { id: string }): Promise<any> {
	return executeTool("get_id_exchanges", params);
}
