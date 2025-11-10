/**
 * Get list of NFTs owned by a user on a chain
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Fetch a list of NFTs owned by a user on a specific chain
 *
 * @param params.id - User's wallet address
 * @param params.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param params.is_all - Optional: include all NFTs (default: true)
 *
 * @returns Array of NFTs with details
 *
 * @example
 * ```typescript
 * const nfts = await getUserNftList({
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   chain_id: 'eth'
 * });
 * console.log(nfts);
 * ```
 */
export async function getUserNftList(params: {
	id: string;
	chain_id: string;
	is_all?: boolean;
}): Promise<any> {
	return executeServiceMethod("user", "getUserNftList", params);
}
