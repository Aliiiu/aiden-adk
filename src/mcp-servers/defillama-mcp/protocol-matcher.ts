/**
 * Protocol Slug Matcher using Gemini Cached Context
 *
 * This module uses Google's Gemini model with cached inputs to intelligently
 * match user queries to the correct DefiLlama protocol slug.
 */

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import endent from "endent";
import { env } from "../../env";
import { logger } from "../../lib/utils";
import { protocols } from "./enums/protocols";

const google = createGoogleGenerativeAI({
	apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
});

/**
 * Find the best matching protocol slug for a user query using Gemini AI
 * with cached protocol list for efficient repeated lookups
 */
export async function findProtocolSlug(
	userQuery: string,
): Promise<string | null> {
	try {
		// Prepare the protocols list as a compact string for caching
		const protocolsContext = protocols
			.map((p) => `${p.slug}|${p.name}|${p.symbol}`)
			.join("\n");

		const prompt = endent`
			You are a protocol slug matcher for DefiLlama API.

			AVAILABLE PROTOCOLS (format: slug|name|symbol):
			${protocolsContext}

			USER QUERY: "${userQuery}"

			Your task: Find the EXACT protocol slug that best matches the user's query.

			Rules:
			1. Return ONLY the slug, nothing else
			2. Match the user's query to the most appropriate protocol from the list
			3. For protocols with multiple versions, prefer the latest/most commonly used version unless the user explicitly specifies a version
			4. Handle variations in naming (e.g., "Uni" or "Uniswap" should both match "uniswap")
			5. If no good match exists, return "NOT_FOUND"
			6. Be case-insensitive and flexible with spacing and punctuation

			Examples:
			- User: "Lido" → "lido"
			- User: "Uniswap" → "uniswap"
			- User: "Aave V3" → "aave-v3"
			- User: "Curve" → "curve-dex"
			- User: "MakerDAO" → "makerdao"
			- User: "XYZ Random Protocol 12345" → "NOT_FOUND"

			Now find the slug for the user query above:
		`;

		const result = await generateText({
			model: google("gemini-2.5-flash"),
			prompt,
			system: endent`
				You are a precise protocol matcher. Return ONLY the slug or NOT_FOUND. No explanations.
			`,
		});

		const slug = result.text.trim().toLowerCase();

		// Validate that the returned slug actually exists in our protocols list
		if (slug === "not_found") {
			return null;
		}

		logger.info(`Matched slug "${slug}" for query "${userQuery}"`);

		const exists = protocols.some((p) => p.slug.toLowerCase() === slug);
		return exists ? slug : null;
	} catch (error) {
		console.error("Error in protocol matcher:", error);
		return null;
	}
}

/**
 * Batch find protocol slugs for multiple queries
 * More efficient when matching multiple protocols at once
 */
export async function findProtocolSlugs(
	userQueries: string[],
): Promise<Map<string, string | null>> {
	const results = new Map<string, string | null>();

	// Process in parallel for efficiency
	const promises = userQueries.map(async (query) => {
		const slug = await findProtocolSlug(query);
		results.set(query, slug);
	});

	await Promise.all(promises);
	return results;
}
