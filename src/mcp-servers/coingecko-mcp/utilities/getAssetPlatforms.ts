/**
 * Get list of available asset platforms (blockchains)
 */

import { executeTool } from "../shared.js";

/**
 * Get list of available asset platforms (blockchains)
 *
 * @param params.filter - Filter: all, nft (optional)
 *
 * @returns Array of asset platforms
 *
 * @example
 * ```typescript
 * const platforms = await getAssetPlatforms();
 * ```
 */
export async function getAssetPlatforms(params?: {
	filter?: string;
}): Promise<any> {
	return executeTool("get_asset_platforms", params || {});
}
