import { executeServiceMethod } from "../../shared.js";

/**
 * Get fees and revenue metrics for protocols or chains
 */
export async function getFeesAndRevenue(params?: {
	excludeTotalDataChart?: boolean;
	excludeTotalDataChartBreakdown?: boolean;
	dataType?: "dailyFees" | "dailyRevenue" | "dailyHoldersRevenue";
	chain?: string;
	protocol?: string;
	sortCondition?: string;
	order?: "asc" | "desc";
}): Promise<any> {
	return executeServiceMethod("fees", "getFeesAndRevenue", {
		excludeTotalDataChart: params?.excludeTotalDataChart ?? true,
		excludeTotalDataChartBreakdown:
			params?.excludeTotalDataChartBreakdown ?? true,
		dataType: params?.dataType || "dailyFees",
		sortCondition: params?.sortCondition || "total24h",
		order: params?.order || "desc",
		...(params?.chain && { chain: params.chain }),
		...(params?.protocol && { protocol: params.protocol }),
	});
}
