import { executeServiceMethod } from "../../shared.js";

/**
 * Get stablecoin circulation data grouped by chains
 */
export async function getStableCoinChains(): Promise<any> {
	return executeServiceMethod("stablecoin", "getStableCoinChains", {});
}
