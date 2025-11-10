/**
 * Get user's balance on a specific chain
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Fetch the current balance of a user on a specified chain
 *
 * @param params.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param params.id - User's wallet address
 *
 * @returns Balance in USD value
 *
 * @example
 * ```typescript
 * const balance = await getUserChainBalance({
 *   chain_id: 'eth',
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
 * });
 * console.log(balance);
 * ```
 */
export async function getUserChainBalance(params: {
	chain_id: string;
	id: string;
}): Promise<any> {
	return executeServiceMethod("user", "getUserChainBalance", params);
}
