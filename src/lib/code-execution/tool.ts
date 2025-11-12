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

			JSONata usage example:
			import { jsonata } from 'debank';
			const data = await getSomeData();
			const expression = jsonata('$sum(items.price)');
			const result = await expression.evaluate(data);

			The code must return a value at the end. Use import statements to access modules.
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

			return {
				success: true,
				result: result.result,
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

	return createCodeExecutionTool({
		availableModules: {
			coingecko: createModule(coingeckoModule),
			debank: createModule(debankModule),
			defillama: createModule(defillamaModule),
		},
		timeout: 60000,
	});
}
