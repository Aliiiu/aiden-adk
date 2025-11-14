import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetPercentageCoinsInputSchema = z
	.object({
		coins: z
			.string()
			.describe(
				"Comma-separated coin identifiers (e.g., 'ethereum:0x...,bitcoin')",
			),
		period: z
			.string()
			.optional()
			.describe("Lookback period (e.g., '1d', '7d')"),
		lookForward: z
			.boolean()
			.optional()
			.describe("When true, look forward instead of backward"),
		timestamp: z
			.union([z.string(), z.number()])
			.optional()
			.describe("Reference timestamp for the percentage calculation"),
	})
	.strict();

export const GetPercentageCoinsResponseSchema = z.object({
	coins: z
		.record(z.string(), z.number())
		.describe("Percentage change per coin identifier"),
});

export type GetPercentageCoinsInput = z.infer<
	typeof GetPercentageCoinsInputSchema
>;
export type GetPercentageCoinsResponse = z.infer<
	typeof GetPercentageCoinsResponseSchema
>;

/**
 * Get percentage price changes for coins
 */
export async function getPercentageCoins(
	input: GetPercentageCoinsInput,
): Promise<GetPercentageCoinsResponse> {
	return executeServiceMethod(
		"price",
		"getPercentageCoins",
		input,
	) as Promise<GetPercentageCoinsResponse>;
}
