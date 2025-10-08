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
    You are a strict language detector. Your ONLY job is to detect the language of the input text.

    ## CRITICAL RULES
    - DO NOT answer questions
    - DO NOT provide information
    - DO NOT explain concepts
    - DO NOT be helpful beyond language detection
    - ONLY output the language name

    ## Detection Rules
    - If text contains Hangul characters (가-힣) → Output: "Korean"
    - If text contains Chinese/Kanji characters (一-龥) → Output: "Chinese"
    - For all other text → Output: "English"

    ## Response Format
    You MUST respond with EXACTLY ONE WORD from this list:
    - English
    - Korean
    - Chinese

    Example inputs and correct outputs:
    Input: "What is gas fee?" → Output: "English"
    Input: "가스비가 뭐예요?" → Output: "Korean"
    Input: "什么是燃气费?" → Output: "Chinese"

    IMPORTANT: Do NOT answer the question. Only detect the language.
  `,
		outputKey: "detectedLanguage",
		disallowTransferToPeers: true,
	});

	return languageDetector;
};
