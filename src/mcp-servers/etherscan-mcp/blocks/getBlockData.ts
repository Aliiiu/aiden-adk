import z from "zod";
import { getChainsDescription } from "../enums/chains.js";
import { callEtherscanApi } from "../shared.js";

export const GetBlockDataInputSchema = z
	.object({
		blockno: z
			.number()
			.int()
			.optional()
			.describe("The integer block number, e.g., 12697906"),
		action: z
			.enum([
				"getblockreward",
				"getblockcountdown",
				"getblocknobytime",
				"eth_blockNumber",
				"eth_getBlockByNumber",
			])
			.describe(
				"'getblockreward' for block reward, 'getblockcountdown' for countdown, 'getblocknobytime' for block by timestamp, 'eth_blockNumber' for latest block, 'eth_getBlockByNumber' for block info",
			),
		chainid: z
			.string()
			.optional()
			.default("1")
			.describe(
				`The chain ID to query. Available chains: ${getChainsDescription()}`,
			),
		closest: z
			.enum(["before", "after"])
			.optional()
			.default("before")
			.describe(
				"For 'getblocknobytime': 'before' for closest block before timestamp, 'after' for closest block after timestamp",
			),
		timestamp: z
			.number()
			.int()
			.optional()
			.describe(
				"Unix timestamp for 'getblocknobytime' action (must be provided for this action)",
			),
		boolean: z
			.boolean()
			.optional()
			.default(true)
			.describe(
				"For 'eth_getBlockByNumber': true to return full transaction objects, false for transaction hashes only",
			),
	})
	.refine(
		(data) => {
			// eth_blockNumber doesn't need blockno
			if (data.action === "eth_blockNumber") return true;
			// getblocknobytime needs timestamp
			if (data.action === "getblocknobytime")
				return data.timestamp !== undefined;
			// All others need blockno
			return data.blockno !== undefined;
		},
		{
			message:
				"blockno required for most actions, timestamp required for getblocknobytime",
		},
	);

export type GetBlockDataInput = z.infer<typeof GetBlockDataInputSchema>;

const BlockRewardSchema = z.object({
	blockNumber: z.string(),
	timeStamp: z.string(),
	blockMiner: z.string(),
	blockReward: z.string(),
	uncles: z
		.array(
			z.object({
				miner: z.string(),
				unclePosition: z.string(),
				blockreward: z.string(),
			}),
		)
		.optional(),
	uncleInclusionReward: z.string().optional(),
});

const BlockCountdownSchema = z.object({
	CurrentBlock: z.string(),
	CountdownBlock: z.string(),
	RemainingBlock: z.string(),
	EstimateTimeInSec: z.string(),
});

const BlockNumberSchema = z.string();

const BlockInfoSchema = z.object({
	baseFeePerGas: z.string().optional(),
	difficulty: z.string(),
	extraData: z.string(),
	gasLimit: z.string(),
	gasUsed: z.string(),
	hash: z.string(),
	logsBloom: z.string(),
	miner: z.string(),
	mixHash: z.string(),
	nonce: z.string(),
	number: z.string(),
	parentHash: z.string(),
	receiptsRoot: z.string(),
	sha3Uncles: z.string(),
	size: z.string(),
	stateRoot: z.string(),
	timestamp: z.string(),
	totalDifficulty: z.string().optional(),
	transactions: z.array(z.union([z.string(), z.any()])),
	transactionsRoot: z.string(),
	uncles: z.array(z.string()),
	withdrawals: z
		.array(
			z.object({
				index: z.string(),
				validatorIndex: z.string(),
				address: z.string(),
				amount: z.string(),
			}),
		)
		.optional(),
	withdrawalsRoot: z.string().optional(),
});

const BlockDataResponseSchema = z.union([
	BlockRewardSchema,
	BlockCountdownSchema,
	BlockNumberSchema,
	BlockInfoSchema,
]);

export type GetBlockDataResponse = z.infer<typeof BlockDataResponseSchema>;

/**
 * Get data about a block on the Ethereum blockchain.
 *
 * Supports multiple operations:
 * - Block reward and uncle block rewards by block number
 * - Estimated time until a block is mined
 * - Block number mined at a specific timestamp
 * - Latest block number on the blockchain
 * - General block information by block number
 *
 * @param params.blockno - Block number (required for most actions except eth_blockNumber)
 * @param params.action - Operation type:
 *   - 'getblockreward': Get block reward and uncle rewards
 *   - 'getblockcountdown': Get estimated time until block is mined
 *   - 'getblocknobytime': Get block number by timestamp
 *   - 'eth_blockNumber': Get latest block number
 *   - 'eth_getBlockByNumber': Get detailed block information
 * @param params.closest - For 'getblocknobytime': 'before' (default) or 'after'
 * @param params.timestamp - Unix timestamp (required for 'getblocknobytime')
 * @param params.boolean - For 'eth_getBlockByNumber': true for full tx objects, false for hashes
 *
 * @returns Response varies by action type
 *
 * @example
 * ```typescript
 * // Get block reward
 * const reward = await getBlockData({
 *   blockno: 2165403,
 *   action: 'getblockreward'
 * });
 * // Returns: { blockNumber: '2165403', blockReward: '...', uncles: [...], ... }
 *
 * // Get latest block number
 * const latest = await getBlockData({
 *   action: 'eth_blockNumber'
 * });
 * // Returns: "12345678"
 *
 * // Get block by timestamp
 * const blockNo = await getBlockData({
 *   action: 'getblocknobytime',
 *   timestamp: 1578638524,
 *   closest: 'before'
 * });
 * // Returns: "9251482"
 *
 * // Get block info
 * const blockInfo = await getBlockData({
 *   blockno: 12345678,
 *   action: 'eth_getBlockByNumber',
 *   boolean: true
 * });
 * // Returns: { hash: '0x...', transactions: [...], ... }
 * ```
 */
export async function getBlockData(
	params: GetBlockDataInput,
): Promise<GetBlockDataResponse> {
	const validated = GetBlockDataInputSchema.parse(params);
	const { action, blockno, closest, timestamp, boolean, chainid } = validated;

	const apiParams: Record<string, any> = {
		module: action.startsWith("eth_") ? "proxy" : "block",
		action,
		chainid,
	};

	if (blockno !== undefined) {
		if (action === "eth_getBlockByNumber") {
			apiParams.tag = `0x${blockno.toString(16)}`;
			apiParams.boolean = boolean;
		} else {
			apiParams.blockno = blockno;
		}
	}

	if (action === "getblocknobytime") {
		apiParams.timestamp = timestamp;
		apiParams.closest = closest;
	}

	return callEtherscanApi(apiParams, BlockDataResponseSchema);
}
