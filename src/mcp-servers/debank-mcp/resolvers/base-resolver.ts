import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import endent from "endent";
import { createChildLogger } from "../../../lib/utils/index";
import { isNotFoundResponse } from "../utils/validators";

const logger = createChildLogger("DeBank Entity Resolver");
const gemini25Flash = "gemini-2.5-flash";

interface ResolverMessages {
	system: string;
	user: string;
}

interface ResolverConfig<T> {
	entityType: string;
	entities: T[];
	getContext: (entities: T[]) => string;
	sanitize: (output: string) => string;
	validate: (sanitized: string, entities: T[]) => boolean;
	buildMessages?: (
		name: string,
		context: string,
		entityType: string,
	) => ResolverMessages;
}

const defaultBuildMessages = (
	name: string,
	context: string,
	entityType: string,
): ResolverMessages => {
	return {
		system: endent`
      You are a precise resolver that maps user inputs to canonical DeBank ${entityType} identifiers.
      Always respond with a single ID taken from the provided reference list below.
      If no suitable match exists, respond with "__NOT_FOUND__".
      Do not add explanations or additional text.

      Reference ${entityType}s (format: Name: id):
      ${context}
    `,
		user: endent`
      Resolve the user's input to a valid DeBank ${entityType} ID.

      User input: "${name}"

      Guidelines:
      1. Match the closest entry from the reference list, accounting for common aliases and abbreviations.
      2. Return ONLY the ID string (e.g., "eth").
      3. If no match exists, reply with "__NOT_FOUND__".
    `,
	};
};

export async function createResolver<T>(
	config: ResolverConfig<T>,
): Promise<(name: string) => Promise<string | null>> {
	const context = config.getContext(config.entities);
	const buildMessages = config.buildMessages ?? defaultBuildMessages;

	return async (name: string) => {
		try {
			const { system, user } = buildMessages(name, context, config.entityType);

			const result = await generateText({
				model: google(gemini25Flash),
				messages: [
					{ role: "system", content: system },
					{ role: "user", content: user },
				],
			});

			const rawOutput = result.text.trim();
			logger.debug(
				`Raw output for ${config.entityType} '${name}': ${rawOutput}`,
			);

			if (isNotFoundResponse(rawOutput)) {
				logger.warn(`Could not resolve ${config.entityType}: ${name}`);
				return null;
			}

			const sanitized = config.sanitize(rawOutput);

			if (!sanitized) {
				logger.warn(`Gemini returned empty ${config.entityType} for: ${name}`);
				return null;
			}

			if (config.validate(sanitized, config.entities)) {
				return sanitized;
			}

			logger.warn(`Gemini returned invalid ${config.entityType}: ${sanitized}`);
			return null;
		} catch (error) {
			logger.error(`Error resolving ${config.entityType}:`, error);
			return null;
		}
	};
}
