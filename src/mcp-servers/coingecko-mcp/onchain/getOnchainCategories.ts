import { z } from "zod";
import { executeTool } from "../shared";

const VolumeChangeSchema = z.object({
	h1: z.string().nullable().optional(),
	h6: z.string().nullable().optional(),
	h12: z.string().nullable().optional(),
	h24: z.string().nullable().optional(),
});

const OnchainCategoryAttributesSchema = z.object({
	name: z.string(),
	description: z.string().nullable().optional(),
	h24_tx_count: z.number().nullable().optional(),
	h24_volume_usd: z.string().nullable().optional(),
	fdv_usd: z.string().nullable().optional(),
	reserve_in_usd: z.string().nullable().optional(),
	volume_change_percentage: VolumeChangeSchema.optional(),
});

const OnchainCategorySchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: OnchainCategoryAttributesSchema,
});

export const GetOnchainCategoriesResponseSchema = z.object({
	data: z.array(OnchainCategorySchema),
});

export type GetOnchainCategoriesResponse = z.infer<
	typeof GetOnchainCategoriesResponseSchema
>;

/**
 * Get list of onchain categories for filtering pools
 *
 * @returns List of categories (e.g., 'Meme', 'DeFi', 'GameFi')
 *
 * @example
 * ```typescript
 * const categories = await getOnchainCategories();
 * ```
 */
export async function getOnchainCategories(): Promise<GetOnchainCategoriesResponse> {
	return executeTool(
		"get_onchain_categories",
		{},
	) as Promise<GetOnchainCategoriesResponse>;
}
