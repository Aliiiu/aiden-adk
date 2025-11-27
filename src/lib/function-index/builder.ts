/**
 * Function Index Builder using Lunr.js
 *
 * Builds a searchable index of all MCP wrapper functions by reading
 * the wrapper files and extracting function exports, parameters, and metadata.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import lunr from "lunr";
import { createChildLogger } from "../utils/logger";

const logger = createChildLogger("Function Index Builder");

export interface FunctionMetadata {
	name: string;
	module: "coingecko" | "debank" | "defillama" | "iqai" | "etherscan";
	category: string;
	description: string;
	parameters: string;
	filePath: string;
	example?: string;
}

function extractFunctionsFromFile(
	filePath: string,
	module: "coingecko" | "debank" | "defillama" | "iqai" | "etherscan",
): FunctionMetadata[] {
	if (!fs.existsSync(filePath)) {
		logger.warn(`File not found: ${filePath}`);
		return [];
	}

	const content = fs.readFileSync(filePath, "utf-8");
	const functions: FunctionMetadata[] = [];

	// Extract export statements like: export { getFunctionName } from './category/getFunctionName.js';
	const exportRegex = /export\s+\{\s*(\w+)\s*\}\s+from\s+['"]\.\/(\w+)\//g;
	let match = exportRegex.exec(content);

	while (match !== null) {
		const [, functionName, category] = match;

		const functionFilePath = path.join(
			path.dirname(filePath),
			category,
			`${functionName}.ts`,
		);

		let description = "";
		let parameters = "";

		let example = "";

		if (fs.existsSync(functionFilePath)) {
			const functionContent = fs.readFileSync(functionFilePath, "utf-8");

			// Extract full JSDoc comment block
			// This captures important notes about response structure and field semantics
			const jsdocMatch = functionContent.match(/\/\*\*([\s\S]*?)\*\//);
			if (jsdocMatch) {
				const rawJsdoc = jsdocMatch[1];

				// Clean up JSDoc: remove asterisks, trim lines, join with newlines
				description = rawJsdoc
					.split("\n")
					.map((line) => line.replace(/^\s*\*\s?/, "").trim())
					.filter((line) => line.length > 0)
					.join("\n");

				// Extract @example block separately for better code generation guidance
				const exampleMatch = rawJsdoc.match(
					/@example[\s\S]*?```(?:typescript|ts)?\s*([\s\S]*?)```/,
				);
				if (exampleMatch) {
					// Clean up the example code block - remove asterisks and extra whitespace
					example = exampleMatch[1]
						.split("\n")
						.map((line) => line.replace(/^\s*\*\s?/, "").trim())
						.filter((line) => line.length > 0)
						.join("\n");
				}
			}

			// Extract parameters from Zod schema for better agent guidance
			// This provides structured parameter info even without examples
			// Handles: z.object({ ... }); z.object({ ... }).strict(); z.object({ ... }).optional();
			const zodSchemaMatch = functionContent.match(
				/export\s+const\s+(\w+InputSchema)\s*=\s*z(?:\s*\n)?\s*\.object\(\{([\s\S]*?)\}\)(?:\s*\.(?:strict|loose|optional)\(\))*\s*;/,
			);
			if (zodSchemaMatch) {
				const schemaBody = zodSchemaMatch[2];
				const paramEntries: string[] = [];

				// Match each parameter with its full chain including .describe()
				// Matches patterns like: name: z.string().describe("desc") or name: z.number().optional().describe("desc")
				const paramLines = schemaBody.split(/,\s*(?=\w+:)/);

				for (const line of paramLines) {
					// Extract parameter name
					const nameMatch = line.match(/^\s*(\w+):/);
					if (!nameMatch) continue;
					const paramName = nameMatch[1];

					// Extract Zod type (handle multi-line definitions)
					const typeMatch = line.match(/z(?:\s*\n)?\s*\.(\w+)\(/);
					if (!typeMatch) continue;
					const zodType = typeMatch[1];

					// Extract description - handle multi-line .describe() calls
					// Use [\s\S]*? to match any character including newlines
					// Pattern: .describe( ... "description", ... ) - note the comma after the string
					let descMatch = line.match(/\.describe\([\s\S]*?"([^"]*)"[\s\S]*?\)/);
					if (!descMatch) {
						descMatch = line.match(/\.describe\([\s\S]*?'([^']*)'[\s\S]*?\)/);
					}

					const description = descMatch
						? descMatch[1]
						: "No description provided";

					// Check if optional
					const isOptional = line.includes(".optional()");

					paramEntries.push(
						`${paramName}${isOptional ? "?" : ""}: ${zodType} - ${description}`,
					);
				}

				if (paramEntries.length > 0) {
					parameters = paramEntries.join("; ");
				}
			}

			// Check if function takes no parameters
			if (!parameters) {
				// Look for function signature with no parameters or empty object
				const funcSignature = functionContent.match(
					/export\s+(?:async\s+)?function\s+\w+\s*\(\s*\)/,
				);
				if (funcSignature) {
					parameters = "none - this function takes no parameters";
				}
			}
		}

		functions.push({
			name: functionName,
			module,
			category,
			description:
				description || `${category} function from ${module}`.replace(/-/g, " "),
			parameters: parameters || "see JSDoc @param tags in description field",
			filePath: functionFilePath,
			example: example || undefined,
		});

		// Get next match
		match = exportRegex.exec(content);
	}

	return functions;
}

/**
 * Build the Lunr.js search index for all MCP functions
 */
