import { LlmAgent } from "@iqai/adk";
import endent from "endent";
import { z } from "zod";
import { env } from "../../../env";
import { openrouter } from "../../../lib/integrations/openrouter";

const LanguageSchema = z.enum(["English", "Korean", "Chinese"]);

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
    - ONLY output the detected language

    ## Detection Rules
    - If text contains Hangul characters (가-힣) → Detected language: "Korean"
    - If text contains Chinese/Kanji characters (一-龥) → Detected language: "Chinese"
    - For all other text → Detected language: "English"

    ## Response Format
    You MUST respond with EXACTLY one of these values: English, Korean, or Chinese

    Do NOT add any explanation, just return the language name.

    Examples:
    - Input: "What is gas fee?" → Response: "English"
    - Input: "가스비가 뭐예요?" → Response: "Korean"
    - Input: "什么是燃气费?" → Response: "Chinese"
  `,
		outputKey: "detectedLanguage",
		outputSchema: LanguageSchema,
		disallowTransferToParent: true,
		disallowTransferToPeers: true,
	});

	return languageDetector;
};
