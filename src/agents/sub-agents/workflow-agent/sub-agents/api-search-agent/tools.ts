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
 * The userContent contains the original user message that started the invocation
 */
function extractQueryFromContext(context?: ToolContext): string | null {
	if (!context?.userContent?.parts) return null;
	const firstPart = context.userContent.parts[0];
	return firstPart?.text || null;
}

/**
 * Wraps an MCP tool to inject user query for data filtering
 * This wrapper extracts the user's original query from context and passes it
 * as _userQuery parameter to MCP tools for context-aware filtering
 */
function wrapMcpToolWithQueryInjection(tool: BaseTool): BaseTool {
	const originalRunAsync = tool.runAsync.bind(tool);

	tool.runAsync = async (
		args: Record<string, unknown>,
		context: ToolContext,
	) => {
		// Extract user query from context
		const query = extractQueryFromContext(context);
		if (query) {
			logger.info(`Extracted user query for tool ${tool.name}`);
		}

		const enhancedArgs = query ? { ...args, _userQuery: query } : args;
		return await originalRunAsync(enhancedArgs, context);
	};

	return tool;
}

/**
 * Wraps an MCP tool to catch errors and return them as safe, structured objects.
 */
function wrapToolWithErrorHandling(tool: BaseTool): BaseTool {
	const originalRunAsync = tool.runAsync.bind(tool);

	// Override runAsync to catch errors and extract MCP content
	tool.runAsync = async (
		args: Record<string, unknown>,
		context: ToolContext,
	) => {
		try {
			return await originalRunAsync(args, context);
		} catch (error) {
			// Return error as a safe object instead of throwing
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

export const getCoingeckoTools = async () => {
	try {
		const toolset = new McpToolset({
			name: "Coingecko MCP",
			description: "mcp for coingecko",
			debug: false, // Set to true to see detailed MCP logs
			transport: {
				mode: "stdio",
				command: "npx",
				args: ["mcp-remote", "https://mcp.api.coingecko.com/mcp"],
			},
			timeout: 120000, // 2 minutes (120s) for remote API calls
			retryOptions: {
				maxRetries: 1,
				initialDelay: 1000,
			},
		});

		const tools = await toolset.getTools();
		logger.info(`Loaded ${tools.length} CoinGecko tools`);

		return tools.map((tool) => wrapToolWithErrorHandling(tool));
	} catch (error) {
		logger.warn("Failed to load CoinGecko MCP tools", error as Error);
		return [];
	}
};

/**
 * Get DefiLlama tools
 *
 * Two approaches available:
 * 1. Direct import (current) - Simpler, faster, already working
 * 2. MCP Server via McpToolset - True MCP protocol, can be shared with other clients
 */
export const getDefillamaToolsWrapped = () => {
	// OPTION 1: Direct import (current implementation - simpler and faster)
	const tools = getDefillamaTools();
	return tools.map((tool: BaseTool) => wrapToolWithErrorHandling(tool));
};

/**
 * Alternative: Get DefiLlama tools via MCP Server
 * Replace getDefillamaToolsWrapped() usage in agent.ts with this function
 * to use the true MCP protocol approach
 */
export const getDefillamaToolsViaMcp = async () => {
	try {
		const projectRoot = process.cwd();
		const defillamaMcpPath = path.join(
			projectRoot,
			"src/mcp-servers/defillama-mcp/index.ts",
		);

		// Verify file exists
		if (!fs.existsSync(defillamaMcpPath)) {
			throw new Error(
				`DefiLlama MCP server not found at: ${defillamaMcpPath}\nCurrent working directory: ${projectRoot}`,
			);
		}

		const toolset = new McpToolset({
			name: "DefiLlama MCP",
			description: "DeFi data via DefiLlama MCP server",
			transport: {
				mode: "stdio",
				command: "npx",
				args: ["tsx", defillamaMcpPath],
			},
			timeout: 120000, // 2 minutes (120s) for large responses with AI processing
		});

		const tools = await toolset.getTools();
		logger.info(`Loaded ${tools.length} DefiLlama tools via MCP`);
		// Apply both wrappers: query injection first, then error handling
		return tools.map((tool) =>
			wrapToolWithErrorHandling(wrapMcpToolWithQueryInjection(tool)),
		);
	} catch (error) {
		logger.warn("Failed to load DefiLlama tools via MCP", error as Error);
		return getDefillamaToolsWrapped();
	}
};

/**
 * Get DeBank tools via MCP Server
 * Provides comprehensive blockchain and DeFi user data including:
 * - Chain information and supported networks
 * - Protocol details and TVL data
 * - User portfolios, balances, and positions
 * - Token holdings and NFT collections
 * - Transaction history and authorizations
 * - Gas prices and transaction simulation
 */
export const getDebankToolsViaMcp = async () => {
	try {
		const projectRoot = process.cwd();
		const debankMcpPath = path.join(
			projectRoot,
			"src/mcp-servers/debank-mcp/index.ts",
		);

		// Verify file exists
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
			timeout: 120000, // 2 minutes (120s) for large responses with AI processing
		});

		const tools = await toolset.getTools();
		logger.info(`Loaded ${tools.length} DeBank tools via MCP`);
		// Apply both wrappers: query injection first, then error handling
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
