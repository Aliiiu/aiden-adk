import z from "zod"

export async function callIqAiApi<T>(
  endpoint: string,
  params: Record<string, any>,
  schema: z.ZodSchema<T>
): Promise<T> {
  const queryEntries = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([k, v]) => [k, String(v)]) as [string, string][]

  const queryString = new URLSearchParams(queryEntries).toString()

  const url = `https://app.iqai.com${endpoint}${queryString ? `?${queryString}` : ""}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  const data = await response.json()
  return schema.parse(data)
}


const agentSchema = z.object({
  ticker: z.string(),
  name: z.string(),
  isActive: z.boolean(),
  tokenContract: z.string(),
  category: z.string(),
});

const paginatedAgentResponseSchema = z.object({
  agents: z.array(agentSchema),
  pagination: z.object({
    currentPage: z.number(),
    totalPages: z.number(),
  }),
});

export type Agent = z.infer<typeof agentSchema>;

export async function getIQAiAgents() {
  const BASE_URL = "https://app.iqai.com/api/agents";
  const LIMIT = 100;

  const agentsMap = new Map<string, Agent>();
  let currentPage = 1;
  let totalPages = 1;

  try {
    do {
      const params = new URLSearchParams({
        sort: "marketCap",
        order: "desc",
        limit: LIMIT.toString(),
        page: currentPage.toString(),
      });

      const res = await fetch(`${BASE_URL}?${params.toString()}`, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        return {
          success: false,
          agents: Array.from(agentsMap.values()),
          error: `Request failed (page ${currentPage}): ${res.status} ${res.statusText}`,
        };
      }

      const json = await res.json();
      const parsed = paginatedAgentResponseSchema.safeParse(json);

      if (!parsed.success) {
        return {
          success: false,
          agents: Array.from(agentsMap.values()),
          error: `Invalid API response on page ${currentPage}`,
        };
      }

      const { agents, pagination } = parsed.data;
      totalPages = pagination.totalPages ?? currentPage;

      for (const agent of agents) {
        agentsMap.set(agent.tokenContract.toLowerCase(), agent);
      }

      currentPage++;
    } while (currentPage <= totalPages);

    return { agents: Array.from(agentsMap.values()) };
  } catch (err) {
    return {
      agents: Array.from(agentsMap.values()),
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
