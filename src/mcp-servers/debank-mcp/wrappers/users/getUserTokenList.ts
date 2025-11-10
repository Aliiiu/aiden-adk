/**
 * Get list of tokens held by a user on a chain
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Retrieve a list of tokens held by a user on a specific chain
 *
 * @param params.id - User's wallet address
 * @param params.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param params.is_all - Optional: include all tokens (default: true)
 *
 * @returns Array of tokens with balances
 *
 * @example
 * ```typescript
 * const tokens = await getUserTokenList({
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   chain_id: 'eth'
 * });
 * console.log(tokens);
 * ```
 */
export async function getUserTokenList(params: {
	id: string;
	chain_id: string;
	is_all?: boolean;
}): Promise<any> {
	return executeServiceMethod("user", "getUserTokenList", params);
}
