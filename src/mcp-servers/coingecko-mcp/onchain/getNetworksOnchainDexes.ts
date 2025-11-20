import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetNetworksOnchainDexesInputSchema = z.object({
	network: z.string().describe("Network identifier (e.g., 'eth')"),
});

const DexEntrySchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: z.object({
		name: z.string(),
	}),
});

export const GetNetworksOnchainDexesResponseSchema = z.object({
	data: z.array(DexEntrySchema),
});

export type GetNetworksOnchainDexesInput = z.infer<
	typeof GetNetworksOnchainDexesInputSchema
>;
export type GetNetworksOnchainDexesResponse = z.infer<
	typeof GetNetworksOnchainDexesResponseSchema
>;

/**
 * Get list of DEXes on a specific blockchain network
 *
 * @param params.network - Network ID (e.g., 'eth', 'bsc', 'polygon')
 *
 * @returns List of DEXes on the specified network
 *
 * @example
 * ```typescript
 * const dexes = await getNetworksOnchainDexes({
 *   network: 'eth'
 * });
 * ```
 */
export async function getNetworksOnchainDexes(
	params: GetNetworksOnchainDexesInput,
): Promise<GetNetworksOnchainDexesResponse> {
	return executeTool(
		"get_networks_onchain_dexes",
		params,
	) as Promise<GetNetworksOnchainDexesResponse>;
}
