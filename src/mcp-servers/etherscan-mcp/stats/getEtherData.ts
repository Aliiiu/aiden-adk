import z from "zod";
import { callEtherscanApi } from "../shared.js";

export const GetEtherDataInputSchema = z.object({
	action: z
		.enum(["ethsupply", "ethsupply2", "ethprice", "nodecount"])
		.describe(
			"'ethsupply' for basic Ether supply, 'ethsupply2' for detailed supply with staking/burnt fees, 'ethprice' for latest ETH price, 'nodecount' for discoverable node count",
		),
});

export type GetEtherDataInput = z.infer<typeof GetEtherDataInputSchema>;

// Basic Ether supply (single string)
const EtherSupplySchema = z.string();

// Detailed Ether supply with ETH2 staking, burnt fees, and withdrawals
const EtherSupply2Schema = z.object({
	EthSupply: z.string(),
	Eth2Staking: z.string(),
	BurntFees: z.string(),
	WithdrawnTotal: z.string(),
});

const EtherPriceSchema = z.object({
	ethbtc: z.string(),
	ethbtc_timestamp: z.string(),
	ethusd: z.string(),
	ethusd_timestamp: z.string(),
});

const NodeCountSchema = z.object({
	UTCDate: z.string(),
	TotalNodeCount: z.string(),
});

const EtherDataResponseSchema = z.union([
	EtherSupplySchema,
	EtherSupply2Schema,
	EtherPriceSchema,
	NodeCountSchema,
]);

export type GetEtherDataResponse = z.infer<typeof EtherDataResponseSchema>;

/**
 * Get data and statistics about Ether on the Ethereum blockchain.
 *
 * Supports multiple operations:
 * - Get total Ether supply (excluding ETH2 staking and burnt fees)
 * - Get detailed Ether supply (including ETH2 staking, burnt fees, withdrawals)
 * - Get latest ETH price in BTC and USD
 * - Get total number of discoverable Ethereum nodes
 *
 * @param params.action - Operation type:
 *   - 'ethsupply': Total Ether supply excluding ETH2 staking and burnt fees
 *   - 'ethsupply2': Total supply including ETH2 staking, burnt fees, and withdrawals
 *   - 'ethprice': Latest ETH price in BTC and USD
 *   - 'nodecount': Total number of discoverable Ethereum nodes
 *
 * @returns Response varies by action type
 *
 * @example
 * ```typescript
 * // Get basic Ether supply
 * const supply = await getEtherData({
 *   action: 'ethsupply'
 * });
 * // Returns: "120373572948577040725248580" (in wei)
 *
 * // Get detailed Ether supply
 * const detailedSupply = await getEtherData({
 *   action: 'ethsupply2'
 * });
 * // Returns: { EthSupply: '...', Eth2Staking: '...', BurntFees: '...', WithdrawnTotal: '...' }
 *
 * // Get latest ETH price
 * const price = await getEtherData({
 *   action: 'ethprice'
 * });
 * // Returns: { ethbtc: '0.03', ethbtc_timestamp: '...', ethusd: '2000', ethusd_timestamp: '...' }
 *
 * // Get node count
 * const nodes = await getEtherData({
 *   action: 'nodecount'
 * });
 * // Returns: { UTCDate: '2023-10-30', TotalNodeCount: '6000' }
 * ```
 */
export async function getEtherData(
	params: GetEtherDataInput,
): Promise<GetEtherDataResponse> {
	const { action } = GetEtherDataInputSchema.parse(params);

	return callEtherscanApi(
		{
			module: "stats",
			action,
		},
		EtherDataResponseSchema,
	);
}
