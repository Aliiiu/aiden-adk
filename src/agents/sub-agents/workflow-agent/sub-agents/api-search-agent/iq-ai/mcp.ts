import { FastMCP } from "fastmcp";
import { iqAITools } from "./iq-ai-tools";

type InferSchemaType = Parameters<FastMCP["addTool"]>[0]["parameters"];

async function main() {
  console.log("Initializing IQ AI MCP Server...");

  const server = new FastMCP({
    name: "IQ AI MCP Server",
    version: "1.0.0",
  });

  for (const tool of iqAITools) {
    const declaration = tool.getDeclaration ? tool.getDeclaration() : undefined;
    let parameters: InferSchemaType;

    if (declaration && declaration.parameters) {
      if ("~standard" in declaration.parameters) {
        parameters = declaration.parameters as InferSchemaType;
      } else {
        parameters = {
          "~standard": "StandardSchemaV1",
          type: "object",
          properties: declaration.parameters,
        } as unknown as InferSchemaType;
      }
    } else {
      parameters = {
        "~standard": "StandardSchemaV1",
        type: "object",
        properties: {},
      } as unknown as InferSchemaType;
    }

    server.addTool({
      name: tool.name,
      description: tool.description,
      parameters,
      execute: async (params) => {
        const executeParams = params as Record<string, any>
        try {
          return await tool.safeExecute(executeParams, {} as any);
        } catch (error: any) {
          const message = error instanceof Error ? error.message : String(error);
          return `Error executing ${tool.name}: ${message}`;
        }
      },
    });
  }

  try {
    await server.start({ transportType: "stdio" });
    console.log("✅ IQ AI MCP Server started successfully over stdio.");
    console.log("   Available tools:", iqAITools.length);
    iqAITools.forEach((tool, idx) => console.log(`   ${idx + 1}. ${tool.name}`));
  } catch (error) {
    console.error("❌ Failed to start IQ AI MCP Server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Unexpected error in IQ AI MCP Server:", error);
  process.exit(1);
});
