/**
 * Get current gas prices for a chain
 */

import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetGasPricesInputSchema = z
	.object({
		chain_id: z.string().describe("Chain ID (e.g., 'eth', 'bsc', 'matic')"),
	})
	.strict();

const GasMarketTierSchema = z.object({
	price: z.number().describe("Gas price in Gwei"),
	estimated_seconds: z
		.number()
		.describe("Estimated confirmation time in seconds"),
});

export const GetGasPricesResponseSchema = z.object({
	slow: GasMarketTierSchema.describe("Slow transaction speed"),
	normal: GasMarketTierSchema.describe("Normal transaction speed"),
	fast: GasMarketTierSchema.describe("Fast transaction speed"),
});

export type GetGasPricesInput = z.infer<typeof GetGasPricesInputSchema>;
export type GetGasPricesResponse = z.infer<typeof GetGasPricesResponseSchema>;

/**
 * Fetch current gas prices for different transaction speed levels
 *
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 *
 * @returns Gas prices for slow, normal, and fast speeds
 *
 * @example
 * ```typescript
 * const gasPrices = await getGasPrices({ chain_id: 'eth' });
 * console.log(gasPrices);
 * ```
 */
export async function getGasPrices(
	input: GetGasPricesInput,
): Promise<GetGasPricesResponse> {
	return executeServiceMethod(
		"chain",
		"getGasPrices",
		input,
	) as Promise<GetGasPricesResponse>;
}
