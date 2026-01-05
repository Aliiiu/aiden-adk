import { z } from "zod";
import { executeTool } from "../shared";

export const GetNftsByIdInputSchema = z.object({
	id: z.string().describe("NFT collection ID"),
});

const NftMarketDataSchema = z
	.object({
		floor_price: z.record(z.string(), z.number()).optional(),
		floor_price_in_usd_24h_percentage_change: z.number().optional(),
		volume_24h: z.record(z.string(), z.number()).optional(),
		volume_24h_change: z.number().optional(),
	})
	.loose();

export const GetNftsByIdResponseSchema = z
	.object({
		id: z.string(),
		contract_address: z.string().nullable().optional(),
		asset_platform_id: z.string().nullable().optional(),
		name: z.string(),
		symbol: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		image: z.string().url().nullable().optional(),
		market_cap: z.number().nullable().optional(),
		market_data: NftMarketDataSchema.optional(),
		number_of_unique_addresses: z.number().nullable().optional(),
		total_supply: z.number().nullable().optional(),
	})
	.loose();

export type GetNftsByIdInput = z.infer<typeof GetNftsByIdInputSchema>;
export type GetNftsByIdResponse = z.infer<typeof GetNftsByIdResponseSchema>;

/**
 * Get current data for an NFT collection by ID.
 *
 * @param params.id - NFT collection ID
 * @returns Detailed NFT collection data including floor price, volume, attributes
 *
 * @example
 * ```typescript
 * const collection = await getNftsById({ id: 'cryptopunks' });
 * ```
 */
export async function getNftsById(
	params: GetNftsByIdInput,
): Promise<GetNftsByIdResponse> {
	return executeTool("get_id_nfts", params) as Promise<GetNftsByIdResponse>;
}
