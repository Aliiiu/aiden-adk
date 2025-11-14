import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetLatestPoolDataInputSchema = z
	.object({
		sortCondition: z
			.string()
			.optional()
			.describe("Pool field used for sorting (e.g., 'apy', 'tvlUsd')"),
		order: z.enum(["asc", "desc"]).optional().describe("Sort order"),
		limit: z
			.number()
			.int()
			.positive()
			.optional()
			.describe("Number of pools to return (default 10)"),
	})
	.strict()
	.optional();

const YieldPoolSchema = z.object({
	name: z.string().nullable().describe("Pool display name"),
	project: z.string().nullable().describe("Protocol/project name"),
	chain: z.string().nullable().describe("Chain identifier"),
	id: z.string().nullable().describe("Unique pool identifier"),
	symbol: z.string().nullable().describe("Pool symbol"),
	tvlUsd: z.number().nullable().describe("TVL in USD"),
	tvl: z.number().nullable().describe("Alias for TVL"),
	apyPct1D: z.number().nullable().describe("1d APY percentage"),
	apy1d: z.number().nullable().describe("Alias for 1d APY"),
	apyPct7D: z.number().nullable().describe("7d APY percentage"),
	apy7d: z.number().nullable().describe("Alias for 7d APY"),
	apyPct30D: z.number().nullable().describe("30d APY percentage"),
	apy30d: z.number().nullable().describe("Alias for 30d APY"),
	apy: z.number().nullable().describe("Current APY percentage"),
	predictions: z
		.object({
			predictedClass: z.string(),
			predictedProbability: z.number(),
			binnedConfidence: z.number(),
		})
		.nullable()
		.optional(),
});

export const GetLatestPoolDataResponseSchema = z
	.array(YieldPoolSchema)
	.describe("Sorted yield pool list");

export type GetLatestPoolDataInput = z.infer<
	typeof GetLatestPoolDataInputSchema
>;
export type GetLatestPoolDataResponse = z.infer<
	typeof GetLatestPoolDataResponseSchema
>;

/**
 * Get latest yield pool data with sorting
 */
export async function getLatestPoolData(
	input?: GetLatestPoolDataInput,
): Promise<GetLatestPoolDataResponse> {
	return executeServiceMethod("yield", "getLatestPoolData", {
		sortCondition: input?.sortCondition ?? "apy",
		order: input?.order ?? "desc",
		limit: input?.limit ?? 10,
	}) as Promise<GetLatestPoolDataResponse>;
}
