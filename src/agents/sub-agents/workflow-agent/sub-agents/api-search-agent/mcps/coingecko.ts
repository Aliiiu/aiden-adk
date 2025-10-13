import { type BaseTool, McpToolset } from "@iqai/adk";
import { env } from "../../../../../../env";

/**
 * CoinGecko MCP Tools
 *
 * Provides access to cryptocurrency price data, market caps, and trading volumes
 */

const coingeckoMcpToolset = new McpToolset({
	name: "Coingecko MCP Tools",
	description:
		"Tools to fetch real-time cryptocurrency prices, market caps, and trading volumes from CoinGecko",
	cacheConfig: {
		enabled: true,
	},
	transport: {
		mode: "stdio",
		command: "npx",
		args: ["mcp-remote",
        "https://mcp.api.coingecko.com/mcp"],
	},
});

let cachedTools: BaseTool[] | null = null;

export const loadCoingeckoMcpTools = async (): Promise<BaseTool[]> => {
	if (!cachedTools) {
		cachedTools = await coingeckoMcpToolset.getTools();
	}

	return cachedTools;
};
