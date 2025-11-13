/**
 * Get recent trades for an onchain pool
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetPoolsNetworksOnchainTradesInputSchema = z.object({
	network: z.string().describe("Network identifier"),
	pool_address: z.string().describe("Pool contract address"),
	trade_volume_in_usd_greater_than: z
		.number()
		.optional()
		.describe("Filter trades above this USD volume"),
});

const TradeAttributesSchema = z.object({
	block_number: z.number().nullable().optional(),
	block_timestamp: z.string(),
	kind: z.string(),
	tx_hash: z.string(),
	tx_from_address: z.string().nullable().optional(),
	from_token_address: z.string().nullable().optional(),
	to_token_address: z.string().nullable().optional(),
	from_token_amount: z.string().nullable().optional(),
	to_token_amount: z.string().nullable().optional(),
	price_from_in_currency_token: z.string().nullable().optional(),
	price_from_in_usd: z.string().nullable().optional(),
	price_to_in_currency_token: z.string().nullable().optional(),
	price_to_in_usd: z.string().nullable().optional(),
	volume_in_usd: z.string().nullable().optional(),
});

const TradeResourceSchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: TradeAttributesSchema,
});

export const GetPoolsNetworksOnchainTradesResponseSchema = z.object({
	data: z.array(TradeResourceSchema),
});

export type GetPoolsNetworksOnchainTradesInput = z.infer<
	typeof GetPoolsNetworksOnchainTradesInputSchema
>;
export type GetPoolsNetworksOnchainTradesResponse = z.infer<
	typeof GetPoolsNetworksOnchainTradesResponseSchema
>;

/**
 * Get recent trades for a specific pool
 *
 * @param params.network - Network ID
 * @param params.pool_address - Pool contract address
 * @param params.trade_volume_in_usd_greater_than - Minimum trade volume in USD
 *
 * @returns Recent trades with timestamps, amounts, prices
 *
 * @example
 * ```typescript
 * const trades = await getPoolsNetworksOnchainTrades({
 *   network: 'eth',
 *   pool_address: '0x...',
 *   trade_volume_in_usd_greater_than: 10000
 * });
 * ```
 */
export async function getPoolsNetworksOnchainTrades(
	params: GetPoolsNetworksOnchainTradesInput,
): Promise<GetPoolsNetworksOnchainTradesResponse> {
	return executeTool(
		"get_pools_networks_onchain_trades",
		params,
	) as Promise<GetPoolsNetworksOnchainTradesResponse>;
}
