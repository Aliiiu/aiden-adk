/**
 * Get simple token prices for multiple addresses
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetAddressesNetworksSimpleOnchainTokenPriceInputSchema = z.object({
	network: z.string().describe("Network identifier"),
	addresses: z.string().describe("Comma-separated token contract addresses"),
	vs_currencies: z
		.string()
		.optional()
		.describe("Comma-separated target currencies (default 'usd')"),
});

export const GetAddressesNetworksSimpleOnchainTokenPriceResponseSchema =
	z.object({
		data: z.object({
			id: z.string(),
			type: z.string(),
			attributes: z.object({
				token_prices: z.record(z.string(), z.unknown()),
			}),
		}),
	});

export type GetAddressesNetworksSimpleOnchainTokenPriceInput = z.infer<
	typeof GetAddressesNetworksSimpleOnchainTokenPriceInputSchema
>;
export type GetAddressesNetworksSimpleOnchainTokenPriceResponse = z.infer<
	typeof GetAddressesNetworksSimpleOnchainTokenPriceResponseSchema
>;

/**
 * Get simple price for tokens by their contract addresses
 *
 * @param params.network - Network ID
 * @param params.addresses - Comma-separated token addresses
 * @param params.vs_currencies - Comma-separated target currencies (default: 'usd')
 *
 * @returns Token prices for specified addresses
 *
 * @example
 * ```typescript
 * const prices = await getAddressesNetworksSimpleOnchainTokenPrice({
 *   network: 'eth',
 *   addresses: '0x...,0x...',
 *   vs_currencies: 'usd,eth'
 * });
 * ```
 */
export async function getAddressesNetworksSimpleOnchainTokenPrice(
	params: GetAddressesNetworksSimpleOnchainTokenPriceInput,
): Promise<GetAddressesNetworksSimpleOnchainTokenPriceResponse> {
	return executeTool(
		"get_addresses_networks_simple_onchain_token_price",
		params,
	) as Promise<GetAddressesNetworksSimpleOnchainTokenPriceResponse>;
}
