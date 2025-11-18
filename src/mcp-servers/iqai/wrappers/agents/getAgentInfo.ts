import z from "zod";
import { callIqAiApi } from "../../../iqai/make-iq-ai-request.js";

export type GetAgentInfoInput = {
	address?: string;
	ticker?: string;
};

const agentInfoSchema = z
	.object({
		id: z.string(),
		ticker: z.string(),
		name: z.string(),
		bio: z.string().optional(),
		framework: z.string().optional(),
		socials: z.any().optional(),
		isActive: z.boolean().optional(),
		governanceContract: z.string().optional(),
		tokenContract: z.string(),
		managerContract: z.string().optional(),
		poolContract: z.string().optional(),
		agentContract: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		tokenUri: z.string().optional(),
		knowledge: z.union([z.string(), z.array(z.string())]).optional(),
		model: z.any().optional(),
		category: z.string().optional(),
		currentPriceInIq: z.string().optional(), // API returns string
		inferenceCount: z.number().optional(),
		holdersCount: z.number().optional(),
		isVerified: z.boolean().optional(),
	})
	.loose();

export type GetAgentInfoResponse =
	| z.infer<typeof agentInfoSchema>
	| Array<z.infer<typeof agentInfoSchema>>;

/**
 * Get detailed profile and metadata for an agent by address or ticker.
 */
export async function getAgentInfo(
	params: GetAgentInfoInput,
): Promise<GetAgentInfoResponse> {
	const { address, ticker } = params;

	if (!address && !ticker) {
		throw new Error("Provide either 'address' or 'ticker'.");
	}

	return callIqAiApi(
		"/api/agents/info",
		{ address, ticker },
		// Endpoint can return a single agent or an array when using ticker lookup
		agentInfoSchema.or(agentInfoSchema.array()),
	);
}
