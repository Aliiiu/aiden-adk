import { type BaseTool, createTool } from "@iqai/adk";
import dedent from "dedent";
import { z } from "zod";
import { createChildLogger } from "../utils/index.js";
import { createModule, executeInSandbox } from "./sandbox.js";

const logger = createChildLogger("Code Execution Tool");

export interface CodeExecutionToolConfig {
	availableModules?: Record<string, any>;
	timeout?: number;
	allowConsole?: boolean;
}

/**
 * Create a code execution tool with specified configuration
 */
export function createCodeExecutionTool(
	config: CodeExecutionToolConfig = {},
): BaseTool {
	return createTool({
		name: "execute_typescript",
		description: dedent`
			Execute TypeScript code in a sandboxed environment with access to imported modules.

			Available modules to import:
			${Object.keys(config.availableModules || {})
				.map((mod) => `- '${mod}'`)
				.join("\n")}

			Technical capabilities:
			- Full TypeScript support with transpilation to JavaScript
			- Async/await for asynchronous operations
			- Standard array methods (map, filter, reduce, sort, etc.)
			- Promise.all for parallel execution
			- Math operations and data transformations
			- Console logging (output included in results)
			- JSONata for querying and transforming JSON data (import { jsonata } from 'debank' or 'defillama')
			- Timeout: ${config.timeout || 30000}ms

			⚠️ ALL imports must be STATIC at the top of the file!
			⚠️ JSONata is ONLY for debank/defillama! Use native JS for coingecko/iqai!

			⚠️ CRITICAL: Use discover_tools FIRST to get correct parameter names and examples!
			Each function has specific parameter naming.
			The examples in discover_tools show the EXACT correct usage. Follow them precisely.

			✅ CORRECT: JSONata for debank/defillama
			import { getProtocols, jsonata } from 'defillama';
			const protocols = await getProtocols({});
			const filtered = await jsonata('$[tvl > 1000000]').evaluate(protocols);

			✅ CORRECT: Native JS for coingecko/iqai with defensive pattern (NO jsonata!)
			import { someFunction } from 'iqai';
			const response = await someFunction({});
			console.log('Keys:', Array.isArray(response) ? 'N/A' : Object.keys(response));

			// Defensive pattern - extract array from common locations
			let dataArray = [];
			if (Array.isArray(response)) {
			  dataArray = response;
			} else if (response?.agents) {
			  dataArray = response.agents;
			} else if (response?.data) {
			  dataArray = response.data;
			} else if (response) {
			  dataArray = [response];  // Single object
			}
			const item = dataArray.find(a => a?.someField?.includes('search'));

			❌ WRONG: const { getCoinsHistory } = await import('coingecko');  // Dynamic import FORBIDDEN!
			❌ WRONG: import { jsonata } from 'coingecko';  // coingecko doesn't export jsonata!
			❌ WRONG: import { jsonata } from 'iqai';  // iqai doesn't export jsonata!
			❌ WRONG: Filtering without inspecting structure first! like below
			❌ WRONG: const item = Array.isArray(response) ? response.find(...) : null;  // FAILS for nested response data!

			Array operations
			const sum = await jsonata('$sum(items.price)').evaluate(data);
			const first = await jsonata('$[0]').evaluate(data);

			Sorting with null handling (CRITICAL - filter nulls first!)
			WRONG: jsonata('$sort($, function($v) { -$v.change_7d })')  // Fails with negation
			CORRECT: Filter nulls first, sort ascending
			const sorted = await jsonata('$sort($[change_7d != null], function($v) { $v.change_7d })').evaluate(data);
			For descending order, use $reverse()
			const sortedDesc = await jsonata('$reverse($sort($[tvl != null], function($v) { $v.tvl }))').evaluate(data);

			Get top N items (NO [0..9] syntax!)
			const top10 = (sortedDesc || []).slice(0, 10);

			Object construction (NEVER use with $map!)
			WRONG: jsonata('$map($, function($v) { {name: $v.name} })')  // Always fails!
			CORRECT: Just filter arrays
			const filtered = await jsonata('$[tvl > 1000000]').evaluate(data);  // Returns full objects

			Handle undefined JSONata results (when filters match nothing)
			const result = await jsonata('$[price > 100]').evaluate(data);
			WRONG: result.map(...)  // Crashes if undefined!
			CORRECT: const safeResult = result || [];

			IMPORTANT: The code must return { summary: string, data: any } at the end.
			Use import statements to access modules.
		`,
		schema: z.object({
			code: z
				.string()
				.describe(
					"TypeScript code to execute. Must use 'import' syntax for modules (e.g., import { getCoinsMarkets } from 'coingecko'). Should return a result.",
				),
			description: z
				.string()
				.describe("Brief description of what this code will do"),
		}),
		fn: async ({ code, description }) => {
			logger.info(`Executing code: ${description}`);

			const result = await executeInSandbox({
				code,
				description,
				availableModules: config.availableModules,
				timeout: config.timeout || 30000,
			});

			if (!result.success) {
				logger.error(`Code execution failed: ${result.error}`);
				return {
					success: false,
					error: result.error,
					executionTime: result.executionTime,
					consoleOutput: result.consoleOutput,
					hint: "Check your code for syntax errors, ensure all required modules are imported, and verify API parameters are correct.",
				};
			}

			const payload = result.result;
			const failReturn = (message: string) => ({
				success: false,
				error: message,
				executionTime: result.executionTime,
				consoleOutput: result.consoleOutput,
				hint: "Every script must end with: return { summary: string, data: any }.",
			});

			if (payload === undefined) {
				logger.error("Code execution returned undefined payload.");
				return failReturn(
					"Code execution must return { summary: string, data: any }; received undefined.",
				);
			}

			if (
				typeof payload !== "object" ||
				payload === null ||
				Array.isArray(payload)
			) {
				logger.error("Code execution returned a non-object payload:", payload);
				return failReturn(
					"Code execution must return an object shaped { summary: string, data: any }.",
				);
			}

			if (typeof (payload as Record<string, unknown>).summary !== "string") {
				logger.error("Returned payload missing string summary:", payload);
				return failReturn(
					"Returned object must include a string `summary` field.",
				);
			}

			if (!Object.hasOwn(payload, "data")) {
				logger.error("Returned payload missing data field:", payload);
				return failReturn(
					"Returned object must include a `data` field (can be null).",
				);
			}

			return {
				success: true,
				result: payload,
				executionTime: result.executionTime,
				consoleOutput: result.consoleOutput,
			};
		},
	});
}

/**
 * Create a unified code execution tool with access to all MCP servers
 * (CoinGecko, DeBank, DefiLlama)
 */
export async function createMCPCodeExecutionTool(): Promise<BaseTool> {
	const coingeckoModule = await import(
		"../../mcp-servers/coingecko-mcp/index.js"
	);
	const debankModule = await import(
		"../../mcp-servers/debank-mcp/wrappers/index.js"
	);
	const defillamaModule = await import(
		"../../mcp-servers/defillama-mcp/wrappers/index.js"
	);
	const iqaiModule = await import("../../mcp-servers/iqai/wrappers/index.js");

	return createCodeExecutionTool({
		availableModules: {
			coingecko: createModule(coingeckoModule),
			debank: createModule(debankModule),
			defillama: createModule(defillamaModule),
			iqai: createModule(iqaiModule),
		},
		timeout: 60000,
	});
}
