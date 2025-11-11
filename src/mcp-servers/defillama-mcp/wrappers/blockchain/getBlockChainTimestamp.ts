import { executeServiceMethod } from "../../shared.js";

/**
 * Get block data for a specific chain and timestamp
 */
export async function getBlockChainTimestamp(params: {
	chain: string;
	timestamp: string | number;
}): Promise<any> {
	return executeServiceMethod("blockchain", "getBlockChainTimestamp", params);
}
