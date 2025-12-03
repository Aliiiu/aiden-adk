import type { Context } from "telegraf";
import { env } from "../env.js";
import { getAgentRunner } from "./agent-singleton.js";
import { telegramDb } from "./db-service.js";
import { mapLanguageToCode } from "./utils/language-mapper.js";

const MESSAGE_FOOTER = '\n\n🧠 Powered by <a href="https://aiden.id">AIDEN</a>';
const MAX_MESSAGE_LENGTH = 4000;

export async function processQuery(ctx: Context, query: string): Promise<void> {
	const startTime = Date.now();

	try {
		await ctx.sendChatAction("typing");

		const runner = await getAgentRunner();
		const response = await runner.ask(query);

		const languageDetectorResponse = response.find(
			(r) => r.agent === "language_detector",
		);
		const detectedLanguage = languageDetectorResponse?.response || "English";
		console.log("🌐 Detected language:", detectedLanguage);

		const languageCode = mapLanguageToCode(String(detectedLanguage));
		console.log("🔤 Language code:", languageCode);

		const workflowAgentResponse = response.find(
			(r) => r.agent === "workflow_agent",
		)?.response;

		if (workflowAgentResponse) {
			const replyText =
				typeof workflowAgentResponse === "string"
					? workflowAgentResponse
					: JSON.stringify(workflowAgentResponse, null, 2);

			const duration = Date.now() - startTime;

			if (env.DATABASE_URL && ctx.from && ctx.chat) {
				try {
					const platformChannelId = String(ctx.chat.id);
					const userAddress = `telegram_${ctx.from.id}`;

					console.log("[handleMessage] platformChannelId:", platformChannelId);
					console.log("[handleMessage] ctx.chat.id:", ctx.chat.id);
					console.log("[handleMessage] ctx.from.id:", ctx.from.id);

					const bot = await telegramDb.getOrCreateBot(platformChannelId);
					console.log("[handleMessage] Bot retrieved:", {
						botId: bot.id,
						platformChannelId: bot.platformChannelId,
						teamId: bot.teamId,
						ownerApiKey: bot.ownerApiKey ? "SET" : "NOT SET",
					});

					await telegramDb.createMessage({
						chatId: null,
						botId: bot.id,
						userAddress,
						query,
						answer: replyText,
						language: languageCode,
						duration,
						metadata: {
							botData: {
								source: "telegram",
								platformChannelId,
							},
						},
						answerSources: [],
					});
					console.log("✅ Message saved to database");
				} catch (dbError) {
					console.error("❌ Database error:", dbError);
				}
			}

			await sendLongMessage(ctx, replyText + MESSAGE_FOOTER);
		} else {
			await ctx.reply("I'm sorry, I couldn't process your request.");
		}
	} catch (error) {
		console.error("Error processing message:", error);
		await ctx.reply(
			"Sorry, something went wrong while processing your request.",
		);
	}
}

async function sendLongMessage(ctx: Context, text: string): Promise<void> {
	const options = {
		parse_mode: "HTML" as const,
		disable_web_page_preview: true,
	};

	if (text.length > MAX_MESSAGE_LENGTH) {
		const chunks =
			text.match(new RegExp(`.{1,${MAX_MESSAGE_LENGTH}}`, "g")) || [];
		for (const chunk of chunks) {
			await ctx.reply(chunk, options);
		}
	} else {
		await ctx.reply(text, options);
	}
}
