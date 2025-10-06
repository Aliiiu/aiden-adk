import { createTool } from "@iqai/adk";
import { searchInputSchema } from "./search-documents/schemas";
import { executeSearch } from "./search-documents/service";

/**
 * Document Search Tool for IQ.wiki and IQ Learn
 *
 * Searches across comprehensive cryptocurrency and blockchain knowledge bases to retrieve foundational information, educational content, and analytical context.
 *
 * ## Data Sources
 * - **IQ.wiki Encyclopedia**: Comprehensive crypto articles, project profiles, and concept explanations
 * - **IQ Learn Documentation**: Educational materials on IQ token, BrainDAO, and ecosystem
 * - **ICP Documentation**: Internet Computer Protocol technical and conceptual documentation
 * - **Legal & Regulatory Databases**: Acts, laws, regulations, and compliance frameworks
 *
 * ## Response Structure
 * Returns an object containing:
 * - `content`: Formatted search results with titles, content, and metadata
 * - `sources`: Array of source objects with id, title, and URL
 * - `suggestionsCount`: Number of wiki suggestions found
 * - `wikiContentsCount`: Number of wiki articles retrieved
 * - `learnDocsCount`: Number of IQ Learn documents retrieved
 *
 * ## Important Notes
 * - Does NOT provide real-time price data or current market metrics
 * - Focus is on foundational knowledge and analytical depth
 * - Content may be truncated if it exceeds size limits
 */
export const searchDocuments = createTool({
	name: "search_documents",
	description:
		"Search IQ.wiki knowledge base and IQ Learn documentation for foundational cryptocurrency and blockchain information including project analysis, due diligence, tokenomics, legal frameworks, and educational content. Does not provide real-time prices or current market data.",
	schema: searchInputSchema,
	fn: async ({ query }) => {
		return executeSearch({
			query,
		});
	},
});
