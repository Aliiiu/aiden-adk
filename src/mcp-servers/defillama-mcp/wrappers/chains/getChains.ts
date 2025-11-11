import { executeServiceMethod } from "../../shared.js";

/**
 * Get chains ranked by TVL
 */
export async function getChains(params?: {
	order?: "asc" | "desc";
}): Promise<any> {
	return executeServiceMethod("protocol", "getChains", {
		order: params?.order || "desc",
	});
}
