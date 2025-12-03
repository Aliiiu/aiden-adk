import { Telegraf } from "telegraf";
import { env } from "../../env.js";
import { getAgentRunner } from "../agent-singleton.js";
import { registerCommands } from "../commands/index.js";
import { registerMessageHandlers } from "../messages.js";

export async function startPolling(): Promise<void> {
	if (!env.TELEGRAM_BOT_TOKEN) {
		throw new Error("TELEGRAM_BOT_TOKEN is required");
	}

	const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

	console.log("📝 Registering commands...");
	registerCommands(bot);
	console.log("📝 Registering message handlers...");
	registerMessageHandlers(bot);

	await getAgentRunner();

	console.log("🚀 Launching bot...");
	await bot.launch();
	console.log("🚀 Telegram bot started in POLLING mode");
	console.log("✅ Bot is now listening for messages");

	process.once("SIGINT", () => bot.stop("SIGINT"));
	process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
