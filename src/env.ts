import { config } from "dotenv";
import { z } from "zod";

config();

export const envSchema = z.object({
	ADK_DEBUG: z.coerce.boolean().default(false),
	OPENROUTER_API_KEY: z.string(),
	COINGECKO_PRO_API_KEY: z.string().optional(),
	COINGECKO_DEMO_API_KEY: z.string().optional(),
	COINGECKO_ENVIRONMENT: z.enum(["pro", "demo"]).default("demo"),
	LLM_MODEL: z.string().default("openai/gpt-4.1-mini"),
});

/**
 * Validated environment variables parsed from process.env.
 * Throws an error if required environment variables are missing or invalid.
 */
export const env = envSchema.parse(process.env);
