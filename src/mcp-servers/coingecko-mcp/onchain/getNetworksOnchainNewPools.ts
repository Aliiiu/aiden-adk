/**
 * Get newly created pools on a network
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetNetworksOnchainNewPoolsInputSchema = z.object({
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

const NewPoolAttributesSchema = z
	.object({
		name: z.string(),
		address: z.string(),
		pool_created_at: z.string().nullable().optional(),
		base_token_price_usd: z.string().nullable().optional(),
		quote_token_price_usd: z.string().nullable().optional(),
		reserve_in_usd: z.string().nullable().optional(),
	})
	.loose();

const NewPoolResourceSchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: NewPoolAttributesSchema,
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

export const GetNetworksOnchainNewPoolsResponseSchema = z.object({
	data: z.array(NewPoolResourceSchema),
	included: z.array(IncludedEntitySchema).optional(),
});

export type GetNetworksOnchainNewPoolsInput = z.infer<
	typeof GetNetworksOnchainNewPoolsInputSchema
>;
export type GetNetworksOnchainNewPoolsResponse = z.infer<
	typeof GetNetworksOnchainNewPoolsResponseSchema
>;

/**
 * Get newly created pools on a specific network
 *
 * @param params.network - Network ID (e.g., 'eth', 'bsc')
 * @param params.page - Page number (default: 1)
 *
 * @returns Recently created pools
 *
 * @example
 * ```typescript
 * const newPools = await getNetworksOnchainNewPools({
 *   network: 'eth'
 * });
 * ```
 */
export async function getNetworksOnchainNewPools(
	params: GetNetworksOnchainNewPoolsInput,
): Promise<GetNetworksOnchainNewPoolsResponse> {
	return executeTool(
		"get_networks_onchain_new_pools",
		params,
	) as Promise<GetNetworksOnchainNewPoolsResponse>;
}
