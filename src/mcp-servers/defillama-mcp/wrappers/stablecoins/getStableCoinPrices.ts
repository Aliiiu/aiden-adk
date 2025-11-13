import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

const StablecoinPricePointSchema = z.object({
	date: z.number().describe("Unix timestamp"),
	prices: z
		.record(z.string(), z.number())
		.describe("Mapping of stablecoin id to price in USD"),
});

export const GetStableCoinPricesResponseSchema = z
	.array(StablecoinPricePointSchema)
	.describe("Historical stablecoin price snapshots");

export type GetStableCoinPricesResponse = z.infer<
	typeof GetStableCoinPricesResponseSchema
>;

/**
 * Get historical stablecoin price data
 */
export async function getStableCoinPrices(): Promise<GetStableCoinPricesResponse> {
	return executeServiceMethod(
		"stablecoin",
		"getStableCoinPrices",
		{},
	) as Promise<GetStableCoinPricesResponse>;
}
