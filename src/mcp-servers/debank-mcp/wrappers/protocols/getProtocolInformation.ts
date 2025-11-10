/**
 * Get detailed information about a specific protocol
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Fetch detailed information about a specific DeFi protocol
 *
 * @param params.id - Protocol ID (e.g., 'uniswap', 'aave', 'bsc_pancakeswap')
 *
 * @returns Protocol details including TVL, chain, name, logo, and site URL
 *
 * @example
 * ```typescript
 * const protocol = await getProtocolInformation({ id: 'uniswap' });
 * console.log(protocol);
 * ```
 */
export async function getProtocolInformation(params: {
	id: string;
}): Promise<any> {
	return executeServiceMethod("protocol", "getProtocolInformation", params);
}
