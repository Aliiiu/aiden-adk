import { AgentBuilder } from "@iqai/adk";
import { getLanguageDetectorAgent } from "../agents/sub-agents/language-detector-agent/agent";
import { getWorkflowAgent } from "../agents/sub-agents/workflow-agent/agent";

/**
 * Creates a fresh AgentBuilder with .asSequential() to preserve multi-agent typing.
 *
 * CRITICAL: We create a NEW agent hierarchy each time, but MCP tools are cached automatically.
 * - According to ADK docs: "McpToolset caches tools automatically, no manual caching needed"
 * - .asSequential() returns AgentBuilder<string, true> preserving multi-agent typing
 * - Each call creates fresh agent instances to avoid "already has parent" error
 * - Multi-agent typing ensures runner.ask() returns MultiAgentResponse[]
 *
 * Trade-offs:
 * - ✅ MCP tools are automatically cached by the ADK (no performance penalty)
 * - ✅ Preserves multi-agent response typing (M=true)
 * - ✅ Creates isolated sessions per request
 * - ✅ No "already has parent" error (fresh agents each time)
 * - ⚠️ Creates new agent instances per request (lightweight operation)
 */
export async function getSharedAgentBuilder() {
	const languageDetectorAgent = getLanguageDetectorAgent();
	const workflowAgent = await getWorkflowAgent();

	return AgentBuilder.create("root_agent").asSequential([
		languageDetectorAgent,
		workflowAgent,
	]);
}

export async function initializeSharedAgentBuilder() {
	await getWorkflowAgent();
	console.log("✅ Shared agent system initialized and ready");
}
