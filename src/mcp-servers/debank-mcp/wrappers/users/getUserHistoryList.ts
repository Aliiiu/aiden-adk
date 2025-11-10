/**
 * Get user's transaction history on a chain
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Fetch a user's transaction history on a specified chain
 *
 * @param params.id - User's wallet address
 * @param params.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param params.token_id - Optional token filter
 * @param params.start_time - Optional timestamp filter
 * @param params.page_count - Optional max entries (max: 20)
 *
 * @returns Array of transaction history
 *
 * @example
 * ```typescript
 * const history = await getUserHistoryList({
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   chain_id: 'eth',
 *   page_count: 10
 * });
 * console.log(history);
 * ```
 */
export async function getUserHistoryList(params: {
	id: string;
	chain_id: string;
	token_id?: string;
	start_time?: number;
	page_count?: number;
}): Promise<any> {
	return executeServiceMethod("user", "getUserHistoryList", params);
}
