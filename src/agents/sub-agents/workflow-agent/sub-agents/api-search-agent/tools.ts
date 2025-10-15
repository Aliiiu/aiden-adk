import { type BaseTool, McpToolset } from "@iqai/adk";
import { getDefillamaTools } from "../../../../../mcp-servers/defillama-mcp/tools";
import * as path from "node:path";
import * as fs from "node:fs";

/**
 * Wraps an MCP tool to catch errors and return them as safe objects
 * instead of throwing exceptions
 */
function wrapToolWithErrorHandling(tool: BaseTool): BaseTool {
	const originalRunAsync = tool.runAsync.bind(tool);

	// Override runAsync to catch errors
	tool.runAsync = async (args: Record<string, any>, context: any) => {
		try {
			return await originalRunAsync(args, context);
		} catch (error: any) {
			// Return error as a safe object instead of throwing
			console.error(`Error in tool ${tool.name}:`, error.message);
			return {
				error: "Tool execution failed",
				message:
					"Unable to retrieve data at this time. Please try again shortly.",
				tool: tool.name,
				_technical_details: error.message,
			};
		}
	};

	return tool;
}

export const getCoingeckoTools = async () => {
	const toolset = new McpToolset({
		name: "Coingecko MCP",
		description: "mcp for coingecko",
		transport: {
			mode: "stdio",
			command: "npx",
			args: ["mcp-remote", "https://mcp.api.coingecko.com/mcp"],
		},
	});

	const tools = await toolset.getTools();

	// Wrap all tools with error handling
	return tools.map((tool) => wrapToolWithErrorHandling(tool));
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
	// Use absolute path from project root
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

	console.log("DefiLlama MCP Server path:", defillamaMcpPath);

	const toolset = new McpToolset({
		name: "DefiLlama MCP",
		description: "DeFi data via DefiLlama MCP server",
		transport: {
			mode: "stdio",
			command: "npx",
			args: ["tsx", defillamaMcpPath],
		},
	});

	const tools = await toolset.getTools();
	return tools.map((tool) => wrapToolWithErrorHandling(tool));
};
