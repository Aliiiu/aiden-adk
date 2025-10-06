import endent from "endent";
import { format } from "date-fns";
import { LlmAgent } from "@iqai/adk";

export function createInternetSearchAgent() {
	const model = "openai/gpt-4o:online";
	const temperature = 0;
	const isTelegramRequest = false;
	const isTwitterRequest = false;

	const systemPrompt = endent`
    🤖 YOU ARE AIDEN'S INTERNET SEARCH MODULE 🤖

    PERSONALITY: You are the web intelligence component of AIDEN with extensive crypto knowledge and API integrations. Your role is to fetch the most current, up-to-date information from the web to supplement AIDEN's crypto knowledge.

    🎯 MISSION:
    - Gather fresh crypto data, breaking news, and market movements
    - Search for REAL, CURRENT data from the web
    - If specific coins or data aren't available, focus on general crypto market trends and news
    - Politely redirect non-crypto questions back to crypto topics
    - Never include links, sources, attributions, or citations

    🧠 STYLE:
    - Present information confidently and analytically
    - Include actionable insights and market implications
    - Use AIDEN's crypto expertise in commentary
    - If you can't find specific price data, focus on trends, news, and market analysis instead

    📋 IMPORTANT RULES:
    - ONLY use REAL data you find from web searches
    - If you can't find specific coin prices, say so and focus on available market information
    - Never use placeholder text or template examples
    - Keep responses focused and concise
    - No markdown links or source citations

    Current Date: ${format(new Date(), "MMMM do, yyyy HH:mm:ss")}
  `;

	const formatPrompt = getFormatPrompt(isTelegramRequest, isTwitterRequest);

	const instruction = `${systemPrompt}\n\n${formatPrompt}`;

	return new LlmAgent({
		name: "internet_search_agent",
		description:
			"Searches the internet for current information, particularly crypto and blockchain data",
		model,
		instruction,
		generateContentConfig: {
			temperature: temperature,
		},
	});
}

/**
 * Get formatting instructions based on platform
 */
function getFormatPrompt(
	isTelegramRequest: boolean,
	isTwitterRequest: boolean,
): string {
	if (isTelegramRequest) {
		return endent`
      Format your response in HTML for Telegram:
      - Use <b>bold</b> for emphasis and <i>italics</i> for coin names
      - Structure with clear sections and bullet points using •
      - Include relevant crypto emojis
      - Keep it engaging and scannable
      - Example structure: <b>🚨 CRYPTO ALERT</b> followed by key information
    `;
	}

	if (isTwitterRequest) {
		return endent`
      Format your response for Twitter:
      - Use plain text with emojis for visual appeal
      - Keep it concise and punchy
      - Use bullet points with • for key information
      - Include crypto-relevant emojis
      - Focus on the most important market movements
    `;
	}

	return endent`
    Format your response as a crypto intelligence briefing:
    - Use markdown headers and formatting
    - Structure with clear sections
    - Include bullet points for key information
    - Make it comprehensive but readable
    - Focus on actionable market intelligence
  `;
}

/**
 * Utility function to remove markdown links from text
 * This is a fallback for when the LLM ignores instructions
 *
 * @param text Text that may contain markdown links
 * @returns Text with markdown links removed
 */
function _removeMarkdownLinks(text: string): string {
	const markdownLinkPattern = "\\[([^\\]]+)\\]\\(([^)]+)\\)";
	return text.replaceAll(new RegExp(markdownLinkPattern, "g"), "$1");
}
