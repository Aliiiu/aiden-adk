import { z } from "zod";
import { executeServiceMethod } from "../../shared";

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
 * Get current gas prices for a chain with slow/normal/fast speed tiers and estimated confirmation times.
 *
 * Returns real-time gas market data for transaction fee estimation. This is for optimizing transaction costs
 * and timing. For gas usage simulation, use preExecTransaction.
 *
 * @param input.chain_id - Chain identifier (e.g., 'eth', 'bsc', 'matic', 'arb', 'polygon')
 *
 * @returns Gas prices in Gwei for slow/normal/fast speeds with estimated confirmation times in seconds
 *
 * @example
 * ```typescript
 * const gasPrices = await getGasPrices({ chain_id: 'eth' });
 * console.log(gasPrices.fast.price); // e.g., 50 (Gwei)
 * console.log(gasPrices.fast.estimated_seconds); // e.g., 15
 * console.log(gasPrices.normal.price); // e.g., 40 (Gwei)
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
