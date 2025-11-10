/**
 * Get list of all supported blockchain chains
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Retrieve a comprehensive list of all blockchain chains supported by DeBank
 *
 * @returns Array of supported chains with their details
 *
 * @example
 * ```typescript
 * const chains = await getSupportedChainList();
 * console.log(chains);
 * ```
 */
export async function getSupportedChainList(): Promise<any> {
	return executeServiceMethod("chain", "getSupportedChainList", {});
}
