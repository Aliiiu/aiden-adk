/**
 * Get all DeFi protocols across supported chains
 */

import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetAllProtocolsOfSupportedChainsInputSchema = z
	.object({
		chain_ids: z
			.string()
			.optional()
			.describe(
				"Optional comma-separated list of chain IDs (e.g., 'eth,bsc,polygon')",
			),
	})
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
 * Retrieve a list of all DeFi protocols across specified or all supported chains
 *
 * @param input.chain_ids - Optional comma-separated chain IDs (e.g., 'eth,bsc,matic')
 *
 * @returns Array of protocols with ID, name, chain, TVL, and other details
 *
 * @example
 * ```typescript
 * const protocols = await getAllProtocolsOfSupportedChains({ chain_ids: 'eth,bsc' });
 * console.log(protocols);
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
