import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetHistoricalPoolDataInputSchema = z
	.object({
		pool: z.string().describe("Pool identifier from DefiLlama yields API"),
	})
	.strict();

const HistoricalPoolPointSchema = z.object({
	poolId: z.string().describe("Pool identifier"),
	timestamp: z.string().describe("Timestamp of the datapoint"),
	tvlUsd: z.number().describe("TVL in USD"),
	apy: z.number().describe("APY percentage"),
	apyBase: z.number().describe("Base APY percentage"),
});

export const GetHistoricalPoolDataResponseSchema = z
	.array(HistoricalPoolPointSchema)
	.describe("Historical yield metrics for the specified pool");

export type GetHistoricalPoolDataInput = z.infer<
	typeof GetHistoricalPoolDataInputSchema
>;
export type GetHistoricalPoolDataResponse = z.infer<
	typeof GetHistoricalPoolDataResponseSchema
>;

/**
 * Get historical yield pool data
 */
export async function getHistoricalPoolData(
	input: GetHistoricalPoolDataInput,
): Promise<GetHistoricalPoolDataResponse> {
	return executeServiceMethod(
		"yield",
		"getHistoricalPoolData",
		input,
	) as Promise<GetHistoricalPoolDataResponse>;
}
