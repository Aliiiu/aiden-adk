import { type BaseTool, McpToolset } from "@iqai/adk";

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
