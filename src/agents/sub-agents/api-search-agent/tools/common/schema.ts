import { z } from "zod";


export const sourceParamsSchema = z.object({
  name: z.string().optional(),
  in: z.string().optional(),
  description: z.string().optional(),
  summary: z.string().optional(),
  required: z.boolean().optional(),
  type: z.string().optional(),
  enum: z.union([z.string(), z.array(z.string())]).optional(),
  items: z
    .object({
      type: z.string(),
      enum: z.union([z.string(), z.array(z.string())]).optional(),
    })
    .optional(),
});

export type SourceParams = z.infer<typeof sourceParamsSchema>;

export const sourceDocSchema = z.object({
  functionName: z.string(),
  summary: z.string(),
  description: z.string(),
  parameters: z.array(sourceParamsSchema).optional(),
  baseUrl: z.string().optional(),
  explorerUrl: z.string().optional(),
  explorerFallback: z.string().optional(),
});

export type SourceDoc = z.infer<typeof sourceDocSchema>;

export const apiDocsSchema = z.record(z.string(), sourceDocSchema);
export type ApiDocs = z.infer<typeof apiDocsSchema>;

export const apiDocsId = z.enum([
  "Coingecko",
  "DeFi Llama",
  "Debank OpenAPI",
  "Etherscan",
  "Frax",
  "ICP",
  "IqAi",
]);
export type ApiDocsId = z.infer<typeof apiDocsId>;

export const apiDocsMapSchema = z.array(
  z.object({
    id: apiDocsId,
    docs: z.string(),
  })
);

export type ApiDocsMap = z.infer<typeof apiDocsMapSchema>;
