import type { LanguageModel } from "ai";
import { generateText } from "ai";
import endent from "endent";
import jsonata from "jsonata";
import { createChildLogger } from "../../../lib/utils";

const logger = createChildLogger("LLM Data Filter");

/**
 * Validates a JSONata expression to ensure it's syntactically valid
 * @param query - The JSONata expression string to validate
 * @returns Validation result with error message if invalid
 */
function validateJsonataQuery(query: string): {
	valid: boolean;
	error?: string;
} {
	if (!query || query.trim().length === 0) {
		return {
			valid: false,
			error: "Query cannot be empty",
		};
	}
	try {
		jsonata(query);
		return { valid: true };
	} catch (error) {
		return {
			valid: false,
			error:
				error instanceof Error ? error.message : "Invalid JSONata expression",
		};
	}
}

interface DataFilterConfig {
	model: LanguageModel;
}

export class LLMDataFilter {
	private readonly model: LanguageModel;

	constructor(config: DataFilterConfig) {
		this.model = config.model;
	}

	/**
	 * Filter large JSON data based on a query
	 * @param data - The JSON data to filter (as string)
	 * @param query - The query describing what data to extract
	 * @returns Filtered JSON data as string
	 */
	async filter(data: string, query: string): Promise<string> {
		const parsedData = JSON.parse(data);
		const schema = this.getJSONSchema(parsedData);

		const prompt = endent`
			You are a JSON data filtering expert. Your task is to generate a JSONata expression that will filter the JSON data based on the user's request.

			## Schema of the data:
			${JSON.stringify(schema, null, 2)}

			## Is the root data an array or object?
			${Array.isArray(parsedData) ? "ARRAY" : "OBJECT"}

			## User's request:
			${query}

			## JSONata Expression Guidelines
			JSONata is a powerful JSON query and transformation language (https://jsonata.org). You can:
			- Filter arrays using expressions like [key > 0]
			- Project objects/arrays using { "name": field, "value": other } or [ { ... } ]
			- Sort/limit via functions like $sort(), $reverse(), $substring(), $sum(), etc.
			- Call built-in functions ($sum, $count, $fromMillis, $substring, $contains, $match, etc.)
			- Use variables via ($var := expression; ...)
			- Compose transformations declaratively

			## Critical Instructions:
			1. Analyze the schema to understand the structure of the data
			2. IMPORTANT: Check if the root is an array or object before using array operations
			3. Generate a JSONata expression that will filter the data to match the user's request
			4. **NEVER RETURN BARE PRIMITIVES**: Your query MUST always return an object or array, never a bare number/string
			5. **ALWAYS USE DESCRIPTIVE KEYS**: Include field names that describe what the value represents
			6. **INCLUDE UNITS IN KEY NAMES**: e.g., "tvl_usd", "price_usd", "volume_24h", "total_locked_value"
			7. The query should:
			   - Select only the relevant fields mentioned in the user's request
			   - Filter arrays to include only relevant items
			   - Return objects with descriptive keys, not bare values
			   - Return meaningful data (not empty arrays or objects)
			8. If the user wants to limit results, use JSONata functions like $substring() on arrays or [0..9]
			9. If the user wants to sort, use $sort() or similar JSONata helpers

			## Examples for ARRAYS:
			- [0..9].({name: name, tvl_usd: tvl})
			- $sort($)[field].({name: name, value: field})
			- *.value > 100 ? {name: name, value: value}

			## Examples for OBJECTS:
			- {protocol_name: name, total_value_usd: value, market_cap: price}
			- {items: items[value > 100].({name: name, value: value})}
			- {top_items: items[0..9]}
			- {ethereum_tvl_usd: chainTvls.Ethereum.tvl.totalLiquidityUSD.$sum()}

			## BAD Examples (DON'T DO THIS):
			- ".chainTvls.Ethereum.tvl | map(.totalLiquidityUSD) | add" (returns bare number)
			- ".name" (returns bare string)
			- ".[0].price" (returns bare number)

			## GOOD Examples (DO THIS):
			- "{ethereum_tvl_usd: (.chainTvls.Ethereum.tvl | map(.totalLiquidityUSD) | add)}"
			- "{protocol_name: .name}"
			- "{first_item_price_usd: .[0].price}"

			IMPORTANT: Respond with ONLY the JSONata expression, nothing else. No explanation, no markdown, just the expression. The expression MUST return an object or array, NEVER a bare primitive.
		`;

		try {
			const result = await generateText({
				model: this.model,
				prompt,
			});

			const expressionText = result.text.trim();
			logger.info(`Generated JSONata expression: ${expressionText}`);

			const validation = validateJsonataQuery(expressionText);
			if (!validation.valid) {
				logger.warn(`Invalid JSONata expression detected: ${validation.error}`);
				logger.info(`Problematic query: ${expressionText}`);
				logger.info("Falling back to smart data summary");
				return this.getFallbackData(parsedData);
			}

			const expression = jsonata(expressionText);
			let filteredData = await expression.evaluate(parsedData);

			if (
				!filteredData ||
				(Array.isArray(filteredData) && filteredData.length === 0)
			) {
				logger.debug("Filter returned empty data, using fallback");
				return this.getFallbackData(parsedData);
			}

			// Safety net: If filtered data is a primitive, wrap it in an object
			if (
				typeof filteredData === "number" ||
				typeof filteredData === "string" ||
				typeof filteredData === "boolean"
			) {
				logger.info(
					`JSONata expression returned bare primitive (${typeof filteredData}), wrapping in object`,
				);
				filteredData = { result: filteredData };
			}

			logger.info(`Successfully filtered data`);
			return JSON.stringify(filteredData);
		} catch (error) {
			logger.error("Error filtering data:", error);
			logger.info("Filter failed, using fallback");
			return this.getFallbackData(parsedData);
		}
	}

