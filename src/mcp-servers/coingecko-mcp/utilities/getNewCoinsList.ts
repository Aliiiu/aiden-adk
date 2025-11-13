/**
 * Get newly added coins (latest 200)
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

const NewCoinSchema = z
	.object({
		id: z.string(),
		symbol: z.string(),
		name: z.string(),
		image: z.url().optional(),
		contract_address: z.string().nullable().optional(),
		market_cap_rank: z.number().nullable().optional(),
		categories: z.array(z.string()).optional(),
		price_btc: z.number().nullable().optional(),
		score: z.number().optional(),
	})
	.loose();

export const GetNewCoinsListResponseSchema = z.array(NewCoinSchema);

export type GetNewCoinsListResponse = z.infer<
	typeof GetNewCoinsListResponseSchema
>;

/**
 * Get newly added coins (latest 200)
 *
 * @returns Array of recently added coins
 *
 * @example
 * ```typescript
 * const newCoins = await getNewCoinsList();
 * ```
 */
export async function getNewCoinsList(): Promise<GetNewCoinsListResponse> {
	return executeTool(
		"get_new_coins_list",
		{},
	) as Promise<GetNewCoinsListResponse>;
}
