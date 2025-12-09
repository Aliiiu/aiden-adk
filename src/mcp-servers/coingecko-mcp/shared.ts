import { McpToolset } from "@iqai/adk";
import { createChildLogger } from "../../lib/utils/index";

const logger = createChildLogger("CoinGecko MCP Shared");

// Singleton toolset instance
let toolsetInstance: McpToolset | null = null;
let toolsCache: Map<string, any> | null = null;

/**
 * Get or create the CoinGecko MCP toolset
 */
export async function getToolset(): Promise<McpToolset> {
	if (!toolsetInstance) {
		logger.debug("Initializing CoinGecko MCP toolset...");
		toolsetInstance = new McpToolset({
			name: "Coingecko MCP",
			description: "mcp for coingecko",
			debug: false,
			transport: {
				mode: "stdio",
				command: "npx",
				args: ["mcp-remote", "https://mcp.api.coingecko.com/mcp"],
			},
			timeout: 120000,
			retryOptions: {
				maxRetries: 1,
				initialDelay: 1000,
			},
		});

		// Preload tools into cache
		logger.debug("Preloading CoinGecko tools...");
		const tools = await toolsetInstance.getTools();
		toolsCache = new Map();
		for (const tool of tools) {
			toolsCache.set(tool.name, tool);
		}
		logger.info(`Loaded ${tools.length} CoinGecko tools`);
	}

	return toolsetInstance;
}

/**
 * Execute a CoinGecko MCP tool by name
 */
export async function executeTool(
	toolName: string,
	params: Record<string, any>,
): Promise<any> {
	// Ensure toolset is initialized
	await getToolset();

	if (!toolsCache) {
		throw new Error("Tools cache not initialized");
	}

	const tool = toolsCache.get(toolName);
	if (!tool) {
		const availableTools = Array.from(toolsCache.keys()).slice(0, 10);
		throw new Error(
			`Tool '${toolName}' not found. Available tools include: ${availableTools.join(", ")}...`,
		);
	}

	logger.debug(`Executing tool: ${toolName}`, params);

	try {
		const result = await tool.runAsync(params, {});
		logger.debug(`Tool ${toolName} completed successfully`);

		// Parse the MCP result structure
		// MCP tools return { content: [{ type: 'text', text: '...' }] }
		if (result && Array.isArray(result.content)) {
			const textContent = result.content.find((c: any) => c.type === "text");
			if (textContent?.text) {
				try {
					// Try to parse as JSON
					return JSON.parse(textContent.text);
				} catch {
					// If not JSON, return the raw text
					return textContent.text;
				}
			}
		}

		// If no content array, return as-is
		return result;
	} catch (error) {
		logger.error(`Tool ${toolName} failed:`, error);
		throw error;
	}
}
