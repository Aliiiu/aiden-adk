import { executeServiceMethod } from "../../shared.js";

/**
 * Get latest yield pool data with sorting
 */
export async function getLatestPoolData(params?: {
	sortCondition?: string;
	order?: "asc" | "desc";
	limit?: number;
}): Promise<any> {
	return executeServiceMethod("yield", "getLatestPoolData", {
		sortCondition: params?.sortCondition || "apy",
		order: params?.order || "desc",
		limit: params?.limit ?? 10,
	});
}
