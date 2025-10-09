import { createTool } from "@iqai/adk";
import z from "zod";

/**
 * Coingecko Tool
 *
 * Provides access to cryptocurrency market data through the Coingecko API.
 * This tool is designed for LLMs and vector search systems to select and call the
 * appropriate endpoints when handling user queries.
 *
 * ## How It Works
 * - Accepts a **free-form user query** as input
 * - Maps the query to the correct Coingecko API endpoint or a wrapped helper function
 * - Returns cryptocurrency market data such as prices, volumes, market caps, supply, and rankings
 *
 * ## Data Sources
 * - **Coingecko API v3**: https://www.coingecko.com/api/documentations/v3/swagger.json
 * - Extends the base API with **wrapper functions** (e.g., `getSimplePrice`, `getCoinsTopGainersLosers`, `getAmountOfTargetCurrency`)
 *   to simplify multi-coin queries, conversions, and aggregated analytics.
 *
 * ## Documentation Notes
 * - **Summaries**: Explain what each endpoint is for
 * - **Descriptions**: Explain how to use each endpoint
 * - **Parameters**: Define required and optional inputs for each call
 *
 * ## Important Notes
 * - Use this tool for **real-time and historical market data**
 * - Preferred for cryptocurrency analytics, rankings, and comparative metrics
 * - Not intended for exchange listings of IQ Token (use DocumentSearchTool instead)
 */
export const coingeckoTool = createTool({
  name: "coingecko",
  description: "Retrieve real-time and historical cryptocurrency data from Coingecko based on a user query, including prices, market cap, trading volumes, supply, and exchange information.",
   schema: z.object({
    query: z.string().describe("The user query for cryptocurrency data"),
   }),
  fn: async ({ query }) => {
    // Implementation to fetch data from Coingecko API based on the query
    return { data: `Fetched data for query: ${query}` };
  }
})
