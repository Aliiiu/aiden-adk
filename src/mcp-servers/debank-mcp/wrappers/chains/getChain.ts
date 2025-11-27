import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetChainInputSchema = z
	.object({
		id: z.string().describe("Chain identifier (e.g., 'eth', 'bsc', 'polygon')"),
	})
	.strict();

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
 * Get detailed information about a specific blockchain chain by its identifier.
 *
 * Returns chain metadata and configuration. This is for looking up a specific chain's details.
 * For listing all available chains, use getSupportedChainList.
 *
 * @param input.id - Chain identifier (e.g., 'eth', 'bsc', 'matic', 'arb', 'polygon')
 *
 * @returns Chain details: name, logo, native token, wrapped token, pre-exec simulation support
 *
 * @example
 * ```typescript
 * const chain = await getChain({ id: 'eth' });
 * console.log(chain.name); // 'Ethereum'
 * console.log(chain.native_token_id); // 'eth'
 * console.log(chain.is_support_pre_exec); // true/false
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
