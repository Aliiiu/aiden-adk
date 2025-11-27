import z from "zod";
import { getChainsDescription } from "../enums/chains.js";
import { callEtherscanApi } from "../shared.js";

export const GetTransactionsInputSchema = z
	.object({
		address: z
			.string()
			.optional()
			.describe(
				"The string representing the address you want to retrieve transactions from",
			),
		chainid: z
			.string()
			.optional()
			.default("1")
			.describe(
				`The chain ID to query. Available chains: ${getChainsDescription()}`,
			),
		action: z
			.enum([
				"txlist",
				"txlistinternal",
				"tokentx",
				"tokennfttx",
				"token1155tx",
				"txsBeaconWithdrawal",
			])
			.optional()
			.default("txlist")
			.describe(
				"'txlist' for normal transactions, 'txlistinternal' for internal transactions, 'tokentx' for ERC20 transfers, 'tokennfttx' for ERC721 (NFT) transfers, 'token1155tx' for ERC1155 transfers, 'txsBeaconWithdrawal' for beacon chain withdrawals",
			),
		txhash: z
			.string()
			.regex(
				/^0x[a-fA-F0-9]{64}$/,
				"txhash must be a 66-character 0x-prefixed hash",
			)
			.optional()
			.describe(
				"The string representing the transaction hash to check for internal transactions",
			),
		startblock: z
			.number()
			.int()
			.optional()
			.describe("The integer block number to start searching for transactions"),
		endblock: z
			.number()
			.int()
			.optional()
			.describe("The integer block number to stop searching for transactions"),
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
			.max(10000)
			.optional()
			.describe("Number of results per page (max 10000)"),
		sort: z
			.enum(["asc", "desc"])
			.optional()
			.default("asc")
			.describe("Sort order: 'asc' or 'desc'"),
		contractaddress: z
			.string()
			.optional()
			.describe("Token contract address for filtering token transfers"),
	})
	.refine(
		(data) => data.address || data.txhash || (data.startblock && data.endblock),
		{
			message:
				"One of address, txhash, or block range (startblock and endblock) must be provided",
		},
	);

export type GetTransactionsInput = z.infer<typeof GetTransactionsInputSchema>;

const NormalTransactionSchema = z.object({
	blockNumber: z.string(),
	timeStamp: z.string(),
	hash: z.string(),
	nonce: z.string(),
	blockHash: z.string(),
	transactionIndex: z.string(),
	from: z.string(),
	to: z.string(),
	value: z.string(),
	gas: z.string(),
	gasPrice: z.string(),
	isError: z.string(),
	txreceipt_status: z.string(),
	input: z.string(),
	contractAddress: z.string(),
	cumulativeGasUsed: z.string(),
	gasUsed: z.string(),
	confirmations: z.string(),
	methodId: z.string().optional(),
	functionName: z.string().optional(),
});

const InternalTransactionSchema = z.object({
	blockNumber: z.string(),
	timeStamp: z.string(),
	hash: z.string(),
	from: z.string(),
	to: z.string(),
	value: z.string(),
	contractAddress: z.string(),
	input: z.string(),
	type: z.string(),
	gas: z.string(),
	gasUsed: z.string(),
	traceId: z.string(),
	isError: z.string(),
	errCode: z.string(),
});

const ERC20TransferSchema = z.object({
	blockNumber: z.string(),
	timeStamp: z.string(),
	hash: z.string(),
	nonce: z.string(),
	blockHash: z.string(),
	from: z.string(),
	contractAddress: z.string(),
	to: z.string(),
	value: z.string(),
	tokenName: z.string(),
	tokenSymbol: z.string(),
	tokenDecimal: z.string(),
	transactionIndex: z.string(),
	gas: z.string(),
	gasPrice: z.string(),
	gasUsed: z.string(),
	cumulativeGasUsed: z.string(),
	input: z.string(),
	confirmations: z.string(),
});

