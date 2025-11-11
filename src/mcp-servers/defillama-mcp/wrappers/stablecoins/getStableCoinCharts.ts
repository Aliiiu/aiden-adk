import { executeServiceMethod } from "../../shared.js";

/**
 * Get historical stablecoin chart data
 */
export async function getStableCoinCharts(params?: {
	chain?: string;
	stablecoin?: string | number;
}): Promise<any> {
	return executeServiceMethod(
		"stablecoin",
		"getStableCoinCharts",
		params || {},
	);
}
