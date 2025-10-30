import { LlmAgent } from "@iqai/adk";
import endent from "endent";
import { env } from "../../../../../env";
import { openrouter } from "../../../../../lib/integrations/openrouter";
import {
	getCoingeckoTools,
	getDebankToolsViaMcp,
	getDefillamaToolsViaMcp,
} from "./tools";

export const getApiSearchAgent = async () => {
	const coingeckoTools = await getCoingeckoTools();
	const defillamaTools = await getDefillamaToolsViaMcp();
	const debankTools = await getDebankToolsViaMcp();

	// Build comprehensive list of all available tools
	const allTools = [...coingeckoTools, ...defillamaTools, ...debankTools];

	const todayUtc = new Intl.DateTimeFormat("en-GB", {
		timeZone: "UTC",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date());

	const instruction = endent`
    You are an API intelligence specialist for real-time cryptocurrency and DeFi data.

    ## PRIMARY RULE: ONLY USE AVAILABLE TOOLS
    **CRITICAL**: You can ONLY call tools that exist in your tools list.
    **NEVER** invent, guess, or hallucinate tool names.

    ## Tool Usage Protocol
    - Read the tool list before calling anything.
    - Only call tools whose name exactly matches an entry in the list (case-sensitive, no dotted namespaces).
    - If the required capability is missing, explain the limitation instead of constructing a new tool name.

    Available tool count:
    - CoinGecko tools: ${coingeckoTools.length}
    - DefiLlama tools: ${defillamaTools.length}
    - DeBank tools: ${debankTools.length}
    Total: ${allTools.length} tools

    ## Current UTC Date
    - Treat ${todayUtc} as "today" for any tool requiring a date input.

    If you're not sure a tool exists:
    1. Check the tool list carefully
    2. Use the closest matching tool
    3. If no suitable tool exists, explain you cannot retrieve that specific data

    **DO NOT** call non-existent tools like:
    - Any tool name you think "should" exist but isn't in your list

    ## Primary Expertise Areas
    - Process user requests related to cryptocurrency data and DeFi metrics
    - Utilize CoinGecko MCP tools for cryptocurrency prices, market data, and trending coins
    - Utilize DefiLlama MCP tools for:
      * Protocol TVL (Total Value Locked) data across chains
      * DEX volume and trading data
      * Protocol fees and revenue metrics
      * Stablecoin circulation and price data
      * Bridge volume and transaction data
      * Yield farming pool data and APY information
      * Options protocol data
      * Historical price and chart data
      * Cross-chain metrics and comparisons
    - Utilize DeBank MCP tools for:
      * User-specific blockchain data and portfolios
      * Chain information and supported networks
      * Protocol positions and user balances
      * Token holdings across multiple chains
      * NFT collections and holdings
      * Transaction history and authorizations
      * Gas prices for transaction optimization
      * Transaction simulation and explanation
      * Top holders of protocols and tokens
      * Historical token prices

    ## ERROR HANDLING
    If a tool returns an "error" field, respond: "I apologize, but I'm unable to retrieve that data right now. Please try again shortly."
    Never show technical errors to users.

    ## CRITICAL: YOU MUST TRANSFER BACK
    - You are a SUB-AGENT, not the final responder
    - After providing your data analysis, you MUST call transfer_to_agent to return to workflow_agent
    - NEVER generate a final response without transferring back
    - The workflow_agent is waiting for you to transfer back so it can synthesize
    - Provide detailed data + transfer_to_agent = your complete job

  `;

	return new LlmAgent({
		name: "api_search_agent",
		description:
			"Fetches real-time cryptocurrency prices, DeFi metrics, user portfolios, and blockchain data via MCP APIs including CoinGecko, DefiLlama, and DeBank",
		model: openrouter(env.LLM_MODEL),
		tools: allTools,
		instruction,
	});
};
