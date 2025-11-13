/**
 * Search CoinGecko API documentation
 */

import { z } from "zod";
import { executeTool } from "../shared.js";

export const SearchDocsInputSchema = z.object({
	query: z.string().describe("Search query string"),
});

const DocHitSchema = z
	.object({
		title: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
	})
	.loose();

export const SearchDocsResponseSchema = z.object({
	hits: z.array(DocHitSchema),
	totalHits: z.number().optional(),
	page: z.number().optional(),
});

export type SearchDocsInput = z.infer<typeof SearchDocsInputSchema>;
export type SearchDocsResponse = z.infer<typeof SearchDocsResponseSchema>;

/**
 * Search CoinGecko API documentation
 *
 * @param params.query - Search query for documentation
 *
 * @returns Relevant documentation entries
 *
 * @example
 * ```typescript
 * const docs = await searchDocs({
 *   query: 'trending coins'
 * });
 * ```
 */
export async function searchDocs(
	params: SearchDocsInput,
): Promise<SearchDocsResponse> {
	return executeTool("search_docs", params) as Promise<SearchDocsResponse>;
}
