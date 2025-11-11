import { executeServiceMethod } from "../../shared.js";

/**
 * Get historical TVL data for a chain or all chains
 */
export async function getHistoricalChainTvl(params?: {
	chain?: string;
}): Promise<any> {
	return executeServiceMethod(
		"protocol",
		"getHistoricalChainTvl",
		params || {},
	);
}
