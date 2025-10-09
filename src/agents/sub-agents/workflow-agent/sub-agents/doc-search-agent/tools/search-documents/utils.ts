import { format } from "date-fns";
import endent from "endent";
import type { FormatSearchResultsOptions } from "./types";

/**
 * Truncate document content to fit within size limits
 */
export function truncateDocumentContent(
	content: string,
	maxSizeBytes: number,
): string {
	const encoder = new TextEncoder();
	const encodedContent = encoder.encode(content);
	const contentSizeBytes = encodedContent.length;

	if (contentSizeBytes <= maxSizeBytes) {
		return content;
	}

	if (contentSizeBytes === 0) {
		return "Content is empty or not available.";
	}

	console.warn(
		`📏 Document content exceeds ${Math.round(maxSizeBytes / 1024)}KB, truncating...`,
	);

	const targetSize = Math.floor(maxSizeBytes * 0.9);
	let truncatedContent = new TextDecoder().decode(
		encodedContent.slice(0, targetSize),
	);

	const lastSpaceIndex = truncatedContent.lastIndexOf(" ");
	if (lastSpaceIndex > truncatedContent.length * 0.9) {
		truncatedContent = truncatedContent.substring(0, lastSpaceIndex);
	}

	return `${truncatedContent}\n\n[Content truncated due to size limit - original size: ${Math.round(contentSizeBytes / 1024)}KB]`;
}

/**
 * Format search results into a structured string for LLM consumption
 */
export function formatSearchResults({
	query,
	wikiContents,
	learnDocs,
	wikiContentMaxSize,
	learnDocsMaxSize,
}: FormatSearchResultsOptions): string {
	const wikiContextContent = wikiContents
		.map(
			(wiki) =>
				`TITLE: ${wiki.title}\nCONTENT: ${truncateDocumentContent(
					wiki.content,
					wikiContentMaxSize,
				)}\n---`,
		)
		.join("\n\n");

	const learnDocsContent = learnDocs?.length
		? learnDocs
				.map(
					(doc) =>
						`TITLE: ${doc.title}\nCONTENT: ${truncateDocumentContent(
							doc.content,
							learnDocsMaxSize,
						)}\n---`,
				)
				.join("\n\n")
		: "";

	return endent`
		${
			learnDocsContent
				? `📚 IQ LEARN DOCUMENTATION (${learnDocs?.length} entries) - EDUCATIONAL CONTEXT
              ===========================================

              🎓 CONTEXT: These documents contain educational material about the IQ token and BrainDAO ecosystem.
              Use them as supplemental context for questions related to: IQ token, IQ hiIQ, IQ bridges, IQ exchanges, IQ contracts, IQ DeFi protocols.

              Query Context: "${query}"

              ⚠️  NOTE: These are educational/contextual documents. Use them to enhance understanding but verify relevance to the specific query.
              When citing information, clearly distinguish between educational context and factual answers.

              ${learnDocsContent}

              `
				: ""
		}
              🎯 QUERY: "${query}"
              📅 DATE: ${format(new Date(), "MMMM do, yyyy HH:mm:ss")}

              =========================================== 📖 WIKI CONTENT (INFORMATION RETRIEVED): ===========================================
              ${wikiContextContent}

              ============================= 📋 CONTEXT SUMMARY ===========================================

              AVAILABLE KNOWLEDGE SOURCES:
              ${learnDocsContent ? "✅ IQ Learn Documentation: Educational content about IQ ecosystem" : "❌ IQ Learn Documentation: Not available"}
              ${wikiContextContent ? "✅ Wiki Articles: General knowledge and information" : "❌ Wiki Articles: No relevant content found"}

              IMPORTANT INSTRUCTIONS FOR AI ASSISTANT:
              • Use IQ Learn docs as supplemental context for IQ/BrainDAO ecosystem questions
              • Wiki articles provide general background information
              • Always verify information relevance to the specific query: "${query}"
              • Clearly distinguish between factual information and educational/contextual content
              • Cite sources when providing information
            `;
}
