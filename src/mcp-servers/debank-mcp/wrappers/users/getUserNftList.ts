/**
 * Get list of NFTs owned by a user on a chain
 */

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
 * Get all NFTs owned by a specific wallet address on a chain with metadata and attributes.
 *
 * Returns wallet-specific NFT holdings with content URLs, traits, and collection info.
 * This is for analyzing a specific user's NFT portfolio. For general NFT collection data
 * (not wallet-specific), use NFT marketplaces or other tools.
 *
 * @param input.id - User's wallet address (e.g., '0x...')
 * @param input.chain_id - Chain ID (e.g., 'eth', 'bsc', 'matic', 'arb')
 * @param input.is_all - Include all NFTs including low-value ones (default: true)
 *
 * @returns Array of NFTs with name, description, content URLs, traits, collection info
 *
 * @example
 * ```typescript
 * const nfts = await getUserNftList({
 *   id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   chain_id: 'eth'
 * });
 * // Returns: [{ name: 'Bored Ape #123', content: '...', attributes: [...] }]
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
