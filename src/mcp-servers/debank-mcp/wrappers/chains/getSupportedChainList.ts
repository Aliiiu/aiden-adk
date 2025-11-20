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
 * Get list of all blockchain chains supported by DeBank with their identifiers and metadata.
 *
 * Returns chain directory for discovering available chains and their IDs. This is for finding valid
 * chain_id values to use in other DeBank functions. For detailed info about a specific chain, use getChain.
 *
 * @returns Array of chains: ID, name, logo, native token, wrapped token, pre-exec support
 *
 * @example
 * ```typescript
 * const chains = await getSupportedChainList();
 * // Returns: [{ id: 'eth', name: 'Ethereum', ... }, { id: 'bsc', name: 'BSC', ... }]
 * console.log(chains.map(c => c.id)); // ['eth', 'bsc', 'matic', 'arb', ...]
 * ```
 */
export async function getSupportedChainList(): Promise<GetSupportedChainListResponse> {
	return executeServiceMethod(
		"chain",
		"getSupportedChainList",
		{},
	) as Promise<GetSupportedChainListResponse>;
}
