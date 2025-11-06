/**
 * Get top gainers and losers by price change percentage
 */

import { executeTool } from "../shared.js";

/**
 * Get top gainers and losers by price change percentage
 *
 * @param params.vs_currency - Target currency (default: 'usd')
 * @param params.duration - Time period: 1h, 24h (default: '24h')
 * @param params.top_coins - Filter by top N coins by market cap (e.g., '300')
 *
 * @returns Top gainers and losers data
 *
 * @example
 * ```typescript
 * const movers = await getTopGainersLosers({
 *   vs_currency: 'usd',
 *   duration: '24h',
 *   top_coins: '300'
 * });
 * ```
 */
export async function getTopGainersLosers(params?: {
	vs_currency?: string;
	duration?: string;
	top_coins?: string;
}): Promise<any> {
	return executeTool("get_coins_top_gainers_losers", params || {});
}
