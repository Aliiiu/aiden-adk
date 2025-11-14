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
 * Retrieve detailed information about a specific liquidity pool
 *
 * @param input.id - Pool ID (typically a contract address)
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 *
 * @returns Pool details including protocol, TVL, user count
 *
 * @example
 * ```typescript
 * const pool = await getPoolInformation({
 *   id: '0x00000000219ab540356cbb839cbe05303d7705fa',
 *   chain_id: 'eth'
 * });
 * console.log(pool);
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
