import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetDexsDataInputSchema = z
	.object({
		excludeTotalDataChart: z
			.boolean()
			.optional()
			.describe("Exclude aggregated total data chart from response"),
		excludeTotalDataChartBreakdown: z
			.boolean()
			.optional()
			.describe("Exclude per-chain chart breakdown"),
		chain: z.string().optional().describe("Filter by specific chain"),
		protocol: z
			.string()
			.optional()
			.describe("Fetch a single DEX protocol summary"),
		sortCondition: z
			.string()
			.optional()
			.describe("Metric used to sort protocols (e.g., 'total24h')"),
		order: z
			.enum(["asc", "desc"])
			.optional()
			.describe("Sort order for protocol ranking"),
	})
	.strict()
	.optional();

const DexProtocolMetricsSchema = z.object({
	displayName: z.string().nullable().describe("Protocol display name"),
	breakdown24h: z
		.record(z.string(), z.number())
		.optional()
		.describe("24h volume per chain"),
	dailyVolume: z.number().nullable().describe("Daily volume in USD"),
	total24h: z.number().nullable().describe("24h volume in USD"),
	total7d: z.number().nullable().describe("7d volume in USD"),
	total30d: z.number().nullable().describe("30d volume in USD"),
	change_1d: z.number().nullable().describe("24h change percentage"),
	change_7d: z.number().nullable().describe("7d change percentage"),
	change_1m: z.number().nullable().describe("30d change percentage"),
});

const DexOverviewSchema = z
	.object({
		protocols: z.array(z.record(z.string(), z.unknown())).optional(),
		totalDataChart: z.array(z.tuple([z.number(), z.number()])).optional(),
		totalDataChartBreakdown: z
			.array(z.tuple([z.number(), z.record(z.string(), z.number())]))
			.optional(),
	})
	.loose()
	.describe("Raw DEX overview/summary response");

export const GetDexsDataResponseSchema = z.union([
	z.array(DexProtocolMetricsSchema),
	DexOverviewSchema,
]);

export type GetDexsDataInput = z.infer<typeof GetDexsDataInputSchema>;
export type GetDexsDataResponse = z.infer<typeof GetDexsDataResponseSchema>;

/**
 * Get decentralized exchange volume data
 */
export async function getDexsData(
	input?: GetDexsDataInput,
): Promise<GetDexsDataResponse> {
	return executeServiceMethod("dex", "getDexsData", {
		excludeTotalDataChart: input?.excludeTotalDataChart ?? true,
		excludeTotalDataChartBreakdown:
			input?.excludeTotalDataChartBreakdown ?? true,
		sortCondition: input?.sortCondition ?? "total24h",
		order: input?.order ?? "desc",
		...(input?.chain ? { chain: input.chain } : {}),
		...(input?.protocol ? { protocol: input.protocol } : {}),
	}) as Promise<GetDexsDataResponse>;
}
