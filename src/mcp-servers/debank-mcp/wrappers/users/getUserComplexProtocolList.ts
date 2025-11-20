/**
 * Get user's protocol positions on a chain
 */

import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetUserComplexProtocolListInputSchema = z.object({
	id: z.string().describe("User wallet address"),
	chain_id: z.string().describe("Chain ID (e.g., 'eth', 'bsc', 'matic')"),
});

const PositionTokenSchema = z
	.object({
		id: z.string(),
		chain: z.string(),
		name: z.string(),
		symbol: z.string(),
		amount: z.number(),
		price: z.number(),
	})
	.loose();

const PortfolioStatsSchema = z.object({
	asset_usd_value: z.number(),
	debt_usd_value: z.number(),
	net_usd_value: z.number(),
});

const PortfolioDetailSchema = z.object({
	supply_token_list: z.array(PositionTokenSchema).optional(),
	borrow_token_list: z.array(PositionTokenSchema).optional(),
	reward_token_list: z.array(PositionTokenSchema).optional(),
});

const PortfolioPoolSchema = z.object({
	id: z.string(),
	chain: z.string(),
	project_id: z.string(),
	adapter_id: z.string(),
	controller: z.string(),
	index: z.string().nullable(),
	time_at: z.number().nullable(),
});

const PortfolioItemSchema = z.object({
	stats: PortfolioStatsSchema,
	name: z.string(),
	detail_types: z.array(z.string()),
	detail: PortfolioDetailSchema,
	pool: PortfolioPoolSchema,
});

const UserProtocolPositionSchema = z.object({
	id: z.string().describe("Protocol identifier"),
	chain: z.string().describe("Operating chain"),
	name: z.string().describe("Protocol name"),
	logo_url: z.string().describe("Protocol logo URL"),
	site_url: z.string().describe("Official site URL"),
	has_supported_portfolio: z
		.boolean()
		.describe("Whether detailed portfolio data is supported"),
	portfolio_item_list: z.array(PortfolioItemSchema),
});

export const GetUserComplexProtocolListResponseSchema = z
	.array(UserProtocolPositionSchema)
	.describe("Protocol positions on the requested chain");

export type GetUserComplexProtocolListInput = z.infer<
	typeof GetUserComplexProtocolListInputSchema
>;
export type GetUserComplexProtocolListResponse = z.infer<
	typeof GetUserComplexProtocolListResponseSchema
>;

/**
 * Get a specific wallet's DeFi positions (lending, borrowing, staking, LP) across protocols on a chain.
 *
 * Returns wallet-specific protocol positions: supplied assets, borrowed debt, rewards, and net values.
 * This is for analyzing a specific user's DeFi positions. For protocol-level TVL rankings or yield data
 * (not user-specific), use DefiLlama getProtocols or getLatestPoolData.
 *
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic', 'arb')
 * @param input.id - User's wallet address (e.g., '0x...')
 *
 * @returns Array of user's protocol positions with supplied/borrowed/reward tokens and USD values
 *
 * @example
 * ```typescript
 * const positions = await getUserComplexProtocolList({
 *   chain_id: 'eth',
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
 * });
 * // Returns: [{ name: 'Aave', stats: { asset_usd_value, debt_usd_value }, ... }]
 * ```
 */
export async function getUserComplexProtocolList(
	input: GetUserComplexProtocolListInput,
): Promise<GetUserComplexProtocolListResponse> {
	return executeServiceMethod(
		"user",
		"getUserComplexProtocolList",
		input,
	) as Promise<GetUserComplexProtocolListResponse>;
}
