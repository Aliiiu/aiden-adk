import { z } from "zod";
import { executeServiceMethod } from "../../shared";

export const GetOptionsDataInputSchema = z
	.object({
		sortCondition: z
			.string()
			.optional()
			.describe("Metric used to sort options protocols (e.g., 'total24h')"),
		order: z
			.enum(["asc", "desc"])
			.optional()
			.describe("Sort order for the chosen metric"),
		dataType: z
			.string()
			.optional()
			.describe("Data field to aggregate (e.g., 'dailyNotionalVolume')"),
		chain: z.string().optional().describe("Filter overview by chain"),
		protocol: z
			.string()
			.optional()
			.describe("Return summary for a specific options protocol"),
		excludeTotalDataChart: z
			.boolean()
			.optional()
			.describe("Exclude overall chart data from response"),
		excludeTotalDataChartBreakdown: z
			.boolean()
			.optional()
			.describe("Exclude per-chain chart breakdown data"),
	})
	.strict()
	.optional();

const OptionsProtocolSchema = z.object({
	name: z.string().nullable().describe("Protocol name"),
	displayName: z.string().nullable().describe("Human-friendly name"),
	disabled: z.boolean().nullable().describe("Whether protocol is disabled"),
	total24h: z.number().nullable().describe("Notional volume over last 24h"),
	total7d: z.number().nullable().describe("Notional volume over last 7d"),
	total30d: z.number().nullable().describe("Notional volume over last 30d"),
	change_1d: z.number().nullable().describe("24h change percentage"),
	change_7d: z.number().nullable().describe("7d change percentage"),
	change_1m: z.number().nullable().describe("30d change percentage"),
	totalDataChart: z
		.array(z.record(z.string(), z.unknown()))
		.optional()
		.describe("Chart data points"),
});

const OptionsOverviewSchema = z
	.object({
		protocols: z.array(z.record(z.string(), z.unknown())).optional(),
		totalDataChart: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

export const GetOptionsDataResponseSchema = z.union([
	z.array(OptionsProtocolSchema),
	OptionsOverviewSchema,
]);

export type GetOptionsDataInput = z.infer<typeof GetOptionsDataInputSchema>;
export type GetOptionsDataResponse = z.infer<
	typeof GetOptionsDataResponseSchema
>;

/**
 * Get options protocol trading volume metrics (notional volume for options contracts).
 *
 * Returns options trading volumes across protocols. This is for analyzing options trading activity.
 *
 * Returns ALL protocols when no protocol parameter provided. Can filter by specific protocol using protocol param.
 *
 * @param input.protocol - Specific protocol slug for individual protocol data (e.g., 'binance-cex', 'bybit', 'deribit')
 * @param input.chain - Optional chain filter
 * @param input.dataType - Data metric: 'dailyNotionalVolume', 'dailyPremiumVolume' (default: 'dailyNotionalVolume')
 * @param input.sortCondition - Sort by: 'total24h', 'total7d', 'total30d'
 * @param input.order - Sort order: 'desc' or 'asc'
 *
 * @returns Array of all options protocols (sorted) OR single protocol data (when protocol param provided)
 *
 * @example
 * ```typescript
 * // Get all options protocols sorted by 24h volume
 * const allOptions = await getOptionsData({ sortCondition: 'total24h' });
 * // Returns: [{ displayName: 'Deribit', total24h: 5000000000, change_1d: 15.2 }, ...]
 *
 * // Get specific protocol (Binance)
 * const binanceData = await getOptionsData({ protocol: 'binance-cex' });
 * // Returns: { name: 'binance-cex', displayName: 'Binance', total24h: 123456, ... }
 * ```
 */
export async function getOptionsData(
	input?: GetOptionsDataInput,
): Promise<GetOptionsDataResponse> {
	return executeServiceMethod("options", "getOptionsData", {
		sortCondition: input?.sortCondition ?? "total24h",
		order: input?.order ?? "desc",
		dataType: input?.dataType ?? "dailyNotionalVolume",
		excludeTotalDataChart: input?.excludeTotalDataChart ?? true,
		excludeTotalDataChartBreakdown:
			input?.excludeTotalDataChartBreakdown ?? true,
		...(input?.chain ? { chain: input.chain } : {}),
		...(input?.protocol ? { protocol: input.protocol } : {}),
	}) as Promise<GetOptionsDataResponse>;
}
