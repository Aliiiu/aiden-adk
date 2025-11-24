import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetUserHistoryListInputSchema = z.object({
	id: z.string().describe("User wallet address"),
	chain_id: z.string().describe("Chain ID (e.g., 'eth', 'bsc', 'matic')"),
	token_id: z.string().optional().describe("Optional token filter"),
	start_time: z
		.number()
		.int()
		.optional()
		.describe("Unix timestamp for the start of the range"),
	end_time: z
		.number()
		.int()
		.optional()
		.describe("Unix timestamp for the end of the range"),
	page_count: z
		.number()
		.int()
		.positive()
		.max(20)
		.optional()
		.describe("Maximum number of entries to fetch (max 20)"),
});

const HistoryTokenSchema = z
	.object({
		id: z.string(),
		chain: z.string(),
		name: z.string(),
		symbol: z.string(),
		amount: z.number(),
		price: z.number(),
	})
	.loose();

const HistoryEntrySchema = z.object({
	id: z.string(),
	chain: z.string(),
	name: z.string(),
	project_id: z.string(),
	time_at: z.number(),
	tx: z.object({
		name: z.string(),
		status: z.number(),
		eth_gas_fee: z.number(),
		usd_gas_fee: z.number(),
		value: z.number(),
		from_addr: z.string(),
		to_addr: z.string(),
	}),
	sends: z.array(HistoryTokenSchema),
	receives: z.array(HistoryTokenSchema),
});

export const GetUserHistoryListResponseSchema = z
	.array(HistoryEntrySchema)
	.describe("Historical transactions on the requested chain");

export type GetUserHistoryListInput = z.infer<
	typeof GetUserHistoryListInputSchema
>;
export type GetUserHistoryListResponse = z.infer<
	typeof GetUserHistoryListResponseSchema
>;

/**
 * Get a specific wallet's transaction history on a chain with sent/received tokens and gas fees.
 *
 * Returns wallet-specific transaction history with send/receive details, gas fees, and timestamps.
 * This is for analyzing a specific user's transaction activity. For general blockchain data or
 * protocol events (not user-specific), use chain explorers or other tools.
 *
 * @param input.id - User's wallet address (e.g., '0x...')
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic', 'arb')
 * @param input.token_id - Optional token filter to show only txs involving this token
 * @param input.start_time - Optional Unix timestamp for start of range
 * @param input.end_time - Optional Unix timestamp for end of range
 * @param input.page_count - Number of transactions to return (max: 20)
 *
 * @returns Array of transactions with sent/received tokens, gas fees, status
 *
 * @example
 * ```typescript
 * const history = await getUserHistoryList({
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   chain_id: 'eth',
 *   page_count: 10
 * });
 * // Returns: [{ tx: {...}, sends: [...], receives: [...], time_at }]
 * ```
 */
export async function getUserHistoryList(
	input: GetUserHistoryListInput,
): Promise<GetUserHistoryListResponse> {
	return executeServiceMethod(
		"user",
		"getUserHistoryList",
		input,
	) as Promise<GetUserHistoryListResponse>;
}
