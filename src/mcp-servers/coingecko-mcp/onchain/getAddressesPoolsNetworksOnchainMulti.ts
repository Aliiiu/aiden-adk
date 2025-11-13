/**
 * Get info for multiple pools by addresses
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetAddressesPoolsNetworksOnchainMultiInputSchema = z.object({
	network: z.string().describe("Network identifier"),
	addresses: z.string().describe("Comma-separated pool addresses to query"),
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
		name: z.string().nullable().optional(),
		address: z.string(),
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

export const GetAddressesPoolsNetworksOnchainMultiResponseSchema = z.object({
	data: z.array(PoolResourceSchema),
	included: z
		.array(
			z.object({
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
			}),
		)
		.optional(),
});

export type GetAddressesPoolsNetworksOnchainMultiInput = z.infer<
	typeof GetAddressesPoolsNetworksOnchainMultiInputSchema
>;
export type GetAddressesPoolsNetworksOnchainMultiResponse = z.infer<
	typeof GetAddressesPoolsNetworksOnchainMultiResponseSchema
>;

/**
 * Get information for multiple pools by their addresses
 *
 * @param params.network - Network ID
 * @param params.addresses - Comma-separated pool addresses
 *
 * @returns Pool information for specified addresses
 *
 * @example
 * ```typescript
 * const pools = await getAddressesPoolsNetworksOnchainMulti({
 *   network: 'eth',
 *   addresses: '0x...,0x...,0x...'
 * });
 * ```
 */
export async function getAddressesPoolsNetworksOnchainMulti(
	params: GetAddressesPoolsNetworksOnchainMultiInput,
): Promise<GetAddressesPoolsNetworksOnchainMultiResponse> {
	return executeTool(
		"get_addresses_pools_networks_onchain_multi",
		params,
	) as Promise<GetAddressesPoolsNetworksOnchainMultiResponse>;
}
