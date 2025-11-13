/**
 * Get detailed information about a specific chain
 */

import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

/**
 * Input schema for getting chain information
 */
export const GetChainInputSchema = z.object({
	id: z.string().describe("Chain identifier (e.g., 'eth', 'bsc', 'polygon')"),
});

/**
 * Response schema for chain information
 * Contains blockchain metadata and configuration
 */
export const GetChainResponseSchema = z.object({
	id: z.string().describe("Chain identifier"),
	community_id: z
		.number()
		.describe("Internal community identifier used by DeBank"),
	name: z.string().describe("Human-readable chain name"),
	logo_url: z.url().describe("URL to chain logo image"),
	native_token_id: z.string().describe("Native token identifier"),
	wrapped_token_id: z
		.string()
		.describe("Wrapped native token contract address"),
	is_support_pre_exec: z
		.boolean()
		.describe("Whether chain supports transaction pre-execution simulation"),
});
export type GetChainInput = z.infer<typeof GetChainInputSchema>;
export type GetChainResponse = z.infer<typeof GetChainResponseSchema>;

/**
 * Retrieve detailed information about a specific blockchain chain
 *
 * @example
 * ```typescript
 * const chain = await getChain({ id: 'eth' });
 * // Returns: { id: 'eth', name: 'Ethereum', logo_url: '...', ... }
 * ```
 */
export async function getChain(
	input: GetChainInput,
): Promise<GetChainResponse> {
	return executeServiceMethod(
		"chain",
		"getChain",
		input,
	) as Promise<GetChainResponse>;
}
