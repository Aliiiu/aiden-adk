import { z } from "zod";
import { executeTool } from "../shared";

export const GetTimeframeTokensNetworksOnchainOhlcvInputSchema = z.object({
	network: z.string().describe("Network identifier"),
	token_address: z.string().describe("Token contract address"),
	timeframe: z.string().describe("Timeframe granularity"),
	aggregate: z.string().describe("Aggregation interval"),
	before_timestamp: z
		.number()
		.optional()
		.describe("Return data before this timestamp"),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe("Number of datapoints (default 100, max 1000)"),
	currency: z.string().optional().describe("Quote currency (default 'usd')"),
});

const OhlcvPointSchema = z.array(z.number());

export const GetTimeframeTokensNetworksOnchainOhlcvResponseSchema = z.object({
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

export type GetTimeframeTokensNetworksOnchainOhlcvInput = z.infer<
	typeof GetTimeframeTokensNetworksOnchainOhlcvInputSchema
>;
export type GetTimeframeTokensNetworksOnchainOhlcvResponse = z.infer<
	typeof GetTimeframeTokensNetworksOnchainOhlcvResponseSchema
>;

/**
 * Get OHLCV (Open, High, Low, Close, Volume) data for a token
 *
 * @param params.network - Network ID
 * @param params.token_address - Token contract address
 * @param params.timeframe - Timeframe ('day', 'hour', 'minute')
 * @param params.aggregate - Aggregation period (e.g., '1', '5', '15')
 * @param params.before_timestamp - Get data before this timestamp
 * @param params.limit - Number of data points (default: 100, max: 1000)
 * @param params.currency - Price currency (default: 'usd')
 *
 * @returns OHLCV candlestick data for the token
 *
 * @example
 * ```typescript
 * const ohlcv = await getTimeframeTokensNetworksOnchainOhlcv({
 *   network: 'eth',
 *   token_address: '0x...',
 *   timeframe: 'hour',
 *   aggregate: '1',
 *   limit: 24
 * });
 * ```
 */
export async function getTimeframeTokensNetworksOnchainOhlcv(
	params: GetTimeframeTokensNetworksOnchainOhlcvInput,
): Promise<GetTimeframeTokensNetworksOnchainOhlcvResponse> {
	return executeTool(
		"get_timeframe_tokens_networks_onchain_ohlcv",
		params,
	) as Promise<GetTimeframeTokensNetworksOnchainOhlcvResponse>;
}
