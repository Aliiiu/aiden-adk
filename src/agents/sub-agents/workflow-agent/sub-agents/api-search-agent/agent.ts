import { LlmAgent } from "@iqai/adk";
import endent from "endent";
import { env } from "../../../../../env";
import { openrouter } from "../../../../../lib/integrations/openrouter";
import { getCoingeckoTools } from "./tools";

export const getApiSearchAgent = async () => {
	const instruction =
		"Process user requests related to cryptocurrency data and utilize the Coingecko MCP tools for accurate information retrieval.";

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
