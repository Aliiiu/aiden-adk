/**
 * DeBank MCP TypeScript Wrappers
 *
 * This module provides TypeScript wrappers for DeBank services
 * organized by category for code execution and direct usage.
 *
 * Directory structure:
 * - chains/       - Chain information and gas prices
 * - protocols/    - Protocol data, TVL, holders, and pools
 * - tokens/       - Token information, prices, and holders
 * - users/        - User balances, positions, NFTs, and history
 * - transactions/ - Transaction simulation and explanation
 */

import jsonata from "jsonata";
import type { GetChainInput } from "./chains/getChain.js";
import type { GetGasPricesInput } from "./chains/getGasPrices.js";
import type { GetAllProtocolsOfSupportedChainsInput } from "./protocols/getAllProtocolsOfSupportedChains.js";
import type { GetPoolInformationInput } from "./protocols/getPoolInformation.js";
import type { GetProtocolInformationInput } from "./protocols/getProtocolInformation.js";
import type { GetTopHoldersOfProtocolInput } from "./protocols/getTopHoldersOfProtocol.js";
import type { GetListTokenInformationInput } from "./tokens/getListTokenInformation.js";
import type { GetTokenHistoryPriceInput } from "./tokens/getTokenHistoryPrice.js";
import type { GetTokenInformationInput } from "./tokens/getTokenInformation.js";
import type { GetTopHoldersOfTokenInput } from "./tokens/getTopHoldersOfToken.js";
import type { ExplainTransactionInput } from "./transactions/explainTransaction.js";
import type { PreExecTransactionInput } from "./transactions/preExecTransaction.js";
import type { GetUserAllComplexProtocolListInput } from "./users/getUserAllComplexProtocolList.js";
import type { GetUserAllTokenListInput } from "./users/getUserAllTokenList.js";
import type { GetUserChainBalanceInput } from "./users/getUserChainBalance.js";
import type { GetUserComplexProtocolListInput } from "./users/getUserComplexProtocolList.js";
import type { GetUserHistoryListInput } from "./users/getUserHistoryList.js";
import type { GetUserNftListInput } from "./users/getUserNftList.js";
import type { GetUserTokenListInput } from "./users/getUserTokenList.js";
import type { GetUserTotalBalanceInput } from "./users/getUserTotalBalance.js";

// Export jsonata for parameter discovery and filtering
export { jsonata };

// Re-export shared utilities for advanced usage
export { executeServiceMethod } from "../shared.js";
// Chains
export { getChain } from "./chains/getChain.js";
export { getGasPrices } from "./chains/getGasPrices.js";
export { getSupportedChainList } from "./chains/getSupportedChainList.js";
// Protocols
export { getAllProtocolsOfSupportedChains } from "./protocols/getAllProtocolsOfSupportedChains.js";
export { getPoolInformation } from "./protocols/getPoolInformation.js";
export { getProtocolInformation } from "./protocols/getProtocolInformation.js";
export { getTopHoldersOfProtocol } from "./protocols/getTopHoldersOfProtocol.js";
// Tokens
export { getListTokenInformation } from "./tokens/getListTokenInformation.js";
export { getTokenHistoryPrice } from "./tokens/getTokenHistoryPrice.js";
export { getTokenInformation } from "./tokens/getTokenInformation.js";
export { getTopHoldersOfToken } from "./tokens/getTopHoldersOfToken.js";
// Transactions
export { explainTransaction } from "./transactions/explainTransaction.js";
export { preExecTransaction } from "./transactions/preExecTransaction.js";
// Users
export { getUserAllComplexProtocolList } from "./users/getUserAllComplexProtocolList.js";
export { getUserAllTokenList } from "./users/getUserAllTokenList.js";
export { getUserChainBalance } from "./users/getUserChainBalance.js";
export { getUserComplexProtocolList } from "./users/getUserComplexProtocolList.js";
export { getUserHistoryList } from "./users/getUserHistoryList.js";
export { getUserNftList } from "./users/getUserNftList.js";
export { getUserTokenList } from "./users/getUserTokenList.js";
export { getUserTotalBalance } from "./users/getUserTotalBalance.js";

