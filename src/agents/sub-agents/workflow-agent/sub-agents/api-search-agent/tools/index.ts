import { createTool } from "@iqai/adk";
import { z } from "zod";
import { formatData } from "@/src/lib/helpers/custom-json-formatter";
import { callIqAiApi } from "@/src/lib/helpers/make-iq-ai-request";
import { agentInfoSchema, agentLogsSchema, agentStatsSchema, allAgentsSchema, holdingsSchema, topAgentsSchema } from "./_schema";

export const getAllAgentsTool = createTool({
  name: "get_all_agents",
  description: `Retrieve a paginated, sortable, and filterable list of all IQ AI agents.

Supports:
- Sorting: by market cap (default), holders, inferences, or latest deployment
- Filtering: by category (None, OnChain, Productivity, Entertainment, Informative, Creative), status (alive/latent), chain ID
- Pagination: control page number and limit (max 100, recommended 25-30)

Returns full agent data including prices, holder counts, inference counts, contracts, and metadata.

Use this for: agent discovery dashboards, browsing interfaces, market overviews, filtered searches.`,
  schema: z.object({
    sort: z.enum(["latest", "marketCap", "holders", "inferences"]).optional().describe("Sort field (default: marketCap)"),
    order: z.enum(["asc", "desc"]).optional().describe("Sort order (default: desc)"),
    category: z.enum(["None", "OnChain", "Productivity", "Entertainment", "Informative", "Creative"]).optional().describe("Filter by category"),
    status: z.enum(["alive", "latent"]).optional().describe("Filter by agent status"),
    chainId: z.number().optional().describe("Filter by blockchain chain ID (e.g., 252)"),
    page: z.number().optional().describe("Page number for pagination (default: 1)"),
    limit: z.number().optional().describe("Agents per page, max 100 (default: 50)"),
  }),
  fn: async ({ sort, order, category, status, chainId, page, limit }): Promise<string> => {
    try {
      const response = await callIqAiApi(
        "/api/agents",
        { sort, order, category, status, chainId, page, limit },
        allAgentsSchema
      );

      if (!response.agents || response.agents.length === 0) {
        return "No agents found matching the specified criteria.";
      }

      const pagination = response.pagination;
      let result = `Total: ${pagination?.totalCount || response.agents.length} | Page: ${pagination?.currentPage || 1}/${pagination?.totalPages || 1}\n`;
      result += `Explorer: https://app.iqai.com/\n\n`;

      const headers = ["#", "name", "ticker", "category", "priceIQ", "priceUSD", "holders", "inferences"];
      const rows = response.agents.map((agent, idx: number) => [
        idx + 1,
        agent.name || "N/A",
        agent.ticker || "N/A",
        agent.category || "N/A",
        agent.currentPriceInIq?.toFixed(2) || "N/A",
        agent.currentPriceInUSD?.toFixed(4) || "N/A",
        agent.holdersCount || "N/A",
        agent.inferenceCount || "N/A",
      ]);

      result += formatData(headers, rows);

      return result;
    } catch (err) {
      return `Unable to retrieve agents: ${err instanceof Error ? err.message : "Unknown error"}.`;
    }
  },
});


export const getTopAgentsTool = createTool({
  name: "get_top_agents",
  description: `Retrieve the top-performing IQ AI agents ranked by market cap, holders, or inferences.

Returns a focused list of leading agents with:
- Token and agent contract addresses
- Current prices in IQ and USD
- Holder and inference counts
- Agent name and ticker

Use this for: leaderboards, trending agent widgets, top performer displays, quick market snapshots.`,
  schema: z.object({
    sort: z.enum(["mcap", "holders", "inferences"]).optional().describe("Ranking metric (default: mcap)"),
    limit: z.number().min(1).max(100).optional().describe("Number of agents to return, 1-100 (default: 10)"),
  }),
  fn: async ({ sort = "mcap", limit = 10 }): Promise<string> => {
    try {
      const response = await callIqAiApi(
        "/api/agents/top",
        { sort, limit },
        topAgentsSchema
      );

      if (!response.agents || response.agents.length === 0) {
        return "No top agents found.";
      }

      const headers = ["rank", "name", "ticker", "priceIQ", "priceUSD", "holders", "inferences"];
      const rows = response.agents.map((agent, idx: number) => [
        idx + 1,
        agent.name,
        agent.ticker,
        agent.currentPriceInIq?.toFixed(2) || "N/A",
        agent.currentPriceInUSD?.toFixed(4) || "N/A",
        agent.holdersCount || "N/A",
        agent.inferenceCount || "N/A",
      ]);

      return formatData(headers, rows);
    } catch (err) {
      return `Unable to retrieve top agents: ${err instanceof Error ? err.message : "Unknown error"}.`;
    }
  },
});

