import z from "zod";
import { callIqAiApi } from "../../make-iq-ai-request.js";

export type GetAgentLogsInput = {
	agentTokenContract: string;
	page?: number;
	limit?: number;
};

const agentLogsSchema = z
	.object({
		logs: z.array(
			z.object({
				id: z.string(),
				agentId: z.string(),
				content: z.string(),
				type: z.string(),
				txHash: z.string().nullable().optional(),
				chainId: z.number().nullable().optional(),
				createdAt: z.string(),
			}),
		),
		total: z.number(),
		page: z.number(),
		totalPages: z.number(),
	})
	.loose();

export type GetAgentLogsResponse = z.infer<typeof agentLogsSchema>;

/**
 * Get chronological logs and activity history for a specific agent.
 */
export async function getAgentLogs(
	params: GetAgentLogsInput,
): Promise<GetAgentLogsResponse> {
	const { agentTokenContract, page = 1, limit = 10 } = params;

	return callIqAiApi(
		"/api/logs",
		{ agentTokenContract, page, limit },
		agentLogsSchema,
	);
}
