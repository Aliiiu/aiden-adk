/**
 * Get historical holders chart for a token
 */

import { executeTool } from "../shared.js";

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
export async function getTokensNetworksOnchainHoldersChart(params: {
	network: string;
	token_address: string;
	days: number;
}): Promise<any> {
	return executeTool("get_tokens_networks_onchain_holders_chart", params);
}
