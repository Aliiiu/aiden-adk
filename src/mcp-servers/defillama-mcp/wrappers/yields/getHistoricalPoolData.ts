import { executeServiceMethod } from "../../shared.js";

/**
 * Get historical yield pool data
 */
export async function getHistoricalPoolData(params: {
	pool: string;
}): Promise<any> {
	return executeServiceMethod("yield", "getHistoricalPoolData", params);
}
