import { executeServiceMethod } from "../../shared.js";

/**
 * Get protocol data - specific protocol or top protocols ranked by TVL or change
 */
export async function getProtocols(params: {
	protocol?: string;
	sortCondition?: "change_1h" | "change_1d" | "change_7d" | "tvl";
	order?: "asc" | "desc";
}): Promise<any> {
	return executeServiceMethod("protocol", "getProtocolData", {
		sortCondition: params.sortCondition || "tvl",
		order: params.order || "desc",
		...(params.protocol && { protocol: params.protocol }),
	});
}
