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
	module: "coingecko" | "debank" | "defillama";
	category: string;
	description: string;
	parameters: string;
	filePath: string;
	example?: string;
}

/**
 * Extract function metadata from TypeScript wrapper files
 */
function extractFunctionsFromFile(
	filePath: string,
	module: "coingecko" | "debank" | "defillama",
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

		// Try to read the actual function file to get JSDoc
		const functionFilePath = path.join(
			path.dirname(filePath),
			category,
			`${functionName}.ts`,
		);

		let description = "";
		let parameters = "";

		if (fs.existsSync(functionFilePath)) {
			const functionContent = fs.readFileSync(functionFilePath, "utf-8");

			// Extract full JSDoc comment block (not just first line)
			// This captures important notes about response structure and field semantics
			const jsdocMatch = functionContent.match(/\/\*\*([\s\S]*?)\*\//);
			if (jsdocMatch) {
				// Clean up JSDoc: remove asterisks, trim lines, join with newlines
				description = jsdocMatch[1]
					.split("\n")
					.map((line) => line.replace(/^\s*\*\s?/, "").trim())
					.filter((line) => line.length > 0)
					.join("\n");
			}

			// Extract function parameters from the function signature
			const paramsMatch = functionContent.match(
				/export\s+(?:async\s+)?function\s+\w+\s*\(\s*(?:params[?:]?\s*:\s*)?(\{[^}]+\}|\w+)/,
			);
			if (paramsMatch) {
				parameters = paramsMatch[1]
					.replace(/\s+/g, " ")
					.replace(/[{}]/g, "")
					.trim();
			}
		}

		functions.push({
			name: functionName,
			module,
			category,
			description:
				description || `${category} function from ${module}`.replace(/-/g, " "),
			parameters: parameters || "see function signature",
			filePath: functionFilePath,
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
	};

	// Extract functions from each module
	for (const [module, indexPath] of Object.entries(modulePaths)) {
		const functions = extractFunctionsFromFile(
			indexPath,
			module as "coingecko" | "debank" | "defillama",
		);
		allFunctions.push(...functions);
		logger.info(`Indexed ${functions.length} functions from ${module}`);
	}

	// Build Lunr index
	const index = lunr(function () {
		this.ref("name");
		this.field("name", { boost: 10 }); // Function name is most important
		this.field("module", { boost: 5 });
		this.field("category", { boost: 7 });
		this.field("description", { boost: 3 });
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
