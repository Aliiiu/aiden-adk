import { z } from "zod";
import { executeServiceMethod } from "../../shared";

export const GetAllProtocolsOfSupportedChainsInputSchema = z
	.object({
		chain_ids: z
			.string()
			.optional()
			.describe(
				"Optional comma-separated list of chain IDs (e.g., 'eth,bsc,polygon')",
			),
	})
	.strict()
	.optional();

const ProtocolSummarySchema = z.object({
	id: z.string().describe("Protocol identifier"),
	chain: z.string().describe("Chain ID where the protocol exists"),
	name: z.string().describe("Protocol display name"),
	logo_url: z.string().url().describe("Protocol logo URL"),
	site_url: z.string().url().describe("Protocol website"),
	has_supported_portfolio: z
		.boolean()
		.describe("Whether portfolio tracking is supported"),
	tvl: z.number().describe("Total value locked in USD"),
});

export const GetAllProtocolsOfSupportedChainsResponseSchema = z
	.array(ProtocolSummarySchema)
	.describe("List of protocols across supported chains");

export type GetAllProtocolsOfSupportedChainsInput = z.infer<
	typeof GetAllProtocolsOfSupportedChainsInputSchema
>;
export type GetAllProtocolsOfSupportedChainsResponse = z.infer<
	typeof GetAllProtocolsOfSupportedChainsResponseSchema
>;

/**
 * Get all DeFi protocols with their names, chains, TVL, and metadata for discovery.
 *
 * Returns protocol directory across chains. This is for discovering available protocols and their identifiers.
 *
 * @param input.chain_ids - Optional comma-separated chain IDs to filter (e.g., 'eth,bsc,matic')
 *
 * @returns Array of protocols: ID, name, chain, TVL, logo, website, portfolio support status
 *
 * @example
 * ```typescript
 * const protocols = await getAllProtocolsOfSupportedChains({ chain_ids: 'eth,bsc' });
 * // Returns: [{ id: 'uniswap', name: 'Uniswap', chain: 'eth', tvl: 5000000000 }, ...]
 * ```
 */
export async function getAllProtocolsOfSupportedChains(
	input?: GetAllProtocolsOfSupportedChainsInput,
): Promise<GetAllProtocolsOfSupportedChainsResponse> {
	return executeServiceMethod(
		"protocol",
		"getAllProtocolsOfSupportedChains",
		input ?? {},
	) as Promise<GetAllProtocolsOfSupportedChainsResponse>;
}
