import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetPricesFirstCoinsInputSchema = z.object({
	coins: z
		.string()
		.describe(
			"Comma-separated list of coin identifiers (e.g., 'ethereum:0x...,bitcoin')",
		),
});

const FirstCoinPriceSchema = z.object({
	price: z.number().describe("First recorded price in USD"),
	symbol: z.string().describe("Token symbol"),
	timestamp: z.number().describe("Unix timestamp of the first price record"),
});

export const GetPricesFirstCoinsResponseSchema = z.object({
	coins: z
		.record(z.string(), FirstCoinPriceSchema)
		.describe("Mapping of coin identifiers to their first known price"),
});

export type GetPricesFirstCoinsInput = z.infer<
	typeof GetPricesFirstCoinsInputSchema
>;
export type GetPricesFirstCoinsResponse = z.infer<
	typeof GetPricesFirstCoinsResponseSchema
>;

/**
 * Get first recorded prices for coins
 */
export async function getPricesFirstCoins(
	input: GetPricesFirstCoinsInput,
): Promise<GetPricesFirstCoinsResponse> {
	return executeServiceMethod(
		"price",
		"getPricesFirstCoins",
		input,
	) as Promise<GetPricesFirstCoinsResponse>;
}
