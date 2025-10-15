
import { FastMCP } from "fastmcp";
import { iqAITools } from "./iq-ai-tools";


/**
 * Initializes and starts the IQ AI MCP (Model Context Protocol) Server.
 *
 * This server provides comprehensive IQ AI agent data including market stats,
 * agent information, holdings, logs, and top performers through the MCP protocol.
 * The server communicates via stdio transport, making it suitable for integration
 * with MCP clients and AI agents.
 */
async function main() {
  console.log("Initializing IQ AI MCP Server...");

  const server = new FastMCP({
    name: "IQ AI MCP Server",
    version: "1.0.0",
  });

  // Register all IQ AI tools
  for (const tool of iqAITools) {
    server.addTool({
      name: tool.name,
      description: tool.description,
      parameters: tool.getDeclaration()?.parameters ?? {},
      execute: async (params: any) => {
        try {
          const result = await tool.safeExecute(params, {});
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          return `Error executing ${tool.name}: ${errorMessage}`;
        }
      },
    });
  }

  try {
    await server.start({
      transportType: "stdio",
    });
    console.log("✅ IQ AI MCP Server started successfully over stdio.");
    console.log("   You can now connect to it using an MCP client.");
    console.log("   Available tools:", iqAITools.length);
    console.log("\n   Tools:");
    iqAITools.forEach((tool, idx) => {
      console.log(`   ${idx + 1}. ${tool.name}`);
    });
  } catch (error) {
    console.error("❌ Failed to start IQ AI MCP Server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(
    "❌ An unexpected error occurred in the IQ AI MCP Server:",
    error
  );
  process.exit(1);
});