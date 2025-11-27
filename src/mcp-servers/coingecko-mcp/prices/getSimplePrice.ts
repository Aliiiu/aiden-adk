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
 * Get current price for a specific coin by its CoinGecko ID (lightweight price lookup).
 *
 * PRIMARY function for current live price lookups of specific coins, tokens, and cryptocurrencies.
 * Use this when you need the current price, latest price, real-time price, or spot price of a coin.
 * This is for individual coin price queries, single token prices, and specific cryptocurrency prices.
 *
 * IMPORTANT: Requires CoinGecko IDs (NOT ticker symbols). Many coins have different IDs than their ticker.
 * Always use search() first to find the correct ID when the coin ID is unknown.
 *
 * LIMITATIONS: Returns ONLY current price + optional market cap/volume/24h change.
 * Does NOT include ATH, ATL, or detailed market data. For complete market data use getCoinDetails().
 *
 * Workflow for coin price lookups:
 * 1. Use search({ query: 'coin name or symbol' }) to find coin ID
 * 2. Use getSimplePrice({ ids: 'found-coin-id', vs_currencies: 'usd' })
 *
 * For ATH/ATL data use getCoinDetails().
 *
 * @param params.ids - Coin IDs (comma-separated, e.g., 'bitcoin,ethereum')
 * @param params.vs_currencies - Target currencies (comma-separated, e.g., 'usd,eur')
 * @param params.include_market_cap - Include market cap (default: false)
 * @param params.include_24hr_vol - Include 24hr volume (default: false)
 * @param params.include_24hr_change - Include 24hr change (default: false)
 * @param params.include_last_updated_at - Include last updated timestamp (default: false)
 * @param params.precision - Decimal precision for currency (default: 'full')
 *
 * @returns Price data: { coinId: { usd: price, ... }, ... }
 *
 * @example
 * ```typescript
 * const prices = await getSimplePrice({
 *   ids: 'bitcoin,ethereum',
 *   vs_currencies: 'usd,eur',
 *   include_24hr_change: true
 * });
 * // Returns: { bitcoin: { usd: 50000, eur: 42000, usd_24h_change: 2.5 }, ethereum: { ... } }
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
