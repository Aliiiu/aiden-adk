import { executeServiceMethod } from "../../shared.js";

/**
 * Get historical stablecoin price data
 */
export async function getStableCoinPrices(): Promise<any> {
	return executeServiceMethod("stablecoin", "getStableCoinPrices", {});
}
