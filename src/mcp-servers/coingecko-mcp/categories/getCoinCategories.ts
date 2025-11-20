import { z } from "zod";
import { executeTool } from "../shared.js";

const CoinCategorySchema = z.object({
	category_id: z.string().describe("Unique category identifier"),
	name: z.string().describe("Category name"),
});

export const GetCoinCategoriesResponseSchema = z
	.array(CoinCategorySchema)
	.describe("List of all available coin categories");

export type GetCoinCategoriesResponse = z.infer<
	typeof GetCoinCategoriesResponseSchema
>;

/**
 * List all coin categories from CoinGecko.
 *
 * Use this to discover sector/segment groupings (e.g., DeFi, AI) and their identifiers
 * before filtering or aggregating coins by category.
 *
 * @returns Array of coin categories
 *
 * @example
 * ```typescript
 * const categories = await getCoinCategories();
 * ```
 */
export async function getCoinCategories(): Promise<GetCoinCategoriesResponse> {
	return executeTool(
		"get_list_coins_categories",
		{},
	) as Promise<GetCoinCategoriesResponse>;
}
