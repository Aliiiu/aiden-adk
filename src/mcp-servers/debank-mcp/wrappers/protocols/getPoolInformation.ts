/**
 * Get detailed information about a liquidity pool
 */

import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetPoolInformationInputSchema = z
	.object({
		id: z.string().describe("Pool identifier/contract address"),
		chain_id: z.string().describe("Chain ID (e.g., 'eth', 'bsc', 'matic')"),
	})
	.strict();

const PoolInformationSchema = z
	.object({
		id: z.string().describe("Pool identifier"),
		chain: z.string().describe("Chain ID"),
		protocol_id: z.string().describe("Owning protocol identifier"),
		contract_id: z
			.array(z.string())
			.describe("Contract addresses used by the pool"),
		name: z.string().describe("Pool display name"),
		usd_value: z.number().describe("Total USD value locked"),
		user_count: z.number().describe("Total number of users"),
		valuable_user_count: z
			.number()
			.describe("Number of valuable users interacting with the pool"),
	})
	.loose();

export const GetPoolInformationResponseSchema = PoolInformationSchema;

export type GetPoolInformationInput = z.infer<
	typeof GetPoolInformationInputSchema
>;
export type GetPoolInformationResponse = z.infer<
	typeof GetPoolInformationResponseSchema
>;

/**
 * Get detailed information about a specific liquidity pool by contract address.
 *
 * Returns pool metadata, TVL, and user count. This is for looking up a specific pool's details.
 * For finding pools by token or DEX, use CoinGecko getSearchOnchainPools.
 * For yield farming pools with APY, use DefiLlama getLatestPoolData.
 * For user-specific LP positions, use getUserComplexProtocolList.
 *
 * @param input.id - Pool contract address
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic', 'arb')
 *
 * @returns Pool details: name, protocol, TVL (USD value), user count, contract addresses
 *
 * @example
 * ```typescript
 * const pool = await getPoolInformation({
 *   id: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640', // USDC-WETH pool
 *   chain_id: 'eth'
 * });
 * console.log(pool.usd_value); // Pool TVL
 * ```
 */
export async function getPoolInformation(
	input: GetPoolInformationInput,
): Promise<GetPoolInformationResponse> {
	return executeServiceMethod(
		"protocol",
		"getPoolInformation",
		input,
	) as Promise<GetPoolInformationResponse>;
}
