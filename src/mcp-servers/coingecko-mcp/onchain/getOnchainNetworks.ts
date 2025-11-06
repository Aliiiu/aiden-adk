/**
 * Get list of all supported onchain networks/blockchains
 */

import { executeTool } from "../shared.js";

/**
 * Get list of all supported onchain networks
 *
 * @returns List of blockchain networks with IDs and names
 *
 * @example
 * ```typescript
 * const networks = await getOnchainNetworks();
 * ```
 */
export async function getOnchainNetworks(): Promise<any> {
	return executeTool("get_onchain_networks", {});
}
