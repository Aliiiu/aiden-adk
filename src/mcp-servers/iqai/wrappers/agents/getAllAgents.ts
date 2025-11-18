import z from "zod";
import { callIqAiApi } from "../../../iqai/make-iq-ai-request.js";

export type GetAllAgentsInput = {
	sort?: "latest" | "marketCap" | "holders" | "inferences";
	order?: "asc" | "desc";
	category?:
		| "OnChain"
		| "Productivity"
		| "Entertainment"
		| "Informative"
		| "Creative";
	status?: "alive" | "latent";
	chainId?: number;
	page?: number;
	limit?: number;
};

const allAgentsSchema = z
	.object({
		agents: z.array(
			z.object({
				id: z.string(),
				avatar: z.string().optional(),
				ticker: z.string(),
				name: z.string(),
				bio: z.string().optional(),
				socials: z.any().optional(),
				creatorId: z.string().optional(),
				isActive: z.boolean().optional(),
				governanceContract: z.string().optional(),
				tokenContract: z.string(),
				managerContract: z.string().optional(),
				poolContract: z.string().optional(),
				agentContract: z.string().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				tokenUri: z.string().optional(),
				knowledge: z.array(z.string()).optional(),
				model: z.any().optional(),
				category: z.string().optional(),
				currentPriceInIq: z.number().optional(),
				currentPriceInUSD: z.number().optional(),
				inferenceCount: z.number().optional(),
				holdersCount: z.number().optional(),
				framework: z.string().optional(),
				volumeAllTime: z.number().optional(),
			}),
		),
		pagination: z
			.object({
				currentPage: z.number(),
				totalPages: z.number(),
				totalCount: z.number(),
				limit: z.number(),
				hasNextPage: z.boolean(),
				hasPreviousPage: z.boolean(),
			})
			.optional(),
	})
	.loose();

export type GetAllAgentsResponse = z.infer<typeof allAgentsSchema>;

/**
 * Get a paginated, sortable, and filterable list of all IQ AI agents with metadata and contract details.
 */
export async function getAllAgents(
	params: GetAllAgentsInput = {},
): Promise<GetAllAgentsResponse> {
	const {
		sort = "marketCap",
		order = "desc",
		category,
		status,
		chainId = 252,
		page = 1,
		limit = 50,
	} = params;

	return callIqAiApi(
		"/api/agents",
		{ sort, order, category, status, chainId, page, limit },
		allAgentsSchema,
	);
}
