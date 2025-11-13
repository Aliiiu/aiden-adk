/**
 * Get coins by category with market data
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetCoinsCategoriesInputSchema = z
	.object({
		order: z
			.string()
			.optional()
			.describe(
				"Sorting: market_cap_desc, market_cap_asc, volume_24h_desc, etc.",
			),
	})
	.optional();

const CoinsCategorySchema = z
	.object({
		id: z.string().describe("Category identifier"),
		name: z.string().describe("Category display name"),
		market_cap: z.number().describe("Aggregate market cap in USD"),
		market_cap_change_24h: z
			.number()
			.describe("24h percentage change of market cap"),
		market_cap_24h: z
			.number()
			.optional()
			.describe("Absolute 24h market cap change"),
		volume_24h: z.number().describe("24h trading volume in USD"),
		updated_at: z.number().describe("Last update timestamp (unix seconds)"),
		top_3_coins: z
			.array(z.string())
			.describe("Logos of the top three coins by market cap"),
	})
	.loose();

export const GetCoinsCategoriesResponseSchema = z
	.array(CoinsCategorySchema)
	.describe("Market metrics for each category");

export type GetCoinsCategoriesInput = z.infer<
	typeof GetCoinsCategoriesInputSchema
>;
export type GetCoinsCategoriesResponse = z.infer<
	typeof GetCoinsCategoriesResponseSchema
>;

/**
 * Get coins by category with market data
 *
 * @param params.order - Sort order: market_cap_desc, market_cap_asc, etc.
 *
 * @returns Categories with market data
 *
 * @example
 * ```typescript
 * const categories = await getCoinsCategories({
 *   order: 'market_cap_desc'
 * });
 * ```
 */
export async function getCoinsCategories(
	params?: GetCoinsCategoriesInput,
): Promise<GetCoinsCategoriesResponse> {
	return executeTool(
		"get_coins_categories",
		params ?? {},
	) as Promise<GetCoinsCategoriesResponse>;
}