export function buildFunctionIndex(): {
	index: lunr.Index;
	documents: Map<string, FunctionMetadata>;
} {
	logger.info("Building function search index...");

	const projectRoot = process.cwd();
	const allFunctions: FunctionMetadata[] = [];

	// Index paths for each module
	const modulePaths: Record<string, string> = {
		coingecko: path.join(projectRoot, "src/mcp-servers/coingecko-mcp/index.ts"),
		debank: path.join(
			projectRoot,
			"src/mcp-servers/debank-mcp/wrappers/index.ts",
		),
		defillama: path.join(
			projectRoot,
			"src/mcp-servers/defillama-mcp/wrappers/index.ts",
		),
		iqai: path.join(projectRoot, "src/mcp-servers/iqai/wrappers/index.ts"),
		etherscan: path.join(projectRoot, "src/mcp-servers/etherscan-mcp/index.ts"),
	};

	// Extract functions from each module
	for (const [module, indexPath] of Object.entries(modulePaths)) {
		const functions = extractFunctionsFromFile(
			indexPath,
			module as "coingecko" | "debank" | "defillama" | "iqai" | "etherscan",
		);
		allFunctions.push(...functions);
		logger.info(`Indexed ${functions.length} functions from ${module}`);
	}

	// Build Lunr index
	const index = lunr(function () {
		this.ref("name");
		this.field("description", { boost: 10 });
		this.field("category", { boost: 2 });
		this.field("module");
		this.field("name");
		this.field("parameters");

		for (const func of allFunctions) {
			this.add(func);
		}
	});

	// Create a map for quick document lookup
	const documents = new Map<string, FunctionMetadata>();
	for (const func of allFunctions) {
		documents.set(func.name, func);
	}

	logger.info(
		`Function index built successfully with ${allFunctions.length} functions`,
	);

	return { index, documents };
}

/**
 * Search the function index
 */
export function searchFunctions(
	index: lunr.Index,
	documents: Map<string, FunctionMetadata>,
	query: string,
	limit = 10,
): FunctionMetadata[] {
	try {
		const results = index.search(query);

		return results
			.slice(0, limit)
			.map((result) => documents.get(result.ref))
			.filter((doc): doc is FunctionMetadata => doc !== undefined);
	} catch (error) {
		logger.error("Search error:", error);
		return [];
	}
}
