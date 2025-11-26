import z from "zod";
import { callEtherscanApi } from "../shared.js";

export const GetAddressBalanceInputSchema = z.object({
	address: z
		.string()
		.describe(
			"The string(s) representing the addresses to check for balance, separated by ',' up to 20 addresses per call",
		),
	chainid: z.string().optional().default("1").describe("The chain ID to query"),
	tag: z
		.enum(["latest", "pending", "earliest"])
		.optional()
		.default("latest")
		.describe(
			"The state of the blockchain you want to retrieve the balance from. 'latest' for the current balance including confirmed transactions, 'pending' to include unconfirmed transactions for a future balance view, and 'earliest' for the genesis block balance, typically zero.",
		),
});

export type GetAddressBalanceInput = z.infer<
	typeof GetAddressBalanceInputSchema
>;

const SingleBalanceSchema = z.string();

const MultiBalanceSchema = z.array(
	z.object({
		account: z.string(),
		balance: z.string(),
	}),
);

const AddressBalanceResponseSchema = z.union([
	SingleBalanceSchema,
	MultiBalanceSchema,
]);

export type GetAddressBalanceResponse = z.infer<
	typeof AddressBalanceResponseSchema
>;

/**
 * Get the balance of a wallet address or multiple wallet addresses.
 *
 * Returns the Ether balance in wei for one or more Ethereum addresses.
 * Supports checking up to 20 addresses in a single call.
 *
 * @param params.address - Address(es) to check balance for (comma-separated for multiple, up to 20)
 * @param params.tag - Blockchain state: 'latest' (default), 'pending', or 'earliest'
 *
 * @returns For single address: balance string in wei
 *          For multiple addresses: array of { account, balance } objects
 *
 * @example
 * ```typescript
 * // Single address
 * const balance = await getAddressBalance({
 *   address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
 * });
 * // Returns: "40891626854930000000000"
 *
 * // Multiple addresses
 * const balances = await getAddressBalance({
 *   address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a'
 * });
 * // Returns: [{ account: '0x742d...', balance: '...' }, { account: '0xddbd...', balance: '...' }]
 * ```
 */
export async function getAddressBalance(
	params: GetAddressBalanceInput,
): Promise<GetAddressBalanceResponse> {
	const { address, tag, chainid } = GetAddressBalanceInputSchema.parse(params);

	const isMultiple = address.includes(",");
	const action = isMultiple ? "balancemulti" : "balance";

	return callEtherscanApi(
		{
			module: "account",
			action,
			address,
			chainid,
			tag,
		},
		AddressBalanceResponseSchema,
	);
}
