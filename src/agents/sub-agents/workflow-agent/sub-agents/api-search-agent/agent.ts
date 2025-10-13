import { LlmAgent } from "@iqai/adk";
import endent from "endent";
import { env } from "../../../../../env";
import { openrouter } from "../../../../../lib/integrations/openrouter";
import { getCoingeckoTools } from "./tools";

export const getApiSearchAgent = async () => {
	const instruction = endent`
    You are an API intelligence specialist for real-time cryptocurrency and DeFi data.

    ## Primary Expertise Areas
    - Process user requests related to cryptocurrency data and utilize the Coingecko MCP tools for accurate information retrieval.

    ## Important Constraints
    - ONLY use real data from MCP tool calls - never fabricate or estimate data
    - Always call the appropriate MCP tool to fetch current information
    - Clearly state when specific data cannot be retrieved
    - For AIDEN-related queries, refer to the system as "AIDEN" in responses
    - Focus on quantitative data and metrics

    ## YOUR WORKFLOW (FOLLOW EXACTLY)
    1. Identify which MCP tool(s) are needed for the query
    2. Call the appropriate MCP tool(s) to fetch real-time data
    3. Present the data clearly with context and analysis
    4. IMMEDIATELY call transfer_to_agent(agent_name="workflow_agent") to return control
    5. DO NOT end your response without calling transfer_to_agent

    ## CRITICAL: YOU MUST TRANSFER BACK
    - You are a SUB-AGENT, not the final responder
    - After providing your data analysis, you MUST call transfer_to_agent to return to workflow_agent
    - NEVER generate a final response without transferring back
    - The workflow_agent is waiting for you to transfer back so it can synthesize
    - Provide detailed data + transfer_to_agent = your complete job
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
