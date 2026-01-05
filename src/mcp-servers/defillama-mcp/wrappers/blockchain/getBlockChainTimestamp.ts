import { z } from "zod";
import { executeServiceMethod } from "../../shared";

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
 * Get blockchain block height (number) for a specific timestamp on a chain.
 *
 * Returns block metadata at a timestamp. This is for finding block numbers at specific times for on-chain queries.
 * For general chain data, use getChains.
 * For historical TVL at specific times, use getHistoricalChainTvl.
 *
 * @param input.chain - Chain identifier (e.g., 'ethereum', 'polygon', 'bsc')
 * @param input.timestamp - Target timestamp (Unix seconds, milliseconds, or ISO string)
 *
 * @returns Block data: { height: block_number, timestamp: unix_seconds }
 *
 * @example
 * ```typescript
 * const block = await getBlockChainTimestamp({
 *   chain: 'ethereum',
 *   timestamp: 1640995200
 * });
 * // Returns: { height: 13916166, timestamp: 1640995200 }
 * ```
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
