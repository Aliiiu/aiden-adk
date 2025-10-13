import type { BaseTool } from "@iqai/adk";
import { loadCoingeckoMcpTools } from "./coingecko";

/**
 * All MCP tools available to the API Search Agent
 */
export const loadAllMcpTools = async (): Promise<BaseTool[]> => {
	const coingeckoMcpTools = await loadCoingeckoMcpTools();

	return coingeckoMcpTools
};
