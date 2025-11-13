/**
 * Get list of all supported blockchain chains
 */

import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

const ChainSummarySchema = z.object({
	id: z.string().describe("Chain identifier"),
	community_id: z
		.number()
		.describe("Internal community identifier used by DeBank"),
	name: z.string().describe("Human-readable chain name"),
	logo_url: z.string().url().describe("URL to chain logo image"),
	native_token_id: z.string().describe("Native token identifier"),
	wrapped_token_id: z
		.string()
		.describe("Wrapped native token contract address"),
	is_support_pre_exec: z
		.boolean()
		.describe("Whether chain supports transaction pre-execution simulation"),
});

export const GetSupportedChainListResponseSchema = z
	.array(ChainSummarySchema)
	.describe("All supported chains on DeBank");

export type GetSupportedChainListResponse = z.infer<
	typeof GetSupportedChainListResponseSchema
>;

/**
 * Retrieve a comprehensive list of all blockchain chains supported by DeBank
 *
 * @returns Array of supported chains with their details
 *
 * @example
 * ```typescript
 * const chains = await getSupportedChainList();
 * console.log(chains);
 * ```
 */
export async function getSupportedChainList(): Promise<GetSupportedChainListResponse> {
	return executeServiceMethod(
		"chain",
		"getSupportedChainList",
		{},
	) as Promise<GetSupportedChainListResponse>;
}
