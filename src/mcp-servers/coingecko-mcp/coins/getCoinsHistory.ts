/**
 * Get historical data (price, market cap, 24hr volume) at a given date
 */

import { executeTool } from "../shared.js";

/**
 * Get historical snapshot of coin data at a specific date
 *
 * @param params.id - Coin ID
 * @param params.date - Date in format dd-mm-yyyy (e.g., '30-12-2022')
 * @param params.localization - Include all localized languages (default: true)
 *
 * @returns Historical snapshot including price, market data, community data
 *
 * @example
 * ```typescript
 * const snapshot = await getCoinsHistory({
 *   id: 'bitcoin',
 *   date: '01-01-2023'
 * });
 * ```
 */
export async function getCoinsHistory(params: {
	id: string;
	date: string;
	localization?: boolean;
}): Promise<any> {
	return executeTool("get_coins_history", params);
}
