/**
 * Get all DeFi protocols across supported chains
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Retrieve a list of all DeFi protocols across specified or all supported chains
 *
 * @param params.chain_ids - Optional comma-separated chain IDs (e.g., 'eth,bsc,matic')
 *
 * @returns Array of protocols with ID, name, chain, TVL, and other details
 *
 * @example
 * ```typescript
 * const protocols = await getAllProtocolsOfSupportedChains({ chain_ids: 'eth,bsc' });
 * console.log(protocols);
 * ```
 */
export async function getAllProtocolsOfSupportedChains(params?: {
	chain_ids?: string;
}): Promise<any> {
	return executeServiceMethod(
		"protocol",
		"getAllProtocolsOfSupportedChains",
		params || {},
	);
}
