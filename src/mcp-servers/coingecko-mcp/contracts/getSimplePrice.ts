/**
 * Get current price of tokens (ids, contract addresses) for multiple currencies
 */

import { executeTool } from "../shared.js";

/**
 * Get current price of tokens for multiple currencies
 *
 * @param params.ids - Coin IDs (comma-separated, e.g., 'bitcoin,ethereum')
 * @param params.vs_currencies - Target currencies (comma-separated, e.g., 'usd,eur')
 * @param params.include_market_cap - Include market cap (default: false)
 * @param params.include_24hr_vol - Include 24hr volume (default: false)
 * @param params.include_24hr_change - Include 24hr change (default: false)
 * @param params.include_last_updated_at - Include last updated timestamp (default: false)
 * @param params.precision - Decimal precision for currency (default: 'full')
 *
 * @returns Price data for requested coins in requested currencies
 *
 * @example
 * ```typescript
 * const prices = await getSimplePrice({
 *   ids: 'bitcoin,ethereum',
 *   vs_currencies: 'usd,eur',
 *   include_24hr_change: true
 * });
 * ```
 */
export async function getSimplePrice(params: {
	ids: string;
	vs_currencies: string;
	include_market_cap?: boolean;
	include_24hr_vol?: boolean;
	include_24hr_change?: boolean;
	include_last_updated_at?: boolean;
	precision?: string;
}): Promise<any> {
	return executeTool("get_simple_price", params);
}
