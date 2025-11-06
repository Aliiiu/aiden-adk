/**
 * Get exchange volume chart data within a time range
 */

import { executeTool } from "../shared.js";

/**
 * Get historical volume chart data for an exchange
 *
 * @param params.id - Exchange ID (e.g., 'binance')
 * @param params.from - From timestamp (UNIX)
 * @param params.to - To timestamp (UNIX)
 *
 * @returns Historical volume data
 *
 * @example
 * ```typescript
 * const volumeChart = await getRangeExchangesVolumeChart({
 *   id: 'binance',
 *   from: 1609459200,
 *   to: 1612137600
 * });
 * ```
 */
export async function getRangeExchangesVolumeChart(params: {
	id: string;
	from: number;
	to: number;
}): Promise<any> {
	return executeTool("get_range_exchanges_volume_chart", params);
}
