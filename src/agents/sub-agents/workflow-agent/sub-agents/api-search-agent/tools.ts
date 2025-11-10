import * as fs from "node:fs";
import * as path from "node:path";
import { type BaseTool, McpToolset, type ToolContext } from "@iqai/adk";
import { createChildLogger } from "../../../../../lib/utils/logger";
import { getDebankTools } from "../../../../../mcp-servers/debank-mcp/tools";
import { getDefillamaTools } from "../../../../../mcp-servers/defillama-mcp/tools";

const logger = createChildLogger("API Search Tools");

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
