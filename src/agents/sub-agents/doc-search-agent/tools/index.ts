import { createTool } from "@iqai/adk";
import { searchInputSchema } from "./search-documents/schemas";
import { executeSearch } from "./search-documents/service";

/**
 * Creates a tool for searching IQ.wiki knowledge base
 *
 * This tool searches across multiple knowledge sources:
 * - IQ.wiki articles and suggestions
 * - IQ Learn documentation
 * - Custom knowledge base documents (when configured)
 *
 * @param config Optional configuration for the tool
 * @returns A tool that can be used with agents
 *
 * @example
 * ```typescript
 * import { createDocumentSearchTool, AgentBuilder } from '@iqai/adk';
 *
 * const searchTool = createDocumentSearchTool();
 *
 * const agent = new AgentBuilder()
 *   .withModel("gpt-4")
 *   .withTools([searchTool])
 *   .buildLlm();
 *
 * const response = await agent.ask("What is Bitcoin?");
 * ```
 */
export const searchDocuments = createTool({
	name: "search_documents",
	description:
		"Search IQ.wiki knowledge base and IQ Learn documentation for information on cryptocurrencies, blockchain, DeFi, NFTs, DAOs, and Web3 topics",
	schema: searchInputSchema,
	fn: async ({ query }) => {
		return executeSearch({
			query,
		});
	},
});
