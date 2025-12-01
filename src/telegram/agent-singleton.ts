import { AgentBuilder } from "@iqai/adk";
import { randomUUID } from "crypto";
import { getLanguageDetectorAgent } from "../agents/sub-agents/language-detector-agent/agent.js";
import { getWorkflowAgent } from "../agents/sub-agents/workflow-agent/agent.js";

type AgentRunner = Awaited<ReturnType<typeof createTelegramAgent>>["runner"];

async function createTelegramAgent() {
	const languageDetectorAgent = getLanguageDetectorAgent();
	const workflowAgent = await getWorkflowAgent();

	const initialState = {
		query: null,
		detectedLanguage: null,
		processedQuery: null,
		documentContext: null,
		isTelegramRequest: true,
		isTwitterRequest: false,
	};

	return AgentBuilder.create("root_agent")
		.asSequential([languageDetectorAgent, workflowAgent])
		.withQuickSession({
			state: initialState,
			sessionId: randomUUID(),
			appName: "telegram-bot",
		})
		.build();
}

export async function getAgentRunner(): Promise<AgentRunner> {
	console.log("🔄 Creating new agent session...");
	const { runner } = await createTelegramAgent();
	return runner;
}
