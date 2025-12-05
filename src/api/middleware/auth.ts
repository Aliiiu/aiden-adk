import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/db.js";

declare module "fastify" {
	interface FastifyRequest {
		team?: {
			id: number;
			apiKeys: string[];
		};
	}
}

export async function authMiddleware(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const apiKey = request.headers["x-api-key"] as string;

	if (!apiKey) {
		return reply.code(401).send({
			success: false,
			error: {
				code: "MISSING_API_KEY",
				message: "API key is required in X-API-Key header",
			},
		});
	}

	try {
		const team = await prisma.team.findFirst({
			where: {
				apiKeys: {
					has: apiKey,
				},
			},
		});

		if (!team) {
			return reply.code(403).send({
				success: false,
				error: {
					code: "INVALID_API_KEY",
					message: "Invalid API key",
				},
			});
		}

		request.team = team;
	} catch (error) {
		console.error("❌ Auth error:", error);
		return reply.code(500).send({
			success: false,
			error: {
				code: "AUTH_ERROR",
				message: "Authentication failed",
			},
		});
	}
}
