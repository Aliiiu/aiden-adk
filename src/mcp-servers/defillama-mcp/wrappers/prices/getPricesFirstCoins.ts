import { executeServiceMethod } from "../../shared.js";

/**
 * Get first recorded prices for coins
 */
export async function getPricesFirstCoins(params: {
	coins: string;
}): Promise<any> {
	return executeServiceMethod("price", "getPricesFirstCoins", params);
}
