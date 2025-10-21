import {
	DEFAULT_LEARN_DOCS_MAX_SIZE,
	DEFAULT_WIKI_CONTENT_MAX_SIZE,
	SEARCH_QUERY,
	WIKI_GRAPHQL_ENDPOINT,
} from "./constants";
import { searchResponseSchema } from "./schemas";
import type {
	ExecuteSearchOptions,
	SearchError,
	SearchResult,
	Suggestion,
} from "./types";
import { formatSearchResults } from "./utils";

/**
 * Execute the document search against the GraphQL API
 */
export async function executeSearch({
	query,
}: ExecuteSearchOptions): Promise<SearchResult | SearchError> {
	try {
		const response = await fetch(WIKI_GRAPHQL_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: SEARCH_QUERY,
				variables: { query, withAnswer: false },
			}),
		});

		if (!response.ok) {
			const message = `GraphQL request failed with status: ${response.status}`;
			console.error(message);
			return { error: message };
		}

		const rawData = await response.json();
		const parsedData = searchResponseSchema.safeParse(rawData);

		if (!parsedData.success) {
			console.error("Invalid GraphQL response format:", parsedData.error);
			return { error: "Invalid GraphQL response format" };
		}

		if (!parsedData.data.data) {
			console.warn("GraphQL response contained no data");
			return {
				error: "Something went wrong, no data returned from GraphQL",
			};
		}

		const { search } = parsedData.data.data;
		const { suggestions, wikiContents, learnDocs } = search;

		// Collect sources for metadata
		const sources = suggestions.map((s: Suggestion) => ({
			id: s.id,
			title: s.title,
			url: `https://iq.wiki/wiki/${s.id}`,
		}));

		// Build formatted response
		const formattedOutput = formatSearchResults({
			query,
			wikiContents,
			learnDocs,
			wikiContentMaxSize: DEFAULT_WIKI_CONTENT_MAX_SIZE,
			learnDocsMaxSize: DEFAULT_LEARN_DOCS_MAX_SIZE,
		});

		return {
			success: true,
			content: formattedOutput,
			sources,
			suggestionsCount: suggestions.length,
			wikiContentsCount: wikiContents.length,
			learnDocsCount: learnDocs?.length ?? 0,
		};
	} catch (error) {
		console.error(
			"Error in document search:",
			error instanceof Error ? error.message : String(error),
		);
		return {
			error: error instanceof Error ? error.message : String(error),
		};
	}
}
