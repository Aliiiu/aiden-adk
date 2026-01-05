/**
 * Etherscan MCP Server TypeScript Wrappers
 *
 * This module provides TypeScript wrappers for Etherscan API
 * organized by category for filesystem-based discovery.
 *
 * Directory structure:
 * - accounts/      - Address balances and mined blocks
 * - transactions/  - Normal, internal, token transfers, and transaction status
 * - blocks/        - Block data, rewards, and countdown
 * - contracts/     - Contract ABI, source code, and creation info
 * - logs/          - Event logs
 * - gas/           - Gas prices and estimates
 * - tokens/        - ERC-20 token supply and balances
 * - stats/         - Ether supply, price, and node statistics
 */

import type { GetAddressBalanceInput } from "./accounts/getAddressBalance";
import type { GetMinedBlocksInput } from "./accounts/getMinedBlocks";
import type { GetBlockDataInput } from "./blocks/getBlockData";
import type { GetContractInput } from "./contracts/getContract";
import type { GetAddressLogsInput } from "./etherscan-logs/getAddressLogs";
import type { GetGasDataInput } from "./gas/getGasData";
import type { GetEtherDataInput } from "./stats/getEtherData";
import type { GetTokenDataInput } from "./tokens/getTokenData";
import type { GetTransactionStatusInput } from "./transactions/getTransactionStatus";
import type { GetTransactionsInput } from "./transactions/getTransactions";

// Accounts
export { getAddressBalance } from "./accounts/getAddressBalance";
export { getMinedBlocks } from "./accounts/getMinedBlocks";

// Blocks
export { getBlockData } from "./blocks/getBlockData";

// Contracts
export { getContract } from "./contracts/getContract";
// Logs
export { getAddressLogs } from "./etherscan-logs/getAddressLogs";
// Gas
export { getGasData } from "./gas/getGasData";
// Re-export shared utility for advanced usage
export { callEtherscanApi } from "./shared";
// Stats
export { getEtherData } from "./stats/getEtherData";
// Tokens
export { getTokenData } from "./tokens/getTokenData";
export { getTransactionStatus } from "./transactions/getTransactionStatus";
// Transactions
export { getTransactions } from "./transactions/getTransactions";

// Default export with all functions grouped
export default {
	// Accounts
	getAddressBalance: async (params: GetAddressBalanceInput) =>
		(await import("./accounts/getAddressBalance")).getAddressBalance(params),
	getMinedBlocks: async (params: GetMinedBlocksInput) =>
		(await import("./accounts/getMinedBlocks")).getMinedBlocks(params),

	// Transactions
	getTransactions: async (params: GetTransactionsInput) =>
		(await import("./transactions/getTransactions")).getTransactions(params),
	getTransactionStatus: async (params: GetTransactionStatusInput) =>
		(await import("./transactions/getTransactionStatus")).getTransactionStatus(
			params,
		),

	// Blocks
	getBlockData: async (params: GetBlockDataInput) =>
		(await import("./blocks/getBlockData")).getBlockData(params),

	// Contracts
	getContract: async (params: GetContractInput) =>
		(await import("./contracts/getContract")).getContract(params),

	// Logs
	getAddressLogs: async (params: GetAddressLogsInput) =>
		(await import("./etherscan-logs/getAddressLogs")).getAddressLogs(params),

	// Gas
	getGasData: async (params: GetGasDataInput) =>
		(await import("./gas/getGasData")).getGasData(params),

	// Tokens
	getTokenData: async (params: GetTokenDataInput) =>
		(await import("./tokens/getTokenData")).getTokenData(params),

	// Stats/Ether
	getEtherData: async (params: GetEtherDataInput) =>
		(await import("./stats/getEtherData")).getEtherData(params),
};
