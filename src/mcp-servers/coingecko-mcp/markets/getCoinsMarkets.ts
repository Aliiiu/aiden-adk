/**
 * Get cryptocurrency market data for all coins
 */

import { executeTool } from "../shared.js";

/**
 * Get cryptocurrency market data for all coins
 *
 * @param params.vs_currency - Target currency (default: 'usd')
 * @param params.order - Sort order: market_cap_desc, volume_desc, id_asc, id_desc
 * @param params.per_page - Results per page (1-250, default: 100)
 * @param params.page - Page number (default: 1)
 * @param params.sparkline - Include 7-day sparkline data (default: false)
 * @param params.price_change_percentage - Price change timeframes: 1h,24h,7d,14d,30d,200d,1y
 * @param params.locale - Language locale (default: 'en')
 * @param params.precision - Decimal places for currency (default: 2)
 *
 * @returns Array of coin market data with prices, volumes, market caps, etc.
 *
 * @example
 * ```typescript
 * const markets = await getCoinsMarkets({
 *   vs_currency: 'usd',
 *   order: 'market_cap_desc',
 *   per_page: 10,
 *   price_change_percentage: '24h,7d'
 * });
 * ```
 */
export async function getCoinsMarkets(params: {
	vs_currency?: string;
	order?: string;
	per_page?: number;
	page?: number;
	sparkline?: boolean;
	price_change_percentage?: string;
	locale?: string;
	precision?: number | string;
}): Promise<any> {
	return executeTool("get_coins_markets", params);
}
