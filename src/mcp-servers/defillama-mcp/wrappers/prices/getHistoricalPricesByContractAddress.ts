import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetHistoricalPricesByContractAddressInputSchema = z
	.object({
		coins: z
			.string()
			.describe("Comma-separated coin identifiers (chain:address format)"),
		timestamp: z
			.union([z.string(), z.number()])
			.describe("Target timestamp (seconds, milliseconds, or ISO string)"),
		searchWidth: z
			.union([z.string(), z.number()])
			.optional()
			.describe("Search window width to find historical quotes"),
	})
	.strict();

const HistoricalCoinPriceSchema = z.object({
	decimals: z.number().describe("Token decimals"),
	price: z.number().describe("Price in USD"),
	symbol: z.string().describe("Token symbol"),
	timestamp: z.number().describe("Unix timestamp of price quote"),
	confidence: z.number().optional().describe("Confidence score"),
});

export const GetHistoricalPricesByContractAddressResponseSchema = z.object({
	coins: z
		.record(z.string(), HistoricalCoinPriceSchema)
		.describe("Historical prices mapped by coin identifier"),
});

export type GetHistoricalPricesByContractAddressInput = z.infer<
	typeof GetHistoricalPricesByContractAddressInputSchema
>;
export type GetHistoricalPricesByContractAddressResponse = z.infer<
	typeof GetHistoricalPricesByContractAddressResponseSchema
>;

/**
 * Get historical prices for coins by contract address
 */
export async function getHistoricalPricesByContractAddress(
	input: GetHistoricalPricesByContractAddressInput,
): Promise<GetHistoricalPricesByContractAddressResponse> {
	return executeServiceMethod(
		"price",
		"getHistoricalPricesByContractAddress",
		input,
	) as Promise<GetHistoricalPricesByContractAddressResponse>;
}
