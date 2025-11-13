/**
 * Get list of all exchanges
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetExchangesListInputSchema = z
	.object({
		per_page: z
			.number()
			.int()
			.positive()
			.optional()
			.describe("Results per page (default 100)"),
		page: z
			.number()
			.int()
			.positive()
			.optional()
			.describe("Page number (default 1)"),
	})
	.optional();

const ExchangeSummarySchema = z
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
		trade_volume_24h_btc: z.number().nullable().optional(),
		trade_volume_24h_btc_normalized: z.number().nullable().optional(),
	})
	.loose();

export const GetExchangesListResponseSchema = z.array(ExchangeSummarySchema);

export type GetExchangesListInput = z.infer<typeof GetExchangesListInputSchema>;
export type GetExchangesListResponse = z.infer<
	typeof GetExchangesListResponseSchema
>;

/**
 * Get list of all supported exchanges
 *
 * @param params.per_page - Results per page (default: 100)
 * @param params.page - Page number (default: 1)
 *
 * @returns List of exchanges with basic info
 *
 * @example
 * ```typescript
 * const exchanges = await getExchangesList({
 *   per_page: 50
 * });
 * ```
 */
export async function getExchangesList(
	params?: GetExchangesListInput,
): Promise<GetExchangesListResponse> {
	return executeTool(
		"get_list_exchanges",
		params ?? {},
	) as Promise<GetExchangesListResponse>;
}
