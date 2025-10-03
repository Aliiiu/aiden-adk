import { config } from "dotenv";
import { z } from "zod";

config();

export const envSchema = z.object({
	ADK_DEBUG: z.coerce.boolean().default(false),
	OPENROUTER_API_KEY: z.string(),
	LLM_MODEL: z.string().default("openai/gpt-4.1-mini"),
});

/**
 * Validated environment variables parsed from process.env.
 * Throws an error if required environment variables are missing or invalid.
 */
export const env = envSchema.parse(process.env);
