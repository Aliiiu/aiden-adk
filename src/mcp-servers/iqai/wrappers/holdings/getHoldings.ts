import z from "zod";
import { callIqAiApi } from "../../../iqai/make-iq-ai-request";

export const GetHoldingsInputSchema = z.object({
	address: z.string().describe("Wallet address on IQ chain"),
	chainId: z
		.union([z.string(), z.number()])
		.optional()
		.describe("Chain ID (default: 252 for IQ chain)"),
});

export type GetHoldingsInput = z.infer<typeof GetHoldingsInputSchema>;

const holdingsSchema = z
	.object({
		count: z.number(),
		holdings: z.array(
			z.object({
				tokenContract: z.string(),
				tokenAmount: z.string(),
				name: z.string(),
				currentPriceInUsd: z.number(),
			}),
		),
	})
	.loose();

export type GetHoldingsResponse = z.infer<typeof holdingsSchema>;

/**
 * Get IQ AI token holdings for a wallet with token amounts and USD values.
 */
export async function getHoldings(
	params: GetHoldingsInput,
): Promise<GetHoldingsResponse> {
	const { address, chainId = "252" } = GetHoldingsInputSchema.parse(params);

	return callIqAiApi("/api/holdings", { address, chainId }, holdingsSchema);
}
