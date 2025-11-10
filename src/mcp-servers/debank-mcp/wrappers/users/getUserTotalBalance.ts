/**
 * Get user's total balance across all chains
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Retrieve a user's total net assets across all supported chains
 *
 * @param params.id - User's wallet address
 *
 * @returns Total USD value of assets
 *
 * @example
 * ```typescript
 * const balance = await getUserTotalBalance({
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
 * });
 * console.log(balance);
 * ```
 */
export async function getUserTotalBalance(params: {
	id: string;
}): Promise<any> {
	return executeServiceMethod("user", "getUserTotalBalance", params);
}
