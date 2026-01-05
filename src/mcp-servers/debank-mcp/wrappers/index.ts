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
import type { GetChainInput } from "./chains/getChain";
import type { GetGasPricesInput } from "./chains/getGasPrices";
import type { GetAllProtocolsOfSupportedChainsInput } from "./protocols/getAllProtocolsOfSupportedChains";
import type { GetPoolInformationInput } from "./protocols/getPoolInformation";
import type { GetProtocolInformationInput } from "./protocols/getProtocolInformation";
import type { GetTopHoldersOfProtocolInput } from "./protocols/getTopHoldersOfProtocol";
import type { GetListTokenInformationInput } from "./tokens/getListTokenInformation";
import type { GetTokenHistoryPriceInput } from "./tokens/getTokenHistoryPrice";
import type { GetTokenInformationInput } from "./tokens/getTokenInformation";
import type { GetTopHoldersOfTokenInput } from "./tokens/getTopHoldersOfToken";
import type { ExplainTransactionInput } from "./transactions/explainTransaction";
import type { PreExecTransactionInput } from "./transactions/preExecTransaction";
import type { GetUserAllComplexProtocolListInput } from "./users/getUserAllComplexProtocolList";
import type { GetUserAllTokenListInput } from "./users/getUserAllTokenList";
import type { GetUserChainBalanceInput } from "./users/getUserChainBalance";
import type { GetUserComplexProtocolListInput } from "./users/getUserComplexProtocolList";
import type { GetUserHistoryListInput } from "./users/getUserHistoryList";
import type { GetUserNftListInput } from "./users/getUserNftList";
import type { GetUserTokenListInput } from "./users/getUserTokenList";
import type { GetUserTotalBalanceInput } from "./users/getUserTotalBalance";

// Export jsonata for parameter discovery and filtering
export { jsonata };

// Re-export shared utilities for advanced usage
export { executeServiceMethod } from "../shared";
// Chains
export { getChain } from "./chains/getChain";
export { getGasPrices } from "./chains/getGasPrices";
export { getSupportedChainList } from "./chains/getSupportedChainList";
// Protocols
export { getAllProtocolsOfSupportedChains } from "./protocols/getAllProtocolsOfSupportedChains";
export { getPoolInformation } from "./protocols/getPoolInformation";
export { getProtocolInformation } from "./protocols/getProtocolInformation";
export { getTopHoldersOfProtocol } from "./protocols/getTopHoldersOfProtocol";
// Tokens
export { getListTokenInformation } from "./tokens/getListTokenInformation";
export { getTokenHistoryPrice } from "./tokens/getTokenHistoryPrice";
export { getTokenInformation } from "./tokens/getTokenInformation";
export { getTopHoldersOfToken } from "./tokens/getTopHoldersOfToken";
// Transactions
export { explainTransaction } from "./transactions/explainTransaction";
export { preExecTransaction } from "./transactions/preExecTransaction";
// Users
export { getUserAllComplexProtocolList } from "./users/getUserAllComplexProtocolList";
export { getUserAllTokenList } from "./users/getUserAllTokenList";
export { getUserChainBalance } from "./users/getUserChainBalance";
export { getUserComplexProtocolList } from "./users/getUserComplexProtocolList";
export { getUserHistoryList } from "./users/getUserHistoryList";
export { getUserNftList } from "./users/getUserNftList";
export { getUserTokenList } from "./users/getUserTokenList";
export { getUserTotalBalance } from "./users/getUserTotalBalance";

// Default export with all functions grouped
export default {
	// Chains
	getSupportedChainList: async () =>
		(await import("./chains/getSupportedChainList")).getSupportedChainList(),
	getChain: async (params: GetChainInput) =>
		(await import("./chains/getChain")).getChain(params),
	getGasPrices: async (params: GetGasPricesInput) =>
		(await import("./chains/getGasPrices")).getGasPrices(params),

	// Protocols
	getAllProtocolsOfSupportedChains: async (
		params?: GetAllProtocolsOfSupportedChainsInput,
	) =>
		(
			await import("./protocols/getAllProtocolsOfSupportedChains")
		).getAllProtocolsOfSupportedChains(params),
	getProtocolInformation: async (params: GetProtocolInformationInput) =>
		(await import("./protocols/getProtocolInformation")).getProtocolInformation(
			params,
		),
	getTopHoldersOfProtocol: async (params: GetTopHoldersOfProtocolInput) =>
		(
			await import("./protocols/getTopHoldersOfProtocol")
		).getTopHoldersOfProtocol(params),
	getPoolInformation: async (params: GetPoolInformationInput) =>
		(await import("./protocols/getPoolInformation")).getPoolInformation(params),

	// Tokens
	getTokenInformation: async (params: GetTokenInformationInput) =>
		(await import("./tokens/getTokenInformation")).getTokenInformation(params),
	getListTokenInformation: async (params: GetListTokenInformationInput) =>
		(await import("./tokens/getListTokenInformation")).getListTokenInformation(
			params,
		),
	getTopHoldersOfToken: async (params: GetTopHoldersOfTokenInput) =>
		(await import("./tokens/getTopHoldersOfToken")).getTopHoldersOfToken(
			params,
		),
	getTokenHistoryPrice: async (params: GetTokenHistoryPriceInput) =>
		(await import("./tokens/getTokenHistoryPrice")).getTokenHistoryPrice(
			params,
		),

	// Users
	getUserTotalBalance: async (params: GetUserTotalBalanceInput) =>
		(await import("./users/getUserTotalBalance")).getUserTotalBalance(params),
	getUserChainBalance: async (params: GetUserChainBalanceInput) =>
		(await import("./users/getUserChainBalance")).getUserChainBalance(params),
	getUserTokenList: async (params: GetUserTokenListInput) =>
		(await import("./users/getUserTokenList")).getUserTokenList(params),
	getUserAllTokenList: async (params: GetUserAllTokenListInput) =>
		(await import("./users/getUserAllTokenList")).getUserAllTokenList(params),
	getUserComplexProtocolList: async (params: GetUserComplexProtocolListInput) =>
		(
			await import("./users/getUserComplexProtocolList")
		).getUserComplexProtocolList(params),
	getUserAllComplexProtocolList: async (
		params: GetUserAllComplexProtocolListInput,
	) =>
		(
			await import("./users/getUserAllComplexProtocolList")
		).getUserAllComplexProtocolList(params),
	getUserHistoryList: async (params: GetUserHistoryListInput) =>
		(await import("./users/getUserHistoryList")).getUserHistoryList(params),
	getUserNftList: async (params: GetUserNftListInput) =>
		(await import("./users/getUserNftList")).getUserNftList(params),

	// Transactions
	preExecTransaction: async (params: PreExecTransactionInput) =>
		(await import("./transactions/preExecTransaction")).preExecTransaction(
			params,
		),
	explainTransaction: async (params: ExplainTransactionInput) =>
		(await import("./transactions/explainTransaction")).explainTransaction(
			params,
		),
};
