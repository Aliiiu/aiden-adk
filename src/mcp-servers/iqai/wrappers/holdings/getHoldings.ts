import z from "zod";
import { callIqAiApi } from "../../../iqai/make-iq-ai-request.js";

export type GetHoldingsInput = {
	address: string;
	chainId?: string | number;
};

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
	const { address, chainId = "252" } = params;

	return callIqAiApi("/api/holdings", { address, chainId }, holdingsSchema);
}
