import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetProtocolsInputSchema = z
	.object({
		protocol: z
			.string()
			.optional()
			.describe("Optional protocol slug to fetch detailed data"),
		sortCondition: z
			.enum(["change_1h", "change_1d", "change_7d", "tvl"])
			.optional()
			.describe("Metric for ranking protocols"),
		order: z
			.enum(["asc", "desc"])
			.optional()
			.describe("Sort order for selected metric"),
	})
	.strict()
	.describe(
		"Accepts only the documented fields. Passing unknown fields (e.g., 'search') will throw a validation error.",
	);

const ProtocolDetailSchema = z.object({
	id: z.string().describe("Protocol identifier"),
	name: z.string().describe("Protocol name"),
	symbol: z.string().describe("Protocol token symbol"),
	category: z.string().describe("Primary category"),
	chains: z.array(z.string()).describe("Chains hosting the protocol"),
	tvl: z.number().describe("Total value locked"),
	chainTvls: z.record(z.string(), z.number()).optional(),
	change_1h: z.number().optional(),
	change_1d: z.number().optional(),
	change_7d: z.number().optional(),
	currentChainTvls: z.record(z.string(), z.number()).optional(),
	mcap: z.number().optional(),
});

const ProtocolSummarySchema = z.object({
	name: z.string().describe("Protocol name"),
	symbol: z.string().describe("Protocol symbol"),
	tvl: z.number().describe("Total value locked"),
	chainTvls: z.record(z.string(), z.number()).optional(),
	change_1h: z.number().optional(),
	change_1d: z.number().optional(),
	change_7d: z.number().optional(),
	currentChainTvls: z.record(z.string(), z.number()).optional(),
});

export const GetProtocolsResponseSchema = z.union([
	ProtocolDetailSchema,
	z.array(ProtocolSummarySchema),
]);

export type GetProtocolsInput = z.infer<typeof GetProtocolsInputSchema>;
export type GetProtocolsResponse = z.infer<typeof GetProtocolsResponseSchema>;

/**
 * Get DeFi protocol data with TVL metrics and rankings.
 *
 * Fetch specific protocol details or rank all protocols by total value locked (TVL) and TVL changes over time.
 *
 * @param input.protocol - Optional protocol slug for detailed data (e.g., "aave", "uniswap")
 * @param input.sortCondition - Ranking metric: "tvl", "change_1h", "change_1d", "change_7d"
 * @param input.order - Sort order: "desc" (descending) or "asc" (ascending)
 *
 * @returns Protocol data including TVL, hourly/daily/weekly changes, chains, category
 *
 * NOTE: Only documented parameters are supported. Do not pass ad-hoc fields like `search`.
 */
export async function getProtocols(
	input: GetProtocolsInput,
): Promise<GetProtocolsResponse> {
	return executeServiceMethod("protocol", "getProtocolData", {
		sortCondition: input.sortCondition ?? "tvl",
		order: input.order ?? "desc",
		...(input.protocol ? { protocol: input.protocol } : {}),
	}) as Promise<GetProtocolsResponse>;
}
