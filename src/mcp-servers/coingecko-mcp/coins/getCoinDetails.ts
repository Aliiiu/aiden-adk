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
 * Use this when you need detailed fundamentals, descriptions, tickers, and metrics.
 * Discover coin IDs first via `search` or `getCoinsList`.
 *
 * @param params.id - Coin ID (use getCoinsList/search to find IDs)
 * @param params.localization - Include localized languages (default: true)
 * @param params.tickers - Include ticker data (default: true)
 * @param params.market_data - Include market data (default: true)
 * @param params.community_data - Include community data (default: true)
 * @param params.developer_data - Include developer data (default: true)
 * @param params.sparkline - Include sparkline data (default: false)
 *
 * @returns Detailed coin data
 *
 * @example
 * ```typescript
 * const bitcoin = await getCoinDetails({
 *   id: 'bitcoin',
 *   market_data: true,
 *   sparkline: true
 * });
 * ```
 */
export async function getCoinDetails(
	params: GetCoinDetailsInput,
): Promise<GetCoinDetailsResponse> {
	return executeTool("get_id_coins", params) as Promise<GetCoinDetailsResponse>;
}
