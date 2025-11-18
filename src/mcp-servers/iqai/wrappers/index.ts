/**
 * IQ AI MCP TypeScript Wrappers
 *
 * Provides code-execution-friendly wrappers that return raw JSON from the IQ AI
 * API. Functions mirror the MCP server tools but avoid formatted strings so
 * sandbox code can transform and combine data easily.
 */

import type { GetAgentInfoInput } from "./agents/getAgentInfo.js";
import type { GetAgentStatsInput } from "./agents/getAgentStats.js";
import type { GetAllAgentsInput } from "./agents/getAllAgents.js";
import type { GetTopAgentsInput } from "./agents/getTopAgents.js";
import type { GetHoldingsInput } from "./holdings/getHoldings.js";
import type { GetAgentLogsInput } from "./iqai-logs/getAgentLogs.js";

export { getAgentInfo } from "./agents/getAgentInfo.js";
export { getAgentStats } from "./agents/getAgentStats.js";
// Agents
export { getAllAgents } from "./agents/getAllAgents.js";
export { getTopAgents } from "./agents/getTopAgents.js";
// Holdings
export { getHoldings } from "./holdings/getHoldings.js";
// Logs
export { getAgentLogs } from "./iqai-logs/getAgentLogs.js";

// Default export with lazy loading helpers
export default {
	getAllAgents: async (params: GetAllAgentsInput) =>
		(await import("./agents/getAllAgents.js")).getAllAgents(params),
	getTopAgents: async (params: GetTopAgentsInput) =>
		(await import("./agents/getTopAgents.js")).getTopAgents(params),
	getAgentInfo: async (params: GetAgentInfoInput) =>
		(await import("./agents/getAgentInfo.js")).getAgentInfo(params),
	getAgentStats: async (params: GetAgentStatsInput) =>
		(await import("./agents/getAgentStats.js")).getAgentStats(params),
	getAgentLogs: async (params: GetAgentLogsInput) =>
		(await import("./iqai-logs/getAgentLogs.js")).getAgentLogs(params),
	getHoldings: async (params: GetHoldingsInput) =>
		(await import("./holdings/getHoldings.js")).getHoldings(params),
};
