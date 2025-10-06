import { format } from "date-fns";
import endent from "endent";
import { truncateDocumentContent } from "./utils";

interface WikiContent {
	title: string;
	content: string;
}

interface LearnDoc {
	title: string;
	content: string;
}

interface FormatSearchResultsOptions {
	query: string;
	wikiContents: WikiContent[];
	learnDocs?: LearnDoc[] | null;
	wikiContentMaxSize: number;
	learnDocsMaxSize: number;
}

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
