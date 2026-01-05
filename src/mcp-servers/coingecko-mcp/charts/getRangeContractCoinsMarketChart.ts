import { z } from "zod";
import { executeTool } from "../shared";

export const GetRangeContractCoinsMarketChartInputSchema = z.object({
	id: z.string().describe("Asset platform ID (e.g., 'ethereum')"),
	contract_address: z.string().describe("Token contract address"),
	vs_currency: z.string().describe("Target currency (e.g., 'usd')"),
	from: z.number().describe("Start timestamp in seconds"),
	to: z.number().describe("End timestamp in seconds"),
	precision: z
		.union([z.number(), z.string()])
		.optional()
		.describe("Optional decimal precision"),
});

const ValuePointSchema = z.tuple([
	z.number().describe("Unix timestamp in milliseconds"),
	z.number().describe("Value at timestamp"),
]);

export const GetRangeContractCoinsMarketChartResponseSchema = z.object({
	prices: z.array(ValuePointSchema),
	market_caps: z.array(ValuePointSchema),
	total_volumes: z.array(ValuePointSchema),
});

export type GetRangeContractCoinsMarketChartInput = z.infer<
	typeof GetRangeContractCoinsMarketChartInputSchema
>;
export type GetRangeContractCoinsMarketChartResponse = z.infer<
	typeof GetRangeContractCoinsMarketChartResponseSchema
>;

/**
 * Get historical market chart (prices, market caps, volumes) for a token by contract address
 *
 * Use this for contract-specific time-series analysis between two UNIX timestamps.
 *
 * @param params.id - Asset platform ID (e.g., 'ethereum')
 * @param params.contract_address - Token contract address
 * @param params.vs_currency - Target currency (e.g., 'usd')
 * @param params.from - From timestamp (UNIX)
 * @param params.to - To timestamp (UNIX)
 * @param params.precision - Decimal precision (default: 2)
 *
 * @returns Historical price, market cap, and volume data
 *
 * @example
 * ```typescript
 * const data = await getRangeContractCoinsMarketChart({
 *   id: 'ethereum',
 *   contract_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
 *   vs_currency: 'usd',
 *   from: 1609459200,
 *   to: 1612137600
 * });
 * ```
 */
export async function getRangeContractCoinsMarketChart(
	params: GetRangeContractCoinsMarketChartInput,
): Promise<GetRangeContractCoinsMarketChartResponse> {
	return executeTool(
		"get_range_contract_coins_market_chart",
		params,
	) as Promise<GetRangeContractCoinsMarketChartResponse>;
}
