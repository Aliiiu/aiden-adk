import * as fs from "node:fs";
import * as path from "node:path";
import { type BaseTool, McpToolset, type ToolContext } from "@iqai/adk";
import { createChildLogger } from "../../../../../lib/utils/logger";
import { getDebankTools } from "../../../../../mcp-servers/debank-mcp/tools";
import { getDefillamaTools } from "../../../../../mcp-servers/defillama-mcp/tools";

const logger = createChildLogger("API Search Tools");

/**
 * Wraps an MCP tool to catch errors and return them as safe objects
 * instead of throwing exceptions
 */
function wrapToolWithErrorHandling(tool: BaseTool): BaseTool {
	const originalRunAsync = tool.runAsync.bind(tool);

	// Override runAsync to catch errors
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
			debug: false, // Set to true for detailed MCP logs
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
		return tools.map((tool) => wrapToolWithErrorHandling(tool));
	} catch (error) {
		logger.warn("Failed to load DefiLlama tools via MCP", error as Error);
		// Fallback to direct import if MCP fails
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
			debug: false, // Set to true for detailed MCP logs
			transport: {
				mode: "stdio",
				command: "npx",
				args: ["tsx", debankMcpPath],
			},
			retryOptions: {
				maxRetries: 1,
				initialDelay: 1000,
			},
		});

		const tools = await toolset.getTools();
		logger.info(`Loaded ${tools.length} DeBank tools via MCP`);
		return tools.map((tool) => wrapToolWithErrorHandling(tool));
	} catch (error) {
		logger.warn("Failed to load DeBank tools via MCP", error as Error);
		// Fallback to direct import if MCP fails
		const tools = getDebankTools();
		return tools.map((tool: BaseTool) => wrapToolWithErrorHandling(tool));
	}
};
