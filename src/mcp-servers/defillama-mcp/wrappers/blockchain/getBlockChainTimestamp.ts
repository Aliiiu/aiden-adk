import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetBlockChainTimestampInputSchema = z
	.object({
		chain: z
			.string()
			.describe("Chain identifier (e.g., 'ethereum', 'polygon')"),
		timestamp: z
			.union([z.string(), z.number()])
			.describe("Timestamp in seconds, milliseconds, or ISO format"),
	})
	.strict();

const BlockDataSchema = z
	.object({
		height: z.number().describe("Block height at the given timestamp"),
		timestamp: z
			.number()
			.describe("Unix timestamp (seconds) for the returned block"),
	})
	.loose();

export const GetBlockChainTimestampResponseSchema = BlockDataSchema;

export type GetBlockChainTimestampInput = z.infer<
	typeof GetBlockChainTimestampInputSchema
>;
export type GetBlockChainTimestampResponse = z.infer<
	typeof GetBlockChainTimestampResponseSchema
>;

/**
 * Get block data for a specific chain and timestamp
 */
export async function getBlockChainTimestamp(
	input: GetBlockChainTimestampInput,
): Promise<GetBlockChainTimestampResponse> {
	return executeServiceMethod(
		"blockchain",
		"getBlockChainTimestamp",
		input,
	) as Promise<GetBlockChainTimestampResponse>;
}
