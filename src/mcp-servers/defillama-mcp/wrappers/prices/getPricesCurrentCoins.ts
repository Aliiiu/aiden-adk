import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetPricesCurrentCoinsInputSchema = z
	.object({
		coins: z
			.string()
			.describe(
				"Comma-separated list of coin identifiers (e.g., 'ethereum:0x...,bitcoin')",
			),
		searchWidth: z
			.union([z.string(), z.number()])
			.optional()
			.describe("Search window width to find nearby price points"),
	})
	.strict();

const CurrentCoinPriceSchema = z.object({
	decimals: z.number().describe("Token decimals"),
	price: z.number().describe("Current price in USD"),
	symbol: z.string().describe("Token symbol"),
	timestamp: z.number().describe("Unix timestamp for price quote"),
	confidence: z.number().optional().describe("Price confidence score"),
});

export const GetPricesCurrentCoinsResponseSchema = z.object({
	coins: z
		.record(z.string(), CurrentCoinPriceSchema)
		.describe("Mapping of coin identifiers to price data"),
});

export type GetPricesCurrentCoinsInput = z.infer<
	typeof GetPricesCurrentCoinsInputSchema
>;
export type GetPricesCurrentCoinsResponse = z.infer<
	typeof GetPricesCurrentCoinsResponseSchema
>;

/**
 * Get current prices for coins
 */
export async function getPricesCurrentCoins(
	input: GetPricesCurrentCoinsInput,
): Promise<GetPricesCurrentCoinsResponse> {
	return executeServiceMethod(
		"price",
		"getPricesCurrentCoins",
		input,
	) as Promise<GetPricesCurrentCoinsResponse>;
}
