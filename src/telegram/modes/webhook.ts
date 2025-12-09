import { Telegraf } from "telegraf";
import { env } from "../../env";
import { registerCommands } from "../commands/index";
import { registerMessageHandlers } from "../messages";
import { getAgentRunner } from "../telegram-agent-runner";

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

export async function startWebhook(bot: Telegraf): Promise<void> {
	if (!env.TELEGRAM_WEBHOOK_URL) {
		throw new Error("TELEGRAM_WEBHOOK_URL is required for webhook mode");
	}

	console.log("🌐 Starting webhook...");

	await bot.launch({
		webhook: {
			domain: env.TELEGRAM_WEBHOOK_URL,
			port: env.TELEGRAM_PORT || 3000,
		},
	});

	console.log("🌐 Telegram bot started in WEBHOOK mode");
}
