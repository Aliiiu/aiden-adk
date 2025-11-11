import { executeServiceMethod } from "../../shared.js";

/**
 * Get options protocol metrics
 */
export async function getOptionsData(params?: {
	sortCondition?: string;
	order?: "asc" | "desc";
	dataType?: string;
	chain?: string;
	protocol?: string;
	excludeTotalDataChart?: boolean;
	excludeTotalDataChartBreakdown?: boolean;
}): Promise<any> {
	return executeServiceMethod("options", "getOptionsData", {
		sortCondition: params?.sortCondition || "total24h",
		order: params?.order || "desc",
		dataType: params?.dataType || "dailyNotionalVolume",
		excludeTotalDataChart: params?.excludeTotalDataChart ?? true,
		excludeTotalDataChartBreakdown:
			params?.excludeTotalDataChartBreakdown ?? true,
		...(params?.chain && { chain: params.chain }),
		...(params?.protocol && { protocol: params.protocol }),
	});
}
