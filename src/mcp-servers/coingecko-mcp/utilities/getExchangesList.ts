import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetUtilitiesExchangesListInputSchema = z
	.object({
		per_page: z
			.number()
			.int()
			.positive()
			.optional()
			.describe("Results per page (default 100)"),
		page: z
			.union([z.number().int().positive(), z.string()])
			.optional()
			.describe("Page number"),
	})
	.optional();

const ExchangeSummarySchema = z
	.object({
		id: z.string(),
		name: z.string(),
		year_established: z.number().nullable().optional(),
		country: z.string().nullable().optional(),
		url: z.string().url(),
		image: z.string().url().optional(),
		trust_score_rank: z.number().nullable().optional(),
		volume_24h: z.number().nullable().optional(),
	})
	.loose();

export const GetUtilitiesExchangesListResponseSchema = z.array(
	ExchangeSummarySchema,
);

export type GetUtilitiesExchangesListInput = z.infer<
	typeof GetUtilitiesExchangesListInputSchema
>;
export type GetUtilitiesExchangesListResponse = z.infer<
	typeof GetUtilitiesExchangesListResponseSchema
>;

/**
 * List cryptocurrency exchanges with basic metadata.
 *
 * Use this to discover exchange IDs before requesting tickers or volume charts.
 *
 * @param params.per_page - Results per page (default: 100)
 * @param params.page - Page number (default: 1)
 *
 * @returns Array of exchanges
 *
 * @example
 * ```typescript
 * const exchanges = await getExchangesList();
 * ```
 */
export async function getExchangesList(
	params?: GetUtilitiesExchangesListInput,
): Promise<GetUtilitiesExchangesListResponse> {
	return executeTool(
		"get_list_exchanges",
		params ?? {},
	) as Promise<GetUtilitiesExchangesListResponse>;
}
