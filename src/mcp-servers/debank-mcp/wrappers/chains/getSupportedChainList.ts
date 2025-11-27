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
 * Get list of all blockchain chains supported by DeBank - returns complete chain directory.
 *
 * Returns all supported chains with identifiers and metadata. Use this to:
 * - Get valid chain_id values for other DeBank functions
 * - Discover available chains (Ethereum, BSC, Polygon, Arbitrum, etc.)
 * - Get chain names, logos, and native token info
 *
 * NOTE: This returns ALL supported chains, not user-specific chains. To find which
 * chains a specific user/wallet has activity on, use getUserTotalBalance() and
 * check which chains have non-zero balances.
 *
 * For detailed info about a specific chain, use getChain().
 *
 * @returns Array of all chains: id, name, logo_url, native_token_id, wrapped_token_id
 *
 * @example
 * ```typescript
 * // Get all supported chains
 * const chains = await getSupportedChainList();
 * // Returns: [{ id: 'eth', name: 'Ethereum', ... }, { id: 'bsc', name: 'BSC', ... }]
 *
 * // Extract chain IDs for use in other functions
 * const chainIds = chains.map(c => c.id); // ['eth', 'bsc', 'matic', 'arb', ...]
 * ```
 */
export async function getSupportedChainList(): Promise<GetSupportedChainListResponse> {
	return executeServiceMethod(
		"chain",
		"getSupportedChainList",
		{},
	) as Promise<GetSupportedChainListResponse>;
}
