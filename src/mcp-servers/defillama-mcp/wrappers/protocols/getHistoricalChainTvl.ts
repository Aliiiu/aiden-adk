import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetHistoricalChainTvlInputSchema = z
	.object({
		chain: z.string().optional().describe("Optional chain identifier"),
	})
	.strict()
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
 * Get historical TVL (Total Value Locked) time-series data for a chain or aggregated across all chains.
 *
 * Returns TVL trend data over time. This is for analyzing DeFi ecosystem growth and TVL trends.
 * For current protocol TVL rankings, use getProtocols.
 * For yield pool data with APY, use getLatestPoolData or getHistoricalPoolData.
 * For user-specific wallet balances, use DeBank getUserTotalBalance.
 *
 * @param input.chain - Optional chain identifier (e.g., 'Ethereum', 'BSC'). Omit for all chains aggregated.
 *
 * @returns Time-series array: [{ date: unix_timestamp_seconds, tvl: usd_value }, ...]
 *
 * @example
 * ```typescript
 * const ethTvl = await getHistoricalChainTvl({ chain: 'Ethereum' });
 * // Returns: [{ date: 1609459200, tvl: 50000000000 }, ...]
 *
 * const allChainsTvl = await getHistoricalChainTvl();
 * // Returns aggregated TVL across all chains
 * ```
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
