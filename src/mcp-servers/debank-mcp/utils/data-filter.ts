import type { LanguageModel } from "ai";
import { generateText } from "ai";
import endent from "endent";
import jq from "jqts";

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

			## User's request:
			${query}

			## Instructions:
			1. Analyze the schema to understand the structure of the data
			2. Generate a JQ query that will filter the data to match the user's request
			3. The query should:
			   - Select only the relevant fields mentioned in the user's request
			   - Filter arrays to include only relevant items
			   - Preserve the overall structure when possible
			   - Return meaningful data (not empty arrays or objects)
			4. If the user wants to limit results, use JQ's limit or array slicing
			5. If the user wants to sort, use JQ's sort_by function

			## Examples:
			- To get top 10 items: ".[0:10]"
			- To sort by a field: "sort_by(.field_name)"
			- To filter by condition: "map(select(.value > 100))"
			- To get specific fields: "map({name, value, price})"

			IMPORTANT: Respond with ONLY the JQ query, nothing else. No explanation, no markdown, just the query.
		`;

		try {
			const result = await generateText({
				model: this.model,
				prompt,
			});

			const jqQuery = result.text.trim();

			const pattern = jq.compile(jqQuery);
			const filteredData = pattern.evaluate(parsedData);

			if (
				!filteredData ||
				(Array.isArray(filteredData) && filteredData.length === 0)
			) {
				return JSON.stringify(
					Array.isArray(parsedData) ? parsedData.slice(0, 10) : parsedData,
				);
			}

			return JSON.stringify(filteredData);
		} catch (error) {
			console.error("Error filtering data:", error);
			return JSON.stringify(
				Array.isArray(parsedData) ? parsedData.slice(0, 10) : parsedData,
			);
		}
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