export const getAgentInfoTool = createTool({
  name: "get_agent_info",
  description: `Retrieve comprehensive identity and metadata for an IQ AI agent by address or ticker.

Returns complete profile including:
- Identity: name, ticker, bio, avatar (multiple sizes)
- AI config: framework, model, category, knowledge base
- Social: Discord/Telegram/Twitter prompts
- Status: verification status, active state, creator info

Note: When querying by ticker, returns an array (multiple agents can share tickers). Use market cap to identify primary project.

Use this for: profile pages, agent cards, detailed views, social bot configuration.`,
  schema: z.object({
    address: z.string().optional().describe("Token contract address of the agent"),
    ticker: z.string().optional().describe("Agent ticker symbol (may return multiple agents)"),
  }),
  fn: async ({ address, ticker }): Promise<string> => {
    try {
      if (!address && !ticker) {
        return "Error: Provide either 'address' or 'ticker' parameter.";
      }


      const response = await callIqAiApi(
        "/api/agents/info",
        { address, ticker },
        z.union([agentInfoSchema, z.array(agentInfoSchema)])
      );

      if (Array.isArray(response)) {
        if (response.length === 0) {
          return `No agents found with ticker: ${ticker}`;
        }

        let result = `Found ${response.length} agent(s) with ticker "${ticker}":\n\n`;
        const headers = ["#", "name", "ticker", "priceIQ", "verified", "tokenContract"];
        const rows = response.map((agent, idx: number) => [
          idx + 1,
          agent.name,
          agent.ticker,
          agent.currentPriceInIq?.toFixed(2) || "N/A",
          agent.isVerified ? "Yes" : "No",
          agent.tokenContract,
        ]);
        result += formatData(headers, rows);
        result += `\nNote: Use market cap to identify primary project. Query by address for full details.`;
        return result;
      }

      const headers = ["field", "value"];
      const rows = [
        ["name", response.name],
        ["ticker", response.ticker],
        ["bio", (response.bio || "N/A").substring(0, 200)],
        ["category", response.category || "N/A"],
        ["framework", response.framework || "N/A"],
        ["verified", response.isVerified ? "Yes" : "No"],
        ["active", response.isActive ? "Yes" : "No"],
        ["createdAt", response.createdAt || "N/A"],
        ["explorerUrl", `https://app.iqai.com/agents/${response.tokenContract}`],
      ];

      return formatData(headers, rows);
    } catch (err) {
      return `Unable to retrieve agent info: ${err instanceof Error ? err.message : "Unknown error"}.`;
    }
  },
});

export const getAgentStatsTool = createTool({
  name: "get_agent_stats",
  description: `Retrieve real-time market and performance statistics for an IQ AI agent.

Returns live data including:
- Pricing: current price in IQ and USD, market cap
- Performance: 24h change, total supply
- Usage: inference count, holder count
- Extended stats (address only): performance timelines (7d-1y), 24h OHLC, ATH/ATL with timestamps

Note: Ticker queries return basic stats array. Address queries support extended stats. Use market cap sorting to identify primary project when multiple agents share a ticker.

Use this for: price displays, market analytics, performance tracking, trading dashboards.`,
  schema: z.object({
    address: z.string().optional().describe("Token contract address"),
    ticker: z.string().optional().describe("Agent ticker (returns array of basic stats)"),
    extendedStats: z.boolean().optional().describe("Include ATH/ATL, timelines, 24h trading data (address only)"),
  }),
  fn: async ({ address, ticker, extendedStats }): Promise<string> => {
    try {
      if (!address && !ticker) {
        return "Error: Provide either 'address' or 'ticker' parameter.";
      }

      if (ticker && extendedStats) {
        return "Error: extendedStats only supported with address parameter.";
      }

      const response = await callIqAiApi(
        "/api/agents/stats",
        { address, ticker, extendedStats },
        z.union([agentStatsSchema, z.array(agentStatsSchema)])
      );

      if (Array.isArray(response)) {
        if (response.length === 0) {
          return `No stats found for ticker: ${ticker}`;
        }

        let result = `Stats for ${response.length} agent(s) with ticker "${ticker}":\n\n`;
        const headers = ["#", "name", "priceIQ", "priceUSD", "marketCap", "24hChg%", "holders", "inferences"];
        const rows = response.map((agent, idx: number) => [
          idx + 1,
          agent.name,
          agent.currentPriceInIq?.toFixed(2) || "N/A",
          agent.currentPriceInUSD?.toFixed(4) || "N/A",
          agent.marketCap?.toFixed(0) || "N/A",
          agent.changeIn24h?.toFixed(2) || "N/A",
          agent.holdersCount || "N/A",
          agent.inferenceCount || "N/A",
        ]);
        result += formatData(headers, rows);
        return result;
      }

      const headers = ["metric", "value"];
      const rows = [
        ["name", response.name],
        ["priceIQ", response.currentPriceInIq?.toFixed(4) || "N/A"],
        ["priceUSD", response.currentPriceInUSD?.toFixed(6) || "N/A"],
        ["marketCap", response.marketCap?.toFixed(2) || "N/A"],
        ["24hChange%", response.changeIn24h?.toFixed(2) || "N/A"],
        ["totalSupply", response.totalSupply?.toFixed(0) || "N/A"],
        ["holders", response.holdersCount || "N/A"],
        ["inferences", response.inferenceCount || "N/A"],
        ["category", response.category || "N/A"],
      ];

      let result = formatData(headers, rows);

      if (response.performanceTimeline) {
        result += `\n\nPerformance Timeline:`;
        result += `\n7d: ${response.performanceTimeline["7d"]?.toFixed(2)}% | 14d: ${response.performanceTimeline["14d"]?.toFixed(2)}%`;
        result += ` | 30d: ${response.performanceTimeline["30d"]?.toFixed(2)}% | 200d: ${response.performanceTimeline["200d"]?.toFixed(2)}%`;
        result += ` | 1y: ${response.performanceTimeline["1y"]?.toFixed(2)}%`;
      }

      if (response.tradingStats24h) {
        result += `\n\n24h Trading:`;
        result += `\nHigh: ${response.tradingStats24h.high?.toFixed(6)} | Low: ${response.tradingStats24h.low?.toFixed(6)}`;
        result += ` | Volume: ${response.tradingStats24h.volume?.toFixed(2)}`;
      }

      if (response.ath) {
        result += `\n\nAll-Time High: ${response.ath.price.toFixed(6)} (${response.ath.timestamp})`;
      }

      if (response.atl) {
        result += `\nAll-Time Low: ${response.atl.price.toFixed(6)} (${response.atl.timestamp})`;
      }

      return result;
    } catch (err) {
      return `Unable to retrieve agent stats: ${err instanceof Error ? err.message : "Unknown error"}.`;
    }
  },
});


