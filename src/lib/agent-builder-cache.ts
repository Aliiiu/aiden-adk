import { AgentBuilder } from "@iqai/adk";
import { getLanguageDetectorAgent } from "../agents/sub-agents/language-detector-agent/agent";
import { getWorkflowAgent } from "../agents/sub-agents/workflow-agent/agent";

let cachedAgentBuilder: AgentBuilder<string, true> | null = null;

export async function getSharedAgentBuilder(): Promise<
	AgentBuilder<string, true>
> {
	if (cachedAgentBuilder) {
		return cachedAgentBuilder;
	}

	console.log("🚀 Initializing shared agent builder (one-time setup)...");

	const languageDetectorAgent = getLanguageDetectorAgent();
	const workflowAgent = await getWorkflowAgent();

	const builder = AgentBuilder.create("root_agent").asSequential([
		languageDetectorAgent,
		workflowAgent,
	]);

	cachedAgentBuilder = builder;

	return builder;
}

export async function initializeSharedAgentBuilder() {
	await getSharedAgentBuilder();
}
