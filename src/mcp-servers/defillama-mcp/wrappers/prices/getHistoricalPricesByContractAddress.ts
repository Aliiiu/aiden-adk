import { executeServiceMethod } from "../../shared.js";

/**
 * Get historical prices for coins by contract address at a specific timestamp
 */
export async function getHistoricalPricesByContractAddress(params: {
	coins: string;
	timestamp: string | number;
	searchWidth?: string | number;
}): Promise<any> {
	return executeServiceMethod(
		"price",
		"getHistoricalPricesByContractAddress",
		params,
	);
}
