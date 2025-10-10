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