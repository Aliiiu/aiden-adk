import { z } from "zod";
import { executeTool } from "../shared";

export const GetAssetPlatformsInputSchema = z
	.object({
		filter: z
			.enum(["nft"])
			.optional()
			.describe("Optional filter (currently supports 'nft')"),
	})
	.optional();

const AssetPlatformSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		shortname: z.string().nullable().optional(),
		chain_identifier: z.number().nullable().optional(),
		native_coin_id: z.string().nullable().optional(),
		image: z
			.object({
				thumb: z.string().optional(),
				small: z.string().optional(),
				large: z.string().optional(),
			})
			.optional(),
	})
	.loose();

export const GetAssetPlatformsResponseSchema = z.array(AssetPlatformSchema);

export type GetAssetPlatformsInput = z.infer<
	typeof GetAssetPlatformsInputSchema
>;
export type GetAssetPlatformsResponse = z.infer<
	typeof GetAssetPlatformsResponseSchema
>;

/**
 * List available asset platforms (blockchains) supported by CoinGecko.
 *
 * Use this to find platform IDs (e.g., 'ethereum', 'binance-smart-chain') required for
 * contract-based endpoints like `getCoinsContract` or onchain token price lookups.
 *
 * @param params.filter - Optional filter (e.g., 'nft')
 * @returns Array of asset platforms
 *
 * @example
 * ```typescript
 * const platforms = await getAssetPlatforms();
 * ```
 */
export async function getAssetPlatforms(
	params?: GetAssetPlatformsInput,
): Promise<GetAssetPlatformsResponse> {
	return executeTool(
		"get_asset_platforms",
		params ?? {},
	) as Promise<GetAssetPlatformsResponse>;
}
