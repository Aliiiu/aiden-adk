import { AgentBuilder, SequentialAgent } from "@iqai/adk";
import { getLanguageDetectorAgent } from "../agents/sub-agents/language-detector-agent/agent";
import { getWorkflowAgent } from "../agents/sub-agents/workflow-agent/agent";

/**
 * Cached root agent built only once at initialization.
 *
 * The agent hierarchy (including expensive MCP tool loading) is built once,
 * then reused across all requests with different sessions for isolation.
 *
 * This pattern follows ADK best practices:
 * - BaseAgent instances (like SequentialAgent) are stateless and can be safely reused
 * - Sessions hold conversation state and are created per-request
 * - MCP tools are cached within sub-agents (automatic in McpToolset)
 */
let cachedRootAgent: SequentialAgent | null = null;

/**
 * Creates the root agent system once, including all sub-agents and tools.
 */
async function buildRootAgent(): Promise<SequentialAgent> {
	console.log("🚀 Building root agent system (one-time setup)...");
	const languageDetectorAgent = getLanguageDetectorAgent();
	const workflowAgent = await getWorkflowAgent();

	const rootAgent = new SequentialAgent({
		name: "root_agent",
		description: "",
		subAgents: [languageDetectorAgent, workflowAgent],
	});

	return rootAgent;
}

async function getSharedRootAgent(): Promise<SequentialAgent> {
	if (!cachedRootAgent) {
		cachedRootAgent = await buildRootAgent();
	}
	return cachedRootAgent;
}

/**
 * Creates an AgentBuilder with the cached root agent.
 *
 * IMPORTANT: This returns a builder that uses AgentBuilder.withAgent(),
 * which allows the same agent instance to be reused with different sessions.
 *
 * Each call to .withQuickSession().build() on the returned builder creates
 * a NEW isolated session while reusing the cached agent hierarchy.
 *
 * Benefits:
 * - Agent hierarchy built once (cheap reuse)
 * - MCP tools loaded once (expensive, cached in McpToolset)
 * - Each .build() creates isolated session (prevents state pollution)
 */
export async function getSharedAgentBuilder() {
	const rootAgent = await getSharedRootAgent();

	// AgentBuilder.withAgent() allows reusing the same agent with new sessions
	return AgentBuilder.withAgent(rootAgent);
}

export async function initializeSharedAgentBuilder() {
	await getSharedRootAgent();
	console.log("✅ Shared agent system initialized and ready");
}
