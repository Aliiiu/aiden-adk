/**
 * Get list of all exchanges
 */

import { executeTool } from "../shared.js";

/**
 * Get list of all exchanges
 *
 * @param params.per_page - Results per page (default: 100)
 * @param params.page - Page number (default: 1)
 *
 * @returns Array of exchanges
 *
 * @example
 * ```typescript
 * const exchanges = await getExchangesList();
 * ```
 */
export async function getExchangesList(params?: {
	per_page?: number;
	page?: number | string;
}): Promise<any> {
	return executeTool("get_list_exchanges", params || {});
}
