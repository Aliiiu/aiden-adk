/**
 * Get list of supported vs currencies
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetSimpleSupportedVsCurrenciesResponseSchema = z
	.array(z.string())
	.describe("List of supported vs currency symbols");

export type GetSimpleSupportedVsCurrenciesResponse = z.infer<
	typeof GetSimpleSupportedVsCurrenciesResponseSchema
>;

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
export async function getSimpleSupportedVsCurrencies(): Promise<GetSimpleSupportedVsCurrenciesResponse> {
	return executeTool(
		"get_simple_supported_vs_currencies",
		{},
	) as Promise<GetSimpleSupportedVsCurrenciesResponse>;
}
