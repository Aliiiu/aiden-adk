/**
 * Get list of all exchanges
 */

import { executeTool } from "../shared.js";

/**
 * Get list of all supported exchanges
 *
 * @param params.per_page - Results per page (default: 100)
 * @param params.page - Page number (default: 1)
 *
 * @returns List of exchanges with basic info
 *
 * @example
 * ```typescript
 * const exchanges = await getExchangesList({
 *   per_page: 50
 * });
 * ```
 */
export async function getExchangesList(params?: {
	per_page?: number;
	page?: number;
}): Promise<any> {
	return executeTool("get_list_exchanges", params || {});
}
