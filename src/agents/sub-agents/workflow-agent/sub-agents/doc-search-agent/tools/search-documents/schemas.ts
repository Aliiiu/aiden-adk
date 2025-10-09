import * as z from "zod";

export const searchInputSchema = z.object({
	query: z
		.string()
		.describe(
			"The search query to find relevant information in the knowledge base",
		),
});

export const searchResponseSchema = z.object({
	data: z
		.object({
			search: z.object({
				suggestions: z.array(
					z.object({
						id: z.string(),
						title: z.string(),
						metadata: z
							.array(
								z.object({
									url: z.string(),
									title: z.string(),
								}),
							)
							.nullish(),
					}),
				),
				wikiContents: z.array(
					z.object({
						title: z.string(),
						content: z.string(),
					}),
				),
				learnDocs: z
					.array(
						z.object({
							title: z.string(),
							content: z.string(),
						}),
					)
					.nullish(),
			}),
		})
		.nullish(),
});

export type SearchInput = z.infer<typeof searchInputSchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;
