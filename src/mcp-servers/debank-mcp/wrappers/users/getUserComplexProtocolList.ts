/**
 * Get user's protocol positions on a chain
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Retrieve detailed portfolios of a user on a specific chain across protocols
 *
 * @param params.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param params.id - User's wallet address
 *
 * @returns Array of protocol positions with details
 *
 * @example
 * ```typescript
 * const positions = await getUserComplexProtocolList({
 *   chain_id: 'eth',
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
 * });
 * console.log(positions);
 * ```
 */
export async function getUserComplexProtocolList(params: {
	chain_id: string;
	id: string;
}): Promise<any> {
	return executeServiceMethod("user", "getUserComplexProtocolList", params);
}
