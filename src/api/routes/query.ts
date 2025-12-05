import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../../env.js";
import { mapLanguageToCode } from "../../telegram/utils/language-mapper.js";
import { getApiAgentRunner } from "../agent-runner.js";
import { apiDb } from "../db-service.js";

interface QueryRequest {
	query: string;
	userId?: string;
	metadata?: Record<string, unknown>;
	sessionId?: string;
}

interface QueryResponse {
	success: boolean;
	data?: {
		answer: string;
		detectedLanguage: string;
		duration: number;
		messageId?: number;
		sources?: Array<{ title: string; url?: string }>;
	};
	error?: {
		code: string;
		message: string;
	};
}

export async function queryHandler(
	request: FastifyRequest<{ Body: QueryRequest }>,
	reply: FastifyReply,
): Promise<QueryResponse> {
	const startTime = Date.now();

	try {
		const { query, userId, metadata, sessionId } = request.body;

		if (!query || typeof query !== "string") {
			return reply.code(400).send({
				success: false,
				error: {
					code: "INVALID_QUERY",
					message: "Query is required and must be a string",
				},
			});
		}

		const runner = await getApiAgentRunner();

		const response = await runner.ask(query);

		const languageDetectorResponse = response.find(
			(r) => r.agent === "language_detector",
		);
		const detectedLanguage = languageDetectorResponse?.response || "English";
		const languageCode = mapLanguageToCode(String(detectedLanguage));

		const workflowAgentResponse = response.find(
			(r) => r.agent === "workflow_agent",
		)?.response;

		if (!workflowAgentResponse) {
			return reply.code(500).send({
				success: false,
				error: {
					code: "AGENT_ERROR",
					message: "Agent failed to generate a response",
				},
			});
		}

		const answer =
			typeof workflowAgentResponse === "string"
				? workflowAgentResponse
				: JSON.stringify(workflowAgentResponse, null, 2);

		const duration = Date.now() - startTime;

		let messageId: number | undefined;
		if (env.DATABASE_URL) {
			try {
				const userAddress = userId ? `api_${userId}` : "api_anonymous";

				const bot = await apiDb.getOrCreateBot("api_endpoint", "http");

				const message = await apiDb.createMessage({
					chatId: sessionId || null,
					botId: bot.id,
					userAddress,
					query,
					answer,
					language: languageCode,
					duration,
					metadata: {
						source: "http-api",
						...metadata,
					},
					answerSources: [],
				});

				messageId = message.id;
			} catch (dbError) {
				console.error("❌ Database error:", dbError);
			}
		}

		return reply.code(200).send({
			success: true,
			data: {
				answer,
				detectedLanguage: String(detectedLanguage),
				duration,
				messageId,
				sources: [],
			},
		});
	} catch (error) {
		console.error("❌ Error processing query:", error);

		return reply.code(500).send({
			success: false,
			error: {
				code: "INTERNAL_ERROR",
				message: "An unexpected error occurred while processing your request",
			},
		});
	}
}
