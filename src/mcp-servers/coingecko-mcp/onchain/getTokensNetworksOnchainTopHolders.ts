/**
 * Get top holders of a token
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetTokensNetworksOnchainTopHoldersInputSchema = z.object({
	network: z.string().describe("Network identifier"),
	token_address: z.string().describe("Token contract address"),
	page: z.number().int().positive().optional().describe("Page number"),
});

const HolderEntrySchema = z.object({
	address: z.string(),
	label: z.string().nullable().optional(),
	amount: z.string(),
	value: z.string().nullable().optional(),
	percentage: z.string().nullable().optional(),
	rank: z.number().nullable().optional(),
});

export const GetTokensNetworksOnchainTopHoldersResponseSchema = z.object({
	data: z.object({
		id: z.string(),
		type: z.string(),
		attributes: z.object({
			holders: z.array(HolderEntrySchema),
			last_updated_at: z.string().nullable().optional(),
		}),
	}),
});

export type GetTokensNetworksOnchainTopHoldersInput = z.infer<
	typeof GetTokensNetworksOnchainTopHoldersInputSchema
>;
export type GetTokensNetworksOnchainTopHoldersResponse = z.infer<
	typeof GetTokensNetworksOnchainTopHoldersResponseSchema
>;

/**
 * Get top holders/wallets for a specific token
 *
 * @param params.network - Network ID
 * @param params.token_address - Token contract address
 * @param params.page - Page number (default: 1)
 *
 * @returns Top holders with balances and percentages
 *
 * @example
 * ```typescript
 * const holders = await getTokensNetworksOnchainTopHolders({
 *   network: 'eth',
 *   token_address: '0x...'
 * });
 * ```
 */
export async function getTokensNetworksOnchainTopHolders(
	params: GetTokensNetworksOnchainTopHoldersInput,
): Promise<GetTokensNetworksOnchainTopHoldersResponse> {
	return executeTool(
		"get_tokens_networks_onchain_top_holders",
		params,
	) as Promise<GetTokensNetworksOnchainTopHoldersResponse>;
}