	/**
	 * Get fallback data when filtering fails or returns empty results
	 * For arrays: return first 10 items
	 * For objects: return a summary with top-level keys and truncated nested objects
	 */
	private getFallbackData(parsedData: JSONValue): string {
		if (Array.isArray(parsedData)) {
			return JSON.stringify(parsedData.slice(0, 10));
		}

		if (typeof parsedData === "object" && parsedData !== null) {
			// For objects, create a summary with limited data
			const summary: Record<string, unknown> = {};
			for (const [key, value] of Object.entries(parsedData)) {
				if (Array.isArray(value)) {
					summary[key] = value.slice(0, 5);
				} else if (typeof value === "object" && value !== null) {
					// For nested objects, just include keys
					summary[key] = `[Object with ${Object.keys(value).length} keys]`;
				} else {
					// Include primitive values as-is
					summary[key] = value;
				}
			}
			return JSON.stringify(summary);
		}

		return JSON.stringify(parsedData);
	}

	private getJSONSchema(value: JSONValue): JSONSchema {
		if (typeof value === "string") {
			return { type: "string" };
		}
		if (typeof value === "number") {
			return { type: Number.isInteger(value) ? "integer" : "number" };
		}
		if (typeof value === "boolean") {
			return { type: "boolean" };
		}
		if (value === null) {
			return { type: "null" };
		}
		if (Array.isArray(value)) {
			return {
				type: "array",
				items: value.length > 0 ? this.getJSONSchema(value[0]) : undefined,
			};
		}
		if (typeof value === "object") {
			const properties: { [key: string]: JSONSchema } = {};
			for (const [key, val] of Object.entries(value)) {
				properties[key] = this.getJSONSchema(val);
			}
			return { type: "object", properties };
		}

		throw new Error("Unsupported data type");
	}
}

interface JSONSchema {
	type: string;
	properties?: { [key: string]: JSONSchema };
	items?: JSONSchema;
}

type JSONValue =
	| string
	| number
	| boolean
	| null
	| JSONValue[]
	| { [key: string]: JSONValue };
