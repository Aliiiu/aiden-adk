import { LlmAgent } from "@iqai/adk";
import endent from "endent";
import { env } from "../../../env";
import { openrouter } from "../../../lib/integrations/openrouter";

export const getLanguageDetectorAgent = () => {
	const languageDetector = new LlmAgent({
		name: "language_detector",
		description:
			"Detects if text is in English (en), Korean (kr), or Chinese (zh)",
		model: openrouter(env.LLM_MODEL),
		instruction: endent`You are a language detector. Analyze the input text and determine if it is:
      - English (en)
      - Korean (kr)
      - Chinese (zh)

      ## Detection Rules
      - Korean: Contains Hangul characters (가-힣)
      - Chinese: Contains Chinese/Kanji characters (一-龥)
      - English: Default for all other text

      ## Response Format
      You MUST respond only one string, either English, Korean or Chinese
    `,
		outputKey: "detectedLanguage",
		disallowTransferToPeers: true,
	});

	return languageDetector;
};
