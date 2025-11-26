import z from "zod";
import { callEtherscanApi } from "../shared.js";

export const GetMinedBlocksInputSchema = z.object({
	address: z
		.string()
		.describe(
			"The string representing the address whose validated blocks you want to retrieve",
		),
	blocktype: z
		.enum(["blocks", "uncles"])
		.describe(
			"The string pre-defined block type, either 'blocks' for canonical blocks or 'uncles' for uncle blocks only",
		),
	page: z
		.number()
		.int()
		.positive()
		.optional()
		.describe("Page number for pagination"),
	offset: z
		.number()
		.int()
		.positive()
		.optional()
		.describe("Number of results per page"),
});

export type GetMinedBlocksInput = z.infer<typeof GetMinedBlocksInputSchema>;

const MinedBlockSchema = z.object({
	blockNumber: z.string(),
	timeStamp: z.string(),
	blockReward: z.string(),
});

const MinedBlocksResponseSchema = z.array(MinedBlockSchema);

export type GetMinedBlocksResponse = z.infer<typeof MinedBlocksResponseSchema>;

/**
 * Get a list of blocks that were validated (mined) by an address.
 *
 * Returns blocks that were mined by the specified address, including block rewards.
 * Can retrieve either canonical blocks or uncle blocks.
 *
 * @param params.address - Address whose validated blocks you want to retrieve
 * @param params.blocktype - 'blocks' for canonical blocks or 'uncles' for uncle blocks only
 * @param params.page - Page number for pagination (optional)
 * @param params.offset - Number of results per page (optional)
 *
 * @returns Array of mined blocks with block number, timestamp, and reward
 *
 * @example
 * ```typescript
 * const minedBlocks = await getMinedBlocks({
 *   address: '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b',
 *   blocktype: 'blocks'
 * });
 * // Returns: [{ blockNumber: '123456', timeStamp: '1234567890', blockReward: '...' }, ...]
 * ```
 */
export async function getMinedBlocks(
	params: GetMinedBlocksInput,
): Promise<GetMinedBlocksResponse> {
	const { address, blocktype, page, offset } =
		GetMinedBlocksInputSchema.parse(params);

	return callEtherscanApi(
		{
			module: "account",
			action: "getminedblocks",
			address,
			blocktype,
			page,
			offset,
		},
		MinedBlocksResponseSchema,
	);
}
