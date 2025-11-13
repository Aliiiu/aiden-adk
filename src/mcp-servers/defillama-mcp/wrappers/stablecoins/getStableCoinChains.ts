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
 * Get stablecoin circulation data grouped by chains
 */
export async function getStableCoinChains(): Promise<GetStableCoinChainsResponse> {
	return executeServiceMethod(
		"stablecoin",
		"getStableCoinChains",
		{},
	) as Promise<GetStableCoinChainsResponse>;
}
