/**
 * Get user's transaction history on a chain
 */

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
 * Fetch a user's transaction history on a specified chain
 *
 * @param input.id - User's wallet address
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic')
 * @param input.token_id - Optional token filter
 * @param input.start_time - Optional timestamp filter
 * @param input.end_time - Optional end timestamp filter
 * @param input.page_count - Optional max entries (max: 20)
 *
 * @returns Array of transaction history
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
