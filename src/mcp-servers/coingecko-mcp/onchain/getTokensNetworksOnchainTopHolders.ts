import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetTokensNetworksOnchainTopHoldersInputSchema = z.object({
	network: z.string().describe("Network identifier"),
	address: z.string().describe("Token contract address"),
	holders: z
		.string()
		.optional()
		.describe(
			"Number of top token holders to return (integer as string or 'max'). Default: 10",
		),
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
 * @param params.address - Token contract address
 * @param params.holders - Number of top holders to return (as string: '10', '50', 'max'). Default: '10'
 *
 * @returns Top holders with balances and percentages
 *
 * @example
 * ```typescript
 * const holders = await getTokensNetworksOnchainTopHolders({
 *   network: 'eth',
 *   address: '0xcfeaead4947f0705a14ec42ac3d44129e1ef3ed5',
 *   holders: '50'
 * });
 * // Access holders: holders.data.attributes.holders
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
