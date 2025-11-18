import * as fs from "node:fs";
import * as path from "node:path";
import {
	type BaseTool,
	createTool,
	McpToolset,
	type ToolContext,
} from "@iqai/adk";
import dedent from "dedent";
import type lunr from "lunr";
import { z } from "zod";
import { createMCPCodeExecutionTool } from "../../../../../lib/code-execution/index.js";
import {
	buildFunctionIndex,
	type FunctionMetadata,
	searchFunctions,
} from "../../../../../lib/function-index/index.js";
import { createChildLogger } from "../../../../../lib/utils/logger";
import { getDebankTools } from "../../../../../mcp-servers/debank-mcp/tools";
import { getDefillamaTools } from "../../../../../mcp-servers/defillama-mcp/tools";

const logger = createChildLogger("API Search Tools");

// Singleton: Build index only once
let functionIndex: lunr.Index | null = null;
let functionDocuments: Map<string, FunctionMetadata> | null = null;

function getFunctionIndex() {
	if (!functionIndex || !functionDocuments) {
		logger.info("Building function search index (first time only)...");
		const { index, documents } = buildFunctionIndex();
		functionIndex = index;
		functionDocuments = documents;
	}
	return { index: functionIndex, documents: functionDocuments };
}

/**
 * Extract user query from ADK ToolContext
 */
function extractQueryFromContext(context?: ToolContext): string | null {
	if (!context?.userContent?.parts) return null;
	const firstPart = context.userContent.parts[0];
	return firstPart?.text || null;
}

/**
 * Injects user query (_userQuery) into MCP tool calls for contextual filtering
 */
function wrapMcpToolWithQueryInjection(tool: BaseTool): BaseTool {
	const originalRunAsync = tool.runAsync.bind(tool);

	tool.runAsync = async (
		args: Record<string, unknown>,
		context: ToolContext,
	) => {
		const query = extractQueryFromContext(context);
		if (query) logger.info(`Extracted user query for tool ${tool.name}`);

		const enhancedArgs = query ? { ...args, _userQuery: query } : args;
		return await originalRunAsync(enhancedArgs, context);
	};

	return tool;
}

/**
 * Wraps an MCP tool to catch errors safely and return structured messages.
 */
function wrapToolWithErrorHandling(tool: BaseTool): BaseTool {
	const originalRunAsync = tool.runAsync.bind(tool);

	tool.runAsync = async (
		args: Record<string, unknown>,
		context: ToolContext,
	) => {
		try {
			return await originalRunAsync(args, context);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			console.error(`Error in tool ${tool.name}:`, errorMessage);
			return {
				error: "Tool execution failed",
				message:
					"Unable to retrieve data at this time. Please try again shortly.",
				tool: tool.name,
				_technical_details: errorMessage,
			};
		}
	};

	return tool;
}

/**
 * Load CoinGecko tools via MCP
 */
export const getCoingeckoTools = async (): Promise<BaseTool[]> => {
	try {
		const toolset = new McpToolset({
			name: "Coingecko MCP",
			description: "mcp for coingecko",
			debug: false,
			transport: {
				mode: "stdio",
				command: "npx",
				args: ["mcp-remote", "https://mcp.api.coingecko.com/mcp"],
			},
			retryOptions: {
				maxRetries: 1,
				initialDelay: 1000,
			},
		});

		const tools = await toolset.getTools();
		logger.info(`Loaded ${tools.length} CoinGecko tools`);
		return tools.map((tool) =>
			wrapToolWithErrorHandling(wrapMcpToolWithQueryInjection(tool)),
		);
	} catch (error) {
		logger.warn("Failed to load CoinGecko MCP tools", error as Error);
		return [];
	}
};

/**
 * Load DefiLlama tools (direct import)
 */
export const getDefillamaToolsWrapped = (): BaseTool[] => {
	const tools = getDefillamaTools();
	return tools.map((tool: BaseTool) => wrapToolWithErrorHandling(tool));
};

/**
 * Load DefiLlama tools via MCP
 */
export const getDefillamaToolsViaMcp = async (): Promise<BaseTool[]> => {
	try {
		const projectRoot = process.cwd();
		const defillamaMcpPath = path.join(
			projectRoot,
			"src/mcp-servers/defillama-mcp/index.ts",
		);

		if (!fs.existsSync(defillamaMcpPath)) {
			throw new Error(`DefiLlama MCP server not found at: ${defillamaMcpPath}`);
		}

		const toolset = new McpToolset({
			name: "DefiLlama MCP",
			description: "DeFi data via DefiLlama MCP server",
			debug: false,
			transport: {
				mode: "stdio",
				command: "npx",
				args: ["tsx", defillamaMcpPath],
			},
			retryOptions: {
				maxRetries: 1,
				initialDelay: 1000,
			},
		});

		const tools = await toolset.getTools();
		logger.info(`Loaded ${tools.length} DefiLlama tools via MCP`);
		return tools.map((tool) =>
			wrapToolWithErrorHandling(wrapMcpToolWithQueryInjection(tool)),
		);
	} catch (error) {
		logger.warn("Failed to load DefiLlama tools via MCP", error as Error);
		return getDefillamaToolsWrapped();
	}
};

/**
 * Load IQ AI tools via MCP
 */
