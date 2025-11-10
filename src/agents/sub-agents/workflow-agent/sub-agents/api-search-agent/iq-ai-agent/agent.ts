import { LlmAgent } from "@iqai/adk";
import endent from "endent";
import { openrouter } from "@/src/lib/integrations/openrouter";
import { getIqAiToolsViaMcp } from "../tools";

export const getIQAIAgent = async () => {
	const iqAiTools = await getIqAiToolsViaMcp();

	return new LlmAgent({
		name: "iq_ai_agent",
		description: endent`
			An expert analyst of the IQ AI ecosystem.
			This agent specializes in real-time data about IQ AI agents, their stats,
			logs, holdings, and performance metrics. It provides clear, concise,
			data-backed answers using verified on-chain and API data.
		`,
		instruction: endent`
			You are the IQ AI expert agent.
			- Always use the correct tool to fetch real IQ AI data — never fabricate or guess.
			- Show only the final factual answer, without mentioning reasoning, steps, or internal actions.
			- Keep responses short, structured, and directly informative.
			- After completing a task, silently transfer the final result to the **api_search_agent** for further handling.
			- Do not mention or describe this transfer — it happens internally.
		`,
		model: openrouter("openai/gpt-4.1-mini"),
		disallowTransferToPeers: false,
		tools: [...iqAiTools],
	});
};
