import { z } from "zod";
import { executeTool } from "../shared";

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
 * Get current onchain DEX prices for tokens by their contract addresses.
 *
 * Returns live token prices from onchain DEX data. Use this for contract address price lookups on specific networks.
 * For coin prices by ID, use getSimplePrice or getCoinsMarkets. For historical prices, use getRangeCoinsMarketChart.
 *
 * @param params.network - Network ID (e.g., 'eth', 'bsc', 'polygon')
 * @param params.addresses - Comma-separated token contract addresses on the network
 * @param params.vs_currencies - Comma-separated target currencies (default: 'usd', e.g., 'usd,eth,btc')
 *
 * @returns Current token prices for each address in specified currencies
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
