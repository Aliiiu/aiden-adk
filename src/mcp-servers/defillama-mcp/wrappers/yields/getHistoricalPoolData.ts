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
 * Get historical yield farming pool data with APY and TVL trends over time for a specific pool.
 *
 * Returns time-series data for a pool's APY and TVL. This is for analyzing yield trends for a specific pool.
 * For current yield pool rankings, use getLatestPoolData.
 * For protocol-level TVL trends, use getHistoricalChainTvl.
 * For user-specific LP positions, use DeBank getUserComplexProtocolList.
 *
 * @param input.pool - Pool identifier from DefiLlama yields API (e.g., pool ID from getLatestPoolData)
 *
 * @returns Time-series array: [{ poolId, timestamp, tvlUsd, apy, apyBase }, ...]
 *
 * @example
 * ```typescript
 * const poolHistory = await getHistoricalPoolData({
 *   pool: '747c1d2a-c668-4682-b9f9-296708a3dd90'
 * });
 * // Returns APY and TVL history for the pool
 * ```
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
