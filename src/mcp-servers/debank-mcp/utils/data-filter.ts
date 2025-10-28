import type { LanguageModel } from "ai";
import { generateText } from "ai";
import endent from "endent";
import jq from "jqts";
import { createChildLogger } from "../../../lib/utils";

const logger = createChildLogger("LLM Data Filter");

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
			You are a JSON data filtering expert. Your task is to generate a JQ query that will filter the JSON data based on the user's request.

			## Schema of the data:
			${JSON.stringify(schema, null, 2)}

			## Is the root data an array or object?
			${Array.isArray(parsedData) ? "ARRAY" : "OBJECT"}

			## User's request:
			${query}

			## Instructions:
			1. Analyze the schema to understand the structure of the data
			2. IMPORTANT: Check if the root is an array or object before using array operations
			3. Generate a JQ query that will filter the data to match the user's request
			4. The query should:
			   - Select only the relevant fields mentioned in the user's request
			   - Filter arrays to include only relevant items
			   - Preserve the overall structure when possible
			   - Return meaningful data (not empty arrays or objects)
			5. If the user wants to limit results, use JQ's limit or array slicing
			6. If the user wants to sort, use JQ's sort_by function

			## Examples for ARRAYS:
			- To get top 10 items: ".[0:10]"
			- To sort by a field: "sort_by(.field_name)"
			- To filter by condition: "map(select(.value > 100))"
			- To get specific fields: "map({name, value, price})"

			## Examples for OBJECTS:
			- To select specific fields: "{name, value, price}"
			- To filter nested arrays: ".items | map(select(.value > 100))"
			- To limit nested array: ".items[0:10]"

			IMPORTANT: Respond with ONLY the JQ query, nothing else. No explanation, no markdown, just the query.
		`;

		try {
			const result = await generateText({
				model: this.model,
				prompt,
			});

			const jqQuery = result.text.trim();
			logger.info(`Generated JQ query: ${jqQuery}`);

			const pattern = jq.compile(jqQuery);
			const filteredData = pattern.evaluate(parsedData);

			if (
				!filteredData ||
				(Array.isArray(filteredData) && filteredData.length === 0)
			) {
				logger.debug("Filter returned empty data, using fallback");
				return this.getFallbackData(parsedData);
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
					// Include first 5 items of arrays
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
