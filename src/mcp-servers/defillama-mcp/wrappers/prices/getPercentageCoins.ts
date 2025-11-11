import { executeServiceMethod } from "../../shared.js";

/**
 * Get percentage price change metrics for coins
 */
export async function getPercentageCoins(params: {
	coins: string;
	period?: string;
	lookForward?: boolean;
	timestamp?: string | number;
}): Promise<any> {
	return executeServiceMethod("price", "getPercentageCoins", params);
}
