/**
 * Get top holders of a protocol
 */

import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetTopHoldersOfProtocolInputSchema = z
	.object({
		id: z.string().describe("Protocol ID (e.g., 'uniswap')"),
		start: z
			.number()
			.int()
			.nonnegative()
			.optional()
			.describe("Pagination offset (default: 0, max: 1000)"),
		limit: z
			.number()
			.int()
			.positive()
			.max(100)
			.optional()
			.describe("Max number of holders to fetch (default/max: 100)"),
	})
	.strict();

const ProtocolHolderSchema = z
	.object({
		address: z.string().describe("Holder wallet address"),
		value: z.number().describe("USD value held in the protocol"),
	})
	.loose();

export const GetTopHoldersOfProtocolResponseSchema = z
	.array(ProtocolHolderSchema)
	.describe("Top holders ordered by USD value");

export type GetTopHoldersOfProtocolInput = z.infer<
	typeof GetTopHoldersOfProtocolInputSchema
>;
export type GetTopHoldersOfProtocolResponse = z.infer<
	typeof GetTopHoldersOfProtocolResponseSchema
>;

/**
 * Get the largest wallet holders (by USD value) within a specific DeFi protocol.
 *
 * Returns top users ranked by total value in a protocol. This is for analyzing protocol user distribution.
 * For a specific user's protocol positions, use getUserComplexProtocolList.
 * For token holder distribution, use getTopHoldersOfToken.
 *
 * @param input.id - Protocol identifier (e.g., 'uniswap', 'aave', 'bsc_pancakeswap')
 * @param input.start - Pagination offset (default: 0, max: 1000)
 * @param input.limit - Number of top holders to return (default and max: 100)
 *
 * @returns Array of top holders: wallet address and USD value held in the protocol
 *
 * @example
 * ```typescript
 * const holders = await getTopHoldersOfProtocol({ id: 'aave', limit: 50 });
 * // Returns: [{ address: '0x...', value: 5000000 }, ...]
 * ```
 */
export async function getTopHoldersOfProtocol(
	input: GetTopHoldersOfProtocolInput,
): Promise<GetTopHoldersOfProtocolResponse> {
	return executeServiceMethod(
		"protocol",
		"getTopHoldersOfProtocol",
		input,
	) as Promise<GetTopHoldersOfProtocolResponse>;
}
