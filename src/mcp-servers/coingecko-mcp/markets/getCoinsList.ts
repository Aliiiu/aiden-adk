/**
 * Get list of all supported coins with id, name, and symbol
 */

import { executeTool } from "../shared.js";

/**
 * Get list of all supported coins with id, name, and symbol
 *
 * @param params.include_platform - Include platform contract addresses (default: false)
 *
 * @returns Array of all supported coins
 *
 * @example
 * ```typescript
 * const coins = await getCoinsList({ include_platform: true });
 * ```
 */
export async function getCoinsList(params?: {
	include_platform?: boolean;
}): Promise<any> {
	return executeTool("get_coins_list", params || {});
}
