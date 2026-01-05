import { z } from "zod";
import { executeTool } from "../shared";

export const GetAddressesTokensNetworksOnchainMultiInputSchema = z.object({
	network: z.string().describe("Network identifier"),
	addresses: z.string().describe("Comma-separated token contract addresses"),
});

const TokenAttributesSchema = z
	.object({
		name: z.string(),
		symbol: z.string().nullable().optional(),
		address: z.string(),
		decimals: z.number().nullable().optional(),
		image_url: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
	})
	.loose();

const TokenResourceSchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: TokenAttributesSchema,
});

export const GetAddressesTokensNetworksOnchainMultiResponseSchema = z.object({
	data: z.array(TokenResourceSchema),
});

export type GetAddressesTokensNetworksOnchainMultiInput = z.infer<
	typeof GetAddressesTokensNetworksOnchainMultiInputSchema
>;
export type GetAddressesTokensNetworksOnchainMultiResponse = z.infer<
	typeof GetAddressesTokensNetworksOnchainMultiResponseSchema
>;

/**
 * Get information for multiple tokens by their addresses
 *
 * @param params.network - Network ID
 * @param params.addresses - Comma-separated token addresses
 *
 * @returns Token information for specified addresses
 *
 * @example
 * ```typescript
 * const tokens = await getAddressesTokensNetworksOnchainMulti({
 *   network: 'eth',
 *   addresses: '0x...,0x...,0x...'
 * });
 * ```
 */
export async function getAddressesTokensNetworksOnchainMulti(
	params: GetAddressesTokensNetworksOnchainMultiInput,
): Promise<GetAddressesTokensNetworksOnchainMultiResponse> {
	return executeTool(
		"get_addresses_tokens_networks_onchain_multi",
		params,
	) as Promise<GetAddressesTokensNetworksOnchainMultiResponse>;
}
