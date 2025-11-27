import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetUserAllComplexProtocolListInputSchema = z.object({
	id: z.string().describe("User wallet address"),
	chain_ids: z
		.string()
		.optional()
		.describe(
			"Optional comma-separated chain IDs to limit the result (e.g., 'eth,bsc')",
		),
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
	id: z.string(),
	chain: z.string(),
	name: z.string(),
	logo_url: z.string(),
	site_url: z.string(),
	has_supported_portfolio: z.boolean(),
	portfolio_item_list: z.array(PortfolioItemSchema),
});

export const GetUserAllComplexProtocolListResponseSchema = z
	.array(UserProtocolPositionSchema)
	.describe("Protocol positions across all requested chains");

export type GetUserAllComplexProtocolListInput = z.infer<
	typeof GetUserAllComplexProtocolListInputSchema
>;
export type GetUserAllComplexProtocolListResponse = z.infer<
	typeof GetUserAllComplexProtocolListResponseSchema
>;

/**
 * Get a specific wallet's DeFi positions (lending, borrowing, staking, LP) across all chains.
 *
 * Returns wallet-specific protocol positions across all supported chains. This is for analyzing a specific user's complete DeFi portfolio. For protocol-level TVL rankings or yield data (not user-specific), use DefiLlama getProtocols or getLatestPoolData.
 *
 * @param input.id - User's wallet address (e.g., '0x...')
 * @param input.chain_ids - Optional comma-separated chain IDs to filter (e.g., 'eth,bsc')
 *
 * @returns Array of user's protocol positions across chains with supplied/borrowed/reward tokens
 *
 * @example
 * ```typescript
 * const positions = await getUserAllComplexProtocolList({
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   chain_ids: 'eth,arb'
 * });
 * // Returns all Aave, Compound, Uniswap positions for this wallet
 * ```
 */
export async function getUserAllComplexProtocolList(
	input: GetUserAllComplexProtocolListInput,
): Promise<GetUserAllComplexProtocolListResponse> {
	return executeServiceMethod(
		"user",
		"getUserAllComplexProtocolList",
		input,
	) as Promise<GetUserAllComplexProtocolListResponse>;
}
