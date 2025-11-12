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
	getChain: async (params: any) =>
		(await import("./chains/getChain.js")).getChain(params),
	getGasPrices: async (params: any) =>
		(await import("./chains/getGasPrices.js")).getGasPrices(params),

	// Protocols
	getAllProtocolsOfSupportedChains: async (params?: any) =>
		(
			await import("./protocols/getAllProtocolsOfSupportedChains.js")
		).getAllProtocolsOfSupportedChains(params),
	getProtocolInformation: async (params: any) =>
		(
			await import("./protocols/getProtocolInformation.js")
		).getProtocolInformation(params),
	getTopHoldersOfProtocol: async (params: any) =>
		(
			await import("./protocols/getTopHoldersOfProtocol.js")
		).getTopHoldersOfProtocol(params),
	getPoolInformation: async (params: any) =>
		(await import("./protocols/getPoolInformation.js")).getPoolInformation(
			params,
		),

	// Tokens
	getTokenInformation: async (params: any) =>
		(await import("./tokens/getTokenInformation.js")).getTokenInformation(
			params,
		),
	getListTokenInformation: async (params: any) =>
		(
			await import("./tokens/getListTokenInformation.js")
		).getListTokenInformation(params),
	getTopHoldersOfToken: async (params: any) =>
		(await import("./tokens/getTopHoldersOfToken.js")).getTopHoldersOfToken(
			params,
		),
	getTokenHistoryPrice: async (params: any) =>
		(await import("./tokens/getTokenHistoryPrice.js")).getTokenHistoryPrice(
			params,
		),

	// Users
	getUserTotalBalance: async (params: any) =>
		(await import("./users/getUserTotalBalance.js")).getUserTotalBalance(
			params,
		),
	getUserChainBalance: async (params: any) =>
		(await import("./users/getUserChainBalance.js")).getUserChainBalance(
			params,
		),
	getUserTokenList: async (params: any) =>
		(await import("./users/getUserTokenList.js")).getUserTokenList(params),
	getUserAllTokenList: async (params: any) =>
		(await import("./users/getUserAllTokenList.js")).getUserAllTokenList(
			params,
		),
	getUserComplexProtocolList: async (params: any) =>
		(
			await import("./users/getUserComplexProtocolList.js")
		).getUserComplexProtocolList(params),
	getUserAllComplexProtocolList: async (params: any) =>
		(
			await import("./users/getUserAllComplexProtocolList.js")
		).getUserAllComplexProtocolList(params),
	getUserHistoryList: async (params: any) =>
		(await import("./users/getUserHistoryList.js")).getUserHistoryList(params),
	getUserNftList: async (params: any) =>
		(await import("./users/getUserNftList.js")).getUserNftList(params),

	// Transactions
	preExecTransaction: async (params: any) =>
		(await import("./transactions/preExecTransaction.js")).preExecTransaction(
			params,
		),
	explainTransaction: async (params: any) =>
		(await import("./transactions/explainTransaction.js")).explainTransaction(
			params,
		),
};
