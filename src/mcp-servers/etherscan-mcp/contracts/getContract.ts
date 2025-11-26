import z from "zod";
import { callEtherscanApi } from "../shared.js";

export const GetContractInputSchema = z.object({
	action: z
		.enum(["getabi", "getsourcecode", "getcontractcreation"])
		.describe(
			"'getabi' for contract ABI, 'getsourcecode' for source code, 'getcontractcreation' for creator address and tx hash",
		),
	chainid: z.string().optional().default("1").describe("The chain ID to query"),
	address: z
		.string()
		.describe(
			"Contract address or comma-separated list of contract addresses (up to 5 for getcontractcreation)",
		),
});

export type GetContractInput = z.infer<typeof GetContractInputSchema>;

const ContractABISchema = z.string();

const ContractSourceCodeSchema = z.array(
	z.object({
		SourceCode: z.string(),
		ABI: z.string(),
		ContractName: z.string(),
		CompilerVersion: z.string(),
		OptimizationUsed: z.string(),
		Runs: z.string(),
		ConstructorArguments: z.string(),
		EVMVersion: z.string(),
		Library: z.string(),
		LicenseType: z.string(),
		Proxy: z.string(),
		Implementation: z.string().optional(),
		SwarmSource: z.string(),
	}),
);

const ContractCreationSchema = z.array(
	z.object({
		contractAddress: z.string(),
		contractCreator: z.string(),
		txHash: z.string(),
	}),
);

const ContractResponseSchema = z.union([
	ContractABISchema,
	ContractSourceCodeSchema,
	ContractCreationSchema,
]);

export type GetContractResponse = z.infer<typeof ContractResponseSchema>;

/**
 * Get data from a verified smart contract.
 *
 * Supports multiple operations:
 * - Get contract ABI (Application Binary Interface) as JSON
 * - Get verified contract source code
 * - Get contract creator address and creation transaction hash (up to 5 contracts)
 *
 * Note: Contract addresses are typically 42 characters (0x + 40 hex chars).
 * When requesting contract creator info, assume the address given is the contract address.
 *
 * @param params.action - Operation type:
 *   - 'getabi': Get contract ABI as JSON
 *   - 'getsourcecode': Get verified source code
 *   - 'getcontractcreation': Get creator address and tx hash
 * @param params.address - Contract address or comma-separated list (up to 5 for getcontractcreation)
 *
 * @returns Response varies by action type
 *
 * @example
 * ```typescript
 * // Get contract ABI
 * const abi = await getContract({
 *   action: 'getabi',
 *   address: '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413'
 * });
 * // Returns: "[{\"constant\":true,\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"type\":\"function\"},...]"
 *
 * // Get contract source code
 * const source = await getContract({
 *   action: 'getsourcecode',
 *   address: '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413'
 * });
 * // Returns: [{ SourceCode: '...', ContractName: 'Token', ... }]
 *
 * // Get contract creator
 * const creator = await getContract({
 *   action: 'getcontractcreation',
 *   address: '0xB83c27805aAcA5C7082eB45C868d955Af04C337F'
 * });
 * // Returns: [{ contractAddress: '0x...', contractCreator: '0x...', txHash: '0x...' }]
 *
 * // Get multiple contract creators
 * const creators = await getContract({
 *   action: 'getcontractcreation',
 *   address: '0xB83c27805aAcA5C7082eB45C868d955Af04C337F,0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'
 * });
 * ```
 */
export async function getContract(
	params: GetContractInput,
): Promise<GetContractResponse> {
	const { action, address } = GetContractInputSchema.parse(params);

	return callEtherscanApi(
		{
			module: "contract",
			action,
			address,
		},
		ContractResponseSchema,
	);
}