export const getAgentLogsTool = createTool({
  name: "get_agent_logs",
  description: `Retrieve paginated activity logs for an IQ AI agent.

Returns chronological event history including:
- Log content and event type
- Transaction hashes (if applicable)
- Timestamps and agent ID
- Pagination metadata

Use this for: activity timelines, audit trails, event monitoring, transaction tracking.`,
  schema: z.object({
    agentTokenContract: z.string().describe("Token contract address of the agent (required)"),
    page: z.number().optional().describe("Page number for pagination (default: 1)"),
    limit: z.number().optional().describe("Logs per page, max 100 (default: 10)"),
  }),
  fn: async ({ agentTokenContract, page, limit }): Promise<string> => {
    try {
      const response = await callIqAiApi(
        "/api/logs",
        { agentTokenContract, page, limit },
        agentLogsSchema
      );

      if (!response.logs || response.logs.length === 0) {
        return `No activity logs found for agent ${agentTokenContract}.`;
      }

      let result = `Page ${response.page}/${response.totalPages} | Total Logs: ${response.total}\n`;
      result += `Explorer: https://app.iqai.com/agents/${agentTokenContract}/logs\n\n`;

      const headers = ["#", "type", "content", "txHash", "timestamp"];
      const rows = response.logs.map((log, idx: number) => [
        idx + 1,
        log.type,
        log.content.substring(0, 80),
        log.txHash || "N/A",
        new Date(log.createdAt).toLocaleString(),
      ]);

      result += formatData(headers, rows);

      return result;
    } catch (err) {
      return `Unable to retrieve logs: ${err instanceof Error ? err.message : "Unknown error"}.`;
    }
  },
});

export const getHoldingsTool = createTool({
  name: "get_holdings",
  description: `Fetch AI agent token holdings for a wallet address.

Returns portfolio of agent tokens including:
- Token contract addresses
- Token amounts held
- Agent names
- Current USD prices

Filtered to known IQ AI agent tokens only.

Use this for: portfolio displays, wallet analysis, holdings tracking, valuation calculations.`,
  schema: z.object({
    address: z.string().describe("Wallet address to query (required)"),
    chainId: z.string().optional().describe("Chain ID of the agent").default("252"),
  }),
  fn: async ({ address, chainId = "252" }): Promise<string> => {
    try {
      const response = await callIqAiApi(
        "/api/holdings",
        { address, chainId },
        holdingsSchema
      );

      if (response.count === 0) {
        return `No agent token holdings found for address ${address}.`;
      }

      let result = `Holdings for ${address} (Chain: ${chainId})\n`;
      result += `Total Agent Tokens: ${response.count}\n\n`;

      const headers = ["#", "agent", "amount", "priceUSD", "valueUSD"];
      const rows = response.holdings.map((holding, idx: number) => {
        const amount = parseFloat(holding.tokenAmount);
        const value = amount * holding.currentPriceInUsd;
        return [
          idx + 1,
          holding.name,
          amount.toFixed(4),
          holding.currentPriceInUsd.toFixed(6),
          value.toFixed(2),
        ];
      });

      result += formatData(headers, rows);

      const totalValue = response.holdings.reduce((sum: number, h: any) =>
        sum + (parseFloat(h.tokenAmount) * h.currentPriceInUsd), 0
      );
      result += `\nTotal Portfolio Value: $${totalValue.toFixed(2)} USD`;

      return result;
    } catch (err) {
      return `Unable to retrieve holdings: ${err instanceof Error ? err.message : "Unknown error"}.`;
    }
  },
});


export const iqAITools = [
  getAllAgentsTool,
  getTopAgentsTool,
  getAgentInfoTool,
  getAgentStatsTool,
  getAgentLogsTool,
  getHoldingsTool,
];
