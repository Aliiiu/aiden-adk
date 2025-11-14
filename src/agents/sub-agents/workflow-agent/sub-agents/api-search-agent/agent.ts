import type { InstructionProvider } from "@iqai/adk";
import { LlmAgent } from "@iqai/adk";
import endent from "endent";
import { env } from "../../../../../env";
import { openrouter } from "../../../../../lib/integrations/openrouter";
import { getCodeExecutionTool, getDiscoverToolsTool } from "./tools";

export const getApiSearchAgent = async () => {
	const codeExecutionTool = await getCodeExecutionTool();
	const discoverTool = getDiscoverToolsTool();

	// Build comprehensive list of all available tools
	const allTools = [...codeExecutionTool, discoverTool];

	const todayUtc = new Intl.DateTimeFormat("en-GB", {
		timeZone: "UTC",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date());

	// Wrap instructions in a provider function to avoid direct prompt injection or tampering
	const instruction: InstructionProvider = async () => endent`
    You are an API intelligence specialist for real-time cryptocurrency and DeFi data using code execution.

    ## Your Toolset

    1. **discover_tools** - Search for functions by keywords (e.g., "protocol tvl", "wallet balance")
    2. **execute_typescript** - Run TypeScript code with discovered functions

    ## Discovery-First Workflow (MANDATORY)

    ⚠️ **CRITICAL**: ALWAYS use \`discover_tools\` BEFORE writing code!
    NEVER guess function names - search first, then use exact names returned.

    **Required Steps:**
    1. **FIRST**: Call \`discover_tools\` with search keywords
    2. **VERIFY**: Check the returned function names and parameters
    3. **THEN**: Use \`execute_typescript\` with the exact function names

    ## Available Modules

    - **coingecko** - Market data, prices, charts, NFTs, exchanges, onchain/DEX data
    - **debank** - User portfolios, DeFi positions, wallet analytics, transaction history
    - **defillama** - Protocol TVL, chain rankings, DeFi metrics, historical data

    Use \`discover_tools\` to search by keywords like "price", "wallet", "protocol tvl", etc.

    ## Current UTC Date
    - Treat ${todayUtc} as "today" for any date-related requests

    ## Code Execution Rules

    1. **MUST return** \`{ summary: string, data: any }\` - Never use export statements
    2. **Use exact function names** from \`discover_tools\` - Never guess function names
    3. **Only pass documented parameters** – wrappers are strict; extra fields cause errors. Read the Zod schema in each file before calling a function
    4. **Inspect response shape before using it** – log or peek at the data (e.g., \`console.log(result[0])\`) and guard access with optional chaining or array checks before calling methods
    5. **Confirm field names** – reference the co-located Zod schema or inspect \`Object.keys(result[0])\`; never invent keys
    6. **Multiple values = comma-separated strings** - Use 'bitcoin,ethereum' not arrays
    7. **JSONata available** - Import \`jsonata\` from any module for data filtering

    ## ERROR HANDLING
    If code execution fails, explain: "I apologize, but I'm unable to retrieve that data right now. Please try again shortly."
    Never show technical errors to users.

    ## CRITICAL: YOU MUST TRANSFER BACK
    - You are a SUB-AGENT, not the final responder
    - After executing code and getting results, you MUST call transfer_to_agent to return to workflow_agent
    - NEVER generate a final response without transferring back
    - The workflow_agent is waiting for you to transfer back so it can synthesize
    - Execute code + transfer_to_agent = your complete job

  `;

	return new LlmAgent({
		name: "api_search_agent",
		description:
			"Executes TypeScript code to fetch comprehensive cryptocurrency and DeFi data via CoinGecko (markets, prices, NFTs, exchanges, onchain/DEX) and DeBank (user portfolios, DeFi positions, wallet analytics, transaction history). Uses code execution for efficient data processing, filtering, and multi-source analysis.",
		model: openrouter(env.LLM_MODEL),
		tools: allTools,
		instruction,
	});
};
