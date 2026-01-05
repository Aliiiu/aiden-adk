import type { Prisma } from "@prisma/client";
import { prisma } from "../db";

export interface CreateChatParams {
	userAddress: string;
	username?: string;
	firstName?: string;
	lastName?: string;
	teamId?: number;
}

export interface CreateMessageParams {
	chatId: string | null;
	botId: string;
	userAddress: string;
	query: string;
	answer: string;
	language: string;
	duration?: number;
	metadata?: Record<string, unknown>;
	answerSources?: Array<{
		title: string;
		url?: string;
		folderId?: string;
	}>;
}

export class DbService {
	async getOrCreateBot(platformChannelId: string, platform = "telegram") {
		return await prisma.bot.upsert({
			where: { platformChannelId },
			update: { updatedAt: new Date() },
			create: {
				platformChannelId,
				platform,
				chatType: "PRIVATE",
			},
		});
	}

	async getOrCreateChat(params: CreateChatParams) {
		const existingChat = await prisma.chat.findFirst({
			where: {
				userAddress: params.userAddress,
				teamId: params.teamId,
				deleted: false,
			},
			orderBy: { updatedAt: "desc" },
		});

		if (existingChat) {
			return existingChat;
		}

		const title = params.firstName
			? `${params.firstName}${params.lastName ? ` ${params.lastName}` : ""}`
			: params.username || "New Chat";

		return await prisma.chat.create({
			data: {
				userAddress: params.userAddress,
				title,
				teamId: params.teamId,
			},
		});
	}

	async createMessage(params: CreateMessageParams) {
		const cacheExpires = new Date();
		cacheExpires.setHours(cacheExpires.getHours() + 24);

		return await prisma.message.create({
			data: {
				chatId: params.chatId,
				botId: params.botId,
				userAddress: params.userAddress,
				query: params.query,
				answer: params.answer,
				language: params.language,
				duration: params.duration,
				metadata: params.metadata
					? (params.metadata as Prisma.InputJsonValue)
					: {},
				debugOptions: {},
				cacheExpires,
				AnswerSources: params.answerSources
					? {
							create: params.answerSources,
						}
					: undefined,
			},
			include: {
				AnswerSources: true,
			},
		});
	}

	async getChatHistory(chatId: string, limit = 10) {
		return await prisma.message.findMany({
			where: { chatId },
			orderBy: { createdAt: "desc" },
			take: limit,
			include: {
				AnswerSources: true,
			},
		});
	}

	async rateMessage(messageId: number, rating: number) {
		return await prisma.message.update({
			where: { id: messageId },
			data: { rating },
		});
	}

	async getUserChats(userAddress: string, teamId?: number) {
		return await prisma.chat.findMany({
			where: {
				userAddress,
				teamId,
				deleted: false,
			},
			orderBy: { updatedAt: "desc" },
			include: {
				Messages: {
					take: 1,
					orderBy: { createdAt: "desc" },
				},
			},
		});
	}

	async deleteChat(chatId: string) {
		return await prisma.chat.update({
			where: { id: chatId },
			data: { deleted: true },
		});
	}

	async updateBotApiKey(botId: string, apiKey: string) {
		return await prisma.bot.update({
			where: { id: botId },
			data: { ownerApiKey: apiKey },
		});
	}

	async updateBotApiKeyAndTeam(botId: string, apiKey: string) {
		const team = await prisma.team.findFirst({
			where: {
				apiKeys: {
					has: apiKey,
				},
			},
		});

		if (!team) {
			return await prisma.bot.update({
				where: { id: botId },
				data: {
					ownerApiKey: apiKey,
					teamId: null,
				},
			});
		}

		return await prisma.bot.update({
			where: { id: botId },
			data: {
				ownerApiKey: apiKey,
				teamId: team.id,
			},
		});
	}

	async getTeamLinks(teamId: number) {
		const team = await prisma.team.findUnique({
			where: { id: teamId },
			select: { links: true },
		});
		return (team?.links as unknown[]) || [];
	}

	async updateTeamLinks(teamId: number, links: unknown[]) {
		return await prisma.team.update({
			where: { id: teamId },
			data: {
				links: links as Prisma.InputJsonValue[],
				logs: {
					push: {
						timestamp: new Date().toISOString(),
						actionType: "UPDATED",
						resourceType: ["links"],
						details: { source: "telegram" },
					} as Prisma.InputJsonValue,
				},
			},
		});
	}
}

export const dbService = new DbService();
