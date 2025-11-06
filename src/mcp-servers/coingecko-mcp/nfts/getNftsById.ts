/**
 * Get current data for an NFT collection
 */

import { executeTool } from "../shared.js";

/**
 * Get current data for an NFT collection by ID
 *
 * @param params.id - NFT collection ID
 *
 * @returns Detailed NFT collection data including floor price, volume, attributes
 *
 * @example
 * ```typescript
 * const collection = await getNftsById({
 *   id: 'cryptopunks'
 * });
 * ```
 */
export async function getNftsById(params: { id: string }): Promise<any> {
	return executeTool("get_id_nfts", params);
}
