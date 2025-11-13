/**
 * Get exchange data by ID
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetExchangesByIdInputSchema = z.object({
	id: z.string().describe("Exchange ID (e.g., 'binance')"),
});

const ExchangeTickerSchema = z
	.object({
		base: z.string(),
		target: z.string(),
		last: z.number().nullable().optional(),
		volume: z.number().nullable().optional(),
		trust_score: z.string().nullable().optional(),
		bid_ask_spread_percentage: z.number().nullable().optional(),
		timestamp: z.string().nullable().optional(),
		last_traded_at: z.string().nullable().optional(),
		last_fetch_at: z.string().nullable().optional(),
	})
	.loose();

export const GetExchangesByIdResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		year_established: z.number().nullable().optional(),
		country: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		url: z.string().url(),
		image: z.string().url().optional(),
		has_trading_incentive: z.boolean().optional(),
		trust_score: z.number().nullable().optional(),
		trust_score_rank: z.number().nullable().optional(),
		volume_24h_btc: z.number().nullable().optional(),
		tickers: z.array(ExchangeTickerSchema).optional(),
	})
	.loose();

export type GetExchangesByIdInput = z.infer<typeof GetExchangesByIdInputSchema>;
export type GetExchangesByIdResponse = z.infer<
	typeof GetExchangesByIdResponseSchema
>;

/**
 * Get detailed exchange data by exchange ID
 *
 * @param params.id - Exchange ID (e.g., 'binance', 'coinbase_exchange')
 *
 * @returns Detailed exchange data including volume, tickers, trust score
 *
 * @example
 * ```typescript
 * const exchange = await getExchangesById({
 *   id: 'binance'
 * });
 * ```
 */
export async function getExchangesById(
	params: GetExchangesByIdInput,
): Promise<GetExchangesByIdResponse> {
	return executeTool(
		"get_id_exchanges",
		params,
	) as Promise<GetExchangesByIdResponse>;
}
