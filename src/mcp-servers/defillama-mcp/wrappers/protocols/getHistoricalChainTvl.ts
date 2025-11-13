import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetHistoricalChainTvlInputSchema = z
	.object({
		chain: z.string().optional().describe("Optional chain identifier"),
	})
	.optional();

const HistoricalTvlPointSchema = z.object({
	date: z.number().describe("Unix timestamp (seconds)"),
	tvl: z.number().describe("Total value locked in USD"),
});

export const GetHistoricalChainTvlResponseSchema = z
	.array(HistoricalTvlPointSchema)
	.describe("Historical TVL data points");

export type GetHistoricalChainTvlInput = z.infer<
	typeof GetHistoricalChainTvlInputSchema
>;
export type GetHistoricalChainTvlResponse = z.infer<
	typeof GetHistoricalChainTvlResponseSchema
>;

/**
 * Get historical TVL data for a chain or all chains
 */
export async function getHistoricalChainTvl(
	input?: GetHistoricalChainTvlInput,
): Promise<GetHistoricalChainTvlResponse> {
	return executeServiceMethod(
		"protocol",
		"getHistoricalChainTvl",
		input ?? {},
	) as Promise<GetHistoricalChainTvlResponse>;
}
