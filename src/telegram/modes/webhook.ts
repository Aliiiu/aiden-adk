import { Telegraf } from "telegraf";
import { env } from "../../env.js";
import { registerCommands } from "../commands/index.js";
import { registerMessageHandlers } from "../messages.js";
import { getAgentRunner } from "../telegram-agent-runner.js";

export async function setupTelegramWebhook(): Promise<Telegraf> {
	if (!env.TELEGRAM_BOT_TOKEN) {
		throw new Error("TELEGRAM_BOT_TOKEN is required");
	}

	const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

	registerCommands(bot);
	registerMessageHandlers(bot);

	await getAgentRunner();

	console.log("📱 Telegram webhook bot initialized");

	return bot;
}
