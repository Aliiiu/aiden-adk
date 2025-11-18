import { FastMCP } from "fastmcp";
import { createChildLogger } from "../../lib/utils/logger.js";
import { getIqAiTools } from "./tools/index.js";

const logger = createChildLogger("IQ AI MCP");

/**
 * Initializes and starts the IQ AI MCP (Model Context Protocol) Server.
 *
 * This server provides comprehensive IQ AI agent data including agent discovery,
 * market statistics, holdings tracking, and activity logs through the MCP protocol.
 * The server communicates via stdio transport, making it suitable for integration
 * with MCP clients and AI agents.
 */
async function main(): Promise<void> {
	logger.info("Initializing IQ AI MCP Server...");

	const server = new FastMCP({
		name: "IQ AI MCP Server",
		version: "1.0.0",
	});

	const tools = getIqAiTools();

	for (const tool of tools) {
		server.addTool(tool);
	}

	try {
		await server.start({
			transportType: "stdio",
		});

		tools.forEach((tool, idx) => {
			logger.info(`   ${idx + 1}. ${tool.name}`);
		});
	} catch (error) {
		logger.error("Failed to start server", error as Error);
		process.exit(1);
	}
}

main().catch((error: Error) => {
	logger.error("Unexpected error occurred", error);
	process.exit(1);
});
