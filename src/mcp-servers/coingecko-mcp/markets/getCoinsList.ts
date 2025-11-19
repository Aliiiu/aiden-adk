import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetCoinsListInputSchema = z
	.object({
		include_platform: z
			.boolean()
			.optional()
			.describe("Include platform contract addresses"),
	})
	.optional();

const CoinListEntrySchema = z
	.object({
		id: z.string(),
		symbol: z.string(),
		name: z.string(),
		platforms: z.record(z.string(), z.string().nullable()).optional(),
	})
	.loose();

export const GetCoinsListResponseSchema = z.array(CoinListEntrySchema);

export type GetCoinsListInput = z.infer<typeof GetCoinsListInputSchema>;
export type GetCoinsListResponse = z.infer<typeof GetCoinsListResponseSchema>;

/**
 * List all supported coins with ID, name, and symbol.
 *
 * Use this to discover coin IDs before calling price/market endpoints. Optional platform
 * addresses can be included when you need contract mappings.
 *
 * @param params.include_platform - Include platform contract addresses (default: false)
 * @returns Array of all supported coins
 *
 * @example
 * ```typescript
 * const coins = await getCoinsList({ include_platform: true });
 * ```
 */
export async function getCoinsList(
	params?: GetCoinsListInput,
): Promise<GetCoinsListResponse> {
	return executeTool(
		"get_coins_list",
		params ?? {},
	) as Promise<GetCoinsListResponse>;
}
