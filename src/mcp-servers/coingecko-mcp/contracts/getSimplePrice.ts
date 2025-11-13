/**
 * Get current price of tokens (ids, contract addresses) for multiple currencies
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetSimplePriceInputSchema = z.object({
	ids: z
		.string()
		.describe("Comma-separated list of coin IDs (e.g., 'bitcoin,ethereum')"),
	vs_currencies: z
		.string()
		.describe("Comma-separated list of target currencies (e.g., 'usd,eur')"),
	include_market_cap: z
		.boolean()
		.optional()
		.describe("Include market cap values"),
	include_24hr_vol: z
		.boolean()
		.optional()
		.describe("Include 24h volume values"),
	include_24hr_change: z
		.boolean()
		.optional()
		.describe("Include 24h percentage change"),
	include_last_updated_at: z
		.boolean()
		.optional()
		.describe("Include last updated timestamps"),
	precision: z
		.string()
		.optional()
		.describe("Precision parameter (e.g., 'full')"),
});

const SimplePriceEntrySchema = z
	.object({
		last_updated_at: z.number().optional(),
	})
	.catchall(z.number());

export const GetSimplePriceResponseSchema = z.record(
	z.string(),
	SimplePriceEntrySchema,
);

export type GetSimplePriceInput = z.infer<typeof GetSimplePriceInputSchema>;
export type GetSimplePriceResponse = z.infer<
	typeof GetSimplePriceResponseSchema
>;

/**
 * Get current price of tokens for multiple currencies
 *
 * @param params.ids - Coin IDs (comma-separated, e.g., 'bitcoin,ethereum')
 * @param params.vs_currencies - Target currencies (comma-separated, e.g., 'usd,eur')
 * @param params.include_market_cap - Include market cap (default: false)
 * @param params.include_24hr_vol - Include 24hr volume (default: false)
 * @param params.include_24hr_change - Include 24hr change (default: false)
 * @param params.include_last_updated_at - Include last updated timestamp (default: false)
 * @param params.precision - Decimal precision for currency (default: 'full')
 *
 * @returns Price data for requested coins in requested currencies
 *
 * @example
 * ```typescript
 * const prices = await getSimplePrice({
 *   ids: 'bitcoin,ethereum',
 *   vs_currencies: 'usd,eur',
 *   include_24hr_change: true
 * });
 * ```
 */
export async function getSimplePrice(
	params: GetSimplePriceInput,
): Promise<GetSimplePriceResponse> {
	return executeTool(
		"get_simple_price",
		params,
	) as Promise<GetSimplePriceResponse>;
}
