import { AgentBuilder, type EnhancedRunner, LlmAgent } from "@iqai/adk";
import endent from "endent";
import { z } from "zod";
import { env } from "../env";
import { openrouter } from "../lib/integrations/openrouter";

const languageOutputSchema = z.object({
	language: z
		.enum(["en", "kr", "zh"])
		.describe("The detected language code: en, kr, or zh"),
});

type LanguageDetectionOutput = z.infer<typeof languageOutputSchema>;

export const getLanguageDetector = async () => {
	const languageDetector = new LlmAgent({
		name: "language_detector",
		description:
			"Detects if text is in English (en), Korean (kr), or Chinese (zh)",
		model: openrouter(env.LLM_MODEL),
		outputSchema: languageOutputSchema,
		instruction: endent`You are a language detector. Analyze the input text and determine if it is:
      - English (en)
      - Korean (kr)
      - Chinese (zh)

      ## Detection Rules
      - Korean: Contains Hangul characters (가-힣)
      - Chinese: Contains Chinese/Kanji characters (一-龥)
      - English: Default for all other text

      ## Response Format
      You MUST respond in JSON format with a single field:
      {
        "language": "en" | "kr" | "zh"
      }
    `,
		disallowTransferToParent: true, // ✅ Disable parent transfer
		disallowTransferToPeers: true, // ✅ Disable peer transfer
	});
	const { runner } = await AgentBuilder.create("language_detector_builder")
		.withOutputSchema(languageOutputSchema)
		.withAgent(languageDetector) // ✅ Pass the agent with all configs
		.build();

	return runner as EnhancedRunner<LanguageDetectionOutput>;
};