// Default export with all functions grouped
export default {
	// Chains
	getSupportedChainList: async () =>
		(await import("./chains/getSupportedChainList.js")).getSupportedChainList(),
	getChain: async (params: GetChainInput) =>
		(await import("./chains/getChain.js")).getChain(params),
	getGasPrices: async (params: GetGasPricesInput) =>
		(await import("./chains/getGasPrices.js")).getGasPrices(params),

	// Protocols
	getAllProtocolsOfSupportedChains: async (
		params?: GetAllProtocolsOfSupportedChainsInput,
	) =>
		(
			await import("./protocols/getAllProtocolsOfSupportedChains.js")
		).getAllProtocolsOfSupportedChains(params),
	getProtocolInformation: async (params: GetProtocolInformationInput) =>
		(
			await import("./protocols/getProtocolInformation.js")
		).getProtocolInformation(params),
	getTopHoldersOfProtocol: async (params: GetTopHoldersOfProtocolInput) =>
		(
			await import("./protocols/getTopHoldersOfProtocol.js")
		).getTopHoldersOfProtocol(params),
	getPoolInformation: async (params: GetPoolInformationInput) =>
		(await import("./protocols/getPoolInformation.js")).getPoolInformation(
			params,
		),

	// Tokens
	getTokenInformation: async (params: GetTokenInformationInput) =>
		(await import("./tokens/getTokenInformation.js")).getTokenInformation(
			params,
		),
	getListTokenInformation: async (params: GetListTokenInformationInput) =>
		(
			await import("./tokens/getListTokenInformation.js")
		).getListTokenInformation(params),
	getTopHoldersOfToken: async (params: GetTopHoldersOfTokenInput) =>
		(await import("./tokens/getTopHoldersOfToken.js")).getTopHoldersOfToken(
			params,
		),
	getTokenHistoryPrice: async (params: GetTokenHistoryPriceInput) =>
		(await import("./tokens/getTokenHistoryPrice.js")).getTokenHistoryPrice(
			params,
		),

	// Users
	getUserTotalBalance: async (params: GetUserTotalBalanceInput) =>
		(await import("./users/getUserTotalBalance.js")).getUserTotalBalance(
			params,
		),
	getUserChainBalance: async (params: GetUserChainBalanceInput) =>
		(await import("./users/getUserChainBalance.js")).getUserChainBalance(
			params,
		),
	getUserTokenList: async (params: GetUserTokenListInput) =>
		(await import("./users/getUserTokenList.js")).getUserTokenList(params),
	getUserAllTokenList: async (params: GetUserAllTokenListInput) =>
		(await import("./users/getUserAllTokenList.js")).getUserAllTokenList(
			params,
		),
	getUserComplexProtocolList: async (params: GetUserComplexProtocolListInput) =>
		(
			await import("./users/getUserComplexProtocolList.js")
		).getUserComplexProtocolList(params),
	getUserAllComplexProtocolList: async (
		params: GetUserAllComplexProtocolListInput,
	) =>
		(
			await import("./users/getUserAllComplexProtocolList.js")
		).getUserAllComplexProtocolList(params),
	getUserHistoryList: async (params: GetUserHistoryListInput) =>
		(await import("./users/getUserHistoryList.js")).getUserHistoryList(params),
	getUserNftList: async (params: GetUserNftListInput) =>
		(await import("./users/getUserNftList.js")).getUserNftList(params),

	// Transactions
	preExecTransaction: async (params: PreExecTransactionInput) =>
		(await import("./transactions/preExecTransaction.js")).preExecTransaction(
			params,
		),
	explainTransaction: async (params: ExplainTransactionInput) =>
		(await import("./transactions/explainTransaction.js")).explainTransaction(
			params,
		),
};
