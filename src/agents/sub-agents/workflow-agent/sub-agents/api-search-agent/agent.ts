import { LlmAgent } from "@iqai/adk";
import endent from "endent";
import { env } from "../../../../../env";
import { openrouter } from "../../../../../lib/integrations/openrouter";
import { getCoingeckoTools } from "./tools";

export const getApiSearchAgent = async () => {
	const instruction = endent`
    - Process user requests related to cryptocurrency data and utilize the Coingecko MCP tools for accurate information retrieval..
    - If a tool returns an "error" field, respond: "Unable to retrieve that data right now. Please try again shortly."
    - Always call transfer_to_agent(agent_name="workflow_agent") after responding.
  `;

	const coingeckoTools = await getCoingeckoTools();

	return new LlmAgent({
		name: "api_search_agent",
		description:
			"Fetches real-time cryptocurrency prices, DeFi metrics, and blockchain data via MCP APIs including CoinGecko, DefiLlama, Frax Tools, and IQ AI Tools",
		model: openrouter(env.LLM_MODEL),
		tools: [...coingeckoTools],
		instruction,
	});
};
