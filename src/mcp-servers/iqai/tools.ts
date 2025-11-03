import type { FastMCP } from "fastmcp";
import {
	getAgentInfoTool,
	getAgentLogsTool,
	getAgentStatsTool,
	getAllAgentsTool,
	getHoldingsTool,
	getTopAgentsTool,
} from "../../agents/sub-agents/workflow-agent/sub-agents/api-search-agent/iq-ai-agent/tools.js";

type InferSchemaType = Parameters<FastMCP["addTool"]>[0]["parameters"];
type FastMCPTool = Parameters<FastMCP["addTool"]>[0];

interface ADKToolDeclaration {
	parameters?: Record<string, any> | InferSchemaType;
}

interface ADKTool {
	name: string;
	description: string;
	getDeclaration?: () => ADKToolDeclaration | null;
	safeExecute: (params: Record<string, any>, context: any) => Promise<any>;
}

/**
 * Converts ADK tool parameters to FastMCP StandardSchemaV1 format
 */
function convertToStandardSchema(
	declaration?: ADKToolDeclaration | null,
): InferSchemaType {
	let parameters: InferSchemaType;

	if (declaration?.parameters) {
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

	return parameters;
}

/**
 * Tool definitions for FastMCP (MCP Server usage)
 * These are exported as FastMCP-compatible tool objects
 */
export function getIqAiTools(): FastMCPTool[] {
	const adkTools: ADKTool[] = [
		getAllAgentsTool,
		getTopAgentsTool,
		getAgentInfoTool,
		getAgentStatsTool,
		getAgentLogsTool,
		getHoldingsTool,
	];

	return adkTools.map((tool): FastMCPTool => {
		const declaration = tool.getDeclaration ? tool.getDeclaration() : undefined;
		const parameters = convertToStandardSchema(declaration);

		return {
			name: tool.name,
			description: tool.description,
			parameters,
			execute: async (params) => {
				const executeParams = params as Record<string, any>;
				try {
					return await tool.safeExecute(executeParams, {} as any);
				} catch (error: any) {
					const message =
						error instanceof Error ? error.message : String(error);
					return `Error executing ${tool.name}: ${message}`;
				}
			},
		};
	});
}
