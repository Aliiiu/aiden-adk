import { McpToolset } from "@iqai/adk";

export const getCoingeckoTools = () => {
	const toolset = new McpToolset({
		name: "Coingecko MCP",
		description: "mcp for coingecko",
		transport: {
			mode: "stdio",
			command: "npx",
			args: ["mcp-remote", "https://mcp.api.coingecko.com/mcp"],
		},
	});
	return toolset.getTools();
};
