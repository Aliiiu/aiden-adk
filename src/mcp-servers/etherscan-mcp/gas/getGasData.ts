import z from "zod";
import { callEtherscanApi } from "../shared.js";

export const GetGasDataInputSchema = z.object({
	action: z
		.enum(["eth_gasPrice", "gasestimate", "gasoracle"])
		.describe(
			"'eth_gasPrice' for current gas price, 'gasestimate' for transaction confirmation estimate, 'gasoracle' for safe/proposed/fast gas prices",
		),
	gasprice: z
		.number()
		.int()
		.optional()
		.describe(
			"The price paid per unit of gas, in wei (required for 'gasestimate')",
		),
});

export type GetGasDataInput = z.infer<typeof GetGasDataInputSchema>;

const GasPriceSchema = z.string();

const GasEstimateSchema = z.string();

const GasOracleSchema = z.object({
	LastBlock: z.string(),
	SafeGasPrice: z.string(),
	ProposeGasPrice: z.string(),
	FastGasPrice: z.string(),
	suggestBaseFee: z.string(),
	gasUsedRatio: z.string(),
});

const GasDataResponseSchema = z.union([
	GasPriceSchema,
	GasEstimateSchema,
	GasOracleSchema,
]);

export type GetGasDataResponse = z.infer<typeof GasDataResponseSchema>;

/**
 * Get data about gas prices and transaction confirmation on the Ethereum blockchain.
 *
 * Supports multiple operations:
 * - Get current gas price in wei
 * - Estimate transaction confirmation time based on gas price
 * - Get safe, proposed, and fast gas price recommendations
 *
 * @param params.action - Operation type:
 *   - 'eth_gasPrice': Get current gas price in wei
 *   - 'gasestimate': Get estimated confirmation time for a gas price
 *   - 'gasoracle': Get safe/proposed/fast gas price recommendations
 * @param params.gasprice - Gas price in wei (required for 'gasestimate')
 *
 * @returns Response varies by action type
 *
 * @example
 * ```typescript
 * // Get current gas price
 * const gasPrice = await getGasData({
 *   action: 'eth_gasPrice'
 * });
 * // Returns: "20000000000" (in wei)
 *
 * // Estimate confirmation time
 * const estimate = await getGasData({
 *   action: 'gasestimate',
 *   gasprice: 20000000000
 * });
 * // Returns: "30" (seconds)
 *
 * // Get gas oracle recommendations
 * const oracle = await getGasData({
 *   action: 'gasoracle'
 * });
 * // Returns: { LastBlock: '...', SafeGasPrice: '20', ProposeGasPrice: '25', FastGasPrice: '30', ... }
 * ```
 */
export async function getGasData(
	params: GetGasDataInput,
): Promise<GetGasDataResponse> {
	const { action, gasprice } = GetGasDataInputSchema.parse(params);

	const module = action === "gasoracle" ? "gastracker" : "proxy";

	return callEtherscanApi(
		{
			module,
			action,
			gasprice,
		},
		GasDataResponseSchema,
	);
}
