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

import type { GetAddressBalanceInput } from "./accounts/getAddressBalance.js";
import type { GetMinedBlocksInput } from "./accounts/getMinedBlocks.js";
import type { GetBlockDataInput } from "./blocks/getBlockData.js";
import type { GetContractInput } from "./contracts/getContract.js";
import type { GetAddressLogsInput } from "./etherscan-logs/getAddressLogs.js";
import type { GetGasDataInput } from "./gas/getGasData.js";
import type { GetEtherDataInput } from "./stats/getEtherData.js";
import type { GetTokenDataInput } from "./tokens/getTokenData.js";
import type { GetTransactionStatusInput } from "./transactions/getTransactionStatus.js";
import type { GetTransactionsInput } from "./transactions/getTransactions.js";

// Accounts
export { getAddressBalance } from "./accounts/getAddressBalance.js";
export { getMinedBlocks } from "./accounts/getMinedBlocks.js";

// Blocks
export { getBlockData } from "./blocks/getBlockData.js";

// Contracts
export { getContract } from "./contracts/getContract.js";
// Logs
export { getAddressLogs } from "./etherscan-logs/getAddressLogs.js";
// Gas
export { getGasData } from "./gas/getGasData.js";
// Re-export shared utility for advanced usage
export { callEtherscanApi } from "./shared.js";
// Stats
export { getEtherData } from "./stats/getEtherData.js";
// Tokens
export { getTokenData } from "./tokens/getTokenData.js";
export { getTransactionStatus } from "./transactions/getTransactionStatus.js";
// Transactions
export { getTransactions } from "./transactions/getTransactions.js";

// Default export with all functions grouped
export default {
	// Accounts
	getAddressBalance: async (params: GetAddressBalanceInput) =>
		(await import("./accounts/getAddressBalance.js")).getAddressBalance(params),
	getMinedBlocks: async (params: GetMinedBlocksInput) =>
		(await import("./accounts/getMinedBlocks.js")).getMinedBlocks(params),

	// Transactions
	getTransactions: async (params: GetTransactionsInput) =>
		(await import("./transactions/getTransactions.js")).getTransactions(params),
	getTransactionStatus: async (params: GetTransactionStatusInput) =>
		(
			await import("./transactions/getTransactionStatus.js")
		).getTransactionStatus(params),

	// Blocks
	getBlockData: async (params: GetBlockDataInput) =>
		(await import("./blocks/getBlockData.js")).getBlockData(params),

	// Contracts
	getContract: async (params: GetContractInput) =>
		(await import("./contracts/getContract.js")).getContract(params),

	// Logs
	getAddressLogs: async (params: GetAddressLogsInput) =>
		(await import("./etherscan-logs/getAddressLogs.js")).getAddressLogs(params),

	// Gas
	getGasData: async (params: GetGasDataInput) =>
		(await import("./gas/getGasData.js")).getGasData(params),

	// Tokens
	getTokenData: async (params: GetTokenDataInput) =>
		(await import("./tokens/getTokenData.js")).getTokenData(params),

	// Stats/Ether
	getEtherData: async (params: GetEtherDataInput) =>
		(await import("./stats/getEtherData.js")).getEtherData(params),
};
