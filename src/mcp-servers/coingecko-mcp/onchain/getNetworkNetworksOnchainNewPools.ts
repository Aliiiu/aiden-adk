/**
 * Get new pools across a specific network (alternate endpoint)
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetNetworkNetworksOnchainNewPoolsInputSchema = z.object({
	network: z.string().describe("Network identifier (e.g., 'eth')"),
	page: z.number().int().positive().optional().describe("Page number"),
});

const RelationshipRefSchema = z.object({
	data: z
		.object({
			id: z.string(),
			type: z.string(),
		})
		.nullable()
		.optional(),
});

const PoolAttributesSchema = z
	.object({
		name: z.string(),
		address: z.string(),
		pool_created_at: z.string().nullable().optional(),
		base_token_price_usd: z.string().nullable().optional(),
		quote_token_price_usd: z.string().nullable().optional(),
		reserve_in_usd: z.string().nullable().optional(),
	})
	.loose();

const PoolResourceSchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: PoolAttributesSchema,
	relationships: z
		.object({
			base_token: RelationshipRefSchema.optional(),
			quote_token: RelationshipRefSchema.optional(),
			dex: RelationshipRefSchema.optional(),
		})
		.partial()
		.optional(),
});

const IncludedEntitySchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: z
		.object({
			address: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
			symbol: z.string().nullable().optional(),
		})
		.loose()
		.optional(),
});

export const GetNetworkNetworksOnchainNewPoolsResponseSchema = z.object({
	data: z.array(PoolResourceSchema),
	included: z.array(IncludedEntitySchema).optional(),
});

export type GetNetworkNetworksOnchainNewPoolsInput = z.infer<
	typeof GetNetworkNetworksOnchainNewPoolsInputSchema
>;
export type GetNetworkNetworksOnchainNewPoolsResponse = z.infer<
	typeof GetNetworkNetworksOnchainNewPoolsResponseSchema
>;

/**
 * Get newly created pools on a network (alternate endpoint)
 *
 * @param params.network - Network ID
 * @param params.page - Page number (default: 1)
 *
 * @returns Recently created pools
 *
 * @example
 * ```typescript
 * const newPools = await getNetworkNetworksOnchainNewPools({
 *   network: 'eth'
 * });
 * ```
 */
export async function getNetworkNetworksOnchainNewPools(
	params: GetNetworkNetworksOnchainNewPoolsInput,
): Promise<GetNetworkNetworksOnchainNewPoolsResponse> {
	return executeTool(
		"get_network_networks_onchain_new_pools",
		params,
	) as Promise<GetNetworkNetworksOnchainNewPoolsResponse>;
}
