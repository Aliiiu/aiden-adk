import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const GetUserNftListInputSchema = z.object({
	id: z.string().describe("User wallet address"),
	chain_id: z.string().describe("Chain ID (e.g., 'eth', 'bsc', 'matic')"),
	is_all: z
		.boolean()
		.optional()
		.describe("Include all NFTs (default true, false filters dust)"),
});

const NftAttributeSchema = z.object({
	trait_type: z.string().describe("NFT trait name"),
	value: z.string().describe("Trait value"),
});

const UserNftSchema = z.object({
	id: z.string().describe("NFT identifier"),
	contract_id: z.string().describe("Contract address"),
	inner_id: z.string().describe("Token ID within the contract"),
	chain: z.string().describe("Chain ID"),
	name: z.string().describe("NFT name"),
	description: z.string().describe("NFT description"),
	content_type: z.string().describe("Content type (image/video/etc)"),
	content: z.string().describe("Primary content URL"),
	thumbnail_url: z.string().describe("Thumbnail image URL"),
	total_supply: z.number().describe("Total supply of the collection"),
	attributes: z.array(NftAttributeSchema).describe("NFT attributes/traits"),
});

export const GetUserNftListResponseSchema = z
	.array(UserNftSchema)
	.describe("NFTs owned by the user on the specified chain");

export type GetUserNftListInput = z.infer<typeof GetUserNftListInputSchema>;
export type GetUserNftListResponse = z.infer<
	typeof GetUserNftListResponseSchema
>;

/**
 * Get user NFT holdings - all NFTs owned by a wallet address on a specific chain.
 *
 * Returns wallet NFT portfolio with metadata, images, attributes, and collection details.
 * Use this for user NFT list, wallet NFT holdings, address NFT balance queries.
 * For general NFT collection data (not wallet-specific), use CoinGecko NFT endpoints.
 *
 * WORKFLOW: To get user NFTs on Ethereum or other chains:
 * 1. Get chain ID using getSupportedChainList() (e.g., 'eth' for Ethereum)
 * 2. Call getUserNftList with wallet address and chain_id
 *
 * @param input.id - Wallet address to query (e.g., '0x...')
 * @param input.chain_id - Chain identifier: 'eth' (Ethereum), 'bsc', 'matic' (Polygon), 'arb' (Arbitrum)
 * @param input.is_all - Include all NFTs including dust/low-value items (default: true)
 *
 * @returns Array of user's NFTs with name, description, images, traits, token IDs, collection info
 *
 * @example
 * ```typescript
 * // Get all NFTs for a wallet on Ethereum
 * const nfts = await getUserNftList({
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   chain_id: 'eth'
 * });
 * // Returns: [{ name: 'Bored Ape #123', content: 'ipfs://...', attributes: [...] }]
 * ```
 */
export async function getUserNftList(
	input: GetUserNftListInput,
): Promise<GetUserNftListResponse> {
	return executeServiceMethod(
		"user",
		"getUserNftList",
		input,
	) as Promise<GetUserNftListResponse>;
}
