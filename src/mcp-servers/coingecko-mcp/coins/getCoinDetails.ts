import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetCoinDetailsInputSchema = z.object({
	id: z.string().describe("Coin ID (use getCoinsList to discover IDs)"),
	localization: z
		.union([z.boolean(), z.string()])
		.optional()
		.describe("Include localized description (default true)"),
	tickers: z
		.union([z.boolean(), z.string()])
		.optional()
		.describe("Include exchange tickers (default true)"),
	market_data: z
		.union([z.boolean(), z.string()])
		.optional()
		.describe("Include market data (default true)"),
	community_data: z
		.union([z.boolean(), z.string()])
		.optional()
		.describe("Include community data (default true)"),
	developer_data: z
		.union([z.boolean(), z.string()])
		.optional()
		.describe("Include developer stats (default true)"),
	sparkline: z
		.union([z.boolean(), z.string()])
		.optional()
		.describe("Include 7-day sparkline data (default false)"),
	dex_pair_format: z
		.enum(["contract_address", "symbol"])
		.optional()
		.describe(
			"Format DEX pairs as contract addresses (default) or human-readable symbols",
		),
});

const ImageSchema = z
	.object({
		thumb: z.string().url().optional(),
		small: z.string().url().optional(),
		large: z.string().url().optional(),
	})
	.partial();

const MarketDataSchema = z
	.object({
		current_price: z.record(z.string(), z.number()).optional(),
		market_cap: z.record(z.string(), z.number()).optional(),
		total_volume: z.record(z.string(), z.number()).optional(),
		price_change_percentage_24h: z.number().optional(),
		sparkline_7d: z
			.object({
				price: z.array(z.number()),
			})
			.optional(),
	})
	.loose();

const CoinTickerSchema = z
	.object({
		base: z.string(),
		target: z.string(),
		market: z
			.object({
				name: z.string(),
				identifier: z.string().optional(),
			})
			.loose(),
		last: z.number().optional(),
		volume: z.number().optional(),
		trust_score: z.string().nullable().optional(),
		converted_last: z.record(z.string(), z.number()).optional(),
	})
	.loose();

export const GetCoinDetailsResponseSchema = z
	.object({
		id: z.string(),
		symbol: z.string(),
		name: z.string(),
		asset_platform_id: z.string().nullable().optional(),
		block_time_in_minutes: z.number().nullable().optional(),
		hashing_algorithm: z.string().nullable().optional(),
		categories: z.array(z.string()).optional(),
		description: z.record(z.string(), z.string()).optional(),
		links: z.record(z.string(), z.unknown()).optional(),
		image: ImageSchema.optional(),
		market_data: MarketDataSchema.optional(),
		market_cap_rank: z.number().nullable().optional(),
		community_data: z.record(z.string(), z.unknown()).optional(),
		developer_data: z.record(z.string(), z.unknown()).optional(),
		localization: z.record(z.string(), z.string()).optional(),
		tickers: z.array(CoinTickerSchema).optional(),
	})
	.loose();

export type GetCoinDetailsInput = z.infer<typeof GetCoinDetailsInputSchema>;
export type GetCoinDetailsResponse = z.infer<
	typeof GetCoinDetailsResponseSchema
>;

/**
 * Get full profile, market, community, and developer data for a specific coin.
 *
 * PRIMARY function for complete coin data including ATH, ATL, market cap, volume, price history,
 * descriptions, links, and fundamentals. Use this for specific coin lookups when you need
 * detailed market data beyond just current price.
 *
 * WORKFLOW: Always use search() first to find coin ID, then getCoinDetails():
 * 1. Use search({ query: 'coin name' }) to find coin ID
 * 2. Use getCoinDetails({ id: coinId, market_data: true })
 * 3. Access market_data.ath, market_data.atl, market_data.current_price, etc.
 *
 * INCLUDES: When market_data: true, response includes ATH (all-time high), ATL (all-time low),
 * current price, market cap, volume, price changes, supply data, and more. Also includes
 * coin descriptions, categories, links, community stats, and developer metrics.
 *
 * For lightweight price-only lookups use getSimplePrice(). For historical prices use getCoinsHistory().
 *
 * @param params.id - Coin ID (use search() to find IDs)
 * @param params.localization - Include localized languages (default: true)
 * @param params.tickers - Include ticker data (default: true)
 * @param params.market_data - Include market data with ATH/ATL (default: true)
 * @param params.community_data - Include community data (default: true)
 * @param params.developer_data - Include developer data (default: true)
 * @param params.sparkline - Include sparkline data (default: false)
 *
 * @returns Detailed coin data with market_data.ath, market_data.atl, descriptions, links, etc.
 *
 * @example
 * ```typescript
 * // Get IQ token's ATH data
 * const searchResults = await search({ query: 'IQ' });
 * const coinId = searchResults.coins[0]?.id;
 * const coinData = await getCoinDetails({ id: coinId, market_data: true });
 * const ath = coinData.market_data?.ath?.usd;
 * const athDate = coinData.market_data?.ath_date?.usd;
 * ```
 */
export async function getCoinDetails(
	params: GetCoinDetailsInput,
): Promise<GetCoinDetailsResponse> {
	return executeTool("get_id_coins", params) as Promise<GetCoinDetailsResponse>;
}
