/**
 * Get NFT collection data (name, floor price, 24h volume, etc.) based on asset platform and/or collection id
 */

import { executeTool } from "../shared.js";

/**
 * Get NFT market data for collections
 *
 * @param params.asset_platform_id - Asset platform ID (required)
 * @param params.order - Sort order
 * @param params.per_page - Results per page (default: 100)
 * @param params.page - Page number (default: 1)
 *
 * @returns NFT market data including floor price, volume, market cap
 *
 * @example
 * ```typescript
 * const markets = await getNftsMarkets({
 *   asset_platform_id: 'ethereum',
 *   order: 'market_cap_usd_desc',
 *   per_page: 10
 * });
 * ```
 */
export async function getNftsMarkets(params: {
	asset_platform_id: string;
	order?: string;
	per_page?: number;
	page?: number;
}): Promise<any> {
	return executeTool("get_markets_nfts", params);
}
