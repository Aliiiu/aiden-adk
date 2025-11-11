import { executeServiceMethod } from "../../shared.js";

/**
 * Get batch historical prices for coins
 */
export async function getBatchHistorical(params: {
	coins: string;
	searchWidth?: string | number;
}): Promise<any> {
	return executeServiceMethod("price", "getBatchHistorical", params);
}
