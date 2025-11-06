/**
 * Get OHLC (candlestick) data for a coin within a date range
 */

import { executeTool } from "../shared.js";

/**
 * Get OHLC (candlestick) data for a coin within a date range
 *
 * @param params.id - Coin ID
 * @param params.vs_currency - Target currency (e.g., 'usd')
 * @param params.from - From timestamp (UNIX)
 * @param params.to - To timestamp (UNIX)
 * @param params.precision - Decimal precision (default: 2)
 *
 * @returns OHLC data [timestamp, open, high, low, close]
 *
 * @example
 * ```typescript
 * const ohlc = await getRangeCoinsOhlc({
 *   id: 'bitcoin',
 *   vs_currency: 'usd',
 *   from: 1609459200,
 *   to: 1612137600
 * });
 * ```
 */
export async function getRangeCoinsOhlc(params: {
	id: string;
	vs_currency: string;
	from: number;
	to: number;
	precision?: number | string;
}): Promise<any> {
	return executeTool("get_range_coins_ohlc", params);
}
