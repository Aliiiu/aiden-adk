/**
 * Get historical market data for a token by contract address
 */

import { executeTool } from "../shared.js";

/**
 * Get historical market data for a token by contract address
 *
 * @param params.id - Asset platform ID (e.g., 'ethereum')
 * @param params.contract_address - Token contract address
 * @param params.vs_currency - Target currency (e.g., 'usd')
 * @param params.from - From timestamp (UNIX)
 * @param params.to - To timestamp (UNIX)
 * @param params.precision - Decimal precision (default: 2)
 *
 * @returns Historical price, market cap, and volume data
 *
 * @example
 * ```typescript
 * const data = await getRangeContractCoinsMarketChart({
 *   id: 'ethereum',
 *   contract_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
 *   vs_currency: 'usd',
 *   from: 1609459200,
 *   to: 1612137600
 * });
 * ```
 */
export async function getRangeContractCoinsMarketChart(params: {
	id: string;
	contract_address: string;
	vs_currency: string;
	from: number;
	to: number;
	precision?: number | string;
}): Promise<any> {
	return executeTool("get_range_contract_coins_market_chart", params);
}
