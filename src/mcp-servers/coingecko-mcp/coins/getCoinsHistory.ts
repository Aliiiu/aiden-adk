/**
 * Get historical market data (price, market cap, 24h volume) for a coin at a specific date.
 *
 * Use this for point-in-time lookups (e.g., valuation at a past date). Requires the coin ID.
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetCoinsHistoryInputSchema = z.object({
	id: z.string().describe("Coin identifier"),
	date: z.string().describe("Date in dd-mm-yyyy format"),
	localization: z
		.boolean()
		.optional()
		.describe("Include localized data (default true)"),
});

const HistoricalMarketDataSchema = z
	.object({
		current_price: z.record(z.string(), z.number()).optional(),
		market_cap: z.record(z.string(), z.number()).optional(),
		total_volume: z.record(z.string(), z.number()).optional(),
	})
	.loose();

export const GetCoinsHistoryResponseSchema = z
	.object({
		id: z.string(),
		symbol: z.string(),
		name: z.string(),
		image: z
			.object({
				thumb: z.string().optional(),
				small: z.string().optional(),
			})
			.optional(),
		market_data: HistoricalMarketDataSchema.optional(),
		community_data: z.record(z.string(), z.unknown()).optional(),
		developer_data: z.record(z.string(), z.unknown()).optional(),
		localization: z.record(z.string(), z.string()).optional(),
	})
	.loose();

export type GetCoinsHistoryInput = z.infer<typeof GetCoinsHistoryInputSchema>;
export type GetCoinsHistoryResponse = z.infer<
	typeof GetCoinsHistoryResponseSchema
>;

/**
 * Get historical snapshot of coin data at a specific date
 *
 * @param params.id - Coin ID
 * @param params.date - Date in format dd-mm-yyyy (e.g., '30-12-2022')
 * @param params.localization - Include all localized languages (default: true)
 *
 * @returns Historical snapshot including price, market data, community data
 *
 * @example
 * ```typescript
 * const snapshot = await getCoinsHistory({
 *   id: 'bitcoin',
 *   date: '01-01-2023'
 * });
 * ```
 */
export async function getCoinsHistory(
	params: GetCoinsHistoryInput,
): Promise<GetCoinsHistoryResponse> {
	return executeTool(
		"get_coins_history",
		params,
	) as Promise<GetCoinsHistoryResponse>;
}
