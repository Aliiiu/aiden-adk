import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetProtocolInformationInputSchema = z
	.object({
		id: z.string().describe("Protocol identifier (e.g., 'uniswap')"),
	})
	.strict();

const ProtocolInformationSchema = z.object({
	id: z.string().describe("Protocol identifier"),
	chain: z.string().describe("Chain ID where the protocol is deployed"),
	name: z.string().describe("Protocol display name"),
	logo_url: z.string().url().describe("URL to protocol logo"),
	site_url: z.string().url().describe("Protocol official website"),
	has_supported_portfolio: z
		.boolean()
		.describe("Whether portfolio tracking is supported"),
	tvl: z.number().describe("Total value locked in USD"),
});

export const GetProtocolInformationResponseSchema = ProtocolInformationSchema;

export type GetProtocolInformationInput = z.infer<
	typeof GetProtocolInformationInputSchema
>;
export type GetProtocolInformationResponse = z.infer<
	typeof GetProtocolInformationResponseSchema
>;

/**
 * Get detailed information about a specific DeFi protocol by its identifier.
 *
 * Returns protocol metadata and current TVL. This is for looking up a specific protocol's details.
 * For protocol TVL rankings and changes, use DefiLlama getProtocols.
 * For user-specific positions in a protocol, use getUserComplexProtocolList.
 * For yield pool data with APY, use DefiLlama getLatestPoolData.
 *
 * @param input.id - Protocol identifier (e.g., 'uniswap', 'aave', 'bsc_pancakeswap')
 *
 * @returns Protocol details: name, chain, current TVL, logo, website, portfolio support
 *
 * @example
 * ```typescript
 * const protocol = await getProtocolInformation({ id: 'uniswap' });
 * console.log(protocol.tvl); // Current total value locked
 * ```
 */
export async function getProtocolInformation(
	input: GetProtocolInformationInput,
): Promise<GetProtocolInformationResponse> {
	return executeServiceMethod(
		"protocol",
		"getProtocolInformation",
		input,
	) as Promise<GetProtocolInformationResponse>;
}
