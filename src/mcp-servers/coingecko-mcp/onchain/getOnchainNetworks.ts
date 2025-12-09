import { z } from "zod";
import { executeTool } from "../shared";

const OnchainNetworkSchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: z.object({
		coingecko_asset_platform_id: z.string().nullable().optional(),
		name: z.string(),
	}),
});

export const GetOnchainNetworksResponseSchema = z.object({
	data: z.array(OnchainNetworkSchema),
});

export type GetOnchainNetworksResponse = z.infer<
	typeof GetOnchainNetworksResponseSchema
>;

/**
 * Get list of all supported onchain networks
 *
 * @returns List of blockchain networks with IDs and names
 *
 * @example
 * ```typescript
 * const networks = await getOnchainNetworks();
 * ```
 */
export async function getOnchainNetworks(): Promise<GetOnchainNetworksResponse> {
	return executeTool(
		"get_onchain_networks",
		{},
	) as Promise<GetOnchainNetworksResponse>;
}
