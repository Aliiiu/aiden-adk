import { z } from "zod";
import { executeServiceMethod } from "../../shared";

export const GetChainsInputSchema = z
	.object({
		order: z
			.enum(["asc", "desc"])
			.optional()
			.describe("Sort chains by TVL in ascending or descending order"),
	})
	.strict()
	.optional();

const ChainTvlSchema = z.object({
	name: z.string().describe("Chain name"),
	tvl: z.number().describe("Total value locked on the chain"),
});

export const GetChainsResponseSchema = z
	.array(ChainTvlSchema)
	.describe("Top chains ranked by TVL");

export type GetChainsInput = z.infer<typeof GetChainsInputSchema>;
export type GetChainsResponse = z.infer<typeof GetChainsResponseSchema>;

/**
 * Get blockchain chains ranked by Total Value Locked (TVL).
 *
 * Returns chain rankings by DeFi TVL. This is for comparing DeFi activity across different blockchains.
 * For historical chain TVL trends, use getHistoricalChainTvl.
 * For protocol TVL on specific chains, use getProtocols.
 * For supported chain metadata, use DeBank getSupportedChainList.
 *
 * @param input.order - Sort order: 'desc' (highest TVL first) or 'asc' (lowest first)
 *
 * @returns Array of chains: [{ name, tvl }, ...] sorted by TVL
 *
 * @example
 * ```typescript
 * const chainRankings = await getChains({ order: 'desc' });
 * // Returns: [{ name: 'Ethereum', tvl: 50000000000 }, { name: 'BSC', tvl: 10000000000 }, ...]
 * ```
 */
export async function getChains(
	input?: GetChainsInput,
): Promise<GetChainsResponse> {
	return executeServiceMethod("protocol", "getChains", {
		order: input?.order ?? "desc",
	}) as Promise<GetChainsResponse>;
}
