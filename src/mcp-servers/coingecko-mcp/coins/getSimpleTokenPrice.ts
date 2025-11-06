/**
 * Get simple token price by contract address
 */

import { executeTool } from "../shared.js";

/**
 * Get simple token price by contract address
 *
 * @param params.id - Platform ID (e.g., 'ethereum', 'binance-smart-chain')
 * @param params.contract_addresses - Comma-separated contract addresses
 * @param params.vs_currencies - Comma-separated target currencies (default: 'usd')
 * @param params.include_market_cap - Include market cap (default: false)
 * @param params.include_24hr_vol - Include 24h volume (default: false)
 * @param params.include_24hr_change - Include 24h change (default: false)
 * @param params.include_last_updated_at - Include last updated timestamp (default: false)
 *
 * @returns Token prices
 *
 * @example
 * ```typescript
 * const price = await getSimpleTokenPrice({
 *   id: 'ethereum',
 *   contract_addresses: '0x...',
 *   vs_currencies: 'usd',
 *   include_24hr_change: true
 * });
 * ```
 */
export async function getSimpleTokenPrice(params: {
	id: string;
	contract_addresses: string;
	vs_currencies?: string;
	include_market_cap?: boolean | string;
	include_24hr_vol?: boolean | string;
	include_24hr_change?: boolean | string;
	include_last_updated_at?: boolean | string;
}): Promise<any> {
	return executeTool("get_id_simple_token_price", params);
}
