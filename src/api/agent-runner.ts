import { randomUUID } from "node:crypto";
import { AgentBuilder } from "@iqai/adk";
import { getLanguageDetectorAgent } from "../agents/sub-agents/language-detector-agent/agent";
import { getWorkflowAgent } from "../agents/sub-agents/workflow-agent/agent";

type AgentRunner = Awaited<ReturnType<typeof createApiAgent>>["runner"];

async function createApiAgent() {
	const languageDetectorAgent = getLanguageDetectorAgent();
	const workflowAgent = await getWorkflowAgent();

	const initialState = {
		query: null,
		detectedLanguage: null,
		processedQuery: null,
		documentContext: null,
		isTelegramRequest: false,
		isTwitterRequest: false,
	};

	return AgentBuilder.create("root_agent")
		.asSequential([languageDetectorAgent, workflowAgent])
		.withQuickSession({
			state: initialState,
			sessionId: randomUUID(),
			appName: "api-server",
		})
		.build();
}

export async function getApiAgentRunner(): Promise<AgentRunner> {
	console.log("🔄 Creating new API agent session...");
	const { runner } = await createApiAgent();
	return runner;
}
