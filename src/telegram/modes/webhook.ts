import { Telegraf } from "telegraf";
import { env } from "../../env";
import { initializeSharedAgentBuilder } from "../../lib/agent-builder-cache";
import { createTelegramBot } from "../bot-factory";

export function setupTelegramWebhook(): Telegraf {
	return createTelegramBot();
}

export async function startWebhook(bot: Telegraf): Promise<void> {
	if (!env.TELEGRAM_WEBHOOK_URL) {
		throw new Error("TELEGRAM_WEBHOOK_URL is required for webhook mode");
	}

	await initializeSharedAgentBuilder();

	console.log("🌐 Starting webhook...");

	await bot.launch({
		webhook: {
			domain: env.TELEGRAM_WEBHOOK_URL,
			port: env.TELEGRAM_PORT || 3000,
		},
	});

	console.log("🌐 Telegram bot started in WEBHOOK mode");
}
