/**
 * Get OHLCV data for an onchain pool
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetTimeframePoolsNetworksOnchainOhlcvInputSchema = z.object({
	network: z.string().describe("Network identifier"),
	pool_address: z.string().describe("Pool contract address"),
	timeframe: z.string().describe("Timeframe granularity (day/hour/minute)"),
	aggregate: z.string().describe("Aggregation period (e.g., '1', '5')"),
	before_timestamp: z
		.number()
		.optional()
		.describe("Return data before this timestamp"),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe("Max number of points (default 100, max 1000)"),
	currency: z.string().optional().describe("Quote currency (default 'usd')"),
});

const OhlcvPointSchema = z
	.array(z.number())
	.describe("Tuple [timestamp, open, high, low, close, volume]");

export const GetTimeframePoolsNetworksOnchainOhlcvResponseSchema = z.object({
	data: z.object({
		id: z.string(),
		type: z.string(),
		attributes: z.object({
			ohlcv_list: z.array(OhlcvPointSchema),
		}),
	}),
	meta: z
		.object({
			base: z
				.object({
					address: z.string(),
					coingecko_coin_id: z.string().nullable().optional(),
					name: z.string().nullable().optional(),
					symbol: z.string().nullable().optional(),
				})
				.optional(),
			quote: z
				.object({
					address: z.string(),
					coingecko_coin_id: z.string().nullable().optional(),
					name: z.string().nullable().optional(),
					symbol: z.string().nullable().optional(),
				})
				.optional(),
		})
		.optional(),
});

export type GetTimeframePoolsNetworksOnchainOhlcvInput = z.infer<
	typeof GetTimeframePoolsNetworksOnchainOhlcvInputSchema
>;
export type GetTimeframePoolsNetworksOnchainOhlcvResponse = z.infer<
	typeof GetTimeframePoolsNetworksOnchainOhlcvResponseSchema
>;

/**
 * Get OHLCV (Open, High, Low, Close, Volume) data for a pool
 *
 * @param params.network - Network ID
 * @param params.pool_address - Pool contract address
 * @param params.timeframe - Timeframe ('day', 'hour', 'minute')
 * @param params.aggregate - Aggregation period (e.g., '1', '5', '15')
 * @param params.before_timestamp - Get data before this timestamp
 * @param params.limit - Number of data points (default: 100, max: 1000)
 * @param params.currency - Price currency (default: 'usd')
 *
 * @returns OHLCV candlestick data
 *
 * @example
 * ```typescript
 * const ohlcv = await getTimeframePoolsNetworksOnchainOhlcv({
 *   network: 'eth',
 *   pool_address: '0x...',
 *   timeframe: 'hour',
 *   aggregate: '1',
 *   limit: 24
 * });
 * ```
 */
export async function getTimeframePoolsNetworksOnchainOhlcv(
	params: GetTimeframePoolsNetworksOnchainOhlcvInput,
): Promise<GetTimeframePoolsNetworksOnchainOhlcvResponse> {
	return executeTool(
		"get_timeframe_pools_networks_onchain_ohlcv",
		params,
	) as Promise<GetTimeframePoolsNetworksOnchainOhlcvResponse>;
}
