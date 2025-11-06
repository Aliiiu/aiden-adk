/**
 * Get historical market data for an NFT collection
 */

import { executeTool } from "../shared.js";

/**
 * Get historical market data (floor price, volume) for an NFT collection
 *
 * @param params.id - NFT collection ID
 * @param params.days - Data up to number of days ago (e.g., 1, 7, 14, 30, 90, 365)
 *
 * @returns Historical floor price and volume data
 *
 * @example
 * ```typescript
 * const chart = await getNftsMarketChart({
 *   id: 'cryptopunks',
 *   days: 30
 * });
 * ```
 */
export async function getNftsMarketChart(params: {
	id: string;
	days: number | string;
}): Promise<any> {
	return executeTool("get_nfts_market_chart", params);
}
