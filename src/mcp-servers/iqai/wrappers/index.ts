/**
 * IQ AI MCP TypeScript Wrappers
 *
 * Provides code-execution-friendly wrappers that return raw JSON from the IQ AI
 * API. Functions mirror the MCP server tools but avoid formatted strings so
 * sandbox code can transform and combine data easily.
 */

import type { GetAgentInfoInput } from "./agents/getAgentInfo";
import type { GetAgentStatsInput } from "./agents/getAgentStats";
import type { GetAllAgentsInput } from "./agents/getAllAgents";
import type { GetTopAgentsInput } from "./agents/getTopAgents";
import type { GetHoldingsInput } from "./holdings/getHoldings";
import type { GetAgentLogsInput } from "./iqai-logs/getAgentLogs";

export { getAgentInfo } from "./agents/getAgentInfo";
export { getAgentStats } from "./agents/getAgentStats";
// Agents
export { getAllAgents } from "./agents/getAllAgents";
export { getTopAgents } from "./agents/getTopAgents";
// Holdings
export { getHoldings } from "./holdings/getHoldings";
// Logs
export { getAgentLogs } from "./iqai-logs/getAgentLogs";

// Default export with lazy loading helpers
export default {
	getAllAgents: async (params: GetAllAgentsInput) =>
		(await import("./agents/getAllAgents")).getAllAgents(params),
	getTopAgents: async (params: GetTopAgentsInput) =>
		(await import("./agents/getTopAgents")).getTopAgents(params),
	getAgentInfo: async (params: GetAgentInfoInput) =>
		(await import("./agents/getAgentInfo")).getAgentInfo(params),
	getAgentStats: async (params: GetAgentStatsInput) =>
		(await import("./agents/getAgentStats")).getAgentStats(params),
	getAgentLogs: async (params: GetAgentLogsInput) =>
		(await import("./iqai-logs/getAgentLogs")).getAgentLogs(params),
	getHoldings: async (params: GetHoldingsInput) =>
		(await import("./holdings/getHoldings")).getHoldings(params),
};
