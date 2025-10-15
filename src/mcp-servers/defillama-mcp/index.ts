#!/usr/bin/env node
import { FastMCP } from "fastmcp";
import { defillamaTools } from "./tools";

/**
 * Initializes and starts the DefiLlama MCP (Model Context Protocol) Server.
 *
 * This server provides comprehensive DeFi data including TVL, prices, yields,
 * volumes, and protocol metrics through the MCP protocol. The server communicates
 * via stdio transport, making it suitable for integration with MCP clients and AI agents.
 */
async function main() {
	console.log("Initializing DefiLlama MCP Server...");

	const server = new FastMCP({
		name: "DefiLlama MCP Server",
		version: "1.0.0",
	});

	for (const tool of defillamaTools) {
		server.addTool(tool as any); // Type cast to avoid union type issues
	}

	try {
		await server.start({
			transportType: "stdio",
		});
		console.log("✅ DefiLlama MCP Server started successfully over stdio.");
		console.log("   You can now connect to it using an MCP client.");
		console.log(`   Available tools: ${defillamaTools.length}`);
	} catch (error) {
		console.error("❌ Failed to start DefiLlama MCP Server:", error);
		process.exit(1);
	}
}

main().catch((error) => {
	console.error(
		"❌ An unexpected error occurred in the DefiLlama MCP Server:",
		error,
	);
	process.exit(1);
});
