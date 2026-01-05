import z from "zod";
import { callEtherscanApi } from "../shared";

export const GetAddressLogsInputSchema = z.object({
	address: z
		.string()
		.describe(
			"The string representing the address whose event logs you want to retrieve",
		),
	chainid: z.string().optional().default("1").describe("The chain ID to query"),
	fromBlock: z
		.number()
		.int()
		.optional()
		.describe("The integer block number to start searching for logs"),
	toBlock: z
		.number()
		.int()
		.optional()
		.describe("The integer block number to stop searching for logs"),
	page: z
		.number()
		.int()
		.positive()
		.optional()
		.describe("Page number for pagination"),
	offset: z
		.number()
		.int()
		.positive()
		.max(1000)
		.optional()
		.describe(
			"Number of logs per page (max 1000), use page parameter for subsequent records",
		),
	topic0: z.string().optional().describe("Topic 0 filter (event signature)"),
	topic1: z.string().optional().describe("Topic 1 filter"),
	topic2: z.string().optional().describe("Topic 2 filter"),
	topic3: z.string().optional().describe("Topic 3 filter"),
	topic0_1_opr: z
		.enum(["and", "or"])
		.optional()
		.describe("Operator between topic0 and topic1"),
	topic1_2_opr: z
		.enum(["and", "or"])
		.optional()
		.describe("Operator between topic1 and topic2"),
	topic2_3_opr: z
		.enum(["and", "or"])
		.optional()
		.describe("Operator between topic2 and topic3"),
});

export type GetAddressLogsInput = z.infer<typeof GetAddressLogsInputSchema>;

const EventLogSchema = z.object({
	address: z.string(),
	topics: z.array(z.string()),
	data: z.string(),
	blockNumber: z.string(),
	timeStamp: z.string(),
	gasPrice: z.string(),
	gasUsed: z.string(),
	logIndex: z.string(),
	transactionHash: z.string(),
	transactionIndex: z.string(),
});

const AddressLogsResponseSchema = z.array(EventLogSchema);

export type GetAddressLogsResponse = z.infer<typeof AddressLogsResponseSchema>;

/**
 * Get event logs on the blockchain output as JSON.
 *
 * Retrieves event logs from an address with optional filtering by block range and topics.
 * Event logs are emitted by smart contracts and contain important state change information.
 *
 * @param params.address - Address whose event logs you want to retrieve
 * @param params.fromBlock - Starting block number for log search (optional)
 * @param params.toBlock - Ending block number for log search (optional)
 * @param params.page - Page number for pagination (optional)
 * @param params.offset - Logs per page (max 1000, optional)
 * @param params.topic0 - Topic 0 filter (event signature hash, optional)
 * @param params.topic1 - Topic 1 filter (optional)
 * @param params.topic2 - Topic 2 filter (optional)
 * @param params.topic3 - Topic 3 filter (optional)
 * @param params.topic0_1_opr - Operator between topic0 and topic1: 'and' or 'or' (optional)
 * @param params.topic1_2_opr - Operator between topic1 and topic2: 'and' or 'or' (optional)
 * @param params.topic2_3_opr - Operator between topic2 and topic3: 'and' or 'or' (optional)
 *
 * @returns Array of event logs with topics, data, block number, timestamp, and transaction info
 *
 * @example
 * ```typescript
 * // Get all logs for an address
 * const logs = await getAddressLogs({
 *   address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   fromBlock: 12878196,
 *   toBlock: 12878285,
 *   page: 1,
 *   offset: 100
 * });
 *
 * // Get logs filtered by event signature
 * const transferLogs = await getAddressLogs({
 *   address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 *   fromBlock: 12878196,
 *   toBlock: 12878285
 * });
 * // Returns: [{ address: '0x...', topics: ['0x...'], data: '0x...', ... }]
 * ```
 */
export async function getAddressLogs(
	params: GetAddressLogsInput,
): Promise<GetAddressLogsResponse> {
	const validated = GetAddressLogsInputSchema.parse(params);

	return callEtherscanApi(
		{
			module: "logs",
			action: "getLogs",
			...validated,
		},
		AddressLogsResponseSchema,
	);
}
