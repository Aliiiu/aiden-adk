import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

const StablecoinChainSchema = z.object({
	chainName: z.string().describe("Chain name"),
	mcapsum: z.number().describe("Total circulating USD value on chain"),
});

export const GetStableCoinChainsResponseSchema = z
	.array(StablecoinChainSchema)
	.describe("Stablecoin circulation per chain");

export type GetStableCoinChainsResponse = z.infer<
	typeof GetStableCoinChainsResponseSchema
>;

/**
 * Get total stablecoin circulation (market cap) grouped by blockchain chains.
 *
 * Returns stablecoin distribution across chains. This is for analyzing which chains have the most stablecoin liquidity.
 * For individual stablecoin data, use getStableCoin.
 * For historical stablecoin trends, use getStableCoinCharts.
 *
 * @returns Array of chains with total stablecoin circulation: [{ chainName, mcapsum }, ...]
 *
 * @example
 * ```typescript
 * const chainDistribution = await getStableCoinChains();
 * // Returns: [{ chainName: 'Ethereum', mcapsum: 80000000000 }, { chainName: 'Tron', mcapsum: 50000000000 }, ...]
 * ```
 */
export async function getStableCoinChains(): Promise<GetStableCoinChainsResponse> {
	return executeServiceMethod(
		"stablecoin",
		"getStableCoinChains",
		{},
	) as Promise<GetStableCoinChainsResponse>;
}
