/**
 * Get top holders of a protocol
 */

import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetTopHoldersOfProtocolInputSchema = z.object({
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
});

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
 * Retrieve a list of top holders within a specified DeFi protocol
 *
 * @param input.id - Protocol ID (e.g., 'uniswap', 'aave')
 * @param input.start - Optional pagination offset (default: 0, max: 1000)
 * @param input.limit - Optional max number of holders (default and max: 100)
 *
 * @returns Array of top holders with their balances
 *
 * @example
 * ```typescript
 * const holders = await getTopHoldersOfProtocol({ id: 'uniswap', limit: 50 });
 * console.log(holders);
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