export const getIqAiToolsViaMcp = async (): Promise<BaseTool[]> => {
	try {
		const projectRoot = process.cwd();
		const iqAiMcpPath = path.join(projectRoot, "src/mcp-servers/iqai/index.ts");

		if (!fs.existsSync(iqAiMcpPath)) {
			throw new Error(
				`IQ AI MCP server not found at: ${iqAiMcpPath}\nCurrent working directory: ${projectRoot}`,
			);
		}

		const toolset = new McpToolset({
			name: "IQ AI MCP",
			description: "IQ AI agent data via IQ AI MCP server",
			debug: false,
			transport: {
				mode: "stdio",
				command: "npx",
				args: ["tsx", iqAiMcpPath],
			},
			retryOptions: {
				maxRetries: 1,
				initialDelay: 1000,
			},
		});

		const tools = await toolset.getTools();
		logger.info(`Loaded ${tools.length} IQ AI tools via MCP`);
		return tools.map((tool) =>
			wrapToolWithErrorHandling(wrapMcpToolWithQueryInjection(tool)),
		);
	} catch (error) {
		logger.warn("Failed to load IQ AI tools via MCP", error as Error);
		return [];
	}
};

/**
 * Load DeBank tools via MCP
 */
export const getDebankToolsViaMcp = async (): Promise<BaseTool[]> => {
	try {
		const projectRoot = process.cwd();
		const debankMcpPath = path.join(
			projectRoot,
			"src/mcp-servers/debank-mcp/index.ts",
		);

		if (!fs.existsSync(debankMcpPath)) {
			throw new Error(
				`DeBank MCP server not found at: ${debankMcpPath}\nCurrent working directory: ${projectRoot}`,
			);
		}

		const toolset = new McpToolset({
			name: "DeBank MCP",
			description: "Blockchain and DeFi user data via DeBank MCP server",
			transport: {
				mode: "stdio",
				command: "npx",
				args: ["tsx", debankMcpPath],
			},
			timeout: 120000,
		});

		const tools = await toolset.getTools();
		logger.info(`Loaded ${tools.length} DeBank tools via MCP`);
		return tools.map((tool) =>
			wrapToolWithErrorHandling(wrapMcpToolWithQueryInjection(tool)),
		);
	} catch (error) {
		logger.warn("Failed to load DeBank tools via MCP", error as Error);
		const tools = getDebankTools();
		return tools.map((tool: BaseTool) => wrapToolWithErrorHandling(tool));
	}
};

/**
 * Create a tool discovery helper using Lunr.js search index
 * Allows agents to search for functions by keywords without exhaustive listings
 */
export const getDiscoverToolsTool = () => {
	const tool = createTool({
		name: "discover_tools",
		description:
			"Search for available API functions by keywords. Returns exact function names with descriptions, parameters, and usage examples. Use this to find the right function before calling it.",
		schema: z.object({
			query: z
				.string()
				.describe(
					"Search query (e.g., 'protocol tvl', 'wallet balance', 'price chart'). Use keywords to find functions.",
				),
			module: z
				.enum(["coingecko", "debank", "defillama"])
				.optional()
				.describe("Filter results to a specific module (optional)"),
			limit: z
				.number()
				.optional()
				.default(10)
				.describe("Maximum number of results to return (default: 10)"),
		}),
		fn: async ({ query, module, limit = 10 }) => {
			try {
				const { index, documents } = getFunctionIndex();

				// Build search query with optional module filter
				let searchQuery = query;
				if (module) {
					searchQuery = `${query} +module:${module}`;
				}

				// Search the index
				const results = searchFunctions(index, documents, searchQuery, limit);

				if (results.length === 0) {
					return {
						summary: `No functions found matching "${query}"`,
						suggestion: dedent`
							Try broader search terms like:
							- "price" for price-related functions
							- "protocol" for protocol/TVL data
							- "wallet" or "user" for wallet/balance functions
							- "pool" or "dex" for DEX/liquidity data
						`,
						availableModules: ["coingecko", "debank", "defillama"],
					};
				}

				// Format results for the agent
				const functionList = results.map((func) => ({
					name: func.name,
					module: func.module,
					category: func.category,
					description: func.description,
					parameters: func.parameters,
					importExample: `import { ${func.name} } from '${func.module}';`,
					usageExample: `const data = await ${func.name}({ /* params */ });`,
				}));

				return {
					summary: `Found ${results.length} function(s) matching "${query}"`,
					functions: functionList,
					nextSteps: dedent`
						To use any of these functions:
						1. Import it: import { functionName } from 'moduleName';
						2. Call it with appropriate parameters
						3. Always return { summary: string, data: any } from execute_typescript
					`,
				};
			} catch (error) {
				logger.error("Discovery tool error:", error as Error);
				return {
					error: "Discovery failed",
					message: "Unable to search function index at this time",
					details: error instanceof Error ? error.message : String(error),
				};
			}
		},
	});

	return wrapToolWithErrorHandling(tool);
};

/**
 * Get Code Execution Tool for MCP APIs
 * Now includes both CoinGecko and DeBank modules
 */
export const getCodeExecutionTool = async () => {
	try {
		const tool = await createMCPCodeExecutionTool();
		logger.info("Loaded unified code execution tool");
		return [wrapToolWithErrorHandling(tool)];
	} catch (error) {
		logger.warn("Failed to load code execution tool", error as Error);
		return [];
	}
};
