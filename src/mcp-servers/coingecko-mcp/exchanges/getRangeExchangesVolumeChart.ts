import { z } from "zod";
import { executeTool } from "../shared";

export const GetRangeExchangesVolumeChartInputSchema = z.object({
	id: z.string().describe("Exchange ID"),
	from: z.number().describe("Start timestamp (seconds)"),
	to: z.number().describe("End timestamp (seconds)"),
});

export const GetRangeExchangesVolumeChartResponseSchema = z
	.array(
		z.tuple([
			z.number().describe("Unix timestamp (ms)"),
			z.number().describe("Volume in BTC"),
		]),
	)
	.describe("Historical exchange volume datapoints");

export type GetRangeExchangesVolumeChartInput = z.infer<
	typeof GetRangeExchangesVolumeChartInputSchema
>;
export type GetRangeExchangesVolumeChartResponse = z.infer<
	typeof GetRangeExchangesVolumeChartResponseSchema
>;

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
export async function getRangeExchangesVolumeChart(
	params: GetRangeExchangesVolumeChartInput,
): Promise<GetRangeExchangesVolumeChartResponse> {
	return executeTool(
		"get_range_exchanges_volume_chart",
		params,
	) as Promise<GetRangeExchangesVolumeChartResponse>;
}
