import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetStableCoinInputSchema = z
	.object({
		includePrices: z
			.boolean()
			.optional()
			.describe("Include latest prices for each stablecoin"),
	})
	.optional();

const StablecoinCirculatingSchema = z.object({
	peggedUSD: z.number().describe("Circulating supply in USD"),
});

const StablecoinOverviewSchema = z.object({
	id: z.string().describe("Stablecoin identifier"),
	name: z.string().describe("Stablecoin name"),
	symbol: z.string().describe("Ticker symbol"),
	circulating: StablecoinCirculatingSchema,
	circulatingPrevDay: z.record(z.string(), z.number()).optional(),
	circulatingPrevWeek: z.record(z.string(), z.number()).optional(),
	circulatingPrevMonth: z.record(z.string(), z.number()).optional(),
	price: z.number().optional().describe("Latest price if requested"),
});

export const GetStableCoinResponseSchema = z
	.array(StablecoinOverviewSchema)
	.describe("Top stablecoins ranked by circulating supply");

export type GetStableCoinInput = z.infer<typeof GetStableCoinInputSchema>;
export type GetStableCoinResponse = z.infer<typeof GetStableCoinResponseSchema>;

/**
 * Get stablecoin overview data
 */
export async function getStableCoin(
	input?: GetStableCoinInput,
): Promise<GetStableCoinResponse> {
	return executeServiceMethod("stablecoin", "getStableCoin", {
		includePrices: input?.includePrices ?? false,
	}) as Promise<GetStableCoinResponse>;
}