const ERC721TransferSchema = z.object({
	blockNumber: z.string(),
	timeStamp: z.string(),
	hash: z.string(),
	nonce: z.string(),
	blockHash: z.string(),
	from: z.string(),
	contractAddress: z.string(),
	to: z.string(),
	tokenID: z.string(),
	tokenName: z.string(),
	tokenSymbol: z.string(),
	tokenDecimal: z.string(),
	transactionIndex: z.string(),
	gas: z.string(),
	gasPrice: z.string(),
	gasUsed: z.string(),
	cumulativeGasUsed: z.string(),
	input: z.string(),
	confirmations: z.string(),
});

const ERC1155TransferSchema = z.object({
	blockNumber: z.string(),
	timeStamp: z.string(),
	hash: z.string(),
	nonce: z.string(),
	blockHash: z.string(),
	from: z.string(),
	contractAddress: z.string(),
	to: z.string(),
	tokenID: z.string(),
	tokenValue: z.string(),
	tokenName: z.string(),
	tokenSymbol: z.string(),
	transactionIndex: z.string(),
	gas: z.string(),
	gasPrice: z.string(),
	gasUsed: z.string(),
	cumulativeGasUsed: z.string(),
	input: z.string(),
	confirmations: z.string(),
});

const BeaconWithdrawalSchema = z.object({
	withdrawalIndex: z.string(),
	validatorIndex: z.string(),
	address: z.string(),
	amount: z.string(),
	blockNumber: z.string(),
	timestamp: z.string(),
});

const TransactionsResponseSchema = z.array(
	z.union([
		NormalTransactionSchema,
		InternalTransactionSchema,
		ERC20TransferSchema,
		ERC721TransferSchema,
		ERC1155TransferSchema,
		BeaconWithdrawalSchema,
	]),
);

export type GetTransactionsResponse = z.infer<
	typeof TransactionsResponseSchema
>;

/**
 * Get a list of transactions via the Etherscan Ethereum blockchain explorer.
 *
 * Retrieves various types of transactions:
 * - Normal transactions by address
 * - Internal transactions by address, transaction hash, or block range
 * - ERC20 token transfers by address
 * - ERC721 NFT transfers by address
 * - ERC1155 multi-token transfers by address
 * - Beacon chain withdrawals by address and block range
 *
 * Note: Transaction hashes are 66 characters long, wallet addresses are 42 characters.
 *
 * @param params.address - Address to retrieve transactions from (optional if txhash or block range provided)
 * @param params.action - Transaction type: 'txlist' (default), 'txlistinternal', 'tokentx', 'tokennfttx', 'token1155tx', 'txsBeaconWithdrawal'
 * @param params.txhash - Transaction hash to check for internal transactions (66 chars)
 * @param params.startblock - Starting block number for search range
 * @param params.endblock - Ending block number for search range
 * @param params.page - Page number for pagination
 * @param params.offset - Results per page (max 10000)
 * @param params.sort - Sort order: 'asc' (default) or 'desc'
 * @param params.contractaddress - Token contract address for filtering token transfers
 *
 * @returns Array of transactions (type depends on action parameter)
 *
 * @example
 * ```typescript
 * // Get normal transactions for an address
 * const txs = await getTransactions({
 *   address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   action: 'txlist',
 *   startblock: 0,
 *   endblock: 99999999,
 *   page: 1,
 *   offset: 10,
 *   sort: 'asc'
 * });
 *
 * // Get internal transactions by tx hash
 * const internalTxs = await getTransactions({
 *   txhash: '0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170',
 *   action: 'txlistinternal'
 * });
 *
 * // Get ERC20 token transfers
 * const tokenTxs = await getTransactions({
 *   address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   action: 'tokentx',
 *   contractaddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'
 * });
 * ```
 */
export async function getTransactions(
	params: GetTransactionsInput,
): Promise<GetTransactionsResponse> {
	const validated = GetTransactionsInputSchema.parse(params);
	const { action, ...rest } = validated;

	return callEtherscanApi(
		{
			module: "account",
			action,
			...rest,
		},
		TransactionsResponseSchema,
	);
}
