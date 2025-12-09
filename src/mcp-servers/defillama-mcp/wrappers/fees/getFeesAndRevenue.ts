import { z } from "zod";
import { executeServiceMethod } from "../../shared";

export const GetFeesAndRevenueInputSchema = z
	.object({
		excludeTotalDataChart: z
			.boolean()
			.optional()
			.describe("Exclude aggregated chart data from the response"),
		excludeTotalDataChartBreakdown: z
			.boolean()
			.optional()
			.describe("Exclude per-chain chart breakdown data"),
		dataType: z
			.enum(["dailyFees", "dailyRevenue", "dailyHoldersRevenue"])
			.optional()
			.describe("Metric to use for ranking and charts"),
		chain: z.string().optional().describe("Filter overview by specific chain"),
		protocol: z
			.string()
			.optional()
			.describe("Fetch summary for a specific protocol slug"),
		sortCondition: z
			.string()
			.optional()
			.describe("Field used to sort protocols (e.g., 'total24h')"),
		order: z
			.enum(["asc", "desc"])
			.optional()
			.describe("Sort order for the selected metric"),
	})
	.strict()
	.optional();

const FeesProtocolMetricsSchema = z.object({
	name: z.string().nullable().describe("Protocol name"),
	slug: z.string().nullable().describe("Protocol slug"),
	id: z.string().nullable().describe("Protocol identifier"),
	total24h: z.number().nullable().describe("Fees over last 24h"),
	total48hto24h: z.number().nullable().describe("Fees between 48h-24h ago"),
	total7d: z.number().nullable().describe("Fees in last 7 days"),
	total14dto7d: z.number().nullable().describe("Fees between 14-7 days ago"),
	total30d: z.number().nullable().describe("Fees in last 30 days"),
	total60dto30d: z.number().nullable().describe("Fees between 60-30 days ago"),
	total1y: z.number().nullable().describe("Fees over the last year"),
	totalAllTime: z.number().nullable().describe("Lifetime fees"),
	change_1d: z.number().nullable().describe("24h percentage change"),
	change_7d: z.number().nullable().describe("7d percentage change"),
	change_1m: z.number().nullable().describe("30d percentage change"),
});

const FeesOverviewSchema = z
	.object({
		protocols: z
			.array(z.record(z.string(), z.unknown()))
			.optional()
			.describe("Raw protocol list returned by DefiLlama"),
		totalDataChart: z.array(z.tuple([z.number(), z.number()])).optional(),
		totalDataChartBreakdown: z
			.array(
				z.tuple([
					z.number(),
					z.record(z.string(), z.record(z.string(), z.number())),
				]),
			)
			.optional(),
	})
	.loose()
	.describe("Full overview or summary response");

export const GetFeesAndRevenueResponseSchema = z.union([
	z.array(FeesProtocolMetricsSchema),
	FeesOverviewSchema,
]);

export type GetFeesAndRevenueInput = z.infer<
	typeof GetFeesAndRevenueInputSchema
>;
export type GetFeesAndRevenueResponse = z.infer<
	typeof GetFeesAndRevenueResponseSchema
>;

/**
 * Get protocol fee and revenue metrics (daily fees, protocol revenue, token holder revenue).
 *
 * Returns fee/revenue aggregates for protocol comparison. This is for analyzing protocol economics and revenue.
 *
 * **IMPORTANT**: Field meanings depend on dataType parameter:
 * - `dailyFees` → total24h/total7d represent fees paid by users
 * - `dailyRevenue` → total24h/total7d represent protocol revenue
 * - `dailyHoldersRevenue` → total24h/total7d represent revenue going to token holders
 *
 * @param input.dataType - Metric type: 'dailyFees', 'dailyRevenue', or 'dailyHoldersRevenue'
 * @param input.protocol - Optional protocol slug for specific protocol data
 * @param input.chain - Optional chain filter
 * @param input.sortCondition - Sort by: 'total24h', 'total7d', 'total30d', 'totalAllTime'
 * @param input.order - Sort order: 'desc' or 'asc'
 *
 * @returns Array of protocols with fee/revenue metrics (24h, 7d, 30d, 1y, allTime), percentage changes
 *
 * @example
 * ```typescript
 * const protocolFees = await getFeesAndRevenue({
 *   dataType: 'dailyRevenue',
 *   sortCondition: 'total24h'
 * });
 * // Returns: [{ name: 'Uniswap', total24h: 5000000, change_1d: 10.5 }, ...]
 * ```
 */
export async function getFeesAndRevenue(
	input?: GetFeesAndRevenueInput,
): Promise<GetFeesAndRevenueResponse> {
	return executeServiceMethod("fees", "getFeesAndRevenue", {
		excludeTotalDataChart: input?.excludeTotalDataChart ?? true,
		excludeTotalDataChartBreakdown:
			input?.excludeTotalDataChartBreakdown ?? true,
		dataType: input?.dataType ?? "dailyFees",
		sortCondition: input?.sortCondition ?? "total24h",
		order: input?.order ?? "desc",
		...(input?.chain ? { chain: input.chain } : {}),
		...(input?.protocol ? { protocol: input.protocol } : {}),
	}) as Promise<GetFeesAndRevenueResponse>;
}
