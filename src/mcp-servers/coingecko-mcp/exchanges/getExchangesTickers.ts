import { z } from "zod";
import { executeTool } from "../shared";

export const GetExchangesTickersInputSchema = z.object({
	id: z.string().describe("Exchange ID (e.g., 'binance')"),
	coin_ids: z
		.string()
		.optional()
		.describe("Comma-separated list of coin IDs to filter"),
	include_exchange_logo: z
		.boolean()
		.optional()
		.describe("Include exchange logo in response"),
	page: z.number().int().positive().optional().describe("Page number"),
	depth: z.boolean().optional().describe("Include order book depth data"),
	order: z.string().optional().describe("Sort order"),
});

const ExchangeTickerSchema = z
	.object({
		base: z.string(),
		target: z.string(),
		market: z
			.object({
				name: z.string(),
				identifier: z.string().optional(),
				has_trading_incentive: z.boolean().optional(),
			})
			.loose(),
		last: z.number().nullable().optional(),
		volume: z.number().nullable().optional(),
		converted_last: z.record(z.string(), z.number()).optional(),
		converted_volume: z.record(z.string(), z.number()).optional(),
		trust_score: z.string().nullable().optional(),
		bid_ask_spread_percentage: z.number().nullable().optional(),
		timestamp: z.string().nullable().optional(),
		last_traded_at: z.string().nullable().optional(),
		last_fetch_at: z.string().nullable().optional(),
		is_anomaly: z.boolean().nullable().optional(),
		is_stale: z.boolean().nullable().optional(),
		trade_url: z.string().nullable().optional(),
		token_info_url: z.string().nullable().optional(),
		coin_id: z.string().nullable().optional(),
		target_coin_id: z.string().nullable().optional(),
	})
	.loose();

export const GetExchangesTickersResponseSchema = z.object({
	name: z.string(),
	tickers: z.array(ExchangeTickerSchema),
});

export type GetExchangesTickersInput = z.infer<
	typeof GetExchangesTickersInputSchema
>;
export type GetExchangesTickersResponse = z.infer<
	typeof GetExchangesTickersResponseSchema
>;

/**
 * Get trading tickers (pairs) on a specific exchange.
 *
 * Use this after discovering an exchange via `getExchangesList` to pull pairs, prices,
 * and volumes. Optional filters for coin IDs and orderbook depth.
 *
 * @param params.id - Exchange ID (e.g., 'binance')
 * @param params.coin_ids - Filter tickers by coin IDs (comma-separated)
 * @param params.include_exchange_logo - Include exchange logo (default: false)
 * @param params.page - Page number (default: 1)
 * @param params.depth - Include orderbook depth (default: false)
 * @param params.order - Sort order
 *
 * @returns Exchange trading pairs with volume, price data
 *
 * @example
 * ```typescript
 * const tickers = await getExchangesTickers({
 *   id: 'binance',
 *   coin_ids: 'bitcoin',
 *   page: 1
 * });
 * ```
 */
export async function getExchangesTickers(
	params: GetExchangesTickersInput,
): Promise<GetExchangesTickersResponse> {
	return executeTool(
		"get_exchanges_tickers",
		params,
	) as Promise<GetExchangesTickersResponse>;
}
