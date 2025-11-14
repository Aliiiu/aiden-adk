import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

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
 * Get chains ranked by TVL
 */
export async function getChains(
	input?: GetChainsInput,
): Promise<GetChainsResponse> {
	return executeServiceMethod("protocol", "getChains", {
		order: input?.order ?? "desc",
	}) as Promise<GetChainsResponse>;
}
