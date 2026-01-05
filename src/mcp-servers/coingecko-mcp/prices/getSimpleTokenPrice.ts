import { z } from "zod";
import { executeTool } from "../shared";

export const GetSimpleTokenPriceInputSchema = z.object({
	id: z.string().describe("Asset platform ID (e.g., 'ethereum')"),
	contract_addresses: z
		.string()
		.describe("Comma-separated contract addresses to quote"),
	vs_currencies: z
		.string()
		.optional()
		.describe("Comma-separated target currencies (default 'usd')"),
	include_market_cap: z
		.union([z.boolean(), z.string()])
		.optional()
		.describe("Include market cap metrics"),
	include_24hr_vol: z
		.union([z.boolean(), z.string()])
		.optional()
		.describe("Include 24h volume metrics"),
	include_24hr_change: z
		.union([z.boolean(), z.string()])
		.optional()
		.describe("Include 24h percentage change"),
	include_last_updated_at: z
		.union([z.boolean(), z.string()])
		.optional()
		.describe("Include last updated timestamp"),
});

const TokenPriceEntrySchema = z
	.object({
		last_updated_at: z.number().optional(),
	})
	.catchall(z.number());

export const GetSimpleTokenPriceResponseSchema = z.record(
	z.string(),
	TokenPriceEntrySchema,
);

export type GetSimpleTokenPriceInput = z.infer<
	typeof GetSimpleTokenPriceInputSchema
>;
export type GetSimpleTokenPriceResponse = z.infer<
	typeof GetSimpleTokenPriceResponseSchema
>;

/**
 * Get current token price by contract address on a specific platform (chain).
 *
 * Use this for contract-level pricing (e.g., ERC-20 tokens). Requires `id` (platform)
 * and `contract_addresses`. For broader coin pricing by ID, use `getCoinsMarkets`.
 *
 * @param params.id - Platform ID (e.g., 'ethereum', 'binance-smart-chain')
 * @param params.contract_addresses - Comma-separated contract addresses
 * @param params.vs_currencies - Comma-separated target currencies (default: 'usd')
 * @param params.include_market_cap - Include market cap (default: false)
 * @param params.include_24hr_vol - Include 24h volume (default: false)
 * @param params.include_24hr_change - Include 24h change (default: false)
 * @param params.include_last_updated_at - Include last updated timestamp (default: false)
 *
 * @returns Token prices keyed by contract address
 *
 * @example
 * ```typescript
 * const price = await getSimpleTokenPrice({
 *   id: 'ethereum',
 *   contract_addresses: '0x...',
 *   vs_currencies: 'usd',
 *   include_24hr_change: true
 * });
 * ```
 */
export async function getSimpleTokenPrice(
	params: GetSimpleTokenPriceInput,
): Promise<GetSimpleTokenPriceResponse> {
	return executeTool(
		"get_id_simple_token_price",
		params,
	) as Promise<GetSimpleTokenPriceResponse>;
}
