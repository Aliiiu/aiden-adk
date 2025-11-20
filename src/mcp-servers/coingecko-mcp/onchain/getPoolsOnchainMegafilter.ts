import { z } from "zod";
import { executeTool } from "../shared.js";

export const GetPoolsOnchainMegafilterInputSchema = z
	.object({
		network: z.string().optional().describe("Network identifier"),
		dex: z.string().optional().describe("DEX identifier"),
		min_volume_usd: z.number().optional().describe("Minimum 24h volume in USD"),
		max_volume_usd: z.number().optional().describe("Maximum 24h volume in USD"),
		min_price_change_percentage_24h: z
			.number()
			.optional()
			.describe("Minimum 24h price change percentage"),
		max_price_change_percentage_24h: z
			.number()
			.optional()
			.describe("Maximum 24h price change percentage"),
		sort: z.string().optional().describe("Sort field"),
		order: z.enum(["asc", "desc"]).optional().describe("Sort order"),
		page: z.number().int().positive().optional().describe("Page number"),
	})
	.optional();

const RelationshipRefSchema = z.object({
	data: z
		.object({
			id: z.string(),
			type: z.string(),
		})
		.nullable()
		.optional(),
});

const MegaFilterPoolAttributesSchema = z
	.object({
		name: z.string(),
		address: z.string(),
		base_token_price_usd: z.string().nullable().optional(),
		quote_token_price_usd: z.string().nullable().optional(),
		reserve_in_usd: z.string().nullable().optional(),
		h24_volume_usd: z.string().nullable().optional(),
		fdv_usd: z.string().nullable().optional(),
	})
	.loose();

const MegaFilterPoolSchema = z.object({
	id: z.string(),
	type: z.string(),
	attributes: MegaFilterPoolAttributesSchema,
	relationships: z
		.object({
			base_token: RelationshipRefSchema.optional(),
			quote_token: RelationshipRefSchema.optional(),
			dex: RelationshipRefSchema.optional(),
			network: RelationshipRefSchema.optional(),
		})
		.partial()
		.optional(),
});

export const GetPoolsOnchainMegafilterResponseSchema = z.object({
	data: z.array(MegaFilterPoolSchema),
	included: z
		.array(
			z.object({
				id: z.string(),
				type: z.string(),
				attributes: z.record(z.string(), z.unknown()).optional(),
			}),
		)
		.optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
});

export type GetPoolsOnchainMegafilterInput = z.infer<
	typeof GetPoolsOnchainMegafilterInputSchema
>;
export type GetPoolsOnchainMegafilterResponse = z.infer<
	typeof GetPoolsOnchainMegafilterResponseSchema
>;

/**
 * Search and filter DEX trading pools with advanced criteria (volume, price change, DEX, etc.).
 *
 * Returns onchain DEX pools matching specific trading criteria. This is for finding active trading pools based on metrics.
 * For protocol rankings by TVL, use DefiLlama getProtocols. For yield farming pools, use DefiLlama getLatestPoolData.
 *
 * @param params.network - Network ID (e.g., 'eth', 'bsc')
 * @param params.dex - DEX filter
 * @param params.min_volume_usd - Minimum 24h volume in USD
 * @param params.max_volume_usd - Maximum 24h volume in USD
 * @param params.min_price_change_percentage_24h - Minimum 24h price change
 * @param params.max_price_change_percentage_24h - Maximum 24h price change
 * @param params.sort - Sort field
 * @param params.order - Sort order ('asc' or 'desc')
 * @param params.page - Page number
 *
 * @returns Filtered pools
 *
 * @example
 * ```typescript
 * const highVolumePools = await getPoolsOnchainMegafilter({
 *   network: 'eth',
 *   min_volume_usd: 1000000,
 *   sort: 'volume_usd_24h',
 *   order: 'desc'
 * });
 * ```
 */
export async function getPoolsOnchainMegafilter(
	params?: GetPoolsOnchainMegafilterInput,
): Promise<GetPoolsOnchainMegafilterResponse> {
	return executeTool(
		"get_pools_onchain_megafilter",
		params ?? {},
	) as Promise<GetPoolsOnchainMegafilterResponse>;
}
