/**
 * Get historical price of a token
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Retrieve the historical price of a token for a given date
 *
 * @param params.id - Token contract address or native token ID
 * @param params.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param params.date_at - Date in format YYYY-MM-DD (e.g., '2023-05-18')
 *
 * @returns Historical price data for the specified date
 *
 * @example
 * ```typescript
 * const price = await getTokenHistoryPrice({
 *   id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
 *   chain_id: 'eth',
 *   date_at: '2023-05-18'
 * });
 * console.log(price);
 * ```
 */
export async function getTokenHistoryPrice(params: {
	id: string;
	chain_id: string;
	date_at: string;
}): Promise<any> {
	return executeServiceMethod("token", "getTokenHistoryPrice", params);
}
