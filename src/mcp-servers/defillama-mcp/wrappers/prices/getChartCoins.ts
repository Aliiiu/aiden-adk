import { executeServiceMethod } from "../../shared.js";

/**
 * Get price chart data for coins
 */
export async function getChartCoins(params: {
	coins: string;
	start?: string | number;
	end?: string | number;
	span?: number;
	period?: string;
	searchWidth?: string | number;
}): Promise<any> {
	return executeServiceMethod("price", "getChartCoins", params);
}
