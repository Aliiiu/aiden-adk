import { executeServiceMethod } from "../../shared.js";

/**
 * Get stablecoin overview data
 */
export async function getStableCoin(params?: {
	includePrices?: boolean;
}): Promise<any> {
	return executeServiceMethod("stablecoin", "getStableCoin", {
		includePrices: params?.includePrices ?? false,
	});
}
