import { Telegraf } from "telegraf";
import { env } from "../env";
import { registerCommands } from "./commands/index";
import { registerMessageHandlers } from "./messages";

/**
 * Creates and configures a Telegram bot instance
 * This centralizes bot setup logic to ensure consistency across different entry points
 *
 * @returns Configured Telegraf bot instance
 * @throws Error if TELEGRAM_BOT_TOKEN is not provided
 */
export function createTelegramBot(): Telegraf {
	if (!env.TELEGRAM_BOT_TOKEN) {
		throw new Error("TELEGRAM_BOT_TOKEN is required");
	}

	const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

	registerCommands(bot);

	registerMessageHandlers(bot);

	return bot;
}
