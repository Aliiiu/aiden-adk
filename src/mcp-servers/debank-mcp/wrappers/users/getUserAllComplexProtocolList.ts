/**
 * Get user's protocol positions across all chains
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Retrieve a user's detailed portfolios across all supported chains
 *
 * @param params.id - User's wallet address
 * @param params.chain_ids - Optional comma-separated chain IDs to filter
 *
 * @returns Array of protocol positions across all/specified chains
 *
 * @example
 * ```typescript
 * const positions = await getUserAllComplexProtocolList({
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   chain_ids: 'eth,bsc'
 * });
 * console.log(positions);
 * ```
 */
export async function getUserAllComplexProtocolList(params: {
	id: string;
	chain_ids?: string;
}): Promise<any> {
	return executeServiceMethod("user", "getUserAllComplexProtocolList", params);
}
