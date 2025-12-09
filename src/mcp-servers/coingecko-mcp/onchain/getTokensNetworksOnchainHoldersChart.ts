import { z } from "zod";
import { executeTool } from "../shared";

export const GetTokensNetworksOnchainHoldersChartInputSchema = z.object({
	network: z.string().describe("Network identifier"),
	token_address: z.string().describe("Token contract address"),
	days: z.number().describe("Number of days to include"),
});

const HoldersPointSchema = z
	.array(z.string())
	.describe("Tuple [timestamp, holders_count]");

export const GetTokensNetworksOnchainHoldersChartResponseSchema = z.object({
	data: z.object({
		id: z.string(),
		type: z.string(),
		attributes: z.object({
			token_holders_list: z.array(HoldersPointSchema),
		}),
	}),
	meta: z
		.object({
			token: z
				.object({
					address: z.string(),
					coingecko_coin_id: z.string().nullable().optional(),
					name: z.string().nullable().optional(),
					symbol: z.string().nullable().optional(),
				})
				.optional(),
		})
		.optional(),
});

export type GetTokensNetworksOnchainHoldersChartInput = z.infer<
	typeof GetTokensNetworksOnchainHoldersChartInputSchema
>;
export type GetTokensNetworksOnchainHoldersChartResponse = z.infer<
	typeof GetTokensNetworksOnchainHoldersChartResponseSchema
>;

/**
 * Get historical chart showing number of token holders over time
 *
 * @param params.network - Network ID
 * @param params.token_address - Token contract address
 * @param params.days - Number of days (e.g., 7, 30, 90)
 *
 * @returns Historical holders count data
 *
 * @example
 * ```typescript
 * const holdersChart = await getTokensNetworksOnchainHoldersChart({
 *   network: 'eth',
 *   token_address: '0x...',
 *   days: 30
 * });
 * ```
 */
export async function getTokensNetworksOnchainHoldersChart(
	params: GetTokensNetworksOnchainHoldersChartInput,
): Promise<GetTokensNetworksOnchainHoldersChartResponse> {
	return executeTool(
		"get_tokens_networks_onchain_holders_chart",
		params,
	) as Promise<GetTokensNetworksOnchainHoldersChartResponse>;
}
