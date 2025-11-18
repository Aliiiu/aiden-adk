/**
 * Get coin data by contract address on a specific platform (chain).
 *
 * Use this to resolve token details via contract address. Requires platform `id`
 * (e.g., 'ethereum') and `contract_address`.
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetCoinsContractInputSchema = z.object({
	id: z.string().describe("Asset platform ID (e.g., 'ethereum')"),
	contract_address: z.string().describe("Token contract address"),
	localization: z
		.boolean()
		.optional()
		.describe("Include localized text (default true)"),
	tickers: z
		.boolean()
		.optional()
		.describe("Include exchange tickers (default true)"),
	market_data: z
		.boolean()
		.optional()
		.describe("Include market data (default true)"),
	community_data: z
		.boolean()
		.optional()
		.describe("Include community stats (default true)"),
	developer_data: z
		.boolean()
		.optional()
		.describe("Include developer stats (default true)"),
	sparkline: z
		.boolean()
		.optional()
		.describe("Include sparkline (default false)"),
});

const ContractImageSchema = z
	.object({
		thumb: z.string().optional(),
		small: z.string().optional(),
		large: z.string().optional(),
	})
	.partial();

const ContractMarketDataSchema = z
	.object({
		current_price: z.record(z.string(), z.number()).optional(),
		market_cap: z.record(z.string(), z.number()).optional(),
		total_volume: z.record(z.string(), z.number()).optional(),
	})
	.loose();

export const GetCoinsContractResponseSchema = z
	.object({
		id: z.string(),
		symbol: z.string(),
		name: z.string(),
		asset_platform_id: z.string().nullable().optional(),
		contract_address: z.string().optional(),
		description: z.record(z.string(), z.string()).optional(),
		market_data: ContractMarketDataSchema.optional(),
		image: ContractImageSchema.optional(),
		community_data: z.record(z.string(), z.unknown()).optional(),
		developer_data: z.record(z.string(), z.unknown()).optional(),
		localization: z.record(z.string(), z.string()).optional(),
	})
	.loose();

export type GetCoinsContractInput = z.infer<typeof GetCoinsContractInputSchema>;
export type GetCoinsContractResponse = z.infer<
	typeof GetCoinsContractResponseSchema
>;

/**
 * Get coin data by contract address
 *
 * @param params.id - Asset platform ID (e.g., 'ethereum', 'binance-smart-chain')
 * @param params.contract_address - Token contract address
 * @param params.localization - Include all localized languages in response (default: true)
 * @param params.tickers - Include tickers data (default: true)
 * @param params.market_data - Include market data (default: true)
 * @param params.community_data - Include community data (default: true)
 * @param params.developer_data - Include developer data (default: true)
 * @param params.sparkline - Include sparkline 7 days data (default: false)
 *
 * @returns Coin data including market data, community stats, developer stats
 *
 * @example
 * ```typescript
 * const token = await getCoinsContract({
 *   id: 'ethereum',
 *   contract_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
 * });
 * ```
 */
export async function getCoinsContract(
	params: GetCoinsContractInput,
): Promise<GetCoinsContractResponse> {
	return executeTool(
		"get_coins_contract",
		params,
	) as Promise<GetCoinsContractResponse>;
}
