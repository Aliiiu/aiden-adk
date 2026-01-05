import z from "zod";
import { callIqAiApi } from "../../make-iq-ai-request";

export const GetAgentLogsInputSchema = z.object({
	agentTokenContract: z
		.string()
		.describe("Agent token contract address on IQ chain (Chain ID 252)"),
	page: z.number().optional().describe("Page number (default: 1)"),
	limit: z.number().optional().describe("Results per page (default: 10)"),
});

export type GetAgentLogsInput = z.infer<typeof GetAgentLogsInputSchema>;

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
	const {
		agentTokenContract,
		page = 1,
		limit = 10,
	} = GetAgentLogsInputSchema.parse(params);

	return callIqAiApi(
		"/api/logs",
		{ agentTokenContract, page, limit },
		agentLogsSchema,
	);
}
