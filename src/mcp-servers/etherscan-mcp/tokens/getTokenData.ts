import z from "zod";
import { getChainsDescription } from "../enums/chains.js";
import { getTokensDescription } from "../enums/tokens.js";
import { callEtherscanApi } from "../shared.js";

export const GetTokenDataInputSchema = z.object({
	action: z
		.enum(["tokensupply", "tokenbalance"])
		.describe(
			"'tokensupply' for total ERC-20 token supply, 'tokenbalance' for ERC-20 token balance of an address",
		),
	chainid: z
		.string()
		.optional()
		.default("1")
		.describe(
			`The chain ID to query. Available chains: ${getChainsDescription()}`,
		),
	contractaddress: z
		.string()
		.describe(
			`The contract address of the ERC-20 token. You can provide a contract address or use a popular token symbol. Popular tokens on Ethereum (chainid=1): ${getTokensDescription()}`,
		),
	address: z
		.string()
		.optional()
		.describe(
			"The address to check for token balance (required for 'tokenbalance')",
		),
	tag: z
		.enum(["latest", "pending", "earliest"])
		.optional()
		.default("latest")
		.describe(
			"The state of the blockchain: 'latest' (default), 'pending', or 'earliest'",
		),
});

export type GetTokenDataInput = z.infer<typeof GetTokenDataInputSchema>;

const TokenDataResponseSchema = z.string();

export type GetTokenDataResponse = z.infer<typeof TokenDataResponseSchema>;

/**
 * Get data about tokens on the Ethereum blockchain.
 *
 * Supports multiple operations:
 * - Get total supply of an ERC-20 token in circulation
 * - Get ERC-20 token balance for a specific address
 *
 * @param params.action - Operation type:
 *   - 'tokensupply': Get total supply of ERC-20 token
 *   - 'tokenbalance': Get token balance for an address
 * @param params.contractaddress - ERC-20 token contract address
 * @param params.address - Address to check token balance (required for 'tokenbalance')
 * @param params.tag - Blockchain state: 'latest' (default), 'pending', or 'earliest'
 *
 * @returns Token amount as string (in smallest unit, considering token decimals)
 *
 * @example
 * ```typescript
 * // Get total token supply
 * const supply = await getTokenData({
 *   action: 'tokensupply',
 *   contractaddress: '0x57d90b64a1a57749b0f932f1a3395792e12e7055'
 * });
 * // Returns: "21265524714464"
 *
 * // Get token balance for an address
 * const balance = await getTokenData({
 *   action: 'tokenbalance',
 *   contractaddress: '0x57d90b64a1a57749b0f932f1a3395792e12e7055',
 *   address: '0xe04f27eb70e025b78871a2ad7eabe85e61212761',
 *   tag: 'latest'
 * });
 * // Returns: "135499"
 * ```
 */
export async function getTokenData(
	params: GetTokenDataInput,
): Promise<GetTokenDataResponse> {
	const validated = GetTokenDataInputSchema.parse(params);
	const { action, contractaddress, address, tag, chainid } = validated;

	// Validate that address is provided for tokenbalance
	if (action === "tokenbalance" && !address) {
		throw new Error("address is required for tokenbalance action");
	}

	// Etherscan uses different modules per action:
	// - tokensupply -> stats
	// - tokenbalance -> account
	const module = action === "tokensupply" ? "stats" : "account";

	return callEtherscanApi(
		{
			module,
			action,
			contractaddress,
			address,
			tag,
			chainid,
		},
		TokenDataResponseSchema,
	);
}
