import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetTokensNetworksOnchainPoolsInputSchema = z.object({
	network: z.string().describe("Network identifier"),
	token_address: z.string().describe("Token contract address"),
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

const TokenPoolAttributesSchema = z
	.object({
		name: z.string(),
		address: z.string(),
		base_token_price_usd: z.string().nullable().optional(),
		quote_token_price_usd: z.string().nullable().optional(),
		reserve_in_usd: z.string().nullable().optional(),
		fdv_usd: z.string().nullable().optional(),
		market_cap_usd: z.string().nullable().optional(),
	})
	.loose();

const TokenPoolResourceSchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: TokenPoolAttributesSchema,
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
			image_url: z.string().nullable().optional(),
		})
		.loose()
		.optional(),
});

export const GetTokensNetworksOnchainPoolsResponseSchema = z.object({
	data: z.array(TokenPoolResourceSchema),
	included: z.array(IncludedEntitySchema).optional(),
});

export type GetTokensNetworksOnchainPoolsInput = z.infer<
	typeof GetTokensNetworksOnchainPoolsInputSchema
>;
export type GetTokensNetworksOnchainPoolsResponse = z.infer<
	typeof GetTokensNetworksOnchainPoolsResponseSchema
>;

/**
 * Get all trading pools for a specific token
 *
 * @param params.network - Network ID
 * @param params.token_address - Token contract address
 * @param params.page - Page number (default: 1)
 *
 * @returns Pools where the token is traded
 *
 * @example
 * ```typescript
 * const pools = await getTokensNetworksOnchainPools({
 *   network: 'eth',
 *   token_address: '0x...'
 * });
 * ```
 */
export async function getTokensNetworksOnchainPools(
	params: GetTokensNetworksOnchainPoolsInput,
): Promise<GetTokensNetworksOnchainPoolsResponse> {
	return executeTool(
		"get_tokens_networks_onchain_pools",
		params,
	) as Promise<GetTokensNetworksOnchainPoolsResponse>;
}
