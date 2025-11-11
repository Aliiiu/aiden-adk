import { executeServiceMethod } from "../../shared.js";

/**
 * Get decentralized exchange volume data
 */
export async function getDexsData(params?: {
	excludeTotalDataChart?: boolean;
	excludeTotalDataChartBreakdown?: boolean;
	chain?: string;
	protocol?: string;
	sortCondition?: string;
	order?: "asc" | "desc";
}): Promise<any> {
	return executeServiceMethod("dex", "getDexsData", {
		excludeTotalDataChart: params?.excludeTotalDataChart ?? true,
		excludeTotalDataChartBreakdown:
			params?.excludeTotalDataChartBreakdown ?? true,
		sortCondition: params?.sortCondition || "total24h",
		order: params?.order || "desc",
		...(params?.chain && { chain: params.chain }),
		...(params?.protocol && { protocol: params.protocol }),
	});
}
