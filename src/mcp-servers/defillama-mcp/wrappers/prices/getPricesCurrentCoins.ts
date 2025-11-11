import { executeServiceMethod } from "../../shared.js";

/**
 * Get current prices for coins
 */
export async function getPricesCurrentCoins(params: {
	coins: string;
	searchWidth?: string | number;
}): Promise<any> {
	return executeServiceMethod("price", "getPricesCurrentCoins", params);
}
