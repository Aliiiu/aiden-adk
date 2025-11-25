import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetCoinsMarketsInputSchema = z.object({
	vs_currency: z
		.string()
		.optional()
		.default("usd")
		.describe("Target currency (e.g., 'usd')"),
	order: z
		.string()
		.optional()
		.describe(
			"Sorting order (market_cap_desc, volume_desc, id_asc, id_desc, etc.)",
		),
	per_page: z
		.number()
		.int()
		.positive()
		.max(250)
		.optional()
		.describe("Results per page (1-250, default 100)"),
	page: z
		.number()
		.int()
		.positive()
		.optional()
		.describe("Page number (default 1)"),
	sparkline: z.boolean().optional().describe("Include 7-day sparkline data"),
	price_change_percentage: z
		.string()
		.optional()
		.describe("Comma-separated price change periods (1h,24h,7d, etc.)"),
	locale: z.string().optional().describe("Language locale code"),
	precision: z
		.union([z.number(), z.string()])
		.optional()
		.describe("Decimal precision for currency values"),
	category: z
		.string()
		.optional()
		.describe("Restrict results to a specific category"),
});

const RoiSchema = z
	.object({
		times: z.number(),
		currency: z.string(),
		percentage: z.number(),
	})
	.partial();

const SparklineSchema = z.object({
	price: z.array(z.number()),
});

const CoinMarketEntrySchema = z
	.object({
		id: z.string(),
		symbol: z.string(),
		name: z.string(),
		image: z.string().url(),
		current_price: z.number().nullable(),
		market_cap: z.number().nullable(),
		market_cap_rank: z.number().nullable(),
		fully_diluted_valuation: z.number().nullable().optional(),
		total_volume: z.number().nullable(),
		high_24h: z.number().nullable().optional(),
		low_24h: z.number().nullable().optional(),
		price_change_24h: z.number().nullable().optional(),
		price_change_percentage_24h: z.number().nullable().optional(),
		market_cap_change_24h: z.number().nullable().optional(),
		market_cap_change_percentage_24h: z.number().nullable().optional(),
		circulating_supply: z.number().nullable().optional(),
		total_supply: z.number().nullable().optional(),
		max_supply: z.number().nullable().optional(),
		ath: z.number().nullable().optional(),
		ath_change_percentage: z.number().nullable().optional(),
		ath_date: z.string().nullable().optional(),
		atl: z.number().nullable().optional(),
		atl_change_percentage: z.number().nullable().optional(),
		atl_date: z.string().nullable().optional(),
		roi: RoiSchema.nullable().optional(),
		last_updated: z.string().optional(),
		sparkline_in_7d: SparklineSchema.optional(),
	})
	.loose();

export const GetCoinsMarketsResponseSchema = z.array(CoinMarketEntrySchema);

export type GetCoinsMarketsInput = z.infer<typeof GetCoinsMarketsInputSchema>;
export type GetCoinsMarketsResponse = z.infer<
	typeof GetCoinsMarketsResponseSchema
>;

/**
 * Get paginated list of top cryptocurrencies ranked by market cap, volume, or ID.
 *
 * Returns market data for top coins including price, ATH, ATL, market cap, volume, and price changes.
 * Use this for leaderboards, market overviews, and browsing top cryptocurrencies by rank.
 *
 * LIMITATIONS: Returns only top-ranked coins (paginated, max 250 per page). Lower market cap coins may not appear in results.
 *
 * WORKFLOW: For specific coin data lookups, use getCoinDetails() instead:
 * 1. Use search({ query: 'coin name' }) to find coin ID
 * 2. Use getCoinDetails({ id: coinId, market_data: true }) to get complete data
 *
 * @param params.vs_currency - Target currency (default: 'usd')
 * @param params.order - Sort order: market_cap_desc, volume_desc, id_asc, id_desc
 * @param params.per_page - Results per page (1-250, default: 100)
 * @param params.page - Page number (default: 1)
 * @param params.sparkline - Include 7-day sparkline data (default: false)
 * @param params.price_change_percentage - Price change timeframes: 1h,24h,7d,14d,30d,200d,1y
 * @param params.locale - Language locale (default: 'en')
 * @param params.precision - Decimal places for currency (default: 2)
 * @param params.category - Filter by category (e.g., 'decentralized-finance-defi')
 *
 * @returns Paginated array of coins with comprehensive data:
 * - current_price: Current price in target currency
 * - ath: All-time high price
 * - ath_change_percentage: Percentage change from ATH
 * - ath_date: Date when ATH was reached
 * - atl: All-time low price
 * - atl_change_percentage: Percentage change from ATL
 * - atl_date: Date when ATL was reached
 * - market_cap, total_volume, circulating_supply, max_supply
 * - price_change_24h, price_change_percentage_24h
 * - high_24h, low_24h
 *
 * @example
 * ```typescript
 * // Get top 10 coins by market cap
 * const top10 = await getCoinsMarkets({
 *   vs_currency: 'usd',
 *   order: 'market_cap_desc',
 *   per_page: 10
 * });
 * // Returns: [{ id: 'bitcoin', symbol: 'btc', current_price: 50000, ath: 69000, ... }, ...]
 * ```
 */
export async function getCoinsMarkets(
	params: GetCoinsMarketsInput,
): Promise<GetCoinsMarketsResponse> {
	const parsedParams = GetCoinsMarketsInputSchema.parse(params);
	return executeTool(
		"get_coins_markets",
		parsedParams,
	) as Promise<GetCoinsMarketsResponse>;
}
