import { z } from "zod";
import { executeTool } from "../shared";

const GlobalMarketStatsSchema = z.object({
	active_cryptocurrencies: z.number().optional(),
	upcoming_icos: z.number().optional(),
	ongoing_icos: z.number().optional(),
	ended_icos: z.number().optional(),
	markets: z.number().optional(),
	total_market_cap: z.record(z.string(), z.number()),
	total_volume: z.record(z.string(), z.number()),
	market_cap_percentage: z.record(z.string(), z.number()).optional(),
	market_cap_change_percentage_24h_usd: z.number().optional(),
	updated_at: z.number().optional(),
});

export const GetGlobalResponseSchema = z.object({
	data: GlobalMarketStatsSchema,
});

export type GetGlobalResponse = z.infer<typeof GetGlobalResponseSchema>;

/**
 * Get global cryptocurrency market statistics (market cap, volume, dominance).
 *
 * @returns Global market data including total market cap, volume, and dominance metrics.
 *
 * @example
 * ```typescript
 * const global = await getGlobal();
 * console.log(global.data.total_market_cap.usd);
 * ```
 */
export async function getGlobal(): Promise<GetGlobalResponse> {
	return executeTool("get_global", {}) as Promise<GetGlobalResponse>;
}
