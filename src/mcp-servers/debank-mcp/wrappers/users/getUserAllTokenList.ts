/**
 * Get user's token balances across all chains
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Retrieve a user's token balances across all supported chains
 *
 * @param params.id - User's wallet address
 * @param params.is_all - Optional: include all tokens (default: true)
 *
 * @returns Array of tokens across all chains
 *
 * @example
 * ```typescript
 * const tokens = await getUserAllTokenList({
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
 * });
 * console.log(tokens);
 * ```
 */
export async function getUserAllTokenList(params: {
	id: string;
	is_all?: boolean;
}): Promise<any> {
	return executeServiceMethod("user", "getUserAllTokenList", params);
}
