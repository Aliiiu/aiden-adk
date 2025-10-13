import { AgentBuilder } from "@iqai/adk";
import { getLanguageDetectorAgent } from "./sub-agents/language-detector-agent/agent";
import { getWorkflowAgent } from "./sub-agents/workflow-agent/agent";

export const getRootAgent = async () => {
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
		})
		.build();
};
