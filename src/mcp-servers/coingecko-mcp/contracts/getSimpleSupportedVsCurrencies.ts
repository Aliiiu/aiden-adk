/**
 * Get list of supported vs currencies
 */

import { executeTool } from "../shared.js";

/**
 * Get list of supported vs currencies
 *
 * @returns Array of supported currency codes
 *
 * @example
 * ```typescript
 * const currencies = await getSimpleSupportedVsCurrencies();
 * // Returns: ['btc', 'eth', 'ltc', 'bch', 'bnb', 'eos', 'xrp', 'xlm', ...]
 * ```
 */
export async function getSimpleSupportedVsCurrencies(): Promise<string[]> {
	return executeTool("get_simple_supported_vs_currencies", {});
}
