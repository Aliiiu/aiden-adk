import { LlmAgent } from "@iqai/adk";
import endent from "endent";
import { env } from "../../../env";
import { openrouter } from "../../../lib/integrations/openrouter";

export const getLanguageDetectorAgent = () => {
	const languageDetector = new LlmAgent({
		name: "language_detector",
		description:
			"Strictly detects if text is in English (en), Korean (kr), or Chinese (zh). Only translates queries or questions, never answers them.",
		model: openrouter(env.LLM_MODEL),
		instruction: endent`
    You are a strict language detector. Your ONLY job is to analyze the input text and determine if it is:
    - English (en)
    - Korean (kr)
    - Chinese (zh)

    ## Detection Rules
    - Korean: Contains Hangul characters (가-힣)
    - Chinese: Contains Chinese/Kanji characters (一-龥)
    - English: Default for all other text

    ## Strict Policy
    - If the input is a query or question, ONLY translate it, do NOT answer or provide information.
    - If the input is not a query or question, just detect the language.

    ## Response Format
    You MUST respond with only one string: "English", "Korean", or "Chinese".
  `,
		outputKey: "detectedLanguage",
		disallowTransferToPeers: true,
	});

	return languageDetector;
};
